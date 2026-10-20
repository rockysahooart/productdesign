"""Minimal Chrome DevTools Protocol driver, standard library only.

The repo has no package manager, so the test harness cannot lean on
Playwright or Puppeteer. This launches the local Google Chrome headless,
speaks CDP over a hand-rolled WebSocket, and exposes just what the checks
in tools/check.py need: viewport and media emulation, a script injected
before any page script runs, evaluate, screenshots, and a log of console
errors and 4xx/5xx responses.
"""

import base64
import json
import os
import shutil
import socket
import struct
import subprocess
import tempfile
import time
import urllib.request

CHROME = os.environ.get(
    'CHROME', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')


class WS:
    def __init__(self, url):
        assert url.startswith('ws://')
        hostport, path = url[5:].split('/', 1)
        host, port = hostport.split(':')
        self.s = socket.create_connection((host, int(port)))
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall((
            'GET /%s HTTP/1.1\r\nHost: %s\r\nUpgrade: websocket\r\n'
            'Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n'
            'Sec-WebSocket-Version: 13\r\n\r\n' % (path, hostport, key)).encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.s.recv(4096)
        head, self.buf = buf.split(b'\r\n\r\n', 1)
        assert b' 101 ' in head.split(b'\r\n')[0], head

    def send(self, text):
        data = text.encode()
        n = len(data)
        hdr = bytes([0x81])
        if n < 126:
            hdr += bytes([0x80 | n])
        elif n < 65536:
            hdr += bytes([0x80 | 126]) + struct.pack('>H', n)
        else:
            hdr += bytes([0x80 | 127]) + struct.pack('>Q', n)
        mask = os.urandom(4)
        self.s.sendall(hdr + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(data)))

    def _read(self, n):
        while len(self.buf) < n:
            chunk = self.s.recv(1 << 20)
            if not chunk:
                raise EOFError
            self.buf += chunk
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def recv(self):
        msg = b''
        while True:
            b0, b1 = self._read(2)
            n = b1 & 0x7F
            if n == 126:
                n = struct.unpack('>H', self._read(2))[0]
            elif n == 127:
                n = struct.unpack('>Q', self._read(8))[0]
            payload = self._read(n)
            op = b0 & 0x0F
            if op == 0x9:      # ping: answer and keep reading
                continue
            msg += payload
            if b0 & 0x80:
                return msg.decode('utf-8', 'replace')


class Browser:
    def __init__(self, port=9333):
        self.dir = tempfile.mkdtemp(prefix='pf-cdp-')
        self.proc = subprocess.Popen(
            [CHROME, '--headless=new', '--remote-debugging-port=%d' % port,
             '--user-data-dir=' + self.dir, '--no-first-run',
             '--no-default-browser-check', '--hide-scrollbars', 'about:blank'],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(100):
            try:
                tabs = json.load(urllib.request.urlopen(
                    'http://127.0.0.1:%d/json/list' % port))
                page = [t for t in tabs if t['type'] == 'page'][0]
                break
            except Exception:
                time.sleep(0.1)
        self.ws = WS(page['webSocketDebuggerUrl'])
        self.id = 0
        self.events = []
        self.errors = []
        for m in ('Page.enable', 'Runtime.enable', 'Network.enable', 'Log.enable'):
            self.call(m)

    def _event(self, m):
        meth, p = m.get('method'), m.get('params', {})
        if meth == 'Runtime.exceptionThrown':
            self.errors.append('exception: ' + p['exceptionDetails'].get('text', '') +
                               ' ' + json.dumps(p['exceptionDetails'].get('exception', {}).get('description', ''))[:300])
        elif meth == 'Runtime.consoleAPICalled' and p.get('type') == 'error':
            self.errors.append('console.error: ' + ' '.join(
                str(a.get('value', a.get('description', ''))) for a in p['args'])[:300])
        elif meth == 'Network.responseReceived' and p['response']['status'] >= 400:
            self.errors.append('%d %s' % (p['response']['status'], p['response']['url']))
        elif meth == 'Network.loadingFailed' and not p.get('canceled'):
            self.errors.append('failed %s' % p.get('errorText'))
        self.events.append(meth)

    def call(self, method, **params):
        self.id += 1
        my = self.id
        self.ws.send(json.dumps({'id': my, 'method': method, 'params': params}))
        while True:
            m = json.loads(self.ws.recv())
            if m.get('id') == my:
                if 'error' in m:
                    raise RuntimeError('%s: %s' % (method, m['error']))
                return m.get('result', {})
            self._event(m)

    def pump(self, seconds):
        """Wait while still draining events (console, network)."""
        end = time.time() + seconds
        self.ws.s.settimeout(0.05)
        try:
            while time.time() < end:
                try:
                    self._event(json.loads(self.ws.recv()))
                except (socket.timeout, BlockingIOError):
                    pass
        finally:
            self.ws.s.settimeout(None)

    def eval(self, expr, await_promise=True):
        r = self.call('Runtime.evaluate', expression=expr, returnByValue=True,
                      awaitPromise=await_promise)
        if 'exceptionDetails' in r:
            raise RuntimeError(r['exceptionDetails'])
        return r['result'].get('value')

    def viewport(self, w, h, dark=False, reduced=False):
        self.call('Emulation.setDeviceMetricsOverride', width=w, height=h,
                  deviceScaleFactor=1, mobile=False)
        self.call('Emulation.setEmulatedMedia', features=[
            {'name': 'prefers-color-scheme', 'value': 'dark' if dark else 'light'},
            {'name': 'prefers-reduced-motion', 'value': 'reduce' if reduced else 'no-preference'}])

    def preload(self, source):
        return self.call('Page.addScriptToEvaluateOnNewDocument', source=source)['identifier']

    def unpreload(self, ident):
        self.call('Page.removeScriptToEvaluateOnNewDocument', identifier=ident)

    def goto(self, url, settle=0.5):
        self.errors = []
        self.call('Page.navigate', url=url)
        self.pump(settle)

    def screenshot(self, path):
        data = self.call('Page.captureScreenshot', format='png')['data']
        with open(path, 'wb') as f:
            f.write(base64.b64decode(data))

    def close(self):
        try:
            self.call('Browser.close')
        except Exception:
            pass
        try:
            self.proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            self.proc.kill()
            self.proc.wait(timeout=10)
        shutil.rmtree(self.dir, ignore_errors=True)

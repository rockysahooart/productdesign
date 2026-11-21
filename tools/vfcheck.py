"""VFINAL acceptance harness (handoff 08), standard library only. Serves the working tree, drives headless Chrome
over CDP (tools/cdp.py) and exits non-zero on any failure.

    python3 tools/vfcheck.py [sweep theme loading keys motion links] [--shots DIR]

sweep    every route x 390/768/1024/1440/1920/2560 x light/dark: zero console errors, zero 4xx, no horizontal
         overflow, no request leaving this origin, one h1, Odia name with lang="or"
theme    fresh visit dark (owner 2026-11-21) under OS dark and light; toggle -> light persists across reload; back to dark
loading  first visit: Loading over an inert Landing, hands off by the cap (<= 9.5s incl. fade), once per tab; Escape skips
keys     Landing / case / About: 40 Tab stops each, every stop visible with a focus indicator, none inside inert
motion   reduced motion: Landing renders; pause control holds every animation and survives reload
links    case prev/next ring, SBL resource links (new tab), verified external destinations, Natera only where allowed
"""

import http.server
import json
import os
import socketserver
import sys
import threading
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cdp import Browser  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8765
BASE = 'http://127.0.0.1:%d/' % PORT
ROUTES = ['', '#/about', '#/carry', '#/optiflow', '#/specimen', '#/audit', '#/sbl', '#/craigslist']
WIDTHS = [(390, 844), (768, 1024), (1024, 768), (1440, 900), (1920, 1080), (2560, 1440)]
FAIL = []


def fail(msg):
    FAIL.append(msg)
    print('  FAIL', msg)


def serve():
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=ROOT, **k)

        def log_message(self, *a):
            pass
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), H)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


class B(Browser):
    def __init__(self):
        super().__init__(port=9470)
        self.urls = []
        # headless windows are never "focused", which would keep :focus / :focus-visible from ever matching
        self.call('Emulation.setFocusEmulationEnabled', enabled=True)

    def _event(self, m):
        if m.get('method') == 'Network.requestWillBeSent':
            self.urls.append(m['params']['request']['url'])
        super()._event(m)


def visit(b, w, h, route, theme='light', seen=True, dark_os=False, reduced=False, settle=2.5):
    b.viewport(w, h, dark=dark_os, reduced=reduced)
    b.goto(BASE + 'vf/', 0.1)
    b.eval("localStorage.clear();sessionStorage.clear();document.cookie='vf-seen=; path=/; max-age=0';%s%s" % (
        "localStorage.setItem('pf-theme','%s');" % theme,
        "sessionStorage.setItem('vf-seen','1');" if seen else ''))
    b.urls = []
    b.goto(BASE + route, settle)


def sweep(b, shots):
    print('sweep')
    for w, h in WIDTHS:
        for r in ROUTES:
            for t in ('light', 'dark'):
                visit(b, w, h, r, t)
                m = b.eval("""({sw:document.documentElement.scrollWidth,iw:innerWidth,h1:document.querySelectorAll('#vf h1').length,
                  or:[...document.querySelectorAll('#vf [lang=or]')].every(e=>e.textContent.trim()==='ସାର୍ଥକ ସାହୁ')&&document.querySelectorAll('#vf [lang=or]').length>0,
                  dark:!!document.querySelector('#vf .root.t-dark')===(document.documentElement.dataset.theme==='dark'),
                  ready:document.documentElement.dataset.vf})""")
                tag = '%d %s %s' % (w, r or '/', t)
                if b.errors:
                    fail('%s errors %s' % (tag, b.errors[:3]))
                if m['sw'] > m['iw']:
                    fail('%s overflow %d > %d' % (tag, m['sw'], m['iw']))
                if m['h1'] != 1:
                    fail('%s h1 count %d' % (tag, m['h1']))
                if not m['or']:
                    fail('%s Odia name missing or altered' % tag)
                if not m['dark'] or m['ready'] != 'ready':
                    fail('%s theme/ready %s' % (tag, m))
                ext = [u for u in b.urls if not u.startswith(BASE) and not u.startswith(('data:', 'blob:', 'about:'))]
                if ext:
                    fail('%s external requests %s' % (tag, ext[:3]))
                if shots and r in ('', '#/about', '#/carry') and w in (390, 1440, 2560):
                    import base64
                    hh = min(b.eval('document.documentElement.scrollHeight'), 4000)
                    d = b.call('Page.captureScreenshot', format='png', captureBeyondViewport=True,
                               clip={'x': 0, 'y': 0, 'width': w, 'height': hh, 'scale': 1 if w <= 1440 else .5})['data']
                    os.makedirs(shots, exist_ok=True)
                    open(os.path.join(shots, '%d-%s-%s.png' % (w, (r or 'home').strip('#/'), t)), 'wb').write(base64.b64decode(d))


def theme(b, _):
    print('theme')
    for dark_os in (True, False):
        b.viewport(1440, 900, dark=dark_os)
        b.goto(BASE + 'vf/', 0.1)
        b.eval('localStorage.clear();sessionStorage.setItem("vf-seen","1")')
        b.goto(BASE, 2)
        if b.eval('document.documentElement.dataset.theme') != 'dark' or not b.eval("!!document.querySelector('#vf .root.t-dark')"):
            fail('fresh visit not dark (OS dark=%s)' % dark_os)
    b.eval("document.querySelector('.vf-tg').click()")
    b.pump(2.5)
    if not b.eval("!!document.querySelector('#vf .root.t-light')"):
        fail('toggle did not switch to light')
    b.goto(BASE + '#/carry', 2.5)
    if b.eval("localStorage.getItem('pf-theme')") != 'light' or b.eval("!!document.querySelector('#vf .root.t-dark')"):
        fail('light not persisted to case page')
    b.eval("document.querySelector('.vf-tg').click()")
    b.pump(2.5)
    if not b.eval("!!document.querySelector('#vf .root.t-dark')"):
        fail('toggle back to dark failed')


def loading(b, _):
    print('loading')
    for w, h in ((1440, 900), (390, 844), (2560, 1440)):
        visit(b, w, h, '', seen=False, settle=1.0)
        t0 = time.time()
        if not b.eval("!!document.getElementById('vf-loading')&&document.getElementById('vf').hasAttribute('inert')"):
            fail('%d Loading not shown over inert Landing' % w)
        gone = None
        while time.time() - t0 < 11:
            b.pump(0.2)
            if not b.eval("!!document.getElementById('vf-loading')"):
                gone = time.time() - t0 + 1.0
                break
        if gone is None or gone > 9.8:
            fail('%d Loading hand-off at %s s' % (w, gone))
        if b.eval("document.getElementById('vf').hasAttribute('inert')"):
            fail('%d Landing still inert' % w)
        b.eval("sessionStorage.clear()")  # a new tab in the same browser session
        b.goto(BASE, 2)
        if b.eval("!!document.getElementById('vf-loading')"):
            fail('%d Loading replayed in the same browser session' % w)
    visit(b, 1440, 900, '', seen=False, settle=0.15)  # skip before the board has mounted
    b.call('Input.dispatchKeyEvent', type='keyDown', key='Escape', code='Escape', windowsVirtualKeyCode=27)
    b.pump(1.0)
    if b.eval("!!document.getElementById('vf-loading')"):
        fail('Escape did not skip the Loading')
    visit(b, 1440, 900, '', seen=False, reduced=True, settle=1.5)
    if b.eval("!!document.getElementById('vf-loading')"):
        fail('reduced motion: Loading not handed off quickly')


def keys(b, _):
    print('keys')
    for w, h in ((1440, 900), (390, 844)):
        for r in ('', '#/carry', '#/about'):
            visit(b, w, h, r)
            for i in range(40):
                b.call('Input.dispatchKeyEvent', type='keyDown', key='Tab', code='Tab', windowsVirtualKeyCode=9)
                b.call('Input.dispatchKeyEvent', type='keyUp', key='Tab', code='Tab', windowsVirtualKeyCode=9)
                b.pump(0.05)
                m = b.eval("""(()=>{let e=document.activeElement;
                  /* focus inside a live artifact frame: the indicator is the slot's (or the frame's) ring */
                  if(e&&e.tagName==='IFRAME'){const s=e.closest('.pf-live,.pf-prev')||e;const c=getComputedStyle(s);
                    return {t:'IFRAME in '+s.className,ring:c.outlineStyle!=='none'&&parseFloat(c.outlineWidth)>0,vis:s.getBoundingClientRect().width>0,inert:!!s.closest('[inert],[aria-hidden=true]')};}
                  if(!e||e===document.body)return null;const cs=getComputedStyle(e),r=e.getBoundingClientRect();
                  return {t:e.tagName+'.'+(e.className&&e.className.baseVal===undefined?e.className:'').toString().slice(0,30)+' '+(e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,30),
                    ring:(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)||cs.boxShadow!=='none',
                    vis:r.width>0&&r.height>0&&cs.visibility!=='hidden',inert:!!e.closest('[inert],[aria-hidden=true]')}})()""")
                if not m:
                    continue
                tag = '%d %s tab %d %s' % (w, r or '/', i, m['t'])
                if not m['ring']:
                    fail(tag + ' no focus indicator')
                if not m['vis']:
                    fail(tag + ' invisible')
                if m['inert']:
                    fail(tag + ' inside inert/aria-hidden')


def motion(b, _):
    print('motion')
    visit(b, 1440, 900, '', reduced=True)
    if b.errors or b.eval("document.documentElement.dataset.vf") != 'ready':
        fail('reduced motion landing %s' % b.errors[:2])
    visit(b, 1440, 900, '')
    b.eval("document.querySelector('.vf-motion').click()")
    b.pump(0.3)
    st = b.eval("[...new Set(document.getAnimations().map(a=>getComputedStyle(a.effect.target).animationPlayState))]")
    if st and st != ['paused']:
        fail('pause left animations running %s' % st)
    b.goto(BASE, 2.5)
    if not b.eval("document.documentElement.classList.contains('vf-still')"):
        fail('pause not persisted')
    # script-driven loops: a frame loop, a timer chain and an interval all hold while paused and continue on play
    b.eval("window.__n={r:0,t:0,i:0};(function L(){__n.r++;requestAnimationFrame(L)})();(function T(){__n.t++;setTimeout(T,50)})();setInterval(()=>__n.i++,50)")
    b.pump(0.5)
    a = b.eval('JSON.stringify(__n)')
    b.pump(1)
    if a != b.eval('JSON.stringify(__n)'):
        fail('script loops ran while paused')
    b.eval("document.querySelector('.vf-motion').click();localStorage.removeItem('vf-motion')")
    b.pump(0.5)
    if a == b.eval('JSON.stringify(__n)'):
        fail('script loops did not resume')


def links(b, _):
    print('links')
    ring = ['carry', 'optiflow', 'specimen', 'audit', 'sbl', 'craigslist']
    for i, k in enumerate(ring):
        visit(b, 1440, 900, '#/' + k, settle=2)
        pn = b.eval("[...document.querySelectorAll('nav.pn a')].map(a=>a.getAttribute('href'))")
        want = ['#/' + ring[i - 1], '#/' + ring[(i + 1) % 6]]
        if not all(x in pn for x in want):
            fail('%s prev/next %s, want %s' % (k, pn, want))
        if b.eval("document.body.innerText.indexOf('Natera')") >= 0:
            fail('%s shows Natera' % k)
    visit(b, 1440, 900, '#/sbl', settle=2)
    sbl = b.eval("[...document.querySelectorAll('#vf a[target=_blank]')].map(a=>a.href)")
    for u in ('https://rockysahooart.github.io/sbl-lending-console-demo/', 'https://github.com/rockysahooart/sbl-lending-console-demo',
              'https://spiky-experiences-472785.framer.app/case-study'):
        if u not in sbl:
            fail('SBL link missing ' + u)
    visit(b, 1440, 900, '')
    hrefs = b.eval("[...document.querySelectorAll('#vf a[href]')].map(a=>a.getAttribute('href'))")
    for u in ('#/craigslist', '#/carry', '#/specimen', '#/optiflow', '#/audit', '#/sbl', './slop-audit.pdf',
              'https://rockysahooart.github.io/encryption-coffee-shop/', 'https://spiky-experiences-472785.framer.app/scale-market'):
        if u not in hrefs:
            fail('Landing link missing ' + u)
    for u in ('https://rockysahooart.framer.website/', 'https://soundcloud.com/rocky-sahoo'):
        if u not in hrefs:
            fail('Landing nav link missing ' + u)
    bad = [h for h in hrefs if h.startswith('#p') or h.endswith('.dc.html')]
    if bad:
        fail('canvas links left %s' % bad[:5])
    if b.eval("document.body.innerText.indexOf('Natera')") >= 0:
        fail('Landing shows Natera')
    visit(b, 1440, 900, '#/about')
    ab = b.eval("[...document.querySelectorAll('#vf a[href]')].map(a=>a.getAttribute('href'))")
    for u in ('https://rockysahooart.framer.website/', 'https://soundcloud.com/rocky-sahoo', 'https://www.youtube.com/@6fut7music'):
        if u not in ab:
            fail('About link missing ' + u)
    if b.eval("[...document.querySelectorAll('#vf a[data-vf-off]')].some(a=>a.hasAttribute('href')||a.offsetParent)"):
        fail('Resume placeholder still shown')
    if b.eval("document.getElementById('vf').innerText.indexOf('my name in Odia')") < 0:
        fail('About: Odia sentence missing')
    cards = {'carry': 'How I Designed for Better Patient Recall', 'optiflow': 'How I Kept Humans in Control of AI-Assisted Clinical Billing',
             'specimen': 'How I Redesigned Oncology Specimen Kits for Safer Handling',
             'audit': 'How I Audited a Healthcare Design System for Consistency and Accessibility'}
    for k, t in cards.items():
        visit(b, 390, 844, '#/' + k, settle=2.5)
        if b.eval("document.querySelector('#vf h1').textContent.trim()") != t:
            fail('%s h1 is not the card title' % k)
        lv = b.eval("[...document.querySelectorAll('#vf h1,#vf h2,#vf h3,#vf h4,#vf [role=heading]')].filter(e=>!e.closest('[hidden],iframe')).map(e=>+(e.getAttribute('aria-level')||e.tagName[1]))")
        jumps = [(a, c) for a, c in zip(lv, lv[1:]) if c > a + 1]
        if jumps:
            fail('%s heading level skips %s' % (k, jumps[:3]))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    shots = None
    if '--shots' in sys.argv:
        shots = sys.argv[sys.argv.index('--shots') + 1]
        args = [a for a in args if a != shots]
    run = args or ['sweep', 'theme', 'loading', 'keys', 'motion', 'links']
    s = serve()
    b = B()
    try:
        for name in run:
            globals()[name](b, shots)
    finally:
        b.close()
        s.shutdown()
    print('%d failure(s)' % len(FAIL))
    sys.exit(1 if FAIL else 0)


if __name__ == '__main__':
    main()

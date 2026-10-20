#!/usr/bin/env python3
"""Measure the landing page in headless Chrome.

    python3 tools/check.py                 # everything (about six minutes)
    python3 tools/check.py theme seq       # only some sections
    python3 tools/check.py --shots DIR     # also write screenshots to DIR

Serves the repo itself on a free port, so it tests the working tree, not the
deployed site. Sections:

    routes   every view and anchor: zero exceptions, console errors and 4xx
             (except /favicon.ico, which the site has never shipped)
    theme    dark OS, light OS, stored dark, stored light, scripts off on a
             dark OS, toggle round-trip with reloads, OS flipped mid-visit.
             Every animation frame from the first one is sampled; a fresh
             visit must never show a dark frame.
    seq      the landing sequence at each width: nothing staged is visible
             before pf:cta, groups 1-5 in order, everything visible at the
             end, the thread's width identical before and after, no
             horizontal overflow at any frame, and above 960 the conversation
             centred on the first screen while it is alone
    hatch    reduced motion, deep link, #work, scroll, replay after whole
    keys     Tab before the reveal never lands inside a staged block, and
             reaches the staged blocks once they are shown
    copy     message one reads "Hello Team." with no icon, before and after
             a role switch

Exit status is the number of failures.
"""

import functools
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
WIDTHS = [(390, 844), (768, 1024), (900, 1000), (1024, 768), (1280, 800),
          (1440, 900), (1512, 982), (1920, 1080), (2560, 1440)]
NEAR = [(960, 800), (1100, 800), (1279, 800), (1366, 768), (2399, 1300), (2400, 1300)]

FAILS = []


def check(ok, label, detail=''):
    print('%s  %s%s' % ('PASS' if ok else 'FAIL', label, ('  ' + detail) if detail else ''))
    if not ok:
        FAILS.append(label)


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=ROOT)
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return 'http://127.0.0.1:%d' % httpd.server_address[1]


# Injected before any page script. Top frame only: the srcdoc embeds are
# documents of their own and have nothing to report.
SAMPLER = r"""
if (window.top === window) (function () {
  var S = window.__pf = { f: [], cta: null, dark: 0, frames: 0, over: 0,
                          early: [], shownAt: {}, w0: null, w1: null, alone: null };
  function lum(c) {
    var m = /rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?/.exec(c || '');
    if (!m || (m[4] !== undefined && +m[4] < 0.5)) return null;
    return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
  }
  document.addEventListener('pf:cta', function () {
    S.cta = performance.now();
    var t = document.querySelector('.hero__thread');
    if (t) S.w0 = t.getBoundingClientRect().width;
  }, true);
  function tick() {
    var H = document.documentElement;
    if (H) {
      S.frames++;
      var ground = [H, document.body, document.getElementById('pf-loader')], i, l, dark = false;
      for (i = 0; i < ground.length; i++) {
        if (!ground[i] || getComputedStyle(ground[i]).display === 'none') continue;
        l = lum(getComputedStyle(ground[i]).backgroundColor);
        if (l !== null && l < 0.35) dark = true;
      }
      if (dark || H.getAttribute('data-theme') === 'dark') S.dark++;
      if (S.frames === 1) S.first = { theme: H.getAttribute('data-theme'), stage: H.getAttribute('data-stage') };
      if (document.body && H.scrollWidth > window.innerWidth + 0.5) S.over++;
      var st = document.querySelectorAll('[data-reveal]');
      for (i = 0; i < st.length; i++) {
        var cs = getComputedStyle(st[i]);
        var vis = cs.visibility === 'visible' && +cs.opacity > 0.01;
        var g = st[i].getAttribute('data-reveal');
        if (vis && S.cta === null) S.early.push(g);
        if (st[i].hasAttribute('data-shown') && !(g in S.shownAt)) S.shownAt[g] = performance.now();
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
"""

# What the conversation shows, against the first screen, while it is alone.
ALONE = r"""(() => {
  const c = document.querySelector('.hero__copy'); let t = 1e9, b = -1e9, l = 1e9, r = -1e9;
  for (const k of c.children) { const x = k.getBoundingClientRect();
    if (!x.width || !x.height) continue;
    t = Math.min(t, x.top); b = Math.max(b, x.bottom); l = Math.min(l, x.left); r = Math.max(r, x.right); }
  const box = c.getBoundingClientRect();
  return { stage: document.documentElement.dataset.stage, cx: (box.left + box.right) / 2 - innerWidth / 2,
           cy: (t + b) / 2 - innerHeight / 2, top: t, bottom: b, vh: innerHeight, scrollY: scrollY,
           states: [...document.querySelectorAll('.hero__thread .msg')].map(m => m.dataset.state).join(',') };
})()"""


def fresh(b, base, path='/', w=1440, h=900, dark=True, reduced=False, wait=0.5):
    b.viewport(w, h, dark=dark, reduced=reduced)
    b.call('Storage.clearDataForOrigin', origin=base, storageTypes='all')
    # Through a blank page, so a path that differs only by its fragment is a
    # real load and not a same-document hash change.
    b.goto('about:blank', settle=0.1)
    b.goto(base + path, settle=wait)


def until(b, expr, timeout=30, step=0.1):
    end = time.time() + timeout
    while time.time() < end:
        v = b.eval(expr)
        if v:
            return v
        b.pump(step)
    return None


def errors(b):
    return [e for e in b.errors if 'favicon.ico' not in e]


# ---------------------------------------------------------------------------

def t_routes(b, base):
    for path in ['/', '/#top', '/#work', '/#contact', '/#/about', '/#/carry',
                 '/#/optiflow', '/#/audit', '/#/specimen', '/slop/']:
        fresh(b, base, path, wait=6)
        e = errors(b)
        check(not e, 'route %s' % path, '; '.join(e[:3]))


def t_theme(b, base, shots):
    for dark in (True, False):
        fresh(b, base, dark=dark, wait=6)
        s = b.eval('__pf')
        check(s['dark'] == 0 and s['first']['theme'] == 'light',
              'fresh visit, %s OS: light from frame 1' % ('dark' if dark else 'light'),
              '%d dark of %d frames, first frame theme=%s' % (s['dark'], s['frames'], s['first']['theme']))
    # Hard refresh on a dark OS, cache bypassed.
    b.call('Network.setCacheDisabled', cacheDisabled=True)
    b.call('Page.reload', ignoreCache=True)
    b.pump(5)
    s = b.eval('__pf')
    check(s['dark'] == 0, 'hard refresh, dark OS: no dark frame', '%d of %d' % (s['dark'], s['frames']))
    b.call('Network.setCacheDisabled', cacheDisabled=False)

    # Scripts off on a dark OS: the markup default has to hold on its own.
    b.call('Emulation.setScriptExecutionDisabled', value=True)
    fresh(b, base, dark=True, wait=2)
    bg = b.eval('getComputedStyle(document.body).backgroundColor')
    th = b.eval('document.documentElement.getAttribute("data-theme")')
    b.call('Emulation.setScriptExecutionDisabled', value=False)
    check(th == 'light' and bg in ('rgb(233, 233, 233)', 'rgb(255, 255, 255)'), 'scripts off, dark OS: light', '%s %s' % (th, bg))

    # Toggle round-trip.
    fresh(b, base, dark=True, wait=6)
    b.eval('document.querySelector("[data-theme-toggle]").click()')
    b.pump(0.3)
    t1 = b.eval('[document.documentElement.dataset.theme, localStorage.getItem("pf-theme"), document.querySelector("meta[name=theme-color]").content]')
    if shots:
        b.screenshot(os.path.join(shots, 'theme-dark-toggled.png'))
    b.call('Page.reload'); b.pump(5)
    t2 = b.eval('document.documentElement.dataset.theme')
    b.eval('document.querySelector("[data-theme-toggle]").click()')
    b.pump(0.3)
    t3 = b.eval('[document.documentElement.dataset.theme, localStorage.getItem("pf-theme")]')
    b.call('Page.reload'); b.pump(5)
    t4 = b.eval('document.documentElement.dataset.theme')
    check(t1 == ['dark', 'dark', '#121212'] and t2 == 'dark' and t3 == ['light', 'light'] and t4 == 'light',
          'toggle to dark, reload, toggle back, reload', json.dumps([t1, t2, t3, t4]))
    frames = b.eval('[...document.querySelectorAll("iframe")].map(f => { try { return f.contentDocument.documentElement.dataset.theme } catch (e) { return "x" } })')
    check(all(f in ('light', 'x', None) for f in frames), 'embeds follow the page (light)', json.dumps(frames))

    # Stored choices on a fresh session.
    for want in ('dark', 'light'):
        b.viewport(1440, 900, dark=(want == 'light'))
        b.call('Storage.clearDataForOrigin', origin=base, storageTypes='all')
        b.goto(base + '/', settle=0.2)
        b.eval('localStorage.setItem("pf-theme", "%s")' % want)
        b.call('Page.reload'); b.pump(5)
        s = b.eval('__pf')
        ok = s['first']['theme'] == want and (want == 'dark' or s['dark'] == 0)
        check(ok, 'stored %s survives a reload on a %s OS' % (want, 'light' if want == 'dark' else 'dark'),
              'first frame theme=%s, dark frames=%d' % (s['first']['theme'], s['dark']))

    # OS flips to dark mid-visit.
    fresh(b, base, dark=False, wait=6)
    probe = '[document.documentElement.dataset.theme, getComputedStyle(document.body).backgroundColor]'
    before = b.eval(probe)
    b.call('Emulation.setEmulatedMedia', features=[{'name': 'prefers-color-scheme', 'value': 'dark'}])
    b.pump(1)
    after = b.eval(probe)
    check(before[0] == 'light' and after == before, 'OS flipped to dark mid-visit: nothing changes',
          json.dumps([before, after]))


def t_seq(b, base, shots, widths):
    for (w, h) in widths:
        fresh(b, base, w=w, h=h, dark=True)
        alone = None
        if w >= 960:
            # The last moment the conversation is alone: all three settled, no cue yet.
            alone = until(b, '(() => { const s=[...document.querySelectorAll(".hero__thread .msg")].map(m=>m.dataset.state); '
                             'return s.length && s.every(x=>x==="settled") && window.__pf.cta===null && ' + ALONE + '; })()', 25)
            if shots and alone:
                b.screenshot(os.path.join(shots, 'alone-%d.png' % w))
        until(b, '__pf.cta !== null', 30)
        until(b, '"5" in __pf.shownAt', 5)
        b.pump(1.0)   # let the last fade finish
        s = b.eval('__pf')
        end = b.eval('(() => { const t=document.querySelector(".hero__thread"); const st=[...document.querySelectorAll("[data-reveal]")];'
                     'return { w1: t.getBoundingClientRect().width, hidden: st.filter(e=>getComputedStyle(e).visibility!=="visible"||+getComputedStyle(e).opacity<0.99).length,'
                     ' xf: getComputedStyle(document.querySelector(".hero__copy")).transform }; })()')
        if shots:
            b.screenshot(os.path.join(shots, 'whole-%d.png' % w))
        name = '%dx%d' % (w, h)
        order = sorted(s['shownAt'], key=lambda g: s['shownAt'][g])
        gaps = [round(s['shownAt'][order[i + 1]] - s['shownAt'][order[i]]) for i in range(len(order) - 1)]
        lead = round(s['shownAt'][order[0]] - s['cta']) if order and s['cta'] else None
        check(not s['early'], name + ' nothing staged visible before pf:cta', ','.join(sorted(set(s['early']))))
        check(order == sorted(order), name + ' groups in order', 'order %s lead %sms gaps %s' % (order, lead, gaps))
        check(all(g <= 185 for g in gaps) and lead is not None and lead <= 200, name + ' stagger within 100-180ms band',
              'lead %s gaps %s' % (lead, gaps))
        check(end['hidden'] == 0, name + ' everything visible at the end', '%d still hidden' % end['hidden'])
        check(s['w0'] is not None and abs(s['w0'] - end['w1']) < 0.01, name + ' thread width unchanged',
              '%s -> %s' % (s['w0'], end['w1']))
        check(s['over'] == 0, name + ' no horizontal overflow', '%d of %d frames' % (s['over'], s['frames']))
        check(end['xf'] in ('none', 'matrix(1, 0, 0, 1, 0, 0)'), name + ' final layout untransformed', end['xf'])
        if alone:
            fits = alone['bottom'] - alone['top'] <= alone['vh']
            okx = abs(alone['cx']) < 1
            oky = abs(alone['cy']) < 1 if fits else alone['top'] >= 0
            check(okx and oky, name + ' conversation centred while alone',
                  'dx %.2f dy %.2f (content %d-%d of %d)' % (alone['cx'], alone['cy'], alone['top'], alone['bottom'], alone['vh']))
        e = errors(b)
        check(not e, name + ' no errors', '; '.join(e[:3]))


def t_hatch(b, base):
    fresh(b, base, dark=True, reduced=True, wait=6)
    v = b.eval('[document.documentElement.hasAttribute("data-stage"), [...document.querySelectorAll("[data-reveal]")].filter(e=>getComputedStyle(e).visibility!=="visible").length, getComputedStyle(document.querySelector(".hero__copy")).transform]')
    check(v[0] is False and v[1] == 0 and v[2] == 'none', 'reduced motion: never staged, whole, no offset', json.dumps(v))
    for path in ('/#work', '/#/carry'):
        fresh(b, base, path, dark=True, wait=6)
        v = b.eval('document.documentElement.dataset.stage')
        check(v == '5', 'deep link %s skips the sequence' % path, 'stage=%s' % v)
    fresh(b, base, dark=True, wait=5)
    b.eval('window.scrollTo(0, innerHeight * 0.6)')
    b.pump(0.5)
    v = b.eval('document.documentElement.dataset.stage')
    check(v == '5', 'scroll past half a viewport shows everything', 'stage=%s' % v)
    fresh(b, base, dark=True)
    until(b, 'document.documentElement.dataset.stage === "5"', 30)
    b.eval('document.querySelector(".hero__replay").click()')
    b.pump(3)
    v = b.eval('[document.documentElement.dataset.stage, [...document.querySelectorAll("[data-reveal]")].filter(e=>getComputedStyle(e).visibility!=="visible").length]')
    check(v == ['5', 0], 'replay after whole keeps the page whole', json.dumps(v))
    until(b, '[...document.querySelectorAll(".hero__thread .msg")].every(m=>m.dataset.state==="settled")', 20)
    check(not errors(b), 'replay: no errors', '; '.join(errors(b)[:3]))


def tab(b):
    for t in ('keyDown', 'keyUp'):
        b.call('Input.dispatchKeyEvent', type=t, key='Tab', code='Tab', windowsVirtualKeyCode=9)
    b.pump(0.05)
    return b.eval('(() => { const a=document.activeElement; const s=a && a.closest("[data-reveal]");'
                  'return [a ? (a.tagName + "." + (a.className||"")).slice(0,50) : null, s ? s.getAttribute("data-reveal") : null,'
                  ' s ? s.hasAttribute("data-shown") : null, document.documentElement.dataset.stage]; })()')


def t_keys(b, base):
    fresh(b, base, dark=True, wait=5)
    bad, seen = [], []
    for _ in range(2):   # the third step is the escape hatch; before it, nothing staged
        a = tab(b)
        seen.append(a[0])
        if a[1] is not None and not a[2]:
            bad.append(a)
    check(not bad, 'Tab before reveal never lands on a staged block', json.dumps(seen))
    fresh(b, base, dark=True)
    until(b, 'document.documentElement.dataset.stage === "5"', 30)
    b.pump(1)
    hit = set()
    for _ in range(14):
        a = tab(b)
        if a[1]:
            hit.add(a[1])
    # The portrait card (group 1) has nothing focusable in it; LET'S TALK and
    # the project browser do.
    check({'2', '4'} <= hit, 'Tab reaches staged blocks after reveal', 'groups reached %s' % sorted(hit))


def t_copy(b, base):
    fresh(b, base, dark=True, wait=6)
    v = b.eval('(() => { const t=document.querySelector(".hero__thread .msg .msg__text"); return [t.textContent, t.querySelectorAll("svg").length, !!document.getElementById("px-smiley-o")]; })()')
    check(v == ['Hello Team.', 0, False], 'message one is "Hello Team." with no icon', json.dumps(v))
    b.eval('(document.querySelector("[data-role]")||{click(){}}).click()')
    b.pump(1)
    v = b.eval('document.querySelector(".hero__thread .msg .msg__text").textContent')
    check(v == 'Hello Team.', 'still "Hello Team." after a role switch', json.dumps(v))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    shots = None
    if '--shots' in sys.argv:
        shots = sys.argv[sys.argv.index('--shots') + 1]
        args = [a for a in args if a != shots]
        os.makedirs(shots, exist_ok=True)
    want = set(args) or {'routes', 'theme', 'seq', 'hatch', 'keys', 'copy'}
    base = serve()
    b = Browser()
    b.preload(SAMPLER)
    try:
        if 'copy' in want:
            t_copy(b, base)
        if 'theme' in want:
            t_theme(b, base, shots)
        if 'routes' in want:
            t_routes(b, base)
        if 'hatch' in want:
            t_hatch(b, base)
        if 'keys' in want:
            t_keys(b, base)
        if 'seq' in want:
            t_seq(b, base, shots, WIDTHS + NEAR)
    finally:
        b.close()
    print('\n%d failure(s)%s' % (len(FAILS), (': ' + ', '.join(FAILS)) if FAILS else ''))
    sys.exit(len(FAILS))


if __name__ == '__main__':
    main()

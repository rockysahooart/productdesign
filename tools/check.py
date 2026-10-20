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
    seq      at 960 and up, the three landing states: intro (only the
             conversation, centred), decision on pf:cta (roles, profile,
             LET'S TALK, Trusted By, logos, in order, 100-180ms apart, work
             still hidden, gate holds without a click), work on the click
             (everything, laid out exactly as an unstaged page lays it out).
             Below 960, the cascade. At every width: thread width constant,
             no horizontal overflow, no errors
    hatch    reduced motion, deep links, tablet scroll, replay while deciding
             and after work, hard refresh
    keys     Tab in each state reaches only what that state shows
    copy     message one reads "Hello Team." with no icon, before and after
             a role switch, and no smiley anywhere in the source

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
  var S = window.__pf = { cta: null, dark: 0, frames: 0, over: 0,
                          early: [], shownAt: {}, seen: {}, w0: null };
  /* What each landing state is made of, by name, so a test can ask when each
     first became visible. */
  var WATCH = { roles: '.hero-card .hero__eyebrow', who: '.hero-id--who', talk: '.hero-id--talk',
                tlbl: '.hero-trust__lbl', chips: '.hero-trust__chip', work: '.hero-card .hero__work',
                caps: '.hero-id--caps', past: '.hero__past', tools: '.hero__tools',
                background: '#background', more: '#more', contact: '#contact' };
  function lum(c) {
    var m = /rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?/.exec(c || '');
    if (!m || (m[4] !== undefined && +m[4] < 0.5)) return null;
    return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255;
  }
  function visible(el) {
    if (!el.getClientRects().length) return false;
    var cs = getComputedStyle(el);
    if (cs.visibility !== 'visible' || +cs.opacity <= 0.01) return false;
    return el.checkVisibility ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : true;
  }
  document.addEventListener('pf:cta', function () {
    if (S.cta === null) S.cta = performance.now();
    var t = document.querySelector('.hero__thread');
    if (t && S.w0 === null) S.w0 = t.getBoundingClientRect().width;
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
      if (S.frames === 1) S.first = { theme: H.getAttribute('data-theme'), stage: H.getAttribute('data-stage'),
                                      landing: H.getAttribute('data-landing') };
      if (document.body && H.scrollWidth > window.innerWidth + 0.5) S.over++;
      var st = document.querySelectorAll('[data-reveal]');
      for (i = 0; i < st.length; i++) {
        var g = st[i].getAttribute('data-reveal');
        if (S.cta === null && visible(st[i])) S.early.push(g);
        if (st[i].hasAttribute('data-shown') && !(g in S.shownAt)) S.shownAt[g] = performance.now();
      }
      for (var k in WATCH) {
        if (k in S.seen) continue;
        var el = document.querySelector(WATCH[k]);
        if (el && visible(el)) S.seen[k] = performance.now();
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


KEYS = ['.hero__identity', '.hero__copy', '.hero__thread', '.hero-card .hero__work', '.hero__past',
        '.hero__tools', '.hero-id--who', '.hero-id--talk', '.hero-id--caps', '#background', '#more', '#contact']
RECTS = ('(() => { const o = {}; for (const k of %s) { const e = document.querySelector(k);'
         ' if (!e) continue; const r = e.getBoundingClientRect();'
         ' o[k] = [r.left + scrollX, r.top + scrollY, r.width, r.height].map(v => Math.round(v * 10) / 10); }'
         ' return o; })()') % json.dumps(KEYS)
DECISION = ['roles', 'who', 'talk', 'tlbl', 'chips']
WORK = ['work', 'caps', 'past', 'tools', 'background', 'more', 'contact']


def baseline(b, base, w, h):
    """The final layout as a page that was never staged lays it out."""
    fresh(b, base, w=w, h=h, dark=True, reduced=True, wait=6)
    return b.eval(RECTS)


def t_seq(b, base, shots, widths):
    for (w, h) in widths:
        if w >= 960:
            seq_wide(b, base, shots, w, h)
        else:
            seq_narrow(b, base, shots, w, h)


def seq_wide(b, base, shots, w, h):
    name = '%dx%d' % (w, h)
    ref = baseline(b, base, w, h)
    fresh(b, base, w=w, h=h, dark=True)
    first = b.eval('__pf.first')
    check(first['landing'] == 'intro', name + ' starts in intro', json.dumps(first))
    alone = until(b, '(() => { const s=[...document.querySelectorAll(".hero__thread .msg")].map(m=>m.dataset.state); '
                     'return s.length && s.every(x=>x==="settled") && __pf.cta===null && ' + ALONE + '; })()', 25)
    if alone:
        intro = b.eval('[Object.keys(__pf.seen), document.documentElement.scrollHeight, innerHeight, '
                       'document.querySelector(".hero__thread").getBoundingClientRect().width]')
        if shots:
            b.screenshot(os.path.join(shots, 'intro-%d.png' % w))
        check(not intro[0], name + ' intro shows only the conversation', 'visible: %s' % intro[0])
        check(abs(alone['cx']) < 1, name + ' intro centred across', 'dx %.2f' % alone['cx'])
        fits = alone['bottom'] - alone['top'] <= alone['vh']
        check(abs(alone['cy']) < 40 if fits else alone['top'] >= 0, name + ' intro centred down',
              'dy %.1f (content %d-%d of %d)' % (alone['cy'], alone['top'], alone['bottom'], alone['vh']))
        check(intro[1] <= max(intro[2], alone['bottom'] + 120), name + ' intro is not a long blank page',
              'scrollHeight %d, viewport %d' % (intro[1], intro[2]))
    else:
        check(False, name + ' conversation reached its end alone')
    until(b, '__pf.cta !== null', 30)
    b.pump(1.6)
    s = b.eval('__pf')
    d = b.eval('[document.documentElement.dataset.landing, document.querySelector(".hero__thread").getBoundingClientRect().width,'
               ' document.querySelectorAll(".hero-trust__chip").length,'
               ' [...document.querySelectorAll(".hero-trust__chip")].map(c => c.getBoundingClientRect()).map(r => [Math.round(r.left), Math.round(r.top)])]')
    if shots:
        b.screenshot(os.path.join(shots, 'decision-%d.png' % w))
    seen = s['seen']
    check(d[0] == 'decision', name + ' pf:cta moves to decision', d[0])
    check(all(seen.get(k, 1e12) >= s['cta'] for k in seen), name + ' nothing before pf:cta',
          json.dumps({k: round(v - s['cta']) for k, v in seen.items() if v < s['cta']}))
    order = [k for k in DECISION if k in seen]
    times = [round(seen[k] - s['cta']) for k in order]
    gaps = [times[i + 1] - times[i] for i in range(len(times) - 1)]
    check(order == DECISION and sorted(times) == times, name + ' decision: roles, profile, talk, Trusted By, logos in order',
          json.dumps(dict(zip(order, times))))
    check(all(90 <= g <= 190 for g in gaps) and times and times[0] <= 260, name + ' decision stagger ~100-180ms',
          'from cta %s gaps %s' % (times, gaps))
    check(not [k for k in WORK if k in seen], name + ' work stays hidden in decision',
          'visible: %s' % [k for k in WORK if k in seen])
    xs = sorted(set(p[0] for p in d[3])); ys = sorted(set(p[1] for p in d[3]))
    check(d[2] == 4 and len(xs) == 2 and len(ys) == 2, name + ' four separate logo bubbles in a 2x2', json.dumps(d[3]))
    check(abs(d[1] - s['w0']) < 0.05, name + ' thread width same in intro and decision', '%s %s' % (s['w0'], d[1]))
    b.pump(4)
    v = b.eval('[document.documentElement.dataset.landing, Object.keys(__pf.seen)]')
    check(v[0] == 'decision' and not [k for k in WORK if k in v[1]], name + ' gate holds without a click', json.dumps(v))

    t_click = b.eval('(() => { const t = performance.now(); document.querySelector(".msg-cta__btn").click(); return t; })()')
    b.pump(1.6)
    s = b.eval('__pf')
    end = b.eval('[document.documentElement.dataset.landing, document.querySelector(".hero__thread").getBoundingClientRect().width,'
                 ' [...document.querySelectorAll("[data-reveal]")].filter(e => e.getClientRects().length && (getComputedStyle(e).visibility !== "visible" || +getComputedStyle(e).opacity < 0.99)).length,'
                 ' getComputedStyle(document.querySelector(".hero-trust")).display, !!document.querySelector(".hero__thread.is-list")]')
    if shots:
        b.screenshot(os.path.join(shots, 'work-%d.png' % w))
    check(end[0] == 'work', name + ' click opens work', end[0])
    late = {k: round(s['seen'][k] - t_click) for k in WORK if k in s['seen']}
    check(all(k in s['seen'] for k in ('work', 'caps', 'background')) and all(v >= 0 for v in late.values()),
          name + ' work appears only after the click', json.dumps(late))
    check(end[2] == 0, name + ' everything visible after the click', '%d not' % end[2])
    check(end[3] == 'none', name + ' Trusted By hands over to Skills', end[3])
    check(end[4] is False, name + ' first press keeps the conversation (no list view)', str(end[4]))
    check(abs(end[1] - s['w0']) < 0.05, name + ' thread width unchanged through all three states', '%s %s' % (s['w0'], end[1]))
    got = b.eval(RECTS)
    off = {k: [round(g - r, 1) for g, r in zip(got[k], ref[k])] for k in ref if k in got and
           max(abs(g - r) for g, r in zip(got[k], ref[k])) > 1}
    check(not off, name + ' final layout identical to an unstaged page', json.dumps(off)[:400])
    check(s['over'] == 0, name + ' no horizontal overflow', '%d of %d frames' % (s['over'], s['frames']))
    e = errors(b)
    check(not e, name + ' no errors', '; '.join(e[:3]))


def seq_narrow(b, base, shots, w, h):
    fresh(b, base, w=w, h=h, dark=True)
    until(b, '__pf.cta !== null', 30)
    until(b, '"5" in __pf.shownAt', 5)
    b.pump(1.0)
    s = b.eval('__pf')
    end = b.eval('(() => { const t=document.querySelector(".hero__thread"); const st=[...document.querySelectorAll("[data-reveal]")];'
                 'return { w1: t.getBoundingClientRect().width, hidden: st.filter(e=>getComputedStyle(e).visibility!=="visible"||+getComputedStyle(e).opacity<0.99).length,'
                 ' landing: document.documentElement.dataset.landing }; })()')
    if shots:
        b.screenshot(os.path.join(shots, 'whole-%d.png' % w))
    name = '%dx%d' % (w, h)
    order = sorted(s['shownAt'], key=lambda g: s['shownAt'][g])
    gaps = [round(s['shownAt'][order[i + 1]] - s['shownAt'][order[i]]) for i in range(len(order) - 1)]
    lead = round(s['shownAt'][order[0]] - s['cta']) if order and s['cta'] else None
    check(not s['early'], name + ' nothing staged visible before pf:cta', ','.join(sorted(set(s['early']))))
    check(order == sorted(order) and all(g <= 185 for g in gaps) and lead is not None and lead <= 200,
          name + ' cascade unchanged: groups in order, ~140ms apart', 'lead %s gaps %s' % (lead, gaps))
    check(end['hidden'] == 0 and end['landing'] == 'work', name + ' everything visible at the end', json.dumps(end))
    check(s['w0'] is not None and abs(s['w0'] - end['w1']) < 0.05, name + ' thread width unchanged', '%s -> %s' % (s['w0'], end['w1']))
    check(s['over'] == 0, name + ' no horizontal overflow', '%d of %d frames' % (s['over'], s['frames']))
    e = errors(b)
    check(not e, name + ' no errors', '; '.join(e[:3]))


def t_hatch(b, base):
    fresh(b, base, dark=True, reduced=True, wait=6)
    v = b.eval('[document.documentElement.hasAttribute("data-stage"), document.documentElement.hasAttribute("data-landing"),'
               ' [...document.querySelectorAll("[data-reveal]")].filter(e=>e.getClientRects().length && getComputedStyle(e).visibility!=="visible").length,'
               ' getComputedStyle(document.querySelector(".hero-trust")).display]')
    check(v == [False, False, 0, 'none'], 'reduced motion: never staged, whole, final composition', json.dumps(v))
    for path in ('/#work', '/#/carry'):
        fresh(b, base, path, dark=True, wait=6)
        v = b.eval('[document.documentElement.dataset.stage, document.documentElement.dataset.landing]')
        check(v == ['5', 'work'], 'deep link %s skips the sequence' % path, json.dumps(v))
    fresh(b, base, w=768, h=1024, dark=True, wait=5)
    b.eval('window.scrollTo(0, innerHeight * 0.6)')
    b.pump(0.5)
    v = b.eval('document.documentElement.dataset.stage')
    check(v == '5', 'tablet: scroll past half a viewport shows everything', 'stage=%s' % v)
    # Replay while deciding: the conversation runs again, the gate stays shut.
    fresh(b, base, dark=True)
    until(b, 'document.documentElement.dataset.landing === "decision"', 30)
    b.pump(1)
    b.eval('document.querySelector(".hero__replay").click()')
    b.pump(2)
    v = b.eval('[document.documentElement.dataset.landing, Object.keys(__pf.seen).filter(k => ["work","caps","past","background"].includes(k))]')
    check(v == ['decision', []], 'replay while deciding keeps the gate', json.dumps(v))
    until(b, '!!document.querySelector(".msg-cta:not([hidden]) .msg-cta__btn")', 25)
    b.eval('document.querySelector(".msg-cta__btn").click()')
    b.pump(1.5)
    check(b.eval('document.documentElement.dataset.landing') == 'work', 'See the work after a replay opens the page')
    b.eval('document.querySelector(".hero__replay").click()')
    b.pump(3)
    v = b.eval('[document.documentElement.dataset.landing, [...document.querySelectorAll("[data-reveal]")].filter(e=>e.getClientRects().length && getComputedStyle(e).visibility!=="visible").length]')
    check(v == ['work', 0], 'replay after work keeps the page whole', json.dumps(v))
    # Hard refresh puts it back at the start.
    b.call('Page.reload', ignoreCache=True)
    b.pump(2)
    v = b.eval('[__pf.first.landing, document.documentElement.dataset.landing]')
    check(v[0] == 'intro', 'hard refresh starts at intro again', json.dumps(v))
    check(not errors(b), 'replay and refresh: no errors', '; '.join(errors(b)[:3]))


def tab(b):
    for t in ('keyDown', 'keyUp'):
        b.call('Input.dispatchKeyEvent', type=t, key='Tab', code='Tab', windowsVirtualKeyCode=9)
    b.pump(0.05)
    return b.eval('(() => { const a = document.activeElement; if (!a || a === document.body) return [null, true, null];'
                  ' const vis = a.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });'
                  ' const where = a.closest(".hero__eyebrow") ? "roles" : a.closest(".hero-card .hero__work") ? "work" :'
                  ' a.closest(".hero-id--talk") ? "talk" : a.closest(".msg-cta") ? "cta" : a.closest("#background,#work,#more,#contact") ? "below" : "other";'
                  ' return [(a.tagName + "." + (a.className || "")).slice(0, 40), vis, where]; })()')


def t_keys(b, base):
    fresh(b, base, dark=True, wait=6)
    path = [tab(b) for _ in range(12)]
    bad = [p for p in path if p[0] and not p[1]]
    check(not bad and not [p for p in path if p[2] in ('roles', 'work', 'talk', 'below')],
          'intro: Tab reaches nothing that has not arrived', json.dumps([p[0] for p in path]))
    until(b, 'document.documentElement.dataset.landing === "decision"', 30)
    b.pump(1.5)
    path = [tab(b) for _ in range(16)]
    where = set(p[2] for p in path)
    check(not [p for p in path if p[0] and not p[1]] and {'roles', 'talk', 'cta'} <= where and not where & {'work', 'below'},
          'decision: Tab reaches roles, LET\'S TALK and See the work, not the work', json.dumps(sorted(where - {None})))
    b.eval('document.querySelector(".msg-cta__btn").click()')
    b.pump(1.5)
    path = [tab(b) for _ in range(30)]
    where = set(p[2] for p in path)
    check('work' in where, 'work: Tab reaches the project browser', json.dumps(sorted(where - {None})))


def t_copy(b, base):
    fresh(b, base, dark=True, wait=6)
    v = b.eval('(() => { const t=document.querySelector(".hero__thread .msg .msg__text"); return [t.textContent, t.querySelectorAll("svg").length, !!document.getElementById("px-smiley-o")]; })()')
    check(v == ['Hello Team.', 0, False], 'message one is "Hello Team." with no icon', json.dumps(v))
    b.eval('(document.querySelector("[data-role]")||{click(){}}).click()')
    b.pump(1)
    v = b.eval('document.querySelector(".hero__thread .msg .msg__text").textContent')
    check(v == 'Hello Team.', 'still "Hello Team." after a role switch', json.dumps(v))
    left = {}
    for f in ('index.html', 'slop/index.html', 'assets/app-1.js', 'assets/app-2.js'):
        n = open(os.path.join(ROOT, f), encoding='utf-8').read().lower().count('smiley')
        if n:
            left[f] = n
    check(not left, 'no smiley in markup, CSS or JS', json.dumps(left))


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

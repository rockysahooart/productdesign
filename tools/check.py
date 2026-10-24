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
             conversation, centred), ready on pf:cta (the invitation and
             nothing else, still centred, gate holds without a click), work
             on the click (everything together, settled within 450ms exactly
             where an unstaged page lays it out, browser at 01 and
             navigating).
             Below 960, the cascade. At every width: thread width constant,
             no horizontal overflow, no errors
    hatch    reduced motion, deep links, tablet scroll, replay while deciding
             and after work, hard refresh
    keys     Tab in each state reaches only what that state shows
    pace     the message sequence takes 0.7 of the length it was measured at
             before it was sped up (SEQ_BASE_MS)
    copy     message one reads "Hello Team." with no icon, before and after
             a role switch, and no smiley anywhere in the source
    ask      act two, the conversation after the introduction (js/ask.js):
             every authored question can be answered from the page, reads as
             a question about the designer, and every kind of answer is in
             use; at five widths the introduction clearing on pf:cta (480ms),
             the empty room (720ms) and act two opening centred where act one
             was, without the page below moving; a project shown large with
             the slide's own title, link and preview; a flow of four thoughts
             and five links drawn from the boxes' own geometry, never through
             a thought, redrawn on resize; the earlier evidence folding; a
             change of subject; the employers read off Where I've been; the
             illustration, the decks and the Music menu's links; Browse
             everything opening work through the gate (wide) or linking to
             #work (narrow); reduced motion; replay bringing act one back; no
             overflow and no errors
    nav      the quick links (absent in act one, six text links in act two,
             never touching a card once the page is open) and, below 960, the
             menu beside the theme switch: fixed, reachable anywhere, focus
             in and back, Escape and a tap outside close it, 44px rows

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
      if (S.landAt == null && H.getAttribute('data-landing') === 'ready') S.landAt = performance.now();
      var m0 = document.querySelector('.hero__thread .msg');
      if (S.seqAt == null && m0 && m0.getAttribute('data-state')) S.seqAt = performance.now();
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
WORK = ['caps', 'past', 'tools', 'background', 'more', 'contact']
# Everything outside the conversation waits for the click at every width; at
# 2100 and up the page is the ultrawide grid.
UW = 2100

# The message timeline, first message landing to the invitation, at 1512,
# measured before it was paced to 0.7 on 2026-10-20.
SEQ_BASE_MS = 11955
PACE = 0.7


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
    every = ['roles'] + DECISION[1:] + ['work'] + WORK
    page = [k for k in every if k not in ('tlbl', 'chips')]
    ref = baseline(b, base, w, h)
    fresh(b, base, w=w, h=h, dark=True)
    first = b.eval('__pf.first')
    check(first['landing'] == 'intro', name + ' starts in intro', json.dumps(first))
    alone = until(b, '(() => { const s=[...document.querySelectorAll(".hero__thread .msg")].map(m=>m.dataset.state); '
                     'return s.length && s.every(x=>x==="settled") && __pf.cta===null && ' + ALONE + '; })()', 25)
    if alone:
        intro = b.eval('[Object.keys(__pf.seen), document.documentElement.scrollHeight, innerHeight]')
        if shots:
            b.screenshot(os.path.join(shots, 'intro-%d.png' % w))
        check(not intro[0], name + ' intro shows only the conversation', 'visible: %s' % intro[0])
        check(abs(alone['cx']) < 1, name + ' intro centred across', 'dx %.2f' % alone['cx'])
        fits = alone['bottom'] - alone['top'] <= alone['vh']
        if w >= UW:
            ok = abs(alone['cy']) < 40 if fits else alone['top'] >= 0
            label = ' intro centred down'
        else:
            above, below = alone['top'], alone['vh'] - alone['bottom']
            ok = alone['top'] >= 20 and (below >= above - 2 or not fits)
            label = ' intro optically centred (more room below than above)'
        check(ok, name + label, 'dy %.1f (content %d-%d of %d)' % (alone['cy'], alone['top'], alone['bottom'], alone['vh']))
        check(intro[1] <= max(intro[2], alone['bottom'] + 120), name + ' intro is not a long blank page',
              'scrollHeight %d, viewport %d' % (intro[1], intro[2]))
    else:
        check(False, name + ' conversation reached its end alone')
    until(b, '__pf.cta !== null', 30)
    b.pump(1.0)
    s = b.eval('__pf')
    r = b.eval('[document.documentElement.dataset.landing, document.querySelector(".hero__thread").getBoundingClientRect().width,'
               ' (() => { const c = document.querySelector(".hero__copy").getBoundingClientRect(); return (c.left + c.right) / 2 - innerWidth / 2; })(),'
               ' !!document.querySelector(".msg-cta:not([hidden]) .msg-cta__btn")]')
    if shots:
        b.screenshot(os.path.join(shots, 'ready-%d.png' % w))
    check(r[0] == 'ready', name + ' pf:cta moves to ready', r[0])
    check(r[3], name + ' ready: See the work is up')
    check(not s['seen'], name + ' ready: nothing but the conversation and its invitation', 'visible: %s' % list(s['seen']))
    check(abs(r[2]) < 1, name + ' ready: still centred', 'dx %.2f' % r[2])
    land_at = b.eval('__pf.landAt')
    check(land_at is not None and abs(land_at - s['cta']) < 40, name + ' ready begins on pf:cta itself',
          'landing changed %s ms after the cue' % (None if land_at is None else round(land_at - s['cta'])))
    check(abs(r[1] - s['w0']) < 0.05, name + ' thread width same in intro and ready', '%s %s' % (s['w0'], r[1]))
    b.pump(4)
    v = b.eval('[document.documentElement.dataset.landing, Object.keys(__pf.seen)]')
    check(v[0] == 'ready' and not v[1], name + ' gate holds without a click (4s)', json.dumps(v))

    t_click = b.eval('(() => { const t = performance.now(); document.querySelector(".msg-cta__btn").click(); return t; })()')
    b.pump(0.45)
    s = b.eval('__pf')
    got = b.eval(RECTS)
    end = b.eval('[document.documentElement.dataset.landing, document.querySelector(".hero__thread").getBoundingClientRect().width,'
                 ' [...document.querySelectorAll("[data-reveal]")].filter(e => e.getClientRects().length && (getComputedStyle(e).visibility !== "visible" || +getComputedStyle(e).opacity < 0.99)).length,'
                 ' +getComputedStyle(document.querySelector(".hero-card .hero__eyebrow")).opacity,'
                 ' !!document.querySelector(".hero__thread.is-list")]')
    if shots:
        b.screenshot(os.path.join(shots, 'work-%d.png' % w))
    check(end[0] == 'work', name + ' click opens work', end[0])
    late = {k: round(s['seen'][k] - t_click) for k in page if k in s['seen']}
    missing = [k for k in page if k not in s['seen'] and k != 'more' and k != 'contact']
    # Together means one frame for all of it. That frame can take ~100ms to
    # come: it is the first layout of everything below the hero.
    span = (max(late.values()) - min(late.values())) if late else 0
    check(not missing and span <= 20 and all(0 <= v <= 180 for v in late.values()),
          name + ' everything arrives together on the click',
          'from click: %s%s' % (json.dumps(late), (' missing %s' % missing) if missing else ''))
    off = {k: [round(g - r_, 1) for g, r_ in zip(got[k], ref[k])] for k in ref if k in got and
           max(abs(g - r_) for g, r_ in zip(got[k], ref[k])) > 1}
    check(not off and end[2] == 0 and end[3] > 0.99, name + ' settled in the final layout within 450ms',
          'off %s, not yet opaque %d, roles %.2f' % (json.dumps(off)[:300], end[2], end[3]))
    check(end[4] is False, name + ' first press keeps the conversation (no list view)', str(end[4]))
    check(abs(end[1] - s['w0']) < 0.05, name + ' thread width unchanged through all three states', '%s %s' % (s['w0'], end[1]))
    nav = b.eval('(() => { const c = () => document.querySelector(".hero__work [data-pv-i]").textContent;'
                 ' const a = c(); document.querySelector(".hero__work [data-pv-next]").click(); const n = c();'
                 ' document.querySelector(".hero__work [data-pv-prev]").click(); return [a, n, c()]; })()')
    check(nav == ['01', '02', '01'] if w < UW else True, name + ' project browser starts at 01 and navigates', json.dumps(nav))
    b.pump(0.6)
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
    check(order == sorted(order) and all(g <= 185 for g in gaps) and lead is not None and lead <= 220,
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
    until(b, 'document.documentElement.dataset.landing === "ready"', 30)
    b.pump(1)
    b.eval('document.querySelector(".hero__replay").click()')
    b.pump(2)
    v = b.eval('[document.documentElement.dataset.landing, Object.keys(__pf.seen)]')
    check(v == ['ready', []], 'replay while ready keeps the gate', json.dumps(v))
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
                  ' a.closest(".hero-id--talk") ? "talk" : a.closest(".msg-cta") ? "cta" : a.closest(".ask") ? "ask" : a.closest(".snav") ? "nav" : a.closest("#background,#work,#more,#contact") ? "below" : "other";'
                  ' return [(a.tagName + "." + (a.className || "")).slice(0, 40), vis, where]; })()')


def t_keys(b, base):
    fresh(b, base, dark=True, wait=6)
    path = [tab(b) for _ in range(12)]
    bad = [p for p in path if p[0] and not p[1]]
    check(not bad and not [p for p in path if p[2] in ('roles', 'work', 'talk', 'below')],
          'intro: Tab reaches nothing that has not arrived', json.dumps([p[0] for p in path]))
    until(b, 'document.documentElement.dataset.landing === "ready"', 30)
    # Act two has cleared the room and asked its question before anything in it can be reached.
    until(b, ASK_IDLE, 15)
    b.pump(0.5)
    path = [tab(b) for _ in range(20)]
    where = set(p[2] for p in path)
    check(not [p for p in path if p[0] and not p[1]] and 'cta' in where and 'ask' in where and not where & {'roles', 'talk', 'work', 'below'},
          'ready (1440): Tab reaches the quick links, the questions and Browse everything, nothing else',
          json.dumps(sorted(where - {None})))
    b.eval('document.querySelector(".msg-cta__btn").click()')
    b.pump(1.5)
    path = [tab(b) for _ in range(30)]
    where = set(p[2] for p in path)
    check('work' in where, 'work: Tab reaches the project browser', json.dumps(sorted(where - {None})))


def t_pace(b, base):
    runs = []
    for _ in range(2):
        fresh(b, base, w=1512, h=982, dark=False)
        until(b, '__pf.cta !== null', 30)
        s = b.eval('__pf')
        runs.append(s['cta'] - s['seqAt'])
    r = [x / SEQ_BASE_MS for x in runs]
    check(all(abs(x - PACE) < 0.03 for x in r), 'message sequence runs at 0.7 of its old length',
          'first message to invitation %s ms vs %d (ratio %s)' % ([round(x) for x in runs], SEQ_BASE_MS, [round(x, 3) for x in r]))


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


ASK_STATE = r"""(() => { const a = document.querySelector('.ask'); if (!a) return null;
  const txt = n => n ? n.textContent.replace(/\s+/g, ' ').trim() : null;
  return {
    q: [...a.querySelectorAll('.ask__choices:not(.is-leaving) .ask-q')].filter(b => !b.disabled).map(b => b.dataset.q),
    ev: [...a.querySelectorAll('.ask-ev')].map(e => ({ k: e.dataset.askProject, compact: e.classList.contains('is-compact'),
          title: txt(e.querySelector('.ask-ev__title')), eyebrow: txt(e.querySelector('.ask-ev__eyebrow')), href: e.querySelector('.ask-ev__go').getAttribute('href'),
          target: e.querySelector('.ask-ev__go').getAttribute('target'),
          preview: !!e.querySelector('.ask-ev__vis > *'), shown: +getComputedStyle(e).opacity })),
    you: [...a.querySelectorAll('.ask-you')].map(e => txt(e).replace(/^You asked: /, '')),
    says: [...a.querySelectorAll('.ask__say')].map(r => [r.dataset.state, txt(r.querySelector('.msg__text'))]),
    browse: (() => { const c = a.querySelector('.ask__browse .msg-cta__btn'); return c ? [c.tagName, c.getAttribute('href'), c.getClientRects().length > 0] : null; })(),
    again: (() => { const g = a.querySelector('.ask__again'); return !!g && g.getClientRects().length > 0; })(),
    turns: a.querySelectorAll('.ask__turn').length,
    focus: document.activeElement && document.activeElement.closest ? !!document.activeElement.closest('.ask__say') : false,
    box: (() => { const t = document.querySelector('.hero__thread'); return [t.scrollHeight, t.clientHeight, Math.round(t.scrollTop), t.getBoundingClientRect().width]; })()
  }; })()"""

# Ready to be answered: no line still arriving and choices on screen.
ASK_IDLE = ('(() => { const a = document.querySelector(".ask"); if (!a) return false;'
            ' const s = [...a.querySelectorAll(".ask__say")]; if (!s.length) return false;'
            ' if (s.some(r => r.dataset.state === "loading")) return false;'
            ' const q = a.querySelectorAll(".ask__choices.is-in:not(.is-leaving) .ask-q:not(:disabled)");'
            ' return q.length > 0 && !!a.querySelector(".ask__bar.is-in"); })()')

SLIDE = ('(k => { const s = document.querySelector(\'.pv__slide[data-mode="design"][data-project="\' + k + \'"]\');'
         ' return s ? [s.querySelector(".pv__title").textContent.replace(/\\s+/g, " ").trim(), s.getAttribute("data-href")] : null; })')


OPEN_SAY = ['I believe design is how we make decisions visible, understandable, and easier to act on.',
            'Where would you like to start?']

# A flow, measured: every thought shown, every link drawn and laid from the
# boxes as they are now, and no link passing through a thought's text.
FLOW = r"""(() => { const f = [...document.querySelectorAll('.ask-flow')].pop(); if (!f) return null;
  const nodes = [...f.querySelectorAll('.ask-node')], links = [...f.querySelectorAll('.ask-flow__link')];
  const o = f.getBoundingClientRect(); let crossings = 0;
  for (const p of links) { const L = p.getTotalLength(); if (!L) continue;
    for (let i = 1; i < 20; i++) { const pt = p.getPointAtLength(L * i / 20);
      for (const n of nodes) { const r = n.getBoundingClientRect();
        if (pt.x + o.left > r.left + 3 && pt.x + o.left < r.right - 3 && pt.y + o.top > r.top + 3 && pt.y + o.top < r.bottom - 3) crossings++; } } }
  return { nodes: nodes.length, shown: nodes.filter(n => +getComputedStyle(n).opacity > 0.99).length,
           links: links.length, drawn: links.filter(p => p.getAttribute('d') && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset)) < 0.01).length,
           crossings, ends: !!f.nextElementSibling && f.nextElementSibling.classList.contains('ask-ev') }; })()"""

NAV = r"""(() => { const n = document.querySelector('.snav'); const cs = getComputedStyle(n);
  return [cs.display, cs.visibility, +cs.opacity, n.querySelectorAll('a').length]; })()"""


def ask_flow(b, base, shots, w, h):
    name = 'ask %dx%d' % (w, h)
    fresh(b, base, w=w, h=h, dark=False)
    # ACT ONE ENDS, THE ROOM EMPTIES, ACT TWO BEGINS. Timed from pf:cta.
    b.eval('''window.__act = {}; (() => { const t = document.querySelector('.hero__thread');
      new MutationObserver(() => { const n = performance.now();
        if (t.classList.contains('is-act-out') && !__act.out) __act.out = n;
        if (t.classList.contains('is-act2') && !__act.two) __act.two = n;
        const r = t.querySelector('.ask__say'); if (r && !__act.say) __act.say = n;
      }).observe(t, { attributes: true, subtree: true, childList: true }); })()''')
    if w < 960:
        # Below 960 the page under the thread must not jump while the room is empty.
        # Measured as the room starts to empty: the introduction's last line
        # may still be settling before that.
        until(b, '!!__act.out', 40)
        nxt = '(() => { const n = document.querySelector(".hero__clients"); return n && n.getClientRects().length ? Math.round(n.getBoundingClientRect().top + scrollY) : null; })()'
        y0 = b.eval(nxt)
        until(b, '!!__act.two', 10)
        b.pump(0.2)
        y1 = b.eval(nxt)
        check(y0 is not None and y0 == y1, name + ' the page under the thread holds still while act two empties the room', '%s -> %s' % (y0, y1))
    ok = until(b, ASK_IDLE, 50)
    s = b.eval(ASK_STATE)
    if not ok or not s:
        check(False, name + ' act two arrives after the introduction', json.dumps(s)[:200])
        return
    a = b.eval('[__act, __pf.cta]')
    t, cta = a[0], a[1]
    if w >= 960 and t.get('out') and t.get('two') and t.get('say'):
        d1, d2, d3 = t['out'] - cta, t['two'] - t['out'], t['say'] - t['two']
        check(d1 < 60 and 440 <= d2 <= 560 and 680 <= d3 <= 820, name + ' the introduction clears on pf:cta (480ms), the room is empty 720ms, then act two',
              'cue->clear %d, clear %d, blank %d' % (d1, d2, d3))
    else:
        check(bool(t.get('out') and t.get('two')), name + ' the introduction clears before act two', json.dumps(t))
    gone = b.eval('[...document.querySelectorAll(".hero__thread .msg[data-msg]")].filter(m => m.getClientRects().length).length')
    check(gone == 0, name + ' the introduction is gone from the box in act two', '%d rows still laid out' % gone)
    land = b.eval('document.documentElement.dataset.landing')
    check([x[1] for x in s['says']] == OPEN_SAY and s['q'] == ['now', 'best', 'approach'],
          name + ' act two opens on the philosophy line, a question and three choices', json.dumps([s['says'], s['q']]))
    if w >= 960:
        c = b.eval('(() => { const t = document.querySelector(".hero__thread").getBoundingClientRect(), o = document.querySelector(".ask__turn").getBoundingClientRect();'
                   ' return [(o.top + o.bottom) / 2 - (t.top + t.bottom) / 2, o.top - t.top, t.bottom - o.bottom]; })()')
        # Centred when it fits; when the turn is taller than the box it starts
        # just under the top dissolve and runs to the foot.
        check(abs(c[0]) < 24 or (c[2] <= 16 and c[1] <= 80), name + ' act two opens centred in the box act one used', 'off by %.1f (above %d, below %d)' % tuple(c))
    check(s['browse'] and s['browse'][2] and (s['browse'][0] == 'BUTTON' if w >= 960 else s['browse'][1] == '#work'),
          name + ' Browse everything is there (the gate above 960, a link to #work below)', json.dumps(s['browse']))
    check(land == ('ready' if w >= 960 else 'work'), name + ' the page is in its ' + ('ready' if w >= 960 else 'cascaded') + ' state', land)
    if shots:
        b.screenshot(os.path.join(shots, 'ask-open-%d.png' % w))
    w0 = s['box'][3]

    # A project: the film still, the slide's own title, link and preview.
    b.eval('document.querySelector(\'.ask-q[data-q="best"]\').click()')
    until(b, ASK_IDLE, 20)
    s = b.eval(ASK_STATE)
    sl = b.eval(SLIDE + '("livefront")')
    ev = s['ev'][0] if s['ev'] else {}
    check(s['you'] == ['Which project best represents your work?'], name + ' the choice becomes the visitor\'s note', json.dumps(s['you']))
    check(ev.get('k') == 'livefront' and sl and ev.get('title') == sl[0] and ev.get('href') == sl[1] and ev.get('preview'),
          name + ' the answer shows Craigslist, with the slide\'s own title, link and preview', json.dumps([ev, sl]))
    big = b.eval('(() => { const v = document.querySelector(".ask-ev:not(.is-compact) .ask-ev__vis").getBoundingClientRect(), a = document.querySelector(".ask").getBoundingClientRect(); return [Math.round(v.width), Math.round(v.height), Math.round(a.width)]; })()')
    check(big[0] >= big[2] * 0.85 and big[1] >= 200, name + ' the project is shown large: most of the column\'s width, 200px tall or more', json.dumps(big))
    check(s['q'] == ['healthcare', 'approach', 'where'], name + ' three follow-ups, chosen by the path', json.dumps(s['q']))
    check(s['focus'], name + ' focus moves to the answer')
    if shots:
        b.screenshot(os.path.join(shots, 'ask-answer-%d.png' % w))

    # A flow: thought, link, thought, ending on the project it happened in.
    b.eval('document.querySelector(\'.ask-q[data-q="approach"]\').click()')
    until(b, ASK_IDLE, 30)
    s = b.eval(ASK_STATE)
    f = b.eval(FLOW)
    check(f and f['nodes'] == 4 and f['shown'] == 4 and f['links'] == 5 and f['drawn'] == 5 and f['ends'],
          name + ' the flow draws four thoughts and five links, ending on its evidence', json.dumps(f))
    check(f and f['crossings'] == 0, name + ' no link passes through a thought', json.dumps(f))
    check(len(s['ev']) == 2 and s['ev'][0]['compact'] and not s['ev'][0]['preview'] and s['ev'][1]['k'] == 'dsa' and s['ev'][1]['preview'],
          name + ' the earlier evidence folds; the flow ends on the audit, running', json.dumps(s['ev']))
    eb = [x['eyebrow'] for x in s['ev']]
    check(all(len(set(p.strip().lower() for p in e.split('·'))) == len(e.split('·')) for e in eb),
          name + ' no evidence eyebrow repeats itself', json.dumps(eb))
    check(s['again'], name + ' Ask something else is offered after an answer')
    if w >= 960:
        check(s['box'][0] > s['box'][1] and s['box'][2] > 0, name + ' the box scrolls to the newest turn', json.dumps(s['box']))
    # The links follow the boxes: a narrower window redraws them.
    if w >= 960:
        b.viewport(w - 40, h)
        b.pump(0.6)
        f2 = b.eval(FLOW)
        check(f2 and f2['crossings'] == 0 and f2['drawn'] == 5, name + ' resized, every link is redrawn where the boxes are', json.dumps(f2))
        b.viewport(w, h)
        b.pump(0.6)
    if shots:
        b.screenshot(os.path.join(shots, 'ask-flow-%d.png' % w))

    # A change of subject offers the other three openers.
    b.eval('document.querySelector(".ask__again").click()')
    until(b, '(() => { const t = document.querySelectorAll(".ask__turn"); const l = t[t.length - 1]; return l && !!l.querySelector(".ask__choices--open.is-in"); })()', 10)
    until(b, ASK_IDLE, 10)
    s = b.eval(ASK_STATE)
    check(s['q'] == ['where', 'outside', 'ai'], name + ' a change of subject offers what has not been asked', json.dumps(s['q']))

    # Where: the employers, read off Where I've been, arriving one by one.
    b.eval('document.querySelector(\'.ask-q[data-q="where"]\').click()')
    until(b, ASK_IDLE, 20)
    lg = b.eval('(() => { const t = [...document.querySelectorAll(".hero__past .tl__name")].map(n => n.textContent.trim());'
                ' const a = [...document.querySelectorAll(".ask-logos")].pop(); if (!a) return null;'
                ' const tiles = [...a.querySelectorAll(".ask-logo")];'
                ' return { names: tiles.map(x => x.querySelector(".ask-logo__name").textContent), timeline: t,'
                ' marks: tiles.filter(x => getComputedStyle(x.querySelector(".ask-logo__mark")).backgroundImage.indexOf("url(") === 0).length,'
                ' settled: tiles.filter(x => +getComputedStyle(x).opacity > 0.99 && getComputedStyle(x).transform === "none").length }; })()')
    check(lg and lg['names'] == lg['timeline'] and lg['marks'] == len(lg['names']) and lg['settled'] == len(lg['names']),
          name + ' where: every employer from the timeline, with its mark, settled in line', json.dumps(lg))
    if shots:
        b.screenshot(os.path.join(shots, 'ask-where-%d.png' % w))

    if w >= 960:
        b.eval('document.querySelector(".ask__browse .msg-cta__btn").click()')
        b.pump(0.5)
        v = b.eval('[document.documentElement.dataset.landing, document.querySelector(".hero__thread").getBoundingClientRect().width,'
                   ' !!document.querySelector(".hero__thread.is-list"), document.querySelector(".ask__browse").getClientRects().length,'
                   ' [...document.querySelectorAll("[data-reveal]")].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== "visible").length]')
        check(v[0] == 'work' and not v[2] and v[4] == 0, name + ' Browse everything opens the whole page, conversation kept', json.dumps(v))
        check(abs(v[1] - w0) < 0.05, name + ' thread width unchanged into work', '%s %s' % (w0, v[1]))
        check(v[3] == 0, name + ' Browse everything is put away once the page is open', json.dumps(v))
        if shots:
            b.pump(0.6)
            b.screenshot(os.path.join(shots, 'ask-work-%d.png' % w))
    check(b.eval('__pf.over') == 0, name + ' no horizontal overflow', '%d of %d frames' % (b.eval('__pf.over'), b.eval('__pf.frames')))
    e = errors(b)
    check(not e, name + ' no errors', '; '.join(e[:3]))


def t_ask(b, base, shots):
    fresh(b, base, '/#top', w=1512, h=982, dark=False, wait=4)
    # Every authored answer can be shown from the page as it is, and every
    # follow-up exists.
    bad = b.eval('''(() => { const A = PF.ASK, out = [];
      const live = k => { const p = PF.project(k), s = document.querySelector('.pv__slide[data-mode="design"][data-project="' + k + '"]');
        return p && p.status === "live" && s && s.getAttribute("data-href"); };
      for (const id in A.q) { const q = A.q[id], k = q.kind || 'project';
        if ((k === 'project' || k === 'flow') && !live(q.show)) out.push(id + ':' + q.show);
        if (k === 'flow' && !(q.steps && q.steps.length >= 3)) out.push(id + ':steps');
        for (const n of (q.next || [])) if (!A.q[n]) out.push(id + '->' + n); }
      for (const n of A.open.next.concat(A.again.next)) if (!A.q[n]) out.push('open->' + n); return out; })()''')
    check(not bad, 'ask: every question can be answered from the page and every follow-up exists', json.dumps(bad))
    shown = b.eval('Object.keys(PF.ASK.q).map(id => PF.ASK.q[id].show).filter((v, i, a) => v && a.indexOf(v) === i).sort()')
    check(shown == sorted(['carry', 'crypto', 'dsa', 'governance', 'livefront', 'optiflow', 'pnc', 'specimen']),
          'ask: every live design project can be reached', json.dumps(shown))
    # Every question is the visitor asking about the designer: a question, not
    # a command, and never "show me" (which reads as the visitor's own work).
    labels = b.eval('Object.keys(PF.ASK.q).map(id => PF.ASK.q[id].label)')
    off = [l for l in labels if not l.endswith('?') or l.lower().startswith('show me') or ' me your ' in l.lower()]
    check(not off, 'ask: every question reads as a question about the designer', json.dumps(off))
    check(len(set(labels)) == len(labels), 'ask: no question is asked twice in different places', json.dumps(labels))
    kinds = b.eval('Object.keys(PF.ASK.q).map(id => PF.ASK.q[id].kind || "project").filter((v, i, a) => a.indexOf(v) === i).sort()')
    check(kinds == ['art', 'flow', 'logos', 'music', 'outside', 'project'], 'ask: every kind of answer is in use', json.dumps(kinds))
    now = b.eval('[PF.ASK.open.next[0], PF.ASK.q[PF.ASK.open.next[0]].label]')
    check(now == ['now', 'What are you currently working on?'], 'ask: "What are you currently working on?" is one of the first three', json.dumps(now))
    for w, h in [(1512, 982), (2560, 1440), (1280, 800), (1024, 768), (390, 844)]:
        ask_flow(b, base, shots, w, h)
    # The made-outside-work answers: the real pictures, the real links.
    fresh(b, base, w=1512, h=982, dark=False)
    until(b, ASK_IDLE, 50)
    b.eval('document.querySelector(".ask-q[data-q=\\"best\\"]").click()')
    until(b, ASK_IDLE, 20)
    b.eval('document.querySelector(".ask__again").click()')
    until(b, '(() => { const t = document.querySelectorAll(".ask__turn"); const l = t[t.length - 1]; return l && !!l.querySelector(".ask__choices--open.is-in"); })()', 10)
    until(b, ASK_IDLE, 10)
    b.eval('document.querySelector(".ask-q[data-q=\\"outside\\"]").click()')
    until(b, ASK_IDLE, 20)
    b.pump(1.0)
    o = b.eval('[...document.querySelectorAll(".ask-media--pair .ask-shot__img")].map(i => [i.naturalWidth > 0, i.alt.length > 20])')
    check(o == [[True, True], [True, True]], 'ask: outside work shows the illustration and the decks, loaded, described', json.dumps(o))
    b.eval('document.querySelector(".ask-q[data-q=\\"music\\"]").click()')
    until(b, ASK_IDLE, 20)
    m = b.eval('(() => { const a = [...document.querySelectorAll(".ask-media--music")].pop(); if (!a) return null;'
               ' return { rows: [...a.querySelectorAll(".ask-listen__row")].map(r => r.getAttribute("href")),'
               ' menu: [...document.querySelectorAll("#music-menu .rolemenu__row")].map(r => r.getAttribute("href")),'
               ' bars: a.querySelectorAll(".ask-wave i").length, img: a.querySelector(".ask-shot__img").naturalWidth > 0,'
               ' blank: [...a.querySelectorAll("a")].every(x => x.target === "_blank" && /noopener/.test(x.rel)) }; })()')
    check(m and m['rows'] == m['menu'] and m['bars'] > 20 and m['img'] and m['blank'],
          'ask: music shows the decks, a waveform and the Music menu\'s own three links', json.dumps(m))
    b.eval('document.querySelector(".ask-q[data-q=\\"art\\"]").click()')
    until(b, ASK_IDLE, 20)
    a = b.eval('(() => { const a = [...document.querySelectorAll(".ask-media--art")].pop(); if (!a) return null; const i = a.querySelector(".ask-shot").getBoundingClientRect();'
               ' return [a.querySelector(".ask-shot__img").naturalWidth > 0, Math.round(i.height), a.querySelector(".ask-ev__go").getAttribute("href")]; })()')
    check(a and a[0] and a[1] >= 220 and 'framer' in a[2], 'ask: illustration is given the room, with its way out', json.dumps(a))
    e = errors(b)
    check(not e, 'ask: media answers, no errors', '; '.join(e[:3]))
    # Reduced motion: no act to end. The introduction stays, the conversation
    # follows it, and a flow is already drawn.
    fresh(b, base, w=1512, h=982, dark=False, reduced=True, wait=0.5)
    until(b, ASK_IDLE, 15)
    s = b.eval(ASK_STATE)
    intro = b.eval('[...document.querySelectorAll(".hero__thread .msg[data-msg]")].filter(m => m.getClientRects().length).length')
    check(bool(s) and len(s['q']) == 3 and s['says'][0][0] == 'settled' and intro > 0,
          'ask: reduced motion asks at once, the introduction kept, nothing animated', json.dumps([intro, s['says'] if s else None]))
    if s:
        b.eval('document.querySelector(\'.ask-q[data-q="approach"]\').click()')
        b.pump(0.4)
        f = b.eval(FLOW)
        s = b.eval(ASK_STATE)
        check(f and f['shown'] == 4 and f['drawn'] == 5 and len(s['ev']) == 1 and s['ev'][0]['k'] == 'dsa',
              'ask: reduced motion answers at once, links already drawn', json.dumps(f))
    # Replay is a clean start: the conversation goes and act one comes back.
    fresh(b, base, w=1512, h=982, dark=False)
    until(b, ASK_IDLE, 50)
    b.eval('document.querySelector(\'.ask-q[data-q="best"]\').click()')
    until(b, ASK_IDLE, 20)
    b.eval('document.querySelector(".hero__replay").click()')
    b.pump(1.4)
    v = b.eval('[!!document.querySelector(".ask"), ["is-asking", "is-act2", "is-act-out"].filter(c => document.querySelector(".hero__thread").classList.contains(c)),'
               ' [...document.querySelectorAll(".hero__thread .msg[data-msg]")].filter(m => m.getClientRects().length).length]')
    check(v[0] is False and v[1] == [] and v[2] > 0, 'ask: replay clears the conversation and brings act one back', json.dumps(v))
    ok = until(b, ASK_IDLE, 50)
    s = b.eval(ASK_STATE)
    check(bool(ok) and s['q'] == ['now', 'best', 'approach'] and not s['you'], 'ask: after replay act two opens again from the start',
          json.dumps(s)[:200] if s else 'none')
    e = errors(b)
    check(not e, 'ask: replay, no errors', '; '.join(e[:3]))


def t_nav(b, base, shots):
    # The quick links: absent through act one, there in act two, gone where
    # the open page has no margin for them.
    fresh(b, base, w=1512, h=982, dark=False)
    b.pump(2)
    v = b.eval(NAV)
    check(v[1] == 'hidden', 'nav 1512: quick links hidden while the introduction plays', json.dumps(v))
    until(b, '__pf.cta !== null', 40)
    b.pump(0.6)
    v = b.eval(NAV)
    check(v[0] == 'block' and v[1] == 'visible' and v[2] > 0.99 and v[3] == 6, 'nav 1512: six quick links once the conversation begins', json.dumps(v))
    pills = b.eval('[...document.querySelectorAll(".snav, .snav *")].filter(e => { const c = getComputedStyle(e); return c.backgroundColor !== "rgba(0, 0, 0, 0)" || c.boxShadow !== "none" || parseFloat(c.borderTopWidth) > 0; }).length')
    check(pills == 0, 'nav: text only, no container, pill or border', '%d painted' % pills)
    clear = b.eval('(() => { const n = document.querySelector(".snav").getBoundingClientRect(), c = document.querySelector(".hero__copy").getBoundingClientRect(); return [Math.round(n.right), Math.round(c.left)]; })()')
    check(clear[0] < clear[1], 'nav 1512: clear of the conversation', json.dumps(clear))
    b.eval('document.querySelector(\'.snav a[href="#work"]\').click()')
    b.pump(1.2)
    v = b.eval('[document.documentElement.dataset.landing, location.hash, getComputedStyle(document.querySelector(".snav")).display]')
    check(v[0] == 'work' and v[1] == '#work' and v[2] == 'none', 'nav 1512: Projects opens the page at the work; the links step aside', json.dumps(v))
    for w, h in [(1920, 1080), (2560, 1440)]:
        fresh(b, base, '/#work', w=w, h=h, dark=False, wait=3)
        r = b.eval('(() => { const n = document.querySelector(".snav"); if (getComputedStyle(n).display === "none") return null;'
                   ' const x = n.getBoundingClientRect(); let l = 1e9; for (const e of document.querySelectorAll(".hero-card > *")) { const q = e.getBoundingClientRect(); if (q.width && q.height) l = Math.min(l, q.left); } return [Math.round(x.right), Math.round(l)]; })()')
        check(r is None or r[0] < r[1] - 24, 'nav %d: on the open page, the links never touch a card' % w, json.dumps(r))
    # The menu, below 960: paired with the theme switch, always reachable.
    for w, h in [(390, 844), (768, 1024)]:
        fresh(b, base, w=w, h=h, dark=False)
        until(b, ASK_IDLE, 50)
        p = b.eval('(() => { const t = document.querySelector(".gutil .theme-toggle").getBoundingClientRect(), m = document.querySelector(".gutil__menu").getBoundingClientRect();'
                   ' return [Math.round(m.left - t.right), Math.round(m.top - t.top), getComputedStyle(document.querySelector(".gutil")).position, Math.round(m.width), Math.round(m.height)]; })()')
        check(p[0] <= 10 and p[1] == 0 and p[2] == 'fixed', 'menu %d: beside the theme switch, fixed' % w, json.dumps(p))
        b.eval('window.scrollTo(0, document.documentElement.scrollHeight / 2)')
        b.pump(0.3)
        hit = b.eval('(() => { const m = document.querySelector(".gutil__menu").getBoundingClientRect(); const e = document.elementFromPoint(m.left + m.width / 2, m.top + m.height / 2); return !!e && !!e.closest(".gutil__menu"); })()')
        check(hit, 'menu %d: reachable halfway down the page' % w)
        b.eval('document.querySelector(".gutil__menu").click()')
        b.pump(0.4)
        o = b.eval('[document.querySelector(".gutil__menu").getAttribute("aria-expanded"), document.getElementById("site-menu").hidden,'
                   ' document.activeElement && document.activeElement.textContent.trim(), [...document.querySelectorAll("#site-menu a")].map(a => a.textContent.trim()),'
                   ' Math.min(...[...document.querySelectorAll("#site-menu a")].map(a => a.getBoundingClientRect().height))]')
        need = ['Projects', 'Illustration', 'Music', 'About me']
        check(o[0] == 'true' and o[1] is False and o[2] == 'Start here' and all(n in o[3] for n in need) and o[4] >= 44,
              'menu %d: opens, focus on its first entry, Projects / Illustration / Music / About me, 44px rows' % w, json.dumps(o))
        if shots:
            b.screenshot(os.path.join(shots, 'menu-%d.png' % w))
        for t in ('keyDown', 'keyUp'):
            b.call('Input.dispatchKeyEvent', type=t, key='Escape', code='Escape', windowsVirtualKeyCode=27)
        b.pump(0.4)
        o = b.eval('[document.querySelector(".gutil__menu").getAttribute("aria-expanded"), document.getElementById("site-menu").hidden, document.activeElement.classList.contains("gutil__menu")]')
        check(o == ['false', True, True], 'menu %d: Escape closes it and gives focus back' % w, json.dumps(o))
        b.eval('document.querySelector(".gutil__menu").click()')
        b.pump(0.4)
        b.eval('document.querySelector(".gmenu__scrim").click()')
        b.pump(0.4)
        o = b.eval('[document.querySelector(".gutil__menu").getAttribute("aria-expanded"), document.getElementById("site-menu").hidden]')
        check(o == ['false', True], 'menu %d: a tap outside closes it' % w, json.dumps(o))
        b.eval('document.querySelector(".gutil .theme-toggle").click()')
        b.pump(0.3)
        th = b.eval('[document.documentElement.dataset.theme, localStorage.getItem("pf-theme")]')
        check(th == ['dark', 'dark'], 'menu %d: the paired switch still switches the theme' % w, json.dumps(th))
        e = errors(b)
        check(not e, 'menu %d: no errors' % w, '; '.join(e[:3]))
    fresh(b, base, '/#/carry', w=390, h=844, dark=False, wait=2)
    until(b, 'document.documentElement.dataset.route === "carry"', 15)
    v = b.eval('[getComputedStyle(document.querySelector(".gutil")).display, getComputedStyle(document.querySelector(".snav")).display]')
    check(v == ['none', 'none'], 'nav: neither shows on a case study', json.dumps(v))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    shots = None
    if '--shots' in sys.argv:
        shots = sys.argv[sys.argv.index('--shots') + 1]
        args = [a for a in args if a != shots]
        os.makedirs(shots, exist_ok=True)
    want = set(args) or {'routes', 'theme', 'seq', 'hatch', 'keys', 'copy', 'pace', 'ask', 'nav'}
    base = serve()
    b = Browser()
    b.preload(SAMPLER)
    try:
        if 'copy' in want:
            t_copy(b, base)
        if 'pace' in want:
            t_pace(b, base)
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
        if 'ask' in want:
            t_ask(b, base, shots)
        if 'nav' in want:
            t_nav(b, base, shots)
    finally:
        b.close()
    print('\n%d failure(s)%s' % (len(FAILS), (': ' + ', '.join(FAILS)) if FAILS else ''))
    sys.exit(len(FAILS))


if __name__ == '__main__':
    main()

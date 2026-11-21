/* VFINAL shell: picks the approved board for this route, range and theme, and mounts it (assets/vf/dc.js).
   ROUTES  '' / in-page anchors -> Landing (first visit per tab: Loading over it, then the hand-off)
           #/about -> About · #/carry #/optiflow #/specimen #/audit #/sbl #/craigslist -> the continuous case study
   RANGES  < 1024 mobile board · 1024-2303 desktop board · >= 2304 ultrawide board (02, RANGES r2b). Case pages are one
           fluid board at every width. Crossing a range boundary reloads into the other board (no board mounts twice).
   THEME   light on every fresh visit; dark only through the toggle, persisted in localStorage['pf-theme'] (R1). The
           light boards are the approved light design, so a switch reloads into them, keeping the scroll position. */
(function () {
  'use strict';
  var CASES = { carry: 'Carry', optiflow: 'OptiFlow', specimen: 'Specimen', audit: 'Audit', sbl: 'SBL', craigslist: 'Craigslist' };
  var SHELL = {
    loading: { d: 'VF-1-Loading%-r7', uw: 'VF-1-Loading%-uw-r7', m: 'VF-1-Loading%-m-r7' },
    landing: { d: 'VF-2-Landing%-r18', uw: 'VF-2-Landing%-uw-r18', m: 'VF-2-Landing%-m-r22' },
    about: { d: 'VF-4-About%-r3', uw: 'VF-4-About%-uw-r3', m: 'VF-4-About%-m-r8' }
  };
  var TITLE = 'Sarthak Sahoo, Product Designer';
  var theme = document.documentElement.getAttribute('data-vf-theme') === 'light' ? 'light' : 'dark';
  function range() { var w = window.innerWidth; return w < 1024 ? 'm' : (w >= 2304 ? 'uw' : 'd'); }
  function route() {
    var m = /^#\/([\w-]+)/.exec(location.hash);
    if (!m) return { k: 'landing' };
    if (m[1] === 'about') return { k: 'about' };
    if (CASES[m[1]]) return { k: 'case', s: CASES[m[1]] };
    return { k: 'landing' };
  }
  function board(k, r) {
    var q = /[?&]board=([\w-]+)/.exec(location.search);
    if (q && k !== 'loading') return q[1];
    if (k === 'case') return route().s + (theme === 'light' ? '-light' : '');
    return SHELL[k][r].replace('%', theme === 'light' ? '-light' : '');
  }
  function load(name) {
    return fetch('vf/boards/' + name + '.html').then(function (r) {
      if (!r.ok) throw new Error('board ' + name + ' ' + r.status);
      return r.text();
    }).then(function (t) { return new DOMParser().parseFromString(t, 'text/html'); });
  }

  var R = route(), RG = range(), cur = null;

  /* SITE CONTROLS (theme R1, motion R4). No board designs them, so they reuse the boards' own components:
     desktop / ultrawide - icon buttons after the header nav links, drawn like the board's Menu glyph (1.5px currentColor
     strokes, round caps), --mute at rest and --ink on hover like the links, the shared 2px --acc focus ring, a 44px
     target; icons, not words, so the board's header still fits on one line at 1024. Named by aria-label (and title).
     Mobile - text rows of the menu sheet (.mni, 56px) after About, so the header keeps the board's identity + Menu only. */
  var ICON = {
    moon: '<path d="M15.5 12.6A6.5 6.5 0 0 1 7.4 4.5a6.5 6.5 0 1 0 8.1 8.1z"/>',
    sun: '<circle cx="10" cy="10" r="3.4"/><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/>',
    pause: '<path d="M7 4.5v11M13 4.5v11"/>',
    play: '<path d="M6.5 4.2v11.6L16 10z" stroke-linejoin="round"/>'
  };
  function face(b, text, icon) {
    if (b.classList.contains('mni')) { b.textContent = text; return; }
    b.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' + ICON[icon] + '</svg>';
    b.setAttribute('aria-label', text); b.title = text;
  }
  function control(host, cls) {
    var b = document.createElement('button');
    b.type = 'button';
    var mnl = host.querySelector('ul.mnl');
    if (mnl) { b.className = 'mni ' + cls; var li = document.createElement('li'); li.appendChild(b); mnl.appendChild(li); return b; }
    var head = host.querySelector('header nav[aria-label="Primary"]');
    if (!head) return null;
    b.className = 'vf-ctl ' + cls;
    head.appendChild(b);
    return b;
  }
  /* the toggle names the theme it switches to; the light boards are separate approved boards, so it reloads into them */
  function toggle(host) {
    var b = control(host, 'vf-tg');
    if (!b) return;
    face(b, theme === 'dark' ? 'Light mode' : 'Dark mode', theme === 'dark' ? 'sun' : 'moon');
    b.addEventListener('click', function () {
      try { localStorage.setItem('vf-theme', theme === 'dark' ? 'light' : 'dark'); sessionStorage.setItem('vf-y', String(window.scrollY)); } catch (e) {}
      internalReload();
    });
  }

  /* MOTION CONTROL (R4, WCAG 2.2.2). The Morph emblem (29.4s), the sculpture turn (30s), the Scale walkthrough (~23.2s)
     and the live originals loop; no board designs a control, so it is a sibling of the theme toggle with the same type.
     Paused = every CSS animation in the page and in its same-origin artifact frames holds where it is, their
     requestAnimationFrame callbacks wait at a gate (the boards' own PERF gate shape, w.__pfRaf / __pfQ / __pfPaused),
     and the Scale walkthrough gets its own pause message. Play resumes from the same frame. Persisted per visitor. */
  var still = false;
  try { still = localStorage.getItem('vf-motion') === 'paused'; } catch (e) {}
  /* SCRIPT-DRIVEN LOOPS (the case-study originals run their own modules in this page; artifact frames run theirs).
     Nothing inside them is changed: their window's scheduling is gated instead. While paused, a frame or timer
     callback that re-schedules itself from inside a frame / timer callback (a loop) is held, and setInterval ticks
     are skipped; a first call from user input still runs, so the page stays operable. Play releases the held
     callbacks, so every loop continues from where it stopped. */
  function gate(w) {
    if (!w || w.__vfGate) return;
    var g = w.__vfGate = { on: false, inR: false, inT: false, hR: [], hT: [] };
    var raf = w.requestAnimationFrame.bind(w), st = w.setTimeout.bind(w), si = w.setInterval.bind(w);
    w.requestAnimationFrame = function (cb) {
      if (g.on && g.inR) { g.hR.push(cb); return 0; }
      return raf(function (t) { var p = g.inR; g.inR = true; try { cb(t); } finally { g.inR = p; } });
    };
    w.setTimeout = function (fn, ms) {
      if (typeof fn !== 'function') return st.apply(w, arguments);
      var a = [].slice.call(arguments, 2);
      if (g.on && g.inT) { g.hT.push([fn, ms, a]); return 0; }
      return st(function () { var p = g.inT; g.inT = true; try { fn.apply(w, a); } finally { g.inT = p; } }, ms);
    };
    w.setInterval = function (fn, ms) {
      if (typeof fn !== 'function') return si.apply(w, arguments);
      var a = [].slice.call(arguments, 2);
      return si(function () { if (!g.on) fn.apply(w, a); }, ms);
    };
    g.set = function (on) {
      g.on = on;
      if (!on) { g.hR.splice(0).forEach(function (cb) { w.requestAnimationFrame(cb); }); g.hT.splice(0).forEach(function (x) { w.setTimeout.apply(w, [x[0], x[1]].concat(x[2])); }); }
    };
  }
  gate(window);
  function frames(on) {
    [].forEach.call(document.querySelectorAll('x-dc iframe'), function (f) {
      var w, d; try { w = f.contentWindow; d = f.contentDocument; } catch (e) { return; }
      if (!w || !d) return;
      gate(w); w.__vfGate.set(on);
      if (!w.__pfRaf) { w.__pfRaf = w.requestAnimationFrame; w.__pfQ = [];
        w.requestAnimationFrame = function (cb) { if (w.__pfPaused) { w.__pfQ.push(cb); return 0; } return w.__pfRaf.call(w, cb); }; }
      var st = d.getElementById('vf-still');
      if (on && !st) { st = d.createElement('style'); st.id = 'vf-still'; st.textContent = '*,*::before,*::after{animation-play-state:paused!important}'; (d.head || d.documentElement).appendChild(st); }
      if (!on && st) st.parentNode.removeChild(st);
      if (on) w.__pfPaused = true;
      else if (w.__pfPaused && !d.getElementById('pf-pause')) { w.__pfPaused = false; w.__pfQ.splice(0).forEach(function (cb) { w.__pfRaf.call(w, cb); }); }
      if (f.classList.contains('sw-live')) try { w.postMessage({ scale: on ? 'pause' : 'play' }, '*'); } catch (e) {}
    });
  }
  function motion(host) {
    var b = control(host, 'vf-motion');
    if (!b) return;
    function set() {
      document.documentElement.classList.toggle('vf-still', still);
      window.__vfGate.set(still);
      face(b, still ? 'Play motion' : 'Pause motion', still ? 'play' : 'pause');
      frames(still);
    }
    b.addEventListener('click', function () { still = !still; try { localStorage.setItem('vf-motion', still ? 'paused' : 'playing'); } catch (e) {} set(); });
    set();
    /* frames are created lazily as slots come into view: hold each new one too while paused */
    new MutationObserver(function () { if (still) frames(true); }).observe(host, { childList: true, subtree: true });
    [].forEach.call(host.querySelectorAll('iframe'), function (f) { f.addEventListener('load', function () { if (still) frames(true); }); });
    host.addEventListener('load', function (e) { if (still && e.target.tagName === 'IFRAME') frames(true); }, true);
  }

  /* SLOT FOCUS. The board rings a live slot (.pf-focus) while a focus-visible control inside its artifact has focus;
     Tab can also land on the artifact frame itself (its document, no control yet), which raises no focusin inside.
     The frame window's own focus / blur complete that case with the same class, so the ring is never missing. */
  function slotRing(host) {
    function hook(f) {
      if (f.__vfRing) return; var slot = f.closest('.pf-live,.pf-prev'); if (!slot) return;
      var w; try { w = f.contentWindow; } catch (e) { return; } if (!w) return; f.__vfRing = 1;
      var on = function () { slot.classList.add('pf-focus'); }, off = function () { slot.classList.remove('pf-focus'); };
      /* the frame's colour-scheme follows its document's, so the browser never paints an opaque backdrop behind the
         original (the board fixes this for slots 03 / 05 / 06 only; the same presentation rule, every slot) */
      var cs = function () { try { var c = getComputedStyle(f.contentDocument.documentElement).colorScheme; if (c && c !== 'normal') f.style.colorScheme = c; } catch (e) {} };
      cs(); f.addEventListener('load', cs);
      var bindW = function () { try { var ww = f.contentWindow; if (ww.__vfRing) return; ww.__vfRing = 1; ww.addEventListener('focus', on); ww.addEventListener('blur', off); } catch (e) {} };
      bindW(); f.addEventListener('load', bindW);
    }
    function scan() { [].forEach.call(host.querySelectorAll('.pf-live iframe, .pf-prev iframe'), hook); }
    scan(); new MutationObserver(scan).observe(host, { childList: true, subtree: true });
    /* and from this side: focus leaving this window for a slot frame (blur here), or returning (focusin here) */
    function sync() { var a = document.activeElement, cur = a && a.tagName === 'IFRAME' ? a.closest('.pf-live,.pf-prev') : null;
      [].forEach.call(host.querySelectorAll('.pf-live.pf-focus,.pf-prev.pf-focus'), function (x) { if (x !== cur && !(x.contains(a) && a.tagName === 'IFRAME')) x.classList.remove('pf-focus'); });
      if (cur) cur.classList.add('pf-focus'); }
    window.addEventListener('blur', function () { setTimeout(sync, 0); });
    document.addEventListener('focusin', sync);
  }

  /* WHEEL CENTRING (narrow desktop). The board scales the wheel by ws = min(stage w / Wd, stage h / (cb - a), max) and
     hangs it from the shared top line. Height-bound (the 1440 / 2560 boards, and wider) it fills its row exactly; at
     narrow desktop widths (1024 to ~1400) it is width-bound and left an empty floor above the pager. The spare height,
     stage h - ws x (cb - a) (--vf-wh, from the board's own G), is shared above and below the wheel; it is zero whenever
     the wheel is height-bound, so the approved boards are unchanged. Moves the camera with `translate`, never its
     transform or scale. */
  /* CASE-STUDY HEADINGS (usability pass): the ported originals mark their section titles as span.ar-h2 (OptiFlow uses
     h2.ar-h2 for the same role), so Carry, Specimen and Audit jumped from h1 to h3. They are exposed as level-2
     headings; nothing about their look, copy or order changes. */
  function headings(host) {
    [].forEach.call(host.querySelectorAll('span.ar-h2'), function (h) { h.setAttribute('role', 'heading'); h.setAttribute('aria-level', '2'); });
    /* and no level is skipped: a heading deeper than one below the previous (e.g. persona-card h4s straight under a
       section h2) is announced one level below it; tags and styles untouched */
    var prev = 1;
    [].forEach.call(host.querySelectorAll('h1,h2,h3,h4,h5,h6,[role=heading]'), function (h) {
      if (h.closest('[hidden],iframe,nav.pnav')) return;
      var lv = +(h.getAttribute('aria-level') || h.tagName.charAt(1)) || prev;
      if (lv > prev + 1) { lv = prev + 1; h.setAttribute('aria-level', String(lv)); if (!/^H[1-6]$/.test(h.tagName)) h.setAttribute('role', 'heading'); }
      prev = lv;
    });
  }

  /* PHASE NAV vs PROTOTYPES (usability pass). The originals' floating phase control (nav.pnav, fixed) may sit over an
     interactive prototype or a figure while scrolling on phones. While it would overlap one it steps aside (fades,
     no pointer events) and returns as soon as it clears; it never hides while it holds keyboard focus, and it stays in
     the page for assistive tech throughout. */
  function pnavClear(host) {
    var nav = host.querySelector('nav.pnav'); if (!nav) return;
    var SEL = '.cu-embed,.ar-demo .cu-stage,iframe,video,figure,[data-cu],.ofw,.us,.pp,.bim';
    var st = document.createElement('style');
    st.textContent = 'nav.pnav{transition:opacity .2s ease,visibility .2s}nav.pnav.vf-aside{opacity:0;visibility:hidden;pointer-events:none}@media (prefers-reduced-motion: reduce){nav.pnav{transition:none}}';
    document.head.appendChild(st);
    var q = 0;
    function chk() {
      q = 0; if (nav.contains(document.activeElement)) { nav.classList.remove('vf-aside'); return; }
      nav.classList.remove('vf-aside'); var r = nav.getBoundingClientRect(); if (!r.height) return;
      var hit = [].some.call(host.querySelectorAll(SEL), function (e) { if (nav.contains(e)) return false; var b = e.getBoundingClientRect();
        return b.width > 40 && b.height > 40 && b.left < r.right && b.right > r.left && b.top < r.bottom + 8 && b.bottom > r.top - 8; });
      if (hit) nav.classList.add('vf-aside');
    }
    function sch() { if (!q) q = requestAnimationFrame(chk); }
    addEventListener('scroll', sch, { passive: true }); addEventListener('resize', sch); nav.addEventListener('focusin', chk); chk();
  }

  /* PROJECT CARDS OPEN THEIR PROJECT (owner, 2026-11-21). In the browser, a neighbour's card still comes forward on
     the first click (the board's own tap); the ACTIVE card - click, Enter or Space - now opens the project. In the
     project list (desktop index rows, mobile rows), a row opens its project. Destinations are the verified ones the
     board's "View Project" links already carry (tools/vfinal_build.py PROJ). Clicks inside a live PCV stay inside its
     own document, so a prototype's controls never navigate. */
  var DEST = { 'Craigslist Redesign': '#/craigslist', 'Carry': '#/carry', 'Cryptography Explained': 'https://rockysahooart.github.io/encryption-coffee-shop/',
    'Oncology Specimen Kit': '#/specimen', 'OptiFlow': '#/optiflow', 'Design System Audit': '#/audit',
    'AI Design Governance': './slop-audit.pdf', 'Securities-Based Lending': '#/sbl', 'Scale': 'https://spiky-experiences-472785.framer.app/scale-market' };
  function go(t) {
    var u = DEST[t]; if (!u) return false;
    var a = document.createElement('a'); a.href = u;
    if (/^https?:/.test(u)) { a.target = '_blank'; a.rel = 'noopener'; } else if (/\.pdf$/.test(u)) a.setAttribute('download', '');
    document.body.appendChild(a); a.click(); a.remove(); return true;
  }
  function rowTitle(el) { for (var t in DEST) { if ((el.innerText || el.textContent || '').indexOf(t) >= 0) return t; } return null; }
  function openCards(host) {
    if (R.k !== 'landing') return;
    [].forEach.call(host.querySelectorAll('.spec .hit'), function (b) { b.style.cursor = 'pointer'; });
    host.addEventListener('click', function (e) {
      var hit = e.target.closest && e.target.closest('.spec .hit');
      if (hit && hit.closest('.spec').classList.contains('front')) { if (go(hit.getAttribute('aria-label'))) { e.preventDefault(); e.stopPropagation(); } return; }
      var row = e.target.closest && e.target.closest('.vix li button, .idx li button, .idx .xh button');
      if (row) { var t = rowTitle(row.closest('li') || row); if (t && go(t)) { e.preventDefault(); e.stopPropagation(); } }
    }, true);
    host.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var hit = document.activeElement; if (!hit || !hit.matches('.spec.front .hit')) return;
      if (go(hit.getAttribute('aria-label'))) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* PHONE GUTTER FOR PROJECT CARDS (owner, 2026-11-21). On phones the mobile board scales its wheel to the full
     width, so the widest Project Cards (PCV + Plinth: Cryptography, Specimen, OptiFlow, SBL) reached within 1px of
     the screen edges and read as cut off. One shared rule: the camera is scaled about its own origin so a full-width
     unit keeps a 16px gutter each side - k = (w - 32) / (w - 2) - for every project alike (no per-card offsets). */
  function phoneGutter(host) {
    var cam = host.querySelector('#vfmcam'), root = host.querySelector('#vfmroot');
    if (!cam || !root) return;
    function f() { var w = root.clientWidth; cam.style.scale = Math.min(1, (w - 32) / (w - 2)).toFixed(4); }
    f(); try { new ResizeObserver(f).observe(root); } catch (e) {}
  }

  function wheelCentre(host) {
    var land = host.querySelector('.land'), st = land && land.querySelector('.stage'), cam = st && st.querySelector('.cam');
    if (!cam) return;
    var wh = parseFloat(getComputedStyle(land).getPropertyValue('--vf-wh')) || 0;
    if (!wh) return;
    function f() {
      var ws = parseFloat(getComputedStyle(cam).getPropertyValue('--ws')) || 1;
      var spare = st.clientHeight - ws * wh, v = spare > 1 ? '0px ' + (spare / 2).toFixed(1) + 'px' : '';
      if (cam.style.translate !== v) cam.style.translate = v;
    }
    try { new ResizeObserver(function () { requestAnimationFrame(f); }).observe(st); } catch (e) {}
    new MutationObserver(function () { requestAnimationFrame(f); }).observe(cam, { attributes: true, attributeFilter: ['style'] });
    f();
  }

  /* links the boards leave as placeholders (Illustration, Music, Résumé): no verified destination, so not links (R5) */
  /* LOADING ON EVERY ENTRY (owner, 2026-11-21): the Loading is the first thing on every fresh visit, return visit and
     browser refresh, at any address. Only the site's own reloads skip it - a route change, the theme toggle, a range
     change - which mark themselves in this tab just before they reload (consumed once). No visit is remembered.
     localStorage['vf-qa-skip-loading'] is the test harness's switch (tools/vfcheck.py), never set by the site. */
  function internalReload() { try { sessionStorage.setItem('vf-internal', '1'); } catch (e) {} location.reload(); }
  function entry() {
    var internal = false;
    try { internal = sessionStorage.getItem('vf-internal') === '1'; sessionStorage.removeItem('vf-internal');
      if (localStorage.getItem('vf-qa-skip-loading') === '1') internal = true; } catch (e) {}
    return !internal && !/[?&]board=/.test(location.search);
  }

  /* Placeholder destinations with nothing verified behind them (Résumé) are removed, not left as dead controls (R5,
     usability pass); if the link was its line's only content, the line goes with it. */
  function disable(host) {
    [].forEach.call(host.querySelectorAll('a[data-vf-off]'), function (a) {
      a.removeAttribute('href'); a.setAttribute('tabindex', '-1'); a.hidden = true; a.style.display = 'none';
      var p = a.parentNode; if (p && p !== host && !p.textContent.replace(a.textContent, '').trim()) { p.hidden = true; p.style.display = 'none'; }
    });
  }

  function title(host) {
    var h = host.querySelector('h1');
    if (R.k === 'about') document.title = 'About · ' + TITLE;
    else if (R.k === 'case' && h) document.title = h.textContent.replace(/\s+/g, ' ').trim() + ' · ' + TITLE;
    else document.title = TITLE;
  }

  function landingAnchor() {
    var h = location.hash;
    if (!h || h.charAt(1) === '/') return;
    var id = h.slice(1), t = id === 'top' ? document.body : (document.getElementById(id) || (id === 'projects' && document.querySelector('.vix, #vfmgrp')));
    /* #projects: the board's Projects destination - the project index (desktop / ultrawide) or the project carousel the
       mobile "View Projects" button already targets (#vfmgrp); case pages' "All projects" lands here too */
    if (t && t !== document.body) t.scrollIntoView();
  }

  function start() {
    var main = document.getElementById('vf');
    var first = false;
    first = entry();
    /* the Loading frame goes up before any page content is built, on the page's own ground, so no Landing / case
       content is ever visible before it */
    if (first) loading(board('loading', RG));
    var jobs = [load(board(R.k, RG))];
    
    Promise.all(jobs).then(function (docs) {
      cur = VFDC.mount(docs[0], main);
      disable(cur.el); if (R.k !== 'about') motion(cur.el); toggle(cur.el); slotRing(cur.el); wheelCentre(cur.el); phoneGutter(cur.el); openCards(cur.el); if (R.k === 'case') { headings(cur.el); pnavClear(cur.el); } title(cur.el);
      /* SCROLL ON ENTRY: history.scrollRestoration is manual (head script), so every entry starts at 0 - fresh visit,
         refresh, Back, the brand or nav link. Only a theme switch (vf-y, same page) or an explicit in-page anchor
         (#projects, #top) places it elsewhere. */
      window.scrollTo(0, 0);
      try { var y = sessionStorage.getItem('vf-y'); if (y != null) { sessionStorage.removeItem('vf-y'); window.scrollTo(0, +y); } else landingAnchor(); } catch (e) { landingAnchor(); }
      document.documentElement.setAttribute('data-vf', 'ready');
    }).catch(function (e) { setTimeout(function () { throw e; }); });
  }

  /* LOADING (first visit per tab): over the Landing, runs once (no canvas loop), hands off on data-done with the
     interim 300ms cross-fade (04 HAND-OFF; the seamless move awaits the owner, G8). The Landing beneath is inert
     until then. 'pf:ready' fires once the page has loaded, so the bar reports real progress. */
  function loading(name) {
    var ov = document.createElement('iframe');
    ov.id = 'vf-loading'; ov.title = 'Loading'; ov.src = 'vf/frame.html?b=' + name;
    ov.style.background = theme === 'dark' ? '#1F2023' : '#ECE7DE';
    document.body.appendChild(ov);
    var main = document.getElementById('vf');
    main.setAttribute('inert', ''); main.setAttribute('aria-hidden', 'true');
    var done = false, L = null, skipAsk = false;
    /* skip from the very first frame: Escape / Enter / Space here (before the frame has focus or has mounted), or a
       click on the frame before its board is ready; the board's own skip (done('skip')) settles and hands off */
    function skipNow() { try { if (L && L.comp && L.comp.done) L.comp.done('skip'); else skipAsk = true; } catch (e) { hand(); } }
    function onKey(e) { if (!done && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); skipNow(); } }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', skipNow);
    function hand() {
      if (done) return; done = true;
      document.removeEventListener('keydown', onKey);
      main.removeAttribute('inert'); main.removeAttribute('aria-hidden');
      ov.classList.add('out');
      setTimeout(function () { try { if (L) L.unmount(); } catch (e) {} if (ov.parentNode) ov.parentNode.removeChild(ov);
        /* focus leaves the finished Loading frame for the document itself - never a heading (a focused h1 drew the
           browser's ring around the hero, 2026-11-21) - so the next Tab starts at the top of the page */
        if (document.activeElement === ov || !document.activeElement || document.activeElement === document.body) { try { ov.blur(); } catch (x) {} }
        window.scrollTo(0, 0); }, 320);
    }
    window.addEventListener('message', function on(e) {
      if (e.source !== ov.contentWindow || !e.data || e.data.vf !== 'loading-mounted') return;
      window.removeEventListener('message', on);
      var w = ov.contentWindow, d = ov.contentDocument; L = w.VFL;
      if (skipAsk) { skipNow(); }
      var root = d.querySelector('.root');
      var ls = d.querySelector('.vf-ls');
      /* the sculpture frame scales to fit the viewport (tools/vfinal_build.py: .vf-ls); text keeps its own sizes */
      function fit() {
        if (!ls) return;
        if (ls.getAttribute('data-flow')) {
          /* mobile group: the sculpture takes the height its siblings leave (name, loading info, action), within the
             safe-area padding, never wider than the screen and never above its own frame size */
          var root = ls.parentNode, cs = w.getComputedStyle(root), used = 0;
          [].forEach.call(root.children, function (c) { if (c === ls) return; var p = w.getComputedStyle(c).position;
            if (p === 'absolute' || p === 'fixed' || c.hidden) return; var m = w.getComputedStyle(c);
            used += c.offsetHeight + parseFloat(m.marginTop) + parseFloat(m.marginBottom); });
          var lm = w.getComputedStyle(ls), avail = root.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - used - parseFloat(lm.marginTop) - parseFloat(lm.marginBottom);
          var sc = Math.max(0.45, Math.min(1, (root.clientWidth + 48) / 390, avail / +ls.getAttribute('data-h')));
          ls.style.setProperty('--vf-s', sc.toFixed(4)); return;
        }
        ls.style.setProperty('--vf-s', Math.min(w.innerWidth / ls.offsetWidth, w.innerHeight / ls.offsetHeight).toFixed(4));
      }
      fit(); w.addEventListener('resize', fit); try { w.visualViewport.addEventListener('resize', fit); } catch (x) {}
      var go = d.querySelector('a[aria-label="Start here"]');
      if (go) { go.addEventListener('click', function (ev) { ev.preventDefault(); }); try { ov.focus(); go.focus(); } catch (x) {} }
      [].forEach.call(d.querySelectorAll('a.skip'), function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); }); });
      if (root) { new MutationObserver(function () { if (root.hasAttribute('data-done')) hand(); }).observe(root, { attributes: true });
        if (root.hasAttribute('data-done')) hand(); /* reduced motion can finish before this message arrives */ }
      function ready() { w.dispatchEvent(new w.Event('pf:ready')); }
      if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready);
    });
  }

  window.addEventListener('hashchange', function () {
    var n = route();
    if (n.k !== R.k || n.s !== R.s) { window.scrollTo(0, 0); internalReload(); }
    else if (R.k === 'landing') landingAnchor();
  });
  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (R.k !== 'case' && range() !== RG) { internalReload(); } }, 250);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

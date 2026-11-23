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
  /* VFINAL2 (owner, 2026-11-22: the full VFINAL2 design; design-handoff/12-vfinal2-source-manifest.md). Its board
     names put the range before the theme: VF2-2-Landing-uw-light-r29, VF2-1-Loading-m-light-r5, VF2-4-About-light. */
  var SHELL = {
    loading: { d: ['VF2-1-Loading', 'r4'], uw: ['VF2-1-Loading-uw', 'r4'], m: ['VF2-1-Loading-m', 'r5'] },
    /* ultrawide-first (owner, 2026-11-23): the approved ultrawide Landing is the Landing at every desktop width,
       fitted by vf2Fit; its text keeps readable screen sizes through --vfz (tools/vfinal_build.py) */
    landing: { d: ['VF2-2-Landing-uw', 'r29'], uw: ['VF2-2-Landing-uw', 'r29'], m: ['VF2-2-Landing-m', 'r32'] },
    about: { d: ['VF2-4-About', ''], uw: ['VF2-4-About-uw', ''], m: ['VF2-4-About-m', 'r6'] }
  };
  var TITLE = 'Sarthak Sahoo, Product Designer';
  var theme = document.documentElement.getAttribute('data-vf-theme') === 'light' ? 'light' : 'dark';
  /* ONE COMPOSITION FROM 1024 UP (owner, 2026-11-23; replaces the 2304 ultrawide band and its 1200px-height gate).
     The ultrawide boards were a second layout with their own type sizes and proportions; desktop and ultrawide now show
     the same desktop composition, fitted by width and height (vf2Fit), so 1440x900 and 3440x900 read at the same
     scale and extra width becomes surrounding space. The -uw boards stay in vf/boards for rollback. */
  function range() { return window.innerWidth < 1024 ? 'm' : 'd'; }
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
    var b = SHELL[k][r];
    return b[0] + (theme === 'light' ? '-light' : '') + (b[1] ? '-' + b[1] : '');
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
      try { sessionStorage.setItem('vf-theme', theme === 'dark' ? 'light' : 'dark'); sessionStorage.setItem('vf-y', String(window.scrollY)); } catch (e) {}
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
      var on = function () { if (kb) slot.classList.add('pf-focus'); }, off = function () { slot.classList.remove('pf-focus'); };
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
    var kb = false;
    document.addEventListener('keydown', function () { kb = true; }, true);
    document.addEventListener('pointerdown', function () { kb = false; }, true);
    function sync() { if (!kb) return; var a = document.activeElement, cur = a && a.tagName === 'IFRAME' ? a.closest('.pf-live,.pf-prev') : null;
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
     project list, a desktop / ultrawide index row opens its project; on phones the list is the board's accordion. Destinations are the verified ones the
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
      /* desktop / ultrawide index rows open their project; the mobile list keeps the board's own accordion (owner,
         2026-11-21): a row expands in place to the project's card, and only its View Project link navigates */
      var row = e.target.closest && e.target.closest('.vix li button');
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
  /* PHONE PROJECT GALLERY (owner, 2026-11-23; replaces the phone Orbit carousel, its filter and the All projects
     accordion). The nine projects stack in their order as chapters: the project's own display (PCV on its glass plinth,
     sized by the board's own apply() exactly as when selected, then scaled to one rhythm: the 345px column or 440px
     tall), its title, its subtitle and one CTA named for where it goes. Nothing is rebuilt: the board's elements are
     moved, not copied. Scrolling only; the CTA is the only link; interactive artifacts keep their own input. */
  function gallery(c) {
    var host = c && c.el, comp = c && c.comp; if (!host || !comp || RG !== 'm' || R.k !== 'landing') return;
    var root = host.querySelector('.root'), st = root && root.querySelector('.stage'), sec = st && st.parentNode;
    if (!st || typeof comp.apply !== 'function') return;
    var order = [].map.call(root.querySelectorAll('.idx > li[data-n]'), function (li) { return li.getAttribute('data-n'); });
    var sel0 = comp.sel, size = {};
    order.forEach(function (n) {
      var a = st.querySelector('.art[data-n="' + n + '"]'), ld = root.querySelector('.ld[data-n="' + n + '"]');
      if (!a || !ld || !ld.querySelector('a.pc[href]')) return; /* the hidden, unlaunched tenth project has no destination */
      try { comp.sel = n; comp.apply(true, 1); } catch (e) {}
      size[n] = [parseFloat(a.style.width) || a.offsetWidth, parseFloat(a.style.height) || a.offsetHeight];
    });
    try { comp.sel = sel0; comp.apply(true, 1); } catch (e) {}
    var gal = document.createElement('div'); gal.className = 'vf-gal'; gal.id = 'vf-gallery';
    order.forEach(function (n) {
      if (!size[n]) return;
      var a = st.querySelector('.art[data-n="' + n + '"]'), ld = root.querySelector('.ld[data-n="' + n + '"]'),
          h = root.querySelector('.hx[data-n="' + n + '"] h3.pt'), pc = ld.querySelector('a.pc'), href = pc.getAttribute('href') || '';
      var ch = document.createElement('article'); ch.className = 'vf-ch'; ch.setAttribute('data-n', n);
      var fig = document.createElement('div'); fig.className = 'vf-fig';
      a.style.setProperty('width', size[n][0] + 'px', 'important'); a.style.setProperty('height', size[n][1] + 'px', 'important');
      fig.appendChild(a); ch.appendChild(fig);
      if (h) { h.removeAttribute('tabindex'); ch.appendChild(h); }
      var lead = ld.querySelector('p.lead'); if (lead) ch.appendChild(lead);
      pc.textContent = /^#\//.test(href) ? 'View case study' : (/\.pdf$/i.test(href) ? 'View project' : 'View experience');
      ch.appendChild(pc);
      gal.appendChild(ch);
    });
    if (!gal.children.length) return;
    sec.insertBefore(gal, st);
    root.classList.add('vf-gallery');
    /* one rhythm at any phone width: the column's own width (padding out) or 440px tall, whichever binds first */
    function fit() { var col = gal.clientWidth - 48;
      [].forEach.call(gal.querySelectorAll('.vf-ch'), function (ch) { var n = ch.getAttribute('data-n'), a = ch.querySelector('.art'), f = ch.querySelector('.vf-fig');
        var k = Math.min(Math.min(col, 345) / size[n][0], 440 / size[n][1]); a.style.setProperty('--vf-k', k.toFixed(4));
        f.style.height = Math.round(size[n][1] * k + 56) + 'px'; }); }
    fit(); window.addEventListener('resize', fit);
  }

  function phoneGutter(host) {
    var cam = host.querySelector('#vfmcam'), root = host.querySelector('#vfmroot');
    if (!cam || !root) return;
    function f() { var w = root.clientWidth; cam.style.scale = Math.min(1, (w - 32) / (w - 2)).toFixed(4); }
    f(); try { new ResizeObserver(f).observe(root); } catch (e) {}
  }

  /* READING JOURNEY (assets/vf/journeys.js): the short, first-person overview after a case study's masthead. Each
     step's button scrolls to its full section (no hash change: hashes are routes here). Nothing on the page moves. */
  function journey(host) {
    var J = window.VF_JOURNEYS && R.k === 'case' ? window.VF_JOURNEYS[route().s.toLowerCase()] : null;
    var mast = host.querySelector('header.ar-mast');
    if (!J || !mast) return;
    var rmq = false; try { rmq = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var sec = document.createElement('section'); sec.className = 'vf-jr'; sec.setAttribute('aria-labelledby', 'vf-jr-h');
    var h = document.createElement('h2'); h.id = 'vf-jr-h'; h.className = 'vf-jr-h'; h.textContent = J.title; sec.appendChild(h);
    var ol = document.createElement('ol'); ol.className = 'vf-jr-l';
    J.steps.forEach(function (st) {
      var li = document.createElement('li');
      var t = document.createElement('h3'); t.className = 'vf-jr-t'; t.textContent = st[0];
      var p = document.createElement('p'); p.className = 'vf-jr-p'; p.textContent = st[1];
      li.appendChild(t); li.appendChild(p);
      var target = st[2] && host.querySelector(st[2]);
      if (target) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'vf-jr-go';
        b.innerHTML = '<span></span><span aria-hidden="true">\u2193</span>'; b.firstChild.textContent = st[3];
        b.addEventListener('click', function () {
          target.scrollIntoView({ behavior: rmq ? 'auto' : 'smooth', block: 'start' });
          var f = target.querySelector('h2,h3,[role=heading]') || target; if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '-1');
          try { f.focus({ preventScroll: true }); } catch (e) {}
        });
        li.appendChild(b);
      }
      ol.appendChild(li);
    });
    sec.appendChild(ol);
    mast.parentNode.insertBefore(sec, mast.nextSibling);
  }

  /* MOBILE LIST ACCORDION, CARD CENTRING (owner, 2026-11-21). The board sizes each expanded card and pins it to the
     left of the text column, some with a built-in offset, so cards sat 0-21px left of the column and none centred.
     One shared rule: the visible plane of the open card (.gp, or the card itself) is centred in the column the title
     and description use, measured on the card, applied with translate only (no reflow, no per-project numbers). */
  function accCentre(host) {
    var idx = host.querySelector('section.idx'); if (!idx) return;
    function f() {
      [].forEach.call(idx.querySelectorAll('.xp.on .xpv'), function (xv) {
        var xf = xv.querySelector('.xpf'); if (!xf) return;
        xf.style.translate = '';
        var g = xf.querySelector('.gp') || xf.firstElementChild || xf, r = g.getBoundingClientRect(), v = xv.getBoundingClientRect();
        if (!r.width) return;
        var c0 = v.left + parseFloat(getComputedStyle(xv).paddingLeft), cw = v.right - c0;
        xf.style.translate = Math.round(c0 + (cw - r.width) / 2 - r.left) + 'px 0';
      });
    }
    new MutationObserver(function () { requestAnimationFrame(f); }).observe(idx, { subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'style'] });
    try { new ResizeObserver(function () { requestAnimationFrame(f); }).observe(idx); } catch (e) {}
  }

  /* EDITORIAL CHIPS WITHOUT EMOJI (owner, 2026-11-22; Iris). The case studies' review chips and constraint lists
     (.tk__m, .rcv) tagged each source with an emoji (engineer, clipboard, clinician...). The words already name the
     source, so the pictograms are removed from those two components only; prototypes and demos are untouched. */
  function chips(host) {
    var EMO = /(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}](?:\u200D[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}])*\uFE0F?)\s*/gu;
    [].forEach.call(host.querySelectorAll('.tk__m, .rcv b, .rcv li'), function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) { if (EMO.test(n.nodeValue)) { EMO.lastIndex = 0; n.nodeValue = n.nodeValue.replace(EMO, ''); } EMO.lastIndex = 0; }
    });
  }

  /* VFINAL2 FRAME FIT (owner, 2026-11-22). The VFINAL2 desktop and ultrawide boards are exact pixel compositions
     (1440 and 2560 wide). They are shown whole at every width of their range by zooming the board to the viewport
     width (CSS zoom keeps layout and the boards' own measurements consistent; a transform would not), centred.
     Phones use the fluid m board as designed. */
  function vf2Fit(host) {
    var root = host.querySelector('.root'); if (!root || !/^VF2-/.test(board(R.k, RG)) || RG === 'm') return;
    var W = parseFloat(root.style.width) || root.offsetWidth;
    /* the board's stage (isometric scene, orbit, PCV on its plinth) is one frame tall (900 desktop / 1440 ultrawide),
       measured before any zoom. Scaling by width alone pushed it past the fold on any viewport wider than the board's
       ratio (1920x1080: a 1200px stage, the wheel below the screen, the cards floating over nothing). Same rule as the
       Loading frame (11 §4): min(vw / W, vh / H), the board centred. */
    var st = root.querySelector('.stage'), H = st ? st.offsetHeight : 0;
    /* ...and the browsing controls must be inside that height too (owner, 2026-11-22): the board's vf2-align layer rests
       the pager and arrows 100px under the exhibit, past its own 900px stage (the canvas board ran on below). The fitted
       height is therefore the lowest essential control - arrows, counter, index, Show all, the active CTA - read from the
       board's live geometry in its own px, plus 32px; the approved positions are untouched, only the scale follows. */
    var ESS = '.stage .pg, .stage .r6nav, .lc .idx, .lc .n9more, .pns a.pc';
    function extent() { var rr = root.getBoundingClientRect(), m = H;
      [].forEach.call(root.querySelectorAll(ESS), function (e) { var r = e.getBoundingClientRect(); if (r.width && r.height) m = Math.max(m, r.bottom - rr.top + 32); });
      return m; }
    function f() { var vw = document.documentElement.clientWidth, z = vw / W, Hc = H ? extent() : 0;
      if (Hc) z = Math.min(z, window.innerHeight / Hc);
      z = Math.max(0.4, Math.min(1.4, z)); root.style.zoom = z.toFixed(4); root.__vfz = +z.toFixed(4); root.style.setProperty('--vfz', z.toFixed(4)); navPos(z); }
    /* ORBIT ARROWS ON EITHER SIDE (owner, 2026-11-23; replaces the pair centred under the exhibit). Anchored to the orbit
       ring itself - its measured centre in stage px, which moves with the board's own --r5dy - and set 30.5% of the ring's
       width out on each side (bounded by both columns), level with the active display's centre: left of the orbit,
       right of it, clear of the background cards and of both columns. CSS in tools/vfinal_build.py reads --vf-nx / --vf-ny / --vf-ndx; the counter stays centred beneath.
       The target never renders under 46 screen px, whatever the fit. Navigation logic and keys are the board's. */
    function navPos(z) {
      z = z || root.__vfz || 1;
      var stg = root.querySelector('.stage'), rg = stg && stg.querySelector('.ringsv'); if (!rg) return;
      var a = stg.getBoundingClientRect(), r = rg.getBoundingClientRect(); if (!r.width) return;
      var ns = Math.max(48, 46 / z), cx = r.left + r.width / 2, room = Infinity;
      /* never into either column: 16px clear of the introduction / index and of the project copy, measured live */
      var lc = root.querySelector('.lc'), pn = root.querySelector('.pns');
      if (lc) { var lr = lc.getBoundingClientRect(); if (lr.width) room = Math.min(room, cx - lr.right - 16 - ns / 2); }
      if (pn) { var pr = pn.getBoundingClientRect(); if (pr.width) room = Math.min(room, pr.left - cx - 16 - ns / 2); }
      /* one position for every project: the board's own r6 rule - ONE height, the median resting display midline (453 of
         the 900px stage across the nine displays) - and as far out as the columns allow. The scene itself shifts per
         exhibit (--r5dy), so the ring is not a stable height reference. The widest display (OptiFlow's 540px square)
         reaches under the pair by its plain mat border only. */
      var ny = stg.offsetHeight * 0.503, dx = room;
      stg.style.setProperty('--vf-nx', (cx - a.left).toFixed(1) + 'px');
      stg.style.setProperty('--vf-ny', ny.toFixed(1) + 'px');
      stg.style.setProperty('--vf-ndx', dx.toFixed(1) + 'px');
      stg.style.setProperty('--vf-ns', ns.toFixed(1) + 'px'); /* the board rewrites each arrow's style attribute */
    }
    /* the index grows as the active row passes 04: re-measure the column bound on each project change */
    var pns0 = root.querySelector('.pns');
    if (pns0) try { new MutationObserver(function () { navPos(); }).observe(pns0, { subtree: true, attributes: true, attributeFilter: ['hidden'] }); } catch (e) {}
    /* ONE COORDINATE SPACE (owner, 2026-11-22). The board measures with getBoundingClientRect (screen px, zoom applied)
       and writes the results into translate / left / top (CSS px, zoomed again), as authored on a 1:1 canvas. Under the
       zoom above every such hand-off - the orbit's entry tweens, the PCV fly-in, the inspection box - was off by the zoom
       factor (rapid navigation: the PCV drifted 22-27px off its plinth at 0.8 / 1.2, 3px at 1). Rects of elements inside
       the zoomed board are reported in the board's own CSS px, so its geometry holds at every scale. Outside it, and at
       zoom 1, rects are untouched. */
    if (!Element.prototype.__vfRect) {
      var gb = Element.prototype.getBoundingClientRect; Element.prototype.__vfRect = gb;
      Element.prototype.getBoundingClientRect = function () {
        var r = gb.call(this), zr = document.querySelector('#vf > x-dc > .root, #vf .root'), k = zr && zr.__vfz;
        if (!k || k === 1 || !zr.contains(this)) return r;
        return new DOMRect(r.left / k, r.top / k, r.width / k, r.height / k);
      };
    }
    root.style.marginLeft = 'auto'; root.style.marginRight = 'auto';
    /* the board places its pager and arrows after mount: fit again once they are laid out */
    f(); window.addEventListener('resize', f); requestAnimationFrame(f); setTimeout(f, 400); setTimeout(f, 1500);
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
    if (first) { document.getElementById('vf').classList.add('vf-stage'); loading(board('loading', RG)); }
    window.VF_BOARD = board(R.k, RG); /* which board is mounted (VFINAL2 boards carry no t-dark / t-light class; read by tools/vfcheck.py) */
    var jobs = [load(window.VF_BOARD)];
    
    Promise.all(jobs).then(function (docs) {
      cur = VFDC.mount(docs[0], main);
      vf2Fit(cur.el); gallery(cur); disable(cur.el); if (R.k !== 'about') motion(cur.el); toggle(cur.el); slotRing(cur.el); wheelCentre(cur.el); phoneGutter(cur.el); accCentre(cur.el); openCards(cur.el); if (R.k === 'case') { journey(cur.el); chips(cur.el); headings(cur.el); pnavClear(cur.el); } title(cur.el);
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
    ov.style.background = theme === 'dark' ? '#0A0A0B' : '#EEECE7';
    document.body.appendChild(ov);
    var main = document.getElementById('vf');
    main.setAttribute('inert', ''); main.setAttribute('aria-hidden', 'true');
    var done = false, L = null, skipAsk = false, skipping = false;
    /* skip from the very first frame: Escape / Enter / Space here (before the frame has focus or has mounted), or a
       click on the frame before its board is ready; the board's own skip (done('skip')) settles and hands off */
    function skipNow() { skipping = true; try { if (L && L.comp && L.comp.done) L.comp.done('skip'); else skipAsk = true; } catch (e) { hand(); } }
    function onKey(e) { if (!done && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); skipNow(); } }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', skipNow);
    /* HAND-OFF CHOREOGRAPHY (owner, 2026-11-21). (1) The Loading form settles into its stack (the board's own
       finish) while gliding onto the Landing's sculpture - same geometry, measured on both pages - so the form
       carries the eye across; (2) the frame cross-fades away (300ms) and the Landing headline rises in (8px, 600ms);
       (3) 220ms later the supporting text and navigation, 220ms after that the project content. Opacity and
       translate only (no layout change). Skip and reduced motion go straight to the complete, usable Landing. */
    var rm = false; try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    function reveal(staged) {
      if (!staged || rm) { main.classList.remove('vf-stage', 'vf-in-1', 'vf-in-2', 'vf-in-3'); return; }
      main.classList.add('vf-in-1');
      setTimeout(function () { main.classList.add('vf-in-2'); }, 220);
      setTimeout(function () { main.classList.add('vf-in-3'); }, 440);
      setTimeout(function () { main.classList.remove('vf-stage', 'vf-in-1', 'vf-in-2', 'vf-in-3'); }, 1300);
    }
    function glide() {
      if (skipping || rm) return;
      try {
        var d = ov.contentDocument, ls = d.querySelector('.vf-ls'), a = d.querySelector('.ldc .orb'), b = main.querySelector('.emb .orb');
        if (!ls || !a || !b) return;
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), rl = ls.getBoundingClientRect();
        if (!ra.width || !rb.width || rb.bottom < 0 || rb.top > innerHeight) return;
        var k = rb.width / ra.width, sp = parseFloat(getComputedStyle(ls).scale) || 1;
        var ox = ra.left + ra.width / 2 - rl.left, oy = ra.top + ra.height / 2 - rl.top;
        var dx = rb.left + rb.width / 2 - (ra.left + ra.width / 2), dy = rb.top + rb.height / 2 - (ra.top + ra.height / 2);
        /* the status, bar and Skip have done their job (the bar is full): they fade first, so the form never passes
           over visible text on its way down to the Landing's sculpture */
        var lnb = d.querySelector('.lnb'); if (lnb) { lnb.style.transition = 'opacity .3s cubic-bezier(.2,.7,.2,1)'; lnb.style.opacity = '0'; }
        ls.style.transformOrigin = (ox / sp) + 'px ' + (oy / sp) + 'px';
        ls.style.transition = 'transform 1000ms cubic-bezier(.45,0,.2,1)';
        ls.style.transform = 'translate(' + (dx / sp) + 'px,' + (dy / sp) + 'px) scale(' + k + ')';
      } catch (e) {}
    }
    var vf2 = /^VF2-1-Loading/.test(name);
    function hand() {
      if (done) return; done = true;
      /* VFINAL2 (11 §3): the board fades its own layers over 300ms on data-done; the Landing enters only after that
         fade, sequential, never cross-faded over the type. Reduced motion hands off at once. */
      if (vf2 && !rm) { document.removeEventListener('keydown', onKey); setTimeout(hand2, 300); return; }
      hand2();
    }
    function hand2() {
      document.removeEventListener('keydown', onKey);
      main.removeAttribute('inert'); main.removeAttribute('aria-hidden');
      /* the Landing's sculpture starts its own cycle from its first frame (the stack) as the Loading form lands on it */
      try { [].forEach.call(main.querySelectorAll('.emb'), function (e) { e.getAnimations({ subtree: true }).forEach(function (a) { a.currentTime = 0; }); }); } catch (e) {}
      reveal(!skipping);
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
      /* VFINAL2 desktop / ultrawide Loading (11 §4): the 1440x900 / 2560x1440 frame, centred and scaled by
         min(vw / W, vh / H); zoom keeps the board's own measurements consistent */
      if (root && /^VF2-1-Loading/.test(name) && !/-m-/.test(name)) {
        var W2 = parseFloat(root.style.width), H2 = parseFloat(root.style.height), xd = d.querySelector('x-dc');
        if (xd) xd.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%';
        var fit2 = function () { root.style.zoom = Math.min(w.innerWidth / W2, w.innerHeight / H2).toFixed(4); };
        fit2(); w.addEventListener('resize', fit2);
      }
      var go = d.querySelector('a.go');
      /* Skip (the board's .go): no navigation here - it calls the board's own skip, which settles and hands off */
      if (go) { go.addEventListener('click', function (ev) { ev.preventDefault(); if (!skipping) { skipping = true; skipNow(); } }); }
      [].forEach.call(d.querySelectorAll('a.skip'), function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); }); });
      if (root) { new MutationObserver(function () { if (root.hasAttribute('data-fin') && !root.__vfg) { root.__vfg = 1; glide(); } if (root.hasAttribute('data-done')) hand(); }).observe(root, { attributes: true });
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

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
    /* PLINTH-FIRST FIT (owner, 2026-11-24; replaces sizing by the art box, which left the wide plinths 7px from the screen
       edges, past the text, and the phone ones narrow inside it). What reads is the glass plinth, not the art box (larger
       than the art for captures, smaller for phone mock-ups whose art carries transparent padding). So each chapter is
       fitted by its plinth, read from the glass's own layout box (offsets, unaffected by the scale): the plinth fills the
       text column (up to 345px) or stands 440px tall, whichever binds; it is centred on the column by its own centre, and
       its top sits 24px into the figure. The text below starts on the column's edge. Refitted when a slot goes live (the
       glass changes shape) and on resize. */
    var PAD = 24;
    function fit() { var cs = getComputedStyle(gal), col = gal.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      [].forEach.call(gal.querySelectorAll('.vf-ch'), function (ch) { var n = ch.getAttribute('data-n'), a = ch.querySelector('.art'), f = ch.querySelector('.vf-fig'), g = a.querySelector('.glass');
        var w = size[n][0], h = size[n][1], gl = 0, gt = 0, gw = w, gh = h;
        if (g && g.offsetWidth) { gl = g.offsetLeft; gt = g.offsetTop; gw = g.offsetWidth; gh = g.offsetHeight; }
        var k = Math.min(col / gw, 440 / gh);
        a.style.setProperty('--vf-k', k.toFixed(4));
        a.style.setProperty('--vf-tx', (-((gl + gw / 2) - w / 2) * k).toFixed(1) + 'px');
        a.style.setProperty('--vf-ty', (PAD - gt * k).toFixed(1) + 'px');
        f.style.height = Math.round(gh * k + PAD + 36) + 'px'; }); } /* 36px of air between the plinth and its title */
    fit(); window.addEventListener('resize', fit);
    try { var mo = new MutationObserver(function () { fit(); });
      [].forEach.call(gal.querySelectorAll('.art'), function (a) { mo.observe(a, { attributes: true, attributeFilter: ['class'] }); }); } catch (e) {}
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

  /* THE WORLD, CONTINUED (owner, 2026-11-24, pass 9). The orbit's isometric ground runs on past its own plane across the
     whole Landing, as one environment: the same 54px grid, continued line for line from where the orbit's grid begins to
     fade (the two masks sum to one even ground), then fading outward over about three ring radii; on it, a skeletal city
     of streets, lots and set-back buildings, with a few slow cars (below), each part fainter, lower and (far out) softer
     the further it stands from the orbit, and none behind the header, the introduction, the index, the project copy or the controls. Background only: one static SVG
     drawn once per mount, inside .world so it moves with the exhibit; the projection is measured from the scene itself
     (three probe points), never assumed. Desktop and ultrawide; phones have the gallery; reduced motion is the same
     still picture. */
  function isoWorld(host) {
    if (RG === 'm' || R.k !== 'landing') return;
    var root = host.querySelector('.root'), world = root && root.querySelector('.stage .world'), scene = world && world.querySelector('.scene'),
        grd = scene && scene.querySelector('.grd');
    if (!grd || world.querySelector('.vf-iso')) return;
    var P = scene.offsetWidth, cell = parseFloat(getComputedStyle(grd).backgroundSize) || P / 22;
    function probe(x, y, z) { var m = document.createElement('i'); m.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:0;height:0;transform:translateZ(' + z + 'px)';
      scene.appendChild(m); var r = m.getBoundingClientRect(); scene.removeChild(m); return [r.left, r.top]; }
    var wr = world.getBoundingClientRect(), o = probe(0, 0, 0), px = probe(100, 0, 0), py = probe(0, 100, 0), pz = probe(0, 0, 100);
    var ex = [(px[0] - o[0]) / 100, (px[1] - o[1]) / 100], ey = [(py[0] - o[0]) / 100, (py[1] - o[1]) / 100], ez = [(pz[0] - o[0]) / 100, (pz[1] - o[1]) / 100];
    var rr = root.getBoundingClientRect(), L = rr.left - wr.left, T = -480, W = rr.width, H = world.offsetHeight + 960;
    var O = [o[0] - wr.left - L, o[1] - wr.top - T];
    function pt(x, y, z) { return [O[0] + x * ex[0] + y * ey[0] + z * ez[0], O[1] + x * ex[1] + y * ey[1] + z * ez[1]]; }
    function poly(a) { return a.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' '); }
    /* THE GRID, MORE PRESENT (owner, 2026-11-24): the ground's lines at 2x their alpha, on the orbit's own grid and on its
       continuation alike, so the spatial system reads at a glance and the two stay one surface; the grid's own fade-in and
       opacity are untouched */
    if (!grd.__vfLine) { grd.__vfLine = 1; var gb = getComputedStyle(grd).backgroundImage;
      grd.style.backgroundImage = gb.replace(/rgba\(([^,]+),([^,]+),([^,]+),\s*([\d.]+)\)/g, function (m, r, g, b, a) { return 'rgba(' + r + ',' + g + ',' + b + ',' + Math.min(1, a * 2).toFixed(3) + ')'; }); }
    /* colours from the scene itself, so either theme reads true */
    function css(sel, prop) { var e = scene.querySelector(sel); return e ? getComputedStyle(e)[prop] : ''; }
    var line = (getComputedStyle(grd).backgroundImage.match(/rgba?\([^)]*\)/) || ['rgba(230,228,223,.11)'])[0],
        fL = css('.bx .fl', 'backgroundColor') || '#181818', fR = css('.bx .fr', 'backgroundColor') || '#111112', fT = css('.bx .tp', 'backgroundColor') || '#232322',
        edge = (line.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]*\)/, 'rgb($1,$2,$3)'));
    var C = pt(P / 2, P / 2, 0), Rr = P / 2, ky = Math.hypot(ex[0] + ey[0], ex[1] + ey[1]) / Math.SQRT2; /* the plane circle's vertical squash */
    var kx = Math.hypot(ex[0] - ey[0], ex[1] - ey[1]) / Math.SQRT2;
    /* the text columns stay clear of prisms (their rects, in this layer's coordinates, with a margin) */
    var keep = [].map.call(root.querySelectorAll('.lc, .idx, .n9more, .pns, .stage .pg, .r6nav, .stage > .art:not([hidden])'), function (e) { var r = e.getBoundingClientRect(); return r.width ? [r.left - wr.left - L - 40, r.top - wr.top - T - 40, r.right - wr.left - L + 40, r.bottom - wr.top - T + 40] : null; }).filter(Boolean);
    keep.push([-1e4, -1e4, 1e5, (root.querySelector('.lc') ? root.querySelector('.lc').getBoundingClientRect().top - wr.top - T - 24 : 140 - T)]); /* the header band */
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    /* A SKELETAL CITY (owner, 2026-11-24). The ground is laid out as a street lattice: lots of 4 x 4 cells with one-cell
       streets between them, so kerbs meet at real intersections; the orbit stands in an open plaza. Each lot is drawn as
       its kerb outline, and holds a podium, a pair or a cluster of set-back buildings (or stands empty), as hairline
       wireframes over faces barely off the ground colour; lower, fainter and softer with distance. Streets lead: two lots in
       five stand open. The orbit's plaza is the city's centre: a ring road runs round it, every avenue ends on it, and its
       own kerb frames the plinth. Visible at a glance in open space (owner, 2026-11-24): structure strongest by the orbit,
       falling away steeply (to the power 1.6-1.8) towards the edges, and veiled behind content (below). */
    var S = 5, Pc = Math.round(P / cell), N = Math.ceil(3.2 * Rr / cell / S) + 1, lots = [], blocks = [];
    function off(bb) { return bb[2] < 0 || bb[0] > W || bb[3] < 0 || bb[1] > H; }
    function hits(bb) { return bb[2] < 0 || bb[0] > W || bb[3] < 0 || bb[1] > H || keep.some(function (k) { return bb[0] < k[2] && bb[2] > k[0] && bb[1] < k[3] && bb[3] > k[1]; }); }
    function box(x, y, w, d, h) { var q = [pt(x, y, h), pt(x + w, y, h), pt(x, y + d, 0), pt(x + w, y + d, 0), pt(x, y + d, h), pt(x + w, y, 0)];
      return [Math.min.apply(0, q.map(function (v) { return v[0]; })), Math.min.apply(0, q.map(function (v) { return v[1]; })), Math.max.apply(0, q.map(function (v) { return v[0]; })), Math.max.apply(0, q.map(function (v) { return v[1]; }))]; }
    for (var ai = -N; ai <= N + Pc / S; ai++) for (var aj = -N; aj <= N + Pc / S; aj++) {
      var li = ai * S, lj = aj * S; /* lot cells li..li+3, street at li+4 */
      if (li + 4 > -1 && li < Pc + 1 && lj + 4 > -1 && lj < Pc + 1) continue; /* the plaza */
      var lx = li * cell, ly = lj * cell, ls = 4 * cell, d = Math.hypot(lx + ls / 2 - P / 2, ly + ls / 2 - P / 2) / Rr;
      if (d > 3.1) continue;
      var u = Math.max(0, Math.min(1, (d - 1.05) / 2.05)), lb = box(lx, ly, ls, ls, 0);
      if (off(lb)) continue;
      lots.push({ x: lx, y: ly, u: u });
      var r = rnd(), sb = 0.3 * cell, parts;
      if (r < 0.4) parts = [];                                                         /* an open lot: streets lead */
      else if (r < 0.6) parts = [[0, 0, 4, 4, 0.4 + rnd() * 0.6]];                    /* a podium */
      else if (r < 0.82) parts = rnd() < 0.5 ? [[0, 0, 2, 4, 1 + rnd() * 1.6], [2, 0, 2, 4, 0.6 + rnd()]] : [[0, 0, 4, 2, 1 + rnd() * 1.6], [0, 2, 4, 2, 0.6 + rnd()]];
      else parts = [[0, 0, 2, 2], [2, 0, 2, 2], [0, 2, 2, 2], [2, 2, 2, 2]].filter(function () { return rnd() < 0.6; }).map(function (q) { return q.concat([0.7 + rnd() * 2.4]); });
      parts.forEach(function (q) {
        var x = lx + q[0] * cell + sb, y = ly + q[1] * cell + sb, w = q[2] * cell - 2 * sb, dp = q[3] * cell - 2 * sb, h = q[4] * cell * (1 - 0.75 * u);
        if (!off(box(x, y, w, dp, h))) blocks.push({ x: x, y: y, w: w, d: dp, h: h, u: u });
      });
    }
    blocks.sort(function (a, b) { return (a.x + a.y) - (b.x + b.y); }); /* back to front */
    function prism(b) {
      var x = b.x, y = b.y, w = b.w, d = b.d, h = b.h;
      var top = [pt(x, y, h), pt(x + w, y, h), pt(x + w, y + d, h), pt(x, y + d, h)],
          left = [pt(x, y + d, 0), pt(x + w, y + d, 0), pt(x + w, y + d, h), pt(x, y + d, h)],
          right = [pt(x + w, y, 0), pt(x + w, y + d, 0), pt(x + w, y + d, h), pt(x + w, y, h)];
      var a = (0.55 * Math.pow(1 - b.u, 1.8) + 0.02).toFixed(3); /* near reads, far all but vanishes */
      /* wireframe first: the city's hairline on faces held near the ground colour (fill .55), all at one fading strength */
      return '<g opacity="' + a + '"><polygon points="' + poly(left) + '" fill="' + fL + '" fill-opacity=".55" stroke="' + edge + '" stroke-opacity=".4"/><polygon points="' + poly(right) + '" fill="' + fR + '" fill-opacity=".55" stroke="' + edge + '" stroke-opacity=".32"/>' +
        '<polygon points="' + poly(top) + '" fill="' + fT + '" fill-opacity=".55" stroke="' + edge + '" stroke-opacity=".6"/></g>';
    }
    var kerbs = lots.map(function (l) { var s = 4 * cell; return '<polygon points="' + poly([pt(l.x, l.y, 0), pt(l.x + s, l.y, 0), pt(l.x + s, l.y + s, 0), pt(l.x, l.y + s, 0)]) + '" opacity="' + (0.8 * Math.pow(1 - l.u, 1.6) + 0.03).toFixed(3) + '"/>'; }).join('');
    /* STREETS AS ROUTES (cell units; centre lines at 5k + 4.5, intersections where two meet). A segment is one block long;
       it is drivable where it is not inside the plaza, stands within 2.5 ring radii and is clear of the copy and controls.
       Consecutive drivable segments along one street make a run; the cars and the tram use only runs. */
    var Z = Math.ceil(3.2 * Rr / cell / S) + 1, runs = [], PL = Pc + 2; /* plaza interior 0..PL; ring road centres -0.5, PL + 0.5 */
    function cp(ax, c, s) { return ax ? pt(c * cell, s * cell, 0) : pt(s * cell, c * cell, 0); } /* ax 0: street along x at y = c */
    function okSeg(ax, c, s) { var m = s + 2.5, inP = c > 0 && c < PL && m > 0 && m < PL; if (inP) return false;
      var X = ax ? c : m, Y = ax ? m : c; if (Math.hypot(X * cell - P / 2, Y * cell - P / 2) / Rr > 2.5) return false;
      var a = cp(ax, c, s), b = cp(ax, c, s + 5); return !hits([Math.min(a[0], b[0]) - 14, Math.min(a[1], b[1]) - 14, Math.max(a[0], b[0]) + 14, Math.max(a[1], b[1]) + 14]); }
    for (var ax0 = 0; ax0 < 2; ax0++) for (var k0 = -Z; k0 <= Z + Pc / S; k0++) {
      var c0 = S * k0 + 4.5, cur = null;
      for (var s0 = -Z; s0 <= Z + Pc / S; s0++) { var ss = S * s0 + 4.5;
        if (okSeg(ax0, c0, ss)) { if (!cur) { cur = { ax: ax0, c: c0, p: [ss] }; runs.push(cur); } cur.p.push(ss + 5); } else cur = null; }
    }
    runs = runs.filter(function (r) { return r.p.length >= 3; });
    function dist(r) { var m = r.p[Math.floor(r.p.length / 2)], X = r.ax ? r.c : m, Y = r.ax ? m : r.c; return Math.hypot(X * cell - P / 2, Y * cell - P / 2) / Rr; }
    /* the tram: the longest run on the plaza's front ring road (or, failing that, the longest near the plaza) */
    var tramRun = runs.filter(function (r) { return r.c === PL + 0.5; }).sort(function (a, b) { return b.p.length - a.p.length; })[0] ||
      runs.slice().sort(function (a, b) { return (b.p.length - dist(b)) - (a.p.length - dist(a)); })[0] || null;
    var plaza = '<polygon points="' + poly([pt(0, 0, 0), pt(PL * cell, 0, 0), pt(PL * cell, PL * cell, 0), pt(0, PL * cell, 0)]) + '" opacity=".5"/>';
    var lanes = runs.filter(function (r) { return r !== tramRun && dist(r) < 1.9; }).map(function (r) { var a = cp(r.ax, r.c, r.p[0]), b = cp(r.ax, r.c, r.p[r.p.length - 1]);
      return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" opacity="' + (0.5 * (1 - (dist(r) - 1) / 0.9)).toFixed(3) + '"/>'; }).join('');
    var rails = '', stations = [];
    if (tramRun) {
      var tp = tramRun.p; [-0.13, 0.13].forEach(function (o) { var a = cp(tramRun.ax, tramRun.c + o, tp[0]), b = cp(tramRun.ax, tramRun.c + o, tp[tp.length - 1]);
        rails += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>'; });
      /* stations mid-block at either end and in the middle: a platform along the kerb and a low open shelter */
      [0, Math.floor((tp.length - 2) / 2), tp.length - 2].filter(function (v, i, a) { return a.indexOf(v) === i; }).forEach(function (i) {
        var s = tp[i] + 2.5, side = tramRun.c - 0.36, L0 = s - 0.8, L1 = s + 0.8;
        function q(c, sv, z) { return tramRun.ax ? pt(c * cell, sv * cell, z * cell) : pt(sv * cell, c * cell, z * cell); }
        stations.push(s);
        rails += '<polygon points="' + poly([q(side, L0, 0), q(side, L1, 0), q(side - 0.24, L1, 0), q(side - 0.24, L0, 0)]) + '"/>' +
          '<polygon points="' + poly([q(side - 0.2, s - 0.4, 0.22), q(side - 0.2, s + 0.4, 0.22), q(side - 0.05, s + 0.4, 0.22), q(side - 0.05, s - 0.4, 0.22)]) + '"/>' +
          '<line x1="' + q(side - 0.2, s - 0.4, 0)[0].toFixed(1) + '" y1="' + q(side - 0.2, s - 0.4, 0)[1].toFixed(1) + '" x2="' + q(side - 0.2, s - 0.4, 0.22)[0].toFixed(1) + '" y2="' + q(side - 0.2, s - 0.4, 0.22)[1].toFixed(1) + '"/>' +
          '<line x1="' + q(side - 0.2, s + 0.4, 0)[0].toFixed(1) + '" y1="' + q(side - 0.2, s + 0.4, 0)[1].toFixed(1) + '" x2="' + q(side - 0.2, s + 0.4, 0.22)[0].toFixed(1) + '" y2="' + q(side - 0.2, s + 0.4, 0.22)[1].toFixed(1) + '"/>';
      });
    }
    var near = blocks.filter(function (b) { return b.u < 0.55; }).map(prism).join(''), far = blocks.filter(function (b) { return b.u >= 0.55; }).map(prism).join('');
    /* THE VEIL (owner, 2026-11-24): the city is secondary everywhere content sits. Behind the copy, the header, the
       controls and the featured display its contrast falls away softly (blurred dark shapes in the layer's own mask,
       ~85% down at the centre of each, no visible edge), so it reads fully only in open space. Vehicles keep off those
       areas altogether (their runs avoid them). */
    var ui = [].map.call(root.querySelectorAll('.lc, .idx, .n9more, .pns, .stage .pg, .r6nav, .stage > .art:not([hidden]), .orbs .orb[style*="opacity: 1"]'), function (e) { var r = e.getBoundingClientRect(); return r.width ? [r.left - wr.left - L, r.top - wr.top - T, r.width, r.height] : null; }).filter(Boolean);
    var hb = root.querySelector('.lc') ? root.querySelector('.lc').getBoundingClientRect().top - wr.top - T - 24 : 140 - T;
    ui.push([-40, -40, W + 80, hb + 40]);
    var veil = '<g filter="url(#vf-iso-v)" fill="#000" fill-opacity=".85">' + ui.map(function (r) { return '<rect x="' + (r[0] - 24).toFixed(0) + '" y="' + (r[1] - 24).toFixed(0) + '" width="' + (r[2] + 48).toFixed(0) + '" height="' + (r[3] + 48).toFixed(0) + '" rx="40"/>'; }).join('') + '</g>';
    /* the grid: a pattern in the plane's own axes, origin on the scene's, so every line continues one of the orbit's */
    var mtx = [ex[0], ex[1], ey[0], ey[1], O[0], O[1]].map(function (v) { return +v.toFixed(5); }).join(' ');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true" focusable="false">' +
      '<defs><pattern id="vf-iso-g" width="' + cell + '" height="' + cell + '" patternUnits="userSpaceOnUse" patternTransform="matrix(' + mtx + ')">' +
      '<path d="M0 0H' + cell + 'M0 0V' + cell + '" stroke="' + line + '" stroke-width="' + (1 / Math.max(kx, ky)).toFixed(3) + '" fill="none"/></pattern>' +
      '<filter id="vf-iso-b" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".9"/></filter>' +
      '<filter id="vf-iso-v" filterUnits="userSpaceOnUse" x="-200" y="-200" width="' + (W + 400) + '" height="' + (H + 400) + '"><feGaussianBlur stdDeviation="36"/></filter>' +
      '<radialGradient id="vf-iso-m" gradientUnits="userSpaceOnUse" cx="' + C[0].toFixed(1) + '" cy="' + C[1].toFixed(1) + '" r="' + (3.2 * Rr * kx).toFixed(1) + '" gradientTransform="translate(' + C[0].toFixed(1) + ' ' + C[1].toFixed(1) + ') scale(1 ' + (ky / kx).toFixed(4) + ') translate(' + (-C[0]).toFixed(1) + ' ' + (-C[1]).toFixed(1) + ')">' +
      '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="' + (0.55 / 3.2).toFixed(4) + '" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset="' + (1 / 3.2).toFixed(4) + '" stop-color="#fff" stop-opacity="1"/><stop offset="' + (1.8 / 3.2).toFixed(4) + '" stop-color="#fff" stop-opacity=".4"/>' +
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="vf-iso-k" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#vf-iso-m)"/>' + veil + '</mask>' +
      '<mask id="vf-iso-k2" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="#fff"/>' + veil + '</mask></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#vf-iso-g)" opacity="' + (getComputedStyle(grd).opacity || 0.23) + '" mask="url(#vf-iso-k)"/>' +
      '<g mask="url(#vf-iso-k)"><g fill="none" stroke="' + edge + '" stroke-opacity=".34" stroke-width="1">' + kerbs + plaza + '</g>' +
      '<g stroke="' + edge + '" stroke-opacity=".26" stroke-width="1" stroke-dasharray="3 7">' + lanes + '</g>' +
      '<g fill="' + fT + '" fill-opacity=".4" stroke="' + edge + '" stroke-opacity=".4" stroke-width="1">' + rails + '</g></g>' +
      '<g mask="url(#vf-iso-k2)"><g filter="url(#vf-iso-b)" stroke-width="1">' + far + '</g><g stroke-width="1">' + near + '</g></g></svg>';
    var lay = document.createElement('div'); lay.className = 'vf-iso'; lay.setAttribute('aria-hidden', 'true');
    lay.style.cssText = 'position:absolute;left:' + L.toFixed(1) + 'px;top:' + T + 'px;width:' + W + 'px;height:' + H + 'px;pointer-events:none;z-index:0;opacity:0;transition:opacity 1.2s ease';
    requestAnimationFrame(function () { requestAnimationFrame(function () { lay.style.opacity = '1'; }); });
    lay.innerHTML = svg; world.insertBefore(lay, world.firstChild);
    /* TRAFFIC AND TRANSIT (owner, 2026-11-24). Miniature wireframe vehicles on the street runs above, one small loop for all:
       a car keeps to its lane, eases off towards each intersection, stops there when its stop sign says so or when cross
       traffic or the tram is at the crossing, waits for it to clear, then pulls away; it follows the car ahead at a gap, and
       leaves its run at the end to reappear later on another. The tram shuttles its own street between three stations:
       it brakes into each, dwells for boarding, accelerates out, and slows for a car still in a crossing; cars give way to
       it. Each vehicle keeps its own pace and pauses, so nothing moves in unison. Transform and opacity writes only, a few
       per frame; the loop stops with the page hidden or the Landing gone; none of it for reduced motion. */
    var rm = false; try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (rm || !runs.length) return;
    var carRuns = runs.filter(function (r) { return r !== tramRun && dist(r) < 2.2; });
    if (!carRuns.length) return;
    function shape(ax, len, wid, hgt) { /* a box centred on its own base, drawn in the plane's projection */
      var hl = len / 2, hw = wid / 2, A = ax ? [hw, hl] : [hl, hw], o = pt(0, 0, 0);
      function q(x, y, z) { var v = pt(x * cell, y * cell, z * cell); return (v[0] - o[0]).toFixed(1) + ',' + (v[1] - o[1]).toFixed(1); }
      return '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" style="position:absolute;left:0;top:0;overflow:visible">' +
        '<g fill="' + fT + '" fill-opacity=".6" stroke="' + edge + '" stroke-opacity=".75" stroke-width="1">' +
        '<polygon points="' + [q(-A[0], A[1], 0), q(A[0], A[1], 0), q(A[0], A[1], hgt), q(-A[0], A[1], hgt)].join(' ') + '"/>' +
        '<polygon points="' + [q(A[0], -A[1], 0), q(A[0], A[1], 0), q(A[0], A[1], hgt), q(A[0], -A[1], hgt)].join(' ') + '"/>' +
        '<polygon points="' + [q(-A[0], -A[1], hgt), q(A[0], -A[1], hgt), q(A[0], A[1], hgt), q(-A[0], A[1], hgt)].join(' ') + '"/></g></svg>'; }
    function el(html) { var e = document.createElement('i'); e.className = 'vf-car'; e.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;will-change:transform,opacity'; e.innerHTML = html; lay.appendChild(e); return e; }
    function xy(ax, c, s) { return ax ? [c, s] : [s, c]; }
    function fade(X, Y) { var d = Math.hypot(X * cell - P / 2, Y * cell - P / 2) / Rr; return Math.max(0, Math.min(1, (2.3 - d) / 1.2)); }
    var V = [], tram = null;
    function spawn(v) { var r = carRuns[Math.floor(rnd() * carRuns.length)], dir = rnd() < 0.5 ? 1 : -1;
      v.r = r; v.dir = dir; v.s = dir > 0 ? r.p[0] : r.p[r.p.length - 1]; v.v = 0.3; v.st = 'go'; v.w = 0; v.stop = {}; v.vmax = 0.75 + rnd() * 0.45;
      if (v.ax !== r.ax) { v.e.innerHTML = shape(r.ax, 0.5, 0.26, 0.12).replace(/^<svg/, '<svg'); v.e2 = v.e.firstChild; v.ax = r.ax; } v.off = rnd() * 3; }
    for (var n = 0; n < 9; n++) { var v = { e: el(''), ax: -1, hidden: n * 1.7 + rnd() * 3 }; spawn(v); V.push(v); }
    if (tramRun) { tram = { e: el(shape(tramRun.ax, 1.5, 0.34, 0.2)), r: tramRun, s: stations[0] || tramRun.p[0], dir: 1, v: 0, st: 'dwell', w: 2 + rnd() * 2, tgt: 1, tram: 1 }; }
    function lane(v) { return v.tram ? 0 : 0.22 * v.dir * (v.r.ax ? -1 : 1); }
    function pos(v) { return xy(v.r.ax, v.r.c + lane(v), v.s); }
    function busy(X, Y, rad, self) { /* anyone but self within rad cells of a point */
      return V.concat(tram ? [tram] : []).some(function (o) { if (o === self || o.hidden > 0) return false; var q = pos(o), d = Math.hypot(q[0] - X, q[1] - Y);
        return d < 0.45 || (d < rad && o.v > 0.05); }); } /* in the crossing, or moving towards it: two waiting at the line never hold each other */
    function step(v, dt) {
      var r = v.r, p = r.p, ahead = null, dmin = 1e9;
      for (var i = 0; i < p.length; i++) { var d = (p[i] - v.s) * v.dir; if (d > 0.05 && d < dmin) { dmin = d; ahead = p[i]; } }
      var vt = v.vmax, I = ahead !== null ? xy(r.ax, r.c, ahead) : null;
      if (v.st === 'wait') { v.w -= dt; if (v.w <= 0 && !busy(I[0], I[1], v.tram ? 0.9 : 1.15, v) && !(tram && !v.tram && tramAt(I))) { v.st = 'go'; v.stop[ahead] = 'done'; } v.v = 0; return; }
      if (I && v.stop[ahead] === undefined && dmin < 2.6) /* decide at the approach: stop sign, cross traffic or the tram */
        v.stop[ahead] = (rnd() < 0.4 || busy(I[0], I[1], 1.6, v) || (tram && tramAt(I))) ? 'stop' : 'roll';
      if (I && v.stop[ahead] === 'stop') { var dl = Math.max(0, dmin - 0.55); vt = Math.min(vt, Math.sqrt(2 * 0.9 * dl));
        if (dl < 0.04 && v.v < 0.08) { v.st = 'wait'; v.w = 0.5 + rnd() * 1.4; v.v = 0; return; } }
      if (I && v.stop[ahead] === 'roll' && dmin < 1.6) vt = Math.min(vt, 0.45 + 0.35 * dmin); /* ease through */
      V.forEach(function (o) { if (o !== v && o.hidden <= 0 && o.r === r && o.dir === v.dir) { var g = (o.s - v.s) * v.dir; if (g > 0 && g < 1.6) vt = Math.min(vt, Math.max(0, (g - 0.75) * 1.2)); } });
      v.v += Math.max(-1.1 * dt, Math.min(0.55 * dt, vt - v.v)); /* gentle acceleration, firmer braking */
      v.s += v.v * v.dir * dt;
    }
    function tramAt(I) { var q = pos(tram), d = Math.hypot(q[0] - I[0], q[1] - I[1]); return d < 0.9 || (d < 2.4 && tram.st === 'go'); } /* a moving tram near the crossing, or one standing in it */
    function stepTram(dt) {
      var t = tram, goal = stations.length ? stations[t.tgt] : t.r.p[t.tgt ? t.r.p.length - 1 : 0];
      if (t.st === 'dwell') { t.w -= dt; if (t.w <= 0) { t.st = 'go'; } return; }
      var d = (goal - t.s) * t.dir; if (d < 0) { t.dir = -t.dir; d = -d; }
      var vt = Math.min(0.9, Math.sqrt(2 * 0.45 * Math.max(0, d)));
      t.r.p.forEach(function (ip) { var e = (ip - t.s) * t.dir; if (e > 0 && e < 1.4) { var I = xy(t.r.ax, t.r.c, ip); if (busy(I[0], I[1], 0.7, t)) vt = Math.min(vt, Math.max(0, e - 0.9)); } });
      t.v += Math.max(-0.8 * dt, Math.min(0.35 * dt, vt - t.v)); t.s += t.v * t.dir * dt;
      if (d < 0.03 && t.v < 0.05) { t.v = 0; t.st = 'dwell'; t.w = 2.6 + rnd() * 1.8; /* boarding */
        if (stations.length > 1) { var nx = t.tgt + (t.fwd === -1 ? -1 : 1); if (nx < 0 || nx >= stations.length) { t.fwd = -(t.fwd || 1); nx = t.tgt + t.fwd; } else t.fwd = t.fwd || 1; t.tgt = nx; t.dir = (stations[nx] - t.s) > 0 ? 1 : -1; } }
    }
    function draw(v) { var q = pos(v), sp = pt(q[0] * cell, q[1] * cell, 0), r = v.r, ends = Math.min((v.s - r.p[0]), (r.p[r.p.length - 1] - v.s));
      var a = (v.tram ? 0.8 : 0.7) * fade(q[0], q[1]) * Math.max(0, Math.min(1, ends / 1.2));
      v.e.style.transform = 'translate(' + sp[0].toFixed(1) + 'px,' + sp[1].toFixed(1) + 'px)'; v.e.style.opacity = a.toFixed(3); }
    var last = 0;
    function frame(ts) {
      if (!lay.isConnected) return;
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
      V.forEach(function (v) {
        if (v.hidden > 0) { v.hidden -= dt; v.e.style.opacity = '0'; return; }
        step(v, dt);
        var p = v.r.p; if (v.s < p[0] - 0.01 || v.s > p[p.length - 1] + 0.01) { v.hidden = 2 + rnd() * 6; spawn(v); return; }
        draw(v);
      });
      if (tram) { stepTram(dt); draw(tram); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* SKIM FIRST, DEPTH ON REQUEST (owner, 2026-11-24, pass 7). Each case study reads in a minute: the short version (above),
     then every section's heading and lede, the evidence (figures, working prototypes, decks, crops), what I did, the
     decisions (moves, rules, notes) and the closing line stay in view. The supporting prose between them - further
     paragraphs, ticket logs, story write-ups, tables, test notes, the glossary - folds into a native disclosure in place,
     its own sub-heading as the label where it has one. Nothing is removed, reworded or reordered; find-in-page opens a
     fold; the short version's links still land on their sections. */
  function fold(host) {
    var KEEP = 'figure, section.ar-demo, section.acc, .ape__deck, .sk-crops, .sk-cfg, .cs-did, .cs-move, .ar-note, .ar-end, .au-rule, ' +
      '.acc__lede, .ts-turn, .pair, .cmp, .mount, .pv__embed, .scr, .hero, .lfx, .vf-jr';
    var MEDIA = 'iframe, img, video, canvas, picture, .cu-embed';
    function words(e) { return (e.textContent || '').trim().split(/\s+/).length; }
    function keeps(e) {
      if (/^H2$/.test(e.tagName)) return true;
      if (e.matches(KEEP)) return true;
      return !e.matches('article.pp, article.tk, .us') && !!e.querySelector(MEDIA);
    }
    function wrap(run, body) {
      if (!run.length) return;
      var n = 0; run.forEach(function (e) { n += words(e); });
      if (n < (body.matches('section.sec') ? 60 : 30)) return; /* a sentence or two: not worth a click */
      var d = document.createElement('details'); d.className = 'vf-fold';
      var s = document.createElement('summary');
      if (/^H[34]$/.test(run[0].tagName)) { s.appendChild(run.shift()); } else { var l = document.createElement('span'); l.className = 'vf-fold-l'; l.textContent = 'More detail'; s.appendChild(l); }
      d.appendChild(s); body.insertBefore(d, run[0] || null);
      run.forEach(function (e) { d.appendChild(e); });
    }
    [].forEach.call(host.querySelectorAll('.acc__b, .pt__b, section.sec'), function (body) {
      var kids = [].slice.call(body.children), run = [], lede = !!body.querySelector(':scope > .acc__lede');
      kids.forEach(function (e, i) {
        var keep = keeps(e);
        if (!keep && e.matches('p.kk')) keep = true; /* the section's kicker */
        else if (!keep && !lede && /^P$/.test(e.tagName)) { keep = true; lede = true; } /* the first paragraph is the lede */
        if (!keep && /^H[34]$/.test(e.tagName) && kids[i + 1] && keeps(kids[i + 1])) keep = true; /* it labels evidence */
        if (!keep && kids[i - 1] && /:\s*$/.test(kids[i - 1].textContent || '') && keeps(kids[i - 1]) !== false && !run.length && i > 0) keep = true; /* a lede ending in a colon keeps what it introduces */
        if (keep) { wrap(run, body); run = []; } else run.push(e);
      });
      wrap(run, body);
    });
    [].forEach.call(host.querySelectorAll('section.gloss'), function (g) {
      var h = g.querySelector('.gloss__h'); if (!h || g.querySelector('details.vf-fold')) return;
      var d = document.createElement('details'); d.className = 'vf-fold vf-fold--gloss'; var s = document.createElement('summary');
      var rest = [].slice.call(g.children).filter(function (e) { return e !== h; });
      s.appendChild(h); d.appendChild(s); rest.forEach(function (e) { d.appendChild(e); }); g.appendChild(d);
    });
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
    /* ULTRAWIDE: THE ORBIT LIFTED AS ONE UNIT (owner, 2026-11-23). The board moves its whole scene per exhibit (--r5dy), and
       for the tall phone exhibits the ring's front arc and its front node reach board y ~1560 - the bottom of the fitted
       view - while ~210px stood empty between the header and the displays. From 2304px wide the whole scene (world,
       plinths, displays, cards, arc, labels, arrows, counter) rises by one constant 118 board px, which centres its full
       extent (displays' top ~325 to the arc's lowest point ~1580) between the header (112) and the view's bottom (1558).
       The board keeps re-anchoring its own --r5dy (three layers aim the display at the header line), so the lift is added
       after it, in the same translate (CSS --vf-lift, tools/vfinal_build.py), never fed back into its measurements. The
       fit measures the unlifted extent, so the scale is exactly what it was. Desktop and phones are unaffected. */
    var stg1 = root.querySelector('.stage'), SD = 0;
    function lift() { SD = document.documentElement.clientWidth >= 2304 ? 118 : 0; root.style.setProperty('--vf-lift', SD + 'px'); }
    lift();
    var hmax = 0; /* the tallest extent seen: the index grows as the active project passes 04; never pulse back */
    function extent() { var rr = root.getBoundingClientRect(), m = Math.max(H, hmax);
      [].forEach.call(root.querySelectorAll(ESS), function (e) { var r = e.getBoundingClientRect(); if (r.width && r.height) m = Math.max(m, r.bottom - rr.top + 32 + (stg1 && stg1.contains(e) ? SD : 0)); });
      hmax = m; return m; }
    /* the text floors (max(board px, floor / --vfz)) make the column taller as the scale drops, which lowers the scale
       again: iterate to a fixed point (converges in two or three steps) so the controls are never a few px under */
    function f() { var z0 = 0; lift();
      for (var it = 0; it < 6; it++) {
        var vw = document.documentElement.clientWidth, z = vw / W, Hc = H ? extent() : 0;
        if (Hc) z = Math.min(z, window.innerHeight / Hc);
        z = Math.max(0.4, Math.min(1.4, z)); root.style.zoom = z.toFixed(4); root.__vfz = +z.toFixed(4); root.style.setProperty('--vfz', z.toFixed(4));
        if (Math.abs(z - z0) < 0.001) break; z0 = z;
      }
      navPos(z); }
    /* ORBIT ARROWS IN THE INFORMATION COLUMN (owner, 2026-11-24; replaces the pair either side of the orbit, which
       replaced the pair centred under the exhibit). Previous and next sit together, left-aligned, above the project's
       number, title and description: placed at the information column's own top-left (measured live, board px), and the
       column's copy steps down by one arrow plus 24px (CSS in tools/vfinal_build.py reads --vf-nx / --vf-ny / --vf-ns).
       One position for every project, inside the fitted height. The target never renders under 46 screen px, whatever
       the fit. Navigation logic, keys, swipe and the counter are the board's. */
    function navPos(z) {
      z = z || root.__vfz || 1;
      var stg = root.querySelector('.stage'), pn = root.querySelector('.pns'); if (!stg || !pn) return;
      var a = stg.getBoundingClientRect(), pr = pn.getBoundingClientRect(); if (!pr.width) return;
      var ns = Math.max(44, 46 / z);
      root.style.setProperty('--vf-ns', ns.toFixed(1) + 'px');
      stg.style.setProperty('--vf-nx', (pr.left - a.left).toFixed(1) + 'px');
      stg.style.setProperty('--vf-ny', (pr.top - a.top).toFixed(1) + 'px'); /* the board rewrites each arrow's style attribute */
    }
    /* the index grows as the active row passes 04: re-measure the column bound on each project change */
    var pns0 = root.querySelector('.pns');
    if (pns0) try { new MutationObserver(function () { f(); }).observe(pns0, { subtree: true, attributes: true, attributeFilter: ['hidden'] }); } catch (e) {}
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
    try { document.fonts.ready.then(f); } catch (e) {} /* the serif / sans pair can arrive after the first fit and change its height */
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
      vf2Fit(cur.el); gallery(cur); (function (h) { /* the world is measured once the Landing has settled (fonts, entrance) */
        var go = function () { setTimeout(function () { if (h.isConnected) isoWorld(h); }, 1400); };
        try { document.fonts.ready.then(go); } catch (e) { go(); } })(cur.el); disable(cur.el); if (R.k !== 'about') motion(cur.el); toggle(cur.el); slotRing(cur.el); wheelCentre(cur.el); phoneGutter(cur.el); accCentre(cur.el); openCards(cur.el); if (R.k === 'case') { journey(cur.el); fold(cur.el); chips(cur.el); headings(cur.el); pnavClear(cur.el); } title(cur.el);
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
  /* LIVE PROTOTYPES WAIT FOR THE LOADING (owner, 2026-11-24, performance). The Landing's live slots build their originals
     from the previous site's page (vf/site.html, 2.5MB, one fetch shared by every slot) as soon as it mounts - under the
     Loading, where it competed with the morph: on a phone (CPU x4) frames over 50ms fell from ~20 to 3, p95 frame time
     from 67-83ms to 33ms, nodes from 25.5k to 7.9k when it waited. So while the Loading is up that one request is held,
     and released once the Landing's entrance has run; the slots show their posters meanwhile, then go live as before. */
  var siteGate = null;
  function holdSite() {
    if (siteGate || !window.fetch) return;
    var f0 = window.fetch, open = false, waiting = [];
    siteGate = function () { if (open) return; open = true; window.fetch = f0; waiting.splice(0).forEach(function (go) { go(); }); };
    window.fetch = function (u) { var a = arguments, self = this;
      if (!open && /(^|\/)vf\/site\.html(\?|$)/.test(String(u && u.url || u))) return new Promise(function (res, rej) { waiting.push(function () { f0.apply(self, a).then(res, rej); }); });
      return f0.apply(this, a); };
    setTimeout(function () { if (siteGate) siteGate(); }, 15000); /* never held past this, whatever happens */
  }
  function loading(name) {
    holdSite();
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
      if (!staged || rm) { main.classList.remove('vf-stage', 'vf-in-1', 'vf-in-2', 'vf-in-3', 'vf-cont'); return; }
      main.classList.add('vf-in-1');
      setTimeout(function () { main.classList.add('vf-in-2'); }, 220);
      setTimeout(function () { main.classList.add('vf-in-3'); }, 440);
      setTimeout(function () { main.classList.remove('vf-stage', 'vf-in-1', 'vf-in-2', 'vf-in-3', 'vf-cont'); }, 1300);
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
      if (vf2 && !rm) { document.removeEventListener('keydown', onKey);
        if (!skipping && glide2()) { setTimeout(hand2, 1050); return; }
        setTimeout(hand2, 300); return; }
      hand2();
    }
    /* VFINAL MOTION ON VFINAL2 STATES (owner, 2026-11-23). VFINAL's hand-off choreography - the status and controls go
       first, then the Loading form glides (1000ms, its .45,0,.2,1 curve) onto its Landing counterpart, then the frame
       dissolves and the Landing arrives in its three steps - now carries VFINAL2's own compositions: the Loading city
       glides onto the Landing's city (the stage under the Orbit; the hero city on phones), measured on both pages (same
       geometry, so it lands exactly). The whole frame moves as one transform, so VFINAL2's own city transforms are never
       overridden or doubled. Monochrome throughout: the original linework (owner, 2026-11-24, colour removed).
       Skip and reduced motion keep the plain fade. */
    function glide2() {
      try {
        main.classList.add('vf-cont'); /* the Landing city at rest (staging offset released) before it is measured */
        var d = ov.contentDocument, sc = d && d.querySelector('.world .scene');
        var G = Element.prototype.__vfRect || Element.prototype.getBoundingClientRect;
        var tg = [].filter.call(main.querySelectorAll('.world .scene'), function (e) { return G.call(e).width > 0; })[0];
        if (!sc || !tg) { main.classList.remove('vf-cont'); return false; }
        var a = sc.getBoundingClientRect(), b = G.call(tg);
        if (!a.width || !b.width || b.bottom < 0 || b.top > innerHeight) { main.classList.remove('vf-cont'); return false; }
        var k = b.width / a.width, cx = a.left + a.width / 2, cy = a.top + a.height / 2;
        d.documentElement.classList.add('vf-glide');
        ov.style.transformOrigin = cx + 'px ' + cy + 'px';
        ov.style.transition = 'transform 1000ms cubic-bezier(.45,0,.2,1), opacity .3s cubic-bezier(.6,0,.2,1)';
        void ov.offsetWidth;
        ov.style.transform = 'translate(' + (b.left + b.width / 2 - cx).toFixed(1) + 'px,' + (b.top + b.height / 2 - cy).toFixed(1) + 'px) scale(' + k.toFixed(4) + ')';
        return true;
      } catch (e) { return false; }
    }
    function hand2() {
      document.removeEventListener('keydown', onKey);
      main.removeAttribute('inert'); main.removeAttribute('aria-hidden');
      /* the Landing's sculpture starts its own cycle from its first frame (the stack) as the Loading form lands on it */
      try { [].forEach.call(main.querySelectorAll('.emb'), function (e) { e.getAnimations({ subtree: true }).forEach(function (a) { a.currentTime = 0; }); }); } catch (e) {}
      reveal(!skipping);
      setTimeout(function () { if (siteGate) siteGate(); }, skipping || rm ? 200 : 1400); /* after the entrance */
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

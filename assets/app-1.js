
/* ===== js/routes.js ===== */
/* ==========================================================================
   routes.js: THE PROJECT ROUTE MAP, AND THE ONE PLACE DESTINATIONS LIVE.

   Every project on this site is named in four places: the carousel on desktop,
   the bento cards, the "more work" list, and the previous/next control at the
   foot of a case study. Before this file each of those carried its own
   hard-coded href, which is how five of them ended up pointing at "#" and how
   the foot of the OptiFlow study ended up with a bespoke link to Carry that
   nothing else knew about.

   So there is one table. Order in PROJECTS is the order a reader walks them,
   and previous/next is computed from it rather than written by hand.

   ROUTES ARE HASHES, DELIBERATELY. The whole site is one document (that is
   what the standalone build is), so a case study is a second <main>, not a
   second file. A hash route therefore survives the thing a path-based router
   would break: this is served from a project sub-path (/productdesign/), and
   a deep link, a refresh and a Back button all resolve against whatever base
   the document was served from, with no server rewrite rule and no 404
   fallback page. Nothing here needs to know where it is deployed, which is
   why nothing here mentions it.

   STATUS IS HONEST. A project with no case study written is 'soon'. It never
   gets a link, and the interface says so in words rather than offering a tap
   that goes nowhere or, worse, lands on a different project's page.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  /* ---------------------------------------------------------------------
     EXTERNAL DESTINATIONS

     Empty means "not published yet", and the boot code below removes the
     control rather than leaving a link that goes nowhere. Fill a string in
     and it wires itself up: new tab, rel="noopener", and the external-link
     mark. This is the only place these belong.
     --------------------------------------------------------------------- */
  PF.LINKS = {
    linkedin: '',     /* e.g. 'https://www.linkedin.com/in/…' */
    resume:   '',     /* a URL, or a file committed alongside index.html */
    /* STILL EMPTY, AND THAT IS A DECISION.

       The booking link is now on the page twice: the action at the foot and
       the row in "Let's talk", but written on those two anchors rather than
       here. Filling this slot would also light up `.hero__book`, the
       "Schedule a call" control under the skills tile, which js/wire.js has
       been removing on every load because there was nothing to point at. That
       is a third booking control in the same column, and nobody asked for one.

       Put the URL here when you want that one back; the two below will keep
       working either way, and `.hero__book` carries its own ↗ in the markup,
       so it will need that span removed or it will draw two. */
    schedule: ''      /* a booking link */
  };

  /* ---------------------------------------------------------------------
     THE PROJECTS

       key      what the markup references
       mode     which filter it belongs to on the index
       name     the short name used in navigation ("Next Project · OptiFlow")
       context  who it was for / what kind of work: shown before the tap
       route    the in-document route, when the case study exists
       status   'live'   the route is real
                'soon'   nothing written yet; never linked, always labelled
     --------------------------------------------------------------------- */
  PF.PROJECTS = [
    /* FIRST, AND IT IS THE ONE STILL BEING BUILT. The browser opens on it,
       the list opens on it, and this table agrees with both, which matters
       because previous/next at the foot of a study is computed from here. It
       is 'soon', so PF.neighbours skips it and no study gains a Next that
       lands on a page that does not exist. */
    { key: 'governance', mode: 'design', name: 'Design Governance',
      context: 'Design governance \u00b7 AI-generated work', status: 'soon' },

    { key: 'carry', mode: 'design', name: 'Carry',
      context: 'Patient experience · Healthcare',
      route: '#/carry', status: 'live' },

    { key: 'specimen', mode: 'design', name: 'Specimen Kit',
      context: 'Physical experience · Healthcare',
      /* IN THIS DOCUMENT NOW. The kit was a link out to its published page
         until the case study was built here; the published page is untouched
         and this is simply where the study lives. */
      route: '#/specimen', status: 'live' },

    /* THIRD. The explainer moved up the table because it is the piece that
       explains itself fastest: the thumbnail is the lesson. Order in this
       table is the order everything else reads: the carousel's count, the
       cards, previous and next at the foot of a study, so moving it here
       moves it everywhere. */
    { key: 'crypto', mode: 'design', name: 'Cryptography',
      context: 'Interactive explainer',
      route: 'https://rockysahooart.github.io/encryption-coffee-shop/', status: 'live' },

    { key: 'pnc', mode: 'design', name: 'PNC Bank',
      context: 'Securities-based lending · Finance',
      route: 'https://rockysahoo.design/project/pnc', status: 'live' },

    { key: 'mi', mode: 'design', name: 'Missing Information',
      context: 'Operations \u00b7 Healthcare', status: 'soon' },

    { key: 'scale', mode: 'design', name: 'Scale',
      context: 'Two-sided marketplace \u00b7 Music education', status: 'soon' },

    /* The audit was a link out to its Figma Make page until it was rebuilt
       here; the source is untouched and this is simply where the case study
       lives now. */
    { key: 'dsa', mode: 'design', name: 'Design System Audit',
      context: 'Design systems · Healthcare',
      route: '#/audit', status: 'live' },

    { key: 'optiflow', mode: 'design', name: 'OptiFlow',
      context: 'AI-assisted operations · Healthcare',
      route: '#/optiflow', status: 'live' },

    { key: 'fub', mode: 'design', name: 'First United Bank',
      context: 'Banking identity and digital',
      route: 'https://rockysahoo.design/project/fub', status: 'live' },

    { key: 'cvs', mode: 'design', name: 'CVS Health',
      context: 'Enterprise platforms',
      route: 'https://www.figma.com/proto/kP5wUF63gtzu8ZQA72JJyc/PRESENTATION-DECKS?page-id=1%3A2649&node-id=158-3458&p=f&viewport=477%2C30%2C0.06&t=83vyCcIH1SPdlKje-1&scaling=contain&content-scaling=fixed',
      status: 'live' },

    { key: 'illo-1', mode: 'illustration', name: 'Illustration one', context: 'Illustration', status: 'soon' },
    { key: 'illo-2', mode: 'illustration', name: 'Illustration two', context: 'Illustration', status: 'soon' },
    { key: 'illo-3', mode: 'illustration', name: 'Illustration three', context: 'Illustration', status: 'soon' },

    { key: 'rel-1', mode: 'music', name: 'Release one', context: 'Music', status: 'soon' },
    { key: 'rel-2', mode: 'music', name: 'Release two', context: 'Music', status: 'soon' },
    { key: 'rel-3', mode: 'music', name: 'Release three', context: 'Music', status: 'soon' }
  ];

  /* One word for the collection, everywhere it is a destination rather than
     a headline: the back control, the hero action, the end-of-study module.
     Editorial headings on the index keep their own voice. */
  /* `hash` is the index's own anchor, used by the hero and the index's work
     links. `top` is where a case study goes back to: the index at the top of
     itself, not the project browser part-way down it. */
  PF.WORK = { label: 'Work', hash: '#work', top: '#top' };

  /* A ROUTE IS EITHER IN THIS DOCUMENT OR IT IS NOT.

     Three of these studies live here as a second <main>; the rest are
     published elsewhere, on rockysahoo.design, on GitHub Pages, in a Figma
     prototype.
     The distinction is the URL itself rather than a second flag that could
     disagree with it: a hash stays in the tab, anything absolute opens in a
     new one with rel="noopener" and the external mark. Nothing that consumes
     the table has to know which is which; it asks. */
  PF.isExternal = function (p) {
    return !!(p && p.route && /^https?:/i.test(p.route));
  };

  PF.project = function (key) {
    for (var i = 0; i < PF.PROJECTS.length; i++) {
      if (PF.PROJECTS[i].key === key) return PF.PROJECTS[i];
    }
    return null;
  };

  /* Previous and next walk only the projects that have somewhere to go. A
     disabled control pointing at an unwritten study is a mystery button, and
     the brief for this pass is right that they are worse than nothing. */
  PF.liveProjects = function () {
    return PF.PROJECTS.filter(function (p) { return p.status === 'live'; });
  };

  /* PREVIOUS AND NEXT STAY IN THE DOCUMENT.

     The foot of a case study is a reading control: it means "keep going" and
     it belongs to the sequence the reader is already inside. Once the other
     studies were wired to their published homes, walking that sequence started
     handing the reader to another domain in a new tab between two studies that
     live right here, so Carry's next became an off-site page and getting to
     OptiFlow took two hops through it. The off-site work is one tap away on
     the index, where choosing it is the reader's idea rather than the
     consequence of pressing Next. */
  PF.neighbours = function (key) {
    var live = PF.liveProjects().filter(function (p) { return !PF.isExternal(p); });
    for (var i = 0; i < live.length; i++) {
      if (live[i].key === key) {
        return { prev: live[i - 1] || null, next: live[i + 1] || null };
      }
    }
    return { prev: null, next: null };
  };

  /* The route a case study view corresponds to, so a page can find itself. */
  PF.projectByRoute = function (view) {
    for (var i = 0; i < PF.PROJECTS.length; i++) {
      if (PF.PROJECTS[i].route === '#/' + view) return PF.PROJECTS[i];
    }
    return null;
  };

  /* ---------------------------------------------------------------------
     COPY: one label per action, chosen so the words describe the result.
     --------------------------------------------------------------------- */
  PF.CTA = {
    study:  'View Case Study',
    soon:   'Case study coming soon',
    back:   'Back to ' + PF.WORK.label,
    next:   'Next Project',
    prev:   'Previous Project',
    work:   'View Work'
  };

})(window.PF);


/* ===== js/theme.js ===== */
/* ==========================================================================
   theme.js, light / dark switch

   Order of authority:
     1. an explicit choice the visitor made before (localStorage)
     2. light, at mobile widths, whatever the OS says
     3. the operating system's prefers-color-scheme
     4. light

   The <head> runs a tiny inline copy of steps 1 and 2 before first paint so
   the page never flashes the wrong theme. This file wires up the button and
   keeps following the system until the visitor overrides it.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var KEY = 'pf-theme';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function write(value) {
    try {
      if (value) { localStorage.setItem(KEY, value); }
      else { localStorage.removeItem(KEY); }
    } catch (e) { /* private mode. The choice just won't survive a reload */ }
  }

  /* What the page is actually showing right now. */
  function current() {
    var chosen = root.getAttribute('data-theme');
    if (chosen) return chosen;
    return media.matches ? 'dark' : 'light';
  }

  /* Iframed embeds mirror this attribute by reading window.parent.document,
     which needs same origin. It is same origin when the page is served, and
     for the srcdoc build; it is NOT when the multi-file version is opened
     straight off disk, where the embed silently falls back to the OS
     preference and stays light on a dark page. So the theme is also pushed
     out as a message, which crosses an opaque origin, and the embed takes
     whichever of the two reaches it. Costs one loop over the frames. */
  function broadcast(theme) {
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      try { frames[i].contentWindow.postMessage({ pfTheme: theme }, '*'); }
      catch (e) { /* a frame that is not ready yet reads the attribute instead */ }
    }
  }

  /* THE BROWSER CHROME FOLLOWS THE PAGE, NOT THE OS.

     The two theme-color metas are scoped to prefers-color-scheme, which was
     right while the page always followed the OS too. It no longer does: a
     phone set to dark now opens a light page, and those metas would tint the
     status bar and toolbar #121212 around it. Writing the applied theme into
     both of them means whichever one the browser matches carries the colour
     the page is actually showing. */
  var CHROME = { light: '#E9E9E9', dark: '#121212' };

  function paintChrome(theme) {
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      metas[i].setAttribute('content', CHROME[theme] || CHROME.light);
    }
  }

  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    paintChrome(theme);
    if (persist) write(theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
    broadcast(theme);
  }

  PF.initTheme = function () {
    apply(current(), false);

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(current() === 'dark' ? 'light' : 'dark', true);
      });
    });

    /* An embed that could not read the attribute asks for the theme once it
       has a script running; answer with the current one. This is the other
       half of broadcast(), without it the embed would be correct only from
       the first toggle onward. */
    window.addEventListener('message', function (e) {
      if (e && e.data && e.data.pfThemeRequest) broadcast(current());
    });

    /* Keep following the system until an explicit choice has been stored. */
    media.addEventListener('change', function () {
      if (!read()) apply(media.matches ? 'dark' : 'light', false);
    });
  };
})(window.PF);


/* ===== js/stepper.js ===== */
/* ==========================================================================
   stepper.js: one small state machine, shared by every artifact.

   Markup contract:
     <div class="artifact" data-stepper data-steps="3" data-interval="3000">
       ...visual, styled off [data-step="n"] on this element...
       <ol data-steps-list>
         <li><button data-goto="0">Label</button></li>
       </ol>
     </div>

   Behaviour:
     - Tap / click / keyboard drives it. Hover is never required.
     - A passive loop runs only while the artifact is on screen.
     - The loop stops permanently once the visitor takes control.
     - The loop never runs under prefers-reduced-motion.
     - Other scripts can listen for the "step" CustomEvent.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function createStepper(root) {
    var total = parseInt(root.dataset.steps, 10) || 1;
    var interval = parseInt(root.dataset.interval, 10) || 3000;
    var list = root.querySelector('[data-steps-list]');
    var buttons = list ? Array.prototype.slice.call(list.querySelectorAll('[data-goto]')) : [];

    var current = -1;
    var timer = null;
    var onScreen = false;
    var handedOver = false; // visitor has taken control

    var caption = root.querySelector('[data-steps-caption]');

    function paint(index) {
      root.setAttribute('data-step', String(index));
      /* The caption mirrors the active step, so the control is never
         colour-only. The dots alone would fail that test. */
      if (caption && buttons[index]) caption.textContent = buttons[index].textContent;
      for (var i = 0; i < buttons.length; i++) {
        var active = parseInt(buttons[i].dataset.goto, 10) === index;
        if (active) {
          buttons[i].setAttribute('aria-current', 'true');
        } else {
          buttons[i].removeAttribute('aria-current');
        }
      }
      root.dispatchEvent(new CustomEvent('step', { detail: { index: index, total: total } }));
    }

    function go(index) {
      var next = ((index % total) + total) % total;
      if (next === current) return;
      current = next;
      paint(current);
    }

    function advance() { go(current + 1); }

    function start() {
      if (timer || handedOver || reduced.matches || !onScreen || total < 2) return;
      timer = window.setInterval(advance, interval);
    }

    function stop() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    function handOver() {
      handedOver = true;
      stop();
    }

    // --- Controls ---------------------------------------------------------
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();          // don't trigger the card's overlay link
        handOver();
        go(parseInt(btn.dataset.goto, 10));
      });
    });

    if (list) {
      list.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        handOver();
        go(current + (event.key === 'ArrowRight' ? 1 : -1));
        var target = buttons[current];
        if (target) target.focus();
      });
    }

    // --- Passive loop, only while visible ---------------------------------
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) { start(); } else { stop(); }
      }, { threshold: 0.35 });
      observer.observe(root);
    } else {
      onScreen = true;
      start();
    }

    // Pause while a pointer rests on the artifact so it can be read.
    root.addEventListener('pointerenter', stop);
    root.addEventListener('pointerleave', start);
    root.addEventListener('focusin', stop);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });

    reduced.addEventListener('change', function () {
      if (reduced.matches) { stop(); } else { start(); }
    });

    go(0);

    return { go: go, stop: stop, start: start, root: root };
  }

  PF.createStepper = createStepper;

  PF.initSteppers = function () {
    var nodes = document.querySelectorAll('[data-stepper]');
    return Array.prototype.map.call(nodes, createStepper);
  };
})(window.PF);


/* ===== js/media.js ===== */
/* ==========================================================================
   media.js, playback discipline for slot media

   Video and Lottie on a portfolio should behave like illustrations, not like
   television. Three rules:

   1. Nothing plays unless it is on screen. An IntersectionObserver starts a
      clip when its card scrolls in and pauses it when it leaves, so six
      autoplaying loops never decode at once.
   2. Nothing downloads until it is nearly needed. Videos ship with
      preload="none" and a poster; the bytes are fetched on approach.
   3. Under prefers-reduced-motion nothing starts by itself. The poster frame
      stands in and a play button appears, so the visitor opts in.

   The Lottie player is only fetched if a Lottie mount actually exists on the
   page, so a site with no Lottie pays nothing for it.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- Video --------------------------------------------------------------- */

  function addPlayButton(video) {
    var slot = video.parentNode;
    if (slot.querySelector('.slot__play')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slot__play';
    btn.setAttribute('aria-label', 'Play ' + (slot.dataset.slot || 'clip'));
    btn.textContent = '▶';

    btn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();     // the whole card is a link; don't follow it
      if (video.paused) {
        video.play();
        btn.textContent = '❚❚';
        btn.setAttribute('aria-label', 'Pause');
      } else {
        video.pause();
        btn.textContent = '▶';
        btn.setAttribute('aria-label', 'Play');
      }
    });

    slot.appendChild(btn);
  }

  /* A clip inside a gallery is only the visible one on its own step. Reading
     computed visibility rather than tracking indices keeps this script from
     having to know anything about how the stepper works. */
  function isShowing(video) {
    var item = video.parentNode;
    if (!item || item.className.indexOf('gallery__item') === -1) return true;
    return window.getComputedStyle(item).visibility !== 'hidden';
  }

  function watchVideos(videos) {
    if (!videos.length) return;

    if (motionQuery.matches) {
      for (var i = 0; i < videos.length; i++) {
        videos[i].removeAttribute('autoplay');
        videos[i].preload = 'none';
        addPlayButton(videos[i]);
      }
      return;
    }

    if (!('IntersectionObserver' in window)) {
      /* No observer: let the browser's own autoplay handling take over
         rather than leaving every clip frozen. */
      for (var j = 0; j < videos.length; j++) videos[j].play().catch(function () {});
      return;
    }

    /* rootMargin buys a screenful of runway, so the fetch starts before the
       card is actually visible and the first frame is ready on arrival. */
    var onScreen = [];

    function settle(video) {
      var wanted = onScreen.indexOf(video) !== -1 && isShowing(video);
      if (wanted && video.paused) {
        if (video.preload === 'none') video.preload = 'auto';
        video.play().catch(function () {
          /* Autoplay refused: usually a power-saving setting. Give the
             visitor the control instead of failing silently. */
          addPlayButton(video);
        });
      } else if (!wanted && !video.paused) {
        video.pause();
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        var at = onScreen.indexOf(video);
        if (entry.isIntersecting && at === -1) onScreen.push(video);
        if (!entry.isIntersecting && at !== -1) onScreen.splice(at, 1);
        settle(video);
      });
    }, { rootMargin: '200px 0px', threshold: 0.15 });

    for (var k = 0; k < videos.length; k++) io.observe(videos[k]);

    /* The stepper fires a non-bubbling "step" event, so listen in the capture
       phase (which still reaches the target), and re-decide every clip. */
    document.addEventListener('step', function () {
      videos.forEach(settle);
    }, true);
  }

  /* --- Lottie -------------------------------------------------------------- */

  function startLottie(mounts) {
    var anims = [];

    mounts.forEach(function (mount) {
      var ref = mount.dataset.lottie;
      var config = {
        container: mount,
        renderer: 'svg',
        loop: true,
        autoplay: false
      };

      /* A "#id" reference points at an inline <script type="application/json">
         block. The single-file build uses that form, since a standalone HTML
         document has no sibling .json to fetch. */
      if (ref.charAt(0) === '#') {
        var node = document.querySelector(ref);
        if (!node) return;
        config.animationData = JSON.parse(node.textContent);
      } else {
        config.path = ref;
      }

      var anim = window.lottie.loadAnimation(config);
      anims.push({ el: mount, anim: anim });

      /* Reduced motion still gets the artwork: just the first frame of it. */
      if (motionQuery.matches) {
        anim.addEventListener('DOMLoaded', function () { anim.goToAndStop(0, true); });
      }
    });

    if (motionQuery.matches || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = anims.filter(function (a) { return a.el === entry.target; })[0];
        if (!match) return;
        if (entry.isIntersecting) match.anim.play();
        else match.anim.pause();
      });
    }, { rootMargin: '200px 0px', threshold: 0.15 });

    anims.forEach(function (a) { io.observe(a.el); });
  }

  function loadLottie(mounts) {
    if (!mounts.length) return;    // no mounts, no library, no cost

    /* The single-file build inlines the player, so there is nothing to fetch. */
    if (window.lottie) { startLottie(mounts); return; }

    var script = document.createElement('script');
    script.src = 'assets/lottie/lottie_light.min.js';
    script.defer = true;
    script.onload = function () { startLottie(mounts); };
    script.onerror = function () {
      /* The player is the only third-party code on the site. If it fails,
         the mounts stay empty rather than the page breaking. */
      if (window.console) console.warn('Lottie player failed to load.');
    };
    document.head.appendChild(script);
  }

  /* --- Boot ---------------------------------------------------------------- */

  PF.initMedia = function () {
    /* Descendant, not child: a clip sits directly in a single-item slot but
       one level deeper inside a gallery. */
    var videos = [].slice.call(document.querySelectorAll('.slot video, .media video'));
    var mounts = [].slice.call(document.querySelectorAll('[data-lottie]'));
    watchVideos(videos);
    loadLottie(mounts);
  };
})(window.PF);


/* ===== js/carry.js ===== */
/* ==========================================================================
   carry.js: the Carry flow thumbnail's autoplay loop, verbatim apart from
   two host changes, both marked below: it sizes to its container instead of
   the viewport, and it pauses while off screen.

   Timing lives in DWELL (ms per step) and the STEP_STATE map.
   ========================================================================== */

(function(){
  var root = document.getElementById('cfRoot');
  if (!root) return;

  // ---------- fit the phone to its container ----------
  // The authored version measured the viewport, which is right for a page of
  // its own and wrong inside a card. Same maths against the container box.
  var stage = document.getElementById('cf-stage');
  var FRAME_W = 390, FRAME_H = 844;

  /* MEASURED AFTER LAYOUT, EVERY TIME, AND NOT SHOWN UNTIL IT HAS BEEN.

     The old version measured once at script time and gave up silently if the
     container had no box yet, which is exactly what happens on a cold load,
     where the card's own height is still settling when a deferred script
     runs. No scale meant the phone rendered at its authored 390 x 844 inside
     a shorter card, and the top and bottom were cut off. Refreshing appeared
     to fix it because a warm cache changed the order layout and script
     arrived in, which is the signature of a measurement taken too early
     rather than of anything visual.

     Now: the first fit is deferred to a rAF so it lands after layout rather
     than inside it, it is repeated when fonts settle and when everything has
     loaded, and the ResizeObserver keeps it right for every change after
     that. The stage stays invisible until a fit has actually succeeded (one
     frame, no spinner), so a wrongly-sized phone is never painted at all. */
  function fit(){
    var w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return false;
    var scale = Math.min(1, (w * 0.94) / FRAME_W, (h * 0.94) / FRAME_H);
    stage.style.transform = 'scale(' + scale + ')';
    root.setAttribute('data-fit', '1');
    return true;
  }

  /* Keep asking until there is a box to measure. A container that is still
     zero after a second is one that is hidden, and hidden is not a problem
     the observer below cannot solve later. */
  var tries = 0;
  (function settle(){
    if (fit() || tries++ > 60) return;
    requestAnimationFrame(settle);
  })();

  window.addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(root);
  else window.addEventListener('resize', fit);

  // ---------- content data ----------
  /* The conversation Carry captures is a general one: a result, a change to a
     medication, a symptom to watch, a date to keep. Carry is a companion any
     clinic can offer for an important appointment, so nothing here is specific
     to one condition or one speciality. */
  var TRANSCRIPT_A = 'Clinician: So your results came back, and the numbers we were watching have stayed steady since the last set. That is what we were hoping to see. Sarah: That is a relief. I have been anxious about this one. Clinician: That is understandable. Waiting is the hard part. Steady is genuinely good news here\u2026';
  var TRANSCRIPT_B = '\u2026every three months for now, and if things stay steady we can move to every six. You are about eight months from that point. Sarah: Okay. Three more before then.';

  var QUESTIONS = [
    { text:'Has anything changed since my last visit?', answer:'Your results are steady, and this is the third set in a row without a change. That is what we want at this stage.' },
    { text:'What does this result mean for my next steps?', answer:'We will keep to three-month intervals for now. If the next two look like this one, we can space them out to every six months.' },
    { text:'Should I be aware of any new symptoms?', answer:null },
    { text:'Are we changing anything about my medication?', answer:'We are adjusting the dose slightly. Same tablet, one step down. If anything feels different in the first two weeks, call us before you change it yourself.' },
    { text:'Is there anything I can do between appointments?', answer:null },
    { text:'When should I call instead of waiting?', answer:null }
  ];

  /* Step 4 is the wait. Everything before it is the patient handing a file
     over; everything after it is Carry having read it, and between those two
     there is a real minute of a real product working, which the flow used to
     skip. A prototype that goes straight from Upload to a finished transcript
     is a prototype claiming transcription is instant. */
  var STEP_STATE = {
    0: { checked:[], expanded:[] },
    1: { checked:[], expanded:[] },
    2: { checked:[], expanded:[] },
    3: { checked:[], expanded:[] },
    4: { checked:[], expanded:[] },
    5: { checked:[0], expanded:[] },
    6: { checked:[0], expanded:[] },
    7: { checked:[0,1,3], expanded:[0,1,3] }
  };

  // dwell time (ms) spent on each step before advancing
  var DWELL = [1700, 1700, 1400, 1300, 5000, 2100, 2100, 3200];
  var TOTAL = 8;
  var step = 0;
  var timer = null;

  var recEmpty = document.getElementById('cf-recEmpty');
  var recWorking = document.getElementById('cf-recWorking');
  var recUploaded = document.getElementById('cf-recUploaded');
  var transcriptBox = document.getElementById('cf-transcriptBox');
  var transcriptText = document.getElementById('cf-transcriptText');
  var overlayDim = document.getElementById('cf-overlayDim');
  var modal = document.getElementById('cf-modal');
  var sheet = document.getElementById('cf-sheet');
  var fileRow0 = document.getElementById('cf-fileRow0');
  var sheetUploadBtn = document.getElementById('cf-sheetUploadBtn');
  var allowBtn = document.getElementById('cf-allowBtn');
  var uploadRecordingBtn = document.getElementById('cf-uploadRecordingBtn');
  var qList = document.getElementById('cf-qList');
  var contentEl = document.getElementById('cf-contentEl');
  var screenEl = document.getElementById('cf-screen');
  var toast = document.getElementById('cf-toast');

  function svgCheck(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'; }
  function svgLink(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 0 10h-3M9 17H6a5 5 0 0 1 0-10h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>'; }
  function svgX(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>'; }

  qList.innerHTML = QUESTIONS.map(function(q, i){
    return (
      '<div class="cf-q-item" data-i="'+i+'">' +
        '<div class="cf-q-check">'+svgCheck()+'</div>' +
        '<div class="cf-q-body">' +
          '<p class="cf-q-text">'+q.text+'</p>' +
          '<div class="cf-q-tag">'+svgLink()+'<span>Matched from recording</span><button type="button" tabindex="-1">'+svgX()+'</button></div>' +
          (q.answer ? '<div class="cf-q-answer"><span class="cf-q-answer-label">What they said</span><p>'+q.answer+'</p></div>' : '') +
        '</div>' +
      '</div>'
    );
  }).join('');

  function briefPress(el){
    if (!el) return;
    el.classList.add('cf-pressed');
    setTimeout(function(){ el.classList.remove('cf-pressed'); }, 160);
  }

  function render(prevStep){
    var s = STEP_STATE[step];

    var showOverlay = step===1 || step===2 || step===3;
    overlayDim.classList.toggle('cf-visible', showOverlay);
    modal.classList.toggle('cf-visible', step===1);

    var showSheet = step===2 || step===3;
    sheet.classList.toggle('cf-open', showSheet);
    fileRow0.classList.toggle('cf-selected', step===3);
    sheetUploadBtn.classList.toggle('cf-enabled', step===3);

    /* Three states for one card: nothing yet, working, done. */
    var working = step===4;
    /* While the wait is on screen it IS the screen: the tabs, the questions
       and Save all belong to a transcript that does not exist yet. */
    screenEl.classList.toggle('cf-transcribing', working);
    var uploaded = step>=5;
    recEmpty.hidden = working || uploaded;
    if (recWorking) recWorking.hidden = !working;
    recUploaded.hidden = !uploaded;
    if (step===5){ transcriptBox.hidden = false; transcriptText.textContent = TRANSCRIPT_A; }
    else if (step===6){ transcriptBox.hidden = false; transcriptText.textContent = TRANSCRIPT_B; }
    else { transcriptBox.hidden = true; }

    var items = qList.querySelectorAll('.q-item');
    items.forEach(function(el){
      var i = parseInt(el.dataset.i, 10);
      el.classList.toggle('cf-checked', s.checked.indexOf(i) > -1);
      el.classList.toggle('cf-expanded', s.expanded.indexOf(i) > -1);
    });

    // small "press" cue on whichever control is conceptually driving the transition
    if (step===0 && prevStep===0) briefPress(uploadRecordingBtn);
    if (step===1) briefPress(uploadRecordingBtn);
    if (step===2) briefPress(allowBtn);
    if (step===3) briefPress(fileRow0);
    if (step===4) briefPress(sheetUploadBtn);

    if (step===7){
      setTimeout(function(){
        contentEl.scrollTo({ top: contentEl.scrollHeight, behavior:'smooth' });
      }, 380);
    } else {
      contentEl.scrollTo({ top: 0, behavior:'auto' });
    }

    if (step===7){
      setTimeout(function(){
        toast.classList.add('cf-visible');
        setTimeout(function(){ toast.classList.remove('cf-visible'); }, 900);
      }, DWELL[7] - 900);
    }
  }

  function advance(){
    var prev = step;
    var next = step + 1;
    if (next >= TOTAL){
      // loop back to start with a soft cross-fade
      screenEl.classList.add('cf-loop-fade');
      setTimeout(function(){
        step = 0;
        render(prev);
        screenEl.classList.remove('cf-loop-fade');
      }, 280);
    } else {
      step = next;
      render(prev);
    }
    timer = setTimeout(advance, DWELL[step]);
  }

  render(0);

  /* --- host addition: only run while on screen ------------------------
     A seven-step loop firing timers and CSS transitions forever behind a
     scrolled-past card is waste. Pausing clears the pending timer; resuming
     restarts the current step's dwell, so the flow continues from the step
     it was showing rather than snapping back to the beginning. Reduced
     motion holds it on the first step entirely. */
  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play(){ if (!reduced && !timer) timer = setTimeout(advance, DWELL[step]); }
  function pause(){ if (timer) { clearTimeout(timer); timer = null; } }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { play(); } else { pause(); }
    }, { rootMargin: '150px 0px' }).observe(root);
  } else {
    play();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { pause(); }
    else if (root.getBoundingClientRect().bottom > 0) { play(); }
  });
})();


/* ===== js/carry-ui.js ===== */
/* ==========================================================================
   carry-ui.js: Carry, running inside the case study.

   ONE SYSTEM, MANY ARTIFACTS. Everything on the Carry page is drawn by this
   file from one set of tokens, one component library and one seeded dataset.
   The preparation demo, the responsive comparison, the trust artifacts and the
   Performance Lab are not separate widgets that happen to look alike. They
   are the same components under different conditions. That is the claim the
   case study makes about the source work, so the page has to be built the way
   it says the product was.

   THE TWO STATE MACHINES. Authentication and the recording panel are written
   once, as explicit machines with named states, and both take a SCENARIO
   object. In the Clarity and Trust sections that scenario is the happy path.
   In the Performance Lab the reader edits it. No conditional state is a
   separate mocked screen: failures happen inside the real flow, to the real
   component, or they do not happen at all.

     auth:  idle → phoneEntered → codeSent → verifying → authenticated
            with codeIncorrect, codeExpired and connectionError as branches
     panel: empty → permissionRequested → filePickerOpen → fileSelected →
            uploading → uploaded → transcribing → transcribed
            with uploadInterrupted, uploadFailed, unsupportedFile,
            corruptedFile, transcriptionDelayed and transcriptionFailed

   WHAT IS SIMULATED, AND SAID SO. There is no microphone, no file system, no
   network, no backend, no transcription service and no model. The file picker
   lists five fictional files. Upload and transcription are timers. Matching is
   a hand-written lookup table with deliberate gaps. Nothing here persists.

   TIMING. Direct manipulation lands inside 160ms. Simulated waits are
   accelerated (an upload that would take thirty seconds takes one), because a
   portfolio reader will not wait out a real one to find out what the screen
   says. The relative shape is preserved: slow is visibly slower than fast.

   ACCESSIBILITY. Real buttons, aria-checked on checkable rows, aria-expanded
   on disclosures, roving focus and Escape in the contextual menu, focus
   trapping in the permission dialog, and one polite live region per artifact.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Accelerated, but proportional. FAST is the happy path; SLOW is what the
     scenario control means by a poor connection. */
  var T = {
    boot: 900, send: 500, verify: 700,
    up: 1100, upSlow: 3200,
    tx: 1300, txSlow: 4200,
    snack: 3200
  };
  function ms(v) { return reduced.matches ? 1 : v; }

  /* ---------------------------------------------------------------------
     ICONS: the Material Symbols outlined shapes the source system lists,
     redrawn as paths so the page carries no icon font and no network call.
     --------------------------------------------------------------------- */
  var ICON = {
    back:    '<path d="M15 4l-7 8 7 8"/>',
    gear:    '<circle cx="12" cy="12" r="3"/><path d="M19.4 14.4a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1v.2a2 2 0 11-4 0v-.1a1.6 1.6 0 00-2.7-1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.1-2.7H3.5a2 2 0 110-4h.1a1.6 1.6 0 001.2-2.7l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 002.7-1.1V3.5a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.2l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 001.1 2.7h.2a2 2 0 110 4h-.1a1.6 1.6 0 00-1.4 1z"/>',
    kebab:   '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
    drag:    '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
    plus:    '<path d="M12 5v14M5 12h14"/>',
    pluso:   '<circle cx="12" cy="12" r="8.5"/><path d="M12 8.5v7M8.5 12h7"/>',
    check:   '<path d="M4 12l5 5L20 6"/>',
    checkc:  '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.2l2.6 2.6 5-5.2"/>',
    pencil:  '<path d="M4 20h4l10-10-4-4L4 16v4z"/>',
    up:      '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down:    '<path d="M12 5v14M6 13l6 6 6-6"/>',
    trash:   '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    right:   '<path d="M9 4l7 8-7 8"/>',
    downc:   '<path d="M4 9l8 7 8-7"/>',
    upc:     '<path d="M4 15l8-7 8 7"/>',
    msg:     '<path d="M4 4.5h16v11H9l-5 4V4.5z"/>',
    close:   '<path d="M6 6l12 12M18 6L6 18"/>',
    wave:    '<path d="M4 12h1.5M8 7.5v9M12 4.5v15M16 8.5v7M20 11.5h0"/>',
    folder:  '<path d="M3 6.5h6l2 2.5h10v9.5H3z"/>',
    play:    '<path d="M9 6l9 6-9 6z"/>',
    search:  '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
    share:   '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.3M8.2 13.2l7.6 4.3"/>',
    lock:    '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    replay:  '<path d="M4 10a8 8 0 108-6"/><path d="M4 4v6h6"/>',
    warn:    '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.4h0"/>',
    cloudx:  '<path d="M7 18h10a4 4 0 000-8 6 6 0 00-11.6-1A3.5 3.5 0 006 18z"/><path d="M10 13l4 4M14 13l-4 4"/>',
    bulb:    '<path d="M9.5 18h5M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9V15h7v-1.1A6 6 0 0012 3z"/>',
    hist:    '<path d="M4 12a8 8 0 108-8 8 8 0 00-6.7 3.7"/><path d="M4 4v4h4"/><path d="M12 8v4.4l3 1.8"/>',
    sparkle: '<path d="M12 4l1.8 4.6L18 10l-4.2 1.4L12 16l-1.8-4.6L6 10l4.2-1.4z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>'
  };
  function ic(n, cls) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') +
           '>' + (ICON[n] || '') + '</svg>';
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
  }

  /* =====================================================================
     THE SEED

     One fictional patient in surveillance after treatment, one fictional
     clinician, one fictional conversation. The content follows the source
     board's documented screens so the artifacts show the product that was
     designed rather than a plausible-looking substitute. Nothing here
     identifies a real person, product or organisation.
     ===================================================================== */

  var SEED = {
    who: 'Sarah',
    initials: 'SR',
    title: 'Conversation with Dr. Patel',
    when: 'Tuesday, May 19 · 3:00 PM',
    whenShort: 'TUESDAY, 3:00 PM',
    today: 'TODAY, 3:00 PM',
    reason: 'Reviewing your latest test result',

    bring: [
      'Photo ID and insurance card',
      'List of current medications and doses',
      'Any prior records or recent imaging reports',
      'A notepad and pen (or device for notes)',
      'A trusted person, if possible',
      'Your prepared questions, on this app'
    ],

    questions: [
      'Has anything changed since my last test?',
      'What does this result mean for my next steps?',
      'Should I be aware of any new symptoms?',
      'How long until we know more about my surveillance schedule?',
      'Can I do anything to support my recovery between cycles?',
      'What signs of recurrence should I watch for?'
    ],

    /* The long one the responsive artifact is built around. */
    longQ: 'When can we space tests further apart and what should I watch for between cycles?',

    /* Suggested questions arrive grouped, and the group is part of the
       meaning: these are prompts to consider, not a checklist to complete. */
    suggested: [
      { name: 'Understanding the result', qs: [
        'What does this specific result tell us, and what doesn’t it tell us?',
        'How does this fit with my other surveillance, like scans or bloodwork?',
        'Are there any limitations of this test I should know about?',
        'How accurate is this test, and what’s the chance of an inconclusive result?'
      ] },
      { name: 'Care plan', qs: [
        'Is anything changing about my medication?',
        'Who do I contact if something changes over the weekend?',
        'Should I be doing anything differently between cycles?',
        'When would you want to see me sooner than scheduled?'
      ] },
      { name: 'Symptoms', qs: [
        'Which symptoms are worth calling about?',
        'Is the fatigue I’ve had likely to be related?',
        'What should I write down between visits?',
        'How do I tell a side effect from something new?'
      ] },
      { name: 'What’s next', qs: [
        'What happens at the next appointment?',
        'When is my next blood draw?',
        'How long does surveillance continue?',
        'What would change the plan?',
        'Who else should get a copy of these results?'
      ] }
    ],

    /* THE MATCHING TABLE. Hand-written, deterministic, and deliberately
       incomplete. Three of six questions were answered out loud; the other
       three were not, and the product's whole boundary is that it says so
       rather than writing something plausible. */
    matched: {
      0: { at: '02:14', quote: 'Your CEA levels are stable. The result is your third consecutive negative. We’re now sixteen months past treatment completion with three clear results, which is exactly what we want to see at this point.' },
      1: { at: '05:36', quote: 'We’ll continue at three-month intervals through the rest of year two. Then we can move to four-month intervals in year three if everything stays clear. This is the standard protocol for your cancer type.' },
      3: { at: '09:12', quote: 'Standard protocol is five years total. We’ll reassess at the two-year mark and again at five years. Most patients who clear surveillance never have recurrence.' }
    },
    /* Partial matching drops to the first alone. The same table, fewer
       defensible hits. Nothing is invented to fill the gap. */
    partial: [0],

    /* AND THE TABLE FOR A CONVERSATION THAT COVERED EVERYTHING.

       `matched` above is the Trust artifact's data, and it is three of six on
       purpose: that section exists to show what the interface does when a
       question was NOT answered clearly enough to quote. The Performance lab
       is asking a different question (what does the product look like when
       matching runs normally), and the honest answer to that is every question
       answered, because the recording covered them all. Same six questions,
       same transcript, three more turns in it.

       So the lab's three settings are a ladder against this table rather than
       against the Trust one: Normal is all six, Fewer matches is the three
       above, No reliable match is none. */
    matchedAll: {
      2: { at: '06:44', quote: 'Call us about anything new that persists, a change in bowel habit lasting more than a week, unexplained bleeding, or pain that wakes you at night. Day-to-day tiredness and the odd ache are not what we are watching for.' },
      4: { at: '07:52', quote: 'Nothing complicated: keep moving, eat normally, and try not to let the waiting stop you sleeping. There is no supplement or diet that changes these numbers. Staying active is the one thing with evidence behind it.' },
      5: { at: '09:58', quote: 'The things that would bring you in early are the same ones: persistent pain, bleeding, unintentional weight loss, or a cough that does not settle. If any of those turn up between visits, do not wait for the next appointment.' }
    },

    transcript: [
      { s: 'Dr. Patel', at: '02:14', m: 0, t: 'So we got your latest result back, and I’m happy to say it’s still showing no detectable disease. Your CEA levels are stable. The result is your third consecutive negative. We’re now sixteen months past treatment completion with three clear results, which is exactly what we want to see at this point.' },
      { s: 'Sarah',     at: '03:02', t: 'That’s such a relief. I’ve been so nervous about this one.' },
      { s: 'Dr. Patel', at: '03:20', t: 'I understand. The waiting period is hard. The fact that you’re consistently testing negative this far out from your initial treatment is a very good sign.' },
      { s: 'Sarah',     at: '04:48', t: 'And the testing schedule? When can we space them out?' },
      { s: 'Dr. Patel', at: '05:36', m: 1, t: 'We’ll continue at three-month intervals through the rest of year two. Then we can move to four-month intervals in year three if everything stays clear. This is the standard protocol for your cancer type.' },
      { s: 'Sarah',     at: '06:20', t: 'Is there anything I should be watching for day to day?' },
      { s: 'Dr. Patel', at: '06:44', m: 2, t: 'Call us about anything new that persists, a change in bowel habit lasting more than a week, unexplained bleeding, or pain that wakes you at night. Day-to-day tiredness and the odd ache are not what we are watching for.' },
      { s: 'Sarah',     at: '07:30', t: 'And is there anything I can be doing in between the cycles?' },
      { s: 'Dr. Patel', at: '07:52', m: 4, t: 'Nothing complicated: keep moving, eat normally, and try not to let the waiting stop you sleeping. There is no supplement or diet that changes these numbers. Staying active is the one thing with evidence behind it.' },
      { s: 'Sarah',     at: '08:41', t: 'How long does this go on for?' },
      { s: 'Dr. Patel', at: '09:12', m: 3, t: 'Standard protocol is five years total. We’ll reassess at the two-year mark and again at five years. Most patients who clear surveillance never have recurrence.' },
      { s: 'Sarah',     at: '09:44', t: 'And what would make me call you before then?' },
      { s: 'Dr. Patel', at: '09:58', m: 5, t: 'The things that would bring you in early are the same ones: persistent pain, bleeding, unintentional weight loss, or a cough that does not settle. If any of those turn up between visits, do not wait for the next appointment.' },
      { s: 'Sarah',     at: '10:05', t: 'Okay. Three more cycles at this pace.' }
    ],

    notes: 'Dr. Patel mentioned that my levels from the bloodwork were within normal range, which is good. She emphasised that being consistently negative for over a year is a really strong signal. We talked about the emotional side of surveillance, and she said it’s normal for the anxiety to increase rather than decrease over time, because the stakes feel higher with each clear result. She recommended I look into a local survivorship group if I want peer support. Also need to remember: she wants me to bring up the fatigue at my next primary care visit so they can rule out other causes.',

    followups: [
      { t: 'Send results to my primary care doctor', done: true },
      { t: 'Schedule the next blood draw for August', done: false },
      { t: 'Start a daily fatigue log', done: false }
    ],

    dashFollowups: [
      { t: 'Send Feb results to Dr. Kim (primary care)', done: true },
      { t: 'Schedule next blood draw', done: true },
      { t: 'Start daily fatigue log', done: false },
      { t: 'Refill antinausea prescription', done: false }
    ],

    recent: [
      { t: 'Dr. Patel · Result review', d: 'Feb 14 · Recording, 4 questions, 2 follow-ups' },
      { t: 'Dr. Patel · Result review', d: 'Nov 18 · Recording, 3 questions' },
      { t: 'Dr. Patel · Result review', d: 'Aug 22 · Recording, 5 questions, 1 follow-up' }
    ],

    journey: [
      { lab: 'Cycle 3 cleared', d: 'Feb 2025', k: 'done' },
      { lab: 'Cycle 4 awaiting result', d: 'May 2025', k: 'now' }
    ],

    /* The simulated picker. Only audio, because the permission copy promises
       only audio. A picker that showed a photo would make the dialog a lie. */
    files: [
      { n: 'conversation_2026-05-19.m4a', m: '12:34 · Today, 3:18 PM', kind: 'ok' },
      { n: 'voice_memo_office_notes.m4a', m: '2:47 · Yesterday, 9:12 AM', kind: 'ok' },
      { n: 'recording_appointment_prep.m4a', m: '5:21 · 3 days ago', kind: 'ok' },
      { n: 'Mom_phone_call.m4a', m: '18:42 · Last week', kind: 'ok' },
      { n: 'doctor_visit_february.m4a', m: '14:08 · February 12', kind: 'ok' }
    ],
    /* Substituted into slot 0 when the audio scenario is not "valid", so the
       reader picks the same row and meets a different problem. */
    badFiles: {
      unsupported: { n: 'conversation_2026-05-19.pages', m: '48 KB · Today, 3:18 PM', kind: 'unsupported' },
      corrupted:   { n: 'conversation_2026-05-19.m4a', m: '0:00 · Today, 3:18 PM', kind: 'corrupted' }
    }
  };

  function fileMain() { return SEED.files[0]; }

  /* =====================================================================
     SHELL HELPERS: shared by every artifact
     ===================================================================== */

  function say(root, msg) {
    var live = root.querySelector('[data-live]');
    if (live) live.textContent = msg;
  }

  /* The "try it" cue leaves the first time the reader does something real. */
  function used(root) {
    var cue = root.querySelector('[data-cue]');
    if (cue && !cue.hidden) cue.hidden = true;
  }

  /* The app bar. 64pt min-height, title over an uppercase caption, a 1px
     divider underneath: straight off the source board. */
  function appBar(title, sub, opts) {
    opts = opts || {};
    return '<div class="cu-bar">' +
      (opts.back
        ? '<button class="cu-ico" type="button" data-act="' + opts.back + '" aria-label="Back">' + ic('back') + '</button>'
        : '<span class="cu-ico cu-ico--ghost"></span>') +
      '<span class="cu-bar__t"><b>' + esc(title) + '</b>' +
        (sub ? '<span>' + esc(sub) + '</span>' : '') + '</span>' +
      (opts.trail === 'kebab'
        ? '<button class="cu-ico" type="button" data-act="noop" aria-label="More">' + ic('kebab') + '</button>'
        : opts.trail === 'gear'
        ? '<button class="cu-ico" type="button" data-act="noop" aria-label="Conversation settings">' + ic('gear') + '</button>'
        : '<span class="cu-ico cu-ico--ghost"></span>') +
      '</div>';
  }

  function checkRow(label, on, act, i, opts) {
    opts = opts || {};
    if (opts.readonly) {
      return '<div class="cu-row" data-static="1">' +
        '<span class="cu-box"' + (on ? ' data-on="1"' : '') + '>' + ic('check') + '</span>' +
        '<span class="cu-row__t"' + (on ? ' data-done="1"' : '') + '>' + esc(label) + '</span></div>';
    }
    return '<button class="cu-row" type="button" role="checkbox" aria-checked="' + (on ? 'true' : 'false') +
      '" data-act="' + act + '" data-i="' + i + '">' +
      '<span class="cu-box"' + (on ? ' data-on="1"' : '') + '>' + ic('check') + '</span>' +
      '<span class="cu-row__t">' + esc(label) + '</span></button>';
  }

  /* The bottom action bar. Fixed 56pt button, flexible width. The one
     measurement the source board is most explicit about. */
  function actionBar(label, act, opts) {
    opts = opts || {};
    return '<div class="cu-foot"><button class="cu-btn" type="button" data-act="' + act + '"' +
      (opts.off ? ' disabled' : '') + '>' + esc(label) + '</button></div>';
  }

  function snackbar(st) {
    if (!st.snack) return '';
    return '<div class="cu-snack" role="status">' + esc(st.snack.msg) +
      (st.snack.undo ? '<button type="button" data-act="undo">Undo</button>' : '') + '</div>';
  }

  /* One snackbar helper so every reversible action is reversible the same
     way. The timer is cleared on the next action, never stacked. */
  function makeSnack(host, render) {
    var t = null;
    return function (st, msg, undo) {
      clearTimeout(t);
      st.snack = msg ? { msg: msg, undo: !!undo } : null;
      if (msg) {
        t = setTimeout(function () {
          if (st.snack && st.snack.msg === msg) { st.snack = null; render(); }
        }, ms(T.snack));
      }
    };
  }

  /* ---------------------------------------------------------------------
     THE CONTEXTUAL MENU. One implementation, every list that has one.
     Material 3 hierarchy: destructive action last, behind its own divider,
     in error colour in every state.
     --------------------------------------------------------------------- */

  function openMenu(app, anchor, items, onPick) {
    closeMenu(app);
    var veil = document.createElement('div');
    veil.className = 'cu-veil';
    veil.setAttribute('data-menu', '1');

    var menu = document.createElement('div');
    menu.className = 'cu-menu';
    menu.setAttribute('data-menu', '1');
    menu.setAttribute('role', 'menu');
    menu.innerHTML = items.map(function (it, n) {
      return '<button type="button" role="menuitem" data-pick="' + it.id + '" data-n="' + n + '"' +
        (it.off ? ' disabled' : '') + (it.danger ? ' class="is-danger"' : '') + '>' +
        ic(it.icon) + esc(it.label) + '</button>';
    }).join('');

    app.appendChild(veil);
    app.appendChild(menu);

    var ab = anchor.getBoundingClientRect(), pb = app.getBoundingClientRect();
    var sc = pb.width ? (app.offsetWidth / pb.width) : 1;
    var top = (ab.bottom - pb.top) * sc + 4;
    var mh = menu.offsetHeight;
    if (top + mh > app.offsetHeight - 8) top = Math.max(8, (ab.top - pb.top) * sc - mh - 4);
    var left = Math.min((ab.right - pb.left) * sc - menu.offsetWidth,
                        app.offsetWidth - menu.offsetWidth - 8);
    menu.style.top = top + 'px';
    menu.style.left = Math.max(8, left) + 'px';

    var btns = menu.querySelectorAll('button:not([disabled])');
    if (btns.length) btns[0].focus();

    function pick(e) {
      var b = e.target.closest('[data-pick]');
      if (!b || b.disabled) return;
      var id = b.getAttribute('data-pick');
      closeMenu(app);
      onPick(id);
    }
    function keys(e) {
      if (e.key === 'Escape') { e.stopPropagation(); closeMenu(app); anchor.focus(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var list = [].slice.call(btns);
      var at = list.indexOf(document.activeElement);
      var next = e.key === 'ArrowDown' ? at + 1 : at - 1;
      list[(next + list.length) % list.length].focus();
    }
    menu.addEventListener('click', pick);
    menu.addEventListener('keydown', keys);
    veil.addEventListener('click', function () { closeMenu(app); anchor.focus(); });
  }

  function closeMenu(app) {
    var old = app.querySelectorAll('[data-menu]');
    for (var i = 0; i < old.length; i++) old[i].remove();
  }

  /* =====================================================================
     THE QUESTION ROW

     The component the case study argues about most, so it is written once.
     Checkbox and trailing controls are fixed at the edges; the text column
     flexes and the row grows. There is no truncation rule to override
     because there is no truncation rule.
     ===================================================================== */

  function questionRow(o) {
    var tools = '';
    if (o.tools !== false) {
      tools = '<span class="cu-q__tools">' +
        (o.drag === false ? '' : '<span class="cu-ico cu-ico--sm cu-ico--mute" aria-hidden="true">' + ic('drag') + '</span>') +
        (o.menu === false ? '' :
          '<button class="cu-ico cu-ico--sm" type="button" data-act="menu" data-i="' + o.i + '" ' +
          'aria-haspopup="menu" aria-label="Options for: ' + esc(o.q) + '">' + ic('kebab') + '</button>') +
        (o.chevron ? '<span class="cu-ico cu-ico--sm cu-chev" data-open="' + (o.open ? 1 : 0) + '" aria-hidden="true">' + ic('downc') + '</span>' : '') +
        '</span>';
    }
    var body = '<span class="cu-q__t">' + esc(o.q) + '</span>';
    var box = o.check === undefined ? '' :
      '<span class="cu-box"' + (o.check ? ' data-on="1"' : '') + '>' + ic('check') + '</span>';

    /* A row that is itself a button cannot also contain the menu button. A
       button inside a button is invalid, and the browser closes the outer one
       and wrecks the layout. So a row with BOTH a checkbox and a menu is a
       div whose checkbox is its own control, which is what the source
       component is anyway. Only the review disclosure, which has no menu, is
       a single button. */
    if (o.as === 'checkrow') {
      return '<div class="cu-q">' +
        '<button class="cu-q__box" type="button" role="checkbox" aria-checked="' +
          (o.check ? 'true' : 'false') + '" data-act="' + o.act + '" data-i="' + o.i + '" ' +
          'aria-label="Asked: ' + esc(o.q) + '">' +
          '<span class="cu-box"' + (o.check ? ' data-on="1"' : '') + '>' + ic('check') + '</span>' +
        '</button>' + body + tools + '</div>';
    }
    if (o.as === 'button') {
      return '<button class="cu-q" type="button" data-act="' + o.act + '" data-i="' + o.i + '"' +
        (o.checkbox ? ' role="checkbox" aria-checked="' + (o.check ? 'true' : 'false') + '"' : '') +
        (o.expand ? ' aria-expanded="' + (o.open ? 'true' : 'false') + '"' : '') +
        '>' + box + body + tools + '</button>';
    }
    return '<div class="cu-q">' + box + body + tools + '</div>';
  }

  /* Inline editing. The original stays visible while the field is open. 
     The source board shows this, and it is what makes the edit feel like a
     correction rather than a replacement. Confirm and cancel are adjacent
     to the field, not in a modal. */
  function editRow(draft, was) {
    return '<div class="cu-edit">' +
      '<span class="cu-ico cu-ico--sm cu-ico--mute" aria-hidden="true">' + ic('pencil') + '</span>' +
      '<textarea class="cu-input" rows="2" data-field="draft" aria-label="Edit question">' + esc(draft) + '</textarea>' +
      '<span class="cu-edit__acts">' +
        '<button class="cu-ico cu-ico--sm" type="button" data-act="edit-save" aria-label="Confirm change"' +
          (draft.trim() ? '' : ' disabled') + '>' + ic('check') + '</button>' +
        '<button class="cu-ico cu-ico--sm" type="button" data-act="edit-cancel" aria-label="Cancel">' + ic('close') + '</button>' +
      '</span>' +
      (was ? '<p class="cu-edit__was">Was: “' + esc(was) + '”</p>' : '') +
      '</div>';
  }

  /* =====================================================================
     AUTHENTICATION: one state machine

     States: idle · phoneEntered · codeSent · verifying · authenticated,
     with codeIncorrect, codeExpired and connectionError branching off the
     same screens rather than replacing them. Entered data survives every
     branch, which is the point the Performance section is making.
     ===================================================================== */

  var AUTH_STATES = ['idle', 'phoneEntered', 'codeSent', 'verifying', 'authenticated'];

  function makeAuth(o) {
    /* o: { scenario(), render(), say(), done() } */
    var st = {
      state: 'idle', phone: '', code: '', err: null, errKind: null,
      long: false, resent: false
    };
    var timer = null, longTimer = null;

    function clear() { clearTimeout(timer); clearTimeout(longTimer); }

    function reset() {
      clear();
      st.state = 'idle'; st.phone = ''; st.code = ''; st.err = null;
      st.errKind = null; st.long = false; st.resent = false;
    }

    function offline() { return o.scenario().conn === 'offline'; }
    function slow() { return o.scenario().conn === 'slow'; }

    function send() {
      st.err = null; st.errKind = null;
      if (!/\d{4}/.test(st.phone.replace(/\D/g, ''))) {
        st.err = 'Enter a phone number so we can text you a code.';
        st.errKind = 'input'; o.render(); return;
      }
      if (offline()) {
        /* The number the patient typed is still there. That is the whole
           requirement: explain, preserve, offer the retry. */
        st.err = 'We couldn’t send the code. Your number is saved: check your connection and try again.';
        st.errKind = 'conn'; o.render();
        o.say('Could not send the code. Connection unavailable. Your number is saved.');
        return;
      }
      st.state = 'phoneEntered'; o.render();
      timer = setTimeout(function () {
        st.state = 'codeSent';
        if (st.phone.indexOf('555-0134') < 0) st.code = '';
        o.render();
        o.say('Code sent to ' + st.phone + '. Enter the six digits.');
      }, ms(slow() ? T.send * 3 : T.send));
    }

    function verify() {
      st.err = null; st.errKind = null;
      var sc = o.scenario();
      if (st.code.replace(/\D/g, '').length !== 6) {
        st.err = 'Enter all six digits.'; st.errKind = 'input'; o.render(); return;
      }
      if (offline()) {
        st.err = 'We couldn’t check that code. The code you entered is still here: try again when you’re back online.';
        st.errKind = 'conn'; o.render();
        o.say('Could not verify. Connection unavailable. Your code is preserved.');
        return;
      }
      st.state = 'verifying'; o.render();
      timer = setTimeout(function () {
        if (sc.auth === 'incorrect' && !st.resent) {
          st.state = 'codeSent';
          st.err = 'That code isn’t right. Check the message and try again.';
          st.errKind = 'code'; o.render();
          o.say('That code is not right. Try again.');
          return;
        }
        if (sc.auth === 'expired' && !st.resent) {
          st.state = 'codeSent';
          st.err = 'That code has expired. Codes are good for ten minutes.';
          st.errKind = 'expired'; o.render();
          o.say('That code has expired. Request a new one.');
          return;
        }
        st.state = 'authenticated'; st.long = false; o.render();
        o.say('Signed in. Setting things up.');
        /* Authenticated is not the dashboard. Patient data still has to
           arrive, and an empty dashboard would be worse than a wait that
           says what it is doing. */
        var wait = slow() ? T.boot * 3.4 : T.boot;
        longTimer = setTimeout(function () {
          if (st.state !== 'authenticated') return;
          st.long = true; o.render();
        }, ms(T.boot * 1.4));
        timer = setTimeout(function () {
          if (st.state !== 'authenticated') return;
          clearTimeout(longTimer);
          o.done();
        }, ms(wait));
      }, ms(slow() ? T.verify * 3 : T.verify));
    }

    function resend() {
      st.resent = true; st.err = null; st.errKind = null; st.code = '';
      o.render(); o.say('New code sent.');
    }

    /* --- screens ------------------------------------------------------- */

    function view() {
      if (st.state === 'idle' || st.state === 'phoneEntered') return phoneScreen();
      if (st.state === 'codeSent' || st.state === 'verifying') return codeScreen();
      return loadingScreen();
    }

    function phoneScreen() {
      var busy = st.state === 'phoneEntered';
      return appBar('', null, { back: 'auth-welcome' }) +
        '<div class="cu-scroll"><div class="cu-auth" data-focus="auth">' +
          '<h3 class="cu-auth__t">What’s your phone number?</h3>' +
          '<p class="cu-auth__p">We’ll send a code to verify it’s you. Standard messaging rates may apply.</p>' +
          '<div class="cu-field">' +
            '<label for="cu-ph">Phone number</label>' +
            '<div class="cu-field__row">' +
              '<span class="cu-field__cc">+1</span>' +
              '<input id="cu-ph" type="tel" inputmode="tel" autocomplete="off" placeholder="(555) 555-5555" ' +
                'value="' + esc(st.phone) + '" data-field="phone"' + (busy ? ' disabled' : '') + '>' +
            '</div>' +
          '</div>' +
          note(st) +
          '<button class="cu-btn" type="button" data-act="auth-send"' + (busy ? ' disabled' : '') + '>' +
            (busy ? '<span class="cu-spin"></span>Sending' : 'Send code') + '</button>' +
          /* Nobody should have to invent a phone number to look at a design.
             One tap fills both fields with obviously fictional details and
             leaves the real Send code / Verify path intact, because that path
             is the thing being demonstrated. */
          '<button class="cu-btn cu-btn--text" type="button" data-act="auth-demo">' +
            'Use demo account</button>' +
          '<p class="cu-demo-note">Prototype only &middot; no real account, no code will be sent.</p>' +
        '</div></div>';
    }

    function codeScreen() {
      var busy = st.state === 'verifying';
      var digits = st.code.replace(/\D/g, '').split('');
      var boxes = '';
      for (var i = 0; i < 6; i++) {
        boxes += '<span class="cu-code__box"' + (digits[i] ? ' data-on="1"' : '') +
          (st.errKind === 'code' || st.errKind === 'expired' ? ' data-err="1"' : '') + '>' +
          (digits[i] || '') + '</span>';
      }
      return appBar('', null, { back: 'auth-back-phone' }) +
        '<div class="cu-scroll"><div class="cu-auth" data-focus="auth">' +
          '<h3 class="cu-auth__t">Enter the code we sent</h3>' +
          '<p class="cu-auth__p">Sent to ' + esc(st.phone) + '. It’s six digits.</p>' +
          '<div class="cu-code" aria-hidden="true">' + boxes + '</div>' +
          '<label class="cu-vh" for="cu-cd">Six-digit verification code</label>' +
          '<input id="cu-cd" class="cu-code__in" type="text" inputmode="numeric" maxlength="6" ' +
            'autocomplete="one-time-code" value="' + esc(st.code) + '" data-field="code"' +
            (busy ? ' disabled' : '') + ' placeholder="Tap to type the code">' +
          note(st) +
          '<button class="cu-btn" type="button" data-act="auth-verify"' + (busy ? ' disabled' : '') + '>' +
            (busy ? '<span class="cu-spin"></span>Checking' : 'Verify') + '</button>' +
          '<button class="cu-btn cu-btn--text" type="button" data-act="auth-resend">Resend code</button>' +
          '<p class="cu-demo-note">Prototype only &middot; the demo code is already filled in.</p>' +
        '</div></div>';
    }

    function loadingScreen() {
      return '<div class="cu-scroll"><div class="cu-loading" data-focus="auth">' +
        '<h3>Welcome to Carry</h3>' +
        '<p>Setting things up for you...</p>' +
        '<span class="cu-spin cu-spin--lg" aria-hidden="true"></span>' +
        (st.long ? '<p class="cu-loading__slow">If this takes more than a moment, please check your connection.</p>' : '') +
        '</div></div>';
    }

    function note(s) {
      if (!s.err) return '';
      var kind = s.errKind === 'conn' ? 'conn' : 'err';
      return '<div class="cu-note cu-note--' + kind + '" role="alert">' +
        ic(kind === 'conn' ? 'cloudx' : 'warn') + '<span>' + esc(s.err) +
        (s.errKind === 'expired' ? ' Tap <b>Resend code</b> for a new one.' : '') +
        '</span></div>';
    }

    /* --- events -------------------------------------------------------- */

    function act(a) {
      if (a === 'auth-demo') {
        st.phone = '(555) 555-0134';
        st.code = '481902';
        st.err = null; st.errKind = null;
        o.render();
        o.say('Demo details filled in. Tap Send code to continue.');
        return true;
      }
      if (a === 'auth-send') { send(); return true; }
      if (a === 'auth-verify') { verify(); return true; }
      if (a === 'auth-resend') { resend(); return true; }
      if (a === 'auth-back-phone') { clear(); st.state = 'idle'; st.err = null; st.errKind = null; o.render(); return true; }
      return false;
    }

    function field(k, v) {
      if (k === 'phone') { st.phone = v; return true; }
      if (k === 'code') { st.code = v.replace(/\D/g, '').slice(0, 6); return true; }
      return false;
    }

    /* ENTER WHERE THE CONDITION LIVES.

       The Performance Lab does not always want this machine from the top. A
       wrong or expired code is a fact about the verify step, so the run should
       open on the code screen with the digits already in the field and press
       Verify. The phone screen before it is preamble the reader did not ask
       for. A dead connection is a fact about sending, so that one opens on the
       phone screen instead. Nothing else calls this; the Clarity section still
       starts at idle. */
    function seed(stage) {
      reset();
      if (stage === 'code') {
        st.phone = '(555) 555-0134';
        st.code = '481902';
        st.state = 'codeSent';
      } else if (stage === 'phone') {
        st.phone = '(555) 555-0134';
        st.state = 'idle';
      }
    }

    return {
      st: st, view: view, act: act, field: field, reset: reset,
      clear: clear, seed: seed, states: AUTH_STATES
    };
  }

  /* =====================================================================
     THE RECORDING PANEL: one state machine

     empty → permissionRequested → filePickerOpen → fileSelected →
     uploading → uploaded → transcribing → transcribed

     with uploadInterrupted, uploadFailed, unsupportedFile, corruptedFile,
     transcriptionDelayed and transcriptionFailed hanging off it. Every one
     of those is the same component in a different state, inside the same
     screen. None of them is a separate mock.

     Three questions every conditional state has to answer, and the reason
     the copy in here is as long as it is: what happened, what was kept,
     what can I do next.
     ===================================================================== */

  var PANEL_STATES = [
    'empty', 'permissionRequested', 'filePickerOpen', 'fileSelected',
    'uploading', 'uploaded', 'transcribing', 'transcribed'
  ];

  function makePanel(o) {
    /* o: { scenario(), render(), say(), onTranscribed() } */
    var st = {
      state: 'empty', file: null, pct: 0, granted: false,
      slow: false, delayed: false, err: null, pick: 0, retriedUpload: 0, retriedTx: 0,
      /* Set only by seed(): the panel was dropped into a mid-pipeline state,
         so the step that would normally have been scheduled by the step
         before it has to be asked for instead. */
      needsTx: false,
      /* Set only when the delayed-transcription frame IS the scenario: the
         completion timer has been cancelled and this state is the last one. */
      held: false
    };
    var timer = null, tick = null, slowTimer = null;

    function clear() { clearTimeout(timer); clearTimeout(tick); clearTimeout(slowTimer); }

    function reset() {
      clear();
      st.state = 'empty'; st.file = null; st.pct = 0; st.granted = false;
      st.slow = false; st.delayed = false; st.err = null; st.pick = 0;
      st.retriedUpload = 0; st.retriedTx = 0;
      st.needsTx = false; st.held = false;
    }

    function sc() { return o.scenario(); }

    /* The picker's contents depend on the audio scenario, not on a separate
       screen: the same first row is a good file, an unsupported one, or a
       damaged one. */
    function files() {
      var list = SEED.files.slice();
      var a = sc().audio;
      if (a === 'unsupported') list[0] = SEED.badFiles.unsupported;
      if (a === 'corrupted') list[0] = SEED.badFiles.corrupted;
      return list;
    }

    function requestPermission() {
      if (st.granted) { st.state = 'filePickerOpen'; o.render(); return; }
      st.state = 'permissionRequested'; o.render();
      o.say('Permission needed to look for your recording.');
    }

    function grant(yes) {
      if (!yes) {
        st.state = 'empty'; st.err = null; o.render();
        o.say('Permission declined. You can upload later.');
        return;
      }
      st.granted = true; st.state = 'filePickerOpen'; o.render();
      o.say('Audio files only. Five recordings on this device.');
    }

    function choose(i) { st.pick = i; o.render(); }

    function upload() {
      var f = files()[st.pick];
      st.file = f;

      /* Rejected before a single byte moves. An unsupported file is a
         choosing problem, and the fix is choosing again, so it never
         becomes an upload that fails halfway. */
      if (f.kind === 'unsupported') {
        st.state = 'fileSelected';
        st.err = {
          k: 'unsupported',
          what: 'That file isn’t an audio recording.',
          kept: 'Nothing was uploaded.',
          next: 'Choose an audio file, Carry reads .m4a, .mp3 and .wav.'
        };
        o.render(); o.say('Unsupported file. Nothing was uploaded.');
        return;
      }

      st.state = 'uploading'; st.pct = 0; st.err = null; st.slow = false;
      st.retriedUpload = 0;              /* a fresh attempt, not a resume */
      o.render(); o.say('Uploading your recording.');
      run();
    }

    function run() {
      var s = sc();
      var slowNet = s.conn === 'slow';
      var span = ms(slowNet ? T.upSlow : T.up);
      var steps = 20;
      /* A retry that fails again is honest but useless to look at: the point
         of designing the recovery is that the reader gets to watch it work.
         So the first attempt fails and the resume succeeds, which is also
         the common shape of a real transient failure. */
      var stop = st.retriedUpload ? steps
        : (s.upload === 'interrupted' ? 9 : (s.upload === 'failed' ? 14 : steps));
      var n = Math.round(st.pct / (100 / steps));

      /* "Still working" has to be said out loud on a slow connection, or a
         stalled-looking bar reads as a broken upload. */
      clearTimeout(slowTimer);
      if (slowNet) {
        slowTimer = setTimeout(function () {
          if (st.state === 'uploading') { st.slow = true; o.render(); }
        }, ms(900));
      }

      (function step() {
        if (st.state !== 'uploading') return;
        n++;
        st.pct = Math.min(100, Math.round(n * (100 / steps)));
        o.render();
        if (n >= stop && stop < steps) {
          clearTimeout(slowTimer);
          if (s.upload === 'interrupted') {
            st.state = 'uploadInterrupted';
            st.err = {
              k: 'conn',
              what: 'The connection dropped partway through the upload.',
              kept: 'Your recording is still selected. You don’t need to find it again.',
              next: 'Resume when you’re back online, or leave this and come back.'
            };
            o.render(); o.say('Connection lost during upload. Your file is still selected.');
          } else {
            st.state = 'uploadFailed';
            st.err = {
              k: 'fail',
              what: 'The upload didn’t complete.',
              kept: 'Your recording is still selected and nothing else was lost.',
              next: 'Try the upload again.'
            };
            o.render(); o.say('Upload failed. Your file is still selected.');
          }
          return;
        }
        if (n >= steps) {
          clearTimeout(slowTimer);
          st.slow = false;
          st.state = 'uploaded'; o.render(); o.say('Upload complete.');
          timer = setTimeout(transcribe, ms(320));
          return;
        }
        tick = setTimeout(step, span / steps);
      })();
    }

    function transcribe() {
      var s = sc();

      /* A corrupted file gets past upload and fails in processing, and the
         copy has to say which of the two it was, otherwise the patient
         retries the network problem they do not have. */
      if (st.file && st.file.kind === 'corrupted') {
        st.state = 'transcriptionFailed';
        st.err = {
          k: 'file',
          what: 'This recording couldn’t be read. The file uploaded fine, so this is the audio itself, not your connection.',
          kept: 'The upload is saved and your questions are untouched.',
          next: 'Upload a different recording of the same conversation if you have one.'
        };
        o.render(); o.say('The recording could not be processed. The file appears to be damaged.');
        return;
      }

      st.state = 'transcribing'; st.delayed = false; st.err = null;
      o.render(); o.say('Transcribing the conversation.');

      var delayed = s.transcribe === 'delayed';
      var span = ms(delayed ? T.txSlow : (s.conn === 'slow' ? T.txSlow * 0.8 : T.tx));

      if (delayed) {
        slowTimer = setTimeout(function () {
          if (st.state !== 'transcribing') return;
          st.delayed = true;
          /* WHEN THE WAIT IS THE WHOLE SCENARIO, THE WAIT IS THE LAST FRAME.

             A reader who asks for delayed transcription and then watches it
             succeed has been shown the normal path with a longer pause in the
             middle of it. Where nothing downstream is also set, the completion
             is cancelled and the screen rests on the message that answers the
             question they asked: it is still going, your upload is safe, you
             can leave. Anything downstream and it completes as before, because
             then this is one beat in a longer run. */
          if (o.holdDelayed && o.holdDelayed()) { clearTimeout(timer); st.held = true; }
          o.render();
          o.say('Transcription is taking longer than usual. You can leave this screen.');
        }, ms(1100));
      }

      timer = setTimeout(function () {
        if (st.state !== 'transcribing') return;
        if (s.transcribe === 'failed' && !st.retriedTx) {
          st.state = 'transcriptionFailed';
          st.err = {
            k: 'fail',
            what: 'Transcription didn’t finish.',
            kept: 'Your recording is uploaded and safe. Nothing was written from a partial transcript.',
            next: 'Try transcribing again.'
          };
          o.render(); o.say('Transcription failed. Your recording is still here.');
          return;
        }
        st.state = 'transcribed'; st.delayed = false; o.render();
        o.say('Transcript ready.');
        if (o.onTranscribed) o.onTranscribed();
      }, span);
    }

    /* --- the panel ----------------------------------------------------- */

    function panel() {
      var s = st.state;
      var h = '<div class="cu-rec" data-focus="upload"><b class="cu-rec__h">Your recording</b>';

      if (s === 'empty' || s === 'permissionRequested' || s === 'filePickerOpen') {
        h += '<p class="cu-rec__p">Upload an audio file from your phone after the conversation. Carry will transcribe it.</p>' +
          '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-upload">' +
            ic('folder') + 'Upload recording</button>';
      }
      else if (s === 'fileSelected' || s === 'uploadInterrupted' || s === 'uploadFailed') {
        h += fileLine(st.file, st.state === 'fileSelected' && !st.err ? 'Ready to upload' : null);
        if (st.err) h += errBlock(st.err);
        h += '<div class="cu-rec__acts">';
        if (st.err && st.err.k === 'unsupported') {
          h += '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-upload">Choose another recording</button>';
        } else if (s === 'uploadInterrupted') {
          h += '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-retry">' + ic('replay') + 'Resume upload</button>';
        } else if (s === 'uploadFailed') {
          h += '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-retry">' + ic('replay') + 'Try again</button>';
        } else {
          h += '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-go">Upload this recording</button>';
        }
        h += '</div>';
      }
      else if (s === 'uploading') {
        h += '<p class="cu-rec__p">Uploading your recording...</p>' +
          '<div class="cu-prog"><i style="width:' + st.pct + '%"></i></div>' +
          (st.slow ? '<p class="cu-rec__wait">' + ic('hist') +
            'This is slower than usual. Still uploading; you can leave this screen and come back.</p>' : '');
      }
      else if (s === 'uploaded') {
        h += '<p class="cu-rec__p">Upload complete.</p><div class="cu-prog"><i style="width:100%"></i></div>';
      }
      else if (s === 'transcribing') {
        h += '<p class="cu-rec__p">Transcribing the conversation...</p>' +
          '<div class="cu-prog"><i class="is-indet"></i></div>' +
          (st.delayed
            ? '<p class="cu-rec__wait">' + ic('hist') +
              '<b>Your recording uploaded successfully.</b> Transcription is taking longer than usual. ' +
              'You can leave this screen. We’ll keep going and it will be here when you come back.</p>'
            : '');
      }
      else if (s === 'transcriptionFailed') {
        h += fileLine(st.file, 'Uploaded');
        h += errBlock(st.err);
        h += '<div class="cu-rec__acts">' +
          (st.err && st.err.k === 'file'
            ? '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-upload">Choose another recording</button>'
            : '<button class="cu-btn cu-btn--tonal" type="button" data-act="rec-retry-tx">' + ic('replay') + 'Try transcribing again</button>') +
          '</div>';
      }
      else if (s === 'transcribed') {
        h += fileLine(st.file, 'Transcribed', true);
        h += '<div class="cu-tx">' + esc(SEED.transcript[0].s) + ': ' +
          esc(SEED.transcript[0].t.slice(0, 150)) + '...</div>';
      }

      return h + '</div>';
    }

    function fileLine(f, meta, play) {
      if (!f) return '';
      return '<div class="cu-file">' +
        '<span class="cu-file__ico">' + ic('wave') + '</span>' +
        '<span class="cu-file__t"><b>' + esc(f.n) + '</b>' +
          '<span>' + esc(f.m.split(' · ')[0]) + (meta ? ' · ' + esc(meta) : '') + '</span></span>' +
        (play ? '<span class="cu-file__play" aria-hidden="true">' + ic('play') + '</span>' : '') +
        '</div>';
    }

    /* Every conditional state renders through this. Three lines, always in
       the same order, so a reader learns the shape once. */
    function errBlock(e) {
      return '<div class="cu-fail cu-fail--' + e.k + '" role="alert">' +
        '<span class="cu-fail__ico">' + ic(e.k === 'conn' ? 'cloudx' : 'warn') + '</span>' +
        '<span class="cu-fail__b">' +
          '<b>' + esc(e.what) + '</b>' +
          '<span>' + esc(e.kept) + '</span>' +
          '<em>' + esc(e.next) + '</em>' +
        '</span></div>';
    }

    /* --- overlays ------------------------------------------------------ */

    function overlay() {
      if (st.state === 'permissionRequested') return permission();
      if (st.state === 'filePickerOpen') return picker();
      return '';
    }

    function permission() {
      return '<div class="cu-scrim" data-act="noop"></div>' +
        '<div class="cu-dialog" role="dialog" aria-modal="true" aria-labelledby="cu-perm-t" data-trap>' +
          '<span class="cu-dialog__ico">' + ic('folder') + '</span>' +
          '<h4 id="cu-perm-t">Allow Carry to access your files?</h4>' +
          '<p>Carry needs access to find your conversation recording. Only audio files will be shown. ' +
             'Carry never sees photos, documents, or other files.</p>' +
          '<div class="cu-dialog__acts">' +
            '<button class="cu-btn cu-btn--text cu-btn--auto" type="button" data-act="perm-no">Not now</button>' +
            '<button class="cu-btn cu-btn--text cu-btn--auto" type="button" data-act="perm-yes">Allow</button>' +
          '</div>' +
        '</div>';
    }

    function picker() {
      var list = files();
      return '<div class="cu-scrim" data-act="pick-close"></div>' +
        '<div class="cu-sheet" role="dialog" aria-modal="true" aria-label="Audio files" data-trap>' +
          '<span class="cu-sheet__grab" aria-hidden="true"></span>' +
          '<div class="cu-sheet__head">' + ic('wave') + '<b>Audio files</b>' +
            '<button class="cu-ico cu-ico--sm" type="button" data-act="pick-close" aria-label="Close">' + ic('close') + '</button>' +
          '</div>' +
          '<div class="cu-search">' + ic('search') + '<span>Search audio files</span></div>' +
          '<div class="cu-sheet__bar"><span>On this iPhone</span>' +
            '<span class="cu-sheet__acts">' +
              '<button class="cu-btn cu-btn--out cu-btn--auto cu-btn--sm" type="button" data-act="pick-close">Cancel</button>' +
              '<button class="cu-btn cu-btn--pill cu-btn--auto cu-btn--sm" type="button" data-act="pick-upload">Upload</button>' +
            '</span></div>' +
          '<div class="cu-sheet__list" role="listbox" aria-label="Audio files on this device">' +
            list.map(function (f, i) {
              return '<button class="cu-file cu-file--pick" type="button" role="option" ' +
                'aria-selected="' + (st.pick === i) + '" data-act="pick" data-i="' + i + '">' +
                '<span class="cu-file__ico">' + (st.pick === i ? ic('checkc') : ic('wave')) + '</span>' +
                '<span class="cu-file__t"><b>' + esc(f.n) + '</b><span>' + esc(f.m) + '</span></span></button>';
            }).join('') +
          '</div>' +
          '<p class="cu-sheet__note">Only audio files are listed. This picker is simulated; it never reaches a real device.</p>' +
        '</div>';
    }

    /* ENTER WHERE THE CONDITION LIVES: the panel's half of it.

       'audio' and 'upload' open on a chosen file, because both are facts about
       what happens once a recording is selected and the picker before them is
       preamble. 'transcribe' opens on a completed upload, because a delayed or
       failed transcript is a fact about the step after the bytes have landed.
       'match' opens on a finished transcript, because matching is a fact about
       what the model could find in one. Anything else starts at empty, which
       is the full normal demonstration. */
    function seed(stage) {
      clear();
      reset();
      if (stage === 'normal' || !stage) return;

      var list = files();
      st.granted = true;
      st.pick = 0;
      st.file = list[0];

      if (stage === 'audio' || stage === 'upload') { st.state = 'fileSelected'; return; }
      if (stage === 'transcribe') { st.state = 'uploaded'; st.pct = 100; st.needsTx = true; return; }
      if (stage === 'match') { st.state = 'transcribed'; st.pct = 100; return; }
    }

    function act(a, i) {
      if (a === 'rec-upload') { requestPermission(); return true; }
      /* Only ever sent to a seeded 'uploaded': in a run that got there the
         normal way, transcription is already scheduled. */
      if (a === 'rec-start-tx') { st.needsTx = false; transcribe(); return true; }
      if (a === 'perm-yes') { grant(true); return true; }
      if (a === 'perm-no') { grant(false); return true; }
      if (a === 'pick') { choose(i); return true; }
      if (a === 'pick-close') { st.state = st.file ? 'fileSelected' : 'empty'; o.render(); return true; }
      if (a === 'pick-upload') { st.state = 'fileSelected'; st.err = null; o.render(); upload(); return true; }
      if (a === 'rec-go') { upload(); return true; }
      if (a === 'rec-retry') { st.retriedUpload++; st.err = null; st.state = 'uploading'; o.render(); run(); return true; }
      if (a === 'rec-retry-tx') { st.retriedTx++; st.err = null; transcribe(); return true; }
      return false;
    }

    return {
      st: st, panel: panel, overlay: overlay, act: act,
      reset: reset, clear: clear, seed: seed, states: PANEL_STATES, files: files
    };
  }

  /* =====================================================================
     ARTIFACT 1: PREPARING (Clarity)

     The canonical path from welcome to a prepared conversation. Everything
     the Clarity section claims is checkable here in under a minute: add a
     suggested question and undo it, open the contextual menu, edit inline,
     move a question, delete one.
     ===================================================================== */

  function artPrepare(root) {
    var app = root.querySelector('[data-app]');
    var st, auth, snack;
    var freshT = null;

    var scenario = function () { return { conn: 'fast', auth: 'correct' }; };

    function init() {
      if (auth) auth.clear();
      st = {
        /* STRAIGHT TO THE THING BEING DEMONSTRATED. This section is about
           preparing a conversation, not about signing in, and five taps of
           authentication before the first real interaction is five taps most
           readers will not spend. The auth flow still exists. It is the
           subject of the Performance section, where it belongs. */
        view: 'prep',
        bring: SEED.bring.map(function () { return false; }),
        qs: SEED.questions.slice(),
        cats: SEED.suggested.map(function (c, i) { return { open: i === 0, taken: [] }; }),
        editing: -1, adding: false, draft: '', snack: null, undo: null, justAdded: null
      };
      clearTimeout(freshT);
      auth = makeAuth({
        scenario: scenario,
        render: render,
        say: function (m) { say(root, m); },
        done: function () { st.view = 'dash'; render(); say(root, 'Signed in. Dashboard.'); }
      });
      snack = makeSnack(root, render);
    }

    function render() {
      closeMenu(app);
      var v = st.view, h = '';

      if (v === 'welcome') {
        h = '<div class="cu-scroll"><div class="cu-welcome">' +
          '<span class="cu-mark" aria-hidden="true">' + ic('msg') + '</span>' +
          '<h3>Carry</h3>' +
          '<p>A calmer way to keep track of your care.</p>' +
          '<div class="cu-welcome__foot">' +
            '<button class="cu-btn" type="button" data-act="go-auth">Sign in</button>' +
            '<button class="cu-btn cu-btn--text" type="button" data-act="noop">Learn how Carry works</button>' +
          '</div></div></div>';
      }
      else if (v === 'auth') { h = auth.view(); }
      else if (v === 'dash') { h = dashboard(); }
      else if (v === 'prep') { h = prepare(); }

      app.innerHTML = h + snackbar(st) + '<span class="cu-live" data-live aria-live="polite"></span>';

      var f = app.querySelector('[data-field="draft"]');
      if (f && (st.editing >= 0 || st.adding)) { f.focus(); f.selectionStart = f.value.length; }
      /* Inside the device's own scroller, never the page. scrollIntoView on a
         node inside a transformed, scaled frame will happily scroll the whole
         document to find it, which is how adding a question used to throw the
         reader back to the top of the case study. */
      var fresh = app.querySelector('[data-scroll-to]');
      if (fresh) {
        var pane = app.querySelector('.cu-scroll');
        if (pane) {
          var top = fresh.offsetTop - pane.offsetTop - 12;
          pane.scrollTo({ top: Math.max(0, top), behavior: reduced.matches ? 'auto' : 'smooth' });
        }
      }
    }

    function dashboard() {
      return '<div class="cu-scroll">' +
        '<div class="cu-greet"><b>Good morning, ' + esc(SEED.who) + '</b>' +
          '<span class="cu-avatar">' + esc(SEED.initials) + '</span></div>' +

        '<div class="cu-card cu-card--tint">' +
          '<p class="cu-label">Next conversation</p>' +
          '<h4 class="cu-card__t">' + esc(SEED.title) + '</h4>' +
          '<p class="cu-card__m">' + esc(SEED.when) + '</p>' +
          '<p class="cu-card__d">' + esc(SEED.reason) + '</p>' +
          '<button class="cu-btn" type="button" data-act="go-prep">Prepare for the conversation</button>' +
          '<button class="cu-btn cu-btn--text" type="button" data-act="noop">Add this to my calendar</button>' +
        '</div>' +

        '<div class="cu-sec"><b>Your journey</b></div>' +
        '<div class="cu-journey">' +
          '<span class="cu-journey__line"></span>' +
          '<span class="cu-journey__now">Now</span>' +
          SEED.journey.map(function (j, i) {
            return '<span class="cu-journey__stop" style="left:' + (i ? 74 : 26) + '%">' +
              '<i data-k="' + j.k + '"></i><b>' + esc(j.lab) + '</b><span>' + esc(j.d) + '</span></span>';
          }).join('') +
        '</div>' +

        '<div class="cu-sec"><b>Recent conversations</b>' +
          '<button class="cu-btn cu-btn--text cu-btn--auto" type="button" data-act="noop">See all</button></div>' +
        '<div class="cu-card cu-card--list">' + SEED.recent.map(function (c) {
          return '<span class="cu-item"><span class="cu-item__ico">' + ic('msg') + '</span>' +
            '<span class="cu-item__t"><b>' + esc(c.t) + '</b><span>' + esc(c.d) + '</span></span>' +
            '<svg class="cu-item__go" viewBox="0 0 24 24" aria-hidden="true">' + ICON.right + '</svg></span>';
        }).join('') + '</div>' +

        '<div class="cu-sec"><b>Follow-ups</b><span>' +
          SEED.dashFollowups.filter(function (f) { return f.done; }).length + ' of ' +
          SEED.dashFollowups.length + ' done</span></div>' +
        '<div class="cu-card cu-card--list">' + SEED.dashFollowups.map(function (f, i) {
          return checkRow(f.t, f.done, 'noop', i, { readonly: true });
        }).join('') + '</div>' +

        '<div class="cu-quick">' +
          [['pluso', 'Add', 'appointment'], ['hist', 'All', 'conversations'],
           ['bulb', 'Resources', ''], ['gear', 'Settings', '']].map(function (q) {
            return '<span class="cu-quick__c">' + ic(q[0]) + '<b>' + q[1] +
              (q[2] ? '<br>' + q[2] : '') + '</b></span>';
          }).join('') +
        '</div><div class="cu-pad"></div></div>';
    }

    function prepare() {
      var checked = st.bring.filter(Boolean).length;
      var totalSugg = SEED.suggested.reduce(function (n, c) { return n + c.qs.length; }, 0);

      /* SUGGESTIONS FIRST, THEN THE PATIENT'S OWN LIST, THEN THE CHECKLIST.
         The order follows what somebody does here: browse what they could ask,
         watch it land in their list, and only then think about the day itself.
         With the library above the list, a question that arrives at the top of
         "My questions" appears just below where it was tapped. */
      var suggested =
        '<div class="cu-card"><div class="cu-sec"><b>' + ic('sparkle') + 'Suggested questions</b>' +
          '<span>' + totalSugg + ' questions</span></div>' +
          SEED.suggested.map(function (c, ci) {
            var sc = st.cats[ci];
            return '<div class="cu-cat">' +
              '<button class="cu-cat__h" type="button" data-act="cat" data-i="' + ci + '" ' +
                'aria-expanded="' + (sc.open ? 'true' : 'false') + '">' +
                '<span><b>' + esc(c.name) + '</b><span>' + c.qs.length + ' questions, ' +
                  sc.taken.length + ' added</span></span>' +
                '<span class="cu-ico cu-ico--sm cu-chev" data-open="' + (sc.open ? 1 : 0) + '" aria-hidden="true">' +
                  ic('downc') + '</span></button>' +
              (sc.open
                ? c.qs.map(function (q, qi) {
                    var on = sc.taken.indexOf(qi) >= 0;
                    return '<button class="cu-sug" type="button" data-act="sugg" data-c="' + ci +
                      '" data-i="' + qi + '" data-on="' + (on ? 1 : 0) + '"' + (on ? ' disabled' : '') +
                      ' aria-label="' + (on ? 'Added: ' : 'Add: ') + esc(q) + '">' +
                      '<span class="cu-sug__t">' + esc(q) + '</span>' +
                      '<span class="cu-sug__add">' + ic(on ? 'checkc' : 'plus') + '</span></button>';
                  }).join('')
                : '') +
            '</div>';
          }).join('') +
          '<p class="cu-hint">Tap any question to add it to your list.</p>' +
        '</div>';

      var mine =
        '<div class="cu-card" data-scroll="q"><div class="cu-sec"><b>My questions</b>' +
          '<span>' + st.qs.length + ' prepared</span></div>' +
          st.qs.map(function (q, i) {
            if (st.editing === i) return editRow(st.draft, q);
            var fresh = st.justAdded === q;
            return '<div class="cu-qwrap"' + (fresh ? ' data-fresh="1"' : '') +
                     (fresh ? ' data-scroll-to="1"' : '') + '>' +
              (fresh ? '<p class="cu-fresh">' + ic('check') + 'Just added</p>' : '') +
              questionRow({ q: q, i: i, as: 'div' }) +
            '</div>';
          }).join('') +
          (st.adding
            ? '<div class="cu-edit">' +
                '<span class="cu-ico cu-ico--sm cu-ico--mute" aria-hidden="true">' + ic('plus') + '</span>' +
                '<textarea class="cu-input" rows="2" data-field="draft" placeholder="What do you want to ask?" ' +
                  'aria-label="New question">' + esc(st.draft) + '</textarea>' +
                '<span class="cu-edit__acts">' +
                  '<button class="cu-ico cu-ico--sm" type="button" data-act="add-save" aria-label="Add question"' +
                    (st.draft.trim() ? '' : ' disabled') + '>' + ic('check') + '</button>' +
                  '<button class="cu-ico cu-ico--sm" type="button" data-act="add-cancel" aria-label="Cancel">' + ic('close') + '</button>' +
                '</span></div>'
            : '<button class="cu-row cu-row--add" type="button" data-act="add-open">' +
              '<span class="cu-row__ico">' + ic('plus') + '</span>' +
              '<span class="cu-row__t">Add your own question</span></button>') +
        '</div>';

      var bring =
        '<div class="cu-card"><div class="cu-sec"><b>Things to bring</b>' +
          '<span>' + checked + ' of ' + SEED.bring.length + ' checked</span></div>' +
          SEED.bring.map(function (b, i) { return checkRow(b, st.bring[i], 'bring', i); }).join('') +
          '<p class="cu-hint">Check items off as you gather them.</p>' +
        '</div>';

      return appBar(SEED.title, SEED.whenShort, { back: 'go-dash', trail: 'gear' }) +
        '<div class="cu-scroll">' + suggested + mine + bring +
        '<div class="cu-pad"></div></div>' +
        actionBar('Start the conversation', 'noop');
    }

    /* --- events -------------------------------------------------------- */

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-act');
      var i = +b.getAttribute('data-i');
      var c = +b.getAttribute('data-c');
      if (a !== 'noop') used(root);

      if (a === 'reset') { init(); render(); say(root, 'Reset.'); return; }
      if (a === 'noop') return;

      if (st.view === 'auth' && auth.act(a)) return;

      if (a === 'go-auth') { st.view = 'auth'; render(); return; }
      if (a === 'auth-welcome') { st.view = 'welcome'; auth.reset(); render(); return; }
      if (a === 'go-dash') { st.view = 'dash'; render(); return; }
      if (a === 'go-prep') { st.view = 'prep'; render(); say(root, 'Preparing for the conversation.'); return; }

      if (a === 'bring') {
        st.bring[i] = !st.bring[i]; render();
        say(root, st.bring.filter(Boolean).length + ' of ' + SEED.bring.length + ' checked');
        return;
      }

      if (a === 'cat') { st.cats[i].open = !st.cats[i].open; render(); return; }

      if (a === 'sugg') {
        var q = SEED.suggested[c].qs[i];
        st.cats[c].taken.push(i);
        /* TOP OF THE LIST, NOT THE BOTTOM. A question added to the end of six
           others is a question nobody sees arrive. */
        st.qs.unshift(q);
        st.justAdded = q;
        st.undo = { c: c, i: i, q: q };
        snack(st, 'Added to your questions', true);
        render();
        say(root, 'Added to your questions: ' + q);
        clearTimeout(freshT);
        freshT = setTimeout(function () {
          if (st.justAdded !== q) return;
          st.justAdded = null; render();
        }, ms(2600));
        return;
      }

      if (a === 'undo') {
        if (!st.undo) return;
        var u = st.undo;
        var at = st.cats[u.c].taken.indexOf(u.i);
        if (at >= 0) st.cats[u.c].taken.splice(at, 1);
        var qi = st.qs.indexOf(u.q);
        if (qi >= 0) st.qs.splice(qi, 1);
        st.undo = null;
        st.justAdded = null;
        snack(st, null);
        render();
        say(root, 'Removed again.');
        return;
      }

      if (a === 'add-open') { st.adding = true; st.draft = ''; st.editing = -1; render(); return; }
      if (a === 'add-cancel') { st.adding = false; st.draft = ''; render(); return; }
      if (a === 'add-save') {
        var t = st.draft.trim();
        if (!t) return;
        st.qs.push(t); st.adding = false; st.draft = ''; render();
        say(root, 'Question added. ' + st.qs.length + ' prepared.');
        return;
      }

      if (a === 'edit-cancel') { st.editing = -1; st.draft = ''; render(); return; }
      if (a === 'edit-save') {
        var nt = st.draft.trim();
        if (!nt || st.editing < 0) return;
        st.qs[st.editing] = nt;
        st.editing = -1; st.draft = '';
        snack(st, 'Question updated', false);
        render();
        say(root, 'Question updated.');
        return;
      }

      if (a === 'menu') {
        var qq = st.qs[i];
        openMenu(app, b, [
          { id: 'edit', icon: 'pencil', label: 'Edit question' },
          { id: 'top', icon: 'up', label: 'Move to top', off: i === 0 },
          { id: 'bottom', icon: 'down', label: 'Move to bottom', off: i === st.qs.length - 1 },
          { id: 'del', icon: 'trash', label: 'Delete question', danger: true }
        ], function (id) {
          if (id === 'edit') { st.editing = i; st.draft = qq; st.adding = false; }
          else if (id === 'top') { st.qs.splice(i, 1); st.qs.unshift(qq); snack(st, 'Question moved'); say(root, 'Moved to top.'); }
          else if (id === 'bottom') { st.qs.splice(i, 1); st.qs.push(qq); snack(st, 'Question moved'); say(root, 'Moved to bottom.'); }
          else if (id === 'del') { st.qs.splice(i, 1); snack(st, 'Question deleted'); say(root, 'Question deleted. ' + st.qs.length + ' prepared.'); }
          render();
        });
        return;
      }
    });

    root.addEventListener('input', function (e) {
      var f = e.target.closest('[data-field]');
      if (!f || !root.contains(f)) return;
      var k = f.getAttribute('data-field');
      if (k === 'draft') {
        st.draft = f.value;
        var save = app.querySelector('[data-act="edit-save"], [data-act="add-save"]');
        if (save) save.disabled = !st.draft.trim();   /* no re-render: keeps the caret */
        return;
      }
      auth.field(k, f.value);
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(app); return; }
      if (e.key !== 'Enter') return;
      var f = e.target.closest('[data-field]');
      if (!f) return;
      if (f.tagName === 'INPUT') {
        e.preventDefault();
        var go = app.querySelector('[data-act="auth-send"], [data-act="auth-verify"]');
        if (go && !go.disabled) go.click();
      } else if (!e.shiftKey) {
        e.preventDefault();
        var s = app.querySelector('[data-act="edit-save"], [data-act="add-save"]');
        if (s && !s.disabled) s.click();
      }
    });

    init(); render();
  }

  /* =====================================================================
     ARTIFACT 2: WIDTHS (Clarity)

     The same QuestionRow at 375, 390 and 440, with the same long question
     in it. Nothing is truncated at any width; the row's height is what
     changes, and the number under each frame is measured from the DOM
     rather than written into the copy and hoped to still be true.
     ===================================================================== */

  /* Real devices, so the frame is a real screen rather than a crop of one:
     the height is the device's own, not a number that happened to fit. */
  /* THREE REAL VIEWPORTS, NAMED ACCURATELY.

     The old set was "375pt iPhone SE", "390pt iPhone 14/15/16" and "440pt
     iPhone Pro Max", and two of those three were wrong: 390 x 844 is the 13,
     14 and 15's non-Pro predecessor rather than the 15 or 16, and there has
     never been a 440pt Pro Max. A comparison whose whole claim is "these are
     real screens at their real heights" cannot get the screens wrong.

     The third one is Android now rather than a fourth iPhone, because the
     argument is that ONE rule set adapts, and a row of iPhones only proves it
     adapts across iPhones. It is labelled as a reference viewport rather than
     as a handset, since 412 x 915 is the density-independent size a great many
     Android devices report and not the badge on any particular one. */
  var WIDTHS = [
    { w: 375, h: 667, unit: 'pt', dev: 'se',      name: 'iPhone SE (4.7-inch)' },
    { w: 393, h: 852, unit: 'pt', dev: 'ios',     name: 'iPhone 15 / 16' },
    { w: 412, h: 915, unit: 'px', dev: 'android', name: 'Android reference viewport' }
  ];

  /* The rules the three of them share, stated once. They are read off the
     stylesheet rather than written here as decoration: --cu-row is 56, .cu-q
     pads 16 top and bottom, and every control in the row clears 44. */
  var SHARED_RULES = '56 min row &middot; 16 vertical padding &middot; 44 minimum touch target';

  /* Chosen so the comparison actually shows something. The middle one is the
     documented case: two lines at 375, one line at 440. The third is longer
     than any width can take in one line, and the point there is that it is
     still shown in full at all three. */
  var SAMPLES = [
    ['One line at 440', 'Has anything changed since my last test?'],
    ['Three lines, then two', 'How accurate is this test, and what’s the chance of an inconclusive result?'],
    ['Wraps at every width', SEED.longQ]
  ];

  function artWidths(root) {
    var wrap = root.querySelector('[data-widths]');
    var st = { text: SAMPLES[0][1], only: 'all' };
    var field = root.querySelector('[data-field="q"]');
    if (field) field.value = st.text;

    /* Below this there is no room for a side-by-side comparison, so the
       control stops meaning "which of the three to highlight" and starts
       meaning "which device am I looking at". "All" is hidden at this width
       rather than left as an option that produces three unreadable slivers. */
    var side = window.matchMedia('(min-width: 1100px)');
    function effectiveOnly() {
      return (!side.matches && st.only === 'all') ? '393' : st.only;
    }

    function render(keepCaret) {
      var caret = null;
      if (keepCaret) {
        var cur = root.querySelector('[data-field="q"]');
        if (cur) caret = cur.selectionStart;
      }

      /* ONE SCREEN AT A TIME ON A PHONE. Three frames side by side is a
         comparison you can only make on a desk. On a phone each one is a
         third of a third and none of them is a screen any more, so the
         width control stops being a filter over a row and becomes the
         choice of which device you are looking at. */
      var only = effectiveOnly();
      var single = only !== 'all';
      var list = single
        ? WIDTHS.filter(function (d) { return String(d.w) === only; })
        : WIDTHS;

      wrap.setAttribute('data-single', single ? '1' : '0');

      wrap.innerHTML = list.map(function (d) {
        return '<figure class="cu-w">' +
          '<figcaption class="cu-w__cap"><b>' + d.w + ' &times; ' + d.h + ' ' + d.unit + '</b>' +
            '<span>' + esc(d.name) + '</span></figcaption>' +
          '<div class="cu-w__fit" data-dev="' + d.dev + '" data-wfit="' + d.w + '" data-wh="' + d.h + '">' +
            '<div class="cu-app cu-w__app" data-dev="' + d.dev + '" style="--cu-w:' + d.w + 'px;height:' + d.h + 'px">' +
              appBar(SEED.title, SEED.whenShort, { back: 'noop', trail: 'gear' }) +
              '<div class="cu-scroll">' +
                /* A REAL SCREEN HAS CONTENT ON IT. Three rows in a 956pt frame
                   left most of the device empty, which read as a broken
                   prototype rather than as a tall phone. This is the actual
                   preparation screen, so the frame shows what the device would
                   show and the row being measured sits in its real context. */
                '<div class="cu-card"><div class="cu-sec"><b>Things to bring</b>' +
                  '<span>2 of 6 checked</span></div>' +
                  SEED.bring.slice(0, 4).map(function (t, k) {
                    return checkRow(t, k < 2, 'noop', k, { readonly: true });
                  }).join('') +
                '</div>' +
                '<div class="cu-card"><div class="cu-sec"><b>My questions</b><span>6 prepared</span></div>' +
                  '<div class="cu-q" data-measure="' + d.w + '">' +
                    '<span class="cu-q__t">' + esc(st.text || ' ') + '</span>' +
                    '<span class="cu-q__tools">' +
                      '<span class="cu-ico cu-ico--sm cu-ico--mute">' + ic('drag') + '</span>' +
                      '<span class="cu-ico cu-ico--sm">' + ic('kebab') + '</span></span></div>' +
                  questionRow({ q: SEED.questions[1], i: 1, as: 'div' }) +
                  questionRow({ q: SEED.questions[2], i: 2, as: 'div' }) +
                  questionRow({ q: SEED.questions[3], i: 3, as: 'div' }) +
                  questionRow({ q: SEED.questions[5], i: 4, as: 'div' }) +
                  '<button class="cu-row cu-row--add" type="button" data-act="noop">' +
                    '<span class="cu-row__ico">' + ic('plus') + '</span>' +
                    '<span class="cu-row__t">Add your own question</span></button>' +
                '</div>' +
                '<div class="cu-card"><div class="cu-sec"><b>' + ic('sparkle') + 'Suggested questions</b>' +
                  '<span>17 questions</span></div>' +
                  '<p class="cu-hint">Tap any question to add it to your list.</p>' +
                '</div>' +
                '<div class="cu-pad"></div>' +
              '</div>' +
              '<div class="cu-foot"><button class="cu-btn" type="button" data-act="noop">Start the conversation</button></div>' +
            '</div>' +
          '</div>' +
          /* THE CAPTION DESCRIBES THE SYSTEM, NOT THE DEVICE.

             It used to read "Row 80pt · button 343pt wide", which is three
             different numbers on three screens and reads as three separately
             tuned layouts. The opposite of what this is here to show. The
             rules are identical and stated identically; the only number that
             differs is the one being measured, and it differs because the text
             wrapped, which is the point. */
          '<p class="cu-w__read"><span class="cu-w__rule">' + SHARED_RULES + '</span>' +
            '<span class="cu-w__meas">This row: <b data-h="' + d.w + '">56</b></span></p>' +
        '</figure>';
      }).join('');

      fitWidths();
      measure();
      if (caret !== null) {
        var f = root.querySelector('[data-field="q"]');
        if (f) { f.focus(); f.selectionStart = f.selectionEnd = caret; }
      }
    }

    function measure() {
      WIDTHS.forEach(function (d) {
        var row = wrap.querySelector('[data-measure="' + d.w + '"]');
        var out = wrap.querySelector('[data-h="' + d.w + '"]');
        if (!row || !out) return;
        /* clientHeight, not getBoundingClientRect: it reports layout pixels
           (so the display transform does not have to be divided back out) and
           it excludes the 1px separator, which belongs to the list rather
           than to the row. What comes out is the component's own height. */
        out.textContent = row.clientHeight;
      });
    }

    /* ONE SCALE FOR ALL THREE. Fitting each frame to its own column would
       render 375 and 440 at the same on-screen width, which is the exact
       thing this artifact exists to show. So the three share a single scale
       and keep their true relative widths: the 375 frame is visibly narrower
       than the 440 one, because it is. Scaled, never reflowed, reflowing
       would show a layout the product does not have. */
    var GAP = 16;
    var fitting = false;   /* the clear-then-set below must not re-enter */

    /* One shared scale when the three sit together, so 375 really is narrower
       than 440 on screen. When one device is shown on its own it simply fits
       the column, because there is nothing left to compare it against and a
       shrunken lone phone is just small. */
    function fitWidths() {
      var boxes = wrap.querySelectorAll('[data-wfit]');
      if (!boxes.length) return;

      /* MEASURE THE ROOM, NOT THE FURNITURE.

         The three frames are laid out in max-content columns and their widths
         are written here as pixels, which means asking the row how wide it is
         while they are still in it is asking the frames how wide they made
         themselves. Whatever they answered last time is what they answer for
         ever, and when this first ran inside a closed accordion, the answer
         it kept was a 1,158px row inside a 720px window, with the whole case
         study scrolling sideways behind it.

         So the frames are emptied of width first. With nothing pushing, the
         row collapses to the width its column actually has, that is read, and
         only then are the frames given a size again. Reading clientWidth
         between the two forces the layout in between, which is the point. */
      if (fitting) return;
      fitting = true;

      var b0;
      for (b0 = 0; b0 < boxes.length; b0++) {
        boxes[b0].style.width = '';
        boxes[b0].style.height = '';
      }

      var avail = wrap.clientWidth;
      if (!avail) { fitting = false; return; }

      var single = boxes.length === 1;
      var s;

      if (single) {
        var w = +boxes[0].getAttribute('data-wfit') + 26;
        s = Math.min(1, avail / w);
      } else {
        /* Each chassis is wider than the screen it holds, so the three of them
           need the bezels counted or the outer two get shaved. */
        var sum = 0;
        for (var j = 0; j < boxes.length; j++) sum += +boxes[j].getAttribute('data-wfit') + 26;
        s = Math.min(1, (avail - GAP * (boxes.length - 1)) / sum);
      }

      for (var k = 0; k < boxes.length; k++) {
        var box = boxes[k];
        var bw = +box.getAttribute('data-wfit');
        var bh = +box.getAttribute('data-wh');
        box.style.setProperty('--cu-scale', s);
        box.style.width = Math.round(bw * s) + 'px';
        box.style.height = Math.round(bh * s) + 'px';
      }

      fitting = false;
    }

    function syncOnly() {
      var on = effectiveOnly();
      var btns = root.querySelectorAll('[data-act="only"]');
      for (var i = 0; i < btns.length; i++) {
        btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-w') === on ? 'true' : 'false');
      }
    }

    if (side.addEventListener) {
      side.addEventListener('change', function () { syncOnly(); render(); });
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-act');
      if (a === 'noop') return;
      used(root);
      if (a === 'sample') { st.text = SAMPLES[+b.getAttribute('data-i')][1]; syncField(); render(); return; }
      if (a === 'only') {
        st.only = b.getAttribute('data-w');
        syncOnly();
        render();
        say(root, effectiveOnly() === 'all' ? 'Showing all three widths.' : 'Showing ' + effectiveOnly() + ' points.');
        return;
      }
    });

    function syncField() {
      var f = root.querySelector('[data-field="q"]');
      if (f) f.value = st.text;
    }

    root.addEventListener('input', function (e) {
      var f = e.target.closest('[data-field="q"]');
      if (!f) return;
      used(root);
      st.text = f.value;
      var rows = wrap.querySelectorAll('[data-measure] .cu-q__t');
      for (var i = 0; i < rows.length; i++) rows[i].textContent = st.text || ' ';
      measure();
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { fitWidths(); measure(); }).observe(wrap);
    } else {
      window.addEventListener('resize', function () { fitWidths(); measure(); });
    }

    syncOnly();
    render();
  }

  /* =====================================================================
     ARTIFACT 3: MATCHING (Trust)

     The Questions tab after transcription. Four states per question:
     unanswered, matched, edited, dismissed. A match is an excerpt with a
     provenance badge and a route to the transcript it came from. A question
     with no defensible match stays unanswered, and says so.
     ===================================================================== */

  function artMatch(root) {
    var app = root.querySelector('[data-app]');
    var st, snack;

    function init() {
      st = {
        tab: 'q', open: -1, tx: -1, editing: -1, draft: '',
        qs: SEED.questions.map(function (q, i) {
          var m = SEED.matched[i];
          return {
            q: q,
            state: m ? 'matched' : 'unanswered',
            quote: m ? m.quote : null,
            at: m ? m.at : null,
            check: !!m
          };
        }),
        snack: null, undo: null
      };
      snack = makeSnack(root, render);
    }

    function render() {
      closeMenu(app);
      var answered = st.qs.filter(function (q) { return q.state === 'matched' || q.state === 'edited'; }).length;

      app.innerHTML =
        appBar(SEED.title, SEED.today, { back: 'noop', trail: 'kebab' }) +
        '<div class="cu-scroll">' +
          '<div class="cu-rec">' +
            '<b class="cu-rec__h">Your recording</b>' +
            '<div class="cu-file">' +
              '<span class="cu-file__ico">' + ic('wave') + '</span>' +
              '<span class="cu-file__t"><b>' + esc(fileMain().n) + '</b><span>12:34 · Transcribed</span></span>' +
              '<span class="cu-file__play" aria-hidden="true">' + ic('play') + '</span>' +
            '</div>' +
          '</div>' +
          tabs(st.tab, ['Questions', 'Notes', 'Follow-ups']) +
          '<div class="cu-card cu-card--tabbed">' +
            '<div class="cu-sec"><b>Your questions</b><span>' + answered + ' of ' + st.qs.length + ' matched</span></div>' +
            st.qs.map(qBlock).join('') +
          '</div>' +
          '<div class="cu-pad"></div>' +
        '</div>' +
        (st.tx >= 0 ? transcriptSheet() : '') +
        actionBar('Save session', 'noop') +
        snackbar(st) +
        '<span class="cu-live" data-live aria-live="polite"></span>';

      var f = app.querySelector('[data-field="draft"]');
      if (f) { f.focus(); f.selectionStart = f.value.length; }
    }

    function tabs(on, names) {
      return '<div class="cu-tabs" role="tablist">' + names.map(function (n, i) {
        var id = ['q', 'n', 'f'][i];
        return '<button class="cu-tab" type="button" role="tab" aria-selected="' + (on === id) +
          '" data-act="tab" data-t="' + id + '">' + n + '</button>';
      }).join('') + '</div>';
    }

    function qBlock(q, i) {
      var open = st.open === i;
      var badge = '';
      if (q.state === 'matched') badge = '<span class="cu-badge">' + ic('sparkle') + 'Matched from recording</span>';
      if (q.state === 'edited') badge = '<span class="cu-badge cu-badge--edit">Edited</span>';

      var head = '<div class="cu-qm__head">' +
        '<span class="cu-box"' + (q.check ? ' data-on="1"' : '') + '>' + ic('check') + '</span>' +
        '<span class="cu-qm__t">' + esc(q.q) + '</span>' +
        '</div>';

      var body = '';
      if (q.state === 'unanswered') {
        body = '<p class="cu-none">Not answered during this conversation.</p>';
      } else if (st.editing === i) {
        body = '<div class="cu-qm__meta">' + badge + '</div>' +
          '<div class="cu-edit cu-edit--wide">' +
            '<textarea class="cu-input" rows="4" data-field="draft" aria-label="Edit the matched excerpt">' + esc(st.draft) + '</textarea>' +
            '<span class="cu-edit__acts">' +
              '<button class="cu-ico cu-ico--sm" type="button" data-act="m-save" data-i="' + i + '" aria-label="Confirm">' + ic('check') + '</button>' +
              '<button class="cu-ico cu-ico--sm" type="button" data-act="m-cancel" aria-label="Cancel">' + ic('close') + '</button>' +
            '</span></div>';
      } else {
        body =
          '<div class="cu-qm__meta">' + badge +
            '<button class="cu-ico cu-ico--sm" type="button" data-act="dismiss" data-i="' + i + '" ' +
              'aria-label="Dismiss this match">' + ic('close') + '</button>' +
          '</div>' +
          '<p class="cu-label cu-label--said">What they said</p>' +
          '<blockquote class="cu-said">' + esc(q.quote) + '</blockquote>' +
          '<div class="cu-qm__acts">' +
            '<button class="cu-btn cu-btn--text cu-btn--auto cu-btn--sm" type="button" data-act="see-tx" data-i="' + i + '" ' +
              'aria-expanded="' + (open ? 'true' : 'false') + '">' +
              (q.at ? 'View transcript' : 'View transcript') + '</button>' +
            (q.state === 'matched' || q.state === 'edited'
              ? '<button class="cu-btn cu-btn--text cu-btn--auto cu-btn--sm" type="button" data-act="m-edit" data-i="' + i + '">Edit</button>'
              : '') +
          '</div>';
      }

      return '<div class="cu-qm" data-state="' + q.state + '">' + head + body + '</div>';
    }

    /* The transcript supports verification without taking over. It arrives
       as a sheet over the list, with the matched line marked, and it goes
       away again: the patient's own questions stay the primary view. */
    function transcriptSheet() {
      var i = st.tx;
      var q = st.qs[i];
      return '<div class="cu-scrim" data-act="tx-close"></div>' +
        '<div class="cu-sheet cu-sheet--tall" role="dialog" aria-modal="true" aria-label="Transcript" data-trap>' +
          '<span class="cu-sheet__grab" aria-hidden="true"></span>' +
          '<div class="cu-sheet__head">' + ic('msg') + '<b>Transcript</b>' +
            '<button class="cu-ico cu-ico--sm" type="button" data-act="tx-close" aria-label="Hide transcript">' + ic('close') + '</button>' +
          '</div>' +
          '<p class="cu-sheet__q">' + esc(q.q) + '</p>' +
          '<div class="cu-sheet__list cu-sheet__list--tx">' +
            SEED.transcript.map(function (l) {
              var hit = l.m === i;
              return '<p class="cu-line"' + (hit ? ' data-hit="1"' : '') + '>' +
                '<b>' + esc(l.s) + '</b><i>' + l.at + '</i><br>' + esc(l.t) + '</p>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-act'), i = +b.getAttribute('data-i');
      if (a !== 'noop') used(root);

      if (a === 'reset') { init(); render(); say(root, 'Reset.'); return; }
      if (a === 'noop') return;

      if (a === 'tab') { st.tab = b.getAttribute('data-t'); render(); return; }

      if (a === 'see-tx') {
        st.tx = i; render();
        var hit = app.querySelector('[data-hit]');
        if (hit) hit.scrollIntoView({ block: 'center', behavior: reduced.matches ? 'auto' : 'smooth' });
        say(root, 'Transcript open, at the matched line.');
        return;
      }
      if (a === 'tx-close') { st.tx = -1; render(); return; }

      if (a === 'dismiss') {
        var was = st.qs[i];
        st.undo = { i: i, prev: { state: was.state, quote: was.quote, at: was.at, check: was.check } };
        st.qs[i] = { q: was.q, state: 'unanswered', quote: null, at: null, check: false };
        snack(st, 'Match dismissed', true);
        render();
        say(root, 'Match dismissed. It is no longer shown for this question.');
        return;
      }
      if (a === 'undo') {
        if (!st.undo) return;
        var u = st.undo;
        st.qs[u.i] = { q: st.qs[u.i].q, state: u.prev.state, quote: u.prev.quote, at: u.prev.at, check: u.prev.check };
        st.undo = null; snack(st, null); render();
        say(root, 'Match restored.');
        return;
      }

      if (a === 'm-edit') { st.editing = i; st.draft = st.qs[i].quote; render(); return; }
      if (a === 'm-cancel') { st.editing = -1; st.draft = ''; render(); return; }
      if (a === 'm-save') {
        var t = st.draft.trim();
        if (!t) return;
        st.qs[i].quote = t;
        st.qs[i].state = 'edited';
        st.editing = -1; st.draft = '';
        snack(st, 'Edited by you');
        render();
        say(root, 'Edited. This is no longer a direct excerpt, and the badge says so.');
        return;
      }
    });

    root.addEventListener('input', function (e) {
      var f = e.target.closest('[data-field="draft"]');
      if (!f) return;
      st.draft = f.value;
    });

    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (st.tx >= 0) { st.tx = -1; render(); }
    });

    init(); render();
  }

  /* =====================================================================
     ARTIFACT 4: PERMISSION AND UPLOAD (Trust)

     The recording panel on the happy path, from the default state through
     the permission dialog and the picker to a transcript. Carry never
     starts a recording, so there is no record button to find.
     ===================================================================== */

  function artPermit(root) {
    var app = root.querySelector('[data-app]');
    var panel;

    var scenario = function () {
      return { conn: 'fast', audio: 'valid', upload: 'success', transcribe: 'normal', match: 'full' };
    };

    function init() {
      if (panel) panel.clear();
      panel = makePanel({
        scenario: scenario,
        render: render,
        say: function (m) { say(root, m); }
      });
    }

    function render() {
      app.innerHTML =
        appBar(SEED.title, SEED.today, { back: 'noop', trail: 'kebab' }) +
        '<div class="cu-scroll">' +
          panel.panel() +
          '<div class="cu-tabs" role="tablist">' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="true">Questions</button>' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="false">Notes</button>' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="false">Follow-ups</button>' +
          '</div>' +
          '<div class="cu-card cu-card--tabbed">' +
            SEED.questions.slice(0, 4).map(function (q, i) {
              return questionRow({ q: q, i: i, as: 'div', check: false, drag: false, menu: false, tools: false });
            }).join('') +
          '</div>' +
          '<div class="cu-pad"></div>' +
        '</div>' +
        panel.overlay() +
        actionBar('Save session', 'noop') +
        '<span class="cu-live" data-live aria-live="polite"></span>';

      stateStrip(root, panel.states, panel.st.state);
      trap(app);
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-act'), i = +b.getAttribute('data-i');
      if (a !== 'noop') used(root);
      if (a === 'reset') { init(); render(); say(root, 'Reset.'); return; }
      if (a === 'noop') return;
      panel.act(a, i);
    });

    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (panel.st.state === 'permissionRequested') panel.act('perm-no');
      else if (panel.st.state === 'filePickerOpen') panel.act('pick-close');
    });

    init(); render();
  }

  /* A named-state readout beside a machine. Not decoration: it is how the
     reader knows the failure they are looking at is a state of the real
     component rather than a different screen. */
  /* The machines are named in code the way code is named. A reader should see
     what is happening, not the identifier it happens under. */
  var STATE_WORDS = {
    idle: 'Ready', phoneEntered: 'Sending code', codeSent: 'Code sent',
    verifying: 'Checking', authenticated: 'Signing in',
    codeIncorrect: 'Wrong code', codeExpired: 'Code expired',
    connectionError: 'No connection',
    empty: 'No recording', permissionRequested: 'Asking permission',
    filePickerOpen: 'Choosing a file', fileSelected: 'File selected',
    uploading: 'Uploading', uploaded: 'Uploaded',
    uploadInterrupted: 'Connection lost', uploadFailed: 'Upload failed',
    transcribing: 'Transcribing', transcriptionDelayed: 'Taking longer',
    transcriptionFailed: 'Transcription failed', transcribed: 'Ready to review'
  };
  function words(k) { return STATE_WORDS[k] || k; }

  function stateStrip(root, states, on) {
    var strip = root.querySelector('[data-strip]');
    if (!strip) return;
    var at = states.indexOf(on);
    strip.innerHTML = states.map(function (n, i) {
      return '<li class="cu-state" data-on="' + (n === on ? 1 : 0) + '" data-done="' +
        (at >= 0 && i < at ? 1 : 0) + '">' + words(n) + '</li>';
    }).join('') +
    (at < 0 ? '<li class="cu-state cu-state--off" data-on="1">' + words(on) + '</li>' : '');
  }

  /* Keep tab focus inside a dialog while one is open. */
  function trap(app) {
    var box = app.querySelector('[data-trap]');
    if (!box) return;
    var f = box.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    if (f.length) f[0].focus();
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* =====================================================================
     ARTIFACT 5, CAPTURE AND REVIEW (Trust)

     One conversation, two interfaces. Switching does not swap a screenshot:
     the same data renders with capture affordances present or absent.
     ===================================================================== */

  function artModes(root) {
    var app = root.querySelector('[data-app]');
    var st;

    function init() {
      st = {
        mode: 'capture', tab: 'q', open: -1,
        checks: SEED.questions.map(function (_, i) { return !!SEED.matched[i]; }),
        fups: SEED.followups.map(function (f) { return f.done; }),
        txOpen: false
      };
    }

    function render() {
      closeMenu(app);
      var live = st.mode === 'capture';

      app.innerHTML =
        appBar(SEED.title, live ? SEED.today : 'FRIDAY, FEBRUARY 14, 2025',
               { back: 'noop', trail: live ? 'kebab' : 'gear' }) +

        '<div class="cu-scroll">' +
          '<div class="cu-rec">' +
            '<b class="cu-rec__h">Your recording</b>' +
            '<div class="cu-file">' +
              '<span class="cu-file__ico">' + ic('wave') + '</span>' +
              '<span class="cu-file__t"><b>' + esc(fileMain().n) + '</b><span>12:34 · Transcribed</span></span>' +
              '<span class="cu-file__play" aria-hidden="true">' + ic('play') + '</span>' +
            '</div>' +
            (live ? '' :
              '<button class="cu-disclose" type="button" data-act="tx" aria-expanded="' + st.txOpen + '">' +
                (st.txOpen ? 'Hide transcript' : 'View transcript') +
                '<span class="cu-ico cu-ico--sm cu-chev" data-open="' + (st.txOpen ? 1 : 0) + '">' + ic('downc') + '</span>' +
              '</button>' +
              (st.txOpen ? '<div class="cu-tx cu-tx--scroll">' +
                SEED.transcript.map(function (l) {
                  return '<p><b>' + esc(l.s) + ':</b> ' + esc(l.t) + '</p>';
                }).join('') + '</div>' : '')) +
          '</div>' +

          '<div class="cu-tabs" role="tablist">' +
            [['q', 'Questions'], ['n', 'Notes'], ['f', 'Follow-ups']].map(function (t) {
              return '<button class="cu-tab" type="button" role="tab" aria-selected="' + (st.tab === t[0]) +
                '" data-act="tab" data-t="' + t[0] + '">' + t[1] + '</button>';
            }).join('') +
          '</div>' +

          (st.tab === 'q' ? questionsTab(live)
           : st.tab === 'n' ? notesTab(live)
           : followTab(live)) +

          '<div class="cu-pad"></div>' +
        '</div>' +

        (live
          ? actionBar('Save session', 'save')
          : '<div class="cu-foot"><button class="cu-btn cu-btn--out" type="button" data-act="noop">' +
            ic('share') + 'Share this summary</button></div>') +

        '<span class="cu-live" data-live aria-live="polite"></span>';
    }

    function questionsTab(live) {
      return '<div class="cu-card cu-card--tabbed">' +
        (live ? '' : '<div class="cu-sec"><b>Questions</b><span>read-only</span></div>') +
        SEED.questions.map(function (q, i) {
          var m = SEED.matched[i];
          if (live) {
            return questionRow({
              q: q, i: i, as: 'checkrow', act: 'ask',
              check: st.checks[i], drag: true, menu: true
            });
          }
          var open = st.open === i;
          return '<div class="cu-qr">' +
            questionRow({
              q: q, i: i, as: 'button', act: 'open', expand: true, open: open,
              drag: false, menu: false, chevron: true
            }) +
            (open
              ? (m
                ? '<div class="cu-qm__ro"><p class="cu-label cu-label--said">What they said</p>' +
                  '<blockquote class="cu-said">' + esc(m.quote) + '</blockquote></div>'
                : '<p class="cu-none">Not answered during this conversation.</p>')
              : '') +
          '</div>';
        }).join('') +
        (live
          ? '<button class="cu-row cu-row--add" type="button" data-act="noop">' +
            '<span class="cu-row__ico">' + ic('plus') + '</span>' +
            '<span class="cu-row__t">Add your own question</span></button>'
          : '') +
      '</div>';
    }

    function notesTab(live) {
      return '<div class="cu-card cu-card--tabbed">' +
        '<div class="cu-sec"><b>Notes from your conversation</b>' +
          (live ? '' : '<span>read-only</span>') + '</div>' +
        (live
          ? '<div class="cu-notes"><textarea class="cu-input cu-input--notes" rows="7" ' +
            'aria-label="Notes from your conversation">' + esc(SEED.notes) + '</textarea></div>'
          : '<p class="cu-notes cu-notes--ro">' + esc(SEED.notes) + '</p>') +
      '</div>';
    }

    function followTab(live) {
      return '<div class="cu-card cu-card--tabbed">' +
        '<div class="cu-sec"><b>Things to do after</b><span>' +
          st.fups.filter(Boolean).length + ' of ' + st.fups.length + ' done</span></div>' +
        SEED.followups.map(function (f, i) {
          return checkRow(f.t, st.fups[i], 'fup', i, { readonly: !live });
        }).join('') +
        (live
          ? '<button class="cu-row cu-row--add" type="button" data-act="noop">' +
            '<span class="cu-row__ico">' + ic('plus') + '</span>' +
            '<span class="cu-row__t">Add a follow-up</span></button>'
          : '') +
      '</div>';
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b || !root.contains(b)) return;
      var a = b.getAttribute('data-act'), i = +b.getAttribute('data-i');
      if (a !== 'noop') used(root);

      if (a === 'reset') { init(); syncMode(); render(); say(root, 'Reset.'); return; }
      if (a === 'noop') return;
      if (a === 'tab') { st.tab = b.getAttribute('data-t'); render(); return; }
      if (a === 'ask') { st.checks[i] = !st.checks[i]; render(); return; }
      if (a === 'fup') { st.fups[i] = !st.fups[i]; render(); say(root, st.fups.filter(Boolean).length + ' of ' + st.fups.length + ' done'); return; }
      if (a === 'open') { st.open = st.open === i ? -1 : i; render(); return; }
      if (a === 'tx') { st.txOpen = !st.txOpen; render(); return; }
      if (a === 'save') { setMode('review'); say(root, 'Session saved. It is now a read-only record.'); return; }
      if (a === 'mode') { setMode(b.getAttribute('data-m')); return; }

      if (a === 'menu') {
        openMenu(app, b, [
          { id: 'edit', icon: 'pencil', label: 'Edit question' },
          { id: 'top', icon: 'up', label: 'Move to top', off: i === 0 },
          { id: 'bottom', icon: 'down', label: 'Move to bottom', off: i === SEED.questions.length - 1 },
          { id: 'del', icon: 'trash', label: 'Delete question', danger: true }
        ], function () { render(); });
        return;
      }
    });

    function setMode(m) {
      st.mode = m; st.open = -1; st.txOpen = false;
      syncMode(); render();
      say(root, m === 'review'
        ? 'Review. Capture controls removed; the record is kept.'
        : 'Capture. Checkboxes, notes and follow-up controls available.');
    }

    function syncMode() {
      var btns = root.querySelectorAll('[data-act="mode"]');
      for (var i = 0; i < btns.length; i++) {
        btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-m') === st.mode ? 'true' : 'false');
      }
      var note = root.querySelector('[data-modenote]');
      if (note) {
        note.textContent = st.mode === 'capture'
          ? 'You can check things off, write notes and upload.'
          : 'Saved. You can still read everything, but nothing invites a change.';
      }
    }

    init(); syncMode(); render();
  }

  /* =====================================================================
     ARTIFACT 6: THE PERFORMANCE LAB

     Six scenario controls, and they drive the real machines. Choosing
     "Interrupted" does not reveal a card describing an interrupted upload;
     it makes the next upload stop at 45% inside the same panel, with the
     file still selected.
     ===================================================================== */

  var CONTROLS = [
    { k: 'conn', label: 'Connection', opts: [['fast', 'Fast'], ['slow', 'Slow'], ['offline', 'Offline']] },
    { k: 'auth', label: 'Authentication', opts: [['correct', 'Correct'], ['incorrect', 'Incorrect'], ['expired', 'Expired']] },
    { k: 'audio', label: 'Audio', opts: [['valid', 'Valid'], ['unsupported', 'Unsupported'], ['corrupted', 'Corrupted']] },
    { k: 'upload', label: 'Upload', opts: [['success', 'Success'], ['interrupted', 'Interrupted'], ['failed', 'Failed']] },
    { k: 'transcribe', label: 'Transcription', opts: [['normal', 'Normal'], ['delayed', 'Delayed'], ['failed', 'Failed']] },
    /* "Full" was the wrong word and it made the prototype look broken. Every
       other control here names a fault against a no-fault default (Fast,
       Correct, Valid, Success, Normal), and matching's default is not "every
       question answered", it is "the model found everything it could
       defensibly find", which in this recording is three of six. Labelled
       Full, the screen underneath read "3 of 6 matched" and looked like it had
       failed to do what the control said. Labelled Normal, it reads as the
       designed result, which is the whole argument of the Trust section. */
    { k: 'match', label: 'Matching', opts: [['full', 'Normal'], ['partial', 'Fewer matches'], ['none', 'No reliable match']] }
  ];

  var HAPPY = { conn: 'fast', auth: 'correct', audio: 'valid', upload: 'success', transcribe: 'normal', match: 'full' };

  /* THE SUMMARY LINE IS ENGLISH, NOT STATE NAMES.

     "Connection: slow · Authentication: incorrect" is the shape of the object
     underneath, read aloud. Nobody looking at this cares what the keys are
     called; they care what is wrong with the world the product is running in.
     So each off-normal value carries the phrase a person would use for it, and
     the line under the controls is those phrases joined. */
  var PLAIN = {
    conn:       { slow: 'slow connection', offline: 'no connection' },
    auth:       { incorrect: 'wrong sign-in code', expired: 'expired sign-in code' },
    audio:      { unsupported: 'wrong kind of file', corrupted: 'damaged recording' },
    upload:     { interrupted: 'upload cut off', failed: 'upload failed' },
    transcribe: { delayed: 'slow transcription', failed: 'transcription failed' },
    match:      { partial: 'some answers found', none: 'no answers found' }
  };

  /* WHAT THE READER IS LOOKING AT, IN ONE SENTENCE.

     Keyed by the stage the run STOPS on, not by the control last touched. 
     Those are different whenever more than one condition is set. Two faults
     and the earlier one is a beat the flow passes through; the caption has to
     name the frame the phone is resting on, or it is describing a screen that
     has already gone. Every line says the observable thing and, where the
     design has one, what survived it. No state names: "uploadInterrupted" is
     what the machine calls it, not what happened. */
  var SUMMARY = {
    normal: 'Normal flow: upload, transcription and matching all completed.',
    slow:   'Slow connection: every step still finishes, and the upload says so while you wait.',
    auth: {
      offline:   'No connection: the sign-in code could not be sent, and the number you typed is kept.',
      incorrect: 'Wrong code: verification was refused, and the digits you entered are still in the field.',
      expired:   'Expired code: the code timed out, and a new one can be sent without starting over.'
    },
    audio: {
      unsupported: 'Unsupported audio: Carry rejected the selected file before upload.',
      corrupted:   'Damaged recording: the file uploaded, but the audio could not be read.'
    },
    upload: {
      interrupted: 'Upload cut off: the connection dropped partway, and the recording is still selected.',
      failed:      'Upload failed: the recording could not be sent.'
    },
    transcribe: {
      delayed: 'Transcription delayed: the recording uploaded successfully but processing is taking longer.',
      failed:  'Transcription failed: the upload is safe, and nothing was written from a partial transcript.'
    },
    match: {
      partial: 'Fewer matches: some questions were answered from the transcript and the rest left as written.',
      none:    'No reliable match: Carry could not confidently connect these questions to the transcript.'
    }
  };

  function artLab(root) {
    var app = root.querySelector('[data-app]');
    var st, auth, panel;
    var driveT = null, runId = 0;

    function scenario() { return st.sc; }

    /* =================================================================
       EVERY RUN OPENS WHERE ITS CONDITION LIVES.

       The six controls are one scenario, not six, and Carry has one order:
       connection, then sign-in, then the audio itself, then the upload, then
       the transcript, then the matching. So a run has exactly one honest
       starting point. The moment just before the earliest chosen condition
       becomes visible, and everything before that moment is preamble the
       reader did not ask for. Asking for a failed upload and being shown four
       seconds of sign-in, a permission dialog and a file picker first is the
       prototype answering a question nobody put to it.

       CONNECTION IS A MODIFIER, NOT A STAGE. Offline is a stage. It stops the
       sign-in dead, and nothing downstream can happen. Slow is not: it makes
       every leg take longer and has no failure of its own, so it decides the
       entry point only when no real fault is set, and it never keeps the run
       going past a fault that would otherwise be the last frame.
       ================================================================= */
    var STAGES = ['auth', 'audio', 'upload', 'transcribe', 'match'];

    /* The first stage the panel has a stake in. Split out because the sign-in
       scene, when it recovers, has to hand the panel the same answer. */
    function panelStage(sc) {
      if (sc.audio !== HAPPY.audio) return 'audio';
      if (sc.upload !== HAPPY.upload || sc.conn === 'slow') return 'upload';
      if (sc.transcribe !== HAPPY.transcribe) return 'transcribe';
      if (sc.match !== HAPPY.match) return 'match';
      return 'normal';
    }

    function entryStage(sc) {
      if (sc.conn === 'offline' || sc.auth !== HAPPY.auth) return 'auth';
      return panelStage(sc);
    }

    /* Is a real fault set anywhere after this stage? This is what decides
       whether a failure frame is the end of the run or a beat inside it. A
       recovery is worth watching when the scenario continues through it and
       misleading when it does not, recovering from the one condition the
       reader asked to see replaces their answer with the happy path. */
    function laterFault(sc, stage) {
      var f = {
        auth: sc.auth !== HAPPY.auth || sc.conn === 'offline',
        audio: sc.audio !== HAPPY.audio,
        upload: sc.upload !== HAPPY.upload,
        transcribe: sc.transcribe !== HAPPY.transcribe,
        match: sc.match !== HAPPY.match
      };
      for (var i = STAGES.indexOf(stage) + 1; i < STAGES.length; i++) {
        if (f[STAGES[i]]) return true;
      }
      return false;
    }

    function init(keepScenario) {
      stop();
      if (auth) auth.clear();
      if (panel) panel.clear();
      var sc = keepScenario && st ? st.sc : JSON.parse(JSON.stringify(HAPPY));
      var entry = entryStage(sc);
      st = { sc: sc, view: entry === 'auth' ? 'auth' : 'capture', tab: 'q' };
      auth = makeAuth({
        scenario: scenario,
        render: render,
        say: function (m) { say(root, m); },
        /* Sign-in only ever finishes when something downstream is still
           waiting to be shown, so the panel is placed at that thing rather
           than at the top of its own machine. */
        done: function () {
          panel.seed(panelStage(st.sc));
          st.view = 'capture'; render(); say(root, 'Signed in. Capture screen.');
        }
      });
      panel = makePanel({
        scenario: scenario,
        render: render,
        say: function (m) { say(root, m); },
        holdDelayed: function () { return !laterFault(st.sc, 'transcribe'); }
      });
      if (entry === 'auth') auth.seed(sc.conn === 'offline' ? 'phone' : 'code');
      else panel.seed(entry);
      syncControls();
    }

    /* NORMAL MEANS EVERY QUESTION FOUND ITS ANSWER.

       It used to mean SEED.matched, which is three of six, so the control
       said matching was working normally and the screen under it said three
       questions had gone unanswered, which reads as a broken prototype rather
       than as a scenario. Normal is the full table now; Fewer matches is the
       three the Trust section documents; No reliable match is none. */
    function matchedFor() {
      var m = st.sc.match;
      if (m === 'none') return {};
      if (m === 'partial') return SEED.matched;

      var all = {};
      Object.keys(SEED.matched).forEach(function (k) { all[k] = SEED.matched[k]; });
      Object.keys(SEED.matchedAll).forEach(function (k) { all[k] = SEED.matchedAll[k]; });
      return all;
    }

    function render() {
      var h;
      if (st.view === 'auth') {
        h = auth.view();
        stateStrip(root, auth.states, auth.st.err && auth.st.errKind === 'conn' ? 'connectionError'
          : auth.st.errKind === 'code' ? 'codeIncorrect'
          : auth.st.errKind === 'expired' ? 'codeExpired'
          : auth.st.state);
      } else {
        h = capture();
        stateStrip(root, panel.states, panel.st.state);
      }
      app.innerHTML = h + '<span class="cu-live" data-live aria-live="polite"></span>';
      /* THE PHONE IS A DEMONSTRATION, NOT A SECOND INTERFACE.

         Everything in it is driven from the rail, so nothing in it should
         take a tap, a caret or a Tab stop. A keyboard reader tabbing into a
         disabled phone-number field they cannot fill is being offered a
         control that does not exist. inert removes the whole subtree from
         hit-testing and from the tab order in one attribute; the CSS carries
         the same intent for browsers that do not have it yet. */
      app.inert = true;
      app.setAttribute('inert', '');
      app.setAttribute('aria-hidden', 'true');
      focusNow();
    }

    function capture() {
      var done = panel.st.state === 'transcribed';
      var table = matchedFor();
      var hits = Object.keys(table).length;

      return appBar(SEED.title, SEED.today, { back: 'lab-back', trail: 'kebab' }) +
        '<div class="cu-scroll">' +
          panel.panel() +
          (done ? matchNote(hits) : '') +
          '<div class="cu-tabs" role="tablist">' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="true">Questions</button>' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="false">Notes</button>' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="false">Follow-ups</button>' +
          '</div>' +
          '<div class="cu-card cu-card--tabbed"' + (done ? ' data-focus="answers"' : '') + '>' +
            (done
              ? '<div class="cu-sec"><b>Your questions</b><span>' + hits + ' of ' + SEED.questions.length + ' matched</span></div>'
              : '') +
            SEED.questions.map(function (q, i) {
              var m = done ? table[i] : null;
              if (!done) return questionRow({ q: q, i: i, as: 'div', check: false, drag: false, menu: false, tools: false });
              return '<div class="cu-qm" data-state="' + (m ? 'matched' : 'unanswered') + '">' +
                '<div class="cu-qm__head">' +
                  '<span class="cu-box"' + (m ? ' data-on="1"' : '') + '>' + ic('check') + '</span>' +
                  '<span class="cu-qm__t">' + esc(q) + '</span>' +
                '</div>' +
                (m
                  ? '<div class="cu-qm__meta"><span class="cu-badge">' + ic('sparkle') + 'Matched from recording</span></div>' +
                    '<p class="cu-label cu-label--said">What they said</p>' +
                    '<blockquote class="cu-said">' + esc(m.quote) + '</blockquote>'
                  : '<p class="cu-none">Not answered during this conversation.</p>') +
              '</div>';
            }).join('') +
          '</div>' +
          '<div class="cu-pad"></div>' +
        '</div>' +
        panel.overlay() +
        actionBar('Save session', 'noop');
    }

    /* Partial is not failure, and the interface has to say which it is, 
       otherwise a patient reads three blanks as "the system broke". */
    function matchNote(hits) {
      if (hits === SEED.questions.length) return '';
      if (hits === 0) {
        return '<div class="cu-fail cu-fail--soft" data-focus="match"><span class="cu-fail__ico">' + ic('warn') + '</span>' +
          '<span class="cu-fail__b"><b>No reliable matches in this recording.</b>' +
          '<span>The transcript is saved and you can read it in full.</span>' +
          '<em>Nothing was written for your questions; they stay as you left them.</em></span></div>';
      }
      return '<div class="cu-fail cu-fail--soft" data-focus="match"><span class="cu-fail__ico">' + ic('warn') + '</span>' +
        '<span class="cu-fail__b"><b>' + hits + ' of ' + SEED.questions.length + ' questions matched.</b>' +
        '<span>The rest weren’t covered clearly enough in the recording to quote.</span>' +
        '<em>They stay unanswered. You can add your own note or read the transcript.</em></span></div>';
    }

    /* WHERE THE RUN COMES TO REST.

       The mirror image of entryStage, and it has to agree with the autopilot
       frame for frame or the caption is a lie. Two rules produce it. A
       BLOCKING fault ends the run where it happens, because nothing after it
       can occur: no connection stops the sign-in, and a file that is the wrong
       kind or damaged stops the pipeline at the audio. Otherwise the run
       recovers from each fault it meets and carries on, so the LAST fault set
       is the one still on screen, which is why this walks the pipeline
       backwards where entryStage walks it forwards. */
    function terminalStage(sc) {
      if (sc.conn === 'offline') return 'auth';
      if (sc.audio !== HAPPY.audio) return 'audio';
      if (sc.match !== HAPPY.match) return 'match';
      if (sc.transcribe !== HAPPY.transcribe) return 'transcribe';
      if (sc.upload !== HAPPY.upload) return 'upload';
      if (sc.auth !== HAPPY.auth) return 'auth';
      if (sc.conn === 'slow') return 'slow';
      return 'normal';
    }

    function summary(sc) {
      var stage = terminalStage(sc);
      if (stage === 'normal' || stage === 'slow') return SUMMARY[stage];
      var key = stage === 'auth' && sc.conn === 'offline' ? 'offline' : sc[stage];
      return (SUMMARY[stage] && SUMMARY[stage][key]) || SUMMARY.normal;
    }

    function syncControls() {
      CONTROLS.forEach(function (c) {
        var offNormal = st.sc[c.k] !== HAPPY[c.k];
        var group = root.querySelector('[data-ctl-group="' + c.k + '"]');
        if (group) group.setAttribute('data-off', offNormal ? '1' : '0');
        var btns = root.querySelectorAll('[data-ctl="' + c.k + '"]');
        for (var i = 0; i < btns.length; i++) {
          var on = btns[i].getAttribute('data-v') === st.sc[c.k];
          btns[i].setAttribute('aria-pressed', on ? 'true' : 'false');
          /* Chosen and chosen-and-abnormal are different facts, and only the
             second one is the scenario. Marking them the same way made a rail
             of six selected buttons in which the two that mattered were
             indistinguishable from the four that were merely default. */
          btns[i].setAttribute('data-off', on && offNormal ? '1' : '0');
        }
      });
      var line = root.querySelector('[data-scntext]');
      if (line) line.textContent = summary(st.sc);
    }

    /* =================================================================
       THE AUTOPILOT

       Nobody should have to learn a prototype to read a case study. The
       controls on the left are the only thing to operate; changing one
       restarts the flow and the phone plays the scenario through on its
       own (sign in, choose a recording, upload, transcribe, match), and
       stops on the state that scenario produces.

       IT IS DRIVEN BY STATE, NOT BY A SCRIPT OF TIMESTAMPS. Every step
       below asks the two machines where they actually are and performs
       the single next thing a person would do from there. That matters
       because the machines have their own clocks: a slow connection
       triples the send, an upload ticks twenty times, and a timeline
       written next to them would drift out of step with the thing it was
       narrating. Asking instead of assuming also means each step is the
       real interaction: the autopilot presses Send code, it does not set
       a variable called codeSent.

       AND A FAILURE IS ONLY HALF THE STORY. Where a condition has a
       recovery (a cut-off upload resumes, a wrong code is resent) the
       autopilot pauses on the error long enough to read it, then takes
       the recovery and carries on, so the rest of the scenario still gets
       demonstrated. Where there is no recovery under the stated
       conditions. The connection is simply off, the file is not audio,
       the audio is damaged. It stops there, because pretending otherwise
       would be the one thing this section is arguing against.
       ================================================================= */

    /* =================================================================
       THE PREVIEW WINDOW, AND THE CAMERA IN IT

       On a desktop the phone simply fits beside its controls. On a phone it
       does not: 866 points rendered at a size anybody can read is most of the
       screen, so the controls that cause the behaviour scroll away before the
       behaviour arrives, and the module stops demonstrating anything.

       So below 900 the device gets a window rather than a page: a fixed
       share of the screen, with a floor and a ceiling so it survives a 568pt
       phone and a 932pt one. The phone is scaled to fit that window whenever
       the result is still legible; where it is not, the phone is taller than
       its window and the camera moves instead. Nothing here ever scrolls the
       portfolio page, and nothing asks the reader to scroll a miniature
       phone: the settings decide what matters, and what matters comes to the
       window.
       ================================================================= */

    /* THE WHOLE PHONE, ALWAYS.

       There was a camera here: below a readable scale the device stayed large
       and the window moved instead, panning to whatever the current condition
       was about. It worked, and it was the wrong trade. A prototype with its
       top sliced off reads as broken long before anybody notices it is framing
       the relevant part. The device is scaled to fit its window whole now, and
       the only thing that still moves is the phone's own scroller, which is
       the product's behaviour rather than the page's.

       The bezel is painted outside the app's box, so the window has to hold
       DEV_OH (the outer height, 866), rather than the 844 of screen. */
    var BEZ = 11;
    var panT = null, curScale = 1;

    function bound() { return root.querySelector('.cu-fit--bound'); }
    function wide() { return window.matchMedia('(min-width: 900px)').matches; }

    function boxHeight() {
      var vh = window.innerHeight || 800;
      return Math.max(340, Math.min(560, Math.round(vh * 0.6)));
    }

    function fitLab() {
      var el = bound();
      if (!el) return;
      var availW = el.clientWidth;
      if (!availW) return;

      var fitW = Math.min(1, availW / DEV_OW);
      var s, h;

      if (wide()) {
        s = fitW;
        h = Math.round(DEV_OH * s);
      } else {
        h = boxHeight();
        /* Both dimensions, no floor. Whichever runs out first decides, and the
           device is whole either way. */
        s = Math.min(fitW, h / DEV_OH);
      }

      curScale = s;
      /* The caption's width is the device's width, so it has to be published
         wherever the caption can read it. The device's own size is a
         transform, which contributes nothing to layout. Recomputed on every
         fit, because the scale changes with the viewport. */
      var pv = root.querySelector('.cu-preview');
      if (pv) pv.style.setProperty('--cu-devw', Math.round(DEV_OW * s) + 'px');
      el.style.setProperty('--cu-scale', s);
      el.style.height = h + 'px';
      /* Centre it in the window rather than hanging it from the top, so the
         spare height is split above and below the device instead of all
         landing under its feet. */
      el.style.setProperty('--cu-pan', Math.round((h - DEV_OH * s) / 2) + 'px');
      focusNow();
    }

    /* Which part of the product the current condition is about. */
    function focusKey() {
      if (st.view === 'auth') return 'auth';
      if (panel.st.state === 'transcribed') {
        return app.querySelector('[data-focus="match"]') ? 'match' : 'answers';
      }
      return 'upload';
    }

    /* Inside the phone, and nowhere else. If what matters is below the phone's
       own fold, the phone scrolls itself: animated, once, as part of the
       demonstration rather than as something to operate. The window itself
       never moves: it holds the whole device. */
    function focusNow() {
      var el = bound();
      if (!el) return;

      var target = app.querySelector('[data-focus="' + focusKey() + '"]') ||
                   app.querySelector('[data-focus]');
      if (!target) return;

      var pane = app.querySelector('.cu-scroll');
      if (!pane || !pane.contains(target)) return;

      clearTimeout(panT);
      panT = setTimeout(function () {
        var pr = pane.getBoundingClientRect(), tr = target.getBoundingClientRect();
        var inside = (tr.top - pr.top) / (curScale || 1);
        var to = pane.scrollTop + inside - 12;
        to = Math.max(0, Math.min(pane.scrollHeight - pane.clientHeight, to));
        if (Math.abs(to - pane.scrollTop) > 2) {
          pane.scrollTo({ top: to, behavior: reduced.matches ? 'auto' : 'smooth' });
        }
      }, ms(reduced.matches ? 0 : 120));
    }

    function stop() {
      clearTimeout(driveT); clearTimeout(panT);
      driveT = null; runId++;
    }

    function drive(wait) {
      clearTimeout(driveT);
      var mine = runId;
      driveT = setTimeout(function () {
        if (mine !== runId) return;
        step();
      }, ms(wait));
    }

    /* Long enough to read what happened, short enough that nobody thinks
       it has stalled. */
    var BEAT = 420, READ = 1500;

    function step() {
      var s = st.sc;

      if (st.view === 'auth') {
        var a = auth.st;

        /* Offline never gets past the first screen, and that is the point:
           the number is still in the field and the retry is right there. */
        if (a.err && a.errKind === 'conn') return;

        if (a.state === 'idle') {
          if (!a.phone) { auth.act('auth-demo'); return drive(BEAT); }
          auth.act('auth-send'); return drive(BEAT);
        }
        if (a.state === 'phoneEntered') return drive(BEAT);   /* its own clock */

        if (a.state === 'codeSent') {
          if (a.errKind === 'code' || a.errKind === 'expired') {
            /* WHEN THE SIGN-IN FAULT IS THE WHOLE SCENARIO, STOP ON IT.

               Otherwise a reader who chooses "Incorrect", looks away for two
               seconds and looks back finds a normal capture screen and has
               learned nothing. The error they asked to see has already been
               recovered from. The recovery is not hidden by stopping here: it
               is the "Resend code" sitting under the message, with the digits
               they typed still in the field.

               But if something else is also set, the sign-in fault is one beat
               in a longer scenario, so it plays and the flow carries on to the
               conditions waiting downstream. */
            if (!laterFault(s, 'auth')) return;
            auth.act('auth-resend');
            return drive(READ);
          }
          if (!a.code) { auth.act('auth-demo'); return drive(BEAT); }
          auth.act('auth-verify'); return drive(BEAT);
        }
        if (a.state === 'verifying' || a.state === 'authenticated') return drive(BEAT);
        return drive(BEAT);
      }

      var p = panel.st;

      if (p.state === 'empty') { panel.act('rec-upload'); return drive(BEAT); }
      if (p.state === 'permissionRequested') { panel.act('perm-yes'); return drive(BEAT); }
      if (p.state === 'filePickerOpen') { panel.act('pick-upload'); return drive(BEAT); }

      /* An unsupported file is rejected before anything moves, and choosing
         again is a person's decision, not a retry, so it settles here. */
      if (p.state === 'fileSelected' && p.err) return;
      if (p.state === 'fileSelected') { panel.act('rec-go'); return drive(BEAT); }

      /* A seeded 'uploaded' has no timer behind it. The step that would have
         scheduled transcription never ran. Ask for it. */
      if (p.state === 'uploaded' && p.needsTx) { panel.act('rec-start-tx'); return drive(BEAT); }

      /* Held means the delayed-transcription frame is the answer and the
         machine has stopped moving. Driving on would be a timer with nothing
         left to do. */
      if (p.state === 'transcribing' && p.held) return;

      if (p.state === 'uploading' || p.state === 'uploaded' || p.state === 'transcribing') {
        return drive(BEAT);
      }

      /* Both upload failures keep the file and offer the same move, and the
         second attempt succeeds. The shape of a real transient failure, and
         the reason the recovery is worth designing. It is worth WATCHING only
         when the run continues past it. When the cut-off upload is the thing
         the reader asked to see, resuming it hands them back the happy path
         and answers a different question; the recovery is still on screen, as
         the Resume button under the message, with the file still selected. */
      if (p.state === 'uploadInterrupted' || p.state === 'uploadFailed') {
        if (s.conn === 'offline') return;
        if (!laterFault(s, 'upload')) return;
        panel.act('rec-retry'); return drive(READ);
      }

      if (p.state === 'transcriptionFailed') {
        /* A damaged recording is not a retryable condition. The file is
           the problem, and the screen says so rather than spinning. */
        if (p.file && p.file.kind === 'corrupted') return;
        if (!laterFault(s, 'transcribe')) return;
        panel.act('rec-retry-tx'); return drive(READ);
      }

      /* transcribed. The matching scenario is already on screen. */
    }

    function restart() {
      init(true);
      render();
      syncControls();
      drive(260);
    }

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act], [data-ctl]');
      if (!b || !root.contains(b)) return;

      var ctl = b.getAttribute('data-ctl');
      if (ctl) {
        used(root);
        st.sc[ctl] = b.getAttribute('data-v');
        /* The whole scenario replays from the beginning, because the point
           is the sequence: a slow connection and a wrong code together are
           not two separate demonstrations, they are one run in which the
           code screen is slow to answer and then rejects you. */
        restart();
        collapseIfTight();
        var phrase = (PLAIN[ctl] && PLAIN[ctl][st.sc[ctl]]) || 'normal';
        say(root, 'Scenario set to ' + phrase + '. Playing from ' + entryStage(st.sc) + '.');
        return;
      }

      var a = b.getAttribute('data-act'), i = +b.getAttribute('data-i');
      if (a !== 'noop') used(root);

      /* ONE BUTTON, BECAUSE THERE WAS ONLY EVER ONE BEHAVIOUR.

         Reset and "All normal" ran identical code and differed only in what
         they announced, which is two buttons teaching a reader that they do
         different things. Replay went further and contradicted the model: a
         scenario plays once and rests on its answer, and the only things that
         start another run are Reset and choosing a different condition. A
         button whose whole job is to restart something that is meant to be
         finished is an invitation to doubt that it is finished. */
      if (a === 'lab-reset') {
        st.sc = JSON.parse(JSON.stringify(HAPPY));
        restart();
        say(root, 'Conditions back to normal. Playing the normal run.');
        return;
      }
      if (a === 'lab-settings') {
        var on = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', on ? 'false' : 'true');
        say(root, on ? 'Scenario settings hidden.' : 'Scenario settings shown.');
        return;
      }
      if (a === 'noop') return;

      /* The phone is a demonstration, not a second interface to operate.
         Everything inside it is inert; the rail on the left is the control
         surface, and it is the only one. */
    });

    /* No input or keydown wiring here any more. There is nothing in the phone
       to type into: the autopilot fills the fields and presses the buttons,
       and the rail is the only thing a reader touches. */

    /* Paint the control rail from the same table the machines read. */
    var rail = root.querySelector('[data-controls]');
    if (rail) {
      rail.innerHTML = CONTROLS.map(function (c) {
        return '<div class="cu-ctl" data-ctl-group="' + c.k + '" data-off="0">' +
          '<p class="cu-ctl__l">' + c.label + '</p>' +
          '<div class="cu-ctl__opts" role="group" aria-label="' + c.label + '">' +
            c.opts.map(function (o) {
              return '<button type="button" data-ctl="' + c.k + '" data-v="' + o[0] + '" ' +
                'data-off="0" aria-pressed="' + (o[0] === HAPPY[c.k]) + '">' + o[1] + '</button>';
            }).join('') +
          '</div></div>';
      }).join('');
    }

    /* On a short phone the six control groups and a preview worth looking at
       do not both fit, so once a choice has been made the controls fold away
       and the summary (the sentence the preview is answering) stays. */
    var narrow = window.matchMedia('(max-width: 899px)');
    function collapseIfTight() {
      if (!narrow.matches) return;
      var t = root.querySelector('.cu-scntoggle');
      var rail = root.querySelector('[data-railbody]');
      var pv = root.querySelector('.cu-preview');
      if (!t || !rail || !pv) return;
      /* Fold only when they genuinely do not both fit. A phone tall enough to
         show the controls and the thing they control at the same time keeps
         them, because a tap you did not need to make is worse than a rail. */
      var need = rail.getBoundingClientRect().height + pv.getBoundingClientRect().height + 150;
      if (need <= window.innerHeight) return;
      t.setAttribute('aria-expanded', 'false');
    }

    init(); render(); syncControls(); fitLab();

    /* fitLab writes sizes inside root, and root is as tall as what it
       contains, so an observer on root that calls it synchronously is
       answering its own writes. That surfaced once per session, on the frame
       the route first reveals this section and its box goes from nothing to
       real. One frame of deferral takes the write out of the delivery pass;
       the guard also collapses a burst of observations into a single fit. */
    var labPending = 0;
    function fitLabSoon() {
      if (labPending) return;
      labPending = window.requestAnimationFrame(function () { labPending = 0; fitLab(); });
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(fitLabSoon).observe(root);
    }
    window.addEventListener('resize', fitLabSoon);

    /* IT STARTS WHEN IT IS LOOKED AT, NOT WHEN THE PAGE LOADS.

       The happy path runs itself the first time this scrolls into view, so
       the reader arrives to a phone that is already doing something rather
       than a sign-in screen waiting to be operated. Once. After that the
       rail is in charge. */
    if ('IntersectionObserver' in window) {
      var seen = false;
      var io = new IntersectionObserver(function (ents) {
        for (var i = 0; i < ents.length; i++) {
          if (!ents[i].isIntersecting || seen) continue;
          seen = true; io.disconnect();
          drive(500);
        }
      }, { threshold: 0.25 });
      io.observe(root);
    } else {
      drive(500);
    }
  }

  /* =====================================================================
     THE COMPONENT GALLERY: the same CSS, shown as itself.
     ===================================================================== */

  function gallery(scope) {
    var boxes = scope.querySelectorAll('[data-gal]');
    for (var i = 0; i < boxes.length; i++) {
      var kind = boxes[i].getAttribute('data-gal'), h = '';

      if (kind === 'buttons') {
        h = '<button class="cu-btn" type="button">Start the conversation</button>' +
            '<button class="cu-btn cu-btn--tonal" type="button">' + ic('folder') + 'Upload recording</button>' +
            '<button class="cu-btn cu-btn--out" type="button">Cancel</button>' +
            '<button class="cu-btn cu-btn--text" type="button">Resend code</button>';
      }
      else if (kind === 'rows') {
        h = '<div class="cu-card cu-card--bare">' +
              checkRow('Photo ID and insurance card', true, 'g', 0) +
              checkRow('A notepad and pen (or device for notes)', false, 'g', 1) +
            '</div>';
      }
      else if (kind === 'qrow') {
        h = '<div class="cu-card cu-card--bare">' +
            questionRow({ q: 'Should I be aware of any new symptoms?', i: 0, as: 'div', menu: false }) +
            questionRow({ q: SEED.longQ, i: 1, as: 'div', menu: false }) +
            '</div>';
      }
      else if (kind === 'badges') {
        h = '<span class="cu-badge">' + ic('sparkle') + 'Matched from recording</span>' +
            '<span class="cu-badge cu-badge--edit">Edited</span>' +
            '<span class="cu-chip">Not answered during this conversation.</span>';
      }
      else if (kind === 'menu') {
        h = '<div class="cu-menu cu-menu--static">' +
            '<button type="button">' + ic('pencil') + 'Edit question</button>' +
            '<button type="button">' + ic('up') + 'Move to top</button>' +
            '<button type="button" disabled>' + ic('down') + 'Move to bottom</button>' +
            '<button type="button" class="is-danger">' + ic('trash') + 'Delete question</button>' +
            '</div>';
      }
      else if (kind === 'panel') {
        h = '<div class="cu-rec"><b class="cu-rec__h">Your recording</b>' +
            '<p class="cu-rec__p">Transcribing the conversation...</p>' +
            '<div class="cu-prog"><i class="is-indet"></i></div></div>';
      }
      else if (kind === 'file') {
        h = '<div class="cu-card cu-card--bare"><div class="cu-file">' +
            '<span class="cu-file__ico">' + ic('wave') + '</span>' +
            '<span class="cu-file__t"><b>' + esc(fileMain().n) + '</b><span>12:34 · Transcribed</span></span>' +
            '<span class="cu-file__play">' + ic('play') + '</span></div></div>';
      }
      else if (kind === 'said') {
        h = '<div class="cu-card cu-card--bare"><div class="cu-qm" data-state="matched">' +
            '<div class="cu-qm__meta"><span class="cu-badge">' + ic('sparkle') + 'Matched from recording</span></div>' +
            '<p class="cu-label cu-label--said">What they said</p>' +
            '<blockquote class="cu-said">' + esc(SEED.matched[0].quote) + '</blockquote></div></div>';
      }
      else if (kind === 'timeline') {
        h = '<div class="cu-journey cu-journey--gal">' +
            '<span class="cu-journey__line"></span>' +
            '<span class="cu-journey__now">Now</span>' +
            '<span class="cu-journey__stop" style="left:26%"><i data-k="done"></i><b>Cycle 3 cleared</b><span>Feb 2025</span></span>' +
            '<span class="cu-journey__stop" style="left:74%"><i data-k="now"></i><b>Cycle 4 awaiting</b><span>May 2025</span></span>' +
            '</div>';
      }
      else if (kind === 'fail') {
        h = '<div class="cu-card cu-card--bare"><div class="cu-fail cu-fail--conn">' +
            '<span class="cu-fail__ico">' + ic('cloudx') + '</span>' +
            '<span class="cu-fail__b"><b>The connection dropped partway through the upload.</b>' +
            '<span>Your recording is still selected; you don’t need to find it again.</span>' +
            '<em>Resume when you’re back online, or leave this and come back.</em></span></div></div>';
      }

      boxes[i].innerHTML = h;
    }
  }

  /* ---------------------------------------------------------------------
     FITTING THE DEVICE

     The phone is always 390 x 844 internally. The middle of the documented
     range. When its column is narrower than the shell, the whole thing is
     scaled with one transform, never reflowed: reflowing would show a layout
     the product does not have. The sizing box takes the scaled height so the
     page reserves the right amount of room.
     --------------------------------------------------------------------- */

  var DEV_OW = 412, DEV_OH = 866;

  function fit(fitEl) {
    var avail = fitEl.clientWidth;
    if (!avail) return;
    var s = Math.min(1, avail / DEV_OW);
    fitEl.style.setProperty('--cu-scale', s);
    fitEl.style.height = Math.round(DEV_OH * s) + 'px';
  }

  function watchFit(scope) {
    /* The Performance lab sizes its own preview. It has a height budget and
       a camera, and the generic fit would overwrite both. */
    var boxes = scope.querySelectorAll('.cu-fit:not(.cu-fit--bound)');
    for (var i = 0; i < boxes.length; i++) {
      fit(boxes[i]);
      if ('ResizeObserver' in window) {
        new ResizeObserver(function (ents) {
          for (var j = 0; j < ents.length; j++) fit(ents[j].target);
        }).observe(boxes[i]);
      }
    }
    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', function () {
        for (var k = 0; k < boxes.length; k++) fit(boxes[k]);
      });
    }
  }


  /* =====================================================================
     THE MASTHEAD IMAGE: three moments, one phone

     Not an artifact and not interactive: the case study's opening picture.
     Three screens side by side that carry the whole arc in one look, what
     you write before the appointment, what happens to the recording after
     it, and the answers that come back: drawn by the same components as
     everything below, in the same device frame, so the first thing on the
     page is the real thing rather than a render of it.
     ===================================================================== */

  function artHero(root) {
    var wrap = root.querySelector('[data-hero]');
    if (!wrap) return;

    function screenPrepare() {
      return appBar(SEED.title, SEED.whenShort, { trail: 'gear' }) +
        '<div class="cu-scroll">' +
          '<div class="cu-card"><div class="cu-sec"><b>Things to bring</b>' +
            '<span>2 of ' + SEED.bring.length + ' checked</span></div>' +
            SEED.bring.slice(0, 4).map(function (t, i) {
              return checkRow(t, i < 2, 'noop', i, { readonly: true });
            }).join('') +
          '</div>' +
          '<div class="cu-card"><div class="cu-sec"><b>My questions</b>' +
            '<span>' + SEED.questions.length + ' prepared</span></div>' +
            SEED.questions.slice(0, 5).map(function (q, i) {
              return questionRow({ q: q, i: i, as: 'div', menu: false, tools: false });
            }).join('') +
          '</div><div class="cu-pad"></div>' +
        '</div>' +
        '<div class="cu-foot"><button class="cu-btn" type="button" data-act="noop">Start the conversation</button></div>';
    }

    function screenUpload() {
      return appBar(SEED.title, SEED.today, { trail: 'kebab' }) +
        '<div class="cu-scroll">' +
          '<div class="cu-rec"><b class="cu-rec__h">Your recording</b>' +
            '<p class="cu-rec__p">Transcribing the conversation&hellip;</p>' +
            '<div class="cu-prog"><i class="is-indet"></i></div>' +
          '</div>' +
          '<div class="cu-card cu-card--bare"><div class="cu-file">' +
            '<span class="cu-file__ico">' + ic('wave') + '</span>' +
            '<span class="cu-file__t"><b>' + esc(fileMain().n) + '</b><span>12:34 &middot; Uploaded</span></span>' +
            '<span class="cu-file__play">' + ic('play') + '</span></div></div>' +
          '<div class="cu-card"><div class="cu-sec"><b>My questions</b>' +
            '<span>' + SEED.questions.length + ' prepared</span></div>' +
            SEED.questions.slice(0, 5).map(function (q, i) {
              return questionRow({ q: q, i: i, as: 'div', menu: false, tools: false });
            }).join('') +
          '</div><div class="cu-pad"></div>' +
        '</div>';
    }

    function screenAnswers() {
      var m0 = SEED.matched[0], m1 = SEED.matched[1];
      function block(q, m) {
        return '<div class="cu-qm" data-state="matched">' +
          '<div class="cu-qm__head"><span class="cu-box" data-on="1">' + ic('check') + '</span>' +
            '<span class="cu-qm__t">' + esc(q) + '</span></div>' +
          '<div class="cu-qm__meta"><span class="cu-badge">' + ic('sparkle') + 'Matched from recording</span></div>' +
          '<p class="cu-label cu-label--said">What they said</p>' +
          '<blockquote class="cu-said">' + esc(m.quote) + '</blockquote></div>';
      }
      return appBar(SEED.title, SEED.today, { trail: 'kebab' }) +
        '<div class="cu-scroll">' +
          '<div class="cu-tabs" role="tablist">' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="true">Questions</button>' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="false">Notes</button>' +
            '<button class="cu-tab" type="button" role="tab" aria-selected="false">Follow-ups</button>' +
          '</div>' +
          '<div class="cu-card cu-card--tabbed">' +
            '<div class="cu-sec"><b>Your questions</b><span>6 of 6 matched</span></div>' +
            block(SEED.questions[0], m0) + block(SEED.questions[1], m1) +
          '</div><div class="cu-pad"></div>' +
        '</div>';
    }

    /* No captions. The three screens are in order and the order is legible from
       the screens themselves. A list of questions, a recording being read, the
       answers coming back. Labelling that is explaining a picture to someone
       already looking at it. */
    var SCREENS = [screenPrepare, screenUpload, screenAnswers];

    wrap.innerHTML = SCREENS.map(function (view) {
      return '<div class="cs-mastimg__one">' +
        '<div class="cu-w__fit cs-mastimg__fit" data-dev="ios" data-hfit>' +
          '<div class="cu-app cu-w__app" data-dev="ios" style="--cu-w:393px;height:852px">' +
            view() +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    /* Inert: this is a picture of the product, not a control surface. */
    var apps = wrap.querySelectorAll('.cu-app');
    for (var i = 0; i < apps.length; i++) {
      apps[i].inert = true;
      apps[i].setAttribute('inert', '');
      apps[i].setAttribute('aria-hidden', 'true');
    }

    var GAPH = 20;

    /* THE CALLBACK MUST NOT MOVE THE BOX IT IS WATCHING.

       This used to clear every child's width and height, measure, and then set
       them again. The row is as tall as its children, so the clear alone took
       it from three scaled phones to three unscaled ones and back. Two height
       changes per pass, on the element the ResizeObserver is watching. The
       observer was answering its own writes, which is what "ResizeObserver
       loop completed with undelivered notifications" means. Catching that
       error would have hidden the message and kept the second layout pass.

       The clear was never needed for the measurement: the row is a
       block-level flex container, so its width is its parent's and no child
       can widen it. What is left is one write pass, and only when the number
       has actually moved. A resize that lands on the same scale, which is
       most of them, writes nothing at all. */
    var lastHeroS = -1;
    function fitHero() {
      var boxes = wrap.querySelectorAll('[data-hfit]');
      if (!boxes.length) return;

      var avail = wrap.clientWidth;
      if (!avail) return;
      /* 393 of screen plus 22 of chassis, three times, plus the gaps. */
      var each = 393 + 22;
      var s = Math.min(0.74, (avail - GAPH * (boxes.length - 1)) / (each * boxes.length));
      if (Math.abs(s - lastHeroS) < 0.002) return;
      lastHeroS = s;

      for (var k = 0; k < boxes.length; k++) {
        boxes[k].style.setProperty('--cu-scale', s);
        boxes[k].style.width = Math.round(393 * s) + 'px';
        boxes[k].style.height = Math.round(852 * s) + 'px';
      }
    }

    fitHero();
    onWidth(wrap, fitHero);
  }


  /* =====================================================================
     WATCHING A WIDTH WITHOUT WATCHING YOURSELF

     Both fitters below have the same shape: measure the room a row has, then
     resize the phones inside it. A ResizeObserver pointed at that row is a
     loop by construction. The row is as tall as its phones, so every write
     moves the box that triggered the write, and the browser reports
     "ResizeObserver loop completed with undelivered notifications". Catching
     that error would leave the second layout pass in place and only hide the
     message.

     Nor does an ancestor help: every ancestor contains the phones too, so
     every ancestor's height moves with them.

     What cannot move is a box with no height. This puts an absolutely
     positioned strip across the row, out of flow, so it is not a flex item
     and contributes nothing; full width, so it reports exactly the room the
     row has; zero height, so no write inside the callback can ever change it.
     The observer watches that instead, and the feedback path is gone rather
     than suppressed.

     Without ResizeObserver it falls back to the window, which is what moves
     these widths in practice anyway.
     ===================================================================== */

  function onWidth(box, fn) {
    /* AND THE WRITE LEAVES THE OBSERVATION.

       The strip cannot be moved by the callback, but the callback still runs
       inside the browser's delivery pass, and a width that is mid-transition
       delivers on every frame of it, so a write made there is a layout change
       made during delivery, which is the other half of the same error. One
       frame of deferral puts the write after the pass has finished. It is the
       same rAF guard ap-fit.js and audit-proto.js use, and it coalesces a
       burst of observations into one fit rather than one per frame. */
    var pending = 0;
    function schedule() {
      if (pending) return;
      pending = window.requestAnimationFrame(function () { pending = 0; fn(); });
    }

    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', schedule);
      return;
    }
    /* The strip is positioned against the row, so the row has to be the
       containing block. relative with no z-index starts no stacking context
       and changes nothing that is drawn. */
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    var probe = document.createElement('i');
    probe.className = 'wprobe';
    probe.setAttribute('aria-hidden', 'true');
    box.appendChild(probe);
    new ResizeObserver(schedule).observe(probe);
  }

  /* =====================================================================
     STATIC FRAMES. A device that is evidence rather than a control

     The hero, the two testing comparisons and anything else that shows a
     screen without inviting a tap all want the same thing: real components
     in a real frame, scaled to whatever room they are given, inert. This is
     that, once.
     ===================================================================== */

  function staticFrames(wrap, screens, opts) {
    if (!wrap) return;
    opts = opts || {};
    var W = opts.w || 393, H = opts.h || 852;
    var cap = opts.max || 0.74, GAP = opts.gap || 20;

    wrap.innerHTML = screens.map(function (view) {
      return '<div class="cs-frame">' +
        '<div class="cu-w__fit cs-frame__fit" data-dev="ios" data-sfit>' +
          '<div class="cu-app cu-w__app" data-dev="ios" style="--cu-w:' + W + 'px;height:' + H + 'px">' +
            view() +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var apps = wrap.querySelectorAll('.cu-app');
    for (var i = 0; i < apps.length; i++) {
      apps[i].inert = true;
      apps[i].setAttribute('inert', '');
      apps[i].setAttribute('aria-hidden', 'true');
    }

    /* Same shape as fitHero above, and the same reason: the clear is dropped
       because it moved the row it was measuring, and the scale is written only
       when it has changed. */
    var lastFrameS = -1;
    function fitFrames() {
      var boxes = wrap.querySelectorAll('[data-sfit]');
      if (!boxes.length) return;
      var k;
      var avail = wrap.clientWidth;
      if (!avail) return;
      /* The screen plus the 22 of chassis it paints outside itself. */
      var each = W + 22;
      var s = Math.min(cap, (avail - GAP * (boxes.length - 1)) / (each * boxes.length));
      if (Math.abs(s - lastFrameS) < 0.002) return;
      lastFrameS = s;
      for (k = 0; k < boxes.length; k++) {
        boxes[k].style.setProperty('--cu-scale', s);
        boxes[k].style.width = Math.round(W * s) + 'px';
        boxes[k].style.height = Math.round(H * s) + 'px';
      }
    }

    fitFrames();
    onWidth(wrap, fitFrames);
  }

  /* =====================================================================
     TESTING: the order that changed, and the source cue that followed

     Two comparisons, four screens, no interaction. The first pair is the
     preparation screen before and after the sequence change; the second is
     a matched answer before and after the source cues were strengthened.
     Both are built from the same components as everything else, so what is
     being compared is the arrangement rather than the drawing.
     ===================================================================== */

  function prepCard(order) {
    var bring =
      '<div class="cu-card"><div class="cu-sec"><b>Things to bring</b>' +
        '<span>0 of ' + SEED.bring.length + ' checked</span></div>' +
        SEED.bring.slice(0, 3).map(function (t, i) {
          return checkRow(t, false, 'noop', i, { readonly: true });
        }).join('') +
      '</div>';

    var mine =
      '<div class="cu-card"><div class="cu-sec"><b>My questions</b>' +
        '<span>' + SEED.questions.length + ' prepared</span></div>' +
        SEED.questions.slice(0, 3).map(function (q, i) {
          return questionRow({ q: q, i: i, as: 'div', menu: false, tools: false });
        }).join('') +
        '<div class="cu-row cu-row--add" data-static="1">' +
          '<span class="cu-row__ico">' + ic('plus') + '</span>' +
          '<span class="cu-row__t">Add your own question</span></div>' +
      '</div>';

    var sugg =
      '<div class="cu-card"><div class="cu-sec"><b>' + ic('sparkle') + 'Suggested questions</b>' +
        '<span>17 questions</span></div>' +
        SEED.suggested.slice(0, 3).map(function (c) {
          return '<div class="cu-cat"><div class="cu-cat__h" style="cursor:default">' +
            '<span><b>' + esc(c.name) + '</b><span>' + c.qs.length + ' questions</span></span>' +
            '<span class="cu-ico cu-ico--sm cu-chev" aria-hidden="true">' + ic('downc') + '</span></div></div>';
        }).join('') +
      '</div>';

    var parts = { bring: bring, mine: mine, sugg: sugg };
    return appBar(SEED.title, SEED.whenShort, { trail: 'gear' }) +
      '<div class="cu-scroll">' +
        order.map(function (k) { return parts[k]; }).join('') +
        '<div class="cu-pad"></div>' +
      '</div>' +
      '<div class="cu-foot"><button class="cu-btn" type="button" data-act="noop">Start the conversation</button></div>';
  }

  function artOrder(root) {
    staticFrames(root.querySelector('[data-frames]'), [
      function () { return prepCard(['bring', 'mine', 'sugg']); },
      function () { return prepCard(['mine', 'sugg', 'bring']); }
    ], { max: 0.62 });
  }

  /* The two states of a matched answer. Before: the words, with nothing
     saying where they came from. After: the excerpt, the source, the moment
     it was said, and a way into the transcript to check it. */
  var THIN = [
    'Your results are stable and this is the third clear set in a row.',
    'Testing continues every three months for now, moving to four-month intervals next year.'
  ];

  function sourceCard(strong) {
    function one(i) {
      var m = SEED.matched[i];
      return '<div class="cu-qm" data-state="matched">' +
        '<div class="cu-qm__head"><span class="cu-box" data-on="1">' + ic('check') + '</span>' +
          '<span class="cu-qm__t">' + esc(SEED.questions[i]) + '</span></div>' +
        (strong
          ? '<div class="cu-qm__meta"><span class="cu-badge">' + ic('sparkle') +
              'Matched from your recording</span><span class="cu-qm__at">' + esc(m.at) + '</span></div>' +
            '<p class="cu-label cu-label--said">What they said</p>' +
            '<blockquote class="cu-said">' + esc(m.quote) + '</blockquote>' +
            '<div class="cu-qm__go"><span class="cu-btn cu-btn--text">' + ic('right') +
              'View in transcript</span></div>'
          : '<p class="cu-qm__thin">' + esc(THIN[i]) + '</p>') +
      '</div>';
    }
    return appBar(SEED.title, SEED.today, { trail: 'kebab' }) +
      '<div class="cu-scroll">' +
        '<div class="cu-card cu-card--tabbed">' +
          '<div class="cu-sec"><b>Your questions</b><span>6 of 6 matched</span></div>' +
          one(0) + one(1) +
        '</div><div class="cu-pad"></div>' +
      '</div>';
  }

  function artSource(root) {
    staticFrames(root.querySelector('[data-frames]'), [
      function () { return sourceCard(false); },
      function () { return sourceCard(true); }
    ], { max: 0.62 });
  }

  var BUILD = {
    hero: artHero,
    order: artOrder,
    source: artSource,
    prepare: artPrepare,
    widths: artWidths,
    match: artMatch,
    permit: artPermit,
    modes: artModes,
    lab: artLab
  };

  PF.initCarryUI = function (scope) {
    scope = scope || document;
    var nodes = scope.querySelectorAll('[data-cu]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el._cuDone) continue;
      el._cuDone = true;
      var fn = BUILD[el.getAttribute('data-cu')];
      if (fn) fn(el);
    }
    gallery(scope);
    watchFit(scope);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { PF.initCarryUI(); });
  } else {
    PF.initCarryUI();
  }

})(window.PF);


/* ===== js/optiflow.js ===== */
/* Removed. The animated pipeline this drove was replaced by a flat SVG
   (CSS block 25, markup in the OptiFlow case study). Nothing calls it. */

/* ===== js/tagging.js ===== */
/* ==========================================================================
   tagging.js: the OptiFlow thumbnail's camera loop, verbatim.

   Self-executing and self-scoping: it bails if #tfRoot is absent, and every
   lookup is by its own tf- prefixed id.

   One host-side addition at the end, marked below: the rAF loop is paused
   while the card is off screen. A 24-second loop that recomputes twenty-odd
   node transforms every frame has no reason to run while nobody can see it.
   Nothing about the animation itself is changed.
   ========================================================================== */

(function(){
  var root = document.getElementById('tfRoot');
  if (!root) return;

  var scene  = document.getElementById('tfScene');
  var camera = document.getElementById('tfCamera');
  var overlay = document.getElementById('tfOverlay');
  var pen = document.getElementById('tfPen');

  /* ---------------- camera ----------------
     Every hold is placed on its subject's own bounding box, centred on it, with
     the zoom set to 500 / (halfExtent + 105). One margin for every beat, so
     the whole thing reads as one camera. The subject is the node's whole <g>,
     which includes its supporting symbol, so the framing accounts for the
     symbol without anything here naming it.

     The component renders at roughly 287px square, so the 1000-unit artboard
     arrives at about 0.29 device pixels per unit; at the authored zooms a
     card's type landed near 6px. These land it between 14 and 16.

     THE BRANCH IS FOUR BEATS, NOT ONE. It used to be a single wide hold with
     all three outcomes in frame at 0.78: legible as a shape, not as three
     decisions. Now the camera establishes the fork and then goes to each
     outcome in turn: accept, remove, add, each at 2.16 with its symbol. That
     is what the confidence read-out at the foot of the frame is for. It does
     not move with the camera, so the same figure sits still while the camera
     holds on the decision that is changing it: accept lifts it, remove drops
     it, add lifts it furthest. Three close beats cost 5.9 seconds, and every
     timing from the old branch exit onward is shifted by exactly that.

        beat                 subject                    authored   now
        intake               n1                           1.55     2.38
        AI suggestion        n2 + its three callouts      1.25     1.34
        review               n3                           1.20     2.16
        the fork             accept / remove / add        0.78     1.00
        accept               that chip alone               --      2.16
        remove               that chip alone               --      2.16
        add                  that chip alone               --      2.16
        merge                n5                           1.20     2.38
        justification        n6 + callout                 1.15     1.35
        validate gate        n7 + callout                 1.15     1.35
        no-change gate       n8                           1.00     1.96
        ship                 n9                           1.30     2.38
        pull-back            everything                   0.405    0.405

     The beats that barely move are the ones with no room: a card plus the
     callouts arranged around it, or the whole fork. Forcing those in further
     would crop the thing that makes the beat.

     The pull-back at the end is a 5.9x dolly rather than the authored 3.2x, so
     it gets 1300ms instead of 800: absorbed by the hold that follows. */
  var CAM = [
    {t:0,     cx:140,  cy:480, z:2.38},
    {t:1300,  cx:140,  cy:480, z:2.38},
    {t:2500,  cx:430,  cy:391, z:1.34},
    {t:4000,  cx:430,  cy:391, z:1.34},
    {t:4900,  cx:700,  cy:561, z:2.16},
    {t:5600,  cx:700,  cy:561, z:2.16},

    {t:7300,  cx:990,  cy:481, z:1.00},   /* the fork, all three in frame */
    {t:8600,  cx:990,  cy:481, z:1.00},
    {t:9300,  cx:990,  cy:189, z:2.16},   /* accept, confidence up   */
    {t:10800, cx:990,  cy:189, z:2.16},
    {t:11500, cx:990,  cy:479, z:2.16},   /* remove, confidence down */
    {t:13000, cx:990,  cy:479, z:2.16},
    {t:13700, cx:990,  cy:759, z:2.16},   /* add, confidence up   */
    {t:15200, cx:990,  cy:759, z:2.16},

    {t:16200, cx:1280, cy:483, z:2.38},
    {t:17100, cx:1280, cy:483, z:2.38},
    {t:18200, cx:1560, cy:635, z:1.35},
    {t:19600, cx:1560, cy:635, z:1.35},
    {t:20600, cx:1840, cy:635, z:1.35},
    {t:22000, cx:1840, cy:635, z:1.35},
    {t:23000, cx:2100, cy:570, z:1.96},
    {t:25300, cx:2100, cy:570, z:1.96},
    {t:26200, cx:2400, cy:483, z:2.38},
    {t:27300, cx:2400, cy:483, z:2.38},
    {t:28600, cx:1270, cy:510, z:0.405},
    {t:29500, cx:1270, cy:510, z:0.405},
    {t:30100, cx:1270, cy:510, z:0.405}
  ];
  var TOTAL = CAM[CAM.length - 1].t;

  var EDGES = [
    {id:'tf-e1',  start:1300,  dur:900,  pen:true},
    {id:'tf-e3',  start:4100,  dur:800,  pen:true},
    {id:'tf-e4b', start:5700,  dur:800,  pen:true},
    {id:'tf-e4a', start:5900,  dur:1300, pen:false},
    {id:'tf-e4c', start:6100,  dur:1300, pen:false},
    {id:'tf-e5',  start:15400,  dur:800,  pen:true},
    {id:'tf-e6',  start:15600,  dur:1000, pen:false},
    {id:'tf-e7',  start:17400, dur:800,  pen:true},
    {id:'tf-e8',  start:19800, dur:800,  pen:true},
    {id:'tf-e9',  start:22200, dur:800,  pen:true},
    {id:'tf-e10', start:23500, dur:1700, pen:true},
    {id:'tf-e11', start:25400, dur:800,  pen:true}
  ];

  var DASHED = [
    {id:'tf-da1', start:2700,  dur:700},
    {id:'tf-da2', start:3000,  dur:700},
    {id:'tf-da3', start:3000,  dur:700},
    {id:'tf-da4', start:18700, dur:700},
    {id:'tf-da5', start:21100, dur:700}
  ];

  var NODES = [
    {id:'tf-n1',      start:0,     dur:700},
    {id:'tf-n2',      start:2200,  dur:600},
    {id:'tf-n3',      start:4900,  dur:600},
    {id:'tf-n-remove', start:6500,  dur:600},
    {id:'tf-n-accept', start:7200,  dur:600},
    {id:'tf-n-add',    start:7400,  dur:600},
    {id:'tf-n5',      start:16200, dur:600},
    {id:'tf-n6',      start:18200, dur:600},
    {id:'tf-n7',      start:20600, dur:600},
    {id:'tf-n8',      start:23000, dur:600},
    {id:'tf-n9',      start:26200, dur:600},
    {id:'tf-a-confidence',    start:2700,  dur:600},
    {id:'tf-a-ai-suggestion', start:3000,  dur:600},
    {id:'tf-a-evidence',      start:3000,  dur:600},
    {id:'tf-a-justification', start:19200, dur:600},
    {id:'tf-a-validate-gate', start:21600, dur:600}
  ];

  var LABEL = {id:'tf-lbl-no-change', start:23800, dur:800};

  /* ---------------- the confidence read-out ----------------
     The point the whole component is making, stated as a number.

     OptiFlow is an AI that reads documents and proposes tags, and a reviewer
     who confirms, corrects or completes them. Each of those three does
     something different to how far the system can be trusted on the document
     in front of it, and this is where that is said out loud:

       accept  a suggestion the model got right     62 -> 74   the read is confirmed
       remove  a suggestion the model got wrong     74 -> 68   a false positive is retracted
       add     a tag the model missed entirely      68 -> 91   the last gap is closed

     The dip is the part worth having. A number that only ever climbs is a
     progress bar; one that drops when the human overrules the model is the
     actual argument. The reviewer is not decorating the output, they are the
     thing that makes it trustworthy, and the system is honest enough to lower
     its own estimate when it is caught being wrong. It ends higher than any of
     the three steps could reach alone.

     Each change is timed to land while the camera is held on the chip that
     causes it, which is why the branch became four beats. */
  var CONF_START = 62;
  var CONF = [
    {t: 9600,  dur:1100, from:62, to:74, hue:'var(--tf-accept)', label:'+12'},
    {t:11800,  dur:1100, from:74, to:68, hue:'var(--tf-remove)', label:'\u22126'},
    {t:14000,  dur:1100, from:68, to:91, hue:'var(--tf-add)',    label:'+23'}
  ];
  /* The read-out is HTML now, not an SVG group, see the note on .tf-hud in
     05-tagging.css. So the bar is set as a percentage of its own track and the
     colours are `color` and `background`, not `fill`. No geometry constants
     left here; CSS owns the layout. */

  /* WHERE THE READ-OUT IS STANDING. On the page it lies on the drawing, so it
     has to be faded in only while it is doing work and the camera has to duck
     out from under it. In the project browser's portrait column the stage
     stacks it above the frame instead (see .tf-stage--stacked in the embed):
     nothing is underneath it, so it simply stays on, and the camera has no
     reason to dodge. One flag, read from the layout rather than passed in. */
  var STACKED = !!document.querySelector('.tf-stage--stacked');

  var conf = {
    root:  document.getElementById('tfConf'),
    fill:  document.getElementById('tfConfFill'),
    pct:   document.getElementById('tfConfPct'),
    delta: document.getElementById('tfConfDelta')
  };

  /* On screen only where it is doing work: from the moment the fork appears
     until the camera leaves it, and again for the closing pull-back, where the
     final figure is the summary of everything the reviewer did. */
  function confEnvelope(e){
    if (e < 7000)  return 0;
    if (e < 7600)  return (e - 7000) / 600;
    if (e < 15400) return 1;
    if (e < 16000) return 1 - (e - 15400) / 600;
    if (e < 28600) return 0;
    if (e < 29200) return (e - 28600) / 600;
    return 1;
  }

  function drawConfidence(elapsed){
    if (!conf.root) return;

    conf.root.style.opacity = STACKED ? 1 : confEnvelope(elapsed);

    var pct = CONF_START, hue = '#1A1A1A', dLabel = null, dHue = null, dFade = 0;

    for (var i = 0; i < CONF.length; i++){
      var c = CONF[i];
      if (elapsed < c.t) break;
      var p = clamp((elapsed - c.t) / c.dur, 0, 1);
      pct = lerp(c.from, c.to, easeInOutCubic(p));
      hue = c.hue;
      /* The delta rides with its change and holds for a beat after it lands,
         so the figure and the reason for it are on screen together. */
      var age = elapsed - c.t;
      if (age < c.dur + 900){
        dLabel = c.label; dHue = c.hue;
        dFade = age < 260 ? age / 260
              : age > c.dur + 600 ? 1 - (age - c.dur - 600) / 300
              : 1;
      }
    }

    conf.fill.style.width = pct.toFixed(1) + '%';
    conf.fill.style.background = hue;
    conf.pct.textContent = Math.round(pct) + '%';

    if (dLabel){
      conf.delta.textContent = dLabel;
      conf.delta.style.color = dHue;
      conf.delta.style.opacity = clamp(dFade, 0, 1);
    } else {
      conf.delta.style.opacity = 0;
    }
  }


  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
  function lerp(a,b,t){ return a + (b - a) * t; }
  function easeInOutCubic(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t){
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /* Arrowheads. One per solid edge, built here rather than written into the
     markup: position and angle are read off the path's own end, so an edge can
     be re-routed and its arrow follows with nothing to keep in sync.

     Not a marker-end, which is the obvious answer and the wrong one. A marker
     is painted wherever the geometry says, regardless of the dash offset that
     draws these lines, so every arrowhead would sit waiting at its
     destination while the line was still crawling toward it. These are real
     elements with their own opacity, faded in over the last 8% of the draw, so
     the head arrives with the line.

     Pulled 3 units back along the tangent because each path already ends
     exactly on the shape it points into: at the tip the triangle would be half
     buried in a white card. */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var arrowLayer = document.getElementById('tfArrows');

  EDGES.forEach(function(e){
    e.el = document.getElementById(e.id);
    e.len = e.el.getTotalLength();
    e.el.style.strokeDasharray = e.len;
    e.el.style.strokeDashoffset = e.len;

    if (!arrowLayer) return;
    var tip  = e.el.getPointAtLength(Math.max(0, e.len - 3));
    var back = e.el.getPointAtLength(Math.max(0, e.len - 12));
    var deg  = Math.atan2(tip.y - back.y, tip.x - back.x) * 180 / Math.PI;
    var a = document.createElementNS(SVGNS, 'path');
    a.setAttribute('class', 'tf-arrow');
    a.setAttribute('d', 'M0,0 L-12,-6.5 L-12,6.5 Z');
    a.setAttribute('transform',
      'translate(' + tip.x.toFixed(2) + ' ' + tip.y.toFixed(2) + ') rotate(' + deg.toFixed(2) + ')');
    a.style.opacity = 0;
    arrowLayer.appendChild(a);
    e.arrow = a;
  });
  DASHED.forEach(function(d){ d.el = document.getElementById(d.id); });
  NODES.forEach(function(n){
    n.el = document.getElementById(n.id);
    n.cx = parseFloat(n.el.dataset.cx);
    n.cy = parseFloat(n.el.dataset.cy);
  });
  LABEL.el = document.getElementById(LABEL.id);

  function getCamera(t){
    for (var i = 0; i < CAM.length - 1; i++){
      if (t >= CAM[i].t && t <= CAM[i+1].t){
        var span = CAM[i+1].t - CAM[i].t;
        var f = span > 0 ? (t - CAM[i].t) / span : 1;
        var e = easeInOutCubic(clamp(f, 0, 1));
        return {
          cx: lerp(CAM[i].cx, CAM[i+1].cx, e),
          cy: lerp(CAM[i].cy, CAM[i+1].cy, e),
          z:  lerp(CAM[i].z,  CAM[i+1].z,  e)
        };
      }
    }
    var last = CAM[CAM.length - 1];
    return {cx:last.cx, cy:last.cy, z:last.z};
  }

  /* The read-out moved to the head of the frame, which took the top third of
     the stage with it. The camera used to anchor whatever it was framing at
     the centre of a 1000-unit square; with a 194-unit panel sitting at 134 the
     centre of the *free* stage is 647, not 500, and anchoring at 500 put the
     step above the focused one behind the panel, measured on the branch,
     where Remove Tag came out sliced by the panel's edge.

     So the anchor follows the panel: 500 while the read-out is away, 645 while
     it is up, interpolated by the panel's own opacity so the two move as one
     gesture. The panel fades over 600ms; the stage settles down under it in
     the same 600ms rather than jumping. */
  var CAM_Y_FREE = 500, CAM_Y_HUD = 645;

  /* The authored zooms were computed for a 287px render, where they put node
     type at 14-16px. The thumbnail's slot is larger now, so the same zooms
     overshoot: type grew past its ceiling and each beat framed one node so
     tightly that its neighbours were sliced at the edge of the frame. Pulling
     every zoom back by this factor restores the authored type size at the new
     render width and gives each subject margin again. Applied here as one
     constant rather than editing 27 keyframes, so the authored table above
     still reads as the record of what was intended. */
  var ZOOM_FIT = 0.8;

  /* On a phone the component is a square about 320px across, and at the
     desktop factor each beat frames one node with empty canvas around it.
     Pulling the camera back further trades type size for context, which is the
     right trade when the alternative is a card that looks broken. Read once
     and on resize, never per frame. */
  /* A host can override this. The hero's project browser renders the whole
     component at about 280px wide: the document inside the frame still
     measures 1000, so it cannot work this out for itself, and at the card's
     pull-back every beat came out too small to read. The preview document sets
     window.TF_ZOOM and the camera frames each step tighter, which is the
     magnification the small card needs: the same 27 keyframes, closer in. */
  function zoomFit() {
    if (typeof window.TF_ZOOM === 'number') return window.TF_ZOOM;
    var w = (root && root.clientWidth) || window.innerWidth;
    /* A narrow canvas frames each beat CLOSER, not wider. Pulling back was
       trading legibility for context and then trying to buy the legibility
       back by inflating the type, which broke every label out of its shape
       (see the note in css/05-tagging.css). Zooming in moves the shape and
       its label together, so the drawing stays the drawing and the words
       stay inside it. */
    return w < 420 ? 1.15 : ZOOM_FIT;
  }
  var zoom = zoomFit();
  var zt;
  window.addEventListener('resize', function () {
    clearTimeout(zt);
    zt = setTimeout(function () { zoom = zoomFit(); }, 150);
  });

  /* ---- how small this is actually being drawn ---------------------------

     The document measures 1000 whatever the card does, so the host tells it:
     js/projects.js posts the scale it fitted the frame at, and the only thing
     that changes here is the type. A label sized to sit inside its box at 1:1
     has no margin left in it by the time the scene is a quarter of the width
 (three lines of 24 in a parallelogram whose sides slant away from them), 
     so below two thirds of the authored size the labels step down and the
     shapes get their clearance back. Nothing else moves: same camera, same
     keyframes, same line breaks. */
  window.addEventListener('message', function (e) {
    if (!e || !e.data || typeof e.data.pfScale !== 'number') return;
    var s = e.data.pfScale;
    var el = document.documentElement;
    if (s > 0 && s < 0.30) el.setAttribute('data-tf-fit', 'tightest');
    else if (s > 0 && s < 0.37) el.setAttribute('data-tf-fit', 'tight');
    else el.removeAttribute('data-tf-fit');
  });

  /* Frames load at their own pace; this one may have missed the fit that ran
     before it existed. */
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ pfScaleRequest: 1 }, '*');
    }
  } catch (e) { /* not framed, or framed by something that will not answer */ }

  function update(elapsed){
    var cam = getCamera(elapsed);
    cam.z = cam.z * zoom;
    var anchorY = STACKED ? CAM_Y_FREE
                          : lerp(CAM_Y_FREE, CAM_Y_HUD, clamp(confEnvelope(elapsed), 0, 1));
    camera.setAttribute('transform',
      'translate(' + (500 - cam.cx * cam.z) + ' ' + (anchorY - cam.cy * cam.z) + ') scale(' + cam.z + ')');

    var activeEdge = null;
    EDGES.forEach(function(e){
      var p = clamp((elapsed - e.start) / e.dur, 0, 1);
      var eased = easeOutCubic(p);
      e.el.style.strokeDashoffset = e.len * (1 - eased);
      e.el.style.opacity = p > 0 ? 1 : 0;
      e.progress = p;
      /* The head lands in the last 8% of the draw rather than appearing with
         the line, so it reads as the line arriving somewhere. */
      if (e.arrow) e.arrow.style.opacity = p > 0.92 ? (p - 0.92) / 0.08 : 0;
      if (e.pen && p > 0.001 && p < 0.999){
        if (!activeEdge || e.start >= activeEdge.start) activeEdge = e;
      }
    });

    DASHED.forEach(function(d){
      var p = clamp((elapsed - d.start) / d.dur, 0, 1);
      d.el.style.opacity = easeOutCubic(p);
    });

    NODES.forEach(function(n){
      var p = clamp((elapsed - n.start) / n.dur, 0, 1);
      var eased = easeOutBack(p);
      var s = 0.82 + 0.18 * eased;
      n.el.style.opacity = clamp(p * 1.6, 0, 1);
      n.el.setAttribute('transform',
        'translate(' + n.cx + ' ' + n.cy + ') scale(' + s + ') translate(' + (-n.cx) + ' ' + (-n.cy) + ')');
    });

    var lp = clamp((elapsed - LABEL.start) / LABEL.dur, 0, 1);
    LABEL.el.style.opacity = easeOutCubic(lp);

    drawConfidence(elapsed);

    if (activeEdge){
      var pt = activeEdge.el.getPointAtLength(activeEdge.len * easeOutCubic(activeEdge.progress));
      pen.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
      pen.style.opacity = 1;
    } else {
      pen.style.opacity = 0;
    }

    var seamOut = TOTAL - 800;
    var ov = 0;
    if (elapsed >= seamOut) ov = easeInOutCubic((elapsed - seamOut) / 800);
    else if (elapsed < 700) ov = 1 - easeInOutCubic(elapsed / 700);
    overlay.style.opacity = ov;
  }

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timers = [];

  if (reduced){
    update(TOTAL - 1);
    EDGES.forEach(function(e){
      e.el.style.strokeDashoffset = 0;
      e.el.style.opacity = 1;
      if (e.arrow) e.arrow.style.opacity = 1;
    });
    NODES.forEach(function(n){
      n.el.style.opacity = 1;
      n.el.setAttribute('transform', 'translate(' + n.cx + ' ' + n.cy + ') scale(1) translate(' + (-n.cx) + ' ' + (-n.cy) + ')');
    });
    LABEL.el.style.opacity = 1;
    pen.style.opacity = 0;
    overlay.style.opacity = 0;
    /* The resting state is the end of the story, not the middle of it: the
       read-out sits at the figure the reviewer's three decisions arrived at. */
    if (conf.root){
      var end = CONF[CONF.length - 1].to;
      conf.root.style.opacity = 1;
      conf.fill.style.width = end + '%';
      conf.fill.style.background = CONF[CONF.length - 1].hue;
      conf.pct.textContent = end + '%';
      conf.delta.style.opacity = 0;
    }
  } else {
    /* --- host addition: only animate while on screen --------------------
       The loop below is the original. What is wrapped around it is a pause
       when the card scrolls away and a resume when it comes back, with the
       clock advanced by the time spent hidden so the phase never jumps.
       Also pauses on a backgrounded tab, where rAF would otherwise resume
       mid-cycle after a long gap.                                        */
    var startTime = null;
    var rafId = null;
    var pausedAt = 0;

    function frame(now){
      if (startTime === null) startTime = now;
      var elapsed = (now - startTime) % TOTAL;
      update(elapsed);
      rafId = requestAnimationFrame(frame);
    }

    function play(){
      if (rafId !== null) return;
      if (pausedAt) {
        /* Shift the origin forward by the hidden interval rather than
           restarting: the animation picks up exactly where it stopped. */
        var gap = performance.now() - pausedAt;
        if (startTime !== null) startTime += gap;
        pausedAt = 0;
      }
      rafId = requestAnimationFrame(frame);
    }

    function pause(){
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
      pausedAt = performance.now();
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { play(); } else { pause(); }
      }, { rootMargin: '150px 0px' }).observe(root);
    } else {
      play();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { pause(); }
      else if (root.getBoundingClientRect().bottom > 0) { play(); }
    });

    timers.push(pause);
  }
})();


/* ===== js/thread.js ===== */
/* ==========================================================================
   thread.js: the hero introduction, as a message thread

   Five messages arrive in order, and four of them are on screen at a time.
   Each one shows three dots in its place for a beat, then the finished message
   replaces them. Nothing types. The message is dropped in rather than faded
   in. It falls from 28px below, lands hard enough to compress, settles twice
   and stops, and the box it lands in never changes size, so the page under it
   cannot feel any of it.

   THE WINDOW. Once four messages are up, the next one does not extend the
   stack: the oldest slides out of the top and the remaining two move up to
   meet it, and only then does the new one begin. What actually moves is a
   single track inside a clipped box of fixed height: one transform, one
   transition, no reflow, and nothing outside the box can feel it happen. The
   box is measured for the tallest window of four that the sequence ever
   produces, so it is the same height before the first message and after the
   last.

   The whole file does one thing per step: set `data-state` on a row. The text
   is already in the markup, so there is no text to build, no string to slice,
   and nothing to re-render, CSS does the rest from the attribute.

   THE LAYOUT NEVER MOVES. Every row is in the DOM at full size from the first
   paint, the box is a fixed height measured before anything plays, and the
   only thing that ever animates is a transform on the track inside it. Nothing
   below the hero can shift as the thread builds, because no space is ever
   given up or taken back.

   The finished thread is what a screen reader and a no-JS visit get. This file
   only takes over when motion is allowed.
   ========================================================================== */

(function () {
  'use strict';

  /* Copies of the handwriting overlay, counted so each clone's mask ids stay
     its own. At file scope because a replayed thread builds the run again and
     the count has to survive that. */
  var HW_SEQ = 0;

  /* One sequence per discipline. The first line is shared: whichever role you
     pick, he says hello the same way, and the greeting is the same object on
     screen across a role change rather than a message that gets rewritten. Only the two lines after it change, so
     the layout, the timing and the reactions are identical across all three
     and nothing below the thread moves when you switch. */

  /* The three qualities used to be one word cycling in place, clarity, then
     trust, then performance, each replacing the last. They are all three in
     the sentence now, and they arrive the way the sentence does: one at a
     time, each coming out of the noise in a face of its own before it settles
     into the thread's. Naming three things one at a time is three statements;
     printing them together is a list. */

  var ROLES = {
    design: [
      [{ t: 'Hello Team :)' }],
      [{ t: 'I\u2019m ' }, { t: 'Sarthak Sahoo', em: true },
       { t: ', a Product Designer ' },
       { ic: 'phone', lbl: 'product' }, { ic: 'laptop', lbl: 'design' },
       { t: ' based in Austin, TX' }],
      /* Three beats, and the claim is at the end of all three. The lead-in is
         set the moment the bubble lands, because it is only setup; what waits
         its turn is the verb and the two words the sentence is actually for.
         Only the spaces between the groups stay, because a space is what holds
         the line's shape while the words are still out. */
      /* THE SENTENCE IS WRITTEN A WORD AT A TIME.

         Every word is its own run, so every word waits its turn and arrives
         on its own beat. The rhythm the thread already had, applied to the
         whole line rather than to three words inside it. Nothing is typed and
         no letters are revealed one at a time: a word is not there, and then
         it is.

         Nothing is emphasised on the way through, either. The line reads as
         one voice until its last two words, which is where the claim actually
         is. */
      [{ t: 'I’ve', sc: true, plain: true },
       { t: ' ' },
       { t: 'designed', sc: true, plain: true },
       { t: ' ' },
       { t: 'human-centered', k: 'craft', sc: true, plain: true, hum: true },
       { t: ' ' },
       { t: 'products', sc: true, plain: true },
       { t: ' ' },
       { t: 'in', sc: true, plain: true },
       { t: ' ' },
       { t: 'an', sc: true, plain: true },
       { t: ' ' },
       /* THE WHOLE LINE ARRIVES AT ONCE. It used to be written a word at a
          time, with a fault on the machine's half of the claim. Both are
          gone: the sentence fades up as one phrase, which is how it is read.
          The only thing that still happens inside it is that
          "human-centered" is written by hand, and that is the word rather
          than its entrance. */
       { t: 'AI-saturated', sc: true, plain: true },
       { t: ' ' },
       { t: 'world', sc: true, plain: true, post: '.' }]
    ],
    illustration: [
      [{ t: 'I draw as much as I design.' }],
      [{ t: 'Illustration is where I work an idea out before it becomes an interface.' }],
      [{ t: 'Most of it happens on paper before it happens anywhere else.' }],
      [{ t: 'Drawing is where I find the idea, not where I decorate it.' }]
    ],
    music: [
      [{ t: 'Off the clock I make house music.' }],
      [{ t: 'Same instinct as design: build the arrangement, then take things out.' }],
      [{ t: 'Most of what I make never leaves the room, and that is fine.' }],
      [{ t: 'The good version is usually the one with fewer parts.' }]
    ]
  };

  /* Per-message behaviour, addressed by index into the set above rather than
     spelled into the markup. A message can ask to arrive decoded, and it can
     ask to be held longer than the standard gap once it has. Adding one is a
     line here; nothing else in the file needs to know. */

  /* THE SENTENCE ABOUT THE WORK ARRIVES OUT OF TYPE, NOT JUST OUT OF NOISE.
     It is the one line that says what he does, so it is the one line that gets
     to be about type: it lands as noise set in somebody else's face, changes
     face while it resolves, and settles into the pixel one the rest of the
     thread is set in. Slow enough to watch. The whole point is that you can
     see it happening.

     It is the last thing the thread says, so what follows it belongs to the
     ending rather than to this message: the reactions wait out the writing and
     arrive on the beat it stops. No dwell here. A dwell is the gap before the
     NEXT message, and there is no next message. */
  ROLES.design[2].opt = { scramble: true, shuffle: true, wide: true };

  function esc(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* One line out to the rest of the page, and it only ever goes one way. The
     thread has no idea what is listening, which is the point: the reveal can
     be rewritten, or deleted, without this file changing. */
  function emit(name, i) {
    try {
      document.dispatchEvent(new CustomEvent(name, { detail: { index: i } }));
    } catch (e) { /* an old browser with no CustomEvent still gets the thread */ }
  }

  /* Runs to markup. Written once per role change, never per frame.

     A run is plain text, the one emphasised name, or a keyword, `k` names
     the gradient the word carries. The class is all this does: the fill, the
     angle and the speed all live in the stylesheet, so a keyword here costs
     one span and nothing else. */
  function render(msg) {
    var out = '';
    for (var i = 0; i < msg.length; i++) {
      var r = msg[i];
      var t = esc(r.t || '');   /* an icon run carries no text */
      var piece;
      /* The name is both: emphasised, and carrying a gradient of its own. */
      if (r.em) piece = '<em class="' + (r.k ? 'kw kw--' + r.k : '') + '">' + t + '</em>';
      else if (r.k) piece = '<span class="kw kw--' + r.k + '">' + t + '</span>';
      /* An icon run is a pixel symbol from the sprite, not a character. It
         carries its meaning as a label because there is no longer an emoji
         for a screen reader to read. */
      else if (r.ic) piece = '<svg class="pxi" data-px="' + r.ic +
        '" role="img" aria-label="' + esc(r.lbl || r.ic) +
        '"><use href="#px-' + r.ic + '"/></svg>\u2060';
      else piece = t;

      /* A run can ask to arrive out of noise on its own, and the mark is a
         WRAPPER rather than a class on the word: the group that hides, waits,
         comes apart and settles is the word plus whatever punctuation it
         carries, so the gradient span inside is left exactly as it was.
         `enc` asks for ciphertext rather than noise \u2014 digits, in the one face
         that has always meant a machine. */
      /* `gl` is a plain run with a fault in its arrival, so it carries the
         plain mark as well: everything that asks "does this word perform?" (
         the face shuffle, the character decode) already answers no to
         sc--plain, and none of them need to learn a second word for it. */
      if (r.sc) piece = '<span class="sc' + (r.enc ? ' sc--enc' : '') +
                        (r.plain || r.gl ? ' sc--plain' : '') +
                        (r.gl ? ' sc--gl' : '') +
                        (r.hum ? ' sc--hum' : '') + '">' +
                        piece + (r.post ? esc(r.post) : '') + '</span>';
      out += piece;
    }
    /* An icon must not be left at the end of a line with its comma starting
       the next one. The icon and whatever punctuation follows it become one
       unbreakable unit. A joiner alone does not stop a break beside an
       inline-block. */
    return out.replace(
      /(<svg class="pxi"[^>]*><use[^>]*\/><\/svg>)\u2060([,.]*)/g,
      '<span class="pxi-nb">$1$2</span>')
      /* AND THE WORD IN FRONT OF IT. An icon belongs to the word it follows, 
         "healthcare" and its mark are one thing being named, so a line break
         between them is the same fault as a comma stranded after it. The word
         joins the unbreakable unit rather than the unit standing on its own. */
      .replace(/(\S+)\s+<span class="pxi-nb">/g, '<span class="pxi-nb">$1&nbsp;')
      /* Two icons side by side are one unit as well. */
      .replace(/<\/span><span class="pxi-nb">/g, '');
  }

  /* Paced to read as a conversation rather than a transition. The loading
     state is on screen long enough to say "this is being written" instead of
     flickering past, and each message is given room to land before the next
     one starts, so no two animations ever overlap. */
  /* The sending indicator is a beat, not a wait. It used to hold for well over
     a second before every message, which on a six-message sequence is eight
     seconds of watching three dots. The anticipation turned into latency. It
     is now just long enough to register as something being written. */
  var DOTS_MS = 560;
  /* The phone writes its opening rather than posting it whole (see shape()),
     so it needs an indicator brisk enough to read as typing rather than as
     loading, and a gap that is a beat rather than a pause. */
  var DOTS_FAST = 360;
  var OPEN_GAP = 440;
  /* AND THE BEAT AFTER THE INTRODUCTION, ON A PHONE.

     Every other message is left alone for a beat plus a millisecond per
     character it holds, which for "I'm Sarthak Sahoo, a Product Designer,
     based in Austin, TX" came out at 2608ms measured. On a desktop that is a
     pause; on a phone, where the whole conversation is the first screen and
     there is nothing else to look at while it runs, it is a stall. The line
     is a name and a job title: it is read in a glance and it does not need to
     be sat with.

     Declared beside the other beats and ABOVE everything that reads it,
     because a `var` read before its assignment is `undefined`, which is what
     cost the first-load measurement a reservation earlier in this file. */
  var SECOND_HOLD = 320;
  /* THE ARRIVAL GOT LONGER AND THE CADENCE DID NOT.

     The entrance runs 640ms now, so `settled` waits that out rather than
     cutting the landing off part-way. The beat after it gives the 120ms back,
     which keeps every message arriving on exactly the frame it used to: 640 +
     780 is the same 1420ms per message as 520 + 900 was, so nothing the page
     hangs off the thread (see js/reveal.js) shifts by so much as a frame. */
  var POP_MS = 640;     /* the bubble's arrival, matched to the CSS */
  /* THE PAUSE IS THE MESSAGE'S OWN LENGTH. A one-line greeting and a
     two-hundred-character sentence about six industries are not the same
     thing to read, and giving them the same pause means one of them is always
     wrong: the short one drags, or the long one is interrupted. So the gap
     after a message is a base plus its own reading time, measured from the
     text that is actually on screen, copy can be rewritten and the pacing
     follows it with nothing to update here.

     The ceiling matters as much as the rate: past about five seconds a pause
     stops reading as a pause and starts reading as a thread that has stopped. */
  var GAP_MS = 780;         /* the beat every message gets */
  var READ_MS = 24;         /* per character of it */
  var GAP_MAX = 4600;       /* however long it is, it moves on */
  /* After the last message has settled, or, when that message is still
     writing itself, after the writing stops. The reactions are a response to
     the line, so they land on the beat it finishes rather than after a pause
     that reads as the thread having nothing else to say. */
  var REACT_MS = 700;
  /* And that beat is exactly one: long enough not to be the same frame as the
     last word resolving, short enough that nothing has happened in between. */
  var TIGHT = 140;
  /* THE LAST MESSAGE GETS THE ROOM IT ASKS FOR. The closing line and the
     reactions under it used to be talked over: the list of work started
     revealing on the same frame the first chip landed, so the one moment the
     sequence is building towards was competing with five project names
     arriving underneath it. Now the chips run their course, and then the
     finished thing (line, reactions and all) simply stands for a couple of
     seconds before the work appears under it. */
  var PROJECTS_MS = 2400;
  var SHIFT_MS = 700;   /* the window opening: matched to the CSS transition */
  /* THE ENDING IS HELD, AND IT IS THE ONLY THING THAT IS. The closing line,
     its reactions and the invitation under them are what the whole sequence
     is built to arrive at, so once the work is offered nothing moves for
     sixteen seconds. The pause the introduction used to take, spent where
     there is a reason to pause: before the conversation starts over. */
  var HOLD_MS = 16400;
  var FADE_MS = 340;    /* the whole stack dims out together */
  var BLANK_MS = 640;   /* an empty beat, so the loop is a breath not a cut */
  var SCRAMBLE_MS = 1800; /* the decode: four words, one after another */
  /* The typeface shuffle runs longer than a plain decode, because it has two
     things to show rather than one: the noise resolving, and the type settling
     into the face the thread is set in. */
  /* The faces it passes through on the way. Every one of them is already
     loaded for the artifacts, and all of them set this sentence to the same
     number of lines as the pixel face, measured, not assumed, because a
     shuffle that reflows the bubble is a shuffle that shakes the page. */
  var SHUFFLE_FACES = [
    '"JetBrains Mono", monospace',
    'Georgia, serif',
    '"Sora", sans-serif',
    '"Space Grotesk", sans-serif',
    '"Inter", sans-serif',
    '"Be Vietnam Pro", sans-serif'
  ];
  var WORD_HOLD = 1700;      /* each word stands, and is read, before the next */
  var WORD_SCRAMBLE = 620;   /* and the change between them is quick */

  /* THE INSETS THE BOX PARKS ITS STACK AT, DECLARED HERE, AND HERE FOR A
     REASON.

     These four were written next to place(), nine hundred lines down, which
     put them AFTER the call that first needs them. `var` hoists the name and
     not the value, so on the very first reserve() they were each `undefined`,
     `boxH` came out NaN, and `thread.style.height = 'NaNpx'` was rejected by
     the parser without a word: leaving the box at its auto height with no
     reservation in it at all.

     That is invisible on a desktop, where the box is tall enough that nothing
     notices. On a phone the reaction tray is absolutely positioned and hangs
     below the last bubble, outside the auto height, so the clip took the
     chips off, and the only thing that ever put them back was the re-measure
     on document.fonts.ready, by which time these had finally been assigned.
     A first load that missed that second pass stayed broken until a refresh,
     which is exactly the bug that was reported.

     They are design constants with no dependencies, so the fix is to state
     them before anything can read them. */
  /* Even air above and below. Twice what the box used to hold: at this width
     the thread is the first screen rather than one panel of it, and the room
     around it is what makes it read as the whole of what there is to read
     before you scroll. */
  var FLAT_PAD = 60;
  /* Almost nothing underneath, because what follows the box is the invitation
     rather than the edge of the composition, and the reaction tray's own
     overhang is already reserved under the last bubble. The distance the eye
     actually reads between the chips and the invitation is that overhang plus
     this plus the invitation's own margin. */
  var FLAT_TAIL = 6;

  var STILL_PAD = 26;
  var STILL_TAIL = 14;   /* and under it, where the invitation sits */


  /* NOTHING IN THE OPENING IS HELD. The introduction used to be (a name, a
     title and a city is three facts in one line), but it arrives on the
     greeting's own frame now, and a pair that lands together and then waits
     reads as a thread that has run out of things to say two lines in. The
     pause it had belongs at the other end, where there is something to pause
     for: see HOLD_MS, after the work is offered. */
  var OPENING_DWELL = [0, 0];

  /* ---- the decode ---------------------------------------------------------

     One message arrives out of noise rather than simply arriving. It is not a
     glitch: nothing flashes, nothing jumps, and the sentence never moves a
     pixel while it resolves.

     THE TRICK IS WIDTH. Fraunces is proportional (an `i` is narrow and
     a `W` is 912), so swapping characters at random would re-wrap the line on
     every frame, which is exactly the jitter that makes this effect look
     cheap. The pool is therefore measured once, in the real face at the real
     size, and bucketed by advance width; a character is only ever stood in for
     by one that occupies precisely the same space. The line boxes cannot move,
     because nothing in them has changed size.

     The resolve is a left-to-right wave with a little slack in it, so it reads
     as settling rather than as a cursor wiping across. Characters that have no
     same-width stand-in (spaces, punctuation) are simply there from the
     start, which also keeps the shape of the sentence legible while the
     letters are still noise.

     The final text is already in the DOM, gradient span and all: this walks
     its text nodes and puts them back exactly as it found them. There is no
     swap at the end, so `performance` resolves straight into its gradient
     rather than cutting to it. */
  var POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  /* And the one word that is decrypted rather than decoded. */
  var CIPHER = '0123456789';

  function widthBuckets(el) {
    var cs = window.getComputedStyle(el);
    var font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + '/' +
               cs.lineHeight + ' ' + cs.fontFamily;
    var cv = document.createElement('canvas').getContext('2d');
    cv.font = font;
    var by = {};
    var i, c, w;
    for (i = 0; i < POOL.length; i++) {
      c = POOL.charAt(i);
      w = Math.round(cv.measureText(c).width * 100);
      (by[w] = by[w] || []).push(c);
    }
    return { by: by, ctx: cv };
  }

  function scramble(row, ms, done, byWord) {
    var host = row.querySelector('.msg__text');
    if (!host) { if (done) done(); return; }

    var buckets = widthBuckets(host);

    function textNodes(root, into) {
      for (var i = 0; i < root.childNodes.length; i++) {
        var c = root.childNodes[i];
        if (c.nodeType === 3) into.push(c);
        else if (c.nodeType === 1) textNodes(c, into);
      }
      return into;
    }

    /* WHAT DECODES, AND WHAT IS SIMPLY THERE.

       A message can hand the whole of itself over to the noise, or it can name
       the words that come out of it. The sentence about the work does the
       second: the frame. "I focus on building for", is a plain statement and
       arrives as one, and the four qualities inside it each resolve on their
       own, one after another, which is the sentence being made rather than a
       sentence being decrypted.

       Marked runs are `.sc`. With none, the message is one group and behaves
       exactly as it always did. */
    /* BY WORD, THE WORD IS THE GROUP. The sentence that hunts for its
       typeface does not decode all at once and resolve left to right: each
       word waits its turn in plain sight, comes apart, and comes back, and
       then the next one does. So the groups are the word spans rather than
       the marked runs, and a character outside its own word's window is
       simply the character. */
    var marks = host.querySelectorAll(typeof byWord === 'string' ? byWord : '.sc');
    var groups = [], nodes = [], g;
    /* One group can be ciphertext instead of noise: it stands in for its
       letters with digits and resolves out of them, which reads as something
       being decrypted rather than something being typed. */
    var enc = [], plain = [];
    if (marks.length) {
      for (g = 0; g < marks.length; g++) {
        groups.push(textNodes(marks[g], []));
        enc.push(marks[g].classList.contains('sc--enc'));
        /* And one can ask for no noise at all: it still waits for its turn and
           is still hidden until then, it simply arrives as itself. */
        plain.push(marks[g].classList.contains('sc--plain'));
      }
    } else {
      groups.push(textNodes(host, []));
      enc.push(false);
      plain.push(false);
    }
    for (g = 0; g < groups.length; g++) nodes = nodes.concat(groups[g]);

    /* Which group each slot belongs to, so the timing can be per word. */
    var owner = [];
    for (g = 0; g < groups.length; g++) {
      for (var q = 0; q < groups[g].length; q++) owner.push(g);
    }

    var slots = [], total = 0, i, j;
    for (i = 0; i < nodes.length; i++) {
      var text = nodes[i].nodeValue;
      var gi = owner[i] || 0;
      var pool = [];
      for (j = 0; j < text.length; j++) {
        var ch = text.charAt(j);
        if (plain[gi]) { pool.push(null); continue; }
        if (enc[gi]) {
          /* Ciphertext: every letter is a digit until it is not. Width is not
             held by the stand-in here. The word is boxed at its own width
             while it decrypts, which is the same guarantee bought a different
             way. Punctuation is punctuation; a comma is not encrypted. */
          pool.push(/[0-9A-Za-z]/.test(ch) ? CIPHER : null);
          if (pool[j]) total++;
          continue;
        }
        var w = Math.round(buckets.ctx.measureText(ch).width * 100);
        var same = buckets.by[w];
        /* Only a character with a same-width understudy is ever hidden. */
        pool.push(ch === ' ' || !same || same.length < 2 ? null : same);
        if (pool[j]) total++;
      }
      slots.push({ node: nodes[i], text: text, pool: pool, order: null,
                   group: gi });
    }
    /* NOTHING TO DECODE IS NOT NOTHING TO WAIT FOR.

       When every run on the line is plain there are no characters to hide,
       and this used to call back on the same frame, which, since the callback
       is what ends the word-by-word reveal, showed the whole sentence at once
       the instant it was asked to arrive a word at a time. The decode has
       nothing to do; the line still takes as long as it takes. */
    if (!total) {
      var idle = setTimeout(function () { if (done) done(); }, ms);
      return function cancel() { clearTimeout(idle); };
    }

    /* When each slot resolves. One group is a left-to-right ramp across the
       whole message, as before. Several groups are dealt a window each, in
       order, overlapping a little: the second word starts coming out of the
       noise while the first is finishing, so the line resolves word by word
       rather than in four separate events. */
    var G = groups.length;
    /* One window each, back to back and no overlap, when the words take their
       turns; a shared ramp with a little overlap when the whole line is one
       decode. */
    var span = byWord ? (1 / G) : (G > 1 ? 0.34 : 1);
    var step = byWord ? (1 / G) : (G > 1 ? (1 - span) / (G - 1) : 0);
    var seen = [], count = [];
    for (g = 0; g < G; g++) { seen.push(0); count.push(0); }
    for (i = 0; i < slots.length; i++) {
      for (j = 0; j < slots[i].text.length; j++) {
        if (slots[i].pool[j]) count[slots[i].group]++;
      }
    }
    for (i = 0; i < slots.length; i++) {
      slots[i].order = [];
      g = slots[i].group;
      for (j = 0; j < slots[i].text.length; j++) {
        if (!slots[i].pool[j]) { slots[i].order.push(-1); continue; }
        var within = count[g] ? (seen[g]++ / count[g]) : 0;
        if (byWord) {
          /* Noise from the first frame, all the way to its own turn. The word
             is hidden until then, so what it holds while it waits is nobody's
             business, and starting it as noise means the instant it is shown
             it is already coming apart. Anything else flashes the finished
             word for one frame before the decode catches up. */
          slots[i].order.push(Math.min(1,
            g * step + span * (0.42 + within * 0.5)));
        } else {
          slots[i].order.push(Math.min(1,
            g * step + within * span * 0.78 + Math.random() * span * 0.22));
        }
      }
    }

    var t0 = 0, raf = 0, last = 0;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / ms);
      /* The noise itself steps at about 24 a second; the resolve is smooth.
         Re-rolling every frame reads as static rather than as characters. */
      var roll = now - last > 42;
      if (roll) last = now;
      for (var a = 0; a < slots.length; a++) {
        var s = slots[a], out = '';
        for (var b = 0; b < s.text.length; b++) {
          var when = s.order[b];
          if (when < 0 || p >= when) out += s.text.charAt(b);
          else {
            var set = s.pool[b];
            out += set[(Math.random() * set.length) | 0];
          }
        }
        if (roll || p >= 1) s.node.nodeValue = out;
      }
      if (p < 1) raf = window.requestAnimationFrame(frame);
      else {
        for (a = 0; a < slots.length; a++) slots[a].node.nodeValue = slots[a].text;
        if (done) done();
      }
    }
    raf = window.requestAnimationFrame(frame);
    return function cancel() {
      window.cancelAnimationFrame(raf);
      for (var a = 0; a < slots.length; a++) slots[a].node.nodeValue = slots[a].text;
    };
  }

  function init(thread) {
    if (thread._thDone) return;
    thread._thDone = true;

    var rows = [].slice.call(thread.querySelectorAll('[data-msg]'));
    if (!rows.length) return;

    /* Declared up here, and without initialisers on purpose. reserve() runs
       near the top of this function and asks whether the invitation exists so
       it can measure it; a `var x = null` further down would run AFTER that,
       put the reference back to null, and the next caller would build a SECOND
       invitation and show that one while the box had reserved room for the
       first. Hoisting gives the declaration; an initialiser takes it away
       again. */
    var ctaRow, view, backRow;

    /* ---- the rows come from the data, not from the markup ---------------

       THE VIEWPORT IS A MESSAGE SYSTEM, NOT A SET OF SLOTS. The markup holds
       one authored row per message because that is what a screen reader and a
       no-JS visit read, but the sequence is the array at the top of this
       file, and it is allowed to be any length. If a set has more messages
       than there are rows, the rows are built from the first one; if it has
       fewer, the extras go out of flow. Four, six, ten, thirty: the same code,
       and no hand-positioning anywhere.

       None of this touches the box. Its height is the tallest window of
       VISIBLE messages the set produces, which is a property of the widest
       pair, not of how many pairs there are, so a longer sequence scrolls for
       longer inside exactly the same rectangle. */
    var track = thread.querySelector('[data-track]') || thread;

    /* The template is the first row, stripped of anything that belongs to a
       particular message. */
    var TEMPLATE = (function () {
      var t = rows[0].cloneNode(true);
      var rx = t.querySelector('.msg__reactions');
      if (rx && rx.parentNode) rx.parentNode.removeChild(rx);
      var bub = t.querySelector('.msg__bubble');
      if (bub) bub.classList.remove('msg__bubble--reacted');
      return t;
    })();

    function grow(n) {
      while (rows.length < n) {
        var r = TEMPLATE.cloneNode(true);
        r.setAttribute('data-state', 'idle');
        r.setAttribute('aria-hidden', 'true');
        track.appendChild(r);
        rows.push(r);
      }
    }

    /* Clustering is a rule, not an attribute somebody remembered to type: a
       new sender group every two messages, and the badge belongs to the row
       that starts one. Per-message options come from the data beside it. */
    function shape(set) {
      cyclers = [];
      /* Every row, not only the ones this role uses: a set with fewer
         messages must not inherit the last one's scramble or its dwell from
         the role before it. */
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (i >= set.length) {
          row.removeAttribute('data-scramble');
          row.removeAttribute('data-shuffle');
          row.removeAttribute('data-dwell');
          continue;
        }
        var opens = i % 2 === 0;
        var badge = row.querySelector('.msg__from');

        if (opens) {
          row.setAttribute('data-cluster', '');
          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'msg__from';
            badge.setAttribute('aria-hidden', 'true');
            badge.textContent = 'SS';
            row.insertBefore(badge, row.firstChild);
          }
        } else {
          row.removeAttribute('data-cluster');
          if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
        }

        /* Any run in any message can name a list of words it cycles through. */
        for (var c = 0; c < set[i].length; c++) {
          if (set[i][c].cycle) {
            cyclers.push({ i: i, words: set[i][c].cycle,
                           hold: set[i][c].hold || WORD_HOLD,
                           at: 0, timer: null, cancel: null });
          }
        }

        var opt = set[i].opt || {};
        if (opt.scramble) row.setAttribute('data-scramble', '');
        else row.removeAttribute('data-scramble');
        if (opt.shuffle) row.setAttribute('data-shuffle', '');
        else row.removeAttribute('data-shuffle');

        /* THE OPENING TWO ARE ONE BREATH. "Hello :)" and the line that says
           who is saying it are not two turns of a conversation, nobody types
           a greeting, waits, and then types their own name. So the second row
           arrives on the first one's frame: one indicator before them, both
           bubbles at once, and the thread starts by introducing itself rather
           than by making you wait through a greeting for it.

           A rule about position, not a flag in the data, because it is true
           of every discipline's opening and always will be. */
        /* THAT IS NO LONGER TRUE, AND THE REASON IS THE PAGE.

           The two opening lines used to land on one frame at every width but
           the phone's, on the argument above: nobody types a greeting, waits,
           and then types their own name. The page is built around the thread
           now: the profile card and the project browser arrive on the line
           that says who he is and where he is (see js/reveal.js), and an
           introduction that is already on screen before the first frame has
           nothing left to introduce. The greeting opens alone at every width,
           and the introduction is its own beat, which is the rhythm the phone
           has always had.

           The attribute stays, and so does the mechanism behind it: a set
           whose second line genuinely belongs to the first can still ask for
           it. Nothing asks for it today. */
        row.removeAttribute('data-together');

        /* A message can ask to be held after it lands, either by naming a
           dwell in the data or by being one of the opening two. */
        var dwell = opt.dwell || OPENING_DWELL[i] || 0;
        if (dwell) row.setAttribute('data-dwell', dwell);
        else row.removeAttribute('data-dwell');
      }
    }

    /* ---- how much of the set this screen gets --------------------------

       A phone is holding the whole conversation in about the height of two
       bubbles, and the third message is the longest thing in it: a sentence
       that takes six seconds to write itself, in a viewport where the first
       two have already used the room. So the set ends at the introduction
       there, and the reactions and the invitation move up onto it, which is
       what the ending does anyway with whatever the last message turns out to
       be.

       Marked in the data rather than counted here, so a set says which of its
       messages need width and nothing has to know how many any role has. */
    var narrow = window.matchMedia('(max-width: 719px)');

    /* EVERY WIDTH GETS THE WHOLE CONVERSATION. The phone used to stop at the
       introduction. The sentence about the work is the longest thing in the
       set and the box was two bubbles tall, but the box is sized to what it
       holds now rather than to a window of three, so the third message costs
       height rather than costing one of the others. Nothing is trimmed and
       nothing is faded out to make room for it. */
    function fits(set) {
      return set.length;
    }

    /* How many of the rows in the markup this role actually uses. Product
       Designer has six and ends on a punchline; the other two have five. Rows
       past the count are taken out of flow entirely, so they cost nothing, 
       not height, not a measurement, not a step in the sequence. */
    var count = rows.length;

    function setCount(n) {
      count = Math.max(1, Math.min(n, rows.length));
      for (var i = 0; i < rows.length; i++) {
        if (i < count) rows[i].removeAttribute('data-off');
        else rows[i].setAttribute('data-off', '');
      }
      /* The reactions belong to whichever message ends the sequence. */
      var rx = thread.querySelector('.msg__reactions');
      if (rx) {
        var host = rows[count - 1].querySelector('.msg__bubble');
        if (host && rx.parentNode !== host) {
          host.appendChild(rx);
          for (var j = 0; j < rows.length; j++) {
            var bub = rows[j].querySelector('.msg__bubble');
            if (bub) bub.classList.toggle('msg__bubble--reacted', bub === host);
          }
        }
      }
    }

    /* Reduced motion never plays the sequence, but the role buttons and the
       reactions are controls, not decoration, so they are wired either way. */
    var still = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* The visual rows leave the accessibility tree and one plain copy of the
       whole introduction takes their place, so a screen reader reads the
       thread once, in full, whatever the animation is doing. */
    var readable = document.createElement('span');
    readable.className = 'visually-hidden';
    readable.textContent = thread.textContent.replace(/\s+/g, ' ').trim();
    thread.insertBefore(readable, thread.firstChild);

    if (!still) {
      for (var i = 0; i < rows.length; i++) {
        rows[i].setAttribute('aria-hidden', 'true');
        rows[i].setAttribute('data-state', 'idle');
      }
    }

    /* ---- reserve the space ---------------------------------------------

       Two measurements, both taken once, both taken with every row at its
       finished size inside a single synchronous task, styles set, geometry
       read, states put back before the browser can paint, so nothing flashes.

       Per row: the loading state takes the message text out of flow so the
       bubble can be small, which would let the row collapse and drag the page
       up under it. Each row's finished height is pinned as a min-height.

       Per window: the box only ever shows four rows, so its height is the
       tallest run of four the sequence produces, not the height of all five,
       and not the height of the first four. Measured across every window, so
       the box never changes size, in either direction, at any point.

       The offsets fall out of the same numbers: to retire row k, the track
       moves up by that row's height plus the gap under it.

       Four visible, five in the sequence, so exactly one message ever
       retires, as the fifth arrives, and the thread comes to rest showing
       messages two to five. */
    /* Two on screen at a time. The box below is measured for the tallest
       window of THIS many rows, so the number here and the type size in
       css/04-components.css are one decision made twice: halve the window,
       double the type, same rectangle. */
    /* HOW MANY MESSAGES THE BOX IS BUILT FOR. Two was the number while every
       message was three or four lines deep in a narrow column; now that the
       thread runs the full width of its column and a sentence is two lines,
       two messages leave the box looking half-used. Three is what the copy
       supports at this measure. The box is still the tallest window of three
       the sequence produces, so it is the same height before the first message
       and after the last. */
    var VISIBLE = 3;
    /* The interval the box is measured on. It matches the one interval the
       stylesheet now uses between messages, so the reserved height and the
       rhythm on screen are the same number rather than two that drift. */
    var SIZING_GAP = 22;
    var heights = [], gaps = [], step = [], boxH = 0;

    function reserve() {
      var i, prev = [];
      for (i = 0; i < count; i++) {
        prev.push(rows[i].getAttribute('data-state'));
        rows[i].style.minHeight = '';
        rows[i].setAttribute('data-state', 'live');
      }

      /* One read pass, so the layout is computed once rather than once per
         row. The gaps come from the stylesheet rather than from a constant
         here (they are design-system values, not behaviour), and there is one
         PER ROW now rather than one for the thread: a message that starts a
         new cluster sits further from the one above it than a message that
         continues one, so a single number would be wrong for two rows in every
         three. */
      heights = [];
      gaps = [];
      for (i = 0; i < count; i++) {
        heights.push(rows[i].getBoundingClientRect().height);
        gaps.push(i === 0 ? 0 : parseFloat(window.getComputedStyle(rows[i]).marginTop) || 0);
      }

      for (i = 0; i < count; i++) {
        rows[i].style.minHeight = Math.ceil(heights[i]) + 'px';
        rows[i].setAttribute('data-state', prev[i]);
      }

      /* The tallest window the sequence produces, measured with the gaps that
         actually fall inside each one. */
      boxH = 0;

      /* THE BOX IS ALL OF IT, OR IT IS A WINDOW ONTO IT. A phone shows the
         whole conversation at once. Three messages, their reactions and the
         invitation, none of which ever leaves, so its box is the sum of what
         it holds, measured with the real gaps rather than the sizing interval
         a sliding window uses. Anywhere else the box is the tallest window of
         three the sequence produces and the rest is retired through the top. */
      if (whole()) {
        for (i = 0; i < count; i++) boxH += heights[i] + gaps[i];
      }
      for (i = 0; !whole() && i + VISIBLE <= count; i++) {
        /* THE BOX IS SIZED ON THE MESSAGES, NOT ON THE AIR BETWEEN THEM.
           The gap in the stylesheet is now a composition decision (generous,
           and free to grow), and if the box were measured with it, every
           adjustment to the rhythm would push the card taller. So the height
           is two messages plus a fixed sizing interval: the card stays the
           size it was designed at, and the extra air is spent by older
           messages leaving the top a little sooner, which is what the canvas
           is for. */
        var h = heights[i];
        for (var j = 1; j < VISIBLE; j++) h += SIZING_GAP + heights[i + j];
        if (h > boxH) boxH = h;
      }
      if (!boxH) for (i = 0; i < count; i++) boxH += heights[i] + gaps[i];

      /* The reaction tray is absolutely positioned and hangs below its bubble,
         so no row's measured height contains it. Clipping the box at the last
         bubble's edge would cut the chips in half, so the overhang is measured
         too, from the element itself rather than from a number copied out of
         the stylesheet. */
      var rxAllow = 0;
      var rx = thread.querySelector('.msg__reactions');
      if (rx) {
        var host = rx.closest('[data-msg]');
        if (host) {
          var over = rx.getBoundingClientRect().bottom -
                     host.getBoundingClientRect().bottom;
          /* Plus headroom for the loudest bump. A chip scales to about 1.54
             at the fourth fire, which puts a quarter of its height past where
             it rests, and the box clips, so an unreserved bump would be a
             chip with its bottom sliced off at the exact moment it is meant
             to be the loudest thing on the page. */
          var head = Math.ceil(rx.getBoundingClientRect().height * 0.33);
          if (over > 0) rxAllow = Math.ceil(over) + head + 2;
        }
      }

      /* AND WHEN NOTHING IS GOING TO LEAVE, EVERYTHING HAS TO FIT. The window
         is three messages and the canvas makes room by retiring the ones that
         reach the top, which is the right answer for a sequence longer than
         the window, and no answer at all for one shorter than it. A phone gets
         two messages, so nothing above the invitation is ever going to move
         out of its way: the invitation's own height is part of the box.

         Measured rather than guessed, and measured through the same hidden
         attribute it lives behind the rest of the time. */
      if (whole()) {
        /* The inset place() parks the stack at. Less underneath than above:
           what sits at the bottom of this box is a button, and a button
           carries its own optical margin in a way a line of type does not. */
        boxH += phone() ? FLAT_PAD + FLAT_TAIL : STILL_PAD + STILL_TAIL;

        var cta = ctaEl();
        if (cta) {
          var was = cta.hasAttribute('hidden');
          if (was) cta.removeAttribute('hidden');
          var ch = cta.getBoundingClientRect().height;
          var cm = parseFloat(window.getComputedStyle(cta).marginTop) || 0;
          if (was) cta.setAttribute('hidden', '');
          ctaH = ch || ctaH;
          /* ON A PHONE IT IS NOT IN THE BOX. It follows the box in the card,
             right under the conversation, so the room it needs is its own
             margin rather than a reservation in here, and reserving for it
             anyway is exactly the hole this used to leave between the last
             message and it. */
          if (ch && phone()) { ctaGap = Math.ceil(cm); }
          else if (ch) {
            boxH += Math.ceil(ch + cm);
            /* THE CHIPS HANG INTO THE INVITATION'S OWN GAP. The tray overhangs
               the last bubble, and when the invitation follows that bubble the
               room it needs is already there. The button's top margin is the
               overhang's room. Counting both put thirty pixels of nothing at
               the foot of the box. */
            rxAllow = Math.max(0, rxAllow - Math.ceil(cm));
          }
        }
      }

      boxH += rxAllow;

      /* How far the track travels to retire each row: that row's height plus
         the gap under it, which is the NEXT row's top margin. */
      step = [];
      for (i = 0; i < count; i++) {
        step.push(heights[i] + (i + 1 < count ? gaps[i + 1] : 0));
      }

      /* The box is fixed whether or not anything is going to move in it: a
         reduced-motion visit shows the last four messages, which is the same
         four-message window, and it should occupy the same space in the
         composition as everybody else's. */
      thread.style.height = Math.ceil(boxH) + 'px';
      thread.classList.add('is-windowed');
      /* Re-evaluated on every reserve rather than set once: a window dragged
         across 720 changes the answer, and so does a rotation. */
      thread.classList.toggle('is-whole', whole());

      /* AND ON A PHONE, IN THE MIDDLE OF THE SCREEN. The box is the size of
         what it holds (two messages, their reactions and the invitation), 
         which on a phone leaves it sitting in the top two thirds with the
         whole of the rest of the screen under it. Pushed down until the
         conversation is centred on the display it is being read on, which is
         what makes the first screen a composition rather than a stack that
         happens to start at the top.

         Capped, because the point is a nudge: on a very tall screen an
         uncapped centre would put a hundred and fifty pixels of nothing
         between somebody's name and the first thing he says. */
      centreOnScreen();
      /* And the invitation to the foot of the screen, which is a question
         about where the box ended up rather than about how tall it is. */
      placeCta();

      /* ...AND THEN TAKES THE REST OF THE COLUMN. The measurement above is a
         floor, not a design: it is the tallest window of three the sequence
         produces, and it left the conversation sitting in the top half of a
         card whose middle column simply stopped while the panels either side
         ran to the bottom. The box takes that unused height, so the opening
         line lands near the middle of the card rather than near its top and
         more of the conversation is on screen at once.

         The card does not grow by a pixel: the space was already there. How
         much is available is measured by asking for it and handing back
         whatever the card grew by, which on a phone, where the column is the
         screen and there is content below the thread, comes out at nothing
         and leaves the box exactly as it was measured. */
      fillColumn();
    }

    /* How far the box is allowed to be pushed down the screen, and how far
       above the true centre it settles once it is there. */
    var CENTRE_MAX = 120;
    var CENTRE_LIFT = 44;
    /* What the invitation measures, and the gap it keeps above itself. Both
       read at reserve() time, so the composition below can be centred as one
       object rather than as a box with something hanging off it. */
    var ctaH = 0;
    var ctaGap = 0;

    /* THE INVITATION IS A SUPPORTING ACTION, NOT A DESTINATION. It sat at the
       foot of the screen for a while, which put half a screen of nothing
       between the last thing said and the way onwards, so it is back under
       the conversation, at its own margin, reading as part of it. Nothing to
       place any more; the stylesheet has the whole answer. */
    function placeCta() {
      if (mobCta) mobCta.style.marginTop = '';
    }

    function centreOnScreen() {
      if (!phone()) { thread.style.marginTop = ''; return; }
      /* Measured with the push off, so the answer is where the box WOULD sit
         rather than where the last measurement put it. */
      thread.style.marginTop = '';
      /* The box already has a margin from the stylesheet, and an inline one
         replaces it rather than adding to it, so the push is measured against
         the stylesheet's value and written back on top of it. */
      var base = parseFloat(window.getComputedStyle(thread).marginTop) || 0;
      var box = thread.getBoundingClientRect();
      var top = box.top + (window.scrollY || window.pageYOffset || 0);
      /* The invitation is under the box rather than inside it, and it is part
         of the picture being centred, otherwise the conversation sits in the
         middle of the screen with its own action hanging below the middle. */
      /* A shade above centre. Optically the conversation sits low when it is
         mathematically centred. There is a name and a portrait above it and
         nothing under it but the invitation, so the arithmetic gets a lift to
         answer for the weight at the top. */
      var want = (window.innerHeight - (box.height + ctaGap + ctaH)) / 2 - CENTRE_LIFT;
      /* It can come up as well as go down. Where the conversation is tall
         enough to fill the screen on its own there is nothing to push it into
, and the answer to "centre this" is then a small lift rather than
         nothing at all. Floored at the margin the stylesheet gives it less
         eight pixels, so the box can borrow from its own gap and never from
         the name above it. */
      var lift = -Math.max(0, base - 8);
      var push = Math.round(Math.max(lift, Math.min(CENTRE_MAX, want - top)));
      if (push) thread.style.marginTop = (base + push) + 'px';
    }

    var BOX_TAIL = 24;   /* air between the box and the card's bottom edge */
    var MIN_FILL = 40;   /* below this it is a rounding error, not a room */

    function fillColumn() {
      var card = thread.closest('.section--hero');
      /* AT THE WIDEST SIZES THAT SECTION IS NOT A BOX.

         The ultrawide layout dissolves the hero section and the hero card with
         display:contents so their tiles become items of the page's own grid, 
         and an element that generates no box measures zero, which made this
         return early and leave the conversation at its unfilled height inside
         a column with room to spare. The tile the thread actually sits in is
         the right thing to measure whenever that happens; everywhere else the
         section is a box and nothing changes. */
      if (card && !card.getBoundingClientRect().height) card = thread.parentElement;
      if (!card || !boxH) return;

      var base = Math.ceil(boxH);
      var h0 = Math.round(card.getBoundingClientRect().height);
      var room = Math.floor(card.getBoundingClientRect().bottom -
                            thread.getBoundingClientRect().bottom - BOX_TAIL);
      if (room < MIN_FILL) return;

      /* The rehearsal and the correction happen in the same frame, so nothing
         of it is ever painted. */
      thread.style.height = (base + room) + 'px';
      void thread.offsetHeight;
      var over = Math.round(card.getBoundingClientRect().height) - h0;
      if (over > 0) room -= over;

      thread.style.height = (room >= MIN_FILL ? base + room : base) + 'px';
      void thread.offsetHeight;
    }

    /* Which role the markup starts on decides how many rows are in play, and
       that has to be settled before the box is measured. */
    var startBtn = document.querySelector('[data-role][aria-selected="true"]');
    var startKey = (startBtn && startBtn.getAttribute('data-role')) || 'design';
    var startSet = ROLES[startKey] || ROLES.design;
    /* Which discipline is being talked about. The list of work under the last
       message is built for it, so it is tracked here rather than only inside
       the click handler. */
    var role = ROLES[startKey] ? startKey : 'design';
    grow(startSet.length);
    shape(startSet);
    setCount(fits(startSet));

    reserve();

    /* MEASURE AGAIN WHEN THE TYPE ARRIVES, AND MAKE SURE IT HAS.

       The first pass runs against whatever face is available at that instant,
       which on a cold visit is the fallback, and a fallback's metrics are not
       the real ones: the box ends up reserved for a stack nobody will see.
       The messages are set in a webfont, the box is measured from them, so the
       measurement waits for the font it is measuring.

       `document.fonts.ready` alone is not that wait. It settles when the loads
       that have ALREADY STARTED finish, and a face is only requested when
       something is laid out in it, so on Safari in particular it can resolve
       a frame before the face this thread is set in has been asked for at all.
       The display face is therefore requested BY NAME first, at the size and
       weight the bubbles actually compute to, and only then is `ready`
       awaited. After both, one frame is skipped so the browser has laid out in
       the real face, and the measurement is taken fresh on the next.

       Timed out rather than trusted: if a face never resolves, a conversation
       measured against the fallback is a great deal better than one that never
       measures again. */
    function displayFaces() {
      var out = [], seen = {}, i, el, cs;
      for (i = 0; i < count; i++) {
        el = rows[i].querySelector('.msg__text') || rows[i];
        cs = window.getComputedStyle(el);
        var spec = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize +
                   ' ' + cs.fontFamily;
        if (!seen[spec]) { seen[spec] = 1; out.push(spec); }
      }
      return out;
    }

    function fontsSettled() {
      if (!(document.fonts && document.fonts.ready)) return Promise.resolve();
      var waits = [];
      if (document.fonts.load) {
        var specs = displayFaces();
        for (var i = 0; i < specs.length; i++) {
          /* A face that cannot be parsed or fetched must not take the thread
             down with it. */
          try { waits.push(document.fonts.load(specs[i])); } catch (e) {}
        }
      }
      waits.push(document.fonts.ready);
      return Promise.all(waits)['catch'](function () {});
    }

    /* One re-measurement, and the track put back where the retired rows left
       it. NAMED `remeasureNow` AND NOT `settle`: there is already a settle()
       in this scope. The sequence's ending, which parks the phase on 'hold'
       and stops the clock, and a second function declaration of that name
       here would not collide loudly, it would simply be overwritten by the
       later one. Measured: the font pass was calling the ending handler and
       halting the conversation three frames after it began. Idempotent by construction: reserve() resets every row, re-reads it
       and re-pins it, so calling this twice costs a layout and changes
       nothing. It never touches the sequence (no restart, no re-arm, no
       second timer), which is what lets a rotation be handled by measuring
       again rather than by starting over. */
    function remeasureNow() {
      reserve();
      if (track) {
        track.style.transition = 'none';
        /* If the opening is still the only thing on screen, it is still the
           thing that has to be centred, and it was centred against the old
           measurement. */
        place(true);
        void track.offsetWidth;
        track.style.transition = '';
      }
    }

    var fontPass = false;
    function afterFonts() {
      if (fontPass) return;
      fontPass = true;

      var ran = false;
      function once() { if (ran) return; ran = true; remeasureNow(); }

      /* Two frames: the first is the one the new metrics land in, the second
         is the one it is safe to read them in. */
      if (window.requestAnimationFrame) {
        requestAnimationFrame(function () { requestAnimationFrame(once); });
      }
      /* AND A TIMER BEHIND THEM, BECAUSE A FRAME IS NOT PROMISED.
         requestAnimationFrame does not fire in a tab that is not being
         painted, and a link opened into a background tab (which is most of
         how anything gets opened on a phone) would sit there with the
         fallback's measurement until somebody switched to it. The timer is
         the floor under that: whichever arrives first measures, the other
         finds the work already done. */
      setTimeout(once, 250);
    }
    fontsSettled().then(afterFonts);
    /* And if a face never resolves at all, measure anyway: a conversation
       measured against the fallback beats one that never measures again. */
    setTimeout(afterFonts, 3000);

    /* AND WHAT COUNTS AS THE VIEWPORT CHANGING.

       Safari shows and hides its URL bar as you scroll. That fires `resize`
       with the height moving sixty to ninety pixels and the width untouched, 
       and since the phone box is centred against `innerHeight`, re-measuring
       on it would walk the conversation up and down the screen while somebody
       is reading it. So on a phone only a width change is a new layout: a
       rotation, a zoom, a foldable opening. Everywhere else a height change is
       still real, because the box takes the rest of its column and the column
       is as tall as the window.

       `orientationchange` is listened for separately and always acts: a few
       versions of iOS fire it before the metrics it implies have landed, so
       the width test can still be reading the old screen when it arrives. */
    var lastW = window.innerWidth, lastH = window.innerHeight;
    function viewportMoved() {
      var w = window.innerWidth, h = window.innerHeight;
      var real = (w !== lastW) || (!phone() && h !== lastH);
      lastW = w; lastH = h;
      return real;
    }

    var rt;
    function remeasure(force) {
      if (!force && !viewportMoved()) return;
      clearTimeout(rt);
      rt = setTimeout(remeasureNow, 150);
    }

    window.addEventListener('resize', function () { remeasure(false); });
    window.addEventListener('orientationchange', function () {
      /* Measured after the rotation has actually happened, not when it was
         announced. */
      lastW = 0;
      setTimeout(function () { remeasure(true); }, 120);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', function () {
        remeasure(false);
      });
    }
    /* Late images and stylesheets move the column the box sits in. One pass
       when the page is done, and no more. */
    window.addEventListener('load', function () { remeasure(true); }, { once: true });

    /* AND WHEN THE ROW ITSELF CHANGES SHAPE. Adding a reaction can wrap the
       tray onto a second line, which changes the overhang the box reserves
       under the last bubble. The module that does it says so rather than
       guessing, and this measures: the same idempotent pass a rotation
       takes, with no effect on the sequence. */
    document.addEventListener('pf:rx-changed', function () { remeasure(true); });

    thread.classList.add('is-playing');

    /* The greeting is the opening state, not something that gets announced.
       It is live on the first frame. It still balloons in, but nothing is
       "sent" before it. The indicator earns its place from the message after
       the opening, where it is anticipation rather than preamble.

       HOW MUCH IS THE OPENING. "Hello :)" and the line that says who is
       saying it are one breath, not two turns: nobody types a greeting, waits
       for the reply that is not coming, and then types their own name. So
       every row marked to arrive with the one before it lands on that same
       first frame, and the sequence starts after them. */
    function opening() {
      var n = 1;
      while (n < count && rows[n].hasAttribute('data-together')) n++;
      return n;
    }

    function openNow() {
      var n = opening();
      for (var i = 0; i < n; i++) rows[i].setAttribute('data-state', 'live');
      setTimeout(function () {
        for (var j = 0; j < n; j++) rows[j].setAttribute('data-state', 'settled');
      }, POP_MS);
      return n;
    }

    if (!still) openNow();

    var idx = opening(), retired = 0, timer = null, running = false;

    /* When the message being written now will have finished being written.
       Zero when nothing is decoding, which is every message but one. */
    var decodeEnds = 0;
    function now() {
      return (window.performance && performance.now) ? performance.now() : Date.now();
    }

    /* ---- the face changes while the words resolve -------------------------

       One message arrives as noise in somebody else's typeface and settles
       into the thread's own. The faces are stepped through on a slow clock (
       six of them across the decode, four hundred milliseconds each), because
       the point is that you can watch it happen rather than notice afterwards
       that something did.

       Every face is already loaded for the artifacts, and each sets this
       sentence to the same number of lines as the pixel face, so the bubble
       never changes height under it. The last step is no face at all: the
       inline style comes off and the stylesheet's pixel face takes over,
       which is the sentence arriving home rather than being told to. */
    /* ONE WORD AT A TIME, AND SLOWLY ENOUGH TO BE SEEN.

       The sentence is not searching for its letters, it is searching for its
       typeface, and that is only legible if you can watch it happen: a word
       tries four faces at a rate you can count, lands in Fraunces, and the
       next word starts. A whole line changing face at once was a line that
       looked like it had loaded a webfont late. A word doing it, in turn,
       reads as the sentence being set.

       The words are wrapped once and kept. The gradient spans already in the
       line are left exactly where they are, since this walks text nodes and
       replaces them in place rather than rewriting the message. */
    var SHUFFLE_STEP = 185;    /* how long one face is held */
    var SHUFFLE_TRIES = 4;     /* how many it tries before the real one */
    /* AND THE BEAT WHEN NOTHING IS BEING PERFORMED. A word hunting for a
       typeface needs as long as the hunt takes; a word that simply arrives
       needs as long as it takes to read. Four faces at 185ms is the wrong
       length for the second kind, and across a line of eight words it is six
       seconds of watching a sentence appear. */
    var WORD_BEAT = 360;
    /* The face a machine reads out of. The encrypted word does not hunt for a
       typeface at all. It holds this one until it is plaintext. */
    var CIPHER_FACE = '"JetBrains Mono", monospace';

    /* WHICH WORDS ARE THE PERFORMANCE.

       A message can name them: a run marked in the data is already a span in
       the bubble, and if a message has any, those are the words that come out
       of the noise while the rest of the sentence simply stands there. That is
       the right reading for a line whose claim is three words long. "I design
       around" is not a thing being announced, clarity, trust and performance
       are, and it is why the marks exist at all.

       With none of them marked the whole line is the performance, and every
       word is wrapped here so it can take its turn. */
    function shuffleWords(host) {
      var marked = host.querySelectorAll('.sc');
      if (marked.length) return [].slice.call(marked);

      var had = host.querySelectorAll('.sh');
      if (had.length) return [].slice.call(had);

      var nodes = [], out = [];
      (function walk(n) {
        for (var i = 0; i < n.childNodes.length; i++) {
          var c = n.childNodes[i];
          if (c.nodeType === 3) nodes.push(c);
          else if (c.nodeType === 1) walk(c);
        }
      })(host);

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var parts = node.nodeValue.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        for (var j = 0; j < parts.length; j++) {
          if (!parts[j]) continue;
          if (/^\s+$/.test(parts[j])) {
            frag.appendChild(document.createTextNode(parts[j]));
            continue;
          }
          var s = document.createElement('span');
          s.className = 'sh';
          s.textContent = parts[j];
          frag.appendChild(s);
          out.push(s);
        }
        if (node.parentNode) node.parentNode.replaceChild(frag, node);
      }
      return out;
    }

    /* THE GUIDE IS A STATIC ASSET AND A PLAIN LINK.

       Both entry points on the governance card. The inline "Download my
       guide" and the corner mark on the ultrawide layout, are ordinary
       anchors to `./slop-audit.pdf` with target="_blank". There is no
       script here any more, and that is the point: the previous version
       carried the file as a 130KB encoded href and needed JS to re-issue it
       as a blob, because Chrome on Android blocks downloads from encoded URLs
       and Safari on iOS ignores `download` on them. A real file served over
       HTTP has neither problem, opens in the browser's own PDF viewer, and
       hands the reader the native save and share controls. */

    function shuffleFaces(row) {
      var host = row.querySelector('.msg__text');
      if (!host) return null;

      var words = shuffleWords(host);
      if (!words.length) return null;

      var timers = [];

      /* If no word in the line performs, the line is a sentence being written
         rather than a sentence hunting for its face, and it gets the reading
         beat instead of the length of a shuffle. */
      var performs = false;
      for (var q = 0; q < words.length; q++) {
        if (!words[q].classList.contains('sc--plain')) { performs = true; break; }
      }
      var cycle = performs ? SHUFFLE_TRIES * SHUFFLE_STEP : WORD_BEAT;

      /* ONE BEAT BELOW THE DESKTOP WIDTH.

         A word at a time is a desktop reading: the bubble is wide, the line
         holds three or four words, and the sentence assembles across it. On a
         phone or a tablet the same line is four or five short rows, so the
         words arrive down the bubble rather than across it and the effect
         reads as stuttering rather than as writing.

         So at these widths every word takes the same beat. What is left is
         the thing the line is actually for: the whole sentence fading up, and
         the fault on the two words the claim is made of. Same markup, same
         metrics, same glitch: one clock instead of eight. */
      var oneBeat = !!(window.matchMedia &&
                       window.matchMedia('(max-width: 1023px)').matches);

      /* AND ONE LINE TAKES ONE BEAT AT EVERY WIDTH.

         The claim is a sentence, not a sequence. Assembling it word by word
         made the reader wait for the end of a thought they could already see
         the shape of, so it now fades up whole: every run on the same frame,
         one opacity, nothing else. The handwriting inside it is not part of
         this: that is how the word is written, not how it arrives.

         The line identifies itself by the written word it contains, which is
         the only thing that is true of this line and nothing else. */
      if (host.querySelector('.sc--hum')) oneBeat = true;

      /* NOTHING IS THERE BEFORE ITS TURN. The line is not a sentence being
         restyled, it is a sentence being written: noise, then a word, then
         noise, then a word. So every word starts hidden and is shown on the
         beat its own noise begins, hidden, not removed, because the space it
         will occupy is the space it already has, and a line that grows a word
         at a time re-wraps under itself six times on the way. */
      /* AND NOTHING MOVES WHILE IT HAPPENS. A word is boxed at the width it
         will end up with, measured in the face it will end up in, before any
         of this starts. Six typefaces and a column of digits do not agree on
         how wide `performance` is, and without the box every one of those
         disagreements would shove the rest of the line sideways. Measured with
         the box cleared first, so a window that has been resized re-measures
         rather than re-using last time's number. */
      /* Height as well as width: an inline-block set in Fraunces is a taller
         box than the same one set in the pixel face, and a taller box on the
         line is the line itself moving. Both dimensions held, both measured
         from the finished word. */
      /* AND ONLY A LINE THAT PERFORMS NEEDS BOXING.

         The box exists because six typefaces disagree about how wide a word
         is. A line where every word simply arrives changes face never, so the
         box buys nothing, and it costs something real: the measurement is
         taken the moment the bubble lands, which on a cold load is before the
         pixel face has finished swapping in. The fallback face measured about
         five per cent narrow, the word was then pinned to that width with
         nowrap, and the glyphs ran out over the space after them. That is
         where `human-centeredproducts` came from.

         Hidden is enough on its own: a hidden element still occupies exactly
         the space it will occupy when it is shown, so the line cannot move
         under itself as the words arrive. */
      for (var h = 0; h < words.length; h++) {
        words[h].style.width = '';
        words[h].style.height = '';
        if (performs) {
          /* getBoundingClientRect reports the PAINTED box, and the display
             face is painted through a scaleX. Writing that number back as a
             layout width would set the word 5% narrow and then paint it 5%
             narrower again, which is the compounding that produced
             `human-centeredproducts`. Divided back out, so the width pinned
             here is the one the line was actually broken at. Height is
             untouched by a horizontal scale. */
          var box = words[h].getBoundingClientRect();
          if (box.width) {
            words[h].style.width = box.width.toFixed(2) + 'px';
            words[h].style.height = box.height.toFixed(2) + 'px';
          }
        }
        words[h].style.visibility = 'hidden';
      }

      /* The overlay is attached now, before any beat, and attaching it is
         what stops the typed word painting. Doing it here rather than on the
         beat means the swap happens while the run is still hidden, so there
         is no frame on which the word is set and no frame on which it is
         neither set nor written. It draws nothing until it is told to. */
      for (var hw = 0; hw < words.length; hw++) {
        /* The written mark is retired: the phrase is set in the thread's own
           italic now, so nothing is drawn over it. Left as a no-op rather than
           deleted so the overlay machinery below stays readable if it is ever
           wanted again. */
        /* if (words[hw].classList.contains('sc--hum')) writeOn(words[hw]); */
      }

      /* ----------------------------------------------------------------
         THE WRITTEN WORD

         "human-centered" is not set, it is written. index.html holds a trace
         of an actual hand: one mask carrying the photograph of the ink, and
         one carrying ninety stroke paths in the order the hand drew them.
         Each stroke is dashed to exactly its own length and offset by the
         same amount, so it exists but has not been drawn; taking that offset
         to nothing draws it. Every stroke has its own window, measured off
         the trace, and the windows run end to end across about two-thirds of
         a second.

         THE TYPED WORD DOES NOT LEAVE. It is already transparent (the
         gradient is clipped to the glyphs and the fill is a hole), so
         removing the gradient leaves the word invisible with its box
         untouched. The handwriting is absolutely positioned inside that box.
         The line cannot move, because nothing in the line changed.

         No pen, no cursor, no caret, no hand, no marker, no particle. Ink
         appears where ink was going to be, and that is the entire effect. */

      function writeOn(sc) {
        if (!sc || sc.querySelector('.hw')) return;
        var kw = sc.querySelector('.kw');
        var tpl = document.getElementById('tpl-hw');
        if (!kw || !tpl || !tpl.content) return;

        var svg = tpl.content.firstElementChild.cloneNode(true);

        /* The clone brings the original's ids with it, and a second copy of
           an id is a mask pointing at the wrong element. Every reference is
           rewritten against a counter so any number of copies can coexist: 
           a replayed thread builds the message again from scratch. */
        var n = (HW_SEQ += 1);
        var ids = svg.querySelectorAll('[id]');
        for (var i = 0; i < ids.length; i++) {
          var was = ids[i].id, now = was + '-' + n;
          ids[i].id = now;
          var users = svg.querySelectorAll('[mask="url(#' + was + ')"], [fill="url(#' + was + ')"]');
          for (var j = 0; j < users.length; j++) {
            var el = users[j];
            if (el.getAttribute('mask') === 'url(#' + was + ')') el.setAttribute('mask', 'url(#' + now + ')');
            if (el.getAttribute('fill') === 'url(#' + was + ')') el.setAttribute('fill', 'url(#' + now + ')');
          }
        }

        /* The colour ramp lives on .kw--craft, and the overlay is the word's
           sibling rather than its child, so it has to be told which ramp it
           belongs to or every stop resolves to nothing. */
        for (var c = 0; c < kw.classList.length; c++) {
          if (kw.classList[c].indexOf('kw--') === 0) svg.classList.add(kw.classList[c]);
        }

        sc.appendChild(svg);
        sc.classList.add('is-hw');
      }

      for (var k = 0; k < words.length; k++) {
        (function (el, at) {
          var cipher = el.classList.contains('sc--enc');
          /* A plain run keeps its beat and loses its performance: it is shown
             on the frame its turn starts and that is all that happens to it, 
             no faces, no noise, no scale. */
          var bare = el.classList.contains('sc--plain');
          timers.push(setTimeout(function () {
            el.style.visibility = '';
            /* A plain run still has a moment: it comes up out of nothing
               rather than switching on. Opacity only. The box was measured
               and held above, so nothing on the line moves while it does. */
            if (bare) {
              el.classList.add(el.classList.contains('sc--gl') ? 'is-gl' : 'is-lit');
              return;
            }
            /* The scale is the scramble being SEEN, a word comes apart a size
               up and settles back down into the line as it resolves, so what
               is happening reads from across the room rather than only if you
               are watching the letters. It is a transform, so the line box
               never hears about it. */
            el.classList.add('is-noise');
            if (cipher) el.style.fontFamily = CIPHER_FACE;
          }, at * cycle));
          if (!cipher && !bare) {
            for (var f = 0; f < SHUFFLE_TRIES; f++) {
              (function (face, when) {
                timers.push(setTimeout(function () {
                  el.style.fontFamily = face;
                }, when));
              })(SHUFFLE_FACES[(at + f) % SHUFFLE_FACES.length],
                 at * cycle + f * SHUFFLE_STEP);
            }
          }
          /* And then it is simply the face the page is set in. */
          timers.push(setTimeout(function () {
            el.style.fontFamily = '';
            el.classList.remove('is-noise');
          }, at * cycle + SHUFFLE_TRIES * SHUFFLE_STEP));
        })(words[k], oneBeat ? 0 : k);
      }

      return {
        /* Which spans these were, so the decode groups by the same ones. */
        sel: words[0].classList.contains('sc') ? '.sc' : '.sh',
        /* The letters resolve on the same clock as the faces, so a word comes
           out of the noise on the beat it stops changing typeface. */
        ms: oneBeat ? (cycle + 340) : words.length * cycle,
        stop: function () {
          for (var t = 0; t < timers.length; t++) clearTimeout(timers[t]);
          for (var w = 0; w < words.length; w++) {
            words[w].style.fontFamily = '';
            words[w].style.visibility = '';
            words[w].style.width = '';
            words[w].style.height = '';
            words[w].classList.remove('is-noise');
          }
        }
      };
    }

    /* ---- the words that keep changing ------------------------------------

       Two messages carry a word that does not settle. The greeting says hello
       in the languages of the teams he has worked with; the sentence about the
       work names one quality at a time (clarity, then trust, then
       performance), rather than listing three and moving on. Each word stands
       long enough to be read, dissolves into noise, and comes back as the
       next, through the same decode the rest of the thread already had.

       A cycler is a row and a list of words, declared in the message data and
       collected by shape(); nothing here knows what any of them say. They run
       only while their row is on screen: the moment it has left through the
       top there is nothing to change, and a timer still firing behind it is
       work nobody can see. */
    /* Filled by shape(), which runs before this line does, declared without a
       value so it is not wiped on the way past. */
    var cyclers;

    function stopCycle() {
      if (!cyclers) return;
      for (var i = 0; i < cyclers.length; i++) {
        clearTimeout(cyclers[i].timer);
        cyclers[i].timer = null;
        if (cyclers[i].cancel) { cyclers[i].cancel(); cyclers[i].cancel = null; }
      }
    }

    function resetCycle() {
      stopCycle();
      if (!cyclers) return;
      for (var i = 0; i < cyclers.length; i++) {
        var c = cyclers[i];
        c.at = 0;
        var row = rows[c.i];
        var el = row && row.querySelector('.sc');
        if (el) el.textContent = c.words[0];
      }
    }

    function startCycle() {
      stopCycle();
      if (still || !cyclers) return;
      for (var i = 0; i < cyclers.length; i++) run(cyclers[i]);

      function run(c) {
        var row = rows[c.i];
        if (!row || !c.words || c.words.length < 2) return;
        var el = row.querySelector('.sc');
        if (!el) return;

        var hold = c.hold || WORD_HOLD;

        c.timer = setTimeout(function tick() {
          var state = row.getAttribute('data-state');
          /* Once the row has left the top there is nothing to change. Before
             it arrives there is nothing to change YET, which is not the same
             thing, and the difference is a message whose word cycles and one
             whose word never moves because the clock stopped while it was
             still waiting to be sent. */
          if (state === 'gone') { c.timer = null; return; }
          if (state === 'idle' || state === 'loading') {
            c.timer = setTimeout(tick, hold);
            return;
          }

          c.at = (c.at + 1) % c.words.length;
          var word = c.words[c.at];

          if (c.cancel) c.cancel();

          el.textContent = word;
          c.cancel = scramble(row, WORD_SCRAMBLE, function () { c.cancel = null; });

          c.timer = setTimeout(tick, hold + WORD_SCRAMBLE);
        }, hold);
      }
    }

    /* Where in the cycle we are. 'seq' is messages arriving; 'hold' is the
       finished thread standing with its reactions; 'reset' is the fade and the
       blank beat before it starts again. pause() clears whichever timer is
       out, and play() re-arms the same phase, so a thread that goes off
       screen halfway through the hold does not come back mid-fade. */
    var phase = 'seq';

    /* Retiring a row is two things at once and nothing else: the row it is
       losing fades, and the track slides up by exactly that row's height plus
       the gap under it. The row stays in flow while it goes, collapsing it
       would move everything a second time, and the whole point of the track is
       that everything moves once. */
    /* ---- where the track sits ------------------------------------------

       A CONVERSATION CANVAS, NOT A CHAT WINDOW. The old rule was positional:
       every message after the second pushed the stack up by exactly one row.
       That is why the box emptied out: the newest message ended up pinned to
       the top with two thirds of the card unused beneath it.

       This one is content-aware and knows nothing about how many messages
       there are. It measures what is actually on screen and asks one question:
       does the live stack still fit comfortably?

         · While it fits, the whole group is centred on a zone just below the
           middle. One message sits there alone; two sit there together,
           growing up and down around it. Nothing is pushed anywhere, because
           nothing needs the room.

         · Once it does not, the bottom parks on an anchor line low in the box
           and the top runs off the edge. The newest thing is always in the
           reading zone; the oldest ones leave through the top, which is the
           only direction left. The crossover is not a threshold anybody set:
           it is whichever of the two positions is higher.

       Every value here is a fraction of the box, and the correction is a
       delta from a measured position, so it is self-righting: whatever the
       transform was, one call puts the stack where it belongs. No index
       arithmetic, no per-message constants, and nothing to adjust when a
       seventh message is added to the array. */
    /* WHERE THE CONVERSATION SITS IN ITS BOX.

       Both numbers moved down. The greeting used to open a little above the
       middle and the finished stack used to park with a fifth of the box
       clear beneath it, which read as a conversation that had been pushed up
       out of the way before it had said anything. Opening lower gives the
       first line somewhere to be (and gives the four that follow somewhere
       to come from), while the anchor takes the rest of the slack at the
       bottom without pushing the invitation into the edge: CTA_FLOOR is what
       stops that, and it is measured rather than assumed. */
    var ZONE = 0.63;     /* where a comfortable stack is centred */
    var ANCHOR = 0.845;  /* where a tall stack's bottom parks */
    /* The last line the invitation may reach before the stack has to yield.
       Not 1: a button flush against the bottom edge of the box reads as
       clipped even when it is whole. */
    var CTA_FLOOR = 0.98;
    /* And where a stack that never has to move sits: a fixed inset from the
       top of the box, above and below. Only used when the whole conversation
       fits: see place(). */
    /* THE PHONE'S OWN COMPOSITION. Same conversation, written the same way. The
     indicator, the sequence and the reactions are all as they are anywhere
     else. What differs at this width is the room around it and which button
     ends it: see FLAT_PAD below, and ctaEl(). */
  function phone() { return !still && narrow.matches; }

  /* WHEN NOTHING IS EVER GOING TO LEAVE. A set shorter than the window has
     nothing to retire by definition; a phone has nothing to retire by
     decision, because at that width the box is the whole first screen and a
     message sliding out of the top of it is a message somebody has to scroll
     back up to nothing to find. Both get the same treatment: a box the height
     of everything in it, and a stack parked at one inset from the first frame
     to the last. */
  function whole() { return count < VISIBLE || phone(); }
  /* The four insets this used to declare are stated at the top of this file
     now, reserve() runs long before execution reaches this line, and a `var`
     read before its assignment is `undefined`. See THE INSETS THE BOX PARKS
     ITS STACK AT. */

    var offsetY = 0;
    var cancelScramble = null;

    /* The live content, in the track's own coordinates. Layout offsets, not
       rendered rectangles: `offsetTop` is where a thing sits before any
       transform is applied, so a measurement taken mid-transition is the same
       measurement taken at rest. That is what lets this be called five times
       in half a second (once per project row arriving), and land on one
       answer instead of five compounding corrections. */
    /* A transformed element is its own containing block, so once the track has
       a transform its children measure from IT rather than from whatever the
       page's nearest positioned ancestor happens to be. Both cases have to be
       handled, because the first measurement is taken before the first
       transform exists. */
    function trackBase() {
      return (rows[0] && rows[0].offsetParent === track) ? 0 : track.offsetTop;
    }

    function liveSpan() {
      var base = trackBase(), top = null, bottom = null, i;
      for (i = 0; i < count; i++) {
        var st = rows[i].getAttribute('data-state');
        if (st !== 'live' && st !== 'settled' && st !== 'loading') continue;
        var t = rows[i].offsetTop - base;
        if (top === null) top = t;
        bottom = t + rows[i].offsetHeight;
      }
      if (top === null) return null;
      if (plist && !plist.hasAttribute('hidden') && plist.offsetHeight) {
        bottom = plist.offsetTop - base + plist.offsetHeight;
      }
      /* THE INVITATION IS MEASURED, BUT IT IS NOT PART OF THE STACK.

         It used to be folded straight into the span, which made the whole
         conversation eighty pixels taller the instant it appeared, so every
         message shoved upwards to make room for a button arriving underneath
         them. Nothing was said, nothing was added to the thread, and the
         thread moved. It is reported separately now: place() positions the
         messages without it and only looks at this to check the invitation
         still fits in the box. */
      var ctaBottom = null;
      if (ctaRow && !ctaRow.hasAttribute('hidden') && ctaRow.offsetHeight) {
        ctaBottom = ctaRow.offsetTop - base + ctaRow.offsetHeight;
      }
      return { top: top, bottom: bottom, h: bottom - top, ctaBottom: ctaBottom };
    }

    function place(instant) {
      if (!track) return;
      var s = liveSpan();
      if (!s) return;
      var H = thread.clientHeight;
      if (!H) return;

      /* One rule, not two branches: centre the stack on the zone, and never
         let its bottom fall past the anchor. A short stack is centred, because
         centred is the higher of the two; a tall one parks on the anchor and
         runs off the top, because that is. The crossover happens on its own,
         at whatever height the content reaches it, which is what makes this
         work for four messages, or ten, or four and a project list. */
      /* The list is the finale, and it is sized to fill the box: when it is
         on screen it parks nearly flush with the bottom, so the five projects
         occupy the whole viewport and the conversation above them has left
         through the top. Every other state uses the reading anchor. */
      var floor = (plist && !plist.hasAttribute('hidden')) ? 0.965 : ANCHOR;
      var wantTop = Math.min(H * ZONE - s.h / 2, H * floor - s.h);

      /* A CONVERSATION THAT FITS ITS BOX DOES NOT MOVE IN IT.

         The two rules above are both about a stack taller than the box: centre
         it while it is short, park its bottom on the anchor once it is not.
         Applied to a phone. Where the whole thread is two messages, their
         reactions and the invitation, and the box has been reserved for all of
         it. They made the messages jump 36px the moment the invitation
         appeared, because the span it belongs to got taller and the answer
         moved with it.

         So when nothing will ever have to leave, the stack is simply parked:
         one fixed inset from the top of the box, from the first frame to the
         last. The room under the invitation is reserved whether the invitation
         is there yet or not, which is what makes the arrival a fade rather
         than a shove. */
      if (whole()) wantTop = phone() ? FLAT_PAD : STILL_PAD;

      /* THE INVITATION FITS IN THE ROOM THAT IS ALREADY THERE.

         The stack parks its bottom at the anchor, which leaves the last fifth
         of the box empty on purpose. That is where the invitation goes. So
         its arrival costs the conversation nothing: the messages stay exactly
         where they were and the button fades in underneath them.

         The clamp is the safety net, not the plan. If a longer label or a
         narrower card ever wrapped the invitation onto a second line and it
         genuinely could not fit, the stack gives up only the pixels needed to
         bring it back inside, not the whole height of the row. */
      if (s.ctaBottom !== null) {
        var over = (s.ctaBottom - s.top + wantTop) - H * CTA_FLOOR;
        if (over > 0) wantTop -= over;
      }

      /* Absolute, not incremental. Whatever the track was doing, this is where
         it belongs. */
      offsetY = Math.round(wantTop - s.top);

      if (instant) {
        track.style.transition = 'none';
        track.style.transform = 'translateY(' + offsetY + 'px)';
        void track.offsetWidth;
        track.style.transition = '';
      } else {
        track.style.transform = 'translateY(' + offsetY + 'px)';
      }

      /* Anything whose resting place is entirely above the box stops painting.
         Judged on where it is going, not on where the transition currently has
         it, so nothing is retired early by being measured mid-flight. */
      for (var j = 0; j < count; j++) {
        var rt = rows[j].offsetTop - trackBase() + offsetY;
        if (rt + rows[j].offsetHeight < 2) {
          rows[j].setAttribute('data-state', 'gone');
          retired = j + 1;
        }
      }
    }

    /* The opening state: the first message, in the zone, before anything
       moves. Same function, no special case. */
    function centreOpening() {
      if (!track) return;
      offsetY = 0;
      place(true);
    }

    /* ---- the projects, at the end of the sentence ------------------------

       The conversation finishes by handing over the work. The list is not a
       second copy of the portfolio's data: it is read off the project cards
       in the page, name and destination both, so it cannot drift out of sync
       with them. Rename a project on its card and this renames itself; add a
       card and a row appears; remove one and it goes. Nothing here knows what
       any project is called.

       Name comes from the card's eyebrow rather than its headline. The
       eyebrow is where the project is named, the headline is what it did. */
    var plist = null;

    /* THE LIST IS THE WORK FOR THE DISCIPLINE BEING TALKED ABOUT.

       The conversation changes with the role selector and so does the browser
       beside it, so a list of design case studies under a conversation about
       drawing would name five things the browser cannot show. Design reads
       its rows from the work section, where the case studies live with their
       real links; the other disciplines read theirs from the browser's own
       slides for that mode, which is where those pieces exist. Either way the
       list and the browser are naming the same set, which is what makes
       pointing at a row work at all.

       Built per role and thrown away when the role changes. Five rows are
       cheap, and a stale list is not. */
    /* THE LIST RUNS IN THE BROWSER'S ORDER, BECAUSE IT IS THE SAME WALK.

       Both surfaces name the same six projects, and until now they named them
       in two different sequences: the rows came off the cards in #work, in the
       order those cards happen to sit in the document, while the browser runs
       in the order authored on the slides as data-rank. So a reader moving
       down the list was not moving across the grid (items four and five
       traded places), and on ultrawide, where pointing at a row sharpens the
       card it names, that showed as the preview jumping backwards.

       This does not reorder the cards and does not carry a sequence of its
       own. It asks each slide what number it is and puts the rows in that
       order, matching on the same names js/projects.js and js/peek.js match
       on: whatever a slide answers to, a row with that name is that slide's
       row. A row with no slide behind it keeps its place at the end rather
       than being dropped or sorted to the front.

       One consequence worth stating: the sequence lives on the slides now, so
       renumbering one moves it in the grid AND in the list, together. There is
       nothing here to keep in step by hand. */
    function browserRanks() {
      var map = {}, sl = document.querySelectorAll('.pv__slide[data-mode="design"][data-rank]');
      for (var i = 0; i < sl.length; i++) {
        var r = parseInt(sl[i].getAttribute('data-rank'), 10);
        if (!(r > 0)) continue;
        var names = [], t = sl[i].querySelector('.pv__title'),
            given = sl[i].getAttribute('data-pv-name'),
            lab = sl[i].getAttribute('aria-label');
        if (given) names.push(given);
        if (t && t.textContent) names.push(t.textContent);
        if (lab) names.push(lab);
        for (var j = 0; j < names.length; j++) {
          var k = names[j].trim().toLowerCase();
          if (k && !(k in map)) map[k] = r;
        }
      }
      return map;
    }

    function inBrowserOrder(rows) {
      var map = browserRanks(), i;
      if (!rows.length) return rows;

      /* Unranked rows sort after every ranked one, in the order they arrived;
         the index tiebreak keeps equal ranks stable in engines whose sort is
         not. */
      var tagged = [];
      for (i = 0; i < rows.length; i++) {
        var r = map[String(rows[i].name).trim().toLowerCase()];
        tagged.push({ row: rows[i], rank: (r > 0) ? r : Infinity, at: i });
      }
      tagged.sort(function (a, b) { return (a.rank - b.rank) || (a.at - b.at); });

      var out = [];
      for (i = 0; i < tagged.length; i++) out.push(tagged[i].row);
      return out;
    }

    /* ONE SOURCE: THE BROWSER'S OWN SLIDES, FOR EVERY ROLE.

       Design used to be the exception here, reading its rows off the bento
       cards in #work while the other two roles read the browser. That was the
       last place two lists of the same projects existed independently, and it
       had two costs. It put the rows in the cards' document order rather than
       the browser's, which is the bug the previous pass had to sort back out.
       And it meant the list could only name a project that has a bento card, 
       so a project that lives in the browser and nowhere else could not appear
       in the list at all, whatever the browser did with it.

       Reading the slides fixes both at the source. The names are the same
       strings either way (the cards and the slides quote one title), the
       destinations are the same routes, and the walk is now literally the
       browser's walk. Nothing about the rows themselves changes.

       WHAT data-off-list IS FOR. One slide is deliberately not a row: the
       Missing Information closer, which the ultrawide layout replaces with the
       Off the Clock card and which has never been in this list. It was absent
       before by accident (it simply had no bento card), and an accident is a
       poor thing to depend on, so it says so now. */
    function projectSource(key) {
      var out = [], i;
      var slides = document.querySelectorAll(
        '.pv__slide[data-mode="' + key + '"]:not([data-off-list])');

      for (i = 0; i < slides.length; i++) {
        var t = slides[i].querySelector('.pv__title');
        var nm = t ? t.textContent.trim() : '';
        if (!nm) continue;

        /* NO DESTINATION IS THE MARKER, not an attribute saying so.

           A slide for a project with nothing written yet is stripped on boot
           by js/wire.js: href, data-href and data-placeholder-link all go, so
           that nothing on the page offers a tap that leads nowhere. Which
           means a marker put on the slide by hand is gone by the time this
           runs. What survives is the absence itself: no data-href is exactly
           the condition, and reading it keeps the row's behaviour tied to the
           project's real status rather than to a second attribute somebody has
           to remember to set. The row is still a row (same type, same styling,
           focusable and readable) it just does not travel. */
        var href = slides[i].getAttribute('data-href');
        out.push({ name: nm, href: href || '#',
                   placeholder: !href || slides[i].hasAttribute('data-placeholder-link') });
      }
      return inBrowserOrder(out);
    }

    function buildProjects() {
      if (plist) return plist;
      var items = projectSource(role);
      if (!items.length) return null;

      plist = document.createElement('span');
      plist.className = 'plist';
      plist.setAttribute('hidden', '');

      for (var i = 0; i < items.length; i++) {
        var row = document.createElement('a');
        row.className = 'plist__row';
        row.setAttribute('href', items[i].href);
        if (items[i].placeholder) row.setAttribute('data-placeholder-link', '');
        /* The name sits inside a slot of a fixed height so it can grow on
           hover without the row growing with it. */
        row.innerHTML = '<span class="plist__name"><span class="plist__word"></span></span>' +
                        '<span class="plist__go" aria-hidden="true">\u2192</span>';
        row.querySelector('.plist__word').textContent = items[i].name;
        wire(row, items[i].name);
        plist.appendChild(row);
      }

      if (!plist.children.length) { plist = null; return null; }
      track.appendChild(plist);
      return plist;
    }

    /* A role change invalidates the list outright: different work, different
       rows. It is removed rather than emptied, so nothing of the old set is
       left in the accessibility tree either. */
    function dropProjects() {
      armed = null;
      /* The whole view goes, not just the rows inside it: it was built around
         this role's list and there is nothing in it worth keeping. */
      if (view && view.parentNode) view.parentNode.removeChild(view);
      else if (plist && plist.parentNode) plist.parentNode.removeChild(plist);
      view = null;
      backRow = null;
      plist = null;
    }

    /* Pointing at a name brings that project up in the browser beside the
       conversation. Announced rather than called: js/projects.js listens for
       it and answers with its own `show()`, so the transition is the browser's
       existing one and neither file has to know the other exists.

       Keyboard gets the same thing on focus. Nothing happens on the way out. 
       The browser keeps whatever was asked for last, which is what its arrows
       and its swipe already do.

       WITHOUT HOVER, THE FIRST TAP IS THE LOOK. On a touch screen a row that
       is not the one showing takes the tap to bring it up; tapping the same
       row again follows the link, which is the browser's own CTA behaviour
       arrived at from the other side. A pointer that can hover never sees
       this: the link is a link on the first click. */
    function announce(name) {
      try {
        document.dispatchEvent(new CustomEvent('pf:project', { detail: { name: name } }));
      } catch (err) { /* no CustomEvent: the row is still a link */ }
    }

    var armed = null;

    function wire(row, name) {
      row.addEventListener('pointerenter', function () { announce(name); });
      row.addEventListener('focus', function () { announce(name); });

      row.addEventListener('click', function (e) {
        var noHover = window.matchMedia &&
                      window.matchMedia('(hover: none)').matches;
        if (!noHover || armed === row) return;   /* follow the link */
        e.preventDefault();
        armed = row;
        announce(name);
      });
    }

    /* Revealed a row at a time, on the same easing as everything else, and
       the canvas re-balances as it grows, so the list fills the space under
       the last message instead of the message being shoved up to make way. */
    /* ---- from the conversation to the work --------------------------------

       The list used to arrive underneath the last message, which made the end
       of the conversation a page that kept growing. It is a different thing
       to look at, so it is now a different view of the same box: the
       conversation ends with an invitation, and taking it swaps what the
       viewport is showing. Nothing outside the box moves for any of it. This
       is one rectangle showing two things, not a page changing size.

       The invitation is a button under the last message, which is where the
       reader's eye already is when the reactions have finished. */
    /* WHICH INVITATION, AND WHERE IT LIVES.

       On a wide screen the thread's own button opens the work as a view inside
       the conversation, and the page's own "View key industry projects" link is
       not shown at all. On a phone it is the other way round: the work is a
       section further down the page rather than a view, so the page's link IS
       the invitation, and it belongs inside the box with the messages rather
       than under it, because the box is what somebody is looking at.

       Moved rather than copied. There is one link to the work at this width,
       in the accessibility tree as much as on screen, and above the breakpoint
       it goes back to being display:none wherever it happens to be sitting. */
    var mobCta = null;

    function ctaEl() {
      /* Looked up on the first ask rather than at the top of init: reserve()
         runs before this line does, and a var that is still undefined when the
         box is measured is a box measured around the wrong button. */
      if (!mobCta) mobCta = document.querySelector('.hero__mobile-cta');
      if (phone() && mobCta) {
        /* NOT INSIDE THE BOX ANY MORE. At this width the invitation belongs at
           the foot of the SCREEN rather than at the foot of the conversation (
           a scroll cue where a thumb already is), and the box clips whatever
           leaves it. So it stays where the markup put it, ordered to follow
           the thread and pushed down to the bottom edge by placeCta(). The
           room it used to take inside the box is kept anyway, so nothing above
           it moves on the way out.

           Put away on first sight: it is a link in the markup, on all the time,
           and here it waits for the end of the thread like the thread's own
           invitation does. */
        if (!mobCta.hasAttribute('data-th-cta')) {
          mobCta.setAttribute('data-th-cta', '');
          mobCta.setAttribute('hidden', '');
        }
        return mobCta;
      }
      return buildCta();
    }

    function buildCta() {
      if (ctaRow) return ctaRow;
      ctaRow = document.createElement('span');
      ctaRow.className = 'msg-cta';
      ctaRow.setAttribute('hidden', '');
      ctaRow.innerHTML = '<button type="button" class="msg-cta__btn">' +
                         'See the work <span aria-hidden="true">\u2192</span></button>';
      ctaRow.querySelector('button').addEventListener('click', openList);
      track.appendChild(ctaRow);
      return ctaRow;
    }

    function showCta() {
      var el = ctaEl();
      emit('pf:cta', idx);
      el.removeAttribute('hidden');
      /* One more thing in the flow, so the canvas answers for it. */
      place();
      requestAnimationFrame(function () { el.classList.add('is-in'); });
    }

    /* Both of them, whichever is in play: a window dragged across the
       breakpoint has to put away the one the other width was using. */
    function hideCta() {
      if (ctaRow) {
        ctaRow.classList.remove('is-in');
        ctaRow.setAttribute('hidden', '');
      }
      if (mobCta) {
        mobCta.classList.remove('is-in');
        mobCta.setAttribute('hidden', '');
      }
    }

    /* The list view: the work, and a way back to the conversation. Built once
       per role, around whatever list the role produced. */
    function buildView() {
      var list = buildProjects();
      if (!list) return null;
      if (view && view.contains(list)) return view;

      view = document.createElement('span');
      view.className = 'plist-view';

      backRow = document.createElement('span');
      backRow.className = 'plist-view__nav';
      backRow.innerHTML = '<button type="button" class="plist-view__back">' +
                          '<span aria-hidden="true">\u2190</span> Back</button>';
      backRow.querySelector('button').addEventListener('click', function () {
        /* Back is back to the beginning, not back to where it left off: the
           conversation is a sequence, and dropping somebody into the middle
           of one is worse than starting it. */
        closeList(!still);
      });

      view.appendChild(backRow);
      view.appendChild(list);
      track.appendChild(view);
      return view;
    }

    function openList() {
      var v = buildView();
      if (!v) return;

      phase = 'list';
      clearTimeout(timer);
      running = false;
      if (cancelScramble) { cancelScramble(); cancelScramble = null; }

      plist.removeAttribute('hidden');
      plist.style.minHeight = '';
      hideCta();

      /* The box shows one thing now, from its own top: no transform, and the
         only offset is enough clearance for the dissolve to have nothing but
         air to work on. */
      thread.classList.add('is-list');
      thread.style.paddingTop = topClear() + 'px';
      if (track) {
        track.style.transition = 'none';
        track.style.transform = 'translateY(0)';
        void track.offsetWidth;
        track.style.transition = '';
      }

      var kids = plist.children, i;
      for (i = 0; i < kids.length; i++) kids[i].classList.remove('is-in');
      if (still) {
        for (i = 0; i < kids.length; i++) kids[i].classList.add('is-in');
        return;
      }
      for (i = 0; i < kids.length; i++) {
        (function (el, n) {
          setTimeout(function () { el.classList.add('is-in'); }, 70 * n);
        })(kids[i], i);
      }
    }

    /* How far below the top edge the view has to start so that nothing in it
       is ever inside the dissolve. The depth of the fade is a fraction of the
       box, declared in the stylesheet and read from it, so the two cannot
       drift apart. */
    function topClear() {
      var stop = parseFloat(
        window.getComputedStyle(thread).getPropertyValue('--fade-stop')) || 9;
      return Math.ceil(thread.clientHeight * stop / 100) + 10;
    }

    function exitList() {
      thread.classList.remove('is-list');
      thread.style.paddingTop = '';
      hideProjects();
    }

    function closeList(replay) {
      if (phase !== 'list') return;
      exitList();
      if (replay) { restart(); return; }
      /* Reduced motion has nothing to play: put the finished conversation
         back, with its invitation. */
      for (var i = 0; i < count; i++) rows[i].setAttribute('data-state', 'settled');
      showCta();
      place(true);
      phase = 'hold';
    }

    function hideProjects() {
      if (!plist) return;
      armed = null;
      plist.setAttribute('hidden', '');
      for (var i = 0; i < plist.children.length; i++) {
        plist.children[i].classList.remove('is-in');
      }
    }

    /* ---- role switching -------------------------------------------------

       Swapping a discipline rewrites the two message bodies and replays the
       sequence from the second message: the greeting is already on screen and
       re-typing it would be a stutter, not a transition. */
    var roleBtns = document.querySelectorAll('[data-role]');

    function setRole(key, replay) {
      var set = ROLES[key];
      if (!set) return;
      role = key;
      /* Whatever was still changing a word belonged to the discipline being
         left: stop it before shape() replaces the list it was reading, or the
         old timer keeps dissolving a sentence that is no longer there. */
      stopCycle();
      /* The old discipline's work goes with it, view and all. */
      exitList();
      hideCta();
      dropProjects();
      for (var i = 0; i < roleBtns.length; i++) {
        /* `aria-current` since the selector stopped being a tablist. Only
           Product carries a data-role at all now: the other two leave the
           page and never come through here. */
        roleBtns[i].setAttribute('aria-current',
          roleBtns[i].getAttribute('data-role') === key ? 'true' : 'false');
      }
      grow(set.length);
      shape(set);
      setCount(fits(set));
      for (i = 0; i < count; i++) {
        var t = rows[i].querySelector('.msg__text');
        if (t) t.innerHTML = render(set[i]);
      }
      readable.textContent = thread.textContent.replace(/\s+/g, ' ').trim();

      /* The discipline is a page-level choice, not a thread-level one: the
         project browser shows a different set of work for each. Announced
         rather than called, so neither file has to know the other exists. */
      try {
        document.dispatchEvent(new CustomEvent('pf:role', { detail: { role: key } }));
      } catch (err) { /* no CustomEvent: the thread still switches */ }

      if (!replay) return;

      pause();
      if (cancelScramble) { cancelScramble(); cancelScramble = null; }
      resetCycle();
      thread.removeAttribute('data-reactions');
      resetReactions();
      /* A switch is a cut, so the opening is simply already there: all of
         it, greeting and introduction both, exactly as a fresh visit finds
         them a moment after landing. */
      var open = opening();
      for (i = 0; i < rows.length; i++) {
        rows[i].setAttribute('data-state', i < open ? 'settled' : 'idle');
      }
      phase = 'seq';
      retired = 0;
      reserve();
      /* Back to the opening state, with no animation: this is a cut, not a
         scroll. Centred the way a fresh visit is, since that is what this is: 
         the same conversation, on a different subject, from the top. */
      if (track) {
        track.style.transition = 'none';
        centreOpening();
        void track.offsetWidth;
        track.style.transition = '';
      }
      idx = open;
      play();
    }

    for (var r = 0; r < roleBtns.length; r++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          setRole(btn.getAttribute('data-role'), !still);
        });
      })(roleBtns[r]);
    }

    /* A window dragged across the breakpoint gets the set that width is owed,
       from the top. The alternative is a thread halfway through a message
       that this width does not have. Only on the crossing, not on every pixel
       of a resize: the query fires once, when the answer changes. */
    (function (mq) {
      if (!mq) return;
      function again() { setRole(role, !still); }
      if (mq.addEventListener) mq.addEventListener('change', again);
      else if (mq.addListener) mq.addListener(again);
    })(narrow);

    /* ---- play it again ----------------------------------------------------

       The conversation loops on its own, but a visitor who arrives halfway
       through it, or who wants a line back that has just left the top, should
       not have to wait out a cycle. The button starts the current discipline
       over from Hello. The same reset the loop uses, so there is one way for
       this thread to begin and the tenth replay looks like the first.

       It only exists where it can work: hidden in the markup, shown here, and
       left hidden entirely when motion is off, since nothing would play. */
    var replayBtn = document.querySelector('[data-replay]');
    if (replayBtn && !still) {
      replayBtn.removeAttribute('hidden');
      replayBtn.addEventListener('click', function () {
        pause();
        if (cancelScramble) { cancelScramble(); cancelScramble = null; }
        restart();
      });
    }

    /* ---- reactions ------------------------------------------------------

       A tap toggles the reaction and gives it one short press. No picker, no
       menu. Three chips that respond, which is the whole interaction. */
    var chips = thread.querySelectorAll('.rx');

    function resetReactions() {
      for (var i = 0; i < chips.length; i++) {
        chips[i].classList.remove('is-on', 'is-in', 'is-bump');
        chips[i].style.removeProperty('--rx-peak');
        chips[i].style.removeProperty('--rx-bump-ms');
        chips[i].setAttribute('aria-pressed', 'false');
        var n = chips[i].querySelector('.rx__n');
        if (n) n.textContent = '';
      }
    }

    /* ---- the burst ------------------------------------------------------

       Six chips, one at a time, in an order that tells a small story: the fire
       lands first and climbs to four as more people hit the same one, and the
       rest arrive around it. It is the same chip counting up rather than four
       fire chips, which is what a reaction bar actually does.

       Every chip is already in the DOM at full size and only its opacity and
       scale change, so the tray never grows and the box that was measured
       before any of this ran is still the right box. */
    /* [chip, count, how long before the next step, how far the chip scales].

       The fourth number is the whole rhythm. The fire lands, takes a beat and
       swells once on its own (somebody reacted), and then climbs, and every
       climb is bigger than the last: 1.24, 1.32, 1.40, and 1.54 on the fourth,
       which is held a little longer than the rest. Anything else that
       increments moves the same way at 1.18, because it is the same event
       happening with less force behind it.

       A step with no fourth number is an arrival, and an arrival is the scale
       transition rather than the bump, never both on one frame, since they
       animate the same property. */
    var RX_PLAN = [
      ['fire', '1', 320],
      ['fire', '1', 470, 1.24, 460],
      ['fire', '2', 500, 1.32, 480],
      ['fire', '3', 520, 1.40, 500],
      ['fire', '4', 640, 1.54, 560],
      /* The row is three chips now. The steps for the other three are gone
         rather than left pointing at markup that is not there. Every reader
         of this table looks its chip up by data-rx and then reads a property
         off it, so a step with no chip is a null dereference, not a no-op. The
         three that remain keep their own numbers exactly. */
      ['clap', '1', 210], ['hundred', '1', 210],
      ['clap', '2', 420, 1.18, 440]
    ];

    /* All of it, on one frame. Same states burst() ends at, set rather than
       played: the chips go to their final counts together and the invitation
       is shown on the same tick, so the three of them read as one arrival. */
    function landTogether() {
      thread.setAttribute('data-reactions', 'on');
      resetReactions();
      for (var i = 0; i < RX_PLAN.length; i++) {
        var chip = thread.querySelector('.rx[data-rx="' + RX_PLAN[i][0] + '"]');
        if (!chip) continue;
        chip.classList.add('is-in', 'is-on');
        chip.setAttribute('aria-pressed', 'true');
        var n = chip.querySelector('.rx__n');
        if (n) n.textContent = RX_PLAN[i][1];
      }
      showCta();
    }

    function burst() {
      thread.setAttribute('data-reactions', 'on');
      resetReactions();

      var k = 0;
      (function nextRx() {
        if (k >= RX_PLAN.length) {
          running = false;

          /* The chips have finished. Nothing happens for a beat. This is the
             end of what he has to say, with the reactions to it sitting under
             it, and it is allowed to be looked at before the conversation
             turns into a menu.

             The phase stays 'react' through the whole tail, because burst()
             sets absolute states and replays cleanly from the top: a thread
             that goes off screen in the middle of this and comes back gets
             the ending again rather than a half-built one. */
          timer = setTimeout(function () {
            /* And then the invitation, under the last thing said. The work
               itself is a view away, not a list that grows out of the bottom
               of the conversation. */
            showCta();
            timer = setTimeout(settle, 520);
          }, PROJECTS_MS);
          return;
        }
        var item = RX_PLAN[k++];
        var chip = thread.querySelector('.rx[data-rx="' + item[0] + '"]');
        if (chip) {
          var first = !chip.classList.contains('is-in');
          chip.classList.add('is-in', 'is-on');
          chip.setAttribute('aria-pressed', 'true');
          var n = chip.querySelector('.rx__n');
          if (n) n.textContent = item[1];
          /* The arrival is the scale transition; anything after it is a bump,
             at whatever strength this step asks for. Never both on the same
             frame. They animate the same property and would fight. */
          if (!first && item[3]) {
            chip.style.setProperty('--rx-peak', item[3]);
            chip.style.setProperty('--rx-bump-ms', (item[4] || 460) + 'ms');
            chip.classList.remove('is-bump');
            void chip.offsetWidth;
            chip.classList.add('is-bump');
          }
        }
        timer = setTimeout(nextRx, item[2]);
      })();
    }

    for (var c = 0; c < chips.length; c++) {
      (function (chip) {
        chip.setAttribute('aria-pressed', 'false');
        chip.addEventListener('click', function () {
          /* THE PHONE HAS ITS OWN ANSWER FOR THIS CHIP. Below 720 the row is
             a control rather than a picture of one, counts go up from the
             base the sequence left rather than to a bare 1, a fourth chip
             opens a picker, and chips that were added can be taken away. All
             of that lives in the reactions module at the foot of this file;
             this handler is the pointer behaviour and it stays exactly what
             it was. Guarded here rather than by not binding, because the
             breakpoint can be crossed by dragging a window. */
          if (window.matchMedia &&
              window.matchMedia('(max-width: 719px)').matches) return;
          var on = !chip.classList.contains('is-on');
          chip.classList.toggle('is-on', on);
          chip.setAttribute('aria-pressed', on ? 'true' : 'false');
          var n = chip.querySelector('.rx__n');
          if (n) n.textContent = on ? '1' : '';
          chip.classList.remove('is-tapped');
          /* Reading offsetWidth restarts the animation; it is one read on a
             click, not in a loop. */
          void chip.offsetWidth;
          chip.classList.add('is-tapped');
        });
      })(chips[c]);
    }

    function next() {
      if (idx >= count) { running = false; return; }

      /* Nothing is retired on a count any more: the canvas makes room when
         the room is needed and not before. The indicator appears first, the
         stack settles around it, and then the message is written. */
      timer = setTimeout(function () {
        rows[idx].setAttribute('data-state', 'loading');
        place();
        timer = setTimeout(function () {
            var row = rows[idx];
          row.setAttribute('data-state', 'live');
          idx++;

          /* THE PAGE IS LISTENING. The composition around the conversation
             assembles as the conversation happens (see js/reveal.js), so
             each message announces itself and the reveal decides what that
             means. The thread does not know what is out there and must not:
             one event, an index, and nothing else. */
          emit('pf:msg', idx - 1);

          /* ON A PHONE THE ENDING ARRIVES WITH THE MESSAGE THAT ENDS IT. On a
             wide screen the last line lands, the chips answer it one at a
             time, and the invitation follows a beat after that. A small
             performance, and there is room for it. At this width the three of
             them are one moment: the sentence about the work, the reaction to
             it and the way onwards, on the same frame. Everything below the
             fold is already waiting; making somebody watch six seconds of
             punctuation before the button exists is the page performing at
             them rather than for them. */
          if (phone() && idx >= count) landTogether();

          /* A row can ask to arrive out of noise. The decode runs inside the
             bubble that has already landed. The arrival animation is
             untouched, and so is everything after it. */
          if (!still && row.hasAttribute('data-scramble')) {
            if (cancelScramble) cancelScramble();
            var shuffling = row.hasAttribute('data-shuffle');
            var faces = shuffling ? shuffleFaces(row) : null;
            /* When this line will have finished arriving. The ending waits for
               it: a message that takes two seconds to write itself must not
               have reactions landing on it while its last word is still
               coming out of the noise. */
            decodeEnds = now() + (faces ? faces.ms : SCRAMBLE_MS);
            cancelScramble = scramble(row, faces ? faces.ms : SCRAMBLE_MS,
              function () {
                if (faces) faces.stop();
                cancelScramble = null;
              }, false, faces && faces.sel);
          }
          /* The bubble is its full size now, so the canvas balances again. */
          place();

          /* THE BOX KEEPS CLIPPING, and it can afford to now. It used to open
             at the last message so the reaction chips would not be cut in
             half, but that was when the stack's position came from a
             measurement that could be wrong. The canvas parks the content
             with a fifth of the box still clear beneath it, which is more
             room than the chips need, so nothing has to be let out of the
             box to be whole. And nothing can escape it: not a row on its way
             out of the top, not a project row arriving at the bottom. */
        /* The arrival is allowed to finish before anything else happens: the
           `settled` state only drops the compositor hint, and the next
           indicator waits out the full gap after that. */
          timer = setTimeout(function () {
            row.setAttribute('data-state', 'settled');
            /* Already ended, on the frame it arrived. Straight to the hold,
               which is what the loop waits out. */
            if (idx >= count && phone()) { settle(); return; }
            if (idx >= count) { ending(); return; }
            timer = setTimeout(next, gapAfter(idx - 1));
          }, POP_MS);
        }, dotsMs());
      }, 0);
    }

    /* ---- the ending -------------------------------------------------------

       The box is never handed over. It plays, it holds the ending for as long
       as the hold lasts, and it starts again: nothing in here scrolls, nothing
       waits to be driven, and nothing survives a reload. A visit always opens
       on Hello. Everything is autoplay. */
    function settle() {
      phase = 'hold';
      clearTimeout(timer);
      running = false;

      /* The hold is the last thing the sequence does, so it is armed the same
         way every other wait is: through arm(), which is what a thread coming
         back on screen re-arms too. */
      arm();
    }

    /* ---- the loop --------------------------------------------------------

       An introduction that plays once is an introduction most people miss, so
       it comes round again, but a loop is only bearable if it reads as the
       same conversation starting over rather than as something buffering. So
       the finished thread stands for four seconds with its reactions, the
       whole stack dims out together in one movement rather than each bubble
       leaving on its own, there is an empty beat, and then Hello is simply
       there again. Nothing rewinds, nothing scrolls backwards, and the pacing
       is identical on the tenth cycle and the first.

       The box never changes size through any of it: the fade is opacity, the
       reset is a transform with its transition suppressed for one frame, and
       the height was fixed before the first message arrived. */
    function restart() {
      phase = 'reset';
      thread.classList.add('is-clearing');

      timer = setTimeout(function () {
        /* Everything back to the start, invisibly, while the stack is out.
           The box goes back to clipping here rather than at the top of the
           fade: the reactions are still on screen while the stack dims, and
           cutting them off on the way out is the same fault as cutting them
           off on the way in. */
        thread.classList.remove('is-open');
        exitList();
        hideCta();
        /* Back to the first hello, so every cycle opens the way the first
           one did. */
        resetCycle();
        if (cancelScramble) { cancelScramble(); cancelScramble = null; }
        thread.removeAttribute('data-reactions');
        resetReactions();
        retired = 0;
        idx = opening();
        for (var i = 0; i < rows.length; i++) {
          rows[i].setAttribute('data-state', i < idx ? 'live' : 'idle');
        }
        if (track) {
          track.style.transition = 'none';
          /* Back to the opening state, centre included. The loop starts the
             way the first visit did. */
          centreOpening();
          void track.offsetWidth;
          track.style.transition = '';
        }

        timer = setTimeout(function () {
          thread.classList.remove('is-clearing');
          openNow();
          phase = 'seq';
          running = false;
          play();
        }, BLANK_MS);
      }, FADE_MS);
    }

    /* Re-arms whatever the current phase is waiting on. */
    function arm() {
      clearTimeout(timer);
      /* The list is a place the reader chose to be. Nothing takes them out
         of it but their own hand on Back or Replay. */
      if (phase === 'list') return;
      if (phase === 'hold') timer = setTimeout(restart, HOLD_MS);
      else if (phase === 'reset') restart();
      /* The burst sets absolute states, so replaying it from the top is
         always safe, which is what makes a pause in the middle of it
         self-healing rather than a stuck half-row of chips. */
      else if (phase === 'react') burst();
    }

    /* How long the message that has just landed asked to be left alone, on top
       of the standard gap. Read from the row rather than from the data, so a
       role change and a replay both get it without anything being passed
       around. */
    function dwellOf(i) {
      if (i < 0 || i >= rows.length) return 0;
      return parseInt(rows[i].getAttribute('data-dwell'), 10) || 0;
    }

    /* How long to leave a message alone once it has landed: a beat, plus its
       own length, plus anything it specifically asked for. */
    /* How long the indicator stands before the bubble it belongs to. One
       number everywhere but the phone's opening pair, which is quick. */
    function dotsMs() {
      return (narrow.matches && idx === 1) ? DOTS_FAST : DOTS_MS;
    }

    function gapAfter(i) {
      if (i < 0 || i >= rows.length) return GAP_MS;
      /* The phone's opening is a beat, not a pause. The greeting and the
         introduction are still one thought (they are simply written one after
         the other here), so the gap between them is the shortest in the
         thread, and the indicator that fills it is the quick one. */
      if (narrow.matches && i === 0) return OPEN_GAP;
      /* The introduction, on a phone: a hold rather than a read. Only the
         pause is short: the indicator that follows it still stands for its
         own full dotsMs(), and the bubble still arrives the way it always
         did. */
      if (narrow.matches && i === 1) return SECOND_HOLD;
      var el = rows[i].querySelector('.msg__text');
      var len = el ? el.textContent.trim().length : 0;
      return Math.min(GAP_MS + len * READ_MS, GAP_MAX) + dwellOf(i);
    }

    /* THE REACTIONS WAIT FOR THE WRITING, AND NOTHING ELSE. A message that
       arrives out of noise is not finished when its bubble lands (it is
       finished when the last word stops resolving), so the clock starts there
       rather than a beat earlier, and it is the only thing the chips wait for.

       Reached from two places: the end of the sequence, and a thread whose
       whole content is its opening, which is what the narrow set is, two
       messages that arrive together and are already finished. */
    function ending() {
      var left = Math.max(0, decodeEnds - now());
      timer = setTimeout(function () {
        phase = 'react';
        /* The reactions, and then (after they have been allowed to stand) 
           the work. Both are burst()'s tail: the list used to start on this
           same frame, underneath chips that were still arriving. */
        burst();
      }, left ? left + TIGHT : REACT_MS);
    }

    function play() {
      if (phase !== 'seq') { arm(); return; }
      if (running) return;
      /* Nothing left to send. On a phone that is the ordinary case rather than
         the edge one, so it is the ending rather than a return. */
      if (idx >= count) { ending(); return; }
      running = true;
      startCycle();
      timer = setTimeout(next, gapAfter(idx - 1));
    }

    function pause() {
      running = false;
      clearTimeout(timer);
      stopCycle();
    }

    /* Reduced motion stops here, and it stops on the ENDING rather than on the
       beginning: the last four messages, the closing line and its reactions,
       already settled. Somebody who has asked the operating system not to
       animate things should get the state the animation was trying to arrive
       at, not a loop with the movement taken out of it. Nothing here plays,
       nothing repeats, and the role buttons and reactions still work. */
    if (still) {
      for (var q = 0; q < count; q++) rows[q].setAttribute('data-state', 'settled');
      idx = count;
      /* The invitation is there from the first frame: with nothing to play,
         this IS the ending, and the work has to be reachable from it. */
      showCta();
      /* The same content-aware rule, run once: the end of the conversation,
         parked on the anchor with whatever came before it above the edge. */
      place(true);
      phase = 'hold';
      thread.setAttribute('data-reactions', 'on');
      for (q = 0; q < RX_PLAN.length; q++) {
        var c = thread.querySelector('.rx[data-rx="' + RX_PLAN[q][0] + '"]');
        if (!c) continue;
        c.classList.add('is-in', 'is-on');
        c.setAttribute('aria-pressed', 'true');
        var nn = c.querySelector('.rx__n');
        if (nn) nn.textContent = RX_PLAN[q][1];
      }
      return;
    }

    /* Nothing runs to an empty room. Once the last message has landed there is
       nothing left for either observer to start. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) play(); else pause();
      }, { threshold: 0.01 }).observe(thread);
    } else {
      play();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause();
      else if (thread.getBoundingClientRect().bottom > 0) play();
    });
  }

  /* ---- the credentials move down the page -------------------------------

     The ten skills are not hero content. A recruiter looks at a portfolio for
     who this is, what he says, and who he has worked for; what he can list is
     read after the work, if at all. So the node is moved out of the hero and
     into a slot below Selected Work, moved, not duplicated, so there is only
     ever one of it on the page, in the accessibility tree as much as on
     screen.

     The skills stay behind a disclosure on a phone and stand open on a wider
     screen. `open` is an attribute rather than a style, so the breakpoint has
     to be read here rather than in CSS. */
  function credentials() {
    var slot = document.querySelector('[data-caps-slot]');
    var caps = document.querySelector('.hero__caps');

    /* Education used to be moved down here too. On a desktop it was the only
       thing in the slot, which made a band of its own between the last
       project and Everything else: two lines of degree with forty pixels of
       padding above and below, holding the page apart for nothing. It is off
       the page now, and the slot collapses when there is nothing in it. */

    if (!caps) return;

    /* The skills stay in the profile card on a desktop, where the column has
       room for them and they are part of what the card verifies. On a phone
       that same list is ten lines between a name and a conversation, so it
       goes down the page with the education and comes back if the window
       grows. Moved, not duplicated: there is only ever one of them. */
    var home = caps.parentNode;
    var mark = document.createComment('caps');
    home.insertBefore(mark, caps);

    var mq = window.matchMedia('(max-width: 959px)');
    var phone = window.matchMedia('(max-width: 719px)');

    /* AND ON A PHONE IT IS A CARD, NOT A BAND.

       The slot below the work is right for a tablet, where the page is still
       a column of full-width sections. On a phone the foot of the page is
       three cards (Worked With, Tools, Contact), and a bare disclosure
       floating between two sections reads as something that fell out of one
       of them. It goes into the hero card with the other three instead, and
       the stylesheet gives it their surface and its place in the order. The
       slot collapses on its own once it is empty: see
       `.section--capsslot:empty`. */
    var deck = document.querySelector('.hero-card');

    function place() {
      if (phone.matches && deck) {
        if (caps.parentNode !== deck) deck.appendChild(caps);
      } else if (mq.matches) {
        if (slot && caps.parentNode !== slot) slot.appendChild(caps);
      } else if (caps.parentNode !== home) {
        home.insertBefore(caps, mark);
      }
    }

    /* `open` is an attribute rather than a style, so the breakpoint has to be
       read here rather than in CSS. */
    function sync() { if (!caps._touched) caps.open = !phone.matches; }

    caps.addEventListener('toggle', function () { caps._touched = true; });

    /* ---- and on a phone it drives the Tools card above it ----------------

       The tools card has two arrangements already: the turning wheel it
       rests in and the shelves it sorts into under a pointer, and a phone
       could reach neither. This disclosure is the switch: open it and the
       logos sort under Design Decisions, AI Execution and Human Judgment;
       close it and they go back to the wheel. The tools card listens for the
       event and owns the animation; nothing about the tools is duplicated in
       here, and this card keeps its own list of what it lists.

       Only on a phone: above 720 the sort is the hover it has always been,
       and the disclosure goes back to being a disclosure. Leaving that width
       re-rings the card so it is never left sorted with no way to unsort it. */
    function driveTools() {
      var on = phone.matches && caps.open;
      document.dispatchEvent(new CustomEvent('pf:tools-sort', { detail: on }));
    }
    caps.addEventListener('toggle', driveTools);
    if (phone.addEventListener) phone.addEventListener('change', driveTools);
    place();
    sync();

    if (mq.addEventListener) {
      mq.addEventListener('change', function () { place(); });
      /* The phone query decides WHERE it goes as well as whether it is open,
         so crossing 720 has to re-place it and not only re-sync it. */
      phone.addEventListener('change', function () {
        place(); caps._touched = false; sync();
      });
    }
  }

  function boot() {
    credentials();
    var nodes = document.querySelectorAll('[data-thread]');
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();


/* ===== js/reveal.js ===== */
/* ==========================================================================
   reveal.js. THE PAGE ARRIVES IN TIME WITH THE CONVERSATION

   The hero opens as the three roles, the conversation, and the two controls
   that belong to it. Everything else waits for a line to be said:

     stage 1   "I'm Sarthak Sahoo, a Product Designer based in Austin, TX"
: the profile card beside the thread, and the project browser
     stage 2   "I'm a product designer who understands how to design products
               in an AI-saturated world". Where I've been, the tools, and
               who he has worked with
     stage 3   "See the work": the about card, and the rest of the page
               behind the invitation that leads to it

   IT IS ONE-WAY AND IT IS ONCE. Nothing here ever hides anything. Switching
   role restarts the conversation and replay runs it again; neither takes the
   page back apart, because a composition that disassembles while somebody is
   reading it is a trick rather than an entrance.

   THE ESCAPE HATCHES MATTER MORE THAN THE CHOREOGRAPHY. A sequence that can
   strand a reader in front of an empty page is a worse page, so:

     · the whole thing is off unless index.html armed it before first paint,
       which it does not do without JS or under reduced motion;
     · scrolling past the hero shows everything immediately, scrolling is
       somebody saying they would like to read the page now;
     · a keyboard reaching for anything staged shows everything immediately;
     · a deep link to a case study, or to any anchor, skips the sequence;
     · and a hard ceiling fires the last stage whatever else has happened, so
       a thread that stalls cannot take the page down with it.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var root = document.documentElement;
  if (!root.hasAttribute('data-stage')) return;   /* never armed. Nothing to do */

  /* Which message index ends which stage. Indices, not strings: the copy is
     rewritten often and a matcher on the words would quietly stop firing. */
  var ON_MSG = { 1: 1, 2: 2 };   /* message 1 → stage 1, message 2 → stage 2 */
  var LAST = 3;

  /* Nothing may wait longer than this, no matter what the thread does. Read
     from the moment the page is interactive rather than from the first
     message, because a thread that never starts is exactly the case this is
     for. */
  var CEILING_MS = 26000;

  var at = 0;
  var done = false;

  function show(stage) {
    if (stage <= at) return;
    var i, els;
    for (i = at + 1; i <= stage; i++) {
      els = document.querySelectorAll('[data-reveal="' + i + '"]:not([data-shown])');
      for (var j = 0; j < els.length; j++) els[j].setAttribute('data-shown', '');
    }
    at = stage;
    root.setAttribute('data-stage', String(at));
    if (at >= LAST) finish();
  }

  /* Everything, now. The end of the sequence and every escape hatch land
     here, so there is one way for the page to become whole. */
  function all() { show(LAST); }

  function finish() {
    if (done) return;
    done = true;
    /* The attributes stay on the elements. They are already shown, and the
       rules that hid them no longer match anything. What goes is the
       listening: no scroll handler, no timer, nothing left running behind a
       page that has finished arriving. */
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('focusin', onFocus, true);
    document.removeEventListener('pf:msg', onMsg);
    document.removeEventListener('pf:cta', all);
    if (ceiling) clearTimeout(ceiling);
  }

  function onMsg(e) {
    var i = e && e.detail ? e.detail.index : -1;
    if (ON_MSG[i]) show(ON_MSG[i]);
  }

  /* PAST THE HERO IS A REQUEST TO SEE THE PAGE. Half a viewport is enough to
     mean it and short enough that nobody arrives at a blank band. */
  function onScroll() {
    if (window.scrollY > window.innerHeight * 0.5) all();
  }

  /* Tab is the other way in. Focus cannot actually land inside a staged block
. They are visibility:hidden until shown, so this catches the moment
     somebody starts moving through the page at all and gets out of the way. */
  var steps = 0;
  function onFocus() { if (++steps > 2) all(); }

  document.addEventListener('pf:msg', onMsg);
  document.addEventListener('pf:cta', all);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('focusin', onFocus, true);

  /* A DEEP LINK IS NOT AN ARRIVAL. Someone who opened a case study, or a link
     to a section (#work most of all, since that is the one people send) 
     asked for a place on this page, not for a performance in front of it. */
  if (location.hash && location.hash !== '#') all();
  window.addEventListener('hashchange', all);

  var ceiling = setTimeout(all, CEILING_MS);

  /* For the console, and for anything that later needs to say "stop this". */
  PF.revealAll = all;

})(window.PF);


/* ===== js/dsa.js ===== */
/* ==========================================================================
   dsa.js. THE AUDIT SLIDE WALKS ITS FIVE REWRITES

   The Design System Audit's finding is language: a status that named a state,
   rewritten as one that names the owner and the next step. The project card
   down the page shows all five at once, because the set is the argument. The
   browser slide shows one at a time and performs the change (the old label,
   the line that carries it across, the new one), because the work was a
   rewrite, and watching it happen once reads better than five finished pairs
   sitting still.

   THIS FILE MOVES ONE ATTRIBUTE. Every beat, every fade and the line that
   draws are in css/05-dsa.css, written against `data-on`. The markup ships
   with it on the first item, so with no script at all the slide is a complete
   artifact rather than an empty box. This only walks it along.

   IT DOES NOT RUN WHEN NOBODY IS LOOKING. A loop behind a hidden carousel
   slide, in a background tab, or under a reduced-motion preference is work
   nobody asked for: the timer is armed, and every time it fires it checks
   whether the thing is actually on screen before it advances. When it is not,
   it waits rather than stepping through the set into an empty room.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  /* Long enough that the last beat (why the label moved) can be read
     without hurrying, which is the beat the whole slide is for. The write
     itself takes about 1.3s of that; the rest is the sentence. */
  var HOLD_MS = 4200;
  /* The cross-fade out and in overlap by design: the outgoing item is gone
     before the incoming one has finished arriving, so there is never a frame
     with two labels on it. */
  var GAP_MS = 340;

  function init(root) {
    var items = root.querySelectorAll('.ds-cyc__item');
    var ticks = root.querySelectorAll('.ds-cyc__tick');
    if (items.length < 2) return;

    var reduce = window.matchMedia &&
                 matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;   /* the markup's own first item is the whole answer */

    var i = 0;
    var timer = null;

    /* On screen means: the slide is the one the carousel is showing (a hidden
       slide has no offsetParent), the tab is in front, and the block is
       actually in the viewport. */
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
      }, { threshold: 0.15 }).observe(root);
    }

    function showing() {
      return visible && !document.hidden && root.offsetParent !== null;
    }

    function paint(n) {
      var k;
      for (k = 0; k < items.length; k++) {
        if (k === n) items[k].setAttribute('data-on', '');
        else items[k].removeAttribute('data-on');
      }
      for (k = 0; k < ticks.length; k++) {
        if (k === n) ticks[k].setAttribute('data-on', '');
        else ticks[k].removeAttribute('data-on');
      }
    }

    function step() {
      if (!showing()) { timer = setTimeout(step, 900); return; }

      /* Out first, then in. The gap is what makes the next category read as a
         new one rather than as the same block changing its words. */
      items[i].removeAttribute('data-on');
      timer = setTimeout(function () {
        i = (i + 1) % items.length;
        paint(i);
        timer = setTimeout(step, HOLD_MS);
      }, GAP_MS);
    }

    /* The first item is already on in the markup; the clock starts from it. */
    paint(0);
    timer = setTimeout(step, HOLD_MS);

    /* Coming back to a tab should not fire a burst of queued steps. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && timer) { clearTimeout(timer); timer = null; }
      else if (!document.hidden && !timer) timer = setTimeout(step, HOLD_MS);
    });
  }

  function boot(scope) {
    scope = scope || document;
    var els = scope.querySelectorAll('[data-ds-cyc]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].hasAttribute('data-ds-built')) continue;
      els[i].setAttribute('data-ds-built', '');
      init(els[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { boot(); });
  } else {
    boot();
  }

  PF.initAudit = boot;

})(window.PF);


/* ===== js/ap-fit.js ===== */
/* ==========================================================================
   ap-fit.js: one number, and nothing else

   The same shape as js/pv-fit.js, and for the same reason. 29-px-emerge and
   the block in 17 derive the wrapper's box from the natural ratio, so this
   file reads a width and writes a scale, and never writes anything that any
   observer is measuring.
   ========================================================================== */

(function () {
  'use strict';

  var wrap = document.querySelector('[data-ap-fit]');
  if (!wrap) return;
  var ap = wrap.querySelector('.ap');
  if (!ap) return;

  var last = -1;

  function measure() {
    if (!wrap.getClientRects().length) {
      if (last !== -1) { ap.style.removeProperty('--ap-s'); last = -1; }
      return;
    }
    var room = wrap.clientWidth;
    if (!room) return;

    var natural = parseFloat(getComputedStyle(wrap).getPropertyValue('--ap-w-px')) || 713;
    var s = Math.min(1, room / natural);
    if (Math.abs(s - last) < 0.002) return;
    last = s;
    ap.style.setProperty('--ap-s', s);
  }

  if (window.ResizeObserver) {
    new ResizeObserver(measure).observe(wrap);
  } else {
    window.addEventListener('resize', measure);
  }
  /* The case study is a hidden <main> until its route is asked for. */
  window.addEventListener('hashchange', function () { setTimeout(measure, 0); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', measure);
  } else { measure(); }
  window.addEventListener('load', measure);
})();


/* ===== js/audit-proto.js ===== */
/* ==========================================================================
   audit-proto.js: the four animated demonstrations in the audit case study

   FOUR WORKFLOWS, ONE PLAYER, ONE ARGUMENT.

   The audit covered four provider workflows (Orders, Specimens, Results and
   Provider Tasks), and found the same four problems inside all of them. Each
   workflow gets the same eighteen seconds and the same shape: a provider does
   one real task in the system as audited, and then does the same task in the
   system with the audited changes applied. Same record, same obstruction,
   same fix, same navigation, same density.

   That repetition is the point rather than a saving. Four demonstrations that
   look and move alike are what makes it visible that they were suffering from
   one underlying system problem, which is why the fix was a shared pattern
   and not four separate redesigns.

   WHAT EACH ONE DEMONSTRATES, and every item is documented in the case study
   below:

     Orders      legacy  Status reads "Failed" and the row does not say what
                         is required. Four rows carry four different action
                         treatments. The recovery sits inside an overflow menu
                         with three items that are not it.
                 updated Status reads "Submission error". The row carries
                         Required action, Owner and Due. Resolve issue is a
                         control in the row, and the panel names the field.

     Specimens   legacy  "In Progress" names a stage and never a holder. Who
                         has the specimen is an inference from a history log
                         reached through an overflow menu.
                 updated The status names the stage and who holds it, Owner
                         and Due are columns, and only the row that is the
                         provider's own carries a required action.

     Results     legacy  Every result carries the same "Alert" whether it is
                         information or needs a clinician, and the action
                         differs from row to row.
                 updated Normal, abnormal and critical are separate states,
                         each with the action that matches it, in one column.

     Provider    legacy  The action moves from row to row: a control in the
     Tasks               last column, a link inside the detail cell, an
                         overflow menu, and Open, Pending and Active carry
                         no priority and no due.
                 updated The Provider Action Queue: one row pattern, one
                         action position, one status vocabulary, sorted by
                         what is due.

   EVERY FRAME IS COMPUTED FROM THE CLOCK. There is no queue of timeouts and
   no animation that has to run to completion. stateAt(t) is a pure function
   of time, so dragging the scrubber to 7.4s produces exactly the frame that
   would have been on screen at 7.4s of playback, which is what makes the
   timeline inspectable rather than decorative.

   The DOM is rebuilt only when the discrete state changes, workflow, mode,
   view, the row under the cursor, whether the field is filled. The cursor
   itself moves every frame on a transform, which costs nothing.

   SWITCHING IS A DATA SWAP, NOT A RELOAD. The player, the cursor, the camera
   and the scrubber are one machine; a workflow is a table of rows, a
   timeline, a flow and its copy. Choosing a workflow rebuilds the flow's
   nodes, repoints the renderers and returns the clock to zero. Nothing is
   fetched and nothing is mounted twice.

   SELF-CONTAINED. It reads and writes nothing outside its own section.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.querySelector('[data-audit-proto]');
  if (!root) return;

  var stage = root.querySelector('[data-ap-stage]');
  var cursor = root.querySelector('[data-ap-cursor]');
  var phaseEl = root.querySelector('[data-ap-phase]');
  var playBtn = root.querySelector('[data-ap-play]');
  var seek = root.querySelector('[data-ap-seek]');
  var nowEl = root.querySelector('[data-ap-now]');
  var durEl = root.querySelector('[data-ap-dur]');
  var srEl = root.querySelector('[data-ap-sr]');
  if (!stage || !seek) return;

  /* ----------------------------------------------------------------------
     THE FLOW'S GEOMETRY

     A node is 150 wide and the link between two of them is 44, on a drawing
     1160 across. Everything else about the diagram (where the path starts,
     where it ends, where the camera points) falls out of how many steps the
     phase has, so a flow is authored as a list of labels and the numbers are
     arithmetic rather than a table to keep in agreement with it.
     ---------------------------------------------------------------------- */

  var NODE_W = 150, LINK_W = 44, STEP = NODE_W + LINK_W, CANVAS = 1160;

  function lay(n) {
    var content = n * NODE_W + (n - 1) * LINK_W;
    var x0 = Math.round((CANVAS - content) / 2);
    var xs = [], cs = [];
    for (var i = 0; i < n; i++) {
      xs.push(x0 + i * STEP);
      cs.push(x0 + i * STEP + NODE_W / 2);
    }
    return { x0: x0, x1: x0 + content, xs: xs, cs: cs };
  }

  /* ----------------------------------------------------------------------
     THE TIMELINE, SHARED

     Times in seconds. Cursor positions are percentages of the application
     window, so the direction of a movement survives every width.

     The pauses are the point. A cursor that never stops reads as a machine
     playing back a script; the holds at 2.2, 4.4, 6.6, 11.2 and 14.4 are
     where a person would be reading, and they are longer than the moves
     around them.

     All four workflows are cut to this one timeline. They are the same task
     shape, read the queue, fail to find the next move, dig for it, then do
     the same thing again in a system that says what the next move is, so
     giving each its own rhythm would be four different arguments told four
     different ways. One rhythm, four subjects.
     ---------------------------------------------------------------------- */

  var KEY = [
    /* --- the system as audited ------------------------------------------ */
    { t: 0.0,  m: 'before', v: 'list',  x: 14, y: 90 },
    { t: 1.0,  m: 'before', v: 'list',  x: 60, y: 32, hov: 0 },
    { t: 2.2,  m: 'before', v: 'list',  x: 60, y: 32, hov: 0 },         /* reading */
    { t: 2.9,  m: 'before', v: 'list',  x: 60, y: 40, hov: 1 },
    { t: 3.7,  m: 'before', v: 'list',  x: 60, y: 48, hov: 2 },
    { t: 4.4,  m: 'before', v: 'list',  x: 60, y: 48, hov: 2, sel: 2 }, /* reading */
    { t: 5.4,  m: 'before', v: 'list',  x: 83, y: 48, hov: 2, sel: 2 },
    { t: 6.0,  m: 'before', v: 'list',  x: 83, y: 48, hov: 2, sel: 2, press: 1 },
    { t: 6.2,  m: 'before', v: 'menu',  x: 83, y: 48, sel: 2 },
    { t: 6.7,  m: 'before', v: 'menu',  x: 83, y: 48, sel: 2 },         /* reading */
    { t: 7.4,  m: 'before', v: 'menu',  x: 88, y: 65, sel: 2, mi: 0 },
    { t: 7.9,  m: 'before', v: 'menu',  x: 88, y: 72, sel: 2, mi: 1 },
    { t: 8.5,  m: 'before', v: 'menu',  x: 88, y: 80, sel: 2, mi: 2 },
    { t: 9.0,  m: 'before', v: 'menu',  x: 88, y: 80, sel: 2, mi: 2, press: 1 },
    { t: 9.2,  m: 'before', v: 'panel', x: 88, y: 80 },
    { t: 10.1, m: 'before', v: 'panel', x: 50, y: 74 },                 /* reading */

    /* --- the same task, updated system ---------------------------------- */
    { t: 10.7, m: 'after',  v: 'list',  x: 50, y: 74, cut: 1 },
    { t: 11.9, m: 'after',  v: 'list',  x: 45, y: 61, hov: 2, sel: 2 }, /* reading */
    { t: 12.7, m: 'after',  v: 'list',  x: 93, y: 61, hov: 2, sel: 2 },
    { t: 13.2, m: 'after',  v: 'list',  x: 93, y: 61, hov: 2, sel: 2, press: 1 },
    { t: 13.4, m: 'after',  v: 'panel', x: 93, y: 61 },
    { t: 14.5, m: 'after',  v: 'panel', x: 50, y: 81 },                 /* reading */
    { t: 15.2, m: 'after',  v: 'panel', x: 10, y: 94 },
    { t: 15.6, m: 'after',  v: 'panel', x: 10, y: 94, press: 1 },
    { t: 15.8, m: 'after',  v: 'panel', x: 10, y: 94, fill: 1 },
    { t: 16.6, m: 'after',  v: 'panel', x: 13, y: 94, fill: 1 },
    { t: 17.0, m: 'after',  v: 'panel', x: 13, y: 94, fill: 1, press: 1 },
    { t: 17.2, m: 'after',  v: 'done',  x: 13, y: 94 },
    { t: 18.0, m: 'after',  v: 'done',  x: 13, y: 94 }
  ];

  var AUTH = KEY[KEY.length - 1].t;     /* the authored length, without cards */

  /* The camera's schedule, shared for the same reason the timeline is: every
     phase is established wide, read close, and then pulled back before the
     camera travels, because a cut from one close shot to the next is where a
     reader loses the path. cx is where in the 1160-wide drawing it is
     pointed and span is how much of that drawing is in frame.

     `at` is the moment each step becomes the step being taken. Every one of
     them is a frame in KEY above, not a round number: 2.9 is the cursor
     reaching the third row, 5.4 is it leaving the status column for the
     action, 6.2 is the menu opening, 9.2 is the panel. */

  var AT_BEFORE = [0.0, 2.9, 4.4, 5.4, 6.2, 9.2];
  var AT_AFTER  = [10.7, 11.9, 12.7, 13.4, 17.2];

  var SHOTS_BEFORE = [
    { t: 0.0,  cx: 580,  span: 1160, est: 1, ph: 0 },   /* the whole path */
    { t: 2.9,  cx: 580,  span: 1160, est: 1, ph: 1 },   /* held until the step it travels to is live */
    { t: 3.5,  cx: 386,  span: 560 },    /* step two → step three */
    { t: 5.0,  cx: 386,  span: 560 },
    { t: 5.4,  cx: 580,  span: 900 },    /* back, then travel */
    { t: 6.2,  cx: 774,  span: 560 },    /* step four → step five */
    { t: 8.9,  cx: 774,  span: 560 },
    { t: 9.2,  cx: 920,  span: 900 },
    { t: 9.9,  cx: 1030, span: 520 },    /* the last step */
    { t: 10.7, cx: 1030, span: 520 }
  ];

  var SHOTS_AFTER = [
    { t: 10.7, cx: 580,  span: 1160, est: 1, ph: 0 },
    { t: 11.9, cx: 580,  span: 1160, est: 1, ph: 1 },
    { t: 12.4, cx: 483,  span: 560 },    /* step two → step three */
    { t: 13.1, cx: 483,  span: 560 },
    { t: 13.4, cx: 640,  span: 900 },
    { t: 14.2, cx: 871,  span: 560 },    /* step four → step five */
    { t: 18.0, cx: 871,  span: 560 }
  ];

  /* ----------------------------------------------------------------------
     THE FOUR WORKFLOWS

     A workflow is its rows, its timeline's subject matter and its two flows.
     Everything structural. The columns, the badges, the action treatments,
     the panel, the overflow menu, is written as data so that the four are
     built by one renderer and cannot drift apart in treatment while they
     differ in content.

     A cell is a string, a status {b,t}, or an action {a,k}. An action in the
     row the story is about lights up when the cursor is on it; the rest never
     do, which is the whole difference between a control and a label.
     ---------------------------------------------------------------------- */

  var WORKFLOWS = [

    /* ==================================================================== */
    {
      id: 'orders',
      tab: 'Orders',
      nav: 0,
      sub: 'The same submission issue, worked through the legacy system and ' +
           'then the updated one.',
      queue: { before: ['Work queue', '4 items'], after: ['Work queue', '4 items'] },
      cols: {
        before: ['Order', 'Patient', 'Test', 'Status', 'Updated', 'Action'],
        after: ['Order', 'Patient', 'Status', 'Required action', 'Owner', 'Due', 'Next step']
      },
      doneSel: 2,
      rows: [
        { issue: false,
          before: ['ORD-458732', 'John Doe', 'MRD panel', { b: 'Pending', t: 'flat' }, '2h ago',
                   { a: 'Submit Order', k: 'ghost' }],
          after: ['ORD-458732', 'John Doe', { b: 'Awaiting provider action', t: 'provider' },
                  'Confirm order details', 'A. Smith', 'Today 11:00 AM',
                  { a: 'Review order', k: 'provider' }] },

        { issue: false,
          before: ['ORD-458733', 'Robert Brown', 'MRD panel', { b: 'Review', t: 'provider' }, '4h ago',
                   { a: 'Open', k: 'link' }],
          after: ['ORD-458733', 'Robert Brown', { b: 'Needs clinical review', t: 'review' },
                  'Review and sign off on result', 'A. Smith', 'Today 2:00 PM',
                  { a: 'Review result', k: 'review' }] },

        { issue: true,
          before: ['ORD-458734', 'Robert Brown', 'MRD panel', { b: 'Failed', t: 'error' }, '30m ago',
                   { a: '&hellip;', k: 'menu', raw: 1 }],
          after: ['ORD-458734', 'Robert Brown', { b: 'Submission error', t: 'error' },
                  'Add specimen source to complete submission', 'A. Smith', 'Today 4:00 PM',
                  { a: 'Resolve issue', k: 'recovery' }],
          done: ['ORD-458734', 'Robert Brown', { b: 'Awaiting provider action', t: 'provider' },
                 'Confirm order details', 'A. Smith', 'Today 4:00 PM',
                 { a: 'Review order', k: 'provider' }] },

        { issue: false,
          before: ['SPEC-884522', 'Jane Smith', 'Blood specimen', { b: 'In Progress', t: 'lab' }, '1h ago',
                   { a: 'Details', k: 'ghost' }],
          after: ['SPEC-884522', 'Jane Smith', { b: 'Lab review in progress', t: 'lab' },
                  'Track specimen progress', 'Lab', 'Updated 1h ago',
                  { a: 'View details', k: 'info' }] }
      ],
      menu: ['View details', 'Edit order', 'Resolve', 'Cancel order'],
      panel: {
        title: 'Order ORD-458734',
        label: 'Order details',
        fields: [
          ['Patient', 'Robert Brown'],
          ['Test', 'MRD panel'],
          ['Insurance', 'Verified'],
          ['Specimen source', null, 'Whole blood']
        ],
        before: { st: ['Failed', 'error'],
                  msg: 'Submission failed. Please check order details.',
                  act: { a: 'Save', k: 'ghost', hot: 0 } },
        after: { st: ['Submission error', 'error'],
                 cause: 'Missing specimen source',
                 msg: 'Add specimen source to complete submission.',
                 act: { a: 'Add specimen source', k: 'recovery', hot: 1 },
                 actFilled: { a: 'Complete submission', k: 'complete', hot: 1 } }
      },
      note: 'ORD-458734 submitted. Specimen source added.',
      flow: {
        before: ['Work queue', 'Failed', 'Interpret status', 'Find &bull;&bull;&bull;',
                 'Open recovery action', 'Resolve'],
        after: ['Work queue', 'Submission error', 'Required action', 'Resolve issue', 'Resolved']
      },
      doing: 'Placing and managing oncology test orders.',
      broke: 'The required action was a button in one row, a link in another and a menu ' +
             'item in a third, and a failed submission said only that it had failed.',
      fixed: 'One primary action per row in the same position, and an error that names the ' +
             'missing field and is resolved where it happened.',
      sr: 'An eighteen second animation: one submission issue resolved in the legacy ' +
          'provider portal and then in the updated one. The steps are described in the ' +
          'sections below.'
    },

    /* ==================================================================== */
    {
      id: 'specimens',
      tab: 'Specimens',
      nav: 1,
      sub: 'The same held specimen, worked through the legacy system and then ' +
           'the updated one.',
      queue: { before: ['Specimen queue', '4 items'], after: ['Specimen queue', '4 items'] },
      cols: {
        before: ['Specimen', 'Patient', 'Type', 'Status', 'Updated', 'Action'],
        after: ['Specimen', 'Patient', 'Status', 'Required action', 'Owner', 'Due', 'Next step']
      },
      doneSel: 2,
      rows: [
        { issue: false,
          before: ['SPC-88412', 'John Doe', 'Whole blood', { b: 'Received', t: 'lab' }, '3h ago',
                   { a: 'Details', k: 'ghost' }],
          after: ['SPC-88412', 'John Doe', { b: 'At lab: accessioning', t: 'lab' },
                  'None, lab holds this', 'Lab', 'Today 3:00 PM',
                  { a: 'View progress', k: 'info' }] },

        { issue: false,
          before: ['SPC-88413', 'Jane Smith', 'Tissue block', { b: 'In Transit', t: 'flat' }, '1h ago',
                   { a: 'Track', k: 'link' }],
          after: ['SPC-88413', 'Jane Smith', { b: 'In transit to lab', t: 'flat' },
                  'None, courier holds this', 'Courier', 'Arrives 1:00 PM',
                  { a: 'Track shipment', k: 'info' }] },

        { issue: true,
          before: ['SPC-88414', 'Robert Brown', 'Whole blood', { b: 'In Progress', t: 'lab' }, '30m ago',
                   { a: '&hellip;', k: 'menu', raw: 1 }],
          after: ['SPC-88414', 'Robert Brown', { b: 'Insufficient sample', t: 'error' },
                  'Order a recollection', 'A. Smith', 'Today 12:00 PM',
                  { a: 'Order recollection', k: 'recovery' }],
          done: ['SPC-88414', 'Robert Brown', { b: 'Recollection ordered', t: 'provider' },
                 'None, scheduling holds this', 'Scheduling', 'Today 12:00 PM',
                 { a: 'View progress', k: 'provider' }] },

        { issue: false,
          before: ['SPC-88415', 'Maria Lopez', 'Bone marrow', { b: 'Complete', t: 'flat' }, '5h ago',
                   { a: 'Open', k: 'ghost' }],
          after: ['SPC-88415', 'Maria Lopez', { b: 'Released to reporting', t: 'lab' },
                  'None, reporting holds this', 'Lab', 'Today 5:00 PM',
                  { a: 'View chain', k: 'info' }] }
      ],
      menu: ['Print label', 'Download requisition', 'View details', 'Cancel specimen'],
      panel: {
        title: 'Specimen SPC-88414',
        label: 'Specimen details',
        fields: [
          ['Patient', 'Robert Brown'],
          ['Type', 'Whole blood'],
          ['Collected', 'Today 8:15 AM'],
          ['Recollection order', null, 'Ordered, today 12:00 PM']
        ],
        before: { st: ['In Progress', 'lab'],
                  msg: 'Specimen is being processed. Check back for updates.',
                  act: { a: 'Refresh', k: 'ghost', hot: 0 } },
        after: { st: ['Insufficient sample', 'error'],
                 cause: 'Sample volume below the assay minimum',
                 msg: 'Order a recollection to keep this specimen moving.',
                 act: { a: 'Order recollection', k: 'recovery', hot: 1 },
                 actFilled: { a: 'Confirm recollection', k: 'complete', hot: 1 } }
      },
      note: 'SPC-88414 recollection ordered. Scheduling notified.',
      flow: {
        before: ['Specimen queue', 'In Progress', 'Interpret status', 'Find &bull;&bull;&bull;',
                 'Read history log', 'Infer the holder'],
        after: ['Specimen queue', 'Insufficient sample', 'Owner and due', 'Order recollection',
                'Recollection ordered']
      },
      doing: 'Tracking a specimen from collection through to reporting.',
      broke: '&ldquo;Pending&rdquo; and &ldquo;In Progress&rdquo; named a stage but never a ' +
             'holder or a next step, so who had the specimen was an inference from a history log.',
      fixed: 'A status that names the stage and who holds it, with Owner, Due and one action ' +
             'on the same row pattern, and a required action only on the rows that are the ' +
             'provider&rsquo;s own.',
      sr: 'An eighteen second animation: one held specimen traced in the legacy provider ' +
          'portal and then in the updated one. The steps are described in the sections below.'
    },

    /* ==================================================================== */
    {
      id: 'results',
      tab: 'Results',
      nav: 2,
      sub: 'The same critical result, worked through the legacy system and then ' +
           'the updated one.',
      queue: { before: ['Results', '4 items'], after: ['Results', '4 items'] },
      cols: {
        before: ['Result', 'Patient', 'Panel', 'Status', 'Resulted', 'Action'],
        after: ['Result', 'Patient', 'Status', 'Required action', 'Owner', 'Due', 'Next step']
      },
      doneSel: 2,
      rows: [
        { issue: false,
          before: ['RES-30281', 'John Doe', 'MRD panel', { b: 'Alert', t: 'error' }, '2h ago',
                   { a: 'View', k: 'link' }],
          after: ['RES-30281', 'John Doe', { b: 'Normal, no action', t: 'flat' },
                  'None, filed to the chart', 'System', 'Filed 2h ago',
                  { a: 'View result', k: 'info' }] },

        { issue: false,
          before: ['RES-30282', 'Jane Smith', 'CGP panel', { b: 'Alert', t: 'error' }, '3h ago',
                   { a: 'Open report', k: 'ghost' }],
          after: ['RES-30282', 'Jane Smith', { b: 'Abnormal, review', t: 'review' },
                  'Review and sign off', 'A. Smith', 'Today 5:00 PM',
                  { a: 'Review result', k: 'review' }] },

        { issue: true,
          before: ['RES-30283', 'Robert Brown', 'MRD panel', { b: 'Alert', t: 'error' }, '25m ago',
                   { a: '&hellip;', k: 'menu', raw: 1 }],
          after: ['RES-30283', 'Robert Brown', { b: 'Critical, action required', t: 'error' },
                  'Contact the patient today', 'A. Smith', 'Today 11:00 AM',
                  { a: 'Start contact', k: 'recovery' }],
          done: ['RES-30283', 'Robert Brown', { b: 'Critical, signed off', t: 'provider' },
                 'None, contact recorded', 'A. Smith', 'Today 11:00 AM',
                 { a: 'View result', k: 'provider' }] },

        { issue: false,
          before: ['RES-30284', 'Maria Lopez', 'Hereditary panel', { b: 'Alert', t: 'error' }, '6h ago',
                   { a: 'Download', k: 'ghost' }],
          after: ['RES-30284', 'Maria Lopez', { b: 'Normal, no action', t: 'flat' },
                  'None, filed to the chart', 'System', 'Filed 6h ago',
                  { a: 'View result', k: 'info' }] }
      ],
      menu: ['Download PDF', 'Print result', 'Open full report', 'Share with care team'],
      panel: {
        title: 'Result RES-30283',
        label: 'Result details',
        fields: [
          ['Patient', 'Robert Brown'],
          ['Panel', 'MRD panel'],
          ['Resulted', 'Today 10:35 AM'],
          ['Patient contact', null, 'Called, today 10:52 AM']
        ],
        before: { st: ['Alert', 'error'],
                  msg: 'Alert on this result. Open the full report for details.',
                  act: { a: 'Download', k: 'ghost', hot: 0 } },
        after: { st: ['Critical, action required', 'error'],
                 cause: 'Result meets the critical threshold',
                 msg: 'Contact the patient today and record the contact.',
                 act: { a: 'Record patient contact', k: 'recovery', hot: 1 },
                 actFilled: { a: 'Sign off result', k: 'complete', hot: 1 } }
      },
      note: 'RES-30283 signed off. Patient contact recorded.',
      flow: {
        before: ['Results', 'Alert', 'Same on every row', 'Find &bull;&bull;&bull;',
                 'Open full report', 'Judge the urgency'],
        after: ['Results', 'Critical: action required', 'Required action', 'Record contact',
                'Signed off']
      },
      doing: 'Reading a result that has come back and deciding whether it needs a clinician.',
      broke: 'Every result carried the same alert whether it was information or needed ' +
             'clinical action, and the action on the row differed from row to row.',
      fixed: 'Normal, abnormal and critical written as separate states, each with the action ' +
             'that matches it, in one column position.',
      sr: 'An eighteen second animation: one critical result acted on in the legacy provider ' +
          'portal and then in the updated one. The steps are described in the sections below.'
    },

    /* ==================================================================== */
    {
      id: 'tasks',
      tab: 'Provider Tasks',
      nav: 3,
      sub: 'The same overdue task, worked through the legacy system and then ' +
           'the updated one.',
      queue: { before: ['Task list', '4 items'], after: ['Provider Action Queue', '4 items'] },
      cols: {
        before: ['Task', 'Patient', 'Detail', 'Status', 'Updated', 'Action'],
        after: ['Task', 'Patient', 'Status', 'Required action', 'Owner', 'Due', 'Next step']
      },
      doneSel: 2,
      rows: [
        { issue: false,
          before: ['TSK-6102', 'John Doe', 'Order needs confirming', { b: 'Open', t: 'flat' }, '2h ago',
                   { a: 'Open', k: 'ghost' }],
          after: ['TSK-6102', 'John Doe', { b: 'Due today', t: 'provider' },
                  'Confirm order details', 'A. Smith', 'Today 11:00 AM',
                  { a: 'Confirm order', k: 'provider' }] },

        /* The control is inside the detail cell on this row and the action
           column is empty, which is the finding, drawn rather than described. */
        { issue: false,
          before: ['TSK-6103', 'Jane Smith', { a: 'Sign now', k: 'link' },
                   { b: 'Pending', t: 'flat' }, '4h ago', ', '],
          after: ['TSK-6103', 'Jane Smith', { b: 'Due today', t: 'provider' },
                  'Sign the requisition', 'A. Smith', 'Today 2:00 PM',
                  { a: 'Sign requisition', k: 'provider' }] },

        { issue: true,
          before: ['TSK-6104', 'Robert Brown', 'Critical result needs contact',
                   { b: 'Active', t: 'flat' }, '25m ago', { a: '&hellip;', k: 'menu', raw: 1 }],
          after: ['TSK-6104', 'Robert Brown', { b: 'Overdue', t: 'error' },
                  'Contact the patient today', 'A. Smith', 'Today 11:00 AM',
                  { a: 'Start contact', k: 'recovery' }],
          done: ['TSK-6104', 'Robert Brown', { b: 'Complete', t: 'provider' },
                 'None, contact recorded', 'A. Smith', 'Today 11:00 AM',
                 { a: 'View task', k: 'provider' }] },

        { issue: false,
          before: ['TSK-6105', 'Maria Lopez', { a: 'Complete form', k: 'link' },
                   { b: 'Open', t: 'flat' }, '1d ago', ', '],
          after: ['TSK-6105', 'Maria Lopez', { b: 'Due Friday', t: 'flat' },
                  'Complete prior authorisation', 'A. Smith', 'Fri 9:00 AM',
                  { a: 'Open form', k: 'info' }] }
      ],
      menu: ['Reassign task', 'Open patient record', 'View task', 'Mark complete'],
      panel: {
        title: 'Task TSK-6104',
        label: 'Task details',
        fields: [
          ['Patient', 'Robert Brown'],
          ['Task', 'Contact patient about critical result'],
          ['Raised', 'Today 10:35 AM'],
          ['Patient contact', null, 'Called, today 10:52 AM']
        ],
        before: { st: ['Active', 'flat'],
                  msg: 'This task is active. Open the patient record for details.',
                  act: { a: 'Mark complete', k: 'ghost', hot: 0 } },
        after: { st: ['Overdue', 'error'],
                 cause: 'Due today 11:00 AM',
                 msg: 'Contact the patient and record the contact to close this task.',
                 act: { a: 'Record patient contact', k: 'recovery', hot: 1 },
                 actFilled: { a: 'Mark task complete', k: 'complete', hot: 1 } }
      },
      note: 'TSK-6104 complete. Patient contact recorded.',
      flow: {
        before: ['Task list', 'Open / Pending / Active', 'No priority or due',
                 'Find &bull;&bull;&bull;', 'Open the task', 'Rank it by eye'],
        after: ['Provider Action Queue', 'Overdue', 'Required action', 'Record contact',
                'Task complete']
      },
      doing: 'Working through what is still outstanding.',
      broke: 'The action moved from row to row, a control in the last column, a link ' +
             'inside the detail cell, an overflow menu, and Open, Pending and Active ' +
             'carried no priority and no due.',
      fixed: 'The Provider Action Queue: one row pattern, one action position, one status ' +
             'vocabulary, ordered by what is due.',
      sr: 'An eighteen second animation: one overdue provider task closed in the legacy ' +
          'provider portal and then in the updated one. The steps are described in the ' +
          'sections below.'
    }
  ];

  var BY_ID = {};
  for (var wi = 0; wi < WORKFLOWS.length; wi++) BY_ID[WORKFLOWS[wi].id] = WORKFLOWS[wi];

  var wf = WORKFLOWS[0];

  /* ----------------------------------------------------------------------
     THE CHAPTER CARDS

     Two of them, one at the head of each half. They are part of the
     timeline rather than an overlay on top of it: the workflow underneath
     holds on its first frame while the card is up, and playback time maps
     onto authored time with the card's length inserted. Which means a
     scrubber dropped anywhere inside a card window lands on the card, and
     the frame behind it is the frame that half begins on.

     The shape is a fade in, a hold, and a longer fade out. The hold is
     what makes it readable at a glance and the slow exit is what keeps it
     from cutting.
     ---------------------------------------------------------------------- */

  var CARD_L = 1.9;
  var CARD_IN = 0.16, CARD_OUT = 0.62;   /* as fractions of CARD_L */
  var CARDS = [
    { src: 0.0,  label: 'Before' },
    { src: 10.7, label: 'After' }        /* the frame the updated system cuts in on */
  ];

  var DUR = AUTH + CARDS.length * CARD_L;

  /* Playback time in, authored time out, plus the card that is up, if any. */
  function mapTime(t) {
    var acc = 0;
    for (var i = 0; i < CARDS.length; i++) {
      var start = CARDS[i].src + acc;
      if (t < start) return { a: t - acc, card: null, p: 0 };
      if (t < start + CARD_L) {
        return { a: CARDS[i].src, card: CARDS[i], p: (t - start) / CARD_L };
      }
      acc += CARD_L;
    }
    return { a: t - acc, card: null, p: 0 };
  }

  /* 0 at both ends, 1 across the hold. */
  function cardLevel(p) {
    if (p < CARD_IN) return p / CARD_IN;
    if (p < CARD_OUT) return 1;
    return 1 - (p - CARD_OUT) / (1 - CARD_OUT);
  }

  /* ----------------------------------------------------------------------
     THE FLOW UNDERNEATH, AND THE CAMERA THAT READS IT

     The diagram below the application is the same run told as a path. It
     has no clock: both of the tables below are in AUTHORED time, the same
     time stateAt() is given, so the two layers cannot drift and a scrubber
     dropped anywhere moves them together. During a chapter card authored
     time is frozen, which is what makes the diagram sit on its establishing
     shot while BEFORE or AFTER is up.
     ---------------------------------------------------------------------- */

  function flowOf(w, mode) {
    var labels = w.flow[mode];
    var L = lay(labels.length);
    return { x0: L.x0, x1: L.x1, labels: labels, xs: L.xs,
             at: mode === 'before' ? AT_BEFORE : AT_AFTER,
             shots: mode === 'before' ? SHOTS_BEFORE : SHOTS_AFTER };
  }

  /* The authored vertical centre of the drawing. */
  var FLOW_MID = 60;

  /* A NARROW SCREEN IS DRIVEN AS THOUGH IT WERE THIS WIDE.

     Span is authored in the drawing's own units, so a close shot on a phone
     would otherwise be scaled down with the module and arrive at seven-pixel
     labels. The opposite of what a close shot is for. The scale is worked
     out from the wider of the real width and this one, which keeps a node the
     same apparent size on a phone as on a desktop and simply shows less of
     the path at once. */
  var K_REF = 560;

  /* Two shots and the ease between them. Smoothstep rather than a spring: the
     camera arrives and stops, and nothing overshoots.

     The establishing shots are the one place the camera is not told where to
     point. Where the whole path fits they sit on its centre, which is what
     every screen wide enough does; where it does not (a phone, at the scale
     that keeps the labels readable) they drift from the start of the path to
     the end of it across the same window, so the overview is walked rather
     than lost. `ph` is where in that drift each end of the hold sits, and on
     a wide screen it has no effect at all. */
  function camera(f, t, w) {
    var shots = f.shots, last = shots.length - 1, a, b, p;

    if (t <= shots[0].t) { a = b = shots[0]; p = 0; }
    else if (t >= shots[last].t) { a = b = shots[last]; p = 0; }
    else {
      var i = 1;
      while (i < last && shots[i].t < t) i++;
      a = shots[i - 1]; b = shots[i];
      p = (b.t > a.t) ? (t - a.t) / (b.t - a.t) : 1;
      p = p * p * (3 - 2 * p);
    }

    var span = a.span + (b.span - a.span) * p;
    var k = Math.max(w, K_REF) / span;
    var half = (w / k) / 2;

    function cxOf(s) {
      if (!s.est) return s.cx;
      var lo = f.x0 + half, hi = f.x1 - half;
      if (hi <= lo) return s.cx;            /* it all fits: stay on the centre */
      return lo + (hi - lo) * (s.ph || 0);
    }

    var ca = cxOf(a), cb = cxOf(b);
    return { cx: ca + (cb - ca) * p, k: k };
  }

  /* ----------------------------------------------------------------------
     STATE AT A TIME
     ---------------------------------------------------------------------- */

  function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

  function stateAt(t) {
    if (t <= 0) t = 0;
    if (t >= AUTH) t = AUTH;

    var i = 0;
    while (i < KEY.length - 1 && KEY[i + 1].t <= t) i++;
    var a = KEY[i], b = KEY[Math.min(i + 1, KEY.length - 1)];

    /* The discrete state is the frame that has started. */
    var st = {
      mode: a.m, view: a.v,
      hov: a.hov === undefined ? -1 : a.hov,
      sel: a.sel === undefined ? -1 : a.sel,
      mi: a.mi === undefined ? -1 : a.mi,
      fill: !!a.fill,
      cut: !!a.cut,
      x: a.x, y: a.y, press: 0
    };

    /* Once the field is filled it stays filled for the rest of the run. */
    for (var k = 0; k <= i; k++) if (KEY[k].fill) st.fill = true;

    if (b !== a && b.t > a.t) {
      var p = ease((t - a.t) / (b.t - a.t));
      st.x = a.x + (b.x - a.x) * p;
      st.y = a.y + (b.y - a.y) * p;
    }

    /* A press is a short pulse at the keyframe that carries it. */
    for (k = 0; k < KEY.length; k++) {
      if (KEY[k].press && t >= KEY[k].t && t < KEY[k].t + 0.26) {
        st.press = 1 - (t - KEY[k].t) / 0.26;
      }
    }
    return st;
  }

  /* ----------------------------------------------------------------------
     RENDER
     ---------------------------------------------------------------------- */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Copy is authored with the entities a typographer would use (an em dash,
     a real ellipsis), so a cell's text is trusted and a cell's data is not.
     There is no user input anywhere in this module; the escape is here so
     that the two kinds of string stay told apart on sight. */
  function raw(s) { return String(s); }

  function badge(s, t) { return '<span class="ap__st" data-t="' + t + '">' + raw(s) + '</span>'; }
  function actn(label, kind, hot) {
    return '<span class="ap__a" data-k="' + kind + '"' + (hot ? ' data-hot' : '') + '>' +
           raw(label) + '</span>';
  }

  /* One cell, whatever kind it is. */
  function cell(c, hot) {
    if (c && typeof c === 'object') {
      if (c.b !== undefined) return badge(c.b, c.t);
      return actn(c.a, c.k, hot);
    }
    return raw(c);
  }

  function table(st) {
    /* The end of the run puts the record back in the queue, resolved. A
       confirmation on an empty screen is a message about the system; the
       queue with the row changed is the result of the work. */
    var q = wf.queue[st.mode];
    var cols = wf.cols[st.mode];

    var head = '<tr>';
    for (var h = 0; h < cols.length; h++) head += '<th>' + raw(cols[h]) + '</th>';
    head += '</tr>';

    var body = '';
    for (var i = 0; i < wf.rows.length; i++) {
      var r = wf.rows[i];
      var hot = st.hov === i;
      var cells = (st.resolved && r.issue && r.done) ? r.done : r[st.mode];

      var tds = '';
      for (var c = 0; c < cells.length; c++) {
        /* Only the row the story is about has a live control. */
        tds += '<td>' + cell(cells[c], hot && r.issue) + '</td>';
      }

      body += '<tr' + (r.issue ? ' data-issue' : '') +
              (st.sel === i ? ' data-sel' : '') +
              (hot ? ' data-hov' : '') + '>' + tds + '</tr>';
    }

    return '<div class="ap__qh"><p class="ap__qt">' + raw(q[0]) + '</p>' +
           '<p class="ap__qn">' + raw(q[1]) + '</p></div>' +
           '<div class="ap__scroll"><table class="ap__tbl"><thead>' + head +
           '</thead><tbody>' + body + '</tbody></table></div>';
  }

  function menu(st) {
    var items = '';
    for (var i = 0; i < wf.menu.length; i++) {
      items += '<li><span class="ap__mi"' + (st.mi === i ? ' data-hot' : '') + '>' +
               raw(wf.menu[i]) + '</span></li>';
    }
    return '<div class="ap__menu"><ul>' + items + '</ul></div>';
  }

  function panel(st) {
    var P = wf.panel;
    var rows = '';
    for (var i = 0; i < P.fields.length; i++) {
      var f = P.fields[i];
      var val = (st.fill && f[2] !== undefined && f[1] === null) ? f[2] : f[1];
      var empty = !val;
      rows += '<div class="ap__f"' + (empty ? ' data-empty' : '') +
              (empty && st.mode === 'after' ? ' data-need' : '') + '>' +
              '<span>' + raw(f[0]) + (empty && st.mode === 'after' ? ' <i>Required</i>' : '') + '</span>' +
              '<b>' + (val ? raw(val) : ', ') + '</b></div>';
    }

    var head, action, m;
    if (st.mode === 'after') {
      m = P.after;
      head = '<p class="ap__p-s">' + badge(m.st[0], m.st[1]) + '</p>' +
             '<p class="ap__p-c">' + raw(m.cause) + '</p>' +
             '<p class="ap__p-m">' + raw(m.msg) + '</p>';
      var act = st.fill ? m.actFilled : m.act;
      action = actn(act.a, act.k, act.hot);
    } else {
      m = P.before;
      head = '<p class="ap__p-s">' + badge(m.st[0], m.st[1]) + '</p>' +
             '<p class="ap__p-m">' + raw(m.msg) + '</p>';
      action = actn(m.act.a, m.act.k, m.act.hot);
    }

    return '<div class="ap__panel">' +
             '<div class="ap__p-h"><p class="ap__p-t">' + raw(P.title) + '</p>' +
               '<span class="ap__x">&times;</span></div>' +
             '<div class="ap__p-b">' + head +
               '<p class="ap__p-l">' + raw(P.label) + '</p>' +
               '<div class="ap__fs">' + rows + '</div></div>' +
             '<div class="ap__p-f">' + action + '</div>' +
           '</div>';
  }

  function done() {
    return '<p class="ap__note">' + raw(wf.note) + '</p>' +
           table({ mode: 'after', view: 'list', hov: -1, sel: wf.doneSel, resolved: true });
  }

  var lastKey = '';

  function paint(st) {
    var key = wf.id + '|' + st.mode + '|' + st.view + '|' + st.hov + '|' + st.sel +
              '|' + st.mi + '|' + (st.fill ? 1 : 0);
    if (key !== lastKey) {
      lastKey = key;
      var html;
      if (st.view === 'done') html = done();
      else if (st.view === 'panel') html = panel(st);
      else html = table(st) + (st.view === 'menu' ? menu(st) : '');
      stage.innerHTML = html;
      root.setAttribute('data-mode', st.mode);
      if (phaseEl) phaseEl.textContent = st.mode === 'after' ? 'After' : 'Before';
      if (st.cut) { stage.classList.remove('is-cut'); void stage.offsetWidth; stage.classList.add('is-cut'); }
    }
    if (cursor) {
      cursor.style.transform = 'translate(' + st.x.toFixed(2) + 'cqw,' + st.y.toFixed(2) + 'cqh)';
      cursor.style.setProperty('--ap-press', st.press.toFixed(3));
    }
  }

  var cardEl = root.querySelector('[data-ap-card]');
  var cardTx = root.querySelector('[data-ap-card-t]');

  function paintCard(card, p) {
    var lvl = card ? cardLevel(p) : 0;
    if (card && cardTx && cardTx.textContent !== card.label) cardTx.textContent = card.label;
    root.style.setProperty('--ap-card', lvl.toFixed(3));
    root.setAttribute('data-card', lvl > 0.01 ? '1' : '0');
    if (cardEl) cardEl.setAttribute('aria-hidden', 'true');
  }

  /* ----------------------------------------------------------------------
     PAINTING THE FLOW

     Two things at a time: which step the reader is on, and where the camera
     is pointed. Both come out of the same authored time the application was
     painted from, so there is nothing to keep in step. There is only one
     value, read twice.
     ---------------------------------------------------------------------- */

  var viewEl = root.querySelector('[data-ap-view]');
  var mapEl = root.querySelector('[data-ap-map]');
  var SETS = {};

  /* The diagram is drawn from the workflow rather than written in the page,
     because the four of them differ only in their labels and the positions
     are arithmetic. Rebuilt on a switch, and only then. */
  function buildFlow() {
    if (!mapEl) return;
    var html = '';
    ['before', 'after'].forEach(function (mode) {
      var f = flowOf(wf, mode), s = '';
      for (var i = 0; i < f.labels.length; i++) {
        s += '<span class="ap__fl-n" data-s="next" style="--x:' + f.xs[i] + '">' +
             raw(f.labels[i]) + '</span>';
        if (i < f.labels.length - 1) {
          s += '<span class="ap__fl-l" data-s="next" style="--x:' + (f.xs[i] + NODE_W) + '"></span>';
        }
      }
      html += '<div class="ap__fl" data-flow="' + mode + '">' + s + '</div>';
    });
    mapEl.innerHTML = html;

    SETS = {};
    var flEls = mapEl.querySelectorAll('.ap__fl');
    for (var fi = 0; fi < flEls.length; fi++) {
      SETS[flEls[fi].getAttribute('data-flow')] = {
        nodes: flEls[fi].querySelectorAll('.ap__fl-n'),
        links: flEls[fi].querySelectorAll('.ap__fl-l')
      };
    }
  }

  /* Measured rather than assumed, because the scale is worked out from it.
     Re-measured on resize; nothing else in the module cares about width. */
  var viewW = 0, viewH = 0;
  function measureView() {
    if (!viewEl) return;
    var b = viewEl.getBoundingClientRect();
    viewW = b.width; viewH = b.height;
  }

  function setState(el, s) {
    if (el.getAttribute('data-s') !== s) el.setAttribute('data-s', s);
  }

  function paintFlow(a, mode) {
    var f = flowOf(wf, mode), set = SETS[mode];
    if (!f || !set || !mapEl) return;

    /* Taken, being taken, still to come. A step is "now" from the frame it
       starts on until the frame the next one starts on, which is the same
       rule the application's own frames follow. */
    for (var i = 0; i < set.nodes.length; i++) {
      var s = 'next';
      if (a >= f.at[i]) s = (i + 1 < f.at.length && a >= f.at[i + 1]) ? 'done' : 'now';
      setState(set.nodes[i], s);
    }
    for (var j = 0; j < set.links.length; j++) {
      setState(set.links[j], a >= f.at[j + 1] ? 'done' : 'next');
    }

    if (!viewW) measureView();
    if (!viewW) return;

    var cam = camera(f, a, viewW);
    var k = cam.k;
    var tx = viewW / 2 - cam.cx * k;
    var ty = viewH / 2 - FLOW_MID * k;
    mapEl.style.transform =
      'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + k.toFixed(4) + ')';
  }

  /* ----------------------------------------------------------------------
     THE PLAYER
     ---------------------------------------------------------------------- */

  var t = 0, playing = false, raf = 0, last = 0, scrubbing = false;

  function clock() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }
  function fmt(s) {
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function sync() {
    var m = mapTime(t);
    var st = stateAt(m.a);
    paint(st);
    paintCard(m.card, m.p);
    paintFlow(m.a, st.mode);
    if (!scrubbing) seek.value = String(Math.round((t / DUR) * 1000));
    if (nowEl) nowEl.textContent = fmt(t);
    root.setAttribute('data-playing', playing ? '1' : '0');
    root.setAttribute('data-ended', t >= DUR ? '1' : '0');
    if (playBtn) playBtn.setAttribute('aria-label', playing ? 'Pause' : (t >= DUR ? 'Replay' : 'Play'));
  }

  function frame() {
    var n = clock();
    t += (n - last) / 1000;
    last = n;
    if (t >= DUR) { t = DUR; playing = false; sync(); raf = 0; return; }
    sync();
    raf = window.requestAnimationFrame(frame);
  }

  function play() {
    if (playing) return;
    if (t >= DUR) t = 0;
    playing = true;
    last = clock();
    if (!raf) raf = window.requestAnimationFrame(frame);
    sync();
  }
  function pause() {
    playing = false;
    if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
    sync();
  }

  if (playBtn) {
    playBtn.addEventListener('click', function () { playing ? pause() : play(); });
  }

  seek.addEventListener('input', function () {
    scrubbing = true;
    t = (parseInt(seek.value, 10) / 1000) * DUR;
    if (playing) pause(); else sync();
  });
  seek.addEventListener('change', function () { scrubbing = false; });
  ['pointerup', 'blur'].forEach(function (e) {
    seek.addEventListener(e, function () { scrubbing = false; });
  });

  if (durEl) durEl.textContent = fmt(DUR);

  /* ----------------------------------------------------------------------
     THE SWITCHER

     Four buttons over one player. Choosing a workflow swaps the data the
     renderers read, rebuilds the diagram's nodes, rewrites the copy that
     belongs to it and returns the clock to zero. All of which is one
     synchronous pass, so the swap happens inside the click.
     ---------------------------------------------------------------------- */

  var subEl = root.querySelector('[data-ap-sub]');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-wf-tab]'));
  var navBtns = Array.prototype.slice.call(root.querySelectorAll('.ap__nav button'));
  var copyEls = {
    doing: document.querySelector('[data-wf-doing]'),
    broke: document.querySelector('[data-wf-broke]'),
    fixed: document.querySelector('[data-wf-fixed]'),
    name: document.querySelector('[data-wf-name]')
  };

  function writeCopy() {
    if (subEl) subEl.innerHTML = raw(wf.sub);
    if (copyEls.doing) copyEls.doing.innerHTML = raw(wf.doing);
    if (copyEls.broke) copyEls.broke.innerHTML = raw(wf.broke);
    if (copyEls.fixed) copyEls.fixed.innerHTML = raw(wf.fixed);
    if (copyEls.name) copyEls.name.textContent = wf.tab;
    if (srEl) srEl.textContent = wf.sr;

    for (var i = 0; i < navBtns.length; i++) {
      if (i === wf.nav) navBtns[i].setAttribute('aria-current', 'page');
      else navBtns[i].removeAttribute('aria-current');
    }
    for (var j = 0; j < tabs.length; j++) {
      var on = tabs[j].getAttribute('data-wf-tab') === wf.id;
      tabs[j].setAttribute('aria-selected', on ? 'true' : 'false');
      tabs[j].setAttribute('tabindex', on ? '0' : '-1');
    }
    root.setAttribute('data-wf', wf.id);
  }

  function use(id, focus) {
    var next = BY_ID[id];
    if (!next || next === wf) return;
    wf = next;
    lastKey = '';               /* force a repaint even on an identical frame */
    buildFlow();
    writeCopy();
    t = 0;
    measureView();
    if (reduce()) { pause(); } else { playing = false; play(); }
    if (focus) {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute('data-wf-tab') === id) { tabs[i].focus(); break; }
      }
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      use(btn.getAttribute('data-wf-tab'), false);
    });
    /* A tablist is driven with the arrow keys, and Home and End are the two
       everybody forgets. */
    btn.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(btn), n = tabs.length, to = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + n) % n;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = n - 1;
      if (to < 0) return;
      e.preventDefault();
      use(tabs[to].getAttribute('data-wf-tab'), true);
    });
  });

  /* ----------------------------------------------------------------------
     STARTING, AND STOPPING
     ---------------------------------------------------------------------- */

  /* It plays when it is on screen and stops when it is not. A demonstration
     running behind the reader is work nobody asked for. */
  var seen = false;

  function inView() {
    var r = root.getBoundingClientRect();
    if (!r.height) return false;                 /* the route is not on screen */
    var top = Math.max(r.top, 0), bot = Math.min(r.bottom, window.innerHeight);
    return (bot - top) / r.height > 0.45;
  }

  function maybeStart() {
    if (seen || playing || reduce()) return;
    if (!inView()) return;
    seen = true;
    play();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) maybeStart();
      else if (playing) pause();
    }, { threshold: 0.45 }).observe(root);
  }

  /* THE OBSERVER IS NOT ENOUGH ON ITS OWN. This case study is a hidden
     <main> until the router shows it, and a module inside a hidden ancestor
     reports no intersection at all, so on a deep link to #/audit the first
     record can be the only record, and it says nothing is on screen. These
     are the second and third asks: once the document has finished, and once
     the route has had a frame to settle. */
  window.addEventListener('load', maybeStart);
  window.addEventListener('hashchange', function () { setTimeout(maybeStart, 120); });
  setTimeout(maybeStart, 400);

  function reduce() {
    return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* The camera's scale is worked out from the width of the window it looks
     through, so a resized window is a re-measure and a repaint of the frame
     that is already up, not a reset, and not a jump. */
  var reflow = 0;
  function onResize() {
    if (reflow) return;
    reflow = window.requestAnimationFrame(function () {
      reflow = 0;
      measureView();
      sync();
    });
  }
  window.addEventListener('resize', onResize);
  if ('ResizeObserver' in window && viewEl) new ResizeObserver(onResize).observe(viewEl);
  window.addEventListener('hashchange', function () { setTimeout(onResize, 140); });
  window.addEventListener('load', onResize);

  buildFlow();
  writeCopy();
  measureView();
  sync();

})();


/* ===== js/px-emerge.js ===== */
/* ==========================================================================
   px-emerge.js, Carry is what comes out of the visit

   Five states on one attribute, walked once when the figure is on screen.
   The CSS in block 29 does all of the drawing; this only decides when.

   It never runs twice and it never runs backwards. A reader who scrolls past
   mid-sequence comes back to the finished diagram, which is the rule the rest
   of this document's scenes follow: no state a reader can arrive at is blank
   or half-built.
   ========================================================================== */

(function () {
  'use strict';

  var figs = document.querySelectorAll('[data-px-run]');
  if (!figs.length) return;

  var reduced = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Cumulative, in ms from the start. The visit is marked, a beat, then the
     lines take 460 to draw and the box comes in behind them rather than after
     them. That overlap is what makes it read as one movement out of the
     appointment instead of three things appearing in turn. */
  var STEPS = [420, 300, 520, 260];

  function run(fig) {
    var at = 0;
    (function next() {
      if (at >= STEPS.length) return;
      var wait = STEPS[at];
      setTimeout(function () {
        at += 1;
        fig.setAttribute('data-px', String(at));
        next();
      }, wait);
    })();
  }

  for (var i = 0; i < figs.length; i++) {
    (function (fig) {
      /* The four phases arrive in order, so each one carries its own delay. */
      var steps = fig.querySelectorAll('.px__steps > li');
      for (var k = 0; k < steps.length; k++) {
        steps[k].style.setProperty('--d', (k * 90) + 'ms');
      }

      if (reduced || !window.IntersectionObserver) {
        fig.setAttribute('data-px', '4');
        return;
      }

      fig.setAttribute('data-px', '0');

      var io = new IntersectionObserver(function (entries) {
        for (var e = 0; e < entries.length; e++) {
          if (!entries[e].isIntersecting) continue;
          io.disconnect();
          run(fig);
        }
      }, { threshold: 0.45 });

      io.observe(fig);
    })(figs[i]);
  }
})();


/* ===== js/pp-conf.js ===== */
/* ==========================================================================
   pp-conf.js: patient confidence through the conversation

   Three jobs: turn five readings into a smooth curve, draw that curve once
   when the figure is genuinely on screen, and morph it into the other journey
   when the switch is thrown.

   THE CURVE. A Catmull-Rom spline written out as cubic Béziers at a tension
   well under the usual sixth. It passes through every reading and eases into
   every change of direction, so a fall between two stages reads as a slope
   rather than a corner. The ends duplicate their neighbours, which stops the
   first and last segments kicking. Low tension is deliberate: at the textbook
   value this data overshoots into little waves the readings do not support.

   IT IS BUILT IN PIXELS. The obvious thing is a unit-square viewBox stretched
   to the figure, and it is a trap: the stretch is non-uniform, so every stroke
   needs vector-effect to stay a hairline, and vector-effect moves dash
   arithmetic into screen space, which makes a real path-length draw
   impossible. Writing a viewBox that matches the box in pixels and generating
   the geometry in those pixels makes the drawing 1:1 with the screen, so
   strokes are already right and getTotalLength() is a number the dash can be
   driven by.

   THE DRAW. dasharray and dashoffset both at the full length, eased down to
   zero over two seconds, so the visible end of the stroke travels the actual
   geometry. The stage points and words are revealed by DISTANCE, not by a
   share of the clock: the length between two stages depends on how far that
   persona's confidence moved, so a point appears exactly as the edge reaches
   it and never before.

   THE MORPH. Both journeys are five readings at the same five x positions, so
   there is nothing to match up: the tween is on the y values alone and the
   curve is rebuilt from the tweened numbers every frame. Points and guide
   drops move from the same numbers in the same frame, so the path cannot
   drift off its own markers and no frame is an angular version of either end.

   The entrance runs once. Toggling does not replay it. Under
   prefers-reduced-motion both the draw and the tween are skipped.
   ========================================================================== */

(function () {
  'use strict';

  var figs = document.querySelectorAll('[data-ppc]');
  if (!figs.length) return;

  var reduced = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var T     = 0.22;    /* spline tension, restrained on purpose */
  var MORPH = 600;     /* ms */
  var DRAW  = 2000;    /* ms, inside the 1.8–2.2 the brief asks for */

  function clamp(i) { return i < 0 ? 0 : (i > 4 ? 4 : i); }
  function easeInOut(t) { return 0.5 - Math.cos(Math.PI * t) / 2; }   /* gentle */
  function easeCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }

  function build(fig) {
    var svg    = fig.querySelector('.pp__line');
    var path   = fig.querySelector('.pp__curve');
    var pts    = [].slice.call(fig.querySelectorAll('.pp__pt'));
    var lis    = [].slice.call(fig.querySelectorAll('.pp__em-row li'));
    var guides = [].slice.call(fig.querySelectorAll('.pp__guides line'));
    if (!svg || !path || pts.length !== 5) return;

    var NOW = pts.map(function (p) { return parseFloat(p.getAttribute('data-now')); });
    var NEW = pts.map(function (p) { return parseFloat(p.getAttribute('data-new')); });

    var at = NOW.slice();
    var state = 'now';
    var W = 0, H = 0, XS = [], stops = [];
    var drawn = false, raf = null;

    /* Five readings -> one cubic path through all five, in pixels. */
    function curve(ys) {
      var Y = ys.map(function (v) { return v / 100 * H; });
      var d = 'M' + XS[0].toFixed(2) + ',' + Y[0].toFixed(2);
      for (var i = 0; i < 4; i++) {
        var x0 = XS[clamp(i-1)], y0 = Y[clamp(i-1)];
        var x1 = XS[i],          y1 = Y[i];
        var x2 = XS[i+1],        y2 = Y[i+1];
        var x3 = XS[clamp(i+2)], y3 = Y[clamp(i+2)];
        d += ' C' + (x1 + (x2-x0)*T).toFixed(2) + ',' + (y1 + (y2-y0)*T).toFixed(2) +
             ' '  + (x2 - (x3-x1)*T).toFixed(2) + ',' + (y2 - (y3-y1)*T).toFixed(2) +
             ' '  + x2.toFixed(2) + ',' + y2.toFixed(2);
      }
      return d;
    }

    function paint(ys) {
      if (!W) return;
      path.setAttribute('d', curve(ys));
      for (var i = 0; i < 5; i++) {
        pts[i].style.setProperty('--yy', ys[i].toFixed(2));
        if (guides[i]) {
          guides[i].setAttribute('x1', XS[i].toFixed(2));
          guides[i].setAttribute('x2', XS[i].toFixed(2));
          guides[i].setAttribute('y1', (ys[i] / 100 * H).toFixed(2));
          guides[i].setAttribute('y2', H.toFixed(2));
        }
      }
    }

    /* How far along the path each stage sits. Walked once per layout, so the
       reveal follows the curve's real distances rather than the clock. */
    function measureStops() {
      var L = path.getTotalLength();
      stops = [0];
      for (var i = 1; i < 5; i++) {
        var lo = 0, hi = L, x = XS[i];
        for (var k = 0; k < 24; k++) {
          var mid = (lo + hi) / 2;
          if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid;
        }
        stops.push((lo + hi) / 2);
      }
      return L;
    }

    function layout() {
      /* clientWidth/Height, not getBoundingClientRect: below 1040 the whole
         figure is scaled by a transform, and the rect is the scaled box. The
         drawing has to be built in the element's OWN pixels so that the
         transform then shrinks it like everything else in the figure, 
         including the stroke. Built from the rect instead, the geometry is
         still right but the hairline stays 1.5px at every width, which is the
         one part of the chart that would not scale with the rest. */
      var w = Math.round(svg.clientWidth), h = Math.round(svg.clientHeight);
      if (!w || !h) {
        var r = svg.getBoundingClientRect();
        w = Math.round(r.width); h = Math.round(r.height);
      }
      if (!w || !h || (w === W && h === H)) return false;
      W = w; H = h;
      XS = [0, 1, 2, 3, 4].map(function (i) { return i / 4 * W; });
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      paint(at);
      return true;
    }

    function showAll() {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      for (var i = 0; i < 5; i++) {
        pts[i].classList.add('is-in');
        if (lis[i]) lis[i].classList.add('is-in');
        if (guides[i]) guides[i].classList.add('is-in');
      }
    }

    function travel() {
      if (drawn) return;
      drawn = true;
      if (!layout() && !W) return;
      if (reduced) { showAll(); return; }

      var L = measureStops();
      path.style.strokeDasharray = L;
      path.style.strokeDashoffset = L;

      var t0 = null;
      (function step(now) {
        if (t0 === null) t0 = now;
        var k = Math.min(1, (now - t0) / DRAW);
        var e = easeInOut(k);
        path.style.strokeDashoffset = (L * (1 - e)).toFixed(2);
        var reachedTo = L * e;
        for (var i = 0; i < 5; i++) {
          if (reachedTo >= stops[i] && !pts[i].classList.contains('is-in')) {
            pts[i].classList.add('is-in');
            if (lis[i]) lis[i].classList.add('is-in');
            if (guides[i]) guides[i].classList.add('is-in');
          }
        }
        if (k < 1) requestAnimationFrame(step);
        else { path.style.strokeDasharray = 'none'; path.style.strokeDashoffset = '0'; }
      })(performance.now());
    }

    function go(to) {
      if (to === state) return;
      state = to;
      fig.setAttribute('data-ppc-state', to);
      fig.querySelectorAll('[data-ppc-set]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-ppc-set') === to ? 'true' : 'false');
      });
      /* The entrance is over; a toggle morphs, it does not redraw. */
      fig.setAttribute('data-ppc-live', '1');
      if (!drawn) { drawn = true; showAll(); }

      var from = at.slice();
      var dest = to === 'new' ? NEW : NOW;
      if (reduced) { at = dest.slice(); paint(at); return; }

      if (raf) cancelAnimationFrame(raf);
      var t0 = null;
      (function step(now) {
        if (t0 === null) t0 = now;
        var k = Math.min(1, (now - t0) / MORPH), e = easeCubic(k);
        for (var i = 0; i < 5; i++) at[i] = from[i] + (dest[i] - from[i]) * e;
        paint(at);
        raf = k < 1 ? requestAnimationFrame(step) : null;
      })(performance.now());
    }

    fig.querySelectorAll('[data-ppc-set]').forEach(function (b) {
      b.addEventListener('click', function () { go(b.getAttribute('data-ppc-set')); });
    });

    /* Rebuilding on a width change touches only attributes on the drawing,
       never a box any observer is watching. */
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (layout() && drawn) { path.style.strokeDasharray = 'none'; path.style.strokeDashoffset = '0'; }
      }).observe(svg);
    }
    layout();

    if (reduced || !window.IntersectionObserver) { travel(); return; }
    /* Half of it has to be on screen, so scrolling past its edge does not
       start a journey nobody is looking at. */
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) {
        if (!es[i].isIntersecting) continue;
        io.disconnect();
        travel();
      }
    }, { threshold: 0.5 });
    io.observe(fig);
  }

  for (var i = 0; i < figs.length; i++) build(figs[i]);

  /* --- below 1040: one number, the same shape as the other fit scripts ---- */
  var wraps = document.querySelectorAll('[data-ppc-fit]');
  function fit() {
    for (var i = 0; i < wraps.length; i++) {
      var w = wraps[i], em = w.firstElementChild;
      if (!w.getClientRects().length) continue;
      var room = w.clientWidth;
      var natural = parseFloat(getComputedStyle(w).getPropertyValue('--ppc-w-px')) || 737;
      if (!room || !natural) continue;
      var s = Math.min(1, room / natural);
      if (Math.abs(s - (parseFloat(em.style.getPropertyValue('--ppc-s')) || 1)) < 0.002) continue;
      em.style.setProperty('--ppc-s', s);
    }
  }
  if (wraps.length) {
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(fit);
      for (var k = 0; k < wraps.length; k++) ro.observe(wraps[k]);
    } else { window.addEventListener('resize', fit); }
    window.addEventListener('hashchange', function () { setTimeout(fit, 0); });
    fit();
    window.addEventListener('load', fit);
  }
})();


/* ===== js/au-personas.js ===== */
/* ==========================================================================
   au-personas.js: the audit's proto-persona deck

   Three cards, one at a time, previous and next. The card that is showing
   runs its ecosystem once: the nodes arrive left to right, the diagram moves
   in on the portal node, the two or three things that matter to that role
   inside it are readable for a few seconds, and then it pulls back out.

   THE ZOOM IS ARITHMETIC, NOT A GUESS. Scaling a row about its own left edge
   maps a point x to tx + x·s, so putting the portal node's centre in the
   middle of the window is one line: tx = W/2 − cx·s. Measured from the live
   boxes every time it runs, so it is right at any width, at any type size,
   and after any reflow.

   It runs once per card rather than looping. The point lands the first time,
   and a diagram that keeps moving under a paragraph is a diagram nobody
   finishes reading.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var STEP = 90;      /* between one node arriving and the next */
  var HOLD = 520;     /* after the last node, before moving in */
  var ZOOM = 2600;    /* how long the examples stay readable */
  var SCALE = 1.75;

  function build(deck) {
    if (deck.hasAttribute('data-ape-ready')) return;
    deck.setAttribute('data-ape-ready', '1');

    var cards = deck.querySelectorAll('[data-ape-card]');
    var prev = deck.querySelector('[data-ape-prev]');
    var next = deck.querySelector('[data-ape-next]');
    var pos = deck.querySelector('[data-ape-i]');
    if (!cards.length) return;

    var at = 0;
    var timers = [];

    function clear() {
      for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
      timers = [];
    }

    var still = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* Below the deck's own breakpoint the ecosystem is a column, the portal
       node is already most of the width, and the examples are simply shown, 
       so there is nothing to move in on. */
    function narrow() { return deck.clientWidth <= 700; }

    function run(card) {
      var flow = card.querySelector('[data-ape-flow]');
      var px = card.querySelector('[data-ape-px]');
      var nodes = card.querySelectorAll('.ape__n');
      if (!flow) return;

      flow.style.transform = '';
      card.classList.remove('is-run', 'is-zoom');

      for (var i = 0; i < nodes.length; i++) {
        nodes[i].style.setProperty('--d', (still ? 0 : i * STEP) + 'ms');
      }

      /* The frame has to be as tall as the magnified node will be, or the
         magnification runs off the top and bottom of its own window. The node
         is measured here rather than guessed, so it holds at any width and
         after any reflow. */
      var frame = flow.parentNode;
      if (px && !narrow()) {
        frame.style.setProperty('--ape-h',
          Math.ceil(px.getBoundingClientRect().height * SCALE + 10) + 'px');
      } else {
        frame.style.removeProperty('--ape-h');
      }

      /* Reading a box forces the browser to settle the frame it was just
         given, so the beats below start from the layout the card actually
         has rather than the one it had a frame ago. */
      void card.offsetWidth;
      card.classList.add('is-run');

      if (still || narrow() || !px) return;

      var inAt = nodes.length * STEP + HOLD;

      timers.push(setTimeout(function () {
        var fw = frame.clientWidth;
        var fr = frame.getBoundingClientRect();
        var pr = px.getBoundingClientRect();
        /* The portal node's centre in the flow's own coordinates, before any
           transform. The flow is untransformed at this moment, so the live
           box is that coordinate. */
        var cx = (pr.left - fr.left) + pr.width / 2 - frameInset(frame);
        var tx = fw / 2 - cx * SCALE;
        flow.style.transform = 'translateX(' + tx.toFixed(1) + 'px) scale(' + SCALE + ')';
        card.classList.add('is-zoom');
      }, inAt));

      timers.push(setTimeout(function () {
        flow.style.transform = '';
        card.classList.remove('is-zoom');
      }, inAt + ZOOM));
    }

    /* The frame's own padding is not part of the flow's coordinate system. */
    function frameInset(frame) {
      var pad = parseFloat(getComputedStyle(frame).paddingLeft);
      return isNaN(pad) ? 0 : pad;
    }

    function show(i, focus) {
      clear();
      at = Math.max(0, Math.min(cards.length - 1, i));
      for (var k = 0; k < cards.length; k++) {
        var on = k === at;
        if (on) cards[k].setAttribute('data-ape-on', '1');
        else {
          cards[k].removeAttribute('data-ape-on');
          cards[k].classList.remove('is-run', 'is-zoom');
          var f = cards[k].querySelector('[data-ape-flow]');
          if (f) f.style.transform = '';
        }
      }
      if (pos) pos.textContent = String(at + 1);
      if (prev) prev.disabled = at === 0;
      if (next) next.disabled = at === cards.length - 1;
      run(cards[at]);
      if (focus) {
        var live = cards[at].querySelector('.ape__name');
        if (live) { live.setAttribute('tabindex', '-1'); live.focus(); }
      }
    }

    if (prev) prev.addEventListener('click', function () { show(at - 1, true); });
    if (next) next.addEventListener('click', function () { show(at + 1, true); });

    /* THE DECK IS MEASURED AT ZERO UNTIL SOMEONE OPENS THE SECTION.

       It lives inside a closed accordion, which is display:none, so every
       width this file reads at load time is 0, and a zoom computed from a
       window that is not there puts the portal node nowhere. So the run is
       tied to the deck actually having a size: the moment it goes from no
       width to a width, the card on screen runs. That covers the section
       being opened, the window being resized, and the page being restored at
       a different size, with one observer and no polling. */
    var had = 0;
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () {
        var w = deck.clientWidth;
        if (!w) { had = 0; return; }
        /* Only on the transition into having a size, or across the
           breakpoint the layout changes at, not on every pixel of a drag. */
        var crossed = (had === 0) || ((had <= 700) !== (w <= 700));
        had = w;
        if (crossed) show(at, false);
      });
      ro.observe(deck);
    }

    show(0, false);
  }

  function init(scope) {
    scope = scope || document;
    var decks = scope.querySelectorAll('[data-ape]');
    for (var i = 0; i < decks.length; i++) build(decks[i]);
  }

  var prevInit = PF.initRoutes;
  if (typeof prevInit === 'function') {
    PF.initRoutes = function (scope) { prevInit(scope); init(scope); };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }

})(window.PF);


/* ===== js/pv-fit.js ===== */
/* ==========================================================================
   pv-fit.js. One number, and nothing else

   The browser is laid out at a fixed natural size below 960 and scaled to
   whatever the row can give it. This works out that scale. It does not work
   out the height, or the centring, or anything else: 30-pv-fit.css derives
   the wrapper's box from the same two constants, so the geometry is arithmetic
   rather than something read back off the page.

   WHY IT IS WRITTEN THIS WAY. The first version observed the wrapper AND the
   browser, then wrote a height onto the wrapper and a margin onto the browser
. A ResizeObserver being handed its own output, which is exactly what
   "ResizeObserver loop completed with undelivered notifications" reports. The
   rules this now keeps:

     · one observer, registered once, on the wrapper only;
     · the wrapper is never written to by this file;
     · the only write is a custom property that drives a transform, and a
       transform changes no box that any observer is watching;
     · and it is skipped entirely unless the scale actually moved.
   ========================================================================== */

(function () {
  'use strict';

  var wrap = document.querySelector('[data-pv-fit]');
  if (!wrap) return;
  var pv = wrap.querySelector('.hero__work');
  if (!pv) return;

  var last = -1;

  function measure() {
    /* display:contents above 960: no box, nothing to scale. */
    if (!wrap.getClientRects().length) {
      if (last !== -1) { pv.style.removeProperty('--pv-s'); last = -1; }
      return;
    }
    var room = wrap.clientWidth;
    if (!room) return;

    var natural = parseFloat(getComputedStyle(wrap).getPropertyValue('--pv-w-px')) || 461;
    var s = Math.min(1, room / natural);

    /* Sub-pixel churn is not a change worth a style write. */
    if (Math.abs(s - last) < 0.002) return;
    last = s;
    pv.style.setProperty('--pv-s', s);
  }

  if (window.ResizeObserver) {
    /* The wrapper only. Its width is decided by the hero's grid and its
       height by aspect-ratio; this file changes neither. */
    new ResizeObserver(measure).observe(wrap);
  } else {
    window.addEventListener('resize', measure);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', measure);
  } else { measure(); }
  window.addEventListener('load', measure);
})();


/* ===== js/projects.js ===== */
/* ==========================================================================
   projects.js. The hero's project browser

   Five projects, one frame. This file changes which slide is showing and what
   the single action points at, and nothing else: it never writes a width, a
   height or a position, because the frame's stability is a layout property and
   not something a script should be responsible for maintaining.

   Nothing rotates on its own. A recruiter decides when the project changes. 
   An unattended carousel is a thing you wait out, not a thing you use.

   Three ways in, all of them the same code path: the two arrows, the left and
   right keys while focus is inside the browser, and a horizontal swipe. The
   keys are deliberately scoped to focus rather than to the document, so
   arrowing through a page does not silently drive a widget somewhere else on
   it.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.querySelector('[data-pv]');
  if (!root) return;

  /* Every slide in the shell, across all three modes. `slides` below is only
     the ones the current mode owns. */
  var all = [].slice.call(root.querySelectorAll('[data-pv-slide]'));
  if (all.length < 2) return;

  var MODES = { design: 1, illustration: 1, music: 1 };
  var mode = 'design';
  var slides = all;

  var stage = root.querySelector('[data-pv-stage]');
  var cta = root.querySelector('[data-pv-cta]');
  var idxEl = root.querySelector('[data-pv-i]');
  var totEl = root.querySelector('[data-pv-n]');
  var prevBtn = root.querySelector('[data-pv-prev]');
  var nextBtn = root.querySelector('[data-pv-next]');

  var still = !!(window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var at = 0;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* One step. `dir` is +1 or -1 and is used for nothing but which side the
     incoming slide arrives from: the browser wraps, so it cannot be inferred
     from the indices. */
  function show(to, dir) {
    if (!slides.length) return;
    at = (to + slides.length) % slides.length;

    /* Everything that is not the one showing goes, including the slides that
       belong to the other two modes. `hidden` here is an attribute the CSS
       reads as "still in the box, still holding its space, just not visible or
       reachable". The shell's dimensions come from the first slide in flow,
       whichever mode it belongs to, which is what makes all three modes
       exactly the same size. */
    for (var i = 0; i < all.length; i++) {
      if (all[i] === slides[at]) continue;
      all[i].hidden = true;
      all[i].removeAttribute('data-enter');
    }

    var el = slides[at];

    if (still) {
      el.hidden = false;
    } else {
      /* Placed just off its resting position on the side it is coming from,
         made visible, then released. Two frames rather than one: the first
         commits the offset while the element is still hidden, the second lets
         the transition run. */
      el.setAttribute('data-enter', dir < 0 ? 'prev' : 'next');
      el.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { el.removeAttribute('data-enter'); });
      });
    }

    if (idxEl) idxEl.textContent = pad(at + 1);
    if (totEl) totEl.textContent = pad(slides.length);

    /* The incoming frame may never have had a box to measure. */
    if (typeof fit === 'function') fit();

    if (cta) {
      /* THE CAROUSEL DOES NOT KNOW WHERE ANYTHING IS. It asks the route map,
         the same one the cards and the case-study feet ask, so a slide and
         the card for the same project can never point at different places.
         See js/routes.js. */
      var proj = (window.PF && PF.project) ? PF.project(el.getAttribute('data-project')) : null;
      var live = proj && proj.status === 'live';
      var lab = cta.querySelector('[data-cta-label]') || cta;

      if (live) {
        cta.setAttribute('href', proj.route);
        cta.removeAttribute('aria-disabled');
        cta.setAttribute('tabindex', '0');
        cta.setAttribute('aria-label', PF.CTA.study + ': ' + proj.name);
        lab.textContent = PF.CTA.study;

        /* Half of these studies are published elsewhere. The button says so
           before it is pressed rather than after, and the attributes are set
           and cleared every time because one <a> serves every slide. */
        if (PF.isExternal && PF.isExternal(proj)) {
          cta.setAttribute('target', '_blank');
          cta.setAttribute('rel', 'noopener noreferrer');
          lab.setAttribute('data-external', '1');
        } else {
          cta.removeAttribute('target');
          cta.removeAttribute('rel');
          lab.removeAttribute('data-external');
        }
      } else {
        /* No study written: the zone keeps its size so the frame does not
           move between slides, but there is nothing to tap and the words say
           why. A disabled-looking button with no explanation is the thing
           this replaced. */
        cta.removeAttribute('href');
        cta.removeAttribute('target');
        cta.removeAttribute('rel');
        lab.removeAttribute('data-external');
        cta.setAttribute('aria-disabled', 'true');
        cta.setAttribute('tabindex', '-1');
        cta.removeAttribute('aria-label');
        lab.textContent = proj ? PF.CTA.soon : '';
      }
      cta.setAttribute('data-status', live ? 'live' : 'soon');
      cta.style.visibility = proj ? '' : 'hidden';
    }
  }

  /* ---- the shell holds; its contents change --------------------------------

     One browser, three sets. Switching mode never touches the frame: the bar,
     the reserved head, the stage and the action are the same elements at the
     same size, and all that happens is which slides the arrows and the counter
     are walking through. Nothing here writes a dimension. */
  function setMode(next) {
    if (!MODES[next] || next === mode) return;
    mode = next;

    slides = all.filter(function (el) {
      return el.getAttribute('data-mode') === mode;
    });
    if (!slides.length) slides = all;

    at = 0;
    show(0, 1);
  }

  document.addEventListener('pf:role', function (e) {
    setMode(e && e.detail && e.detail.role);
  });

  /* ---- driven from the thread's project list --------------------------

     The list at the end of the conversation names the same projects this
     browser holds, because both are read from the same cards. Pointing at a
     name there brings the project up here, through the same `show()` every
     arrow, key and swipe uses, so the transition is the one the browser
     already has and there is nothing new to look at.

     Matched by name rather than by index: the two sets are not the same
     length or the same order, and a name is what a reader is pointing at. A
     name with no slide in the current mode is simply ignored. */
  /* THE NAME IS NOT ALWAYS THE HEADING. A slide can carry a title that says
     more than the project is called, "Carry: A Patient Companion Extension"
     is a heading, "Carry" is what the card below it is named, and the two
     sets are matched by name. So a slide may declare one, and the heading is
     only the fallback for a slide that has not. */
  function slideName(el) {
    var given = el.getAttribute('data-pv-name');
    if (given) return given.trim().toLowerCase();
    var t = el.querySelector('.pv__title');
    return (t ? t.textContent : el.getAttribute('aria-label') || '').trim().toLowerCase();
  }

  document.addEventListener('pf:project', function (e) {
    var want = e && e.detail && e.detail.name;
    if (!want) return;
    want = String(want).trim().toLowerCase();
    for (var i = 0; i < slides.length; i++) {
      if (slideName(slides[i]) !== want) continue;
      if (i === at) return;
      show(i, i > at ? 1 : -1);
      return;
    }
  });

  function step(dir) { show(at + dir, dir); }

  if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });

  /* Keys, only while the focus is inside the browser. */
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
  });

  /* Swipe. Horizontal intent only, and only past a distance a scroll would not
     produce. A vertical drag that wanders forty pixels sideways is somebody
     scrolling the page, not somebody changing project. */
  var x0 = null, y0 = null;

  if (stage) {
    stage.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY;
    }, { passive: true });

    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var t = e.changedTouches[0];
      var dx = t.clientX - x0, dy = t.clientY - y0;
      x0 = y0 = null;
      if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---- fitting the framed previews ------------------------------------

     Three of the five previews are the project's own component running in its
     own document, authored at its own size. A 390pt phone, a 1000-unit
     artboard, a 1200x720 scene. None of them is going to reflow to a 300px
     column, and none of them should have to: they are the real thing, and the
     real thing has a shape.

     So each frame keeps its authored size and is scaled to the stage. The
     ratio has to be a unitless number and CSS cannot divide a length by a
     length, so it is computed here. The smaller of the two axes, so the
     preview is always contained and never cropped, and never enlarged past
     1:1 either, which would only make it soft. */
  function fit() {
    /* Only the framed previews that are authored at a fixed size. The audit
       is fluid (it has no --pv-w to divide by and needs no scale), and the
       loop below skips it on that alone, but naming it here is clearer than
       relying on a missing value. */
    var frames = root.querySelectorAll('.pv__embed:not(.pv__embed--dsa)');
    if (!frames.length) return;

    /* One read pass then one write pass, so the layout is computed once
       rather than once per frame. */
    var boxes = [];
    for (var i = 0; i < frames.length; i++) {
      var cs = window.getComputedStyle(frames[i]);
      boxes.push({
        el: frames[i],
        r: frames[i].getBoundingClientRect(),
        w: parseFloat(cs.getPropertyValue('--pv-w')) || 0,
        h: parseFloat(cs.getPropertyValue('--pv-h')) || 0
      });
    }

    for (i = 0; i < boxes.length; i++) {
      var b = boxes[i];
      if (!b.w || !b.h || !b.r.width) continue;
      var s = Math.min(b.r.width / b.w, b.r.height / b.h, 1);
      b.el.style.setProperty('--pv-scale', s.toFixed(4));
      /* Only now is the frame worth looking at. Before this it is at its
         authored size in a box that clips, so the stylesheet keeps it
         invisible rather than showing a cropped phone for a frame or two. */
      b.el.setAttribute('data-fit', '1');
      tell(b.el, s);
    }
  }

  /* AND THE FRAME IS TOLD HOW SMALL IT ENDED UP.

     A framed preview keeps its authored size (the document inside measures
     1000 however narrow the card gets), so it has no way of knowing that it
     is being painted at a third of that. Which is fine for a mock of a phone,
     and not fine for a diagram: type sized to fit a box at 1:1 crowds the
     same box's edges once the whole scene is a quarter of the width, and by
     the composition breakpoint the labels are touching the shapes they sit
     in. The number is known here, so it is sent. The same way the theme is,
     since postMessage crosses an opaque origin and a direct property access
     does not. What a document does with it is its own business. */
  function tell(el, s) {
    var frame = el.querySelector('iframe');
    if (!frame || !frame.contentWindow) return;
    try { frame.contentWindow.postMessage({ pfScale: +s.toFixed(4) }, '*'); }
    catch (e) { /* a frame that is not ready yet asks for it itself */ }
  }

  /* A frame that loaded after the last fit() asks, rather than waiting for
     the next resize. */
  window.addEventListener('message', function (e) {
    if (!e || !e.data || !e.data.pfScaleRequest) return;
    fit();
  });

  var ft;
  window.addEventListener('resize', function () {
    clearTimeout(ft);
    ft = setTimeout(fit, 120);
  });

  /* MEASURE WHEN THERE IS SOMETHING TO MEASURE, NOT WHEN THE SCRIPT RUNS.

     A preview whose box is zero at the moment fit() happens to run gets no
     scale at all, and a frame with no scale renders at its authored size (
     390 x 760 for the phone) inside a box that clips. That is the bug this
     replaces: on a cold load the phone came out cropped top and bottom, and a
     refresh "fixed" it, because a warm cache simply changed the order layout
     and script arrived in. A bug that depends on cache timing is not a
     rendering bug, it is a measurement taken too early.

     So the measurement is taken repeatedly, and always after the browser has
     finished a layout:

       rAF          after the first layout of this frame, not during it
       fonts.ready  a metric font swap changes every box on the page
       load         a framed document that reports its size late
       observer     and anything else. A slide becoming visible, the role
                    filter switching, a column resizing. This is the one that
                    actually guarantees it, because it fires on the exact
                    event the old code was guessing at.

     fit() is idempotent and cheap, so running it more often than strictly
     needed costs a read pass and buys the frame never being wrong. */
  function refit() { requestAnimationFrame(fit); }

  refit();
  window.addEventListener('load', refit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);

  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(function () { fit(); });
    var watched = root.querySelectorAll('.pv__embed:not(.pv__embed--dsa)');
    for (var wi = 0; wi < watched.length; wi++) ro.observe(watched[wi]);
  }

  /* Start in the mode the selector starts in. */
  var startBtn = document.querySelector('[data-role][aria-selected="true"]');
  var startKey = (startBtn && startBtn.getAttribute('data-role')) || 'design';
  slides = all.filter(function (el) {
    return el.getAttribute('data-mode') === startKey;
  });
  if (!slides.length) slides = all;
  mode = MODES[startKey] ? startKey : 'design';

  show(0, 1);
})();


/* ===== js/encryption.js ===== */
/* ==========================================================================
   encryption.js: Cryptography card thumbnail loop
   Component IIFE pasted verbatim, followed by host-side viewport gating.
   ========================================================================== */

(function(){
  "use strict";

  /* ====================================================================
     COMPONENT SCRIPT
     One IIFE. Builds the artboard DOM into every .ec-thumb-root found,
     scales it to its container via ResizeObserver, and drives the whole
     loop off a single requestAnimationFrame per instance so it can be
     paused/resumed cleanly. No external requests, no bare timers.
     ==================================================================== */

  var ART_W = 1040;
  var ART_H = 800;

  /* ---------------- timing ----------------
     The two churns are no longer the same event. Sealing is bookkeeping. The
     letters go away, three steps and done. Unsealing is the payoff, so it gets
     more than twice the steps, a slower step, and a wider stagger, which turns
     the sweep across the grid from a flicker into something you can follow.

     Each cell then SETTLES: at the instant its letter comes back it spikes in
     scale and brightness and falls off over 340ms. The old pop only ran while
     a cell was still churning hex, so the one moment worth marking (the
     letter arriving) was the one moment nothing happened.

     The loop grew from 6000 to 7600 to pay for it, and so the revealed message
     gets about two seconds on screen rather than half of one. */
  var LOOP_MS = 7600;
  var LOCK_START = 1500;
  var UNLOCK_START = 4200;

  var LOCK_STAGGER = 22,  LOCK_STEPS = 3,  LOCK_STEP_MS = 40;
  var UNLOCK_STAGGER = 34, UNLOCK_STEPS = 8, UNLOCK_STEP_MS = 34;
  var SETTLE_MS = 430;

  var MESSAGE_WORDS = ["Meet", "me", "at", "the", "pier", "at", "9"];

  /* The halo takes the same hue the revealed letters do; --ec-flash-glow in
     05-encryption.css holds the channels so the two cannot drift apart. */
  var FLASH_RGB = "var(--ec-flash-glow)";
  var HEX = "0123456789ABCDEF";

  function randomHexPair(){
    return HEX[(Math.random() * 16) | 0] + HEX[(Math.random() * 16) | 0];
  }

  function svgLockIcon(){
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 44 44");
    svg.setAttribute("class", "ec-lock-svg");

    var shackle = document.createElementNS(ns, "path");
    shackle.setAttribute("class", "ec-lock-shackle");
    shackle.setAttribute("d", "M13 18V14C13 8.5 17 4.5 22 4.5C27 4.5 31 8.5 31 14V18");
    shackle.setAttribute("fill", "none");
    shackle.style.stroke = "var(--ec-dim)";
    shackle.setAttribute("stroke-width", "3.6");
    shackle.setAttribute("stroke-linecap", "round");

    var body = document.createElementNS(ns, "rect");
    body.setAttribute("class", "ec-lock-body");
    body.setAttribute("x", "9");
    body.setAttribute("y", "18");
    body.setAttribute("width", "26");
    body.setAttribute("height", "20");
    body.setAttribute("rx", "5");
    body.style.fill = "var(--ec-dim)";

    var hole1 = document.createElementNS(ns, "circle");
    hole1.setAttribute("cx", "22");
    hole1.setAttribute("cy", "26.5");
    hole1.setAttribute("r", "2.6");
    hole1.style.fill = "var(--ec-panel)";

    var hole2 = document.createElementNS(ns, "rect");
    hole2.setAttribute("x", "20.7");
    hole2.setAttribute("y", "27.3");
    hole2.setAttribute("width", "2.6");
    hole2.setAttribute("height", "5.2");
    hole2.setAttribute("rx", "1.1");
    hole2.style.fill = "var(--ec-panel)";

    svg.appendChild(shackle);
    svg.appendChild(body);
    svg.appendChild(hole1);
    svg.appendChild(hole2);

    return { svg: svg, shackle: shackle, body: body };
  }

  function buildArtboard(root){
    var artboard = document.createElement("div");
    artboard.className = "ec-artboard";

    var glow = document.createElement("div");
    glow.className = "ec-glow";
    artboard.appendChild(glow);

    var panel = document.createElement("div");
    panel.className = "ec-panel";
    artboard.appendChild(panel);

    var eyebrow = document.createElement("div");
    eyebrow.className = "ec-eyebrow";
    eyebrow.textContent = "01 · the idea";
    panel.appendChild(eyebrow);

    var statusRow = document.createElement("div");
    statusRow.className = "ec-status-row";
    panel.appendChild(statusRow);

    var lock = svgLockIcon();
    statusRow.appendChild(lock.svg);

    var statusLabel = document.createElement("div");
    statusLabel.className = "ec-status-label";
    statusRow.appendChild(statusLabel);

    var openTxt = document.createElement("span");
    openTxt.className = "ec-status-txt";
    openTxt.textContent = "open";
    openTxt.style.color = "var(--ec-dim)";
    statusLabel.appendChild(openTxt);

    var lockedTxt = document.createElement("span");
    lockedTxt.className = "ec-status-txt";
    lockedTxt.textContent = "locked";
    lockedTxt.style.color = "var(--ec-sealed)";
    statusLabel.appendChild(lockedTxt);

    var grid = document.createElement("div");
    grid.className = "ec-grid";
    panel.appendChild(grid);

    var cells = [];
    MESSAGE_WORDS.forEach(function(word){
      var wordEl = document.createElement("div");
      wordEl.className = "ec-word";
      grid.appendChild(wordEl);
      for (var i = 0; i < word.length; i++){
        var cell = document.createElement("div");
        cell.className = "ec-cell";
        cell.textContent = word[i];
        wordEl.appendChild(cell);
        cells.push({ el: cell, ch: word[i], flash: 0 });
      }
    });

    var keyRow = document.createElement("div");
    keyRow.className = "ec-key-row";
    panel.appendChild(keyRow);

    var key = document.createElement("div");
    key.className = "ec-key";
    key.textContent = "🔑 Lock it with this key";
    keyRow.appendChild(key);

    var callout = document.createElement("div");
    callout.className = "ec-callout";
    callout.innerHTML = 'Every letter became <span class="ec-callout-em">a pair of numbers</span>. That is all a computer ever stores.';
    panel.appendChild(callout);

    root.appendChild(artboard);

    return {
      artboard: artboard,
      lockShackle: lock.shackle,
      lockBody: lock.body,
      openTxt: openTxt,
      lockedTxt: lockedTxt,
      cells: cells,
      key: key,
      callout: callout
    };
  }

  function cellState(cache, i, t, origChar){
    var lockStart      = LOCK_START + i * LOCK_STAGGER;
    var lockChurnEnd   = lockStart + LOCK_STEPS * LOCK_STEP_MS;
    var unlockStart    = UNLOCK_START + i * UNLOCK_STAGGER;
    var unlockChurnEnd = unlockStart + UNLOCK_STEPS * UNLOCK_STEP_MS;

    if (t < lockStart){
      return { sealed: false, text: origChar, pop: 1, flash: 0 };
    }
    if (t < lockChurnEnd){
      var local = t - lockStart;
      var stepIndex = Math.min(LOCK_STEPS - 1, Math.floor(local / LOCK_STEP_MS));
      var stepProg = (local % LOCK_STEP_MS) / LOCK_STEP_MS;
      var lc = cache.lock[i];
      if (!lc || lc.step !== stepIndex){
        lc = { step: stepIndex, val: randomHexPair() };
        cache.lock[i] = lc;
      }
      return { sealed: true, text: lc.val, pop: 1 + 0.18 * Math.sin(stepProg * Math.PI), flash: 0 };
    }
    if (t < unlockStart){
      if (!cache.lock[i]) cache.lock[i] = { step: LOCK_STEPS - 1, val: randomHexPair() };
      return { sealed: true, text: cache.lock[i].val, pop: 1, flash: 0 };
    }
    if (t < unlockChurnEnd){
      var local2 = t - unlockStart;
      var stepIndex2 = Math.min(UNLOCK_STEPS - 1, Math.floor(local2 / UNLOCK_STEP_MS));
      var stepProg2 = (local2 % UNLOCK_STEP_MS) / UNLOCK_STEP_MS;
      var uc = cache.unlock[i];
      if (!uc || uc.step !== stepIndex2){
        uc = { step: stepIndex2, val: randomHexPair() };
        cache.unlock[i] = uc;
      }
      /* The churn itself winds up rather than running flat: the scale wobble
         and a little of the glow both grow across the eight steps, so the cell
         is visibly working harder just before it gives the letter back. */
      var wind = local2 / (UNLOCK_STEPS * UNLOCK_STEP_MS);
      return {
        sealed: true,
        text: uc.val,
        pop: 1 + (0.14 + 0.16 * wind) * Math.sin(stepProg2 * Math.PI),
        flash: 0.30 * wind
      };
    }
    /* Settled: the letter is back. The box and the letter inside it jump to
       1.5x and fall away over 430ms. transform:scale carries the type with the
       box, so the character grows with its cell rather than sitting at a fixed
       size in a growing frame, which is the whole effect.

       At 1.5 a 62px cell is 93 against a 9px gutter, so a settling cell
       overlaps its neighbours. That is why it also takes a z-index while it is
       lit: the cell that is arriving passes over the ones that already have,
       instead of being clipped behind them.

       The exponents differ on purpose. The scale returns faster than the light
       does, so the box has stopped moving while the glow is still fading. That
       reads as a flash rather than as a bounce. */
    var since = t - unlockChurnEnd;
    if (since < SETTLE_MS){
      var k = 1 - since / SETTLE_MS;
      return {
        sealed: false,
        text: origChar,
        pop: 1 + 0.50 * Math.pow(k, 2.2),
        flash: Math.pow(k, 1.4)
      };
    }
    return { sealed: false, text: origChar, pop: 1, flash: 0 };
  }

  function sealCompleteTime(n){
    return LOCK_START + (n - 1) * LOCK_STAGGER + LOCK_STEPS * LOCK_STEP_MS;
  }

  function initInstance(root){
    var refs = buildArtboard(root);
    var n = refs.cells.length;
    var sealDoneT = sealCompleteTime(n);

    var cache = { lock: {}, unlock: {} };

    var inst = {
      root: root,
      refs: refs,
      cache: cache,
      elapsed: 0,
      lastTime: null,
      rafId: null,
      playing: false,
      sealed: null,
      reduced: false
    };

    function applySealedVisual(sealed){
      inst.sealed = sealed;
      refs.lockShackle.style.transform = sealed ? "rotate(0deg) translateY(0)" : "rotate(-30deg) translateY(-3px)";
      refs.lockBody.style.fill = sealed ? "var(--ec-sealed)" : "var(--ec-dim)";
      refs.openTxt.style.opacity = sealed ? "0" : "1";
      refs.lockedTxt.style.opacity = sealed ? "1" : "0";
      refs.callout.style.opacity = sealed ? "1" : "0";
      refs.callout.style.transform = sealed ? "translateY(0)" : "translateY(8px)";
      if (sealed && !inst.reduced){
        refs.key.classList.remove("ec-pulse");
        // force reflow so the animation can restart on consecutive loops
        void refs.key.offsetWidth;
        refs.key.classList.add("ec-pulse");
      }
    }

    function renderAt(t){
      var sealedNow = (t >= sealDoneT && t < UNLOCK_START);
      if (sealedNow !== inst.sealed){
        applySealedVisual(sealedNow);
      }
      for (var i = 0; i < refs.cells.length; i++){
        var c = refs.cells[i];
        var s = cellState(cache, i, t, c.ch);
        if (s.text !== c.el.textContent) c.el.textContent = s.text;
        var wantSealedClass = s.sealed;
        var hasSealedClass = c.el.classList.contains("ec-sealed");
        if (wantSealedClass !== hasSealedClass) c.el.classList.toggle("ec-sealed", wantSealedClass);
        c.el.style.transform = "scale(" + s.pop.toFixed(3) + ")";

        /* One filter and one shadow do the whole flash: brightness lifts the
           type, the rim and the wash together, the shadow throws light around
           the box. Written only when the value actually changes, 26 cells at
           60fps is 1560 style writes a second otherwise, nearly all of them
           setting the same two strings back. */
        var f = s.flash;
        if (f !== c.flash){
          c.flash = f;
          if (f > 0.004){
            c.el.style.filter = "brightness(" + (1 + 0.95 * f).toFixed(3) + ")";
            c.el.style.boxShadow = "0 0 " + (26 * f).toFixed(1) + "px " +
              (6 * f).toFixed(1) + "px rgba(" + FLASH_RGB + "," + (0.5 * f).toFixed(3) + ")";
            c.el.style.zIndex = "2";
          } else {
            c.el.style.filter = "";
            c.el.style.boxShadow = "";
            c.el.style.zIndex = "";
          }
        }
      }
    }

    function frame(now){
      if (!inst.playing){ inst.rafId = null; return; }
      if (inst.lastTime === null) inst.lastTime = now;
      var dt = now - inst.lastTime;
      inst.lastTime = now;
      inst.elapsed = (inst.elapsed + dt) % LOOP_MS;
      renderAt(inst.elapsed);
      inst.rafId = requestAnimationFrame(frame);
    }

    function reducedMotionQuery(){
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function renderStaticFrame(){
      // Most informative moment: fully locked, callout visible, key at rest.
      var t = sealDoneT + 400;
      inst.elapsed = t;
      renderAt(t);
      refs.key.classList.remove("ec-pulse");
    }

    function play(){
      if (reducedMotionQuery()){
        inst.reduced = true;
        root.classList.add("ec-reduced");
        renderStaticFrame();
        inst.playing = false;
        return;
      }
      inst.reduced = false;
      root.classList.remove("ec-reduced");
      if (inst.playing) return;
      inst.playing = true;
      inst.lastTime = null;
      inst.rafId = requestAnimationFrame(frame);
    }

    function pause(){
      inst.playing = false;
      if (inst.rafId){
        cancelAnimationFrame(inst.rafId);
        inst.rafId = null;
      }
    }

    // Initial paint.
    if (reducedMotionQuery()){
      inst.reduced = true;
      root.classList.add("ec-reduced");
      renderStaticFrame();
    } else {
      renderAt(0);
      play();
    }

    // Resize handling: scale the fixed artboard to fit the container,
    // preserving aspect ratio (contain-fit), never using vw/vh/vmin.
    var ro = new ResizeObserver(function(entries){
      for (var e = 0; e < entries.length; e++){
        var box = entries[e].contentBoxSize
          ? (Array.isArray(entries[e].contentBoxSize) ? entries[e].contentBoxSize[0] : entries[e].contentBoxSize)
          : null;
        var w = box ? box.inlineSize : entries[e].contentRect.width;
        var h = box ? box.blockSize : entries[e].contentRect.height;
        if (!w || !h) continue;
        var scale = Math.min(w / ART_W, h / ART_H);
        refs.artboard.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
      }
    });
    ro.observe(root);

    // Best-effort auto pause/resume when backgrounded. The host is expected
    // to call pause()/play() itself (e.g. via IntersectionObserver on
    // scroll), this is just a safety net for standalone use.
    document.addEventListener("visibilitychange", function(){
      if (document.hidden) pause(); else play();
    });

    inst.play = play;
    inst.pause = pause;
    return inst;
  }

  var instances = [];
  var nodes = document.querySelectorAll(".ec-thumb-root");
  for (var i = 0; i < nodes.length; i++){
    var inst = initInstance(nodes[i]);
    /* The instance is hung on its own root. There can be more than one of
       these on a page. The hero's project browser shows the same component
       the Selected Work card does, and each has to be startable and stoppable
       on its own, from its own element, without either one reaching the other
       through a global. */
    nodes[i]._ecThumb = inst;
    instances.push(inst);
  }

  /* Kept for anything that already calls it, and it now means "all of them"
     rather than "the first one". Nothing in this file uses it. */
  window.ecThumb = {
    play: function(){ instances.forEach(function(inst){ inst.play(); }); },
    pause: function(){ instances.forEach(function(inst){ inst.pause(); }); }
  };
})();


/* --------------------------------------------------------------------------
   Host-side gating, per instance.

   Each root is observed on its own and drives only its own instance. It used
   to take the first .ec-thumb-root on the page and then start and stop EVERY
   instance from it, which was fine while there was one, and became a bug the
   moment the hero's project browser showed the same component: scrolling the
   card below the fold into view would have started the hero's copy as well,
   and the hero's copy going off screen would have stopped the one you were
   looking at.

   The observer is registered after the component's own visibilitychange
   listener, so when a tab is restored while a root is off screen it re-pauses
   on the same tick.
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var roots = document.querySelectorAll('.ec-thumb-root');

  for (var i = 0; i < roots.length; i++) {
    (function (root) {
      var inst = root._ecThumb;
      if (!inst) return;

      var onScreen = true;

      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          onScreen = entry.isIntersecting;
          if (onScreen && !document.hidden) inst.play();
          else inst.pause();
        });
      }, { rootMargin: '200px 0px' }).observe(root);

      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && !onScreen) inst.pause();
      });
    })(roots[i]);
  }
})();


/* ===== js/clients.js ===== */
/* ==========================================================================
   clients.js. The logo marquee

   Two jobs. Clone the track so the loop has something to hand off to, and
   stop the animation whenever the card is off screen, which is the same
   discipline every live component on this page follows.

   The clone is built here rather than written twice in index.html so the
   markup has one list of employers, not two that can drift apart. It is
   aria-hidden and has its interactive-irrelevant content stripped, so a
   screen reader hears each company once.
   ========================================================================== */

(function () {
  'use strict';

  var rails = document.querySelectorAll('[data-marquee]');
  if (!rails.length) return;

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  for (var r = 0; r < rails.length; r++) rail(rails[r]);

  function rail(marquee) {
    var track = marquee.firstElementChild;
    while (track && track.tagName !== 'UL') track = track.nextElementSibling;
    if (!track) return;

    /* Under reduced motion the CSS drops the loop entirely and wraps the one
       track instead, so a second copy would just be a duplicate row of logos. */
    if (!motionQuery.matches) {
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-clients-clone', '');
      // The names are for assistive tech and the clone is hidden from it, so
      // carrying them twice only adds weight to the DOM.
      clone.querySelectorAll('.visually-hidden').forEach(function (el) {
        el.remove();
      });
      marquee.appendChild(clone);

      /* ONE CLOCK FOR BOTH TRACKS.

         The original track is in the markup, so its animation starts when the
         page first paints. The clone's starts when it is appended, and the
         loader holds this script back until the hand-off, which is about six
         seconds later. Six seconds of a linear loop is a couple of hundred
         pixels of phase error: the two tracks stop tiling and start sitting
         on top of each other, which reads as two brands colliding in one spot
         and a hole in the row somewhere else.

         Restarting both inside a single style update puts them on the same
         clock. The second track then sits exactly one track width behind the
         first, which is the whole premise of the seamless loop: the seam is a
         gap like every other gap. */
      track.style.animation = 'none';
      clone.style.animation = 'none';
      void track.offsetWidth;
      track.style.animation = '';
      clone.style.animation = '';
    }

    if (!('IntersectionObserver' in window)) return;

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) marquee.removeAttribute('data-paused');
        else marquee.setAttribute('data-paused', '');
      });
    }, { rootMargin: '120px 0px' }).observe(marquee);
  }
  /* ---- the dots stand over their marks ------------------------------------

     A stop on the timeline is a date, a point on the line, and an employer's
     mark under it. The point used to sit on the stop's left edge, which is
     where the COLUMN starts rather than where the mark is: five dots in a row
     with five logos of five different widths under them, and not one of them
     over the thing it names.

     So the offset is measured. The mark's own width is a ratio times a clamp
     times a by-eye scale: three numbers that live with the mark, in
     07-clients.css, and none of which CSS can hand to a sibling, so the one
     place that can answer "how wide is that logo, right now, at this window
     width" is a measurement taken after layout. One read per stop, on load and
     after a resize settles, written back as a custom property the stylesheet
     positions the dot with.

     Horizontal only: stacked, the dots are on a spine down the left and the
     mark is in a column beside it, which is a different question with a
     different answer already in 06-responsive.css. */
  var wide = window.matchMedia('(min-width: 960px)');

  function centreDots() {
    var stops = document.querySelectorAll('.tl__stop');
    for (var i = 0; i < stops.length; i++) {
      var dot = stops[i].querySelector('.tl__dot');
      var mark = stops[i].querySelector('.tl__mark-logo, .tl__own');
      if (!dot || !mark) continue;
      if (!wide.matches) {
        stops[i].style.removeProperty('--dot-x');
        stops[i].style.removeProperty('--year-x');
        continue;
      }
      var s = stops[i].getBoundingClientRect();
      var m = mark.getBoundingClientRect();
      if (!m.width) continue;
      var x = m.left + m.width / 2 - s.left;
      stops[i].style.setProperty('--dot-x', Math.round(x) + 'px');

      /* AND THE YEAR OVER THE SAME POINT, held inside the stop. The date, the
         dot and the mark are one fact and they share an axis, but a year is
         wider than some of these marks, and the first stop's would hang off
         the left edge of the card if it were centred and nothing else. So it
         is centred where it fits and pushed back in where it does not, which
         is the difference between a date over a logo and a date in the
         gutter. */
      var year = stops[i].querySelector('.tl__years');
      if (!year) continue;
      var y = year.getBoundingClientRect();
      if (!y.width) continue;
      var yx = Math.min(Math.max(0, x - y.width / 2), Math.max(0, s.width - y.width));
      stops[i].style.setProperty('--year-x', Math.round(yx) + 'px');
    }
  }

  centreDots();
  /* Web fonts change the width of a wordmark, and two of these marks are type.
     The measurement is taken again once they have landed. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(centreDots);

  var dt;
  window.addEventListener('resize', function () {
    clearTimeout(dt);
    dt = setTimeout(centreDots, 140);
  });
})();


/* ===== js/tools.js ===== */
/* ==========================================================================
   tools.js. The tools card is a ring

   The card is a square with the tools arranged on a circle inside it, turning.
   It was a rail that became this under the pointer; it is simply this now,
   which means the page has one layout rather than two and nothing below the
   hero ever moves.

   The rail is still in the markup and is still the real list. The ring is
   built from it and marked aria-hidden, so there is one list of tools rather
   than two that can drift, and a reader who has asked for reduced motion gets
   the rail itself, paused, with nothing built and nothing turning.

   Three things this file does and nothing else:

     1. Build the ring once, from the marks already in the rail.
     2. Measure the square and the radius, because both are the card's own
        width and CSS cannot ask an element about itself.
     3. Swap it for the counting state in the one discipline that has numbers
        rather than a stack of software.
   ========================================================================== */

(function () {
  'use strict';

  var card = document.querySelector('.hero__tools');
  if (!card) return;

  var rail = card.querySelector('.tools__marquee');
  var source = card.querySelector('.tools__track');
  if (!rail || !source) return;

  var still = !!(window.matchMedia &&
                 window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---- the ring ---------------------------------------------------------

     Not built at all under reduced motion: a card that resizes the page and
     spins is the exact thing that setting is for. Everything after it still
     runs, because swapping what the card holds is not motion. */
  var marks = source.children;
  var open = false;

  function set() { /* replaced below when the ring exists */ }

  if (!still && marks.length >= 3) buildRing();

  function buildRing() {

  var orbit = document.createElement('div');
  orbit.className = 'tools__orbit';
  orbit.setAttribute('aria-hidden', 'true');   /* the rail is the real list */

  var ring = document.createElement('div');
  ring.className = 'tools__ring';

  var n = marks.length;
  /* Which seat each tool ended up in, so the wires below can find a mark
     without knowing anything about the order of the rail. */
  var seatOf = {};
  /* And the other direction: which tool is in seat i. The shelves walk the
     seats in order, so they need the name at the index rather than the index
     at the name. */
  var nameOf = [];
  for (var i = 0; i < n; i++) {
    var seat = document.createElement('span');
    seat.className = 'tools__seat';
    seat.style.setProperty('--a', (i * (360 / n)).toFixed(3) + 'deg');

    var cls = marks[i].firstElementChild.getAttribute('class') || '';
    var name = /tools__logo--([a-z0-9]+)/.exec(cls);
    if (name) seatOf[name[1]] = i;
    nameOf.push(name ? name[1] : null);

    /* The mark itself counter-turns, so it stays upright while its seat goes
       round. A logo that rotates with the ring is a logo upside down for half
       of every revolution. */
    var spin = document.createElement('span');
    spin.className = 'tools__spin';
    spin.appendChild(marks[i].firstElementChild.cloneNode(true));

    seat.appendChild(spin);
    ring.appendChild(seat);
  }

  orbit.appendChild(ring);

  /* ---- the middle stays empty ---------------------------------------------

     There used to be a phrase here, turning over every couple of seconds in
     the dead centre of the wheel, and before that a set of hairline needles
     reaching from it out to the marks it meant. Both are gone. The orbit
     reads as an orbit when the middle of it is nothing: a phrase in there
     turns a constellation into a diagram with a caption, and the caption was
     the loudest thing on a card whose subject is the ring.

     Nothing replaces it. The empty centre is the change. */
  card.appendChild(orbit);

  /* ======================================================================
     THE SHELVES

     At rest the marks go round loosely and the card is a claim with no
     evidence: ten logos and a phrase. Under the pointer they sort themselves
. A short scramble, and then three rows with the categories named.

     WHICH TOOL BELONGS WHERE is the whole content of this interaction, so it
     is a plain table rather than something inferred. A tool named in no shelf
     simply keeps spinning; a shelf with nothing on it draws nothing.

     The order is the order of the work: what gets decided, what executes it,
     and what is left to a person.
     ====================================================================== */
  var SHELVES = [
    { t: 'Design Decisions', to: ['figma', 'axure', 'miro'] },
    { t: 'AI Execution',     to: ['claude', 'chatgpt', 'gemini', 'cursor', 'github'] },
    { t: 'Human Judgment',   to: ['notion', 'wisprflow'] }
  ];

  var shelfWrap = document.createElement('div');
  shelfWrap.className = 'tools__shelves';
  shelfWrap.setAttribute('aria-hidden', 'true');
  var shelfEls = [];
  for (var sI = 0; sI < SHELVES.length; sI++) {
    var sh = document.createElement('div');
    sh.className = 'tools__shelf';
    var shl = document.createElement('p');
    shl.className = 'tools__shelf-l';
    shl.textContent = SHELVES[sI].t;
    var shline = document.createElement('span');
    shline.className = 'tools__shelf-line';
    sh.appendChild(shl);
    sh.appendChild(shline);
    shelfWrap.appendChild(sh);
    shelfEls.push({ el: sh, label: shl, line: shline });
  }
  /* Behind the marks, in front of nothing: the shelf is a surface the logos
     land on, so it must never draw over one. */
  orbit.insertBefore(shelfWrap, orbit.firstChild);

  /* ---- the mover ---------------------------------------------------------

     The ring is a CSS animation, which is the right way to turn ten things
     forever and the wrong way to send them somewhere. So the hover FREEZES
     the wheel and bakes its angle into the marks: each seat is written at the
     exact place it already was, in the orbit's own pixels, and from that
     frame on this file is moving plain coordinates. Leaving reverses it. 
     The marks are tweened back to the circle at the angle the wheel stopped
     at, then handed to the animation again with a negative delay so it picks
     up mid-turn rather than snapping to zero.

     Nothing is cloned and nothing is hidden. The things on the shelves are
     the things that were going round. */

  var seats = ring.children;
  var frozen = false;        /* the wheel's angle is now in the marks */
  var atShelf = false;
  var raf = 0;
  var moves = [];            /* one per mark, while a move is running */
  var SPIN_MS = 30000;       /* must match the keyframe duration in CSS */

  function now() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }

  /* Where a mark sits on the circle when the wheel is at angle R. */
  function onCircle(i, R) {
    var th = R + i * (2 * Math.PI / n);
    var r = parseFloat(card.style.getPropertyValue('--tools-r')) || 120;
    return { x: r * Math.sin(th), y: -r * Math.cos(th) };
  }

  function put(el, x, y) {
    el.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)';
  }

  var heldAngle = 0;

  /* The wheel's angle right now, read off its own computed transform. One
     read, no layout, and it happens once per hover rather than per frame. */
  function ringAngle() {
    var t = window.getComputedStyle(ring).transform;
    if (!t || t.indexOf('matrix') !== 0) return 0;
    var p = t.slice(t.indexOf('(') + 1, -1).split(',');
    return Math.atan2(parseFloat(p[1]), parseFloat(p[0]));
  }

  function freeze() {
    if (frozen) return;
    heldAngle = ringAngle();
    ring.style.animation = 'none';
    ring.style.transform = 'none';
    for (var i = 0; i < seats.length; i++) {
      var p = onCircle(i, heldAngle);
      var sp = seats[i].firstElementChild;
      if (sp) { sp.style.animation = 'none'; sp.style.transform = 'none'; }
      put(seats[i], p.x, p.y);
    }
    frozen = true;
  }

  function thaw() {
    if (!frozen) return;
    for (var i = 0; i < seats.length; i++) {
      seats[i].style.transform = '';
      var sp = seats[i].firstElementChild;
      if (sp) { sp.style.animation = ''; sp.style.transform = ''; }
    }
    ring.style.transform = '';
    ring.style.animation = '';
    /* Pick the turn back up where it stopped. A wheel that restarts at zero
       after every hover is a wheel that tells you it is an animation. */
    var turns = (heldAngle / (2 * Math.PI)) % 1;
    if (turns < 0) turns += 1;
    var delay = (-turns * SPIN_MS).toFixed(0) + 'ms';
    ring.style.animationDelay = delay;

    /* AND THE MARKS GET THE SAME DELAY, WHICH IS THE WHOLE POINT.

       This is a ferris wheel: the ring turns and every mark stays upright,
       which works because each mark counter-turns at exactly the ring's rate.
       Two animations cancelling each other only cancel while they are at the
       same point in their cycle, and the line above was putting the ring
       back mid-turn while the marks restarted from zero. From the first hover
       onward each logo was rotating by the difference, which is the ring's
       own speed. So the offset goes on both. */
    for (var k = 0; k < seats.length; k++) {
      var s2 = seats[k].firstElementChild;
      if (s2) s2.style.animationDelay = delay;
    }
    frozen = false;
  }

  /* ---- where the shelves put each mark ----------------------------------

     Measured, not guessed: the shelf rows are laid out by the stylesheet at
     whatever width the card has, and this reads back where each line landed.
     A mark sits ON its shelf (its bottom edge just above the hairline), 
     which is the difference between a row of logos and a row of logos on a
     shelf. */
  function shelfTargets() {
    var ob = orbit.getBoundingClientRect();
    var cx = ob.width / 2, cy = ob.height / 2;
    var logo = orbit.querySelector('.tools__logo');
    var lh = logo ? logo.getBoundingClientRect().height : 30;
    var out = {};

    for (var s = 0; s < SHELVES.length; s++) {
      /* THE SHELF'S OWN BOX, NOT THE LINE'S. The line draws itself in with a
         scaleX, and a transformed element reports the rectangle it is drawn
         at, which is nothing at all on the frame this runs. The shelf around
         it is untransformed and the line is pinned to its bottom edge, so
         that box is the same measurement without the timing trap. */
      var sb = shelfEls[s].el.getBoundingClientRect();
      var lb = { left: sb.left, width: sb.width, top: sb.bottom };
      if (!lb.width) continue;
      var list = SHELVES[s].to;
      var have = [];
      for (var k = 0; k < list.length; k++) {
        if (list[k] in seatOf) have.push(list[k]);
      }
      if (!have.length) continue;

      /* Left-aligned on the shelf, because a shelf fills from one end. Three
         objects centred on a line read as a composition, and the point here
         is that they were put away. */
      var step = Math.min(lh + 18, (lb.width - lh) / Math.max(1, have.length - 1));
      var x0 = lb.left - ob.left + lh / 2;
      var y = lb.top - ob.top - lh / 2 - 7;

      for (k = 0; k < have.length; k++) {
        /* A HAIR OF ASYMMETRY. Objects a person put on a shelf are not on a
           grid; these are off by a pixel or two, deterministically, so the
           row reads as placed rather than as generated. */
        var nudgeX = ((k * 7) % 5) - 2;
        var nudgeY = ((k * 11) % 4) - 1.5;
        out[have[k]] = {
          x: x0 + k * step + nudgeX - cx,
          y: y + nudgeY - cy
        };
      }
    }
    return out;
  }

  /* ---- the move itself ---------------------------------------------------

     Not a straight line and not a fade. Each mark does three things in about
     two thirds of a second: it breaks off its orbit the way something does
     when it has been called, it crosses the card on an arc, which is what
     makes the ten paths cross each other rather than run in parallel, and it
     arrives a little past its place and settles back onto it.

     The arc's bow alternates and varies by index, so this is choreography
     rather than ten objects sharing one curve. Same numbers every time: it is
     authored, not random, and it plays the same way twice. */

  var KICK = 0.17;    /* the share of the move spent breaking away */

  function easeOutBack(p) {
    var c = 1.14;
    return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
  }
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }

  function plan(toShelf) {
    var targets = toShelf ? shelfTargets() : null;
    var R = heldAngle;
    moves = [];
    var t0 = now();

    for (var i = 0; i < seats.length; i++) {
      var el = seats[i];
      var cur = read(el);
      var dest;

      if (toShelf) {
        var name = nameOf[i];
        dest = (name && targets[name]) ? targets[name] : null;
        /* A tool on no shelf keeps its place on the circle rather than
           drifting into a row it does not belong to. */
        if (!dest) dest = onCircle(i, R);
      } else {
        dest = onCircle(i, R);
      }

      var dx = dest.x - cur.x, dy = dest.y - cur.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      /* The bow: perpendicular to the run, alternating side, varying depth.
         Capped against the run's own length so a short hop does not swing
         halfway across the card to get there. */
      var bow = (i % 2 ? 1 : -1) * Math.min(len * 0.34, 26 + (i * 13) % 24);
      var px = -dy / len, py = dx / len;

      /* The break-away is along the orbit's tangent (the direction it was
         already travelling), which is why it reads as breaking off rather
         than as a wobble. */
      var tan = { x: Math.cos(R + i * (2 * Math.PI / n)),
                  y: Math.sin(R + i * (2 * Math.PI / n)) };

      moves.push({
        el: el,
        x0: cur.x, y0: cur.y,
        cx: cur.x + dx / 2 + px * bow,
        cy: cur.y + dy / 2 + py * bow,
        x1: dest.x, y1: dest.y,
        tan: tan,
        kick: toShelf ? 7 + (i * 5) % 9 : 0,
        start: t0 + (toShelf ? (i * 37) % 132 : (i * 23) % 84),
        ms: toShelf ? 520 + (i * 53) % 190 : 380 + (i * 41) % 120,
        back: toShelf
      });
    }

    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  /* The mark's current offset, read off its own transform so a move that
     interrupts another one starts from where the thing actually is. */
  function read(el) {
    var t = el.style.transform;
    var m = /translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/.exec(t || '');
    if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
    return onCircle([].indexOf.call(seats, el), heldAngle);
  }

  function frame() {
    var t = now(), live = 0;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      if (t < m.start) { live++; continue; }
      var p = Math.min(1, (t - m.start) / m.ms);
      var x, y;

      if (m.kick && p < KICK) {
        /* Out along the tangent and back, once. */
        var u = Math.sin((p / KICK) * Math.PI) * m.kick;
        x = m.x0 + m.tan.x * u;
        y = m.y0 + m.tan.y * u;
      } else {
        var q = m.kick ? (p - KICK) / (1 - KICK) : p;
        var e = m.back ? easeOutBack(q) : easeOut(q);
        var inv = 1 - e;
        x = inv * inv * m.x0 + 2 * inv * e * m.cx + e * e * m.x1;
        y = inv * inv * m.y0 + 2 * inv * e * m.cy + e * e * m.y1;
      }

      put(m.el, x, y);
      if (p < 1) live++;
    }
    if (live) { raf = window.requestAnimationFrame(frame); return; }
    raf = 0;
    moves = [];
    /* Back on the circle and standing still: hand the wheel over. */
    if (!atShelf) thaw();
  }

  /* ---- the switch --------------------------------------------------------

     Pointer only, and only where a pointer can hover. On a touch screen there
     is no away, so the card would sort itself once and stay sorted, which is
     the wrong half of the idea.  */
  var canHover = !window.matchMedia || matchMedia('(hover: hover)').matches;

  function toShelves() {
    if (atShelf || !open) return;
    atShelf = true;
    freeze();
    card.classList.add('is-sorted');
    plan(true);
  }

  function toRing() {
    if (!atShelf) return;
    atShelf = false;
    card.classList.remove('is-sorted');
    plan(false);
  }

  if (canHover) {
    card.addEventListener('pointerenter', toShelves);
    card.addEventListener('pointerleave', toRing);
  }

  /* AND A DOOR FOR A SCREEN WITH NO POINTER.

     The sort is a hover, and the comment above says why: on a touch screen
     there is no "away", so a card that sorted itself on tap would sort once
     and stay that way. That reasoning holds. What it needs is a control that
     can be tapped a second time, and on a phone there is one directly under
     this card. The capabilities disclosure says when it wants the shelves and
     when it wants the wheel back; nothing here knows or cares what that
     control is, which is the point of asking through an event.

     Both functions already guard their own state (`toShelves` returns unless
     the card is open and unsorted, `toRing` unless it is sorted), so a
     repeated or contradictory event costs a function call and nothing else. */
  document.addEventListener('pf:tools-sort', function (ev) {
    if (ev && ev.detail) toShelves(); else toRing();
  });

  /* A window that changes size while the shelves are up has moved the lines
     out from under the marks. Re-place them where they now belong, without a
     performance: this is a correction, not an entrance. */
  function replace() {
    if (!atShelf) return;
    var targets = shelfTargets();
    for (var i = 0; i < seats.length; i++) {
      var name = nameOf[i];
      var d = (name && targets[name]) ? targets[name] : onCircle(i, heldAngle);
      put(seats[i], d.x, d.y);
    }
  }

  /* ---- the square ------------------------------------------------------- */

  /* The open card is as tall as it is wide, and the ring's radius is a
     fraction of the same number. Both are measured rather than guessed,
     because the card's width is a grid column and changes with the window. */
  function measure() {
    var box = card.getBoundingClientRect();
    var w = box.width;
    if (!w) return;
    card.style.setProperty('--tools-square', Math.round(w) + 'px');
    card.style.setProperty('--tools-r', Math.round(w * 0.33) + 'px');
    /* If the shelves are up, the lines have just moved out from under the
       marks sitting on them. */
    replace();
  }

  measure();
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(measure, 120);
  });

  /* ---- the ring is the card -----------------------------------------------

     This used to be a hover: a rail at rest that grew into a square under the
     pointer. It is the square now, from the first frame. The twelve marks on
     a circle, turning, is what the card IS rather than what it does when you
     find it. Which also means the page has one layout instead of two: nothing
     below the hero moves, because nothing above it ever changes size.

     The rail stays in the markup and stays the accessible list; the ring is
     built from it and marked aria-hidden, so there is still one list of tools
     rather than two that can drift. */

  set = function (next) {
    /* Nothing to open in the counting state: the ring is a ring of logos. */
    if (stats && next) return;
    if (next === open) return;
    open = next;
    measure();
    card.classList.toggle('is-open', open);
    /* Nothing is going past while the ring is up; nothing turns while the rail
       is. One animation at a time, always. */
    rail.toggleAttribute('data-paused', open);
    /* A card that closes while its shelves are up has to put the marks back,
       or it reopens sorted with nothing to have sorted them. */
    if (!open && atShelf) { atShelf = false; card.classList.remove('is-sorted'); thaw(); }
  };

  set(true);
  }

  /* ---- one discipline counts instead ------------------------------------

     Illustration is not a stack of software. What that practice has is a body
     of work, so in that discipline the card stops listing tools and says how
     much of it there is: three numbers, counted up rather than printed.

     Same card, same band, same label position. It is the same card answering
     a different question, which is why this is a swap of contents rather than
     a second card that has to be hidden somewhere. */
  var statList = card.querySelector('.tools__stats');
  var label = card.querySelector('[data-tools-label]');
  var labelWas = label ? label.textContent : '';
  var stats = false;
  var countTimers = [];

  function countUp(el, to, ms) {
    var t0 = null;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / ms);
      /* Fast at the start, settling at the end: a counter that decelerates
         reads as arriving at a number rather than as a clock. */
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + (p >= 1 ? '+' : '');
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  function showStats(on) {
    if (!statList) return;
    stats = on;
    /* Out of the counting state and the card is a ring again. The same
       swap in both directions, so the discipline switch has no memory to
       get wrong. */
    set(!on);
    card.classList.toggle('is-stats', on);
    statList.toggleAttribute('hidden', !on);
    if (label) label.textContent = on ? 'In numbers' : labelWas;

    for (var t = 0; t < countTimers.length; t++) clearTimeout(countTimers[t]);
    countTimers = [];

    var items = statList.children;
    for (var i = 0; i < items.length; i++) items[i].classList.remove('is-in');
    if (!on) return;

    for (i = 0; i < items.length; i++) {
      (function (el, k) {
        countTimers.push(setTimeout(function () {
          el.classList.add('is-in');
          var n = el.querySelector('.tools__stat-n');
          var to = parseInt(n.getAttribute('data-to'), 10) || 0;
          if (still) { n.textContent = to + '+'; return; }
          countUp(n, to, 900);
        }, 140 * k));
      })(items[i], i);
    }
  }

  document.addEventListener('pf:role', function (e) {
    var role = e && e.detail && e.detail.role;
    showStats(role === 'illustration');
  });
})();


/* ===== js/musicmenu.js ===== */
/* ==========================================================================
   musicmenu.js. The three places the music actually lives.

   Music is not a state of this page. It is three catalogues on three services,
   so pressing it opens a short list of them rather than rearranging anything
   here. Illustration is the same argument with one destination instead of
   three, which is why that one is a plain anchor in the markup and needs no
   script at all.

   The menu is moved to the body on start and placed from the button's own
   rectangle. Nothing in the hero can then clip it, overlap it, or become its
   containing block, which matters in a bento of nested grids where the
   selector already carries `overflow-x` rules of its own at one breakpoint,
   and where a transform added to any wrapper later would silently break a
   fixed panel nested inside it.

   Below 720 the selector is `display: none`. That is the hero's existing
   phone layout, not something this file decides, so there is nothing to open
   the menu from, and `show()` declines rather than parking a panel in the
   corner of a page that has no control for it.

   Keyboard: the button opens on Enter, Space, Down or Up, Down lands on the
   first destination and Up on the last, which is what a menu button does
   everywhere else. Inside, Up and Down wrap, Home and End jump, Escape closes
   and gives focus back to the button, and Tab closes and carries on through
   the page rather than trapping anyone in three links.
   ========================================================================== */

(function () {
  'use strict';

  var btn  = document.querySelector('[data-menu="music"]');
  var menu = document.getElementById('music-menu');
  if (!btn || !menu) return;

  document.body.appendChild(menu);

  var rows = [].slice.call(menu.querySelectorAll('[role="menuitem"]'));
  var open = false;

  /* Under the button, left edges aligned, pulled back from the right edge of
     the window rather than allowed to leave it. */
  function place() {
    var r = btn.getBoundingClientRect();
    menu.style.top = Math.round(r.bottom + 8) + 'px';
    var left = r.left;
    var room = document.documentElement.clientWidth - 12 - menu.offsetWidth;
    if (left > room) left = room;
    if (left < 12) left = 12;
    menu.style.left = Math.round(left) + 'px';
  }

  function onOutside(e) {
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    hide(false);
  }

  function onKey(e) {
    var k = e.key;
    if (k === 'Escape') { e.preventDefault(); hide(true); return; }
    if (k === 'Tab') { hide(false); return; }
    var i = rows.indexOf(document.activeElement);
    if (i < 0) return;
    if (k === 'ArrowDown') { e.preventDefault(); focusAt(i + 1); }
    else if (k === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
    else if (k === 'Home') { e.preventDefault(); focusAt(0); }
    else if (k === 'End') { e.preventDefault(); focusAt(rows.length - 1); }
  }

  function focusAt(i) {
    if (!rows.length) return;
    rows[(i + rows.length) % rows.length].focus();
  }

  function show(focusIndex) {
    /* No box means the control is not rendered at this width. */
    var r0 = btn.getBoundingClientRect();
    if (!r0.width && !r0.height) return;
    if (!open) {
      open = true;
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      place();
      document.addEventListener('pointerdown', onOutside, true);
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('resize', place);
      /* Capture, so it also follows a scroll inside any container. */
      window.addEventListener('scroll', place, true);
    }
    if (typeof focusIndex === 'number') focusAt(focusIndex);
  }

  function hide(returnFocus) {
    if (!open) return;
    open = false;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place, true);
    if (returnFocus) btn.focus();
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (open) hide(false); else show();
  });

  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); show(0); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); show(rows.length - 1); }
  });

  /* Choosing one closes it. The link does its own navigating. */
  for (var i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', function () { hide(false); });
  }
})();


/* ===== js/case.js ===== */
/* ==========================================================================
   case.js: the case-study view, and the machinery its scenes run on.

   Two small things live here.

   1. A ROUTER. The portfolio is one document (that is the whole point of the
      standalone build), so a case study is a second <main> in the same file
      rather than a second file. `#/carry` shows it and hides the index; an
      empty hash, or any in-page anchor, shows the index. No framework, no
      history rewriting beyond the hash the browser already manages, and every
      link is a real href, so middle-click and "open in new tab" still work.

   2. A SCENE RUNNER. Every animated section on a case study is a strip of
      numbered steps. The runner walks them on a timer that only starts when
      the section is actually on screen, writes the current step onto the
      section as `data-step`, and CSS does the rest. Keeping the state in one
      attribute is what makes the reduced-motion case honest: instead of
      removing the animation, we hand the section its most informative step and
      never advance, so the meaning survives.

   The rules the brief set, and where they are kept:

     starts on entry            IntersectionObserver at 45% visibility
     plays once, not a loop     `done` flag; a replay button re-arms it
     no missed states           a fast scroller who leaves mid-run comes back
                                to the finished state, never to a blank stage
     no unexplained pauses      every step is a visible state; the timer never
                                sits on an empty stage
     reduced motion             jump to the step marked `data-rest`, stay there
     not motion alone           each step also drives a caption in the DOM, so
                                the sequence is readable from the text nodes
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     THE ROUTER
     ------------------------------------------------------------------------ */

  /* `#/carry` is a view. `#/carry/problem` is a place inside it. The same
     idea as an in-page anchor, kept behind the slash so it never reads as a
     route to the index. `#work` and `#contact` are the index's own anchors and
     are left entirely alone. */
  function parseHash() {
    var h = (location.hash || '').replace(/^#/, '');
    if (h.indexOf('/') !== 0) return { view: 'home', at: '' };
    var parts = h.slice(1).split('/');
    return { view: parts[0] || 'home', at: parts[1] || '' };
  }

  var currentView = null;

  function applyRoute(initial) {
    var route = parseHash();
    var target = route.view;
    var views = document.querySelectorAll('[data-view]');
    var found = false;

    for (var i = 0; i < views.length; i++) {
      var name = views[i].getAttribute('data-view');
      var on = name === target;
      if (on) found = true;
      views[i].hidden = !on;
    }

    /* An unknown route is the index, not a blank page. */
    if (!found) {
      for (var j = 0; j < views.length; j++) {
        views[j].hidden = views[j].getAttribute('data-view') !== 'home';
      }
      target = 'home';
    }

    document.documentElement.setAttribute('data-route', target);

    var changed = currentView !== target;
    currentView = target;
    if (initial) return;

    var main = document.querySelector('[data-view="' + target + '"]');

    /* Moving between views is a page change: start at the top, put focus where
       a screen reader will read from rather than on a link that is now hidden,
       and re-arm the scenes so the story plays rather than showing a finished
       stage on arrival. Moving WITHIN a view is an anchor, and behaves like
       one. */
    if (changed && target !== 'home') {
      window.scrollTo(0, 0);
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }
      rearmAll(main);
    }

    if (route.at) {
      var at = document.getElementById(target + '-' + route.at);
      if (at) {
        /* The view has to be visible before it can be measured, which it now
           is; a frame's delay keeps the jump off the same tick as the unhide. */
        requestAnimationFrame(function () {
          at.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
        });
      }
    }
  }

  /* ------------------------------------------------------------------------
     THE SCENE RUNNER

     A scene is any element with [data-scene]. It declares:
       data-steps   how many steps, 1..n         (0 is the resting state)
       data-hold    ms per step, default 800
       data-rest    the step to show when motion is reduced, default last

     The runner writes data-step="n" and, if the scene has [data-caption]
     children, shows the one whose data-step matches.
     ------------------------------------------------------------------------ */

  function captionsFor(scene) {
    return scene.querySelectorAll('[data-caption]');
  }

  /* An information object can declare its own life on the timeline:

       data-at     the step it appears
       data-until  the step it is REMOVED. The subtraction the page is about
       data-fade   the step its edges start to go   (problem scenes)
       data-lost   the step it stops being retrievable (problem scenes)

     The runner turns those into data-state, and 09-case.css draws the three
     states. Doing it here rather than as thirty step-by-object selectors keeps
     the CSS readable and means adding a seventh object to a scene is one line
     of markup, not a new block of rules.

     Objects that declare none of the three are not touched: scene B and C
     move their objects around instead of decaying them, and that is entirely
     CSS's business. */
  function paintObjects(scene, step) {
    var objs = scene.querySelectorAll('[data-at]');
    for (var i = 0; i < objs.length; i++) {
      var o = objs[i];
      var at = parseInt(o.getAttribute('data-at'), 10);
      var until = parseInt(o.getAttribute('data-until'), 10);
      var fade = parseInt(o.getAttribute('data-fade'), 10);
      var lost = parseInt(o.getAttribute('data-lost'), 10);
      var state = 'live';

      if (step < at) state = 'pending';
      else if (!isNaN(until) && step >= until) state = 'removed';
      else if (!isNaN(lost) && step >= lost) state = 'lost';
      else if (!isNaN(fade) && step >= fade) state = 'fading';

      o.setAttribute('data-state', state);
    }
  }

  function paint(scene, step) {
    scene.setAttribute('data-step', String(step));
    paintObjects(scene, step);

    var caps = captionsFor(scene);
    for (var i = 0; i < caps.length; i++) {
      var want = caps[i].getAttribute('data-caption');
      var on = String(step) === want;
      caps[i].classList.toggle('is-on', on);
      /* aria-hidden rather than display, so the caption text stays in the
         accessibility tree in document order for anyone reading straight
         through, and only the visual state changes. */
      caps[i].setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  }

  function restStep(scene) {
    var rest = parseInt(scene.getAttribute('data-rest'), 10);
    if (!isNaN(rest)) return rest;
    return parseInt(scene.getAttribute('data-steps'), 10) || 1;
  }

  function stop(scene) {
    if (scene._pfTimer) {
      clearTimeout(scene._pfTimer);
      scene._pfTimer = null;
    }
  }

  function run(scene) {
    if (scene._pfRunning || scene._pfDone) return;

    var steps = parseInt(scene.getAttribute('data-steps'), 10) || 1;
    var hold = parseInt(scene.getAttribute('data-hold'), 10) || 800;

    scene._pfRunning = true;
    scene.classList.add('is-running');

    var step = 0;
    paint(scene, step);

    (function tick() {
      scene._pfTimer = setTimeout(function () {
        step += 1;
        paint(scene, step);
        if (step < steps) {
          tick();
        } else {
          scene._pfRunning = false;
          scene._pfDone = true;
          scene.classList.remove('is-running');
          scene.classList.add('is-done');
        }
      }, step === 0 ? 120 : hold);   /* just enough to land, then go */
    })();
  }

  /* Someone scrolling fast can leave a scene halfway through. Rather than
     freezing it mid-sentence, or, worse, leaving it permanently stuck because
     the timer was cleared while the "running" flag stayed up, settle it on
     the final state. That is the state that carries the conclusion, so coming
     back to a scene you scrolled past shows a finished picture rather than a
     fragment, and the Replay button is there if you want the story. */
  function settle(scene) {
    stop(scene);
    if (!scene._pfRunning) return;          /* never started: leave it armed */
    scene._pfRunning = false;
    scene._pfDone = true;
    scene.classList.remove('is-running');
    scene.classList.add('is-done');
    paint(scene, parseInt(scene.getAttribute('data-steps'), 10) || 1);
  }

  function rearm(scene) {
    stop(scene);
    scene._pfRunning = false;
    scene._pfDone = false;
    scene.classList.remove('is-done', 'is-running');
    paint(scene, 0);
  }

  function rearmAll(root) {
    if (!root) return;
    var scenes = root.querySelectorAll('[data-scene]');
    for (var i = 0; i < scenes.length; i++) {
      if (reduced.matches) paint(scenes[i], restStep(scenes[i]));
      else rearm(scenes[i]);
    }
  }

  function initScenes() {
    var scenes = document.querySelectorAll('[data-scene]');
    if (!scenes.length) return;

    if (reduced.matches) {
      for (var i = 0; i < scenes.length; i++) {
        paint(scenes[i], restStep(scenes[i]));
        scenes[i].classList.add('is-static');
      }
      return;
    }

    for (var j = 0; j < scenes.length; j++) paint(scenes[j], 0);

    if (!('IntersectionObserver' in window)) {
      /* No observer: show the informative state rather than an empty stage. */
      for (var k = 0; k < scenes.length; k++) paint(scenes[k], restStep(scenes[k]));
      return;
    }

    /* threshold 0, and a margin that fires almost as soon as the scene enters
       rather than waiting for it to reach the middle of the screen: nobody
       should have to stop scrolling for an animation to catch up. The small
       bottom inset is the only restraint. It stops a scene starting while
       one line of it is peeking over the fold.

       Not a percentage OF THE ELEMENT: a diagram is allowed to be taller than
       the window, and an element taller than the viewport can never be 45%
       visible, so those scenes simply never started. */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) run(entry.target);
        else settle(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    for (var m = 0; m < scenes.length; m++) io.observe(scenes[m]);

    /* Replay. Every scene that wants one declares [data-replay] pointing at
       its scene id; it is a real button, so it is keyboard reachable and
       announces itself. */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-replay]');
      if (!btn) return;
      var scene = document.getElementById(btn.getAttribute('data-replay'));
      if (!scene) return;
      rearm(scene);
      run(scene);
    });
  }

  /* If the visitor turns reduced motion on mid-session, stop everything and
     leave every scene on the state that carries its meaning. */
  function watchMotion() {
    var handler = function () {
      var scenes = document.querySelectorAll('[data-scene]');
      for (var i = 0; i < scenes.length; i++) {
        if (reduced.matches) {
          stop(scenes[i]);
          scenes[i]._pfRunning = false;
          scenes[i]._pfDone = true;
          scenes[i].classList.add('is-static');
          paint(scenes[i], restStep(scenes[i]));
        } else {
          scenes[i].classList.remove('is-static');
        }
      }
    };
    if (reduced.addEventListener) reduced.addEventListener('change', handler);
  }

  /* ------------------------------------------------------------------------
     BACK TO WORK MEANS THE TOP OF THE INDEX

     Leaving a case study is a page change, and it should land where a first
     visit lands: the index, at the top of it. Three things were stopping that.
     The link pointed at #work, which is the project browser rather than the
     top. Moving to `home` is the one route applyRoute deliberately does not
     scroll for, because #work and #contact are the index's own anchors and an
     anchor is supposed to keep its position. And the browser restores the
     scroll offset it remembers for the index anyway.

     So this is explicit rather than inherited: the hash goes to the index, and
     the viewport is put at zero after the route has run. Twice, on two frames
. The first is after applyRoute has unhidden the index, the second is
     after the browser has finished its own jump to the fragment. Nothing else
     in the navigation is touched: prev/next, #work and #contact still behave
     exactly as they did. Both Back to Work controls are covered: the bar at
     the head of a study and the one at the foot of it.
     ------------------------------------------------------------------------ */
  function backToTop() {
    document.addEventListener('click', function (e) {
      var back = e.target.closest && e.target.closest('.cs-bar__back, .csnav__work');
      if (!back) return;
      e.preventDefault();

      /* Already on the index: no hashchange would fire, so move it by hand. */
      if (location.hash === '#top') applyRoute(false);
      else location.hash = '#top';

      var zero = function () { window.scrollTo(0, 0); };
      zero();
      requestAnimationFrame(function () { zero(); requestAnimationFrame(zero); });
    });
  }

  PF.initCase = function () {
    applyRoute(true);
    window.addEventListener('hashchange', function () { applyRoute(false); });
    initScenes();
    watchMotion();
    backToTop();
  };
})(window.PF);


/* ===== js/wire.js ===== */
/* ==========================================================================
   wire.js. The route map, applied.

   routes.js says where things go. This puts it on the page, so no piece of
   markup carries a destination of its own and none of them can drift apart.

   WHAT IT TOUCHES

     [data-project="key"]     any card, slide or list row that stands for a
                              project. Gets its href, its CTA label and, if
                              the study is not written, an honest state.
     [data-work-link]         anything whose job is "go to the work"
     [data-link="linkedin"]   external destinations, from PF.LINKS
     [data-study="key"]       a case study; gets its foot navigation built

   THE RULE FOR AN UNWRITTEN STUDY. It does not get a link. Not a disabled
   link, not a link to something related, not a link to the top of the page, 
   no link. The card keeps its title and its description, because those are
   the things a recruiter is reading, and where the action would have been it
   says "Case study coming soon" in a treatment that is visibly not a button.
   A tap that does nothing is worse on a phone than no tap target at all,
   because there is no hover to tell you first.

   ONE NAVIGATION PER TAP. A card is one link. Where a card also shows a
   textual CTA (and it should, so the action is obvious without hover) that
   CTA is not a second anchor; it is a span inside the same one. Nested
   anchors were how the same tap could mean two things.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  function txt(el, s) { if (el) el.textContent = s; }

  /* ---------------------------------------------------------------------
     PROJECTS
     --------------------------------------------------------------------- */

  function wireProject(el) {
    var key = el.getAttribute('data-project');
    var p = PF.project(key);

    if (!p) {
      /* A key with no entry is a bug in the markup, not something to paper
         over at runtime. Leave it inert and say so in the console. */
      el.setAttribute('data-status', 'unknown');
      if (window.console) console.warn('[routes] no project named "' + key + '"');
      return;
    }

    el.setAttribute('data-status', p.status);

    /* THE LABEL IS NOT INSIDE THE LINK. On a card the overlay anchor covers
       the whole tile and the visible CTA sits beside it in the copy block. 
       That is the arrangement that keeps one tap meaning one thing. So the
       label is looked up from the CARD, not from the anchor. */
    var card = el.closest('.card, article, li') || el;
    var label = el.querySelector('[data-cta-label]') || card.querySelector('[data-cta-label]');
    var live = p.status === 'live';

    if (live) {
      if (el.tagName === 'A') el.setAttribute('href', p.route);
      else el.setAttribute('data-href', p.route);
      el.removeAttribute('data-placeholder-link');
      el.removeAttribute('aria-disabled');
      txt(label, PF.CTA.study);

      /* A study published elsewhere opens in its own tab. rel="noopener" for
         the obvious reason, and data-external puts the ↗ on it, which is the
         one thing that makes "View Case Study" honest when the case study is
         on another domain. The mark goes on whatever carries the words, since
         the overlay anchor on a card has no visible text of its own. */
      if (PF.isExternal(p)) {
        if (el.tagName === 'A') {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
        (label || el).setAttribute('data-external', '1');
        el.setAttribute('data-offsite', '1');
      }

      /* The accessible name says which project, because "View Case Study"
         repeated nine times down a page tells a screen-reader user nothing
         about which one they are on. */
      var vh = el.querySelector('.visually-hidden');
      if (vh) txt(vh, PF.CTA.study + ': ' + p.name);
      else if (el.tagName === 'A' && !el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', PF.CTA.study + ': ' + p.name);
      }
      return;
    }

    /* Not written yet. Strip every affordance that promises a destination. */
    txt(label, PF.CTA.soon);
    el.removeAttribute('href');
    el.removeAttribute('data-href');
    el.removeAttribute('data-placeholder-link');
    if (el.tagName === 'A') {
      /* An anchor with no href is already unfocusable and unactivatable;
         these two just make the reason legible to assistive technology. */
      el.setAttribute('role', 'presentation');
      el.setAttribute('aria-hidden', 'true');
    }
    /* The card, not whatever container happens to be the parent: the
       'more work' list was picking this up and greying its own heading. */
    var host = el.closest('[data-project-card], article, li');
    if (host && host !== el) host.setAttribute('data-status', 'soon');
  }

  /* ---------------------------------------------------------------------
     THE WORK, AND EXTERNAL DESTINATIONS
     --------------------------------------------------------------------- */

  function wireWork(el) {
    el.setAttribute('href', PF.WORK.hash);
    el.removeAttribute('data-placeholder-link');
    var label = el.querySelector('[data-cta-label]');
    if (label && !label.hasAttribute('data-keep')) txt(label, el.getAttribute('data-work-link') || PF.CTA.work);
  }

  function wireExternal(el) {
    var name = el.getAttribute('data-link');
    var url = (PF.LINKS || {})[name] || '';

    if (!url) {
      /* Nothing to point at. Remove the control rather than leave a link
         that reloads the page, see the file header. Anything marked
         data-link-keep stays as plain text (a label, not an action). */
      if (el.hasAttribute('data-link-keep')) {
        el.removeAttribute('href');
        el.setAttribute('data-status', 'soon');
        return;
      }
      var row = el.closest('[data-link-row]');
      (row || el).remove();
      return;
    }

    el.setAttribute('href', url);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
    el.setAttribute('data-external', '1');
    el.removeAttribute('data-placeholder-link');
  }

  /* ---------------------------------------------------------------------
     THE FOOT OF A CASE STUDY

     Previous · Back to Work · Next, in that order, built from the map so it
     can never disagree with the index. Missing neighbours are omitted
     rather than shown disabled.
     --------------------------------------------------------------------- */

  /* The attributes a neighbour needs, which depend only on where it lives. */
  function navAttrs(p) {
    return PF.isExternal(p)
      ? ' target="_blank" rel="noopener noreferrer"'
      : '';
  }
  function navName(p) {
    return '<span class="csnav__name"' + (PF.isExternal(p) ? ' data-external="1"' : '') + '>' +
           p.name + '</span>';
  }

  function buildStudyNav(host) {
    var key = host.getAttribute('data-study');
    var n = PF.neighbours(key);
    var h = '';

    if (n.prev) {
      h += '<a class="csnav__side" href="' + n.prev.route + '"' + navAttrs(n.prev) + '>' +
             '<span class="csnav__dir"><span aria-hidden="true">&larr;</span> ' + PF.CTA.prev + '</span>' +
             navName(n.prev) +
           '</a>';
    }

    /* The foot of a study leaves the study, so it goes to the top of the
       index like the bar at the head of it does. js/case.js puts the viewport
       at zero after the route runs. */
    h += '<a class="csnav__work" href="' + PF.WORK.top + '">' +
           '<span aria-hidden="true">&uarr;</span> ' + PF.CTA.back +
         '</a>';

    if (n.next) {
      h += '<a class="csnav__side csnav__side--next" href="' + n.next.route + '"' + navAttrs(n.next) + '>' +
             '<span class="csnav__dir">' + PF.CTA.next + ' <span aria-hidden="true">&rarr;</span></span>' +
             navName(n.next) +
           '</a>';
    }

    host.innerHTML = h;
    host.setAttribute('data-built', '1');
  }

  /* ---------------------------------------------------------------------
     BOOT
     --------------------------------------------------------------------- */

  PF.initRoutes = function (scope) {
    scope = scope || document;

    var projects = scope.querySelectorAll('[data-project]');
    for (var i = 0; i < projects.length; i++) wireProject(projects[i]);

    var work = scope.querySelectorAll('[data-work-link]');
    for (var j = 0; j < work.length; j++) wireWork(work[j]);

    var ext = scope.querySelectorAll('[data-link]');
    for (var k = 0; k < ext.length; k++) wireExternal(ext[k]);

    var studies = scope.querySelectorAll('[data-study]');
    for (var m = 0; m < studies.length; m++) buildStudyNav(studies[m]);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { PF.initRoutes(); });
  } else {
    PF.initRoutes();
  }

})(window.PF);

/* ==========================================================================
   THE CONTENTS CONTROL

   A case study's table of contents is eleven links. On a desktop column that
   is a sidebar; on a phone it is a screen and a half of navigation standing
   between the reader and the first sentence. So on a phone it collapses to
   one row that says what it is and how many sections there are, and opens in
   place, no overlay, no new context to escape from, and the anchors inside
   are ordinary anchors that scroll the page the way anchors do.

   Above the phone breakpoint the toggle is display:none and the list is
   always open, so nothing about the desktop reading experience changes.
   ========================================================================== */

(function (PF) {
  'use strict';

  function build(toc) {
    if (toc.querySelector('.toc__toggle')) return;
    var list = toc.querySelector('ol, ul');
    if (!list) return;

    var btn = document.createElement('button');
    btn.className = 'toc__toggle';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    /* An icon, not a sentence. The count used to sit here as "11 sections ▾"
       and the open state rotated the whole span, which turned the words
       upside down along with the caret. The circle is the same control the
       project cards carry, pointing down when closed and up when open. */
    btn.innerHTML =
      '<span>Contents</span>' +
      '<span class="toc__ico">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
          '<path d="M7 10l5 5 5-5"/>' +
        '</svg>' +
      '</span>';

    if (!list.id) list.id = 'toc-' + Math.random().toString(36).slice(2, 8);
    btn.setAttribute('aria-controls', list.id);

    toc.setAttribute('data-open', '0');
    toc.insertBefore(btn, toc.firstChild);

    btn.addEventListener('click', function () {
      var open = toc.getAttribute('data-open') === '1';
      toc.setAttribute('data-open', open ? '0' : '1');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    /* Choosing a section closes the list on the way out, so the reader lands
       on the heading rather than behind the menu they just used. */
    list.addEventListener('click', function (e) {
      if (!e.target.closest('a')) return;
      toc.setAttribute('data-open', '0');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  var prev = PF.initRoutes;
  PF.initRoutes = function (scope) {
    prev(scope);
    scope = scope || document;
    var tocs = scope.querySelectorAll('.ar-toc');
    for (var i = 0; i < tocs.length; i++) build(tocs[i]);
  };

  if (document.readyState !== 'loading') PF.initRoutes();

})(window.PF);

/* ==========================================================================
   THE LAUNCH ARROW

   A diagonal arrow in the top-right corner of every project card that has
   somewhere to go. It is the convention for "this opens" and it is visible
   without hover, which is the whole point on a phone.

   IT IS NOT A SECOND LINK. The card already has one overlay anchor covering
   the whole tile; adding an anchor inside the corner would give one tap two
   possible meanings and two history entries. So the arrow is a decorative
   span sitting above the overlay in z-order but with pointer-events off. 
   The tap always lands on the one link that was already there.

   Cards whose study is not written do not get one. The corner is the promise
   that something opens, and nothing does.
   ========================================================================== */

(function (PF) {
  'use strict';

  var SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M8 16 L16 8"/><path d="M9.5 8 H16 V14.5"/>' +
    '</svg>';

  function add(link) {
    if (!link.getAttribute('href')) return;              /* nothing opens */
    var card = link.closest('.card') || link.parentElement;
    if (!card || card.querySelector('.card__launch')) return;

    var el = document.createElement('span');
    el.className = 'card__launch';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = SVG;
    card.appendChild(el);
    card.setAttribute('data-launch', '1');
  }

  var prev = PF.initRoutes;
  PF.initRoutes = function (scope) {
    prev(scope);
    scope = scope || document;
    var links = scope.querySelectorAll('.card__overlay-link[data-project]');
    for (var i = 0; i < links.length; i++) add(links[i]);
  };

  if (document.readyState !== 'loading') PF.initRoutes();

})(window.PF);


/* ===== js/dsseq.js ===== */
/* ==========================================================================
   dsseq.js: THE STATUS PAIR PLAYS INSTEAD OF POINTING

   On a phone the Design System Audit thumbnail shows one transformation:
   Pending, then Awaiting provider action. The arrow that used to sit between
   them is gone (css above), so the order has to be carried by time. The old
   label arrives, then the new one, which is the finding stated as a sequence
   rather than drawn as a diagram.

   Three things this deliberately does not do. It does not run above 719px,
   where the arrow is still there and five pairs are visible at once. It does
   not run for a reader who asked for less motion, in that case the attribute
   is never set, so the CSS never hides anything and the pair is simply there.
   And it does not stage anything before the thumbnail is actually on screen,
   or a sequence whose whole point is being watched plays to nobody.

   It replays on re-entry. The card is a thumbnail inside a long scrolling
   column; somebody who scrolls back to it is usually scrolling back to look
   at it again.
   ========================================================================== */
(function () {
  'use strict';

  var thumb = document.querySelector('.ds-thumb');
  if (!thumb) return;

  var row = thumb.querySelector('.ds-row');
  var chips = row ? row.querySelectorAll('.ds-chip') : [];
  if (!chips.length) return;

  /* No matchMedia, no observer, or motion turned down: leave the markup
     exactly as it is. The attribute below is what arms the CSS, so not
     setting it is the whole of the opt-out. */
  if (!window.matchMedia || !window.IntersectionObserver) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var phone = window.matchMedia('(max-width: 719px)');
  var timers = [];
  var io = null;

  function clear() {
    for (var t = 0; t < timers.length; t++) clearTimeout(timers[t]);
    timers = [];
  }

  /* One step per chip, in markup order, which is before, then after. */
  function play(on) {
    clear();
    var k;
    for (k = 0; k < chips.length; k++) chips[k].classList.remove('is-in');
    if (!on) return;
    for (k = 0; k < chips.length; k++) {
      (function (el, n) {
        timers.push(setTimeout(function () {
          el.classList.add('is-in');
        }, 420 * n));
      })(chips[k], k);
    }
  }

  function stop() {
    if (io) { io.disconnect(); io = null; }
    clear();
    thumb.removeAttribute('data-ds-seq');
    for (var k = 0; k < chips.length; k++) chips[k].classList.remove('is-in');
  }

  function start() {
    if (io) return;
    thumb.setAttribute('data-ds-seq', '');
    /* Most of it on screen, so scrolling past the card's top edge does not
       spend the sequence before it can be read. */
    io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) play(entries[i].isIntersecting);
    }, { threshold: 0.6 });
    io.observe(thumb);
  }

  function sync() { if (phone.matches) start(); else stop(); }

  sync();
  if (phone.addEventListener) phone.addEventListener('change', sync);
  else if (phone.addListener) phone.addListener(sync);
})();


/* ==========================================================================
   CASE-STUDY SECTIONS

   Five per study. The first carries the outcome and is not collapsible. A
   reader who opens nothing still leaves knowing what happened and what I did.
   The rest are ordinary accordions.

   Nothing auto-opens, auto-closes, scrolls the page or closes a sibling.
   Several can be open at once, because comparing two sections is a reasonable
   thing to want. A deep link to a heading inside a closed section opens it.
   ========================================================================== */

(function (PF) {
  'use strict';

  var CARET =
    '<span class="acc__ico" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" focusable="false"><path d="M7 10l5 5 5-5"/></svg>' +
    '</span>';

  function build(sec) {
    if (sec.querySelector('.acc__h')) return;

    var head = sec.querySelector('[data-acc-h]');
    var body = sec.querySelector('[data-acc-b]');
    if (!head || !body) return;

    /* A case study marked data-flow is one continuous scroll: every section
       is open, the header becomes a plain heading, and nothing toggles. */
    var flow = !!(sec.closest && sec.closest('[data-flow]'));
    if (flow) { sec.classList.add('acc--static'); sec.setAttribute('data-open', '1'); }

    var open = flow || sec.getAttribute('data-open') === '1';
    var stat = flow || sec.classList.contains('acc--static');

    if (!body.id) body.id = 'sec-' + Math.random().toString(36).slice(2, 8);

    /* A section that cannot toggle is not a button. */
    var btn = document.createElement(stat ? 'div' : 'button');
    btn.className = 'acc__h';
    if (!stat) {
      btn.type = 'button';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-controls', body.id);
    }

    btn.innerHTML = '<span class="acc__t">' + head.innerHTML + '</span>' + (stat ? '' : CARET);

    head.parentNode.replaceChild(btn, head);
    sec.setAttribute('data-open', open ? '1' : '0');

    if (stat) return;

    btn.addEventListener('click', function () {
      var on = sec.getAttribute('data-open') === '1';
      sec.setAttribute('data-open', on ? '0' : '1');
      btn.setAttribute('aria-expanded', on ? 'false' : 'true');
    });
  }

  /* A link into a collapsed section opens it before the browser jumps. */
  function reveal(hash) {
    if (!hash || hash.length < 2) return;
    var t;
    try { t = document.querySelector(hash); } catch (e) { return; }
    if (!t) return;
    var sec = t.closest('.acc');
    if (!sec || sec.getAttribute('data-open') === '1') return;
    sec.setAttribute('data-open', '1');
    var b = sec.querySelector('.acc__h');
    if (b) b.setAttribute('aria-expanded', 'true');
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) reveal(a.getAttribute('href'));
  }, true);

  var prev = PF.initRoutes;
  PF.initRoutes = function (scope) {
    prev(scope);
    scope = scope || document;
    var secs = scope.querySelectorAll('.acc');
    for (var i = 0; i < secs.length; i++) build(secs[i]);
  };

  if (document.readyState !== 'loading') PF.initRoutes();

})(window.PF);


/* ===== js/main.js ===== */
/* ==========================================================================
   main.js: boot + the few text bindings that CSS can't express.
   ========================================================================== */

(function (PF) {
  'use strict';

  /* --- Placeholder links --------------------------------------------------
     Case studies, résumé and social links are not wired yet. Keep them
     focusable and obvious in the DOM, but don't jump the page.
     Delete this block once the real hrefs are in place. */
  function neutralisePlaceholders() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-placeholder-link]');
      if (!link) return;
      event.preventDefault();
    });
  }

  /* --- A LINK INSIDE A CARD IS NOT THE CARD -------------------------------

     Two sentences on this page end in a link of their own: the guide, which
     saves a file, and the Scale project, which opens a site. Both sit in the
     middle of a project's copy, and a project card is built to be one target: 
     a stretched anchor across its face, and the delegated handler above, which
     cancels any click that surfaces from inside something marked as a
     placeholder. Either of them would take these clicks: the first by being on
     top of them, the second by cancelling them. The reader would press
     "Download my guide" and get the case study, or nothing at all.

     So the click stops here. Not prevented: propagation only, which leaves the
     anchor's own default (save the file, follow the href) to happen exactly
     as it would on any other link. `.pv__go` already lifts the phrase above the
     stretched anchor with z-index, so this is the other half of the same
     guard: one keeps the card off the link, this keeps the link off the card.

     Bound to the element rather than delegated, because a listener on the
     document could only run after the document's other listeners had already
     had the event. */
  function isolateSoloLinks() {
    var links = document.querySelectorAll('[data-pf-solo]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (event) {
        event.stopPropagation();
      });
    }
  }

  function boot() {
    PF.initTheme();       // before anything paints state
    PF.initSteppers();    // multi-image galleries
    PF.initMedia();       // slot video / Lottie playback
    PF.initCase();        // #/carry routing + the case study's scenes
    neutralisePlaceholders();
    isolateSoloLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.PF);

/* ==========================================================================
   The light follows the pointer

   One soft radial on the page's ground, centred on the cursor. The gradient
   itself is in 02-base.css on the body; all this does is keep two custom
   properties up to date, which means no layout, no repaint of anything above
   the ground, and one composited background paint per frame at most.

   Eased rather than tracked. A glow pinned exactly to the cursor reads as a
   cursor accessory; one that follows a beat behind reads as light in a room,
   which is the whole idea. The easing runs on rAF and stops itself the moment
   it has caught up, so a still pointer costs nothing.

   Pointer only. A touch screen has no cursor to follow and a finger is on top
   of the thing it would light, so coarse pointers never start it, and neither
   does a visit that has asked for reduced motion.
   ========================================================================== */

(function () {
  'use strict';

  if (!window.matchMedia) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* A room somebody has to light with a torch is the opposite of what more
     contrast means. */
  if (window.matchMedia('(prefers-contrast: more)').matches) return;

  var root = document.documentElement;

  /* ONE GATE FOR THE WHOLE APPARATUS. The dark theme's veil, torch and beam
     are three layers of one idea, and all three of them are worthless (worse,
     the veil is actively harmful), without a pointer to move them. So the
     stylesheet does not decide for itself: it waits for this class, which is
     only ever added on a fine pointer, with motion allowed, by a script that
     has actually run, and at a width with room to sweep a beam across. A page
     with no JavaScript, a phone, a tablet, a half-width window, a reader who
     has asked for less movement or more contrast: none of them are handed a
     dark room they cannot light.

     The other four conditions were settled above and cannot change; this one
     can, because a window can be dragged. So it is watched rather than read
     once, and crossing the breakpoint in either direction adds or removes the
     whole apparatus: the class, the properties, the frame loop, and the
     listeners themselves. Below it nothing is tracked and nothing is bound. */
  var wide = window.matchMedia('(min-width: 960px)');

  /* FOUR NODES, NOT FOUR CUSTOM PROPERTIES, AND THIS IS THE WHOLE FIX.

     The first build of this wrote --fx/--fy/--px/--py onto :root every frame
     and let the stylesheet position the layers from them. It looked clean and
     it was extremely slow, for a reason that is easy to miss: custom
     properties inherit. Writing one on the root element invalidates the
     computed style of every element that could read it, which is all of them (
     2,964 on this page), and it happens on every single pointer frame.

     Measured on this page, sweeping the pointer for a second:

       write --ex/--ey on :root ......... 254 ms/s of style recalculation
       write .style.transform on a node .. 22 ms/s
       write nothing at all .............. 21 ms/s

     So nothing is written to :root any more. Each layer is a real element,
     each one gets its transform set directly, and because the gradients inside
     them never move, the browser rasterises each layer once and only ever
     composites it afterwards.

     The elements centre themselves: their CSS ends in translate(-50%, -50%),
     which resolves against each box's own size, so this code only ever has to
     know where the pointer is, not how big any of the four boxes are. */
  var wash  = document.querySelector('.pf-wash');
  var veil  = document.querySelector('.pf-veil');
  var torch = document.querySelector('.pf-torch');
  var beam  = document.querySelector('.pf-beam');
  if (!wash || !veil || !torch || !beam) return;

  var CENTRE = ' translate(-50%, -50%)';

  var toX = 0, toY = 0;             /* where the pointer is */
  var atX = 0, atY = 0;             /* where the eased light has got to */
  var rawX = -9999, rawY = -9999;   /* and where it is right now */
  var seen = false;                 /* has the pointer ever been on the page */
  var raf = 0;

  function place(el, x, y) {
    el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)' + CENTRE;
  }

  function frame() {
    /* TWO CLOCKS, ON PURPOSE.

       The beam on the type is written first and unsmoothed: it is the light
       arriving at the surface, and light does not lag. The wash and the torch
       ease in behind it, so the effect is layered rather than uniform. The
       cursor reaches the letters, the letters catch it on the next frame, and
       the wide light drifts up a moment later. */
    place(beam, rawX, rawY);

    /* A fifth of the remaining distance a frame: quick enough to keep up with
       a slow read, slow enough that a flick across the page is a sweep rather
       than a jump. */
    atX += (toX - atX) * 0.075;
    atY += (toY - atY) * 0.075;

    place(wash, atX, atY);
    place(veil, atX, atY);
    place(torch, atX, atY);

    if (Math.abs(toX - atX) > 0.4 || Math.abs(toY - atY) > 0.4) {
      raf = window.requestAnimationFrame(frame);
    } else {
      raf = 0;
    }
  }

  /* THE LANDING PAGE, AND NOWHERE ELSE. js/case.js writes the route on the
     root as it switches views; the stylesheet reads the same attribute. This
     is the other half of it: off the landing page nothing is tracked, nothing
     is written and no frame is asked for, so a case study costs exactly what
     it cost before any of this existed. */
  function home() { return root.getAttribute('data-route') === 'home'; }

  function move(e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (!home()) return;
    rawX = e.clientX;
    rawY = e.clientY;
    toX = rawX;
    toY = rawY;
    /* The first sighting is a jump, not a sweep: easing in from the page's
       default corner would drag a light across the whole screen before the
       reader has done anything. */
    if (!seen) { seen = true; atX = toX; atY = toY; }
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  /* Off the window, off the surface. A beam parked where the pointer left is a
     torch somebody put down on the page and walked away from. */
  function away() {
    rawX = -9999;
    rawY = -9999;
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  function bind() {
    root.classList.add('has-torch');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', away, { passive: true });
    window.addEventListener('blur', away);
  }

  function unbind() {
    root.classList.remove('has-torch');
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerleave', away);
    window.removeEventListener('blur', away);

    /* Nothing is left holding a position. The properties come off rather than
       being set to something harmless, the loop is cancelled rather than left
       to notice, and the whole thing starts from the page's own defaults if
       the window is dragged back out again. */
    if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
    rawX = rawY = -9999;
    toX = atX = toY = atY = 0;
    seen = false;
    wash.style.transform = veil.style.transform =
      torch.style.transform = beam.style.transform = '';
  }

  function sync() { if (wide.matches) bind(); else unbind(); }

  sync();
  if (wide.addEventListener) wide.addEventListener('change', sync);
  else if (wide.addListener) wide.addListener(sync);

  /* Leaving the landing page puts the torch down: the properties are removed
     rather than left at their last value, so nothing about where the pointer
     happened to be when somebody clicked into a case study survives the
     journey, and coming back starts from the page's own defaults until the
     hand moves again. */
  window.addEventListener('hashchange', function () {
    if (home()) return;
    rawX = -9999;
    rawY = -9999;
    seen = false;
    wash.style.transform = veil.style.transform =
      torch.style.transform = beam.style.transform = '';
  });
})();


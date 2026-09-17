
/* ==========================================================================
   ofw.js — the OptiFlow walkthrough

   One reconstructed screen, three sequences over it, and a cursor.

   THE SEQUENCES ARE LISTS OF BEATS, NOT ANIMATIONS. Each beat names a control
   to travel to, how long to sit on it before pressing, and what the press
   changes. Nothing here tweens the interface: the beat sets an attribute or a
   class and the stylesheet does the rest, which is why the screen behaves like
   a screen — a menu opens, a group grows, a tag lands — instead of like a
   slideshow of six pictures.

   THE CURSOR TRAVELS IN THE SCREEN'S OWN COORDINATES. The screen is laid out
   at 1360×876 and scaled to fit the frame, and the cursor lives inside that
   scaled layer, so a control's centre is read straight off its box and no
   measurement has to be converted. Travel time is proportional to distance,
   with a floor and a ceiling, so a short hop is quick and a long one across
   the screen still reads as one movement rather than a jump.

   Nothing runs until the frame is on screen, and nothing runs at all under
   reduced motion — there the screen is simply shown in its starting state.
   ========================================================================== */

window.PF = window.PF || {};

(function (PF) {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function build(root) {
    if (root.hasAttribute('data-ofw-ready')) return;
    root.setAttribute('data-ofw-ready', '1');

    var screen = root.querySelector('[data-screen]');
    var stage = root.querySelector('.ofw__stage');
    var cursor = root.querySelector('[data-cursor]');
    var caption = root.querySelector('[data-ofwcap]');
    var seg = root.querySelectorAll('.ofw__seg button');
    var W = 1360, H = 876;

    /* ---- fit ------------------------------------------------------------ */

    function fit() {
      var w = stage.clientWidth;
      if (!w) return;
      screen.style.transform = 'scale(' + (w / W).toFixed(5) + ')';
    }
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);
    fit();

    /* ---- the cursor ----------------------------------------------------- */

    var at = { x: 250, y: 690 };
    var timers = [];
    var raf = 0;

    function clear() {
      for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
      timers = [];
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function place(x, y) {
      at.x = x; at.y = y;
      cursor.style.setProperty('--cx', x.toFixed(1) + 'px');
      cursor.style.setProperty('--cy', y.toFixed(1) + 'px');
      cursor.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    }
    place(at.x, at.y);

    /* Where a control is, in the screen's own pixels. The screen is scaled, so
       both boxes are divided by the same scale and the ratio is exact. */
    function centre(sel) {
      var el = typeof sel === 'string' ? screen.querySelector(sel) : sel;
      if (!el) return null;
      var b = el.getBoundingClientRect(), s = screen.getBoundingClientRect();
      var k = (s.width / W) || 1;
      return { x: (b.left - s.left) / k + (b.width / k) / 2,
               y: (b.top - s.top) / k + (b.height / k) / 2 };
    }

    /* Someone demonstrating a prototype does not move in a straight line at a
       constant rate. This eases out of rest and into the target, and bends the
       path very slightly so the travel reads as a hand rather than a tween. */
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function moveTo(p, done) {
      var x0 = at.x, y0 = at.y, dx = p.x - x0, dy = p.y - y0;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var ms = Math.max(260, Math.min(820, 230 + dist * 1.05));
      var bend = Math.min(26, dist * 0.06) * (dx >= 0 ? 1 : -1);
      var t0 = performance.now();
      (function step(now) {
        var t = Math.min(1, (now - t0) / ms), e = ease(t);
        var arc = Math.sin(Math.PI * t) * bend;
        place(x0 + dx * e, y0 + dy * e - arc * 0.35);
        if (t < 1) raf = requestAnimationFrame(step);
        else { raf = 0; done && done(); }
      })(t0);
    }

    function press(done) {
      cursor.classList.add('is-click');
      timers.push(setTimeout(function () {
        cursor.classList.remove('is-click');
        done && done();
      }, 170));
    }

    /* ---- the screen's state --------------------------------------------- */

    var slot = screen.querySelector('[data-slot="pr"]');
    var carc = screen.querySelector('[data-t="carc-197"]');
    var ckwrap = screen.querySelector('[data-ckwrap]');
    var other = screen.querySelector('[data-other]');
    var addCk = ckwrap.innerHTML;
    var remCk = root.querySelector('[data-ck-remove]').innerHTML;
    var menu = screen.querySelector('[data-menu-el]');
    var val = screen.querySelector('[data-t="validate"]');

    var CAPTION = {
      add: 'The reviewer adds a code the model missed, says why, and validates.',
      remove: 'The reviewer takes out a code the model got wrong, says why, and validates.',
      keep: 'The reviewer reads the evidence behind the model’s suggestion, agrees, and validates.'
    };

    function reset(mode) {
      clear();
      root.setAttribute('data-mode', mode);
      root.setAttribute('data-menu', '0');
      root.setAttribute('data-fb', '0');
      root.setAttribute('data-snack', '0');
      root.setAttribute('data-valid', mode === 'keep' ? '1' : '0');
      slot.innerHTML = '';
      carc.className = 'ofw-tag';
      carc.style.display = '';
      ckwrap.innerHTML = mode === 'remove' ? remCk : addCk;
      other.style.display = mode === 'remove' ? 'none' : '';
      screen.querySelector('[data-fbverb]').textContent = mode === 'remove' ? 'Removed:' : 'Added:';
      screen.querySelector('[data-fbtag]').innerHTML =
        mode === 'remove' ? '197 — Authorization Missing' : 'PR — Patient Responsibility';
      screen.querySelector('[data-fbq]').textContent =
        mode === 'remove' ? 'Why did you remove this tag?' : 'Why did you make this change?';
      screen.querySelector('[data-snacktext]').innerHTML =
        mode === 'remove' ? 'Removed: 197 — Authorization Missing'
                          : 'Added: PR — Patient Responsibility';
      val.classList.remove('is-press');
      [].forEach.call(screen.querySelectorAll('.ofw-menu__o'), function (o) {
        o.classList.remove('is-hl');
      });
      if (caption) caption.textContent = CAPTION[mode];
      place(250, 690);
    }

    /* The menu hangs off the control that opened it, measured rather than
       positioned by hand, so it stays put at any scale. */
    function openMenu() {
      var p = centre('[data-t="plus-prefix"]');
      menu.style.left = (p.x - 18) + 'px';
      menu.style.top = (p.y + 16) + 'px';
      root.setAttribute('data-menu', '1');
    }

    /* ---- the beats ------------------------------------------------------ */

    function run(steps, i) {
      if (i >= steps.length) {
        timers.push(setTimeout(function () { play(root.getAttribute('data-mode')); }, 2200));
        return;
      }
      var s = steps[i];
      var go = function () {
        timers.push(setTimeout(function () {
          if (s.click) {
            press(function () {
              s.act && s.act();
              timers.push(setTimeout(function () { run(steps, i + 1); }, s.after || 700));
            });
          } else {
            s.act && s.act();
            timers.push(setTimeout(function () { run(steps, i + 1); }, s.after || 700));
          }
        }, s.hold || 320));
      };
      if (s.to) {
        var p = centre(s.to);
        if (!p) { run(steps, i + 1); return; }
        moveTo(p, go);
      } else go();
    }

    function seq(mode) {
      if (mode === 'add') return [
        { to: '[data-t="plus-prefix"]', hold: 520, click: 1, act: openMenu, after: 620 },
        { to: '[data-t="opt-pr"]', hold: 300,
          act: function () { screen.querySelector('[data-t="opt-pr"]').classList.add('is-hl'); },
          after: 420 },
        { to: '[data-t="opt-pr"]', hold: 120, click: 1, after: 520, act: function () {
            screen.querySelector('[data-t="opt-pr"]').classList.remove('is-hl');
            root.setAttribute('data-menu', '0');
            slot.innerHTML = '<span class="ofw-tag ofw-tag--mine ofw-tag--new" data-t="pr">' +
              '<span class="ofw-t">PR — Patient Responsibility</span>' +
              '<span class="ofw-x">×</span></span>';
          } },
        { hold: 260, after: 1500, act: function () {
            root.setAttribute('data-fb', '1');
            root.setAttribute('data-snack', '1');
            timers.push(setTimeout(function () { root.setAttribute('data-snack', '0'); }, 2600));
          } },
        { to: '[data-ck="a0"]', hold: 560, click: 1, after: 1400, act: function () {
            screen.querySelector('[data-ck="a0"]').classList.add('is-on');
            root.setAttribute('data-valid', '1');
          } },
        { to: '[data-t="validate"]', hold: 480, click: 1, after: 1200, act: function () {
            val.classList.add('is-press');
            timers.push(setTimeout(function () {
              root.setAttribute('data-fb', '0');
              slot.innerHTML = '<span class="ofw-tag" data-t="pr"><span class="ofw-t">' +
                'PR — Patient Responsibility</span>' + BOT + '<span class="ofw-x">×</span></span>';
            }, 420));
          } }
      ];

      if (mode === 'remove') return [
        { to: '[data-t="carc-197"] .ofw-x', hold: 620, click: 1, after: 520, act: function () {
            carc.classList.add('is-going');
          } },
        { hold: 240, after: 900, act: function () {
            carc.classList.add('is-gone');
            timers.push(setTimeout(function () { carc.style.display = 'none'; }, 340));
            root.setAttribute('data-fb', '1');
            root.setAttribute('data-snack', '1');
            timers.push(setTimeout(function () { root.setAttribute('data-snack', '0'); }, 3000));
          } },
        { to: '[data-ck="r0"]', hold: 620, click: 1, after: 1400, act: function () {
            screen.querySelector('[data-ck="r0"]').classList.add('is-on');
            root.setAttribute('data-valid', '1');
          } },
        { to: '[data-t="validate"]', hold: 480, click: 1, after: 1200, act: function () {
            val.classList.add('is-press');
            timers.push(setTimeout(function () { root.setAttribute('data-fb', '0'); }, 420));
          } }
      ];

      /* Keep: there is no correction, so there is no panel. The interaction is
         reading the evidence and agreeing with it. */
      return [
        { to: '[data-t="carc-197"]', hold: 900, after: 700 },
        { to: '.ofw-ev .ofw-ev__row:nth-of-type(1)', hold: 300, after: 600 },
        { to: '.ofw-ev .ofw-q span:first-child', hold: 1700, after: 900 },
        { to: '[data-t="validate"]', hold: 520, click: 1, after: 1600, act: function () {
            val.classList.add('is-press');
          } }
      ];
    }

    var BOT = '';
    (function () {
      var b = screen.querySelector('.ofw-tag .ofw-bot');
      if (b) BOT = b.outerHTML;
    })();

    function play(mode) {
      reset(mode);
      root.setAttribute('data-run', '1');
      timers.push(setTimeout(function () { run(seq(mode), 0); }, 700));
    }

    /* ---- the switch ------------------------------------------------------ */

    for (var i = 0; i < seg.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          for (var k = 0; k < seg.length; k++) seg[k].setAttribute('aria-selected', 'false');
          btn.setAttribute('aria-selected', 'true');
          if (still()) { reset(btn.getAttribute('data-mode')); return; }
          play(btn.getAttribute('data-mode'));
        });
      })(seg[i]);
    }

    function still() { return reduced.matches; }

    /* ---- only while it is on screen -------------------------------------- */

    reset('add');
    if (still()) return;

    if (window.IntersectionObserver) {
      var seen = false;
      new IntersectionObserver(function (es) {
        for (var j = 0; j < es.length; j++) {
          if (es[j].isIntersecting && !seen) { seen = true; play('add'); }
          else if (!es[j].isIntersecting && seen) { seen = false; clear(); root.setAttribute('data-run', '0'); }
        }
      }, { threshold: 0.35 }).observe(root);
    } else play('add');
  }

  function init(scope) {
    scope = scope || document;
    var all = scope.querySelectorAll('[data-ofw]');
    for (var i = 0; i < all.length; i++) build(all[i]);
  }

  var prev = PF.initRoutes;
  if (typeof prev === 'function') {
    PF.initRoutes = function (s) { prev(s); init(s); };
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else init(document);

})(window.PF);


/* ===== js/peek.js ===== */
/* ==========================================================================
   peek.js — POINTING AT A TITLE ANSWERS WITH ITS CARD

   The "See the work" list already tells the browser which project a reader is
   pointing at: js/thread.js emits pf:project on pointerenter and js/projects.js
   answers by bringing that slide up. Above the ultrawide gate there is no
   bringing-up to do — every card is already on screen — so that gesture has no
   answer, and this is the one the grid can give.

   It reads the same name off the same row and finds the card the same way
   js/projects.js does, so the mapping is one table, not two: whatever the list
   says a row is called is what the card's own title has to say back.

   NOTHING HERE TOUCHES THE LIST, and nothing here is a new control. Two
   attributes go on and come off; the stylesheet does the rest, and does it
   only above 2100.
   ========================================================================== */

(function () {
  'use strict';

  var UW = window.matchMedia('(min-width: 2100px)');

  function grid() {
    return document.querySelector('.page[data-view="home"] .hero__work');
  }

  /* A SLIDE ANSWERS TO MORE THAN ONE NAME, AND IT HAS TO.

     js/projects.js takes data-pv-name in preference to the title, which is
     right for the event it serves. It is an override on top of the title, and
     no slide carries one any more: Carry's said "Carry", left over from when
     the list emitted studio shorthand, and it went on answering to that after
     the list had started sending headings — which is how the one card at the
     top of the list stopped responding to its own row. Matching on every name
     a slide has means a single override reintroduced somewhere cannot
     silently drop a card again.

     Hrefs are not the key either, however much they look like one: the audit
     row points at #/audit and its slide is data-project="dsa". So the match is
     against every name a slide has, and a row only has to hit one of them. */
  function namesOf(el) {
    var out = [];
    var given = el.getAttribute('data-pv-name');
    if (given) out.push(given.trim().toLowerCase());
    var t = el.querySelector('.pv__title');
    if (t && t.textContent) out.push(t.textContent.trim().toLowerCase());
    var lab = el.getAttribute('aria-label');
    if (lab) out.push(lab.trim().toLowerCase());
    return out;
  }

  function clear() {
    var w = grid();
    if (!w) return;
    w.removeAttribute('data-peek');
    var on = w.querySelectorAll('.pv__slide[data-peek-on]');
    for (var i = 0; i < on.length; i++) on[i].removeAttribute('data-peek-on');
  }

  function peek(name) {
    var w = grid();
    if (!w) return;
    if (!UW.matches || !name) return clear();

    var want = String(name).trim().toLowerCase();
    var sl = w.querySelectorAll('.pv__slide'), hit = null, i;
    for (i = 0; i < sl.length; i++) {
      /* IN THE GRID, NOT MERELY IN THE DOCUMENT. Every slide is in the
         document at every width — the ultrawide layout brings six of them back
         into flow by name and leaves the rest display:none, which is how a
         project can be in the browser below the gate and not up here. Matching
         on the document would find one of those, sharpen something nobody can
         see and blur the six cards that are actually on screen. A slide with
         no box is not a card in this grid. */
      if (!sl[i].getClientRects().length) continue;
      if (namesOf(sl[i]).indexOf(want) >= 0) { hit = sl[i]; break; }
    }
    /* A row with no card — a placeholder, a project the grid does not carry,
       or a role whose work is not in this grid — leaves the grid alone rather
       than blurring all of it. */
    if (!hit) return clear();

    for (i = 0; i < sl.length; i++) {
      if (sl[i] === hit) sl[i].setAttribute('data-peek-on', '');
      else sl[i].removeAttribute('data-peek-on');
    }
    w.setAttribute('data-peek', '');
  }

  function rowName(row) {
    var t = row.querySelector('.plist__word');
    return t ? t.textContent : '';
  }

  /* Delegated, because the list is built on demand and rebuilt on every role
     change — there is no element here to bind to at load. */
  document.addEventListener('pointerover', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var row = t.closest('.plist__row');
    if (row) peek(rowName(row));
  });

  /* Leaving one row for another is not leaving the list, and the grid must not
     flash back to sharp in between — so the only pointerout that clears is the
     one whose destination is outside the list. */
  document.addEventListener('pointerout', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var list = t.closest('.plist');
    if (!list) return;
    var to = e.relatedTarget;
    if (to && to.nodeType === 1 && list.contains(to)) return;
    clear();
  });

  /* Three ways the list can stop existing under a pointer that never moved:
     Back, a role change, and a window dragged below the gate. All of them are
     the same instruction. */
  document.addEventListener('pf:role', clear);
  if (UW.addEventListener) UW.addEventListener('change', clear);
  else if (UW.addListener) UW.addListener(clear);
})();

/* ===== js/bim.js ===== */
/* ==========================================================================
   bim.js — THE READER CAN STOP THE TURN

   The metric rotation is CSS and stays CSS. This file does not drive it; it
   holds it still while somebody is reading, and lets it go again afterwards.

     · opening a disclosure PAUSES the turn on the metric it belongs to
     · closing it resumes, with that metric's full reading interval restarted
     · one disclosure open at a time

   WHY PAUSE RATHER THAN CLOSE. The previous version closed the panel when the
   metric rotated away, which is the same event handled from the wrong end: the
   reader asked for more, and the component answered by taking it away mid
   sentence. Holding the turn instead makes the component reader-controlled —
   automatic while untouched, still while it is being read.

   WHICH METRIC IS SHOWING, WITHOUT TRACKING IT. Every item in a group shares
   one clock and differs only by animation-delay, one slot apart. So the slot
   is dur/n and the metric on screen is simply which slot the clock is in:
   floor(t / slot). No counter to keep in step with the CSS, and nothing to
   drift.

   RESUMING RESTARTS THE INTERVAL rather than continuing it. Setting the clock
   to the start of the current slot, plus the fade, drops the reader back at
   the top of that metric's hold with the whole 4-odd seconds ahead of it —
   fully opaque, not mid-crossfade, and never one frame from advancing. Doing
   the same snap on open is what guarantees the paused frame is a legible
   metric rather than whatever the fade happened to be part-way through.

   Reduced motion has no animations to hold, so every call here is a no-op and
   the <details> behaves as a plain disclosure, which is all it ever needed.
   ========================================================================== */

(function () {
  'use strict';

  /* Where the fade-in FINISHES, not how long it lasts. The crossfade is 250ms,
     and snapping to exactly 250 lands a hair short of the keyframe that reaches
     full opacity — measured at 0.975, which is a metric held slightly
     transparent for as long as somebody reads. 260 clears the stop in both
     keyframe sets (1.9% of 13.5s = 257ms; 1.1% of 22.5s = 248ms) and so starts
     the hold at a fully opaque frame. */
  var HOLD_STARTS = 260;

  function group(el) { return el.closest ? el.closest('.bim') : null; }

  function animationsIn(box) {
    var out = [], its = box.querySelectorAll('.bim__item'), i, list, j;
    for (i = 0; i < its.length; i++) {
      if (!its[i].getAnimations) continue;
      list = its[i].getAnimations();
      for (j = 0; j < list.length; j++) out.push(list[j]);
    }
    return out;
  }

  /* dur and n, read off the running animation rather than assumed. */
  function shape(box, list) {
    var a = list[0];
    if (!a || !a.effect || !a.effect.getComputedTiming) return null;
    var dur = a.effect.getComputedTiming().duration;
    if (typeof dur !== 'number' || !dur) return null;
    var n = box.querySelectorAll('.bim__item').length;
    if (!n) return null;
    return { dur: dur, n: n, slot: dur / n, a: a };
  }

  /* The clock is shared, so the visible metric is the slot the clock is in. */
  function currentSlot(s) {
    if (s.a.currentTime === null) return 0;
    var t = ((s.a.currentTime % s.dur) + s.dur) % s.dur;
    return Math.floor(t / s.slot) % s.n;
  }

  /* Put every animation at the top of the showing metric's hold. */
  function snapToHold(box, list) {
    var s = shape(box, list);
    if (!s) return;
    var at = currentSlot(s) * s.slot + HOLD_STARTS;
    for (var i = 0; i < list.length; i++) {
      try { list[i].currentTime = at; } catch (err) { /* ignore */ }
    }
  }

  function hold(box) {
    var list = animationsIn(box);
    if (!list.length) return;
    for (var i = 0; i < list.length; i++) { try { list[i].pause(); } catch (e) {} }
    snapToHold(box, list);
  }

  function release(box) {
    var list = animationsIn(box);
    if (!list.length) return;
    snapToHold(box, list);
    for (var i = 0; i < list.length; i++) { try { list[i].play(); } catch (e) {} }
  }

  function closeOthers(box, keep) {
    var open = box.querySelectorAll('.bim__how[open]');
    for (var i = 0; i < open.length; i++) {
      if (open[i] !== keep) open[i].removeAttribute('open');
    }
  }

  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d || !d.classList || !d.classList.contains('bim__how')) return;

    var box = group(d);
    if (!box) return;

    if (d.open) {
      closeOthers(box, d);
      hold(box);
      return;
    }

    /* CLOSING. `toggle` is queued rather than dispatched inline, so the close
       of a panel that was displaced by another one arrives AFTER the new one
       has already paused the group — resuming here unconditionally would
       restart the turn underneath a disclosure that is still open. Asking the
       group instead of tracking who closed whom makes the order irrelevant. */
    if (box.querySelector('.bim__how[open]')) return;
    release(box);
  }, true);                              /* capture: `toggle` does not bubble */
})();

  /* ==========================================================================
     REACTING TO THE MESSAGE — PHONE ONLY
     ==========================================================================

     The three chips under the last bubble are somebody else's reactions. On a
     phone they become yours as well: tap one and it goes up by one and shows
     as selected; tap it again and it goes back to exactly the number the
     sequence left it on. A fourth control opens a small picker for the two
     that are not on the message yet.

     WHAT THE BASE IS. Every chip carries the count the animation finished on
     — 4, 2, 1 — and that is the floor. Toggling a chip that was already there
     never removes it, because removing somebody else's reaction is not what
     the gesture means; it only takes your own back off. A chip YOU added has
     a base of zero, so taking yours off leaves nothing and the chip goes.

     Nothing here persists. It is a local interaction on a portfolio, not an
     account, and a reload is a fresh conversation by design — the thread
     itself opens on Hello every time.
     -------------------------------------------------------------------------- */
  (function () {
    var thread = document.querySelector('.hero__thread');
    if (!thread) return;
    var row = thread.querySelector('.msg__reactions');
    if (!row) return;

    var narrow = window.matchMedia
      ? window.matchMedia('(max-width: 719px)') : null;
    function phoneRx() { return !!(narrow && narrow.matches); }

    var still = !!(window.matchMedia &&
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* The five the picker offers. Two of them — the exclamation and the
       starry face — are not on the message, so choosing one builds a chip. */
    var PICK = [
      { key: 'hundred', e: '\u{1F4AF}', label: 'hundred points' },
      { key: 'bang',    e: '❗',    label: 'exclamation' },
      { key: 'fire',    e: '\u{1F525}', label: 'fire' },
      { key: 'clap',    e: '\u{1F44F}', label: 'applause' },
      { key: 'star',    e: '\u{1F929}', label: 'star-struck' }
    ];

    function chipFor(key) {
      return row.querySelector('.rx[data-rx="' + key + '"]');
    }
    function countEl(chip) { return chip.querySelector('.rx__n'); }
    function countOf(chip) {
      var n = countEl(chip);
      var v = parseInt(n && n.textContent, 10);
      return isNaN(v) ? 0 : v;
    }

    /* The floor for this chip, recorded the first time anybody touches it so
       it is whatever the sequence actually finished on rather than a number
       copied out of the animation table. A chip the picker built declares a
       base of 0 when it is made. */
    function baseOf(chip) {
      if (!chip.hasAttribute('data-rx-base')) {
        chip.setAttribute('data-rx-base', String(countOf(chip)));
      }
      return parseInt(chip.getAttribute('data-rx-base'), 10) || 0;
    }

    function paint(chip, n, on) {
      var c = countEl(chip);
      if (c) c.textContent = n > 0 ? String(n) : '';
      chip.classList.toggle('is-on', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      var name = chip.getAttribute('data-rx-name') || 'this';
      chip.setAttribute('aria-label',
        (on ? 'Remove your ' : 'Add a ') + name + ' reaction' +
        (n > 0 ? ', ' + n + ' total' : ''));
    }

    function changed() {
      /* The tray can wrap onto a second line, and the box under the last
         bubble reserves the overhang. Tell the thread rather than hope. */
      document.dispatchEvent(new CustomEvent('pf:rx-changed'));
      syncPicker();
    }

    function bump(chip) {
      if (still) return;
      chip.classList.remove('is-tapped');
      void chip.offsetWidth;          /* one read, on a tap */
      chip.classList.add('is-tapped');
    }

    /* ---- adding and removing ------------------------------------------- */

    /* What the picker has built, kept so a replay of the conversation can put
       it back rather than silently dropping it. */
    var picked = {};
    /* Declared here and not beside normalise(): toggle() below reads them, and
       a `var` read before its assignment is `undefined` — which is precisely
       the bug that cost this file a first-load measurement. */
    var mine = {};
    var bases = {};

    function build(key, emoji, label, quiet) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'rx is-in';
      chip.setAttribute('data-rx', key);
      chip.setAttribute('data-rx-name', label);
      /* Built by the picker, so there is nothing of anybody else's in it: its
         floor is zero, and taking yours off leaves nothing to show. */
      chip.setAttribute('data-rx-base', '0');
      chip.innerHTML = '<span class="rx__e" aria-hidden="true"></span>' +
                       '<span class="rx__n" aria-hidden="true"></span>';
      chip.querySelector('.rx__e').textContent = emoji;
      /* Before the plus, always — the control that adds things stays at the
         end of what it has added. */
      row.insertBefore(chip, addBtn);
      paint(chip, 1, true);
      if (!quiet) bump(chip);
      return chip;
    }

    function toggle(chip) {
      var k = chip.getAttribute('data-rx');
      var base = baseOf(chip);
      var on = !chip.classList.contains('is-on');
      /* A chip nobody else reacted with is yours alone: taking it back leaves
         a count of nothing, and a chip showing nothing is not a chip. One
         somebody else left goes back to their number and stays. */
      if (!on && base === 0) { delete mine[k]; remove(chip); return; }
      mine[k] = on;
      paint(chip, base + (on ? 1 : 0), on);
      bump(chip);
      changed();
    }

    function add(key, emoji, label) {
      var chip = chipFor(key);
      if (chip) {
        /* Already on the message: this is the same gesture as tapping it. */
        if (!chip.classList.contains('is-on')) toggle(chip);
        else bump(chip);
        return;
      }
      picked[key] = { e: emoji, label: label };
      mine[key] = true;
      build(key, emoji, label);
      changed();
    }

    function remove(chip) {
      chip.parentNode.removeChild(chip);
      changed();
    }

    /* ---- the picker ------------------------------------------------------ */

    var veil = null, pick = null, openFrom = null;

    function buildPicker() {
      if (pick) return;
      veil = document.createElement('div');
      veil.className = 'rxpick__veil';

      pick = document.createElement('div');
      pick.className = 'rxpick';
      pick.setAttribute('role', 'group');
      pick.setAttribute('aria-label', 'Choose a reaction');

      for (var i = 0; i < PICK.length; i++) {
        (function (item) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'rxpick__btn';
          b.setAttribute('data-pick', item.key);
          b.setAttribute('aria-label', 'React with ' + item.label);
          b.textContent = item.e;
          b.addEventListener('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            add(item.key, item.e, item.label);
            close();
          });
          pick.appendChild(b);
        })(PICK[i]);
      }

      veil.addEventListener('click', function () { close(); });
      /* Both start out of the way. A veil left in the tree at full size
         swallows every tap on the page, which is the bug this line exists to
         not have. */
      veil.style.display = 'none';
      pick.style.display = 'none';
      document.body.appendChild(veil);
      document.body.appendChild(pick);
    }

    /* Which of the five are already on the message. Read from the row rather
       than from a list kept beside it, so it cannot drift. */
    function syncPicker() {
      if (!pick) return;
      for (var i = 0; i < PICK.length; i++) {
        var c = chipFor(PICK[i].key);
        var b = pick.querySelector('[data-pick="' + PICK[i].key + '"]');
        if (b) b.setAttribute('aria-pressed',
                 c && c.classList.contains('is-on') ? 'true' : 'false');
      }
    }

    /* PLACED AGAINST THE ROW, AND THEN AGAINST THE SCREEN. It wants to sit
       just above the reactions and share their right edge — which is where
       the thumb that opened it already is. Whatever that comes out as is then
       clamped into the viewport with a margin, so on the narrowest screen it
       slides along the bottom edge rather than hanging off it. */
    function placePicker() {
      var a = (openFrom || row).getBoundingClientRect();
      var w = pick.offsetWidth, h = pick.offsetHeight;
      var M = 10;
      var left = a.right - w;
      var top = a.top - h - 10;
      /* No room above — under it instead, which on a short screen is where
         the message is not. */
      if (top < M) top = Math.min(a.bottom + 10, window.innerHeight - h - M);
      left = Math.max(M, Math.min(left, window.innerWidth - w - M));
      top = Math.max(M, top);
      pick.style.left = Math.round(left) + 'px';
      pick.style.top = Math.round(top) + 'px';
      /* It grows out of the control that opened it. */
      pick.style.transformOrigin =
        (Math.round(a.right - left)) + 'px ' + (h + 8) + 'px';
    }

    var isOpen = false;
    function open(from) {
      if (isOpen || !phoneRx()) return;
      buildPicker();
      openFrom = from || null;
      isOpen = true;
      syncPicker();
      pick.style.visibility = 'hidden';
      pick.style.display = 'flex';
      veil.style.display = 'block';
      placePicker();
      pick.style.visibility = '';
      if (addBtn) addBtn.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () {
        veil.classList.add('is-in');
        pick.classList.add('is-in');
      });
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('scroll', close, { passive: true });
      window.addEventListener('resize', close);
      var first = pick.querySelector('.rxpick__btn');
      if (first) first.focus({ preventScroll: true });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      veil.classList.remove('is-in');
      pick.classList.remove('is-in');
      if (addBtn) {
        addBtn.setAttribute('aria-expanded', 'false');
        addBtn.focus({ preventScroll: true });
      }
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
      /* Left in the tree with its transition run out rather than removed on a
         timer that a second open would race. */
      setTimeout(function () {
        if (isOpen || !pick) return;
        pick.style.display = 'none';
        veil.style.display = 'none';
      }, still ? 0 : 200);
    }

    function onKey(ev) {
      if (ev.key === 'Escape' || ev.key === 'Esc') { ev.stopPropagation(); close(); }
    }

    /* ---- the fourth control --------------------------------------------- */

    var addBtn = null;
    function buildAdd() {
      if (addBtn) return;
      addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'rx rx--add is-in';
      addBtn.setAttribute('data-rx-add', '');
      addBtn.setAttribute('aria-label', 'Add a reaction');
      addBtn.setAttribute('aria-expanded', 'false');
      addBtn.innerHTML = '<span class="rx__plus" aria-hidden="true">+</span>';
      addBtn.addEventListener('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (isOpen) close(); else open(addBtn);
      });
      row.appendChild(addBtn);
      /* Says the row is a control now: lifts the four-chip cap and turns the
         wrap the right way up. Both are in the stylesheet, scoped to this
         class, so nothing about the static row changes. */
      row.classList.add('rx-live');
      changed();
    }

    /* ABOVE 720 THE ROW IS A PICTURE AGAIN.

       A window dragged out of the phone range has to leave the reactions
       exactly as a desktop visit would have drawn them: three chips, the
       counts the sequence landed on, and the pointer behaviour above owning
       the click. So the fourth control goes, anything the picker built goes
       with it, and the chips that were always there are handed back their
       `is-on` — which is the desktop treatment, not the phone's. Choices are
       kept in `mine`, so dragging back under 720 restores them. */
    function dropAdd() {
      close();
      row.classList.remove('rx-live');
      if (addBtn && addBtn.parentNode) addBtn.parentNode.removeChild(addBtn);
      addBtn = null;
      var cs = row.querySelectorAll('.rx'), i, c, k;
      for (i = cs.length - 1; i >= 0; i--) {
        c = cs[i];
        k = c.getAttribute('data-rx');
        if ((bases[k] || 0) === 0 && (k in picked)) {
          if (c.parentNode) c.parentNode.removeChild(c);
          continue;
        }
        if (k in bases) {
          var n = c.querySelector('.rx__n');
          if (n) n.textContent = String(bases[k]);
          c.classList.add('is-on');
          c.setAttribute('aria-pressed', 'true');
          c.removeAttribute('aria-label');
        }
      }
    }

    /* ---- wiring ---------------------------------------------------------- */

    /* Delegated, so the chips the picker builds are live without being wired
       one at a time — and so a chip the thread's own animation replaces does
       not take its handler with it. Bound once, and does nothing at all above
       720 where the pointer behaviour above owns the click. */
    row.addEventListener('click', function (ev) {
      if (!phoneRx()) return;
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest('[data-rx-add]')) return;      /* its own handler */
      var chip = t.closest('.rx');
      if (!chip || !row.contains(chip)) return;
      ev.preventDefault();
      ev.stopPropagation();
      toggle(chip);
    });

    /* The row is built and its counts are set by the thread's own sequence.
       The fourth control is added once that has happened, so it never appears
       before the reactions it belongs beside — and it is taken away again if
       the window is dragged past the breakpoint. */
    /* WHOSE REACTIONS THESE ARE.

       The sequence lands the row with every chip marked `is-on` — on a
       pointer that is right, because there it is a picture of a message
       somebody has already reacted to. On a phone the chips are controls, and
       a control that starts pressed means the first tap TAKES A REACTION OFF:
       measured, 🔥 4 went to 🔥 4-unselected on the first tap and only
       reached 5 on the second. So on a phone the row is normalised — the
       counts the sequence finished on are kept and the selection is cleared,
       because none of it is yours yet.

       `mine` is what is. It survives the normalise, which matters because the
       conversation loops: every replay re-lands the row and resets the chips,
       and anything you had chosen has to come back with it rather than being
       quietly dropped on the next cycle. */
    function normalise() {
      var cs = row.querySelectorAll('.rx'), i, c, k;
      for (i = 0; i < cs.length; i++) {
        c = cs[i];
        if (c.hasAttribute('data-rx-add')) { c.classList.add('is-in'); continue; }
        k = c.getAttribute('data-rx');
        /* Recorded once and kept: the replay clears the counts before it sets
           them again, and reading a base out of that window would record a
           floor of nothing. */
        if (!(k in bases)) {
          var seen = countOf(c);
          if (!seen && !c.hasAttribute('data-rx-base')) continue;
          bases[k] = c.hasAttribute('data-rx-base')
            ? (parseInt(c.getAttribute('data-rx-base'), 10) || 0) : seen;
        }
        c.setAttribute('data-rx-base', String(bases[k]));
        c.classList.add('is-in');
        paint(c, bases[k] + (mine[k] ? 1 : 0), !!mine[k]);
      }
      /* And anything you added that a replay removed from the row. */
      for (k in mine) {
        if (!mine[k] || chipFor(k) || !(k in picked)) continue;
        build(k, picked[k].e, picked[k].label, true);
      }
    }

    function sync() {
      if (phoneRx()) {
        if (thread.getAttribute('data-reactions') === 'on') {
          buildAdd();
          normalise();
          syncPicker();
        }
      } else {
        dropAdd();
      }
    }

    if (narrow) {
      if (narrow.addEventListener) narrow.addEventListener('change', sync);
      else if (narrow.addListener) narrow.addListener(sync);
    }

    /* `data-reactions` is set on the thread the moment the row lands, by both
       the played and the reduced-motion paths, so one observer covers both
       without either having to know this exists. */
    if (window.MutationObserver) {
      new MutationObserver(sync).observe(thread,
        { attributes: true, attributeFilter: ['data-reactions'] });
    }
    sync();
  })();


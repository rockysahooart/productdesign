# Design system

Verified against `index.html` and `assets/app-1.js` at commit `6dfd694`.

## Theme: light is forced

A fresh visit always initialises light, whatever the OS or browser reports.
Dark happens only when the visitor presses the site's theme control; the choice
is stored in `localStorage['pf-theme']`.

- `<html>` is written with `data-theme="light"` in the markup, and the blocking head
  script rewrites it unconditionally (stored value, else `light`). The markup
  default is what keeps a page light when scripts are off or blocked.
- Dark rules are written as
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) … }`,
  plus a few unwrapped `:root:not([data-theme="light"])` rules (`#cfRoot`,
  `#tfRoot`, `.case`). With the attribute always set, none can match, with or
  without JS. Keep the pattern; don't strip the blocks.
- `js/theme.js`: `current()` returns `'dark'` only for an explicit `dark`. There
  is deliberately **no** `matchMedia` color-scheme listener.
- One unscoped `<meta name="theme-color" content="#E9E9E9">`; `paintChrome()` updates it on toggle.
- The six `srcdoc` artifact embeds read the host's `data-theme`, falling back to `light`.
- No dark flash at first paint. Anything that moves theme resolution to
  `DOMContentLoaded`, `app-1.js` or a `<link>` is a regression.

## Type

```
--font-body     "Be Vietnam Pro"      400 and 500
--font-heading  "Cormorant Garamond"  300–700, normal and italic
--font-pixel    = Cormorant Garamond
--font-display  = var(--font-heading)
--font-sans     = var(--font-body)
--font-mono     = var(--font-body)
```

All fonts are self-hosted as inline `@font-face` (woff2). No CDN, no
`@import`, no Google Fonts link. The page must render offline without a fallback
paint. Other self-hosted faces (Fraunces, a Playfair Display subset, Sora, Inter)
exist in the file for case-study material and artifact embeds; `Geist Pixel`
appears only inside artifact embeds. None of these is the site's running copy.

The hero conversation is a display object set in the serif, not body copy.

## Tokens and surfaces

Tokens live in `css/01-tokens.css` near the top of `index.html`. Dark variants
are always paired there, never improvised at the call site.

- Spacing scale: `--s-1` 8px, `--s-2` 13, `--s-3` 21, `--s-4` 34, `--s-5` 55,
  `--s-6` 89, `--s-7` 144. Use tokens, not ad-hoc pixels. `--page-max: 1500px`.
- **Clay surfaces**: soft, borderless, shadow-modelled cards
  (`--clayc-radius: 22px`, `--clayc-shadow`, `--clayc-ao`). Hairline borders were
  removed on purpose (`border-width: 0` on bubbles, hero sub-cards, avatars,
  index cards). Sub-cards share the shell's radius.
- Hover on a card that opens something = **more light** (deeper `box-shadow`), never a tint.

## Responsive bands

| band | behaviour |
|---|---|
| ≥ 2400px | `.hero-card`, `.row--hero`, `.cell` become `display: contents`; the hero grid resolves on an ancestor (~360 / flexible / 1284 at 2560). `.hero__tools` under identity, `.hero__past` under the conversation, tall `.hero__work`. Intended. |
| ≥ 1440px + hover + fine pointer | Two-state project cards. |
| ≥ 960px | Three-column bento `identity / copy / work` over `past past / tools` (in the `work` state; see the landing states below). `.hero__clients` is `display: none`: the same employers appear in the *Where I've been* timeline, and the page shows one form of that claim, never both. |
| 720–959px | Single-column hero. `.hero__past` hidden; `.hero__clients` shown as a labelled logo rail. Messages retire upward through the top of the thread. |
| ≤ 719px | Single column, flat identity block, portrait and name share a row. Player uses `FLAT_PAD`. `.hero__mobile-cta` is the invitation. |

Hard rules:

- Never widen the project-browser visual column. OptiFlow's and Carry's embeds are
  aspect-locked and overflow their frames on purpose; widening once broke OptiFlow
  (494 → 629px) and Cryptography with it.
- Never clip or scale `.slot`; scale `.slot > img`. `.slot` already has `overflow: hidden`.
- No horizontal page scroll at any width or animation stage.

## Hero conversation (`js/thread.js`)

```
h1#hero-name.hero__thread
  └ .msg-track
      └ .msg                      grid item; transform always none
          ├ .msg__from            avatar
          ├ .msg__art / .msg__hands   illustration (child of .msg, never of the bubble)
          └ .msg__bubble          scaled + filtered → a stacking context
              ├ .msg__dots
              ├ .msg__vine        (message 2 only; must live inside the bubble)
              └ .msg__text        z-index 3
```

States on `.msg[data-state]`: none → `idle` → `loading` → `live` → `settled`, plus `gone`.

- Bubble live animation: `msg-clay 420ms linear both` (450ms for
  `.msg__bubble--reacted`), set by the later, more specific `.hero__thread …`
  rule. A generic `.msg[data-state="live"] > .msg__bubble { animation: msg-pop 640ms }`
  still exists underneath; it is not what the hero plays. Keyframes animate opacity
  (0.32 → 1 by 64%), transform (`translateY(19px) scale(0.955)` → rest) and box-shadow.
- Illustrations use `msg-reveal` (the same opacity track) keyed off the same
  `data-state`: one reveal per message, no separate timers or observers. Settled
  vine runs `vine-sway 4.2s ease-in-out infinite`.
- Player constants: `VISIBLE = 3`, `SIZING_GAP = 22`, `ZONE = 0.63`,
  `ANCHOR = 0.845`, `CTA_FLOOR = 0.98`, `FLAT_PAD = 60`, `FLAT_TAIL = 6`,
  `STILL_PAD = 46`, `STILL_TAIL = 14`.

**The pace.** `.hero__thread { --msg-pace: 0.7 }` is the one speed control for the
message sequence. Every sequence duration in CSS is `calc(<designed ms> * var(--msg-pace, 1))`,
and `js/thread.js` reads the same property into `PACE` and passes its timeline constants
(`DOTS_MS`, `POP_MS`, `GAP_MS`, `READ_MS`, `GAP_MAX`, `REACT_MS`, `TIGHT`, `PROJECTS_MS`,
`SCRAMBLE_MS`, `WORD_HOLD`, `WORD_SCRAMBLE`, `SHUFFLE_STEP`, `WORD_BEAT`, the reaction
plan, dwell) through `paced()`. Not paced: the loader, the 16.4s hold before the loop
restarts, its fade/blank, the list of work, the window slide (unused with three messages).
At 0.7, first message to invitation is ~8.37s at 1512 (was 11.96s).

**The measure rule.** The player measures the thread's column once. Anything
that changes the column's inline size between stages leaves the conversation
sized wrong with no resize to recover. The landing states centre it structurally
without breaking this: the outer grid tracks change, the middle track's width does
not (see below). Anything that would change the middle track's width is still out.

### Illustrations

- Message 2 workspace: `.msg--art`, `assets/1071501dfe1e.webp` (960×448), right
  side. `--art-k: 0.475`, `--art-in: 0.05`, `--art-foot: 0.980132` (the ground
  plane, not the alpha bottom). Below 720px it reserves `padding-top` and hangs
  in with negative `margin-top`; at ≥720 it uses `bottom: 100%` + `translateY`.
- Vine: `.msg__vine`, `assets/1e37a317b31d.webp`, inside `.msg__bubble` so it can't cover the text.
- Message 3 hands: `.msg--hands`, `assets/2c5ec0e625c0.webp` (1085×373), left
  side. `--hands-k: 0.475`, `--hands-in: 0.05`, `--hands-tuck: 0.26`,
  `--hands-rise: 0.16`. Rise uses `margin-top`, not `top` (a percentage `top`
  resolves against height).

When measuring animations, read `document.getAnimations()` once per frame.

## Landing states (`js/reveal.js`, `css/16-reveal.css`)

INTRO → CONVERSATION → PORTFOLIO, on `:root[data-landing]`, at every width. Armed
by `data-stage="0"` and `data-landing="intro"` from the head script for every
visitor (reduced motion included: it removes the movement, not the state). The page
is complete without them: crawlers, JS-off and a failed bundle see the final
composition.

| state | trigger | on the page |
|---|---|---|
| `intro` | head script, before first paint | the message animation alone; Replay and the theme switch (below 960: theme + menu, fixed) |
| `ready` (conversation) | `pf:cta` (the thread's `showCta()`), or the thread having already ended when `reveal.js` runs | the same box, now the conversation (js/ask.js): its answers, pictures, flows, logos and previews all inside it, the quick links beside it. Nothing else is laid out, however many turns |
| `work` (portfolio) | Browse more (the thread's own See the work button, relabelled), Projects or About in the navigation, any deep link or `hashchange`, `PF.revealAll()` | everything, in the layout it always had: one 320ms transition at 960 and up, at once below |

- **Only an explicit choice opens the page.** Not the introduction ending, the first
  question, a project preview in an answer, a number of turns, scrolling or tabbing.
  The phone cascade and its scroll and focus escape hatches are gone. One safety net:
  `CEILING_MS = 26000` opens the page if the thread never reaches `pf:cta`; it is
  cleared at `ready`.
- **The gate.** In `ready`, `reveal.js` takes the press on `.msg-cta__btn` in the
  capture phase, so the first press opens the page and keeps the conversation.
- **Projects** (js/sitenav.js) calls `PF.revealAll()`, waits two frames for the
  layout, sets `#work` with `pushState` and scrolls the project collection into view.
  **About** is a route change. **Illustration** and **Music** open in a new tab and
  change nothing here. **Start here** in the conversation returns to its openers.
- **Below 960, out of the layout.** In `intro`/`ready` every unshown `[data-reveal]`
  block, the roles bar, the profile column, the skills disclosure and its slot are
  `display: none`: no reserved blank space, nothing in the tab order or the
  accessibility tree. `work` brings them all back at once.
- **Centring is structural (≥ 960).** In `intro`/`ready` the grid's outer tracks are
  each the mean of the final two (desktop `--hero-l`/`--hero-r`; ultrawide `360px` and
  `--pv-col`), so the middle track is centred and exactly as wide as in the final
  layout. The press transitions `grid-template-columns` and the page's `padding-top`;
  the outer tracks' sum is constant, so the conversation's width never changes.
- **One movement.** `--land-ms: 320ms` drives the tracks, the padding and every
  arriving block. No stagger.
- **Vertical (≥ 960).** Desktop (960–2099): the page's top padding is
  `max(--page-pad, (100svh − row) × --land-lift)`, `--land-lift: 0.33`. Ultrawide:
  half the free height.
- **Trusted By** (`.hero-trust`) is not shown anywhere at present; markup and styles
  are kept.

Reaction chips are `visibility: hidden` while the thread plays and they have not
arrived (`.is-playing .rx:not(.is-in)`), so Tab never reaches an invisible chip.

## The conversation after the introduction (`js/ask.js`, `css/35-ask.css`)

The introduction is act one; the conversation is act two, in the same box on the
same spot of the screen. Authored and deterministic: no model, no network, no free
text. The Figma source is *Portfolio Assistant — Wireflows & Interaction*, section
09 (the minimal entry: conversation-only state, quick links beside the
conversation, current work), with section 08 for act two's answer kinds and 07 for
the first version.

**The change of act.** Loader → introduction (Hello Team., the name, *I've designed
human-centered products in an AI-saturated world.*, its reactions, a hold) → clear →
empty box → act two. On `pf:cta`, `enter()` freezes the thread (below), then:

| step | what | timing |
|---|---|---|
| hold (below 960 only) | `pf:cta` arrives with the last line on a phone, so the line is held to be read (its decode, then a reading) | 4400ms × pace |
| clear | `.is-act-out`: the whole `.msg-track` to opacity 0, one movement | 480ms `cubic-bezier(.4,0,1,1)` |
| empty | `.is-act2`: the introduction's rows `display:none`; the box is empty; nothing else changes | 720ms |
| act two | the thread's own rows: the philosophy line, "Where would you like to start?", three questions, Browse more. No labels or helper copy | dots 560 × pace, landing 640 × pace, 280ms × pace between the two lines, prompts 60ms apart |

Opacity only: the box never moves or changes size (the measure rule). Act two's
first turn is centred in the room act one used, measured once on an invisible copy
of the finished turn, so nothing that appears moves to make room for what follows.
Below 960 the thread's height is held at act one's (`min-height`) so the page under
it does not jump while the room is empty. Reduced motion has no act to end: the
introduction stays and the conversation follows it, settled. Replay, a role change
and a crossing of 720 bring act one back.

**Hand-over.** `js/thread.js` exposes `PF.thread` (`el`, `track`, `still`,
`enter()`, `row(text, first)`, `cta()`, `ended()`, `onReset(fn)`) and fires
`pf:thread`. `enter()` stops the sequence (phase `ask`: no loop, no `place()`, no
list view), turns the track's `translateY` into `padding-top` and adds `.is-asking`.

**Questions.** About three at a time, chosen by the previous answer. Every label is
the visitor asking about the designer and reads after "I want to know…" (no
"Show me…"). Act two opens on *What are you currently working on?*, *Which project
best represents your work?*, *How do you approach complicated problems?*; Start
here (quick links, menu) returns to the openers and offers what has not been asked
(*Where have you worked?*, *What do you make outside of product design?*, *How do
you use AI in your process?*…). No "Ask next" label and no Ask something else: three
questions under an answer explain themselves.

**Current work** is the cryptography explainer: *What are you currently working
on?* answers "Something in progress: making cryptography easier to understand
inside a developer library", with the explainer's own running preview, the caption
tag *In progress* in `--link-go`, and the line "How ECDH, a shared secret, key
derivation and AES-GCM relate, shown before developers use the encryption APIs in
code." Its follow-ups: *What are you trying to make easier to understand?* (a flow:
ECDH, shared secret, key derivation, AES-GCM), *How does the interaction explain
encryption?* (the preview's own description: Maya, Leo and Evan), *Why make this
interactive?*.

**Voices and evidence.**

| role | shape | type |
|---|---|---|
| guide | the thread's own `.msg` row (dots, `msg-clay`, clay bubble) | the thread's face at `0.86em` (1em below 720) |
| question | `.ask-q`: soft card, 48px (follow-ups 40px), radius 16 (14), 1px `rgba(38,34,28,.07)`, `linear-gradient(135deg, #FFFEFB 0, #FFFEFB 18%, tint 100%)`, tints #FBF1E6 / #EEF3EA / #F1EFF7 | Be Vietnam 500 `--fs-body` |
| visitor | `.ask-you`: right-aligned flat note in the tint taken, radius 18/18/6/18 | Be Vietnam 500 |
| project | `.ask-ev.card`: a film still. The slide's own preview, full column width, `clamp(220px, room − 360px, 460px)` tall (square, max 340, under 520), scale 1.015 → 1 over 900ms; then its caption (eyebrow, title, line, CTA) after 700ms × pace | caption Be Vietnam |
| flow | `.ask-flow`: four `.ask-node` boxes (`--ask-q-from`, 1px line, radius 18, `--ask-q-rest`), 44px apart, alternating left/right at 58% width (a left rail with 10px steps under 520), joined by SVG paths | the thread's face, `max(17px, .7em)` |
| logos | `.ask-logos`: one tile per *Where I've been* stop (mark at 26px, name, years, role), from left / below / right / above, 240ms × pace apart, settling into one row (two by two under 520) | Be Vietnam |
| art / music / outside | `.ask-media`: the Off the clock picture, `clamp(220px, room − 300px, 480px)` tall, uncovered from the bottom (`clip-path`, 820ms); music adds a 28-bar waveform (breathing only on the newest turn) and the Music menu's three links | Be Vietnam |

**Flow links** are measured, never written down: each path runs from the bottom
centre of one box to the top centre of the next (the first leaves the reply bubble
above the first thought; the last enters the evidence), a cubic with control points
at 55% of the drop. `pathLength="1"`, dash 1, offset 1 → 0 over 460ms
`cubic-bezier(.45,0,.2,1)`, stroke `--link-go` at 55%, 1.25px. The SVG sits under the
boxes, so a link never covers a word. Sequence: the reply settles, link 1 draws,
thought 1 arrives at its final size (360ms), 140ms × pace, link 2… then the last
link and the evidence. A `ResizeObserver` on the conversation redraws every link on
any reflow. Reduced motion: everything is already drawn.

**Older turns step back** (opacity .5; full again on hover or focus within), an
earlier project folds to one line and gives its live preview back, and at most
four turns are kept.

**The box.** At 960 and up the thread box keeps its measured height and scrolls
(`.is-scroll`), with the dissolve at the top only when scrolled and at the foot when
there is more below. `--ask-room` is the box's height (the screen's below 960). A
thought or the evidence arriving below the box's fold is brought up just far enough
to be seen whole; once a turn is complete and has been read (900ms × pace), the view
shows its way onward, letting a still go at most halfway under the top dissolve.

**Browse more** is the thread's own See the work button, relabelled, at every
width, so `js/reveal.js`'s capture-phase gate takes its press (ready → work). Hidden
once `data-landing="work"`. The project browser follows the conversation
(`pf:project`), so the portfolio opens on the last project shown.

**Accessibility.** The heading is named by its introduction text
(`aria-labelledby`). Each answer, a flow's thoughts included, is announced through a
polite live region and focus moves to the reply. Questions are buttons in a labelled
group (named "Start here" / "Ask next" for assistive technology only); thoughts
and employers are lists; pictures carry the
alt text their Off the clock tiles already had; every external link opens in a new
tab with `noopener`.

## Quick links and the menu (`js/sitenav.js`, `css/36-nav.css`)

One navigation model, two sizes: Start here, Projects, Illustration ↗, Music ↗,
About.

**960 and up.** `.snav` is a row of plain links inside `.hero__copy`, the
conversation's own box: top-left at `clamp(--s-2, 2vw, --s-3)`, on the line Replay
and the theme switch sit on, centred on their 38px height, 22px apart. Be Vietnam
13px 500, `--ink-muted`; hover and focus take `--ink` and a 1px underline at 5px
offset. No container, pill, border or icon (the ↗ is the site's `data-external`
mark). Hidden in `intro`, fades in (420ms) with the conversation, `display: none`
once the portfolio is open.

**Below 960.** `.gutil`: the theme switch and a menu control, 40px circles (44px hit
area) 6px apart, fixed top right (safe-area aware), aligned with Replay at the top
of the card; the card's own switch steps aside and Replay moves one place left. The
menu (`#site-menu`) is a disclosure with the same five entries in 52px rows, a 288px
panel 54px under the pair, on a 16% scrim. Focus goes to its first entry; Escape and
the scrim close it and give focus back; a choice or focus leaving it closes it;
crossing 960 closes it. Opening it reveals nothing.

Neither shows on a case study.

## Project browser and cards

`.hero__work` (`data-pv`) is a one-at-a-time carousel in `data-rank` order (see the architecture doc).

Two-state cards, gated `@media (min-width: 1440px) and (hover: hover) and (pointer: fine)`,
on six `card--brief` cards (governance, carry, optiflow, crypto, dsa, specimen):

- Resting: a structurally different card (short title and one line as a real flow block at top, larger visual below), not the full layout with text hidden.
- Hover / keyboard focus: full copy returns, 240ms ease-out, no bounce. Respects reduced motion.
- Carry (`.card--stacked`) keeps the overlay treatment.
- Card width and height are identical in both states at 1440 / 1512 / 1600 / 1920.

Approved brief copy:

```
Carry        Improving patient recall                  / A visit companion for questions and follow-ups.
OptiFlow     AI-assisted billing review                / Human validation for higher-confidence model output.
Cryptography Making cryptography easier to understand  / An interactive explainer for encrypted data.
DS Audit     Standardizing provider workflows          / Shared workflow logic across clinical systems.
Specimen     Redesigning specimen kits                 / Safer storage and shipping for oncology samples.
Governance   Governance for agent-generated interfaces / Rules and audits for AI design decisions.
```

## Accessibility

- Staged blocks are `visibility: hidden` + `pointer-events: none` until shown (out of tab order and AX tree).
- Reduced motion opts out of staging entirely: the page arrives whole and the thread shows its finished state.
- Card expansion works on keyboard focus.
- Skip link, labelled sections, `aria-pressed` on the theme toggle and reaction chips, visually-hidden labels on logos.
- Decorative illustrations: `aria-hidden="true"`, empty `alt`.

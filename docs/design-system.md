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
| ≥ 960px | Three-column bento `identity / copy / work` over `past past / tools`. `.hero__clients` is `display: none`: the same employers appear in the *Where I've been* timeline, and the page shows one form of that claim, never both. |
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

**The measure rule.** The player measures the thread's column once. Anything
that changes the column's inline size between stages leaves the conversation
sized wrong with no resize to recover. Move it with a `transform`.

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

## Landing sequence (`js/reveal.js`, `css/16-reveal.css`)

Armed by `data-stage="0"` from the head script (never under reduced motion).
The page is complete without it: crawlers, JS-off and a failed bundle see everything.

Single cue: the invitation appearing (`showCta()` emits `pf:cta`). Don't
replace it with a timer. Then `LEAD = 180`ms, five groups `STEP = 140`ms apart:

| `data-reveal` | elements |
|---|---|
| 1 | `.hero-id--who` (portrait) |
| 2 | `.hero-id--talk` (LET'S TALK) |
| 3 | `.hero__clients` (Worked With) |
| 4 | `.hero__work` (Project Browser) |
| 5 | `.hero-id--caps`, `.hero__past`, `.hero__tools`, `#background`, `#work`, `#more`, `#contact` |

Opacity only, ~700ms, `cubic-bezier(0.34, 0.03, 0.24, 1)`. Hidden state is
`opacity: 0; visibility: hidden` plus `pointer-events: none`, **never
`display: none`** (the profile column shares a grid row with the thread). A group
with no visible elements at the current width doesn't spend its beat.

Stage-1 centring: `--solo-x` (across) and `--solo-y` (down), measured by `reveal.js`
and applied as one `translate()` on `.hero__copy`, only at ≥960px and
`data-stage="0"`; unwinds on group 1. `--solo-x` is half the difference between
the outer tracks. `--solo-y` puts the middle of what the conversation shows (roles,
controls, the thread's reserved box) on the middle of the first screen, never
upward. Re-measured by a `ResizeObserver` when the thread reserves its height
(about 3.9s in, under the opaque loader), each reading taken with the transition
off so a correction never animates. The transition is gated behind `has-solo`.
No transform under reduced motion. Never a layout change: see the measure rule.

Escape hatches (all go straight to everything-visible, once, one-way): scrolling
past half a viewport, a third focus step, any deep link or `hashchange`, and
`CEILING_MS = 26000`.

## Project browser and cards

`.hero__work` (`data-pv`) is a one-at-a-time carousel driven by `PF.PROJECTS`.

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

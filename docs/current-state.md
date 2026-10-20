# Current state

As of 2026-10-20 on `main`.

## What ships today

- Hero: a self-playing chat thread. Message 1 `Hello Team.` (plain text);
  message 2 "I'm Sarthak Sahoo, a Product Designer based in Austin, TX" with the
  workspace illustration; message 3 "I've designed *human-centered* products in an
  AI-saturated world." with the hands illustration, reaction chips, then the
  "See the work →" invitation.
- Landing on desktop and ultrawide (≥960): three states. **Intro**: after the loader
  the conversation plays alone, centred by the grid. **Ready** (on `pf:cta`): the
  same conversation with its See the work; nothing else. **Work** (first press on See
  the work): the conversation settles into its column and the whole page arrives in
  one 320ms transition into the existing layout (matching the owner's reference).
  See [design-system.md](design-system.md#landing-sequence-jsrevealjs-css16-revealcss).
- Below 960: unchanged. The invitation runs the whole page in on its own,
  180ms lead then 140ms apart.
- Trusted By (four logo bubbles: CVS Health, Natera, PNC, CG Infinity) is built but
  not shown since the decision state was retired. Worked With (`.hero__clients`, below 960): CVS Health, CG Infinity, PNC, First United.
- Natera appears in the *Where I've been* timeline and, at the owner's request
  (2026-10-20), in the Trusted By bubbles.
- Project order and URLs: see [portfolio-architecture.md](portfolio-architecture.md#pfprojects-display-order-everywhere).
- `/slop/` is published and consistent with the rules (og:type `article`,
  canonical `…/slop/`, PDF at `/slop-audit.pdf`, zero relative `assets/` references).

## Open items

1. `social-preview-v2.png` (the og:image) still shows the old "Hello Team :)" greeting.
2. `PF.PROJECTS` lists Scale as `soon` with no route; its slide links to `/scale-market`.
3. No favicon; `/favicon.ico` 404s. Pre-existing.

## Recently shipped

- **2026-10-20: LiveFront challenge as project 01.** "Redesigning Craigslist's iPhone app
  for clearer used-car search", from the Figma file; a drawn, looping HTML/CSS phone
  (`css/34-livefront.css`), CTA "view project" to the public deck. The lower Key Industry
  Projects section is hidden at ≥960. README.md is the repository's portfolio page.

- **2026-10-20: See the work is the only gate.** The decision state (identity, and on
  laptops the browser, assembling at the invitation) is replaced by `ready`: the
  invitation and nothing else. The press opens everything in one 320ms transition.

- **2026-10-20: project order.** Carry, Cryptography, OptiFlow, Specimen Kit, Design
  System Audit lead; Design Governance, PNC, Missing Information, Scale follow. The
  carousel now sorts by `data-rank`, which fixes it disagreeing with the ultrawide grid
  (DSA and Cryptography had been swapped between the two).
- **2026-10-20: optical lift and ultrawide shift.** Desktop intro/decision sit a third
  of the free height from the top. Ultrawide centres the conversation for the intro
  only and moves it to its established place as the decision begins.

- **2026-10-20: browser in the desktop decision state; sequence 30% faster.** At
  960–2099 the Project Browser arrives with the decision state (finalpart.jpg) and
  See the work opens the rest. The message sequence is paced by one `--msg-pace: 0.7`
  read by both CSS and `thread.js`.

- **2026-10-20: three landing states.** Implemented from `finalpart.jpg` (decision)
  and `finalstate.jpg` (work). Structural centring replaced the `--solo-x`/`--solo-y`
  transforms; See the work became a real gate; the Trusted By 2×2 bubbles were added;
  the unused `px-smiley` sprite went too.

- **2026-10-20: landing page.** Message 1 is `Hello Team.`; the smiley, its sprite
  symbol, sizing, bob animation and greeting data (`'Hello Team :)'` in
  `js/thread.js`) are gone. While the conversation is alone on desktop and
  ultrawide it is centred down as well as across (later replaced by the structural
  landing states above). `<html>` defaults
  to `data-theme="light"` in the markup, so a dark-OS visit with scripts off is
  light too. `tools/buildslop.py` and `tools/check.py` added.

- **`b38798c` (2026-10-19): OptiFlow walkthrough labels use colons.** The label
  strings in `assets/app-2.js` changed from `—` to `:` so they match the static
  markup. Approved by the owner after the [app-2.js audit](#assetsapp-2js-audit-2026-10-19) below.

## `assets/app-2.js` audit (2026-10-19)

The repo copy (40,826 bytes) was compared with the copy in the retired
`candidate-build` folder (40,709 bytes, last modified 2026-09-17 02:07, about
three hours after the repo version was committed in `e460fa8`). Both are 1,000 lines.

- **With comments stripped, the only differences are the label strings in four
  assignments in `ofw.js`** (the OptiFlow walkthrough), where `—` becomes `:`:
  `197 — Authorization Missing` / `PR — Patient Responsibility` in the feedback
  panel (`[data-fbtag]`), the snackbar (`[data-snacktext]`, `Removed: …` /
  `Added: …`), and the two `.ofw-t` tag chips the add sequence writes. No logic,
  timing, selector or control-flow change.
- Every other difference is comment punctuation in `ofw.js`, `peek.js` and
  `bim.js`. That pass also introduced a few comment blemishes (two trailing
  spaces, a lost indent before `(4, 2, 1)`, `bim.js.` for `bim.js —`). Harmless.
- **Visible consequence (before the fix):** `index.html` already used the colon
  style in the walkthrough's static markup (`PR: Patient Responsibility`,
  `197: Authorization Mis…`, `M62: Missing Auth Co…`), but `app-2.js` overwrote
  those labels with the em-dash form once the walkthrough ran, so the same tag
  switched punctuation mid-sequence.
- **Resolution: shipped in `b38798c`.** Only the label strings changed (5 lines,
  across the 4 assignments); the comment-punctuation edits were not adopted.
  Verified in the browser: across the Add and Remove sequences every tag,
  feedback and snackbar label used colons, with no em dashes and no console errors.
  The repo's `app-2.js` now matches the candidate's code exactly; only comments differ.

## Reversed decisions — do not reinstate

These were built and then explicitly rolled back. If you find traces, flag them;
if any doc describes them as current, that doc is wrong.

1. The broad copy-simplification pass across the Project Browser and bento cards. The brief copy in the design-system doc is what survives.
2. The earlier desktop/ultrawide progressive-reveal staging (`html:not(.pf-work)` plus a single-column `.hero-card`). The current sequence is a later, different design. (Its First United Bank URL was kept.)
3. Centring or width-capping the stage-1 hero by changing the conversation column's
   width. Superseded in part: the intro is now centred by changing the *outer* tracks,
   which keeps the middle track's width exactly; anything that changes that width is
   still out.
4. Revealing on messages 1 and 2. Replaced by the single `pf:cta` cue.
5. The `matchMedia` system-theme listener and media-scoped `theme-color` metas.
6. `transition: opacity 0s linear 86400s` as a one-way illustration hold. Replaced by state-gated `msg-reveal`.
7. Scaling `.slot` to contain an overflowing embed. Scale `.slot > img`.
8. Revealing anything on `pf:cta` at ≥960 (the "decision" state: identity, Trusted By,
   and on laptops the browser, assembling at the invitation). The invitation shows
   See the work and nothing else; only the press opens the page.

## Handoff discrepancies (code wins)

Found when checking the original handoff document against the repo on 2026-10-19:

- `index.html` (2,574,392 bytes), `slop/index.html` (2,574,295), `assets/app-1.js`
  (565,496) and 46 of the 47 asset files are byte-identical to the old candidate
  build. `assets/app-2.js` differed; see the audit above. The repo is production.
- `index-1.html` is **not** in the repo (deleted in `bbb9309` / `c969442`).
- `social-preview.png` is **not** in the repo (deleted in `a49ce61`). Only
  `social-preview-v2.png` remains, and both pages' `og:image` point at it.
- `robots.txt` and `sitemap.xml` are **not** in the repo (so not deployed); copies exist only in the old candidate build.
- `README.md` and a commented `.gitignore` exist; the handoff didn't mention them.
- Besides Be Vietnam Pro and Cormorant Garamond, the file self-hosts Fraunces,
  a Playfair Display subset, Sora and Inter (case-study/embeds).
- The spacing scale runs to `--s-7` (144px), not `--s-6`.
- Theme resolution and stage arming are one head script, not two; the loader sits at the top of `<body>`, not in `<head>`.
- `msg-clay` keyframes animate transform and box-shadow as well as opacity.
- The handoff described deployment as manual uploads through the GitHub web UI
  with an upload manifest. **Superseded:** the owner now pushes from this
  checkout, and a push to `origin/main` deploys.

## Local copies that are not part of the workflow

- **Canonical:** `~/Documents/productdesign-claude`, a clean clone tracking `origin/main`.
- `~/Downloads/GitHub/productdesign` is a **stale clone** (1 ahead / 127 behind
  as of 2026-10-19, modified `index.html`, untracked `social-preview-v2.png`).
  It is not used, not reconciled and not a source of truth. Don't commit from it.
- `~/Documents/Claude outputs/candidate-build/` is the **retired build folder**
  from the manual-upload era. It's only a reference for the `app-2.js` audit above.

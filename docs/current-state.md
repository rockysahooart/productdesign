# Current state

As of 2026-10-19, commit `6dfd694` on `main`.

## What ships today

- Hero: a self-playing chat thread. Message 1 `Hello Team` + pixel smiley SVG;
  message 2 "I'm Sarthak Sahoo, a Product Designer based in Austin, TX" with the
  workspace illustration; message 3 "I've designed *human-centered* products in an
  AI-saturated world." with the hands illustration, reaction chips, then the
  "See the work →" invitation.
- Landing sequence: loader (3500ms first visit) → thread plays alone, centred →
  invitation emits `pf:cta` → profile, LET'S TALK, Worked With, Project Browser,
  rest of page, 180ms lead then 140ms apart. The sequence starts automatically
  when the invitation appears; it doesn't wait for a click. Implemented and verified.
- Worked With (`.hero__clients`): CVS Health, CG Infinity, PNC, First United.
  Shown only at 720–959px (and below); hidden at ≥960px, where *Where I've been* carries the same claim.
- Natera appears only in the *Where I've been* timeline.
- Project order and URLs: see [portfolio-architecture.md](portfolio-architecture.md#pfprojects-display-order-everywhere).
- `/slop/` is published and consistent with the rules (og:type `article`,
  canonical `…/slop/`, PDF at `/slop-audit.pdf`, zero relative `assets/` references).

## Open items

1. **`Hello Team.`**: approved, not implemented. Replace `Hello Team&nbsp;` +
   `<svg class="pxi pxi--face" data-px="smiley-o">…</svg>` with plain `Hello Team.`.
   Before removing `#px-smiley-o` from the sprite, check nothing else references it.
   Afterwards re-verify the thread measure and message-1 clipping in the 720–959 band,
   and regenerate `/slop/`.
2. **2×2 Worked With logo grid**: blocked. Before starting, ask the owner for
   design reference 2 (lost in the original handoff), and resolve two conflicts:
   the logos are hidden at ≥960px by design (a desktop grid means reflowing the
   hero bento), and the reference reportedly includes Natera, which is restricted to
   *Where I've been*. Reveal group 3 is already wired for this block.
   Not the old marquee rail.
3. **Recreate the `/slop/` generator** (e.g. `tools/buildslop.py`) and validate it
   byte-identically against the published pair. See the architecture doc.
4. **Test harness**: none in the repo. The checks in `CLAUDE.md` should become a reusable script under `tools/` or `tests/`.
5. **OptiFlow walkthrough labels: punctuation fix awaiting approval.** The
   repository's `assets/app-2.js` is production and stays as is until the owner
   approves a change. See [the app-2.js audit](#assetsapp-2js-audit-2026-10-19) below.
6. No favicon; `/favicon.ico` 404s. Pre-existing.

## `assets/app-2.js` audit (2026-10-19)

The repo copy (40,826 bytes) was compared with the copy in the retired
`candidate-build` folder (40,709 bytes, last modified 2026-09-17 02:07, about
three hours after the repo version was committed in `e460fa8`). Both are 1,000 lines.

- **With comments stripped, the only differences are four string literals in
  `ofw.js`** (the OptiFlow walkthrough), where `—` becomes `:`:
  `197 — Authorization Missing` / `PR — Patient Responsibility` in the feedback
  panel (`[data-fbtag]`), the snackbar (`[data-snacktext]`, `Removed: …` /
  `Added: …`), and the two `.ofw-t` tag chips the add sequence writes. No logic,
  timing, selector or control-flow change.
- Every other difference is comment punctuation in `ofw.js`, `peek.js` and
  `bim.js`. That pass also introduced a few comment blemishes (two trailing
  spaces, a lost indent before `(4, 2, 1)`, `bim.js.` for `bim.js —`). Harmless.
- **Visible consequence today:** `index.html` already uses the colon style in the
  walkthrough's static markup (`PR: Patient Responsibility`, `197: Authorization Mis…`,
  `M62: Missing Auth Co…`). The production `app-2.js` overwrites those labels with
  the em-dash form once the walkthrough runs, so the same tag switches punctuation
  mid-sequence. Adopting the colon strings would make them consistent.
- Decision: **left untouched** pending owner approval. If approved, the minimum
  change is the four string literals; the comment edits are optional.

## Reversed decisions — do not reinstate

These were built and then explicitly rolled back. If you find traces, flag them;
if any doc describes them as current, that doc is wrong.

1. The broad copy-simplification pass across the Project Browser and bento cards. The brief copy in the design-system doc is what survives.
2. The earlier desktop/ultrawide progressive-reveal staging (`html:not(.pf-work)` plus a single-column `.hero-card`). The current sequence is a later, different design. (Its First United Bank URL was kept.)
3. Centring or width-capping the stage-1 hero as a layout change. Centring is a transform.
4. Revealing on messages 1 and 2. Replaced by the single `pf:cta` cue.
5. The `matchMedia` system-theme listener and media-scoped `theme-color` metas.
6. `transition: opacity 0s linear 86400s` as a one-way illustration hold. Replaced by state-gated `msg-reveal`.
7. Scaling `.slot` to contain an overflowing embed. Scale `.slot > img`.

## Handoff discrepancies (code wins)

Found when checking the original handoff document against the repo on 2026-10-19:

- `index.html` (2,574,392 bytes), `slop/index.html` (2,574,295), `assets/app-1.js`
  (565,496) and 46 of the 47 asset files are byte-identical to the old candidate
  build. `assets/app-2.js` differs; see the audit above. The repo is production.
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

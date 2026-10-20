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
5. **`assets/app-2.js` is behind the local candidate build.** See discrepancies below.
6. No favicon; `/favicon.ico` 404s. Pre-existing.
7. Deployment is manual. Moving to committed files on `main` is worth discussing, only with the owner's agreement.

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

- **`assets/app-2.js` differs** from `~/Documents/Claude outputs/candidate-build/`
  (repo 40,826 bytes, candidate 40,709). The candidate replaces em dashes with
  colons and parentheses, in comments and also in visible OptiFlow walkthrough
  labels (e.g. `197 — Authorization Missing` → `197: Authorization Missing`).
  `index.html` (2,574,392), `slop/index.html` (2,574,295), `assets/app-1.js`
  (565,496) and the other 46 asset files are byte-identical to the candidate.
  Treat the candidate's `app-2.js` as newer until the owner confirms the upload.
- `index-1.html` is **not** in the repo (deleted in `bbb9309` / `c969442`).
- `social-preview.png` is **not** in the repo (deleted in `a49ce61`). Only
  `social-preview-v2.png` remains, and both pages' `og:image` point at it.
- `robots.txt` and `sitemap.xml` are **not** in the repo; they exist only in the candidate build.
- `README.md` and a commented `.gitignore` exist; the handoff didn't mention them.
- Besides Be Vietnam Pro and Cormorant Garamond, the file self-hosts Fraunces,
  a Playfair Display subset, Sora and Inter (case-study/embeds).
- The spacing scale runs to `--s-7` (144px), not `--s-6`.
- Theme resolution and stage arming are one head script, not two; the loader sits at the top of `<body>`, not in `<head>`.
- `msg-clay` keyframes animate transform and box-shadow as well as opacity.
- The stale clone at `~/Downloads/GitHub/productdesign` is now 1 ahead /
  127 behind with a modified `index.html` and untracked `social-preview-v2.png`.
  It was left untouched. This work was done in a separate clean clone at
  `~/Documents/productdesign-claude`, level with `origin/main`.

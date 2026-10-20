# CLAUDE.md

Portfolio of Sarthak (Rocky) Sahoo, Product Designer. Live at
<https://www.rockysahoo.space/> via GitHub Pages (`CNAME`, `.nojekyll`).
Remote: `https://github.com/rockysahooart/productdesign.git`, default branch `main`.

A single-page, hash-routed, framework-free site: hand-written HTML, CSS and
ES5-flavoured JavaScript. No npm, no bundler, no CI, no build step in the repo.

Detail lives in `docs/`:

- [docs/portfolio-architecture.md](docs/portfolio-architecture.md): files, routing, modules, `/slop/` generation, deployment
- [docs/design-system.md](docs/design-system.md): type, tokens, clay surfaces, responsive bands, hero thread, cards
- [docs/current-state.md](docs/current-state.md): what ships today, open items, reversed decisions, handoff discrepancies

## Files

| path | what it is |
|---|---|
| `index.html` | The whole site (~2.57 MB): all CSS inline, every view's markup, the blocking head scripts, the loader. |
| `assets/app-1.js` | The application (~565 KB), concatenated modules marked `/* ===== js/<name>.js ===== */`. |
| `assets/app-2.js` | Secondary behaviour (OptiFlow walkthrough, peek, …). |
| `assets/*.webp/png` | Content-hashed images. |
| `slop/index.html` | **Generated** from `index.html`. Never hand-edit. |
| `slop-audit.pdf` | Static download. |
| `CNAME`, `.nojekyll`, `social-preview-v2.png`, `.gitignore`, `README.md` | Leave alone. |

## Running it

Serve the repo root over HTTP (the `/slop/` page uses absolute paths):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A known, pre-existing 404 is `/favicon.ico`.

## Canonical environment

This checkout (`~/Documents/productdesign-claude`) and the GitHub repository are
the canonical project environment. There is no other source of project context.

**Not part of the workflow:** the stale clone at `~/Downloads/GitHub/productdesign`
(far behind `origin/main`, with old local edits) and the old local build folder
`~/Documents/Claude outputs/candidate-build/`. Don't read from them, edit them or
commit from them, except to resolve a specific discrepancy the owner names.

## Deployment

Pushing to `origin/main` deploys: GitHub Pages rebuilds from `main`. The normal flow:

1. Inspect the current repo state (`git fetch`, `git status`, read the code).
2. Make the minimum sufficient change.
3. If `index.html` changed, regenerate `slop/index.html` from it (rules in the architecture doc; the generator script is not in the repo yet).
4. Test it, by measurement (see below).
5. Review `git diff`. **For application changes, show the owner what changed before committing.**
6. Stage only the intended files, by name. Never `git add -A`; don't touch unrelated files.
7. Commit, then push to `origin/main`. GitHub Pages deploys.

Push with the owner's existing local git credentials. Never enter, request or
store a credential. Don't produce an upload manifest unless the owner asks for one.

## How to work here

- **Smallest change that fully solves the problem.** No refactors, renames,
  helper extraction, reformatting, ES5→ES6, or comment tidying alongside a fix.
  Propose broader changes and wait for agreement.
- **Prove it, don't inspect it.** Layout, timing and behaviour claims are
  settled by measurement in a real browser (rects at each width, animation
  clock timings, computed `visibility`, `scrollWidth` vs `innerWidth`, console
  and network errors). Screenshot anything visual and look at it.
- **Find the cause before fixing.** Name it (overflow, mask, stacking context,
  percentage against the wrong axis…). Never fix clipping by hiding, fading or
  cropping more.
- **The comments are the design record.** Read them before changing the code
  they sit on; when you change a rule, update its comment in the same voice
  (why, and what it replaced). Never strip them as verbose.
- **Never invent content**: research, metrics, outcomes, quotes, decisions. Ask.
- **"Natera" appears only in *Where I've been*.** Redact it anywhere else; never substitute another name.

## Do not touch without asking

- The two blocking `<head>` scripts (slop redirect; theme + stage arming). Their position before first paint *is* the feature.
- **Forced light mode.** A fresh visit is always light; dark only via the site's toggle (`localStorage['pf-theme']`). Keep the `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) … }` pattern, keep the single unscoped `theme-color` meta, and never add a `matchMedia` color-scheme listener.
- **The thread measure rule.** The hero player measures its column once. Never change the column's inline size between animation stages; move the conversation with a `transform`.
- The three-column project-browser split and aspect-locked embeds. Never widen the visual column; scale `.slot > img`, never `.slot`.
- Reveal escape hatches and `CEILING_MS = 26000`; loader safety nets `setTimeout(mark, 8000)` / `setTimeout(dissolve, 6000)`.
- `PF.PROJECTS` order (it drives carousel, cards and prev/next at once).
- Canonical external URLs: PNC `https://spiky-experiences-472785.framer.app/case-study`, First United Bank `https://spiky-experiences-472785.framer.app/fub`, identical at every entry point.
- No external runtime requests: fonts, scripts and images are self-hosted. No CDN, no Google Fonts.
- Anything on the reversed-decisions list in [docs/current-state.md](docs/current-state.md#reversed-decisions--do-not-reinstate).

## Testing before committing a site change

There is **no test harness in the repo yet**. Until one exists under `tools/`
or `tests/`, check at minimum:

1. Routes: `/`, `#top`, `#work`, `#contact`, `#/about`, `#/carry`, `#/optiflow`, `#/audit`, `#/specimen`, `/slop/`. Zero console errors, zero 4xx (except `/favicon.ico`).
2. Theme: dark-OS and light-OS fresh visits, stored dark, stored light, toggle and reload, OS flipped mid-visit. Zero dark frames on any fresh visit.
3. Sequence: nothing staged is visible before `pf:cta`; groups 1–5 in order; everything visible at the end; thread width identical before and after.
4. Escape hatches: reduced motion, deep link, `#work`, scroll past half a viewport, replay after the page is whole.
5. Widths 390, 768, 900, 1024, 1280, 1440, 1512, 1920, 2560: no horizontal overflow at any stage.
6. Regenerate `/slop/` and confirm no relative reference survives.

Don't leave throwaway scripts in the repo root.

## Git

- Commit and push only when asked. A push to `main` is a production deploy.
- One logical change per commit; docs commits separate from behaviour commits.
- Never commit secrets or anything from outside the repo.

## In flight

See [docs/current-state.md](docs/current-state.md#open-items). Summary: `Hello Team.`
copy change (approved, not built); 2×2 Worked With logo grid (blocked on design
reference 2); recreate `tools/buildslop.py`; build a test harness.

Recently shipped: `b38798c`, OptiFlow walkthrough labels in `assets/app-2.js`
use colons to match the static markup (see
[docs/current-state.md](docs/current-state.md#recently-shipped)).

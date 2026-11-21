# VFINAL in production (branch `vfinal`)

VFINAL is the owner's approved redesign (handoff package `design-handoff 2/`, frozen 2026-11-21). This branch
replaces the site with it. Nothing here is deployed until the owner approves a merge to `main`; `main` deploys
via GitHub Pages (legacy build, `main` /, custom domain `www.rockysahoo.space` from `CNAME`).

## How it is built

The handoff's boards (`.dc.html`) are Claude Design sources: the approved copy, CSS and scripts. Rather than
re-typing them, production mounts them unchanged through a small runtime, so the shipped layout, type and
behaviour are the boards' own.

| Path | What it is |
|---|---|
| `index.html` | Shell: social metadata (unchanged), the `#/slop` redirect, theme before first paint (dark unless `localStorage['vf-theme']==='light'`; owner 2026-11-21), self-hosted fonts, site controls CSS. |
| `assets/vf/dc.js` | The board contract the canvas engine provided: `DCLogic` (state / setState / renderVals / mount / unmount), `{{name}}` bindings, `on<Event>="{{fn}}"` listeners. |
| `assets/vf/app.js` | Router: route x range x theme -> board; Loading -> Landing hand-off; theme toggle; pause/play; slot focus ring; per-view `document.title`. |
| `vf/boards/*.html` | **Generated** by `tools/vfinal_build.py` from the handoff. Never hand-edit; change the builder. |
| `vf/frame.html` | Hosts the Loading board in its own document (board CSS is global; isolation keeps Loading and Landing apart). |
| `vf/site.html` | The previous site's `index.html`, unchanged. The Landing's live slots read their original artifacts from it, exactly as the canvas read its stored copy. |
| `assets/vf/shell`, `assets/vf/cs` | Handoff assets, byte-for-byte. |
| `assets/vf/fonts` | Self-hosted faces (see Fonts). |
| `tools/vfcheck.py` | Acceptance harness (08): `python3 tools/vfcheck.py [sweep theme loading keys motion links] [--shots DIR]`. |

Rebuild after a handoff change: `python3 tools/vfinal_build.py ["path/to/design-handoff 2"]`.

### Routes

`/` Landing (first visit per tab: Loading over it, once) · `#/about` · `#/carry` `#/optiflow` `#/specimen`
`#/audit` `#/sbl` `#/craigslist` (one continuous page each). In-page: `#top`, `#projects` (the project index; mobile:
the project carousel). Board-internal `#pNN` anchors and `*.dc.html` hub links are rewritten to these routes.

### Ranges

`< 1024` mobile boards · `1024-2303` desktop · `>= 2304` ultrawide (02, RANGES r2b); a resize across a boundary
reloads into the other board. Case studies are one fluid board at every width.

### Production rewrites (all in `tools/vfinal_build.py`, each commented)

- Asset paths -> `assets/vf/...`; Google Fonts links removed.
- Canvas frame sizes released: desktop/ultrawide Landing un-pins the cqh tokens the board froze at its frame
  (root becomes an inline-size container, so cqh = the viewport) and the first viewport is `max(100svh, ...)`;
  About roots fluid; Loading sculpture frame scaled to fit, text anchored at its own sizes.
- Canvas-only Loading loop / replay-on-view switched off (it detects "x-dc inside a frame").
- R3: mobile Landing description copy replaced by the same project's desktop text, read from the desktop board.
- R5 links: verified destinations from the current site; no-destination items disabled (not links).
- R4: the Scale walkthrough host also stops while motion is paused.

## Owner decisions applied (2026-11-21)

- Illustration -> https://rockysahooart.framer.website/, Music -> https://soundcloud.com/rocky-sahoo (header and menu
  sheet); About's "Illustration · Music · DJing" line links the same two plus DJing -> https://www.youtube.com/@6fut7music.
  Résumé stays disabled until a verified destination exists.
- "All projects" goes to the Landing's project index.
- Project 08 opens the on-site SBL study; the PNC Framer case study (canonical URL) is a fourth SBL resource link,
  "View case study ↗" (the current site's label), in the same component as the approved three.
- Loading -> Landing keeps the 300ms cross-fade; reduced motion hands off at once with no fade.
- `/slop/`, `tools/check.py` and `tools/buildslop.py` are kept as they are (they describe the previous site).
- Noto Sans Oriya 400 accepted as a temporary limitation (below).

## Usability pass (2026-11-21, four-persona study)

- Dark first for new visitors; the toggle's choice persists (amends R1 in the handoff `decisions.md`).
- Loading plays once per browser session (session cookie + tab storage); Esc / Enter / Space / click skip it from
  the first frame, even before the board has mounted. Reduced motion hands off at once.
- Résumé items removed until a verified destination exists.
- Case-study h1 = the Landing card's editorial title (Carry, OptiFlow, Specimen, Audit); body copy unchanged.
- Carry, Specimen and Audit section titles (`span.ar-h2`) exposed as level-2 headings; no visual change.
- About: the owner's sentence on the Odia name, as a body paragraph beside / under the name.
- The originals' floating phase nav steps aside while it would cover a prototype or figure, never while focused.

- Live PCVs: Craigslist, Carry, Cryptography, Design System Audit and Scale already ran live; OptiFlow's card now
  runs the site's live tagging preview (the board's capture is its poster), as the loader was built for. Specimen
  (photograph), Governance (hand-drawn sketch) and SBL (capture of the external demo; embedding it would be an external
  runtime request) are static originals: no live source exists in this repository.
- Heading levels never skip in the case studies (persona-card h4s under an h2 are announced as level 3).

## Rendering, Loading and navigation pass (2026-11-21)

- Theme lives in `localStorage['vf-theme']` and `html[data-vf-theme]`. The previous site's `pf-theme` key is retired and
  its `data-theme` attribute is not used: the live previews run that site's code, which follows both, and on the
  approved boards their host had neither (dark mode had turned Carry / DSA / Cryptography dark on an opaque frame).
- Slot frames take their document's colour-scheme, so no opaque backdrop ever covers the display plane.
- Loading runs on every fresh entry and refresh, at any address; route changes, the theme toggle and range changes
  mark themselves internal and skip it. The frame goes up before page content is built. The Morph form track plays
  2.6x after the entrance, so Healthcare, Finance and Developer tools pass before the board's own finish (~9.3s).
- The active Project Card (click / Enter / Space) and every project-list row open the project's verified destination;
  a neighbour's card first comes forward. `localStorage['vf-qa-skip-loading']` is the harness's switch only.

## Deviations and open items

- **Odia weight (temporary, accepted).** Noto Sans Oriya is self-hosted from the OFL Regular master only; the boards'
  300 renders at 400 (declared `300 400`, so no synthetic weight; characters exact). A true 300 needs the variable
  Noto Sans Oriya (OFL) added to `assets/vf/fonts/`.
- **Theme and pause controls** have no board design: icon buttons after the header nav (desktop/ultrawide), rows in
  the menu sheet (mobile). Pause holds CSS animations, the Scale walkthrough, and script-driven loops in the page and
  its artifact frames (frame loops, timer chains, intervals) without touching the originals' code.
- **1024-1400 desktop:** the wheel is width-bound there, so it is centred in its spare height (app.js WHEEL CENTRING);
  zero at the 1440 / 2560 boards. The wheel itself is still smaller than at 1440, by the board's own column rules.
- **Projects index** page (`PS-CS-Main`, G13) not built.
- Act two (`PF.ASK`) is not in VFINAL (O10).

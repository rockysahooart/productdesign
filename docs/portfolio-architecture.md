# Portfolio architecture

Verified against the code at commit `6dfd694` (2026-10-19).

## Files

```
index.html          ~2.57 MB. Whole site: all <style> inline (banners
                    /* ===== css/NN-name.css ===== */), every view's markup,
                    the loader, three blocking head scripts.
assets/app-1.js     ~565 KB. The application, concatenated from modules
                    marked /* ===== js/<name>.js ===== */.
assets/app-2.js     ~41 KB. ofw.js (OptiFlow walkthrough), peek.js, and others.
assets/<hash>.webp  Content-hashed images (a few .png where alpha/masking
                    needs it). 45 images + the two scripts = 47 files.
slop/index.html     Generated from index.html (see below).
slop-audit.pdf      Static download.
social-preview-v2.png   og:image for both pages.
CNAME, .nojekyll, .gitignore, README.md
```

Not in the repo, so not deployed: `robots.txt`, `sitemap.xml`. Copies exist in
the retired build folder `~/Documents/Claude outputs/candidate-build/`.

`app-1.js` modules, in order: routes, theme, stepper, media, carry, carry-ui,
optiflow, tagging, thread, reveal, dsa, ap-fit, audit-proto, px-emerge, pp-conf,
au-personas, pv-fit, projects, encryption, clients, tools, musicmenu, case, wire,
dsseq, main, peek, bim.

CSS sections in `index.html` include `00-fonts`, `01-tokens`, `02-base`,
`03-layout`, `04-components`, `06-responsive`, `07-clients`, `09-case`,
`16-reveal`, `33-hero-ultrawide`, plus per-study sheets (carry, optiflow,
encryption, dsa, audit, specimen, personas…).

## Blocking scripts

Two inline scripts in `<head>` (after the JSON-LD block) run before first
paint. Their position is the feature.

1. **Slop redirect.** `#/slop` or `#/slop/` → `location.replace('/slop/')`.
2. **Theme + stage arming.** Writes `data-theme` on `<html>` unconditionally:
   the stored `pf-theme` if it is `dark` or `light`, else `light`. Then sets
   `data-stage="0"` unless `prefers-reduced-motion: reduce`.

At the top of `<body>`, the loader script (gated once per visit by `sessionStorage['pf-seen']`,
   `var MIN = seen ? 0 : 3500`, safety nets `setTimeout(mark, 8000)` and
   `setTimeout(dissolve, 6000)`). It attaches
   `SRC = ['assets/app-1.js', 'assets/app-2.js']`; there are no blocking script tags for them.

## Routing

Views are `<main class="page" data-view="X" hidden>` in the one document:
`home`, `carry`, `optiflow`, `audit`, `specimen`, `about`, `slop`. `app-1.js`
toggles `hidden` from `location.hash`.

- `/slop/` is a separately served page. It sets `window.PF_VIEW = 'slop'` before the router reads the fragment.
- Routes starting with `http` open in a new tab with `rel="noopener"` and an
  external mark. `PF.isExternal(p)` decides from the URL (`/^https?:/i`).
  Don't add a parallel boolean that can disagree with it.

### Project order: two sources, kept identical

- **The Project Browser** reads `data-rank` on its `.pv__slide` articles: the desktop
  carousel (sorted by rank in `js/projects.js`), the ultrawide grid (CSS `order` by
  rank) and the list under the conversation (`inBrowserOrder`). Ranks 1–10: LiveFront
  (Craigslist for iOS), Carry, Cryptography, OptiFlow, Specimen Kit, Design System Audit,
  Design Governance, PNC, Missing Information, Scale. The ultrawide grid also lists the
  slides by `data-project` (`ALL TEN`) and orders them by rank; a new slide needs both.
- **`PF.PROJECTS`** below drives previous/next at the foot of a case study.
- The phone `#work` card order (`#work .cell--* { order }`, ≤719px) repeats the walk.
  `#work` (the lower Key Industry Projects bento) is hidden from 960px up by one rule in
  `css/34-livefront.css`; it remains the project list on phones and tablets.

Change all three together.

### `PF.PROJECTS`

| # | key | name | route | status |
|---|---|---|---|---|
| 1 | `livefront` | Craigslist for iOS | `https://www.figma.com/deck/DqjndHMaCEq9apsosLnSE0` | live |
| 2 | `carry` | Carry | `/#/carry` | live |
| 3 | `crypto` | Cryptography | `https://rockysahooart.github.io/encryption-coffee-shop/` | live |
| 4 | `optiflow` | OptiFlow | `/#/optiflow` | live |
| 5 | `specimen` | Specimen Kit | `/#/specimen` | live |
| 6 | `dsa` | Design System Audit | `/#/audit` | live |
| 7 | `governance` | Design Governance | `/slop/` | live |
| 8 | `pnc` | PNC Bank | `https://spiky-experiences-472785.framer.app/case-study` | live |
| 9 | `mi` | Missing Information | none | soon |
| 10 | `scale` | Scale | none | soon |
| 11 | `fub` | First United Bank | `https://spiky-experiences-472785.framer.app/fub` | live |
| 12 | `cvs` | CVS Health | Figma prototype (read the full URL from source) | live |
| 13–15 | `illo-1..3` | Illustration one–three | none | soon |
| 16–18 | `rel-1..3` | Release one–three | none | soon |

`PF.liveProjects()` filters `status === 'live'`. `'soon'` entries are never
linked and are always labelled.

PNC and First United Bank URLs are canonical. When changing either, grep the
whole repo for the old value and confirm zero remaining references (route
table, carousel `pv__go`, card links, mobile variants).

### Labels

```
PF.WORK = { label: 'Work', hash: '#work', top: '#top' }
PF.CTA  = { study: 'View Case Study', soon: 'Case study coming soon',
            back: 'Back to ' + PF.WORK.label, next: 'Next Project',
            prev: 'Previous Project', work: 'View Work' }
```

## `/slop/` generation

`slop/index.html` is generated from `index.html` so the audit has its own URL
and social metadata. Generate it with `python3 tools/buildslop.py`; `--check`
exits 1 if it is stale. The script was validated by regenerating the published
`slop/index.html` from the published `index.html` byte-identically. Rules:

1. Swap nine head elements: `<title>`, `description`, `canonical`
   (`…/slop/`), `og:type` (`website` → `article`), `og:title`,
   `og:description`, `og:url`, `twitter:title`, `twitter:description`.
2. Replace the `#/slop` redirect block with `<script>window.PF_VIEW = 'slop';</script>` plus its comment.
3. Rewrite relative references to absolute: `url("assets/`, `src="assets/`,
   `href="assets/`, `&quot;assets/` (HTML-escaped, inside `srcdoc` embeds:
   missing this once caused twelve 404s), the loader's `SRC` array,
   `href="./slop-audit.pdf"` → `/slop-audit.pdf`,
   `href="#top|#work|#contact|#background|#more"`, and `href="#/`.
4. Assert no relative reference survives; fail the build if one does.

The PDF is a plain static asset; don't route it through JavaScript.

## Deployment

GitHub Pages serves `main`; a push to `origin/main` is the deploy. No CI and no
build step. Workflow: inspect the repo, make the minimum sufficient change,
regenerate `/slop/` if `index.html` changed, test, review `git diff` (and show
the owner application changes before committing), stage only the intended files,
commit, push. Pushes use the owner's existing local git credentials. No upload
manifest unless the owner asks for one. See `CLAUDE.md`.

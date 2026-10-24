# Current state

As of 2026-10-24 on `main`.

## What ships today

- Hero: a self-playing chat thread. Message 1 `Hello Team.` (plain text);
  message 2 "I'm Sarthak Sahoo, a Product Designer based in Austin, TX" with the
  workspace illustration; message 3 "I've designed *human-centered* products in an
  AI-saturated world." with the hands illustration, reaction chips, then the
  invitation (now Browse more, inside the conversation).
- Three states at every width (INTRO → CONVERSATION → PORTFOLIO, `data-landing`
  intro → ready → work). **Intro**: after the loader the message animation plays
  alone. **Conversation** (on `pf:cta`): the introduction clears (480ms), the box
  stands empty (720ms), and the conversation begins in the same place; nothing else
  on the page is laid out, however many turns. **Portfolio**: only an explicit
  choice opens it: Browse more in the conversation, Projects or About in the
  navigation, or a deep link. The phone cascade is gone; reduced motion gets the
  same states without the movement. See
  [design-system.md](design-system.md#landing-states-jsrevealjs-css16-revealcss).
- The conversation (js/ask.js): "I believe design is how we make decisions visible,
  understandable, and easier to act on.", "Where would you like to start?", three
  questions, Browse more, and nothing else. *What are you currently working on?* is
  the cryptography explainer, marked in progress, with its own three follow-ups.
  Answers are shown by kind: a project as a large film still with its caption; a
  flow of connected thoughts drawn one link at a time and ending on the project; the
  employers from *Where I've been*; the illustration; the decks and where to listen.
- Navigation as a quiet companion: on desktop a row of five text links in the
  conversation's own box (Start here, Projects, Illustration, Music, About); below
  960 the same five in a menu beside the theme switch, fixed to the top corner
  (js/sitenav.js).
- Trusted By (four logo bubbles: CVS Health, Natera, PNC, CG Infinity) is built but
  not shown since the decision state was retired. Worked With (`.hero__clients`, below 960): CVS Health, CG Infinity, PNC, First United.
- Natera appears in the *Where I've been* timeline and, at the owner's request
  (2026-10-20), in the Trusted By bubbles, and (2026-10-24, the owner's brief named it)
  in act two's *Where have you worked?* answer, which reads that timeline.
- Project order and URLs: see [portfolio-architecture.md](portfolio-architecture.md#pfprojects-display-order-everywhere).
- `/slop/` is published and consistent with the rules (og:type `article`,
  canonical `…/slop/`, PDF at `/slop-audit.pdf`, zero relative `assets/` references).

## Open items

1. `social-preview-v2.png` (the og:image) still shows the old "Hello Team :)" greeting.
2. `PF.PROJECTS` lists Scale as `soon` with no route; its slide links to `/scale-market`.
3. No favicon; `/favicon.ico` 404s. Pre-existing.
4. Act two's lines (`PF.ASK` in js/ask.js) are drawn from text already on the site:
   the cards, the case studies (Carry's testing and AI-boundary sections, OptiFlow's
   review loop), Off the clock, and the owner's own wording for the philosophy line and
   the four steps of *How do you approach complicated problems?*. They are the
   owner's to rewrite in their own words.
5. Ultrawide: the Figma ideation's evidence shelf (cards beside the conversation that
   fly into the grid) was not built. Flows stay inside the conversation's column on
   every width (the measure rule); on desktop they step across it.
6. The quick links are hidden once the page is open between 960 and 1799 and from
   2400 up, where the margin would meet the cards; the page is its own navigation
   there.

## Recently shipped

- **2026-10-24: a minimal, direct entry.** Conversation-only until the visitor
  chooses the portfolio, at every width (the phone cascade, its scroll and focus
  hatches, and reduced motion's opt-out are gone). Quick links moved from the far
  left margin into the conversation's box and cut to five; the conversation lost its
  "Start here" and "Ask next" labels and Ask something else; Browse everything is
  Browse more. Current work is the cryptography explainer, marked in progress.
  Figma: section 09.

- **2026-10-24: act two.** The conversation became a second act in the same place
  rather than a continuation under the introduction: clear, empty beat, philosophy
  line, then a guide whose questions read as questions about the designer
  (*What are you currently working on?* among the first three). Answers by kind:
  film-still projects, animated flows with measured SVG connectors, employer logos,
  illustration, music. Desktop quick links; below 960 a fixed menu paired with the
  theme switch. `tools/check.py ask nav` covers it. Figma: section 08.

- **2026-10-23: the conversation after the introduction.** The passive See the work
  ending became an authored assistant (`js/ask.js`, `css/35-ask.css`, `PF.ASK`): the
  question, low-saturation gradient prompts, the visitor's choice as a tinted note,
  answers that acknowledge the question, evidence cards that reuse each project's
  slide (title, copy, link and live preview), path-dependent follow-ups, folding
  history, Browse everything through the existing gate. Desktop and ultrawide scroll
  inside the thread box; below 960 the conversation grows with the page. Reduced
  motion answers at once. `tools/check.py ask` covers it. Figma: *Portfolio Assistant —
  Wireflows & Interaction*, section 07. All copy is drawn from site text; the owner
  should still read every line (open item 4).

- **2026-10-20: LiveFront copy.** Title "Redesigning Craigslist for faster used-car
  discovery"; the description frames it as a paid product design brief with LiveFront
  (deliberate wording: not a design challenge, take-home or shipped client work).
  `PF.PROJECTS` context and README match.

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

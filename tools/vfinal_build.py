"""Build the VFINAL board fragments from the owner's design handoff.

    python3 tools/vfinal_build.py [HANDOFF_DIR]

The handoff (default: ~/3diterations/design-handoff 2) holds Claude Design board sources (.dc.html). They are the
approved spec: copy, CSS, scripts. This copies each board the site needs into vf/boards/ with only the production
rewrites listed in REWRITES below (asset paths, self-hosted fonts, canvas-only links and sizes), and copies the
handoff assets byte-for-byte into assets/vf/. Nothing else in a board is changed. Standard library only.
"""

import os
import json
import re
import shutil
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/3diterations/design-handoff 2')
OUT = os.path.join(ROOT, 'vf', 'boards')

SHELL = ['VF-1-Loading%s-r7', 'VF-2-Landing%s-r18', 'VF-4-About%s-r3']
SHELL_M = {'VF-1-Loading%s-r7': 'VF-1-Loading%s-m-r7', 'VF-2-Landing%s-r18': 'VF-2-Landing%s-m-r22',
           'VF-4-About%s-r3': 'VF-4-About%s-m-r8'}
STUDIES = ['Carry', 'OptiFlow', 'Specimen', 'Audit', 'SBL', 'Craigslist']

# Case-study page name -> production route
ROUTE = {'Carry': '#/carry', 'OptiFlow': '#/optiflow', 'Specimen': '#/specimen', 'Audit': '#/audit',
         'SBL': '#/sbl', 'Craigslist': '#/craigslist', 'Main': './#projects'}

# Landing "View Project" anchors (legacy board indices, 05-project-routing) -> verified destinations
PROJ = {
    '#p01': '#/craigslist',
    '#p02': '#/carry',
    '#p03': 'https://rockysahooart.github.io/encryption-coffee-shop/',
    '#p04': '#/optiflow',
    '#p05': '#/specimen',
    '#p06': '#/audit',
    '#p07': './slop-audit.pdf',
    '#p08': '#/sbl',
    '#p10': 'https://github.com/rockysahooart/underground-mvp',
}
# Header / footer destinations: verified on the current site, else disabled (R5)
NAV = {
    '#start': './#top', '#projects': './#projects', '#about': '#/about', '#work': './#projects',
    '#book': 'https://calendly.com/rockysahooart/30min',
    '#linkedin': 'https://www.linkedin.com/in/sarthakrockysahoo/',
    '#call': 'https://calendly.com/rockysahooart/30min',
    # owner-verified 2026-11-21
    '#illustration': 'https://rockysahooart.framer.website/',
    '#music': 'https://soundcloud.com/rocky-sahoo',
}
DJING = 'https://www.youtube.com/@6fut7music'
PNC = 'https://spiky-experiences-472785.framer.app/case-study'  # canonical PNC URL (CLAUDE.md)
DISABLED = ['#resume', '#p09']  # no verified destination yet (owner, 2026-11-21); #p09: VFINAL2's hidden, unlaunched 10th project


def rw_href(m):
    q, h = m.group(1), m.group(2)
    base = re.sub(r'(-m)?(-light)?\.dc\.html$', '', h)
    if h.endswith('.dc.html') and base in ROUTE:
        return 'href=%s%s%s' % (q, ROUTE[base], q)
    if h in PROJ:
        u = PROJ[h]
        ext = u.startswith('http')
        return 'href=%s%s%s%s' % (q, u, q, ' target="_blank" rel="noopener"' if ext else (' download' if u.endswith('.pdf') else ''))
    if h in NAV:
        u = NAV[h]
        return 'href=%s%s%s%s' % (q, u, q, ' target="_blank" rel="noopener"' if u.startswith('http') else '')
    if h in DISABLED:
        return 'data-vf-off=%s%s%s aria-disabled="true"' % (q, h, q)
    return m.group(0)


# PRODUCTION SIZING. Every board is a canvas frame of fixed width x height; the root's inline size pin is the canvas,
# not the design (README "Design intent vs canvas limitation"). The desktop / ultrawide Landing compositions are one
# viewport tall by design (ZONES: "1440x900 board = one viewport"); the boards pinned their cqh tokens to that frame
# because the taller board was the size container. In production the root is an inline-size container only, so every
# cqh in the board resolves against the viewport (the CSS fallback for cq units with no size container) and the
# board's own clamps return; the first viewport is --vfh, and the index section follows it, overlapping by the same
# amount the board does (96px d / 160px uw).
FLUID = {
    'landing-d': (72, 96, '.land{--g1:clamp(40px,9.2cqh,124px);--g2:clamp(32px,8cqh,96px);--g3:clamp(36px,6cqh,64px);'
                          '--rt:clamp(20px,2.4cqh,32px);--ctxw:clamp(272px,max(22.2cqw,580px - 30cqh),380px)}'
                          '.vix{--ctxw:clamp(272px,max(22.2cqw,580px - 30cqh),380px)}'),
    'landing-uw': (104, 160, '.land{--g1:clamp(56px,10.8cqh,168px);--g2:clamp(48px,10cqh,144px);--g3:clamp(48px,10cqh,144px);'
                             '--rt:clamp(28px,2.2cqh,40px)}'),
}


def prod_css(name):
    if name.startswith('VF2-1-Loading-m'):
        # VFINAL2 phone Loading (11 §4): the root is the viewport; the board's own r4() places the city in it
        # 481-1023 takes the phone rules too (11 §4, Assumption): the board centres its 390x844 world only <=480
        return ('<style id="vf-prod">.root{width:100%!important;height:100%!important}'
                '@media (min-width:481px){.world{left:calc(50% - 195px);width:390px;height:844px}}</style>')
    if name.startswith('VF2-2-Landing-m') or name.startswith('VF2-4-About-m') or name.startswith('VF2-3-Case-m'):
        # 481-1023: the 390 phone column centred; its vw-sized hero and edge-fixed menu button follow the column
        return ('<style id="vf-prod">.root{margin-left:auto;margin-right:auto}'
                '@media (min-width:481px){.root .top .h1.h1{font-size:26.13px}.root .mnb{right:calc(50% - 195px + 14px)!important}}</style>')
    k = None
    if name.startswith('VF-2-Landing'):
        k = 'landing-uw' if '-uw-' in name else (None if '-m-' in name else 'landing-d')
    css = ''
    if name.startswith('VF-2-Landing') and '-m-' in name:
        # View Projects (owner, 2026-11-21): a flat, square glass surface. Layers, back to front, inside the button's
        # own stacking context, inside the board's own CTA box (its full width, 56px height and place are unchanged): a soft drifting gradient of the board's accent, ground and neutral (::before, moved by
        # transform only, 16s, alternate); a sheer frosted plane carrying the Plinth's 14px grid at its 5-6% line
        # weight (::after, restrained blur); then the label and a small accent arrow. Edges: one --ctl line (3:1+
        # against the page), no radius, no shadow, no bevel. The gradient tops out at 26% accent under the frost, so
        # the label stays above 7:1 in both themes at every frame. Reduced motion and the site's pause hold it still.
        return ('<style id="vf-prod">/* production: View Projects (owner, 2026-11-21) */'
                '.root .acts .btn.pri.vf-vp{position:relative;isolation:isolate;overflow:hidden;gap:10px;border-radius:0;box-shadow:none;'
                'background:transparent;border:1px solid var(--ctl);color:var(--ink);transition:border-color .3s}'
'.root .acts .btn.pri.vf-vp::before{content:"";position:absolute;z-index:-2;inset:-60% -40%;pointer-events:none;'
                'background:radial-gradient(40% 70% at 30% 50%,color-mix(in srgb,var(--acc) 26%,transparent),transparent 70%),'
                'radial-gradient(45% 80% at 72% 45%,color-mix(in srgb,var(--neu) 22%,transparent),transparent 72%),'
                'linear-gradient(100deg,var(--bg),color-mix(in srgb,var(--bg) 88%,var(--ink)));'
                'animation:vfvp 16s ease-in-out infinite alternate;will-change:transform}'
                '.root .acts .btn.pri.vf-vp::after{content:"";position:absolute;z-index:-1;inset:0;pointer-events:none;'
                'background:linear-gradient(rgba(var(--hl),.06) 1px,transparent 1px) 0 0/14px 14px,'
                'linear-gradient(90deg,rgba(var(--hl),.06) 1px,transparent 1px) 0 0/14px 14px,rgba(var(--sf),.38);'
                '-webkit-backdrop-filter:blur(6px) saturate(1.05);backdrop-filter:blur(6px) saturate(1.05);transition:background-color .3s}'
                '@keyframes vfvp{0%{transform:translate3d(-14%,-4%,0)}100%{transform:translate3d(14%,4%,0)}}'
                '.root .acts .btn.pri.vf-vp .vf-arr{color:var(--acc);font-size:1.05em;line-height:1}'
                '.root .acts .btn.pri.vf-vp:hover{border-color:var(--acc)}'
                '.root .acts .btn.pri.vf-vp:active{background:transparent;border-color:var(--acc);color:var(--ink)}'
                '.root .acts .btn.pri.vf-vp:active::after{background-color:rgba(var(--hl),.10)}'
                '@media (prefers-reduced-motion: reduce){.root .acts .btn.pri.vf-vp::before{animation:none;transform:none}}'
                '</style>')
    if k:
        hh, ov, tokens = FLUID[k]
        g = SRC_TEXT[0]
        wh = float(re.search(r'"cb": ([0-9.]+)', g).group(1)) - float(re.search(r'"a": ([0-9.]+)', g).group(1))
        css = ('.land{--vf-wh:%g}' % wh) + ('.root{--vfh:max(100svh,%dpx);width:100%%!important;height:auto!important;overflow:clip!important;'
               'container-type:inline-size!important}'
               '.land{height:calc(var(--vfh) - %dpx)}%s'
               '.vix{position:relative;top:auto;height:auto;margin-top:calc(var(--vfh) - %dpx)}') % (
                   560 + hh, hh, tokens, ov)
    elif name.startswith('VF-1-Loading'):
        # The Loading composition is one viewport. Text stays anchored to the viewport corners at its own sizes; the
        # sculpture (aura + sheets, placed in frame pixels) sits in .vf-ls, the frame at its own size, centred and
        # scaled to fit (--vf-s = min(vw / W, vh / H), set by assets/vf/app.js), so its geometry is never re-placed.
        w, h = re.search(r'width:(\d+)px;height:(\d+)px;overflow:hidden">\s*<div aria-hidden="true" class="aura"', SRC_TEXT[0]).groups()
        if '-m-' in name:
            return ('<style id="vf-prod">/* production sizing (tools/vfinal_build.py FLUID): mobile Loading, one group */'
                    '.root{width:100%!important;height:100dvh!important;overflow:hidden!important;box-sizing:border-box;'
                    'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;'
                    'padding:max(env(safe-area-inset-top),20px) 24px max(env(safe-area-inset-bottom),20px)}'
                    # the board places and sizes the sculpture from the viewport height (--vb, --ey, --eh, --ew and the
                    # spacing tokens, with max-height steps); in this composition fit() sizes it, so the frame geometry
                    # is pinned to the board's own 390 x 844 values - the frame the envelope was measured in
                    '.root{--vb:844px!important;--sab:0px!important;--hp:24px!important;--sg:16px!important;--vm:24px!important;'
                    '--am:24px!important;--eh:1!important;--ey:-30px!important;--ew:1!important}'
                    # the finish holds the load pose (--ly) instead of moving into the old Landing hero box (--ty, ~158px
                    # lower): the board's own canvas rule for its static stack; the sheets still settle as designed
                    '.root[data-fin] .ldc{transform:translate(0px,var(--ly)) scale(var(--ek))!important}'
                    '.root .nm.nmm{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;text-align:center;'
                    'order:1;flex:none}'
                    '.root .nm.nmm .or{margin-top:6px!important}'
                    '.vf-ls{order:2;position:relative;flex:none;width:calc(390px * var(--vf-s,1));height:calc(var(--h) * var(--vf-s,1));'
                    'margin:clamp(12px,2.5dvh,28px) 0 0;pointer-events:none}'
                    '.vf-ls-i{position:absolute;left:0;top:0;width:390px;height:844px;transform-origin:0 0;scale:var(--vf-s,1);'
                    'translate:0 calc(var(--y) * -1 * var(--vf-s,1))}'
                    '.root .lnb{order:3;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;'
                    'flex:none;width:min(100%,320px);flex-direction:column;align-items:center!important;gap:clamp(16px,2.5dvh,24px)!important;'
                    'margin-top:clamp(12px,2.5dvh,28px)}'
                    '.root .lnb .lt{width:100%;padding-bottom:0!important;text-align:center}'
                    '.root .lnb .ldl p{text-align:center}'
                    '.root .lnb .go{width:auto;height:auto;min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:0;'
                    'background:none;font:400 15px/1 Inter,sans-serif;color:var(--mute)}'
                    '.root .lnb .go:hover{color:var(--ink)}'
                    '</style>')
        css = ('.root{width:100%%!important;height:100%%!important;overflow:hidden!important}'
               '.vf-ls{position:absolute;left:50%%;top:50%%;width:%spx;height:%spx;margin:-%spx 0 0 -%spx;'
               'scale:var(--vf-s,1);pointer-events:none}') % (w, h, int(h) // 2, int(w) // 2)
    elif name.startswith('VF-4-About'):
        css = ('.root{width:100%!important;height:auto!important;overflow:clip!important}'
               + ('.root{max-width:480px;margin:0 auto}' if '-m-' in name else ''))
    if not css:
        return ''
    return '<style id="vf-prod">/* production sizing (tools/vfinal_build.py FLUID) */%s</style>' % css


# R3: desktop copy is canonical. The mobile Landing boards carry older description copy in .lf / .xpd; each is replaced
# by the same project's desktop .ld text, read from the desktop board of the same theme (never typed here).
M_KEYS = [('I reimagined the iOS', 0), ('How I Designed for Better Patient Recall', 1), ('I translated Diffie', 2),
          ('I rethought FFPE', 3), ('How I Kept Humans', 4), ('I evaluated fragmented', 5),
          ('I developed a design governance', 6), ("I redesigned PNC", 7), ('I explored how healthcare', 8),
          ('How I Designed a Two-Sided', 9)]


def desktop_copy(s, desk):
    ld = re.findall(r'<p class="ld"[^>]*>(.*?)</p>', desk)
    assert len(ld) == 10, len(ld)

    def sub(m):
        for k, i in M_KEYS:
            if m.group(3).startswith(k):
                return m.group(1) + ld[i] + m.group(4)
        raise ValueError('unmapped mobile copy: ' + m.group(3)[:60])
    return re.sub(r'(<(\w+) class="(?:lf|xpd)"[^>]*>)(.*?)(</\2>)', sub, s)


SRC_TEXT = ['']
USED = set()
TITLES = [
    ('Improving patient recall after oncology visits', 'How I Designed for Better Patient Recall'),
    ('Designing AI-assisted billing review for operations teams across complex workflows',
     'How I Kept Humans in Control of AI-Assisted Clinical Billing'),
    ('Redesigning an oncology specimen kit for safer shipping and handling',
     'How I Redesigned Oncology Specimen Kits for Safer Handling'),
    ('Standardizing oncology workflows for clinical provider teams across complex systems',
     'How I Audited a Healthcare Design System for Consistency and Accessibility'),
]
# EDITORIAL PASS (owner, 2026-11-21; Ada). Targeted: openings that named a mechanism before its human context, third-
# person ledes, and clear grammar slips. Facts, figures, claims and order unchanged. Applied to the static first paint
# and to the ported source markup in the scripts (same text, JS-escaped). Every old string must still be found.
COPY = [
    ('The tagging screen in an AI-assisted billing pipeline: where a reviewer checks what the model pulled out of a '
     'document, and where a correction goes when they disagree.',
     'I designed the screen where billing reviewers check what an AI model pulled out of each document, and where their '
     'correction goes when they disagree with it.'),
    ('A tissue collection kit where the preparation instructions sit in the lid and the specimen has a cavity to sit in.',
     'I redesigned a tissue collection kit so the preparation instructions sit in the lid and the specimen has its own '
     'cavity to sit in.'),
    ('I mapped what PatientX already owned so Carry could sit inside it unchanged.',
     'I mapped what PatientX, the larger product Carry is part of, already owned, so Carry could fit inside it unchanged.'),
    ('<b>Sole UX Designer, three months</b> — turning these operational challenges into an efficient, connected, usable '
     'enterprise experience.',
     'I was the <b>sole UX designer for three months</b>, turning these operational challenges into an efficient, '
     'connected and usable enterprise experience.'),
    ('why users take more to navigate a system', 'why users take longer to navigate a system'),
    # second pass (owner, 2026-11-21): first person where the pages slipped into fragments or figure-speak
    ('Designed the human-review layer for AI-assisted billing. How reviewers kept, added, removed or corrected the billing tags a model proposed.',
     'I designed the human-review layer for AI-assisted billing: how reviewers keep, add, remove or correct the billing tags a model proposes.'),
    ('Turned each reviewer decision into structured feedback, suggestion, evidence, correction and reason, tied together so engineering had a signal it could act on.',
     'I turned each reviewer decision into structured feedback (the suggestion, the evidence, the correction and the reason, tied together) so engineering had a signal it could act on.'),
    ('Product · Engineering · Operations: the people defining the workflow, building the system, and working inside it.',
     'I worked with product, engineering and operations: the people defining the workflow, building the system and working inside it.'),
    ('Billing operations teams, who had to clear AI-generated tags fast and still keep enough context to judge one.',
     'I designed for billing operations teams, who had to clear AI-generated tags fast and still keep enough context to judge each one.'),
    ('The sections below document how that worked.', 'Below, I walk through how that worked.'),
    ("After keeps Before's information architecture: the same screens, in the same order, with the same sections, labels and actions where you'd expect them.",
     "My redesign keeps the original console's information architecture: the same screens, in the same order, with the same sections, labels and actions where bankers expect them."),
    ('What changed is presentation and behaviour, not the workflow:', 'What I changed is presentation and behaviour, not the workflow:'),
    # restructuring pass (owner, 2026-11-22): Carry's ending stays in its outcome section; notes become explanations
    ('I scoped it to an MVP, took it through stakeholder review, and handed it to a first build in Playground. A leadership change above me stopped it before release.',
     'I scoped it to an MVP and took it through stakeholder review.'),
    ('<div class="ar-note"><p>V1, V2 and V3 are meaningful revisions to the design during the three-week exploration.</p></div>', ''),
    ('I ruled out recording in a scope conversation that moved consent out of Carry.',
     'Carry never records the appointment. Patients can upload a recording they made themselves, and consent to record stays outside the app.'),
    ('Nothing on the prepare screen read as the patient’s own',
     'The patient’s own questions looked just like the app’s suggestions, so I made suggestions something a patient chooses to add'),
    ('I specified what upload, transcription and matching each do when they fail.',
     'When a recording won’t upload, can’t be turned into text, or doesn’t answer a question, the patient sees what happened and what to do next.'),
    ('I connected the same flow end to end and annotated it well enough for the team to argue with.',
     'I connected the screens into one annotated prototype so stakeholders could walk the journey and question it together.'),
    ('Three things I left open rather than quietly decide', 'Three technical questions stayed open for engineering to answer'),
    ('I took V3 into the workshop. It didn’t come out unchanged.', 'In the workshop, testing with patients moved the preparation checklist below their questions.'),
    # Landing: Craigslist's column introduces the problem; the assignment details live in the case study
    ('For a paid product design brief with LiveFront, I redesigned Craigslist’s React Native iOS experience and created an implementation-ready handoff for the used-car discovery flow.',
     'Finding a used car in Craigslist’s app meant scrolling past a long category list, backtracking through filters, and comparing listings that showed little beyond a title and a price. I reorganized it screen by screen.'),
    # slop pass (owner, 2026-11-22): kickers as plain labels instead of repeated rhetorical questions; no "not just X, but Y"
    ('class="pt__n">Part 1 · Who were the users?<', 'class="pt__n">Part 1 · The people<'),
    ('class="pt__n">Part 2 · What did the system look like?<', 'class="pt__n">Part 2 · The system<'),
    ('class="pt__n">Part 3 · What did I do?<', 'class="pt__n">Part 3 · My work<'),
    ('class="pt__n">Part 4 · What did my process look like?<', 'class="pt__n">Part 4 · How the work moved<'),
    ('class="pt__n">Part 5 · What did this feed back into?<', 'class="pt__n">Part 5 · What it fed<'),
    ('class="pt__n">Part 1 &middot; Who were the users?<', 'class="pt__n">Part 1 · The people<'),
    ('class="pt__n">Part 2 &middot; What did the system look like?<', 'class="pt__n">Part 2 · The system<'),
    ('class="pt__n">Part 3 &middot; What did I do?<', 'class="pt__n">Part 3 · My work<'),
    ('class="pt__n">Part 4 &middot; What did my process look like?<', 'class="pt__n">Part 4 · How the work moved<'),
    ('class="pt__n">Part 5 &middot; What did this feed back into?<', 'class="pt__n">Part 5 · What it fed<'),
    ('That’s shaped how I see design now: not just as something visual, but as something systemic.',
     'That’s shaped how I see design now: as something systemic as much as something visual.'),
    # third pass (owner, 2026-11-22): section headings as first-person story sentences, each drawn from its section
    ('class="ar-h2">Turning workshop direction into a testable MVP<', 'class="ar-h2">I joined a small design team with three weeks to turn this idea into something patients could test<'),
    ('class="ar-h2">Placing Carry inside the existing PatientX experience<', 'class="ar-h2">Carry had to live inside an app patients already used, without changing it<'),
    ('class="ar-h2">Mapping the first workable flow<', 'class="ar-h2">I drew one complete journey, from writing questions to reading the answers back<'),
    ('class="ar-h2">Specifying the behaviour V1 had left open<', 'class="ar-h2">My first version covered the whole journey, but not what a patient sees when something goes wrong with a recording<'),
    ('class="ar-h2">Preparing V2 for the workshop review<', 'class="ar-h2">For the workshop review, I made editing safer and kept long questions from being cut off<'),
    ('class="ar-h2">Testing V3 with patients, onsite and in Maze<', 'class="ar-h2">I tested the third version with patients, in the room and through an unmoderated tool<'),
    ('class="ar-h2">What changed, what I kept, and what I could not settle<', 'class="ar-h2">Testing moved the checklist, kept the quotations, and left some questions open<'),
    ('class="ar-h2">Building the component set the other designers worked from<', 'class="ar-h2">I built the component set the other designers worked from<'),
    ('class="ar-h2">What I handed off, and where it stopped<', 'class="ar-h2">I handed the flows, states and component set to a first build<'),
    ('class="ar-h2">Writing the flows back as requirements<', 'class="ar-h2">I wrote the flows back as requirements and logged what I couldn’t answer<'),
    ('class="ar-h2">Mapping three roles onto the tagging step<', 'class="ar-h2">Three roles depended on this step, and only one of them worked inside my screen<'),
    ('class="ar-h2">Mapping the pipeline, and where a person sits inside it<', 'class="ar-h2">I followed one billing letter through the pipeline to see where a person steps in<'),
    ('class="ar-h2">Designing the screen where a reviewer disagrees with the model<', 'class="ar-h2">I designed the moment a reviewer disagrees with the model<'),
    ('class="ar-h2">Documenting how a ticket moved, and what sent it back<', 'class="ar-h2">I kept a record of how each ticket moved, and why the team sent work back<'),
    ('class="ar-h2">The cycle the work fed<', 'class="ar-h2">Each correction fed a cycle that made the model more confident week by week<'),
    ('class="ar-h2">Auditing the lid, and specifying the two changes that came out of it<', 'class="ar-h2">I audited the kit’s printed lid and came away with two changes<'),
    ('class="ar-h2">The tickets I wrote for the subteam<', 'class="ar-h2">I wrote the subteam’s tickets and kept them current<'),
    ('class="ar-h2">What I observed, kept separate from what I concluded<', 'class="ar-h2">I kept what I saw in the kit separate from what I concluded<'),
    ('class="ar-h2">The starting condition: a sheet in the lid, nothing holding the specimen<', 'class="ar-h2">The kit arrived with every instruction on one sheet and nothing holding the specimen<'),
    ('class="ar-h2">Reordering the sheet in the lid<', 'class="ar-h2">I reordered the sheet so the reasons a sample gets refused read first<'),
    ('class="ar-h2">Specifying a cavity for the specimen to sit in<', 'class="ar-h2">I gave the specimen a cavity of its own so it couldn’t travel loose<'),
    ('class="ar-h2">Fitting both changes to a box already in manufacture<', 'class="ar-h2">Both changes had to fit a box that was already being made<'),
    ('class="ar-h2">Where I sat in the subteam<', 'class="ar-h2">I was the support designer in a three-person subteam<'),
    ('class="ar-h2">What both changes had in common<', 'class="ar-h2">Neither change added information; both were about where it sits<'),
    ('class="ar-h2">What the audit found that the library check did not<', 'class="ar-h2">The component library passed its own check, yet its screens slowed providers down<'),
    ('class="ar-h2">Auditing the workflows instead of the component library<', 'class="ar-h2">So I audited the four workflows providers actually use, not the library<'),
    ('class="ar-h2">Mapping three provider roles onto the portal<', 'class="ar-h2">Three kinds of provider pass through the portal, mostly between other work<'),
    ('class="ar-h2">Ranking the actions, statuses and errors that repeated<', 'class="ar-h2">The same four problems repeated in every workflow, so I ranked them<'),
    ('class="ar-h2">Defining one row pattern and rules for colour<', 'class="ar-h2">I replaced four different rows with one pattern, and colour stopped carrying meaning alone<'),
    ('class="ar-h2">Moving into implementation with a build spec<', 'class="ar-h2">I wrote the row as a build spec engineers could test against<'),
    ('class="ar-h2">What I handed product and engineering<', 'class="ar-h2">This is the row exactly as I handed it to product and engineering<'),
    ('class="ar-h2">What I delivered, and the check I left unbuilt<', 'class="ar-h2">Delivering the rules taught me that design governance needs a check that runs on its own<'),
    ('class="h">The Problem</h2>', 'class="h">Bankers needed to handle more loan applications without more effort</h2>'),
    ('class="h">What I Did</h2>', 'class="h">I modernized the console without changing how bankers work</h2>'),
    ('class="h">What Changed</h2>', 'class="h">Bankers now see every open item, and why a step is blocked</h2>'),
    ('class="h">Before &amp; After</h2>', 'class="h">Side by side, every screen bankers knew is still there</h2>'),
    ('preparation guidance and nothing else — it carries', 'preparation guidance and nothing else: it carries'),
    ('deliberate about consequence — the button', 'deliberate about consequence: the button'),
    ('the users lives be improved', 'the users’ lives be improved'),
    ('create systems everyday', 'create systems every day'),
]
ODIA = ('My portfolio begins with my name in Odia, the language of my family’s roots in Odisha, India. '
        'I wanted that part of my identity to feel present from the very beginning.')


# VFINAL2 Landing copy (owner, 2026-11-22: the repo's copy is authoritative). The VFINAL2 boards carry older
# descriptions; every panel (.pn) and index row (.row) gets the project's current editorial title and description,
# identified by its data-n (VFINAL2 keeps the legacy numbering) and read from the built VFINAL desktop board (same project order as M_KEYS).
VF2_TAGS = ['Mobile marketplace · Paid product design brief', 'Patient experience · Healthcare', 'Interactive explainer',
            'Physical experience · Healthcare', 'AI-assisted operations · Healthcare', 'Design systems · Healthcare',
            'Design governance · AI-generated work', 'Securities-based lending · Finance', 'Operations · Healthcare',
            'Two-sided marketplace · Music education']
VF2_COPY = [
    ('I’ve designed human-centered products in an AI-saturated world.',
     'I’m Rocky, a product designer and creative technologist. I turn complex ideas into experiences people can understand and use.'),
    ("I'm Rocky, a product designer connecting people, processes, and technology. I make complex systems easier to understand and use.",
     'Sarthak Sahoo · Product Designer · Austin, TX'),
    ('Sarthak “Rocky” Sahoo', 'Sarthak Sahoo'),
]


def vf2_copy(s, name):
    desk = open(os.path.join(OUT, 'VF-2-Landing-r18.html'), encoding='utf-8').read()
    ld = re.findall(r'<p class="ld"[^>]*>(.*?)</p>', desk)
    # SHORT SUBTITLES (owner, 2026-11-23): every project subtitle at about half its word count, on the mobile, desktop
    # and ultrawide Landing alike (all three read this list). Same facts and project context, nothing added; titles
    # and case-study copy untouched. Index 8 is the hidden, unlaunched tenth project (unchanged).
    SHORT = {
        # CONTRIBUTION FIRST (owner, 2026-11-24; replaces the two-sentence introductions of 2026-11-23): one sentence per
        # project leading with what I did, the redundant problem restatement dropped. Every fact is from that project's
        # own introduction, case study or short version; nothing added.
        0: 'I redesigned how buyers search, compare listings and judge sellers in Craigslist’s iPhone app, so the right car is easier to find.',
        1: 'I designed Carry, which links the questions patients write before a follow-up to the moments in the conversation that answer them.',
        2: 'I designed an interactive explainer that shows developers how ECDH and AES-GCM work together before they use a cross-platform library’s APIs.',
        3: 'I reordered the kit’s instruction lid so the reasons a sample gets refused read first, and specified an insert that holds the sample in transit.',
        4: 'I designed the review step for an AI model’s billing tags: agreeing stays one action, and every correction arrives sorted with its evidence.',
        5: 'I audited four provider workflows and replaced four separate fixes with one shared row pattern, clear status labels and error rules.',
        6: 'Generated product work can look finished while it is missing logic, states and evidence. I’m building standards an AI agent can use to catch that “AI slop” before it ships.',
        7: 'I kept bankers’ familiar lending flow and added a status panel that links every open item to the field that completes it.',
        9: 'I’m building a two-sided marketplace for music lessons: students find and book teachers, and teachers run booking, payments and progress in one place.',
    }
    assert len(ld) == 10, len(ld)
    ld = [SHORT.get(i, d) for i, d in enumerate(ld)]
    ed = re.findall(r'<h3 class="lh[^"]*"[^>]*>(.*?)</h3>', desk) or re.findall(r'class="lf"[^>]*>(.*?)<', desk)
    DN = {1: 0, 2: 1, 3: 2, 4: 4, 5: 3, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9}  # VFINAL2 data-n (legacy) -> project order
    def which(block):
        m = re.search(r'data-n="(\d+)"', block[:200])
        return DN.get(int(m.group(1))) if m else None
    def inner(blk, opener, text):
        """replace the content of the first element opened by `opener` (a span or p), matching nested spans"""
        a = blk.find(opener)
        if a < 0:
            return blk
        tag = opener[1:opener.index(' ')]
        i, depth = a + len(opener), 1
        while depth:
            o, c = blk.find('<' + tag, i), blk.find('</' + tag + '>', i)
            if c < 0:
                return blk
            if 0 <= o < c:
                depth, i = depth + 1, o + 1
            else:
                depth, i = depth - 1, c + len(tag) + 3
        return blk[:a + len(opener)] + text + blk[i - len(tag) - 3:]
    def pn(m):
        blk = m.group(0); i = which(blk)
        if i is None:
            return blk
        return inner(blk, '<p class="pf">', ld[i])
    s = re.sub(r'<div class="pn"[^>]*>.*?</div>', pn, s, flags=re.S)
    def row(m):
        blk = m.group(0); i = which(blk)
        return blk if i is None else inner(blk, '<span class="f">', ld[i])
    s = re.sub(r'<a class="row"[^>]*>.*?</a>', row, s, flags=re.S)
    s = re.sub(r'<div class="ld" data-n="\d+"[^>]*>.*?</p>', lambda m: (lambda i: m.group(0) if i is None else inner(m.group(0), '<span class="pf">', ld[i]))(which(m.group(0))), s, flags=re.S)
    for a, b in VF2_COPY:
        s = s.replace(a, b)
    # the phone closing statement (the board's old intro line) maps to the same identity line the footer prints right
    # below it; one copy is kept (the footer's)
    s = s.replace('<p class="close">Sarthak Sahoo · Product Designer · Austin, TX</p>', '')
    return s


# SHARED PROJECT ORDER (owner, 2026-11-24; OptiFlow moved to ninth the same day): Securities-Based Lending, Craigslist,
# Cryptography Explained, Carry, Oncology Specimen Kit, Scale, AI Design Governance, Design System Audit, OptiFlow; the
# Landing opens on Securities-Based Lending.
# Ids (data-n), PCVs, titles and destinations are unchanged; only the sequence moves: the board's own D.nums (Orbit, arrows,
# counter, ring; every industry subset follows it), its first selection, the DOM order of the index and the rows (the
# phone gallery reads the index), and every printed position number. The hidden, unlaunched 09 stays last.
VF2_ORDER = ['08', '01', '03', '02', '05', '10', '06', '04', '07', '09']
# HIDDEN FROM THE PUBLIC PORTFOLIO (owner, 2026-11-24): AI Design Governance (07) is withdrawn for now through the board's
# own navHidden switch, as the unlaunched 09 already is - Orbit, counter, index, rows, phone gallery and menu skip it; its
# PCV, panel, case page, routes and source stay in place. To bring it back: drop '07' from VF2_HIDDEN and put it back in
# VF2_ORDER after Scale (10).
VF2_HIDDEN = ['07', '09']
# DISPLAY TITLES (owner, 2026-11-24): first-person headlines for three projects on the Landing panels, the phone gallery
# and the Projects page; the project names (index, menu, labels), routes and assets are unchanged.
VF2_TITLES = {'02': 'How I designed a tool to help patients prepare for and remember medical appointments',
              '04': 'How I designed an AI-assisted billing review workflow',
              '10': 'How I designed a marketplace for music education'}
VF2_NAMES = {'02': 'Carry', '04': 'OptiFlow', '10': 'Scale'}


def vf2_order(s, name):
    old = 'D.nums=["01","02","03","05","04","06","07","08","09","10"];D.map.Healthcare=["02","05","04","06","09"];'
    assert s.count(old) == 1, name
    s = s.replace(old, 'D.nums=' + json.dumps(VF2_ORDER, separators=(',', ':')) + ';Object.keys(D.map).forEach(k=>D.map[k]'
                  '.sort((a,b)=>D.nums.indexOf(a)-D.nums.indexOf(b)));')
    assert s.count("this.sel='01'") == 1, name
    s = s.replace("this.sel='01'", "this.sel='" + VF2_ORDER[0] + "'")
    pos = {n: '%02d' % (i + 1) for i, n in enumerate(VF2_ORDER)}
    def num(blk):
        n = re.search(r'data-n="(\d+)"', blk).group(1)
        return re.sub(r'(class="c g[^"]*">)\d\d<', lambda m: m.group(1) + pos[n] + '<', blk, count=1)
    CM = r'(?:<!--(?:(?!-->).)*-->\s*)?'  # a reinstate note travels with the element it annotates
    def reorder(run, item):
        items = re.findall(item, run, re.S)
        gaps = re.split(item, run, flags=re.S)
        assert len(items) == 10 and all(not g.strip() for g in gaps[1:-1]), (name, len(items), [g[:200] for g in gaps[1:-1] if g.strip()])
        by = {re.search(r'data-n="(\d+)"', x).group(1): num(x) for x in items}
        return gaps[0] + gaps[1].join(by[n] for n in VF2_ORDER) + gaps[-1]
    def idx(m):
        body = re.sub(r' aria-current="true"', '', m.group(2))
        body = reorder(body, CM + r'<li data-n="\d+"[^>]*>.*?</li>')
        body = body.replace('class="ix">', 'class="ix" aria-current="true">', 1)
        return m.group(1) + body + m.group(3)
    s, k = re.subn(r'(<ol class="idx"[^>]*>)(.*?)(</ol>)', idx, s, flags=re.S)
    assert k == 1, name
    row = CM + r'<a class="row" data-n="\d+".*?</a>'
    s = re.sub('(?:' + row + r'\s*){9}' + row, lambda m: reorder(m.group(0), row), s, flags=re.S)
    s = re.sub(r'<div class="pn" data-n="\d+"[^>]*>(?:(?!<div class="pn").)*?class="c g pnn">\d\d<', lambda m: num(m.group(0)), s, flags=re.S)
    # the first paint is the first project's: the authored markup shows 01, so the shown/hidden state of its display,
    # panel and phone heading/lead/stem moves to the new first, and the board places everything once on mount
    first = VF2_ORDER[0]
    def vis(m):
        cls, n, rest = m.group(1), m.group(2), m.group(3)
        if n == '01' and ' hidden' not in rest[:12]:
            return '<%s class="%s" data-n="01" hidden%s' % (m.group(0)[1:m.group(0).index(' ')], cls, rest)
        if n == first and rest.startswith(' hidden'):
            return '<%s class="%s" data-n="%s"%s' % (m.group(0)[1:m.group(0).index(' ')], cls, n, rest[7:])
        return m.group(0)
    s = re.sub(r'<\w+ class="(art|pn|stem|hx|ld|mh)" data-n="(01|%s)"([^>]*)' % first, vis, s)
    # INACTIVE PCVs FACE THE CAMERA (owner, 2026-11-24). The r14 pose turned each orbit neighbour about its own spine
    # (rotateY(psi), 26-58deg) under the board's orthographic isometric camera, where a turn has no perspective to read as
    # depth: it rendered as a plain horizontal squash (cos psi, 11-39% narrower than its art). psi is 0 for every member:
    # each neighbour keeps its PCV's intrinsic aspect (object-fit: contain in the display's own box), at the one uniform
    # orbit scale, posed by the same camera, ring and pillar as before. The hand-off path already ended at psi 0.
    s, k = re.subn(r'(function r14psi\(phi\)\{[^}]*\})', r'\1r14psi=function(){return 0;};', s)
    assert k == 1 or '-m-' in name, (name, 'r14psi', k)
    nh = '"navHidden": ["09"]'
    assert s.count(nh) == 1, (name, 'navHidden')
    s = s.replace(nh, '"navHidden": ' + json.dumps(VF2_HIDDEN))
    for n in VF2_HIDDEN:
        s = re.sub(r'<li data-n="%s">' % n, '<li data-n="%s" hidden>' % n, s)
        s = re.sub(r'<a class="row" data-n="%s"(?![^>]*\bhidden\b)' % n, '<a class="row" data-n="%s" hidden' % n, s)
    # SCALE PREVIEW (owner, 2026-11-24): the orbit thumbnail (and so the Projects card) shows a still of Scale's own
    # walkthrough - its Discover results: guitar teachers with ratings, prices and availability - rendered from the
    # walkthrough itself (assets/vf/shell/6275ec00611caff4a9ab7a6e977173c7.png, transparent, 3x), in place of the three-phone composite that read
    # poorly at thumbnail size. The live walkthrough on the plinth is unchanged; the composite stays in assets.
    s, k = re.subn(r'(<button type="button" class="orb" data-n="10"[^>]*>(?:(?!</button>).)*?<img[^>]*src=")assets/vf/shell/5533e819ea283b134d5f637b9e4757f8\.webp',
                   r'\1assets/vf/shell/6275ec00611caff4a9ab7a6e977173c7.png', s, flags=re.S)
    assert k == 1 or '-m-' in name, (name, 'scale orb', k)
    for n, title in VF2_TITLES.items():
        s, k = re.subn(r'(<h3 class="pt"[^>]*>)%s(</h3>)' % VF2_NAMES[n], lambda m: m.group(1) + title + m.group(2), s)
        assert k >= 1, (name, 'title', n)
    s = s.replace('class="nd sel" data-n="01"', 'class="nd" data-n="01"').replace('class="nd" data-n="%s"' % first, 'class="nd sel" data-n="%s"' % first)
    # INDEX AS ONE SEQUENCE (owner, 2026-11-24). Collapsed, the index showed rows 1-4 plus the active row wherever it was
    # (01 02 03 04 ... 07); it now shows four consecutive rows with the active one in them (one row of context before it
    # where there is one), so the list always reads as a run of the sequence. 'Show all' is unchanged.
    old_lay = "lis.forEach((li,i)=>li.classList.toggle('n9c',many&&!open&&i>=K&&li.dataset.n!==c.sel));"
    if '-m-' not in name:
        assert s.count(old_lay) == 1, (name, 'n9 lay')
        s = s.replace(old_lay, "const a9=Math.max(0,lis.findIndex(li=>li.dataset.n===c.sel)),s9=Math.max(0,Math.min(a9-1,lis.length-K));"
                      "lis.forEach((li,i)=>li.classList.toggle('n9c',many&&!open&&(i<s9||i>=s9+K)));")
    s, k = re.subn(r'this\.orbit\(\);this\.pager\(\);(\s*\}\s*members\(\))', r'this.orbit();this.pager();this.apply(true,0);\1', s)
    assert k == 1 or '-m-' in name, (name, k)  # the phone gallery applies each project itself
    return s


def convert(s, name=''):
    SRC_TEXT[0] = s
    if name.startswith('VF-1-Loading'):
        if '-m-' in name:
            # MOBILE COMPOSITION (owner, 2026-11-21; Iris): one centred vertical group - name, sculpture, loading
            # information, then the action - instead of three pieces pinned to the top, middle and bottom of the frame.
            # The sculpture keeps its frame geometry: .vf-ls is a flow box cut to the sculpture's own extent in the
            # frame (aura + sheets), and .vf-ls-i the untouched frame inside it, scaled to the height left over.
            # The container keeps the composition's height (399 frame px: names, status and action stay where they
            # are) and the sculpture's full-cycle envelope is centred in it (owner, 2026-11-21). With the finish
            # holding the load pose (below), every sheet and the orbit ring stay in frame y 248-481 for the whole
            # sequence, measured in the browser; centre 364.5, so the cut starts at 364.5 - 399 / 2.
            y0, y1 = 165, 165 + 399
            s = re.sub(r'(<div aria-hidden="true" class="aura"[^>]*></div><div aria-hidden="true" class="ldc")',
                       r'<div class="vf-ls" data-flow="1" data-y="%d" data-h="%d" style="--y:%dpx;--h:%dpx"><div class="vf-ls-i">\1' % (y0, y1 - y0, y0, y1 - y0), s, count=1)
            s = s.replace('<a href="#start" data-board=', '</div></div><a href="#start" data-board=', 1)
            # The circular arrow under the progress bar becomes a labelled "Skip" (owner, 2026-11-21): the Loading
            # still hands off on its own; Skip is the same control (.go), named by its visible text
            s = s.replace('class="go" aria-label="Start here">→</a>', 'class="go">Skip</a>', 1)
            assert 'class="go">Skip</a>' in s, name
        else:
            s = re.sub(r'(<div aria-hidden="true" class="aura"[^>]*></div><div aria-hidden="true" class="ldc")',
                       r'<div class="vf-ls" data-w="1">\1', s, count=1)
            # close .vf-ls after .ldc: .ldc is followed by the skip link
            s = s.replace('<a href="#start" data-board=', '</div><a href="#start" data-board=', 1) if 'class="vf-ls"' in s else s
    s = re.sub(r'<script src="\./support\.js"></script>', '', s)
    s = re.sub(r'<link href="https://fonts\.googleapis\.com/[^"]*" rel="stylesheet">', '', s)
    # srcdoc previews resolve assets/*.webp against this page, where the repo's own files live: the canvas-only
    # /_blob/ indirection for the Cryptography avatars is not needed
    s = s.replace("return A[h] ? '/_blob/' + A[h] : m;", 'return m;')
    # the live slots read the owner's real portfolio page; the canvas stored a copy with /_blob/ asset ids, production
    # reads vf/site.html, the current site's own index.html kept unchanged (its assets/ paths resolve here)
    s = s.replace("'../../assets/shell/c47c27ef0fd273b7e7871b60d3d85969.html'", "'vf/site.html'")
    s = s.replace('../../assets/shell/', 'assets/vf/shell/').replace('../../assets/case-studies/', 'assets/vf/cs/')
    # Canvas-only Loading behaviour (README: loop and replay-on-view are canvas limitations; "production: omit"): the
    # board detects the canvas as x-dc inside a frame, and production mounts it in a frame (vf/frame.html) for CSS
    # isolation, so the detection is switched off rather than met
    s = s.replace("!!document.querySelector('x-dc')&&window.top!==window.self", "!!document.querySelector('x-dc')&&false")
    s = s.replace("document.querySelector('x-dc')&&window.top!==window.self", "document.querySelector('x-dc')&&false")
    # VFINAL2 phone boards mark the canvas by "framed" before mount (html[data-canvas]); production's Loading frame is
    # framed but never the canvas, so the 59/34 device inset emulation is dropped (11 §2)
    s = s.replace("(window.top!==window.self)?'true':'false'", "'false'")
    # VFINAL2 micro-cut: the filter's visible word is "Filter" (::before), its text kept only as the accessible name;
    # the later "keep + restyle" rule (.root .r4ixb>span) re-sized that text, showing "FilterFilter by industry" on the
    # phone boards. Same rule, one class more specific so the board's stated intent holds.
    s = s.replace(".root .n9fb>span{font-size:0!important", ".root .r4ixb.n9fb>span,.root .n9fb>span{font-size:0!important")
    # NO FOCUS ON LOAD (owner, 2026-11-21): the Loading no longer focuses its Skip control when it mounts (a
    # programmatic focus with no prior input draws the focus ring, on phones too). Keyboard users keep Escape /
    # Enter / Space from the first frame (assets/vf/app.js) and reach Skip with Tab.
    if name.startswith('VF-1-Loading') or name.startswith('VF2-1-Loading'):
        s = s.replace("if(g)g.focus({preventScroll:true})", "if(g&&false)g.focus({preventScroll:true})")
    # R4: the Scale walkthrough host also stops while the visitor has paused motion (assets/vf/app.js)
    s = s.replace("function act(f){if(RM||", "function act(f){if(RM||document.documentElement.classList.contains('vf-still')||")
    # About's "Illustration · Music · DJing" line: the three verified destinations (owner, 2026-11-21), same text
    ext = ' target="_blank" rel="noopener"'
    s = s.replace('>Illustration · Music · DJing</p>',
                  '><a href="%s"%s>Illustration</a> · <a href="%s"%s>Music</a> · <a href="%s"%s>DJing</a></p>' % (
                      NAV['#illustration'], ext, NAV['#music'], ext, DJING, ext))
    # SBL: the existing PNC Framer case study stays as a supporting resource beside the approved three (owner,
    # 2026-11-21), in the same resource-link component, with the label the current site uses for it
    s = s.replace('GitHub repo <span aria-hidden="true">↗</span></a></p>',
                  'GitHub repo <span aria-hidden="true">↗</span></a><a class="lk" href="%s" target="_blank" '
                  'rel="noopener noreferrer">View case study <span aria-hidden="true">↗</span></a></p>' % PNC)
    # LIVE OPTIFLOW PCV (owner, 2026-11-21: live HTML/JS wherever the repo has it). The site ships the OptiFlow tagging
    # preview as a live document (vf/site.html, pv__frame 2: NAT[2] 1000x900, and the board's loader already carries its
    # camera framing, data-boost="optiflow"), but this board shows a still capture of it. The capture becomes the
    # slot's poster, exactly as Carry's: the board's own loader swaps in the live original when the slot is near.
    # data-theme="dark": the approved capture is the original's dark state; the loader applies it to the document.
    if name.startswith('VF-2-Landing'):
        s = re.sub(r'(<div class="gp dk" style="padding:0px">)(<img src="assets/vf/shell/fd8e35a0b41bb82ee0358dc345273035\.webp"'
                   r'[^>]*width="(\d+)" height="(\d+)")[^>]*>',
                   lambda m: '%s<span class="pf-prev" data-k="2" data-boost="optiflow" data-theme="dark" data-title="OptiFlow: tagging preview" '
                             'style="display:block;position:relative;overflow:hidden;width:%spx;height:%spx">%s style="display:block;'
                             'width:100%%;height:100%%;object-fit:contain"></span>' % (m.group(1), m.group(3), m.group(4), m.group(2)),
                   s, count=1)
    for old, new in COPY:
        jo, jn = old.replace('"', '\\"').replace('/', '\\/'), new.replace('"', '\\"').replace('/', '\\/')
        # the ported source in the script writes ’ as &rsquo; and — as &mdash;: try those spellings too
        eo, ejo = old.replace('’', '&rsquo;').replace('—', '&mdash;'), jo.replace('’', '&rsquo;').replace('—', '&mdash;')
        for o, n in ((old, new), (jo, jn), (eo, new), (ejo, jn)):
            # source lines may wrap anywhere: match any run of whitespace (or an escaped newline) between words
            rx = r'(?:\s|\\n)+'.join(re.escape(w) for w in o.split())
            s, k = re.subn(rx, lambda m, n=n: n, s)
            if k:
                USED.add(old)
    # Case pages: the brand and the header "Projects" link go to the Landing at its top (owner, 2026-11-21); the
    # "All projects" links keep the project index (./#projects)
    s = re.sub(r'<a class="id" href="Main(?:-light)?(?:-m)?(?:-light)?\.dc\.html"', '<a class="id" href="./"', s)
    s = re.sub(r'<a href="Main(?:-light)?(?:-m)?(?:-light)?\.dc\.html" aria-current="page">Projects</a>', '<a href="./">Projects</a>', s)
    # "View Projects" (mobile hero): a restrained button instead of the solid accent block (owner, 2026-11-21);
    # the label stays, a small accent arrow follows it (decorative, hidden from assistive tech)
    if name.startswith('VF-2-Landing') and '-m-' in name:
        n = s.count('<a class="btn pri" href="#vfmgrp" onClick="{{vp}}">View Projects</a>')
        s = s.replace('<a class="btn pri" href="#vfmgrp" onClick="{{vp}}">View Projects</a>',
                      '<a class="btn pri vf-vp" href="#vfmgrp" onClick="{{vp}}">View Projects<span class="vf-arr" aria-hidden="true">→</span></a>')
        assert n == 1, name
    # Craigslist: the chronological story around the existing artifacts (tools/craigslist_story.py; sources there)
    if name.startswith('Craigslist'):
        import craigslist_story as cs
        n0 = s.count('<div class="cs-wrap">\n<section class="sec"><div class="grid6">')
        s = s.replace('<div class="cs-wrap">\n<section class="sec"><div class="grid6">',
                      '<div class="cs-wrap">\n' + cs.BEFORE + '<div class="grid6">', 1)
        s = s.replace('</section>\n</div></main>', '</section>\n' + cs.AFTER + '</div></main>', 1)

        s = cs.prototype(s)
        # one introduction, not three (owner, 2026-11-22): the familiar experience first, then the redesign; the
        # secondary headline and its LiveFront paragraph go (the assignment is told in the brief section)
        s = re.sub(r'<div class="pair"><h2 class="h">Redesigning Craigslist for faster used-car discovery</h2><p class="p">.*?</p></div>', '', s, count=1, flags=re.S)
        lede = 'I reimagined the iOS experience to help buyers search, compare listings, evaluate seller credibility, and find relevant vehicles with less friction.'
        assert lede in s, 'Craigslist lede changed'
        s = s.replace(lede, 'Looking for a used car on your phone means finding listings near you, comparing them, working out where each car actually is, and deciding whether a seller seems trustworthy. I redesigned that experience in Craigslist’s iPhone app.', 1)
        nh = s.count('<figure class="hero"><div class="mount dk">')
        s = s.replace('<figure class="hero"><div class="mount dk">', cs.BEFORE_AFTER + '<figure class="hero"><div class="mount dk">', 1)
        assert n0 == 1 and nh == 1 and cs.AFTER in s, 'Craigslist story: source structure changed'
    # Usability pass (owner, 2026-11-21). Case-study h1 = the project's approved editorial title from the Landing card
    # (only the h1 text; static first paint and the ported source markup in the script both carry it)
    for old, new in TITLES:
        s = s.replace('>%s</h1>' % old, '>%s</h1>' % new).replace('>%s<\\/h1>' % old, '>%s<\\/h1>' % new)
    # About: the owner's sentence on the Odia name, as a body paragraph (.p) beside / under the name it explains
    if name.startswith('VF-4-About'):
        para = '<p class="p">%s</p>' % ODIA
        if '-m-' in name:
            s = s.replace('ସାର୍ଥକ ସାହୁ</span></div></div>\n <p data-mc="x" class="k kt"',
                          'ସାର୍ଥକ ସାହୁ</span></div>%s</div>\n <p data-mc="x" class="k kt"' % para.replace('class="p"', 'class="p" style="margin-top:24px"'), 1)
        elif '-uw-' in name:
            s = s.replace('column-gap:clamp(48px,3.125cqw,80px);margin-top:140px">\n  <div><p class="p">',
                          'column-gap:clamp(48px,3.125cqw,80px);margin-top:140px">\n  <div>%s<p class="p">' % para, 1)
        else:
            s = s.replace('margin-top:110px">\n  <div></div>', 'margin-top:110px">\n  <div>%s</div>' % para, 1)
        assert ODIA in s, name
    # VFINAL2 About: the same sentence, as the first body paragraph of the text section (the board's own .cols type)
    if name.startswith('VF2-4-About'):
        s = re.sub(r'(<section style="padding:[^"]*"><div class="cols">)(<p>Safety, income)',
                   lambda m: m.group(1).replace('<div class="cols">', '<div class="cols" style="margin-bottom:%s"><p>%s</p></div><div class="cols">' % ('0' if '-m-' in name else '32px', ODIA)) + m.group(2), s, count=1)
        assert ODIA in s, name
        # EXPERIENCE FRAMING (owner, 2026-11-23): one paragraph under Where I've been, in the owner's terms (full-time and
        # consulting roles, quick understanding of complex systems, long-term ownership) and the sectors already listed.
        # The timeline itself (titles, dates, employers) is unchanged pending the owner's confirmation against the resume.
        XP = ('My work has spanned full-time roles and consulting engagements across healthcare, finance and biotechnology. '
              'Each one asked me to understand a complex system quickly and contribute where it mattered most. What I want '
              'next is to own a product over the long term and see its decisions through.')
        s, nx = re.subn(r'(<h2 class="c g cap" style="margin-bottom:\d+px">Where I’ve been</h2>)',
                        lambda m: m.group(1) + '<div class="cols" style="margin-bottom:48px"><p>%s</p></div>' % XP, s, count=1)
        assert nx == 1, name
        # WHERE I'VE BEEN, FROM THE RESUME (owner, 2026-11-23: SarthakSahoo-ProductDesignResume-2026.pdf is the source).
        # Titles, employers and dates as the resume gives them; employment type only where it states one (CVS: the title
        # says Consultant; CG Infinity and Cognizant: the client the work was for). Nothing inferred.
        TL = [('2022–23', 'CVS Health', 'UI/UX Designer, Consultant', 'Healthcare'),
              ('2024', 'CG Infinity', 'UX Designer', 'Client: First United Bank'),
              ('2025–26', 'Cognizant', 'UX Designer', 'Client: PNC'),
              ('2026–', 'Natera', 'UX Designer', 'Biotechnology')]
        s, nt = re.subn(r'<ol class="tl">.*?</ol>', lambda m: '<ol class="tl">' + ''.join(
            '<li><span class="y">%s</span><span class="co">%s</span><span class="ro">%s</span><span class="c g se">%s</span></li>' % r
            for r in TL) + '</ol>', s, count=1, flags=re.S)
        assert nt == 1, name
        # the editorial pass's grammar fix on the current About (VF-4-About COPY) carried to the VFINAL2 boards
        assert 'view everything In systems' in s, name
        s = s.replace('view everything In systems', 'view everything in systems')
    # VFINAL2 typography on the case studies (12: VF2 authoritative for type; content and layout are the current site's):
    # the serif display becomes Inter through the size-adjusted 'VF2 Display' alias (assets/vf/fonts/fonts.css)
    if name.split('-')[0] in STUDIES:
        s = s.replace("'Instrument Serif'", "'VF2 Display'").replace('"Instrument Serif"', '"VF2 Display"')
    if name.startswith('VF2-2-Landing'):
        s = vf2_copy(s, name)
        s = vf2_order(s, name)
        # TRUSTED BY, BACK (owner, 2026-11-23): the original portfolio's four companies, in its order, from the repo's own
        # files (unchanged), beneath the name / role / location (phones: beneath the introduction). Each mark's share of
        # the row is its own aspect ratio (flex-grow), so all four stand at one height across the headline's width.
        # Rendering treatment in index.html (#vf .vf-logos).
        L = [('e1f605c00771.png', 'CVS Health', 316, 160), ('1144031febcc.png', 'Natera', 785, 160),
             ('0faea32528e6.png', 'PNC', 578, 160), ('0dc38d5927ca.png', 'CG Infinity', 309, 63)]
        logos = '<ul class="vf-logos" aria-label="Trusted by">' + ''.join(
            '<li style="flex-grow:%.3f"><img src="assets/%s" alt="%s" width="%d" height="%d" decoding="async"></li>' % (w / h, f, a, w, h)
            for f, a, w, h in L) + '</ul>'
        # HERO (owner, 2026-11-23): one sentence pair on every board; the phone board's hand-broken lines go (balanced wrap)
        HERO = 'I’m Rocky, a product designer and creative technologist. I turn complex ideas into experiences people can understand and use.'
        # the two roles carry the gradient (index.html .vf-gt); the profile photo stands just above the introduction
        HERO_H = HERO.replace('product designer', '<span class="vf-gt">product designer</span>').replace(
            'creative technologist', '<span class="vf-gt">creative technologist</span>')
        # "Rocky" alone in Newsreader Italic with its own letter-clipped gradient (owner, 2026-11-24; index.html .vf-rk)
        HERO_H = HERO_H.replace('I’m Rocky,', 'I’m <em class="vf-rk">Rocky</em>,', 1)
        ME = ('<img class="vf-me" src="assets/vf/shell/3bfd1d80dd3cf028b53dc1331dc2b885.webp" alt="Sarthak Sahoo" '
              'width="54" height="54" decoding="async">')
        s = re.sub(r'<h1 class="h1">(?:(?!</h1>).)*?AI-saturated world\.(?:</span>)?</h1>', '<h1 class="h1">' + HERO + '</h1>', s, count=1, flags=re.S)
        s = s.replace('<h1 class="h1">' + HERO + '</h1>', ME + '<h1 class="h1">' + HERO_H + '</h1>', 1)
        assert HERO_H in s and s.count('class="vf-me"') == 1, name
        if '-m-' in name:
            a0 = '</h1><div class="city">'
            assert s.count(a0) == 1, name
            s = s.replace(a0, '</h1>' + logos + '<div class="city">', 1)
        else:
            # the paragraph right after the introduction headline: the identity line (one board's source still held
            # the superseded intro sentence there; it takes the same line as every other board)
            m0 = re.search(r'</h1>(<p class="g"[^>]*>)(.*?)</p>', s)
            assert m0, name
            s = s[:m0.start()] + '</h1>' + m0.group(1) + 'Sarthak Sahoo · Product Designer · Austin, TX</p>' + logos + s[m0.end():]
        # ORBIT DEPTH WITHOUT BLACK-OUT (owner, 2026-11-23). vf2-dim dimmed each neighbour with brightness() (down to .13)
        # over its .78 backing plate, so out-of-view cards read as opaque black (light: grey) rectangles. The same
        # position-driven curve f(u) - u is the card's place on the ring, 1 at the front - now drives transparency,
        # desaturation, lower contrast and a sub-pixel blur instead; the plate is cleared so the artifact itself carries
        # the silhouette (the hairline border stays). Geometry, plinths, stacking and the active project are untouched;
        # --big keeps the board's own hide states.
        # ORBIT DEPTH AS SOLID OBJECTS (owner, 2026-11-24; replaces the transparency of 2026-11-23). Every orbit member is
        # fully opaque at every depth; depth is value, contrast, saturation and softness, driven by the board's own
        # position curve f(u) (u = place on the ring, 1 at the front): near neighbours lightly reduced, the middle of the
        # ring darker and quieter, the back darkest, flattest and a touch soft - still solid, still their own silhouettes.
        # The active project keeps no filter at all. --big keeps the board's own hide states; the plate stays cleared.
        F = 'pow(clamp(0, (var(--u) - 0.1) / 0.9, 1),1.2)'
        soft = ('<style id="vf2-dim-soft">'
                '.root.root.r8.r10 .orbs .orb.orb.orb.orb.orb{background:none!important;background-image:none!important;'
                'box-shadow:none!important;filter:none!important;opacity:var(--big, 1)}'
                '.root.root.r8.r10 .orbs .orb.orb.orb.orb.orb img{filter:brightness(calc(0.42 + 0.48 * %(f)s)) '
                'contrast(calc(0.72 + 0.23 * %(f)s)) saturate(calc(0.35 + 0.55 * %(f)s)) blur(calc((1 - %(f)s) * 0.7px))!important}'
                '.root.root.r8.r10 .orbs .orb.orb.orb.orb.orb[data-tone="light"] img{filter:brightness(calc(0.36 + 0.42 * %(f)s)) '
                'contrast(calc(0.72 + 0.23 * %(f)s)) saturate(calc(0.35 + 0.55 * %(f)s)) blur(calc((1 - %(f)s) * 0.7px))!important}'
                '</style>') % {'f': F}
        if '-m-' not in name:
            # GROUNDED ON THE PLINTH (owner, 2026-11-24): the featured display casts a soft contact shadow on the plinth's top
            # at its foot - an ellipse in the plane's own proportion (0.577), beneath the frame and the artwork (z -1 inside
            # the display's own stack), so the panel reads as standing on the plinth rather than floating over it. The
            # artwork, frame and plinth are untouched.
            soft = soft.replace('</style>', '.root .stage>.art::after{content:"";position:absolute;z-index:-1;left:6%%;width:88%%;'
                                'bottom:-14%%;height:calc(88%% * 0.577 * 0.42);pointer-events:none;'
                                'background:radial-gradient(closest-side,rgba(%s,%s) 0%%,rgba(%s,%s) 45%%,rgba(%s,0) 100%%)}</style>'
                                % (('38,34,28', '.26', '38,34,28', '.1', '38,34,28') if '-light' in name else ('0,0,0', '.62', '0,0,0', '.28', '0,0,0')))
        if '-light' in name:
            # light ground: distance recedes towards the paper (lighter, flatter), never towards black
            soft = soft.replace('brightness(calc(0.42 + 0.48 * %s))' % F, 'brightness(calc(1.22 - 0.22 * %s))' % F).replace(
                'brightness(calc(0.36 + 0.42 * %s))' % F, 'brightness(calc(1.12 - 0.2 * %s))' % F).replace(
                'contrast(calc(0.72 + 0.23 * %s))' % F, 'contrast(calc(0.55 + 0.4 * %s))' % F)
        # LANDING TYPE (owner, 2026-11-23; desktop / ultrawide boards only): the right column's project title and
        # description and the project list step down so the orbit leads; the introduction (h1) keeps its size. Board px
        # (the board is scaled as a whole); line heights loosened to match the smaller size.
        if '-m-' not in name:
            # orbit arrows together above the project copy in the information column (positions from app.js navPos;
            # the board's own placement under the exhibit is the fallback until it runs)
            # ultrawide lift (app.js vf2Fit, --vf-lift): added after the board's own --r5dy in the same translates
            soft = soft.replace('</style>', '.root.r4 .stage .world,.root.r4 .stage .orbs,.root.r4 .stage>.art{translate:0 calc(var(--r5dy,0px) - var(--vf-lift,0px))!important}'
                                '.root .stage .pg{translate:0 calc(100px - var(--vf-lift,0px))!important}.root .stage .r4pool{translate:0 calc(0px - var(--vf-lift,0px))}</style>')
            soft = soft.replace('</style>', '.root .stage .r6nav{width:var(--vf-ns,48px)!important;height:var(--vf-ns,48px)!important;'
                                'top:var(--vf-ny,236px)!important;translate:none!important;z-index:6}'
                                '.root .stage .r6nav.pv{left:var(--vf-nx,1880px)!important}'
                                '.root .stage .r6nav.nx{left:calc(var(--vf-nx,1880px) + var(--vf-ns,48px) + 10px / var(--vfz,1))!important}'
                                '.root .pns{padding-top:calc(var(--vf-ns,48px) + 20px / var(--vfz,1))}</style>')
            if '-uw-' not in name:
                soft = soft.replace('</style>', '.root .pns h3.pt{font-size:21px!important;line-height:1.28!important}'
                                    '.root .pns p.pf{font-size:15.5px!important;line-height:1.6!important}'
                                    '.root section.inf span.t{font-size:15px!important}.root section.inf span.f{font-size:15px!important;line-height:1.6!important}</style>')
            else:
                # ULTRAWIDE-FIRST (owner, 2026-11-23): this board is the Landing at every desktop width, fitted by
                # app.js vf2Fit (--vfz = its scale). Each text role keeps the board's own size (the secondary roles
                # stepped down as on desktop: title -25%, description / list -10%), never rendering below a readable
                # screen size: max(board px, floor / --vfz). Primary 19, body 14, UI 13.5, micro-labels 11-12.
                def fl(sel, base, floor, extra=''):
                    return '%s{font-size:max(%spx, calc(%spx / var(--vfz, 1)))!important%s}' % (sel, base, floor, extra)
                soft = soft.replace('</style>', ''.join([
                    fl('.root .lc h1.h1', 34, 22),
                    fl('.root .lc>p.g', 20.8, 13.5),
                    fl('.root header.hd nav a', 19.5, 13.5),
                    fl('.root header.hd .idn', 20.8, 13),
                    fl('.root li>button.ix span.it', 20, 14),
                    fl('.root li>button.ix span.c,.root .lab h2.c span,.root .pns .pn>p.c,.root section.inf a.row>span.c', 15.6, 11),
                    fl('.root .lc>button.c', 19.5, 13.5),
                    fl('.root .pns h3.pt', 31, 19.5, ';line-height:1.24!important'),
                    fl('.root .pns p.pf', 20, 14, ';line-height:1.6!important'),
                    fl('.root .pns a.pc,.root .pns .r5ex span', 15, 13.5),
                    fl('.root section.inf span.t', 19.5, 14),
                    fl('.root section.inf span.f', 19.5, 13.5, ';line-height:1.6!important'),
                    fl('.root section.inf span.cta', 20, 13),
                    fl('.root .stage .r4nl', 14, 12), fl('.root .stage .r4nl .c', 12, 11),
                    fl('.root .stage .r4ctr,.root .stage .r4ctr .of', 12, 11)]) + '</style>')
        assert s.count('<style id="vf2-dim">') == 1, name
        i = s.index('</style>', s.index('<style id="vf2-dim">')) + len('</style>')
        s = s[:i] + soft + s[i:]
    # THE WHITE LINE (owner, 2026-11-23): VFINAL2's one "lit" conduit (L6, litIn at 3650ms) is the solid white line from
    # the plinth to the front node, in the Loading city and the Landing stage. It loses only its lit state and stays one
    # of the city's ordinary conduits: same geometry, the grid's own hairline.
    if name.startswith('VF2-'):
        s = re.sub(r'(<i class="cd)\s+lit(?=[\s"])', r'\1', s)
    # Geist replaces Inter on the VFINAL2 boards and the case studies (owner, 2026-11-23; assets/vf/fonts/fonts.css)
    if name.startswith('VF2-') or name.split('-')[0] in STUDIES:
        s = s.replace("'Inter'", "'Geist'").replace('"Inter"', '"Geist"')
    s = s.replace('</helmet>', prod_css(name) + '</helmet>', 1)
    s = re.sub(r'href=(["\'])([^"\']*)\1', lambda m: rw_href(m) if not m.group(2).startswith("' +") else m.group(0), s)
    if name.startswith('VF2-') or name.split('-')[0] in STUDIES:
        s = projects_links(s, name)
    return s


def projects_links(s, name):
    """PROJECTS PAGE (owner, 2026-11-24): every 'Projects' navigation link - the header nav, the phone menu, a case
    study's 'All projects' - opens the Projects page (#/projects). In-page buttons such as the phone hero's 'View
    Projects' keep their own targets. The phone menu's Projects disclosure (projects by industry, old numbering) becomes
    a plain link to the same page."""
    s = re.sub(r'<nav\b.*?</nav>', lambda m: m.group(0).replace('href="./#projects" aria-current="page"', 'href="./#/projects"').replace('href="./#projects"', 'href="./#/projects"'), s, flags=re.S)
    s = re.sub(r'<a([^>]*)href="\./#projects"([^>]*)>(\s*(?:\u2190\s*)?All [Pp]rojects)', r'<a\1href="./#/projects"\2>\3', s)
    s, k = re.subn(r'<button type="button" class="mni mnd" id="mnpj".*?</button><div class="mnix" id="mnix" hidden>.*?</div>(?=</li>)',
                   '<a class="mni" href="./#/projects">Projects</a>', s, flags=re.S)
    return s


def projects_boards():
    """PROJECTS PAGE (owner, 2026-11-24). One board per range and theme, built from the About board (its header, footer,
    tokens and fitting) with its content replaced by the project grid: each remaining project, in the shared order, as
    its own visual (the PCV the Orbit shows) on a dark plinth-like panel of one proportion, and its display title - no
    descriptions or metadata. The whole card is the link to the project's existing destination. Colours derive from the
    board's text colour (currentColor), so the dark and light boards each read true."""
    land = open(os.path.join(OUT, 'VF2-2-Landing-uw-r29.html'), encoding='utf-8').read()
    cards = []
    for n in VF2_ORDER:
        if n in VF2_HIDDEN:
            continue
        img = re.search(r'<button type="button" class="orb" data-n="%s"[^>]*>.*?<img[^>]*src="([^"]+)"' % n, land, re.S).group(1)
        row = re.search(r'<a class="row" data-n="%s"([^>]*)>' % n, land).group(1)
        attrs = ' '.join(re.findall(r'(href="[^"]*"|target="[^"]*"|rel="[^"]*")', row))
        pn = re.search(r'<div class="pn" data-n="%s"[^>]*>.*?<h3 class="pt"[^>]*>(.*?)</h3>' % n, land, re.S).group(1)
        title = re.sub(r'<(?!/?span\b)[^>]+>', '', pn).strip()  # the Landing's no-break spans (Securities-Based) stay
        cards.append('<li><a class="pjc" %s><span class="pjv"><img src="%s" alt="" loading="lazy" decoding="async"></span>'
                     '<h2 class="pjt">%s</h2></a></li>' % (attrs, img, title))
    grid = '<ol class="pjg" role="list">' + ''.join(cards) + '</ol>'
    css = ('<style>.root .pj{padding:var(--pj-top) var(--pj-x) 0}.root .pj h1{margin:0 0 var(--pj-h);font:330 var(--pj-fs)/1.1 \'Newsreader\',Georgia,serif;'
           'letter-spacing:-.01em;color:inherit}.root .pjg{list-style:none;margin:0;padding:0;display:grid;'
           'grid-template-columns:repeat(var(--pj-c),minmax(0,1fr));gap:var(--pj-gy) var(--pj-gx)}.root .pjc{display:block;color:inherit;'
           'text-decoration:none;outline:none}.root .pjv{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;'
           'padding:12%;box-sizing:border-box;background:color-mix(in srgb,currentColor 3.5%,transparent);border:1px solid color-mix(in srgb,currentColor 14%,transparent);transition:border-color .3s}'
           '.root .pjv img{display:block;max-width:100%;max-height:100%;object-fit:contain}.root .pjt{margin:var(--pj-t) 0 0;'
           'font:400 var(--pj-ts)/1.32 \'Newsreader\',Georgia,serif;color:inherit;opacity:.9;text-wrap:balance}'
           '.root .pjc:hover .pjv{border-color:color-mix(in srgb,currentColor 40%,transparent)}.root .pjc:hover .pjt{opacity:1}'
           '.root .pjc:focus-visible .pjv{outline:2px solid currentColor;outline-offset:4px}'
           '.root .pjt .vc-nb{white-space:nowrap}@media (prefers-reduced-motion:reduce){.root .pjv{transition:none}}</style>')
    for src, dst, mob in (('VF2-4-About', 'VF2-5-Projects', 0), ('VF2-4-About-light', 'VF2-5-Projects-light', 0),
                          ('VF2-4-About-m-r6', 'VF2-5-Projects-m', 1), ('VF2-4-About-m-light-r6', 'VF2-5-Projects-m-light', 1)):
        s = open(os.path.join(OUT, src + '.html'), encoding='utf-8').read()
        vars_ = ('--pj-top:48px;--pj-x:var(--gx);--pj-h:40px;--pj-fs:34px;--pj-c:1;--pj-gy:56px;--pj-gx:0;--pj-t:18px;--pj-ts:21px' if mob else
                 '--pj-top:72px;--pj-x:80px;--pj-h:72px;--pj-fs:52px;--pj-c:3;--pj-gy:88px;--pj-gx:48px;--pj-t:24px;--pj-ts:22px')
        body = '<section class="pj" aria-labelledby="pj-h" style="%s"><h1 id="pj-h">Projects</h1>%s</section>' % (vars_, grid)
        if mob:
            s, k = re.subn(r'<main>.*?</main>', '<main>' + body + '</main>', s, flags=re.S)
        else:
            s, k = re.subn(r'<section aria-label="About".*?(?=<section class="inf")', body, s, flags=re.S)
            s = s.replace('margin-top:140px;padding:90px 80px 100px', 'margin-top:160px;padding:90px 80px 100px', 1)
        assert k == 1, (dst, 'content')
        s = re.sub(r'(<div class="root[^"]*" style="[^"]*?)height:\d+px;', r'\1height:auto;', s, count=1)
        s = s.replace('<a href="#/about" aria-current="page"', '<a href="#/about"').replace('<a class="mni" href="#/about" aria-current="page"', '<a class="mni" href="#/about"')
        s = s.replace('href="./#/projects" class="g"', 'href="./#/projects" class="g" aria-current="page"', 1)
        s = s.replace('<a class="mni" href="./#/projects">', '<a class="mni" href="./#/projects" aria-current="page">', 1)
        s = s.replace('</helmet>', css + '</helmet>', 1)
        open(os.path.join(OUT, dst + '.html'), 'w', encoding='utf-8').write(s)
        print('board', dst)


def main():
    os.makedirs(OUT, exist_ok=True)
    files = []
    for t in SHELL:
        for th in ('', '-light'):
            files += [('shell', t % th), ('shell', (t % th).replace('-r', '-uw-r')), ('shell', SHELL_M[t] % th)]
    for st in STUDIES:
        files += [('case-studies', st), ('case-studies', st + '-light')]
    files.append(('case-studies', 'Main'))
    for folder, name in files:
        p = os.path.join(SRC, 'source', folder, name + '.dc.html')
        s = open(p, encoding='utf-8').read()
        if name.startswith('VF-2-Landing') and '-m-' in name:
            desk = open(os.path.join(SRC, 'source', folder, name.replace('-m-r22', '-r18') + '.dc.html'), encoding='utf-8').read()
            s = desktop_copy(s, desk)
        open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8').write(convert(s, name))
        print('board', name)
    missing = [o[:50] for o, _ in COPY if o not in USED]
    assert not missing, 'editorial pass: source text changed, not found: %s' % missing
    # VFINAL2 (owner, 2026-11-22: the full VFINAL2 design; design-handoff/12-vfinal2-source-manifest.md): its 24
    # boards build into vf/boards/ beside VFINAL's, with the same production rewrites
    src2 = os.path.expanduser('~/3diterations/design-handoff/source')
    if os.path.isdir(src2):
        for folder in ('vfinal2', 'vfinal2-loading'):
            for fn in sorted(os.listdir(os.path.join(src2, folder))):
                if not fn.endswith('.dc.html'):
                    continue
                name = fn[:-8]
                # VF2-3-Case is one template study holding superseded copy; the case studies keep the current boards
                # (with VFINAL2 type), so it is not built or shipped
                if name.startswith('VF2-3-Case'):
                    continue
                s2 = open(os.path.join(src2, folder, fn), encoding='utf-8').read()
                open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8').write(convert(s2, name))
                print('board', name)
        projects_boards()
        a2 = os.path.join(os.path.dirname(src2), 'assets', 'shell')
        for f in os.listdir(a2):
            if f != 'c47c27ef0fd273b7e7871b60d3d85969.html':
                shutil.copyfile(os.path.join(a2, f), os.path.join(ROOT, 'assets', 'vf', 'shell', f))
    for a, b in (('shell', 'shell'), ('case-studies', 'cs')):
        src = os.path.join(SRC, 'assets', a)
        for dp, _, fs in os.walk(src):
            for f in fs:
                if f == 'c47c27ef0fd273b7e7871b60d3d85969.html':
                    continue  # the canvas's stored site copy (/_blob/ ids); production uses vf/site.html
                rel = os.path.relpath(os.path.join(dp, f), src)
                dst = os.path.join(ROOT, 'assets', 'vf', b, rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copyfile(os.path.join(dp, f), dst)


if __name__ == '__main__':
    main()

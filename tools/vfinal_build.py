"""Build the VFINAL board fragments from the owner's design handoff.

    python3 tools/vfinal_build.py [HANDOFF_DIR]

The handoff (default: ~/3diterations/design-handoff 2) holds Claude Design board sources (.dc.html). They are the
approved spec: copy, CSS, scripts. This copies each board the site needs into vf/boards/ with only the production
rewrites listed in REWRITES below (asset paths, self-hosted fonts, canvas-only links and sizes), and copies the
handoff assets byte-for-byte into assets/vf/. Nothing else in a board is changed. Standard library only.
"""

import os
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
    '#p10': 'https://spiky-experiences-472785.framer.app/scale-market',
}
# Header / footer destinations: verified on the current site, else disabled (R5)
NAV = {
    '#start': './#top', '#projects': './#projects', '#about': '#/about', '#work': './#projects',
    '#book': 'https://calendly.com/rockysahooart/30min',
    '#linkedin': 'https://www.linkedin.com/in/sarthakrockysahoo/',
    # owner-verified 2026-11-21
    '#illustration': 'https://rockysahooart.framer.website/',
    '#music': 'https://soundcloud.com/rocky-sahoo',
}
DJING = 'https://www.youtube.com/@6fut7music'
PNC = 'https://spiky-experiences-472785.framer.app/case-study'  # canonical PNC URL (CLAUDE.md)
DISABLED = ['#resume']  # no verified destination yet (owner, 2026-11-21)


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
    ('class="ar-h2">Turning workshop direction into a testable MVP<', 'class="ar-h2">I had three weeks to turn a workshop premise into something patients could test<'),
    ('class="ar-h2">Placing Carry inside the existing PatientX experience<', 'class="ar-h2">Carry had to live inside an app patients already used, without changing it<'),
    ('class="ar-h2">Mapping the first workable flow<', 'class="ar-h2">I drew one complete journey, from writing questions to reading the answers back<'),
    ('class="ar-h2">Specifying the behaviour V1 had left open<', 'class="ar-h2">My first version showed the path, but not what happens when something fails<'),
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
    ('preparation guidance and nothing else &mdash; it carries', 'preparation guidance and nothing else: it carries'),
    ('deliberate about consequence — the button', 'deliberate about consequence: the button'),
    ('deliberate about consequence &mdash; the button', 'deliberate about consequence: the button'),
    ('the users lives be improved', 'the users’ lives be improved'),
    ('create systems everyday', 'create systems every day'),
]
ODIA = ('My portfolio begins with my name in Odia, the language of my family’s roots in Odisha, India. '
        'I wanted that part of my identity to feel present from the very beginning.')


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
    # NO FOCUS ON LOAD (owner, 2026-11-21): the Loading no longer focuses its Skip control when it mounts (a
    # programmatic focus with no prior input draws the focus ring, on phones too). Keyboard users keep Escape /
    # Enter / Space from the first frame (assets/vf/app.js) and reach Skip with Tab.
    if name.startswith('VF-1-Loading'):
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
        for o, n in ((old, new), (jo, jn)):
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
        s = s.replace('<a class="lk" href="https://www.figma.com/deck/DqjndHMaCEq9apsosLnSE0">view project <span aria-hidden="true">→</span></a>',
                      '<a class="lk" href="https://www.figma.com/deck/DqjndHMaCEq9apsosLnSE0" target="_blank" rel="noopener">View the presentation deck <span aria-hidden="true">↗</span></a>')
        s = cs.prototype(s)
        s = s.replace('<h2 class="h">Redesigning Craigslist for faster used-car discovery</h2>',
                      '<h2 class="h">I redesigned how people find a used car in Craigslist’s iPhone app</h2>', 1)
        nh = s.count('<figure class="hero"><div class="mount dk">')
        s = s.replace('<figure class="hero"><div class="mount dk">', cs.BEFORE_AFTER + '<figure class="hero"><div class="mount dk">', 1)
        assert n0 == 1 and nh == 1 and cs.AFTER in s and 'View the presentation deck' in s, 'Craigslist story: source structure changed'
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
    s = s.replace('</helmet>', prod_css(name) + '</helmet>', 1)
    s = re.sub(r'href=(["\'])([^"\']*)\1', lambda m: rw_href(m) if not m.group(2).startswith("' +") else m.group(0), s)
    return s


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

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
                    '.root .nm.nmm{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;text-align:center;'
                    'order:1;flex:none}'
                    '.root .nm.nmm .or{margin-top:6px!important}'
                    '.vf-ls{order:2;position:relative;flex:none;width:calc(390px * var(--vf-s,1));height:calc(var(--h) * var(--vf-s,1));'
                    'margin:clamp(4px,1.5dvh,16px) 0 0;pointer-events:none}'
                    '.vf-ls-i{position:absolute;left:0;top:0;width:390px;height:844px;transform-origin:0 0;scale:var(--vf-s,1);'
                    'translate:0 calc(var(--y) * -1 * var(--vf-s,1))}'
                    '.root .lnb{order:3;position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;'
                    'flex:none;width:min(100%,320px);flex-direction:column;align-items:center!important;gap:clamp(14px,2.5dvh,24px)!important;'
                    'margin-top:clamp(8px,2dvh,20px)}'
                    '.root .lnb .lt{width:100%;padding-bottom:0!important;text-align:center}'
                    '.root .lnb .ldl p{text-align:center}'
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
            # The cut is the sculpture's envelope while the forms play - every sheet and the orbit ring, measured in
            # the browser on the 390 frame (sheets y 257-452; the ring's visible ellipse ends higher) - plus 8px, not the aura's soft glow, which would leave empty
            # bands around the form. The board's own settle (the last second, its stack position) sits lower and is
            # left as designed.
            y0, y1 = 257 - 8, 452 + 8
            s = re.sub(r'(<div aria-hidden="true" class="aura"[^>]*></div><div aria-hidden="true" class="ldc")',
                       r'<div class="vf-ls" data-flow="1" data-y="%d" data-h="%d" style="--y:%dpx;--h:%dpx"><div class="vf-ls-i">\1' % (y0, y1 - y0, y0, y1 - y0), s, count=1)
            s = s.replace('<a href="#start" data-board=', '</div></div><a href="#start" data-board=', 1)
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
        if old in s or jo in s:
            USED.add(old)
        s = s.replace(old, new).replace(jo, jn)
    # Case pages: the brand and the header "Projects" link go to the Landing at its top (owner, 2026-11-21); the
    # "All projects" links keep the project index (./#projects)
    s = re.sub(r'<a class="id" href="Main(?:-light)?(?:-m)?(?:-light)?\.dc\.html"', '<a class="id" href="./"', s)
    s = re.sub(r'<a href="Main(?:-light)?(?:-m)?(?:-light)?\.dc\.html" aria-current="page">Projects</a>', '<a href="./">Projects</a>', s)
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

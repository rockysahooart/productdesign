#!/usr/bin/env python3
"""Generate slop/index.html from index.html.

/slop/ is the same document as the index, served from a subdirectory so the
Slop Audit has a real URL and social metadata of its own. Never hand-edit
slop/index.html; edit index.html and run this.

    python3 tools/buildslop.py            # write slop/index.html
    python3 tools/buildslop.py --check    # exit 1 if slop/index.html is stale

Three kinds of change, then an assertion:

1. Nine head elements swap to the audit's title, description, canonical,
   og:type (website -> article), og:title, og:description, og:url,
   twitter:title and twitter:description.
2. The #/slop redirect block is replaced by window.PF_VIEW = 'slop', which
   the router reads before it looks at the fragment.
3. Every relative reference becomes absolute, because the page is served
   one directory down. That includes the HTML-escaped &quot;assets/ inside
   the srcdoc embeds, which was missed once and cost twelve 404s.

Then no relative reference may survive. If one does, nothing is written.
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'index.html')
OUT = os.path.join(ROOT, 'slop', 'index.html')

SITE = 'https://www.rockysahoo.space/'
TITLE = 'The Slop Audit: a design-governance framework for AI-generated work'
DESC = ('A free framework for auditing agent-generated product work before it '
        'ships: rules, checklists and worked examples for catching AI slop in '
        'design and copy.')

HEAD = [
    (r'<title>[^<]*</title>', '<title>%s</title>' % TITLE),
    (r'<meta name="description" content="[^"]*">',
     '<meta name="description" content="%s">' % DESC),
    (r'<link rel="canonical" href="[^"]*">',
     '<link rel="canonical" href="%sslop/">' % SITE),
    (r'<meta property="og:type" content="website">',
     '<meta property="og:type" content="article">'),
    (r'<meta property="og:title" content="[^"]*">',
     '<meta property="og:title" content="%s">' % TITLE),
    (r'<meta property="og:description" content="[^"]*">',
     '<meta property="og:description" content="%s">' % DESC),
    (r'<meta property="og:url" content="[^"]*">',
     '<meta property="og:url" content="%sslop/">' % SITE),
    (r'<meta name="twitter:title" content="[^"]*">',
     '<meta name="twitter:title" content="%s">' % TITLE),
    (r'<meta name="twitter:description" content="[^"]*">',
     '<meta name="twitter:description" content="%s">' % DESC),
]

REDIRECT = re.compile(
    r'<!-- THE OLD FRAGMENT STILL GOES SOMEWHERE\..*?-->\s*<script>\s*\(function \(\) \{\s*'
    r"if \(location\.hash === '#/slop' \|\| location\.hash === '#/slop/'\) \{.*?</script>",
    re.S)

PF_VIEW = (
    "<!-- THIS FILE IS THE SLOP AUDIT. The router reads it before it looks at the\n"
    "     fragment, so the view opens on arrival with nothing after the # to do it.\n"
    "     See parseHash in app-1.js. -->\n"
    "<script>window.PF_VIEW = 'slop';</script>")

ABSOLUTE = [
    ('url("assets/', 'url("/assets/'),
    ('src="assets/', 'src="/assets/'),
    ('href="assets/', 'href="/assets/'),
    ('&quot;assets/', '&quot;/assets/'),
    ("SRC = ['assets/app-1.js', 'assets/app-2.js']",
     "SRC = ['/assets/app-1.js', '/assets/app-2.js']"),
    ('href="./slop-audit.pdf"', 'href="/slop-audit.pdf"'),
    ('href="#/', 'href="/#/'),
]
ANCHORS = re.compile(r'href="#(top|work|contact|background|more)"')

LEFTOVER = re.compile(
    r'url\("assets/|src="assets/|href="assets/|&quot;assets/|\'assets/app-|'
    r'href="\./|href="#(?:/|top"|work"|contact"|background"|more")')


def build(text):
    head_end = text.index('</head>')
    head, rest = text[:head_end], text[head_end:]
    for pat, rep in HEAD:
        head, n = re.subn(pat, lambda m: rep, head, count=1)
        if n != 1:
            raise SystemExit('buildslop: head element not found: ' + pat)
    head, n = REDIRECT.subn(lambda m: PF_VIEW, head, count=1)
    if n != 1:
        raise SystemExit('buildslop: #/slop redirect block not found')
    out = head + rest
    for a, b in ABSOLUTE:
        out = out.replace(a, b)
    out = ANCHORS.sub(lambda m: 'href="/#%s"' % m.group(1), out)
    left = LEFTOVER.findall(out)
    if left:
        raise SystemExit('buildslop: %d relative references survived, e.g. %r'
                         % (len(left), left[:5]))
    return out


def main():
    with open(SRC, encoding='utf-8', newline='') as f:
        out = build(f.read())
    if '--check' in sys.argv:
        with open(OUT, encoding='utf-8', newline='') as f:
            same = f.read() == out
        print('slop/index.html is %s' % ('current' if same else 'STALE'))
        sys.exit(0 if same else 1)
    with open(OUT, 'w', encoding='utf-8', newline='') as f:
        f.write(out)
    print('wrote slop/index.html (%d bytes)' % len(out.encode('utf-8')))


if __name__ == '__main__':
    main()

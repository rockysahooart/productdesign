"""Cache-busting (owner, 2026-11-24): one content hash over the shell's scripts, fonts stylesheet and boards, written into
index.html as ?v= on dc.js, journeys.js, app.js and fonts.css; app.js passes it on to its board fetches. Run before
committing a deploy (python3 tools/bust.py); it rewrites only those query strings."""
import glob, hashlib, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = ['assets/vf/dc.js', 'assets/vf/journeys.js', 'assets/vf/app.js', 'assets/vf/fonts/fonts.css', 'vf/frame.html'] + sorted(
    os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, 'vf/boards/*.html')))
h = hashlib.md5()
for f in files:
    h.update(open(os.path.join(ROOT, f), 'rb').read())
v = h.hexdigest()[:10]
p = os.path.join(ROOT, 'index.html')
s = open(p, encoding='utf-8').read()
n0 = s
s = re.sub(r'(src|href)="(assets/vf/(?:dc|journeys|app)\.js|assets/vf/fonts/fonts\.css)(\?v=\w+)?"', lambda m: '%s="%s?v=%s"' % (m.group(1), m.group(2), v), s)
open(p, 'w', encoding='utf-8').write(s)
print('v=' + v, 'changed' if s != n0 else 'unchanged')

"""Live (motion) version: tl_inline.html with the hero still swapped for a copy of the bloom hero canvas."""
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'bloom_src.html')).read()
scripts = re.findall(r'<script[^>]*>.*?</script>', src, flags=re.S)
html = open(os.path.join(HERE, 'tl_inline.html')).read()
html = re.sub(r'<img id="bloom" src="[^"]*"/>', '<canvas id="c" aria-label="A pulsing core of 1,467 points, one per part of an E-Type roadster, with design windows that redraw variants. The window nearest the pointer opens into its parts."></canvas>', html, count=1)
html = html.replace('</style>', '.hero canvas#c{position:absolute;left:0;top:-40px;width:1440px;height:860px;display:block}.hero .t{pointer-events:none}.hero .t .acts{pointer-events:auto}</style>', 1)
html = html.replace('<span>Variants drawn</span><b style="color:#6F83F0">6</b><span>Windows</span><b>13</b><span>Focus</span><b>Drivetrain</b>',
                    '<span>Variants drawn</span><b id="r-var" style="color:#6F83F0">0</b><span>Windows</span><b id="r-win">13</b><span>Focus</span><b id="r-focus">—</b>')
assert 'id="r-var"' in html and 'canvas id="c"' in html
html = html.replace('</body>', '\n'.join(scripts) + '</body>')
os.makedirs(os.path.join(HERE, 'live'), exist_ok=True)
out = os.path.join(HERE, 'live', 'skyfall-twelvelabs-live.html')
open(out, 'w').write(html); print(out, len(html))

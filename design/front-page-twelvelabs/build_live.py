"""Live (motion) version: tl_inline.html with the hero still swapped for the live tile field (field.js)."""
import re, os, base64
HERE = os.path.dirname(os.path.abspath(__file__))
html = open(os.path.join(HERE, 'tl_inline.html')).read()
atlas = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(HERE, 'out', 'atlas.jpg'), 'rb').read()).decode()
html, n = re.subn(r'<img class="field" id="fieldimg" src="[^"]*"/>',
    f'<canvas class="field" id="field" aria-label="A stream of Skyfall images and SKY-001 design windows flowing out of the distance. Tiles near the pointer lift and outline in blue."></canvas><span id="field-atlas" data-src="{atlas}" hidden></span>', html, count=1)
assert n == 1
html = html.replace('<title>Skyfall Front Page · Twelve Labs style</title>', '<title>Skyfall Twelve Labs Study</title>')
html = html.replace('.herox .t{', '.herox .veil{pointer-events:none}.herox .t{', 1)
html = html.replace('</body>', '<script>' + open(os.path.join(HERE, 'field.js')).read() + '</script></body>')
os.makedirs(os.path.join(HERE, 'live'), exist_ok=True)
out = os.path.join(HERE, 'live', 'skyfall-twelvelabs-live.html')
open(out, 'w').write(html); print(out, len(html))

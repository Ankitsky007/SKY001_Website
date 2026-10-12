"""Live (animated) artifact version of the General Intuition-style page.
Reuses build_sky.py's layout; swaps each static ASCII image for a <canvas> that renders the
Higgsfield source image as a moving ASCII mosaic in the browser."""
import re, io, os, sys, base64
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
sys.argv = ['build_sky.py', '--inline']
ns = {'__file__': os.path.join(HERE, 'build_sky.py')}
exec(open(os.path.join(HERE, 'build_sky.py')).read(), ns)
html = ns['html']

# source images, downscaled, as data URIs
SRC = {}
for i in range(9):
    im = Image.open(os.path.join(HERE, 'raw', f'{i}.png')).convert('RGB')
    im.thumbnail((720, 720))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=82)
    SRC[i] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

CELL = {0: 8, 1: 8, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7, 7: 7, 8: 10}
def to_canvas(m):
    i = int(m.group(1)); style = m.group(2) or ''
    return f'<canvas class="asc" data-i="{i}" data-cell="{CELL[i]}"{style} aria-hidden="true"></canvas>'
html = re.sub(r'<img src="data:image/jpeg;base64,[^"]+"( style="[^"]*")?/>', lambda m: m.group(0), html)  # keep portraits
# the ASCII images were inlined from out/aN.jpg; map them back by order of appearance
order = [0, 1, 2, 3, 4, 5, 6, 7, 8]
asc_imgs = [m for m in re.finditer(r'<img src="(data:image/jpeg;base64,[^"]+)"( style="[^"]*")?/>', html)]
# portraits have no style and live inside .team; identify ASCII ones by matching file bytes
asc_uris = {ns['img'](f'a{i}.jpg'): i for i in order}
def repl(m):
    i = asc_uris.get(m.group(1))
    if i is None: return m.group(0)
    return f'<canvas class="asc" data-i="{i}" data-cell="{CELL[i]}"{m.group(2) or ""} aria-hidden="true"></canvas>'
html = re.sub(r'<img src="(data:image/jpeg;base64,[^"]+)"( style="[^"]*")?/>', repl, html)

# fonts: Google Fonts instead of inlined woff2
html = re.sub(r'@font-face\{[^}]*\}', '', html)
head_extra = '''<title>Skyfall SKY-001 Page · General Intuition study</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap">'''

EXTRA_CSS = '''
.faq li{cursor:pointer}.faq li .a{display:none}.faq li.open .a{display:block!important}.faq li .a .mono{margin-right:10px}
.rc>div{cursor:pointer}.rc .track{cursor:pointer;height:20px;display:flex;align-items:center}

:root{color-scheme:dark}
html,body{background:#050507}
body{font-family:'Geist',ui-sans-serif,system-ui,sans-serif;overflow-x:hidden}
.mono,.ascset{font-family:'Geist Mono',ui-monospace,monospace}
.f{zoom:var(--z,1)}
canvas.asc{display:block;background:#050507}
.hero>canvas.asc{position:absolute;inset:0;width:100%;height:100%}
.cta>canvas.asc{position:absolute;inset:0;width:100%;height:100%}
.sectors canvas.asc{width:328px;height:328px}
.ascset{pointer-events:auto}
.ascset label{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:5px 0}
.ascset input[type=range]{width:120px;accent-color:#3E57DA}
.ascset b{min-width:28px;text-align:right}
.ascset button{all:unset;cursor:pointer;color:#fff;padding:0 4px}
.ascset button:focus-visible,.btn:focus-visible{outline:2px solid #3E57DA;outline-offset:2px}
.ascset .hint{color:#7c7c8a;margin-top:8px;font-size:10px;line-height:1.5}
.btn,.links div{cursor:pointer;transition:background .2s,color .2s}
.btn:hover{background:#3E57DA;color:#fff;border-color:#3E57DA}
.links div:hover{background:rgba(62,87,218,.18)}
.links div:hover i{color:#fff}
.reopen{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:20;font-family:'Geist Mono',monospace;font-size:11px;letter-spacing:.08em;background:#fff;color:#000;padding:10px 12px;border:0;cursor:pointer}
'''
html = html.replace('<title>Skyfall SKY-001 Page · General Intuition style</title>', '')
html = html.replace('<style>', '<style>' + EXTRA_CSS, 1)

# interactive ASCII settings panel
old_panel = re.search(r'<div class="ascset">.*?</div></div>', html, re.S).group(0)
panel = '''<div class="ascset" id="ascset"><div><span>ASCII SETTINGS</span><button id="ascclose" aria-label="Hide ASCII settings">×</button></div>
<label for="cellsize"><span>Cell size</span><input id="cellsize" type="range" min="4" max="16" value="8"><b id="cellv">8</b></label>
<label for="textop"><span>Text opacity</span><input id="textop" type="range" min="0" max="100" value="100"><b id="textv">100</b></label>
<label for="tileop"><span>Tile opacity</span><input id="tileop" type="range" min="0" max="100" value="80"><b id="tilev">80</b></label>
<div class="hint">Move the pointer over any image.</div></div>'''
html = html.replace(old_panel, '')  # settings panel removed (Ankit, 14:02); defaults baked in below

JS = r'''

<script>
(() => {
const SRC = __SRC__;
const RAMP = " .,:;-~=+*!?/|()[]{}1tfjrxnuvczXYUJCLQ0OZmwqpdbkhao#MW&8%B@$";
const N = RAMP.length - 1;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const S = {cellScale: 0.75, text: 2, tile: 2};  // cell 6, text 200, tile 200
const page = document.querySelector('.f');
function fit(){ const z = Math.min(1, document.documentElement.clientWidth / 1440); page.style.setProperty('--z', z); }
fit(); addEventListener('resize', () => { fit(); items.forEach(sizeOf); });

const items = [...document.querySelectorAll('canvas.asc')].map((cv, k) => {
  const img = new Image(); img.src = SRC[cv.dataset.i];
  const it = {cv, ctx: cv.getContext('2d'), img, base: +cv.dataset.cell, seed: k * 97.3, visible: false, mx: -1e4, my: -1e4, born: performance.now(), samp: document.createElement('canvas')};
  it.sctx = it.samp.getContext('2d', {willReadFrequently: true});
  img.onload = () => { sizeOf(it); draw(it, performance.now()); };
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); it.mx = (e.clientX - r.left) / r.width * it.w; it.my = (e.clientY - r.top) / r.height * it.h; });
  cv.addEventListener('pointerleave', () => { it.mx = it.my = -1e4; });
  return it;
});
// pointer over the hero card/panel still reaches the hero canvas
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', e => { const it = items[0]; const r = it.cv.getBoundingClientRect(); it.mx = (e.clientX - r.left) / r.width * it.w; it.my = (e.clientY - r.top) / r.height * it.h; });
hero.addEventListener('pointerleave', () => { items[0].mx = items[0].my = -1e4; });

function sizeOf(it){
  const z = parseFloat(getComputedStyle(page).getPropertyValue('--z')) || 1;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  it.w = it.cv.offsetWidth; it.h = it.cv.offsetHeight;
  it.cv.width = Math.round(it.w * z * dpr); it.cv.height = Math.round(it.h * z * dpr);
  it.k = z * dpr;
}
const io = new IntersectionObserver(es => es.forEach(e => { const it = items.find(x => x.cv === e.target); it.visible = e.isIntersecting; }), {rootMargin: '100px'});
items.forEach(it => io.observe(it.cv));

function hash(x, y, t){ const s = Math.sin(x * 12.9898 + y * 78.233 + t * 37.719) * 43758.5453; return s - Math.floor(s); }

function draw(it, now){
  if (!it.img.complete || !it.w) return;
  const t = (now - it.born) / 1000;
  const cell = Math.max(4, Math.round(it.base * S.cellScale));
  const cols = Math.ceil(it.w / cell), rows = Math.ceil(it.h / cell);
  // slow camera push and drift
  const iw = it.img.naturalWidth, ih = it.img.naturalHeight, r = it.w / it.h;
  let cw = iw, ch = iw / r; if (ch > ih) { ch = ih; cw = ih * r; }
  const zoom = reduce ? 1.04 : 1.06 + 0.04 * Math.sin(t * 0.07 + it.seed);
  cw /= zoom; ch /= zoom;
  const px = (iw - cw) * (0.5 + (reduce ? 0 : 0.35 * Math.sin(t * 0.05 + it.seed)));
  const py = (ih - ch) * (0.5 + (reduce ? 0 : 0.35 * Math.cos(t * 0.04 + it.seed)));
  it.samp.width = cols; it.samp.height = rows;
  it.sctx.drawImage(it.img, px, py, cw, ch, 0, 0, cols, rows);
  const d = it.sctx.getImageData(0, 0, cols, rows).data;
  const ctx = it.ctx, k = it.k;
  ctx.setTransform(k, 0, 0, k, 0, 0);
  ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, it.w, it.h);
  ctx.font = `${Math.round(cell * 0.92)}px "Geist Mono", ui-monospace, monospace`;
  ctx.textBaseline = 'top';
  // load-in: rows decode top to bottom over the first 1.4s
  const reveal = reduce ? rows : Math.min(rows, (t / 1.4) * rows);
  const ft = Math.floor(t * 6);  // glyph shimmer rate
  const R2 = (cell * 9) ** 2;
  for (let y = 0; y < rows; y++) {
    if (y > reveal) break;
    for (let x = 0; x < cols; x++) {
      const o = (y * cols + x) * 4;
      let rr = (d[o] / 255) ** 0.62, gg = (d[o + 1] / 255) ** 0.62, bb = (d[o + 2] / 255) ** 0.62;
      const dx = x * cell - it.mx, dy = y * cell - it.my, dist = dx * dx + dy * dy;
      const near = dist < R2 ? 1 - dist / R2 : 0;
      const L = Math.min(1, 0.299 * rr + 0.587 * gg + 0.114 * bb + near * 0.35);
      if (S.tile > 0) { ctx.fillStyle = `rgb(${rr * 255 * S.tile | 0},${gg * 255 * S.tile | 0},${bb * 255 * S.tile | 0})`; ctx.fillRect(x * cell, y * cell, cell, cell); }
      if (L < 0.04 || S.text <= 0) continue;
      const jit = (hash(x, y, reduce ? 0 : ft + (near > 0 ? Math.floor(t * 20) : 0)) - 0.5) * (near > 0 ? 18 : 3);
      const gi = Math.max(1, Math.min(N, Math.round(L * N + jit)));
      const b = 1.45 * (1 + Math.max(0, S.text - 1) * .5), lift = 0.3 * L + near * 0.5;
      ctx.fillStyle = `rgba(${Math.min(255, (rr * b + lift) * 255) | 0},${Math.min(255, (gg * b + lift) * 255) | 0},${Math.min(255, (bb * b + lift + near * 0.4) * 255) | 0},${Math.min(1, S.text)})`;
      ctx.fillText(RAMP[gi], x * cell + cell * 0.12, y * cell);
    }
  }
}

let last = 0;
function loop(now){
  requestAnimationFrame(loop);
  if (now - last < 66) return;  // ~15 fps, like footage played as text
  last = now;
  items.forEach(it => { if (it.visible) draw(it, now); });
}
document.fonts.load('10px "Geist Mono"').finally(() => {
  items.forEach(sizeOf);
  if (reduce) items.forEach(it => draw(it, performance.now())); else requestAnimationFrame(loop);
});

// settings panel
const $ = id => document.getElementById(id);
const bind = (id, out, fn) => $(id) && $(id).addEventListener('input', e => { $(out).textContent = e.target.value; fn(+e.target.value); if (reduce) items.forEach(it => draw(it, performance.now())); });
bind('cellsize', 'cellv', v => S.cellScale = v / 8);
bind('textop', 'textv', v => S.text = v / 100);
bind('tileop', 'tilev', v => S.tile = v / 100);
if ($('ascclose')) $('ascclose').onclick = () => { $('ascset').hidden = true; $('ascopen').hidden = false; };
if ($('ascopen')) $('ascopen').onclick = () => { $('ascset').hidden = false; $('ascopen').hidden = true; };
})();
</script>'''.replace('__SRC__', __import__('json').dumps(SRC))

html = html.replace('<!doctype html><html><head><meta charset="utf-8">', '').replace('</head><body>', '')
html = html.replace('</body></html>', '')
EXTRA_JS = "\n<script>\n(() => {\n// World Models vs LLMs: replay the run on a shared 0-200 s clock (20x speed)\nconst cells = [...document.querySelectorAll('.race>div')], TOT = [4.2, 199, 110];\nconst W = 380, X = v => v / 200 * W;\nconst knob = document.querySelector('.rc .knob'), tl = document.querySelector('.rc .tlab');\nlet t = 0, playing = true, lastT = performance.now();\nconst reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;\nfunction paint(){\n  cells.forEach((c, i) => {\n    const bar = c.querySelectorAll('svg rect')[1], st = c.querySelector('.st'), done = t >= TOT[i];\n    bar.setAttribute('width', X(Math.min(t, TOT[i])).toFixed(1));\n    bar.setAttribute('fill', done ? '#3E57DA' : '#5d5d6c');\n    st.textContent = done ? `Done at ${TOT[i]} s` : `${Math.round(t / TOT[i] * 100)}% of run at ${t.toFixed(1)} s`;\n    st.classList.toggle('ok', done);\n  });\n  knob.style.left = `calc(${t / 200 * 100}% - 6px)`; tl.textContent = t.toFixed(1) + ' s';\n}\nfunction tick(now){ const dt = (now - lastT) / 1000; lastT = now;\n  if (playing && !reduce) { t = Math.min(200, t + dt * 20); if (t >= 200) playing = false; paint(); }\n  requestAnimationFrame(tick); }\nconst btn = document.querySelectorAll('.rc>div');\nbtn[0].onclick = () => { t = 0; playing = true; paint(); };\nbtn[1].onclick = () => { playing = false; t = Math.max(0, t - 10); paint(); };\nbtn[2].onclick = () => { playing = false; t = Math.min(200, t + 10); paint(); };\nconst track = document.querySelector('.rc .track');\ntrack.addEventListener('pointerdown', e => { const r = track.getBoundingClientRect(); playing = false; t = Math.max(0, Math.min(200, (e.clientX - r.left) / r.width * 200)); paint(); });\nif (reduce) { t = 4.2; } paint(); requestAnimationFrame(tick);\n// FAQ: open and close rows\ndocument.querySelectorAll('.faq li').forEach(li => li.querySelector('.q').addEventListener('click', () => {\n  const open = li.classList.toggle('open'); li.querySelector('.q i').textContent = open ? '−' : '+'; }));\n})();\n</script>"
html = head_extra + html + JS + EXTRA_JS
out = os.path.join(HERE, 'live', 'skyfall-sky001-gi-live.html')
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w').write(html)
print(out, len(html), html.count('<canvas'))

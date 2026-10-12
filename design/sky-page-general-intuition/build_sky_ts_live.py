"""Motion version of the TypeSafe-hero variation: the GI page's live build (ASCII canvases, race, FAQ)
with the hero sky as a live dither of the cloud photo that drifts and parts around the pointer, and news windows that pop in."""
import os, re, sys, base64
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'build_sky_live.py')).read()
s = s.replace("build_sky.py", "build_sky_ts.py").replace("sys.argv = ['build_sky_ts.py', '--inline']", "sys.argv = ['build_sky_ts.py', '--inline']")
s = s.replace("<title>Skyfall SKY-001 Page · General Intuition study</title>", "<title>Skyfall SKY-001 Page · TypeSafe hero study</title>")
s = s.replace("html = html.replace('<title>Skyfall SKY-001 Page · General Intuition style</title>', '')", "html = html.replace('<title>Skyfall SKY-001 Page · TypeSafe hero</title>', '')")
s = s.replace("os.path.join(HERE, 'live', 'skyfall-sky001-gi-live.html')", "os.path.join(HERE, 'live', 'skyfall-sky001-typesafe-hero-live.html')")
s = s.replace("const hero = document.querySelector('.hero');", "const hero = document.querySelector('.hero') || document.createElement('div');")
s = s.replace("const bind = (id, out, fn) => $(id).addEventListener", "const bind = (id, out, fn) => $(id) && $(id).addEventListener")
s = s.replace("$('ascclose').onclick", "if ($('ascclose')) $('ascclose').onclick").replace("$('ascopen').onclick", "if ($('ascopen')) $('ascopen').onclick")
s = s.replace('<button class="reopen" id="ascopen" hidden>ASCII SETTINGS</button>', '')
# the GI hero's pointer hook and settings panel no longer exist
s = s.replace("old_panel = re.search(r'<div class=\"ascset\">.*?</div></div>', html, re.S).group(0)", "old_panel = '@@nopanel@@'")
SKY_JS = r'''
<script>
(() => {
const img = document.getElementById('skyimg'); if (!img) return;
const cv = document.createElement('canvas'); cv.className = 'sky'; cv.setAttribute('aria-hidden', 'true');
img.replaceWith(cv);
const w = 480, h = 293, PX = 3; cv.width = w; cv.height = h;
const g = cv.getContext('2d'); const out = g.createImageData(w, h);
const map = new Image(); map.src = '__MAP__';
const samp = document.createElement('canvas'); samp.width = w; samp.height = h; const sg = samp.getContext('2d', {willReadFrequently: true});
const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => v / 16 + 1 / 32);
const SKY = [228, 234, 252], LIGHT = [139, 157, 238], BLUE = [62, 87, 218], WHITE = [255, 255, 255];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const P = {x: -1e4, y: -1e4, s: 0};
const hero = document.querySelector('.tsh');
hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); P.x = (e.clientX - r.left) / r.width * w; P.y = (e.clientY - r.top) / r.height * h; });
hero.addEventListener('pointerleave', () => { P.x = P.y = -1e4; });
let d = null, t0 = performance.now();
map.onload = () => { sg.drawImage(map, 0, 0, w, h, 0, 0, w, h); d = sg.getImageData(0, 0, samp.width, h).data; frame(performance.now()); };
function frame(now){
  const t = reduce ? 0 : (now - t0) / 1000;
  const sw = samp.width;
  for (let y = 0; y < h; y++) {
    const fade = Math.pow(Math.max(0, Math.min(1, (y / h - .6) / .4)), 1.2);
    for (let x = 0; x < w; x++) {
      // left bank drifts left, right bank drifts right, slowly breathing
      const side = x < w / 2 ? -1 : 1;
      const sx = Math.round(x - side * (8 + 8 * Math.sin(t * .12)) * (1 - Math.abs(x - w / 2) / (w / 2) * .6));
      const sy = Math.round(y + 3 * Math.sin(t * .2 + x * .02));
      const ix = Math.max(0, Math.min(w - 1, sx)), iy = Math.max(0, Math.min(h - 1, sy));
      const o = (iy * sw + ix) * 4;
      let cov = d[o] / 255; const hi = d[o + 1] / 255, sh = d[o + 2] / 255;
      const dx = x - P.x, dy = y - P.y, dd = dx * dx + dy * dy;
      if (dd < 3600) cov *= dd / 3600;  // the pointer parts the clouds
      const c = cov * (1 - fade * .6), tone = c * (.45 + .55 * sh), T = B[(y & 3) * 4 + (x & 3)];
      let col = SKY;
      if (tone * 3 > T) col = LIGHT;
      if (tone * 3 - 1 > T) col = BLUE;
      if (hi * 1.4 - .2 > T && c > .6) col = WHITE;
      if (fade > T) col = WHITE;
      const q = (y * w + x) * 4; out.data[q] = col[0]; out.data[q + 1] = col[1]; out.data[q + 2] = col[2]; out.data[q + 3] = 255;
    }
  }
  g.putImageData(out, 0, 0);
  if (!reduce) setTimeout(() => requestAnimationFrame(frame), 80);
}
// news windows pop in like typesafe's appear animation
document.querySelectorAll('.tsh .win').forEach((el, i) => { el.animate([{opacity: 0, transform: 'translateX(-50%) scale(0)'}, {opacity: 1, transform: 'translateX(-50%) scale(1)'}], {duration: reduce ? 0 : 420, delay: 250 + i * 180, easing: 'cubic-bezier(.12,.23,.5,1)', fill: 'both'}); });
})();
</script>'''
MAP = 'data:image/png;base64,' + base64.b64encode(open(os.path.join(HERE, 'out', 'cloudmap.png'), 'rb').read()).decode()
s = s.replace("html = head_extra + html + JS + EXTRA_JS", "SKY_JS = " + repr(SKY_JS.replace('__MAP__', MAP)) + "\nhtml = head_extra + html + JS + EXTRA_JS + SKY_JS")
open(os.path.join(HERE, '_tmp_live.py'), 'w').write(s)
exec(compile(s, 'build_sky_ts_live', 'exec'), {'__file__': os.path.join(HERE, 'build_sky_live.py'), '__name__': '__main__'})

"""Motion version: hero object cycles d1 -> d2 -> d4 -> d3 on the crosshair, coordinates follow the cursor,
claim rows react on hover. Reads dc_inline.html, writes live/skyfall-decart-live.html."""
import os, re, base64
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'dc_inline.html')).read()
uri = lambda n: 'data:image/png;base64,' + base64.b64encode(open(os.path.join(HERE, 'out', n), 'rb').read()).decode()
seq = ['d1.png', 'd2.png', 'd4.png', 'd3.png']
imgs = ''.join(f'<img class="st{" on" if i == 0 else ""}" src="{uri(n)}"/>' for i, n in enumerate(seq))
s, n = re.subn(r'<div class="obj" id="heroobj"><img src="[^"]+"/></div>', f'<div class="obj" id="heroobj">{imgs}</div>', s)
assert n == 1
css = """<style>
.hero .obj img.st{opacity:0;transform:translateY(14px) scale(.97);transition:opacity 1.1s ease,transform 1.4s cubic-bezier(.2,.7,.2,1)}
.hero .obj img.st.on{opacity:1;transform:none}
.row{transition:background .4s ease}
.row .ob img{transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.row h3{transition:color .3s ease}
.row:hover{background:#E6EBFA}
.hero .rd{z-index:3;pointer-events:none}
.row:hover .ob img{transform:translateY(-8px) scale(1.05)}
.row:hover h3{color:#3E57DA}
@media (prefers-reduced-motion: reduce){.hero .obj img.st{transition:none}}
</style>"""
js = """<script>
(function(){
const st=[...document.querySelectorAll('#heroobj img.st')]; let i=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce) setInterval(()=>{st[i].classList.remove('on'); i=(i+1)%st.length; st[i].classList.add('on');},3200);
const hero=document.getElementById('s1'), c=document.getElementById('coord');
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();
  c.textContent='(X '+((e.clientX-r.left)/r.width*180).toFixed(1)+', Y '+((e.clientY-r.top)/r.height*90).toFixed(1)+')';
  c.style.left=Math.min(r.width-180,e.clientX-r.left+18)+'px'; c.style.top=(e.clientY-r.top+18)+'px';});
hero.addEventListener('pointerleave',()=>{c.style.left='';c.style.top='';c.textContent='(X 107.0, Y 41.0)';});
})();
</script>"""
s = s.replace('</head>', css + '</head>', 1).replace('</body>', js + '</body>', 1)
out = os.path.join(HERE, 'live', 'skyfall-decart-live.html'); open(out, 'w').write(s); print(out, len(s))

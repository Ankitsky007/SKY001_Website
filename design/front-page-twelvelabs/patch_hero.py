from PIL import Image
import re
Image.open('out/bloom.png').convert('RGB').crop((690,240,1130,487)).save('out/card.jpg',quality=88)
p='build_tl.py'; s=open(p).read()
a=s.index('<div class="dark">'); b=s.index('<section class="sec mis"')
s=s[:a]+'''<div class="dark herox" id="s1">
<img class="field" id="fieldimg" src="{g('field.jpg')}"/>
<div class="veil"></div>
<nav><span class="logo">{LW}</span><div class="links"><span>Research <i>⌄</i></span><span>SKY-001 <i>⌄</i></span><span>Team</span><span>Company <i>⌄</i></span></div>
  <div class="r"><span class="nl">Contact</span><span class="pb w sm">Read the research</span><span class="pb o sm">Work with us</span></div></nav>
<div class="t"><h1>Autonomous Business for the Post-Monolithic Era</h1>
  <p class="sub">We're enabling the future where an entire business can operate autonomously.</p>
  <div class="acts"><span class="pb w">Read the research <b>↗</b></span><span class="pb o">Meet SKY-001 <b>↗</b></span></div></div>
<div class="card"><div class="cm"><img src="{g('card.jpg')}"/><div class="pr"><span>Design a lighter differential for the E-Type</span><b>↗</b></div></div>
  <div class="ct"><span class="rp">Research preview</span><p>Meet SKY-001, the first world model for the engineered world</p></div></div>
<p class="note">E-Type windows are a demo asset, not SKY-001 output.</p>
</div>
'''+s[b:]
s=re.sub(r"\.ann\{\{.*?\n|\.ann span\{\{.*?\n|\.ann b\{\{.*?\n|\.ann i\{\{.*?\n|\.gline\{\{.*?\n|\.hero[^\n]*\n","",s)
s=s.replace("nav{{height:76px;display:flex;align-items:center;padding:0 64px;position:relative}}","nav{{height:72px;display:flex;align-items:center;padding:0 64px;position:relative;z-index:3;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(7,8,10,.55)}}")
s=s.replace("nav .r{{margin-left:auto;display:flex;gap:10px}}", open('hero.css').read())
s=s.replace(".pb{{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:999px;",".pb{{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 20px;border-radius:10px;")
old='<div class="fc">Cost, speed, and quality no longer have to be traded against each other. Illustrative, not benchmark data.</div>'
assert old in s
s=s.replace(old,'<div class="fc"><span class="lg"><i style="background:#3E57DA"></i>Engineering World Models</span><span class="lg"><i class="dash"></i>Today’s frontier</span><br/>Cost, speed, and quality no longer have to be traded against each other. Illustrative, not benchmark data.</div>')
s=s.replace(".fig .fc{{",".lg{{display:inline-flex;align-items:center;gap:8px;margin:0 20px 8px 0;color:{INK};font-size:13px}} .lg i{{width:18px;height:3px;border-radius:2px;display:inline-block}} .lg i.dash{{background:repeating-linear-gradient(90deg,#9A9CA4 0 5px,transparent 5px 9px)}}\n.fig .fc{{",1)
open(p,'w').write(s)

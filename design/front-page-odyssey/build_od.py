"""Skyfall front page, Odyssey-inspired version (desktop 1440).
Dark framed centre column, cinematic studio imagery (Higgsfield placeholders), CAD centre-mark dividers,
blue arrow buttons, image-led model cards. Geist + Geist Mono only.
Usage: python3 build_od.py [--inline] -> od.html or od_inline.html"""
import re, sys, base64, os, io
HERE = os.path.dirname(os.path.abspath(__file__))
INLINE = '--inline' in sys.argv
FONTS = '/tmp/claude-0/sp/package/dist/fonts/'
TEAM = '/mnt/project-files/brand/team-portraits/final/'

def uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()
def g(name):
    p = os.path.join(HERE, 'out', name)
    return uri(p, 'image/jpeg') if INLINE else 'out/' + name
def portrait(name):
    p = TEAM + name
    if INLINE:
        from PIL import Image
        im = Image.open(p).convert('RGB'); im.thumbnail((800, 800))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=84)
        return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    return 'file://' + p
def font(rel):
    return uri(FONTS + rel, 'font/woff2') if INLINE else 'file://' + FONTS + rel

LOGO = re.sub(r'<metadata>.*?</metadata>', '', open('/mnt/project-files/brand/logo/skyfall_logo_white.svg').read(), flags=re.S)
LOGO = re.sub(r'<\?xml.*?\?>', '', LOGO)
LOGO = re.sub(r'width="[\d.]+" height="[\d.]+"', 'width="100%" height="100%" preserveAspectRatio="xMinYMid meet"', LOGO, count=1)

BG, COLBG, LINE, W1, W2, W3, BLUE, CARD = '#0a0a0b', '#0e0e10', 'rgba(255,255,255,.09)', '#f3f3f4', '#a3a3ad', '#6f6f7a', '#3E57DA', '#141417'
CW = 1104  # centre column

CSS = f"""
@font-face{{font-family:'Geist';font-weight:300;src:url({font('geist-sans/Geist-Light.woff2')})}}
@font-face{{font-family:'Geist';font-weight:400;src:url({font('geist-sans/Geist-Regular.woff2')})}}
@font-face{{font-family:'Geist';font-weight:500;src:url({font('geist-sans/Geist-Medium.woff2')})}}
@font-face{{font-family:'Geist Mono';font-weight:400;src:url({font('geist-mono/GeistMono-Regular.woff2')})}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#222;font-family:'Geist',sans-serif;color:{W1};-webkit-font-smoothing:antialiased}}
.f{{width:1440px;background:{BG};margin:0 auto;position:relative;overflow:hidden}}
img{{display:block}}
.col{{width:{CW}px;margin:0 auto;background:{COLBG};border-left:1px solid {LINE};border-right:1px solid {LINE};position:relative}}
nav{{height:72px;border-bottom:1px solid {LINE};display:flex;align-items:center;padding:0 32px;position:relative}}
nav .logo{{width:150px;height:19px}}
nav .links{{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:28px;font-size:14px;color:{W2}}}
nav .btn{{margin-left:auto}}
.btn{{display:inline-flex;align-items:center;gap:14px;height:38px;padding:0 4px 0 14px;background:{BLUE};color:#fff;font-size:14px;font-weight:500}}
.btn .a{{width:30px;height:30px;background:#fff;color:{BLUE};display:inline-flex;align-items:center;justify-content:center;font-size:15px}}
.btn.l{{background:#e8e8ea;color:#111;padding-right:14px}}
.btn.l .a{{background:transparent;color:#111;width:auto}}
.disp{{font-weight:300;letter-spacing:-.035em;line-height:1.04}}
.hero{{height:760px;position:relative;overflow:hidden;border-bottom:1px solid {LINE}}}
.hero>img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.hero .fade{{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(rgba(14,14,16,0),{COLBG} 92%)}}
.hero .t{{position:absolute;left:0;right:0;bottom:64px;text-align:center}}
.hero h1{{font-size:76px}}
.hero p{{font-size:18px;color:{W2};max-width:620px;margin:20px auto 0;line-height:1.45}}
.hero .acts{{display:flex;gap:12px;justify-content:center;margin-top:30px}}
.orn{{height:56px;border-bottom:1px solid {LINE};display:flex;align-items:center;justify-content:center}}
.pill{{display:flex;justify-content:center;padding:36px 0}}
.pill span{{display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,.18);font-size:14px;height:34px}}
.pill b{{font-weight:500;padding:0 12px;border-right:1px solid rgba(255,255,255,.18);height:100%;display:flex;align-items:center}}
.pill i{{font-style:normal;padding:0 14px;color:{W2}}}
section{{padding:112px 72px 0;position:relative}}
.ctr{{text-align:center}}
.ctr h2{{font-size:56px;max-width:900px;margin:0 auto}}
.ctr .sub{{font-size:19px;color:{W2};line-height:1.5;max-width:700px;margin:22px auto 0}}
.cap{{font-family:'Geist Mono';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:{BLUE}}}
.big{{margin-top:64px;border:1px solid {LINE};overflow:hidden}}
.big img{{width:100%;height:540px;object-fit:cover}}
.two{{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:56px}}
.two p{{font-size:17px;line-height:1.6;color:{W2}}}
.figs{{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:56px}}
.fig{{background:{CARD};border:1px solid {LINE};padding:28px 28px 24px}}
.fig .fc{{font-size:13px;color:{W3};margin-top:14px;line-height:1.45}}
.grid4{{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:56px}}
.c4{{background:{CARD};border:1px solid {LINE}}}
.c4 .tx{{padding:26px 28px 22px}}
.c4 h3{{font-size:24px;font-weight:300;letter-spacing:-.02em}}
.c4 p{{font-size:15px;color:{W2};margin-top:8px;line-height:1.45}}
.c4 img{{width:100%;height:200px;object-fit:cover}}
.tags{{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:40px}}
.tags span{{border:1px solid rgba(255,255,255,.18);padding:9px 16px;font-size:14px;color:{W1}}}
.dream{{height:640px;position:relative;margin-top:112px;background:#000;border-top:1px solid {LINE};border-bottom:1px solid {LINE};overflow:hidden}}
.dream .rk{{position:absolute;top:0;height:100%;width:340px;object-fit:cover}}
.dream .t{{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center}}
.dream h2{{font-size:46px;max-width:620px;margin:0 auto}}
.dream h2 span{{color:{W3}}}
.dream p{{font-size:17px;color:{W2};margin:24px auto 0;max-width:420px;line-height:1.5}}
.marks{{display:grid;border-top:1px solid {LINE};border-left:1px solid {LINE};margin-top:36px}}
.marks span{{height:92px;display:flex;align-items:center;justify-content:center;border-right:1px solid {LINE};border-bottom:1px solid {LINE};font-size:19px;font-weight:500;letter-spacing:-.01em;color:{W2}}}
.lbl{{text-align:center;font-size:15px;color:{W2}}}
.models{{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:56px}}
.m{{position:relative;height:440px;border:1px solid {LINE};overflow:hidden;background:#000}}
.m img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.m .sh{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.72),rgba(0,0,0,.1) 55%,rgba(0,0,0,.55))}}
.m .tx{{position:absolute;left:28px;top:26px;right:28px}}
.m h3{{font-size:38px;font-weight:300;letter-spacing:-.03em;margin-top:8px}}
.m p{{font-size:15px;color:#d0d0d6;margin-top:10px;line-height:1.45;max-width:330px}}
.m .acts{{position:absolute;left:28px;bottom:26px;display:flex;gap:10px}}
.team{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:56px}}
.team .p{{background:{CARD};border:1px solid {LINE}}}
.team img{{width:100%;height:400px;object-fit:cover}}
.team .tx{{padding:20px 22px 22px}}
.team h3{{font-size:20px;font-weight:400}}
.team p{{font-size:14px;color:{W2};margin-top:4px}}
.stats{{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid {LINE};margin-top:56px}}
.stats div{{padding:36px 8px 0}}
.stats b{{display:block;font-size:72px;font-weight:300;letter-spacing:-.04em}}
.stats span{{display:block;font-size:15px;color:{W2};margin-top:10px;line-height:1.45;max-width:280px}}
.adv{{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}}
.adv div{{background:{CARD};border:1px solid {LINE};padding:26px 28px;display:flex;justify-content:space-between;align-items:center}}
.adv h3{{font-size:24px;font-weight:300}}
.adv span{{font-size:14px;color:{W2}}}
.cta{{height:620px;position:relative;margin-top:112px;border-top:1px solid {LINE};overflow:hidden}}
.cta img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.cta .sh{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,14,16,.96) 18%,rgba(14,14,16,.2) 58%,rgba(14,14,16,.6))}}
.cta .t{{position:absolute;left:0;right:0;top:56px;text-align:center}}
.cta h2{{font-size:64px}}
.cta p{{font-size:18px;color:{W2};margin-top:16px}}
.cta .acts{{display:flex;gap:12px;justify-content:center;margin-top:28px}}
.ill{{position:absolute;right:16px;bottom:14px;font-family:'Geist Mono';font-size:10px;letter-spacing:.1em;color:rgba(255,255,255,.65)}}
footer{{border-top:1px solid {LINE};display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;padding:48px 32px 40px}}
footer .h{{font-family:'Geist Mono';font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:{W3}}}
footer span{{display:block;font-size:14px;color:{W2};margin-top:12px}}
.copy{{border-top:1px solid {LINE};padding:18px 32px 22px;display:flex;justify-content:space-between;font-size:12px;color:{W3}}}
"""

def orn():
    # CAD centre-mark divider: tick ruler with a crosshair circle in the middle (our own motif)
    s = '<svg width="1040" height="24" viewBox="0 0 1040 24" xmlns="http://www.w3.org/2000/svg" fill="none">'
    s += f'<line x1="0" y1="12" x2="496" y2="12" stroke="{W3}" stroke-width="1"/><line x1="544" y1="12" x2="1040" y2="12" stroke="{W3}" stroke-width="1"/>'
    for x in range(0, 497, 16):
        h = 8 if x % 80 == 0 else 4
        s += f'<line x1="{x}" y1="{12-h/2}" x2="{x}" y2="{12+h/2}" stroke="{W3}"/><line x1="{1040-x}" y1="{12-h/2}" x2="{1040-x}" y2="{12+h/2}" stroke="{W3}"/>'
    s += f'<circle cx="520" cy="12" r="9" stroke="{W2}"/><line x1="504" y1="12" x2="536" y2="12" stroke="{W2}"/><line x1="520" y1="0" x2="520" y2="24" stroke="{W2}"/>'
    s += f'<rect x="517" y="9" width="6" height="6" fill="{BLUE}"/>'
    return s + '</svg>'

def tokens_chart():
    rows = [('Engineering World Model', 6, BLUE), ('LLM, short context', 38, '#3c3c46'), ('LLM, long context', 74, '#4d4d58'), ('LLM agent loop', 100, '#62626e')]
    s = '<svg viewBox="0 0 460 190" width="100%" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    for i, (lab, v, col) in enumerate(rows):
        y = 10 + i * 44
        s += f'<text x="0" y="{y+18}" font-size="13" fill="{W1 if i == 0 else W2}">{lab}</text>'
        s += f'<rect x="170" y="{y}" width="{v * 2.8:.0f}" height="26" fill="{col}"/>'
    return s + '</svg>'

def pareto():
    s = '<svg viewBox="0 0 460 210" width="100%" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    for i in range(4):
        y = 20 + i * 52
        s += f'<line x1="40" y1="{y}" x2="450" y2="{y}" stroke="rgba(255,255,255,.07)"/>'
    s += f'<line x1="40" y1="176" x2="450" y2="176" stroke="{W3}"/><text x="450" y="200" font-size="12" fill="{W3}" text-anchor="end">Cost per decision →</text>'
    s += f'<text x="40" y="12" font-size="12" fill="{W3}">Quality ↑</text>'
    s += '<path d="M90 166 C 170 140, 270 80, 430 62" fill="none" stroke="#4d4d58" stroke-width="2" stroke-dasharray="5 5"/>'
    for x, y, lab in [(130, 152, 'Human teams'), (240, 104, 'LLM agents'), (380, 68, 'Frontier LLMs')]:
        s += f'<rect x="{x-5}" y="{y-5}" width="10" height="10" fill="#4d4d58"/><text x="{x+10}" y="{y+20}" font-size="12" fill="{W2}">{lab}</text>'
    s += f'<path d="M46 120 C 66 60, 120 34, 250 26" fill="none" stroke="{BLUE}" stroke-width="3"/>'
    s += f'<rect x="72" y="58" width="12" height="12" fill="{BLUE}"/><text x="92" y="52" font-size="13" font-weight="500" fill="{W1}">Engineering World Models</text>'
    return s + '</svg>'

A = '<span class="a">→</span>'
def page():
    return f'''<div class="f" data-name="Skyfall Front Page · Odyssey style · Desktop 1440"><div class="col">
<nav><span class="logo">{LOGO}</span><div class="links"><span>Research</span><span>SKY-001</span><span>Team</span><span>Careers</span><span>Contact</span></div><span class="btn">Read the research {A}</span></nav>
<div class="hero" id="s1"><img src="{g('o0.jpg')}"/><div class="fade"></div>
  <div class="t"><h1 class="disp">Autonomous Business<br/>for the Post-Monolithic Era</h1>
  <p>We're enabling the future where an entire business can operate autonomously.</p>
  <div class="acts"><span class="btn l">Our mission <span class="a">→</span></span><span class="btn">Meet SKY-001 {A}</span></div></div></div>
<div class="orn">{orn()}</div>
<div class="pill"><span><b>SKY-001</b><i>The first world model for the engineered world →</i></span></div>
<section id="s2" style="padding-top:72px"><div class="ctr"><div class="cap">Our mission</div><h2 class="disp" style="margin-top:20px;font-size:48px;max-width:860px">Our mission is to build the foundation infrastructure for autonomous enterprise through Engineering World Models.</h2></div></section>
<section id="s3"><div class="ctr"><h2 class="disp">Enterprise work is long horizon, constrained and always evolving.</h2>
  <p class="sub">A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.</p></div>
  <div class="big"><img src="{g('o2.jpg')}"/></div>
  <div class="two"><p>Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.</p>
  <p>Much of what a business knows is however never written down. Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.</p></div>
  <div class="figs"><div class="fig"><div class="cap" style="margin-bottom:22px">Fig. 01 · Tokens per decision</div>{tokens_chart()}<div class="fc">Tokens burned per enterprise decision. Illustrative, not measured.</div></div>
  <div class="fig"><div class="cap" style="margin-bottom:8px">Fig. 02 · A new Pareto frontier</div>{pareto()}<div class="fc">Cost, speed, and quality no longer have to be traded against each other. Illustrative, not benchmark data.</div></div></div>
</section>
<section id="s4"><div class="ctr"><div class="cap">Research</div><h2 class="disp" style="margin-top:20px">AI for the Engineered World</h2>
  <p class="sub">Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations.</p></div>
  <div class="big"><img src="{g('o7.jpg')}"/></div>
  <div class="grid4">
    <div class="c4"><div class="tx"><h3>Learn</h3><p>The latent space of an enterprise across every core function.</p></div><img src="{g('o3.jpg')}"/></div>
    <div class="c4"><div class="tx"><h3>Simulate</h3><p>Cause-and-effect relationships between functions.</p></div><img src="{g('o4.jpg')}"/></div>
    <div class="c4"><div class="tx"><h3>Plan</h3><p>Over long horizons, to accomplish highly complex tasks.</p></div><img src="{g('o5.jpg')}"/></div>
    <div class="c4"><div class="tx"><h3>Guard</h3><p>Every plan stays subject to safety guardrails.</p></div><img src="{g('o6.jpg')}"/></div>
  </div>
  <div class="ctr" style="margin-top:96px"><h2 class="disp" style="font-size:44px">Built for the engineered world</h2>
  <p class="sub">Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.</p></div>
  <div class="tags"><span>Industrial</span><span>Healthcare</span><span>Chemical</span><span>Enterprise</span><span>Design</span><span>Engineering</span><span>Operations</span><span>And beyond</span></div>
</section>
<div class="dream" id="s5"><img class="rk" src="{g('o1.jpg')}" style="left:0"/><img class="rk" src="{g('o1f.jpg')}" style="right:0"/>
  <div class="t"><h2 class="disp">With world models, AI systems can ‘dream’ <span>what a successful business requires, and then execute it.</span></h2>
  <p>We are building the foundation infrastructure for the software that powers enterprises.</p></div></div>
<section id="s6" style="padding-top:96px"><div class="ctr"><h2 class="disp" style="font-size:48px">Research and models</h2></div>
  <div class="models">
    <div class="m"><img src="{g('o8.jpg')}"/><div class="sh"></div><div class="tx"><div class="cap">World model</div><h3>SKY-001</h3><p>The first world model for the engineered world. From a prompt to parts, 3D CAD, BIM floor plans and buildings.</p></div><div class="acts"><span class="btn l">Learn more <span class="a">→</span></span><span class="btn">Technical report {A}</span></div></div>
    <div class="m"><img src="{g('o9.jpg')}"/><div class="sh"></div><div class="tx"><div class="cap">Research</div><h3>Engineering World Models</h3><p>Why next-token prediction does not transfer to the enterprise, and what does.</p></div><div class="acts"><span class="btn l">Read the essay <span class="a">→</span></span></div></div>
    <div class="m"><img src="{g('o10.jpg')}"/><div class="sh"></div><div class="tx"><div class="cap">Research</div><h3>A new Pareto frontier</h3><p>Exploring far more of the solution space than any human team or language model can.</p></div><div class="acts"><span class="btn l">Learn more <span class="a">→</span></span></div></div>
    <div class="m"><img src="{g('o11.jpg')}"/><div class="sh"></div><div class="tx"><div class="cap">Company</div><h3>From Maluuba to Skyfall AI</h3><p>A world class AI Research team of 25 across three countries.</p></div><div class="acts"><span class="btn l">Meet the team <span class="a">→</span></span></div></div>
  </div></section>
<section id="s7"><div class="ctr"><div class="cap">Founding team</div><h2 class="disp" style="margin-top:20px;font-size:48px">Founded by early pioneers of deep learning</h2>
  <p class="sub" style="max-width:820px">Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.</p></div>
  <div class="team">
    <div class="p"><img src="{portrait('sam.jpg')}"/><div class="tx"><h3>Sam Pasupalak</h3><p>Co-founder · co-founded Maluuba</p></div></div>
    <div class="p"><img src="{portrait('kaheer.jpg')}"/><div class="tx"><h3>Kaheer Suleman</h3><p>Co-founder · co-founded Maluuba</p></div></div>
    <div class="p"><img src="{portrait('sumit.jpg')}"/><div class="tx"><h3>Sumit Pasupalak</h3><p>Co-founder · co-founded Ubiq (YC)</p></div></div>
  </div>
  <div class="stats"><div><b>30+</b><span>years of combined experience across business, product, and AI research</span></div><div><b>25</b><span>engineers and researchers in a world class AI Research team</span></div><div><b>3</b><span>countries, and now shaping the next era of AI</span></div></div>
</section>
<section id="s8"><p class="lbl">Our teams bring experience from</p>
  <div class="marks" style="grid-template-columns:repeat(6,1fr)"><span>Maluuba</span><span>Microsoft</span><span>Waterloo</span><span>Y Combinator</span><span>MILA</span><span>Vector</span></div>
  <p class="lbl" style="margin-top:72px">We're backed by</p>
  <div class="marks" style="grid-template-columns:repeat(4,1fr)"><span>Fidelity</span><span>Touring Capital</span><span>M13</span><span>Inovia Capital</span></div>
  <div class="adv"><div><h3>François Chollet</h3><span>Advisor · Google · Keras · NDEA</span></div><div><h3>Naveen Rao</h3><span>Advisor · Intel · Databricks</span></div></div>
</section>
<div class="cta" id="s9"><img src="{g('o12.jpg')}"/><div class="sh"></div>
  <div class="t"><h2 class="disp">Build the autonomous enterprise</h2><p>Join a world class AI Research team across three countries.</p>
  <div class="acts"><span class="btn l">Contact us <span class="a">→</span></span><span class="btn">See open roles {A}</span></div></div>
  <div class="ill">ILLUSTRATIVE IMAGERY · GENERATED</div></div>
<footer><div><span class="logo" style="display:block;width:170px;height:21px;margin:0">{LOGO}</span><span style="margin-top:20px">Engineering World Models for the autonomous enterprise.</span></div>
  <div><div class="h">Company</div><span>About</span><span>Team</span><span>Contact</span></div>
  <div><div class="h">Research</div><span>SKY-001</span><span>Technical report</span><span>Essays</span></div>
  <div><div class="h">Information</div><span>Careers</span><span>Privacy Policy</span><span>Terms of Service</span></div></footer>
<div class="copy"><span>© 2026 SKYFALL AI. ALL RIGHTS RESERVED.</span><span>X · LinkedIn</span></div>
</div></div>'''

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall Front Page · Odyssey style</title><style>{CSS}</style></head><body>{page()}</body></html>'
out = os.path.join(HERE, 'od_inline.html' if INLINE else 'od.html')
open(out, 'w').write(html)
print(out, len(html))

"""Skyfall front page, General Intuition-inspired version (desktop 1440).
Black page on a visible 8-column grid, footage rendered as ASCII mosaics (ascii.py), white text cards, square buttons.
Usage: python3 build_gi.py [--inline]  -> gi.html (relative assets) or gi_inline.html (everything as data URIs)."""
import re, sys, base64, os
HERE = os.path.dirname(os.path.abspath(__file__))
INLINE = '--inline' in sys.argv
FONTS = '/tmp/claude-0/sp/package/dist/fonts/'
TEAM = '/mnt/project-files/brand/team-portraits/final/'

def uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

def img(name):
    p = os.path.join(HERE, 'out', name)
    return uri(p, 'image/jpeg') if INLINE else 'out/' + name

def portrait(name):
    p = TEAM + name
    if INLINE:
        from PIL import Image
        import io
        im = Image.open(p).convert('RGB'); im.thumbnail((900, 900))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=84)
        return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    return 'file://' + p

def font(rel):
    return uri(FONTS + rel, 'font/woff2') if INLINE else 'file://' + FONTS + rel

LOGO = re.sub(r'<metadata>.*?</metadata>', '', open('/mnt/project-files/brand/logo/skyfall_logo_white.svg').read(), flags=re.S)
LOGO = re.sub(r'<\?xml.*?\?>', '', LOGO)
LOGO = re.sub(r'width="[\d.]+" height="[\d.]+"', 'width="100%" height="100%" preserveAspectRatio="xMinYMid meet"', LOGO, count=1)

BG, LINE, W1, W2, W3, BLUE = '#050507', 'rgba(255,255,255,.14)', '#ffffff', '#b4b4c0', '#7c7c8a', '#3E57DA'
M, COL = 64, 164  # grid: 64px margins, 8 columns of 164px

CSS = f"""
@font-face{{font-family:'Geist';font-weight:300;src:url({font('geist-sans/Geist-Light.woff2')})}}
@font-face{{font-family:'Geist';font-weight:400;src:url({font('geist-sans/Geist-Regular.woff2')})}}
@font-face{{font-family:'Geist';font-weight:500;src:url({font('geist-sans/Geist-Medium.woff2')})}}
@font-face{{font-family:'Geist Mono';font-weight:400;src:url({font('geist-mono/GeistMono-Regular.woff2')})}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#222;font-family:'Geist',sans-serif;color:{W1};-webkit-font-smoothing:antialiased}}
.f{{width:1440px;background:{BG};margin:0 auto;position:relative;overflow:hidden}}
img{{display:block}}
.vl{{position:absolute;top:0;bottom:0;width:1px;background:{LINE};z-index:3;pointer-events:none}}
.row{{position:relative;border-top:1px solid {LINE};margin:0 {M}px}}
.full{{position:relative;border-top:1px solid {LINE}}}
.mono{{font-family:'Geist Mono';font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:{W3}}}
.btn{{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;background:#fff;color:#000;font-size:15px;font-weight:500}}
.btn.k{{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)}}
h2{{font-weight:400;font-size:40px;line-height:1.12;letter-spacing:-.025em}}
p{{font-size:19px;line-height:1.5;color:{W2}}}
.hero{{height:900px;position:relative}}
.hero>img{{position:absolute;inset:0;width:100%;height:100%}}
.hero .shade{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,5,7,.55),rgba(5,5,7,0) 30%,rgba(5,5,7,0) 60%,rgba(5,5,7,.9))}}
.hero .logo{{position:absolute;left:{M+24}px;top:44px;width:420px;height:52px;z-index:4}}
.hero .top{{position:absolute;right:{M+24}px;top:48px;z-index:4;display:flex;gap:12px}}
.hero .card{{position:absolute;left:{M}px;bottom:96px;width:{COL*4}px;background:#fff;color:#000;padding:40px 40px 36px;z-index:4}}
.hero .card h1{{font-weight:400;font-size:44px;line-height:1.06;letter-spacing:-.03em}}
.hero .card p{{color:#3a3a44;font-size:18px;margin-top:20px;line-height:1.45}}
.hero .card .inv{{display:flex;gap:22px;margin-top:30px;padding-top:20px;border-top:1px solid #e4e4ea;font-size:15px;font-weight:500;color:#111;letter-spacing:-.01em}}
.hero .card .inv span:first-child{{font-family:'Geist Mono';font-weight:400;font-size:11px;letter-spacing:.08em;color:#7c7c8a;text-transform:uppercase;align-self:center}}
.ascset{{position:absolute;right:{M}px;bottom:96px;z-index:4;width:{COL*2}px;background:rgba(5,5,7,.82);border:1px solid {LINE};padding:16px 18px;font-family:'Geist Mono';font-size:11px;letter-spacing:.06em;color:{W2}}}
.ascset div{{display:flex;justify-content:space-between;padding:5px 0}}
.ascset b{{font-weight:400;color:#fff}}
.links{{display:grid;grid-template-columns:repeat(4,1fr)}}
.links div{{height:76px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;font-size:17px;border-right:1px solid {LINE}}}
.links div:last-child{{border-right:0}}
.links i{{font-style:normal;color:{W3};font-size:15px}}
.split{{display:grid;grid-template-columns:{COL*4}px {COL*4}px}}
.split .txt{{padding:56px 48px;display:flex;flex-direction:column}}
.split .txt p{{margin-top:22px}}
.split .txt .acts{{margin-top:auto;padding-top:36px;display:flex;gap:12px}}
.sect-h{{display:grid;grid-template-columns:{COL*4}px {COL*4}px;padding:88px 0 72px}}
.sect-h>*{{padding-left:24px;padding-right:48px}}
.sect-h h2.m{{font-size:44px;line-height:1.1}}
.sect-h h2{{font-size:56px;line-height:1.04;letter-spacing:-.035em}}
.sect-h p{{padding-top:8px}}
.cells4{{display:grid;grid-template-columns:repeat(4,1fr)}}
.cells4>div{{border-right:1px solid {LINE};padding:28px 24px 32px}}
.cells4>div:last-child{{border-right:0}}
.cells4 h3{{font-size:22px;font-weight:400;letter-spacing:-.02em;margin-top:14px}}
.cells4 p{{font-size:16px;margin-top:10px;line-height:1.45}}
.quote{{padding:56px 48px;display:flex;flex-direction:column}}
.quote blockquote{{font-size:30px;line-height:1.3;letter-spacing:-.02em;color:#fff}}
.quote .qm{{font-size:120px;line-height:.6;color:{W3};font-family:'Geist';margin-top:auto;align-self:flex-end;height:60px}}
.quote .by{{margin-top:28px;font-size:14px;color:{W3}}}
.quote .by b{{display:block;color:#fff;font-weight:500;margin-top:6px}}
.marks{{display:grid}}
.marks span{{height:96px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:500;letter-spacing:-.02em;border-right:1px solid {LINE}}}
.marks span:last-child{{border-right:0}}
.sectors{{display:grid;grid-template-columns:repeat(4,{COL*2}px)}}
.sectors>div{{border-right:1px solid {LINE}}}
.sectors>div:last-child{{border-right:0}}
.sectors img{{width:{COL*2}px;height:{COL*2}px}}
.sectors .lab{{padding:22px 24px 28px;border-top:1px solid {LINE}}}
.sectors h3{{font-size:22px;font-weight:400;letter-spacing:-.02em;margin-top:10px;line-height:1.2}}
.team{{display:grid;grid-template-columns:repeat(3,1fr)}}
.team>div{{border-right:1px solid {LINE}}}
.team>div:last-child{{border-right:0}}
.team img{{width:100%;height:520px;object-fit:cover;filter:grayscale(1) contrast(1.05)}}
.team .lab{{padding:22px 24px 28px;border-top:1px solid {LINE}}}
.team h3{{font-size:22px;font-weight:400;letter-spacing:-.02em}}
.team .lab p{{font-size:15px;margin-top:6px}}
.stats{{display:grid;grid-template-columns:repeat(3,1fr)}}
.stats>div{{padding:40px 24px 44px;border-right:1px solid {LINE}}}
.stats>div:last-child{{border-right:0}}
.stats b{{display:block;font-weight:300;font-size:96px;letter-spacing:-.05em;line-height:1}}
.stats span{{display:block;font-size:16px;color:{W2};margin-top:16px;line-height:1.45;max-width:340px}}
.chart{{padding:40px 48px 36px}}
.cap{{font-size:13px;color:{W3};margin-top:16px;line-height:1.45}}
.work{{display:grid;grid-template-columns:repeat(3,1fr)}}
.work>div{{border-right:1px solid {LINE};padding:36px 32px 40px;display:flex;flex-direction:column;min-height:330px}}
.work>div:last-child{{border-right:0}}
.work h3{{font-size:28px;font-weight:400;letter-spacing:-.02em}}
.work p{{font-size:16px;margin-top:14px}}
.work .b{{margin-top:auto;padding-top:28px}}
.work li{{list-style:none;display:flex;justify-content:space-between;padding:14px 0;border-top:1px solid {LINE};font-size:16px}}
.work li i{{font-style:normal;color:{W3};font-family:'Geist Mono';font-size:12px;letter-spacing:.06em}}
.cta{{height:640px;position:relative}}
.cta>img{{position:absolute;inset:0;width:100%;height:100%}}
.cta .card{{position:absolute;left:{M}px;top:120px;width:{COL*4}px;background:#fff;color:#000;padding:40px;z-index:4}}
.cta .card h3{{font-size:34px;font-weight:400;letter-spacing:-.025em;line-height:1.12}}
.cta .card p{{color:#3a3a44;font-size:17px;margin-top:16px}}
.cta .card .btn{{background:#000;color:#fff;margin-top:28px}}
.ill{{position:absolute;right:{M+16}px;bottom:16px;z-index:4;font-family:'Geist Mono';font-size:10px;letter-spacing:.1em;color:rgba(255,255,255,.7);background:rgba(5,5,7,.6);padding:4px 7px}}
footer .cols{{display:grid;grid-template-columns:repeat(4,{COL*2}px)}}
footer .cols>div{{padding:36px 24px 44px;border-right:1px solid {LINE}}}
footer .cols>div:last-child{{border-right:0}}
footer .cols span{{display:block;font-size:15px;color:{W2};margin-top:12px}}
footer .big{{height:{COL}px;display:flex;align-items:center;padding:0 24px}}
footer .big .logo{{width:640px;height:80px}}
footer .copy{{display:flex;justify-content:space-between;padding:20px 24px 28px;font-size:13px;color:{W3}}}
"""

AX, GRID, LBL, INK = '#7c7c8a', 'rgba(255,255,255,.07)', '#b4b4c0', '#ffffff'  # dark-page axis colours
def tokens_chart():
    # horizontal bars, relative tokens per decision (agent loop = 100), x axis with ticks and title
    W, H, L, R, T, B = 560, 290, 196, 34, 8, 58
    pw = W - L - R
    rows = [('Engineering World Model', 6, BLUE), ('LLM, short context', 38, '#4a4a58'), ('LLM, long context', 74, '#5d5d6c'), ('LLM agent loop', 100, '#727282')]
    bh, gap = 30, 22
    ph = len(rows) * bh + (len(rows) + 1) * gap
    s = f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    x0, y0 = L, T + ph
    for v in range(0, 101, 25):
        x = x0 + pw * v / 100
        s += f'<line x1="{x:.1f}" y1="{T}" x2="{x:.1f}" y2="{y0}" stroke="{GRID}"/>'
        s += f'<line x1="{x:.1f}" y1="{y0}" x2="{x:.1f}" y2="{y0+5}" stroke="{AX}"/>'
        s += f'<text x="{x:.1f}" y="{y0+20}" font-size="12" fill="{LBL}" text-anchor="middle">{v}</text>'
    s += f'<line x1="{x0}" y1="{T}" x2="{x0}" y2="{y0}" stroke="{AX}"/><line x1="{x0}" y1="{y0}" x2="{x0+pw}" y2="{y0}" stroke="{AX}"/>'
    for i, (lab, v, col) in enumerate(rows):
        y = T + gap + i * (bh + gap)
        w = pw * v / 100
        s += f'<text x="{x0-14}" y="{y+bh/2+5}" font-size="14" fill="{INK if i == 0 else LBL}" text-anchor="end"{" font-weight=\"500\"" if i == 0 else ""}>{lab}</text>'
        s += f'<rect x="{x0}" y="{y}" width="{w:.1f}" height="{bh}" rx="3" fill="{col}"/>'
        s += f'<text x="{x0+w+8:.1f}" y="{y+bh/2+5}" font-size="13" fill="{INK}" font-family="Geist Mono">{v}</text>'
    s += f'<text x="{x0+pw/2:.0f}" y="{y0+46}" font-size="12" fill="{LBL}" text-anchor="middle">Tokens per decision, relative (LLM agent loop = 100)</text>'
    return s + '</svg>'

def pareto():
    # quality vs cost; dashed grey = today's frontier through three systems; blue = Engineering World Models
    W, H, L, R, T, B = 560, 300, 58, 16, 14, 58
    pw, ph = W - L - R, H - T - B
    X = lambda u: L + pw * u
    Y = lambda v: T + ph * (1 - v)
    s = f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    s += f'<defs><marker id="ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="{AX}"/></marker></defs>'
    for v in (.25, .5, .75):
        s += f'<line x1="{L}" y1="{Y(v):.1f}" x2="{L+pw}" y2="{Y(v):.1f}" stroke="{GRID}"/>'
        s += f'<line x1="{X(v):.1f}" y1="{T}" x2="{X(v):.1f}" y2="{T+ph}" stroke="{GRID}"/>'
    for v in (0, .25, .5, .75, 1):
        s += f'<line x1="{X(v):.1f}" y1="{T+ph}" x2="{X(v):.1f}" y2="{T+ph+5}" stroke="{AX}"/><line x1="{L-5}" y1="{Y(v):.1f}" x2="{L}" y2="{Y(v):.1f}" stroke="{AX}"/>'
    s += f'<line x1="{L}" y1="{T+ph}" x2="{L+pw}" y2="{T+ph}" stroke="{AX}" marker-end="url(#ah)"/>'
    s += f'<line x1="{L}" y1="{T+ph}" x2="{L}" y2="{T}" stroke="{AX}" marker-end="url(#ah)"/>'
    s += f'<text x="{X(0)}" y="{T+ph+20}" font-size="12" fill="{LBL}" text-anchor="middle">Low</text><text x="{X(1)}" y="{T+ph+20}" font-size="12" fill="{LBL}" text-anchor="end">High</text>'
    s += f'<text x="{L+pw/2:.0f}" y="{H-12}" font-size="12" fill="{LBL}" text-anchor="middle">Cost per decision</text>'
    s += f'<text x="{L-12}" y="{Y(0)+4:.1f}" font-size="12" fill="{LBL}" text-anchor="end">Low</text><text x="{L-12}" y="{Y(1)+8:.1f}" font-size="12" fill="{LBL}" text-anchor="end">High</text>'
    s += f'<text transform="translate(16 {T+ph/2:.0f}) rotate(-90)" font-size="12" fill="{LBL}" text-anchor="middle">Quality</text>'
    pts = [(.18, .22, 'Human teams', 1), (.5, .5, 'LLM agents', 1), (.86, .7, 'Frontier LLMs', 0)]
    s += f'<path d="M{X(.06):.1f} {Y(.1):.1f} C {X(.3):.1f} {Y(.36):.1f}, {X(.6):.1f} {Y(.6):.1f}, {X(.98):.1f} {Y(.74):.1f}" fill="none" stroke="#5d5d6c" stroke-width="2" stroke-dasharray="5 5"/>'
    for u, v, lab, below in pts:
        s += f'<circle cx="{X(u):.1f}" cy="{Y(v):.1f}" r="5" fill="#8a8a98"/>'
        s += (f'<text x="{X(u)+10:.1f}" y="{Y(v)+18:.1f}" font-size="12" fill="{LBL}">{lab}</text>' if below else f'<text x="{X(u):.1f}" y="{Y(v)+22:.1f}" font-size="12" fill="{LBL}" text-anchor="middle">{lab}</text>')
    s += f'<path d="M{X(.02):.1f} {Y(.5):.1f} C {X(.08):.1f} {Y(.78):.1f}, {X(.2):.1f} {Y(.9):.1f}, {X(.5):.1f} {Y(.95):.1f}" fill="none" stroke="{BLUE}" stroke-width="3"/>'
    s += f'<text x="{X(.17):.1f}" y="{Y(.76):.1f}" font-size="13" font-weight="500" fill="{INK}">Engineering World Models</text>'
    s += f'<text x="{X(.6):.1f}" y="{Y(.84):.1f}" font-size="12" fill="{LBL}">Today\'s frontier, dashed</text>' if False else ''
    return s + '</svg>'

def lines():
    xs = [M, M + 8 * COL]
    return ''.join(f'<div class="vl" style="left:{x - (1 if i == 1 else 0)}px"></div>' for i, x in enumerate(xs))

def page():
    return f'''<div class="f" data-name="Skyfall Front Page · General Intuition style · Desktop 1440">
{lines()}
<div class="hero" id="s1"><img src="{img('a0.jpg')}"/><div class="shade"></div>
  <span class="logo">{LOGO}</span>
  <div class="top"><span class="btn k">Meet SKY-001</span><span class="btn">Read the research</span></div>
  <div class="card"><h1>Autonomous Business for the Post-Monolithic Era</h1>
    <p>We're enabling the future where an entire business can operate autonomously.</p>
    <div class="inv"><span>Backed by</span><span>Fidelity</span><span>Touring Capital</span><span>M13</span><span>Inovia Capital</span></div></div>
  <div class="ascset"><div><span>ASCII SETTINGS</span><b>×</b></div><div><span>Cell size</span><b>10</b></div><div><span>Text opacity</span><b>100</b></div><div><span>Tile opacity</span><b>80</b></div></div>
</div>
<div class="row" id="s2"><div class="links"><div>Read the research <i>↗</i></div><div>Meet SKY-001 <i>↗</i></div><div>Technical report <i>↗</i></div><div>Join the team <i>↗</i></div></div></div>
<div class="row" id="s3"><div class="split">
  <img src="{img('a1.jpg')}" style="width:{COL*4}px;height:600px"/>
  <div class="txt" style="border-left:1px solid {LINE}"><div class="mono">New · October 2026</div>
    <h2 style="margin-top:20px">Introducing SKY-001, the first world model for the engineered world.</h2>
    <p>SKY-001 turns a prompt into a hierarchical decomposition of parts, then into 3D CAD, BIM floor plans and buildings, and can imagine variations of a design in latent space.</p>
    <div class="acts"><span class="btn">Learn more</span><span class="btn k">Technical report</span></div></div>
</div></div>
<div class="row" id="s4"><div class="sect-h"><div><div class="mono" style="margin-bottom:20px">Our mission</div><h2 class="m">Our mission is to build the foundation infrastructure for autonomous enterprise through Engineering World Models.</h2></div>
  <div><p>Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations.</p>
  <p style="margin-top:22px">These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.</p></div></div>
  <div class="cells4" style="border-top:1px solid {LINE}">
    <div><div class="mono">01</div><h3>Learn</h3><p>The latent space of an enterprise across every core function.</p></div>
    <div><div class="mono">02</div><h3>Simulate</h3><p>Cause-and-effect relationships between functions.</p></div>
    <div><div class="mono">03</div><h3>Plan</h3><p>Over long horizons, toward highly complex tasks.</p></div>
    <div><div class="mono">04</div><h3>Guard</h3><p>Every plan stays subject to safety guardrails.</p></div>
  </div></div>
<div class="row" id="s5"><div class="split">
  <img src="{img('a2.jpg')}" style="width:{COL*4}px;height:560px"/>
  <div class="quote" style="border-left:1px solid {LINE}"><blockquote>With world models, AI systems can ‘dream’ what a successful business requires, and then execute it.</blockquote>
    <div class="by">Skyfall AI<b>We are building the foundation infrastructure for the software that powers enterprises.</b></div><div class="qm">”</div></div>
</div></div>
<div class="row" id="s6"><div class="marks" style="grid-template-columns:repeat(6,1fr)"><span>Maluuba</span><span>Microsoft</span><span>Waterloo</span><span>Y Combinator</span><span>MILA</span><span>Vector Institute</span></div></div>
<div class="row" id="s7"><div class="sect-h"><h2>Enterprise work is long horizon, constrained and always evolving.</h2>
  <p>A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.</p></div>
  <div class="split" style="border-top:1px solid {LINE}">
    <img src="{img('a3.jpg')}" style="width:{COL*4}px;height:640px"/>
    <div class="txt" style="border-left:1px solid {LINE}">
      <p style="margin-top:0">Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.</p>
      <p>Much of what a business knows is however never written down. Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.</p>
      <p>By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.</p></div>
  </div>
</div>
<div class="row" id="s8"><div class="sect-h"><h2>Built for the engineered world.</h2>
  <p>Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.</p></div>
  <div class="sectors" style="border-top:1px solid {LINE}">
    <div><img src="{img('a4.jpg')}"/><div class="lab"><div class="mono">Industrial</div><h3>Plants, turbines and production lines</h3></div></div>
    <div><img src="{img('a5.jpg')}"/><div class="lab"><div class="mono">Healthcare</div><h3>Devices, clinics and care operations</h3></div></div>
    <div><img src="{img('a6.jpg')}"/><div class="lab"><div class="mono">Chemical</div><h3>Process plants and laboratories</h3></div></div>
    <div><img src="{img('a7.jpg')}"/><div class="lab"><div class="mono">Enterprise</div><h3>Every function, one model</h3></div></div>
  </div></div>
<div class="row" id="s9"><div class="sect-h"><h2>Founded by early pioneers of deep learning.</h2>
  <p>Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.</p></div>
  <div class="team" style="border-top:1px solid {LINE}">
    <div><img src="{portrait('sam.jpg')}"/><div class="lab"><h3>Sam Pasupalak</h3><p>Co-founder · co-founded Maluuba</p></div></div>
    <div><img src="{portrait('kaheer.jpg')}"/><div class="lab"><h3>Kaheer Suleman</h3><p>Co-founder · co-founded Maluuba</p></div></div>
    <div><img src="{portrait('sumit.jpg')}"/><div class="lab"><h3>Sumit Pasupalak</h3><p>Co-founder · co-founded Ubiq (YC)</p></div></div>
  </div>
  <div class="stats" style="border-top:1px solid {LINE}">
    <div><b>30+</b><span>years of combined experience across business, product, and AI research</span></div>
    <div><b>25</b><span>engineers and researchers in a world class AI Research team</span></div>
    <div><b>3</b><span>countries, and now shaping the next era of AI</span></div>
  </div></div>
<div class="row" id="s10"><div class="sect-h" style="padding-bottom:56px"><h2>Backed by investors and advisors.</h2><p>We're grateful for the support of our investors and advisors.</p></div>
  <div class="marks" style="grid-template-columns:repeat(4,1fr);border-top:1px solid {LINE}"><span>Fidelity</span><span>Touring Capital</span><span>M13</span><span>Inovia Capital</span></div>
  <div class="marks" style="grid-template-columns:repeat(2,1fr);border-top:1px solid {LINE}"><span style="justify-content:space-between;padding:0 24px"><span style="border:0;height:auto">François Chollet</span><span class="mono" style="border:0;height:auto;font-size:12px;font-weight:400">Advisor · Google · Keras · NDEA</span></span><span style="justify-content:space-between;padding:0 24px"><span style="border:0;height:auto">Naveen Rao</span><span class="mono" style="border:0;height:auto;font-size:12px;font-weight:400">Advisor · Intel · Databricks</span></span></div>
</div>
<div class="row" id="s11"><div class="sect-h" style="padding-bottom:56px"><h2>Work with us.</h2><p></p></div>
  <div class="work" style="border-top:1px solid {LINE}">
    <div><h3>Work with SKY-001</h3><p>Partner with us to bring Engineering World Models into your design, engineering and operations.</p><div class="b"><span class="btn">Partner with us</span></div></div>
    <div><h3>Careers</h3><p>We're hiring researchers and engineers who want to build the foundation infrastructure for autonomous enterprise.</p><div class="b"><span class="btn">See open roles</span></div></div>
    <div><h3>Research</h3><ul style="margin-top:18px"><li>Introducing SKY-001 <i>2026</i></li><li>SKY-001 technical report <i>2026</i></li><li>Engineering World Models <i>2026</i></li></ul></div>
  </div></div>
<div class="full cta" id="s12"><img src="{img('a8.jpg')}"/>
  <div class="card"><h3>The foundation infrastructure for autonomous enterprise.</h3><p>Build Engineering World Models with a world class AI Research team across three countries.</p><span class="btn">Join the team</span></div></div>
<footer class="row" style="border-top:1px solid {LINE}">
  <div class="cols"><div><div class="mono">Explore</div><span>Research</span><span>SKY-001</span><span>Team</span></div><div><div class="mono">Socials</div><span>X</span><span>LinkedIn</span></div><div><div class="mono">Careers</div><span>Join the team</span><span>Partner with us</span><span>Contact</span></div><div><div class="mono">Legal</div><span>Terms of Service</span><span>Privacy Policy</span></div></div>
  <div class="big" style="border-top:1px solid {LINE}"><span class="logo">{LOGO}</span></div>
  <div class="copy" style="border-top:1px solid {LINE}"><span>© 2026 SKYFALL AI. ALL RIGHTS RESERVED.</span><span>ENGINEERING WORLD MODELS</span></div>
</footer>
</div>'''

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall Front Page · General Intuition style</title><style>{CSS}</style></head><body>{page()}</body></html>'
out = os.path.join(HERE, 'gi_inline.html' if INLINE else 'gi.html')
open(out, 'w').write(html)
print(out, len(html))

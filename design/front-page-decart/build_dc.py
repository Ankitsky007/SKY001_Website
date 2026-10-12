"""Skyfall front page, Decart-inspired version (desktop 1440).
Light off-white page, boxless clay objects on a crosshair, plotter-style mono labels (/A.01, [X .., Y ..]),
two-tone light headings, claim rows with small objects, a code-drawn exploded stack with leader labels,
model columns split by a slanted hairline, a notched full-bleed reel, dark notched footer. Geist + Geist Mono only.
Usage: python3 build_dc.py [--inline] -> dc.html or dc_inline.html"""
import re, sys, base64, os, io
HERE = os.path.dirname(os.path.abspath(__file__))
INLINE = '--inline' in sys.argv
FONTS = '/tmp/claude-0/sp/package/dist/fonts/'
TEAM = '/mnt/project-files/brand/team-portraits/final/'

def uri(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()
def g(name):
    p = os.path.join(HERE, 'out', name)
    return uri(p, 'image/png' if name.endswith('.png') else 'image/jpeg') if INLINE else 'out/' + name
def portrait(name):
    p = TEAM + name
    if INLINE:
        from PIL import Image
        im = Image.open(p).convert('RGB'); im.thumbnail((700, 700))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=84)
        return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    return 'file://' + p
def font(rel):
    return uri(FONTS + rel, 'font/woff2') if INLINE else 'file://' + FONTS + rel
def logo(col):
    s = open(f'/mnt/project-files/brand/logo/skyfall_logo_{col}.svg').read()
    s = re.sub(r'<metadata>.*?</metadata>', '', s, flags=re.S)
    s = re.sub(r'<\?xml.*?\?>', '', s)
    return re.sub(r'width="[\d.]+" height="[\d.]+"', 'width="100%" height="100%" preserveAspectRatio="xMinYMid meet"', s, count=1)
LBLUE, LW = logo('blue'), logo('white')

BG, INK, GREY, RULE, BLUE, TINT, FOOT, HOV = '#F0F0F0', '#21222C', '#8A8A8E', '#C5C5C7', '#3E57DA', '#E6EBFA', '#21222C', '#E6E6E2'
IM = '#5E616B'

CSS = f"""
@font-face{{font-family:'Geist';font-weight:300;src:url({font('geist-sans/Geist-Light.woff2')})}}
@font-face{{font-family:'Geist';font-weight:400;src:url({font('geist-sans/Geist-Regular.woff2')})}}
@font-face{{font-family:'Geist';font-weight:500;src:url({font('geist-sans/Geist-Medium.woff2')})}}
@font-face{{font-family:'Geist Mono';font-weight:400;src:url({font('geist-mono/GeistMono-Regular.woff2')})}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#222;font-family:'Geist',sans-serif;color:{INK};-webkit-font-smoothing:antialiased}}
.f{{width:1440px;background:{BG};margin:0 auto;position:relative;overflow:hidden}}
img{{display:block}}
.m{{font-family:'Geist Mono';font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:{BLUE}}}
.lt{{font-weight:300;letter-spacing:-.025em;line-height:1.06}}
.g{{color:{GREY}}}
.btn{{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 28px;background:{BLUE};color:#fff;font-family:'Geist Mono';font-size:12px;letter-spacing:.2em;text-transform:uppercase;border-radius:2px}}
.btn.o{{background:transparent;color:{BLUE};border:1px solid {BLUE}}}
.ban{{height:34px;background:{TINT};border-bottom:1px solid {RULE};display:flex;align-items:center;justify-content:center}}
nav{{height:88px;display:flex;align-items:center;padding:0 64px;position:relative;z-index:2}}
nav .logo{{width:160px;height:20px}}
nav .links{{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:40px}}
nav .links span{{font-family:'Geist Mono';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:{BLUE}}}
nav .btn{{margin-left:auto;height:40px;padding:0 24px}}
.hero{{position:relative;height:820px}}
.hero .xh{{position:absolute;left:0;top:0;width:1440px;height:820px}}
.hero .t{{position:absolute;left:64px;top:228px;width:720px}}
.hero h1{{font-size:80px}}
.hero p{{font-size:21px;line-height:1.4;margin-top:26px;max-width:470px;color:{INK}}}
.hero .btn{{margin-top:44px}}
.hero .obj{{position:absolute;left:770px;top:110px;width:600px;height:600px}}
.hero .obj img{{width:100%;height:100%;position:absolute;inset:0}}
.hero .rd{{position:absolute;left:1236px;top:586px}}
.hero .cap{{position:absolute;left:64px;bottom:40px;font-family:'Geist Mono';font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:{GREY}}}
.rule{{height:1px;background:{RULE};margin:0 64px}}
.rows{{border-top:1px solid {RULE}}}
.row{{display:grid;grid-template-columns:.875fr 1.5fr .75fr;align-items:center;height:240px;margin:0 64px;border-bottom:1px solid {RULE}}}
.row .ob{{width:200px;height:200px;margin-left:56px}}
.row .ob img{{width:100%;height:100%}}
.row h3{{font-size:52px}}
.row .r p{{font-size:15px;line-height:1.4;max-width:250px}}
.row .r .m{{margin-top:22px}}
.stm{{text-align:center;padding:160px 0 150px}}
.stm h2{{font-size:64px;margin:28px auto 0;max-width:1100px}}
.stm p{{font-size:19px;line-height:1.5;max-width:620px;margin:30px auto 0}}
.two{{display:grid;grid-template-columns:600px 1fr;gap:0;padding:150px 64px 0 160px;align-items:center}}
.two h2{{font-size:64px;margin-top:22px}}
.two p{{font-size:16px;line-height:1.5;max-width:420px;margin-top:28px}}
.two .btn{{margin-top:30px}}
.two .pic{{width:560px;height:560px;justify-self:end}}
.two .pic img{{width:100%;height:100%}}
.exp{{display:grid;grid-template-columns:480px 1fr;padding:170px 64px 0 160px}}
.exp h2{{font-size:64px;margin-top:22px}}
.exp p{{font-size:16px;line-height:1.5;max-width:400px;margin-top:24px}}
.tail{{text-align:center;padding:110px 0 120px}}
.tail h2{{font-size:60px}}
.cols{{position:relative;display:grid;grid-template-columns:1fr 1fr;margin:0 64px;padding:20px 0 120px}}
.cols .slant{{position:absolute;left:0;top:0;width:1312px;height:100%}}
.col{{padding:0 96px 0 60px}}
.col .hd{{display:flex;gap:18px;align-items:flex-start;margin-top:18px}}
.col .nm{{font-size:26px;line-height:1.12;letter-spacing:-.01em;text-transform:uppercase;font-weight:400}}
.col .nm span{{color:{GREY}}}
.col .sq{{width:420px;height:420px;margin-top:24px}}
.col .sq img{{width:100%;height:100%}}
.col .k{{font-family:'Geist Mono';font-size:13px;letter-spacing:.06em;text-transform:uppercase;line-height:1.5;margin-top:24px;max-width:420px}}
.col p{{font-size:15px;line-height:1.5;color:{GREY};margin-top:14px;max-width:420px}}
.col .btn{{margin-top:26px;height:40px}}
.figs{{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid {RULE};border-bottom:1px solid {RULE};margin:0 64px}}
.fig{{padding:44px 40px 40px}}
.fig+.fig{{border-left:1px solid {RULE}}}
.fig .tp{{display:flex;justify-content:space-between;margin-bottom:26px}}
.fig .fc{{font-size:14px;color:{IM};margin-top:14px;line-height:1.5}}
.lg{{display:inline-flex;align-items:center;gap:8px;margin:0 20px 8px 0;color:{INK};font-size:13px}} .lg i{{width:18px;height:3px;display:inline-block}} .lg i.dash{{background:repeating-linear-gradient(90deg,#9A9CA4 0 5px,transparent 5px 9px)}}
.ehd{{text-align:center;padding:150px 0 80px}}
.ehd h2{{font-size:64px;margin-top:24px}}
.ehd p{{font-size:17px;line-height:1.5;max-width:620px;margin:26px auto 0}}
.ehd .btn{{margin-top:34px}}
.reel{{position:relative;width:1440px;height:720px;overflow:hidden}}
.reel img{{width:100%;height:100%;object-fit:cover}}
.reel .nt{{position:absolute;left:0;top:0;width:1440px;height:720px}}
.reel .ctl{{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);display:flex;gap:6px}}
.reel .ctl span{{height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.14);color:#fff;font-size:14px;border-radius:3px}}
.reel .ctl .nm{{width:200px}}
.reel .ill{{position:absolute;right:28px;bottom:42px;font-family:'Geist Mono';font-size:10px;letter-spacing:.12em;color:rgba(255,255,255,.8)}}
.sec{{display:flex;justify-content:space-between;align-items:flex-start;margin:0 64px;padding:36px 0 0}}
.sec .tg{{display:flex;gap:36px}}
.sec .tg span{{font-family:'Geist Mono';font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:{GREY}}}
.sec .tg span.on{{color:{BLUE}}}
.sec p{{font-size:15px;line-height:1.5;max-width:520px}}
.dream{{text-align:center;padding:170px 0 160px}}
.dream h2{{font-size:64px;max-width:1040px;margin:26px auto 0}}
.dream p{{font-size:18px;line-height:1.5;max-width:560px;margin:28px auto 0}}
.tm{{display:flex;justify-content:space-between;align-items:flex-end;margin:0 64px}}
.tm h2{{font-size:64px}}
.tm p{{font-size:17px;color:{GREY};margin-top:10px}}
.ppl{{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:56px 64px 0}}
.pp .ph{{position:relative;height:420px;overflow:hidden;background:#ddd}}
.pp .ph img{{width:100%;height:100%;object-fit:cover}}
.pp .ph svg{{position:absolute;left:0;top:0}}
.pp h3{{font-size:20px;font-weight:400;margin-top:20px}}
.pp p{{font-size:14px;color:{GREY};margin-top:6px;line-height:1.45}}
.pp .m{{display:block;margin-top:16px}}
.story{{display:grid;grid-template-columns:360px 1fr;gap:64px;margin:80px 64px 0;padding-top:40px;border-top:1px solid {RULE}}}
.story p{{font-size:22px;line-height:1.5;font-weight:300}}
.stats{{display:grid;grid-template-columns:repeat(3,1fr);margin:72px 64px 0;border-top:1px solid {RULE}}}
.stats div{{padding:30px 0 0}}
.stats div+div{{border-left:1px solid {RULE};padding-left:40px}}
.stats b{{display:block;font-size:96px;font-weight:300;letter-spacing:-.04em;line-height:1}}
.stats span{{display:block;font-size:15px;color:{GREY};margin-top:14px;max-width:300px;line-height:1.45}}
.lst{{margin:120px 64px 0}}
.lr{{display:grid;grid-template-columns:360px 1fr;border-top:1px solid {RULE};padding:28px 0}}
.lr .nm{{display:flex;flex-wrap:wrap;gap:12px 56px}}
.lr .nm span{{font-size:28px;font-weight:300;letter-spacing:-.02em}}
.lr .nm small{{font-size:14px;color:{GREY};margin-left:10px;letter-spacing:0}}
.cta{{text-align:center;padding:170px 0 180px}}
.cta h2{{font-size:72px}}
.cta p{{font-size:18px;margin-top:22px}}
.cta .acts{{display:flex;gap:12px;justify-content:center;margin-top:36px}}
footer{{position:relative;background:{FOOT};color:#fff;height:600px}}
footer .nt{{position:absolute;left:0;top:0;width:1440px;height:80px}}
footer .mk{{position:absolute;left:64px;top:190px;width:300px;height:220px}}
footer .co{{position:absolute;left:740px;top:120px}}
footer .lk{{position:absolute;left:740px;top:170px;display:grid;grid-template-columns:repeat(3,200px);gap:22px 0}}
footer .lk span{{font-family:'Geist Mono';font-size:12px;letter-spacing:.16em;text-transform:uppercase}}
footer .bt{{position:absolute;left:64px;right:64px;bottom:34px;display:flex;justify-content:space-between;font-family:'Geist Mono';font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9A9BA3}}
"""

def crosshair():
    # registration mark behind the hero object: one horizontal hairline, one line tilted 8 degrees
    cx, cy = 1070, 410
    import math
    dx = math.tan(math.radians(8)) * 820
    return (f'<svg class="xh" width="1440" height="820" viewBox="0 0 1440 820" xmlns="http://www.w3.org/2000/svg">'
            f'<line x1="0" y1="{cy}" x2="1440" y2="{cy}" stroke="{RULE}"/>'
            f'<line x1="{cx + dx*cy/820:.1f}" y1="0" x2="{cx - dx*(820-cy)/820:.1f}" y2="820" stroke="{RULE}"/></svg>')

def exploded():
    # code-drawn exploded stack: prompt -> part tree -> 3D CAD -> BIM floor plan -> building, with leader labels
    W, H, cx, hw, hh = 740, 600, 360, 92, 46
    P = lambda y0, u, v: (cx + (u - v) * hw, y0 + (u + v) * hh)
    def poly(y0, pts):
        return ' '.join(f'{x:.1f},{y:.1f}' for x, y in (P(y0, u, v) for u, v in pts))
    layers = [(500, 'Prompt'), (400, 'Part tree'), (300, '3D CAD'), (200, 'BIM floor plan'), (110, 'Building')]
    s = f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    for k, (y0, lab) in enumerate(layers):
        s += f'<polygon points="{poly(y0,[(-1,-1),(1,-1),(1,1),(-1,1)])}" fill="{BG}" stroke="{BLUE}" stroke-width="1.3"/>'
        s += f'<polygon points="{poly(y0+8,[(1,-1),(1,1),(-1,1)])}" fill="none" stroke="{BLUE}" stroke-width=".6" opacity=".35"/>'
        if lab == 'Prompt':
            for i, L in enumerate([.9, 1.3, .7, 1.1]):
                v = -.55 + i * .32
                a, b = P(y0, -.7, v), P(y0, -.7 + L, v)
                s += f'<line x1="{a[0]:.1f}" y1="{a[1]:.1f}" x2="{b[0]:.1f}" y2="{b[1]:.1f}" stroke="{BLUE}" stroke-width="1.6" opacity=".7"/>'
        if lab == 'Part tree':
            nodes = [(0, -.6), (-.5, 0), (.5, 0), (-.75, .55), (-.25, .55), (.25, .55), (.75, .55)]
            for a, b in [(0, 1), (0, 2), (1, 3), (1, 4), (2, 5), (2, 6)]:
                p, q = P(y0, *nodes[a][::-1]), P(y0, *nodes[b][::-1])
                s += f'<line x1="{p[0]:.1f}" y1="{p[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" stroke="{BLUE}" stroke-width="1"/>'
            for i, n in enumerate(nodes):
                p = P(y0, *n[::-1])
                s += f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{4 if i else 5}" fill="{BLUE if i==0 else BG}" stroke="{BLUE}"/>'
        if lab == '3D CAD':
            for u in range(-6, 7, 2):
                for v in range(-6, 7, 2):
                    p = P(y0, u / 8, v / 8)
                    s += f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="1.6" fill="{BLUE}"/>'
            for (u, v, w) in [(-.5, -.4, .3), (.3, .2, .25)]:
                top = [(u, v), (u + w, v), (u + w, v + w), (u, v + w)]
                pts = [P(y0 - 30, a, b) for a, b in top]
                base = [P(y0, a, b) for a, b in top]
                s += '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + f'" fill="{BG}" stroke="{BLUE}"/>'
                for (x1, y1), (x2, y2) in zip(pts[1:], base[1:]):
                    s += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{BLUE}" stroke-width=".8"/>'
        if lab == 'BIM floor plan':
            for seg in [((-1, -.2), (.3, -.2)), ((.3, -1), (.3, 1)), ((-.4, -.2), (-.4, 1)), ((.3, .35), (1, .35))]:
                p, q = P(y0, *seg[0]), P(y0, *seg[1])
                s += f'<line x1="{p[0]:.1f}" y1="{p[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" stroke="{BLUE}" stroke-width="1.4"/>'
            s += f'<polygon points="{poly(y0,[(.3,-1),(1,-1),(1,.35),(.3,.35)])}" fill="{BLUE}" opacity=".18"/>'
        if lab == 'Building':
            top = [(-.55, -.55), (.55, -.55), (.55, .55), (-.55, .55)]
            hgt = 54
            pts = [P(y0 - hgt, a, b) for a, b in top]
            base = [P(y0, a, b) for a, b in top]
            s += '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in [base[1], base[2], base[3], pts[3], pts[2], pts[1]]) + f'" fill="{BG}" stroke="{BLUE}"/>'
            s += '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + f'" fill="{BLUE}" stroke="{BLUE}"/>'
            for (x1, y1), (x2, y2) in zip(pts[2:3], base[2:3]):
                s += f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{BLUE}"/>'
            for f in (.33, .66):
                a = (base[1][0] + (pts[1][0]-base[1][0])*f, base[1][1] + (pts[1][1]-base[1][1])*f)
                b = (base[2][0] + (pts[2][0]-base[2][0])*f, base[2][1] + (pts[2][1]-base[2][1])*f)
                c = (base[3][0] + (pts[3][0]-base[3][0])*f, base[3][1] + (pts[3][1]-base[3][1])*f)
                s += f'<polyline points="{a[0]:.1f},{a[1]:.1f} {b[0]:.1f},{b[1]:.1f} {c[0]:.1f},{c[1]:.1f}" fill="none" stroke="{BLUE}" stroke-width=".7"/>'
        # leader line + label, alternating sides
        if k % 2 == 0:
            a = P(y0, 1, -1); ex, ey = a[0] + 70, a[1] - 34
            s += f'<polyline points="{a[0]:.1f},{a[1]:.1f} {ex:.1f},{ey:.1f} {ex+40:.1f},{ey:.1f}" fill="none" stroke="#A9ABB3" stroke-width=".8"/>'
            s += f'<text x="{ex+46:.1f}" y="{ey+4:.1f}" font-size="14" fill="{BLUE}">{lab}</text>'
        else:
            a = P(y0, -1, 1); ex, ey = a[0] - 30, a[1] - 40
            s += f'<polyline points="{a[0]:.1f},{a[1]:.1f} {ex:.1f},{ey:.1f} {ex-24:.1f},{ey:.1f}" fill="none" stroke="#A9ABB3" stroke-width=".8"/>'
            s += f'<text x="{ex-30:.1f}" y="{ey+4:.1f}" font-size="14" fill="{BLUE}" text-anchor="end">{lab}</text>'
    return s + '</svg>'

def glyph(ch):
    return (f'<svg width="44" height="62" viewBox="0 0 44 62" xmlns="http://www.w3.org/2000/svg">'
            f'<text x="22" y="54" text-anchor="middle" font-family="Geist Mono" font-size="64" fill="none" stroke="{BLUE}" stroke-width="1.2">{ch}</text></svg>')

def notch(w, h, corners):
    # page-coloured shapes that step the corners of a media block (Decart's notched mask, drawn as overlays)
    s = f'<svg class="nt" width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">'
    if 'tr' in corners:
        s += f'<path d="M{w-120} 0 L{w} 0 L{w} 44 L{w-70} 44 Q{w-82} 44 {w-88} 34 L{w-104} 10 Q{w-110} 0 {w-120} 0 Z" fill="{BG}"/>'
    if 'bl' in corners:
        s += f'<path d="M0 {h-30} L60 {h-30} Q72 {h-30} 78 {h-20} L84 {h-8} Q88 {h} 98 {h} L0 {h} Z" fill="{BG}"/>'
    return s + '</svg>'

def ph_notch():
    return f'<svg width="120" height="34" viewBox="0 0 120 34" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L120 0 L120 0 Q108 0 102 10 L96 22 Q90 34 78 34 L0 34 Z" fill="{BG}"/></svg>'

exec(open(os.path.join(HERE, 'charts.py')).read())

def page():
    return f'''<div class="f" data-name="Skyfall Front Page · Decart style · Desktop 1440">
<div class="ban"><span class="m">SKY-001 is live · the first world model for the engineered world</span></div>
<nav><span class="logo">{LBLUE}</span><div class="links"><span>Research</span><span>SKY-001 ⌄</span><span>Team</span><span>Careers</span><span>Company</span></div><span class="btn o">Contact us</span></nav>
<div class="hero" id="s1">{crosshair()}
  <div class="obj" id="heroobj"><img src="{g('d4.png')}"/></div>
  <span class="m rd" id="coord">(X 107.0, Y 41.0)</span>
  <div class="t"><h1 class="lt">Autonomous Business for the Post-Monolithic Era</h1>
  <p>We're enabling the future where an entire business can operate autonomously.</p>
  <span class="btn">Read the research</span></div>
</div>
<div class="rows" id="s2">
  <div class="row"><div class="ob"><img src="{g('d5.png')}"/></div><h3 class="lt">Learn the latent<br/><span class="g">space of an enterprise</span></h3><div class="r"><p>Across core functions: sales, design, engineering, customer support, finance and operations.</p><div class="m">/A.01</div></div></div>
  <div class="row"><div class="ob"><img src="{g('d6.png')}"/></div><h3 class="lt"><span class="g">Simulate</span><br/>cause and effect</h3><div class="r"><p>Cause-and-effect relationships between functions.</p><div class="m">/A.02</div></div></div>
  <div class="row"><div class="ob"><img src="{g('d7.png')}"/></div><h3 class="lt">Plan over<br/><span class="g">long horizons</span></h3><div class="r"><p>To accomplish highly complex tasks, subject to safety guardrails.</p><div class="m">/A.03</div></div></div>
</div>
<div class="stm" id="s3"><div class="m">/B.01 [X 809.0, Y 291.0]</div>
  <h2 class="lt">Our mission is to build the foundation infrastructure for autonomous enterprise <span class="g">through Engineering World Models.</span></h2></div>
<div class="rule"></div>
<div class="two" id="s4"><div><div class="m">/D.01 [X 34.6, Y 70.2]</div>
  <h2 class="lt"><span class="g">Enterprise work is</span> long horizon, constrained and always evolving.</h2>
  <p>A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.</p>
  <span class="btn">Read the essay</span></div>
  <div class="pic"><img src="{g('d8.png')}"/></div></div>
<div class="exp" id="s5"><div><div class="m">/C.01 [X 809.0, Y 291.0]</div>
  <h2 class="lt"><span class="g">Beyond</span> next-token prediction</h2>
  <p>Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.</p>
  <p>Much of what a business knows is however never written down. Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.</p></div>
  <div>{exploded()}</div></div>
<div class="tail"><h2 class="lt">from a prompt <span class="g">to everything that is built.</span></h2></div>
<div class="figs" id="s6">
  <div class="fig"><div class="tp m"><span>/E.01 Tokens per decision</span><span style="color:{GREY}">Illustrative</span></div>{tokens_chart()}<div class="fc">Tokens burned per enterprise decision. Illustrative, not measured.</div></div>
  <div class="fig"><div class="tp m"><span>/E.02 A new Pareto frontier</span><span style="color:{GREY}">Illustrative</span></div>{pareto()}<div class="fc"><span class="lg"><i style="background:{BLUE}"></i>Engineering World Models</span><span class="lg"><i class="dash"></i>Today’s frontier</span><br/>By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.</div></div>
</div>
<div class="cols" id="s7" style="margin-top:140px"><svg class="slant" width="1312" height="900" viewBox="0 0 1312 900" xmlns="http://www.w3.org/2000/svg"><line x1="690" y1="0" x2="622" y2="900" stroke="{RULE}"/></svg>
  <div class="col"><div class="m">/C.02</div><div class="hd">{glyph('S')}<div class="nm">SKY-001<br/><span>World model</span></div></div>
    <div class="sq"><img src="{g('d9.png')}"/></div>
    <div class="k">The first world model for the engineered world</div>
    <p>From a prompt to hierarchical parts, 3D CAD, BIM floor plans and buildings.</p><span class="btn o">Meet SKY-001</span></div>
  <div class="col" style="padding-left:96px"><div class="m">/C.03</div><div class="hd">{glyph('E')}<div class="nm">Engineering<br/><span>World Models</span></div></div>
    <div class="sq"><img src="{g('d10.png')}"/></div>
    <div class="k">The foundation infrastructure for autonomous enterprise</div>
    <p>Why next-token prediction does not transfer to the enterprise, and what does.</p><span class="btn o">Read the research</span></div>
</div>
<div class="rule"></div>
<div class="ehd" id="s8"><div class="m">Research</div><h2 class="lt">AI for the <span class="g">Engineered</span> World</h2>
  <p>Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations.</p>
  <span class="btn">Read the research</span></div>
<div class="reel"><img src="{g('d11.jpg')}"/>{notch(1440, 720, 'tr bl')}
  <div class="ctl"><span>‹</span><span class="nm">Industrial</span><span>♪</span><span>›</span></div></div>
<div class="sec"><div class="tg"><span class="on">Industrial</span><span>Healthcare</span><span>Chemical</span><span>Enterprise</span></div>
  <p>Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.</p></div>
<div class="dream" id="s9"><div class="m">/F.01 [X 70.0, Y 45.0]</div><h2 class="lt">With world models, AI systems can ‘dream’ <span class="g">what a successful business requires, and then execute it.</span></h2>
  <p>We are building the foundation infrastructure for the software that powers enterprises.</p></div>
<div class="rule"></div>
<div class="tm" id="s10" style="padding-top:140px"><div><h2 class="lt">Maluuba <span class="g">to</span> Skyfall AI</h2><p>Founded by early pioneers of deep learning.</p></div><span class="btn">Meet the team</span></div>
<div class="ppl">
  <div class="pp"><div class="ph"><img src="{portrait('sam.jpg')}"/>{ph_notch()}</div><span class="m">Co-founder</span><h3>Sam Pasupalak</h3><p>Co-founded Maluuba, acquired by Microsoft.</p></div>
  <div class="pp"><div class="ph"><img src="{portrait('kaheer.jpg')}"/>{ph_notch()}</div><span class="m">Co-founder</span><h3>Kaheer Suleman</h3><p>Co-founded Maluuba, acquired by Microsoft.</p></div>
  <div class="pp"><div class="ph"><img src="{portrait('sumit.jpg')}"/>{ph_notch()}</div><span class="m">Co-founder</span><h3>Sumit Pasupalak</h3><p>Previously co-founded Ubiq, a Y Combinator company.</p></div>
</div>
<div class="story"><div class="m">/G.01 Founding story</div><p>Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.</p></div>
<div class="stats"><div><b>30+</b><span>years of combined experience across business, product, and AI research</span></div><div><b>25</b><span>engineers and researchers in a world class AI Research team</span></div><div><b>3</b><span>countries, and now shaping the next era of AI</span></div></div>
<div class="lst">
  <div class="lr"><div class="m">/H.01 Our teams bring experience from</div><div class="nm"><span>Maluuba</span><span>Microsoft</span><span>Waterloo</span><span>Y Combinator</span><span>MILA</span><span>Vector</span></div></div>
  <div class="lr"><div class="m">/H.02 We're backed by</div><div class="nm"><span>Fidelity</span><span>Touring Capital</span><span>M13</span><span>Inovia Capital</span></div></div>
  <div class="lr" style="border-bottom:1px solid {RULE}"><div class="m">/H.03 Advisors</div><div class="nm"><span>François Chollet<small>Google · Keras · NDEA</small></span><span>Naveen Rao<small>Intel · Databricks</small></span></div></div>
</div>
<div class="cta" id="s11"><div class="m">/J.01 [X 12.0, Y 88.0]</div><h2 class="lt" style="margin-top:26px">Build the <span class="g">autonomous enterprise</span></h2>
  <p>Join a world class AI Research team across three countries.</p>
  <div class="acts"><span class="btn">Work with us</span><span class="btn o">See open roles</span></div></div>
<footer><svg class="nt" width="1440" height="80" viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L70 0 Q58 0 52 12 L44 28 Q38 40 24 40 L0 40 Z" fill="{BG}"/><path d="M1440 0 L1300 0 Q1316 0 1324 14 L1340 50 Q1352 80 1380 80 L1440 80 Z" fill="{BG}"/><path d="M70 0 L1300 0" stroke="{BG}"/></svg>
  <div class="mk">{LW}</div>
  <span class="m co" style="color:#8EA0F0">[X 70.0, Y 45.0]</span>
  <div class="lk"><span>Research</span><span>SKY-001</span><span>Contact</span><span>Team</span><span>Technical report</span><span>Careers</span><span>Company</span><span>Essays</span><span>X · LinkedIn</span></div>
  <div class="bt"><span>Skyfall AI 2026</span><span>Privacy policy · Terms of use</span></div></footer>
</div>'''

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall Front Page · Decart style</title><style>{CSS}</style></head><body>{page()}</body></html>'
out = os.path.join(HERE, 'dc_inline.html' if INLINE else 'dc.html')
open(out, 'w').write(html)
print(out, len(html))

"""Skyfall front page, Twelve Labs-inspired version (desktop 1440).
Dark hero (bloom still) with announcement bar, then light editorial sections: numbered tabs with a
media card, feature tabs, sector photo cards, product cards, team, dark CTA, big footer wordmark.
Rounded cards and pill buttons. Geist + Geist Mono only.
Usage: python3 build_tl.py [--inline] -> tl.html or tl_inline.html"""
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
LW, LB = logo('white'), logo('black')

D, D2, DR, P, PM = '#07080A', '#0F1114', '#262A32', '#ECEDEF', '#8B90A0'
L, LC, LR, INK, IM, BLUE, LIFT = '#F3F3F1', '#FFFFFF', 'rgba(11,12,14,.10)', '#0B0C0E', '#5E616B', '#3E57DA', '#6F83F0'

CSS = f"""
@font-face{{font-family:'Geist';font-weight:400;src:url({font('geist-sans/Geist-Regular.woff2')})}}
@font-face{{font-family:'Geist';font-weight:500;src:url({font('geist-sans/Geist-Medium.woff2')})}}
@font-face{{font-family:'Geist Mono';font-weight:400;src:url({font('geist-mono/GeistMono-Regular.woff2')})}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#222;font-family:'Geist',sans-serif;color:{INK};-webkit-font-smoothing:antialiased}}
.f{{width:1440px;background:{L};margin:0 auto;position:relative;overflow:hidden}}
img{{display:block}}
.mono{{font-family:'Geist Mono';font-size:12px;letter-spacing:.08em;text-transform:uppercase}}
.pb{{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 20px;border-radius:10px;font-size:15px;font-weight:500;white-space:nowrap}}
.pb.w{{background:#fff;color:{INK}}}
.pb.b{{background:{BLUE};color:#fff}}
.pb.k{{background:{INK};color:#fff}}
.pb.o{{border:1px solid rgba(255,255,255,.28);color:{P}}}
.pb.ol{{border:1px solid rgba(11,12,14,.22);color:{INK}}}
.dark{{background:{D};color:{P}}}
nav{{height:72px;display:flex;align-items:center;padding:0 64px;position:relative;z-index:3;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(7,8,10,.88)}}
nav .logo{{width:150px;height:19px}}
nav .links{{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:32px;font-size:15px;color:{PM}}}
nav .r{{margin-left:auto;display:flex;gap:10px;align-items:center}}
nav .links i{{font-style:normal;font-size:11px;opacity:.7}}
nav .nl{{font-size:15px;color:{PM};margin-right:10px}}
.pb.sm{{height:36px;padding:0 14px;font-size:14px}}
.pb b{{font-weight:400;font-size:14px}}
.herox{{position:relative;height:900px;overflow:hidden}}
.herox .field{{position:absolute;left:0;top:0;width:1440px;height:900px}}
.herox .veil{{position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,8,10,.92) 0%,rgba(7,8,10,.8) 38%,rgba(7,8,10,0) 62%),linear-gradient(0deg,rgba(7,8,10,.9),rgba(7,8,10,0) 18%)}}
.herox .t{{position:absolute;left:64px;top:282px;width:600px;z-index:2}}
.herox h1{{font-size:60px;font-weight:500;letter-spacing:-.04em;line-height:1.04}}
.herox .sub{{font-size:18px;color:#B9BCC6;line-height:1.5;margin-top:26px;max-width:470px}}
.herox .acts{{display:flex;gap:12px;margin-top:36px}}
.herox .card{{position:absolute;right:64px;bottom:56px;width:360px;padding:10px;border-radius:16px;background:rgba(30,32,37,.86);border:1px solid rgba(255,255,255,.12);z-index:2}}
.herox .cm{{position:relative;height:196px;border-radius:10px;overflow:hidden;background:#0D0F13}}
.herox .cm img{{width:100%;height:100%;object-fit:cover}}
.herox .pr{{position:absolute;left:14px;right:14px;bottom:14px;height:36px;border-radius:8px;background:rgba(7,8,10,.82);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:space-between;padding:0 6px 0 12px;font-size:13px;color:{P}}}
.herox .pr b{{width:24px;height:24px;border-radius:6px;background:{BLUE};display:inline-flex;align-items:center;justify-content:center;font-weight:400;font-size:12px}}
.herox .ct{{padding:12px 6px 6px}}
.herox .rp{{display:inline-flex;height:22px;padding:0 8px;border-radius:6px;border:1px solid {LIFT};color:{LIFT};font-family:'Geist Mono';font-size:10px;letter-spacing:.08em;text-transform:uppercase;align-items:center}}
.herox .ct p{{font-size:15px;color:{P};margin-top:10px;line-height:1.4}}
.herox .note{{position:absolute;left:64px;bottom:40px;font-family:'Geist Mono';font-size:11px;color:{PM};z-index:2}}

.fade{{height:120px;background:linear-gradient({D},{L})}}
.sec{{padding:120px 64px 0}}
.kick{{color:{BLUE};margin-bottom:18px}}
h2{{font-size:56px;font-weight:500;letter-spacing:-.035em;line-height:1.04}}
.lead{{font-size:19px;color:{IM};line-height:1.55}}
.mis{{text-align:center;padding-top:40px}}
.mis h2{{font-size:46px;max-width:1040px;margin:0 auto;line-height:1.12}}
.mis h2 em{{font-style:normal;color:{IM}}}
.tabs{{display:grid;grid-template-columns:500px 1fr;gap:56px;margin-top:64px;align-items:start}}
.tab{{border-top:1px solid {LR};padding:24px 0 28px}}
.tab .h{{display:flex;gap:18px;align-items:baseline;font-size:24px;font-weight:500;letter-spacing:-.02em}}
.tab .h .mono{{color:{IM}}}
.tab p{{font-size:16px;line-height:1.6;color:{IM};margin-top:12px;padding-left:44px}}
.tab.off .h{{color:#9a9ca4}} .tab.off p{{color:#9a9ca4}}
.tab .bar{{height:2px;background:{LR};margin-top:22px;margin-left:44px;position:relative}}
.tab .bar i{{position:absolute;left:0;top:0;height:2px;width:46%;background:{BLUE}}}
.mc{{border-radius:24px;overflow:hidden;background:#d9d9d7;position:relative}}
.mc img{{width:100%;height:100%;object-fit:cover}}
.tag{{position:absolute;left:20px;bottom:18px;height:28px;padding:0 12px;border-radius:999px;background:rgba(255,255,255,.82);display:inline-flex;align-items:center;font-family:'Geist Mono';font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:{INK}}}
.tag.d{{background:rgba(7,8,10,.6);color:{P}}}
.figs{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}}
.fig{{background:{LC};border-radius:24px;padding:32px 32px 28px;border:1px solid {LR}}}
.fig .top{{display:flex;justify-content:space-between;margin-bottom:22px;color:{IM}}}
.lg{{display:inline-flex;align-items:center;gap:8px;margin:0 20px 8px 0;color:{INK};font-size:13px}} .lg i{{width:18px;height:3px;border-radius:2px;display:inline-block}} .lg i.dash{{background:repeating-linear-gradient(90deg,#9A9CA4 0 5px,transparent 5px 9px)}}
.fig .fc{{font-size:14px;color:{IM};margin-top:16px;line-height:1.5}}
.hd{{display:flex;justify-content:space-between;align-items:flex-end;gap:64px}}
.hd .lead{{max-width:520px}}
.chips{{display:flex;gap:8px;margin-top:48px}}
.chips span{{height:40px;padding:0 18px;border-radius:999px;border:1px solid {LR};display:inline-flex;align-items:center;font-size:15px;color:{IM};background:{LC}}}
.chips span.on{{background:{INK};color:#fff;border-color:{INK}}}
.feat{{display:grid;grid-template-columns:1fr 420px;gap:20px;margin-top:20px}}
.feat .mc{{height:560px}}
.feat .side{{background:{LC};border-radius:24px;border:1px solid {LR};padding:36px;display:flex;flex-direction:column}}
.feat .side h3{{font-size:32px;font-weight:500;letter-spacing:-.025em;line-height:1.1}}
.feat .side p{{font-size:16px;color:{IM};line-height:1.6;margin-top:16px}}
.feat .side .ft{{margin-top:auto;border-top:1px solid {LR};padding-top:20px;font-size:15px;line-height:1.55}}
.three{{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px}}
.c3{{background:{LC};border-radius:24px;border:1px solid {LR};overflow:hidden}}
.c3 .mc{{border-radius:0;height:300px}}
.c3 .tx{{padding:24px 28px 28px}}
.c3 h3{{font-size:22px;font-weight:500;letter-spacing:-.02em}}
.c3 p{{font-size:15px;color:{IM};margin-top:8px;line-height:1.5}}
.sect{{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:56px}}
.sc{{height:520px;border-radius:24px;overflow:hidden;position:relative}}
.sc img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.sc .sh{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,8,10,0) 50%,rgba(7,8,10,.78))}}
.sc .tx{{position:absolute;left:24px;right:24px;bottom:22px;color:#fff}}
.sc h3{{font-size:26px;font-weight:500;letter-spacing:-.02em}}
.sc p{{font-size:14px;color:rgba(255,255,255,.78);margin-top:6px;line-height:1.45}}
.sc .n{{position:absolute;left:20px;top:18px;height:28px;padding:0 12px;border-radius:999px;background:rgba(7,8,10,.55);color:#fff;display:inline-flex;align-items:center}}
.dream{{margin:120px 64px 0;border-radius:32px;background:{D};color:{P};padding:120px 96px;position:relative;overflow:hidden;text-align:center}}
.dream .glow{{position:absolute;left:50%;top:100%;width:1100px;height:700px;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(62,87,218,.55),rgba(62,87,218,0))}}
.dream h2{{font-size:52px;max-width:900px;margin:0 auto;position:relative}}
.dream h2 span{{color:{PM}}}
.dream p{{font-size:19px;color:{PM};margin:28px auto 0;max-width:560px;line-height:1.5;position:relative}}
.dream .acts{{display:flex;gap:10px;justify-content:center;margin-top:36px;position:relative}}
.prods{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:56px}}
.pc{{background:{LC};border-radius:24px;border:1px solid {LR};overflow:hidden}}
.pc .mc{{border-radius:0;height:380px}}
.pc .tx{{padding:30px 32px 32px}}
.pc h3{{font-size:40px;font-weight:500;letter-spacing:-.03em;margin-top:6px}}
.pc p{{font-size:16px;color:{IM};margin-top:12px;line-height:1.55;max-width:520px}}
.pc .acts{{display:flex;gap:10px;margin-top:26px}}
.story{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:56px}}
.story .q{{background:{INK};color:{P};border-radius:24px;padding:44px;display:flex;flex-direction:column}}
.story .q p{{font-size:22px;line-height:1.45;letter-spacing:-.01em}}
.story .q .who{{margin-top:auto;display:flex;gap:12px;color:{PM}}}
.ppl{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}}
.pp{{border-radius:24px;overflow:hidden;background:{LC};border:1px solid {LR}}}
.pp img{{width:100%;height:330px;object-fit:cover}}
.pp .tx{{padding:16px 18px 18px}}
.pp h3{{font-size:17px;font-weight:500}}
.pp p{{font-size:13px;color:{IM};margin-top:3px;line-height:1.4}}
.stats{{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px}}
.st{{background:{LC};border-radius:24px;border:1px solid {LR};padding:32px}}
.st b{{display:block;font-size:80px;font-weight:500;letter-spacing:-.05em;line-height:1}}
.st b i{{font-style:normal;color:{BLUE}}}
.st span{{display:block;font-size:15px;color:{IM};margin-top:14px;line-height:1.5;max-width:300px}}
.strip{{margin-top:96px;text-align:center}}
.strip .lbl{{color:{IM}}}
.marks{{display:flex;justify-content:space-between;align-items:center;margin-top:30px;padding:0 24px}}
.marks span{{font-size:24px;font-weight:500;letter-spacing:-.02em;color:#7b7e87}}
.adv{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:40px;text-align:left}}
.adv div{{background:{LC};border-radius:24px;border:1px solid {LR};padding:26px 32px;display:flex;justify-content:space-between;align-items:center}}
.adv h3{{font-size:24px;font-weight:500;letter-spacing:-.02em}}
.adv span{{font-size:14px;color:{IM}}}
.cta{{margin:120px 64px 0;height:600px;border-radius:32px;overflow:hidden;position:relative;background:{D}}}
.cta img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.cta .sh{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,8,10,.92) 15%,rgba(7,8,10,.15) 62%,rgba(7,8,10,.5))}}
.cta .t{{position:absolute;left:0;right:0;top:80px;text-align:center;color:{P}}}
.cta h2{{font-size:64px}}
.cta p{{font-size:19px;color:{PM};margin-top:18px}}
.cta .acts{{display:flex;gap:10px;justify-content:center;margin-top:32px}}
.ill{{position:absolute;right:22px;bottom:18px;font-family:'Geist Mono';font-size:10px;letter-spacing:.1em;color:rgba(255,255,255,.7)}}
footer{{margin-top:120px;background:{D};color:{P};padding:72px 64px 0}}
footer .cols{{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr}}
footer .h{{color:{PM}}}
footer .cols span{{display:block;font-size:15px;color:{P};margin-top:14px}}
footer .cols p{{font-size:15px;color:{PM};margin-top:18px;max-width:300px;line-height:1.5}}
footer .big{{height:170px;margin-top:88px;opacity:.95}}
footer .copy{{border-top:1px solid {DR};margin-top:40px;padding:22px 0 26px;display:flex;justify-content:space-between;font-size:12px;color:{PM}}}
"""

AX, GRID, LBL = '#9A9CA4', 'rgba(11,12,14,.08)', '#5E616B'
def tokens_chart():
    # horizontal bars, relative tokens per decision (agent loop = 100), x axis with ticks and title
    W, H, L, R, T, B = 576, 290, 196, 34, 8, 58
    pw = W - L - R
    rows = [('Engineering World Model', 6, BLUE), ('LLM, short context', 38, '#B4B6BD'), ('LLM, long context', 74, '#9A9CA4'), ('LLM agent loop', 100, '#7D808A')]
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
    W, H, L, R, T, B = 576, 290, 58, 16, 14, 58
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
    s += f'<path d="M{X(.06):.1f} {Y(.1):.1f} C {X(.3):.1f} {Y(.36):.1f}, {X(.6):.1f} {Y(.6):.1f}, {X(.98):.1f} {Y(.74):.1f}" fill="none" stroke="#9A9CA4" stroke-width="2" stroke-dasharray="5 5"/>'
    for u, v, lab, below in pts:
        s += f'<circle cx="{X(u):.1f}" cy="{Y(v):.1f}" r="5" fill="#7D808A"/>'
        s += (f'<text x="{X(u)+10:.1f}" y="{Y(v)+18:.1f}" font-size="12" fill="{LBL}">{lab}</text>' if below else f'<text x="{X(u):.1f}" y="{Y(v)+22:.1f}" font-size="12" fill="{LBL}" text-anchor="middle">{lab}</text>')
    s += f'<path d="M{X(.02):.1f} {Y(.5):.1f} C {X(.08):.1f} {Y(.78):.1f}, {X(.2):.1f} {Y(.9):.1f}, {X(.5):.1f} {Y(.95):.1f}" fill="none" stroke="{BLUE}" stroke-width="3"/>'
    s += f'<text x="{X(.17):.1f}" y="{Y(.76):.1f}" font-size="13" font-weight="500" fill="{INK}">Engineering World Models</text>'
    s += f'<text x="{X(.6):.1f}" y="{Y(.84):.1f}" font-size="12" fill="{LBL}">Today\'s frontier, dashed</text>' if False else ''
    return s + '</svg>'

AR = '<span>→</span>'
def page():
    return f'''<div class="f" data-name="Skyfall Front Page · Twelve Labs style · Desktop 1440">
<div class="dark herox" id="s1">
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
<section class="sec mis" id="s2" style="padding-top:128px"><div class="mono kick">Our mission</div>
  <h2>Our mission is to build the foundation infrastructure for autonomous enterprise <em>through Engineering World Models.</em></h2></section>
<section class="sec" id="s3"><div class="hd"><h2 style="max-width:760px">Enterprise work is long horizon, constrained and always evolving.</h2></div>
  <div class="tabs"><div>
    <div class="tab"><div class="h"><span class="mono">01</span>A single decision ripples</div><p>A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.</p><div class="bar"><i></i></div></div>
    <div class="tab off"><div class="h"><span class="mono">02</span>A living system</div><p>Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.</p></div>
    <div class="tab off"><div class="h"><span class="mono">03</span>Never written down</div><p>Much of what a business knows is however never written down. Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.</p></div>
  </div>
  <div class="mc" style="height:620px"><img src="{g('t1.jpg')}"/></div></div>
  <div class="figs"><div class="fig"><div class="top mono"><span>Fig. 01 · Tokens per decision</span><span>Illustrative</span></div>{tokens_chart()}<div class="fc">Tokens burned per enterprise decision. Illustrative, not measured.</div></div>
  <div class="fig"><div class="top mono"><span>Fig. 02 · A new Pareto frontier</span><span>Illustrative</span></div>{pareto()}<div class="fc"><span class="lg"><i style="background:#3E57DA"></i>Engineering World Models</span><span class="lg"><i class="dash"></i>Today’s frontier</span><br/>Cost, speed, and quality no longer have to be traded against each other. Illustrative, not benchmark data.</div></div></div>
</section>
<section class="sec" id="s4"><div class="hd"><div><div class="mono kick">Research</div><h2>AI for the Engineered World</h2></div>
  <p class="lead">Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations.</p></div>
  <div class="chips"><span class="on">Learn</span><span>Simulate</span><span>Plan</span><span>Guard</span></div>
  <div class="feat"><div class="mc"><img src="{g('t11.jpg')}"/></div>
    <div class="side"><div class="mono kick">01 · Learn</div><h3>The latent space of an enterprise</h3><p>One model across sales, design, engineering, customer support, finance and operations, instead of a separate tool for each function.</p>
    <div class="ft">These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.</div></div></div>
  <div class="three">
    <div class="c3"><div class="mc"><img src="{g('t3.jpg')}"/></div><div class="tx"><h3>Simulate</h3><p>Cause-and-effect relationships between functions.</p></div></div>
    <div class="c3"><div class="mc"><img src="{g('t4.jpg')}"/></div><div class="tx"><h3>Plan</h3><p>Over long horizons, to accomplish highly complex tasks.</p></div></div>
    <div class="c3"><div class="mc"><img src="{g('t5.jpg')}"/></div><div class="tx"><h3>Guard</h3><p>Every plan stays subject to safety guardrails.</p></div></div>
  </div></section>
<section class="sec" id="s5"><div class="hd"><h2 style="max-width:620px">Built for the engineered world</h2>
  <p class="lead">Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.</p></div>
  <div class="sect">
    <div class="sc"><img src="{g('t6.jpg')}"/><div class="sh"></div><span class="mono n">01</span><div class="tx"><h3>Industrial</h3><p>Turbines, plants and the supply chains behind them.</p></div></div>
    <div class="sc"><img src="{g('t7.jpg')}"/><div class="sh"></div><span class="mono n">02</span><div class="tx"><h3>Healthcare</h3><p>Devices and systems where reliability is not optional.</p></div></div>
    <div class="sc"><img src="{g('t8.jpg')}"/><div class="sh"></div><span class="mono n">03</span><div class="tx"><h3>Chemical</h3><p>Processes that must hold under tight constraints.</p></div></div>
    <div class="sc"><img src="{g('t9.jpg')}"/><div class="sh"></div><span class="mono n">04</span><div class="tx"><h3>Enterprise</h3><p>Finance, operations, sales and support as one system.</p></div></div>
  </div></section>
<div class="dream" id="s6"><div class="glow"></div><h2>With world models, AI systems can ‘dream’ <span>what a successful business requires, and then execute it.</span></h2>
  <p>We are building the foundation infrastructure for the software that powers enterprises.</p>
  <div class="acts"><span class="pb w">Read the research {AR}</span><span class="pb o">Meet SKY-001</span></div></div>
<section class="sec" id="s7"><div class="hd"><h2>Research and models</h2><span class="pb ol">All research {AR}</span></div>
  <div class="prods">
    <div class="pc"><div class="mc"><img src="{g('t10.jpg')}"/><span class="tag">Demo asset</span></div><div class="tx"><div class="mono" style="color:{BLUE}">World model</div><h3>SKY-001</h3><p>The first world model for the engineered world. From a prompt to parts, 3D CAD, BIM floor plans and buildings.</p><div class="acts"><span class="pb k">Meet SKY-001 {AR}</span><span class="pb ol">Technical report</span></div></div></div>
    <div class="pc"><div class="mc"><img src="{g('t2.jpg')}"/></div><div class="tx"><div class="mono" style="color:{BLUE}">Essay</div><h3>Engineering World Models</h3><p>Why next-token prediction does not transfer to the enterprise, and what a new Pareto frontier looks like.</p><div class="acts"><span class="pb k">Read the essay {AR}</span></div></div></div>
  </div></section>
<section class="sec" id="s8"><div class="hd"><div><div class="mono kick">Founding team</div><h2>Founded by early pioneers of deep learning</h2></div></div>
  <div class="story"><div class="q"><p>Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.</p><div class="who mono" style="margin-top:32px"><span>Maluuba → Microsoft → Skyfall AI</span></div></div>
    <div class="ppl">
      <div class="pp"><img src="{portrait('sam.jpg')}"/><div class="tx"><h3>Sam Pasupalak</h3><p>Co-founder · co-founded Maluuba</p></div></div>
      <div class="pp"><img src="{portrait('kaheer.jpg')}"/><div class="tx"><h3>Kaheer Suleman</h3><p>Co-founder · co-founded Maluuba</p></div></div>
      <div class="pp"><img src="{portrait('sumit.jpg')}"/><div class="tx"><h3>Sumit Pasupalak</h3><p>Co-founder · co-founded Ubiq (YC)</p></div></div>
    </div></div>
  <div class="stats"><div class="st"><b>30<i>+</i></b><span>years of combined experience across business, product, and AI research</span></div><div class="st"><b>25</b><span>engineers and researchers in a world class AI Research team</span></div><div class="st"><b>3</b><span>countries, and now shaping the next era of AI</span></div></div>
  <div class="strip"><div class="mono lbl">Our teams bring experience from</div>
    <div class="marks"><span>Maluuba</span><span>Microsoft</span><span>Waterloo</span><span>Y Combinator</span><span>MILA</span><span>Vector</span></div></div>
  <div class="strip" style="margin-top:72px"><div class="mono lbl">We're backed by</div>
    <div class="marks" style="padding:0 140px"><span>Fidelity</span><span>Touring Capital</span><span>M13</span><span>Inovia Capital</span></div>
    <div class="adv"><div><h3>François Chollet</h3><span>Advisor · Google · Keras · NDEA</span></div><div><h3>Naveen Rao</h3><span>Advisor · Intel · Databricks</span></div></div></div>
</section>
<div class="cta" id="s9"><img src="{g('t12.jpg')}"/><div class="sh"></div>
  <div class="t"><h2>Build the autonomous enterprise</h2><p>Join a world class AI Research team across three countries.</p>
  <div class="acts"><span class="pb w">Work with us {AR}</span><span class="pb o">See open roles</span></div></div></div>
<footer><div class="cols"><div><span class="logo" style="display:block;width:170px;height:21px;margin:0">{LW}</span><p>Engineering World Models for the autonomous enterprise.</p></div>
  <div><div class="mono h">Company</div><span>About</span><span>Team</span><span>Careers</span><span>Contact</span></div>
  <div><div class="mono h">Research</div><span>SKY-001</span><span>Technical report</span><span>Essays</span></div>
  <div><div class="mono h">Legal</div><span>Privacy Policy</span><span>Terms of Service</span></div></div>
  <div class="big">{LW}</div>
  <div class="copy mono"><span>© 2026 Skyfall AI. All rights reserved.</span><span>X · LinkedIn</span></div></footer>
</div>'''

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall Front Page · Twelve Labs style</title><style>{CSS}</style></head><body>{page()}</body></html>'
out = os.path.join(HERE, 'tl_inline.html' if INLINE else 'tl.html')
open(out, 'w').write(html)
print(out, len(html))

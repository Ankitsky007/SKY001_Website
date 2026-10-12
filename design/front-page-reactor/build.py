import base64, io, math
from PIL import Image

SP = '/tmp/claude-0/sp'
PF = '/mnt/project-files'

def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

def jpg(path, size, crop=None, q=82):
    im = Image.open(path).convert('RGB')
    if crop: im = im.crop(crop)
    im.thumbnail(size, Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode()

IMG = {k: b64(f'{SP}/img/{k}.png', 'image/png') for k in
       ['hero', 'hero_t', 'hero_m', 'cta', 'cta_m', 'slab', 'arc0', 'arc1', 'arc2', 'arc3', 'arc4']}
POR = {k: jpg(f'{PF}/brand/team-portraits/final/{k}.jpg', (640, 800)) for k in ['sam', 'kaheer', 'sumit']}
CAR = jpg(f'{PF}/idfm_marketing-ankit_exploration/asset_images/jaguar-e-type-roadster.png', (1200, 900))
CAR_T = jpg(f'{PF}/idfm_marketing-ankit_exploration/asset_images/jaguar-e-type-roadster.png', (180, 120), crop=(250, 300, 1850, 1350))
LOGO = open(f'{SP}/logo_white.svg').read()
LOGO = LOGO.replace('width="258" height="32"', 'width="100%" height="100%" preserveAspectRatio="xMinYMid meet"')
FONTS = ''.join(
    f"@font-face{{font-family:'{fam}';font-weight:{w};src:url({b64(f'{SP}/package/dist/fonts/{d}/{fn}.woff2','font/woff2')}) format('woff2')}}"
    for fam, d, fn, w in [('Geist', 'geist-sans', 'Geist-Regular', 400), ('Geist', 'geist-sans', 'Geist-Medium', 500),
                          ('Geist Mono', 'geist-mono', 'GeistMono-Regular', 400), ('Geist Mono', 'geist-mono', 'GeistMono-Medium', 500)])

W = 'rgba(248,248,250,'
BL = '#3E57DA'
BL2 = '#8C9EF0'

# ---------- line-art illustrations (viewBox 400x250) ----------
def svg(body, vb='0 0 400 250'):
    return f'<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" font-family="Geist Mono" preserveAspectRatio="xMidYMid meet">{body}</svg>'

def ripple_svg(cx=200, cy=125, scale=1.0, labels=True):
    s = ''
    for i, r in enumerate([18, 40, 66, 96]):
        s += f'<ellipse cx="{cx}" cy="{cy}" rx="{r*1.5*scale}" ry="{r*scale}" fill="none" stroke="{W}{0.5 - i*0.1})" stroke-width="1" {"stroke-dasharray=\"2 4\"" if i == 3 else ""}/>'
    names = ['SALES', 'DESIGN', 'ENGINEERING', 'SUPPORT', 'FINANCE', 'OPERATIONS']
    for k, n in enumerate(names):
        a = -math.pi / 2 + k * 2 * math.pi / 6 + 0.3
        x, y = cx + math.cos(a) * 144 * scale, cy + math.sin(a) * 96 * scale
        s += f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="{W}0.28)" stroke-width="1"/>'
        # small downstream steps along each spoke
        for t in [0.35, 0.55, 0.75]:
            s += f'<rect x="{cx + (x-cx)*t - 1.5:.1f}" y="{cy + (y-cy)*t - 1.5:.1f}" width="3" height="3" fill="{W}0.6)"/>'
        s += f'<rect x="{x-4:.1f}" y="{y-4:.1f}" width="8" height="8" fill="#06070A" stroke="{W}0.9)" stroke-width="1"/>'
        if labels:
            anchor = 'start' if x > cx + 5 else 'middle'
            dx = 10 if anchor == 'start' else 0
            dy = 3 if anchor == 'start' else (18 if y > cy else -10)
            s += f'<text x="{x+dx:.1f}" y="{y+dy:.1f}" font-size="{8*max(scale,1):.0f}" letter-spacing="1" fill="{W}0.7)" text-anchor="{anchor}">{n}</text>'
    s += f'<circle cx="{cx}" cy="{cy}" r="6" fill="{BL}"/><circle cx="{cx}" cy="{cy}" r="12" fill="none" stroke="{BL}" stroke-width="1"/>'
    return s

ILL_RIPPLE = svg(ripple_svg(200, 128, 0.95) + f'<text x="200" y="152" font-size="8" fill="{BL2}" text-anchor="middle" letter-spacing="1">1 DECISION</text>')

def tokens_vs_system():
    s = ''
    for i in range(9):
        x = 40 + i * 36
        s += f'<rect x="{x}" y="40" width="28" height="18" rx="2" fill="none" stroke="{W}{0.25 + i*0.06})"/>'
        if i < 8: s += f'<line x1="{x+28}" y1="49" x2="{x+36}" y2="49" stroke="{W}0.4)"/>'
    s += f'<text x="40" y="28" font-size="8" letter-spacing="1" fill="{W}0.5)">NEXT-TOKEN · ONE LINE</text>'
    nodes = [(70, 150), (130, 120), (130, 190), (200, 150), (250, 110), (260, 200), (320, 140), (340, 205), (190, 215), (300, 95)]
    edges = [(0,1),(0,2),(1,3),(2,3),(3,4),(3,5),(4,6),(5,6),(6,7),(2,8),(8,5),(4,9),(9,6),(1,4)]
    hidden = {5, 7, 8}
    for a, b in edges:
        (x1, y1), (x2, y2) = nodes[a], nodes[b]
        dash = 'stroke-dasharray="3 3"' if a in hidden or b in hidden else ''
        s += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{W}0.35)" {dash}/>'
    for i, (x, y) in enumerate(nodes):
        if i in hidden:
            s += f'<circle cx="{x}" cy="{y}" r="5" fill="#0B0C10" stroke="{W}0.35)" stroke-dasharray="2 2"/>'
        else:
            s += f'<circle cx="{x}" cy="{y}" r="5" fill="#0B0C10" stroke="{BL if i==3 else W+"0.85)"}" stroke-width="{1.5 if i==3 else 1}"/>'
    s += f'<text x="40" y="238" font-size="8" letter-spacing="1" fill="{W}0.5)">ENTERPRISE · PARTLY OBSERVABLE</text>'
    return svg(s)

def tacit_grid():
    s = ''
    import random
    random.seed(4)
    lit = set(random.sample(range(16*8), 14))
    for r in range(8):
        for c in range(16):
            x, y = 48 + c * 19.5, 38 + r * 20
            i = r * 16 + c
            if i in lit:
                s += f'<rect x="{x}" y="{y}" width="12" height="12" fill="{W}0.85)"/>'
            else:
                s += f'<rect x="{x+0.5}" y="{y+0.5}" width="11" height="11" fill="none" stroke="{W}0.18)" stroke-dasharray="2 2"/>'
    s += f'<rect x="48" y="210" width="8" height="8" fill="{W}0.85)"/><text x="62" y="217" font-size="8" letter-spacing="1" fill="{W}0.6)">WRITTEN DOWN</text>'
    s += f'<rect x="170.5" y="210.5" width="7" height="7" fill="none" stroke="{W}0.4)" stroke-dasharray="2 2"/><text x="184" y="217" font-size="8" letter-spacing="1" fill="{W}0.6)">NEVER WRITTEN DOWN</text>'
    return svg(s)

def iso_bars():
    # isometric bars: long grey = tokens burned by an LLM per decision; short blue = world model
    def bar(x, y, L, col, op):
        dx, dy = 0.87, 0.5
        p1 = (x, y); p2 = (x + L*dx, y - L*dy); h = 16; d = 22
        top = f'{x},{y} {x+L*dx},{y-L*dy} {x+L*dx+d*dx},{y-L*dy+d*dy} {x+d*dx},{y+d*dy}'
        front = f'{x+d*dx},{y+d*dy} {x+L*dx+d*dx},{y-L*dy+d*dy} {x+L*dx+d*dx},{y-L*dy+d*dy+h} {x+d*dx},{y+d*dy+h}'
        side = f'{x},{y} {x+d*dx},{y+d*dy} {x+d*dx},{y+d*dy+h} {x},{y+h}'
        return (f'<polygon points="{top}" fill="{col}" fill-opacity="{op}" stroke="{W}0.8)" stroke-width="1"/>'
                f'<polygon points="{front}" fill="#0B0C10" stroke="{W}0.8)" stroke-width="1"/>'
                f'<polygon points="{side}" fill="#0B0C10" stroke="{W}0.8)" stroke-width="1"/>')
    s = bar(70, 205, 280, '#ffffff', 0.04) + bar(70, 160, 40, BL, 1)
    s += f'<text x="70" y="240" font-size="8" letter-spacing="1" fill="{W}0.55)">LLM · TOKENS PER DECISION</text>'
    s += f'<text x="70" y="148" font-size="8" letter-spacing="1" fill="{BL2}">WORLD MODEL</text>'
    s += f'<text x="392" y="20" font-size="7" letter-spacing="1" fill="{W}0.35)" text-anchor="end">ILLUSTRATIVE</text>'
    return svg(s)

def sphere_svg():
    cx, cy, R = 330, 230, 150
    s = f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{W}0.55)"/>'
    for k in [0.25, 0.55, 0.85]:
        s += f'<ellipse cx="{cx}" cy="{cy}" rx="{R*k:.0f}" ry="{R}" fill="none" stroke="{W}0.3)"/>'
    for t in [-0.66, -0.33, 0, 0.33, 0.66]:
        y = cy + R * t; rx = R * math.sqrt(1 - t*t)
        s += f'<ellipse cx="{cx}" cy="{y:.0f}" rx="{rx:.0f}" ry="{rx*0.18:.0f}" fill="none" stroke="{W}0.3)"/>'
    pts = {'SALES': (-0.55, -0.45), 'DESIGN': (0.15, -0.72), 'ENGINEERING': (0.62, -0.3),
           'SUPPORT': (-0.7, 0.2), 'FINANCE': (0.05, 0.55), 'OPERATIONS': (0.6, 0.42)}
    P = {k: (cx + R*a, cy + R*b) for k, (a, b) in pts.items()}
    for a, b in [('SALES','DESIGN'),('DESIGN','ENGINEERING'),('ENGINEERING','OPERATIONS'),('OPERATIONS','FINANCE'),('FINANCE','SUPPORT'),('SUPPORT','SALES'),('DESIGN','FINANCE')]:
        (x1, y1), (x2, y2) = P[a], P[b]
        mx, my = (x1+x2)/2 + (cy-(y1+y2)/2)*0.15, (y1+y2)/2 - 30
        s += f'<path d="M{x1:.0f} {y1:.0f} Q{mx:.0f} {my:.0f} {x2:.0f} {y2:.0f}" fill="none" stroke="{BL2}" stroke-width="1.2" stroke-dasharray="5 4"/>'
    for k, (x, y) in P.items():
        s += f'<rect x="{x-4:.0f}" y="{y-4:.0f}" width="8" height="8" fill="{BL if k=="DESIGN" else "#06070A"}" stroke="#fff"/>'
        s += f'<text x="{x+9:.0f}" y="{y-7:.0f}" font-size="9" letter-spacing="1.2" fill="#fff">{k}</text>'
    return svg(s, '0 0 680 460')

def pareto_svg():
    s = ''
    for i in range(5):
        y = 30 + i * 45
        s += f'<line x1="50" y1="{y}" x2="560" y2="{y}" stroke="{W}0.08)"/>'
    s += f'<line x1="50" y1="210" x2="560" y2="210" stroke="{W}0.4)"/><line x1="50" y1="20" x2="50" y2="210" stroke="{W}0.4)"/>'
    s += f'<text x="560" y="228" font-size="9" letter-spacing="1" fill="{W}0.5)" text-anchor="end">COST →</text>'
    s += f'<text x="44" y="24" font-size="9" letter-spacing="1" fill="{W}0.5)" text-anchor="end">QUALITY</text>'
    # old frontier (grey) and new frontier (blue)
    s += f'<path d="M110 200 C 200 160, 330 70, 540 52" fill="none" stroke="{W}0.35)" stroke-width="1.5" stroke-dasharray="4 4"/>'
    s += f'<path d="M60 150 C 90 70, 160 42, 300 34" fill="none" stroke="{BL}" stroke-width="2.5"/>'
    for x, y in [(160, 176), (230, 140), (330, 96), (430, 70), (520, 58)]:
        s += f'<circle cx="{x}" cy="{y}" r="4" fill="#0B0C10" stroke="{W}0.6)"/>'
    for x, y in [(78, 104), (120, 60), (190, 42)]:
        s += f'<circle cx="{x}" cy="{y}" r="5" fill="{BL}"/>'
    s += f'<text x="400" y="122" font-size="9" letter-spacing="1" fill="{W}0.6)">HUMAN TEAMS · LLMS</text>'
    s += f'<text x="206" y="66" font-size="9" letter-spacing="1" fill="{BL2}">ENGINEERING WORLD MODELS</text>'
    s += f'<text x="560" y="14" font-size="8" letter-spacing="1" fill="{W}0.35)" text-anchor="end">ILLUSTRATIVE</text>'
    return svg(s, '0 0 580 240')

HERO_RIPPLE = svg(ripple_svg(310, 300, 1.3), '0 0 620 600')
HERO_RIPPLE_M = svg(ripple_svg(310, 300, 1.45, labels=False), '0 0 620 600')

# ---------- page ----------
CSS = FONTS + f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:#1a1a1a;font-family:'Geist',sans-serif;color:#F8F8FA;-webkit-font-smoothing:antialiased}}
.wrap{{display:flex;gap:120px;align-items:flex-start;padding:80px}}
.f{{background:#06070A;overflow:hidden;position:relative;flex:none}}
.f.d{{width:1440px}} .f.t{{width:834px}} .f.m{{width:390px}}
.c{{margin:0 auto;padding:0 82px}} .t .c{{padding:0 32px}} .m .c{{padding:0 16px}}
.mono{{font-family:'Geist Mono',monospace;text-transform:uppercase;letter-spacing:.12em;font-size:11px;color:{W}.55)}}
.blue{{color:{BL2}}}
.top{{height:48px;display:flex;align-items:center;gap:20px;border-bottom:1px solid {W}.09);font-size:14px;color:{W}.85)}}
.pill{{font-family:'Geist Mono';font-size:10px;letter-spacing:.1em;padding:3px 9px;border-radius:999px;background:{BL}33;color:{BL2};border:1px solid {BL}66}}
.top .x{{margin-left:auto;color:{W}.5)}}
.nav{{height:58px;display:flex;align-items:center;gap:28px;border-bottom:1px solid {W}.09)}}
.logo{{width:150px;height:19px;display:block}}
.nav .links{{display:flex;gap:28px;margin-left:auto;font-size:14px;color:{W}.65)}}
.nav .sep{{width:1px;height:20px;background:{W}.15)}}
.btn{{font-family:'Geist Mono';text-transform:uppercase;letter-spacing:.08em;font-size:12px;padding:0 22px;height:44px;display:inline-flex;align-items:center;border-radius:6px;background:{BL};color:#fff;box-shadow:inset 0 0 0 1px #6F83F0}}
.btn.s{{height:34px;padding:0 14px;font-size:11px}}
.btn.g{{background:{W}.04);box-shadow:inset 0 0 0 1px {W}.42)}}
.burger{{margin-left:auto;width:44px;height:44px;display:flex;flex-direction:column;justify-content:center;gap:6px;align-items:center}}
.burger i{{display:block;width:20px;height:1.5px;background:#fff}}
.hero{{position:relative;height:794px;overflow:hidden}}
.t .hero{{height:900px}} .m .hero{{height:760px}}
.hero .bg{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.hero .scrim{{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 20% 58%,rgba(0,0,0,.7),rgba(0,0,0,.25) 55%,transparent 80%)}}
.hero .rip{{position:absolute;right:-40px;top:-50px;width:620px;height:600px;opacity:.95}}
.t .hero .rip{{right:-40px;top:200px;width:420px;height:400px}}
.m .hero .rip{{right:-40px;top:0px;width:360px;height:350px;opacity:.85}}
.hero .in{{position:relative;height:100%;display:flex;flex-direction:column;padding-top:40px}}
.chip{{display:flex;gap:14px;align-items:center;padding:6px 18px 6px 6px;border:1px solid {W}.1);border-radius:10px;background:rgba(0,0,0,.6);width:max-content;margin-bottom:8px}}
.chip img,.chip .th{{width:86px;height:48px;border-radius:6px;object-fit:cover;background:#111}}
.chip b{{font-weight:500;font-size:14px;color:#fff}} .chip u{{text-decoration:none;color:{BL2}}}
.chip small{{display:block;font-size:13px;color:{W}.6);margin-top:3px}}
h1{{font-weight:500;font-size:84px;line-height:.94;letter-spacing:-.045em;max-width:860px;margin-top:auto}}
.t h1{{font-size:72px;max-width:700px}} .m h1{{font-size:46px;letter-spacing:-.04em}}
.hero p.lead{{font-size:20px;line-height:1.5;color:{W}.85);max-width:560px;margin:26px 0 30px}}
.m .hero p.lead{{font-size:17px}}
.backed{{margin-top:56px;padding-bottom:36px}}
.backed .row{{display:flex;justify-content:space-between;align-items:center;margin-top:20px;font-size:26px;font-weight:500;letter-spacing:-.02em;color:{W}.88)}}
.t .backed .row{{font-size:20px}} .m .backed .row{{flex-wrap:wrap;gap:14px 24px;justify-content:flex-start;font-size:17px}}
.backed .row span:nth-child(2){{font-family:'Geist Mono';font-size:.75em;letter-spacing:.06em}}
.backed .row span:nth-child(3){{font-weight:400;font-size:1.15em}}
.divider{{height:1px;background:linear-gradient(90deg,{W}.09),{BL2} 70%,{W}.09) 72%)}}
section{{padding:120px 0}} .t section{{padding:96px 0}} .m section{{padding:72px 0}}
h2{{font-weight:500;font-size:56px;line-height:1;letter-spacing:-.04em}}
.t h2{{font-size:44px}} .m h2{{font-size:34px}}
h3{{font-weight:500;font-size:22px;letter-spacing:-.02em;line-height:1.2}}
p{{font-size:16px;line-height:1.55;color:{W}.7)}}
.statement h2{{font-size:64px;max-width:1150px;margin-top:22px}} .t .statement h2{{font-size:46px}} .m .statement h2{{font-size:32px}}
.split{{display:grid;grid-template-columns:420px 1fr;gap:80px;align-items:start}}
.t .split,.m .split{{grid-template-columns:1fr;gap:40px}}
.split .side h2{{margin-top:22px}}
.grid2{{display:grid;grid-template-columns:1fr 1fr;gap:16px}} .m .grid2{{grid-template-columns:1fr}}
.card{{border:1px solid {W}.1);border-radius:10px;background:radial-gradient(circle at 30% 0%,#17181d,#0c0d10);overflow:hidden;position:relative}}
.card .ill{{height:250px;position:relative;border-bottom:1px solid {W}.08)}}
.card .ill img.tex{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.22}}
.card .ill .svg{{position:absolute;inset:14px}}
.card .body{{padding:22px 22px 26px}} .card .body p{{margin-top:12px;font-size:15px}}
.m .card .ill{{height:210px}}
.slab{{display:grid;grid-template-columns:1fr 1.05fr;min-height:470px;margin-top:56px}}
.t .slab,.m .slab{{grid-template-columns:1fr}}
.slab .txt{{padding:48px}} .m .slab .txt{{padding:28px 22px}}
.slab .txt p{{margin-top:18px;font-size:17px;color:{W}.78)}}
.checks{{margin-top:26px;display:grid;gap:12px}}
.checks div{{display:flex;gap:12px;font-size:15px;color:{W}.75)}} .checks div:before{{content:'✓';color:{BL2}}}
.slab .vis{{position:relative;min-height:460px;overflow:hidden}}
.m .slab .vis{{min-height:320px}}
.slab .vis img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.slab .vis .svg{{position:absolute;inset:0}}
.tag{{position:absolute;left:18px;bottom:18px;font-family:'Geist Mono';font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding:7px 12px;border-radius:5px;background:rgba(0,0,0,.75);border:1px solid {W}.15);color:#fff}}
.row3{{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:16px}} .t .row3,.m .row3{{grid-template-columns:1fr}}
.chart{{padding:26px}} .chart .svg{{height:300px;margin-top:10px}} .m .chart .svg{{height:180px}}
.csq{{padding:28px;display:flex;flex-direction:column}}
.csq .k{{display:grid;grid-template-columns:1fr auto;border-top:1px solid {W}.1);padding:14px 0;font-family:'Geist Mono';font-size:12px;letter-spacing:.12em;color:{W}.6)}}
.csq .k b{{font-weight:500;color:#fff}}
.dream{{position:relative;overflow:hidden}}
.dream h2{{max-width:1100px;margin-top:22px}}
.sectors{{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:56px}}
.t .sectors,.m .sectors{{grid-template-columns:1fr 1fr}}
.sector{{aspect-ratio:4/5;padding:22px;display:flex;flex-direction:column;justify-content:space-between}}
.m .sector{{padding:16px}}
.sector img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.sector>*{{position:relative}}
.sector h3{{font-size:26px}} .m .sector h3{{font-size:20px}}
.wire{{display:flex;align-items:center;gap:0}}
.wire .plate{{white-space:nowrap;height:40px;padding:0 14px;display:flex;align-items:center;border:1px solid {W}.3);border-radius:5px;font-weight:500;font-size:18px;letter-spacing:-.01em}}
.wire .ln{{width:70px;height:1px;background:{BL}99;position:relative}} .wire .ln i{{position:absolute;left:30px;top:-4px;width:9px;height:9px;border-radius:50%;background:{BL2};box-shadow:0 0 10px {BL}}}
.team{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:56px}} .m .team{{grid-template-columns:1fr}}
.person img{{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;filter:grayscale(1) contrast(1.05)}}
.person .body{{padding:18px 20px 22px}} .person .mono{{margin-top:8px;font-size:10px}}
.stats{{display:grid;grid-template-columns:repeat(4,1fr);margin-top:16px}} .t .stats,.m .stats{{grid-template-columns:1fr 1fr}}
.stats>div{{padding:28px;border-right:1px solid {W}.08)}} .m .stats>div{{padding:20px 16px}}
.stats .v{{font-size:38px;font-weight:500;letter-spacing:-.04em;margin:10px 0 6px}} .m .stats .v{{font-size:30px}}
.stats p{{font-size:14px;margin-top:12px}}
.orgs{{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:{W}.08);border:1px solid {W}.08);border-radius:10px;overflow:hidden;margin-top:24px}}
.t .orgs{{grid-template-columns:repeat(3,1fr)}} .m .orgs{{grid-template-columns:1fr 1fr}}
.orgs div{{background:#0A0B0E;height:92px;display:flex;align-items:center;justify-content:center;font-weight:500;font-size:17px;color:{W}.8);text-align:center;padding:0 10px}}
.inv{{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:48px}} .m .inv{{grid-template-columns:1fr 1fr}}
.inv .card{{height:130px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:500;letter-spacing:-.02em}}
.m .inv .card{{height:96px;font-size:18px}}
.adv{{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}} .m .adv{{grid-template-columns:1fr}}
.adv .card{{padding:28px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px}} .m .adv .card{{flex-direction:column;align-items:flex-start}}
.adv h3{{font-size:30px;margin-top:10px}}
.aff{{display:flex;gap:8px;flex-wrap:wrap}} .aff span{{font-family:'Geist Mono';font-size:11px;letter-spacing:.1em;padding:8px 12px;border:1px solid {W}.2);border-radius:5px;color:{W}.8)}}
.cta{{position:relative;height:480px;overflow:hidden;border-top:1px solid {W}.09)}} .m .cta{{height:560px}}
.cta img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.cta .in{{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center}} .m .cta .in{{justify-content:flex-start;padding-top:64px}}
.cta h2{{font-size:64px}} .t .cta h2{{font-size:48px}} .m .cta h2{{font-size:36px}}
.cta p{{font-size:18px;max-width:600px;margin:20px 0 30px;color:{W}.8)}}
.btns{{display:flex;gap:10px}}
footer{{padding:56px 0 40px;border-top:1px solid {W}.09)}}
.foot{{display:flex;justify-content:space-between;gap:40px}} .m .foot{{flex-direction:column}}
.foot .cols{{display:flex;gap:80px}} .m .foot .cols{{gap:48px}}
.foot .cols div{{display:flex;flex-direction:column;gap:12px;font-size:14px;color:{W}.7)}}
.legal{{display:flex;justify-content:space-between;margin-top:64px}} .m .legal{{flex-direction:column;gap:10px}}
.note{{font-family:'Geist Mono';font-size:10px;letter-spacing:.1em;color:{W}.35);text-transform:uppercase;margin-top:14px}}
"""

def page(bp):
    d, t, m = bp == 'd', bp == 't', bp == 'm'
    hero_bg = {'d': 'hero', 't': 'hero_t', 'm': 'hero_m'}[bp]
    nav_right = ('<div class="burger"><i></i><i></i><i></i></div>' if m else
                 f'<div class="links"><span>Research</span><span>SKY-001</span><span>Team</span><span>Careers</span></div>'
                 f'<div class="sep"></div><span style="font-size:14px;color:{W}.65)">Contact</span><span class="btn s">Talk to us</span>')
    if t:
        nav_right = f'<div class="links"><span>Research</span><span>SKY-001</span><span>Team</span></div><span class="btn s">Talk to us</span>'
    top = ('<div class="top c"><span class="pill">NEW</span><span>Introducing SKY-001 ›</span><span class="x">✕</span></div>' if m else
           '<div class="top c"><span class="pill">NEW</span><span>Introducing SKY-001, the first world model for the engineered world ›</span><span>Read the technical report ›</span><span class="x">✕</span></div>')
    chips = ('' if m else f'''
      <div class="chip"><img src="{CAR_T}"/><div><b><u>SKY-001</u> is live</b><small>First World Model for the Engineered World →</small></div></div>
      <div class="chip"><img src="{IMG['arc3']}"/><div><b>Engineering World Models for the autonomous enterprise</b><small>Read the research →</small></div></div>''')
    hero = f'''
    <div class="hero">
      <img class="bg" src="{IMG[hero_bg]}"/>
      <div class="rip">{HERO_RIPPLE_M if (m or t) else HERO_RIPPLE}</div>
      <div class="scrim"></div>
      <div class="c in">
        {chips}
        <h1>Autonomous Business for the Post-Monolithic Era</h1>
        <p class="lead">We're enabling the future where an entire business can operate autonomously.</p>
        <div><span class="btn">Read the research</span></div>
        <div class="backed"><div class="mono" style="text-align:{'left' if m else 'center'}">Backed by</div>
          <div class="row"><span>Fidelity</span><span>TOURING CAPITAL</span><span>M13</span><span>Inovia Capital</span></div></div>
      </div>
    </div>'''
    statement = f'''
    <section class="statement"><div class="c">
      <div class="mono">Mission</div>
      <h2>Our mission is to build the foundation infrastructure for autonomous enterprise through Engineering World Models.</h2>
    </div></section><div class="divider"></div>'''
    cards = [
        (ILL_RIPPLE, 'arc0', 'Long horizon', 'A single decision ripples through thousands of downstreams steps from design, engineering, finance, operations, customer service and sales.'),
        (tokens_vs_system(), 'arc1', 'Partly observable, always changing', 'Autoregressive next-token prediction has been astonishingly successful for language. But an enterprise is a living system of parts, processes and decisions that is only partly observable and constantly changing, and next-token prediction does not transfer well here.'),
        (tacit_grid(), 'arc2', 'Never written down', 'Much of what a business knows is however never written down.'),
        (iso_bars(), 'arc4', 'Token-hungry', 'Large language models are pretrained on internet corpora and depend on in-context conditions which cannot keep pace with a rapidly changing business, and burn vast numbers of tokens per decision.'),
    ]
    cards_html = ''.join(f'<div class="card"><div class="ill"><img class="tex" src="{IMG[tex]}"/><div class="svg">{s}</div></div><div class="body"><h3>{h}</h3><p>{p}</p></div></div>' for s, tex, h, p in cards)
    problem = f'''
    <section><div class="c split">
      <div class="side"><div class="mono">01 · The problem</div><h2>Enterprise work is long horizon, constrained and always evolving.</h2></div>
      <div class="grid2">{cards_html}</div>
    </div></section><div class="divider"></div>'''
    engineered = f'''
    <section><div class="c">
      <div class="mono">02 · Research</div>
      <h2 style="margin-top:22px">AI for the Engineered World</h2>
      <div class="card slab">
        <div class="txt">
          <div class="mono blue">Engineering World Models</div>
          <p>Skyfall AI is developing Engineering World Models that learns the latent space of an enterprise across core functions: sales, design, engineering, customer support, finance and operations. These advanced models can simulate cause-and-effect relationships between functions and plan over long horizons to accomplish highly complex tasks, subject to safety guardrails.</p>
          <div class="checks"><div>Learns the latent space across six core functions</div><div>Simulates cause and effect between functions</div><div>Plans over long horizons, subject to safety guardrails</div></div>
        </div>
        <div class="vis"><img src="{IMG['slab']}"/><div class="svg">{sphere_svg()}</div><span class="tag">Latent space of an enterprise</span></div>
      </div>
      <div class="row3">
        <div class="card chart"><div class="mono">A new Pareto frontier</div><div class="svg">{pareto_svg()}</div></div>
        <div class="card csq">
          <p style="font-size:17px;color:{W}.8)">By exploring far more of the solution space than any human team or language model can, they push enterprises onto a new Pareto frontier, where cost, speed, and quality no longer have to be traded against each other.</p>
          <div style="margin-top:auto;padding-top:28px"><div class="k"><span>Cost</span><b>↓</b></div><div class="k"><span>Speed</span><b>↑</b></div><div class="k"><span>Quality</span><b>↑</b></div></div>
        </div>
      </div>
    </div></section><div class="divider"></div>'''
    sectors = ''.join(f'<div class="card sector"><img src="{IMG[a]}"/><div class="mono">Sector 0{i+1}</div><h3>{n}</h3></div>'
                      for i, (n, a) in enumerate([('Industrial', 'arc0'), ('Healthcare', 'arc1'), ('Chemical', 'arc2'), ('Enterprise', 'arc3')]))
    dream = f'''
    <section class="dream"><div class="c">
      <div class="mono">03 · Dream, then execute</div>
      <h2>With world models, AI systems can ‘dream’ what a successful business requires, and then execute it.</h2>
      <p style="margin-top:28px;max-width:720px;font-size:18px">We are building the foundation infrastructure for the software that powers enterprises. Skyfall AI will advance AI research and develop AI systems for the engineered world where long horizon planning, adaptability, and reliability really matter, especially for the industrial, healthcare, chemical, enterprise sectors and beyond.</p>
      <div class="sectors">{sectors}</div>
    </div></section><div class="divider"></div>'''
    sky = f'''
    <section><div class="c">
      <div class="card slab" style="margin-top:0">
        <div class="txt">
          <div class="wire"><span class="plate" style="width:140px;height:40px"><span class="logo" style="width:112px;height:14px">{LOGO}</span></span><span class="ln"><i></i></span><span class="plate">SKY-001</span></div>
          <div class="mono blue" style="margin-top:26px">Our first model</div>
          <h2 style="margin-top:16px;font-size:{40 if not m else 30}px">First World Model for the Engineered World</h2>
          <div class="checks"><div>Prompt to hierarchical parts, 3D CAD, BIM floor plans and buildings</div><div>150x cheaper and 51x faster than frontier LLMs on per-part sketch modelling</div><div>Equal accuracy: 79.7% on 3D CAD, 43.6% on BIM</div></div>
          <div style="margin-top:30px"><span class="btn g">Meet SKY-001</span></div>
        </div>
        <div class="vis" style="background:#000"><img src="{CAR}" style="object-fit:cover;transform:scale(1.15)"/><span class="tag">SKY-001 output · 3D CAD</span></div>
      </div>
    </div></section><div class="divider"></div>'''
    people = [('sam', 'Sam Pasupalak', 'Co-founder · Maluuba co-founder'), ('kaheer', 'Kaheer Suleman', 'Co-founder · Maluuba co-founder'), ('sumit', 'Sumit Pasupalak', 'Co-founder · Ubiq (YC) co-founder')]
    people_html = ''.join(f'<div class="card person"><img src="{POR[k]}"/><div class="body"><h3>{n}</h3><div class="mono">{r}</div></div></div>' for k, n, r in people)
    stats = [('Experience', '30+ yrs', 'Combined', 'Across business, product, and AI research.'),
             ('Team', '25', 'Researchers & engineers', 'A world class AI Research team.'),
             ('Footprint', '3', 'Countries', 'Operating across three countries.'),
             ('Track record', 'Microsoft', 'Acquired Maluuba', 'Turned into its research lab in Canada.')]
    stats_html = ''.join(f'<div><div class="mono">{a}</div><div class="v">{v}</div><div class="mono" style="font-size:10px">{u}</div><p>{p}</p></div>' for a, v, u, p in stats)
    team = f'''
    <section><div class="c">
      <div class="split">
        <div class="side"><div class="mono">04 · Founding team</div><h2>Founding Team</h2></div>
        <div><p style="font-size:18px;color:{W}.8)">Founded by Maluuba co-founders Sam Pasupalak and Kaheer Suleman, together with Sumit Pasupalak, Skyfall AI is building AI that understands the physical world. Sam and Kaheer were early pioneers of deep learning. They built Maluuba with advisors Yoshua Bengio and Richard Sutton, and Microsoft acquired it and turned it into its research lab in Canada. Sumit previously co-founded Ubiq, a Y Combinator company.</p>
        <p style="font-size:18px;margin-top:18px;color:{W}.8)">Together, they bring more than 30 years of combined experience across business, product, and AI research, and they are now shaping the next era of AI.</p></div>
      </div>
      <div class="team">{people_html}</div>
      <div class="card stats">{stats_html}</div>
      <p style="margin-top:72px;font-size:18px;color:#fff">Skyfall AI has assembled a world class AI Research team of 25 engineers and researchers operating across three countries.</p>
      <div class="mono" style="margin-top:28px">Our teams bring experience from</div>
      <div class="orgs"><div>Maluuba</div><div>Microsoft</div><div>University of Waterloo</div><div>Y Combinator</div><div>MILA</div><div>Vector Institute</div></div>
    </div></section><div class="divider"></div>'''
    backers = f'''
    <section><div class="c">
      <div class="mono">05 · Backers</div>
      <h2 style="margin-top:22px;max-width:900px">We're grateful for the support of our investors and advisors</h2>
      <div class="inv"><div class="card">Fidelity</div><div class="card" style="font-family:'Geist Mono';font-size:{18 if not m else 14}px;letter-spacing:.06em">TOURING CAPITAL</div><div class="card">M13</div><div class="card" style="font-weight:400">Inovia Capital</div></div>
      <div class="adv">
        <div class="card"><div><div class="mono">Advisor</div><h3>François Chollet</h3></div><div class="aff"><span>Google</span><span>Keras</span><span>NDEA</span></div></div>
        <div class="card"><div><div class="mono">Advisor</div><h3>Naveen Rao</h3></div><div class="aff"><span>Intel</span><span>Databricks</span></div></div>
      </div>
      <div class="note">Logo plates are typeset placeholders until official SVGs arrive</div>
    </div></section>'''
    cta = f'''
    <div class="cta"><img src="{IMG['cta_m' if m else 'cta']}"/>
      <div class="c in"><h2>Build the autonomous enterprise with us.</h2>
        <p>Skyfall AI is hiring researchers and engineers across three countries.</p>
        <div class="btns"><span class="btn">See open roles</span><span class="btn g">Talk to us</span></div></div></div>'''
    footer = f'''
    <footer><div class="c">
      <div class="foot"><div><span class="logo">{LOGO}</span><p style="margin-top:16px;max-width:320px;font-size:14px">Engineering World Models for the autonomous enterprise.</p></div>
        <div class="cols"><div><span class="mono">Company</span><span>Research</span><span>SKY-001</span><span>Team</span></div><div><span class="mono">Connect</span><span>Careers</span><span>Contact</span><span>X / LinkedIn</span></div></div></div>
      <div class="legal"><span class="mono">© 2026 Skyfall AI</span><span class="mono">Privacy · Terms</span></div>
    </div></footer>'''
    name = {'d': 'Desktop 1440', 't': 'Tablet 834', 'm': 'Mobile 390'}[bp]
    return f'<div class="f {bp}" data-name="Skyfall Front Page · Reactor style · {name}">{top}<div class="nav c"><span class="logo">{LOGO}</span>{nav_right}</div>{hero}{statement}{problem}{engineered}{dream}{sky}{team}{backers}{cta}{footer}</div>'

def doc(bps):
    return f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall Front Page</title><style>{CSS}</style></head><body><div class="wrap">{"".join(page(b) for b in bps)}</div></body></html>'

if __name__ == '__main__':
    open(f'{SP}/front.html', 'w').write(doc(['d', 't', 'm']))
    for b in 'dtm':
        open(f'{SP}/front_{b}.html', 'w').write(doc([b]))
    print('ok')

"""SKY-001 model page, General Intuition-inspired version (desktop 1440).
Reuses the front page GI study's grid, type and ASCII-mosaic imagery (build_gi.py header + ascii.py).
Usage: python3 build_sky.py [--inline] -> sky.html or sky_inline.html."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'build_gi.py')).read()
ns = {'__file__': os.path.join(HERE, 'build_gi.py')}
exec(src[:src.index('def tokens_chart')], ns)
INLINE, img, portrait, LOGO, CSS0 = ns['INLINE'], ns['img'], ns['portrait'], ns['LOGO'], ns['CSS']
BG, LINE, W1, W2, W3, BLUE, M, COL = [ns[k] for k in ('BG', 'LINE', 'W1', 'W2', 'W3', 'BLUE', 'M', 'COL')]
DIM = '#5d5d6c'

CSS = CSS0 + f"""
.hero .card .news{{display:flex;align-items:center;gap:18px;margin-top:30px;padding-top:20px;border-top:1px solid #e4e4ea;font-size:15px;color:#111}}
.hero .card .news .mono{{color:#7c7c8a;font-size:11px;white-space:nowrap}}
.hero .card .news b{{font-weight:500;letter-spacing:-.01em;flex:1}}
.hero .card .news i{{font-style:normal;font-family:'Geist Mono';font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:{BLUE};white-space:nowrap}}
.hero .card .acts{{display:flex;gap:12px;margin-top:28px}}
.hero .card .acts .btn{{background:#000;color:#fff}}
.hero .card .acts .btn.k{{background:#fff;color:#000;border:1px solid #c9c9d2}}
.hero .nav{{position:absolute;right:{M+24}px;top:48px;z-index:4;display:flex;gap:28px;align-items:center}}
.hero .nav a{{color:#fff;font-size:15px;text-decoration:none}}
.intro h3{{font-size:24px;font-weight:400;letter-spacing:-.02em;color:#fff;margin-top:12px}}
.intro h2{{font-size:46px;line-height:1.06;letter-spacing:-.035em;margin-top:40px}}
.cells3{{display:grid;grid-template-columns:repeat(3,1fr)}}
.cells3>div{{border-right:1px solid {LINE};padding:28px 24px 40px}}
.cells3>div:last-child{{border-right:0}}
.cells3 h3{{font-size:24px;font-weight:400;letter-spacing:-.02em;margin-top:14px}}
.cells3 p{{font-size:16px;margin-top:14px;line-height:1.5}}
.stats4{{display:grid;grid-template-columns:repeat(4,1fr)}}
.stats4>div{{padding:36px 24px 40px;border-right:1px solid {LINE}}}
.stats4>div:last-child{{border-right:0}}
.stats4 b{{display:block;font-weight:300;font-size:88px;letter-spacing:-.05em;line-height:1}}
.stats4 b small{{font-size:40px;letter-spacing:-.03em;color:{W2}}}
.stats4 span{{display:block;font-size:16px;color:{W2};margin-top:16px;line-height:1.45}}
.stats4 .mono{{margin-bottom:22px}}
.race>div{{padding:28px 24px 32px}}
.race .t{{display:flex;justify-content:space-between;align-items:baseline;margin-top:14px}}
.race .t h3{{margin-top:0}}
.race .t b{{font-family:'Geist Mono';font-weight:400;font-size:28px;letter-spacing:-.02em}}
.race svg{{display:block;margin-top:22px}}
.race .st{{margin-top:16px;font-family:'Geist Mono';font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:{W3}}}
.race .st.ok{{color:#8fa2ff}}
.stages{{display:grid;grid-template-columns:1fr 1fr}}
.stages>div{{border-right:1px solid {LINE}}}
.stages>div:nth-child(2n){{border-right:0}}
.stages>div:nth-child(n+3){{border-top:1px solid {LINE}}}
.stages img,.stages canvas.asc{{width:{COL*4}px;height:400px}}
.stages .lab{{padding:28px 24px 40px;border-top:1px solid {LINE}}}
.stages h3{{font-size:26px;font-weight:400;letter-spacing:-.02em;margin-top:12px;line-height:1.15}}
.stages p{{font-size:16px;margin-top:14px}}
.faq{{display:grid;grid-template-columns:{COL*4}px {COL*4}px}}
.faq ul{{list-style:none}}
.faq li{{border-bottom:1px solid {LINE};padding:22px 24px}}
.faq li:last-child{{border-bottom:0}}
.faq li .q{{display:flex;justify-content:space-between;gap:24px;font-size:18px;letter-spacing:-.01em}}
.faq li .q i{{font-style:normal;font-family:'Geist Mono';color:{W3}}}
.faq li .a{{font-size:16px;color:{W2};margin-top:12px}}
.people{{display:grid;grid-template-columns:repeat(3,1fr)}}
.people>div{{padding:24px 24px 28px;border-right:1px solid {LINE}}}
.people>div:last-child{{border-right:0}}
.people h3{{font-size:20px;font-weight:400;letter-spacing:-.02em;margin-top:12px}}
"""

def xlog(v, x0, x1, lo=-3, hi=0):
    return x0 + (math.log10(v) - lo) / (hi - lo) * (x1 - x0)

def scatter(title, pts, ylo, yhi, ystep, frontier, lab_pos):
    """Odyssey-style benchmark scatter: log cost axis, IoU axis, callout labels, joined frontier lines."""
    W, H, L, R, T, B = 560, 400, 56, 20, 24, 64
    X = lambda v: xlog(v, L, W - R)
    Y = lambda v: T + (yhi - v) / (yhi - ylo) * (H - T - B)
    s = f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    v = ylo
    while v <= yhi + 1e-6:
        y = Y(v)
        s += f'<line x1="{L}" y1="{y:.1f}" x2="{W-R}" y2="{y:.1f}" stroke="rgba(255,255,255,.07)"/>'
        s += f'<text x="{L-10}" y="{y+4:.1f}" font-size="12" fill="{W3}" text-anchor="end" font-family="Geist Mono">{v:g}%</text>'
        v += ystep
    for c, lab in [(0.001, '$0.001'), (0.01, '$0.01'), (0.1, '$0.10'), (1, '$1.00')]:
        x = X(c)
        s += f'<line x1="{x:.1f}" y1="{T}" x2="{x:.1f}" y2="{H-B}" stroke="rgba(255,255,255,.05)"/>'
        s += f'<line x1="{x:.1f}" y1="{H-B}" x2="{x:.1f}" y2="{H-B+5}" stroke="{W3}"/>'
        s += f'<text x="{x:.1f}" y="{H-B+20}" font-size="12" fill="{W3}" text-anchor="middle" font-family="Geist Mono">{lab}</text>'
    s += f'<line x1="{L}" y1="{H-B}" x2="{W-R}" y2="{H-B}" stroke="{W3}"/><line x1="{L}" y1="{T}" x2="{L}" y2="{H-B}" stroke="{W3}"/>'
    s += f'<text x="{(L+W-R)/2:.0f}" y="{H-14}" font-size="12" fill="{W2}" text-anchor="middle">Cost per part (USD, log scale)</text>'
    s += f'<text transform="translate(14 {(T+H-B)/2:.0f}) rotate(-90)" font-size="12" fill="{W2}" text-anchor="middle">Accuracy (IoU)</text>'
    s += f'<text x="{W-R}" y="{T-8}" font-size="11" fill="{W3}" text-anchor="end" font-family="Geist Mono">BETTER: UP AND TO THE LEFT ↖</text>'
    P = {n: (X(c), Y(a)) for n, c, a in pts}
    s += '<polyline points="' + ' '.join(f'{P[n][0]:.1f},{P[n][1]:.1f}' for n in frontier) + f'" fill="none" stroke="{DIM}" stroke-width="1.5" stroke-dasharray="4 4"/>'
    sky = P['SKY-001']; best = P[frontier[-1]]
    s += f'<line x1="{sky[0]:.1f}" y1="{sky[1]:.1f}" x2="{best[0]:.1f}" y2="{sky[1]:.1f}" stroke="{BLUE}" stroke-width="1.5"/>'
    for n, c, a in pts:
        x, y = P[n]; dx, dy, anc = lab_pos.get(n, (10, -10, 'start'))
        me = n == 'SKY-001'
        if me:
            s += f'<rect x="{x-7:.1f}" y="{y-7:.1f}" width="14" height="14" fill="{BLUE}"/>'
        else:
            s += f'<rect x="{x-4.5:.1f}" y="{y-4.5:.1f}" width="9" height="9" fill="{BG}" stroke="{W2}" stroke-width="1.5"/>'
        tx, ty = x + dx, y + dy
        s += f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{tx - (4 if anc == "start" else -4 if anc == "end" else 0):.1f}" y2="{ty-4:.1f}" stroke="{W3 if not me else BLUE}" stroke-width="1"/>'
        s += f'<text x="{tx:.1f}" y="{ty:.1f}" font-size="{13 if me else 12}" font-weight="{500 if me else 400}" fill="{"#fff" if me else W2}" text-anchor="{anc}">{n} <tspan font-family="Geist Mono" fill="{BLUE if me else W3}" font-size="11">{a:g}%</tspan></text>'
    return s + '</svg>'

CAD = [('SKY-001', .005, 79.7), ('GPT-6 Astra', .75, 79), ('Opus 5.5', .30, 69), ('Gemini 3.8 Flash', .08, 55), ('Qwen 3.8 Max', .30, 34), ('Kimi K3', .13, 9)]
BIM = [('SKY-001', .009, 43.6), ('Gemini 3.8 Flash', .22, 42), ('GPT-6 Astra', .45, 40.5), ('Opus 5.5', .27, 34.5), ('Kimi K3', .27, 33.7), ('Qwen 3.8 Max', .11, 29), ('Grok 4.7', .30, 28)]
CAD_POS = {'SKY-001': (16, -16, 'start'), 'GPT-6 Astra': (-14, -14, 'end'), 'Opus 5.5': (-14, 22, 'end'), 'Gemini 3.8 Flash': (-14, -12, 'end'), 'Qwen 3.8 Max': (-14, 4, 'end'), 'Kimi K3': (14, 4, 'start')}
BIM_POS = {'SKY-001': (16, -18, 'start'), 'Gemini 3.8 Flash': (-14, 18, 'end'), 'GPT-6 Astra': (-14, 44, 'end'), 'Opus 5.5': (-14, 2, 'end'), 'Kimi K3': (-14, 26, 'end'), 'Qwen 3.8 Max': (-14, 4, 'end'), 'Grok 4.7': (14, 22, 'start')}

def bars(title, unit, rows, vmax, step, fmt):
    """Paired horizontal bars with a value axis."""
    W, L, R = 560, 150, 76
    H = 40 + len(rows) * 44 + 44
    X = lambda v: L + v / vmax * (W - L - R)
    s = f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="Geist" xmlns="http://www.w3.org/2000/svg">'
    yb = 24 + len(rows) * 44
    v = 0
    while v <= vmax + 1e-6:
        x = X(v)
        s += f'<line x1="{x:.1f}" y1="16" x2="{x:.1f}" y2="{yb}" stroke="rgba(255,255,255,.06)"/><line x1="{x:.1f}" y1="{yb}" x2="{x:.1f}" y2="{yb+5}" stroke="{W3}"/>'
        s += f'<text x="{x:.1f}" y="{yb+20}" font-size="12" fill="{W3}" text-anchor="middle" font-family="Geist Mono">{v:g}</text>'
        v += step
    s += f'<line x1="{L}" y1="{yb}" x2="{W-R}" y2="{yb}" stroke="{W3}"/><line x1="{L}" y1="16" x2="{L}" y2="{yb}" stroke="{W3}"/>'
    s += f'<text x="{(L+W-R)/2:.0f}" y="{H-6}" font-size="12" fill="{W2}" text-anchor="middle">{unit}</text>'
    for i, (grp, lab, val, me) in enumerate(rows):
        y = 26 + i * 44
        if grp:
            s += f'<text x="0" y="{y+16}" font-size="11" fill="{W3}" font-family="Geist Mono" letter-spacing=".06em">{grp}</text>'
        s += f'<text x="{L-10}" y="{y+16}" font-size="13" fill="{"#fff" if me else W2}" text-anchor="end">{lab}</text>'
        s += f'<rect x="{L}" y="{y+2}" width="{max(2, X(val)-L):.1f}" height="20" fill="{BLUE if me else DIM}"/>'
        s += f'<text x="{X(val)+8:.1f}" y="{y+17}" font-size="12" fill="{"#fff" if me else W2}" font-family="Geist Mono">{fmt(val)}</text>'
    return s + '</svg>'

def race_svg(frac, total, done_at):
    """Timeline of one model's run on a shared 0-200 s axis. frac = how far the playhead is (s)."""
    W, L, R = 380, 0, 0
    X = lambda v: L + v / 200 * (W - L - R)
    s = f'<svg viewBox="0 0 {W} 46" width="{W}" height="46" font-family="Geist Mono" xmlns="http://www.w3.org/2000/svg">'
    s += f'<rect x="0" y="6" width="{W}" height="10" fill="rgba(255,255,255,.06)"/>'
    s += f'<rect x="0" y="6" width="{X(min(frac, total)):.1f}" height="10" fill="{BLUE if total == done_at else DIM}"/>'
    s += f'<line x1="{X(total):.1f}" y1="2" x2="{X(total):.1f}" y2="20" stroke="{W2}"/>'
    for v in (0, 50, 100, 150, 200):
        s += f'<text x="{X(v):.1f}" y="38" font-size="10" fill="{W3}" text-anchor="{"start" if v == 0 else "end" if v == 200 else "middle"}">{v}s</text>'
    return s + '</svg>'

def lines():
    xs = [M, M + 8 * COL]
    return ''.join(f'<div class="vl" style="left:{x - (1 if i == 1 else 0)}px"></div>' for i, x in enumerate(xs))

def page():
    T = 4.2  # the static frame freezes the race at the moment SKY-001 finishes
    racers = [('SKY-001', 4.2, 'Finished 3D part + 2D cross-section'), ('GPT-6 Astra', 199, 'Still planning'), ('Opus 5.5', 110, 'Still planning')]
    race = ''.join(f'''<div><div class="mono">{"0" + str(i + 1)} · {"World model" if i == 0 else "LLM"}</div>
      <div class="t"><h3 style="font-size:24px;font-weight:400;letter-spacing:-.02em">{n}</h3><b style="color:{"#fff" if i == 0 else W2}">≈{t:g} s</b></div>
      {race_svg(T, t, 4.2)}<div class="st{" ok" if i == 0 else ""}">{"Done at 4.2 s" if i == 0 else f"{T / t * 100:.0f}% of run at 4.2 s"}</div></div>''' for i, (n, t, _) in enumerate(racers))
    return f'''<div class="f" data-name="Skyfall SKY-001 Page · General Intuition style · Desktop 1440">
{lines()}
<div class="hero" id="s1"><img src="{img('a0.jpg')}"/><div class="shade"></div>
  <span class="logo">{LOGO}</span>
  <div class="nav"><a>Technical report</a><a>Technical blog</a><a>Partnerships</a><span class="btn">Join the waitlist</span></div>
  <div class="card"><div class="mono" style="color:#7c7c8a;margin-bottom:18px">SKY-001</div><h1>First World Model for the Engineered World</h1>
    <p>Accelerating innovations in the physical economy with world models by building the foundation layer that powers enterprises.</p>
    <p style="margin-top:10px;color:#111">Our first stop is Design Engineering.</p>
    <div class="news"><span class="mono">Skyfall News · Oct 19, 2026</span><b>Skyfall AI announces SKY-001, a Latent World Model</b><i>Read more ↗</i></div></div>
  <div class="ascset"><div><span>ASCII SETTINGS</span><b>×</b></div><div><span>Cell size</span><b>8</b></div><div><span>Text opacity</span><b>100</b></div><div><span>Tile opacity</span><b>80</b></div></div>
</div>
<div class="row" id="s2"><div class="links"><div>Technical report <i>↗</i></div><div>Technical blog <i>↗</i></div><div>Partnerships <i>↗</i></div><div>Watch launch video <i>↗</i></div></div></div>
<div class="row" id="s3"><div class="split">
  <img src="{img('a1.jpg')}" style="width:{COL*4}px;height:620px"/>
  <div class="txt intro" style="border-left:1px solid {LINE}"><div class="mono">Introducing SKY-001,</div><h3>Intelligence for general engineering</h3>
    <h2>The First World Model for the Engineered World; AI moving beyond language into latent space</h2>
    <p><span style="color:#fff">Get Early Access:</span> Join the waitlist now for early access.</p>
    <div class="acts"><span class="btn">Join the waitlist</span><span class="btn k">Watch Launch Video ↗</span></div></div>
</div></div>
<div class="row" id="s4"><div class="sect-h"><h2>We're taking a contrarian approach to research</h2><p></p></div>
  <div class="cells3" style="border-top:1px solid {LINE}">
    <div><div class="mono">01</div><h3>Not a plug-in</h3><p>Large language models excel at conversation, and a wave of wrappers now points them at every industry. But, engineering design isn't a language problem. It's a sequential decision problem that requires a model that can reason about geometry and truly understand the latent space.</p></div>
    <div><div class="mono">02</div><h3>First Model that can Dream</h3><p>We built a new type of world model with a new architecture for the non-molithic era. SKY-001 is designed for the next generation of AI that can 'dream' anything in the physical world. We believe we cannot build something that we can't dream about. SKY-001 is a general engineer that can dream from product concept to factory</p></div>
    <div><div class="mono">03</div><h3>One Model, Many Domains</h3><p>As a latent world model, SKY-001 learns how physical systems are designed, built and run, in any domain. From engineering to operations, the possibilities are endless.</p></div>
  </div></div>
<div class="row" id="s5"><div class="sect-h"><h2>Designing a New Pareto Frontier with World Models</h2>
  <p>We are pushing the boundaries of what's possible in physical design with world modeling not just in one category but two.</p></div></div>
<div class="row" id="s6"><div class="sect-h"><div><div class="mono" style="margin-bottom:20px">Defining Moment in History</div><h2>Frontier Accuracy at 1/150th the cost of LLMs</h2></div>
  <p>Our world model beats GPT-6 Astra because LLMs are autoregressive in nature and not designed for visual reasoning. Our approach is undoubtedly the best path for scale compared to LLMs and a game changer for the AI industry.</p></div>
  <div class="stats4" style="border-top:1px solid {LINE}">
    <div><div class="mono">3D CAD · per-part sketch modelling</div><b>150<small>×</small></b><span>cheaper than GPT-6 Astra</span></div>
    <div><div class="mono">3D CAD · per-part sketch modelling</div><b>51<small>×</small></b><span>faster, ≈4 s against ≈200 s</span></div>
    <div><div class="mono">BIM</div><b>50<small>×</small></b><span>cheaper than GPT-6 Astra</span></div>
    <div><div class="mono">BIM</div><b>32<small>×</small></b><span>faster, ≈5 s against ≈160 s</span></div>
  </div>
</div>
<div class="row" id="s7"><div class="sect-h"><h2>World Models vs. LLMs</h2><p>Source: Skyfall technical blog.</p></div>
  <div class="cells3 race" style="border-top:1px solid {LINE}">{race}</div>
  <div class="links rc" style="border-top:1px solid {LINE};grid-template-columns:1fr 1fr 1fr 2fr"><div>↺ Restart</div><div>‹ Step</div><div>Step ›</div><div style="justify-content:flex-start;gap:16px"><span class="mono">Time</span><span class="track" style="flex:1"><span style="flex:1;height:2px;background:{LINE};position:relative;display:block"><span class="knob" style="position:absolute;left:calc(2.1% - 6px);top:-5px;width:12px;height:12px;background:#fff"></span></span></span><span class="mono tlab" style="color:#fff">4.2 s</span></div></div></div>
<div class="row" id="s8"><div class="sect-h"><h2>How SKY-001 beats Prompt-Based Methods Step-By-Step</h2><p></p></div>
  <div class="stages" style="border-top:1px solid {LINE}">
    <div><img src="{img('a2.jpg')}"/><div class="lab"><div class="mono">Stage 1</div><h3>Parallel Explorations Through World Modeling</h3><p>Our model converts a 2D sketch or text prompt into several rough 3D assets at once. This lets you instantly explore different visual directions and pick the best foundation before diving into details.</p></div></div>
    <div><img src="{img('a3.jpg')}"/><div class="lab"><div class="mono">Stage 2</div><h3>Recursive Diffusion-Based 3D Decomposition</h3><p>Once selected, it breaks down the high-level designs into smaller, individual parts, from large structural pieces all the way down to tiny screws and fasteners. By working layer by layer, our model keeps complex designs organized and easy to build, excelling in long horizon planning.</p></div></div>
    <div><img src="{img('a4.jpg')}"/><div class="lab"><div class="mono">Stage 3</div><h3>Multi-step 2d to 3D Latent Action World Model</h3><p>It brings each part to life by recreating how a real designer works step-by-step. It starts by drawing precise 2D sketches stroke-by-stroke, then stretches, cuts, or shapes those sketches into finished 3D objects.</p></div></div>
    <div><img src="{img('a5.jpg')}"/><div class="lab"><div class="mono">Stage 4</div><h3>3D Construction World Model</h3><p>Finally, it assembles all the parts, layer by layer again, in hierarchical order into a complete 3D assembly that you can visualize immediately in standard CAD software</p></div></div>
  </div></div>
<div class="row" id="s9"><div class="sect-h" style="padding-bottom:56px"><h2>Why do the World Models excel here?</h2><p></p></div>
  <div class="cells4" style="border-top:1px solid {LINE}">
    <div><div class="mono">01</div><h3>Cause &amp; effect</h3></div>
    <div><div class="mono">02</div><h3>Physics</h3><p>Understand geometry</p></div>
    <div><div class="mono">03</div><h3>Latent space</h3></div>
    <div><div class="mono">04</div><h3>Long horizon planning</h3><p>Hierarchical decomposition</p></div>
  </div></div>
<div class="row" id="s10"><div class="sect-h"><h2>Reinventing the physical economy with world models</h2>
  <p>Today, SKY-001 is a hierarchical visual world model that plans and designs the assembly of engineered objects. By pairing it with a vision-language-action (VLA) agent in the next phase, we transition from plan generation to physical execution. Beyond manufacturing, SKY-001 is designed to become the underlying blueprint for complex physical design, spanning PCB design, Aerospace engineering, Energy and Power systems, Protein folding, Molecule design, Computer Use Agents, Enterprise Software and beyond.</p></div>
  <div class="split" style="border-top:1px solid {LINE}">
    <img src="{img('a6.jpg')}" style="width:{COL*4}px;height:520px"/>
    <div class="quote" style="border-left:1px solid {LINE}"><blockquote>Wherever structure, constraints, and sequence matter, SKY-001 plans and powers the build.</blockquote><div class="qm">”</div></div>
  </div>
  <div class="marks" style="grid-template-columns:repeat(4,1fr);border-top:1px solid {LINE}"><span>PCB design</span><span>Aerospace engineering</span><span>Energy and Power systems</span><span>Protein folding</span></div>
  <div class="marks" style="grid-template-columns:repeat(4,1fr);border-top:1px solid {LINE}"><span>Molecule design</span><span>Computer Use Agents</span><span>Enterprise Software</span><span style="color:{W3}">and beyond</span></div>
</div>
<div class="row" id="s11"><div class="sect-h" style="padding-bottom:56px"><h2>The team behind <span style="white-space:nowrap">SKY-001</span></h2><p></p></div>
  <div class="team" style="border-top:1px solid {LINE}">
    <div><img src="{portrait('sumit.jpg')}"/><div class="lab"><div class="mono">Leadership</div><h3 style="margin-top:10px">Sumit Pasupalak</h3></div></div>
    <div><img src="{portrait('kaheer.jpg')}"/><div class="lab"><div class="mono">Leadership</div><h3 style="margin-top:10px">Kaheer Suleman</h3></div></div>
    <div><img src="{portrait('sam.jpg')}"/><div class="lab"><div class="mono">Leadership</div><h3 style="margin-top:10px">Sam Pasupalak</h3></div></div>
  </div>
  <div class="people" style="border-top:1px solid {LINE}">
    <div><div class="mono">Core contributors</div><h3>Haoye, Zichen, Mike <span class="mono" style="color:{BLUE}">TBD</span></h3></div>
    <div><div class="mono">Full team</div><h3>Pavan et. al</h3></div>
    <div><div class="mono">Leadership</div><h3>Sumit, Kaheer, Sam</h3></div>
  </div></div>
<div class="row" id="s12"><div class="faq">
  <div class="sect-h" style="display:block;padding:88px 0 0"><div style="padding:0 48px 0 24px"><div class="mono" style="margin-bottom:20px">FAQ Section</div><h2>What you might be wondering</h2></div></div>
  <ul style="border-left:1px solid {LINE}">
    <li class="open"><div class="q">What are SKY models and SKY-001?<i>−</i></div><div class="a">Foundation world models</div></li>
    <li><div class="q">How is SKY related to autonomous businesses?<i>+</i></div></li>
    <li><div class="q">Is SKY-001 just another LLM-foundation model?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>No, explain difference</div></li>
    <li><div class="q">Why are World Models better for physical object design?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>Better at long-term planning; Actually understands the world + simulation; Better for real automation due to little to zero human input; Needs different type of AI</div></li>
    <li><div class="q">Can SKY-001 build a physical object?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>Not yet, eventually we will have a VLA agent</div></li>
    <li><div class="q">How do I get access to SKY-001?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>Join waitlist to be the first to hear when it goes public</div></li>
    <li><div class="q">What is SKY-001 good at?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>Great for designing complex objects that require long term planning</div></li>
    <li><div class="q">What else can we design with SKY-001?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>Applies to numerous sectors: robotics, drug discovery, PCB design, BIM etc..</div></li>
    <li><div class="q">I have further questions. How to contact the team?<i>+</i></div><div class="a" style="display:none"><span class="mono" style="color:{BLUE}">Doc note</span>team email E.G. hello@sky001.ai</div></li>
  </ul></div></div>
<div class="full cta" id="s13"><img src="{img('a8.jpg')}"/>
  <div class="card"><h3>Get Early Access</h3><p>Join the waitlist now for early access.</p><div style="display:flex;gap:12px;margin-top:28px"><span class="btn" style="margin-top:0">Join the waitlist</span><span class="btn" style="margin-top:0;background:#fff;color:#000;border:1px solid #c9c9d2">Watch Launch Video ↗</span></div></div></div>
<footer class="row" style="border-top:1px solid {LINE}">
  <div class="cols"><div><div class="mono">SKY-001</div><span>Technical report</span><span>Technical blog</span><span>Watch launch video</span></div><div><div class="mono">Socials</div><span>X</span><span>LinkedIn</span></div><div><div class="mono">Work with us</div><span>Partnerships</span><span>Join the waitlist</span><span>Contact</span></div><div><div class="mono">Legal</div><span>Terms of Service</span><span>Privacy Policy</span></div></div>
  <div class="big" style="border-top:1px solid {LINE}"><span class="logo">{LOGO}</span></div>
  <div class="copy" style="border-top:1px solid {LINE}"><span>© 2026 SKYFALL AI. ALL RIGHTS RESERVED.</span><span>FIRST WORLD MODEL FOR THE ENGINEERED WORLD</span></div>
</footer>
</div>'''

html = f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall SKY-001 Page · General Intuition style</title><style>{CSS}</style></head><body>{page()}</body></html>'
out = os.path.join(HERE, 'sky_inline.html' if INLINE else 'sky.html')
open(out, 'w').write(html)
print(out, len(html))

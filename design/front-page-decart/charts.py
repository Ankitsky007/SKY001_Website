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


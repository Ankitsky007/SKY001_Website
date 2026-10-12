"""Skyfall-blue ordered-dither fields (Reactor-style grain, our palette)."""
import numpy as np
from PIL import Image
import sys, json

BG = (6, 7, 10)
TONES = [BG, (20, 28, 78), (40, 58, 160), (62, 87, 218), (140, 158, 240), (226, 231, 255)]
B8 = np.array([[0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],
               [60,28,52,20,62,30,54,22],[3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],
               [15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]]) / 64.0

def vnoise(w, h, scale, rng):
    gw, gh = int(w / scale) + 3, int(h / scale) + 3
    g = rng.random((gh, gw))
    ys, xs = np.mgrid[0:h, 0:w] / scale
    x0, y0 = xs.astype(int), ys.astype(int)
    fx, fy = xs - x0, ys - y0
    fx, fy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b = g[y0, x0], g[y0, x0 + 1]
    c, d = g[y0 + 1, x0], g[y0 + 1, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy

def fbm(w, h, scale, rng, oct=4):
    v, amp, tot = 0, 1, 0
    for i in range(oct):
        v = v + amp * vnoise(w, h, scale / 2 ** i, rng); tot += amp; amp *= 0.5
    return v / tot

def field(W, H, cell, kind, seed):
    rng = np.random.default_rng(seed)
    w, h = W // cell, H // cell
    ys, xs = np.mgrid[0:h, 0:w]
    u, v = xs / w, ys / h
    n1 = fbm(w, h, max(w, h) / 3, rng)
    n2 = fbm(w, h, max(w, h) / 9, rng)
    warp = (n1 - 0.5) * 0.35
    if kind == 'hero':      # diagonal band sweeping up-right, like a ripple front
        d = (u * 0.9 - (1 - v) * 0.55 - 0.18 + warp)
        band = np.exp(-(d / 0.20) ** 2) * np.clip((u - 0.25) * 2.2, 0, 1)
        band += 0.55 * np.exp(-((u * 0.7 + v * 0.35 - 1.05 + warp) / 0.10) ** 2)
    elif kind == 'heroM':   # blob in the upper half (mobile), text sits below
        d = (u * 0.8 - (1 - v) * 0.9 + 0.25 + warp)
        band = np.exp(-(d / 0.22) ** 2) * np.clip((0.62 - v) * 3, 0, 1)
    elif kind == 'heroV':   # vertical column (mobile)
        d = (u - 0.62 - v * 0.15 + warp)
        band = np.exp(-(d / 0.28) ** 2) * np.clip(1.2 - v * 0.2, 0, 1)
    elif kind == 'cta':     # bright wall on the right
        d = (u - 0.88 + (v - 0.5) * 0.25 + warp * 0.8)
        band = np.clip(1 - np.abs(d) / 0.32, 0, 1) ** 1.4 + 0.5 * np.clip((u - 0.95) * 8, 0, 1)
    elif kind == 'ctaV':
        d = (v - 0.82 + (u - 0.5) * 0.2 + warp * 0.6)
        band = np.clip(1 - np.abs(d) / 0.3, 0, 1) ** 1.4
    elif kind.startswith('arc'):  # card covers: an arc of grain in a corner
        k = int(kind[3:])
        cx, cy = [(1.1, 1.2), (-0.1, 1.1), (0.5, 1.4), (1.2, 0.2), (0.9, 1.3)][k % 5]
        r = np.sqrt((u - cx) ** 2 * 1.6 + (v - cy) ** 2) + warp * 0.6
        band = np.exp(-((r - 0.75) / 0.16) ** 2) + 0.5 * np.exp(-((r - 0.45) / 0.07) ** 2)
    elif kind == 'slab':    # latent sphere of grain
        r = np.sqrt((u - 0.55) ** 2 * (w / h) ** 2 + (v - 0.5) ** 2) + warp * 0.25
        band = np.exp(-((r - 0.36) / 0.14) ** 2) * (0.6 + 0.5 * (1 - v))
    else:
        band = n1
    n3 = fbm(w, h, 6, rng, 2)
    inten = np.clip(band * (0.25 + 1.1 * n2) * (0.75 + 0.5 * n3) - 0.10, 0, 1.3) ** 1.15
    levels = len(TONES) - 1
    thr = 0.55 * B8[ys % 8, xs % 8] + 0.45 * rng.random((h, w))
    q = inten * levels + (thr - 0.5) * 1.6
    q = np.where(inten < 0.04, 0, q)
    idx = np.clip(np.floor(q + 0.5), 0, levels).astype(int)
    spk = (rng.random(idx.shape) < 0.07) & (idx > 1)
    idx = np.where(spk, np.clip(idx + rng.choice([-1, 1], idx.shape), 0, levels), idx)
    pal = np.array(TONES, dtype=np.uint8)
    img = pal[idx]
    # chroma speckle: a few warm/cyan pixels inside bright regions, like sensor noise
    ch = (rng.random(idx.shape) < 0.015) & (idx >= 3)
    img[ch] = rng.choice(np.array([(120, 210, 255), (180, 150, 255)], dtype=np.uint8), ch.sum())
    im = Image.fromarray(img, 'RGB').resize((w * cell, h * cell), Image.NEAREST)
    return im

if __name__ == '__main__':
    out = sys.argv[1]
    jobs = json.loads(sys.argv[2])
    for name, W, H, cell, kind, seed in jobs:
        field(W, H, cell, kind, seed).save(f'{out}/{name}.png', optimize=True)
        print(name)

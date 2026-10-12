"""ASCII-mosaic renderer (General Intuition-style), Skyfall palette. Geist Mono glyphs over dim colour tiles."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
RAMP = " .,:;-~=+*!?/|()[]{}1tfjrxnuvczXYUJCLQ0OZmwqpdbkhao#MW&8%B@$"
FONT = '/tmp/claude-0/sp/package/dist/fonts/geist-mono/GeistMono-Regular.ttf'

def render(src, W, H, cell=10, tile=0.8, gamma=0.62, txt=1.0, focus=(0.5, 0.5), seed=0, blue=0.0, out=None, scale=2):
    im = Image.open(src).convert('RGB')
    # cover-crop to W:H around focus
    r = W / H; iw, ih = im.size
    if iw / ih > r:
        cw = int(ih * r); x0 = int((iw - cw) * focus[0]); im = im.crop((x0, 0, x0 + cw, ih))
    else:
        ch = int(iw / r); y0 = int((ih - ch) * focus[1]); im = im.crop((0, y0, iw, y0 + ch))
    cols, rows = W // cell, H // cell
    small = (np.asarray(im.resize((cols, rows), Image.BOX)).astype(float) / 255) ** gamma
    lum = small @ np.array([.299, .587, .114])
    lum = np.clip((lum - lum.min()) / (np.percentile(lum, 99.5) - lum.min() + 1e-6), 0, 1)
    if blue:  # pull hues toward Skyfall blue
        b = np.array([62, 87, 218]) / 255
        small = small * (1 - blue) + (lum[..., None] * b * 1.6) * blue
    S = scale; c = cell * S
    canvas = Image.new('RGB', (cols * c, rows * c), (5, 5, 7))
    tiles = (np.clip(small * tile, 0, 1) * 255).astype(np.uint8)
    canvas.paste(Image.fromarray(tiles).resize((cols * c, rows * c), Image.NEAREST))
    d = ImageDraw.Draw(canvas); f = ImageFont.truetype(FONT, int(c * 0.92))
    rng = np.random.default_rng(seed)
    n = len(RAMP) - 1
    for y in range(rows):
        for x in range(cols):
            L = lum[y, x]
            if L < 0.03: continue
            k = int(np.clip(L * n + rng.normal(0, 1.2), 1, n))
            col = np.clip(small[y, x] * 1.45 + 0.30 * L, 0, 1) * txt
            d.text((x * c + c * 0.12, y * c - c * 0.02), RAMP[k], font=f, fill=tuple((col * 255).astype(int)))
    canvas = ImageEnhance.Contrast(canvas).enhance(1.08)
    canvas.save(out, quality=86) if out.endswith('.jpg') else canvas.save(out)
    return out

if __name__ == '__main__':
    import json
    for j in json.loads(sys.argv[1]):
        print(render(**j))

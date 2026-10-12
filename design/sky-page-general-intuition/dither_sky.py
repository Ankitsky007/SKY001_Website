"""Turn a cloud photo into the TypeSafe-style dithered sky in Skyfall blues.
python3 dither_sky.py raw/clouds.png -> out/clouds.png (1440x880) + out/cloudmap.png (coverage + highlight, for the live drift)."""
import sys, numpy as np
from PIL import Image, ImageFilter
W, H, PX = 1440, 880, 3
w, h = W // PX, H // PX
im = Image.open(sys.argv[1]).convert('RGB')
iw, ih = im.size; r = W / H
ch = int(iw / r); im = im.crop((0, 0, iw, min(ih, ch))).resize((w, h), Image.LANCZOS)
a = np.asarray(im, float) / 255
R, G, B_ = a[..., 0], a[..., 1], a[..., 2]
sat = (np.max(a, 2) - np.min(a, 2))
lum = a @ np.array([.299, .587, .114])
cov = np.clip((0.17 - (B_ - R)) / 0.07, 0, 1)        # clouds are grey/white; the sky is bluer than it is red
cov = np.asarray(Image.fromarray((cov * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1)), float) / 255
hi = np.clip((lum - .82) / .15, 0, 1) * cov            # brightest cloud tops
shadow0 = np.clip((.97 - lum) / .32, 0, 1)
Image.fromarray(np.dstack([cov * 255, hi * 255, shadow0 * 255]).astype(np.uint8)).save('out/cloudmap.png')
Y = np.linspace(0, 1, h)[:, None]
fade = np.clip((Y - .6) / .4, 0, 1) ** 1.2
Bm = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16 + 1 / 32
T = np.tile(Bm, (h // 4 + 1, w // 4 + 1))[:h, :w]
SKY, LIGHT, BLUE, WHITE = (228, 234, 252), (139, 157, 238), (62, 87, 218), (255, 255, 255)
out = np.zeros((h, w, 3)); out[:] = SKY
c = cov * (1 - fade * .6)
shadow = np.clip((.97 - lum) / .32, 0, 1)                # darker cloud undersides -> full blue
tone = c * (.45 + .55 * shadow)                          # 0 sky .. 1 deep blue
out[tone * 3 > T] = LIGHT
out[tone * 3 - 1 > T] = BLUE
out[(hi * 1.4 - .2 > T) & (c > .6)] = WHITE              # sunlit tops break up the blue
out[fade > T] = WHITE
Image.fromarray(out.astype(np.uint8)).resize((W, H), Image.NEAREST).save('out/clouds.png')
print('ok', cov.mean())

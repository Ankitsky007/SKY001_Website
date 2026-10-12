"""Crop/resize Higgsfield originals to layout sizes (1.5x) as JPEGs."""
import os
from PIL import Image, ImageOps
H = os.path.dirname(os.path.abspath(__file__))
S = 1.5
SIZES = {0: (1102, 760, .5, .35), 1: (520, 640, 0, .5), 2: (958, 540, .5, .5), 3: (471, 200, .5, .5), 4: (471, 200, .5, .5),
         5: (471, 200, .5, .5), 6: (471, 200, .5, .5), 7: (958, 540, .5, .5), 8: (471, 440, .5, .5), 9: (471, 440, .5, .5),
         10: (471, 440, .5, .5), 11: (471, 440, .5, .5), 12: (1102, 620, .5, .5)}
for i, (w, h, fx, fy) in SIZES.items():
    im = Image.open(f'{H}/raw/{i}.png').convert('RGB')
    im = ImageOps.fit(im, (int(w * S), int(h * S)), Image.LANCZOS, centering=(fx, fy))
    im.save(f'{H}/out/o{i}.jpg', quality=84, optimize=True)
    if i == 1:
        ImageOps.mirror(im).save(f'{H}/out/o1f.jpg', quality=84, optimize=True)
print('ok')

"""Cut each Higgsfield object out of its plain studio background (alpha PNG, so hairlines run behind it),
and keep the photo (11) as a JPEG."""
from PIL import Image, ImageFilter
import numpy as np
for i in range(1, 12):
    im = Image.open(f'raw/{i}.png').convert('RGB')
    if i == 11:
        im.thumbnail((1600, 1600)); im.save('out/d11.jpg', quality=86); continue
    a = np.asarray(im).astype(float)
    corners = np.concatenate([a[:24, :24].reshape(-1, 3), a[:24, -24:].reshape(-1, 3), a[-24:, :24].reshape(-1, 3), a[-24:, -24:].reshape(-1, 3)])
    bg = np.median(corners, 0)
    # local background estimate: heavy blur of the image where it is close to bg colour
    d = np.abs(a - bg).max(2)
    alpha = np.clip((d - 5) / 14, 0, 1)
    am = Image.fromarray((alpha * 255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    # soft shadows read as slightly darker than bg: keep them as faint grey
    rgba = im.copy(); rgba.putalpha(am)
    rgba.thumbnail((820, 820))
    rgba.save(f'out/d{i}.png', optimize=True)
print('ok')

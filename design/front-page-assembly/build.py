# Inline images and the logo into template.html -> front-page-assembly.html
import base64, re, os
D = os.path.dirname(os.path.abspath(__file__))
t = open(f'{D}/template.html').read()
logo = open('/mnt/project-files/brand/logo/skyfall_logo_white.svg').read()
logo = re.sub(r'<metadata>.*?</metadata>', '', logo, flags=re.S).replace('xmlns:c2pa="http://c2pa.org/manifest"', '')
logo = logo.replace('width="258" height="32"', 'width="155" height="19"')
def img(n):
    return 'data:image/webp;base64,' + base64.b64encode(open(f'{D}/img/{n}.webp', 'rb').read()).decode()
variants = ''.join(
    f'<div class="c"><img src="{img(f"torsen-{i:02d}")}" alt="Torsen differential variant {i:02d}"><span class="n">VAR {i:02d}</span></div>'
    for i in range(1, 10))
t = t.replace('{{logo}}', logo).replace('{{variants}}', variants)
t = re.sub(r'\{\{img:([\w-]+)\}\}', lambda m: img(m.group(1)), t)
open(f'{D}/front-page-assembly.html', 'w').write(t)
print(len(t) // 1024, 'KB')

# Artifact copy: the publisher adds its own document skeleton
a = re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>\s*<meta charset="utf-8">\s*<meta name="viewport"[^>]*>', '', t)
a = a.replace('</head>', '').replace('<body>', '').replace('</body>', '').replace('</html>', '')
open(f'{D}/artifact.html', 'w').write(a.strip() + '\n')

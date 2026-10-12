"""SKY-001 page variation: the General Intuition page with its hero redone in typesafe.ai's hero structure
(floating nav chips, dithered cloud sky, terminal news windows, intro line, giant centred headline, big underlined CTA),
in Geist / Geist Mono and #3E57DA. Rest of the page is unchanged from build_sky.py.
Usage: python3 build_sky_ts.py [--inline] -> sky_ts.html or sky_ts_inline.html."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'build_sky.py')).read()
ns = {'__file__': os.path.join(HERE, 'build_sky.py')}
exec(src[:src.index("html = f'<!doctype html>")], ns)
INLINE, CSS, page, img = ns['INLINE'], ns['CSS'], ns['page'], ns['img']
import base64
uri = lambda p, m: f'data:{m};base64,' + base64.b64encode(open(p, 'rb').read()).decode()
BLUE = ns['BLUE']
LOGOK = re.sub(r'<metadata>.*?</metadata>', '', open('/mnt/project-files/brand/logo/skyfall_logo_black.svg').read(), flags=re.S)
LOGOK = re.sub(r'<\?xml.*?\?>', '', LOGOK)
LOGOK = re.sub(r'width="[\d.]+" height="[\d.]+"', 'width="100%" height="100%" preserveAspectRatio="xMinYMid meet"', LOGOK, count=1)
sky = uri(os.path.join(HERE, 'out', 'clouds.png'), 'image/png') if INLINE else 'out/clouds.png'
INK = '#1e1e1e'
TS_CSS = f"""
.tsh{{position:relative;height:1600px;background:#fff;color:{INK};overflow:hidden}}
.tsh .sky{{position:absolute;left:0;top:0;width:1440px;height:880px;image-rendering:pixelated}}
.tsh .chip{{position:absolute;top:0;height:37px;padding:0 9px;display:flex;align-items:center;background:#fff;color:{INK};font-size:17px;font-weight:500;letter-spacing:-.01em;z-index:3}}
.tsh .chip.k{{background:{INK};color:#fff}}
.tsh .chip.logo{{left:0;padding:0 10px;gap:0}}
.tsh .chip.logo span{{display:block;width:150px;height:18px}}
.tsh .mid{{position:absolute;top:0;left:50%;transform:translateX(-50%);display:flex;gap:3px;z-index:3}}
.tsh .mid .chip,.tsh .rt .chip{{position:static}}
.tsh .rt{{position:absolute;top:0;right:0;display:flex;gap:3px;z-index:3}}
.tsh .win{{position:absolute;left:50%;transform:translateX(-50%);width:372px;background:#dedede;border:1px solid {INK};box-shadow:inset 0 0 0 2px #f4f4f4,0 0 0 3px rgba(255,255,255,.55);font-family:'Geist Mono';color:{INK};z-index:3}}
.tsh .win .tb{{background:{INK};color:#fff;font-size:11px;letter-spacing:.02em;padding:4px 8px}}
.tsh .win .bd{{padding:12px 16px 14px;text-align:center;font-size:13px;line-height:1.35}}
.tsh .win .bd b{{display:block;font-weight:400;letter-spacing:.06em;text-transform:uppercase}}
.tsh .win .go{{display:inline-flex;align-items:center;height:30px;padding:0 16px;margin-top:10px;background:{INK};color:#fff;font-size:12px}}
.tsh .win u{{display:inline-block;margin-top:8px;text-underline-offset:3px}}
.tsh .lead{{position:absolute;top:500px;left:0;right:0;text-align:center;z-index:3}}
.tsh .lead h2{{max-width:640px;margin:0 auto;text-shadow:0 0 14px #fff,0 0 4px #fff;font-size:40px;font-weight:500;letter-spacing:-.03em;line-height:1.05;color:{INK}}}
.tsh .lead p{{text-shadow:0 0 10px #fff,0 0 3px #fff;font-size:17px;line-height:1.45;color:#4a4a52;max-width:560px;margin:14px auto 0}}
.tsh .lead p.s{{color:{INK};margin-top:6px}}
.tsh .intro{{position:absolute;top:760px;left:0;right:0;display:flex;justify-content:center;gap:28px;font-size:16px;font-weight:500;letter-spacing:-.01em;z-index:3}}
.tsh h1{{position:absolute;top:812px;left:100px;width:1240px;text-align:center;font-size:118px;font-weight:500;line-height:.86;letter-spacing:-.045em;text-transform:capitalize;color:{INK};z-index:3}}
.tsh .vert{{position:absolute;left:62px;top:880px;transform-origin:left top;transform:rotate(90deg);font-family:'Geist Mono';font-size:10px;letter-spacing:.06em;color:#7c7c8a;white-space:nowrap;z-index:3}}
.tsh .cta{{position:absolute;top:1400px;left:0;right:0;text-align:center;z-index:3}}
.tsh .cta a{{font-size:52px;font-weight:500;letter-spacing:-.04em;color:{INK};text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:9px}}
.tsh .cta .sub{{display:block;margin-top:22px;font-family:'Geist Mono';font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:{BLUE}}}
.tsh .corner{{position:absolute;bottom:14px;font-family:'Geist Mono';font-size:10px;color:#7c7c8a}}
.tsh .ill2{{position:absolute;right:14px;top:50px;font-family:'Geist Mono';font-size:10px;letter-spacing:.1em;color:#7c7c8a;z-index:3;background:#fff;padding:3px 6px}}
"""
VEC = 'z = [0.124, -0.873, 1.071, 0.002, -0.415, 0.660, 0.318, -1.204, 0.057]  ·  latent state 34/34'
HERO = f'''<div class="tsh" id="s1"><img class="sky" id="skyimg" src="{sky}"/>
  <div class="chip logo"><span>{LOGOK}</span></div>
  <div class="mid"><span class="chip">Technical report</span><span class="chip">Technical blog</span><span class="chip">Partnerships</span></div>
  <div class="rt"><span class="chip">Watch launch video</span><span class="chip k">Join the waitlist</span></div>
  <div class="win" style="top:92px"><div class="tb">SKY-001 · Early access</div><div class="bd"><b>Get Early Access</b>Join the waitlist now for early access.<br/><span class="go">Join the waitlist</span></div></div>
  <div class="win" style="top:252px"><div class="tb">Oct 19, 2026 · Skyfall News</div><div class="bd">Skyfall AI announces SKY-001, a Latent World Model<br/><u>Read more</u></div></div>
  <div class="lead"><h2>First World Model for the Engineered World</h2>
    <p>Accelerating innovations in the physical economy with world models by building the foundation layer that powers enterprises.</p>
    <p class="s">Our first stop is Design Engineering.</p></div>
  <div class="intro"><span>Introducing SKY-001,</span><span>Intelligence for general engineering</span></div>
  <h1>The First World Model for the Engineered World; AI moving beyond language into latent space</h1>
  <div class="vert">{VEC}</div>
  <div class="cta"><a>Join the waitlist</a><span class="sub">Watch Launch Video ↗</span></div>
  <span class="ill2">ILLUSTRATIVE SKY · DITHERED PHOTO</span>
  <span class="corner" style="left:14px">∵ ×</span><span class="corner" style="right:14px">× ∵</span>
</div>
'''
body = page()
body, n = re.subn(r'<div class="hero" id="s1">.*?</div>\n<div class="row" id="s2">', lambda m: HERO + '<div class="row" id="s2">', body, flags=re.S)
assert n == 1
body = body.replace('data-name="Skyfall SKY-001 Page · General Intuition style · Desktop 1440"', 'data-name="Skyfall SKY-001 Page · TypeSafe hero · Desktop 1440"')
html = f'<!doctype html><html><head><meta charset="utf-8"><title>Skyfall SKY-001 Page · TypeSafe hero</title><style>{CSS}{TS_CSS}</style></head><body>{body}</body></html>'
out = os.path.join(HERE, 'sky_ts_inline.html' if INLINE else 'sky_ts.html')
open(out, 'w').write(html)
print(out, len(html))

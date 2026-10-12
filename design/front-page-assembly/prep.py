# Prepare front page images: shift generated blues to #3E57DA, resize, encode WebP.
import numpy as np, colorsys, sys
from PIL import Image
P='/mnt/project-files/'
H='design/front-page-imagery/higgsfield/'
T_H=230.4/360; T_S=0.716
def shift_blue(im):
    a=np.asarray(im.convert('RGB')).astype(np.float32)/255
    r,g,b=a[...,0],a[...,1],a[...,2]
    mx=a.max(-1); mn=a.min(-1); d=mx-mn+1e-6
    s=d/(mx+1e-6)
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))/6
    hd=np.abs(h-0.64)  # blues ~200-260deg
    w=np.clip((0.12-hd)/0.05,0,1)*np.clip((s-0.25)/0.2,0,1)*np.clip((mx-0.08)/0.1,0,1)
    # target: hue 230, sat scaled toward 0.716, value kept
    nh=np.full_like(h,T_H); ns=np.minimum(s,1)*T_S/np.maximum(np.percentile(s[w>0.9],90) if (w>0.9).any() else 1,1e-3)
    ns=np.clip(ns,0,T_S)
    v=mx
    # hsv->rgb vectorised
    i=np.floor(nh*6)%6; f=nh*6-np.floor(nh*6)
    p=v*(1-ns); q=v*(1-f*ns); t=v*(1-(1-f)*ns)
    sel=[(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]
    out=np.zeros_like(a)
    for k,(R,G,B) in enumerate(sel):
        m=i==k; out[...,0][m]=R[m]; out[...,1][m]=G[m]; out[...,2][m]=B[m]
    res=a*(1-w[...,None])+out*w[...,None]
    print('  blue px:',int((w>0.5).sum()))
    return Image.fromarray((np.clip(res,0,1)*255).astype(np.uint8))
def save(im,name,width,q=80):
    if im.width>width: im=im.resize((width,round(im.height*width/im.width)),Image.LANCZOS)
    im.save('img/'+name+'.webp',quality=q,method=6); print(name,im.size)
for n,w in [('01-hero-monolith',1600),('02-hero-exploded',1600),('03-fig02-partly-observable',1200),('04-sector-industrial',720),('05-sector-healthcare',720),('06-sector-chemical',720),('07-sector-enterprise',720),('08-footer-reassembled',1600)]:
    print(n); save(shift_blue(Image.open(P+H+n+'.jpg')),n,w)
import glob
for f in sorted(glob.glob(P+'idfm_marketing-ankit_exploration/part_alternatives_cad/torsen_differential/*.png')):
    n='torsen-'+f.split('/')[-1][10:12]; save(Image.open(f).convert('RGB'),n,520,78)
for n in ['sumit','kaheer','sam']:
    im=Image.open(P+'brand/team-portraits/final/'+n+'.jpg').convert('L').convert('RGB'); save(im,'portrait-'+n,640,82)
im=Image.open(P+'idfm_marketing-ankit_exploration/asset_images/jaguar-e-type-roadster.png').convert('RGBA'); save(im,'etype',1400,82)

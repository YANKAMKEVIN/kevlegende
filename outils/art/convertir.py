# Kevlegende Acte III : out/*.png -> web/*.webp (ennemis détourés sur fond blanc).
from PIL import Image, ImageFilter
import numpy as np, glob, os
from collections import deque
os.makedirs('web', exist_ok=True)
def detourer(im):
    a=np.asarray(im.convert('RGB')).astype(np.int16)
    h,w,_=a.shape
    mn=a.min(2); mx=a.max(2)
    fond=(mn>228)&((mx-mn)<22)
    mask=np.zeros((h,w),bool)
    q=deque()
    for x in range(w):
        for y in (0,h-1):
            if fond[y,x] and not mask[y,x]: mask[y,x]=True; q.append((y,x))
    for y in range(h):
        for x in (0,w-1):
            if fond[y,x] and not mask[y,x]: mask[y,x]=True; q.append((y,x))
    while q:
        y,x=q.popleft()
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny,nx=y+dy,x+dx
            if 0<=ny<h and 0<=nx<w and fond[ny,nx] and not mask[ny,nx]:
                mask[ny,nx]=True; q.append((ny,nx))
    alpha=Image.fromarray(np.where(mask,0,255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    rgba=im.convert('RGBA'); rgba.putalpha(alpha)
    bb=alpha.point(lambda v:255 if v>20 else 0).getbbox()
    return rgba.crop(bb) if bb else rgba
def trous(fond, mask, mini):
    # Creux fermés (entre une queue et un corps, sous un bras…) : les grandes zones blanches enclavées sont aussi du fond.
    h,w=fond.shape; vu=mask.copy()
    for y0 in range(h):
        for x0 in range(w):
            if not fond[y0,x0] or vu[y0,x0]: continue
            zone=[(y0,x0)]; vu[y0,x0]=True; i=0
            while i<len(zone):
                y,x=zone[i]; i+=1
                for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
                    ny,nx=y+dy,x+dx
                    if 0<=ny<h and 0<=nx<w and fond[ny,nx] and not vu[ny,nx]:
                        vu[ny,nx]=True; zone.append((ny,nx))
            if len(zone)>=mini:
                for y,x in zone: mask[y,x]=True
if __name__=='__main__' and os.environ.get('REPARER'):
    # REPARER=1 python3 convertir.py fichiers.webp… : retire les creux blancs d'illustrations déjà converties.
    import sys
    for f in sys.argv[1:]:
        im=Image.open(f).convert('RGBA'); a=np.asarray(im).astype(np.int16)
        mn=a[...,:3].min(2); mx=a[...,:3].max(2)
        fond=(a[...,3]>200)&(mn>225)&((mx-mn)<26)
        mask=np.zeros(fond.shape,bool); trous(fond,mask,int(fond.size*0.0015))
        al=np.where(mask,0,a[...,3]).astype(np.uint8)
        al=np.asarray(Image.fromarray(al).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8)))
        al=np.minimum(al,a[...,3]).astype(np.uint8)
        im.putalpha(Image.fromarray(al)); im.save(f,quality=86,method=6); print(f, int(mask.sum()))
    sys.exit(0)
for f in sorted(glob.glob('out/*.png')):
    n=os.path.basename(f)[:-4]; im=Image.open(f)
    if n.startswith('ennemi_'):
        e=detourer(im); s=max(e.size); c=Image.new('RGBA',(s,s),(0,0,0,0)); c.paste(e,((s-e.width)//2, s-e.height)); c=c.resize((560,560),Image.LANCZOS)
        c.save(f'web/{n}.webp',quality=86,method=6)
    elif n.startswith('fond_'):
        im.convert('RGB').resize((1280,round(1280*im.height/im.width)),Image.LANCZOS).save(f'web/{n}.webp',quality=80,method=6)
    elif n.startswith('portrait_'):
        im.convert('RGB').resize((384,384),Image.LANCZOS).save(f'web/{n}.webp',quality=82,method=6)
print(len(glob.glob('web/*.webp')), 'webp')

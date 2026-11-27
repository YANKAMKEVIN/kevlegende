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

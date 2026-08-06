#!/usr/bin/env python3
"""Comprime las fotos originales del catalogo (una sola vez, o cuando subas nuevas).

- Reduce a un maximo de MAXW px de ancho (nunca agranda).
- PNG sin transparencia real -> se convierte a JPG (mucho mas liviano).
- PNG con transparencia (logo, etc.) -> se queda PNG optimizado.
- JPG/JPEG -> se recomprime con calidad JPQ.

Uso:  python3 optimize_images.py [--dry]
Despues corre:  python3 build_catalog.py
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {'.git', '.github', '.claude', 'assets', 'thumbs', '__pycache__'}
SKIP_FILES = {'logo.jpg', 'logo.png'}
MAXW = 1600
JPQ = 85
DRY = '--dry' in sys.argv


def has_alpha(im):
    """True solo si hay pixeles realmente translucidos."""
    if im.mode not in ('RGBA', 'LA', 'P'):
        return False
    im = im.convert('RGBA')
    a = im.getchannel('A')
    return a.getextrema()[0] < 250


def process(path):
    rel = os.path.relpath(path, ROOT)
    before = os.path.getsize(path)
    try:
        im = Image.open(path)
        im.load()
    except Exception as e:
        print(f'  !! {rel}: {e}')
        return 0, 0, None

    alpha = has_alpha(im)
    w, h = im.size
    if w > MAXW:
        im = im.resize((MAXW, round(h * MAXW / w)), Image.LANCZOS)

    ext = os.path.splitext(path)[1].lower()
    newpath = path
    if alpha:
        im = im.convert('RGBA')
        save = dict(format='PNG', optimize=True)
    else:
        if im.mode != 'RGB':
            bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
            bg.alpha_composite(im.convert('RGBA'))
            im = bg.convert('RGB')
        save = dict(format='JPEG', quality=JPQ, optimize=True, progressive=True)
        if ext not in ('.jpg', '.jpeg'):
            newpath = os.path.splitext(path)[0] + '.jpg'

    if DRY:
        import io
        buf = io.BytesIO()
        im.save(buf, **save)
        return before, buf.tell(), (newpath if newpath != path else None)

    im.save(newpath, **save)
    if newpath != path:
        os.remove(path)
    return before, os.path.getsize(newpath), (newpath if newpath != path else None)


def main():
    tot_b = tot_a = 0
    renamed = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith('.')]
        for f in sorted(filenames):
            if not f.lower().endswith(('.png', '.jpg', '.jpeg')):
                continue
            if f.lower() in SKIP_FILES:
                continue
            b, a, new = process(os.path.join(dirpath, f))
            tot_b += b
            tot_a += a
            if new:
                renamed.append(os.path.relpath(new, ROOT))
    mb = lambda n: f'{n / 1024 / 1024:.1f} MB'
    print(('[DRY RUN] ' if DRY else '') + f'Antes: {mb(tot_b)}  ->  Despues: {mb(tot_a)}'
          + (f'   ({100 - tot_a * 100 // max(tot_b, 1)}% menos)' if tot_b else ''))
    print(f'PNG convertidos a JPG: {len(renamed)}')


if __name__ == '__main__':
    main()

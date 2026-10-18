"""Exporta los trazados de los AI originales a SVG monocromo, sin rasterizar.
Requiere pdfplumber. Conserva los originales y añade margen para el contorno.
"""
from pathlib import Path
import json
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
KEYS=['gluten','crustaceans','fish','peanuts','egg','soy','milk','sulphites','mustard','celery','nuts','molluscs','sesame','lupins']
def number(value):return f'{value:.4f}'.rstrip('0').rstrip('.')
def path_data(path):
 result=[];current=(0,0);start=current
 def coords(points):return ' '.join(number(v) for p in points for v in p)
 for op,*points in path:
  if op=='m':result.append('M'+coords(points));start=points[-1]
  elif op=='l':result.append('L'+coords(points))
  elif op=='c':result.append('C'+coords(points))
  elif op=='v':result.append('C'+coords([current,*points]))
  elif op=='y':result.append('C'+coords([*points,points[-1]]))
  elif op=='h':result.append('Z');current=start;continue
  else:raise ValueError(f'Trazado no soportado: {op}')
  current=points[-1]
 return ' '.join(result)
def main():
 out=ROOT/'assets/allergens';out.mkdir(exist_ok=True)
 labels=json.loads((ROOT/'data/allergens.json').read_text())
 for index,key in enumerate(KEYS,1):
  matches=list((ROOT/'material_base/Alergenos vectores').glob(f'{index:02d} *.ai'));assert len(matches)==1,key
  with pdfplumber.open(matches[0]) as pdf:
   page=pdf.pages[0];assert not page.images and not page.chars and not page.rects and not page.lines,key
   shapes=page.curves;pad=1.5;x=min(c['x0'] for c in shapes)-pad;y=min(c['top'] for c in shapes)-pad
   width=max(c['x1'] for c in shapes)-x+pad;height=max(c['bottom'] for c in shapes)-y+pad
   svg=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{number(x)} {number(y)} {number(width)} {number(height)}">']
   for c in shapes:
    fill='#232522' if c['fill'] else 'none';stroke='#232522' if c['stroke'] else 'none'
    svg.append(f'<path d="{path_data(c["path"])}" fill="{fill}" stroke="{stroke}" stroke-width="{number(c["linewidth"] or 1)}" fill-rule="{"evenodd" if c.get("evenodd") else "nonzero"}"/>')
   svg.append('</svg>');(out/f'{key}.svg').write_text('\n'.join(svg)+'\n')
   labels[key]['icon']=f'assets/allergens/{key}.svg'
 (ROOT/'data/allergens.json').write_text(json.dumps(labels,ensure_ascii=False,indent=2)+'\n')
 print('14 iconos SVG exportados desde sus trazados originales.')
if __name__=='__main__':main()

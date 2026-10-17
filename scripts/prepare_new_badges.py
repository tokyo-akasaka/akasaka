"""Exporta la bandera original y recupera fotografías sin sus overlays PDF.
Ejecutar después de regenerar el menú mediodía. Originales intactos.
Requiere Pillow, pypdf y pdfplumber.
"""
from pathlib import Path
import json
from PIL import Image
from pypdf import PdfReader
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
def extract(reader,page,name,target):
 image=next(x.image for x in reader.pages[page-1].images if x.name.rsplit('.',1)[0]==name).convert('RGB')
 image.thumbnail((1400,1400));image.save(ROOT/target,'WEBP',quality=90)
def main():
 out=ROOT/'assets/brand/new.webp'
 badge=Image.open(ROOT/'material_base/carta_indesign/Links/New product.psd').convert('RGBA');badge=badge.crop(badge.getbbox());badge.thumbnail((400,400));badge.save(out,'WEBP',quality=92)
 reader=PdfReader(ROOT/'material_base/carta_akasaka.pdf')
 # Estas son las fotografías del PDF, sin sus banderas superpuestas.
 clean={'S111':(6,'Im3'),'SM107':(7,'Im7'),'SM109':(7,'Im8'),'CR90':(16,'Im1'),'CR91':(16,'Im2'),'CR97':(16,'Im3'),'94':(17,'Im8'),'E10':(17,'Im9'),'MR131':(20,'Im1'),'CR133':(20,'Im3')}
 target=ROOT/'data/menu.json';menu=json.loads(target.read_text());new={'E6','E3',*clean}
 for dish in menu:
  dish['isNew']=dish['reference'] in new
  if dish['reference'] in clean:extract(reader,*clean[dish['reference']],dish['image'])
 target.write_text(json.dumps(menu,ensure_ascii=False,indent=2)+'\n')
 lunchpath=ROOT/'material_base/AKASAKA MEDIODIA BORRADOR 20261011.pdf';lr=PdfReader(lunchpath)
 target=ROOT/'data/lunch.json';lunch=json.loads(target.read_text());new={'E21','E1','ES17','S111'}
 with pdfplumber.open(lunchpath) as pdf:
  for dish in lunch['dishes']:
   ref=dish['reference'];dish['isNew']=ref in new
   if ref=='E1':
    # Fotografía original de Takoyaki, sin el rótulo de novedad.
    source=ROOT/'material_base/carta_indesign/Links/IMG_0125.psd';im=Image.open(source).convert('RGB');im.thumbnail((1400,1400));im.save(ROOT/dish['image'],'WEBP',quality=90)
   elif ref in new:
    page,top={'E21':(2,320),'ES17':(4,317),'S111':(5,306)}[ref]
    matches=[x for x in pdf.pages[page-1].images if 30<x['x0']<65 and 150<x['width']<220 and x['height']>90 and abs(x['top']-top)<8]
    assert len(matches)==1,(ref,matches)
    extract(lr,page,matches[0]['name'],dish['image'])
 target.write_text(json.dumps(lunch,ensure_ascii=False,indent=2)+'\n')
 print('Bandera independiente exportada; fotos limpias: carta',len(clean),'y mediodía',len(new))
if __name__=='__main__':main()

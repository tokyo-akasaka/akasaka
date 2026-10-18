"""Recupera originales y aplica encuadres de presentación editables.
Pillow; los filtros se aplican en CSS, sin modificar los píxeles del original.
"""
from pathlib import Path
from io import BytesIO
import json
from PIL import Image,ImageCms,ImageOps
ROOT=Path(__file__).resolve().parents[1]
def main():
 config=json.loads((ROOT/'docs/ajustes-fotos.json').read_text());path=ROOT/'data/menu.json';menu=json.loads(path.read_text());lookup={d['reference']:d for d in menu}
 srgb=ImageCms.createProfile('sRGB')
 for record in config['photos']:
  if not record.get('generated') and not record.get('preparedComposite'):
   with Image.open(ROOT/record['source']) as source:
    profile=source.info.get('icc_profile');im=ImageOps.exif_transpose(source)
    if im.mode=='RGBA' and record.get('centerAlphaOnCanvas'):
     cut=im.crop(im.getchannel('A').getbbox());cut.thumbnail(tuple(record['subjectMaxSize']),Image.Resampling.LANCZOS);background=Image.new('RGBA',tuple(record['centerAlphaOnCanvas']),tuple(record.get('background',[255,255,255]))+(255,));background.alpha_composite(cut,((background.width-cut.width)//2,(background.height-cut.height)//2));im=background.convert('RGB')
    elif im.mode=='RGBA':
     background=Image.new('RGBA',im.size,tuple(record.get('background',[255,255,255]))+(255,));background.alpha_composite(im);im=background.convert('RGB')
    else:im=im.convert('RGB')
    if profile:im=ImageCms.profileToProfile(im,ImageCms.ImageCmsProfile(BytesIO(profile)),srgb,outputMode='RGB')
    if record.get('extractPhotoBounds'):im=im.crop(record['extractPhotoBounds'])
    
    if record.get('canvasAspect'):
     canvas=Image.new('RGB',(round(im.height*record['canvasAspect']),im.height),tuple(record.get('canvasBackground',[0,0,0])));canvas.paste(im,((canvas.width-im.width)//2,0));im=canvas
    im.thumbnail((1600,1600));im.save(ROOT/record['image'],'WEBP',quality=94)
  dish=lookup[record['reference']];dish['image']=record['image'];dish['imagePosition']=record['position'];dish['imageFilter']=record['filter']
  if record.get('zoom'):dish['imageZoom']=record['zoom']
  if record.get('fit'):dish['imageFit']=record['fit']
  if record.get('aspect'):dish['imageAspect']=record['aspect']
  for axis in ['X','Y']:
   if 'offset'+axis in record:dish['imageOffset'+axis]=record['offset'+axis]
 path.write_text(json.dumps(menu,ensure_ascii=False,indent=2)+'\n')
 print('Fotos preparadas:',len(config['photos']))
if __name__=='__main__':main()

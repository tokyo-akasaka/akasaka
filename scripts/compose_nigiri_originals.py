"""SH38 y SH47: máscaras sobre las fotos originales, sin regenerar comida."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageChops
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
P38=[[(644,545),(653,528),(669,516),(690,510),(694,494),(706,488),(714,503),(736,507),(761,513),(777,526),(790,541),(804,558),(811,587),(809,620),(814,661),(820,706),(816,737),(804,756),(781,766),(755,772),(730,766),(702,752),(681,738),(668,715),(656,681),(650,638),(640,600),(638,570)],[(830,554),(844,536),(858,525),(874,518),(895,516),(921,524),(943,536),(960,556),(971,576),(980,609),(986,650),(994,696),(990,737),(977,763),(958,775),(932,782),(905,783),(879,772),(860,754),(848,730),(839,694),(831,651),(825,609),(825,577)]]
def main():
 folder=ROOT/'exports/nigiri';folder.mkdir(parents=True,exist_ok=True)
 for ref in ['SH38','SH47']:
  source=Image.open(ROOT/f'assets/dishes/{ref.lower()}-original.webp').convert('RGBA')
  if ref=='SH38':
   mask=Image.new('L',source.size);draw=ImageDraw.Draw(mask)
   for polygon in P38:draw.polygon(polygon,fill=255)
   a=np.array(source.convert('RGB')).astype('float32');foreground=(a[:,:,0]>a[:,:,2]*1.12)&(a[:,:,1]>a[:,:,2]*.95)
   mask=Image.fromarray((np.array(mask)*foreground).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.4))
  else:
   a=np.array(source.convert('RGB')).astype('int16');colored=((a.max(axis=2)-a.min(axis=2))>55)&(a[:,:,0]>a[:,:,1]+40)
   mask=Image.fromarray((colored*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
   outside=mask.copy();ImageDraw.floodfill(outside,(0,0),128)
   filled=np.array(outside);mask=Image.fromarray(np.where(filled==128,0,255).astype('uint8')).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.4))
  source.putalpha(mask);cut=source.crop(mask.getbbox());cut.save(folder/f'{ref.lower()}-recorte-original.png')
  base=Image.open(ROOT/'assets/templates/fondo-nigiri.png').convert('RGBA');height=round(base.height*.66);width=round(cut.width*height/cut.height);cut=cut.resize((width,height),Image.Resampling.LANCZOS);xy=((base.width-width)//2,(base.height-height)//2)
  alpha=Image.new('L',base.size);alpha.paste(cut.getchannel('A'),(xy[0],xy[1]+7));alpha=alpha.filter(ImageFilter.GaussianBlur(8)).point(lambda v:round(v*.2));shadow=Image.new('RGBA',base.size);shadow.putalpha(alpha);base=Image.alpha_composite(base,shadow);base.alpha_composite(cut,xy)
  base.convert('RGB').save(folder/f'{ref.lower()}-fondo-nigiri.png',dpi=(300,300));base.convert('RGB').save(ROOT/f'assets/dishes/{ref.lower()}-fondo-nigiri.webp','WEBP',quality=95)
if __name__=='__main__':main()

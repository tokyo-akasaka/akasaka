"""Montaje determinista: recorte manual del original, sin generar pescado.
Conserva colores originales; solo máscara alfa, escala y sombra de contacto.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
ROOT=Path(__file__).resolve().parents[1]
FRONT=[(65,224),(78,224),(91,219),(101,214),(105,195),(117,181),(136,170),(155,166),(181,165),(202,167),(224,175),(249,189),(270,204),(296,220),(322,243),(348,270),(369,300),(385,323),(397,347),(409,368),(422,388),(421,397),(416,405),(407,399),(399,394),(396,406),(391,417),(382,421),(368,415),(354,406),(340,398),(325,389),(314,374),(306,358),(301,345),(286,338),(277,331),(261,326),(247,318),(232,312),(221,305),(206,295),(195,281),(181,277),(169,269),(155,268),(150,260),(144,255),(139,244),(135,237),(127,245),(116,247),(104,246),(92,242),(78,239),(68,234)]
BACK=[(250,181),(266,177),(277,165),(285,155),(298,149),(319,144),(340,142),(365,148),(391,157),(417,169),(441,180),(467,193),(492,209),(513,231),(533,261),(550,289),(568,316),(584,343),(599,362),(597,369),(584,367),(571,366),(557,365),(543,360),(526,353),(512,343),(499,338),(491,337),(484,339),(477,334),(469,334),(461,330),(452,333),(443,331),(436,328),(431,321),(422,324),(417,322),(410,318),(404,309),(398,307),(392,301),(388,295),(375,280),(352,255),(330,235),(305,217),(280,201),(263,190)]
def main():
 source=Image.open(ROOT/'assets/dishes/sh31-original.webp').convert('RGBA')
 scale=4;mask=Image.new('L',(source.width*scale,source.height*scale));draw=ImageDraw.Draw(mask)
 outer=FRONT[:FRONT.index((249,189))+1]+BACK[1:BACK.index((388,295))+1]+FRONT[FRONT.index((385,323)):]
 draw.polygon([(x*scale,y*scale) for x,y in outer],fill=255)
 mask=mask.resize(source.size,Image.Resampling.LANCZOS);source.putalpha(mask)
 cut=source.crop(mask.getbbox());folder=ROOT/'exports/nigiri';folder.mkdir(exist_ok=True,parents=True)
 cut.save(folder/'sh31-recorte-original.png')
 base=Image.open(ROOT/'assets/templates/fondo-nigiri.png').convert('RGBA')
 width=round(base.width*.63);height=round(cut.height*width/cut.width);cut=cut.resize((width,height),Image.Resampling.LANCZOS)
 xy=((base.width-width)//2,(base.height-height)//2)
 shadow=Image.new('RGBA',base.size);alpha=Image.new('L',base.size);alpha.paste(cut.getchannel('A'),(xy[0],xy[1]+7));alpha=alpha.filter(ImageFilter.GaussianBlur(9)).point(lambda v:round(v*.18));shadow.putalpha(alpha)
 base=Image.alpha_composite(base,shadow);base.alpha_composite(cut,xy)
 base.convert('RGB').save(folder/'sh31-fondo-nigiri.png',dpi=(300,300))
 print('Montaje guardado; píxeles del pescado proceden únicamente de sh31-original.webp.')
if __name__=='__main__':main()

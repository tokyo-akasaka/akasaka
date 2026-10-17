"""Extrae fotos y completa el menú mediodía desde su borrador local.
Requiere pypdfium2 y Pillow. No modifica los PDF ni la carta de otras modalidades.
"""
from pathlib import Path
import json
import pypdfium2 as pdfium
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'material_base/AKASAKA MEDIODIA BORRADOR 20261011.pdf'
# Referencia, nombre ES/EN, ingredientes ES/EN, cantidad, dos personas.
PAGES={
2:[
('E6','Cha Giò Hai San','Cha Giò Hai San','Rollitos de marisco.','Seafood rolls.',4,True),
('E2','Sushi Quingo','Sushi Quingo','Bolas de arroz frito con queso.','Fried rice balls with cheese.',2,False),
('E21','Gyoza de la casa','House Gyoza','Empanadillas hechas a mano con carne picada y verduras.','Handmade dumplings with minced meat and vegetables.',4,True),
('E3','Gyoza vegetal','Vegetable Gyoza','Empanadillas japonesas rellenas de verduras con mayonesa picante.','Japanese dumplings filled with mixed vegetables and spicy mayonnaise.',4,False),
('ES20','Gyoza Tori','Gyoza Tori','Raviolis fritos de pollo y verduras con salsa de curry.','Fried chicken and vegetable ravioli with curry sauce.',4,False),
('E5','Harumaki','Harumaki','Rollitos con verduras.','Vegetable rolls.',5,False)],
3:[
('E7','Ebi Kimono','Ebi Kimono','Gambas en kimono.','Prawns in kimono.',4,False),
('E4','Tiras de pollo','Chicken Strips','Pollo con salsa chili.','Chicken with chili sauce.',4,False),
('E28','Wantun frito','Fried Wontons','Rellenos de queso Philadelphia y surimi.','Filled with Philadelphia cream cheese and surimi.',4,False),
('E1','Takoyaki','Takoyaki','Bolitas de pulpo con salsa takoyaki.','Octopus balls with takoyaki sauce.',2,False),
('GY22','Butaman','Butaman','Raviolis con carne.','Dumplings with meat.',3,False),
('GY23','Dimsum','Dim Sum','Hakao cantonés relleno de gamba picada, en caldo katsuobushi.','Cantonese har gow dumplings filled with minced prawn, in katsuobushi broth.',3,False)],
4:[
('ES13','Ebi Shake Sarada','Ebi Shake Sarada','Ensalada mezclum con salmón y gambas, con salsa de la casa y yuzu.','Mixed leaf salad with salmon and prawns, house sauce and yuzu.',None,False),
('ES14','Wakame Sarada','Wakame Sarada','Ensalada de algas.','Seaweed salad.',None,False),
('ES17','Shake Abokado','Shake Abokado','Ensalada mezclum con salmón, aguacate, salsa de la casa y yuzu.','Mixed leaf salad with salmon, avocado, house sauce and yuzu.',None,False),
('ES18','Wakame Abokado','Wakame Abokado','Ensalada mezclum con wakame y aguacate.','Mixed leaf salad with wakame and avocado.',None,False),
('ES12','Maguro Abokado','Maguro Abokado','Ensalada mezclum con atún, aguacate, salsa de la casa y yuzu.','Mixed leaf salad with tuna, avocado, house sauce and yuzu.',None,False),
('E11','Edamame','Edamame','Soja verde con sal.','Green soybeans with salt.',None,False)],
5:[
('S112','Espinaca Misoshiru','Spinach Misoshiru','Sopa de miso con espinaca.','Miso soup with spinach.',None,False),
('S110','Tofu Misoshiru','Tofu Misoshiru','Sopa de miso con tofu.','Miso soup with tofu.',None,False),
('S111','Misoshiru','Misoshiru','Sopa de miso con almejas y algas.','Miso soup with clams and seaweed.',None,False)],
6:[
('UD141','Tonkatsu Ramen','Tonkatsu Ramen','Ramen con pechuga de pollo rebozada y narutomaki.','Ramen with breaded chicken breast and narutomaki.',None,False),
('M157','Katsudon','Katsudon','Pollo empanado con huevo y cebolla sobre cama de arroz.','Breaded chicken with egg and onion on a bed of rice.',None,False),
('M156','Teriyaki de pollo con arroz','Chicken Teriyaki with Rice','Pollo, cebolla y salsa teriyaki con arroz.','Chicken, onion and teriyaki sauce with rice.',None,False),
('M155','Yakisoba','Yakisoba','Tallarines con gambas y verduras mixtas.','Noodles with prawns and mixed vegetables.',None,False),
('M158','Pollo estilo Thai','Thai-style Chicken','Pollo con salsa de curry picante. Arroz opcional.','Chicken with spicy curry sauce. Rice optional.',None,False),
('CR139','Langostinos Ebi Chili','Ebi Chili Prawns','Verduras de temporada con salsa de chili.','Seasonal vegetables with chili sauce.',None,False)],
7:[
('UD163','Duck Chow Mein','Duck Chow Mein','Pato con tallarines y verduras.','Duck with noodles and vegetables.',None,False),
('DR106','Kamo Donburi','Kamo Donburi','Pechuga de pato sobre cama de arroz.','Duck breast on a bed of rice.',None,False),
('DR104','Gyudon','Gyudon','Ternera sobre cama de arroz.','Beef on a bed of rice.',None,False),
('CR128','Yakiniku','Yakiniku','Entrecot de ternera con salsa yakiniku.','Beef entrecôte with yakiniku sauce.',None,False),
('MR131','Ika Syogayaki','Ika Syogayaki','Calamares a la plancha en salsa de jengibre shoga.','Grilled squid in shoga ginger sauce.',None,False),
('M161','Donburi salmón teriyaki','Salmon Teriyaki Donburi','Salmón con arroz.','Salmon with rice.',None,False)],
8:[
('CM170','Mix Sushi Hoso','Mix Sushi Hoso','2 nigiri de salmón, 2 de atún, 2 de gambas y 6 hosomaki de salmón.','2 salmon nigiri, 2 tuna nigiri, 2 prawn nigiri and 6 salmon hosomaki.',12,False),
('CM171','Mix Samo Ebi','Mix Samo Ebi','4 nigiri de salmón, 4 de gambas y 4 California.','4 salmon nigiri, 4 prawn nigiri and 4 California rolls.',12,False),
('CM172','Mix Samo Hoso','Mix Samo Hoso','2 nigiri de salmón, 2 de gambas, 4 California y 6 kappa maki.','2 salmon nigiri, 2 prawn nigiri, 4 California rolls and 6 kappa maki.',14,False),
('CM173','Mix Hosomaki','Mix Hosomaki','6 maki de atún, 6 de aguacate y 6 de salmón.','6 tuna maki, 6 avocado maki and 6 salmon maki.',18,False),
('CM174','Mix Max','Mix Max','2 ebi, 2 saba, 2 shakeaburi, 4 shake, 2 de pez mantequilla y 2 maguro.','2 prawn, 2 mackerel, 2 flame-seared salmon, 4 salmon, 2 butterfish and 2 tuna nigiri.',14,False),
('CM175','Mix Sashimi','Mix Sashimi','2 nigiri de salmón, 2 de atún, 2 de gambas, 6 maki de salmón, 3 sashimi de atún y 3 de salmón.','2 salmon nigiri, 2 tuna nigiri, 2 prawn nigiri, 6 salmon maki, 3 tuna sashimi and 3 salmon sashimi.',18,False)]}
# Áreas fotográficas comprobadas en las páginas renderizadas; puntos PDF.
BOUNDS={
2:(43,228,[79,208,328,455,576,696],[198,318,440,567,687,807]),
3:(36,220,[63,183,303,423,543,661],[174,294,414,534,653,775]),
4:(43,228,[63,186,318,438,558,693],[176,296,427,548,674,804]),
5:(36,220,[65,185,307],[176,296,416]),
6:(36,220,[65,186,306,426,546,667],[176,296,417,537,657,785]),
7:(36,220,[65,185,306,426,541,664],[176,296,417,537,659,773]),
8:(36,220,[62,183,304,424,544,665],[173,293,413,533,653,781])}
# No se deducen alérgenos de ingredientes. Se mantienen los ya comprobados;
# null señala que falta revisar los símbolos del PDF.
VERIFIED={'E2':['gluten','sesame','egg','milk','sulphites'],'E3':['mustard','gluten','egg','soy'],'E1':['gluten','sesame','egg','molluscs','soy']}
def main():
 target=ROOT/'data/lunch.json';data=json.loads(target.read_text());d=pdfium.PdfDocument(str(SOURCE));dishes=[]
 for page,rows in PAGES.items():
  im=d[page-1].render(scale=3).to_pil().convert('RGB');left,right,tops,bottoms=BOUNDS[page]
  for i,(ref,es,en,desc,english,qty,two) in enumerate(rows):
   crop=im.crop((left*3,tops[i]*3,right*3,bottoms[i]*3));crop.thumbnail((1100,1100));asset=f'assets/dishes/lunch-{ref.lower()}.webp';crop.save(ROOT/asset,'WEBP',quality=88)
   portions={'es':f'{qty} uds.' if qty else '', 'en':f'{qty} pcs.' if qty else ''}
   if two:portions={lang:text+(' · Para 2 personas' if lang=='es' else ' · For 2 people') for lang,text in portions.items()}
   dishes.append({'reference':ref,'category':'primeros' if page<=5 else 'segundos' if page<=7 else 'sushi','name':{'es':es,'en':en},'description':{'es':desc,'en':english},'image':asset,'portion':portions,'twoPersons':two,'allergens':VERIFIED.get(ref),'sourcePage':page})
 data['dishes']=dishes;target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');print('Mediodía:',len(dishes),'platos')
if __name__=='__main__':main()

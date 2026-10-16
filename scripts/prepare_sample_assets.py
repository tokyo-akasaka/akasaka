"""Genera copias web; no modifica los materiales originales. Requiere Pillow, pypdf y pypdfium2."""
from pathlib import Path
from PIL import Image
from pypdf import PdfReader
import pypdfium2 as pdfium
ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'material_base/carta_indesign/Links'
sources = {
    'e1': 'IMG_0125.psd',
    'e2': 'WhatsApp Image 2026-10-07 at 21.03.49 copia.jpeg',
    'e3': 'E-03.psd',
    'e4': 'WhatsApp Image 2026-10-07 at 21.03.49 copia 2.jpeg',
    'e5': 'WhatsApp Image 2026-10-06 at 14.27.31.jpeg',
}
# Correspondencias verificadas visualmente contra la página 2.
for ref, filename in sources.items():
    im = Image.open(source / filename).convert('RGB')
    im.thumbnail((1400, 1400))
    im.save(ROOT / f'assets/dishes/{ref}.webp', 'WEBP', quality=88)
    print(ref, filename, im.size)
photo = list(PdfReader(ROOT / 'material_base/carta_akasaka.pdf').pages[1].images)[1].image.convert('RGB')
photo.save(ROOT / 'assets/dishes/e6.webp', 'WEBP', quality=88)
logo = pdfium.PdfDocument(str(source / 'Logo akasaka 2025.ai'))[0].render(scale=2, fill_color=(0,0,0,0)).to_pil().convert('RGBA')
logo = logo.crop(logo.getbbox())
logo.save(ROOT / 'assets/brand/akasaka.png')

# Akasaka · carta digital en revisión

HTML, CSS y JavaScript nativos. Sin framework ni compilación.

## Arranque local

Desde la carpeta del proyecto: `python3 scripts/serve.py`. Abrir http://localhost:8000.
El servidor solo escucha en 127.0.0.1; bloquea material_base, docs y scripts.

## Páginas

- `index.html`: cuatro accesos grandes en una columna, también en escritorio.
- `menu.html?mode=buffet`: comida sin postres ni precios individuales; estrellas y dos personas; ventana de condiciones en cabecera.
- `menu.html?mode=carta`: precios por plato, sin estrellas ni requisito de dos personas; incluye los 15 postres.
- `menu.html?mode=lunch`: menú mediodía completo: 21 primeros, 12 segundos y 6 combinaciones de sushi; tarifas de 16,90 € / 17,90 €.
- `menu.html?mode=drinks`: las 65 referencias de bebidas del PDF, con copa/chupito cuando procede.

## Contenido editable

- `data/menu.json`: comida, traducciones, precios, fotos, cantidades, restricciones buffet. 136 platos completos en 15 categorías.
- `data/categories.json`: nombres, iconos y orden de categorías de comida.
- `data/buffet.json`: tarifas, reglas y significado de las estrellas.
- `data/lunch.json`: tarifas, condiciones y recetas propias del borrador de mediodía.
- `data/drinks.json`: categorías y todas las bebidas con sus precios.
- `data/allergens.json`: traducciones y rutas a los 14 iconos SVG originales.
- `docs/revision-carta.md`: discrepancias y revisión pendiente.

Las recetas de mediodía son independientes: una misma referencia puede tener otra cantidad o composición en el borrador. Alérgenos `null` significa pendiente de verificar, nunca ausencia. Los originales de `material_base/` se conservan intactos.

## Diseño

Variables de colores en `css/styles.css`. Tema recordado con `js/theme.js`; idioma en `js/language.js`. Cabecera fija, navegación por pestañas laterales en móvil con categoría activa según el scroll. La ventana de condiciones usa un dialog nativo con cierre por botón o Escape y devuelve el foco a quien la abrió.

## Publicación futura

Publicar solo index.html, menu.html y css/, js/, data/, assets/. Nunca material_base/, scripts/ o docs/.

## Compartir un plato · La Carta

Botón discreto con icono de compartir. Se usa el menú nativo del dispositivo cuando está disponible; como alternativa se copia el enlace. Si no se puede copiar, se muestra el enlace seleccionable. Cancelar el menú de compartir no copia nada.

Los enlaces usan `menu.html?mode=carta&lang=es#dish-E2`, conservando la subcarpeta de GitHub Pages. La referencia identifica la tarjeta completa. Se resuelve el ancla después de cargar el JSON, con espacio para la cabecera y resaltado temporal. No hay páginas individuales, precios en el mensaje y el audio se conserva como función independiente.

Pruebas: `node --test tests/share.test.mjs`. No publican ni comparten mensajes reales.
## V0.1.1

Menú mediodía completo (39 platos) y bebidas completas (65 referencias). En esta rama la carta general y el buffet ya están completos. Aviso: Diseño en revisión V0.1.1.

## Experimento de audio descriptivo

Cada tarjeta tiene Escuchar y Detener. `js/audio.js` genera la narración desde los datos de la modalidad y usa SpeechSynthesis del dispositivo, sin API ni micrófono. Nunca reproduce automáticamente. Un solo lector compartido cancela la lectura anterior. Se detiene al cambiar idioma, abrir condiciones, ocultar la página o navegar fuera. Una barra inferior permite detener un plato aunque su tarjeta quede fuera de pantalla.

Lee el precio en carta y bebidas (incluido chupito), las restricciones en buffet, y la pertenencia al menú en mediodía. Lee los alérgenos verificados o avisa si están pendientes. Los campos opcionales `speechName: {es, en}` y `speechDescription: {es, en}` permiten ajustar pronunciaciones sin cambiar el texto visible.

Las voces y su calidad dependen del navegador y del sistema; algunas voces del sistema pueden utilizar servicios de red. Si no hay soporte o falla la voz, se muestra un aviso y la carta sigue disponible. Prueba pendiente con sonido real en Safari/iPhone y Chrome/Android, especialmente los nombres japoneses.

Pruebas de lógica: `node --test tests/audio.test.mjs`. No generan audio real.

## Bandera NEW independiente

`isNew: true` en cada plato activa la bandera `assets/brand/new.webp`, exportada de `New product.psd`. Es un elemento separado de la imagen y del recorte redondeado. Posición y tamaño en `.new-badge` y las variables `--new-badge-top`, `--new-badge-left` de `.dish-visual`.

Las fotografías que tenían la bandera incrustada se sustituyeron por sus objetos foto originales del PDF o el PSD original, sin retocarlos. Ejecutar `scripts/prepare_new_badges.py` después de `scripts/complete_lunch_v011.py` si se regeneran las fotos de mediodía.

## Carta completa · feature/advanced-all

136 platos en carta (con 15 postres) y 121 en buffet. Mediodía conserva sus 39 platos y bebidas sus 65 referencias. Se incorporan las fotos de todos los platos y las 17 fotos de bebidas que aparecen en el PDF; los seis sabores de mochi se reúnen en una imagen. Las botellas se muestran completas dentro de la tarjeta existente.

Se mantiene el diseño de esta rama, los botones de alérgenos, audio y compartir, el selector de idioma y de tema. El aviso de versión continúa en V0.1.1. No se añade aún un servicio remoto de activación de tarifas.

`docs/inventario-carta.csv` contiene la correspondencia entre página, referencia, precio e imagen. `docs/revision-carta.md` recoge las contradicciones del original y las correcciones editoriales. Los alérgenos reproducen los símbolos impresos y requieren validación del restaurante; null nunca significa ausencia.

Verificación conjunta: `node --test tests/*.test.mjs`.

## Iconos de alérgenos

Los 14 AI de `material_base/Alergenos vectores/` se exportan como trazados SVG en `assets/allergens/`, sin imágenes raster incrustadas. Regeneración: `python3 scripts/prepare_allergen_icons.py` (pdfplumber). El panel de alérgenos muestra icono y nombre en el idioma elegido, en carta, buffet y mediodía. Los datos pendientes conservan su aviso; disponer del icono no valida la composición de un plato.

Encuadres y color de las fotos revisadas: docs/ajustes-fotos.json. Los campos imagePosition, imageFilter e imageZoom de cada plato permiten afinar su presentación sin editar el original. Las copias web se preparan con scripts/prepare_reviewed_food_photos.py.

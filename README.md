# Akasaka · carta digital en revisión

HTML, CSS y JavaScript nativos. Sin framework ni compilación.

## Arranque local

Desde la carpeta del proyecto: `python3 scripts/serve.py`. Abrir http://localhost:8000.
El servidor solo escucha en 127.0.0.1; bloquea material_base, docs y scripts.

## Páginas

- `index.html`: cuatro accesos grandes en una columna, también en escritorio.
- `menu.html?mode=buffet`: comida sin postres ni precios individuales; estrellas y dos personas; ventana de condiciones en cabecera.
- `menu.html?mode=carta`: precios por plato, sin estrellas ni requisito de dos personas; incluye 3 postres.
- `menu.html?mode=lunch`: muestra del menú mediodía con tarifas de 16,90 € / 17,90 € y 3 platos por grupo.
- `menu.html?mode=drinks`: las 65 referencias de bebidas del PDF, con copa/chupito cuando procede.

## Contenido editable

- `data/menu.json`: comida, traducciones, precios, fotos, cantidades, restricciones buffet. 3 muestras por categoría, o 2 si solo existen 2.
- `data/categories.json`: nombres, iconos y orden de categorías de comida.
- `data/buffet.json`: tarifas, reglas y significado de las estrellas.
- `data/lunch.json`: tarifas, condiciones y recetas propias del borrador de mediodía.
- `data/drinks.json`: categorías y todas las bebidas con sus precios.
- `data/allergens.json`: traducciones; los SVG originales están pendientes de incorporación.
- `docs/revision-carta.md`: discrepancias y revisión pendiente.

Las recetas de mediodía son independientes: una misma referencia puede tener otra cantidad o composición en el borrador. Alérgenos `null` significa pendiente de verificar, nunca ausencia. Los originales de `material_base/` se conservan intactos.

## Diseño

Variables de colores en `css/styles.css`. Tema recordado con `js/theme.js`; idioma en `js/language.js`. Cabecera fija, navegación por pestañas laterales en móvil con categoría activa según el scroll. La ventana de condiciones usa un dialog nativo con cierre por botón o Escape y devuelve el foco a quien la abrió.

## Publicación futura

Publicar solo index.html, menu.html y css/, js/, data/, assets/. Nunca material_base/, scripts/ o docs/.

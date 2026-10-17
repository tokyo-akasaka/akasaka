# Akasaka · carta digital en revisión

HTML, CSS y JavaScript nativos. Sin framework ni compilación.

## Arranque local

Desde la carpeta del proyecto: `python3 scripts/serve.py`. Abrir http://localhost:8000.
El servidor solo escucha en 127.0.0.1; bloquea material_base, docs y scripts.

## Páginas

- `index.html`: cuatro accesos grandes en una columna, también en escritorio.
- `menu.html?mode=buffet`: comida sin postres ni precios individuales; estrellas y dos personas; ventana de condiciones en cabecera.
- `menu.html?mode=carta`: precios por plato, sin estrellas ni requisito de dos personas; incluye 3 postres.
- `menu.html?mode=lunch`: menú mediodía completo: 21 primeros, 12 segundos y 6 combinaciones de sushi; tarifas de 16,90 € / 17,90 €.
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

## V0.1.1

Menú mediodía completo (39 platos) y bebidas completas (65 referencias). La carta general y el buffet mantienen sus muestras por categoría. Aviso: Diseño en revisión V0.1.1.

## Experimento de audio descriptivo

Cada tarjeta tiene Escuchar y Detener. `js/audio.js` genera la narración desde los datos de la modalidad y usa SpeechSynthesis del dispositivo, sin API ni micrófono. Nunca reproduce automáticamente. Un solo lector compartido cancela la lectura anterior. Se detiene al cambiar idioma, abrir condiciones, ocultar la página o navegar fuera. Una barra inferior permite detener un plato aunque su tarjeta quede fuera de pantalla.

Lee el precio en carta y bebidas (incluido chupito), las restricciones en buffet, y la pertenencia al menú en mediodía. Lee los alérgenos verificados o avisa si están pendientes. Los campos opcionales `speechName: {es, en}` y `speechDescription: {es, en}` permiten ajustar pronunciaciones sin cambiar el texto visible.

Las voces y su calidad dependen del navegador y del sistema; algunas voces del sistema pueden utilizar servicios de red. Si no hay soporte o falla la voz, se muestra un aviso y la carta sigue disponible. Prueba pendiente con sonido real en Safari/iPhone y Chrome/Android, especialmente los nombres japoneses.

Pruebas de lógica: `node --test tests/audio.test.mjs`. No generan audio real.

# Carta completa · revisión del 18/10/2026

La web utiliza los platos visibles de `material_base/carta_akasaka.pdf` (28 páginas). El IDML se utiliza como material de apoyo: sus elementos fuera de página y los textos ocultos del proveedor no se convierten en platos.

## Inventario

| Categoría | Platos |
|---|---:|
| Entrantes | 22 |
| Sopas | 3 |
| Ramen | 3 |
| Poke | 3 |
| Fideos y arroz | 6 |
| Nigiri | 24 |
| Hosomaki | 10 |
| Temaki | 5 |
| Rollitos | 18 |
| Carpaccio | 5 |
| Sashimi | 2 |
| Tartar | 2 |
| Carnes | 10 |
| Pescado y marisco | 8 |
| Postres | 15 |
| **Total carta** | **136** |

Buffet: 121 platos, sin postres ni precios individuales. Se transcriben las estrellas y el requisito de dos personas del PDF. Carta: precios, sin estas restricciones. Se conservan los códigos `SH044` y `94` tal como están impresos.

Mediodía: 39 referencias del documento `AKASAKA MEDIODIA BORRADOR 20261011.pdf`: 21 primeros, 12 segundos y 6 combinaciones de sushi. Bebidas: 65 referencias de páginas 25–28, con las 17 fotografías visibles y tarifa de chupito solo donde consta.

`inventario-carta.csv` permite localizar cada referencia, página de origen, precio e imagen. Los textos y precios se editan directamente en los JSON de `data/`. Los originales permanecen intactos.

## Imágenes

Las fotografías se extraen de los objetos raster del PDF, evitando textos e iconos superpuestos. En las imágenes fragmentadas se utiliza un recorte del área fotográfica. Se aprovechan las fotos limpias ya existentes; ES13, ES18 y E28 se recuperan de los originales de Links. PS184 reúne sus seis fotografías de sabores en una sola composición. No se han generado imágenes de platos ni se han añadido fotos a bebidas que no las tienen en el original.

Las banderas NEW son elementos independientes, controlados por `isNew`. No se modifica su posición ni el diseño de tarjetas, botones o navegación. Las botellas se encajan completas en el espacio fotográfico existente.

## Correcciones y confirmaciones pendientes

Las erratas tipográficas, cortes de línea y ligaduras se normalizan. Las traducciones se ajustan al español sin añadir ingredientes; las contradicciones de receta se conservan como pendientes de confirmar (`reviewPending`).

| Página | Referencia | Original / incidencia | Tratamiento en la web / confirmación |
|---|---|---|---|
| 5 | GY25 | Español rúcula; inglés lechuga | Inglés ajustado a rúcula. Confirmar receta. |
| 7 | SM109 | «angula, tipico»; inglés copiado de atún | No se inventa receta ni traducción. Aviso de confirmación. |
| 7 | SM108 | Poke de salmón con inglés copiado de atún | Inglés traducido desde español; confirmar. |
| 9 | SH34 | Hokkigai / «fasolari» | Se mantiene el término del PDF; confirmar especie y denominación. |
| 9 | SH38 | Descripción con pistacho; iconos solo de pescado | Iconos transcritos, sin inferir nuevos alérgenos. Revisar con restaurante. |
| 9 | SH39 | Corvina traducida como sea bass | Inglés normalizado a meagre. |
| 10 | SH49 | «matequilla» | Mantequilla; se recuperan descripción y 2 unidades. |
| 10 | SH57 | «atoro» / toro, composición poco clara | Se utiliza toro como en inglés; confirmar composición. |
| 10 | SH58 | «VIERRA» | Vieira; 2 unidades según inglés. |
| 11–12 | HM86, TK52, TK55 | Spacy / spyci | Spicy. |
| 14 | RS66 | «Espacial Banzai», «matequilla», «truba» | Se conserva el nombre; mantequilla y trufa corregidas. Confirmar nombre. |
| 14–15 | RS69, RS72 | Mismo nombre Sake Waka, recetas distintas | Fichas independientes, sin fusionar. |
| 15 | RS78 | Katsuobushi Roll / katsusushi / Katsu Sushi | Se conserva la descripción; confirmar ingrediente. |
| 16–17 | CR90, CR93, 94 | Iconos no recogen pescado o almendras de la descripción | Se transcriben solo iconos impresos; revisión pendiente. |
| 17 | E10 | «tarrat», «topigo» | Tartar y tobiko; pendiente de validación final. |
| 18 | CR128 | Yakiniku en español; teriyaki en inglés | Inglés ajustado a yakiniku; confirmar salsa. |
| 19 | CR120 | Título teriyaki; descripción sésamo | Ambos se mantienen; confirmar receta. |
| 21 | CR138 | Nombre de langostinos; descripción solo de verduras | Se conserva sin añadir ingredientes; confirmar descripción. |
| 22 | PS181 | Azuki descrito como soja roja | Azuki dulce / sweet azuki beans. |
| 22 | PS191 | Piña natural con icono gluten | Se conserva el icono impreso y se marca para revisión. |
| 23 | PS193 | «95gaa» | 95 g según inglés. |
| 24 | PS184 | «35 RR/UN.» | No se interpreta como peso. Se muestran las 2 unidades y los seis sabores; confirmar el dato. |
| 24 | PS195 | «Bayleis», dos rellenos, almendra/piñones sin icono de frutos de cáscara | Baileys corregido; se conservan ambos rellenos y se marca para revisión. |

## Alérgenos

Se transcriben los símbolos del PDF comparándolos con su leyenda de página 1. Esto reproduce el material, no constituye validación de ingredientes por el restaurante. No se añaden alérgenos por inferencia. PS184 conserva `allergens: null` y el aviso correspondiente. HM80 y HM81 se marcan como `allergens: []` por confirmación del usuario: muestran y leen «Sin alérgenos». La falta de iconos nunca se presenta como ausencia de alérgenos. En mediodía se conservan los valores pendientes del borrador independiente. Recibidos los 14 AI de `material_base/Alergenos vectores/` e incorporados como SVG en carta, buffet y mediodía. Esta incorporación no cambia los alérgenos asignados a las recetas.

## Diferencias entre carta y mediodía

No fusionar por referencia: E5 es pato en carta y verdura en mediodía; E4, E7 y GY22 cambian cantidades; E6 cambia descripción; CR139 es Thai en carta y Ebi Chili en mediodía. Los precios individuales residuales del borrador de mediodía no son suplementos. Se conservan sus tarifas de 16,90 € / 17,90 €, condiciones y composiciones propias.

## Verificación

14 pruebas de datos, audio y enlaces para compartir. Comprobación de referencias y precios contra las páginas visibles, fotos WebP decodificables y modalidades en navegador. La voz real sigue dependiendo del dispositivo y requiere prueba auditiva en los teléfonos finales.

Actualización de fotografía: CR93 (carpaccio de atún) utiliza `Links/carpacho de atun.png`, facilitada el 18/10/2026 en sustitución de `Rollitos de atún sobre hoja verde y salsa cremosa.png`. Copia web: `assets/dishes/cr93.webp`.

Actualización de fotografía: CR91 (carpaccio de salmón) utiliza `Links/carpacho de salmon.png`, facilitada el 18/10/2026. Copia web: `assets/dishes/cr91.webp`.

Mediodía: añadido por indicación del restaurante «Helado con gyoza» (imagen `Links/helado con gyoza.png`) como postre incluido, sin precio individual ni referencia comercial inventada. El identificador interno es `helado-con-gyoza`. Alérgenos pendientes de facilitar. Total actual: 40 fichas, incluidas las 39 del PDF. Las adiciones manuales se conservan al regenerar el borrador.

Bebidas: nuevas versiones panorámicas generadas con image_gen a partir de las fotografías de referencia para 207, 208, 253, 257, 258, 259 y los seis sakes. El propio escenario llena el encuadre, sin franjas ni fondos duplicados. Se conservan las imágenes anteriores. Prompts y archivos finales: imagenes-bebidas-generadas.json. Se corrige el cruce de fotos entre SA303 (Kubota Senju) y SA304 (Hanaawaka).

## Revisión de color y encuadre · 18/10/2026

Se revisan E6, E7, E8, E11, ES12, ES17, ES18, GY26, E28, S111, UD148, UD146 y UD145, y los 24 nigiri. Se recuperan 35 fotografías desde Links, respetando sus perfiles de color y convirtiéndolos a sRGB para evitar la saturación de algunas extracciones CMYK del PDF. E6 utiliza el archivo de mayor resolución. UD148 recupera el plato completo y centrado. Los nigiri recuperan la composición más abierta de sus originales.

Los ajustes suaves de luminosidad, saturación y posición se aplican en la web mediante imageFilter, imagePosition e imageZoom, editables por plato. SH47 conserva su fondo blanco y muestra las dos piezas completas. Solo SH39 y SH56 requieren ampliar el fondo con image_gen: se conservan las dos piezas de cada foto; prompts, referencias y archivos finales se registran en ajustes-fotos.json. Los originales y las versiones anteriores permanecen disponibles.

Regeneración de las copias y parámetros: scripts/prepare_reviewed_food_photos.py. No modifica ingredientes, alérgenos, precios ni restricciones. Se aplica a carta y buffet; las recetas y fotografías independientes de mediodía se conservan.

Plantilla aprobada por el usuario: «fondo nigiri», archivo assets/templates/fondo-nigiri.png. Pizarra gris y hoja verde derivadas de SH30, sin nigiri. Reutilizar esta misma base para los siguientes montajes; conservar el pescado de cada foto original mediante recorte, sin regenerarlo.

Revisión final del grupo nigiri: por indicación del usuario se recuperan exclusivamente las fotografías originales, con recortes rectangulares centrados similares a su muestra. Ningún nigiri generado o montado se utiliza en la web. SH30 también vuelve a su fotografía original. Parámetros y procedencia: docs/ajustes-fotos.json.


### Revisión de encuadres con originales y PDF

Recuperados y centrados los originales de HM77 y HM79–HM87, 94 y MR137. SH39 y SH56 conservan el tamaño habitual de caja, con recortes del original centrados en las piezas. Ajustados SH37, SH044 y SH58; ampliados SH38 y SH47 (recorte inferior limpio). UD148 desplazado 20 px hacia la derecha respecto al ajuste anterior. Se conservan los originales y los encuadres se documentan en ajustes-fotos.json.

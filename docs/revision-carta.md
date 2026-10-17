# Muestra inicial · estado de revisión

Se implementan solo E6, E2, E3, E4, E5 y E1 (página 2 del PDF). Precio, referencia y cantidad se mantienen. El inglés se normaliza de forma editorial sin añadir ingredientes. Alérgenos transcritos visualmente de la leyenda de página 1 y los iconos de página 2; pendientes de validación por el restaurante.

E6: gluten, sulfitos, huevo, pescado. Restricción doble asterisco: solo una vez en buffet, excluido en menú infantil.
E2: gluten, sésamo, huevo, lácteos, sulfitos.
E3: mostaza, gluten, huevo, soja.
E4: gluten, lácteos, huevo, soja.
E5: gluten, sulfitos, huevo.
E1: gluten, sésamo, huevo, moluscos, soja.

El PDF sigue siendo la referencia visual: el IDML contiene elementos fuera de página que no deben convertirse automáticamente en platos.

Pendientes del resto de la carta: SM109 y SM108 tienen traducciones inglesas copiadas de atún; SM109 contiene «angula, tipico». Confirmar receta. RS69/RS72 comparten nombre con ingredientes diferentes. CR128 tiene yakiniku/teriyaki en idiomas distintos. CR120 tiene título teriyaki y descripción sésamo. PS184 tiene «35 RR/UN.». No se han corregido los originales.

La exportación del PDF incluye textos de proveedor ocultos en página 22 y errores de codificación en página 1. El paquete tiene ocho nombres vinculados ausentes, aún pendientes de distinguir de los elementos fuera de página.

## Modalidades · 16/10/2026

- La muestra de comida usa 15 categorías: 3 platos por grupo, salvo sashimi y tartar (2 únicos platos visibles en cada categoría). Buffet excluye postres.
- `buffetStars` (0/1/2) y `twoPersons` son campos de cada plato. Solo se muestran en buffet. Las cantidades en unidades permanecen en carta; la condición de dos comensales se elimina.
- La modalidad bebidas contiene 65 referencias únicas de las páginas 25–28 del PDF, incluida la doble tarifa copa/chupito cuando consta. No se ha añadido precio de chupito a The Chita, ya que no consta.
- Mediodía: 2 primeros + 1 segundo, bebida y helado o café; 16,90 € o 17,90 € con segundo de sushi. De lunes a viernes excepto festivos. Se han seleccionado 3 platos reales por grupo del borrador de 8 páginas.
- No fusionar recetas por referencia entre documentos: E5 es pato en carta y verdura en mediodía; E4/E7/GY22 cambian cantidades; CR139 corresponde a recetas distintas. Se usan objetos independientes en `lunch.json`.
- La muestra de mediodía evita E5 y CR139, pendientes de confirmar. Los precios sueltos que aún aparecen en algunas páginas del borrador no se usan como suplementos.
- SM109 mantiene aviso de receta sin confirmar; SM108 tiene inglés corregido desde el español pero sigue marcado para revisión. Referencia 94 se conserva sin prefijo inventado. E10 se normaliza editorialmente y sigue pendiente de validación.
- `allergens: null` indica información aún no revisada; no equivale a ausencia de alérgenos. No se infieren alérgenos de ingredientes. Los iconos SVG de alérgenos siguen pendientes de recepción.
- Fotografías de categorías ampliadas: recortes del área fotográfica del PDF, renderizados a 3x. No se modifican los originales. Se podrán sustituir por Links al completar la revisión.


## V0.1.1 · 17/10/2026

- Mediodía completo: 21 primeros (páginas 2–5), 12 segundos (6–7), 6 combinaciones de sushi (8). 39 referencias únicas, con fotos extraídas de su propio PDF.
- Bebidas: se conservan las 65 referencias completas. Carta y buffet mantienen muestras por categoría.
- E5 se conserva como rollitos de verduras; E4 y E7 son 4 unidades, GY22 son 3, según mediodía. No se reutilizan recetas de carta para estas referencias. E6 no añade tartar ni trufa: la descripción del borrador solo indica rollitos de marisco. E6 y E21 conservan las 4 unidades para 2 personas.
- CR139 se mantiene en mediodía como Ebi Chili, con la descripción de verduras de temporada y chili de este documento. En carta CR139 corresponde a otro plato; quedan separados.
- CR128: inglés normalizado desde el español (yakiniku), ya que el original inglés menciona teriyaki. CM174: erratas del listado normalizadas; confirmar la composición antes de cerrar el diseño.
- Los precios individuales residuales de ES20, E28 y M155 en el borrador no se presentan como suplementos.
- Los alérgenos no revisados continúan con null y su aviso; no se presume que los platos carezcan de alérgenos. Iconos vectoriales aún pendientes.
- Regeneración de fotos y contenido: scripts/complete_lunch_v011.py (Pillow, pypdfium2).

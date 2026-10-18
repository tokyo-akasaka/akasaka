import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const json=async name=>JSON.parse(await readFile(new URL(`data/${name}.json`,root),'utf8'));
const [menu,categories,allergens,lunch,drinks]=await Promise.all(['menu','categories','allergens','lunch','drinks'].map(json));
test('la carta contiene todas las referencias visibles, conservando sus códigos originales',()=>{
 assert.equal(menu.length,136);assert.equal(new Set(menu.map(d=>d.reference)).size,136);
 assert.deepEqual(Object.fromEntries(categories.map(c=>[c.id,menu.filter(d=>d.category===c.id).length])),{entrantes:22,sopa:3,ramen:3,poke:3,arroz:6,nigiri:24,hosomaki:10,temaki:5,rollitos:18,carpaccio:5,sashimi:2,tartar:2,carnes:10,pescado:8,postres:15});
 for(const ref of ['SH044','94','HM77','UD146','PS184','PS195'])assert.ok(menu.some(d=>d.reference===ref),ref);
 assert.equal(menu.filter(d=>d.category!=='postres').length,121);
});
test('los textos, precios y alérgenos tienen datos válidos en ambos idiomas',()=>{
 for(const d of menu){
  assert.ok(categories.some(c=>c.id===d.category),d.reference);
  assert.ok(Number.isFinite(d.price)&&d.price>0,d.reference);
  for(const lang of ['es','en']){assert.ok(d.name[lang]?.trim(),d.reference);assert.ok(d.description[lang]?.trim(),d.reference);assert.equal(typeof d.portion[lang],'string');}
  assert.ok([0,1,2].includes(d.buffetStars));assert.equal(typeof d.twoPersons,'boolean');
  if(d.allergens!==null){assert.equal(new Set(d.allergens).size,d.allergens.length,d.reference);for(const id of d.allergens)assert.ok(allergens[id],`${d.reference}: ${id}`);}
 }
 // No convertir ausencia de iconos en una afirmación de ausencia de alérgenos.
 assert.equal(menu.find(d=>d.reference==='PS184').allergens,null);
 for(const ref of ['HM80','HM81'])assert.deepEqual(menu.find(d=>d.reference===ref).allergens,[]);
});
test('todas las fotos referenciadas existen dentro de assets y son WebP',async()=>{
 for(const d of [...menu,...lunch.dishes,...drinks.dishes]){
  if(!d.image){assert.ok(drinks.dishes.includes(d));continue;}
  assert.match(d.image,/^assets\/(dishes|lunch|drinks)\/[a-z0-9-]+\.webp$/);
  const bytes=await readFile(new URL(d.image,root));assert.equal(bytes.toString('ascii',0,4),'RIFF',d.reference);assert.equal(bytes.toString('ascii',8,12),'WEBP',d.reference);
  assert.ok((await stat(new URL(d.image,root))).size>500,d.reference);
 }
 assert.equal(drinks.dishes.filter(d=>d.image).length,17);
 for(const allergen of Object.values(allergens)){
  assert.match(allergen.icon,/^assets\/allergens\/[a-z]+\.svg$/);
  const svg=await readFile(new URL(allergen.icon,root),'utf8');assert.match(svg,/<path /);assert.doesNotMatch(svg,/<image|data:image/);
 }

});
test('mediodía y bebidas siguen completos y las recetas no se mezclan entre modalidades',()=>{
 assert.equal(lunch.dishes.length,40);assert.equal(drinks.dishes.length,65);
 for(const items of [lunch.dishes,drinks.dishes])assert.equal(new Set(items.map(d=>d.reference)).size,items.length);
 assert.match(menu.find(d=>d.reference==='E5').description.es,/pato/);
 assert.match(lunch.dishes.find(d=>d.reference==='E5').description.es,/verdura/);
 assert.match(menu.find(d=>d.reference==='CR139').description.es,/curry/);
 assert.match(lunch.dishes.find(d=>d.reference==='CR139').description.es,/chili/i);
 assert.equal(drinks.dishes.find(d=>d.reference==='252').shotPrice,undefined);
});

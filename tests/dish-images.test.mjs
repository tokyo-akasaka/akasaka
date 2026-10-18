import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sharedDishImages} from '../js/dish-images.js';
const menu=JSON.parse(await readFile(new URL('../data/menu.json',import.meta.url)));
const lunch=JSON.parse(await readFile(new URL('../data/lunch.json',import.meta.url)));
test('lunch follows later photo changes without changing its recipe or portions',()=>{
 const original=lunch.dishes.find(d=>d.reference==='E6');
 const changed=menu.map(d=>d.reference==='E6'?{...d,image:'assets/dishes/new-photo.webp',imageZoom:1.3}:d);
 const result=sharedDishImages(lunch.dishes,changed).find(d=>d.reference==='E6');
 assert.equal(result.image,'assets/dishes/new-photo.webp');assert.equal(result.imageZoom,1.3);
 assert.deepEqual(result.description,original.description);assert.deepEqual(result.portion,original.portion);
 assert.equal(original.image,lunch.dishes.find(d=>d.reference==='E6').image);
});
test('old framing is removed and dishes with different recipes remain separate',()=>{
 const result=sharedDishImages([{reference:'x',imageReference:'E6',imageZoom:9,imageOffsetX:99}],menu)[0];
 assert.equal(result.imageZoom,menu.find(d=>d.reference==='E6').imageZoom);
 assert.equal(result.imageOffsetX,undefined);
 assert.equal(lunch.dishes.find(d=>d.reference==='E5').imageReference,undefined);
 assert.equal(lunch.dishes.find(d=>d.reference==='CR139').imageReference,'CR138');
 for(const d of lunch.dishes.filter(d=>d.imageReference))assert.ok(menu.some(m=>m.reference===d.imageReference));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDishShareData,shareDish} from '../js/share.js';
const dish={reference:'E2',name:{es:'Sushi Quingo',en:'Sushi Quingo'}};
test('enlace conserva subcarpeta de Pages y referencia, con idioma y modalidad estables',()=>{
 const payload=buildDishShareData(dish,{href:'https://example.github.io/akasaka/menu.html?mode=carta#group-sopa',language:'en'});
 assert.equal(payload.url,'https://example.github.io/akasaka/menu.html?mode=carta&lang=en#dish-E2');assert.equal(payload.title,'Akasaka · Sushi Quingo');assert.match(payload.text,/Discover/);
});
test('compartir usa el menú nativo sin copiar ni abrir otros destinos',async()=>{
 let actual;const result=await shareDish({url:'https://example.com/#dish-E2'},{device:{share:async p=>{actual=p;},clipboard:{writeText:()=>assert.fail('no copiar')}}});assert.equal(result,'shared');assert.equal(actual.url,'https://example.com/#dish-E2');
});
test('cancelar el menú nativo no copia nada',async()=>{
 const result=await shareDish({}, {device:{share:async()=>{throw {name:'AbortError'};},clipboard:{writeText:()=>assert.fail('no copiar')}}});assert.equal(result,'cancelled');
});
test('sin soporte nativo copia enlace y, si falla, muestra enlace manual',async()=>{
 let copied,manual;assert.equal(await shareDish({url:'https://example.com/#dish-E2'},{device:{clipboard:{writeText:async url=>{copied=url;}}}}),'copied');assert.equal(copied,'https://example.com/#dish-E2');
 assert.equal(await shareDish({url:'https://example.com/#dish-E2'},{device:{clipboard:{writeText:async()=>{throw Error('blocked');}}},onManual:url=>{manual=url;}}),'manual');assert.equal(manual,'https://example.com/#dish-E2');
});

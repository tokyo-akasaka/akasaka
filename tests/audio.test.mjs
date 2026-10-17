import test from 'node:test';
import assert from 'node:assert/strict';
import {describeDish,spokenPrice,createReader} from '../js/audio.js';
const dish={reference:'E6',name:{es:'Rollitos',en:'Rolls'},description:{es:'Marisco.',en:'Seafood.'},portion:{es:'4 uds.',en:'4 pcs.'},price:5.8,buffetStars:1,twoPersons:true,allergens:['fish']};
const text={starOne:'Solo cenas y una vez.',notIncluded:'No infantil.',two:'Para dos personas.'};
test('carta lee precio y omite las restricciones del buffet',()=>{
 const result=describeDish(dish,{mode:'carta',text,allergens:{fish:{es:'Pescado'}}});
 assert.match(result,/5 euros con 80 céntimos/);assert.match(result,/4 unidades/);assert.match(result,/Pescado/);assert.doesNotMatch(result,/Solo cenas|No infantil|Para dos/);
});
test('buffet lee restricciones y nunca el precio',()=>{
 const result=describeDish(dish,{mode:'buffet',text});assert.match(result,/Solo cenas/);assert.match(result,/Para dos/);assert.doesNotMatch(result,/euros|Precio/);
});
test('mediodía no lee los precios residuales del PDF y bebidas incluye chupito',()=>{
 const lunch=describeDish(dish,{mode:'lunch'});assert.match(lunch,/Incluido en el menú/);assert.doesNotMatch(lunch,/Precio|euros/);
 const drink=describeDish({...dish,shotPrice:3},{mode:'drinks',language:'en'});assert.match(drink,/5 euros and 80 cents/);assert.match(drink,/Shot: 3 euros/);assert.doesNotMatch(drink,/Allergens/);
 assert.equal(spokenPrice(1.01,'es'),'1 euro con 1 céntimo');
});
function setup(){
 const utterances=[],events=[];let cancelled=0;
 const engine={getVoices:()=>[{lang:'es-ES',name:'Español'},{lang:'en-GB',name:'English'}],cancel:()=>cancelled++,speak:u=>utterances.push(u)};
 class Utterance{constructor(text){this.text=text;}}
 const reader=createReader({engine,Utterance,onState:s=>events.push(s),timer:()=>1,clearTimer:()=>{}});
 return {reader,utterances,events,cancels:()=>cancelled};
}
test('solo un plato, segunda pulsación detiene, callbacks antiguos no alteran el nuevo',()=>{
 const x=setup();x.reader.speak({id:'A',text:'uno',language:'es'});x.utterances[0].onstart();
 x.reader.speak({id:'B',text:'two',language:'en'});assert.equal(x.utterances[1].voice.lang,'en-GB');
 x.utterances[0].onend();assert.equal(x.events.at(-1).id,'B');
 x.utterances[1].onstart();assert.equal(x.events.at(-1).state,'speaking');
 x.reader.speak({id:'B',text:'two',language:'en'});assert.equal(x.utterances.length,2);assert.equal(x.events.at(-1).state,'idle');assert.equal(x.cancels(),3);
});
test('errores permiten reintentar; stop ignora eventos pendientes',()=>{
 const x=setup();x.reader.speak({id:'A',text:'uno',language:'es'});x.utterances[0].onerror({error:'voice-unavailable'});assert.equal(x.events.at(-1).state,'error');
 x.reader.speak({id:'A',text:'uno',language:'es'});x.reader.stop();x.utterances[1].onstart();assert.equal(x.events.at(-1).state,'idle');
});
test('ausencia de soporte genera un estado de error comprensible',()=>{
 let state;const reader=createReader({engine:null,Utterance:null,onState:s=>state=s});assert.equal(reader.supported,false);reader.speak({id:'A',text:'x',language:'es'});assert.equal(state.error,'unsupported');
});

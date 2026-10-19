import {sharedDishImages} from './dish-images.js';
import {buildDishShareData,shareDish} from './share.js';
import {createReader,describeDish} from './audio.js';
import {translations,initialLanguage,applyLanguage,trackHeader} from './language.js';
const requestedMode=new URLSearchParams(location.search).get('mode');
const mode=['buffet','carta','lunch','drinks'].includes(requestedMode)?requestedMode:'carta';
document.body.dataset.mode=mode;
let language=initialLanguage(), data,activeCategory;
const host=document.querySelector('#menu'),rail=document.querySelector('#category-rail'),topNav=document.querySelector('#categories'),dialog=document.querySelector('#conditions-dialog');
const t=()=>translations[language];
function node(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
const money=value=>new Intl.NumberFormat(language==='es'?'es-ES':'en-IE',{style:'currency',currency:'EUR'}).format(value);
// Un lector compartido evita colas y lecturas superpuestas.
let audioState={state:'idle',id:null}, audioNames=new Map();
const audioDock=node('aside','audio-dock');audioDock.hidden=true;audioDock.setAttribute('aria-label','Audio');
const audioStatus=node('span','audio-status');audioStatus.setAttribute('role','status');audioStatus.setAttribute('aria-live','polite');
const stopAudio=node('button','audio-stop');stopAudio.type='button';audioDock.append(audioStatus,stopAudio);document.body.append(audioDock);
function refreshAudio(){
 const busy=audioState.state==='loading'||audioState.state==='speaking';
 document.querySelectorAll('.listen-button').forEach(button=>{
  const active=busy&&button.dataset.reference===audioState.id;
  button.classList.toggle('is-speaking',active);
  const label=active?t().stopReading:(mode==='drinks'?t().listenDrink:t().listen);
  button.querySelector('.listen-label').textContent=label;
  button.setAttribute('aria-label',`${label}: ${audioNames.get(button.dataset.reference)||''}`);

 });
 audioDock.hidden=!busy&&audioState.state!=='error';
 if(busy)audioStatus.textContent=`${audioState.state==='loading'?t().audioLoading:t().audioSpeaking}: ${audioNames.get(audioState.id)||''}`;
 else if(audioState.state==='error')audioStatus.textContent=audioState.error==='unsupported'?t().audioUnsupported:t().audioError;
 else audioStatus.textContent='';
 stopAudio.textContent=busy?t().stopReading:t().close;
}
const reader=createReader({onState:state=>{audioState=state;refreshAudio();}});
stopAudio.addEventListener('click',()=>reader.stop());
window.addEventListener('pagehide',()=>reader.stop());
document.addEventListener('visibilitychange',()=>{if(document.hidden)reader.stop();});
let dialogScroll=0;
function openConditions(){reader.stop();if(!dialog.open){dialogScroll=window.scrollY;window.scrollTo({top:dialogScroll,behavior:'instant'});dialog.showModal();document.documentElement.classList.add('modal-open');}}
function closeConditions(){dialog.close();}
dialog.addEventListener('close',()=>{document.documentElement.classList.remove('modal-open');window.scrollTo({top:dialogScroll,behavior:'instant'});});
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeConditions();}});
document.querySelector('#conditions-open').addEventListener('click',openConditions);
document.querySelector('#conditions-close').addEventListener('click',closeConditions);
function rateCards(){const group=node('div','rate-cards');data.buffet.rates.forEach(rate=>{const card=node('div','rate-card');card.append(node('strong','rate-price',money(rate.price)),node('span','',t()[rate.id]),node('small','',t().perPerson));group.append(card);});return group;}
function renderConditions(){
 const content=document.querySelector('#conditions-content');content.replaceChildren(rateCards());
 const rules=node('ul','condition-rules');data.buffet.rules[language].forEach(rule=>rules.append(node('li','',rule)));content.append(rules);
 const legend=node('div','symbol-legend');
 for(const [stars,key] of [['✱','one'],['✱✱','two']]){const row=node('div','legend-row');row.append(node('span','buffet-stars',stars),node('p','',data.buffet.stars[key][language]));legend.append(row);}
 const row=node('div','legend-row'),image=node('img');image.src='assets/categories/people.svg';image.alt='';image.width=30;image.height=30;row.append(image,node('p','',t().two));legend.append(row);content.append(legend);
 const done=node('button','dialog-done',t().backToDishes);done.type='button';done.addEventListener('click',closeConditions);content.append(done);
}
function renderSummary(){
 const summary=document.querySelector('#mode-summary');summary.replaceChildren();summary.hidden=!(mode==='buffet'||mode==='lunch');
 if(mode==='buffet'){summary.append(rateCards(),node('p','summary-copy',t().buffetShort));const detail=node('button','text-button',t().conditions);detail.type='button';detail.addEventListener('click',openConditions);const drinks=node('a','text-button',t().buffetDrinks);drinks.href='menu.html?mode=drinks';const actions=node('div','summary-actions');actions.append(detail,drinks);summary.append(actions);}
 if(mode==='lunch'){
  summary.append(node('p','eyebrow',data.lunch.availability[language]),node('p','lunch-choice',data.lunch.choice[language]));
  const group=node('div','rate-cards lunch-rates');for(const [key,label] of [['standard','lunchStandard'],['sushi','lunchSushi']]){const rate=node('div','rate-card');rate.append(node('strong','rate-price',money(data.lunch.prices[key])),node('span','',t()[label]));group.append(rate);}summary.append(group);
 }
}
function cardFor(dish,index){
 const card=node('article',`dish-card${mode==='drinks'?' drink-card':''}`);card.id=`dish-${dish.reference}`;card.dataset.category=dish.category;if(dish.imageFit)card.dataset.imageFit=dish.imageFit;card.setAttribute('aria-labelledby',`dish-title-${dish.reference}`);
 if(dish.image){const media=node('div','dish-media'),image=node('img');if(dish.imageAspect)media.style.setProperty('--photo-aspect',dish.imageAspect);image.src=dish.image;if(dish.imagePosition)image.style.objectPosition=dish.imagePosition;if(dish.imageFilter)image.style.filter=dish.imageFilter;if(dish.imageZoom||dish.imageOffsetX||dish.imageOffsetY)image.style.transform=`translate(${dish.imageOffsetX||0}px, ${dish.imageOffsetY||0}px) scale(${dish.imageZoom||1})`;image.alt=dish.name[language];image.width=900;image.height=675;image.loading=index===0?'eager':'lazy';image.decoding='async';media.append(image);card.append(media);}
 const body=node('div','dish-body'),meta=node('div','dish-meta');if(dish.showReference!==false)meta.append(node('span','reference',`${t().reference} ${dish.reference}`));
 if(dish.portion?.[language])meta.append(node('span','portion',dish.portion[language]));
 if(mode==='buffet'){
  if(dish.buffetStars){const stars=node('button','buffet-stars',dish.buffetStars===1?'✱':'✱✱');stars.type='button';stars.setAttribute('aria-label',`${dish.buffetStars===1?t().starOne:t().starTwo} ${t().notIncluded}`);stars.title=stars.getAttribute('aria-label');stars.addEventListener('click',openConditions);meta.append(stars);}
  if(dish.twoPersons){const badge=node('span','two-person-badge');badge.title=t().two;const image=node('img');image.src='assets/categories/people.svg';image.alt=t().two;image.width=26;image.height=26;badge.append(image);meta.append(badge);}
 }
 const heading=node('div','dish-heading'),name=node('h3','',dish.name[language]);name.id=`dish-title-${dish.reference}`;heading.append(name);
 if(mode==='carta'||mode==='drinks')heading.append(node('span','price',money(dish.price)));
 body.append(meta,heading);
 if(dish.description?.[language])body.append(node('p','description',dish.description[language]));
 if(mode==='drinks'&&dish.shotPrice!==undefined){body.append(node('p','serving-prices',`${t().glass}: ${money(dish.price)} · ${t().shot}: ${money(dish.shotPrice)}`));}
 if(dish.reviewPending)body.append(node('p','review-note',t().reviewPending));
 if(mode!=='drinks'){
  const allergies=node('div','allergens');allergies.id=`allergens-${dish.reference}`;allergies.hidden=true;allergies.setAttribute('role','region');allergies.setAttribute('aria-label',`${t().allergens}: ${dish.name[language]}`);
  if(dish.allergens===null||dish.allergens===undefined){allergies.append(node('p','allergen-pending',t().allergensPending));}
  else if(dish.allergens.length){allergies.setAttribute('aria-label',t().allergens);const list=node('ul','allergen-list');dish.allergens.forEach(id=>{
   const allergen=data.allergens[id],label=allergen[language],item=node('li');item.title=label;
   const icon=node('img');icon.src=allergen.icon;icon.alt='';icon.width=36;icon.height=36;
   item.append(icon,node('span','allergen-name',label));list.append(item);
  });allergies.append(list);}
  if(!allergies.childNodes.length)allergies.append(node('p','allergen-none',t().noAllergens));
  body.append(allergies);
 }
 if(mode==='carta'){
  const actions=node('div','dish-actions'),button=node('button','share-button');button.type='button';button.setAttribute('aria-label',`${t().shareDish}: ${dish.name[language]}`);
  const icon=node('span','share-icon');icon.setAttribute('aria-hidden','true');button.append(icon,node('span','sr-only',t().share));
  const status=node('span','share-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  button.addEventListener('click',async()=>{
   if(button.disabled)return;reader.stop();button.disabled=true;status.textContent='';
   try{const result=await shareDish(buildDishShareData(dish,{href:location.href,language}),{onManual:showShareLink});if(result==='copied')status.textContent=t().shareCopied;}
   finally{button.disabled=false;}
  });actions.append(status,button);(card.querySelector('.dish-media')||body).append(actions);
 }
 const listen=node('button','listen-button');listen.type='button';listen.dataset.reference=dish.reference;
 const icon=node('span','listen-icon');icon.setAttribute('aria-hidden','true');listen.append(icon,node('span','listen-label sr-only',mode==='drinks'?t().listenDrink:t().listen));
 listen.setAttribute('aria-label',`${mode==='drinks'?t().listenDrink:t().listen}: ${dish.name[language]}`);
 audioNames.set(dish.reference,dish.name[language]);
 if(!reader.supported){listen.disabled=true;listen.title=t().audioUnsupported;body.append(node('p','audio-unavailable',t().audioUnsupported));}
 listen.addEventListener('click',()=>reader.speak({id:dish.reference,text:describeDish(dish,{language,mode,allergens:data.allergens,text:t()}),language}));
 const tools=node('div','dish-tools');
 if(mode!=='drinks'){
  const allergyButton=node('button','allergen-button');allergyButton.type='button';allergyButton.title=t().allergens;allergyButton.setAttribute('aria-label',`${t().allergens}: ${dish.name[language]}`);allergyButton.setAttribute('aria-expanded','false');allergyButton.setAttribute('aria-controls',`allergens-${dish.reference}`);
  const allergyIcon=node('span','allergen-icon');allergyIcon.setAttribute('aria-hidden','true');allergyButton.append(allergyIcon);
  allergyButton.addEventListener('click',()=>{const panel=body.querySelector('.allergens');panel.hidden=!panel.hidden;allergyButton.setAttribute('aria-expanded',String(!panel.hidden));});
  tools.append(allergyButton);
 }
 tools.append(listen);
 const shareActions=card.querySelector('.dish-actions')||body.querySelector('.dish-actions');if(shareActions)tools.append(shareActions);
 const media=card.querySelector('.dish-media');
 if(media){
  const visual=node('div','dish-visual');visual.append(media,tools);
  if(dish.isNew){const badge=node('img','new-badge');badge.src='assets/brand/new.webp';badge.alt=t().newDish;badge.width=54;badge.height=36;visual.append(badge);}
  card.prepend(visual);
 }
 else{card.classList.add('text-only-card');body.prepend(tools);}
 card.append(body);return card;
}
function render(){
 const savedScroll=window.scrollY;reader.stop();audioNames.clear();applyLanguage(language);refreshAudio();
 const title=mode==='buffet'?'ALL YOU CAN EAT':t()[{carta:'cartaTitle',lunch:'lunchTitle',drinks:'drinksTitle'}[mode]];
 document.querySelector('#mode-title').textContent=title;document.title=`Akasaka · ${title}`;
 document.querySelector('#conditions-open').hidden=mode!=='buffet';
 renderSummary();renderConditions();
 const categories=mode==='drinks'?data.drinks.categories:mode==='lunch'?data.lunch.categories:data.categories.filter(c=>mode!=='buffet'||c.id!=='postres');
 const dishes=mode==='drinks'?data.drinks.dishes:mode==='lunch'?sharedDishImages(data.lunch.dishes,data.menu):data.menu;
 topNav.replaceChildren();rail.replaceChildren();host.replaceChildren();
 categories.forEach(category=>{
  const items=dishes.filter(d=>d.category===category.id);if(!items.length)return;
  for(const [parent,cls] of [[topNav,'category-link'],[rail,'rail-tab']]){
   const link=node('a',cls);link.href=`#group-${category.id}`;link.dataset.group=category.id;link.setAttribute('aria-label',category.name[language]);link.title=category.name[language];
   if(cls==='rail-tab'){const icon=node('img');icon.src=`assets/categories/${category.icon}.svg`;icon.alt='';icon.width=25;icon.height=25;link.append(icon,node('span','rail-label',category.name[language]));}else link.textContent=category.name[language];parent.append(link);
  }
  const section=node('section','food-group');section.id=`group-${category.id}`;section.dataset.group=category.id;section.setAttribute('aria-labelledby',`title-${category.id}`);
  const heading=node('div','section-heading'),h=node('h2','',category.name[language]);h.id=`title-${category.id}`;heading.append(h);
  const grid=node('div','menu-grid');items.forEach((dish,index)=>grid.append(cardFor(dish,index)));section.append(heading,grid);host.append(section);
 });
 if(mode==='carta'||mode==='drinks')host.append(node('p','tax-note',t().tax));host.setAttribute('aria-busy','false');
 window.scrollTo({top:savedScroll,behavior:'instant'});updateActive();
}
function updateActive(){
 const groups=[...document.querySelectorAll('.food-group')];if(!groups.length)return;
 const offset=document.querySelector('.masthead').getBoundingClientRect().height+(innerWidth<600?30:90);
 let active=groups[0].dataset.group;for(const group of groups)if(group.getBoundingClientRect().top<=offset)active=group.dataset.group;
 const changed=activeCategory!==active;activeCategory=active;
 document.querySelectorAll('.rail-tab,.category-link').forEach(link=>{if(link.dataset.group===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 if(changed){const tab=rail.querySelector('[aria-current]');if(tab&&(tab.offsetTop<rail.scrollTop||tab.offsetTop+tab.offsetHeight>rail.scrollTop+rail.clientHeight))rail.scrollTo({top:Math.max(0,tab.offsetTop-rail.clientHeight/2),behavior:'smooth'});}
}
let queued=false;window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{updateActive();queued=false;});}},{passive:true});window.addEventListener('resize',updateActive);
applyLanguage(language);trackHeader();
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.language;if(data)render();else applyLanguage(language);document.querySelector('#language-status').textContent=t().changed;}));
try{
 const names=['menu','categories','allergens','drinks','lunch','buffet'];const values=await Promise.all(names.map(async name=>{const response=await fetch(`data/${name}.json`,{cache:'no-store'});if(!response.ok)throw new Error(name);return response.json();}));data=Object.fromEntries(names.map((name,index)=>[name,values[index]]));render();
 requestAnimationFrame(()=>requestAnimationFrame(()=>followAnchor()));
}catch(error){host.replaceChildren(node('p','load-error',t().error));host.setAttribute('aria-busy','false');console.error('Menu load failed',error);}

// Las tarjetas se generan después del fetch: resolvemos el ancla al terminar.
let highlightTimer;
function followAnchor(behavior='instant'){
 let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
 if(!id.startsWith('dish-')&&!id.startsWith('group-'))return;
 const target=document.getElementById(id);if(!target)return;
 target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':behavior,block:'start'});
 if(id.startsWith('dish-')){
  document.querySelectorAll('.shared-dish').forEach(card=>card.classList.remove('shared-dish'));
  target.classList.add('shared-dish');clearTimeout(highlightTimer);highlightTimer=setTimeout(()=>target.classList.remove('shared-dish'),3500);
 }
 updateActive();
}
window.addEventListener('hashchange',()=>{if(data)followAnchor('smooth');});
function showShareLink(url){
 let shareDialog=document.querySelector('#share-dialog');
 if(!shareDialog){shareDialog=node('dialog');shareDialog.id='share-dialog';document.body.append(shareDialog);}
 shareDialog.replaceChildren();shareDialog.setAttribute('aria-labelledby','share-dialog-title');
 const header=node('div','dialog-header'),heading=node('h2','',t().shareDish);heading.id='share-dialog-title';const close=node('button','',t().close);close.type='button';close.addEventListener('click',()=>shareDialog.close());header.append(heading,close);
 const body=node('div','share-link-body'),label=node('label','',t().shareHint);label.htmlFor='share-link-input';const input=node('input','share-link-input');input.id='share-link-input';input.type='url';input.readOnly=true;input.value=url;input.addEventListener('focus',()=>input.select());body.append(label,input);shareDialog.append(header,body);shareDialog.showModal();input.focus();input.select();
}

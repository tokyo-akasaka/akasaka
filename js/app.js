import {translations,initialLanguage,applyLanguage,trackHeader} from './language.js';
const requestedMode=new URLSearchParams(location.search).get('mode');
const mode=['buffet','carta','lunch','drinks'].includes(requestedMode)?requestedMode:'carta';
document.body.dataset.mode=mode;
let language=initialLanguage(), data,activeCategory;
const host=document.querySelector('#menu'),rail=document.querySelector('#category-rail'),topNav=document.querySelector('#categories'),dialog=document.querySelector('#conditions-dialog');
const t=()=>translations[language];
function node(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
const money=value=>new Intl.NumberFormat(language==='es'?'es-ES':'en-IE',{style:'currency',currency:'EUR'}).format(value);
let dialogScroll=0;
function openConditions(){if(!dialog.open){dialogScroll=window.scrollY;window.scrollTo({top:dialogScroll,behavior:'instant'});dialog.showModal();document.documentElement.classList.add('modal-open');}}
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
 const card=node('article',`dish-card${mode==='drinks'?' drink-card':''}`);card.setAttribute('aria-labelledby',`dish-${dish.reference}`);
 if(dish.image){const media=node('div','dish-media'),image=node('img');image.src=dish.image;image.alt=dish.name[language];image.width=900;image.height=675;image.loading=index===0?'eager':'lazy';image.decoding='async';media.append(image);card.append(media);}
 const body=node('div','dish-body'),meta=node('div','dish-meta');meta.append(node('span','reference',`${t().reference} ${dish.reference}`));
 if(dish.portion?.[language])meta.append(node('span','portion',dish.portion[language]));
 if(mode==='buffet'){
  if(dish.buffetStars){const stars=node('button','buffet-stars',dish.buffetStars===1?'✱':'✱✱');stars.type='button';stars.setAttribute('aria-label',`${dish.buffetStars===1?t().starOne:t().starTwo} ${t().notIncluded}`);stars.title=stars.getAttribute('aria-label');stars.addEventListener('click',openConditions);meta.append(stars);}
  if(dish.twoPersons){const badge=node('span','two-person-badge');badge.title=t().two;const image=node('img');image.src='assets/categories/people.svg';image.alt=t().two;image.width=26;image.height=26;badge.append(image);meta.append(badge);}
 }
 const heading=node('div','dish-heading'),name=node('h3','',dish.name[language]);name.id=`dish-${dish.reference}`;heading.append(name);
 if(mode==='carta'||mode==='drinks')heading.append(node('span','price',money(dish.price)));
 body.append(meta,heading);
 if(dish.description?.[language])body.append(node('p','description',dish.description[language]));
 if(mode==='drinks'&&dish.shotPrice!==undefined){body.append(node('p','serving-prices',`${t().glass}: ${money(dish.price)} · ${t().shot}: ${money(dish.shotPrice)}`));}
 if(dish.reviewPending)body.append(node('p','review-note',t().reviewPending));
 if(mode!=='drinks'){
  const allergies=node('div','allergens');
  if(dish.allergens===null||dish.allergens===undefined){allergies.append(node('p','allergen-pending',t().allergensPending));}
  else if(dish.allergens.length){allergies.append(node('span','allergen-label',t().allergens));const list=node('ul','allergen-list');dish.allergens.forEach(id=>list.append(node('li','',data.allergens[id][language])));allergies.append(list);}
  if(allergies.childNodes.length)body.append(allergies);
 }
 card.append(body);return card;
}
function render(){
 const savedScroll=window.scrollY;applyLanguage(language);
 const title=mode==='buffet'?'ALL YOU CAN EAT':t()[{carta:'cartaTitle',lunch:'lunchTitle',drinks:'drinksTitle'}[mode]];
 document.querySelector('#mode-title').textContent=title;document.title=`Akasaka · ${title}`;
 document.querySelector('#conditions-open').hidden=mode!=='buffet';
 renderSummary();renderConditions();
 const categories=mode==='drinks'?data.drinks.categories:mode==='lunch'?data.lunch.categories:data.categories.filter(c=>mode!=='buffet'||c.id!=='postres');
 const dishes=mode==='drinks'?data.drinks.dishes:mode==='lunch'?data.lunch.dishes:data.menu;
 topNav.replaceChildren();rail.replaceChildren();host.replaceChildren();
 categories.forEach(category=>{
  const items=dishes.filter(d=>d.category===category.id);if(!items.length)return;
  for(const [parent,cls] of [[topNav,'category-link'],[rail,'rail-tab']]){
   const link=node('a',cls);link.href=`#group-${category.id}`;link.dataset.group=category.id;link.setAttribute('aria-label',category.name[language]);link.title=category.name[language];
   if(cls==='rail-tab'){const icon=node('img');icon.src=`assets/categories/${category.icon}.svg`;icon.alt='';icon.width=25;icon.height=25;link.append(icon,node('span','rail-label',category.name[language]));}else link.textContent=category.name[language];parent.append(link);
  }
  const section=node('section','food-group');section.id=`group-${category.id}`;section.dataset.group=category.id;section.setAttribute('aria-labelledby',`title-${category.id}`);
  const heading=node('div','section-heading'),h=node('h2','',category.name[language]);h.id=`title-${category.id}`;heading.append(h,node('span','dish-count',`${items.length} ${mode==='drinks'?t().drinkItems:t().dishes}`));
  const grid=node('div','menu-grid');items.forEach((dish,index)=>grid.append(cardFor(dish,index)));section.append(heading,grid);host.append(section);
 });
 if(mode==='carta'||mode==='drinks')host.append(node('p','tax-note',t().tax));host.setAttribute('aria-busy','false');
 document.querySelector('#sample-message').textContent=mode==='drinks'?t().drinksSample:mode==='lunch'?t().lunchSample:t().sampleBody;
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
 const names=['menu','categories','allergens','drinks','lunch','buffet'];const values=await Promise.all(names.map(async name=>{const response=await fetch(`data/${name}.json`);if(!response.ok)throw new Error(name);return response.json();}));data=Object.fromEntries(names.map((name,index)=>[name,values[index]]));render();
 if(location.hash.startsWith('#group-'))requestAnimationFrame(()=>document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
}catch(error){host.replaceChildren(node('p','load-error',t().error));host.setAttribute('aria-busy','false');console.error('Menu load failed',error);}

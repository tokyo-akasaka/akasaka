// Enlaces basados en referencias estables; funcionan bajo la ruta de GitHub Pages.
export function buildDishShareData(dish,{href,language='es'}){
 const url=new URL(href);url.search='';url.searchParams.set('mode','carta');url.searchParams.set('lang',language);url.hash=`dish-${dish.reference}`;
 return {title:`Akasaka · ${dish.name[language]}`,text:language==='en'?`Discover ${dish.name.en} at Akasaka.`:`Descubre ${dish.name.es} en Akasaka.`,url:url.href};
}
export async function shareDish(payload,{device=globalThis.navigator,onManual=()=>{}}={}){
 if(typeof device?.share==='function'){
  try{await device.share(payload);return 'shared';}
  catch(error){if(error?.name==='AbortError')return 'cancelled';}
 }
 if(typeof device?.clipboard?.writeText==='function'){
  try{await device.clipboard.writeText(payload.url);return 'copied';}catch{}
 }
 onManual(payload.url);return 'manual';
}

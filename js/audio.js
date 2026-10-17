// Lectura opcional: no solicita micrófono ni inicia sonido automáticamente.
export function spokenPrice(value, language='es') {
  const cents=Math.round(Number(value)*100);
  const euros=Math.floor(cents/100), remainder=cents%100;
  if(language==='en')return `${euros} ${euros===1?'euro':'euros'}${remainder?` and ${remainder} ${remainder===1?'cent':'cents'}`:''}`;
  return `${euros} ${euros===1?'euro':'euros'}${remainder?` con ${remainder} ${remainder===1?'céntimo':'céntimos'}`:''}`;
}
export function describeDish(dish,{language='es',mode='carta',allergens={},text={}}={}) {
  const en=language==='en';
  const name=dish.speechName?.[language]||dish.name[language];
  const description=dish.speechDescription?.[language]||dish.description?.[language];
  const lines=[`${en?'Reference':'Referencia'} ${dish.reference}.`,name,description];
  const portion=dish.portion?.[language];
  if(portion)lines.push(portion.replace(/\buds\./g,'unidades').replace(/\bpcs\./g,'pieces'));
  if(mode==='carta'||mode==='drinks'){
    if(Number.isFinite(dish.price))lines.push(`${en?'Price':'Precio'}: ${spokenPrice(dish.price,language)}.`);
    if(mode==='drinks'&&Number.isFinite(dish.shotPrice))lines.push(`${en?'Shot':'Chupito'}: ${spokenPrice(dish.shotPrice,language)}.`);
  }
  if(mode==='buffet'){
    if(dish.buffetStars)lines.push(dish.buffetStars===1?text.starOne:text.starTwo,text.notIncluded);
    if(dish.twoPersons)lines.push(text.two);
  }
  if(mode==='lunch')lines.push(en?'Included in the lunch menu.':'Incluido en el menú mediodía.');
  if(dish.reviewPending)lines.push(text.reviewPending);
  if(mode!=='drinks'){
    if(dish.allergens?.length)lines.push(`${en?'Allergens':'Alérgenos'}: ${dish.allergens.map(id=>allergens[id]?.[language]).filter(Boolean).join(', ')}.`);
    else if(dish.allergens==null)lines.push(text.allergensPending);
  }
  return lines.filter(Boolean).join('. ').replace(/\.+/g,'.').replace(/\.\s*\./g,'.').replace(/\s+/g,' ').trim();
}
export function createReader({engine=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,onState=()=>{},timer=globalThis.setTimeout,clearTimer=globalThis.clearTimeout}={}){
  let current=null,sequence=0,startTimer;
  const supported=Boolean(engine&&Utterance);
  const notify=(state,id=null,error=null)=>onState({state,id,error});
  function stop(){
    sequence++;clearTimer(startTimer);current=null;
    if(supported)engine.cancel();
    notify('idle');
  }
  function speak({id,text,language}){
    if(!supported){notify('error',id,'unsupported');return;}
    if(current?.id===id){stop();return;}
    stop();const token=sequence;
    const utterance=new Utterance(text);utterance.lang=language==='en'?'en-GB':'es-ES';utterance.rate=.95;
    const voices=engine.getVoices();
    const voice=voices.find(v=>v.lang.toLowerCase()===utterance.lang.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(language));
    if(voice)utterance.voice=voice;
    current={id,utterance};notify('loading',id);
    utterance.onstart=()=>{if(token!==sequence)return;clearTimer(startTimer);notify('speaking',id);};
    utterance.onend=()=>{if(token!==sequence)return;clearTimer(startTimer);current=null;notify('idle');};
    utterance.onerror=event=>{if(token!==sequence)return;clearTimer(startTimer);current=null;notify('error',id,event.error||'unknown');};
    startTimer=timer(()=>{if(token!==sequence)return;stop();notify('error',id,'start-timeout');},15000);
    try{engine.speak(utterance);}catch{clearTimer(startTimer);current=null;notify('error',id,'unavailable');}
  }
  // Las voces pueden cargarse después de abrir la página: se consultan en cada pulsación.
  return {supported,speak,stop};
}

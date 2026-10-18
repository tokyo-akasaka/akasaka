// Share photographs and framing only; each menu keeps its own recipe and portions.
export const imageFields=['image','imagePosition','imageFilter','imageZoom','imageOffsetX','imageOffsetY','imageFit','imageAspect'];
export function sharedDishImages(dishes,catalogue){
 const images=new Map(catalogue.map(dish=>[dish.reference,dish]));
 return dishes.map(dish=>{
  if(!dish.imageReference)return dish;
  const source=images.get(dish.imageReference);if(!source)return dish;
  const result={...dish};
  for(const field of imageFields){delete result[field];if(source[field]!==undefined)result[field]=source[field];}
  return result;
 });
}

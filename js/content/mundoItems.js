/* Catálogo de la tienda del "Mundo de Carboncito" (juego 3D).
   Las monedas se ganan estudiando (ver showResult en rewards.js).
   kind 'skin': color del pelaje de Carboncito (uno a la vez, 'skin_negro' es gratis).
   kind 'acc': accesorio (uno a la vez, tocar el equipado lo quita). */
export const MUNDO_ITEMS = [
  { id:'skin_negro',  kind:'skin', label:'Negro',   price:0,  body:0x1a1a1f, snout:0x6a5a55, ear:0x0d0d10, css:'#1a1a1f' },
  { id:'skin_cafe',   kind:'skin', label:'Café',    price:20, body:0xb5834a, snout:0x7a5530, ear:0x8a5f33, css:'#b5834a' },
  { id:'skin_blanco', kind:'skin', label:'Blanco',  price:30, body:0xf3efe6, snout:0xc9bba6, ear:0xd9cdbd, css:'#f3efe6' },
  { id:'skin_rosado', kind:'skin', label:'Rosado',  price:40, body:0xf5a3c0, snout:0xc4708f, ear:0xe0809f, css:'#f5a3c0' },
  { id:'skin_azul',   kind:'skin', label:'Azul',    price:40, body:0x5aa7f0, snout:0x2f6fb0, ear:0x3d86d0, css:'#5aa7f0' },
  { id:'skin_dorado', kind:'skin', label:'Dorado',  price:80, body:0xf2c230, snout:0xb88a10, ear:0xd9a820, css:'#f2c230' },

  { id:'acc_corbata', kind:'acc', label:'Moño',   price:20, icon:'🎀' },
  { id:'acc_lentes',  kind:'acc', label:'Lentes', price:25, icon:'🕶️' },
  { id:'acc_gorro',   kind:'acc', label:'Gorro',  price:25, icon:'🎩' },
  { id:'acc_capa',    kind:'acc', label:'Capa',   price:50, icon:'🦸' },
  { id:'acc_corona',  kind:'acc', label:'Corona', price:60, icon:'👑' },
];

export function itemById(id){
  return MUNDO_ITEMS.filter(function(i){ return i.id===id; })[0] || null;
}

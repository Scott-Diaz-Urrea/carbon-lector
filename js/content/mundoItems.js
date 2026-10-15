/* Catálogo del "Mundo de Carboncito" (juego 3D).
   El personaje principal es una PERSONA (avatar de bloques); Carboncito es el guía.
   Las monedas se ganan estudiando (ver showResult en rewards.js).
   kind 'shirt': color de la polera (una a la vez, 'shirt_azul' es gratis).
   kind 'acc': accesorio (uno a la vez, tocar el equipado lo quita).
   Lo gratuito (tono de piel, peinado, color de pelo) vive en el creador de avatar. */
export const MUNDO_ITEMS = [
  { id:'shirt_azul',     kind:'shirt', label:'Azul',     price:0,  hex:0x3b82f6, css:'#3b82f6' },
  { id:'shirt_rojo',     kind:'shirt', label:'Rojo',     price:20, hex:0xe0334c, css:'#e0334c' },
  { id:'shirt_verde',    kind:'shirt', label:'Verde',    price:20, hex:0x2fb344, css:'#2fb344' },
  { id:'shirt_amarillo', kind:'shirt', label:'Amarillo', price:30, hex:0xf7c948, css:'#f7c948' },
  { id:'shirt_rosado',   kind:'shirt', label:'Rosado',   price:30, hex:0xf783ac, css:'#f783ac' },
  { id:'shirt_morado',   kind:'shirt', label:'Morado',   price:40, hex:0x9b59d0, css:'#9b59d0' },
  { id:'shirt_dorado',   kind:'shirt', label:'Dorado',   price:80, hex:0xe8b923, css:'#e8b923' },

  { id:'acc_corbata', kind:'acc', label:'Moño',   price:20, icon:'🎀' },
  { id:'acc_lentes',  kind:'acc', label:'Lentes', price:25, icon:'🕶️' },
  { id:'acc_gorro',   kind:'acc', label:'Gorro',  price:25, icon:'🎩' },
  { id:'acc_capa',    kind:'acc', label:'Capa',   price:50, icon:'🦸' },
  { id:'acc_corona',  kind:'acc', label:'Corona', price:60, icon:'👑' },
];

export function itemById(id){
  return MUNDO_ITEMS.filter(function(i){ return i.id===id; })[0] || null;
}

/* Creador de avatar (gratis). */
export const AVATAR_TONES = [0xffdbb4, 0xe8b98a, 0xc68642, 0x8d5524, 0x5c3a21];
export const AVATAR_HAIRS = [
  { id:'corto', label:'Corto' }, { id:'largo', label:'Largo' },
  { id:'coleta', label:'Coleta' }, { id:'rulos', label:'Rulos' },
];
export const AVATAR_HAIR_COLORS = [0x1b1b1b, 0x6b4423, 0xe6c35c, 0xb7410e, 0x3b82f6, 0xf783ac];

export function hexCss(n){ return '#' + ('000000' + n.toString(16)).slice(-6); }

/* Catálogo de construcción de "Mi Casa". Los bloques/muebles marcados free
   vienen desbloqueados; el resto se compra una vez (después, uso ilimitado). */
export const HOUSE_ITEMS = [
  { id:'b_madera',   kind:'block', label:'Madera',   price:0,  color:0xc99a5b },
  { id:'b_blanco',   kind:'block', label:'Blanco',   price:0,  color:0xf5f5f5 },
  { id:'b_rojo',     kind:'block', label:'Rojo',     price:0,  color:0xe0334c },
  { id:'b_azul',     kind:'block', label:'Azul',     price:0,  color:0x3b82f6 },
  { id:'b_verde',    kind:'block', label:'Verde',    price:5,  color:0x2fb344 },
  { id:'b_amarillo', kind:'block', label:'Amarillo', price:5,  color:0xf7c948 },
  { id:'b_ladrillo', kind:'block', label:'Ladrillo', price:10, color:0xb5523b },
  { id:'b_piedra',   kind:'block', label:'Piedra',   price:10, color:0x9aa0a6 },
  { id:'b_vidrio',   kind:'block', label:'Vidrio',   price:15, color:0xa9dcf5, opacity:0.45 },
  { id:'b_dorado',   kind:'block', label:'Dorado',   price:30, color:0xe8b923 },

  { id:'f_silla',    kind:'furn', label:'Silla',    price:10, icon:'💺' },
  { id:'f_mesa',     kind:'furn', label:'Mesa',     price:15, icon:'🍽️' },
  { id:'f_cama',     kind:'furn', label:'Cama',     price:20, icon:'🛏️' },
  { id:'f_sofa',     kind:'furn', label:'Sillón',   price:25, icon:'🛋️' },
  { id:'f_planta',   kind:'furn', label:'Planta',   price:10, icon:'🌱' },
  { id:'f_lampara',  kind:'furn', label:'Lámpara',  price:15, icon:'💡' },
  { id:'f_alfombra', kind:'furn', label:'Alfombra', price:10, icon:'▦' },
  { id:'f_arbol',    kind:'furn', label:'Árbol',    price:12, icon:'🌳' },
];
export function houseItemById(id){
  return HOUSE_ITEMS.filter(function(i){ return i.id===id; })[0] || null;
}
export const HOUSE_FREE = HOUSE_ITEMS.filter(function(i){ return i.price===0; }).map(function(i){ return i.id; });
export const HOUSE_LIMIT = 10;      // la casa va de -10 a 10 en x y z
export const HOUSE_MAX_ITEMS = 800;

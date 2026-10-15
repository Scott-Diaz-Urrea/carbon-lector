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

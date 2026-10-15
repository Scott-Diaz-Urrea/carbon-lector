/* Catálogo del "Mundo de Carboncito" (juego 3D).
   El personaje principal es una PERSONA (avatar de bloques); Carboncito es el guía.
   Las monedas se ganan estudiando (ver showResult en rewards.js).
   Cada ítem va en un SLOT (una sola cosa equipada por slot, igual que el editor de
   avatar de Roblox): hat, face, back, neck, shirt, pants, shoes.
   - Los slots shirt/pants/shoes siempre tienen algo puesto; los demás se pueden dejar vacíos.
   - Tocar un ítem: si no es tuyo se compra (monedas), si es tuyo se equipa o se quita.
   - price 0 = viene gratis. */
export const AVATAR_SLOTS = [
  { id:'hat',   label:'Cabeza',   icon:'🎩', optional:true },
  { id:'face',  label:'Cara',     icon:'🕶️', optional:true },
  { id:'back',  label:'Espalda',  icon:'🎒', optional:true },
  { id:'neck',  label:'Cuello',   icon:'🎀', optional:true },
  { id:'shirt', label:'Polera',   icon:'👕', optional:false },
  { id:'pants', label:'Pantalón', icon:'👖', optional:false },
  { id:'shoes', label:'Zapatos',  icon:'👟', optional:false },
  { id:'pet',   label:'Mascota',  icon:'🐾', optional:true },
];
export const SLOT_DEFAULTS = { hat:null, face:null, back:null, neck:null, shirt:'shirt_azul', pants:'pants_azul', shoes:'shoes_negro', pet:null };

export const MUNDO_ITEMS = [
  // Poleras
  { id:'shirt_azul',     slot:'shirt', label:'Azul',      price:0,  hex:0x3b82f6 },
  { id:'shirt_rojo',     slot:'shirt', label:'Roja',      price:20, hex:0xe0334c },
  { id:'shirt_verde',    slot:'shirt', label:'Verde',     price:20, hex:0x2fb344 },
  { id:'shirt_negra',    slot:'shirt', label:'Negra',     price:20, hex:0x2a2a2f },
  { id:'shirt_blanca',   slot:'shirt', label:'Blanca',    price:20, hex:0xf5f5f5 },
  { id:'shirt_amarillo', slot:'shirt', label:'Amarilla',  price:30, hex:0xf7c948 },
  { id:'shirt_rosado',   slot:'shirt', label:'Rosada',    price:30, hex:0xf783ac },
  { id:'shirt_rayas',    slot:'shirt', label:'Rayas',     price:35, hex:0xe0334c, pattern:'rayas' },
  { id:'shirt_morado',   slot:'shirt', label:'Morada',    price:40, hex:0x9b59d0 },
  { id:'shirt_estrella', slot:'shirt', label:'Estrella',  price:40, hex:0x1e3a8a, pattern:'estrella' },
  { id:'shirt_corazon',  slot:'shirt', label:'Corazón',   price:40, hex:0xf5f5f5, pattern:'corazon' },
  { id:'shirt_dorado',   slot:'shirt', label:'Dorada',    price:80, hex:0xe8b923 },

  // Pantalones
  { id:'pants_azul',   slot:'pants', label:'Azul',    price:0,  hex:0x2c3e75 },
  { id:'pants_negro',  slot:'pants', label:'Negro',   price:15, hex:0x222226 },
  { id:'pants_gris',   slot:'pants', label:'Gris',    price:15, hex:0x777b82 },
  { id:'pants_cafe',   slot:'pants', label:'Café',    price:15, hex:0x7a5230 },
  { id:'pants_rojo',   slot:'pants', label:'Rojo',    price:20, hex:0xb83a3a },
  { id:'pants_verde',  slot:'pants', label:'Verde',   price:20, hex:0x2f7d44 },
  { id:'pants_short',  slot:'pants', label:'Short',   price:25, hex:0x3b82f6, short:true },
  { id:'pants_dorado', slot:'pants', label:'Dorado',  price:60, hex:0xe8b923 },

  // Zapatos
  { id:'shoes_negro',  slot:'shoes', label:'Negros',  price:0,  hex:0x1a1a1a },
  { id:'shoes_blanco', slot:'shoes', label:'Blancos', price:15, hex:0xf5f5f5 },
  { id:'shoes_rojo',   slot:'shoes', label:'Rojos',   price:20, hex:0xe0334c },
  { id:'shoes_azul',   slot:'shoes', label:'Azules',  price:20, hex:0x3b82f6 },
  { id:'shoes_dorado', slot:'shoes', label:'Dorados', price:50, hex:0xe8b923 },

  // Cabeza
  { id:'hat_gorra',   slot:'hat', label:'Gorra',          price:15, icon:'🧢' },
  { id:'hat_chef',    slot:'hat', label:'Gorro de chef',  price:25, icon:'🍳' },
  { id:'hat_copa',    slot:'hat', label:'Sombrero copa',  price:25, icon:'🎩' },
  { id:'hat_casco',   slot:'hat', label:'Casco',          price:30, icon:'⛑️' },
  { id:'hat_gato',    slot:'hat', label:'Orejas gato',    price:35, icon:'🐱' },
  { id:'hat_conejo',  slot:'hat', label:'Orejas conejo',  price:35, icon:'🐰' },
  { id:'hat_pirata',  slot:'hat', label:'Pirata',         price:45, icon:'☠️' },
  { id:'hat_mago',    slot:'hat', label:'Mago',           price:50, icon:'🔮' },
  { id:'hat_corona',  slot:'hat', label:'Corona',         price:60, icon:'👑' },
  { id:'hat_aureola', slot:'hat', label:'Aureola',        price:70, icon:'😇' },

  { id:'hat_flores',   slot:'hat', label:'Corona de flores', price:15, icon:'🌸' },
  { id:'hat_lana',     slot:'hat', label:'Gorro de lana',    price:20, icon:'🧶' },
  { id:'hat_vaquero',  slot:'hat', label:'Sombrero vaquero', price:40, icon:'🤠' },

  // Cara
  { id:'face_bigote',  slot:'face', label:'Bigote',       price:15, icon:'👨' },
  { id:'face_nariz',   slot:'face', label:'Nariz payaso', price:15, icon:'🤡' },
  { id:'face_antifaz', slot:'face', label:'Antifaz',      price:20, icon:'🎭' },
  { id:'face_parche',  slot:'face', label:'Parche',       price:20, icon:'🏴' },
  { id:'face_lentes',  slot:'face', label:'Lentes',       price:25, icon:'👓' },
  { id:'face_sol',     slot:'face', label:'Lentes de sol',price:30, icon:'🕶️' },

  // Espalda
  { id:'back_mochila', slot:'back', label:'Mochila',  price:30,  icon:'🎒' },
  { id:'back_capa',    slot:'back', label:'Capa',     price:50,  icon:'🦸' },
  { id:'back_alas',    slot:'back', label:'Alas',     price:80,  icon:'🕊️' },
  { id:'back_jet',     slot:'back', label:'Jetpack',  price:100, icon:'🚀' },

  // Mascotas (te siguen)
  { id:'pet_pollito',  slot:'pet', label:'Pollito',   price:25,  icon:'🐥' },
  { id:'pet_conejo',   slot:'pet', label:'Conejito',  price:30,  icon:'🐰' },
  { id:'pet_gato',     slot:'pet', label:'Gatito',    price:30,  icon:'🐱' },
  { id:'pet_pinguino', slot:'pet', label:'Pingüino',  price:50,  icon:'🐧' },
  { id:'pet_robot',    slot:'pet', label:'Robot',     price:80,  icon:'🤖' },
  { id:'pet_dragon',   slot:'pet', label:'Dragón',    price:120, icon:'🐲' },

  // Cuello
  { id:'neck_mono',    slot:'neck', label:'Moño',     price:20, icon:'🎀' },
  { id:'neck_corbata', slot:'neck', label:'Corbata',  price:20, icon:'👔' },
  { id:'neck_bufanda', slot:'neck', label:'Bufanda',  price:25, icon:'🧣' },
  { id:'neck_medalla', slot:'neck', label:'Medalla',  price:40, icon:'🏅' },
  { id:'neck_flores',  slot:'neck', label:'Collar de flores', price:25, icon:'🌺' },
  { id:'back_guitarra', slot:'back', label:'Guitarra', price:40, icon:'🎸' },
];

export function itemById(id){
  return MUNDO_ITEMS.filter(function(i){ return i.id===id; })[0] || null;
}
export function itemsBySlot(slot){
  return MUNDO_ITEMS.filter(function(i){ return i.slot===slot; });
}
/* Ids del formato de la Fase 1-3 -> ids nuevos (migración de partidas guardadas). */
export const LEGACY_ITEM_MAP = {
  acc_gorro:'hat_copa', acc_corona:'hat_corona', acc_lentes:'face_lentes', acc_capa:'back_capa', acc_corbata:'neck_mono',
};
export function cssOf(it){ return hexCss(it.hex); }

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

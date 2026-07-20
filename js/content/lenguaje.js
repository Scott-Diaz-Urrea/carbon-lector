import { pick, shuffle } from '../utils.js';

export const VOCAL_WORDS = [
  { emoji:'🕷️', word:'ARAÑA', answer:'A' },
  { emoji:'✈️', word:'AVIÓN', answer:'A' },
  { emoji:'🐝', word:'ABEJA', answer:'A' },
  { emoji:'🌳', word:'ÁRBOL', answer:'A' },
  { emoji:'💧', word:'AGUA', answer:'A' },
  { emoji:'🦅', word:'ÁGUILA', answer:'A' },
  { emoji:'🪁', word:'ANCLA', answer:'A' },
  { emoji:'🐘', word:'ELEFANTE', answer:'E' },
  { emoji:'⭐', word:'ESTRELLA', answer:'E' },
  { emoji:'🚂', word:'ESCUELA', answer:'E' },
  { emoji:'🪞', word:'ESPEJO', answer:'E' },
  { emoji:'🌋', word:'ERUPCIÓN', answer:'E' },
  { emoji:'🏝️', word:'ISLA', answer:'I' },
  { emoji:'🧊', word:'IGLÚ', answer:'I' },
  { emoji:'🌈', word:'IRIS', answer:'I' },
  { emoji:'🧲', word:'IMÁN', answer:'I' },
  { emoji:'🦎', word:'IGUANA', answer:'I' },
  { emoji:'🐻', word:'OSO', answer:'O' },
  { emoji:'🐑', word:'OVEJA', answer:'O' },
  { emoji:'👂', word:'OREJA', answer:'O' },
  { emoji:'🐻', word:'OSITO', answer:'O' },
  { emoji:'🌊', word:'OLA', answer:'O' },
  { emoji:'🍇', word:'UVA', answer:'U' },
  { emoji:'💅', word:'UÑA', answer:'U' },
  { emoji:'1️⃣', word:'UNO', answer:'U' },
  { emoji:'🎽', word:'UNIFORME', answer:'U' },
  { emoji:'🦄', word:'UNICORNIO', answer:'U' },
];

export const PALABRA_WORDS = [
  { emoji:'🐱', word:'GATO', opts:['GALLO','GORRO','GLOBO'] },
  { emoji:'🦆', word:'PATO', opts:['PALO','PISO','PESO'] },
  { emoji:'☀️', word:'SOL', opts:['SAL','SUR','SON'] },
  { emoji:'🌙', word:'LUNA', opts:['LATA','LOMA','LIMA'] },
  { emoji:'🏠', word:'CASA', opts:['COSA','CAJA','CAMA'] },
  { emoji:'🌸', word:'FLOR', opts:['FRÍO','FRUTA','FOCA'] },
  { emoji:'🐟', word:'PEZ', opts:['PAZ','PIE','POR'] },
  { emoji:'🐻', word:'OSO', opts:['OJO','ASA','USO'] },
  { emoji:'🐄', word:'VACA', opts:['VELA','VIDA','VASO'] },
  { emoji:'🚂', word:'TREN', opts:['TRES','TRAJE','TRIGO'] },
  { emoji:'📖', word:'LIBRO', opts:['LOBO','LADO','LUPA'] },
  { emoji:'⚽', word:'PELOTA', opts:['PALETA','MALETA','CAMISETA'] },
  { emoji:'🐝', word:'ABEJA', opts:['ABUELA','ARENA','AGUJA'] },
  { emoji:'☁️', word:'NUBE', opts:['NAVE','NIEVE','NOCHE'] },
  { emoji:'⭐', word:'ESTRELLA', opts:['ESCUELA','ESCALERA','ESPEJO'] },
  { emoji:'✋', word:'MANO', opts:['MESA','MONO','MULA'] },
  { emoji:'🐢', word:'TORTUGA', opts:['TORMENTA','TOSTADA','TORNADO'] },
  { emoji:'🦋', word:'MARIPOSA', opts:['MARIONETA','MADRINA','MARINERO'] },
  { emoji:'🌙', word:'NOCHE', opts:['LECHE','COCHE','NIEVE'] },
  { emoji:'🐕', word:'PERRO', opts:['PERO','PIRO','PARRA'] },
  { emoji:'🎨', word:'PINTURA', opts:['CINTURA','PINTOR','CULTURA'] },
  { emoji:'🚲', word:'BICICLETA', opts:['BOCADILLO','BICEPS','BOTELLA'] },
  { emoji:'🍦', word:'HELADO', opts:['PELADO','SALADO','MOJADO'] },
  { emoji:'🦷', word:'DIENTE', opts:['DUENDE','DIENTES','DIANTRE'] },
];

export const COMPRENSION_BANK = [
  { text:'EL GATO DUERME EN LA CAMA.', question:'¿Dónde duerme el gato?', correct:'🛏️', opts:['🌳','⚽','🚗'] },
  { text:'LA NIÑA COME UNA MANZANA.', question:'¿Qué come la niña?', correct:'🍎', opts:['🍌','🍇','🍓'] },
  { text:'EL PERRO CORRE EN EL PARQUE.', question:'¿Dónde corre el perro?', correct:'🌳', opts:['🏠','🛏️','🚗'] },
  { text:'LA MAMÁ COCINA UNA SOPA.', question:'¿Qué cocina la mamá?', correct:'🍲', opts:['🍕','🎂','🥗'] },
  { text:'EL NIÑO LEE UN LIBRO.', question:'¿Qué hace el niño?', correct:'📖', opts:['⚽','🎨','🎵'] },
  { text:'LA ABEJA VUELA HACIA LA FLOR.', question:'¿Hacia dónde vuela la abeja?', correct:'🌸', opts:['🌙','🚗','📖'] },
  { text:'EL PEZ NADA EN EL AGUA.', question:'¿Dónde nada el pez?', correct:'🌊', opts:['🌳','🏠','☁️'] },
  { text:'LOS NIÑOS JUEGAN CON LA PELOTA.', question:'¿Con qué juegan los niños?', correct:'⚽', opts:['📖','🍎','🚗'] },
  { text:'LA LUNA BRILLA DE NOCHE.', question:'¿Cuándo brilla la luna?', correct:'🌙', opts:['☀️','🌧️','⛄'] },
  { text:'EL PATO NADA EN EL ESTANQUE.', question:'¿Quién nada en el estanque?', correct:'🦆', opts:['🐱','🐄','🐝'] },
  { text:'LA TORTUGA CAMINA MUY LENTO.', question:'¿Cómo camina la tortuga?', correct:'🐢', opts:['🐆','🐇','🦅'] },
  { text:'EL SOL CALIENTA LA PLAYA.', question:'¿Qué calienta el sol?', correct:'🏖️', opts:['🏔️','🌧️','🌙'] },
  { text:'LA MARIPOSA VUELA DE FLOR EN FLOR.', question:'¿Qué hace la mariposa?', correct:'🦋', opts:['🐌','🐛','🐜'] },
  { text:'EL PANADERO HORNEA EL PAN TEMPRANO.', question:'¿Quién hornea el pan?', correct:'👨‍🍳', opts:['👩‍⚕️','👮','👨‍🌾'] },
  { text:'LOS PÁJAROS CANTAN EN LA MAÑANA.', question:'¿Cuándo cantan los pájaros?', correct:'🌅', opts:['🌃','🌆','⛈️'] },
  { text:'LA ABUELA TEJE UNA BUFANDA DE LANA.', question:'¿Qué teje la abuela?', correct:'🧣', opts:['🧦','🧤','👒'] },
];

export const ALL_COMBOS = ['QUE','QUI','GE','GI','GUE','GUI','CE','CI','GÜE','GÜI'];
export const COMBO_WORDS = [
  { emoji:'🧀', before:'', combo:'QUE', after:'SO' },
  { emoji:'🏪', before:'', combo:'QUI', after:'OSCO' },
  { emoji:'👥', before:'', combo:'GE', after:'NTE' },
  { emoji:'🌻', before:'', combo:'GI', after:'RASOL' },
  { emoji:'🎸', before:'', combo:'GUI', after:'TARRA' },
  { emoji:'🚿', before:'MAN', combo:'GUE', after:'RA' },
  { emoji:'☁️', before:'', combo:'CI', after:'ELO' },
  { emoji:'🍳', before:'CO', combo:'CI', after:'NA' },
  { emoji:'🐧', before:'PIN', combo:'GÜI', after:'NO' },
  { emoji:'🧅', before:'', combo:'CE', after:'BOLLA' },
  { emoji:'🏸', before:'RA', combo:'QUE', after:'TA' },
  { emoji:'🎩', before:'MA', combo:'GI', after:'A' },
];

export const LENGUAJE_MODULES = [
  {id:'vocales', label:'Vocales', open:true, key:'vocales'},
  {id:'silabas', label:'Sílabas', open:true, key:'silabas'},
  {id:'memorama', label:'Letras', open:true, key:'memorama'},
  {id:'palabras', label:'Palabras', open:true, key:'palabras'},
  {id:'comprension', label:'Comprensión', open:true, key:'comprension'},
];
export const LENGUAJE_POS = [{x:22,y:88},{x:68,y:70},{x:24,y:52},{x:70,y:34},{x:24,y:16}];

export const LENGUAJE_MODULES_G2 = [
  {id:'combinaciones', label:'Combinaciones', open:true, key:'combinaciones'},
  {id:'secuencia', label:'Secuencia', open:true, key:'secuencia'},
  {id:'gramatica2', label:'Gramática', open:false, key:null},
  {id:'comprension2', label:'Comprensión II', open:false, key:null},
];
export const LENGUAJE_POS_G2 = [{x:22,y:84},{x:68,y:62},{x:24,y:40},{x:70,y:16}];

export function genVocalRound(){
  const item = pick(VOCAL_WORDS);
  const opts = shuffle(['A','E','I','O','U']).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span>'+
      '<p class="prompt-word"><span class="blank">_</span>'+item.word.slice(1)+'</p>'+
      '<p class="prompt-hint">¿Con qué vocal empieza esta palabra?</p>',
    options: opts,
    correctValue: item.answer,
    speakText: item.word,
    cols: 4,
    explain: 'La palabra es <b>'+item.word+'</b>, empieza con la vocal <b>'+item.answer+'</b>.',
  };
}

export function genPalabraRound(){
  const item = pick(PALABRA_WORDS);
  const opts = shuffle([item.word].concat(item.opts)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué palabra corresponde a esta imagen?</p>',
    options: opts,
    correctValue: item.word,
    speakText: item.word,
    cols: 4,
    kind: 'word',
    explain: 'La palabra correcta es <b>'+item.word+'</b>.',
  };
}

export function genComprensionRound(){
  const item = pick(COMPRENSION_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts,
    correctValue: item.correct,
    speakText: item.text,
    cols: 4,
    explain: 'Vuelve a leer: "'+item.text+'" Ahí está la respuesta.',
  };
}

export function genCombinacionRound(){
  const item = pick(COMBO_WORDS);
  const distract = shuffle(ALL_COMBOS.filter(function(c){ return c!==item.combo; })).slice(0,3);
  const opts = shuffle([item.combo].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span>'+
      '<p class="prompt-word">'+item.before+'<span class="blank">_</span>'+item.after+'</p>'+
      '<p class="prompt-hint">¿Qué combinación completa la palabra?</p>',
    options: opts,
    correctValue: item.combo,
    speakText: item.before+item.combo+item.after,
    cols: 4,
    explain: 'La palabra es <b>'+item.before+item.combo+item.after+'</b>.',
  };
}

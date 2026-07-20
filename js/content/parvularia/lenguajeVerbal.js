import { pick, shuffle, uniqueDistractors } from '../../utils.js';

/* Núcleo Lenguaje Verbal — Educación Parvularia, NT (Decreto 481/2017, ámbito
   Comunicación Integral, curriculumnacional.cl/curriculum/educacion-parvularia/
   comunicacion-integral/nt-nivel-transicion):
   OA08 -> Escribe tu Nombre y Caligrafía (trazado libre, sin motor de opción
   múltiple — Caligrafía además cubre "signos" del mismo OA08 vía números) ·
   OA03 -> Sílabas y Sonidos · OA02/OA06 -> Escuchar y Comprender ·
   OA01/OA04 -> Vocabulario en Contexto · OA07 -> Letras y Sonidos.
   Quedan fuera: OA05 (interés por textos escritos, actitudinal, no evaluable
   con opción múltiple) y OA09-10 (mensajes en lengua indígena de la comunidad
   o lenguas maternas de los pares — dependen de la lengua específica de cada
   comunidad/familia, no se pueden generalizar sin arriesgar contenido
   incorrecto o excluyente para quienes no pertenezcan a esa comunidad). */

export const LENGUAJE_VERBAL_MODULES = [
  { id:'escribenombre', label:'Escribe tu Nombre', open:true, key:'escribenombre' },
  { id:'caligrafia', label:'Caligrafía', open:true, key:'caligrafia' },
  { id:'silabasnt', label:'Sílabas y Sonidos', open:true, key:'silabasnt' },
  { id:'escucharnt', label:'Escuchar y Comprender', open:true, key:'escucharnt' },
  { id:'vocabnt', label:'Vocabulario en Contexto', open:true, key:'vocabnt' },
  { id:'letrasnt', label:'Letras y Sonidos', open:true, key:'letrasnt' },
];
export const LENGUAJE_VERBAL_POS = [
  {x:22,y:92},{x:68,y:77},{x:24,y:61},{x:70,y:45},{x:24,y:26},{x:70,y:8}
];

const SILABAS_NT_BANK = [
  { word:'SOL', emoji:'☀️', silabas:1 },
  { word:'PEZ', emoji:'🐟', silabas:1 },
  { word:'FLOR', emoji:'🌸', silabas:1 },
  { word:'GATO', emoji:'🐱', silabas:2 },
  { word:'LUNA', emoji:'🌙', silabas:2 },
  { word:'CASA', emoji:'🏠', silabas:2 },
  { word:'PELOTA', emoji:'⚽', silabas:3 },
  { word:'ZAPATO', emoji:'👞', silabas:3 },
  { word:'TOMATE', emoji:'🍅', silabas:3 },
  { word:'MARIPOSA', emoji:'🦋', silabas:4 },
  { word:'ELEFANTE', emoji:'🐘', silabas:4 },
  { word:'BICICLETA', emoji:'🚲', silabas:4 },
];

const RIDDLES_NT_BANK = [
  { text:'Tengo alas de colores y vuelo de flor en flor. ¿Qué soy?', correct:'🦋', opts:['🐝','🐌','🐞'], reason:'las mariposas tienen alas de colores y vuelan entre flores' },
  { text:'Doy leche y digo "muu". ¿Qué soy?', correct:'🐄', opts:['🐑','🐷','🐴'], reason:'la vaca da leche y hace "muu"' },
  { text:'Brillo en el cielo de noche y soy redonda. ¿Qué soy?', correct:'🌙', opts:['☀️','⭐','☁️'], reason:'la luna brilla de noche' },
  { text:'Tengo cuatro patas, ladro y soy el mejor amigo de las personas. ¿Qué soy?', correct:'🐶', opts:['🐱','🐰','🐦'], reason:'el perro ladra y es el mejor amigo del ser humano' },
  { text:'Soy amarillo, caliente, y salgo todas las mañanas. ¿Qué soy?', correct:'☀️', opts:['🌙','⭐','🌧️'], reason:'el sol es amarillo, caliente y sale de día' },
  { text:'Nado en el agua y tengo escamas. ¿Qué soy?', correct:'🐟', opts:['🐦','🐸','🐢'], reason:'los peces nadan y tienen escamas' },
  { text:'Soy dulce, redonda y crezco en el árbol. ¿Qué soy?', correct:'🍎', opts:['🥕','🥔','🧅'], reason:'la manzana es dulce, redonda y crece en un árbol' },
  { text:'Tengo un caparazón y camino muy lento. ¿Qué soy?', correct:'🐢', opts:['🐇','🐆','🐦'], reason:'la tortuga tiene caparazón y camina lento' },
];

const VOCAB_SINONIMOS_BANK = [
  { palabra:'CONTENTO', sinonimo:'FELIZ', distract:['TRISTE','ENOJADO','CANSADO'] },
  { palabra:'GRANDE', sinonimo:'ENORME', distract:['CHICO','ANGOSTO','BAJO'] },
  { palabra:'RÁPIDO', sinonimo:'VELOZ', distract:['LENTO','QUIETO','SUAVE'] },
  { palabra:'BONITO', sinonimo:'LINDO', distract:['FEO','SUCIO','ROTO'] },
  { palabra:'PEQUEÑO', sinonimo:'CHICO', distract:['GIGANTE','LARGO','ANCHO'] },
  { palabra:'VALIENTE', sinonimo:'ATREVIDO', distract:['MIEDOSO','TÍMIDO','CALLADO'] },
  { palabra:'LIMPIO', sinonimo:'ASEADO', distract:['SUCIO','MOJADO','ROTO'] },
  { palabra:'CANSADO', sinonimo:'AGOTADO', distract:['DESPIERTO','ALEGRE','FUERTE'] },
];

const LETRAS_NT_BANK = [
  { word:'MESA', emoji:'🪑', inicial:'M' },
  { word:'PATO', emoji:'🦆', inicial:'P' },
  { word:'SAPO', emoji:'🐸', inicial:'S' },
  { word:'LIBRO', emoji:'📖', inicial:'L' },
  { word:'TREN', emoji:'🚂', inicial:'T' },
  { word:'CASA', emoji:'🏠', inicial:'C' },
  { word:'BOTE', emoji:'⛵', inicial:'B' },
  { word:'DEDO', emoji:'👆', inicial:'D' },
  { word:'FOCA', emoji:'🦭', inicial:'F' },
  { word:'GATO', emoji:'🐱', inicial:'G' },
  { word:'NUBE', emoji:'☁️', inicial:'N' },
  { word:'ROSA', emoji:'🌹', inicial:'R' },
];

export function genSilabasNTRound(){
  const item = pick(SILABAS_NT_BANK);
  const opts = uniqueDistractors(item.silabas,1,5,3,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-word">'+item.word+'</p><p class="prompt-hint">¿Cuántas sílabas tiene esta palabra?</p>',
    options: opts, correctValue: item.silabas, speakText: item.word, cols:4,
    explain: '<b>'+item.word+'</b> tiene <b>'+item.silabas+'</b> sílaba'+(item.silabas>1?'s':'')+'.',
  };
}

export function genEscucharNTRound(){
  const item = pick(RIDDLES_NT_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols:4,
    explain: 'La respuesta es correcta porque '+item.reason+'.',
  };
}

export function genVocabNTRound(){
  const item = pick(VOCAB_SINONIMOS_BANK);
  const opts = shuffle([item.sinonimo].concat(item.distract)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">¿Cuál palabra significa lo mismo?</p>',
    options: opts, correctValue: item.sinonimo, speakText: item.palabra, cols:4, kind:'word',
    explain: '<b>'+item.sinonimo+'</b> significa lo mismo que <b>'+item.palabra+'</b>.',
  };
}

export function genLetrasNTRound(){
  const item = pick(LETRAS_NT_BANK);
  const distractPool = LETRAS_NT_BANK.filter(function(w){ return w.inicial!==item.inicial; })
    .map(function(w){ return w.inicial; })
    .filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([item.inicial].concat(distract)).map(function(l){ return {label:l, value:l}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-word"><span class="blank">_</span>'+item.word.slice(1)+'</p><p class="prompt-hint">¿Qué letra falta?</p>',
    options: opts, correctValue: item.inicial, speakText: item.word, cols:4,
    explain: 'La palabra es <b>'+item.word+'</b>, empieza con la letra <b>'+item.inicial+'</b>.',
  };
}

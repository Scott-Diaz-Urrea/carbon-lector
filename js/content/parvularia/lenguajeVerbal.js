import { pick, shuffle, uniqueDistractors } from '../../utils.js';
import { focaSVG } from '../../svg.js';

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
  { text:'Doy leche y digo “muu”. ¿Qué soy?', correct:'🐄', opts:['🐑','🐷','🐴'], reason:'la vaca da leche y hace "muu"' },
  { text:'Brillo en el cielo de noche y soy redonda. ¿Qué soy?', correct:'🌕', opts:['☀️','⭐','☁️'], reason:'la luna brilla de noche y se ve redonda' },
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
  { palabra:'VALIENTE', sinonimo:'VALEROSO', distract:['MIEDOSO','TÍMIDO','CALLADO'] },
  { palabra:'LIMPIO', sinonimo:'ASEADO', distract:['SUCIO','MOJADO','ROTO'] },
  { palabra:'CANSADO', sinonimo:'AGOTADO', distract:['DESPIERTO','ALEGRE','FUERTE'] },
];

const LETRAS_NT_BANK = [
  { word:'MANO', emoji:'✋', inicial:'M' },
  { word:'PATO', emoji:'🦆', inicial:'P' },
  { word:'SAPO', emoji:'🐸', inicial:'S' },
  { word:'LIBRO', emoji:'📖', inicial:'L' },
  { word:'TREN', emoji:'🚂', inicial:'T' },
  { word:'CASA', emoji:'🏠', inicial:'C' },
  { word:'BOTE', emoji:'🛶', inicial:'B' },
  { word:'DEDO', emoji:'👆', inicial:'D' },
  { word:'FOCA', emoji: focaSVG(38), inicial:'F' },
  { word:'GATO', emoji:'🐱', inicial:'G' },
  { word:'NUBE', emoji:'☁️', inicial:'N' },
  { word:'ROSA', emoji:'🌹', inicial:'R' },
];

export function genSilabasNTRound(){
  const recurso = 'Una <b>sílaba</b> es cada uno de los "golpes de voz" que se necesitan para decir una palabra en voz alta — por ejemplo, "SOL" se dice en un solo golpe (1 sílaba), pero "GA-TO" se dice en dos golpes (2 sílabas). Una forma fácil de contar sílabas es aplaudir o dar palmadas mientras se dice la palabra despacio: cada palmada corresponde a una sílaba. Esta habilidad se llama "conciencia silábica" y es uno de los pasos más importantes antes de aprender a leer y escribir, porque ayuda a los niños a notar que las palabras están hechas de partes más pequeñas de sonido, y a separar esas partes al momento de escribir (por ejemplo, para saber dónde cortar una palabra al final de una línea).';
  const item = pick(SILABAS_NT_BANK);
  const opts = uniqueDistractors(item.silabas,1,5,3,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-word">'+item.word+'</p><p class="prompt-hint">¿Cuántas sílabas tiene esta palabra?</p>',
    options: opts, correctValue: item.silabas, speakText: item.word, cols:4,
    explain: '<b>'+item.word+'</b> tiene <b>'+item.silabas+'</b> sílaba'+(item.silabas>1?'s':'')+'.',
    recurso: recurso,
  };
}

export function genEscucharNTRound(){
  const recurso = '<b>Escuchar y comprender</b> es entender un mensaje que otra persona dice en voz alta, prestando atención a las pistas que da para descubrir de qué está hablando — como en una adivinanza, donde hay que unir varias pistas ("tengo alas de colores", "vuelo de flor en flor") para llegar a una sola respuesta correcta. Esta habilidad requiere concentración, memoria (recordar todas las pistas mientras se escuchan) y razonamiento (pensar qué animal u objeto cumple con TODAS las pistas a la vez, no solo con una). Comprender lo que se escucha es la base de la comunicación oral: sin esta habilidad sería imposible seguir instrucciones, disfrutar un cuento contado en voz alta o participar en una conversación.';
  const item = pick(RIDDLES_NT_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols:4,
    explain: 'La respuesta es correcta porque '+item.reason+'.',
    recurso: recurso,
  };
}

export function genVocabNTRound(){
  const recurso = 'Dos palabras que <b>significan casi lo mismo</b> se llaman <b>sinónimos</b> — por ejemplo, "contento" y "feliz" describen la misma emoción, solo que con una palabra distinta. Conocer sinónimos ayuda a tener un vocabulario más rico: en vez de repetir siempre la misma palabra, se pueden usar distintas palabras que dicen lo mismo, lo que hace que hablar y escribir sea más variado e interesante. Para saber si dos palabras son sinónimas, hay que preguntarse si se podrían intercambiar en una oración sin que cambie mucho el sentido — por ejemplo, "el perro está contento" y "el perro está feliz" significan prácticamente lo mismo. Aprender sinónimos también ayuda a entender palabras nuevas: si no se conoce una palabra, a veces se puede adivinar su significado pensando en un sinónimo que sí se conoce.';
  const item = pick(VOCAB_SINONIMOS_BANK);
  const opts = shuffle([item.sinonimo].concat(item.distract)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">¿Cuál palabra significa lo mismo?</p>',
    options: opts, correctValue: item.sinonimo, speakText: item.palabra, cols:4, kind:'word',
    explain: '<b>'+item.sinonimo+'</b> significa lo mismo que <b>'+item.palabra+'</b>.',
    recurso: recurso,
  };
}

export function genLetrasNTRound(){
  const recurso = 'Cada <b>letra</b> del abecedario representa uno o más <b>sonidos</b> — a esto se le llama "conciencia fonológica": darse cuenta de que las palabras habladas están hechas de sonidos individuales, y que cada sonido se puede escribir con una letra. Para descubrir con qué letra empieza una palabra, hay que decir la palabra despacio y prestar atención al primer sonido que se escucha (por ejemplo, "mano" empieza con el sonido "mmm", que se escribe con la letra M). Esta habilidad es uno de los pilares más importantes antes de aprender a leer y escribir de verdad: une el sonido que se escucha con el símbolo (la letra) que se ve escrito, que es exactamente lo que se necesita para decodificar palabras al leer.';
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
    recurso: recurso,
  };
}

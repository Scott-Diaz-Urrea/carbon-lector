import { pick, shuffle } from '../utils.js';

/* "Aprendo a Leer" — herramienta transversal nueva (no atada a año/núcleo),
   pedida explícitamente por el usuario (2026-08-09) para agregar debajo de
   "Colorear por Números" en Herramientas de consulta. A diferencia de las
   otras 2 herramientas (Diccionario/Colorear, sin rondas ni estrellas), el
   usuario confirmó explícitamente vía AskUserQuestion que ESTA sí debe
   comportarse "como un juego normal" (rondas, estrellas, XP, motor MC) — y
   aclaró en texto libre, al responder la pregunta de qué mecánica usar, que
   el niño al que apunta "no conoce las letras" — es decir, ninguna de las 3
   mecánicas ofrecidas (armar palabras con sílabas / leer oraciones / ambas)
   servía como punto de partida, porque las tres ya asumen que el niño
   reconoce letras o sílabas. Se diseñaron en su lugar 3 niveles progresivos
   que arrancan literalmente desde cero (reconocer la FORMA de una letra) y
   terminan en la primera sílaba, el escalón justo antes de "Sílabas y
   Sonidos"/"Vocabulario en Contexto" (núcleo Lenguaje Verbal NT) y
   "Vocales"/"Sílabas"/"Palabras" (1° básico) — sin duplicar ninguno de esos
   módulos (ver el detalle de cada nivel abajo). Nivel de contenido: NT
   (confirmado por el usuario), mismo criterio de vocabulario/dificultad que
   el resto del contenido NT ya construido.

   No cita un OA de Mineduc como el resto de núcleos NT porque es una
   herramienta transversal de apoyo (mismo estatus que Diccionario/Colorear),
   no un módulo curricular gatillado por núcleo — igual que esas 2, queda
   fuera de la "regla de oro" del proyecto por ser una herramienta de
   habilidad general, no contenido curricular con un OA específico detrás. */

/* Los 13 sonidos con los que arranca cualquier método silábico en español:
   las 5 vocales + las 8 consonantes que forman las sílabas más simples y
   frecuentes (M,P,L,S,T,N,D,C) — deliberadamente se excluyen consonantes
   con sonido irregular o poco frecuente al inicio (B/V, G, J, Ñ, R fuerte,
   H muda, Q, X, Y, Z, K, W) para no confundir a un niño que recién está
   reconociendo letras. */
export const LETRAS_SET = [
  { letra:'A', nombre:'a' }, { letra:'E', nombre:'e' }, { letra:'I', nombre:'i' },
  { letra:'O', nombre:'o' }, { letra:'U', nombre:'u' },
  { letra:'M', nombre:'eme' }, { letra:'P', nombre:'pe' }, { letra:'L', nombre:'ele' },
  { letra:'S', nombre:'ese' }, { letra:'T', nombre:'te' }, { letra:'N', nombre:'ene' },
  { letra:'D', nombre:'de' }, { letra:'C', nombre:'ce' },
];

/* Nivel 1 — "Conoce las Letras": reconocimiento puro de forma. Carboncito
   dice el NOMBRE de una letra en voz alta (botón "Escuchar"); el niño debe
   tocar, entre 4 letras grandes, la que corresponde. No requiere saber leer
   nada (las opciones son un solo carácter cada una, no palabras) — es
   literalmente el primer peldaño: asociar un sonido/nombre con una forma. */
export function genConoceLetrasRound(){
  const recurso = 'Antes de leer palabras, hay que reconocer cada letra por su forma — como reconocer la cara de un amigo entre varias personas. Cada letra del abecedario tiene un nombre propio (la "eme", la "pe", la "a"...) y una forma que siempre es igual, esté donde esté. Practicar esto una y otra vez, hasta que sea automático, es el primer paso de cualquier lector: sin reconocer las letras rápido, leer palabras completas sería muy lento y difícil. Con el tiempo, tu cerebro aprende a reconocer cada letra de un vistazo, sin tener que pensarlo.';
  const item = pick(LETRAS_SET);
  const distractPool = LETRAS_SET.filter(function(l){ return l.letra !== item.letra; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([item].concat(distract)).map(function(l){ return { label:l.letra, value:l.letra }; });
  return {
    promptHTML: '<span class="prompt-emoji">🔊</span><p class="prompt-hint">Toca la letra que dice Carboncito.</p>',
    options: opts, correctValue: item.letra, speakText: item.nombre, cols:4,
    explain: 'Esta letra se llama "'+item.nombre+'" y se escribe así: <b>'+item.letra+'</b>.',
    recurso: recurso,
  };
}

/* Nivel 2 — "Letra Inicial": el niño ya reconoce las 13 formas del Nivel 1;
   ahora las conecta con el sonido inicial de una palabra real (apoyada en
   un emoji, para que la respuesta no dependa de saber leer el resto de la
   palabra). Un ítem por cada una de las 13 letras del set — banco propio,
   distinto del de "Letras y Sonidos" (letrasnt), para no duplicar ese
   módulo del núcleo Lenguaje Verbal. */
const PALABRAS_INICIAL = [
  { word:'ANILLO', emoji:'💍', letra:'A' }, { word:'ELEFANTE', emoji:'🐘', letra:'E' },
  { word:'ISLA', emoji:'🏝️', letra:'I' }, { word:'OSO', emoji:'🐻', letra:'O' },
  { word:'UVA', emoji:'🍇', letra:'U' }, { word:'MANO', emoji:'✋', letra:'M' },
  { word:'PATO', emoji:'🦆', letra:'P' }, { word:'LUNA', emoji:'🌙', letra:'L' },
  { word:'SOL', emoji:'☀️', letra:'S' }, { word:'TAZA', emoji:'☕', letra:'T' },
  { word:'NARANJA', emoji:'🍊', letra:'N' }, { word:'DEDO', emoji:'👆', letra:'D' },
  { word:'CASA', emoji:'🏠', letra:'C' },
];
export function genLetraInicialLeerRound(){
  const recurso = 'Cada palabra empieza con un sonido, y ese sonido tiene una letra. Para descubrir con qué letra empieza una palabra, primero hay que decirla despacio y escuchar bien su primer sonido: "mmm-esa" empieza con el sonido de la M. Esta es una de las habilidades más importantes antes de leer solo: conectar lo que escuchas con la letra que lo representa por escrito.';
  const item = pick(PALABRAS_INICIAL);
  const distractPool = LETRAS_SET.filter(function(l){ return l.letra !== item.letra; }).map(function(l){ return l.letra; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([item.letra].concat(distract)).map(function(l){ return { label:l, value:l }; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Con qué letra empieza esta palabra?</p>',
    options: opts, correctValue: item.letra, speakText: item.word, cols:4,
    explain: 'La palabra es <b>'+item.word+'</b>, empieza con la letra <b>'+item.letra+'</b>.',
    recurso: recurso,
  };
}

/* Nivel 3 — "Primeras Sílabas": el paso final antes de "Sílabas y Sonidos"
   (que trabaja con palabras completas). Aquí Carboncito dice una sílaba
   sola (consonante+vocal, ej. "ma") y el niño la reconoce por escrito entre
   4 opciones — la primera vez que se le pide leer 2 letras juntas, no solo
   una. Se generan combinaciones consonante+vocal en vez de un banco fijo
   (mismo criterio de "contenido dinámico" ya establecido en el proyecto).
   CE/CI se excluyen a propósito: en español su sonido no es el mismo que
   CA/CO/CU (es /se/,/si/ o /θe/,/θi/ según la región), así que incluirlas
   sería inconsistente con que el resto de combinaciones de C sí sonarán
   como se leen. */
const CONSONANTES_SILABAS = ['M','P','L','S','T','N','D'];
const VOCALES_SILABAS = ['A','E','I','O','U'];
function todasLasSilabas(){
  const out = [];
  CONSONANTES_SILABAS.forEach(function(c){
    VOCALES_SILABAS.forEach(function(v){ out.push(c+v); });
  });
  ['A','O','U'].forEach(function(v){ out.push('C'+v); });
  return out;
}
const SILABAS_POOL = todasLasSilabas();
export function genPrimerasSilabasRound(){
  const recurso = 'Cuando ya conoces las letras, el siguiente paso es juntar dos sonidos en uno solo: por ejemplo, la M y la A juntas suenan "ma". A eso se le llama sílaba, y es la primera "pieza" que un lector arma para empezar a leer palabras completas — casi todas las palabras en español están hechas de sílabas como esta, unidas una tras otra.';
  const silaba = pick(SILABAS_POOL);
  const distractPool = SILABAS_POOL.filter(function(s){ return s !== silaba; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([silaba].concat(distract)).map(function(s){ return { label:s, value:s }; });
  return {
    promptHTML: '<span class="prompt-emoji">🔊</span><p class="prompt-hint">Escucha con atención y toca la sílaba que escuchaste.</p>',
    options: opts, correctValue: silaba, speakText: silaba.toLowerCase(), cols:4,
    explain: 'Carboncito dijo <b>'+silaba+'</b>.',
    recurso: recurso,
  };
}

export const APRENDO_A_LEER_MODULES = [
  { id:'alconoceletras', label:'Conoce las Letras', open:true, key:'alconoceletras' },
  { id:'alletrainicial', label:'Letra Inicial', open:true, key:'alletrainicial' },
  { id:'alprimerasilabas', label:'Primeras Sílabas', open:true, key:'alprimerasilabas' },
];
export const APRENDO_A_LEER_POS = [
  { x:24, y:82 }, { x:68, y:50 }, { x:24, y:18 },
];

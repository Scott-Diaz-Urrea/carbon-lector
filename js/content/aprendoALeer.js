import { pick, shuffle } from '../utils.js';

/* Velocidad de voz más lenta que el resto de la app (0.96 por defecto, ver
   audio.js), pedido explícito del usuario (2026-08-09): "el recurso del
   audio es demasiado rápido dado que colocan una sola letra". Un niño que
   "no conoce las letras" (la premisa de esta herramienta, ver arriba)
   necesita más tiempo para procesar un sonido aislado (una letra o una
   sílaba sola) que para procesar una palabra u oración larga, donde el
   contexto ayuda a recuperarse de una sílaba que no se alcanzó a
   escuchar bien. Se aplica a los 5 niveles por igual, no solo a "Conoce
   las Letras" (donde el ejemplo del usuario era más evidente), porque
   todos comparten la misma premisa de pre-lectura. */
const AL_SPEAK_RATE = 0.65;

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
   habilidad general, no contenido curricular con un OA específico detrás.

   5 niveles en total (el 4°, "Une las Sílabas", se agregó el mismo día tras
   robustecer la herramienta con un 5° nivel inspirado en el método del
   "Silabario Hispanoamericano" — ver el comentario detallado justo antes de
   `genUneSilabasRound()` más abajo para la fuente, el criterio de copyright
   y el diseño completo). */

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
    options: opts, correctValue: item.letra, speakText: item.nombre, speakRate: AL_SPEAK_RATE, cols:4,
    explain: 'Esta letra se llama "'+item.nombre+'" y se escribe así: <b>'+item.letra+'</b>.',
    recurso: recurso,
  };
}

/* Nivel 2 — "Letra Inicial": el niño ya reconoce las 13 formas del Nivel 1;
   ahora las conecta con el sonido inicial de una palabra real (apoyada en
   un emoji, para que la respuesta no dependa de saber leer el resto de la
   palabra). Banco propio, distinto del de "Letras y Sonidos" (letrasnt),
   para no duplicar ese módulo del núcleo Lenguaje Verbal.
   Robustecido (2026-08-09, pedido explícito del usuario tras probar la
   herramienta: "robustecela") de 1 a 2 palabras por cada una de las 13
   letras del set (26 en total) — así la misma letra no siempre aparece
   ilustrada con el mismo dibujo, dando más variedad real entre partidas
   sin tocar la mecánica ni el criterio de "una sola letra por ítem, apoyada
   en emoji" ya establecido. */
const PALABRAS_INICIAL = [
  { word:'ANILLO', emoji:'💍', letra:'A' }, { word:'ÁRBOL', emoji:'🌳', letra:'A' },
  { word:'ELEFANTE', emoji:'🐘', letra:'E' }, { word:'ESCOBA', emoji:'🧹', letra:'E' },
  { word:'ISLA', emoji:'🏝️', letra:'I' }, { word:'IMÁN', emoji:'🧲', letra:'I' },
  { word:'OSO', emoji:'🐻', letra:'O' }, { word:'OJO', emoji:'👁️', letra:'O' },
  { word:'UVA', emoji:'🍇', letra:'U' }, { word:'UNICORNIO', emoji:'🦄', letra:'U' },
  { word:'MANO', emoji:'✋', letra:'M' }, { word:'MONO', emoji:'🐒', letra:'M' },
  { word:'PATO', emoji:'🦆', letra:'P' }, { word:'PELOTA', emoji:'⚽', letra:'P' },
  { word:'LUNA', emoji:'🌙', letra:'L' }, { word:'LIBRO', emoji:'📖', letra:'L' },
  { word:'SOL', emoji:'☀️', letra:'S' }, { word:'SILLA', emoji:'🪑', letra:'S' },
  { word:'TAZA', emoji:'☕', letra:'T' }, { word:'TREN', emoji:'🚂', letra:'T' },
  { word:'NARANJA', emoji:'🍊', letra:'N' }, { word:'NUBE', emoji:'☁️', letra:'N' },
  { word:'DEDO', emoji:'👆', letra:'D' }, { word:'DIENTE', emoji:'🦷', letra:'D' },
  { word:'CASA', emoji:'🏠', letra:'C' }, { word:'CORAZÓN', emoji:'❤️', letra:'C' },
];
export function genLetraInicialLeerRound(){
  const recurso = 'Cada palabra empieza con un sonido, y ese sonido tiene una letra. Para descubrir con qué letra empieza una palabra, primero hay que decirla despacio y escuchar bien su primer sonido: "mmm-esa" empieza con el sonido de la M. Esta es una de las habilidades más importantes antes de leer solo: conectar lo que escuchas con la letra que lo representa por escrito.';
  const item = pick(PALABRAS_INICIAL);
  const distractPool = LETRAS_SET.filter(function(l){ return l.letra !== item.letra; }).map(function(l){ return l.letra; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([item.letra].concat(distract)).map(function(l){ return { label:l, value:l }; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Con qué letra empieza esta palabra?</p>',
    options: opts, correctValue: item.letra, speakText: item.word, speakRate: AL_SPEAK_RATE, cols:4,
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
    options: opts, correctValue: silaba, speakText: silaba.toLowerCase(), speakRate: AL_SPEAK_RATE, cols:4,
    explain: 'Carboncito dijo <b>'+silaba+'</b>.',
    recurso: recurso,
  };
}

/* Nivel 4 — "Une las Sílabas" (agregado 2026-08-09, mismo día, pedido
   explícito del usuario tras compartir el PDF del "Silabario
   Hispanoamericano" de Adrián Dufflocq Galdames, 1953: "conoces el
   silabario... me gustaría integrar algo similar para robustecer el
   Aprendo a Leer"). Se leyó el PDF completo (extracción de texto vía
   `pdftotext -layout`, escaneado con bastante ruido de OCR pero legible) —
   es el método clásico "fónico-sensorial-objetivo-sintético" usado en toda
   Hispanoamérica: nunca se enseña el nombre de las consonantes por
   separado, se introduce una consonante nueva a la vez combinada con las 5
   vocales (pa-pe-pi-po-pu), y apenas hay 2 consonantes aprendidas se arman
   PALABRAS REALES uniendo sus sílabas (ej. con P y L: "pipa", "lupa") —
   el niño "traduce por sí solo" en vez de que se le lea la palabra. El
   libro en sí (texto, ilustraciones, año 1953) tiene copyright vigente, así
   que no se copió ninguna palabra/imagen/ejercicio textual de él — lo que
   se adoptó es el MÉTODO (no protegible): la fusión de sílabas sueltas en
   una palabra completa, que es exactamente el paso que faltaba entre
   "Primeras Sílabas" (reconocer 1 sílaba suelta) y el módulo de abajo,
   "Lee una Palabra" (reconocer una palabra ya completa). Aquí Carboncito
   muestra 2 sílabas por separado (ej. "MA + PA") y el niño elige, entre 4
   palabras escritas, cuál se forma al juntarlas — a propósito SIN emoji de
   apoyo (a diferencia de los otros 4 niveles): el silabario original nunca
   usa dibujos como respaldo de la respuesta, el niño decodifica el texto
   solo, así que este nivel replica esa idea central del método. Banco
   propio de 18 palabras reales de 2 sílabas (CV+CV, mismas 13 letras y las
   mismas restricciones que `SILABAS_POOL` — nunca CE/CI), incluyendo MAMÁ/
   PAPÁ como guiño directo al par de palabras más emblemático del método
   (las primeras que cualquier niño arma con el silabario clásico). */
const PALABRAS_UNE_SILABAS = [
  { word:'MAMÁ', s1:'MA', s2:'MA' }, { word:'PAPÁ', s1:'PA', s2:'PA' },
  { word:'SOPA', s1:'SO', s2:'PA' }, { word:'MAPA', s1:'MA', s2:'PA' },
  { word:'LUPA', s1:'LU', s2:'PA' }, { word:'SAPO', s1:'SA', s2:'PO' },
  { word:'PATO', s1:'PA', s2:'TO' }, { word:'LATA', s1:'LA', s2:'TA' },
  { word:'PILA', s1:'PI', s2:'LA' }, { word:'DONA', s1:'DO', s2:'NA' },
  { word:'TELA', s1:'TE', s2:'LA' }, { word:'DADO', s1:'DA', s2:'DO' },
  { word:'TAPA', s1:'TA', s2:'PA' }, { word:'MOTO', s1:'MO', s2:'TO' },
  { word:'NIDO', s1:'NI', s2:'DO' }, { word:'CUNA', s1:'CU', s2:'NA' },
  { word:'COCO', s1:'CO', s2:'CO' }, { word:'MESA', s1:'ME', s2:'SA' },
];
export function genUneSilabasRound(){
  const recurso = 'Las sílabas se pueden unir para formar palabras completas: "ma" más "pa" forman "mapa". A esto se le llama método sintético — de las piezas pequeñas (sílabas) se arma algo más grande (la palabra) — y es la misma idea que usan los silabarios clásicos para enseñar a leer: primero una sílaba sola, después dos sílabas juntas formando una palabra real, y así hasta leer palabras cada vez más largas.';
  const item = pick(PALABRAS_UNE_SILABAS);
  const distractPool = PALABRAS_UNE_SILABAS.filter(function(w){ return w.word !== item.word; }).map(function(w){ return w.word; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([item.word].concat(distract)).map(function(w){ return { label:w, value:w }; });
  return {
    promptHTML: '<p class="prompt-hint">Une estas sílabas. ¿Qué palabra forman?</p><p class="prompt-count">'+item.s1+' + '+item.s2+'</p>',
    options: opts, correctValue: item.word, speakText: item.word, speakRate: AL_SPEAK_RATE, cols:4, kind:'word',
    explain: '<b>'+item.s1+'</b> + <b>'+item.s2+'</b> forman <b>'+item.word+'</b>.',
    recurso: recurso,
  };
}

/* Nivel 5 — "Lee una Palabra" (agregado 2026-08-09, mismo pedido de
   robustecer la herramienta): el peldaño de pago de los 4 niveles
   anteriores — la primera vez que el niño debe LEER un texto completo (no
   solo una letra o una sílaba) para responder, en vez de reconocer algo por
   audio. Todas las palabras del banco están armadas con sílabas del mismo
   Nivel 3 (consonante+vocal del set de 13 letras), así que cualquier niño
   que ya haya practicado "Primeras Sílabas" reconoce las piezas. A
   diferencia de los otros 3 niveles (donde la respuesta se elige por
   audio/forma), aquí se invierte a propósito el patrón ya usado en
   "Palabras" (1° básico, `genPalabraRound`): se muestra un emoji y el niño
   elige, ENTRE 4 PALABRAS ESCRITAS, la que corresponde — la lectura real
   ocurre al comparar las 4 alternativas de texto, no al mirar el dibujo.
   Banco propio (nunca el mismo array que `PALABRA_WORDS` de lenguaje.js),
   aunque algunas palabras/emoji se repitan sueltos entre módulos — mismo
   criterio ya aceptado en el resto de la app para vocabulario básico
   (sol/luna/gato aparecen en decenas de bancos distintos sin problema). */
const PALABRAS_LEER = [
  { word:'MAPA', emoji:'🗺️' }, { word:'SOPA', emoji:'🍲' }, { word:'LUPA', emoji:'🔍' },
  { word:'LUNA', emoji:'🌙' }, { word:'SAPO', emoji:'🐸' }, { word:'DADO', emoji:'🎲' },
  { word:'LATA', emoji:'🥫' }, { word:'DONA', emoji:'🍩' }, { word:'PILA', emoji:'🔋' },
  { word:'PATO', emoji:'🦆' }, { word:'TELA', emoji:'🧵' },
];
export function genLeePalabraRound(){
  const recurso = 'Leer una palabra completa es juntar sus sílabas, una tras otra, hasta escuchar la palabra entera: "ma-pa" se lee "mapa". Al principio hay que leer despacio, sílaba por sílaba, pero con práctica esas piezas se juntan cada vez más rápido en tu cabeza, hasta que un día lees la palabra completa de un solo vistazo, sin pensarlo. ¡Esa es la meta de todo lector!';
  const item = pick(PALABRAS_LEER);
  const distractPool = PALABRAS_LEER.filter(function(w){ return w.word !== item.word; }).map(function(w){ return w.word; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([item.word].concat(distract)).map(function(w){ return { label:w, value:w }; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué palabra corresponde a este dibujo?</p>',
    options: opts, correctValue: item.word, speakText: item.word, speakRate: AL_SPEAK_RATE, cols:4, kind:'word',
    explain: 'La palabra correcta es <b>'+item.word+'</b>.',
    recurso: recurso,
  };
}

export const APRENDO_A_LEER_MODULES = [
  { id:'alconoceletras', label:'Conoce las Letras', open:true, key:'alconoceletras' },
  { id:'alletrainicial', label:'Letra Inicial', open:true, key:'alletrainicial' },
  { id:'alprimerasilabas', label:'Primeras Sílabas', open:true, key:'alprimerasilabas' },
  { id:'alunesilabas', label:'Une las Sílabas', open:true, key:'alunesilabas' },
  { id:'alleepalabra', label:'Lee una Palabra', open:true, key:'alleepalabra' },
];
export const APRENDO_A_LEER_POS = [
  { x:22, y:90 }, { x:68, y:72 }, { x:24, y:54 }, { x:70, y:36 }, { x:22, y:16 },
];

import { pick, shuffle } from '../../utils.js';
import { personActionSVG, vasoAguaSVG } from '../../svg.js';

/* Núcleo Corporalidad y Movimiento — Educación Parvularia, NT (Decreto
   481/2017, ámbito Desarrollo Personal y Social,
   curriculumnacional.cl/614/articles-115244_bases.pdf):
   OA09 -> Ubicación Espacial + Antes y Después · OA04 -> Movimientos del Cuerpo.
   Texto literal de OA09: "Utilizar categorías de ubicación espacial y
   temporal, tales como: adelante/atrás/al lado/entre, día/noche, hoy/mañana,
   antes/durante/después, en situaciones cotidianas y lúdicas." Antes había
   un solo módulo "Ubicación y Tiempo" que solo cubría adelante/atrás/al
   lado/día/noche/hoy/mañana/ayer — le faltaban "entre" y "antes/durante/
   después", dos categorías que el OA sí nombra explícitamente. Se dividió en
   dos módulos (uno espacial, uno temporal) para poder cubrir las 4 + 8
   categorías completas sin amontonar 12 categorías en un solo juego de
   rounds:8.
   Quedan fuera: OA01-03, OA05-08 — son de práctica motriz real (cuidado
   corporal, conciencia del propio cuerpo, ejercitación, coordinación fina y
   gruesa, fuerza y equilibrio): requieren movimiento físico real, no son
   evaluables con una pregunta de opción múltiple en pantalla. */

export const CORPORALIDAD_MOVIMIENTO_MODULES = [
  { id:'ubicacionespacialnt', label:'Ubicación Espacial', open:true, key:'ubicacionespacialnt' },
  { id:'cuandoocurrent', label:'¿Cuándo Ocurre?', open:true, key:'cuandoocurrent' },
  { id:'movimientont', label:'Movimientos del Cuerpo', open:true, key:'movimientont' },
];
export const CORPORALIDAD_MOVIMIENTO_POS = [
  {x:22,y:82},{x:70,y:55},{x:30,y:22},
];

/* Cada escena trae su propio `pregunta` (para speakText) porque derivarlo de
   `texto.replace('___','')` producía oraciones rotas cuando el hueco iba
   pegado a una coma (p.ej. "Vamos al jardín ___, no mañana." → "Vamos al
   jardín , no mañana." al leerlo en voz alta). El perro y el osito además
   se reformularon: "camina ___ de su dueño" y "sentado ___ de la niña" eran
   ambiguos sin más contexto (adelante/atrás/al lado calzaban igual de bien
   gramaticalmente) — ahora cada oración trae un detalle que fuerza una sola
   lectura posible. La tortuga se cambió por un caracol para no contradecir
   la moraleja de "la tortuga y la liebre" (que los niños probablemente ya
   conocen) con una tortuga perdiendo una carrera. Dos escenas por categoría
   (8 escenas, 4 categorías) para que rounds:8 muestre variedad real dentro
   de "adelante"/"atrás"/"al lado" y no solo repita la misma frase. El vaso
   de agua usa vasoAguaSVG() en vez de 🥛 — ese emoji es literalmente "vaso
   de LECHE" (líquido opaco), mostraba el concepto equivocado para una
   escena que dice explícitamente "el vaso de agua". */
const ESCENAS_ESPACIAL_NT = [
  { emoji:'🐕', texto:'El perro camina ___ de su dueño, tirando de la correa.', correct:'ADELANTE', pregunta:'¿Dónde camina el perro?' },
  { emoji:'🏃', texto:'La niña corre ___ de sus amigos porque es la más rápida.', correct:'ADELANTE', pregunta:'¿Dónde corre la niña?' },
  { emoji:'🐌', texto:'El caracol quedó ___ en la carrera, porque es muy lento.', correct:'ATRÁS', pregunta:'¿Dónde quedó el caracol?' },
  { emoji:'🚶', texto:'El último niño de la fila quedó bien ___ de todos.', correct:'ATRÁS', pregunta:'¿Dónde quedó el último niño de la fila?' },
  { emoji:'🧸', texto:'El osito está sentado ___ de la niña, bien pegadito a ella.', correct:'AL LADO', pregunta:'¿Dónde está sentado el osito?' },
  { emoji: vasoAguaSVG(56), texto:'El vaso de agua está ___ del plato, sobre la mesa.', correct:'AL LADO', pregunta:'¿Dónde está el vaso de agua?' },
  { emoji:'🐈', texto:'El gato duerme ___ los dos cojines del sillón.', correct:'ENTRE', pregunta:'¿Dónde duerme el gato?' },
  { emoji:'⚽', texto:'La pelota rodó y quedó ___ las dos sillas.', correct:'ENTRE', pregunta:'¿Dónde quedó la pelota?' },
];
const ESPACIAL_OPTS_POOL = ['ADELANTE','ATRÁS','AL LADO','ENTRE'];

/* OA09 también nombra "antes/durante/después" como categoría temporal propia,
   distinta de "hoy/mañana" (que son días del calendario) — aquí se aplica a
   secuencias de una rutina cotidiana (lavarse las manos, escuchar un cuento,
   guardar los juguetes), no a un día de la semana. */
const ESCENAS_TEMPORAL_NT = [
  { emoji:'☀️', texto:'Jugamos en el patio durante el ___.', correct:'DÍA', pregunta:'¿Cuándo jugamos en el patio?' },
  { emoji:'🌙', texto:'Dormimos durante la ___.', correct:'NOCHE', pregunta:'¿Cuándo dormimos?' },
  { emoji:'📅', texto:'Vamos al jardín ___, no mañana.', correct:'HOY', pregunta:'¿Cuándo vamos al jardín?' },
  { emoji:'🌅', texto:'Si hoy es lunes, ___ será martes.', correct:'MAÑANA', pregunta:'Si hoy es lunes, ¿qué día será después?' },
  { emoji:'🔙', texto:'Fuimos al parque ___, no hoy.', correct:'AYER', pregunta:'¿Cuándo fuimos al parque?' },
  { emoji:'🧼', texto:'___ de comer, nos lavamos las manos.', correct:'ANTES', pregunta:'¿Cuándo nos lavamos las manos?' },
  { emoji:'📖', texto:'___ el cuento, escuchamos con atención y en silencio.', correct:'DURANTE', pregunta:'¿Cuándo escuchamos con atención?' },
  { emoji:'🧸', texto:'___ de jugar, guardamos los juguetes en su lugar.', correct:'DESPUÉS', pregunta:'¿Cuándo guardamos los juguetes?' },
];
const TEMPORAL_OPTS_POOL = ['DÍA','NOCHE','HOY','MAÑANA','AYER','ANTES','DURANTE','DESPUÉS'];

/* Cada acción usa personActionSVG() — una figura de palitos animada con CSS
   (ver @keyframes act-* en styles.css) — en vez de un emoji-metáfora
   (canguro para saltar, serpiente para reptar, símbolo de mareo para
   girar): a pedido explícito del usuario, se dibuja y anima la acción en
   sí en vez de reemplazarla por un ícono que solo la sugiere. */
const MOVIMIENTOS_BANK = [
  { accion:'SALTAR', emoji: personActionSVG('saltar', 100) },
  { accion:'CORRER', emoji: personActionSVG('correr', 100) },
  { accion:'CAMINAR', emoji: personActionSVG('caminar', 100) },
  { accion:'NADAR', emoji: personActionSVG('nadar', 100) },
  { accion:'BAILAR', emoji: personActionSVG('bailar', 100) },
  { accion:'TREPAR', emoji: personActionSVG('trepar', 100) },
  { accion:'REPTAR', emoji: personActionSVG('reptar', 100) },
  { accion:'GIRAR', emoji: personActionSVG('girar', 100) },
];

export function genUbicacionEspacialNTRound(){
  const item = pick(ESCENAS_ESPACIAL_NT);
  const distract = shuffle(ESPACIAL_OPTS_POOL.filter(function(p){ return p!==item.correct; })).slice(0,3);
  const opts = shuffle([item.correct].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto.replace('___','<span class="blank">___</span>')+'</p>',
    options: opts, correctValue: item.correct, speakText: item.pregunta, cols:4, kind:'word',
    explain: item.texto.replace('___', item.correct),
  };
}

export function genAntesDespuesNTRound(){
  const item = pick(ESCENAS_TEMPORAL_NT);
  const distract = shuffle(TEMPORAL_OPTS_POOL.filter(function(p){ return p!==item.correct; })).slice(0,3);
  const opts = shuffle([item.correct].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto.replace('___','<span class="blank">___</span>')+'</p>',
    options: opts, correctValue: item.correct, speakText: item.pregunta, cols:4, kind:'word',
    explain: item.texto.replace('___', item.correct),
  };
}

export function genMovimientoNTRound(){
  const item = pick(MOVIMIENTOS_BANK);
  const distract = shuffle(MOVIMIENTOS_BANK.filter(function(m){ return m.accion!==item.accion; })).slice(0,3).map(function(m){ return m.accion; });
  const opts = shuffle([item.accion].concat(distract)).map(function(a){ return {label:a, value:a}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué acción es esta?</p>',
    options: opts, correctValue: item.accion, speakText: '¿Qué acción es esta?', cols:4, kind:'word',
    explain: 'Esta acción es <b>'+item.accion.toLowerCase()+'</b>.',
  };
}

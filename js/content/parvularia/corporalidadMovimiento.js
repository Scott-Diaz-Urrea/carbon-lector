import { pick, shuffle } from '../../utils.js';
import { personActionSVG } from '../../svg.js';

/* Núcleo Corporalidad y Movimiento — Educación Parvularia, NT (Decreto
   481/2017, ámbito Desarrollo Personal y Social,
   curriculumnacional.cl/614/articles-115244_bases.pdf):
   OA09 -> Ubicación y Tiempo · OA04 -> Movimientos del Cuerpo.
   Quedan fuera: OA01-03, OA05-08 — son de práctica motriz real (cuidado
   corporal, conciencia del propio cuerpo, ejercitación, coordinación fina y
   gruesa, fuerza y equilibrio): requieren movimiento físico real, no son
   evaluables con una pregunta de opción múltiple en pantalla. */

export const CORPORALIDAD_MOVIMIENTO_MODULES = [
  { id:'ubicacionnt', label:'Ubicación y Tiempo', open:true, key:'ubicacionnt' },
  { id:'movimientont', label:'Movimientos del Cuerpo', open:true, key:'movimientont' },
];
export const CORPORALIDAD_MOVIMIENTO_POS = [
  {x:28,y:75},{x:68,y:30},
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
   conocen) con una tortuga perdiendo una carrera. AYER usa 🔙 en vez de 🌆
   (una escena de ciudad al atardecer no representa "ayer" ni encaja con la
   escena del parque descrita). */
const ESCENAS_UBICACION_NT = [
  { emoji:'🐕', texto:'El perro camina ___ de su dueño, tirando de la correa.', correct:'ADELANTE', pregunta:'¿Dónde camina el perro?' },
  { emoji:'🐌', texto:'El caracol quedó ___ en la carrera, porque es muy lento.', correct:'ATRÁS', pregunta:'¿Dónde quedó el caracol?' },
  { emoji:'🧸', texto:'El osito está sentado ___ de la niña, bien pegadito a ella.', correct:'AL LADO', pregunta:'¿Dónde está sentado el osito?' },
  { emoji:'☀️', texto:'Jugamos en el patio durante el ___.', correct:'DÍA', pregunta:'¿Cuándo jugamos en el patio?' },
  { emoji:'🌙', texto:'Dormimos durante la ___.', correct:'NOCHE', pregunta:'¿Cuándo dormimos?' },
  { emoji:'📅', texto:'Vamos al jardín ___, no mañana.', correct:'HOY', pregunta:'¿Cuándo vamos al jardín?' },
  { emoji:'🌅', texto:'Si hoy es lunes, ___ será martes.', correct:'MAÑANA', pregunta:'Si hoy es lunes, ¿qué día será después?' },
  { emoji:'🔙', texto:'Fuimos al parque ___, no hoy.', correct:'AYER', pregunta:'¿Cuándo fuimos al parque?' },
];
const UBICACION_OPTS_POOL = ['ADELANTE','ATRÁS','AL LADO','DÍA','NOCHE','HOY','MAÑANA','AYER'];

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

export function genUbicacionNTRound(){
  const item = pick(ESCENAS_UBICACION_NT);
  const distract = shuffle(UBICACION_OPTS_POOL.filter(function(p){ return p!==item.correct; })).slice(0,3);
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

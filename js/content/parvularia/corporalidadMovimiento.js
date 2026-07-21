import { pick, shuffle } from '../../utils.js';

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

const ESCENAS_UBICACION_NT = [
  { emoji:'🐕', texto:'El perro camina ___ de su dueño.', correct:'ADELANTE' },
  { emoji:'🐢', texto:'La tortuga quedó ___ en la carrera.', correct:'ATRÁS' },
  { emoji:'🧸', texto:'El osito está sentado ___ de la niña.', correct:'AL LADO' },
  { emoji:'☀️', texto:'Jugamos en el patio durante el ___.', correct:'DÍA' },
  { emoji:'🌙', texto:'Dormimos durante la ___.', correct:'NOCHE' },
  { emoji:'📅', texto:'Vamos al jardín ___, no mañana.', correct:'HOY' },
  { emoji:'🌅', texto:'Si hoy es lunes, ___ será martes.', correct:'MAÑANA' },
  { emoji:'🌆', texto:'Fuimos al parque ___, no hoy.', correct:'AYER' },
];
const UBICACION_OPTS_POOL = ['ADELANTE','ATRÁS','AL LADO','DÍA','NOCHE','HOY','MAÑANA','AYER'];

/* SALTAR usa 🦘 (canguro) en vez de un emoji de persona: no existe un emoji
   Unicode de "persona saltando" (🤸 es "voltereta/rueda", una acción
   distinta) — el canguro es una asociación pedagógica estándar para
   representar el salto, igual de clara para un niño de NT. REPTAR y GIRAR
   siguen el mismo criterio ya usado en otras asignaturas del proyecto
   (serpiente para reptar, símbolo de mareo/giro para girar) por la misma
   razón: no hay emoji de persona haciendo esa acción específica. */
const MOVIMIENTOS_BANK = [
  { accion:'SALTAR', emoji:'🦘' },
  { accion:'CORRER', emoji:'🏃' },
  { accion:'CAMINAR', emoji:'🚶' },
  { accion:'NADAR', emoji:'🏊' },
  { accion:'BAILAR', emoji:'💃' },
  { accion:'TREPAR', emoji:'🧗' },
  { accion:'REPTAR', emoji:'🐍' },
  { accion:'GIRAR', emoji:'💫' },
];

export function genUbicacionNTRound(){
  const item = pick(ESCENAS_UBICACION_NT);
  const distract = shuffle(UBICACION_OPTS_POOL.filter(function(p){ return p!==item.correct; })).slice(0,3);
  const opts = shuffle([item.correct].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto.replace('___','<span class="blank">___</span>')+'</p>',
    options: opts, correctValue: item.correct, speakText: item.texto.replace('___',''), cols:4, kind:'word',
    explain: 'La palabra correcta es <b>'+item.correct+'</b>.',
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

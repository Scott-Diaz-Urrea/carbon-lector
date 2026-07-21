import { pick, shuffle } from '../utils.js';

export const EDFISICA_MODULES = [
  {id:'movimiento', label:'Cuerpo en Movimiento', open:true, key:'movimiento'},
  {id:'vidaactiva', label:'Vida Activa y Saludable', open:true, key:'vidaactiva'},
  {id:'seguridad', label:'Juego Limpio y Seguridad', open:true, key:'seguridad'},
];
export const EDFISICA_POS = [{x:70,y:80},{x:24,y:50},{x:70,y:20}];

/* ---------------- Contenido Educación Física y Salud 1° Básico ----------------
   OA01-02 -> Cuerpo en Movimiento · OA06-09 -> Vida Activa y Saludable ·
   OA10-11 -> Juego Limpio y Seguridad. OA03-05 (variedad de juegos, entornos,
   expresión corporal) quedaron fuera por depender de práctica física real. */
const MOVIMIENTOS_ITEMS = [
  { emoji:'🏃', label:'CORRER', tipo:'LOCOMOCIÓN' },
  { emoji:'🤸', label:'SALTAR', tipo:'LOCOMOCIÓN' },
  { emoji:'🐍', label:'REPTAR (ARRASTRARSE)', tipo:'LOCOMOCIÓN' },
  { emoji:'🚶', label:'CAMINAR', tipo:'LOCOMOCIÓN' },
  { emoji:'🤾', label:'LANZAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji:'🧤', label:'ATRAPAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji:'⚽', label:'PATEAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji:'🦩', label:'MANTENER EL EQUILIBRIO EN UN PIE', tipo:'ESTABILIDAD' },
  { emoji:'💫', label:'GIRAR SOBRE SÍ MISMO', tipo:'ESTABILIDAD' },
  { emoji:'👣', label:'CAMINAR SOBRE UNA LÍNEA SIN CAERSE', tipo:'ESTABILIDAD' },
];
const VIDA_ACTIVA_ITEMS = [
  { emoji:'🏃', label:'Hacer actividad física seguido ayuda a mantener tu cuerpo sano', v:true },
  { emoji:'💓', label:'Cuando corres o saltas mucho, tu corazón late más rápido', v:true },
  { emoji:'😅', label:'Cuando haces mucho ejercicio, es normal transpirar (sudar)', v:true },
  { emoji:'🚿', label:'Después de hacer ejercicio y sudar, es bueno asearse', v:true },
  { emoji:'💧', label:'Tomar agua antes y después de moverte ayuda a tu cuerpo', v:true },
  { emoji:'😮‍💨', label:'Después de correr harto, es normal respirar más rápido y fuerte', v:true },
  { emoji:'🤾', label:'Jugar y moverse todos los días es parte de una vida sana', v:true },
  { emoji:'🛋️', label:'Quedarse todo el día sentado sin moverse es lo más sano', v:false },
  { emoji:'🥤', label:'Después de hacer ejercicio no es necesario tomar agua nunca', v:false },
  { emoji:'📴', label:'Es mejor ver pantallas todo el día que jugar y moverse', v:false },
];
const SEGURIDAD_ITEMS = [
  { emoji:'🤸', label:'Antes de hacer deporte, es bueno calentar el cuerpo con un juego suave', v:true },
  { emoji:'🪖', label:'Usar casco al andar en bicicleta o patines te protege de golpes', v:true },
  { emoji:'🤝', label:'Trabajar en equipo significa ayudarse y compartir roles con tus compañeros', v:true },
  { emoji:'🚫', label:'Empujar fuerte a un compañero durante un juego está bien', v:false },
  { emoji:'👟', label:'Usar las zapatillas bien amarradas evita caídas', v:true },
  { emoji:'😤', label:'Hacer trampa para ganar un juego es una buena forma de jugar', v:false },
  { emoji:'🙋', label:'Respetar el turno de los demás en un juego es parte del buen deportista', v:true },
  { emoji:'🩹', label:'Avisar a un adulto si te golpeas o te sientes mal jugando es lo correcto', v:true },
  { emoji:'😡', label:'Si pierdes un juego, está bien enojarte y gritarle a tus compañeros', v:false },
  { emoji:'🧢', label:'Usar ropa y protección adecuada según el deporte ayuda a evitar lesiones', v:true },
];

/* ---------------- Contenido Educación Física y Salud 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/educacion-fisica-salud/2-basico):
   EF02 OA08 -> Mi Cuerpo Responde · EF02 OA06,07,09 -> Vida Activa y
   Saludable II · EF02 OA10-11 -> Juego en Equipo y Liderazgo.
   Quedan fuera OA01-05 (habilidades motrices, juegos, entornos, expresión
   corporal) por depender de práctica física real. */
export const EDFISICA_MODULES_G2 = [
  {id:'cuerporesponde2', label:'Mi Cuerpo Responde', open:true, key:'cuerporesponde2'},
  {id:'vidaactiva2', label:'Vida Activa y Saludable II', open:true, key:'vidaactiva2'},
  {id:'liderazgo2', label:'Juego en Equipo y Liderazgo', open:true, key:'liderazgo2'},
];
export const EDFISICA_POS_G2 = [{x:70,y:80},{x:24,y:50},{x:70,y:20}];

const CUERPO_RESPONDE_ITEMS = [
  { emoji:'😅', label:'Cuando corres mucho, tu piel se pone más roja y transpiras', v:true },
  { emoji:'💨', label:'Después de correr fuerte, tu respiración se hace más rápida', v:true },
  { emoji:'😌', label:'Cuando haces mucho ejercicio, es normal sentirte cansado después', v:true },
  { emoji:'🗣️', label:'Cuando estás muy agitado por el ejercicio, cuesta más hablar seguido', v:true },
  { emoji:'🥶', label:'Después de ejercicio intenso tu cuerpo se enfría de inmediato sin sudar', v:false },
  { emoji:'😴', label:'Hacer ejercicio no cambia para nada tu ritmo de respiración', v:false },
];
const VIDA_ACTIVA_2_ITEMS = [
  { emoji:'🤸', label:'Hacer actividad física varias veces por semana es bueno para tu salud', v:true },
  { emoji:'🧼', label:'Lavarte las manos y la cara después de la clase de educación física es un buen hábito', v:true },
  { emoji:'🪑', label:'Mantener una postura correcta al sentarte cuida tu espalda', v:true },
  { emoji:'🥗', label:'Comer una colación saludable antes y después de hacer ejercicio te da energía', v:true },
  { emoji:'🚫', label:'No es necesario moverse ni hacer ejercicio durante la semana', v:false },
  { emoji:'🍬', label:'Comer solo dulces antes de hacer deporte es la mejor opción', v:false },
];
const LIDERAZGO_ITEMS = [
  { emoji:'🤝', label:'Respetar el rol que te toca en un juego de equipo (líder o ayudante) es importante', v:true },
  { emoji:'🧹', label:'Recoger los materiales después de usarlos es responsabilidad de todos', v:true },
  { emoji:'👂', label:'Escuchar y seguir las instrucciones del profesor mantiene la actividad segura', v:true },
  { emoji:'🚧', label:'Mantenerte dentro de los límites establecidos para el juego evita accidentes', v:true },
  { emoji:'😤', label:'Si te toca liderar, está bien no dejar participar a los demás', v:false },
  { emoji:'⚠️', label:'Usar los implementos deportivos sin supervisión cuando quieras es seguro', v:false },
];

export function genCuerpoResponde2Round(){
  const item = pick(CUERPO_RESPONDE_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genVidaActiva2Round(){
  const item = pick(VIDA_ACTIVA_2_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genLiderazgo2Round(){
  const item = pick(LIDERAZGO_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genMovimientoRound(){
  const item = pick(MOVIMIENTOS_ITEMS);
  const opts = shuffle(['LOCOMOCIÓN','MANIPULACIÓN','ESTABILIDAD']).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Qué tipo de movimiento es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:4, kind:'word',
    explain: item.label+' es un movimiento de <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genVidaActivaRound(){
  const item = pick(VIDA_ACTIVA_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genSeguridadRound(){
  const item = pick(SEGURIDAD_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

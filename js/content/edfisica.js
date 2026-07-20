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
  { emoji:'🧎', label:'REPTAR (ARRASTRARSE)', tipo:'LOCOMOCIÓN' },
  { emoji:'🚶', label:'CAMINAR', tipo:'LOCOMOCIÓN' },
  { emoji:'🤾', label:'LANZAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji:'🥅', label:'ATRAPAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji:'⚽', label:'PATEAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji:'🧘', label:'MANTENER EL EQUILIBRIO EN UN PIE', tipo:'ESTABILIDAD' },
  { emoji:'🤹', label:'GIRAR SOBRE SÍ MISMO', tipo:'ESTABILIDAD' },
  { emoji:'🤺', label:'CAMINAR SOBRE UNA LÍNEA SIN CAERSE', tipo:'ESTABILIDAD' },
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

import { pick, shuffle } from '../utils.js';
import { cascoSVG, personActionSVG } from '../svg.js';

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
/* Las 10 acciones antes usaban emoji-persona genéricos que no coinciden con
   el movimiento descrito: 🧎 muestra a alguien ARRODILLADO, no reptando;
   🥅 es un arco de fútbol, no la acción de atrapar; 🧘 es una postura de
   meditación sentada, no equilibrio de pie; 🤹 es hacer malabares, no girar;
   🤺 es esgrima, no caminar en línea recta. Se reemplazan todas por
   personActionSVG() — la misma figura de palitos animada que ya se usa en
   Corporalidad y Movimiento (Educación Parvularia) — extendiendo su set de
   acciones con 'lanzar', 'atrapar', 'patear' y 'equilibrio' (además de las
   8 que ya existían: saltar, correr, caminar, nadar, bailar, trepar,
   reptar, girar). "Caminar sobre una línea sin caerse" reusa la acción
   'equilibrio' porque ambas son, en esencia, la misma habilidad motriz de
   estabilidad. */
/* Ampliado de 10 a 12 ítems (coincidía exactamente con rounds:10, sin
   margen — ver mcEngine.js). TREPAR y NADAR ya existían como acciones de
   personActionSVG (reusadas de Corporalidad y Movimiento) pero no se
   habían usado todavía en este banco. */
const MOVIMIENTOS_ITEMS = [
  { emoji: personActionSVG('correr', 90), label:'CORRER', tipo:'LOCOMOCIÓN' },
  { emoji: personActionSVG('saltar', 90), label:'SALTAR', tipo:'LOCOMOCIÓN' },
  { emoji: personActionSVG('reptar', 90), label:'REPTAR (ARRASTRARSE)', tipo:'LOCOMOCIÓN' },
  { emoji: personActionSVG('caminar', 90), label:'CAMINAR', tipo:'LOCOMOCIÓN' },
  { emoji: personActionSVG('trepar', 90), label:'TREPAR UNA ESTRUCTURA', tipo:'LOCOMOCIÓN' },
  { emoji: personActionSVG('nadar', 90), label:'NADAR', tipo:'LOCOMOCIÓN' },
  { emoji: personActionSVG('lanzar', 90), label:'LANZAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji: personActionSVG('atrapar', 90), label:'ATRAPAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji: personActionSVG('patear', 90), label:'PATEAR UNA PELOTA', tipo:'MANIPULACIÓN' },
  { emoji: personActionSVG('equilibrio', 90), label:'MANTENER EL EQUILIBRIO EN UN PIE', tipo:'ESTABILIDAD' },
  { emoji: personActionSVG('girar', 90), label:'GIRAR SOBRE SÍ MISMO', tipo:'ESTABILIDAD' },
  { emoji: personActionSVG('equilibrio', 90), label:'CAMINAR SOBRE UNA LÍNEA SIN CAERSE', tipo:'ESTABILIDAD' },
];
/* Ampliado de 10 a 12 ítems (mismo motivo que arriba). */
const VIDA_ACTIVA_ITEMS = [
  { emoji:'🏃', label:'Hacer actividad física seguido ayuda a mantener tu cuerpo sano', v:true },
  { emoji:'💓', label:'Cuando corres o saltas mucho, tu corazón late más rápido', v:true },
  { emoji:'😅', label:'Cuando haces mucho ejercicio, es normal transpirar (sudar)', v:true },
  { emoji:'🚿', label:'Después de hacer ejercicio y sudar, es bueno asearse', v:true },
  { emoji:'💧', label:'Tomar agua antes y después de moverte ayuda a tu cuerpo', v:true },
  { emoji:'😮‍💨', label:'Después de correr harto, es normal respirar más rápido y fuerte', v:true },
  { emoji:'🤾', label:'Jugar y moverse todos los días es parte de una vida sana', v:true },
  { emoji:'🍎', label:'Comer frutas y verduras variadas te da energía para jugar', v:true },
  { emoji:'🛋️', label:'Quedarse todo el día sentado sin moverse es lo más sano', v:false },
  { emoji:'🥤', label:'Después de hacer ejercicio no es necesario tomar agua nunca', v:false },
  { emoji:'📴', label:'Es mejor ver pantallas todo el día que jugar y moverse', v:false },
  { emoji:'😪', label:'Da lo mismo dormir poco o dormir bien, tu cuerpo no lo nota', v:false },
];
/* "Usar casco" usaba el emoji 🪖 crudo — un casco MILITAR, no de
   bicicleta/patines (mismo error ya corregido en comprensionEntornoSociocultural.js
   con cascoSVG(), que aquí se importaba pero nunca se llegó a usar). Además
   ampliado de 10 a 12 ítems (coincidía exactamente con rounds:10, sin
   margen — ver mcEngine.js). */
const SEGURIDAD_ITEMS = [
  { emoji:'🤸', label:'Antes de hacer deporte, es bueno calentar el cuerpo con un juego suave', v:true },
  { emoji: cascoSVG(30), label:'Usar casco al andar en bicicleta o patines te protege de golpes', v:true },
  { emoji:'🤝', label:'Trabajar en equipo significa ayudarse y compartir roles con tus compañeros', v:true },
  { emoji:'🚫', label:'Empujar fuerte a un compañero durante un juego está bien', v:false },
  { emoji:'👟', label:'Usar las zapatillas bien amarradas evita caídas', v:true },
  { emoji:'😤', label:'Hacer trampa para ganar un juego es una buena forma de jugar', v:false },
  { emoji:'🙋', label:'Respetar el turno de los demás en un juego es parte del buen deportista', v:true },
  { emoji:'🩹', label:'Avisar a un adulto si te golpeas o te sientes mal jugando es lo correcto', v:true },
  { emoji:'😡', label:'Si pierdes un juego, está bien enojarte y gritarle a tus compañeros', v:false },
  { emoji:'🧢', label:'Usar ropa y protección adecuada según el deporte ayuda a evitar lesiones', v:true },
  { emoji:'🎽', label:'Usar la ropa deportiva adecuada para cada actividad ayuda a jugar seguro', v:true },
  { emoji:'😤', label:'Presionar a un compañero para que juegue si no quiere está bien', v:false },
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

/* Los 3 bancos de esta sección se ampliaron de 6 a 12 ítems cada uno (antes
   garantizaban una repetición en cada partida de rounds:10 — detectado
   simulando sesiones completas con la misma lógica anti-repetición del
   motor). Mismo estilo y nivel de riesgo que los ítems ya existentes
   (afirmaciones de sentido común sobre el cuerpo/hábitos/trabajo en
   equipo, no datos que requieran una fuente externa). */
const CUERPO_RESPONDE_ITEMS = [
  { emoji:'😅', label:'Cuando corres mucho, tu piel se pone más roja y transpiras', v:true },
  { emoji:'💨', label:'Después de correr fuerte, tu respiración se hace más rápida', v:true },
  { emoji:'😌', label:'Cuando haces mucho ejercicio, es normal sentirte cansado después', v:true },
  { emoji:'🗣️', label:'Cuando estás muy agitado por el ejercicio, cuesta más hablar seguido', v:true },
  { emoji:'❤️', label:'Tu corazón late más rápido mientras haces ejercicio intenso', v:true },
  { emoji:'🥵', label:'Hacer ejercicio en un día caluroso te hace transpirar más de lo normal', v:true },
  { emoji:'💪', label:'Con la práctica constante, tus músculos se hacen más fuertes', v:true },
  { emoji:'🥛', label:'Tomar agua después de hacer ejercicio ayuda a tu cuerpo a recuperarse', v:true },
  { emoji:'🥶', label:'Después de ejercicio intenso tu cuerpo se enfría de inmediato sin sudar', v:false },
  { emoji:'😴', label:'Hacer ejercicio no cambia para nada tu ritmo de respiración', v:false },
  { emoji:'🐌', label:'Tu corazón late más lento mientras corres a toda velocidad', v:false },
  { emoji:'🚫', label:'Da lo mismo hacer ejercicio o quedarte quieto, tu cuerpo reacciona igual', v:false },
];
const VIDA_ACTIVA_2_ITEMS = [
  { emoji:'🤸', label:'Hacer actividad física varias veces por semana es bueno para tu salud', v:true },
  { emoji:'🧼', label:'Lavarte las manos y la cara después de la clase de educación física es un buen hábito', v:true },
  { emoji:'🪑', label:'Mantener una postura correcta al sentarte cuida tu espalda', v:true },
  { emoji:'🥗', label:'Comer una colación saludable antes y después de hacer ejercicio te da energía', v:true },
  { emoji:'😴', label:'Dormir suficientes horas ayuda a que tu cuerpo se recupere del ejercicio', v:true },
  { emoji:'👕', label:'Usar ropa cómoda y adecuada ayuda a moverte mejor al hacer deporte', v:true },
  { emoji:'💧', label:'Tomar agua durante el día es parte de mantener una vida activa y sana', v:true },
  { emoji:'🌳', label:'Jugar al aire libre es una buena forma de mantenerte activo', v:true },
  { emoji:'🚫', label:'No es necesario moverse ni hacer ejercicio durante la semana', v:false },
  { emoji:'🍬', label:'Comer solo dulces antes de hacer deporte es la mejor opción', v:false },
  { emoji:'📱', label:'Pasar todo el día sentado viendo pantallas es más sano que jugar afuera', v:false },
  { emoji:'🛌', label:'Dormir muy poco no afecta en nada tu energía para hacer deporte', v:false },
];
const LIDERAZGO_ITEMS = [
  { emoji:'🤝', label:'Respetar el rol que te toca en un juego de equipo (líder o ayudante) es importante', v:true },
  { emoji:'🧹', label:'Recoger los materiales después de usarlos es responsabilidad de todos', v:true },
  { emoji:'👂', label:'Escuchar y seguir las instrucciones del profesor mantiene la actividad segura', v:true },
  { emoji:'🚧', label:'Mantenerte dentro de los límites establecidos para el juego evita accidentes', v:true },
  { emoji:'🙋', label:'Animar a un compañero que le está costando es parte de un buen equipo', v:true },
  { emoji:'🔄', label:'Turnarse para liderar le da a todos la oportunidad de participar', v:true },
  { emoji:'🎯', label:'Explicar bien las reglas del juego ayuda a que todos jueguen mejor', v:true },
  { emoji:'🫱', label:'Ayudar a un compañero a entender una instrucción es un gesto de buen líder', v:true },
  { emoji:'😤', label:'Si te toca liderar, está bien no dejar participar a los demás', v:false },
  { emoji:'⚠️', label:'Usar los implementos deportivos sin supervisión cuando quieras es seguro', v:false },
  { emoji:'😠', label:'Gritarle a tu equipo cuando pierden es una buena forma de liderar', v:false },
  { emoji:'🙅', label:'Ignorar las instrucciones del profesor durante el juego no tiene riesgo', v:false },
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

/* ---------------- Contenido Educación Física y Salud 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/educacion-fisica-salud/3-basico):
   Vida Activa III -> OA06-09 (actividad física regular, respuestas
   corporales, hábitos de higiene y vida saludable). Juego Limpio y
   Seguridad III -> OA10-11 (honestidad, reglas, comportamientos seguros).
   Quedan fuera OA01-05 (habilidades motrices combinadas, juegos
   predeportivos, danzas, actividades en distintos entornos) por depender
   de práctica física real. */
export const EDFISICA_MODULES_G3 = [
  {id:'vidaactiva3', label:'Vida Activa y Saludable III', open:true, key:'vidaactiva3'},
  {id:'seguridad3', label:'Juego Limpio y Seguridad III', open:true, key:'seguridad3'},
];
export const EDFISICA_POS_G3 = [{x:30,y:70},{x:70,y:30}];

const VIDA_ACTIVA_3_ITEMS = [
  { label:'Practicar actividad física de manera regular, no solo de vez en cuando, mejora tu condición física', v:true },
  { label:'Tu cuerpo necesita más oxígeno cuando haces ejercicio intenso, por eso respiras más rápido', v:true },
  { label:'Mantener hábitos de higiene después de hacer deporte, como ducharte, es parte de una vida saludable', v:true },
  { label:'Registrar cómo reacciona tu cuerpo al ejercicio (pulso, respiración) ayuda a entender tus propios límites', v:true },
  { label:'Elegir posturas correctas al sentarte o pararte cuida tu columna a largo plazo', v:true },
  { label:'Practicar deporte una sola vez al año es suficiente para mantenerte en buena condición física', v:false },
  { label:'No importa cómo reacciona tu cuerpo al ejercicio, nunca hay que prestarle atención', v:false },
  { label:'Es buena idea saltarse la ducha después de sudar mucho haciendo deporte', v:false },
];
const SEGURIDAD_3_ITEMS = [
  { label:'Cumplir las reglas de un juego colectivo, incluso cuando estás perdiendo, es parte del juego limpio', v:true },
  { label:'Ser honesto sobre una falta que cometiste durante un juego es parte de la buena deportividad', v:true },
  { label:'Revisar que el lugar donde vas a jugar esté seguro y despejado antes de empezar es una buena práctica', v:true },
  { label:'Usar la ropa y protección adecuada para cada actividad física ayuda a evitar lesiones', v:true },
  { label:'Avisar a un adulto si te lesionas o ves que un compañero se lesiona es lo correcto', v:true },
  { label:'Hacer trampa para ganar un juego está bien si nadie se da cuenta', v:false },
  { label:'Cambiar las reglas del juego a mitad de camino, solo para ganar tú, es justo', v:false },
  { label:'No es necesario avisar a nadie si un compañero se golpea jugando', v:false },
];

export function genVidaActiva3Round(){
  const item = pick(VIDA_ACTIVA_3_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genSeguridad3Round(){
  const item = pick(SEGURIDAD_3_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

/* ---------------- Contenido Educación Física y Salud 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/educacion-fisica-salud/4-basico):
   Condición Física y Pulso -> OA06,08 (los 4 componentes de la condición
   física — resistencia cardiovascular, fuerza, flexibilidad, velocidad — y
   medir el pulso, un ángulo nuevo respecto a 3° básico). Seguridad y Juego
   Limpio IV -> OA09-11 (higiene, hábitos posturales, responsabilidad,
   honestidad, comportamientos seguros). Quedan fuera OA01-05 (habilidades
   motrices, juegos colectivos, danzas, entornos) por depender de práctica
   física real. */
export const EDFISICA_MODULES_G4 = [
  {id:'condicionfisica4', label:'Condición Física y Pulso', open:true, key:'condicionfisica4'},
  {id:'seguridad4', label:'Seguridad y Juego Limpio IV', open:true, key:'seguridad4'},
];
export const EDFISICA_POS_G4 = [{x:30,y:70},{x:70,y:30}];

const COMPONENTES_FISICOS_BANK = [
  { actividad:'Correr una larga distancia sin parar', componente:'RESISTENCIA CARDIOVASCULAR' },
  { actividad:'Trotar 20 minutos seguidos', componente:'RESISTENCIA CARDIOVASCULAR' },
  { actividad:'Levantar un objeto pesado', componente:'FUERZA' },
  { actividad:'Hacer flexiones de brazos', componente:'FUERZA' },
  { actividad:'Tocarse los dedos de los pies sin doblar las rodillas', componente:'FLEXIBILIDAD' },
  { actividad:'Hacer estiramientos antes de entrenar', componente:'FLEXIBILIDAD' },
  { actividad:'Correr los 50 metros lo más rápido posible', componente:'VELOCIDAD' },
  { actividad:'Hacer una carrera corta a máxima velocidad', componente:'VELOCIDAD' },
];
const PULSO_BANK = [
  { pregunta:'¿Qué pasa con tu pulso (los latidos del corazón) cuando haces ejercicio intenso?', correcta:'Aumenta, late más rápido', opts:['Disminuye','No cambia','Se detiene'] },
  { pregunta:'¿Dónde puedes sentir tu pulso fácilmente con los dedos?', correcta:'En la muñeca o el cuello', opts:['En los pies','En las orejas','En el pelo'] },
  { pregunta:'¿Por qué es útil medir tu pulso antes y después de hacer ejercicio?', correcta:'Para saber cómo responde tu cuerpo a la actividad física', opts:['Para saber qué hora es','Para saber cuánto pesas','Para saber qué comer'] },
];
const SEGURIDAD_4_ITEMS = [
  { label:'Cumplir con el rol que te asignan en un juego colectivo es parte de la responsabilidad deportiva', v:true },
  { label:'Respetar las reglas del juego, incluso cuando nadie te está mirando, es jugar limpio', v:true },
  { label:'Conocer bien el espacio donde te mueves es parte de practicar actividad física de forma segura', v:true },
  { label:'Usar la ropa y el calzado adecuado para cada actividad reduce el riesgo de lesiones', v:true },
  { label:'Avisar si te sientes mal o lesionado durante una actividad física es lo correcto', v:true },
  { label:'No importa dejar de seguir las reglas de un juego si quieres ganar a toda costa', v:false },
  { label:'Ignorar el rol que te asignaron en un juego de equipo no tiene ninguna consecuencia', v:false },
  { label:'Jugar en un espacio con objetos peligrosos sin avisarle a nadie es seguro', v:false },
];

export function genCondicionFisica4Round(){
  if(Math.random()<0.7){
    const item = pick(COMPONENTES_FISICOS_BANK);
    const distract = shuffle(['RESISTENCIA CARDIOVASCULAR','FUERZA','FLEXIBILIDAD','VELOCIDAD'].filter(function(c){ return c!==item.componente; }));
    const opts = shuffle([item.componente].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.actividad+'.</p><p class="prompt-hint">¿Qué componente de la condición física se está trabajando?</p>',
      options: opts, correctValue: item.componente, speakText: item.actividad, cols:2, kind:'word',
      explain: 'Esa actividad trabaja principalmente la <b>'+item.componente.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PULSO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

export function genSeguridad4Round(){
  const item = pick(SEGURIDAD_4_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

/* ---------------- Contenido Educación Física y Salud 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/educacion-fisica-salud/5-basico):
   Vida Activa y Postura V -> OA06-09 (intensidad del ejercicio, planificar
   actividad física regular, medir el esfuerzo con el pulso o escalas, y
   hábitos de higiene y posturales — ángulos nuevos respecto a 4° básico,
   que cubrió los 4 componentes de la condición física y solo la medición
   del pulso). Liderazgo y Seguridad V -> OA10-11 (responsabilidad,
   liderazgo, respeto y comportamientos seguros, con escenarios nuevos).
   Quedan fuera OA01-05 (habilidades motrices, juegos colectivos, deportes,
   entornos, danza nacional) por depender de práctica física real. */
export const EDFISICA_MODULES_G5 = [
  {id:'vidapostura5', label:'Vida Activa y Postura V', open:true, key:'vidapostura5'},
  {id:'liderazgo5', label:'Liderazgo y Seguridad V', open:true, key:'liderazgo5'},
];
export const EDFISICA_POS_G5 = [{x:30,y:70},{x:70,y:30}];

const INTENSIDAD_ACTIVIDAD_BANK = [
  { actividad:'Caminar tranquilamente hasta la casa de un vecino', intensidad:'BAJA' },
  { actividad:'Quedarse sentado leyendo un libro', intensidad:'BAJA' },
  { actividad:'Trotar suave durante 15 minutos', intensidad:'MODERADA' },
  { actividad:'Andar en bicicleta a paso constante', intensidad:'MODERADA' },
  { actividad:'Correr a máxima velocidad en una carrera', intensidad:'ALTA' },
  { actividad:'Jugar un partido de fútbol completo sin parar', intensidad:'ALTA' },
];
const PLANIFICACION_POSTURA_BANK = [
  { label:'Planificar hacer actividad física varias veces por semana ayuda a mantener un cuerpo sano', v:true },
  { label:'Hacer ejercicio solo una vez al año es suficiente para mantenerse en buena condición física', v:false },
  { label:'Sentarse con la espalda encorvada por muchas horas seguidas es una buena postura', v:false },
  { label:'Cargar la mochila del colegio con las dos correas sobre ambos hombros cuida tu espalda', v:true },
  { label:'Mantener la espalda derecha al sentarse ayuda a cuidar tu postura', v:true },
  { label:'No importa la postura que tengas al estudiar o ver una pantalla', v:false },
  { label:'Medir tu esfuerzo físico con el pulso o con una escala te ayuda a saber qué tan intenso fue el ejercicio', v:true },
];
export function genVidaPostura5Round(){
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(INTENSIDAD_ACTIVIDAD_BANK);
    const todos = ['BAJA','MODERADA','ALTA'];
    const distract = todos.filter(function(t){ return t!==item.intensidad; });
    const opts = shuffle([item.intensidad].concat(distract)).map(function(i){ return {label:'INTENSIDAD '+i, value:i}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.actividad+'.</p><p class="prompt-hint">¿Qué intensidad de esfuerzo físico tiene esta actividad?</p>',
      options: opts, correctValue: item.intensidad, speakText: item.actividad, cols:2, panel:true,
      explain: 'Esta actividad tiene una intensidad <b>'+item.intensidad.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PLANIFICACION_POSTURA_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

const LIDERAZGO_SEGURIDAD5_ITEMS = [
  { label:'Asumir el rol de capitán de un equipo implica organizar y motivar a tus compañeros con respeto', v:true },
  { label:'Un buen líder de equipo escucha las ideas de sus compañeros antes de decidir', v:true },
  { label:'Ignorar por completo la opinión de tus compañeros de equipo es una forma de buen liderazgo', v:false },
  { label:'Revisar que el espacio de juego esté libre de peligros antes de empezar es una conducta segura', v:true },
  { label:'Usar los implementos deportivos (conos, pelotas, colchonetas) de forma responsable evita accidentes', v:true },
  { label:'Presionar a un compañero para que juegue lesionado es un comportamiento seguro', v:false },
  { label:'Aceptar las decisiones del árbitro o profesor, incluso cuando no te gustan, es jugar limpio', v:true },
  { label:'Da lo mismo seguir o no las normas de seguridad si el juego se pone competitivo', v:false },
];
export function genLiderazgo5Round(){
  const item = pick(LIDERAZGO_SEGURIDAD5_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

/* ---------------- Contenido Educación Física y Salud 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/educacion-fisica-salud/6-basico): OA06-11 repiten textualmente
   la misma redacción que EF05 OA06-11, así que ambos módulos usan escenarios
   y afirmaciones completamente nuevos en vez de duplicar contenido.
   Vida Activa y Postura VI -> OA06-09. Liderazgo y Seguridad VI -> OA10-11.
   Quedan fuera OA01-05 (habilidades motrices, juegos colectivos, deportes,
   entornos, danza nacional) por depender de práctica física real. */
export const EDFISICA_MODULES_G6 = [
  {id:'vidapostura6', label:'Vida Activa y Postura VI', open:true, key:'vidapostura6'},
  {id:'liderazgo6', label:'Liderazgo y Seguridad VI', open:true, key:'liderazgo6'},
];
export const EDFISICA_POS_G6 = [{x:30,y:70},{x:70,y:30}];

const INTENSIDAD_ACTIVIDAD6_BANK = [
  { actividad:'Ver una película sentado en el sillón', intensidad:'BAJA' },
  { actividad:'Hacer las tareas del colegio sentado en el escritorio', intensidad:'BAJA' },
  { actividad:'Bailar a un ritmo constante durante 20 minutos', intensidad:'MODERADA' },
  { actividad:'Nadar a un ritmo tranquilo en la piscina', intensidad:'MODERADA' },
  { actividad:'Correr una carrera de velocidad a máximo esfuerzo', intensidad:'ALTA' },
  { actividad:'Jugar un partido completo de básquetbol sin parar', intensidad:'ALTA' },
];
const HABITOS_VI_BANK = [
  { label:'Planificar un horario semanal con tiempo para actividad física ayuda a mantener una vida activa', v:true },
  { label:'No es necesario planificar nunca cuándo hacer ejercicio, se puede improvisar siempre sin ningún horario', v:false },
  { label:'Mantener una buena postura al usar el celular o la tablet, sin encorvar el cuello, cuida tu columna', v:true },
  { label:'Da lo mismo la postura que tengas al usar dispositivos electrónicos por horas', v:false },
  { label:'Ducharse y cambiar de ropa después de hacer ejercicio es un buen hábito de higiene', v:true },
  { label:'Medir tu esfuerzo con el pulso te ayuda a saber si tu actividad física fue de intensidad baja, moderada o alta', v:true },
  { label:'Es imposible saber si un ejercicio fue intenso o no, no existe ninguna forma de medirlo', v:false },
];
export function genVidaPostura6Round(){
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(INTENSIDAD_ACTIVIDAD6_BANK);
    const todos = ['BAJA','MODERADA','ALTA'];
    const distract = todos.filter(function(t){ return t!==item.intensidad; });
    const opts = shuffle([item.intensidad].concat(distract)).map(function(i){ return {label:'INTENSIDAD '+i, value:i}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.actividad+'.</p><p class="prompt-hint">¿Qué intensidad de esfuerzo físico tiene esta actividad?</p>',
      options: opts, correctValue: item.intensidad, speakText: item.actividad, cols:2, panel:true,
      explain: 'Esta actividad tiene una intensidad <b>'+item.intensidad.toLowerCase()+'</b>.',
    };
  }
  const item = pick(HABITOS_VI_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

const LIDERAZGO_SEGURIDAD6_ITEMS = [
  { label:'Motivar a un compañero desanimado durante un partido es una muestra de buen liderazgo', v:true },
  { label:'Un buen capitán reparte los roles del equipo considerando las fortalezas de cada integrante', v:true },
  { label:'Gritarle a un compañero por cometer un error es una forma aceptable de liderar un equipo', v:false },
  { label:'Guardar correctamente los materiales deportivos al terminar la actividad evita accidentes futuros', v:true },
  { label:'Revisar el estado de una pelota o una red antes de usarla es parte de un comportamiento seguro', v:true },
  { label:'Jugar de forma imprudente para impresionar a los demás es un comportamiento seguro', v:false },
  { label:'Reconocer cuando un rival juega mejor, sin dejar de esforzarte, es parte del juego limpio', v:true },
  { label:'Hacer trampa para ganar un juego es una forma válida de liderazgo', v:false },
];
export function genLiderazgo6Round(){
  const item = pick(LIDERAZGO_SEGURIDAD6_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

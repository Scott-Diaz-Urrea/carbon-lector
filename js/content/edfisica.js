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
  { emoji: personActionSVG('correr', 90), label:'Correr', tipo:'Locomoción' },
  { emoji: personActionSVG('saltar', 90), label:'Saltar', tipo:'Locomoción' },
  { emoji: personActionSVG('reptar', 90), label:'Reptar (arrastrarse)', tipo:'Locomoción' },
  { emoji: personActionSVG('caminar', 90), label:'Caminar', tipo:'Locomoción' },
  { emoji: personActionSVG('trepar', 90), label:'Trepar una estructura', tipo:'Locomoción' },
  { emoji: personActionSVG('nadar', 90), label:'Nadar', tipo:'Locomoción' },
  { emoji: personActionSVG('lanzar', 90), label:'Lanzar una pelota', tipo:'Manipulación' },
  { emoji: personActionSVG('atrapar', 90), label:'Atrapar una pelota', tipo:'Manipulación' },
  { emoji: personActionSVG('patear', 90), label:'Patear una pelota', tipo:'Manipulación' },
  { emoji: personActionSVG('equilibrio', 90), label:'Mantener el equilibrio en un pie', tipo:'Estabilidad' },
  { emoji: personActionSVG('girar', 90), label:'Girar sobre sí mismo', tipo:'Estabilidad' },
  { emoji: personActionSVG('equilibrio', 90), label:'Caminar sobre una línea sin caerse', tipo:'Estabilidad' },
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
  { emoji:'😡', label:'Si pierdes un juego, gritarle a tus compañeros por eso es una buena forma de reaccionar', v:false },
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
  const recurso = 'Cuando haces ejercicio, tu cuerpo reacciona de formas que puedes notar directamente: el corazón late más rápido (para bombear más sangre a los músculos que están trabajando), respiras más rápido y más profundo (para llevar más oxígeno a tu cuerpo), y puedes empezar a sudar (para enfriarte). Estas respuestas no son señales de que algo anda mal — son la forma en que tu cuerpo se adapta para darte la energía que necesitas mientras te mueves. Reconocer estas respuestas normales del cuerpo te ayuda a entender por qué es importante calentar antes de hacer deporte, y a distinguir un cansancio normal de una señal de alerta real.';
  const item = pick(CUERPO_RESPONDE_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genVidaActiva2Round(){
  const recurso = 'Mantener una vida activa y saludable en 2° básico significa seguir combinando hábitos de movimiento regular, buena alimentación, descanso suficiente e higiene diaria — los mismos pilares de 1° básico, pero ahora con más autonomía para practicarlos tú solo, sin que un adulto tenga que recordártelo siempre. Entre más temprano se forman estos hábitos, más fácil es mantenerlos de forma natural cuando seas grande, porque se vuelven parte de tu rutina normal en vez de sentirse como una obligación.';
  const item = pick(VIDA_ACTIVA_2_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genLiderazgo2Round(){
  const recurso = 'Jugar en equipo requiere algo más que solo saber jugar bien: requiere <b>liderazgo</b> positivo, que significa animar a tus compañeros, escuchar las ideas de los demás, y ayudar a resolver desacuerdos sin gritar ni pelear. Un buen líder de equipo no es necesariamente el que juega mejor, sino el que ayuda a que todo el grupo trabaje unido y se sienta incluido. Practicar estas habilidades desde pequeño —en un juego de patio— te prepara para trabajar bien en equipo en muchas otras situaciones de tu vida, no solo en el deporte.';
  const item = pick(LIDERAZGO_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genMovimientoRound(){
  const recurso = 'Los movimientos del cuerpo se agrupan en 3 categorías: <b>locomoción</b> son los que te trasladan de un lugar a otro (caminar, correr, saltar); <b>manipulación</b> son los que usas para controlar un objeto (lanzar, atrapar, patear una pelota); y <b>estabilidad</b> son los que mantienen tu equilibrio sin moverte del lugar (pararse en un pie, girar). Reconocer estas 3 categorías te ayuda a entender que tu cuerpo puede hacer muchos tipos de movimiento distintos, y que cada deporte o juego combina varios de ellos — por ejemplo, jugar fútbol usa locomoción (correr) y manipulación (patear) al mismo tiempo.';
  const item = pick(MOVIMIENTOS_ITEMS);
  const opts = shuffle(['Locomoción','Manipulación','Estabilidad']).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Qué tipo de movimiento es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:4, kind:'word',
    explain: item.label+' es un movimiento de <b>'+item.tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genVidaActivaRound(){
  const recurso = 'Llevar una <b>vida activa y saludable</b> significa combinar varios hábitos todos los días: moverte y hacer actividad física con regularidad (no solo una vez a la semana), comer alimentos variados y nutritivos, dormir las horas que tu cuerpo necesita para descansar, y mantener una buena higiene (lavarte las manos, los dientes, bañarte). Ningún hábito por sí solo es suficiente — es la combinación de todos ellos, mantenida en el tiempo, la que realmente cuida tu salud y te da energía para jugar, aprender y crecer bien.';
  const item = pick(VIDA_ACTIVA_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genSeguridadRound(){
  const recurso = 'El <b>juego limpio</b> significa seguir las reglas del juego incluso cuando nadie te está mirando, respetar a tus compañeros y aceptar los resultados sin hacer trampa. La <b>seguridad</b> al jugar o hacer deporte significa cuidar tu cuerpo y el de los demás: usar el equipo de protección adecuado (como un casco), jugar en espacios seguros, y avisar a un adulto si algo se ve peligroso. Estas dos ideas van juntas porque un juego solo es realmente divertido para todos cuando se juega con honestidad y sin que nadie salga lastimado.';
  const item = pick(SEGURIDAD_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
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
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'Llevar una vida activa y saludable en 3° básico significa entender por qué te conviene moverte con regularidad, no solo hacerlo porque te lo piden: la actividad física fortalece tu corazón y tus músculos, mejora tu ánimo, y ayuda a que duermas mejor en la noche. Combinada con buenos hábitos de higiene (lavarte, dormir suficiente, comer variado), la actividad física regular es uno de los pilares más importantes para mantenerte sano a lo largo de toda tu vida, no solo mientras eres niño.',
  };
}

export function genSeguridad3Round(){
  const item = pick(SEGURIDAD_3_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'El "juego limpio" en el deporte significa jugar con honestidad: seguir las reglas incluso cuando vas perdiendo, admitir tus propias faltas, y no hacer trampa aunque nadie te vea — hacer trampa "porque nadie se da cuenta" sigue siendo trampa, y arruina el sentido del juego para todos. La seguridad, por su parte, significa revisar el espacio antes de jugar, usar la ropa y protección adecuada, y avisar a un adulto si alguien se lesiona. Practicar el deporte con honestidad y cuidado es lo que realmente hace que el juego sea disfrutable y seguro para todos los que participan.',
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
  { actividad:'Correr una larga distancia sin parar', componente:'Resistencia cardiovascular' },
  { actividad:'Trotar 20 minutos seguidos', componente:'Resistencia cardiovascular' },
  { actividad:'Levantar un objeto pesado', componente:'Fuerza' },
  { actividad:'Hacer flexiones de brazos', componente:'Fuerza' },
  { actividad:'Tocarse los dedos de los pies sin doblar las rodillas', componente:'Flexibilidad' },
  { actividad:'Hacer estiramientos antes de entrenar', componente:'Flexibilidad' },
  { actividad:'Correr los 50 metros lo más rápido posible', componente:'Velocidad' },
  { actividad:'Hacer una carrera corta a máxima velocidad', componente:'Velocidad' },
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
  const recurso = 'La <b>condición física</b> tiene 4 componentes principales: la resistencia cardiovascular (la capacidad de mantener un esfuerzo por un tiempo largo, como correr sin parar), la fuerza (la capacidad de levantar o mover objetos pesados), la flexibilidad (qué tan bien se estiran tus músculos y articulaciones) y la velocidad (qué tan rápido puedes moverte en un tramo corto). El <b>pulso</b> es la cantidad de veces que late tu corazón por minuto, y se puede sentir fácilmente con los dedos en la muñeca o el cuello; medirlo antes y después de hacer ejercicio te muestra cómo responde tu cuerpo al esfuerzo — el pulso aumenta durante el ejercicio intenso porque el corazón trabaja más rápido para llevar oxígeno a los músculos.';
  if(Math.random()<0.7){
    const item = pick(COMPONENTES_FISICOS_BANK);
    const distract = shuffle(['Resistencia cardiovascular','Fuerza','Flexibilidad','Velocidad'].filter(function(c){ return c!==item.componente; }));
    const opts = shuffle([item.componente].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.actividad+'.</p><p class="prompt-hint">¿Qué componente de la condición física se está trabajando?</p>',
      options: opts, correctValue: item.componente, speakText: item.actividad, cols:2, kind:'word',
      explain: 'Esa actividad trabaja principalmente la <b>'+item.componente.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(PULSO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
    recurso: recurso,
  };
}

export function genSeguridad4Round(){
  const item = pick(SEGURIDAD_4_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'Jugar limpio significa respetar las reglas de un juego incluso cuando nadie te está mirando, y cumplir con el rol que te asignan dentro de un equipo, porque cada jugador depende de que los demás hagan su parte. La <b>seguridad</b> al hacer actividad física incluye conocer bien el espacio donde te mueves, usar la ropa y el calzado adecuado para reducir el riesgo de lesiones, y avisar de inmediato si te sientes mal o lesionado durante la actividad — ignorar una molestia física puede convertir una lesión pequeña en una más grave. Estos hábitos de responsabilidad y honestidad son parte tan importante del deporte como la habilidad física misma.',
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
  { actividad:'Caminar tranquilamente hasta la casa de un vecino', intensidad:'Baja' },
  { actividad:'Quedarse sentado leyendo un libro', intensidad:'Baja' },
  { actividad:'Trotar suave durante 15 minutos', intensidad:'Moderada' },
  { actividad:'Andar en bicicleta a paso constante', intensidad:'Moderada' },
  { actividad:'Correr a máxima velocidad en una carrera', intensidad:'Alta' },
  { actividad:'Jugar un partido de fútbol completo sin parar', intensidad:'Alta' },
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
  const recurso = 'La <b>intensidad</b> de una actividad física indica cuánto esfuerzo le exige al cuerpo: baja (como caminar tranquilo), moderada (como andar en bicicleta) o alta (como correr rápido) — combinar actividades de distinta intensidad durante la semana ayuda a mantener una vida activa y saludable. Cuidar la <b>postura</b> corporal al sentarse, cargar mochilas o dormir, junto con buenos hábitos de higiene y descanso, previene dolores y problemas físicos a futuro. Planificar cuándo y cómo hacer actividad física regularmente (no solo cuando se recuerda) es clave para mantener estos hábitos en el tiempo.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(INTENSIDAD_ACTIVIDAD_BANK);
    const todos = ['Baja','Moderada','Alta'];
    const distract = todos.filter(function(t){ return t!==item.intensidad; });
    const opts = shuffle([item.intensidad].concat(distract)).map(function(i){ return {label:'Intensidad '+i, value:i}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.actividad+'.</p><p class="prompt-hint">¿Qué intensidad de esfuerzo físico tiene esta actividad?</p>',
      options: opts, correctValue: item.intensidad, speakText: item.actividad, cols:2, panel:true,
      explain: 'Esta actividad tiene una intensidad <b>'+item.intensidad.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(PLANIFICACION_POSTURA_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  const recurso = 'Un buen <b>líder de equipo</b> organiza y motiva a sus compañeros con respeto, escuchando las ideas de todos antes de decidir — no impone su opinión ni ignora a los demás. La <b>seguridad</b> en la actividad física implica revisar que el espacio de juego esté libre de peligros, usar los implementos deportivos de forma responsable, y nunca presionar a un compañero a jugar lesionado. Jugar limpio significa aceptar las decisiones de un árbitro o profesor y seguir las normas de seguridad incluso cuando el juego se pone competitivo.';
  const item = pick(LIDERAZGO_SEGURIDAD5_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  { actividad:'Ver una película sentado en el sillón', intensidad:'Baja' },
  { actividad:'Hacer las tareas del colegio sentado en el escritorio', intensidad:'Baja' },
  { actividad:'Bailar a un ritmo constante durante 20 minutos', intensidad:'Moderada' },
  { actividad:'Nadar a un ritmo tranquilo en la piscina', intensidad:'Moderada' },
  { actividad:'Correr una carrera de velocidad a máximo esfuerzo', intensidad:'Alta' },
  { actividad:'Jugar un partido completo de básquetbol sin parar', intensidad:'Alta' },
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
  const recurso = 'La actividad física se puede clasificar por su <b>intensidad</b>: baja (como estar sentado), moderada (como bailar o nadar a ritmo constante) o alta (como correr a máximo esfuerzo). Medir el <b>pulso</b> (los latidos del corazón por minuto) es una forma real de saber qué tan intensa fue una actividad. Además de moverse, mantener una vida activa y saludable incluye planificar horarios para hacer ejercicio, cuidar la postura al usar dispositivos electrónicos, y practicar buena higiene después de la actividad física.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(INTENSIDAD_ACTIVIDAD6_BANK);
    const todos = ['Baja','Moderada','Alta'];
    const distract = todos.filter(function(t){ return t!==item.intensidad; });
    const opts = shuffle([item.intensidad].concat(distract)).map(function(i){ return {label:'Intensidad '+i, value:i}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.actividad+'.</p><p class="prompt-hint">¿Qué intensidad de esfuerzo físico tiene esta actividad?</p>',
      options: opts, correctValue: item.intensidad, speakText: item.actividad, cols:2, panel:true,
      explain: 'Esta actividad tiene una intensidad <b>'+item.intensidad.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(HABITOS_VI_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  const recurso = 'El buen liderazgo en el deporte se nota en las acciones concretas: motivar a un compañero desanimado, repartir roles según las fortalezas de cada integrante, y reconocer cuando un rival juega mejor sin dejar de esforzarse (eso es <b>juego limpio</b>). La seguridad también es parte de jugar bien: revisar el estado de los materiales antes de usarlos y guardarlos correctamente al terminar evita accidentes. Gritar, hacer trampa o jugar de forma imprudente para impresionar, en cambio, no son formas válidas de liderar ni de competir.';
  const item = pick(LIDERAZGO_SEGURIDAD6_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Educación Física y Salud 7° Básico ----------------
   Basado en Decreto 614/2013. OA02 -> Estrategias y Tácticas Deportivas
   (reconocer principios básicos de estrategia en juegos y deportes:
   marcar espacios, anticipar jugadas, ocupar posiciones, trabajo en
   equipo — un ángulo conceptual/reconocible sin requerir desempeño físico
   real). Quedan fuera OA01,03-05 (habilidades motrices específicas,
   variedad de actividad física, entornos naturales — práctica física
   real) y OA06-11 (condición física medida, vida activa, juego limpio —
   ya cubiertos en años anteriores con contenido equivalente). */
export const EDFISICA_MODULES_G7 = [
  {id:'estrategiastacticas7', label:'Estrategias y Tácticas Deportivas', open:true, key:'estrategiastacticas7'},
];
export const EDFISICA_POS_G7 = [{x:50,y:50}];

const ESTRATEGIA_DEPORTIVA_BANK = [
  { desc:'En un partido de fútbol, un jugador se mueve hacia un espacio vacío de la cancha antes de que le pasen la pelota, en vez de quedarse quieto', correcta:'Ocupar espacios libres', opts:['Quedarse siempre en el mismo lugar','Ignorar a sus compañeros de equipo','Correr sin ningún objetivo'] },
  { desc:'En vóleibol, un equipo se organiza para que cada jugador cubra una zona distinta de la cancha, sin dejar espacios sin cubrir', correcta:'Distribuirse en posiciones de juego', opts:['Agruparse todos en un solo lugar','Jugar cada uno por su cuenta sin organización','Ignorar la posición de los rivales'] },
  { desc:'En básquetbol, un jugador observa hacia dónde se mueve el rival para adelantarse a su próxima jugada, en vez de solo reaccionar', correcta:'Anticipar la jugada del rival', opts:['Esperar sin observar nada','Copiar siempre el mismo movimiento','Ignorar por completo al rival'] },
  { desc:'Antes de comenzar un partido en equipo, los jugadores conversan para decidir quién cubrirá qué función durante el juego', correcta:'Planificar el trabajo en equipo', opts:['Jugar sin ningún acuerdo previo','Dejar que un solo jugador haga todo el trabajo','Ignorar los roles dentro del equipo'] },
  { desc:'En un partido de handball, dos jugadores se pasan la pelota rápidamente para confundir a la defensa rival antes de intentar anotar', correcta:'Usar una jugada coordinada con un compañero', opts:['Jugar siempre en solitario sin pasar la pelota','Detenerse por completo al ver al rival','Ignorar a los compañeros de equipo'] },
  { desc:'Durante un partido, un equipo cambia su forma de jugar al notar que el rival es muy rápido atacando por un lado de la cancha', correcta:'Adaptar la estrategia según lo que hace el rival', opts:['Seguir exactamente el mismo plan sin importar lo que haga el rival','Ignorar por completo cómo juega el equipo contrario','Abandonar el partido al notar la diferencia'] },
  { desc:'En básquetbol, un jugador se comunica con sus compañeros gritando indicaciones sobre dónde está el rival', correcta:'Comunicarse con el equipo durante el juego', opts:['Jugar en completo silencio sin avisar nada a nadie','Ignorar las indicaciones de los compañeros','Gritarle solo al árbitro'] },
  { desc:'Antes de un partido de vóleibol, el equipo revisa en qué zona de la cancha el rival tiene más dificultad para recibir', correcta:'Analizar las debilidades del equipo rival para aprovecharlas', opts:['Ignorar por completo cómo juega el rival','Jugar siempre de la misma forma sin analizar nada','Enfocarse solo en los errores propios del equipo'] },
  { desc:'En un partido de fútbol, un jugador que se cansó le hace una seña a un compañero en la banca para que lo reemplace en el momento justo', correcta:'Usar los cambios de jugadores como parte de la estrategia del equipo', opts:['Jugar siempre con los mismos jugadores sin importar el cansancio','Ignorar por completo a los jugadores en la banca','Salir de la cancha sin avisarle a nadie'] },
  { desc:'Un equipo de básquetbol practica una jugada específica varias veces antes del partido para ejecutarla bien cuando la necesite', correcta:'Preparar jugadas estratégicas con anticipación', opts:['Improvisar todas las jugadas sin ningún tipo de preparación','Jugar siempre igual sin practicar nada nuevo','Ignorar cualquier tipo de estrategia antes del partido'] },
];
export function genEstrategiasTacticas7Round(){
  const recurso = 'Jugar en equipo no es solo correr detrás de la pelota: incluye ocupar espacios libres antes de recibir un pase, distribuirse en posiciones para cubrir toda la cancha, anticipar la jugada del rival observando sus movimientos, comunicarse con los compañeros durante el juego y planificar jugadas con anticipación. Estas <b>estrategias y tácticas</b> permiten que un equipo juegue de forma coordinada, en vez de que cada jugador actúe por su cuenta.';
  const item = pick(ESTRATEGIA_DEPORTIVA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué estrategia deportiva se muestra aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esto es un ejemplo de: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Educación Física y Salud 8° Básico ----------------
   Basado en Decreto 614/2013. Sistemas de Juego y Táctica -> EF08 OA02
   (el texto del OA nombra literalmente ejemplos como "ubicar el balón
   lejos de un contrincante", "utilizar los espacios para recibir un
   objeto sin oponentes" y "aplicar un sistema de juego: uno contra uno,
   tres contra tres" — más específico que las estrategias generales de 7°).
   Principios de Entrenamiento -> OA03 (el OA nombra literalmente los
   componentes: Frecuencia, Intensidad, Tiempo de duración y recuperación,
   Progresión y Tipo de ejercicio — conceptos factuales identificables sin
   requerir práctica física en pantalla). Quedan fuera OA01 (habilidades
   motrices específicas por deporte — práctica real), OA04-05 (práctica
   regular de actividades y participación/promoción en la comunidad
   escolar — requieren acción física y comunitaria real). */
export const EDFISICA_MODULES_G8 = [
  {id:'sistemasjuego8', label:'Sistemas de Juego y Táctica', open:true, key:'sistemasjuego8'},
  {id:'entrenamiento8', label:'Principios de Entrenamiento', open:true, key:'entrenamiento8'},
];
export const EDFISICA_POS_G8 = [{x:30,y:70},{x:70,y:30}];

const SISTEMAS_JUEGO_8_BANK = [
  { desc:'En un partido de tenis, la jugadora golpea la pelota hacia el rincón opuesto a donde está su rival, obligándolo a correr', correcta:'Ubicar el balón lejos del contrincante', opts:['Golpear siempre hacia el mismo lugar','Apuntar directamente al rival','Devolver lo más suave posible sin intención'] },
  { desc:'En handball, un jugador corre hacia una zona vacía de la cancha justo cuando su compañero está por pasar el balón', correcta:'Usar los espacios para recibir sin oponentes cerca', opts:['Quedarse parado junto al defensor rival','Salir de la cancha','Pedir el balón donde hay más rivales'] },
  { desc:'En un entrenamiento de básquetbol, el equipo practica el sistema "uno contra uno": cada jugador marca a un rival específico durante toda la defensa', correcta:'Aplicar un sistema de juego de marca personal', opts:['Defender sin ninguna organización','Dejar la defensa a un solo jugador','Marcar todos al mismo rival'] },
  { desc:'En un torneo de vóleibol tres contra tres, el equipo acuerda antes del partido quién recibe, quién levanta y quién remata', correcta:'Definir roles dentro de un sistema de juego reducido', opts:['Que todos hagan todo al mismo tiempo sin acuerdo','Jugar sin conocer las reglas','Esperar que el rival decida los roles'] },
  { desc:'El equipo pierde el balón y de inmediato todos retroceden ordenadamente a sus posiciones defensivas acordadas', correcta:'Aplicar un repliegue defensivo organizado', opts:['Quedarse mirando sin reaccionar','Correr todos hacia el arco rival','Abandonar la cancha'] },
  { desc:'En bádminton, el jugador alterna golpes largos al fondo y cortos a la red para desgastar y descolocar a su rival', correcta:'Variar la ubicación de los golpes como táctica', opts:['Repetir siempre exactamente el mismo golpe','Golpear sin mirar la cancha','Esperar que el rival se canse solo'] },
  { desc:'Antes de un partido, el equipo estudia que el rival ataca casi siempre por la banda izquierda y decide reforzar esa zona', correcta:'Ajustar el sistema defensivo según el análisis del rival', opts:['Ignorar lo que hace el rival','Reforzar una zona al azar','Cambiar de deporte'] },
  { desc:'En un contraataque de básquetbol, el jugador con el balón avanza por el centro mientras sus compañeros corren por los costados abriendo la defensa', correcta:'Ocupar la cancha en amplitud para crear ventaja numérica', opts:['Correr todos en fila por el mismo costado','Detener el juego sin motivo','Pasar el balón hacia atrás siempre'] },
  { desc:'El capitán nota que su equipo está cansado y pide un tiempo fuera para reordenar la táctica y dar descanso', correcta:'Usar el tiempo fuera como herramienta táctica', opts:['Seguir jugando sin ajustar nada','Retirarse del partido','Discutir con el árbitro'] },
  { desc:'En fútbol, la delantera se mueve constantemente entre los defensores para que nunca sepan quién debe marcarla', correcta:'Desmarcarse para generar dudas en la defensa rival', opts:['Quedarse inmóvil todo el partido','Salir de la cancha cada jugada','Avisarle al rival sus movimientos'] },
];
export function genSistemasJuego8Round(){
  const recurso = 'En los deportes colectivos, un <b>sistema de juego</b> es un plan acordado por el equipo para organizar el ataque y la defensa, en vez de jugar sin ninguna coordinación. Algunas ideas tácticas clave: ubicar el balón lejos del rival para dificultar su respuesta, moverse hacia espacios vacíos de la cancha para recibir sin oponentes cerca, y asignar roles claros dentro del equipo (quién recibe, quién ataca, quién defiende). También es importante adaptar la táctica según el rival —por ejemplo, reforzar una zona donde el equipo contrario ataca más seguido— y usar herramientas como el tiempo fuera para reordenar el plan durante el partido. Pensar tácticamente, además de tener buena técnica individual, es lo que distingue a un equipo bien organizado.';
  const item = pick(SISTEMAS_JUEGO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué táctica o sistema de juego se aplica aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esto es un ejemplo de: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ENTRENAMIENTO_8_BANK = [
  { pregunta:'Catalina entrena 3 veces por semana. ¿Qué componente del entrenamiento describe ese dato?', correcta:'La frecuencia (cuántas veces se entrena por semana)', opts:['La intensidad del esfuerzo','El tipo de ejercicio','La flexibilidad'] },
  { pregunta:'Tomás corre a un ritmo que apenas le permite conversar, con el pulso muy elevado. ¿Qué componente describe ese dato?', correcta:'La intensidad (qué tan exigente es el esfuerzo)', opts:['La frecuencia semanal','El tipo de ejercicio','El calentamiento'] },
  { pregunta:'Una rutina indica trotar 30 minutos y luego descansar 2 minutos entre ejercicios. ¿Qué componente describe esos datos?', correcta:'El tiempo de duración y de recuperación', opts:['La intensidad máxima','El tipo de deporte','La competencia'] },
  { pregunta:'Cada dos semanas, Sofía aumenta un poco la distancia que corre, en vez de exigirse todo de una vez. ¿Qué principio aplica?', correcta:'La progresión (aumentar la carga de forma gradual)', opts:['La improvisación total','Entrenar siempre exactamente igual','Saltarse el descanso'] },
  { pregunta:'Un plan combina trote (resistencia), ejercicios con el peso del cuerpo (fuerza) y elongaciones (flexibilidad). ¿Qué componente varía entre esas sesiones?', correcta:'El tipo de ejercicio', opts:['Solo la hora del día','El clima','El color de la ropa deportiva'] },
  { pregunta:'¿Qué capacidad física desarrolla principalmente el trote continuo y prolongado?', correcta:'La resistencia cardiovascular', opts:['La fuerza máxima de brazos','La puntería','El equilibrio estático únicamente'] },
  { pregunta:'¿Qué capacidad física desarrollan principalmente los ejercicios de elongación sostenida?', correcta:'La flexibilidad', opts:['La velocidad de reacción','La resistencia cardiovascular','La fuerza explosiva'] },
  { pregunta:'¿Por qué es importante respetar los tiempos de recuperación entre sesiones exigentes?', correcta:'Porque el cuerpo necesita descanso para adaptarse y evitar lesiones', opts:['Porque entrenar todos los días sin parar es siempre mejor','Porque el descanso debilita','No es importante'] },
  { pregunta:'Si el objetivo es mejorar la velocidad, ¿qué tipo de ejercicio conviene incluir en el plan?', correcta:'Carreras cortas y rápidas (piques) con pausas de recuperación', opts:['Solo caminatas muy lentas','Solo elongaciones','Ningún ejercicio'] },
  { pregunta:'¿Qué señal indica que la intensidad de un ejercicio aeróbico es moderada y adecuada?', correcta:'Poder hablar con algo de esfuerzo mientras se realiza', opts:['No poder respirar en absoluto','No sentir ningún esfuerzo en ningún momento','Sentir dolor fuerte'] },
];
export function genEntrenamiento8Round(){
  const recurso = 'Los <b>principios de entrenamiento</b> son los componentes que se ajustan al planificar cualquier rutina física: la <b>Frecuencia</b> (cuántas veces por semana se entrena), la <b>Intensidad</b> (qué tan exigente es el esfuerzo, por ejemplo si aún se puede conversar mientras se hace ejercicio), el <b>Tiempo</b> de duración y de recuperación (cuánto dura la sesión y el descanso entre ejercicios), la <b>Progresión</b> (aumentar la carga de forma gradual, nunca de golpe), y el <b>Tipo</b> de ejercicio (resistencia, fuerza o flexibilidad, cada uno desarrollando una capacidad física distinta). Respetar los tiempos de recuperación es tan importante como entrenar, porque el cuerpo necesita descanso para adaptarse y evitar lesiones.';
  const item = pick(ENTRENAMIENTO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/educacion-fisica-salud/1-medio
   — OA01-05 + OAA. Cubiertos: OA02 (modificar y evaluar estrategias y
   tácticas), OA03 (plan de entrenamiento personal para una condición física
   saludable), OA04 (actividades físicas alternativas, autocuidado, seguridad
   y primeros auxilios). Fuera: OA01 (habilidades motrices específicas —
   requiere práctica física real) y OA05 (participar y promover actividad
   física en la comunidad — acción física/comunitaria real). */
export const EDFISICA_MODULES_M1 = [
  {id:'estrategiastacticasm1', label:'Estrategias y Tácticas', open:true, key:'estrategiastacticasm1'},
  {id:'entrenamientom1', label:'Plan de Entrenamiento Personal', open:true, key:'entrenamientom1'},
  {id:'vidaactivaseguridadm1', label:'Vida Activa y Primeros Auxilios', open:true, key:'vidaactivaseguridadm1'},
];
export const EDFISICA_POS_M1 = [{x:70,y:80},{x:24,y:50},{x:70,y:20}];
const ESTRATEGIAS_TACTICAS_M1_BANK = [
  { desc:'Un equipo de básquetbol pierde por mucho en el primer tiempo usando marca personal, así que en el segundo tiempo el entrenador cambia a una defensa zonal', correcta:'Modificar la táctica según cómo está resultando el partido', opts:['Repetir exactamente la misma táctica sin cambios','Abandonar el partido','Culpar solo a un jugador'] },
  { desc:'Tras revisar en video cómo jugó el equipo, los jugadores identifican que perdieron muchos balones por pases apurados y deciden ser más pacientes', correcta:'Evaluar el propio desempeño para mejorar la táctica futura', opts:['Ignorar por completo el resultado del partido','Cambiar de deporte inmediatamente','Culpar solo al árbitro'] },
  { desc:'En vóleibol, el equipo nota que el rival ataca casi siempre hacia la misma esquina y decide reforzar a un jugador extra en esa zona', correcta:'Aplicar una estrategia ajustada a un patrón observado en el rival', opts:['Ignorar cualquier patrón del rival','Cambiar todas las posiciones al azar','Detener el partido'] },
  { desc:'Un equipo de fútbol que iba ganando cómodo decide, en los últimos minutos, jugar de forma más conservadora para proteger el resultado', correcta:'Modificar la estrategia según el momento y el marcador del partido', opts:['Jugar exactamente igual sin importar el marcador','Aumentar el riesgo sin ninguna razón','Retirar a todo el equipo de la cancha'] },
  { desc:'Después de perder un torneo, el equipo se reúne para evaluar qué tácticas funcionaron y cuáles no, antes del próximo torneo', correcta:'Evaluar tácticas pasadas para planificar mejor las futuras', opts:['No analizar nunca los resultados anteriores','Culpar al clima por la derrota','Cambiar de equipo completo'] },
  { desc:'En un partido de handball, el equipo prueba una táctica de ataque nueva; al no funcionar bien, vuelven a la táctica que ya conocían mejor', correcta:'Evaluar en el momento si una táctica funciona y ajustarla', opts:['Insistir en una táctica que claramente no funciona','Terminar el partido de inmediato','Cambiar de deporte a mitad del partido'] },
  { desc:'Antes de la final, el equipo estudia los videos del próximo rival para anticipar sus jugadas más frecuentes', correcta:'Modificar la estrategia propia según un análisis previo del rival', opts:['Jugar sin ningún plan ni análisis previo','Copiar exactamente el uniforme del rival','Ignorar por completo al rival'] },
  { desc:'Un equipo de fútbol que jugaba con línea de cuatro defensas cambia a línea de cinco al ver que el rival ataca con muchos jugadores por las bandas', correcta:'Modificar la formación táctica según cómo ataca el rival', opts:['Mantener la misma formación sin importar el rival','Retirar a todos los defensas de la cancha','Jugar sin ninguna formación definida'] },
  { desc:'Después de un empate, el cuerpo técnico revisa qué jugadas de ataque funcionaron mejor para repetirlas en el próximo partido', correcta:'Evaluar jugadas específicas para mejorar la táctica futura', opts:['Olvidar por completo lo ocurrido en el partido','Cambiar a todos los jugadores del equipo','No analizar ninguna jugada del partido anterior'] },
];
export function genEstrategiasTacticasM1Round(){
  const recurso = 'Una <b>estrategia o táctica deportiva</b> no es fija: los mejores equipos la <b>modifican</b> según cómo se va desarrollando el partido (por ejemplo, cambiando de defensa si la actual no está funcionando, o jugando más conservador si van ganando cómodos), y la <b>evalúan</b> después de cada partido o torneo para identificar qué funcionó y qué se puede mejorar. Esta evaluación puede basarse en el propio desempeño (revisar en qué se falló) o en el análisis del rival (identificar patrones de juego para anticiparse a ellos). Aplicar, modificar y evaluar tácticas de forma continua —no solo seguir un plan fijo sin revisarlo— es lo que distingue a un equipo que resuelve bien los problemas que surgen durante un partido.';
  const item = pick(ESTRATEGIAS_TACTICAS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué principio táctico se aplica aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esto es un ejemplo de: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ENTRENAMIENTO_M1_BANK = [
  { pregunta:'Un plan de entrenamiento personal incluye trote 3 veces por semana. ¿Qué capacidad física busca desarrollar principalmente?', correcta:'La resistencia cardiovascular', opts:['La fuerza muscular máxima','La flexibilidad','La velocidad de reacción'] },
  { pregunta:'Un plan incluye ejercicios con el propio peso corporal (sentadillas, flexiones) tres veces por semana. ¿Qué capacidad física desarrolla principalmente?', correcta:'La fuerza muscular', opts:['La resistencia cardiovascular únicamente','La flexibilidad','El equilibrio estático'] },
  { pregunta:'Un plan incluye estiramientos sostenidos al final de cada sesión. ¿Qué capacidad física busca mejorar?', correcta:'La flexibilidad', opts:['La velocidad máxima','La fuerza explosiva','La resistencia cardiovascular'] },
  { pregunta:'Para mejorar la velocidad, ¿qué tipo de ejercicio conviene incluir en un plan de entrenamiento personal?', correcta:'Carreras cortas e intensas, con pausas de recuperación entre cada una', opts:['Solo caminatas muy lentas y prolongadas','Solo estiramientos sostenidos','Ningún ejercicio en particular'] },
  { pregunta:'¿Por qué un buen plan de entrenamiento personal debe combinar resistencia, fuerza y flexibilidad?', correcta:'Porque una condición física saludable requiere desarrollar varias capacidades a la vez, no solo una', opts:['Porque solo importa la fuerza muscular','Porque la resistencia cardiovascular no aporta nada','Porque la flexibilidad no tiene ninguna utilidad'] },
  { pregunta:'¿Qué debería hacer alguien que recién comienza un plan de entrenamiento personal, para evitar lesiones?', correcta:'Aumentar la exigencia de forma gradual (progresión), en vez de partir con el máximo esfuerzo', opts:['Entrenar al máximo desde el primer día','Saltarse siempre el descanso entre sesiones','Entrenar todos los días sin ninguna pausa'] },
  { pregunta:'¿Qué señal indica que la intensidad de un plan de resistencia cardiovascular es adecuada (moderada)?', correcta:'Poder hablar con cierto esfuerzo mientras se realiza el ejercicio', opts:['No poder respirar en absoluto','No sentir ningún esfuerzo en ningún momento','Sentir un dolor muy fuerte'] },
  { pregunta:'¿Por qué es importante planificar los días de descanso dentro de un plan de entrenamiento personal?', correcta:'Porque el cuerpo necesita tiempo para recuperarse y adaptarse al esfuerzo', opts:['Porque descansar siempre debilita el cuerpo','Porque entrenar sin parar da mejores resultados','No es necesario planificar descansos'] },
];
export function genEntrenamientoM1Round(){
  const recurso = 'Un <b>plan de entrenamiento personal</b> para lograr una condición física saludable debe desarrollar varias capacidades físicas a la vez: la <b>resistencia cardiovascular</b> (por ejemplo, con trote o ciclismo), la <b>fuerza muscular</b> (con ejercicios que usan el propio peso corporal o pesas), la <b>velocidad</b> (con carreras cortas e intensas) y la <b>flexibilidad</b> (con estiramientos sostenidos). Para diseñar un buen plan, es clave aumentar la exigencia de forma gradual (progresión) en vez de partir con el máximo esfuerzo, mantener una intensidad adecuada (poder hablar con cierto esfuerzo durante un ejercicio de resistencia es una buena señal), y planificar días de descanso, ya que el cuerpo necesita tiempo para recuperarse y adaptarse a cada nueva exigencia.';
  const item = pick(ENTRENAMIENTO_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const VIDA_ACTIVA_SEGURIDAD_M1_BANK = [
  { pregunta:'Antes de salir a andar en bicicleta por una ruta nueva, ¿qué medida de autocuidado es más importante?', correcta:'Usar casco y avisar a alguien la ruta y el horario aproximado de regreso', opts:['Salir sin avisar a nadie','No usar casco para ir más rápido','Elegir la ruta más peligrosa disponible'] },
  { pregunta:'Durante una caminata larga en la montaña, ¿qué acción de autocuidado es esencial?', correcta:'Hidratarse constantemente y llevar suficiente agua', opts:['Evitar tomar agua para no cargar peso','Caminar sin ningún descanso','Ignorar las señales de cansancio del cuerpo'] },
  { pregunta:'Un compañero se tuerce el tobillo durante una actividad deportiva. ¿Qué primer auxilio básico corresponde aplicar mientras se pide ayuda?', correcta:'Aplicar frío en la zona y evitar que apoye el peso en ese pie', opts:['Hacerlo caminar normalmente de inmediato','Aplicar calor intenso en la zona','Ignorar la lesión y seguir jugando'] },
  { pregunta:'¿Qué se recomienda hacer antes de practicar una nueva actividad física alternativa, como escalada o kayak?', correcta:'Informarse sobre los riesgos específicos y usar el equipo de seguridad adecuado', opts:['Practicarla sin ninguna información previa','Evitar cualquier equipo de seguridad','No preguntar nada a un instructor'] },
  { pregunta:'Durante una actividad física en un día muy caluroso, ¿qué señal indica que se debe detener y buscar sombra?', correcta:'Mareos, dolor de cabeza fuerte o piel muy enrojecida', opts:['Sentirse levemente cansado, sin ningún otro síntoma','Tener hambre','Sentir alegría por hacer ejercicio'] },
  { pregunta:'¿Qué medida de seguridad es clave al practicar natación en el mar o en un río?', correcta:'Conocer las corrientes del lugar y nunca nadar solo', opts:['Nadar siempre solo, sin avisar a nadie','Ignorar las banderas o señales de seguridad','Nadar de noche sin ninguna luz'] },
  { pregunta:'¿Qué se debe hacer si, durante una actividad física, alguien presenta un corte con sangrado moderado?', correcta:'Presionar la herida con un paño limpio y buscar ayuda médica si no para', opts:['Ignorar la herida por completo','Aplicar hielo directamente sobre el corte abierto','Mover a la persona bruscamente'] },
  { pregunta:'¿Por qué es importante variar entre distintas actividades físicas alternativas a lo largo del año?', correcta:'Porque desarrolla distintas capacidades y mantiene la motivación para mantenerse activo', opts:['Porque hacer siempre lo mismo es obligatorio','Porque variar de actividad es peligroso','No aporta ningún beneficio'] },
];
export function genVidaActivaSeguridadM1Round(){
  const recurso = 'Practicar <b>actividades físicas alternativas</b> (como escalada, kayak o ciclismo de ruta) amplía las opciones para mantenerse activo, pero requiere <b>autocuidado</b>: informarse sobre los riesgos específicos de cada actividad, usar el equipo de seguridad adecuado (casco, protección), hidratarse constantemente, y avisar a alguien la ruta y el horario si se sale solo. Reconocer señales de alerta —como mareos, dolor de cabeza fuerte o enrojecimiento excesivo de la piel en un día caluroso— permite detenerse a tiempo antes de que ocurra un problema mayor. Ante un accidente menor durante la actividad física, algunos <b>primeros auxilios básicos</b> son aplicar frío en un esguince o torcedura, y presionar con un paño limpio una herida con sangrado, buscando siempre ayuda médica si la situación no mejora.';
  const item = pick(VIDA_ACTIVA_SEGURIDAD_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2-medio/educacion-fisica-salud/2-medio
   — EF2M OA01-05. Cubiertos: OA02 (diseñar estrategias/tácticas específicas,
   con escenarios nuevos de DISEÑO en vez de solo modificar/evaluar como en 1°
   medio) y OA03 (plan de entrenamiento personal, con el ángulo de gasto
   calórico que el módulo de 1° medio no ejercitó explícitamente — texto casi
   idéntico al de 1° medio, mismo criterio de años anteriores: escenarios
   nuevos en vez de duplicar el módulo). Fuera: OA01 (habilidades motrices
   específicas por deporte, práctica física real) y OA04-05 (participar/
   liderar actividades físicas en la comunidad, acción real). */
export const EDFISICA_MODULES_M2 = [
  {id:'tacticasdisenom2', label:'Diseño de Estrategias y Tácticas', open:true, key:'tacticasdisenom2'},
  {id:'entrenamientocaloricom2', label:'Entrenamiento y Gasto Calórico', open:true, key:'entrenamientocaloricom2'},
];
export const EDFISICA_POS_M2 = [{x:30,y:70},{x:70,y:30}];

const TACTICAS_DISENO_M2_BANK = [
  { desc:'Antes de un partido de básquetbol, el equipo diseña un juego de ataque específico para aprovechar que un jugador rival es más bajo bajo el aro', correcta:'Diseñar una táctica ofensiva a partir de una debilidad detectada en el rival', opts:['Copiar la táctica del equipo campeón sin ningún análisis propio','No planificar nada antes del partido','Elegir una táctica al azar sin ningún fundamento'] },
  { desc:'En vóleibol, el equipo diseña una rotación de jugadores específica para que su mejor rematador quede siempre cerca de la red en los momentos clave', correcta:'Diseñar una estrategia de posicionamiento según las fortalezas propias del equipo', opts:['Ubicar a los jugadores completamente al azar','Ignorar las fortalezas de cada jugador','Cambiar de deporte en medio del partido'] },
  { desc:'Un equipo de fútbol diseña, antes del partido, una jugada de tiro libre específica ensayada durante la semana de entrenamiento', correcta:'Diseñar una jugada específica y practicarla previamente para un momento del juego', opts:['Improvisar cualquier jugada sin ninguna preparación previa','No practicar ninguna jugada durante la semana','Evitar cualquier tiro libre durante el partido'] },
  { desc:'En un partido de handball, el cuerpo técnico diseña una defensa especial para anular al mejor lanzador del equipo rival', correcta:'Diseñar una táctica defensiva enfocada en neutralizar una amenaza específica del rival', opts:['Defender exactamente igual sin importar quién ataque','No analizar nunca las fortalezas del rival','Retirar a todos los defensas de la cancha'] },
  { desc:'Un equipo de tenis de mesa diseña, antes del torneo, una estrategia de saque específica para aprovechar la mano menos hábil de su rival', correcta:'Diseñar una táctica ofensiva a partir de una debilidad detectada en el rival', opts:['Sacar siempre exactamente de la misma forma, sin ningún plan','No preparar ningún saque especial antes del torneo','Cambiar de deporte a mitad del torneo'] },
  { desc:'En un equipo de rugby, el entrenador diseña una formación de scrum específica según la altura y peso de sus propios jugadores', correcta:'Diseñar una estrategia de posicionamiento según las fortalezas propias del equipo', opts:['Formar el scrum al azar en cada jugada','Ignorar las características físicas de los jugadores','Retirar a todo el equipo de la cancha'] },
  { desc:'Antes de una final de atletismo por equipos, los entrenadores diseñan el orden de corredores según quién rinde mejor en cada tramo de la posta', correcta:'Diseñar una jugada específica y practicarla previamente para un momento del juego', opts:['Elegir el orden de corredores al azar el día de la carrera','No practicar ningún cambio de posta previamente','Correr sin ningún orden planificado'] },
  { desc:'Un equipo de fútbol sala diseña una presión alta específica para forzar errores en la salida de balón del equipo rival', correcta:'Diseñar una táctica defensiva enfocada en neutralizar una amenaza específica del rival', opts:['Defender siempre replegado sin ningún plan de presión','No analizar cómo sale con el balón el equipo rival','Retirar a todos los jugadores de la cancha'] },
];
export function genTacticasDisenoM2Round(){
  const recurso = 'Diseñar una <b>estrategia o táctica deportiva</b> (a diferencia de solo modificarla durante el partido) implica planificar con anticipación, basándose en un análisis de las fortalezas propias del equipo y las debilidades del rival: por ejemplo, diseñar una jugada de ataque específica para aprovechar que un rival es más bajo, o una rotación de jugadores que ubique al mejor rematador en el momento justo. Este diseño se practica y ensaya antes del partido, y luego se aplica y se evalúa durante el juego real, ajustándolo si es necesario — diseñar, aplicar y evaluar forman un ciclo completo de trabajo táctico.';
  const item = pick(TACTICAS_DISENO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué principio táctico se aplica aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esto es un ejemplo de: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ENTRENAMIENTO_CALORICO_M2_BANK = [
  { pregunta:'¿Qué relación debe existir entre el gasto calórico de un plan de entrenamiento y la ingesta de alimentos, para mantener un peso saludable?', correcta:'Un equilibrio entre las calorías consumidas y las calorías gastadas mediante la actividad física', opts:['No existe ninguna relación entre ambos factores','Siempre hay que consumir muchas más calorías que las gastadas','Siempre hay que consumir muchas menos calorías, sin importar el gasto'] },
  { pregunta:'Si el objetivo de un plan de entrenamiento personal es mejorar la resistencia cardiovascular, ¿qué duración y frecuencia son razonables como punto de partida?', correcta:'Sesiones de al menos 20-30 minutos, varias veces por semana', opts:['Una sola sesión de un minuto al mes','Sesiones de 10 horas seguidas cada día','No es necesario definir duración ni frecuencia'] },
  { pregunta:'¿Por qué es importante registrar el progreso (por ejemplo, tiempos o repeticiones) a lo largo de un plan de entrenamiento personal?', correcta:'Para evaluar si el plan está funcionando y ajustar la intensidad o progresión si es necesario', opts:['No sirve para nada llevar un registro','Porque es obligatorio por ley','Para competir contra otras personas exclusivamente'] },
  { pregunta:'¿Qué error común se debe evitar al diseñar un plan de entrenamiento personal en cuanto al gasto calórico?', correcta:'Aumentar el gasto calórico de forma brusca sin dar tiempo al cuerpo para adaptarse', opts:['Aumentar el gasto calórico de forma gradual y progresiva','Registrar el progreso semanalmente','Combinar distintos tipos de ejercicio'] },
  { pregunta:'¿Por qué el gasto calórico de un plan de entrenamiento debería considerar el objetivo personal de cada persona (por ejemplo, resistencia o fuerza)?', correcta:'Porque distintos objetivos requieren distintos tipos e intensidades de ejercicio, y por lo tanto distinto gasto calórico', opts:['Porque el gasto calórico es siempre exactamente igual sin importar el objetivo','Porque el objetivo personal no influye nunca en el plan de entrenamiento','Porque solo importa el tiempo total, sin importar el tipo de ejercicio'] },
  { pregunta:'¿Qué rol cumple la variedad de ejercicios (combinar resistencia, fuerza y flexibilidad) dentro de un plan de entrenamiento con enfoque en el gasto calórico?', correcta:'Ayuda a desarrollar distintas capacidades físicas a la vez, evitando el estancamiento y sobrecargas', opts:['No aporta ningún beneficio adicional al plan','Solo sirve para hacer el entrenamiento más aburrido','Aumenta el riesgo de lesión sin ningún beneficio'] },
  { pregunta:'¿Qué debería considerar una persona que quiere aumentar su masa muscular al planificar su gasto calórico?', correcta:'Asegurar un consumo de calorías y proteínas suficiente para acompañar el entrenamiento de fuerza', opts:['Reducir al mínimo posible el consumo de todos los alimentos','Evitar por completo cualquier tipo de proteína','Entrenar sin ningún tipo de descanso entre sesiones'] },
  { pregunta:'¿Por qué no es recomendable guiarse únicamente por el gasto calórico de una app o reloj deportivo, sin escuchar las señales del propio cuerpo?', correcta:'Porque esas estimaciones no son exactas y el cuerpo puede necesitar ajustes según el cansancio o la recuperación real', opts:['Porque esas apps y relojes siempre son 100% exactos','Porque el cuerpo nunca necesita ningún tipo de descanso','Porque el gasto calórico no tiene relación con el entrenamiento'] },
];
export function genEntrenamientoCaloricoM2Round(){
  const recurso = 'Al diseñar un <b>plan de entrenamiento personal</b>, además de desarrollar resistencia cardiovascular, fuerza, velocidad y flexibilidad, es importante considerar el <b>gasto calórico</b>: buscar un equilibrio entre las calorías que se consumen con la alimentación y las que se gastan con la actividad física, según el objetivo de cada persona. También hay que definir una duración y frecuencia razonables (por ejemplo, sesiones de 20-30 minutos varias veces por semana para resistencia), aumentar la exigencia de forma gradual (progresión) para evitar lesiones, y registrar el propio progreso para poder evaluar si el plan está funcionando y ajustarlo cuando sea necesario.';
  const item = pick(ENTRENAMIENTO_CALORICO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

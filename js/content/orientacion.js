import { pick, shuffle } from '../utils.js';
import { toothbrushSVG } from '../svg.js';

export const ORIENTACION_MODULES = [
  {id:'emociones', label:'Mis Emociones', open:true, key:'emociones'},
  {id:'autocuidado', label:'Autocuidado y Hábitos', open:true, key:'autocuidado'},
  {id:'convivencia', label:'Buena Convivencia', open:true, key:'convivencia'},
];
export const ORIENTACION_POS = [{x:24,y:80},{x:70,y:50},{x:24,y:20}];

/* ---------------- Contenido Orientación 1° Básico ----------------
   OA02 -> Mis Emociones · OA04,08 -> Autocuidado y Hábitos · OA05-07 -> Buena
   Convivencia. OA01,03 (autodescripción y expresión de afecto personal)
   quedaron fuera por ser subjetivos/reflexivos, no aptos para opción múltiple. */
const EMOCIONES_ITEMS = [
  { emoji:'😄', label:'ALEGRÍA', desc:'Sientes esto cuando algo te hace muy feliz.' },
  { emoji:'😢', label:'PENA', desc:'Sientes esto cuando algo te pone triste.' },
  { emoji:'😠', label:'RABIA', desc:'Sientes esto cuando algo te molesta mucho.' },
  { emoji:'😨', label:'MIEDO', desc:'Sientes esto cuando algo te asusta.' },
  { emoji:'😲', label:'SORPRESA', desc:'Sientes esto cuando pasa algo que no esperabas.' },
  { emoji:'🥰', label:'CARIÑO', desc:'Sientes esto cuando quieres mucho a alguien.' },
];
const AUTOCUIDADO_ITEMS = [
  { emoji: toothbrushSVG(30), label:'Lavarte los dientes es parte de cuidar tu cuerpo', v:true },
  { emoji:'😴', label:'Dormir suficientes horas ayuda a tu cuerpo y tu mente', v:true },
  { emoji:'🥗', label:'Comer variado, con frutas y verduras, es parte de cuidarte', v:true },
  { emoji:'🙅', label:'Está bien darle tu dirección y datos personales a un desconocido', v:false },
  { emoji:'🎒', label:'Cuidar tus útiles escolares es una forma de ser responsable', v:true },
  { emoji:'🧹', label:'Mantener ordenada tu sala o tu pieza ayuda a estudiar mejor', v:true },
  { emoji:'🔓', label:'No es necesario proteger tu cuerpo ni tu intimidad', v:false },
  { emoji:'💧', label:'Tomar agua durante el día es parte de cuidar tu cuerpo', v:true },
  { emoji:'🌙', label:'Acostarte muy tarde todos los días no afecta en nada', v:false },
  { emoji:'🎨', label:'Reconocer los nuevos aprendizajes que vas logrando te ayuda a motivarte', v:true },
];
const CONVIVENCIA_ITEMS = [
  { emoji:'🙋', label:'Saludar y despedirte con buenos modales es una forma de buen trato', v:true },
  { emoji:'👂', label:'Escuchar a un compañero cuando tiene un problema ayuda a resolver conflictos', v:true },
  { emoji:'🤗', label:'Compartir tus cosas con tus compañeros favorece la buena convivencia', v:true },
  { emoji:'😡', label:'Gritar y pelear es la mejor forma de resolver un conflicto', v:false },
  { emoji:'👨‍👩‍👧‍👦', label:'Tu familia y tu curso son grupos a los que perteneces', v:true },
  { emoji:'🙈', label:'Ignorar a un compañero que está triste es una buena forma de ayudar', v:false },
  { emoji:'🤝', label:'Buscar un acuerdo y reconciliarse ayuda a solucionar un conflicto', v:true },
  { emoji:'🧩', label:'Ponerte en el lugar del otro ayuda a entender cómo se siente', v:true },
  { emoji:'🚪', label:'Excluir a un compañero de un juego solo porque sí está bien', v:false },
  { emoji:'🙌', label:'Ayudar a ordenar la casa o la sala es una forma de participar en tu grupo', v:true },
];

/* ---------------- Contenido Orientación 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/2-basico):
   OA02 -> Mis Emociones II (reconocer emociones en situaciones/escenas) ·
   OA04 -> Autocuidado y Hábitos II (higiene, descanso, alimentación,
   resguardo del cuerpo e intimidad, cuidado de datos personales) ·
   OA08 -> Hábitos de Trabajo Escolar (nuevo este año) · OA05-06 -> Buena
   Convivencia II (buen trato y resolución de conflictos entre pares).
   Quedan fuera OA01,03,07 (autodescripción, expresión de afecto personal,
   pertenencia a grupos) por ser subjetivos/reflexivos, no aptos para opción
   múltiple. */
export const ORIENTACION_MODULES_G2 = [
  {id:'emociones2', label:'Mis Emociones II', open:true, key:'emociones2'},
  {id:'autocuidado2', label:'Autocuidado y Hábitos II', open:true, key:'autocuidado2'},
  {id:'habitosescolares2', label:'Hábitos de Trabajo Escolar', open:true, key:'habitosescolares2'},
  {id:'convivencia2', label:'Buena Convivencia II', open:true, key:'convivencia2'},
];
export const ORIENTACION_POS_G2 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

const EMOCIONES_LABELS_2 = ['ALEGRÍA','PENA','RABIA','MIEDO','SORPRESA','CARIÑO'];
const EMOCIONES_ESCENAS_2 = [
  { texto:'A Pedro se le perdió su juguete favorito y no lo puede encontrar.', emocion:'PENA' },
  { texto:'Sofía ganó el primer lugar en la carrera de la escuela.', emocion:'ALEGRÍA' },
  { texto:'Un perro grande le ladró fuerte a Martín en la calle.', emocion:'MIEDO' },
  { texto:'Alguien le quitó su lápiz favorito sin pedirlo.', emocion:'RABIA' },
  { texto:'Vio una película con un final que no se esperaba para nada.', emocion:'SORPRESA' },
  { texto:'Su mamá lo abrazó fuerte al llegar a casa después del colegio.', emocion:'CARIÑO' },
  { texto:'Se despertó en la noche por un ruido muy fuerte y desconocido.', emocion:'MIEDO' },
  { texto:'Le regalaron el cuento que tanto quería para su cumpleaños.', emocion:'ALEGRÍA' },
];
/* Ambos bancos se ampliaron (8→12 y 6→12) — antes garantizaban una
   repetición en cada partida de rounds:10, detectado simulando sesiones
   completas con la misma lógica anti-repetición del motor. */
const AUTOCUIDADO_2_ITEMS = [
  { emoji:'🛌', label:'Dormir la cantidad de horas necesarias ayuda a tu cuerpo a descansar', v:true },
  { emoji:'🧴', label:'Lavarte las manos antes de comer evita que te enfermes', v:true },
  { emoji:'🥦', label:'Comer verduras y frutas variadas es parte de una buena alimentación', v:true },
  { emoji:'🔒', label:'Está bien decir "no" si alguien quiere tocar tu cuerpo sin tu permiso', v:true },
  { emoji:'📵', label:'No debes dar tu dirección o teléfono a personas desconocidas por internet', v:true },
  { emoji:'🦷', label:'Cepillarte los dientes después de comer es parte de cuidar tu cuerpo', v:true },
  { emoji:'🧥', label:'Abrigarte cuando hace frío ayuda a que no te enfermes', v:true },
  { emoji:'🗣️', label:'Contarle a un adulto de confianza si algo te incomoda es lo correcto', v:true },
  { emoji:'🍭', label:'Comer solo dulces todos los días es parte de una alimentación saludable', v:false },
  { emoji:'🌙', label:'No importa dormir poco, tu cuerpo no lo necesita', v:false },
  { emoji:'📢', label:'Está bien compartir tu dirección con cualquier persona que la pida', v:false },
  { emoji:'🤐', label:'Si alguien te incomoda, lo mejor es no contarle a nadie', v:false },
];
/* "Dejar tus materiales tirados" (v:false) usaba 🗑️ (un basurero, que
   representa la buena acción de botar la basura en su lugar) — al revés de
   lo que describe el texto. Se cambió a 🚯 ("prohibido botar basura"),
   mismo criterio aplicado en historia.js para el mismo tipo de ítem. */
const HABITOS_ESCOLARES_BANK = [
  { emoji:'🎒', label:'Traer tus útiles escolares todos los días te ayuda a aprender mejor', v:true },
  { emoji:'🧹', label:'Mantener ordenada tu sala de clases ayuda a todos a concentrarse', v:true },
  { emoji:'✅', label:'Reconocer lo que aprendiste cada día te ayuda a motivarte para seguir aprendiendo', v:true },
  { emoji:'📚', label:'Cuidar tus cuadernos y libros te ayuda a tenerlos listos cuando los necesites', v:true },
  { emoji:'⏰', label:'Organizar tu tiempo para hacer las tareas te ayuda a no dejarlas para el final', v:true },
  { emoji:'🙋', label:'Preguntar cuando no entiendes algo te ayuda a aprender mejor', v:true },
  { emoji:'📝', label:'Revisar tu tarea antes de entregarla ayuda a que quede bien hecha', v:true },
  { emoji:'🎧', label:'Prestar atención cuando el profesor explica te ayuda a entender la clase', v:true },
  { emoji:'🚯', label:'Dejar tus materiales tirados por el suelo es un buen hábito de estudio', v:false },
  { emoji:'😴', label:'No importa cuidar tus útiles, siempre puedes perderlos sin problema', v:false },
  { emoji:'🗯️', label:'Interrumpir a tus compañeros mientras trabajan es un buen hábito de estudio', v:false },
  { emoji:'📵', label:'Da lo mismo prestar atención en clases o no, siempre aprendes igual', v:false },
];
/* Ampliado de 4 a 10 ítems — antes garantizaba una repetición en cada
   partida de rounds:8. */
const CONFLICTO_2_BANK = [
  { texto:'Dos compañeros quieren ser los primeros en la fila.', correcta:'Ponerse de acuerdo y turnarse', malas:['Empujarse para pasar primero','Pelear por el lugar','Quejarse a gritos'] },
  { texto:'Un compañero está triste porque nadie quiere jugar con él.', correcta:'Invitarlo a jugar contigo y tu grupo', malas:['Ignorarlo','Burlarte de él','Decirle que se aleje'] },
  { texto:'No estás de acuerdo con la idea de un compañero para el juego.', correcta:'Escuchar su idea y buscar un acuerdo entre ambos', malas:['Imponer tu idea a la fuerza','Gritarle que está equivocado','Dejar de jugar enojado'] },
  { texto:'Dos amigos no logran decidir a qué juego jugar primero.', correcta:'Proponer turnarse: un rato cada juego', malas:['Que uno decida a la fuerza','Pelear hasta que uno se vaya','No jugar ninguno de los dos por rabia'] },
  { texto:'Un compañero te quitó tu lápiz sin pedirlo.', correcta:'Pedirle con calma que te lo devuelva', malas:['Quitárselo de vuelta a la fuerza','Gritarle delante de todos','Contarle a todos que es un ladrón'] },
  { texto:'Dos grupos quieren usar la misma cancha para jugar.', correcta:'Acordar compartir la cancha por turnos', malas:['Pelear por quedarse con la cancha','Empujar al otro grupo para sacarlo','Quejarse sin proponer una solución'] },
  { texto:'Un compañero se equivocó y rompió tu dibujo sin querer.', correcta:'Decirle cómo te sientes y aceptar sus disculpas', malas:['Romper algo suyo para "vengarte"','Gritarle muy enojado','Dejar de hablarle para siempre'] },
  { texto:'Dos compañeros creen tener la razón en un juego de mesa.', correcta:'Revisar juntos las reglas del juego con calma', malas:['Discutir a gritos sin revisar las reglas','Cada uno seguir jugando a su manera','Terminar el juego enojados'] },
  { texto:'Un compañero se burló de ti frente al curso.', correcta:'Decirle con calma que eso te molestó y avisar a un adulto si sigue', malas:['Burlarte de él también','Pegarle','Guardarte el enojo y no decir nada'] },
  { texto:'Tu grupo no se pone de acuerdo en cómo repartir una tarea.', correcta:'Conversar y repartir las partes de forma justa entre todos', malas:['Hacer todo tú solo sin avisar','Discutir sin llegar a un acuerdo','Dejar que uno decida por todos sin preguntar'] },
];

export function genEmociones2Round(){
  const item = pick(EMOCIONES_ESCENAS_2);
  const distract = shuffle(EMOCIONES_LABELS_2.filter(function(e){ return e!==item.emocion; })).slice(0,3);
  const opts = shuffle([item.emocion].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué emoción sentiría probablemente?</p>',
    options: opts, correctValue: item.emocion, speakText: item.texto, cols:4, kind:'word',
    explain: 'Ante esa situación, lo más común es sentir <b>'+item.emocion.toLowerCase()+'</b>.',
  };
}

export function genAutocuidado2Round(){
  const item = pick(AUTOCUIDADO_2_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genHabitosEscolares2Round(){
  const item = pick(HABITOS_ESCOLARES_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genConvivencia2Round(){
  const item = pick(CONFLICTO_2_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema sin lastimar a nadie.',
  };
}

export function genEmocionesRound(){
  const item = pick(EMOCIONES_ITEMS);
  const distract = shuffle(EMOCIONES_ITEMS.filter(function(e){ return e.label!==item.label; })).slice(0,3).map(function(e){ return e.label; });
  const opts = shuffle([item.label].concat(distract)).map(function(e){ return {label:e, value:e}; });
  if(Math.random()<0.5){
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué emoción muestra esta cara?</p>',
      options: opts, correctValue: item.label, speakText: item.label, cols:4, kind:'word',
      explain: 'Esta cara muestra <b>'+item.label.toLowerCase()+'</b>: '+item.desc.toLowerCase(),
    };
  }
  return {
    promptHTML: '<span class="prompt-emoji">💭</span><p class="prompt-hint">'+item.desc+' ¿Qué emoción es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa descripción corresponde a la <b>'+item.label.toLowerCase()+'</b>.',
  };
}

export function genAutocuidadoRound(){
  const item = pick(AUTOCUIDADO_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genConvivenciaRound(){
  const item = pick(CONVIVENCIA_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

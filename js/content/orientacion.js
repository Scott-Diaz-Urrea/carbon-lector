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

/* ---------------- Contenido Orientación 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/3-basico):
   Manejo Emocional -> OA02 (identificar emociones propias y ajenas,
   estrategias de manejo emocional). Autocuidado -> OA04 (higiene,
   descanso, alimentación, actividad física). Buen Trato y Resolución de
   Conflictos -> OA05-06 (solidaridad, respeto, empatía, resolución de
   conflictos entre pares). Hábitos de Trabajo Escolar -> OA08.
   Quedan fuera: OA01 (valorar las propias fortalezas — autorreflexión
   subjetiva), OA03 (sexualidad como expresión de amor y vínculo — un tema
   sensible que requiere el acompañamiento de un adulto/docente, no una
   trivia de opción múltiple) y OA07 (participar en la comunidad escolar —
   ya cubierto de forma más específica por "Formación Ciudadana III" en
   historia.js, para no duplicar contenido). */
export const ORIENTACION_MODULES_G3 = [
  {id:'manejoemocional3', label:'Manejo Emocional', open:true, key:'manejoemocional3'},
  {id:'autocuidado3', label:'Autocuidado III', open:true, key:'autocuidado3'},
  {id:'buentrato3', label:'Buen Trato y Resolución de Conflictos', open:true, key:'buentrato3'},
  {id:'habitosestudio3', label:'Hábitos de Trabajo Escolar', open:true, key:'habitosestudio3'},
];
export const ORIENTACION_POS_G3 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

const EMOCIONES_ESTRATEGIA_BANK = [
  { situacion:'Un compañero te quitó tu lápiz sin permiso y sientes mucha rabia.', correcta:'Respirar profundo y contar hasta diez antes de reaccionar', malas:['Gritarle inmediatamente','Quitarle algo suyo de vuelta','Pegarle'] },
  { situacion:'Te sientes triste porque tu mejor amigo no pudo venir a tu cumpleaños.', correcta:'Reconocer que estás triste y contarle a alguien cómo te sientes', malas:['Fingir que no te importa','Enojarte con tu amigo sin razón','Guardarte todo sin decir nada'] },
  { situacion:'Un compañero está muy nervioso antes de una presentación.', correcta:'Escucharlo y ayudarlo a calmarse con palabras de ánimo', malas:['Reírte de sus nervios','Decirle que lo hará mal','Ignorarlo'] },
  { situacion:'Sientes mucho miedo antes de una prueba importante.', correcta:'Reconocer el miedo y prepararte estudiando con tiempo', malas:['Evitar estudiar para no pensar en eso','Fingir que no tienes miedo y no hacer nada','Copiar en la prueba por miedo a fallar'] },
  { situacion:'Un compañero llora porque perdió su juguete favorito.', correcta:'Acompañarlo y mostrar empatía por lo que siente', malas:['Decirle que no llore por tonterías','Reírte de él','Ignorarlo y seguir jugando'] },
  { situacion:'Te sientes muy frustrado porque no te sale un ejercicio difícil.', correcta:'Tomarte un momento para calmarte y pedir ayuda si la necesitas', malas:['Romper tu cuaderno de la rabia','Gritarle a quien esté cerca','Rendirte sin intentarlo de nuevo'] },
  { situacion:'Sientes envidia porque un compañero recibió un premio y tú no.', correcta:'Reconocer el sentimiento y felicitar a tu compañero igual', malas:['Decir que el premio no vale nada','Hablar mal de tu compañero','Ignorar a quien ganó el premio'] },
  { situacion:'Sientes vergüenza porque te equivocaste al hablar frente al curso.', correcta:'Recordar que equivocarse es normal y seguir adelante con calma', malas:['Negarte a volver a hablar en público nunca más','Culpar a otros por tu error','Salir corriendo de la sala'] },
];
const AUTOCUIDADO_3_ITEMS = [
  { label:'Dormir la cantidad de horas adecuadas ayuda a tu cuerpo y tu concentración en clases', v:true },
  { label:'Lavarte los dientes después de cada comida ayuda a prevenir caries', v:true },
  { label:'Comer alimentos variados, incluyendo frutas y verduras, es parte de cuidar tu cuerpo', v:true },
  { label:'Hacer pausas activas y moverte durante el día es parte de una rutina saludable', v:true },
  { label:'Tomar agua durante el día ayuda a que tu cuerpo funcione bien', v:true },
  { label:'Da lo mismo cuántas horas duermas, siempre rindes igual en clases', v:false },
  { label:'Comer solo un tipo de alimento todos los días es una alimentación balanceada', v:false },
  { label:'No es necesario tomar agua si no tienes mucha sed', v:false },
];
const CONFLICTO_3_BANK = [
  { texto:'Dos compañeros de grupo no se ponen de acuerdo en cómo repartirse el trabajo.', correcta:'Conversar y dividir el trabajo de forma justa entre todos', malas:['Que uno haga todo el trabajo solo','Discutir sin llegar a un acuerdo','Entregar el trabajo incompleto por no ponerse de acuerdo'] },
  { texto:'Un compañero se enoja porque su equipo perdió un partido.', correcta:'Recordarle que lo importante es participar y seguir intentando', malas:['Burlarte de su equipo por perder','Decirle que es malo para el deporte','Dejar de hablarle por haber perdido'] },
  { texto:'Dos amigos tienen opiniones distintas sobre qué película ver.', correcta:'Buscar un acuerdo, como turnarse para elegir la próxima vez', malas:['Imponer tu película a la fuerza','Pelear hasta que uno ceda por cansancio','Ver cada uno una película distinto y dejar de ser amigos'] },
  { texto:'Un compañero copió una idea tuya sin decir que era tuya.', correcta:'Decirle con calma que esa idea era tuya y conversarlo', malas:['Gritarle delante de todos','Copiarle algo a él también para "vengarte"','Dejar de hablarle sin explicar por qué'] },
  { texto:'Dos compañeros quieren usar el mismo computador de la sala de enlaces.', correcta:'Acordar turnos de tiempo para usarlo por partes iguales', malas:['Empujar al otro para quedarte con el computador','Apagar el computador para que nadie lo use','Pelear hasta que un adulto tenga que intervenir'] },
  { texto:'Un compañero se burla del proyecto de otro delante del curso.', correcta:'Decirle que eso no está bien y apoyar a quien fue molestado', malas:['Reírte también para no quedar fuera','Ignorar la situación como si no pasara nada','Burlarte tú también del proyecto'] },
  { texto:'Dos compañeros de equipo no logran ponerse de acuerdo en una jugada durante un juego.', correcta:'Detenerse un momento, escuchar ambas ideas y elegir una entre los dos', malas:['Seguir jugando cada uno a su manera sin acuerdo','Discutir a gritos frente al resto del equipo','Dejar de jugar en equipo por el desacuerdo'] },
  { texto:'Un compañero no quiere participar en un trabajo grupal.', correcta:'Preguntarle qué le pasa y ver cómo puede aportar a su manera', malas:['Excluirlo del grupo sin conversar','Hacer todo el trabajo sin él y quejarse después','Obligarlo a participar a la fuerza'] },
];
const HABITOS_ESTUDIO_3_BANK = [
  { label:'Organizar un horario para hacer tus tareas te ayuda a no dejarlas para último momento', v:true },
  { label:'Tener un lugar ordenado y tranquilo para estudiar ayuda a concentrarte mejor', v:true },
  { label:'Revisar tu mochila la noche anterior te ayuda a no olvidar materiales importantes', v:true },
  { label:'Pedir ayuda cuando no entiendes algo es parte de tener buenos hábitos de estudio', v:true },
  { label:'Dejar todas las tareas para el último día antes de la entrega es la mejor estrategia', v:false },
  { label:'Estudiar rodeado de muchas distracciones no afecta en nada tu concentración', v:false },
  { label:'Es mejor no preguntar nunca cuando no entiendes algo en clases', v:false },
  { label:'Repasar lo aprendido en clases al llegar a casa ayuda a recordarlo mejor', v:true },
];

export function genManejoEmocional3Round(){
  const item = pick(EMOCIONES_ESTRATEGIA_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así manejas la emoción sin lastimarte a ti ni a otros.',
  };
}

export function genAutocuidado3Round(){
  const item = pick(AUTOCUIDADO_3_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genBuenTrato3Round(){
  const item = pick(CONFLICTO_3_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema con respeto.',
  };
}

export function genHabitosEstudio3Round(){
  const item = pick(HABITOS_ESTUDIO_3_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

/* ---------------- Contenido Orientación 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/4-basico): mismos 4 ángulos que 3° básico
   (manejo emocional, autocuidado, buen trato/resolución de conflictos,
   hábitos de estudio), pero con escenarios y afirmaciones nuevas — el
   texto de los OA de 4° es casi idéntico al de 3°, así que se evita
   repetir literalmente el mismo contenido de un año a otro.
   Manejo Emocional II -> OA02. Autocuidado IV -> OA05. Buen Trato y
   Resolución de Conflictos II -> OA06-07. Hábitos de Trabajo Escolar II ->
   OA09. Quedan fuera: OA01 (valorar fortalezas propias, autorreflexión),
   OA03 (sexualidad como expresión de amor y vínculo) y OA04 (desarrollo
   afectivo y sexual — aún más explícito que el OA03 de 3° básico, mismo
   criterio de requerir el acompañamiento real de un adulto) y OA08
   (participar en la comunidad escolar — ya cubierto por Formación
   Ciudadana IV en historia.js). */
export const ORIENTACION_MODULES_G4 = [
  {id:'manejoemocional4', label:'Manejo Emocional II', open:true, key:'manejoemocional4'},
  {id:'autocuidado4', label:'Autocuidado IV', open:true, key:'autocuidado4'},
  {id:'buentrato4', label:'Buen Trato y Resolución de Conflictos II', open:true, key:'buentrato4'},
  {id:'habitosestudio4', label:'Hábitos de Trabajo Escolar II', open:true, key:'habitosestudio4'},
];
export const ORIENTACION_POS_G4 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

const EMOCIONES_ESTRATEGIA4_BANK = [
  { situacion:'Sientes celos porque tu hermano recibió más atención en una celebración familiar.', correcta:'Reconocer el sentimiento y conversarlo con un adulto de confianza', malas:['Portarte mal para llamar la atención','Culpar a tu hermano por tus celos','Guardarte el sentimiento y aislarte'] },
  { situacion:'Te sientes decepcionado porque no ganaste un concurso en el que te esforzaste mucho.', correcta:'Aceptar la decepción y reconocer tu esfuerzo igual', malas:['Culpar a los jueces sin razón','Dejar de participar en cualquier concurso','Enojarte con quien ganó'] },
  { situacion:'Sientes ansiedad antes de una presentación importante frente al curso.', correcta:'Reconocer la ansiedad y prepararte con anticipación', malas:['Evitar la presentación sin avisar','Fingir estar enfermo para no ir','Ignorar por completo la sensación'] },
  { situacion:'Un compañero está pasando por un momento difícil y se nota triste.', correcta:'Acercarte con empatía y preguntarle cómo se siente', malas:['Ignorarlo porque no es tu problema','Burlarte de su tristeza','Contarle a todos lo que le pasa sin su permiso'] },
  { situacion:'Sientes mucho orgullo después de terminar un proyecto difícil.', correcta:'Reconocer tu logro y compartir tu alegría con otros', malas:['Sentir que no lograste nada','Menospreciar tu propio esfuerzo','Guardarte la alegría sin compartirla'] },
  { situacion:'Te sientes frustrado porque un juego de mesa no te está saliendo bien.', correcta:'Respirar, calmarte y seguir intentando con paciencia', malas:['Tirar el juego al suelo','Gritarle a quien esté jugando contigo','Rendirte inmediatamente'] },
  { situacion:'Sientes vergüenza porque olvidaste tu tarea en casa.', correcta:'Reconocer el error con calma y avisarle al profesor', malas:['Mentir diciendo que la hiciste','Culpar a otro compañero','Esconderte para no dar explicaciones'] },
  { situacion:'Un compañero te felicita por un logro y sientes alegría.', correcta:'Agradecer el gesto y disfrutar el momento', malas:['Desconfiar de la felicitación sin razón','Ignorar a quien te felicita','Sentir que no merecías el elogio'] },
];
const AUTOCUIDADO_4_ITEMS = [
  { label:'Reconocer cuándo necesitas descansar y respetar ese límite es parte del autocuidado', v:true },
  { label:'Practicar buenos hábitos de higiene, como ducharte y lavarte los dientes, cuida tu salud', v:true },
  { label:'Elegir una alimentación variada, con frutas y verduras, ayuda a tu cuerpo a funcionar bien', v:true },
  { label:'Tomarte pausas y estirarte después de estar mucho tiempo sentado ayuda a tu postura', v:true },
  { label:'Pedir ayuda a un adulto de confianza cuando algo te preocupa es una forma de autocuidado', v:true },
  { label:'Da lo mismo dormir poco todos los días, tu cuerpo se acostumbra sin ningún efecto', v:false },
  { label:'No es necesario cambiar de postura nunca, aunque estés horas sentado igual', v:false },
  { label:'Ignorar tus propias necesidades de descanso es la mejor forma de rendir más', v:false },
];
const CONFLICTO_4_BANK = [
  { texto:'Un compañero de curso se burla de otro por su forma de hablar.', correcta:'Decirle que eso no está bien y apoyar a quien fue molestado', malas:['Reírte también para no quedar fuera','Ignorar la situación','Burlarte tú también'] },
  { texto:'Dos compañeros de un mismo equipo no se ponen de acuerdo en una estrategia de juego.', correcta:'Escuchar ambas ideas y buscar un acuerdo entre los dos', malas:['Imponer una idea sin escuchar a nadie','Discutir sin llegar a un acuerdo','Dejar de jugar en equipo'] },
  { texto:'Un nuevo estudiante llega a tu curso y no conoce a nadie.', correcta:'Acercarte, presentarte y ayudarlo a sentirse bienvenido', malas:['Ignorarlo por ser nuevo','Burlarte porque no conoce las reglas del curso','Excluirlo de los juegos del recreo'] },
  { texto:'Un compañero te acusa de algo que no hiciste.', correcta:'Explicar con calma lo que realmente pasó', malas:['Gritarle sin explicar nada','Acusarlo de algo a tu vez para "vengarte"','Dejar de hablarle sin aclarar la situación'] },
  { texto:'Dos amigos compiten por el mismo puesto en un equipo deportivo.', correcta:'Aceptar el resultado con deportividad, gane quien gane', malas:['Sabotear al otro para ganar','Dejar de ser su amigo si pierde','Quejarse injustamente del resultado'] },
  { texto:'Un compañero comete un error que afecta a todo el grupo en un trabajo.', correcta:'Conversar con calma sobre cómo solucionarlo juntos', malas:['Culparlo frente a todo el curso','Excluirlo del resto del trabajo','Gritarle por el error'] },
  { texto:'Ves que alguien está siendo tratado injustamente por un grupo de compañeros.', correcta:'Buscar ayuda de un adulto y no sumarte al trato injusto', malas:['Sumarte al grupo para no quedar fuera','Ignorar la situación','Burlarte también'] },
  { texto:'Un compañero no está de acuerdo con una decisión tomada por el curso.', correcta:'Escuchar su opinión con respeto, aunque no estés de acuerdo', malas:['Ignorar lo que piensa','Burlarte de su opinión','Excluirlo por pensar diferente'] },
];
const HABITOS_ESTUDIO_4_BANK = [
  { label:'Anotar las tareas y fechas de entrega en una agenda ayuda a organizarte mejor', v:true },
  { label:'Estudiar un poco cada día, en vez de todo junto la noche anterior, ayuda a aprender mejor', v:true },
  { label:'Revisar tus errores en una prueba te ayuda a entender qué debes reforzar', v:true },
  { label:'Tener un horario fijo para estudiar te ayuda a crear un buen hábito', v:true },
  { label:'Preguntar cuando no entiendes un tema es parte de un buen hábito de estudio', v:true },
  { label:'Da lo mismo estudiar todo la noche antes de la prueba que estudiar durante varios días', v:false },
  { label:'Ignorar tus errores en una prueba es la mejor forma de mejorar', v:false },
  { label:'No es necesario tener ningún horario para estudiar, se puede improvisar siempre', v:false },
];

export function genManejoEmocional4Round(){
  const item = pick(EMOCIONES_ESTRATEGIA4_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así manejas la emoción sin lastimarte a ti ni a otros.',
  };
}

export function genAutocuidado4Round(){
  const item = pick(AUTOCUIDADO_4_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genBuenTrato4Round(){
  const item = pick(CONFLICTO_4_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema con respeto.',
  };
}

export function genHabitosEstudio4Round(){
  const item = pick(HABITOS_ESTUDIO_4_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

/* ---------------- Contenido Orientación 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/5-basico):
   Manejo Emocional V -> OA02 (distinguir y expresar emociones considerando
   el impacto en uno mismo Y en otras personas — un ángulo más que los años
   anteriores, que solo pedían identificar la emoción y una estrategia).
   Autocuidado Digital V -> OA04 (comunicación familiar, proteger la
   intimidad en redes sociales, uso seguro de internet — un tema
   completamente nuevo, los autocuidado de años anteriores cubrieron
   higiene/descanso/alimentación, nunca seguridad digital).
   Prevención y Vida Saludable -> OA05 (factores protectores frente al
   consumo de drogas: hábitos saludables, familia, amistades positivas,
   deporte — presentado siempre en clave preventiva y positiva, sin
   describir sustancias ni detalles operativos, igual que un texto escolar
   real de este nivel; complementa, sin repetir, el ángulo biológico que
   cubre CN05 OA06 en "Alimentación y Salud" de Ciencias Naturales).
   Buen Trato y Resolución de Conflictos V -> OA06-07 (solidaridad, empatía,
   resolución autónoma de conflictos, con escenarios nuevos).
   Hábitos de Trabajo Escolar V -> OA09 (metas propias y trabajo
   colaborativo, con afirmaciones nuevas).
   Quedan fuera: OA01 (valorar fortalezas propias, autorreflexión), OA03
   (desarrollo afectivo y sexual en la pubertad — igual que en años
   anteriores, requiere el acompañamiento real de un adulto, no una trivia
   de opción múltiple) y OA08 (participar en la comunidad escolar — ya
   cubierto por Formación Ciudadana V en historia.js). */
export const ORIENTACION_MODULES_G5 = [
  {id:'manejoemocional5', label:'Manejo Emocional V', open:true, key:'manejoemocional5'},
  {id:'autocuidadodigital5', label:'Autocuidado Digital V', open:true, key:'autocuidadodigital5'},
  {id:'prevencionsaludable5', label:'Prevención y Vida Saludable', open:true, key:'prevencionsaludable5'},
  {id:'buentrato5', label:'Buen Trato y Resolución de Conflictos V', open:true, key:'buentrato5'},
  {id:'habitosestudio5', label:'Hábitos de Trabajo Escolar V', open:true, key:'habitosestudio5'},
];
export const ORIENTACION_POS_G5 = [{x:20,y:92},{x:66,y:74},{x:22,y:52},{x:66,y:28},{x:22,y:6}];

const EMOCIONES_IMPACTO5_BANK = [
  { situacion:'Estás muy enojado porque perdiste un juego, y sientes ganas de gritarle a tu compañero de equipo.', correcta:'Reconocer tu enojo, respirar, y expresarlo con calma sin herir a tu compañero', malas:['Gritarle a tu compañero para desahogarte','Culparlo del resultado del juego','Guardarte el enojo y tratarlo mal en silencio'] },
  { situacion:'Sientes mucha alegría porque te fue muy bien en una prueba, pero tu compañero de al lado reprobó.', correcta:'Celebrar tu logro con moderación, siendo considerado con cómo se siente tu compañero', malas:['Presumir tu resultado frente a quien reprobó','Ignorar por completo cómo se siente tu compañero','Burlarte de quien le fue mal'] },
  { situacion:'Estás frustrado porque un trabajo grupal no avanza como esperabas, y tus compañeros también están cansados.', correcta:'Expresar tu frustración con calma y proponer una solución en conjunto', malas:['Explotar de rabia frente al grupo','Culpar a todos sin proponer nada','Abandonar el trabajo sin avisar'] },
  { situacion:'Sientes tristeza por una mala noticia, y notas que tu expresión está afectando el ánimo de tus amigos.', correcta:'Reconocer tu tristeza y comunicarla, cuidando también el ánimo del grupo', malas:['Contagiar tu mal humor a todo el grupo a propósito','Fingir que no pasa nada y explotar después','Aislarte sin decir qué te pasa'] },
  { situacion:'Sientes celos porque un amigo pasa más tiempo con otro compañero nuevo.', correcta:'Reconocer el sentimiento sin culpar a nadie, y hablarlo con tu amigo', malas:['Tratar mal al compañero nuevo por celos','Dejar de hablarle a tu amigo sin explicación','Hacer comentarios negativos a espaldas de ambos'] },
  { situacion:'Sientes mucho orgullo por un logro personal, y quieres compartirlo con tu curso.', correcta:'Compartir tu alegría con humildad, sin hacer sentir mal a quienes no lograron lo mismo', malas:['Presumir de forma exagerada frente a todos','Burlarte de quienes no lo lograron','Guardarte el logro y no compartirlo nunca'] },
  { situacion:'Sientes miedo antes de una prueba difícil, y notas que tu nerviosismo pone tenso a tu compañero de al lado.', correcta:'Reconocer tu miedo, calmarte con respiración, y no contagiar tu tensión a los demás', malas:['Contagiar tu nerviosismo hablando fuerte con todos','Ignorar por completo el miedo hasta que sea incontrolable','Culpar a la prueba de tu propio nerviosismo'] },
  { situacion:'Sientes admiración por un compañero que logró algo difícil, pero también un poco de envidia.', correcta:'Reconocer ambos sentimientos y felicitar genuinamente a tu compañero', malas:['Ignorar el logro de tu compañero por envidia','Hacer comentarios negativos sobre su logro','Fingir que no te importa cuando sí te importa'] },
  { situacion:'Te sientes aliviado después de resolver un problema, y notas que tu grupo también se relaja.', correcta:'Compartir tu alivio con el grupo y reconocer el esfuerzo de todos', malas:['Atribuirte todo el mérito sin reconocer al grupo','Ignorar cómo se siente el resto del grupo','Minimizar el esfuerzo de tus compañeros'] },
];
export function genManejoEmocional5Round(){
  const item = pick(EMOCIONES_IMPACTO5_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer, pensando en ti y en los demás?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así reconoces tu emoción sin dañar a quienes te rodean.',
  };
}

const AUTOCUIDADO_DIGITAL5_ITEMS = [
  { label:'Contarle a un adulto de confianza si algo te incomoda en internet es una buena práctica', v:true },
  { label:'Compartir tu dirección o teléfono con desconocidos en redes sociales es seguro', v:false },
  { label:'Mantener conversaciones frecuentes con tu familia sobre lo que haces en internet ayuda a tu seguridad', v:true },
  { label:'Aceptar solicitudes de amistad de cualquier desconocido en redes sociales es una buena idea', v:false },
  { label:'Revisar la configuración de privacidad de tus redes sociales ayuda a proteger tu información', v:true },
  { label:'Da lo mismo compartir fotos o datos personales con cualquier persona en internet', v:false },
  { label:'Pedir permiso a un adulto antes de usar una aplicación o red social nueva es una práctica segura', v:true },
  { label:'Si alguien en internet te pide guardar un secreto incómodo, lo correcto es contárselo a un adulto', v:true },
];
export function genAutocuidadoDigital5Round(){
  const item = pick(AUTOCUIDADO_DIGITAL5_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

const PREVENCION_SALUDABLE5_ITEMS = [
  { label:'Mantener buenos hábitos, como dormir bien y hacer deporte, es un factor protector para la salud', v:true },
  { label:'Tener una buena comunicación con tu familia es un factor protector importante', v:true },
  { label:'Elegir amistades que te apoyan y respetan es un factor protector para tomar buenas decisiones', v:true },
  { label:'Aceptar cualquier presión de un grupo, aunque vaya contra tus valores, es una buena decisión', v:false },
  { label:'Practicar un deporte o una actividad que te guste ayuda a ocupar bien tu tiempo libre', v:true },
  { label:'Da lo mismo con quién pasas tu tiempo libre, nunca influye en tus decisiones', v:false },
  { label:'Saber decir "no" ante una situación que te hace sentir incómodo es una habilidad protectora', v:true },
  { label:'Pedir ayuda a un adulto de confianza cuando algo te preocupa es una buena estrategia de prevención', v:true },
];
export function genPrevencionSaludable5Round(){
  const item = pick(PREVENCION_SALUDABLE5_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

const CONFLICTO_5_BANK = [
  { texto:'Un grupo de compañeros deja fuera de los juegos del recreo a un estudiante nuevo, sin motivo.', correcta:'Invitar al estudiante nuevo a participar y hablar con el grupo sobre incluirlo', malas:['Sumarte al grupo que lo excluye','Ignorar la situación por completo','Burlarte también del estudiante nuevo'] },
  { texto:'Dos compañeros de curso tienen opiniones opuestas sobre cómo organizar una actividad y empiezan a discutir fuerte.', correcta:'Proponer que cada uno escuche al otro y busquen una solución en conjunto', malas:['Tomar partido por uno sin escuchar al otro','Dejar que la discusión escale sin intervenir','Burlarte de ambos por discutir'] },
  { texto:'Un compañero comparte en el curso un rumor falso sobre otro estudiante.', correcta:'No repetir el rumor y conversar con quien lo compartió sobre el daño que puede causar', malas:['Repetir el rumor a más personas','Sumarte a burlarte del estudiante afectado','Ignorar el daño que puede causar el rumor'] },
  { texto:'Un compañero se siente excluido porque nadie lo elige para trabajar en grupo.', correcta:'Invitarlo a tu grupo de trabajo y tratarlo con respeto', malas:['Seguir excluyéndolo como el resto','Burlarte de que nadie lo elige','Ignorar cómo se siente'] },
  { texto:'Un compañero de curso tiene una discapacidad y algunos estudiantes se burlan de él.', correcta:'Defenderlo con respeto y avisar a un adulto sobre la burla', malas:['Sumarte a la burla para no quedar fuera','Ignorar la situación','Reírte en silencio sin decir nada'] },
  { texto:'Dos amigos discuten porque uno siente que el otro no cumplió su palabra.', correcta:'Conversar con calma sobre lo ocurrido y buscar reconstruir la confianza', malas:['Terminar la amistad sin conversarlo','Contarle a otros compañeros para "hacerle quedar mal"','Ignorar el problema esperando que se resuelva solo'] },
  { texto:'Un grupo de trabajo no logra ponerse de acuerdo en cómo repartir las tareas de un proyecto.', correcta:'Proponer repartir las tareas según las fortalezas de cada integrante, dialogando en conjunto', malas:['Repartir las tareas sin preguntarle a nadie','Dejar que una sola persona haga todo el trabajo','Discutir sin llegar a ningún acuerdo'] },
  { texto:'Un compañero comenta en tono de burla el acento o la forma de hablar de un estudiante de otra región.', correcta:'Hacerle notar que eso no está bien y valorar la diversidad de acentos y culturas', malas:['Reírte también para no quedar fuera del grupo','Ignorar el comentario ofensivo','Sumarte a la burla'] },
];
export function genBuenTrato5Round(){
  const item = pick(CONFLICTO_5_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que se puede hacer en esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el conflicto con respeto y empatía.',
  };
}

const HABITOS_ESTUDIO_5_BANK = [
  { label:'Establecer una meta clara antes de empezar una tarea ayuda a organizarte mejor', v:true },
  { label:'Trabajar en colaboración con tus compañeros, repartiendo tareas, ayuda a lograr mejores resultados', v:true },
  { label:'Revisar tu progreso hacia una meta te ayuda a saber si necesitas ajustar tu esfuerzo', v:true },
  { label:'Perseverar cuando una tarea se pone difícil, en vez de abandonar de inmediato, es un buen hábito', v:true },
  { label:'Da lo mismo tener una meta o no tenerla, el resultado siempre es igual', v:false },
  { label:'Ignorar por completo las ideas de tus compañeros en un trabajo grupal ayuda a avanzar más rápido', v:false },
  { label:'Abandonar una tarea apenas se pone un poco difícil es la mejor estrategia', v:false },
  { label:'Dividir una tarea grande en pasos más pequeños ayuda a no sentirte abrumado', v:true },
  { label:'Celebrar los avances pequeños hacia una meta ayuda a mantener la motivación', v:true },
  { label:'Comparar constantemente tu progreso con el de otros, en vez de con tus propias metas, es lo más útil', v:false },
];
export function genHabitosEstudio5Round(){
  const item = pick(HABITOS_ESTUDIO_5_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

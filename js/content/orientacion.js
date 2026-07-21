import { pick, shuffle } from '../utils.js';

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
  { emoji:'🪥', label:'Lavarte los dientes es parte de cuidar tu cuerpo', v:true },
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

/* ---------------- Contenido Orientación 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/3-basico):
   OA02 -> Mis Emociones III (estrategias de manejo emocional, no solo
   identificarlas) · OA04 -> Autocuidado y Prevención (higiene, cuerpo e
   intimidad, datos personales, y — siguiendo el propio texto del OA — una
   mención age-appropriate y no alarmista sobre pedir ayuda a un adulto de
   confianza ante secretos incómodos, y decir que no ante drogas/alcohol,
   con el mismo tono preventivo y factual que usan los programas de
   "Habilidades para la Vida" en colegios chilenos) · OA05-06 -> Buena
   Convivencia III (empatía, no discriminación, resolución de conflictos por
   escenario) · OA08 -> Hábitos de Trabajo Escolar III.
   Queda fuera OA01,03,07 (autodescripción, sexualidad como vínculo afectivo,
   participación en la organización del curso — subjetivos, reflexivos o de
   desarrollo personal profundo, no aptos para opción múltiple). */
export const ORIENTACION_MODULES_G3 = [
  {id:'emociones3', label:'Mis Emociones III', open:true, key:'emociones3'},
  {id:'autocuidado3', label:'Autocuidado y Prevención', open:true, key:'autocuidado3'},
  {id:'convivencia3', label:'Buena Convivencia III', open:true, key:'convivencia3'},
  {id:'habitosescolares3', label:'Hábitos de Trabajo Escolar III', open:true, key:'habitosescolares3'},
];
export const ORIENTACION_POS_G3 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

const EMOCIONES_MANEJO_BANK = [
  { texto:'Sientes mucha rabia porque perdiste un juego.', correcta:'Respirar profundo y esperar un momento antes de reaccionar', malas:['Gritarle a tus compañeros','Tirar las cosas al suelo','Pegarle a alguien'] },
  { texto:'Estás muy nervioso antes de una presentación en el colegio.', correcta:'Respirar profundo y recordar que has practicado', malas:['Salir corriendo de la sala','Negarte a participar sin avisar','Molestar a un compañero'] },
  { texto:'Un compañero te molesta y sientes que te vas a enojar mucho.', correcta:'Contar hasta diez y pensar antes de actuar', malas:['Responder con un golpe','Gritar muy fuerte','Romper sus cosas'] },
  { texto:'Sientes pena porque algo no te salió como esperabas.', correcta:'Reconocer cómo te sientes y hablarlo con alguien de confianza', malas:['Guardarte todo y no decir nada nunca','Culpar a otros de lo que pasó','Aislarte de todos por mucho tiempo'] },
];
const AUTOCUIDADO_3_ITEMS = [
  { emoji:'🛌', label:'Dormir suficientes horas cada noche es parte del autocuidado', v:true },
  { emoji:'🥗', label:'Comer variado y saludable es parte de cuidar tu cuerpo', v:true },
  { emoji:'🔒', label:'Tu cuerpo es tuyo: puedes decir "no" si alguien quiere tocarlo sin tu permiso', v:true },
  { emoji:'🗣️', label:'Si un adulto te pide guardar un secreto que te hace sentir mal, debes contárselo a otro adulto de confianza', v:true },
  { emoji:'🚭', label:'Si alguien te ofrece cigarros, alcohol u otras drogas, lo correcto es decir que no y avisar a un adulto', v:true },
  { emoji:'📵', label:'No debes dar tu dirección, clave o datos personales a desconocidos, ni en persona ni por internet', v:true },
  { emoji:'🚫', label:'Está bien guardar cualquier secreto que un adulto te pida, sin excepción', v:false },
  { emoji:'🍺', label:'Probar alcohol o cigarros está bien si un amigo te insiste', v:false },
];
const CONFLICTO_3_BANK = [
  { texto:'Un compañero fue discriminado por su forma de hablar.', correcta:'Defenderlo y decir que eso no está bien', malas:['Reírte también','Ignorar la situación','Sumarte a la burla'] },
  { texto:'Dos compañeros no logran ponerse de acuerdo en un trabajo grupal.', correcta:'Escuchar a ambos y buscar una solución que sirva a los dos', malas:['Tomar partido sin escuchar','Dejar que discutan sin ayudar','Decidir tú solo sin preguntar'] },
  { texto:'Un compañero nuevo no conoce a nadie en el curso.', correcta:'Acercarte, presentarte y ayudarlo a integrarse', malas:['Ignorarlo','Dejarlo solo todo el día','Burlarte de que no conoce a nadie'] },
  { texto:'Alguien te cuenta un problema y necesita ser escuchado.', correcta:'Ponerte en su lugar y escucharlo con atención', malas:['Interrumpirlo para hablar de ti','Restarle importancia a lo que siente','Contárselo a otros sin su permiso'] },
];
const HABITOS_ESTUDIO_3_ITEMS = [
  { emoji:'⏰', label:'Llegar puntualmente a clases es un buen hábito de estudio', v:true },
  { emoji:'📅', label:'Entregar los trabajos en la fecha acordada demuestra responsabilidad', v:true },
  { emoji:'🧠', label:'Buscar información sobre temas que te interesan ayuda a aprender más', v:true },
  { emoji:'📋', label:'Organizar tu tiempo y tus útiles te ayuda a estudiar mejor', v:true },
  { emoji:'📄', label:'Copiar el trabajo de un compañero en vez de hacerlo tú es un buen hábito', v:false },
  { emoji:'🚪', label:'Interrumpir el trabajo de otros compañeros ayuda a que todos aprendan', v:false },
];

export function genEmociones3Round(){
  const item = pick(EMOCIONES_MANEJO_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así manejas la emoción sin lastimarte ni lastimar a otros.',
  };
}

export function genAutocuidado3Round(){
  const item = pick(AUTOCUIDADO_3_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genConvivencia3Round(){
  const item = pick(CONFLICTO_3_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema sin lastimar a nadie.',
  };
}

export function genHabitosEscolares3Round(){
  const item = pick(HABITOS_ESTUDIO_3_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

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
const AUTOCUIDADO_2_ITEMS = [
  { emoji:'🛌', label:'Dormir la cantidad de horas necesarias ayuda a tu cuerpo a descansar', v:true },
  { emoji:'🧴', label:'Lavarte las manos antes de comer evita que te enfermes', v:true },
  { emoji:'🥦', label:'Comer verduras y frutas variadas es parte de una buena alimentación', v:true },
  { emoji:'🔒', label:'Está bien decir "no" si alguien quiere tocar tu cuerpo sin tu permiso', v:true },
  { emoji:'📵', label:'No debes dar tu dirección o teléfono a personas desconocidas por internet', v:true },
  { emoji:'🍭', label:'Comer solo dulces todos los días es parte de una alimentación saludable', v:false },
  { emoji:'🌙', label:'No importa dormir poco, tu cuerpo no lo necesita', v:false },
  { emoji:'📢', label:'Está bien compartir tu dirección con cualquier persona que la pida', v:false },
];
const HABITOS_ESCOLARES_BANK = [
  { emoji:'🎒', label:'Traer tus útiles escolares todos los días te ayuda a aprender mejor', v:true },
  { emoji:'🧹', label:'Mantener ordenada tu sala de clases ayuda a todos a concentrarse', v:true },
  { emoji:'✅', label:'Reconocer lo que aprendiste cada día te ayuda a motivarte para seguir aprendiendo', v:true },
  { emoji:'🗑️', label:'Dejar tus materiales tirados por el suelo es un buen hábito de estudio', v:false },
  { emoji:'😴', label:'No importa cuidar tus útiles, siempre puedes perderlos sin problema', v:false },
  { emoji:'📚', label:'Cuidar tus cuadernos y libros te ayuda a tenerlos listos cuando los necesites', v:true },
];
const CONFLICTO_2_BANK = [
  { texto:'Dos compañeros quieren ser los primeros en la fila.', correcta:'Ponerse de acuerdo y turnarse', malas:['Empujarse para pasar primero','Pelear por el lugar','Quejarse a gritos'] },
  { texto:'Un compañero está triste porque nadie quiere jugar con él.', correcta:'Invitarlo a jugar contigo y tu grupo', malas:['Ignorarlo','Burlarte de él','Decirle que se aleje'] },
  { texto:'No estás de acuerdo con la idea de un compañero para el juego.', correcta:'Escuchar su idea y buscar un acuerdo entre ambos', malas:['Imponer tu idea a la fuerza','Gritarle que está equivocado','Dejar de jugar enojado'] },
  { texto:'Dos amigos no logran decidir a qué juego jugar primero.', correcta:'Proponer turnarse: un rato cada juego', malas:['Que uno decida a la fuerza','Pelear hasta que uno se vaya','No jugar ninguno de los dos por rabia'] },
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

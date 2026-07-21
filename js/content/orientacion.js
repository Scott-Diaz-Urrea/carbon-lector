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

/* ---------------- Contenido Orientación 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/4-basico):
   OA02 -> Mis Emociones IV · OA05 -> Autocuidado IV (higiene, descanso,
   alimentación — versión simplificada este año) · OA06-07 -> Buena
   Convivencia IV · OA09 -> Hábitos de Trabajo Escolar IV.
   Deliberadamente fuera: OA01 (autodescripción, subjetivo) y — decisión
   explícita siguiendo la regla de oro del proyecto — OA03-04 (sexualidad
   como expresión de vínculo/amor, cambios físicos y afectivos de la
   pubertad): son temas legítimos del currículum oficial pero de desarrollo
   personal profundo y sensible, sin una "respuesta correcta" evaluable con
   opción múltiple; no se fuerza su cobertura para no trivializar un tema
   que en la práctica requiere acompañamiento de un adulto/profesional, no
   un quiz. OA08 (participación en organización del curso) también queda
   fuera por ser de desempeño. */
export const ORIENTACION_MODULES_G4 = [
  {id:'emociones4', label:'Mis Emociones IV', open:true, key:'emociones4'},
  {id:'autocuidado4', label:'Autocuidado IV', open:true, key:'autocuidado4'},
  {id:'convivencia4', label:'Buena Convivencia IV', open:true, key:'convivencia4'},
  {id:'habitosescolares4', label:'Hábitos de Trabajo Escolar IV', open:true, key:'habitosescolares4'},
];
export const ORIENTACION_POS_G4 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

const EMOCIONES_MANEJO_4_BANK = [
  { texto:'Sientes envidia porque un amigo tiene algo que tú quieres.', correcta:'Reconocer el sentimiento y hablar de ello con calma', malas:['Quitarle la cosa a la fuerza','Hablar mal de tu amigo con otros','Ignorar cómo te sientes y explotar después'] },
  { texto:'Te sientes frustrado porque no logras algo a la primera.', correcta:'Respirar, tomar un descanso y volver a intentarlo', malas:['Rendirte para siempre','Romper lo que estabas haciendo','Culpar a otros de tu frustración'] },
  { texto:'Un amigo te cuenta un secreto y te pide no contarlo.', correcta:'Respetar su confianza si no hay peligro para nadie', malas:['Contarlo a todo el curso','Burlarte de su secreto','Usarlo en su contra luego'] },
];
const AUTOCUIDADO_4_ITEMS = [
  { emoji:'🦷', label:'Cepillarte los dientes después de cada comida cuida tu salud bucal', v:true },
  { emoji:'😴', label:'Dormir las horas necesarias ayuda a tu cuerpo a rendir mejor', v:true },
  { emoji:'🥕', label:'Comer variado, con frutas y verduras, es parte de una vida sana', v:true },
  { emoji:'🏃', label:'Hacer actividad física recreativa es parte del autocuidado', v:true },
  { emoji:'🚫', label:'No importa cuántas horas duermas, tu cuerpo funciona igual', v:false },
];
const CONVIVENCIA_4_BANK = [
  { texto:'Dos compañeros compiten por ser elegidos líder del grupo.', correcta:'Proponer una votación justa y aceptar el resultado', malas:['Pelear por el puesto','Hacer trampa en la votación','Excluir al que pierda'] },
  { texto:'Un grupo no logra ponerse de acuerdo en cómo resolver un problema.', correcta:'Dialogar, escuchar todas las ideas y buscar un punto en común', malas:['Que el más fuerte decida solo','Dejar el problema sin resolver','Pelear hasta que alguien se rinda'] },
  { texto:'Alguien fue tratado injustamente por su apariencia física.', correcta:'Manifestar respeto y defender un trato igualitario', malas:['Sumarte al trato injusto','Ignorar la situación','Burlarte también'] },
];
const HABITOS_ESTUDIO_4_ITEMS = [
  { emoji:'⏰', label:'Asistir puntualmente a clases es un buen hábito de estudio', v:true },
  { emoji:'📚', label:'Cumplir a tiempo con los trabajos pedidos demuestra responsabilidad', v:true },
  { emoji:'🔍', label:'Buscar información sobre temas de tu interés te ayuda a aprender más', v:true },
  { emoji:'🚫', label:'Copiar el trabajo de otro compañero (plagio) es una forma válida de estudiar', v:false },
  { emoji:'🤝', label:'Respetar el estudio y el trabajo de los demás ayuda a un buen ambiente de clase', v:true },
];

export function genEmociones4Round(){
  const item = pick(EMOCIONES_MANEJO_4_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así manejas la emoción sin lastimarte ni lastimar a otros.',
  };
}

export function genAutocuidado4Round(){
  const item = pick(AUTOCUIDADO_4_ITEMS);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

export function genConvivencia4Round(){
  const item = pick(CONVIVENCIA_4_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema con respeto.',
  };
}

export function genHabitosEscolares4Round(){
  const item = pick(HABITOS_ESTUDIO_4_ITEMS);
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

import { pick, shuffle } from '../utils.js';
import { toothbrushSVG } from '../svg.js';

export const ORIENTACION_MODULES = [
  {id:'emociones', label:'Mis Emociones', open:true, key:'emociones'},
  {id:'autocuidado', label:'Autocuidado y Hábitos', open:true, key:'autocuidado'},
  {id:'convivencia', label:'Buena Convivencia', open:true, key:'convivencia'},
  {id:'examenorientacion1', label:'Examen Final', open:true, key:'examenorientacion1'},
];
/* 4° nodo agregado (2026-08-09, "Examen Final") — las 3 posiciones
   existentes se recalcularon para el nuevo height:480 (antes 340)
   preservando su posición en píxeles, mismo criterio ya usado en Artes
   Visuales/Música/Educación Física. */
export const ORIENTACION_POS = [{x:24,y:86},{x:70,y:65},{x:24,y:43},{x:70,y:22}];

/* ---------------- Contenido Orientación 1° Básico ----------------
   OA02 -> Mis Emociones · OA04,08 -> Autocuidado y Hábitos · OA05-07 -> Buena
   Convivencia. OA01,03 (autodescripción y expresión de afecto personal)
   quedaron fuera por ser subjetivos/reflexivos, no aptos para opción múltiple. */
const EMOCIONES_ITEMS = [
  { emoji:'😄', label:'Alegría', desc:'Sientes esto cuando algo te hace muy feliz.' },
  { emoji:'😢', label:'Pena', desc:'Sientes esto cuando algo te pone triste.' },
  { emoji:'😠', label:'Rabia', desc:'Sientes esto cuando algo te molesta mucho.' },
  { emoji:'😨', label:'Miedo', desc:'Sientes esto cuando algo te asusta.' },
  { emoji:'😲', label:'Sorpresa', desc:'Sientes esto cuando pasa algo que no esperabas.' },
  { emoji:'🥰', label:'Cariño', desc:'Sientes esto cuando quieres mucho a alguien.' },
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
  { emoji:'🌟', label:'Reconocer los nuevos aprendizajes que vas logrando te ayuda a motivarte', v:true },
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

const EMOCIONES_LABELS_2 = ['Alegría','Pena','Rabia','Miedo','Sorpresa','Cariño'];
const EMOCIONES_ESCENAS_2 = [
  { texto:'A Pedro se le perdió su juguete favorito y no lo puede encontrar.', emocion:'Pena' },
  { texto:'Sofía ganó el primer lugar en la carrera de la escuela.', emocion:'Alegría' },
  { texto:'Un perro grande le ladró fuerte a Martín en la calle.', emocion:'Miedo' },
  { texto:'Alguien le quitó su lápiz favorito sin pedirlo.', emocion:'Rabia' },
  { texto:'Vio una película con un final que no se esperaba para nada.', emocion:'Sorpresa' },
  { texto:'Su mamá lo abrazó fuerte al llegar a casa después del colegio.', emocion:'Cariño' },
  { texto:'Se despertó en la noche por un ruido muy fuerte y desconocido.', emocion:'Miedo' },
  { texto:'Le regalaron el cuento que tanto quería para su cumpleaños.', emocion:'Alegría' },
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
  const recurso = 'Las emociones no aparecen de la nada: cada situación que vives puede despertar una emoción distinta y esperable, aunque no siempre sea la misma para todas las personas. Reconocer qué emoción es "lo más común" sentir ante una situación (por ejemplo, miedo ante un peligro, o alegría ante una sorpresa agradable) te ayuda a anticipar y entender mejor tus propias reacciones y las de los demás. Esto es un paso más avanzado que solo identificar una emoción en una cara: aquí practicas conectar una situación completa con la emoción que probablemente genera, lo que te prepara para manejar mejor tus reacciones en la vida real.';
  const item = pick(EMOCIONES_ESCENAS_2);
  const distract = shuffle(EMOCIONES_LABELS_2.filter(function(e){ return e!==item.emocion; })).slice(0,3);
  const opts = shuffle([item.emocion].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué emoción sentiría probablemente?</p>',
    options: opts, correctValue: item.emocion, speakText: item.texto, cols:4, kind:'word',
    explain: 'Ante esa situación, lo más común es sentir <b>'+item.emocion.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genAutocuidado2Round(){
  const recurso = 'El autocuidado en 2° básico profundiza los mismos hábitos de 1° básico (higiene, alimentación, descanso) pero esperando más autonomía de tu parte: reconocer tú mismo cuándo necesitas lavarte las manos, cuándo abrigarte, o cuándo descansar, sin que un adulto te lo tenga que decir cada vez. Practicar estos hábitos de forma independiente es un paso importante hacia ser más responsable de tu propio bienestar a medida que creces.';
  const item = pick(AUTOCUIDADO_2_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genHabitosEscolares2Round(){
  const recurso = 'Los <b>hábitos de trabajo escolar</b> son las conductas que te ayudan a aprender mejor en clases y a organizarte con tus tareas: prestar atención cuando el profesor explica, ordenar tus materiales antes de empezar una actividad, terminar lo que empiezas, y pedir ayuda cuando no entiendes algo en vez de quedarte con la duda. Estos hábitos no dependen de qué tan "inteligente" seas — cualquier estudiante puede aprender a organizarse mejor practicando estas conductas una y otra vez, hasta que se vuelvan automáticas.';
  const item = pick(HABITOS_ESCOLARES_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genConvivencia2Round(){
  const recurso = 'Resolver un conflicto entre compañeros de buena manera significa hablar sobre el problema con calma, escuchar el punto de vista del otro, y buscar una solución que sea justa para ambos — no significa pelear, gritar, ni tampoco quedarse callado para evitar el problema (eso no lo resuelve, solo lo esconde). Practicar la resolución pacífica de conflictos desde pequeño te da una herramienta que vas a necesitar toda la vida, porque los desacuerdos entre personas son normales y van a seguir apareciendo — lo importante es aprender a manejarlos bien.';
  const item = pick(CONFLICTO_2_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así se resuelve el problema sin lastimar a nadie.',
    recurso: recurso,
  };
}

/* Niveles de dificultad (2026-08-09, mismo motor que el resto de 1°
   básico). `nivel` opcional; sin argumento, comportamiento original. */
export function genEmocionesRound(nivel){
  const recurso = 'Reconocer emociones (alegría, tristeza, miedo, enojo, sorpresa) en una cara o en una descripción es el primer paso para poder manejarlas bien. Cada emoción es una señal que tu cuerpo te manda: el miedo te avisa de un peligro, la tristeza aparece cuando pierdes algo importante, la alegría cuando algo te sale bien. Ninguna emoción es "mala" en sí misma — todas cumplen un propósito —, pero aprender a identificarlas con su nombre correcto te ayuda a explicar cómo te sientes a otras personas, en vez de solo actuar sin entender por qué.';
  const item = pick(EMOCIONES_ITEMS);
  let distract = shuffle(EMOCIONES_ITEMS.filter(function(e){ return e.label!==item.label; })).map(function(e){ return e.label; });
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.label].concat(distract)).map(function(e){ return {label:e, value:e}; });
  if(Math.random()<0.5){
    /* Acá el emoji de la cara ES la información real (reconocer una
       expresión facial) — se mantiene siempre visible en los 3 niveles,
       a diferencia de la otra rama, que usa un emoji genérico decorativo. */
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué emoción muestra esta cara?</p>',
      options: opts, correctValue: item.label, speakText: item.label, cols:4, kind:'word',
      explain: 'Esta cara muestra <b>'+item.label.toLowerCase()+'</b>: '+item.desc.toLowerCase(),
      recurso: recurso,
    };
  }
  const showGenericEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showGenericEmoji ? '<span class="prompt-emoji">💭</span>' : '')+'<p class="prompt-hint">'+item.desc+' ¿Qué emoción es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa descripción corresponde a la <b>'+item.label.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genAutocuidadoRound(nivel){
  const recurso = 'El <b>autocuidado</b> son los hábitos que tú mismo puedes practicar todos los días para mantenerte sano, sin depender de que un adulto te lo recuerde siempre: lavarte las manos antes de comer, cepillarte los dientes, dormir temprano, y comer alimentos variados. Aprender estos hábitos desde pequeño es importante porque, con el tiempo, se convierten en algo automático que haces por costumbre — y esos hábitos que formas ahora son los que probablemente sigas practicando de adulto.';
  const showEmoji = nivel !== 'dificil';
  const item = pick(AUTOCUIDADO_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

export function genConvivenciaRound(nivel){
  const recurso = 'La <b>buena convivencia</b> es el conjunto de conductas que hacen que un grupo (tu curso, tu familia, tus amigos) pueda estar junto sin problemas: compartir, esperar tu turno, pedir las cosas por favor, escuchar cuando otro habla, y resolver los conflictos hablando en vez de peleando. No es algo que "simplemente pasa" — se construye con pequeñas acciones diarias de cada persona del grupo. Reconocer qué conductas ayudan a la buena convivencia (y cuáles la dañan) te prepara para ser un buen compañero en cualquier grupo del que formes parte.';
  const showEmoji = nivel !== 'dificil';
  const item = pick(CONVIVENCIA_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

/* "Examen Final" (mismo patrón que el resto de 1° básico): mezcla los 3
   módulos de Orientación 1° básico + los 3 niveles al azar. */
export function genExamenOrientacion1Round(){
  const gens = [genEmocionesRound, genAutocuidadoRound, genConvivenciaRound];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
    explain: 'Lo mejor es "'+item.correcta+'" — así manejas la emoción sin lastimarte a ti ni a otros.',
    recurso: 'El manejo emocional no significa "no sentir" emociones difíciles como el enojo o la frustración —eso es imposible y no es la meta—, sino aprender estrategias para expresarlas sin lastimarte a ti mismo ni a los demás: respirar hondo antes de reaccionar, hablar de lo que sientes en vez de explotar, o alejarte un momento de la situación para calmarte. Practicar estas estrategias desde pequeño te da herramientas que vas a necesitar toda la vida, porque las emociones intensas van a seguir apareciendo — lo que cambia con la práctica es cómo las manejas.',
  };
}

export function genAutocuidado3Round(){
  const item = pick(AUTOCUIDADO_3_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'El autocuidado en 3° básico sigue profundizando tu independencia para cuidar tu propio cuerpo: mantener buena higiene, alimentarte bien, descansar lo suficiente, y reconocer cuándo necesitas ayuda de un adulto (por ejemplo, si te sientes enfermo o en peligro). Ser cada vez más responsable de tu propio bienestar, sin depender de que un adulto te lo recuerde constantemente, es una habilidad que sigue creciendo contigo año a año.',
  };
}

export function genBuenTrato3Round(){
  const item = pick(CONFLICTO_3_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así se resuelve el problema con respeto.',
    recurso: 'El "buen trato" significa tratar a los demás con respeto y empatía, incluso cuando hay un desacuerdo o alguien está teniendo dificultades: apoyar a un compañero que está siendo molestado, escuchar distintos puntos de vista antes de decidir algo en grupo, y preguntar en vez de excluir cuando alguien no quiere participar. Resolver los conflictos con buen trato —hablando y escuchando— en vez de ignorarlos o pelear, es una habilidad social que te sirve para llevarte mejor con cualquier grupo de personas en tu vida.',
  };
}

export function genHabitosEstudio3Round(){
  const item = pick(HABITOS_ESTUDIO_3_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'Buenos hábitos de estudio no son un talento con el que naces, son conductas que puedes practicar y mejorar: organizar un horario para no dejar las tareas para el último momento, tener un lugar tranquilo y ordenado para estudiar, revisar tu mochila la noche anterior, y repasar lo aprendido en clases al llegar a casa. Pedir ayuda cuando no entiendes algo también es parte de tener buenos hábitos —no es una debilidad, es una estrategia inteligente— porque te permite resolver dudas antes de que se acumulen.',
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
    explain: 'Lo mejor es "'+item.correcta+'" — así manejas la emoción sin lastimarte a ti ni a otros.',
    recurso: 'El <b>manejo emocional</b> no significa esconder o negar lo que sientes, sino reconocer la emoción (celos, decepción, ansiedad, orgullo, frustración) y elegir una respuesta que no te dañe a ti ni a otros. Un primer paso útil es simplemente nombrar la emoción ("estoy sintiendo celos" o "esto me da vergüenza") — ponerle nombre a lo que sientes ayuda a que no te controle por completo. Después, hay estrategias concretas según la emoción: respirar y calmarte ante la frustración, conversar con un adulto de confianza ante la ansiedad, o reconocer tu esfuerzo aunque no hayas ganado. Con práctica, manejar tus emociones se vuelve más fácil, igual que cualquier otra habilidad.',
  };
}

export function genAutocuidado4Round(){
  const item = pick(AUTOCUIDADO_4_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'El <b>autocuidado</b> es todo lo que haces para mantener tu cuerpo y tu bienestar en buen estado: dormir lo suficiente, mantener buenos hábitos de higiene, elegir una alimentación variada con frutas y verduras, y hacer pausas para estirarte si llevas mucho tiempo sentado. También incluye reconocer tus propios límites — saber cuándo necesitas descansar y respetar esa necesidad, en vez de ignorarla. Pedir ayuda a un adulto de confianza cuando algo te preocupa también es una forma válida de autocuidado: cuidarte no significa resolver todo solo, sino saber cuándo necesitas apoyo de otra persona.',
  };
}

export function genBuenTrato4Round(){
  const item = pick(CONFLICTO_4_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que pueden hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así se resuelve el problema con respeto.',
    recurso: 'Resolver un conflicto de buena manera casi siempre empieza con lo mismo: escuchar todas las partes involucradas antes de sacar conclusiones, y buscar una solución en conjunto en vez de imponer una idea sin conversar. Frente a una injusticia (como que alguien se burle de un compañero, o que un nuevo estudiante se sienta excluido), la mejor respuesta suele ser acercarse con empatía, apoyar a quien está siendo afectado, y —si la situación lo requiere— buscar la ayuda de un adulto, en vez de sumarte al comportamiento injusto o ignorarlo. Practicar el buen trato en situaciones pequeñas del día a día te prepara para resolver conflictos más grandes de forma pacífica en el futuro.',
  };
}

export function genHabitosEstudio4Round(){
  const item = pick(HABITOS_ESTUDIO_4_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: 'Los buenos <b>hábitos de estudio</b> se construyen con constancia, no con esfuerzo de último minuto: estudiar un poco cada día rinde mucho más que intentar aprenderlo todo la noche anterior a una prueba, porque el cerebro necesita tiempo para consolidar lo aprendido. Anotar tareas y fechas de entrega en una agenda, tener un horario fijo para estudiar, y preguntar cuando algo no se entiende son hábitos simples que marcan una gran diferencia con el tiempo. Revisar tus propios errores después de una prueba —en vez de solo mirar la nota— también es clave: te muestra exactamente qué necesitas reforzar antes de la próxima evaluación.',
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
  const recurso = 'Identificar una emoción es solo el primer paso: también importa pensar en cómo esa emoción afecta a las personas que te rodean, no solo a ti. Antes de reaccionar por impulso (gritar, pegar, aislarse), ayuda reconocer qué se está sintiendo, respirar, y elegir una forma de expresarlo que no dañe a nadie — por ejemplo, contarle a alguien cómo te sientes en vez de actuar de inmediato. Manejar así las emociones fortalece las relaciones con los demás y ayuda a resolver mejor los conflictos.';
  const item = pick(EMOCIONES_IMPACTO5_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer, pensando en ti y en los demás?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así reconoces tu emoción sin dañar a quienes te rodean.', recurso: recurso,
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
  const recurso = 'Cuidarse en internet significa proteger tu información personal (nombre completo, dirección, teléfono, fotos) y no compartirla con desconocidos, revisar la configuración de privacidad de tus redes sociales, y pedir permiso a un adulto antes de usar aplicaciones nuevas. Si algo te incomoda en internet, o si alguien te pide guardar un secreto que te hace sentir mal, lo correcto siempre es contárselo a un adulto de confianza — mantener una buena comunicación con tu familia sobre lo que haces en línea es la mejor protección.';
  const item = pick(AUTOCUIDADO_DIGITAL5_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  const recurso = 'Un <b>factor protector</b> es algo que ayuda a una persona a tomar buenas decisiones y a mantenerse alejada de conductas de riesgo: buenos hábitos (dormir bien, hacer deporte), una buena comunicación con la familia, amistades que apoyan y respetan, y saber decir "no" ante una presión que va contra los propios valores. Ocupar el tiempo libre en actividades que gustan (un deporte, un pasatiempo) y pedir ayuda a un adulto de confianza cuando algo preocupa son también estrategias de prevención importantes.';
  const item = pick(PREVENCION_SALUDABLE5_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  const recurso = 'Resolver un conflicto de forma pacífica no significa ignorarlo ni tomar partido sin escuchar: significa reconocer lo que pasó, escuchar a las personas involucradas con empatía, y buscar una solución en conjunto que respete a todos. La <b>solidaridad</b> —defender a alguien que está siendo excluido o molestado, incluir a quien queda fuera de un grupo, o simplemente avisar a un adulto cuando algo no está bien— fortalece la convivencia mucho más que ignorar el problema o sumarse a una burla para no quedar fuera del grupo.';
  const item = pick(CONFLICTO_5_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que se puede hacer en esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así se resuelve el conflicto con respeto y empatía.', recurso: recurso,
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
  const recurso = 'Tener buenos <b>hábitos de trabajo escolar</b> empieza por fijarse una meta clara antes de comenzar una tarea, dividir tareas grandes en pasos más pequeños para no sentirse abrumado, y revisar el propio progreso para saber si hace falta ajustar el esfuerzo. Perseverar cuando algo se pone difícil (en vez de abandonar de inmediato), celebrar los avances pequeños, y trabajar en colaboración repartiendo tareas con los compañeros son estrategias que ayudan a lograr mejores resultados que compararse constantemente con el desempeño de otros.';
  const item = pick(HABITOS_ESTUDIO_5_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Orientación 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/orientacion/6-basico): OA01-02,04-09 repiten casi textualmente la
   redacción de 5° básico, así que los 5 módulos usan escenarios y afirmaciones
   completamente nuevos. Manejo Emocional VI -> OA02. Autocuidado Digital VI ->
   OA04. Prevención VI -> OA05 (esta vez el texto del OA nombra ejemplos
   explícitos: tabaco, alcohol, marihuana — se incluyen de forma factual y
   preventiva, sin detalles operativos, igual que en 5° básico). Buen Trato y
   Resolución de Conflictos VI -> OA06-07. Hábitos de Trabajo Escolar VI ->
   OA09. Quedan fuera: OA01 (valorar fortalezas propias), OA03 (desarrollo
   afectivo y sexual en la pubertad — mismo criterio de todos los años
   anteriores: requiere el acompañamiento real de un adulto) y OA08
   (participación en la comunidad escolar — ya cubierta por Formación
   Ciudadana VI en historia.js). */
export const ORIENTACION_MODULES_G6 = [
  {id:'manejoemocional6', label:'Manejo Emocional VI', open:true, key:'manejoemocional6'},
  {id:'autocuidadodigital6', label:'Autocuidado Digital VI', open:true, key:'autocuidadodigital6'},
  {id:'prevencion6', label:'Prevención VI', open:true, key:'prevencion6'},
  {id:'buentrato6', label:'Buen Trato y Resolución de Conflictos VI', open:true, key:'buentrato6'},
  {id:'habitosestudio6', label:'Hábitos de Trabajo Escolar VI', open:true, key:'habitosestudio6'},
];
export const ORIENTACION_POS_G6 = [{x:20,y:92},{x:66,y:74},{x:22,y:52},{x:66,y:28},{x:22,y:6}];

const EMOCIONES_6_BANK = [
  { situacion:'Sientes decepción porque no quedaste seleccionado en un equipo, y notas que otro compañero tampoco quedó y se ve muy triste.', correcta:'Reconocer tu propia decepción y apoyar a tu compañero que se siente igual', malas:['Burlarte de tu compañero por no quedar seleccionado','Ignorar tu decepción hasta explotar después','Culpar al entrenador sin ninguna razón'] },
  { situacion:'Sientes mucho entusiasmo por un viaje familiar, pero notas que un amigo cercano está pasando por un momento difícil.', correcta:'Compartir tu alegría con moderación y mostrar interés genuino por lo que le pasa a tu amigo', malas:['Hablar solo de tu viaje sin preguntarle nada a tu amigo','Ocultar completamente tu alegría por su situación','Ignorar la situación de tu amigo'] },
  { situacion:'Sientes inseguridad antes de presentar un proyecto importante frente al curso.', correcta:'Reconocer la inseguridad, prepararte bien y recordar tus fortalezas', malas:['Evitar presentar sin avisarle a nadie','Fingir estar enfermo para no presentar','Culpar al proyecto de tu inseguridad'] },
  { situacion:'Sientes rabia porque un compañero de equipo cometió un error que les costó el partido.', correcta:'Expresar tu frustración con respeto y recordar que todos cometen errores', malas:['Gritarle al compañero frente a todo el equipo','Excluirlo de futuros partidos por el error','Guardar rencor sin conversarlo nunca'] },
  { situacion:'Sientes envidia porque un compañero recibió un reconocimiento que tú también querías.', correcta:'Reconocer el sentimiento sin culpar a tu compañero, y felicitarlo genuinamente', malas:['Hablar mal de tu compañero a espaldas de todos','Ignorar por completo su logro con rencor','Exigir que te den el mismo reconocimiento sin merecerlo'] },
  { situacion:'Sientes vergüenza porque te equivocaste al hablar frente a todo el curso.', correcta:'Reconocer el error con calma, sin dejar que la vergüenza te paralice', malas:['Evitar hablar en público nunca más','Culpar a otros por tu propio error','Salir corriendo de la sala'] },
  { situacion:'Sientes calma y satisfacción después de resolver un conflicto con un amigo con quien estabas peleado.', correcta:'Reconocer ese bienestar y valorar el esfuerzo de ambos por resolverlo', malas:['Restregarle a tu amigo que tú tenías la razón','Desconfiar de la reconciliación sin motivo','Guardar resentimiento a pesar de haberlo resuelto'] },
  { situacion:'Sientes miedo escénico antes de participar en una obra de teatro escolar, y notas que otro compañero también está nervioso.', correcta:'Reconocer el miedo, apoyar a tu compañero, y recordar que ambos se están preparando', malas:['Burlarte del nerviosismo de tu compañero','Abandonar la obra sin avisar a nadie','Fingir que no sientes nada de miedo'] },
  { situacion:'Sientes tristeza porque te mudaste de colegio y extrañas a tus antiguos amigos.', correcta:'Reconocer la tristeza y buscar formas de mantener el contacto, mientras conoces gente nueva', malas:['Negarte a hacer nuevos amigos por lealtad a los anteriores','Ocultar por completo tu tristeza sin hablarlo con nadie','Culpar a tu familia por la mudanza'] },
];
export function genManejoEmocional6Round(){
  const recurso = 'Manejar bien una emoción no significa esconderla, sino <b>reconocerla y actuar con respeto</b> a partir de ella. Muchas situaciones difíciles se complican cuando además hay que considerar cómo se siente otra persona al mismo tiempo —por ejemplo, sentir alegría propia mientras un amigo pasa por un mal momento—, y ahí es clave equilibrar la propia emoción con empatía hacia el otro, en vez de ignorar cualquiera de las dos partes.';
  const item = pick(EMOCIONES_6_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así manejas la emoción con respeto hacia ti y hacia otros.', recurso: recurso,
  };
}

const AUTOCUIDADO_DIGITAL6_ITEMS = [
  { label:'Bloquear o reportar a alguien que te molesta en internet es una forma válida de protegerte', v:true },
  { label:'Aceptar reunirte en persona con un desconocido que conociste por internet es una buena idea', v:false },
  { label:'Revisar con un adulto los permisos que pide una aplicación antes de instalarla es una práctica segura', v:true },
  { label:'Publicar tu ubicación en tiempo real en redes sociales para que cualquiera la vea es seguro', v:false },
  { label:'Pensar antes de compartir una foto o video, considerando quién podría verlo, es una buena práctica digital', v:true },
  { label:'Da lo mismo qué información personal compartes en internet, nunca tiene consecuencias', v:false },
  { label:'Hablar con la familia sobre una situación incómoda vivida en internet ayuda a resolverla mejor', v:true },
  { label:'Usar la misma contraseña simple para todas tus cuentas en internet es una práctica segura', v:false },
  { label:'Revisar quién puede ver tus publicaciones antes de compartir algo en redes sociales es una buena práctica', v:true },
];
export function genAutocuidadoDigital6Round(){
  const recurso = 'Cuidarse en internet significa pensar antes de compartir: quién podría ver una foto o un dato personal, y qué consecuencias podría tener eso. Prácticas concretas como revisar los permisos de una aplicación con un adulto, bloquear o reportar a quien te molesta, y usar contraseñas distintas y seguras para cada cuenta, protegen tu información e intimidad. Y si algo incómodo pasa en línea, hablarlo con la familia siempre ayuda a resolverlo mejor que guardarlo en secreto.';
  const item = pick(AUTOCUIDADO_DIGITAL6_ITEMS);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
  };
}

const PREVENCION_6_BANK = [
  { pregunta:'¿Cuál es un efecto nocivo del consumo de tabaco en el cuerpo?', correcta:'Daña los pulmones y el corazón', opts:['Mejora la capacidad pulmonar','Fortalece el sistema inmune','Ayuda a concentrarse mejor'] },
  { pregunta:'¿Cuál es un efecto nocivo del consumo de alcohol en el cuerpo?', correcta:'Afecta el hígado y el sistema nervioso', opts:['Fortalece los huesos','Mejora los reflejos','Ayuda a la digestión'] },
  { pregunta:'¿Cuál es un efecto nocivo del consumo de marihuana en un niño o adolescente?', correcta:'Puede afectar la memoria y la concentración', opts:['Mejora el rendimiento escolar','Fortalece el corazón','Mejora la visión'] },
  { pregunta:'¿Cuál de estas es una buena estrategia para prevenir el consumo de drogas?', correcta:'Practicar un deporte o actividad que te guste y rodearte de buenas amistades', opts:['Aislarte de tu familia y amigos','Aceptar cualquier cosa que te ofrezcan para encajar','Ignorar tus propios valores para seguir al grupo'] },
  { pregunta:'¿Por qué es importante tener una buena comunicación con la familia respecto a estos temas?', correcta:'Porque ayuda a recibir apoyo y consejos ante situaciones difíciles', opts:['Porque no tiene ninguna utilidad','Porque así se evita hablar del tema para siempre','Porque la familia nunca puede ayudar en estos temas'] },
  { pregunta:'¿Qué es un "factor protector" frente al consumo de drogas?', correcta:'Algo que ayuda a una persona a tomar decisiones saludables, como el deporte o la familia', opts:['Una sustancia que se consume para protegerse','Un tipo de medicamento para dormir','Una regla que obliga a consumir drogas'] },
  { pregunta:'¿Qué deberías hacer si un conocido te ofrece probar tabaco, alcohol o marihuana?', correcta:'Rechazarlo con seguridad y alejarte de la situación si es necesario', opts:['Aceptarlo para no quedar mal','Probarlo solo una vez sin decirle a nadie','Guardar el secreto para siempre'] },
  { pregunta:'¿Por qué el cuerpo de un niño o adolescente es especialmente vulnerable a los efectos de las drogas?', correcta:'Porque su cuerpo y cerebro todavía están en desarrollo', opts:['Porque los niños son más fuertes que los adultos','Porque no les afecta en nada','Porque su cuerpo ya terminó de desarrollarse'] },
  { pregunta:'¿Cuál de estas es una señal de que alguien podría necesitar ayuda con un problema de consumo de sustancias?', correcta:'Cambios bruscos de ánimo y alejamiento de sus seres queridos', opts:['Sacar siempre buenas notas','Dormir las horas recomendadas','Practicar deporte regularmente'] },
];
export function genPrevencion6Round(){
  const recurso = 'El cuerpo de un niño o adolescente todavía está en desarrollo, por lo que es especialmente vulnerable a sustancias como el tabaco, el alcohol o la marihuana, que dañan órganos concretos y pueden afectar la memoria y la concentración. Un <b>factor protector</b> es algo que ayuda a tomar decisiones saludables —como el deporte, buenas amistades o una comunicación abierta con la familia—, y saber rechazar con seguridad una oferta de estas sustancias es una habilidad real de autocuidado, no solo una regla que hay que seguir.';
  const item = pick(PREVENCION_6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
  };
}

const CONFLICTO_6_BANK = [
  { texto:'En redes sociales del curso, un grupo empieza a burlarse de un compañero por su forma de vestir.', correcta:'No participar en la burla, defender a tu compañero y avisar a un adulto', malas:['Sumarte a la burla en el chat','Ignorar por completo lo que está pasando','Compartir la conversación con más personas para "hacerlo viral"'] },
  { texto:'Dos amigos del curso compiten por el mismo premio en una feria científica y la relación se empieza a tensar.', correcta:'Recordar que la amistad vale más que la competencia y apoyarse mutuamente', malas:['Sabotear el proyecto del otro para ganar','Dejar de hablarle a tu amigo hasta que termine la competencia','Hacer trampa para asegurar el premio'] },
  { texto:'Un grupo de trabajo no logra ponerse de acuerdo porque dos integrantes quieren liderar el proyecto.', correcta:'Proponer dividir responsabilidades de forma justa, escuchando a ambos', malas:['Dejar que ambos discutan sin intervenir','Elegir un líder al azar sin conversarlo','Abandonar el proyecto por el conflicto'] },
  { texto:'Un compañero comparte por error información privada de otro estudiante en el chat del curso.', correcta:'Pedirle que la borre, no reenviarla, y avisar a un adulto si es necesario', malas:['Reenviar la información a otros grupos','Guardar la información para usarla después','Burlarte de la situación frente a todos'] },
  { texto:'Un compañero nuevo se une al curso a mitad de año y algunos estudiantes lo ignoran deliberadamente.', correcta:'Acercarte, incluirlo en las actividades y ayudarlo a integrarse al curso', malas:['Seguir ignorándolo como el resto','Burlarte de que es nuevo','Excluirlo de los trabajos grupales'] },
  { texto:'Dos compañeros de curso discuten fuerte porque uno acusó al otro de copiar en una prueba.', correcta:'Sugerir que hablen con calma y, si es necesario, con un profesor presente', malas:['Sumarte a acusar sin pruebas','Difundir el rumor a todo el curso','Tomar partido sin conocer los hechos'] },
  { texto:'Un grupo de amigos deja de invitar a alguien a sus juntas sin darle ninguna explicación.', correcta:'Preguntar qué pasó y buscar una conversación honesta con la persona excluida', malas:['Seguir excluyéndola sin explicación','Hablar mal de ella para justificar la exclusión','Ignorar cómo se siente'] },
  { texto:'Un estudiante comparte contenido ofensivo sobre otro compañero en un grupo de mensajería del curso.', correcta:'No reenviarlo, pedir que se elimine, y avisar a un adulto responsable', malas:['Reenviarlo a otros grupos','Agregar más comentarios ofensivos','Guardarlo para compartirlo después'] },
];
export function genBuenTrato6Round(){
  const recurso = 'Resolver un conflicto de forma sana casi siempre implica los mismos pasos: no sumarse a una burla o rumor, hablar directamente con la persona involucrada en vez de excluirla en silencio, y pedir ayuda a un adulto cuando la situación lo requiere (como cuando se comparte información privada o contenido ofensivo sobre alguien). Estas mismas habilidades aplican tanto a conflictos presenciales como a los que ocurren en redes sociales o chats grupales.';
  const item = pick(CONFLICTO_6_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que se puede hacer en esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta+'" — así se resuelve el conflicto con respeto.', recurso: recurso,
  };
}

const HABITOS_ESTUDIO_6_BANK = [
  { label:'Revisar tu calendario de pruebas y tareas cada semana ayuda a organizarte con anticipación', v:true },
  { label:'Estudiar en un lugar tranquilo, sin muchas distracciones, ayuda a concentrarte mejor', v:true },
  { label:'Repasar lo aprendido unos días antes de una prueba es mejor que estudiarlo todo la noche anterior', v:true },
  { label:'Pedir ayuda a un profesor o compañero cuando no entiendes algo es un buen hábito de estudio', v:true },
  { label:'Postergar siempre las tareas hasta el último momento es la mejor estrategia de estudio', v:false },
  { label:'Da lo mismo el orden y la limpieza del lugar donde estudias', v:false },
  { label:'Fijarte metas realistas para cada sesión de estudio ayuda a mantenerte motivado', v:true },
  { label:'Alternar entre distintas materias en una sesión larga de estudio puede ayudar a mantener la concentración', v:true },
  { label:'Ignorar los comentarios del profesor sobre tus pruebas es la mejor forma de aprender', v:false },
  { label:'Tomar pequeños descansos durante una sesión larga de estudio ayuda a mantener la concentración', v:true },
];
export function genHabitosEstudio6Round(){
  const recurso = 'Estudiar de forma efectiva no depende solo de "esforzarse más", sino de buenos hábitos concretos: organizarse con anticipación revisando el calendario de pruebas, estudiar en un lugar tranquilo, repasar varios días antes en vez de dejarlo todo para la noche anterior, tomar pequeños descansos, y pedir ayuda cuando algo no se entiende. Fijarse metas realistas para cada sesión de estudio también ayuda a mantener la motivación en el tiempo.';
  const item = pick(HABITOS_ESTUDIO_6_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Orientación 7° Básico ----------------
   Basado en Decreto 614/2013. Prevención de Conductas de Riesgo -> OA03
   (decisión confirmada explícitamente con el usuario tras AskUserQuestion:
   "Solo factores de riesgo/protección" — NO se incluyen detalles de
   sexualidad, que corresponden al OA02 excluido, mismo criterio de todos
   los años anteriores de requerir el acompañamiento real de un adulto).
   Bienestar y Vida Saludable -> OA04. Relaciones Saludables en Redes
   Sociales -> OA05 (uso responsable de redes, ciberacoso, huella digital
   — un ángulo nuevo que ningún año anterior había cubierto con este nivel
   de profundidad). Resolución de Conflictos VII -> OA06. Autonomía en el
   Aprendizaje -> OA09-10 (organización del propio aprendizaje, toma de
   decisiones sobre el estudio). Quedan fuera: OA01 (autoconocimiento y
   fortalezas propias, subjetivo), OA02 (sexualidad como dimensión del
   desarrollo humano — tema sensible que requiere acompañamiento real de
   un adulto, no una trivia de opción múltiple), OA07 (participación y
   pertenencia a la comunidad escolar, ya cubierta por Formación
   Ciudadana en historia.js) y OA08 (proyecto de vida personal, subjetivo). */
export const ORIENTACION_MODULES_G7 = [
  {id:'prevencionriesgo7', label:'Prevención de Conductas de Riesgo', open:true, key:'prevencionriesgo7'},
  {id:'bienestarvida7', label:'Bienestar y Vida Saludable', open:true, key:'bienestarvida7'},
  {id:'redessociales7', label:'Relaciones Saludables en Redes Sociales', open:true, key:'redessociales7'},
  {id:'resolucionconflictos7', label:'Resolución de Conflictos VII', open:true, key:'resolucionconflictos7'},
  {id:'autonomiaaprendizaje7', label:'Autonomía en el Aprendizaje', open:true, key:'autonomiaaprendizaje7'},
];
export const ORIENTACION_POS_G7 = [{x:20,y:92},{x:66,y:74},{x:22,y:52},{x:66,y:28},{x:22,y:6}];

const PREVENCION_RIESGO_7_BANK = [
  { label:'Informarse con un adulto de confianza sobre los riesgos del consumo de alcohol y drogas es una conducta protectora', v:true },
  { label:'Tener amigos y un adulto de confianza con quienes hablar de tus problemas es un factor de protección', v:true },
  { label:'Ceder a la presión de un grupo para probar algo que sabes que es riesgoso es una conducta protectora', v:false },
  { label:'Sentir que puedes decir "no" ante una propuesta riesgosa sin perder a tus amigos es un factor de protección', v:true },
  { label:'Ocultarle a cualquier adulto una situación de riesgo que estás viviendo es una conducta protectora', v:false },
  { label:'Participar en actividades deportivas o artísticas fuera del horario escolar es un factor de protección', v:true },
  { label:'Aislarte por completo de tu familia y amigos es una conducta protectora frente a los riesgos', v:false },
  { label:'Saber a quién acudir (familia, profesor, orientador) si tú o un amigo están en una situación de riesgo es un factor de protección', v:true },
  { label:'Tener un entorno familiar donde te sientes escuchado es un factor de protección frente a conductas de riesgo', v:true },
  { label:'Creer que "a mí nunca me va a pasar nada" es una forma segura de evaluar un riesgo real', v:false },
  { label:'Contar con espacios seguros para expresar tus emociones, como hablar con un adulto o escribir un diario, es un factor de protección', v:true },
];
export function genPrevencionRiesgo7Round(){
  const recurso = 'Los <b>factores de protección</b> son elementos que ayudan a evitar conductas de riesgo: tener un adulto de confianza con quien hablar, participar en actividades deportivas o artísticas, saber a quién acudir ante una situación difícil, y sentirte con la libertad de decir "no" ante una propuesta riesgosa sin perder a tus amigos. Reconocerlos ayuda a cuidarte a ti mismo y a apoyar a otros que puedan estar pasando por una situación de riesgo.';
  const item = pick(PREVENCION_RIESGO_7_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

const BIENESTAR_VIDA_7_BANK = [
  { situacion:'Tienes una semana muy cargada de pruebas y decides organizar horarios de estudio, sueño y descanso.', correcta:'Cuidar tu bienestar planificando tu tiempo de forma equilibrada', malas:['Sacrificar por completo el sueño para estudiar toda la noche','Ignorar por completo las pruebas hasta el último momento','Dejar de comer para tener más tiempo de estudio'] },
  { situacion:'Notas que llevas varios días sintiéndote muy cansado y sin ánimo para hacer las cosas que antes disfrutabas.', correcta:'Reconocer la señal y conversarlo con un adulto de confianza', malas:['Ignorar la señal esperando que se pase sola','Aislarte de tu familia y amigos sin decir nada','Exigirte aún más para "superarlo" solo'] },
  { situacion:'Un compañero te invita a almorzar comida chatarra todos los días en vez de la colación que trae de la casa.', correcta:'Mantener una alimentación equilibrada la mayor parte del tiempo', malas:['Comer solo comida chatarra desde ese día en adelante','Dejar de almorzar para evitar la decisión','Presionar a tu compañero para que también deje de comer bien'] },
  { situacion:'Te acostaste muy tarde jugando videojuegos y al día siguiente te cuesta mucho concentrarte en clases.', correcta:'Reconocer que necesitas dormir mejor y fijarte un horario razonable para acostarte', malas:['Seguir acostándote tarde todos los días sin cambiar nada','Tomar bebidas con mucha cafeína para no sentir el cansancio','Faltar a clases para poder dormir más'] },
  { situacion:'Llevas varias semanas sin hacer ninguna actividad física y notas que te cansas con facilidad al subir escaleras.', correcta:'Incorporar de a poco algo de actividad física a tu rutina semanal', malas:['Ignorar por completo la falta de actividad física','Exigirte un entrenamiento extremo de un día para otro','Evitar cualquier escalera de por vida'] },
  { situacion:'Un amigo te cuenta que ha estado tomando bebidas energéticas todos los días para rendir más en el estudio.', correcta:'Sugerirle que hable con un adulto de confianza sobre formas más saludables de rendir mejor', malas:['Recomendarle que tome aún más bebidas energéticas','Ignorar completamente lo que te contó','Burlarte de la situación de tu amigo'] },
  { situacion:'Sientes mucho estrés antes de una prueba importante y notas que se te acelera el corazón y te cuesta respirar con calma.', correcta:'Practicar una respiración calmada y recordar que preparaste el estudio con tiempo', malas:['Evitar por completo rendir la prueba','Contagiar tu estrés a tus compañeros de curso','Ignorar la sensación hasta que empeore'] },
  { situacion:'Un compañero de curso te invita a saltarte el desayuno todos los días para "ahorrar tiempo" en las mañanas.', correcta:'Explicarle que el desayuno es importante para tu energía y bienestar durante el día', malas:['Dejar de desayunar todos los días sin cuestionarlo','Presionar a otros compañeros para que tampoco desayunen','Reemplazar el desayuno por dulces todos los días'] },
];
export function genBienestarVida7Round(){
  const recurso = 'El <b>bienestar</b> se cuida con hábitos cotidianos: organizar el tiempo de forma equilibrada entre estudio, sueño y descanso; mantener una alimentación equilibrada; dormir lo suficiente; incorporar actividad física a la rutina; y reconocer señales de cansancio o estrés para conversarlas con un adulto de confianza en vez de ignorarlas. Cuidar estos aspectos ayuda a rendir mejor y a sentirse mejor en el día a día.';
  const item = pick(BIENESTAR_VIDA_7_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const REDES_SOCIALES_7_BANK = [
  { label:'Compartir tu contraseña de redes sociales con un desconocido es una conducta segura', v:false },
  { label:'Pensar antes de publicar algo, imaginando cómo podría afectar a otras personas, es un uso responsable de las redes', v:true },
  { label:'Burlarse de alguien repetidamente por internet es una forma de ciberacoso', v:true },
  { label:'Todo lo que se publica en internet puede quedar guardado o compartido, aunque después se borre', v:true },
  { label:'Aceptar solicitudes de amistad de cualquier desconocido es una conducta segura en redes sociales', v:false },
  { label:'Contarle a un adulto de confianza si ves que alguien está siendo víctima de ciberacoso es una buena decisión', v:true },
  { label:'Publicar tu dirección o el colegio donde estudias en una red social pública es una conducta segura', v:false },
  { label:'Revisar la configuración de privacidad de tus redes sociales de vez en cuando es una buena práctica', v:true },
  { label:'Reenviar un rumor o una foto vergonzosa de un compañero por redes sociales es una conducta responsable', v:false },
  { label:'Comparar tu vida con lo que ves en redes sociales, sabiendo que muestran solo una parte editada de la realidad, es una actitud saludable', v:true },
  { label:'Responder con insultos a un comentario ofensivo en redes sociales es la mejor forma de resolverlo', v:false },
];
export function genRedesSociales7Round(){
  const recurso = 'Usar las <b>redes sociales</b> de forma responsable incluye pensar antes de publicar (imaginando cómo podría afectar a otras personas), cuidar la privacidad (no compartir contraseñas, dirección o el colegio en público), revisar la configuración de privacidad, y saber que todo lo publicado puede quedar guardado aunque se borre después. El <b>ciberacoso</b> (burlarse repetidamente de alguien por internet) es dañino, y contarle a un adulto de confianza si ves que alguien lo está viviendo es una buena decisión.';
  const item = pick(REDES_SOCIALES_7_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

const RESOLUCION_CONFLICTOS_7_BANK = [
  { situacion:'Dos compañeros de tu grupo de trabajo no se ponen de acuerdo sobre cómo dividir las tareas, y la discusión empieza a subir de tono.', correcta:'Proponer que cada uno exprese su punto de vista con calma y buscar una solución que considere a ambos', malas:['Tomar partido por uno sin escuchar al otro','Ignorar el conflicto esperando que se resuelva solo','Burlarte de ambos por no ponerse de acuerdo'] },
  { situacion:'Sientes que un comentario de un compañero fue injusto contigo, y notas que te está costando controlar tu molestia.', correcta:'Esperar a calmarte y luego conversarlo directamente con esa persona', malas:['Responder de inmediato con un comentario aún más agresivo','Hablar mal de esa persona con el resto del curso','Guardarte la molestia sin decir nada nunca'] },
  { situacion:'Ves que dos amigos tuyos están peleados y ambos te piden que tomes su bando en el conflicto.', correcta:'Escuchar a ambos sin tomar partido y animarlos a conversar entre ellos', malas:['Elegir un bando sin conocer toda la situación','Contarle a cada uno cosas negativas del otro','Terminar la amistad con ambos para evitar el problema'] },
  { situacion:'En un trabajo grupal, un integrante no ha hecho su parte y el resto del grupo está molesto porque se acerca la fecha de entrega.', correcta:'Conversar con esa persona para entender qué pasó y buscar juntos una solución antes de la entrega', malas:['Excluirlo del grupo sin conversar nada con él','Entregar el trabajo incompleto sin decir nada al profesor','Hacer todo el trabajo por esa persona sin conversarlo'] },
  { situacion:'Un compañero interpreta mal algo que dijiste y se ofende, aunque tú no tenías esa intención.', correcta:'Aclarar con calma lo que realmente quisiste decir y escuchar cómo se sintió', malas:['Insistir en que el problema es solo de la otra persona','Evitar hablarle nunca más sin explicar nada','Reírte de su reacción frente a otros compañeros'] },
  { situacion:'Dos grupos del curso compiten por usar la misma cancha a la misma hora para entrenar antes de un campeonato.', correcta:'Conversar entre ambos grupos para acordar turnos que funcionen para todos', malas:['Pelear por la cancha hasta que uno se rinda','Avisar al profesor solo para acusar al otro grupo','Ocupar la cancha a la fuerza sin conversar nada'] },
  { situacion:'Un amigo canceló un plan contigo a última hora por segunda vez, y sientes que no está respetando tu tiempo.', correcta:'Contarle con respeto cómo te sientes y escuchar su explicación antes de sacar conclusiones', malas:['Dejar de hablarle sin explicarle por qué','Hablar mal de él con el resto de tus amigos','Guardarte el enojo sin decir nunca nada'] },
  { situacion:'Durante un juego en equipo, un compañero te acusa de haber cometido una falta que tú sientes que no hiciste.', correcta:'Explicar tu punto de vista con calma y escuchar el suyo, sin gritar', malas:['Discutir a gritos hasta que uno se retire del juego','Ignorar la acusación y seguir jugando enojado','Acusar a tu compañero de otra cosa para desviar el tema'] },
  { situacion:'Un compañero de curso comparte sin tu permiso algo que le contaste en confianza, y te sientes traicionado.', correcta:'Conversar con esa persona sobre cómo te hizo sentir y por qué la confianza es importante para ti', malas:['Contar un secreto de esa persona para "vengarte"','Dejar de hablarle a todo el curso sin explicar nada','Hablar mal de esa persona con otros compañeros'] },
  { situacion:'En un trabajo en parejas, tú y tu compañero tienen ideas muy distintas sobre cómo enfocar el tema y ninguno quiere ceder.', correcta:'Buscar una idea intermedia que combine lo mejor de ambas propuestas', malas:['Imponer tu idea sin considerar la de tu compañero','Negarte a seguir trabajando con esa persona','Entregar dos trabajos distintos sin ponerse de acuerdo'] },
];
export function genResolucionConflictos7Round(){
  const recurso = 'Resolver un <b>conflicto</b> de forma sana implica expresar cómo te sientes con calma, escuchar el punto de vista de la otra persona antes de sacar conclusiones, y buscar una solución que considere a ambas partes, en vez de imponer tu idea, ignorarlo o reaccionar con agresividad. Tomarse un momento para calmarse antes de conversar suele ayudar a que el diálogo sea más productivo.';
  const item = pick(RESOLUCION_CONFLICTOS_7_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const AUTONOMIA_APRENDIZAJE_7_BANK = [
  { label:'Revisar tu propio avance y ajustar tu forma de estudiar si algo no te está resultando es parte de aprender de forma autónoma', v:true },
  { label:'Esperar que un adulto te diga exactamente qué hacer en cada minuto de estudio es aprender de forma autónoma', v:false },
  { label:'Fijarte tus propias metas de aprendizaje, además de las que da el profesor, ayuda a tu autonomía', v:true },
  { label:'Buscar información adicional por tu cuenta cuando un tema te interesa es parte de la autonomía en el aprendizaje', v:true },
  { label:'Copiar las respuestas de un compañero sin entenderlas es una forma de aprendizaje autónomo', v:false },
  { label:'Reconocer en qué temas te cuesta más y buscar ayuda o practicar más en esas áreas es parte de la autonomía', v:true },
  { label:'Organizar tu propio horario de estudio semanal, sin que un adulto tenga que recordártelo cada vez, es un signo de autonomía', v:true },
  { label:'Depender siempre de que te digan exactamente qué leer y cuándo hacerlo es una muestra de autonomía en el aprendizaje', v:false },
  { label:'Evaluar si una técnica de estudio te está funcionando y cambiarla si no da resultado es parte de aprender de forma autónoma', v:true },
  { label:'Esperar que otros hagan tus tareas por ti es una forma de autonomía en el aprendizaje', v:false },
  { label:'Usar herramientas como calendarios o listas de tareas para organizar tu propio estudio es parte de la autonomía', v:true },
];
export function genAutonomiaAprendizaje7Round(){
  const recurso = 'La <b>autonomía en el aprendizaje</b> significa hacerte responsable de tu propio proceso: organizar tu horario de estudio, fijarte tus propias metas además de las del profesor, reconocer en qué temas te cuesta más para pedir ayuda o practicar más, y evaluar si una técnica de estudio te está funcionando para cambiarla si no da resultado — en vez de depender siempre de que otra persona te diga exactamente qué hacer.';
  const item = pick(AUTONOMIA_APRENDIZAJE_7_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Orientación 8° Básico ----------------
   Basado en Decreto 614/2013. Prevención VIII -> OA03, aplicando la MISMA
   política que el usuario confirmó explícitamente para 7° básico
   ("Solo factores de riesgo/protección"): el OA de 8° nombra situaciones
   de riesgo (consumo de sustancias, conductas violentas) y pide
   estrategias de protección y redes de apoyo — se cubre exclusivamente en
   esa clave preventiva/protectora, sin ningún detalle de la dimensión
   sexual (que pertenece al OA02, excluido — mismo criterio de todos los
   años: requiere acompañamiento real de un adulto). Bienestar VIII ->
   OA04 (alimentación, descanso, actividad física, integridad corporal,
   uso seguro de redes). Relaciones e Inclusión -> OA05 (igualdad,
   dignidad, inclusión y no discriminación en relaciones presenciales y
   virtuales, reconocer vulneraciones de derechos). Participación
   Democrática -> OA07-08 (intereses comunes del grupo, acuerdos mediante
   diálogo democrático, debate y representantes electos — ángulo
   genuinamente nuevo, ningún año anterior lo cubrió en Orientación).
   Gestión del Aprendizaje VIII -> OA09-10 (intereses y capacidades
   propias como base de metas, gestión autónoma con monitoreo y ajuste).
   Quedan fuera: OA01 (representaciones de sí mismo — autoconocimiento
   subjetivo), OA02 (dimensiones de la sexualidad e intimidad — ver
   arriba), OA06 (resolución de desacuerdos — texto casi idéntico al OA06
   de 7° básico, ya ejercitado ahí con escenarios nuevos; se prefirió
   cubrir OA07-08 que sí es un ángulo nuevo). */
export const ORIENTACION_MODULES_G8 = [
  {id:'prevencionriesgo8', label:'Prevención VIII', open:true, key:'prevencionriesgo8'},
  {id:'bienestar8', label:'Bienestar y Autocuidado VIII', open:true, key:'bienestar8'},
  {id:'relacionesinclusion8', label:'Relaciones e Inclusión', open:true, key:'relacionesinclusion8'},
  {id:'participaciondemocratica8', label:'Participación Democrática', open:true, key:'participaciondemocratica8'},
  {id:'gestionaprendizaje8', label:'Gestión del Aprendizaje VIII', open:true, key:'gestionaprendizaje8'},
];
export const ORIENTACION_POS_G8 = [{x:20,y:92},{x:66,y:74},{x:22,y:52},{x:66,y:28},{x:22,y:6}];

const PREVENCION_8_BANK = [
  { label:'Identificar a tiempo una situación de riesgo y alejarse de ella es una estrategia de protección', v:true },
  { label:'Contar con una red de apoyo (familia, amistades de confianza, profesores) reduce el riesgo frente a situaciones difíciles', v:true },
  { label:'Enfrentar solo cualquier situación de riesgo, sin contarle nunca a nadie, es la estrategia más protectora', v:false },
  { label:'Saber decir "no" con firmeza frente a la presión del grupo es una habilidad protectora', v:true },
  { label:'Si un desconocido en internet te pide guardar secretos sobre sus conversaciones, es una señal de alerta que conviene contar a un adulto', v:true },
  { label:'Las conductas violentas son una forma aceptable de resolver conflictos entre compañeros', v:false },
  { label:'Conocer los riesgos reales del consumo de sustancias, con información seria, ayuda a tomar mejores decisiones', v:true },
  { label:'Acudir a un especialista (orientador, psicólogo) cuando una situación te supera es un signo de debilidad', v:false },
  { label:'Participar en actividades que te motivan (deporte, arte, música) es un factor protector frente a conductas de riesgo', v:true },
  { label:'Un ambiente escolar donde se puede hablar de los problemas sin burlas es un factor protector para todos', v:true },
  { label:'Ocultar que un amigo está en una situación de riesgo grave es la mejor forma de ser leal', v:false },
];
export function genPrevencionRiesgo8Round(){
  const recurso = 'Los <b>factores de protección</b> son recursos que reducen la probabilidad de que alguien viva una situación de riesgo: contar con una red de apoyo (familia, amistades de confianza, un adulto a quien recurrir), saber decir "no" con firmeza frente a la presión de un grupo, participar en actividades que motivan (deporte, arte, música), y estar en un ambiente donde se puede hablar de los problemas sin miedo a burlas. Los <b>factores de riesgo</b>, en cambio, aumentan esa probabilidad: enfrentar solo una situación difícil sin contarle a nadie, o guardar en secreto algo que genera incomodidad. Reconocer estas señales a tiempo, y saber que pedir ayuda a un adulto o especialista es un signo de madurez (no de debilidad), es la base de la prevención.';
  const item = pick(PREVENCION_8_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

const BIENESTAR_8_BANK = [
  { situacion:'Llevas una semana durmiendo tarde por ver series y notas que rindes peor en clases y andas de mal humor.', correcta:'Reconocer el patrón y volver a un horario de sueño regular', malas:['Seguir igual: el sueño no afecta el ánimo','Dormir solo los fines de semana','Reemplazar el sueño por bebidas energéticas'] },
  { situacion:'Una aplicación te muestra cuánto tiempo de pantalla acumulaste esta semana y la cifra te sorprende.', correcta:'Usar ese dato para fijarte límites razonables de uso diario', malas:['Borrar la aplicación para no ver la cifra','Aumentar el tiempo de pantalla para superar el récord','Ignorar el dato por completo'] },
  { situacion:'Un contacto que no conoces en persona insiste en que le envíes fotos tuyas y te pide mantenerlo en secreto.', correcta:'Negarte, bloquear el contacto y contárselo a un adulto de confianza', malas:['Enviar las fotos para que deje de insistir','Guardar el secreto como te pide','Seguir conversando para ver qué quiere'] },
  { situacion:'Tus almuerzos de la semana han sido casi puros snacks y bebidas azucaradas.', correcta:'Reequilibrar tus comidas incorporando alimentos más nutritivos', malas:['Continuar igual: la alimentación no influye en nada','Dejar de almorzar por completo','Comer snacks también al desayuno'] },
  { situacion:'Entre pruebas y talleres, llevas dos semanas sin hacer nada de actividad física y te sientes con menos energía.', correcta:'Reservar espacios cortos y realistas de actividad física en tu semana', malas:['Esperar a tener un mes completamente libre','Descartar el ejercicio hasta el próximo año','Reemplazar el ejercicio por más horas de pantalla'] },
  { situacion:'Un compañero comparte una "cuenta de bromas" que publica fotos vergonzosas de otros estudiantes sin su permiso.', correcta:'No seguir ni compartir la cuenta, y reportarla o avisar a un adulto', malas:['Seguir la cuenta porque es divertida','Enviar fotos de otros compañeros a la cuenta','Comentar las publicaciones para ganar popularidad'] },
  { situacion:'Sientes que el estrés de fin de semestre te tiene sobrepasado y te cuesta concentrarte.', correcta:'Organizar tus pendientes, dosificar el estudio y pedir apoyo si lo necesitas', malas:['Acumular todo para la última noche','Abandonar todas las evaluaciones','Aislarte hasta que termine el semestre'] },
  { situacion:'Notas que una amiga publica cosas muy personales en redes públicas y varios desconocidos la contactan.', correcta:'Conversar con ella sobre configurar la privacidad y cuidar lo que comparte', malas:['Compartir sus publicaciones para que lleguen a más gente','Burlarte de sus publicaciones','No decirle nada: no es tu problema'] },
  { situacion:'Después de una caída en bicicleta te duele el brazo, pero no quieres "hacer un escándalo".', correcta:'Avisar a un adulto y revisar la lesión: cuidar tu integridad física es prioritario', malas:['Ocultar el dolor hasta que pase solo','Seguir andando en bicicleta igual','Automedicarte sin consultar a nadie'] },
  { situacion:'Te ofrecen sumarte a un reto viral de redes sociales que implica un riesgo físico evidente.', correcta:'Rechazarlo: ningún video vale poner en riesgo tu integridad', malas:['Aceptar para no quedar fuera del grupo','Hacerlo pero sin contárselo a nadie','Desafiar a otros compañeros a hacerlo'] },
];
export function genBienestar8Round(){
  const recurso = 'El <b>bienestar</b> integral depende de cuidar varias áreas a la vez: la alimentación equilibrada, el descanso suficiente, la actividad física regular, y la integridad corporal (avisar a un adulto ante una lesión o dolor, en vez de restarle importancia). El <b>uso seguro de redes sociales</b> es parte de este cuidado: no compartir información personal con desconocidos, configurar la privacidad de las publicaciones, y reconocer señales de alerta (como que alguien pida guardar secretos o insista en obtener fotos). Frente a cualquier situación que genere duda o incomodidad —ya sea en línea o en persona— lo más protector es contárselo a un adulto de confianza en vez de enfrentarla en soledad.';
  const item = pick(BIENESTAR_8_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const RELACIONES_INCLUSION_8_BANK = [
  { label:'Tratar con la misma dignidad a todas las personas, sin importar su origen, apariencia o creencias, es la base de una buena convivencia', v:true },
  { label:'Excluir a alguien de un grupo por su nacionalidad es una forma de discriminación', v:true },
  { label:'Los principios de respeto e igualdad aplican en las redes sociales igual que en persona', v:true },
  { label:'Burlarse del acento o la forma de hablar de un compañero es solo una broma sin importancia', v:false },
  { label:'Reconocer cuando un comentario propio hirió a otra persona, y disculparse, fortalece las relaciones', v:true },
  { label:'Si presencias una situación de discriminación, lo correcto es no involucrarse nunca', v:false },
  { label:'Difundir rumores sobre alguien por chats grupales puede vulnerar su dignidad aunque no sea "en persona"', v:true },
  { label:'Un grupo es más rico y creativo cuando integra personas con distintas experiencias y puntos de vista', v:true },
  { label:'La popularidad de una persona determina cuántos derechos merece', v:false },
  { label:'Apoyar a un compañero que fue discriminado, y avisar a un adulto si la situación es grave, es una acción correcta', v:true },
];
export function genRelacionesInclusion8Round(){
  const recurso = 'Tratar con la misma <b>dignidad</b> a todas las personas, sin importar su origen, apariencia o creencias, es la base de la <b>inclusión</b> y de relaciones saludables. La <b>discriminación</b> puede tomar formas sutiles —burlarse de un acento, excluir a alguien de un grupo, difundir rumores en un chat— y sigue vulnerando a la persona aunque ocurra "solo" en línea, no solo cara a cara. Estos principios de respeto e igualdad aplican por igual en las redes sociales y en persona. Un grupo que integra personas con distintas experiencias y puntos de vista es más rico y creativo, y apoyar a un compañero que sufre discriminación (en vez de mirar para el lado) es parte de construir una convivencia sana.';
  const item = pick(RELACIONES_INCLUSION_8_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

const PARTICIPACION_8_BANK = [
  { situacion:'El curso quiere organizar una actividad de fin de año, pero hay tres ideas distintas y ninguna mayoría clara.', correcta:'Debatir los pros y contras de cada idea y luego votar democráticamente', malas:['Que decida solo el estudiante más popular','Abandonar la actividad por falta de acuerdo','Imponer la primera idea que se propuso'] },
  { situacion:'Se acerca la elección de la directiva de curso y te interesa participar.', correcta:'Presentar tu candidatura con propuestas concretas y respetar el resultado de la votación', malas:['Prometer cosas imposibles para ganar votos','Descalificar a los otros candidatos','Exigir el cargo sin elección'] },
  { situacion:'La directiva electa del curso toma una decisión que a ti no te gusta, siguiendo el procedimiento acordado.', correcta:'Expresar tu desacuerdo por los canales del curso, respetando la decisión tomada democráticamente', malas:['Desconocer a la directiva porque no votaste por ella','Boicotear la actividad decidida','Insultar a la directiva en el chat del curso'] },
  { situacion:'Un grupo de estudiantes quiere proponer mejoras para el patio del colegio.', correcta:'Recoger las ideas de los demás cursos y presentar la propuesta al centro de estudiantes', malas:['Rayar el patio para llamar la atención','Esperar que otros lo resuelvan sin participar','Presentar solo las ideas propias ignorando al resto'] },
  { situacion:'En una asamblea de curso, un compañero opina distinto a la mayoría y algunos lo interrumpen.', correcta:'Pedir que se respete su turno de habla: en un debate democrático todas las voces se escuchan', malas:['Sumarte a las interrupciones','Pedir que se prohíban las opiniones distintas','Terminar la asamblea sin escucharlo'] },
  { situacion:'El curso logró acordar por votación el destino del paseo anual, pero la opción que tú preferías perdió.', correcta:'Aceptar el resultado y participar de todas formas: así funcionan los acuerdos democráticos', malas:['Negarte a ir al paseo como protesta','Exigir repetir la votación hasta que gane tu opción','Convencer al profesor de anular el resultado'] },
  { situacion:'Detectan que varios compañeros quieren un taller de ajedrez que el colegio no ofrece.', correcta:'Organizarse, juntar firmas y presentar la solicitud formalmente', malas:['Rendirse porque nunca resultará','Hacer el taller a escondidas sin permiso','Quejarse en redes sin proponer nada'] },
  { situacion:'Eres delegado de tu curso ante el centro de estudiantes y hay opiniones divididas sobre un tema.', correcta:'Representar fielmente lo que decidió tu curso, no solo tu opinión personal', malas:['Votar según tu preferencia ignorando al curso','No asistir a la reunión para evitar el conflicto','Inventar que el curso opinó otra cosa'] },
  { situacion:'Tu equipo de trabajo tiene un objetivo común, pero cada integrante quiere hacerlo a su manera.', correcta:'Acordar en conjunto un plan que aproveche las fortalezas de cada uno', malas:['Trabajar cada uno por separado sin coordinarse','Dejar que el más insistente decida todo','Renunciar al objetivo común'] },
];
export function genParticipacionDemocratica8Round(){
  const recurso = 'La <b>participación democrática</b> dentro de un curso o grupo se basa en escuchar los intereses de todos, debatir con argumentos y decidir por votación cuando hay opiniones divididas. Cuando el resultado de una votación no coincide con lo que uno prefería, lo democrático es aceptarlo y seguir participando —expresar el desacuerdo por los canales adecuados es válido, pero desconocer o boicotear una decisión tomada correctamente no lo es—. Ser <b>representante</b> de un grupo (como delegado o parte de una directiva) implica transmitir fielmente lo que el grupo decidió, no solo la opinión personal. Estas habilidades de diálogo, acuerdo y respeto por los procesos son la base de cualquier organización democrática, dentro y fuera del colegio.';
  const item = pick(PARTICIPACION_8_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const GESTION_APRENDIZAJE_8_BANK = [
  { label:'Conocer tus propios intereses y capacidades ayuda a fijarte metas de aprendizaje con sentido', v:true },
  { label:'Dividir una meta grande en pasos pequeños y medibles facilita avanzar y no rendirse', v:true },
  { label:'Revisar periódicamente tu avance y ajustar el plan si algo no funciona es parte de gestionar tu aprendizaje', v:true },
  { label:'Fijarse metas imposibles de cumplir es la mejor forma de motivarse', v:false },
  { label:'Lo que aprendes en el colegio puede conectarse con tus proyectos personales y tu futuro', v:true },
  { label:'Si una estrategia de estudio no te da resultados, lo correcto es repetirla igual sin cambiar nada', v:false },
  { label:'Anotar plazos y tareas en un calendario o agenda ayuda a cumplir tus metas sin acumulación de última hora', v:true },
  { label:'Pedir retroalimentación a tus profesores sobre cómo mejorar es parte de aprender con autonomía', v:true },
  { label:'El único propósito de estudiar es aprobar la próxima prueba', v:false },
  { label:'Celebrar los avances parciales de una meta ayuda a mantener la motivación', v:true },
];
export function genGestionAprendizaje8Round(){
  const recurso = 'Gestionar el propio aprendizaje de forma autónoma implica varios hábitos: conocer los propios intereses y capacidades para fijarse metas con sentido, dividir una meta grande en pasos pequeños y medibles (más fácil de cumplir que una meta enorme de una sola vez), y revisar periódicamente el avance para ajustar el plan si algo no está funcionando. Anotar plazos y tareas en una agenda evita la acumulación de última hora, y pedir retroalimentación a los profesores sobre cómo mejorar es parte de aprender con autonomía. Celebrar los avances parciales —no solo la meta final— ayuda a mantener la motivación en el camino.';
  const item = pick(GESTION_APRENDIZAJE_8_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/orientacion/1-medio —
   OA01-10. Cubiertos: OA03 (evaluar situaciones de riesgo relacionadas con
   consumo de sustancias y conductas riesgosas — mismo criterio ya
   establecido en 7°-8° básico: solo factores de riesgo/protección, sin
   ningún detalle de la dimensión sexual del OA02, que queda fuera), OA04
   (vida saludable, autocuidado), OA05 (relaciones interpersonales
   constructivas, presenciales y en redes sociales), OA06 (resolución de
   conflictos en un marco de derechos). Fuera: OA01,09-10 (proyectos de
   vida — vivencia personal subjetiva), OA02 (sexualidad y vínculos
   afectivos — requiere acompañamiento real de un adulto, mismo criterio de
   siempre), OA07-08 (participación e iniciativas comunitarias — ya
   cubiertas por Formación Ciudadana en historia.js). */
export const ORIENTACION_MODULES_M1 = [
  {id:'prevencionriesgosm1', label:'Prevención de Riesgos', open:true, key:'prevencionriesgosm1'},
  {id:'bienestarvidam1', label:'Bienestar y Vida Saludable', open:true, key:'bienestarvidam1'},
  {id:'relacionesredesm1', label:'Relaciones y Redes Sociales', open:true, key:'relacionesredesm1'},
  {id:'resolucionconflictosm1', label:'Resolución de Conflictos', open:true, key:'resolucionconflictosm1'},
];
export const ORIENTACION_POS_M1 = [{x:24,y:88},{x:68,y:64},{x:24,y:40},{x:68,y:16}];
const PREVENCION_RIESGOS_M1_BANK = [
  { situacion:'En una fiesta, varios compañeros insisten en que pruebes alcohol "solo por probar, total es una sola vez".', correcta:'Decir que no con seguridad y buscar el apoyo de un adulto de confianza si la presión continúa', malas:['Aceptar para que dejen de insistir','Burlarte de quienes sí deciden no beber','Irte del lugar sin avisar a nadie de tu entorno'] },
  { situacion:'Un conocido ofrece "probar algo" en una salida, asegurando que no pasa nada porque lo hace seguido.', correcta:'Rechazarlo firmemente: que alguien lo haga seguido no significa que sea seguro', malas:['Probarlo una sola vez para no quedar mal','Guardar el secreto sin decírselo a nadie','Pensar que como otros lo hacen, no hay riesgo'] },
  { situacion:'Sientes curiosidad por el vapeo porque varios compañeros lo hacen en el recreo.', correcta:'Informarte con fuentes confiables sobre sus riesgos reales antes de decidir', malas:['Probarlo porque "todos lo hacen"','Asumir que no tiene ningún riesgo por ser popular','Presionar a otros compañeros para que también lo prueben'] },
  { situacion:'Un amigo te cuenta que empezó a fumar para sentirse parte de un grupo nuevo.', correcta:'Apoyarlo sin juzgar, y ayudarlo a buscar otras formas de integrarse que no impliquen riesgo', malas:['Dejar de hablarle por esa decisión','Sumarte tú también para acompañarlo','Ignorar el tema completamente'] },
  { situacion:'En una reunión social te ofrecen manejar un vehículo aunque no te sientes en condiciones seguras.', correcta:'Negarte y buscar una alternativa de transporte segura', malas:['Manejar igual porque "es un trayecto corto"','Aceptar la presión del grupo','No decir nada y subirte de todos modos'] },
  { situacion:'Un compañero comenta que consumir energéticas mezcladas con otras sustancias "le ayuda a rendir más en las pruebas".', correcta:'Explicarle que esa mezcla puede ser riesgosa y que el buen rendimiento se logra con hábitos de estudio y descanso', malas:['Pedirle que te consiga lo mismo','Copiar esa costumbre sin informarte','Decirle que siga haciéndolo sin cuestionarlo'] },
  { situacion:'Notas que un amigo cercano ha cambiado su comportamiento y sospechas que puede estar en una situación de riesgo relacionada al consumo de sustancias.', correcta:'Conversarlo con cuidado y buscar la ayuda de un adulto de confianza o profesional si es necesario', malas:['Ignorarlo porque "es su problema"','Guardar el secreto sin buscar ayuda para él','Burlarte de la situación frente a otros'] },
  { situacion:'En una junta familiar, un adulto mayor le ofrece a un adolescente probar alcohol "solo un poco, para celebrar".', correcta:'Rechazarlo con respeto, explicando que prefiere no consumir alcohol', malas:['Aceptar para no incomodar al adulto','Tomarlo a escondidas de los demás','Presionar a otros adolescentes para que también acepten'] },
  { situacion:'Un compañero comparte en el curso información falsa sobre que cierta sustancia "no genera ningún riesgo si se consume poco".', correcta:'Buscar información de fuentes confiables antes de creer esa afirmación', malas:['Creer la afirmación sin verificarla','Compartir esa información falsa con más personas','Probar la sustancia para comprobarlo tú mismo'] },
];
export function genPrevencionRiesgosM1Round(){
  const recurso = 'Frente a situaciones de riesgo relacionadas con el consumo de sustancias u otras conductas riesgosas, es clave reconocer los <b>factores de riesgo</b> (presión de grupo, curiosidad, creer que "solo por probar" no tiene consecuencias) y los <b>factores de protección</b> (información confiable, seguridad para decir que no, apoyo de adultos de confianza). Decir que no con firmeza —sin necesidad de justificarse frente a la presión de un grupo— es una habilidad que se puede entrenar, igual que reconocer cuándo un amigo podría estar en una situación de riesgo y saber a quién acudir para pedir ayuda. Informarse con fuentes confiables, en vez de dejarse llevar por lo que "todos hacen", es la base para tomar decisiones que cuiden la propia salud y bienestar.';
  const item = pick(PREVENCION_RIESGOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const BIENESTAR_VIDA_M1_BANK = [
  { label:'Dormir entre 8 y 10 horas es importante para la concentración y el ánimo en la adolescencia', v:true },
  { label:'Alimentarse solo con comida rápida todos los días no tiene ningún efecto en la salud', v:false },
  { label:'Hacer alguna actividad física regularmente ayuda al bienestar físico y emocional', v:true },
  { label:'Pasar toda la noche despierto usando el teléfono no afecta el rendimiento del día siguiente', v:false },
  { label:'Tomarse pausas durante el estudio ayuda a mantener la concentración por más tiempo', v:true },
  { label:'Cuidar la postura al sentarse largos ratos frente a una pantalla previene dolores físicos', v:true },
  { label:'Hidratarse durante el día es igual de importante que hacerlo solo cuando hay mucha sed', v:true },
  { label:'Ignorar por completo el cansancio físico y seguir exigiéndose siempre es lo más saludable', v:false },
  { label:'Organizar el tiempo entre estudio, descanso y actividades recreativas favorece el bienestar general', v:true },
  { label:'Reconocer cuándo se necesita ayuda (médica, psicológica o de un adulto de confianza) es parte del autocuidado', v:true },
];
export function genBienestarVidaM1Round(){
  const recurso = 'Llevar una <b>vida activa y saludable</b> en la adolescencia implica cuidar varios aspectos a la vez: dormir lo suficiente (entre 8 y 10 horas), alimentarse de forma equilibrada, mantenerse físicamente activo, hidratarse durante el día (no solo cuando ya hay mucha sed), y cuidar la postura al pasar largos ratos frente a una pantalla. También es clave organizar el tiempo entre estudio, descanso y actividades recreativas, tomar pausas durante el estudio para mantener la concentración, y reconocer cuándo se necesita pedir ayuda —médica, psicológica o de un adulto de confianza— como parte normal del autocuidado, no como una debilidad.';
  const item = pick(BIENESTAR_VIDA_M1_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.v, speakText: item.label, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    recurso: recurso,
  };
}

const RELACIONES_REDES_M1_BANK = [
  { situacion:'Un amigo publica en redes sociales un comentario negativo sobre otro compañero del curso.', correcta:'No sumarte al comentario y, si es posible, conversarlo en privado con quien lo publicó', malas:['Compartir el comentario para que más gente lo vea','Sumar tú también críticas al compañero','Ignorarlo aunque esté afectando a alguien'] },
  { situacion:'Alguien te pide que compartas una conversación privada de otra persona sin su consentimiento.', correcta:'Negarte: compartir conversaciones privadas sin permiso no es una relación de confianza sana', malas:['Compartirla igual porque "no es nada grave"','Compartirla solo con un grupo pequeño de amigos','Presionar a la otra persona para que te dé permiso'] },
  { situacion:'Notas que un compañero recibe comentarios ofensivos de forma repetida en redes sociales por parte de otros estudiantes.', correcta:'Apoyar a la persona afectada y reportarlo a un adulto de confianza o a la plataforma', malas:['Ignorarlo porque "es problema de otros"','Sumarte a los comentarios para encajar','Reenviar los comentarios a más personas'] },
  { situacion:'Una relación de amistad se ha vuelto controladora: uno de los dos exige saber todo lo que hace el otro en todo momento.', correcta:'Conversar abiertamente sobre esa dinámica, ya que una relación sana se basa en confianza, no en control', malas:['Aceptar el control para evitar un conflicto','Copiar esa forma de relacionarse con otras amistades','Ocultar cada vez más cosas en vez de conversarlo'] },
  { situacion:'Un desconocido en redes sociales insiste en pedirte información personal, como tu dirección o tu colegio.', correcta:'No entregar esa información y comentarlo con un adulto de confianza', malas:['Entregar la información porque parece amable','Bloquear sin decírselo a nadie que confía en ti','Seguir conversando para no ser descortés'] },
  { situacion:'Descubres que una imagen tuya fue compartida en un grupo sin tu autorización.', correcta:'Pedir que se elimine, y avisar a un adulto de confianza si la situación no se resuelve', malas:['No hacer nada porque "ya está compartida"','Compartir también algo privado de esa persona como venganza','Guardarte el problema sin contárselo a nadie'] },
  { situacion:'Un grupo de amigos te presiona constantemente para revisar el teléfono de otra persona sin su permiso.', correcta:'Negarte, porque revisar el teléfono de alguien sin su consentimiento no respeta su privacidad', malas:['Hacerlo para no quedar excluido del grupo','Hacerlo solo una vez, "porque no pasa nada"','Pedirle a otra persona que lo haga por ti'] },
  { situacion:'Un conocido en línea que nunca has visto en persona te pide encontrarte a solas en un lugar poco conocido.', correcta:'Rechazar la propuesta y comentarlo con un adulto de confianza', malas:['Aceptar sin decirle a nadie','Ir solo para no parecer desconfiado','Compartirle tu dirección exacta de inmediato'] },
  { situacion:'Una amistad de años empieza a alejarse cada vez que compartes tiempo con otras personas, exigiendo exclusividad.', correcta:'Conversar sobre esa dinámica, ya que una amistad sana no exige exclusividad ni control', malas:['Dejar de hablar con cualquier otra persona para complacerla','Terminar la amistad sin conversarlo primero','Aceptar la exigencia sin cuestionarla'] },
];
export function genRelacionesRedesM1Round(){
  const recurso = 'Las <b>relaciones interpersonales constructivas</b> —presenciales o en redes sociales— se basan en el respeto, la confianza y el consentimiento, nunca en el control o la presión. Compartir conversaciones privadas o imágenes de alguien sin su autorización, revisar el teléfono de otra persona sin permiso, o sumarse a comentarios ofensivos en redes, son formas de dañar esa confianza. Frente al <b>ciberacoso</b> (comentarios ofensivos repetidos en línea) o a desconocidos que piden información personal, lo adecuado es no participar, proteger la propia privacidad y la de otros, y buscar apoyo de un adulto de confianza cuando la situación lo requiere. Reconocer cuándo una relación se ha vuelto controladora —en vez de basarse en confianza mutua— también es parte de cuidar el propio bienestar.';
  const item = pick(RELACIONES_REDES_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const RESOLUCION_CONFLICTOS_M1_BANK = [
  { situacion:'Dos compañeros de un trabajo grupal no logran ponerse de acuerdo sobre cómo repartir las tareas.', correcta:'Conversar directamente, escuchar ambas posturas y buscar un acuerdo que respete a los dos', malas:['Que uno imponga su decisión sin escuchar al otro','Dejar el trabajo sin terminar por el conflicto','Pedirle a un tercero que decida sin consultarles'] },
  { situacion:'Sientes que un compañero no está respetando un acuerdo tomado por el curso.', correcta:'Plantearlo con calma, explicando por qué crees que no se está respetando el acuerdo', malas:['Confrontarlo agresivamente frente a todo el curso','Ignorarlo aunque afecte al resto','Tomar represalias por tu cuenta sin conversarlo'] },
  { situacion:'Un conflicto entre dos compañeros escala y ambos se dicen cosas hirientes frente al curso.', correcta:'Buscar la mediación de un adulto responsable para resolver el conflicto con calma', malas:['Sumarte a favor de uno de los dos','Grabar la discusión para compartirla después','Alentar a que sigan discutiendo'] },
  { situacion:'Dos grupos del curso tienen visiones opuestas sobre cómo organizar una actividad, y la discusión se ha vuelto tensa.', correcta:'Buscar puntos en común entre ambas posturas y proponer una solución intermedia', malas:['Insistir en que un grupo tiene toda la razón','Dividir el curso definitivamente en dos bandos','Cancelar la actividad sin buscar ningún acuerdo'] },
  { situacion:'Sientes que tus derechos no fueron respetados en una decisión tomada por un grupo del que formas parte.', correcta:'Expresarlo con respeto por los canales adecuados, argumentando por qué crees que tus derechos no fueron considerados', malas:['Quedarte callado para evitar cualquier conflicto','Reaccionar agresivamente sin explicar tu punto de vista','Abandonar el grupo sin decir nada'] },
  { situacion:'Un conflicto entre compañeros se resolvió, pero uno de ellos sigue sintiendo resentimiento.', correcta:'Dar espacio para procesar la situación y estar disponible para conversarlo si la otra persona lo necesita', malas:['Exigir que "haga como si nada hubiera pasado" de inmediato','Ignorar que la relación sigue tensa','Presionarlo a que actúe como si el conflicto no le afectara'] },
  { situacion:'Dos compañeros de curso tienen visiones políticas distintas y la conversación empieza a subir de tono.', correcta:'Escuchar el punto de vista del otro con respeto, aunque no se esté de acuerdo', malas:['Descalificar al otro por pensar distinto','Terminar la amistad por una diferencia de opinión','Imponer la propia opinión sin escuchar a la otra persona'] },
  { situacion:'Un grupo de trabajo no logra ponerse de acuerdo sobre quién presentará el proyecto final frente al curso.', correcta:'Conversarlo y decidir en conjunto, considerando las fortalezas de cada integrante', malas:['Que el más insistente decida sin consultar al resto','Discutir hasta el último momento sin llegar a un acuerdo','Elegir al azar sin conversarlo con el grupo'] },
];
export function genResolucionConflictosM1Round(){
  const recurso = 'Resolver un <b>conflicto</b> en un marco de respeto por los derechos de todas las personas involucradas requiere escuchar ambas posturas, buscar puntos en común y llegar a acuerdos que no ignoren a ninguna de las partes. Frente a un conflicto que escala o se vuelve difícil de manejar entre las partes involucradas, buscar la <b>mediación</b> de un adulto responsable es una estrategia válida, no una señal de debilidad. Es importante también reconocer que resolver un conflicto no siempre significa que las emociones desaparezcan de inmediato: a veces se necesita tiempo y espacio para procesar lo ocurrido, incluso después de llegar a un acuerdo. Expresar el propio punto de vista con respeto —en vez de callar o reaccionar de forma agresiva— es clave para resolver desacuerdos de forma sana.';
  const item = pick(RESOLUCION_CONFLICTOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/orientacion/2-medio —
   OR2M OA01-10. Cubiertos: OA03 (evaluar riesgos e identificar REDES DE APOYO
   —ángulo nuevo respecto a 1° medio, que solo cubrió factores de riesgo),
   OA04-06 (bienestar/relaciones constructivas/resolución de conflictos, con
   escenarios enteramente nuevos ya que el texto es casi idéntico al de 1°
   medio) y OA09 (contrastar trayectorias académicas y laborales posibles,
   OA genuinamente nuevo que ningún año anterior había cubierto). Fuera: OA01
   (alternativas de proyecto de vida, subjetivo), OA02 (sexualidad y vínculos
   afectivos, requiere acompañamiento real de un adulto — mismo criterio de
   siempre), OA07-08 (ya cubiertos por Formación Ciudadana en historia.js) y
   OA10 (diseñar un proyecto de vida propio, subjetivo). */
export const ORIENTACION_MODULES_M2 = [
  {id:'riesgosredesapoyom2', label:'Riesgos y Redes de Apoyo', open:true, key:'riesgosredesapoyom2'},
  {id:'bienestarrelacionesm2', label:'Bienestar, Relaciones y Conflictos II', open:true, key:'bienestarrelacionesm2'},
  {id:'proyeccionacademicam2', label:'Proyección Académica y Laboral', open:true, key:'proyeccionacademicam2'},
];
export const ORIENTACION_POS_M2 = [{x:24,y:85},{x:68,y:50},{x:24,y:15}];

const RIESGOS_REDES_M2_BANK = [
  { situacion:'Un compañero te cuenta, en confianza, que ha estado usando alcohol para "manejar el estrés" de las pruebas y que últimamente lo hace cada vez más seguido.', correcta:'Escucharlo con respeto y ayudarlo a buscar apoyo en un adulto de confianza, un profesor o un profesional de la salud', malas:['Guardar el secreto para siempre sin decírselo a nadie','Juzgarlo y alejarte de inmediato sin ninguna palabra','Decirle que no es un problema real'] },
  { situacion:'Sientes que una situación de violencia en tu entorno cercano te sobrepasa y no sabes bien qué hacer.', correcta:'Buscar ayuda en una red de apoyo: un adulto de confianza, un profesor, o instituciones como Carabineros o de salud', malas:['Enfrentar la situación completamente solo, sin pedir ayuda a nadie','Ignorar la situación esperando que se resuelva sola','Contárselo únicamente a desconocidos en internet'] },
  { situacion:'Notas que un amigo tiene conductas de riesgo cada vez más frecuentes, pero se enoja cada vez que alguien le menciona el tema.', correcta:'Insistir con respeto y, si es necesario, buscar apoyo de un adulto responsable que pueda intervenir de mejor forma', malas:['Dejar de ser su amigo sin explicarle por qué','No decir nada nunca más sobre el tema','Compartir la situación públicamente en redes sociales'] },
  { situacion:'No sabes bien a quién acudir si tú mismo estás pasando por una situación de riesgo (por ejemplo, presión de un grupo para consumir algo dañino).', correcta:'Recordar que existen redes de apoyo disponibles: familia, profesores, orientadores del colegio, o servicios de salud', malas:['Pensar que nadie puede ayudarte en esa situación','Resolverlo completamente solo, sin pedir ayuda a nadie','Evitar cualquier tipo de ayuda por vergüenza'] },
  { situacion:'Un amigo te cuenta que últimamente conduce su moto a exceso de velocidad "para sentir adrenalina", incluso de noche y sin casco.', correcta:'Expresarle tu preocupación con respeto y sugerirle que hable con un adulto de confianza sobre el riesgo real que corre', malas:['Acompañarlo para que no se sienta juzgado, sin decir nada','Grabarlo para subirlo a redes sociales','Ignorar el tema porque "es su decisión y no tu problema"'] },
  { situacion:'Sospechas que un compañero de curso está siendo víctima de violencia en su casa, aunque él no lo ha dicho abiertamente.', correcta:'Buscar apoyo en un adulto responsable del colegio (profesor, orientador) para que se active una red de apoyo adecuada', malas:['Confrontar directamente a la familia del compañero por tu cuenta','No decir nada porque "no es información confirmada"','Compartir tu sospecha con el resto del curso'] },
  { situacion:'Te enteras de que en una fiesta del curso circulará una sustancia desconocida y varios compañeros insisten en que "todos van a probar".', correcta:'Decidir con seguridad no participar y, si la situación te sobrepasa, avisar a un adulto de confianza', malas:['Participar para no quedar excluido del grupo','Guardarte la información sin decírsela a ningún adulto','Pensar que no existe ningún riesgo real en la situación'] },
  { situacion:'Un compañero de curso empieza a faltar seguido a clases y, cuando asiste, se ve visiblemente agotado y distinto a como era antes.', correcta:'Acercarte con respeto para preguntarle cómo está, y comentarle la situación a un profesor u orientador si te preocupa', malas:['Ignorarlo porque "no es asunto tuyo"','Comentar la situación con otros compañeros a sus espaldas','Asumir sin hablar con nadie que no tiene ningún problema'] },
];
export function genRiesgosRedesApoyoM2Round(){
  const recurso = 'Evaluar una <b>situación de riesgo</b> (consumo de sustancias, conductas riesgosas, violencia) implica reconocer que estas situaciones pueden afectar a cualquier persona, y que buscar ayuda no es una señal de debilidad. Las <b>redes de apoyo</b> son los recursos disponibles para enfrentar estas situaciones: la familia, los profesores u orientadores del colegio, instituciones de salud, y organismos comunitarios o de seguridad. Reconocer y saber a quién acudir —tanto si la situación de riesgo te afecta a ti como a alguien cercano— es una habilidad clave para actuar a tiempo, en vez de enfrentar solo un problema que puede requerir ayuda especializada.';
  const item = pick(RIESGOS_REDES_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const BIENESTAR_M2_BANK = [
  { situacion:'Tienes una semana muy cargada de pruebas y sientes que el estrés está afectando tu descanso y tu ánimo.', correcta:'Organizar tu tiempo, mantener hábitos de sueño y alimentación saludables, y dedicar algún momento a actividades que disfrutes', malas:['Dejar de dormir por completo para estudiar más horas','Ignorar por completo el estrés hasta que desaparezca solo','Aislarte completamente de tus amigos y familia'] },
  { situacion:'Notas que llevas semanas sin hacer ninguna actividad física ni de tiempo libre que disfrutes, solo estudiando.', correcta:'Incorporar de forma autónoma momentos de actividad física y de ocio en tu semana, sin que nadie te lo pida', malas:['Seguir exactamente igual, sin ningún cambio','Pensar que el tiempo libre no es importante para el bienestar','Reemplazar el estudio completamente por ocio, sin ningún equilibrio'] },
  { situacion:'Te das cuenta de que pasas varias horas al día usando el teléfono sin darte cuenta, y eso te deja con menos tiempo para dormir.', correcta:'Establecer límites propios de uso del teléfono, priorizando el descanso y otras actividades', malas:['Seguir usándolo igual, ya que "no afecta en nada"','Dejar el teléfono encendido toda la noche sin ningún límite','Culpar al teléfono sin hacer ningún cambio propio'] },
  { situacion:'Sientes que llevas mucho tiempo sin cuidar tu alimentación, comiendo rápido y sin variedad por falta de tiempo.', correcta:'Organizar con anticipación comidas más equilibradas, aunque el tiempo sea limitado', malas:['Aceptar que la mala alimentación es inevitable, sin buscar ningún cambio','Dejar de comer para ahorrar tiempo','Comer solo un tipo de alimento todos los días'] },
];
const RELACIONES_M2_BANK = [
  { situacion:'En un grupo de estudio, uno de los integrantes suele burlarse del acento de un compañero que viene de otra región del país.', correcta:'Señalar con respeto que ese comentario es una forma de discriminación y no debería repetirse', malas:['Reírte también para no quedar excluido del grupo','Ignorarlo porque "no es tan grave"','Dejar de hablarle al compañero afectado para evitar el conflicto'] },
  { situacion:'En una conversación grupal por redes sociales, alguien empieza a excluir deliberadamente a una persona de las decisiones del curso.', correcta:'Promover que todas las personas del grupo sean incluidas y tratadas con la misma dignidad, dentro y fuera de internet', malas:['Sumarte a la exclusión para no generar conflicto','No decir nada, ya que ocurre "solo en internet"','Compartir la conversación públicamente para burlarte'] },
  { situacion:'Un nuevo estudiante llega al curso con una discapacidad física, y algunos compañeros no saben cómo tratarlo y lo evitan.', correcta:'Acercarte con naturalidad y tratarlo con la misma igualdad y dignidad que a cualquier otro compañero', malas:['Evitarlo también, por no saber cómo actuar','Hablar de él en tercera persona, como si no estuviera presente','Tratarlo de forma exageradamente distinta al resto del curso'] },
  { situacion:'En un chat grupal, alguien comparte sin permiso una foto vergonzosa de otro compañero para que todos se rían.', correcta:'No reenviar la foto, y hacerle ver a quien la compartió que eso afecta la dignidad de la persona involucrada', malas:['Reenviarla también a otros grupos para que más gente la vea','Reírte del contenido sin decir nada más','Guardar la foto para usarla después'] },
];
const CONFLICTOS_M2_BANK = [
  { situacion:'Dos compañeros de un proyecto grupal no logran ponerse de acuerdo en cómo repartir el trabajo, y la tensión afecta a todo el grupo.', correcta:'Buscar una conversación donde ambas partes propongan ideas y lleguen a un acuerdo que beneficie a todo el grupo', malas:['Que una sola persona decida todo sin escuchar a la otra','Ignorar el conflicto hasta que el proyecto se atrase por completo','Elegir un bando y dejar de hablarle al otro compañero'] },
  { situacion:'Un desacuerdo entre dos amigos escala rápidamente porque ambos insisten en que "el otro está completamente equivocado".', correcta:'Buscar puntos en común entre ambas posturas y proponer una solución que ambos consideren justa', malas:['Insistir en que uno de los dos "gane" completamente la discusión','Evitar la conversación para siempre, sin resolver nada','Pedirle a otras personas que tomen partido por uno de los dos'] },
  { situacion:'Dos integrantes de un equipo deportivo discuten fuerte porque uno cree que el otro no está esforzándose lo suficiente en los entrenamientos.', correcta:'Conversar directamente y con calma sobre las expectativas de cada uno, buscando un acuerdo que funcione para el equipo', malas:['Quejarse con el resto del equipo sin hablar directamente con la persona','Dejar de entrenar juntos sin resolver el conflicto','Humillar públicamente al compañero frente al equipo'] },
];
export function genBienestarRelacionesM2Round(){
  const recurso = 'Promover el propio <b>bienestar</b> de forma autónoma implica organizar el tiempo para equilibrar estudio, descanso, alimentación y momentos de ocio, sin esperar a que alguien más lo recuerde. Construir <b>relaciones constructivas</b> —tanto presenciales como en internet— se basa en la igualdad, la dignidad y la no discriminación: señalar con respeto un comentario discriminatorio, o incluir a todas las personas de un grupo, son formas concretas de aplicar estos valores. Y al enfrentar un <b>conflicto</b>, buscar acuerdos que beneficien a ambas partes involucradas —en vez de que una "gane" por completo— genera soluciones más duraderas y relaciones más sanas a largo plazo.';
  const roll = Math.random();
  const bank = roll<0.34 ? BIENESTAR_M2_BANK : (roll<0.67 ? RELACIONES_M2_BANK : CONFLICTOS_M2_BANK);
  const item = pick(bank);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.situacion+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion, cols:2, panel:true,
    explain: 'Lo mejor es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const PROYECCION_ACADEMICA_M2_BANK = [
  { pregunta:'Al contrastar distintas trayectorias académicas o laborales posibles después del colegio, ¿qué es lo más importante a considerar?', correcta:'Las propias habilidades, intereses y motivaciones, además de la información real sobre cada camino', opts:['Elegir únicamente lo que otras personas esperan, sin considerar los propios intereses','Elegir al azar, sin ninguna información previa','Descartar cualquier camino que tome más de un año'] },
  { pregunta:'¿Por qué es útil informarse sobre varias alternativas (educación técnica, universitaria, o ingreso directo al mundo laboral) antes de decidir un camino?', correcta:'Porque permite comparar de forma realista qué opción se ajusta mejor a las propias capacidades e intereses', opts:['Porque solo existe un camino válido después del colegio','Porque no es necesario informarse antes de decidir nada','Porque todas las alternativas son exactamente iguales en todo sentido'] },
  { pregunta:'¿Qué significa que una trayectoria académica o laboral se "contraste" en vez de solo elegirse por impulso?', correcta:'Comparar sus ventajas, desafíos y qué tan bien se ajusta a las propias capacidades e intereses reales', opts:['Elegir la opción más popular entre los amigos, sin ningún análisis propio','Elegir la primera opción que aparezca, sin comparar nada más','Evitar pensar en el futuro hasta el último momento posible'] },
  { pregunta:'¿Qué recurso es útil para conocer mejor las propias habilidades e intereses antes de proyectar un camino académico o laboral?', correcta:'La autoevaluación honesta y la orientación de profesionales o adultos de confianza', opts:['Ignorar por completo las propias habilidades e intereses','Copiar exactamente la decisión de un amigo cercano','Decidir sin ninguna reflexión previa'] },
  { pregunta:'¿Por qué puede ser útil hablar con personas que ya siguen distintas trayectorias académicas o laborales antes de decidir un camino propio?', correcta:'Porque su experiencia real puede aportar información valiosa sobre las ventajas y desafíos de cada alternativa', opts:['Porque hay que copiar exactamente lo que ellos hicieron','Porque su opinión es la única que debería importar','Porque no aporta ninguna información útil'] },
  { pregunta:'¿Qué significa que una decisión sobre el futuro académico o laboral "puede seguir ajustándose con el tiempo"?', correcta:'Que no es necesario tener una decisión perfecta o definitiva desde el principio, ya que se puede reevaluar más adelante', opts:['Que la primera decisión tomada es imposible de cambiar nunca','Que no vale la pena reflexionar porque todo cambiará igual','Que da lo mismo qué camino se elija al principio'] },
  { pregunta:'¿Qué riesgo existe al elegir una trayectoria académica o laboral solo por presión de otras personas, sin considerar los propios intereses?', correcta:'Que la persona termine insatisfecha con un camino que no se ajusta a sus propias capacidades o motivaciones', opts:['Ningún riesgo real, siempre resulta bien','Que automáticamente se convierta en la mejor decisión posible','Que sea obligatoriamente la opción más exitosa'] },
  { pregunta:'¿Por qué la educación técnica y la educación universitaria pueden considerarse caminos igualmente válidos, según las capacidades e intereses de cada persona?', correcta:'Porque ambas ofrecen formación y oportunidades laborales reales, y la mejor opción depende del proyecto personal de cada quien', opts:['Porque la educación técnica no ofrece ninguna oportunidad laboral real','Porque solo la educación universitaria tiene algún valor', 'Porque ambas son exactamente idénticas en duración y contenido'] },
];
export function genProyeccionAcademicaM2Round(){
  const recurso = 'Contrastar distintas <b>trayectorias académicas y laborales</b> posibles (educación técnica, universitaria, o ingreso directo al mundo del trabajo) significa comparar de forma realista sus ventajas, desafíos y qué tan bien se ajustan a las propias habilidades, intereses y motivaciones — en vez de elegir por impulso, por presión externa, o copiando la decisión de otra persona. Informarse con datos reales sobre cada alternativa, y apoyarse en una autoevaluación honesta junto con la orientación de profesionales o adultos de confianza, permite tomar una decisión más consciente sobre el propio futuro, sabiendo que ese camino puede seguir ajustándose con el tiempo.';
  const item = pick(PROYECCION_ACADEMICA_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

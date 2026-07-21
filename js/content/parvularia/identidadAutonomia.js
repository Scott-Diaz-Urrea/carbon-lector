import { pick, shuffle } from '../../utils.js';

/* Núcleo Identidad y Autonomía — Educación Parvularia, NT (Decreto 481/2017,
   ámbito Desarrollo Personal y Social, curriculumnacional.cl/614/articles-115242_bases.pdf):
   OA01/OA03 -> Reconoce Emociones · OA09 -> Autocuidado y Hábitos ·
   OA11 -> Alimentos y Sellos.
   Quedan fuera: OA02, OA04-08, OA10, OA12-13 — son de autorregulación,
   comunicación de preferencias/identidad propia, planificación de juegos y
   juego sociodramático: dependen de la vivencia personal de cada niño/a, no
   tienen una respuesta correcta objetiva y no son aptos para opción múltiple. */

export const IDENTIDAD_AUTONOMIA_MODULES = [
  { id:'emocionesnt', label:'Reconoce Emociones', open:true, key:'emocionesnt' },
  { id:'autocuidadont', label:'Autocuidado y Hábitos', open:true, key:'autocuidadont' },
  { id:'alimentosnt', label:'Alimentos y Sellos', open:true, key:'alimentosnt' },
];
export const IDENTIDAD_AUTONOMIA_POS = [
  {x:24,y:82},{x:68,y:50},{x:24,y:18}
];

const EMOCIONES_POOL = [
  { id:'feliz', emoji:'😄', label:'Feliz' },
  { id:'triste', emoji:'😢', label:'Triste' },
  { id:'enojado', emoji:'😠', label:'Enojado' },
  { id:'miedo', emoji:'😨', label:'Miedo' },
];
const EMOCIONES_ESCENAS = [
  { texto:'A Sofía se le rompió su juguete favorito.', emocion:'triste' },
  { texto:'Le regalaron una mascota nueva a Tomás.', emocion:'feliz' },
  { texto:'Un perro grande le ladró muy fuerte a Martina.', emocion:'miedo' },
  { texto:'Su hermano le quitó el juguete sin pedirlo.', emocion:'enojado' },
  { texto:'Hoy es el cumpleaños de Valentina y hay torta.', emocion:'feliz' },
  { texto:'Se despertó en la noche por un ruido muy fuerte.', emocion:'miedo' },
  { texto:'Ganó el primer lugar en la carrera del jardín.', emocion:'feliz' },
  { texto:'Alguien se rió de su dibujo sin razón.', emocion:'triste' },
];

const AUTOCUIDADO_BANK = [
  { pregunta:'¿Qué usas para lavarte los dientes?', correct:'🪥', opts:['🧴','🧼','🪮'] },
  { pregunta:'¿Qué usas para lavarte las manos y la cara?', correct:'🧼', opts:['🪥','🧴','🪮'] },
  { pregunta:'¿Qué te pones en los pies para salir a jugar?', correct:'👟', opts:['🧢','🧤','👓'] },
  { pregunta:'¿Qué usas para peinarte el pelo?', correct:'🪮', opts:['🪥','🧼','🧦'] },
  { pregunta:'¿Qué ropa te pones cuando hace mucho frío?', correct:'🧥', opts:['🩳','🩱','🧢'] },
  { pregunta:'¿Qué te pones en la cabeza cuando hay mucho sol?', correct:'🧢', opts:['🧤','👟','🧣'] },
  { pregunta:'¿Qué usas para bañarte?', correct:'🛁', opts:['🪥','🧢','🪮'] },
  { pregunta:'¿Qué usas para protegerte los ojos cuando el sol está muy fuerte?', correct:'🕶️', opts:['🧣','🧤','👟'] },
];

const SELLO_ALIMENTOS = ['🍬','🥤','🍰','🍟','🍭','🧁'];
const SIN_SELLO_ALIMENTOS = ['🍎','🥦','🥕','🍇','🍊','🥒'];

export function genEmocionesNTRound(){
  const item = pick(EMOCIONES_ESCENAS);
  const opts = shuffle(EMOCIONES_POOL.map(function(e){ return {label:e.emoji+' '+e.label, value:e.id}; }));
  const correctLabel = EMOCIONES_POOL.filter(function(e){ return e.id===item.emocion; })[0].label;
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Cómo se siente?</p>',
    options: opts, correctValue: item.emocion, speakText: item.texto+' ¿Cómo se siente?', cols:2, panel:true,
    explain: 'Cuando pasa eso, lo más común es sentirse <b>'+correctLabel.toLowerCase()+'</b>.',
  };
}

export function genAutocuidadoNTRound(){
  const item = pick(AUTOCUIDADO_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correct, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es '+item.correct+'.',
  };
}

export function genAlimentosNTRound(){
  const askConSello = Math.random() < 0.5;
  const correctPool = askConSello ? SELLO_ALIMENTOS : SIN_SELLO_ALIMENTOS;
  const distractPool = askConSello ? SIN_SELLO_ALIMENTOS : SELLO_ALIMENTOS;
  const correct = pick(correctPool);
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([correct].concat(distract)).map(function(e){ return {label:e, value:e}; });
  const question = askConSello
    ? '¿Cuál de estos alimentos suele tener sellos de advertencia como "ALTO EN AZÚCARES"?'
    : '¿Cuál de estos alimentos NO necesita sellos de advertencia?';
  return {
    promptHTML: '<p class="prompt-hint">'+question+'</p>',
    options: opts, correctValue: correct, speakText: question, cols:4,
    explain: askConSello
      ? 'Los dulces, bebidas y comida chatarra suelen tener sellos negros de advertencia por su alto contenido de azúcar, sodio o grasas.'
      : 'Las frutas y verduras naturales no necesitan sellos de advertencia porque no son alimentos procesados.',
  };
}

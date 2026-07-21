import { pick, shuffle } from '../../utils.js';
import { toothbrushSVG, peinetaSVG, bebidaDulceSVG } from '../../svg.js';

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

/* AUTOCUIDADO_BANK guarda un id en vez del emoji/dibujo directamente: dos
   íconos (cepillo de dientes y peineta) no tienen un emoji Unicode que se
   renderice de forma confiable (🪥/🪮 aparecen como recuadro vacío en varios
   navegadores), así que se dibujan a mano con toothbrushSVG()/peinetaSVG().
   ICONOS mapea cada id a su representación visual y a la palabra que lo
   describe, para que `explain` pueda nombrar la respuesta en vez de solo
   repetir el ícono (antes decía literalmente "La respuesta correcta es 🛁."). */
const ICONOS = {
  cepillo: { visual: toothbrushSVG(52), label:'el cepillo de dientes' },
  jabon: { visual:'🧼', label:'el jabón' },
  zapatillas: { visual:'👟', label:'las zapatillas' },
  peineta: { visual: peinetaSVG(52), label:'la peineta' },
  abrigo: { visual:'🧥', label:'el abrigo' },
  gorro: { visual:'🧢', label:'el gorro' },
  tina: { visual:'🛁', label:'la tina' },
  lentesSol: { visual:'🕶️', label:'los lentes de sol' },
  crema: { visual:'🧴', label:'la crema' },
  guantes: { visual:'🧤', label:'los guantes' },
  anteojos: { visual:'👓', label:'los anteojos' },
  calcetines: { visual:'🧦', label:'los calcetines' },
  shorts: { visual:'🩳', label:'el short' },
  trajeBano: { visual:'🩱', label:'el traje de baño' },
  bufanda: { visual:'🧣', label:'la bufanda' },
};

const AUTOCUIDADO_BANK = [
  { pregunta:'¿Qué usas para lavarte los dientes?', correct:'cepillo', opts:['crema','jabon','peineta'] },
  { pregunta:'¿Qué usas para lavarte las manos y la cara?', correct:'jabon', opts:['cepillo','crema','peineta'] },
  { pregunta:'¿Qué te pones en los pies para salir a jugar?', correct:'zapatillas', opts:['gorro','guantes','anteojos'] },
  { pregunta:'¿Qué usas para peinarte el pelo?', correct:'peineta', opts:['cepillo','jabon','calcetines'] },
  { pregunta:'¿Qué ropa te pones cuando hace mucho frío?', correct:'abrigo', opts:['shorts','trajeBano','gorro'] },
  { pregunta:'¿Qué te pones en la cabeza cuando hay mucho sol?', correct:'gorro', opts:['guantes','zapatillas','bufanda'] },
  { pregunta:'¿Qué usas para bañarte?', correct:'tina', opts:['cepillo','gorro','peineta'] },
  { pregunta:'¿Qué usas para protegerte los ojos cuando el sol está muy fuerte?', correct:'lentesSol', opts:['bufanda','guantes','zapatillas'] },
];

/* 🥤 se sacó de SELLO_ALIMENTOS porque es ambiguo (un vaso con bombilla
   también podría ser jugo natural, no necesariamente una bebida azucarada);
   bebidaDulceSVG() (un vaso con crema batida, cereza y bombilla, dibujado a
   mano) transmite "bebida dulce/postre" sin esa ambigüedad, siguiendo el
   mismo criterio del resto de este bloque: dibujar el concepto en vez de
   reemplazarlo por otro emoji (se probaron 🧋 y 🍹 antes de esto: 🧋 no se
   renderiza — recuadro vacío — en varios navegadores, y 🍹 sí renderiza
   pero seguía siendo un reemplazo de concepto en vez de dibujar el
   original). Ambos bancos se ampliaron de 6 a 8 para que un juego de
   rounds:8 no repita siempre los mismos alimentos. */
const SELLO_ALIMENTOS = ['🍬', bebidaDulceSVG(30), '🍰','🍟','🍭','🧁','🍫','🍩'];
const SIN_SELLO_ALIMENTOS = ['🍎','🥦','🥕','🍇','🍊','🥒','🍌','🥬'];

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
  const opts = shuffle([item.correct].concat(item.opts)).map(function(id){ return {label:ICONOS[id].visual, value:id}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correct, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+ICONOS[item.correct].label+'</b>.',
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

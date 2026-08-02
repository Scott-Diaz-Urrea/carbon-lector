import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Media: Idioma Extranjero Inglés ----------------
   Nivel 1 Media equivale a 1°-2° medio (ver content/grades.js). Fuente real: "Temario Primer
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er semestre). Primera vez que EPJA incluye Inglés (Nivel 1/2/3 Básica no lo tienen — el
   temario de Básica no lista ese subsector; Nivel 1 Media es el primero que sí lo hace).
   El temario NM1 Inglés especifica: textos tipo instructivos/narrativos/descriptivos
   (extractos de manuales, catálogos, instrucciones de uso de maquinaria/herramientas,
   folletos sobre procesos productivos/recursos naturales, páginas web, canciones,
   anécdotas, recetas); elementos morfosintácticos (verbo "to be" en todas sus formas,
   there is/there are, presente simple y progresivo, comparativos/superlativos,
   imperativos, wh-questions, posición de adjetivos, adverbios de frecuencia, conectores,
   preposiciones de lugar, expresiones de cuantificación how much/how many); y habilidades
   de comprensión lectora (identificar información explícita, inferir/interpretar, y
   reflexionar usando conocimiento externo al texto).
   3 módulos: Gramática en Contexto (los elementos morfosintácticos del temario, siempre en
   contexto de oración, nunca como regla aislada), Vocabulario y Textos Funcionales
   (vocabulario de los textos tipo que lista el temario: manuales, catálogos, herramientas,
   recetas), y Comprensión de Lectura (textos breves con las 3 habilidades del temario:
   identificar, inferir/interpretar, reflexionar). Mismo mecanismo ya usado desde 5° básico
   en content/ingles.js: `speakLang:'en'` en cada ronda para que `speak()` busque una voz en
   inglés; `recurso` siempre en español (explicación pedagógica dirigida al estudiante, no
   el contenido del ítem). Contextos de vida adulta (trabajo, herramientas, procesos
   productivos) en vez de escolares/infantiles, mismo criterio que el resto de EPJA. */

export const INGLES_EPJA_M1_MODULES = [
  {id:'gramaticaContextoEpjaM1', label:'Gramática en Contexto', open:true, key:'gramaticaContextoEpjaM1'},
  {id:'vocabularioFuncionalEpjaM1', label:'Vocabulario y Textos Funcionales', open:true, key:'vocabularioFuncionalEpjaM1'},
  {id:'comprensionInglesEpjaM1', label:'Comprensión de Lectura', open:true, key:'comprensionInglesEpjaM1'},
];
export const INGLES_EPJA_M1_POS = [{x:30,y:80},{x:70,y:44},{x:30,y:8}];

/* ---------------- Gramática en Contexto ---------------- */
const RECURSO_GRAMATICA_INGLES_M1 = 'La gramática del inglés se aprende mejor <b>en contexto</b>, dentro de una oración completa, en vez de memorizar reglas aisladas. El verbo <b>"to be"</b> cambia según el sujeto (I am, you are, he/she is); <b>"there is/there are"</b> se usa para decir que algo existe en un lugar; los <b>comparativos y superlativos</b> comparan dos o más cosas; los <b>imperativos</b> dan una instrucción u orden directa; las <b>wh-questions</b> (who, what, where, when) piden información específica; y los <b>adverbios de frecuencia</b> (always, usually, sometimes, never) indican con qué frecuencia ocurre algo — todos elementos muy usados al leer un manual, una instrucción de trabajo o una receta.';
const GRAMATICA_INGLES_M1_BANK = [
  { oracion:'She ___ a supervisor at the factory.', correcta:'is', opts:['are','am','be'] },
  { oracion:'We ___ new employees at this company.', correcta:'are', opts:['is','am','be'] },
  { oracion:'I ___ ready to start my shift.', correcta:'am', opts:['is','are','be'] },
  { oracion:'___ a fire extinguisher in this room.', correcta:'There is', opts:['There are','There be','There am'] },
  { oracion:'___ many tools in the workshop.', correcta:'There are', opts:['There is','There be','There am'] },
  { oracion:'This machine is ___ than the old one.', correcta:'faster', opts:['fast','fastest','more fast'] },
  { oracion:'This is the ___ tool in the whole workshop.', correcta:'most useful', opts:['useful','more useful','usefuler'] },
  { oracion:'___ the safety helmet before entering the site.', correcta:'Wear', opts:['Wearing','Wears','To wear'] },
  { oracion:'___ do you turn off this machine?', correcta:'How', opts:['Who','What','When'] },
  { oracion:'___ is responsible for checking the equipment every morning?', correcta:'Who', opts:['How','Where','What'] },
  { oracion:'He ___ arrives late to his shift; he is very punctual.', correcta:'never', opts:['always','usually',"doesn't"] },
  { oracion:'She ___ wears her safety gloves before working with the machine.', correcta:'always', opts:['never','rarely','none'] },
  { oracion:'The tool box is ___ the table, not on top of it.', correcta:'under', opts:['on','above','between'] },
  { oracion:'___ water do we need for this recipe?', correcta:'How much', opts:['How many','How','What'] },
  { oracion:'___ workers are needed to finish this task?', correcta:'How many', opts:['How much','How','What'] },
];
export function genGramaticaContextoEpjaM1Round(){
  const item = pick(GRAMATICA_INGLES_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const oracionCompleta = item.oracion.replace('___', item.correcta);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">Choose the correct word to complete the sentence. (Elige la palabra correcta para completar la oración.)</p>',
    options: opts, correctValue: item.correcta, speakText: oracionCompleta, speakLang:'en', cols:2, panel:true,
    explain: 'La oración correcta es: "'+oracionCompleta+'".',
    recurso: RECURSO_GRAMATICA_INGLES_M1,
  };
}

/* ---------------- Vocabulario y Textos Funcionales ---------------- */
const RECURSO_VOCABULARIO_FUNCIONAL_M1 = 'Los <b>textos funcionales</b> (manuales, catálogos, folletos, recetas, instrucciones de uso de herramientas o maquinaria) usan un vocabulario específico y práctico, muy distinto del vocabulario de un relato o un poema. Reconocer estas palabras en inglés —nombres de herramientas, verbos de instrucción, medidas y pasos de un proceso— es especialmente útil en contextos laborales, donde muchos manuales o etiquetas de productos vienen en inglés.';
const VOCABULARIO_FUNCIONAL_M1_BANK = [
  { pregunta:'Which word means "manual" or "instruction book" in English?', correcta:'Manual', opts:['Recipe','Catalog','Brochure'] },
  { pregunta:'Which word describes a book that shows products available for sale, often used by a company?', correcta:'Catalog', opts:['Manual','Recipe','Anecdote'] },
  { pregunta:'Which word means a small printed document with information about a product or service?', correcta:'Brochure', opts:['Catalog','Recipe','Song'] },
  { pregunta:'Which word describes a set of instructions to prepare a meal?', correcta:'Recipe', opts:['Manual','Brochure','Anecdote'] },
  { pregunta:'Which tool is used to tighten or loosen a bolt?', correcta:'Wrench', opts:['Hammer','Ladder','Bucket'] },
  { pregunta:'Which tool is used to hit a nail into wood?', correcta:'Hammer', opts:['Wrench','Ladder','Scissors'] },
  { pregunta:'Which word describes a step-by-step set of instructions for using a machine?', correcta:'Instructions', opts:['A song','An anecdote','A poem'] },
  { pregunta:'Which word means "raw materials" used to produce something, such as wood or metal?', correcta:'Raw materials', opts:['Finished products','Empty boxes','Broken tools'] },
  { pregunta:'Which word means a short personal story someone tells about something that happened to them?', correcta:'Anecdote', opts:['Manual','Catalog','Recipe'] },
  { pregunta:'Which word means the process of making a product in a factory, from raw material to finished product?', correcta:'Production process', opts:['Vacation plan','Musical concert','Sports match'] },
];
export function genVocabularioFuncionalEpjaM1Round(){
  const item = pick(VOCABULARIO_FUNCIONAL_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, speakLang:'en', cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_VOCABULARIO_FUNCIONAL_M1,
  };
}

/* ---------------- Comprensión de Lectura ---------------- */
const RECURSO_COMPRENSION_INGLES_M1 = 'Comprender un texto en inglés implica tres habilidades: <b>identificar</b> información explícita (lo que el texto dice literalmente), <b>inferir e interpretar</b> lo que no está dicho de forma directa (relacionando pistas del texto), y <b>reflexionar</b>, usando conocimiento externo al texto para construir un nuevo punto de vista. Practicar con textos breves de tipo instructivo, narrativo o descriptivo —como los que se encuentran en manuales, recetas o folletos reales— fortalece estas tres habilidades a la vez.';
const COMPRENSION_INGLES_M1_BANK = [
  { texto:'First, turn off the machine. Then, unplug it from the wall. Finally, clean the surface with a dry cloth.', pregunta:'What is the first step in this instruction?', correcta:'Turn off the machine', opts:['Unplug it from the wall','Clean the surface','Plug it back in'], habilidad:'identificar' },
  { texto:'Add two cups of flour, one egg, and a cup of milk. Mix well until smooth. Cook on low heat for five minutes.', pregunta:'How long should this be cooked?', correcta:'Five minutes', opts:['Two minutes','Ten minutes','One hour'], habilidad:'identificar' },
  { texto:'Carlos worked at the factory for twenty years. Every morning, he checked all the machines before anyone else arrived.', pregunta:'What can you infer about Carlos from this text?', correcta:'He was a responsible and experienced worker', opts:['He never went to work','He was new at the job','He disliked his job'], habilidad:'inferir' },
  { texto:'Maria saved money every month for three years. Finally, she bought her own small shop in the neighborhood.', pregunta:'What can you infer about Maria?', correcta:'She was patient and worked toward a long-term goal', opts:['She spent all her money quickly','She received the shop as a gift','She never wanted to own a shop'], habilidad:'inferir' },
  { texto:'This brochure describes a new recycling program: separate paper, plastic, and glass into different bins before collection day.', pregunta:'Based on this brochure, why do you think separating materials matters?', correcta:'Because it makes recycling more effective', opts:['Because it makes garbage heavier','Because it is required only once a year','Because it has no real purpose'], habilidad:'reflexionar' },
  { texto:'The safety manual states: always wear gloves and safety glasses when operating this equipment.', pregunta:'Why do you think this rule exists?', correcta:'To protect workers from possible injuries', opts:['To make the work slower on purpose','Because gloves are fashionable','It has no real reason'], habilidad:'reflexionar' },
  { texto:'Add water to the pot. Bring it to a boil. Add the pasta and cook for ten minutes. Drain and serve.', pregunta:'What should you do right after bringing the water to a boil?', correcta:'Add the pasta', opts:['Drain the water','Serve the meal','Turn off the stove immediately'], habilidad:'identificar' },
  { texto:'This catalog lists tools for home repair: hammers, wrenches, screwdrivers, and ladders, all available for a limited-time discount.', pregunta:'What is the main purpose of this text?', correcta:'To advertise tools for sale at a discount', opts:['To tell a personal story','To give safety instructions','To describe a recipe'], habilidad:'identificar' },
];
export function genComprensionInglesEpjaM1Round(){
  const item = pick(COMPRENSION_INGLES_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto+' '+item.pregunta, speakLang:'en', cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COMPRENSION_INGLES_M1,
  };
}

import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Media: Idioma Extranjero Inglés ----------------
   Nivel 2 Media equivale a 3°-4° medio (ver content/grades.js). Fuente real: "Temario Segundo
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er y 2do semestre). El temario NM2 Inglés es más avanzado que NM1: textos tipo
   instructivo/narrativo/descriptivo (extractos de hechos de la actualidad, narraciones
   breves, medidas de seguridad laboral, funcionamiento de instrumentos/herramientas);
   elementos morfosintácticos nuevos respecto a NM1: tiempos verbales simples MÁS presente
   perfecto, voz pasiva, verbos modales (can/could/might/may/must/should/would/ought),
   adverbios (just/ever/already/still; widely/only/electrically), conectores más avanzados
   (however/therefore/consequently/even though/although/on the contrary), adjetivos técnicos
   (useful/valuable/wireless/feasible/time consuming/capable), prefijos y sufijos, frases
   nominales y verbales. Habilidades de comprensión lectora: identificar, inferir e
   interpretar, y reflexionar (mismas 3 que NM1, pero aplicadas a textos más complejos). 3
   módulos: Gramática en Contexto (presente perfecto, voz pasiva, modales, conectores
   avanzados — siempre en oración completa), Vocabulario y Textos Técnicos (adjetivos
   técnicos, vocabulario de textos tipo: noticias, medidas de seguridad, instrumentos),
   Comprensión de Lectura (las 3 habilidades del temario con textos breves más complejos que
   NM1). Mismo mecanismo `speakLang:'en'` + `recurso` en español ya usado desde 5° básico.
   Contextos de vida adulta y laboral. */

export const INGLES_EPJA_M2_MODULES = [
  {id:'gramaticaContextoEpjaM2', label:'Gramática en Contexto', open:true, key:'gramaticaContextoEpjaM2'},
  {id:'vocabularioTecnicoEpjaM2', label:'Vocabulario y Textos Técnicos', open:true, key:'vocabularioTecnicoEpjaM2'},
  {id:'comprensionInglesEpjaM2', label:'Comprensión de Lectura', open:true, key:'comprensionInglesEpjaM2'},
];
export const INGLES_EPJA_M2_POS = [{x:30,y:80},{x:70,y:44},{x:30,y:8}];

/* ---------------- Gramática en Contexto ---------------- */
const RECURSO_GRAMATICA_INGLES_M2 = 'El <b>presente perfecto</b> (have/has + participio) conecta el pasado con el presente, por ejemplo para hablar de una experiencia o de algo que acaba de ocurrir. La <b>voz pasiva</b> se usa cuando el foco de la oración está en la acción o en quién la recibe, no en quién la realiza (por ejemplo, "the machine was repaired" en vez de "someone repaired the machine"). Los <b>verbos modales</b> (can, could, might, may, must, should, would, ought) expresan capacidad, posibilidad, obligación o consejo. Conectores como <b>however</b>, <b>therefore</b> o <b>although</b> ayudan a unir ideas mostrando contraste, consecuencia o concesión — muy usados en textos técnicos y noticias.';
const GRAMATICA_INGLES_M2_BANK = [
  { oracion:'She ___ finished the safety training this week.', correcta:'has', opts:['have','had','having'] },
  { oracion:'We ___ already completed the inspection.', correcta:'have', opts:['has','had','having'] },
  { oracion:'The new machine ___ installed by the technicians yesterday.', correcta:'was', opts:['is','has','were'] },
  { oracion:'All safety reports ___ reviewed every month.', correcta:'are', opts:['is','was','be'] },
  { oracion:'You ___ wear a helmet on this site; it is required by law.', correcta:'must', opts:['might','could','would'] },
  { oracion:'It ___ rain later, so bring an umbrella just in case.', correcta:'might', opts:['must','should','ought'] },
  { oracion:'You ___ check the oil level before starting the engine — it is a good habit.', correcta:'should', opts:['must necessarily','can never','would never'] },
  { oracion:'The report is accurate; ___, we can trust its conclusions.', correcta:'therefore', opts:['although','on the contrary','since'] },
  { oracion:'The machine is old; ___, it still works perfectly.', correcta:'however', opts:['therefore','because','so that'] },
  { oracion:'___ the price was high, the company decided to buy the new equipment.', correcta:'Even though', opts:['Therefore','Consequently','For example'] },
  { oracion:'This tool is useful ___ it saves a lot of time during repairs.', correcta:'because', opts:['although','however','on the contrary'] },
  { oracion:'The device ___ been tested by three different engineers so far.', correcta:'has', opts:['have','had','having'] },
];
export function genGramaticaContextoEpjaM2Round(){
  const item = pick(GRAMATICA_INGLES_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const oracionCompleta = item.oracion.replace('___', item.correcta);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">Choose the correct word to complete the sentence. (Elige la palabra correcta para completar la oración.)</p>',
    options: opts, correctValue: item.correcta, speakText: oracionCompleta, speakLang:'en', cols:2, panel:true,
    explain: 'La oración correcta es: "'+oracionCompleta+'".',
    recurso: RECURSO_GRAMATICA_INGLES_M2,
  };
}

/* ---------------- Vocabulario y Textos Técnicos ---------------- */
const RECURSO_VOCABULARIO_TECNICO_M2 = 'Los textos de noticias, medidas de seguridad y manuales de instrumentos usan un vocabulario técnico específico: adjetivos como <b>useful</b> (útil), <b>valuable</b> (valioso), <b>wireless</b> (inalámbrico) o <b>feasible</b> (factible/realizable) describen cualidades de herramientas o procesos, mientras que palabras relacionadas con la seguridad laboral (hazard, risk, protective equipment) son frecuentes en instructivos de trabajo. Reconocer este vocabulario ayuda a entender rápidamente un texto técnico real, como un manual o un aviso de seguridad.';
const VOCABULARIO_TECNICO_M2_BANK = [
  { pregunta:'Which word means "able to be done or carried out successfully"?', correcta:'Feasible', opts:['Impossible','Wireless','Fragile'] },
  { pregunta:'Which word describes a device or tool that does not need cables to work?', correcta:'Wireless', opts:['Feasible','Heavy','Fragile'] },
  { pregunta:'Which word means "worth a lot" or "important"?', correcta:'Valuable', opts:['Worthless','Fragile','Heavy'] },
  { pregunta:'Which word describes something that takes a lot of time to complete?', correcta:'Time consuming', opts:['Quick','Instant','Immediate'] },
  { pregunta:'Which word describes a danger or a source of possible harm at a workplace?', correcta:'Hazard', opts:['Benefit','Solution','Comfort'] },
  { pregunta:'Which term describes clothing or gear used to prevent injuries at work, such as helmets and gloves?', correcta:'Protective equipment', opts:['Office furniture','Decorative items','Musical instruments'] },
  { pregunta:'Which word describes a piece of news that has just happened, very recent?', correcta:'Current event', opts:['Historical fact','Ancient legend','Fictional story'] },
  { pregunta:'Which word means "able to be capable of doing something", such as a skilled worker?', correcta:'Capable', opts:['Incapable','Fragile','Wireless'] },
  { pregunta:'Which word describes water or a surface with no moisture at all?', correcta:'Dry', opts:['Wet','Deep','Wireless'] },
  { pregunta:'Which word describes something that goes far down, such as a well or a hole?', correcta:'Deep', opts:['Shallow','Light','Dry'] },
  { pregunta:'Which word describes an instruction manual explaining how a machine works?', correcta:'Manual', opts:['Anecdote','Poem','Song'] },
];
export function genVocabularioTecnicoEpjaM2Round(){
  const item = pick(VOCABULARIO_TECNICO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, speakLang:'en', cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_VOCABULARIO_TECNICO_M2,
  };
}

/* ---------------- Comprensión de Lectura ---------------- */
const RECURSO_COMPRENSION_INGLES_M2 = 'Comprender un texto en inglés más avanzado implica: <b>identificar</b> información específica (lo que el texto dice literalmente), <b>inferir e interpretar</b> el sentido global o el propósito del texto (lo que no está dicho de forma directa), deducir el significado de una palabra según el contexto, y <b>reflexionar</b>, usando conocimiento externo al texto para construir un nuevo punto de vista. Practicar con noticias, textos de seguridad laboral y descripciones de instrumentos fortalece estas habilidades con textos más cercanos a la vida real de un adulto.';
const COMPRENSION_INGLES_M2_BANK = [
  { texto:'A new factory opened in the city last month, creating two hundred new jobs for local workers in the manufacturing sector.', pregunta:'What is the main purpose of this text?', correcta:'To inform about new jobs created by a new factory', opts:['To tell a personal story about a factory worker','To give safety instructions for a machine','To describe a recipe for cooking'] },
  { texto:'Always disconnect the power supply before cleaning or repairing this device. Failure to do so may result in electric shock.', pregunta:'What can you infer about the purpose of this warning?', correcta:'To prevent injuries caused by electric shock', opts:['To explain how the device was manufactured','To describe the history of electricity','To advertise a new product'] },
  { texto:'This thermometer measures temperature widely across different environments, from industrial ovens to household refrigerators.', pregunta:'What does "widely" suggest about this thermometer, based on the context?', correcta:'It can be used in many different situations', opts:['It can only be used in one specific place','It is very expensive','It does not work correctly'] },
  { texto:'Carlos worked as an electrician for fifteen years before starting his own small business installing solar panels.', pregunta:'What can you infer about Carlos from this text?', correcta:'He gained experience as an employee before becoming independent', opts:['He never had any work experience','He always owned his own business','He dislikes working with electricity'] },
  { texto:'The government announced new regulations requiring all factories to reduce their water usage by twenty percent within two years.', pregunta:'What is the main purpose of this news text?', correcta:'To inform about new environmental regulations for factories', opts:['To tell a fictional story','To give a cooking recipe','To describe a historical event from long ago'] },
  { texto:'This new device operates wirelessly, connecting to other machines without any physical cables.', pregunta:'Based on the context, what does "wirelessly" mean here?', correcta:'Without using physical cables', opts:['Using very thick cables','Only during the daytime','Requiring constant supervision'] },
  { texto:'Workers must wear protective gloves and safety glasses at all times when operating this equipment, according to the factory’s safety manual.', pregunta:'Why do you think this rule exists in the safety manual?', correcta:'To protect workers from possible injuries while operating the equipment', opts:['To make the work look more professional','To slow down production on purpose','It has no real reason'] },
  { texto:'The report shows that renewable energy production has increased significantly over the past five years in several countries.', pregunta:'What is the main idea of this report?', correcta:'Renewable energy production has grown over time', opts:['Renewable energy production has decreased','Only one country produces renewable energy','Renewable energy is not important globally'] },
  { texto:'Ana has worked at the same hospital for ten years. Every night shift, she double-checks the medication list before giving it to patients.', pregunta:'What can you infer about Ana from this text?', correcta:'She is careful and responsible in her work', opts:['She is careless with patients','She dislikes her job','She never checks anything twice'] },
  { texto:'This brochure explains a new recycling program: separate glass, paper, and plastic before the weekly collection day.', pregunta:'Based on this brochure, why do you think separating materials matters?', correcta:'Because it makes the recycling process more effective', opts:['Because it makes the garbage heavier','Because it is required only once a year','Because it has no real purpose'] },
];
export function genComprensionInglesEpjaM2Round(){
  const item = pick(COMPRENSION_INGLES_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto+' '+item.pregunta, speakLang:'en', cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COMPRENSION_INGLES_M2,
  };
}

import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan de Formación General: Inglés ----------------
   Fuente real: Decreto 614/2013, Plan de Formación General 3°-4° medio, asignatura
   Inglés (curriculumnacional.cl). Los 4 OA de cada año son de comprensión y
   producción de textos orales/escritos breves sobre temas de interés personal, con
   el fin de construir una postura personal crítica — mismo criterio ya usado en
   `content/ingles.js` (5°-8° básico, 1°-2° medio): se cubre el eje de comprensión
   (vocabulario/gramática en contexto + lectura), dejando fuera la comprensión y
   producción ORAL (depende de audio real) y la producción escrita (proceso propio).

   3° medio (OAC-01: comprender información central de textos orales/escritos sobre
   temas de interés; OAC-03: usar el conocimiento del inglés para construir una
   postura crítica) — 2 módulos: Vocabulario y Gramática en Contexto, Comprensión de
   Lectura. 4° medio (mismos OA, un nivel de exigencia mayor: "información relevante
   para un propósito específico" en vez de solo "información central", producir
   textos "claros" en vez de "breves y claros") — 2 módulos con el mismo nombre y
   un banco de contenido más avanzado (voz pasiva, oraciones relativas, tercer
   condicional; lectura de textos con estructura argumentativa más compleja).
   Mismo mecanismo `speakLang:'en'` ya usado desde 5° básico para que `speak()`
   busque una voz en inglés en vez de español; `recurso` se escribe en español
   (explicación pedagógica dirigida al estudiante, no el contenido del ítem). */

export const INGLES_MODULES_M3 = [
  {id:'vocabgramaticapg3', label:'Vocabulario y Gramática en Contexto', open:true, key:'vocabgramaticapg3'},
  {id:'comprensionlecturapg3', label:'Comprensión de Lectura', open:true, key:'comprensionlecturapg3'},
];
export const INGLES_POS_M3 = [ {x:30,y:70},{x:70,y:30} ];

export const INGLES_MODULES_M4 = [
  {id:'vocabavanzadopg4', label:'Vocabulario y Gramática Avanzada', open:true, key:'vocabavanzadopg4'},
  {id:'comprensionlecturaavanzadapg4', label:'Comprensión de Lectura Avanzada', open:true, key:'comprensionlecturaavanzadapg4'},
];
export const INGLES_POS_M4 = [ {x:30,y:70},{x:70,y:30} ];

/* ---------------- Vocabulario y Gramática en Contexto (OAC-01/03) ---------------- */
const RECURSO_GRAMATICA_PG3 = 'A este nivel, el inglés se usa para algo más que nombrar objetos: sirve para expresar opiniones y posturas personales. Estructuras como el segundo condicional ("If I had more time...") permiten hablar de situaciones hipotéticas, los modales como "should" permiten dar una recomendación o postura crítica, y los comparativos permiten contrastar ideas. Fijarse en el contexto completo de la oración —no solo en la palabra que falta— es la mejor estrategia para elegir la forma gramatical correcta.';
const GRAMATICA_CONTEXTO_PG3_BANK = [
  {sent:'If I ___ more free time, I would learn to play the guitar.', correct:'had', opts:['have','has','having']},
  {sent:'She thinks that social media ___ both good and bad for teenagers.', correct:'is', opts:['are','be','being']},
  {sent:'In my opinion, we ___ reduce the amount of plastic we use.', correct:'should', opts:['should to','must to','would to']},
  {sent:'This documentary is ___ interesting than the one we watched last week.', correct:'more', opts:['most','much','more of']},
  {sent:'If we ___ nothing about climate change, future generations will suffer.', correct:'do', opts:['did','done','doing']},
  {sent:'He said that he did not ___ with the new policy.', correct:'agree', opts:['agreed','agreeing','agrees']},
  {sent:'The more we discuss this topic, the ___ we understand different points of view.', correct:'better', opts:['best','good','well']},
  {sent:'Not everyone ___ the same access to technology.', correct:'has', opts:['have','having','are having']},
  {sent:'If she studied abroad, she ___ learn a new perspective.', correct:'would', opts:['will','shall','can']},
  {sent:'I have never ___ such an interesting debate before.', correct:'seen', opts:['saw','seeing','see']},
];
export function genVocabularioGramaticaPG3Round(){
  const item = pick(GRAMATICA_CONTEXTO_PG3_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const filled = item.sent.replace('___', item.correct);
  return {
    promptHTML:'<p class="prompt-sentence">'+item.sent.replace('___','____')+'</p><p class="prompt-hint">Complete the sentence. (Completa la oración.)</p>',
    options:opts, correctValue:item.correct, speakText:filled, speakLang:'en', cols:2, panel:true,
    explain:'La forma correcta es "'+item.correct+'": '+filled,
    recurso:RECURSO_GRAMATICA_PG3,
  };
}

/* ---------------- Comprensión de Lectura (OAC-01) ---------------- */
const RECURSO_LECTURA_PG3 = 'Leer textos en inglés sobre temas de interés personal —redes sociales, videojuegos, moda, voluntariado— requiere identificar la <b>idea central</b> y la <b>postura u opinión</b> que el texto plantea, no solo datos sueltos. Buscar palabras clave relacionadas con la pregunta, fijarse en conectores como "however" o "in my opinion", y no dejarse confundir por una sola palabra desconocida son estrategias que funcionan igual en inglés que en español.';
const LECTURA_PG3_BANK = [
  {text:'Many teenagers spend hours on social media every day. Some experts say this helps them stay connected with friends, while others worry it can affect their sleep and mental health. In my opinion, using social media in moderation is the healthiest choice.', question:'What is the writer\'s opinion?', correct:'Moderation is the healthiest choice', opts:['Social media should be banned completely','Social media has no effects at all','Everyone should use social media all day']},
  {text:'Learning a new language opens doors to different cultures and ways of thinking. It is not always easy, but the effort is usually worth it, because it helps you understand the world from another perspective.', question:'According to the text, why is learning a language worth the effort?', correct:'It helps you understand the world from another perspective', opts:['It guarantees a better job immediately','It makes school easier','It replaces the need to travel']},
  {text:'Some people believe that watching the news makes them more informed citizens. Others think that constant exposure to bad news can be overwhelming. Finding a balance seems to be the best approach for most people.', question:'What does the text suggest is the best approach?', correct:'Finding a balance', opts:['Watching the news all day','Avoiding the news completely','Only watching entertainment news']},
  {text:'Volunteering in your community can be a rewarding experience. It allows young people to develop empathy, learn new skills, and make a real difference, even if they only have a few hours a week to give.', question:'According to the text, what can volunteering develop?', correct:'Empathy', opts:['Only money','Only free time','Only fame']},
  {text:'Video games are often criticized for encouraging violence, but some studies suggest they can also improve problem-solving skills and teamwork, depending on the type of game and how it is played.', question:'What do some studies suggest about video games?', correct:'They can improve problem-solving skills and teamwork', opts:['They only encourage violence','They have no effect on skills','They are always harmful']},
  {text:'Fast fashion offers cheap and trendy clothes, but it also has a large environmental cost, from water use to textile waste. Some young consumers are now choosing to buy fewer, better-quality clothes instead.', question:'What environmental cost does fast fashion have, according to the text?', correct:'Water use and textile waste', opts:['No environmental cost at all','Only air pollution','Only cost to consumers']},
  {text:'Working part-time while studying can teach responsibility and time management, but it can also make it harder to focus on schoolwork if the hours are too long.', question:'What is a possible downside of working part-time while studying, according to the text?', correct:'It can make it harder to focus on schoolwork', opts:['It guarantees better grades','It has no downsides','It replaces the need to study']},
  {text:'Many young people today follow influencers for advice on fashion, health, and lifestyle. Critics argue that not all influencers give accurate information, so it is important to check other sources too.', question:'What do critics argue, according to the text?', correct:'Not all influencers give accurate information', opts:['All influencers are experts','Influencers should be banned','Nobody should follow influencers']},
];
export function genComprensionLecturaPG3Round(){
  const item = pick(LECTURA_PG3_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options:opts, correctValue:item.correct, speakText:item.text, speakLang:'en', cols:2, panel:true,
    explain:'La respuesta correcta es: '+item.correct+'.',
    recurso:RECURSO_LECTURA_PG3,
  };
}

/* ================= 4° medio ================= */

/* ---------------- Vocabulario y Gramática Avanzada (OAC-01/03) ---------------- */
const RECURSO_GRAMATICA_PG4 = 'A este nivel, el inglés incorpora estructuras más complejas: la <b>voz pasiva</b> ("the article was written by...") pone el foco en la acción y no en quién la realiza; las <b>oraciones relativas</b> ("the book that changed my view") agregan información sin crear una oración nueva; y el <b>tercer condicional</b> ("if they had listened...") describe situaciones hipotéticas sobre el pasado que ya no se pueden cambiar. Reconocer estas estructuras en un texto es clave para producir con fluidez textos claros sobre temas de interés personal.';
const GRAMATICA_PG4_BANK = [
  {sent:'The article ___ written by a well-known journalist.', correct:'was', opts:['is being','were','has']},
  {sent:'She told me that she ___ already finished the project.', correct:'had', opts:['has','have','was']},
  {sent:'This is the book ___ changed the way I see the world.', correct:'that', opts:['who','whom','whose']},
  {sent:'If they had listened to the warnings, the accident ___ have happened.', correct:'would not', opts:['will not','does not','did not']},
  {sent:'The decision ___ be made by the committee next week.', correct:'will', opts:['is','was','has']},
  {sent:'The scientist ___ research was published last year works at this university.', correct:'whose', opts:['who','which','that']},
  {sent:'By the time we arrived, the meeting ___ already started.', correct:'had', opts:['has','was','is']},
  {sent:'He asked me if I ___ ever been to another country.', correct:'had', opts:['have','has','did']},
  {sent:'The bridge ___ last year, after two years of construction.', correct:'was built', opts:['built','has build','building']},
  {sent:'This is the same problem ___ we discussed last week.', correct:'that', opts:['who','whose','whom']},
];
export function genVocabularioAvanzadoPG4Round(){
  const item = pick(GRAMATICA_PG4_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const filled = item.sent.replace('___', item.correct);
  return {
    promptHTML:'<p class="prompt-sentence">'+item.sent.replace('___','____')+'</p><p class="prompt-hint">Complete the sentence. (Completa la oración.)</p>',
    options:opts, correctValue:item.correct, speakText:filled, speakLang:'en', cols:2, panel:true,
    explain:'La forma correcta es "'+item.correct+'": '+filled,
    recurso:RECURSO_GRAMATICA_PG4,
  };
}

/* ---------------- Comprensión de Lectura Avanzada (OAC-01) ---------------- */
const RECURSO_LECTURA_PG4 = 'Los textos de este nivel suelen presentar un <b>debate</b>: una postura y sus argumentos, seguida de una postura contraria y sus propios argumentos. Comprenderlos bien requiere identificar no solo el tema, sino también qué preocupación o argumento específico defiende cada lado —por ejemplo, distinguir el beneficio que destacan quienes apoyan una medida, del riesgo que señalan quienes la cuestionan. Esta habilidad de lectura crítica en inglés es la misma que ya se practica en español, aplicada a un idioma distinto.';
const LECTURA_PG4_BANK = [
  {text:'Universal basic income is a policy proposal where every citizen receives a fixed amount of money regularly, regardless of employment status. Supporters argue it could reduce poverty, while critics worry about its cost and effect on the motivation to work.', question:'What is one concern critics have about universal basic income, according to the text?', correct:'Its cost and effect on the motivation to work', opts:['It guarantees full employment','It has no supporters','It eliminates poverty completely']},
  {text:'Remote work became widespread after the pandemic, and many companies now offer flexible arrangements. While employees often report better work-life balance, some managers worry about maintaining team collaboration and company culture from a distance.', question:'What do some managers worry about, according to the text?', correct:'Maintaining team collaboration and company culture', opts:['Employee salaries','Office rent costs','Internet speed']},
  {text:'Artificial intelligence is increasingly used to screen job applications. Proponents say it removes human bias, but researchers have found that these systems can also inherit biases from the data they were trained on.', question:'What have researchers found about AI in hiring, according to the text?', correct:'It can inherit biases from its training data', opts:['It always removes all bias','It has never been studied','It replaces human recruiters completely']},
  {text:'Space exploration is expensive, and some argue that the money would be better spent solving problems on Earth. Others believe that the scientific discoveries and technologies developed for space missions eventually benefit everyday life.', question:'What do supporters of space exploration argue, according to the text?', correct:'Discoveries and technologies eventually benefit everyday life', opts:['Space exploration has no benefits','It should be stopped completely','It solves all problems on Earth']},
  {text:'Some cities have started charging a fee for cars entering the downtown area, hoping to reduce traffic and pollution. Early results in several cities show fewer cars on the road, but some small business owners worry about fewer customers.', question:'What worry do some small business owners have, according to the text?', correct:'Fewer customers', opts:['Higher fuel prices','More traffic','Better air quality']},
  {text:'Standardized testing is often used to measure student achievement, but critics argue it does not capture creativity or critical thinking. Supporters claim it provides an objective way to compare students across different schools.', question:'What do supporters of standardized testing claim, according to the text?', correct:'It provides an objective way to compare students', opts:['It measures creativity perfectly','It should be eliminated','It has no critics']},
  {text:'Genetically modified crops can produce higher yields and resist pests better than traditional crops. However, some consumers remain concerned about their long-term effects on health and biodiversity.', question:'What are some consumers concerned about, according to the text?', correct:'Long-term effects on health and biodiversity', opts:['Lower crop yields','Higher food prices only','Reduced pest resistance']},
  {text:'Social media algorithms are designed to keep users engaged for as long as possible, often by showing content that triggers strong emotional reactions. Some researchers link this design to increased polarization in public debates.', question:'What do some researchers link algorithm design to, according to the text?', correct:'Increased polarization in public debates', opts:['Better quality journalism','Reduced screen time','More balanced opinions']},
];
export function genComprensionLecturaAvanzadaPG4Round(){
  const item = pick(LECTURA_PG4_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options:opts, correctValue:item.correct, speakText:item.text, speakLang:'en', cols:2, panel:true,
    explain:'La respuesta correcta es: '+item.correct+'.',
    recurso:RECURSO_LECTURA_PG4,
  };
}

import { pick, shuffle } from '../utils.js';

/* ---------------- Contenido Inglés 5° Básico ----------------
   Primera asignatura de Inglés en la app — según el currículum vigente
   (Decreto 439/2012), Inglés como Idioma Extranjero recién comienza en
   5° básico (confirmado en curriculumnacional.cl/curriculum/1o-6o-basico/
   ingles/5-basico antes de construir este archivo, siguiendo la regla de
   oro del proyecto de no asumir sin verificar). Los OA de Inglés están
   organizados en 4 ejes: Comprensión Auditiva (OA01-04), Comprensión de
   Lectura (OA05-09), Expresión Oral (OA10-13) y Expresión Escrita
   (OA14-16).
   Vocabulario Básico -> OA05,13 (demostrar comprensión de textos con
   palabras de uso frecuente; demostrar conocimiento de vocabulario temático
   — aquí como reconocimiento visual: ver una imagen y elegir la palabra en
   inglés que la nombra). Lectura Simple -> OA06-09 (leer un texto breve no
   literario o literario simple, extraer información explícita, identificar
   secuencia de eventos, usando textos cortos y directos apropiados para un
   primer año de inglés).
   Quedan fuera: OA01-04 (comprensión auditiva — depende de audio real en
   inglés, no de texto), OA10-12 (expresión oral: monólogos, diálogos,
   presentaciones — desempeño real) y OA14-16 (expresión escrita: completar
   y escribir textos siguiendo el proceso de escritura — producción propia).
   Nota técnica: `speak()` (js/audio.js) ahora acepta un segundo parámetro
   `lang` — hasta este módulo, toda la app leía su texto en voz con una voz
   en español (`pickBestVoice()` buscaba solo voces "es-*"). Leer inglés con
   esa voz sonaría con pronunciación incorrecta, así que ambos generadores
   de este archivo pasan `speakLang:'en'` en su ronda para que `speak()`
   busque una voz en inglés en su lugar. */
export const INGLES_MODULES_G5 = [
  {id:'vocabularioingles5', label:'Vocabulario Básico', open:true, key:'vocabularioingles5'},
  {id:'lecturasimple5', label:'Lectura Simple', open:true, key:'lecturasimple5'},
  {id:'exameningles5', label:'Examen Final', open:true, key:'exameningles5'},
];
export const INGLES_POS_G5 = [{x:24,y:85},{x:70,y:50},{x:24,y:15}];

const VOCABULARIO_INGLES_BANK = [
  { emoji:'🐶', english:'Dog' }, { emoji:'🐱', english:'Cat' }, { emoji:'🐦', english:'Bird' },
  { emoji:'🐟', english:'Fish' }, { emoji:'🐴', english:'Horse' }, { emoji:'🐮', english:'Cow' },
  { emoji:'🔴', english:'Red' }, { emoji:'🔵', english:'Blue' }, { emoji:'🟢', english:'Green' }, { emoji:'🟡', english:'Yellow' },
  { emoji:'👨', english:'Father' }, { emoji:'👩', english:'Mother' }, { emoji:'👶', english:'Baby' },
  { emoji:'📚', english:'Book' }, { emoji:'✏️', english:'Pencil' }, { emoji:'🎒', english:'Backpack' }, { emoji:'📏', english:'Ruler' },
  { emoji:'🍎', english:'Apple' }, { emoji:'🍌', english:'Banana' }, { emoji:'🍞', english:'Bread' }, { emoji:'🥛', english:'Milk' },
];
export function genVocabularioIngles5Round(nivel){
  const recurso = 'Aprender vocabulario nuevo en inglés es más fácil cuando se asocia directamente una <b>imagen o concepto</b> con la palabra en inglés, sin pasar por la traducción al español cada vez — así como un bebé aprende su primer idioma reconociendo objetos, no memorizando definiciones. Practicar categorías completas (animales, colores, la familia, útiles escolares, comida) ayuda a construir un vocabulario base sólido, que después sirve para formar oraciones simples y leer textos más largos en inglés.';
  const item = pick(VOCABULARIO_INGLES_BANK);
  const distractCount = nivel==='facil' ? 1 : 3;
  const distract = shuffle(VOCABULARIO_INGLES_BANK.filter(function(v){ return v.english!==item.english; })).slice(0,distractCount).map(function(v){ return v.english; });
  const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
  const visual = nivel==='dificil' ? '<p class="prompt-hint">Escucha 🔊 y elige la palabra en inglés correcta.</p>' : '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">How do you say this in English? (¿Cómo se dice esto en inglés?)</p>';
  return {
    promptHTML: visual,
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.', recurso: recurso,
  };
}

const LECTURA_SIMPLE_BANK = [
  { text:'I have a dog. My dog is brown and small.', question:'What color is the dog?', correct:'Brown', opts:['Black','White','Yellow'] },
  { text:'Anna has a red bike. She rides her bike to school every day.', question:'What color is the bike?', correct:'Red', opts:['Blue','Green','Yellow'] },
  { text:'Tom likes apples. He eats an apple every morning for breakfast.', question:'What does Tom eat every morning?', correct:'An apple', opts:['A banana','Bread','Milk'] },
  { text:'The cat is on the table. The dog is under the table.', question:'Where is the dog?', correct:'Under the table', opts:['On the table','In a box','On a chair'] },
  { text:'This family has three pets: a dog, a cat, and a bird.', question:'How many pets does the family have?', correct:'Three', opts:['Two','Four','Five'] },
  { text:'Sara wakes up. Then she brushes her teeth. Then she eats breakfast.', question:'What does Sara do first?', correct:'She wakes up', opts:['She eats breakfast','She brushes her teeth','She goes to school'] },
  { text:'It is raining today, so Ben wears his yellow raincoat.', question:'What is the weather like today?', correct:'Raining', opts:['Sunny','Snowing','Windy'] },
  { text:'The library is a quiet place. People go there to read books.', question:'What do people do in the library?', correct:'They read books', opts:['They play soccer','They swim','They cook'] },
  { text:'Leo has two brothers and one sister.', question:'How many sisters does Leo have?', correct:'One', opts:['Two','Three','Zero'] },
  { text:'The sun is bright today, and the sky is blue.', question:'What color is the sky today?', correct:'Blue', opts:['Gray','Black','Green'] },
];
export function genLecturaSimple5Round(nivel){
  const recurso = 'Leer en inglés a este nivel no requiere entender cada palabra: se trata de identificar la <b>información explícita</b> que el texto dice directamente (un color, una cantidad, un lugar, el orden de las acciones), apoyándose en las palabras que sí se conocen y en el contexto general de la oración. Buscar palabras clave relacionadas con la pregunta dentro del texto —igual que se haría al leer en español— es la misma estrategia de comprensión lectora, solo que aplicada a otro idioma.';
  const item = pick(LECTURA_SIMPLE_BANK);
  const optsPool = nivel==='facil' ? item.opts.slice(0,1) : item.opts;
  const opts = shuffle([item.correct].concat(optsPool)).map(function(o){ return {label:o, value:o}; });
  const textoHTML = nivel==='dificil' ? '<p class="prompt-hint">Listen 🔊 and answer. (Escucha y responde)</p>' : '<p class="prompt-sentence">'+item.text+'</p>';
  return {
    promptHTML: textoHTML+'<p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.', recurso: recurso,
  };
}

export function genExamenIngles5Round(){
  const gens = [genVocabularioIngles5Round, genLecturaSimple5Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* ---------------- Contenido Inglés 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/ingles/6-basico) — misma estructura de 4 ejes que 5° básico.
   Vocabulario Intermedio -> OA05,13 (categorías nuevas respecto a 5° básico,
   que cubrió animales/colores/familia/útiles escolares/comida: clima con
   emoji, verbos de acción con emoji, y días de la semana como traducción
   español-inglés, ya que no tienen una representación visual distintiva).
   Lectura Simple II -> OA06-09 (OA06 nombra explícitamente nuevos formatos de
   texto: notas, postales, invitaciones, tarjetas de saludo, menús; OA07
   nombra rimas/poemas/tiras cómicas/cuentos — se usa un formato de texto
   distinto por ítem del banco, en vez de repetir siempre oraciones sueltas
   como en 5° básico).
   Quedan fuera: OA01-04 (comprensión auditiva — depende de audio real),
   OA10-13 (expresión oral — desempeño real) y OA14-16 (expresión escrita —
   producción propia). Nota: se evitan apóstrofes en los textos en inglés
   (contracciones, posesivos) porque `speakText` se inserta en un atributo
   `onclick` con comillas simples en mcEngine.js — un apóstrofe sin escapar
   rompería ese HTML. */
export const INGLES_MODULES_G6 = [
  {id:'vocabularioingles6', label:'Vocabulario Intermedio', open:true, key:'vocabularioingles6'},
  {id:'lecturasimple6', label:'Lectura Simple II', open:true, key:'lecturasimple6'},
];
export const INGLES_POS_G6 = [{x:30,y:70},{x:70,y:30}];

const CLIMA_VERBOS_BANK = [
  { emoji:'☀️', english:'Sunny' }, { emoji:'🌧️', english:'Rainy' }, { emoji:'❄️', english:'Snowy' },
  { emoji:'💨', english:'Windy' }, { emoji:'☁️', english:'Cloudy' },
  { emoji:'🏃', english:'Run' }, { emoji:'🏊', english:'Swim' }, { emoji:'✍️', english:'Write' },
  { emoji:'😴', english:'Sleep' }, { emoji:'⛹️', english:'Play' },
];
const DIAS_SEMANA_BANK = [
  { spanish:'Lunes', english:'Monday' }, { spanish:'Martes', english:'Tuesday' }, { spanish:'Miércoles', english:'Wednesday' },
  { spanish:'Jueves', english:'Thursday' }, { spanish:'Viernes', english:'Friday' }, { spanish:'Sábado', english:'Saturday' }, { spanish:'Domingo', english:'Sunday' },
];
export function genVocabularioIngles6Round(){
  const recurso = 'En inglés, el clima se describe con adjetivos como "sunny" (soleado), "rainy" (lluvioso) o "windy" (con viento), y las acciones cotidianas con verbos como "run" (correr) o "sleep" (dormir). Los días de la semana en inglés ("Monday", "Tuesday"...) se aprenden mejor como traducción directa palabra por palabra, ya que —a diferencia del clima o las acciones— no tienen una imagen que los represente por sí solos. Practicar este vocabulario básico ayuda a construir las primeras oraciones simples en un segundo idioma.';
  if(Math.random()<0.6){
    const item = pick(CLIMA_VERBOS_BANK);
    const distract = shuffle(CLIMA_VERBOS_BANK.filter(function(v){ return v.english!==item.english; })).slice(0,3).map(function(v){ return v.english; });
    const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">How do you say this in English? (¿Cómo se dice esto en inglés?)</p>',
      options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
      explain: 'Se dice <b>'+item.english+'</b> en inglés.', recurso: recurso,
    };
  }
  const item = pick(DIAS_SEMANA_BANK);
  const distract = shuffle(DIAS_SEMANA_BANK.filter(function(d){ return d.english!==item.english; })).slice(0,3).map(function(d){ return d.english; });
  const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this day in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: '"'+item.spanish+'" se dice <b>'+item.english+'</b> en inglés.', recurso: recurso,
  };
}

const LECTURA_SIMPLE2_BANK = [
  { text:'Dear Sofia, Thank you for the birthday gift. I love the book. See you soon. Love, Mia.', question:'What did Mia receive as a gift?', correct:'A book', opts:['A toy','A bike','A game'] },
  { text:'You are invited to a birthday party! Saturday, 3:00 PM, at the park.', question:'What day is the party?', correct:'Saturday', opts:['Monday','Friday','Sunday'] },
  { text:'Postcard from the beach: The weather is sunny and the water is warm. I am eating ice cream every day.', question:'What is the weather like at the beach?', correct:'Sunny', opts:['Rainy','Snowy','Cold'] },
  { text:'Menu: Soup 3 dollars, Sandwich 5 dollars, Salad 4 dollars, Juice 2 dollars.', question:'How much does a sandwich cost?', correct:'5 Dollars', opts:['3 Dollars','4 Dollars','2 Dollars'] },
  { text:'A short poem: The cat sat on the mat, and then it took a nap.', question:'Where did the cat sit?', correct:'On the mat', opts:['On the bed','On the chair','On the floor'] },
  { text:'Comic strip: A boy drops his ice cream. He looks sad. Then his dog licks his hand and he smiles.', question:'Why does the boy smile at the end?', correct:'Because his dog comforts him', opts:['Because he got new ice cream','Because it started raining','Because he went home'] },
  { text:'A short story: Once there was a small mouse who lived in a big house. Every night, the mouse looked for cheese.', question:'What did the mouse look for every night?', correct:'Cheese', opts:['Bread','Milk','Fruit'] },
  { text:'Note on the fridge: Please buy milk and eggs. Thank you. Mom.', question:'What does Mom ask to buy?', correct:'Milk and eggs', opts:['Bread and butter','Apples and bananas','Rice and beans'] },
  { text:'Greeting card: Happy birthday. I hope you have a wonderful day. With love, Grandma.', question:'Who wrote the card?', correct:'Grandma', opts:['Mom','A friend','The teacher'] },
  { text:'A short poem: Twinkle, twinkle, little star, how I wonder what you are.', question:'What does the poem talk about?', correct:'A star', opts:['The moon','The sun','A cloud'] },
];
export function genLecturaSimple6Round(){
  const recurso = 'Leer un texto breve en inglés (una nota, una postal, un menú o un poema corto) no requiere entender cada palabra: basta con identificar la información clave que responde la pregunta —quién escribe, qué pide, cuándo ocurre algo—, apoyándose en palabras conocidas y en el contexto general del texto. Esta misma estrategia de "leer para encontrar el dato" funciona igual en español y en inglés.';
  const item = pick(LECTURA_SIMPLE2_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Inglés 7° Básico ----------------
   Basado en OA del Decreto 614/2013, "Bases Curriculares 7° básico a 2°
   medio" (curriculumnacional.cl/curriculum/7o-basico-2o-medio/ingles/
   7-basico), verificado antes de construir este archivo. Los OA de este
   currículum están organizados en 3 ejes: Comunicación Oral (IN07 OA01-08),
   Comprensión de Lectura (IN07 OA09-12), Expresión Escrita (IN07 OA13-16).
   Vocabulario Avanzado -> IN07 OA08,16 (demostrar conocimiento de
   funciones del lenguaje: expresar cantidades, describir, sugerir,
   expresar obligación y necesidad — aquí como reconocimiento de
   vocabulario/expresiones, no como producción oral o escrita).
   Lectura Intermedia -> IN07 OA09-11 (comprensión de ideas generales e
   información explícita en textos no literarios y literarios, incluyendo
   identificar tema, personajes, entorno y trama).
   Quedan fuera: OA01-07 (comprensión y producción oral — dependen de
   audio real), OA12 (estrategias de lectura como proceso propio) y
   OA13-15 (expresión escrita — producción propia). Se evitan apóstrofes
   en los textos en inglés, mismo criterio técnico que 6° básico (ver
   comentario de esa sección). */
export const INGLES_MODULES_G7 = [
  {id:'vocabularioavanzado7', label:'Vocabulario Avanzado', open:true, key:'vocabularioavanzado7'},
  {id:'lecturaintermedia7', label:'Lectura Intermedia', open:true, key:'lecturaintermedia7'},
];
export const INGLES_POS_G7 = [{x:30,y:70},{x:70,y:30}];

const OBLIGACION_SUGERENCIA_BANK = [
  { spanish:'Debes hacer esto (obligación).', english:'You must do this', opts:['You can do this','You might do this','You like this'] },
  { spanish:'Deberías intentar esto (sugerencia).', english:'You should try this', opts:['You must try this','You never try this','You hate this'] },
  { spanish:'Necesito ayuda (necesidad).', english:'I need help', opts:['I want help','I have help','I give help'] },
  { spanish:'No se permite hacer esto (prohibición).', english:'You must not do this', opts:['You should do this','You can do this','You always do this'] },
  { spanish:'¿Y si vamos al parque? (sugerencia).', english:'How about going to the park', opts:['We never go to the park','You must go to the park','I hate the park'] },
  { spanish:'Es obligatorio usar casco (obligación).', english:'You must wear a helmet', opts:['You might wear a helmet','You dislike a helmet','You see a helmet'] },
];
const CANTIDADES_DESCRIPCIONES_BANK = [
  { spanish:'Hay muchos libros en la mesa.', english:'There are many books on the table', opts:['There is one book on the table','There are no books on the table','The table has no books'] },
  { spanish:'Hay poca agua en el vaso.', english:'There is little water in the glass', opts:['There is a lot of water in the glass','The glass is completely full','The glass has no water'] },
  { spanish:'Esta caja es más pesada que esa.', english:'This box is heavier than that one', opts:['This box is lighter than that one','Both boxes weigh the same','This box has no weight'] },
  { spanish:'Ella es la persona más alta del grupo.', english:'She is the tallest person in the group', opts:['She is the shortest person in the group','Everyone is the same height','She is not part of the group'] },
];
export function genVocabularioAvanzado7Round(){
  const recurso = 'En inglés, palabras como <b>must/have to</b> expresan obligación, <b>should</b> expresa sugerencia, y <b>need to</b> expresa necesidad — cada una indica un grado distinto de importancia sobre una acción. También se pueden describir <b>cantidades</b> (many, little, a lot of) y hacer <b>comparaciones</b> (heavier than, the tallest) para comparar dos o más cosas. Practicar estas estructuras ayuda a expresar ideas más precisas en inglés, más allá de vocabulario simple.';
  const item = pick(Math.random()<0.5 ? OBLIGACION_SUGERENCIA_BANK : CANTIDADES_DESCRIPCIONES_BANK);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, panel:true,
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const LECTURA_INTERMEDIA_BANK = [
  { text:'Recycling helps the environment. It reduces waste and saves natural resources like trees and water.', question:'What does recycling help reduce?', correct:'Waste', opts:['Money','Time','Friends'] },
  { text:'Marco plays soccer every weekend with his friends at the local park near his house.', question:'What sport does Marco play?', correct:'Soccer', opts:['Basketball','Tennis','Swimming'] },
  { text:'Once upon a time, a young girl named Elena found a hidden map in an old chest that belonged to her grandmother. She decided to follow it.', question:'What did Elena find?', correct:'A hidden map', opts:['A letter','A photograph','A key'] },
  { text:'In the story, the main character is a brave fox who lives in a big forest with many other animals.', question:'Where does the main character live?', correct:'In a forest', opts:['In a city','In a desert','In a cave'] },
  { text:'The school announced a science fair next month. Students will present projects about renewable energy.', question:'What is the topic of the projects?', correct:'Renewable energy', opts:['Ancient history','Sports','Music'] },
  { text:'After the rain stopped, a beautiful rainbow appeared over the mountains, and everyone came outside to see it.', question:'What appeared after the rain?', correct:'A rainbow', opts:['A storm','Snow','A fire'] },
  { text:'The novel follows two brothers who travel across the country to find their missing father.', question:'What are the two brothers looking for?', correct:'Their missing father', opts:['A lost treasure','A new home','A famous city'] },
  { text:'Healthy eating includes fruits, vegetables, and drinking enough water every day.', question:'According to the text, what should you drink enough of every day?', correct:'Water', opts:['Soda','Coffee','Juice only'] },
  { text:'The museum has a new exhibit about ancient Egypt, with real artifacts from over three thousand years ago.', question:'What is the new exhibit about?', correct:'Ancient Egypt', opts:['Modern art','Space travel','Ocean life'] },
  { text:'Every summer, the town holds a music festival where local bands perform in the main square.', question:'Where do the bands perform?', correct:'In the main square', opts:['At the beach','In a stadium','At school'] },
  { text:'In this story, a clever crow drops stones into a jar of water to make the water level rise so it can drink.', question:'Why does the crow drop stones into the jar?', correct:'To make the water level rise', opts:['To build a nest','To play a game','To hide the stones'] },
];
export function genLecturaIntermedia7Round(){
  const recurso = 'Al leer un texto breve en inglés, ayuda buscar la información específica que responde la pregunta (quién, qué, dónde, por qué) en vez de tratar de traducir cada palabra. Fijarse en palabras clave del texto y de la pregunta permite ubicar la respuesta correcta más rápido, incluso si no se conocen todas las palabras del texto.';
  const item = pick(LECTURA_INTERMEDIA_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Inglés 8° Básico ----------------
   Basado en OA del Decreto 614/2013 (curriculumnacional.cl/curriculum/
   7o-basico-2o-medio/ingles/8-basico), misma estructura de 3 ejes que 7°.
   Funciones del Idioma VIII -> IN08 OA08,16 (las funciones que el OA de 8°
   agrega respecto a 7°: comparaciones, intenciones futuras con going to /
   will, indicaciones de dirección, y oraciones condicionales simples).
   Lectura Avanzada -> IN08 OA09-11 (comprensión de textos no literarios y
   literarios identificando secuencia y relaciones causa-efecto — el ángulo
   nuevo del OA10 de 8° respecto al de 7°). Quedan fuera: OA01-07
   (comprensión y producción oral — dependen de audio real), OA12
   (estrategias de lectura como proceso propio), OA13-15 (expresión
   escrita — producción propia). Se evitan apóstrofes en los textos en
   inglés (restricción de speakText, ver 6° básico). */
export const INGLES_MODULES_G8 = [
  {id:'funcionesidioma8', label:'Funciones del Idioma VIII', open:true, key:'funcionesidioma8'},
  {id:'lecturaavanzada8', label:'Lectura Avanzada', open:true, key:'lecturaavanzada8'},
];
export const INGLES_POS_G8 = [{x:30,y:70},{x:70,y:30}];

const FUNCIONES_8_BANK = [
  { spanish:'Mi mochila es más pesada que la tuya (comparación).', english:'My backpack is heavier than yours', opts:['My backpack is the lightest','My backpack is new','Your backpack is heavier than mine'] },
  { spanish:'Este es el día más frío del año (superlativo).', english:'This is the coldest day of the year', opts:['This day is colder than tomorrow','This is a warm day','Every day is cold'] },
  { spanish:'Voy a viajar al sur este verano (intención futura).', english:'I am going to travel south this summer', opts:['I traveled south last summer','I never travel south','I am traveling south right now'] },
  { spanish:'Mañana lloverá en la ciudad (predicción futura).', english:'It will rain in the city tomorrow', opts:['It rained in the city yesterday','It is raining now','It never rains in the city'] },
  { spanish:'Dobla a la derecha en la esquina (indicación de dirección).', english:'Turn right at the corner', opts:['Turn left at the park','Go straight forever','Stop at the corner'] },
  { spanish:'La biblioteca está entre el banco y la plaza (ubicación).', english:'The library is between the bank and the square', opts:['The library is behind the mountain','The library is inside the bank','The library is far from everything'] },
  { spanish:'Si estudias, aprenderás más rápido (condicional).', english:'If you study, you will learn faster', opts:['If you sleep, you will learn faster','You never study','Studying is not useful'] },
  { spanish:'Si llueve, nos quedaremos en casa (condicional).', english:'If it rains, we will stay home', opts:['If it rains, we will go to the beach','It never rains at home','We always stay home'] },
  { spanish:'El tren es más rápido que el bus (comparación).', english:'The train is faster than the bus', opts:['The bus is faster than the train','The train is the slowest','Both are equally slow'] },
  { spanish:'Ella es la mejor jugadora del equipo (superlativo).', english:'She is the best player on the team', opts:['She is a new player on the team','She is the worst player','She does not play'] },
];
export function genFuncionesIdioma8Round(){
  const recurso = 'En inglés, ciertas estructuras gramaticales cumplen "funciones" comunicativas específicas. Para hablar de <b>planes o predicciones futuras</b>, se usa "will" (it will rain) o "going to" (I am going to study). Para dar <b>indicaciones de dirección</b>, se usan verbos como "turn" (doblar) o "go straight" (seguir derecho), junto a preposiciones de lugar como "between" (entre) o "behind" (detrás). Los <b>condicionales simples</b> (con "if") describen una consecuencia que depende de una condición: "If you study, you will learn faster" (si estudias, aprenderás más rápido). Las <b>comparaciones</b> usan "-er than" (faster than = más rápido que) para comparar dos cosas, y el <b>superlativo</b> usa "the -est" (the best = el/la mejor) para señalar el máximo dentro de un grupo.';
  const item = pick(FUNCIONES_8_BANK);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, panel:true,
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const LECTURA_AVANZADA_8_BANK = [
  { text:'Because the bus drivers were on strike, many students arrived late to school on Monday.', question:'Why did many students arrive late?', correct:'Because the bus drivers were on strike', opts:['Because the school was closed','Because it was snowing','Because they woke up early'] },
  { text:'First, mix the flour and eggs. Then, add the milk slowly. Finally, cook the mixture in a hot pan.', question:'What should you do right after mixing the flour and eggs?', correct:'Add the milk slowly', opts:['Cook the mixture','Eat the flour','Wash the pan'] },
  { text:'The town built a new bridge over the river. As a result, people now save thirty minutes on their way to work.', question:'What was the result of building the bridge?', correct:'People now save thirty minutes', opts:['The river became wider','People stopped working','The town lost its roads'] },
  { text:'Maria forgot her umbrella at home. Consequently, she got completely wet on her walk to the station.', question:'Why did Maria get wet?', correct:'Because she forgot her umbrella', opts:['Because she swam in the river','Because the station was flooded','Because she took a shower'] },
  { text:'The story follows a young inventor who builds a robot to help her grandmother with the garden. At the end, the whole neighborhood asks for robots too.', question:'Why did the inventor build the robot?', correct:'To help her grandmother with the garden', opts:['To sell it to the neighbors','To win a science prize','To clean her room'] },
  { text:'Plastic takes hundreds of years to break down. For this reason, many cities now encourage reusable bags.', question:'Why do many cities encourage reusable bags?', correct:'Because plastic takes hundreds of years to break down', opts:['Because reusable bags are expensive','Because plastic disappears quickly','Because cities dislike shopping'] },
  { text:'After the final exam, the students organized a small celebration in the park. They played games, shared food, and thanked their teachers.', question:'When did the students organize the celebration?', correct:'After the final exam', opts:['Before the first class','During the exam','A year earlier'] },
  { text:'The new sports center opened in March. Since then, more young people in the neighborhood practice sports every week.', question:'What happened after the sports center opened?', correct:'More young people practice sports every week', opts:['The neighborhood closed its parks','Fewer people play sports','The center moved to another city'] },
  { text:'In the novel, the main character moves to a small village by the sea. At first she feels lonely, but after joining the local choir she makes many friends.', question:'How did the character make friends?', correct:'By joining the local choir', opts:['By staying at home','By moving back to the city','By buying a boat'] },
  { text:'The library extended its hours because many students requested more time to study in the evenings.', question:'What caused the library to extend its hours?', correct:'Students requested more time to study', opts:['The library had too many books','The evenings became longer','A new library opened next door'] },
];
export function genLecturaAvanzada8Round(){
  const recurso = 'Para comprender bien un texto en inglés, es útil identificar dos tipos de relaciones dentro del relato: la <b>secuencia</b> (el orden en que ocurren los hechos: first, then, finally — primero, luego, finalmente) y la <b>causa-efecto</b> (por qué ocurrió algo y qué consecuencia tuvo). Palabras clave como "because" (porque), "as a result" (como resultado), "consequently" (por consiguiente) y "for this reason" (por esta razón) señalan que lo que sigue es la causa o el efecto de algo mencionado antes. Reconocer estas palabras conectoras ayuda a entender la lógica interna de un texto, incluso cuando aparecen palabras nuevas — no hace falta entender cada palabra para comprender la relación general entre las ideas.';
  const item = pick(LECTURA_AVANZADA_8_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Inglés 1° Medio ----------------
   Basado en OA del Decreto 614/2013 (curriculumnacional.cl/curriculum/
   7o-basico-2o-medio/ingles/1-medio) — 3 ejes: Comunicación Oral (IN1M
   OA01-08), Comprensión de Lectura (IN1M OA09-12), Expresión Escrita
   (IN1M OA13-16).
   Gramática en Contexto -> IN1M OA08 (funciones comunicativas nuevas
   respecto a 7°-8°: hábitos pasados con "used to", adverbios de
   frecuencia, predicciones simples con "will"). Vocabulario en Contexto
   -> IN1M OA08 (vocabulario temático nuevo: adjetivos de personalidad).
   Comprensión de Lectura -> IN1M OA09-11 (ideas generales, información
   explícita, textos literarios y no literarios).
   Quedan fuera: OA01-07 (comprensión y producción oral — dependen de
   audio real), OA12 (estrategias de lectura como proceso propio) y
   OA13-16 (expresión escrita — producción propia). Se evitan apóstrofes
   en los textos en inglés, mismo criterio técnico que años anteriores. */
export const INGLES_MODULES_M1 = [
  {id:'gramaticacontextom1', label:'Gramática en Contexto', open:true, key:'gramaticacontextom1'},
  {id:'vocabulariocontextom1', label:'Vocabulario en Contexto', open:true, key:'vocabulariocontextom1'},
  {id:'comprensionlecturam1', label:'Comprensión de Lectura', open:true, key:'comprensionlecturam1'},
];
export const INGLES_POS_M1 = [{x:24,y:78},{x:70,y:50},{x:24,y:22}];

const HABITOS_PASADOS_BANK = [
  { spanish:'Antes yo jugaba fútbol todos los días (hábito pasado que ya no ocurre).', english:'I used to play soccer every day', opts:['I play soccer every day','I will play soccer every day','I am playing soccer now'] },
  { spanish:'Ella solía vivir en el campo (hábito pasado que ya no ocurre).', english:'She used to live in the countryside', opts:['She lives in the countryside now','She will live in the countryside','She is living in the countryside'] },
  { spanish:'Ellos solían caminar a la escuela juntos (hábito pasado que ya no ocurre).', english:'They used to walk to school together', opts:['They walk to school together now','They will walk to school together','They are walking to school'] },
  { spanish:'Mi abuelo solía trabajar en el campo (hábito pasado que ya no ocurre).', english:'My grandfather used to work in the countryside', opts:['My grandfather works in the countryside now','My grandfather will work in the countryside','My grandfather is working right now'] },
];
const FRECUENCIA_BANK = [
  { spanish:'Siempre desayuno antes de salir (frecuencia: 100%).', english:'I always have breakfast before leaving', opts:['I never have breakfast before leaving','I sometimes have breakfast before leaving','I rarely have breakfast before leaving'] },
  { spanish:'Nunca llego tarde a clases (frecuencia: 0%).', english:'I never arrive late to class', opts:['I always arrive late to class','I usually arrive late to class','I sometimes arrive late to class'] },
  { spanish:'A veces estudio en la biblioteca (frecuencia: ocasional).', english:'I sometimes study in the library', opts:['I always study in the library','I never study in the library','I usually study at the beach'] },
  { spanish:'Normalmente ella camina al colegio (frecuencia: habitual).', english:'She usually walks to school', opts:['She never walks to school','She will walk to school once','She walked to school yesterday only'] },
];
const PREDICCIONES_BANK = [
  { spanish:'Mañana probablemente hará frío (predicción simple).', english:'It will probably be cold tomorrow', opts:['It was cold yesterday','It is cold right now','It never gets cold'] },
  { spanish:'Creo que ella ganará la competencia (predicción simple).', english:'I think she will win the competition', opts:['I think she won the competition','I think she is winning right now','I think she never competes'] },
  { spanish:'El próximo año viajaremos a otro país (predicción simple).', english:'Next year we will travel to another country', opts:['Last year we traveled to another country','We are traveling right now','We never travel anywhere'] },
  { spanish:'Creo que mañana lloverá mucho (predicción simple).', english:'I think it will rain a lot tomorrow', opts:['I think it rained a lot yesterday','I think it is raining right now','I think it never rains here'] },
];
export function genGramaticaContextoM1Round(){
  const recurso = 'En inglés, <b>"used to" + verbo</b> se usa para describir un hábito o una situación del pasado que ya no ocurre en el presente ("I used to play soccer" = antes jugaba fútbol, pero ya no). Los <b>adverbios de frecuencia</b> (always, usually, sometimes, rarely, never) indican qué tan seguido ocurre algo, y suelen ir antes del verbo principal. Para hacer <b>predicciones simples</b> sobre el futuro, se usa "will" ("it will be cold tomorrow" = probablemente hará frío mañana), especialmente cuando se trata de una opinión o expectativa, no de un plan ya decidido. Estas tres estructuras permiten hablar con más precisión sobre el pasado, la frecuencia de una acción y el futuro.';
  const bank = pick([HABITOS_PASADOS_BANK, FRECUENCIA_BANK, PREDICCIONES_BANK]);
  const item = pick(bank);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, panel:true,
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const PERSONALIDAD_BANK = [
  { spanish:'Una persona que siempre dice la verdad', english:'Honest', opts:['Lazy','Shy','Rude'] },
  { spanish:'Una persona que trabaja mucho y con esfuerzo', english:'Hardworking', opts:['Lazy','Shy','Curious'] },
  { spanish:'Una persona que se pone nerviosa al hablar con desconocidos', english:'Shy', opts:['Friendly','Honest','Confident'] },
  { spanish:'Una persona que trata bien y con simpatía a los demás', english:'Friendly', opts:['Rude','Shy','Lazy'] },
  { spanish:'Una persona que quiere aprender y descubrir cosas nuevas', english:'Curious', opts:['Lazy','Rude','Dishonest'] },
  { spanish:'Una persona que no le gusta esforzarse ni trabajar', english:'Lazy', opts:['Hardworking','Honest','Curious'] },
  { spanish:'Una persona que confía en sus propias capacidades', english:'Confident', opts:['Shy','Lazy','Rude'] },
  { spanish:'Una persona que trata mal o sin respeto a los demás', english:'Rude', opts:['Friendly','Honest','Confident'] },
];
export function genVocabularioContextoM1Round(){
  const recurso = 'Los <b>adjetivos de personalidad</b> en inglés permiten describir cómo es una persona, más allá de su apariencia física: "honest" (honesto/a), "hardworking" (trabajador/a), "shy" (tímido/a), "friendly" (amable/simpático), "curious" (curioso/a), "lazy" (flojo/a), "confident" (seguro/a de sí mismo) y "rude" (grosero/a). Este vocabulario es muy útil para describir personajes de un texto, a compañeros, o a uno mismo, y es la base para escribir descripciones de personas más ricas y variadas en inglés.';
  const item = pick(PERSONALIDAD_BANK);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">Which adjective describes this?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const COMPRENSION_LECTURA_M1_BANK = [
  { text:'Renewable energy comes from natural sources that do not run out, such as the sun, the wind, and water. Many countries are now building more solar and wind farms to reduce pollution.', question:'What is the main idea of this text?', correct:'Renewable energy comes from natural sources and helps reduce pollution', opts:['Renewable energy is more expensive than oil','Solar farms do not exist yet','Countries have stopped using energy completely'] },
  { text:'Camila was a shy girl who loved painting alone in her room. One day, her teacher asked her to show her paintings at the school fair. At first she was scared, but everyone loved her art.', question:'What kind of person was Camila at the beginning of the story?', correct:'Shy', opts:['Rude','Lazy','Confident from the start'] },
  { text:'The old lighthouse stood on a rocky cliff by the sea. For fifty years, it guided ships safely to the harbor during storms.', question:'Where is the lighthouse located?', correct:'On a rocky cliff by the sea', opts:['In the middle of a city','Inside a harbor building','On top of a mountain'] },
  { text:'A group of friends decided to clean the local beach every Saturday. After a few months, the beach was much cleaner, and more families started visiting it again.', question:'What was the result of the group cleaning the beach?', correct:'The beach became cleaner and more families visited', opts:['The beach closed permanently','Nobody visited the beach anymore','The friends stopped going to the beach'] },
  { text:'In this story, a young inventor named Diego builds a small robot to help his grandfather in the garden. The robot waters the plants every morning.', question:'What does the robot do for the grandfather?', correct:'It waters the plants every morning', opts:['It cooks breakfast','It cleans the house','It drives the car'] },
  { text:'Drinking enough water every day helps the body function properly. Doctors recommend drinking about eight glasses of water daily.', question:'What do doctors recommend, according to the text?', correct:'Drinking about eight glasses of water daily', opts:['Avoiding water completely','Drinking only juice','Drinking water once a week'] },
  { text:'The novel takes place in a small mountain village, where a young shepherd named Mateo discovers an old, hidden path that leads to a forgotten town.', question:'What is the setting of this story?', correct:'A small mountain village', opts:['A large modern city','An underwater cave','A busy airport'] },
  { text:'Elena was a curious girl who always asked her teacher many questions during science class.', question:'What personality trait describes Elena in this text?', correct:'Curious', opts:['Lazy','Rude','Dishonest'] },
  { text:'A short guide explains that plastic bottles take hundreds of years to break down, so recycling them helps protect the environment.', question:'What is the main idea of this guide?', correct:'Recycling plastic bottles helps protect the environment', opts:['Plastic bottles disappear quickly','Recycling is not useful','Plastic bottles are dangerous to touch'] },
  { text:'In the story, twin brothers named Luca and Marco decide to build a treehouse together during their summer vacation.', question:'What do Luca and Marco decide to build?', correct:'A treehouse', opts:['A boat','A garden','A bicycle'] },
];
export function genComprensionLecturaM1Round(){
  const recurso = 'Comprender un texto en inglés a este nivel implica identificar varios elementos: la <b>idea principal</b> (de qué trata el texto en general), la <b>información explícita</b> (datos que el texto dice directamente), y en los textos literarios, el <b>entorno o ambientación</b> (dónde y cuándo ocurre la historia) y las <b>características de los personajes</b> (cómo son, qué hacen). Buscar palabras clave relacionadas con la pregunta, y fijarse en el contexto general de cada párrafo, ayuda a responder sin necesidad de traducir cada palabra del texto.';
  const item = pick(COMPRENSION_LECTURA_M1_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/ingles/2-medio — IN2M OA01-16.
   Cubiertos: OA08 (funciones del lenguaje: sugerencias, situaciones hipotéticas,
   cantidad), OA10 (palabras derivadas y textos no literarios) y OA11 (textos
   literarios: tema, personajes, entorno, trama, conflicto). Fuera: OA01-07
   (comprensión y producción oral, depende de audio real), OA09,12 (estrategias
   de lectura como proceso propio), OA13-16 (producción escrita). */
export const INGLES_MODULES_M2 = [
  {id:'gramaticacontextom2', label:'Gramática en Contexto', open:true, key:'gramaticacontextom2'},
  {id:'vocabulariocontextom2', label:'Palabras Derivadas', open:true, key:'vocabulariocontextom2'},
  {id:'comprensionlecturam2', label:'Comprensión de Lectura', open:true, key:'comprensionlecturam2'},
];
export const INGLES_POS_M2 = [{x:24,y:78},{x:70,y:50},{x:24,y:22}];

const SUGERENCIAS_M2_BANK = [
  { spanish:'Deberías estudiar más para el examen (sugerencia).', english:'You should study more for the exam', opts:['You studied more for the exam','You are studying more for the exam','You will never study for the exam'] },
  { spanish:'¿Por qué no le pides ayuda a tu profesor? (sugerencia).', english:'Why don’t you ask your teacher for help', opts:['You never ask your teacher for help','You asked your teacher for help yesterday','You are asking your teacher right now'] },
  { spanish:'Podrías intentar hacerlo de otra forma (sugerencia).', english:'You could try doing it another way', opts:['You did it another way already','You will never try another way','You are trying another way right now'] },
];
const HIPOTETICAS_M2_BANK = [
  { spanish:'Si yo fuera tú, hablaría con ella (situación hipotética).', english:'If I were you, I would talk to her', opts:['If I am you, I talk to her','If I was you, I am talking to her','If I were you, I talked to her yesterday'] },
  { spanish:'Si tuviera más tiempo, viajaría por el mundo (situación hipotética).', english:'If I had more time, I would travel the world', opts:['If I have more time, I travel the world','If I had more time, I am traveling the world','If I have more time, I will travel the world'] },
  { spanish:'Si él estudiara más, aprobaría el examen (situación hipotética).', english:'If he studied more, he would pass the exam', opts:['If he studies more, he passes the exam','If he studied more, he passes the exam','If he studies more, he will pass the exam'] },
];
const CANTIDAD_M2_BANK = [
  { spanish:'Tengo muchos amigos en el colegio (cantidad, sustantivo contable).', english:'I have a lot of friends at school', opts:['I have a lot of friend at school','I have much friends at school','I have a little friends at school'] },
  { spanish:'Solo queda un poco de agua en la botella (cantidad, sustantivo incontable).', english:'There is only a little water left in the bottle', opts:['There is only a few water left in the bottle','There is only a little waters left in the bottle','There is only much water left in the bottle'] },
  { spanish:'Ella tiene varios libros sobre ese tema (cantidad).', english:'She has several books about that topic', opts:['She has much books about that topic','She has a little books about that topic','She has any books about that topic'] },
];
export function genGramaticaContextoM2Round(){
  const recurso = 'En inglés, para hacer <b>sugerencias</b> se usan expresiones como "you should" (deberías), "you could" (podrías) o "why don’t you...?" (¿por qué no...?). Para hablar de <b>situaciones hipotéticas</b> (que no son reales o son poco probables), se usa la estructura "if + pasado simple, + would + verbo": "If I were you, I would talk to her" (si yo fuera tú, hablaría con ella) — nótese que con "if I" se usa "were" en vez de "was" en este tipo de oración. Para expresar <b>cantidad</b>, "a lot of" funciona con sustantivos contables e incontables, "a few" se usa con contables (few friends), y "a little" se usa con incontables (little water) — usar la palabra de cantidad correcta según el tipo de sustantivo es clave para sonar natural en inglés.';
  const bank = pick([SUGERENCIAS_M2_BANK, HIPOTETICAS_M2_BANK, CANTIDAD_M2_BANK]);
  const item = pick(bank);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, panel:true,
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const PALABRAS_DERIVADAS_BANK = [
  { spanish:'La palabra que significa "el estado de estar feliz" (a partir de "happy")', english:'Happiness', opts:['Happily','Unhappy','Happier'] },
  { spanish:'La palabra que significa "lleno de utilidad" (a partir de "use")', english:'Useful', opts:['Useless','User','Using'] },
  { spanish:'La palabra que significa "sin ninguna utilidad" (a partir de "use")', english:'Useless', opts:['Useful','User','Used'] },
  { spanish:'La palabra que describe a alguien "sin trabajo" (a partir de "employ")', english:'Unemployed', opts:['Employment','Employer','Employable'] },
  { spanish:'La palabra que significa "el acto de decidir" (a partir de "decide")', english:'Decision', opts:['Decisive','Undecided','Deciding'] },
  { spanish:'La palabra que describe algo "que se puede comer" (a partir de "eat")', english:'Edible', opts:['Eating','Eater','Uneaten'] },
  { spanish:'La palabra que significa "sin ningún cuidado" (a partir de "care")', english:'Careless', opts:['Careful','Caring','Cared'] },
  { spanish:'La palabra que significa "lleno de cuidado" (a partir de "care")', english:'Careful', opts:['Careless','Caring','Uncared'] },
  { spanish:'La palabra que significa "la persona que enseña" (a partir de "teach")', english:'Teacher', opts:['Teaching','Taught','Teachable'] },
  { spanish:'La palabra que describe algo "imposible de hacer" (a partir de "possible")', english:'Impossible', opts:['Possibly','Possibility','Possibleness'] },
];
export function genVocabularioContextoM2Round(){
  const recurso = 'Las <b>palabras derivadas</b> se forman agregando un prefijo o un sufijo a una palabra base, cambiando su significado o su función gramatical: agregar "-ness" a un adjetivo lo convierte en sustantivo ("happy" → "happiness"), agregar "-ful" a un sustantivo lo convierte en adjetivo con sentido positivo ("use" → "useful"), y agregar "-less" al mismo sustantivo le da el sentido contrario ("use" → "useless"). El prefijo "un-" suele invertir el significado de una palabra ("employed" → "unemployed"). Reconocer estos patrones ayuda a deducir el significado de palabras nuevas sin necesidad de memorizarlas todas por separado.';
  const item = pick(PALABRAS_DERIVADAS_BANK);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">Which word matches this description?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const COMPRENSION_LECTURA_M2_BANK = [
  { text:'Marina had always been afraid of the ocean, but when her little brother was pulled by a wave, she swam out without thinking twice and brought him back to shore.', question:'What is the central conflict in this story?', correct:'Marina must overcome her fear of the ocean to save her brother', opts:['Marina wants to learn how to swim for the first time','Marina is competing in a swimming competition','Marina dislikes her little brother'] },
  { text:'The setting of the novel is a small fishing village on a foggy coast, where the sound of the sea is always present in every scene.', question:'What is the setting of this novel?', correct:'A small fishing village on a foggy coast', opts:['A busy city downtown','A desert with no water nearby','A spaceship traveling through space'] },
  { text:'This guide explains that regular exercise improves not only physical health but also mood and sleep quality, according to several studies.', question:'What is the purpose of this text?', correct:'To inform readers about the benefits of regular exercise', opts:['To sell a specific exercise product','To tell an entertaining fictional story','To criticize people who do not exercise'] },
  { text:'Throughout the story, the theme of friendship overcoming distance is explored, as two childhood friends stay close despite living on different continents.', question:'What is the main theme of this story?', correct:'Friendship overcoming distance', opts:['The dangers of travel','The importance of money','A mystery that is never solved'] },
  { text:'A short article compares two cities, listing population, average temperature, and main industries, without giving any personal opinion about either one.', question:'What kind of text is this?', correct:'A non-literary, informative text comparing data about two cities', opts:['A poem about two cities','A personal diary entry','A fictional story about a trip'] },
  { text:'Daniel had never spoken in front of a large group before, but when his best friend got sick right before the school presentation, he had to step up and speak for both of them.', question:'What is the central conflict in this story?', correct:'Daniel must overcome his fear of public speaking to help his friend', opts:['Daniel wants to skip the school presentation entirely','Daniel is arguing with his best friend','Daniel is planning a trip to another country'] },
  { text:'The story takes place aboard an old sailing ship crossing a stormy ocean, with waves crashing against the deck throughout most of the chapters.', question:'What is the setting of this story?', correct:'Aboard an old sailing ship crossing a stormy ocean', opts:['Inside a quiet library','On top of a mountain in summer','In a modern shopping mall'] },
  { text:'This brochure explains the steps to properly recycle different types of household waste, including paper, plastic, and glass.', question:'What is the purpose of this text?', correct:'To inform readers about how to recycle household waste correctly', opts:['To tell a fictional story about a family','To sell a specific brand of trash bags','To criticize people who do not recycle'] },
  { text:'Throughout the novel, the theme of courage in the face of change is explored, as the main character must adapt to a completely new school and city.', question:'What is the main theme of this story?', correct:'Courage in the face of change', opts:['The history of a specific city','The rules of a sport','A recipe for a traditional dish'] },
];
export function genComprensionLecturaM2Round(){
  const recurso = 'Al leer un texto en inglés a este nivel, conviene distinguir varios elementos: en textos <b>literarios</b>, el conflicto central (el problema que enfrenta un personaje), el entorno o ambientación (dónde y cuándo ocurre la historia), y el tema principal (la idea general que la historia explora, como la amistad o la superación del miedo). En textos <b>no literarios</b>, es clave identificar el propósito del texto (informar, convencer, entretener) y sus ideas principales, generalmente presentadas de forma más directa y sin opiniones personales. Reconocer si un texto es literario o no literario ayuda a saber qué tipo de información buscar en él.';
  const item = pick(COMPRENSION_LECTURA_M2_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.',
    recurso: recurso,
  };
}

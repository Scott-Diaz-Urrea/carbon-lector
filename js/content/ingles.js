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
];
export const INGLES_POS_G5 = [{x:30,y:70},{x:70,y:30}];

const VOCABULARIO_INGLES_BANK = [
  { emoji:'🐶', english:'DOG' }, { emoji:'🐱', english:'CAT' }, { emoji:'🐦', english:'BIRD' },
  { emoji:'🐟', english:'FISH' }, { emoji:'🐴', english:'HORSE' }, { emoji:'🐮', english:'COW' },
  { emoji:'🔴', english:'RED' }, { emoji:'🔵', english:'BLUE' }, { emoji:'🟢', english:'GREEN' }, { emoji:'🟡', english:'YELLOW' },
  { emoji:'👨', english:'FATHER' }, { emoji:'👩', english:'MOTHER' }, { emoji:'👶', english:'BABY' },
  { emoji:'📚', english:'BOOK' }, { emoji:'✏️', english:'PENCIL' }, { emoji:'🎒', english:'BACKPACK' }, { emoji:'📏', english:'RULER' },
  { emoji:'🍎', english:'APPLE' }, { emoji:'🍌', english:'BANANA' }, { emoji:'🍞', english:'BREAD' }, { emoji:'🥛', english:'MILK' },
];
export function genVocabularioIngles5Round(){
  const recurso = 'Aprender vocabulario nuevo en inglés es más fácil cuando se asocia directamente una <b>imagen o concepto</b> con la palabra en inglés, sin pasar por la traducción al español cada vez — así como un bebé aprende su primer idioma reconociendo objetos, no memorizando definiciones. Practicar categorías completas (animales, colores, la familia, útiles escolares, comida) ayuda a construir un vocabulario base sólido, que después sirve para formar oraciones simples y leer textos más largos en inglés.';
  const item = pick(VOCABULARIO_INGLES_BANK);
  const distract = shuffle(VOCABULARIO_INGLES_BANK.filter(function(v){ return v.english!==item.english; })).slice(0,3).map(function(v){ return v.english; });
  const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">How do you say this in English? (¿Cómo se dice esto en inglés?)</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.', recurso: recurso,
  };
}

const LECTURA_SIMPLE_BANK = [
  { text:'I have a dog. My dog is brown and small.', question:'What color is the dog?', correct:'BROWN', opts:['BLACK','WHITE','YELLOW'] },
  { text:'Anna has a red bike. She rides her bike to school every day.', question:'What color is the bike?', correct:'RED', opts:['BLUE','GREEN','YELLOW'] },
  { text:'Tom likes apples. He eats an apple every morning for breakfast.', question:'What does Tom eat every morning?', correct:'AN APPLE', opts:['A BANANA','BREAD','MILK'] },
  { text:'The cat is on the table. The dog is under the table.', question:'Where is the dog?', correct:'UNDER THE TABLE', opts:['ON THE TABLE','IN A BOX','ON A CHAIR'] },
  { text:'This family has three pets: a dog, a cat, and a bird.', question:'How many pets does the family have?', correct:'THREE', opts:['TWO','FOUR','FIVE'] },
  { text:'Sara wakes up. Then she brushes her teeth. Then she eats breakfast.', question:'What does Sara do first?', correct:'SHE WAKES UP', opts:['SHE EATS BREAKFAST','SHE BRUSHES HER TEETH','SHE GOES TO SCHOOL'] },
  { text:'It is raining today, so Ben wears his yellow raincoat.', question:'What is the weather like today?', correct:'RAINING', opts:['SUNNY','SNOWING','WINDY'] },
  { text:'The library is a quiet place. People go there to read books.', question:'What do people do in the library?', correct:'THEY READ BOOKS', opts:['THEY PLAY SOCCER','THEY SWIM','THEY COOK'] },
  { text:'Leo has two brothers and one sister.', question:'How many sisters does Leo have?', correct:'ONE', opts:['TWO','THREE','ZERO'] },
  { text:'The sun is bright today, and the sky is blue.', question:'What color is the sky today?', correct:'BLUE', opts:['GRAY','BLACK','GREEN'] },
];
export function genLecturaSimple5Round(){
  const recurso = 'Leer en inglés a este nivel no requiere entender cada palabra: se trata de identificar la <b>información explícita</b> que el texto dice directamente (un color, una cantidad, un lugar, el orden de las acciones), apoyándose en las palabras que sí se conocen y en el contexto general de la oración. Buscar palabras clave relacionadas con la pregunta dentro del texto —igual que se haría al leer en español— es la misma estrategia de comprensión lectora, solo que aplicada a otro idioma.';
  const item = pick(LECTURA_SIMPLE_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.', recurso: recurso,
  };
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
  { emoji:'☀️', english:'SUNNY' }, { emoji:'🌧️', english:'RAINY' }, { emoji:'❄️', english:'SNOWY' },
  { emoji:'💨', english:'WINDY' }, { emoji:'☁️', english:'CLOUDY' },
  { emoji:'🏃', english:'RUN' }, { emoji:'🏊', english:'SWIM' }, { emoji:'✍️', english:'WRITE' },
  { emoji:'😴', english:'SLEEP' }, { emoji:'⛹️', english:'PLAY' },
];
const DIAS_SEMANA_BANK = [
  { spanish:'LUNES', english:'MONDAY' }, { spanish:'MARTES', english:'TUESDAY' }, { spanish:'MIÉRCOLES', english:'WEDNESDAY' },
  { spanish:'JUEVES', english:'THURSDAY' }, { spanish:'VIERNES', english:'FRIDAY' }, { spanish:'SÁBADO', english:'SATURDAY' }, { spanish:'DOMINGO', english:'SUNDAY' },
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
  { text:'Dear Sofia, Thank you for the birthday gift. I love the book. See you soon. Love, Mia.', question:'What did Mia receive as a gift?', correct:'A BOOK', opts:['A TOY','A BIKE','A GAME'] },
  { text:'You are invited to a birthday party! Saturday, 3:00 PM, at the park.', question:'What day is the party?', correct:'SATURDAY', opts:['MONDAY','FRIDAY','SUNDAY'] },
  { text:'Postcard from the beach: The weather is sunny and the water is warm. I am eating ice cream every day.', question:'What is the weather like at the beach?', correct:'SUNNY', opts:['RAINY','SNOWY','COLD'] },
  { text:'Menu: Soup 3 dollars, Sandwich 5 dollars, Salad 4 dollars, Juice 2 dollars.', question:'How much does a sandwich cost?', correct:'5 DOLLARS', opts:['3 DOLLARS','4 DOLLARS','2 DOLLARS'] },
  { text:'A short poem: The cat sat on the mat, and then it took a nap.', question:'Where did the cat sit?', correct:'ON THE MAT', opts:['ON THE BED','ON THE CHAIR','ON THE FLOOR'] },
  { text:'Comic strip: A boy drops his ice cream. He looks sad. Then his dog licks his hand and he smiles.', question:'Why does the boy smile at the end?', correct:'BECAUSE HIS DOG COMFORTS HIM', opts:['BECAUSE HE GOT NEW ICE CREAM','BECAUSE IT STARTED RAINING','BECAUSE HE WENT HOME'] },
  { text:'A short story: Once there was a small mouse who lived in a big house. Every night, the mouse looked for cheese.', question:'What did the mouse look for every night?', correct:'CHEESE', opts:['BREAD','MILK','FRUIT'] },
  { text:'Note on the fridge: Please buy milk and eggs. Thank you. Mom.', question:'What does Mom ask to buy?', correct:'MILK AND EGGS', opts:['BREAD AND BUTTER','APPLES AND BANANAS','RICE AND BEANS'] },
  { text:'Greeting card: Happy birthday. I hope you have a wonderful day. With love, Grandma.', question:'Who wrote the card?', correct:'GRANDMA', opts:['MOM','A FRIEND','THE TEACHER'] },
  { text:'A short poem: Twinkle, twinkle, little star, how I wonder what you are.', question:'What does the poem talk about?', correct:'A STAR', opts:['THE MOON','THE SUN','A CLOUD'] },
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
  { spanish:'Debes hacer esto (obligación).', english:'YOU MUST DO THIS', opts:['YOU CAN DO THIS','YOU MIGHT DO THIS','YOU LIKE THIS'] },
  { spanish:'Deberías intentar esto (sugerencia).', english:'YOU SHOULD TRY THIS', opts:['YOU MUST TRY THIS','YOU NEVER TRY THIS','YOU HATE THIS'] },
  { spanish:'Necesito ayuda (necesidad).', english:'I NEED HELP', opts:['I WANT HELP','I HAVE HELP','I GIVE HELP'] },
  { spanish:'No se permite hacer esto (prohibición).', english:'YOU MUST NOT DO THIS', opts:['YOU SHOULD DO THIS','YOU CAN DO THIS','YOU ALWAYS DO THIS'] },
  { spanish:'¿Y si vamos al parque? (sugerencia).', english:'HOW ABOUT GOING TO THE PARK', opts:['WE NEVER GO TO THE PARK','YOU MUST GO TO THE PARK','I HATE THE PARK'] },
  { spanish:'Es obligatorio usar casco (obligación).', english:'YOU MUST WEAR A HELMET', opts:['YOU MIGHT WEAR A HELMET','YOU DISLIKE A HELMET','YOU SEE A HELMET'] },
];
const CANTIDADES_DESCRIPCIONES_BANK = [
  { spanish:'Hay muchos libros en la mesa.', english:'THERE ARE MANY BOOKS ON THE TABLE', opts:['THERE IS ONE BOOK ON THE TABLE','THERE ARE NO BOOKS ON THE TABLE','THE TABLE HAS NO BOOKS'] },
  { spanish:'Hay poca agua en el vaso.', english:'THERE IS LITTLE WATER IN THE GLASS', opts:['THERE IS A LOT OF WATER IN THE GLASS','THE GLASS IS COMPLETELY FULL','THE GLASS HAS NO WATER'] },
  { spanish:'Esta caja es más pesada que esa.', english:'THIS BOX IS HEAVIER THAN THAT ONE', opts:['THIS BOX IS LIGHTER THAN THAT ONE','BOTH BOXES WEIGH THE SAME','THIS BOX HAS NO WEIGHT'] },
  { spanish:'Ella es la persona más alta del grupo.', english:'SHE IS THE TALLEST PERSON IN THE GROUP', opts:['SHE IS THE SHORTEST PERSON IN THE GROUP','EVERYONE IS THE SAME HEIGHT','SHE IS NOT PART OF THE GROUP'] },
];
export function genVocabularioAvanzado7Round(){
  const recurso = 'En inglés, palabras como <b>must/have to</b> expresan obligación, <b>should</b> expresa sugerencia, y <b>need to</b> expresa necesidad — cada una indica un grado distinto de importancia sobre una acción. También se pueden describir <b>cantidades</b> (many, little, a lot of) y hacer <b>comparaciones</b> (heavier than, the tallest) para comparar dos o más cosas. Practicar estas estructuras ayuda a expresar ideas más precisas en inglés, más allá de vocabulario simple.';
  const item = pick(Math.random()<0.5 ? OBLIGACION_SUGERENCIA_BANK : CANTIDADES_DESCRIPCIONES_BANK);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:1, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const LECTURA_INTERMEDIA_BANK = [
  { text:'Recycling helps the environment. It reduces waste and saves natural resources like trees and water.', question:'What does recycling help reduce?', correct:'WASTE', opts:['MONEY','TIME','FRIENDS'] },
  { text:'Marco plays soccer every weekend with his friends at the local park near his house.', question:'What sport does Marco play?', correct:'SOCCER', opts:['BASKETBALL','TENNIS','SWIMMING'] },
  { text:'Once upon a time, a young girl named Elena found a hidden map in an old chest that belonged to her grandmother. She decided to follow it.', question:'What did Elena find?', correct:'A HIDDEN MAP', opts:['A LETTER','A PHOTOGRAPH','A KEY'] },
  { text:'In the story, the main character is a brave fox who lives in a big forest with many other animals.', question:'Where does the main character live?', correct:'IN A FOREST', opts:['IN A CITY','IN A DESERT','IN A CAVE'] },
  { text:'The school announced a science fair next month. Students will present projects about renewable energy.', question:'What is the topic of the projects?', correct:'RENEWABLE ENERGY', opts:['ANCIENT HISTORY','SPORTS','MUSIC'] },
  { text:'After the rain stopped, a beautiful rainbow appeared over the mountains, and everyone came outside to see it.', question:'What appeared after the rain?', correct:'A RAINBOW', opts:['A STORM','SNOW','A FIRE'] },
  { text:'The novel follows two brothers who travel across the country to find their missing father.', question:'What are the two brothers looking for?', correct:'THEIR MISSING FATHER', opts:['A LOST TREASURE','A NEW HOME','A FAMOUS CITY'] },
  { text:'Healthy eating includes fruits, vegetables, and drinking enough water every day.', question:'According to the text, what should you drink enough of every day?', correct:'WATER', opts:['SODA','COFFEE','JUICE ONLY'] },
  { text:'The museum has a new exhibit about ancient Egypt, with real artifacts from over three thousand years ago.', question:'What is the new exhibit about?', correct:'ANCIENT EGYPT', opts:['MODERN ART','SPACE TRAVEL','OCEAN LIFE'] },
  { text:'Every summer, the town holds a music festival where local bands perform in the main square.', question:'Where do the bands perform?', correct:'IN THE MAIN SQUARE', opts:['AT THE BEACH','IN A STADIUM','AT SCHOOL'] },
  { text:'In this story, a clever crow drops stones into a jar of water to make the water level rise so it can drink.', question:'Why does the crow drop stones into the jar?', correct:'TO MAKE THE WATER LEVEL RISE', opts:['TO BUILD A NEST','TO PLAY A GAME','TO HIDE THE STONES'] },
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
  { spanish:'Mi mochila es más pesada que la tuya (comparación).', english:'MY BACKPACK IS HEAVIER THAN YOURS', opts:['MY BACKPACK IS THE LIGHTEST','MY BACKPACK IS NEW','YOUR BACKPACK IS HEAVIER THAN MINE'] },
  { spanish:'Este es el día más frío del año (superlativo).', english:'THIS IS THE COLDEST DAY OF THE YEAR', opts:['THIS DAY IS COLDER THAN TOMORROW','THIS IS A WARM DAY','EVERY DAY IS COLD'] },
  { spanish:'Voy a viajar al sur este verano (intención futura).', english:'I AM GOING TO TRAVEL SOUTH THIS SUMMER', opts:['I TRAVELED SOUTH LAST SUMMER','I NEVER TRAVEL SOUTH','I AM TRAVELING SOUTH RIGHT NOW'] },
  { spanish:'Mañana lloverá en la ciudad (predicción futura).', english:'IT WILL RAIN IN THE CITY TOMORROW', opts:['IT RAINED IN THE CITY YESTERDAY','IT IS RAINING NOW','IT NEVER RAINS IN THE CITY'] },
  { spanish:'Dobla a la derecha en la esquina (indicación de dirección).', english:'TURN RIGHT AT THE CORNER', opts:['TURN LEFT AT THE PARK','GO STRAIGHT FOREVER','STOP AT THE CORNER'] },
  { spanish:'La biblioteca está entre el banco y la plaza (ubicación).', english:'THE LIBRARY IS BETWEEN THE BANK AND THE SQUARE', opts:['THE LIBRARY IS BEHIND THE MOUNTAIN','THE LIBRARY IS INSIDE THE BANK','THE LIBRARY IS FAR FROM EVERYTHING'] },
  { spanish:'Si estudias, aprenderás más rápido (condicional).', english:'IF YOU STUDY, YOU WILL LEARN FASTER', opts:['IF YOU SLEEP, YOU WILL LEARN FASTER','YOU NEVER STUDY','STUDYING IS NOT USEFUL'] },
  { spanish:'Si llueve, nos quedaremos en casa (condicional).', english:'IF IT RAINS, WE WILL STAY HOME', opts:['IF IT RAINS, WE WILL GO TO THE BEACH','IT NEVER RAINS AT HOME','WE ALWAYS STAY HOME'] },
  { spanish:'El tren es más rápido que el bus (comparación).', english:'THE TRAIN IS FASTER THAN THE BUS', opts:['THE BUS IS FASTER THAN THE TRAIN','THE TRAIN IS THE SLOWEST','BOTH ARE EQUALLY SLOW'] },
  { spanish:'Ella es la mejor jugadora del equipo (superlativo).', english:'SHE IS THE BEST PLAYER ON THE TEAM', opts:['SHE IS A NEW PLAYER ON THE TEAM','SHE IS THE WORST PLAYER','SHE DOES NOT PLAY'] },
];
export function genFuncionesIdioma8Round(){
  const recurso = 'En inglés, ciertas estructuras gramaticales cumplen "funciones" comunicativas específicas. Para hablar de <b>planes o predicciones futuras</b>, se usa "will" (it will rain) o "going to" (I am going to study). Para dar <b>indicaciones de dirección</b>, se usan verbos como "turn" (doblar) o "go straight" (seguir derecho), junto a preposiciones de lugar como "between" (entre) o "behind" (detrás). Los <b>condicionales simples</b> (con "if") describen una consecuencia que depende de una condición: "If you study, you will learn faster" (si estudias, aprenderás más rápido). Las <b>comparaciones</b> usan "-er than" (faster than = más rápido que) para comparar dos cosas, y el <b>superlativo</b> usa "the -est" (the best = el/la mejor) para señalar el máximo dentro de un grupo.';
  const item = pick(FUNCIONES_8_BANK);
  const opts = shuffle([item.english].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:1, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    recurso: recurso,
  };
}

const LECTURA_AVANZADA_8_BANK = [
  { text:'Because the bus drivers were on strike, many students arrived late to school on Monday.', question:'Why did many students arrive late?', correct:'BECAUSE THE BUS DRIVERS WERE ON STRIKE', opts:['BECAUSE THE SCHOOL WAS CLOSED','BECAUSE IT WAS SNOWING','BECAUSE THEY WOKE UP EARLY'] },
  { text:'First, mix the flour and eggs. Then, add the milk slowly. Finally, cook the mixture in a hot pan.', question:'What should you do right after mixing the flour and eggs?', correct:'ADD THE MILK SLOWLY', opts:['COOK THE MIXTURE','EAT THE FLOUR','WASH THE PAN'] },
  { text:'The town built a new bridge over the river. As a result, people now save thirty minutes on their way to work.', question:'What was the result of building the bridge?', correct:'PEOPLE NOW SAVE THIRTY MINUTES', opts:['THE RIVER BECAME WIDER','PEOPLE STOPPED WORKING','THE TOWN LOST ITS ROADS'] },
  { text:'Maria forgot her umbrella at home. Consequently, she got completely wet on her walk to the station.', question:'Why did Maria get wet?', correct:'BECAUSE SHE FORGOT HER UMBRELLA', opts:['BECAUSE SHE SWAM IN THE RIVER','BECAUSE THE STATION WAS FLOODED','BECAUSE SHE TOOK A SHOWER'] },
  { text:'The story follows a young inventor who builds a robot to help her grandmother with the garden. At the end, the whole neighborhood asks for robots too.', question:'Why did the inventor build the robot?', correct:'TO HELP HER GRANDMOTHER WITH THE GARDEN', opts:['TO SELL IT TO THE NEIGHBORS','TO WIN A SCIENCE PRIZE','TO CLEAN HER ROOM'] },
  { text:'Plastic takes hundreds of years to break down. For this reason, many cities now encourage reusable bags.', question:'Why do many cities encourage reusable bags?', correct:'BECAUSE PLASTIC TAKES HUNDREDS OF YEARS TO BREAK DOWN', opts:['BECAUSE REUSABLE BAGS ARE EXPENSIVE','BECAUSE PLASTIC DISAPPEARS QUICKLY','BECAUSE CITIES DISLIKE SHOPPING'] },
  { text:'After the final exam, the students organized a small celebration in the park. They played games, shared food, and thanked their teachers.', question:'When did the students organize the celebration?', correct:'AFTER THE FINAL EXAM', opts:['BEFORE THE FIRST CLASS','DURING THE EXAM','A YEAR EARLIER'] },
  { text:'The new sports center opened in March. Since then, more young people in the neighborhood practice sports every week.', question:'What happened after the sports center opened?', correct:'MORE YOUNG PEOPLE PRACTICE SPORTS EVERY WEEK', opts:['THE NEIGHBORHOOD CLOSED ITS PARKS','FEWER PEOPLE PLAY SPORTS','THE CENTER MOVED TO ANOTHER CITY'] },
  { text:'In the novel, the main character moves to a small village by the sea. At first she feels lonely, but after joining the local choir she makes many friends.', question:'How did the character make friends?', correct:'BY JOINING THE LOCAL CHOIR', opts:['BY STAYING AT HOME','BY MOVING BACK TO THE CITY','BY BUYING A BOAT'] },
  { text:'The library extended its hours because many students requested more time to study in the evenings.', question:'What caused the library to extend its hours?', correct:'STUDENTS REQUESTED MORE TIME TO STUDY', opts:['THE LIBRARY HAD TOO MANY BOOKS','THE EVENINGS BECAME LONGER','A NEW LIBRARY OPENED NEXT DOOR'] },
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

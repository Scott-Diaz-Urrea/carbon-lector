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
  const item = pick(VOCABULARIO_INGLES_BANK);
  const distract = shuffle(VOCABULARIO_INGLES_BANK.filter(function(v){ return v.english!==item.english; })).slice(0,3).map(function(v){ return v.english; });
  const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">How do you say this in English? (¿Cómo se dice esto en inglés?)</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: 'Se dice <b>'+item.english+'</b> en inglés.',
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
  const item = pick(LECTURA_SIMPLE_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.',
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
  if(Math.random()<0.6){
    const item = pick(CLIMA_VERBOS_BANK);
    const distract = shuffle(CLIMA_VERBOS_BANK.filter(function(v){ return v.english!==item.english; })).slice(0,3).map(function(v){ return v.english; });
    const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">How do you say this in English? (¿Cómo se dice esto en inglés?)</p>',
      options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
      explain: 'Se dice <b>'+item.english+'</b> en inglés.',
    };
  }
  const item = pick(DIAS_SEMANA_BANK);
  const distract = shuffle(DIAS_SEMANA_BANK.filter(function(d){ return d.english!==item.english; })).slice(0,3).map(function(d){ return d.english; });
  const opts = shuffle([item.english].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.spanish+'</p><p class="prompt-hint">How do you say this day in English?</p>',
    options: opts, correctValue: item.english, speakText: item.english, speakLang:'en', cols:2, kind:'word',
    explain: '"'+item.spanish+'" se dice <b>'+item.english+'</b> en inglés.',
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
  const item = pick(LECTURA_SIMPLE2_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, speakLang:'en', cols:2, kind:'word',
    explain: 'The answer is <b>'+item.correct+'</b>.',
  };
}

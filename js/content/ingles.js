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

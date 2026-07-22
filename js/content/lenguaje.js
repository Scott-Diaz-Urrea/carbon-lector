import { pick, shuffle } from '../utils.js';
import { espejoSVG, igluSVG } from '../svg.js';

/* Cinco correcciones a íconos que no coincidían con la palabra (misma
   categoría de bug que 🥛 para "vaso de agua", ver corporalidadMovimiento.js):
   ANCLA usaba 🪁 (que es literalmente una cometa/volantín, no un ancla) →
   ⚓ es el emoji correcto y se renderiza bien en todos lados. ESCUELA usaba
   🚂 (un tren) → 🏫 es el edificio real. ESPEJO usaba el emoji 🪞 crudo, que
   no se renderiza en varios navegadores (mismo problema ya resuelto en
   otros archivos con espejoSVG()) → se reusa ese helper aquí también. IGLÚ
   usaba 🧊 (un cubo de hielo, que no se parece en nada a la cúpula de un
   iglú) → igluSVG() dibuja la forma real. IRIS usaba 🌈 (arcoíris), pero
   "arcoíris" e "iris" son conceptos distintos — un niño que reconoce la
   imagen diría "arcoíris", no "iris", lo que rompe el juego de "con qué
   vocal empieza esta palabra"; se cambió a INSECTO (🐜), una palabra con
   vocal I inicial y un emoji que sí representa exactamente lo que dice. */
export const VOCAL_WORDS = [
  { emoji:'🕷️', word:'ARAÑA', answer:'A' },
  { emoji:'✈️', word:'AVIÓN', answer:'A' },
  { emoji:'🐝', word:'ABEJA', answer:'A' },
  { emoji:'🌳', word:'ÁRBOL', answer:'A' },
  { emoji:'💧', word:'AGUA', answer:'A' },
  { emoji:'🦅', word:'ÁGUILA', answer:'A' },
  { emoji:'⚓', word:'ANCLA', answer:'A' },
  { emoji:'🐘', word:'ELEFANTE', answer:'E' },
  { emoji:'⭐', word:'ESTRELLA', answer:'E' },
  { emoji:'🏫', word:'ESCUELA', answer:'E' },
  { emoji: espejoSVG(30), word:'ESPEJO', answer:'E' },
  { emoji:'🌋', word:'ERUPCIÓN', answer:'E' },
  { emoji:'🏝️', word:'ISLA', answer:'I' },
  { emoji: igluSVG(30), word:'IGLÚ', answer:'I' },
  { emoji:'🐜', word:'INSECTO', answer:'I' },
  { emoji:'🧲', word:'IMÁN', answer:'I' },
  { emoji:'🦎', word:'IGUANA', answer:'I' },
  { emoji:'🐻', word:'OSO', answer:'O' },
  { emoji:'🐑', word:'OVEJA', answer:'O' },
  { emoji:'👂', word:'OREJA', answer:'O' },
  { emoji:'🐻', word:'OSITO', answer:'O' },
  { emoji:'🌊', word:'OLA', answer:'O' },
  { emoji:'🍇', word:'UVA', answer:'U' },
  { emoji:'💅', word:'UÑA', answer:'U' },
  { emoji:'1️⃣', word:'UNO', answer:'U' },
  { emoji:'🎽', word:'UNIFORME', answer:'U' },
  { emoji:'🦄', word:'UNICORNIO', answer:'U' },
];

export const PALABRA_WORDS = [
  { emoji:'🐱', word:'GATO', opts:['GALLO','GORRO','GLOBO'] },
  { emoji:'🦆', word:'PATO', opts:['PALO','PISO','PESO'] },
  { emoji:'☀️', word:'SOL', opts:['SAL','SUR','SON'] },
  { emoji:'🌙', word:'LUNA', opts:['LATA','LOMA','LIMA'] },
  { emoji:'🏠', word:'CASA', opts:['COSA','CAJA','CAMA'] },
  { emoji:'🌸', word:'FLOR', opts:['FRÍO','FRUTA','FOCA'] },
  { emoji:'🐟', word:'PEZ', opts:['PAZ','PIE','POR'] },
  { emoji:'🐻', word:'OSO', opts:['OJO','ASA','USO'] },
  { emoji:'🐄', word:'VACA', opts:['VELA','VIDA','VASO'] },
  { emoji:'🚂', word:'TREN', opts:['TRES','TRAJE','TRIGO'] },
  { emoji:'📖', word:'LIBRO', opts:['LOBO','LADO','LUPA'] },
  { emoji:'⚽', word:'PELOTA', opts:['PALETA','MALETA','CAMISETA'] },
  { emoji:'🐝', word:'ABEJA', opts:['ABUELA','ARENA','AGUJA'] },
  { emoji:'☁️', word:'NUBE', opts:['NAVE','NIEVE','NOCHE'] },
  { emoji:'⭐', word:'ESTRELLA', opts:['ESCUELA','ESCALERA','ESPEJO'] },
  { emoji:'✋', word:'MANO', opts:['MESA','MONO','MULA'] },
  { emoji:'🐢', word:'TORTUGA', opts:['TORMENTA','TOSTADA','TORNADO'] },
  { emoji:'🦋', word:'MARIPOSA', opts:['MARIONETA','MADRINA','MARINERO'] },
  { emoji:'🌙', word:'NOCHE', opts:['LECHE','COCHE','NIEVE'] },
  { emoji:'🐕', word:'PERRO', opts:['PERO','PIRO','PARRA'] },
  { emoji:'🎨', word:'PINTURA', opts:['CINTURA','PINTOR','CULTURA'] },
  { emoji:'🚲', word:'BICICLETA', opts:['BOCADILLO','BICEPS','BOTELLA'] },
  { emoji:'🍦', word:'HELADO', opts:['PELADO','SALADO','MOJADO'] },
  { emoji:'🦷', word:'DIENTE', opts:['DUENDE','DIENTES','DIANTRE'] },
];

export const COMPRENSION_BANK = [
  { text:'EL GATO DUERME EN LA CAMA.', question:'¿Dónde duerme el gato?', correct:'🛏️', opts:['🌳','⚽','🚗'] },
  { text:'LA NIÑA COME UNA MANZANA.', question:'¿Qué come la niña?', correct:'🍎', opts:['🍌','🍇','🍓'] },
  { text:'EL PERRO CORRE EN EL PARQUE.', question:'¿Dónde corre el perro?', correct:'🌳', opts:['🏠','🛏️','🚗'] },
  { text:'LA MAMÁ COCINA UNA SOPA.', question:'¿Qué cocina la mamá?', correct:'🍲', opts:['🍕','🎂','🥗'] },
  { text:'EL NIÑO LEE UN LIBRO.', question:'¿Qué hace el niño?', correct:'📖', opts:['⚽','🎨','🎵'] },
  { text:'LA ABEJA VUELA HACIA LA FLOR.', question:'¿Hacia dónde vuela la abeja?', correct:'🌸', opts:['🌙','🚗','📖'] },
  { text:'EL PEZ NADA EN EL AGUA.', question:'¿Dónde nada el pez?', correct:'🌊', opts:['🌳','🏠','☁️'] },
  { text:'LOS NIÑOS JUEGAN CON LA PELOTA.', question:'¿Con qué juegan los niños?', correct:'⚽', opts:['📖','🍎','🚗'] },
  { text:'LA LUNA BRILLA DE NOCHE.', question:'¿Cuándo brilla la luna?', correct:'🌙', opts:['☀️','🌧️','⛄'] },
  { text:'EL PATO NADA EN EL ESTANQUE.', question:'¿Quién nada en el estanque?', correct:'🦆', opts:['🐱','🐄','🐝'] },
  { text:'LA TORTUGA CAMINA MUY LENTO.', question:'¿Cómo camina la tortuga?', correct:'🐢', opts:['🐆','🐇','🦅'] },
  { text:'EL SOL CALIENTA LA PLAYA.', question:'¿Qué calienta el sol?', correct:'🏖️', opts:['🏔️','🌧️','🌙'] },
  { text:'LA MARIPOSA VUELA DE FLOR EN FLOR.', question:'¿Qué hace la mariposa?', correct:'🦋', opts:['🐌','🐛','🐜'] },
  { text:'EL PANADERO HORNEA EL PAN TEMPRANO.', question:'¿Quién hornea el pan?', correct:'👨‍🍳', opts:['👩‍⚕️','👮','👨‍🌾'] },
  { text:'LOS PÁJAROS CANTAN EN LA MAÑANA.', question:'¿Cuándo cantan los pájaros?', correct:'🌅', opts:['🌃','🌆','⛈️'] },
  { text:'LA ABUELA TEJE UNA BUFANDA DE LANA.', question:'¿Qué teje la abuela?', correct:'🧣', opts:['🧦','🧤','👒'] },
];

export const ALL_COMBOS = ['QUE','QUI','GE','GI','GUE','GUI','CE','CI','GÜE','GÜI'];
export const COMBO_WORDS = [
  { emoji:'🧀', before:'', combo:'QUE', after:'SO' },
  { emoji:'🏪', before:'', combo:'QUI', after:'OSCO' },
  { emoji:'👥', before:'', combo:'GE', after:'NTE' },
  { emoji:'🌻', before:'', combo:'GI', after:'RASOL' },
  { emoji:'🎸', before:'', combo:'GUI', after:'TARRA' },
  { emoji:'🚿', before:'MAN', combo:'GUE', after:'RA' },
  { emoji:'☁️', before:'', combo:'CI', after:'ELO' },
  { emoji:'🍳', before:'CO', combo:'CI', after:'NA' },
  { emoji:'🐧', before:'PIN', combo:'GÜI', after:'NO' },
  { emoji:'🧅', before:'', combo:'CE', after:'BOLLA' },
  { emoji:'🏸', before:'RA', combo:'QUE', after:'TA' },
  { emoji:'🎩', before:'MA', combo:'GI', after:'A' },
];

export const LENGUAJE_MODULES = [
  {id:'vocales', label:'Vocales', open:true, key:'vocales'},
  {id:'silabas', label:'Sílabas', open:true, key:'silabas'},
  {id:'memorama', label:'Letras', open:true, key:'memorama'},
  {id:'palabras', label:'Palabras', open:true, key:'palabras'},
  {id:'comprension', label:'Comprensión', open:true, key:'comprension'},
];
export const LENGUAJE_POS = [{x:22,y:88},{x:68,y:70},{x:24,y:52},{x:70,y:34},{x:24,y:16}];

export const LENGUAJE_MODULES_G2 = [
  {id:'combinaciones', label:'Combinaciones', open:true, key:'combinaciones'},
  {id:'secuencia', label:'Secuencia', open:true, key:'secuencia'},
  {id:'gramatica2', label:'Gramática', open:true, key:'gramatica2'},
  {id:'comprension2', label:'Comprensión II', open:true, key:'comprension2'},
];
export const LENGUAJE_POS_G2 = [{x:22,y:84},{x:68,y:62},{x:24,y:40},{x:70,y:16}];

export function genVocalRound(){
  const item = pick(VOCAL_WORDS);
  const opts = shuffle(['A','E','I','O','U']).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span>'+
      '<p class="prompt-word"><span class="blank">_</span>'+item.word.slice(1)+'</p>'+
      '<p class="prompt-hint">¿Con qué vocal empieza esta palabra?</p>',
    options: opts,
    correctValue: item.answer,
    speakText: item.word,
    cols: 4,
    explain: 'La palabra es <b>'+item.word+'</b>, empieza con la vocal <b>'+item.answer+'</b>.',
  };
}

export function genPalabraRound(){
  const item = pick(PALABRA_WORDS);
  const opts = shuffle([item.word].concat(item.opts)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué palabra corresponde a esta imagen?</p>',
    options: opts,
    correctValue: item.word,
    speakText: item.word,
    cols: 4,
    kind: 'word',
    explain: 'La palabra correcta es <b>'+item.word+'</b>.',
  };
}

export function genComprensionRound(){
  const item = pick(COMPRENSION_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts,
    correctValue: item.correct,
    speakText: item.text,
    cols: 4,
    explain: 'Vuelve a leer: "'+item.text+'" Ahí está la respuesta.',
  };
}

export function genCombinacionRound(){
  const item = pick(COMBO_WORDS);
  const distract = shuffle(ALL_COMBOS.filter(function(c){ return c!==item.combo; })).slice(0,3);
  const opts = shuffle([item.combo].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span>'+
      '<p class="prompt-word">'+item.before+'<span class="blank">_</span>'+item.after+'</p>'+
      '<p class="prompt-hint">¿Qué combinación completa la palabra?</p>',
    options: opts,
    correctValue: item.combo,
    speakText: item.before+item.combo+item.after,
    cols: 4,
    explain: 'La palabra es <b>'+item.before+item.combo+item.after+'</b>.',
  };
}

/* ---------------- Contenido Lenguaje 2° Básico: Gramática y Comprensión II ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/2-basico):
   Gramática -> OA19 (función de artículos, sustantivos y adjetivos) y OA20
   (concordancia de género y número). Comprensión II -> OA03, OA05, OA07
   (estrategias de comprensión, narraciones con inferencia, textos no literarios). */
const ADJ_FORMS = [
  { base:'ALTO', M_S:'ALTO', F_S:'ALTA', M_P:'ALTOS', F_P:'ALTAS' },
  { base:'BONITO', M_S:'BONITO', F_S:'BONITA', M_P:'BONITOS', F_P:'BONITAS' },
  { base:'PEQUEÑO', M_S:'PEQUEÑO', F_S:'PEQUEÑA', M_P:'PEQUEÑOS', F_P:'PEQUEÑAS' },
  { base:'CONTENTO', M_S:'CONTENTO', F_S:'CONTENTA', M_P:'CONTENTOS', F_P:'CONTENTAS' },
  { base:'ORDENADO', M_S:'ORDENADO', F_S:'ORDENADA', M_P:'ORDENADOS', F_P:'ORDENADAS' },
];
const SUJETOS_CONCORDANCIA = [
  { texto:'La niña', genero:'F', numero:'S' },
  { texto:'El niño', genero:'M', numero:'S' },
  { texto:'Las niñas', genero:'F', numero:'P' },
  { texto:'Los niños', genero:'M', numero:'P' },
  { texto:'La gata', genero:'F', numero:'S' },
  { texto:'El gato', genero:'M', numero:'S' },
  { texto:'Los perros', genero:'M', numero:'P' },
  { texto:'Las mesas', genero:'F', numero:'P' },
];
const ORACIONES_GRAMATICA = [
  { texto:'El gato negro corre', sustantivo:'GATO', adjetivo:'NEGRO', otras:['EL','CORRE'] },
  { texto:'La casa grande brilla', sustantivo:'CASA', adjetivo:'GRANDE', otras:['LA','BRILLA'] },
  { texto:'Un perro pequeño ladra', sustantivo:'PERRO', adjetivo:'PEQUEÑO', otras:['UN','LADRA'] },
  { texto:'Las flores bonitas crecen', sustantivo:'FLORES', adjetivo:'BONITAS', otras:['LAS','CRECEN'] },
  { texto:'El pájaro azul canta', sustantivo:'PÁJARO', adjetivo:'AZUL', otras:['EL','CANTA'] },
  { texto:'La niña feliz salta', sustantivo:'NIÑA', adjetivo:'FELIZ', otras:['LA','SALTA'] },
];

export function genGramatica2Round(){
  if(Math.random()<0.5){
    const suj = pick(SUJETOS_CONCORDANCIA);
    const adj = pick(ADJ_FORMS);
    const correct = adj[suj.genero+'_'+suj.numero];
    const allForms = [adj.M_S, adj.F_S, adj.M_P, adj.F_P].filter(function(f,i,arr){ return arr.indexOf(f)===i; });
    const distract = allForms.filter(function(f){ return f!==correct; });
    const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+suj.texto+' es muy <span class="blank">___</span>.</p><p class="prompt-hint">¿Qué palabra completa la oración?</p>',
      options: opts, correctValue: correct, speakText: suj.texto+' es muy...', cols:4, kind:'word',
      explain: '"'+suj.texto+'" concuerda con <b>'+correct+'</b> en género y número.',
    };
  }
  const item = pick(ORACIONES_GRAMATICA);
  const askSustantivo = Math.random()<0.5;
  const correct = askSustantivo ? item.sustantivo : item.adjetivo;
  const otherTarget = askSustantivo ? item.adjetivo : item.sustantivo;
  const opts = shuffle([correct, otherTarget].concat(item.otras).map(function(w){ return w.toUpperCase(); })).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.texto+'"</p><p class="prompt-hint">¿Cuál palabra es el '+(askSustantivo ? 'sustantivo (nombra a alguien o algo)' : 'adjetivo (dice cómo es)')+'?</p>',
    options: opts, correctValue: correct, speakText: item.texto, cols:4, kind:'word',
    explain: '<b>'+correct+'</b> es el '+(askSustantivo ? 'sustantivo' : 'adjetivo')+' de la oración.',
  };
}

const COMPRENSION2_BANK = [
  { text:'Tomás salió a jugar con su pelota nueva, pero al llegar al patio el cielo se puso gris y empezó a caer agua.', question:'¿Por qué Tomás probablemente no pudo jugar afuera?', correct:'🌧️', opts:['☀️','🌙','🎈'], reason:'El cielo gris y el agua cayendo son señales de que estaba lloviendo.' },
  { text:'Carla llegó a la escuela agitada, con la cara roja y respirando fuerte.', question:'¿Qué hizo Carla probablemente antes de llegar?', correct:'🏃', opts:['😴','📖','🍽️'], reason:'Estar agitada y con la cara roja son señales de que corrió.' },
  { text:'Para plantar una semilla: primero cava un hoyo pequeño en la tierra, luego coloca la semilla adentro, y por último tápala con tierra y riégala con agua.', question:'¿Qué haces primero para plantar una semilla?', correct:'Cavar un hoyo', opts:['Regarla con agua','Taparla con tierra','Colocar la semilla'], reason:'El texto dice "primero cava un hoyo".' },
  { text:'Los niños entraron a la casa mojados de pies a cabeza, sacudiendo un paraguas roto.', question:'¿Qué probablemente pasó con el paraguas?', correct:'Se rompió con el viento', opts:['Lo dejaron en la escuela','Lo regalaron','No lo usaron'], reason:'Un paraguas roto y niños mojados sugieren que el viento lo rompió mientras llovía.' },
  { text:'Para lavarte las manos correctamente: moja tus manos, ponte jabón, frota por 20 segundos, y enjuaga con agua.', question:'¿Qué haces justo después de mojarte las manos?', correct:'Ponerte jabón', opts:['Enjuagar con agua','Frotar 20 segundos','Secarte las manos'], reason:'El texto dice que después de mojar las manos, sigue "ponte jabón".' },
  { text:'Martina abrió su lonchera y encontró que el helado que guardó en la mañana ahora era solo un líquido.', question:'¿Qué probablemente le pasó al helado?', correct:'Se derritió por el calor', opts:['Se lo comió otro niño','Se congeló más','Cambió de sabor'], reason:'Un helado que pasa de sólido a líquido es porque se derritió con el calor.' },
  { text:'El perro escondió su hueso debajo de un mueble y movía la cola muy rápido mientras cavaba con las patas.', question:'¿Cómo se sentía probablemente el perro?', correct:'Contento y emocionado', opts:['Triste','Con mucho miedo','Aburrido'], reason:'Mover la cola rápido es una señal de que un perro está contento.' },
  { text:'Para hacer una ensalada de frutas: lava las frutas, córtalas en trozos pequeños, mézclalas en un bowl y sírvelas frías.', question:'¿Qué haces justo antes de mezclar las frutas?', correct:'Cortarlas en trozos', opts:['Lavarlas','Servirlas frías','Comprarlas'], reason:'El texto dice: lavar, luego cortar, y luego mezclar.' },
];

export function genComprension2Round(){
  const item = pick(COMPRENSION2_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const kind = /^[A-ZÁÉÍÓÚÑ]/.test(item.correct) ? 'word' : undefined;
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols: kind ? 2 : 4, kind: kind, panel: kind==='word',
    explain: item.reason,
  };
}

/* ---------------- Contenido Lenguaje 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/3-basico):
   Géneros Literarios -> OA03. Comprensión -> OA02,04,05,06 (estrategias de
   comprensión, narraciones con inferencia, lenguaje figurado simple, textos
   no literarios). Vocabulario en Contexto -> OA10. Orden Alfabético -> OA11.
   Gramática -> OA20 (sustantivo/adjetivo/artículo) y OA21 (pronombres).
   Ortografía -> OA22 (mayúsculas y signos de puntuación).
   Quedan fuera: OA01 (lectura oral fluida), OA07-09 (gusto por la lectura,
   biblioteca, investigación en fuentes — actitudinales o de proceso),
   OA12-19 (producción escrita: cuentos, cartas, planificación, revisión —
   producción propia, no reconocimiento), OA23-31 (comunicación oral:
   escuchar narraciones, teatro, conversación, presentarse, recitar —
   requieren desempeño oral real). */
export const LENGUAJE_MODULES_G3 = [
  {id:'generosliterarios3', label:'Géneros Literarios', open:true, key:'generosliterarios3'},
  {id:'comprension3', label:'Comprensión III', open:true, key:'comprension3'},
  {id:'vocabulario3', label:'Vocabulario en Contexto', open:true, key:'vocabulario3'},
  {id:'alfabetico3', label:'Orden Alfabético', open:true, key:'alfabetico3'},
  {id:'gramatica3', label:'Gramática III', open:true, key:'gramatica3'},
  {id:'ortografia3', label:'Ortografía', open:true, key:'ortografia3'},
];
export const LENGUAJE_POS_G3 = [{x:22,y:92},{x:68,y:78},{x:24,y:62},{x:70,y:46},{x:24,y:28},{x:70,y:10}];

const GENEROS_BANK = [
  { desc:'Un texto breve con ritmo y a veces con rima, que expresa sentimientos.', label:'POEMA' },
  { desc:'Texto que usa versos, y a veces rima, para expresar una emoción.', label:'POEMA' },
  { desc:'Una historia corta e inventada, con personajes que enfrentan un problema y lo resuelven.', label:'CUENTO' },
  { desc:'Una historia breve con animales que hablan y actúan como personas, y que termina con una enseñanza.', label:'FÁBULA' },
  { desc:'Un cuento donde los animales hablan para enseñarnos una moraleja.', label:'FÁBULA' },
  { desc:'Una historia tradicional que se cuenta de generación en generación, mezclando hechos reales con elementos fantásticos.', label:'LEYENDA' },
  { desc:'Una historia antigua que explica el origen del mundo o de la naturaleza, protagonizada por dioses o héroes.', label:'MITO' },
  { desc:'Una historia larga, dividida en capítulos, con varios personajes y una trama que se desarrolla poco a poco.', label:'NOVELA' },
  { desc:'Una historia contada con dibujos en secuencia y globos de diálogo.', label:'HISTORIETA' },
  { desc:'Relato que se lee como una serie de viñetas con imágenes y texto.', label:'HISTORIETA' },
];
const GENEROS_POOL = ['POEMA','CUENTO','FÁBULA','LEYENDA','MITO','NOVELA','HISTORIETA'];

const COMPRENSION3_BANK = [
  { text:'Sofía leyó las instrucciones del juego dos veces antes de empezar a jugar.', question:'¿Por qué Sofía leyó las instrucciones dos veces?', correct:'Para entender bien cómo se juega antes de empezar', opts:['Porque no sabía leer','Porque el juego no traía instrucciones','Porque quería aburrirse'], reason:'Leer con atención antes de actuar es una forma de asegurarse de entender bien algo.' },
  { text:'Para cuidar una planta de interior: ponla cerca de una ventana con luz, riégala cada 3 días y quita las hojas secas.', question:'¿Cada cuánto se debe regar la planta según el texto?', correct:'Cada 3 días', opts:['Todos los días','Una vez al mes','Solo cuando se seque completamente'], reason:'El texto lo dice explícitamente: "riégala cada 3 días".' },
  { text:"Cuando Pedro se enteró de la sorpresa, sintió que el corazón le daba saltos de alegría.", question:"¿Qué quiere decir la frase 'el corazón le daba saltos de alegría'?", correct:'Que estaba muy feliz y emocionado', opts:['Que su corazón literalmente saltaba','Que estaba haciendo ejercicio','Que tenía miedo'], reason:'Es una forma de decir que sintió mucha alegría, no que su corazón saltara de verdad — eso es lenguaje figurado.' },
  { text:'Los bomberos llegaron rápido, apagaron el fuego y revisaron que no quedaran brasas encendidas.', question:'¿Qué hicieron los bomberos después de apagar el fuego?', correct:'Revisaron que no quedaran brasas encendidas', opts:['Se fueron de inmediato','Encendieron más fuego','Llamaron a más bomberos'], reason:'El texto dice el orden: apagar y luego revisar que no queden brasas.' },
  { text:'Valentina practicó su presentación frente al espejo cinco veces antes de exponer en clases.', question:'¿Qué podemos inferir sobre Valentina?', correct:'Se preparó bien para su presentación', opts:['No le importaba la nota','Se aburrió de estudiar','No sabía de qué hablar'], reason:'Practicar varias veces antes de una presentación muestra que se preparó con dedicación.' },
  { text:'Antes de cruzar la calle: detente en la vereda, mira a ambos lados, y cruza solo cuando no vengan autos.', question:'¿Qué debes hacer primero antes de cruzar la calle?', correct:'Detenerte en la vereda', opts:['Cruzar corriendo','Mirar el celular','Cerrar los ojos'], reason:'El texto dice el primer paso: "detente en la vereda".' },
  { text:'Después de estudiar toda la semana para la prueba, Joaquín se sentía como si tuviera alas para volar.', question:"¿Qué significa 'sentía como si tuviera alas para volar'?", correct:'Que se sentía muy liviano, feliz y aliviado', opts:['Que literalmente podía volar','Que estaba muy cansado','Que tenía sueño'], reason:'Es una comparación (lenguaje figurado) para expresar que se sentía muy bien, no que tuviera alas de verdad.' },
  { text:'El perro de Martina empezó a ladrar y a rascar la puerta apenas escuchó el timbre.', question:'¿Por qué el perro reaccionó así?', correct:'Porque escuchó el timbre y avisó que alguien llegó', opts:['Porque tenía hambre','Porque quería dormir','Porque estaba enojado con Martina'], reason:'El texto conecta la reacción del perro directamente con el sonido del timbre.' },
  { text:'Recién Tomás terminó su tarea de matemáticas, guardó los cuadernos y se fue a jugar con su pelota.', question:'¿Qué hizo Tomás justo después de terminar la tarea?', correct:'Guardó los cuadernos', opts:['Se fue a dormir','Empezó otra tarea','Salió sin avisar'], reason:'El texto dice el orden: terminó la tarea, guardó los cuadernos, y luego jugó.' },
  { text:'Cuando el equipo de Renata ganó el partido, ella sintió que el estómago se le llenó de mariposas.', question:"¿Qué significa que 'el estómago se le llenó de mariposas'?", correct:'Que sintió muchos nervios y emoción', opts:['Que se comió unas mariposas','Que le dolía el estómago','Que tenía hambre'], reason:'Es una expresión de lenguaje figurado para describir una sensación de nervios y emoción, no mariposas reales.' },
];

const VOCABULARIO3_BANK = [
  { texto:'Después de subir la montaña, el grupo llegó ', palabra:'EXHAUSTO', resto:' al campamento.', significado:'Muy cansado', opts:['Muy alegre','Con mucho frío','Muy asustado'] },
  { texto:'El mago hizo un truco tan ', palabra:'ASOMBROSO', resto:' que todos aplaudieron sorprendidos.', significado:'Que sorprende mucho', opts:['Aburrido','Muy simple','Peligroso'] },
  { texto:'La biblioteca estaba en ', palabra:'PENUMBRA', resto:' porque se había cortado la luz.', significado:'Poca luz, casi oscuro', opts:['Mucha luz','Lleno de gente','Muy ordenado'] },
  { texto:'El cachorro era tan ', palabra:'DIMINUTO', resto:' que cabía en la palma de la mano.', significado:'Muy pequeño', opts:['Muy grande','Muy ruidoso','Muy rápido'] },
  { texto:'El científico observó el experimento con gran ', palabra:'CAUTELA', resto:' para no equivocarse.', significado:'Cuidado y precaución', opts:['Rapidez sin pensar','Aburrimiento','Enojo'] },
  { texto:'La noticia del premio lo dejó ', palabra:'ATÓNITO', resto:', sin poder decir ni una palabra.', significado:'Muy sorprendido', opts:['Muy enojado','Con sueño','Aburrido'] },
  { texto:'El camino hacia el pueblo era largo y ', palabra:'SINUOSO', resto:', lleno de curvas.', significado:'Con muchas curvas', opts:['Muy recto','Muy corto','Muy ancho'] },
  { texto:'Después de la tormenta, el cielo quedó ', palabra:'DESPEJADO', resto:' y soleado.', significado:'Sin nubes', opts:['Muy nublado','Lleno de lluvia','Con mucho viento'] },
  { texto:'El abuelo contaba historias con una voz ', palabra:'PAUSADA', resto:' y tranquila.', significado:'Lenta y calmada', opts:['Muy rápida','Muy fuerte y gritona','Muy aguda'] },
  { texto:'La receta pedía una ', palabra:'PIZCA', resto:' de sal, apenas un poquito.', significado:'Una cantidad muy pequeña', opts:['Una cantidad enorme','La mitad del total','Ninguna cantidad'] },
];

const ALFABETICO_POOL = ['ARDILLA','BALLENA','CABALLO','DELFÍN','ELEFANTE','FOCA','GATO','HORMIGA','IGUANA','JIRAFA','KOALA','LEÓN','MARIPOSA','NUTRIA','OSO','PATO'];

const ORACIONES_GRAMATICA_G3 = [
  { texto:'El gato negro corre', articulo:'EL', sustantivo:'GATO', adjetivo:'NEGRO', otras:['CORRE'] },
  { texto:'La casa grande brilla', articulo:'LA', sustantivo:'CASA', adjetivo:'GRANDE', otras:['BRILLA'] },
  { texto:'Un perro pequeño ladra', articulo:'UN', sustantivo:'PERRO', adjetivo:'PEQUEÑO', otras:['LADRA'] },
  { texto:'Las flores bonitas crecen', articulo:'LAS', sustantivo:'FLORES', adjetivo:'BONITAS', otras:['CRECEN'] },
  { texto:'El pájaro azul canta', articulo:'EL', sustantivo:'PÁJARO', adjetivo:'AZUL', otras:['CANTA'] },
  { texto:'Una niña feliz salta', articulo:'UNA', sustantivo:'NIÑA', adjetivo:'FELIZ', otras:['SALTA'] },
];
const PRONOMBRES_BANK = [
  { texto:'Los niños jugaban en el patio. ___ se divertían mucho.', correcto:'ELLOS' },
  { texto:'Mi hermana estudia mucho. ___ quiere ser doctora.', correcto:'ELLA' },
  { texto:'El profesor explicó la tarea. ___ fue muy claro.', correcto:'ÉL' },
  { texto:'Las flores del jardín son hermosas. ___ tienen muchos colores.', correcto:'ELLAS' },
  { texto:'Tomás y yo iremos al cine. ___ compraremos palomitas.', correcto:'NOSOTROS' },
  { texto:'Mi abuela cocina muy rico. ___ hace pasteles los domingos.', correcto:'ELLA' },
  { texto:'Los pájaros cantan en la mañana. ___ despiertan a todos.', correcto:'ELLOS' },
  { texto:'Mi papá arregla el auto. ___ sabe mucho de mecánica.', correcto:'ÉL' },
];
const PRONOMBRES_POOL = ['ÉL','ELLA','ELLOS','ELLAS','NOSOTROS'];

/* "Hoy es Lunes"→"lunes" enseña una regla real y no intuitiva: en español los
   días de la semana NO llevan mayúscula (a diferencia del inglés). */
const ORTOGRAFIA_BANK = [
  { incorrecta:'los niños juegan en el parque', correcta:'Los niños juegan en el parque.' },
  { incorrecta:'maria vive en santiago', correcta:'María vive en Santiago.' },
  { incorrecta:'Hoy es Lunes.', correcta:'Hoy es lunes.' },
  { incorrecta:'mi perro se llama rocky', correcta:'Mi perro se llama Rocky.' },
  { incorrecta:'Qué día es hoy', correcta:'¿Qué día es hoy?' },
  { incorrecta:'Qué sorpresa tan linda', correcta:'¡Qué sorpresa tan linda!' },
  { incorrecta:'vamos a la playa el sábado', correcta:'Vamos a la playa el sábado.' },
  { incorrecta:'el río mapocho pasa por santiago', correcta:'El río Mapocho pasa por Santiago.' },
  { incorrecta:'pedro y ana son hermanos', correcta:'Pedro y Ana son hermanos.' },
  { incorrecta:'chile es un país largo y angosto', correcta:'Chile es un país largo y angosto.' },
];

/* Artículo correcto por género gramatical, para no dejar el literal "un(a)"
   sin resolver en el explain (bug encontrado en la auditoría 2026-07-22). */
const GENERO_ARTICULO = { POEMA:'un', CUENTO:'un', FÁBULA:'una', LEYENDA:'una', MITO:'un', NOVELA:'una', HISTORIETA:'una' };
export function genGenerosLiterarios3Round(){
  const item = pick(GENEROS_BANK);
  const distract = shuffle(GENEROS_POOL.filter(function(g){ return g!==item.label; })).slice(0,3);
  const opts = shuffle([item.label].concat(distract)).map(function(g){ return {label:g, value:g}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'</p><p class="prompt-hint">¿Qué género literario es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa descripción corresponde a '+GENERO_ARTICULO[item.label]+' <b>'+item.label.toLowerCase()+'</b>.',
  };
}

export function genComprension3Round(){
  const item = pick(COMPRENSION3_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
    explain: item.reason,
  };
}

export function genVocabulario3Round(){
  const item = pick(VOCABULARIO3_BANK);
  const opts = shuffle([item.significado].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'<b>'+item.palabra+'</b>'+item.resto+'</p><p class="prompt-hint">¿Qué significa la palabra <b>'+item.palabra.toLowerCase()+'</b>?</p>',
    options: opts, correctValue: item.significado, speakText: item.texto+item.palabra+item.resto, cols:2, panel:true,
    explain: '<b>'+item.palabra+'</b> significa "'+item.significado.toLowerCase()+'".',
  };
}

export function genAlfabetico3Round(){
  const words = shuffle(ALFABETICO_POOL).slice(0,4);
  const sorted = words.slice().sort();
  const askFirst = Math.random()<0.5;
  const correct = askFirst ? sorted[0] : sorted[sorted.length-1];
  const opts = shuffle(words).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:22px;">'+words.join(' — ')+'</p><p class="prompt-hint">¿Cuál de estas palabras aparece '+(askFirst?'PRIMERO':'AL FINAL')+' en el orden alfabético?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál palabra va '+(askFirst?'primero':'al final')+' en orden alfabético?', cols:4, kind:'word',
    explain: 'En orden alfabético: '+sorted.join(' → ')+'. La respuesta '+(askFirst?'que va primero':'que va al final')+' es <b>'+correct+'</b>.',
  };
}

export function genGramatica3Round(){
  if(Math.random()<0.5){
    const item = pick(ORACIONES_GRAMATICA_G3);
    const roll = Math.random();
    const kind = roll<0.34 ? 'sustantivo' : (roll<0.67 ? 'adjetivo' : 'articulo');
    const correct = item[kind];
    const otherTargets = ['sustantivo','adjetivo','articulo'].filter(function(k){ return k!==kind; }).map(function(k){ return item[k]; });
    const opts = shuffle(otherTargets.concat(item.otras).concat([correct]).map(function(w){ return w.toUpperCase(); })).map(function(w){ return {label:w, value:w}; });
    const kindLabel = kind==='sustantivo' ? 'sustantivo (nombra a alguien o algo)' : kind==='adjetivo' ? 'adjetivo (dice cómo es)' : 'artículo (el/la/un/una/los/las)';
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.texto+'"</p><p class="prompt-hint">¿Cuál palabra es el '+kindLabel+'?</p>',
      options: opts, correctValue: correct, speakText: item.texto, cols:4, kind:'word',
      explain: '<b>'+correct+'</b> es el '+kind+' de la oración.',
    };
  }
  const item = pick(PRONOMBRES_BANK);
  const distract = shuffle(PRONOMBRES_POOL.filter(function(p){ return p!==item.correcto; })).slice(0,3);
  const opts = shuffle([item.correcto].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Qué pronombre completa la oración?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace('___', item.correcto), cols:4, kind:'word',
    explain: 'El pronombre correcto es <b>'+item.correcto+'</b>, porque reemplaza a quien se menciona en la primera oración.',
  };
}

export function genOrtografia3Round(){
  const item = pick(ORTOGRAFIA_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: 'La forma correcta es: "'+item.correcta+'"',
  };
}

/* ---------------- Contenido Lenguaje 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/4-basico):
   Comprensión IV -> OA02-06 (estrategias de comprensión, géneros literarios,
   consecuencias e inferencia en narraciones, lenguaje figurado, textos no
   literarios — géneros literarios se integra como un tercer ángulo de esta
   misma pregunta en vez de repetir el módulo "Géneros Literarios" ya
   construido para 3° básico con contenido casi idéntico). Vocabulario en
   Contexto II -> OA10 (ahora incluye el ángulo de prefijos/sufijos, no solo
   sinónimo por contexto). Gramática IV -> OA19-20 (adverbios y verbos,
   concordancia sujeto-verbo). Ortografía II -> OA21 (b/v, h, ay/hay/ahí,
   acentuación — reglas distintas de las de Ortografía de 3° básico, que
   cubría mayúsculas y signos de puntuación).
   Quedan fuera: OA01 (lectura oral fluida), OA07-09 (gusto por la lectura,
   biblioteca, buscar información en fuentes — actitudinales o de proceso),
   OA11-18 (producción escrita: cuentos, cartas, planificación, revisión),
   OA22-30 (comunicación oral: escuchar narraciones, teatro, conversación,
   recitar) — todos requieren desempeño real o producción propia. */
export const LENGUAJE_MODULES_G4 = [
  {id:'comprension4', label:'Comprensión IV', open:true, key:'comprension4'},
  {id:'vocabulario4', label:'Vocabulario en Contexto II', open:true, key:'vocabulario4'},
  {id:'gramatica4', label:'Gramática IV', open:true, key:'gramatica4'},
  {id:'ortografia4', label:'Ortografía II', open:true, key:'ortografia4'},
];
export const LENGUAJE_POS_G4 = [{x:22,y:88},{x:68,y:64},{x:24,y:38},{x:70,y:12}];

const COMPRENSION4_BANK = [
  { text:'Diego dejó su bicicleta afuera durante toda la noche de tormenta, y al día siguiente encontró óxido en la cadena.', question:'¿Por qué la cadena se oxidó?', correct:'Porque quedó expuesta a la lluvia toda la noche', opts:['Porque era una bicicleta nueva','Porque Diego la lavó con jabón','Porque la guardó en su pieza'], reason:'La lluvia sobre el metal durante horas es lo que produce el óxido.' },
  { text:'Para cuidar tus dientes: cepíllalos después de cada comida, usa hilo dental una vez al día y visita al dentista cada 6 meses.', question:'¿Cada cuánto se recomienda visitar al dentista?', correct:'Cada 6 meses', opts:['Cada semana','Una vez al año','Solo cuando duele'], reason:'El texto lo dice explícitamente: "visita al dentista cada 6 meses".' },
  { text:'Cuando el equipo de Martina anotó el gol decisivo, ella sintió que le explotaba el corazón de la emoción.', question:"¿Qué significa 'le explotaba el corazón de la emoción'?", correct:'Que sintió una emoción muy intensa', opts:['Que su corazón dejó de latir','Que se lastimó el pecho','Que sintió mucho frío'], reason:'Es lenguaje figurado para describir una emoción muy fuerte, no un hecho literal.' },
  { text:'El explorador avanzaba con pasos de gigante por la selva, decidido a llegar antes del anochecer.', question:"¿Qué significa que avanzaba 'con pasos de gigante'?", correct:'Que caminaba muy rápido, con pasos largos y decididos', opts:['Que era literalmente un gigante','Que caminaba muy despacio','Que se perdió en la selva'], reason:'Es una comparación (lenguaje figurado) para expresar rapidez y decisión.' },
  { text:'Rodrigo practicó su triple salto todos los días durante un mes antes de la competencia regional.', question:'¿Qué podemos inferir sobre Rodrigo?', correct:'Que se preparó con dedicación y disciplina para competir', opts:['Que no le interesaba ganar','Que improvisó el día de la competencia','Que se aburrió de entrenar'], reason:'Practicar todos los días durante un mes muestra dedicación y disciplina.' },
  { text:'Para armar un velero de papel: dobla la hoja por la mitad, forma un triángulo en cada extremo, y despliega las alas del barco.', question:'¿Qué haces primero para armar el velero?', correct:'Doblar la hoja por la mitad', opts:['Desplegar las alas del barco','Formar los triángulos','Recortar la hoja en cuadrados'], reason:'El texto indica el primer paso: "dobla la hoja por la mitad".' },
  { text:'Un cuento corto donde un zorro astuto engaña a un cuervo para que suelte su queso, y termina con una moraleja sobre la vanidad.', question:'¿Qué género literario es este texto?', correct:'FÁBULA', opts:['NOVELA','HISTORIETA','MITO'], reason:'Es una fábula: animales que actúan como personas y una moraleja al final.' },
  { text:'Una historia extensa dividida en 20 capítulos, que sigue las aventuras de varios personajes a lo largo de varios años.', question:'¿Qué género literario es este texto?', correct:'NOVELA', opts:['POEMA','FÁBULA','HISTORIETA'], reason:'Una historia larga dividida en capítulos es una novela.' },
  { text:'Una historia antigua que explica por qué el sol cruza el cielo cada día, protagonizada por un dios que conduce un carro de fuego.', question:'¿Qué género literario es este texto?', correct:'MITO', opts:['HISTORIETA','NOVELA','FÁBULA'], reason:'Un relato antiguo con dioses que explica un fenómeno natural es un mito.' },
  { text:'Camila guardaba sus ahorros en una alcancía en forma de cerdo, contando las monedas cada domingo antes de dormir.', question:'¿Qué podemos inferir sobre Camila?', correct:'Que es cuidadosa y constante con sus ahorros', opts:['Que gasta todo su dinero de inmediato','Que no le interesa el dinero','Que perdió su alcancía'], reason:'Contar sus ahorros cada semana muestra que es constante y cuidadosa con el dinero.' },
];

/* Además de sinónimo-por-contexto (como en Vocabulario de 3° básico), se
   agrega el ángulo de prefijos/sufijos que menciona explícitamente OA10:
   cómo un prefijo cambia el significado de una palabra base. */
const VOCABULARIO4_CONTEXTO_BANK = [
  { texto:'El científico hizo un ', palabra:'MINUCIOSO', resto:' análisis de cada muestra, revisando cada detalle.', significado:'Muy detallado y cuidadoso', opts:['Muy rápido y descuidado','Aburrido','Peligroso'] },
  { texto:'La actriz recibió una ', palabra:'OVACIÓN', resto:' del público al terminar la obra.', significado:'Un aplauso largo y entusiasta', opts:['Una crítica negativa','Un silencio incómodo','Una pregunta'] },
  { texto:'El terreno era tan ', palabra:'ÁRIDO', resto:' que casi ninguna planta lograba crecer ahí.', significado:'Muy seco, con poca agua', opts:['Muy húmedo y fértil','Cubierto de nieve','Lleno de árboles'] },
  { texto:'Su respuesta fue tan ', palabra:'AMBIGUA', resto:' que nadie entendió si estaba de acuerdo o no.', significado:'Que se puede entender de más de una forma', opts:['Muy clara y directa','Muy grosera','Muy larga'] },
  { texto:'El abuelo era conocido por su ', palabra:'GENEROSIDAD', resto:', siempre dispuesto a ayudar sin esperar nada a cambio.', significado:'La cualidad de dar y compartir con otros', opts:['La cualidad de guardar todo para sí mismo','El miedo a las alturas','La costumbre de dormir temprano'] },
];
const PREFIJOS_BANK = [
  { prefijo:'DES-', ejemplo:'DESHACER', significadoPrefijo:'Indica que se deshace o revierte la acción', base:'HACER' },
  { prefijo:'RE-', ejemplo:'REHACER', significadoPrefijo:'Indica que la acción se repite', base:'HACER' },
  { prefijo:'IN-', ejemplo:'INCAPAZ', significadoPrefijo:'Indica negación: que no tiene esa cualidad', base:'CAPAZ' },
  { prefijo:'PRE-', ejemplo:'PRECALENTAR', significadoPrefijo:'Indica que la acción ocurre antes', base:'CALENTAR' },
  { prefijo:'SUB-', ejemplo:'SUBMARINO', significadoPrefijo:'Indica que algo está debajo de', base:'MARINO' },
];

const ADVERBIOS_BANK = [
  { texto:'Caminaba LENTAMENTE por el parque.', palabra:'LENTAMENTE', tipo:'ADVERBIO DE MODO' },
  { texto:'Llegaremos MAÑANA a la ciudad.', palabra:'MAÑANA', tipo:'ADVERBIO DE TIEMPO' },
  { texto:'El gato duerme AQUÍ todas las tardes.', palabra:'AQUÍ', tipo:'ADVERBIO DE LUGAR' },
  { texto:'Comió MUCHO en el almuerzo.', palabra:'MUCHO', tipo:'ADVERBIO DE CANTIDAD' },
  { texto:'Ella canta MARAVILLOSAMENTE en el coro.', palabra:'MARAVILLOSAMENTE', tipo:'ADVERBIO DE MODO' },
  { texto:'Nos vemos AYER en la tarde.', palabra:'AYER', tipo:'ADVERBIO DE TIEMPO' },
  { texto:'El perro corre ALLÍ, cerca del árbol.', palabra:'ALLÍ', tipo:'ADVERBIO DE LUGAR' },
  { texto:'Estudió POCO para la prueba de mañana.', palabra:'POCO', tipo:'ADVERBIO DE CANTIDAD' },
];
const VERBOS_CONCORDANCIA_BANK = [
  { texto:'Los niños ___ en el patio.', correcto:'JUEGAN', malas:['JUEGA','JUEGO','JUGAMOS'] },
  { texto:'Mi hermana ___ todos los días al colegio.', correcto:'CAMINA', malas:['CAMINAN','CAMINO','CAMINAMOS'] },
  { texto:'Nosotros ___ un libro nuevo cada mes.', correcto:'LEEMOS', malas:['LEE','LEEN','LEO'] },
  { texto:'Yo ___ mi pieza todos los sábados.', correcto:'ORDENO', malas:['ORDENA','ORDENAN','ORDENAMOS'] },
  { texto:'Las plantas ___ agua para crecer.', correcto:'NECESITAN', malas:['NECESITA','NECESITO','NECESITAMOS'] },
];

/* Ortografía de 4° básico cubre reglas distintas a las de 3° básico
   (mayúsculas/puntuación): b/v, h muda, ay/hay/ahí, y acentuación. */
const ORTOGRAFIA4_BANK = [
  { incorrecta:'El pájaro bolo muy alto', correcta:'El pájaro voló muy alto', regla:'Se escribe con V: "voló" (de volar), no con B.' },
  { incorrecta:'Ella iva a la escuela caminando', correcta:'Ella iba a la escuela caminando', regla:'Se escribe con B: "iba" (del verbo ir en pasado).' },
  { incorrecta:'Ay una fiesta en la plaza', correcta:'Hay una fiesta en la plaza', regla:'Se escribe "hay" (del verbo haber, indica que algo existe), no "ay".' },
  { incorrecta:'No se donde deje mis llaves, hay están', correcta:'No sé dónde dejé mis llaves, ahí están', regla:'Se escribe "ahí" (lugar), no "hay" ni "ay".' },
  { incorrecta:'Ella tiene un armonica nueva', correcta:'Ella tiene una armónica nueva', regla:'Lleva tilde: "armónica" es una palabra esdrújula.' },
  { incorrecta:'El arbol del patio es muy alto', correcta:'El árbol del patio es muy alto', regla:'Lleva tilde: "árbol" es una palabra grave (el golpe de voz va en la penúltima sílaba) que termina en una consonante distinta de N o S, así que se acentúa.' },
  { incorrecta:'ay mucha gente en el estadio', correcta:'Hay mucha gente en el estadio', regla:'Se escribe "hay" (del verbo haber), no "ay".' },
  { incorrecta:'Los niños ivan corriendo al recreo', correcta:'Los niños iban corriendo al recreo', regla:'Se escribe con B: "iban" (del verbo ir en pasado).' },
  { incorrecta:'La ambulancia llego rapido', correcta:'La ambulancia llegó rápido', regla:'Llevan tilde: "llegó" y "rápido".' },
  { incorrecta:'Habia una vez un rey muy sabio', correcta:'Había una vez un rey muy sabio', regla:'Se escribe con B: "había" (del verbo haber).' },
];

export function genComprension4Round(){
  const item = pick(COMPRENSION4_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const kind = /^[A-ZÁÉÍÓÚÑ]/.test(item.correct) ? 'word' : undefined;
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols: kind?2:2, kind: kind, panel:true,
    explain: item.reason,
  };
}

export function genVocabulario4Round(){
  if(Math.random()<0.5){
    const item = pick(VOCABULARIO4_CONTEXTO_BANK);
    const opts = shuffle([item.significado].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'<b>'+item.palabra+'</b>'+item.resto+'</p><p class="prompt-hint">¿Qué significa la palabra <b>'+item.palabra.toLowerCase()+'</b>?</p>',
      options: opts, correctValue: item.significado, speakText: item.texto+item.palabra+item.resto, cols:2, panel:true,
      explain: '<b>'+item.palabra+'</b> significa "'+item.significado.toLowerCase()+'".',
    };
  }
  const item = pick(PREFIJOS_BANK);
  const distract = shuffle(PREFIJOS_BANK.filter(function(p){ return p.prefijo!==item.prefijo; })).slice(0,3).map(function(p){ return p.significadoPrefijo; });
  const opts = shuffle([item.significadoPrefijo].concat(distract)).map(function(s){ return {label:s, value:s}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.ejemplo+'</p><p class="prompt-hint">La palabra base es "'+item.base.toLowerCase()+'". ¿Qué indica el prefijo "'+item.prefijo.toLowerCase()+'" en esta palabra?</p>',
    options: opts, correctValue: item.significadoPrefijo, speakText: item.ejemplo, cols:2, panel:true,
    explain: 'El prefijo "'+item.prefijo.toLowerCase()+'" '+item.significadoPrefijo.toLowerCase()+'.',
  };
}

export function genGramatica4Round(){
  if(Math.random()<0.5){
    const item = pick(ADVERBIOS_BANK);
    const distract = shuffle(['ADVERBIO DE MODO','ADVERBIO DE TIEMPO','ADVERBIO DE LUGAR','ADVERBIO DE CANTIDAD'].filter(function(t){ return t!==item.tipo; }));
    const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto.replace(item.palabra,'<b>'+item.palabra+'</b>')+'</p><p class="prompt-hint">¿Qué tipo de adverbio es la palabra en negrita?</p>',
      options: opts, correctValue: item.tipo, speakText: item.texto, cols:2, panel:true,
      explain: '"'+item.palabra+'" es un <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(VERBOS_CONCORDANCIA_BANK);
  const opts = shuffle([item.correcto].concat(item.malas)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Qué verbo completa correctamente la oración?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace('___', item.correcto), cols:4, kind:'word',
    explain: '<b>'+item.correcto+'</b> concuerda correctamente con el sujeto de la oración.',
  };
}

export function genOrtografia4Round(){
  const item = pick(ORTOGRAFIA4_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla,
  };
}

/* ---------------- Contenido Lenguaje 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/5-basico):
   Comprensión V -> OA02,04,06-08 (estrategias de comprensión con 4 ángulos:
   inferencia narrativa, comprensión de texto no literario, evaluación
   crítica de la información -emisor/propósito/suficiencia- e identificar la
   idea principal de un párrafo). Recursos Poéticos -> OA05 (cómo el lenguaje
   de un poema apela a los sentidos, personificación y comparación — un
   ángulo nuevo, ninguna otra asignatura/año había ejercitado recursos
   poéticos específicos). Vocabulario y Sinónimos V -> OA12,20 (estrategias
   para el significado de palabras nuevas vía raíces/afijos/contexto, y
   distinguir matices de significado entre sinónimos — más allá de solo
   "sinónimo por contexto" ya cubierto en años anteriores). Gramática V ->
   OA21 (conjugar correctamente verbos regulares en primera/segunda/tercera
   persona y distintos tiempos). Ortografía III -> OA22 (uso de c/s/z, raya
   de diálogo y acentuación — reglas distintas a las ya cubiertas en
   Ortografía de 3° básico -mayúsculas/puntuación- y 4° básico -b/v, h,
   ay/hay/ahí-).
   Quedan fuera: OA01 (lectura oral fluida), OA03 (repertorio de géneros
   literarios — ya cubierto por "Géneros Literarios" de 3° básico, no
   repetir contenido casi idéntico), OA09-11 (gusto por la lectura,
   biblioteca, buscar información en fuentes — actitudinales o de proceso),
   OA13-19 (producción escrita: poemas, narraciones, artículos, planificación,
   revisión), OA23-30 (comunicación oral: escuchar narraciones, teatro,
   diálogo, exposición, declamación) — todos requieren desempeño real,
   producción propia o depende de audio. */
export const LENGUAJE_MODULES_G5 = [
  {id:'comprension5', label:'Comprensión V', open:true, key:'comprension5'},
  {id:'recursospoeticos5', label:'Recursos Poéticos', open:true, key:'recursospoeticos5'},
  {id:'vocabulario5', label:'Vocabulario y Sinónimos V', open:true, key:'vocabulario5'},
  {id:'gramatica5', label:'Gramática V', open:true, key:'gramatica5'},
  {id:'ortografia5', label:'Ortografía III', open:true, key:'ortografia5'},
];
export const LENGUAJE_POS_G5 = [{x:22,y:90},{x:68,y:70},{x:22,y:50},{x:68,y:30},{x:22,y:10}];

const COMPRENSION5_NARRATIVA_BANK = [
  { text:'Cuando Ignacio vio que su hermana menor lloraba porque se le rompió su juguete, le prestó el suyo sin que ella se lo pidiera.', question:'¿Qué opinión podemos formarnos de Ignacio?', correct:'Que es una persona generosa y empática', opts:['Que es una persona egoísta','Que no le importan los demás','Que le gusta romper juguetes'], reason:'Prestar su juguete sin que se lo pidan muestra generosidad y empatía hacia su hermana.' },
  { text:'La expedición llevaba tres días caminando por el desierto sin encontrar el oasis que buscaban, y el agua ya casi se les acababa.', question:'¿Qué consecuencia es más probable si no encuentran agua pronto?', correct:'Que empiecen a sufrir de sed y deban regresar', opts:['Que encuentren un supermercado','Que decidan quedarse a vivir ahí para siempre','Que el desierto se convierta en un bosque'], reason:'Sin agua en el desierto, la consecuencia lógica es sufrir sed y tener que buscar ayuda o regresar.' },
  { text:'El faro se alzaba solitario sobre el acantilado, azotado por vientos helados, mientras las olas rompían furiosas contra las rocas.', question:'¿Qué ambiente describe este fragmento?', correct:'Un lugar costero, frío y tormentoso', opts:['Una playa cálida y soleada','Un desierto tranquilo','Una ciudad llena de gente'], reason:'Las palabras "acantilado", "vientos helados" y "olas furiosas" describen un ambiente costero y tormentoso.' },
  { text:'Valentina practicó su presentación de ciencias todas las noches durante dos semanas, repitiendo cada parte frente al espejo.', question:'¿Qué podemos inferir sobre Valentina?', correct:'Que se preparó con mucha dedicación', opts:['Que improvisó todo el día de la presentación','Que no le interesaba la nota','Que se olvidó de la presentación'], reason:'Practicar todas las noches durante dos semanas muestra una dedicación notable.' },
  { text:'El anciano guardaba con cariño una vieja fotografía en blanco y negro, mirándola cada tarde antes de que oscureciera.', question:'¿Qué podemos inferir sobre esa fotografía para el anciano?', correct:'Que tiene un gran valor sentimental para él', opts:['Que la encontró esa misma tarde','Que planea botarla pronto','Que no significa nada para él'], reason:'Guardarla con cariño y mirarla cada tarde muestra que tiene un gran valor sentimental.' },
  { text:'Apenas el equipo visitante anotó el segundo gol, la mitad de las graderías se quedó en silencio mientras la otra mitad estallaba en gritos.', question:'¿Qué podemos inferir sobre los dos grupos de hinchas?', correct:'Que cada grupo apoyaba a un equipo distinto', opts:['Que a nadie le interesaba el partido','Que ambos grupos apoyaban al mismo equipo','Que el partido había terminado'], reason:'Reacciones opuestas (silencio vs. gritos de alegría) indican que apoyaban a equipos distintos.' },
  { text:'Aunque el mago aseguraba que su truco era magia real, el niño notó un hilo casi invisible atado a la carta que "flotaba".', question:'¿Qué podemos inferir sobre el truco?', correct:'Que en realidad era un truco con un hilo, no magia real', opts:['Que la magia sí era real','Que el niño estaba soñando','Que la carta volaba sola'], reason:'Notar un hilo atado a la carta sugiere que el truco tenía una explicación física, no magia.' },
  { text:'Desde que empezó a regar su huerto todos los días y a sacar las hierbas no deseadas, las plantas de tomate de Sofía crecieron el doble.', question:'¿Qué podemos inferir sobre el cuidado de Sofía?', correct:'Que su dedicación ayudó a que las plantas crecieran mejor', opts:['Que regar plantas no sirve de nada','Que las plantas crecieron por casualidad','Que Sofía dejó de cuidar su huerto'], reason:'El cuidado constante (regar, quitar hierbas) explica por qué las plantas crecieron mejor.' },
];
const COMPRENSION5_NOLITERARIO_BANK = [
  { text:'Los volcanes activos de Chile se concentran principalmente en la Cordillera de los Andes, y el país tiene más de 500 volcanes, de los cuales unos 60 han tenido erupciones registradas.', question:'¿Cuántos volcanes de Chile han tenido erupciones registradas, según el texto?', correct:'Unos 60', opts:['Los 500','Ninguno','Solo 5'], reason:'El texto dice explícitamente que "unos 60 han tenido erupciones registradas".' },
  { text:'Para reciclar correctamente: separa el papel y cartón del plástico y el vidrio, enjuaga los envases antes de depositarlos, y evita mezclar materiales orgánicos con los reciclables.', question:'¿Qué se debe hacer con los envases antes de reciclarlos?', correct:'Enjuagarlos', opts:['Romperlos en pedazos','Mezclarlos con basura orgánica','Quemarlos'], reason:'El texto indica explícitamente: "enjuaga los envases antes de depositarlos".' },
  { text:'El artículo explica que la miel nunca se echa a perder si se guarda bien sellada, gracias a su bajo contenido de agua y su acidez natural, que impiden el crecimiento de bacterias.', question:'¿Por qué la miel no se echa a perder?', correct:'Porque su bajo contenido de agua y acidez impiden que crezcan bacterias', opts:['Porque siempre se guarda en el refrigerador','Porque no tiene ningún tipo de sabor','Porque se cocina antes de envasarla'], reason:'El texto explica la causa: "bajo contenido de agua y su acidez natural" impiden el crecimiento de bacterias.' },
  { text:'La receta indica: primero hierve el agua, luego agrega la pasta y cocina por 10 minutos, cuela y finalmente mezcla con la salsa ya preparada.', question:'¿Qué se hace justo después de agregar la pasta al agua hirviendo?', correct:'Cocinarla por 10 minutos', opts:['Mezclarla con la salsa','Colarla de inmediato','Hervir el agua'], reason:'El texto sigue este orden: agregar la pasta y luego "cocina por 10 minutos".' },
  { text:'Un folleto informativo señala que las abejas polinizan cerca del 70% de los cultivos que consumen los seres humanos, por lo que su desaparición afectaría gravemente la producción de alimentos.', question:'¿Qué pasaría si las abejas desaparecieran, según el texto?', correct:'Se afectaría gravemente la producción de alimentos', opts:['No cambiaría nada en la agricultura','Los cultivos crecerían más rápido','Solo afectaría a las flores, no a los alimentos'], reason:'El texto lo indica directamente: "su desaparición afectaría gravemente la producción de alimentos".' },
  { text:'El aviso del municipio informa que la piscina pública abrirá de martes a domingo, de 10:00 a 18:00 horas, y permanecerá cerrada los lunes por mantención.', question:'¿Qué día permanece cerrada la piscina?', correct:'Los lunes', opts:['Los domingos','Los martes','Todos los días'], reason:'El texto lo indica explícitamente: "permanecerá cerrada los lunes por mantención".' },
];
const EVALUAR_INFO_BANK = [
  { escenario:'Un sitio web asegura "esta crema hace crecer el pelo en 3 días" pero no menciona ningún estudio, doctor ni fuente que lo respalde.', pregunta:'¿Esta afirmación tiene suficiente respaldo para creerla?', correcta:'NO, PORQUE NO ENTREGA NINGUNA FUENTE QUE LA RESPALDE', opts:['SÍ, PORQUE LO DICE UN SITIO WEB','SÍ, PORQUE SUENA CONVINCENTE','NO IMPORTA SI TIENE FUENTES O NO'] },
  { escenario:'Un artículo de una revista científica explica un descubrimiento citando el estudio, la universidad donde se hizo y el nombre de los investigadores.', pregunta:'¿Este artículo entrega información confiable?', correcta:'SÍ, PORQUE CITA FUENTES VERIFICABLES', opts:['NO, PORQUE ES DEMASIADO LARGO','NO, PORQUE HABLA DE CIENCIA','SÍ, PERO SOLO SI ES GRATIS'] },
  { escenario:'Un anuncio dice: "todos los niños que compran nuestro cereal se convierten en los mejores deportistas del colegio".', pregunta:'¿Cuál es el propósito principal de este texto?', correcta:'CONVENCER A LOS NIÑOS DE COMPRAR EL CEREAL', opts:['INFORMAR SOBRE NUTRICIÓN DE FORMA OBJETIVA','ENSEÑAR REGLAS DE UN DEPORTE','DAR INSTRUCCIONES DE COCINA'] },
  { escenario:'Una noticia sobre el clima cita datos de la Dirección Meteorológica de Chile y explica cómo se hizo la medición.', pregunta:'¿Cuál es el propósito principal de este texto?', correcta:'INFORMAR CON DATOS VERIFICABLES', opts:['CONVENCER DE COMPRAR UN PARAGUAS','CONTAR UN CUENTO DE FANTASÍA','EXPRESAR UNA OPINIÓN SIN DATOS'] },
  { escenario:'Un mensaje de cadena en redes sociales dice "comparte esto o te pasará algo malo" sin dar ninguna explicación real.', pregunta:'¿Qué deberías hacer frente a este mensaje?', correcta:'NO CREERLO NI COMPARTIRLO, PORQUE NO TIENE NINGÚN RESPALDO', opts:['COMPARTIRLO INMEDIATAMENTE POR SI ACASO','CREERLO PORQUE LO ENVIÓ UN AMIGO','IGNORAR SI TIENE RESPALDO O NO'] },
  { escenario:'Un folleto de una farmacia explica los efectos de un medicamento citando al Instituto de Salud Pública y sugiere consultar a un médico.', pregunta:'¿Este folleto entrega información confiable?', correcta:'SÍ, PORQUE CITA UNA FUENTE OFICIAL Y RECOMIENDA UN EXPERTO', opts:['NO, PORQUE ES UN FOLLETO IMPRESO','NO, PORQUE MENCIONA UN MEDICAMENTO','SÍ, PERO SOLO SI TIENE COLORES LLAMATIVOS'] },
];
const IDEA_PRINCIPAL_BANK = [
  { parrafo:'El reciclaje ayuda a cuidar el planeta porque reduce la basura que llega a los vertederos, ahorra energía al reutilizar materiales, y disminuye la necesidad de extraer nuevos recursos naturales.', correcta:'El reciclaje beneficia al planeta de varias formas', opts:['El reciclaje solo sirve para el papel','Los vertederos son buenos para el planeta','Nunca se deben extraer recursos naturales'] },
  { parrafo:'Dormir suficientes horas es esencial para los niños: ayuda a la memoria, mejora el ánimo durante el día y permite que el cuerpo crezca y se recupere del cansancio.', correcta:'Dormir bien trae muchos beneficios para los niños', opts:['Dormir mucho hace que los niños crezcan menos','Solo los adultos necesitan dormir bien','El ánimo no tiene relación con el sueño'] },
  { parrafo:'Los volcanes se forman cuando el magma del interior de la Tierra sube a la superficie a través de grietas, y al enfriarse forma la roca que da origen a la montaña volcánica.', correcta:'Los volcanes se forman por el magma que sube y se enfría', opts:['Los volcanes siempre están en erupción','Los volcanes se forman solo con agua','El magma nunca llega a la superficie'] },
  { parrafo:'Practicar un deporte en equipo enseña a los niños a comunicarse, a respetar reglas y a valorar el esfuerzo de sus compañeros tanto como el propio.', correcta:'Los deportes en equipo enseñan valores importantes', opts:['Los deportes en equipo son solo para ganar premios','Jugar en equipo impide hacer amigos','Las reglas no importan en los deportes'] },
  { parrafo:'Las abejas no solo producen miel: también son esenciales para polinizar las flores de muchas plantas que después se convierten en frutas y verduras que comemos.', correcta:'Las abejas son importantes por la miel y por la polinización', opts:['Las abejas solo sirven para hacer miel','Las plantas no necesitan polinización','Las abejas no tienen relación con los alimentos'] },
];

export function genComprension5Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(COMPRENSION5_NARRATIVA_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason,
    };
  }
  if(roll<0.5){
    const item = pick(COMPRENSION5_NOLITERARIO_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason,
    };
  }
  if(roll<0.75){
    const item = pick(EVALUAR_INFO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.escenario, cols:2, panel:true,
      explain: 'La respuesta correcta es: <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  const item = pick(IDEA_PRINCIPAL_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.parrafo+'</p><p class="prompt-hint">¿Cuál oración resume mejor la idea principal del párrafo?</p>',
    options: opts, correctValue: item.correcta, speakText: item.parrafo, cols:2, panel:true,
    explain: 'La idea principal es: <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

const RECURSOS_POETICOS_BANK = [
  { verso:'El viento susurraba secretos entre las hojas del bosque.', recurso:'PERSONIFICACIÓN', explicacion:'Le da al viento una acción humana ("susurrar secretos") que en realidad no puede hacer.' },
  { verso:'La luna sonreía traviesa sobre el tejado de la casa.', recurso:'PERSONIFICACIÓN', explicacion:'Le da a la luna una expresión humana ("sonreía traviesa") que en realidad no tiene.' },
  { verso:'Sus ojos brillaban como dos estrellas en la noche.', recurso:'COMPARACIÓN', explicacion:'Usa la palabra "como" para comparar los ojos con las estrellas.' },
  { verso:'Su voz era tan suave como una caricia.', recurso:'COMPARACIÓN', explicacion:'Usa la palabra "como" para comparar la voz con una caricia.' },
  { verso:'El río corría cantando alegre entre las piedras.', recurso:'PERSONIFICACIÓN', explicacion:'Le da al río la capacidad humana de "cantar", que en realidad no tiene.' },
  { verso:'Sus manos eran frías como el hielo del invierno.', recurso:'COMPARACIÓN', explicacion:'Usa la palabra "como" para comparar sus manos con el hielo.' },
  { verso:'El fuego devoraba con furia cada rincón del bosque.', recurso:'PERSONIFICACIÓN', explicacion:'Le da al fuego una acción y emoción humana ("devorar con furia").' },
  { verso:'El aroma del pan recién horneado inundaba toda la casa.', recurso:'APELA AL OLFATO', explicacion:'Describe un olor (el aroma del pan) para que el lector casi pueda sentirlo.' },
  { verso:'El sonido de las campanas retumbaba dulce en el silencio de la plaza.', recurso:'APELA AL OÍDO', explicacion:'Describe un sonido (las campanas) para que el lector casi pueda escucharlo.' },
  { verso:'El sabor agridulce de la fruta madura llenó su boca.', recurso:'APELA AL GUSTO', explicacion:'Describe un sabor (agridulce) para que el lector casi pueda saborearlo.' },
];
export function genRecursosPoeticos5Round(){
  const item = pick(RECURSOS_POETICOS_BANK);
  const todos = ['PERSONIFICACIÓN','COMPARACIÓN','APELA AL OLFATO','APELA AL OÍDO','APELA AL GUSTO'];
  const distract = shuffle(todos.filter(function(r){ return r!==item.recurso; })).slice(0,3);
  const opts = shuffle([item.recurso].concat(distract)).map(function(r){ return {label:r, value:r}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.verso+'"</p><p class="prompt-hint">¿Qué recurso del lenguaje poético se usa en este verso?</p>',
    options: opts, correctValue: item.recurso, speakText: item.verso, cols:2, kind:'word', panel:true,
    explain: item.explicacion,
  };
}

const RAICES_AFIJOS_BANK = [
  { palabra:'BIÓLOGO', raiz:'BIO', significadoRaiz:'Vida', significadoPalabra:'Persona que estudia los seres vivos' },
  { palabra:'TELÉFONO', raiz:'TELE', significadoRaiz:'A distancia', significadoPalabra:'Aparato para hablar a distancia' },
  { palabra:'ACUARIO', raiz:'ACUA', significadoRaiz:'Agua', significadoPalabra:'Lugar donde se guardan animales acuáticos' },
  { palabra:'AUTOBIOGRAFÍA', raiz:'AUTO', significadoRaiz:'Uno mismo', significadoPalabra:'Historia de la vida de una persona escrita por ella misma' },
  { palabra:'GEOGRAFÍA', raiz:'GEO', significadoRaiz:'Tierra', significadoPalabra:'Ciencia que estudia la superficie de la Tierra' },
  { palabra:'FOTOGRAFÍA', raiz:'FOTO', significadoRaiz:'Luz', significadoPalabra:'Imagen capturada usando la luz' },
];
const MATICES_SINONIMOS_BANK = [
  { oracion:'Después del maratón, el corredor estaba ___.', mejor:'EXHAUSTO', peor:'UN POCO CANSADO', explicacion:'"Exhausto" transmite un cansancio extremo, mucho más intenso que "un poco cansado" — mejor para describir a alguien que acaba de correr un maratón.' },
  { oracion:'La sopa que preparó la abuela estaba ___.', mejor:'DELICIOSA', peor:'ALGO COMESTIBLE', explicacion:'"Deliciosa" transmite un sabor muy agradable, mientras que "algo comestible" apenas dice que se puede comer — mucho menos elogioso.' },
  { oracion:'El examen fue tan difícil que Marco quedó ___.', mejor:'DESCONCERTADO', peor:'UN POCO CONFUNDIDO', explicacion:'"Desconcertado" transmite una confusión mucho más fuerte que "un poco confundido" — mejor para un examen muy difícil.' },
  { oracion:'La noticia de que ganó el premio lo dejó ___.', mejor:'EUFÓRICO', peor:'MEDIANAMENTE CONTENTO', explicacion:'"Eufórico" transmite una alegría intensa, mucho mayor que "medianamente contento" — mejor para una noticia tan buena.' },
  { oracion:'El silencio en la biblioteca era ___.', mejor:'ABSOLUTO', peor:'BASTANTE NOTORIO', explicacion:'"Absoluto" transmite que no había ningún ruido en lo absoluto, más preciso que "bastante notorio" para describir el silencio de una biblioteca.' },
];
export function genVocabulario5Round(){
  if(Math.random()<0.5){
    const item = pick(RAICES_AFIJOS_BANK);
    const distract = shuffle(RAICES_AFIJOS_BANK.filter(function(r){ return r.raiz!==item.raiz; })).slice(0,3).map(function(r){ return r.significadoRaiz; });
    const opts = shuffle([item.significadoRaiz].concat(distract)).map(function(s){ return {label:s, value:s}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">Esta palabra contiene la raíz "'+item.raiz.toLowerCase()+'". ¿Qué significa esa raíz?</p>',
      options: opts, correctValue: item.significadoRaiz, speakText: item.palabra, cols:2, panel:true,
      explain: 'La raíz "'+item.raiz.toLowerCase()+'" significa <b>'+item.significadoRaiz.toLowerCase()+'</b>, por eso "'+item.palabra.toLowerCase()+'" significa: '+item.significadoPalabra.toLowerCase()+'.',
    };
  }
  const item = pick(MATICES_SINONIMOS_BANK);
  const opts = shuffle([{label:item.mejor, value:'mejor'},{label:item.peor, value:'peor'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">¿Cuál palabra transmite la idea con más fuerza e intensidad?</p>',
    options: opts, correctValue: 'mejor', speakText: item.oracion, cols:2, kind:'word',
    explain: item.explicacion,
  };
}

const CONJUGACION_BANK = [
  { texto:'Ayer, yo ___ (CAMINAR) hasta la escuela.', correcto:'CAMINÉ', malas:['CAMINO','CAMINABA','CAMINARÁ'] },
  { texto:'Mañana, ella ___ (ESTUDIAR) para la prueba.', correcto:'ESTUDIARÁ', malas:['ESTUDIÓ','ESTUDIA','ESTUDIABA'] },
  { texto:'Todos los días, nosotros ___ (COMER) fruta en el recreo.', correcto:'COMEMOS', malas:['COMIMOS','COMERÁ','COMÍA'] },
  { texto:'El año pasado, tú ___ (VIAJAR) a la playa con tu familia.', correcto:'VIAJASTE', malas:['VIAJAS','VIAJARÁS','VIAJANDO'] },
  { texto:'Cuando era pequeño, yo ___ (JUGAR) todas las tardes en el parque.', correcto:'JUGABA', malas:['JUGARÉ','JUEGO','JUGUÉ'] },
  { texto:'La próxima semana, ellos ___ (VISITAR) el museo.', correcto:'VISITARÁN', malas:['VISITARON','VISITAN','VISITABAN'] },
  { texto:'Ahora mismo, el perro ___ (CORRER) por el jardín.', correcto:'CORRE', malas:['CORRIÓ','CORRERÁ','CORRÍA'] },
  { texto:'Anoche, ustedes ___ (LEER) un cuento antes de dormir.', correcto:'LEYERON', malas:['LEEN','LEERÁN','LEÍAN'] },
];
export function genGramatica5Round(){
  const item = pick(CONJUGACION_BANK);
  const opts = shuffle([item.correcto].concat(item.malas)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Qué forma del verbo completa correctamente la oración?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace(/\s*\([^)]*\)/,'').replace('___', item.correcto), cols:4, kind:'word',
    explain: '<b>'+item.correcto+'</b> es la conjugación correcta del verbo para ese momento y esa persona.',
  };
}

const ORTOGRAFIA5_BANK = [
  { incorrecta:'El sesped del jardín estaba recién cortado', correcta:'El césped del jardín estaba recién cortado', regla:'Se escribe con C: "césped".' },
  { incorrecta:'Ella serró la caja con mucho cuidado', correcta:'Ella cerró la caja con mucho cuidado', regla:'Se escribe con Z: "cerró" (de cerrar), no con S.' },
  { incorrecta:'La avestrus corrió muy rápido por la sabana', correcta:'La avestruz corrió muy rápido por la sabana', regla:'Se escribe con Z al final: "avestruz", no con S.' },
  { incorrecta:'El vaso se rompió en mil pedasos', correcta:'El vaso se rompió en mil pedazos', regla:'Se escribe con Z: "pedazos".' },
  { incorrecta:'—¿Vienes a mi cumpleaños? preguntó Camila.', correcta:'—¿Vienes a mi cumpleaños? —preguntó Camila.', regla:'Se necesita una segunda raya de diálogo antes de "preguntó", para separar la acotación del narrador de lo que dice el personaje.' },
  { incorrecta:'—Ya casi llegamos, dijo el guía sin detenerse.', correcta:'—Ya casi llegamos —dijo el guía sin detenerse.', regla:'Se necesita una raya de diálogo antes de "dijo", para separar la acotación del narrador.' },
  { incorrecta:'El sabado iremos de excursion a la montaña', correcta:'El sábado iremos de excursión a la montaña', regla:'Llevan tilde: "sábado" (esdrújula) y "excursión" (aguda terminada en N).' },
  { incorrecta:'La musica del festival se escucho desde muy lejos', correcta:'La música del festival se escuchó desde muy lejos', regla:'Llevan tilde: "música" (esdrújula) y "escuchó" (aguda terminada en vocal).' },
  { incorrecta:'El osso pardo hiberna durante el invierno', correcta:'El oso pardo hiberna durante el invierno', regla:'Se escribe con una sola S: "oso".' },
  { incorrecta:'La bruja lansó un hechizo misterioso', correcta:'La bruja lanzó un hechizo misterioso', regla:'Se escribe con Z: "lanzó".' },
];
export function genOrtografia5Round(){
  const item = pick(ORTOGRAFIA5_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla,
  };
}

/* ---------------- Contenido Lenguaje 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/6-basico):
   Comprensión VI -> OA02,04,06-08,25 (los mismos 4 ángulos de Comprensión V
   más un quinto: evaluar críticamente mensajes publicitarios identificando
   emisor/intención/audiencia — OA25 es de comunicación oral en el texto
   curricular, pero el mismo razonamiento aplica igual de bien a un aviso
   escrito, así que se incluye aquí en vez de descartarlo). Recursos
   Poéticos II -> OA05 (hipérbole y efectos sonoros -aliteración,
   onomatopeya- además de repasar personificación/comparación con versos
   nuevos, ya que el texto del OA vuelve a nombrar los 4 recursos juntos).
   Vocabulario VI -> OA12,20 (sufijos -ángulo nuevo respecto a los prefijos
   de 4° básico y las raíces de 5°- e hipónimos/locuciones -más allá de
   sinónimos con matices, ya cubierto en 5°-). Gramática VI -> OA21
   (participios irregulares: roto, escrito, dicho, hecho, puesto, visto,
   abierto, muerto, resuelto, cubierto, vuelto). Ortografía IV -> OA22
   (tilde diacrítica: él/el, tú/tu, mí/mi, sí/si, sé/se, dé/de, té/te,
   más/mas — una regla distinta a las ya cubiertas en Ortografía de
   3°-5° básico: mayúsculas/puntuación, b/v/h/ay-hay-ahí, c/s/z/raya de
   diálogo).
   Quedan fuera: OA01 (lectura oral fluida), OA03 (repertorio de géneros
   literarios — ya cubierto por "Géneros Literarios" de 3° básico), OA09-11
   (gusto por la lectura, biblioteca, buscar en fuentes — actitudinal o de
   proceso), OA13-19 (producción escrita), OA23-24,26-31 (comunicación oral:
   escuchar narraciones, teatro, diálogo, exposición, declamación — desempeño
   real o depende de audio). */
export const LENGUAJE_MODULES_G6 = [
  {id:'comprension6', label:'Comprensión VI', open:true, key:'comprension6'},
  {id:'recursospoeticos6', label:'Recursos Poéticos II', open:true, key:'recursospoeticos6'},
  {id:'vocabulario6', label:'Vocabulario VI', open:true, key:'vocabulario6'},
  {id:'gramatica6', label:'Gramática VI', open:true, key:'gramatica6'},
  {id:'ortografia6', label:'Ortografía IV', open:true, key:'ortografia6'},
];
export const LENGUAJE_POS_G6 = [{x:22,y:90},{x:68,y:70},{x:22,y:50},{x:68,y:30},{x:22,y:10}];

const COMPRENSION6_NARRATIVA_BANK = [
  { text:'Mientras todos los demás excursionistas se quejaban del frío, Elena sonreía y ayudaba a armar las carpas sin que nadie se lo pidiera.', question:'¿Qué opinión podemos formarnos de Elena?', correct:'Que tiene una actitud positiva y colaboradora', opts:['Que le molesta ayudar a los demás','Que no soporta el frío','Que prefiere estar sola'], reason:'Sonreír y ayudar sin que se lo pidan, incluso en una situación incómoda, muestra una actitud positiva y colaboradora.' },
  { text:'El general observaba el campo de batalla con el ceño fruncido, sabiendo que sus tropas ya no tenían provisiones para resistir otro día.', question:'¿Qué ambiente y situación describe este fragmento?', correct:'Un momento tenso, de guerra, con pocos recursos para continuar', opts:['Una fiesta alegre y despreocupada','Un día tranquilo de descanso','Una celebración de victoria'], reason:'El ceño fruncido, el campo de batalla y la falta de provisiones describen una situación tensa de guerra.' },
  { text:'Como un río desbordado que arrasa todo a su paso, la noticia se esparció por el pueblo en cuestión de minutos.', question:'¿Qué compara este fragmento con la velocidad de la noticia?', correct:'Un río desbordado', opts:['Una tortuga lenta','Un lago tranquilo','Una nube inmóvil'], reason:'El texto compara explícitamente la velocidad de la noticia con "un río desbordado que arrasa todo a su paso".' },
  { text:'Dos textos distintos describen el mismo terremoto: uno dice "la tierra tembló por unos segundos eternos", y el otro dice "el sismo duró exactamente 45 segundos, según los instrumentos".', question:'¿Qué diferencia principal hay entre ambos textos?', correct:'Uno usa lenguaje figurado y emocional, el otro usa datos precisos y objetivos', opts:['Ambos textos dicen exactamente lo mismo de la misma forma','El segundo texto es un poema','El primer texto es un informe científico'], reason:'El primero usa una expresión figurada ("segundos eternos"), mientras el segundo entrega un dato medido y objetivo (45 segundos).' },
  { text:'Aunque el examen era difícil, Tomás mantuvo la calma, repasó cada pregunta con cuidado, y entregó la prueba con una sonrisa serena.', question:'¿Qué actitud demuestra Tomás durante el examen?', correct:'Calma y confianza a pesar de la dificultad', opts:['Pánico y desesperación','Indiferencia total con el resultado','Enojo con la prueba'], reason:'Mantener la calma, repasar con cuidado y sonreír al final muestra una actitud serena y confiada.' },
  { text:'El casco del barco crujía como los huesos de un anciano, mientras las olas lo golpeaban una y otra vez en la tormenta.', question:'¿Con qué se compara el sonido del casco del barco?', correct:'Con los huesos de un anciano', opts:['Con el canto de un pájaro','Con el motor de un auto','Con una campana de iglesia'], reason:'El texto compara explícitamente el crujido del casco con "los huesos de un anciano".' },
  { text:'Tras perder el primer partido de la temporada, el equipo se reunió, analizó sus errores y volvió a entrenar con más disciplina que antes.', question:'¿Qué podemos inferir sobre la actitud del equipo frente a la derrota?', correct:'Que la usaron como una oportunidad para mejorar', opts:['Que se rindieron después de perder','Que culparon al árbitro sin analizar nada','Que dejaron de entrenar'], reason:'Analizar los errores y entrenar con más disciplina muestra que usaron la derrota para mejorar.' },
  { text:'La abuela guardaba sus cartas antiguas atadas con un listón rojo, y las releía cada aniversario de su boda.', question:'¿Qué importancia tienen esas cartas para la abuela?', correct:'Tienen un gran valor sentimental y emocional', opts:['No tienen ningún valor especial para ella','Planea quemarlas pronto','Las guarda por obligación'], reason:'Guardarlas con cuidado y releerlas cada aniversario muestra su gran valor sentimental.' },
];
const COMPRENSION6_NOLITERARIO_BANK = [
  { text:'Un estudio reciente indica que dormir entre 9 y 11 horas es lo recomendado para niños de 6 a 13 años, ya que favorece la concentración y el ánimo durante el día.', question:'¿Cuántas horas de sueño se recomiendan para un niño de esa edad?', correct:'Entre 9 y 11 horas', opts:['Entre 3 y 5 horas','Solo 6 horas','Más de 15 horas'], reason:'El texto lo indica explícitamente: "entre 9 y 11 horas".' },
  { text:'El manual de instrucciones señala: primero desconecta el aparato, luego retira la tapa girándola en sentido contrario a las agujas del reloj, y finalmente limpia el filtro con agua tibia.', question:'¿Qué se debe hacer justo antes de limpiar el filtro?', correct:'Retirar la tapa girándola', opts:['Conectar el aparato','Comprar un filtro nuevo','Guardar el manual'], reason:'El texto indica ese orden: retirar la tapa y luego "limpia el filtro con agua tibia".' },
  { text:'Un artículo explica que los pulpos tienen tres corazones y sangre de color azul, debido a una proteína distinta a la de los humanos que transporta el oxígeno.', question:'¿De qué color es la sangre de un pulpo, según el texto?', correct:'Azul', opts:['Roja','Verde','Transparente'], reason:'El texto lo indica explícitamente: "sangre de color azul".' },
  { text:'El aviso de la biblioteca municipal informa que el préstamo de libros dura 14 días, y que se puede renovar una vez si nadie más lo ha solicitado.', question:'¿Cuántos días dura el préstamo de un libro?', correct:'14 días', opts:['7 días','30 días','Un año'], reason:'El texto lo indica explícitamente: "el préstamo de libros dura 14 días".' },
  { text:'Una infografía sobre reciclaje explica que una botella de plástico puede tardar hasta 500 años en descomponerse en un vertedero.', question:'¿Cuánto puede tardar una botella de plástico en descomponerse, según el texto?', correct:'Hasta 500 años', opts:['Solo 5 días','Una semana','Nunca se descompone'], reason:'El texto lo indica explícitamente: "puede tardar hasta 500 años".' },
  { text:'El itinerario del viaje escolar indica: 8:00 salida en bus, 10:30 llegada al museo, 12:30 almuerzo, 14:00 visita guiada al parque, 17:00 regreso al colegio.', question:'¿Qué actividad ocurre justo después del almuerzo?', correct:'La visita guiada al parque', opts:['La salida en bus','La llegada al museo','El regreso al colegio'], reason:'Según el itinerario, después del almuerzo (12:30) sigue la visita guiada al parque (14:00).' },
];
const MENSAJES_PUBLICITARIOS_BANK = [
  { aviso:'Un aviso muestra a niños sonriendo mientras comen un cereal muy azucarado, con el texto "¡El desayuno favorito de los campeones!".', pregunta:'¿Cuál es la intención principal de este aviso?', correcta:'CONVENCER A LOS NIÑOS DE COMPRAR ESE CEREAL', opts:['INFORMAR DE FORMA OBJETIVA SOBRE NUTRICIÓN','ENSEÑAR UNA RECETA DE COCINA','ADVERTIR SOBRE LOS RIESGOS DEL AZÚCAR'] },
  { aviso:'Un comercial de zapatillas deportivas muestra a un jugador profesional anotando un punto decisivo, sugiriendo que esas zapatillas ayudan a ganar.', pregunta:'¿A qué público está dirigido principalmente este aviso?', correcta:'A PERSONAS INTERESADAS EN EL DEPORTE Y QUE ADMIRAN A ESE JUGADOR', opts:['A PERSONAS QUE NUNCA HACEN DEPORTE','A BEBÉS RECIÉN NACIDOS','A ADULTOS MAYORES QUE NO CAMINAN'] },
  { aviso:'Un aviso de un jugo en caja dice "100% natural" en letras grandes, pero en la lista de ingredientes (letra pequeña) aparece azúcar añadida.', pregunta:'¿Por qué es importante leer la lista de ingredientes completa y no solo el eslogan?', correcta:'PORQUE EL ESLOGAN PUEDE NO MOSTRAR TODA LA INFORMACIÓN REAL DEL PRODUCTO', opts:['PORQUE LA LETRA PEQUEÑA SIEMPRE ES FALSA','PORQUE NO ES NECESARIO REVISAR NADA MÁS','PORQUE EL ESLOGAN ES SIEMPRE MÁS IMPORTANTE'] },
  { aviso:'Un aviso de un parque de diversiones muestra a una familia riendo en los juegos, con el texto "¡El lugar más divertido para toda la familia!".', pregunta:'¿Cuál es el emisor más probable de este aviso?', correcta:'LA EMPRESA DUEÑA DEL PARQUE DE DIVERSIONES', opts:['UN CIENTÍFICO INDEPENDIENTE','EL GOBIERNO','UN MEDIO DE NOTICIAS SIN INTERÉS COMERCIAL'] },
  { aviso:'Un aviso de un videojuego usa colores brillantes, música emocionante y la frase "¡Todos tus amigos ya lo están jugando!" para invitarte a comprarlo.', pregunta:'¿Qué recurso usa este aviso para intentar convencer, además de la imagen y la música?', correcta:'LA PRESIÓN DE GRUPO ("TODOS TUS AMIGOS YA LO ESTÁN JUGANDO")', opts:['UN INFORME CIENTÍFICO SOBRE VIDEOJUEGOS','UNA ENCUESTA OFICIAL DEL GOBIERNO','UN DATO HISTÓRICO VERIFICABLE'] },
  { aviso:'Un aviso de protector solar muestra a un dermatólogo explicando los beneficios del producto y citando estudios sobre protección UV.', pregunta:'¿Por qué este aviso podría parecer más confiable que uno sin ningún respaldo?', correcta:'PORQUE CITA A UN EXPERTO Y ESTUDIOS VERIFICABLES', opts:['PORQUE USA COLORES MÁS BONITOS','PORQUE ES MÁS LARGO QUE OTROS AVISOS','PORQUE TIENE MÚSICA DE FONDO'] },
];
const IDEA_PRINCIPAL6_BANK = [
  { parrafo:'Aprender un segundo idioma no solo permite comunicarse con más personas: también mejora la memoria, ayuda a resolver problemas de otras formas, y abre puertas a nuevas culturas.', correcta:'Aprender un segundo idioma trae múltiples beneficios', opts:['Aprender un segundo idioma no sirve para nada','Solo los adultos pueden aprender otro idioma','La memoria empeora al aprender otro idioma'] },
  { parrafo:'Los arrecifes de coral cubren menos del 1% del fondo oceánico, pero albergan cerca de una cuarta parte de todas las especies marinas conocidas.', correcta:'Los arrecifes de coral son pequeños en tamaño pero enormemente importantes para la vida marina', opts:['Los arrecifes de coral cubren la mayor parte del océano','Los arrecifes de coral no tienen relación con la vida marina','Ninguna especie marina vive en los arrecifes'] },
  { parrafo:'Reciclar el papel ahorra árboles y energía, reciclar el vidrio se puede repetir casi infinitas veces sin perder calidad, y reciclar el plástico reduce la basura en los océanos.', correcta:'Reciclar distintos materiales trae beneficios distintos para el planeta', opts:['Solo el papel se puede reciclar','Reciclar no tiene ningún beneficio real','El vidrio no se puede reciclar nunca'] },
  { parrafo:'Practicar un instrumento musical desde niño ayuda a desarrollar la disciplina, mejora la coordinación entre manos y mente, y puede fortalecer la memoria a largo plazo.', correcta:'Aprender un instrumento musical desde temprano trae varios beneficios', opts:['Aprender música no tiene ningún beneficio más allá del sonido','Solo sirve para presentarse en conciertos','La coordinación no tiene relación con la música'] },
];

export function genComprension6Round(){
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(COMPRENSION6_NARRATIVA_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason,
    };
  }
  if(roll<0.4){
    const item = pick(COMPRENSION6_NOLITERARIO_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason,
    };
  }
  if(roll<0.6){
    const item = pick(MENSAJES_PUBLICITARIOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.aviso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.aviso, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(IDEA_PRINCIPAL6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.parrafo+'</p><p class="prompt-hint">¿Cuál oración resume mejor la idea principal del párrafo?</p>',
    options: opts, correctValue: item.correcta, speakText: item.parrafo, cols:2, panel:true,
    explain: 'La idea principal es: <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

const RECURSOS_POETICOS2_BANK = [
  { verso:'La montaña dormía cubierta de niebla, esperando el amanecer.', recurso:'PERSONIFICACIÓN', explicacion:'Le da a la montaña una acción humana ("dormía", "esperando") que en realidad no puede hacer.' },
  { verso:'Su sonrisa era como un rayo de sol en un día nublado.', recurso:'COMPARACIÓN', explicacion:'Usa la palabra "como" para comparar la sonrisa con un rayo de sol.' },
  { verso:'Te lo he repetido un millón de veces y todavía no me escuchas.', recurso:'HIPÉRBOLE', explicacion:'Es una exageración enorme para enfatizar que se ha repetido muchas veces, no literalmente un millón.' },
  { verso:'Lloré tantas lágrimas que podría haber llenado el océano entero.', recurso:'HIPÉRBOLE', explicacion:'Es una exageración imposible (llenar un océano con lágrimas) para enfatizar la intensidad del llanto.' },
  { verso:'El reloj de la abuela hacía tic-tac, tic-tac, en el silencio de la noche.', recurso:'ONOMATOPEYA', explicacion:'"Tic-tac" imita el sonido real que hace un reloj — eso es una onomatopeya.' },
  { verso:'Las abejas hacían bzzz, bzzz alrededor de las flores del jardín.', recurso:'ONOMATOPEYA', explicacion:'"Bzzz" imita el sonido real que hacen las abejas al volar — eso es una onomatopeya.' },
  { verso:'El viento veloz volaba entre los árboles del valle.', recurso:'ALITERACIÓN', explicacion:'Se repite el sonido de la "v" varias veces seguidas ("veloz", "volaba", "valle") — eso es una aliteración.' },
  { verso:'Tres tristes tigres tragaban trigo en un trigal.', recurso:'ALITERACIÓN', explicacion:'Se repite el sonido "tr" varias veces seguidas — eso es una aliteración.' },
  { verso:'El río conversaba en voz baja con las piedras del camino.', recurso:'PERSONIFICACIÓN', explicacion:'Le da al río la capacidad humana de "conversar", que en realidad no tiene.' },
  { verso:'Sus palabras eran afiladas como cuchillos.', recurso:'COMPARACIÓN', explicacion:'Usa la palabra "como" para comparar las palabras con cuchillos.' },
];
export function genRecursosPoeticos6Round(){
  const item = pick(RECURSOS_POETICOS2_BANK);
  const todos = ['PERSONIFICACIÓN','COMPARACIÓN','HIPÉRBOLE','ONOMATOPEYA','ALITERACIÓN'];
  const distract = shuffle(todos.filter(function(r){ return r!==item.recurso; })).slice(0,3);
  const opts = shuffle([item.recurso].concat(distract)).map(function(r){ return {label:r, value:r}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.verso+'"</p><p class="prompt-hint">¿Qué recurso del lenguaje poético se usa en este verso?</p>',
    options: opts, correctValue: item.recurso, speakText: item.verso, cols:2, kind:'word', panel:true,
    explain: item.explicacion,
  };
}

const SUFIJOS_BANK = [
  { palabra:'VELOCIDAD', sufijo:'-DAD', significadoSufijo:'Indica una cualidad (ser veloz)', base:'VELOZ' },
  { palabra:'LENTAMENTE', sufijo:'-MENTE', significadoSufijo:'Indica el modo en que se hace algo (de forma lenta)', base:'LENTA' },
  { palabra:'PANADERO', sufijo:'-ERO', significadoSufijo:'Indica el oficio de alguien (que trabaja con pan)', base:'PAN' },
  { palabra:'CARIÑOSO', sufijo:'-OSO', significadoSufijo:'Indica que algo tiene esa cualidad en abundancia (lleno de cariño)', base:'CARIÑO' },
  { palabra:'FELICIDAD', sufijo:'-DAD', significadoSufijo:'Indica una cualidad (ser feliz)', base:'FELIZ' },
  { palabra:'JARDINERO', sufijo:'-ERO', significadoSufijo:'Indica el oficio de alguien (que trabaja en el jardín)', base:'JARDÍN' },
];
const HIPERONIMOS_GRUPOS = [
  { hiperonimo:'MUEBLE', hiponimos:['SILLA','MESA','CAMA'] },
  { hiperonimo:'FLOR', hiponimos:['ROSA','CLAVEL','TULIPÁN'] },
  { hiperonimo:'VEHÍCULO', hiponimos:['AUTO','BICICLETA','CAMIÓN'] },
  { hiperonimo:'HERRAMIENTA', hiponimos:['MARTILLO','DESTORNILLADOR','SIERRA'] },
];
const LOCUCIONES_BANK = [
  { locucion:'DE VEZ EN CUANDO', significado:'A VECES, NO SIEMPRE', opts:['TODOS LOS DÍAS SIN FALTA','NUNCA JAMÁS','SOLO UNA VEZ EN LA VIDA'] },
  { locucion:'EN UN ABRIR Y CERRAR DE OJOS', significado:'MUY RÁPIDAMENTE', opts:['MUY LENTAMENTE','DESPUÉS DE MUCHOS AÑOS','SIN NINGÚN APURO'] },
  { locucion:'A MÁS TARDAR', significado:'COMO PLAZO MÁXIMO', opts:['SIN NINGÚN LÍMITE DE TIEMPO','LO MÁS TEMPRANO POSIBLE','NUNCA'] },
  { locucion:'POCO A POCO', significado:'LENTAMENTE Y CON CALMA', opts:['DE UNA SOLA VEZ Y MUY RÁPIDO','SIN NINGÚN ORDEN','DE FORMA VIOLENTA'] },
  { locucion:'DE PIES A CABEZA', significado:'COMPLETAMENTE, DE PRINCIPIO A FIN', opts:['SOLO UNA PEQUEÑA PARTE','DE FORMA DESORDENADA','NUNCA POR COMPLETO'] },
];
export function genVocabulario6Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(SUFIJOS_BANK);
    const distract = shuffle(SUFIJOS_BANK.filter(function(s){ return s.sufijo!==item.sufijo; })).slice(0,3).map(function(s){ return s.significadoSufijo; });
    const opts = shuffle([item.significadoSufijo].concat(distract)).map(function(s){ return {label:s, value:s}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">Esta palabra viene de "'+item.base.toLowerCase()+'" más el sufijo "'+item.sufijo+'". ¿Qué indica ese sufijo?</p>',
      options: opts, correctValue: item.significadoSufijo, speakText: item.palabra, cols:2, panel:true,
      explain: 'El sufijo "'+item.sufijo+'" '+item.significadoSufijo.toLowerCase()+'.',
    };
  }
  if(roll<0.67){
    const grupo = pick(HIPERONIMOS_GRUPOS);
    const correct = pick(grupo.hiponimos);
    const otros = HIPERONIMOS_GRUPOS.filter(function(g){ return g.hiperonimo!==grupo.hiperonimo; });
    const distract = shuffle(otros.map(function(g){ return pick(g.hiponimos); }));
    const opts = shuffle([correct].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<p class="prompt-word">'+grupo.hiperonimo+'</p><p class="prompt-hint">¿Cuál de estas palabras es un hipónimo (una palabra más específica) de "'+grupo.hiperonimo.toLowerCase()+'"?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál palabra es más específica que '+grupo.hiperonimo.toLowerCase()+'?', cols:2, kind:'word', panel:true,
      explain: '<b>'+correct+'</b> es un tipo específico de '+grupo.hiperonimo.toLowerCase()+'.',
    };
  }
  const item = pick(LOCUCIONES_BANK);
  const opts = shuffle([item.significado].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.locucion+'"</p><p class="prompt-hint">¿Qué significa esta expresión?</p>',
    options: opts, correctValue: item.significado, speakText: item.locucion, cols:2, panel:true,
    explain: '"'+item.locucion+'" significa <b>'+item.significado.toLowerCase()+'</b>.',
  };
}

const PARTICIPIOS_IRREGULARES_BANK = [
  { texto:'Ya he ___ (ROMPER) el jarrón sin querer.', correcto:'ROTO', malas:['ROMPIDO','ROMPIENDO','ROMPE'] },
  { texto:'Ella ha ___ (ESCRIBIR) tres cartas esta semana.', correcto:'ESCRITO', malas:['ESCRIBIDO','ESCRIBIENDO','ESCRIBE'] },
  { texto:'Nunca me había ___ (DECIR) algo tan bonito.', correcto:'DICHO', malas:['DECIDO','DECIENDO','DICE'] },
  { texto:'¿Ya has ___ (HACER) toda la tarea?', correcto:'HECHO', malas:['HACIDO','HACIENDO','HACE'] },
  { texto:'Hemos ___ (PONER) la mesa para la cena.', correcto:'PUESTO', malas:['PONIDO','PONIENDO','PONE'] },
  { texto:'¿Alguna vez has ___ (VER) una ballena de cerca?', correcto:'VISTO', malas:['VEIDO','VIENDO','VE'] },
  { texto:'El viento ha ___ (ABRIR) la ventana de golpe.', correcto:'ABIERTO', malas:['ABRIDO','ABRIENDO','ABRE'] },
  { texto:'El científico ha ___ (RESOLVER) el problema matemático.', correcto:'RESUELTO', malas:['RESOLVIDO','RESOLVIENDO','RESUELVE'] },
  { texto:'La nieve ha ___ (CUBRIR) todo el jardín esta mañana.', correcto:'CUBIERTO', malas:['CUBRIDO','CUBRIENDO','CUBRE'] },
  { texto:'Mi hermana ya ha ___ (VOLVER) de su viaje.', correcto:'VUELTO', malas:['VOLVIDO','VOLVIENDO','VUELVE'] },
];
export function genGramatica6Round(){
  const item = pick(PARTICIPIOS_IRREGULARES_BANK);
  const opts = shuffle([item.correcto].concat(item.malas)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Cuál es el participio correcto de ese verbo?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace(/\s*\([^)]*\)/,'').replace('___', item.correcto), cols:4, kind:'word',
    explain: '<b>'+item.correcto+'</b> es el participio irregular correcto — no sigue la terminación regular "-ado/-ido".',
  };
}

const TILDE_DIACRITICA_BANK = [
  { incorrecta:'Este es el regalo de el.', correcta:'Este es el regalo de él.', regla:'"Él" (pronombre que reemplaza a una persona) lleva tilde; sin tilde, "el" es artículo (como en "el regalo").' },
  { incorrecta:'Se que tu vendrás a mi fiesta.', correcta:'Sé que tú vendrás a mi fiesta.', regla:'"Sé" (del verbo saber) y "tú" (pronombre) llevan tilde, a diferencia de "se" (pronombre) y "tu" (posesivo, como en "tu fiesta").' },
  { incorrecta:'Si no vienes, dimelo a mi.', correcta:'Si no vienes, dímelo a mí.', regla:'"Mí" (pronombre) lleva tilde para diferenciarse de "mi" (posesivo, como en "mi casa").' },
  { incorrecta:'El profesor me pidió que le de la tarea.', correcta:'El profesor me pidió que le dé la tarea.', regla:'"Dé" (del verbo dar) lleva tilde para diferenciarse de la preposición "de".' },
  { incorrecta:'Si, yo se la respuesta correcta.', correcta:'Sí, yo sé la respuesta correcta.', regla:'"Sí" (afirmación) y "sé" (del verbo saber) llevan tilde, a diferencia de "si" (condicional) y "se" (pronombre).' },
  { incorrecta:'Quiero mas te, por favor.', correcta:'Quiero más té, por favor.', regla:'"Más" (cantidad) y "té" (la bebida) llevan tilde, a diferencia de "mas" (equivale a "pero") y "te" (pronombre).' },
  { incorrecta:'Tu hermano trajo el te para ti.', correcta:'Tu hermano trajo el té para ti.', regla:'"Té" (la bebida) lleva tilde para diferenciarse de "te" (pronombre, como en "te lo traigo").' },
  { incorrecta:'El me dijo que si vendría.', correcta:'Él me dijo que sí vendría.', regla:'"Él" (pronombre) y "sí" (afirmación) llevan tilde, a diferencia de "el" (artículo) y "si" (condicional).' },
];
export function genOrtografia6Round(){
  const item = pick(TILDE_DIACRITICA_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla,
  };
}

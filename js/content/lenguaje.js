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

export function genGenerosLiterarios3Round(){
  const item = pick(GENEROS_BANK);
  const distract = shuffle(GENEROS_POOL.filter(function(g){ return g!==item.label; })).slice(0,3);
  const opts = shuffle([item.label].concat(distract)).map(function(g){ return {label:g, value:g}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'</p><p class="prompt-hint">¿Qué género literario es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa descripción corresponde a un(a) <b>'+item.label.toLowerCase()+'</b>.',
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
    options: opts, correctValue: item.correcto, speakText: item.texto, cols:4, kind:'word',
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

import { pick, shuffle } from '../utils.js';

export const VOCAL_WORDS = [
  { emoji:'🕷️', word:'ARAÑA', answer:'A' },
  { emoji:'✈️', word:'AVIÓN', answer:'A' },
  { emoji:'🐝', word:'ABEJA', answer:'A' },
  { emoji:'🌳', word:'ÁRBOL', answer:'A' },
  { emoji:'💧', word:'AGUA', answer:'A' },
  { emoji:'🦅', word:'ÁGUILA', answer:'A' },
  { emoji:'🪁', word:'ANCLA', answer:'A' },
  { emoji:'🐘', word:'ELEFANTE', answer:'E' },
  { emoji:'⭐', word:'ESTRELLA', answer:'E' },
  { emoji:'🚂', word:'ESCUELA', answer:'E' },
  { emoji:'🪞', word:'ESPEJO', answer:'E' },
  { emoji:'🌋', word:'ERUPCIÓN', answer:'E' },
  { emoji:'🏝️', word:'ISLA', answer:'I' },
  { emoji:'🧊', word:'IGLÚ', answer:'I' },
  { emoji:'🌈', word:'IRIS', answer:'I' },
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

export const LENGUAJE_MODULES_G4 = [
  {id:'adverbios4', label:'Adverbios', open:true, key:'adverbios4'},
  {id:'verbos4', label:'Verbos y Concordancia', open:true, key:'verbos4'},
  {id:'raicesafijos4', label:'Raíces y Afijos', open:true, key:'raicesafijos4'},
  {id:'comprension4', label:'Comprensión IV', open:true, key:'comprension4'},
];
export const LENGUAJE_POS_G4 = [{x:22,y:84},{x:68,y:62},{x:24,y:40},{x:70,y:16}];

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

/* ---------------- Contenido Lenguaje 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/4-basico):
   OA19 -> Adverbios · OA20 -> Verbos y Concordancia · OA10 -> Raíces y
   Afijos (claves de contexto vía prefijos/sufijos, distinto del contexto
   general ya cubierto en 3° básico) · OA4,6 -> Comprensión IV.
   Quedan fuera OA1-3,7-9 (fluidez, repertorio literario, gusto por la
   lectura, biblioteca, investigación propia), OA5 (poemas/lenguaje
   figurado, ya cubierto en 3° básico), OA11-18,21 (producción escrita,
   pronombres ya cubiertos en 3° básico, ortografía general) y OA22-30
   (comunicación oral/teatro) por depender de desempeño real o repetir
   contenido de años anteriores. */
const ADVERBIOS_BANK = [
  { oracion:'Ella corre rápidamente por el parque', adverbio:'RÁPIDAMENTE', tipo:'MODO', otras:['ELLA','CORRE','PARQUE'] },
  { oracion:'Hoy iremos al cine', adverbio:'HOY', tipo:'TIEMPO', otras:['IREMOS','AL','CINE'] },
  { oracion:'El gato está aquí', adverbio:'AQUÍ', tipo:'LUGAR', otras:['EL','GATO','ESTÁ'] },
  { oracion:'Comió poco en el almuerzo', adverbio:'POCO', tipo:'CANTIDAD', otras:['COMIÓ','EL','ALMUERZO'] },
  { oracion:'El perro ladra fuertemente', adverbio:'FUERTEMENTE', tipo:'MODO', otras:['EL','PERRO','LADRA'] },
  { oracion:'Ellos viven cerca', adverbio:'CERCA', tipo:'LUGAR', otras:['ELLOS','VIVEN'] },
  { oracion:'Estudió mucho para el examen', adverbio:'MUCHO', tipo:'CANTIDAD', otras:['ESTUDIÓ','PARA','EXAMEN'] },
  { oracion:'Mañana visitaremos a la abuela', adverbio:'MAÑANA', tipo:'TIEMPO', otras:['VISITAREMOS','LA','ABUELA'] },
];
const VERBOS_CONJ = [
  { inf:'CANTAR', '1S':'CANTO', '2S':'CANTAS', '3S':'CANTA', '1P':'CANTAMOS', '3P':'CANTAN' },
  { inf:'COMER', '1S':'COMO', '2S':'COMES', '3S':'COME', '1P':'COMEMOS', '3P':'COMEN' },
  { inf:'SALTAR', '1S':'SALTO', '2S':'SALTAS', '3S':'SALTA', '1P':'SALTAMOS', '3P':'SALTAN' },
  { inf:'ESCRIBIR', '1S':'ESCRIBO', '2S':'ESCRIBES', '3S':'ESCRIBE', '1P':'ESCRIBIMOS', '3P':'ESCRIBEN' },
];
const SUJETOS_VERBO = [
  { texto:'Yo', persona:'1S' }, { texto:'Tú', persona:'2S' }, { texto:'Él', persona:'3S' },
  { texto:'Nosotros', persona:'1P' }, { texto:'Ellos', persona:'3P' },
];
const AFIJOS_BANK = [
  { afijo:'DES-', significado:'Indica lo contrario de algo, o quitarlo', ejemplo:'DESHACER = lo contrario de hacer' },
  { afijo:'IN-', significado:'Indica negación', ejemplo:'INFELIZ = no feliz' },
  { afijo:'RE-', significado:'Indica repetición', ejemplo:'REHACER = hacer de nuevo' },
  { afijo:'-MENTE', significado:'Convierte un adjetivo en adverbio de modo', ejemplo:'RÁPIDAMENTE = de forma rápida' },
  { afijo:'-OSO', significado:'Indica abundancia de algo', ejemplo:'CARIÑOSO = con mucho cariño' },
  { afijo:'-ITO', significado:'Indica algo pequeño (diminutivo)', ejemplo:'PERRITO = perro pequeño' },
];
const COMPRENSION4_BANK = [
  { text:'Después de días sin llover, el río bajó tanto que se podían ver las piedras del fondo.', question:'¿Qué había ocurrido antes de esa escena?', correct:'Una sequía (falta de lluvia)', opts:['Una tormenta muy fuerte','Un terremoto','Una nevazón'] },
  { text:'Para armar una cometa: primero corta dos varillas, luego crúzalas y amárralas, después cubre la estructura con papel, y por último agrega una cola de tela.', question:'¿Qué paso va después de cruzar y amarrar las varillas?', correct:'Cubrir la estructura con papel', opts:['Agregar la cola de tela','Cortar las varillas','Volar la cometa'] },
  { text:'Mientras más subían la montaña, el aire se sentía más frío y les costaba más respirar.', question:'¿Qué le pasa al aire a medida que se sube una montaña?', correct:'Se vuelve más frío y escaso', opts:['Se vuelve más caliente','No cambia en nada','Se vuelve más húmedo'] },
  { text:'El científico anotó cada resultado en una tabla antes de sacar conclusiones sobre su experimento.', question:'¿Qué hizo el científico antes de sacar conclusiones?', correct:'Anotar los resultados en una tabla', opts:['Ignorar los resultados','Adivinar la respuesta','Comenzar el experimento de nuevo'] },
  { text:'La abeja visitó varias flores, y en cada una dejó un poco de polen de la flor anterior.', question:'¿Qué proceso describe este texto?', correct:'La polinización', opts:['La germinación','La evaporación','La fotosíntesis'] },
  { text:'Tras varios intentos fallidos, el equipo ajustó su estrategia y finalmente ganó el partido.', question:'¿Qué hizo el equipo para poder ganar?', correct:'Ajustar su estrategia', opts:['Rendirse','Cambiar de deporte','Jugar exactamente igual que antes'] },
];

export function genAdverbios4Round(){
  const item = pick(ADVERBIOS_BANK);
  if(Math.random()<0.5){
    const opts = shuffle([item.adverbio].concat(item.otras)).map(function(w){ return {label:w, value:w}; });
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.oracion+'"</p><p class="prompt-hint">¿Cuál palabra es el adverbio?</p>',
      options: opts, correctValue: item.adverbio, speakText: item.oracion, cols:4, kind:'word',
      explain: '<b>'+item.adverbio+'</b> es el adverbio de la oración.',
    };
  }
  const distract = shuffle(['TIEMPO','LUGAR','MODO','CANTIDAD'].filter(function(t){ return t!==item.tipo; })).slice(0,3);
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.oracion+'"</p><p class="prompt-hint">El adverbio "'+item.adverbio+'" indica...</p>',
    options: opts, correctValue: item.tipo, speakText: '¿Qué indica el adverbio '+item.adverbio+'?', cols:4, kind:'word',
    explain: '"'+item.adverbio+'" es un adverbio de <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genVerbos4Round(){
  const verbo = pick(VERBOS_CONJ);
  const sujeto = pick(SUJETOS_VERBO);
  const correct = verbo[sujeto.persona];
  const allForms = ['1S','2S','3S','1P','3P'].map(function(p){ return verbo[p]; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  const distract = allForms.filter(function(f){ return f!==correct; });
  const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+sujeto.texto+' <span class="blank">___</span> ('+verbo.inf.toLowerCase()+')</p><p class="prompt-hint">¿Qué palabra completa la oración?</p>',
    options: opts, correctValue: correct, speakText: sujeto.texto+'...', cols:4, kind:'word',
    explain: 'Con "'+sujeto.texto+'" el verbo correcto es <b>'+correct+'</b>.',
  };
}

export function genRaicesAfijos4Round(){
  const item = pick(AFIJOS_BANK);
  const distract = AFIJOS_BANK.filter(function(a){ return a.afijo!==item.afijo; }).map(function(a){ return a.significado; });
  const opts = shuffle([item.significado].concat(shuffle(distract).slice(0,3))).map(function(s){ return {label:s, value:s}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.afijo+'</p><p class="prompt-hint">Por ejemplo: '+item.ejemplo+'. ¿Qué significa esta parte de la palabra?</p>',
    options: opts, correctValue: item.significado, speakText: item.ejemplo, cols:2, panel:true,
    explain: '"'+item.afijo+'" '+item.significado.toLowerCase()+'.',
  };
}

export function genComprension4Round(){
  const item = pick(COMPRENSION4_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
    explain: item.correct+' — esa es la respuesta correcta según el texto.',
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

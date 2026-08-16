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
  { emoji:'🕷️', word:'Araña', answer:'A' },
  { emoji:'✈️', word:'Avión', answer:'A' },
  { emoji:'🐝', word:'Abeja', answer:'A' },
  { emoji:'🌳', word:'Árbol', answer:'A' },
  { emoji:'💧', word:'Agua', answer:'A' },
  { emoji:'🦅', word:'Águila', answer:'A' },
  { emoji:'⚓', word:'Ancla', answer:'A' },
  { emoji:'🐘', word:'Elefante', answer:'E' },
  { emoji:'⭐', word:'Estrella', answer:'E' },
  { emoji:'🏫', word:'Escuela', answer:'E' },
  { emoji: espejoSVG(30), word:'Espejo', answer:'E' },
  { emoji:'🌋', word:'Erupción', answer:'E' },
  { emoji:'🏝️', word:'Isla', answer:'I' },
  { emoji: igluSVG(30), word:'Iglú', answer:'I' },
  { emoji:'🐜', word:'Insecto', answer:'I' },
  { emoji:'🧲', word:'Imán', answer:'I' },
  { emoji:'🦎', word:'Iguana', answer:'I' },
  { emoji:'🐻', word:'Oso', answer:'O' },
  { emoji:'🐑', word:'Oveja', answer:'O' },
  { emoji:'👂', word:'Oreja', answer:'O' },
  { emoji:'🐻', word:'Osito', answer:'O' },
  { emoji:'🌊', word:'Ola', answer:'O' },
  { emoji:'🍇', word:'Uva', answer:'U' },
  { emoji:'💅', word:'Uña', answer:'U' },
  { emoji:'1️⃣', word:'Uno', answer:'U' },
  { emoji:'🎽', word:'Uniforme', answer:'U' },
  { emoji:'🦄', word:'Unicornio', answer:'U' },
];

export const PALABRA_WORDS = [
  { emoji:'🐱', word:'Gato', opts:['Gallo','Gorro','Globo'] },
  { emoji:'🦆', word:'Pato', opts:['Palo','Piso','Peso'] },
  { emoji:'☀️', word:'Sol', opts:['Sal','Sur','Son'] },
  { emoji:'🌙', word:'Luna', opts:['Lata','Loma','Lima'] },
  { emoji:'🏠', word:'Casa', opts:['Cosa','Caja','Cama'] },
  { emoji:'🌸', word:'Flor', opts:['Frío','Fruta','Foca'] },
  { emoji:'🐟', word:'Pez', opts:['Paz','Pie','Por'] },
  { emoji:'🐻', word:'Oso', opts:['Ojo','Asa','Uso'] },
  { emoji:'🐄', word:'Vaca', opts:['Vela','Vida','Vaso'] },
  { emoji:'🚂', word:'Tren', opts:['Tres','Traje','Trigo'] },
  { emoji:'📖', word:'Libro', opts:['Lobo','Lado','Lupa'] },
  { emoji:'⚽', word:'Pelota', opts:['Paleta','Maleta','Camiseta'] },
  { emoji:'🐝', word:'Abeja', opts:['Abuela','Arena','Aguja'] },
  { emoji:'☁️', word:'Nube', opts:['Nave','Nieve','Noche'] },
  { emoji:'⭐', word:'Estrella', opts:['Escuela','Escalera','Espejo'] },
  { emoji:'✋', word:'Mano', opts:['Mesa','Mono','Mula'] },
  { emoji:'🐢', word:'Tortuga', opts:['Tormenta','Tostada','Tornado'] },
  { emoji:'🦋', word:'Mariposa', opts:['Marioneta','Madrina','Marinero'] },
  { emoji:'🌙', word:'Noche', opts:['Leche','Coche','Nieve'] },
  { emoji:'🐕', word:'Perro', opts:['Pero','Piro','Parra'] },
  { emoji:'🎨', word:'Pintura', opts:['Cintura','Pintor','Cultura'] },
  { emoji:'🚲', word:'Bicicleta', opts:['Bocadillo','Biceps','Botella'] },
  { emoji:'🍦', word:'Helado', opts:['Pelado','Salado','Mojado'] },
  { emoji:'🦷', word:'Diente', opts:['Duende','Dientes','Diantre'] },
];

export const COMPRENSION_BANK = [
  { text:'El gato duerme en la cama.', question:'¿Dónde duerme el gato?', correct:'🛏️', opts:['🌳','⚽','🚗'] },
  { text:'La niña come una manzana.', question:'¿Qué come la niña?', correct:'🍎', opts:['🍌','🍇','🍓'] },
  { text:'El perro corre en el parque.', question:'¿Dónde corre el perro?', correct:'🌳', opts:['🏠','🛏️','🚗'] },
  { text:'La mamá cocina una sopa.', question:'¿Qué cocina la mamá?', correct:'🍲', opts:['🍕','🎂','🥗'] },
  { text:'El niño lee un libro.', question:'¿Qué hace el niño?', correct:'📖', opts:['⚽','🎨','🎵'] },
  { text:'La abeja vuela hacia la flor.', question:'¿Hacia dónde vuela la abeja?', correct:'🌸', opts:['🌙','🚗','📖'] },
  { text:'El pez nada en el agua.', question:'¿Dónde nada el pez?', correct:'🌊', opts:['🌳','🏠','☁️'] },
  { text:'Los niños juegan con la pelota.', question:'¿Con qué juegan los niños?', correct:'⚽', opts:['📖','🍎','🚗'] },
  { text:'La luna brilla de noche.', question:'¿Cuándo brilla la luna?', correct:'🌙', opts:['☀️','🌧️','⛄'] },
  { text:'El pato nada en el estanque.', question:'¿Quién nada en el estanque?', correct:'🦆', opts:['🐱','🐄','🐝'] },
  { text:'La tortuga camina muy lento.', question:'¿Cómo camina la tortuga?', correct:'🐢', opts:['🐆','🐇','🦅'] },
  { text:'El sol calienta la playa.', question:'¿Qué calienta el sol?', correct:'🏖️', opts:['🏔️','🌧️','🌙'] },
  { text:'La mariposa vuela de flor en flor.', question:'¿Qué hace la mariposa?', correct:'🦋', opts:['🐌','🐛','🐜'] },
  { text:'El panadero hornea el pan temprano.', question:'¿Quién hornea el pan?', correct:'👨‍🍳', opts:['👩‍⚕️','👮','👨‍🌾'] },
  { text:'Los pájaros cantan en la mañana.', question:'¿Cuándo cantan los pájaros?', correct:'🌅', opts:['🌃','🌆','⛈️'] },
  { text:'La abuela teje una bufanda de lana.', question:'¿Qué teje la abuela?', correct:'🧣', opts:['🧦','🧤','👒'] },
];

export const ALL_COMBOS = ['Que','Qui','Ge','Gi','Gue','Gui','Ce','Ci','Güe','Güi'];
export const COMBO_WORDS = [
  { emoji:'🧀', before:'', combo:'Que', after:'So' },
  { emoji:'🏪', before:'', combo:'Qui', after:'Osco' },
  { emoji:'👥', before:'', combo:'Ge', after:'Nte' },
  { emoji:'🌻', before:'', combo:'Gi', after:'Rasol' },
  { emoji:'🎸', before:'', combo:'Gui', after:'Tarra' },
  { emoji:'🚿', before:'Man', combo:'Gue', after:'Ra' },
  { emoji:'☁️', before:'', combo:'Ci', after:'Elo' },
  { emoji:'🍳', before:'Co', combo:'Ci', after:'Na' },
  { emoji:'🐧', before:'Pin', combo:'Güi', after:'No' },
  { emoji:'🧅', before:'', combo:'Ce', after:'Bolla' },
  { emoji:'🏸', before:'Ra', combo:'Que', after:'Ta' },
  { emoji:'🎩', before:'Ma', combo:'Gi', after:'A' },
];

export const LENGUAJE_MODULES = [
  {id:'vocales', label:'Vocales', open:true, key:'vocales'},
  {id:'silabas', label:'Sílabas', open:true, key:'silabas'},
  {id:'memorama', label:'Letras', open:true, key:'memorama'},
  {id:'palabras', label:'Palabras', open:true, key:'palabras'},
  {id:'comprension', label:'Comprensión', open:true, key:'comprension'},
  {id:'examenlengua1', label:'Examen Final', open:true, key:'examenlengua1'},
];
/* 6° nodo agregado (2026-08-09, "Examen Final") — mismas posiciones
   originales de los 5 nodos preservadas en píxeles reales (recalculadas
   para el nuevo height:600 en vez de 420) más un 6° paso continuando el
   mismo espaciado alternado (Δ18%/Δ36%, igual que Matemática 1° básico),
   verificado sin solapamiento con getBoundingClientRect(). */
export const LENGUAJE_POS = [{x:22,y:92},{x:68,y:76},{x:24,y:60},{x:70,y:44},{x:24,y:28},{x:70,y:12}];

export const LENGUAJE_MODULES_G2 = [
  {id:'combinaciones', label:'Combinaciones', open:true, key:'combinaciones'},
  {id:'secuencia', label:'Secuencia', open:true, key:'secuencia'},
  {id:'gramatica2', label:'Gramática', open:true, key:'gramatica2'},
  {id:'comprension2', label:'Comprensión II', open:true, key:'comprension2'},
  {id:'examenlengua2', label:'Examen Final', open:true, key:'examenlengua2'},
];
export const LENGUAJE_POS_G2 = [{x:22,y:87},{x:68,y:68},{x:24,y:50},{x:70,y:30},{x:24,y:10}];

/* Niveles de dificultad (2026-08-09, mismo pedido que el piloto de
   Matemática 1° básico — ver "Motor de minijuegos de opción múltiple" en
   CLAUDE.md). `nivel` opcional; sin argumento se comporta igual que antes
   (5 opciones + emoji, el comportamiento "normal" original). */
export function genVocalRound(nivel){
  const item = pick(VOCAL_WORDS);
  const vowels = ['A','E','I','O','U'];
  let opts;
  if(nivel==='facil'){
    const distract = shuffle(vowels.filter(function(v){ return v!==item.answer; })).slice(0,2);
    opts = shuffle([item.answer].concat(distract)).map(function(v){ return {label:v, value:v}; });
  }else{
    opts = shuffle(vowels).map(function(v){ return {label:v, value:v}; });
  }
  /* Difícil: se saca el emoji (la pista visual) y solo queda la palabra
     con su primera letra tapada — hay que decodificar la palabra leyendo
     el resto de las letras, no reconocer el dibujo. */
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+
      '<p class="prompt-word"><span class="blank">_</span>'+item.word.slice(1)+'</p>'+
      '<p class="prompt-hint">¿Con qué vocal empieza esta palabra?</p>',
    options: opts,
    correctValue: item.answer,
    speakText: item.word,
    cols: 4,
    explain: 'La palabra es <b>'+item.word+'</b>, empieza con la vocal <b>'+item.answer+'</b>.',
    recurso: '<b>A, E, I, O, U</b> son las 5 vocales del español. Se llaman así porque para decir su sonido solo abres la boca de una forma distinta cada vez, sin juntar los labios ni tocar los dientes con la lengua — por eso puedes cantarlas o alargarlas ("aaaa", "eeee"). Todas las demás letras (las consonantes) necesitan apoyarse en una vocal para sonar: intenta decir la "m" sola, y luego "ma" — ¿notas la diferencia? Toda sílaba en español tiene al menos una vocal. Por eso, reconocer con qué vocal empieza una palabra es el primer paso para aprender a leer: es el sonido más fácil de escuchar al principio, y te ayuda a separar la palabra en partes más pequeñas.',
  };
}

export function genPalabraRound(nivel){
  const item = pick(PALABRA_WORDS);
  let opts;
  if(nivel==='facil'){
    const distract = shuffle(item.opts).slice(0,1);
    opts = shuffle([item.word].concat(distract)).map(function(w){ return {label:w, value:w}; });
  }else{
    opts = shuffle([item.word].concat(item.opts)).map(function(w){ return {label:w, value:w}; });
  }
  /* Difícil: sin emoji — hay que escuchar la palabra (botón "Escuchar",
     ya usa speakText) y reconocerla ESCRITA entre las opciones, en vez de
     emparejarla con un dibujo. */
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: showEmoji
      ? '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué palabra corresponde a esta imagen?</p>'
      : '<p class="prompt-hint">Escucha 🔊 y elige la palabra correcta.</p>',
    options: opts,
    correctValue: item.word,
    speakText: item.word,
    cols: 4,
    kind: 'word',
    explain: 'La palabra correcta es <b>'+item.word+'</b>.',
    recurso: 'Una palabra es un grupo de sonidos que juntos representan algo: un objeto, un animal, una acción. Cuando miras un dibujo y eliges la palabra que le corresponde, tu cerebro está haciendo algo muy importante: conectando lo que ves con lo que se dice en voz alta. Esa conexión se llama <b>comprensión lectora</b>, y es la base de saber leer de verdad — no basta con reconocer letras, hay que entender qué significan juntas. Las palabras se arman uniendo sílabas, como piezas de un rompecabezas: "GA-TO" son 2 piezas que forman "GATO". Practicar con dibujos ayuda porque el cerebro aprende más rápido cuando une una imagen con una palabra, en vez de memorizar letras sueltas sin sentido.',
  };
}

export function genComprensionRound(nivel){
  const item = pick(COMPRENSION_BANK);
  let opts;
  if(nivel==='facil'){
    const distract = shuffle(item.opts).slice(0,1);
    opts = shuffle([item.correct].concat(distract)).map(function(e){ return {label:e, value:e}; });
  }else{
    opts = shuffle([item.correct].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  }
  /* Difícil: se oculta la oración escrita — hay que escucharla (🔊,
     speakText ya trae el texto completo) y responder de memoria, en vez
     de tenerla siempre visible mientras se responde. */
  const showText = nivel !== 'dificil';
  return {
    promptHTML: (showText ? '<p class="prompt-sentence">'+item.text+'</p>' : '')+'<p class="prompt-hint">'+item.question+'</p>',
    options: opts,
    correctValue: item.correct,
    speakText: item.text,
    cols: 4,
    explain: 'Vuelve a leer: "'+item.text+'" Ahí está la respuesta.',
    recurso: '<b>Comprender</b> un texto es distinto a solo "leerlo". Leer es reconocer las palabras; comprender es entender qué significan y qué está pasando en la historia. Para comprender bien, tu cerebro hace varias cosas a la vez: recuerda las palabras que acabas de leer, imagina la escena como una película, y busca la respuesta a la pregunta dentro de lo que leyó — no fuera de eso. Por eso, si no estás seguro de una respuesta, la mejor estrategia es <b>volver a leer el texto</b> con calma, en vez de adivinar. Esta habilidad se llama comprensión lectora, y es una de las más importantes que aprenderás en el colegio: te sirve para estudiar cualquier materia, no solo Lenguaje, porque casi todo lo que aprendes viene escrito en algún texto.',
  };
}

/* "Examen Final" (mismo patrón que el piloto de Matemática 1° básico):
   mezcla los 3 módulos de Lenguaje que son compatibles con el motor de
   opción múltiple (Vocales/Palabras/Comprensión) y los 3 niveles al azar.
   Sílabas (games/silabas.js) y Letras (memorama, games/memorama.js) NO se
   incluyen a propósito: son mecánicas propias (arrastrar/emparejar
   cartas), incompatibles con el formato {promptHTML, options,
   correctValue} que este examen necesita — quedan como sus propios
   juegos independientes, sin cambios. */
export function genExamenLenguaje1Round(){
  const gens = [genVocalRound, genPalabraRound, genComprensionRound];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* Niveles (2026-08-11, continuación del rollout a 2° básico): fácil reduce
   a 2 opciones; difícil saca el emoji de apoyo, dejando solo la palabra con
   el hueco — hay que decodificar leyendo antes/después, no reconocer el
   dibujo. */
export function genCombinacionRound(nivel){
  const item = pick(COMBO_WORDS);
  let distract = shuffle(ALL_COMBOS.filter(function(c){ return c!==item.combo; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.combo].concat(distract)).map(function(c){ return {label:c, value:c}; });
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+
      '<p class="prompt-word">'+item.before+'<span class="blank">_</span>'+item.after+'</p>'+
      '<p class="prompt-hint">¿Qué combinación completa la palabra?</p>',
    options: opts,
    correctValue: item.combo,
    speakText: item.before+item.combo+item.after,
    cols: 4,
    explain: 'La palabra es <b>'+item.before+item.combo+item.after+'</b>.',
    recurso: 'Las combinaciones silábicas (como "bra", "cla", "tri", "pla") son grupos de 2 o 3 letras que aparecen juntas dentro de muchas palabras del español, formando una sola sílaba con un sonido más complejo que las sílabas simples que ya conoces (como "ma" o "pe"). Reconocer estas combinaciones te ayuda a leer palabras más largas y difíciles con más confianza, porque en vez de leer letra por letra, aprendes a reconocer el "bloque" completo de una vez. Es un paso importante entre aprender sílabas simples y poder leer textos completos con fluidez.',
  };
}

/* ---------------- Contenido Lenguaje 2° Básico: Gramática y Comprensión II ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/lenguaje-comunicacion/2-basico):
   Gramática -> OA19 (función de artículos, sustantivos y adjetivos) y OA20
   (concordancia de género y número). Comprensión II -> OA03, OA05, OA07
   (estrategias de comprensión, narraciones con inferencia, textos no literarios). */
const ADJ_FORMS = [
  { base:'Alto', M_S:'Alto', F_S:'Alta', M_P:'Altos', F_P:'Altas' },
  { base:'Bonito', M_S:'Bonito', F_S:'Bonita', M_P:'Bonitos', F_P:'Bonitas' },
  { base:'Pequeño', M_S:'Pequeño', F_S:'Pequeña', M_P:'Pequeños', F_P:'Pequeñas' },
  { base:'Contento', M_S:'Contento', F_S:'Contenta', M_P:'Contentos', F_P:'Contentas' },
  { base:'Ordenado', M_S:'Ordenado', F_S:'Ordenada', M_P:'Ordenados', F_P:'Ordenadas' },
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
  { texto:'El gato negro corre', sustantivo:'Gato', adjetivo:'Negro', otras:['El','Corre'] },
  { texto:'La casa grande brilla', sustantivo:'Casa', adjetivo:'Grande', otras:['La','Brilla'] },
  { texto:'Un perro pequeño ladra', sustantivo:'Perro', adjetivo:'Pequeño', otras:['Un','Ladra'] },
  { texto:'Las flores bonitas crecen', sustantivo:'Flores', adjetivo:'Bonitas', otras:['Las','Crecen'] },
  { texto:'El pájaro azul canta', sustantivo:'Pájaro', adjetivo:'Azul', otras:['El','Canta'] },
  { texto:'La niña feliz salta', sustantivo:'Niña', adjetivo:'Feliz', otras:['La','Salta'] },
];

/* Niveles (2026-08-11): fácil reduce ambas ramas a 2 opciones; normal y
   difícil quedan iguales al original (ya es puramente textual, sin ningún
   apoyo visual que ocultar — mismo criterio ya usado en la rama de
   Posición de Geometría2, donde no todo módulo necesita 3 comportamientos
   distintos). */
export function genGramatica2Round(nivel){
  const recurso = 'El <b>sustantivo</b> es la palabra que nombra a una persona, animal, cosa o lugar (perro, casa, niña), y el <b>adjetivo</b> es la palabra que describe cómo es ese sustantivo (grande, feliz, roja). En español, el adjetivo debe "concordar" con el sustantivo que describe: si el sustantivo es femenino y plural (como "las niñas"), el adjetivo también debe ser femenino y plural ("bonitas", no "bonito"). Fijarte en esta concordancia te ayuda a hablar y escribir correctamente, y a reconocer con más facilidad cuál palabra de una oración nombra algo y cuál lo describe.';
  if(Math.random()<0.5){
    const suj = pick(SUJETOS_CONCORDANCIA);
    const adj = pick(ADJ_FORMS);
    const correct = adj[suj.genero+'_'+suj.numero];
    const allForms = [adj.M_S, adj.F_S, adj.M_P, adj.F_P].filter(function(f,i,arr){ return arr.indexOf(f)===i; });
    let distract = allForms.filter(function(f){ return f!==correct; });
    if(nivel==='facil'){ distract = shuffle(distract).slice(0,1); }
    const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+suj.texto+' es muy <span class="blank">___</span>.</p><p class="prompt-hint">¿Qué palabra completa la oración?</p>',
      options: opts, correctValue: correct, speakText: suj.texto+' es muy...', cols:4, kind:'word',
      explain: '"'+suj.texto+'" concuerda con <b>'+correct+'</b> en género y número.',
      recurso: recurso,
    };
  }
  const item = pick(ORACIONES_GRAMATICA);
  const askSustantivo = Math.random()<0.5;
  const correct = askSustantivo ? item.sustantivo : item.adjetivo;
  const otherTarget = askSustantivo ? item.adjetivo : item.sustantivo;
  let rest = [otherTarget].concat(item.otras);
  if(nivel==='facil'){ rest = shuffle(rest).slice(0,1); }
  const opts = shuffle([correct].concat(rest)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.texto+'"</p><p class="prompt-hint">¿Cuál palabra es el '+(askSustantivo ? 'sustantivo (nombra a alguien o algo)' : 'adjetivo (dice cómo es)')+'?</p>',
    options: opts, correctValue: correct, speakText: item.texto, cols:4, kind:'word',
    explain: '<b>'+correct+'</b> es el '+(askSustantivo ? 'sustantivo' : 'adjetivo')+' de la oración.',
    recurso: recurso,
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

/* Niveles (2026-08-11): fácil reduce a 2 opciones; difícil oculta el texto
   escrito — hay que escucharlo (🔊, speakText ya trae el texto completo) y
   responder de memoria, mismo criterio ya usado en Comprensión de 1°
   básico. */
export function genComprension2Round(nivel){
  const item = pick(COMPRENSION2_BANK);
  let distract = item.opts;
  if(nivel==='facil'){ distract = shuffle(distract).slice(0,1); }
  const opts = shuffle([item.correct].concat(distract)).map(function(o){ return {label:o, value:o}; });
  const kind = /^[A-ZÁÉÍÓÚÑ]/.test(item.correct) ? 'word' : undefined;
  const showText = nivel !== 'dificil';
  return {
    promptHTML: (showText ? '<p class="prompt-sentence">'+item.text+'</p>' : '')+'<p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols: kind ? 2 : 4, kind: kind, panel: kind==='word',
    explain: item.reason,
    recurso: 'Este tipo de pregunta te pide algo más difícil que solo recordar lo que leíste: te pide <b>inferir</b>, es decir, deducir algo que el texto no dice directamente, usando pistas. Por ejemplo, si el texto dice que "el cielo se puso gris y empezó a caer agua", no dice la palabra "lluvia", pero tú puedes deducirlo por esas pistas. Para inferir bien, fíjate en detalles como acciones, sensaciones o el orden en que pasan las cosas, y pregúntate "¿qué explicación tiene más sentido con estas pistas?". Esta habilidad es distinta a memorizar: es usar lo que sabes del mundo para entender lo que un texto sugiere sin decirlo explícitamente.',
  };
}

/* "Examen Final" 2° básico Lenguaje: mezcla Combinaciones/Gramática/
   Comprensión II + los 3 niveles al azar. Secuencia (games/secuencia.js)
   queda fuera, mismo criterio que Sílabas/Letras en el examen de 1°
   básico: mecánica propia, no devuelve {promptHTML,options,correctValue}. */
export function genExamenLenguaje2Round(){
  const gens = [genCombinacionRound, genGramatica2Round, genComprension2Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenlengua3', label:'Examen Final', open:true, key:'examenlengua3'},
];
export const LENGUAJE_POS_G3 = [{x:22,y:94},{x:68,y:80},{x:24,y:65},{x:70,y:51},{x:24,y:37},{x:70,y:22},{x:24,y:8}];

const GENEROS_BANK = [
  { desc:'Un texto breve con ritmo y a veces con rima, que expresa sentimientos.', label:'Poema' },
  { desc:'Texto que usa versos, y a veces rima, para expresar una emoción.', label:'Poema' },
  { desc:'Una historia corta e inventada, con personajes que enfrentan un problema y lo resuelven.', label:'Cuento' },
  { desc:'Una historia breve con animales que hablan y actúan como personas, y que termina con una enseñanza.', label:'Fábula' },
  { desc:'Un cuento donde los animales hablan para enseñarnos una moraleja.', label:'Fábula' },
  { desc:'Una historia tradicional que se cuenta de generación en generación, mezclando hechos reales con elementos fantásticos.', label:'Leyenda' },
  { desc:'Una historia antigua que explica el origen del mundo o de la naturaleza, protagonizada por dioses o héroes.', label:'Mito' },
  { desc:'Una historia larga, dividida en capítulos, con varios personajes y una trama que se desarrolla poco a poco.', label:'Novela' },
  { desc:'Una historia contada con dibujos en secuencia y globos de diálogo.', label:'Historieta' },
  { desc:'Relato que se lee como una serie de viñetas con imágenes y texto.', label:'Historieta' },
];
const GENEROS_POOL = ['Poema','Cuento','Fábula','Leyenda','Mito','Novela','Historieta'];

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
  { texto:'Después de subir la montaña, el grupo llegó ', palabra:'Exhausto', resto:' al campamento.', significado:'Muy cansado', opts:['Muy alegre','Con mucho frío','Muy asustado'] },
  { texto:'El mago hizo un truco tan ', palabra:'Asombroso', resto:' que todos aplaudieron sorprendidos.', significado:'Que sorprende mucho', opts:['Aburrido','Muy simple','Peligroso'] },
  { texto:'La biblioteca estaba en ', palabra:'Penumbra', resto:' porque se había cortado la luz.', significado:'Poca luz, casi oscuro', opts:['Mucha luz','Lleno de gente','Muy ordenado'] },
  { texto:'El cachorro era tan ', palabra:'Diminuto', resto:' que cabía en la palma de la mano.', significado:'Muy pequeño', opts:['Muy grande','Muy ruidoso','Muy rápido'] },
  { texto:'El científico observó el experimento con gran ', palabra:'Cautela', resto:' para no equivocarse.', significado:'Cuidado y precaución', opts:['Rapidez sin pensar','Aburrimiento','Enojo'] },
  { texto:'La noticia del premio lo dejó ', palabra:'Atónito', resto:', sin poder decir ni una palabra.', significado:'Muy sorprendido', opts:['Muy enojado','Con sueño','Aburrido'] },
  { texto:'El camino hacia el pueblo era largo y ', palabra:'Sinuoso', resto:', lleno de curvas.', significado:'Con muchas curvas', opts:['Muy recto','Muy corto','Muy ancho'] },
  { texto:'Después de la tormenta, el cielo quedó ', palabra:'Despejado', resto:' y soleado.', significado:'Sin nubes', opts:['Muy nublado','Lleno de lluvia','Con mucho viento'] },
  { texto:'El abuelo contaba historias con una voz ', palabra:'Pausada', resto:' y tranquila.', significado:'Lenta y calmada', opts:['Muy rápida','Muy fuerte y gritona','Muy aguda'] },
  { texto:'La receta pedía una ', palabra:'Pizca', resto:' de sal, apenas un poquito.', significado:'Una cantidad muy pequeña', opts:['Una cantidad enorme','La mitad del total','Ninguna cantidad'] },
];

const ALFABETICO_POOL = ['Ardilla','Ballena','Caballo','Delfín','Elefante','Foca','Gato','Hormiga','Iguana','Jirafa','Koala','León','Mariposa','Nutria','Oso','Pato'];

const ORACIONES_GRAMATICA_G3 = [
  { texto:'El gato negro corre', articulo:'El', sustantivo:'Gato', adjetivo:'Negro', otras:['Corre'] },
  { texto:'La casa grande brilla', articulo:'La', sustantivo:'Casa', adjetivo:'Grande', otras:['Brilla'] },
  { texto:'Un perro pequeño ladra', articulo:'Un', sustantivo:'Perro', adjetivo:'Pequeño', otras:['Ladra'] },
  { texto:'Las flores bonitas crecen', articulo:'Las', sustantivo:'Flores', adjetivo:'Bonitas', otras:['Crecen'] },
  { texto:'El pájaro azul canta', articulo:'El', sustantivo:'Pájaro', adjetivo:'Azul', otras:['Canta'] },
  { texto:'Una niña feliz salta', articulo:'Una', sustantivo:'Niña', adjetivo:'Feliz', otras:['Salta'] },
];
const PRONOMBRES_BANK = [
  { texto:'Los niños jugaban en el patio. ___ se divertían mucho.', correcto:'Ellos' },
  { texto:'Mi hermana estudia mucho. ___ quiere ser doctora.', correcto:'Ella' },
  { texto:'El profesor explicó la tarea. ___ fue muy claro.', correcto:'Él' },
  { texto:'Las flores del jardín son hermosas. ___ tienen muchos colores.', correcto:'Ellas' },
  { texto:'Tomás y yo iremos al cine. ___ compraremos palomitas.', correcto:'Nosotros' },
  { texto:'Mi abuela cocina muy rico. ___ hace pasteles los domingos.', correcto:'Ella' },
  { texto:'Los pájaros cantan en la mañana. ___ despiertan a todos.', correcto:'Ellos' },
  { texto:'Mi papá arregla el auto. ___ sabe mucho de mecánica.', correcto:'Él' },
];
const PRONOMBRES_POOL = ['Él','Ella','Ellos','Ellas','Nosotros'];

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
const GENERO_ARTICULO = { Poema:'un', Cuento:'un', Fábula:'una', Leyenda:'una', Mito:'un', Novela:'una', Historieta:'una' };
/* Niveles (2026-08-11, rollout a 3° básico): en general fácil reduce
   opciones y difícil oculta el texto de apoyo cuando existe (Comprensión
   III); en generadores puramente textuales sin ningún visual que ocultar,
   difícil sube la cantidad de datos a comparar en vez de ocultar algo
   (Orden Alfabético). */
export function genGenerosLiterarios3Round(nivel){
  const recurso = 'Los géneros literarios son categorías que agrupan los textos según sus características comunes: un <b>cuento</b> es una historia corta con pocos personajes, una <b>fábula</b> usa animales que hablan para enseñar una moraleja, una <b>leyenda</b> mezcla hechos reales con elementos fantásticos para explicar el origen de algo, un <b>mito</b> explica fenómenos naturales o el origen del mundo con dioses o seres sobrenaturales, y un <b>poema</b> usa el ritmo y la rima para expresar emociones. Reconocer estas diferencias te ayuda a saber qué esperar de un texto antes de leerlo completo, y a entender mejor la intención de quien lo escribió.';
  const item = pick(GENEROS_BANK);
  let distract = shuffle(GENEROS_POOL.filter(function(g){ return g!==item.label; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.label].concat(distract)).map(function(g){ return {label:g, value:g}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'</p><p class="prompt-hint">¿Qué género literario es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa descripción corresponde a '+GENERO_ARTICULO[item.label]+' <b>'+item.label.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genComprension3Round(nivel){
  const item = pick(COMPRENSION3_BANK);
  let distract = item.opts;
  if(nivel==='facil'){ distract = shuffle(distract).slice(0,1); }
  const opts = shuffle([item.correct].concat(distract)).map(function(o){ return {label:o, value:o}; });
  const showText = nivel !== 'dificil';
  return {
    promptHTML: (showText ? '<p class="prompt-sentence">'+item.text+'</p>' : '')+'<p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
    explain: item.reason,
    recurso: 'Comprender un texto a fondo va más allá de reconocer las palabras: incluye <b>inferir</b> lo que no se dice directamente (deducir con pistas), entender <b>lenguaje figurado</b> (frases que no significan literalmente lo que dicen, como "se me heló la sangre"), y distinguir información de textos no literarios (que informan hechos reales, a diferencia de un cuento). Practicar estas distintas formas de comprensión te prepara para leer cualquier tipo de texto —cuentos, noticias, instrucciones— entendiendo realmente su mensaje, no solo las palabras sueltas.',
  };
}

export function genVocabulario3Round(nivel){
  const recurso = 'Cuando encuentras una palabra que no conoces en un texto, no siempre necesitas un diccionario: muchas veces el <b>contexto</b> (las palabras y oraciones que rodean a esa palabra) te da pistas suficientes para deducir su significado. Por ejemplo, si una oración dice "el perro estaba famélico, así que devoró su comida en segundos", puedes deducir que "famélico" significa "con mucha hambre", aunque nunca hayas visto esa palabra antes. Esta habilidad de usar el contexto para descubrir significados es mucho más útil en la vida real que memorizar listas de palabras, porque te sirve con cualquier palabra nueva que encuentres.';
  const item = pick(VOCABULARIO3_BANK);
  let distract = item.opts;
  if(nivel==='facil'){ distract = shuffle(distract).slice(0,1); }
  const opts = shuffle([item.significado].concat(distract)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'<b>'+item.palabra+'</b>'+item.resto+'</p><p class="prompt-hint">¿Qué significa la palabra <b>'+item.palabra.toLowerCase()+'</b>?</p>',
    options: opts, correctValue: item.significado, speakText: item.texto+item.palabra+item.resto, cols:2, panel:true,
    explain: '<b>'+item.palabra+'</b> significa "'+item.significado.toLowerCase()+'".',
    recurso: recurso,
  };
}

/* Fácil compara solo 3 palabras (más fácil ordenar mentalmente); difícil
   compara 5 (más elementos para tener en cuenta). Las opciones son las
   mismas palabras mostradas, así que no se pueden reducir por separado. */
export function genAlfabetico3Round(nivel){
  const recurso = 'El <b>orden alfabético</b> es la forma estándar de organizar palabras según la posición de sus letras en el abecedario (A, B, C... hasta la Z) — así se ordenan los diccionarios, las guías telefónicas y muchas listas. Para ordenar palabras, primero comparas su primera letra; si es igual, comparas la segunda letra, y así sucesivamente. Saber ordenar alfabéticamente es una habilidad práctica que usarás toda la vida: te permite encontrar rápido una palabra en el diccionario, un libro en una biblioteca, o un nombre en una lista larga, sin tener que revisar uno por uno desde el principio.';
  const wordCount = nivel==='facil' ? 3 : nivel==='dificil' ? 5 : 4;
  const words = shuffle(ALFABETICO_POOL).slice(0,wordCount);
  const sorted = words.slice().sort();
  const askFirst = Math.random()<0.5;
  const correct = askFirst ? sorted[0] : sorted[sorted.length-1];
  const opts = shuffle(words).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:22px;">'+words.join(' — ')+'</p><p class="prompt-hint">¿Cuál de estas palabras aparece '+(askFirst?'primero':'al final')+' en el orden alfabético?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál palabra va '+(askFirst?'primero':'al final')+' en orden alfabético?', cols:4, kind:'word',
    explain: 'En orden alfabético: '+sorted.join(' → ')+'. La respuesta '+(askFirst?'que va primero':'que va al final')+' es <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genGramatica3Round(nivel){
  const recurso = 'En una oración, el <b>sustantivo</b> nombra a alguien o algo, el <b>adjetivo</b> describe cómo es, y el <b>artículo</b> (el, la, un, una, los, las) va antes del sustantivo para indicar si es específico o general, y en qué género y número está. Los <b>pronombres</b> (yo, tú, él, ella, nosotros) son palabras que reemplazan a un sustantivo ya mencionado antes, para no repetir el mismo nombre una y otra vez en un texto — por ejemplo, en vez de decir "María fue al parque, María jugó, María volvió a casa", puedes decir "María fue al parque, ella jugó, luego volvió a casa". Reconocer estas categorías gramaticales te ayuda a entender mejor cómo se arma una oración en español.';
  if(Math.random()<0.5){
    const item = pick(ORACIONES_GRAMATICA_G3);
    const roll = Math.random();
    const kind = roll<0.34 ? 'sustantivo' : (roll<0.67 ? 'adjetivo' : 'articulo');
    const correct = item[kind];
    let rest = ['sustantivo','adjetivo','articulo'].filter(function(k){ return k!==kind; }).map(function(k){ return item[k]; }).concat(item.otras);
    if(nivel==='facil'){ rest = shuffle(rest).slice(0,1); }
    const opts = shuffle(rest.concat([correct])).map(function(w){ return {label:w, value:w}; });
    const kindLabel = kind==='sustantivo' ? 'sustantivo (nombra a alguien o algo)' : kind==='adjetivo' ? 'adjetivo (dice cómo es)' : 'artículo (el/la/un/una/los/las)';
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.texto+'"</p><p class="prompt-hint">¿Cuál palabra es el '+kindLabel+'?</p>',
      options: opts, correctValue: correct, speakText: item.texto, cols:4, kind:'word',
      explain: '<b>'+correct+'</b> es el '+kind+' de la oración.',
      recurso: recurso,
    };
  }
  const item = pick(PRONOMBRES_BANK);
  let distract = shuffle(PRONOMBRES_POOL.filter(function(p){ return p!==item.correcto; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.correcto].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Qué pronombre completa la oración?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace('___', item.correcto), cols:4, kind:'word',
    explain: 'El pronombre correcto es <b>'+item.correcto+'</b>, porque reemplaza a quien se menciona en la primera oración.',
    recurso: recurso,
  };
}

/* Ya binario (2 opciones), sin ningún visual que ocultar — fácil/normal/
   difícil se comportan igual, mismo criterio ya usado en Posición de
   Geometría2 (2° básico) cuando el original ya era el mínimo posible. */
export function genOrtografia3Round(nivel){
  const item = pick(ORTOGRAFIA_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: 'La forma correcta es: "'+item.correcta+'"',
    recurso: 'La ortografía tiene reglas específicas que muchas veces no se "escuchan" al hablar, por eso hay que aprenderlas de memoria y practicarlas al escribir: por ejemplo, los días de la semana en español NO llevan mayúscula (se escribe "lunes", no "Lunes", a diferencia del inglés), y el uso de mayúsculas se reserva para nombres propios, el inicio de una oración, o después de un punto. Escribir con buena ortografía no es solo una formalidad — ayuda a que tu texto se entienda con claridad y se vea como algo cuidado y bien pensado, algo que se valora en la escuela y en la vida adulta.',
  };
}

/* "Examen Final" 3° básico Lenguaje: mezcla los 6 módulos del año + los 3
   niveles al azar. */
export function genExamenLenguaje3Round(){
  const gens = [genGenerosLiterarios3Round, genComprension3Round, genVocabulario3Round, genAlfabetico3Round, genGramatica3Round, genOrtografia3Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenlengua4', label:'Examen Final', open:true, key:'examenlengua4'},
];
export const LENGUAJE_POS_G4 = [{x:22,y:92},{x:68,y:71},{x:24,y:50},{x:70,y:29},{x:24,y:6}];

const COMPRENSION4_BANK = [
  { text:'Diego dejó su bicicleta afuera durante toda la noche de tormenta, y al día siguiente encontró óxido en la cadena.', question:'¿Por qué la cadena se oxidó?', correct:'Porque quedó expuesta a la lluvia toda la noche', opts:['Porque era una bicicleta nueva','Porque Diego la lavó con jabón','Porque la guardó en su pieza'], reason:'La lluvia sobre el metal durante horas es lo que produce el óxido.' },
  { text:'Para cuidar tus dientes: cepíllalos después de cada comida, usa hilo dental una vez al día y visita al dentista cada 6 meses.', question:'¿Cada cuánto se recomienda visitar al dentista?', correct:'Cada 6 meses', opts:['Cada semana','Una vez al año','Solo cuando duele'], reason:'El texto lo dice explícitamente: "visita al dentista cada 6 meses".' },
  { text:'Cuando el equipo de Martina anotó el gol decisivo, ella sintió que le explotaba el corazón de la emoción.', question:"¿Qué significa 'le explotaba el corazón de la emoción'?", correct:'Que sintió una emoción muy intensa', opts:['Que su corazón dejó de latir','Que se lastimó el pecho','Que sintió mucho frío'], reason:'Es lenguaje figurado para describir una emoción muy fuerte, no un hecho literal.' },
  { text:'El explorador avanzaba con pasos de gigante por la selva, decidido a llegar antes del anochecer.', question:"¿Qué significa que avanzaba 'con pasos de gigante'?", correct:'Que caminaba muy rápido, con pasos largos y decididos', opts:['Que era literalmente un gigante','Que caminaba muy despacio','Que se perdió en la selva'], reason:'Es una comparación (lenguaje figurado) para expresar rapidez y decisión.' },
  { text:'Rodrigo practicó su triple salto todos los días durante un mes antes de la competencia regional.', question:'¿Qué podemos inferir sobre Rodrigo?', correct:'Que se preparó con dedicación y disciplina para competir', opts:['Que no le interesaba ganar','Que improvisó el día de la competencia','Que se aburrió de entrenar'], reason:'Practicar todos los días durante un mes muestra dedicación y disciplina.' },
  { text:'Para armar un velero de papel: dobla la hoja por la mitad, forma un triángulo en cada extremo, y despliega las alas del barco.', question:'¿Qué haces primero para armar el velero?', correct:'Doblar la hoja por la mitad', opts:['Desplegar las alas del barco','Formar los triángulos','Recortar la hoja en cuadrados'], reason:'El texto indica el primer paso: "dobla la hoja por la mitad".' },
  { text:'Un cuento corto donde un zorro astuto engaña a un cuervo para que suelte su queso, y termina con una moraleja sobre la vanidad.', question:'¿Qué género literario es este texto?', correct:'Fábula', opts:['Novela','Historieta','Mito'], reason:'Es una fábula: animales que actúan como personas y una moraleja al final.' },
  { text:'Una historia extensa dividida en 20 capítulos, que sigue las aventuras de varios personajes a lo largo de varios años.', question:'¿Qué género literario es este texto?', correct:'Novela', opts:['Poema','Fábula','Historieta'], reason:'Una historia larga dividida en capítulos es una novela.' },
  { text:'Una historia antigua que explica por qué el sol cruza el cielo cada día, protagonizada por un dios que conduce un carro de fuego.', question:'¿Qué género literario es este texto?', correct:'Mito', opts:['Historieta','Novela','Fábula'], reason:'Un relato antiguo con dioses que explica un fenómeno natural es un mito.' },
  { text:'Camila guardaba sus ahorros en una alcancía en forma de cerdo, contando las monedas cada domingo antes de dormir.', question:'¿Qué podemos inferir sobre Camila?', correct:'Que es cuidadosa y constante con sus ahorros', opts:['Que gasta todo su dinero de inmediato','Que no le interesa el dinero','Que perdió su alcancía'], reason:'Contar sus ahorros cada semana muestra que es constante y cuidadosa con el dinero.' },
];

/* Además de sinónimo-por-contexto (como en Vocabulario de 3° básico), se
   agrega el ángulo de prefijos/sufijos que menciona explícitamente OA10:
   cómo un prefijo cambia el significado de una palabra base. */
const VOCABULARIO4_CONTEXTO_BANK = [
  { texto:'El científico hizo un ', palabra:'Minucioso', resto:' análisis de cada muestra, revisando cada detalle.', significado:'Muy detallado y cuidadoso', opts:['Muy rápido y descuidado','Aburrido','Peligroso'] },
  { texto:'La actriz recibió una ', palabra:'Ovación', resto:' del público al terminar la obra.', significado:'Un aplauso largo y entusiasta', opts:['Una crítica negativa','Un silencio incómodo','Una pregunta'] },
  { texto:'El terreno era tan ', palabra:'Árido', resto:' que casi ninguna planta lograba crecer ahí.', significado:'Muy seco, con poca agua', opts:['Muy húmedo y fértil','Cubierto de nieve','Lleno de árboles'] },
  { texto:'Su respuesta fue tan ', palabra:'Ambigua', resto:' que nadie entendió si estaba de acuerdo o no.', significado:'Que se puede entender de más de una forma', opts:['Muy clara y directa','Muy grosera','Muy larga'] },
  { texto:'El abuelo era conocido por su ', palabra:'Generosidad', resto:', siempre dispuesto a ayudar sin esperar nada a cambio.', significado:'La cualidad de dar y compartir con otros', opts:['La cualidad de guardar todo para sí mismo','El miedo a las alturas','La costumbre de dormir temprano'] },
];
const PREFIJOS_BANK = [
  { prefijo:'Des-', ejemplo:'Deshacer', significadoPrefijo:'Indica que se deshace o revierte la acción', base:'Hacer' },
  { prefijo:'Re-', ejemplo:'Rehacer', significadoPrefijo:'Indica que la acción se repite', base:'Hacer' },
  { prefijo:'In-', ejemplo:'Incapaz', significadoPrefijo:'Indica negación: que no tiene esa cualidad', base:'Capaz' },
  { prefijo:'Pre-', ejemplo:'Precalentar', significadoPrefijo:'Indica que la acción ocurre antes', base:'Calentar' },
  { prefijo:'Sub-', ejemplo:'Submarino', significadoPrefijo:'Indica que algo está debajo de', base:'Marino' },
];

const ADVERBIOS_BANK = [
  { texto:'Caminaba LENTAMENTE por el parque.', palabra:'Lentamente', tipo:'Adverbio de modo' },
  { texto:'Llegaremos MAÑANA a la ciudad.', palabra:'Mañana', tipo:'Adverbio de tiempo' },
  { texto:'El gato duerme AQUÍ todas las tardes.', palabra:'Aquí', tipo:'Adverbio de lugar' },
  { texto:'Comió MUCHO en el almuerzo.', palabra:'Mucho', tipo:'Adverbio de cantidad' },
  { texto:'Ella canta MARAVILLOSAMENTE en el coro.', palabra:'Maravillosamente', tipo:'Adverbio de modo' },
  { texto:'Nos vemos AYER en la tarde.', palabra:'Ayer', tipo:'Adverbio de tiempo' },
  { texto:'El perro corre ALLÍ, cerca del árbol.', palabra:'Allí', tipo:'Adverbio de lugar' },
  { texto:'Estudió POCO para la prueba de mañana.', palabra:'Poco', tipo:'Adverbio de cantidad' },
];
const VERBOS_CONCORDANCIA_BANK = [
  { texto:'Los niños ___ en el patio.', correcto:'Juegan', malas:['Juega','Juego','Jugamos'] },
  { texto:'Mi hermana ___ todos los días al colegio.', correcto:'Camina', malas:['Caminan','Camino','Caminamos'] },
  { texto:'Nosotros ___ un libro nuevo cada mes.', correcto:'Leemos', malas:['Lee','Leen','Leo'] },
  { texto:'Yo ___ mi pieza todos los sábados.', correcto:'Ordeno', malas:['Ordena','Ordenan','Ordenamos'] },
  { texto:'Las plantas ___ agua para crecer.', correcto:'Necesitan', malas:['Necesita','Necesito','Necesitamos'] },
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

export function genComprension4Round(nivel){
  const item = pick(COMPRENSION4_BANK);
  const pool = nivel==='facil' ? [item.correct, item.opts[0]] : [item.correct].concat(item.opts);
  const opts = shuffle(pool).map(function(o){ return {label:o, value:o}; });
  const kind = /^[A-ZÁÉÍÓÚÑ]/.test(item.correct) ? 'word' : undefined;
  /* Difícil: el texto ya no queda visible en pantalla, hay que escucharlo
     con el botón 🔊 y responder de memoria — mismo criterio ya usado en
     Comprensión de años anteriores. */
  const textoHTML = nivel==='dificil' ? '' : '<p class="prompt-sentence">'+item.text+'</p>';
  return {
    promptHTML: textoHTML+'<p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols: kind?2:2, kind: kind, panel:true,
    explain: item.reason,
    recurso: 'Comprender un texto va mucho más allá de reconocer las palabras: incluye <b>inferir</b> (deducir algo que el texto no dice directamente, usando pistas del contexto — como saber que una bicicleta se oxidó porque quedó bajo la lluvia toda la noche), reconocer <b>lenguaje figurado</b> (frases que no se leen literalmente, como "le explotaba el corazón de la emoción", que expresa una emoción intensa, no un hecho real), identificar el <b>género literario</b> de un texto (fábula, mito, novela — cada uno con características propias), y extraer información explícita de <b>textos no literarios</b> (instrucciones, avisos, recomendaciones). Practicar estas estrategias te ayuda a entender no solo QUÉ dice un texto, sino también lo que sugiere entre líneas.',
  };
}

export function genVocabulario4Round(nivel){
  const recurso = 'Cuando no conoces una palabra, el <b>contexto</b> (las oraciones a su alrededor) casi siempre te da pistas suficientes para deducir su significado, sin necesidad de buscarla en un diccionario. Otra herramienta útil son los <b>prefijos</b>: partículas que se agregan al INICIO de una palabra base y cambian su significado de forma predecible — "des-" revierte una acción (hacer → deshacer), "re-" indica que se repite (hacer → rehacer), "in-" niega una cualidad (capaz → incapaz). Una vez que reconoces qué hace un prefijo, puedes deducir el significado de palabras nuevas que nunca habías visto, con tal de que conozcas su palabra base.';
  const count = nivel==='facil' ? 2 : 4;
  if(Math.random()<0.5){
    const item = pick(VOCABULARIO4_CONTEXTO_BANK);
    const opts = shuffle([item.significado].concat(item.opts.slice(0,count-1))).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'<b>'+item.palabra+'</b>'+item.resto+'</p><p class="prompt-hint">¿Qué significa la palabra <b>'+item.palabra.toLowerCase()+'</b>?</p>',
      options: opts, correctValue: item.significado, speakText: item.texto+item.palabra+item.resto, cols:2, panel:true,
      explain: '<b>'+item.palabra+'</b> significa "'+item.significado.toLowerCase()+'".',
      recurso: recurso,
    };
  }
  const item = pick(PREFIJOS_BANK);
  const distract = shuffle(PREFIJOS_BANK.filter(function(p){ return p.prefijo!==item.prefijo; })).slice(0,count-1).map(function(p){ return p.significadoPrefijo; });
  const opts = shuffle([item.significadoPrefijo].concat(distract)).map(function(s){ return {label:s, value:s}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.ejemplo+'</p><p class="prompt-hint">La palabra base es "'+item.base.toLowerCase()+'". ¿Qué indica el prefijo "'+item.prefijo.toLowerCase()+'" en esta palabra?</p>',
    options: opts, correctValue: item.significadoPrefijo, speakText: item.ejemplo, cols:2, panel:true,
    explain: 'El prefijo "'+item.prefijo.toLowerCase()+'" '+item.significadoPrefijo.toLowerCase()+'.',
    recurso: recurso,
  };
}

export function genGramatica4Round(nivel){
  const recurso = 'Un <b>adverbio</b> es una palabra que modifica a un verbo, dando más información sobre CÓMO (modo: lentamente), CUÁNDO (tiempo: mañana), DÓNDE (lugar: aquí) o CUÁNTO (cantidad: mucho) ocurre la acción — a diferencia de un adjetivo, que describe a un sustantivo, el adverbio siempre acompaña a un verbo. Por otro lado, la <b>concordancia sujeto-verbo</b> es la regla que exige que el verbo cambie su forma según quién realiza la acción: "yo camino", "tú caminas", "nosotros caminamos" — el mismo verbo "caminar" toma una terminación distinta según el sujeto, y una oración donde no concuerdan ("Los niños juega") suena incorrecta al oído porque rompe esta regla.';
  const count = nivel==='facil' ? 2 : 4;
  if(Math.random()<0.5){
    const item = pick(ADVERBIOS_BANK);
    const distract = shuffle(['Adverbio de modo','Adverbio de tiempo','Adverbio de lugar','Adverbio de cantidad'].filter(function(t){ return t!==item.tipo; })).slice(0,count-1);
    const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto.replace(item.palabra,'<b>'+item.palabra+'</b>')+'</p><p class="prompt-hint">¿Qué tipo de adverbio es la palabra en negrita?</p>',
      options: opts, correctValue: item.tipo, speakText: item.texto, cols:2, panel:true,
      explain: '"'+item.palabra+'" es un <b>'+item.tipo.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(VERBOS_CONCORDANCIA_BANK);
  const opts = shuffle([item.correcto].concat(item.malas.slice(0,count-1))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Qué verbo completa correctamente la oración?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace('___', item.correcto), cols:4, kind:'word',
    explain: '<b>'+item.correcto+'</b> concuerda correctamente con el sujeto de la oración.',
    recurso: recurso,
  };
}

export function genOrtografia4Round(nivel){
  const item = pick(ORTOGRAFIA4_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla,
    recurso: 'El español tiene varias reglas ortográficas que no se "escuchan" al hablar, así que hay que memorizarlas: las formas del verbo <b>ir</b> en pasado ("iba", "iban") siempre se escriben con B, nunca con V. La palabra <b>"hay"</b> (del verbo haber, indica que algo existe) se confunde fácilmente con <b>"ahí"</b> (que indica un lugar) y con <b>"ay"</b> (una exclamación) — aunque suenan parecido, cada una se usa en una situación distinta. La <b>tilde</b> (acento escrito) marca la sílaba donde cae la fuerza de la voz en palabras que, sin ella, se leerían mal o se confundirían con otra palabra (como "árbol", que sin tilde no seguiría la regla de las palabras graves).',
  };
}

export function genExamenLenguaje4Round(){
  const gens = [genComprension4Round, genVocabulario4Round, genGramatica4Round, genOrtografia4Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenlengua5', label:'Examen Final', open:true, key:'examenlengua5'},
];
export const LENGUAJE_POS_G5 = [{x:22,y:95},{x:68,y:77},{x:22,y:59},{x:68,y:41},{x:22,y:23},{x:68,y:5}];

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
  { escenario:'Un sitio web asegura "esta crema hace crecer el pelo en 3 días" pero no menciona ningún estudio, doctor ni fuente que lo respalde.', pregunta:'¿Esta afirmación tiene suficiente respaldo para creerla?', correcta:'No, porque no entrega ninguna fuente que la respalde', opts:['Sí, porque lo dice un sitio web','Sí, porque suena convincente','No importa si tiene fuentes o no'] },
  { escenario:'Un artículo de una revista científica explica un descubrimiento citando el estudio, la universidad donde se hizo y el nombre de los investigadores.', pregunta:'¿Este artículo entrega información confiable?', correcta:'Sí, porque cita fuentes verificables', opts:['No, porque es demasiado largo','No, porque habla de ciencia','Sí, pero solo si es gratis'] },
  { escenario:'Un anuncio dice: "todos los niños que compran nuestro cereal se convierten en los mejores deportistas del colegio".', pregunta:'¿Cuál es el propósito principal de este texto?', correcta:'Convencer a los niños de comprar el cereal', opts:['Informar sobre nutrición de forma objetiva','Enseñar reglas de un deporte','Dar instrucciones de cocina'] },
  { escenario:'Una noticia sobre el clima cita datos de la Dirección Meteorológica de Chile y explica cómo se hizo la medición.', pregunta:'¿Cuál es el propósito principal de este texto?', correcta:'Informar con datos verificables', opts:['Convencer de comprar un paraguas','Contar un cuento de fantasía','Expresar una opinión sin datos'] },
  { escenario:'Un mensaje de cadena en redes sociales dice "comparte esto o te pasará algo malo" sin dar ninguna explicación real.', pregunta:'¿Qué deberías hacer frente a este mensaje?', correcta:'No creerlo ni compartirlo, porque no tiene ningún respaldo', opts:['Compartirlo inmediatamente por si acaso','Creerlo porque lo envió un amigo','Ignorar si tiene respaldo o no'] },
  { escenario:'Un folleto de una farmacia explica los efectos de un medicamento citando al Instituto de Salud Pública y sugiere consultar a un médico.', pregunta:'¿Este folleto entrega información confiable?', correcta:'Sí, porque cita una fuente oficial y recomienda un experto', opts:['No, porque es un folleto impreso','No, porque menciona un medicamento','Sí, pero solo si tiene colores llamativos'] },
];
const IDEA_PRINCIPAL_BANK = [
  { parrafo:'El reciclaje ayuda a cuidar el planeta porque reduce la basura que llega a los vertederos, ahorra energía al reutilizar materiales, y disminuye la necesidad de extraer nuevos recursos naturales.', correcta:'El reciclaje beneficia al planeta de varias formas', opts:['El reciclaje solo sirve para el papel','Los vertederos son buenos para el planeta','Nunca se deben extraer recursos naturales'] },
  { parrafo:'Dormir suficientes horas es esencial para los niños: ayuda a la memoria, mejora el ánimo durante el día y permite que el cuerpo crezca y se recupere del cansancio.', correcta:'Dormir bien trae muchos beneficios para los niños', opts:['Dormir mucho hace que los niños crezcan menos','Solo los adultos necesitan dormir bien','El ánimo no tiene relación con el sueño'] },
  { parrafo:'Los volcanes se forman cuando el magma del interior de la Tierra sube a la superficie a través de grietas, y al enfriarse forma la roca que da origen a la montaña volcánica.', correcta:'Los volcanes se forman por el magma que sube y se enfría', opts:['Los volcanes siempre están en erupción','Los volcanes se forman solo con agua','El magma nunca llega a la superficie'] },
  { parrafo:'Practicar un deporte en equipo enseña a los niños a comunicarse, a respetar reglas y a valorar el esfuerzo de sus compañeros tanto como el propio.', correcta:'Los deportes en equipo enseñan valores importantes', opts:['Los deportes en equipo son solo para ganar premios','Jugar en equipo impide hacer amigos','Las reglas no importan en los deportes'] },
  { parrafo:'Las abejas no solo producen miel: también son esenciales para polinizar las flores de muchas plantas que después se convierten en frutas y verduras que comemos.', correcta:'Las abejas son importantes por la miel y por la polinización', opts:['Las abejas solo sirven para hacer miel','Las plantas no necesitan polinización','Las abejas no tienen relación con los alimentos'] },
];

export function genComprension5Round(nivel){
  const recurso = 'Comprender un texto va más allá de leer las palabras: incluye <b>inferir</b> (deducir información que el texto no dice directamente, usando pistas del relato), evaluar de forma crítica un texto no literario (revisar quién lo escribió, con qué propósito, y si entrega suficiente información para confiar en él), y encontrar la <b>idea principal</b> de un párrafo — la oración que resume de qué se trata todo lo demás. Estas estrategias sirven tanto para cuentos como para noticias, afiches o instrucciones, y son la base para leer con sentido crítico en vez de solo decodificar letras.';
  const distract = nivel==='facil' ? function(arr){ return arr.slice(0,1); } : function(arr){ return arr; };
  const textoHTML = function(t){ return nivel==='dificil' ? '<p class="prompt-hint">Escucha 🔊 el texto y responde.</p>' : '<p class="prompt-sentence">'+t+'</p>'; };
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(COMPRENSION5_NARRATIVA_BANK);
    const opts = shuffle([item.correct].concat(distract(item.opts))).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: textoHTML(item.text)+'<p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason, recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(COMPRENSION5_NOLITERARIO_BANK);
    const opts = shuffle([item.correct].concat(distract(item.opts))).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: textoHTML(item.text)+'<p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason, recurso: recurso,
    };
  }
  if(roll<0.75){
    const item = pick(EVALUAR_INFO_BANK);
    const opts = shuffle([item.correcta].concat(distract(item.opts))).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: textoHTML(item.escenario)+'<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.escenario, cols:2, panel:true,
      explain: 'La respuesta correcta es: <b>'+item.correcta+'</b>.', recurso: recurso,
    };
  }
  const item = pick(IDEA_PRINCIPAL_BANK);
  const opts = shuffle([item.correcta].concat(distract(item.opts))).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: textoHTML(item.parrafo)+'<p class="prompt-hint">¿Cuál oración resume mejor la idea principal del párrafo?</p>',
    options: opts, correctValue: item.correcta, speakText: item.parrafo, cols:2, panel:true,
    explain: 'La idea principal es: <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

const RECURSOS_POETICOS_BANK = [
  { verso:'El viento susurraba secretos entre las hojas del bosque.', recurso:'Personificación', explicacion:'Le da al viento una acción humana ("susurrar secretos") que en realidad no puede hacer.' },
  { verso:'La luna sonreía traviesa sobre el tejado de la casa.', recurso:'Personificación', explicacion:'Le da a la luna una expresión humana ("sonreía traviesa") que en realidad no tiene.' },
  { verso:'Sus ojos brillaban como dos estrellas en la noche.', recurso:'Comparación', explicacion:'Usa la palabra "como" para comparar los ojos con las estrellas.' },
  { verso:'Su voz era tan suave como una caricia.', recurso:'Comparación', explicacion:'Usa la palabra "como" para comparar la voz con una caricia.' },
  { verso:'El río corría cantando alegre entre las piedras.', recurso:'Personificación', explicacion:'Le da al río la capacidad humana de "cantar", que en realidad no tiene.' },
  { verso:'Sus manos eran frías como el hielo del invierno.', recurso:'Comparación', explicacion:'Usa la palabra "como" para comparar sus manos con el hielo.' },
  { verso:'El fuego devoraba con furia cada rincón del bosque.', recurso:'Personificación', explicacion:'Le da al fuego una acción y emoción humana ("devorar con furia").' },
  { verso:'El aroma del pan recién horneado inundaba toda la casa.', recurso:'Apela al olfato', explicacion:'Describe un olor (el aroma del pan) para que el lector casi pueda sentirlo.' },
  { verso:'El sonido de las campanas retumbaba dulce en el silencio de la plaza.', recurso:'Apela al oído', explicacion:'Describe un sonido (las campanas) para que el lector casi pueda escucharlo.' },
  { verso:'El sabor agridulce de la fruta madura llenó su boca.', recurso:'Apela al gusto', explicacion:'Describe un sabor (agridulce) para que el lector casi pueda saborearlo.' },
];
export function genRecursosPoeticos5Round(nivel){
  const recurso = 'Los poemas usan <b>recursos del lenguaje poético</b> para crear imágenes más vivas que una descripción normal. La <b>personificación</b> le da a algo que no es humano (el viento, la luna, el río) una acción o emoción propia de las personas. La <b>comparación</b> une dos ideas usando "como" para resaltar una semejanza ("brillaban como estrellas"). Y "apelar a los sentidos" significa describir algo de forma tan vívida (un olor, un sonido, un sabor) que el lector casi puede sentirlo mientras lee, aunque no esté presente en la escena.';
  const item = pick(RECURSOS_POETICOS_BANK);
  const todos = ['Personificación','Comparación','Apela al olfato','Apela al oído','Apela al gusto'];
  const distractCount = nivel==='facil' ? 1 : 3;
  const distract = shuffle(todos.filter(function(r){ return r!==item.recurso; })).slice(0,distractCount);
  const opts = shuffle([item.recurso].concat(distract)).map(function(r){ return {label:r, value:r}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.verso+'"</p><p class="prompt-hint">¿Qué recurso del lenguaje poético se usa en este verso?</p>',
    options: opts, correctValue: item.recurso, speakText: item.verso, cols:2, kind:'word', panel:true,
    explain: item.explicacion, recurso: recurso,
  };
}

const RAICES_AFIJOS_BANK = [
  { palabra:'Biólogo', raiz:'Bio', significadoRaiz:'Vida', significadoPalabra:'Persona que estudia los seres vivos' },
  { palabra:'Teléfono', raiz:'Tele', significadoRaiz:'A distancia', significadoPalabra:'Aparato para hablar a distancia' },
  { palabra:'Acuario', raiz:'Acua', significadoRaiz:'Agua', significadoPalabra:'Lugar donde se guardan animales acuáticos' },
  { palabra:'Autobiografía', raiz:'Auto', significadoRaiz:'Uno mismo', significadoPalabra:'Historia de la vida de una persona escrita por ella misma' },
  { palabra:'Geografía', raiz:'Geo', significadoRaiz:'Tierra', significadoPalabra:'Ciencia que estudia la superficie de la Tierra' },
  { palabra:'Fotografía', raiz:'Foto', significadoRaiz:'Luz', significadoPalabra:'Imagen capturada usando la luz' },
];
const MATICES_SINONIMOS_BANK = [
  { oracion:'Después del maratón, el corredor estaba ___.', mejor:'Exhausto', peor:'Un poco cansado', explicacion:'"Exhausto" transmite un cansancio extremo, mucho más intenso que "un poco cansado" — mejor para describir a alguien que acaba de correr un maratón.' },
  { oracion:'La sopa que preparó la abuela estaba ___.', mejor:'Deliciosa', peor:'Algo comestible', explicacion:'"Deliciosa" transmite un sabor muy agradable, mientras que "algo comestible" apenas dice que se puede comer — mucho menos elogioso.' },
  { oracion:'El examen fue tan difícil que Marco quedó ___.', mejor:'Desconcertado', peor:'Un poco confundido', explicacion:'"Desconcertado" transmite una confusión mucho más fuerte que "un poco confundido" — mejor para un examen muy difícil.' },
  { oracion:'La noticia de que ganó el premio lo dejó ___.', mejor:'Eufórico', peor:'Medianamente contento', explicacion:'"Eufórico" transmite una alegría intensa, mucho mayor que "medianamente contento" — mejor para una noticia tan buena.' },
  { oracion:'El silencio en la biblioteca era ___.', mejor:'Absoluto', peor:'Bastante notorio', explicacion:'"Absoluto" transmite que no había ningún ruido en lo absoluto, más preciso que "bastante notorio" para describir el silencio de una biblioteca.' },
];
export function genVocabulario5Round(nivel){
  const recurso = 'Muchas palabras se forman a partir de una <b>raíz</b> (una parte fija con un significado propio) que viene del griego o del latín — por ejemplo "bio" significa vida y aparece en biólogo, biografía, biología. Reconocer raíces ayuda a deducir el significado de palabras nuevas sin necesidad de buscarlas en el diccionario. Además, entre dos sinónimos casi siempre hay un <b>matiz</b> de intensidad: "exhausto" transmite mucho más cansancio que "un poco cansado" — elegir la palabra con la intensidad correcta hace que un texto comunique mejor lo que realmente se quiere decir.';
  if(Math.random()<0.5){
    const item = pick(RAICES_AFIJOS_BANK);
    const distractCount = nivel==='facil' ? 1 : 3;
    const distract = shuffle(RAICES_AFIJOS_BANK.filter(function(r){ return r.raiz!==item.raiz; })).slice(0,distractCount).map(function(r){ return r.significadoRaiz; });
    const opts = shuffle([item.significadoRaiz].concat(distract)).map(function(s){ return {label:s, value:s}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">Esta palabra contiene la raíz "'+item.raiz.toLowerCase()+'". ¿Qué significa esa raíz?</p>',
      options: opts, correctValue: item.significadoRaiz, speakText: item.palabra, cols:2, panel:true,
      explain: 'La raíz "'+item.raiz.toLowerCase()+'" significa <b>'+item.significadoRaiz.toLowerCase()+'</b>, por eso "'+item.palabra.toLowerCase()+'" significa: '+item.significadoPalabra.toLowerCase()+'.', recurso: recurso,
    };
  }
  const item = pick(MATICES_SINONIMOS_BANK);
  const opts = shuffle([{label:item.mejor, value:'mejor'},{label:item.peor, value:'peor'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">¿Cuál palabra transmite la idea con más fuerza e intensidad?</p>',
    options: opts, correctValue: 'mejor', speakText: item.oracion, cols:2, kind:'word',
    explain: item.explicacion, recurso: recurso,
  };
}

const CONJUGACION_BANK = [
  { texto:'Ayer, yo ___ (CAMINAR) hasta la escuela.', correcto:'Caminé', malas:['Camino','Caminaba','Caminará'] },
  { texto:'Mañana, ella ___ (ESTUDIAR) para la prueba.', correcto:'Estudiará', malas:['Estudió','Estudia','Estudiaba'] },
  { texto:'Todos los días, nosotros ___ (COMER) fruta en el recreo.', correcto:'Comemos', malas:['Comimos','Comerá','Comía'] },
  { texto:'El año pasado, tú ___ (VIAJAR) a la playa con tu familia.', correcto:'Viajaste', malas:['Viajas','Viajarás','Viajando'] },
  { texto:'Cuando era pequeño, yo ___ (JUGAR) todas las tardes en el parque.', correcto:'Jugaba', malas:['Jugaré','Juego','Jugué'] },
  { texto:'La próxima semana, ellos ___ (VISITAR) el museo.', correcto:'Visitarán', malas:['Visitaron','Visitan','Visitaban'] },
  { texto:'Ahora mismo, el perro ___ (CORRER) por el jardín.', correcto:'Corre', malas:['Corrió','Correrá','Corría'] },
  { texto:'Anoche, ustedes ___ (LEER) un cuento antes de dormir.', correcto:'Leyeron', malas:['Leen','Leerán','Leían'] },
];
export function genGramatica5Round(nivel){
  const recurso = 'La <b>conjugación de un verbo</b> cambia según cuándo ocurre la acción (presente, pasado o futuro) y quién la realiza (yo, tú, él/ella, nosotros, ellos). Las pistas como "ayer", "todos los días" o "mañana" indican en qué tiempo hay que conjugar el verbo: "ayer" pide pasado, "todos los días" pide presente, y "mañana" pide futuro. Elegir la conjugación correcta es clave para que una oración tenga sentido y sea gramaticalmente correcta.';
  const item = pick(CONJUGACION_BANK);
  const malas = nivel==='facil' ? item.malas.slice(0,1) : item.malas;
  const opts = shuffle([item.correcto].concat(malas)).map(function(v){ return {label:v, value:v}; });
  const textoMostrado = nivel==='dificil' ? item.texto.replace(/\s*\([^)]*\)/,'').replace('___','<span class="blank">___</span>') : item.texto.replace('___','<span class="blank">___</span>');
  return {
    promptHTML: '<p class="prompt-sentence">'+textoMostrado+'</p><p class="prompt-hint">¿Qué forma del verbo completa correctamente la oración?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace(/\s*\([^)]*\)/,'').replace('___', item.correcto), cols:4, kind:'word',
    explain: '<b>'+item.correcto+'</b> es la conjugación correcta del verbo para ese momento y esa persona.', recurso: recurso,
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
  const recurso = 'La ortografía correcta hace que un texto se lea sin confusión. Algunas reglas frecuentes: la <b>C, S y Z</b> pueden sonar parecido pero cada palabra tiene una forma correcta que hay que memorizar (césped, cerró, avestruz); las palabras <b>esdrújulas</b> (acento en la antepenúltima sílaba, como "música") siempre llevan tilde; y en un diálogo escrito, la <b>raya</b> (—) se usa tanto para indicar que habla un personaje como para separar la acotación del narrador ("—Ya llegamos —dijo el guía").';
  const item = pick(ORTOGRAFIA5_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla, recurso: recurso,
  };
}

export function genExamenLenguaje5Round(){
  const gens = [genComprension5Round, genRecursosPoeticos5Round, genVocabulario5Round, genGramatica5Round, genOrtografia5Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  { aviso:'Un aviso muestra a niños sonriendo mientras comen un cereal muy azucarado, con el texto "¡El desayuno favorito de los campeones!".', pregunta:'¿Cuál es la intención principal de este aviso?', correcta:'Convencer a los niños de comprar ese cereal', opts:['Informar de forma objetiva sobre nutrición','Enseñar una receta de cocina','Advertir sobre los riesgos del azúcar'] },
  { aviso:'Un comercial de zapatillas deportivas muestra a un jugador profesional anotando un punto decisivo, sugiriendo que esas zapatillas ayudan a ganar.', pregunta:'¿A qué público está dirigido principalmente este aviso?', correcta:'A personas interesadas en el deporte y que admiran a ese jugador', opts:['A personas que nunca hacen deporte','A bebés recién nacidos','A adultos mayores que no caminan'] },
  { aviso:'Un aviso de un jugo en caja dice "100% natural" en letras grandes, pero en la lista de ingredientes (letra pequeña) aparece azúcar añadida.', pregunta:'¿Por qué es importante leer la lista de ingredientes completa y no solo el eslogan?', correcta:'Porque el eslogan puede no mostrar toda la información real del producto', opts:['Porque la letra pequeña siempre es falsa','Porque no es necesario revisar nada más','Porque el eslogan es siempre más importante'] },
  { aviso:'Un aviso de un parque de diversiones muestra a una familia riendo en los juegos, con el texto "¡El lugar más divertido para toda la familia!".', pregunta:'¿Cuál es el emisor más probable de este aviso?', correcta:'La empresa dueña del parque de diversiones', opts:['Un científico independiente','El gobierno','Un medio de noticias sin interés comercial'] },
  { aviso:'Un aviso de un videojuego usa colores brillantes, música emocionante y la frase "¡Todos tus amigos ya lo están jugando!" para invitarte a comprarlo.', pregunta:'¿Qué recurso usa este aviso para intentar convencer, además de la imagen y la música?', correcta:'La presión de grupo ("todos tus amigos ya lo están jugando")', opts:['Un informe científico sobre videojuegos','Una encuesta oficial del gobierno','Un dato histórico verificable'] },
  { aviso:'Un aviso de protector solar muestra a un dermatólogo explicando los beneficios del producto y citando estudios sobre protección UV.', pregunta:'¿Por qué este aviso podría parecer más confiable que uno sin ningún respaldo?', correcta:'Porque cita a un experto y estudios verificables', opts:['Porque usa colores más bonitos','Porque es más largo que otros avisos','Porque tiene música de fondo'] },
];
const IDEA_PRINCIPAL6_BANK = [
  { parrafo:'Aprender un segundo idioma no solo permite comunicarse con más personas: también mejora la memoria, ayuda a resolver problemas de otras formas, y abre puertas a nuevas culturas.', correcta:'Aprender un segundo idioma trae múltiples beneficios', opts:['Aprender un segundo idioma no sirve para nada','Solo los adultos pueden aprender otro idioma','La memoria empeora al aprender otro idioma'] },
  { parrafo:'Los arrecifes de coral cubren menos del 1% del fondo oceánico, pero albergan cerca de una cuarta parte de todas las especies marinas conocidas.', correcta:'Los arrecifes de coral son pequeños en tamaño pero enormemente importantes para la vida marina', opts:['Los arrecifes de coral cubren la mayor parte del océano','Los arrecifes de coral no tienen relación con la vida marina','Ninguna especie marina vive en los arrecifes'] },
  { parrafo:'Reciclar el papel ahorra árboles y energía, reciclar el vidrio se puede repetir casi infinitas veces sin perder calidad, y reciclar el plástico reduce la basura en los océanos.', correcta:'Reciclar distintos materiales trae beneficios distintos para el planeta', opts:['Solo el papel se puede reciclar','Reciclar no tiene ningún beneficio real','El vidrio no se puede reciclar nunca'] },
  { parrafo:'Practicar un instrumento musical desde niño ayuda a desarrollar la disciplina, mejora la coordinación entre manos y mente, y puede fortalecer la memoria a largo plazo.', correcta:'Aprender un instrumento musical desde temprano trae varios beneficios', opts:['Aprender música no tiene ningún beneficio más allá del sonido','Solo sirve para presentarse en conciertos','La coordinación no tiene relación con la música'] },
];

export function genComprension6Round(){
  const recurso = 'Comprender un texto va más allá de leer las palabras: incluye entender lo que el texto sugiere sin decirlo directamente (inferencia), separar lo que es un dato comprobable de lo que es una interpretación (hechos vs. opiniones), notar cuando un mensaje publicitario busca convencer más que informar, y saber resumir el punto central de un párrafo en una sola oración (idea principal). Estas son las mismas herramientas de lectura crítica que se usan para leer noticias, avisos y textos escolares de forma más consciente.';
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(COMPRENSION6_NARRATIVA_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason, recurso: recurso,
    };
  }
  if(roll<0.4){
    const item = pick(COMPRENSION6_NOLITERARIO_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: item.reason, recurso: recurso,
    };
  }
  if(roll<0.6){
    const item = pick(MENSAJES_PUBLICITARIOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.aviso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.aviso, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
    };
  }
  const item = pick(IDEA_PRINCIPAL6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.parrafo+'</p><p class="prompt-hint">¿Cuál oración resume mejor la idea principal del párrafo?</p>',
    options: opts, correctValue: item.correcta, speakText: item.parrafo, cols:2, panel:true,
    explain: 'La idea principal es: <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

const RECURSOS_POETICOS2_BANK = [
  { verso:'La montaña dormía cubierta de niebla, esperando el amanecer.', recurso:'Personificación', explicacion:'Le da a la montaña una acción humana ("dormía", "esperando") que en realidad no puede hacer.' },
  { verso:'Su sonrisa era como un rayo de sol en un día nublado.', recurso:'Comparación', explicacion:'Usa la palabra "como" para comparar la sonrisa con un rayo de sol.' },
  { verso:'Te lo he repetido un millón de veces y todavía no me escuchas.', recurso:'Hipérbole', explicacion:'Es una exageración enorme para enfatizar que se ha repetido muchas veces, no literalmente un millón.' },
  { verso:'Lloré tantas lágrimas que podría haber llenado el océano entero.', recurso:'Hipérbole', explicacion:'Es una exageración imposible (llenar un océano con lágrimas) para enfatizar la intensidad del llanto.' },
  { verso:'El reloj de la abuela hacía tic-tac, tic-tac, en el silencio de la noche.', recurso:'Onomatopeya', explicacion:'"Tic-tac" imita el sonido real que hace un reloj — eso es una onomatopeya.' },
  { verso:'Las abejas hacían bzzz, bzzz alrededor de las flores del jardín.', recurso:'Onomatopeya', explicacion:'"Bzzz" imita el sonido real que hacen las abejas al volar — eso es una onomatopeya.' },
  { verso:'El viento veloz volaba entre los árboles del valle.', recurso:'Aliteración', explicacion:'Se repite el sonido de la "v" varias veces seguidas ("veloz", "volaba", "valle") — eso es una aliteración.' },
  { verso:'Tres tristes tigres tragaban trigo en un trigal.', recurso:'Aliteración', explicacion:'Se repite el sonido "tr" varias veces seguidas — eso es una aliteración.' },
  { verso:'El río conversaba en voz baja con las piedras del camino.', recurso:'Personificación', explicacion:'Le da al río la capacidad humana de "conversar", que en realidad no tiene.' },
  { verso:'Sus palabras eran afiladas como cuchillos.', recurso:'Comparación', explicacion:'Usa la palabra "como" para comparar las palabras con cuchillos.' },
];
export function genRecursosPoeticos6Round(){
  const recurso = 'Los poemas usan recursos del lenguaje para crear efectos e imágenes especiales: la <b>hipérbole</b> exagera algo a propósito para enfatizar ("lloré un océano"); la <b>onomatopeya</b> imita con palabras un sonido real ("tic-tac", "bzzz"); y la <b>aliteración</b> repite un mismo sonido varias veces seguidas para crear un efecto musical ("tres tristes tigres"). Junto a la personificación y la comparación (ya vistas en años anteriores), estos recursos hacen que un texto suene más vívido y expresivo que una descripción simple.';
  const item = pick(RECURSOS_POETICOS2_BANK);
  const todos = ['Personificación','Comparación','Hipérbole','Onomatopeya','Aliteración'];
  const distract = shuffle(todos.filter(function(r){ return r!==item.recurso; })).slice(0,3);
  const opts = shuffle([item.recurso].concat(distract)).map(function(r){ return {label:r, value:r}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.verso+'"</p><p class="prompt-hint">¿Qué recurso del lenguaje poético se usa en este verso?</p>',
    options: opts, correctValue: item.recurso, speakText: item.verso, cols:2, kind:'word', panel:true,
    explain: item.explicacion, recurso: recurso,
  };
}

const SUFIJOS_BANK = [
  { palabra:'Velocidad', sufijo:'-dad', significadoSufijo:'Indica una cualidad (ser veloz)', base:'Veloz' },
  { palabra:'Lentamente', sufijo:'-mente', significadoSufijo:'Indica el modo en que se hace algo (de forma lenta)', base:'Lenta' },
  { palabra:'Panadero', sufijo:'-ero', significadoSufijo:'Indica el oficio de alguien (que trabaja con pan)', base:'Pan' },
  { palabra:'Cariñoso', sufijo:'-oso', significadoSufijo:'Indica que algo tiene esa cualidad en abundancia (lleno de cariño)', base:'Cariño' },
  { palabra:'Felicidad', sufijo:'-dad', significadoSufijo:'Indica una cualidad (ser feliz)', base:'Feliz' },
  { palabra:'Jardinero', sufijo:'-ero', significadoSufijo:'Indica el oficio de alguien (que trabaja en el jardín)', base:'Jardín' },
];
const HIPERONIMOS_GRUPOS = [
  { hiperonimo:'Mueble', hiponimos:['Silla','Mesa','Cama'] },
  { hiperonimo:'Flor', hiponimos:['Rosa','Clavel','Tulipán'] },
  { hiperonimo:'Vehículo', hiponimos:['Auto','Bicicleta','Camión'] },
  { hiperonimo:'Herramienta', hiponimos:['Martillo','Destornillador','Sierra'] },
];
const LOCUCIONES_BANK = [
  { locucion:'De vez en cuando', significado:'A veces, no siempre', opts:['Todos los días sin falta','Nunca jamás','Solo una vez en la vida'] },
  { locucion:'En un abrir y cerrar de ojos', significado:'Muy rápidamente', opts:['Muy lentamente','Después de muchos años','Sin ningún apuro'] },
  { locucion:'A más tardar', significado:'Como plazo máximo', opts:['Sin ningún límite de tiempo','Lo más temprano posible','Nunca'] },
  { locucion:'Poco a poco', significado:'Lentamente y con calma', opts:['De una sola vez y muy rápido','Sin ningún orden','De forma violenta'] },
  { locucion:'De pies a cabeza', significado:'Completamente, de principio a fin', opts:['Solo una pequeña parte','De forma desordenada','Nunca por completo'] },
];
export function genVocabulario6Round(){
  const recurso = 'Un <b>sufijo</b> es una partícula que se agrega al final de una palabra base para cambiar su significado (VELOZ + -DAD = VELOCIDAD, una cualidad). Un <b>hiperónimo</b> es una palabra general que agrupa a otras más específicas (MUEBLE agrupa a SILLA, MESA, CAMA — esas son sus hipónimos). Y una <b>locución</b> es una expresión fija de varias palabras cuyo significado en conjunto no siempre se adivina palabra por palabra (como "de vez en cuando", que significa "a veces"). Reconocer estas piezas del idioma ayuda a entender palabras y expresiones nuevas sin necesidad de memorizarlas una por una.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(SUFIJOS_BANK);
    const distract = shuffle(SUFIJOS_BANK.filter(function(s){ return s.sufijo!==item.sufijo; })).slice(0,3).map(function(s){ return s.significadoSufijo; });
    const opts = shuffle([item.significadoSufijo].concat(distract)).map(function(s){ return {label:s, value:s}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">Esta palabra viene de "'+item.base.toLowerCase()+'" más el sufijo "'+item.sufijo+'". ¿Qué indica ese sufijo?</p>',
      options: opts, correctValue: item.significadoSufijo, speakText: item.palabra, cols:2, panel:true,
      explain: 'El sufijo "'+item.sufijo+'" '+item.significadoSufijo.toLowerCase()+'.', recurso: recurso,
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
      explain: '<b>'+correct+'</b> es un tipo específico de '+grupo.hiperonimo.toLowerCase()+'.', recurso: recurso,
    };
  }
  const item = pick(LOCUCIONES_BANK);
  const opts = shuffle([item.significado].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.locucion+'"</p><p class="prompt-hint">¿Qué significa esta expresión?</p>',
    options: opts, correctValue: item.significado, speakText: item.locucion, cols:2, panel:true,
    explain: '"'+item.locucion+'" significa <b>'+item.significado.toLowerCase()+'</b>.', recurso: recurso,
  };
}

const PARTICIPIOS_IRREGULARES_BANK = [
  { texto:'Ya he ___ (ROMPER) el jarrón sin querer.', correcto:'Roto', malas:['Rompido','Rompiendo','Rompe'] },
  { texto:'Ella ha ___ (ESCRIBIR) tres cartas esta semana.', correcto:'Escrito', malas:['Escribido','Escribiendo','Escribe'] },
  { texto:'Nunca me había ___ (DECIR) algo tan bonito.', correcto:'Dicho', malas:['Decido','Deciendo','Dice'] },
  { texto:'¿Ya has ___ (HACER) toda la tarea?', correcto:'Hecho', malas:['Hacido','Haciendo','Hace'] },
  { texto:'Hemos ___ (PONER) la mesa para la cena.', correcto:'Puesto', malas:['Ponido','Poniendo','Pone'] },
  { texto:'¿Alguna vez has ___ (VER) una ballena de cerca?', correcto:'Visto', malas:['Veido','Viendo','Ve'] },
  { texto:'El viento ha ___ (ABRIR) la ventana de golpe.', correcto:'Abierto', malas:['Abrido','Abriendo','Abre'] },
  { texto:'El científico ha ___ (RESOLVER) el problema matemático.', correcto:'Resuelto', malas:['Resolvido','Resolviendo','Resuelve'] },
  { texto:'La nieve ha ___ (CUBRIR) todo el jardín esta mañana.', correcto:'Cubierto', malas:['Cubrido','Cubriendo','Cubre'] },
  { texto:'Mi hermana ya ha ___ (VOLVER) de su viaje.', correcto:'Vuelto', malas:['Volvido','Volviendo','Vuelve'] },
];
export function genGramatica6Round(){
  const recurso = 'El <b>participio</b> es la forma del verbo que se usa después de "he", "has", "ha"... (como en "he comido"). La mayoría de los participios son regulares y terminan en "-ado" o "-ido" (comido, hablado), pero algunos verbos tienen un <b>participio irregular</b> que no sigue esa regla — como ROTO (de romper), ESCRITO (de escribir) o HECHO (de hacer). Estos participios irregulares no se pueden deducir con una fórmula: hay que aprenderlos de memoria, uno por uno, porque son excepciones fijas del idioma.';
  const item = pick(PARTICIPIOS_IRREGULARES_BANK);
  const opts = shuffle([item.correcto].concat(item.malas)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Cuál es el participio correcto de ese verbo?</p>',
    options: opts, correctValue: item.correcto, speakText: item.texto.replace(/\s*\([^)]*\)/,'').replace('___', item.correcto), cols:4, kind:'word',
    explain: '<b>'+item.correcto+'</b> es el participio irregular correcto — no sigue la terminación regular "-ado/-ido".', recurso: recurso,
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
  const recurso = 'La <b>tilde diacrítica</b> es una tilde que no marca la sílaba más fuerte, sino que sirve para distinguir dos palabras que se escriben igual pero significan cosas distintas — como "él" (la persona) y "el" (el artículo), o "sé" (yo sé) y "se" (él se fue), o "tú" (pronombre) y "tu" (posesivo, "tu casa"). Sin esa tilde, dos palabras completamente diferentes se verían idénticas por escrito, así que la tilde diacrítica cumple un rol clave para que el significado de la oración quede claro.';
  const item = pick(TILDE_DIACRITICA_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla, recurso: recurso,
  };
}

/* ---------------- Contenido Lengua y Literatura 7° Básico ----------------
   Desde 7° básico el currículum chileno cambia de decreto: "Bases
   Curriculares 7° básico a 2° medio" (Decreto 614/2013, curriculumnacional.cl/
   curriculum/7o-basico-2o-medio/lengua-literatura/7-basico) en vez del
   Decreto 439/2012 usado en 1°-6° básico. La asignatura también cambia de
   nombre: "Lenguaje y Comunicación" pasa a llamarse "Lengua y Literatura" —
   se mantiene el mismo ícono/pantalla (`lenguajeMap`) para no romper la
   navegación ya existente, el cambio de nombre queda documentado aquí y en
   el título que ve el usuario dentro del módulo.
   Comprensión VII -> OA03,10-11 (estructura narrativa: conflicto, roles de
   personajes, disposición temporal -incluye flashback/retrospección-,
   comprensión de textos no literarios). Rima y Métrica -> OA04-05 (recursos
   sonoros nuevos respecto a años anteriores: rima consonante/asonante, y
   características del romance como género de la poesía popular). Pensamiento
   Crítico: Hechos y Opiniones -> OA08-09 (distinguir hecho de opinión,
   identificar la postura de un autor, reconocer estereotipos en textos
   mediáticos — un ángulo más analítico que "Evaluar Mensajes Publicitarios"
   de 6° básico, que solo pedía identificar emisor/intención de un aviso).
   Vocabulario y Gramática VII -> OA16-18 (concordancia sujeto-predicado,
   sustitución léxica mediante sinonimia e hiperonimia -ya se trabajó
   hipónimos en 6°, ahora el ángulo inverso-, tiempos verbales del indicativo
   al narrar). Ortografía V -> OA19 (por qué / porque / porqué / por que,
   una regla distinta a las ya cubiertas en 3°-6° básico).
   Quedan fuera: OA01 (gusto por la lectura, actitudinal), OA02,07
   (reflexión personal sobre la experiencia humana y conexión con dilemas
   propios, subjetivo), OA06 (mitos — ya cubierto el género en 3° básico),
   OA12-15 (producción escrita), OA20-23 (comunicación oral, depende de
   audio/desempeño), OA24-25 (investigar en fuentes, síntesis de un proceso
   propio de estudio — proceso, no un hecho con respuesta única). */
export const LENGUAJE_MODULES_G7 = [
  {id:'comprension7', label:'Comprensión VII', open:true, key:'comprension7'},
  {id:'rimametrica7', label:'Rima y Métrica', open:true, key:'rimametrica7'},
  {id:'pensamientocritico7', label:'Pensamiento Crítico: Hechos y Opiniones', open:true, key:'pensamientocritico7'},
  {id:'vocabulariogramatica7', label:'Vocabulario y Gramática VII', open:true, key:'vocabulariogramatica7'},
  {id:'ortografia7', label:'Ortografía V', open:true, key:'ortografia7'},
];
export const LENGUAJE_POS_G7 = [{x:22,y:90},{x:68,y:70},{x:22,y:50},{x:68,y:30},{x:22,y:10}];

const CONFLICTO_NARRATIVO_BANK = [
  { text:'Marco y su mejor amigo dejan de hablarse por un malentendido, y pasan el resto del cuento tratando de reconciliarse.', question:'¿Cuál es el conflicto principal de esta historia?', correct:'La ruptura de una amistad por un malentendido', opts:['Una competencia deportiva','Un viaje a otro país','La búsqueda de un tesoro'] },
  { text:'Una joven debe elegir entre quedarse en su pueblo a cuidar a su familia o aceptar una beca en la ciudad para estudiar lo que ama.', question:'¿Cuál es el conflicto principal de esta historia?', correct:'Un dilema entre el deber familiar y una oportunidad personal', opts:['Una pelea por dinero','Un problema con un vecino','La pérdida de una mascota'] },
  { text:'Un explorador debe cruzar un desierto sin agua suficiente para llegar a la única ciudad cercana.', question:'¿Cuál es el conflicto principal de esta historia?', correct:'La lucha por sobrevivir en un ambiente hostil', opts:['Un conflicto entre dos hermanos','Una competencia de baile','Una confusión de identidad'] },
];
const ROLES_PERSONAJE_BANK = [
  { pregunta:'¿Cómo se llama el personaje principal de una historia, alrededor de quien gira la trama?', correcta:'Protagonista', opts:['Antagonista','Narrador','Personaje secundario'] },
  { pregunta:'¿Cómo se llama el personaje que se opone a los objetivos del protagonista?', correcta:'Antagonista', opts:['Protagonista','Narrador','Personaje secundario'] },
  { pregunta:'¿Cómo se llama un personaje que acompaña la trama pero no es central en el conflicto principal?', correcta:'Personaje secundario', opts:['Protagonista','Antagonista','Narrador'] },
];
const DISPOSICION_TEMPORAL_BANK = [
  { desc:'Un cuento comienza mostrando el final de la historia, y luego retrocede en el tiempo para contar cómo los personajes llegaron ahí.', correcta:'Retrospección (flashback)', opts:['Orden cronológico lineal','Diálogo directo','Descripción de ambiente'] },
  { desc:'Un cuento narra los hechos exactamente en el orden en que ocurrieron, del principio al final.', correcta:'Orden cronológico lineal', opts:['Retrospección (flashback)','Un diálogo','Una descripción'] },
  { desc:'Una novela interrumpe la historia principal para mostrar brevemente un adelanto de algo que ocurrirá más adelante.', correcta:'Anticipación (flash-forward)', opts:['Orden cronológico lineal','Retrospección (flashback)','Un monólogo'] },
];
const COMPRENSION7_NOLITERARIO_BANK = [
  { text:'Un artículo científico explica que el 71% de la superficie de la Tierra está cubierta por océanos, y que estos regulan gran parte del clima del planeta.', question:'¿Qué porcentaje de la superficie terrestre está cubierta por océanos, según el texto?', correct:'71%', opts:['25%','50%','99%'] },
  { text:'Un manual de primeros auxilios indica: primero evalúa la seguridad del lugar, luego revisa si la persona respira, y recién después llama a emergencias.', question:'¿Qué se debe hacer justo después de evaluar la seguridad del lugar?', correct:'Revisar si la persona respira', opts:['Llamar a emergencias de inmediato','Mover a la persona','Ignorar la situación'] },
  { text:'Una noticia informa que la biblioteca municipal amplió su horario de atención tras una encuesta donde el 80% de los vecinos pidió más horas disponibles.', question:'¿Por qué la biblioteca amplió su horario, según el texto?', correct:'Porque la mayoría de los vecinos encuestados lo pidió', opts:['Porque el gobierno lo ordenó sin consultar a nadie','Porque iba a cerrar definitivamente','Porque nadie la visitaba'] },
];
export function genComprension7Round(){
  const recurso = 'Comprender bien un texto significa ir más allá de las palabras: hay que <b>inferir</b> lo que no se dice directamente, reconocer el problema central de la historia (el <b>conflicto narrativo</b>), identificar el rol de cada personaje (protagonista, antagonista, secundario) y notar cómo se organiza el tiempo del relato (si sigue el orden cronológico o usa saltos hacia el pasado o el futuro). En los textos no literarios (noticias, artículos, folletos) también hay que evaluar si la información es suficiente y confiable, y quién la está entregando. Practicar estas estrategias ayuda a leer con más profundidad, sea un cuento, una noticia o cualquier texto.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(CONFLICTO_NARRATIVO_BANK);
    const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
      options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
      explain: 'El conflicto principal es: '+item.correct+'.',
      recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(ROLES_PERSONAJE_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.75){
    const item = pick(DISPOSICION_TEMPORAL_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'</p><p class="prompt-hint">¿Qué recurso de disposición temporal se usa aquí?</p>',
      options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
      explain: 'Este recurso se llama <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(COMPRENSION7_NOLITERARIO_BANK);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.text+'</p><p class="prompt-hint">'+item.question+'</p>',
    options: opts, correctValue: item.correct, speakText: item.text, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correct+'.',
    recurso: recurso,
  };
}

const RIMA_BANK = [
  { verso:'"Verde que te quiero verde. / Verde viento. Verdes ramas."', tipo:'Rima asonante', explicacion:'Solo coinciden las vocales finales desde la última sílaba acentuada ("verde"/"ramas" comparten el sonido "e-a" de forma parecida, sin que coincidan también las consonantes).' },
  { verso:'"Volverán las oscuras golondrinas / en tu balcón sus nidos a colgar"', tipo:'Rima consonante', explicacion:'Coinciden tanto las vocales como las consonantes desde la última sílaba acentuada.' },
  { verso:'Una canción donde "corazón" rima con "canción" y "razón" (coinciden todas las letras finales)', tipo:'Rima consonante', explicacion:'Cuando coinciden exactamente todos los sonidos finales (vocales y consonantes), es rima consonante.' },
  { verso:'Un poema donde "cielo" rima con "sueño" (solo coinciden las vocales e-o, no las consonantes)', tipo:'Rima asonante', explicacion:'Cuando solo coinciden los sonidos vocálicos finales, es rima asonante.' },
  { verso:'Una canción donde "ventana" rima con "mañana" (coinciden todas las letras desde la sílaba acentuada)', tipo:'Rima consonante', explicacion:'Coinciden exactamente todos los sonidos finales, vocales y consonantes, así que es rima consonante.' },
  { verso:'Un poema donde "camino" rima con "destino" (coinciden todas las letras desde la sílaba acentuada)', tipo:'Rima consonante', explicacion:'Cuando coinciden tanto vocales como consonantes desde la sílaba acentuada, es rima consonante.' },
  { verso:'Un romance donde "prado" rima con "campo" (solo coinciden las vocales a-o, no las consonantes)', tipo:'Rima asonante', explicacion:'Solo coinciden los sonidos vocálicos finales, sin que coincidan también las consonantes, así que es rima asonante.' },
  { verso:'Una copla donde "montaña" rima con "extraña" (coinciden todas las letras desde la sílaba acentuada)', tipo:'Rima consonante', explicacion:'Coinciden exactamente todos los sonidos, vocales y consonantes, desde la última sílaba acentuada.' },
];
const ROMANCE_BANK = [
  { pregunta:'¿Qué es un romance, dentro de la poesía popular?', correcta:'Un poema narrativo tradicional, generalmente en versos de ocho sílabas con rima asonante en los versos pares', opts:['Una carta de amor en prosa','Un tipo de baile folclórico','Un instrumento musical de cuerdas'] },
  { pregunta:'¿Qué solían contar tradicionalmente los romances, transmitidos oralmente de generación en generación?', correcta:'Historias, hazañas y sucesos que interesaban al pueblo', opts:['Solo recetas de cocina','Solo fechas de calendario','Solo nombres de plantas'] },
  { pregunta:'¿Cuántas sílabas suelen tener los versos de un romance tradicional?', correcta:'Ocho sílabas', opts:['Dos sílabas','Veinte sílabas','Una sílaba'] },
  { pregunta:'¿Por qué los romances eran fáciles de recordar y transmitir de generación en generación sin escribirlos?', correcta:'Porque su ritmo y su rima ayudaban a memorizarlos', opts:['Porque eran muy largos y complicados','Porque se escribían en varios idiomas a la vez','Porque no tenían ningún ritmo ni rima'] },
  { pregunta:'¿Qué verso de un romance suele llevar la rima asonante, según su estructura tradicional?', correcta:'Los versos pares (el segundo, el cuarto, y así sucesivamente)', opts:['Solo el primer verso','Ningún verso lleva rima','Todos los versos sin excepción'] },
  { pregunta:'¿Qué tipo de temas solían tratar los romances históricos, además de hazañas del pueblo?', correcta:'Sucesos históricos, guerras y personajes conocidos por la comunidad', opts:['Solo temas de matemática','Solo instrucciones de cocina','Solo el pronóstico del clima'] },
];
export function genRimaMetrica7Round(){
  const recurso = 'La <b>rima consonante</b> ocurre cuando coinciden todos los sonidos (vocales y consonantes) desde la última sílaba acentuada de dos versos; la <b>rima asonante</b> ocurre cuando solo coinciden los sonidos vocálicos, sin que las consonantes sean iguales. El <b>romance</b> es una forma poética tradicional, transmitida oralmente de generación en generación: versos de ocho sílabas que suelen llevar rima asonante en los versos pares, usados para contar historias, hazañas y sucesos que interesaban al pueblo. Su ritmo y su rima repetida ayudaban a memorizarlo sin necesidad de escribirlo.';
  if(Math.random()<0.6){
    const item = pick(RIMA_BANK);
    const opts = shuffle([{label:'Rima consonante', value:'Rima consonante'},{label:'Rima asonante', value:'Rima asonante'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.verso+'</p><p class="prompt-hint">¿Qué tipo de rima se usa aquí?</p>',
      options: opts, correctValue: item.tipo, speakText: item.verso, cols:2, panel:true,
      explain: item.explicacion,
      recurso: recurso,
    };
  }
  const item = pick(ROMANCE_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const HECHO_OPINION_BANK = [
  { frase:'El agua hierve a 100 grados Celsius a nivel del mar.', tipo:'Hecho' },
  { frase:'Esta es la mejor película que se ha hecho jamás.', tipo:'Opinión' },
  { frase:'Chile tiene una superficie de aproximadamente 756 mil kilómetros cuadrados.', tipo:'Hecho' },
  { frase:'La música clásica es más aburrida que la música pop.', tipo:'Opinión' },
  { frase:'El fútbol es el deporte más entretenido que existe.', tipo:'Opinión' },
  { frase:'La Tierra completa una vuelta alrededor del Sol en aproximadamente 365 días.', tipo:'Hecho' },
  { frase:'Ese equipo de fútbol tiene la mejor hinchada del país.', tipo:'Opinión' },
  { frase:'El libro fue publicado originalmente en 1967.', tipo:'Hecho' },
];
const POSTURA_AUTOR_BANK = [
  { texto:'"Es evidente que los parques urbanos deberían tener más árboles: mejoran la calidad del aire, bajan la temperatura y dan espacio de recreación a la comunidad."', pregunta:'¿Cuál es la postura del autor de este texto?', correcta:'A favor de aumentar los árboles en los parques urbanos', opts:['En contra de tener parques en la ciudad','Neutral, sin opinión al respecto','A favor de eliminar todos los árboles'] },
  { texto:'"Cambiar el horario de inicio de clases a más tarde ayudaría a que los estudiantes duerman más y rindan mejor, según varios estudios."', pregunta:'¿Cuál es la postura del autor de este texto?', correcta:'A favor de retrasar el horario de inicio de clases', opts:['A favor de adelantar el horario de clases','En contra de que los estudiantes duerman más','Neutral, sin ninguna postura'] },
];
const ESTEREOTIPO_BANK = [
  { texto:'Un aviso muestra solo a hombres reparando autos y solo a mujeres cocinando en la casa, como si esas fueran las únicas opciones posibles para cada género.', pregunta:'¿Qué recurso está usando este texto?', correcta:'Un estereotipo de género', opts:['Un dato científico verificable','Una cita de un experto','Una estadística oficial'] },
  { texto:'Un artículo asegura que "todos los jóvenes de esa ciudad son perezosos", generalizando a partir de la conducta de solo un par de personas.', pregunta:'¿Qué problema tiene esta afirmación?', correcta:'Generaliza a un grupo entero a partir de pocos casos, un estereotipo', opts:['Es una conclusión basada en un estudio amplio y riguroso','Es un hecho comprobado científicamente','No tiene ningún problema'] },
];
export function genPensamientoCritico7Round(){
  const recurso = 'Un <b>hecho</b> es algo que se puede comprobar (una fecha, una medida, un dato verificable); una <b>opinión</b> es un juicio personal que puede variar de una persona a otra. Al leer un texto argumentativo, conviene identificar la <b>postura del autor</b> (qué defiende o qué propone) y separarla de los datos que usa para sustentarla. También hay que estar atento a los <b>estereotipos</b>: generalizaciones que atribuyen características a todo un grupo de personas a partir de pocos casos o prejuicios, sin base real — reconocerlos es clave para leer noticias, avisos publicitarios y redes sociales de forma crítica.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(HECHO_OPINION_BANK);
    const opts = shuffle([{label:'Hecho', value:'Hecho'},{label:'Opinión', value:'Opinión'}]);
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.frase+'"</p><p class="prompt-hint">¿Esto es un hecho (se puede comprobar) o una opinión (un juicio personal)?</p>',
      options: opts, correctValue: item.tipo, speakText: item.frase, cols:2, panel:true,
      explain: 'Esto es: <b>'+item.tipo+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const item = pick(POSTURA_AUTOR_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
      explain: 'La postura del autor es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(ESTEREOTIPO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const CONCORDANCIA_SUJETO_PREDICADO_BANK = [
  { texto:'Los estudiantes de ese curso ___ un proyecto muy interesante.', correcto:'Presentaron', malas:['Presentó','Presentamos','Presentas'] },
  { texto:'Mi vecina y su hija ___ temprano todos los domingos.', correcto:'Salen', malas:['Sale','Salgo','Sales'] },
  { texto:'El equipo completo ___ satisfecho con el resultado del partido.', correcto:'Quedó', malas:['Quedaron','Quedamos','Quedaste'] },
  { texto:'Tú y yo ___ responsables de terminar este trabajo.', correcto:'Somos', malas:['Es','Son','Eres'] },
];
const SINONIMIA_HIPERONIMIA_BANK = [
  { palabra:'Feliz', tipo:'Sinónimo', correcta:'Contento', opts:['Triste','Enojado','Cansado'] },
  { palabra:'Rápido', tipo:'Sinónimo', correcta:'Veloz', opts:['Lento','Pesado','Suave'] },
  { palabra:'Rosa', tipo:'Hiperónimo (palabra más general)', correcta:'Flor', opts:['Pétalo','Jardín','Maceta'] },
  { palabra:'Camión', tipo:'Hiperónimo (palabra más general)', correcta:'Vehículo', opts:['Motor','Rueda','Carga'] },
];
const TIEMPOS_VERBALES_BANK = [
  { texto:'Ayer caminé al colegio, saludé a mis amigos y luego entré a la sala.', tiempo:'Pretérito (pasado)' },
  { texto:'Todos los días camino al colegio, saludo a mis amigos y luego entro a la sala.', tiempo:'Presente' },
  { texto:'Mañana caminaré al colegio, saludaré a mis amigos y luego entraré a la sala.', tiempo:'Futuro' },
];
export function genVocabularioGramatica7Round(){
  const recurso = 'La <b>concordancia</b> exige que el verbo (predicado) coincida en número y persona con el sujeto de la oración, aunque el sujeto esté compuesto por varias palabras o vaya lejos del verbo. Un <b>sinónimo</b> es una palabra con significado parecido a otra; un <b>hiperónimo</b> es una palabra más general que incluye a otras más específicas (por ejemplo, "flor" es hiperónimo de "rosa"). Los <b>tiempos verbales</b> (presente, pretérito, futuro) indican cuándo ocurre la acción narrada, y reconocerlos ayuda a entender el orden de los hechos en un relato.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CONCORDANCIA_SUJETO_PREDICADO_BANK);
    const opts = shuffle([item.correcto].concat(item.malas)).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto.replace('___','<span class="blank">___</span>')+'</p><p class="prompt-hint">¿Qué verbo mantiene la concordancia correcta con el sujeto?</p>',
      options: opts, correctValue: item.correcto, speakText: item.texto.replace('___', item.correcto), cols:4, kind:'word',
      explain: '<b>'+item.correcto+'</b> concuerda correctamente en número y persona con el sujeto de la oración.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(SINONIMIA_HIPERONIMIA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.palabra+'</p><p class="prompt-hint">¿Cuál palabra es un '+item.tipo.toLowerCase()+' de "'+item.palabra.toLowerCase()+'"?</p>',
      options: opts, correctValue: item.correcta, speakText: '¿Cuál es un '+item.tipo.toLowerCase()+' de '+item.palabra.toLowerCase()+'?', cols:2, kind:'word',
      explain: '<b>'+item.correcta+'</b> es un '+item.tipo.toLowerCase()+' de "'+item.palabra.toLowerCase()+'".',
      recurso: recurso,
    };
  }
  const item = pick(TIEMPOS_VERBALES_BANK);
  const todos = ['Pretérito (pasado)','Presente','Futuro'];
  const distract = todos.filter(function(t){ return t!==item.tiempo; });
  const opts = shuffle([item.tiempo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿En qué tiempo verbal está narrado este texto?</p>',
    options: opts, correctValue: item.tiempo, speakText: item.texto, cols:2, kind:'word',
    explain: 'Este texto está narrado en <b>'+item.tiempo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

const POR_QUE_BANK = [
  { incorrecta:'Porque llegaste tarde hoy?', correcta:'¿Por qué llegaste tarde hoy?', regla:'Para preguntar, se escribe "por qué" en dos palabras y con tilde en la "e".' },
  { incorrecta:'No entiendo porqué te enojaste conmigo.', correcta:'No entiendo por qué te enojaste conmigo.', regla:'En una pregunta indirecta ("no entiendo por qué..."), se escribe "por qué" en dos palabras y con tilde.' },
  { incorrecta:'Llegué tarde por que había mucho tráfico.', correcta:'Llegué tarde porque había mucho tráfico.', regla:'Para dar una razón o explicación, se escribe "porque" junto y sin tilde.' },
  { incorrecta:'No me explicaron el porque de esa decisión.', correcta:'No me explicaron el porqué de esa decisión.', regla:'Cuando funciona como sustantivo (equivale a "la razón" o "el motivo"), se escribe "porqué" junto y con tilde, generalmente acompañado de "el/un".' },
  { incorrecta:'Ese es el motivo porque decidí venir.', correcta:'Ese es el motivo por que decidí venir.', regla:'Cuando "que" es un pronombre relativo que se puede reemplazar por "el cual" (aquí: "el motivo por el cual"), se escribe "por que" en dos palabras y sin tilde.' },
  { incorrecta:'Quiero saber el porque de tu decisión.', correcta:'Quiero saber el porqué de tu decisión.', regla:'Cuando funciona como sustantivo (equivale a "la razón"), se escribe "porqué" junto y con tilde.' },
  { incorrecta:'Por que no viniste ayer a la fiesta?', correcta:'¿Por qué no viniste ayer a la fiesta?', regla:'Para preguntar, se escribe "por qué" en dos palabras y con tilde.' },
  { incorrecta:'No fui a la escuela por que estaba enfermo.', correcta:'No fui a la escuela porque estaba enfermo.', regla:'Para dar una razón, se escribe "porque" junto y sin tilde.' },
  { incorrecta:'Nadie sabe porque se fue tan temprano.', correcta:'Nadie sabe por qué se fue tan temprano.', regla:'En una pregunta indirecta, se escribe "por qué" en dos palabras y con tilde.' },
  { incorrecta:'Ese fue el porque de todo el problema.', correcta:'Ese fue el porqué de todo el problema.', regla:'Cuando funciona como sustantivo (equivale a "la razón"), se escribe "porqué" junto y con tilde, especialmente tras "el/un".' },
  { incorrecta:'Este es el motivo por qué te llamé.', correcta:'Este es el motivo por que te llamé.', regla:'Cuando "que" es un pronombre relativo reemplazable por "el cual", se escribe "por que" en dos palabras y sin tilde.' },
];
export function genOrtografia7Round(){
  const recurso = 'Estas cuatro formas se escriben distinto según su función: <b>"¿por qué?"</b> (dos palabras, con tilde) se usa para preguntar, incluso en preguntas indirectas; <b>"porque"</b> (una palabra, sin tilde) se usa para dar una razón o explicación; <b>"el porqué"</b> (una palabra, con tilde) funciona como sustantivo y equivale a "la razón" o "el motivo"; <b>"por que"</b> (dos palabras, sin tilde) aparece cuando "que" es un pronombre relativo que se puede reemplazar por "el cual". Fijarse en la función de la oración —¿es pregunta, explicación, sustantivo o relativo?— es la forma más segura de elegir la correcta.';
  const item = pick(POR_QUE_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla,
    recurso: recurso,
  };
}

/* ---------------- Contenido Lengua y Literatura 8° Básico ----------------
   Basado en OA del Decreto 614/2013 (curriculumnacional.cl/curriculum/
   7o-basico-2o-medio/lengua-literatura/8-basico).
   Comprensión VIII -> OA03,11-12 (análisis narrativo: conflicto, narrador,
   estructura temporal; textos no literarios; estrategias de comprensión).
   Géneros Dramáticos y Épicos -> OA05-07 (texto dramático, comedia,
   fragmentos épicos en su contexto). Textos Argumentativos y Medios ->
   OA09-10 (columnas de opinión, postura del autor, hechos vs. opiniones en
   medios, estereotipos en medios). Gramática VIII -> OA17-19 (oraciones
   complejas con referentes claros, correferencia por pronombres/
   sustitución, modos verbales: indicativo/subjuntivo/imperativo).
   Ortografía VI -> OA20 (usos de la coma -enumerativa, vocativo,
   aclaratoria-, punto y coma, dos puntos — reglas no cubiertas por
   Ortografía de 3°-7°).
   Quedan fuera: OA01-02 (lectura por gusto personal, actitudinal), OA04
   (lenguaje poético que apela a los sentidos — ya cubierto por Recursos
   Poéticos de 5°-6° y Rima y Métrica de 7°), OA08 (interpretaciones
   personales de obras, subjetivo), OA13-16 (producción escrita), OA21-24
   (comunicación oral), OA25-26 (proceso de investigación propio). */
export const LENGUAJE_MODULES_G8 = [
  {id:'comprension8', label:'Comprensión VIII', open:true, key:'comprension8'},
  {id:'generosdramaticos8', label:'Géneros Dramáticos y Épicos', open:true, key:'generosdramaticos8'},
  {id:'argumentacionmedios8', label:'Textos Argumentativos y Medios', open:true, key:'argumentacionmedios8'},
  {id:'gramatica8', label:'Gramática VIII', open:true, key:'gramatica8'},
  {id:'ortografia8', label:'Ortografía VI', open:true, key:'ortografia8'},
];
export const LENGUAJE_POS_G8 = [{x:22,y:90},{x:68,y:70},{x:22,y:50},{x:68,y:30},{x:22,y:10}];

const NARRADOR_BANK = [
  { texto:'"Yo caminaba por la playa cuando encontré la botella. La abrí con mis propias manos y leí el mensaje."', pregunta:'¿Qué tipo de narrador tiene este fragmento?', correcta:'Narrador protagonista (en primera persona)', opts:['Narrador omnisciente (sabe todo)','Narrador testigo externo','No hay narrador'] },
  { texto:'"Elena estaba nerviosa, aunque nadie lo notaba. Pensaba en su familia mientras sonreía. Al mismo tiempo, al otro lado de la ciudad, su hermano también pensaba en ella."', pregunta:'¿Qué tipo de narrador tiene este fragmento?', correcta:'Narrador omnisciente (conoce pensamientos y hechos que los personajes no ven)', opts:['Narrador protagonista','Narrador testigo que solo describe lo visible','No hay narrador'] },
  { texto:'"Vi al hombre entrar al negocio. Compró pan, pagó y salió sin decir palabra. No sé qué pensaba ni a dónde iba después."', pregunta:'¿Qué tipo de narrador tiene este fragmento?', correcta:'Narrador testigo (cuenta solo lo que observa, sin conocer pensamientos ajenos)', opts:['Narrador omnisciente','Narrador protagonista de los hechos principales','No hay narrador'] },
];
const ESTRUCTURA_TEMPORAL_BANK = [
  { texto:'Una novela comienza mostrando al protagonista anciano, y luego retrocede para contar toda su juventud.', pregunta:'¿Qué recurso temporal usa esta novela?', correcta:'Retrospección (volver al pasado)', opts:['Orden estrictamente cronológico','Anticipación del futuro','Ausencia total de tiempo'] },
  { texto:'Un cuento narra los hechos exactamente en el orden en que ocurrieron, desde la mañana hasta la noche del mismo día.', pregunta:'¿Qué estructura temporal usa este cuento?', correcta:'Orden cronológico lineal', opts:['Retrospección constante','Saltos al futuro','Tiempo circular sin inicio ni fin'] },
  { texto:'En medio del relato, el narrador adelanta: "Aquella decisión, aunque nadie lo sabía entonces, cambiaría su vida para siempre".', pregunta:'¿Qué recurso temporal usa este fragmento?', correcta:'Anticipación (adelantar algo del futuro)', opts:['Retrospección al pasado','Orden cronológico simple','Descripción sin tiempo'] },
];
const NOLITERARIO_8_BANK = [
  { texto:'Un reportaje sobre los océanos explica que la mayoría del plástico que llega al mar proviene de desechos mal gestionados en tierra, y que las corrientes lo concentran en grandes zonas de acumulación.', pregunta:'Según el texto, ¿de dónde proviene la mayoría del plástico que llega al mar?', correcta:'De desechos mal gestionados en tierra', opts:['De los barcos pesqueros únicamente','De las fábricas submarinas','El texto no lo menciona'] },
  { texto:'Una infografía sobre el sueño adolescente indica que los expertos recomiendan entre 8 y 10 horas de sueño para esa edad, y que el uso de pantallas antes de dormir dificulta conciliar el sueño.', pregunta:'Según la infografía, ¿qué dificulta conciliar el sueño?', correcta:'El uso de pantallas antes de dormir', opts:['Dormir entre 8 y 10 horas','Leer un libro impreso','El texto no lo menciona'] },
  { texto:'Un artículo de divulgación explica que los glaciares de los Andes centrales han retrocedido en las últimas décadas, y que esto afecta la disponibilidad de agua para las ciudades cercanas.', pregunta:'Según el artículo, ¿qué consecuencia tiene el retroceso de los glaciares?', correcta:'Afecta la disponibilidad de agua para las ciudades cercanas', opts:['Aumenta la disponibilidad de agua','No tiene ninguna consecuencia','Hace crecer los glaciares del norte'] },
  { texto:'Una noticia informa que una biblioteca municipal extendió su horario hasta las 21 horas de lunes a viernes, tras una encuesta donde los vecinos pidieron más tiempo para estudiar después del trabajo.', pregunta:'¿Por qué la biblioteca extendió su horario?', correcta:'Porque los vecinos pidieron más tiempo para estudiar después del trabajo', opts:['Porque cerró la biblioteca vecina','Porque lo exigió una ley nueva','El texto no explica el motivo'] },
];
export function genComprension8Round(){
  const recurso = 'Comprender un texto en profundidad implica fijarse en varios elementos a la vez. El <b>narrador</b> es la voz que cuenta la historia (puede ser un personaje que participa, o alguien externo que observa todo); reconocerlo ayuda a entender desde qué perspectiva se cuentan los hechos. La <b>estructura temporal</b> de un relato no siempre sigue el orden en que ocurrieron los hechos: puede haber saltos al pasado (flashback) o adelantos al futuro, y seguir esa organización es clave para no perderse en la trama. Los <b>textos no literarios</b> (noticias, instructivos, cartas, afiches) tienen un propósito práctico —informar, instruir, persuadir— y para comprenderlos bien hay que identificar ese propósito y evaluar si la información entregada es clara y suficiente.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(NARRADOR_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(ESTRUCTURA_TEMPORAL_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(NOLITERARIO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const GENERO_DRAMATICO_BANK = [
  { pregunta:'¿Qué caracteriza a un texto dramático, a diferencia de un cuento o una novela?', correcta:'Está escrito para ser representado en escena, con diálogos y acotaciones', opts:['Siempre tiene un narrador omnisciente','Nunca tiene personajes','Solo puede leerse en silencio'] },
  { pregunta:'¿Cómo se llaman las indicaciones del texto dramático que describen movimientos, gestos o escenografía (y que no se dicen en voz alta)?', correcta:'Acotaciones', opts:['Diálogos','Monólogos','Estrofas'] },
  { pregunta:'¿Qué es un monólogo dentro de una obra dramática?', correcta:'Un parlamento extenso dicho por un solo personaje', opts:['Una conversación entre muchos personajes','Una indicación de escenografía','El aplauso del público'] },
  { pregunta:'¿Qué busca provocar la comedia, como género dramático, en el espectador?', correcta:'Risa y entretención, mostrando defectos humanos de forma exagerada o ridícula', opts:['Miedo y terror extremo','Llanto sin ningún alivio','Indiferencia total'] },
  { pregunta:'¿Qué narra generalmente una epopeya o poema épico?', correcta:'Las hazañas de un héroe, mezclando hechos extraordinarios y valores de su pueblo', opts:['La rutina cotidiana de una persona común sin ningún conflicto','Solo descripciones de paisajes','Instrucciones para armar un objeto'] },
  { pregunta:'"La Odisea", que narra el largo viaje de regreso del héroe Ulises, es un ejemplo clásico de...', correcta:'Poema épico (epopeya)', opts:['Comedia teatral','Noticia periodística','Receta de cocina'] },
  { pregunta:'¿Por qué es útil conocer el contexto histórico al leer un fragmento épico como "La Ilíada"?', correcta:'Porque ayuda a entender los valores y costumbres del pueblo que lo creó', opts:['Porque sin eso es imposible leer las palabras','Porque el contexto cambia las letras del texto','No sirve de nada conocer el contexto'] },
  { pregunta:'En una obra dramática, ¿cómo se llama el problema central que enfrentan los personajes y que hace avanzar la acción?', correcta:'El conflicto dramático', opts:['La acotación','El telón','El vestuario'] },
  { pregunta:'¿Qué diferencia principal hay entre leer una obra dramática y verla representada en teatro?', correcta:'Al verla, los actores dan vida a los diálogos y las acotaciones se vuelven acciones reales en escena', opts:['No hay ninguna diferencia entre ambas experiencias','Leerla siempre toma menos tiempo que verla','Al verla desaparece el conflicto de la historia'] },
  { pregunta:'¿Qué personaje típico de la comedia clásica exagera un defecto (como la avaricia o la vanidad) para provocar risa?', correcta:'El personaje tipo o caricaturesco', opts:['El narrador omnisciente','El público','El escenógrafo'] },
];
export function genGenerosDramaticos8Round(){
  const recurso = 'El <b>género dramático</b> agrupa los textos escritos para ser representados en escena, con diálogos entre personajes y <b>acotaciones</b> (indicaciones de movimientos, gestos o escenografía que no se dicen en voz alta). La <b>comedia</b> es un tipo de obra dramática que busca provocar risa, mostrando defectos humanos de forma exagerada. El <b>género épico</b>, por su parte, narra en verso o prosa las hazañas de un héroe, mezclando hechos extraordinarios con los valores del pueblo que creó la historia (como "La Odisea" o "La Ilíada") — conocer el contexto histórico de esa época ayuda a entender por qué esos valores eran importantes para quienes la escribieron.';
  const item = pick(GENERO_DRAMATICO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const POSTURA_ARGUMENTO_BANK = [
  { texto:'"Las bibliotecas públicas deberían abrir también los domingos. Muchos estudiantes solo tienen ese día libre para estudiar con calma, y una ciudad que facilita el estudio invierte en su futuro."', pregunta:'¿Cuál es la postura del autor de esta columna?', correcta:'Las bibliotecas públicas deberían abrir los domingos', opts:['Los estudiantes no necesitan bibliotecas','Las bibliotecas deberían cerrar los sábados','El autor no tiene ninguna postura'] },
  { texto:'"Prohibir los celulares en la sala de clases es una medida necesaria. Diversos estudios muestran que las notificaciones interrumpen la concentración, y los propios estudiantes reconocen distraerse con ellos."', pregunta:'¿Qué evidencia usa el autor para apoyar su postura?', correcta:'Estudios sobre interrupción de la concentración y el reconocimiento de los propios estudiantes', opts:['Solo su opinión personal sin ningún respaldo','Una encuesta sobre comida escolar','No usa ninguna evidencia'] },
  { texto:'"El nuevo parque de la comuna es, sin duda, el mejor lugar que existe para las familias." — dice un vecino en una carta al director.', pregunta:'La frase "es el mejor lugar que existe" corresponde a...', correcta:'Una opinión (un juicio personal del vecino)', opts:['Un hecho comprobable con datos','Una cifra oficial','Una ley de la república'] },
  { texto:'"El parque fue inaugurado el 15 de marzo y tiene 4 hectáreas de áreas verdes", informa una noticia municipal.', pregunta:'Esta afirmación corresponde a...', correcta:'Un hecho (se puede comprobar con registros)', opts:['Una opinión personal','Una exageración poética','Un deseo del periodista'] },
];
const MEDIOS_BANK = [
  { pregunta:'Un aviso publicitario muestra que "9 de cada 10 dentistas recomiendan" una pasta dental, sin citar ningún estudio. ¿Qué conviene hacer como lector crítico?', correcta:'Preguntarse de dónde sale esa cifra y si existe una fuente verificable', opts:['Creer la cifra sin cuestionarla','Comprar el producto de inmediato','Asumir que toda publicidad es siempre falsa sin analizarla'] },
  { pregunta:'Una serie de televisión muestra siempre a los científicos como personas despeinadas, solitarias y sin amigos. ¿Qué recurso problemático está usando?', correcta:'Un estereotipo (una imagen simplificada y generalizada de un grupo)', opts:['Una estadística oficial','Un hecho científico comprobado','Una acotación dramática'] },
  { pregunta:'¿Cuál es el propósito principal de un aviso publicitario?', correcta:'Persuadir al público para que compre un producto o prefiera una marca', opts:['Informar de forma neutral y completa','Enseñar contenidos escolares','Entretener sin ninguna intención comercial'] },
  { pregunta:'Una noticia y una columna de opinión tratan el mismo tema. ¿Cuál es la diferencia esperable entre ambas?', correcta:'La noticia busca informar hechos; la columna presenta el punto de vista de su autor', opts:['No hay ninguna diferencia entre ambas','La columna nunca puede mencionar hechos','La noticia siempre da opiniones personales'] },
  { pregunta:'En un afiche, la imagen de una familia sonriente ocupa casi todo el espacio y el precio del producto aparece muy pequeño. ¿Qué efecto busca ese diseño?', correcta:'Asociar el producto a emociones positivas, restando atención al precio', opts:['Informar el precio con la mayor claridad posible','Mostrar datos técnicos del producto','Evitar que alguien mire el afiche'] },
  { pregunta:'¿Qué elemento de una columna de opinión permite evaluar si su argumentación es sólida?', correcta:'La calidad y verificabilidad de las razones y evidencias que entrega', opts:['El tamaño de la letra del título','La cantidad de adjetivos elogiosos','La fama del autor sin importar sus argumentos'] },
];
export function genArgumentacionMedios8Round(){
  const recurso = 'En un texto argumentativo, la <b>postura</b> es la opinión o punto de vista que el autor defiende, y las <b>evidencias</b> son los datos, estudios o ejemplos que usa para respaldarla — mientras más verificables sean esas evidencias, más sólido es el argumento. Es fundamental distinguir un <b>hecho</b> (algo que se puede comprobar con datos o registros) de una <b>opinión</b> (un juicio personal, que puede ser válido pero no es universalmente verificable). Frente a los <b>medios de comunicación y la publicidad</b>, conviene pensar de forma crítica: preguntarse de dónde salen las cifras que se citan, notar cuando se usa un <b>estereotipo</b> (una imagen simplificada y generalizada de un grupo de personas), y recordar que el propósito de un aviso publicitario es persuadir para vender, no informar de forma neutral.';
  if(Math.random()<0.5){
    const item = pick(POSTURA_ARGUMENTO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(MEDIOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const MODO_VERBAL_BANK = [
  { oracion:'Mañana viajaremos al sur en tren.', modo:'Indicativo', explicacion:'El modo indicativo expresa hechos reales o que se dan por ciertos.' },
  { oracion:'Ojalá que llueva pronto en el norte.', modo:'Subjuntivo', explicacion:'El modo subjuntivo expresa deseos, posibilidades o dudas — aquí, un deseo.' },
  { oracion:'Cierra la puerta antes de salir.', modo:'Imperativo', explicacion:'El modo imperativo expresa órdenes, peticiones o instrucciones.' },
  { oracion:'El tren llegó puntual a la estación.', modo:'Indicativo', explicacion:'El modo indicativo expresa hechos reales — aquí, algo que efectivamente ocurrió.' },
  { oracion:'Quizás vengan mis primos este verano.', modo:'Subjuntivo', explicacion:'El modo subjuntivo expresa posibilidad o duda — "quizás vengan" no es un hecho seguro.' },
  { oracion:'Lava las verduras antes de cocinarlas.', modo:'Imperativo', explicacion:'El modo imperativo da una instrucción directa.' },
  { oracion:'Espero que tengas un buen viaje.', modo:'Subjuntivo', explicacion:'"Que tengas" expresa un deseo, propio del modo subjuntivo.' },
  { oracion:'Los estudiantes rindieron la prueba ayer.', modo:'Indicativo', explicacion:'Es un hecho ya ocurrido, expresado en modo indicativo.' },
  { oracion:'Guarden silencio durante la ceremonia.', modo:'Imperativo', explicacion:'Es una orden dirigida a un grupo, en modo imperativo.' },
];
const REFERENTE_BANK = [
  { oracion:'Marta le prestó su bicicleta a Sofía porque ELLA no tenía cómo llegar al ensayo.', pregunta:'¿A quién se refiere "ella" en esta oración?', correcta:'A Sofía', opts:['A Marta','A la bicicleta','Al ensayo'] },
  { oracion:'El profesor revisó los trabajos y LOS devolvió corregidos al día siguiente.', pregunta:'¿A qué se refiere "los" en esta oración?', correcta:'A los trabajos', opts:['A los estudiantes','A los días','Al profesor'] },
  { oracion:'Compramos frutas en la feria. ESTAS estaban más frescas que las del supermercado.', pregunta:'¿A qué se refiere "estas"?', correcta:'A las frutas de la feria', opts:['A las frutas del supermercado','A las ferias de la ciudad','A las compradoras'] },
  { oracion:'Llegaron los nuevos libros a la biblioteca. EL MÁS SOLICITADO fue una novela de aventuras.', pregunta:'¿A qué grupo pertenece "el más solicitado"?', correcta:'A los nuevos libros', opts:['A las bibliotecas de la comuna','A los estudiantes','A las novelas antiguas'] },
];
export function genGramatica8Round(){
  const recurso = 'El <b>modo verbal</b> indica la actitud del hablante frente a lo que dice: el <b>indicativo</b> expresa hechos reales o que se dan por ciertos ("viajaremos", "llegó"); el <b>subjuntivo</b> expresa deseos, dudas o posibilidades ("ojalá llueva", "quizás vengan"); y el <b>imperativo</b> expresa órdenes o instrucciones directas ("cierra la puerta"). Por otro lado, la <b>correferencia</b> es cuando una palabra (como un pronombre: "ella", "los", "estas") reemplaza a algo mencionado antes en el texto para no repetirlo — identificar correctamente a qué se refiere cada pronombre es esencial para entender bien de quién o de qué se está hablando en una oración.';
  if(Math.random()<0.6){
    const item = pick(MODO_VERBAL_BANK);
    const opts = shuffle(['Indicativo','Subjuntivo','Imperativo']).map(function(m){ return {label:m, value:m}; });
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.oracion+'"</p><p class="prompt-hint">¿En qué modo verbal está esta oración?</p>',
      options: opts, correctValue: item.modo, speakText: item.oracion, cols:3, kind:'word', panel:true,
      explain: item.explicacion,
      recurso: recurso,
    };
  }
  const item = pick(REFERENTE_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">"'+item.oracion+'"</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const PUNTUACION_8_BANK = [
  { incorrecta:'Compré manzanas peras y naranjas en la feria.', correcta:'Compré manzanas, peras y naranjas en la feria.', regla:'En una enumeración, los elementos se separan con comas (excepto antes de la "y" final).' },
  { incorrecta:'Sofía ven a ayudarme con las bolsas.', correcta:'Sofía, ven a ayudarme con las bolsas.', regla:'El vocativo (el nombre de la persona a quien se habla) se separa con coma.' },
  { incorrecta:'Mi abuelo que vive en Valdivia cumple 80 años.', correcta:'Mi abuelo, que vive en Valdivia, cumple 80 años.', regla:'Las aclaraciones intercaladas en la oración van entre comas.' },
  { incorrecta:'Trajimos todo lo necesario, carpa, sacos de dormir, linterna y comida.', correcta:'Trajimos todo lo necesario: carpa, sacos de dormir, linterna y comida.', regla:'Los dos puntos anuncian una enumeración que desarrolla lo dicho antes.' },
  { incorrecta:'Unos alumnos prefieren el taller de teatro, otros el de música, y unos pocos el de ajedrez', correcta:'Unos alumnos prefieren el taller de teatro; otros, el de música; y unos pocos, el de ajedrez.', regla:'El punto y coma separa partes de una enumeración que ya contienen comas internas.' },
  { incorrecta:'La profesora dijo, mañana habrá prueba.', correcta:'La profesora dijo: mañana habrá prueba.', regla:'Los dos puntos introducen una cita o el anuncio de lo que alguien dijo.' },
  { incorrecta:'Pedro el capitán del equipo dio el discurso final.', correcta:'Pedro, el capitán del equipo, dio el discurso final.', regla:'La aposición explicativa (una aclaración sobre el sujeto) va entre comas.' },
  { incorrecta:'No vino al ensayo, porque estaba enfermo, sin embargo avisó a tiempo.', correcta:'No vino al ensayo porque estaba enfermo; sin embargo, avisó a tiempo.', regla:'Antes de conectores como "sin embargo" se usa punto y coma (o punto), y después va coma.' },
  { incorrecta:'Queridos vecinos les informamos que el agua se cortará el martes.', correcta:'Queridos vecinos: les informamos que el agua se cortará el martes.', regla:'Tras el saludo o encabezado de una carta o comunicado van dos puntos.' },
  { incorrecta:'El viaje en resumen fue un éxito.', correcta:'El viaje, en resumen, fue un éxito.', regla:'Las expresiones intercaladas como "en resumen" o "por ejemplo" van entre comas.' },
];
export function genOrtografia8Round(){
  const recurso = 'La <b>coma</b> tiene varios usos: separa elementos en una enumeración, marca el vocativo (el nombre de a quién se le habla), y encierra aclaraciones o expresiones intercaladas dentro de una oración. Los <b>dos puntos</b> se usan para anunciar una enumeración, introducir una cita textual, o después del saludo en una carta o comunicado. El <b>punto y coma</b> separa partes de una enumeración que ya contienen comas internas, o va antes de conectores como "sin embargo" o "por lo tanto". Usar bien estos signos evita ambigüedades y hace que un texto se lea con la pausa y el ritmo correctos — una coma mal puesta (o ausente) puede cambiar por completo el sentido de una oración.';
  const item = pick(PUNTUACION_8_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien puntuada?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien puntuada?', cols:2, panel:true,
    explain: item.regla,
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/lengua-literatura/1-medio
   — OA01-24 + OAA. Cubiertos: OA03 (narrativa: conflicto y narrador), OA04
   (poesía: símbolo y lenguaje figurado), OA05-07 (texto dramático, tragedia,
   Romanticismo), OA09-10 (textos argumentativos y de medios), OA18
   (ortografía: pares de palabras que se confunden). Fuera: OA01-02,08
   (actitudinal/subjetivo), OA11 (ya cubierto de forma transversal por los
   módulos de comprensión anteriores), OA12-17 (producción escrita),
   OA19-23 (comunicación oral, desempeño o audio), OA24 (investigación,
   proceso propio). */
export const LENGUAJE_MODULES_M1 = [
  {id:'narrativam1', label:'Narrativa: Conflicto y Perspectiva', open:true, key:'narrativam1'},
  {id:'poesiam1', label:'Poesía: Símbolo y Lenguaje Figurado', open:true, key:'poesiam1'},
  {id:'dramaromanticismom1', label:'Texto Dramático y Romanticismo', open:true, key:'dramaromanticismom1'},
  {id:'argumentativomediosm1', label:'Textos Argumentativos y de Medios', open:true, key:'argumentativomediosm1'},
  {id:'ortografiam1', label:'Ortografía', open:true, key:'ortografiam1'},
];
export const LENGUAJE_POS_M1 = [
  {x:24,y:90},{x:68,y:72},{x:24,y:54},{x:68,y:36},{x:24,y:18}
];
const NARRATIVA_CONFLICTO_BANK = [
  { texto:'Camila sueña con ser piloto, pero su familia insiste en que siga la tradición de administrar el negocio familiar.', correcta:'Individuo vs. la sociedad o la familia', opts:['Individuo vs. sí mismo','Individuo vs. la naturaleza','Individuo vs. otro individuo'] },
  { texto:'El velero de Joaquín lucha contra una tormenta furiosa mientras intenta llegar a puerto antes del anochecer.', correcta:'Individuo vs. la naturaleza', opts:['Individuo vs. sí mismo','Individuo vs. otro individuo','Individuo vs. la sociedad'] },
  { texto:'Tomás sabe que debería decir la verdad, pero teme que sus amigos dejen de hablarle si lo hace.', correcta:'Individuo vs. sí mismo', opts:['Individuo vs. la naturaleza','Individuo vs. otro individuo','Individuo vs. la sociedad'] },
  { texto:'Dos hermanos se disputan quién heredará el taller de su padre, cada uno convencido de merecerlo más.', correcta:'Individuo vs. otro individuo', opts:['Individuo vs. sí mismo','Individuo vs. la naturaleza','Individuo vs. la sociedad'] },
  { texto:'Valentina fue criada para casarse joven, pero quiere estudiar en la universidad, algo mal visto en su pueblo.', correcta:'Individuo vs. la sociedad o la familia', opts:['Individuo vs. sí mismo','Individuo vs. otro individuo','Individuo vs. la naturaleza'] },
  { texto:'Un explorador debe cruzar un desierto sin agua, enfrentando el calor y la sed que ponen en riesgo su vida.', correcta:'Individuo vs. la naturaleza', opts:['Individuo vs. otro individuo','Individuo vs. sí mismo','Individuo vs. la sociedad'] },
  { texto:'Diego duda entre aceptar el trabajo de sus sueños en otra ciudad o quedarse a cuidar a su madre enferma.', correcta:'Individuo vs. sí mismo', opts:['Individuo vs. otro individuo','Individuo vs. la naturaleza','Individuo vs. la sociedad'] },
  { texto:'Dos vecinos compiten ferozmente por ganar el concurso anual del mejor jardín del barrio.', correcta:'Individuo vs. otro individuo', opts:['Individuo vs. la sociedad','Individuo vs. sí mismo','Individuo vs. la naturaleza'] },
  { texto:'Un joven que se declara vegetariano es rechazado por su comunidad, que considera esa costumbre una falta de respeto a sus tradiciones.', correcta:'Individuo vs. la sociedad o la familia', opts:['Individuo vs. la naturaleza','Individuo vs. otro individuo','Individuo vs. sí mismo'] },
];
const NARRATIVA_NARRADOR_BANK = [
  { texto:'"Yo caminaba por la playa cuando escuché un grito a lo lejos. Corrí sin pensar."', correcta:'Narrador protagonista (1ª persona)', opts:['Narrador testigo (1ª persona)','Narrador omnisciente (3ª persona)','Narrador de conocimiento relativo (3ª persona)'] },
  { texto:'"Vi a mi amiga Laura alejarse esa tarde. Nunca supe bien qué pensaba en ese momento, aunque lo he imaginado muchas veces."', correcta:'Narrador testigo (1ª persona)', opts:['Narrador protagonista (1ª persona)','Narrador omnisciente (3ª persona)','Narrador de conocimiento relativo (3ª persona)'] },
  { texto:'"Marcela sentía que el corazón se le apretaba, aunque no sabía todavía que su hermano ya había tomado la decisión de partir."', correcta:'Narrador omnisciente (3ª persona)', opts:['Narrador protagonista (1ª persona)','Narrador testigo (1ª persona)','Narrador de conocimiento relativo (3ª persona)'] },
  { texto:'"Pedro entró a la sala con paso firme. Nadie podía saber, con solo mirarlo, qué escondía bajo esa calma."', correcta:'Narrador de conocimiento relativo (3ª persona)', opts:['Narrador omnisciente (3ª persona)','Narrador protagonista (1ª persona)','Narrador testigo (1ª persona)'] },
  { texto:'"Yo fui quien encontró la carta escondida bajo el piso de la casa vieja, y desde entonces todo cambió para mí."', correcta:'Narrador protagonista (1ª persona)', opts:['Narrador testigo (1ª persona)','Narrador de conocimiento relativo (3ª persona)','Narrador omnisciente (3ª persona)'] },
  { texto:'"Observé toda la escena desde la ventana de mi cuarto, sin que ninguno de los dos protagonistas notara mi presencia."', correcta:'Narrador testigo (1ª persona)', opts:['Narrador protagonista (1ª persona)','Narrador omnisciente (3ª persona)','Narrador de conocimiento relativo (3ª persona)'] },
  { texto:'"Ambos personajes creían tener la razón, y ambos, en el fondo, sabían que estaban equivocados desde el principio."', correcta:'Narrador omnisciente (3ª persona)', opts:['Narrador de conocimiento relativo (3ª persona)','Narrador protagonista (1ª persona)','Narrador testigo (1ª persona)'] },
  { texto:'"La mujer se detuvo frente a la puerta. Algo en su expresión dejaba entrever una duda, aunque nadie podía adivinar cuál."', correcta:'Narrador de conocimiento relativo (3ª persona)', opts:['Narrador omnisciente (3ª persona)','Narrador testigo (1ª persona)','Narrador protagonista (1ª persona)'] },
];
export function genNarrativaM1Round(){
  const recurso = 'El <b>conflicto narrativo</b> es el problema central que mueve una historia; puede darse entre dos personajes (individuo vs. individuo), entre un personaje y la naturaleza, dentro de la propia mente de un personaje (individuo vs. sí mismo), o entre un personaje y las normas de su sociedad o familia. Identificar el tipo de conflicto ayuda a entender de qué trata realmente la historia. El <b>narrador</b>, por su parte, es la voz que cuenta los hechos, y puede adoptar distintas perspectivas: protagonista (cuenta su propia historia en 1ª persona), testigo (observa y cuenta lo que le pasa a otros, en 1ª persona), omnisciente (en 3ª persona, conoce los pensamientos de todos los personajes) o de conocimiento relativo (en 3ª persona, pero solo conoce lo que se puede observar desde afuera, sin acceso a los pensamientos internos).';
  if(Math.random()<0.5){
    const item = pick(NARRATIVA_CONFLICTO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué tipo de conflicto narrativo se presenta?</p>',
      options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
      explain: 'El conflicto de esta historia es: <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(NARRATIVA_NARRADOR_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué tipo de narrador presenta este fragmento?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Este fragmento tiene un: <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

const POESIA_BANK = [
  { verso:'"Eres la paloma blanca que sobrevuela mi pueblo en tiempos de guerra."', correcta:'Símbolo (la paloma representa la paz)', opts:['Hipérbole','Anáfora','Rima consonante'] },
  { verso:'"Tus ojos son dos luceros que iluminan mi camino."', correcta:'Metáfora', opts:['Símbolo','Anáfora','Hipérbole'] },
  { verso:'"Te llamé mil veces, te busqué mil veces, te esperé mil veces."', correcta:'Anáfora (repetición al inicio de cada verso)', opts:['Metáfora','Símbolo','Hipérbole'] },
  { verso:'"Lloré un río de lágrimas toda la noche."', correcta:'Hipérbole (exageración)', opts:['Símbolo','Anáfora','Metáfora'] },
  { verso:'"La rosa marchita en su florero recuerda que todo amor es pasajero."', correcta:'Símbolo (la rosa marchita representa lo efímero)', opts:['Anáfora','Hipérbole','Rima asonante'] },
  { verso:'"El viento es un caballo desbocado galopando entre los cerros."', correcta:'Metáfora', opts:['Símbolo','Hipérbole','Anáfora'] },
  { verso:'"Nunca más volveré, nunca más te veré, nunca más olvidaré."', correcta:'Anáfora (repetición al inicio de cada verso)', opts:['Hipérbole','Metáfora','Símbolo'] },
  { verso:'"Te esperé una eternidad frente a esa puerta cerrada."', correcta:'Hipérbole (exageración)', opts:['Metáfora','Anáfora','Símbolo'] },
  { verso:'"El cóndor que cruza libre la cordillera es el espíritu indomable de mi tierra."', correcta:'Símbolo (el cóndor representa la libertad)', opts:['Hipérbole','Anáfora','Metáfora'] },
];
export function genPoesiaM1Round(){
  const recurso = 'En poesía, un <b>símbolo</b> es un objeto o imagen concreta que representa una idea abstracta más amplia (como una paloma blanca representando la paz, o una rosa marchita representando lo efímero del amor) — a diferencia de la metáfora, el símbolo suele tener un significado más fijo y reconocible culturalmente. La <b>metáfora</b> compara dos cosas distintas sin usar "como", afirmando que una ES la otra ("tus ojos son luceros"). La <b>anáfora</b> es la repetición de una palabra o frase al inicio de varios versos seguidos, y se usa para dar énfasis o ritmo. La <b>hipérbole</b> es una exageración deliberada para producir un efecto expresivo más fuerte ("lloré un río de lágrimas"). Reconocer estos recursos ayuda a entender qué efecto buscaba crear el poeta, más allá del significado literal de las palabras.';
  const item = pick(POESIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.verso+'</p><p class="prompt-hint">¿Qué recurso literario predomina en este verso?</p>',
    options: opts, correctValue: item.correcta, speakText: item.verso, cols:2, panel:true,
    explain: 'Este verso usa: <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

const DRAMA_BANK = [
  { texto:'Dos personajes discuten en escena mientras uno amenaza con revelar un secreto que arruinaría al otro.', correcta:'Conflicto dramático', opts:['Acotación escénica','Evolución del personaje','Coro griego'] },
  { texto:'"(Entra por la puerta izquierda, con la luz tenue de una vela, mientras suena música lejana.)"', correcta:'Acotación escénica', opts:['Conflicto dramático','Diálogo','Monólogo interior'] },
  { texto:'Al inicio de la obra, el protagonista es cobarde; al final, tras enfrentar sus miedos, actúa con valentía.', correcta:'Evolución del personaje', opts:['Acotación escénica','Conflicto dramático','Puesta en escena'] },
  { texto:'El vestuario, la iluminación y la disposición de los actores en el escenario transmiten el ambiente opresivo de la obra.', correcta:'Puesta en escena', opts:['Conflicto dramático','Evolución del personaje','Diálogo'] },
];
const TRAGEDIA_ROMANTICISMO_BANK = [
  { pregunta:'En la tragedia griega, ¿qué representa el "destino" (fatum) en la vida de los personajes?', correcta:'Una fuerza superior e inevitable que determina lo que le ocurrirá al héroe', opts:['Una decisión libre que el héroe siempre puede cambiar','Un castigo que solo afecta a los dioses','Una tradición sin ninguna consecuencia real'] },
  { pregunta:'¿Qué es la "hybris" en la tragedia griega?', correcta:'El exceso de orgullo o soberbia del héroe frente a los dioses', opts:['Un tipo de vestuario usado por los actores','El coro que comenta la acción','Un final feliz inesperado'] },
  { pregunta:'¿Qué busca provocar en el público la "catarsis" al final de una tragedia?', correcta:'Una liberación emocional a través de la compasión y el temor', opts:['Risa y diversión sin ninguna reflexión','Indiferencia total ante lo ocurrido','Confusión sobre el final de la historia'] },
  { pregunta:'¿Cuál de estas características define mejor al Romanticismo como movimiento literario?', correcta:'Exaltar el sentimiento, la subjetividad y la naturaleza por sobre la razón', opts:['Seguir estrictamente las normas clásicas grecorromanas','Describir la realidad de forma fría y objetiva','Evitar cualquier expresión de emociones personales'] },
  { pregunta:'¿Qué papel cumple la naturaleza en muchas obras románticas?', correcta:'Refleja o intensifica el estado de ánimo del protagonista', opts:['Es solo un decorado sin ningún significado','Representa siempre el progreso científico','Aparece únicamente como fuente de datos geográficos'] },
  { pregunta:'¿Qué otro rasgo es típico del Romanticismo, además del sentimiento y la naturaleza?', correcta:'El interés por lo individual, lo nacional y lo popular de cada pueblo', opts:['El rechazo total a cualquier identidad nacional','La preferencia exclusiva por temas matemáticos','La eliminación de todo conflicto amoroso'] },
];
export function genDramaRomanticismoM1Round(){
  const recurso = 'El <b>texto dramático</b> se construye principalmente con diálogo y se representa ante un público; sus elementos clave son el conflicto dramático (el problema central entre los personajes), la evolución del personaje (cómo cambia a lo largo de la obra) y la puesta en escena (vestuario, iluminación, y disposición de actores, indicada muchas veces mediante acotaciones entre paréntesis). La <b>tragedia griega</b> se basa en una cosmovisión donde el destino (fatum) es una fuerza superior e inevitable; el héroe suele caer por su propia hybris (exceso de orgullo), y el público experimenta catarsis (una liberación emocional) al presenciar su caída. El <b>Romanticismo</b> (siglo XIX) fue un movimiento literario que valoró el sentimiento y la subjetividad por sobre la razón, exaltó la naturaleza como reflejo del alma del protagonista, y mostró un fuerte interés por lo individual, lo nacional y lo popular de cada pueblo.';
  if(Math.random()<0.5){
    const item = pick(DRAMA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué elemento del texto dramático se ilustra aquí?</p>',
      options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
      explain: 'Esto ilustra: <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(TRAGEDIA_ROMANTICISMO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ARGUMENTATIVO_BANK = [
  { texto:'"La municipalidad debería prohibir los autos en el centro histórico. El aire ahí es irrespirable y los turistas se quejan constantemente."', pregunta:'¿Cuál es la tesis (idea principal que se defiende) de esta columna de opinión?', correcta:'Que se deberían prohibir los autos en el centro histórico', opts:['Que el aire del centro es irrespirable','Que los turistas se quejan mucho','Que la municipalidad no hace nada'] },
  { texto:'"El nuevo parque tiene 3 hectáreas y fue inaugurado el sábado pasado." vs. "El nuevo parque es una maravilla que todos deberían visitar."', pregunta:'¿Cuál de estas dos frases es un HECHO y cuál es una OPINIÓN?', correcta:'La primera es un hecho (dato verificable); la segunda es una opinión (juicio de valor)', opts:['Ambas son hechos verificables','Ambas son opiniones personales','La primera es opinión y la segunda es hecho'] },
  { texto:'Una columna de opinión afirma: "Es evidente que subir los impuestos arruinará a todas las familias del país."', pregunta:'¿Qué palabra de esta frase revela que se trata de una opinión y no de un hecho probado?', correcta:'"Evidente" (presenta como innegable algo que en realidad es discutible)', opts:['"Impuestos" (es un término técnico neutro)','"País" (es un sustantivo objetivo)','"Familias" (es un dato demográfico)'] },
  { texto:'"El colegio debería tener más horas de arte. Sin duda, eso mejoraría la creatividad de todos los estudiantes."', pregunta:'¿Cuál es la tesis de esta columna de opinión?', correcta:'Que el colegio debería tener más horas de arte', opts:['Que la creatividad no se puede desarrollar','Que todos los estudiantes son creativos por naturaleza','Que el colegio ya tiene suficientes horas de arte'] },
  { texto:'"El río mide 40 kilómetros de largo." vs. "El río es el paisaje más hermoso de la región."', pregunta:'¿Cuál de estas dos frases es un HECHO y cuál es una OPINIÓN?', correcta:'La primera es un hecho (dato medible); la segunda es una opinión (juicio estético)', opts:['Ambas son hechos verificables','Ambas son opiniones personales','La primera es opinión y la segunda es hecho'] },
];
const MEDIOS_M1_BANK = [
  { texto:'Un aviso publicitario muestra a una persona feliz y exitosa usando cierto producto, sin dar ningún dato concreto sobre sus beneficios.', pregunta:'¿Qué estrategia de persuasión está usando este aviso?', correcta:'Apelar a la emoción y a la aspiración, en vez de a datos objetivos', opts:['Presentar estadísticas verificables','Citar estudios científicos independientes','Comparar precios con la competencia'] },
  { texto:'Una noticia usa un titular alarmante y una imagen dramática, aunque el cuerpo de la noticia matiza mucho la gravedad del hecho.', pregunta:'¿Qué deberías hacer como lector crítico frente a esta noticia?', correcta:'Leer el cuerpo completo de la noticia, no quedarse solo con el titular y la imagen', opts:['Creer siempre el titular sin leer más','Compartir la noticia de inmediato sin verificarla','Ignorar cualquier noticia con imágenes'] },
  { texto:'Un sitio web de dudosa reputación afirma algo sin citar ninguna fuente, mientras un medio reconocido cita a tres expertos distintos sobre el mismo tema.', pregunta:'¿Cuál de las dos fuentes es más confiable, y por qué?', correcta:'El medio reconocido, porque cita fuentes expertas verificables', opts:['El sitio web, porque es más directo','Ambas son igual de confiables','Ninguna de las dos es confiable nunca'] },
  { texto:'Un reportaje de televisión usa música dramática y cámara lenta para mostrar un hecho cotidiano como si fuera algo excepcional.', pregunta:'¿Qué estrategia audiovisual está usando este reportaje para persuadir?', correcta:'Usar efectos de sonido e imagen para generar un impacto emocional mayor al del hecho real', opts:['Presentar únicamente datos estadísticos verificables','Citar fuentes académicas independientes','No usar ningún recurso audiovisual'] },
  { texto:'Una publicación en redes sociales asegura algo alarmante sobre un producto, pero no incluye ningún enlace ni fuente verificable.', pregunta:'¿Qué debería hacer un lector crítico antes de compartir esta publicación?', correcta:'Buscar si existen fuentes confiables que respalden esa información antes de compartirla', opts:['Compartirla de inmediato porque suena importante','Ignorar siempre cualquier publicación en redes sociales','Asumir que es verdad porque tiene muchos "me gusta"'] },
];
export function genArgumentativoMediosM1Round(){
  const recurso = 'En un <b>texto argumentativo</b> (como una columna de opinión), la <b>tesis</b> es la idea principal que el autor defiende, respaldada por argumentos. Es fundamental distinguir un <b>hecho</b> (algo verificable con datos o evidencia) de una <b>opinión</b> (un juicio de valor personal, que puede ser válido pero no es objetivamente comprobable) — palabras como "evidente", "obviamente" o "sin duda" a veces disfrazan una opinión como si fuera un hecho indiscutible. Los <b>textos de medios de comunicación</b> (noticias, publicidad, reportajes) usan distintas estrategias para persuadir: apelar a las emociones en vez de a datos objetivos, usar imágenes o titulares llamativos, o citar (o no citar) fuentes confiables. Un lector crítico siempre revisa la veracidad de la información, identifica quién habla y con qué propósito, antes de aceptar una idea como verdadera.';
  if(Math.random()<0.5){
    const item = pick(ARGUMENTATIVO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(MEDIOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ORTOGRAFIA_M1_BANK = [
  { incorrecta:'No quiero ir a la fiesta, si no quedarme leyendo en casa.', correcta:'No quiero ir a la fiesta, sino quedarme leyendo en casa.', regla:'"Sino" (junto) contrapone dos ideas; "si no" (separado) es una condición negativa ("si no llueve, saldremos").' },
  { incorrecta:'Si no llegas a tiempo, sino te esperamos.', correcta:'Si no llegas a tiempo, no te esperamos.', regla:'"Si no" (separado) introduce una condición negativa, no una contraposición.' },
  { incorrecta:'Dejamos las maletas haber en la entrada de la casa.', correcta:'Dejamos las maletas a ver en la entrada de la casa.', regla:'"A ver" (separado) es "mirar" o "comprobar"; "haber" es el verbo (con h).' },
  { incorrecta:'Debe a ver mucha gente en el concierto de esta noche.', correcta:'Debe haber mucha gente en el concierto de esta noche.', regla:'"Haber" es el verbo auxiliar; "a ver" se usa para mirar algo, no como verbo auxiliar.' },
  { incorrecta:'Iremos adonde tú quieras, no importa el lugar que sea.', correcta:'Iremos adonde tú quieras, no importa el lugar que sea.', regla:'"Adonde" (junto) se usa cuando ya se conoce el lugar de destino mencionado antes.' },
  { incorrecta:'¿A dónde vas tan apurada esta mañana?', correcta:'¿A dónde vas tan apurada esta mañana?', regla:'"A dónde" (separado y con tilde) se usa en preguntas directas sobre un destino.' },
  { incorrecta:'Compró un auto a parte, distinto del que ya tenía en el taller.', correcta:'Compró un auto aparte, distinto del que ya tenía en el taller.', regla:'"Aparte" (junto) significa "además" o "por separado"; "a parte" (separado) se refiere a una parte de algo.' },
  { incorrecta:'Solo revisamos aparte del informe, no el documento completo.', correcta:'Solo revisamos a parte del informe, no el documento completo.', regla:'"A parte" (separado) se refiere a una porción de algo, como "una parte del informe".' },
];
export function genOrtografiaM1Round(){
  const recurso = 'Varios pares de palabras se confunden en la escritura porque suenan parecido pero tienen significados distintos: <b>sino/si no</b> — "sino" (junto) contrapone dos ideas ("no quiero esto, sino aquello"), mientras "si no" (separado) plantea una condición negativa ("si no estudias, repruebas"). <b>Haber/a ver</b> — "haber" es el verbo auxiliar ("debe haber gente"), mientras "a ver" significa "mirar o comprobar algo" ("vamos a ver qué pasa"). <b>Adonde/a dónde</b> — "adonde" (junto) se usa cuando el lugar ya se mencionó antes, mientras "a dónde" (separado, con tilde en preguntas) se usa para preguntar por un destino. <b>Aparte/a parte</b> — "aparte" (junto) significa "además" o "por separado", mientras "a parte" (separado) se refiere a una porción de algo. Distinguir estos pares evita errores de ortografía que pueden cambiar el sentido de una oración.';
  const item = pick(ORTOGRAFIA_M1_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien escrita?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien escrita?', cols:2, panel:true,
    explain: item.regla,
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/lengua-literatura/2-medio — OA01-24.
   Cubiertos: OA03 (narrativa: personajes, estereotipos, intertextualidad), OA04
   (poesía: actitud del hablante, estructura del soneto), OA05-06 (texto dramático +
   Siglo de Oro, fusionados), OA07 (cuento latinoamericano moderno/contemporáneo),
   OA09-10 (textos argumentativos + medios de comunicación, fusionados) y OA18
   (ortografía y puntuación — reglas de coma/dos puntos/punto y coma, distintas de
   las de 1° medio). Fuera: OA01-02,11 (lectura personal/reflexión, actitudinal),
   OA08 (interpretación personal con hipótesis propia), OA12-17 (producción
   escrita), OA19-23 (comunicación oral, desempeño real), OA24 (investigación,
   proceso propio). */
export const LENGUAJE_MODULES_M2 = [
  {id:'narrativam2', label:'Narrativa: Personajes y Estereotipos', open:true, key:'narrativam2'},
  {id:'poesiam2', label:'Poesía: Hablante y Soneto', open:true, key:'poesiam2'},
  {id:'teatrosigloorom2', label:'Teatro y Siglo de Oro', open:true, key:'teatrosigloorom2'},
  {id:'cuentolatinoamericanom2', label:'Cuento Latinoamericano', open:true, key:'cuentolatinoamericanom2'},
  {id:'argumentativomediosm2', label:'Textos Argumentativos y Medios', open:true, key:'argumentativomediosm2'},
  {id:'ortografiam2', label:'Ortografía y Puntuación', open:true, key:'ortografiam2'},
];
export const LENGUAJE_POS_M2 = [
  {x:24,y:92},{x:68,y:76},{x:24,y:60},{x:68,y:44},{x:24,y:28},{x:68,y:12}
];

const NARRATIVA_M2_PERSONAJE_BANK = [
  { texto:'A lo largo de la novela, el protagonista pasa de ser un joven cobarde y egoísta a convertirse en alguien valiente y generoso tras enfrentar la pérdida de su hermano.', correcta:'Personaje redondo (complejo, evoluciona a lo largo de la historia)', opts:['Personaje plano (estereotipado, no cambia)','Narrador omnisciente','Antagonista secundario'] },
  { texto:'El villano de la historia es "malo" en cada escena, sin ninguna motivación explicada ni ningún cambio: siempre actúa igual, del principio al fin.', correcta:'Personaje plano (estereotipado, no cambia)', opts:['Personaje redondo (complejo, evoluciona)','Narrador testigo','Protagonista'] },
  { texto:'En muchas películas, "el nerd" siempre usa lentes gruesos, es torpe socialmente y es experto en tecnología, sin ningún otro rasgo que lo distinga.', correcta:'Estereotipo (personaje reducido a un solo rasgo fijo)', opts:['Personaje redondo','Antihéroe','Narrador protagonista'] },
  { texto:'Un cuento actual incluye, como guiño, el nombre de un personaje de otra novela famosa, invitando al lector a relacionar ambas historias.', correcta:'Intertextualidad (relación entre dos obras distintas)', opts:['Estereotipo','Personaje plano','Narrador omnisciente'] },
  { texto:'Al final del relato, la protagonista —que empezó desconfiando de todos— aprende a confiar en sus nuevos vecinos gracias a la ayuda que recibió de ellos.', correcta:'Personaje redondo (complejo, evoluciona a lo largo de la historia)', opts:['Personaje plano (estereotipado, no cambia)','Narrador testigo','Estereotipo'] },
  { texto:'"La madrastra malvada" de un cuento siempre trata mal a la protagonista sin ninguna razón explicada, exactamente igual en cada escena en la que aparece.', correcta:'Estereotipo (personaje reducido a un solo rasgo fijo)', opts:['Personaje redondo','Intertextualidad','Antagonista complejo'] },
  { texto:'Un autor incluye, en medio de su novela, una escena que imita casi exactamente el estilo de un clásico literario muy conocido.', correcta:'Intertextualidad (relación entre dos obras distintas)', opts:['Estereotipo','Personaje plano','Conflicto narrativo'] },
  { texto:'El detective de la serie siempre resuelve el caso solo, es frío con todos, y nunca muestra ninguna emoción distinta a lo largo de toda la temporada.', correcta:'Personaje plano (estereotipado, no cambia)', opts:['Personaje redondo (complejo, evoluciona)','Intertextualidad','Narrador protagonista'] },
  { texto:'Con el paso de los capítulos, el antagonista revela sus propias razones y el lector empieza a comprenderlo, aunque sus acciones sigan siendo cuestionables.', correcta:'Personaje redondo (complejo, evoluciona a lo largo de la historia)', opts:['Estereotipo','Personaje plano (no cambia)','Narrador omnisciente'] },
  { texto:'En una novela de ciencia ficción, "el científico loco" siempre tiene el pelo desordenado, habla solo, y busca el poder absoluto, sin ningún otro matiz.', correcta:'Estereotipo (personaje reducido a un solo rasgo fijo)', opts:['Personaje redondo','Intertextualidad','Protagonista'] },
];
export function genNarrativaM2Round(){
  const recurso = 'Un <b>personaje redondo</b> (o complejo) tiene varias dimensiones y puede cambiar o sorprender a lo largo de la historia, mientras que un <b>personaje plano</b> se mantiene igual del principio al fin, con pocos rasgos. Un <b>estereotipo</b> es un tipo de personaje plano llevado al extremo: se reduce a un solo rasgo fijo y reconocible (como "el nerd" o "el villano malvado sin motivos"), sin más profundidad. La <b>intertextualidad</b> ocurre cuando una obra literaria hace referencia, cita o dialoga con otra obra distinta — un guiño que el lector puede reconocer si conoce ambos textos, y que enriquece la interpretación al conectar dos historias entre sí.';
  const item = pick(NARRATIVA_M2_PERSONAJE_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué concepto narrativo se ilustra aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Esto ilustra: <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

const POESIA_M2_HABLANTE_BANK = [
  { verso:'"El mar se extiende hasta el horizonte, gris y silencioso bajo el cielo de invierno."', correcta:'Actitud enunciativa (el hablante describe algo, sin dirigirse a nadie)', opts:['Actitud apostrófica (se dirige a un tú)','Actitud carmínica (expresa sus sentimientos)','Rima consonante'] },
  { verso:'"Tú, que fuiste mi refugio en la tormenta, ¿por qué te alejas ahora que más te necesito?"', correcta:'Actitud apostrófica (el hablante se dirige directamente a un "tú")', opts:['Actitud enunciativa (describe algo)','Actitud carmínica (expresa sentimientos propios)','Estructura del soneto'] },
  { verso:'"Siento que mi pecho se quiebra de tristeza cada vez que recuerdo aquellos días felices."', correcta:'Actitud carmínica (el hablante expresa sus propios sentimientos)', opts:['Actitud enunciativa (describe algo externo)','Actitud apostrófica (se dirige a un tú)','Anáfora'] },
  { verso:'"La ciudad despierta lentamente, con sus calles vacías y sus luces que se apagan una a una."', correcta:'Actitud enunciativa (el hablante describe algo, sin dirigirse a nadie)', opts:['Actitud apostrófica (se dirige a un tú)','Actitud carmínica (expresa sus sentimientos)','Hipérbole'] },
  { verso:'"Oh, viento, que recorres estos valles, llévate contigo mi tristeza esta noche."', correcta:'Actitud apostrófica (el hablante se dirige directamente a un "tú")', opts:['Actitud enunciativa (describe algo)','Actitud carmínica (expresa sentimientos propios)','Símbolo'] },
  { verso:'"No puedo dejar de pensar en ti; mi alegría depende por completo de tu presencia."', correcta:'Actitud carmínica (el hablante expresa sus propios sentimientos)', opts:['Actitud enunciativa (describe algo externo)','Actitud apostrófica (se dirige a un tú)','Estructura del soneto'] },
  { verso:'"Las montañas se alzan silenciosas al fondo del valle, cubiertas de nieve desde hace semanas."', correcta:'Actitud enunciativa (el hablante describe algo, sin dirigirse a nadie)', opts:['Actitud apostrófica (se dirige a un tú)','Actitud carmínica (expresa sus sentimientos)','Metáfora'] },
  { verso:'"Tú, estrella lejana, guía mis pasos en esta noche donde todo parece perdido."', correcta:'Actitud apostrófica (el hablante se dirige directamente a un "tú")', opts:['Actitud enunciativa (describe algo)','Actitud carmínica (expresa sentimientos propios)','Anáfora'] },
];
const SONETO_M2_BANK = [
  { pregunta:'¿Cuántos versos tiene un soneto clásico?', correcta:'14 versos', opts:['8 versos','10 versos','16 versos'] },
  { pregunta:'¿Cómo se organizan las estrofas de un soneto clásico?', correcta:'Dos cuartetos (4 versos) y dos tercetos (3 versos)', opts:['Cuatro estrofas de 4 versos cada una','Un solo bloque continuo sin estrofas','Dos estrofas de 7 versos cada una'] },
  { pregunta:'¿Cuántos versos tiene, en total, un cuarteto dentro de un soneto?', correcta:'4 versos', opts:['3 versos','7 versos','2 versos'] },
  { pregunta:'¿En qué período literario se popularizó especialmente el soneto en español?', correcta:'El Siglo de Oro español', opts:['El siglo XX latinoamericano','La Edad Media temprana','El período de entreguerras'] },
];
export function genPoesiaM2Round(){
  const recurso = 'La <b>actitud del hablante lírico</b> describe la postura desde la que se expresa un poema: en la <b>actitud enunciativa</b>, el hablante describe o narra algo de forma más objetiva, sin dirigirse a nadie en particular; en la <b>actitud apostrófica</b>, el hablante se dirige directamente a un "tú" (una persona, un objeto o una idea personificada); y en la <b>actitud carmínica</b> (o de la canción), el hablante expresa directamente sus propios sentimientos e interioridad. El <b>soneto</b> es una forma poética clásica de 14 versos, organizados en dos cuartetos (estrofas de 4 versos) seguidos de dos tercetos (estrofas de 3 versos) — una estructura muy usada durante el Siglo de Oro español.';
  if(Math.random()<0.6){
    const item = pick(POESIA_M2_HABLANTE_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.verso+'</p><p class="prompt-hint">¿Qué actitud del hablante lírico predomina en este verso?</p>',
      options: opts, correctValue: item.correcta, speakText: item.verso, cols:2, panel:true,
      explain: 'Este verso presenta una: <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(SONETO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const SIGLO_ORO_BANK = [
  { pregunta:'¿Qué obra de Miguel de Cervantes es considerada la primera novela moderna y una de las más importantes del Siglo de Oro español?', correcta:'Don Quijote de la Mancha', opts:['La Celestina','El Cid Campeador','La Divina Comedia'] },
  { pregunta:'¿Qué dramaturgo español creó la "comedia nueva", una fórmula teatral con mezcla de lo trágico y lo cómico, muy popular en el Siglo de Oro?', correcta:'Lope de Vega', opts:['Miguel de Cervantes','William Shakespeare','Federico García Lorca'] },
  { pregunta:'¿En qué siglos se sitúa aproximadamente el Siglo de Oro español?', correcta:'Entre los siglos XVI y XVII', opts:['Entre los siglos XII y XIII','Entre los siglos XIX y XX','Entre los siglos VIII y IX'] },
  { pregunta:'¿Qué característica es típica del teatro del Siglo de Oro español (la "comedia nueva")?', correcta:'Mezclar elementos trágicos y cómicos en una misma obra, rompiendo con las reglas clásicas', opts:['Seguir estrictamente la separación entre tragedia y comedia','Prohibir cualquier tema relacionado con el honor','Evitar por completo los personajes nobles'] },
  { pregunta:'¿Qué tema era muy frecuente en las obras teatrales del Siglo de Oro español?', correcta:'El honor y la fama personal o familiar', opts:['Los viajes espaciales','La tecnología futurista','La vida en otros planetas'] },
  { pregunta:'¿Por qué se considera a "Don Quijote de la Mancha" una obra fundacional de la novela moderna?', correcta:'Porque combina aventura, parodia y una profunda reflexión sobre la realidad y la ficción', opts:['Porque fue el primer libro impreso en español','Porque no tiene ningún personaje principal','Porque está escrito completamente en verso'] },
  { pregunta:'¿Qué buscaba principalmente Lope de Vega al crear la "comedia nueva"?', correcta:'Entretener a un público amplio, rompiendo las reglas clásicas de unidad de tiempo, lugar y acción', opts:['Seguir estrictamente las reglas del teatro griego clásico','Escribir solamente para la corte real, sin público general','Eliminar cualquier tipo de diálogo entre personajes'] },
];
const TEATRO_M2_BANK = [
  { texto:'La escena transcurre en un castillo en ruinas, con niebla y sonidos de truenos que anticipan una tragedia.', correcta:'Ambiente o atmósfera dramática', opts:['Conflicto dramático','Estereotipo','Intertextualidad'] },
  { texto:'Una corona rota que aparece en escena representa, sin necesidad de palabras, la caída del poder del protagonista.', correcta:'Símbolo escénico', opts:['Acotación técnica','Estereotipo','Diálogo directo'] },
  { texto:'La luz tenue de unas velas y el sonido de una guitarra lejana crean una sensación de nostalgia en toda la escena.', correcta:'Ambiente o atmósfera dramática', opts:['Conflicto dramático','Intertextualidad','Estereotipo'] },
  { texto:'Un espejo roto que un personaje observa fijamente representa, sin decir nada, su identidad fracturada.', correcta:'Símbolo escénico', opts:['Acotación técnica','Diálogo directo','Estereotipo'] },
  { texto:'Colores oscuros en el vestuario y una iluminación fría transmiten desde el inicio un clima de tensión y peligro.', correcta:'Ambiente o atmósfera dramática', opts:['Conflicto dramático','Estereotipo','Intertextualidad'] },
];
export function genTeatroSigloOroM2Round(){
  const recurso = 'El <b>texto dramático</b> se puede analizar considerando su ambiente o atmósfera (el clima emocional que transmite la escena, muchas veces a través de la iluminación, el sonido o el espacio), y sus símbolos escénicos (objetos que representan una idea sin necesidad de palabras, como una corona rota que simboliza la caída del poder). El <b>Siglo de Oro español</b> (aproximadamente siglos XVI-XVII) fue un período de enorme producción literaria: Miguel de Cervantes escribió "Don Quijote de la Mancha", considerada la primera novela moderna, y Lope de Vega creó la "comedia nueva", una fórmula teatral que mezclaba libremente lo trágico y lo cómico, rompiendo con las reglas clásicas grecorromanas.';
  if(Math.random()<0.5){
    const item = pick(SIGLO_ORO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(TEATRO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué elemento del texto dramático se ilustra aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Esto ilustra: <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

const CUENTO_LATAM_BANK = [
  { pregunta:'En muchos cuentos latinoamericanos del "realismo mágico" (como los de Gabriel García Márquez), ¿cómo se presentan los elementos fantásticos?', correcta:'Como parte normal y cotidiana de la realidad, sin sorprender a los personajes', opts:['Siempre como sueños que luego se explican racionalmente','Como efectos especiales de una película','Nunca aparecen elementos fantásticos en este género'] },
  { pregunta:'En el cuento fantástico latinoamericano (como en varios relatos de Julio Cortázar o Jorge Luis Borges), ¿qué suele generar la irrupción de lo extraño en la realidad cotidiana?', correcta:'Incertidumbre o inquietud en el lector, al no saber si lo extraño tiene una explicación racional', opts:['Siempre una explicación científica clara al final','Ninguna reacción, ya que se explica todo de inmediato','Un final feliz garantizado en cada relato'] },
  { pregunta:'¿Qué caracterizó al "Boom latinoamericano" de literatura (décadas de 1960-1970)?', correcta:'La proyección internacional de autores latinoamericanos con propuestas narrativas innovadoras', opts:['El fin de la publicación de literatura latinoamericana','Una prohibición de temas políticos en la narrativa','Solo la traducción de literatura europea al español'] },
  { pregunta:'¿Qué elemento suele estar presente en los cuentos latinoamericanos contemporáneos ambientados en zonas rurales o pequeños pueblos?', correcta:'Tradiciones, creencias populares y un fuerte sentido de comunidad e identidad local', opts:['Rechazo total a cualquier tradición cultural','Ambientes exclusivamente urbanos y tecnológicos','Ausencia completa de personajes secundarios'] },
  { pregunta:'En un cuento de realismo mágico, un personaje asegura haber visto llover flores amarillas sobre el pueblo, y nadie a su alrededor se sorprende ni lo cuestiona. ¿Qué recurso se observa?', correcta:'Realismo mágico: lo fantástico se presenta como parte normal de la realidad cotidiana', opts:['Cuento fantástico clásico con final explicado','Un texto puramente informativo, sin ficción','Ciencia ficción con explicación tecnológica'] },
  { pregunta:'En un relato fantástico, el protagonista empieza a notar que los objetos de su casa cambian de lugar solos, sin que el cuento aclare nunca si es real o imaginado. ¿Qué efecto busca esto en el lector?', correcta:'Generar incertidumbre, dejando abierta la duda entre una explicación racional o sobrenatural', opts:['Confirmar de inmediato que todo fue un sueño','Explicar el fenómeno con una fórmula científica precisa','Eliminar cualquier tensión narrativa del relato'] },
  { pregunta:'¿Qué significó para la literatura latinoamericana que autores del "Boom" fueran traducidos y leídos en muchos países del mundo?', correcta:'Que la narrativa latinoamericana ganó reconocimiento y una influencia literaria a nivel internacional', opts:['Que la literatura latinoamericana dejó de escribirse en español','Que ningún autor latinoamericano fue leído antes de esa época','Que se prohibió la publicación de nuevos autores'] },
  { pregunta:'Un cuento ambientado en un pueblo andino incluye creencias sobre espíritus de la naturaleza que los personajes respetan como parte real de su vida diaria. ¿Qué refleja esto?', correcta:'La fuerte identidad cultural y las creencias populares propias de comunidades latinoamericanas', opts:['Un error de coherencia dentro del relato','Una crítica a cualquier tipo de tradición cultural','Un género exclusivamente de ciencia ficción'] },
];
export function genCuentoLatinoamericanoM2Round(){
  const recurso = 'El <b>cuento latinoamericano moderno y contemporáneo</b> desarrolló corrientes propias muy influyentes: el <b>realismo mágico</b> (asociado a Gabriel García Márquez) presenta elementos fantásticos como si fueran parte normal de la vida cotidiana, sin que los personajes se sorprendan; mientras que el <b>cuento fantástico</b> (como el de Julio Cortázar o Jorge Luis Borges) irrumpe con lo extraño en un mundo aparentemente realista, generando incertidumbre en el lector sobre si existe o no una explicación racional. El <b>"Boom latinoamericano"</b> (1960-1970) fue el momento en que varios autores del continente alcanzaron proyección internacional gracias a propuestas narrativas innovadoras. Muchos de estos cuentos, además, retratan con fuerza las tradiciones, creencias populares e identidad de comunidades y pueblos latinoamericanos.';
  const item = pick(CUENTO_LATAM_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ARGUMENTATIVO_M2_BANK = [
  { texto:'"Mi vecino dice que deberíamos reciclar más, pero él ni siquiera separa su propia basura, así que su opinión no vale nada."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Ataque a la persona (ad hominem): se descalifica al emisor en vez de responder a su idea', opts:['Generalización apresurada','Falsa dicotomía','Apelación a la autoridad'] },
  { texto:'"O apoyas totalmente este proyecto, o eres alguien a quien no le importa el futuro de la ciudad."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Falsa dicotomía: se presentan solo dos opciones extremas, ignorando posiciones intermedias', opts:['Ataque a la persona','Generalización apresurada','Causa falsa'] },
  { texto:'"Probé ese restaurante una vez y la comida estaba fría, así que todos los restaurantes de esa cadena deben ser malos."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Generalización apresurada: se concluye algo general a partir de un solo caso', opts:['Ataque a la persona','Falsa dicotomía','Apelación a la autoridad'] },
  { texto:'"Este producto debe ser bueno porque lo recomienda un actor famoso, aunque no tenga ninguna relación con el tema."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Apelación a la autoridad indebida: se usa la fama de alguien sin relación real con el tema como prueba', opts:['Ataque a la persona','Falsa dicotomía','Generalización apresurada'] },
  { texto:'"Desde que se instaló el nuevo semáforo, han chocado más autos en la esquina, así que el semáforo debe ser la causa de los choques."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Causa falsa: se asume una relación causa-efecto solo porque dos hechos ocurrieron al mismo tiempo', opts:['Ataque a la persona','Falsa dicotomía','Apelación a la autoridad'] },
  { texto:'"Si no estás de acuerdo con este plan, entonces claramente quieres que el proyecto fracase por completo."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Falsa dicotomía: se presentan solo dos opciones extremas, ignorando posiciones intermedias', opts:['Generalización apresurada','Causa falsa','Apelación a la autoridad'] },
  { texto:'"Mi profesor de historia nunca ha hecho ejercicio en su vida, así que no tiene ningún derecho a hablar sobre hábitos saludables."', pregunta:'¿Qué falla lógica (falacia) se comete en este argumento?', correcta:'Ataque a la persona (ad hominem): se descalifica al emisor en vez de responder a su idea', opts:['Generalización apresurada','Falsa dicotomía','Causa falsa'] },
];
const MEDIOS_M2_BANK = [
  { texto:'Un reportaje sobre un nuevo parque usa tomas aéreas amplias, música alegre y testimonios de familias sonrientes para transmitir una sensación de bienestar.', pregunta:'¿Qué estrategia persuasiva está usando este reportaje?', correcta:'Usar recursos audiovisuales y emocionales para generar una impresión positiva en la audiencia', opts:['Presentar únicamente datos estadísticos verificables sin ningún comentario','Citar exclusivamente fuentes académicas independientes','No usar ningún recurso audiovisual ni testimonial'] },
  { texto:'Una noticia sobre un mismo hecho se titula de forma muy distinta en dos medios: uno dice "Protesta pacífica exige mejoras" y otro dice "Disturbios generan caos en el centro".', pregunta:'¿Qué muestra esta comparación sobre los medios de comunicación?', correcta:'Que el mismo hecho puede presentarse con distintos enfoques según el propósito o postura del medio', opts:['Que uno de los dos medios necesariamente miente','Que las noticias siempre son objetivas por definición','Que los titulares nunca influyen en cómo se interpreta un hecho'] },
  { texto:'Un aviso publicitario muestra solo a personas muy felices usando un producto, sin mencionar ninguna limitación o efecto secundario posible.', pregunta:'¿Qué estrategia persuasiva se observa en este aviso?', correcta:'Mostrar solo los aspectos positivos, omitiendo información que podría generar dudas', opts:['Presentar toda la información de forma equilibrada','Citar estudios científicos independientes sobre el producto','Comparar objetivamente el producto con la competencia'] },
  { texto:'Un canal de noticias repite constantemente una misma imagen impactante durante todo el día para hablar de un incidente menor.', pregunta:'¿Qué efecto busca esta repetición constante de la misma imagen?', correcta:'Aumentar la sensación de gravedad o urgencia del hecho en la audiencia', opts:['Disminuir por completo el interés del público','Demostrar que el hecho no tiene ninguna importancia','Informar de manera neutral, sin generar ningún efecto'] },
];
export function genArgumentativoMediosM2Round(){
  const recurso = 'Un <b>texto argumentativo</b> defiende una tesis usando argumentos y evidencias, pero a veces incurre en <b>falacias</b> (fallas del razonamiento) que debilitan el argumento aunque suenen convincentes: el <b>ataque a la persona</b> (ad hominem) descalifica al emisor en vez de responder a su idea; la <b>falsa dicotomía</b> presenta solo dos opciones extremas cuando en realidad existen más posibilidades; y la <b>generalización apresurada</b> concluye algo general a partir de muy pocos casos. Al analizar <b>medios de comunicación</b>, es importante notar que un mismo hecho puede presentarse con enfoques distintos según el propósito del medio, usando recursos lingüísticos, visuales y sonoros (música, imágenes, testimonios) para generar un efecto emocional específico en la audiencia — reconocer estas estrategias ayuda a formar una opinión propia informada, en vez de dejarse llevar solo por el efecto persuasivo.';
  if(Math.random()<0.6){
    const item = pick(ARGUMENTATIVO_M2_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(MEDIOS_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ORTOGRAFIA_M2_BANK = [
  { incorrecta:'Quería ir a la fiesta pero, no tenía permiso.', correcta:'Quería ir a la fiesta, pero no tenía permiso.', regla:'La coma va ANTES de conectores adversativos como "pero", "sin embargo" o "aunque", no después.' },
  { incorrecta:'Estudió mucho, sin embargo no aprobó el examen.', correcta:'Estudió mucho; sin embargo, no aprobó el examen.', regla:'Antes de "sin embargo" (cuando une dos oraciones completas) se usa punto y coma, y después de "sin embargo" va una coma.' },
  { incorrecta:'Necesitamos tres cosas, harina, huevos y leche.', correcta:'Necesitamos tres cosas: harina, huevos y leche.', regla:'Los dos puntos (no la coma) se usan para presentar una enumeración anunciada antes.' },
  { incorrecta:'El profesor dijo, "mañana habrá una prueba sorpresa".', correcta:'El profesor dijo: "Mañana habrá una prueba sorpresa".', regla:'Los dos puntos (no la coma) se usan para introducir una cita textual.' },
  { incorrecta:'Llovió toda la noche por eso las calles amanecieron inundadas.', correcta:'Llovió toda la noche; por eso, las calles amanecieron inundadas.', regla:'El punto y coma puede separar dos oraciones relacionadas cuando la segunda empieza con un conector como "por eso" o "en consecuencia".' },
  { incorrecta:'Trajo lápices, cuadernos gomas y reglas para la clase de arte.', correcta:'Trajo lápices, cuadernos, gomas y reglas para la clase de arte.', regla:'En una enumeración, cada elemento debe separarse con coma, incluyendo antes del último elemento (salvo que ya lleve una conjunción como "y").' },
  { incorrecta:'Aunque llovía mucho decidimos salir igual a caminar.', correcta:'Aunque llovía mucho, decidimos salir igual a caminar.', regla:'Cuando una oración subordinada (que empieza con "aunque") va al inicio, se separa con una coma de la oración principal.' },
  { incorrecta:'Los invitados eran, Camila Tomás y Sofía.', correcta:'Los invitados eran: Camila, Tomás y Sofía.', regla:'Los dos puntos (no la coma) introducen la enumeración anunciada, y luego cada nombre se separa con coma.' },
  { incorrecta:'María, mi vecina de toda la vida se cambió de casa este mes.', correcta:'María, mi vecina de toda la vida, se cambió de casa este mes.', regla:'Una aclaración o aposición (como "mi vecina de toda la vida") va encerrada entre comas por ambos lados.' },
];
export function genOrtografiaM2Round(){
  const recurso = 'Algunas reglas de puntuación avanzada son claves para escribir con claridad: la <b>coma antes de conectores adversativos</b> ("pero", "aunque", "sin embargo") separa la idea que se contrasta ("quería ir, pero no pude"). Los <b>dos puntos</b> se usan para presentar una enumeración ya anunciada ("necesito tres cosas: harina, huevos y leche") o para introducir una cita textual (después de un verbo como "dijo"). El <b>punto y coma</b> se usa para separar dos oraciones relacionadas entre sí, especialmente cuando la segunda empieza con un conector como "sin embargo" o "por eso" — es una pausa intermedia, más fuerte que la coma pero más débil que el punto seguido.';
  const item = pick(ORTOGRAFIA_M2_BANK);
  const opts = shuffle([{label:item.correcta, value:'correcta'},{label:item.incorrecta, value:'incorrecta'}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál oración está bien puntuada?</p>',
    options: opts, correctValue: 'correcta', speakText: '¿Cuál oración está bien puntuada?', cols:2, panel:true,
    explain: item.regla,
    recurso: recurso,
  };
}

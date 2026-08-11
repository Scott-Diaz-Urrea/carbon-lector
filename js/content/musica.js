import { pick, shuffle } from '../utils.js';
import { maracasSVG, djembeSVG, baldeSVG } from '../svg.js';

export const MUSICA_MODULES = [
  {id:'sonidos', label:'Sonidos', open:true, key:'sonidos'},
  {id:'instrumentos', label:'Instrumentos', open:true, key:'instrumentos'},
  {id:'examenmusica1', label:'Examen Final', open:true, key:'examenmusica1'},
];
/* 3° nodo agregado (2026-08-09, "Examen Final") — las 2 posiciones
   existentes se recalcularon para el nuevo height:420 (antes 280)
   preservando su posición en píxeles, y el 3° nodo continúa el mismo
   espaciado del zigzag original. */
export const MUSICA_POS = [{x:24,y:80},{x:70,y:50},{x:24,y:20}];

/* ---------------- Contenido Música 1° Básico ----------------
   OA01 -> Sonidos (cualidades del sonido) · OA04 -> Instrumentos.
   OA02,03,05,06,07 (expresión personal, repertorio específico, improvisación,
   presentación en vivo) quedaron fuera por depender de audio real / desempeño,
   no de una pregunta de opción múltiple. */
/* Ampliado de 10 a 12 ítems (antes coincidía exactamente con rounds:10,
   sin margen — ver mcEngine.js). */
const SONIDO_ITEMS = [
  { emoji:'🐭', label:'El sonido de un ratoncito chiquito', cualidad:'Agudo', par:['Agudo','Grave'] },
  { emoji:'🦁', label:'El rugido de un león', cualidad:'Grave', par:['Agudo','Grave'] },
  { emoji:'🐘', label:'El sonido de un elefante', cualidad:'Grave', par:['Agudo','Grave'] },
  { emoji:'🐦', label:'El canto de un pajarito', cualidad:'Agudo', par:['Agudo','Grave'] },
  { emoji:'📢', label:'Un grito bien fuerte', cualidad:'Fuerte', par:['Fuerte','Suave'] },
  { emoji:'🤫', label:'Un susurro suavecito', cualidad:'Suave', par:['Fuerte','Suave'] },
  { emoji:'🚂', label:'El pitido de un tren', cualidad:'Fuerte', par:['Fuerte','Suave'] },
  { emoji:'🍃', label:'El viento suave entre las hojas', cualidad:'Suave', par:['Fuerte','Suave'] },
  { emoji:'🎵', label:'Una nota musical que dura muchos segundos', cualidad:'Largo', par:['Largo','Corto'] },
  { emoji:'👏', label:'Un aplauso rápido y breve', cualidad:'Corto', par:['Largo','Corto'] },
  { emoji:'🦗', label:'El canto de un grillo en la noche', cualidad:'Agudo', par:['Agudo','Grave'] },
  { emoji:'🥁', label:'El golpe seco de un tambor grande', cualidad:'Grave', par:['Agudo','Grave'] },
];
/* 🪇 (maracas), 🪘 (djembé) y 🪣 (balde) son adiciones Unicode 2020-2021 que
   no se renderizan en varios navegadores/sistemas (mismo problema ya
   documentado para 🪥🪮🪨🪞🫘🪖 en otros archivos) — se reemplazan por
   maracasSVG()/djembeSVG()/baldeSVG() (ver svg.js). */
const INSTRUMENTOS_ITEMS = [
  { emoji:'🥁', label:'Tambor', tipo:'Convencional' },
  { emoji: maracasSVG(30), label:'Maracas', tipo:'Convencional' },
  { emoji: djembeSVG(30), label:'Djembé (tambor africano)', tipo:'Convencional' },
  { emoji:'🎻', label:'Violín', tipo:'Convencional' },
  { emoji:'🎺', label:'Trompeta', tipo:'Convencional' },
  { emoji:'🎸', label:'Guitarra', tipo:'Convencional' },
  { emoji:'🥫', label:'Una lata vacía', tipo:'No convencional' },
  { emoji: baldeSVG(30), label:'Un balde', tipo:'No convencional' },
  { emoji:'🥄', label:'Dos cucharas', tipo:'No convencional' },
  { emoji:'📦', label:'Una caja de cartón', tipo:'No convencional' },
];

/* ---------------- Contenido Música 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/musica/2-basico): MU02 OA01 -> Timbre y Pulso — cubre las
   cualidades del sonido que 1° básico no cubrió (timbre: qué fuente produce
   el sonido) y elementos del lenguaje musical (pulso, acento). Altura,
   intensidad y duración ya las cubre "Sonidos" de 1° básico, así que no se
   repiten aquí. Quedan fuera OA02-07 (expresar sensaciones, escuchar
   repertorio específico, cantar/tocar, improvisar, presentar, reflexionar
   sobre experiencias propias) por ser subjetivos o requerir desempeño/audio
   real, no aptos para el motor de opción múltiple. */
export const MUSICA_MODULES_G2 = [
  {id:'timbrepulso2', label:'Timbre y Pulso', open:true, key:'timbrepulso2'},
  {id:'examenmusica2', label:'Examen Final', open:true, key:'examenmusica2'},
];
export const MUSICA_POS_G2 = [{x:30,y:70},{x:70,y:30}];

const TIMBRE_BANK = [
  { emoji:'🥁', instrumento:'Tambor', desc:'Un sonido seco y golpeado, como un golpe fuerte.' },
  { emoji:'🎻', instrumento:'Violín', desc:'Un sonido que se desliza y vibra, como un canto largo.' },
  { emoji:'🔔', instrumento:'Campana', desc:'Un sonido metálico que resuena y se queda vibrando.' },
  { emoji:'🎹', instrumento:'Piano', desc:'Un sonido claro que se apaga rápido después de tocar la tecla.' },
  { emoji:'🎺', instrumento:'Trompeta', desc:'Un sonido brillante y potente, como una fanfarria.' },
];
const PULSO_BANK = [
  { pregunta:'¿Qué es el “pulso” en la música?', correcta:'El latido constante, como el tic-tac de un reloj', opts:['Una nota muy aguda','El nombre de un instrumento','El final de una canción'] },
  { pregunta:'¿Qué es un “acento” en la música?', correcta:'Un golpe o nota que suena más fuerte que las demás', opts:['Una nota muy suave','El silencio entre notas','El nombre de una canción'] },
];

/* Niveles (2026-08-11): rama de timbre reduce distractores/oculta el
   emoji (item.desc ya describe el sonido en texto); rama de pulso (banco
   chico, ya textual) solo reduce opciones en fácil. */
export function genTimbrePulso2Round(nivel){
  const recurso = 'El <b>timbre</b> es lo que hace que reconozcas qué instrumento está sonando aunque toque exactamente la misma nota que otro instrumento — es como la "huella digital" del sonido de cada instrumento (un violín y una guitarra pueden tocar la misma nota, pero suenan claramente distintos). El <b>pulso</b>, en cambio, es el "latido" constante y regular que se repite en una canción, como el tic-tac de un reloj, y sirve de base para que todos los músicos toquen a la misma velocidad. Aprender a distinguir el timbre de distintos instrumentos y a sentir el pulso de una canción son dos habilidades básicas para entender música de cualquier tipo.';
  if(Math.random()<0.5){
    const item = pick(TIMBRE_BANK);
    let distract = shuffle(TIMBRE_BANK.filter(function(t){ return t.instrumento!==item.instrumento; }));
    distract = distract.slice(0, nivel==='facil' ? 1 : 3).map(function(t){ return t.instrumento; });
    const opts = shuffle([item.instrumento].concat(distract)).map(function(i){ return {label:i, value:i}; });
    const visual = nivel==='dificil' ? '' : '<span class="prompt-emoji">'+item.emoji+'</span>';
    return {
      promptHTML: visual+'<p class="prompt-hint">'+item.desc+' ¿Qué instrumento tiene este timbre?</p>',
      options: opts, correctValue: item.instrumento, speakText: item.desc, cols:4, kind:'word',
      explain: 'Ese timbre corresponde al <b>'+item.instrumento.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(PULSO_BANK);
  let opts2 = item.opts;
  if(nivel==='facil'){ opts2 = shuffle(opts2).slice(0,1); }
  const opts = shuffle([item.correcta].concat(opts2)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
    recurso: recurso,
  };
}

/* "Examen Final" 2° básico Música: solo hay 1 módulo compatible, así que
   el examen re-randomiza el nivel sobre el mismo generador (mismo patrón
   que Artes Visuales/Tecnología). */
export function genExamenMusica2Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genTimbrePulso2Round(nivel);
}

/* Niveles de dificultad (2026-08-09, mismo motor que el resto de 1°
   básico). `nivel` opcional; sin argumento, comportamiento original. Los
   2 generadores ya son binarios (2 opciones, sin margen para reducir en
   fácil) y `item.label` ya es la descripción completa del sonido/
   instrumento — el emoji es decorativo, se saca en difícil sin dejar la
   pregunta sin sujeto. */
export function genSonidosRound(nivel){
  const recurso = 'Todo sonido tiene "cualidades" que lo describen, igual que un objeto tiene color y tamaño: puede ser <b>fuerte o suave</b> (cuánta energía tiene), <b>agudo o grave</b> (qué tan alto o bajo suena, como la diferencia entre un silbato y un tambor grande), y <b>largo o corto</b> (cuánto dura). Aprender a describir un sonido con estas palabras es el primer paso para entender música: antes de tocar un instrumento o cantar una canción, hay que aprender a "escuchar con atención" y notar estas diferencias, algo que usarás constantemente en toda tu educación musical.';
  const showEmoji = nivel !== 'dificil';
  const item = pick(SONIDO_ITEMS);
  const opts = shuffle(item.par.map(function(c){ return {label:c, value:c}; }));
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+'. ¿Cómo es este sonido?</p>',
    options: opts, correctValue: item.cualidad, speakText: item.label, cols:2, panel:true,
    explain: item.label+', por eso es un sonido <b>'+item.cualidad.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genInstrumentosRound(nivel){
  const recurso = 'Un instrumento musical <b>convencional</b> es uno fabricado especialmente para hacer música (como una guitarra, un tambor o un piano), diseñado con materiales y formas pensadas para producir sonidos afinados y controlables. Un instrumento <b>no convencional</b>, en cambio, es cualquier objeto cotidiano que no fue creado para hacer música pero que puedes usar para producir sonido y ritmo — como golpear una olla, agitar unas llaves, o sacudir una botella con arroz adentro. Esta idea es importante porque te muestra que la música puede crearse con lo que tengas a mano, no solo con instrumentos "de verdad" comprados en una tienda.';
  const showEmoji = nivel !== 'dificil';
  const item = pick(INSTRUMENTOS_ITEMS);
  const opts = shuffle([{label:'Convencional', value:'Convencional'},{label:'No convencional', value:'No convencional'}]);
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+'. ¿Es un instrumento musical convencional o no convencional?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:2, panel:true,
    explain: item.label+' es un instrumento <b>'+item.tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

/* "Examen Final" (mismo patrón que el resto de 1° básico): mezcla los 2
   módulos de Música 1° básico + los 3 niveles al azar. */
export function genExamenMusica1Round(){
  const gens = [genSonidosRound, genInstrumentosRound];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* ---------------- Contenido Música 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/musica/3-basico):
   Lenguaje Musical -> OA01 (pulso, acento y forma musical A-AB-ABA — los
   elementos del lenguaje musical que sí se pueden representar y reconocer
   sin depender de audio real). Música en la Sociedad -> OA07 (identificar
   en qué situación cotidiana o celebración se usa cierta música).
   Quedan fuera: OA02 (expresar sensaciones/emociones personales — subjetivo),
   OA03 (escuchar repertorio extenso de distintas culturas — depende de
   audio real, no de una descripción textual), OA04-06 (cantar, tocar,
   improvisar, presentar — desempeño real) y OA08 (reflexionar sobre las
   propias fortalezas — autoevaluación). */
export const MUSICA_MODULES_G3 = [
  {id:'lenguajemusical3', label:'Lenguaje Musical', open:true, key:'lenguajemusical3'},
  {id:'musicasociedad3', label:'Música en la Sociedad', open:true, key:'musicasociedad3'},
  {id:'examenmusica3', label:'Examen Final', open:true, key:'examenmusica3'},
];
export const MUSICA_POS_G3 = [{x:24,y:85},{x:70,y:50},{x:24,y:15}];

const FORMA_MUSICAL_BANK = [
  { patron:['A','A','A'], forma:'A-A-A (se repite la misma sección)' },
  { patron:['A','B','A'], forma:'A-B-A (vuelve a la sección inicial)' },
  { patron:['A','A','B'], forma:'A-A-B (dos veces lo mismo y luego algo nuevo)' },
  { patron:['A','B','B'], forma:'A-B-B (algo nuevo que se repite)' },
  { patron:['A','B','C'], forma:'A-B-C (tres secciones distintas)' },
  { patron:['A','B','A','B'], forma:'A-B-A-B (dos secciones que se alternan)' },
];
const PULSO_ACENTO_BANK = [
  { pregunta:'¿Cómo se llama el “latido” constante y regular que se repite en una canción, como el tic-tac de un reloj?', correcta:'El pulso', opts:['El acento','La melodía','El silencio'] },
  { pregunta:'¿Cómo se llama cuando un golpe o nota suena más fuerte que las demás dentro del pulso?', correcta:'El acento', opts:['El pulso','La pausa','El tono'] },
];
const MUSICA_SOCIEDAD_BANK = [
  { situacion:'Una fiesta de cumpleaños, justo cuando traen la torta con velitas', correcta:'"Feliz cumpleaños" (cumpleaños feliz)', opts:['Un himno nacional','Una canción de cuna','Una marcha fúnebre'] },
  { situacion:'Un bebé que no se puede dormir en la noche', correcta:'Una canción de cuna', opts:['Una canción de cumpleaños','Una marcha militar','Un himno nacional'] },
  { situacion:'Una ceremonia oficial del país, como un acto cívico en la escuela', correcta:'El himno nacional', opts:['Una canción de cuna','Una canción de cumpleaños','Un jingle publicitario'] },
  { situacion:'Un anuncio de televisión que quiere que recuerdes un producto', correcta:'Un jingle publicitario', opts:['Un himno nacional','Una canción de cuna','Una marcha fúnebre'] },
  { situacion:'Una fiesta patria como el 18 de septiembre en Chile', correcta:'Cueca (música folclórica chilena)', opts:['Una canción de cuna','Un jingle publicitario','Una ópera'] },
  { situacion:'Un partido de fútbol, cuando el equipo sale a la cancha', correcta:'Un himno o cántico del equipo', opts:['Una canción de cuna','Un vals clásico','Una marcha fúnebre'] },
  { situacion:'Una boda, justo cuando la novia entra caminando', correcta:'La marcha nupcial', opts:['Un jingle publicitario','Una canción de cuna','El himno nacional'] },
  { situacion:'Una ceremonia solemne y triste de despedida', correcta:'Una marcha fúnebre', opts:['Una canción de cumpleaños','Un jingle publicitario','La cueca'] },
];

/* Niveles (2026-08-11): ambos generadores son 100% textuales (código de
   letras A-B-C o descripción de situación, sin ningún emoji/imagen) —
   fácil reduce opciones; difícil se comporta igual a normal. */
export function genLenguajeMusical3Round(nivel){
  const recurso = 'La <b>forma musical</b> describe cómo se organizan las distintas secciones de una canción (llamadas A, B, C...): cuando una sección se repite igual (A-A-A), cuando vuelve a la sección inicial después de otra distinta (A-B-A), o cuando aparecen varias secciones diferentes seguidas (A-B-C) — es como el "esqueleto" de una canción, la estructura que la organiza de principio a fin. El <b>pulso</b> (el latido regular que se repite, como el tic-tac de un reloj) y el <b>acento</b> (cuando un golpe suena más fuerte que los demás dentro de ese pulso) son otros dos elementos básicos del lenguaje musical que te ayudan a sentir el ritmo de cualquier canción.';
  if(Math.random()<0.5){
    const item = pick(FORMA_MUSICAL_BANK);
    let distract = shuffle(FORMA_MUSICAL_BANK.filter(function(f){ return f.forma!==item.forma; }));
    distract = distract.slice(0, nivel==='facil' ? 1 : 3).map(function(f){ return f.forma; });
    const opts = shuffle([item.forma].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+item.patron.join(' - ')+'</p><p class="prompt-hint">¿Qué forma musical tiene esta secuencia de secciones?</p>',
      options: opts, correctValue: item.forma, speakText: '¿Qué forma musical es '+item.patron.join('-')+'?', cols:2, panel:true,
      explain: 'La secuencia '+item.patron.join('-')+' corresponde a la forma <b>'+item.forma.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(PULSO_ACENTO_BANK);
  let opts2 = item.opts;
  if(nivel==='facil'){ opts2 = shuffle(opts2).slice(0,1); }
  const opts = shuffle([item.correcta].concat(opts2)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genMusicaSociedad3Round(nivel){
  const item = pick(MUSICA_SOCIEDAD_BANK);
  let opts2 = item.opts;
  if(nivel==='facil'){ opts2 = shuffle(opts2).slice(0,1); }
  const opts = shuffle([item.correcta].concat(opts2)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.situacion+'. ¿Qué tipo de música es más probable escuchar ahí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion+'. ¿Qué música es más probable escuchar ahí?', cols:2, kind:'word',
    explain: 'En esa situación, lo más común es escuchar <b>'+item.correcta.toLowerCase()+'</b>.',
    recurso: 'La música siempre está conectada con una situación o un momento social específico: hay canciones para celebrar (cumpleaños), para calmar a un bebé (canciones de cuna), para ceremonias oficiales (himnos), para vender productos (jingles publicitarios), y música folclórica típica de fiestas patrias (como la cueca en Chile). Reconocer qué tipo de música corresponde a cada situación te ayuda a entender que la música no es solo entretenimiento — cumple funciones sociales específicas y refleja la cultura de cada país o comunidad.',
  };
}

/* "Examen Final" 3° básico Música: mezcla los 2 módulos del año + los 3
   niveles al azar. */
export function genExamenMusica3Round(){
  const gens = [genLenguajeMusical3Round, genMusicaSociedad3Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* ---------------- Contenido Música 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/musica/4-basico): MU04 OA01 menciona explícitamente
   "dinámica" y "tempo" dentro de los elementos del lenguaje musical, un
   ángulo que "Lenguaje Musical" de 3° básico no cubrió (esa cubrió pulso,
   acento y forma A-AB-ABA). OA07 (música en situaciones cotidianas) ya se
   cubrió en 3° básico con contenido casi idéntico, así que no se repite
   aquí para no duplicar. Quedan fuera OA02-06,08 (expresión subjetiva,
   escuchar repertorio extenso, cantar/tocar/improvisar/presentar,
   autoevaluación) por las mismas razones que en años anteriores. */
export const MUSICA_MODULES_G4 = [
  {id:'dinamicatempo4', label:'Dinámica y Tempo', open:true, key:'dinamicatempo4'},
];
export const MUSICA_POS_G4 = [{x:50,y:50}];

const DINAMICA_BANK = [
  { desc:'Un volumen muy suave, casi un susurro musical', termino:'Piano (suave)' },
  { desc:'Un volumen muy fuerte y potente', termino:'Forte (fuerte)' },
  { desc:'Un volumen que va aumentando poco a poco, de suave a fuerte', termino:'Crescendo' },
  { desc:'Un volumen que va disminuyendo poco a poco, de fuerte a suave', termino:'Decrescendo' },
];
const TEMPO_BANK = [
  { desc:'Una canción que se toca muy rápido', termino:'Allegro (rápido)' },
  { desc:'Una canción que se toca muy lenta y calmada', termino:'Largo (muy lento)' },
  { desc:'Una canción que se toca a velocidad moderada, ni rápida ni lenta', termino:'Moderato' },
  { desc:'Una canción que se toca a un paso tranquilo, como una caminata', termino:'Andante' },
];

export function genDinamicaTempo4Round(){
  const bank = Math.random()<0.5 ? DINAMICA_BANK : TEMPO_BANK;
  const item = pick(bank);
  const distract = shuffle(bank.filter(function(b){ return b.termino!==item.termino; })).map(function(b){ return b.termino; });
  const opts = shuffle([item.termino].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué término musical describe esto?</p>',
    options: opts, correctValue: item.termino, speakText: item.desc, cols:2, kind:'word',
    explain: 'Ese término musical es <b>'+item.termino+'</b>.',
    recurso: 'La <b>dinámica</b> en música se refiere a qué tan fuerte o suave suena algo: "piano" significa suave, "forte" significa fuerte, y "crescendo"/"decrescendo" describen un volumen que va aumentando o disminuyendo gradualmente durante la canción. El <b>tempo</b>, en cambio, se refiere a la velocidad: "allegro" es rápido, "largo" es muy lento, "moderato" es una velocidad intermedia y "andante" es un paso tranquilo, como caminar. Estos términos vienen del italiano porque los primeros compositores que los estandarizaron, hace varios siglos, eran principalmente italianos — hoy músicos de todo el mundo usan las mismas palabras para indicar cómo debe sonar una pieza, sin importar en qué idioma se compuso.',
  };
}

/* ---------------- Contenido Música 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/musica/5-basico): MU05 OA01 nombra explícitamente "texturas"
   y "preguntas-respuestas" como elementos del lenguaje musical, dos ángulos
   que ningún año anterior había cubierto (3° básico cubrió pulso/acento/
   forma A-AB-ABA, 4° básico cubrió dinámica/tempo). Quedan fuera: OA02
   (expresar sensaciones personales — subjetivo), OA03 (escuchar repertorio
   extenso de distintas culturas — depende de audio real), OA04-06
   (cantar/tocar/improvisar/presentar — desempeño real) y OA07-08 (explicar
   la relación entre obras y su contexto histórico, y autoevaluación —
   requiere datos verificables sobre obras específicas o es subjetivo). */
export const MUSICA_MODULES_G5 = [
  {id:'texturamusical5', label:'Texturas y Estructura Musical', open:true, key:'texturamusical5'},
];
export const MUSICA_POS_G5 = [{x:50,y:50}];

const TEXTURA_MUSICAL_BANK = [
  { desc:'Una persona cantando sola, sin ningún acompañamiento musical', tipo:'Monofonía' },
  { desc:'Todo el curso cantando el mismo himno al unísono, sin ninguna otra voz sonando', tipo:'Monofonía' },
  { desc:'Un solista cantando la melodía principal mientras la guitarra toca acordes de acompañamiento', tipo:'Homofonía' },
  { desc:'Una banda donde el cantante lleva la melodía y los demás instrumentos tocan acordes de fondo', tipo:'Homofonía' },
  { desc:'Un coro donde cada grupo de voces va entrando con la misma melodía en momentos distintos, sobreponiéndose entre sí, como en un canon', tipo:'Polifonía' },
  { desc:'Varios instrumentos tocando cada uno su propia melodía independiente, entrelazadas entre sí', tipo:'Polifonía' },
];
const PREGUNTA_RESPUESTA_BANK = [
  { desc:'Una frase musical que suena como una "pregunta", seguida de otra frase que la "responde", como una conversación musical', correcta:'Estructura de pregunta-respuesta' },
  { desc:'Un instrumento toca una frase corta y luego otro instrumento le contesta con una frase parecida, como si conversaran', correcta:'Estructura de pregunta-respuesta' },
];
export function genTexturaMusical5Round(){
  const recurso = 'La <b>textura musical</b> describe cómo se combinan las voces o instrumentos que suenan al mismo tiempo: en la <b>monofonía</b> suena una sola melodía sin acompañamiento (como cantar solo), en la <b>homofonía</b> una melodía principal suena acompañada por otras voces que la apoyan, y en la <b>polifonía</b> suenan dos o más melodías independientes al mismo tiempo (como un canon). Otra forma de organizar la música es la estructura de <b>pregunta-respuesta</b>: una frase musical "pregunta" y otra frase la "responde", como una conversación entre instrumentos o voces.';
  if(Math.random()<0.6){
    const item = pick(TEXTURA_MUSICAL_BANK);
    const todos = ['Monofonía','Homofonía','Polifonía'];
    const distract = todos.filter(function(t){ return t!==item.tipo; });
    const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué textura musical describe esta situación?</p>',
      options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, kind:'word',
      explain: 'Esta situación es un ejemplo de <b>'+item.tipo+'</b>.', recurso: recurso,
    };
  }
  const item = pick(PREGUNTA_RESPUESTA_BANK);
  const opts = shuffle([{label:item.correcta, value:item.correcta},{label:'Forma A-B-A', value:'Forma A-B-A'},{label:'Crescendo', value:'Crescendo'},{label:'Monofonía', value:'Monofonía'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Cómo se llama esta estructura musical?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esta estructura se llama <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Música 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/musica/6-basico): MU06 OA01 repite textualmente la misma lista de
   elementos del lenguaje musical que MU05 OA01 (reiteraciones, contrastes,
   pulsos, acentos, patrones rítmicos y melódicos, diseños melódicos,
   variaciones, dinámica, tempo, secciones A-AB-ABA, preguntas-respuestas,
   texturas). De esa lista, "reiteración/contraste" (a nivel de frase musical),
   "diseño melódico" (la forma que dibuja una melodía: ascendente, descendente,
   ondulante) y "variación" (una repetición modificada de una idea musical) son
   los únicos términos que ningún año anterior había ejercitado (3° cubrió
   pulso/acento/forma, 4° dinámica/tempo, 5° texturas/preguntas-respuestas).
   Melodía: Diseños y Variaciones -> OA01 (ese ángulo nuevo).
   Quedan fuera: OA02 (sensaciones personales — subjetivo), OA03 (escuchar
   repertorio — depende de audio real), OA04-06 (cantar/tocar/improvisar/
   presentar — desempeño), OA07-08 (relación obra-contexto histórico
   específico, autoevaluación). */
export const MUSICA_MODULES_G6 = [
  {id:'melodiavariaciones6', label:'Melodía: Diseños y Variaciones', open:true, key:'melodiavariaciones6'},
];
export const MUSICA_POS_G6 = [{x:50,y:50}];

const REITERACION_CONTRASTE_BANK = [
  { desc:'Una canción repite exactamente la misma frase musical dos veces seguidas', tipo:'Reiteración' },
  { desc:'Una canción toca una frase suave y calmada, y luego una frase completamente distinta, fuerte y agitada', tipo:'Contraste' },
  { desc:'Un coro canta la misma melodía una y otra vez a lo largo de toda la canción, sin cambiar nada', tipo:'Reiteración' },
  { desc:'Una pieza musical pasa de una sección lenta y triste a una sección rápida y alegre, muy diferente a la anterior', tipo:'Contraste' },
];
const DISENO_MELODICO_BANK = [
  { desc:'Una melodía que va subiendo de tono, nota por nota, de más grave a más aguda', diseno:'Ascendente' },
  { desc:'Una melodía que va bajando de tono, nota por nota, de más aguda a más grave', diseno:'Descendente' },
  { desc:'Una melodía que sube y baja de tono varias veces, como las olas del mar', diseno:'Ondulante' },
];
const VARIACION_BANK = [
  { desc:'Una canción presenta su melodía principal, y luego la repite pero un poco más rápido y con un instrumento distinto', pregunta:'¿Cómo se llama a repetir una idea musical con algunos cambios, en vez de repetirla exactamente igual?', correcta:'Variación', opts:['Silencio','Pausa','Acorde'] },
  { desc:'Un compositor toma un tema musical simple y lo repite varias veces, cada vez con un ritmo o una dinámica distinta', pregunta:'¿Cómo se llama a esta técnica de repetir un tema con cambios?', correcta:'Variación', opts:['Silencio','Pausa','Acorde'] },
];
export function genMelodiaVariaciones6Round(){
  const recurso = 'Una melodía se construye repitiendo o cambiando frases musicales: la <b>reiteración</b> repite exactamente la misma frase, mientras que el <b>contraste</b> presenta una frase muy distinta (por ejemplo, pasar de algo suave a algo fuerte). El <b>diseño melódico</b> describe la forma que dibuja una melodía al moverse: ascendente (sube), descendente (baja) u ondulante (sube y baja, como olas). Y la <b>variación</b> es repetir una idea musical pero con algunos cambios —más rápido, con otro instrumento— en vez de tocarla exactamente igual cada vez.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(REITERACION_CONTRASTE_BANK);
    const opts = shuffle([{label:'Reiteración', value:'Reiteración'},{label:'Contraste', value:'Contraste'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Esto es una reiteración o un contraste?</p>',
      options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, panel:true,
      explain: 'Esto es una <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(DISENO_MELODICO_BANK);
    const todos = ['Ascendente','Descendente','Ondulante'];
    const distract = todos.filter(function(d){ return d!==item.diseno; });
    const opts = shuffle([item.diseno].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué diseño melódico describe esto?</p>',
      options: opts, correctValue: item.diseno, speakText: item.desc, cols:2, kind:'word',
      explain: 'Este es un diseño melódico <b>'+item.diseno.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(VARIACION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, kind:'word',
    explain: 'Esto se llama <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Música 7° Básico ----------------
   Basado en Decreto 614/2013. OA02 -> Procedimientos Compositivos, un
   ángulo nuevo que ningún año anterior había ejercitado: ostinato (un
   patrón musical corto que se repite sin cambios durante toda o gran
   parte de una pieza) y secuencia melódica (repetir una idea melódica
   corta, pero desplazada a un tono más alto o más bajo cada vez), ambos
   distintos de "variación" (6° básico, una repetición CON cambios de
   ritmo/dinámica) y de "reiteración" (6° básico, repetir la MISMA frase
   sin ningún desplazamiento de tono). Quedan fuera OA01,03-08 (crear
   música propia, escuchar repertorio real, cantar/tocar/improvisar,
   contexto histórico específico, presentación, autoevaluación). */
export const MUSICA_MODULES_G7 = [
  {id:'procedimientoscompositivos7', label:'Procedimientos Compositivos', open:true, key:'procedimientoscompositivos7'},
];
export const MUSICA_POS_G7 = [{x:50,y:50}];

const OSTINATO_BANK = [
  { desc:'Mientras la melodía principal cambia, el bajo repite exactamente el mismo patrón corto de 4 notas una y otra vez, sin variar, durante toda la canción', correcta:'Ostinato', opts:['Secuencia melódica','Variación','Silencio'] },
  { desc:'La percusión toca el mismo patrón rítmico corto, sin ningún cambio, repetido continuamente como base de toda la pieza', correcta:'Ostinato', opts:['Secuencia melódica','Contraste','Acorde'] },
  { desc:'Un pianista toca la mano izquierda con el mismo patrón de notas repetido sin cambios durante toda la canción, mientras la mano derecha toca la melodía principal', correcta:'Ostinato', opts:['Secuencia melódica','Reiteración de frase completa','Diseño melódico ondulante'] },
  { desc:'En una canción de cuna, un mismo patrón corto de guitarra se repite igual desde el principio hasta el final, sin ningún cambio', correcta:'Ostinato', opts:['Secuencia melódica','Variación','Contraste'] },
];
const SECUENCIA_MELODICA_BANK = [
  { desc:'Un compositor toca una frase corta de 3 notas, y luego repite esa misma frase pero empezando 2 notas más arriba, y después otra vez empezando aún más arriba', correcta:'Secuencia melódica', opts:['Ostinato','Silencio','Pausa'] },
  { desc:'Una melodía corta se repite varias veces seguidas, cada vez desplazada a un tono más bajo que la anterior, manteniendo la misma forma', correcta:'Secuencia melódica', opts:['Ostinato','Acorde','Dinámica'] },
  { desc:'Un violinista toca un pequeño motivo musical, y luego lo repite tres veces más, cada vez un poco más agudo que la anterior', correcta:'Secuencia melódica', opts:['Ostinato','Silencio','Acorde'] },
  { desc:'Una melodía de 4 notas se repite manteniendo la misma forma, pero cada repetición comienza más abajo que la anterior, como bajando una escalera', correcta:'Secuencia melódica', opts:['Ostinato','Variación','Contraste'] },
];
export function genProcedimientosCompositivos7Round(){
  const recurso = 'Un <b>ostinato</b> es un patrón musical corto (rítmico o melódico) que se repite exactamente igual, sin cambios, durante toda una pieza o una sección, sirviendo como base mientras otras voces varían encima. Una <b>secuencia melódica</b> es distinta: una frase corta se repite manteniendo su misma forma, pero cada repetición se desplaza más arriba o más abajo en tono, como subiendo o bajando una escalera musical. Ambos son formas en que los compositores construyen y desarrollan una pieza a partir de una idea pequeña.';
  const item = pick(Math.random()<0.5 ? OSTINATO_BANK : SECUENCIA_MELODICA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué procedimiento compositivo se usa aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, kind:'word',
    explain: 'Esto se llama <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Música 8° Básico ----------------
   Basado en Decreto 614/2013. MU08 OA02 -> Armonía y Acompañamiento:
   analizar elementos del lenguaje musical y procedimientos compositivos
   "en relación con acompañamientos armónicos" (el propio OA05 de 8° nombra
   los acompañamientos rítmicos, melódicos Y ARMÓNICOS como material del
   nivel). Ángulo genuinamente nuevo: qué es un acorde, qué hace un
   acompañamiento armónico, y la convención mayor/menor — nada de esto fue
   cubierto en 3°-7° (pulso/forma, dinámica/tempo, texturas,
   diseños melódicos, ostinato/secuencia). El carácter "alegre/luminoso" de
   las tonalidades mayores y "melancólico/oscuro" de las menores se
   presenta explícitamente como la convención expresiva de uso pedagógico
   común, no como una verdad absoluta (mismo criterio que Color Expresivo
   de 3° básico). Quedan fuera OA01 (sensaciones personales), OA03-05
   (cantar/tocar/improvisar — desempeño real con audio), OA06
   (autoevaluación) y OA07 (rol social — ya cubierto en 3° básico). */
export const MUSICA_MODULES_G8 = [
  {id:'armonia8', label:'Armonía y Acompañamiento', open:true, key:'armonia8'},
];
export const MUSICA_POS_G8 = [{x:50,y:50}];

const ARMONIA_8_BANK = [
  { pregunta:'¿Qué es un acorde?', correcta:'Tres o más notas que suenan al mismo tiempo', opts:['Una sola nota muy larga','Un silencio entre dos notas','El nombre de un instrumento'] },
  { pregunta:'¿Qué hace un acompañamiento armónico en una canción?', correcta:'Sostiene la melodía con acordes que le dan cuerpo y carácter', opts:['Reemplaza la melodía por completo','Elimina el ritmo de la canción','Solo sube el volumen'] },
  { pregunta:'Según la convención expresiva más usada en música, ¿qué carácter suele asociarse a una tonalidad MAYOR?', correcta:'Un carácter más luminoso o alegre', opts:['Siempre un carácter terrorífico','Ningún carácter: no se usa en canciones','Un sonido imposible de escuchar'] },
  { pregunta:'Según esa misma convención, ¿qué carácter suele asociarse a una tonalidad MENOR?', correcta:'Un carácter más melancólico o íntimo', opts:['Siempre un carácter festivo y ruidoso','Ninguno: las tonalidades menores no existen','Un volumen más bajo obligatorio'] },
  { pregunta:'¿Qué instrumento puede tocar acordes completos, y por eso suele acompañar al canto?', correcta:'La guitarra (o el piano)', opts:['El triángulo','La flauta dulce tocando una sola nota','El bombo'] },
  { pregunta:'En una canción típica, ¿qué relación hay entre melodía y acompañamiento?', correcta:'La melodía lleva el protagonismo y el acompañamiento la sostiene con acordes y ritmo', opts:['Siempre suenan exactamente las mismas notas','El acompañamiento debe tapar la melodía','No pueden sonar juntos'] },
  { pregunta:'¿Cómo se llama la sucesión de acordes que se repite como base de muchas canciones populares?', correcta:'Progresión armónica', opts:['Escala cromática','Silencio de negra','Clave de sol'] },
  { pregunta:'Si una misma melodía se acompaña con acordes distintos, ¿qué puede cambiar?', correcta:'El carácter o color expresivo de la canción, aunque la melodía sea la misma', opts:['Nada: el acompañamiento no influye en nada','La letra cambia automáticamente','El instrumento desaparece'] },
  { pregunta:'¿Qué músico de una banda suele encargarse de la base armónica junto a la guitarra o el piano?', correcta:'El bajista, que refuerza la nota fundamental de cada acorde', opts:['El cantante solista','Quien aplaude entre canciones','El sonidista de la sala'] },
  { pregunta:'¿Por qué se dice que la armonía es una dimensión "vertical" de la música?', correcta:'Porque mira las notas que suenan simultáneamente, como una columna de sonidos', opts:['Porque solo se toca de pie','Porque las partituras se leen de abajo hacia arriba','Porque requiere instrumentos altos'] },
];
export function genArmonia8Round(){
  const recurso = 'Un <b>acorde</b> es un grupo de tres o más notas que suenan al mismo tiempo, y forma la base de la <b>armonía</b> — la dimensión "vertical" de la música, que mira las notas simultáneas como una columna de sonidos (a diferencia de la melodía, que es la sucesión de notas en el tiempo). El <b>acompañamiento armónico</b> sostiene la melodía con esos acordes, dándole cuerpo y carácter, y suele estar a cargo de instrumentos como la guitarra o el piano (que pueden tocar varias notas a la vez), junto al bajo, que refuerza la nota fundamental de cada acorde. Existe una convención expresiva ampliamente usada en la música (no una verdad absoluta) donde la tonalidad <b>mayor</b> suele asociarse a un carácter más luminoso o alegre, y la tonalidad <b>menor</b> a uno más melancólico o íntimo.';
  const item = pick(ARMONIA_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/musica/1-medio —
   OA01-07 + OAA. Cubierto: OA01 (apreciar manifestaciones y obras
   musicales de Chile y el mundo, tradición oral/escrita/popular) y OA07
   (evaluar la relevancia de la música en la construcción y preservación de
   identidades — el ángulo de identidad cultural, distinto de "Música en la
   Sociedad" de 3° básico, que cubrió situaciones cotidianas). Fuera: OA02
   (comparar músicas según elementos del lenguaje musical — ya cubierto en
   3°-7° básico con distintos ángulos), OA03-05 (cantar/tocar/interpretar/
   improvisar — desempeño real con audio) y OA06 (autoevaluación). */
export const MUSICA_MODULES_M1 = [
  {id:'musicaidentidadm1', label:'Música e Identidad Cultural', open:true, key:'musicaidentidadm1'},
];
export const MUSICA_POS_M1 = [{x:48,y:50}];
const MUSICA_IDENTIDAD_M1_BANK = [
  { pregunta:'¿Qué representa la cueca dentro de las manifestaciones musicales de tradición popular en Chile?', correcta:'Es el baile y música reconocido como parte central de la identidad cultural chilena', opts:['Es un estilo musical originario de otro continente sin relación con Chile','No tiene ninguna relación con la cultura chilena','Es un género que ha desaparecido por completo'] },
  { pregunta:'¿Qué función cumple la música indígena, como los cantos mapuche o aimara, en sus respectivas comunidades?', correcta:'Preserva y transmite la identidad, cosmovisión y tradiciones de esos pueblos a través del tiempo', opts:['No tiene ninguna función cultural','Solo se usa para el entretenimiento turístico','Reemplaza por completo el idioma de esos pueblos'] },
  { pregunta:'¿Por qué se dice que la música es una forma de preservar la identidad de un país o pueblo?', correcta:'Porque transmite historia, valores y tradiciones de una generación a otra a través de canciones y ritmos propios', opts:['Porque la música nunca cambia con el tiempo','Porque la música no tiene relación con la cultura','Porque solo sirve para bailar sin ningún significado'] },
  { pregunta:'¿Qué tradición musical se transmite principalmente de forma oral, de generación en generación, sin partituras escritas?', correcta:'La música folclórica tradicional, transmitida por la práctica y la escucha directa', opts:['La música únicamente compuesta con computadores','Solo la música clásica europea','Ninguna música se transmite de forma oral'] },
  { pregunta:'¿Qué género musical popular latinoamericano, con raíces africanas y europeas, es reconocido internacionalmente como parte de la identidad de varios países de la región?', correcta:'La cumbia (entre otros géneros populares latinoamericanos con mezcla de raíces)', opts:['Un género que no existe en Latinoamérica','Un estilo exclusivamente asiático','Un género sin ninguna influencia cultural'] },
  { pregunta:'¿Qué rol cumplen los festivales de música tradicional, como festivales folclóricos, para una comunidad?', correcta:'Mantienen viva la música tradicional y refuerzan el sentido de identidad y pertenencia de la comunidad', opts:['No tienen ninguna relación con la identidad cultural','Buscan eliminar la música tradicional','Solo sirven para vender entradas, sin ningún otro propósito'] },
  { pregunta:'¿Por qué distintas regiones de un mismo país pueden tener música tradicional muy diferente entre sí?', correcta:'Porque cada región desarrolla su música según su propia historia, geografía y mezcla cultural', opts:['Porque está prohibido que toda una región comparta el mismo estilo','Porque la música siempre es idéntica en todo el país','Porque el clima elimina cualquier diferencia musical'] },
  { pregunta:'¿Qué instrumentos son característicos de la música andina, presente en el norte de Chile y países vecinos?', correcta:'La quena y el charango, entre otros instrumentos de raíz indígena', opts:['El violín eléctrico y el sintetizador','Instrumentos que no existen en la región andina','Solo instrumentos de percusión electrónica'] },
  { pregunta:'¿Qué ocurre culturalmente cuando una tradición musical local se mezcla con influencias de otros países o culturas?', correcta:'Puede surgir un género nuevo que refleja la identidad de ambas culturas combinadas', opts:['La tradición original desaparece por completo sin dejar ningún rastro','No puede ocurrir ninguna mezcla entre culturas distintas','El resultado siempre pierde todo significado cultural'] },
];
export function genMusicaIdentidadM1Round(){
  const recurso = 'La música, en sus distintas tradiciones —oral, escrita y popular—, cumple un rol fundamental en la <b>construcción y preservación de la identidad</b> de un pueblo o país. Manifestaciones como la cueca en Chile, los cantos de pueblos originarios como el mapuche o el aimara, o géneros populares latinoamericanos con raíces mezcladas (africanas, europeas, indígenas), transmiten historia, valores y tradiciones de una generación a otra. Muchas de estas tradiciones se mantienen vivas gracias a la <b>transmisión oral</b> (de generación en generación, sin partituras escritas) y a instancias como los festivales folclóricos, que refuerzan el sentido de identidad y pertenencia de una comunidad. Distintas regiones de un mismo país suelen desarrollar tradiciones musicales propias, según su historia, geografía y mezcla cultural particular.';
  const item = pick(MUSICA_IDENTIDAD_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/musica/2-medio — MU2M
   OA02+07. Cubiertos: OA02 (contrastar músicas por lenguaje musical,
   procedimientos compositivos, contexto y propósito expresivo) y OA07 (rol de
   los medios de registro y transmisión —partituras, grabación, radio,
   streaming— en la evolución de la música en distintos períodos históricos).
   Fuera: OA01 (ya cubierto por "Música e Identidad Cultural" de 1° medio),
   OA03-05 (desempeño con audio real: cantar/tocar/improvisar), OA06
   (autoevaluación personal). */
export const MUSICA_MODULES_M2 = [
  {id:'contrastemediosm2', label:'Contraste Musical y Medios de Registro', open:true, key:'contrastemediosm2'},
];
export const MUSICA_POS_M2 = [{x:48,y:50}];
const CONTRASTE_MUSICAL_M2_BANK = [
  { pregunta:'Al comparar dos canciones de un mismo género pero de épocas distintas, ¿qué elemento del lenguaje musical se puede contrastar?', correcta:'El tempo, la instrumentación o la textura musical usada en cada una', opts:['El nombre del intérprete únicamente, sin ningún elemento musical','El color de la portada del disco','La cantidad de minutos exactos que dura cada canción'] },
  { pregunta:'¿Qué significa comparar dos obras musicales según su "propósito expresivo"?', correcta:'Analizar qué sentimiento o mensaje buscaba transmitir cada obra a su audiencia', opts:['Comparar únicamente el precio de cada disco','Contar cuántas personas asistieron a cada concierto','Medir solo la duración de cada canción'] },
  { pregunta:'Dos compositores usan "procedimientos compositivos" distintos para una misma melodía: uno la repite igual varias veces, y otro la varía cada vez que aparece. ¿Qué se está contrastando?', correcta:'El procedimiento compositivo (reiteración vs. variación)', opts:['El instrumento usado únicamente','El país de origen del compositor','La duración total de la obra'] },
  { pregunta:'¿Por qué es útil contrastar el CONTEXTO en que se compusieron dos obras musicales similares?', correcta:'Porque el contexto histórico y social puede explicar por qué cada obra suena o se usa de forma distinta', opts:['El contexto nunca influye en cómo suena una obra','Solo importa el contexto si la obra es reciente','El contexto es información irrelevante para la música'] },
  { pregunta:'Dos canciones de amor de distintas décadas usan instrumentos muy diferentes (una guitarra acústica, otra sintetizadores electrónicos). ¿Qué elemento del lenguaje musical se está contrastando?', correcta:'El tempo, la instrumentación o la textura musical usada en cada una', opts:['El título de cada canción únicamente','La cantidad de estrofas exactas de cada canción','El color de la portada del álbum'] },
  { pregunta:'Una canción de cuna busca tranquilizar a un bebé, mientras que un himno busca inspirar unidad a una multitud. ¿Qué se está comparando entre ambas obras?', correcta:'Analizar qué sentimiento o mensaje buscaba transmitir cada obra a su audiencia', opts:['Solo la cantidad de personas que las escuchan','Únicamente el precio de cada partitura','El nombre del compositor exclusivamente'] },
];
const MEDIOS_REGISTRO_M2_BANK = [
  { pregunta:'Antes de la invención de la grabación de sonido, ¿cómo se transmitía y conservaba principalmente la música?', correcta:'A través de la partitura escrita y de la transmisión oral entre músicos', opts:['A través de videos digitales','Mediante streaming de audio','No existía ninguna forma de conservar la música'] },
  { pregunta:'¿Qué cambio importante trajo la invención de la grabación de sonido (disco, cinta) para la música?', correcta:'Permitió escuchar una misma interpretación musical repetidas veces, sin necesidad de un músico presente en vivo', opts:['Hizo desaparecer por completo la música en vivo','No tuvo ningún efecto en cómo se escuchaba música','Eliminó la necesidad de componer nueva música'] },
  { pregunta:'¿Qué rol cumplió la radio en la difusión de la música durante el siglo XX?', correcta:'Permitió que la música llegara a una audiencia masiva de forma simultánea, sin necesidad de comprar un disco', opts:['No tuvo ningún rol en la difusión musical','Solo transmitía noticias, nunca música','Reemplazó por completo los conciertos en vivo'] },
  { pregunta:'¿Qué cambio reciente en los medios de registro y transmisión ha transformado cómo las personas acceden a la música hoy?', correcta:'El streaming digital, que permite escuchar casi cualquier canción al instante desde un dispositivo', opts:['El regreso exclusivo al disco de vinilo como único medio','La desaparición completa de la música grabada','Ningún medio nuevo ha aparecido en los últimos años'] },
  { pregunta:'¿Qué ventaja ofreció la partitura escrita, antes de que existiera la grabación de sonido, para la transmisión de la música?', correcta:'Permitió conservar y transmitir una obra musical con precisión a través del tiempo y la distancia, sin depender solo de la memoria', opts:['No ofrecía ninguna ventaja real','Solo servía para dibujar, sin relación con la música','Reemplazaba por completo la necesidad de tocar un instrumento'] },
  { pregunta:'¿Cómo cambió la forma de descubrir música nueva con la llegada de las plataformas de streaming, en comparación con la radio?', correcta:'Permitió a cada persona elegir y descubrir música según sus propios gustos, en vez de depender de la programación de una emisora', opts:['No cambió nada respecto a la radio','Eliminó por completo la posibilidad de escuchar música nueva','Hizo que solo se pudiera escuchar un género musical'] },
];
export function genContrasteMediosM2Round(){
  const recurso = '<b>Contrastar dos obras musicales</b> con características similares implica compararlas en varios niveles: el <b>lenguaje musical</b> (tempo, instrumentación, textura), los <b>procedimientos compositivos</b> (por ejemplo, si una melodía se repite igual —reiteración— o se transforma cada vez —variación—), el <b>contexto</b> histórico y social en que fueron creadas, y su <b>propósito expresivo</b> (qué sentimiento o mensaje buscaban transmitir). Por otro lado, los <b>medios de registro y transmisión</b> de la música han cambiado profundamente su historia: antes de la grabación de sonido, la música se conservaba mediante partituras escritas y transmisión oral; la invención del disco permitió repetir una misma interpretación; la radio la llevó a audiencias masivas; y hoy el streaming digital permite acceder a casi cualquier canción al instante, transformando por completo la forma en que las personas descubren y escuchan música.';
  const item = pick(Math.random()<0.5 ? CONTRASTE_MUSICAL_M2_BANK : MEDIOS_REGISTRO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

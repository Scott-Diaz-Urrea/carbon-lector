import { pick, shuffle } from '../utils.js';

export const MUSICA_MODULES = [
  {id:'sonidos', label:'Sonidos', open:true, key:'sonidos'},
  {id:'instrumentos', label:'Instrumentos', open:true, key:'instrumentos'},
];
export const MUSICA_POS = [{x:24,y:70},{x:70,y:25}];

/* ---------------- Contenido Música 1° Básico ----------------
   OA01 -> Sonidos (cualidades del sonido) · OA04 -> Instrumentos.
   OA02,03,05,06,07 (expresión personal, repertorio específico, improvisación,
   presentación en vivo) quedaron fuera por depender de audio real / desempeño,
   no de una pregunta de opción múltiple. */
/* Ampliado de 10 a 12 ítems (antes coincidía exactamente con rounds:10,
   sin margen — ver mcEngine.js). */
const SONIDO_ITEMS = [
  { emoji:'🐭', label:'El sonido de un ratoncito chiquito', cualidad:'AGUDO', par:['AGUDO','GRAVE'] },
  { emoji:'🦁', label:'El rugido de un león', cualidad:'GRAVE', par:['AGUDO','GRAVE'] },
  { emoji:'🐘', label:'El sonido de un elefante', cualidad:'GRAVE', par:['AGUDO','GRAVE'] },
  { emoji:'🐦', label:'El canto de un pajarito', cualidad:'AGUDO', par:['AGUDO','GRAVE'] },
  { emoji:'📢', label:'Un grito bien fuerte', cualidad:'FUERTE', par:['FUERTE','SUAVE'] },
  { emoji:'🤫', label:'Un susurro suavecito', cualidad:'SUAVE', par:['FUERTE','SUAVE'] },
  { emoji:'🚂', label:'El pitido de un tren', cualidad:'FUERTE', par:['FUERTE','SUAVE'] },
  { emoji:'🍃', label:'El viento suave entre las hojas', cualidad:'SUAVE', par:['FUERTE','SUAVE'] },
  { emoji:'🎵', label:'Una nota musical que dura muchos segundos', cualidad:'LARGO', par:['LARGO','CORTO'] },
  { emoji:'👏', label:'Un aplauso rápido y breve', cualidad:'CORTO', par:['LARGO','CORTO'] },
  { emoji:'🦗', label:'El canto de un grillo en la noche', cualidad:'AGUDO', par:['AGUDO','GRAVE'] },
  { emoji:'🥁', label:'El golpe seco de un tambor grande', cualidad:'GRAVE', par:['AGUDO','GRAVE'] },
];
const INSTRUMENTOS_ITEMS = [
  { emoji:'🥁', label:'TAMBOR', tipo:'CONVENCIONAL' },
  { emoji:'🪇', label:'MARACAS', tipo:'CONVENCIONAL' },
  { emoji:'🪘', label:'DJEMBÉ (TAMBOR AFRICANO)', tipo:'CONVENCIONAL' },
  { emoji:'🎻', label:'VIOLÍN', tipo:'CONVENCIONAL' },
  { emoji:'🎺', label:'TROMPETA', tipo:'CONVENCIONAL' },
  { emoji:'🎸', label:'GUITARRA', tipo:'CONVENCIONAL' },
  { emoji:'🥫', label:'UNA LATA VACÍA', tipo:'NO CONVENCIONAL' },
  { emoji:'🪣', label:'UN BALDE', tipo:'NO CONVENCIONAL' },
  { emoji:'🥄', label:'DOS CUCHARAS', tipo:'NO CONVENCIONAL' },
  { emoji:'📦', label:'UNA CAJA DE CARTÓN', tipo:'NO CONVENCIONAL' },
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
];
export const MUSICA_POS_G2 = [{x:50,y:50}];

const TIMBRE_BANK = [
  { emoji:'🥁', instrumento:'TAMBOR', desc:'Un sonido seco y golpeado, como un golpe fuerte.' },
  { emoji:'🎻', instrumento:'VIOLÍN', desc:'Un sonido que se desliza y vibra, como un canto largo.' },
  { emoji:'🔔', instrumento:'CAMPANA', desc:'Un sonido metálico que resuena y se queda vibrando.' },
  { emoji:'🎹', instrumento:'PIANO', desc:'Un sonido claro que se apaga rápido después de tocar la tecla.' },
  { emoji:'🎺', instrumento:'TROMPETA', desc:'Un sonido brillante y potente, como una fanfarria.' },
];
const PULSO_BANK = [
  { pregunta:'¿Qué es el "pulso" en la música?', correcta:'El latido constante, como el tic-tac de un reloj', opts:['Una nota muy aguda','El nombre de un instrumento','El final de una canción'] },
  { pregunta:'¿Qué es un "acento" en la música?', correcta:'Un golpe o nota que suena más fuerte que las demás', opts:['Una nota muy suave','El silencio entre notas','El nombre de una canción'] },
];

export function genTimbrePulso2Round(){
  if(Math.random()<0.5){
    const item = pick(TIMBRE_BANK);
    const distract = shuffle(TIMBRE_BANK.filter(function(t){ return t.instrumento!==item.instrumento; })).slice(0,3).map(function(t){ return t.instrumento; });
    const opts = shuffle([item.instrumento].concat(distract)).map(function(i){ return {label:i, value:i}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+' ¿Qué instrumento tiene este timbre?</p>',
      options: opts, correctValue: item.instrumento, speakText: item.desc, cols:4, kind:'word',
      explain: 'Ese timbre corresponde al <b>'+item.instrumento.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PULSO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

export function genSonidosRound(){
  const item = pick(SONIDO_ITEMS);
  const opts = shuffle(item.par.map(function(c){ return {label:c, value:c}; }));
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Cómo es este sonido?</p>',
    options: opts, correctValue: item.cualidad, speakText: item.label, cols:2, panel:true,
    explain: item.label+', por eso es un sonido <b>'+item.cualidad.toLowerCase()+'</b>.',
  };
}

export function genInstrumentosRound(){
  const item = pick(INSTRUMENTOS_ITEMS);
  const opts = shuffle([{label:'CONVENCIONAL', value:'CONVENCIONAL'},{label:'NO CONVENCIONAL', value:'NO CONVENCIONAL'}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Es un instrumento musical convencional o no convencional?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:2, panel:true,
    explain: item.label+' es un instrumento <b>'+item.tipo.toLowerCase()+'</b>.',
  };
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
];
export const MUSICA_POS_G3 = [{x:30,y:70},{x:70,y:30}];

const FORMA_MUSICAL_BANK = [
  { patron:['A','A','A'], forma:'A-A-A (SE REPITE LA MISMA SECCIÓN)' },
  { patron:['A','B','A'], forma:'A-B-A (VUELVE A LA SECCIÓN INICIAL)' },
  { patron:['A','A','B'], forma:'A-A-B (DOS VECES LO MISMO Y LUEGO ALGO NUEVO)' },
  { patron:['A','B','B'], forma:'A-B-B (ALGO NUEVO QUE SE REPITE)' },
  { patron:['A','B','C'], forma:'A-B-C (TRES SECCIONES DISTINTAS)' },
  { patron:['A','B','A','B'], forma:'A-B-A-B (DOS SECCIONES QUE SE ALTERNAN)' },
];
const PULSO_ACENTO_BANK = [
  { pregunta:'¿Cómo se llama el "latido" constante y regular que se repite en una canción, como el tic-tac de un reloj?', correcta:'EL PULSO', opts:['EL ACENTO','LA MELODÍA','EL SILENCIO'] },
  { pregunta:'¿Cómo se llama cuando un golpe o nota suena más fuerte que las demás dentro del pulso?', correcta:'EL ACENTO', opts:['EL PULSO','LA PAUSA','EL TONO'] },
];
const MUSICA_SOCIEDAD_BANK = [
  { situacion:'Una fiesta de cumpleaños, justo cuando traen la torta con velitas', correcta:'"FELIZ CUMPLEAÑOS" (CUMPLEAÑOS FELIZ)', opts:['UN HIMNO NACIONAL','UNA CANCIÓN DE CUNA','UNA MARCHA FÚNEBRE'] },
  { situacion:'Un bebé que no se puede dormir en la noche', correcta:'UNA CANCIÓN DE CUNA', opts:['UNA CANCIÓN DE CUMPLEAÑOS','UNA MARCHA MILITAR','UN HIMNO NACIONAL'] },
  { situacion:'Una ceremonia oficial del país, como un acto cívico en la escuela', correcta:'EL HIMNO NACIONAL', opts:['UNA CANCIÓN DE CUNA','UNA CANCIÓN DE CUMPLEAÑOS','UN JINGLE PUBLICITARIO'] },
  { situacion:'Un anuncio de televisión que quiere que recuerdes un producto', correcta:'UN JINGLE PUBLICITARIO', opts:['UN HIMNO NACIONAL','UNA CANCIÓN DE CUNA','UNA MARCHA FÚNEBRE'] },
  { situacion:'Una fiesta patria como el 18 de septiembre en Chile', correcta:'CUECA (MÚSICA FOLCLÓRICA CHILENA)', opts:['UNA CANCIÓN DE CUNA','UN JINGLE PUBLICITARIO','UNA ÓPERA'] },
  { situacion:'Un partido de fútbol, cuando el equipo sale a la cancha', correcta:'UN HIMNO O CÁNTICO DEL EQUIPO', opts:['UNA CANCIÓN DE CUNA','UN VALS CLÁSICO','UNA MARCHA FÚNEBRE'] },
  { situacion:'Una boda, justo cuando la novia entra caminando', correcta:'LA MARCHA NUPCIAL', opts:['UN JINGLE PUBLICITARIO','UNA CANCIÓN DE CUNA','EL HIMNO NACIONAL'] },
  { situacion:'Una ceremonia solemne y triste de despedida', correcta:'UNA MARCHA FÚNEBRE', opts:['UNA CANCIÓN DE CUMPLEAÑOS','UN JINGLE PUBLICITARIO','LA CUECA'] },
];

export function genLenguajeMusical3Round(){
  if(Math.random()<0.5){
    const item = pick(FORMA_MUSICAL_BANK);
    const distract = shuffle(FORMA_MUSICAL_BANK.filter(function(f){ return f.forma!==item.forma; })).slice(0,3).map(function(f){ return f.forma; });
    const opts = shuffle([item.forma].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+item.patron.join(' - ')+'</p><p class="prompt-hint">¿Qué forma musical tiene esta secuencia de secciones?</p>',
      options: opts, correctValue: item.forma, speakText: '¿Qué forma musical es '+item.patron.join('-')+'?', cols:2, panel:true,
      explain: 'La secuencia '+item.patron.join('-')+' corresponde a la forma <b>'+item.forma.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PULSO_ACENTO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genMusicaSociedad3Round(){
  const item = pick(MUSICA_SOCIEDAD_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.situacion+'. ¿Qué tipo de música es más probable escuchar ahí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.situacion+'. ¿Qué música es más probable escuchar ahí?', cols:2, kind:'word',
    explain: 'En esa situación, lo más común es escuchar <b>'+item.correcta.toLowerCase()+'</b>.',
  };
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
  { desc:'Un volumen muy suave, casi un susurro musical', termino:'PIANO (SUAVE)' },
  { desc:'Un volumen muy fuerte y potente', termino:'FORTE (FUERTE)' },
  { desc:'Un volumen que va aumentando poco a poco, de suave a fuerte', termino:'CRESCENDO' },
  { desc:'Un volumen que va disminuyendo poco a poco, de fuerte a suave', termino:'DECRESCENDO' },
];
const TEMPO_BANK = [
  { desc:'Una canción que se toca muy rápido', termino:'ALLEGRO (RÁPIDO)' },
  { desc:'Una canción que se toca muy lenta y calmada', termino:'LARGO (MUY LENTO)' },
  { desc:'Una canción que se toca a velocidad moderada, ni rápida ni lenta', termino:'MODERATO' },
  { desc:'Una canción que se toca a un paso tranquilo, como una caminata', termino:'ANDANTE' },
];

export function genDinamicaTempo4Round(){
  const bank = Math.random()<0.5 ? DINAMICA_BANK : TEMPO_BANK;
  const item = pick(bank);
  const distract = shuffle(bank.filter(function(b){ return b.termino!==item.termino; })).map(function(b){ return b.termino; });
  const opts = shuffle([item.termino].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué término musical describe esto?</p>',
    options: opts, correctValue: item.termino, speakText: item.desc, cols:2, kind:'word',
    explain: 'Ese término musical es <b>'+item.termino.toLowerCase()+'</b>.',
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
  { desc:'Una persona cantando sola, sin ningún acompañamiento musical', tipo:'MONOFONÍA' },
  { desc:'Todo el curso cantando el mismo himno al unísono, sin ninguna otra voz sonando', tipo:'MONOFONÍA' },
  { desc:'Un solista cantando la melodía principal mientras la guitarra toca acordes de acompañamiento', tipo:'HOMOFONÍA' },
  { desc:'Una banda donde el cantante lleva la melodía y los demás instrumentos tocan acordes de fondo', tipo:'HOMOFONÍA' },
  { desc:'Un coro donde cada grupo de voces canta una melodía distinta al mismo tiempo, como en un canon', tipo:'POLIFONÍA' },
  { desc:'Varios instrumentos tocando cada uno su propia melodía independiente, entrelazadas entre sí', tipo:'POLIFONÍA' },
];
const PREGUNTA_RESPUESTA_BANK = [
  { desc:'Una frase musical que suena como una "pregunta", seguida de otra frase que la "responde", como una conversación musical', correcta:'ESTRUCTURA DE PREGUNTA-RESPUESTA' },
  { desc:'Un instrumento toca una frase corta y luego otro instrumento le contesta con una frase parecida, como si conversaran', correcta:'ESTRUCTURA DE PREGUNTA-RESPUESTA' },
];
export function genTexturaMusical5Round(){
  if(Math.random()<0.6){
    const item = pick(TEXTURA_MUSICAL_BANK);
    const todos = ['MONOFONÍA','HOMOFONÍA','POLIFONÍA'];
    const distract = todos.filter(function(t){ return t!==item.tipo; });
    const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué textura musical describe esta situación?</p>',
      options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, kind:'word',
      explain: 'Esta situación es un ejemplo de <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PREGUNTA_RESPUESTA_BANK);
  const opts = shuffle([{label:item.correcta, value:item.correcta},{label:'FORMA A-B-A', value:'FORMA A-B-A'},{label:'CRESCENDO', value:'CRESCENDO'},{label:'MONOFONÍA', value:'MONOFONÍA'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Cómo se llama esta estructura musical?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esta estructura se llama <b>'+item.correcta.toLowerCase()+'</b>.',
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
  { desc:'Una canción repite exactamente la misma frase musical dos veces seguidas', tipo:'REITERACIÓN' },
  { desc:'Una canción toca una frase suave y calmada, y luego una frase completamente distinta, fuerte y agitada', tipo:'CONTRASTE' },
  { desc:'Un coro canta la misma melodía una y otra vez a lo largo de toda la canción, sin cambiar nada', tipo:'REITERACIÓN' },
  { desc:'Una pieza musical pasa de una sección lenta y triste a una sección rápida y alegre, muy diferente a la anterior', tipo:'CONTRASTE' },
];
const DISENO_MELODICO_BANK = [
  { desc:'Una melodía que va subiendo de tono, nota por nota, de más grave a más aguda', diseno:'ASCENDENTE' },
  { desc:'Una melodía que va bajando de tono, nota por nota, de más aguda a más grave', diseno:'DESCENDENTE' },
  { desc:'Una melodía que sube y baja de tono varias veces, como las olas del mar', diseno:'ONDULANTE' },
];
const VARIACION_BANK = [
  { desc:'Una canción presenta su melodía principal, y luego la repite pero un poco más rápido y con un instrumento distinto', pregunta:'¿Cómo se llama a repetir una idea musical con algunos cambios, en vez de repetirla exactamente igual?', correcta:'VARIACIÓN', opts:['SILENCIO','PAUSA','ACORDE'] },
  { desc:'Un compositor toma un tema musical simple y lo repite varias veces, cada vez con un ritmo o una dinámica distinta', pregunta:'¿Cómo se llama a esta técnica de repetir un tema con cambios?', correcta:'VARIACIÓN', opts:['SILENCIO','PAUSA','ACORDE'] },
];
export function genMelodiaVariaciones6Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(REITERACION_CONTRASTE_BANK);
    const opts = shuffle([{label:'REITERACIÓN', value:'REITERACIÓN'},{label:'CONTRASTE', value:'CONTRASTE'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Esto es una reiteración o un contraste?</p>',
      options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, panel:true,
      explain: 'Esto es una <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.67){
    const item = pick(DISENO_MELODICO_BANK);
    const todos = ['ASCENDENTE','DESCENDENTE','ONDULANTE'];
    const distract = todos.filter(function(d){ return d!==item.diseno; });
    const opts = shuffle([item.diseno].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué diseño melódico describe esto?</p>',
      options: opts, correctValue: item.diseno, speakText: item.desc, cols:2, kind:'word',
      explain: 'Este es un diseño melódico <b>'+item.diseno.toLowerCase()+'</b>.',
    };
  }
  const item = pick(VARIACION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, kind:'word',
    explain: 'Esto se llama <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

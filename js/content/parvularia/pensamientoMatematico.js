import { pick, shuffle, randInt, uniqueDistractors, sceneRefsHTML } from '../../utils.js';
import { shapeSVG, solid3DSVG, toothbrushSVG, gusanoSVG, nidoSVG, groundSVG, cojinSVG } from '../../svg.js';
import { SHAPES } from '../matematica.js';

/* ---------------- Pensamiento Matemático — Educación Parvularia, NT ----------------
   Basado en OA del Decreto 481/2017, ámbito Interacción y Comprensión del Entorno,
   núcleo Pensamiento Matemático (curriculumnacional.cl/curriculum/educacion-parvularia/
   interaccion-comprension-entorno/nt-nivel-transicion):
   OA01 -> Patrones · OA02 -> Clasificar · OA03 -> ¿Dónde está? · OA04 -> Más, Menos
   o Igual · OA05 -> Antes y Después · OA06-07 -> Contar hasta 20 · OA08 -> Sumar y
   Quitar · OA10 -> Formas y Cuerpos · OA11 -> Medir.
   OA09 (representar objetos desde distintas perspectivas — dibujo/foto) y OA12
   (comunicar el proceso de resolución de un problema) quedaron fuera: son de
   producción gráfica u oral propia, no aptos para el motor de opción múltiple. */

export const PENSAMIENTO_MATEMATICO_MODULES = [
  { id:'patrones', label:'Patrones', open:true, key:'patrones' },
  { id:'clasificar', label:'Clasificar', open:true, key:'clasificar' },
  { id:'posicion', label:'¿Dónde está?', open:true, key:'posicion' },
  { id:'cuantificadores', label:'Más, Menos o Igual', open:true, key:'cuantificadores' },
  { id:'secuenciatemporal', label:'Antes y Después', open:true, key:'secuenciatemporal' },
  { id:'contarveinte', label:'Contar hasta 20', open:true, key:'contarveinte' },
  { id:'sumarquitar', label:'Sumar y Quitar', open:true, key:'sumarquitar' },
  { id:'formascuerpos', label:'Formas y Cuerpos', open:true, key:'formascuerpos' },
  { id:'medir', label:'Medir', open:true, key:'medir' },
];
export const PENSAMIENTO_MATEMATICO_POS = [
  {x:22,y:94},{x:68,y:83},{x:24,y:72},{x:70,y:61},{x:24,y:50},{x:70,y:39},{x:24,y:28},{x:70,y:17},{x:24,y:6}
];

const CUANT_EMOJIS = ['🍎','⭐','🎈','🐟','🍪','🧸','🎀'];

const PATRON_ELEMENTOS = ['🔴','🔵','🟡','🟢','🟣','⭐','🌙','❤️'];

const CLASIFICAR_GRUPOS = [
  { atributo:'el color', items:[{emoji:'🍎',val:'rojo'},{emoji:'🍓',val:'rojo'},{emoji:'🌹',val:'rojo'},{emoji:'🍌',val:'amarillo'}] },
  { atributo:'la forma', items:[{emoji:'⚽',val:'redondo'},{emoji:'🍊',val:'redondo'},{emoji:'🌍',val:'redondo'},{emoji:'📦',val:'cuadrado'}] },
  { atributo:'el tamaño', items:[{emoji:'🐘',val:'grande'},{emoji:'🦏',val:'grande'},{emoji:'🦒',val:'grande'},{emoji:'🐭',val:'pequeño'}] },
  { atributo:'dónde viven', items:[{emoji:'🐟',val:'agua'},{emoji:'🐬',val:'agua'},{emoji:'🐳',val:'agua'},{emoji:'🐶',val:'tierra'}] },
  { atributo:'cómo se mueven', items:[{emoji:'🐦',val:'vuelan'},{emoji:'🦋',val:'vuelan'},{emoji:'🐝',val:'vuelan'},{emoji:'🐌',val:'reptan'}] },
  { atributo:'la temperatura', items:[{emoji:'🧊',val:'frío'},{emoji:'❄️',val:'frío'},{emoji:'🍦',val:'frío'},{emoji:'☀️',val:'caliente'}] },
  { atributo:'la cantidad de patas', items:[{emoji:'🐦',val:'dos patas'},{emoji:'🐔',val:'dos patas'},{emoji:'🦩',val:'dos patas'},{emoji:'🐕',val:'cuatro patas'}] },
  { atributo:'el tipo de alimento', items:[{emoji:'🍎',val:'fruta'},{emoji:'🍌',val:'fruta'},{emoji:'🍇',val:'fruta'},{emoji:'🥕',val:'verdura'}] },
];

/* Cada escena trae su propio `pregunta` (para speakText) en vez de derivarlo
   de `texto.replace('___','')`: quitar el hueco a secas dejaba oraciones
   agramaticales al leerlas en voz alta (p.ej. "El pez nada  del agua" pierde
   la preposición, y puede sonar a "nada" = "nothing"). `explain` reutiliza
   `texto` con el hueco relleno por la respuesta correcta, así queda una
   oración completa y específica de la escena en vez de un genérico
   "La palabra correcta es X". El gusano usa gusanoSVG() en vez de 🪱
   (que no se renderiza — recuadro vacío — en varios navegadores).

   Cada escena trae además `refs` (1-2 íconos del objeto de referencia:
   nido, agua, casa, cueva, cojines): antes solo se mostraba al sujeto sin
   la referencia contra la que se ubica, dejando la mitad de la oración sin
   respaldo visual — el mismo problema que se corrigió en
   corporalidadMovimiento.js (Ubicación Espacial) tras el aviso del
   usuario sobre la escena del vaso de agua. Para "ARRIBA" (nube/globo) se
   usa una casa 🏠 como punto de referencia en el suelo, porque "arriba" no
   tiene sentido visual sin algo abajo con qué compararlo. */
const POSICION_ESCENAS = [
  { emoji:'🐦', refs:[nidoSVG(44)], texto:'El pajarito está ___ de su nido.', correct:'DENTRO', pregunta:'¿Dónde está el pajarito?' },
  { emoji:'🐟', refs:['💧'], texto:'El pez nada ___ del agua.', correct:'DENTRO', pregunta:'¿Dónde nada el pez?' },
  { emoji:'☁️', refs:['🏠'], texto:'La nube está ___ en el cielo.', correct:'ARRIBA', pregunta:'¿Dónde está la nube?' },
  { emoji: gusanoSVG(30), refs:[groundSVG(44)], texto:'El gusano está ___ de la tierra.', correct:'ABAJO', pregunta:'¿Dónde está el gusano?' },
  { emoji:'🐿️', refs:['🏠'], texto:'La ardilla salió ___ de su casa a jugar.', correct:'FUERA', pregunta:'¿Dónde salió a jugar la ardilla?' },
  { emoji:'🧸', refs:[cojinSVG(40), cojinSVG(40)], texto:'El osito está ___ de las dos almohadas.', correct:'ENTRE', pregunta:'¿Dónde está el osito?' },
  { emoji:'🎈', refs:['🏠'], texto:'El globo voló ___ hacia el cielo.', correct:'ARRIBA', pregunta:'¿Hacia dónde voló el globo?' },
  { emoji:'🐇', refs:['🕳️'], texto:'El conejo se escondió ___ de la cueva.', correct:'DENTRO', pregunta:'¿Dónde se escondió el conejo?' },
];
const POSICION_OPTS_POOL = ['ARRIBA','ABAJO','DENTRO','FUERA','ENTRE'];

const RUTINA_DIA_PARV = [
  { emoji:'☀️', label:'Despertar', orden:1 },
  { emoji:'<span style="display:inline-flex;vertical-align:middle;">'+toothbrushSVG(24)+'</span>', label:'Lavarse los dientes', orden:2 },
  { emoji:'🍞', label:'Desayunar', orden:3 },
  { emoji:'🎒', label:'Ir al jardín', orden:4 },
  { emoji:'🍽️', label:'Almorzar', orden:5 },
  { emoji:'🛌', label:'Dormir siesta', orden:6 },
  { emoji:'🌙', label:'Dormir en la noche', orden:7 },
];

const SOLIDOS_3D = [
  { id:'cubo', label:'CUBO' },
  { id:'esfera', label:'ESFERA' },
  { id:'cono', label:'CONO' },
  { id:'cilindro', label:'CILINDRO' },
];

const MEDIR_OBJETOS = [
  { emoji:'✏️', label:'El lápiz', unidades:4 },
  { emoji:'📏', label:'La regla', unidades:8 },
  { emoji:'🖊️', label:'El plumón', unidades:5 },
  { emoji:'🧦', label:'El calcetín', unidades:6 },
  { emoji:'🔑', label:'La llave', unidades:2 },
  { emoji:'🍌', label:'El plátano', unidades:5 },
];

export function genPatronesRound(){
  const recurso = 'Un <b>patrón</b> es una secuencia que se repite siguiendo una regla, como los colores de un semáforo o los cuadros de un tablero de ajedrez. Para descubrir un patrón, primero hay que encontrar cuál es el "grupito" que se repite una y otra vez — puede ser de 2, 3 o más elementos. Una vez que sabes cuál es ese grupito, puedes adivinar qué viene después: solo tienes que fijarte en qué lugar del ciclo va el patrón y repetir el orden. Reconocer patrones es una habilidad muy importante para las matemáticas: ayuda a predecir qué va a pasar, a organizar información y, más adelante, a entender cosas como las tablas de multiplicar o las secuencias numéricas. También aparece en la vida diaria: en la ropa a rayas, en la música (un ritmo que se repite) y en la naturaleza (los pétalos de una flor, las rayas de una cebra).';
  const useThree = Math.random()<0.4;
  const pool = shuffle(PATRON_ELEMENTOS).slice(0, useThree ? 3 : 2);
  const seq = [];
  for(let i=0;i<6;i++){ seq.push(pool[i % pool.length]); }
  const next = pool[6 % pool.length];
  const distractPool = PATRON_ELEMENTOS.filter(function(e){ return pool.indexOf(e)===-1; });
  const distract = shuffle(distractPool).slice(0,3);
  const opts = shuffle([next].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-count">'+seq.join(' ')+' <span class="blank">?</span></p><p class="prompt-hint">¿Qué sigue en el patrón?</p>',
    options: opts, correctValue: next, speakText: '¿Qué elemento sigue en el patrón?', cols:4,
    explain: 'El patrón se repite así: '+pool.join(' ')+'… por eso sigue <b>'+next+'</b>.',
    recurso: recurso,
  };
}

export function genClasificarRound(){
  const recurso = '<b>Clasificar</b> significa juntar objetos en grupos según lo que tienen en común: puede ser el color, la forma, el tamaño, dónde viven o cómo se mueven. Antes de clasificar, hay que observar bien cada objeto y decidir cuál es la característica que vamos a usar para agrupar — el mismo grupo de objetos se puede clasificar de formas distintas según qué atributo elijamos (por ejemplo, unas frutas se pueden agrupar por color o por tipo). Cuando un objeto no comparte esa característica con los demás, decimos que "no pertenece al grupo" o que "sobra". Clasificar ayuda a poner orden en el mundo que nos rodea, y es una habilidad que usamos todo el tiempo: al ordenar los juguetes, la ropa o los alimentos. También es la base de habilidades matemáticas más avanzadas, como organizar datos en tablas y gráficos.';
  const grupo = pick(CLASIFICAR_GRUPOS);
  const items = shuffle(grupo.items);
  const oddItem = items.filter(function(it){
    return items.filter(function(o){ return o.val===it.val; }).length===1;
  })[0];
  const opts = items.map(function(it){ return {label:it.emoji, value:it.emoji}; });
  return {
    promptHTML: '<p class="prompt-count">'+items.map(function(it){ return it.emoji; }).join('   ')+'</p><p class="prompt-hint">¿Cuál no pertenece al grupo?</p>',
    options: opts, correctValue: oddItem.emoji, speakText: '¿Cuál de estos no pertenece al grupo?', cols:4,
    explain: 'Los otros tres comparten '+grupo.atributo+', pero '+oddItem.emoji+' es distinto.',
    recurso: recurso,
  };
}

export function genPosicionRound(){
  const recurso = 'Las palabras de <b>ubicación espacial</b> (arriba, abajo, dentro, fuera, entre) sirven para explicar dónde está algo en relación a otra cosa — nunca dicen la posición "sola", siempre comparan un objeto con un punto de referencia. Por ejemplo, decir que un pájaro está "dentro" solo tiene sentido si sabemos dentro de qué (su nido); decir que algo está "arriba" solo tiene sentido si hay un punto más abajo con el cual compararlo. "Entre" es especial porque necesita DOS referencias, una a cada lado (como estar entre dos almohadas). Aprender estas palabras ayuda a describir el espacio que nos rodea con precisión, a seguir instrucciones ("pon el libro dentro de la mochila") y a entender más adelante conceptos matemáticos de geometría y de coordenadas.';
  const item = pick(POSICION_ESCENAS);
  const distract = shuffle(POSICION_OPTS_POOL.filter(function(p){ return p!==item.correct; })).slice(0,3);
  const opts = shuffle([item.correct].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: sceneRefsHTML(item.emoji, item.refs)+'<p class="prompt-hint">'+item.texto.replace('___','<span class="blank">___</span>')+'</p>',
    options: opts, correctValue: item.correct, speakText: item.pregunta, cols:4, kind:'word',
    explain: item.texto.replace('___', item.correct),
    recurso: recurso,
  };
}

export function genCuantificadoresRound(){
  const recurso = 'Comparar cantidades es decidir si un grupo tiene <b>más</b>, <b>menos</b> o <b>igual</b> cantidad que otro. La forma más fácil de comparar sin contar es emparejar los elementos de un grupo con los del otro, de a uno, como si les diéramos la mano: si a un grupo le sobran elementos sin pareja, ese grupo tiene más; si a los dos grupos les alcanzan las parejas exactas, es igual. También se puede contar cada grupo por separado y comparar los números: el número más grande corresponde al grupo con más cantidad. Esta habilidad es la base para entender los símbolos matemáticos "mayor que", "menor que" e "igual que" que se usan más adelante en la escuela, y para tomar decisiones cotidianas, como saber si hay suficientes platos para todos en la mesa.';
  const emoji = pick(CUANT_EMOJIS);
  const nA = randInt(1,10);
  const nB = randInt(1,10);
  const groupA = new Array(nA).fill(emoji).join(' ');
  const groupB = new Array(nB).fill(emoji).join(' ');
  const correct = nA>nB ? 'MAS' : (nA<nB ? 'MENOS' : 'IGUAL');
  const opts = shuffle([{label:'MÁS QUE', value:'MAS'},{label:'MENOS QUE', value:'MENOS'},{label:'IGUAL QUE', value:'IGUAL'}]);
  return {
    promptHTML: '<p class="prompt-count">'+groupA+'</p><p class="prompt-hint">— comparado con —</p><p class="prompt-count">'+groupB+'</p><p class="prompt-hint">El primer grupo tiene...</p>',
    options: opts, correctValue: correct, speakText: '¿El primer grupo tiene más, menos o igual que el segundo?', cols:2, panel:true,
    explain: 'El primer grupo tiene '+nA+' y el segundo '+nB+', por eso es "'+(correct==='MAS'?'MÁS QUE':correct==='MENOS'?'MENOS QUE':'IGUAL QUE')+'".',
    recurso: recurso,
  };
}

export function genSecuenciaTemporalRound(){
  const recurso = 'Las rutinas diarias (despertar, lavarse los dientes, desayunar, ir al jardín, almorzar, dormir siesta, dormir en la noche) siempre ocurren en el mismo orden, y entender ese orden es la base para las palabras <b>antes</b> y <b>después</b>. Decimos que una actividad pasa "antes" de otra cuando ocurre primero en el tiempo, y "después" cuando ocurre más tarde. Reconocer la secuencia temporal de las actividades del día ayuda a organizar el tiempo, a saber qué se espera que pase a continuación y a anticiparse a los cambios (por ejemplo, saber que después de almorzar viene la siesta). Esta habilidad es un paso importante antes de aprender a leer un reloj o un calendario, porque primero hay que entender que el tiempo tiene un orden que no cambia.';
  let a = pick(RUTINA_DIA_PARV), b = pick(RUTINA_DIA_PARV);
  while(b.label === a.label) b = pick(RUTINA_DIA_PARV);
  const askBefore = Math.random()<0.5;
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const earlier = a.orden<b.orden ? a : b;
  const later = a.orden<b.orden ? b : a;
  const correct = askBefore ? earlier.label : later.label;
  return {
    promptHTML: '<p class="prompt-hint">'+(askBefore ? '¿Qué pasa ANTES en tu día?' : '¿Qué pasa DESPUÉS en tu día?')+'</p>',
    options: opts, correctValue: correct, speakText: askBefore ? '¿Qué pasa antes?' : '¿Qué pasa después?', cols:2, panel:true,
    explain: earlier.label+' pasa antes que '+later.label+' en un día normal.',
    recurso: recurso,
  };
}

export function genContarVeinteRound(){
  const recurso = '<b>Contar</b> es asignar un número, en orden, a cada uno de los elementos de un grupo, sin saltarse ninguno y sin contar el mismo dos veces — a esto se le llama "correspondencia uno a uno". El último número que se dice al terminar de contar es la cantidad total de elementos que hay. Contar hasta 20 requiere conocer la secuencia numérica en orden (1, 2, 3… hasta 20) y aplicarla con cuidado, tocando o señalando cada elemento mientras se dice el número que corresponde. Esta es una de las habilidades matemáticas más importantes de la primera infancia: es la base para sumar, restar, comparar cantidades y, más adelante, para entender el sistema de valor posicional (decenas y unidades).';
  const emoji = pick(CUANT_EMOJIS);
  const n = randInt(10,20);
  const visual = new Array(n).fill(emoji).join(' ');
  const opts = uniqueDistractors(n,1,20,3,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:20px;">'+visual+'</p><p class="prompt-hint">¿Cuántos hay?</p>',
    options: opts, correctValue: n, speakText: '¿Cuántos hay?', cols:4,
    explain: 'Si cuentas uno por uno, hay <b>'+n+'</b> en total.',
    recurso: recurso,
  };
}

export function genSumarQuitarRound(){
  const recurso = '<b>Sumar</b> es juntar dos grupos para saber cuántos elementos hay en total, y <b>quitar</b> (restar) es sacar algunos elementos de un grupo para saber cuántos quedan. Para sumar sin usar números escritos, se pueden contar todos los elementos de ambos grupos juntos, uno por uno. Para quitar, se cuentan los elementos que quedan después de sacar los que se fueron. Estas dos operaciones son opuestas: sumar hace que la cantidad crezca, y quitar hace que la cantidad se achique. Practicar con objetos concretos (como frutas o juguetes) antes de usar solo números ayuda a entender de verdad qué significa sumar y restar, en vez de solo memorizar el resultado — esta comprensión es la base de toda la aritmética que se aprende en la escuela.';
  const emoji = pick(CUANT_EMOJIS);
  if(Math.random()<0.5){
    const a = randInt(1,5), b = randInt(1,5);
    const sum = a+b;
    const visual = new Array(a).fill(emoji).join(' ')+'<span class="op-sign">+</span>'+new Array(b).fill(emoji).join(' ');
    const opts = uniqueDistractors(sum,0,10,2,4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+visual+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
      explain: a+' + '+b+' = <b>'+sum+'</b>.',
      recurso: recurso,
    };
  }
  const start = randInt(4,10);
  const takeAway = randInt(1, Math.min(start,5));
  const result = start-takeAway;
  const visual = new Array(result).fill(emoji).join(' ') + (takeAway>0 ? ' ' : '') + new Array(takeAway).fill('<span class="emoji-removed">'+emoji+'</span>').join(' ');
  const opts = uniqueDistractors(result,0,10,2,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+visual+'</p><p class="prompt-hint">Había '+start+' y se fueron '+takeAway+'. ¿Cuántos quedan?</p>',
    options: opts, correctValue: result, speakText: 'Había '+start+' y se fueron '+takeAway+'. ¿Cuántos quedan?', cols:4,
    explain: start+' menos '+takeAway+' = <b>'+result+'</b>.',
    recurso: recurso,
  };
}

export function genFormasCuerposRound(){
  const recurso = 'Las <b>figuras 2D</b> (círculo, cuadrado, triángulo, rectángulo) son planas: se pueden dibujar en una hoja de papel y solo tienen largo y ancho. Los <b>cuerpos geométricos 3D</b> (cubo, esfera, cono, cilindro) son sólidos: además de largo y ancho tienen profundidad, y se pueden tomar con las manos, como una pelota (esfera) o una caja (cubo). Cada figura y cada cuerpo se reconoce por su forma característica: el círculo no tiene esquinas, el cuadrado tiene 4 lados iguales, la esfera es completamente redonda como una pelota, el cono tiene una punta. Reconocer estas formas ayuda a describir los objetos que nos rodean (una pelota de fútbol es una esfera, una caja de regalo es un cubo) y es la base de la geometría que se estudia en toda la educación básica.';
  if(Math.random()<0.5){
    const item = pick(SOLIDOS_3D);
    const distract = shuffle(SOLIDOS_3D.filter(function(s){ return s.id!==item.id; })).map(function(s){ return s.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(l){ return {label:l, value:l}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
      options: opts, correctValue: item.label, speakText: item.label, cols:4, kind:'word',
      explain: 'Esta figura es '+(item.id==='esfera'?'una':'un')+' <b>'+item.label.toLowerCase()+'</b>, un cuerpo geométrico 3D.',
      recurso: recurso,
    };
  }
  const item = pick(SHAPES);
  const distract = shuffle(SHAPES.filter(function(s){ return s.id!==item.id; })).slice(0,3);
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  return {
    promptHTML: '<div class="shape-display">'+shapeSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué forma es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:4, kind:'word',
    explain: 'Esta figura es un <b>'+item.label.toLowerCase()+'</b>, una figura plana 2D.',
    recurso: recurso,
  };
}

export function genMedirRound(){
  const recurso = '<b>Medir</b> es comparar el tamaño de dos o más objetos usando una unidad en común, como cubos, pasos o marcas iguales, para saber cuál es más largo o más corto. Antes de usar instrumentos de medición como una regla, se puede medir "a ojo" comparando dos objetos uno al lado del otro, o contando cuántas unidades (como cubos) caben a lo largo de cada uno: el objeto que necesita más unidades para cubrir todo su largo es el más largo. Esta habilidad ayuda a comparar tamaños de forma justa (no solo "se ve más grande", sino "mide más unidades") y es la base para aprender más adelante a usar instrumentos de medición reales, como la regla o la cinta métrica, y sus unidades oficiales (centímetros, metros).';
  let a = pick(MEDIR_OBJETOS), b = pick(MEDIR_OBJETOS);
  while(b.label === a.label || b.unidades === a.unidades) b = pick(MEDIR_OBJETOS);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const longer = a.unidades>b.unidades ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.unidades+' cubos.</p><p class="prompt-hint">'+b.emoji+' '+b.label+' mide '+b.unidades+' cubos.</p><p class="prompt-hint">¿Cuál es más largo?</p>',
    options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
    explain: longer.label+' mide '+longer.unidades+' cubos, más que el otro objeto.',
    recurso: recurso,
  };
}

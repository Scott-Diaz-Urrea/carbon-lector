import { pick, shuffle, randInt, uniqueDistractors } from '../utils.js';
import { shapeSVG, solid3DSVG, fraccionSVG, fraccionBarraSVG, anguloSVG, pieChartSVG, paralelogramoSVG } from '../svg.js';

export const COUNT_EMOJIS = ['🍎','🍓','🐝','⚽','🎈','🐟','🌟','🚗','🐶','🍌'];

export const SHAPES = [
  { id:'circulo', label:'Círculo' },
  { id:'cuadrado', label:'Cuadrado' },
  { id:'triangulo', label:'Triángulo' },
  { id:'rectangulo', label:'Rectángulo' },
  { id:'rombo', label:'Rombo' },
  { id:'ovalo', label:'Óvalo' },
  { id:'pentagono', label:'Pentágono' },
  { id:'hexagono', label:'Hexágono' },
];

/* Artículo correcto ("un"/"una") para figuras y cuerpos geométricos de este
   archivo: casi todos son masculinos, pero ESFERA y PIRÁMIDE son femeninos.
   Varios `explain` de abajo usaban el literal sin resolver "un(a)" (el niño
   lo leería tal cual, "un(a) esfera") — mismo tipo de bug ya corregido en
   Formas y Cuerpos de Parvularia (pensamientoMatematico.js), encontrado
   pendiente aquí durante la auditoría. */
function articuloFigura(id){
  return (id==='esfera' || id==='piramide') ? 'una' : 'un';
}

export const MATE_MODULES = [
  {id:'contar', label:'Contar', open:true, key:'contar'},
  {id:'sumar', label:'Sumar', open:true, key:'sumar'},
  {id:'comparar', label:'Comparar', open:true, key:'comparar'},
  {id:'formas', label:'Formas', open:true, key:'formas'},
];
export const MATE_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:68,y:12}];

export const MATE_MODULES_G2 = [
  {id:'salta', label:'Salta y Cuenta', open:true, key:'salta'},
  {id:'multiplicar', label:'Multiplicar', open:true, key:'multiplicar'},
  {id:'geometria2', label:'Geometría', open:true, key:'geometria2'},
  {id:'medicion2', label:'Medición', open:true, key:'medicion2'},
];
export const MATE_POS_G2 = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:68,y:12}];

export function genCountRound(){
  const emoji = pick(COUNT_EMOJIS);
  const n = randInt(1,9);
  const visual = new Array(n).fill(emoji).join(' ');
  const opts = uniqueDistractors(n,1,12,3,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+visual+'</p><p class="prompt-hint">¿Cuántos hay?</p>',
    options: opts,
    correctValue: n,
    speakText: '¿Cuántos hay?',
    cols: 4,
    explain: 'Si cuentas uno por uno, hay <b>'+n+'</b> en total.',
    recurso: 'Contar es asignar un número a cada objeto, uno por uno, sin saltarte ninguno y sin repetir ninguno — a esto se le llama <b>correspondencia uno a uno</b>. El último número que dices, ese es el total del grupo. Contar es una de las primeras habilidades matemáticas que aprende un niño, porque es la base de todo lo demás: para sumar, restar o comparar cantidades, primero hay que saber contarlas bien. Usamos el conteo todo el tiempo en la vida real: para saber cuántos platos poner en la mesa, cuántos días faltan para un cumpleaños, o cuánto dinero se necesita para comprar algo. Practicar contando distintos objetos (frutas, animales, juguetes) ayuda a que el número deje de ser solo una palabra y se convierta en una cantidad real que puedes imaginar.',
  };
}

export function genAddRound(){
  const a = randInt(1,5);
  const b = randInt(1,5);
  const sum = a+b;
  const emoji = pick(COUNT_EMOJIS);
  const visual = new Array(a).fill(emoji).join(' ') + '<span class="op-sign">+</span>' + new Array(b).fill(emoji).join(' ');
  const opts = uniqueDistractors(sum,1,12,2,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+visual+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts,
    correctValue: sum,
    speakText: '¿Cuánto es ' + a + ' más ' + b + '?',
    cols: 4,
    explain: a+' + '+b+' = <b>'+sum+'</b>. Cuenta todos los elementos juntos para comprobarlo.',
    recurso: '<b>Sumar</b> significa juntar dos cantidades para saber cuántas hay en total. Si tienes 3 manzanas y alguien te regala 2 más, sumar te dice cuántas manzanas tienes ahora sin necesidad de volver a contarlas todas desde cero: 3 + 2 = 5. El símbolo "+" viene de una abreviatura muy antigua de la palabra latina "et" (que significa "y"), usada por matemáticos hace más de 500 años para no tener que escribir "y" cada vez. Al principio, la forma más fácil de sumar es dibujar o imaginar todos los elementos juntos y contarlos uno por uno, como en este juego — con la práctica, el cerebro empieza a reconocer sumas conocidas sin tener que contar cada vez. Sumar se usa todos los días: para saber cuánto dinero tienes juntando monedas, o cuántos amigos hay juntando dos grupos.',
  };
}

export function genCompareRound(){
  const emojiA = pick(COUNT_EMOJIS);
  let emojiB = pick(COUNT_EMOJIS);
  if(emojiB === emojiA){ emojiB = COUNT_EMOJIS[(COUNT_EMOJIS.indexOf(emojiA)+1) % COUNT_EMOJIS.length]; }
  const nA = randInt(1,7);
  let nB = randInt(1,7);
  while(nB === nA){ nB = randInt(1,7); }
  const opts = [
    { label: new Array(nA).fill(emojiA).join(' '), value:'A' },
    { label: new Array(nB).fill(emojiB).join(' '), value:'B' },
  ];
  return {
    promptHTML: '<p class="prompt-hint">Toca el grupo que tiene <b>más</b></p>',
    options: opts,
    correctValue: nA>nB ? 'A' : 'B',
    speakText: '¿Cuál grupo tiene más?',
    cols: 2,
    panel: true,
    explain: 'El grupo con <b>'+Math.max(nA,nB)+'</b> tiene más que el grupo con <b>'+Math.min(nA,nB)+'</b>.',
    recurso: '<b>Comparar cantidades</b> significa decidir cuál grupo tiene más elementos y cuál tiene menos, sin necesariamente saber el número exacto de cada uno — a veces basta con mirar y emparejar: si por cada elemento del grupo A alcanza uno del grupo B y todavía sobran elementos en A, entonces A tiene más. Esta habilidad se llama <b>razonamiento cuantitativo</b> y es un paso anterior a contar con números: los bebés y los animales pueden distinguir "más" y "menos" incluso antes de saber contar. Comparar es muy útil en la vida diaria: para saber si alcanzan los platos para todos los invitados, si un vaso tiene más jugo que otro, o cuál de dos grupos de amigos es más grande. Practicar comparando ayuda a entender qué significa realmente un número, no solo a memorizarlo.',
  };
}

export function genFormaRound(){
  const item = pick(SHAPES);
  const distract = shuffle(SHAPES.filter(function(s){ return s.id!==item.id; })).slice(0,3);
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  return {
    promptHTML: '<div class="shape-display">'+shapeSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué forma es?</p>',
    options: opts,
    correctValue: item.id,
    speakText: item.label,
    cols: 4,
    kind: 'word',
    explain: 'Esta figura es un <b>'+item.label+'</b>.',
    recurso: 'Las <b>figuras geométricas</b> son formas que se repiten en muchísimos objetos a nuestro alrededor, y cada una se reconoce por características propias: el número de lados, si esos lados son rectos o curvos, y si son todos iguales o distintos. Un círculo no tiene lados rectos ni esquinas; un cuadrado tiene 4 lados iguales y 4 esquinas iguales; un triángulo tiene 3 lados. Aprender a reconocer y nombrar formas es la base de la <b>geometría</b>, una parte de las matemáticas que estudia el espacio y las formas — se usa para construir casas, diseñar señales de tránsito, fabricar ruedas (siempre círculos, para poder rodar) y hasta para cortar una pizza en partes iguales. Reconocer formas también ayuda a describir el mundo con palabras precisas, en vez de decir solo "esa cosa redonda".',
  };
}

export function genSaltaRound(){
  const step = pick([2,5,10]);
  const startMult = randInt(0, Math.floor(80/step));
  const start = startMult*step;
  const seq = [start, start+step, start+2*step, start+3*step, start+4*step];
  const blankIdx = randInt(1,3);
  const correct = seq[blankIdx];
  const opts = uniqueDistractors(correct, 0, 999, step*2, 4).map(function(v){ return {label:String(v), value:v}; });
  const displaySeq = seq.map(function(n,i){ return i===blankIdx ? '<span class="blank">?</span>' : n; }).join(' — ');
  return {
    promptHTML: '<p class="prompt-count" style="letter-spacing:1px;">'+displaySeq+'</p><p class="prompt-hint">¿Qué número falta en la secuencia?</p>',
    options: opts,
    correctValue: correct,
    speakText: '¿Qué número falta?',
    cols: 4,
    explain: 'La secuencia avanza de <b>'+step+'</b> en <b>'+step+'</b>, así que el número que falta es <b>'+correct+'</b>.',
    recurso: '"Contar salteado" significa avanzar de un número a otro sumando siempre la misma cantidad (el "paso"), en vez de sumar de uno en uno: contar de 2 en 2 (2, 4, 6, 8...), de 5 en 5 (5, 10, 15, 20...) o de 10 en 10 (10, 20, 30, 40...). Para encontrar el número que falta en una secuencia, primero descubre cuál es el paso (mira la diferencia entre dos números seguidos que sí conoces), y luego súmalo o réstalo según corresponda. Esta habilidad es la base para aprender las tablas de multiplicar más adelante: multiplicar por 2 es, en el fondo, contar de 2 en 2 varias veces.',
  };
}

/* ---------------- Contenido Matemática 2° Básico: Geometría y Medición ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/2-basico):
   Geometría -> OA14 (posición relativa, derecha/izquierda), OA15 (figuras 2D:
   triángulos, cuadrados, rectángulos, círculos), OA16 (figuras 3D: cubos,
   paralelepípedos, esferas, conos). Medición -> OA17 (calendario), OA18 (hora
   en reloj digital), OA19 (longitud con cm/m). */
const OBJETOS_POS_POOL = [
  {emoji:'🐶',label:'Perro'},{emoji:'🐱',label:'Gato'},{emoji:'🌳',label:'Árbol'},
  {emoji:'🏠',label:'Casa'},{emoji:'⚽',label:'Pelota'},{emoji:'🚗',label:'Auto'},
  {emoji:'🌸',label:'Flor'},{emoji:'📚',label:'Libro'},
];
const FIGURAS_2D_G2 = SHAPES.filter(function(s){ return ['circulo','cuadrado','triangulo','rectangulo'].indexOf(s.id)!==-1; });
const SOLIDOS_3D_G2 = [
  { id:'cubo', label:'Cubo' },
  { id:'paralelepipedo', label:'Paralelepípedo' },
  { id:'esfera', label:'Esfera' },
  { id:'cono', label:'Cono' },
];
const CALENDARIO_HECHOS = [
  { pregunta:'¿Cuántos días tiene una semana?', correcta:7, min:1, max:12, spread:4 },
  { pregunta:'¿Cuántos meses tiene un año?', correcta:12, min:1, max:20, spread:5 },
  { pregunta:'¿Cuántos días tiene el mes de febrero en un año normal?', correcta:28, min:20, max:31, spread:3 },
  { pregunta:'Si hoy es lunes, ¿en cuántos días más vuelve a ser lunes?', correcta:7, min:1, max:12, spread:4 },
  { pregunta:'¿Cuántas semanas tiene aproximadamente un mes?', correcta:4, min:1, max:10, spread:3 },
];
const OBJETOS_LONGITUD_G2 = [
  { emoji:'✏️', label:'El lápiz', medida:'15 cm', valor:15 },
  { emoji:'📏', label:'La regla', medida:'30 cm', valor:30 },
  { emoji:'🖊️', label:'El plumón', medida:'12 cm', valor:12 },
  { emoji:'🧦', label:'El calcetín', medida:'20 cm', valor:20 },
  { emoji:'🛏️', label:'La cama', medida:'190 cm', valor:190 },
  { emoji:'🚪', label:'La puerta', medida:'2 m', valor:200 },
  { emoji:'🚌', label:'El bus', medida:'10 m', valor:1000 },
  { emoji:'🏟️', label:'La cancha de fútbol', medida:'100 m', valor:10000 },
];

function genPosicionG2Round(){
  let a = pick(OBJETOS_POS_POOL), b = pick(OBJETOS_POS_POOL);
  while(b.label === a.label) b = pick(OBJETOS_POS_POOL);
  const askLeft = Math.random()<0.5;
  const correct = askLeft ? a.label : b.label;
  const opts = shuffle([{label:a.label,value:a.label},{label:b.label,value:b.label}]);
  return {
    promptHTML: '<p class="prompt-count">'+a.emoji+' '+b.emoji+'</p><p class="prompt-hint">¿Qué objeto está a la '+(askLeft?'izquierda':'derecha')+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué objeto está a la '+(askLeft?'izquierda':'derecha')+'?', cols:2, panel:true,
    explain: 'El/la <b>'+correct.toLowerCase()+'</b> está a la '+(askLeft?'izquierda':'derecha')+'.',
  };
}

function genFigura2DG2Round(){
  const item = pick(FIGURAS_2D_G2);
  const distract = FIGURAS_2D_G2.filter(function(s){ return s.id!==item.id; });
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  return {
    promptHTML: '<div class="shape-display">'+shapeSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué figura es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:2, kind:'word', panel:true,
    explain: 'Esta figura es un <b>'+item.label.toLowerCase()+'</b>.',
  };
}

function genSolido3DG2Round(){
  const item = pick(SOLIDOS_3D_G2);
  const distract = SOLIDOS_3D_G2.filter(function(s){ return s.id!==item.id; });
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  return {
    promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:2, kind:'word', panel:true,
    explain: 'Este cuerpo geométrico es '+articuloFigura(item.id)+' <b>'+item.label.toLowerCase()+'</b>.',
  };
}

export function genGeometria2Round(){
  const recurso = 'La geometría de 2° básico junta tres ideas: la <b>posición relativa</b> (izquierda/derecha, un objeto respecto a otro), las <b>figuras 2D</b> (círculo, cuadrado, triángulo, rectángulo — planas, con solo largo y ancho), y los <b>cuerpos 3D</b> (cubo, paralelepípedo, esfera, cono — con volumen, que puedes tomar en tus manos y tienen largo, ancho y alto). La diferencia clave entre 2D y 3D es esa: una figura 2D es plana como un dibujo en una hoja, mientras que un cuerpo 3D ocupa espacio real, como una caja o una pelota. Reconocer estas formas en objetos de tu entorno (una ventana es un rectángulo, un dado es un cubo) te ayuda a ver la geometría en el mundo real, no solo en el papel.';
  const roll = Math.random();
  const r = roll<0.34 ? genPosicionG2Round() : roll<0.67 ? genFigura2DG2Round() : genSolido3DG2Round();
  r.recurso = recurso;
  return r;
}

function genCalendarioG2Round(){
  const item = pick(CALENDARIO_HECHOS);
  const opts = uniqueDistractors(item.correcta, item.min, item.max, item.spread, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
  };
}

function genHoraG2Round(){
  const hour = randInt(1,12);
  const isHalf = Math.random()<0.5;
  const display = String(hour).padStart(2,'0')+':'+(isHalf ? '30' : '00');
  const hourOpts = uniqueDistractors(hour, 1, 12, 3, 4);
  const opts = hourOpts.map(function(h){ return {label: h+(isHalf ? ' y media' : ' en punto'), value: h}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:40px;">'+display+'</p><p class="prompt-hint">¿Qué hora es?</p>',
    options: opts, correctValue: hour, speakText: '¿Qué hora es?', cols:2, panel:true,
    explain: 'Son las '+display+', es decir, las <b>'+hour+(isHalf ? ' y media' : ' en punto')+'</b>.',
  };
}

function genLongitudG2Round(){
  let a = pick(OBJETOS_LONGITUD_G2), b = pick(OBJETOS_LONGITUD_G2);
  while(b.label === a.label || b.valor === a.valor) b = pick(OBJETOS_LONGITUD_G2);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const longer = a.valor>b.valor ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.medida+'.</p><p class="prompt-hint">'+b.emoji+' '+b.label+' mide '+b.medida+'.</p><p class="prompt-hint">¿Cuál es más largo?</p>',
    options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
    explain: longer.label+' mide '+longer.medida+', más que el otro objeto.',
  };
}

export function genMedicion2Round(){
  const recurso = 'Medir significa comparar algo contra una unidad conocida para expresar "cuánto" hay de eso: el <b>calendario</b> mide el tiempo en días, semanas y meses; el <b>reloj</b> mide el tiempo dentro de un día en horas; y una <b>regla o huincha</b> mide la longitud en centímetros o metros. Aunque parezcan temas distintos, todos comparten la misma idea de fondo: elegir una unidad fija (un día, una hora, un centímetro) y contar cuántas veces cabe esa unidad en lo que estás midiendo. Practicar con calendarios, relojes y objetos cotidianos te prepara para usar la medición en situaciones reales, como saber cuánto falta para tu cumpleaños o qué tan largo es tu lápiz.';
  const roll = Math.random();
  const r = roll<0.34 ? genCalendarioG2Round() : roll<0.67 ? genHoraG2Round() : genLongitudG2Round();
  r.recurso = recurso;
  return r;
}

export function genMultiplicarRound(){
  const table = pick([2,5,10]);
  const groups = randInt(2,5);
  const emoji = pick(COUNT_EMOJIS);
  const total = table*groups;
  const groupHTML = [];
  for(let g=0; g<groups; g++){ groupHTML.push('<span class="mgroup">'+new Array(table).fill(emoji).join('')+'</span>'); }
  const opts = uniqueDistractors(total, 1, 100, table, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+groupHTML.join('')+'</p><p class="prompt-hint">'+groups+' grupos de '+table+'. ¿Cuántos hay en total?</p>',
    options: opts,
    correctValue: total,
    speakText: '¿Cuánto es '+groups+' veces '+table+'?',
    cols: 4,
    explain: groups+' grupos de '+table+' es lo mismo que sumar '+table+' '+groups+' veces: <b>'+total+'</b> en total.',
    recurso: 'Multiplicar es una forma más rápida de hacer una suma repetida: en vez de sumar "2+2+2+2" (4 veces), puedes escribir "4 × 2" y significa exactamente lo mismo. Cuando ves varios grupos con la misma cantidad de elementos cada uno, estás viendo una multiplicación en acción: el número de grupos multiplicado por lo que hay en cada grupo te da el total. Aprender las tablas de multiplicar (del 2, el 5 y el 10 primero, por ser las más fáciles de contar salteado) te ahorra tener que sumar uno por uno cada vez, y es una herramienta que usarás en casi toda la matemática que aprenderás después.',
  };
}

/* ---------------- Contenido Matemática 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/3-basico):
   Números -> OA01 (contar salteado hasta 1000), OA02 (leer/representar),
   OA03 (comparar/ordenar), OA05 (valor posicional). Operaciones -> OA06-07
   (suma/resta y familias de operaciones hasta 1000), OA10 (problemas con
   dinero). Multiplicar -> OA08 (tablas completas hasta 10). Dividir -> OA09.
   Fracciones -> OA11. Patrones y Ecuaciones -> OA12-13. Geometría ->
   OA14-16,18 (cuadrícula, cuerpos 3D-2D, ángulos). Medición -> OA19-22
   (línea de tiempo, hora con cuartos/minutos, perímetro, peso). Datos ->
   OA23-26 (encuestas, gráficos de barra, pictogramas, diagramas de puntos).
   Quedan fuera: OA04 (describir ESTRATEGIAS de cálculo mental, un proceso
   propio, no una respuesta de opción múltiple) y OA17 (reconocer traslación/
   reflexión/rotación de una figura, que requiere comparar una imagen
   animada antes/después — no se presta bien a una imagen estática fija). */
export const MATE_MODULES_G3 = [
  {id:'numeros3', label:'Números hasta 1000', open:true, key:'numeros3'},
  {id:'operaciones3', label:'Sumar, Restar y Dinero', open:true, key:'operaciones3'},
  {id:'multiplicar3', label:'Tablas de Multiplicar', open:true, key:'multiplicar3'},
  {id:'dividir3', label:'Dividir', open:true, key:'dividir3'},
  {id:'fracciones3', label:'Fracciones', open:true, key:'fracciones3'},
  {id:'patrones3', label:'Patrones y Ecuaciones', open:true, key:'patrones3'},
  {id:'geometria3', label:'Geometría III', open:true, key:'geometria3'},
  {id:'medicion3', label:'Medición III', open:true, key:'medicion3'},
  {id:'datos3', label:'Datos y Gráficos', open:true, key:'datos3'},
];
export const MATE_POS_G3 = [
  {x:22,y:94},{x:68,y:83},{x:24,y:72},{x:70,y:61},{x:24,y:50},{x:70,y:39},{x:24,y:28},{x:70,y:17},{x:24,y:6}
];

const OBJETOS_PRECIO = [
  { emoji:'🍬', label:'un dulce', precio:100 },
  { emoji:'🖍️', label:'un lápiz de color', precio:300 },
  { emoji:'🧃', label:'un jugo', precio:500 },
  { emoji:'⚽', label:'una pelota', precio:2000 },
  { emoji:'📖', label:'un cuaderno', precio:800 },
  { emoji:'🍎', label:'una manzana', precio:200 },
];
const CUADRICULA_POOL = [
  {emoji:'🐶',label:'Perro'},{emoji:'🐱',label:'Gato'},{emoji:'🌳',label:'Árbol'},{emoji:'🏠',label:'Casa'},{emoji:'⚽',label:'Pelota'},{emoji:'🌸',label:'Flor'},
];
const SOLIDOS_3D_G3 = [
  { id:'cubo', label:'Cubo', caras:6 },
  { id:'paralelepipedo', label:'Paralelepípedo', caras:6 },
  { id:'esfera', label:'Esfera', caras:0 },
  { id:'cono', label:'Cono', caras:1 },
  { id:'cilindro', label:'Cilindro', caras:2 },
  { id:'piramide', label:'Pirámide', caras:5 },
];
const ANGULOS_POOL = ['Recto','Agudo','Obtuso'];
const PERIMETRO_FIGURAS = [
  { lados:[3,3,3,3], label:'un cuadrado de lado 3' },
  { lados:[4,2,4,2], label:'un rectángulo de 4 por 2' },
  { lados:[5,5,5], label:'un triángulo de lado 5' },
  { lados:[6,3,6,3], label:'un rectángulo de 6 por 3' },
];
const PESO_OBJETOS = [
  { emoji:'🍎', label:'una manzana', gramos:150 },
  { emoji:'📖', label:'un libro', gramos:400 },
  { emoji:'🐘', label:'un elefante', gramos:5000000 },
  { emoji:'🎒', label:'una mochila con útiles', gramos:2000 },
  { emoji:'🚗', label:'un auto', gramos:1200000 },
  { emoji:'🍬', label:'un dulce', gramos:5 },
];
const DATOS_ENCUESTA = [
  { pregunta:'¿Cuál es tu fruta favorita?', categorias:[{label:'Manzana',valor:8},{label:'Plátano',valor:5},{label:'Uva',valor:3}] },
  { pregunta:'¿Cuál es tu color favorito?', categorias:[{label:'Azul',valor:9},{label:'Rojo',valor:6},{label:'Verde',valor:4}] },
  { pregunta:'¿Cuál es tu mascota favorita?', categorias:[{label:'Perro',valor:10},{label:'Gato',valor:7},{label:'Pez',valor:2}] },
  { pregunta:'¿Cuál es tu deporte favorito?', categorias:[{label:'Fútbol',valor:12},{label:'Natación',valor:5},{label:'Tenis',valor:3}] },
];

function barChartHTML(categorias){
  const max = Math.max.apply(null, categorias.map(function(c){ return c.valor; }));
  return '<div class="bar-chart">'+categorias.map(function(c){
    const h = Math.round((c.valor/max)*80)+20;
    return '<div class="bar-col"><div class="bar-value">'+c.valor+'</div><div class="bar-fill" style="height:'+h+'px;"></div><div class="bar-label">'+c.label+'</div></div>';
  }).join('')+'</div>';
}

export function genNumeros3Round(){
  const recurso = 'Los números hasta 1000 se organizan en <b>centenas</b> (grupos de 100), <b>decenas</b> (grupos de 10) y <b>unidades</b> (números sueltos del 0 al 9) — por ejemplo, 347 tiene 3 centenas, 4 decenas y 7 unidades. Esta forma de descomponer un número (llamada valor posicional) es la clave para comparar números grandes: primero se compara la cantidad de dígitos, luego la centena, luego la decena. Contar salteado (de 5 en 5, de 10 en 10, de 100 en 100) te ayuda a moverte más rápido entre números grandes sin tener que contar de uno en uno, algo esencial quien empieza a trabajar con números de 3 dígitos.';
  const roll = Math.random();
  if(roll<0.25){
    const step = pick([5,10,100]);
    const startMult = randInt(0, Math.floor(900/step));
    const start = startMult*step;
    const seq = [start, start+step, start+2*step, start+3*step];
    const blankIdx = randInt(1,2);
    const correct = seq[blankIdx];
    const opts = uniqueDistractors(correct, 0, 1000, step, 4).map(function(v){ return {label:String(v), value:v}; });
    const displaySeq = seq.map(function(n,i){ return i===blankIdx ? '<span class="blank">?</span>' : n; }).join(' — ');
    return {
      promptHTML: '<p class="prompt-count" style="letter-spacing:1px;">'+displaySeq+'</p><p class="prompt-hint">¿Qué número falta en la secuencia?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número falta?', cols:4,
      explain: 'La secuencia avanza de <b>'+step+'</b> en <b>'+step+'</b>, así que el número que falta es <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.5){
    let a = randInt(0,999), b = randInt(0,999);
    while(a===b) b = randInt(0,999);
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor, '+a+' o '+b+'?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.',
      recurso: recurso,
    };
  }
  if(roll<0.75){
    const n = randInt(100,999);
    const cien = Math.floor(n/100), dec = Math.floor((n%100)/10), uni = n%10;
    const kind = pick(['CENTENAS','DECENAS','UNIDADES']);
    const correct = kind==='CENTENAS' ? cien : kind==='DECENAS' ? dec : uni;
    const opts = uniqueDistractors(correct, 0, 9, 2, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:40px;">'+n+'</p><p class="prompt-hint">¿Cuántas '+kind.toLowerCase()+' tiene este número?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuántas '+kind.toLowerCase()+' tiene el '+n+'?', cols:4,
      explain: 'El '+n+' tiene <b>'+correct+'</b> '+kind.toLowerCase()+'.',
      recurso: recurso,
    };
  }
  const n = randInt(0,1000);
  const digitos = String(n).length;
  const opts = shuffle(['1 dígito','2 dígitos','3 dígitos','4 dígitos']).map(function(o){ return {label:o, value:o}; });
  const correct = digitos+' dígito'+(digitos>1?'s':'');
  return {
    promptHTML: '<p class="prompt-count" style="font-size:40px;">'+n+'</p><p class="prompt-hint">¿Cuántos dígitos tiene este número?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuántos dígitos tiene el '+n+'?', cols:2, panel:true,
    explain: 'El '+n+' tiene <b>'+correct.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genOperaciones3Round(){
  const recurso = 'Sumar y restar con números de 3 dígitos funciona igual que con números pequeños, solo que hay que ser más ordenado: alinear las centenas con las centenas, las decenas con las decenas y las unidades con las unidades. Un uso muy práctico de la resta es calcular <b>vuelto</b>: si pagas con más dinero del que cuesta algo, el vuelto es la diferencia entre lo que pagaste y el precio real — una resta que probablemente ya haces sin darte cuenta cuando compras algo. Practicar estas operaciones con dinero (pesos chilenos) conecta la matemática de la sala de clases con situaciones que vives todos los días.';
  const roll = Math.random();
  if(roll<0.4){
    const a = randInt(10,500), b = randInt(10,500);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 20, 1000, 20, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' + '+b+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
      explain: a+' + '+b+' = <b>'+sum+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const a = randInt(100,900), b = randInt(10,99);
    const result = a-b;
    const opts = uniqueDistractors(result, 0, 900, 20, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' - '+b+'</p><p class="prompt-hint">¿Cuánto es el resultado?</p>',
      options: opts, correctValue: result, speakText: '¿Cuánto es '+a+' menos '+b+'?', cols:4,
      explain: a+' - '+b+' = <b>'+result+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(OBJETOS_PRECIO);
  const tienes = item.precio + pick([0,50,100,200]);
  const falta = tienes - item.precio;
  const opts = uniqueDistractors(falta, 0, 3000, 100, 4).map(function(v){ return {label:'$'+v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si pagas con $'+tienes+', ¿cuánto vuelto recibes?</p>',
    options: opts, correctValue: falta, speakText: '¿Cuánto vuelto recibes?', cols:4,
    explain: '$'+tienes+' - $'+item.precio+' = <b>$'+falta+'</b> de vuelto.',
    recurso: recurso,
  };
}

export function genMultiplicar3Round(){
  const a = randInt(2,10), b = randInt(2,10);
  const total = a*b;
  const opts = uniqueDistractors(total, 4, 100, a, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:34px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
    options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
    explain: a+' × '+b+' = <b>'+total+'</b>.',
    recurso: 'Saberse las tablas de multiplicar de memoria (del 1 al 10) te ahorra mucho tiempo, porque son operaciones que usarás una y otra vez en el resto de la matemática que aprenderás. Una forma de entenderlas (no solo memorizarlas): multiplicar A × B significa sumar el número A, B veces seguidas — por ejemplo, 4 × 3 es lo mismo que 4+4+4. Practicar las tablas con distintos números, en vez de solo repetir siempre las mismas, es lo que realmente ayuda a que se te queden grabadas para el resto de tu vida escolar.',
  };
}

export function genDividir3Round(){
  const b = randInt(2,10), q = randInt(2,10);
  const total = b*q;
  const opts = uniqueDistractors(q, 1, 10, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Tienes '+total+' objetos y los repartes en grupos de '+b+'. ¿Cuántos grupos se forman?</p>',
    options: opts, correctValue: q, speakText: '¿Cuántos grupos de '+b+' se forman con '+total+'?', cols:4,
    explain: total+' ÷ '+b+' = <b>'+q+'</b> grupos.',
    recurso: 'Dividir es lo opuesto a multiplicar: mientras multiplicar junta grupos iguales en un total, dividir reparte un total en grupos iguales. Por eso, si sabes que 4 × 5 = 20, también sabes que 20 ÷ 4 = 5 y que 20 ÷ 5 = 4 — son la misma relación de números vista desde dos direcciones distintas. Pensar en la división como "repartir en partes iguales" (en vez de memorizarla como una operación separada) te ayuda a resolver problemas reales, como repartir objetos, dinero o comida entre varias personas de forma justa.',
  };
}

export function genFracciones3Round(){
  const den = pick([2,3,4]);
  const num = randInt(1,den-1);
  const distractDens = shuffle([2,3,4].filter(function(d){ return d!==den; }));
  const correct = num+'/'+den;
  const opts = [correct].concat(distractDens.map(function(d){ return num+'/'+d; })).concat([(num+1)+'/'+den]).map(function(f){ return {label:f, value:f}; });
  /* Las fracciones de uso común del currículum (1/2, 1/3, 2/3, 1/4, 2/4,
     3/4) son solo 6 valores posibles — con una sola representación visual
     eso deja menos combinaciones únicas que rounds:8, garantizando una
     repetición cada partida. Alternar círculo/barra para el mismo valor
     duplica la variedad real sin salirse de esas 6 fracciones. */
  const useBarra = Math.random()<0.5;
  const dibujo = useBarra ? fraccionBarraSVG(num,den,110) : fraccionSVG(num,den,110);
  return {
    promptHTML: '<div class="shape-display">'+dibujo+'</div><p class="prompt-hint">¿Qué fracción está coloreada?</p>',
    options: shuffle(opts), correctValue: correct, speakText: '¿Qué fracción está coloreada?', cols:4, kind:'word',
    explain: 'Están coloreadas <b>'+num+' de '+den+'</b> partes, o sea <b>'+correct+'</b>.',
    recurso: 'Una fracción representa una parte de un todo dividido en trozos iguales: el número de abajo (denominador) dice en cuántas partes iguales se dividió el todo, y el número de arriba (numerador) dice cuántas de esas partes estás considerando. Por ejemplo, 3/4 significa que el todo se dividió en 4 partes iguales y tomas 3 de ellas. Practicar con dibujos (círculos o barras coloreadas) te ayuda a "ver" las fracciones de forma concreta antes de trabajar con ellas solo como números, algo que hace mucho más fácil entenderlas de verdad.',
  };
}

export function genPatrones3Round(){
  const recurso = 'Un <b>patrón</b> es una secuencia de números que cambia siguiendo siempre la misma regla (por ejemplo, sumar el mismo número cada vez) — descubrir esa regla te permite predecir qué número viene después, sin que alguien te lo diga. Una <b>ecuación</b> con un número faltante (como "___ + 5 = 12") te pide encontrar qué valor hace que la igualdad sea verdadera, y para resolverla puedes pensar "¿qué número, sumado a 5, da 12?" en vez de adivinar al azar. Ambas habilidades —reconocer patrones y resolver ecuaciones simples— son la base del álgebra que aprenderás en años posteriores.';
  if(Math.random()<0.5){
    const step = randInt(2,9);
    const start = randInt(1,20);
    const seq = [start, start+step, start+2*step, start+3*step];
    const correct = start+4*step;
    const opts = uniqueDistractors(correct, 1, 200, step, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+seq.join(', ')+', <span class="blank">?</span></p><p class="prompt-hint">¿Qué número sigue en el patrón?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número sigue?', cols:4,
      explain: 'El patrón suma <b>'+step+'</b> cada vez, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const a = randInt(1,50), b = randInt(1,50);
  const total = a+b;
  const askA = Math.random()<0.5;
  const correct = askA ? a : b;
  const opts = uniqueDistractors(correct, 0, 100, 5, 4).map(function(v){ return {label:String(v), value:v}; });
  const known = askA ? b : a;
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+(askA?'<span class="blank">?</span>':'') +' + '+known+' = '+total+(!askA?' — <span class="blank">?</span>':'')+'</p><p class="prompt-hint">¿Qué número falta?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué número falta en la ecuación?', cols:4,
    explain: correct+' + '+known+' = '+total+', así que el número que falta es <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genGeometria3Round(){
  const recurso = 'La geometría de 3° básico suma tres ideas nuevas: la <b>cuadrícula</b> permite ubicar un objeto con precisión usando dos números (columna y fila), igual que en un juego de mesa o un mapa; los <b>cuerpos geométricos</b> (pirámide, cubo, esfera) tienen caras, aristas y vértices que los distinguen entre sí; y los <b>ángulos</b> (recto, agudo, obtuso) describen qué tan abierta o cerrada es una esquina o un cruce de líneas — un ángulo recto es como la esquina de una hoja de papel, uno agudo es más cerrado, y uno obtuso es más abierto. Estas tres herramientas te permiten describir con precisión la forma y la posición de las cosas que te rodean.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CUADRICULA_POOL);
    const col = randInt(1,5), row = randInt(1,5);
    const opts = shuffle([col+','+row, (col+1)+','+row, col+','+(row+1), (col+1)+','+(row+1)]).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">El '+item.label.toLowerCase()+' está en la columna '+col+' y la fila '+row+'. ¿Cuál es su posición (columna,fila)?</p>',
      options: opts, correctValue: col+','+row, speakText: '¿Cuál es la posición del '+item.label.toLowerCase()+'?', cols:2, panel:true,
      explain: 'La posición es columna '+col+', fila '+row+', o sea <b>('+col+','+row+')</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(SOLIDOS_3D_G3);
    const distract = shuffle(SOLIDOS_3D_G3.filter(function(s){ return s.id!==item.id; })).slice(0,3);
    const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
      options: opts, correctValue: item.id, speakText: item.label, cols:4, kind:'word',
      explain: 'Este cuerpo geométrico es '+articuloFigura(item.id)+' <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const tipo = pick(ANGULOS_POOL);
  const opts = shuffle(ANGULOS_POOL).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<div class="shape-display">'+anguloSVG(tipo,100)+'</div><p class="prompt-hint">¿Qué tipo de ángulo es?</p>',
    options: opts, correctValue: tipo, speakText: '¿Qué tipo de ángulo es?', cols:4, kind:'word',
    explain: 'Este es un ángulo <b>'+tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genMedicion3Round(){
  const recurso = 'La medición en 3° básico profundiza en 3 herramientas distintas: leer la <b>hora</b> con más precisión (cuartos y medias horas, no solo horas en punto), calcular el <b>perímetro</b> de una figura (sumar la medida de todos sus lados, útil por ejemplo para saber cuánta reja necesitas para cercar un patio), y comparar el <b>peso</b> de distintos objetos. Aunque parecen temas separados, todos comparten la misma lógica de la medición: elegir una unidad conocida (minutos, centímetros, gramos) y usarla para describir "cuánto" hay de algo, de forma que cualquier persona pueda entenderlo igual.';
  const roll = Math.random();
  if(roll<0.34){
    const hour = randInt(1,12);
    const min = pick([0,15,30,45]);
    const display = String(hour).padStart(2,'0')+':'+String(min).padStart(2,'0');
    const labels = {0:' en punto',15:' y cuarto',30:' y media',45:' menos cuarto'};
    /* Para "menos cuarto" (X:45) se nombra la hora SIGUIENTE ("las 3 menos
       cuarto" para las 2:45), no la hora actual — un detalle real del
       español que se pasaba por alto usando `hour` directo. */
    const hourLabel = min===45 ? (hour%12)+1 : hour;
    const correct = display;
    const distractPool = [0,15,30,45].filter(function(m){ return m!==min; }).map(function(m){ return String(hour).padStart(2,'0')+':'+String(m).padStart(2,'0'); });
    const opts = shuffle([correct].concat(shuffle(distractPool).slice(0,3))).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:40px;">'+display+'</p><p class="prompt-hint">¿Cuál reloj digital marca esta misma hora?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué hora es?', cols:2, panel:true,
      explain: 'Son las '+display+', es decir, las '+hourLabel+labels[min]+'.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(PERIMETRO_FIGURAS);
    const perimetro = item.lados.reduce(function(a,b){ return a+b; }, 0);
    const opts = uniqueDistractors(perimetro, 4, 40, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Los lados de '+item.label+' miden: '+item.lados.join(', ')+' (en cm). ¿Cuál es su perímetro?</p>',
      options: opts, correctValue: perimetro, speakText: '¿Cuál es el perímetro?', cols:4,
      explain: 'El perímetro es la suma de todos los lados: '+item.lados.join(' + ')+' = <b>'+perimetro+' cm</b>.',
      recurso: recurso,
    };
  }
  let a = pick(PESO_OBJETOS), b = pick(PESO_OBJETOS);
  while(b.label === a.label) b = pick(PESO_OBJETOS);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const heavier = a.gramos>b.gramos ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estos objetos pesa más?</p>',
    options: opts, correctValue: heavier.label, speakText: '¿Cuál pesa más?', cols:2, panel:true,
    explain: heavier.label.charAt(0).toUpperCase()+heavier.label.slice(1)+' pesa más.',
    recurso: recurso,
  };
}

export function genDatos3Round(){
  const recurso = 'Un <b>gráfico de barras</b> es una forma visual de mostrar los resultados de una encuesta: cada barra representa una opción distinta, y la altura de la barra muestra cuántas personas eligieron esa opción — mientras más alta la barra, más votos tuvo. Leer un gráfico de barras es más rápido que leer una lista de números, porque puedes comparar las alturas a simple vista para saber de inmediato cuál opción ganó o cuál tuvo menos apoyo. Esta habilidad de leer datos organizados visualmente es muy usada en la vida real, desde encuestas escolares hasta noticias y estudios.';
  const item = pick(DATOS_ENCUESTA);
  const roll = Math.random();
  if(roll<0.5){
    const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
    const distract = shuffle(item.categorias.filter(function(c){ return c.label!==maxCat.label; })).map(function(c){ return c.label; });
    const opts = shuffle([maxCat.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál opción tuvo más votos?</p>',
      options: opts, correctValue: maxCat.label, speakText: '¿Cuál opción tuvo más votos?', cols:4, kind:'word',
      explain: '<b>'+maxCat.label+'</b> tuvo '+maxCat.valor+' votos, más que las demás opciones.',
      recurso: recurso,
    };
  }
  const target = pick(item.categorias);
  const opts = uniqueDistractors(target.valor, 0, 20, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuántos votos tuvo la opción "'+target.label+'"?</p>',
    options: opts, correctValue: target.valor, speakText: '¿Cuántos votos tuvo '+target.label+'?', cols:4,
    explain: 'La opción "'+target.label+'" tuvo <b>'+target.valor+'</b> votos.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Matemática 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/4-basico):
   Números hasta 10 000 -> OA01. Sumar, Restar y Dinero -> OA03,04,07 (suma/
   resta hasta 1000, propiedades del 0 y 1, problemas con dinero). Multiplicar
   y Dividir -> OA05-06 (multiplicación de 3 dígitos por 1, división con
   dividendos de 2 dígitos). Fracciones -> OA08-10 (denominadores variados,
   sumar/restar mismo denominador, números mixtos hasta 5). Decimales ->
   OA11-12 (décimos, centésimos, sumar/restar decimales). Patrones y
   Ecuaciones -> OA13-14. Geometría IV -> OA15-17,19 (coordenadas, vistas 3D,
   simetría, ángulos con transportador). Medición IV -> OA20-24 (hora
   AM/PM/24h, conversión de unidades de tiempo, longitud, área, volumen).
   Datos y Probabilidades IV -> OA25-27.
   Quedan fuera: OA02 (describir ESTRATEGIAS de cálculo mental, un proceso
   propio) y OA18 (trasladar/rotar/reflejar una figura, que requiere
   comparar una imagen animada antes/después, igual criterio que excluyó
   OA17 en 3° básico). */
export const MATE_MODULES_G4 = [
  {id:'numeros4', label:'Números hasta 10 000', open:true, key:'numeros4'},
  {id:'operaciones4', label:'Sumar, Restar y Dinero II', open:true, key:'operaciones4'},
  {id:'multiplicardividir4', label:'Multiplicar y Dividir', open:true, key:'multiplicardividir4'},
  {id:'fracciones4', label:'Fracciones II', open:true, key:'fracciones4'},
  {id:'decimales4', label:'Decimales', open:true, key:'decimales4'},
  {id:'patrones4', label:'Patrones y Ecuaciones II', open:true, key:'patrones4'},
  {id:'geometria4', label:'Geometría IV', open:true, key:'geometria4'},
  {id:'medicion4', label:'Medición IV', open:true, key:'medicion4'},
  {id:'datos4', label:'Datos y Probabilidades', open:true, key:'datos4'},
];
export const MATE_POS_G4 = [
  {x:22,y:94},{x:68,y:83},{x:24,y:72},{x:70,y:61},{x:24,y:50},{x:70,y:39},{x:24,y:28},{x:70,y:17},{x:24,y:6}
];

const OBJETOS_PRECIO4 = [
  { emoji:'📚', label:'un libro', precio:3500 },
  { emoji:'🎒', label:'una mochila', precio:8000 },
  { emoji:'⚽', label:'una pelota', precio:4500 },
  { emoji:'🧸', label:'un peluche', precio:6000 },
  { emoji:'🚲', label:'una bicicleta', precio:45000 },
  { emoji:'🎮', label:'un videojuego', precio:12000 },
];
const SOLIDOS_VISTAS_BANK = [
  { id:'cubo', label:'Cubo', frente:'Un cuadrado', lado:'Un cuadrado', arriba:'Un cuadrado' },
  { id:'cono', label:'Cono', frente:'Un triángulo', lado:'Un triángulo', arriba:'Un círculo' },
  { id:'cilindro', label:'Cilindro', frente:'Un rectángulo', lado:'Un rectángulo', arriba:'Un círculo' },
  { id:'esfera', label:'Esfera', frente:'Un círculo', lado:'Un círculo', arriba:'Un círculo' },
  { id:'piramide', label:'Pirámide', frente:'Un triángulo', lado:'Un triángulo', arriba:'Un cuadrado' },
];
const SIMETRIA_BANK = [
  { id:'circulo', label:'Círculo', simetrico:true },
  { id:'cuadrado', label:'Cuadrado', simetrico:true },
  { id:'triangulo', label:'Triángulo (equilátero)', simetrico:true },
  { id:'ovalo', label:'Óvalo', simetrico:true },
  { id:'rombo', label:'Rombo', simetrico:true },
  /* Único caso "NO simétrico" del banco (bug encontrado en la auditoría):
     sin él, las 5 figuras de arriba son simétricas, así que la respuesta
     correcta de este módulo era SIEMPRE "SÍ TIENE LÍNEA DE SIMETRÍA" — la
     opción "NO" nunca podía ser la correcta. Un paralelogramo inclinado
     (no rectángulo, no rombo) es la figura simple más clara sin ninguna
     línea de simetría real. */
  { id:'paralelogramo', label:'Paralelogramo', simetrico:false },
];
const OBJETOS_LONGITUD4 = [
  { emoji:'✏️', label:'El lápiz', cm:15 },
  { emoji:'📏', label:'La regla', cm:30 },
  { emoji:'🚪', label:'La puerta', cm:200 },
  { emoji:'🛏️', label:'La cama', cm:190 },
  { emoji:'🚌', label:'El bus', cm:1000 },
  { emoji:'🏫', label:'La escuela', cm:5000 },
];

export function genNumeros4Round(){
  const recurso = 'Los números hasta 10 000 se organizan en <b>unidades de mil</b> (grupos de 1000), <b>centenas</b> (grupos de 100), <b>decenas</b> (grupos de 10) y <b>unidades</b> — por ejemplo, 4728 tiene 4 unidades de mil, 7 centenas, 2 decenas y 8 unidades. Esta descomposición (llamada valor posicional) sirve para comparar números grandes de forma rápida: basta con mirar, de izquierda a derecha, el primer dígito donde los dos números sean distintos. También es la base para leer un número en voz alta: "cuatro mil setecientos veintiocho" nombra primero los miles y luego el resto, tal como se hace al escribirlo.';
  const roll = Math.random();
  if(roll<0.34){
    /* Los 4 dígitos deben ser distintos entre sí: si dos coinciden (p.ej.
       mil===cien), las "descomposiciones incorrectas" (que intercambian
       posiciones de dígitos) pueden colapsar en el mismo texto que la
       correcta u otra distractora, produciendo opciones duplicadas. */
    let n, mil, cien, dec, uni;
    do{
      n = randInt(1000,9999);
      mil = Math.floor(n/1000); cien = Math.floor((n%1000)/100); dec = Math.floor((n%100)/10); uni = n%10;
    }while(mil===cien || mil===dec || mil===uni || cien===dec || cien===uni || dec===uni);
    const correct = mil+' UNIDADES DE MIL + '+cien+' CENTENAS + '+dec+' DECENAS + '+uni+' UNIDADES';
    const wrong1 = mil+' UNIDADES DE MIL + '+dec+' CENTENAS + '+cien+' DECENAS + '+uni+' UNIDADES';
    const wrong2 = cien+' UNIDADES DE MIL + '+mil+' CENTENAS + '+dec+' DECENAS + '+uni+' UNIDADES';
    const wrong3 = mil+' UNIDADES DE MIL + '+cien+' CENTENAS + '+uni+' DECENAS + '+dec+' UNIDADES';
    const opts = shuffle([correct,wrong1,wrong2,wrong3]).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:40px;">'+n+'</p><p class="prompt-hint">¿Cuál es la descomposición correcta de este número?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la descomposición de '+n+'?', cols:2, panel:true,
      explain: n+' se descompone como <b>'+correct.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    let a = randInt(0,9999), b = randInt(0,9999);
    while(a===b) b = randInt(0,9999);
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor, '+a+' o '+b+'?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.',
      recurso: recurso,
    };
  }
  const n = randInt(1000,9999);
  const opts = shuffle([n, n+randInt(1,50), n-randInt(1,50), n+randInt(100,300)]).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estos números se lee "'+numeroALetras(n)+'"?</p>',
    options: opts, correctValue: n, speakText: '¿Cuál número es '+numeroALetras(n)+'?', cols:2, panel:true,
    explain: 'El número es <b>'+n+'</b>.',
    recurso: recurso,
  };
}

function numeroALetras(n){
  const mil = Math.floor(n/1000), resto = n%1000;
  let s = mil>0 ? (mil===1?'mil':mil+' mil') : '';
  if(resto>0) s += (s?' ':'')+resto;
  return s;
}

export function genOperaciones4Round(){
  const recurso = 'Sumar y restar con números más grandes usa la misma idea que con números chicos, solo que ahora hay que ordenar bien las centenas, decenas y unidades antes de operar. Dos propiedades muy útiles: cualquier número <b>+ 0</b> queda igual (el 0 es el "elemento neutro" de la suma) y cualquier número <b>× 1</b> también queda igual (el 1 es el "elemento neutro" de la multiplicación) — no cambian nada porque no agregan ni quitan cantidad. El dinero es un ejemplo perfecto de resta en la vida real: cuando pagas con un billete más grande que el precio, el vuelto que te devuelven es justamente la diferencia entre lo que pagaste y lo que costó.';
  const roll = Math.random();
  if(roll<0.34){
    const a = randInt(100,900), b = randInt(10,99);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 100, 1200, 20, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' + '+b+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
      explain: a+' + '+b+' = <b>'+sum+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const n = randInt(1,20);
    const usaCero = Math.random()<0.5;
    const correct = n;
    const pregunta = usaCero ? '¿Cuánto es '+n+' + 0?' : '¿Cuánto es '+n+' × 1?';
    const opts = uniqueDistractors(correct, 0, 40, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+pregunta+'</p>',
      options: opts, correctValue: correct, speakText: pregunta, cols:4,
      explain: usaCero ? 'Cualquier número más 0 da el mismo número: <b>'+n+'</b>.' : 'Cualquier número multiplicado por 1 da el mismo número: <b>'+n+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(OBJETOS_PRECIO4);
  const tienes = item.precio + pick([0,500,1000,2000]);
  const falta = tienes - item.precio;
  const opts = uniqueDistractors(falta, 0, 20000, 500, 4).map(function(v){ return {label:'$'+v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si pagas con $'+tienes+', ¿cuánto vuelto recibes?</p>',
    options: opts, correctValue: falta, speakText: '¿Cuánto vuelto recibes?', cols:4,
    explain: '$'+tienes+' - $'+item.precio+' = <b>$'+falta+'</b> de vuelto.',
    recurso: recurso,
  };
}

export function genMultiplicarDividir4Round(){
  const recurso = 'Multiplicar un número de 3 dígitos por uno de 1 dígito es, en el fondo, sumar ese número varias veces — la multiplicación solo lo hace más rápido cuando los grupos son grandes. La <b>división</b> es la operación contraria: si multiplicar junta grupos iguales, dividir los reparte. Cuando divides un total en grupos de un tamaño fijo, la pregunta es "¿cuántos grupos completos se forman?" — y esa respuesta es exactamente lo que multiplicación y división comparten: si 6 × 4 = 24, entonces 24 ÷ 6 = 4 y 24 ÷ 4 = 6. Por eso se dice que multiplicar y dividir son operaciones inversas: una deshace lo que hace la otra.';
  if(Math.random()<0.5){
    const a = randInt(100,300), b = randInt(2,9);
    const total = a*b;
    const opts = uniqueDistractors(total, 100, 3000, 50, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
      explain: a+' × '+b+' = <b>'+total+'</b>.',
      recurso: recurso,
    };
  }
  const b = randInt(2,9), q = randInt(10,20);
  const total = b*q;
  const opts = uniqueDistractors(q, 5, 40, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Tienes '+total+' objetos y los repartes en grupos de '+b+'. ¿Cuántos grupos se forman?</p>',
    options: opts, correctValue: q, speakText: '¿Cuántos grupos de '+b+' se forman con '+total+'?', cols:4,
    explain: total+' ÷ '+b+' = <b>'+q+'</b> grupos.',
    recurso: recurso,
  };
}

export function genFracciones4Round(){
  const recurso = 'Una <b>fracción</b> representa una parte de un todo dividido en trozos iguales: el número de abajo (denominador) dice en cuántos trozos se dividió el todo, y el número de arriba (numerador) dice cuántos de esos trozos estás tomando. Para sumar dos fracciones que tienen el <b>mismo denominador</b>, solo se suman los numeradores y el denominador se queda igual — porque los trozos ya son del mismo tamaño, no hace falta convertir nada. Un <b>número mixto</b> (como 2 y 3/4) combina un número entero con una fracción, y sirve para representar cantidades que pasan de "un todo completo" pero no llegan a completar el siguiente: por ejemplo, 2 pizzas enteras más 3/4 de otra pizza.';
  const roll = Math.random();
  if(roll<0.4){
    const den = pick([2,3,4,5,6]);
    const num = randInt(1,den-1);
    const correct = num+'/'+den;
    const useBarra = Math.random()<0.5;
    const dibujo = useBarra ? fraccionBarraSVG(num,den,110) : fraccionSVG(num,den,110);
    const distractDens = shuffle([2,3,4,5,6].filter(function(d){ return d!==den; })).slice(0,2);
    const opts = shuffle([correct].concat(distractDens.map(function(d){ return num+'/'+d; })).concat([(num+1)+'/'+den])).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<div class="shape-display">'+dibujo+'</div><p class="prompt-hint">¿Qué fracción está coloreada?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué fracción está coloreada?', cols:4, kind:'word',
      explain: 'Están coloreadas <b>'+num+' de '+den+'</b> partes, o sea <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const den = pick([3,4,5,6]);
    const a = randInt(1,den-2), b = randInt(1,den-a-1);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 1, den, 1, Math.min(4,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+'/'+den+' + '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum+'/'+den, speakText: '¿Cuánto es '+a+'/'+den+' más '+b+'/'+den+'?', cols:4,
      explain: a+'/'+den+' + '+b+'/'+den+' = <b>'+sum+'/'+den+'</b> (se suman los numeradores, el denominador no cambia).',
      recurso: recurso,
    };
  }
  const entero = randInt(1,4);
  const den = pick([2,3,4]);
  const num = randInt(1,den-1);
  const correct = entero+' Y '+num+'/'+den;
  /* Cuando el numerador es justo la mitad del denominador (p.ej. 1/2, 2/4),
     "den-num" da el mismo numerador que el correcto — ese distractor
     colapsaría con la respuesta correcta. En ese caso se usa una fracción
     invertida (denominador/numerador) como distractor en su lugar. */
  const segundoDistractor = (den-num)!==num ? entero+' Y '+(den-num)+'/'+den : entero+' Y '+den+'/'+num;
  const distract = shuffle([
    (entero+1)+' Y '+num+'/'+den,
    segundoDistractor,
    (entero-1>=0?entero-1:entero+2)+' Y '+num+'/'+den,
  ]);
  const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cómo se escribe el número mixto formado por '+entero+' enteros y '+num+'/'+den+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Cómo se escribe '+entero+' enteros y '+num+'/'+den+'?', cols:2, panel:true,
    explain: 'Se escribe <b>'+correct+'</b>: primero el número entero, luego la fracción.',
    recurso: recurso,
  };
}

export function genDecimales4Round(){
  const recurso = 'Un número <b>decimal</b> es una forma distinta de escribir una fracción: los <b>décimos</b> (0,1; 0,2...) representan un todo dividido en 10 partes iguales, igual que una fracción con denominador 10 — por eso 0,3 y 3/10 significan exactamente lo mismo. La coma decimal separa la parte entera (a la izquierda) de la parte que es menor que un entero (a la derecha). Para sumar decimales, se alinean las comas una debajo de la otra y se suma como con números normales, columna por columna, igual que se hace con centenas, decenas y unidades. Los decimales se usan todos los días, por ejemplo en el dinero: $1,50 significa un peso con 50 centésimos.';
  if(Math.random()<0.5){
    const decimas = randInt(1,9);
    const correct = '0,'+decimas;
    const opts = uniqueDistractors(decimas, 1, 9, 2, 4).map(function(v){ return {label:'0,'+v, value:'0,'+v}; });
    return {
      promptHTML: '<div class="shape-display">'+fraccionBarraSVG(decimas,10,110)+'</div><p class="prompt-hint">¿Qué número decimal representa esta barra (en décimos)?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué decimal representa esta barra?', cols:4,
      explain: decimas+' de 10 partes coloreadas es <b>'+correct+'</b> (‘'+decimas+' décimos’).',
      recurso: recurso,
    };
  }
  const a = randInt(1,50)/10, b = randInt(1,40)/10;
  const sum = Math.round((a+b)*10)/10;
  const opts = uniqueDistractors(Math.round(sum*10), 1, 100, 5, 4).map(function(v){ return {label:(v/10).toFixed(1).replace('.',','), value:(v/10).toFixed(1).replace('.',',')}; });
  const correctLabel = sum.toFixed(1).replace('.',',');
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a.toFixed(1).replace('.',',')+' + '+b.toFixed(1).replace('.',',')+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts, correctValue: correctLabel, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
    explain: a.toFixed(1).replace('.',',')+' + '+b.toFixed(1).replace('.',',')+' = <b>'+correctLabel+'</b>.',
    recurso: recurso,
  };
}

export function genPatrones4Round(){
  const recurso = 'Un <b>patrón numérico</b> es una secuencia de números que sigue siempre la misma regla — por ejemplo, sumar la misma cantidad cada vez. Para descubrir qué número sigue, primero hay que encontrar la regla: mira la diferencia entre dos números seguidos que ya conoces, y esa diferencia se repite en toda la secuencia. Una <b>ecuación</b> con un espacio en blanco (como ? + 5 = 12) es una pregunta que pide encontrar el número que falta para que la igualdad sea verdadera — se puede resolver pensando "¿qué número más 5 da 12?" o haciendo la operación contraria (12 − 5). Reconocer patrones y resolver ecuaciones simples es la puerta de entrada al álgebra, que estudiarás en años más avanzados.';
  if(Math.random()<0.5){
    const step = randInt(3,15);
    const start = randInt(1,50);
    const seq = [start, start+step, start+2*step, start+3*step];
    const correct = start+4*step;
    const opts = uniqueDistractors(correct, 1, 300, step, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+seq.join(', ')+', <span class="blank">?</span></p><p class="prompt-hint">¿Qué número sigue en el patrón?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número sigue?', cols:4,
      explain: 'El patrón suma <b>'+step+'</b> cada vez, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const a = randInt(5,80), b = randInt(1,40);
  const total = a+b;
  const askA = Math.random()<0.5;
  const correct = askA ? a : b;
  const known = askA ? b : a;
  const opts = uniqueDistractors(correct, 0, 120, 8, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;"><span class="blank">?</span> + '+known+' = '+total+'</p><p class="prompt-hint">¿Qué número falta?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué número falta en la ecuación?', cols:4,
    explain: correct+' + '+known+' = '+total+', así que el número que falta es <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genGeometria4Round(){
  const recurso = 'Un cuerpo geométrico 3D se puede describir de varias formas: por sus <b>coordenadas</b> en una cuadrícula (columna y fila, que dicen exactamente dónde está un punto), por sus <b>vistas</b> (qué forma se ve si lo miras de frente, de lado o desde arriba — un cubo siempre se ve cuadrado sin importar el ángulo, pero un cono se ve triángulo de frente y círculo desde arriba), o por su <b>simetría</b> (si al doblar una figura por la mitad, ambos lados coinciden exactamente). Los <b>ángulos</b> miden qué tan abierta o cerrada está una esquina, y se clasifican en agudo (más cerrado que una escuadra), recto (exactamente como una escuadra) y obtuso (más abierto que una escuadra).';
  const roll = Math.random();
  if(roll<0.25){
    const col = randInt(1,10), row = randInt(1,10);
    const opts = shuffle([col+','+row, (col+1)+','+row, col+','+(row+1), (col+2)+','+(row+1)]).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-hint">Un punto está ubicado en la coordenada (columna, fila) = ('+col+', '+row+'). Si avanzas 1 columna hacia la derecha, ¿cuál es la nueva coordenada?</p>',
      options: opts, correctValue: (col+1)+','+row, speakText: '¿Cuál es la nueva coordenada?', cols:2, panel:true,
      explain: 'Avanzar 1 columna a la derecha cambia solo el primer número: ('+(col+1)+', '+row+').',
      recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(SOLIDOS_VISTAS_BANK);
    const vista = pick(['frente','lado','arriba']);
    const correct = item[vista];
    const distract = shuffle(['Un cuadrado','Un círculo','Un triángulo','Un rectángulo'].filter(function(v){ return v!==correct; })).slice(0,3);
    const opts = shuffle([correct].concat(distract)).map(function(v){ return {label:v, value:v}; });
    const vistaLabel = vista==='frente'?'de frente':vista==='lado'?'de lado':'desde arriba';
    const art = articuloFigura(item.id);
    const participio = art==='una' ? 'vista' : 'visto';
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">Si miras este cuerpo geométrico '+vistaLabel.toLowerCase()+', ¿qué forma ves?</p>',
      options: opts, correctValue: correct, speakText: 'Si miras este cuerpo '+vistaLabel.toLowerCase()+', ¿qué forma ves?', cols:2, kind:'word', panel:true,
      explain: art+' '+item.label.toLowerCase()+' '+participio+' '+vistaLabel.toLowerCase()+' se ve como <b>'+correct.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.75){
    const item = pick(SIMETRIA_BANK);
    const opts = shuffle([{label:'Sí tiene línea de simetría', value:true},{label:'No tiene línea de simetría', value:false}]);
    const art = articuloFigura(item.id);
    const dibujo = item.id==='paralelogramo' ? paralelogramoSVG(100) : shapeSVG(item.id,100);
    return {
      promptHTML: '<div class="shape-display">'+dibujo+'</div><p class="prompt-hint">Si doblaras esta figura por la mitad, ¿los dos lados coinciden exactamente?</p>',
      options: opts, correctValue: item.simetrico, speakText: '¿Esta figura tiene una línea de simetría?', cols:2, panel:true,
      explain: item.simetrico ? art+' '+item.label.toLowerCase()+' sí tiene línea de simetría: al doblarlo por la mitad, ambos lados coinciden.' : art+' '+item.label.toLowerCase()+' no tiene línea de simetría en este caso.',
      recurso: recurso,
    };
  }
  const tipoA = pick(ANGULOS_POOL);
  let tipoB = pick(ANGULOS_POOL);
  while(tipoB===tipoA) tipoB = pick(ANGULOS_POOL);
  const gradosMap = {Recto:90, Agudo:45, Obtuso:130};
  const mayor = gradosMap[tipoA]>gradosMap[tipoB] ? 'A' : 'B';
  const opts = shuffle([{label:'Ángulo A', value:'A'},{label:'Ángulo B', value:'B'}]);
  return {
    promptHTML: '<div class="compare-row"><div class="compare-col"><span>Ángulo A</span>'+anguloSVG(tipoA,90)+'</div><div class="compare-col"><span>Ángulo B</span>'+anguloSVG(tipoB,90)+'</div></div><p class="prompt-hint">¿Cuál ángulo es mayor?</p>',
    options: opts, correctValue: mayor, speakText: '¿Cuál ángulo es mayor?', cols:2, panel:true,
    explain: 'El ángulo '+mayor+' ('+ (mayor==='A'?tipoA:tipoB).toLowerCase() +') es mayor.',
    recurso: recurso,
  };
}

const HORA_AMPM_BANK = [
  { hora:'08:00', descripcion:'Vas al colegio en la mañana', correcto:'8:00 A.M.' },
  { hora:'14:00', descripcion:'Almuerzas después del mediodía', correcto:'2:00 P.M.' },
  { hora:'20:00', descripcion:'Cenas en la noche', correcto:'8:00 P.M.' },
  { hora:'06:00', descripcion:'Te despiertas muy temprano', correcto:'6:00 A.M.' },
  { hora:'22:00', descripcion:'Te vas a dormir en la noche', correcto:'10:00 P.M.' },
];
const CONVERSION_TIEMPO_BANK = [
  { pregunta:'¿Cuántos minutos tiene 1 hora?', correcta:60, opts:[100,24,30] },
  { pregunta:'¿Cuántas horas tiene 1 día?', correcta:24, opts:[60,12,100] },
  { pregunta:'¿Cuántos segundos tiene 1 minuto?', correcta:60, opts:[100,24,10] },
  { pregunta:'¿Cuántos días tiene aproximadamente 1 mes?', correcta:30, opts:[24,60,7] },
  { pregunta:'¿Cuántos meses tiene 1 año?', correcta:12, opts:[24,30,52] },
];

export function genMedicion4Round(){
  const recurso = 'Medir en 4° básico junta varias ideas: el reloj de <b>24 horas</b> (usado en muchos relojes digitales y horarios de buses/aviones) se puede convertir al formato A.M./P.M. de 12 horas que usamos para hablar — las horas de 13 a 23 restan 12 para pasar a P.M. (14:00 = 2:00 P.M.). También se puede convertir entre unidades de tiempo (60 minutos = 1 hora, 24 horas = 1 día) y de longitud (100 centímetros = 1 metro). El <b>área</b> de un rectángulo es el espacio que cubre su superficie, y se calcula multiplicando largo × ancho; el <b>volumen</b> de una caja es el espacio que ocupa por dentro, y se calcula multiplicando largo × ancho × alto — una dimensión más que el área, porque el volumen mide un espacio en 3 direcciones en vez de 2.';
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(HORA_AMPM_BANK);
    const distract = shuffle(HORA_AMPM_BANK.filter(function(h){ return h.correcto!==item.correcto; })).slice(0,3).map(function(h){ return h.correcto; });
    const opts = shuffle([item.correcto].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.descripcion+' — el reloj de 24 horas marca '+item.hora+'. ¿Cómo se escribe esa hora con A.M./P.M.?</p>',
      options: opts, correctValue: item.correcto, speakText: item.descripcion, cols:2, kind:'word',
      explain: 'Las '+item.hora+' en formato 24 horas se escriben <b>'+item.correcto+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.4){
    const item = pick(CONVERSION_TIEMPO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.6){
    let a = pick(OBJETOS_LONGITUD4), b = pick(OBJETOS_LONGITUD4);
    while(b.label===a.label) b = pick(OBJETOS_LONGITUD4);
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    const longer = a.cm>b.cm ? a : b;
    return {
      promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.cm+' cm.</p><p class="prompt-hint">'+b.emoji+' '+b.label+' mide '+b.cm+' cm.</p><p class="prompt-hint">¿Cuál es más largo?</p>',
      options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
      explain: longer.label+' mide '+longer.cm+' cm, más que el otro objeto.',
      recurso: recurso,
    };
  }
  if(roll<0.8){
    const largo = randInt(3,10), ancho = randInt(2,8);
    const area = largo*ancho;
    const opts = uniqueDistractors(area, 4, 100, 6, 4).map(function(v){ return {label:v+' unidades cuadradas', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un rectángulo mide '+largo+' unidades de largo y '+ancho+' unidades de ancho. ¿Cuál es su área?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área del rectángulo?', cols:2,
      explain: 'El área es largo × ancho: '+largo+' × '+ancho+' = <b>'+area+' unidades cuadradas</b>.',
      recurso: recurso,
    };
  }
  const l = randInt(2,5), a = randInt(2,4), h = randInt(2,4);
  const vol = l*a*h;
  const opts = uniqueDistractors(vol, 4, 150, 8, 4).map(function(v){ return {label:v+' cubos', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Una caja se llena con cubos pequeños: '+l+' de largo, '+a+' de ancho y '+h+' de alto. ¿Cuántos cubos caben en total?</p>',
    options: opts, correctValue: vol, speakText: '¿Cuántos cubos caben en la caja?', cols:2,
    explain: 'El volumen es largo × ancho × alto: '+l+' × '+a+' × '+h+' = <b>'+vol+' cubos</b>.',
    recurso: recurso,
  };
}

const EXPERIMENTOS_ALEATORIOS_BANK = [
  { pregunta:'Si lanzas una moneda al aire, ¿cuáles son los resultados posibles?', correcta:'Cara o sello', opts:['Solo cara','Solo sello','Ninguno de los dos'] },
  { pregunta:'Si lanzas un dado normal de 6 caras, ¿cuál es el mayor número que puede salir?', correcta:'6', opts:['4','8','10'] },
  { pregunta:'Si tienes una bolsa con 3 bolitas rojas y 1 azul, ¿de qué color es más probable sacar una bolita?', correcta:'Roja', opts:['Azul','Verde','Igual de probable'] },
  { pregunta:'Si lanzas una moneda 10 veces, ¿es seguro que salgan exactamente 5 caras y 5 sellos?', correcta:'No, es solo una posibilidad, no una certeza', opts:['Sí, siempre será exacto','Solo saldrán caras','Solo saldrán sellos'] },
];

export function genDatos4Round(){
  const recurso = 'Una <b>encuesta</b> junta las respuestas de varias personas sobre una misma pregunta, y un <b>gráfico de barras</b> muestra esas respuestas de forma visual: mientras más alta la barra, más personas eligieron esa opción — así se puede ver de un vistazo cuál opción ganó (la barra más alta) y cuál perdió (la más baja), y sumando todas las barras se obtiene el total de personas encuestadas. La <b>probabilidad</b> estudia qué tan posible es que ocurra algo al azar: lanzar una moneda tiene solo 2 resultados posibles (cara o sello), y si una bolsa tiene más bolitas de un color que de otro, es más probable sacar ese color — aunque nunca es una certeza, solo una posibilidad más alta.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const opts = uniqueDistractors(total, 5, 60, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuántas personas respondieron la encuesta en total?</p>',
      options: opts, correctValue: total, speakText: '¿Cuántas personas respondieron en total?', cols:4,
      explain: 'Sumando todas las categorías: '+item.categorias.map(function(c){ return c.valor; }).join(' + ')+' = <b>'+total+'</b> personas en total.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(EXPERIMENTOS_ALEATORIOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(DATOS_ENCUESTA);
  const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
  const minCat = item.categorias.reduce(function(a,b){ return b.valor<a.valor ? b : a; });
  const askMax = Math.random()<0.5;
  const correct = askMax ? maxCat.label : minCat.label;
  const distract = item.categorias.filter(function(c){ return c.label!==correct; }).map(function(c){ return c.label; });
  const opts = shuffle([correct].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál opción tuvo '+(askMax?'más':'menos')+' votos?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál opción tuvo '+(askMax?'más':'menos')+' votos?', cols:4, kind:'word',
    explain: '<b>'+correct+'</b> tuvo la '+(askMax?'mayor':'menor')+' cantidad de votos.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Matemática 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/5-basico). El currículum de 5° básico tiene 27 OA
   (más que 3°/4° básico), así que se agrupan en 10 módulos temáticos, mismo
   criterio de consolidación ya usado en años anteriores:
   Números Grandes -> OA01. Multiplicar -> OA02-03. Dividir -> OA04.
   Operaciones y Dinero -> OA05-06. Fracciones III -> OA07-09. Decimales II ->
   OA10-13. Patrones y Ecuaciones III -> OA14-15. Geometría V -> OA16-18
   (incluye congruencia/traslación-reflexión-rotación como preguntas de
   identificar el concepto, no de comparar imágenes antes/después). Medición
   y Área -> OA19-22. Datos y Probabilidades III -> OA23-27 (incluye
   diagrama de tallo y hojas, mostrado como tabla HTML simple). */
export const MATE_MODULES_G5 = [
  {id:'numeros5', label:'Números Grandes', open:true, key:'numeros5'},
  {id:'multiplicar5', label:'Multiplicar', open:true, key:'multiplicar5'},
  {id:'dividir5', label:'Dividir', open:true, key:'dividir5'},
  {id:'operaciones5', label:'Operaciones y Dinero', open:true, key:'operaciones5'},
  {id:'fracciones5', label:'Fracciones III', open:true, key:'fracciones5'},
  {id:'decimales5', label:'Decimales II', open:true, key:'decimales5'},
  {id:'patrones5', label:'Patrones y Ecuaciones III', open:true, key:'patrones5'},
  {id:'geometria5', label:'Geometría V', open:true, key:'geometria5'},
  {id:'medicion5', label:'Medición y Área', open:true, key:'medicion5'},
  {id:'datos5', label:'Datos y Probabilidades III', open:true, key:'datos5'},
];
export const MATE_POS_G5 = [
  {x:20,y:94},{x:64,y:88},{x:24,y:76},{x:66,y:66},{x:20,y:56},
  {x:64,y:46},{x:24,y:36},{x:66,y:26},{x:20,y:16},{x:64,y:6},
];

export function genNumeros5Round(){
  const recurso = 'Los números hasta 900 millones se leen por <b>tramos de a tres cifras</b>: unidades, luego miles, luego millones — así 235.480.917 se lee "doscientos treinta y cinco millones, cuatrocientos ochenta mil, novecientos diecisiete". Cada posición vale 10 veces la de su derecha: una <b>centena de millón</b> vale 100.000.000, una <b>decena de millón</b> vale 10.000.000 y una <b>unidad de millón</b> vale 1.000.000. Para comparar dos números grandes, primero se cuenta cuántas cifras tiene cada uno (el que tiene más cifras es mayor); si tienen la misma cantidad, se comparan dígito por dígito de izquierda a derecha hasta encontrar una diferencia. Entender el valor posicional es la base para sumar, restar, multiplicar y dividir números grandes sin equivocarse.';
  const roll = Math.random();
  if(roll<0.34){
    const n = randInt(100000, 900000000);
    const opts = uniqueDistractors(n, 100000, 999999999, Math.max(1000,Math.floor(n*0.02)), 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es igual a '+n+'?</p>',
      options: opts, correctValue: n, speakText: '¿Cuál número es igual a '+n+'?', cols:2, panel:true,
      explain: 'El número correcto es <b>'+n+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    let a = randInt(100000,900000000), b = randInt(100000,900000000);
    while(a===b) b = randInt(100000,900000000);
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.', recurso: recurso,
    };
  }
  const centena = randInt(1,9)*100000000 + randInt(0,9)*10000000;
  const n = centena + randInt(0,9999999);
  const cifraPos = pick(['CENTENA DE MILLÓN','DECENA DE MILLÓN','UNIDAD DE MILLÓN']);
  const digitos = String(n).padStart(9,'0').split('').map(Number);
  const posIdx = {'CENTENA DE MILLÓN':0,'DECENA DE MILLÓN':1,'UNIDAD DE MILLÓN':2}[cifraPos];
  const correct = digitos[posIdx];
  const opts = uniqueDistractors(correct, 0, 9, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:32px;">'+n+'</p><p class="prompt-hint">¿Qué dígito ocupa la posición de las '+cifraPos.toLowerCase()+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué dígito ocupa la posición de las '+cifraPos.toLowerCase()+'?', cols:4,
    explain: 'El dígito en esa posición es <b>'+correct+'</b>.', recurso: recurso,
  };
}

export function genMultiplicar5Round(){
  const recurso = 'Para multiplicar dos números de dos cifras se puede usar el <b>cálculo mental</b>: descomponer un número en partes fáciles (por ejemplo 23 = 20 + 3) y multiplicar cada parte por separado, sumando después los resultados — esto se llama <b>propiedad distributiva</b>. También ayuda apoyarse en multiplicaciones "amigas" que ya se saben, como los múltiplos de 10 (7 × 10 = 70), para deducir otras cercanas (7 × 9 = 70 - 7 = 63). Practicar estas estrategias hace que multiplicar números más grandes sea más rápido y con menos errores que solo memorizar tablas.';
  if(Math.random()<0.5){
    const a = randInt(11,40), b = randInt(11,40);
    const total = a*b;
    const opts = uniqueDistractors(total, 100, 2000, 40, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
      explain: a+' × '+b+' = <b>'+total+'</b>.', recurso: recurso,
    };
  }
  const a = pick([2,4,5,10,20,25,50]);
  const b = randInt(3,9);
  const facil = a*10;
  const total = a*b;
  const opts = uniqueDistractors(total, 6, 900, 20, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Usando cálculo mental: si '+a+' × 10 = '+facil+', ¿cuánto es '+a+' × '+b+'?</p>',
    options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
    explain: 'Puedes usar la propiedad distributiva: '+a+' × '+b+' = <b>'+total+'</b>.', recurso: recurso,
  };
}

export function genDividir5Round(){
  const recurso = 'En una división, el <b>dividendo</b> es el número que se reparte, el <b>divisor</b> es en cuántas partes se reparte, el <b>cociente</b> es el resultado de cada parte, y el <b>resto</b> es lo que sobra sin poder repartirse en partes iguales. El resto SIEMPRE debe ser menor que el divisor — si al dividir te queda un resto igual o mayor que el divisor, significa que el cociente todavía puede subir un poco más. Para comprobar que una división está bien hecha, se usa la fórmula: divisor × cociente + resto = dividendo.';
  const divisor = randInt(2,9);
  const cociente = randInt(11,99);
  const resto = randInt(0,divisor-1);
  const dividendo = divisor*cociente + resto;
  if(Math.random()<0.5){
    const opts = uniqueDistractors(cociente, 10, 300, 8, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+dividendo+' ÷ '+divisor+' = ?  (sin considerar el resto)</p>',
      options: opts, correctValue: cociente, speakText: '¿Cuánto es '+dividendo+' dividido '+divisor+'?', cols:4,
      explain: dividendo+' ÷ '+divisor+' = <b>'+cociente+'</b>, con resto '+resto+'.', recurso: recurso,
    };
  }
  const opts = uniqueDistractors(resto, 0, divisor-1, 1, Math.min(4,divisor)).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Al dividir '+dividendo+' ÷ '+divisor+', el cociente es '+cociente+'. ¿Cuál es el resto?</p>',
    options: opts, correctValue: resto, speakText: '¿Cuál es el resto de '+dividendo+' dividido '+divisor+'?', cols:4,
    explain: divisor+' × '+cociente+' = '+(divisor*cociente)+', y '+dividendo+' - '+(divisor*cociente)+' = <b>'+resto+'</b> de resto.', recurso: recurso,
  };
}

const OBJETOS_PRECIO5 = [
  { emoji:'📚', label:'El libro', precio:4500 },
  { emoji:'🎒', label:'La mochila', precio:12000 },
  { emoji:'⚽', label:'El balón', precio:8000 },
  { emoji:'🧸', label:'El peluche', precio:6500 },
  { emoji:'🎨', label:'El set de pintura', precio:5000 },
];
export function genOperaciones5Round(){
  const recurso = 'Cuando una operación combina sumas, restas, multiplicaciones y divisiones, el <b>orden de las operaciones</b> dice qué se calcula primero: (1) lo que está dentro de un paréntesis, (2) las multiplicaciones y divisiones (de izquierda a derecha), y (3) al final las sumas y restas. Seguir este orden evita que dos personas obtengan resultados distintos para la misma operación. Este mismo orden se usa al resolver problemas de dinero: primero se calcula el costo total (precio × cantidad) y luego se suma o resta según lo que pida el problema.';
  const roll = Math.random();
  if(roll<0.34){
    const a = randInt(10,90), b = randInt(2,9), c = randInt(1,20);
    const conParentesis = Math.random()<0.5;
    const correct = conParentesis ? (a+b)*c - 5 : a + b*c - 5;
    const promptTxt = conParentesis ? '('+a+' + '+b+') × '+c+' - 5' : a+' + '+b+' × '+c+' - 5';
    const opts = uniqueDistractors(correct, 0, 3000, 15, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">'+promptTxt+'</p><p class="prompt-hint">¿Cuánto es? (recuerda: primero paréntesis, luego multiplicación/división, y por último suma/resta)</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+promptTxt+'?', cols:4,
      explain: promptTxt+' = <b>'+correct+'</b>, respetando el orden de las operaciones.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(OBJETOS_PRECIO5);
    const cantidad = randInt(2,5);
    const total = item.precio*cantidad;
    const opts = uniqueDistractors(total, 1000, 80000, 1000, 4).map(function(v){ return {label:'$'+v, value:v}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si compras '+cantidad+', ¿cuánto pagas en total?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto pagas por '+cantidad+' de '+item.label+'?', cols:4,
      explain: '$'+item.precio+' × '+cantidad+' = <b>$'+total+'</b> en total.', recurso: recurso,
    };
  }
  const item = pick(OBJETOS_PRECIO5);
  const tienes = item.precio + pick([500,1000,2000,3000]);
  const falta = tienes - item.precio;
  const opts = uniqueDistractors(falta, 0, 20000, 500, 4).map(function(v){ return {label:'$'+v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si pagas con $'+tienes+', ¿cuánto vuelto recibes?</p>',
    options: opts, correctValue: falta, speakText: '¿Cuánto vuelto recibes?', cols:4,
    explain: '$'+tienes+' - $'+item.precio+' = <b>$'+falta+'</b> de vuelto.', recurso: recurso,
  };
}

export function genFracciones5Round(){
  const recurso = 'Una fracción es <b>propia</b> cuando el numerador (número de arriba) es menor que el denominador (número de abajo) — representa "menos de un entero completo", como 2/5. Es <b>impropia</b> cuando el numerador es igual o mayor que el denominador — representa "un entero completo o más", como 7/4. Para sumar o restar fracciones que ya tienen el <b>mismo denominador</b>, se suman o restan solo los numeradores y el denominador se mantiene igual — porque están repartidas en partes del mismo tamaño, solo cambia cuántas partes se tienen.';
  const roll = Math.random();
  if(roll<0.25){
    const den = pick([3,4,5,6,7,8]);
    const num = randInt(1,den-1);
    const correct = 'Fracción propia';
    const opts = shuffle([{label:'Fracción propia', value:'Fracción propia'},{label:'Fracción impropia', value:'Fracción impropia'}]);
    return {
      promptHTML: '<div class="shape-display">'+fraccionSVG(num,den,110)+'</div><p class="prompt-hint">La fracción es '+num+'/'+den+'. ¿Es una fracción propia (numerador menor que el denominador) o impropia?</p>',
      options: opts, correctValue: correct, speakText: '¿Es '+num+'/'+den+' una fracción propia o impropia?', cols:2, kind:'word',
      explain: 'Como '+num+' es menor que '+den+', '+num+'/'+den+' es una <b>fracción propia</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const den = pick([3,4,5,6]);
    const num = randInt(den+1,den*2);
    const correct = 'Fracción impropia';
    const opts = shuffle([{label:'Fracción propia', value:'Fracción propia'},{label:'Fracción impropia', value:'Fracción impropia'}]);
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+num+'/'+den+'</p><p class="prompt-hint">¿Es una fracción propia (numerador menor que el denominador) o impropia (numerador igual o mayor)?</p>',
      options: opts, correctValue: correct, speakText: '¿Es '+num+'/'+den+' una fracción propia o impropia?', cols:2, kind:'word',
      explain: 'Como '+num+' es igual o mayor que '+den+', '+num+'/'+den+' es una <b>fracción impropia</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const den = pick([4,5,6,7,8,9,10,11,12]);
    const a = randInt(1,den-2), b = randInt(1,den-a-1);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 1, den, 1, Math.min(4,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+'/'+den+' + '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum+'/'+den, speakText: '¿Cuánto es '+a+'/'+den+' más '+b+'/'+den+'?', cols:4,
      explain: a+'/'+den+' + '+b+'/'+den+' = <b>'+sum+'/'+den+'</b> (se suman los numeradores, el denominador no cambia).', recurso: recurso,
    };
  }
  const den = pick([4,5,6,7,8,9,10,11,12]);
  const a = randInt(2,den-1), b = randInt(1,a-1);
  const resta = a-b;
  const opts = uniqueDistractors(resta, 1, den, 1, Math.min(4,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+'/'+den+' - '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts, correctValue: resta+'/'+den, speakText: '¿Cuánto es '+a+'/'+den+' menos '+b+'/'+den+'?', cols:4,
    explain: a+'/'+den+' - '+b+'/'+den+' = <b>'+resta+'/'+den+'</b> (se restan los numeradores, el denominador no cambia).', recurso: recurso,
  };
}

const FRACCION_A_DECIMAL_BANK = [
  { num:1, den:2, decimal:'0,5' }, { num:1, den:4, decimal:'0,25' }, { num:3, den:4, decimal:'0,75' },
  { num:1, den:5, decimal:'0,2' }, { num:2, den:5, decimal:'0,4' }, { num:3, den:5, decimal:'0,6' },
  { num:4, den:5, decimal:'0,8' }, { num:1, den:10, decimal:'0,1' }, { num:7, den:10, decimal:'0,7' },
];
export function genDecimales5Round(){
  const recurso = 'Los <b>decimales</b> son otra forma de escribir fracciones cuyo denominador es 10, 100 o 1000: los <b>décimos</b> (10) se escriben con 1 cifra tras la coma (0,7 = 7/10), los <b>centésimos</b> (100) con 2 cifras (0,25 = 25/100), y los <b>milésimos</b> (1000) con 3 cifras. Para comparar dos decimales se comparan primero las cifras enteras y luego, si son iguales, las cifras después de la coma una por una de izquierda a derecha. Para sumar decimales, se alinean las comas en columna y se suma como si fueran números enteros, cuidando de poner la coma en el resultado en la misma posición.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(FRACCION_A_DECIMAL_BANK);
    const distract = shuffle(FRACCION_A_DECIMAL_BANK.filter(function(f){ return f.decimal!==item.decimal; })).slice(0,3).map(function(f){ return f.decimal; });
    const opts = shuffle([item.decimal].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+item.num+'/'+item.den+'</p><p class="prompt-hint">¿A qué decimal equivale esta fracción?</p>',
      options: opts, correctValue: item.decimal, speakText: '¿A qué decimal equivale '+item.num+'/'+item.den+'?', cols:4,
      explain: item.num+'/'+item.den+' equivale a <b>'+item.decimal+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    let aNum = randInt(1,999), bNum = randInt(1,999);
    while(bNum===aNum) bNum = randInt(1,999);
    const a = (aNum/1000).toFixed(3).replace('.',',');
    const b = (bNum/1000).toFixed(3).replace('.',',');
    const aVal = parseFloat(a.replace(',','.')), bVal = parseFloat(b.replace(',','.'));
    const opts = shuffle([{label:a, value:'A'},{label:b, value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el decimal <b>mayor</b></p>',
      options: opts, correctValue: aVal>bVal ? 'A' : 'B', speakText: '¿Cuál decimal es mayor, '+a+' o '+b+'?', cols:2, panel:true,
      explain: 'El '+Math.max(aVal,bVal).toFixed(3).replace('.',',')+' es mayor.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const a = randInt(1,900)/100, b = randInt(1,900)/100;
    const sum = Math.round((a+b)*100)/100;
    const opts = uniqueDistractors(Math.round(sum*100), 1, 2000, 15, 4).map(function(v){ return {label:(v/100).toFixed(2).replace('.',','), value:(v/100).toFixed(2).replace('.',',')}; });
    const correctLabel = sum.toFixed(2).replace('.',',');
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">'+a.toFixed(2).replace('.',',')+' + '+b.toFixed(2).replace('.',',')+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: correctLabel, speakText: '¿Cuánto es esa suma?', cols:4,
      explain: a.toFixed(2).replace('.',',')+' + '+b.toFixed(2).replace('.',',')+' = <b>'+correctLabel+'</b>.', recurso: recurso,
    };
  }
  const precio1 = (randInt(100,900)/10).toFixed(1);
  const precio2 = (randInt(50,400)/10).toFixed(1);
  const total = (parseFloat(precio1)+parseFloat(precio2)).toFixed(1);
  const opts = uniqueDistractors(Math.round(parseFloat(total)*10), 500, 15000, 30, 4).map(function(v){ return {label:'$'+(v/10).toFixed(1).replace('.',','), value:'$'+(v/10).toFixed(1).replace('.',',')}; });
  return {
    promptHTML: '<p class="prompt-hint">Compraste dos productos: uno de $'+precio1.replace('.',',')+' mil y otro de $'+precio2.replace('.',',')+' mil. ¿Cuánto gastaste en total (en miles de pesos)?</p>',
    options: opts, correctValue: '$'+total.replace('.',','), speakText: '¿Cuánto gastaste en total?', cols:4,
    explain: '$'+precio1.replace('.',',')+' + $'+precio2.replace('.',',')+' = <b>$'+total.replace('.',',')+'</b> mil.', recurso: recurso,
  };
}

export function genPatrones5Round(){
  const recurso = 'Un <b>patrón numérico</b> es una secuencia de números que sigue siempre la misma regla — puede ser sumar/restar la misma cantidad cada vez, o multiplicar por el mismo número. Para descubrir la regla, se compara un término con el siguiente y se busca qué operación los conecta, y esa misma operación se repite para encontrar el término que sigue. Una <b>ecuación</b> con una incógnita (como "x + 8 = 15") se resuelve haciendo la operación inversa: si algo se sumó, se resta; si algo se restó, se suma — así se despeja el valor de x que hace verdadera la igualdad.';
  const roll = Math.random();
  if(roll<0.34){
    const tipo = pick(['SUMA','RESTA','MULTIPLICACIÓN']);
    const start = randInt(2,20);
    let step, seq, correct;
    if(tipo==='SUMA'){ step = randInt(3,15); seq=[start,start+step,start+2*step,start+3*step]; correct=start+4*step; }
    else if(tipo==='RESTA'){ step = randInt(2,8); const s0=start+4*step; seq=[s0,s0-step,s0-2*step,s0-3*step]; correct=s0-4*step; }
    else { step = randInt(2,3); seq=[start,start*step,start*step*step,start*step*step*step]; correct=start*Math.pow(step,4); }
    const opts = uniqueDistractors(correct, 0, 5000, Math.max(2,step), 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+seq.join(', ')+', <span class="blank">?</span></p><p class="prompt-hint">¿Qué número sigue en el patrón?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número sigue?', cols:4,
      explain: 'La regla es "'+tipo.toLowerCase()+' '+step+'" cada vez, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const x = randInt(1,50), suma = randInt(5,50);
    const total = x+suma;
    const opts = uniqueDistractors(x, 0, 200, 6, 4).map(function(v){ return {label:'x = '+v, value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">x + '+suma+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
      options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
      explain: total+' - '+suma+' = <b>'+x+'</b>, así que x = '+x+'.', recurso: recurso,
    };
  }
  const x = randInt(1,30), resta = randInt(1,20);
  const total = x-resta;
  const opts = uniqueDistractors(x, 0, 100, 5, 4).map(function(v){ return {label:'x = '+v, value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">x - '+resta+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
    options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
    explain: total+' + '+resta+' = <b>'+x+'</b>, así que x = '+x+'.', recurso: recurso,
  };
}

const PARALELISMO_BANK = [
  { id:'cuadrado', label:'Cuadrado', paralelo:true }, { id:'rectangulo', label:'Rectángulo', paralelo:true },
  { id:'rombo', label:'Rombo', paralelo:true }, { id:'hexagono', label:'Hexágono', paralelo:true },
  { id:'triangulo', label:'Triángulo', paralelo:false }, { id:'pentagono', label:'Pentágono', paralelo:false },
];
const TRANSFORMACIONES_BANK = [
  { desc:'Deslizar una figura hacia la derecha, sin girarla ni voltearla', tipo:'Traslación' },
  { desc:'Mover una figura hacia arriba, manteniendo su misma forma y orientación', tipo:'Traslación' },
  { desc:'Deslizar una figura hacia abajo en línea recta', tipo:'Traslación' },
  { desc:'Voltear una figura como si la reflejara un espejo', tipo:'Reflexión' },
  { desc:'Voltear una figura de izquierda a derecha, como su imagen en un espejo', tipo:'Reflexión' },
  { desc:'Voltear una figura de arriba hacia abajo, como su reflejo en el agua', tipo:'Reflexión' },
  { desc:'Girar una figura alrededor de un punto fijo, como las agujas de un reloj', tipo:'Rotación' },
  { desc:'Girar una figura 90 grados sobre un punto central', tipo:'Rotación' },
  { desc:'Dar vuelta una figura como una rueda que gira sobre su eje', tipo:'Rotación' },
];
export function genGeometria5Round(){
  const recurso = 'El <b>plano cartesiano</b> ubica puntos con dos números (x, y): el primero indica cuánto moverse hacia la derecha, el segundo cuánto moverse hacia arriba, siempre partiendo del punto (0,0). Dos lados son <b>paralelos</b> cuando nunca se juntan por más que se extiendan, como los rieles de un tren. Las <b>transformaciones geométricas</b> cambian la posición de una figura sin cambiar su forma ni su tamaño: la <b>traslación</b> la desliza en línea recta, la <b>reflexión</b> la voltea como en un espejo, y la <b>rotación</b> la gira alrededor de un punto fijo.';
  const roll = Math.random();
  if(roll<0.34){
    const col = randInt(1,8), row = randInt(1,8);
    const dx = randInt(1,3), dy = randInt(1,3);
    const opts = shuffle([(col+dx)+','+(row+dy), col+','+(row+dy), (col+dx)+','+row, (col+dx+1)+','+(row+dy+1)]).map(function(c){ return {label:'('+c+')', value:c}; });
    return {
      promptHTML: '<p class="prompt-hint">Un punto está en la coordenada ('+col+', '+row+'). Si te mueves '+dx+' hacia la derecha y '+dy+' hacia arriba, ¿en qué coordenada quedas?</p>',
      options: opts, correctValue: (col+dx)+','+(row+dy), speakText: '¿En qué coordenada quedas?', cols:2, panel:true,
      explain: 'Sumas '+dx+' a la primera coordenada y '+dy+' a la segunda: ('+(col+dx)+', '+(row+dy)+').', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(PARALELISMO_BANK);
    const opts = shuffle([{label:'Sí tiene lados paralelos', value:true},{label:'No tiene lados paralelos', value:false}]);
    const art = articuloFigura(item.id);
    return {
      promptHTML: '<div class="shape-display">'+shapeSVG(item.id,100)+'</div><p class="prompt-hint">¿Esta figura tiene al menos un par de lados paralelos?</p>',
      options: opts, correctValue: item.paralelo, speakText: '¿Esta figura tiene lados paralelos?', cols:2, panel:true,
      explain: item.paralelo ? art+' '+item.label.toLowerCase()+' sí tiene al menos un par de lados paralelos.' : art+' '+item.label.toLowerCase()+' no tiene lados paralelos.', recurso: recurso,
    };
  }
  const item = pick(TRANSFORMACIONES_BANK);
  const todos = ['Traslación','Reflexión','Rotación'];
  const distract = todos.filter(function(t){ return t!==item.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'</p><p class="prompt-hint">¿Qué transformación geométrica es esta?</p>',
    options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Esto es una <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
  };
}

const OBJETOS_LONGITUD5 = [
  { emoji:'🚗', label:'El auto', cm:400 },
  { emoji:'🚲', label:'La bicicleta', cm:170 },
  { emoji:'🏢', label:'El edificio', cm:1500 },
  { emoji:'📱', label:'El celular', cm:15 },
  { emoji:'🖊️', label:'El lápiz', cm:14 },
];
const CONVERSION_LONGITUD_BANK = [
  { valor:2, de:'km', a:'m', resultado:2000 }, { valor:5, de:'m', a:'cm', resultado:500 },
  { valor:3, de:'cm', a:'mm', resultado:30 }, { valor:1, de:'km', a:'m', resultado:1000 },
  { valor:4, de:'m', a:'cm', resultado:400 }, { valor:7, de:'cm', a:'mm', resultado:70 },
];
export function genMedicion5Round(){
  const recurso = 'Las unidades de longitud (km, m, cm, mm) se convierten multiplicando o dividiendo por 10, 100 o 1000 según la distancia entre ellas: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm. El <b>perímetro</b> de un rectángulo es la suma de sus 4 lados: 2×(largo+ancho). El <b>área</b> mide cuánta superficie cubre una figura: en un triángulo es (base × altura) ÷ 2, en un paralelogramo es base × altura, y en un trapecio es (base mayor + base menor) × altura ÷ 2 — en los tres casos la altura es la distancia perpendicular (en ángulo recto) entre la base y el vértice o lado opuesto.';
  const roll = Math.random();
  if(roll<0.25){
    let a = pick(OBJETOS_LONGITUD5), b = pick(OBJETOS_LONGITUD5);
    while(b.label===a.label) b = pick(OBJETOS_LONGITUD5);
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    const longer = a.cm>b.cm ? a : b;
    return {
      promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.cm+' cm.</p><p class="prompt-hint">'+b.emoji+' '+b.label+' mide '+b.cm+' cm.</p><p class="prompt-hint">¿Cuál es más largo?</p>',
      options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
      explain: longer.label+' mide '+longer.cm+' cm, más que el otro objeto.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(CONVERSION_LONGITUD_BANK);
    const opts = uniqueDistractors(item.resultado, 1, 20000, Math.max(5,Math.floor(item.resultado*0.2)), 4).map(function(v){ return {label:v+' '+item.a, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.valor+' '+item.de+' equivalen a ¿cuántos '+item.a+'?</p>',
      options: opts, correctValue: item.resultado, speakText: '¿A cuántos '+item.a+' equivalen '+item.valor+' '+item.de+'?', cols:4,
      explain: item.valor+' '+item.de+' = <b>'+item.resultado+' '+item.a+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const perimetro = randInt(12,40)*2;
    const largo = randInt(4,Math.floor(perimetro/2)-2);
    const ancho = perimetro/2 - largo;
    const opts = shuffle([
      {label:largo+' × '+ancho, value:'ok'},
      {label:(largo+1)+' × '+(ancho+1), value:'bad1'},
      {label:(largo-1>0?largo-1:largo+2)+' × '+ancho, value:'bad2'},
      {label:largo+' × '+(ancho+2), value:'bad3'},
    ]);
    return {
      /* Antes decía "¿Cuáles dimensiones ... funcionan?" (plural) — lectura
         ambigua, como si más de una de las 4 opciones pudiera ser correcta.
         Solo una combinación (la exacta) da este perímetro; reformulado en
         singular para que quede claro que se elige una sola opción. */
      promptHTML: '<p class="prompt-hint">Quieres diseñar un rectángulo con perímetro '+perimetro+'. ¿Cuál de estas combinaciones de dimensiones (largo × ancho) da ese perímetro?</p>',
      options: opts, correctValue: 'ok', speakText: '¿Qué dimensiones dan ese perímetro?', cols:2, panel:true,
      explain: 'Con largo '+largo+' y ancho '+ancho+', el perímetro es 2×('+largo+'+'+ancho+') = <b>'+perimetro+'</b>.', recurso: recurso,
    };
  }
  const tipo = pick(['TRIÁNGULO','PARALELOGRAMO','TRAPECIO']);
  /* `altura` se fuerza PAR: el área de triángulo y trapecio se calcula
     dividiendo por 2 (base×altura÷2, (base+base2)×altura÷2). Con una altura
     impar y un producto impar, el resultado exacto podía salir con
     decimales (p.ej. 5×3÷2 = 7,5) que luego se redondeaba en silencio a un
     entero (8) mientras el `explain` mostraba la fórmula "exacta" con el
     resultado real 7,5 pero declarando 8 como respuesta — inconsistencia
     real encontrada en la auditoría. Con altura siempre par, la división
     por 2 da un entero exacto, sin redondear nada. */
  const base = randInt(4,12), altura = randInt(2,5)*2;
  let area, formula;
  if(tipo==='TRIÁNGULO'){ area = Math.round(base*altura/2); formula = '(base × altura) ÷ 2 = ('+base+' × '+altura+') ÷ 2'; }
  else if(tipo==='PARALELOGRAMO'){ area = base*altura; formula = 'base × altura = '+base+' × '+altura; }
  else { const base2 = base+randInt(1,4); area = Math.round((base+base2)*altura/2); formula = '(base mayor + base menor) × altura ÷ 2 = ('+base2+' + '+base+') × '+altura+' ÷ 2'; }
  const opts = uniqueDistractors(area, 2, 200, 6, 4).map(function(v){ return {label:v+' unidades cuadradas', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un '+tipo.toLowerCase()+' tiene base '+base+' y altura '+altura+'. ¿Cuál es su área?</p>',
    options: opts, correctValue: area, speakText: '¿Cuál es el área de este '+tipo.toLowerCase()+'?', cols:2,
    explain: 'El área se calcula con '+formula+' = <b>'+area+' unidades cuadradas</b>.', recurso: recurso,
  };
}

const PROBABILIDAD_CUALITATIVA_BANK = [
  { escenario:'Sacar una bolita roja de una bolsa que solo tiene bolitas rojas', nivel:'Seguro' },
  { escenario:'Que mañana salga el sol', nivel:'Seguro' },
  { escenario:'Sacar un 6 al lanzar un dado normal de 6 caras', nivel:'Posible' },
  { escenario:'Sacar una bolita azul de una bolsa con 9 rojas y 1 azul', nivel:'Poco posible' },
  { escenario:'Que un perro hable español', nivel:'Imposible' },
  { escenario:'Que llueva algún día de invierno en el sur de Chile', nivel:'Posible' },
  { escenario:'Sacar una carta de corazones de una baraja normal', nivel:'Posible' },
  { escenario:'Que una moneda caiga sin mostrar cara ni sello', nivel:'Imposible' },
];
const COMPARAR_PROBABILIDAD_BANK = [
  { descripcionA:'Bolsa A: 8 bolitas rojas y 2 azules', descripcionB:'Bolsa B: 3 bolitas rojas y 7 azules', preguntaColor:'Roja', masProbable:'A' },
  { descripcionA:'Bolsa A: 1 bolita verde y 9 amarillas', descripcionB:'Bolsa B: 6 bolitas verdes y 4 amarillas', preguntaColor:'Verde', masProbable:'B' },
  { descripcionA:'Bolsa A: 5 bolitas negras y 5 blancas', descripcionB:'Bolsa B: 9 bolitas negras y 1 blanca', preguntaColor:'Negra', masProbable:'B' },
];
export function genDatos5Round(){
  const recurso = 'El <b>promedio</b> (o media) de un conjunto de datos se calcula sumando todos los valores y dividiendo por la cantidad de datos que hay — resume "qué tan grande, en general" es un conjunto de números con un solo valor. La <b>probabilidad cualitativa</b> describe qué tan posible es un evento sin necesidad de calcular un número exacto: puede ser seguro, posible, poco posible o imposible; para comparar dos probabilidades basta con mirar qué proporción de casos favorables tiene cada opción, sin calcular la fracción exacta. Un <b>diagrama de tallo y hojas</b> es una forma de ordenar números de dos cifras: el "tallo" muestra la decena y las "hojas" muestran las unidades que le corresponden.';
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const promedio = Math.round((total/item.categorias.length)*10)/10;
    const opts = uniqueDistractors(Math.round(promedio*10), 5, 300, 8, 4).map(function(v){ return {label:(v/10).toFixed(1), value:(v/10).toFixed(1)}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál es el promedio de respuestas por categoría?</p>',
      options: opts, correctValue: promedio.toFixed(1), speakText: '¿Cuál es el promedio?', cols:4,
      explain: 'El promedio es la suma dividida por la cantidad de categorías: '+total+' ÷ '+item.categorias.length+' = <b>'+promedio.toFixed(1)+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.4){
    const item = pick(PROBABILIDAD_CUALITATIVA_BANK);
    const todos = ['Seguro','Posible','Poco posible','Imposible'];
    const distract = todos.filter(function(n){ return n!==item.nivel; });
    const opts = shuffle([item.nivel].concat(distract)).map(function(n){ return {label:n, value:n}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Qué tan posible es que esto ocurra?</p>',
      options: opts, correctValue: item.nivel, speakText: item.escenario, cols:2, kind:'word', panel:true,
      explain: 'Esto es <b>'+item.nivel.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.6){
    const item = pick(COMPARAR_PROBABILIDAD_BANK);
    const opts = shuffle([{label:'Bolsa A', value:'A'},{label:'Bolsa B', value:'B'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.descripcionA+'</p><p class="prompt-sentence">'+item.descripcionB+'</p><p class="prompt-hint">¿De cuál bolsa es más probable sacar una bolita '+item.preguntaColor.toLowerCase()+'?</p>',
      options: opts, correctValue: item.masProbable, speakText: '¿De cuál bolsa es más probable sacar una bolita '+item.preguntaColor.toLowerCase()+'?', cols:2, panel:true,
      explain: 'La bolsa '+item.masProbable+' tiene una proporción mayor de bolitas '+item.preguntaColor.toLowerCase()+'s, sin necesidad de calcular la probabilidad exacta.', recurso: recurso,
    };
  }
  if(roll<0.8){
    const item = pick(DATOS_ENCUESTA);
    const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
    const distract = item.categorias.filter(function(c){ return c.label!==maxCat.label; }).map(function(c){ return c.label; });
    const opts = shuffle([maxCat.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál categoría tuvo el valor más alto en este gráfico?</p>',
      options: opts, correctValue: maxCat.label, speakText: '¿Cuál categoría tuvo el valor más alto?', cols:4, kind:'word',
      explain: '<b>'+maxCat.label+'</b> tuvo el valor más alto en el gráfico.', recurso: recurso,
    };
  }
  const tallo = randInt(1,7);
  const hojas = shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,5).sort(function(a,b){return a-b;});
  const valores = hojas.map(function(h){ return tallo*10+h; });
  const preguntaMax = Math.random()<0.5;
  const correct = preguntaMax ? Math.max.apply(null,valores) : Math.min.apply(null,valores);
  const opts = uniqueDistractors(correct, tallo*10, tallo*10+9, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  const tabla = '<table class="stem-leaf"><tr><th>Tallo</th><th>Hojas</th></tr><tr><td>'+tallo+'</td><td>'+hojas.join(' ')+'</td></tr></table>';
  return {
    promptHTML: tabla+'<p class="prompt-hint">Este diagrama de tallo y hojas representa los números '+valores.join(', ')+'. ¿Cuál es el valor '+(preguntaMax?'más alto':'más bajo')+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál es el valor '+(preguntaMax?'más alto':'más bajo')+'?', cols:4,
    explain: 'El valor '+(preguntaMax?'más alto':'más bajo')+' es <b>'+correct+'</b>.', recurso: recurso,
  };
}

/* ---------------- Contenido Matemática 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/6-basico), 24 OA agrupados en 10 módulos temáticos
   (mismo criterio de consolidación de años anteriores):
   Múltiplos y Factores -> OA01. Operatoria Combinada -> OA02 (cálculo con
   números mayores a 10 000). Razones y Porcentajes -> OA03-04. Fracciones y
   Números Mixtos -> OA05-06,08. Decimales III -> OA07-08. Patrones,
   Tablas y Ecuaciones -> OA09-11. Triángulos y Teselados -> OA12,14.
   Ángulos VI -> OA15-17,20-21 (clasificación por grados incluyendo
   extendido/completo -sin necesidad de dibujar un ángulo de 180°/360°, se
   presenta como dato numérico-, complementarios, ángulos opuestos por el
   vértice/correspondientes en paralelas -mismo principio: conservan la
   medida-, suma de ángulos interiores). Área y Volumen -> OA13,18-19.
   Datos y Probabilidades IV -> OA22-24 (incluye gráfico de barra doble y
   gráfico circular nuevos, `doubleBarChartHTML()`/`pieChartHTML()`).
   Ningún OA de 6° básico queda fuera del motor de opción múltiple. */
export const MATE_MODULES_G6 = [
  {id:'multiplosfactores6', label:'Múltiplos y Factores', open:true, key:'multiplosfactores6'},
  {id:'operatoria6', label:'Operatoria Combinada', open:true, key:'operatoria6'},
  {id:'razonesporcentajes6', label:'Razones y Porcentajes', open:true, key:'razonesporcentajes6'},
  {id:'fraccionesmixtas6', label:'Fracciones y Números Mixtos', open:true, key:'fraccionesmixtas6'},
  {id:'decimales6', label:'Decimales III', open:true, key:'decimales6'},
  {id:'patronesecuaciones6', label:'Patrones, Tablas y Ecuaciones', open:true, key:'patronesecuaciones6'},
  {id:'triangulosteselados6', label:'Triángulos y Teselados', open:true, key:'triangulosteselados6'},
  {id:'angulos6', label:'Ángulos VI', open:true, key:'angulos6'},
  {id:'areavolumen6', label:'Área y Volumen', open:true, key:'areavolumen6'},
  {id:'datos6', label:'Datos y Probabilidades IV', open:true, key:'datos6'},
];
export const MATE_POS_G6 = [
  {x:20,y:94},{x:64,y:88},{x:24,y:76},{x:66,y:66},{x:20,y:56},
  {x:64,y:46},{x:24,y:36},{x:66,y:26},{x:20,y:16},{x:64,y:6},
];

function divisors(n){
  const ds = [];
  for(let i=2;i<n;i++) if(n%i===0) ds.push(i);
  return ds;
}
function isPrime(n){
  if(n<2) return false;
  for(let i=2;i*i<=n;i++) if(n%i===0) return false;
  return true;
}
export function genMultiplosFactores6Round(){
  const recurso = 'Los <b>múltiplos</b> de un número se obtienen multiplicándolo por 1, 2, 3, 4... (los múltiplos de 4 son 4, 8, 12, 16...), y siempre son infinitos. Los <b>factores</b> (o divisores) de un número son los números que lo dividen exactamente, sin dejar resto — los factores de 12 son 1, 2, 3, 4, 6 y 12. Un número es <b>primo</b> cuando tiene exactamente 2 factores: el 1 y sí mismo (2, 3, 5, 7, 11...); es <b>compuesto</b> cuando tiene más de 2 factores. Reconocer múltiplos, factores y números primos ayuda a simplificar fracciones y a resolver problemas de reparto en partes iguales.';
  const roll = Math.random();
  if(roll<0.34){
    const b = randInt(3,12);
    const correct = b*randInt(3,10);
    function nonMultiple(near){ let v = Math.max(2,near); while(v%b===0) v++; return v; }
    const opts = shuffle([correct, nonMultiple(correct+1), nonMultiple(correct-1), nonMultiple(correct+b+1)]).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es múltiplo de '+b+'?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál de estos números es múltiplo de '+b+'?', cols:2,
      explain: correct+' es múltiplo de '+b+' porque '+correct+' ÷ '+b+' = <b>'+(correct/b)+'</b>, sin dejar resto.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const candidatos = [12,18,20,24,28,30,36,40,42,45,48,60];
    const n = pick(candidatos);
    const ds = divisors(n);
    const correct = pick(ds);
    let distract = [];
    let guard = 0;
    while(distract.length<3 && guard<200){
      guard++;
      const d = randInt(2,n-1);
      if(n%d!==0 && distract.indexOf(d)===-1) distract.push(d);
    }
    const opts = shuffle([correct].concat(distract)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es factor de '+n+' (lo divide exactamente, sin dejar resto)?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál número es factor de '+n+'?', cols:2,
      explain: n+' ÷ '+correct+' = <b>'+(n/correct)+'</b>, sin dejar resto, así que '+correct+' es factor de '+n+'.', recurso: recurso,
    };
  }
  const n = randInt(2,50);
  const correct = isPrime(n) ? 'PRIMO' : 'COMPUESTO';
  const opts = shuffle([{label:'Número primo', value:'PRIMO'},{label:'Número compuesto', value:'COMPUESTO'}]);
  return {
    promptHTML: '<p class="prompt-count" style="font-size:36px;">'+n+'</p><p class="prompt-hint">¿Es un número primo o compuesto?</p>',
    options: opts, correctValue: correct, speakText: '¿Es '+n+' un número primo o compuesto?', cols:2, panel:true,
    explain: correct==='PRIMO' ? n+' es <b>primo</b>: solo se puede dividir exactamente por 1 y por sí mismo.' : n+' es <b>compuesto</b>: tiene más divisores además de 1 y sí mismo.', recurso: recurso,
  };
}

export function genOperatoria6Round(){
  const recurso = 'Cuando una operación combina paréntesis, multiplicaciones/divisiones y sumas/restas, hay un orden fijo para resolverla: primero lo que está dentro de los <b>paréntesis</b>, después las <b>multiplicaciones y divisiones</b> (de izquierda a derecha), y al final las <b>sumas y restas</b> (de izquierda a derecha). Seguir siempre este mismo orden es lo que permite que cualquier persona, en cualquier parte, llegue exactamente al mismo resultado al resolver la misma operación.';
  if(Math.random()<0.5){
    const a = randInt(100,900), b = randInt(10,90), c = randInt(2,9), d = randInt(1,50);
    const correct = (a+b)*c - d;
    const promptTxt = '('+a+' + '+b+') × '+c+' - '+d;
    const opts = uniqueDistractors(correct, 0, 15000, 30, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:24px;">'+promptTxt+'</p><p class="prompt-hint">¿Cuánto es? (recuerda: primero paréntesis, luego multiplicación, y por último resta)</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+promptTxt+'?', cols:2,
      explain: promptTxt+' = <b>'+correct+'</b>, respetando el orden de las operaciones.', recurso: recurso,
    };
  }
  const suma = Math.random()<0.5;
  const a = randInt(10000,89999), b = randInt(1000,9000);
  const correct = suma ? a+b : a-b;
  const opts = uniqueDistractors(correct, 100, 200000, 200, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:22px;">'+a+' '+(suma?'+':'-')+' '+b+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuánto es '+a+' '+(suma?'más':'menos')+' '+b+'?', cols:2,
    explain: a+' '+(suma?'+':'-')+' '+b+' = <b>'+correct+'</b>.', recurso: recurso,
  };
}

const RAZON_ESCENARIOS = [
  { texto:'En el zoológico hay {a} leones y {b} tigres.', itemA:'leones', itemB:'tigres' },
  { texto:'En la sala hay {a} niñas y {b} niños.', itemA:'niñas', itemB:'niños' },
  { texto:'En la canasta hay {a} manzanas y {b} plátanos.', itemA:'manzanas', itemB:'plátanos' },
  { texto:'En el estacionamiento hay {a} autos y {b} bicicletas.', itemA:'autos', itemB:'bicicletas' },
];
const PORCENTAJE_BASES = [100,200,300,400,500,800,1000,2000];
const PORCENTAJE_TASAS = [10,20,25,50,75];
export function genRazonesPorcentajes6Round(){
  const recurso = 'Una <b>razón</b> compara dos cantidades relacionadas, como "3 : 2" (3 niñas por cada 2 niños). Un <b>porcentaje</b> es una forma especial de razón que siempre compara contra 100 — "25%" significa "25 de cada 100". Para calcular el p% de un número n, se multiplica n × p y se divide por 100 (el 25% de 200 es 200×25÷100 = 50). Razones y porcentajes se usan todos los días: en descuentos, en encuestas, y para comparar cantidades de distinto tamaño de forma justa.';
  if(Math.random()<0.5){
    const esc = pick(RAZON_ESCENARIOS);
    let a = randInt(2,9), b = randInt(2,9);
    while(b===a) b = randInt(2,9);
    const correct = a+':'+b;
    const distract = shuffle([b+':'+a, a+':'+(b+1), (a+1)+':'+b].filter(function(d){ return d!==correct; }));
    const opts = shuffle([correct].concat(distract)).map(function(r){ return {label:r, value:r}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+esc.texto.replace('{a}',a).replace('{b}',b)+'</p><p class="prompt-hint">¿Cuál es la razón entre '+esc.itemA+' y '+esc.itemB+'?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la razón entre '+esc.itemA+' y '+esc.itemB+'?', cols:4,
      explain: 'La razón es <b>'+correct+'</b>: '+a+' '+esc.itemA+' por cada '+b+' '+esc.itemB+'.', recurso: recurso,
    };
  }
  const n = pick(PORCENTAJE_BASES);
  const p = pick(PORCENTAJE_TASAS);
  const correct = Math.round(n*p/100);
  const opts = uniqueDistractors(correct, 1, n, Math.max(5,Math.round(correct*0.3)), 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuánto es el '+p+'% de '+n+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuánto es el '+p+' por ciento de '+n+'?', cols:4,
    explain: 'El '+p+'% de '+n+' es <b>'+correct+'</b>.', recurso: recurso,
  };
}

export function genFraccionesMixtas6Round(){
  const recurso = 'Un <b>número mixto</b> combina un número entero con una fracción propia (como 2 y 1/3), mientras que una <b>fracción impropia</b> tiene el numerador mayor o igual que el denominador (como 7/3) — ambos representan exactamente la misma cantidad, solo escrita de forma distinta. Para convertir una fracción impropia a mixto, se divide el numerador por el denominador: el cociente es el entero y el resto queda como numerador de la fracción. Para sumar o restar fracciones que ya tienen el mismo denominador, solo se suman o restan los numeradores y el denominador se mantiene igual.';
  const roll = Math.random();
  if(roll<0.34){
    const den = pick([3,4,5,6,7]);
    const w = randInt(1,3), r = randInt(1,den-1);
    const num = den*w+r;
    const correct = w+' Y '+r+'/'+den;
    const distract = shuffle([
      (w+1)+' Y '+r+'/'+den,
      w+' Y '+(r+1<=den-1?r+1:r-1)+'/'+den,
      (w-1>=0?w-1:w+2)+' Y '+r+'/'+den,
    ]);
    const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+num+'/'+den+'</p><p class="prompt-hint">¿Cómo se escribe esta fracción impropia como número mixto?</p>',
      options: opts, correctValue: correct, speakText: '¿Cómo se escribe '+num+'/'+den+' como número mixto?', cols:2, panel:true,
      explain: num+'/'+den+' = <b>'+correct+'</b> (entero + fracción propia).', recurso: recurso,
    };
  }
  if(roll<0.67){
    const den = pick([3,4,5,6,7]);
    const w = randInt(1,3), r = randInt(1,den-1);
    const correct = den*w+r;
    const opts = uniqueDistractors(correct, 1, den*4, 2, 4).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+w+' Y '+r+'/'+den+'</p><p class="prompt-hint">¿A qué fracción impropia equivale este número mixto?</p>',
      options: opts, correctValue: correct+'/'+den, speakText: '¿A qué fracción impropia equivale '+w+' y '+r+'/'+den+'?', cols:2,
      explain: w+' y '+r+'/'+den+' equivale a <b>'+correct+'/'+den+'</b>.', recurso: recurso,
    };
  }
  const den = pick([10,12,14,15,16,18,20]);
  const restar = Math.random()<0.5;
  const a = randInt(2,den-2), b = randInt(1,restar?a-1:den-a-1);
  const resultado = restar ? a-b : a+b;
  const opts = uniqueDistractors(resultado, 1, den, 1, Math.min(4,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+a+'/'+den+' '+(restar?'-':'+')+' '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts, correctValue: resultado+'/'+den, speakText: '¿Cuánto es esa operación?', cols:4,
    explain: a+'/'+den+' '+(restar?'-':'+')+' '+b+'/'+den+' = <b>'+resultado+'/'+den+'</b>.', recurso: recurso,
  };
}

export function genDecimales6Round(){
  const recurso = 'Para <b>multiplicar un decimal por un número entero</b>, se multiplica como si no tuviera coma y luego se ubica la coma en el resultado con la misma cantidad de decimales que tenía el número original. Para <b>dividir</b>, se busca qué número decimal multiplicado por el divisor da el dividendo. Y al multiplicar un decimal por 10, 100 o 1000, la coma simplemente se corre hacia la derecha (un lugar por cada cero) — sin necesidad de multiplicar cifra por cifra.';
  const roll = Math.random();
  if(roll<0.34){
    const dec = randInt(11,89)/10;
    const nat = randInt(2,9);
    const correct = Math.round(dec*nat*10)/10;
    const opts = uniqueDistractors(Math.round(correct*10), 5, 900, 8, 4).map(function(v){ return {label:(v/10).toFixed(1), value:(v/10).toFixed(1)}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+dec.toFixed(1)+' × '+nat+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: correct.toFixed(1), speakText: '¿Cuánto es '+dec.toFixed(1)+' por '+nat+'?', cols:4,
      explain: dec.toFixed(1)+' × '+nat+' = <b>'+correct.toFixed(1)+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const divisor = randInt(2,9);
    const q = randInt(11,50)/10;
    const dividendo = Math.round(q*divisor*10)/10;
    const opts = uniqueDistractors(Math.round(q*10), 5, 900, 6, 4).map(function(v){ return {label:(v/10).toFixed(1), value:(v/10).toFixed(1)}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+dividendo.toFixed(1)+' ÷ '+divisor+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: q.toFixed(1), speakText: '¿Cuánto es '+dividendo.toFixed(1)+' dividido '+divisor+'?', cols:4,
      explain: dividendo.toFixed(1)+' ÷ '+divisor+' = <b>'+q.toFixed(1)+'</b>.', recurso: recurso,
    };
  }
  const dec = randInt(1,99)/100;
  const mult = pick([10,100]);
  const correct = Math.round(dec*mult*100)/100;
  const opts = uniqueDistractors(Math.round(correct*100), 1, 9900, 40, 4).map(function(v){ return {label:(v/100).toFixed(2), value:(v/100).toFixed(2)}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+dec.toFixed(2)+' × '+mult+'</p><p class="prompt-hint">¿Cuánto es? (Pista: al multiplicar por '+mult+', la coma se corre hacia la derecha)</p>',
    options: opts, correctValue: correct.toFixed(2), speakText: '¿Cuánto es '+dec.toFixed(2)+' por '+mult+'?', cols:4,
    explain: dec.toFixed(2)+' × '+mult+' = <b>'+correct.toFixed(2)+'</b>.', recurso: recurso,
  };
}

const FRASE_EXPRESION_BANK = [
  { frase:'El doble de un número más 5', expresion:'2n + 5' },
  { frase:'La mitad de un número menos 3', expresion:'n ÷ 2 - 3' },
  { frase:'El triple de un número más 1', expresion:'3n + 1' },
  { frase:'Un número más 10', expresion:'n + 10' },
  { frase:'El doble de un número menos 4', expresion:'2n - 4' },
];
export function genPatronesEcuaciones6Round(){
  const recurso = 'Una <b>tabla de valores</b> muestra pares de números (x, y) que siguen siempre la misma regla — encontrarla es descubrir qué operación convierte cada x en su y correspondiente. Una <b>expresión algebraica</b> traduce una frase en palabras a símbolos matemáticos usando una letra (como n) para representar "un número cualquiera" — por ejemplo, "el doble de un número más 5" se escribe 2n + 5. Y para resolver una <b>ecuación</b> de un paso, se usan operaciones inversas: si algo se sumó, se resta; si algo se multiplicó, se divide — hasta dejar la letra sola en un lado.';
  const roll = Math.random();
  if(roll<0.34){
    const m = randInt(2,5), b = randInt(0,5);
    const xs = [1,2,3,4];
    const ys = xs.map(function(x){ return m*x+b; });
    const correct = 'y = '+m+'x'+(b>0?' + '+b:'');
    const distract = shuffle([
      'y = '+(m+1)+'x'+(b>0?' + '+b:''),
      'y = '+m+'x'+(b>0?' + '+(b+2):' + 2'),
      'y = '+(m+2)+'x',
    ].filter(function(d){ return d!==correct; })).slice(0,3);
    const opts = shuffle([correct].concat(distract)).map(function(r){ return {label:r, value:r}; });
    return {
      promptHTML: '<p class="prompt-count">x: '+xs.join(', ')+'</p><p class="prompt-count">y: '+ys.join(', ')+'</p><p class="prompt-hint">¿Qué regla relaciona los valores de x con los de y en esta tabla?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué regla relaciona x con y?', cols:2, panel:true,
      explain: 'La regla es <b>'+correct+'</b>: cada y se obtiene multiplicando x por '+m+(b>0?' y sumando '+b:'')+'.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(FRASE_EXPRESION_BANK);
    const distract = shuffle(FRASE_EXPRESION_BANK.filter(function(f){ return f.expresion!==item.expresion; })).slice(0,3).map(function(f){ return f.expresion; });
    const opts = shuffle([item.expresion].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.frase+'"</p><p class="prompt-hint">¿Qué expresión algebraica representa esta frase? (n = el número)</p>',
      options: opts, correctValue: item.expresion, speakText: item.frase, cols:2,
      explain: '"'+item.frase+'" se escribe como <b>'+item.expresion+'</b>.', recurso: recurso,
    };
  }
  const x = randInt(1,20);
  const coef = randInt(2,6);
  const suma = randInt(1,20);
  const total = coef*x+suma;
  const opts = uniqueDistractors(x, 0, 60, 4, 4).map(function(v){ return {label:'x = '+v, value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+coef+'x + '+suma+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
    options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
    explain: '('+total+' - '+suma+') ÷ '+coef+' = <b>'+x+'</b>, así que x = '+x+'.', recurso: recurso,
  };
}

const TESELADO_TRANSFORMACIONES_BANK = [
  { desc:'En un mosaico, una figura se repite deslizándose siempre en la misma dirección, sin girar ni voltearse', tipo:'Traslación' },
  { desc:'En un mosaico, cada figura se repite desplazada hacia el lado, manteniendo siempre la misma orientación', tipo:'Traslación' },
  { desc:'En un mosaico, cada figura aparece como el reflejo de la anterior, como si hubiera un espejo entre ellas', tipo:'Reflexión' },
  { desc:'En un mosaico, las figuras se alternan volteadas, una mirando hacia un lado y la siguiente hacia el lado opuesto', tipo:'Reflexión' },
  { desc:'En un mosaico, cada figura aparece girada un cierto ángulo respecto a la anterior, alrededor de un punto fijo', tipo:'Rotación' },
  { desc:'En un mosaico, las figuras giran en círculo alrededor de un punto central, como las aspas de un molino', tipo:'Rotación' },
];
/* Los 3 lados de un triángulo real deben cumplir la desigualdad triangular
   (la suma de dos lados cualesquiera debe superar siempre al tercero) o el
   "triángulo" descrito no podría existir geométricamente — bug encontrado
   en la auditoría: los rangos fijos anteriores para ISÓSCELES (c en 3-10
   sin relación con 2×a) y ESCALENO (3-6, 7-10, 11-14 fijos) a veces
   generaban lados como 3,3,10 o 3,7,14 que NO forman un triángulo real
   (3+3=6 no supera a 10; 3+7=10 no supera a 14). Ahora se usa muestreo por
   rechazo: se generan los 3 lados y se descartan las combinaciones que no
   cumplan la desigualdad triangular (o que no correspondan realmente al
   tipo pedido), hasta obtener una válida. */
const TRIANGULO_LADOS_BANK_GEN = function(){
  const tipo = pick(['Equilátero','Isósceles','Escaleno']);
  let a,b,c;
  if(tipo==='Equilátero'){
    a = randInt(3,10); b = a; c = a;
  }else if(tipo==='Isósceles'){
    do{
      a = randInt(3,10); b = a; c = randInt(2,12);
    }while(c===a || a+b<=c);
  }else{
    do{
      a = randInt(3,10); b = randInt(3,10); c = randInt(3,10);
    }while(a===b || b===c || a===c || a+b<=c || a+c<=b || b+c<=a);
  }
  return {a:a,b:b,c:c,tipo:tipo};
};
export function genTriangulosTeselados6Round(){
  const recurso = 'Los triángulos se clasifican según sus lados: <b>equilátero</b> (los 3 lados iguales), <b>isósceles</b> (exactamente 2 lados iguales) y <b>escaleno</b> (los 3 lados distintos). Un <b>teselado</b> (o mosaico) es un patrón que cubre una superficie repitiendo una figura sin dejar espacios ni superponerse, y esa repetición se logra con transformaciones geométricas: <b>traslación</b> (deslizar la figura), <b>reflexión</b> (voltearla como en un espejo) o <b>rotación</b> (girarla alrededor de un punto).';
  if(Math.random()<0.5){
    const t = TRIANGULO_LADOS_BANK_GEN();
    const distract = shuffle(['Equilátero','Isósceles','Escaleno'].filter(function(x){ return x!==t.tipo; }));
    const opts = shuffle([t.tipo].concat(distract)).map(function(x){ return {label:x, value:x}; });
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo tiene lados de '+t.a+', '+t.b+' y '+t.c+' unidades. ¿Qué tipo de triángulo es, según sus lados?</p>',
      options: opts, correctValue: t.tipo, speakText: '¿Qué tipo de triángulo es según sus lados?', cols:4, kind:'word',
      explain: t.tipo==='Equilátero' ? 'Los 3 lados son iguales, así que es <b>equilátero</b>.' : t.tipo==='Isósceles' ? 'Exactamente 2 lados son iguales, así que es <b>isósceles</b>.' : 'Los 3 lados son distintos, así que es <b>escaleno</b>.', recurso: recurso,
    };
  }
  const item = pick(TESELADO_TRANSFORMACIONES_BANK);
  const todos = ['Traslación','Reflexión','Rotación'];
  const distract = todos.filter(function(t){ return t!==item.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué transformación se repite en este teselado (mosaico)?</p>',
    options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Este mosaico se forma repitiendo la figura con una <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
  };
}

const ANGULO_GRADOS_BANK = [
  {grados:30,tipo:'Agudo'},{grados:45,tipo:'Agudo'},{grados:60,tipo:'Agudo'},{grados:70,tipo:'Agudo'},
  {grados:90,tipo:'Recto'},
  {grados:100,tipo:'Obtuso'},{grados:120,tipo:'Obtuso'},{grados:150,tipo:'Obtuso'},{grados:170,tipo:'Obtuso'},
  {grados:180,tipo:'Extendido'},
  {grados:360,tipo:'Completo'},
];
export function genAngulos6Round(){
  const recurso = 'Los ángulos se clasifican según su medida: <b>agudo</b> (menos de 90°), <b>recto</b> (exactamente 90°), <b>obtuso</b> (entre 90° y 180°), <b>extendido</b> (180°, una línea recta) y <b>completo</b> (360°, una vuelta entera). Dos ángulos son <b>complementarios</b> si suman 90°, y sus versiones opuestas por el vértice (cuando se cruzan dos rectas) o correspondientes (entre paralelas cortadas por una transversal) siempre miden lo mismo. Además, los ángulos interiores de un triángulo siempre suman 180°, y los de un cuadrilátero siempre suman 360° — reglas fijas que permiten calcular un ángulo desconocido sin necesidad de medirlo.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(ANGULO_GRADOS_BANK);
    const todos = ['Agudo','Recto','Obtuso','Extendido','Completo'];
    const distract = shuffle(todos.filter(function(t){ return t!==item.tipo; })).slice(0,3);
    const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:36px;">'+item.grados+'°</p><p class="prompt-hint">¿Qué tipo de ángulo es?</p>',
      options: opts, correctValue: item.tipo, speakText: 'Un ángulo de '+item.grados+' grados, ¿qué tipo de ángulo es?', cols:2, kind:'word', panel:true,
      explain: 'Un ángulo de '+item.grados+'° es un ángulo <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const a = randInt(10,80);
    const correct = 90-a;
    const opts = uniqueDistractors(correct, 1, 89, 5, 4).map(function(v){ return {label:v+'°', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un ángulo mide '+a+'°. ¿Cuánto mide el ángulo que lo complementa (para sumar 90°)?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto mide el ángulo complementario de '+a+' grados?', cols:4,
      explain: '90° - '+a+'° = <b>'+correct+'°</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const esOpuesto = Math.random()<0.5;
    const x = randInt(20,160);
    const opts = uniqueDistractors(x, 1, 179, 8, 4).map(function(v){ return {label:v+'°', value:v}; });
    const contexto = esOpuesto
      ? 'Dos rectas se cruzan formando 4 ángulos. Uno de ellos mide '+x+'°. ¿Cuánto mide el ángulo opuesto por el vértice (el que queda exactamente al frente)?'
      : 'Dos rectas paralelas son cortadas por una tercera recta (transversal). Uno de los ángulos correspondientes mide '+x+'°. ¿Cuánto mide su ángulo correspondiente?';
    return {
      promptHTML: '<p class="prompt-hint">'+contexto+'</p>',
      options: opts, correctValue: x, speakText: contexto, cols:4,
      explain: esOpuesto ? 'Los ángulos opuestos por el vértice siempre miden lo mismo: <b>'+x+'°</b>.' : 'Los ángulos correspondientes entre paralelas siempre miden lo mismo: <b>'+x+'°</b>.', recurso: recurso,
    };
  }
  const esTriangulo = Math.random()<0.5;
  if(esTriangulo){
    const a = randInt(30,90), b = randInt(30,140-Math.min(a,60));
    const correct = 180-a-b;
    const opts = uniqueDistractors(correct, 1, 150, 8, 4).map(function(v){ return {label:v+'°', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo tiene dos ángulos que miden '+a+'° y '+b+'°. ¿Cuánto mide el tercer ángulo?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto mide el tercer ángulo del triángulo?', cols:4,
      explain: 'Los ángulos interiores de un triángulo siempre suman 180°: 180° - '+a+'° - '+b+'° = <b>'+correct+'°</b>.', recurso: recurso,
    };
  }
  const a = randInt(50,100), b = randInt(50,100), c = randInt(50,100);
  const correct = 360-a-b-c;
  const opts = uniqueDistractors(correct, 1, 200, 8, 4).map(function(v){ return {label:v+'°', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un cuadrilátero tiene tres ángulos que miden '+a+'°, '+b+'° y '+c+'°. ¿Cuánto mide el cuarto ángulo?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuánto mide el cuarto ángulo del cuadrilátero?', cols:4,
    explain: 'Los ángulos interiores de un cuadrilátero siempre suman 360°: 360° - '+a+'° - '+b+'° - '+c+'° = <b>'+correct+'°</b>.', recurso: recurso,
  };
}

export function genAreaVolumen6Round(){
  const recurso = 'La <b>superficie</b> de un cuerpo 3D es la suma del área de todas sus caras: en un cubo, las 6 caras son cuadrados iguales (6 × lado × lado); en un paralelepípedo, hay 3 pares de caras rectangulares distintas. El <b>volumen</b> mide cuánto espacio ocupa el cuerpo por dentro: en el cubo es lado × lado × lado, y en el paralelepípedo es largo × ancho × alto. Área y volumen se confunden fácilmente porque ambos usan las mismas medidas, pero el área se mide en unidades cuadradas (cm²) y el volumen en unidades cúbicas (cm³).';
  const roll = Math.random();
  if(roll<0.25){
    const l = randInt(2,9);
    const area = 6*l*l;
    const opts = uniqueDistractors(area, 6, 700, 20, 4).map(function(v){ return {label:v+' cm²', value:v}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG('cubo',110)+'</div><p class="prompt-hint">Un cubo tiene lado '+l+' cm. ¿Cuál es el área total de su superficie (sus 6 caras)?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área de la superficie del cubo?', cols:2,
      explain: 'Área = 6 × lado × lado = 6 × '+l+' × '+l+' = <b>'+area+' cm²</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const l = randInt(2,8), w = randInt(2,7), h = randInt(2,6);
    const area = 2*(l*w+l*h+w*h);
    const opts = uniqueDistractors(area, 8, 700, 20, 4).map(function(v){ return {label:v+' cm²', value:v}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG('paralelepipedo',110)+'</div><p class="prompt-hint">Un paralelepípedo mide '+l+' cm de largo, '+w+' cm de ancho y '+h+' cm de alto. ¿Cuál es el área total de su superficie?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área de la superficie del paralelepípedo?', cols:2,
      explain: 'Área = 2 × (largo×ancho + largo×alto + ancho×alto) = 2 × ('+(l*w)+' + '+(l*h)+' + '+(w*h)+') = <b>'+area+' cm²</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const l = randInt(2,7);
    const vol = l*l*l;
    const opts = uniqueDistractors(vol, 8, 400, 15, 4).map(function(v){ return {label:v+' cm³', value:v}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG('cubo',110)+'</div><p class="prompt-hint">Un cubo tiene lado '+l+' cm. ¿Cuál es su volumen?</p>',
      options: opts, correctValue: vol, speakText: '¿Cuál es el volumen del cubo?', cols:2,
      explain: 'Volumen = lado × lado × lado = '+l+' × '+l+' × '+l+' = <b>'+vol+' cm³</b>.', recurso: recurso,
    };
  }
  const l = randInt(2,8), w = randInt(2,7), h = randInt(2,6);
  const vol = l*w*h;
  const opts = uniqueDistractors(vol, 8, 400, 15, 4).map(function(v){ return {label:v+' cm³', value:v}; });
  return {
    promptHTML: '<div class="shape-display">'+solid3DSVG('paralelepipedo',110)+'</div><p class="prompt-hint">Un paralelepípedo mide '+l+' cm de largo, '+w+' cm de ancho y '+h+' cm de alto. ¿Cuál es su volumen?</p>',
    options: opts, correctValue: vol, speakText: '¿Cuál es el volumen del paralelepípedo?', cols:2,
    explain: 'Volumen = largo × ancho × alto = '+l+' × '+w+' × '+h+' = <b>'+vol+' cm³</b>.', recurso: recurso,
  };
}

function doubleBarChartHTML(categorias, labelA, labelB){
  const max = Math.max.apply(null, categorias.reduce(function(arr,c){ return arr.concat([c.a,c.b]); },[]));
  const legend = '<div class="pie-legend"><span class="pie-legend-item"><span class="pie-legend-swatch" style="background:var(--primary);"></span>'+labelA+'</span><span class="pie-legend-item"><span class="pie-legend-swatch" style="background:var(--coral);"></span>'+labelB+'</span></div>';
  const bars = '<div class="bar-chart">'+categorias.map(function(c){
    const ha = Math.round((c.a/max)*70)+15, hb = Math.round((c.b/max)*70)+15;
    return '<div class="bar-col"><div class="bar-double">'+
      '<div class="bar-fill" style="height:'+ha+'px;" title="'+c.a+'"></div>'+
      '<div class="bar-fill" style="height:'+hb+'px; background:var(--coral);" title="'+c.b+'"></div>'+
    '</div><div class="bar-label">'+c.label+'</div></div>';
  }).join('')+'</div>';
  return bars+legend;
}
function pieChartHTML(categorias){
  return '<div class="shape-display">'+pieChartSVG(categorias,140)+'</div>'+
    '<div class="pie-legend">'+categorias.map(function(c){ return '<span class="pie-legend-item"><span class="pie-legend-swatch" style="background:'+c.color+';"></span>'+c.label+'</span>'; }).join('')+'</div>';
}

const DATOS_DOBLE_BANK = [
  { pregunta:'Se encuestó la mascota favorita de 6°A y 6°B.', serieA:'6°A', serieB:'6°B', categorias:[{label:'Perro',a:12,b:8},{label:'Gato',a:6,b:10},{label:'Pez',a:3,b:4}] },
  { pregunta:'Se encuestó el deporte favorito de niñas y niños de 6° básico.', serieA:'Niñas', serieB:'Niños', categorias:[{label:'Fútbol',a:5,b:14},{label:'Natación',a:10,b:6},{label:'Voleibol',a:9,b:4}] },
];
const DATOS_CIRCULAR_BANK = [
  { pregunta:'Encuesta: ¿cómo llegan los estudiantes al colegio?', categorias:[{label:'En bus',valor:40,color:'#FF6B6B'},{label:'En auto',valor:30,color:'#12A594'},{label:'Caminando',valor:20,color:'#FFB627'},{label:'En bicicleta',valor:10,color:'#7C6FF0'}] },
  { pregunta:'Encuesta: ¿cuál es el postre favorito del curso?', categorias:[{label:'Helado',valor:35,color:'#FF6B6B'},{label:'Torta',valor:25,color:'#12A594'},{label:'Fruta',valor:25,color:'#FFB627'},{label:'Galletas',valor:15,color:'#7C6FF0'}] },
];
const CONJETURAS_BANK = [
  { afirmacion:'Mientras más veces lances una moneda, la proporción de caras se acerca más al 50%', v:true },
  { afirmacion:'Si lanzas un dado muchas veces, cada número tenderá a salir cerca de 1 de cada 6 veces', v:true },
  { afirmacion:'Si lanzas una moneda solo 3 veces, es seguro que saldrán exactamente la mitad caras y la mitad sellos', v:false },
  { afirmacion:'Lanzar un dado una sola vez es suficiente para conocer con certeza la probabilidad real de cada número', v:false },
  { afirmacion:'Repetir un experimento muchas veces ayuda a conjeturar mejor la tendencia real de los resultados', v:true },
];
export function genDatos6Round(){
  const recurso = 'El <b>promedio</b> de un grupo de datos se calcula sumando todos los valores y dividiendo por la cantidad de datos — es una forma de resumir un conjunto de números en uno solo. Al repetir un experimento aleatorio muchas veces (lanzar una moneda o un dado), los resultados tienden a acercarse a lo esperado, pero eso NO significa que unos pocos lanzamientos deban dar exactamente esa proporción. Un <b>gráfico de barra doble</b> compara dos grupos lado a lado en cada categoría, y un <b>gráfico circular</b> muestra cómo se reparte un total en porciones — ambos ayudan a comparar datos de un vistazo.';
  const roll = Math.random();
  if(roll<0.34){
    /* Se regenera hasta que los promedios sean distintos: con números al
       azar los dos grupos podían empatar en promedio (bug encontrado en la
       auditoría), y en ese caso el código igual declaraba "GRUPO B" como
       correcto por cómo queda la comparación `promA>promB` cuando son
       iguales — una respuesta arbitraria y matemáticamente incorrecta para
       un empate real. */
    let gA, gB, promA, promB;
    do{
      gA = [randInt(3,9),randInt(3,9),randInt(3,9),randInt(3,9)];
      gB = [randInt(3,9),randInt(3,9),randInt(3,9),randInt(3,9)];
      promA = gA.reduce(function(a,b){return a+b;},0)/gA.length;
      promB = gB.reduce(function(a,b){return a+b;},0)/gB.length;
    }while(promA===promB);
    const opts = shuffle([{label:'Grupo A', value:'A'},{label:'Grupo B', value:'B'}]);
    return {
      promptHTML: '<p class="prompt-sentence">Grupo A: '+gA.join(', ')+'</p><p class="prompt-sentence">Grupo B: '+gB.join(', ')+'</p><p class="prompt-hint">¿Cuál grupo tiene mayor promedio?</p>',
      options: opts, correctValue: promA>promB?'A':'B', speakText: '¿Cuál grupo tiene mayor promedio?', cols:2, panel:true,
      explain: 'El grupo con mayor promedio es el <b>'+(promA>promB?'Grupo A':'Grupo B')+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.6){
    const item = pick(CONJETURAS_BANK);
    const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
    return {
      promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
      options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
      explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
    };
  }
  if(roll<0.8){
    const item = pick(DATOS_DOBLE_BANK);
    const cat = pick(item.categorias);
    const correct = cat.a>cat.b ? item.serieA : item.serieB;
    const opts = shuffle([{label:item.serieA, value:item.serieA},{label:item.serieB, value:item.serieB}]);
    return {
      promptHTML: doubleBarChartHTML(item.categorias, item.serieA, item.serieB)+'<p class="prompt-hint">'+item.pregunta+' ¿Quién tuvo más en "'+cat.label+'"?</p>',
      options: opts, correctValue: correct, speakText: '¿Quién tuvo más en '+cat.label+'?', cols:2,
      explain: '<b>'+correct+'</b> tuvo más en "'+cat.label+'".', recurso: recurso,
    };
  }
  const item = pick(DATOS_CIRCULAR_BANK);
  const askMax = Math.random()<0.5;
  const target = askMax
    ? item.categorias.reduce(function(a,b){ return b.valor>a.valor?b:a; })
    : item.categorias.reduce(function(a,b){ return b.valor<a.valor?b:a; });
  const distract = item.categorias.filter(function(c){ return c.label!==target.label; }).map(function(c){ return c.label; });
  const opts = shuffle([target.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: pieChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál opción fue la '+(askMax?'más':'menos')+' elegida?</p>',
    options: opts, correctValue: target.label, speakText: '¿Cuál opción fue la '+(askMax?'más':'menos')+' elegida?', cols:2, kind:'word',
    explain: '<b>'+target.label+'</b> fue la opción '+(askMax?'más':'menos')+' elegida en esta encuesta.', recurso: recurso,
  };
}

/* ---------------- Contenido Matemática 7° Básico ----------------
   Basado en OA del Decreto 614/2013, "Bases Curriculares 7° básico a 2°
   medio" (curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/
   7-basico) — currículum distinto al Decreto 439/2012 usado en 1°-6°
   básico. 19 OA agrupados en 8 módulos:
   Números Enteros -> OA01. Fracciones y Decimales II -> OA02-03. Porcentaje
   y Potencias -> OA04-05. Álgebra I -> OA06-07. Proporciones y Ecuaciones II
   -> OA08-09. Geometría VII -> OA10-11,14 (ángulos de polígonos, círculo,
   plano cartesiano con vectores — se dejó fuera OA13 -fórmula de área de
   triángulo/paralelogramo/trapecio- porque ya se cubrió exactamente esa
   habilidad en "Medición y Área" de 5° básico, OA19-22; repetirla aquí sería
   duplicar contenido sin aportar nada nuevo). Estadística y Muestreo ->
   OA15-17 (incluye "rango", ángulo nuevo respecto al promedio ya cubierto en
   5°-6° básico). Probabilidades II -> OA18-19 (probabilidad teórica vs.
   frecuencia experimental, cuantificado como fracción — más allá de las
   conjeturas cualitativas de 6° básico).
   Quedan fuera: OA12 (construir objetos geométricos con instrumentos o
   software — producción práctica). */
export const MATE_MODULES_G7 = [
  {id:'enteros7', label:'Números Enteros', open:true, key:'enteros7'},
  {id:'fraccionesdecimales7', label:'Fracciones y Decimales II', open:true, key:'fraccionesdecimales7'},
  {id:'porcentajepotencias7', label:'Porcentaje y Potencias', open:true, key:'porcentajepotencias7'},
  {id:'algebra7', label:'Álgebra I', open:true, key:'algebra7'},
  {id:'proporcionesecuaciones7', label:'Proporciones y Ecuaciones II', open:true, key:'proporcionesecuaciones7'},
  {id:'geometria7', label:'Geometría VII', open:true, key:'geometria7'},
  {id:'estadisticamuestreo7', label:'Estadística y Muestreo', open:true, key:'estadisticamuestreo7'},
  {id:'probabilidades7', label:'Probabilidades II', open:true, key:'probabilidades7'},
];
export const MATE_POS_G7 = [
  {x:20,y:92},{x:64,y:82},{x:22,y:68},{x:66,y:54},
  {x:20,y:40},{x:64,y:28},{x:22,y:16},{x:64,y:4},
];

export function genEnteros7Round(){
  const recurso = 'Los números enteros incluyen los positivos, los negativos y el cero. Para sumar o restar enteros, es útil pensar en una recta numérica: sumar un número negativo es lo mismo que restar su valor absoluto, y restar un número negativo equivale a sumarlo. En situaciones de la vida real (temperatura bajo cero, profundidad bajo el nivel del mar, una deuda), los números negativos representan valores por debajo de un punto de referencia (el cero), y las operaciones con enteros permiten calcular cómo cambia esa cantidad.';
  const roll = Math.random();
  if(roll<0.5){
    const a = randInt(-20,20), b = randInt(-20,20);
    const suma = Math.random()<0.5;
    const correct = suma ? a+b : a-b;
    const opts = uniqueDistractors(correct, -60, 60, 6, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+' '+(suma?'+':'-')+' ('+b+')</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+a+' '+(suma?'más':'menos')+' '+b+'?', cols:4,
      explain: a+' '+(suma?'+':'-')+' ('+b+') = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const contexto = pick([
    { unidad:'metros sobre el nivel del mar', inicio:randInt(-30,-5), cambio:randInt(10,40) },
    { unidad:'grados de temperatura', inicio:randInt(-15,-1), cambio:randInt(5,25) },
    { unidad:'pesos de deuda (en miles)', inicio:randInt(-50,-5), cambio:randInt(10,60) },
  ]);
  const correct = contexto.inicio + contexto.cambio;
  const opts = uniqueDistractors(correct, -100, 100, 8, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un valor comienza en '+contexto.inicio+' '+contexto.unidad+', y luego sube '+contexto.cambio+'. ¿En qué valor queda?</p>',
    options: opts, correctValue: correct, speakText: '¿En qué valor queda?', cols:4,
    explain: contexto.inicio+' + '+contexto.cambio+' = <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genFraccionesDecimales7Round(){
  const recurso = 'Para <b>multiplicar fracciones</b>, se multiplican los numeradores entre sí y los denominadores entre sí. Para <b>dividir fracciones</b>, se multiplica la primera por el inverso (recíproco) de la segunda — por eso "dividir es multiplicar por la fracción invertida". Al <b>multiplicar o dividir decimales</b>, conviene pensar en cuántas cifras decimales tiene el resultado, sumando (al multiplicar) o restando (al dividir) la cantidad de decimales de cada número.';
  const roll = Math.random();
  if(roll<0.34){
    const d1 = pick([2,3,4,5]), n1 = randInt(1,d1-1);
    const d2 = pick([2,3,4,5]), n2 = randInt(1,d2-1);
    const numResult = n1*n2, denResult = d1*d2;
    const opts = uniqueDistractors(numResult, 1, denResult*2, 2, 4).map(function(v){ return {label:v+'/'+denResult, value:v+'/'+denResult}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">'+n1+'/'+d1+' × '+n2+'/'+d2+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: numResult+'/'+denResult, speakText: '¿Cuánto es '+n1+'/'+d1+' por '+n2+'/'+d2+'?', cols:4,
      explain: 'Se multiplican los numeradores entre sí y los denominadores entre sí: '+n1+'×'+n2+' / '+d1+'×'+d2+' = <b>'+numResult+'/'+denResult+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const d1 = pick([2,3,4]), n1 = randInt(1,d1-1);
    const d2 = pick([2,3,4]), n2 = randInt(1,d2-1);
    const numResult = n1*d2, denResult = d1*n2;
    const opts = uniqueDistractors(numResult, 1, denResult*2, 2, 4).map(function(v){ return {label:v+'/'+denResult, value:v+'/'+denResult}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">'+n1+'/'+d1+' ÷ '+n2+'/'+d2+'</p><p class="prompt-hint">¿Cuánto es? (Pista: multiplica por la fracción invertida)</p>',
      options: opts, correctValue: numResult+'/'+denResult, speakText: '¿Cuánto es '+n1+'/'+d1+' dividido '+n2+'/'+d2+'?', cols:4,
      explain: 'Dividir por una fracción es multiplicar por su inverso: '+n1+'/'+d1+' × '+d2+'/'+n2+' = <b>'+numResult+'/'+denResult+'</b>.',
      recurso: recurso,
    };
  }
  const dec = randInt(11,99)/10;
  const nat = randInt(2,9);
  const multiplicar = Math.random()<0.5;
  const correct = multiplicar ? Math.round(dec*nat*10)/10 : Math.round(dec/nat*100)/100;
  const opts = uniqueDistractors(Math.round(correct*100), 5, 9000, 20, 4).map(function(v){ return {label:(v/100).toFixed(2), value:(v/100).toFixed(2)}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+dec.toFixed(1)+' '+(multiplicar?'×':'÷')+' '+nat+'</p><p class="prompt-hint">¿Cuánto es?</p>',
    options: opts, correctValue: correct.toFixed(2), speakText: '¿Cuánto es '+dec.toFixed(1)+' '+(multiplicar?'por':'dividido')+' '+nat+'?', cols:4,
    explain: dec.toFixed(1)+' '+(multiplicar?'×':'÷')+' '+nat+' = <b>'+correct.toFixed(2)+'</b>.',
    recurso: recurso,
  };
}

export function genPorcentajePotencias7Round(){
  const recurso = 'El <b>porcentaje</b> de un número se calcula multiplicando el número por el porcentaje y dividiendo por 100 (por ejemplo, el 20% de 150 es 150×20÷100=30). Las <b>potencias de base 10</b> siguen un patrón simple: 10 elevado a un exponente n es un 1 seguido de n ceros (10³=1000), lo que se usa mucho para representar números grandes de forma más compacta.';
  if(Math.random()<0.5){
    const n = pick([50,80,120,150,200,250,400,500]);
    const p = pick([5,10,15,20,30,40,60,75]);
    const correct = Math.round(n*p)/100;
    const opts = uniqueDistractors(Math.round(correct*10), 1, 4000, Math.max(5,Math.round(correct)), 4).map(function(v){ return {label:(v/10).toString(), value:(v/10).toString()}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuánto es el '+p+'% de '+n+'?</p>',
      options: opts, correctValue: correct.toString(), speakText: '¿Cuánto es el '+p+' por ciento de '+n+'?', cols:4,
      explain: 'El '+p+'% de '+n+' es <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const exp = randInt(1,5);
  const correct = Math.pow(10,exp);
  const distractExps = shuffle([0,1,2,3,4,5,6].filter(function(e){ return e!==exp; })).slice(0,3);
  const optsObj = shuffle([exp].concat(distractExps)).map(function(e){ const v = Math.pow(10,e); return {label:v.toLocaleString('es-CL'), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:32px;">10<sup>'+exp+'</sup></p><p class="prompt-hint">¿Cuánto es esta potencia de base 10?</p>',
    options: optsObj, correctValue: correct, speakText: '¿Cuánto es 10 elevado a '+exp+'?', cols:4,
    explain: '10 elevado a '+exp+' es un 1 seguido de '+exp+' ceros: <b>'+correct.toLocaleString('es-CL')+'</b>.',
    recurso: recurso,
  };
}

const FRASE_ALGEBRA7_BANK = [
  { frase:'El triple de un número menos 7', expresion:'3n - 7' },
  { frase:'La mitad de un número más 6', expresion:'n ÷ 2 + 6' },
  { frase:'El cuádruple de un número más 2', expresion:'4n + 2' },
  { frase:'Un número disminuido en 9', expresion:'n - 9' },
  { frase:'El doble de un número aumentado en 3', expresion:'2n + 3' },
];
export function genAlgebra7Round(){
  const recurso = 'Una <b>expresión algebraica</b> traduce una frase en palabras a símbolos matemáticos, usando una letra (como "n") para representar un número desconocido — por ejemplo, "el doble de un número más 3" se escribe 2n+3. Los <b>términos semejantes</b> son los que tienen la misma parte literal (como 3x y 5x); para reducirlos, se suman o restan solo sus coeficientes (los números que acompañan a la letra), dejando la parte literal sin cambios.';
  if(Math.random()<0.5){
    const item = pick(FRASE_ALGEBRA7_BANK);
    const distract = shuffle(FRASE_ALGEBRA7_BANK.filter(function(f){ return f.expresion!==item.expresion; })).slice(0,3).map(function(f){ return f.expresion; });
    const opts = shuffle([item.expresion].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.frase+'"</p><p class="prompt-hint">¿Qué expresión algebraica representa esta frase? (n = el número)</p>',
      options: opts, correctValue: item.expresion, speakText: item.frase, cols:2,
      explain: '"'+item.frase+'" se escribe como <b>'+item.expresion+'</b>.',
      recurso: recurso,
    };
  }
  const a = randInt(2,9), b = randInt(2,9);
  const c = randInt(1,15);
  const correctA = a+b;
  const opts = uniqueDistractors(correctA, 2, 30, 3, 4).map(function(v){ return {label:v+'x', value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+a+'x + '+b+'x + '+c+'</p><p class="prompt-hint">Al reunir los términos semejantes, ¿cuál es el coeficiente que acompaña a la "x"?</p>',
    options: opts, correctValue: correctA, speakText: '¿Cuál es el coeficiente de equis, al reunir los términos semejantes?', cols:4,
    explain: a+'x + '+b+'x = <b>'+correctA+'x</b> (se suman los coeficientes de los términos con la misma parte literal); el '+c+' no cambia porque no tiene "x".',
    recurso: recurso,
  };
}

const PROPORCION_BANK = [
  { contexto:'El precio total de una compra y la cantidad de artículos comprados (a más artículos, más precio)', tipo:'DIRECTA' },
  { contexto:'La velocidad de un auto y el tiempo que tarda en llegar a un destino fijo (a más velocidad, menos tiempo)', tipo:'INVERSA' },
  { contexto:'La cantidad de trabajadores en una tarea y el tiempo que toma terminarla, si todos trabajan al mismo ritmo (a más trabajadores, menos tiempo)', tipo:'INVERSA' },
  { contexto:'La distancia recorrida y el tiempo, a una velocidad constante (a más tiempo, más distancia)', tipo:'DIRECTA' },
  { contexto:'La cantidad de horas trabajadas y el pago total, si el pago por hora es fijo (a más horas, más pago)', tipo:'DIRECTA' },
];
export function genProporcionesEcuaciones7Round(){
  const recurso = 'En una <b>proporción directa</b>, cuando una cantidad aumenta, la otra también aumenta en la misma proporción (a más horas trabajadas, más pago). En una <b>proporción inversa</b>, cuando una cantidad aumenta, la otra disminuye (a más velocidad, menos tiempo de viaje). Para resolver una <b>ecuación</b> como ax+b=c, se despeja la incógnita aplicando operaciones inversas en orden contrario: primero se resta b a ambos lados, y luego se divide por a.';
  if(Math.random()<0.5){
    const item = pick(PROPORCION_BANK);
    const opts = shuffle([{label:'Proporción directa', value:'DIRECTA'},{label:'Proporción inversa', value:'INVERSA'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.contexto+'.</p><p class="prompt-hint">¿Es una proporción directa o inversa?</p>',
      options: opts, correctValue: item.tipo, speakText: '¿Es una proporción directa o inversa?', cols:2, panel:true,
      explain: 'Esta es una proporción <b>'+item.tipo.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const x = randInt(1,25);
  const coef = randInt(2,8);
  const suma = randInt(1,30);
  const total = coef*x+suma;
  const opts = uniqueDistractors(x, 0, 80, 4, 4).map(function(v){ return {label:'x = '+v, value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+coef+'x + '+suma+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
    options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
    explain: '('+total+' - '+suma+') ÷ '+coef+' = <b>'+x+'</b>, así que x = '+x+'.',
    recurso: recurso,
  };
}

const POLIGONO_ANGULOS_BANK = [
  { lados:3, nombre:'Triángulo' }, { lados:4, nombre:'Cuadrilátero' },
  { lados:5, nombre:'Pentágono' }, { lados:6, nombre:'Hexágono' }, { lados:8, nombre:'Octógono' },
];
export function genGeometria7Round(){
  const recurso = 'La suma de los <b>ángulos interiores</b> de un polígono se calcula con la fórmula (n-2)×180°, donde n es el número de lados. En un círculo, el <b>diámetro</b> es siempre el doble del <b>radio</b> (el radio es la distancia del centro al borde, el diámetro atraviesa el círculo entero pasando por el centro). En el <b>plano cartesiano</b>, cuando un punto se desplaza según un vector (dx, dy), su nueva posición se obtiene sumando dx a la primera coordenada y dy a la segunda.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(POLIGONO_ANGULOS_BANK);
    const sumaInterior = (item.lados-2)*180;
    const opts = uniqueDistractors(sumaInterior, 90, 1500, 90, 4).map(function(v){ return {label:v+'°', value:v}; });
    return {
      promptHTML: '<p class="prompt-sentence">Un '+item.nombre.toLowerCase()+' tiene '+item.lados+' lados.</p><p class="prompt-hint">¿Cuánto suman sus ángulos interiores? (Fórmula: (n - 2) × 180°)</p>',
      options: opts, correctValue: sumaInterior, speakText: '¿Cuánto suman los ángulos interiores de un '+item.nombre.toLowerCase()+'?', cols:4,
      explain: '('+item.lados+' - 2) × 180° = <b>'+sumaInterior+'°</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const radio = randInt(2,12);
    const diametro = radio*2;
    const preguntaDiametro = Math.random()<0.5;
    const correct = preguntaDiametro ? diametro : radio;
    const opts = uniqueDistractors(correct, 1, 30, 2, 4).map(function(v){ return {label:v+' cm', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un círculo tiene '+(preguntaDiametro?'radio':'diámetro')+' de '+(preguntaDiametro?radio:diametro)+' cm. ¿Cuál es su '+(preguntaDiametro?'diámetro':'radio')+'?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la medida que falta?', cols:4,
      explain: preguntaDiametro ? 'El diámetro es el doble del radio: '+radio+' × 2 = <b>'+diametro+' cm</b>.' : 'El radio es la mitad del diámetro: '+diametro+' ÷ 2 = <b>'+radio+' cm</b>.',
      recurso: recurso,
    };
  }
  const col = randInt(1,10), row = randInt(1,10);
  const dx = randInt(-3,3) || 1, dy = randInt(-3,3) || 2;
  const opts = shuffle([(col+dx)+','+(row+dy), col+','+(row+dy), (col+dx)+','+row, (col-dx)+','+(row-dy)]).map(function(c){ return {label:'('+c+')', value:c}; });
  return {
    promptHTML: '<p class="prompt-hint">Un punto está en la coordenada ('+col+', '+row+'). Si se desplaza según el vector ('+dx+', '+dy+'), ¿en qué coordenada queda?</p>',
    options: opts, correctValue: (col+dx)+','+(row+dy), speakText: '¿En qué coordenada queda el punto?', cols:2, panel:true,
    explain: 'Sumas '+dx+' a la primera coordenada y '+dy+' a la segunda: ('+(col+dx)+', '+(row+dy)+').',
    recurso: recurso,
  };
}

export function genEstadisticaMuestreo7Round(){
  const recurso = 'Para calcular el <b>porcentaje</b> que representa una categoría dentro de una encuesta, se divide su valor por el total y se multiplica por 100. El <b>rango</b> de un conjunto de datos es la diferencia entre el valor máximo y el valor mínimo, y da una idea rápida de cuánto varían los datos. Un <b>gráfico de barras</b> permite comparar categorías de un vistazo, mientras que una <b>tabla de frecuencias</b> es más precisa para leer valores exactos, aunque menos inmediata visualmente.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const cat = pick(item.categorias);
    const pctExacto = Math.round((cat.valor/total)*1000)/10;
    const opts = uniqueDistractors(Math.round(pctExacto*10), 10, 900, 40, 4).map(function(v){ return {label:(v/10)+'%', value:(v/10)+'%'}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' Aproximadamente, ¿qué porcentaje del total eligió "'+cat.label+'"?</p>',
      options: opts, correctValue: pctExacto+'%', speakText: '¿Qué porcentaje eligió '+cat.label+'?', cols:4,
      explain: cat.valor+' de '+total+' es aproximadamente <b>'+pctExacto+'%</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const datos = Array.from({length:5}, function(){ return randInt(1,20); });
    const rango = Math.max.apply(null,datos) - Math.min.apply(null,datos);
    const opts = uniqueDistractors(rango, 0, 25, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+datos.join(', ')+'</p><p class="prompt-hint">¿Cuál es el rango de este conjunto de datos (el valor máximo menos el valor mínimo)?</p>',
      options: opts, correctValue: rango, speakText: '¿Cuál es el rango de estos datos?', cols:4,
      explain: 'Rango = máximo - mínimo = '+Math.max.apply(null,datos)+' - '+Math.min.apply(null,datos)+' = <b>'+rango+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(DATOS_ENCUESTA);
  const opts = shuffle([{label:'Tabla de frecuencias', value:'TABLA'},{label:'Gráfico de barras', value:'GRAFICO'}]);
  const preguntaTabla = Math.random()<0.5;
  return {
    promptHTML: '<p class="prompt-hint">Si quieres mostrar visualmente, de un vistazo, qué categoría fue la más popular en una encuesta, ¿qué representación es más útil: una tabla de frecuencias o un gráfico de barras?</p>',
    options: opts, correctValue: 'GRAFICO', speakText: '¿Qué representación es más útil para comparar categorías de un vistazo?', cols:2, panel:true,
    explain: 'Un <b>gráfico de barras</b> permite comparar visualmente las categorías de un vistazo; la tabla es más precisa para leer valores exactos, pero menos inmediata para comparar.',
    recurso: recurso,
  };
}

const PROBABILIDAD_TEORICA_BANK = [
  { total:8, favorable:3, contexto:'bolitas rojas de un total de 8 bolitas en una bolsa' },
  { total:6, favorable:1, contexto:'la cara marcada con el número 6, al lanzar un dado normal' },
  { total:10, favorable:4, contexto:'cartas de color azul de un mazo de 10 cartas' },
  { total:4, favorable:1, contexto:'obtener cara, al lanzar una moneda (dos resultados posibles, dividido en 4 para simplificar la fracción)' },
];
export function genProbabilidades7Round(){
  const recurso = 'La <b>probabilidad teórica</b> de un evento se calcula dividiendo los casos favorables por el total de casos posibles (por ejemplo, la probabilidad de sacar una bolita roja de 8 bolitas, si 3 son rojas, es 3/8). La <b>frecuencia experimental</b> es lo que realmente ocurre al repetir un experimento un número de veces, y es normal que no coincida exactamente con la probabilidad teórica en pocas repeticiones — mientras más veces se repite el experimento, más se acerca la frecuencia experimental a la probabilidad teórica.';
  if(Math.random()<0.5){
    const item = pick(PROBABILIDAD_TEORICA_BANK.slice(0,3));
    const opts = uniqueDistractors(item.favorable, 1, item.total-1, 1, Math.min(4,item.total-1)).map(function(v){ return {label:v+'/'+item.total, value:v+'/'+item.total}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál es la probabilidad teórica de obtener '+item.contexto+'?</p>',
      options: opts, correctValue: item.favorable+'/'+item.total, speakText: '¿Cuál es la probabilidad de obtener '+item.contexto+'?', cols:4,
      explain: 'La probabilidad teórica es (casos favorables) ÷ (casos posibles) = <b>'+item.favorable+'/'+item.total+'</b>.',
      recurso: recurso,
    };
  }
  const teorica = pick([0.5, 0.25, 0.75]);
  const lanzamientos = pick([20,40,50,100]);
  const experimental = Math.round(teorica*lanzamientos + (randInt(-3,3)));
  const opts = shuffle([{label:'Sí, es esperable que haya una pequeña diferencia', value:true},{label:'No, siempre deben ser exactamente iguales', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">La probabilidad teórica de un evento es '+(teorica*100)+'%. Al repetir el experimento '+lanzamientos+' veces, ocurrió '+experimental+' veces (en vez de exactamente '+Math.round(teorica*lanzamientos)+'). ¿Es normal que exista esta pequeña diferencia entre la frecuencia experimental y la probabilidad teórica?</p>',
    options: opts, correctValue: true, speakText: '¿Es normal que exista esta diferencia?', cols:2, panel:true,
    explain: 'Sí: la frecuencia experimental se acerca a la probabilidad teórica mientras más se repite el experimento, pero rara vez coincide exactamente en una cantidad limitada de repeticiones.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Matemática 8° Básico ----------------
   Basado en OA del Decreto 614/2013 (curriculumnacional.cl/curriculum/
   7o-basico-2o-medio/matematica/8-basico).
   Enteros y Racionales -> MA08 OA01-02 (multiplicar/dividir enteros con
   regla de signos; operar racionales). Potencias y Raíces -> OA03-04
   (potencias de base natural y exponente hasta 3, multiplicación de
   potencias de igual base, raíces cuadradas de cuadrados perfectos).
   Variaciones Porcentuales -> OA05 (aumentos y descuentos porcentuales).
   Álgebra y Ecuaciones VIII -> OA06,08-09 (reducir expresiones, ecuaciones
   e inecuaciones lineales). Funciones -> OA07,10 (noción de función como
   regla entre variables, función lineal f(x)=ax y función afín f(x)=ax+b,
   evaluar en un valor). Geometría VIII: Pitágoras y Volumen -> OA11-12
   (teorema de Pitágoras con tríos pitagóricos, volumen de prismas rectos y
   cilindros). Transformaciones Geométricas -> OA13-14 (traslación/
   rotación/reflexión descritas con puntos y vectores, presentadas como
   identificar el movimiento a partir de una descripción — mismo criterio
   que Geometría V de 5° básico, sin comparar imágenes animadas).
   Estadística y Combinatoria -> OA15-17 (mediana/cuartiles como posición,
   principio combinatorio multiplicativo, detección de gráficos engañosos). */
export const MATE_MODULES_G8 = [
  {id:'enterosracionales8', label:'Enteros y Racionales', open:true, key:'enterosracionales8'},
  {id:'potenciasraices8', label:'Potencias y Raíces', open:true, key:'potenciasraices8'},
  {id:'variacionesporcentuales8', label:'Variaciones Porcentuales', open:true, key:'variacionesporcentuales8'},
  {id:'algebra8', label:'Álgebra y Ecuaciones VIII', open:true, key:'algebra8'},
  {id:'funciones8', label:'Funciones', open:true, key:'funciones8'},
  {id:'geometria8', label:'Geometría VIII: Pitágoras y Volumen', open:true, key:'geometria8'},
  {id:'transformaciones8', label:'Transformaciones Geométricas', open:true, key:'transformaciones8'},
  {id:'estadisticacombinatoria8', label:'Estadística y Combinatoria', open:true, key:'estadisticacombinatoria8'},
];
export const MATE_POS_G8 = [
  {x:20,y:92},{x:64,y:82},{x:22,y:68},{x:66,y:54},
  {x:20,y:40},{x:64,y:28},{x:22,y:16},{x:64,y:4},
];

export function genEnterosRacionales8Round(){
  const recurso = 'Los <b>números enteros</b> incluyen a los positivos, los negativos y el cero. Al multiplicar o dividir dos enteros, hay una regla de signos: si ambos tienen el <b>mismo signo</b> (positivo×positivo o negativo×negativo), el resultado es positivo; si tienen <b>signos distintos</b>, el resultado es negativo. Esta regla se aplica igual en la multiplicación y en la división. Los <b>números racionales</b> (fracciones) también se pueden multiplicar entre sí: para eso se multiplican los numeradores entre sí y los denominadores entre sí, sin necesidad de buscar un denominador común (eso solo es necesario para sumar o restar fracciones). Estas operaciones son la base para resolver ecuaciones y problemas más complejos en los años siguientes.';
  if(Math.random()<0.55){
    const a = randInt(2,9) * (Math.random()<0.5 ? -1 : 1);
    const b = randInt(2,9) * (Math.random()<0.5 ? -1 : 1);
    const esDiv = Math.random()<0.4;
    let correct, exprHTML, exprSpeak;
    if(esDiv){
      const producto = a*b;
      correct = a;
      exprHTML = '('+producto+') ÷ ('+b+')';
      exprSpeak = producto+' dividido en '+b;
    } else {
      correct = a*b;
      exprHTML = '('+a+') × ('+b+')';
      exprSpeak = a+' por '+b;
    }
    const distractCandidates = [correct*-1];
    while(distractCandidates.length<6){ distractCandidates.push(correct + pick([-2,-1,1,2])*randInt(1,4)); }
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); if(finales.length===3) break; }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-word">'+exprHTML+' = ?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+exprSpeak+'?', cols:4,
      explain: exprHTML+' = <b>'+correct+'</b>. Regla de signos: signos iguales dan positivo, signos distintos dan negativo.',
      recurso: recurso,
    };
  }
  const num1 = randInt(1,5), den1 = pick([2,3,4,5]);
  const num2 = randInt(1,5), den2 = pick([2,3,4,5]);
  const numR = num1*num2, denR = den1*den2;
  const correct = numR+'/'+denR;
  const distractSet = [(num1*den2)+'/'+(den1*num2), (num1+num2)+'/'+(den1+den2), (numR+den1)+'/'+denR];
  const finales = [];
  for(const d of distractSet){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
  while(finales.length<3){
    const cand = (numR+randInt(1,4))+'/'+denR;
    if(cand!==correct && finales.indexOf(cand)===-1) finales.push(cand);
  }
  const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-word">'+num1+'/'+den1+' × '+num2+'/'+den2+' = ?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuánto es '+num1+' '+den1+'avos por '+num2+' '+den2+'avos?', cols:4,
    explain: 'Para multiplicar fracciones, se multiplican los numeradores entre sí y los denominadores entre sí: '+num1+'×'+num2+'='+numR+' y '+den1+'×'+den2+'='+denR+', resultado <b>'+correct+'</b> (sin simplificar).',
    recurso: recurso,
  };
}

export function genPotenciasRaices8Round(){
  const recurso = 'Una <b>potencia</b> es una forma corta de escribir una multiplicación repetida: 5³ significa 5×5×5. El número de abajo es la <b>base</b> y el de arriba es el <b>exponente</b>, que indica cuántas veces se multiplica la base por sí misma. Cuando se multiplican dos potencias de <b>igual base</b>, los exponentes simplemente se suman (5²×5³ = 5⁵), porque en el fondo se están juntando dos grupos de multiplicaciones de la misma base. La <b>raíz cuadrada</b> es la operación inversa de elevar al cuadrado: preguntarse "¿cuál es la raíz cuadrada de 49?" es lo mismo que preguntarse "¿qué número multiplicado por sí mismo da 49?" (la respuesta es 7). Estas herramientas se usan constantemente en geometría, por ejemplo para calcular longitudes con el teorema de Pitágoras.';
  const roll = Math.random();
  if(roll<0.4){
    const base = randInt(2,6), exp = randInt(2,3);
    const correct = Math.pow(base,exp);
    const distractCandidates = [base*exp, Math.pow(base,exp)+base, Math.pow(base,exp-1), Math.pow(base+1,exp), correct+base, correct-exp];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && d>0 && finales.indexOf(d)===-1) finales.push(d); if(finales.length===3) break; }
    while(finales.length<3){ const c = correct+randInt(1,10); if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-word">'+base+'<sup>'+exp+'</sup> = ?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+base+' elevado a '+exp+'?', cols:4,
      explain: base+'<sup>'+exp+'</sup> significa multiplicar '+base+' por sí mismo '+exp+' veces = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const base = randInt(2,7), e1 = randInt(1,3), e2 = randInt(1,3);
    const correctExp = e1+e2;
    const distractExps = [e1*e2, correctExp+1, Math.abs(e1-e2)||correctExp+2];
    const finales = [];
    for(const d of distractExps){ if(d!==correctExp && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const c = correctExp+randInt(2,4); if(finales.indexOf(c)===-1 && c!==correctExp) finales.push(c); }
    const opts = shuffle([correctExp].concat(finales.slice(0,3))).map(function(e){ return {label:base+'^'+e, value:e}; });
    return {
      promptHTML: '<p class="prompt-word">'+base+'<sup>'+e1+'</sup> × '+base+'<sup>'+e2+'</sup> = ?</p><p class="prompt-hint">Elige la potencia equivalente.</p>',
      options: opts, correctValue: correctExp, speakText: base+' elevado a '+e1+' por '+base+' elevado a '+e2, cols:4,
      explain: 'Al multiplicar potencias de la misma base, los exponentes se suman: '+e1+'+'+e2+' = <b>'+correctExp+'</b>, es decir '+base+'^'+correctExp+'.',
      recurso: recurso,
    };
  }
  const raiz = randInt(2,12);
  const cuadrado = raiz*raiz;
  const finales = [];
  let guardRaiz = 0;
  while(finales.length<3 && guardRaiz<50){
    guardRaiz++;
    const d = raiz + pick([-2,-1,1,2])*randInt(1,2);
    if(d>0 && d!==raiz && finales.indexOf(d)===-1) finales.push(d);
  }
  const opts = shuffle([raiz].concat(finales)).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-word">√'+cuadrado+' = ?</p>',
    options: opts, correctValue: raiz, speakText: '¿Cuánto es la raíz cuadrada de '+cuadrado+'?', cols:4,
    explain: 'La raíz cuadrada de '+cuadrado+' es <b>'+raiz+'</b>, porque '+raiz+' × '+raiz+' = '+cuadrado+'.',
    recurso: recurso,
  };
}

export function genVariacionesPorcentuales8Round(){
  const recurso = 'Un <b>porcentaje</b> es una forma de expresar una parte de 100 (el 20% es lo mismo que 20/100). Para calcular un aumento o descuento porcentual, primero se calcula cuánto representa ese porcentaje del precio original, y luego ese "cambio" se suma (si es un aumento) o se resta (si es un descuento) al precio original. Este tipo de cálculo se usa todos los días: en ofertas de tiendas, en el IVA de una boleta, o en el interés de un préstamo. Entender la diferencia entre "aumentar un 20%" y "llegar al 20% del valor" es clave para no confundirse con los números en situaciones reales.';
  const precios = [1000,2000,4000,5000,8000,10000,20000];
  const precio = pick(precios);
  const p = pick([10,20,25,50]);
  const esAumento = Math.random()<0.5;
  const cambio = precio*p/100;
  const correct = esAumento ? precio+cambio : precio-cambio;
  const distract = [esAumento ? precio-cambio : precio+cambio, precio, correct + pick([-1,1])*precio/10];
  const finales = [];
  for(const d of distract){ if(d!==correct && finales.indexOf(d)===-1 && d>0) finales.push(d); }
  while(finales.length<3){ const c = correct + randInt(1,5)*100; if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
  const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:'$'+v.toLocaleString('es-CL'), value:v}; });
  const accion = esAumento ? 'sube' : 'baja (descuento)';
  return {
    promptHTML: '<p class="prompt-hint">Un producto cuesta $'+precio.toLocaleString('es-CL')+' y su precio '+accion+' un '+p+'%. ¿Cuál es el precio final?</p>',
    options: opts, correctValue: correct, speakText: 'Un producto cuesta '+precio+' pesos y su precio '+(esAumento?'sube':'baja')+' un '+p+' por ciento. ¿Cuál es el precio final?', cols:2,
    explain: 'El '+p+'% de $'+precio.toLocaleString('es-CL')+' es $'+cambio.toLocaleString('es-CL')+'. '+(esAumento?'Sumando':'Restando')+' queda <b>$'+correct.toLocaleString('es-CL')+'</b>.',
    recurso: recurso,
  };
}

export function genAlgebra8Round(){
  const recurso = 'El <b>álgebra</b> usa letras (como x) para representar números que no conocemos todavía. Un <b>término semejante</b> es aquel que tiene exactamente la misma letra (o combinación de letras): 3x y 5x son semejantes y se pueden sumar directamente (3x+5x=8x), igual que sumarías 3 manzanas más 5 manzanas. Una <b>ecuación</b> es una igualdad con una incógnita, y resolverla significa encontrar el valor de esa incógnita que hace verdadera la igualdad — para eso se van "despejando" los números que acompañan a la x, aplicando la misma operación a ambos lados de la igualdad. Una <b>inecuación</b> es parecida, pero en vez de un signo igual usa uno de mayor/menor, y su solución no es un solo número sino un conjunto de valores posibles.';
  const roll = Math.random();
  if(roll<0.4){
    const a = randInt(2,7), b = randInt(2,7), c = randInt(1,9);
    const coef = a+b;
    const opts = shuffle([coef+'x + '+c, (a*b)+'x + '+c, coef+'x + '+(c+a), a+'x + '+(b+c)]).filter(function(v,i,arr){ return arr.indexOf(v)===i; }).slice(0,4).map(function(v){ return {label:v, value:v}; });
    const correct = coef+'x + '+c;
    if(!opts.some(function(o){ return o.value===correct; })) opts[0] = {label:correct, value:correct};
    return {
      promptHTML: '<p class="prompt-word">'+a+'x + '+b+'x + '+c+' = ?</p><p class="prompt-hint">Reduce los términos semejantes.</p>',
      options: shuffle(opts), correctValue: correct, speakText: 'Reduce '+a+' equis más '+b+' equis más '+c, cols:2, kind:'word',
      explain: 'Los términos con x se suman entre sí: '+a+'x + '+b+'x = '+coef+'x. El resultado es <b>'+coef+'x + '+c+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const x = randInt(2,9), a = randInt(2,6), b = randInt(1,15);
    const resultado = a*x+b;
    const finales = [];
    let guardEc = 0;
    while(finales.length<3 && guardEc<50){
      guardEc++;
      const d = x + pick([-2,-1,1,2])*randInt(1,2);
      if(d>0 && d!==x && finales.indexOf(d)===-1) finales.push(d);
    }
    const opts = shuffle([x].concat(finales)).map(function(v){ return {label:'x = '+v, value:v}; });
    return {
      promptHTML: '<p class="prompt-word">'+a+'x + '+b+' = '+resultado+'</p><p class="prompt-hint">¿Cuánto vale x?</p>',
      options: opts, correctValue: x, speakText: a+' equis más '+b+' igual '+resultado+'. ¿Cuánto vale equis?', cols:4,
      explain: 'Restando '+b+' a ambos lados queda '+a+'x = '+(resultado-b)+'; dividiendo por '+a+', <b>x = '+x+'</b>.',
      recurso: recurso,
    };
  }
  const x = randInt(3,9), a = randInt(2,5);
  const limite = a*x;
  const correctLabel = 'x < '+x;
  const opts = shuffle([
    {label:'x < '+x, value:'menor'},
    {label:'x > '+x, value:'mayor'},
    {label:'x = '+x, value:'igual'},
    {label:'x < '+(x+a), value:'otro'},
  ]);
  return {
    promptHTML: '<p class="prompt-word">'+a+'x < '+limite+'</p><p class="prompt-hint">¿Qué valores de x cumplen esta inecuación?</p>',
    options: opts, correctValue: 'menor', speakText: a+' equis menor que '+limite+'. ¿Qué valores de equis cumplen la inecuación?', cols:2, kind:'word',
    explain: 'Dividiendo ambos lados por '+a+' (positivo, así que la desigualdad se mantiene): <b>'+correctLabel+'</b>.',
    recurso: recurso,
  };
}

export function genFunciones8Round(){
  const recurso = 'Una <b>función</b> es como una máquina: entra un número (x) y sale otro número, siguiendo siempre la misma regla, escrita como f(x). Por ejemplo, si f(x) = 2x, esa "máquina" siempre duplica el número que entra: f(3) = 6, f(10) = 20. Una <b>función lineal</b> (f(x) = ax) solo multiplica x por un número fijo; una <b>función afín</b> (f(x) = ax + b) hace lo mismo pero además suma una constante fija al final. Para calcular f de un valor específico, simplemente se reemplaza la x por ese valor y se resuelve la operación paso a paso. Las funciones sirven para modelar situaciones reales, como el costo total según la cantidad de productos comprados (donde b sería un costo fijo, como el envío).';
  if(Math.random()<0.55){
    const a = randInt(2,6), x = randInt(1,9);
    const correct = a*x;
    const distractCandidates = [a+x, correct+a, correct-a, a*(x+1)];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && d>0 && finales.indexOf(d)===-1) finales.push(d); if(finales.length===3) break; }
    while(finales.length<3){ const c = correct+randInt(1,8); if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-word">f(x) = '+a+'x</p><p class="prompt-hint">¿Cuánto vale f('+x+')?</p>',
      options: opts, correctValue: correct, speakText: 'Si efe de equis es '+a+' equis, ¿cuánto vale efe de '+x+'?', cols:4,
      explain: 'Se reemplaza x por '+x+': f('+x+') = '+a+' × '+x+' = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const a = randInt(2,5), b = randInt(1,9), x = randInt(1,8);
  const correct = a*x+b;
  const distractCandidates = [a*x, a*(x+b), correct+a, correct-b];
  const finales = [];
  for(const d of distractCandidates){ if(d!==correct && d>0 && finales.indexOf(d)===-1) finales.push(d); if(finales.length===3) break; }
  while(finales.length<3){ const c = correct+randInt(1,8); if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
  const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-word">f(x) = '+a+'x + '+b+'</p><p class="prompt-hint">¿Cuánto vale f('+x+')? (función afín: parte lineal más una constante)</p>',
    options: opts, correctValue: correct, speakText: 'Si efe de equis es '+a+' equis más '+b+', ¿cuánto vale efe de '+x+'?', cols:4,
    explain: 'Se reemplaza x por '+x+': f('+x+') = '+a+'×'+x+' + '+b+' = '+(a*x)+' + '+b+' = <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

const TRIOS_PITAGORICOS = [ [3,4,5], [6,8,10], [5,12,13], [9,12,15], [8,15,17] ];
export function genGeometria8Round(){
  const recurso = 'El <b>teorema de Pitágoras</b> dice que en cualquier triángulo rectángulo, el cuadrado de la hipotenusa (el lado más largo, opuesto al ángulo recto) es igual a la suma de los cuadrados de los otros dos lados (los catetos): cateto₁² + cateto₂² = hipotenusa². Con eso se puede calcular un lado desconocido si se conocen los otros dos. El <b>volumen</b> de un cuerpo geométrico mide cuánto espacio ocupa en tres dimensiones: en un prisma recto (como una caja), se calcula multiplicando el área de su base por la altura; en un cilindro, es lo mismo pero con una base circular (área = π × radio²). Estas fórmulas se usan en construcción, diseño y para calcular cuánto líquido cabe en un envase.';
  if(Math.random()<0.5){
    const trio = pick(TRIOS_PITAGORICOS);
    const correct = trio[2];
    const finales = [];
    let guardHip = 0;
    while(finales.length<3 && guardHip<50){
      guardHip++;
      const d = correct + pick([-2,-1,1,2])*randInt(1,2);
      if(d>0 && d!==correct && finales.indexOf(d)===-1) finales.push(d);
    }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v)+' cm', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo rectángulo tiene catetos de '+trio[0]+' cm y '+trio[1]+' cm. Según el teorema de Pitágoras, ¿cuánto mide su hipotenusa?</p>',
      options: opts, correctValue: correct, speakText: 'Un triángulo rectángulo tiene catetos de '+trio[0]+' y '+trio[1]+' centímetros. ¿Cuánto mide su hipotenusa?', cols:4,
      explain: 'Por Pitágoras: '+trio[0]+'² + '+trio[1]+'² = '+(trio[0]*trio[0])+' + '+(trio[1]*trio[1])+' = '+(correct*correct)+', y √'+(correct*correct)+' = <b>'+correct+' cm</b>.',
      recurso: recurso,
    };
  }
  if(Math.random()<0.5){
    const largo = randInt(3,8), ancho = randInt(2,6), alto = randInt(2,6);
    const correct = largo*ancho*alto;
    const distractCandidates = [largo*ancho+alto, (largo+ancho+alto)*2, correct+largo, correct-ancho];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && d>0 && finales.indexOf(d)===-1) finales.push(d); if(finales.length===3) break; }
    while(finales.length<3){ const c = correct+randInt(1,20); if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v)+' cm³', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un prisma recto de base rectangular mide '+largo+' cm de largo, '+ancho+' cm de ancho y '+alto+' cm de alto. ¿Cuál es su volumen?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es el volumen de un prisma de '+largo+' por '+ancho+' por '+alto+' centímetros?', cols:4,
      explain: 'Volumen del prisma = área de la base × altura = '+largo+'×'+ancho+'×'+alto+' = <b>'+correct+' cm³</b>.',
      recurso: recurso,
    };
  }
  const opts = shuffle([
    {label:'Área de la base (π×r²) multiplicada por la altura', value:'ok'},
    {label:'Perímetro de la base más la altura', value:'m1'},
    {label:'Solo el área de la base, sin la altura', value:'m2'},
    {label:'El diámetro multiplicado por la altura', value:'m3'},
  ]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cómo se calcula el volumen de un cilindro?</p>',
    options: opts, correctValue: 'ok', speakText: '¿Cómo se calcula el volumen de un cilindro?', cols:2, panel:true,
    explain: 'El volumen de un cilindro es el área de su base circular (π por radio al cuadrado) multiplicada por la altura.',
    recurso: recurso,
  };
}

const TRANSFORMACION_8_BANK = [
  { desc:'El punto (2, 3) se mueve al punto (5, 3): se desplazó 3 unidades a la derecha, sin girar ni invertirse', correcta:'Traslación', opts:['Rotación','Reflexión','Ningún movimiento'] },
  { desc:'Una figura gira 90° en torno al origen del plano cartesiano, manteniendo su forma y tamaño', correcta:'Rotación', opts:['Traslación','Reflexión','Ampliación'] },
  { desc:'El punto (4, 1) pasa al punto (-4, 1): la figura se invirtió respecto al eje vertical, como en un espejo', correcta:'Reflexión', opts:['Traslación','Rotación','Reducción'] },
  { desc:'Toda la figura se mueve según el vector (0, -4): baja 4 unidades sin cambiar su orientación', correcta:'Traslación', opts:['Rotación','Reflexión','Simetría central'] },
  { desc:'Una figura da media vuelta (180°) alrededor de un punto fijo, quedando "de cabeza" pero del mismo tamaño', correcta:'Rotación', opts:['Traslación','Reflexión','Ampliación'] },
  { desc:'El punto (3, 5) pasa al punto (3, -5): la figura se invirtió respecto al eje horizontal', correcta:'Reflexión', opts:['Traslación','Rotación','Ningún movimiento'] },
  { desc:'Un mosaico se construye repitiendo la misma figura desplazada una y otra vez en la misma dirección, sin girarla', correcta:'Traslación', opts:['Rotación','Reflexión','Reducción'] },
  { desc:'Las aspas de un molino repiten la misma forma girada en torno al centro, cada cierta cantidad de grados', correcta:'Rotación', opts:['Traslación','Reflexión','Ampliación'] },
  { desc:'El diseño de una mariposa: su lado izquierdo es la imagen especular exacta de su lado derecho', correcta:'Reflexión', opts:['Traslación','Rotación','Ninguna transformación'] },
  { desc:'Al componer dos reflexiones seguidas sobre ejes paralelos, la figura termina simplemente desplazada, sin invertirse', correcta:'Traslación', opts:['Rotación','Reflexión','Reducción'] },
];
export function genTransformaciones8Round(){
  const recurso = 'Las <b>transformaciones geométricas</b> son movimientos que se le aplican a una figura sin cambiar su tamaño ni su forma. Hay tres tipos principales: la <b>traslación</b> desplaza la figura en línea recta hacia una dirección, sin girarla ni voltearla (como deslizar una pieza sobre una mesa); la <b>rotación</b> gira la figura en torno a un punto fijo, un cierto número de grados (como las aspas de un molino); y la <b>reflexión</b> voltea la figura como si se reflejara en un espejo, invirtiendo su orientación respecto a una línea (el eje de reflexión). Estas transformaciones se usan para crear patrones y mosaicos, y para describir con precisión cómo se mueve un punto en el plano cartesiano.';
  const item = pick(TRANSFORMACION_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué transformación geométrica describe esto?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Esto describe una <b>'+item.correcta.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genEstadisticaCombinatoria8Round(){
  const recurso = 'El <b>principio multiplicativo</b> permite contar cuántas combinaciones distintas se pueden formar sin tener que listarlas todas una por una: si hay "a" opciones para una decisión y "b" opciones para otra decisión independiente, el total de combinaciones posibles es a × b. La <b>mediana</b> es una medida de tendencia central: es el valor que queda justo al centro de un conjunto de datos ORDENADOS de menor a mayor (a diferencia del promedio, que se calcula sumando todo y dividiendo). Un <b>gráfico puede ser engañoso</b> sin mentir con números falsos: cambiar la escala de un eje, no partir de cero, o usar el ancho de una barra en vez de su altura, puede hacer que una diferencia pequeña se vea enorme o viceversa — por eso es importante mirar siempre los valores reales antes de sacar una conclusión visual.';
  const roll = Math.random();
  if(roll<0.4){
    const opciones1 = randInt(2,5), opciones2 = randInt(2,5);
    const contextos = [
      {a:'poleras', b:'pantalones', pregunta:'tenidas distintas (una polera con un pantalón)'},
      {a:'sabores de helado', b:'tipos de cono', pregunta:'combinaciones distintas de helado'},
      {a:'panes', b:'rellenos', pregunta:'sándwiches distintos'},
      {a:'colores de lápiz', b:'tipos de papel', pregunta:'combinaciones distintas para dibujar'},
    ];
    const ctx = pick(contextos);
    const correct = opciones1*opciones2;
    const distractCandidates = [opciones1+opciones2, correct+opciones1, correct-opciones2, correct+1];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && d>0 && finales.indexOf(d)===-1) finales.push(d); if(finales.length===3) break; }
    while(finales.length<3){ const c = correct+randInt(1,6); if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Tienes '+opciones1+' '+ctx.a+' y '+opciones2+' '+ctx.b+'. ¿Cuántas '+ctx.pregunta+' puedes formar?</p>',
      options: opts, correctValue: correct, speakText: 'Con '+opciones1+' '+ctx.a+' y '+opciones2+' '+ctx.b+', ¿cuántas combinaciones puedes formar?', cols:4,
      explain: 'Principio multiplicativo: '+opciones1+' × '+opciones2+' = <b>'+correct+'</b> combinaciones posibles.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const base = randInt(2,6);
    const datos = [base, base+1, base+2, base+4, base+6, base+7, base+9].map(function(v){ return v; });
    const mediana = datos[3];
    const distract = [datos[2], datos[4], Math.round((datos[0]+datos[6])/2)];
    const finales = [];
    for(const d of distract){ if(d!==mediana && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const c = mediana+randInt(2,5); if(c!==mediana && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([mediana].concat(finales.slice(0,3))).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Estos 7 datos están ordenados de menor a mayor: '+datos.join(', ')+'. ¿Cuál es la mediana (el valor que queda justo al centro)?</p>',
      options: opts, correctValue: mediana, speakText: '¿Cuál es la mediana de estos datos?', cols:4,
      explain: 'Con 7 datos ordenados, la mediana es el 4° valor (quedan 3 a cada lado): <b>'+mediana+'</b>.',
      recurso: recurso,
    };
  }
  const enganosos = [
    { desc:'Un gráfico de barras comienza su eje vertical en 90 en vez de 0, haciendo que una diferencia pequeña entre dos barras se vea enorme', pregunta:'¿Por qué este gráfico puede engañar al lector?', correcta:'Porque cortar el eje exagera visualmente una diferencia que es pequeña', opts:['Porque los gráficos de barras siempre mienten','Porque el color de las barras es incorrecto','No hay ningún problema con ese gráfico'] },
    { desc:'Una publicidad muestra un gráfico donde su producto aparece con una barra el doble de ancha (no más alta) que la del competidor', pregunta:'¿Qué problema tiene esta presentación?', correcta:'El ancho de la barra no representa el valor: solo la altura debería compararse', opts:['Las barras anchas son siempre más precisas','No hay ningún problema','El competidor debería tener la barra más ancha'] },
    { desc:'Un titular dice "las ventas se dispararon" pero el gráfico muestra un aumento de solo 1% en un eje muy ampliado', pregunta:'¿Qué conviene hacer como lector crítico frente a este gráfico?', correcta:'Revisar la escala del eje y los valores reales antes de aceptar la conclusión del titular', opts:['Creer el titular sin mirar el gráfico','Ignorar siempre todos los gráficos','Asumir que el 1% es una cifra enorme'] },
    { desc:'Dos diarios muestran los mismos datos de temperatura: uno usa un eje de 0 a 40 grados y el otro un eje de 28 a 32 grados', pregunta:'¿Por qué los dos gráficos se ven tan distintos si los datos son los mismos?', correcta:'Porque la escala del eje cambia la impresión visual, aunque los datos sean iguales', opts:['Porque uno de los diarios inventó los datos','Porque la temperatura cambió entre una impresión y otra','Es imposible que se vean distintos'] },
  ];
  const item = pick(enganosos);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

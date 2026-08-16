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
  {id:'examenmate1', label:'Examen Final', open:true, key:'examenmate1'},
];
/* 5° nodo agregado (2026-08-09, "Examen Final") reusando el mismo espaciado
   ya verificado sin solapamiento en Aprendo a Leer (5 nodos, height:500,
   paso alternado 18%×500px=90px, paso mismo lado del zigzag 36%×500px=180px
   — bastante sobre los ~150px mínimos). Las primeras 4 posiciones quedan en
   el mismo píxel real que antes (recalculadas para el nuevo height:500 en
   vez de 360), así que el layout de esos 4 nodos no cambia visualmente. */
export const MATE_POS = [{x:24,y:90},{x:70,y:72},{x:24,y:54},{x:68,y:36},{x:24,y:16}];

export const MATE_MODULES_G2 = [
  {id:'salta', label:'Salta y Cuenta', open:true, key:'salta'},
  {id:'multiplicar', label:'Multiplicar', open:true, key:'multiplicar'},
  {id:'geometria2', label:'Geometría', open:true, key:'geometria2'},
  {id:'medicion2', label:'Medición', open:true, key:'medicion2'},
  {id:'examenmate2', label:'Examen Final', open:true, key:'examenmate2'},
];
export const MATE_POS_G2 = [{x:24,y:87},{x:70,y:68},{x:24,y:49},{x:68,y:30},{x:24,y:10}];

/* Niveles de dificultad (2026-08-09, pedido explícito del usuario: "que
   comience una especie de niveles, facil, normal y dificil" — piloto en
   Matemática 1° básico). `nivel` es opcional ('facil'|'normal'|'dificil');
   sin argumento (el resto de la app nunca lo pasa) se comporta exactamente
   igual que antes — los rangos de "normal" son los originales. */
export function genCountRound(nivel){
  const emoji = pick(COUNT_EMOJIS);
  let n, distMax, distSpread;
  if(nivel==='facil'){ n = randInt(1,5); distMax=8; distSpread=2; }
  else if(nivel==='dificil'){ n = randInt(10,18); distMax=25; distSpread=4; }
  else { n = randInt(1,9); distMax=12; distSpread=3; }
  const visual = new Array(n).fill(emoji).join(' ');
  const opts = uniqueDistractors(n,1,distMax,distSpread,4).map(function(v){ return {label:String(v), value:v}; });
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

export function genAddRound(nivel){
  let a, b, useVisual, distMax, distSpread;
  if(nivel==='facil'){ a = randInt(1,3); b = randInt(1,3); useVisual = true; distMax=8; distSpread=2; }
  else if(nivel==='dificil'){ a = randInt(4,10); b = randInt(4,10); useVisual = false; distMax=25; distSpread=4; }
  else { a = randInt(1,5); b = randInt(1,5); useVisual = true; distMax=12; distSpread=2; }
  const sum = a+b;
  const emoji = pick(COUNT_EMOJIS);
  /* En difícil se quita el apoyo visual de objetos (queda solo la
     ecuación en números) — un paso genuinamente más abstracto/exigente,
     no solo números más grandes, siguiendo cómo el propio currículum de
     1° básico distingue el cálculo con material concreto del cálculo
     mental/simbólico. */
  const visual = useVisual
    ? (new Array(a).fill(emoji).join(' ') + '<span class="op-sign">+</span>' + new Array(b).fill(emoji).join(' '))
    : ('<span class="op-num">'+a+'</span><span class="op-sign">+</span><span class="op-num">'+b+'</span>');
  const opts = uniqueDistractors(sum,1,distMax,distSpread,4).map(function(v){ return {label:String(v), value:v}; });
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

export function genCompareRound(nivel){
  const emojiA = pick(COUNT_EMOJIS);
  let emojiB = pick(COUNT_EMOJIS);
  if(emojiB === emojiA){ emojiB = COUNT_EMOJIS[(COUNT_EMOJIS.indexOf(emojiA)+1) % COUNT_EMOJIS.length]; }
  let maxN, minGap;
  if(nivel==='facil'){ maxN=4; minGap=2; }
  else if(nivel==='dificil'){ maxN=15; minGap=1; }
  else { maxN=7; minGap=1; }
  const nA = randInt(1,maxN);
  let nB = randInt(1,maxN), guard=0;
  while((nB===nA || Math.abs(nB-nA)<minGap) && guard<50){ nB = randInt(1,maxN); guard++; }
  if(nB===nA){ nB = nA>=maxN ? nA-minGap : nA+minGap; }
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

/* Pool reducido para "fácil" (las 4 formas más básicas/conocidas) y mapa de
   formas visualmente parecidas para "difícil" (rombo/cuadrado/rectángulo se
   confunden entre sí; círculo/óvalo también; pentágono/hexágono también) —
   forzar esos pares como distractor prioritario hace el nivel difícil
   genuinamente más exigente, no solo "más formas". */
/* 6 formas, no 4: con solo 4 el conjunto de opciones (siempre las mismas 4
   formas) queda fijo y solo 4 combinaciones únicas son posibles para
   rounds:10 — repeticiones garantizadas desde la 5ª ronda en adelante,
   detectado con una simulación real de sesión antes de dar esto por
   terminado. Con 6 formas hay C(5,3)=10 combinaciones de distractores por
   figura objetivo, de sobra para 10 rondas sin repetir. */
const SHAPES_FACIL_IDS = ['circulo','cuadrado','triangulo','rectangulo','ovalo','pentagono'];
const SHAPE_SIMILAR = {
  circulo:['ovalo'], ovalo:['circulo'],
  cuadrado:['rombo','rectangulo'], rectangulo:['cuadrado','rombo'], rombo:['cuadrado','rectangulo'],
  triangulo:[], pentagono:['hexagono'], hexagono:['pentagono'],
};
export function genFormaRound(nivel){
  let item, distract;
  if(nivel==='facil'){
    const pool = SHAPES.filter(function(s){ return SHAPES_FACIL_IDS.indexOf(s.id)!==-1; });
    item = pick(pool);
    distract = shuffle(pool.filter(function(s){ return s.id!==item.id; })).slice(0,3);
  }else if(nivel==='dificil'){
    item = pick(SHAPES);
    const similarIds = SHAPE_SIMILAR[item.id] || [];
    const similar = SHAPES.filter(function(s){ return similarIds.indexOf(s.id)!==-1; });
    const rest = shuffle(SHAPES.filter(function(s){ return s.id!==item.id && similarIds.indexOf(s.id)===-1; }));
    distract = similar.concat(rest).slice(0,3);
  }else{
    item = pick(SHAPES);
    distract = shuffle(SHAPES.filter(function(s){ return s.id!==item.id; })).slice(0,3);
  }
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

/* "Examen Final" (2026-08-09, pedido explícito del usuario: crear un
   submódulo de exámenes por asignatura que "mezcla toda la asignatura" —
   piloto en Matemática 1° básico). Toma un generador al azar entre los 4
   módulos del año y un nivel de dificultad al azar entre los 3, para que
   una sola partida de 20 rondas repase el curso completo en vez de un solo
   tema — mismo criterio de "que no se parezca una ronda a otra" ya exigido
   en toda la app, ahora también entre módulos distintos dentro de un mismo
   examen. */
export function genExamenMate1Round(){
  const gens = [genCountRound, genAddRound, genCompareRound, genFormaRound];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* Niveles de dificultad (2026-08-11, continuación del rollout a 2° básico):
   `nivel` opcional, sin argumento se comporta igual que antes ('normal').
   Fácil: pasos más simples (2 o 5), rango chico, hueco siempre en el medio
   (más fácil de interpolar), distractores bien alejados (fáciles de
   descartar). Difícil: hueco en un extremo (obliga a extrapolar el patrón en
   vez de interpolarlo), rango más grande, distractores más cercanos entre sí
   (hay que aplicar el paso real, no solo "adivinar por tamaño"). */
export function genSaltaRound(nivel){
  let stepPool, maxStartDiv, blankIdxPool, spreadMult;
  if(nivel==='facil'){ stepPool=[2,5]; maxStartDiv=30; blankIdxPool=[2]; spreadMult=3; }
  else if(nivel==='dificil'){ stepPool=[2,5,10]; maxStartDiv=150; blankIdxPool=[0,4]; spreadMult=1; }
  else { stepPool=[2,5,10]; maxStartDiv=80; blankIdxPool=[1,2,3]; spreadMult=2; }
  const step = pick(stepPool);
  const startMult = randInt(0, Math.floor(maxStartDiv/step));
  const start = startMult*step;
  const seq = [start, start+step, start+2*step, start+3*step, start+4*step];
  const blankIdx = pick(blankIdxPool);
  const correct = seq[blankIdx];
  const opts = uniqueDistractors(correct, 0, 999, step*spreadMult, 4).map(function(v){ return {label:String(v), value:v}; });
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

/* Niveles (2026-08-11): Posición usa siempre 2 objetos en fácil/normal (ya
   era el mínimo posible); difícil suma un 3er objeto y 3 preguntas posibles
   (izquierda/derecha/medio), genuinamente más exigente sin reducir nada.
   Figura2D/Solido3D: fácil reduce a 2 opciones; difícil oculta el dibujo y
   lo reemplaza por una descripción de sus propiedades (lados/caras), para
   que la respuesta exija razonar en vez de solo reconocer visualmente. */
const FIGURA_2D_DESC = {
  circulo: 'No tiene lados rectos ni esquinas.',
  cuadrado: 'Tiene 4 lados iguales y 4 esquinas iguales.',
  triangulo: 'Tiene 3 lados y 3 esquinas.',
  rectangulo: 'Tiene 4 lados rectos, pero no todos iguales.',
};
const SOLIDO_3D_DESC = {
  cubo: 'Tiene 6 caras cuadradas iguales.',
  paralelepipedo: 'Tiene 6 caras rectangulares, como una caja de zapatos.',
  esfera: 'No tiene caras planas ni esquinas, como una pelota.',
  cono: 'Tiene una base circular y termina en una punta.',
};
function genPosicionG2Round(nivel){
  if(nivel==='dificil'){
    const three = shuffle(OBJETOS_POS_POOL).slice(0,3);
    const [a,b,c] = three;
    const askType = pick(['izquierda','derecha','medio']);
    const correct = askType==='izquierda' ? a.label : askType==='derecha' ? c.label : b.label;
    const question = askType==='medio' ? '¿qué objeto está en el medio?' : '¿qué objeto está más a la '+askType+'?';
    const opts = shuffle(three).map(function(o){ return {label:o.label, value:o.label}; });
    return {
      promptHTML: '<p class="prompt-count">'+a.emoji+' '+b.emoji+' '+c.emoji+'</p><p class="prompt-hint">'+question+'</p>',
      options: opts, correctValue: correct, speakText: question, cols:3, panel:true,
      explain: 'El/la <b>'+correct.toLowerCase()+'</b> está '+(askType==='medio'?'en el medio':'más a la '+askType)+'.',
    };
  }
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

function genFigura2DG2Round(nivel){
  const item = pick(FIGURAS_2D_G2);
  let distract = FIGURAS_2D_G2.filter(function(s){ return s.id!==item.id; });
  if(nivel==='facil'){ distract = shuffle(distract).slice(0,1); }
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  const visual = nivel==='dificil'
    ? '<p class="prompt-hint">'+FIGURA_2D_DESC[item.id]+'</p>'
    : '<div class="shape-display">'+shapeSVG(item.id,110)+'</div>';
  return {
    promptHTML: visual+'<p class="prompt-hint">¿Qué figura es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:2, kind:'word', panel:true,
    explain: 'Esta figura es un <b>'+item.label.toLowerCase()+'</b>.',
  };
}

function genSolido3DG2Round(nivel){
  const item = pick(SOLIDOS_3D_G2);
  let distract = SOLIDOS_3D_G2.filter(function(s){ return s.id!==item.id; });
  if(nivel==='facil'){ distract = shuffle(distract).slice(0,1); }
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  const visual = nivel==='dificil'
    ? '<p class="prompt-hint">'+SOLIDO_3D_DESC[item.id]+'</p>'
    : '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div>';
  return {
    promptHTML: visual+'<p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:2, kind:'word', panel:true,
    explain: 'Este cuerpo geométrico es '+articuloFigura(item.id)+' <b>'+item.label.toLowerCase()+'</b>.',
  };
}

export function genGeometria2Round(nivel){
  const recurso = 'La geometría de 2° básico junta tres ideas: la <b>posición relativa</b> (izquierda/derecha, un objeto respecto a otro), las <b>figuras 2D</b> (círculo, cuadrado, triángulo, rectángulo — planas, con solo largo y ancho), y los <b>cuerpos 3D</b> (cubo, paralelepípedo, esfera, cono — con volumen, que puedes tomar en tus manos y tienen largo, ancho y alto). La diferencia clave entre 2D y 3D es esa: una figura 2D es plana como un dibujo en una hoja, mientras que un cuerpo 3D ocupa espacio real, como una caja o una pelota. Reconocer estas formas en objetos de tu entorno (una ventana es un rectángulo, un dado es un cubo) te ayuda a ver la geometría en el mundo real, no solo en el papel.';
  const roll = Math.random();
  const r = roll<0.34 ? genPosicionG2Round(nivel) : roll<0.67 ? genFigura2DG2Round(nivel) : genSolido3DG2Round(nivel);
  r.recurso = recurso;
  return r;
}

/* Niveles (2026-08-11): Calendario/Hora ajustan cuántas opciones se ofrecen
   y qué tan cercanos son los distractores (fácil = pocos y bien alejados,
   difícil = 4 pero muy próximos entre sí, obliga a saber la respuesta en
   vez de descartar por tamaño). Longitud ajusta qué tan parecida es la
   medida de los 2 objetos comparados (fácil = diferencia grande y obvia,
   difícil = medidas cercanas, hay que leer con cuidado). */
function genCalendarioG2Round(nivel){
  const item = pick(CALENDARIO_HECHOS);
  let count=4, spread=item.spread;
  if(nivel==='facil'){ count=2; spread=item.spread+3; }
  else if(nivel==='dificil'){ spread=Math.max(1,item.spread-2); }
  const opts = uniqueDistractors(item.correcta, item.min, item.max, spread, count).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
  };
}

function genHoraG2Round(nivel){
  const hour = randInt(1,12);
  const isHalf = nivel==='facil' ? false : Math.random()<0.5;
  const display = String(hour).padStart(2,'0')+':'+(isHalf ? '30' : '00');
  let count=4, spread=3;
  if(nivel==='facil'){ count=2; spread=6; }
  else if(nivel==='dificil'){ spread=1; }
  const hourOpts = uniqueDistractors(hour, 1, 12, spread, count);
  const opts = hourOpts.map(function(h){ return {label: h+(isHalf ? ' y media' : ' en punto'), value: h}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:40px;">'+display+'</p><p class="prompt-hint">¿Qué hora es?</p>',
    options: opts, correctValue: hour, speakText: '¿Qué hora es?', cols:2, panel:true,
    explain: 'Son las '+display+', es decir, las <b>'+hour+(isHalf ? ' y media' : ' en punto')+'</b>.',
  };
}

function genLongitudG2Round(nivel){
  const a = pick(OBJETOS_LONGITUD_G2);
  let candidates = OBJETOS_LONGITUD_G2.filter(function(o){ return o.label!==a.label && o.valor!==a.valor; });
  if(nivel==='facil'){
    const far = candidates.filter(function(o){ return Math.abs(o.valor-a.valor) >= Math.max(o.valor,a.valor)*0.5; });
    if(far.length) candidates = far;
  } else if(nivel==='dificil'){
    const close = candidates.filter(function(o){ return Math.abs(o.valor-a.valor) <= Math.min(o.valor,a.valor)*0.6; });
    if(close.length) candidates = close;
  }
  const b = pick(candidates);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const longer = a.valor>b.valor ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.medida+'.</p><p class="prompt-hint">'+b.emoji+' '+b.label+' mide '+b.medida+'.</p><p class="prompt-hint">¿Cuál es más largo?</p>',
    options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
    explain: longer.label+' mide '+longer.medida+', más que el otro objeto.',
  };
}

export function genMedicion2Round(nivel){
  const recurso = 'Medir significa comparar algo contra una unidad conocida para expresar "cuánto" hay de eso: el <b>calendario</b> mide el tiempo en días, semanas y meses; el <b>reloj</b> mide el tiempo dentro de un día en horas; y una <b>regla o huincha</b> mide la longitud en centímetros o metros. Aunque parezcan temas distintos, todos comparten la misma idea de fondo: elegir una unidad fija (un día, una hora, un centímetro) y contar cuántas veces cabe esa unidad en lo que estás midiendo. Practicar con calendarios, relojes y objetos cotidianos te prepara para usar la medición en situaciones reales, como saber cuánto falta para tu cumpleaños o qué tan largo es tu lápiz.';
  const roll = Math.random();
  const r = roll<0.34 ? genCalendarioG2Round(nivel) : roll<0.67 ? genHoraG2Round(nivel) : genLongitudG2Round(nivel);
  r.recurso = recurso;
  return r;
}

/* "Examen Final" 2° básico (2026-08-11, mismo patrón ya validado en 1°
   básico): mezcla los 4 módulos del año + los 3 niveles al azar. */
export function genExamenMate2Round(){
  const gens = [genSaltaRound, genMultiplicarRound, genGeometria2Round, genMedicion2Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* Niveles (2026-08-11): fácil reduce las tablas a 2/5 y los grupos a 2-3
   (más fácil de dibujar/contar); difícil sube grupos hasta 8 y QUITA el
   apoyo visual de los objetos dibujados (queda solo "N × T" en números),
   mismo criterio ya usado en Sumar de 1° básico para el paso más abstracto. */
export function genMultiplicarRound(nivel){
  let tablePool, groupsMin, groupsMax, useVisual;
  if(nivel==='facil'){ tablePool=[2,5]; groupsMin=2; groupsMax=3; useVisual=true; }
  else if(nivel==='dificil'){ tablePool=[2,5,10]; groupsMin=4; groupsMax=8; useVisual=false; }
  else { tablePool=[2,5,10]; groupsMin=2; groupsMax=5; useVisual=true; }
  const table = pick(tablePool);
  const groups = randInt(groupsMin,groupsMax);
  const emoji = pick(COUNT_EMOJIS);
  const total = table*groups;
  let visual;
  if(useVisual){
    const groupHTML = [];
    for(let g=0; g<groups; g++){ groupHTML.push('<span class="mgroup">'+new Array(table).fill(emoji).join('')+'</span>'); }
    visual = groupHTML.join('');
  } else {
    visual = '<span class="op-num">'+groups+'</span><span class="op-sign">×</span><span class="op-num">'+table+'</span>';
  }
  const opts = uniqueDistractors(total, 1, 200, table, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+visual+'</p><p class="prompt-hint">'+groups+' grupos de '+table+'. ¿Cuántos hay en total?</p>',
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
  {id:'examenmate3', label:'Examen Final', open:true, key:'examenmate3'},
];
export const MATE_POS_G3 = [
  {x:22,y:95},{x:68,y:85},{x:24,y:75},{x:70,y:65},{x:24,y:55},{x:70,y:45},{x:24,y:35},{x:70,y:25},{x:24,y:15},{x:70,y:5}
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

/* Niveles (2026-08-11, rollout a 3° básico): en las 4 ramas fácil reduce el
   rango/las opciones y difícil sube el rango o exige extrapolar en vez de
   interpolar — mismo criterio ya usado en Matemática 1°-2° básico. */
export function genNumeros3Round(nivel){
  const recurso = 'Los números hasta 1000 se organizan en <b>centenas</b> (grupos de 100), <b>decenas</b> (grupos de 10) y <b>unidades</b> (números sueltos del 0 al 9) — por ejemplo, 347 tiene 3 centenas, 4 decenas y 7 unidades. Esta forma de descomponer un número (llamada valor posicional) es la clave para comparar números grandes: primero se compara la cantidad de dígitos, luego la centena, luego la decena. Contar salteado (de 5 en 5, de 10 en 10, de 100 en 100) te ayuda a moverte más rápido entre números grandes sin tener que contar de uno en uno, algo esencial quien empieza a trabajar con números de 3 dígitos.';
  const roll = Math.random();
  if(roll<0.25){
    let stepPool, maxStartDiv, blankIdx, spreadMult;
    if(nivel==='facil'){ stepPool=[5,10]; maxStartDiv=300; blankIdx=1; spreadMult=3; }
    else if(nivel==='dificil'){ stepPool=[5,10,100]; maxStartDiv=900; blankIdx=3; spreadMult=1; }
    else { stepPool=[5,10,100]; maxStartDiv=900; blankIdx=randInt(1,2); spreadMult=2; }
    const step = pick(stepPool);
    const startMult = randInt(0, Math.floor(maxStartDiv/step));
    const start = startMult*step;
    const seq = [start, start+step, start+2*step, start+3*step];
    const correct = seq[blankIdx];
    const opts = uniqueDistractors(correct, 0, 1000, step*spreadMult, 4).map(function(v){ return {label:String(v), value:v}; });
    const displaySeq = seq.map(function(n,i){ return i===blankIdx ? '<span class="blank">?</span>' : n; }).join(' — ');
    return {
      promptHTML: '<p class="prompt-count" style="letter-spacing:1px;">'+displaySeq+'</p><p class="prompt-hint">¿Qué número falta en la secuencia?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número falta?', cols:4,
      explain: 'La secuencia avanza de <b>'+step+'</b> en <b>'+step+'</b>, así que el número que falta es <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.5){
    let maxN, minGap;
    if(nivel==='facil'){ maxN=99; minGap=30; }
    else if(nivel==='dificil'){ maxN=999; minGap=1; }
    else { maxN=999; minGap=10; }
    let a = randInt(0,maxN), b = randInt(0,maxN), guard=0;
    while(Math.abs(a-b)<minGap && guard<80){ b = randInt(0,maxN); guard++; }
    if(a===b) b = a>=maxN ? a-minGap : a+minGap;
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
    const count = nivel==='facil' ? 2 : 4;
    const spread = nivel==='dificil' ? 1 : 2;
    const opts = uniqueDistractors(correct, 0, 9, spread, count).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:40px;">'+n+'</p><p class="prompt-hint">¿Cuántas '+kind.toLowerCase()+' tiene este número?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuántas '+kind.toLowerCase()+' tiene el '+n+'?', cols:4,
      explain: 'El '+n+' tiene <b>'+correct+'</b> '+kind.toLowerCase()+'.',
      recurso: recurso,
    };
  }
  let n;
  if(nivel==='facil'){ n = pick([randInt(0,9), randInt(100,999)]); }
  else if(nivel==='dificil'){ n = pick([9,10,99,100,999,1000]); }
  else { n = randInt(0,1000); }
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

/* Niveles (2026-08-11): fácil reduce el rango numérico (números más
   chicos, más fáciles de sumar/restar mentalmente); difícil sube el rango
   y, en la rama de vuelto, fuerza diferencias más chicas (0 o 50) en vez
   de las más redondas (100 o 200). */
export function genOperaciones3Round(nivel){
  const recurso = 'Sumar y restar con números de 3 dígitos funciona igual que con números pequeños, solo que hay que ser más ordenado: alinear las centenas con las centenas, las decenas con las decenas y las unidades con las unidades. Un uso muy práctico de la resta es calcular <b>vuelto</b>: si pagas con más dinero del que cuesta algo, el vuelto es la diferencia entre lo que pagaste y el precio real — una resta que probablemente ya haces sin darte cuenta cuando compras algo. Practicar estas operaciones con dinero (pesos chilenos) conecta la matemática de la sala de clases con situaciones que vives todos los días.';
  const roll = Math.random();
  if(roll<0.4){
    const maxV = nivel==='facil' ? 100 : nivel==='dificil' ? 500 : 300;
    const a = randInt(10,maxV), b = randInt(10,maxV);
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
    const aMax = nivel==='facil' ? 300 : 900;
    const a = randInt(100,aMax), b = randInt(10,99);
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
  const diffPool = nivel==='facil' ? [100,200] : nivel==='dificil' ? [0,50] : [0,50,100,200];
  const tienes = item.precio + pick(diffPool);
  const falta = tienes - item.precio;
  const opts = uniqueDistractors(falta, 0, 3000, 100, 4).map(function(v){ return {label:'$'+v, value:v}; });
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si pagas con $'+tienes+', ¿cuánto vuelto recibes?</p>',
    options: opts, correctValue: falta, speakText: '¿Cuánto vuelto recibes?', cols:4,
    explain: '$'+tienes+' - $'+item.precio+' = <b>$'+falta+'</b> de vuelto.',
    recurso: recurso,
  };
}

/* Niveles (2026-08-11): fácil restringe las tablas a 2-5 (las más fáciles
   de recordar); difícil sube a 6-10 (tablas menos practicadas, genuinamente
   más exigentes de memoria); normal mantiene el rango original 2-10. */
export function genMultiplicar3Round(nivel){
  const range = nivel==='facil' ? [2,5] : nivel==='dificil' ? [6,10] : [2,10];
  const a = randInt(range[0],range[1]), b = randInt(range[0],range[1]);
  const total = a*b;
  const opts = uniqueDistractors(total, 4, 100, a, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:34px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
    options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
    explain: a+' × '+b+' = <b>'+total+'</b>.',
    recurso: 'Saberse las tablas de multiplicar de memoria (del 1 al 10) te ahorra mucho tiempo, porque son operaciones que usarás una y otra vez en el resto de la matemática que aprenderás. Una forma de entenderlas (no solo memorizarlas): multiplicar A × B significa sumar el número A, B veces seguidas — por ejemplo, 4 × 3 es lo mismo que 4+4+4. Practicar las tablas con distintos números, en vez de solo repetir siempre las mismas, es lo que realmente ayuda a que se te queden grabadas para el resto de tu vida escolar.',
  };
}

export function genDividir3Round(nivel){
  const range = nivel==='facil' ? [2,5] : nivel==='dificil' ? [6,10] : [2,10];
  const b = randInt(range[0],range[1]), q = randInt(range[0],range[1]);
  const total = b*q;
  const opts = uniqueDistractors(q, 1, 10, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Tienes '+total+' objetos y los repartes en grupos de '+b+'. ¿Cuántos grupos se forman?</p>',
    options: opts, correctValue: q, speakText: '¿Cuántos grupos de '+b+' se forman con '+total+'?', cols:4,
    explain: total+' ÷ '+b+' = <b>'+q+'</b> grupos.',
    recurso: 'Dividir es lo opuesto a multiplicar: mientras multiplicar junta grupos iguales en un total, dividir reparte un total en grupos iguales. Por eso, si sabes que 4 × 5 = 20, también sabes que 20 ÷ 4 = 5 y que 20 ÷ 5 = 4 — son la misma relación de números vista desde dos direcciones distintas. Pensar en la división como "repartir en partes iguales" (en vez de memorizarla como una operación separada) te ayuda a resolver problemas reales, como repartir objetos, dinero o comida entre varias personas de forma justa.',
  };
}

/* Niveles (2026-08-11): el dibujo (círculo/barra coloreada) es la única
   fuente de información — se mantiene siempre visible en los 3 niveles, y
   `den` sigue sorteándose entre las 3 opciones SIEMPRE (restringirlo por
   nivel reduciría el espacio de fracciones únicas del currículum -solo 6
   valores posibles- por debajo de rounds:10, garantizando repetición;
   detectado antes de dar esto por terminado). Fácil reduce a 2
   alternativas; difícil prioriza un distractor del MISMO denominador
   (numerador vecino, visualmente más parecido) en vez de uno de otro
   denominador, más difícil de descartar a simple vista. */
export function genFracciones3Round(nivel){
  const den = pick([2,3,4]);
  const num = randInt(1,den-1);
  const otherDens = [2,3,4].filter(function(d){ return d!==den; });
  const correct = num+'/'+den;
  const sameDenDistract = [];
  for(let n=1;n<den;n++){ if(n!==num) sameDenDistract.push(n+'/'+den); }
  const otherDenDistract = shuffle(otherDens).map(function(d){ return randInt(1,d-1)+'/'+d; });
  const pool = nivel==='dificil'
    ? sameDenDistract.concat(otherDenDistract)
    : otherDenDistract.concat([(num+1)+'/'+den]);
  let opts = [correct].concat(pool.slice(0,3)).map(function(f){ return {label:f, value:f}; });
  if(nivel==='facil'){ opts = opts.slice(0,2); }
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

/* Niveles (2026-08-11): fácil reduce el rango de paso/números; difícil lo
   sube — ambas ramas ya son 100% dinámicas, sin visual que ocultar. */
export function genPatrones3Round(nivel){
  const recurso = 'Un <b>patrón</b> es una secuencia de números que cambia siguiendo siempre la misma regla (por ejemplo, sumar el mismo número cada vez) — descubrir esa regla te permite predecir qué número viene después, sin que alguien te lo diga. Una <b>ecuación</b> con un número faltante (como "___ + 5 = 12") te pide encontrar qué valor hace que la igualdad sea verdadera, y para resolverla puedes pensar "¿qué número, sumado a 5, da 12?" en vez de adivinar al azar. Ambas habilidades —reconocer patrones y resolver ecuaciones simples— son la base del álgebra que aprenderás en años posteriores.';
  if(Math.random()<0.5){
    const stepMax = nivel==='facil' ? 5 : nivel==='dificil' ? 9 : 7;
    const startMax = nivel==='facil' ? 10 : nivel==='dificil' ? 30 : 20;
    const step = randInt(2,stepMax);
    const start = randInt(1,startMax);
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
  const maxV = nivel==='facil' ? 20 : nivel==='dificil' ? 99 : 50;
  const a = randInt(1,maxV), b = randInt(1,maxV);
  const total = a+b;
  const askA = Math.random()<0.5;
  const correct = askA ? a : b;
  const opts = uniqueDistractors(correct, 0, maxV*2, 5, 4).map(function(v){ return {label:String(v), value:v}; });
  const known = askA ? b : a;
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+(askA?'<span class="blank">?</span>':'') +' + '+known+' = '+total+(!askA?' — <span class="blank">?</span>':'')+'</p><p class="prompt-hint">¿Qué número falta?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué número falta en la ecuación?', cols:4,
    explain: correct+' + '+known+' = '+total+', así que el número que falta es <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

/* Niveles (2026-08-11): fácil reduce opciones en las 3 ramas; difícil
   oculta el emoji decorativo de la rama de cuadrícula (item.label ya va
   en el texto). Las ramas de sólido 3D/ángulo mantienen su SVG siempre
   visible en los 3 niveles — es la única fuente de información, sin
   texto que la reemplace. */
export function genGeometria3Round(nivel){
  const recurso = 'La geometría de 3° básico suma tres ideas nuevas: la <b>cuadrícula</b> permite ubicar un objeto con precisión usando dos números (columna y fila), igual que en un juego de mesa o un mapa; los <b>cuerpos geométricos</b> (pirámide, cubo, esfera) tienen caras, aristas y vértices que los distinguen entre sí; y los <b>ángulos</b> (recto, agudo, obtuso) describen qué tan abierta o cerrada es una esquina o un cruce de líneas — un ángulo recto es como la esquina de una hoja de papel, uno agudo es más cerrado, y uno obtuso es más abierto. Estas tres herramientas te permiten describir con precisión la forma y la posición de las cosas que te rodean.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CUADRICULA_POOL);
    const col = randInt(1,5), row = randInt(1,5);
    let opts = shuffle([col+','+row, (col+1)+','+row, col+','+(row+1), (col+1)+','+(row+1)]);
    if(nivel==='facil'){ opts = [col+','+row].concat(opts.filter(function(o){ return o!==col+','+row; }).slice(0,1)); }
    opts = shuffle(opts).map(function(c){ return {label:c, value:c}; });
    const showEmoji = nivel !== 'dificil';
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">El '+item.label.toLowerCase()+' está en la columna '+col+' y la fila '+row+'. ¿Cuál es su posición (columna,fila)?</p>',
      options: opts, correctValue: col+','+row, speakText: '¿Cuál es la posición del '+item.label.toLowerCase()+'?', cols:2, panel:true,
      explain: 'La posición es columna '+col+', fila '+row+', o sea <b>('+col+','+row+')</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(SOLIDOS_3D_G3);
    let distract = shuffle(SOLIDOS_3D_G3.filter(function(s){ return s.id!==item.id; }));
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
      options: opts, correctValue: item.id, speakText: item.label, cols:4, kind:'word',
      explain: 'Este cuerpo geométrico es '+articuloFigura(item.id)+' <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const tipo = pick(ANGULOS_POOL);
  let angOpts = ANGULOS_POOL;
  if(nivel==='facil'){
    const others = ANGULOS_POOL.filter(function(t){ return t!==tipo; });
    angOpts = shuffle([tipo, pick(others)]);
  }
  const opts = shuffle(angOpts).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<div class="shape-display">'+anguloSVG(tipo,100)+'</div><p class="prompt-hint">¿Qué tipo de ángulo es?</p>',
    options: opts, correctValue: tipo, speakText: '¿Qué tipo de ángulo es?', cols:4, kind:'word',
    explain: 'Este es un ángulo <b>'+tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

/* Niveles (2026-08-11): rama de hora restringe a horas en punto/media en
   fácil (más simple de leer) y usa las 4 opciones de minuto en difícil;
   rama de perímetro reduce opciones en fácil; rama de peso fuerza una
   diferencia de gramos grande y obvia en fácil, y cercana en difícil
   (mismo criterio que Longitud en 2° básico). */
export function genMedicion3Round(nivel){
  const recurso = 'La medición en 3° básico profundiza en 3 herramientas distintas: leer la <b>hora</b> con más precisión (cuartos y medias horas, no solo horas en punto), calcular el <b>perímetro</b> de una figura (sumar la medida de todos sus lados, útil por ejemplo para saber cuánta reja necesitas para cercar un patio), y comparar el <b>peso</b> de distintos objetos. Aunque parecen temas separados, todos comparten la misma lógica de la medición: elegir una unidad conocida (minutos, centímetros, gramos) y usarla para describir "cuánto" hay de algo, de forma que cualquier persona pueda entenderlo igual.';
  const roll = Math.random();
  if(roll<0.34){
    const hour = randInt(1,12);
    const minPool = nivel==='facil' ? [0,30] : [0,15,30,45];
    const min = pick(minPool);
    const display = String(hour).padStart(2,'0')+':'+String(min).padStart(2,'0');
    const labels = {0:' en punto',15:' y cuarto',30:' y media',45:' menos cuarto'};
    /* Para "menos cuarto" (X:45) se nombra la hora SIGUIENTE ("las 3 menos
       cuarto" para las 2:45), no la hora actual — un detalle real del
       español que se pasaba por alto usando `hour` directo. */
    const hourLabel = min===45 ? (hour%12)+1 : hour;
    const correct = display;
    const distractPool = minPool.filter(function(m){ return m!==min; }).map(function(m){ return String(hour).padStart(2,'0')+':'+String(m).padStart(2,'0'); });
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
    const count = nivel==='facil' ? 2 : 4;
    const opts = uniqueDistractors(perimetro, 4, 40, 3, count).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Los lados de '+item.label+' miden: '+item.lados.join(', ')+' (en cm). ¿Cuál es su perímetro?</p>',
      options: opts, correctValue: perimetro, speakText: '¿Cuál es el perímetro?', cols:4,
      explain: 'El perímetro es la suma de todos los lados: '+item.lados.join(' + ')+' = <b>'+perimetro+' cm</b>.',
      recurso: recurso,
    };
  }
  const a = pick(PESO_OBJETOS);
  let candidates = PESO_OBJETOS.filter(function(o){ return o.label!==a.label; });
  if(nivel==='facil'){
    const far = candidates.filter(function(o){ return Math.abs(o.gramos-a.gramos) >= Math.max(o.gramos,a.gramos)*0.6; });
    if(far.length) candidates = far;
  } else if(nivel==='dificil'){
    const close = candidates.filter(function(o){ return Math.abs(o.gramos-a.gramos) <= Math.min(o.gramos,a.gramos)*0.5; });
    if(close.length) candidates = close;
  }
  const b = pick(candidates);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const heavier = a.gramos>b.gramos ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estos objetos pesa más?</p>',
    options: opts, correctValue: heavier.label, speakText: '¿Cuál pesa más?', cols:2, panel:true,
    explain: heavier.label.charAt(0).toUpperCase()+heavier.label.slice(1)+' pesa más.',
    recurso: recurso,
  };
}

/* Niveles (2026-08-11): el gráfico de barras se mantiene siempre visible
   en los 3 niveles (es la fuente de datos real); solo varía el número de
   opciones (fácil) y qué tan cercanos son los distractores del conteo
   (difícil, spread más chico). */
export function genDatos3Round(nivel){
  const recurso = 'Un <b>gráfico de barras</b> es una forma visual de mostrar los resultados de una encuesta: cada barra representa una opción distinta, y la altura de la barra muestra cuántas personas eligieron esa opción — mientras más alta la barra, más votos tuvo. Leer un gráfico de barras es más rápido que leer una lista de números, porque puedes comparar las alturas a simple vista para saber de inmediato cuál opción ganó o cuál tuvo menos apoyo. Esta habilidad de leer datos organizados visualmente es muy usada en la vida real, desde encuestas escolares hasta noticias y estudios.';
  const item = pick(DATOS_ENCUESTA);
  const roll = Math.random();
  if(roll<0.5){
    const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
    let distract = shuffle(item.categorias.filter(function(c){ return c.label!==maxCat.label; })).map(function(c){ return c.label; });
    if(nivel==='facil'){ distract = distract.slice(0,1); }
    const opts = shuffle([maxCat.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál opción tuvo más votos?</p>',
      options: opts, correctValue: maxCat.label, speakText: '¿Cuál opción tuvo más votos?', cols:4, kind:'word',
      explain: '<b>'+maxCat.label+'</b> tuvo '+maxCat.valor+' votos, más que las demás opciones.',
      recurso: recurso,
    };
  }
  const target = pick(item.categorias);
  const count = nivel==='facil' ? 2 : 4;
  const spread = nivel==='dificil' ? 1 : 2;
  const opts = uniqueDistractors(target.valor, 0, 20, spread, count).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuántos votos tuvo la opción "'+target.label+'"?</p>',
    options: opts, correctValue: target.valor, speakText: '¿Cuántos votos tuvo '+target.label+'?', cols:4,
    explain: 'La opción "'+target.label+'" tuvo <b>'+target.valor+'</b> votos.',
    recurso: recurso,
  };
}

/* "Examen Final" 3° básico Matemática: mezcla los 9 módulos del año + los
   3 niveles al azar. */
export function genExamenMate3Round(){
  const gens = [genNumeros3Round, genOperaciones3Round, genMultiplicar3Round, genDividir3Round, genFracciones3Round, genPatrones3Round, genGeometria3Round, genMedicion3Round, genDatos3Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenmate4', label:'Examen Final', open:true, key:'examenmate4'},
];
export const MATE_POS_G4 = [
  {x:22,y:96},{x:68,y:86},{x:24,y:76},{x:70,y:66},{x:24,y:56},{x:70,y:46},{x:24,y:36},{x:70,y:26},{x:24,y:16},{x:70,y:6}
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

export function genNumeros4Round(nivel){
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
    const pool = nivel==='facil' ? [correct,wrong1] : [correct,wrong1,wrong2,wrong3];
    const opts = shuffle(pool).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:40px;">'+n+'</p><p class="prompt-hint">¿Cuál es la descomposición correcta de este número?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la descomposición de '+n+'?', cols:2, panel:true,
      explain: n+' se descompone como <b>'+correct.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    let minGap;
    if(nivel==='facil'){ minGap=3000; } else if(nivel==='dificil'){ minGap=1; } else { minGap=200; }
    let a = randInt(0,9999), b = randInt(0,9999), guard=0;
    while(Math.abs(a-b)<minGap && guard<80){ b = randInt(0,9999); guard++; }
    if(a===b) b = a>=9999-minGap ? a-minGap : a+minGap;
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor, '+a+' o '+b+'?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.',
      recurso: recurso,
    };
  }
  const n = randInt(1000,9999);
  let candidatos;
  if(nivel==='facil'){ candidatos = [n, n+randInt(200,400)]; }
  else if(nivel==='dificil'){ candidatos = [n, n+randInt(1,8), n-randInt(1,8), n+randInt(9,20)]; }
  else { candidatos = [n, n+randInt(1,50), n-randInt(1,50), n+randInt(100,300)]; }
  const opts = shuffle(candidatos).map(function(v){ return {label:String(v), value:v}; });
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

export function genOperaciones4Round(nivel){
  const recurso = 'Sumar y restar con números más grandes usa la misma idea que con números chicos, solo que ahora hay que ordenar bien las centenas, decenas y unidades antes de operar. Dos propiedades muy útiles: cualquier número <b>+ 0</b> queda igual (el 0 es el "elemento neutro" de la suma) y cualquier número <b>× 1</b> también queda igual (el 1 es el "elemento neutro" de la multiplicación) — no cambian nada porque no agregan ni quitan cantidad. El dinero es un ejemplo perfecto de resta en la vida real: cuando pagas con un billete más grande que el precio, el vuelto que te devuelven es justamente la diferencia entre lo que pagaste y lo que costó.';
  const roll = Math.random();
  const count = nivel==='facil' ? 2 : 4;
  if(roll<0.34){
    let aMax, bMax, spread;
    if(nivel==='facil'){ aMax=[100,300]; bMax=[10,40]; spread=60; }
    else if(nivel==='dificil'){ aMax=[500,900]; bMax=[60,99]; spread=8; }
    else { aMax=[100,900]; bMax=[10,99]; spread=20; }
    const a = randInt(aMax[0],aMax[1]), b = randInt(bMax[0],bMax[1]);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 100, 1200, spread, count).map(function(v){ return {label:String(v), value:v}; });
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
    const spread = nivel==='dificil' ? 1 : 3;
    const opts = uniqueDistractors(correct, 0, 40, spread, count).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+pregunta+'</p>',
      options: opts, correctValue: correct, speakText: pregunta, cols:4,
      explain: usaCero ? 'Cualquier número más 0 da el mismo número: <b>'+n+'</b>.' : 'Cualquier número multiplicado por 1 da el mismo número: <b>'+n+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(OBJETOS_PRECIO4);
  const tienesPool = nivel==='dificil' ? [0,200,500,1000] : [0,500,1000,2000];
  const tienes = item.precio + pick(tienesPool);
  const falta = tienes - item.precio;
  const spread = nivel==='dificil' ? 100 : 500;
  const opts = uniqueDistractors(falta, 0, 20000, spread, count).map(function(v){ return {label:'$'+v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si pagas con $'+tienes+', ¿cuánto vuelto recibes?</p>',
    options: opts, correctValue: falta, speakText: '¿Cuánto vuelto recibes?', cols:4,
    explain: '$'+tienes+' - $'+item.precio+' = <b>$'+falta+'</b> de vuelto.',
    recurso: recurso,
  };
}

export function genMultiplicarDividir4Round(nivel){
  const recurso = 'Multiplicar un número de 3 dígitos por uno de 1 dígito es, en el fondo, sumar ese número varias veces — la multiplicación solo lo hace más rápido cuando los grupos son grandes. La <b>división</b> es la operación contraria: si multiplicar junta grupos iguales, dividir los reparte. Cuando divides un total en grupos de un tamaño fijo, la pregunta es "¿cuántos grupos completos se forman?" — y esa respuesta es exactamente lo que multiplicación y división comparten: si 6 × 4 = 24, entonces 24 ÷ 6 = 4 y 24 ÷ 4 = 6. Por eso se dice que multiplicar y dividir son operaciones inversas: una deshace lo que hace la otra.';
  const count = nivel==='facil' ? 2 : 4;
  if(Math.random()<0.5){
    let aRange, spread;
    if(nivel==='facil'){ aRange=[100,150]; spread=80; }
    else if(nivel==='dificil'){ aRange=[300,500]; spread=25; }
    else { aRange=[100,300]; spread=50; }
    const a = randInt(aRange[0],aRange[1]), b = randInt(2,9);
    const total = a*b;
    const opts = uniqueDistractors(total, 100, 5000, spread, count).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
      explain: a+' × '+b+' = <b>'+total+'</b>.',
      recurso: recurso,
    };
  }
  let qRange, spread;
  if(nivel==='facil'){ qRange=[5,10]; spread=5; }
  else if(nivel==='dificil'){ qRange=[20,40]; spread=2; }
  else { qRange=[10,20]; spread=3; }
  const b = randInt(2,9), q = randInt(qRange[0],qRange[1]);
  const total = b*q;
  const opts = uniqueDistractors(q, 2, 400, spread, count).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Tienes '+total+' objetos y los repartes en grupos de '+b+'. ¿Cuántos grupos se forman?</p>',
    options: opts, correctValue: q, speakText: '¿Cuántos grupos de '+b+' se forman con '+total+'?', cols:4,
    explain: total+' ÷ '+b+' = <b>'+q+'</b> grupos.',
    recurso: recurso,
  };
}

export function genFracciones4Round(nivel){
  const recurso = 'Una <b>fracción</b> representa una parte de un todo dividido en trozos iguales: el número de abajo (denominador) dice en cuántos trozos se dividió el todo, y el número de arriba (numerador) dice cuántos de esos trozos estás tomando. Para sumar dos fracciones que tienen el <b>mismo denominador</b>, solo se suman los numeradores y el denominador se queda igual — porque los trozos ya son del mismo tamaño, no hace falta convertir nada. Un <b>número mixto</b> (como 2 y 3/4) combina un número entero con una fracción, y sirve para representar cantidades que pasan de "un todo completo" pero no llegan a completar el siguiente: por ejemplo, 2 pizzas enteras más 3/4 de otra pizza.';
  const roll = Math.random();
  const count = nivel==='facil' ? 2 : 4;
  if(roll<0.4){
    const denPool = nivel==='facil' ? [2,3,4] : [2,3,4,5,6];
    const den = pick(denPool);
    const num = randInt(1,den-1);
    const correct = num+'/'+den;
    const useBarra = Math.random()<0.5;
    const dibujo = useBarra ? fraccionBarraSVG(num,den,110) : fraccionSVG(num,den,110);
    let candidatos;
    if(nivel==='dificil'){
      /* Distractores "trampa": misma fracción invertida (den/num) y un
         numerador vecino con el mismo denominador — mucho más parecidas
         a la correcta que una fracción de otro denominador. Se arman con
         un Set para garantizar que ninguna colapse con `correct` ni entre
         sí (bug real encontrado por fuzz-testing: un candidato calculado
         con las variables cambiadas de lugar podía coincidir con
         `correct` cuando el denominador "vecino" al azar era igual a
         `num`). */
      const candSet = new Set([correct]);
      candSet.add(den+'/'+num);
      const vecino = (num+1<=den-1) ? (num+1) : (num-1>=1 ? num-1 : num+2);
      candSet.add(vecino+'/'+den);
      let guard = 0;
      while(candSet.size<4 && guard<20){
        const otroDen = pick([2,3,4,5,6,7,8].filter(function(d){ return d!==den; }));
        candSet.add(num+'/'+otroDen);
        guard++;
      }
      candidatos = Array.from(candSet).slice(0,4);
    } else {
      const distractDens = shuffle([2,3,4,5,6].filter(function(d){ return d!==den; })).slice(0,2);
      const candSet = new Set([correct].concat(distractDens.map(function(d){ return num+'/'+d; })).concat([(num+1)+'/'+den]));
      candidatos = Array.from(candSet).slice(0,4);
    }
    const pool = nivel==='facil' ? [correct, candidatos.filter(function(c){ return c!==correct; })[0]] : candidatos;
    const opts = shuffle(pool).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<div class="shape-display">'+dibujo+'</div><p class="prompt-hint">¿Qué fracción está coloreada?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué fracción está coloreada?', cols:4, kind:'word',
      explain: 'Están coloreadas <b>'+num+' de '+den+'</b> partes, o sea <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const denPool = nivel==='facil' ? [3,4] : nivel==='dificil' ? [6,7,8] : [3,4,5,6];
    const den = pick(denPool);
    const a = randInt(1,den-2), b = randInt(1,den-a-1);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 1, den, 1, Math.min(count,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+'/'+den+' + '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum+'/'+den, speakText: '¿Cuánto es '+a+'/'+den+' más '+b+'/'+den+'?', cols:4,
      explain: a+'/'+den+' + '+b+'/'+den+' = <b>'+sum+'/'+den+'</b> (se suman los numeradores, el denominador no cambia).',
      recurso: recurso,
    };
  }
  const enteroMax = nivel==='dificil' ? 6 : nivel==='facil' ? 2 : 4;
  const entero = randInt(1,enteroMax);
  const denPool3 = nivel==='dificil' ? [3,4,5,6] : [2,3,4];
  const den = pick(denPool3);
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
  ]).slice(0, count-1);
  const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cómo se escribe el número mixto formado por '+entero+' enteros y '+num+'/'+den+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Cómo se escribe '+entero+' enteros y '+num+'/'+den+'?', cols:2, panel:true,
    explain: 'Se escribe <b>'+correct+'</b>: primero el número entero, luego la fracción.',
    recurso: recurso,
  };
}

export function genDecimales4Round(nivel){
  const recurso = 'Un número <b>decimal</b> es una forma distinta de escribir una fracción: los <b>décimos</b> (0,1; 0,2...) representan un todo dividido en 10 partes iguales, igual que una fracción con denominador 10 — por eso 0,3 y 3/10 significan exactamente lo mismo. La coma decimal separa la parte entera (a la izquierda) de la parte que es menor que un entero (a la derecha). Para sumar decimales, se alinean las comas una debajo de la otra y se suma como con números normales, columna por columna, igual que se hace con centenas, decenas y unidades. Los decimales se usan todos los días, por ejemplo en el dinero: $1,50 significa un peso con 50 centésimos.';
  const count = nivel==='facil' ? 2 : 4;
  if(Math.random()<0.5){
    const decimasMax = nivel==='facil' ? 5 : 9;
    const decimas = randInt(1,decimasMax);
    const correct = '0,'+decimas;
    const spread = nivel==='dificil' ? 1 : 2;
    const opts = uniqueDistractors(decimas, 1, 9, spread, count).map(function(v){ return {label:'0,'+v, value:'0,'+v}; });
    return {
      promptHTML: '<div class="shape-display">'+fraccionBarraSVG(decimas,10,110)+'</div><p class="prompt-hint">¿Qué número decimal representa esta barra (en décimos)?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué decimal representa esta barra?', cols:4,
      explain: decimas+' de 10 partes coloreadas es <b>'+correct+'</b> (‘'+decimas+' décimos’).',
      recurso: recurso,
    };
  }
  let aMax, bMax, spread;
  if(nivel==='facil'){ aMax=20; bMax=20; spread=10; }
  else if(nivel==='dificil'){ aMax=90; bMax=90; spread=2; }
  else { aMax=50; bMax=40; spread=5; }
  const a = randInt(1,aMax)/10, b = randInt(1,bMax)/10;
  const sum = Math.round((a+b)*10)/10;
  const opts = uniqueDistractors(Math.round(sum*10), 1, 200, spread, count).map(function(v){ return {label:(v/10).toFixed(1).replace('.',','), value:(v/10).toFixed(1).replace('.',',')}; });
  const correctLabel = sum.toFixed(1).replace('.',',');
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a.toFixed(1).replace('.',',')+' + '+b.toFixed(1).replace('.',',')+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts, correctValue: correctLabel, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
    explain: a.toFixed(1).replace('.',',')+' + '+b.toFixed(1).replace('.',',')+' = <b>'+correctLabel+'</b>.',
    recurso: recurso,
  };
}

export function genPatrones4Round(nivel){
  const recurso = 'Un <b>patrón numérico</b> es una secuencia de números que sigue siempre la misma regla — por ejemplo, sumar la misma cantidad cada vez. Para descubrir qué número sigue, primero hay que encontrar la regla: mira la diferencia entre dos números seguidos que ya conoces, y esa diferencia se repite en toda la secuencia. Una <b>ecuación</b> con un espacio en blanco (como ? + 5 = 12) es una pregunta que pide encontrar el número que falta para que la igualdad sea verdadera — se puede resolver pensando "¿qué número más 5 da 12?" o haciendo la operación contraria (12 − 5). Reconocer patrones y resolver ecuaciones simples es la puerta de entrada al álgebra, que estudiarás en años más avanzados.';
  const count = nivel==='facil' ? 2 : 4;
  if(Math.random()<0.5){
    let stepPool;
    if(nivel==='facil'){ stepPool=[2,5,10]; } else if(nivel==='dificil'){ stepPool=[3,7,9,11,13]; } else { stepPool=null; }
    const step = stepPool ? pick(stepPool) : randInt(3,15);
    const start = randInt(1,50);
    const seq = [start, start+step, start+2*step, start+3*step];
    const correct = start+4*step;
    const spread = nivel==='dificil' ? Math.max(2, Math.round(step/2)) : step;
    const opts = uniqueDistractors(correct, 1, 300, spread, count).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+seq.join(', ')+', <span class="blank">?</span></p><p class="prompt-hint">¿Qué número sigue en el patrón?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número sigue?', cols:4,
      explain: 'El patrón suma <b>'+step+'</b> cada vez, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  let aMax, bMax, spread;
  if(nivel==='facil'){ aMax=[5,30]; bMax=15; spread=10; }
  else if(nivel==='dificil'){ aMax=[40,80]; bMax=40; spread=3; }
  else { aMax=[5,80]; bMax=40; spread=8; }
  const a = randInt(aMax[0],aMax[1]), b = randInt(1,bMax);
  const total = a+b;
  const askA = Math.random()<0.5;
  const correct = askA ? a : b;
  const known = askA ? b : a;
  const opts = uniqueDistractors(correct, 0, 120, spread, count).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;"><span class="blank">?</span> + '+known+' = '+total+'</p><p class="prompt-hint">¿Qué número falta?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué número falta en la ecuación?', cols:4,
    explain: correct+' + '+known+' = '+total+', así que el número que falta es <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genGeometria4Round(nivel){
  const recurso = 'Un cuerpo geométrico 3D se puede describir de varias formas: por sus <b>coordenadas</b> en una cuadrícula (columna y fila, que dicen exactamente dónde está un punto), por sus <b>vistas</b> (qué forma se ve si lo miras de frente, de lado o desde arriba — un cubo siempre se ve cuadrado sin importar el ángulo, pero un cono se ve triángulo de frente y círculo desde arriba), o por su <b>simetría</b> (si al doblar una figura por la mitad, ambos lados coinciden exactamente). Los <b>ángulos</b> miden qué tan abierta o cerrada está una esquina, y se clasifican en agudo (más cerrado que una escuadra), recto (exactamente como una escuadra) y obtuso (más abierto que una escuadra).';
  const roll = Math.random();
  const count = nivel==='facil' ? 2 : 4;
  if(roll<0.25){
    const col = randInt(1,10), row = randInt(1,10);
    /* Difícil: dirección al azar entre las 4 posibles, en vez de siempre
       "a la derecha" — obliga a leer con cuidado cuál coordenada cambia. */
    const dir = nivel==='dificil' ? pick(['derecha','izquierda','arriba','abajo']) : 'derecha';
    let nuevoCol = col, nuevoRow = row, dirLabel;
    if(dir==='derecha'){ nuevoCol = col+1; dirLabel = '1 columna hacia la derecha'; }
    else if(dir==='izquierda'){ nuevoCol = Math.max(1,col-1); dirLabel = '1 columna hacia la izquierda'; }
    else if(dir==='arriba'){ nuevoRow = row+1; dirLabel = '1 fila hacia arriba'; }
    else { nuevoRow = Math.max(1,row-1); dirLabel = '1 fila hacia abajo'; }
    const correct = nuevoCol+','+nuevoRow;
    const candidatos = [col+','+row, (col+1)+','+row, col+','+(row+1), (nuevoCol+1)+','+nuevoRow, nuevoCol+','+(nuevoRow+1)];
    const distractPool = Array.from(new Set(candidatos)).filter(function(c){ return c!==correct; });
    const opts = shuffle([correct].concat(shuffle(distractPool).slice(0,count-1))).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-hint">Un punto está ubicado en la coordenada (columna, fila) = ('+col+', '+row+'). Si avanzas '+dirLabel+', ¿cuál es la nueva coordenada?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la nueva coordenada?', cols:2, panel:true,
      explain: 'Avanzar '+dirLabel+' da la coordenada ('+correct+').',
      recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(SOLIDOS_VISTAS_BANK);
    const vista = pick(['frente','lado','arriba']);
    const correct = item[vista];
    const distract = shuffle(['Un cuadrado','Un círculo','Un triángulo','Un rectángulo'].filter(function(v){ return v!==correct; })).slice(0,count-1);
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
    /* Fácil: figuras de contraste obvio (círculo/cuadrado sí, paralelogramo
       no). Difícil: figuras menos evidentes a simple vista sin doblarlas
       mentalmente (triángulo/óvalo/rombo/paralelogramo). */
    const bankPool = nivel==='facil' ? SIMETRIA_BANK.filter(function(it){ return ['circulo','cuadrado','paralelogramo'].indexOf(it.id)!==-1; })
      : nivel==='dificil' ? SIMETRIA_BANK.filter(function(it){ return ['triangulo','ovalo','rombo','paralelogramo'].indexOf(it.id)!==-1; })
      : SIMETRIA_BANK;
    const item = pick(bankPool);
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

export function genMedicion4Round(nivel){
  const recurso = 'Medir en 4° básico junta varias ideas: el reloj de <b>24 horas</b> (usado en muchos relojes digitales y horarios de buses/aviones) se puede convertir al formato A.M./P.M. de 12 horas que usamos para hablar — las horas de 13 a 23 restan 12 para pasar a P.M. (14:00 = 2:00 P.M.). También se puede convertir entre unidades de tiempo (60 minutos = 1 hora, 24 horas = 1 día) y de longitud (100 centímetros = 1 metro). El <b>área</b> de un rectángulo es el espacio que cubre su superficie, y se calcula multiplicando largo × ancho; el <b>volumen</b> de una caja es el espacio que ocupa por dentro, y se calcula multiplicando largo × ancho × alto — una dimensión más que el área, porque el volumen mide un espacio en 3 direcciones en vez de 2.';
  const roll = Math.random();
  const count = nivel==='facil' ? 2 : 4;
  if(roll<0.2){
    const item = pick(HORA_AMPM_BANK);
    const distract = shuffle(HORA_AMPM_BANK.filter(function(h){ return h.correcto!==item.correcto; })).slice(0,count-1).map(function(h){ return h.correcto; });
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
    const optPool = nivel==='facil' ? item.opts.slice(0,1) : item.opts;
    const opts = shuffle([item.correcta].concat(optPool)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.6){
    let minGap;
    if(nivel==='facil'){ minGap=400; } else if(nivel==='dificil'){ minGap=1; } else { minGap=50; }
    let a = pick(OBJETOS_LONGITUD4), b = pick(OBJETOS_LONGITUD4), guard=0;
    while((b.label===a.label || Math.abs(a.cm-b.cm)<minGap) && guard<80){ b = pick(OBJETOS_LONGITUD4); guard++; }
    if(b.label===a.label) b = OBJETOS_LONGITUD4.filter(function(o){ return o.label!==a.label; })[0];
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
    let largoR, anchoR, spread;
    if(nivel==='facil'){ largoR=[3,6]; anchoR=[2,4]; spread=15; }
    else if(nivel==='dificil'){ largoR=[8,15]; anchoR=[6,12]; spread=3; }
    else { largoR=[3,10]; anchoR=[2,8]; spread=6; }
    const largo = randInt(largoR[0],largoR[1]), ancho = randInt(anchoR[0],anchoR[1]);
    const area = largo*ancho;
    const opts = uniqueDistractors(area, 4, 200, spread, count).map(function(v){ return {label:v+' unidades cuadradas', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un rectángulo mide '+largo+' unidades de largo y '+ancho+' unidades de ancho. ¿Cuál es su área?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área del rectángulo?', cols:2,
      explain: 'El área es largo × ancho: '+largo+' × '+ancho+' = <b>'+area+' unidades cuadradas</b>.',
      recurso: recurso,
    };
  }
  let lR, aR, hR, spread2;
  if(nivel==='facil'){ lR=[2,3]; aR=[2,3]; hR=[2,3]; spread2=10; }
  else if(nivel==='dificil'){ lR=[4,7]; aR=[3,6]; hR=[3,5]; spread2=4; }
  else { lR=[2,5]; aR=[2,4]; hR=[2,4]; spread2=8; }
  const l = randInt(lR[0],lR[1]), a = randInt(aR[0],aR[1]), h = randInt(hR[0],hR[1]);
  const vol = l*a*h;
  const opts = uniqueDistractors(vol, 4, 400, spread2, count).map(function(v){ return {label:v+' cubos', value:v}; });
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

export function genDatos4Round(nivel){
  const recurso = 'Una <b>encuesta</b> junta las respuestas de varias personas sobre una misma pregunta, y un <b>gráfico de barras</b> muestra esas respuestas de forma visual: mientras más alta la barra, más personas eligieron esa opción — así se puede ver de un vistazo cuál opción ganó (la barra más alta) y cuál perdió (la más baja), y sumando todas las barras se obtiene el total de personas encuestadas. La <b>probabilidad</b> estudia qué tan posible es que ocurra algo al azar: lanzar una moneda tiene solo 2 resultados posibles (cara o sello), y si una bolsa tiene más bolitas de un color que de otro, es más probable sacar ese color — aunque nunca es una certeza, solo una posibilidad más alta.';
  const roll = Math.random();
  const count = nivel==='facil' ? 2 : 4;
  const spread = nivel==='dificil' ? 1 : 3;
  if(roll<0.34){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const opts = uniqueDistractors(total, 5, 60, spread, count).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuántas personas respondieron la encuesta en total?</p>',
      options: opts, correctValue: total, speakText: '¿Cuántas personas respondieron en total?', cols:4,
      explain: 'Sumando todas las categorías: '+item.categorias.map(function(c){ return c.valor; }).join(' + ')+' = <b>'+total+'</b> personas en total.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(EXPERIMENTOS_ALEATORIOS_BANK);
    const optPool = nivel==='facil' ? item.opts.slice(0,1) : item.opts;
    const opts = shuffle([item.correcta].concat(optPool)).map(function(o){ return {label:o, value:o}; });
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

export function genExamenMate4Round(){
  const gens = [genNumeros4Round, genOperaciones4Round, genMultiplicarDividir4Round, genFracciones4Round, genDecimales4Round, genPatrones4Round, genGeometria4Round, genMedicion4Round, genDatos4Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenmate5', label:'Examen Final', open:true, key:'examenmate5'},
];
export const MATE_POS_G5 = [
  {x:22,y:96},{x:68,y:87},{x:22,y:78},{x:68,y:69},{x:22,y:60},
  {x:68,y:51},{x:22,y:42},{x:68,y:33},{x:22,y:24},{x:68,y:15},{x:22,y:6},
];

export function genNumeros5Round(nivel){
  const recurso = 'Los números hasta 900 millones se leen por <b>tramos de a tres cifras</b>: unidades, luego miles, luego millones — así 235.480.917 se lee "doscientos treinta y cinco millones, cuatrocientos ochenta mil, novecientos diecisiete". Cada posición vale 10 veces la de su derecha: una <b>centena de millón</b> vale 100.000.000, una <b>decena de millón</b> vale 10.000.000 y una <b>unidad de millón</b> vale 1.000.000. Para comparar dos números grandes, primero se cuenta cuántas cifras tiene cada uno (el que tiene más cifras es mayor); si tienen la misma cantidad, se comparan dígito por dígito de izquierda a derecha hasta encontrar una diferencia. Entender el valor posicional es la base para sumar, restar, multiplicar y dividir números grandes sin equivocarse.';
  const lo = nivel==='facil' ? 1000 : (nivel==='dificil' ? 100000000 : 100000);
  const hi = nivel==='facil' ? 999999 : (nivel==='dificil' ? 999999999 : 900000000);
  const spreadMul = nivel==='facil' ? 2 : (nivel==='dificil' ? 0.5 : 1);
  const roll = Math.random();
  if(roll<0.34){
    const n = randInt(lo, hi);
    const opts = uniqueDistractors(n, lo, hi, Math.max(1000,Math.floor(n*0.02*spreadMul)), 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es igual a '+n+'?</p>',
      options: opts, correctValue: n, speakText: '¿Cuál número es igual a '+n+'?', cols:2, panel:true,
      explain: 'El número correcto es <b>'+n+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    let a = randInt(lo,hi), b = randInt(lo,hi);
    while(a===b) b = randInt(lo,hi);
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.', recurso: recurso,
    };
  }
  const centena = randInt(1,9)*100000000 + randInt(0,9)*10000000;
  const n = centena + randInt(0,9999999);
  const digitos = String(n).padStart(9,'0').split('').map(Number);
  const POSICIONES_FACIL = {'CENTENA':6,'DECENA':7,'UNIDAD':8};
  const POSICIONES_NORMAL = {'CENTENA DE MILLÓN':0,'DECENA DE MILLÓN':1,'UNIDAD DE MILLÓN':2};
  const POSICIONES_DIFICIL = {'CENTENA DE MILLÓN':0,'DECENA DE MILLÓN':1,'UNIDAD DE MILLÓN':2,'CENTENA DE MIL':3,'DECENA DE MIL':4,'UNIDAD DE MIL':5,'CENTENA':6,'DECENA':7,'UNIDAD':8};
  const posMap = nivel==='facil' ? POSICIONES_FACIL : (nivel==='dificil' ? POSICIONES_DIFICIL : POSICIONES_NORMAL);
  const keys = Object.keys(posMap);
  const cifraPos = pick(keys);
  const posIdx = posMap[cifraPos];
  const correct = digitos[posIdx];
  const opts = uniqueDistractors(correct, 0, 9, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:32px;">'+n+'</p><p class="prompt-hint">¿Qué dígito ocupa la posición de las '+cifraPos.toLowerCase()+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué dígito ocupa la posición de las '+cifraPos.toLowerCase()+'?', cols:4,
    explain: 'El dígito en esa posición es <b>'+correct+'</b>.', recurso: recurso,
  };
}

export function genMultiplicar5Round(nivel){
  const recurso = 'Para multiplicar dos números de dos cifras se puede usar el <b>cálculo mental</b>: descomponer un número en partes fáciles (por ejemplo 23 = 20 + 3) y multiplicar cada parte por separado, sumando después los resultados — esto se llama <b>propiedad distributiva</b>. También ayuda apoyarse en multiplicaciones "amigas" que ya se saben, como los múltiplos de 10 (7 × 10 = 70), para deducir otras cercanas (7 × 9 = 70 - 7 = 63). Practicar estas estrategias hace que multiplicar números más grandes sea más rápido y con menos errores que solo memorizar tablas.';
  const rango = nivel==='facil' ? [11,20] : (nivel==='dificil' ? [30,60] : [11,40]);
  if(Math.random()<0.5){
    const a = randInt(rango[0],rango[1]), b = randInt(rango[0],rango[1]);
    const total = a*b;
    const opts = uniqueDistractors(total, 100, 4000, 40, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
      explain: a+' × '+b+' = <b>'+total+'</b>.', recurso: recurso,
    };
  }
  const a = pick([2,4,5,10,20,25,50]);
  const b = randInt(3,9);
  const facilAyuda = a*10;
  const total = a*b;
  const opts = uniqueDistractors(total, 6, 900, 20, 4).map(function(v){ return {label:String(v), value:v}; });
  const promptHTML = nivel==='dificil'
    ? '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">Usa cálculo mental. ¿Cuánto es?</p>'
    : '<p class="prompt-hint">Usando cálculo mental: si '+a+' × 10 = '+facilAyuda+', ¿cuánto es '+a+' × '+b+'?</p>';
  return {
    promptHTML: promptHTML,
    options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
    explain: 'Puedes usar la propiedad distributiva: '+a+' × '+b+' = <b>'+total+'</b>.', recurso: recurso,
  };
}

export function genDividir5Round(nivel){
  const recurso = 'En una división, el <b>dividendo</b> es el número que se reparte, el <b>divisor</b> es en cuántas partes se reparte, el <b>cociente</b> es el resultado de cada parte, y el <b>resto</b> es lo que sobra sin poder repartirse en partes iguales. El resto SIEMPRE debe ser menor que el divisor — si al dividir te queda un resto igual o mayor que el divisor, significa que el cociente todavía puede subir un poco más. Para comprobar que una división está bien hecha, se usa la fórmula: divisor × cociente + resto = dividendo.';
  const divisor = nivel==='facil' ? randInt(2,5) : randInt(2,9);
  const cociente = nivel==='dificil' ? randInt(50,199) : randInt(11,99);
  const resto = nivel==='facil' ? 0 : randInt(0,divisor-1);
  const dividendo = divisor*cociente + resto;
  if(Math.random()<0.5){
    const opts = uniqueDistractors(cociente, 10, 500, 8, 4).map(function(v){ return {label:String(v), value:v}; });
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
export function genOperaciones5Round(nivel){
  const recurso = 'Cuando una operación combina sumas, restas, multiplicaciones y divisiones, el <b>orden de las operaciones</b> dice qué se calcula primero: (1) lo que está dentro de un paréntesis, (2) las multiplicaciones y divisiones (de izquierda a derecha), y (3) al final las sumas y restas. Seguir este orden evita que dos personas obtengan resultados distintos para la misma operación. Este mismo orden se usa al resolver problemas de dinero: primero se calcula el costo total (precio × cantidad) y luego se suma o resta según lo que pida el problema.';
  const roll = Math.random();
  if(roll<0.34){
    const a = randInt(10,90), b = randInt(2,9), c = randInt(1,nivel==='dificil'?30:20);
    const conParentesis = Math.random()<0.5;
    const correct = conParentesis ? (a+b)*c - 5 : a + b*c - 5;
    const promptTxt = conParentesis ? '('+a+' + '+b+') × '+c+' - 5' : a+' + '+b+' × '+c+' - 5';
    const opts = uniqueDistractors(correct, 0, 4000, 15, 4).map(function(v){ return {label:String(v), value:v}; });
    const hint = nivel==='dificil' ? '¿Cuánto es?' : '¿Cuánto es? (recuerda: primero paréntesis, luego multiplicación/división, y por último suma/resta)';
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">'+promptTxt+'</p><p class="prompt-hint">'+hint+'</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+promptTxt+'?', cols:4,
      explain: promptTxt+' = <b>'+correct+'</b>, respetando el orden de las operaciones.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(OBJETOS_PRECIO5);
    const cantidad = nivel==='facil' ? randInt(2,3) : (nivel==='dificil' ? randInt(4,8) : randInt(2,5));
    const total = item.precio*cantidad;
    const opts = uniqueDistractors(total, 1000, 100000, 1000, 4).map(function(v){ return {label:'$'+v, value:v}; });
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

export function genFracciones5Round(nivel){
  const recurso = 'Una fracción es <b>propia</b> cuando el numerador (número de arriba) es menor que el denominador (número de abajo) — representa "menos de un entero completo", como 2/5. Es <b>impropia</b> cuando el numerador es igual o mayor que el denominador — representa "un entero completo o más", como 7/4. Para sumar o restar fracciones que ya tienen el <b>mismo denominador</b>, se suman o restan solo los numeradores y el denominador se mantiene igual — porque están repartidas en partes del mismo tamaño, solo cambia cuántas partes se tienen.';
  const roll = Math.random();
  if(roll<0.25){
    const den = pick([3,4,5,6,7,8]);
    const num = randInt(1,den-1);
    const correct = 'Fracción propia';
    const opts = shuffle([{label:'Fracción propia', value:'Fracción propia'},{label:'Fracción impropia', value:'Fracción impropia'}]);
    const visual = nivel==='dificil' ? '<p class="prompt-count" style="font-size:32px;">'+num+'/'+den+'</p>' : '<div class="shape-display">'+fraccionSVG(num,den,110)+'</div>';
    return {
      promptHTML: visual+'<p class="prompt-hint">La fracción es '+num+'/'+den+'. ¿Es una fracción propia (numerador menor que el denominador) o impropia?</p>',
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
  const denPool = nivel==='facil' ? [4,5,6] : (nivel==='dificil' ? [8,9,10,11,12] : [4,5,6,7,8,9,10,11,12]);
  if(roll<0.75){
    const den = pick(denPool);
    const a = randInt(1,den-2), b = randInt(1,den-a-1);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 1, den, 1, Math.min(4,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+'/'+den+' + '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum+'/'+den, speakText: '¿Cuánto es '+a+'/'+den+' más '+b+'/'+den+'?', cols:4,
      explain: a+'/'+den+' + '+b+'/'+den+' = <b>'+sum+'/'+den+'</b> (se suman los numeradores, el denominador no cambia).', recurso: recurso,
    };
  }
  const den = pick(denPool);
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
export function genDecimales5Round(nivel){
  const recurso = 'Los <b>decimales</b> son otra forma de escribir fracciones cuyo denominador es 10, 100 o 1000: los <b>décimos</b> (10) se escriben con 1 cifra tras la coma (0,7 = 7/10), los <b>centésimos</b> (100) con 2 cifras (0,25 = 25/100), y los <b>milésimos</b> (1000) con 3 cifras. Para comparar dos decimales se comparan primero las cifras enteras y luego, si son iguales, las cifras después de la coma una por una de izquierda a derecha. Para sumar decimales, se alinean las comas en columna y se suma como si fueran números enteros, cuidando de poner la coma en el resultado en la misma posición.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(FRACCION_A_DECIMAL_BANK);
    const distractCount = nivel==='facil' ? 1 : 3;
    const distract = shuffle(FRACCION_A_DECIMAL_BANK.filter(function(f){ return f.decimal!==item.decimal; })).slice(0,distractCount).map(function(f){ return f.decimal; });
    const opts = shuffle([item.decimal].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+item.num+'/'+item.den+'</p><p class="prompt-hint">¿A qué decimal equivale esta fracción?</p>',
      options: opts, correctValue: item.decimal, speakText: '¿A qué decimal equivale '+item.num+'/'+item.den+'?', cols:4,
      explain: item.num+'/'+item.den+' equivale a <b>'+item.decimal+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    let aNum, bNum;
    if(nivel==='facil'){
      aNum = randInt(1,9)*100; bNum = randInt(1,9)*100;
      while(bNum===aNum) bNum = randInt(1,9)*100;
    } else if(nivel==='dificil'){
      aNum = randInt(1,995);
      bNum = aNum + pick([-3,-2,-1,1,2,3]);
      if(bNum<1) bNum = aNum+2;
      if(bNum>999) bNum = aNum-2;
    } else {
      aNum = randInt(1,999); bNum = randInt(1,999);
      while(bNum===aNum) bNum = randInt(1,999);
    }
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
    const spread = nivel==='facil' ? 30 : (nivel==='dificil' ? 6 : 15);
    const a = randInt(1,900)/100, b = randInt(1,900)/100;
    const sum = Math.round((a+b)*100)/100;
    const opts = uniqueDistractors(Math.round(sum*100), 1, 2000, spread, 4).map(function(v){ return {label:(v/100).toFixed(2).replace('.',','), value:(v/100).toFixed(2).replace('.',',')}; });
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

export function genPatrones5Round(nivel){
  const recurso = 'Un <b>patrón numérico</b> es una secuencia de números que sigue siempre la misma regla — puede ser sumar/restar la misma cantidad cada vez, o multiplicar por el mismo número. Para descubrir la regla, se compara un término con el siguiente y se busca qué operación los conecta, y esa misma operación se repite para encontrar el término que sigue. Una <b>ecuación</b> con una incógnita (como "x + 8 = 15") se resuelve haciendo la operación inversa: si algo se sumó, se resta; si algo se restó, se suma — así se despeja el valor de x que hace verdadera la igualdad.';
  const roll = Math.random();
  if(roll<0.34){
    const tipos = nivel==='facil' ? ['SUMA','RESTA'] : ['SUMA','RESTA','MULTIPLICACIÓN'];
    const tipo = pick(tipos);
    const start = randInt(2,20);
    let step, seq, correct;
    if(tipo==='SUMA'){ step = randInt(3,15); seq=[start,start+step,start+2*step,start+3*step]; correct=start+4*step; }
    else if(tipo==='RESTA'){ step = randInt(2,8); const s0=start+4*step; seq=[s0,s0-step,s0-2*step,s0-3*step]; correct=s0-4*step; }
    else { step = randInt(2,3); seq=[start,start*step,start*step*step,start*step*step*step]; correct=start*Math.pow(step,4); }
    const opts = uniqueDistractors(correct, 0, 8000, Math.max(2,step), 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+seq.join(', ')+', <span class="blank">?</span></p><p class="prompt-hint">¿Qué número sigue en el patrón?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué número sigue?', cols:4,
      explain: 'La regla es "'+tipo.toLowerCase()+' '+step+'" cada vez, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.', recurso: recurso,
    };
  }
  const rangoX = nivel==='facil' ? [1,20] : (nivel==='dificil' ? [30,90] : [1,50]);
  if(roll<0.67){
    const x = randInt(rangoX[0],rangoX[1]), suma = randInt(5,50);
    const total = x+suma;
    const opts = uniqueDistractors(x, 0, 300, 6, 4).map(function(v){ return {label:'x = '+v, value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">x + '+suma+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
      options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
      explain: total+' - '+suma+' = <b>'+x+'</b>, así que x = '+x+'.', recurso: recurso,
    };
  }
  const x = randInt(rangoX[0],rangoX[1]), resta = randInt(1,20);
  const total = x-resta;
  const opts = uniqueDistractors(x, 0, 150, 5, 4).map(function(v){ return {label:'x = '+v, value:v}; });
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
export function genGeometria5Round(nivel){
  const recurso = 'El <b>plano cartesiano</b> ubica puntos con dos números (x, y): el primero indica cuánto moverse hacia la derecha, el segundo cuánto moverse hacia arriba, siempre partiendo del punto (0,0). Dos lados son <b>paralelos</b> cuando nunca se juntan por más que se extiendan, como los rieles de un tren. Las <b>transformaciones geométricas</b> cambian la posición de una figura sin cambiar su forma ni su tamaño: la <b>traslación</b> la desliza en línea recta, la <b>reflexión</b> la voltea como en un espejo, y la <b>rotación</b> la gira alrededor de un punto fijo.';
  const roll = Math.random();
  if(roll<0.34){
    const colMax = nivel==='dificil' ? 12 : 8;
    const dMax = nivel==='facil' ? 1 : (nivel==='dificil' ? 5 : 3);
    const col = randInt(1,colMax), row = randInt(1,colMax);
    const dx = randInt(1,dMax), dy = randInt(1,dMax);
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
    const visual = nivel==='dificil' ? '<p class="prompt-sentence">'+item.label+'</p>' : '<div class="shape-display">'+shapeSVG(item.id,100)+'</div>';
    return {
      promptHTML: visual+'<p class="prompt-hint">¿Esta figura tiene al menos un par de lados paralelos?</p>',
      options: opts, correctValue: item.paralelo, speakText: '¿'+item.label+' tiene lados paralelos?', cols:2, panel:true,
      explain: item.paralelo ? art+' '+item.label.toLowerCase()+' sí tiene al menos un par de lados paralelos.' : art+' '+item.label.toLowerCase()+' no tiene lados paralelos.', recurso: recurso,
    };
  }
  const item = pick(TRANSFORMACIONES_BANK);
  const todos = ['Traslación','Reflexión','Rotación'];
  const distractAll = todos.filter(function(t){ return t!==item.tipo; });
  const distract = nivel==='facil' ? distractAll.slice(0,1) : distractAll;
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
export function genMedicion5Round(nivel){
  const recurso = 'Las unidades de longitud (km, m, cm, mm) se convierten multiplicando o dividiendo por 10, 100 o 1000 según la distancia entre ellas: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm. El <b>perímetro</b> de un rectángulo es la suma de sus 4 lados: 2×(largo+ancho). El <b>área</b> mide cuánta superficie cubre una figura: en un triángulo es (base × altura) ÷ 2, en un paralelogramo es base × altura, y en un trapecio es (base mayor + base menor) × altura ÷ 2 — en los tres casos la altura es la distancia perpendicular (en ángulo recto) entre la base y el vértice o lado opuesto.';
  const roll = Math.random();
  if(roll<0.25){
    const a = pick(OBJETOS_LONGITUD5);
    const candidatos = OBJETOS_LONGITUD5.filter(function(o){ return o.label!==a.label; }).sort(function(x,y){
      return Math.abs(x.cm-a.cm) - Math.abs(y.cm-a.cm);
    });
    let b;
    if(nivel==='facil') b = candidatos[candidatos.length-1];
    else if(nivel==='dificil') b = candidatos[0];
    else b = pick(candidatos);
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
    const spreadMul = nivel==='facil' ? 1.6 : (nivel==='dificil' ? 0.6 : 1);
    const opts = uniqueDistractors(item.resultado, 1, 20000, Math.max(5,Math.floor(item.resultado*0.2*spreadMul)), 4).map(function(v){ return {label:v+' '+item.a, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.valor+' '+item.de+' equivalen a ¿cuántos '+item.a+'?</p>',
      options: opts, correctValue: item.resultado, speakText: '¿A cuántos '+item.a+' equivalen '+item.valor+' '+item.de+'?', cols:4,
      explain: item.valor+' '+item.de+' = <b>'+item.resultado+' '+item.a+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const perimRango = nivel==='facil' ? [8,20] : (nivel==='dificil' ? [30,60] : [12,40]);
    const perimetro = randInt(perimRango[0],perimRango[1])*2;
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
  const baseRango = nivel==='facil' ? [4,8] : (nivel==='dificil' ? [10,18] : [4,12]);
  const base = randInt(baseRango[0],baseRango[1]), altura = randInt(2,5)*2;
  let area, formula;
  if(tipo==='TRIÁNGULO'){ area = Math.round(base*altura/2); formula = '(base × altura) ÷ 2 = ('+base+' × '+altura+') ÷ 2'; }
  else if(tipo==='PARALELOGRAMO'){ area = base*altura; formula = 'base × altura = '+base+' × '+altura; }
  else { const base2 = base+randInt(1,4); area = Math.round((base+base2)*altura/2); formula = '(base mayor + base menor) × altura ÷ 2 = ('+base2+' + '+base+') × '+altura+' ÷ 2'; }
  const opts = uniqueDistractors(area, 2, 400, 6, 4).map(function(v){ return {label:v+' unidades cuadradas', value:v}; });
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
export function genDatos5Round(nivel){
  const recurso = 'El <b>promedio</b> (o media) de un conjunto de datos se calcula sumando todos los valores y dividiendo por la cantidad de datos que hay — resume "qué tan grande, en general" es un conjunto de números con un solo valor. La <b>probabilidad cualitativa</b> describe qué tan posible es un evento sin necesidad de calcular un número exacto: puede ser seguro, posible, poco posible o imposible; para comparar dos probabilidades basta con mirar qué proporción de casos favorables tiene cada opción, sin calcular la fracción exacta. Un <b>diagrama de tallo y hojas</b> es una forma de ordenar números de dos cifras: el "tallo" muestra la decena y las "hojas" muestran las unidades que le corresponden.';
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const promedio = Math.round((total/item.categorias.length)*10)/10;
    const spread = nivel==='facil' ? 15 : (nivel==='dificil' ? 4 : 8);
    const opts = uniqueDistractors(Math.round(promedio*10), 5, 300, spread, 4).map(function(v){ return {label:(v/10).toFixed(1), value:(v/10).toFixed(1)}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál es el promedio de respuestas por categoría?</p>',
      options: opts, correctValue: promedio.toFixed(1), speakText: '¿Cuál es el promedio?', cols:4,
      explain: 'El promedio es la suma dividida por la cantidad de categorías: '+total+' ÷ '+item.categorias.length+' = <b>'+promedio.toFixed(1)+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.4){
    const item = pick(PROBABILIDAD_CUALITATIVA_BANK);
    const todosFull = ['Seguro','Posible','Poco posible','Imposible'];
    const distractAll = todosFull.filter(function(n){ return n!==item.nivel; });
    const distract = nivel==='facil' ? distractAll.slice(0,1) : distractAll;
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
  const hojasCount = nivel==='dificil' ? 7 : 5;
  const hojas = shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,hojasCount).sort(function(a,b){return a-b;});
  const valores = hojas.map(function(h){ return tallo*10+h; });
  const preguntaMax = Math.random()<0.5;
  const correct = preguntaMax ? Math.max.apply(null,valores) : Math.min.apply(null,valores);
  const opts = uniqueDistractors(correct, tallo*10, tallo*10+9, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  const tabla = '<table class="stem-leaf"><tr><th>Tallo</th><th>Hojas</th></tr><tr><td>'+tallo+'</td><td>'+hojas.join(' ')+'</td></tr></table>';
  const listaTxt = nivel==='dificil' ? '' : ' Este diagrama de tallo y hojas representa los números '+valores.join(', ')+'.';
  return {
    promptHTML: tabla+'<p class="prompt-hint">'+listaTxt+' ¿Cuál es el valor '+(preguntaMax?'más alto':'más bajo')+' del diagrama?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál es el valor '+(preguntaMax?'más alto':'más bajo')+'?', cols:4,
    explain: 'El valor '+(preguntaMax?'más alto':'más bajo')+' es <b>'+correct+'</b>.', recurso: recurso,
  };
}

export function genExamenMate5Round(){
  const gens = [genNumeros5Round, genMultiplicar5Round, genDividir5Round, genOperaciones5Round, genFracciones5Round, genDecimales5Round, genPatrones5Round, genGeometria5Round, genMedicion5Round, genDatos5Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenmate6', label:'Examen Final', open:true, key:'examenmate6'},
];
export const MATE_POS_G6 = [
  {x:22,y:96},{x:68,y:87},{x:22,y:78},{x:68,y:69},{x:22,y:60},
  {x:68,y:51},{x:22,y:42},{x:68,y:33},{x:22,y:24},{x:68,y:15},{x:22,y:6},
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
export function genMultiplosFactores6Round(nivel){
  const recurso = 'Los <b>múltiplos</b> de un número se obtienen multiplicándolo por 1, 2, 3, 4... (los múltiplos de 4 son 4, 8, 12, 16...), y siempre son infinitos. Los <b>factores</b> (o divisores) de un número son los números que lo dividen exactamente, sin dejar resto — los factores de 12 son 1, 2, 3, 4, 6 y 12. Un número es <b>primo</b> cuando tiene exactamente 2 factores: el 1 y sí mismo (2, 3, 5, 7, 11...); es <b>compuesto</b> cuando tiene más de 2 factores. Reconocer múltiplos, factores y números primos ayuda a simplificar fracciones y a resolver problemas de reparto en partes iguales.';
  const roll = Math.random();
  if(roll<0.34){
    const b = nivel==='facil' ? randInt(3,6) : (nivel==='dificil' ? randInt(8,12) : randInt(3,12));
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
    const candidatosFull = [12,18,20,24,28,30,36,40,42,45,48,60];
    const candidatos = nivel==='facil' ? [12,18,20,24,28,30] : (nivel==='dificil' ? [36,40,42,45,48,60] : candidatosFull);
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
  const n = nivel==='facil' ? randInt(2,20) : (nivel==='dificil' ? randInt(50,97) : randInt(2,50));
  const correct = isPrime(n) ? 'PRIMO' : 'COMPUESTO';
  const opts = shuffle([{label:'Número primo', value:'PRIMO'},{label:'Número compuesto', value:'COMPUESTO'}]);
  return {
    promptHTML: '<p class="prompt-count" style="font-size:36px;">'+n+'</p><p class="prompt-hint">¿Es un número primo o compuesto?</p>',
    options: opts, correctValue: correct, speakText: '¿Es '+n+' un número primo o compuesto?', cols:2, panel:true,
    explain: correct==='PRIMO' ? n+' es <b>primo</b>: solo se puede dividir exactamente por 1 y por sí mismo.' : n+' es <b>compuesto</b>: tiene más divisores además de 1 y sí mismo.', recurso: recurso,
  };
}

export function genOperatoria6Round(nivel){
  const recurso = 'Cuando una operación combina paréntesis, multiplicaciones/divisiones y sumas/restas, hay un orden fijo para resolverla: primero lo que está dentro de los <b>paréntesis</b>, después las <b>multiplicaciones y divisiones</b> (de izquierda a derecha), y al final las <b>sumas y restas</b> (de izquierda a derecha). Seguir siempre este mismo orden es lo que permite que cualquier persona, en cualquier parte, llegue exactamente al mismo resultado al resolver la misma operación.';
  if(Math.random()<0.5){
    const a = randInt(100,900), b = randInt(10,90), c = randInt(2,9), d = randInt(1,50);
    const correct = (a+b)*c - d;
    const promptTxt = '('+a+' + '+b+') × '+c+' - '+d;
    const opts = uniqueDistractors(correct, 0, 15000, 30, 4).map(function(v){ return {label:String(v), value:v}; });
    const hint = nivel==='dificil' ? '¿Cuánto es?' : '¿Cuánto es? (recuerda: primero paréntesis, luego multiplicación, y por último resta)';
    return {
      promptHTML: '<p class="prompt-count" style="font-size:24px;">'+promptTxt+'</p><p class="prompt-hint">'+hint+'</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+promptTxt+'?', cols:2,
      explain: promptTxt+' = <b>'+correct+'</b>, respetando el orden de las operaciones.', recurso: recurso,
    };
  }
  const suma = Math.random()<0.5;
  const rango = nivel==='facil' ? [2000,9000] : (nivel==='dificil' ? [50000,99999] : [10000,89999]);
  const bRango = nivel==='facil' ? [100,900] : [1000,9000];
  const a = randInt(rango[0],rango[1]), b = randInt(bRango[0],bRango[1]);
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
export function genRazonesPorcentajes6Round(nivel){
  const recurso = 'Una <b>razón</b> compara dos cantidades relacionadas, como "3 : 2" (3 niñas por cada 2 niños). Un <b>porcentaje</b> es una forma especial de razón que siempre compara contra 100 — "25%" significa "25 de cada 100". Para calcular el p% de un número n, se multiplica n × p y se divide por 100 (el 25% de 200 es 200×25÷100 = 50). Razones y porcentajes se usan todos los días: en descuentos, en encuestas, y para comparar cantidades de distinto tamaño de forma justa.';
  if(Math.random()<0.5){
    const esc = pick(RAZON_ESCENARIOS);
    let a = randInt(2,9), b = randInt(2,9);
    while(b===a) b = randInt(2,9);
    const correct = a+':'+b;
    const distractAll = shuffle([b+':'+a, a+':'+(b+1), (a+1)+':'+b].filter(function(d){ return d!==correct; }));
    const distract = nivel==='facil' ? distractAll.slice(0,1) : distractAll;
    const opts = shuffle([correct].concat(distract)).map(function(r){ return {label:r, value:r}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+esc.texto.replace('{a}',a).replace('{b}',b)+'</p><p class="prompt-hint">¿Cuál es la razón entre '+esc.itemA+' y '+esc.itemB+'?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la razón entre '+esc.itemA+' y '+esc.itemB+'?', cols:4,
      explain: 'La razón es <b>'+correct+'</b>: '+a+' '+esc.itemA+' por cada '+b+' '+esc.itemB+'.', recurso: recurso,
    };
  }
  const nPool = nivel==='facil' ? [100,200,400] : PORCENTAJE_BASES;
  const pPool = nivel==='dificil' ? [10,15,20,25,35,50,75] : PORCENTAJE_TASAS;
  const n = pick(nPool);
  const p = pick(pPool);
  const correct = Math.round(n*p/100);
  const spread = nivel==='dificil' ? Math.max(3,Math.round(correct*0.15)) : Math.max(5,Math.round(correct*0.3));
  const opts = uniqueDistractors(correct, 1, n, spread, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuánto es el '+p+'% de '+n+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuánto es el '+p+' por ciento de '+n+'?', cols:4,
    explain: 'El '+p+'% de '+n+' es <b>'+correct+'</b>.', recurso: recurso,
  };
}

export function genFraccionesMixtas6Round(nivel){
  const recurso = 'Un <b>número mixto</b> combina un número entero con una fracción propia (como 2 y 1/3), mientras que una <b>fracción impropia</b> tiene el numerador mayor o igual que el denominador (como 7/3) — ambos representan exactamente la misma cantidad, solo escrita de forma distinta. Para convertir una fracción impropia a mixto, se divide el numerador por el denominador: el cociente es el entero y el resto queda como numerador de la fracción. Para sumar o restar fracciones que ya tienen el mismo denominador, solo se suman o restan los numeradores y el denominador se mantiene igual.';
  const denPoolChico = nivel==='facil' ? [3,4,5] : (nivel==='dificil' ? [6,7,8,9] : [3,4,5,6,7]);
  const roll = Math.random();
  if(roll<0.34){
    const den = pick(denPoolChico);
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
    const den = pick(denPoolChico);
    const w = randInt(1,3), r = randInt(1,den-1);
    const correct = den*w+r;
    const opts = uniqueDistractors(correct, 1, den*4, 2, 4).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+w+' Y '+r+'/'+den+'</p><p class="prompt-hint">¿A qué fracción impropia equivale este número mixto?</p>',
      options: opts, correctValue: correct+'/'+den, speakText: '¿A qué fracción impropia equivale '+w+' y '+r+'/'+den+'?', cols:2,
      explain: w+' y '+r+'/'+den+' equivale a <b>'+correct+'/'+den+'</b>.', recurso: recurso,
    };
  }
  const denPoolGrande = nivel==='facil' ? [10,12,14] : (nivel==='dificil' ? [16,18,20] : [10,12,14,15,16,18,20]);
  const den = pick(denPoolGrande);
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

export function genDecimales6Round(nivel){
  const recurso = 'Para <b>multiplicar un decimal por un número entero</b>, se multiplica como si no tuviera coma y luego se ubica la coma en el resultado con la misma cantidad de decimales que tenía el número original. Para <b>dividir</b>, se busca qué número decimal multiplicado por el divisor da el dividendo. Y al multiplicar un decimal por 10, 100 o 1000, la coma simplemente se corre hacia la derecha (un lugar por cada cero) — sin necesidad de multiplicar cifra por cifra.';
  const roll = Math.random();
  if(roll<0.34){
    const dec = randInt(11,89)/10;
    const nat = nivel==='facil' ? randInt(2,5) : (nivel==='dificil' ? randInt(6,12) : randInt(2,9));
    const correct = Math.round(dec*nat*10)/10;
    const opts = uniqueDistractors(Math.round(correct*10), 5, 900, 8, 4).map(function(v){ return {label:(v/10).toFixed(1), value:(v/10).toFixed(1)}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:28px;">'+dec.toFixed(1)+' × '+nat+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: correct.toFixed(1), speakText: '¿Cuánto es '+dec.toFixed(1)+' por '+nat+'?', cols:4,
      explain: dec.toFixed(1)+' × '+nat+' = <b>'+correct.toFixed(1)+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const divisor = nivel==='facil' ? randInt(2,5) : (nivel==='dificil' ? randInt(6,12) : randInt(2,9));
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
  const mult = pick([10,100,1000]);
  const correct = Math.round(dec*mult*100)/100;
  const opts = uniqueDistractors(Math.round(correct*100), 1, 99000, 40, 4).map(function(v){ return {label:(v/100).toFixed(2), value:(v/100).toFixed(2)}; });
  const hint = nivel==='dificil' ? '¿Cuánto es?' : '¿Cuánto es? (Pista: al multiplicar por '+mult+', la coma se corre hacia la derecha)';
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+dec.toFixed(2)+' × '+mult+'</p><p class="prompt-hint">'+hint+'</p>',
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
export function genPatronesEcuaciones6Round(nivel){
  const recurso = 'Una <b>tabla de valores</b> muestra pares de números (x, y) que siguen siempre la misma regla — encontrarla es descubrir qué operación convierte cada x en su y correspondiente. Una <b>expresión algebraica</b> traduce una frase en palabras a símbolos matemáticos usando una letra (como n) para representar "un número cualquiera" — por ejemplo, "el doble de un número más 5" se escribe 2n + 5. Y para resolver una <b>ecuación</b> de un paso, se usan operaciones inversas: si algo se sumó, se resta; si algo se multiplicó, se divide — hasta dejar la letra sola en un lado.';
  const roll = Math.random();
  if(roll<0.34){
    const m = nivel==='facil' ? randInt(2,3) : (nivel==='dificil' ? randInt(4,8) : randInt(2,5));
    const b = randInt(0,5);
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
    const distractCount = nivel==='facil' ? 1 : 3;
    const distract = shuffle(FRASE_EXPRESION_BANK.filter(function(f){ return f.expresion!==item.expresion; })).slice(0,distractCount).map(function(f){ return f.expresion; });
    const opts = shuffle([item.expresion].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<p class="prompt-sentence">"'+item.frase+'"</p><p class="prompt-hint">¿Qué expresión algebraica representa esta frase? (n = el número)</p>',
      options: opts, correctValue: item.expresion, speakText: item.frase, cols:2,
      explain: '"'+item.frase+'" se escribe como <b>'+item.expresion+'</b>.', recurso: recurso,
    };
  }
  const x = randInt(1,20);
  const coef = nivel==='facil' ? randInt(2,3) : (nivel==='dificil' ? randInt(6,12) : randInt(2,6));
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
export function genTriangulosTeselados6Round(nivel){
  const recurso = 'Los triángulos se clasifican según sus lados: <b>equilátero</b> (los 3 lados iguales), <b>isósceles</b> (exactamente 2 lados iguales) y <b>escaleno</b> (los 3 lados distintos). Un <b>teselado</b> (o mosaico) es un patrón que cubre una superficie repitiendo una figura sin dejar espacios ni superponerse, y esa repetición se logra con transformaciones geométricas: <b>traslación</b> (deslizar la figura), <b>reflexión</b> (voltearla como en un espejo) o <b>rotación</b> (girarla alrededor de un punto).';
  if(Math.random()<0.5){
    const t = TRIANGULO_LADOS_BANK_GEN();
    const distractAll = shuffle(['Equilátero','Isósceles','Escaleno'].filter(function(x){ return x!==t.tipo; }));
    const distract = nivel==='facil' ? distractAll.slice(0,1) : distractAll;
    const opts = shuffle([t.tipo].concat(distract)).map(function(x){ return {label:x, value:x}; });
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo tiene lados de '+t.a+', '+t.b+' y '+t.c+' unidades. ¿Qué tipo de triángulo es, según sus lados?</p>',
      options: opts, correctValue: t.tipo, speakText: '¿Qué tipo de triángulo es según sus lados?', cols:4, kind:'word',
      explain: t.tipo==='Equilátero' ? 'Los 3 lados son iguales, así que es <b>equilátero</b>.' : t.tipo==='Isósceles' ? 'Exactamente 2 lados son iguales, así que es <b>isósceles</b>.' : 'Los 3 lados son distintos, así que es <b>escaleno</b>.', recurso: recurso,
    };
  }
  const item = pick(TESELADO_TRANSFORMACIONES_BANK);
  const todosT = ['Traslación','Reflexión','Rotación'];
  const distractAllT = todosT.filter(function(t){ return t!==item.tipo; });
  const distract = nivel==='facil' ? distractAllT.slice(0,1) : distractAllT;
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
export function genAngulos6Round(nivel){
  const recurso = 'Los ángulos se clasifican según su medida: <b>agudo</b> (menos de 90°), <b>recto</b> (exactamente 90°), <b>obtuso</b> (entre 90° y 180°), <b>extendido</b> (180°, una línea recta) y <b>completo</b> (360°, una vuelta entera). Dos ángulos son <b>complementarios</b> si suman 90°, y sus versiones opuestas por el vértice (cuando se cruzan dos rectas) o correspondientes (entre paralelas cortadas por una transversal) siempre miden lo mismo. Además, los ángulos interiores de un triángulo siempre suman 180°, y los de un cuadrilátero siempre suman 360° — reglas fijas que permiten calcular un ángulo desconocido sin necesidad de medirlo.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(ANGULO_GRADOS_BANK);
    const todos = ['Agudo','Recto','Obtuso','Extendido','Completo'];
    const distractCount = nivel==='facil' ? 1 : 3;
    const distract = shuffle(todos.filter(function(t){ return t!==item.tipo; })).slice(0,distractCount);
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
    const spread = nivel==='dificil' ? 2 : (nivel==='facil' ? 10 : 5);
    const opts = uniqueDistractors(correct, 1, 89, spread, 4).map(function(v){ return {label:v+'°', value:v}; });
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

export function genAreaVolumen6Round(nivel){
  const recurso = 'La <b>superficie</b> de un cuerpo 3D es la suma del área de todas sus caras: en un cubo, las 6 caras son cuadrados iguales (6 × lado × lado); en un paralelepípedo, hay 3 pares de caras rectangulares distintas. El <b>volumen</b> mide cuánto espacio ocupa el cuerpo por dentro: en el cubo es lado × lado × lado, y en el paralelepípedo es largo × ancho × alto. Área y volumen se confunden fácilmente porque ambos usan las mismas medidas, pero el área se mide en unidades cuadradas (cm²) y el volumen en unidades cúbicas (cm³).';
  const roll = Math.random();
  if(roll<0.25){
    const l = nivel==='facil' ? randInt(2,5) : (nivel==='dificil' ? randInt(6,12) : randInt(2,9));
    const area = 6*l*l;
    const opts = uniqueDistractors(area, 6, 900, 20, 4).map(function(v){ return {label:v+' cm²', value:v}; });
    const visual = nivel==='dificil' ? '' : '<div class="shape-display">'+solid3DSVG('cubo',110)+'</div>';
    return {
      promptHTML: visual+'<p class="prompt-hint">Un cubo tiene lado '+l+' cm. ¿Cuál es el área total de su superficie (sus 6 caras)?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área de la superficie del cubo?', cols:2,
      explain: 'Área = 6 × lado × lado = 6 × '+l+' × '+l+' = <b>'+area+' cm²</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const l = randInt(2,8), w = randInt(2,7), h = randInt(2,6);
    const area = 2*(l*w+l*h+w*h);
    const opts = uniqueDistractors(area, 8, 700, 20, 4).map(function(v){ return {label:v+' cm²', value:v}; });
    const visual = nivel==='dificil' ? '' : '<div class="shape-display">'+solid3DSVG('paralelepipedo',110)+'</div>';
    return {
      promptHTML: visual+'<p class="prompt-hint">Un paralelepípedo mide '+l+' cm de largo, '+w+' cm de ancho y '+h+' cm de alto. ¿Cuál es el área total de su superficie?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área de la superficie del paralelepípedo?', cols:2,
      explain: 'Área = 2 × (largo×ancho + largo×alto + ancho×alto) = 2 × ('+(l*w)+' + '+(l*h)+' + '+(w*h)+') = <b>'+area+' cm²</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const l = nivel==='facil' ? randInt(2,4) : (nivel==='dificil' ? randInt(5,10) : randInt(2,7));
    const vol = l*l*l;
    const opts = uniqueDistractors(vol, 8, 1200, 15, 4).map(function(v){ return {label:v+' cm³', value:v}; });
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
export function genDatos6Round(nivel){
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

export function genExamenMate6Round(){
  const gens = [genMultiplosFactores6Round, genOperatoria6Round, genRazonesPorcentajes6Round, genFraccionesMixtas6Round, genDecimales6Round, genPatronesEcuaciones6Round, genTriangulosTeselados6Round, genAngulos6Round, genAreaVolumen6Round, genDatos6Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/1-medio — OA01-15.
   Cubiertos: OA01-02 (racionales y potencias), OA03 (productos notables), OA04
   (sistemas de ecuaciones), OA05 (funciones lineales), OA06-07 (sector circular
   y cono), OA08-09,11 (homotecia, Tales, vectorial), OA10 (semejanza y escala,
   fusionado con homotecia/Tales por ser el mismo bloque conceptual), OA12-13
   (tablas de doble entrada y nube de puntos) y OA14-15 (reglas de probabilidad,
   azar) fusionados en un solo módulo de Estadística y Probabilidad. */
export const MATE_MODULES_M1 = [
  {id:'numerospotenciasm1', label:'Números Racionales y Potencias', open:true, key:'numerospotenciasm1'},
  {id:'productosnotablesm1', label:'Productos Notables', open:true, key:'productosnotablesm1'},
  {id:'sistemasecuacionesm1', label:'Sistemas de Ecuaciones', open:true, key:'sistemasecuacionesm1'},
  {id:'funcioneslinealesm1', label:'Funciones Lineales', open:true, key:'funcioneslinealesm1'},
  {id:'geometriam1', label:'Sector Circular y Cono', open:true, key:'geometriam1'},
  {id:'homoteciatalesm1', label:'Homotecia, Tales y Semejanza', open:true, key:'homoteciatalesm1'},
  {id:'estadisticaprobabilidadm1', label:'Estadística y Probabilidad', open:true, key:'estadisticaprobabilidadm1'},
];
export const MATE_POS_M1 = [
  {x:24,y:92},{x:68,y:80},{x:24,y:68},{x:68,y:56},{x:24,y:44},{x:68,y:32},{x:24,y:20}
];
function gcdM1(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ const t=b; b=a%b; a=t; } return a||1; }

export function genNumerosPotenciasM1Round(){
  const recurso = 'Los <b>números racionales</b> son todos los que se pueden escribir como una fracción (incluyendo los enteros y los decimales exactos): al sumar o restar fracciones con distinto denominador, primero hay que buscar un denominador común (por ejemplo, multiplicando los dos denominadores) para poder combinar los numeradores. Una <b>potencia de base racional y exponente entero</b> sigue reglas precisas: si el exponente es positivo, se multiplica la base por sí misma esa cantidad de veces; si es 0, el resultado siempre es 1; y si es negativo, equivale al recíproco (1 dividido) de la potencia con exponente positivo — por ejemplo, 2⁻³ = 1/2³ = 1/8. Estas reglas permiten transformar multiplicaciones y divisiones de potencias sin tener que calcular números enormes.';
  if(Math.random()<0.5){
    const pares = [[2,3],[2,5],[3,4],[3,5],[4,5],[5,6],[2,7],[3,7]];
    const par = pick(pares);
    const d1 = par[0], d2 = par[1];
    const n1 = randInt(1,d1-1), n2 = randInt(1,d2-1);
    const commonDen = d1*d2;
    const numSum = n1*d2 + n2*d1;
    const g = gcdM1(numSum, commonDen);
    const rn = numSum/g, rd = commonDen/g;
    const correct = rd===1 ? String(rn) : rn+'/'+rd;
    const cand = new Set();
    if(g>1) cand.add(numSum+'/'+commonDen);
    const restaNum = Math.abs(n1*d2 - n2*d1);
    const gr = gcdM1(restaNum||1, commonDen);
    cand.add((restaNum/gr)+'/'+(commonDen/gr));
    cand.add((n1+n2)+'/'+(d1+d2));
    cand.add((numSum+1)+'/'+commonDen);
    const finales = shuffle([...cand].filter(function(v){ return v!==correct; })).slice(0,3);
    while(finales.length<3){ finales.push((numSum+finales.length+2)+'/'+commonDen); }
    const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-word">'+n1+'/'+d1+' + '+n2+'/'+d2+'</p><p class="prompt-hint">¿Cuánto da esta suma de fracciones?</p>',
      options: opts, correctValue: correct, speakText: n1+' '+d1+'avos más '+n2+' '+d2+'avos, ¿cuánto es?', cols:4,
      explain: 'Con denominador común '+commonDen+': ('+n1+'×'+d2+' + '+n2+'×'+d1+')/'+commonDen+' = '+numSum+'/'+commonDen+' = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  function potStr(b,e){ if(e===0) return '1'; if(e>0) return String(Math.pow(b,e)); return '1/'+Math.pow(b,-e); }
  const base = pick([2,3,4,5,10]);
  const exp = pick([-3,-2,-1,0,1,2,3]);
  const correct = potStr(base,exp);
  const pool = [-3,-2,-1,0,1,2,3,4].filter(function(e){ return e!==exp; }).map(function(e){ return potStr(base,e); });
  const finales = shuffle([...new Set(pool)].filter(function(v){ return v!==correct; })).slice(0,3);
  const opts = shuffle([correct].concat(finales)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-word">'+base+'<sup>'+exp+'</sup></p><p class="prompt-hint">¿Cuánto vale '+base+' elevado a '+exp+'?</p>',
    options: opts, correctValue: correct, speakText: base+' elevado a '+exp+', ¿cuánto vale?', cols:4,
    explain: exp===0 ? 'Cualquier número (distinto de 0) elevado a 0 es <b>1</b>.' : (exp>0 ? base+' multiplicado por sí mismo '+exp+' veces da <b>'+correct+'</b>.' : 'Exponente negativo = recíproco: '+base+(-exp)+' = '+potStr(base,-exp)+', y su recíproco es <b>'+correct+'</b>.'),
    recurso: recurso,
  };
}

export function genProductosNotablesM1Round(){
  const recurso = 'Los <b>productos notables</b> son multiplicaciones algebraicas que siguen un patrón fijo, así que se pueden resolver directamente sin multiplicar término por término. El más común es el <b>cuadrado de binomio</b>: (a + b)² = a² + 2ab + b² (el cuadrado del primer término, más el doble producto de ambos, más el cuadrado del segundo). Si el binomio es una resta, (a − b)² = a² − 2ab + b². Otro patrón es la <b>suma por su diferencia</b>: (a + b)(a − b) = a² − b² (el cuadrado del primero menos el cuadrado del segundo, sin término del medio). Reconocer estos patrones ahorra tiempo y es la base para "completar el cuadrado" y factorizar expresiones algebraicas más adelante.';
  const roll = Math.random();
  const a = randInt(2,7), b = randInt(1,6);
  if(roll<0.4){
    const correct = (a*a)+' + '+(2*a*b)+'x + '+(b*b)+'x²';
    const opts = shuffle([
      {label:correct, value:'ok'},
      {label:(a*a)+' + '+(a*b)+'x + '+(b*b)+'x²', value:'m1'},
      {label:(a*a)+' + '+(2*a*b)+'x − '+(b*b)+'x²', value:'m2'},
      {label:(a*a)+' + '+(b*b)+'x²', value:'m3'},
    ]);
    return {
      promptHTML: '<p class="prompt-word">('+a+' + '+b+'x)²</p><p class="prompt-hint">¿Cuál es el resultado de este cuadrado de binomio?</p>',
      options: opts, correctValue: 'ok', speakText: 'El cuadrado de '+a+' más '+b+' equis, ¿cuál es su desarrollo?', cols:2, panel:true,
      explain: '(a+b)² = a² + 2ab + b²: '+a+'² + 2×'+a+'×'+b+'x + '+b+'²x² = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const correct = (a*a)+' − '+(2*a*b)+'x + '+(b*b)+'x²';
    const opts = shuffle([
      {label:correct, value:'ok'},
      {label:(a*a)+' + '+(2*a*b)+'x + '+(b*b)+'x²', value:'m1'},
      {label:(a*a)+' − '+(b*b)+'x²', value:'m2'},
      {label:(a*a)+' − '+(a*b)+'x + '+(b*b)+'x²', value:'m3'},
    ]);
    return {
      promptHTML: '<p class="prompt-word">('+a+' − '+b+'x)²</p><p class="prompt-hint">¿Cuál es el resultado de este cuadrado de binomio?</p>',
      options: opts, correctValue: 'ok', speakText: 'El cuadrado de '+a+' menos '+b+' equis, ¿cuál es su desarrollo?', cols:2, panel:true,
      explain: '(a−b)² = a² − 2ab + b²: '+a+'² − 2×'+a+'×'+b+'x + '+b+'²x² = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const correct = (a*a)+' − '+(b*b)+'x²';
  const opts = shuffle([
    {label:correct, value:'ok'},
    {label:(a*a)+' + '+(b*b)+'x²', value:'m1'},
    {label:(a*a)+' − '+(2*a*b)+'x − '+(b*b)+'x²', value:'m2'},
    {label:(a*a)+' + '+(2*a*b)+'x + '+(b*b)+'x²', value:'m3'},
  ]);
  return {
    promptHTML: '<p class="prompt-word">('+a+' + '+b+'x)('+a+' − '+b+'x)</p><p class="prompt-hint">¿Cuál es el resultado de esta suma por su diferencia?</p>',
    options: opts, correctValue: 'ok', speakText: a+' más '+b+' equis, por '+a+' menos '+b+' equis, ¿cuál es el resultado?', cols:2, panel:true,
    explain: 'Suma por su diferencia: a² − b² = '+a+'² − '+b+'²x² = <b>'+correct+'</b>, sin término del medio.',
    recurso: recurso,
  };
}

export function genSistemasEcuacionesM1Round(){
  const recurso = 'Un <b>sistema de ecuaciones lineales 2x2</b> son dos ecuaciones con las mismas dos incógnitas (x e y) que se cumplen al mismo tiempo. Para resolverlo, un método simple es la <b>reducción</b>: si se suman o restan las dos ecuaciones (multiplicándolas por un número si hace falta) de manera que una de las incógnitas se cancele, queda una sola ecuación con una sola incógnita, fácil de despejar. Una vez encontrado el valor de esa incógnita, se reemplaza en cualquiera de las ecuaciones originales para encontrar la otra. Estos sistemas sirven para resolver problemas de la vida diaria donde hay dos cantidades desconocidas relacionadas entre sí, como el precio de dos productos distintos comprados en cantidades diferentes.';
  const x = randInt(2,8), y = randInt(2,8);
  const a1 = randInt(1,4), b1 = randInt(1,4);
  const a2 = randInt(1,4), b2 = randInt(1,4);
  const c1 = a1*x + b1*y;
  const c2 = a2*x - b2*y;
  const opts = shuffle([
    {label:'x = '+x+', y = '+y, value:'ok'},
    {label:'x = '+y+', y = '+x, value:'m1'},
    {label:'x = '+(x+1)+', y = '+y, value:'m2'},
    {label:'x = '+x+', y = '+(y+1), value:'m3'},
  ]);
  return {
    promptHTML: '<p class="prompt-word">'+a1+'x + '+b1+'y = '+c1+'<br>'+a2+'x − '+b2+'y = '+c2+'</p><p class="prompt-hint">¿Cuál es la solución de este sistema de ecuaciones?</p>',
    options: opts, correctValue: 'ok', speakText: '¿Cuál es la solución del sistema de dos ecuaciones?', cols:2, panel:true,
    explain: 'Reemplazando x = '+x+' e y = '+y+' en ambas ecuaciones se cumplen las dos igualdades: <b>x = '+x+', y = '+y+'</b>.',
    recurso: recurso,
  };
}

export function genFuncionesLinealesM1Round(){
  const recurso = 'Una <b>relación lineal</b> entre dos variables (x e y) se puede escribir de la forma ax + by = c, y su gráfico siempre es una línea recta. Para graficarla, basta con encontrar al menos dos puntos (x, y) que cumplan la ecuación —dando valores a x y despejando y— y unirlos con una recta. La <b>pendiente</b> de esa recta indica qué tan inclinada está: mientras más grande, más empinada sube (o baja, si es negativa). Leer un gráfico lineal al revés también es útil: dado un punto marcado en la recta, se puede saber qué valores de x e y representa, y comprobar si cumple la ecuación original.';
  const a = randInt(1,4), b = randInt(1,3);
  const x = randInt(0,6);
  const y = a*x + b;
  const opts = shuffle([
    {label:'('+x+', '+y+')', value:'ok'},
    {label:'('+y+', '+x+')', value:'m1'},
    {label:'('+x+', '+(y+1)+')', value:'m2'},
    {label:'('+(x+1)+', '+y+')', value:'m3'},
  ]);
  return {
    promptHTML: '<p class="prompt-word">y = '+a+'x + '+b+'</p><p class="prompt-hint">¿Qué punto (x, y) pertenece a esta recta cuando x = '+x+'?</p>',
    options: opts, correctValue: 'ok', speakText: 'En la recta i griega igual a '+a+' equis más '+b+', ¿qué punto corresponde cuando equis vale '+x+'?', cols:4,
    explain: 'Reemplazando x = '+x+': y = '+a+'×'+x+' + '+b+' = <b>'+y+'</b>, entonces el punto es ('+x+', '+y+').',
    recurso: recurso,
  };
}

const ANGULOS_SECTOR = [60,90,120,180];
export function genGeometriaM1Round(){
  const recurso = 'El <b>sector circular</b> es la porción de un círculo delimitada por dos radios y el arco entre ellos (como una porción de pizza); su área es proporcional al ángulo central: se calcula como (ángulo/360°) × π × radio². El <b>cono</b> es un cuerpo geométrico con una base circular que se estrecha hasta un punto (el vértice); su volumen se calcula igual que el de un cilindro pero dividido en 3: (1/3) × π × radio² × altura, porque un cono cabe exactamente 3 veces dentro de un cilindro de la misma base y altura. Estas fórmulas se usan para calcular la cantidad de material necesario para fabricar objetos con esas formas, como conos de helado o gorros de fiesta.';
  if(Math.random()<0.5){
    const r = randInt(3,10);
    const angulo = pick(ANGULOS_SECTOR);
    const correct = Math.round((angulo/360)*Math.PI*r*r*10)/10;
    const distractCandidates = [Math.round(Math.PI*r*r*10)/10, Math.round((angulo/360)*2*Math.PI*r*10)/10, Math.round((angulo/180)*Math.PI*r*r*10)/10];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const c = Math.round((correct+randInt(1,5))*10)/10; if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v+' cm²', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un sector circular tiene radio '+r+' cm y ángulo central de '+angulo+'°. ¿Cuál es su área aproximada? (usa π ≈ 3,14)</p>',
      options: opts, correctValue: correct, speakText: 'Un sector circular de radio '+r+' centímetros y ángulo central de '+angulo+' grados, ¿cuál es su área?', cols:4,
      explain: 'Área = (ángulo/360°) × π × radio² = ('+angulo+'/360) × 3,14 × '+r+'² ≈ <b>'+correct+' cm²</b>.',
      recurso: recurso,
    };
  }
  const r = randInt(2,6), h = randInt(3,9);
  const correct = Math.round((1/3)*Math.PI*r*r*h*10)/10;
  const distractCandidates = [Math.round(Math.PI*r*r*h*10)/10, Math.round((1/2)*Math.PI*r*r*h*10)/10, Math.round((1/3)*Math.PI*r*h*10)/10];
  const finales = [];
  for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
  while(finales.length<3){ const c = Math.round((correct+randInt(2,8))*10)/10; if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
  const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v+' cm³', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un cono tiene radio '+r+' cm y altura '+h+' cm. ¿Cuál es su volumen aproximado? (usa π ≈ 3,14)</p>',
    options: opts, correctValue: correct, speakText: 'Un cono de radio '+r+' centímetros y altura '+h+' centímetros, ¿cuál es su volumen?', cols:4,
    explain: 'Volumen del cono = (1/3) × π × radio² × altura = (1/3) × 3,14 × '+r+'² × '+h+' ≈ <b>'+correct+' cm³</b>.',
    recurso: recurso,
  };
}

const HOMOTECIA_BANK = [
  { desc:'Una fotografía se amplía al doble de su tamaño manteniendo exactamente las mismas proporciones y forma', correcta:'Homotecia', opts:['Rotación','Reflexión','Traslación'] },
  { desc:'Una maqueta a escala 1:100 representa un edificio real, con todas sus medidas reducidas proporcionalmente', correcta:'Semejanza y escala', opts:['Congruencia','Simetría','Perímetro'] },
  { desc:'Dos triángulos tienen exactamente los mismos ángulos, pero uno mide el doble que el otro en todos sus lados', correcta:'Triángulos semejantes', opts:['Triángulos congruentes','Triángulos rectángulos','Triángulos irregulares'] },
  { desc:'Un rayo de luz pasa por el vértice de dos triángulos formados por líneas paralelas cortadas por dos transversales', correcta:'Teorema de Tales', opts:['Teorema de Pitágoras','Ley de los senos','Regla de tres inversa'] },
  { desc:'Un mapa indica "escala 1:50.000": cada centímetro dibujado equivale a 50.000 centímetros reales', correcta:'Escala', opts:['Homotecia negativa','Congruencia','Rotación'] },
  { desc:'Un dibujo técnico se reduce a la mitad de su tamaño desde un punto fijo llamado centro de homotecia', correcta:'Homotecia', opts:['Simetría axial','Traslación','Congruencia'] },
  { desc:'Dos rectángulos tienen sus lados correspondientes en la misma proporción (2:3), aunque de distinto tamaño', correcta:'Semejanza y escala', opts:['Congruencia','Perímetro igual','Área igual'] },
  { desc:'Una sombra proyectada por el sol permite calcular la altura de un árbol comparándola con la sombra de una persona de altura conocida', correcta:'Teorema de Tales', opts:['Teorema de Pitágoras','Homotecia inversa','Área de un triángulo'] },
  { desc:'Un vector se multiplica por un número (escalar) mayor que 1, agrandando su longitud sin cambiar su dirección', correcta:'Homotecia vectorial', opts:['Suma de vectores','Producto punto','Vector nulo'] },
  { desc:'Un plano de una casa a escala 1:75 mantiene la proporción exacta entre todas las habitaciones reales', correcta:'Escala', opts:['Homotecia negativa','Simetría central','Congruencia'] },
];
export function genHomoteciaTalesM1Round(){
  const recurso = 'La <b>homotecia</b> es una transformación que agranda o reduce una figura desde un punto fijo (el centro de homotecia), manteniendo siempre la misma forma y las mismas proporciones — es la base de por qué una fotografía ampliada o un dibujo técnico reducido no se ven "deformados". El <b>Teorema de Tales</b> usa esta misma idea de proporcionalidad: cuando rectas paralelas cortan dos transversales, los segmentos que se forman quedan en la misma proporción, lo que permite calcular medidas indirectas (como la altura de un árbol usando su sombra). La <b>semejanza y la escala</b> aplican el mismo concepto a mapas, planos y maquetas: todas las medidas se reducen o amplían por el mismo factor, así que la forma se conserva aunque el tamaño cambie. Vectorialmente, la homotecia equivale a multiplicar un vector por un número (escalar): si el escalar es mayor que 1, el vector se alarga; si es menor que 1, se acorta.';
  const item = pick(HOMOTECIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué concepto geométrico describe mejor esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'Esto describe: <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genEstadisticaProbabilidadM1Round(){
  const recurso = 'Para comparar dos poblaciones según dos características distintas (por ejemplo, edad y estatura), se puede usar una <b>tabla de doble entrada</b> (que cruza ambas variables) o una <b>nube de puntos</b> (un gráfico donde cada punto representa un caso, ubicado según sus dos valores) — esto permite ver de un vistazo si existe alguna relación entre las dos variables. En probabilidad, la <b>regla aditiva</b> se usa para eventos que no pueden ocurrir al mismo tiempo (se suman sus probabilidades individuales), y la <b>regla multiplicativa</b> se usa para eventos independientes que ocurren uno después del otro (se multiplican sus probabilidades). Combinando ambas reglas se pueden calcular probabilidades de situaciones más complejas, como sacar una carta roja O un as, o sacar dos veces seguidas el mismo resultado en un dado.';
  const roll = Math.random();
  if(roll<0.35){
    const total = pick([20,24,30,36,40]);
    const favorablesA = randInt(4,Math.floor(total/3));
    const favorablesB = randInt(2,Math.floor(total/4));
    const correct = Math.round(((favorablesA+favorablesB)/total)*100)/100;
    const distractCandidates = [Math.round((favorablesA/total)*favorablesB/total*100)/100, Math.round((favorablesA/total)*100)/100, Math.round(((favorablesA+favorablesB)/(total*2))*100)/100];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const c = Math.round((correct+randInt(1,3)*0.05)*100)/100; if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">En una bolsa con '+total+' fichas, '+favorablesA+' son rojas y '+favorablesB+' son azules (el resto son de otro color). Si estos dos eventos no pueden ocurrir juntos, ¿cuál es la probabilidad de sacar una ficha roja O azul?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuál es la probabilidad de sacar una ficha roja o azul, si son eventos que no pueden ocurrir juntos?', cols:4,
      explain: 'Regla aditiva (eventos que no pueden ocurrir juntos): P(roja) + P(azul) = '+favorablesA+'/'+total+' + '+favorablesB+'/'+total+' = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const pA = pick([0.5,0.25,0.2,0.1]);
    const pB = pick([0.5,0.25,0.2,0.1]);
    const correct = Math.round(pA*pB*1000)/1000;
    const distractCandidates = [Math.round((pA+pB)*1000)/1000, pA, pB];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const c = Math.round((correct+randInt(1,3)*0.02)*1000)/1000; if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">La probabilidad de que ocurra un evento A es '+pA+' y la de un evento B (independiente) es '+pB+'. ¿Cuál es la probabilidad de que ocurran los DOS eventos, uno después del otro?</p>',
      options: opts, correctValue: correct, speakText: 'Si dos eventos independientes tienen probabilidades '+pA+' y '+pB+', ¿cuál es la probabilidad de que ocurran los dos?', cols:4,
      explain: 'Regla multiplicativa (eventos independientes): P(A) × P(B) = '+pA+' × '+pB+' = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const opts = shuffle([
    {label:'Una tabla de doble entrada o una nube de puntos', value:'ok'},
    {label:'Solo un gráfico de barras simple', value:'m1'},
    {label:'Solo un promedio general', value:'m2'},
    {label:'Un diagrama circular únicamente', value:'m3'},
  ]);
  return {
    promptHTML: '<p class="prompt-hint">¿Qué herramienta sirve para registrar y comparar dos características distintas de una misma población de datos?</p>',
    options: opts, correctValue: 'ok', speakText: '¿Qué herramienta sirve para comparar dos características distintas de los mismos datos?', cols:2, panel:true,
    explain: 'Una tabla de doble entrada organiza los datos cruzando dos variables, y una nube de puntos los grafica para ver si existe relación entre ellas.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/matematica/2-medio — OA01-12.
   Cubiertos: OA01 (números reales, raíces), OA02 (potencias/raíces/logaritmos),
   OA03-04 (función cuadrática, fusionados: comprensión + resolución de ecuaciones),
   OA05 (función inversa), OA06 (interés compuesto/crecimiento porcentual constante),
   OA07 (área y volumen de la esfera), OA08-09 (razones trigonométricas + vectores,
   fusionados por ser el mismo bloque conceptual de triángulo rectángulo), y
   OA10-12 (variables aleatorias, combinatoria y el rol social de la probabilidad,
   fusionados en un solo módulo de Estadística y Probabilidad, mismo criterio que
   el módulo homónimo de 1° medio). Ningún OA de Matemática 2° medio queda fuera. */
export const MATE_MODULES_M2 = [
  {id:'numerosrealesm2', label:'Números Reales y Raíces', open:true, key:'numerosrealesm2'},
  {id:'potenciaslogaritmosm2', label:'Potencias, Raíces y Logaritmos', open:true, key:'potenciaslogaritmosm2'},
  {id:'funcioncuadraticam2', label:'Función Cuadrática', open:true, key:'funcioncuadraticam2'},
  {id:'funcioninversam2', label:'Función Inversa', open:true, key:'funcioninversam2'},
  {id:'interescompuestom2', label:'Interés Compuesto', open:true, key:'interescompuestom2'},
  {id:'esferam2', label:'Área y Volumen de la Esfera', open:true, key:'esferam2'},
  {id:'trigonometriam2', label:'Trigonometría y Vectores', open:true, key:'trigonometriam2'},
  {id:'estadisticaprobabilidadm2', label:'Variables Aleatorias y Probabilidad', open:true, key:'estadisticaprobabilidadm2'},
];
export const MATE_POS_M2 = [
  {x:24,y:92},{x:68,y:80},{x:24,y:68},{x:68,y:56},{x:24,y:44},{x:68,y:32},{x:24,y:20},{x:68,y:8}
];

export function genNumerosRealesM2Round(){
  const recurso = 'Los <b>números reales</b> incluyen tanto a los racionales (fracciones, enteros, decimales exactos) como a los <b>irracionales</b> (números como √2 o π, que no se pueden escribir como fracción exacta). Al <b>combinar raíces con números racionales</b>, se puede sumar o restar raíces del mismo radicando igual que términos semejantes: por ejemplo, 3√5 + 2√5 = 5√5 (se suman los coeficientes, la raíz queda igual), pero 3√5 + 2√3 NO se puede simplificar porque los radicandos son distintos. Para <b>estimar</b> el valor de una raíz no exacta, conviene ubicarla entre las raíces exactas más cercanas: por ejemplo, √50 está entre √49=7 y √64=8, así que √50 es un número entre 7 y 8.';
  const roll = Math.random();
  if(roll<0.5){
    const radicandos = [2,3,5,6,7];
    const b = pick(radicandos);
    const c1 = randInt(2,6), c2 = randInt(2,6);
    const suma = c1+c2;
    const correct = suma+'√'+b;
    const distractCandidates = [(suma+1)+'√'+b, (suma-1)+'√'+b, c1+'√'+(b+1)];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const c = (suma+randInt(2,4))+'√'+b; if(c!==correct && finales.indexOf(c)===-1) finales.push(c); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuánto es '+c1+'√'+b+' + '+c2+'√'+b+'?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuánto es '+c1+' raíz de '+b+' más '+c2+' raíz de '+b+'?', cols:4,
      explain: 'Como las dos raíces tienen el mismo radicando ('+b+'), se suman los coeficientes: '+c1+'+'+c2+' = <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const n = pick([50,20,45,75,90,10]);
  let low = 1;
  while((low+1)*(low+1) <= n) low++;
  const high = low+1;
  const correct = low+' y '+high;
  const distractCandidates = [(low-1)+' y '+low, high+' y '+(high+1), low+' y '+(high+1)];
  const finales = [];
  for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
  const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Entre qué dos números enteros consecutivos se encuentra √'+n+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Entre qué dos números enteros consecutivos se encuentra la raíz de '+n+'?', cols:4,
    explain: low+'² = '+(low*low)+' y '+high+'² = '+(high*high)+', y como '+(low*low)+' < '+n+' < '+(high*high)+', la raíz de '+n+' está entre <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genPotenciasLogaritmosM2Round(){
  const recurso = 'Una <b>potencia</b>, una <b>raíz</b> y un <b>logaritmo</b> expresan la misma relación entre tres números, solo que despejando uno distinto cada vez: si 2³ = 8, entonces la raíz cúbica de 8 es 2, y el logaritmo en base 2 de 8 es 3 (log₂8 = 3, que se lee "¿a qué exponente hay que elevar 2 para obtener 8?"). En general, si <b>a</b> elevado a <b>b</b> es igual a <b>c</b> (aᵇ=c), entonces log_a(c) = b. Esta equivalencia permite pasar de una forma a otra según lo que sea más fácil de calcular en cada problema — los logaritmos son especialmente útiles para "deshacer" exponentes muy grandes.';
  const casos = [[2,3,8],[2,4,16],[2,5,32],[3,2,9],[3,3,27],[3,4,81],[5,2,25],[4,2,16],[10,2,100],[10,3,1000]];
  const caso = pick(casos);
  const base = caso[0], exp = caso[1], resultado = caso[2];
  const roll = Math.random();
  if(roll<0.5){
    const correct = 'log<sub>'+base+'</sub>('+resultado+') = '+exp;
    const distractCandidates = ['log<sub>'+base+'</sub>('+resultado+') = '+(exp+1), 'log<sub>'+exp+'</sub>('+resultado+') = '+base, 'log<sub>'+resultado+'</sub>('+base+') = '+exp];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Si '+base+'<sup>'+exp+'</sup> = '+resultado+', ¿cuál es la forma logarítmica equivalente?</p>',
      options: opts, correctValue: correct, speakText: 'Si '+base+' elevado a '+exp+' es '+resultado+', ¿cuál es la forma logarítmica equivalente?', cols:2, panel:true,
      explain: 'Como '+base+'<sup>'+exp+'</sup> = '+resultado+', entonces <b>'+correct+'</b> (el logaritmo "despeja" el exponente).',
      recurso: recurso,
    };
  }
  const distractCandidates = [exp+1, exp-1, base];
  const finales = [];
  for(const d of distractCandidates){ if(d>0 && d!==exp && finales.indexOf(d)===-1) finales.push(d); }
  while(finales.length<3){ const c = exp+randInt(2,4); if(c!==exp && finales.indexOf(c)===-1) finales.push(c); }
  const opts = shuffle([exp].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuánto es log<sub>'+base+'</sub>('+resultado+')?</p>',
    options: opts, correctValue: exp, speakText: '¿Cuánto es el logaritmo en base '+base+' de '+resultado+'?', cols:4,
    explain: 'log<sub>'+base+'</sub>('+resultado+') pregunta "¿a qué exponente hay que elevar '+base+' para obtener '+resultado+'?" — como '+base+'<sup>'+exp+'</sup>='+resultado+', la respuesta es <b>'+exp+'</b>.',
    recurso: recurso,
  };
}

export function genFuncionCuadraticaM2Round(){
  const recurso = 'Una <b>función cuadrática</b> tiene la forma f(x) = ax² + bx + c (con a distinto de 0), y su gráfico es siempre una <b>parábola</b>. El <b>vértice</b> de la parábola (su punto más alto o más bajo) tiene coordenada x = -b/(2a). Para <b>resolver una ecuación cuadrática</b> (encontrar los valores de x donde f(x)=0), una forma útil es factorizarla como (x-r1)(x-r2) = 0, donde r1 y r2 son las dos soluciones — esto funciona porque un producto es cero solo si alguno de sus factores es cero. También se puede usar la fórmula general, pero factorizar es más rápido cuando las soluciones son números enteros simples.';
  const roll = Math.random();
  if(roll<0.5){
    const r1 = randInt(-6,6) || 1, r2 = randInt(-6,6) || 2;
    const b = -(r1+r2), c = r1*r2;
    const bStr = b===0 ? '' : (b>0 ? ' + '+b+'x' : ' - '+Math.abs(b)+'x');
    const cStr = c===0 ? '' : (c>0 ? ' + '+c : ' - '+Math.abs(c));
    const correct = 'x = '+r1+' o x = '+r2;
    const distractCandidates = ['x = '+(r1+1)+' o x = '+r2, 'x = '+r1+' o x = '+(r2+1), 'x = '+(-r1)+' o x = '+(-r2)];
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuáles son las soluciones de la ecuación x²'+bStr+cStr+' = 0, si se puede factorizar como (x-('+r1+'))(x-('+r2+')) = 0?</p>',
      options: opts, correctValue: correct, speakText: '¿Cuáles son las soluciones de esta ecuación cuadrática factorizada?', cols:2, panel:true,
      explain: 'Si (x-('+r1+'))(x-('+r2+')) = 0, entonces alguno de los dos factores debe ser cero: <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  const a = pick([1,2,3]);
  const b = randInt(-8,8);
  const c = randInt(-10,10);
  const xVal = randInt(-4,4);
  const fx = a*xVal*xVal + b*xVal + c;
  const distractCandidates = [fx+2, fx-2, a*xVal+b*xVal+c];
  const finales = [];
  for(const d of distractCandidates){ if(d!==fx && finales.indexOf(d)===-1) finales.push(d); }
  while(finales.length<3){ const d = fx+randInt(2,5); if(d!==fx && finales.indexOf(d)===-1) finales.push(d); }
  const opts = shuffle([fx].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  const bStr = b>=0 ? ' + '+b+'x' : ' - '+Math.abs(b)+'x';
  const cStr = c>=0 ? ' + '+c : ' - '+Math.abs(c);
  return {
    promptHTML: '<p class="prompt-hint">Si f(x) = '+a+'x²'+bStr+cStr+', ¿cuánto es f('+xVal+')?</p>',
    options: opts, correctValue: fx, speakText: 'Si f de x es '+a+' equis al cuadrado más '+b+' equis más '+c+', ¿cuánto es f de '+xVal+'?', cols:4,
    explain: 'f('+xVal+') = '+a+'×('+xVal+')² '+bStr+cStr+' = <b>'+fx+'</b>.',
    recurso: recurso,
  };
}

export function genFuncionInversaM2Round(){
  const recurso = 'La <b>función inversa</b> de f(x), escrita f⁻¹(x), "deshace" lo que hace la función original: si f transforma un valor de entrada en una salida, f⁻¹ transforma esa salida de vuelta al valor de entrada original. Para encontrar la inversa de una función lineal f(x) = ax + b, se despeja x en términos de y: si y = ax + b, entonces x = (y-b)/a, así que f⁻¹(x) = (x-b)/a. Una forma de verificar que dos funciones son inversas entre sí es comprobar que f(f⁻¹(x)) = x para cualquier valor de x — es como aplicar una operación y luego su operación contraria, volviendo al punto de partida.';
  const a = pick([2,3,4,5,-2,-3]);
  const b = randInt(-6,6);
  const bStr = b>=0 ? ' + '+b : ' - '+Math.abs(b);
  const invBStr = b===0 ? '' : (b>0 ? ' - '+b : ' + '+Math.abs(b));
  const correct = 'f⁻¹(x) = (x'+invBStr+') / '+a;
  const distractCandidates = ['f⁻¹(x) = (x'+bStr+') / '+a, 'f⁻¹(x) = '+a+'x'+bStr, 'f⁻¹(x) = (x'+invBStr+') × '+a];
  const finales = [];
  for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
  const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Si f(x) = '+a+'x'+bStr+', ¿cuál es su función inversa f⁻¹(x)?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál es la función inversa de f de x igual '+a+' equis'+bStr+'?', cols:2, panel:true,
    explain: 'Si y = '+a+'x'+bStr+', despejando x se obtiene x = (y'+invBStr+')/'+a+', así que <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genInteresCompuestoM2Round(){
  const recurso = 'Un <b>crecimiento porcentual constante</b> (como el interés compuesto) significa que, en cada período, la cantidad aumenta un mismo porcentaje sobre el valor YA acumulado (no sobre el valor original) — por eso crece cada vez más rápido con el tiempo. La fórmula es: valor final = valor inicial × (1 + tasa)^(número de períodos), donde la tasa se expresa como decimal (por ejemplo, 10% = 0,1). Esto es distinto del <b>interés simple</b>, donde el porcentaje siempre se calcula sobre el monto original, generando un crecimiento más lento (una línea recta en vez de una curva).';
  const inicial = pick([1000,2000,5000,10000,100000,200000]);
  const tasaPct = pick([5,10,20,25]);
  const periodos = pick([2,3]);
  const tasa = tasaPct/100;
  let valor = inicial;
  for(let i=0;i<periodos;i++){ valor = Math.round(valor*(1+tasa)); }
  const simpleValor = Math.round(inicial*(1+tasa*periodos));
  const distractCandidates = [simpleValor, Math.round(inicial*(1+tasa)), valor+Math.round(inicial*0.02)];
  const finales = [];
  for(const d of distractCandidates){ if(d!==valor && finales.indexOf(d)===-1) finales.push(d); }
  while(finales.length<3){ const d = valor+randInt(50,300); if(d!==valor && finales.indexOf(d)===-1) finales.push(d); }
  const opts = shuffle([valor].concat(finales.slice(0,3))).map(function(v){ return {label:'$'+v.toLocaleString('es-CL'), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Si inviertes $'+inicial.toLocaleString('es-CL')+' a un interés compuesto del '+tasaPct+'% anual, ¿cuánto tendrás después de '+periodos+' años?</p>',
    options: opts, correctValue: valor, speakText: 'Si inviertes '+inicial+' pesos a un interés compuesto del '+tasaPct+' por ciento anual, ¿cuánto tendrás después de '+periodos+' años?', cols:4,
    explain: 'Cada año se multiplica por (1 + '+tasa+'): '+inicial.toLocaleString('es-CL')+' → '+(periodos===2?'':'...→')+' <b>$'+valor.toLocaleString('es-CL')+'</b> (el interés se calcula sobre el monto ya acumulado, no sobre el inicial).',
    recurso: recurso,
  };
}

export function genEsferaM2Round(){
  const recurso = 'Una <b>esfera</b> es el conjunto de todos los puntos que están a la misma distancia (el radio) de un punto central. Su <b>área de superficie</b> se calcula con la fórmula 4πr² (cuatro veces pi por el radio al cuadrado), y su <b>volumen</b> con la fórmula (4/3)πr³ (cuatro tercios de pi por el radio al cubo). Ambas fórmulas dependen solo del radio: si el radio se duplica, el área se multiplica por 4 (porque depende de r²) pero el volumen se multiplica por 8 (porque depende de r³) — el volumen crece mucho más rápido que la superficie a medida que la esfera se agranda.';
  const r = pick([2,3,4,5,6]);
  const roll = Math.random();
  if(roll<0.5){
    const area = 4*r*r;
    const distractCandidates = [2*r*r, r*r, 4*r];
    const finales = [];
    for(const d of distractCandidates){ if(d!==area && finales.indexOf(d)===-1) finales.push(d); }
    const opts = shuffle([area].concat(finales.slice(0,3))).map(function(v){ return {label:v+'π cm²', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál es el área de superficie de una esfera de radio '+r+' cm? (deja el resultado en términos de π)</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área de superficie de una esfera de radio '+r+' centímetros, en términos de pi?', cols:4,
      explain: 'Área = 4πr² = 4π×'+r+'² = 4π×'+(r*r)+' = <b>'+area+'π cm²</b>.',
      recurso: recurso,
    };
  }
  const volNum = 4*r*r*r;
  const volLabel = (volNum%3===0) ? (volNum/3)+'π cm³' : volNum+'/3 π cm³';
  const distractCandidates2 = [(4*r*r)+'π cm³', (2*r*r*r)+'/3 π cm³', (volNum+3)%3===0 ? ((volNum+3)/3)+'π cm³' : (volNum+3)+'/3 π cm³'];
  const finales2 = [];
  for(const d of distractCandidates2){ if(d!==volLabel && finales2.indexOf(d)===-1) finales2.push(d); }
  const opts2 = shuffle([volLabel].concat(finales2.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál es el volumen de una esfera de radio '+r+' cm? (deja el resultado en términos de π)</p>',
    options: opts2, correctValue: volLabel, speakText: '¿Cuál es el volumen de una esfera de radio '+r+' centímetros, en términos de pi?', cols:4,
    explain: 'Volumen = (4/3)πr³ = (4/3)π×'+r+'³ = (4×'+(r*r*r)+'/3)π = <b>'+volLabel+'</b>.',
    recurso: recurso,
  };
}

const TRIANGULOS_PITAGORICOS_M2 = [[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[7,24,25]];
export function genTrigonometriaM2Round(){
  const recurso = 'En un <b>triángulo rectángulo</b>, las razones trigonométricas relacionan un ángulo agudo con los lados del triángulo: <b>seno</b> = cateto opuesto / hipotenusa, <b>coseno</b> = cateto adyacente / hipotenusa, y <b>tangente</b> = cateto opuesto / cateto adyacente (una forma fácil de recordarlo es "SOH-CAH-TOA"). Estas razones también sirven para <b>descomponer un vector</b> (una magnitud con dirección, como una fuerza o una velocidad) en sus componentes horizontal y vertical: si un vector tiene magnitud V y forma un ángulo θ con la horizontal, su componente horizontal es V×cos(θ) y su componente vertical es V×sen(θ).';
  const t = pick(TRIANGULOS_PITAGORICOS_M2);
  const opuesto = t[0], adyacente = t[1], hipotenusa = t[2];
  const roll = Math.random();
  const razonNombre = pick(['seno','coseno','tangente']);
  let correct, formula;
  if(razonNombre==='seno'){ correct = opuesto+'/'+hipotenusa; formula = 'cateto opuesto / hipotenusa'; }
  else if(razonNombre==='coseno'){ correct = adyacente+'/'+hipotenusa; formula = 'cateto adyacente / hipotenusa'; }
  else { correct = opuesto+'/'+adyacente; formula = 'cateto opuesto / cateto adyacente'; }
  const distractCandidates = [opuesto+'/'+hipotenusa, adyacente+'/'+hipotenusa, opuesto+'/'+adyacente, hipotenusa+'/'+opuesto];
  const finales = [];
  for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
  const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">En un triángulo rectángulo con cateto opuesto = '+opuesto+', cateto adyacente = '+adyacente+' e hipotenusa = '+hipotenusa+', ¿cuánto es el '+razonNombre+' del ángulo?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuánto es el '+razonNombre+' de ese ángulo, con cateto opuesto '+opuesto+', cateto adyacente '+adyacente+' e hipotenusa '+hipotenusa+'?', cols:4,
    explain: 'El '+razonNombre+' es '+formula+' = '+ (razonNombre==='seno'?opuesto+'/'+hipotenusa:razonNombre==='coseno'?adyacente+'/'+hipotenusa:opuesto+'/'+adyacente) +' = <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

export function genEstadisticaProbabilidadM2Round(){
  const recurso = 'Una <b>variable aleatoria</b> asigna un número a cada resultado posible de un experimento al azar (por ejemplo, "número de caras al lanzar 2 monedas" puede ser 0, 1 o 2). A cada valor se le puede calcular su <b>probabilidad</b>, y el conjunto de todas esas probabilidades forma una distribución. La <b>combinatoria</b> permite contar cuántos resultados distintos son posibles sin tener que listarlos todos: las <b>permutaciones</b> cuentan formas de ordenar elementos (n! = n×(n-1)×...×1), útil para calcular probabilidades cuando el orden importa. Entender probabilidad también ayuda a leer noticias con sentido crítico: una probabilidad o "riesgo relativo" alto puede sonar alarmante, pero si el riesgo original (absoluto) era muy bajo, el aumento real puede ser pequeño.';
  const roll = Math.random();
  if(roll<0.4){
    const casos = [
      {desc:'lanzar 2 monedas y contar el número de caras', valores:[0,1,2], probs:['1/4','2/4','1/4'], pregunta:'P(X = 1)', correctIdx:1},
      {desc:'lanzar 1 dado y ver si el resultado es par (X=1) o impar (X=0)', valores:[0,1], probs:['3/6','3/6'], pregunta:'P(X = 1)', correctIdx:1},
    ];
    const caso = pick(casos);
    const correct = caso.probs[caso.correctIdx];
    const distractCandidates = caso.probs.filter(function(p,i){ return i!==caso.correctIdx; }).concat(['1/2','1/3']);
    const finales = [];
    for(const d of distractCandidates){ if(d!==correct && finales.indexOf(d)===-1) finales.push(d); }
    const opts = shuffle([correct].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Al '+caso.desc+', se define la variable aleatoria X. ¿Cuál es '+caso.pregunta+'?</p>',
      options: opts, correctValue: correct, speakText: 'Al '+caso.desc+', ¿cuál es la probabilidad de que X sea igual a '+caso.valores[caso.correctIdx]+'?', cols:4,
      explain: 'Contando todos los resultados posibles del experimento, la probabilidad de ese valor es <b>'+correct+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.75){
    const n = pick([3,4,5]);
    let fact = 1;
    for(let i=2;i<=n;i++) fact *= i;
    const distractCandidates = [fact-2, n*n, fact+n];
    const finales = [];
    for(const d of distractCandidates){ if(d>0 && d!==fact && finales.indexOf(d)===-1) finales.push(d); }
    while(finales.length<3){ const d = fact+randInt(2,6); if(d!==fact && finales.indexOf(d)===-1) finales.push(d); }
    const opts = shuffle([fact].concat(finales.slice(0,3))).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿De cuántas formas distintas se pueden ordenar '+n+' libros diferentes en una repisa?</p>',
      options: opts, correctValue: fact, speakText: '¿De cuántas formas distintas se pueden ordenar '+n+' libros diferentes en una repisa?', cols:4,
      explain: 'Se calcula '+n+'! (factorial de '+n+') = '+Array.from({length:n},function(_,i){return n-i;}).join('×')+' = <b>'+fact+'</b> formas distintas.',
      recurso: recurso,
    };
  }
  const opts = shuffle([
    {label:'El riesgo absoluto original, no solo el porcentaje de aumento', value:'ok'},
    {label:'Solo el titular de la noticia', value:'m1'},
    {label:'Nada más, el porcentaje ya lo dice todo', value:'m2'},
    {label:'La opinión de una sola persona sobre el tema', value:'m3'},
  ]);
  return {
    promptHTML: '<p class="prompt-hint">Una noticia dice: "Este hábito duplica el riesgo de un problema poco común". Para interpretar esta información correctamente, ¿qué es importante conocer además del porcentaje de aumento?</p>',
    options: opts, correctValue: 'ok', speakText: '¿Qué es importante conocer, además del porcentaje de aumento, para interpretar correctamente una noticia sobre riesgo?', cols:2, panel:true,
    explain: 'Duplicar un riesgo muy bajo (por ejemplo, de 1% a 2%) sigue siendo un riesgo bajo — por eso hay que conocer el <b>riesgo absoluto original</b>, no solo el porcentaje de aumento (riesgo relativo).',
    recurso: recurso,
  };
}

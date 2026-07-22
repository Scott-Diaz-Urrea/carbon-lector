import { pick, shuffle, randInt, uniqueDistractors } from '../utils.js';
import { shapeSVG, solid3DSVG, fraccionSVG, fraccionBarraSVG, anguloSVG } from '../svg.js';

export const COUNT_EMOJIS = ['🍎','🍓','🐝','⚽','🎈','🐟','🌟','🚗','🐶','🍌'];

export const SHAPES = [
  { id:'circulo', label:'CÍRCULO' },
  { id:'cuadrado', label:'CUADRADO' },
  { id:'triangulo', label:'TRIÁNGULO' },
  { id:'rectangulo', label:'RECTÁNGULO' },
  { id:'rombo', label:'ROMBO' },
  { id:'ovalo', label:'ÓVALO' },
  { id:'pentagono', label:'PENTÁGONO' },
  { id:'hexagono', label:'HEXÁGONO' },
];

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
  {emoji:'🐶',label:'PERRO'},{emoji:'🐱',label:'GATO'},{emoji:'🌳',label:'ÁRBOL'},
  {emoji:'🏠',label:'CASA'},{emoji:'⚽',label:'PELOTA'},{emoji:'🚗',label:'AUTO'},
  {emoji:'🌸',label:'FLOR'},{emoji:'📚',label:'LIBRO'},
];
const FIGURAS_2D_G2 = SHAPES.filter(function(s){ return ['circulo','cuadrado','triangulo','rectangulo'].indexOf(s.id)!==-1; });
const SOLIDOS_3D_G2 = [
  { id:'cubo', label:'CUBO' },
  { id:'paralelepipedo', label:'PARALELEPÍPEDO' },
  { id:'esfera', label:'ESFERA' },
  { id:'cono', label:'CONO' },
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
    explain: 'Esta figura es un(a) <b>'+item.label.toLowerCase()+'</b>.',
  };
}

function genSolido3DG2Round(){
  const item = pick(SOLIDOS_3D_G2);
  const distract = SOLIDOS_3D_G2.filter(function(s){ return s.id!==item.id; });
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  return {
    promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:2, kind:'word', panel:true,
    explain: 'Este cuerpo geométrico es un(a) <b>'+item.label.toLowerCase()+'</b>.',
  };
}

export function genGeometria2Round(){
  const roll = Math.random();
  if(roll<0.34) return genPosicionG2Round();
  if(roll<0.67) return genFigura2DG2Round();
  return genSolido3DG2Round();
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
    promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.medida+'.<br>'+b.emoji+' '+b.label+' mide '+b.medida+'.<br>¿Cuál es más largo?</p>',
    options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
    explain: longer.label+' mide '+longer.medida+', más que el otro objeto.',
  };
}

export function genMedicion2Round(){
  const roll = Math.random();
  if(roll<0.34) return genCalendarioG2Round();
  if(roll<0.67) return genHoraG2Round();
  return genLongitudG2Round();
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
  {emoji:'🐶',label:'PERRO'},{emoji:'🐱',label:'GATO'},{emoji:'🌳',label:'ÁRBOL'},{emoji:'🏠',label:'CASA'},{emoji:'⚽',label:'PELOTA'},{emoji:'🌸',label:'FLOR'},
];
const SOLIDOS_3D_G3 = [
  { id:'cubo', label:'CUBO', caras:6 },
  { id:'paralelepipedo', label:'PARALELEPÍPEDO', caras:6 },
  { id:'esfera', label:'ESFERA', caras:0 },
  { id:'cono', label:'CONO', caras:1 },
  { id:'cilindro', label:'CILINDRO', caras:2 },
  { id:'piramide', label:'PIRÁMIDE', caras:5 },
];
const ANGULOS_POOL = ['RECTO','AGUDO','OBTUSO'];
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
  { pregunta:'¿Cuál es tu fruta favorita?', categorias:[{label:'MANZANA',valor:8},{label:'PLÁTANO',valor:5},{label:'UVA',valor:3}] },
  { pregunta:'¿Cuál es tu color favorito?', categorias:[{label:'AZUL',valor:9},{label:'ROJO',valor:6},{label:'VERDE',valor:4}] },
  { pregunta:'¿Cuál es tu mascota favorita?', categorias:[{label:'PERRO',valor:10},{label:'GATO',valor:7},{label:'PEZ',valor:2}] },
  { pregunta:'¿Cuál es tu deporte favorito?', categorias:[{label:'FÚTBOL',valor:12},{label:'NATACIÓN',valor:5},{label:'TENIS',valor:3}] },
];

function barChartHTML(categorias){
  const max = Math.max.apply(null, categorias.map(function(c){ return c.valor; }));
  return '<div class="bar-chart">'+categorias.map(function(c){
    const h = Math.round((c.valor/max)*80)+20;
    return '<div class="bar-col"><div class="bar-value">'+c.valor+'</div><div class="bar-fill" style="height:'+h+'px;"></div><div class="bar-label">'+c.label+'</div></div>';
  }).join('')+'</div>';
}

export function genNumeros3Round(){
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
    };
  }
  const n = randInt(0,1000);
  const digitos = String(n).length;
  const opts = shuffle(['1 DÍGITO','2 DÍGITOS','3 DÍGITOS','4 DÍGITOS']).map(function(o){ return {label:o, value:o}; });
  const correct = digitos+' DÍGITO'+(digitos>1?'S':'');
  return {
    promptHTML: '<p class="prompt-count" style="font-size:40px;">'+n+'</p><p class="prompt-hint">¿Cuántos dígitos tiene este número?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuántos dígitos tiene el '+n+'?', cols:2, panel:true,
    explain: 'El '+n+' tiene <b>'+correct.toLowerCase()+'</b>.',
  };
}

export function genOperaciones3Round(){
  const roll = Math.random();
  if(roll<0.4){
    const a = randInt(10,500), b = randInt(10,500);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 20, 1000, 20, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' + '+b+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
      explain: a+' + '+b+' = <b>'+sum+'</b>.',
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
  };
}

export function genPatrones3Round(){
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
  };
}

export function genGeometria3Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CUADRICULA_POOL);
    const col = randInt(1,5), row = randInt(1,5);
    const opts = shuffle([col+','+row, (col+1)+','+row, col+','+(row+1), (col+1)+','+(row+1)]).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">El '+item.label.toLowerCase()+' está en la columna '+col+' y la fila '+row+'. ¿Cuál es su posición (columna,fila)?</p>',
      options: opts, correctValue: col+','+row, speakText: '¿Cuál es la posición del '+item.label.toLowerCase()+'?', cols:2, panel:true,
      explain: 'La posición es columna '+col+', fila '+row+', o sea <b>('+col+','+row+')</b>.',
    };
  }
  if(roll<0.67){
    const item = pick(SOLIDOS_3D_G3);
    const distract = shuffle(SOLIDOS_3D_G3.filter(function(s){ return s.id!==item.id; })).slice(0,3);
    const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
      options: opts, correctValue: item.id, speakText: item.label, cols:4, kind:'word',
      explain: 'Este cuerpo geométrico es un(a) <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const tipo = pick(ANGULOS_POOL);
  const opts = shuffle(ANGULOS_POOL).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<div class="shape-display">'+anguloSVG(tipo,100)+'</div><p class="prompt-hint">¿Qué tipo de ángulo es?</p>',
    options: opts, correctValue: tipo, speakText: '¿Qué tipo de ángulo es?', cols:4, kind:'word',
    explain: 'Este es un ángulo <b>'+tipo.toLowerCase()+'</b>.',
  };
}

export function genMedicion3Round(){
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
  };
}

export function genDatos3Round(){
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
    };
  }
  const target = pick(item.categorias);
  const opts = uniqueDistractors(target.valor, 0, 20, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuántos votos tuvo la opción "'+target.label+'"?</p>',
    options: opts, correctValue: target.valor, speakText: '¿Cuántos votos tuvo '+target.label+'?', cols:4,
    explain: 'La opción "'+target.label+'" tuvo <b>'+target.valor+'</b> votos.',
  };
}

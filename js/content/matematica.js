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
  { id:'cubo', label:'CUBO', frente:'UN CUADRADO', lado:'UN CUADRADO', arriba:'UN CUADRADO' },
  { id:'cono', label:'CONO', frente:'UN TRIÁNGULO', lado:'UN TRIÁNGULO', arriba:'UN CÍRCULO' },
  { id:'cilindro', label:'CILINDRO', frente:'UN RECTÁNGULO', lado:'UN RECTÁNGULO', arriba:'UN CÍRCULO' },
  { id:'esfera', label:'ESFERA', frente:'UN CÍRCULO', lado:'UN CÍRCULO', arriba:'UN CÍRCULO' },
  { id:'piramide', label:'PIRÁMIDE', frente:'UN TRIÁNGULO', lado:'UN TRIÁNGULO', arriba:'UN CUADRADO' },
];
const SIMETRIA_BANK = [
  { id:'circulo', label:'CÍRCULO', simetrico:true },
  { id:'cuadrado', label:'CUADRADO', simetrico:true },
  { id:'triangulo', label:'TRIÁNGULO (EQUILÁTERO)', simetrico:true },
  { id:'ovalo', label:'ÓVALO', simetrico:true },
  { id:'rombo', label:'ROMBO', simetrico:true },
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
    };
  }
  const n = randInt(1000,9999);
  const opts = shuffle([n, n+randInt(1,50), n-randInt(1,50), n+randInt(100,300)]).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estos números se lee "'+numeroALetras(n)+'"?</p>',
    options: opts, correctValue: n, speakText: '¿Cuál número es '+numeroALetras(n)+'?', cols:2, panel:true,
    explain: 'El número es <b>'+n+'</b>.',
  };
}

function numeroALetras(n){
  const mil = Math.floor(n/1000), resto = n%1000;
  let s = mil>0 ? (mil===1?'mil':mil+' mil') : '';
  if(resto>0) s += (s?' ':'')+resto;
  return s;
}

export function genOperaciones4Round(){
  const roll = Math.random();
  if(roll<0.34){
    const a = randInt(100,900), b = randInt(10,99);
    const sum = a+b;
    const opts = uniqueDistractors(sum, 100, 1200, 20, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' + '+b+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
      options: opts, correctValue: sum, speakText: '¿Cuánto es '+a+' más '+b+'?', cols:4,
      explain: a+' + '+b+' = <b>'+sum+'</b>.',
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
  };
}

export function genMultiplicarDividir4Round(){
  if(Math.random()<0.5){
    const a = randInt(100,300), b = randInt(2,9);
    const total = a*b;
    const opts = uniqueDistractors(total, 100, 3000, 50, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
      explain: a+' × '+b+' = <b>'+total+'</b>.',
    };
  }
  const b = randInt(2,9), q = randInt(10,20);
  const total = b*q;
  const opts = uniqueDistractors(q, 5, 40, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Tienes '+total+' objetos y los repartes en grupos de '+b+'. ¿Cuántos grupos se forman?</p>',
    options: opts, correctValue: q, speakText: '¿Cuántos grupos de '+b+' se forman con '+total+'?', cols:4,
    explain: total+' ÷ '+b+' = <b>'+q+'</b> grupos.',
  };
}

export function genFracciones4Round(){
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
  };
}

export function genDecimales4Round(){
  if(Math.random()<0.5){
    const decimas = randInt(1,9);
    const correct = '0,'+decimas;
    const opts = uniqueDistractors(decimas, 1, 9, 2, 4).map(function(v){ return {label:'0,'+v, value:'0,'+v}; });
    return {
      promptHTML: '<div class="shape-display">'+fraccionBarraSVG(decimas,10,110)+'</div><p class="prompt-hint">¿Qué número decimal representa esta barra (en décimos)?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué decimal representa esta barra?', cols:4,
      explain: decimas+' de 10 partes coloreadas es <b>'+correct+'</b> (‘'+decimas+' décimos’).',
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
  };
}

export function genPatrones4Round(){
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
  };
}

export function genGeometria4Round(){
  const roll = Math.random();
  if(roll<0.25){
    const col = randInt(1,10), row = randInt(1,10);
    const opts = shuffle([col+','+row, (col+1)+','+row, col+','+(row+1), (col+2)+','+(row+1)]).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-hint">Un punto está ubicado en la coordenada (columna, fila) = ('+col+', '+row+'). Si avanzas 1 columna hacia la derecha, ¿cuál es la nueva coordenada?</p>',
      options: opts, correctValue: (col+1)+','+row, speakText: '¿Cuál es la nueva coordenada?', cols:2, panel:true,
      explain: 'Avanzar 1 columna a la derecha cambia solo el primer número: ('+(col+1)+', '+row+').',
    };
  }
  if(roll<0.5){
    const item = pick(SOLIDOS_VISTAS_BANK);
    const vista = pick(['frente','lado','arriba']);
    const correct = item[vista];
    const distract = shuffle(['UN CUADRADO','UN CÍRCULO','UN TRIÁNGULO','UN RECTÁNGULO'].filter(function(v){ return v!==correct; })).slice(0,3);
    const opts = shuffle([correct].concat(distract)).map(function(v){ return {label:v, value:v}; });
    const vistaLabel = vista==='frente'?'DE FRENTE':vista==='lado'?'DE LADO':'DESDE ARRIBA';
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">Si miras este cuerpo geométrico '+vistaLabel.toLowerCase()+', ¿qué forma ves?</p>',
      options: opts, correctValue: correct, speakText: 'Si miras este cuerpo '+vistaLabel.toLowerCase()+', ¿qué forma ves?', cols:2, kind:'word', panel:true,
      explain: 'Un(a) '+item.label.toLowerCase()+' visto '+vistaLabel.toLowerCase()+' se ve como <b>'+correct.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.75){
    const item = pick(SIMETRIA_BANK);
    const opts = shuffle([{label:'SÍ TIENE LÍNEA DE SIMETRÍA', value:true},{label:'NO TIENE LÍNEA DE SIMETRÍA', value:false}]);
    return {
      promptHTML: '<div class="shape-display">'+shapeSVG(item.id,100)+'</div><p class="prompt-hint">Si doblaras esta figura por la mitad, ¿los dos lados coinciden exactamente?</p>',
      options: opts, correctValue: item.simetrico, speakText: '¿Esta figura tiene una línea de simetría?', cols:2, panel:true,
      explain: item.simetrico ? 'Un(a) '+item.label.toLowerCase()+' sí tiene línea de simetría: al doblarlo por la mitad, ambos lados coinciden.' : 'Un(a) '+item.label.toLowerCase()+' no tiene línea de simetría en este caso.',
    };
  }
  const tipoA = pick(ANGULOS_POOL);
  let tipoB = pick(ANGULOS_POOL);
  while(tipoB===tipoA) tipoB = pick(ANGULOS_POOL);
  const gradosMap = {RECTO:90, AGUDO:45, OBTUSO:130};
  const mayor = gradosMap[tipoA]>gradosMap[tipoB] ? 'A' : 'B';
  const opts = shuffle([{label:'ÁNGULO A', value:'A'},{label:'ÁNGULO B', value:'B'}]);
  return {
    promptHTML: '<div class="compare-row"><div class="compare-col"><span>Ángulo A</span>'+anguloSVG(tipoA,90)+'</div><div class="compare-col"><span>Ángulo B</span>'+anguloSVG(tipoB,90)+'</div></div><p class="prompt-hint">¿Cuál ángulo es mayor?</p>',
    options: opts, correctValue: mayor, speakText: '¿Cuál ángulo es mayor?', cols:2, panel:true,
    explain: 'El ángulo '+mayor+' ('+ (mayor==='A'?tipoA:tipoB).toLowerCase() +') es mayor.',
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
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(HORA_AMPM_BANK);
    const distract = shuffle(HORA_AMPM_BANK.filter(function(h){ return h.correcto!==item.correcto; })).slice(0,3).map(function(h){ return h.correcto; });
    const opts = shuffle([item.correcto].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.descripcion+' — el reloj de 24 horas marca '+item.hora+'. ¿Cómo se escribe esa hora con A.M./P.M.?</p>',
      options: opts, correctValue: item.correcto, speakText: item.descripcion, cols:2, kind:'word',
      explain: 'Las '+item.hora+' en formato 24 horas se escriben <b>'+item.correcto+'</b>.',
    };
  }
  if(roll<0.4){
    const item = pick(CONVERSION_TIEMPO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    };
  }
  if(roll<0.6){
    let a = pick(OBJETOS_LONGITUD4), b = pick(OBJETOS_LONGITUD4);
    while(b.label===a.label) b = pick(OBJETOS_LONGITUD4);
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    const longer = a.cm>b.cm ? a : b;
    return {
      promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.cm+' cm.<br>'+b.emoji+' '+b.label+' mide '+b.cm+' cm.<br>¿Cuál es más largo?</p>',
      options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
      explain: longer.label+' mide '+longer.cm+' cm, más que el otro objeto.',
    };
  }
  if(roll<0.8){
    const largo = randInt(3,10), ancho = randInt(2,8);
    const area = largo*ancho;
    const opts = uniqueDistractors(area, 4, 100, 6, 4).map(function(v){ return {label:v+' UNIDADES CUADRADAS', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un rectángulo mide '+largo+' unidades de largo y '+ancho+' unidades de ancho. ¿Cuál es su área?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área del rectángulo?', cols:2,
      explain: 'El área es largo × ancho: '+largo+' × '+ancho+' = <b>'+area+' unidades cuadradas</b>.',
    };
  }
  const l = randInt(2,5), a = randInt(2,4), h = randInt(2,4);
  const vol = l*a*h;
  const opts = uniqueDistractors(vol, 4, 150, 8, 4).map(function(v){ return {label:v+' CUBOS', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Una caja se llena con cubos pequeños: '+l+' de largo, '+a+' de ancho y '+h+' de alto. ¿Cuántos cubos caben en total?</p>',
    options: opts, correctValue: vol, speakText: '¿Cuántos cubos caben en la caja?', cols:2,
    explain: 'El volumen es largo × ancho × alto: '+l+' × '+a+' × '+h+' = <b>'+vol+' cubos</b>.',
  };
}

const EXPERIMENTOS_ALEATORIOS_BANK = [
  { pregunta:'Si lanzas una moneda al aire, ¿cuáles son los resultados posibles?', correcta:'CARA O SELLO', opts:['SOLO CARA','SOLO SELLO','NINGUNO DE LOS DOS'] },
  { pregunta:'Si lanzas un dado normal de 6 caras, ¿cuál es el mayor número que puede salir?', correcta:'6', opts:['4','8','10'] },
  { pregunta:'Si tienes una bolsa con 3 bolitas rojas y 1 azul, ¿de qué color es más probable sacar una bolita?', correcta:'ROJA', opts:['AZUL','VERDE','IGUAL DE PROBABLE'] },
  { pregunta:'Si lanzas una moneda 10 veces, ¿es seguro que salgan exactamente 5 caras y 5 sellos?', correcta:'NO, ES SOLO UNA POSIBILIDAD, NO UNA CERTEZA', opts:['SÍ, SIEMPRE SERÁ EXACTO','SOLO SALDRÁN CARAS','SOLO SALDRÁN SELLOS'] },
];

export function genDatos4Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const opts = uniqueDistractors(total, 5, 60, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuántas personas respondieron la encuesta en total?</p>',
      options: opts, correctValue: total, speakText: '¿Cuántas personas respondieron en total?', cols:4,
      explain: 'Sumando todas las categorías: '+item.categorias.map(function(c){ return c.valor; }).join(' + ')+' = <b>'+total+'</b> personas en total.',
    };
  }
  if(roll<0.67){
    const item = pick(EXPERIMENTOS_ALEATORIOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
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
    promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál opción tuvo '+(askMax?'MÁS':'MENOS')+' votos?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál opción tuvo '+(askMax?'más':'menos')+' votos?', cols:4, kind:'word',
    explain: '<b>'+correct+'</b> tuvo la '+(askMax?'mayor':'menor')+' cantidad de votos.',
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
  const roll = Math.random();
  if(roll<0.34){
    const n = randInt(100000, 900000000);
    const opts = uniqueDistractors(n, 100000, 999999999, Math.max(1000,Math.floor(n*0.02)), 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es igual a '+n+'?</p>',
      options: opts, correctValue: n, speakText: '¿Cuál número es igual a '+n+'?', cols:2, panel:true,
      explain: 'El número correcto es <b>'+n+'</b>.',
    };
  }
  if(roll<0.67){
    let a = randInt(100000,900000000), b = randInt(100000,900000000);
    while(a===b) b = randInt(100000,900000000);
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.',
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
    explain: 'El dígito en esa posición es <b>'+correct+'</b>.',
  };
}

export function genMultiplicar5Round(){
  if(Math.random()<0.5){
    const a = randInt(11,40), b = randInt(11,40);
    const total = a*b;
    const opts = uniqueDistractors(total, 100, 2000, 40, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:30px;">'+a+' × '+b+'</p><p class="prompt-hint">¿Cuánto es?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto es '+a+' por '+b+'?', cols:4,
      explain: a+' × '+b+' = <b>'+total+'</b>.',
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
    explain: 'Puedes usar la propiedad distributiva: '+a+' × '+b+' = <b>'+total+'</b>.',
  };
}

export function genDividir5Round(){
  const divisor = randInt(2,9);
  const cociente = randInt(11,99);
  const resto = randInt(0,divisor-1);
  const dividendo = divisor*cociente + resto;
  if(Math.random()<0.5){
    const opts = uniqueDistractors(cociente, 10, 300, 8, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+dividendo+' ÷ '+divisor+' = ?  (sin considerar el resto)</p>',
      options: opts, correctValue: cociente, speakText: '¿Cuánto es '+dividendo+' dividido '+divisor+'?', cols:4,
      explain: dividendo+' ÷ '+divisor+' = <b>'+cociente+'</b>, con resto '+resto+'.',
    };
  }
  const opts = uniqueDistractors(resto, 0, divisor-1, 1, Math.min(4,divisor)).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Al dividir '+dividendo+' ÷ '+divisor+', el cociente es '+cociente+'. ¿Cuál es el resto?</p>',
    options: opts, correctValue: resto, speakText: '¿Cuál es el resto de '+dividendo+' dividido '+divisor+'?', cols:4,
    explain: divisor+' × '+cociente+' = '+(divisor*cociente)+', y '+dividendo+' - '+(divisor*cociente)+' = <b>'+resto+'</b> de resto.',
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
      explain: promptTxt+' = <b>'+correct+'</b>, respetando el orden de las operaciones.',
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
      explain: '$'+item.precio+' × '+cantidad+' = <b>$'+total+'</b> en total.',
    };
  }
  const item = pick(OBJETOS_PRECIO5);
  const tienes = item.precio + pick([500,1000,2000,3000]);
  const falta = tienes - item.precio;
  const opts = uniqueDistractors(falta, 0, 20000, 500, 4).map(function(v){ return {label:'$'+v, value:v}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio+'. Si pagas con $'+tienes+', ¿cuánto vuelto recibes?</p>',
    options: opts, correctValue: falta, speakText: '¿Cuánto vuelto recibes?', cols:4,
    explain: '$'+tienes+' - $'+item.precio+' = <b>$'+falta+'</b> de vuelto.',
  };
}

export function genFracciones5Round(){
  const roll = Math.random();
  if(roll<0.25){
    const den = pick([3,4,5,6,7,8]);
    const num = randInt(1,den-1);
    const correct = 'FRACCIÓN PROPIA';
    const opts = shuffle([{label:'FRACCIÓN PROPIA', value:'FRACCIÓN PROPIA'},{label:'FRACCIÓN IMPROPIA', value:'FRACCIÓN IMPROPIA'}]);
    return {
      promptHTML: '<div class="shape-display">'+fraccionSVG(num,den,110)+'</div><p class="prompt-hint">La fracción es '+num+'/'+den+'. ¿Es una fracción propia (numerador menor que el denominador) o impropia?</p>',
      options: opts, correctValue: correct, speakText: '¿Es '+num+'/'+den+' una fracción propia o impropia?', cols:2, kind:'word',
      explain: 'Como '+num+' es menor que '+den+', '+num+'/'+den+' es una <b>fracción propia</b>.',
    };
  }
  if(roll<0.5){
    const den = pick([3,4,5,6]);
    const num = randInt(den+1,den*2);
    const correct = 'FRACCIÓN IMPROPIA';
    const opts = shuffle([{label:'FRACCIÓN PROPIA', value:'FRACCIÓN PROPIA'},{label:'FRACCIÓN IMPROPIA', value:'FRACCIÓN IMPROPIA'}]);
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+num+'/'+den+'</p><p class="prompt-hint">¿Es una fracción propia (numerador menor que el denominador) o impropia (numerador igual o mayor)?</p>',
      options: opts, correctValue: correct, speakText: '¿Es '+num+'/'+den+' una fracción propia o impropia?', cols:2, kind:'word',
      explain: 'Como '+num+' es igual o mayor que '+den+', '+num+'/'+den+' es una <b>fracción impropia</b>.',
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
      explain: a+'/'+den+' + '+b+'/'+den+' = <b>'+sum+'/'+den+'</b> (se suman los numeradores, el denominador no cambia).',
    };
  }
  const den = pick([4,5,6,7,8,9,10,11,12]);
  const a = randInt(2,den-1), b = randInt(1,a-1);
  const resta = a-b;
  const opts = uniqueDistractors(resta, 1, den, 1, Math.min(4,den-1)).map(function(v){ return {label:v+'/'+den, value:v+'/'+den}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:28px;">'+a+'/'+den+' - '+b+'/'+den+'</p><p class="prompt-hint">¿Cuánto es en total?</p>',
    options: opts, correctValue: resta+'/'+den, speakText: '¿Cuánto es '+a+'/'+den+' menos '+b+'/'+den+'?', cols:4,
    explain: a+'/'+den+' - '+b+'/'+den+' = <b>'+resta+'/'+den+'</b> (se restan los numeradores, el denominador no cambia).',
  };
}

const FRACCION_A_DECIMAL_BANK = [
  { num:1, den:2, decimal:'0,5' }, { num:1, den:4, decimal:'0,25' }, { num:3, den:4, decimal:'0,75' },
  { num:1, den:5, decimal:'0,2' }, { num:2, den:5, decimal:'0,4' }, { num:3, den:5, decimal:'0,6' },
  { num:4, den:5, decimal:'0,8' }, { num:1, den:10, decimal:'0,1' }, { num:7, den:10, decimal:'0,7' },
];
export function genDecimales5Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(FRACCION_A_DECIMAL_BANK);
    const distract = shuffle(FRACCION_A_DECIMAL_BANK.filter(function(f){ return f.decimal!==item.decimal; })).slice(0,3).map(function(f){ return f.decimal; });
    const opts = shuffle([item.decimal].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+item.num+'/'+item.den+'</p><p class="prompt-hint">¿A qué decimal equivale esta fracción?</p>',
      options: opts, correctValue: item.decimal, speakText: '¿A qué decimal equivale '+item.num+'/'+item.den+'?', cols:4,
      explain: item.num+'/'+item.den+' equivale a <b>'+item.decimal+'</b>.',
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
      explain: 'El '+Math.max(aVal,bVal).toFixed(3).replace('.',',')+' es mayor.',
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
      explain: a.toFixed(2).replace('.',',')+' + '+b.toFixed(2).replace('.',',')+' = <b>'+correctLabel+'</b>.',
    };
  }
  const precio1 = (randInt(100,900)/10).toFixed(1);
  const precio2 = (randInt(50,400)/10).toFixed(1);
  const total = (parseFloat(precio1)+parseFloat(precio2)).toFixed(1);
  const opts = uniqueDistractors(Math.round(parseFloat(total)*10), 500, 15000, 30, 4).map(function(v){ return {label:'$'+(v/10).toFixed(1).replace('.',','), value:'$'+(v/10).toFixed(1).replace('.',',')}; });
  return {
    promptHTML: '<p class="prompt-hint">Compraste dos productos: uno de $'+precio1.replace('.',',')+' mil y otro de $'+precio2.replace('.',',')+' mil. ¿Cuánto gastaste en total (en miles de pesos)?</p>',
    options: opts, correctValue: '$'+total.replace('.',','), speakText: '¿Cuánto gastaste en total?', cols:4,
    explain: '$'+precio1.replace('.',',')+' + $'+precio2.replace('.',',')+' = <b>$'+total.replace('.',',')+'</b> mil.',
  };
}

export function genPatrones5Round(){
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
      explain: 'La regla es "'+tipo.toLowerCase()+' '+step+'" cada vez, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.',
    };
  }
  if(roll<0.67){
    const x = randInt(1,50), suma = randInt(5,50);
    const total = x+suma;
    const opts = uniqueDistractors(x, 0, 200, 6, 4).map(function(v){ return {label:'x = '+v, value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:26px;">x + '+suma+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
      options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
      explain: total+' - '+suma+' = <b>'+x+'</b>, así que x = '+x+'.',
    };
  }
  const x = randInt(1,30), resta = randInt(1,20);
  const total = x-resta;
  const opts = uniqueDistractors(x, 0, 100, 5, 4).map(function(v){ return {label:'x = '+v, value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">x - '+resta+' = '+total+'</p><p class="prompt-hint">¿Cuál es el valor de x?</p>',
    options: opts, correctValue: x, speakText: '¿Cuál es el valor de equis?', cols:4,
    explain: total+' + '+resta+' = <b>'+x+'</b>, así que x = '+x+'.',
  };
}

const PARALELISMO_BANK = [
  { id:'cuadrado', label:'CUADRADO', paralelo:true }, { id:'rectangulo', label:'RECTÁNGULO', paralelo:true },
  { id:'rombo', label:'ROMBO', paralelo:true }, { id:'hexagono', label:'HEXÁGONO', paralelo:true },
  { id:'triangulo', label:'TRIÁNGULO', paralelo:false }, { id:'pentagono', label:'PENTÁGONO', paralelo:false },
];
const TRANSFORMACIONES_BANK = [
  { desc:'Deslizar una figura hacia la derecha, sin girarla ni voltearla', tipo:'TRASLACIÓN' },
  { desc:'Mover una figura hacia arriba, manteniendo su misma forma y orientación', tipo:'TRASLACIÓN' },
  { desc:'Deslizar una figura hacia abajo en línea recta', tipo:'TRASLACIÓN' },
  { desc:'Voltear una figura como si la reflejara un espejo', tipo:'REFLEXIÓN' },
  { desc:'Voltear una figura de izquierda a derecha, como su imagen en un espejo', tipo:'REFLEXIÓN' },
  { desc:'Voltear una figura de arriba hacia abajo, como su reflejo en el agua', tipo:'REFLEXIÓN' },
  { desc:'Girar una figura alrededor de un punto fijo, como las agujas de un reloj', tipo:'ROTACIÓN' },
  { desc:'Girar una figura 90 grados sobre un punto central', tipo:'ROTACIÓN' },
  { desc:'Dar vuelta una figura como una rueda que gira sobre su eje', tipo:'ROTACIÓN' },
];
export function genGeometria5Round(){
  const roll = Math.random();
  if(roll<0.34){
    const col = randInt(1,8), row = randInt(1,8);
    const dx = randInt(1,3), dy = randInt(1,3);
    const opts = shuffle([(col+dx)+','+(row+dy), col+','+(row+dy), (col+dx)+','+row, (col+dx+1)+','+(row+dy+1)]).map(function(c){ return {label:'('+c+')', value:c}; });
    return {
      promptHTML: '<p class="prompt-hint">Un punto está en la coordenada ('+col+', '+row+'). Si te mueves '+dx+' hacia la derecha y '+dy+' hacia arriba, ¿en qué coordenada quedas?</p>',
      options: opts, correctValue: (col+dx)+','+(row+dy), speakText: '¿En qué coordenada quedas?', cols:2, panel:true,
      explain: 'Sumas '+dx+' a la primera coordenada y '+dy+' a la segunda: ('+(col+dx)+', '+(row+dy)+').',
    };
  }
  if(roll<0.67){
    const item = pick(PARALELISMO_BANK);
    const opts = shuffle([{label:'SÍ TIENE LADOS PARALELOS', value:true},{label:'NO TIENE LADOS PARALELOS', value:false}]);
    return {
      promptHTML: '<div class="shape-display">'+shapeSVG(item.id,100)+'</div><p class="prompt-hint">¿Esta figura tiene al menos un par de lados paralelos?</p>',
      options: opts, correctValue: item.paralelo, speakText: '¿Esta figura tiene lados paralelos?', cols:2, panel:true,
      explain: item.paralelo ? 'Un(a) '+item.label.toLowerCase()+' sí tiene al menos un par de lados paralelos.' : 'Un(a) '+item.label.toLowerCase()+' no tiene lados paralelos.',
    };
  }
  const item = pick(TRANSFORMACIONES_BANK);
  const todos = ['TRASLACIÓN','REFLEXIÓN','ROTACIÓN'];
  const distract = todos.filter(function(t){ return t!==item.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'</p><p class="prompt-hint">¿Qué transformación geométrica es esta?</p>',
    options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Esto es una <b>'+item.tipo.toLowerCase()+'</b>.',
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
  { valor:2, de:'KM', a:'M', resultado:2000 }, { valor:5, de:'M', a:'CM', resultado:500 },
  { valor:3, de:'CM', a:'MM', resultado:30 }, { valor:1, de:'KM', a:'M', resultado:1000 },
  { valor:4, de:'M', a:'CM', resultado:400 }, { valor:7, de:'CM', a:'MM', resultado:70 },
];
export function genMedicion5Round(){
  const roll = Math.random();
  if(roll<0.25){
    let a = pick(OBJETOS_LONGITUD5), b = pick(OBJETOS_LONGITUD5);
    while(b.label===a.label) b = pick(OBJETOS_LONGITUD5);
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    const longer = a.cm>b.cm ? a : b;
    return {
      promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.cm+' cm.<br>'+b.emoji+' '+b.label+' mide '+b.cm+' cm.<br>¿Cuál es más largo?</p>',
      options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
      explain: longer.label+' mide '+longer.cm+' cm, más que el otro objeto.',
    };
  }
  if(roll<0.5){
    const item = pick(CONVERSION_LONGITUD_BANK);
    const opts = uniqueDistractors(item.resultado, 1, 20000, Math.max(5,Math.floor(item.resultado*0.2)), 4).map(function(v){ return {label:v+' '+item.a, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.valor+' '+item.de+' equivalen a ¿cuántos '+item.a+'?</p>',
      options: opts, correctValue: item.resultado, speakText: '¿A cuántos '+item.a+' equivalen '+item.valor+' '+item.de+'?', cols:4,
      explain: item.valor+' '+item.de+' = <b>'+item.resultado+' '+item.a+'</b>.',
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
      promptHTML: '<p class="prompt-hint">Quieres diseñar un rectángulo con perímetro '+perimetro+'. ¿Cuáles dimensiones (largo × ancho) funcionan?</p>',
      options: opts, correctValue: 'ok', speakText: '¿Qué dimensiones dan ese perímetro?', cols:2, panel:true,
      explain: 'Con largo '+largo+' y ancho '+ancho+', el perímetro es 2×('+largo+'+'+ancho+') = <b>'+perimetro+'</b>.',
    };
  }
  const tipo = pick(['TRIÁNGULO','PARALELOGRAMO','TRAPECIO']);
  const base = randInt(4,12), altura = randInt(3,10);
  let area, formula;
  if(tipo==='TRIÁNGULO'){ area = Math.round(base*altura/2); formula = '(base × altura) ÷ 2 = ('+base+' × '+altura+') ÷ 2'; }
  else if(tipo==='PARALELOGRAMO'){ area = base*altura; formula = 'base × altura = '+base+' × '+altura; }
  else { const base2 = base+randInt(1,4); area = Math.round((base+base2)*altura/2); formula = '(base mayor + base menor) × altura ÷ 2 = ('+base2+' + '+base+') × '+altura+' ÷ 2'; }
  const opts = uniqueDistractors(area, 2, 200, 6, 4).map(function(v){ return {label:v+' UNIDADES CUADRADAS', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un '+tipo.toLowerCase()+' tiene base '+base+' y altura '+altura+'. ¿Cuál es su área?</p>',
    options: opts, correctValue: area, speakText: '¿Cuál es el área de este '+tipo.toLowerCase()+'?', cols:2,
    explain: 'El área se calcula con '+formula+' = <b>'+area+' unidades cuadradas</b>.',
  };
}

const PROBABILIDAD_CUALITATIVA_BANK = [
  { escenario:'Sacar una bolita roja de una bolsa que solo tiene bolitas rojas', nivel:'SEGURO' },
  { escenario:'Que mañana salga el sol', nivel:'SEGURO' },
  { escenario:'Sacar un 6 al lanzar un dado normal de 6 caras', nivel:'POSIBLE' },
  { escenario:'Sacar una bolita azul de una bolsa con 9 rojas y 1 azul', nivel:'POCO POSIBLE' },
  { escenario:'Que un perro hable español', nivel:'IMPOSIBLE' },
  { escenario:'Que llueva algún día de invierno en el sur de Chile', nivel:'POSIBLE' },
  { escenario:'Sacar una carta de corazones de una baraja normal', nivel:'POSIBLE' },
  { escenario:'Que una moneda caiga sin mostrar cara ni sello', nivel:'IMPOSIBLE' },
];
const COMPARAR_PROBABILIDAD_BANK = [
  { descripcionA:'Bolsa A: 8 bolitas rojas y 2 azules', descripcionB:'Bolsa B: 3 bolitas rojas y 7 azules', preguntaColor:'ROJA', masProbable:'A' },
  { descripcionA:'Bolsa A: 1 bolita verde y 9 amarillas', descripcionB:'Bolsa B: 6 bolitas verdes y 4 amarillas', preguntaColor:'VERDE', masProbable:'B' },
  { descripcionA:'Bolsa A: 5 bolitas negras y 5 blancas', descripcionB:'Bolsa B: 9 bolitas negras y 1 blanca', preguntaColor:'NEGRA', masProbable:'B' },
];
export function genDatos5Round(){
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(DATOS_ENCUESTA);
    const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
    const promedio = Math.round((total/item.categorias.length)*10)/10;
    const opts = uniqueDistractors(Math.round(promedio*10), 5, 300, 8, 4).map(function(v){ return {label:(v/10).toFixed(1), value:(v/10).toFixed(1)}; });
    return {
      promptHTML: barChartHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál es el promedio de respuestas por categoría?</p>',
      options: opts, correctValue: promedio.toFixed(1), speakText: '¿Cuál es el promedio?', cols:4,
      explain: 'El promedio es la suma dividida por la cantidad de categorías: '+total+' ÷ '+item.categorias.length+' = <b>'+promedio.toFixed(1)+'</b>.',
    };
  }
  if(roll<0.4){
    const item = pick(PROBABILIDAD_CUALITATIVA_BANK);
    const todos = ['SEGURO','POSIBLE','POCO POSIBLE','IMPOSIBLE'];
    const distract = todos.filter(function(n){ return n!==item.nivel; });
    const opts = shuffle([item.nivel].concat(distract)).map(function(n){ return {label:n, value:n}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Qué tan posible es que esto ocurra?</p>',
      options: opts, correctValue: item.nivel, speakText: item.escenario, cols:2, kind:'word', panel:true,
      explain: 'Esto es <b>'+item.nivel.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.6){
    const item = pick(COMPARAR_PROBABILIDAD_BANK);
    const opts = shuffle([{label:'BOLSA A', value:'A'},{label:'BOLSA B', value:'B'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.descripcionA+'<br>'+item.descripcionB+'</p><p class="prompt-hint">¿De cuál bolsa es más probable sacar una bolita '+item.preguntaColor.toLowerCase()+'?</p>',
      options: opts, correctValue: item.masProbable, speakText: '¿De cuál bolsa es más probable sacar una bolita '+item.preguntaColor.toLowerCase()+'?', cols:2, panel:true,
      explain: 'La bolsa '+item.masProbable+' tiene una proporción mayor de bolitas '+item.preguntaColor.toLowerCase()+'s, sin necesidad de calcular la probabilidad exacta.',
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
      explain: '<b>'+maxCat.label+'</b> tuvo el valor más alto en el gráfico.',
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
    promptHTML: tabla+'<p class="prompt-hint">Este diagrama de tallo y hojas representa los números '+valores.join(', ')+'. ¿Cuál es el valor '+(preguntaMax?'MÁS ALTO':'MÁS BAJO')+'?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál es el valor '+(preguntaMax?'más alto':'más bajo')+'?', cols:4,
    explain: 'El valor '+(preguntaMax?'más alto':'más bajo')+' es <b>'+correct+'</b>.',
  };
}

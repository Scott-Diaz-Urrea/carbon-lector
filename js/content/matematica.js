import { pick, shuffle, randInt, uniqueDistractors } from '../utils.js';
import { shapeSVG, solid3DSVG } from '../svg.js';

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

export const MATE_MODULES_G3 = [
  {id:'division3', label:'División', open:true, key:'division3'},
  {id:'fracciones3', label:'Fracciones', open:true, key:'fracciones3'},
  {id:'geometria3', label:'Geometría 3D', open:true, key:'geometria3'},
  {id:'medicion3', label:'Medición Avanzada', open:true, key:'medicion3'},
  {id:'datos3', label:'Datos y Gráficos', open:true, key:'datos3'},
];
export const MATE_POS_G3 = [{x:22,y:90},{x:68,y:73},{x:24,y:55},{x:70,y:35},{x:24,y:14}];

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

/* ---------------- Contenido Matemática 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/3-basico):
   OA09 -> División · OA11 -> Fracciones · OA15-16 -> Geometría 3D (caras,
   vértices; se agrega pirámide y cilindro a solid3DSVG) · OA19-22 ->
   Medición Avanzada (calendario, hora con cuartos de hora, perímetro, peso
   g/kg) · OA23-26 -> Datos y Gráficos (pictogramas). */
const FRACCIONES_POOL = ['1/2','1/3','1/4','2/3','3/4'];
function fractionBarSVG(num, den){
  const width = 220, height = 48, gap = 3;
  const segWidth = (width - gap*(den-1)) / den;
  let rects = '';
  for(let i=0;i<den;i++){
    const fill = i<num ? '#12A594' : '#FFFFFF';
    rects += '<rect x="'+(i*(segWidth+gap))+'" y="0" width="'+segWidth+'" height="'+height+'" rx="4" fill="'+fill+'" stroke="#1D3557" stroke-width="2.5"/>';
  }
  return '<svg width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" xmlns="http://www.w3.org/2000/svg">'+rects+'</svg>';
}
const SOLIDOS_3D_G3 = [
  { id:'cubo', label:'CUBO', caras:6, vertices:8 },
  { id:'paralelepipedo', label:'PARALELEPÍPEDO', caras:6, vertices:8 },
  { id:'esfera', label:'ESFERA', caras:0, vertices:0 },
  { id:'cono', label:'CONO', caras:2, vertices:1 },
  { id:'cilindro', label:'CILINDRO', caras:3, vertices:0 },
  { id:'piramide', label:'PIRÁMIDE', caras:5, vertices:5 },
];
const OBJETOS_PESO = [
  { emoji:'🍎', label:'La manzana', medida:'150 g', valor:150 },
  { emoji:'📱', label:'El celular', medida:'200 g', valor:200 },
  { emoji:'📚', label:'El libro', medida:'400 g', valor:400 },
  { emoji:'🧸', label:'El peluche', medida:'250 g', valor:250 },
  { emoji:'🎒', label:'La mochila con libros', medida:'3 kg', valor:3000 },
  { emoji:'🚲', label:'La bicicleta', medida:'12 kg', valor:12000 },
];
const CALENDARIO3_HECHOS = [
  { pregunta:'¿Cuántos días tiene el mes de abril?', correcta:30, min:20, max:35, spread:4 },
  { pregunta:'¿Cuántas semanas tiene un año, aproximadamente?', correcta:52, min:10, max:60, spread:8 },
  { pregunta:'¿Cuántos meses tiene medio año?', correcta:6, min:1, max:12, spread:3 },
  { pregunta:'¿Cuántos meses del año tienen 31 días?', correcta:7, min:1, max:12, spread:4 },
];
const MINUTO_LABELS = { 0:'en punto', 15:'y cuarto', 30:'y media', 45:'y cuarenta y cinco' };

export function genDivisionRound(){
  const divisor = pick([2,5,10]);
  const cociente = randInt(2,9);
  const dividendo = divisor*cociente;
  const emoji = pick(COUNT_EMOJIS);
  const groupHTML = [];
  for(let g=0; g<cociente; g++){ groupHTML.push('<span class="mgroup">'+new Array(divisor).fill(emoji).join('')+'</span>'); }
  const opts = uniqueDistractors(cociente, 1, 20, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+groupHTML.join('')+'</p><p class="prompt-hint">'+dividendo+' repartidos en grupos de '+divisor+'. ¿Cuántos grupos hay?</p>',
    options: opts, correctValue: cociente, speakText: '¿Cuánto es '+dividendo+' dividido en '+divisor+'?', cols:4,
    explain: dividendo+' ÷ '+divisor+' = <b>'+cociente+'</b>.',
  };
}

export function genFraccionesRound(){
  const den = pick([2,3,4]);
  const num = randInt(1, den-1);
  const correct = num+'/'+den;
  const distract = shuffle(FRACCIONES_POOL.filter(function(f){ return f!==correct; })).slice(0,3);
  const opts = shuffle([correct].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<div class="shape-display">'+fractionBarSVG(num,den)+'</div><p class="prompt-hint">¿Qué fracción está sombreada?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué fracción está sombreada?', cols:4, kind:'word',
    explain: 'Hay '+num+' de '+den+' partes sombreadas: <b>'+correct+'</b>.',
  };
}

export function genGeometria3Round(){
  const item = pick(SOLIDOS_3D_G3);
  if(Math.random()<0.5){
    const distract = SOLIDOS_3D_G3.filter(function(s){ return s.id!==item.id; }).map(function(s){ return s.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(l){ return {label:l, value:l}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
      options: opts, correctValue: item.label, speakText: item.label, cols:2, kind:'word', panel:true,
      explain: 'Este cuerpo geométrico es un(a) <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const askCaras = Math.random()<0.5;
  const correct = askCaras ? item.caras : item.vertices;
  const opts = uniqueDistractors(correct, 0, 12, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Cuántas '+(askCaras?'caras':'vértices')+' tiene?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuántas '+(askCaras?'caras':'vértices')+' tiene?', cols:4,
    explain: 'El/la '+item.label.toLowerCase()+' tiene <b>'+correct+'</b> '+(askCaras?'caras':'vértices')+'.',
  };
}

function genPerimetroRound(){
  const isSquare = Math.random()<0.5;
  let perimetro, promptText;
  if(isSquare){
    const side = randInt(2,10);
    perimetro = side*4;
    promptText = 'Un cuadrado tiene lados de '+side+' cm. ¿Cuál es su perímetro?';
  }else{
    const w = randInt(2,10);
    let h = randInt(2,10);
    while(h===w) h = randInt(2,10);
    perimetro = 2*(w+h);
    promptText = 'Un rectángulo mide '+w+' cm de ancho y '+h+' cm de alto. ¿Cuál es su perímetro?';
  }
  const opts = uniqueDistractors(perimetro, 4, 200, 6, 4).map(function(v){ return {label:String(v)+' cm', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">'+promptText+'</p>',
    options: opts, correctValue: perimetro, speakText: promptText, cols:2, panel:true,
    explain: 'El perímetro correcto es <b>'+perimetro+' cm</b>.',
  };
}

function genPesoRound(){
  let a = pick(OBJETOS_PESO), b = pick(OBJETOS_PESO);
  while(b.label === a.label || b.valor === a.valor) b = pick(OBJETOS_PESO);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const heavier = a.valor>b.valor ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' pesa '+a.medida+'.<br>'+b.emoji+' '+b.label+' pesa '+b.medida+'.<br>¿Cuál pesa más?</p>',
    options: opts, correctValue: heavier.label, speakText: '¿Cuál pesa más?', cols:2, panel:true,
    explain: heavier.label+' pesa '+heavier.medida+', más que el otro objeto.',
  };
}

function genCalendario3Round(){
  const item = pick(CALENDARIO3_HECHOS);
  const opts = uniqueDistractors(item.correcta, item.min, item.max, item.spread, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
  };
}

function genHora3Round(){
  const hour = randInt(1,12);
  const minute = pick([0,15,30,45]);
  const display = String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');
  const hourOpts = uniqueDistractors(hour, 1, 12, 3, 4);
  const opts = hourOpts.map(function(h){ return {label: h+' '+MINUTO_LABELS[minute], value: h}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:40px;">'+display+'</p><p class="prompt-hint">¿Qué hora es?</p>',
    options: opts, correctValue: hour, speakText: '¿Qué hora es?', cols:2, panel:true,
    explain: 'Son las '+display+', es decir, las <b>'+hour+' '+MINUTO_LABELS[minute]+'</b>.',
  };
}

export function genMedicion3Round(){
  const roll = Math.random();
  if(roll<0.25) return genPerimetroRound();
  if(roll<0.5) return genPesoRound();
  if(roll<0.75) return genCalendario3Round();
  return genHora3Round();
}

export function genDatos3Round(){
  const CATEGORIAS_POOL = [
    {emoji:'🍎', label:'Manzanas'},{emoji:'🍌', label:'Plátanos'},{emoji:'🍇', label:'Uvas'},{emoji:'🍊', label:'Naranjas'},
  ];
  const chosen = shuffle(CATEGORIAS_POOL).slice(0,3);
  const counts = chosen.map(function(){ return randInt(1,8); });
  while(new Set(counts).size < counts.length){
    for(let i=0;i<counts.length;i++) counts[i] = randInt(1,8);
  }
  const askMax = Math.random()<0.5;
  let bestIdx = 0;
  for(let i=1;i<counts.length;i++){
    if(askMax ? counts[i]>counts[bestIdx] : counts[i]<counts[bestIdx]) bestIdx = i;
  }
  const rows = chosen.map(function(c,i){
    return '<div class="prompt-hint">'+c.emoji+' '+c.label+': '+new Array(counts[i]).fill('⬛').join('')+' ('+counts[i]+')</div>';
  }).join('');
  const opts = shuffle(chosen.map(function(c){ return {label:c.label, value:c.label}; }));
  return {
    promptHTML: rows+'<p class="prompt-hint">¿Cuál categoría tiene '+(askMax?'más':'menos')+'?</p>',
    options: opts, correctValue: chosen[bestIdx].label, speakText: '¿Cuál categoría tiene '+(askMax?'más':'menos')+'?', cols:2, kind:'word', panel:true,
    explain: chosen[bestIdx].label+' tiene '+(askMax?'más':'menos')+' cantidad ('+counts[bestIdx]+').',
  };
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

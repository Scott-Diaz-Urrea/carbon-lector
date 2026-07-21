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

export const MATE_MODULES_G4 = [
  {id:'numeros10mil4', label:'Números hasta 10.000', open:true, key:'numeros10mil4'},
  {id:'decimales4', label:'Decimales', open:true, key:'decimales4'},
  {id:'simetria4', label:'Simetría y Transformaciones', open:true, key:'simetria4'},
  {id:'areavolumen4', label:'Área y Volumen', open:true, key:'areavolumen4'},
  {id:'tiempo4', label:'Tiempo y Conversiones', open:true, key:'tiempo4'},
];
export const MATE_POS_G4 = [{x:22,y:90},{x:68,y:73},{x:24,y:55},{x:70,y:35},{x:24,y:14}];

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

/* ---------------- Contenido Matemática 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/matematica/4-basico):
   OA1 -> Números hasta 10.000 (valor posicional, comparación) ·
   OA11-12 -> Decimales (décimos, centésimos, con grillas representativas) ·
   OA17-18 -> Simetría y Transformaciones (simetría con letras, traslación/
   rotación/reflexión) · OA23-24 -> Área y Volumen (grillas de unidades
   cuadradas y cúbicas) · OA20-21 -> Tiempo y Conversiones (AM/PM, unidades
   de tiempo). Quedan fuera OA2-10,13-16,19,22,25-27 (cálculo mental,
   multiplicación/división ya cubiertas en años anteriores, patrones/álgebra,
   vistas 3D, ángulos con transportador, encuestas/experimentos aleatorios —
   no implementados aún por alcance). */
const NUMEROS_POS_NAMES = ['UNIDADES DE MIL','CENTENAS','DECENAS','UNIDADES'];
function decimalBarSVG(shaded){
  const width=200, height=44, gap=2, den=10;
  const segWidth = (width - gap*(den-1))/den;
  let rects='';
  for(let i=0;i<den;i++){
    const fill = i<shaded ? '#12A594' : '#FFFFFF';
    rects += '<rect x="'+(i*(segWidth+gap))+'" y="0" width="'+segWidth+'" height="'+height+'" fill="'+fill+'" stroke="#1D3557" stroke-width="2"/>';
  }
  return '<svg width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" xmlns="http://www.w3.org/2000/svg">'+rects+'</svg>';
}
function decimalGridSVG(shaded){
  const cell=11, gap=1;
  let cells='';
  for(let i=0;i<100;i++){
    const row = Math.floor(i/10), col = i%10;
    const fill = i<shaded ? '#12A594' : '#FFFFFF';
    cells += '<rect x="'+(col*(cell+gap))+'" y="'+(row*(cell+gap))+'" width="'+cell+'" height="'+cell+'" fill="'+fill+'" stroke="#CBD5E1" stroke-width="0.6"/>';
  }
  const size = 10*(cell+gap);
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" xmlns="http://www.w3.org/2000/svg">'+cells+'</svg>';
}
function areaGridSVG(rows, cols){
  const cell=18, gap=2;
  let cells='';
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      cells += '<rect x="'+(c*(cell+gap))+'" y="'+(r*(cell+gap))+'" width="'+cell+'" height="'+cell+'" rx="2" fill="#7C6FF0" stroke="#1D3557" stroke-width="1.5"/>';
    }
  }
  const w = cols*(cell+gap), h = rows*(cell+gap);
  return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg">'+cells+'</svg>';
}
const SIMETRIA_LETRAS = [
  {letra:'A', simetrica:true},{letra:'H', simetrica:true},{letra:'M', simetrica:true},
  {letra:'T', simetrica:true},{letra:'U', simetrica:true},{letra:'W', simetrica:true},
  {letra:'F', simetrica:false},{letra:'G', simetrica:false},{letra:'J', simetrica:false},
  {letra:'L', simetrica:false},{letra:'N', simetrica:false},{letra:'P', simetrica:false},
];
const TRANSFORMACIONES_BANK = [
  { pregunta:'Si mueves una figura de un lugar a otro sin girarla ni voltearla, ¿qué transformación es?', correcta:'TRASLACIÓN', opts:['ROTACIÓN','REFLEXIÓN','AMPLIACIÓN'] },
  { pregunta:'Si giras una figura sobre un punto fijo, ¿qué transformación es?', correcta:'ROTACIÓN', opts:['TRASLACIÓN','REFLEXIÓN','REDUCCIÓN'] },
  { pregunta:'Si volteas una figura como si la reflejaras en un espejo, ¿qué transformación es?', correcta:'REFLEXIÓN', opts:['TRASLACIÓN','ROTACIÓN','AMPLIACIÓN'] },
];
const CONVERSIONES_TIEMPO_BANK = [
  { pregunta:'¿Cuántos minutos tiene una hora?', correcta:60, min:1, max:100, spread:15 },
  { pregunta:'¿Cuántos segundos tiene un minuto?', correcta:60, min:1, max:100, spread:15 },
  { pregunta:'¿Cuántas horas tiene un día?', correcta:24, min:1, max:40, spread:6 },
];

export function genNumeros10mil4Round(){
  if(Math.random()<0.5){
    const num = randInt(1000,9999);
    const s = String(num);
    const posIdx = randInt(0,3);
    const digitValue = Number(s[posIdx]);
    const opts = uniqueDistractors(digitValue,0,9,3,4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:34px;">'+num+'</p><p class="prompt-hint">¿Qué dígito está en las '+NUMEROS_POS_NAMES[posIdx].toLowerCase()+'?</p>',
      options: opts, correctValue: digitValue, speakText: '¿Qué dígito está en las '+NUMEROS_POS_NAMES[posIdx]+'?', cols:4,
      explain: 'En el número '+num+', el dígito de las '+NUMEROS_POS_NAMES[posIdx].toLowerCase()+' es <b>'+digitValue+'</b>.',
    };
  }
  const a = randInt(1000,9999);
  let b = randInt(1000,9999);
  while(b===a) b = randInt(1000,9999);
  const opts = shuffle([{label:String(a), value:a},{label:String(b), value:b}]);
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál número es mayor?</p>',
    options: opts, correctValue: Math.max(a,b), speakText: '¿Cuál número es mayor?', cols:2, panel:true,
    explain: Math.max(a,b)+' es mayor que '+Math.min(a,b)+'.',
  };
}

export function genDecimales4Round(){
  if(Math.random()<0.5){
    const shaded = randInt(1,9);
    const decimal = '0.'+shaded;
    const distract = uniqueDistractors(shaded,1,9,3,4).filter(function(v){ return v!==shaded; }).map(function(v){ return '0.'+v; });
    const opts = shuffle([decimal].concat(distract.slice(0,3))).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: '<div class="shape-display">'+decimalBarSVG(shaded)+'</div><p class="prompt-hint">¿Qué número decimal representa la parte sombreada?</p>',
      options: opts, correctValue: decimal, speakText: '¿Qué decimal representa la parte sombreada?', cols:4, kind:'word',
      explain: shaded+' de 10 partes sombreadas es <b>'+decimal+'</b> (décimos).',
    };
  }
  const shaded = randInt(5,95);
  const decimal = '0.'+String(shaded).padStart(2,'0');
  const distractVals = uniqueDistractors(shaded,1,99,20,4).filter(function(v){ return v!==shaded; });
  const distract = distractVals.slice(0,3).map(function(v){ return '0.'+String(v).padStart(2,'0'); });
  const opts = shuffle([decimal].concat(distract)).map(function(d){ return {label:d, value:d}; });
  return {
    promptHTML: '<div class="shape-display">'+decimalGridSVG(shaded)+'</div><p class="prompt-hint">¿Qué número decimal representa la parte sombreada?</p>',
    options: opts, correctValue: decimal, speakText: '¿Qué decimal representa la parte sombreada?', cols:2, kind:'word', panel:true,
    explain: shaded+' de 100 partes sombreadas es <b>'+decimal+'</b> (centésimos).',
  };
}

export function genSimetria4Round(){
  if(Math.random()<0.5){
    const item = pick(SIMETRIA_LETRAS);
    const opts = shuffle([{label:'TIENE SIMETRÍA', value:true},{label:'NO TIENE SIMETRÍA', value:false}]);
    return {
      promptHTML: '<p class="prompt-count" style="font-size:60px;">'+item.letra+'</p><p class="prompt-hint">¿Esta letra tiene una línea de simetría vertical (se puede doblar por la mitad en dos partes iguales)?</p>',
      options: opts, correctValue: item.simetrica, speakText: 'La letra '+item.letra, cols:2, panel:true,
      explain: item.simetrica ? 'La letra '+item.letra+' <b>sí tiene simetría</b> vertical.' : 'La letra '+item.letra+' <b>no tiene simetría</b> vertical.',
    };
  }
  const item = pick(TRANSFORMACIONES_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genAreaVolumen4Round(){
  if(Math.random()<0.5){
    const rows = randInt(2,6), cols = randInt(2,6);
    const area = rows*cols;
    const opts = uniqueDistractors(area,4,36,6,4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<div class="shape-display">'+areaGridSVG(rows,cols)+'</div><p class="prompt-hint">¿Cuál es el área de este rectángulo, en unidades cuadradas?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área de este rectángulo?', cols:4,
      explain: rows+' filas × '+cols+' columnas = <b>'+area+'</b> unidades cuadradas.',
    };
  }
  const rows = randInt(2,4), cols = randInt(2,4), layers = randInt(2,3);
  const volumen = rows*cols*layers;
  const gridsHTML = new Array(layers).fill(areaGridSVG(rows,cols)).join('<span style="display:inline-block;width:8px;"></span>');
  const opts = uniqueDistractors(volumen,4,48,8,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<div class="shape-display" style="display:flex;justify-content:center;">'+gridsHTML+'</div><p class="prompt-hint">Esta caja tiene '+layers+' capas iguales. ¿Cuántos cubos caben en total?</p>',
    options: opts, correctValue: volumen, speakText: 'Esta caja tiene '+layers+' capas iguales. ¿Cuántos cubos caben en total?', cols:4,
    explain: rows+' × '+cols+' × '+layers+' capas = <b>'+volumen+'</b> cubos en total.',
  };
}

export function genTiempo4Round(){
  if(Math.random()<0.5){
    const hour = randInt(1,12);
    const isPM = Math.random()<0.5;
    const display = String(hour).padStart(2,'0')+':00 '+(isPM ? 'PM' : 'AM');
    const correct = isPM ? 'DE LA TARDE O NOCHE' : 'DE LA MAÑANA';
    const opts = shuffle([{label:'DE LA MAÑANA', value:'DE LA MAÑANA'},{label:'DE LA TARDE O NOCHE', value:'DE LA TARDE O NOCHE'}]);
    return {
      promptHTML: '<p class="prompt-count" style="font-size:34px;">'+display+'</p><p class="prompt-hint">¿A qué momento del día corresponde esta hora?</p>',
      options: opts, correctValue: correct, speakText: '¿A qué momento del día corresponde '+display+'?', cols:2, panel:true,
      explain: display+' es '+correct.toLowerCase()+'.',
    };
  }
  const item = pick(CONVERSIONES_TIEMPO_BANK);
  const opts = uniqueDistractors(item.correcta, item.min, item.max, item.spread, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
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

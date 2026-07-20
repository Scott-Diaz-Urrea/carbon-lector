import { pick, shuffle, randInt, uniqueDistractors } from '../utils.js';
import { shapeSVG } from '../svg.js';

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
  {id:'geometria2', label:'Geometría', open:false, key:null},
  {id:'medicion2', label:'Medición', open:false, key:null},
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

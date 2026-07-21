import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';
import { shapeSVG, solid3DSVG } from '../../svg.js';
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
  { atributo:'la cantidad de patas', items:[{emoji:'🐦',val:'dos patas'},{emoji:'🐔',val:'dos patas'},{emoji:'🧑',val:'dos patas'},{emoji:'🐕',val:'cuatro patas'}] },
  { atributo:'el tipo de alimento', items:[{emoji:'🍎',val:'fruta'},{emoji:'🍌',val:'fruta'},{emoji:'🍇',val:'fruta'},{emoji:'🥕',val:'verdura'}] },
];

const POSICION_ESCENAS = [
  { emoji:'🐦', texto:'El pajarito está ___ de su nido.', correct:'DENTRO' },
  { emoji:'🐟', texto:'El pez nada ___ del agua.', correct:'DENTRO' },
  { emoji:'☁️', texto:'La nube está ___ en el cielo.', correct:'ARRIBA' },
  { emoji:'🪱', texto:'El gusano está ___ de la tierra.', correct:'ABAJO' },
  { emoji:'🐿️', texto:'La ardilla salió ___ de su casa a jugar.', correct:'FUERA' },
  { emoji:'🧸', texto:'El osito está ___ de las dos almohadas.', correct:'ENTRE' },
  { emoji:'🎈', texto:'El globo voló ___ hacia el cielo.', correct:'ARRIBA' },
  { emoji:'🐇', texto:'El conejo se escondió ___ de la cueva.', correct:'DENTRO' },
];
const POSICION_OPTS_POOL = ['ARRIBA','ABAJO','DENTRO','FUERA','ENTRE'];

const RUTINA_DIA_PARV = [
  { emoji:'☀️', label:'Despertar', orden:1 },
  { emoji:'🪥', label:'Lavarse los dientes', orden:2 },
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
  };
}

export function genClasificarRound(){
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
  };
}

export function genPosicionRound(){
  const item = pick(POSICION_ESCENAS);
  const distract = shuffle(POSICION_OPTS_POOL.filter(function(p){ return p!==item.correct; })).slice(0,3);
  const opts = shuffle([item.correct].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto.replace('___','<span class="blank">___</span>')+'</p>',
    options: opts, correctValue: item.correct, speakText: item.texto.replace('___',''), cols:4, kind:'word',
    explain: 'La palabra correcta es <b>'+item.correct+'</b>.',
  };
}

export function genCuantificadoresRound(){
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
  };
}

export function genSecuenciaTemporalRound(){
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
  };
}

export function genContarVeinteRound(){
  const emoji = pick(CUANT_EMOJIS);
  const n = randInt(10,20);
  const visual = new Array(n).fill(emoji).join(' ');
  const opts = uniqueDistractors(n,1,20,3,4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count" style="font-size:20px;">'+visual+'</p><p class="prompt-hint">¿Cuántos hay?</p>',
    options: opts, correctValue: n, speakText: '¿Cuántos hay?', cols:4,
    explain: 'Si cuentas uno por uno, hay <b>'+n+'</b> en total.',
  };
}

export function genSumarQuitarRound(){
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
  };
}

export function genFormasCuerposRound(){
  if(Math.random()<0.5){
    const item = pick(SOLIDOS_3D);
    const distract = shuffle(SOLIDOS_3D.filter(function(s){ return s.id!==item.id; })).map(function(s){ return s.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(l){ return {label:l, value:l}; });
    return {
      promptHTML: '<div class="shape-display">'+solid3DSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué cuerpo geométrico es?</p>',
      options: opts, correctValue: item.label, speakText: item.label, cols:4, kind:'word',
      explain: 'Esta figura es un(a) <b>'+item.label.toLowerCase()+'</b>, un cuerpo geométrico 3D.',
    };
  }
  const item = pick(SHAPES);
  const distract = shuffle(SHAPES.filter(function(s){ return s.id!==item.id; })).slice(0,3);
  const opts = shuffle([item].concat(distract)).map(function(s){ return {label:s.label, value:s.id}; });
  return {
    promptHTML: '<div class="shape-display">'+shapeSVG(item.id,110)+'</div><p class="prompt-hint">¿Qué forma es?</p>',
    options: opts, correctValue: item.id, speakText: item.label, cols:4, kind:'word',
    explain: 'Esta figura es un <b>'+item.label+'</b>, una figura plana 2D.',
  };
}

export function genMedirRound(){
  let a = pick(MEDIR_OBJETOS), b = pick(MEDIR_OBJETOS);
  while(b.label === a.label || b.unidades === a.unidades) b = pick(MEDIR_OBJETOS);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const longer = a.unidades>b.unidades ? a : b;
  return {
    promptHTML: '<p class="prompt-hint">'+a.emoji+' '+a.label+' mide '+a.unidades+' cubos.<br>'+b.emoji+' '+b.label+' mide '+b.unidades+' cubos.<br>¿Cuál es más largo?</p>',
    options: opts, correctValue: longer.label, speakText: '¿Cuál es más largo?', cols:2, panel:true,
    explain: longer.label+' mide '+longer.unidades+' cubos, más que el otro objeto.',
  };
}

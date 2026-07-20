import { pick, shuffle } from '../utils.js';

export const TECNOLOGIA_MODULES = [
  {id:'herramientastec', label:'Herramientas y Materiales', open:true, key:'herramientastec'},
];
export const TECNOLOGIA_POS = [{x:48,y:50}];

/* ---------------- Contenido Tecnología 1° Básico ----------------
   OA02-03 -> Herramientas y Materiales. OA01,04,05,06 (diseño propio, evaluación
   de resultados, uso de software real) quedaron fuera por ser procesos prácticos
   que no se resuelven con una pregunta de opción múltiple. */
const HERRAMIENTAS_TEC = [
  { emoji:'✂️', label:'TIJERA', uso:'Sirve para cortar papel, cartón o telas.' },
  { emoji:'📏', label:'REGLA', uso:'Sirve para medir y trazar líneas rectas.' },
  { emoji:'🧴', label:'PEGAMENTO', uso:'Sirve para unir y pegar materiales.' },
  { emoji:'🖊️', label:'LÁPIZ O PLUMÓN', uso:'Sirve para marcar o dibujar sobre el material.' },
  { emoji:'🧵', label:'HILO Y AGUJA', uso:'Sirve para coser o unir telas.' },
  { emoji:'🔨', label:'MARTILLO', uso:'Sirve para clavar o unir piezas de madera.' },
];
const MATERIALES_TEC = [
  { emoji:'📄', label:'PAPEL', uso:'Material liviano que se usa para dibujar, doblar o recortar.' },
  { emoji:'🧻', label:'CARTÓN', uso:'Material firme, útil para construir maquetas y cajas.' },
  { emoji:'🧶', label:'FIBRAS O LANA', uso:'Material que sirve para tejer o decorar.' },
  { emoji:'♻️', label:'MATERIAL DE RECICLAJE', uso:'Botellas, tapas o cajas que se reutilizan para crear objetos nuevos.' },
];

export function genHerramientasTecRound(){
  if(Math.random()<0.5){
    const item = pick(HERRAMIENTAS_TEC);
    const distract = shuffle(HERRAMIENTAS_TEC.filter(function(h){ return h.label!==item.label; })).slice(0,3).map(function(h){ return h.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
      options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
      explain: item.uso+' Esa herramienta es <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const item = pick(MATERIALES_TEC);
  const distract = shuffle(MATERIALES_TEC.filter(function(m){ return m.label!==item.label; })).map(function(m){ return m.label; });
  const opts = shuffle([item.label].concat(distract)).map(function(m){ return {label:m, value:m}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
    options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
    explain: item.uso+' Ese material es <b>'+item.label.toLowerCase()+'</b>.',
  };
}

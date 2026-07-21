import { pick, shuffle } from '../utils.js';
import { colorSwatchSVG, lineTypeSVG } from '../svg.js';

export const ARTES_MODULES = [
  {id:'colores', label:'Colores', open:true, key:'colores'},
  {id:'lineastexturas', label:'Líneas y Texturas', open:true, key:'lineastexturas'},
  {id:'materialesarte', label:'Materiales de Arte', open:true, key:'materialesarte'},
];
export const ARTES_POS = [{x:24,y:80},{x:70,y:50},{x:24,y:20}];

/* ---------------- Contenido Artes Visuales 1° Básico ----------------
   OA02 -> Colores, Líneas y Texturas · OA01,03 -> Materiales de Arte.
   OA04-05 (apreciación y opinión personal sobre obras) quedaron fuera por ser
   inherentemente subjetivas y no aptas para el motor de opción múltiple. */
const COLORES_ITEMS = [
  { label:'ROJO', tipo:'CÁLIDO' },
  { label:'NARANJO', tipo:'CÁLIDO' },
  { label:'AMARILLO', tipo:'CÁLIDO' },
  { label:'AZUL', tipo:'FRÍO' },
  { label:'VERDE', tipo:'FRÍO' },
  { label:'MORADO', tipo:'FRÍO' },
];
const MEZCLAS_COLOR = [
  { a:'ROJO', b:'AMARILLO', result:'NARANJO' },
  { a:'AZUL', b:'AMARILLO', result:'VERDE' },
  { a:'ROJO', b:'AZUL', result:'MORADO' },
  { a:'ROJO', b:'BLANCO', result:'ROSADO' },
];
const LINEAS_ITEMS = [
  { emoji:'➖', desc:'Una línea que va derecho, sin curvas.', label:'RECTA' },
  { emoji:'📏', desc:'El borde de una regla es un ejemplo de esta línea.', label:'RECTA' },
  { emoji:'〰️', desc:'Una línea que sube y baja como las olas del mar.', label:'ONDULADA' },
  { emoji:'🐍', desc:'El cuerpo de una serpiente se mueve dibujando esta línea.', label:'ONDULADA' },
  { emoji:'✏️', desc:'Una línea muy fina y delgadita.', label:'DELGADA' },
  { emoji:'🧵', desc:'Un hilo dibuja una línea así de fina.', label:'DELGADA' },
  { emoji:'🖍️', desc:'Una línea ancha y bien marcada.', label:'GRUESA' },
  { emoji:'🖊️', desc:'Un plumón grueso deja una línea así de marcada.', label:'GRUESA' },
];
const TEXTURAS_ITEMS = [
  { emoji:'🪨', label:'ÁSPERA', desc:'Una piedra se siente así al tocarla: dura y con relieve.' },
  { emoji:'🧱', label:'ÁSPERA', desc:'Un ladrillo sin pulir se siente así: dura y con relieve.' },
  { emoji:'🧊', label:'LISA', desc:'Un vidrio o un hielo se sienten así: parejos, sin relieve.' },
  { emoji:'🪞', label:'LISA', desc:'Un espejo se siente así al tocarlo: parejo, sin relieve.' },
  { emoji:'🧶', label:'SUAVE', desc:'La lana o un peluche se sienten así: agradables y delicados.' },
  { emoji:'☁️', label:'SUAVE', desc:'Una almohada de plumas se siente así: agradable y delicada.' },
  { emoji:'🌵', label:'RUGOSA', desc:'La corteza de un árbol o un cactus se sienten así: con relieve.' },
  { emoji:'🍍', label:'RUGOSA', desc:'La cáscara de una piña se siente así: con relieve.' },
];
const HERRAMIENTAS_ARTE = [
  { emoji:'🖌️', label:'PINCEL', uso:'Sirve para pintar con témpera o acuarela.' },
  { emoji:'✂️', label:'TIJERA', uso:'Sirve para cortar papel y otros materiales.' },
  { emoji:'✏️', label:'LÁPIZ', uso:'Sirve para dibujar y hacer bocetos.' },
  { emoji:'🧵', label:'HILO', uso:'Sirve para unir telas o hacer manualidades.' },
  { emoji:'🖍️', label:'PLASTICINA', uso:'Sirve para modelar figuras con las manos.' },
  { emoji:'🧴', label:'PEGAMENTO', uso:'Sirve para unir papeles y materiales de collage.' },
];

/* ---------------- Contenido Artes Visuales 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/2-basico): AR02 OA02 -> Líneas y Colores
   (línea vertical/horizontal/diagonal/espiral/quebrada; color primario y
   secundario). Quedan fuera AR02 OA01,03 (expresar/crear obras propias,
   producción) y OA04-05 (comunicar impresiones/preferencias, subjetivo). */
export const ARTES_MODULES_G2 = [
  {id:'lineascolores2', label:'Líneas y Colores', open:true, key:'lineascolores2'},
];
export const ARTES_POS_G2 = [{x:50,y:50}];

/* ---------------- Contenido Artes Visuales 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/4-basico): AR04 OA02 -> Forma y Color IV
   (figurativa/no figurativa, tono/matiz). Fuera OA01,03 (producción propia)
   y OA04-05 (opinión personal, subjetivo). */
export const ARTES_MODULES_G4 = [
  {id:'formacolor4', label:'Forma y Color IV', open:true, key:'formacolor4'},
];
export const ARTES_POS_G4 = [{x:50,y:50}];

const FORMA_FIGURATIVA_BANK = [
  { desc:'Un dibujo que muestra claramente un perro reconocible', tipo:'FIGURATIVA' },
  { desc:'Un dibujo que muestra la cara de una persona reconocible', tipo:'FIGURATIVA' },
  { desc:'Una pintura con solo formas y colores, sin representar algo real', tipo:'NO FIGURATIVA' },
  { desc:'Un cuadro con líneas y manchas de color sin figuras reconocibles', tipo:'NO FIGURATIVA' },
];
const TONO_MATIZ_BANK = [
  { pregunta:'Si mezclas rojo con blanco y obtienes un rosado más claro, ¿qué cambiaste?', correcta:'EL TONO', opts:['EL MATIZ','LA TEXTURA','LA FORMA'] },
  { pregunta:'El nombre básico de un color, como "azul" o "amarillo", ¿cómo se llama?', correcta:'MATIZ', opts:['TONO','TEXTURA','FORMA'] },
];

export function genFormaColor4Round(){
  if(Math.random()<0.5){
    const item = pick(FORMA_FIGURATIVA_BANK);
    const opts = shuffle([{label:'FIGURATIVA', value:'FIGURATIVA'},{label:'NO FIGURATIVA', value:'NO FIGURATIVA'}]);
    return {
      promptHTML: '<p class="prompt-hint">'+item.desc+'. ¿Es una obra figurativa o no figurativa?</p>',
      options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, panel:true,
      explain: 'Esa obra es <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(TONO_MATIZ_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:4, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

const LINEAS_G2_BANK = ['VERTICAL','HORIZONTAL','DIAGONAL','ESPIRAL','QUEBRADA'];
const COLORES_PRIM_SEC = [
  { label:'ROJO', tipo:'PRIMARIO' },
  { label:'AZUL', tipo:'PRIMARIO' },
  { label:'AMARILLO', tipo:'PRIMARIO' },
  { label:'VERDE', tipo:'SECUNDARIO' },
  { label:'NARANJO', tipo:'SECUNDARIO' },
  { label:'MORADO', tipo:'SECUNDARIO' },
];

export function genLineasColores2Round(){
  if(Math.random()<0.5){
    const tipo = pick(LINEAS_G2_BANK);
    const distract = shuffle(LINEAS_G2_BANK.filter(function(t){ return t!==tipo; })).slice(0,3);
    const opts = shuffle([tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<div class="shape-display">'+lineTypeSVG(tipo,100)+'</div><p class="prompt-hint">¿Qué tipo de línea es?</p>',
      options: opts, correctValue: tipo, speakText: '¿Qué tipo de línea es?', cols:4, kind:'word',
      explain: 'Esa es una línea <b>'+tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(COLORES_PRIM_SEC);
  const opts = shuffle([{label:'PRIMARIO', value:'PRIMARIO'},{label:'SECUNDARIO', value:'SECUNDARIO'}]);
  return {
    promptHTML: '<div class="shape-display">'+colorSwatchSVG(item.label,90)+'</div><p class="prompt-hint">El color '+item.label+'. ¿Es un color primario o secundario?</p>',
    options: opts, correctValue: item.tipo, speakText: 'El color '+item.label, cols:2, panel:true,
    explain: 'El '+item.label.toLowerCase()+' es un color <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genColoresRound(){
  if(Math.random()<0.5){
    const item = pick(COLORES_ITEMS);
    const opts = shuffle([{label:'CÁLIDO', value:'CÁLIDO'},{label:'FRÍO', value:'FRÍO'}]);
    const visual = '<div class="shape-display">'+colorSwatchSVG(item.label, 90)+'</div>';
    return {
      promptHTML: visual+'<p class="prompt-hint">El color '+item.label+'. ¿Es un color cálido o frío?</p>',
      options: opts, correctValue: item.tipo, speakText: 'El color '+item.label, cols:2, panel:true,
      explain: 'El '+item.label.toLowerCase()+' es un color <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(MEZCLAS_COLOR);
  const distract = shuffle(['NARANJO','VERDE','MORADO','ROSADO'].filter(function(c){ return c!==item.result; })).slice(0,3);
  const opts = shuffle([item.result].concat(distract)).map(function(c){ return {label:c, value:c}; });
  const visual = '<div class="mix-row">'+
    '<div class="mix-swatch">'+colorSwatchSVG(item.a,60)+'<span>'+item.a+'</span></div>'+
    '<span class="mix-plus">+</span>'+
    '<div class="mix-swatch">'+colorSwatchSVG(item.b,60)+'<span>'+item.b+'</span></div>'+
  '</div>';
  return {
    promptHTML: visual+'<p class="prompt-hint">¿Qué color se forma al mezclarlos?</p>',
    options: opts, correctValue: item.result, speakText: '¿Qué color se forma al mezclar '+item.a+' con '+item.b+'?', cols:4, kind:'word',
    explain: 'Mezclar '+item.a.toLowerCase()+' con '+item.b.toLowerCase()+' forma el color <b>'+item.result.toLowerCase()+'</b>.',
  };
}

export function genLineasTexturasRound(){
  if(Math.random()<0.5){
    const item = pick(LINEAS_ITEMS);
    const lineaPool = LINEAS_ITEMS.map(function(l){ return l.label; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
    const distract = shuffle(lineaPool.filter(function(l){ return l!==item.label; }));
    const opts = shuffle([item.label].concat(distract)).map(function(l){ return {label:l, value:l}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+' ¿Qué tipo de línea es?</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es una línea <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const item = pick(TEXTURAS_ITEMS);
  const texturaPool = TEXTURAS_ITEMS.map(function(t){ return t.label; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  const distract = shuffle(texturaPool.filter(function(t){ return t!==item.label; }));
  const opts = shuffle([item.label].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+' ¿Qué textura es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa es una textura <b>'+item.label.toLowerCase()+'</b>.',
  };
}

export function genMaterialesArteRound(){
  const item = pick(HERRAMIENTAS_ARTE);
  const distract = shuffle(HERRAMIENTAS_ARTE.filter(function(h){ return h.label!==item.label; })).slice(0,3).map(function(h){ return h.label; });
  const opts = shuffle([item.label].concat(distract)).map(function(h){ return {label:h, value:h}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
    options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
    explain: item.uso+' Esa herramienta es <b>'+item.label.toLowerCase()+'</b>.',
  };
}

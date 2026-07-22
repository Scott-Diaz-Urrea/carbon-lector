import { pick, shuffle } from '../utils.js';
import { colorSwatchSVG, lineTypeSVG, piedraSVG, espejoSVG, plasticinaSVG, shapeSVG } from '../svg.js';

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
/* Ampliado de 6 a 8 ítems: combinado con MEZCLAS_COLOR (4) sumaba 10
   combinaciones únicas para rounds:10 — sin margen (riesgo mínimo pero
   real de repetición, ver mcEngine.js). CELESTE y ROSADO son colores
   pastel de uso común en la sala de clases, con la misma clasificación
   cálido/frío intuitiva que el resto del banco. */
const COLORES_ITEMS = [
  { label:'ROJO', tipo:'CÁLIDO' },
  { label:'NARANJO', tipo:'CÁLIDO' },
  { label:'AMARILLO', tipo:'CÁLIDO' },
  { label:'ROSADO', tipo:'CÁLIDO' },
  { label:'AZUL', tipo:'FRÍO' },
  { label:'VERDE', tipo:'FRÍO' },
  { label:'MORADO', tipo:'FRÍO' },
  { label:'CELESTE', tipo:'FRÍO' },
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
/* 🪨/🪞 crudos no se renderizan en varios navegadores (mismo problema ya
   resuelto en otros archivos) — se reusan piedraSVG()/espejoSVG() aquí
   también, en vez de repetir el emoji sin soporte. */
const TEXTURAS_ITEMS = [
  { emoji: piedraSVG(30), label:'ÁSPERA', desc:'Una piedra se siente así al tocarla: dura y con relieve.' },
  { emoji:'🧱', label:'ÁSPERA', desc:'Un ladrillo sin pulir se siente así: dura y con relieve.' },
  { emoji:'🧊', label:'LISA', desc:'Un vidrio o un hielo se sienten así: parejos, sin relieve.' },
  { emoji: espejoSVG(30), label:'LISA', desc:'Un espejo se siente así al tocarlo: parejo, sin relieve.' },
  { emoji:'🧶', label:'SUAVE', desc:'La lana o un peluche se sienten así: agradables y delicados.' },
  { emoji:'☁️', label:'SUAVE', desc:'Una almohada de plumas se siente así: agradable y delicada.' },
  { emoji:'🌵', label:'RUGOSA', desc:'La corteza de un árbol o un cactus se sienten así: con relieve.' },
  { emoji:'🍍', label:'RUGOSA', desc:'La cáscara de una piña se siente así: con relieve.' },
];
/* "PLASTICINA" usaba 🖍️ (un crayón, una herramienta de dibujo, no una masa
   moldeable) → plasticinaSVG(), el mismo helper que corrige el mismo error
   en Ciencias Naturales (ver ciencias.js). */
const HERRAMIENTAS_ARTE = [
  { emoji:'🖌️', label:'PINCEL', uso:'Sirve para pintar con témpera o acuarela.' },
  { emoji:'✂️', label:'TIJERA', uso:'Sirve para cortar papel y otros materiales.' },
  { emoji:'✏️', label:'LÁPIZ', uso:'Sirve para dibujar y hacer bocetos.' },
  { emoji:'🧵', label:'HILO', uso:'Sirve para unir telas o hacer manualidades.' },
  { emoji: plasticinaSVG(30), label:'PLASTICINA', uso:'Sirve para modelar figuras con las manos.' },
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

/* ---------------- Contenido Artes Visuales 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/3-basico):
   Color Expresivo -> OA02 (color frío/cálido/expresivo — qué transmite
   cada color, una idea ampliamente usada en la enseñanza de artes).
   Materiales de Modelado, Reciclaje y Naturales -> OA03 (categorías de
   materiales, no el proceso de crear con ellos).
   Quedan fuera: OA01 (crear un trabajo propio a partir de observación),
   OA04 (describir Y EXPRESAR lo que siente/piensa frente a una obra —
   subjetivo) y OA05 (autoevaluación de fortalezas propias) — todos de
   producción propia o apreciación subjetiva, no de reconocimiento con
   respuesta objetiva. */
export const ARTES_MODULES_G3 = [
  {id:'colorexpresivo3', label:'Color Expresivo', open:true, key:'colorexpresivo3'},
  {id:'materialesarte3', label:'Materiales de Modelado y Reciclaje', open:true, key:'materialesarte3'},
];
export const ARTES_POS_G3 = [{x:30,y:70},{x:70,y:30}];

/* La asociación color-emoción es una convención ampliamente enseñada en
   educación artística (no una verdad científica única), consistente con
   el nivel de abstracción esperado para 3° básico. */
const COLOR_EXPRESIVO_BANK = [
  { color:'ROJO', emocion:'ENERGÍA O PASIÓN' },
  { color:'AZUL', emocion:'CALMA O TRANQUILIDAD' },
  { color:'AMARILLO', emocion:'ALEGRÍA' },
  { color:'NEGRO', emocion:'MISTERIO O SERIEDAD' },
  { color:'VERDE', emocion:'NATURALEZA O FRESCURA' },
  { color:'NARANJO', emocion:'ENTUSIASMO' },
  { color:'ROSADO', emocion:'TERNURA' },
  { color:'MORADO', emocion:'CREATIVIDAD' },
];
const MATERIALES_ARTE3_BANK = [
  { emoji:'🏺', material:'la arcilla', categoria:'MATERIAL DE MODELADO' },
  { emoji:'🧶', material:'la plasticina', categoria:'MATERIAL DE MODELADO' },
  { emoji:'📦', material:'una caja de cartón usada', categoria:'MATERIAL DE RECICLAJE' },
  { emoji:'🥤', material:'una botella de plástico usada', categoria:'MATERIAL DE RECICLAJE' },
  { emoji:'🥫', material:'una lata de bebida usada', categoria:'MATERIAL DE RECICLAJE' },
  { emoji:'🍃', material:'las hojas secas', categoria:'MATERIAL NATURAL' },
  { emoji:'🌰', material:'las semillas', categoria:'MATERIAL NATURAL' },
  { emoji:'🪵', material:'las ramitas', categoria:'MATERIAL NATURAL' },
];

export function genColorExpresivo3Round(){
  const item = pick(COLOR_EXPRESIVO_BANK);
  const distract = shuffle(COLOR_EXPRESIVO_BANK.filter(function(c){ return c.color!==item.color; })).slice(0,3).map(function(c){ return c.emocion; });
  const opts = shuffle([item.emocion].concat(distract)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<div class="shape-display">'+colorSwatchSVG(item.color,90)+'</div><p class="prompt-hint">El color '+item.color+'. ¿Qué sensación transmite generalmente en una obra de arte?</p>',
    options: opts, correctValue: item.emocion, speakText: 'El color '+item.color, cols:2, panel:true,
    explain: 'El '+item.color.toLowerCase()+' suele transmitir <b>'+item.emocion.toLowerCase()+'</b>.',
  };
}

export function genMaterialesArte3Round(){
  const item = pick(MATERIALES_ARTE3_BANK);
  const distract = shuffle(MATERIALES_ARTE3_BANK.filter(function(m){ return m.categoria!==item.categoria; })).map(function(m){ return m.categoria; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  const opts = shuffle([item.categoria].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿A qué categoría pertenece '+item.material+'?</p>',
    options: opts, correctValue: item.categoria, speakText: '¿A qué categoría pertenece '+item.material+'?', cols:2, kind:'word', panel:true,
    explain: (item.material.charAt(0).toUpperCase()+item.material.slice(1))+' es un <b>'+item.categoria.toLowerCase()+'</b>.',
  };
}

/* ---------------- Contenido Artes Visuales 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/4-basico):
   Lenguaje Visual II -> OA02 (línea de contorno, tono y matiz de un color,
   forma figurativa y no figurativa — conceptos nuevos respecto a 3° básico,
   que cubrió color cálido/frío/expresivo y categorías de material).
   Quedan fuera: OA01,03 (crear un trabajo propio a partir de observación,
   con materiales de modelado/reciclaje/naturales — producción propia, ya
   cubierto conceptualmente por "Materiales de Modelado y Reciclaje" de 3°
   básico), OA04 (describir Y expresar lo que se siente frente a una obra —
   subjetivo) y OA05 (autoevaluación de fortalezas propias). */
export const ARTES_MODULES_G4 = [
  {id:'lenguajevisual4', label:'Lenguaje Visual II', open:true, key:'lenguajevisual4'},
];
export const ARTES_POS_G4 = [{x:50,y:50}];

const LENGUAJE_VISUAL4_BANK = [
  { pregunta:'¿Qué es una línea de contorno en un dibujo?', correcta:'La línea que marca el borde o silueta de una figura', opts:['El color de fondo del dibujo','La textura de la superficie','El título de la obra'] },
  { pregunta:'¿Para qué sirve la línea de contorno al dibujar un objeto?', correcta:'Para definir claramente su forma y separarlo del fondo', opts:['Para llenar todo el espacio de color','Para borrar el dibujo','Para escribir el nombre del autor'] },
  { pregunta:'Si agregas blanco a un color para aclararlo, ¿qué estás cambiando?', correcta:'SU TONO', opts:['SU FORMA','SU TEXTURA','SU TAMAÑO'] },
  { pregunta:'Si oscureces un color agregándole negro, ¿qué estás cambiando?', correcta:'SU TONO', opts:['SU FORMA','SU TEXTURA','SU TAMAÑO'] },
  { pregunta:'¿Qué es el "matiz" de un color?', correcta:'La variación específica de ese color (como un rojo más anaranjado o más violeta)', opts:['El tamaño del dibujo','La textura de la pintura','El nombre del artista'] },
  { pregunta:'Un dibujo de un gato bien reconocible, con orejas, bigotes y cola, es una forma...', correcta:'FIGURATIVA', opts:['NO FIGURATIVA (ABSTRACTA)','TRANSPARENTE','SIMÉTRICA'] },
  { pregunta:'Una mancha de pintura sin forma reconocible es una forma...', correcta:'NO FIGURATIVA (ABSTRACTA)', opts:['FIGURATIVA','TRANSPARENTE','SIMÉTRICA'] },
  { pregunta:'Un dibujo de una casa con techo, puerta y ventanas es una forma...', correcta:'FIGURATIVA', opts:['NO FIGURATIVA (ABSTRACTA)','TRANSPARENTE','SIMÉTRICA'] },
  { pregunta:'Un patrón de líneas y colores que no representa nada concreto es una forma...', correcta:'NO FIGURATIVA (ABSTRACTA)', opts:['FIGURATIVA','TRANSPARENTE','SIMÉTRICA'] },
  { pregunta:'Un retrato realista de una persona, donde se reconoce su cara, es una forma...', correcta:'FIGURATIVA', opts:['NO FIGURATIVA (ABSTRACTA)','TRANSPARENTE','SIMÉTRICA'] },
];

export function genLenguajeVisual4Round(){
  const item = pick(LENGUAJE_VISUAL4_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

/* ---------------- Contenido Artes Visuales 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/5-basico):
   Lenguaje Visual III -> OA02 (color complementario; formas abiertas y
   cerradas; luz y sombra — conceptos nuevos respecto a 3°-4° básico, que
   cubrieron color cálido/frío/expresivo, tono/matiz y forma figurativa/no
   figurativa). Quedan fuera: OA01,03 (crear trabajos de arte propios a
   partir de la observación del entorno, con distintos materiales y
   herramientas — producción propia) y OA04-05 (analizar/interpretar obras
   de arte reales y comparar trabajos propios y de pares — apreciación
   subjetiva, además de requerir datos verificables sobre obras específicas
   que arriesgarían imprecisión sin una fuente adicional). */
export const ARTES_MODULES_G5 = [
  {id:'lenguajevisual5', label:'Lenguaje Visual III', open:true, key:'lenguajevisual5'},
];
export const ARTES_POS_G5 = [{x:50,y:50}];

const COLOR_COMPLEMENTARIO_BANK = [
  { color:'ROJO', complementario:'VERDE' }, { color:'AZUL', complementario:'NARANJO' }, { color:'AMARILLO', complementario:'MORADO' },
];
const FORMAS_CERRADAS_BANK = [
  { id:'circulo', label:'CÍRCULO' }, { id:'cuadrado', label:'CUADRADO' },
  { id:'triangulo', label:'TRIÁNGULO' }, { id:'rombo', label:'ROMBO' },
  { id:'hexagono', label:'HEXÁGONO' },
];
const FORMAS_ABIERTAS_DESC = [
  'Una línea en zigzag que nunca se junta consigo misma, sin encerrar ningún espacio.',
  'Una línea curva que serpentea de un lado del papel al otro, sin volver al punto donde empezó.',
  'Una línea recta que solo llega hasta la mitad del papel, sin formar ninguna figura cerrada.',
  'Una línea en espiral que nunca termina de cerrarse sobre sí misma.',
];
const LUZ_SOMBRA_BANK = [
  { pregunta:'¿Para qué se usa la sombra al dibujar un objeto redondo, como una pelota?', correcta:'PARA DARLE SENSACIÓN DE VOLUMEN Y PROFUNDIDAD', opts:['PARA BORRAR EL DIBUJO','PARA CAMBIAR SU FORMA REAL','PARA QUITARLE COLOR AL DIBUJO'] },
  { pregunta:'¿Qué es la "sombra propia" de un objeto?', correcta:'LA PARTE DEL OBJETO QUE NO RECIBE LUZ DIRECTA', opts:['LA SOMBRA QUE EL OBJETO PROYECTA EN EL SUELO','EL COLOR ORIGINAL DEL OBJETO','EL BRILLO MÁS CLARO DEL OBJETO'] },
  { pregunta:'¿Qué es la "sombra proyectada" de un objeto?', correcta:'LA SOMBRA QUE EL OBJETO ARROJA SOBRE OTRA SUPERFICIE, COMO EL SUELO', opts:['LA PARTE MÁS OSCURA DEL PROPIO OBJETO','EL COLOR MÁS BRILLANTE DEL OBJETO','LA FORMA EXACTA DEL OBJETO'] },
  { pregunta:'Si la luz viene de un solo lado de un objeto, ¿qué ocurre en el lado opuesto?', correcta:'SE FORMA UNA ZONA DE SOMBRA', opts:['SE FORMA UN BRILLO MÁS INTENSO','EL OBJETO CAMBIA DE COLOR POR COMPLETO','NO OCURRE NINGÚN CAMBIO VISUAL'] },
];
export function genLenguajeVisual5Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(COLOR_COMPLEMENTARIO_BANK);
    const todos = ['VERDE','NARANJO','MORADO','ROJO','AZUL','AMARILLO'];
    const distract = shuffle(todos.filter(function(c){ return c!==item.complementario; })).slice(0,3);
    const opts = shuffle([item.complementario].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<div class="shape-display">'+colorSwatchSVG(item.color,90)+'</div><p class="prompt-hint">El color '+item.color+'. ¿Cuál es su color complementario (el que está justo enfrente en el círculo cromático)?</p>',
      options: opts, correctValue: item.complementario, speakText: '¿Cuál es el color complementario del '+item.color.toLowerCase()+'?', cols:4, kind:'word',
      explain: 'El complementario del '+item.color.toLowerCase()+' es el <b>'+item.complementario.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.67){
    const opts = shuffle([{label:'FORMA CERRADA', value:true},{label:'FORMA ABIERTA', value:false}]);
    if(Math.random()<0.5){
      const item = pick(FORMAS_CERRADAS_BANK);
      return {
        promptHTML: '<div class="shape-display">'+shapeSVG(item.id,100)+'</div><p class="prompt-hint">¿Esta figura es una forma abierta o cerrada?</p>',
        options: opts, correctValue: true, speakText: '¿Es una forma abierta o cerrada?', cols:2, panel:true,
        explain: 'Un(a) '+item.label.toLowerCase()+' es una <b>forma cerrada</b>: su línea vuelve al punto donde comenzó, encerrando un espacio.',
      };
    }
    const desc = pick(FORMAS_ABIERTAS_DESC);
    return {
      promptHTML: '<p class="prompt-sentence">'+desc+'</p><p class="prompt-hint">¿Es una forma abierta o cerrada?</p>',
      options: opts, correctValue: false, speakText: '¿Es una forma abierta o cerrada?', cols:2, panel:true,
      explain: 'Esto es una <b>forma abierta</b>: su línea no vuelve al punto de partida, así que no encierra ningún espacio.',
    };
  }
  const item = pick(LUZ_SOMBRA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

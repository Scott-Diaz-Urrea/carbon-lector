import { pick, shuffle } from '../utils.js';
import { colorSwatchSVG, lineTypeSVG, piedraSVG, espejoSVG, plasticinaSVG, shapeSVG } from '../svg.js';

export const ARTES_MODULES = [
  {id:'colores', label:'Colores', open:true, key:'colores'},
  {id:'lineastexturas', label:'Líneas y Texturas', open:true, key:'lineastexturas'},
  {id:'materialesarte', label:'Materiales de Arte', open:true, key:'materialesarte'},
  {id:'examenartes1', label:'Examen Final', open:true, key:'examenartes1'},
];
/* 4° nodo agregado (2026-08-09, "Examen Final") — las 3 posiciones
   existentes se recalcularon para el nuevo height:480 (antes 340)
   preservando su posición en píxeles, y el 4° nodo continúa el mismo
   espaciado (Δy≈102px) del zigzag original. */
export const ARTES_POS = [{x:24,y:86},{x:70,y:65},{x:24,y:43},{x:70,y:22}];

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
  { label:'Rojo', tipo:'Cálido' },
  { label:'Naranjo', tipo:'Cálido' },
  { label:'Amarillo', tipo:'Cálido' },
  { label:'Rosado', tipo:'Cálido' },
  { label:'Azul', tipo:'Frío' },
  { label:'Verde', tipo:'Frío' },
  { label:'Morado', tipo:'Frío' },
  { label:'Celeste', tipo:'Frío' },
];
const MEZCLAS_COLOR = [
  { a:'Rojo', b:'Amarillo', result:'Naranjo' },
  { a:'Azul', b:'Amarillo', result:'Verde' },
  { a:'Rojo', b:'Azul', result:'Morado' },
  { a:'Rojo', b:'Blanco', result:'Rosado' },
];
const LINEAS_ITEMS = [
  { emoji:'➖', desc:'Una línea que va derecho, sin curvas.', label:'Recta' },
  { emoji:'📏', desc:'El borde de una regla es un ejemplo de esta línea.', label:'Recta' },
  { emoji:'〰️', desc:'Una línea que sube y baja como las olas del mar.', label:'Ondulada' },
  { emoji:'🐍', desc:'El cuerpo de una serpiente se mueve dibujando esta línea.', label:'Ondulada' },
  { emoji:'✏️', desc:'Una línea muy fina y delgadita.', label:'Delgada' },
  { emoji:'🧵', desc:'Un hilo dibuja una línea así de fina.', label:'Delgada' },
  { emoji:'🖍️', desc:'Una línea ancha y bien marcada.', label:'Gruesa' },
  { emoji:'🖊️', desc:'Un plumón grueso deja una línea así de marcada.', label:'Gruesa' },
];
/* 🪨/🪞 crudos no se renderizan en varios navegadores (mismo problema ya
   resuelto en otros archivos) — se reusan piedraSVG()/espejoSVG() aquí
   también, en vez de repetir el emoji sin soporte.
   Auditoría 2026-07-22: ÁSPERA y RUGOSA tenían la misma descripción ("dura
   y con relieve" / "con relieve"), sin ningún rasgo que las distinguiera —
   un niño podía defender cualquiera de las dos para la misma piedra o la
   misma corteza. Se reescribieron para diferenciar el rasgo real: ÁSPERA
   raspa al tocarla (fricción), RUGOSA tiene arrugas/bultos pero no raspa.
   También se sacó la mención a "un cactus" del ítem de corteza: un cactus
   se reconoce por sus espinas (peligro al tocar), no por su textura de
   superficie, así que mezclaba dos conceptos distintos en un mismo ítem. */
const TEXTURAS_ITEMS = [
  { emoji: piedraSVG(30), label:'Áspera', desc:'Una piedra sin pulir se siente rasposa al tocarla: raspa un poco los dedos.' },
  { emoji:'🧱', label:'Áspera', desc:'Un ladrillo sin pulir se siente rasposo al tocarlo: raspa un poco los dedos.' },
  { emoji:'🧊', label:'Lisa', desc:'Un vidrio o un hielo se sienten así: parejos, sin relieve.' },
  { emoji: espejoSVG(30), label:'Lisa', desc:'Un espejo se siente así al tocarlo: parejo, sin relieve.' },
  { emoji:'🧶', label:'Suave', desc:'La lana o un peluche se sienten así: agradables y delicados.' },
  { emoji:'☁️', label:'Suave', desc:'Una almohada de plumas se siente así: agradable y delicada.' },
  { emoji:'🌳', label:'Rugosa', desc:'La corteza de un árbol tiene arrugas y bultos, pero no raspa al tocarla.' },
  { emoji:'🍍', label:'Rugosa', desc:'La cáscara de una piña tiene bultos y hendiduras, pero no raspa al tocarla.' },
];
/* "PLASTICINA" usaba 🖍️ (un crayón, una herramienta de dibujo, no una masa
   moldeable) → plasticinaSVG(), el mismo helper que corrige el mismo error
   en Ciencias Naturales (ver ciencias.js). */
const HERRAMIENTAS_ARTE = [
  { emoji:'🖌️', label:'Pincel', uso:'Sirve para pintar con témpera o acuarela.' },
  { emoji:'✂️', label:'Tijera', uso:'Sirve para cortar papel y otros materiales.' },
  { emoji:'✏️', label:'Lápiz', uso:'Sirve para dibujar y hacer bocetos.' },
  { emoji:'🧵', label:'Hilo', uso:'Sirve para unir telas o hacer manualidades.' },
  { emoji: plasticinaSVG(30), label:'Plasticina', uso:'Sirve para modelar figuras con las manos.' },
  { emoji:'🧴', label:'Pegamento', uso:'Sirve para unir papeles y materiales de collage.' },
];

/* ---------------- Contenido Artes Visuales 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/2-basico): AR02 OA02 -> Líneas y Colores
   (línea vertical/horizontal/diagonal/espiral/quebrada; color primario y
   secundario). Quedan fuera AR02 OA01,03 (expresar/crear obras propias,
   producción) y OA04-05 (comunicar impresiones/preferencias, subjetivo). */
export const ARTES_MODULES_G2 = [
  {id:'lineascolores2', label:'Líneas y Colores', open:true, key:'lineascolores2'},
  {id:'examenartes2', label:'Examen Final', open:true, key:'examenartes2'},
];
export const ARTES_POS_G2 = [{x:30,y:70},{x:70,y:30}];

const LINEAS_G2_BANK = ['Vertical','Horizontal','Diagonal','Espiral','Quebrada'];
const COLORES_PRIM_SEC = [
  { label:'Rojo', tipo:'Primario' },
  { label:'Azul', tipo:'Primario' },
  { label:'Amarillo', tipo:'Primario' },
  { label:'Verde', tipo:'Secundario' },
  { label:'Naranjo', tipo:'Secundario' },
  { label:'Morado', tipo:'Secundario' },
];

/* Niveles (2026-08-11): rama de líneas mantiene el dibujo SVG siempre
   visible en los 3 niveles (es la única fuente de información: no hay
   texto que la reemplace), solo varía la cantidad de opciones; rama de
   colores oculta el swatch en difícil porque el nombre del color ya va
   en texto junto a él (decorativo, mismo criterio que genColoresRound). */
export function genLineasColores2Round(nivel){
  const recurso = 'Las líneas pueden dibujarse en distintas direcciones y formas (vertical, horizontal, diagonal, en espiral, quebrada), y cada tipo se usa para transmitir algo distinto en un dibujo: una línea horizontal se ve tranquila, una diagonal se ve dinámica. Los colores, por su parte, se dividen en <b>primarios</b> (rojo, amarillo, azul — no se pueden formar mezclando otros colores) y <b>secundarios</b> (naranjo, verde, morado — se forman mezclando dos primarios). Entender estas dos ideas básicas del lenguaje visual —tipos de línea y tipos de color— te da las herramientas para describir y crear tus propias obras con más intención, en vez de dibujar al azar.';
  if(Math.random()<0.5){
    const tipo = pick(LINEAS_G2_BANK);
    let distract = shuffle(LINEAS_G2_BANK.filter(function(t){ return t!==tipo; }));
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<div class="shape-display">'+lineTypeSVG(tipo,100)+'</div><p class="prompt-hint">¿Qué tipo de línea es?</p>',
      options: opts, correctValue: tipo, speakText: '¿Qué tipo de línea es?', cols:4, kind:'word',
      explain: 'Esa es una línea <b>'+tipo.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(COLORES_PRIM_SEC);
  const opts = shuffle([{label:'Primario', value:'Primario'},{label:'Secundario', value:'Secundario'}]);
  const showSwatch = nivel !== 'dificil';
  return {
    promptHTML: (showSwatch ? '<div class="shape-display">'+colorSwatchSVG(item.label,90)+'</div>' : '')+'<p class="prompt-hint">El color '+item.label+'. ¿Es un color primario o secundario?</p>',
    options: opts, correctValue: item.tipo, speakText: 'El color '+item.label, cols:2, panel:true,
    explain: 'El '+item.label.toLowerCase()+' es un color <b>'+item.tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

/* "Examen Final" 2° básico Artes Visuales: solo hay 1 módulo compatible,
   así que el examen re-randomiza el nivel sobre el mismo generador (mismo
   patrón que Tecnología 1° básico). */
export function genExamenArtes2Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genLineasColores2Round(nivel);
}

/* Niveles de dificultad (2026-08-09, mismo motor que el resto de 1°
   básico). `nivel` opcional; sin argumento, comportamiento original. En
   ambas ramas el nombre del color YA va escrito en texto (junto al
   swatch), así que el swatch es decorativo — se puede sacar en difícil
   sin perder información real, mismo criterio ya usado en Historia. */
export function genColoresRound(nivel){
  const recurso = 'Los colores se agrupan en dos familias según la sensación que transmiten: los <b>cálidos</b> (rojo, naranjo, amarillo) recuerdan al sol y al fuego, y los <b>fríos</b> (azul, verde, celeste) recuerdan al agua y al cielo. Además, hay solo 3 colores <b>primarios</b> (rojo, amarillo, azul) que no se pueden formar mezclando otros colores, pero que sí sirven para crear todos los demás: mezclando dos primarios en distintas cantidades obtienes los colores <b>secundarios</b> (naranjo, verde, morado). Entender esto te ayuda a predecir qué color obtendrás antes de mezclar de verdad, y a elegir colores a propósito según lo que quieras transmitir en un dibujo.';
  const showVisual = nivel !== 'dificil';
  if(Math.random()<0.5){
    const item = pick(COLORES_ITEMS);
    const opts = shuffle([{label:'Cálido', value:'Cálido'},{label:'Frío', value:'Frío'}]);
    const visual = '<div class="shape-display">'+colorSwatchSVG(item.label, 90)+'</div>';
    return {
      promptHTML: (showVisual ? visual : '')+'<p class="prompt-hint">El color '+item.label+'. ¿Es un color cálido o frío?</p>',
      options: opts, correctValue: item.tipo, speakText: 'El color '+item.label, cols:2, panel:true,
      explain: 'El '+item.label.toLowerCase()+' es un color <b>'+item.tipo.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(MEZCLAS_COLOR);
  let distract = shuffle(['Naranjo','Verde','Morado','Rosado'].filter(function(c){ return c!==item.result; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.result].concat(distract)).map(function(c){ return {label:c, value:c}; });
  const visual = '<div class="mix-row">'+
    '<div class="mix-swatch">'+(showVisual ? colorSwatchSVG(item.a,60) : '')+'<span>'+item.a+'</span></div>'+
    '<span class="mix-plus">+</span>'+
    '<div class="mix-swatch">'+(showVisual ? colorSwatchSVG(item.b,60) : '')+'<span>'+item.b+'</span></div>'+
  '</div>';
  return {
    promptHTML: visual+'<p class="prompt-hint">¿Qué color se forma al mezclarlos?</p>',
    options: opts, correctValue: item.result, speakText: '¿Qué color se forma al mezclar '+item.a+' con '+item.b+'?', cols:4, kind:'word',
    explain: 'Mezclar '+item.a.toLowerCase()+' con '+item.b.toLowerCase()+' forma el color <b>'+item.result.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genLineasTexturasRound(nivel){
  const recurso = 'Las <b>líneas</b> (rectas, curvas, onduladas, en zigzag) son el elemento más básico de cualquier dibujo — todo lo que dibujas empieza con algún tipo de línea, y cada tipo transmite una sensación distinta (una línea recta se ve firme, una ondulada se ve suave y en movimiento). Las <b>texturas</b>, en cambio, describen cómo se ve o se sentiría al tocar la superficie de algo (áspero, suave, rugoso, liso), aunque solo lo estés mirando en un dibujo o una foto. Aprender a distinguir tipos de líneas y texturas te da un vocabulario para describir obras de arte y objetos reales con más precisión, en vez de solo decir "se ve bonito" o "se ve raro".';
  const showEmoji = nivel !== 'dificil';
  if(Math.random()<0.5){
    const item = pick(LINEAS_ITEMS);
    const lineaPool = LINEAS_ITEMS.map(function(l){ return l.label; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
    let distract = shuffle(lineaPool.filter(function(l){ return l!==item.label; }));
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([item.label].concat(distract)).map(function(l){ return {label:l, value:l}; });
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.desc+' ¿Qué tipo de línea es?</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es una línea <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(TEXTURAS_ITEMS);
  const texturaPool = TEXTURAS_ITEMS.map(function(t){ return t.label; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  let distract = shuffle(texturaPool.filter(function(t){ return t!==item.label; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.label].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.desc+' ¿Qué textura es?</p>',
    options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
    explain: 'Esa es una textura <b>'+item.label.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genMaterialesArteRound(nivel){
  const recurso = 'Cada material y herramienta de arte sirve para un tipo de trabajo distinto: los lápices y crayones sirven para dibujar líneas y detalles finos, las témperas y pinceles sirven para pintar superficies grandes con color, y materiales moldeables como la plasticina sirven para crear formas en volumen (que se pueden tocar por todos lados), no solo en una hoja plana. Elegir la herramienta correcta para lo que quieres crear es una decisión importante en el arte, igual que un carpintero elige el martillo para clavar y la sierra para cortar — cada herramienta tiene un trabajo para el que fue pensada.';
  const showEmoji = nivel !== 'dificil';
  const item = pick(HERRAMIENTAS_ARTE);
  let distract = shuffle(HERRAMIENTAS_ARTE.filter(function(h){ return h.label!==item.label; })).map(function(h){ return h.label; });
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.label].concat(distract)).map(function(h){ return {label:h, value:h}; });
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.uso+'</p>',
    options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
    explain: item.uso+' Esa herramienta es <b>'+item.label.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

/* "Examen Final" (mismo patrón que el resto de 1° básico): mezcla los 3
   módulos de Artes Visuales 1° básico + los 3 niveles al azar. */
export function genExamenArtes1Round(){
  const gens = [genColoresRound, genLineasTexturasRound, genMaterialesArteRound];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenartes3', label:'Examen Final', open:true, key:'examenartes3'},
];
export const ARTES_POS_G3 = [{x:24,y:85},{x:70,y:50},{x:24,y:15}];

/* La asociación color-emoción es una convención ampliamente enseñada en
   educación artística (no una verdad científica única), consistente con
   el nivel de abstracción esperado para 3° básico. */
const COLOR_EXPRESIVO_BANK = [
  { color:'Rojo', emocion:'Energía o pasión' },
  { color:'Azul', emocion:'Calma o tranquilidad' },
  { color:'Amarillo', emocion:'Alegría' },
  { color:'Negro', emocion:'Misterio o seriedad' },
  { color:'Verde', emocion:'Naturaleza o frescura' },
  { color:'Naranjo', emocion:'Entusiasmo' },
  { color:'Rosado', emocion:'Ternura' },
  { color:'Morado', emocion:'Creatividad' },
];
const MATERIALES_ARTE3_BANK = [
  { emoji:'🏺', material:'la arcilla', categoria:'Material de modelado' },
  { emoji:'🧶', material:'la plasticina', categoria:'Material de modelado' },
  { emoji:'📦', material:'una caja de cartón usada', categoria:'Material de reciclaje' },
  { emoji:'🥤', material:'una botella de plástico usada', categoria:'Material de reciclaje' },
  { emoji:'🥫', material:'una lata de bebida usada', categoria:'Material de reciclaje' },
  { emoji:'🍃', material:'las hojas secas', categoria:'Material natural' },
  { emoji:'🌰', material:'las semillas', categoria:'Material natural' },
  { emoji:'🪵', material:'las ramitas', categoria:'Material natural' },
];

/* Niveles (2026-08-11): fácil reduce opciones; difícil oculta el swatch/
   emoji decorativo (el nombre del color/material ya va en texto). */
export function genColorExpresivo3Round(nivel){
  const item = pick(COLOR_EXPRESIVO_BANK);
  let distract = shuffle(COLOR_EXPRESIVO_BANK.filter(function(c){ return c.color!==item.color; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3).map(function(c){ return c.emocion; });
  const opts = shuffle([item.emocion].concat(distract)).map(function(e){ return {label:e, value:e}; });
  const showSwatch = nivel !== 'dificil';
  return {
    promptHTML: (showSwatch ? '<div class="shape-display">'+colorSwatchSVG(item.color,90)+'</div>' : '')+'<p class="prompt-hint">El color '+item.color+'. ¿Qué sensación transmite generalmente en una obra de arte?</p>',
    options: opts, correctValue: item.emocion, speakText: 'El color '+item.color, cols:2, panel:true,
    explain: 'El '+item.color.toLowerCase()+' suele transmitir <b>'+item.emocion.toLowerCase()+'</b>.',
    recurso: 'Los artistas eligen colores a propósito para transmitir una sensación específica al espectador, una convención muy usada en el arte y el diseño: colores como el rojo o el naranjo suelen transmitir energía o pasión, el azul suele transmitir calma, y el amarillo suele transmitir alegría. Esto no es una regla científica absoluta, sino una asociación cultural ampliamente compartida que los artistas aprovechan para "decirte algo" sin usar palabras. Fijarte en los colores que predominan en una obra de arte te da pistas sobre qué emoción quiso transmitir quien la creó.',
  };
}

export function genMaterialesArte3Round(nivel){
  const item = pick(MATERIALES_ARTE3_BANK);
  let distract = shuffle(MATERIALES_ARTE3_BANK.filter(function(m){ return m.categoria!==item.categoria; })).map(function(m){ return m.categoria; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  if(nivel==='facil'){ distract = distract.slice(0,1); }
  const opts = shuffle([item.categoria].concat(distract)).map(function(c){ return {label:c, value:c}; });
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">¿A qué categoría pertenece '+item.material+'?</p>',
    options: opts, correctValue: item.categoria, speakText: '¿A qué categoría pertenece '+item.material+'?', cols:2, kind:'word', panel:true,
    explain: (item.material.charAt(0).toUpperCase()+item.material.slice(1))+' es un <b>'+item.categoria.toLowerCase()+'</b>.',
    recurso: 'El arte se puede crear con distintos tipos de materiales, cada uno con una textura y un uso propio: los <b>materiales de modelado</b> (arcilla, plasticina) se pueden amasar y moldear en 3 dimensiones; los <b>materiales de reciclaje</b> (cajas, botellas, latas usadas) le dan una segunda vida a objetos que ibas a botar, y además son una forma de cuidar el ambiente; y los <b>materiales naturales</b> (hojas, semillas, ramitas) vienen directamente de la naturaleza sin ninguna transformación. Conocer estas categorías te da más opciones creativas al momento de crear tus propias obras de arte.',
  };
}

/* "Examen Final" 3° básico Artes Visuales: mezcla los 2 módulos del año +
   los 3 niveles al azar. */
export function genExamenArtes3Round(){
  const gens = [genColorExpresivo3Round, genMaterialesArte3Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
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
  {id:'examenartes4', label:'Examen Final', open:true, key:'examenartes4'},
];
export const ARTES_POS_G4 = [{x:30,y:70},{x:70,y:30}];

const LENGUAJE_VISUAL4_BANK = [
  { pregunta:'¿Qué es una línea de contorno en un dibujo?', correcta:'La línea que marca el borde o silueta de una figura', opts:['El color de fondo del dibujo','La textura de la superficie','El título de la obra'] },
  { pregunta:'¿Para qué sirve la línea de contorno al dibujar un objeto?', correcta:'Para definir claramente su forma y separarlo del fondo', opts:['Para llenar todo el espacio de color','Para borrar el dibujo','Para escribir el nombre del autor'] },
  { pregunta:'Si agregas blanco a un color para aclararlo, ¿qué estás cambiando?', correcta:'Su tono', opts:['Su forma','Su textura','Su tamaño'] },
  { pregunta:'Si oscureces un color agregándole negro, ¿qué estás cambiando?', correcta:'Su tono', opts:['Su forma','Su textura','Su tamaño'] },
  { pregunta:'¿Qué es el "matiz" de un color?', correcta:'La variación específica de ese color (como un rojo más anaranjado o más violeta)', opts:['El tamaño del dibujo','La textura de la pintura','El nombre del artista'] },
  { pregunta:'Un dibujo de un gato bien reconocible, con orejas, bigotes y cola, es una forma...', correcta:'Figurativa', opts:['No figurativa (abstracta)','Transparente','Simétrica'] },
  { pregunta:'Una mancha de pintura sin forma reconocible es una forma...', correcta:'No figurativa (abstracta)', opts:['Figurativa','Transparente','Simétrica'] },
  { pregunta:'Un dibujo de una casa con techo, puerta y ventanas es una forma...', correcta:'Figurativa', opts:['No figurativa (abstracta)','Transparente','Simétrica'] },
  { pregunta:'Un patrón de líneas y colores que no representa nada concreto es una forma...', correcta:'No figurativa (abstracta)', opts:['Figurativa','Transparente','Simétrica'] },
  { pregunta:'Un retrato realista de una persona, donde se reconoce su cara, es una forma...', correcta:'Figurativa', opts:['No figurativa (abstracta)','Transparente','Simétrica'] },
];

export function genLenguajeVisual4Round(nivel){
  const item = pick(LENGUAJE_VISUAL4_BANK);
  const opts = shuffle([item.correcta].concat(nivel==='facil' ? item.opts.slice(0,1) : item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: 'La <b>línea de contorno</b> es la línea que marca el borde de una figura, separándola del fondo y definiendo claramente su forma — es lo primero que suele dibujarse al bosquejar un objeto. Un mismo color puede variar de dos formas distintas: el <b>tono</b> (qué tan claro u oscuro es, según se le agregue blanco o negro) y el <b>matiz</b> (la variación específica dentro de ese color, como un rojo más anaranjado o más violeta). Una obra también se puede clasificar según qué tan reconocible es lo que representa: una forma <b>figurativa</b> muestra algo identificable del mundo real (un gato, una casa), mientras que una forma <b>no figurativa</b> (o abstracta) es un patrón de líneas y colores que no representa nada concreto.',
  };
}

export function genExamenArtes4Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genLenguajeVisual4Round(nivel);
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
  {id:'examenartes5', label:'Examen Final', open:true, key:'examenartes5'},
];
export const ARTES_POS_G5 = [{x:30,y:70},{x:70,y:30}];

const COLOR_COMPLEMENTARIO_BANK = [
  { color:'Rojo', complementario:'Verde' }, { color:'Azul', complementario:'Naranjo' }, { color:'Amarillo', complementario:'Morado' },
];
const FORMAS_CERRADAS_BANK = [
  { id:'circulo', label:'Círculo' }, { id:'cuadrado', label:'Cuadrado' },
  { id:'triangulo', label:'Triángulo' }, { id:'rombo', label:'Rombo' },
  { id:'hexagono', label:'Hexágono' },
];
const FORMAS_ABIERTAS_DESC = [
  'Una línea en zigzag que nunca se junta consigo misma, sin encerrar ningún espacio.',
  'Una línea curva que serpentea de un lado del papel al otro, sin volver al punto donde empezó.',
  'Una línea recta que solo llega hasta la mitad del papel, sin formar ninguna figura cerrada.',
  'Una línea en espiral que nunca termina de cerrarse sobre sí misma.',
];
const LUZ_SOMBRA_BANK = [
  { pregunta:'¿Para qué se usa la sombra al dibujar un objeto redondo, como una pelota?', correcta:'Para darle sensación de volumen y profundidad', opts:['Para borrar el dibujo','Para cambiar su forma real','Para quitarle color al dibujo'] },
  { pregunta:'¿Qué es la "sombra propia" de un objeto?', correcta:'La parte del objeto que no recibe luz directa', opts:['La sombra que el objeto proyecta en el suelo','El color original del objeto','El brillo más claro del objeto'] },
  { pregunta:'¿Qué es la "sombra proyectada" de un objeto?', correcta:'La sombra que el objeto arroja sobre otra superficie, como el suelo', opts:['La parte más oscura del propio objeto','El color más brillante del objeto','La forma exacta del objeto'] },
  { pregunta:'Si la luz viene de un solo lado de un objeto, ¿qué ocurre en el lado opuesto?', correcta:'Se forma una zona de sombra', opts:['Se forma un brillo más intenso','El objeto cambia de color por completo','No ocurre ningún cambio visual'] },
];
export function genLenguajeVisual5Round(nivel){
  const recurso = 'En el <b>círculo cromático</b>, cada color tiene un <b>color complementario</b> justo enfrente (como el rojo y el verde, o el azul y el naranjo) — al ponerlos juntos se resaltan mutuamente con mucho contraste. Una forma es <b>cerrada</b> cuando su línea vuelve al punto donde comenzó, encerrando un espacio (como un círculo o un cuadrado); es <b>abierta</b> cuando la línea no se junta consigo misma. La <b>luz y la sombra</b> le dan volumen a un dibujo: la sombra propia está en el objeto mismo (el lado que no recibe luz), y la sombra proyectada es la que el objeto arroja sobre la superficie donde está apoyado.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(COLOR_COMPLEMENTARIO_BANK);
    const todos = ['Verde','Naranjo','Morado','Rojo','Azul','Amarillo'];
    const distractCount = nivel==='facil' ? 1 : 3;
    const distract = shuffle(todos.filter(function(c){ return c!==item.complementario; })).slice(0,distractCount);
    const opts = shuffle([item.complementario].concat(distract)).map(function(c){ return {label:c, value:c}; });
    const visual = nivel==='dificil' ? '<p class="prompt-word">'+item.color+'</p>' : '<div class="shape-display">'+colorSwatchSVG(item.color,90)+'</div>';
    return {
      promptHTML: visual+'<p class="prompt-hint">El color '+item.color+'. ¿Cuál es su color complementario (el que está justo enfrente en el círculo cromático)?</p>',
      options: opts, correctValue: item.complementario, speakText: '¿Cuál es el color complementario del '+item.color.toLowerCase()+'?', cols:4, kind:'word',
      explain: 'El complementario del '+item.color.toLowerCase()+' es el <b>'+item.complementario.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const opts = shuffle([{label:'Forma cerrada', value:true},{label:'Forma abierta', value:false}]);
    if(Math.random()<0.5){
      const item = pick(FORMAS_CERRADAS_BANK);
      const visual = nivel==='dificil' ? '<p class="prompt-word">'+item.label+'</p>' : '<div class="shape-display">'+shapeSVG(item.id,100)+'</div>';
      return {
        promptHTML: visual+'<p class="prompt-hint">¿Esta figura es una forma abierta o cerrada?</p>',
        options: opts, correctValue: true, speakText: '¿Es '+item.label.toLowerCase()+' una forma abierta o cerrada?', cols:2, panel:true,
        explain: 'Un '+item.label.toLowerCase()+' es una <b>forma cerrada</b>: su línea vuelve al punto donde comenzó, encerrando un espacio.', recurso: recurso,
      };
    }
    const desc = pick(FORMAS_ABIERTAS_DESC);
    return {
      promptHTML: '<p class="prompt-sentence">'+desc+'</p><p class="prompt-hint">¿Es una forma abierta o cerrada?</p>',
      options: opts, correctValue: false, speakText: '¿Es una forma abierta o cerrada?', cols:2, panel:true,
      explain: 'Esto es una <b>forma abierta</b>: su línea no vuelve al punto de partida, así que no encierra ningún espacio.', recurso: recurso,
    };
  }
  const item = pick(LUZ_SOMBRA_BANK);
  const optsPool = nivel==='facil' ? item.opts.slice(0,1) : item.opts;
  const opts = shuffle([item.correcta].concat(optsPool)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
  };
}

export function genExamenArtes5Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genLenguajeVisual5Round(nivel);
}

/* ---------------- Contenido Artes Visuales 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/artes-visuales/6-basico):
   Lenguaje Visual IV -> OA02, que esta vez sí nombra elementos nuevos:
   "color (gamas y contrastes); volumen (lleno y vacío)" — distintos de los ya
   cubiertos en 3°-5° básico (cálido/frío/expresivo, tono/matiz/forma
   figurativa, complementario/formas abiertas-cerradas/luz y sombra).
   Quedan fuera: OA01,03 (crear trabajos propios a partir de la observación
   del entorno contemporáneo, con materiales/herramientas — producción
   propia) y OA04-05 (analizar obras de arte contemporáneo reales y evaluar
   críticamente trabajos propios/de pares — apreciación subjetiva, además de
   requerir datos verificables sobre obras específicas). Las actitudes
   (OAA A-G) tampoco aplican al motor de opción múltiple. */
export const ARTES_MODULES_G6 = [
  {id:'lenguajevisual6', label:'Lenguaje Visual IV', open:true, key:'lenguajevisual6'},
];
export const ARTES_POS_G6 = [{x:50,y:50}];

const GAMA_COLOR_BANK = [
  { desc:'Una pintura usa solo tonos de rojo, naranjo y amarillo, dando una sensación cálida y energética', gama:'Gama cálida' },
  { desc:'Un afiche usa solo tonos de azul, verde y morado, dando una sensación fresca y calmada', gama:'Gama fría' },
  { desc:'Un cuadro combina distintos tonos de un mismo color, como varios tonos de azul, del más claro al más oscuro', gama:'Monocromática' },
  { desc:'Un mural usa solo tonos de amarillo, naranjo y rojo intenso para transmitir el calor de un atardecer', gama:'Gama cálida' },
  { desc:'Una ilustración de un paisaje invernal usa solo tonos de celeste, azul y blanco grisáceo', gama:'Gama fría' },
  { desc:'Un dibujo usa distintos tonos de verde, desde uno muy claro hasta uno muy oscuro, para representar un bosque', gama:'Monocromática' },
];
const CONTRASTE_COLOR_BANK = [
  { desc:'Una ilustración combina un fondo muy oscuro con una figura muy clara, para que resalte con fuerza', tipo:'Contraste claro-oscuro' },
  { desc:'Un diseño combina rojo y verde, dos colores que están justo enfrente en el círculo cromático, para resaltar ambos al máximo', tipo:'Contraste de complementarios' },
  { desc:'Un afiche usa letras blancas sobre un fondo negro, para que el texto se lea con claridad a la distancia', tipo:'Contraste claro-oscuro' },
  { desc:'Un logo combina azul y naranjo, dos colores opuestos en el círculo cromático, para que ambos se vean más intensos', tipo:'Contraste de complementarios' },
];
const VOLUMEN_LLENO_VACIO_BANK = [
  { desc:'Una escultura de greda tiene partes sólidas y partes con huecos o espacios abiertos que dejan ver a través de ella', pregunta:'¿Cómo se llaman esas dos partes en el lenguaje del volumen?', correcta:'Lleno (sólido) y vacío (espacio abierto)', opts:['Claro y oscuro solamente','Cálido y frío solamente','Grande y pequeño solamente'] },
  { desc:'Al modelar una figura en arcilla, la parte de material que ocupa espacio se llama "lleno", y el hueco o espacio que queda alrededor o dentro se llama "vacío"', pregunta:'¿Por qué es importante el "vacío" en una escultura, y no solo el "lleno"?', correcta:'Porque el espacio vacío también forma parte de la composición visual de la obra', opts:['Porque el vacío nunca se considera parte de la obra','Porque las esculturas siempre deben ser totalmente sólidas','Porque el vacío arruina cualquier escultura'] },
  { desc:'Una escultura de madera calada (con agujeros a propósito) deja ver el espacio detrás de ella a través de sus huecos', pregunta:'¿Qué parte de la escultura representa el "vacío"?', correcta:'Los huecos que dejan ver a través de la escultura', opts:['La madera sólida que forma la figura','El color de la madera','La base que sostiene la escultura'] },
];
export function genLenguajeVisual6Round(){
  const recurso = 'Una <b>gama de color</b> es un conjunto de colores emparentados que da una sensación general a una obra: cálida (rojos, naranjos, amarillos), fría (azules, verdes, morados) o monocromática (tonos distintos de un mismo color). El <b>contraste</b> resalta elementos al ponerlos en oposición: claro-oscuro (para que algo destaque con fuerza) o de complementarios (colores opuestos en el círculo cromático, que se intensifican mutuamente). Y en escultura, el <b>volumen</b> se describe con "lleno" (la parte sólida) y "vacío" (los huecos o espacios abiertos) — ambos forman parte de la composición visual de la obra, no solo el material sólido.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(GAMA_COLOR_BANK);
    const todos = ['Gama cálida','Gama fría','Monocromática'];
    const distract = todos.filter(function(g){ return g!==item.gama; });
    const opts = shuffle([item.gama].concat(distract)).map(function(g){ return {label:g, value:g}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué gama de color se usa en esta obra?</p>',
      options: opts, correctValue: item.gama, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: 'Esta obra usa una <b>'+item.gama.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(CONTRASTE_COLOR_BANK);
    const otroTipo = ['Contraste claro-oscuro','Contraste de complementarios'].filter(function(t){ return t!==item.tipo; })[0];
    const opts = shuffle([item.tipo, otroTipo, 'Sin ningún contraste']).map(function(t){ return {label:t, value:t}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué tipo de contraste se usa aquí?</p>',
      options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, panel:true,
      explain: 'Aquí se usa un <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(VOLUMEN_LLENO_VACIO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
  };
}

/* ---------------- Contenido Artes Visuales 7° Básico ----------------
   Basado en Decreto 614/2013. OA06 -> Espacios de Difusión del Arte
   (reconocer distintos espacios donde el arte visual se muestra o
   comparte con el público: museo, galería, espacio público/mural, y su
   función social distinta). Quedan fuera OA01-05,07 (crear trabajos
   visuales propios, investigar referentes/artistas específicos con riesgo
   de datos inexactos sin fuente adicional, y evaluar/fundamentar
   apreciaciones personales — producción propia u opinión subjetiva). */
export const ARTES_MODULES_G7 = [
  {id:'espaciosdifusion7', label:'Espacios de Difusión del Arte', open:true, key:'espaciosdifusion7'},
];
export const ARTES_POS_G7 = [{x:50,y:50}];

const ESPACIOS_DIFUSION_BANK = [
  { desc:'Un edificio que conserva y exhibe colecciones de obras de arte, muchas veces antiguas o históricas, para que el público las visite', correcta:'Museo', opts:['Galería', 'Mural', 'Taller de artista'] },
  { desc:'Un local más pequeño que un museo, donde se exhiben y también se venden obras de artistas, muchas veces contemporáneos', correcta:'Galería', opts:['Museo', 'Biblioteca', 'Teatro'] },
  { desc:'Una obra de gran tamaño pintada directamente sobre una pared o muro, visible para cualquiera que pase por ese lugar', correcta:'Mural (arte público)', opts:['Museo', 'Galería', 'Escultura de interior'] },
  { desc:'Un espacio en una plaza o calle donde se instala una escultura para que toda la comunidad pueda verla libremente', correcta:'Espacio público', opts:['Un museo con entrada pagada', 'Una galería privada', 'El taller personal de un artista'] },
  { desc:'Un centro cultural organiza una exposición temporal de fotografía, abierta al público durante solo un par de meses', correcta:'Galería', opts:['Museo', 'Mural (arte público)', 'Espacio público'] },
  { desc:'Un edificio patrimonial exhibe de forma permanente una colección de pinturas de hace más de cien años', correcta:'Museo', opts:['Galería', 'Mural (arte público)', 'Espacio público'] },
];
const FUNCION_SOCIAL_ESPACIOS_BANK = [
  { pregunta:'¿Qué diferencia principal hay entre ver una obra en un museo y ver un mural en la calle?', correcta:'El mural está al alcance de cualquiera que pase por ahí, sin necesidad de entrar a un edificio', opts:['No hay ninguna diferencia entre ambos', 'El mural solo puede verse pagando entrada', 'Los museos siempre están al aire libre'] },
  { pregunta:'¿Por qué el arte en espacios públicos (como un mural o una escultura en una plaza) puede llegar a más personas que el arte en un museo?', correcta:'Porque cualquiera que transite por ese lugar puede verlo, sin necesidad de decidir visitar un museo', opts:['Porque los museos están siempre cerrados', 'Porque el arte público es siempre más pequeño', 'Porque nadie visita nunca los museos'] },
  { pregunta:'¿Qué ventaja tiene una galería frente a un museo para un artista que recién comienza su carrera?', correcta:'La galería suele exhibir y vender obras de artistas contemporáneos, más accesible para artistas nuevos', opts:['La galería nunca muestra obras de artistas nuevos', 'Los museos siempre aceptan a cualquier artista sin requisitos', 'No existe ninguna diferencia entre ambos espacios'] },
  { pregunta:'¿Por qué algunas comunidades eligen pintar murales en sus barrios en vez de solo exhibir arte en museos?', correcta:'Para que el arte forme parte de la vida cotidiana y refleje la identidad del barrio', opts:['Porque los museos están prohibidos en esa comunidad', 'Porque es imposible exhibir arte de otra forma', 'Porque los murales son siempre más baratos que cualquier otra opción'] },
];
export function genEspaciosDifusion7Round(){
  const recurso = 'El arte se difunde de varias formas: un <b>museo</b> exhibe de forma permanente colecciones de valor patrimonial; una <b>galería</b> muestra exposiciones temporales, muchas veces de artistas contemporáneos; un <b>mural</b> es una obra pintada directamente sobre un muro, visible para cualquiera que pase; y el <b>espacio público</b> (una plaza, una calle) permite instalar arte al alcance de toda la comunidad, sin necesidad de entrar a un edificio ni pagar entrada. Cada espacio cumple una función social distinta: el arte público suele llegar a más personas porque no depende de que alguien decida visitarlo.';
  if(Math.random()<0.6){
    const item = pick(ESPACIOS_DIFUSION_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué espacio de difusión del arte es este?</p>',
      options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: 'Esto describe: <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(FUNCION_SOCIAL_ESPACIOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',    recurso: recurso,
  };
}

/* ---------------- Contenido Artes Visuales 8° Básico ----------------
   Basado en Decreto 614/2013. AR08 OA06 -> Montaje y Difusión del Arte
   ("comparar y valorar espacios de difusión de las artes visuales,
   considerando: medios de expresión presentes, espacio, montaje, público
   y aporte a la comunidad") — profundiza el módulo de 7° básico (que
   cubrió QUÉ es cada espacio) con el ángulo nuevo del OA de 8°: CÓMO se
   monta una exposición y qué aporta a su comunidad. Quedan fuera
   OA01-03 (crear trabajos visuales propios, incluyendo instalaciones y
   técnicas de impresión — producción práctica) y OA04-05 (analizar y
   evaluar obras propias y de pares — apreciación subjetiva). */
export const ARTES_MODULES_G8 = [
  {id:'montajedifusion8', label:'Montaje y Difusión del Arte', open:true, key:'montajedifusion8'},
];
export const ARTES_POS_G8 = [{x:50,y:50}];

const MONTAJE_8_BANK = [
  { pregunta:'¿Qué es el "montaje" de una exposición de artes visuales?', correcta:'La forma en que se organizan y ubican las obras en el espacio para que el público las recorra', opts:['El precio de las entradas','El transporte de los visitantes','La limpieza del edificio'] },
  { pregunta:'¿Por qué importa la iluminación al montar una exposición?', correcta:'Porque destaca cada obra y permite apreciar sus colores y detalles sin dañarla', opts:['Porque las obras necesitan calor para conservarse','Solo para gastar más electricidad','No tiene ninguna importancia'] },
  { pregunta:'¿Qué función cumple la ficha o cartela junto a una obra en una exposición?', correcta:'Informar título, autor, técnica y año, ayudando al público a comprender la obra', opts:['Tapar parte de la obra','Indicar el precio de la cafetería','Decorar la pared sin información'] },
  { pregunta:'¿Qué se considera al decidir la altura y distancia entre obras en una sala?', correcta:'La comodidad visual del público y que cada obra tenga su propio espacio', opts:['Solo el tamaño de la puerta de entrada','El color del techo','Nada: se cuelgan al azar'] },
  { pregunta:'¿En qué se diferencia el montaje de una instalación artística del de un cuadro tradicional?', correcta:'La instalación ocupa el espacio completo y el público puede recorrerla o rodearla', opts:['No existe ninguna diferencia','Las instalaciones solo se cuelgan en muros','Los cuadros siempre se ponen en el suelo'] },
  { pregunta:'¿Qué aporta a su comunidad un espacio de difusión del arte, como un centro cultural de barrio?', correcta:'Acerca el arte a los vecinos y ofrece un lugar de encuentro y expresión', opts:['Solo ocupa espacio sin ningún aporte','Reemplaza a las escuelas','Impide otras actividades del barrio'] },
  { pregunta:'¿Por qué una exposición virtual (en línea) amplía el público de una muestra de arte?', correcta:'Porque personas de cualquier lugar pueden visitarla sin viajar', opts:['Porque elimina las obras originales','Porque solo la ven los artistas','Porque funciona únicamente de noche'] },
  { pregunta:'¿Qué conviene considerar sobre el público al planificar una exposición?', correcta:'Quiénes la visitarán, para adaptar recorrido, textos y actividades a ese público', opts:['Nada: todos los públicos son idénticos','Solo su estatura','Que no entre nadie'] },
  { pregunta:'¿Qué medio de expresión contemporáneo puede requerir pantallas y sonido en su montaje?', correcta:'El videoarte', opts:['La acuarela tradicional','El dibujo a lápiz','La greda sin cocer'] },
  { pregunta:'¿Qué diferencia hay entre exponer en un museo y en el espacio público, pensando en el montaje?', correcta:'En el espacio público las obras deben resistir clima y uso cotidiano, y el público llega sin planearlo', opts:['No hay ninguna diferencia de montaje','En la calle las obras no necesitan instalarse','Los museos no requieren ningún cuidado'] },
];
export function genMontajeDifusion8Round(){
  const recurso = 'El <b>montaje</b> de una exposición es la forma en que se organizan y ubican las obras en el espacio para que el público las recorra bien: incluye decidir la iluminación (que destaca cada obra sin dañarla), la altura y distancia entre piezas (para que cada una tenga su propio espacio), y las fichas o cartelas que informan título, autor, técnica y año. Los <b>espacios de difusión del arte</b> —museos, galerías, murales o centros culturales— cumplen distintas funciones sociales: acercan el arte a la comunidad, ofrecen un lugar de encuentro, y cada tipo de espacio (una sala cerrada, el espacio público, una plataforma virtual) exige adaptar el montaje a sus propias condiciones, como el clima si es al aire libre o el alcance si es en línea.';
  const item = pick(MONTAJE_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/artes-visuales/1-medio
   — OA01-06. Cubierto: OA06 (diseñar propuestas de difusión hacia la
   comunidad, considerando manifestaciones a exponer, espacio, montaje,
   público y aporte a la comunidad — continúa el mismo eje ya trabajado en
   7°-8° básico, con escenarios nuevos). Fuera: OA01-03 (crear proyectos
   visuales propios — producción práctica) y OA04-05 (juicios críticos
   sobre obras — apreciación subjetiva). */
export const ARTES_MODULES_M1 = [
  {id:'difusionm1', label:'Arte, Espacios y Difusión', open:true, key:'difusionm1'},
];
export const ARTES_POS_M1 = [{x:48,y:50}];
const DIFUSION_M1_BANK = [
  { pregunta:'Un curso quiere exponer sus fotografías sobre el barrio en la biblioteca municipal. ¿Qué deberían considerar primero sobre el PÚBLICO?', correcta:'Quiénes visitan habitualmente la biblioteca, para pensar el recorrido y los textos según ese público', opts:['El color de las paredes de la biblioteca únicamente','Nada: el público no influye en la propuesta','Solo la cantidad de sillas disponibles'] },
  { pregunta:'Un grupo de estudiantes de arte digital planea difundir su trabajo en un espacio virtual. ¿Qué ventaja tiene ese tipo de espacio?', correcta:'Permite que personas de cualquier lugar vean la muestra sin necesidad de trasladarse', opts:['Solo lo pueden ver los propios autores','Elimina cualquier posibilidad de difusión','Requiere que el público viaje obligatoriamente'] },
  { pregunta:'Al diseñar el montaje de un mural comunitario en la plaza del barrio, ¿qué se debe considerar sobre el ESPACIO?', correcta:'Que el mural resista el clima y sea visible para quienes transitan por la plaza', opts:['Que solo se vea de noche','Que nadie pueda verlo nunca','El precio de la pintura únicamente'] },
  { pregunta:'Un colectivo de arte quiere exponer esculturas en un pasaje peatonal del barrio. ¿Qué aporte a la comunidad podría generar esta propuesta?', correcta:'Embellecer el espacio público y generar un punto de encuentro para los vecinos', opts:['Bloquear completamente el paso de las personas','No genera ningún aporte a la comunidad','Aumentar la contaminación del sector'] },
  { pregunta:'Al planificar la difusión de una muestra de pintura en la sala de un centro cultural, ¿qué elemento del montaje ayuda a que el público entienda cada obra?', correcta:'Fichas o cartelas junto a cada obra, con información como título y autor', opts:['Quitar toda la información de las obras','Ocultar el nombre del autor siempre','No incluir ningún dato sobre las obras'] },
  { pregunta:'Un grupo decide difundir su arte mediante redes sociales además de una exposición presencial. ¿Qué combinación de manifestaciones visuales podría incluir en esa difusión digital?', correcta:'Fotografías de las obras, videos del proceso creativo, y textos explicativos', opts:['Únicamente el nombre del grupo, sin ninguna imagen','Solo un audio sin ninguna imagen','Nada relacionado con las obras expuestas'] },
  { pregunta:'¿Por qué conviene pensar el "aporte a la comunidad" antes de diseñar una propuesta de difusión artística?', correcta:'Porque ayuda a que la muestra tenga un sentido más allá de solo exhibir obras, conectando con quienes viven cerca', opts:['Porque no tiene ninguna relación con el diseño de la muestra','Porque el aporte a la comunidad nunca se puede planificar','Porque solo importa el precio de la entrada'] },
  { pregunta:'Un grupo de artistas quiere difundir arte urbano en una estación de metro concurrida. ¿Qué deben considerar sobre el espacio?', correcta:'Que muchas personas pasarán rápido frente a la obra, así que debe captar la atención en poco tiempo', opts:['Que nadie transita nunca por una estación de metro','Que el espacio no influye en cómo se percibe la obra','Que solo importa el tamaño de la obra'] },
  { pregunta:'Una escuela organiza una feria de arte donde participan varios cursos con distintas técnicas. ¿Qué ayuda a organizar bien el montaje de esa muestra conjunta?', correcta:'Agrupar las obras por técnica o tema, facilitando el recorrido del público', opts:['Ubicar las obras sin ningún criterio de organización','No permitir que el público se acerque a las obras','Exhibir solo las obras de un curso'] },
];
export function genDifusionM1Round(){
  const recurso = 'Diseñar una <b>propuesta de difusión</b> de trabajos y proyectos de arte hacia la comunidad requiere pensar varios elementos a la vez: qué manifestaciones visuales se van a exponer (pinturas, esculturas, fotografías, arte digital), en qué <b>espacio</b> (una sala cerrada, un mural al aire libre, una plataforma virtual —cada uno con sus propias exigencias de montaje, como resistir el clima o llegar a públicos de cualquier lugar), cómo será el <b>montaje</b> (iluminación, fichas informativas, distancia entre obras), quién es el <b>público</b> que probablemente visitará la muestra, y qué <b>aporte</b> puede generar esa propuesta en la comunidad —embellecer un espacio, crear un punto de encuentro, o acercar el arte a personas que normalmente no lo visitan—. Pensar estos elementos en conjunto, ya sea para una exposición presencial o digital, hace que la difusión tenga un propósito más claro.';
  const item = pick(DIFUSION_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/artes-visuales/2-medio
   — AR2M OA06 (implementar propuestas de difusión hacia la comunidad, en el
   contexto escolar o local — texto muy similar al de 1° medio, así que este
   módulo se enfoca en la IMPLEMENTACIÓN concreta: pasos de ejecución, difusión
   previa, y evaluación posterior, en vez de repetir el diseño de montaje/
   espacio/público ya cubierto en "Arte, Espacios y Difusión" de 1° medio).
   Fuera: OA01-03 (crear proyectos visuales propios), OA04-05 (apreciación/
   evaluación subjetiva de obras). */
export const ARTES_MODULES_M2 = [
  {id:'implementaciondifusionm2', label:'Implementar la Difusión de Arte', open:true, key:'implementaciondifusionm2'},
];
export const ARTES_POS_M2 = [{x:48,y:50}];
const IMPLEMENTACION_DIFUSION_M2_BANK = [
  { pregunta:'Antes de inaugurar una muestra de arte en el colegio, ¿qué paso de implementación es clave para que la comunidad se entere y asista?', correcta:'Difundir la invitación con anticipación, usando afiches, redes sociales u otros canales', opts:['No avisar a nadie hasta el mismo día del evento','Solo avisarle al director del colegio','Cancelar cualquier tipo de invitación'] },
  { pregunta:'Durante la inauguración de una exposición escolar, ¿qué acción ayuda a que la comunidad se involucre más allá de solo mirar las obras?', correcta:'Organizar una breve presentación o recorrido guiado por los propios estudiantes autores', opts:['Prohibir que los autores hablen de sus obras','Cerrar la sala apenas comienza el evento','No permitir que nadie haga preguntas'] },
  { pregunta:'Después de implementar una propuesta de difusión artística en la comunidad local, ¿qué es útil hacer para mejorar futuras muestras?', correcta:'Recoger comentarios y opiniones del público que asistió', opts:['Ignorar por completo cualquier comentario recibido','No volver a organizar ninguna actividad similar','Eliminar todas las obras expuestas de inmediato'] },
  { pregunta:'Un curso quiere implementar la difusión de su arte en la feria costumbrista de su localidad. ¿Qué deben coordinar primero con los organizadores del evento?', correcta:'El espacio disponible, el horario y los permisos necesarios para exhibir', opts:['Nada, pueden instalarse donde quieran sin avisar','Solo el color de la pintura que usarán','Ignorar cualquier norma del evento local'] },
  { pregunta:'¿Qué rol cumple la evaluación posterior a la implementación de una muestra de arte en la comunidad?', correcta:'Permite saber qué funcionó bien y qué se podría mejorar en la próxima propuesta de difusión', opts:['No cumple ningún rol relevante','Sirve únicamente para criticar a los autores','Reemplaza la necesidad de planificar futuras muestras'] },
  { pregunta:'¿Por qué es útil definir con anticipación quién estará a cargo de cada tarea al implementar una muestra de arte (montaje, difusión, recepción del público)?', correcta:'Para que el día del evento cada responsabilidad esté cubierta y nada quede sin resolver a último minuto', opts:['No es necesario definir responsabilidades, cualquiera puede improvisar','Porque solo una persona puede participar en toda la organización','Porque repartir tareas siempre genera más conflictos'] },
  { pregunta:'Un curso implementa su muestra de arte también en formato digital, publicando fotos y videos en redes sociales del colegio. ¿Qué ventaja tiene sumar este canal a la difusión presencial?', correcta:'Permite llegar a personas que no pudieron asistir presencialmente a la muestra', opts:['No aporta ninguna ventaja adicional','Reemplaza por completo la necesidad de una muestra presencial','Solo sirve para mostrarlo a los propios autores'] },
  { pregunta:'Al implementar una muestra de arte en un espacio público (como una plaza), ¿qué aspecto de seguridad es importante coordinar previamente?', correcta:'Que el montaje no bloquee el paso de las personas ni represente un riesgo para el público', opts:['Ningún aspecto de seguridad es relevante en un espacio público','Que el montaje bloquee por completo el paso de peatones','Evitar cualquier tipo de supervisión durante el evento'] },
];
export function genImplementacionDifusionM2Round(){
  const recurso = 'Implementar una <b>propuesta de difusión de arte</b> hacia la comunidad va más allá de diseñar el montaje: incluye pasos concretos de ejecución, como difundir la invitación con anticipación (afiches, redes sociales), coordinar el espacio, horario y permisos con quien organice el lugar (el colegio, una feria local, un centro cultural), y pensar actividades que involucren al público durante la inauguración, como un recorrido guiado por los propios autores. Después de implementada la muestra, recoger comentarios del público que asistió ayuda a evaluar qué funcionó bien y qué se puede mejorar en la siguiente propuesta de difusión — cerrando así el ciclo completo de crear, exhibir y aprender de la experiencia.';
  const item = pick(IMPLEMENTACION_DIFUSION_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

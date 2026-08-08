import { render } from '../render.js';

/* =========================================================
   Colorear por Números — herramienta de consulta (no es un juego con
   motor de opción múltiple: sin rondas, estrellas ni XP, mismo criterio
   que Diccionario Español/English Dictionary).

   REESCRITO POR COMPLETO 2026-08-08 (pedido explícito del usuario, con una
   lista detallada de problemas reales encontrados jugando: la cola de
   Carboncito no se podía pintar, el fondo no se podía pintar, "algunas
   partes" quedaban bloqueadas, y pidió eliminar los números del todo y que
   cada objeto se pinte de forma independiente, "como una app de colorear
   de verdad"). El mecanismo anterior (arte SVG a mano con `data-num` +
   clic sobre el elemento) tenía un problema de fondo: cada región debía
   declararse a mano con su propio número, así que cualquier forma a la que
   se le olvidara asignar `data-num` (o que perdiera su número por falta de
   espacio visual — ver el historial de bugs de este mismo archivo) quedaba
   invisible al clic. Ese bug se corrigió puntualmente 3 veces distintas en
   el pasado (hombro/sombra de oreja de Carboncito, tapacubos del Auto, ojo
   del Pez) y siguió reapareciendo porque el mecanismo mismo dependía de
   nunca olvidar una asignación manual.

   En vez de seguir parchando data-num uno por uno, TODO el módulo ahora usa
   un solo mecanismo — el mismo relleno por inundación (flood fill) sobre
   `<canvas>` que ya se había construido y probado a fondo para "Paisaje"
   (ver `floodFillCanvas()`/`buildWallMask()` más abajo, sin cambios de
   lógica). La clave: el flood fill no necesita que nadie declare qué
   regiones existen — cualquier área del lienzo delimitada por una línea
   oscura cerrada es, automáticamente, su propio objeto pintable. Esto
   resuelve los 3 bugs reportados a la vez, sin necesidad de mantener una
   lista de regiones:
     - El fondo (el área del lienzo fuera de la silueta del dibujo) nunca
       necesitó una forma explícita: el flood fill se detiene solo en el
       borde del canvas o en la primera línea oscura que encuentra, así que
       "tocar afuera del dibujo" simplemente pinta todo ese espacio abierto.
     - Cualquier parte que antes hubiera quedado sin `data-num` por
       descuido ahora es pintable igual, porque ya no hace falta ningún
       atributo — solo una línea cerrada.
     - Los 4 dibujos que antes eran SVG a mano (Carboncito, Auto, Casa, Pez)
       y el 5° (Playa Tropical) generan su "línea negra" en el momento (una
       función `build()` que arma el mismo tipo de arte a mano que el resto
       de la app, sin colores fijos — todo empieza en blanco, listo para
       pintar), esa línea se serializa a un `data:image/svg+xml`, se carga
       como `<img>`, y se rasteriza sobre un `<canvas>` real — exactamente
       el mismo paso que ya hacía Paisaje con su imagen PNG real. A partir
       de ahí, los 6 dibujos comparten 100% del mismo código de clic/
       relleno/guardar: no hay dos mecanismos distintos que mantener nunca
       más.
     - A Carboncito se le agregó una cola rizada (no existía ninguna forma
       de cola en el dibujo original — literalmente faltaba, no estaba
       "bloqueada" sino ausente) y ojos/nariz/collar, que antes tenían un
       color fijo sin borde propio, ahora son regiones blancas con su
       propio trazo — así también se pueden repintar, cumpliendo el pedido
       de que CUALQUIER objeto del dibujo se pueda colorear.

   Ya no existen los números-guía (`data-num`/`<text class="colorear-num">`)
   ni la leyenda "Guía: número→color sugerido" — ambos dependían del
   sistema de regiones numeradas que se eliminó. "Guardar" sigue exportando
   un PNG real (`canvas.toBlob()`), ahora siempre desde el `<canvas>` (nunca
   desde un `<svg>` serializado aparte, ya que los 6 dibujos son canvas).

   Estado interno del módulo (no vive en state.js/persistence.js a
   propósito: es UI efímera de una herramienta de consulta, no progreso del
   niño que valga la pena persistir entre sesiones). */

/* Paleta rediseñada (2026-08-08, pedido explícito del usuario: "paleta más
   grande y visible... más moderna... incluir un selector de color visual
   además de los predefinidos... mostrar claramente el color seleccionado").
   Se mantienen los mismos 16 tonos curados (sin cambiar la selección de
   colores en sí, ya ampliada en 2026-08-03) — lo que cambia es el tamaño/
   diseño de cada swatch (ver styles.css) y que ahora conviven con un
   selector de color nativo (`<input type="color">`, ver `paletteHTML()`)
   para cualquier tono fuera de esta lista. */
export const PALETTE_COLOREAR = [
  { n:1, color:'#FFD54F', name:'Amarillo' },
  { n:2, color:'#FF8A65', name:'Naranjo' },
  { n:3, color:'#4FC3F7', name:'Celeste' },
  { n:4, color:'#E57373', name:'Rojo' },
  { n:5, color:'#90A4AE', name:'Gris' },
  { n:6, color:'#7986CB', name:'Azul' },
  { n:7, color:'#81C784', name:'Verde' },
  { n:8, color:'#A1887F', name:'Café' },
  { n:9, color:'#F06292', name:'Rosado' },
  { n:10, color:'#BA68C8', name:'Morado' },
  { n:11, color:'#4DB6AC', name:'Turquesa' },
  { n:12, color:'#558B2F', name:'Verde oscuro' },
  { n:13, color:'#303F9F', name:'Azul oscuro' },
  { n:14, color:'#FFF176', name:'Amarillo claro' },
  { n:15, color:'#ECEFF1', name:'Blanco' },
  { n:16, color:'#4E342E', name:'Café oscuro' },
];

let currentDrawingId = null;
let currentColorNum = PALETTE_COLOREAR[0].n;
let currentColorHex = PALETTE_COLOREAR[0].color;

function colorForNum(n){
  const p = PALETTE_COLOREAR.filter(function(x){ return x.n===n; })[0];
  return p ? p.color : '#FFD54F';
}

/* ---------------- Helpers de forma (línea negra, sin número) ----------------
   Cada helper dibuja una región en blanco con borde oscuro — lista para
   pintarse por flood fill. A diferencia de la versión anterior, no llevan
   ningún identificador ni texto: la independencia de cada objeto la da el
   propio trazo cerrado, no un atributo que alguien tenga que recordar
   agregar. */
function circleShape(cx, cy, r){
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>';
}
function ellipseShape(cx, cy, rx, ry, rotate){
  const t = rotate ? ' transform="rotate('+rotate+' '+cx+' '+cy+')"' : '';
  return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#ffffff" stroke="#333" stroke-width="2.5"'+t+'/>';
}
function rectShape(x, y, w, h, rx){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>';
}
function polyShape(points){
  return '<polygon points="'+points+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>';
}
function pathShape(d){
  return '<path d="'+d+'" fill="#ffffff" stroke="#333" stroke-width="2.5" stroke-linejoin="round"/>';
}
function sunDecor(cx, cy, r){
  let rays = '';
  for(let i=0;i<8;i++){
    const ang = (i/8)*Math.PI*2;
    const x1 = Math.round(cx + Math.cos(ang)*(r+5));
    const y1 = Math.round(cy + Math.sin(ang)*(r+5));
    const x2 = Math.round(cx + Math.cos(ang)*(r+16));
    const y2 = Math.round(cy + Math.sin(ang)*(r+16));
    rays += '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>';
  }
  return rays;
}
/* Nube esponjosa (varios lóbulos vía curvas Q), parametrizada por centro y
   escala en vez de path hardcodeado. */
function cloudShape(cx, cy, scale){
  const s = scale;
  const d = 'M '+(cx-60*s)+' '+(cy+10*s)+
    ' Q '+(cx-72*s)+' '+(cy-18*s)+' '+(cx-34*s)+' '+(cy-22*s)+
    ' Q '+(cx-24*s)+' '+(cy-46*s)+' '+(cx+4*s)+' '+(cy-34*s)+
    ' Q '+(cx+30*s)+' '+(cy-50*s)+' '+(cx+50*s)+' '+(cy-26*s)+
    ' Q '+(cx+76*s)+' '+(cy-30*s)+' '+(cx+70*s)+' '+(cy-4*s)+
    ' Q '+(cx+92*s)+' '+(cy+6*s)+' '+(cx+68*s)+' '+(cy+20*s)+
    ' Q '+(cx+66*s)+' '+(cy+30*s)+' '+(cx+42*s)+' '+(cy+28*s)+
    ' L '+(cx-38*s)+' '+(cy+28*s)+
    ' Q '+(cx-68*s)+' '+(cy+30*s)+' '+(cx-60*s)+' '+(cy+10*s)+' Z';
  return pathShape(d);
}

/* ---------------- Los 5 dibujos de línea (se rasterizan a canvas) ----------------
   Mismas siluetas ya aprobadas en sesiones anteriores (curvas bézier para
   las formas principales, igual técnica que `mascotSVG()`), pero ahora
   TODO objeto queda como región blanca+borde (ver comentario de cabecera):
   ojos, nariz, collar, tapacubos y la cola nueva de Carboncito ya no son
   colores fijos sin borde — son regiones normales, iguales a cualquier
   otra. Los detalles puramente decorativos (arrugas, bigotes de sonrisa,
   rayos de sol, líneas de parachoques) siguen siendo trazos sueltos sin
   relleno: no son "objetos" en el sentido de una lámina de colorear real
   —ninguna lámina de colorear separa una arruga en su propia región—, y
   están dibujados bien adentro de la silueta que los contiene para no
   generar un micro-hueco contra el borde de esa silueta al rasterizar. */
const DIBUJOS_COLOREAR = [
  {
    id:'carboncito', label:'Carboncito', icon:'🐶', viewBox:'0 0 200 190',
    build:function(){
      /* cola rizada nueva — no existía ninguna forma de cola en el dibujo
         original, así que no es que estuviera "bloqueada": no estaba
         dibujada. Se agrega asomando junto a la cadera derecha, como un
         pug real. Se dibuja DESPUÉS del cuerpo (más abajo en esta misma
         función) a propósito: su base se superpone con el óvalo del
         cuerpo, y si se dibujara antes, el relleno del cuerpo taparía el
         trazo de la cola justo en esa zona de superposición, fusionando
         ambas regiones en una sola al rasterizar (el mismo bug ya
         encontrado y documentado para el hombro/sombra de oreja y otras
         partes de este dibujo en sesiones anteriores). */
      return pathShape('M146 116 q24 -8 22 14 q-2 16 -20 11 q-9 -2 -7 -13 q2 -8 5 -12 Z')+
        ellipseShape(100,138,50,40)+
        pathShape('M144 148 Q170 142 168 164 Q166 182 144 174 Q154 166 154 156 Q154 148 144 148 Z')+
        circleShape(78,172,12)+circleShape(122,172,12)+
        '<path d="M64 118 q36 20 72 0" stroke="#FF6B6B" stroke-width="8" fill="none" stroke-linecap="round"/>'+
        circleShape(100,130,6.5)+
        pathShape('M58 70 q-24 6 -15 36 q7 19 25 10 Z')+
        pathShape('M142 70 q24 6 15 36 q-7 19 -25 10 Z')+
        circleShape(100,88,46)+
        '<path d="M72 59 q28 -14 56 0" stroke="#5C5450" stroke-width="3" fill="none" stroke-linecap="round"/>'+
        '<path d="M76 69 q24 -10 48 0" stroke="#5C5450" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
        '<path d="M80 78 q20 -6 40 0" stroke="#5C5450" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
        ellipseShape(100,107,28,20)+
        '<path d="M77 100 q-5 8 2 15" stroke="#3A3532" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>'+
        '<path d="M123 100 q5 8 -2 15" stroke="#3A3532" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>'+
        ellipseShape(100,101,9.5,7.5)+
        '<path d="M91 115 q9 9 18 0" stroke="#131110" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
        pathShape('M104 115 q11 6 8 17 q-2 8 -11 6 q-6 -2 -5 -11 q1 -8 8 -12 Z')+
        '<path d="M106 121 q3 4 2 8" stroke="#E8788F" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.55"/>'+
        circleShape(79,83,12)+circleShape(121,83,12)+
        circleShape(79,84,6.5)+circleShape(121,84,6.5)+
        '<circle cx="82.5" cy="78.5" r="3.8" fill="#fff"/>'+
        '<circle cx="124.5" cy="78.5" r="3.8" fill="#fff"/>';
    },
  },
  {
    id:'auto', label:'Auto', icon:'🚗',
    build:function(){
      return sunDecor(255,50,26)+circleShape(255,50,26)+
        rectShape(0,235,300,65,7)+
        pathShape('M30 205 L30 178 Q30 158 52 152 L85 152 Q98 112 130 100 L195 100 Q225 112 240 152 L268 152 Q290 158 290 178 L290 205 Z')+
        pathShape('M92 150 L112 108 L148 108 L148 150 Z')+
        pathShape('M154 150 L154 108 L188 108 Q210 118 224 150 Z')+
        '<line x1="150" y1="108" x2="150" y2="150" stroke="#333" stroke-width="3"/>'+
        circleShape(95,208,30)+circleShape(225,208,30)+
        circleShape(95,208,11)+circleShape(225,208,11)+
        circleShape(280,168,9)+
        '<path d="M52 152 Q68 145 85 152" fill="none" stroke="#333" stroke-width="2"/>';
    },
  },
  {
    id:'casa', label:'Casa', icon:'🏠',
    build:function(){
      return circleShape(248,55,28)+sunDecor(248,55,28)+
        ellipseShape(65,62,20,14)+ellipseShape(85,55,26,17)+ellipseShape(105,63,18,13)+
        rectShape(0,242,300,58,7)+
        polyShape('52,145 150,55 248,145')+
        rectShape(75,145,150,97,1)+
        rectShape(196,85,16,32,5)+
        pathShape('M150,197 L150,225 Q150,242 168,242 L172,242 Q190,242 190,225 L190,197 Z')+
        rectShape(92,165,32,32,6)+
        rectShape(176,165,32,32,6);
    },
  },
  {
    id:'pez', label:'Pez', icon:'🐟',
    build:function(){
      return rectShape(0,258,300,42,8)+
        ellipseShape(50,255,7,28,15)+ellipseShape(250,262,7,25,-10)+
        circleShape(228,85,9)+circleShape(246,66,6)+
        pathShape('M108 150 Q65 122 32 130 Q52 150 32 172 Q65 180 108 152 Z')+
        pathShape('M158 108 Q172 68 208 62 Q198 92 178 108 Z')+
        pathShape('M158 192 Q172 230 205 238 Q195 208 178 192 Z')+
        pathShape('M100 150 Q98 96 172 92 Q252 90 262 150 Q252 210 172 208 Q98 204 100 150 Z')+
        circleShape(222,140,11)+
        circleShape(225,140,5)+
        '<circle cx="223" cy="138" r="1.6" fill="#fff"/>'+
        '<path d="M118 168 Q128 178 138 168" fill="none" stroke="#1D2B3A" stroke-width="3" stroke-linecap="round"/>';
    },
  },
  /* ---------------- Paisaje (bosque y cerros) ----------------
     Lámina PNG real (línea negra sobre fondo transparente) generada por el
     usuario en una herramienta externa — ver el comentario de cabecera del
     archivo para la historia completa. Sin cambios en esta sesión más allá
     de quitarle el número/leyenda: `colorGuide` y su lógica de leyenda se
     eliminaron por completo del módulo (ver comentario de cabecera). */
  { id:'paisaje', label:'Paisaje', icon:'🏞️', image:'img/colorear/paisaje-bosque.png' },
  /* ---------------- Mandala (lámina PNG real) ----------------
     Agregado 2026-08-08, pedido explícito del usuario: subirá láminas de
     mandala reales (PNG, línea negra sobre fondo — en este caso opaco, no
     transparente, a diferencia de Paisaje) para que se puedan pintar por
     completo, "cada pieza del png". Mismo mecanismo que Paisaje, sin
     ningún cambio de código — el flood fill no distingue entre un dibujo
     hecho a mano y uno con cientos de piezas diminutas, mientras la lámina
     tenga líneas cerradas. Verificado antes de integrar (ver CLAUDE.md):
     un análisis de componentes conexas sobre esta imagen real encontró 1
     sola región de fondo (limpia, sin fugas hacia el mandala) y ~920
     piezas internas de tamaño pintable, más un puñado de puntos
     decorativos de 1-4px (demasiado chicos para tocarlos, equivalentes a
     los brillos de ojo ya fijos en Carboncito/Pez). */
  { id:'mandala', label:'Mandala', icon:'🌸', image:'img/colorear/mandala-flor.png' },
  /* ---------------- Playa Tropical ---------------- */
  {
    id:'playa', label:'Playa Tropical', icon:'🏖️', viewBox:'0 0 400 300',
    build:function(){
      return circleShape(370,40,22)+sunDecor(370,40,22)+
        cloudShape(150,55,0.8)+
        rectShape(0,100,400,85)+
        pathShape('M0 190 Q50 172 100 190 Q150 172 200 190 Q250 172 300 190 Q350 172 400 190 L400 228 L0 228 Z')+
        rectShape(0,228,400,72)+
        polyShape('45,230 65,230 60,110 50,110')+
        ellipseShape(43,103,18,9,-150)+
        ellipseShape(55,96,18,9,-90)+
        ellipseShape(67,103,18,9,-30)+
        polyShape('365,230 385,230 380,110 370,110')+
        ellipseShape(363,103,14,9,-150)+
        ellipseShape(375,96,14,9,-90)+
        ellipseShape(387,103,14,9,-30)+
        rectShape(85,240,60,45)+
        circleShape(95,232,9)+
        circleShape(115,228,10)+
        circleShape(135,232,9)+
        rectShape(160,258,70,35,11)+
        pathShape('M245,285 Q240,265 253,260 Q257,250 265,258 Q271,248 277,258 Q283,250 287,260 Q297,265 290,285 Z')+
        pathShape('M300 270 Q300 235 328 235 Q356 235 356 270 Z')+
        '<line x1="328" y1="268" x2="328" y2="295" stroke="#333" stroke-width="4"/>'+
        ellipseShape(190,220,20,14)+
        ellipseShape(212,230,14,10)+
        polyShape('258,25 280,33 302,25 296,37 280,43 264,37')+
        pathShape('M255 150 Q250 165 260 165 L320 165 Q330 165 325 150 Z')+
        polyShape('290,150 290,115 315,150');
    },
  },
];

function drawingById(id){
  return DIBUJOS_COLOREAR.filter(function(d){ return d.id===id; })[0];
}

/* Convierte el `build()` de un dibujo de línea en una imagen real (data URL)
   que se puede cargar en un <img> y rasterizar en <canvas> — el mismo punto
   de entrada que usa el PNG real de Paisaje (`initRasterCanvas()`), así los
   6 dibujos terminan compartiendo un solo camino de clic/relleno/guardar.
   Escala ×3 sobre el viewBox para que el trazo quede nítido y el PNG
   exportado ("Guardar") tenga buena resolución. */
function svgDataUrlFor(d){
  const vb = d.viewBox || '0 0 300 300';
  const parts = vb.split(/\s+/).map(Number);
  const w = parts[2] || 300, h = parts[3] || 300;
  const scale = 3;
  const svgStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+vb+'" width="'+Math.round(w*scale)+'" height="'+Math.round(h*scale)+'">'+d.build()+'</svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgStr);
}

/* Sin número visible en el swatch (ya no hay ningún sistema de números con
   el que pudiera confundirse — ver comentario de cabecera). El indicador
   "Color elegido" de arriba es la única fuente de verdad sobre qué color
   está activo, tanto si viene de la paleta como del selector personalizado. */
function paletteHTML(){
  const swatches = PALETTE_COLOREAR.map(function(p){
    const active = p.n===currentColorNum ? ' active' : '';
    return '<button class="palette-swatch'+active+'" data-num="'+p.n+'" style="background:'+p.color+'" onclick="pickColorNum('+p.n+')" aria-label="Color '+p.name+'"></button>';
  }).join('');
  const pickerActive = currentColorNum==null ? ' active' : '';
  return '<div class="colorear-current">'+
      '<span class="colorear-current-swatch" style="background:'+currentColorHex+'"></span>'+
      '<span>Color elegido</span>'+
    '</div>'+
    '<div class="colorear-palette">'+
      swatches+
      '<label class="palette-swatch palette-picker'+pickerActive+'" aria-label="Elegir otro color">'+
        '<input type="color" value="'+currentColorHex+'" oninput="pickColorHex(this.value)" onchange="pickColorHex(this.value)">'+
        '<span class="palette-picker-icon">🎨</span>'+
      '</label>'+
    '</div>';
}

function pickerHTML(){
  const cards = DIBUJOS_COLOREAR.map(function(d){
    return '<button class="drawing-thumb" onclick="selectColoringDrawing(\''+d.id+'\')">'+
      '<span class="drawing-thumb-icon">'+d.icon+'</span><b>'+d.label+'</b>'+
    '</button>';
  }).join('');
  return '<div class="drawing-picker">'+cards+'</div>';
}

function coloringHTML(){
  return '<div class="colorear-toolbar">'+
      '<button class="colorear-tool-btn" onclick="backToDrawingPicker()">🔄 Cambiar dibujo</button>'+
      '<button class="colorear-tool-btn" onclick="clearColoring()">🧹 Borrar todo</button>'+
      '<button class="colorear-tool-btn save" onclick="saveColoringPNG()">💾 Guardar</button>'+
    '</div>'+
    '<div class="colorear-canvas-wrap"><canvas id="colorear-canvas"></canvas></div>'+
    '<p class="colorear-hint">Elige un color y toca cualquier parte del dibujo para pintarla.</p>'+
    paletteHTML();
}

/* ---------------- Motor de relleno por inundación (flood fill sobre canvas) ----------------
   Sin cambios de lógica respecto a la versión que se construyó y probó a
   fondo para Paisaje — ahora es el ÚNICO mecanismo de dibujo del módulo,
   compartido por los 6 dibujos (5 rasterizados desde línea propia + 1 PNG
   real). `canvas._sourceImg` guarda el `<img>` ya cargado para poder
   redibujar el estado original en `clearColoring()` sin pedirlo de nuevo. */
function drawRasterBase(canvas, img){
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
/* Horizonte sintético — SOLO hace falta para la lámina PNG real de Paisaje
   (su línea de "piso" no es continua de borde a borde, ver el comentario
   original más abajo); los 5 dibujos de línea propia sí tienen un contorno
   cerrado desde el principio (son paths matemáticos con `Z`, no arte
   escaneado), así que nunca necesitan este parche — `canvas._synthHorizon`
   controla si se aplica. */
function traceGroundPoints(ctx, w, h){
  const data = ctx.getImageData(0, 0, w, h).data;
  function isDark(x, y){
    const i = (y*w + x) * 4;
    return data[i+3]>40 && (data[i]+data[i+1]+data[i+2])/3 < 170;
  }
  const step = Math.max(8, Math.round(w/64));
  const yMin = Math.floor(h*0.42), yMax = Math.floor(h*0.78);
  const pts = [];
  for(let x=0; x<w; x+=step){
    let found = -1;
    for(let y=yMin; y<=yMax; y++){ if(isDark(x,y)){ found=y; break; } }
    pts.push([x, found]);
  }
  if(pts[pts.length-1][0] !== w-1) pts.push([w-1, -1]);
  let lastKnown = null;
  for(let i=0;i<pts.length;i++){
    if(pts[i][1] === -1){
      let j = i+1;
      while(j<pts.length && pts[j][1]===-1) j++;
      const prevY = lastKnown!=null ? lastKnown : (pts[j] ? pts[j][1] : Math.round((yMin+yMax)/2));
      const nextY = j<pts.length ? pts[j][1] : prevY;
      const span = j-i+1;
      for(let k=i;k<j;k++){ pts[k][1] = Math.round(prevY + (nextY-prevY)*((k-i+1)/span)); }
      i = j-1;
    } else {
      lastKnown = pts[i][1];
    }
  }
  return pts.map(function(p, i){
    const a = pts[Math.max(0,i-1)][1], b = p[1], c = pts[Math.min(pts.length-1,i+1)][1];
    return [p[0], Math.round((a+b+c)/3)];
  });
}
function drawSyntheticHorizon(canvas){
  const ctx = canvas.getContext('2d');
  const pts = traceGroundPoints(ctx, canvas.width, canvas.height);
  ctx.save();
  ctx.strokeStyle = '#222';
  ctx.lineWidth = Math.max(3, Math.round(canvas.width/450));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for(let i=1;i<pts.length;i++){
    const prev = pts[i-1], cur = pts[i];
    ctx.quadraticCurveTo(prev[0], prev[1], (prev[0]+cur[0])/2, (prev[1]+cur[1])/2);
  }
  ctx.lineTo(pts[pts.length-1][0], pts[pts.length-1][1]);
  ctx.stroke();
  ctx.restore();
}
function resetRasterCanvas(canvas){
  drawRasterBase(canvas, canvas._sourceImg);
  if(canvas._synthHorizon) drawSyntheticHorizon(canvas);
  canvas._wallMask = buildWallMask(canvas);
}
function initRasterCanvas(src, synthHorizon){
  const canvas = document.getElementById('colorear-canvas');
  if(!canvas) return;
  canvas._synthHorizon = !!synthHorizon;
  const img = new Image();
  img.onload = function(){
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas._sourceImg = img;
    resetRasterCanvas(canvas);
  };
  img.src = src;
  canvas.addEventListener('click', function(e){
    if(!canvas.width) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const seed = nearestPaintablePixel(x, y, canvas._wallMask, canvas.width, canvas.height);
    if(!seed) return;
    floodFillCanvas(canvas.getContext('2d'), seed[0], seed[1], hexToRgb(currentColorHex), canvas._wallMask);
  });
}
/* "Perdona" un clic que cae justo sobre el trazo (2026-08-08, encontrado al
   integrar la primera lámina de mandala): en una imagen con líneas muy
   finas y cientos de piezas diminutas, la conversión de un clic real a un
   píxel exacto ya viene con un margen de error de ±1px (el navegador
   redondea `clientX`/`clientY` a entero, y con el lienzo mostrado más chico
   que su resolución real, cada píxel de pantalla equivale a más de un
   píxel real de la imagen) — así que un toque perfectamente intencional,
   apenas 1px más cerca del trazo de lo esperado, terminaba sin pintar nada
   (`floodFillCanvas` se detiene de inmediato si el píxel tocado es parte
   del "muro"). Verificado con clics reales dirigidos a píxeles ya
   confirmados como pintables por un análisis de componentes conexas: la
   mitad fallaban en silencio por este motivo, sin ningún error, solo "no
   pasó nada" — exactamente lo que reportaría un niño tocando una pieza
   chica del mandala. En vez de agrandar el lienzo (no elimina el problema,
   solo lo reduce) se agrega esta búsqueda en espiral del píxel pintable
   más cercano al punto tocado (hasta 6px de radio, más que suficiente para
   el grosor de línea de cualquier lámina de este módulo) — si el clic cae
   justo en el trazo, el relleno arranca desde la pieza vecina más cercana
   en vez de no hacer nada. */
function nearestPaintablePixel(x, y, wallMask, w, h){
  if(x<0||y<0||x>=w||y>=h) return null;
  if(!wallMask[y*w+x]) return [x, y];
  for(let r=1; r<=6; r++){
    for(let dy=-r; dy<=r; dy++){
      for(let dx=-r; dx<=r; dx++){
        if(Math.max(Math.abs(dx),Math.abs(dy))!==r) continue;
        const nx=x+dx, ny=y+dy;
        if(nx<0||ny<0||nx>=w||ny>=h) continue;
        if(!wallMask[ny*w+nx]) return [nx, ny];
      }
    }
  }
  return null;
}
function hexToRgb(hex){
  const v = parseInt(hex.slice(1), 16);
  return [(v>>16)&255, (v>>8)&255, v&255];
}
function buildWallMask(canvas){
  const w = canvas.width, h = canvas.height;
  const octx = canvas.getContext('2d');
  const d = octx.getImageData(0, 0, w, h).data;
  const raw = new Uint8Array(w*h);
  for(let p=0;p<w*h;p++){
    const i = p*4;
    const lum = (d[i]+d[i+1]+d[i+2])/3;
    if(d[i+3]>40 && lum<170) raw[p] = 1;
  }
  const mask = new Uint8Array(w*h);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const p = y*w+x;
      if(raw[p] || (x>0&&raw[p-1]) || (x<w-1&&raw[p+1]) || (y>0&&raw[p-w]) || (y<h-1&&raw[p+w])){
        mask[p] = 1;
      }
    }
  }
  return mask;
}
function floodFillCanvas(ctx, startX, startY, fillColor, wallMask){
  const canvas = ctx.canvas;
  const w = canvas.width, h = canvas.height;
  if(startX<0 || startY<0 || startX>=w || startY>=h) return;
  if(wallMask && wallMask[startY*w+startX]) return;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const idx0 = (startY*w + startX) * 4;
  const tR = data[idx0], tG = data[idx0+1], tB = data[idx0+2];
  const fr = fillColor[0], fg = fillColor[1], fb = fillColor[2];
  if(Math.abs(tR-fr)+Math.abs(tG-fg)+Math.abs(tB-fb) < 12) return;
  const tol = 60;
  const visited = new Uint8Array(w*h);
  const stack = [startX, startY];
  while(stack.length){
    const y = stack.pop();
    const x = stack.pop();
    if(x<0 || y<0 || x>=w || y>=h) continue;
    const vi = y*w + x;
    if(visited[vi] || (wallMask && wallMask[vi])) continue;
    const i = vi*4;
    if(Math.abs(data[i]-tR)>tol || Math.abs(data[i+1]-tG)>tol || Math.abs(data[i+2]-tB)>tol) continue;
    visited[vi] = 1;
    data[i] = fr; data[i+1] = fg; data[i+2] = fb; data[i+3] = 255;
    stack.push(x+1,y, x-1,y, x,y+1, x,y-1);
  }
  ctx.putImageData(imgData, 0, 0);
}

export function renderColorearNumerosScreen(){
  return '<div class="screen colorear-screen">'+
    '<p class="section-title">🎨 Colorear por Números</p>'+
    '<p class="section-sub">Elige un dibujo y píntalo del todo — cada parte se puede colorear.</p>'+
    (currentDrawingId ? coloringHTML() : pickerHTML())+
  '</div>';
}

export function initColorearNumeros(){
  const d = drawingById(currentDrawingId);
  if(!d) return;
  const src = d.image || svgDataUrlFor(d);
  initRasterCanvas(src, d.id==='paisaje');
}

export function selectColoringDrawing(id){
  currentDrawingId = id;
  render();
}
export function backToDrawingPicker(){
  currentDrawingId = null;
  render();
}
/* Ojo: ninguna de las dos funciones de abajo llama a render() — un render()
   completo reconstruye el <canvas> desde cero, borrando lo ya pintado (bug
   real ya encontrado y corregido en la versión anterior del módulo).
   Cambiar de color solo debe actualizar el indicador y qué swatch se ve
   activo. */
export function pickColorNum(n){
  currentColorNum = n;
  currentColorHex = colorForNum(n);
  const swatch = document.querySelector('.colorear-current-swatch');
  if(swatch) swatch.style.background = currentColorHex;
  document.querySelectorAll('.palette-swatch').forEach(function(btn){
    btn.classList.toggle('active', Number(btn.getAttribute('data-num'))===n);
  });
}
export function pickColorHex(hex){
  currentColorNum = null;
  currentColorHex = hex;
  const swatch = document.querySelector('.colorear-current-swatch');
  if(swatch) swatch.style.background = hex;
  document.querySelectorAll('.palette-swatch').forEach(function(btn){ btn.classList.remove('active'); });
  const picker = document.querySelector('.palette-picker');
  if(picker) picker.classList.add('active');
}
export function clearColoring(){
  const canvas = document.getElementById('colorear-canvas');
  if(canvas && canvas._sourceImg && canvas._sourceImg.complete) resetRasterCanvas(canvas);
}
export function saveColoringPNG(){
  const canvas = document.getElementById('colorear-canvas');
  if(!canvas) return;
  canvas.toBlob(function(blob){
    const link = document.createElement('a');
    link.download = 'mi-dibujo-leo.png';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

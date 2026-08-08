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

/* Paleta ampliada (2026-08-09, pedido explícito del usuario tras usar el
   módulo: "en la gama de colores no es suficiente y hay problemas al
   momento de seleccionar el color y en mobile influye negativamente la
   experiencia"). De 16 a 27 tonos — se agregaron variantes claras/oscuras
   de las familias de color que antes tenían un solo tono (rojo, naranjo,
   rosado, morado, verde, celeste), tonos de piel (útiles para pintar
   personajes/rostros en Héroe en la Ciudad, Playa Tropical, etc.) y un
   negro/casi-negro para detalles — sin quitar ninguno de los 16 originales
   (mismos valores hex, solo se insertaron nuevos entre medio). El problema
   de selección/mobile no era la cantidad de colores en sí sino que la
   paleta vivía al final de la pantalla, debajo del lienzo — para pintar
   había que soltar el lienzo, bajar a buscar el color, y volver a subir;
   ver `paletteHTML()`/`.colorear-palette-bar` (styles.css) para el
   rediseño a barra fija siempre visible que resuelve eso. */
export const PALETTE_COLOREAR = [
  { n:1, color:'#FFD54F', name:'Amarillo' },
  { n:2, color:'#FFF176', name:'Amarillo claro' },
  { n:3, color:'#F9A825', name:'Dorado' },
  { n:4, color:'#FF8A65', name:'Naranjo' },
  { n:5, color:'#E65100', name:'Naranjo oscuro' },
  { n:6, color:'#E57373', name:'Rojo' },
  { n:7, color:'#C62828', name:'Rojo oscuro' },
  { n:8, color:'#F06292', name:'Rosado' },
  { n:9, color:'#F8BBD0', name:'Rosado pastel' },
  { n:10, color:'#EC407A', name:'Fucsia' },
  { n:11, color:'#BA68C8', name:'Morado' },
  { n:12, color:'#6A1B9A', name:'Morado oscuro' },
  { n:13, color:'#7986CB', name:'Azul' },
  { n:14, color:'#303F9F', name:'Azul oscuro' },
  { n:15, color:'#4FC3F7', name:'Celeste' },
  { n:16, color:'#B3E5FC', name:'Celeste pastel' },
  { n:17, color:'#4DB6AC', name:'Turquesa' },
  { n:18, color:'#81C784', name:'Verde' },
  { n:19, color:'#AED581', name:'Verde lima' },
  { n:20, color:'#558B2F', name:'Verde oscuro' },
  { n:21, color:'#A1887F', name:'Café' },
  { n:22, color:'#4E342E', name:'Café oscuro' },
  { n:23, color:'#FFE0B2', name:'Piel clara' },
  { n:24, color:'#8D5524', name:'Piel oscura' },
  { n:25, color:'#90A4AE', name:'Gris' },
  { n:26, color:'#263238', name:'Negro' },
  { n:27, color:'#ECEFF1', name:'Blanco' },
];

let currentDrawingId = null;
let currentColorNum = PALETTE_COLOREAR[0].n;
let currentColorHex = PALETTE_COLOREAR[0].color;
/* Herramientas nuevas (2026-08-08, pedido explícito del usuario, con
   capturas de una barra de Paint clásica: lápiz/borrador/texto + lupa):
   'bucket' (el comportamiento original, único que existía hasta ahora) |
   'pencil' (trazo libre con el color elegido) | 'eraser' (trazo libre en
   blanco). El texto sobre el dibujo y el gotero quedaron fuera de esta
   ronda (el usuario priorizó lápiz/borrador/lupa). */
let currentTool = 'bucket';
const ZOOM_LEVELS = [1, 1.5, 2];
let currentZoom = ZOOM_LEVELS[0];

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

/* ---------------- Dibujos de línea propia (se rasterizan a canvas) ----------------
   Playa Tropical es el único que queda de la primera generación de arte a
   mano (curvas bézier, igual técnica que `mascotSVG()`) — Carboncito, Auto,
   Casa y Pez se retiraron el 2026-08-08 (pedido explícito del usuario: usar
   las láminas PNG reales nuevas, mucho más detalladas, "reemplaza los
   dibujos actuales con las mejoras") y quedan documentadas solo en el
   historial de git/CLAUDE.md, no en este archivo. TODO objeto de Playa
   Tropical queda como región blanca+borde: los detalles puramente
   decorativos (bigotes de ola, rayos de sol) siguen siendo trazos sueltos
   sin relleno, dibujados bien adentro de la silueta que los contiene para
   no generar un micro-hueco contra ese borde al rasterizar. */
const DIBUJOS_COLOREAR = [
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
  /* ---------------- Láminas nuevas, segunda ronda (2026-08-08) ----------------
     Primera ronda: 7 PNG de `Juego_Interactivo\imagenes` (mismo origen que
     el Mandala) integradas con el mismo mecanismo — pero ninguna de las 8
     imágenes de esa carpeta original tenía transparencia real, todas
     compartían el cuadriculado "horneado" como píxeles opacos (confirmado
     muestreando el canal alfa con `System.Drawing.Bitmap.GetPixel`,
     alfa=255 en el 100% de lo muestreado). El usuario pidió entonces un
     prompt maestro para Gemini que exigiera "fondo blanco sólido, nunca
     transparente" — con las láminas regeneradas (subidas a
     `Juego_Interactivo\imagenes\png`) el problema desapareció: las 7
     nuevas SÍ tienen blanco real en el borde (mismo muestreo de alfa,
     pero además valor de color ≥250 en vez de solo alfa=255 — confirmado
     antes de integrar). Pedido explícito del usuario ("no me gusta como
     quedaron dado que tienen cuadrados y no corresponde... revisa y
     reemplaza por las actuales"): se reemplazó el PNG de
     `mandalaPetalos`/`heroeCiudad`/`playaCastillo` por su versión nueva
     (mismo id/label, solo cambió el archivo), y se retiraron
     `heroeVuelo`/`heroeEspacial`/`espacioAventura`/`dinosaurios` (seguían
     con el cuadriculado horneado y el usuario no subió reemplazo para
     esos 4 — en su lugar pidió explícitamente "paisajes y después autos").
     Se agregaron 2 paisajes (montaña nevada, campo/pradera rural) y 2
     autos (deportivo, antiguo/vintage) nuevos, generados con el mismo
     prompt maestro. `heroe-vuelo.png`/`heroe-espacial.png`/
     `espacio-aventura.png`/`dinosaurios.png` se eliminaron de
     `img/colorear/` al no tener ninguna entrada que los referencie.
     `auto-carrera.png` llegó como `.jfif` (JPEG) — convertido a PNG real
     con `System.Drawing` antes de copiarlo al proyecto, ya que el motor
     de flood fill nunca debe alimentarse de un JPEG con artefactos de
     compresión (ver el "prompt maestro" — regla explícita de exportar
     siempre PNG). Verificado antes de integrar cada una (ver CLAUDE.md
     para el detalle completo de componentes conexas + clics reales). */
  { id:'mandalaPetalos', label:'Mandala Pétalos', icon:'🌼', image:'img/colorear/mandala-petalos.png' },
  { id:'heroeCiudad', label:'Héroe en la Ciudad', icon:'🦸', image:'img/colorear/heroe-ciudad.png' },
  { id:'playaCastillo', label:'Playa y Castillo', icon:'🏰', image:'img/colorear/playa-castillo.png' },
  { id:'paisajeMontana', label:'Montaña Nevada', icon:'🏔️', image:'img/colorear/paisaje-montana.png' },
  { id:'paisajeCampo', label:'Campo y Molino', icon:'🌾', image:'img/colorear/paisaje-campo.png' },
  { id:'autoCarrera', label:'Auto de Carrera', icon:'🏎️', image:'img/colorear/auto-carrera.png' },
  { id:'autoVintage', label:'Auto Antiguo', icon:'🚙', image:'img/colorear/auto-vintage.png' },
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

/* Barra de paleta FIJA (2026-08-09, pedido explícito del usuario: "en la
   gama de colores no es suficiente y hay problemas al momento de
   seleccionar el color y en mobile influye negativamente la experiencia").
   Antes la paleta vivía al final de la pantalla, debajo del lienzo — en
   mobile eso significaba soltar el dibujo, deslizar hacia abajo para
   elegir otro color, y volver a subir para seguir pintando, cada vez que
   el niño quería cambiar de color (el problema real de "selección"/
   "mobile" que reportó el usuario, no un bug puntual de un botón). Ahora
   `.colorear-palette-bar` es `position:sticky; bottom` (mismo mecanismo ya
   usado por `.topbar` arriba de la pantalla, solo que pegado abajo) — se
   mantiene visible sobre el lienzo mientras se hace scroll, sin tapar el
   resto de la pantalla cuando el contenido ya cabe entero (se comporta
   como cualquier tarjeta normal en ese caso). Los swatches ahora van en
   una fila con scroll horizontal propio (en vez de envolver en varias
   filas) para que la barra no crezca en alto sin límite a medida que se
   agregan más colores — con los 27 tonos actuales, caben ~6-7 visibles a
   la vez en mobile y se desliza para ver el resto, igual que la paleta de
   cualquier app de dibujo real. El swatch de "Color elegido" (sin texto,
   para no ocupar más alto de barra del necesario — el `title`/`aria-label`
   siguen describiéndolo para lectores de pantalla) queda FUERA de la zona
   con scroll, así siempre se ve sin importar qué tan lejos se haya
   deslizado la paleta. */
function paletteHTML(){
  const swatches = PALETTE_COLOREAR.map(function(p){
    const active = p.n===currentColorNum ? ' active' : '';
    return '<button class="palette-swatch'+active+'" data-num="'+p.n+'" style="background:'+p.color+'" onclick="pickColorNum('+p.n+')" aria-label="Color '+p.name+'"></button>';
  }).join('');
  const pickerActive = currentColorNum==null ? ' active' : '';
  return '<div class="colorear-palette-bar">'+
      '<span class="colorear-current-swatch" style="background:'+currentColorHex+'" title="Color elegido" aria-label="Color elegido"></span>'+
      '<div class="colorear-palette">'+
        swatches+
        '<label class="palette-swatch palette-picker'+pickerActive+'" aria-label="Elegir otro color">'+
          '<input type="color" value="'+currentColorHex+'" oninput="pickColorHex(this.value)" onchange="pickColorHex(this.value)">'+
          '<span class="palette-picker-icon">🎨</span>'+
        '</label>'+
      '</div>'+
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

/* Botón de herramienta con `data-tool` (no el texto/ícono) como fuente de
   verdad para marcar cuál está activa — así `pickTool()` puede actualizar
   la clase `.active` sin tener que volver a armar todo el HTML (mismo
   criterio que `pickColorNum()`/`pickColorHex()`: nunca llamar a render()
   desde una función que solo cambia una selección, para no reconstruir el
   `<canvas>` y perder lo ya pintado). */
function toolBtnHTML(tool, icon, label){
  const active = currentTool===tool ? ' active' : '';
  return '<button class="colorear-tool-btn tool-btn'+active+'" data-tool="'+tool+'" onclick="pickTool(\''+tool+'\')">'+icon+' '+label+'</button>';
}
function coloringHintText(){
  if(currentTool==='pencil') return 'Dibuja libremente con el color elegido.';
  if(currentTool==='eraser') return 'Toca o arrastra para borrar solo lo que pintaste, sin borrar el dibujo.';
  return 'Elige un color y toca cualquier parte del dibujo para pintarla.';
}
function coloringHTML(){
  return '<div class="colorear-toolbar">'+
      '<button class="colorear-tool-btn" onclick="backToDrawingPicker()">🔄 Cambiar dibujo</button>'+
      '<button class="colorear-tool-btn" onclick="clearColoring()">🧹 Borrar todo</button>'+
      '<button class="colorear-tool-btn save" onclick="saveColoringPNG()">💾 Guardar</button>'+
    '</div>'+
    '<div class="colorear-toolbar">'+
      toolBtnHTML('bucket','🎨','Balde')+
      toolBtnHTML('pencil','✏️','Lápiz')+
      toolBtnHTML('eraser','🧽','Borrador')+
      '<button class="colorear-tool-btn" onclick="zoomOut()">🔍−</button>'+
      '<span class="colorear-zoom-label">'+Math.round(currentZoom*100)+'%</span>'+
      '<button class="colorear-tool-btn" onclick="zoomIn()">🔍+</button>'+
    '</div>'+
    '<div class="colorear-canvas-wrap"><canvas id="colorear-canvas"></canvas></div>'+
    '<p class="colorear-hint">'+coloringHintText()+'</p>'+
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
/* Pre-pinta el fondo en blanco ANTES de que el niño interactúe (2026-08-08,
   pedido explícito del usuario). Motivo: algunas láminas (como el Mandala)
   no tienen transparencia real — su fondo son píxeles opacos con un patrón
   de cuadros gris/blanco "horneado" por el generador de IA que las creó
   (ver el comentario de cabecera del archivo) — sin este paso, ese
   cuadriculado se veía tal cual hasta que alguien tocaba el fondo a mano.
   Se prueban 8 puntos a lo largo del borde del lienzo (las 4 esquinas + el
   punto medio de cada lado) porque el fondo puede estar partido en más de
   una región desconectada (p. ej. el cielo y el piso de Paisaje tocan
   bordes opuestos, y no son la misma región pintable). Cada punto pasa por
   el mismo "perdón de clic" (`nearestPaintablePixel`) y el mismo
   `floodFillCanvas` que usa un clic real — es 100% equivalente a que el
   niño tocara el fondo él mismo antes de empezar, solo que ya viene hecho.
   Para dibujos que YA nacen blancos (los 5 de línea propia, y Paisaje con
   su transparencia real) esto es un no-op casi instantáneo: el chequeo de
   "el color bajo el punto ya es el buscado" de `floodFillCanvas` corta de
   inmediato sin recorrer el lienzo. */
function autoFillBackgroundWhite(canvas){
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const wallMask = canvas._wallMask;
  const inset = 1;
  const seeds = [
    [inset, inset], [w-1-inset, inset], [inset, h-1-inset], [w-1-inset, h-1-inset],
    [Math.floor(w/2), inset], [Math.floor(w/2), h-1-inset],
    [inset, Math.floor(h/2)], [w-1-inset, Math.floor(h/2)],
  ];
  seeds.forEach(function(s){
    const seed = nearestPaintablePixel(s[0], s[1], wallMask, w, h);
    if(seed) floodFillCanvas(ctx, seed[0], seed[1], [255,255,255], wallMask);
  });
}
/* Guarda una copia "prístina" del lienzo (línea original + fondo ya
   pre-pintado en blanco, ANTES de cualquier trazo del niño) en un
   `<canvas>` aparte, nunca mostrado — es la referencia que usa el
   borrador (ver `restoreFromBase()` más abajo) para devolver un punto a
   su estado original en vez de pintarlo blanco liso. Se recaptura cada
   vez que `resetRasterCanvas()` corre (carga de un dibujo nuevo Y "Borrar
   todo"), nunca por un trazo de lápiz/balde — así el borrador siempre
   revierte a "como estaba antes de que el niño tocara nada", incluida
   cualquier línea original del dibujo (nunca la borra) y cualquier línea
   nueva que el niño haya dibujado a lápiz (si el borrador pasa por
   encima, sí la quita, porque no formaba parte del estado prístino). */
function captureBaseSnapshot(canvas){
  let base = canvas._baseCanvas;
  if(!base){
    base = document.createElement('canvas');
    canvas._baseCanvas = base;
  }
  base.width = canvas.width;
  base.height = canvas.height;
  base.getContext('2d').drawImage(canvas, 0, 0);
}
function resetRasterCanvas(canvas){
  drawRasterBase(canvas, canvas._sourceImg);
  if(canvas._synthHorizon) drawSyntheticHorizon(canvas);
  canvas._wallMask = buildWallMask(canvas);
  autoFillBackgroundWhite(canvas);
  captureBaseSnapshot(canvas);
}
/* Ancho CSS del `<canvas>` según el nivel de zoom — `.colorear-canvas-wrap`
   tiene `overflow:auto` (styles.css), así que un ancho >100% simplemente
   hace aparecer scroll dentro del wrapper en vez de desbordar la página.
   El mapeo de clic/trazo a píxel real ya usa `getBoundingClientRect()`
   contra `canvas.width/height`, así que sigue alineado sin importar el
   ancho CSS mostrado — mismo mecanismo que ya validó el responsive de
   tablet/escritorio (ver CLAUDE.md). */
function applyZoom(canvas){
  if(!canvas) return;
  canvas.style.width = (currentZoom*100)+'%';
  /* `.zoomed` solo se agrega cuando currentZoom>1 — a 100% el wrapper se
     comporta exactamente igual que antes (sin max-height/scroll), así que
     este cambio no afecta a nadie que nunca toque el botón de lupa. */
  const wrap = canvas.parentElement;
  if(wrap) wrap.classList.toggle('zoomed', currentZoom>1);
}
function brushSize(canvas, tool){
  return tool==='eraser' ? Math.max(16, canvas.width*0.035) : Math.max(7, canvas.width*0.012);
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
    applyZoom(canvas);
  };
  img.src = src;
  canvas.style.touchAction = currentTool==='bucket' ? 'manipulation' : 'none';
  let drawing = false;
  let lastX = 0, lastY = 0;
  function toCanvasXY(e){
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    return [x, y];
  }
  /* Un pointerdown único (sin arrastre) debe dejar al menos un punto
     pintado — de ahí el círculo relleno antes de esperar el primer
     pointermove, mismo criterio que cualquier app de dibujo real. */
  function strokeDot(ctx, x, y, color, size){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, Math.PI*2);
    ctx.fill();
  }
  function strokeLine(ctx, x0, y0, x1, y1, color, size){
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  /* Borrador real (2026-08-09, pedido explícito del usuario: "el borrador
     borra el dibujo y [...] solo debería borrar la pintura sobre él"). En
     vez de pintar blanco liso — lo que antes borraba también la línea
     original del dibujo, ya que todo vive en un único canvas plano — esto
     COPIA los píxeles de `canvas._baseCanvas` (el estado prístino, ver
     `captureBaseSnapshot()`) de vuelta al lienzo real, solo dentro del
     área tocada. Así un trazo de borrador siempre revela lo que había
     ahí antes de que el niño tocara nada: la línea original si la había,
     o blanco si no. Solo opera sobre el rectángulo delimitador del
     segmento (nunca el lienzo completo) para que sea rápido en cada
     `pointermove`. */
  function eraseSegment(canvas, x0, y0, x1, y1, radius){
    const base = canvas._baseCanvas;
    if(!base) return;
    const w = canvas.width, h = canvas.height;
    const minX = Math.max(0, Math.floor(Math.min(x0,x1)-radius));
    const maxX = Math.min(w, Math.ceil(Math.max(x0,x1)+radius)+1);
    const minY = Math.max(0, Math.floor(Math.min(y0,y1)-radius));
    const maxY = Math.min(h, Math.ceil(Math.max(y0,y1)+radius)+1);
    const rw = maxX-minX, rh = maxY-minY;
    if(rw<=0 || rh<=0) return;
    const ctx = canvas.getContext('2d');
    const bctx = base.getContext('2d');
    const liveData = ctx.getImageData(minX, minY, rw, rh);
    const baseData = bctx.getImageData(minX, minY, rw, rh);
    const dx = x1-x0, dy = y1-y0;
    const lenSq = (dx*dx + dy*dy) || 1;
    const r2 = radius*radius;
    for(let ly=0; ly<rh; ly++){
      for(let lx=0; lx<rw; lx++){
        const x = minX+lx, y = minY+ly;
        let t = ((x-x0)*dx + (y-y0)*dy) / lenSq;
        t = t<0 ? 0 : (t>1 ? 1 : t);
        const px = x0 + t*dx, py = y0 + t*dy;
        const ddx = x-px, ddy = y-py;
        if(ddx*ddx + ddy*ddy <= r2){
          const i = (ly*rw+lx)*4;
          liveData.data[i] = baseData.data[i];
          liveData.data[i+1] = baseData.data[i+1];
          liveData.data[i+2] = baseData.data[i+2];
          liveData.data[i+3] = baseData.data[i+3];
        }
      }
    }
    ctx.putImageData(liveData, minX, minY);
  }
  canvas.addEventListener('pointerdown', function(e){
    if(!canvas.width) return;
    const xy = toCanvasXY(e);
    const x = xy[0], y = xy[1];
    if(currentTool==='bucket'){
      const seed = nearestPaintablePixel(x, y, canvas._wallMask, canvas.width, canvas.height);
      if(seed) floodFillCanvas(canvas.getContext('2d'), seed[0], seed[1], hexToRgb(currentColorHex), canvas._wallMask);
      return;
    }
    e.preventDefault();
    drawing = true;
    lastX = x; lastY = y;
    if(currentTool==='eraser'){
      eraseSegment(canvas, x, y, x, y, brushSize(canvas, currentTool)/2);
    } else {
      strokeDot(canvas.getContext('2d'), x, y, currentColorHex, brushSize(canvas, currentTool));
    }
    if(canvas.setPointerCapture){ try{ canvas.setPointerCapture(e.pointerId); }catch(err){} }
  });
  canvas.addEventListener('pointermove', function(e){
    if(!drawing) return;
    e.preventDefault();
    const xy = toCanvasXY(e);
    if(currentTool==='eraser'){
      eraseSegment(canvas, lastX, lastY, xy[0], xy[1], brushSize(canvas, currentTool)/2);
    } else {
      strokeLine(canvas.getContext('2d'), lastX, lastY, xy[0], xy[1], currentColorHex, brushSize(canvas, currentTool));
    }
    lastX = xy[0]; lastY = xy[1];
  });
  /* Al soltar, se reconstruye `_wallMask` desde el lienzo real: un trazo de
     lápiz nuevo pasa a ser una línea/muro más para el balde, y un trazo de
     borrador que tapó una línea original deja de serlo — el balde de aquí
     en adelante respeta lo que el niño acaba de dibujar/borrar. Se hace al
     soltar, no en cada `pointermove`, porque es un recorrido completo del
     lienzo (mismo costo que ya se paga una vez por dibujo/clic de balde). */
  function endStroke(){
    if(!drawing) return;
    drawing = false;
    canvas._wallMask = buildWallMask(canvas);
  }
  canvas.addEventListener('pointerup', endStroke);
  canvas.addEventListener('pointerleave', endStroke);
  canvas.addEventListener('pointercancel', endStroke);
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
  currentTool = 'bucket';
  currentZoom = ZOOM_LEVELS[0];
  render();
}
export function backToDrawingPicker(){
  currentDrawingId = null;
  render();
}
/* Ojo: ninguna de las funciones de abajo llama a render() — un render()
   completo reconstruye el <canvas> desde cero, borrando lo ya pintado (bug
   real ya encontrado y corregido en la versión anterior del módulo).
   Cambiar de color/herramienta/zoom solo debe actualizar el DOM puntual
   correspondiente. */
export function pickTool(tool){
  currentTool = tool;
  document.querySelectorAll('.tool-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.getAttribute('data-tool')===tool);
  });
  const hint = document.querySelector('.colorear-hint');
  if(hint) hint.textContent = coloringHintText();
  const canvas = document.getElementById('colorear-canvas');
  if(canvas) canvas.style.touchAction = tool==='bucket' ? 'manipulation' : 'none';
}
export function zoomIn(){
  const i = ZOOM_LEVELS.indexOf(currentZoom);
  if(i < ZOOM_LEVELS.length-1) currentZoom = ZOOM_LEVELS[i+1];
  refreshZoomUI();
}
export function zoomOut(){
  const i = ZOOM_LEVELS.indexOf(currentZoom);
  if(i > 0) currentZoom = ZOOM_LEVELS[i-1];
  refreshZoomUI();
}
function refreshZoomUI(){
  applyZoom(document.getElementById('colorear-canvas'));
  const label = document.querySelector('.colorear-zoom-label');
  if(label) label.textContent = Math.round(currentZoom*100)+'%';
}
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

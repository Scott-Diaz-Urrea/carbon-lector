import { render } from '../render.js';

/* =========================================================
   Colorear por Números — herramienta de consulta (no es un juego con
   motor de opción múltiple: sin rondas, estrellas ni XP, mismo criterio
   que Diccionario Español/English Dictionary). Pedido explícito del
   usuario (2026-08-02, con capturas de referencia de láminas reales de
   "colorear por números"): un módulo donde el niño elige un dibujo,
   completa cada región numerada con un color de la paleta, y descarga el
   resultado como imagen — sin backend (GitHub Pages es hosting estático),
   así que "guardar" significa exportar un archivo PNG al dispositivo
   (confirmado con el usuario vía AskUserQuestion, en vez de una galería
   interna con localStorage).

   Dos mecanismos de dibujo conviven en este archivo, elegidos por dibujo:

   1) SVG a mano (Carboncito, Auto, Casa, Pez, Playa Tropical): arte propio
      con formas geométricas simples (círculos, elipses, rectángulos,
      polígonos) — igual que el resto de la app (mascotSVG, shapeSVG, etc.),
      nunca imágenes externas. Cada "región" es un elemento SVG con
      `data-num`; tocarlo le cambia el atributo `fill`.

   2) Imagen PNG real + relleno por inundación en `<canvas>` (Paisaje):
      agregado 2026-08-03 tras varias rondas de arte SVG a mano que el
      usuario reportó repetidamente como "horrible"/"deforme"/"no simétrico"
      pese a múltiples correcciones — el usuario generó una lámina real en
      una herramienta externa (Copilot Designer) y pidió usarla tal cual en
      vez de seguir intentando igualar esa calidad a mano. La imagen
      (`img/colorear/<archivo>.png`, línea negra sobre fondo transparente,
      con los números ya dibujados) se compone sobre blanco en un
      `<canvas>`; el clic dispara `floodFillCanvas()` (algoritmo de
      relleno por inundación clásico, iterativo con pila explícita —sin
      recursión, para no desbordar la pila con regiones grandes—, que
      compara contra el color del píxel tocado con una tolerancia, no
      contra "blanco" fijo, para poder recolorear una región ya pintada).
      Un dibujo con la propiedad `image` en vez de `viewBox`+`build` usa
      este mecanismo — ver la rama `d.image` en `coloringHTML()`,
      `initColorearNumeros()`, `clearColoring()` y `saveColoringPNG()`.

   El número de cada región es solo una GUÍA (no se valida el color
   elegido contra un color "correcto") — mismo espíritu sin-respuesta-
   incorrecta que ya usan Escribe tu Nombre/Caligrafía (games/traza.js):
   es una actividad de creación libre, no una prueba. "Guardar" descarga
   un PNG (desde el SVG serializado, o directamente desde el `<canvas>` si
   ya es uno).

   Estado interno del módulo (no vive en state.js/persistence.js a
   propósito: es UI efímera de una herramienta de consulta, no progreso
   del niño que valga la pena persistir entre sesiones, mismo criterio que
   currentDrawingId/currentColorNum de traza.js). */

/* Paleta ampliada de 8 a 16 colores (2026-08-03, pedido explícito del
   usuario: "considerar una paleta de colores más amplia") — se agregaron 8
   tonos nuevos (rosado, morado, turquesa, verde oscuro, azul oscuro,
   amarillo claro, blanco/gris muy claro para nieve o brillos, y un café muy
   oscuro para detalles) en vez de solo variar los 8 originales, para cubrir
   casos que antes no tenían un color realista disponible (nieve/nubes muy
   claras, sombras oscuras, follaje oscuro). `.colorear-palette` ya usaba
   `flex-wrap`, así que 16 swatches simplemente arman una segunda fila sin
   necesitar cambios de CSS aparte del propio contenido. */
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
let currentColorNum = 1;

function colorForNum(n){
  const p = PALETTE_COLOREAR.filter(function(x){ return x.n===n; })[0];
  return p ? p.color : '#FFD54F';
}

/* ---------------- Helpers de forma (círculo/elipse/rect/polígono/path) ----------------
   Cada helper dibuja la forma sin rellenar (blanco, borde oscuro) +
   una etiqueta de número encima (pointer-events:none, para que el clic
   siempre caiga sobre la forma, no sobre el texto). `fontSize` es opcional
   (permite compensar el tamaño del número en dibujos con un viewBox más
   chico que el estándar de 300×300, como Carboncito). */
function circleRegion(cx, cy, r, num, fontSize, labelPos){
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  const lx = labelPos ? labelPos.x : cx;
  const ly = labelPos ? labelPos.y : cy;
  return '<circle data-num="'+num+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+lx+'" y="'+ly+'"'+style+'>'+num+'</text>';
}
function ellipseRegion(cx, cy, rx, ry, num, rotate, fontSize, labelPos){
  const t = rotate ? ' transform="rotate('+rotate+' '+cx+' '+cy+')"' : '';
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  const lx = labelPos ? labelPos.x : cx;
  const ly = labelPos ? labelPos.y : cy;
  const labelTransform = labelPos ? '' : t;
  return '<ellipse data-num="'+num+'" cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#ffffff" stroke="#333" stroke-width="2.5"'+t+'/>'+
    '<text class="colorear-num" x="'+lx+'" y="'+ly+'"'+labelTransform+style+'>'+num+'</text>';
}
function rectRegion(x, y, w, h, num, rx, fontSize, labelPos){
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  const lx = labelPos ? labelPos.x : (x+w/2);
  const ly = labelPos ? labelPos.y : (y+h/2);
  return '<rect data-num="'+num+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+lx+'" y="'+ly+'"'+style+'>'+num+'</text>';
}
function polyRegion(points, num, lx, ly, fontSize){
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  return '<polygon data-num="'+num+'" points="'+points+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+lx+'" y="'+ly+'"'+style+'>'+num+'</text>';
}
function pathRegion(d, num, lx, ly, fontSize){
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  return '<path data-num="'+num+'" d="'+d+'" fill="#ffffff" stroke="#333" stroke-width="2.5" stroke-linejoin="round"/>'+
    (lx!=null ? '<text class="colorear-num" x="'+lx+'" y="'+ly+'"'+style+'>'+num+'</text>' : '');
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
   escala en vez de path hardcodeado — evita repetir a mano la misma
   matemática de bezier dos veces para las 2 nubes del Paisaje. */
function cloudRegion(cx, cy, scale, num, fontSize, labelPos){
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
  const lx = labelPos ? labelPos.x : cx;
  const ly = labelPos ? labelPos.y : cy;
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  return '<path data-num="'+num+'" d="'+d+'" fill="#ffffff" stroke="#333" stroke-width="2.5" stroke-linejoin="round"/>'+
    '<text class="colorear-num" x="'+lx+'" y="'+ly+'"'+style+'>'+num+'</text>';
}

/* ---------------- Los 4 dibujos ----------------
   Rehechos (2026-08-02, pedido explícito del usuario: "arregla los
   dibujos, están mal realizados") — la primera versión usaba solo formas
   geométricas puras (círculos/elipses/rectángulos) superpuestas sin
   ninguna curva, lo que se veía demasiado primitivo/genérico comparado con
   el resto del arte de la app. Esta versión usa curvas bézier (`<path>`
   con comandos `Q`/`C`) para las siluetas principales, igual técnica que
   ya usa `mascotSVG()` (js/svg.js) para dar forma orgánica a orejas, cola,
   hocico, etc.

   Carboncito reutiliza literalmente las coordenadas de `mascotSVG()` (su
   propio viewBox nativo "0 0 200 190", declarado por dibujo vía el campo
   `viewBox`) — la garantía de calidad más alta posible, ya que es
   exactamente el arte ya aprobado de la mascota de la app, solo con sus
   formas convertidas a regiones rellenables (blanco + borde) en vez de
   colores fijos. Los ojos, la nariz, las arrugas y el collar quedan FIJOS
   (no rellenables) para no romper el reconocimiento facial del personaje,
   mismo criterio que mascotSVG(). */
const DIBUJOS_COLOREAR = [
  {
    id:'carboncito', label:'Carboncito', icon:'🐶', viewBox:'0 0 200 190',
    build:function(){
      const fs = 11;
      return '<ellipse cx="100" cy="178" rx="38" ry="8" fill="#1D3557" opacity="0.13"/>'+
        '<path d="M146 116 q24 -8 22 14 q-2 16 -20 11 q-9 -2 -7 -13 q2 -8 5 -12 Z" fill="#EDE7E3" stroke="#333" stroke-width="2.5"/>'+
        ellipseRegion(100,138,50,40,8,0,fs,{x:100,y:163})+
        circleRegion(78,172,12,6,fs)+circleRegion(122,172,12,6,fs)+
        '<path d="M64 118 q36 20 72 0" stroke="#FF6B6B" stroke-width="8" fill="none" stroke-linecap="round"/>'+
        '<circle cx="100" cy="130" r="6.5" fill="#FFD23F" stroke="#F0932B" stroke-width="1.5"/>'+
        pathRegion('M58 70 q-24 6 -15 36 q7 19 25 10 Z', 5, 46, 92, fs)+
        pathRegion('M142 70 q24 6 15 36 q-7 19 -25 10 Z', 5, 154, 92, fs)+
        circleRegion(100,88,46,8,fs,{x:66,y:65})+
        '<path d="M72 59 q28 -14 56 0" stroke="#5C5450" stroke-width="3" fill="none" stroke-linecap="round"/>'+
        '<path d="M76 69 q24 -10 48 0" stroke="#5C5450" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
        '<path d="M80 78 q20 -6 40 0" stroke="#5C5450" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
        ellipseRegion(100,107,28,20,2,0,fs,{x:80,y:116})+
        '<path d="M77 100 q-5 8 2 15" stroke="#3A3532" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>'+
        '<path d="M123 100 q5 8 -2 15" stroke="#3A3532" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>'+
        '<ellipse cx="100" cy="101" rx="9.5" ry="7.5" fill="#131110"/>'+
        '<path d="M91 115 q9 9 18 0" stroke="#131110" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
        pathRegion('M104 115 q11 6 8 17 q-2 8 -11 6 q-6 -2 -5 -11 q1 -8 8 -12 Z', 4, 112, 128, fs)+
        '<path d="M106 121 q3 4 2 8" stroke="#E8788F" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.55"/>'+
        '<circle cx="79" cy="83" r="12" fill="#6B4226"/>'+
        '<circle cx="121" cy="83" r="12" fill="#6B4226"/>'+
        '<circle cx="79" cy="84" r="6.5" fill="#2B1810"/>'+
        '<circle cx="121" cy="84" r="6.5" fill="#2B1810"/>'+
        '<circle cx="82.5" cy="78.5" r="3.8" fill="#fff"/>'+
        '<circle cx="124.5" cy="78.5" r="3.8" fill="#fff"/>';
    },
  },
  {
    id:'auto', label:'Auto', icon:'🚗',
    build:function(){
      return sunDecor(255,50,26)+circleRegion(255,50,26,1)+
        rectRegion(0,235,300,65,7)+
        pathRegion('M30 205 L30 178 Q30 158 52 152 L85 152 Q98 112 130 100 L195 100 Q225 112 240 152 L268 152 Q290 158 290 178 L290 205 Z', 4, 160, 185)+
        pathRegion('M92 150 L112 108 L148 108 L148 150 Z', 3, 122, 132)+
        pathRegion('M154 150 L154 108 L188 108 Q210 118 224 150 Z', 3, 185, 132)+
        '<line x1="150" y1="108" x2="150" y2="150" stroke="#333" stroke-width="3"/>'+
        circleRegion(95,208,30,5,null,{x:95,y:189})+circleRegion(225,208,30,5,null,{x:225,y:189})+
        '<circle cx="95" cy="208" r="11" fill="#1D2B3A"/>'+
        '<circle cx="225" cy="208" r="11" fill="#1D2B3A"/>'+
        circleRegion(280,168,9,1)+
        '<path d="M52 152 Q68 145 85 152" fill="none" stroke="#333" stroke-width="2"/>';
    },
  },
  {
    id:'casa', label:'Casa', icon:'🏠',
    build:function(){
      return circleRegion(248,55,28,1)+sunDecor(248,55,28)+
        ellipseRegion(65,62,20,14,5)+ellipseRegion(85,55,26,17,5)+ellipseRegion(105,63,18,13,5)+
        rectRegion(0,242,300,58,7)+
        polyRegion('52,145 150,55 248,145',4,150,110)+
        rectRegion(75,145,150,97,1)+
        rectRegion(196,85,16,32,5)+
        pathRegion('M150,197 L150,225 Q150,242 168,242 L172,242 Q190,242 190,225 L190,197 Z', 8, 170, 225)+
        rectRegion(92,165,32,32,3,6)+
        rectRegion(176,165,32,32,3,6);
    },
  },
  {
    id:'pez', label:'Pez', icon:'🐟',
    build:function(){
      return rectRegion(0,258,300,42,8)+
        ellipseRegion(50,255,7,28,7,15)+ellipseRegion(250,262,7,25,7,-10)+
        circleRegion(228,85,9,3)+circleRegion(246,66,6,3)+
        pathRegion('M108 150 Q65 122 32 130 Q52 150 32 172 Q65 180 108 152 Z', 6, 55, 152)+
        pathRegion('M158 108 Q172 68 208 62 Q198 92 178 108 Z', 7, 182, 82)+
        pathRegion('M158 192 Q172 230 205 238 Q195 208 178 192 Z', 7, 182, 216)+
        pathRegion('M100 150 Q98 96 172 92 Q252 90 262 150 Q252 210 172 208 Q98 204 100 150 Z', 6, 175, 158)+
        '<circle cx="222" cy="140" r="11" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
        '<circle cx="225" cy="140" r="5" fill="#1D2B3A"/>'+
        '<circle cx="223" cy="138" r="1.6" fill="#fff"/>'+
        '<path d="M118 168 Q128 178 138 168" fill="none" stroke="#1D2B3A" stroke-width="3" stroke-linecap="round"/>';
    },
  },
  /* ---------------- 5° dibujo: Paisaje (bosque y cerros) ----------------
     Reescrito por completo 2026-08-03 (pedido explícito del usuario, tras
     varias rondas de arte SVG a mano que seguían viéndose "horrible",
     "deforme" o "no simétrico" pese a múltiples correcciones): en vez de
     seguir dibujando geometría a mano, este dibujo ahora usa una lámina PNG
     real generada por el usuario en una herramienta externa (Copilot
     Designer) — `img/colorear/paisaje-bosque.png`, línea negra sobre fondo
     transparente, con los números 1-14 ya dibujados como parte de la imagen.
     El "relleno" ya no es una región SVG con `data-num`: es un verdadero
     relleno por inundación (flood fill) sobre `<canvas>` — ver
     `initRasterCanvas()`/`floodFillCanvas()` más abajo. `image` (en vez de
     `viewBox`+`build`) es la señal que usa `coloringHTML()`/
     `initColorearNumeros()`/`clearColoring()`/`saveColoringPNG()` para
     decidir cuál de los dos mecanismos usar — los otros dibujos (Carboncito,
     Auto, Casa, Pez, Playa) siguen siendo SVG a mano sin cambios. */
  {
    id:'paisaje', label:'Paisaje', icon:'🏞️', image:'img/colorear/paisaje-bosque.png',
    /* Leyenda de color sugerido por número (2026-08-03, pedido explícito
       del usuario: "los números, podrías colocarlos en los colores que
       corresponde") — igual que la llave de colores al pie de la lámina de
       referencia que compartió. Cada valor es el NÚMERO de
       `PALETTE_COLOREAR` (no un hex suelto), para que la leyenda muestre
       siempre un color que el niño puede elegir de verdad en la paleta de
       abajo. Es solo una sugerencia visual — igual que el resto del módulo,
       no se valida qué color eligió el niño contra esto. Verificado contra
       el análisis real de componentes conexas de la imagen (no adivinado):
       cielo=1 región propia, piso=1 región propia (comparten "verde" con
       pasto/árboles/arbustos por ser todos vegetación, a propósito). */
    colorGuide:{1:3, 2:1, 3:5, 4:5, 5:5, 6:8, 7:7, 8:6, 9:7, 10:7, 11:7, 12:7, 13:7, 14:7},
  },
  /* ---------------- 7° dibujo: Playa Tropical ----------------
     Agregado 2026-08-03, pedido explícito del usuario con un prompt de
     estilo muy detallado ("PROMPT MAESTRO"): libro para colorear infantil,
     blanco y negro puro, sin sombras/degradados/texturas/3D, contornos
     cerrados, números grandes centrados en cada elemento. A diferencia de
     Paisaje (que usa rellenos fijos de color para ojos/troncos/sombras),
     esta lámina NO usa ningún relleno fijo de color — todo elemento,
     incluidos troncos y vela del barco, es una región numerada blanca. Los
     14 elementos pedidos por el usuario, varios como conjunto de formas
     repitiendo el mismo número (igual criterio que las 2 orejas de
     Carboncito o las 3 nubes de Casa): palmeras = tronco + 3 hojas (mismo
     número), castillo = cuerpo + 3 torres, barco = casco + vela, rocas = 2
     piedras. Las hojas de palmera son elipses rotadas (mismo helper
     `ellipseRegion` ya usado en el resto de la app, con su parámetro
     `rotate`) en vez de un path a mano — mismo criterio de "usar geometría
     confiable" ya aplicado en Paisaje tras varias rondas de formas
     deformadas a mano. */
  {
    id:'playa', label:'Playa Tropical', icon:'🏖️', viewBox:'0 0 400 300',
    build:function(){
      return circleRegion(370,40,22,1)+sunDecor(370,40,22)+
        cloudRegion(150,55,0.8,2)+
        rectRegion(0,100,400,85,5)+
        pathRegion('M0 190 Q50 172 100 190 Q150 172 200 190 Q250 172 300 190 Q350 172 400 190 L400 228 L0 228 Z', 6, 300, 210)+
        rectRegion(0,228,400,72,7,0,null,{x:350,y:290})+
        polyRegion('45,230 65,230 60,110 50,110', 3, 55, 175)+
        ellipseRegion(43,103,18,9,3,-150,10)+
        ellipseRegion(55,96,18,9,3,-90,10)+
        ellipseRegion(67,103,18,9,3,-30,10)+
        polyRegion('365,230 385,230 380,110 370,110', 4, 375, 175)+
        ellipseRegion(363,103,14,9,4,-150,10)+
        ellipseRegion(375,96,14,9,4,-90,10)+
        ellipseRegion(387,103,14,9,4,-30,10)+
        rectRegion(85,240,60,45,8)+
        circleRegion(95,232,9,8)+
        circleRegion(115,228,10,8)+
        circleRegion(135,232,9,8)+
        rectRegion(160,258,70,35,11,6)+
        pathRegion('M245,285 Q240,265 253,260 Q257,250 265,258 Q271,248 277,258 Q283,250 287,260 Q297,265 290,285 Z', 9, 265, 273)+
        pathRegion('M300 270 Q300 235 328 235 Q356 235 356 270 Z', 10, 328, 253)+
        '<line x1="328" y1="268" x2="328" y2="295" stroke="#333" stroke-width="4"/>'+
        ellipseRegion(190,220,20,14,14)+
        ellipseRegion(212,230,14,10,14)+
        polyRegion('258,25 280,33 302,25 296,37 280,43 264,37', 12, 280, 34)+
        pathRegion('M255 150 Q250 165 260 165 L320 165 Q330 165 325 150 Z', 13, 270, 160)+
        polyRegion('290,150 290,115 315,150', 13, 296, 135);
    },
  },
];

function drawingById(id){
  return DIBUJOS_COLOREAR.filter(function(d){ return d.id===id; })[0];
}

/* Sin número visible en el botón (2026-08-03, corrige confusión real
   reportada por el usuario con captura: "son distintos" — el número del
   swatch de la paleta es solo un ID interno de la posición del color, sin
   ninguna relación con los números de la Guía (que son los números de
   REGIÓN dibujados en la lámina) ni con nada que el niño necesite leer;
   mostrar dígitos 1-16 justo debajo de la Guía (números 1-14, de un
   sistema totalmente distinto) hacía parecer que debían coincidir. Sin
   número, el swatch es simplemente "un color para elegir" — aria-label
   sigue llevando el nombre del color para accesibilidad. */
function paletteHTML(){
  return PALETTE_COLOREAR.map(function(p){
    const active = p.n===currentColorNum ? ' active' : '';
    return '<button class="palette-swatch'+active+'" data-num="'+p.n+'" style="background:'+p.color+'" onclick="pickColorNum('+p.n+')" aria-label="'+p.name+'"></button>';
  }).join('');
}

function pickerHTML(){
  const cards = DIBUJOS_COLOREAR.map(function(d){
    return '<button class="drawing-thumb" onclick="selectColoringDrawing(\''+d.id+'\')">'+
      '<span class="drawing-thumb-icon">'+d.icon+'</span><b>'+d.label+'</b>'+
    '</button>';
  }).join('');
  return '<div class="drawing-picker">'+cards+'</div>';
}

/* Leyenda "número → color sugerido" (ver `colorGuide` en la definición del
   dibujo) — de solo lectura, elegir el color sigue haciéndose desde la
   paleta de abajo. v2 (2026-08-03, corrige un bug real de UX reportado por
   el usuario: "hay 2 tandas de colores y no todos funcionan" — la v1 usaba
   círculos con número, IDÉNTICOS en forma y tamaño a los swatches reales de
   la paleta, apilados justo encima de ella; el usuario intentaba tocarlos
   esperando que pintaran, y no hacían nada porque nunca fueron
   interactivos. v2 usa cuadritos chicos (no círculos) con un rótulo
   "Guía:" explícito, para que se vea inequívocamente distinta de la
   paleta real, no una "primera tanda" de colores que debería funcionar
   igual. */
function legendHTML(d){
  if(!d.colorGuide) return '';
  const chips = Object.keys(d.colorGuide).sort(function(a,b){ return Number(a)-Number(b); }).map(function(num){
    const p = PALETTE_COLOREAR.filter(function(x){ return x.n===d.colorGuide[num]; })[0];
    const color = p ? p.color : '#fff';
    return '<span class="colorear-legend-chip" style="background:'+color+'">'+num+'</span>';
  }).join('');
  return '<div class="colorear-legend"><b class="colorear-legend-label">Guía:</b>'+chips+'</div>';
}
function coloringHTML(){
  const d = drawingById(currentDrawingId);
  const canvasHTML = d.image
    ? '<canvas id="colorear-canvas"></canvas>'
    : '<svg id="colorear-svg" viewBox="'+(d.viewBox||'0 0 300 300')+'">'+d.build()+'</svg>';
  return '<div class="colorear-toolbar">'+
      '<button class="colorear-tool-btn" onclick="backToDrawingPicker()">🔄 Cambiar dibujo</button>'+
      '<button class="colorear-tool-btn" onclick="clearColoring()">🧹 Borrar todo</button>'+
      '<button class="colorear-tool-btn save" onclick="saveColoringPNG()">💾 Guardar</button>'+
    '</div>'+
    '<div class="colorear-canvas-wrap">'+canvasHTML+'</div>'+
    '<p class="colorear-hint">Elige un color y toca un número para pintarlo.</p>'+
    legendHTML(d)+
    '<div class="colorear-palette">'+paletteHTML()+'</div>';
}

/* ---------------- Dibujo #2: imagen PNG real + flood fill en canvas ----------------
   Ver comentario de cabecera del archivo. `canvas._sourceImg` guarda el
   `<img>` ya cargado para poder redibujar el estado original en
   `clearColoring()` sin volver a pedirlo por red. */
function drawRasterBase(canvas, img){
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
/* Horizonte sintético (2026-08-03, corrige un problema real medido en el
   navegador, no una hipótesis: se muestreó la máscara de muro fila por fila
   en la banda donde debería estar el piso y TODAS las filas tenían cortes
   de 100 a 300px — la línea de "piso" del PNG real solo está dibujada como
   una lomita suelta bajo cada árbol/arbusto, nunca como un horizonte
   continuo de borde a borde, así que cielo y piso son literalmente la misma
   región abierta en la imagen. En vez de inventar una curva a mano (la
   lección ya aprendida varias veces hoy con el arte SVG: una curva a mano
   nueva se ve "pegada"), se RASTREA la altura real de esas lomitas ya
   dibujadas en la imagen (columna por columna, buscando el primer píxel
   oscuro en la banda 42%-78% de alto) y se conectan con curvas suaves —
   el resultado sigue el contorno que el propio dibujo ya insinúa, en vez de
   agregar una forma nueva ajena al estilo. Se traza directamente sobre el
   `<canvas>` (no sobre el `<img>` original) para que quede fijo en el
   estado base y sobreviva a "Borrar todo" — ver `resetRasterCanvas()`. */
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
  drawSyntheticHorizon(canvas);
  canvas._wallMask = buildWallMask(canvas);
}
function initRasterCanvas(src){
  const canvas = document.getElementById('colorear-canvas');
  if(!canvas) return;
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
    floodFillCanvas(canvas.getContext('2d'), x, y, hexToRgb(colorForNum(currentColorNum)), canvas._wallMask);
  });
}
function hexToRgb(hex){
  const v = parseInt(hex.slice(1), 16);
  return [(v>>16)&255, (v>>8)&255, v&255];
}
/* Máscara de "muro" (2026-08-03, corrige un bug real encontrado al probar
   en el navegador: el relleno se "escapó" del cielo al pasto, y del sol a
   un árbol/laguna/arbustos — la lámina PNG real tiene micro-cortes de 1-2px
   en algunos trazos donde dos líneas casi se tocan pero no del todo,
   invisibles a simple vista). Se calcula sobre el `<canvas>` YA COMPUESTO
   (imagen + horizonte sintético), no sobre el `<img>` original, para que el
   horizonte trazado también cuente como muro. Cualquier píxel oscuro con
   algo de opacidad se marca como muro, y ese muro se "dilata" 1px hacia sus
   4 vecinos para sellar cortes microscópicos de antialiasing.
   `floodFillCanvas()` nunca cruza un píxel marcado como muro, sin importar
   qué tan parecido sea su color al color buscado — una segunda barrera
   además de la tolerancia de color, no un reemplazo. */
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
/* Relleno por inundación clásico (pila explícita, sin recursión — una
   región grande podría desbordar la pila de llamadas si fuera recursivo).
   Compara cada píxel contra el color del píxel TOCADO (no contra "blanco"
   fijo): así una región ya pintada se puede recolorear con un color nuevo,
   igual que en el mecanismo SVG. La tolerancia por canal deja pasar el
   difuminado de antialiasing cerca del trazo sin cruzar la línea negra; el
   `wallMask` (ver `buildWallMask()`) es la barrera dura que impide fugas
   incluso si la tolerancia de color no bastara por sí sola. */
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
    '<p class="section-sub">Elige un dibujo y complétalo con los colores de la guía.</p>'+
    (currentDrawingId ? coloringHTML() : pickerHTML())+
  '</div>';
}

export function initColorearNumeros(){
  const d = drawingById(currentDrawingId);
  if(d && d.image){ initRasterCanvas(d.image); return; }
  const svg = document.getElementById('colorear-svg');
  if(!svg) return;
  svg.addEventListener('click', function(e){
    const target = e.target.closest('[data-num]');
    if(!target) return;
    target.setAttribute('fill', colorForNum(currentColorNum));
  });
}

export function selectColoringDrawing(id){
  currentDrawingId = id;
  currentColorNum = 1;
  render();
}
export function backToDrawingPicker(){
  currentDrawingId = null;
  render();
}
export function pickColorNum(n){
  /* Ojo: NO llamar a render() acá — un render() completo reconstruye el
     <svg> desde cero vía build(), volviendo todas las regiones a blanco y
     borrando lo ya coloreado (bug real encontrado al probar la app: elegir
     un color nuevo "borraba" el dibujo). Cambiar de color solo debe
     actualizar cuál swatch se ve activo, sin tocar el SVG. */
  currentColorNum = n;
  document.querySelectorAll('.palette-swatch').forEach(function(btn){
    btn.classList.toggle('active', Number(btn.getAttribute('data-num'))===n);
  });
}
export function clearColoring(){
  const canvas = document.getElementById('colorear-canvas');
  if(canvas){
    if(canvas._sourceImg && canvas._sourceImg.complete) resetRasterCanvas(canvas);
    return;
  }
  const svg = document.getElementById('colorear-svg');
  if(!svg) return;
  svg.querySelectorAll('[data-num]').forEach(function(el){ el.setAttribute('fill','#ffffff'); });
}
export function saveColoringPNG(){
  const rasterCanvas = document.getElementById('colorear-canvas');
  if(rasterCanvas){
    rasterCanvas.toBlob(function(blob){
      const link = document.createElement('a');
      link.download = 'mi-dibujo-leo.png';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    return;
  }
  const svg = document.getElementById('colorear-svg');
  if(!svg) return;
  const vb = svg.viewBox.baseVal;
  const w = vb && vb.width ? vb.width : 300;
  const h = vb && vb.height ? vb.height : 300;
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgStr], { type:'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = function(){
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = w*scale;
    canvas.height = h*scale;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(function(blob){
      const link = document.createElement('a');
      link.download = 'mi-dibujo-leo.png';
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };
  img.src = url;
}

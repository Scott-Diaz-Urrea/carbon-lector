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

   Los 4 dibujos son arte SVG 100% propio, dibujado a mano con formas
   geométricas simples (círculos, elipses, rectángulos, polígonos) — igual
   que el resto de la app (mascotSVG, shapeSVG, etc.), nunca imágenes
   externas. A diferencia de una lámina de colorear real (regiones
   irregulares tipo rompecabezas que encajan una con otra), acá cada
   "región" es una forma geométrica independiente superpuesta sobre las
   demás — una adaptación honesta dado el mismo criterio de "cero
   dependencias, todo SVG a mano" que ya rige el resto del arte de la app,
   en vez de intentar replicar el estilo de una lámina escaneada real.

   El número de cada región es solo una GUÍA (no se valida el color
   elegido contra un color "correcto") — mismo espíritu sin-respuesta-
   incorrecta que ya usan Escribe tu Nombre/Caligrafía (games/traza.js):
   es una actividad de creación libre, no una prueba. Tocar una región con
   un color de la paleta seleccionado la rellena; tocar "Borrar todo"
   reinicia el dibujo; "Guardar" serializa el SVG a un `<canvas>` oculto
   (vía Blob + Image, sin ninguna librería externa) y descarga un PNG.

   Estado interno del módulo (no vive en state.js/persistence.js a
   propósito: es UI efímera de una herramienta de consulta, no progreso
   del niño que valga la pena persistir entre sesiones, mismo criterio que
   currentDrawingId/currentColorNum de traza.js). */

export const PALETTE_COLOREAR = [
  { n:1, color:'#FFD54F', name:'Amarillo' },
  { n:2, color:'#FF8A65', name:'Naranjo' },
  { n:3, color:'#4FC3F7', name:'Celeste' },
  { n:4, color:'#E57373', name:'Rojo' },
  { n:5, color:'#90A4AE', name:'Gris' },
  { n:6, color:'#7986CB', name:'Azul' },
  { n:7, color:'#81C784', name:'Verde' },
  { n:8, color:'#A1887F', name:'Café' },
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
function circleRegion(cx, cy, r, num, fontSize){
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  return '<circle data-num="'+num+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+cx+'" y="'+cy+'"'+style+'>'+num+'</text>';
}
function ellipseRegion(cx, cy, rx, ry, num, rotate, fontSize){
  const t = rotate ? ' transform="rotate('+rotate+' '+cx+' '+cy+')"' : '';
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  return '<ellipse data-num="'+num+'" cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#ffffff" stroke="#333" stroke-width="2.5"'+t+'/>'+
    '<text class="colorear-num" x="'+cx+'" y="'+cy+'"'+t+style+'>'+num+'</text>';
}
function rectRegion(x, y, w, h, num, rx, fontSize){
  const style = fontSize ? ' style="font-size:'+fontSize+'px"' : '';
  return '<rect data-num="'+num+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+(x+w/2)+'" y="'+(y+h/2)+'"'+style+'>'+num+'</text>';
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
        pathRegion('M146 116 q24 -8 22 14 q-2 16 -20 11 q-9 -2 -7 -13 q2 -8 5 -12 Z', 5, null, null, fs)+
        ellipseRegion(100,138,50,40,8,0,fs)+
        circleRegion(78,172,12,6,fs)+circleRegion(122,172,12,6,fs)+
        '<path d="M64 118 q36 20 72 0" stroke="#FF6B6B" stroke-width="8" fill="none" stroke-linecap="round"/>'+
        '<circle cx="100" cy="130" r="6.5" fill="#FFD23F" stroke="#F0932B" stroke-width="1.5"/>'+
        pathRegion('M58 70 q-24 6 -15 36 q7 19 25 10 Z', 5, 46, 92, fs)+
        pathRegion('M142 70 q24 6 15 36 q-7 19 -25 10 Z', 5, 154, 92, fs)+
        circleRegion(100,88,46,8,fs)+
        '<path d="M72 59 q28 -14 56 0" stroke="#5C5450" stroke-width="3" fill="none" stroke-linecap="round"/>'+
        '<path d="M76 69 q24 -10 48 0" stroke="#5C5450" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
        '<path d="M80 78 q20 -6 40 0" stroke="#5C5450" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
        ellipseRegion(100,107,28,20,2,0,fs)+
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
        circleRegion(95,208,30,5)+circleRegion(225,208,30,5)+
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
        rectRegion(176,165,32,32,3,6)+
        '<line x1="108" y1="165" x2="108" y2="197" stroke="#333" stroke-width="2"/>'+
        '<line x1="92" y1="181" x2="124" y2="181" stroke="#333" stroke-width="2"/>'+
        '<line x1="192" y1="165" x2="192" y2="197" stroke="#333" stroke-width="2"/>'+
        '<line x1="176" y1="181" x2="208" y2="181" stroke="#333" stroke-width="2"/>';
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
];

function drawingById(id){
  return DIBUJOS_COLOREAR.filter(function(d){ return d.id===id; })[0];
}

function paletteHTML(){
  return PALETTE_COLOREAR.map(function(p){
    const active = p.n===currentColorNum ? ' active' : '';
    return '<button class="palette-swatch'+active+'" data-num="'+p.n+'" style="background:'+p.color+'" onclick="pickColorNum('+p.n+')" aria-label="'+p.name+'">'+p.n+'</button>';
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

function coloringHTML(){
  const d = drawingById(currentDrawingId);
  return '<div class="colorear-toolbar">'+
      '<button class="colorear-tool-btn" onclick="backToDrawingPicker()">🔄 Cambiar dibujo</button>'+
      '<button class="colorear-tool-btn" onclick="clearColoring()">🧹 Borrar todo</button>'+
      '<button class="colorear-tool-btn save" onclick="saveColoringPNG()">💾 Guardar</button>'+
    '</div>'+
    '<div class="colorear-canvas-wrap">'+
      '<svg id="colorear-svg" viewBox="'+(d.viewBox||'0 0 300 300')+'">'+d.build()+'</svg>'+
    '</div>'+
    '<p class="colorear-hint">Elige un color y toca un número para pintarlo.</p>'+
    '<div class="colorear-palette">'+paletteHTML()+'</div>';
}

export function renderColorearNumerosScreen(){
  return '<div class="screen colorear-screen">'+
    '<p class="section-title">🎨 Colorear por Números</p>'+
    '<p class="section-sub">Elige un dibujo y complétalo con los colores de la guía.</p>'+
    (currentDrawingId ? coloringHTML() : pickerHTML())+
  '</div>';
}

export function initColorearNumeros(){
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
  const svg = document.getElementById('colorear-svg');
  if(!svg) return;
  svg.querySelectorAll('[data-num]').forEach(function(el){ el.setAttribute('fill','#ffffff'); });
}
export function saveColoringPNG(){
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

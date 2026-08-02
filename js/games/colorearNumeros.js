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

/* ---------------- Helpers de forma (círculo/elipse/rect/polígono) ----------------
   Cada helper dibuja la forma sin rellenar (blanco, borde oscuro) +
   una etiqueta de número encima (pointer-events:none, para que el clic
   siempre caiga sobre la forma, no sobre el texto). */
function circleRegion(cx, cy, r, num){
  return '<circle data-num="'+num+'" cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+cx+'" y="'+cy+'">'+num+'</text>';
}
function ellipseRegion(cx, cy, rx, ry, num, rotate){
  const t = rotate ? ' transform="rotate('+rotate+' '+cx+' '+cy+')"' : '';
  return '<ellipse data-num="'+num+'" cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#ffffff" stroke="#333" stroke-width="2.5"'+t+'/>'+
    '<text class="colorear-num" x="'+cx+'" y="'+cy+'"'+t+'>'+num+'</text>';
}
function rectRegion(x, y, w, h, num, rx){
  return '<rect data-num="'+num+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+(x+w/2)+'" y="'+(y+h/2)+'">'+num+'</text>';
}
function polyRegion(points, num, lx, ly){
  return '<polygon data-num="'+num+'" points="'+points+'" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
    '<text class="colorear-num" x="'+lx+'" y="'+ly+'">'+num+'</text>';
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

/* ---------------- Los 4 dibujos (viewBox 0 0 300 300) ---------------- */
const DIBUJOS_COLOREAR = [
  {
    id:'carboncito', label:'Carboncito', icon:'🐶',
    build:function(){
      return sunDecor(245,50,32)+circleRegion(245,50,32,1)+
        rectRegion(0,235,300,65,7)+
        ellipseRegion(150,205,72,55,8)+
        circleRegion(112,252,20,8)+circleRegion(188,252,20,8)+
        ellipseRegion(103,88,17,29,5,-25)+ellipseRegion(197,88,17,29,5,25)+
        circleRegion(150,122,55,8)+
        ellipseRegion(150,148,34,24,2)+
        '<circle cx="130" cy="112" r="6" fill="#1D2B3A"/>'+
        '<circle cx="170" cy="112" r="6" fill="#1D2B3A"/>'+
        '<ellipse cx="150" cy="152" rx="7" ry="5" fill="#1D2B3A"/>'+
        '<path d="M138 165 Q150 176 162 165" fill="none" stroke="#1D2B3A" stroke-width="3" stroke-linecap="round"/>';
    },
  },
  {
    id:'auto', label:'Auto', icon:'🚗',
    build:function(){
      return sunDecor(250,45,28)+circleRegion(250,45,28,1)+
        rectRegion(0,235,300,65,7)+
        rectRegion(35,155,230,65,4,18)+
        polyRegion('80,155 120,105 195,105 225,155',6,150,130)+
        rectRegion(100,113,35,35,3)+
        rectRegion(150,113,35,35,3)+
        circleRegion(90,232,26,5)+circleRegion(210,232,26,5)+
        circleRegion(255,190,10,1);
    },
  },
  {
    id:'casa', label:'Casa', icon:'🏠',
    build:function(){
      return circleRegion(245,55,30,1)+sunDecor(245,55,30)+
        circleRegion(70,60,20,5)+circleRegion(90,55,24,5)+circleRegion(108,62,18,5)+
        rectRegion(0,240,300,60,7)+
        rectRegion(70,140,160,110,1)+
        polyRegion('60,140 150,60 240,140',4,150,105)+
        rectRegion(190,80,18,35,5)+
        rectRegion(130,190,40,60,8)+
        rectRegion(90,160,30,30,3)+
        rectRegion(180,160,30,30,3);
    },
  },
  {
    id:'pez', label:'Pez', icon:'🐟',
    build:function(){
      return rectRegion(0,255,300,45,8)+
        ellipseRegion(60,240,10,35,7,20)+ellipseRegion(230,245,10,32,7,-15)+
        circleRegion(230,90,10,3)+circleRegion(250,70,7,3)+
        polyRegion('70,150 20,120 20,180',6,45,150)+
        polyRegion('150,95 180,60 195,105',7,170,88)+
        polyRegion('150,205 180,235 190,198',7,172,210)+
        ellipseRegion(160,150,90,55,6)+
        '<circle cx="215" cy="140" r="10" fill="#ffffff" stroke="#333" stroke-width="2.5"/>'+
        '<circle cx="217" cy="140" r="4.5" fill="#1D2B3A"/>'+
        '<path d="M120 168 Q128 176 136 168" fill="none" stroke="#1D2B3A" stroke-width="3" stroke-linecap="round"/>';
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
      '<svg id="colorear-svg" viewBox="0 0 300 300">'+d.build()+'</svg>'+
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
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const svgBlob = new Blob([svgStr], { type:'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = function(){
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = 300*scale;
    canvas.height = 300*scale;
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

import { renderTraceCanvas, initTraceCanvas, TYPO_STYLES } from './traza.js';
import { showResult } from '../rewards.js';

/* Módulo "Caligrafía" — núcleo Lenguaje Verbal, Educación Parvularia NT
   (OA08: representar gráficamente trazos, letras y signos, "utilizando
   diferentes recursos y soportes" — la base para practicar más de una
   tipografía). Cuaderno de varias hojas de trazado en secuencia:
   1) los 8 trazos básicos de grafomotricidad (líneas, curvas, zigzag,
      ondas, círculo, espiral — convención universal de pre-escritura,
      previa a las letras, sin tipografía propia),
   2) las 5 vocales, cada una en las 4 tipografías de TYPO_STYLES
      (imprenta/manuscrita × mayúscula/minúscula — ver traza.js),
   3) los números del 1 al 5, cada uno en 2 estilos (imprenta/manuscrita;
      no se repite mayús/minús porque un dígito no tiene esa distinción,
      así que solo se ofrecen las variantes "-mayus" de cada familia).
   Juego a medida, no usa el motor de opción múltiple. Pedido explícito del
   usuario: las estrellas deben reflejar qué tan bien se trazó cada hoja, no
   darse siempre fijas — cada hoja usa `traceHandle.getStars()` (ver
   traza.js) y al terminar el cuaderno se otorga el promedio redondeado de
   las 38 hojas, en vez de un 3/3 fijo. */

const SHAPE_HOJAS = [
  { tipo:'shape', valor:'horizontal', titulo:'Línea Horizontal' },
  { tipo:'shape', valor:'vertical', titulo:'Línea Vertical' },
  { tipo:'shape', valor:'diagonal', titulo:'Línea Diagonal' },
  { tipo:'shape', valor:'curva', titulo:'Curva' },
  { tipo:'shape', valor:'zigzag', titulo:'Zigzag' },
  { tipo:'shape', valor:'ondas', titulo:'Ondas' },
  { tipo:'shape', valor:'circulo', titulo:'Círculo' },
  { tipo:'shape', valor:'espiral', titulo:'Espiral' },
];

const VOCALES = ['A','E','I','O','U'];
const NUMEROS = ['1','2','3','4','5'];
/* Un dígito no tiene mayús/minús, así que solo se ofrece una variante por
   familia (imprenta/manuscrita) en vez de las 4 combinaciones completas. */
const NUMERO_STYLES = TYPO_STYLES.filter(function(s){ return s.id==='imprenta-mayus' || s.id==='manuscrita-mayus'; });

const VOCAL_HOJAS = [];
VOCALES.forEach(function(v){
  TYPO_STYLES.forEach(function(s){
    VOCAL_HOJAS.push({ tipo:'text', valor:v, styleId:s.id, titulo:'Vocal '+v+' — '+s.label });
  });
});

const NUMERO_HOJAS = [];
NUMEROS.forEach(function(n){
  NUMERO_STYLES.forEach(function(s){
    const familia = s.id.indexOf('manuscrita')===0 ? 'Manuscrita' : 'Imprenta';
    NUMERO_HOJAS.push({ tipo:'text', valor:n, styleId:s.id, titulo:'Número '+n+' — '+familia });
  });
});

const HOJAS = SHAPE_HOJAS.concat(VOCAL_HOJAS, NUMERO_HOJAS);

let cal = null;
let traceHandle = null;

export function renderCaligrafiaScreen(){
  return '<div class="screen" id="caligrafia-screen"></div>';
}

export function initCaligrafiaGame(){
  cal = { hoja: 0, total: HOJAS.length, starsSum: 0 };
  drawHoja();
}

function drawHoja(){
  const el = document.getElementById('caligrafia-screen');
  if(!el) return;
  if(cal.hoja >= cal.total){ finishCaligrafia(); return; }
  const h = HOJAS[cal.hoja];
  const esUltima = cal.hoja === cal.total - 1;
  el.innerHTML =
    '<p class="section-title">Caligrafía</p>'+
    '<div class="game-progress">'+
      '<div class="progress-track"><div class="progress-fill" style="width:'+((cal.hoja/cal.total)*100)+'%"></div></div>'+
      '<div class="progress-num">'+(cal.hoja+1)+'/'+cal.total+'</div>'+
    '</div>'+
    '<p class="section-sub">'+h.titulo+' — repasa la guía con el dedo o el mouse.</p>'+
    '<div class="prompt-card">'+
      renderTraceCanvas('caligrafia-canvas', {height:190})+
    '</div>'+
    '<button class="cta-btn" id="caligrafia-next-btn">'+(esUltima ? '¡Terminar! 🎉' : 'Siguiente hoja ▶️')+'</button>';
  traceHandle = initTraceCanvas('caligrafia-canvas', h.tipo === 'shape' ? {shape:h.valor} : {text:h.valor, styleId:h.styleId});
  document.getElementById('caligrafia-next-btn').onclick = function(){
    if(traceHandle) cal.starsSum += traceHandle.getStars();
    cal.hoja++;
    drawHoja();
  };
}

const SUB_BY_STARS = {
  0: 'Sigue practicando el cuaderno, cada hoja te va a salir mejor.',
  1: 'Completaste las '+HOJAS.length+' hojas — sigue practicando el trazo.',
  2: '¡Buen trabajo! Completaste las '+HOJAS.length+' hojas del cuaderno.',
  3: '¡Excelente! Completaste las '+HOJAS.length+' hojas del cuaderno de caligrafía.',
};

function finishCaligrafia(){
  const stars = cal.total ? Math.max(0, Math.min(3, Math.round(cal.starsSum / cal.total))) : 3;
  showResult('caligrafia', stars, 3, true, SUB_BY_STARS[stars]);
}

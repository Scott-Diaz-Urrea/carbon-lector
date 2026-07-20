import { renderTraceCanvas, initTraceCanvas } from './traza.js';
import { showResult } from '../rewards.js';

/* Módulo "Caligrafía" — núcleo Lenguaje Verbal, Educación Parvularia NT
   (OA08: representar gráficamente trazos, letras y signos). Cuaderno de
   varias hojas de trazado en secuencia: primero los trazos básicos de
   grafomotricidad (líneas, curvas, zigzag, ondas, círculo, espiral —
   convención universal de pre-escritura, previa a las letras), luego las
   5 vocales y los números del 1 al 5 (signos, igual que las letras, según
   el propio texto de OA08). Juego a medida, no usa el motor de opción
   múltiple: no hay respuesta correcta/incorrecta, siempre otorga 3
   estrellas al terminar el cuaderno completo. */

const HOJAS = [
  { tipo:'shape', valor:'horizontal', titulo:'Línea Horizontal' },
  { tipo:'shape', valor:'vertical', titulo:'Línea Vertical' },
  { tipo:'shape', valor:'diagonal', titulo:'Línea Diagonal' },
  { tipo:'shape', valor:'curva', titulo:'Curva' },
  { tipo:'shape', valor:'zigzag', titulo:'Zigzag' },
  { tipo:'shape', valor:'ondas', titulo:'Ondas' },
  { tipo:'shape', valor:'circulo', titulo:'Círculo' },
  { tipo:'shape', valor:'espiral', titulo:'Espiral' },
  { tipo:'text', valor:'A', titulo:'Vocal A' },
  { tipo:'text', valor:'E', titulo:'Vocal E' },
  { tipo:'text', valor:'I', titulo:'Vocal I' },
  { tipo:'text', valor:'O', titulo:'Vocal O' },
  { tipo:'text', valor:'U', titulo:'Vocal U' },
  { tipo:'text', valor:'1', titulo:'Número 1' },
  { tipo:'text', valor:'2', titulo:'Número 2' },
  { tipo:'text', valor:'3', titulo:'Número 3' },
  { tipo:'text', valor:'4', titulo:'Número 4' },
  { tipo:'text', valor:'5', titulo:'Número 5' },
];

let cal = null;

export function renderCaligrafiaScreen(){
  return '<div class="screen" id="caligrafia-screen"></div>';
}

export function initCaligrafiaGame(){
  cal = { hoja: 0, total: HOJAS.length };
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
  initTraceCanvas('caligrafia-canvas', h.tipo === 'shape' ? {shape:h.valor} : h.valor);
  document.getElementById('caligrafia-next-btn').onclick = function(){
    cal.hoja++;
    drawHoja();
  };
}

function finishCaligrafia(){
  showResult('caligrafia', 3, 3, true, '¡Completaste las '+HOJAS.length+' hojas del cuaderno de caligrafía!');
}

import { renderTraceCanvas, initTraceCanvas, TYPO_STYLES, styleNote } from './traza.js';
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
   Juego a medida, no usa el motor de opción múltiple: no hay respuesta
   correcta/incorrecta, siempre otorga 3 estrellas al terminar el
   cuaderno completo. */

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
/* Para dígitos se usa 'manuscrita-minus' (no 'manuscrita-mayus') a propósito:
   desde que "Manuscrita MAYÚSCULA" pasó a usar Baloo 2 (ver traza.js, por
   la mezcla de mayúsculas simples/decorativas de Playwrite CL), el único
   estilo que sigue apuntando a la cursiva real de Playwrite CL es
   'manuscrita-minus' — y como un dígito no tiene mayús/minús, el
   case-transform ahí es un no-op, así que sigue mostrando el número en
   cursiva real sin verse afectado por el cambio de las letras. */
const NUMERO_STYLES = TYPO_STYLES.filter(function(s){ return s.id==='imprenta-mayus' || s.id==='manuscrita-minus'; });

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
    '<p class="typo-note">'+styleNote(h.styleId)+'</p>'+
    '<div class="prompt-card">'+
      renderTraceCanvas('caligrafia-canvas', {height:190})+
    '</div>'+
    '<button class="cta-btn" id="caligrafia-next-btn">'+(esUltima ? '¡Terminar! 🎉' : 'Siguiente hoja ▶️')+'</button>';
  initTraceCanvas('caligrafia-canvas', h.tipo === 'shape' ? {shape:h.valor} : {text:h.valor, styleId:h.styleId});
  document.getElementById('caligrafia-next-btn').onclick = function(){
    cal.hoja++;
    drawHoja();
  };
}

function finishCaligrafia(){
  showResult('caligrafia', 3, 3, true, '¡Completaste las '+HOJAS.length+' hojas del cuaderno de caligrafía!');
}

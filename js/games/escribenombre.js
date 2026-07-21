import { renderTraceCanvas, initTraceCanvas, TYPO_STYLES } from './traza.js';
import { state } from '../state.js';
import { showResult } from '../rewards.js';

/* Módulo "Escribe tu Nombre" — núcleo Lenguaje Verbal, Educación Parvularia NT
   (OA08: representar gráficamente trazos y letras). Juego a medida, no usa el
   motor de opción múltiple. Pedido explícito del usuario: las estrellas
   deben reflejar qué tan bien se trazó, no darse siempre fijas — se usa
   `traceHandle.getStars()` (ver traza.js, compara la tinta real del niño
   contra la guía por celdas) en vez del `showResult('escribenombre', 3, 3,
   true, ...)` fijo de antes.

   Selector de tipografía (4 chips: imprenta/manuscrita × mayúscula/minúscula,
   ver TYPO_STYLES en traza.js) para que el niño practique su nombre en
   distintos estilos de letra, no solo el imprenta-mayúscula por defecto. */

let currentStyleId = TYPO_STYLES[0].id;
let traceHandle = null;

const SUB_BY_STARS = {
  0: '¡Vuelve a intentarlo, la próxima te va a salir genial!',
  1: '¡Sigue practicando, cada vez te sale mejor!',
  2: '¡Buen trazo! Ya casi lo tienes perfecto.',
  3: '¡Excelente trazo, seguiste la guía a la perfección!',
};

export function renderEscribeNombreScreen(){
  return '<div class="screen" id="escribenombre-screen"></div>';
}

export function initEscribeNombreGame(){
  const el = document.getElementById('escribenombre-screen');
  if(!el) return;
  currentStyleId = TYPO_STYLES[0].id;
  const name = state.userName || 'LEO';
  el.innerHTML =
    '<p class="section-title">Escribe tu Nombre</p>'+
    '<p class="section-sub">Elige un estilo de letra y repasa tu nombre con el dedo o el mouse, como si las dibujaras.</p>'+
    '<div class="typo-selector" id="escribenombre-typo">'+
      TYPO_STYLES.map(function(s){
        return '<button type="button" class="typo-chip'+(s.id===currentStyleId?' active':'')+'" data-style="'+s.id+'">'+s.label+'</button>';
      }).join('')+
    '</div>'+
    '<div class="prompt-card">'+
      renderTraceCanvas('escribenombre-canvas', {height:200})+
    '</div>'+
    '<button class="cta-btn" id="escribenombre-done-btn">¡Ya terminé! 🎉</button>';
  traceHandle = initTraceCanvas('escribenombre-canvas', {text:name, styleId:currentStyleId});
  const chips = el.querySelectorAll('.typo-chip');
  chips.forEach(function(btn){
    btn.onclick = function(){
      currentStyleId = btn.dataset.style;
      chips.forEach(function(c){ c.classList.toggle('active', c===btn); });
      traceHandle = initTraceCanvas('escribenombre-canvas', {text:name, styleId:currentStyleId});
    };
  });
  document.getElementById('escribenombre-done-btn').onclick = function(){
    const stars = traceHandle ? traceHandle.getStars() : 3;
    showResult('escribenombre', stars, 3, true, SUB_BY_STARS[stars]);
  };
}

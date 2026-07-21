import { renderTraceCanvas, initTraceCanvas, TYPO_STYLES, styleNote } from './traza.js';
import { state } from '../state.js';
import { showResult } from '../rewards.js';

/* Módulo "Escribe tu Nombre" — núcleo Lenguaje Verbal, Educación Parvularia NT
   (OA08: representar gráficamente trazos y letras). Juego a medida, no usa el
   motor de opción múltiple: es un ejercicio libre de trazado, no una
   evaluación con respuesta correcta/incorrecta, así que siempre otorga las 3
   estrellas al terminar — el logro es practicar el trazo, no acertar.

   Selector de tipografía (imprenta/manuscrita × mayúscula/minúscula, ver
   TYPO_STYLES en traza.js) para que el niño practique su nombre en distintos
   estilos de letra, no solo el imprenta-mayúscula por defecto. Se excluye
   'manuscrita-mayus' a pedido del usuario: esa variante usa Baloo 2 igual
   que 'imprenta-mayus' (ver comentario junto a TYPO_STYLES en traza.js — el
   diseño por defecto de Playwrite CL mezclaba mayúsculas simples y muy
   ornamentadas, así que la mayúscula manuscrita se resolvió con la misma
   fuente que imprenta), por lo que mostrar ambas como chips separadas acá
   era confuso/redundante para el niño. Caligrafía sigue usando las 4. */
const NAME_STYLES = TYPO_STYLES.filter(function(s){ return s.id !== 'manuscrita-mayus'; });

let currentStyleId = NAME_STYLES[0].id;

export function renderEscribeNombreScreen(){
  return '<div class="screen" id="escribenombre-screen"></div>';
}

export function initEscribeNombreGame(){
  const el = document.getElementById('escribenombre-screen');
  if(!el) return;
  currentStyleId = NAME_STYLES[0].id;
  const name = state.userName || 'LEO';
  el.innerHTML =
    '<p class="section-title">Escribe tu Nombre</p>'+
    '<p class="section-sub">Elige un estilo de letra y repasa tu nombre con el dedo o el mouse, como si las dibujaras.</p>'+
    '<div class="typo-selector" id="escribenombre-typo">'+
      NAME_STYLES.map(function(s){
        return '<button type="button" class="typo-chip'+(s.id===currentStyleId?' active':'')+'" data-style="'+s.id+'">'+s.label+'</button>';
      }).join('')+
    '</div>'+
    '<p class="typo-note" id="escribenombre-typo-note">'+styleNote(currentStyleId)+'</p>'+
    '<div class="prompt-card">'+
      renderTraceCanvas('escribenombre-canvas', {height:200})+
    '</div>'+
    '<button class="cta-btn" id="escribenombre-done-btn">¡Ya terminé! 🎉</button>';
  initTraceCanvas('escribenombre-canvas', {text:name, styleId:currentStyleId});
  const chips = el.querySelectorAll('.typo-chip');
  const noteEl = document.getElementById('escribenombre-typo-note');
  chips.forEach(function(btn){
    btn.onclick = function(){
      currentStyleId = btn.dataset.style;
      chips.forEach(function(c){ c.classList.toggle('active', c===btn); });
      if(noteEl) noteEl.textContent = styleNote(currentStyleId);
      initTraceCanvas('escribenombre-canvas', {text:name, styleId:currentStyleId});
    };
  });
  document.getElementById('escribenombre-done-btn').onclick = function(){
    showResult('escribenombre', 3, 3, true, '¡Practicaste trazando tu nombre!');
  };
}

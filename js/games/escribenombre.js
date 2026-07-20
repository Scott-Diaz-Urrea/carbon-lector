import { renderTraceCanvas, initTraceCanvas } from './traza.js';
import { state } from '../state.js';
import { showResult } from '../rewards.js';

/* Módulo "Escribe tu Nombre" — núcleo Lenguaje Verbal, Educación Parvularia NT
   (OA08: representar gráficamente trazos y letras). Juego a medida, no usa el
   motor de opción múltiple: es un ejercicio libre de trazado, no una
   evaluación con respuesta correcta/incorrecta, así que siempre otorga las 3
   estrellas al terminar — el logro es practicar el trazo, no acertar. */

export function renderEscribeNombreScreen(){
  return '<div class="screen" id="escribenombre-screen"></div>';
}

export function initEscribeNombreGame(){
  const el = document.getElementById('escribenombre-screen');
  if(!el) return;
  const name = state.userName || 'LEO';
  el.innerHTML =
    '<p class="section-title">Escribe tu Nombre</p>'+
    '<p class="section-sub">Repasa las letras de tu nombre con el dedo o el mouse, como si las dibujaras.</p>'+
    '<div class="prompt-card">'+
      renderTraceCanvas('escribenombre-canvas', {height:200})+
    '</div>'+
    '<button class="cta-btn" id="escribenombre-done-btn">¡Ya terminé! 🎉</button>';
  initTraceCanvas('escribenombre-canvas', name);
  document.getElementById('escribenombre-done-btn').onclick = function(){
    showResult('escribenombre', 3, 3, true, '¡Practicaste trazando tu nombre!');
  };
}

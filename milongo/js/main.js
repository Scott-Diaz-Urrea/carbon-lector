// Punto de entrada: pestañas, dibujo de pantalla, cronómetros en vivo, avisos y service worker.
import { subscribe, getState } from './store.js';
import { setRender, rerender, toast } from './ui.js';
import { renderHoy, liveTick } from './hoy.js';
import { renderSalud } from './salud.js';
import { renderEntrenar } from './entrenar.js';
import { renderHistorial, resetDay } from './historial.js';
import { renderPerfil } from './perfil.js';
import { computeAlerts } from './alerts.js';

const TABS = [
  { id: 'hoy', ic: '🏠', l: 'Hoy', fn: renderHoy },
  { id: 'historial', ic: '📊', l: 'Historial', fn: renderHistorial },
  { id: 'salud', ic: '💉', l: 'Salud', fn: renderSalud },
  { id: 'entrenar', ic: '🎓', l: 'Entrenar', fn: renderEntrenar },
  { id: 'perfil', ic: '🐶', l: 'Ficha', fn: renderPerfil },
];
let tab = 'hoy';
const view = document.getElementById('view'), tabs = document.getElementById('tabs');

function draw() {
  const t = TABS.find(x => x.id === tab);
  view.innerHTML = t.fn();
  const n = computeAlerts().filter(a => a.level !== 'info').length;
  tabs.innerHTML = '<div class="tabs-in">' + TABS.map(x => `<button class="${x.id === tab ? 'on' : ''}" data-tab="${x.id}" aria-label="${x.l}"><span class="ic">${x.ic}</span>${x.l}${x.id === 'hoy' && n ? `<span class="badge">${n}</span>` : ''}</button>`).join('') + '</div>';
  const d = getState().dog.name;
  document.title = d ? 'Milongo · ' + d : 'Milongo';
}
function go(id) { if (id === tab) return; tab = id; if (id === 'historial') resetDay(); draw(); window.scrollTo(0, 0); }

tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); });
window.addEventListener('milongo-tab', e => go(e.detail));
window.addEventListener('milongo-redraw', draw);
window.addEventListener('milongo-savefail', () => toast('⚠️ No se pudo guardar: el almacenamiento está lleno. Haz un respaldo y borra datos viejos.', { ms: 6000 }));
setRender(draw);
subscribe(draw);
draw();

// cronómetros de paseo/sueño sin redibujar toda la pantalla
setInterval(liveTick, 1000);

// Avisos con la app abierta: recordatorios que ya vencieron (una sola vez por aviso).
const told = new Set();
function checkDue() {
  const now = Date.now();
  for (const r of getState().reminders) {
    const key = r.id + r.at;
    if (r.done || told.has(key) || new Date(r.at).getTime() > now) continue;
    told.add(key);
    toast('⏰ ' + r.title, { ms: 8000 });
    if ('Notification' in window && Notification.permission === 'granted') { try { new Notification('Milongo', { body: r.title, icon: 'icons/icon-192.png' }); } catch (e) {} }
  }
  draw();
}
setInterval(checkDue, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDue(); });
checkDue();

// Pedir que iOS/Chrome no borren los datos, y registrar el service worker (instalable y sin internet).
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
// iOS ignora user-scalable=no: se bloquea el zoom por gesto de pellizco.
['gesturestart', 'gesturechange', 'gestureend'].forEach(ev => document.addEventListener(ev, e => e.preventDefault()));

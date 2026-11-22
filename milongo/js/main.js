// Punto de entrada: pestañas, dibujo de pantalla, cronómetros en vivo, avisos y service worker.
import { subscribe, getState } from './store.js';
import { setRender, rerender, toast } from './ui.js';
import { renderHoy, liveTick } from './hoy.js';
import { renderSalud } from './salud.js';
import { renderEntrenar } from './entrenar.js';
import { renderHistorial, resetDay } from './historial.js';
import { renderPerfil } from './perfil.js';
import { computeAlerts } from './alerts.js';

const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const TABS = [
  { id: 'hoy', ic: svg('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>'), l: 'Hoy', fn: renderHoy },
  { id: 'historial', ic: svg('<path d="M5 20V11M12 20V4M19 20v-6"/>'), l: 'Historial', fn: renderHistorial },
  { id: 'salud', ic: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M12 9.5v4M10 11.5h4"/>'), l: 'Salud', fn: renderSalud },
  { id: 'entrenar', ic: svg('<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>'), l: 'Entrenar', fn: renderEntrenar },
  { id: 'perfil', ic: svg('<circle cx="6.5" cy="10.5" r="1.8"/><circle cx="10" cy="6.5" r="1.8"/><circle cx="14" cy="6.5" r="1.8"/><circle cx="17.5" cy="10.5" r="1.8"/><path d="M12 12.5c-3 0-5.5 3-5.5 5.2 0 1.6 1.3 2.3 2.8 2.3 1 0 1.8-.4 2.7-.4s1.7.4 2.7.4c1.5 0 2.8-.7 2.8-2.3 0-2.2-2.5-5.2-5.5-5.2z"/>'), l: 'Ficha', fn: renderPerfil },
];
let tab = 'hoy';
const view = document.getElementById('view'), tabs = document.getElementById('tabs');

function draw() {
  const t = TABS.find(x => x.id === tab);
  view.innerHTML = t.fn();
  const n = computeAlerts().filter(a => a.level !== 'info').length;
  tabs.innerHTML = '<div class="tabs-in">' + TABS.map(x => `<button class="${x.id === tab ? 'on' : ''}" data-tab="${x.id}" aria-label="${x.l}">${x.ic}<span>${x.l}</span>${x.id === 'hoy' && n ? `<span class="badge">${n}</span>` : ''}</button>`).join('') + '</div>';
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

// Registros (paseos, comidas, baños, etc.) y cálculos sobre ellos.
import { getState, update, uid } from './store.js';
import { dayKey, median } from './util.js';

export const evEnd = e => e.ts + (e.dur || 0) * 60000;
// El sueño se cuenta en el día en que termina (así la noche cuenta para "hoy", cuando despierta).
export const evDay = e => dayKey(e.type === 'sueno' ? evEnd(e) : e.ts);

export function addEvent(ev) {
  const e = { id: uid(), ts: Date.now(), ...ev };
  update(s => { s.events.push(e); });
  return e;
}
export function delEvent(id) { update(s => { s.events = s.events.filter(e => e.id !== id); }); }
export const eventsOfDay = k => getState().events.filter(e => evDay(e) === k).sort((a, b) => evEnd(b) - evEnd(a));
export function lastOf(type) {
  let best = null;
  for (const e of getState().events) if (e.type === type && (!best || e.ts > best.ts)) best = e;
  return best;
}
// Intervalo típico entre dos registros del mismo tipo (mediana de los últimos 14 días, sin contar la noche larga).
export function typicalGap(type, maxH = 12) {
  const since = Date.now() - 14 * 86400000;
  const ts = getState().events.filter(e => e.type === type && e.ts >= since).map(e => e.ts).sort((a, b) => a - b);
  const gaps = [];
  for (let i = 1; i < ts.length; i++) { const g = ts[i] - ts[i - 1]; if (g > 5 * 60000 && g <= maxH * 3600000) gaps.push(g); }
  return gaps.length >= 3 ? median(gaps) : 0;
}
export function dayTotals(k) {
  const t = { agua: 0, comida: 0, comidaG: 0, paseo: 0, paseoMin: 0, pipi: 0, popo: 0, suenoMin: 0, juegoMin: 0, entrenoMin: 0 };
  for (const e of getState().events) {
    if (evDay(e) !== k) continue;
    if (e.type === 'paseo') { t.paseo++; t.paseoMin += e.dur || 0; }
    else if (e.type === 'comida') { t.comida++; t.comidaG += +e.amount || 0; }
    else if (e.type === 'sueno') t.suenoMin += e.dur || 0;
    else if (e.type === 'juego') t.juegoMin += e.dur || 0;
    else if (e.type === 'entreno') t.entrenoMin += e.dur || 0;
    else if (t[e.type] !== undefined) t[e.type]++;
  }
  return t;
}
export function evLabel(e, T) {
  const t = T[e.type] || T.otro; let d = '';
  if (e.type === 'comida' && e.amount) d = ' · ' + e.amount + ' g';
  else if (e.dur) d = ' · ' + (e.dur >= 60 ? Math.floor(e.dur / 60) + ' h ' + (e.dur % 60 ? e.dur % 60 + ' min' : '') : e.dur + ' min');
  return t.label + d + (e.note ? ' — ' + e.note : '');
}

// Pestaña "Historial": un día a la vez + gráficos de la última semana.
import { EVENT_TYPES as T } from './data.js';
import { esc, todayKey, addDaysKey, dateLong, dayInitial, clock, fmtDur } from './util.js';
import { ACT, bar } from './ui.js';
import { eventsOfDay, dayTotals, evLabel, evEnd } from './events.js';
import { getState } from './store.js';

let day = todayKey();

function chart(title, unit, keys, valFn, fmt) {
  const vals = keys.map(valFn), max = Math.max(...vals, 1);
  return `<div class="card"><h2>${title}</h2><div class="bars">` + keys.map((k, i) => `<div class="col${k === todayKey() ? ' today' : ''}"><b>${vals[i] ? fmt(vals[i]) : ''}</b><i style="height:${Math.max(2, vals[i] / max * 78)}%"></i><span>${dayInitial(k)}</span></div>`).join('') + `</div><p class="muted small">${unit}</p></div>`;
}

export function renderHistorial() {
  const g = getState().goals, tk = todayKey();
  const week = Array.from({ length: 7 }, (_, i) => addDaysKey(day, i - 6));
  const t = dayTotals(day), list = eventsOfDay(day);
  let h = `<h2 style="margin-top:6px">Historial</h2><div class="daynav"><button class="btn" data-act="dayPrev" aria-label="Día anterior">◀</button><b>${day === tk ? 'Hoy · ' : ''}${dateLong(day)}</b><button class="btn" data-act="dayNext" aria-label="Día siguiente"${day >= tk ? ' disabled style="opacity:.4"' : ''}>▶</button></div>`;
  h += `<div class="card"><h2>Ese día</h2>` + bar('🍖', 'Comidas', t.comida, +g.meals) + bar('🚶', 'Paseos', t.paseo, +g.walks) + bar('⏱️', 'Min de paseo', Math.round(t.paseoMin), +g.walkMin) +
    `<div class="prog"><div class="prog-top"><span>💦 Pipí · 💩 Popó · 😴 Sueño</span><b>${t.pipi} · ${t.popo} · ${fmtDur(t.suenoMin)}</b></div></div></div>`;
  h += `<div class="card"><h2>Registros</h2>` + (list.length ? '<div class="list">' + list.map(e => { const ty = T[e.type] || T.otro; return `<div class="item"><div class="ic">${ty.icon}</div><div class="grow"><div class="t">${esc(evLabel(e, T))}</div><div class="s">${e.type === 'sueno' ? clock(e.ts) + ' → ' + clock(evEnd(e)) : clock(e.ts)}</div></div></div>`; }).join('') + '</div>' : '<p class="empty">No hay registros este día.</p>') + '</div>';
  h += chart('🚶 Minutos de paseo', 'Últimos 7 días', week, k => Math.round(dayTotals(k).paseoMin), v => v);
  h += chart('😴 Horas de sueño', 'Últimos 7 días', week, k => Math.round(dayTotals(k).suenoMin / 6) / 10, v => v);
  h += chart('💦 Pipí y popó (veces)', 'Últimos 7 días', week, k => { const x = dayTotals(k); return x.pipi + x.popo; }, v => v);
  h += chart('🍖 Comidas', 'Últimos 7 días', week, k => dayTotals(k).comida, v => v);
  return h;
}

Object.assign(ACT, {
  dayPrev: () => { day = addDaysKey(day, -1); window.dispatchEvent(new Event('milongo-redraw')); },
  dayNext: () => { if (day < todayKey()) day = addDaysKey(day, 1); window.dispatchEvent(new Event('milongo-redraw')); },
});
export const resetDay = () => { day = todayKey(); };

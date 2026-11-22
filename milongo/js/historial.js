// Pestaña "Historial": un día a la vez + gráficos de la última semana.
import { EVENT_TYPES as T } from './data.js';
import { esc, todayKey, addDaysKey, dateLong, dayInitial, clock, fmtDur } from './util.js';
import { ACT, bar } from './ui.js';
import { eventsOfDay, dayTotals, evLabel, evEnd } from './events.js';
import { getState } from './store.js';

let day = todayKey();

function chart(icon, title, unit, keys, valFn, fmt, cls) {
  const vals = keys.map(valFn), max = Math.max(...vals, 1);
  return `<div class="card ${cls}"><div class="chart-head"><div class="ic">${icon}</div><div><h2>${title}</h2><p class="muted small">${unit}</p></div></div><div class="bars">` + keys.map((k, i) => `<div class="col${k === todayKey() ? ' today' : ''}"><b>${vals[i] ? fmt(vals[i]) : ''}</b><i style="height:${Math.max(3, vals[i] / max * 70)}%"></i><span>${dayInitial(k)}</span></div>`).join('') + `</div></div>`;
}

export function renderHistorial() {
  const g = getState().goals, tk = todayKey();
  const week = Array.from({ length: 7 }, (_, i) => addDaysKey(day, i - 6));
  const t = dayTotals(day), list = eventsOfDay(day);
  let h = `<h1 class="page-title">Historial</h1><p class="page-sub">Cómo ha ido cada día y la última semana.</p><div class="daynav"><button class="btn" data-act="dayPrev" aria-label="Día anterior">◀</button><b>${day === tk ? 'Hoy · ' : ''}${dateLong(day)}</b><button class="btn" data-act="dayNext" aria-label="Día siguiente"${day >= tk ? ' disabled style="opacity:.4"' : ''}>▶</button></div>`;
  h += `<div class="card"><h2>Ese día</h2>` + bar('🍖', 'Comidas', t.comida, +g.meals, '', 'c-metaComida') + bar('🚶', 'Paseos', t.paseo, +g.walks, '', 'c-metaPaseo') + bar('⏱️', 'Min de paseo', Math.round(t.paseoMin), +g.walkMin, '', 'c-metaMin') +
    `<div class="prog"><div class="prog-top"><span>💦 Pipí · 💩 Popó · 😴 Sueño</span><b>${t.pipi} · ${t.popo} · ${fmtDur(t.suenoMin)}</b></div></div></div>`;
  h += `<div class="card"><h2>Registros</h2>` + (list.length ? '<div class="list">' + list.map(e => { const ty = T[e.type] || T.otro; return `<div class="item"><div class="ic c-${e.type}">${ty.icon}</div><div class="grow"><div class="t">${esc(evLabel(e, T))}</div><div class="s">${e.type === 'sueno' ? clock(e.ts) + ' → ' + clock(evEnd(e)) : clock(e.ts)}</div></div></div>`; }).join('') + '</div>' : '<p class="empty">No hay registros este día.</p>') + '</div>';
  h += chart('🚶', 'Minutos de paseo', 'Últimos 7 días', week, k => Math.round(dayTotals(k).paseoMin), v => v, 'c-paseo');
  h += chart('😴', 'Horas de sueño', 'Últimos 7 días', week, k => Math.round(dayTotals(k).suenoMin / 6) / 10, v => v, 'c-sueno');
  h += chart('💦', 'Pipí y popó (veces)', 'Últimos 7 días', week, k => { const x = dayTotals(k); return x.pipi + x.popo; }, v => v, 'c-pipi');
  h += chart('🍖', 'Comidas', 'Últimos 7 días', week, k => dayTotals(k).comida, v => v, 'c-comida');
  return h;
}

Object.assign(ACT, {
  dayPrev: () => { day = addDaysKey(day, -1); window.dispatchEvent(new Event('milongo-redraw')); },
  dayNext: () => { if (day < todayKey()) day = addDaysKey(day, 1); window.dispatchEvent(new Event('milongo-redraw')); },
});
export const resetDay = () => { day = todayKey(); };

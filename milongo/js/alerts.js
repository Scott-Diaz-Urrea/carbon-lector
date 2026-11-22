// Avisos de "atención": cosas vencidas o por vencer. Se muestran en Hoy y en el globo de la pestaña.
import { getState } from './store.js';
import { lastOf, typicalGap, dayTotals } from './events.js';
import { todayKey, daysBetween, dayKey, clock, fmtAgo, fmtDur } from './util.js';

export function latestBy(arr, keyFn) {
  const m = new Map();
  for (const x of arr) { const k = keyFn(x); const p = m.get(k); if (!p || x.date > p.date) m.set(k, x); }
  return [...m.values()];
}
export const medActive = m => m.active !== false && (!m.end || m.end >= todayKey());
export function medNextDose(m) {
  if (!(+m.everyH > 0)) return null;
  const last = getState().events.filter(e => e.type === 'medicina' && e.sub === m.id).sort((a, b) => b.ts - a.ts)[0];
  const base = last ? last.ts : (m.start ? new Date(m.start).getTime() : Date.now());
  return last ? base + m.everyH * 3600000 : base;
}

export function computeAlerts() {
  const s = getState(), now = Date.now(), tk = todayKey(), hr = new Date().getHours(), out = [];
  const push = (level, icon, text, action) => out.push({ level, icon, text, action });

  for (const r of s.reminders) {
    if (r.done) continue;
    const t = new Date(r.at).getTime();
    if (t <= now) push('bad', '⏰', `${r.title} · ${fmtAgo(now - t).replace('recién', 'ahora')}`, { act: 'remDone', id: r.id, label: 'Hecho' });
    else if (dayKey(t) === tk) push('info', '⏰', `${r.title} · hoy a las ${clock(t)}`);
  }
  for (const v of latestBy(s.vaccines, v => v.name)) {
    if (!v.next) continue;
    const d = daysBetween(tk, v.next);
    if (d < 0) push('bad', '💉', `Vacuna ${v.name} vencida hace ${-d} ${-d === 1 ? 'día' : 'días'}`, { act: 'vacNew', name: v.name, label: 'Ya la puse' });
    else if (d <= 14) push('warn', '💉', `Vacuna ${v.name} ${d === 0 ? 'toca hoy' : 'en ' + d + (d === 1 ? ' día' : ' días')}`, { act: 'vacNew', name: v.name, label: 'Ya la puse' });
  }
  for (const p of latestBy(s.parasites, p => p.kind)) {
    if (!p.next) continue;
    const d = daysBetween(tk, p.next), nom = 'Desparasitación ' + p.kind;
    if (d < 0) push('bad', '🪱', `${nom} atrasada ${-d} ${-d === 1 ? 'día' : 'días'}`, { act: 'parNew', kind: p.kind, label: 'Ya la di' });
    else if (d <= 7) push('warn', '🪱', `${nom} ${d === 0 ? 'toca hoy' : 'en ' + d + (d === 1 ? ' día' : ' días')}`, { act: 'parNew', kind: p.kind, label: 'Ya la di' });
  }
  for (const m of s.meds.filter(medActive)) {
    const due = medNextDose(m);
    if (due && due <= now) push('bad', '💊', `${m.name}${m.dose ? ' (' + m.dose + ')' : ''}: toca la dosis`, { act: 'medGive', id: m.id, label: 'Dada' });
  }
  const agua = lastOf('agua'), wh = +s.goals.waterEveryH || 24;
  if (agua && now - agua.ts > wh * 3600000) push('warn', '💧', `Cambia el agua (${fmtAgo(now - agua.ts)})`, { act: 'quick', type: 'agua', label: 'Ya la cambié' });
  else if (!agua || (dayKey(agua.ts) !== tk && hr >= 10)) push('info', '💧', 'Aún no registras el cambio de agua de hoy', { act: 'quick', type: 'agua', label: 'Ya la cambié' });

  const bano = lastOf('bano'), bd = +s.goals.bathEveryDays;
  if (bano && bd && daysBetween(dayKey(bano.ts), tk) > bd) push('info', '🛁', `Baño pendiente (último ${fmtAgo(now - bano.ts)})`);

  const gap = typicalGap('pipi'), pipi = lastOf('pipi');
  if (gap && pipi && now - pipi.ts > gap * 1.5 && hr >= 7 && hr <= 22) push('info', '💦', `Hace ${fmtDur((now - pipi.ts) / 60000)} que no hace pipí (suele ir cada ~${fmtDur(gap / 60000)})`);

  const t = dayTotals(tk);
  if (hr >= 18 && t.paseo < (+s.goals.walks || 0)) push('info', '🚶', `Hoy van ${t.paseo} de ${s.goals.walks} paseos`);

  const first = s.events.length ? s.events.reduce((a, e) => Math.min(a, e.ts), Infinity) : 0;
  if (first && now - (s.backupAt || first) > 30 * 86400000) push('info', '💾', 'Hace más de 30 días sin respaldo de los datos', { act: 'backup', label: 'Respaldar' });

  const rank = { bad: 0, warn: 1, info: 2 };
  return out.sort((a, b) => rank[a.level] - rank[b.level]);
}

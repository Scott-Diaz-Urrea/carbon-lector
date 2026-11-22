// Utilidades de texto y fechas. Las fechas "solo día" se guardan como 'YYYY-MM-DD' (hora local).
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const p2 = n => String(n).padStart(2, '0');
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
export const todayKey = () => dayKey(Date.now());
export const keyToDate = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDaysKey = (k, n) => { const d = keyToDate(k); d.setDate(d.getDate() + n); return dayKey(d.getTime()); };
export const addMonthsKey = (k, n) => {
  const d = keyToDate(k); const day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return dayKey(d.getTime());
};
export const daysBetween = (a, b) => Math.round((keyToDate(b) - keyToDate(a)) / 86400000);
export const clock = ts => { const d = new Date(ts); return p2(d.getHours()) + ':' + p2(d.getMinutes()); };
export const dateLong = k => { const d = keyToDate(k); return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()]; };
export const dateShort = k => { const d = keyToDate(k); return d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3); };
export const dateFull = k => { const d = keyToDate(k); return d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); };
export const dayInitial = k => DIAS[keyToDate(k).getDay()].slice(0, 1).toUpperCase();

export const fmtDur = min => {
  min = Math.round(min);
  if (min < 60) return min + ' min';
  const h = Math.floor(min / 60), m = min % 60;
  return h + ' h' + (m ? ' ' + m + ' min' : '');
};
export const fmtAgo = ms => {
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'recién';
  if (m < 60) return 'hace ' + m + ' min';
  const h = Math.floor(m / 60);
  if (h < 24) return 'hace ' + h + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '');
  const d = Math.floor(h / 24);
  return 'hace ' + d + (d === 1 ? ' día' : ' días');
};
export const fmtClock = ms => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return (h ? h + ':' + p2(m) : m) + ':' + p2(x);
};

export const toInput = ts => { const d = new Date(ts); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + 'T' + p2(d.getHours()) + ':' + p2(d.getMinutes()); };
export const fromInput = s => new Date(s).getTime();

export function ageMonths(birth) {
  if (!birth) return null;
  const b = keyToDate(birth), n = new Date();
  let m = (n.getFullYear() - b.getFullYear()) * 12 + n.getMonth() - b.getMonth();
  if (n.getDate() < b.getDate()) m--;
  return Math.max(0, m);
}
export function ageText(birth) {
  if (!birth) return '';
  const m = ageMonths(birth);
  if (m < 1) { const w = Math.max(1, Math.floor((Date.now() - keyToDate(birth)) / 604800000)); return w + (w === 1 ? ' semana' : ' semanas'); }
  if (m < 24) return m + (m === 1 ? ' mes' : ' meses');
  const y = Math.floor(m / 12), r = m % 12;
  return y + ' años' + (r ? ' ' + r + (r === 1 ? ' mes' : ' meses') : '');
}
export const median = a => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y), i = s.length >> 1; return s.length % 2 ? s[i] : (s[i - 1] + s[i]) / 2; };

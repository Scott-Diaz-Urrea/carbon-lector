// Pestaña "Salud": agenda y recordatorios, vacunas, desparasitación, peso, visitas al vet y medicamentos.
import { getState, update, uid } from './store.js';
import { VACCINE_NAMES, VACCINE_PLAN, nextParasite } from './data.js';
import { esc, todayKey, addMonthsKey, addDaysKey, daysBetween, dateFull, dateShort, dayKey, clock, toInput, fromInput, ageMonths, keyToDate } from './util.js';
import { ACT, toast, sheet } from './ui.js';
import { addEvent, delEvent } from './events.js';
import { latestBy, medActive, medNextDose } from './alerts.js';

const openSecs = new Set(['agenda']);
document.addEventListener('toggle', e => {
  const d = e.target; if (!d.matches || !d.matches('details.sec')) return;
  d.open ? openSecs.add(d.dataset.sec) : openSecs.delete(d.dataset.sec);
}, true);

const REPEATS = [{ v: 'none', l: 'No se repite' }, { v: 'daily', l: 'Todos los días' }, { v: 'weekly', l: 'Cada semana' }, { v: 'monthly', l: 'Cada mes' }, { v: 'yearly', l: 'Cada año' }];
const sec = (id, icon, title, count, body) => `<details class="sec" data-sec="${id}"${openSecs.has(id) ? ' open' : ''}><summary><span class="ic c-${id}">${icon}</span>${title}<span class="count">${count}</span></summary><div class="body">${body}</div></details>`;
const status = (dateKey, soon = 30) => {
  if (!dateKey) return '';
  const d = daysBetween(todayKey(), dateKey);
  if (d < 0) return `<span class="chip bad">Vencida hace ${-d} d</span>`;
  if (d <= soon) return `<span class="chip warn">${d === 0 ? 'Hoy' : 'En ' + d + ' d'}</span>`;
  return `<span class="chip ok">Al día · ${dateShort(dateKey)}</span>`;
};
const rowDel = (act, id) => `<button class="iconbtn" aria-label="Borrar" data-act="${act}" data-id="${id}">🗑️</button>`;

function agendaItems() {
  const s = getState(), out = [];
  for (const r of s.reminders) if (!r.done) out.push({ k: 'rem', date: r.at.slice(0, 10), time: r.at.slice(11, 16), title: r.title, id: r.id, rep: r.repeat });
  for (const v of latestBy(s.vaccines, v => v.name)) if (v.next) out.push({ k: 'vac', date: v.next, title: 'Vacuna ' + v.name, name: v.name });
  for (const p of latestBy(s.parasites, p => p.kind)) if (p.next) out.push({ k: 'par', date: p.next, title: 'Desparasitación ' + p.kind, kind: p.kind });
  for (const v of s.visits) if (v.next && v.next >= todayKey()) out.push({ k: 'vis', date: v.next, title: 'Control veterinario' + (v.reason ? ': ' + v.reason : '') });
  return out.sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
}

function weightChart(ws) {
  const pts = [...ws].sort((a, b) => a.date.localeCompare(b.date)).slice(-12);
  if (pts.length < 2) return '<p class="empty">Registra al menos dos pesos para ver la curva.</p>';
  const W = 300, H = 120, px = 26, py = 18;
  const min = Math.min(...pts.map(p => p.kg)), max = Math.max(...pts.map(p => p.kg)), span = max - min || 1;
  const t0 = keyToDate(pts[0].date).getTime(), t1 = keyToDate(pts[pts.length - 1].date).getTime(), ts = t1 - t0 || 1;
  const X = p => px + (keyToDate(p.date).getTime() - t0) / ts * (W - px * 2);
  const Y = p => H - py - (p.kg - min) / span * (H - py * 2);
  const line = pts.map(p => X(p).toFixed(1) + ',' + Y(p).toFixed(1)).join(' ');
  return `<svg class="chartsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso"><polyline points="${line}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>` +
    pts.map(p => `<circle cx="${X(p).toFixed(1)}" cy="${Y(p).toFixed(1)}" r="4" fill="var(--primary)"/><text x="${X(p).toFixed(1)}" y="${(Y(p) - 8).toFixed(1)}" font-size="9" text-anchor="middle" fill="var(--ink)">${p.kg}</text>`).join('') +
    `<text x="${px}" y="${H - 2}" font-size="9" fill="var(--soft)">${dateShort(pts[0].date)}</text><text x="${W - px}" y="${H - 2}" font-size="9" text-anchor="end" fill="var(--soft)">${dateShort(pts[pts.length - 1].date)}</text></svg>`;
}

export function renderSalud() {
  const s = getState(), tk = todayKey();
  const ag = agendaItems();
  let h = '<h1 class="page-title">Salud y cuidados</h1><p class="page-sub">Vacunas, desparasitación, peso, visitas y medicamentos. Milongo te avisa cuando algo se acerca.</p>';

  h += sec('agenda', '📅', 'Agenda y recordatorios', ag.length, (ag.length ? '<div class="list">' + ag.map(a => {
    const d = daysBetween(tk, a.date), when = d < 0 ? `<span class="chip bad">Atrasado ${-d} d</span>` : d === 0 ? '<span class="chip warn">Hoy' + (a.time ? ' ' + a.time : '') + '</span>' : `<span class="chip info">${dateShort(a.date)}${a.time ? ' ' + a.time : ''}</span>`;
    const icon = { rem: '⏰', vac: '💉', par: '🪱', vis: '🩺' }[a.k];
    const btn = a.k === 'rem' ? `<button class="btn sm" data-act="remDone" data-id="${a.id}">Hecho</button><button class="iconbtn" aria-label="Borrar" data-act="remDel" data-id="${a.id}">🗑️</button>` : a.k === 'vac' ? `<button class="btn sm" data-act="vacNew" data-name="${esc(a.name)}">Ya la puse</button>` : a.k === 'par' ? `<button class="btn sm" data-act="parNew" data-kind="${a.kind}">Ya la di</button>` : '';
    return `<div class="item"><div class="ic c-${a.k}">${icon}</div><div class="grow"><div class="t">${esc(a.title)}</div><div class="s">${when}${a.rep && a.rep !== 'none' ? ' · se repite' : ''}</div></div>${btn}</div>`;
  }).join('') + '</div>' : '<p class="empty">No hay nada pendiente.</p>') +
    `<div class="row" style="margin-top:8px"><button class="btn primary sm" data-act="remNew">➕ Nuevo recordatorio</button><button class="btn sm" data-act="remPreset" data-title="Cortar uñas" data-repeat="monthly">✂️ Uñas</button><button class="btn sm" data-act="remPreset" data-title="Limpiar orejas y revisar pelaje" data-repeat="weekly">👂 Orejas</button><button class="btn sm" data-act="remPreset" data-title="Comprar comida" data-repeat="monthly">🛒 Comida</button></div>
    <div class="row" style="margin-top:8px"><button class="btn ghost sm" data-act="icsExport">📆 Pasar a mi calendario</button><button class="btn ghost sm" data-act="notifOn">🔔 Avisos con la app abierta</button></div>
    <p class="note">Los avisos de Milongo solo suenan con la app abierta. Para que el teléfono te avise con la app cerrada, usa “Pasar a mi calendario”: sirve en iPhone y en Android (Google Calendar).</p>`);

  const vs = [...s.vaccines].sort((a, b) => b.date.localeCompare(a.date)), latestV = new Set(latestBy(s.vaccines, v => v.name).map(v => v.id));
  h += sec('vac', '💉', 'Vacunas', s.vaccines.length, (vs.length ? '<div class="list">' + vs.map(v => `<div class="item"><div class="ic c-vac">💉</div><div class="grow"><div class="t">${esc(v.name)}</div><div class="s">Puesta el ${dateFull(v.date)}${v.next ? ' · próxima ' + dateFull(v.next) : ''}${v.lot ? ' · lote ' + esc(v.lot) : ''}</div></div>${latestV.has(v.id) ? status(v.next) : ''}${rowDel('vacDel', v.id)}</div>`).join('') + '</div>' : '<p class="empty">Aún no hay vacunas registradas.</p>') +
    `<button class="btn primary sm" data-act="vacNew">➕ Registrar vacuna</button>
    <details style="margin-top:10px"><summary class="small muted">Calendario habitual de cachorros</summary><div class="list" style="margin-top:6px">${VACCINE_PLAN.map(p => `<div class="item"><div class="t" style="min-width:110px">${p[0]}</div><div class="s">${p[1]}</div></div>`).join('')}</div><p class="note">Guía general. Tu veterinario define el calendario según edad, zona y estado de tu perrito.</p></details>`);

  const ps = [...s.parasites].sort((a, b) => b.date.localeCompare(a.date)), latestP = new Set(latestBy(s.parasites, p => p.kind).map(p => p.id));
  h += sec('par', '🪱', 'Desparasitación', s.parasites.length, (ps.length ? '<div class="list">' + ps.map(p => `<div class="item"><div class="ic c-par">${p.kind === 'interna' ? '🪱' : '🐜'}</div><div class="grow"><div class="t">${p.kind === 'interna' ? 'Interna' : 'Externa (pulgas/garrapatas)'}${p.product ? ' · ' + esc(p.product) : ''}</div><div class="s">${dateFull(p.date)}${p.next ? ' · próxima ' + dateFull(p.next) : ''}</div></div>${latestP.has(p.id) ? status(p.next, 7) : ''}${rowDel('parDel', p.id)}</div>`).join('') + '</div>' : '<p class="empty">Aún no hay registros.</p>') + '<button class="btn primary sm" data-act="parNew">➕ Registrar desparasitación</button>');

  const ws = [...s.weights].sort((a, b) => b.date.localeCompare(a.date));
  h += sec('peso', '⚖️', 'Peso', ws.length ? ws[0].kg + ' kg' : '', weightChart(s.weights) + (ws.length ? '<div class="list">' + ws.slice(0, 6).map((w, i) => { const prev = ws[i + 1]; const diff = prev ? Math.round((w.kg - prev.kg) * 100) / 100 : null; return `<div class="item"><div class="grow"><b>${w.kg} kg</b> <span class="s">· ${dateFull(w.date)}</span></div>${diff != null ? `<span class="chip ${diff > 0 ? 'warn' : 'info'}">${diff > 0 ? '+' : ''}${diff} kg</span>` : ''}${rowDel('wDel', w.id)}</div>`; }).join('') + '</div>' : '') + '<button class="btn primary sm" data-act="wNew" style="margin-top:8px">➕ Registrar peso</button>');

  const vis = [...s.visits].sort((a, b) => b.date.localeCompare(a.date));
  h += sec('vis', '🩺', 'Visitas al veterinario', vis.length, (vis.length ? '<div class="list">' + vis.map(v => `<div class="item"><div class="ic c-vis">🩺</div><div class="grow"><div class="t">${esc(v.reason || 'Control')}</div><div class="s">${dateFull(v.date)}${v.cost ? ' · $' + Number(v.cost).toLocaleString('es-CL') : ''}${v.notes ? '<br>' + esc(v.notes) : ''}${v.next ? '<br>Próximo control: ' + dateFull(v.next) : ''}</div></div>${rowDel('visDel', v.id)}</div>`).join('') + '</div>' : '<p class="empty">Sin visitas registradas.</p>') + '<button class="btn primary sm" data-act="visNew">➕ Registrar visita</button>');

  h += sec('med', '💊', 'Medicamentos', s.meds.filter(medActive).length + ' activos', (s.meds.length ? '<div class="list">' + s.meds.map(m => {
    const act = medActive(m), nd = medNextDose(m);
    return `<div class="item"><div class="ic c-med">💊</div><div class="grow"><div class="t">${esc(m.name)}${m.dose ? ' · ' + esc(m.dose) : ''}</div><div class="s">${+m.everyH > 0 ? 'cada ' + m.everyH + ' h' : 'según necesidad'}${m.end ? ' · hasta ' + dateShort(m.end) : ''}${act && nd ? ' · próxima ' + (dayKey(nd) === todayKey() ? 'hoy ' + clock(nd) : dateShort(dayKey(nd)) + ' ' + clock(nd)) : ''}${m.notes ? '<br>' + esc(m.notes) : ''}</div></div>${act ? `<button class="btn sm" data-act="medGive" data-id="${m.id}">Dada</button>` : '<span class="chip">Terminado</span>'}${rowDel('medDel', m.id)}</div>`;
  }).join('') + '</div>' : '<p class="empty">Sin medicamentos.</p>') + '<button class="btn primary sm" data-act="medNew">➕ Agregar medicamento</button>');
  return h;
}

function nextOcc(at, repeat) {
  const d = new Date(at);
  const step = () => { if (repeat === 'daily') d.setDate(d.getDate() + 1); else if (repeat === 'weekly') d.setDate(d.getDate() + 7); else if (repeat === 'monthly') d.setMonth(d.getMonth() + 1); else d.setFullYear(d.getFullYear() + 1); };
  do { step(); } while (d.getTime() <= Date.now());
  return toInput(d.getTime());
}

function remSheet(pre = {}) {
  const t = new Date(); t.setDate(t.getDate() + 1); t.setHours(9, 0, 0, 0);
  sheet({
    title: 'Nuevo recordatorio',
    fields: [{ name: 'title', label: 'Qué hay que hacer', required: true, value: pre.title || '', placeholder: 'Ej: Dar pastilla antipulgas' },
      { name: 'at', label: 'Cuándo', type: 'datetime-local', required: true, value: toInput(t.getTime()) },
      { name: 'repeat', label: 'Repetir', type: 'select', options: REPEATS, value: pre.repeat || 'none' }],
    onSubmit: v => { update(s => { s.reminders.push({ id: uid(), title: v.title.trim(), at: v.at, repeat: v.repeat }); }); toast('Recordatorio guardado'); },
  });
}

function vacSheet(name = '') {
  const today = todayKey();
  sheet({
    title: 'Registrar vacuna',
    fields: [{ name: 'name', label: 'Vacuna', required: true, value: name, list: VACCINE_NAMES, placeholder: 'Elige o escribe' },
      { name: 'date', label: 'Fecha en que se puso', type: 'date', value: today, required: true },
      { name: 'next', label: 'Próxima dosis', type: 'date', value: addMonthsKey(today, 12), hint: 'Normalmente es un refuerzo anual; si es cachorro, suele ser en 3–4 semanas.' },
      { name: 'lot', label: 'Lote (opcional)' }],
    onChange: (f, e) => { if (e.target.name === 'date' && f.date.value) f.next.value = addMonthsKey(f.date.value, 12); },
    onSubmit: v => { update(s => { s.vaccines.push({ id: uid(), name: v.name.trim(), date: v.date, next: v.next || '', lot: v.lot.trim() }); }); toast('💉 Vacuna guardada'); },
  });
}
function parSheet(kind = 'interna') {
  const today = todayKey(), am = ageMonths(getState().dog.birth);
  sheet({
    title: 'Registrar desparasitación',
    fields: [{ name: 'kind', label: 'Tipo', type: 'select', value: kind, options: [{ v: 'interna', l: 'Interna (lombrices)' }, { v: 'externa', l: 'Externa (pulgas y garrapatas)' }] },
      { name: 'product', label: 'Producto (opcional)' },
      { name: 'date', label: 'Fecha', type: 'date', value: today, required: true },
      { name: 'next', label: 'Próxima', type: 'date', value: nextParasite(kind, today, am, addMonthsKey), hint: 'Interna: cada 3 meses (cada mes bajo 6 meses de edad). Externa: según el producto, casi siempre cada mes.' }],
    onChange: (f, e) => { if (['kind', 'date'].includes(e.target.name) && f.date.value) f.next.value = nextParasite(f.kind.value, f.date.value, am, addMonthsKey); },
    onSubmit: v => { update(s => { s.parasites.push({ id: uid(), kind: v.kind, product: v.product.trim(), date: v.date, next: v.next || '' }); }); toast('🪱 Desparasitación guardada'); },
  });
}

const delFrom = (coll, label) => d => { if (confirm('¿Borrar ' + label + '?')) update(s => { s[coll] = s[coll].filter(x => x.id !== d.id); }); };

function buildIcs(items) {
  const z = n => String(n).padStart(2, '0'), stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const rr = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY', yearly: 'YEARLY' };
  const esc2 = t => t.replace(/[\\;,]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const nm = getState().dog.name || 'mi perrito';
  let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Milongo//ES\r\nCALSCALE:GREGORIAN\r\n';
  items.forEach((a, i) => {
    const d = a.date.replace(/-/g, ''), allDay = !a.time;
    ics += 'BEGIN:VEVENT\r\nUID:milongo-' + i + '-' + d + '@milongo\r\nDTSTAMP:' + stamp + '\r\nSUMMARY:' + esc2('🐾 ' + a.title + ' (' + nm + ')') + '\r\n';
    if (allDay) { const n = addDaysKey(a.date, 1).replace(/-/g, ''); ics += 'DTSTART;VALUE=DATE:' + d + '\r\nDTEND;VALUE=DATE:' + n + '\r\n'; }
    else { const t = a.time.replace(':', '') + '00'; ics += 'DTSTART:' + d + 'T' + t + '\r\nDURATION:PT30M\r\n'; }
    if (rr[a.rep]) ics += 'RRULE:FREQ=' + rr[a.rep] + '\r\n';
    ics += 'BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:' + esc2(a.title) + '\r\nTRIGGER:' + (allDay ? '-PT15H' : '-PT10M') + '\r\nEND:VALARM\r\nEND:VEVENT\r\n';
  });
  ics += 'END:VCALENDAR\r\n';
  return new File([ics], 'milongo-agenda.ics', { type: 'text/calendar' });
}

// Enlace que abre Google Calendar (app o web) con el evento ya escrito; solo falta tocar "Guardar".
function gcalUrl(a) {
  const nm = getState().dog.name || 'mi perrito', rr = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY', yearly: 'YEARLY' };
  let dates;
  if (!a.time) dates = a.date.replace(/-/g, '') + '/' + addDaysKey(a.date, 1).replace(/-/g, '');
  else {
    const end = toInput(new Date(a.date + 'T' + a.time + ':00').getTime() + 30 * 60000).replace(/[-:]/g, '') + '00';
    dates = a.date.replace(/-/g, '') + 'T' + a.time.replace(':', '') + '00/' + end;
  }
  const p = { action: 'TEMPLATE', text: '🐾 ' + a.title + ' (' + nm + ')', dates, details: 'Creado desde Milongo' };
  if (rr[a.rep]) p.recur = 'RRULE:FREQ=' + rr[a.rep];
  return 'https://calendar.google.com/calendar/render?' + new URLSearchParams(p).toString();
}

function shareIcs(items) {
  const file = buildIcs(items);
  if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'Agenda de Milongo' }).catch(() => {}); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  toast('Archivo descargado: ábrelo para agregarlo a tu calendario');
}

function icsExport() {
  const items = agendaItems();
  if (!items.length) return toast('No hay nada en la agenda para exportar');
  sheet({
    title: '📆 Pasar a mi calendario', submit: 'Compartir archivo (.ics)',
    intro: 'Funciona en <b>iPhone y Android</b>. Así el teléfono te avisa aunque Milongo esté cerrada.',
    extra: `<p class="small"><b>Todo junto:</b> toca “Compartir archivo” y elige <i>Calendario</i> (iPhone) o <i>Google Calendar</i> / <i>Calendario</i> (Android). Si se descarga, ábrelo desde Descargas.</p>
      <p class="small" style="margin-top:10px"><b>O uno por uno en Google Calendar</b> (se abre con los datos escritos; solo toca Guardar):</p>
      <div class="list" style="margin-bottom:6px">${items.map(a => `<div class="item"><div class="grow"><div class="t small">${esc(a.title)}</div><div class="s">${dateShort(a.date)}${a.time ? ' ' + a.time : ''}</div></div><a class="btn sm" href="${esc(gcalUrl(a))}" target="_blank" rel="noopener">Google Calendar</a></div>`).join('')}</div>`,
    onSubmit: () => { shareIcs(items); },
  });
}

Object.assign(ACT, {
  remNew: () => remSheet(),
  remPreset: d => remSheet({ title: d.title, repeat: d.repeat }),
  remDone: d => update(s => {
    const r = s.reminders.find(x => x.id === d.id); if (!r) return;
    if (r.repeat && r.repeat !== 'none') r.at = nextOcc(r.at, r.repeat); else r.done = true;
  }),
  remDel: delFrom('reminders', 'este recordatorio'),
  vacNew: d => vacSheet(d.name || ''), vacDel: delFrom('vaccines', 'esta vacuna'),
  parNew: d => parSheet(d.kind || 'interna'), parDel: delFrom('parasites', 'este registro'),
  wDel: delFrom('weights', 'este peso'), visDel: delFrom('visits', 'esta visita'), medDel: delFrom('meds', 'este medicamento'),
  wNew: () => sheet({
    title: 'Registrar peso',
    fields: [{ name: 'kg', label: 'Peso en kg', type: 'text', inputmode: 'decimal', required: true, placeholder: 'Ej: 8,4' },
      { name: 'date', label: 'Fecha', type: 'date', value: todayKey(), required: true }],
    onSubmit: v => { const kg = Math.round(parseFloat(String(v.kg).replace(',', '.')) * 100) / 100; if (!(kg > 0)) { toast('Ingresa un peso válido'); return false; } update(s => { s.weights.push({ id: uid(), date: v.date, kg }); }); toast('⚖️ Peso guardado'); },
  }),
  visNew: () => sheet({
    title: 'Registrar visita al veterinario',
    fields: [{ name: 'date', label: 'Fecha', type: 'date', value: todayKey(), required: true },
      { name: 'reason', label: 'Motivo', placeholder: 'Control, vacuna, herida…' },
      { name: 'notes', label: 'Qué dijo el veterinario', type: 'textarea' },
      { name: 'cost', label: 'Costo (opcional)', type: 'number', inputmode: 'numeric', min: 0 },
      { name: 'next', label: 'Próximo control (opcional)', type: 'date' }],
    onSubmit: v => { update(s => { s.visits.push({ id: uid(), date: v.date, reason: v.reason.trim(), notes: v.notes.trim(), cost: +v.cost || 0, next: v.next || '' }); }); toast('🩺 Visita guardada'); },
  }),
  medNew: () => sheet({
    title: 'Agregar medicamento',
    fields: [{ name: 'name', label: 'Nombre', required: true },
      { name: 'dose', label: 'Dosis', placeholder: 'Ej: 1/2 pastilla' },
      { name: 'everyH', label: 'Cada cuántas horas (0 = según necesidad)', type: 'number', inputmode: 'numeric', value: 12, min: 0 },
      { name: 'start', label: 'Primera dosis', type: 'datetime-local', value: toInput(Date.now()) },
      { name: 'end', label: 'Hasta el día (opcional)', type: 'date' },
      { name: 'notes', label: 'Indicaciones', type: 'textarea' }],
    onSubmit: v => { update(s => { s.meds.push({ id: uid(), name: v.name.trim(), dose: v.dose.trim(), everyH: +v.everyH || 0, start: v.start, end: v.end || '', notes: v.notes.trim() }); }); toast('💊 Medicamento agregado'); },
  }),
  medGive: d => {
    const m = getState().meds.find(x => x.id === d.id); if (!m) return;
    const e = addEvent({ type: 'medicina', sub: m.id, note: m.name + (m.dose ? ' · ' + m.dose : '') });
    toast('💊 ' + m.name + ' registrada', { label: 'Deshacer', fn: () => delEvent(e.id) });
  },
  icsExport,
  notifOn: async () => {
    if (!('Notification' in window)) return toast('Este navegador no permite avisos. Usa “Pasar a mi calendario”.');
    const r = await Notification.requestPermission();
    toast(r === 'granted' ? '🔔 Avisos activados mientras la app esté abierta' : 'No se activaron los avisos');
  },
});

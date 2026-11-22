// Pestaña "Hoy": avisos, cronómetros, registro rápido, resumen y línea de tiempo del día.
import { getState, update } from './store.js';
import { EVENT_TYPES as T, QUICK } from './data.js';
import { esc, todayKey, clock, fmtAgo, fmtDur, fmtClock, ageText, toInput, fromInput } from './util.js';
import { ACT, toast, sheet, bar, rerender } from './ui.js';
import { addEvent, delEvent, eventsOfDay, lastOf, typicalGap, dayTotals, evLabel, evEnd } from './events.js';
import { computeAlerts, medActive } from './alerts.js';

export const avatarHTML = (cls = '') => {
  const d = getState().dog;
  return `<div class="avatar ${cls}">${d.photo ? `<img src="${d.photo}" alt="Foto de ${esc(d.name || 'tu perrito')}">` : '🐶'}</div>`;
};

function timerCard(type, s, now) {
  const t = T[type], st = s.active[type], paseo = type === 'paseo';
  if (st) {
    return `<div class="timer ${type} on"><div>${t.icon} <b>${paseo ? 'Paseando' : 'Durmiendo'}</b> <span class="clock" data-live="${type}">${fmtClock(now - st)}</span></div>
      <div class="row"><button class="btn" data-act="timerStop" data-type="${type}">⏹ Terminar</button><button class="btn ghost sm" data-act="timerCancel" data-type="${type}">Descartar</button></div></div>`;
  }
  return `<button class="timer ${type}" data-act="timerStart" data-type="${type}">${t.icon}<b>${paseo ? 'Salir a pasear' : 'Se durmió'}</b><small>${paseo ? 'cronometra el paseo' : 'cronometra la siesta'}</small></button>`;
}

function statusRow(type, icon, label, main, sub, level) {
  return `<div class="item"><div class="ic c-${type}">${icon}</div><div class="grow"><div class="t">${label}</div><div class="s">${sub || ''}</div></div><span class="chip ${level || ''}">${main}</span></div>`;
}

export function renderHoy() {
  const s = getState(), d = s.dog, g = s.goals, now = Date.now(), tk = todayKey();
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Buenos días' : hr < 20 ? 'Buenas tardes' : 'Buenas noches';
  const tot = dayTotals(tk);
  let sleepMin = tot.suenoMin; if (s.active.sueno) sleepMin += (now - s.active.sueno) / 60000;
  const alerts = computeAlerts();
  const fresh = !d.name && !s.events.length;

  const kg = [...s.weights].sort((a, b) => b.date.localeCompare(a.date))[0]?.kg;
  const chips = [ageText(d.birth), d.breed, kg ? kg + ' kg' : ''].filter(Boolean).map(x => `<span class="chip">${esc(x)}</span>`).join('') || '<span class="chip">Completa su ficha</span>';
  let h = `<section class="hero"><div class="hero-top">${avatarHTML()}<div class="grow"><p class="hello">${greet} 🐾</p><h1>${esc(d.name || 'Tu perrito')}</h1><div class="chips">${chips}</div></div></div>
    <div class="hero-stats"><div class="stat"><b>${tot.paseo}/${g.walks}</b><span>Paseos</span></div><div class="stat"><b>${tot.comida}/${g.meals}</b><span>Comidas</span></div><div class="stat"><b>${tot.pipi}</b><span>Pipí</span></div><div class="stat"><b>${sleepMin >= 60 ? Math.round(sleepMin / 60) + ' h' : Math.round(sleepMin) + ' m'}</b><span>Sueño</span></div></div></section>`;

  if (fresh) h += `<div class="card"><h2>¡Bienvenido a Milongo!</h2><p class="sub">Parte creando la ficha de tu perrito: nombre, foto, fecha de nacimiento y peso. Después registra con un toque lo que va pasando en el día.</p><button class="btn primary block" data-act="goTab" data-tab="perfil">Crear la ficha</button></div>`;

  if (alerts.length) {
    h += '<div class="alerts">' + alerts.slice(0, 6).map(a => `<div class="alert ${a.level}"><span class="ic">${a.icon}</span><span class="grow">${esc(a.text)}</span>${a.action ? `<button class="btn sm" data-act="${a.action.act}" data-id="${a.action.id || ''}" data-name="${esc(a.action.name || '')}" data-kind="${a.action.kind || ''}" data-type="${a.action.type || ''}">${a.action.label}</button>` : ''}</div>`).join('') + '</div>';
  }

  h += `<div class="timers">${timerCard('paseo', s, now)}${timerCard('sueno', s, now)}</div>`;
  h += `<div class="card"><h2>Registro rápido</h2><p class="sub">Un toque y queda anotado con la hora de ahora.</p><div class="quick">` +
    QUICK.map(k => `<button class="qbtn c-${k}" data-act="${k === 'otro' ? 'manual' : 'quick'}" data-type="${k}"><span class="ic">${T[k].icon}</span>${k === 'otro' ? 'Más' : T[k].short}</button>`).join('') + `</div>
    <button class="btn ghost block manual-btn" data-act="manual">🕐 Agregar con otra hora o más detalles</button></div>`;

  h += `<div class="card"><h2>Metas de hoy</h2>` +
    bar('🍖', 'Comidas', tot.comida, +g.meals, tot.comidaG ? ' · ' + tot.comidaG + ' g' : '', 'c-metaComida') +
    bar('🚶', 'Paseos', tot.paseo, +g.walks, '', 'c-metaPaseo') +
    bar('⏱️', 'Minutos de paseo', Math.round(tot.paseoMin), +g.walkMin, '', 'c-metaMin') +
    `<div class="prog"><div class="prog-top"><span>💩 Popó · 😴 Sueño total</span><b>${tot.popo} · ${fmtDur(sleepMin)}</b></div></div></div>`;

  // Estado de cada cosa
  const row = (type, extra) => { const e = lastOf(type); return e ? fmtAgo(now - e.ts) : 'sin registro'; };
  const gapP = typicalGap('pipi'), lp = lastOf('pipi');
  let subP = gapP ? 'suele ir cada ~' + fmtDur(gapP / 60000) + (lp && lp.ts + gapP > now ? ' · próxima ~' + clock(lp.ts + gapP) : ' · ya toca salir') : 'se aprende con tus registros';
  const lagua = lastOf('agua'), lb = lastOf('bano'), lc = lastOf('cepillado');
  const aguaLate = lagua && now - lagua.ts > g.waterEveryH * 3600000;
  h += `<div class="card"><h2>Cómo va todo</h2><div class="list">` +
    statusRow('agua', '💧', 'Agua fresca', row('agua'), 'se cambia cada ' + g.waterEveryH + ' h', aguaLate ? 'warn' : 'info') +
    statusRow('pipi', '💦', 'Pipí', row('pipi'), subP, 'info') +
    statusRow('popo', '💩', 'Popó', row('popo'), tot.popo + ' hoy', 'info') +
    statusRow('paseo', '🚶', 'Paseo', row('paseo'), tot.paseo + ' hoy · ' + fmtDur(tot.paseoMin), 'info') +
    statusRow('bano', '🛁', 'Baño', lb ? fmtAgo(now - lb.ts) : 'sin registro', 'meta: cada ' + g.bathEveryDays + ' días', 'info') +
    statusRow('cepillado', '🦷', 'Dientes', lc ? fmtAgo(now - lc.ts) : 'sin registro', 'meta: cada ' + g.brushEveryDays + ' días', 'info') +
    `</div></div>`;

  const list = eventsOfDay(tk);
  h += `<div class="card"><h2>Lo de hoy</h2>` + (list.length ? '<div class="list">' + list.map(e => {
    const t = T[e.type] || T.otro, time = e.type === 'sueno' ? clock(e.ts) + ' → ' + clock(evEnd(e)) : clock(e.ts);
    return `<div class="item"><div class="ic c-${e.type}">${t.icon}</div><div class="grow"><div class="t">${esc(evLabel(e, T))}</div><div class="s">${time}</div></div><button class="iconbtn" aria-label="Borrar registro" data-act="delEv" data-id="${e.id}">🗑️</button></div>`;
  }).join('') + '</div>' : '<p class="empty">Todavía no hay registros hoy.</p>') + '</div>';
  return h;
}

function logQuick(type, extra = {}) {
  const s = getState();
  if (type === 'comida' && +s.goals.gramsPerMeal) extra.amount = +s.goals.gramsPerMeal;
  const e = addEvent({ type, ...extra });
  toast(T[type].icon + ' ' + T[type].label + ' registrado', { label: 'Deshacer', fn: () => delEvent(e.id) });
}

Object.assign(ACT, {
  quick: d => {
    if (d.type === 'medicina') return pickMed();
    logQuick(d.type);
  },
  delEv: d => { delEvent(d.id); },
  goTab: d => { window.dispatchEvent(new CustomEvent('milongo-tab', { detail: d.tab })); },
  timerStart: d => { update(s => { s.active[d.type] = Date.now(); }); },
  timerCancel: d => { update(s => { s.active[d.type] = null; }); },
  timerStop: d => {
    const st = getState().active[d.type]; if (!st) return;
    const dur = Math.max(1, Math.round((Date.now() - st) / 60000));
    update(s => { s.active[d.type] = null; });
    addEvent({ type: d.type, ts: st, dur });
    toast(T[d.type].icon + ' ' + T[d.type].label + ' de ' + fmtDur(dur) + ' guardado');
  },
  manual: d => manualSheet(d.type && d.type !== 'otro' ? d.type : 'otro'),
});

function pickMed() {
  const meds = getState().meds.filter(medActive);
  if (!meds.length) return manualSheet('medicina');
  sheet({
    title: '💊 ¿Qué medicina?', submit: 'Registrar',
    fields: [{ name: 'med', label: 'Medicina', type: 'select', options: meds.map(m => ({ v: m.id, l: m.name + (m.dose ? ' — ' + m.dose : '') })).concat([{ v: '', l: 'Otra (escribir en notas)' }]) },
      { name: 'note', label: 'Notas (opcional)', placeholder: 'Ej: con comida' }],
    onSubmit: v => {
      const m = meds.find(x => x.id === v.med);
      const e = addEvent({ type: 'medicina', sub: m ? m.id : undefined, note: [m ? m.name : '', v.note].filter(Boolean).join(' · ') });
      toast('💊 Medicina registrada', { label: 'Deshacer', fn: () => delEvent(e.id) });
    },
  });
}

export function manualSheet(type = 'otro') {
  sheet({
    title: 'Agregar registro',
    fields: [
      { name: 'type', label: 'Qué pasó', type: 'select', value: type, options: Object.keys(T).map(k => ({ v: k, l: T[k].icon + ' ' + T[k].label })) },
      { name: 'when', label: 'Cuándo', type: 'datetime-local', value: toInput(Date.now()), required: true },
      { name: 'dur', label: 'Duración en minutos (paseo, sueño, juego…)', type: 'number', inputmode: 'numeric', min: 0 },
      { name: 'amount', label: 'Cantidad en gramos (comida)', type: 'number', inputmode: 'numeric', min: 0 },
      { name: 'note', label: 'Notas', placeholder: 'Opcional' },
    ],
    onSubmit: v => {
      const ts = fromInput(v.when);
      if (isNaN(ts)) { toast('La fecha no es válida'); return false; }
      const ev = { type: v.type, ts };
      if (+v.dur > 0) ev.dur = Math.round(+v.dur);
      if (+v.amount > 0) ev.amount = Math.round(+v.amount);
      if (v.note.trim()) ev.note = v.note.trim();
      addEvent(ev); toast('Registro guardado');
    },
  });
}

export function liveTick() {
  const s = getState(), now = Date.now();
  document.querySelectorAll('[data-live]').forEach(el => { const st = s.active[el.dataset.live]; if (st) el.textContent = fmtClock(now - st); });
}

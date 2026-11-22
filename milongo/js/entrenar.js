// Pestaña "Entrenar": comandos con pasos, nivel de avance y registro de prácticas.
import { getState, update } from './store.js';
import { SKILLS, SKILL_LEVELS, TRAIN_TIPS } from './data.js';
import { esc, todayKey, addDaysKey, dayKey, clock, dateShort, fmtDur } from './util.js';
import { ACT, toast, sheet } from './ui.js';
import { addEvent } from './events.js';

const open = new Set();
document.addEventListener('toggle', e => {
  const d = e.target; if (!d.matches || !d.matches('details.skill-d')) return;
  d.open ? open.add(d.dataset.id) : open.delete(d.dataset.id);
}, true);

export function renderEntrenar() {
  const s = getState(), lv = s.training.skills, tk = todayKey();
  const sessions = s.events.filter(e => e.type === 'entreno').sort((a, b) => b.ts - a.ts);
  const weekFrom = new Date(addDaysKey(tk, -6) + 'T00:00:00').getTime();
  const wk = sessions.filter(e => e.ts >= weekFrom);
  const wkMin = wk.reduce((a, e) => a + (e.dur || 0), 0);
  const days = new Set(wk.map(e => dayKey(e.ts))).size;
  const mastered = SKILLS.filter(k => (lv[k.id] || 0) >= 3).length;

  let h = `<h2 style="margin-top:6px">Entrenamiento</h2>
  <div class="card"><div class="spread"><div><b>${mastered} de ${SKILLS.length}</b><div class="s muted small">comandos dominados</div></div><div><b>${days} de 7</b><div class="s muted small">días practicados</div></div><div><b>${fmtDur(wkMin)}</b><div class="s muted small">esta semana</div></div></div></div>
  <div class="card"><h2>Reglas de oro</h2><ul class="steps">${TRAIN_TIPS.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
  <div class="card"><h2>Comandos</h2><p class="sub">Toca uno para ver cómo enseñarlo.</p>`;
  h += SKILLS.map(k => {
    const l = lv[k.id] || 0, last = sessions.find(e => e.sub === k.id);
    return `<details class="skill skill-d" data-id="${k.id}"${open.has(k.id) ? ' open' : ''}><summary style="list-style:none;cursor:pointer"><div class="spread"><div class="row"><span style="font-size:1.5rem">${k.icon}</span><div><b>${k.name}</b><div class="s muted small">${k.nivel}${last ? ' · último ' + dateShort(dayKey(last.ts)) : ''}</div></div></div><span class="chip ${l >= 3 ? 'ok' : l ? 'info' : ''}">${SKILL_LEVELS[l]}</span></div><div class="levels">${[0, 1, 2, 3].map(i => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</div></summary>
      <ol class="steps">${k.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol><p class="small muted">💡 ${esc(k.tip)}</p>
      <div class="row" style="margin-top:8px"><button class="btn primary sm" data-act="practice" data-id="${k.id}">🎓 Registrar práctica</button><button class="btn sm" data-act="levelUp" data-id="${k.id}">Cambiar nivel</button></div></details>`;
  }).join('') + '</div>';

  h += `<div class="card"><h2>Últimas prácticas</h2>` + (sessions.length ? '<div class="list">' + sessions.slice(0, 8).map(e => {
    const k = SKILLS.find(x => x.id === e.sub);
    return `<div class="item"><div class="ic">${k ? k.icon : '🎓'}</div><div class="grow"><div class="t">${esc(k ? k.name : 'Entrenamiento')}${e.dur ? ' · ' + e.dur + ' min' : ''}</div><div class="s">${dateShort(dayKey(e.ts))} ${clock(e.ts)}${e.note ? ' · ' + esc(e.note) : ''}</div></div></div>`;
  }).join('') + '</div>' : '<p class="empty">Aún no registras prácticas.</p>') + '</div>';
  return h;
}

Object.assign(ACT, {
  levelUp: d => update(s => { const c = s.training.skills[d.id] || 0; s.training.skills[d.id] = (c + 1) % 4; }),
  practice: d => {
    const k = SKILLS.find(x => x.id === d.id);
    sheet({
      title: k.icon + ' ' + k.name,
      fields: [{ name: 'dur', label: 'Minutos practicados', type: 'number', inputmode: 'numeric', value: 5, min: 1 },
        { name: 'res', label: '¿Cómo le fue?', type: 'select', options: ['Le costó', 'Bien', 'Muy bien'], value: 'Bien' },
        { name: 'note', label: 'Notas (opcional)' }],
      onSubmit: v => {
        addEvent({ type: 'entreno', sub: k.id, dur: Math.max(1, Math.round(+v.dur || 1)), note: [v.res, v.note.trim()].filter(Boolean).join(' · ') });
        const cur = getState().training.skills[k.id] || 0;
        if (v.res === 'Muy bien' && cur < 3) update(s => { s.training.skills[k.id] = cur + 1; });
        toast('🎓 Práctica guardada');
      },
    });
  },
});

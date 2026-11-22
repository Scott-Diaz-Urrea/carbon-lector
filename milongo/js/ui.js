// Piezas de interfaz compartidas: acciones por data-act, avisos, formularios en hoja.
import { esc } from './util.js';

export const ACT = {};
let renderFn = () => {};
export const setRender = f => { renderFn = f; };
export const rerender = () => renderFn();

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el.dataset, el, e); }
});

export function toast(msg, opt = {}) {
  const box = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<span>' + esc(msg) + '</span>';
  if (opt.label) {
    const b = document.createElement('button');
    b.textContent = opt.label;
    b.onclick = () => { t.remove(); opt.fn && opt.fn(); };
    t.appendChild(b);
  }
  box.appendChild(t);
  setTimeout(() => t.remove(), opt.ms || (opt.label ? 6000 : 2600));
}

function fieldHTML(f) {
  const id = 'f_' + f.name, v = f.value ?? '';
  let inp;
  if (f.type === 'select') {
    inp = `<select name="${f.name}" id="${id}">` + f.options.map(o => {
      const ov = typeof o === 'object' ? o.v : o, ol = typeof o === 'object' ? o.l : o;
      return `<option value="${esc(ov)}"${String(ov) === String(v) ? ' selected' : ''}>${esc(ol)}</option>`;
    }).join('') + '</select>';
  } else if (f.type === 'textarea') {
    inp = `<textarea name="${f.name}" id="${id}" rows="3"${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ''}>${esc(v)}</textarea>`;
  } else {
    inp = `<input type="${f.type || 'text'}" name="${f.name}" id="${id}" value="${esc(v)}"` +
      (f.required ? ' required' : '') + (f.step ? ` step="${f.step}"` : '') + (f.min != null ? ` min="${f.min}"` : '') +
      (f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : '') + (f.inputmode ? ` inputmode="${f.inputmode}"` : '') +
      (f.list ? ` list="dl_${f.name}"` : '') + ' autocomplete="off">' +
      (f.list ? `<datalist id="dl_${f.name}">${f.list.map(x => `<option value="${esc(x)}">`).join('')}</datalist>` : '');
  }
  return `<label class="fld"><span>${esc(f.label)}</span>${inp}${f.hint ? `<small>${esc(f.hint)}</small>` : ''}</label>`;
}

export function closeSheet() { const s = document.querySelector('.sheet-back'); if (s) s.remove(); }

// sheet({title, fields, submit, extra, onSubmit(values), onChange(form, event), danger:{label, fn}})
export function sheet(o) {
  closeSheet();
  const back = document.createElement('div');
  back.className = 'sheet-back';
  back.innerHTML = `<form class="sheet" novalidate><h2>${esc(o.title)}</h2>${o.intro ? `<p class="muted small" style="margin-bottom:10px">${o.intro}</p>` : ''}` +
    (o.fields || []).map(fieldHTML).join('') + (o.extra || '') +
    `<div class="actions"><button type="button" class="btn ghost" data-close>Cancelar</button><button type="submit" class="btn primary">${esc(o.submit || 'Guardar')}</button></div>` +
    (o.danger ? `<div class="actions"><button type="button" class="btn danger" data-danger>${esc(o.danger.label)}</button></div>` : '') + '</form>';
  document.body.appendChild(back);
  const form = back.querySelector('form');
  back.addEventListener('mousedown', e => { if (e.target === back) closeSheet(); });
  form.querySelector('[data-close]').onclick = closeSheet;
  if (o.danger) form.querySelector('[data-danger]').onclick = () => { closeSheet(); o.danger.fn(); };
  if (o.onChange) form.addEventListener('input', e => o.onChange(form, e));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...form.querySelectorAll('[required]')].find(i => !String(i.value).trim());
    if (bad) { bad.focus(); toast('Falta completar: ' + (bad.closest('label')?.querySelector('span')?.textContent || 'un campo')); return; }
    const vals = Object.fromEntries(new FormData(form));
    if (o.onSubmit(vals) !== false) closeSheet();
  });
  const first = form.querySelector('input:not([type=hidden]),select,textarea');
  if (first && !('ontouchstart' in window)) first.focus();
  return form;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

export const bar = (icon, label, val, goal, suffix = '') => {
  const pct = goal ? Math.min(100, Math.round(val / goal * 100)) : 0;
  return `<div class="prog"><div class="prog-top"><span>${icon} ${label}</span><b>${val}${goal ? ' / ' + goal : ''}${suffix}</b></div><div class="track"><i style="width:${pct}%" class="${pct >= 100 ? 'full' : ''}"></i></div></div>`;
};

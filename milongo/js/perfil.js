// Pestaña "Ficha": datos del perrito, metas diarias, guía según edad, respaldo e instalación.
import { getState, update, compressPhoto, replaceAll, wipe } from './store.js';
import { guideFor } from './data.js';
import { esc, ageText, dateFull, dayKey } from './util.js';
import { ACT, toast, sheet } from './ui.js';
import { avatarHTML } from './hoy.js';

const SEX = [{ v: '', l: 'Sin indicar' }, { v: 'macho', l: 'Macho' }, { v: 'hembra', l: 'Hembra' }];
const NEUT = [{ v: '', l: 'Sin indicar' }, { v: 'si', l: 'Sí' }, { v: 'no', l: 'No' }];
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const standalone = () => window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;

export function renderPerfil() {
  const s = getState(), d = s.dog, g = s.goals;
  const kg = [...s.weights].sort((a, b) => b.date.localeCompare(a.date))[0]?.kg;
  const gd = guideFor(d, kg);
  const f = (l, v) => v ? `<div class="item"><div class="s" style="min-width:110px">${l}</div><div class="t">${esc(v)}</div></div>` : '';
  let h = `<div class="card profile-head"><label class="photo">${avatarHTML('big')}<span class="cam">📷</span><input type="file" id="photoIn" accept="image/*" hidden></label>
    <h1>${esc(d.name || 'Tu perrito')}</h1><p class="muted">${[ageText(d.birth), d.breed, kg ? kg + ' kg' : ''].filter(Boolean).map(esc).join(' · ') || 'Toca la foto para subir una imagen'}</p>
    <button class="btn primary" style="margin-top:12px" data-act="editDog">✏️ Editar ficha</button></div>`;
  h += `<div class="card"><h2>Ficha</h2><div class="list">` +
    f('Nacimiento', d.birth && dateFull(d.birth)) + f('Sexo', d.sex) + f('Esterilizado', d.neutered === 'si' ? 'Sí' : d.neutered === 'no' ? 'No' : '') + f('Color', d.color) + f('Microchip', d.chip) +
    f('Veterinario', d.vetName) + (d.vetPhone ? `<div class="item"><div class="s" style="min-width:110px">Teléfono vet</div><a class="t" href="tel:${esc(d.vetPhone)}">${esc(d.vetPhone)}</a></div>` : '') +
    f('Alergias', d.allergies) + f('Notas', d.notes) + '</div>' +
    (!(d.name || d.birth || d.breed) ? '<p class="empty">La ficha está vacía. Toca “Editar ficha”.</p>' : '') + '</div>';

  h += `<div class="card"><div class="spread"><h2>Metas diarias</h2><button class="btn sm" data-act="editGoals">Cambiar</button></div><div class="list">
    <div class="item"><div class="grow">🍖 Comidas al día</div><b>${g.meals}${+g.gramsPerMeal ? ' · ' + g.gramsPerMeal + ' g c/u' : ''}</b></div>
    <div class="item"><div class="grow">🚶 Paseos al día</div><b>${g.walks} · ${g.walkMin} min en total</b></div>
    <div class="item"><div class="grow">💧 Cambio de agua</div><b>cada ${g.waterEveryH} h</b></div>
    <div class="item"><div class="grow">🛁 Baño</div><b>cada ${g.bathEveryDays} días</b></div>
    <div class="item"><div class="grow">🦷 Cepillado</div><b>cada ${g.brushEveryDays} días</b></div></div></div>`;

  h += `<div class="card"><h2>Guía para su edad</h2><p class="sub">Valores generales${d.birth ? ' para ' + esc(ageText(d.birth)) : ''}${kg ? ' y ' + kg + ' kg' : ''}. ${d.birth && kg ? '' : 'Agrega fecha de nacimiento y peso para afinarlos.'}</p><div class="list">
    <div class="item"><div class="ic">😴</div><div class="grow">Sueño</div><b>${gd.sleep}</b></div>
    <div class="item"><div class="ic">🍖</div><div class="grow">Comidas</div><b>${gd.meals} al día</b></div>
    ${gd.food ? `<div class="item"><div class="ic">🥣</div><div class="grow">Cantidad aprox.</div><b>${gd.food}</b></div><div class="item"><div class="ic">💧</div><div class="grow">Agua aprox.</div><b>${gd.water}</b></div>` : ''}
    <div class="item"><div class="ic">💦</div><div class="grow">Ir al baño</div><b>${gd.toilet}</b></div>
    <div class="item"><div class="ic">🚶</div><div class="grow">Paseo</div><b>${gd.walk}</b></div></div>
    ${gd.brachy ? '<p class="note">Las razas de hocico corto (pug, bulldog, boxer…) se agotan y se sobrecalientan fácil: pasea en horas frescas, usa arnés y evita el ejercicio fuerte en días de calor.</p>' : ''}
    <p class="note">Son referencias generales. La comida depende de la marca y de su gasto de energía: sigue la etiqueta y lo que indique tu veterinario.</p></div>`;

  const bk = s.backupAt ? 'Último respaldo: ' + dateFull(dayKey(s.backupAt)) : 'Aún no has hecho un respaldo';
  h += `<div class="card"><h2>Respaldo de datos</h2><p class="sub">${bk}. Todo se guarda solo en este teléfono; si lo cambias o se borra el navegador, lo perderías.</p>
    <div class="row"><button class="btn primary sm" data-act="backup">💾 Guardar respaldo</button><label class="btn sm" style="cursor:pointer">📂 Restaurar<input type="file" id="importIn" accept=".json,application/json" hidden></label></div></div>`;

  if (isIOS() && !standalone()) h += `<div class="card"><h2>📲 Instálala en tu iPhone</h2><p class="sub">Así se abre como app, a pantalla completa, y iOS no borra tus datos por falta de uso.</p><ol class="steps"><li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón Compartir (el cuadrado con la flecha ⬆️).</li><li>Elige <b>“Añadir a pantalla de inicio”</b> y confirma con “Añadir”.</li></ol></div>`;
  h += `<div class="card"><button class="btn danger sm" data-act="wipeAll">🗑️ Borrar todos los datos</button></div>`;
  return h;
}

function dogSheet() {
  const d = getState().dog;
  sheet({
    title: 'Ficha de tu perrito',
    fields: [{ name: 'name', label: 'Nombre', value: d.name, required: true },
      { name: 'breed', label: 'Raza', value: d.breed, placeholder: 'Ej: Pug, mestizo…' },
      { name: 'birth', label: 'Fecha de nacimiento (aprox.)', type: 'date', value: d.birth },
      { name: 'sex', label: 'Sexo', type: 'select', options: SEX, value: d.sex },
      { name: 'neutered', label: 'Esterilizado', type: 'select', options: NEUT, value: d.neutered },
      { name: 'color', label: 'Color', value: d.color },
      { name: 'chip', label: 'N° de microchip', value: d.chip, inputmode: 'numeric' },
      { name: 'vetName', label: 'Veterinario / clínica', value: d.vetName },
      { name: 'vetPhone', label: 'Teléfono del veterinario', type: 'tel', value: d.vetPhone },
      { name: 'allergies', label: 'Alergias o condiciones', type: 'textarea', value: d.allergies },
      { name: 'notes', label: 'Notas (carácter, miedos, comida favorita…)', type: 'textarea', value: d.notes }],
    onSubmit: v => { update(s => { Object.assign(s.dog, Object.fromEntries(Object.entries(v).map(([k, x]) => [k, String(x).trim()]))); }); toast('Ficha guardada'); },
  });
}
function goalsSheet() {
  const g = getState().goals;
  sheet({
    title: 'Metas diarias',
    fields: [{ name: 'meals', label: 'Comidas al día', type: 'number', inputmode: 'numeric', value: g.meals, min: 1 },
      { name: 'gramsPerMeal', label: 'Gramos por comida (0 = no anotar)', type: 'number', inputmode: 'numeric', value: g.gramsPerMeal, min: 0 },
      { name: 'walks', label: 'Paseos al día', type: 'number', inputmode: 'numeric', value: g.walks, min: 0 },
      { name: 'walkMin', label: 'Minutos de paseo al día (total)', type: 'number', inputmode: 'numeric', value: g.walkMin, min: 0 },
      { name: 'waterEveryH', label: 'Cambiar el agua cada (horas)', type: 'number', inputmode: 'numeric', value: g.waterEveryH, min: 1 },
      { name: 'bathEveryDays', label: 'Baño cada (días)', type: 'number', inputmode: 'numeric', value: g.bathEveryDays, min: 1 },
      { name: 'brushEveryDays', label: 'Cepillar dientes cada (días)', type: 'number', inputmode: 'numeric', value: g.brushEveryDays, min: 1 }],
    onSubmit: v => { update(s => { for (const k of Object.keys(v)) s.goals[k] = Math.max(0, +v[k] || 0) || s.goals[k]; s.goals.gramsPerMeal = Math.max(0, +v.gramsPerMeal || 0); }); toast('Metas guardadas'); },
  });
}

async function doBackup() {
  const data = JSON.stringify({ app: 'Milongo', version: 1, savedAt: Date.now(), data: getState() });
  const name = 'milongo-respaldo-' + dayKey(Date.now()) + '.json';
  const file = new File([data], name, { type: 'application/json' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: 'Respaldo de Milongo' });
    else { const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  update(s => { s.backupAt = Date.now(); });
  toast('💾 Respaldo listo. Guárdalo en Archivos, iCloud o envíatelo.');
}

Object.assign(ACT, {
  editDog: dogSheet, editGoals: goalsSheet, backup: doBackup,
  wipeAll: () => { if (confirm('Se borrarán TODOS los datos de tu perrito en este teléfono. ¿Seguro?') && confirm('Última confirmación: no se puede deshacer.')) { wipe(); toast('Datos borrados'); } },
});

document.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'photoIn' && t.files[0]) {
    try { const url = await compressPhoto(t.files[0]); update(s => { s.dog.photo = url; }); toast('📸 Foto guardada'); }
    catch (err) { toast('No se pudo leer esa imagen'); }
  } else if (t.id === 'importIn' && t.files[0]) {
    try {
      const j = JSON.parse(await t.files[0].text());
      if (j.app !== 'Milongo' || !j.data) throw new Error('formato');
      if (confirm('Esto reemplaza los datos actuales por los del respaldo. ¿Continuar?')) { replaceAll(j.data); toast('✅ Datos restaurados'); }
    } catch (err) { toast('Ese archivo no es un respaldo de Milongo'); }
    t.value = '';
  }
});

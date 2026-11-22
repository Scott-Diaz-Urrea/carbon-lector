// Estado de la app, guardado en el almacenamiento del dispositivo (localStorage).
// Atención en iPhone: Safari puede borrar los datos de una web que no está instalada tras ~7 días sin uso;
// por eso se recomienda instalarla ("Añadir a pantalla de inicio") y hacer respaldos.
const KEY = 'milongo_v1';
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const defaults = () => ({
  v: 1,
  dog: { name: '', photo: '', breed: '', sex: '', birth: '', color: '', chip: '', neutered: '', vetName: '', vetPhone: '', allergies: '', notes: '' },
  goals: { meals: 2, gramsPerMeal: 0, walks: 2, walkMin: 40, waterEveryH: 24, bathEveryDays: 30, brushEveryDays: 2 },
  events: [], weights: [], vaccines: [], parasites: [], visits: [], meds: [], reminders: [],
  training: { skills: {} },
  active: { paseo: null, sueno: null },
  backupAt: 0,
});

let state = load();
const subs = [];

function load() {
  const base = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    return mergeInto(base, JSON.parse(raw));
  } catch (e) { console.warn('No se pudo leer el guardado', e); }
  return base;
}
function mergeInto(base, s) {
  if (!s || typeof s !== 'object') return base;
  for (const k of Object.keys(base)) {
    if (s[k] === undefined) continue;
    if (Array.isArray(base[k])) base[k] = Array.isArray(s[k]) ? s[k] : base[k];
    else if (base[k] && typeof base[k] === 'object') base[k] = { ...base[k], ...(s[k] && typeof s[k] === 'object' ? s[k] : {}) };
    else base[k] = s[k];
  }
  return base;
}

export const getState = () => state;
export const subscribe = f => subs.push(f);
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch (e) { window.dispatchEvent(new CustomEvent('milongo-savefail')); return false; }
}
export function update(fn) { fn(state); const ok = save(); subs.forEach(f => f()); return ok; }
export function replaceAll(obj) { state = mergeInto(defaults(), obj); save(); subs.forEach(f => f()); }
export function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} state = defaults(); subs.forEach(f => f()); }

// Reduce la foto para que quepa bien en el almacenamiento (JPEG ~30-60 KB).
export function compressPhoto(file, max = 420) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * r), h = Math.round(img.height * r);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagen')); };
    img.src = url;
  });
}

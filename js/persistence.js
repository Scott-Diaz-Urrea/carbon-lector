import { state } from './state.js';
import { HOUSE_ITEMS, HOUSE_FREE, HOUSE_LIMIT, HOUSE_MAX_ITEMS, MUNDO_ITEMS, SLOT_DEFAULTS, LEGACY_ITEM_MAP } from './content/mundoItems.js';

/* ---------- Perfiles: varios jugadores en el mismo dispositivo ----------
   El jugador 'p1' usa la clave de siempre ('leo_progress_v1'), así el avance anterior sigue siendo suyo.
   Los demás usan 'leo_progress_v1_<id>'. El índice vive en 'leo_profiles_v1'. */
const IDX_KEY = 'leo_profiles_v1';
const MAX_PROFILES = 5;
export function storageKey(id){ return id === 'p1' ? 'leo_progress_v1' : 'leo_progress_v1_' + id; }
export function getProfileIndex(){
  try{
    const i = JSON.parse(localStorage.getItem(IDX_KEY));
    if(i && Array.isArray(i.list) && i.list.length && i.list.some(function(q){ return q.id === i.active; })) return i;
  }catch(e){}
  return { active:'p1', list:[{ id:'p1' }] };
}
function putIndex(i){ try{ localStorage.setItem(IDX_KEY, JSON.stringify(i)); }catch(e){} }
let activeCache = null;
export function getActiveProfile(){ return activeCache || (activeCache = getProfileIndex().active); }
export function setActiveProfile(id){
  const i = getProfileIndex();
  if(i.list.some(function(q){ return q.id === id; })){ i.active = id; putIndex(i); activeCache = id; }
}
export function createProfile(name){
  const i = getProfileIndex();
  if(i.list.length >= MAX_PROFILES) return null;
  const id = 'p' + Date.now().toString(36);
  i.list.push({ id:id }); putIndex(i);
  try{ localStorage.setItem(storageKey(id), JSON.stringify({ userName:name })); }catch(e){}
  return id;
}
export function deleteProfile(id){
  const i = getProfileIndex();
  if(i.list.length <= 1) return false;
  i.list = i.list.filter(function(q){ return q.id !== id; });
  if(i.active === id){ i.active = i.list[0].id; activeCache = i.active; }
  putIndex(i);
  try{ localStorage.removeItem(storageKey(id)); }catch(e){}
  return true;
}
export const MAX_PLAYERS = MAX_PROFILES;

/* Copia del estado inicial (se toma al importar, antes de cargar nada) para poder leer el avance de otros jugadores. */
let DEFAULTS_JSON = null;   // se toma en loadProgress() (state.js importa este módulo, así que no se puede leer al evaluarlo)
function captureDefaults(){
  if(!DEFAULTS_JSON) DEFAULTS_JSON = JSON.stringify({ xp:state.xp, currentGrade:state.currentGrade, currentNivel:state.currentNivel, userName:'', coins:state.coins, world:state.world, stars:state.stars });
}
function freshState(){ captureDefaults(); const st = JSON.parse(DEFAULTS_JSON); st.badges = new Set(); return st; }

function applySaved(saved, st){
    if(typeof saved.xp === 'number') st.xp = saved.xp;
    if(typeof saved.currentGrade === 'number') st.currentGrade = saved.currentGrade;
    if(typeof saved.currentNivel === 'string') st.currentNivel = saved.currentNivel;
    if(typeof saved.userName === 'string') st.userName = saved.userName;
    if(typeof saved.coins === 'number' && saved.coins >= 0) st.coins = saved.coins;
    if(saved.world && typeof saved.world === 'object'){
      const w = saved.world, cur = st.world;
      const known = MUNDO_ITEMS.map(function(i){ return i.id; });
      function fixId(x){ return typeof x === 'string' ? (LEGACY_ITEM_MAP[x] || x) : x; }
      if(Array.isArray(w.owned)){
        cur.owned = w.owned.map(fixId).filter(function(x){ return known.indexOf(x) !== -1; });
      }
      ['shirt_azul','pants_azul','shoes_negro'].forEach(function(f){ if(cur.owned.indexOf(f) === -1) cur.owned.push(f); });
      const eq = w.equipped || {};
      const legacyAcc = fixId(eq.acc);
      Object.keys(SLOT_DEFAULTS).forEach(function(slot){
        let id = fixId(eq[slot]);
        if(slot === 'hat' && !id && /^hat_/.test(legacyAcc)) id = legacyAcc;
        if(slot === 'face' && !id && /^face_/.test(legacyAcc)) id = legacyAcc;
        if(slot === 'back' && !id && /^back_/.test(legacyAcc)) id = legacyAcc;
        if(slot === 'neck' && !id && /^neck_/.test(legacyAcc)) id = legacyAcc;
        const ok = typeof id === 'string' && id.indexOf(slot + '_') === 0 && cur.owned.indexOf(id) !== -1;
        cur.equipped[slot] = ok ? id : SLOT_DEFAULTS[slot];
      });
      if(w.daily && typeof w.daily === 'object'){
        if(typeof w.daily.last === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.daily.last)) cur.daily.last = w.daily.last;
        if(typeof w.daily.streak === 'number' && w.daily.streak >= 0 && w.daily.streak < 10000) cur.daily.streak = Math.floor(w.daily.streak);
      }
      if(typeof w.studyDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.studyDay)) cur.studyDay = w.studyDay;
      ['obby','laberinto'].forEach(function(k){
        if(w.best && typeof w.best[k] === 'number' && w.best[k] > 0) cur.best[k] = w.best[k];
        if(w.medals && (w.medals[k] === 1 || w.medals[k] === 2 || w.medals[k] === 3)) cur.medals[k] = w.medals[k];
      });
      if(w.gameDay && typeof w.gameDay.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.gameDay.date) && typeof w.gameDay.n === 'number' && w.gameDay.n >= 0 && w.gameDay.n < 1000){
        cur.gameDay.date = w.gameDay.date; cur.gameDay.n = Math.floor(w.gameDay.n);
      }
      if(w.daily && typeof w.daily === 'object'){
        if(typeof w.daily.last === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.daily.last)) cur.daily.last = w.daily.last;
        if(typeof w.daily.streak === 'number' && w.daily.streak >= 0 && w.daily.streak < 10000) cur.daily.streak = Math.floor(w.daily.streak);
      }
      if(typeof w.studyDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.studyDay)) cur.studyDay = w.studyDay;
      if(w.best && typeof w.best.obby === 'number' && w.best.obby > 0) cur.best.obby = w.best.obby;
      if(w.medals && (w.medals.obby === 1 || w.medals.obby === 2 || w.medals.obby === 3)) cur.medals.obby = w.medals.obby;
      if(w.bosses && typeof w.bosses === 'object'){
        Object.keys(cur.bosses).forEach(function(k){ if(w.bosses[k] === true) cur.bosses[k] = true; });
      }
      if(w.quests && typeof w.quests === 'object'){
        Object.keys(cur.quests).forEach(function(k){ const v = w.quests[k]; if(v === 0 || v === 1 || v === 2) cur.quests[k] = v; });
      }
      if(Array.isArray(w.looks)){
        [0,1,2].forEach(function(i){
          const L = w.looks[i];
          if(L && typeof L === 'object' && L.equipped && typeof L.equipped === 'object'){
            const eqs = {};
            Object.keys(SLOT_DEFAULTS).forEach(function(slot){
              const id = fixId(L.equipped[slot]);
              eqs[slot] = (typeof id === 'string' && id.indexOf(slot + '_') === 0) ? id : (id === null && !/^(shirt|pants|shoes)$/.test(slot) ? null : SLOT_DEFAULTS[slot]);
            });
            cur.looks[i] = { tone: typeof L.tone === 'number' ? L.tone : 1, hair: typeof L.hair === 'string' ? L.hair : 'corto', hairColor: typeof L.hairColor === 'number' ? L.hairColor : 1, equipped: eqs };
          }else cur.looks[i] = null;
        });
      }
      const av = w.avatar || {};
      cur.avatar.created = av.created === true;
      if(typeof av.tone === 'number') cur.avatar.tone = av.tone;
      if(typeof av.hair === 'string') cur.avatar.hair = av.hair;
      if(typeof av.hairColor === 'number') cur.avatar.hairColor = av.hairColor;
      if(w.missions && typeof w.missions === 'object'){
        Object.keys(cur.missions).forEach(function(k){ if(typeof w.missions[k] === 'number') cur.missions[k] = w.missions[k]; });
      }else if(typeof w.mission === 'number') cur.missions.bosque = w.mission;   // formato de la Fase 1
      if(w.house && typeof w.house === 'object'){
        const ids = HOUSE_ITEMS.map(function(i){ return i.id; });
        const owned = Array.isArray(w.house.owned) ? w.house.owned.filter(function(x){ return ids.indexOf(x) !== -1; }) : [];
        HOUSE_FREE.forEach(function(f){ if(owned.indexOf(f) === -1) owned.push(f); });
        cur.house.owned = owned;
        const L = HOUSE_LIMIT;
        function okInt(n, lo, hi){ return typeof n === 'number' && n === Math.round(n) && n >= lo && n <= hi; }
        cur.house.items = Array.isArray(w.house.items) ? w.house.items.filter(function(it){
          return it && ids.indexOf(it.t) !== -1 && okInt(it.x,-L,L) && okInt(it.z,-L,L) && okInt(it.y,0,3);
        }).slice(0, HOUSE_MAX_ITEMS).map(function(it){ return { t:it.t, x:it.x, y:it.y, z:it.z }; }) : [];
      }
      if(Array.isArray(w.unlocked)){
        cur.unlocked = w.unlocked.filter(function(x){ return x==='bosque' || x==='playa' || x==='espacio' || x==='obby' || x==='volcan' || x==='arrecife' || x==='feria'; });
        if(cur.unlocked.indexOf('bosque') === -1) cur.unlocked.unshift('bosque');
      }
    }
    if(saved.stars && typeof saved.stars === 'object'){
      Object.keys(st.stars).forEach(function(key){
        if(typeof saved.stars[key] === 'number') st.stars[key] = saved.stars[key];
      });
    }
    if(Array.isArray(saved.badges)){
      saved.badges.forEach(function(b){ st.badges.add(b); });
    }
}

export function loadProgress(){
  captureDefaults();   // antes de aplicar nada: estado inicial limpio
  try{
    const raw = localStorage.getItem(storageKey(getActiveProfile()));
    if(!raw) return;
    applySaved(JSON.parse(raw), state);
  }catch(e){
    /* localStorage no disponible (modo privado, cuota llena) o datos corruptos:
       la app sigue funcionando normalmente, solo sin progreso restaurado. */
  }
}

/* Lee (sin tocar el estado vivo) el avance validado de un jugador: tablero familiar y visitas a su casa. */
export function peekProfile(id){
  try{
    const raw = localStorage.getItem(storageKey(id));
    const st = freshState();
    if(raw) applySaved(JSON.parse(raw), st);
    return st;
  }catch(e){ return null; }
}

export function saveProgress(){
  try{
    localStorage.setItem(storageKey(getActiveProfile()), JSON.stringify({
      xp: state.xp,
      currentGrade: state.currentGrade,
      currentNivel: state.currentNivel,
      userName: state.userName,
      coins: state.coins,
      world: state.world,
      stars: state.stars,
      badges: Array.from(state.badges),
    }));
  }catch(e){
    /* localStorage no disponible: el progreso simplemente no persiste, sin romper el juego. */
  }
}

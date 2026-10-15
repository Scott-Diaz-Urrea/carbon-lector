import { state } from './state.js';
import { HOUSE_ITEMS, HOUSE_FREE, HOUSE_LIMIT, HOUSE_MAX_ITEMS, MUNDO_ITEMS, SLOT_DEFAULTS, LEGACY_ITEM_MAP } from './content/mundoItems.js';

const STORAGE_KEY = 'leo_progress_v1';

export function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);
    if(typeof saved.xp === 'number') state.xp = saved.xp;
    if(typeof saved.currentGrade === 'number') state.currentGrade = saved.currentGrade;
    if(typeof saved.currentNivel === 'string') state.currentNivel = saved.currentNivel;
    if(typeof saved.userName === 'string') state.userName = saved.userName;
    if(typeof saved.coins === 'number' && saved.coins >= 0) state.coins = saved.coins;
    if(saved.world && typeof saved.world === 'object'){
      const w = saved.world, cur = state.world;
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
      if(w.best && typeof w.best.obby === 'number' && w.best.obby > 0) cur.best.obby = w.best.obby;
      if(w.medals && (w.medals.obby === 1 || w.medals.obby === 2 || w.medals.obby === 3)) cur.medals.obby = w.medals.obby;
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
        cur.unlocked = w.unlocked.filter(function(x){ return x==='bosque' || x==='playa' || x==='espacio' || x==='obby' || x==='volcan' || x==='arrecife'; });
        if(cur.unlocked.indexOf('bosque') === -1) cur.unlocked.unshift('bosque');
      }
    }
    if(saved.stars && typeof saved.stars === 'object'){
      Object.keys(state.stars).forEach(function(key){
        if(typeof saved.stars[key] === 'number') state.stars[key] = saved.stars[key];
      });
    }
    if(Array.isArray(saved.badges)){
      saved.badges.forEach(function(b){ state.badges.add(b); });
    }
  }catch(e){
    /* localStorage no disponible (modo privado, cuota llena) o datos corruptos:
       la app sigue funcionando normalmente, solo sin progreso restaurado. */
  }
}

export function saveProgress(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
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

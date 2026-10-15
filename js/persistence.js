import { state } from './state.js';

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
      if(Array.isArray(w.owned)){
        cur.owned = w.owned.filter(function(x){ return typeof x === 'string' && /^(shirt|acc)_/.test(x); });
        if(cur.owned.indexOf('shirt_azul') === -1) cur.owned.unshift('shirt_azul');
      }
      const eq = w.equipped || {};
      cur.equipped.shirt = (typeof eq.shirt === 'string' && cur.owned.indexOf(eq.shirt) !== -1) ? eq.shirt : 'shirt_azul';
      cur.equipped.acc = (typeof eq.acc === 'string' && cur.owned.indexOf(eq.acc) !== -1) ? eq.acc : null;
      const av = w.avatar || {};
      cur.avatar.created = av.created === true;
      if(typeof av.tone === 'number') cur.avatar.tone = av.tone;
      if(typeof av.hair === 'string') cur.avatar.hair = av.hair;
      if(typeof av.hairColor === 'number') cur.avatar.hairColor = av.hairColor;
      if(w.missions && typeof w.missions === 'object'){
        Object.keys(cur.missions).forEach(function(k){ if(typeof w.missions[k] === 'number') cur.missions[k] = w.missions[k]; });
      }else if(typeof w.mission === 'number') cur.missions.bosque = w.mission;   // formato de la Fase 1
      if(Array.isArray(w.unlocked)){
        cur.unlocked = w.unlocked.filter(function(x){ return x==='bosque' || x==='playa' || x==='espacio'; });
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

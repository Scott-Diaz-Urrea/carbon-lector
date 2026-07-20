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
      stars: state.stars,
      badges: Array.from(state.badges),
    }));
  }catch(e){
    /* localStorage no disponible: el progreso simplemente no persiste, sin romper el juego. */
  }
}

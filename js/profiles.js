/* Jugadores (perfiles) y tablero familiar. Todo vive en este dispositivo (localStorage); no hay servidor. */
import { state } from './state.js';
import { saveProgress, getProfileIndex, getActiveProfile, setActiveProfile, createProfile, deleteProfile, peekProfile, MAX_PLAYERS } from './persistence.js';

function markChosen(){ try{ sessionStorage.setItem('leo_profile_chosen', '1'); }catch(e){} }
export function profileChosenThisSession(){ try{ return sessionStorage.getItem('leo_profile_chosen') === '1'; }catch(e){ return false; } }
function esc(t){ return String(t).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }

/* Resumen de cada jugador, ordenado por estrellas (para el tablero y el selector). */
export function profileSummaries(){
  saveProgress();   // el jugador activo se guarda antes de leer, para que el tablero esté al día
  const act = getActiveProfile();
  return getProfileIndex().list.map(function(q){
    const st = peekProfile(q.id) || {};
    const w = st.world || {};
    return {
      id:q.id, active:q.id === act, name:st.userName || 'Jugador',
      stars:Object.values(st.stars || {}).reduce(function(a,b){ return a+b; }, 0),
      coins:st.coins || 0,
      medal:(w.medals && w.medals.obby) || 0,
      best:(w.best && w.best.obby) || null,
      bosses:w.bosses ? Object.values(w.bosses).filter(Boolean).length : 0,
      blocks:(w.house && w.house.items) ? w.house.items.length : 0,
      houseItems:(w.house && w.house.items) ? w.house.items : [],
    };
  }).sort(function(a,b){ return b.stars - a.stars; });
}

function pickerHTML(){
  const list = profileSummaries().sort(function(a,b){ return (a.active ? -1 : 0) - (b.active ? -1 : 0); });
  const rows = list.map(function(p){
    return '<div class="pf-row'+(p.active?' active':'')+'">'+
      '<button class="pf-pick" onclick="pfChoose(\''+p.id+'\')"><b>'+esc(p.name)+(p.active?' (tú ahora)':'')+'</b><small>⭐ '+p.stars+' · 💰 '+p.coins+'</small></button>'+
      (list.length > 1 ? '<button class="pf-del" onclick="pfDelete(\''+p.id+'\')" aria-label="Borrar jugador">🗑</button>' : '')+
    '</div>';
  }).join('');
  return '<div class="result-card profile-card">'+
    '<p class="result-title">¿Quién juega?</p>'+
    '<div class="pf-list">'+rows+'</div>'+
    (list.length < MAX_PLAYERS
      ? '<div class="pf-new"><input id="pf-name" class="name-input" maxlength="14" placeholder="Nombre del nuevo jugador" autocomplete="off"><button class="cta-btn" onclick="pfCreate()">➕ Crear jugador</button></div>'
      : '<p class="pf-note">Máximo '+MAX_PLAYERS+' jugadores.</p>')+
    '<button class="cta-btn secondary" onclick="pfClose()">Cerrar</button>'+
  '</div>';
}
export function showProfilePicker(){
  const app = document.getElementById('app'); if(!app) return;
  let ov = document.getElementById('pf-overlay');
  if(!ov){ ov = document.createElement('div'); ov.id = 'pf-overlay'; ov.className = 'overlay profile-overlay'; app.appendChild(ov); }
  ov.innerHTML = pickerHTML();
}
export function pfClose(){ const ov = document.getElementById('pf-overlay'); if(ov) ov.remove(); markChosen(); if(!state.userName){ /* sin nombre: el flujo normal de nombre se encarga */ } }
export function pfChoose(id){
  markChosen();
  if(id === getActiveProfile()){ pfClose(); return; }
  saveProgress();            // guarda al jugador actual antes de cambiar
  setActiveProfile(id);
  location.reload();         // carga limpia del nuevo jugador
}
export function pfCreate(){
  const inp = document.getElementById('pf-name');
  const name = inp ? inp.value.trim().slice(0,14) : '';
  if(!name){ if(inp){ inp.focus(); inp.placeholder = '¡Escribe un nombre!'; } return; }
  const id = createProfile(name);
  if(!id) return;
  markChosen(); saveProgress(); setActiveProfile(id); location.reload();
}
export function pfDelete(id){
  const target = peekProfile(id);
  const nm = target && target.userName ? target.userName : 'este jugador';
  if(!window.confirm('¿Borrar a ' + nm + '? Se pierde todo su avance, su avatar y su casa. No se puede deshacer.')) return;
  const wasActive = (id === getActiveProfile());
  if(!wasActive) saveProgress();
  deleteProfile(id);
  if(wasActive){ markChosen(); location.reload(); return; }
  showProfilePicker();
}

/* Jugadores (perfiles) y tablero familiar. Todo vive en este dispositivo (localStorage); no hay servidor. */
import { state } from './state.js';
import { saveProgress, getProfileIndex, getActiveProfile, setActiveProfile, createProfile, deleteProfile, peekProfile, MAX_PLAYERS, storageKey } from './persistence.js';
import { todayStr } from './state.js';

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
    '<div class="pf-backup"><b>💾 Respaldo</b><small>'+backupInfoText()+'</small>'+
      '<div class="pf-backup-btns"><button class="av-chip" onclick="bkDownload()">⬇ Guardar respaldo</button><button class="av-chip" onclick="bkPickFile()">⬆ Restaurar</button></div>'+
      '<input type="file" id="bk-file" accept="application/json,.json" hidden onchange="bkRestoreFile(this.files[0])"></div>'+
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

/* ---------- Respaldo en archivo (por si el navegador borra los datos, o para pasar el avance a otro aparato) ---------- */
function lastBackup(){ try{ return localStorage.getItem('leo_last_backup') || ''; }catch(e){ return ''; } }
function markBackup(){ try{ localStorage.setItem('leo_last_backup', todayStr()); }catch(e){} }
function daysSince(dateStr){
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr); if(!m) return null;
  return Math.floor((Date.now() - new Date(+m[1], +m[2]-1, +m[3]).getTime()) / 86400000);
}
function backupInfoText(){
  const d = daysSince(lastBackup());
  return d === null ? 'Guarda un archivo con el avance de todos los jugadores. Aún no has hecho ninguno.' : (d === 0 ? 'Último respaldo: hoy.' : 'Último respaldo: hace ' + d + (d === 1 ? ' día.' : ' días.'));
}
/* Recordatorio suave en el inicio: solo si hay avance y no hay respaldo reciente. */
export function backupTipHTML(){
  const me = peekProfile(getActiveProfile());
  const prog = me ? (me.coins + Object.values(me.stars || {}).reduce(function(a,b){ return a+b; }, 0)) : 0;
  const d = daysSince(lastBackup());
  if(prog < 15 || (d !== null && d < 30)) return '';
  return '<button class="backup-tip" onclick="showProfilePicker()">💾 Guarda un respaldo de tu avance (toca aquí)</button>';
}
export function makeBackup(){
  saveProgress();
  const idx = getProfileIndex(), data = { app:'LEO', version:1, date:new Date().toISOString(), index:idx, profiles:{} };
  idx.list.forEach(function(q){ try{ const raw = localStorage.getItem(storageKey(q.id)); if(raw) data.profiles[q.id] = JSON.parse(raw); }catch(e){} });
  return data;
}
export function bkDownload(){
  const blob = new Blob([JSON.stringify(makeBackup())], { type:'application/json' });
  const name = 'leo-respaldo-' + todayStr() + '.json';
  try{   // en celular/tablet: hoja de compartir con el archivo (guardar en Archivos, Drive, WhatsApp…)
    const f = new File([blob], name, { type:'application/json' });
    if(window.matchMedia('(pointer:coarse)').matches && navigator.canShare && navigator.canShare({ files:[f] })){
      navigator.share({ files:[f], title:'Respaldo de LEO' }).then(function(){ markBackup(); showProfilePicker(); }).catch(function(){});
      return;
    }
  }catch(e){}
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  markBackup(); showProfilePicker();
}
export function bkPickFile(){ const i = document.getElementById('bk-file'); if(i){ i.value = ''; i.click(); } }
export function bkRestoreFile(file){
  if(!file) return;
  const rd = new FileReader();
  rd.onerror = function(){ window.alert('No se pudo leer el archivo.'); };
  rd.onload = function(){
    let data;
    try{ data = JSON.parse(String(rd.result)); }catch(e){ window.alert('Ese archivo no es un respaldo válido de LEO.'); return; }
    const okId = function(id){ return typeof id === 'string' && /^p[a-z0-9]{1,12}$/.test(id); };
    if(!data || data.app !== 'LEO' || !data.index || !Array.isArray(data.index.list) || !data.profiles || typeof data.profiles !== 'object'){ window.alert('Ese archivo no es un respaldo válido de LEO.'); return; }
    const ids = data.index.list.map(function(q){ return q && q.id; }).filter(function(id){ return okId(id) && data.profiles[id] && typeof data.profiles[id] === 'object'; });
    if(!ids.length){ window.alert('El respaldo no trae ningún jugador.'); return; }
    const names = ids.map(function(id){ return data.profiles[id].userName || 'Jugador'; }).join(', ');
    if(!window.confirm('Se restaurarán estos jugadores: ' + names + '.\n\nSi ya existen en este dispositivo, su avance actual se reemplaza por el del respaldo. ¿Continuar?')) return;
    try{
      ids.forEach(function(id){ localStorage.setItem(storageKey(id), JSON.stringify(data.profiles[id])); });
      const cur = getProfileIndex();
      const merged = ids.map(function(id){ return { id:id }; });
      cur.list.forEach(function(q){ if(merged.length < MAX_PLAYERS && !merged.some(function(m){ return m.id === q.id; })) merged.push({ id:q.id }); });
      const active = ids.indexOf(data.index.active) !== -1 ? data.index.active : ids[0];
      localStorage.setItem('leo_profiles_v1', JSON.stringify({ active:active, list:merged }));
      markBackup(); markChosen();
    }catch(e){ window.alert('No se pudo guardar el respaldo en este dispositivo (¿poco espacio?).'); return; }
    location.reload();
  };
  rd.readAsText(file);
}

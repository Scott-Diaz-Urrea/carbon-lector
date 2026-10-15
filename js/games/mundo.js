/* =========================================================
   "Mundo de Carboncito" — mundo 3D explorable (herramienta/juego
   transversal, no atado a un OA: ver CLAUDE.md, mismo estatus que
   Colorear por Números / Aprendo a Leer).
   - Three.js se carga bajo demanda desde CDN (import dinámico) solo
     cuando el niño entra al mundo; el resto de LEO no depende de él.
   - Todo el arte es geometría simple (cajas/conos/esferas): estilo
     "bloques", sin modelos ni texturas externas.
   - Controles: teclado (WASD/flechas) en PC, joystick táctil en
     celular/tablet.
   - Las monedas se ganan estudiando y se gastan en la tienda
     (accesorios y colores de Carboncito).
   ========================================================= */
import { state, showToast, spendCoins, awardCoins, totalStars, todayStr, yesterdayStr, setBackHook } from '../state.js';
import { playBeep, audioRunning, sfxCorrect, sfxWrong, sfxStreak, sfxLevelup, speak } from '../audio.js';
import { saveProgress } from '../persistence.js';
import { render } from '../render.js';
import { MC_GAMES } from '../mcEngine.js';
import { profileSummaries } from '../profiles.js';
import { LENGUAJE_BY_GRADE, MATE_BY_GRADE, NUCLEO_DEFS } from '../gradeContent.js';
import { MUNDO_ITEMS, AVATAR_SLOTS, itemsBySlot, cssOf, itemById, AVATAR_TONES, AVATAR_HAIRS, AVATAR_HAIR_COLORS, hexCss, SEASONS, activeSeason, HOUSE_ITEMS, houseItemById, HOUSE_LIMIT, HOUSE_MAX_ITEMS } from '../content/mundoItems.js';

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

let THREE = null;
let runId = 0;          // invalida bucles de animación de visitas anteriores
let outfitHook = null;  // función que reaplica el atuendo al pug vivo
let bonesCollected = 0;   // huesitos recogidos en esta visita
let missionBones = 0;     // huesitos de la misión de huesitos activa
let avatarOpen = false;
let buildOpen = false;     // panel de construcción de Mi Casa abierto
let buildType = 'b_madera'; // ítem seleccionado para construir
let buildHooks = null;     // {place, remove}: acciones de construcción de la zona viva
let guideSay = null;      // función que cambia el texto de Carboncito

let soundOn = true;           // música y efectos del mundo (se recuerda en este dispositivo)
try{ soundOn = localStorage.getItem('leo_mundo_music') !== '0'; }catch(e){}
function sfx(kind){
  if(!soundOn) return;
  switch(kind){
    case 'jump':   playBeep(330,0.07,0,0.16,'square'); playBeep(523,0.1,0.05,0.14,'square'); break;
    case 'coin':   playBeep(880,0.08,0,0.16); playBeep(1175,0.12,0.06,0.16); break;
    case 'portal': sfxStreak(); break;
    case 'done':   sfxLevelup(); break;
    case 'buy':    sfxCorrect(); break;
    case 'place':  playBeep(196,0.09,0,0.2,'square'); break;
    case 'remove': playBeep(150,0.1,0,0.18,'square'); break;
    case 'talk':   playBeep(620,0.06,0,0.14); break;
    case 'emote':  playBeep(660,0.08,0,0.14); playBeep(880,0.1,0.07,0.14); break;
  }
}
/* ---------- Accesibilidad: texto grande y lectura en voz alta (pensado para quien aún no lee) ---------- */
let prefs = { big:false, voice:false, contrast:false };
try{ const p = JSON.parse(localStorage.getItem('leo_mundo_prefs') || '{}'); prefs.big = p.big === true; prefs.voice = p.voice === true; prefs.contrast = p.contrast === true; }catch(e){}
function savePrefs(){ try{ localStorage.setItem('leo_mundo_prefs', JSON.stringify(prefs)); }catch(e){} }
function plainText(html){
  return String(html).replace(/<[^>]+>/g,' ').replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\u2B50\uFE0F\u200D]/gu,' ').replace(/✕/g,' ').replace(/\s+/g,' ').trim();
}
function say(text, lang){ const t = plainText(text); if(t) speak(t, lang || 'es', 0.92); }
let lastSpoken = '';
function maybeSpeakGuide(text){
  if(!prefs.voice) return;
  const key = text.replace(/\(\d+\/\d+\)/g,'').trim();   // los avances (2/5) no se vuelven a leer
  if(key === lastSpoken) return;
  lastSpoken = key; say(text);
}
function applyPrefsToWrap(){
  const wrap = document.getElementById('mundo-wrap');
  if(wrap){ wrap.classList.toggle('mundo-big', prefs.big); wrap.classList.toggle('mundo-contrast', prefs.contrast); }
}
function settingsHTML(){
  function row(key, label, on){ return '<button class="set-row'+(on?' on':'')+'" onclick="mundoSetPref(\''+key+'\')"><span>'+label+'</span><b>'+(on?'Sí':'No')+'</b></button>'; }
  return '<b>Ajustes</b>'+row('sound','🔊 Música y sonidos',soundOn)+row('big','🔠 Texto grande',prefs.big)+row('contrast','◐ Alto contraste',prefs.contrast)+row('voice','🗣️ Leer en voz alta',prefs.voice)+
    '<button class="set-row" onclick="showProfilePicker()"><span>👥 Cambiar de jugador</span><b>→</b></button>'+
    '<small>Con "Leer en voz alta", Carboncito y los personajes te leen lo que dicen.</small>';
}
function closePopovers(){
  const a = document.getElementById('mundo-emotes'), b = document.getElementById('mundo-settings');
  if(a) a.classList.add('hidden'); if(b) b.classList.add('hidden');
}
export function mundoToggleSettings(){
  const el = document.getElementById('mundo-settings');
  if(!el) return;
  const em = document.getElementById('mundo-emotes'); if(em) em.classList.add('hidden');
  if(el.classList.contains('hidden')){ el.innerHTML = settingsHTML(); el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}
export function mundoSetPref(key){
  if(key === 'sound') mundoToggleSound();
  else if(key === 'big'){ prefs.big = !prefs.big; savePrefs(); applyPrefsToWrap(); }
  else if(key === 'contrast'){ prefs.contrast = !prefs.contrast; savePrefs(); applyPrefsToWrap(); }
  else if(key === 'voice'){ prefs.voice = !prefs.voice; savePrefs(); lastSpoken = ''; if(prefs.voice && guideSay) guideSay(null); }
  const el = document.getElementById('mundo-settings');
  if(el && !el.classList.contains('hidden')) el.innerHTML = settingsHTML();
}
export function mundoSpeakGuide(){ const g = document.getElementById('mundo-guide-text'); if(g) say(g.textContent); }
export function mundoSpeakDialog(){ const d = dialogEl(); if(d) say(d.textContent); }
export function mundoQuizSpeak(){
  if(!quiz || !quiz.cur) return;
  const r = quiz.cur;
  say(r.speakText || r.promptHTML, r.speakLang);
}

let guideTimer = null, lastShown = '';
export function mundoToggleGuide(e){
  if(e && e.target && e.target.closest && e.target.closest('.guide-speak')) return;
  const g = document.getElementById('mundo-guide'); if(!g) return;
  clearTimeout(guideTimer);
  g.classList.toggle('collapsed');
}

export function mundoToggleSound(){
  soundOn = !soundOn;
  try{ localStorage.setItem('leo_mundo_music', soundOn ? '1' : '0'); }catch(e){}
}
const MUSIC_SCALES = {
  pueblo:[262,294,330,392,440,523], bosque:[220,247,294,330,370,440], playa:[330,392,440,494,587,659],
  volcan:[196,208,262,294,311,392], arrecife:[262,294,349,392,440,523],
  espacio:[196,233,262,311,392,466], obby:[392,440,494,587,659,784], casa:[262,330,392,440,523,659],
};

let visiting = null;           // casa de un hermano que se está visitando ({id,name,items}); solo lectura
let wantFull = false;           // el niño eligió pantalla completa (se mantiene al cambiar de mundo)
let currentZone = 'pueblo';  // zona actual (se reinicia al pueblo al salir del juego)
let arrivedFrom = null;      // de qué zona se viajó (para aparecer junto a su portal)
let travelling = false;      // true mientras se cambia de zona (evita reiniciar el pueblo)

export function renderMundoScreen(){
  return '<div class="screen mundo-screen">'+
    '<div class="mundo-wrap" id="mundo-wrap">'+
      '<div class="mundo-loading" id="mundo-loading">Cargando el mundo… 🐾</div>'+
      '<div class="mundo-hud">'+
        '<button class="mundo-back-btn" onclick="goBack()" aria-label="Volver">←</button>'+
        '<div class="pill coinpill"><span class="coin-ic"></span><span id="mundo-coins">'+state.coins+'</span></div>'+
        '<div class="pill" id="mundo-timer-pill" style="display:none">⏱ <span id="mundo-timer">0:00</span></div>'+
        '<div class="pill" id="mundo-collect-pill"><span id="mundo-collect-icon">🦴</span> <span id="mundo-bones">0</span></div>'+
        '<button class="mundo-shop-btn" id="mundo-build-btn" style="display:none" onclick="mundoToggleBuild()">🔨 Construir</button>'+
        '<button class="mundo-shop-btn alone" onclick="mundoToggleAvatar()">👤 Avatar</button>'+
        '<button class="mundo-shop-btn alone mundo-fs-btn" onclick="mundoToggleFull()" aria-label="Pantalla completa">⛶</button>'+
      '</div>'+
      '<div class="mundo-guide collapsed" id="mundo-guide" onclick="mundoToggleGuide(event)"><span class="guide-face">🐾</span><span><b id="mundo-zone"></b><br><span id="mundo-guide-text"></span></span><button class="guide-speak" onclick="mundoSpeakGuide()" aria-label="Escuchar">🔊</button></div>'+
      '<div class="mundo-joy" id="mundo-joy"><div class="mundo-knob" id="mundo-knob"></div></div>'+
      '<button class="mundo-jump" id="mundo-jump" aria-label="Saltar">⤒<small>Saltar</small></button>'+
      '<button class="mundo-emote-btn" id="mundo-emote-btn" onclick="mundoToggleEmotes()" aria-label="Gestos">😀</button>'+
      '<button class="mundo-sound-btn" id="mundo-sound-btn" onclick="mundoToggleSettings()" aria-label="Ajustes">⚙️</button>'+
      '<div class="mundo-settings hidden" id="mundo-settings"></div>'+
      '<div class="mundo-emotes hidden" id="mundo-emotes">'+
        '<button onclick="mundoEmote(\'wave\')">👋<small>Saludar</small></button>'+
        '<button onclick="mundoEmote(\'dance\')">💃<small>Bailar</small></button>'+
        '<button onclick="mundoEmote(\'cheer\')">🙌<small>Celebrar</small></button>'+
        '<button onclick="mundoEmote(\'spin\')">🌀<small>Girar</small></button>'+
      '</div>'+
      '<button class="mundo-talk hidden" id="mundo-talk" onclick="mundoTalk()">💬 Hablar</button>'+
      '<div class="mundo-dialog hidden" id="mundo-dialog"></div>'+
      '<div class="mundo-shop hidden" id="mundo-shop"></div>'+
      '<div class="mundo-avatar hidden" id="mundo-avatar"></div>'+
      '<div class="mundo-portal hidden" id="mundo-portal"></div>'+
      '<div class="mundo-build hidden" id="mundo-build"></div>'+
    '</div>'+
    '<p class="mundo-help">PC: WASD para moverte, espacio para saltar, arrastra el mouse (o Q/E) para girar la cámara y la rueda para acercar. Celular y tablet: joystick a la izquierda, arrastra a la derecha para girar la cámara, pellizca para acercar. Toca ⛶ para pantalla completa. ¡Estudia para ganar monedas y estrenar cosas nuevas!</p>'+
  '</div>';
}

/* ---------- Avatar: inventario + catálogo en un solo panel (como el editor de Roblox) ---------- */
let avatarTab = 'cuerpo';

function itemCard(it){
  const owned = state.world.owned.indexOf(it.id) !== -1;
  const equipped = state.world.equipped[it.slot] === it.id;
  const prev = it.icon
    ? '<span class="shop-icon">'+it.icon+'</span>'
    : '<span class="shop-swatch" style="background:'+cssOf(it)+'">'+(it.pattern ? '<i class="pat-'+it.pattern+'"></i>' : '')+'</span>';
  const status = equipped ? '<small class="shop-on">Puesto ✔</small>'
    : owned ? '<small>Tuyo · Ponerme</small>'
    : '<small class="shop-price"><span class="coin-ic"></span> '+it.price+'</small>';
  return '<button class="shop-card'+(equipped?' equipped':'')+'" onclick="mundoItemClick(\''+it.id+'\')">'+prev+'<b>'+it.label+(it.season ? ' '+SEASONS[it.season].icon : '')+'</b>'+status+'</button>';
}
function visibleItem(it){ return !it.season || it.season === activeSeason() || state.world.owned.indexOf(it.id) !== -1; }

function avatarHTML(){
  const av = state.world.avatar;
  function sw(field, i, hex){
    return '<button class="av-sw'+(av[field]===i?' on':'')+'" style="background:'+hexCss(hex)+'" onclick="mundoAvatarSet(\''+field+'\','+i+')" aria-label="Opción '+(i+1)+'"></button>';
  }
  const tabs = [{ id:'cuerpo', label:'Cuerpo', icon:'🙂' }, { id:'looks', label:'Mis looks', icon:'⭐' }].concat(AVATAR_SLOTS).map(function(t){
    return '<button class="av-tab'+(avatarTab===t.id?' on':'')+'" onclick="mundoAvatarTab(\''+t.id+'\')"><span>'+t.icon+'</span><small>'+t.label+'</small></button>';
  }).join('');
  let body;
  if(avatarTab === 'cuerpo'){
    body = '<p class="shop-sec">Piel</p><div class="av-row">'+AVATAR_TONES.map(function(h,i){ return sw('tone',i,h); }).join('')+'</div>'+
      '<p class="shop-sec">Peinado</p><div class="av-row">'+AVATAR_HAIRS.map(function(h){
        return '<button class="av-chip'+(av.hair===h.id?' on':'')+'" onclick="mundoAvatarSet(\'hair\',\''+h.id+'\')">'+h.label+'</button>'; }).join('')+'</div>'+
      '<p class="shop-sec">Color de pelo</p><div class="av-row">'+AVATAR_HAIR_COLORS.map(function(h,i){ return sw('hairColor',i,h); }).join('')+'</div>';
  }else if(avatarTab === 'looks'){
    body = '<p class="shop-note">Guarda hasta 3 looks completos (como los outfits de Roblox) y cámbiate con un toque.</p><div class="look-list">'+
      [0,1,2].map(function(i){
        const L = state.world.looks[i];
        const sh = L && itemById(L.equipped.shirt), ht = L && L.equipped.hat && itemById(L.equipped.hat);
        return '<div class="look-card"><b>Look '+(i+1)+'</b>'+
          '<small>'+(L ? ('Polera '+(sh?sh.label:'')+(ht?' · '+ht.label:'')) : 'Vacío')+'</small>'+
          (L ? '<button class="av-chip on" onclick="mundoLookWear('+i+')">Ponerme</button>' : '')+
          '<button class="av-chip" onclick="mundoLookSave('+i+')">'+(L ? 'Guardar aquí mi look actual' : 'Guardar mi look actual')+'</button></div>';
      }).join('')+'</div>';
  }else{
    const slot = AVATAR_SLOTS.filter(function(x){ return x.id===avatarTab; })[0];
    const list = itemsBySlot(avatarTab).filter(visibleItem);
    const mine = list.filter(function(i){ return state.world.owned.indexOf(i.id) !== -1; }).length;
    const none = slot.optional
      ? '<button class="shop-card'+(state.world.equipped[avatarTab]===null?' equipped':'')+'" onclick="mundoItemClick(\'none_'+avatarTab+'\')"><span class="shop-icon">🚫</span><b>Ninguno</b><small>'+(state.world.equipped[avatarTab]===null?'Puesto ✔':'Quitar')+'</small></button>'
      : '';
    body = '<p class="shop-note">Tienes '+mine+' de '+list.length+'. Toca un ítem para comprarlo o ponértelo.</p><div class="shop-grid">'+none+list.map(itemCard).join('')+'</div>';
  }
  return '<div class="shop-head"><b>Avatar</b><span class="pill coinpill"><span class="coin-ic"></span>'+state.coins+'</span>'+
      '<button class="shop-close" onclick="mundoAvatarDone()" aria-label="Cerrar">✕</button></div>'+
    '<div class="av-tabs">'+tabs+'</div>'+
    '<div class="av-body">'+body+'</div>'+
    '<button class="av-done" onclick="mundoAvatarDone()">¡Listo!</button>';
}
function renderAvatarPanel(){
  const el = document.getElementById('mundo-avatar');
  if(!el || !avatarOpen) return;
  const body = el.querySelector('.av-body'); const sc = body ? body.scrollTop : 0;
  const tabs = el.querySelector('.av-tabs'); const tl = tabs ? tabs.scrollLeft : 0;
  el.innerHTML = avatarHTML();
  const b2 = el.querySelector('.av-body'); if(b2) b2.scrollTop = sc;
  const t2 = el.querySelector('.av-tabs'); if(t2) t2.scrollLeft = tl;
}
function refreshShop(){
  const c = document.getElementById('mundo-coins');
  if(c) c.textContent = state.coins;
  const top = document.querySelector('.topbar .coinpill');
  if(top) top.innerHTML = '<span class="coin-ic"></span>' + state.coins;
  renderAvatarPanel();
}
function closeAvatar(){
  const el = document.getElementById('mundo-avatar');
  if(el) el.classList.add('hidden');
  const wrap = document.getElementById('mundo-wrap');
  if(wrap) wrap.classList.remove('avatar-open');
  avatarOpen = false;
}
export function mundoToggleAvatar(){
  const el = document.getElementById('mundo-avatar');
  if(!el) return;
  if(avatarOpen){ closeAvatar(); return; }
  closeBuild();
  avatarOpen = true;
  el.innerHTML = avatarHTML(); el.classList.remove('hidden');
  const wrap = document.getElementById('mundo-wrap'); if(wrap) wrap.classList.add('avatar-open');
}
function setFull(on){
  const wrap = document.getElementById('mundo-wrap');
  if(!wrap) return;
  wrap.classList.toggle('mundo-full', on);
  document.body.classList.toggle('mundo-fs', on);
}
export function mundoToggleFull(){
  const wrap = document.getElementById('mundo-wrap');
  if(!wrap) return;
  const on = !wrap.classList.contains('mundo-full');
  wantFull = on;
  setFull(on);
  try{
    if(on && wrap.requestFullscreen && !document.fullscreenElement) wrap.requestFullscreen().catch(function(){});
    else if(!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function(){});
  }catch(e){ /* sin Fullscreen API (p. ej. iPhone): queda el modo de pantalla ocupada por CSS */ }
}
export const mundoToggleShop = mundoToggleAvatar;   // compat: la tienda ahora vive en el panel de avatar
export function mundoLookSave(i){
  const w = state.world, av = w.avatar;
  w.looks[i] = { tone:av.tone, hair:av.hair, hairColor:av.hairColor, equipped:Object.assign({}, w.equipped) };
  saveProgress(); showToast('¡Look '+(i+1)+' guardado!'); renderAvatarPanel();
}
export function mundoLookWear(i){
  const w = state.world, L = w.looks[i];
  if(!L) return;
  w.avatar.tone = L.tone; w.avatar.hair = L.hair; w.avatar.hairColor = L.hairColor;
  Object.keys(w.equipped).forEach(function(slot){
    const id = L.equipped[slot];
    if(id === null && slot !== 'shirt' && slot !== 'pants' && slot !== 'shoes') w.equipped[slot] = null;
    else if(typeof id === 'string' && w.owned.indexOf(id) !== -1) w.equipped[slot] = id;
  });
  saveProgress(); if(outfitHook) outfitHook(); renderAvatarPanel();
}
export function mundoAvatarTab(tab){ avatarTab = tab; renderAvatarPanel(); }
export function mundoAvatarSet(field, val){
  state.world.avatar[field] = val;
  saveProgress();
  if(outfitHook) outfitHook();
  renderAvatarPanel();
}
export function mundoAvatarDone(){
  state.world.avatar.created = true;
  saveProgress();
  closeAvatar();
  if(guideSay) guideSay(null);
}
export function mundoItemClick(id){
  const w = state.world;
  if(id.indexOf('none_') === 0){
    w.equipped[id.slice(5)] = null;
  }else{
    const it = itemById(id);
    if(!it) return;
    if(w.owned.indexOf(id) === -1){
      if(!spendCoins(it.price)){
        showToast('Te faltan '+(it.price-state.coins)+' monedas. ¡Estudia para ganar más!');
        return;
      }
      w.owned.push(id);
      showToast('¡Compraste '+it.label+'!'); sfx('buy');
    }
    const slot = AVATAR_SLOTS.filter(function(x){ return x.id===it.slot; })[0];
    if(w.equipped[it.slot] === id && slot.optional) w.equipped[it.slot] = null;
    else w.equipped[it.slot] = id;
  }
  saveProgress();
  if(outfitHook) outfitHook();
  refreshShop();
}

/* ---------- Carboncito en bloques ---------- */
function buildPug(){
  const T = THREE;
  const root = new T.Group();
  const bodyMat = new T.MeshLambertMaterial({ color:0x1a1a1f });
  const snoutMat = new T.MeshLambertMaterial({ color:0x6a5a55 });
  const earMat = new T.MeshLambertMaterial({ color:0x0d0d10 });
  const white = new T.MeshLambertMaterial({ color:0xffffff });
  const black = new T.MeshLambertMaterial({ color:0x050505 });

  function box(w,h,d,mat,x,y,z,parent){
    const m = new T.Mesh(new T.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z); (parent||root).add(m); return m;
  }
  function ball(r,mat,x,y,z,parent){
    const m = new T.Mesh(new T.SphereGeometry(r,12,10), mat);
    m.position.set(x,y,z); (parent||root).add(m); return m;
  }

  const body = new T.Group(); root.add(body);
  box(1.0,0.75,1.5,bodyMat,0,0.85,0,body);
  box(0.95,0.85,0.85,bodyMat,0,1.35,0.85,body);          // cabeza
  box(0.55,0.38,0.32,snoutMat,0,1.18,1.4,body);          // hocico
  ball(0.1,black,0,1.27,1.58,body);                      // nariz
  [-1,1].forEach(function(s){
    ball(0.13,white,s*0.25,1.5,1.28,body);
    ball(0.07,black,s*0.25,1.5,1.38,body);
    const ear = box(0.3,0.4,0.12,earMat,s*0.46,1.7,0.85,body);
    ear.rotation.z = -s*0.35;
  });
  const tail = box(0.18,0.18,0.35,bodyMat,0,1.15,-0.85,body);
  tail.rotation.x = -0.6;

  const legs = [];
  [[-0.32,0.5],[0.32,0.5],[-0.32,-0.5],[0.32,-0.5]].forEach(function(p){
    const pivot = new T.Group();
    pivot.position.set(p[0],0.5,p[1]);
    box(0.26,0.5,0.26,bodyMat,0,-0.25,0,pivot);
    body.add(pivot); legs.push(pivot);
  });

  // sombra redonda en el piso
  const shadow = new T.Mesh(new T.CircleGeometry(0.95,20), new T.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.25 }));
  shadow.rotation.x = -Math.PI/2; shadow.position.y = 0.02;
  root.add(shadow);

  return { root:root, body:body, legs:legs, tail:tail };
}

/* ---------- Cofre diario ---------- */
function canClaimChest(){ return state.world.daily.last !== todayStr(); }
function openChest(){
  const w = state.world, d = w.daily, today = todayStr();
  if(d.last === today){
    showDialog('Cofre diario 🎁', '<p>Ya abriste el cofre de hoy. ¡Vuelve mañana por más monedas!</p><p>Tu racha: <b>'+d.streak+' '+(d.streak===1?'día':'días')+'</b> 🔥</p>', []);
    return;
  }
  d.streak = (d.last === yesterdayStr()) ? d.streak + 1 : 1;
  const base = 10, streakBonus = 5*Math.min(d.streak-1, 6), studyBonus = (w.studyDay === today) ? 10 : 0;
  const total = base + streakBonus + studyBonus;
  d.last = today;
  awardCoins(total); saveProgress(); refreshShop(); sfx('done');
  showDialog('¡Cofre abierto! 🎉',
    '<p>Ganaste <b>'+total+' monedas</b>:</p><p>• Regalo del día: '+base+'<br>'+
    (streakBonus ? '• Racha de '+d.streak+' días: +'+streakBonus+'<br>' : '')+
    (studyBonus ? '• ¡Hoy estudiaste en LEO!: +'+studyBonus : '• Tip: estudia un juego de LEO antes de abrirlo y ganas +10 extra')+'</p>'+
    '<p>Racha: <b>'+d.streak+' '+(d.streak===1?'día':'días')+'</b> 🔥 (¡vuelve mañana!)</p>', []);
}
function addSeasonDecor(scene, season, segs){
  if(!season) return;
  segs = segs || [];
  const T = THREE, rnd = mulberry32(5);
  if(season === 'halloween'){
    for(let i=0;i<16;i++){
      const a = rnd()*Math.PI*2, d = 9 + rnd()*24, x = Math.cos(a)*d, z = Math.sin(a)*d;
      if(Math.hypot(x,z+16) < 4 || Math.hypot(x-16,z) < 4 || Math.hypot(x+16,z) < 4 || segs.some(function(sg){ return distToSeg(x,z,sg) < sg[4]/2+1; })) continue;
      const g = new T.Group(), s = 0.7 + rnd()*0.6;
      const b = new T.Mesh(new T.SphereGeometry(0.6*s,10,8), mat(0xff8a1f)); b.scale.y = 0.8; b.position.y = 0.5*s; g.add(b);
      const st = new T.Mesh(new T.BoxGeometry(0.12*s,0.25*s,0.12*s), mat(0x2f9e44)); st.position.y = 1.0*s; g.add(st);
      g.position.set(x,0,z); scene.add(g);
    }
  }else if(season === 'navidad'){
    const g = new T.Group();
    const tr = new T.Mesh(new T.CylinderGeometry(0.3,0.4,1,8), mat(0x6b4423)); tr.position.y = 0.5; g.add(tr);
    [[1.7,2.6,1.2],[1.3,2.0,2.4],[0.9,1.6,3.5]].forEach(function(c){ const m = new T.Mesh(new T.ConeGeometry(c[0],c[1],10), mat(0x1f8a3f)); m.position.y = c[2]; g.add(m); });
    const cols = [0xff4d4d,0xffd43b,0x4dabf7,0xf783ac];
    for(let i=0;i<12;i++){ const a = i*2.4, h = 1.2 + (i%4)*0.7, r = 1.4 - (i%4)*0.3; const b = new T.Mesh(new T.SphereGeometry(0.13,6,6), new T.MeshBasicMaterial({ color:cols[i%4] })); b.position.set(Math.cos(a)*r, h, Math.sin(a)*r); g.add(b); }
    const star = new T.Mesh(new T.OctahedronGeometry(0.3), new T.MeshBasicMaterial({ color:0xffe066 })); star.position.y = 4.5; g.add(star);
    [[1.8,1.2,0xe0334c],[-1.6,1.5,0x3b82f6],[0.6,2.2,0x2fb344]].forEach(function(gf){ const bx = new T.Mesh(new T.BoxGeometry(0.6,0.5,0.6), mat(gf[2])); bx.position.set(gf[0],0.25,gf[1]); g.add(bx); });
    g.position.set(-6.5,0,-9.5); scene.add(g);
  }else if(season === 'patrias'){
    for(let k=0;k<8;k++){
      const a = k/8*Math.PI*2 + 0.2, x = Math.cos(a)*12, z = Math.sin(a)*12;
      if(Math.hypot(x,z+16) < 4 || Math.hypot(x-16,z) < 4 || Math.hypot(x+16,z) < 4) continue;
      const pole = new T.Mesh(new T.CylinderGeometry(0.06,0.06,3.4,6), mat(0xeeeeee)); pole.position.set(x,1.7,z); scene.add(pole);
      const bl = new T.Mesh(new T.PlaneGeometry(0.6,0.5), new T.MeshBasicMaterial({ color:0x1e3a8a, side:T.DoubleSide })); bl.position.set(x+0.3,3.1,z); scene.add(bl);
      const wh = new T.Mesh(new T.PlaneGeometry(1.0,0.5), new T.MeshBasicMaterial({ color:0xffffff, side:T.DoubleSide })); wh.position.set(x+1.1,3.1,z); scene.add(wh);
      const rd = new T.Mesh(new T.PlaneGeometry(1.6,0.5), new T.MeshBasicMaterial({ color:0xc0392b, side:T.DoubleSide })); rd.position.set(x+0.8,2.6,z); scene.add(rd);
    }
  }
}
function seasonHello(){
  const s = activeSeason();
  if(!s) return '';
  return ' '+SEASONS[s].icon+' ¡'+SEASONS[s].label+'! Hay ropa de temporada en tu avatar mientras dure.';
}

function buildChest(scene, x, z){
  const T = THREE, g = new T.Group();
  const wood = new T.MeshLambertMaterial({ color:0x8a5a2b }), gold = new T.MeshLambertMaterial({ color:0xf2c230 });
  const base = new T.Mesh(new T.BoxGeometry(1.5,0.8,1.0), wood); base.position.y = 0.4; g.add(base);
  const lid = new T.Mesh(new T.BoxGeometry(1.5,0.4,1.0), wood); lid.position.y = 1.0; g.add(lid);
  [-0.5,0.5].forEach(function(bx){ const band = new T.Mesh(new T.BoxGeometry(0.14,1.25,1.06), gold); band.position.set(bx,0.62,0); g.add(band); });
  const lock = new T.Mesh(new T.BoxGeometry(0.22,0.28,0.1), gold); lock.position.set(0,0.8,0.53); g.add(lock);
  const star = new T.Mesh(new T.OctahedronGeometry(0.28), new T.MeshBasicMaterial({ color:0xffe066 })); star.position.y = 2.0; g.add(star);
  const lab = makeLabel('Cofre diario', 'rgba(150,100,10,.85)'); lab.position.set(0,3.0,0); g.add(lab);
  g.position.set(x,0,z); g.rotation.y = Math.atan2(-x, 8-z); scene.add(g);
  return { x:x, z:z, group:g, star:star };
}

/* ---------- Tablero familiar ---------- */
function fmtTimeS(sec){ const m = Math.floor(sec/60), r = Math.floor(sec%60); return m+':'+(r<10?'0':'')+r; }
function openBoard(){
  const list = profileSummaries();
  if(list.length < 2){
    showDialog('Tablero familiar 📋', '<p>Aquí aparecen los logros de toda tu familia. Crea más jugadores para competir y visitar sus casas.</p>'+
      '<button class="av-done" onclick="mundoDialogAction(0)">👥 Crear otro jugador</button>', [function(){ mundoDialogClose(); window.showProfilePicker(); }]);
    return;
  }
  const medals = ['—','🥉','🥈','🥇'], acts = [];
  const rows = list.map(function(p, i){
    let visit = '';
    if(!p.active){ acts.push(function(){ mundoDialogClose(); travel('casa', { id:p.id, name:p.name, items:p.houseItems }); }); visit = '<button class="av-chip" onclick="mundoDialogAction('+(acts.length-1)+')">Visitar su casa 🏠</button>'; }
    return '<div class="board-row'+(p.active?' me':'')+'"><b>#'+(i+1)+' '+p.name.replace(/[<>&]/g,'')+(p.active?' (tú)':'')+'</b>'+
      '<span>⭐ '+p.stars+'</span><span>💰 '+p.coins+'</span><span>🏁 '+medals[p.medal]+(p.best ? ' '+fmtTimeS(p.best) : '')+'</span><span>🏆 '+p.bosses+'/2</span><span>🏠 '+p.blocks+'</span>'+visit+'</div>';
  }).join('');
  showDialog('Tablero familiar 📋', '<p>Estrellas ganadas estudiando, monedas, carrera de obstáculos, jefes vencidos y piezas en su casa.</p><div class="board-list">'+rows+'</div>', acts);
}
function buildBoard(scene, x, z){
  const T = THREE, g = new T.Group();
  const wood = new T.MeshLambertMaterial({ color:0x8a5a2b });
  [-0.9,0.9].forEach(function(px){ const po = new T.Mesh(new T.BoxGeometry(0.16,2.2,0.16), wood); po.position.set(px,1.1,0); g.add(po); });
  const bd = new T.Mesh(new T.BoxGeometry(2.2,1.3,0.12), new T.MeshLambertMaterial({ color:0xe9d6a8 })); bd.position.set(0,1.9,0); g.add(bd);
  [0.4,0.05,-0.3].forEach(function(py, k){ const ln = new T.Mesh(new T.BoxGeometry(1.6-k*0.3,0.08,0.05), new T.MeshLambertMaterial({ color:0x6b4423 })); ln.position.set(-0.1,1.9+py,0.08); g.add(ln); });
  const star = new T.Mesh(new T.OctahedronGeometry(0.22), new T.MeshBasicMaterial({ color:0xffe066 })); star.position.set(0.7,2.35,0.1); g.add(star);
  const lab = makeLabel('Tablero familiar', 'rgba(20,90,80,.85)'); lab.position.set(0,3.4,0); g.add(lab);
  g.position.set(x,0,z); g.rotation.y = Math.atan2(-x, 8-z); scene.add(g);
  return { x:x, z:z, group:g };
}

/* ---------- Personajes (NPC) y encargos ---------- */
const FULL = { hat:null, face:null, back:null, neck:null, shirt:'shirt_azul', pants:'pants_azul', shoes:'shoes_negro' };
function look(avatar, eq){ return { avatar:avatar, equipped:Object.assign({}, FULL, eq) }; }
const NPCS = {
  lucho: { name:'Profe Lucho', zone:'pueblo', x:-9.9, z:18.8, role:'quiz', receives:'estrella',
           look: look({ tone:2, hair:'corto', hairColor:0 }, { face:'face_lentes', neck:'neck_corbata', shirt:'shirt_blanca', pants:'pants_gris' }) },
  beto:  { name:'Beto el panadero', zone:'pueblo', x:9.9, z:18.8, gives:'pan',
           look: look({ tone:1, hair:'corto', hairColor:1 }, { hat:'hat_chef', face:'face_bigote', shirt:'shirt_blanca', shoes:'shoes_blanco' }) },
  pepa:  { name:'Pepa', zone:'playa', x:-9, z:7, receives:'pan', gives:'concha',
           look: look({ tone:2, hair:'coleta', hairColor:3 }, { hat:'hat_gorra', face:'face_sol', shirt:'shirt_rosado', pants:'pants_short', shoes:'shoes_blanco' }) },
  neo:   { name:'Neo el astronauta', zone:'espacio', x:9, z:6, gives:'estrella', receives:'linterna',
           look: look({ tone:3, hair:'corto', hairColor:0 }, { hat:'hat_casco', back:'back_jet', shirt:'shirt_blanca', pants:'pants_gris', shoes:'shoes_blanco' }) },
  nati:  { name:'Nati la cocinera', zone:'pueblo', x:18.6, z:8.2, gives:'receta', receives:'concha',
           look: look({ tone:0, hair:'largo', hairColor:3 }, { hat:'hat_chef', shirt:'shirt_rosado', pants:'pants_azul', shoes:'shoes_blanco' }) },
  cenizas: { name:'Cenizas el dragón', zone:'volcan', x:-12, z:-8, role:'boss', boss:'volcan', big:true, model:'pet_dragon' },
  tinta:   { name:'Pulpo Tinta', zone:'arrecife', x:10, z:-10, role:'boss', boss:'arrecife', big:true, model:'octopus' },
  mati:  { name:'Mati el guardabosques', zone:'bosque', x:-8, z:-4, gives:'linterna', receives:'receta',
           look: look({ tone:1, hair:'corto', hairColor:1 }, { hat:'hat_gorra', back:'back_mochila', shirt:'shirt_verde', pants:'pants_cafe' }) },
};
const BOSSES = {
  volcan:   { name:'Cenizas el dragón', reward:40, intro:'¡Soy Cenizas, guardián del volcán! 🌋 Respóndeme 5 acertijos de estudio: con 4 aciertos ganas mi tesoro.' },
  arrecife: { name:'Pulpo Tinta', reward:50, intro:'¡Soy Tinta, guardián del arrecife! 🐙 Respóndeme 5 acertijos de estudio: con 4 aciertos ganas mi tesoro.' },
};
const QUESTS = {
  pan:      { item:'un pan calentito 🥖', toName:'Pepa (en la Playa)', reward:20 },
  estrella: { item:'una piedra lunar ⭐', toName:'el Profe Lucho (en el Pueblo)', reward:25 },
  receta:   { item:'una receta secreta 📜', toName:'Mati el guardabosques (en el Bosque)', reward:20 },
  linterna: { item:'una linterna 🔦', toName:'Neo el astronauta (en la Luna)', reward:30 },
  concha:   { item:'una concha gigante 🐚', toName:'Nati la cocinera (en el Pueblo)', reward:20 },
};
function carryText(){
  const q = state.world.quests, out = [];
  Object.keys(QUESTS).forEach(function(k){ if(q[k] === 1) out.push('📦 Llevas '+QUESTS[k].item+' para '+QUESTS[k].toName+'.'); });
  return out.join(' ');
}

/* ---------- Diálogos y desafío de estudio ---------- */
let dialogActions = [];
let talkNpc = null;        // id del NPC más cercano (lo fija el bucle de cada zona)
let quiz = null;
let quizBoss = null;
let emoteReq = null;

function dialogEl(){ return document.getElementById('mundo-dialog'); }
export function mundoDialogClose(){
  const el = dialogEl(); if(el) el.classList.add('hidden');
  const wr = document.getElementById('mundo-wrap'); if(wr) wr.classList.remove('dialog-open');
  dialogActions = []; quiz = null;
}
function showDialog(title, html, actions){
  const el = dialogEl(); if(!el) return;
  dialogActions = actions || [];
  if(el.classList.contains('hidden')) sfx('talk');
  el.innerHTML = '<div class="dlg-head"><b>'+title+'</b><button class="dlg-speak" onclick="mundoSpeakDialog()" aria-label="Escuchar">🔊</button><button class="shop-close" onclick="mundoDialogClose()" aria-label="Cerrar">✕</button></div>'+html;
  el.classList.remove('hidden');
  const wr2 = document.getElementById('mundo-wrap'); if(wr2) wr2.classList.add('dialog-open');
  if(prefs.voice) say(el.textContent);
}
export function mundoDialogAction(i){ if(dialogActions[i]) dialogActions[i](); }

function npcLines(id){
  const n = NPCS[id], q = state.world.quests, lines = [], acts = [];
  if(n.gives){
    const Q = QUESTS[n.gives], st = q[n.gives];
    if(st === 0){
      lines.push('¡Hola! Necesito un favor: ¿puedes llevar '+Q.item+' a '+Q.toName+'? Te daré '+Q.reward+' monedas.');
      acts.push({ label:'¡Claro, yo lo llevo! 📦', fn:function(){ q[n.gives] = 1; saveProgress(); showToast('📦 Ahora llevas '+Q.item); mundoDialogClose(); if(guideSay) guideSay(null); } });
    }else if(st === 1) lines.push('Recuerda: llévale '+Q.item+' a '+Q.toName+'.');
    else lines.push('¡Gracias por tu ayuda! 😊');
  }
  if(n.receives){
    const Q = QUESTS[n.receives], st = q[n.receives];
    if(st === 1){
      lines.push('¡Justo lo que esperaba! Gracias por traerme '+Q.item+'.');
      acts.push({ label:'Entregar 🎁', fn:function(){
        q[n.receives] = 2; awardCoins(Q.reward); saveProgress(); refreshShop();
        sfx('done'); showToast('¡Encargo cumplido! +'+Q.reward+' monedas'); mundoDialogClose(); if(guideSay) guideSay(null);
      } });
    }else if(st === 2) lines.push('¡Mil gracias por el encargo! 😊');
  }
  if(n.role === 'boss'){
    const B = BOSSES[n.boss], won = state.world.bosses[n.boss];
    lines.push(won ? '¡Ya me ganaste y tienes mi tesoro! 🏆 Pero puedes retarme otra vez por diversión.' : B.intro);
    acts.push({ label:won ? 'Retar otra vez ⚔️' : '¡Acepto el reto! ⚔️', fn:function(){ quizSetup(n.boss); } });
  }
  if(n.role === 'quiz'){
    lines.push('¿Listo para un desafío de estudio? Ganas 2 monedas por cada respuesta correcta.');
    acts.push({ label:'Desafío de estudio 📚', fn:function(){ quizSetup(); } });
  }
  if(!lines.length) lines.push('¡Hola! ¡Qué lindo día! 😊');
  return { lines:lines, acts:acts };
}
export function mundoTalk(){
  if(!talkNpc) return;
  if(talkNpc === 'chest'){ openChest(); return; }
  if(talkNpc === 'board'){ openBoard(); return; }
  const n = NPCS[talkNpc], d = npcLines(talkNpc);
  showDialog(n.name, '<p>'+d.lines.join('</p><p>')+'</p>'+d.acts.map(function(a,i){
    return '<button class="av-done" onclick="mundoDialogAction('+i+')">'+a.label+'</button>'; }).join(''),
    d.acts.map(function(a){ return a.fn; }));
}

function quizPool(g){
  let mods = [];
  if(g === 'nt'){
    NUCLEO_DEFS.forEach(function(d){ const e = d.byNivel && d.byNivel.nt; if(e && e.modules) mods = mods.concat(e.modules); });
  }else{
    const a = LENGUAJE_BY_GRADE[g], b = MATE_BY_GRADE[g];
    if(a) mods = mods.concat(a.modules); if(b) mods = mods.concat(b.modules);
  }
  return mods.map(function(m){ return m.key || m.id; })
    .filter(function(k){ return k && k.indexOf('examen') !== 0 && MC_GAMES[k]; });
}
function quizSetup(bossId){
  quizBoss = bossId || null;
  const cur = state.currentGrade;
  const opts = ['nt',1,2,3,4,5,6,7,8].map(function(g){
    return '<button class="av-chip'+(g===cur?' on':'')+'" onclick="mundoQuizStart('+(g==='nt'?"'nt'":g)+')">'+(g==='nt'?'Kínder':g+'°')+'</button>';
  }).join('');
  showDialog(quizBoss ? BOSSES[quizBoss].name+' te reta' : 'Desafío de estudio', '<p>'+(quizBoss ? 'Respóndeme 5 acertijos: con 4 aciertos ganas mi tesoro. ' : '5 preguntas de Lenguaje y Matemática. ')+'¿De qué curso?</p><div class="av-row">'+opts+'</div>', []);
}
export function mundoQuizStart(g){
  const pool = quizPool(g);
  if(!pool.length){ showToast('No hay preguntas para ese curso todavía.'); return; }
  quiz = { g:g, pool:pool, i:0, right:0, cur:null, answered:false, boss:quizBoss };
  quizNext();
}
function quizNext(){
  if(quiz.i >= 5){
    if(quiz.boss){
      const B = BOSSES[quiz.boss], win = quiz.right >= 4, first = win && !state.world.bosses[quiz.boss];
      if(first){ state.world.bosses[quiz.boss] = true; awardCoins(B.reward); saveProgress(); refreshShop(); sfx('done'); }
      showDialog(win ? '¡Ganaste! 🏆' : '¡Casi!',
        '<p>Acertaste <b>'+quiz.right+' de 5</b>.</p><p>'+(win ? (first ? '¡'+B.name+' te entrega su tesoro: <b>+'+B.reward+' monedas</b>! 🎉' : '¡Otra victoria! 🎉') : 'Necesitas 4 aciertos. ¡Inténtalo otra vez, tú puedes!')+'</p>'+
        '<button class="av-done" onclick="mundoDialogAction(0)">Otra ronda</button><button class="av-chip" onclick="mundoDialogClose()">Salir</button>',
        [function(){ mundoQuizStart(quiz.g); }]);
      return;
    }
    const total = quiz.right*2;
    showDialog('¡Terminaste!', '<p>Acertaste <b>'+quiz.right+' de 5</b> y ganaste <b>'+total+' monedas</b> 🎉</p>'+
      '<button class="av-done" onclick="mundoDialogAction(0)">Otra ronda</button><button class="av-chip" onclick="mundoDialogClose()">Salir</button>',
      [function(){ mundoQuizStart(quiz.g); }]);
    return;
  }
  let r = null;
  for(let t=0; t<25 && !r; t++){
    const key = quiz.pool[Math.floor(Math.random()*quiz.pool.length)];
    try{
      const x = MC_GAMES[key].gen();
      if(x && x.options && x.options.length >= 2 && x.promptHTML) r = x;
    }catch(e){ /* probar otra */ }
  }
  if(!r){ showToast('No pudimos armar la pregunta. Intenta de nuevo.'); mundoDialogClose(); return; }
  quiz.cur = r; quiz.answered = false; quiz.i++;
  const el = dialogEl();
  showDialog('Pregunta '+quiz.i+' de 5',
    (quiz.boss ? '<p class="boss-hp">'+BOSSES[quiz.boss].name+': '+'❤️'.repeat(5-quiz.right)+'🖤'.repeat(quiz.right)+'</p>' : '')+
    '<div class="quiz-prompt">'+r.promptHTML+' <button class="dlg-speak" onclick="mundoQuizSpeak()" aria-label="Escuchar la pregunta">🔊</button></div><div class="quiz-opts">'+
    r.options.map(function(o,idx){ return '<button class="quiz-opt" id="quiz-o'+idx+'" onclick="mundoQuizAnswer('+idx+')">'+o.label+'</button>'; }).join('')+
    '</div><div id="quiz-fb"></div>', []);
  if(el) el.scrollTop = 0;
  if(prefs.voice) mundoQuizSpeak();
}
export function mundoQuizAnswer(idx){
  if(!quiz || quiz.answered) return;
  quiz.answered = true;
  const r = quiz.cur, ok = r.options[idx].value === r.correctValue;
  const good = r.options.findIndex(function(o){ return o.value === r.correctValue; });
  if(soundOn){ if(ok) sfxCorrect(); else sfxWrong(); }
  const bAns = document.getElementById('quiz-o'+idx), bGood = document.getElementById('quiz-o'+good);
  if(bGood) bGood.classList.add('right');
  if(!ok && bAns) bAns.classList.add('wrong');
  let fb;
  if(ok){ quiz.right++; if(quiz.boss){ fb = '<p class="quiz-ok">¡Golpe certero! 💥</p>'; }else{ awardCoins(2); refreshShop(); fb = '<p class="quiz-ok">¡Correcto! +2 monedas 💰</p>'; } }
  else fb = '<p class="quiz-bad">Casi. La correcta está en verde.</p>'+(r.explain ? '<p class="quiz-exp">'+r.explain+'</p>' : '');
  const box = document.getElementById('quiz-fb');
  if(box) box.innerHTML = fb + '<button class="av-done" onclick="mundoQuizNext()">'+(quiz.i>=5?'Ver resultado':'Siguiente')+'</button>';
}
export function mundoQuizNext(){ if(quiz) quizNext(); }

/* ---------- Gestos ---------- */
export function mundoToggleEmotes(){
  const el = document.getElementById('mundo-emotes');
  const st = document.getElementById('mundo-settings'); if(st) st.classList.add('hidden');
  if(el) el.classList.toggle('hidden');
}
export function mundoEmote(name){
  emoteReq = name; sfx('emote');
  const el = document.getElementById('mundo-emotes');
  if(el) el.classList.add('hidden');
}

/* ---------- Mi Casa: panel de construcción ---------- */
function buildHTML(){
  const h = state.world.house;
  const cur = houseItemById(buildType);
  function chip(it){
    const owned = h.owned.indexOf(it.id) !== -1;
    const prev = it.kind==='block'
      ? '<span class="shop-swatch" style="background:'+hexCss(it.color)+';width:30px;height:30px"></span>'
      : '<span class="shop-icon" style="font-size:26px;line-height:30px">'+it.icon+'</span>';
    const sub = owned ? '' : '<small class="shop-price"><span class="coin-ic"></span> '+it.price+'</small>';
    return '<button class="shop-card build-chip'+(buildType===it.id?' equipped':'')+'" onclick="mundoBuildPick(\''+it.id+'\')">'+prev+'<b>'+it.label+'</b>'+sub+'</button>';
  }
  return '<div class="build-actions">'+
      '<button class="av-done build-put" onclick="mundoBuildPlace()">➕ Poner '+(cur?cur.label:'')+'</button>'+
      '<button class="av-chip build-del" onclick="mundoBuildRemove()">➖ Quitar</button>'+
      '<button class="shop-close" onclick="mundoToggleBuild()" aria-label="Cerrar">✕</button>'+
    '</div>'+
    '<div class="build-row">'+HOUSE_ITEMS.map(chip).join('')+'</div>';
}
function closeBuild(){
  const el = document.getElementById('mundo-build');
  if(el) el.classList.add('hidden');
  const wrap = document.getElementById('mundo-wrap');
  if(wrap) wrap.classList.remove('build-open');
  buildOpen = false;
}
function refreshBuild(){
  const el = document.getElementById('mundo-build');
  if(!el || !buildOpen) return;
  const row = el.querySelector('.build-row'); const sl = row ? row.scrollLeft : 0;
  el.innerHTML = buildHTML();
  const row2 = el.querySelector('.build-row'); if(row2) row2.scrollLeft = sl;
}
export function mundoToggleBuild(){
  const el = document.getElementById('mundo-build');
  if(!el) return;
  if(buildOpen){ closeBuild(); return; }
  const shop = document.getElementById('mundo-shop'); if(shop) shop.classList.add('hidden');
  closeAvatar();
  el.innerHTML = buildHTML(); el.classList.remove('hidden');
  const wrap = document.getElementById('mundo-wrap'); if(wrap) wrap.classList.add('build-open');
  buildOpen = true;
}
export function mundoBuildPick(id){
  const it = houseItemById(id), h = state.world.house;
  if(!it) return;
  if(h.owned.indexOf(id) === -1){
    if(!spendCoins(it.price)){
      showToast('Te faltan '+(it.price-state.coins)+' monedas. ¡Estudia para ganar más!');
      return;
    }
    h.owned.push(id); saveProgress();
    showToast('¡Desbloqueaste: '+it.label+'!'); sfx('buy');
    refreshShop();
  }
  buildType = id;
  refreshBuild();
}
export function mundoBuildPlace(){ if(buildHooks) buildHooks.place(); }
export function mundoBuildRemove(){ if(buildHooks) buildHooks.remove(); }

/* ---------- Persona (avatar de bloques) ---------- */
function buildPerson(lookOverride){
  const T = THREE;
  const root = new T.Group();
  const skinMat = new T.MeshLambertMaterial({ color:0xe8b98a });
  const hairMat = new T.MeshLambertMaterial({ color:0x6b4423 });
  const shirtMat = new T.MeshLambertMaterial({ color:0x3b82f6 });
  const black = new T.MeshLambertMaterial({ color:0x111111 });
  function M(c, o){ return new T.MeshLambertMaterial(Object.assign({ color:c }, o||{})); }

  function box(w,h,d,m,x,y,z,parent){
    const o = new T.Mesh(new T.BoxGeometry(w,h,d), m);
    o.position.set(x,y,z); (parent||root).add(o); return o;
  }
  function ball(r,m,x,y,z,parent){
    const o = new T.Mesh(new T.SphereGeometry(r,10,8), m);
    o.position.set(x,y,z); (parent||root).add(o); return o;
  }
  function cyl(rt,rb,h,m,x,y,z,parent,seg){
    const o = new T.Mesh(new T.CylinderGeometry(rt,rb,h,seg||12), m);
    o.position.set(x,y,z); (parent||root).add(o); return o;
  }
  function clear(g){ while(g.children.length) g.remove(g.children[0]); }

  const body = new T.Group(); root.add(body);
  box(0.95,0.9,0.5,shirtMat,0,1.25,0,body);   // torso
  box(0.7,0.7,0.7,skinMat,0,2.1,0,body);       // cabeza
  // cara dibujada (como el "decal" de Roblox): ojos con brillo y sonrisa
  (function(){
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#1a1a1a';
    [[40,52],[88,52]].forEach(function(e){ g.beginPath(); g.ellipse(e[0],e[1],9,14,0,0,Math.PI*2); g.fill(); });
    g.fillStyle = '#ffffff';
    [[43,46],[91,46]].forEach(function(e){ g.beginPath(); g.arc(e[0],e[1],3.5,0,Math.PI*2); g.fill(); });
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.arc(64,78,26,0.2*Math.PI,0.8*Math.PI); g.stroke();
    const tex = new T.CanvasTexture(c);
    const face = new T.Mesh(new T.PlaneGeometry(0.66,0.66), new T.MeshBasicMaterial({ map:tex, transparent:true }));
    face.position.set(0,2.1,0.352); body.add(face);
  })();

  const legs = [], arms = [];
  [-1,1].forEach(function(s){
    const leg = new T.Group(); leg.position.set(s*0.24,0.8,0); body.add(leg); legs.push(leg);
    const arm = new T.Group(); arm.position.set(s*0.7,1.68,0);
    box(0.44,0.42,0.44,shirtMat,0,-0.21,0,arm);   // manga (del color de la polera, como en Roblox)
    box(0.4,0.42,0.4,skinMat,0,-0.6,0,arm); body.add(arm); arms.push(arm);
  });

  const shadow = new T.Mesh(new T.CircleGeometry(0.8,20), new T.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.25 }));
  shadow.rotation.x = -Math.PI/2; shadow.position.y = 0.02; root.add(shadow);

  const hair = new T.Group(), deco = new T.Group(), gear = new T.Group();
  body.add(hair); body.add(deco); body.add(gear);

  /* Un modelo por ítem de accesorio: se arma dentro de `gear`. */
  const MODELS = {
    hat_gorra: function(g){
      box(0.8,0.24,0.8,M(0xe0334c),0,2.58,0,g); box(0.72,0.06,0.4,M(0xb02030),0,2.5,0.5,g);
    },
    hat_chef: function(g){
      cyl(0.34,0.34,0.5,M(0xffffff),0,2.8,0,g); ball(0.42,M(0xffffff),0,3.15,0,g);
    },
    hat_copa: function(g){
      const m = M(0x2b2b5a); cyl(0.3,0.36,0.65,m,0,3.0,0,g); cyl(0.55,0.55,0.07,m,0,2.68,0,g);
    },
    hat_casco: function(g){
      const dome = new T.Mesh(new T.SphereGeometry(0.5,14,8,0,Math.PI*2,0,Math.PI/2), M(0xf7c948));
      dome.position.y = 2.46; g.add(dome); box(0.1,0.05,0.9,M(0xe0334c),0,2.97,0,g);
    },
    hat_gato: function(g){
      const m = M(0x333333);
      [-1,1].forEach(function(s){ const c = new T.Mesh(new T.ConeGeometry(0.17,0.34,4), m); c.position.set(s*0.24,2.88,0); g.add(c); });
    },
    hat_conejo: function(g){
      [-1,1].forEach(function(s){ box(0.15,0.75,0.1,M(0xffffff),s*0.2,3.05,0,g); box(0.07,0.55,0.11,M(0xf9a8c4),s*0.2,3.05,0.01,g); });
    },
    hat_pirata: function(g){
      box(0.95,0.2,0.55,M(0x1a1a1a),0,2.65,0,g); box(0.5,0.28,0.4,M(0x1a1a1a),0,2.82,0,g); box(0.15,0.12,0.05,M(0xffffff),0,2.82,0.22,g);
    },
    hat_mago: function(g){
      const c = new T.Mesh(new T.ConeGeometry(0.42,1.0,12), M(0x6d3fbf)); c.position.y = 3.05; g.add(c);
      cyl(0.62,0.62,0.06,M(0x6d3fbf),0,2.56,0,g,16); box(0.2,0.2,0.05,M(0xffd43b),0,2.85,0.4,g);
    },
    hat_corona: function(g){
      const gold = M(0xf2c230); cyl(0.42,0.34,0.32,gold,0,2.8,0,g,8);
      [-0.28,0,0.28].forEach(function(x){ ball(0.07,M(0xe0334c),x,3.0,0,g); });
    },
    hat_aureola: function(g){
      const t = new T.Mesh(new T.TorusGeometry(0.36,0.05,8,20), new T.MeshBasicMaterial({ color:0xffe066 }));
      t.rotation.x = Math.PI/2; t.position.y = 3.05; g.add(t);
    },
    face_lentes: function(g){
      const l = M(0x222233); box(0.3,0.22,0.06,l,-0.19,2.19,0.38,g); box(0.3,0.22,0.06,l,0.19,2.19,0.38,g); box(0.1,0.05,0.06,l,0,2.21,0.38,g);
    },
    face_sol: function(g){
      const l = M(0x050505); box(0.33,0.24,0.07,l,-0.19,2.19,0.38,g); box(0.33,0.24,0.07,l,0.19,2.19,0.38,g); box(0.1,0.06,0.07,l,0,2.22,0.38,g);
    },
    face_antifaz: function(g){
      box(0.76,0.2,0.74,M(0x1a1a1a),0,2.2,0,g); [-1,1].forEach(function(s){ box(0.09,0.1,0.05,M(0xffffff),s*0.16,2.2,0.38,g); });
    },
    face_parche: function(g){
      box(0.26,0.24,0.06,M(0x111111),-0.17,2.18,0.38,g); const st = box(0.8,0.05,0.74,M(0x111111),0,2.3,0,g); st.rotation.z = 0.25;
    },
    face_bigote: function(g){
      const m = M(0x2a1a10); [-1,1].forEach(function(s){ const b = box(0.2,0.07,0.06,m,s*0.1,2.04,0.38,g); b.rotation.z = s*0.2; });
    },
    face_nariz: function(g){ ball(0.1,M(0xe0334c),0,2.06,0.42,g); },
    back_mochila: function(g){
      box(0.72,0.85,0.3,M(0x8a5a2b),0,1.3,-0.4,g); box(0.5,0.3,0.1,M(0x6b4423),0,1.1,-0.58,g);
    },
    back_capa: function(g){
      const c = box(0.95,1.2,0.06,M(0xe0334c),0,1.2,-0.32,g); c.rotation.x = 0.18;
    },
    back_alas: function(g){
      [-1,1].forEach(function(s){
        const w = box(0.08,1.05,0.65,M(0xffffff),s*0.5,1.55,-0.45,g); w.rotation.z = s*0.45;
        const w2 = box(0.08,0.7,0.5,M(0xe9f1ff),s*0.78,1.3,-0.5,g); w2.rotation.z = s*0.45;
      });
    },
    back_jet: function(g){
      [-1,1].forEach(function(s){ cyl(0.15,0.15,0.75,M(0x888c94),s*0.22,1.35,-0.42,g,10); const f = new T.Mesh(new T.ConeGeometry(0.12,0.35,8), new T.MeshBasicMaterial({ color:0xff8a1f })); f.rotation.x = Math.PI; f.position.set(s*0.22,0.85,-0.42); g.add(f); });
      box(0.7,0.12,0.12,M(0x555a62),0,1.55,-0.42,g);
    },
    neck_mono: function(g){
      const r = M(0xe0334c);
      const l = box(0.28,0.2,0.1,r,-0.17,1.62,0.28,g); l.rotation.z = 0.4;
      const rr = box(0.28,0.2,0.1,r,0.17,1.62,0.28,g); rr.rotation.z = -0.4;
      box(0.13,0.13,0.12,r,0,1.62,0.3,g);
    },
    neck_corbata: function(g){
      box(0.16,0.14,0.08,M(0x1e3a8a),0,1.66,0.27,g); const t = box(0.16,0.62,0.06,M(0x1e3a8a),0,1.32,0.27,g); t.rotation.z = 0.0;
    },
    neck_bufanda: function(g){
      box(1.0,0.2,0.62,M(0xe0334c),0,1.68,0,g); box(0.2,0.55,0.1,M(0xe0334c),0.3,1.36,0.3,g); box(0.2,0.08,0.11,M(0xffffff),0.3,1.2,0.3,g);
    },
    neck_medalla: function(g){
      const d = cyl(0.16,0.16,0.05,M(0xf2c230),0,1.42,0.28,g,16); d.rotation.x = Math.PI/2; box(0.06,0.3,0.04,M(0xe0334c),0,1.65,0.27,g);
    },
    hat_calabaza: function(g){
      const b = ball(0.5,M(0xff8a1f),0,2.7,0,g); b.scale.set(1,0.85,1);
      box(0.1,0.2,0.1,M(0x2f9e44),0,3.15,0,g);
      [-1,1].forEach(function(sx){ box(0.1,0.12,0.05,M(0x222222),sx*0.16,2.78,0.47,g); }); box(0.32,0.06,0.05,M(0x222222),0,2.6,0.49,g);
    },
    hat_bruja: function(g){
      cyl(0.64,0.64,0.06,M(0x1a1a1a),0,2.55,0,g,18);
      const c = new T.Mesh(new T.ConeGeometry(0.4,1.05,12), M(0x1a1a1a)); c.position.y = 3.1; g.add(c);
      cyl(0.41,0.43,0.12,M(0x7d3fbf),0,2.68,0,g); box(0.14,0.14,0.04,M(0xf7c948),0,2.68,0.43,g);
    },
    hat_navidad: function(g){
      const c = new T.Mesh(new T.ConeGeometry(0.42,0.95,12), M(0xd62d2d)); c.position.y = 3.0; g.add(c);
      cyl(0.45,0.45,0.15,M(0xffffff),0,2.55,0,g,16); ball(0.11,M(0xffffff),0,3.5,0,g);
    },
    hat_chupalla: function(g){
      const m = M(0xe8c878); cyl(0.78,0.78,0.05,m,0,2.55,0,g,18); cyl(0.32,0.35,0.3,m,0,2.72,0,g); cyl(0.355,0.355,0.07,M(0xc0392b),0,2.64,0,g);
    },
    face_vampiro: function(g){
      [-1,1].forEach(function(sx){ box(0.05,0.13,0.04,M(0xffffff),sx*0.07,1.93,0.38,g); });
    },
    back_murcielago: function(g){
      [-1,1].forEach(function(sx){
        const w = box(0.08,0.95,0.75,M(0x2a2233),sx*0.58,1.55,-0.42,g); w.rotation.z = sx*0.7;
        const w2 = box(0.08,0.55,0.5,M(0x3a3047),sx*0.95,1.2,-0.45,g); w2.rotation.z = sx*0.7;
      });
    },
    neck_panuelo: function(g){
      box(0.98,0.14,0.62,M(0xc0392b),0,1.66,0,g); const t = box(0.3,0.3,0.06,M(0xc0392b),0,1.5,0.31,g); t.rotation.z = Math.PI/4;
    },
    back_bandera: function(g){
      cyl(0.03,0.03,1.9,M(0xdddddd),0.4,1.75,-0.34,g,6);
      box(0.28,0.22,0.04,M(0x1e3a8a),0.56,2.57,-0.34,g); box(0.5,0.22,0.04,M(0xffffff),0.95,2.57,-0.34,g); box(0.78,0.22,0.04,M(0xc0392b),0.82,2.35,-0.34,g);
    },
    hat_flores: function(g){
      const cols = [0xff6b9d,0xffd43b,0xffffff,0xb18cff,0xff9f43,0x7ed957];
      cols.forEach(function(c,i){ const a = i/cols.length*Math.PI*2; ball(0.1,M(c),Math.cos(a)*0.42,2.58,Math.sin(a)*0.42,g); });
    },
    hat_lana: function(g){
      const d = new T.Mesh(new T.SphereGeometry(0.45,12,8,0,Math.PI*2,0,Math.PI/2), M(0x3b82f6)); d.position.y = 2.46; g.add(d);
      cyl(0.47,0.47,0.14,M(0xffffff),0,2.5,0,g,16); ball(0.1,M(0xffffff),0,2.95,0,g);
    },
    hat_vaquero: function(g){
      const m = M(0x8a5a2b); cyl(0.68,0.68,0.06,m,0,2.55,0,g,16); cyl(0.32,0.34,0.4,m,0,2.78,0,g); cyl(0.345,0.345,0.07,M(0x5a3a1a),0,2.66,0,g);
    },
    neck_flores: function(g){
      const cols = [0xff6b9d,0xffd43b,0xffffff,0xb18cff,0xff9f43];
      for(let i=0;i<9;i++){ const a = (i/8-0.5)*Math.PI*1.4; ball(0.09,M(cols[i%cols.length]),Math.sin(a)*0.5,1.62-Math.abs(a)*0.05,Math.cos(a)*0.3,g); }
    },
    back_guitarra: function(g){
      const gr = new T.Group(); gr.position.set(0,1.3,-0.38); gr.rotation.z = 0.5;
      box(0.5,0.62,0.14,M(0xb0652a),0,0,0,gr); box(0.1,0.7,0.09,M(0x4a2a12),0,0.62,0,gr); ball(0.1,M(0x1a1a1a),0,0,0.08,gr); g.add(gr);
    },
  };

  function applyOutfit(){
    const av = lookOverride ? lookOverride.avatar : state.world.avatar, eq = lookOverride ? lookOverride.equipped : state.world.equipped;
    skinMat.color.setHex(AVATAR_TONES[av.tone] != null ? AVATAR_TONES[av.tone] : AVATAR_TONES[1]);
    hairMat.color.setHex(AVATAR_HAIR_COLORS[av.hairColor] != null ? AVATAR_HAIR_COLORS[av.hairColor] : AVATAR_HAIR_COLORS[1]);

    // polera (+ estampado)
    const shirt = itemById(eq.shirt) || itemById('shirt_azul');
    shirtMat.color.setHex(shirt.hex);
    clear(deco);
    if(shirt.pattern === 'rayas'){
      [0.95,1.25,1.55].forEach(function(y){ box(0.97,0.1,0.52,M(0xffffff),0,y,0,deco); });
    }else if(shirt.pattern === 'estrella'){
      const st = new T.Mesh(new T.OctahedronGeometry(0.2), new T.MeshBasicMaterial({ color:0xffe066 })); st.position.set(0,1.3,0.27); st.scale.z = 0.3; deco.add(st);
    }else if(shirt.pattern === 'corazon'){
      const r = M(0xe0334c); const d = box(0.24,0.24,0.04,r,0,1.26,0.26,deco); d.rotation.z = Math.PI/4;
      ball(0.13,r,-0.09,1.37,0.26,deco); ball(0.13,r,0.09,1.37,0.26,deco);
    }

    // pantalones y zapatos
    const pants = itemById(eq.pants) || itemById('pants_azul');
    const shoes = itemById(eq.shoes) || itemById('shoes_negro');
    legs.forEach(function(leg){
      clear(leg);
      if(pants.short){
        box(0.46,0.32,0.46,M(pants.hex),0,-0.16,0,leg);
        box(0.4,0.3,0.4,skinMat,0,-0.47,0,leg);
      }else{
        box(0.46,0.62,0.46,M(pants.hex),0,-0.31,0,leg);
      }
      box(0.5,0.18,0.56,M(shoes.hex),0,-0.71,0.05,leg);
    });

    // pelo
    clear(hair);
    box(0.78,0.22,0.78,hairMat,0,2.5,0,hair);
    box(0.78,0.5,0.18,hairMat,0,2.28,-0.3,hair);
    if(av.hair==='largo'){
      box(0.78,0.95,0.18,hairMat,0,1.9,-0.32,hair);
      [-1,1].forEach(function(s){ box(0.1,0.55,0.5,hairMat,s*0.4,2.2,-0.05,hair); });
    }else if(av.hair==='coleta'){
      ball(0.2,hairMat,0,2.3,-0.48,hair); box(0.14,0.5,0.14,hairMat,0,2.0,-0.5,hair);
    }else if(av.hair==='rulos'){
      for(let i=0;i<7;i++){ const a2 = i/7*Math.PI*2; ball(0.2,hairMat,Math.cos(a2)*0.38,2.55,Math.sin(a2)*0.38,hair); }
      ball(0.24,hairMat,0,2.68,0,hair);
    }

    // accesorios (cabeza, cara, espalda, cuello)
    clear(gear);
    ['hat','face','back','neck'].forEach(function(slot){
      const id = eq[slot];
      if(id && MODELS[id]) MODELS[id](gear);
    });
  }
  applyOutfit();
  return { root:root, body:body, legs:legs, arms:arms, applyOutfit:applyOutfit };
}

/* ---------- Mascotas (te siguen, como en Roblox) ---------- */
function buildPetModel(id){
  const T = THREE, g = new T.Group();
  function b(w,h,d,c,x,y,z){ const m = new T.Mesh(new T.BoxGeometry(w,h,d), new T.MeshLambertMaterial({ color:c })); m.position.set(x,y,z); g.add(m); return m; }
  function ball(r,c,x,y,z,sx,sy,sz){ const m = new T.Mesh(new T.SphereGeometry(r,10,8), new T.MeshLambertMaterial({ color:c })); m.position.set(x,y,z); if(sx) m.scale.set(sx,sy,sz); g.add(m); return m; }
  function cone(r,h,c,x,y,z,rx){ const m = new T.Mesh(new T.ConeGeometry(r,h,8), new T.MeshLambertMaterial({ color:c })); m.position.set(x,y,z); if(rx) m.rotation.x = rx; g.add(m); return m; }
  const dark = 0x1a1a1a;
  if(id === 'pet_pollito'){
    ball(0.32,0xffd43b,0,0.36,0); ball(0.22,0xffd43b,0,0.74,0.1); cone(0.07,0.18,0xff8a1f,0,0.72,0.34,Math.PI/2);
    ball(0.04,dark,-0.09,0.8,0.28); ball(0.04,dark,0.09,0.8,0.28); b(0.1,0.06,0.14,0xff8a1f,-0.12,0.03,0.05); b(0.1,0.06,0.14,0xff8a1f,0.12,0.03,0.05);
  }else if(id === 'pet_conejo'){
    ball(0.3,0xffffff,0,0.34,0,1,1,1.2); ball(0.22,0xffffff,0,0.66,0.3); b(0.08,0.42,0.06,0xffffff,-0.1,1.04,0.26); b(0.08,0.42,0.06,0xffffff,0.1,1.04,0.26);
    ball(0.06,0xf9a8c4,0,0.62,0.5); ball(0.09,0xffffff,0,0.38,-0.38); ball(0.035,dark,-0.09,0.72,0.47); ball(0.035,dark,0.09,0.72,0.47);
  }else if(id === 'pet_gato'){
    b(0.4,0.34,0.66,0xe8892b,0,0.34,0); b(0.38,0.34,0.34,0xe8892b,0,0.62,0.38); cone(0.1,0.2,0xe8892b,-0.12,0.88,0.38); cone(0.1,0.2,0xe8892b,0.12,0.88,0.38);
    b(0.08,0.5,0.08,0xe8892b,0,0.55,-0.4).rotation.x = -0.4; ball(0.04,dark,-0.09,0.66,0.56); ball(0.04,dark,0.09,0.66,0.56); ball(0.04,0xf783ac,0,0.58,0.57);
  }else if(id === 'pet_pinguino'){
    b(0.46,0.72,0.36,dark,0,0.46,0); b(0.3,0.5,0.06,0xffffff,0,0.44,0.19); b(0.4,0.34,0.34,dark,0,0.98,0.02);
    cone(0.07,0.16,0xff8a1f,0,0.94,0.26,Math.PI/2); ball(0.04,0xffffff,-0.09,1.02,0.18); ball(0.04,0xffffff,0.09,1.02,0.18);
    b(0.16,0.05,0.22,0xff8a1f,-0.12,0.03,0.08); b(0.16,0.05,0.22,0xff8a1f,0.12,0.03,0.08);
  }else if(id === 'pet_robot'){
    b(0.5,0.5,0.46,0x9aa3ad,0,0.5,0); b(0.42,0.34,0.4,0xc3cad2,0,1.0,0); b(0.34,0.12,0.04,0x2f9bff,0,1.02,0.21);
    b(0.04,0.2,0.04,0x555555,0,1.3,0); ball(0.06,0xe0334c,0,1.42,0); b(0.12,0.2,0.12,0x555555,-0.15,0.15,0); b(0.12,0.2,0.12,0x555555,0.15,0.15,0);
    b(0.1,0.3,0.1,0x9aa3ad,-0.32,0.5,0); b(0.1,0.3,0.1,0x9aa3ad,0.32,0.5,0);
  }else if(id === 'pet_dragon'){
    const gr = 0x3fb950;
    b(0.46,0.4,0.84,gr,0,0.4,0); b(0.4,0.34,0.4,gr,0,0.66,0.52); b(0.3,0.26,0.05,0xffd43b,0,0.36,0.43);
    cone(0.06,0.2,0xf5f5f5,-0.12,0.94,0.5); cone(0.06,0.2,0xf5f5f5,0.12,0.94,0.5);
    b(0.08,0.38,0.5,0x2d9a42,-0.3,0.72,-0.05).rotation.z = 0.7; b(0.08,0.38,0.5,0x2d9a42,0.3,0.72,-0.05).rotation.z = -0.7;
    b(0.2,0.18,0.34,gr,0,0.34,-0.55); b(0.12,0.12,0.3,gr,0,0.3,-0.82);
    ball(0.045,0xffe066,-0.1,0.74,0.7); ball(0.045,0xffe066,0.1,0.74,0.7);
  }
  g.scale.setScalar(0.95);
  return g;
}

/* ---------- Mundo ---------- */
function mulberry32(a){
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function mat(color, extra){
  return new THREE.MeshLambertMaterial(Object.assign({ color:color }, extra||{}));
}
function discOnGround(scene, r, color, x, z, y){
  const m = new THREE.Mesh(new THREE.CircleGeometry(r,40), mat(color));
  m.rotation.x = -Math.PI/2; m.position.set(x||0, y||0, z||0); scene.add(m); return m;
}
function addLights(scene, sky, ground, intensity){
  scene.add(new THREE.HemisphereLight(sky, ground, intensity));
  const sun = new THREE.DirectionalLight(0xffffff, 0.6);
  sun.position.set(20,40,15); scene.add(sun);
}
let labelList = [];   // carteles de nombre de la zona viva (se reescalan según la distancia a la cámara)
function makeLabel(text, bg){
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = bg || 'rgba(0,0,0,.65)';
  g.beginPath(); g.roundRect ? g.roundRect(4,4,248,56,18) : g.rect(4,4,248,56); g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 128, 34);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true }));
  sp.scale.set(3.3,0.82,1);
  labelList.push(sp);
  return sp;
}

/* Portal: dos pilares + viga + disco brillante. Se orienta mirando al centro del mapa. */
function addPortal(scene, obstacles, x, z, color, label, dest){
  const T = THREE;
  const g = new T.Group();
  const pillar = mat(0x8d8d99);
  [-1.5,1.5].forEach(function(px){
    const p = new T.Mesh(new T.BoxGeometry(0.7,4,0.7), pillar); p.position.set(px,2,0); g.add(p);
    obstacles.push({ x:x + Math.cos(Math.atan2(x,z))*px, z:z - Math.sin(Math.atan2(x,z))*px, r:0.5 });
  });
  const beam = new T.Mesh(new T.BoxGeometry(3.7,0.7,0.7), pillar); beam.position.set(0,4.2,0); g.add(beam);
  const disc = new T.Mesh(new T.CircleGeometry(1.4,24), new T.MeshBasicMaterial({ color:color, transparent:true, opacity:0.75, side:T.DoubleSide }));
  disc.position.set(0,2.1,0); g.add(disc);
  const lab = makeLabel(label); lab.position.set(0,5.4,0); g.add(lab);
  g.position.set(x,0,z);
  g.rotation.y = Math.atan2(x,z);
  scene.add(g);
  return { x:x, z:z, dest:dest, disc:disc };
}

function addTree(scene, obstacles, x, z, s, leaf1, leaf2){
  const T = THREE;
  const tree = new T.Group();
  const trunk = new T.Mesh(new T.CylinderGeometry(0.25*s,0.35*s,1.6*s,8), mat(0x8a5a2b));
  trunk.position.y = 0.8*s; tree.add(trunk);
  const c1 = new T.Mesh(new T.ConeGeometry(1.3*s,2.2*s,8), mat(leaf1));
  c1.position.y = 2.4*s; tree.add(c1);
  const c2 = new T.Mesh(new T.ConeGeometry(0.95*s,1.7*s,8), mat(leaf2));
  c2.position.y = 3.5*s; tree.add(c2);
  tree.position.set(x,0,z); scene.add(tree);
  obstacles.push({ x:x, z:z, r:0.7*s });
}

function addFence(scene, R){
  const fenceMat = mat(0xc99a5b);
  for(let i=0;i<64;i++){
    const a = i/64*Math.PI*2;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.35,1.3,0.35), fenceMat);
    post.position.set(Math.cos(a)*(R+1),0.65,Math.sin(a)*(R+1));
    scene.add(post);
  }
}

/* Cerro/duna/monte escalonado: cajas apiladas que se suben saltando (relieve con plataformas). */
function addHill(scene, platforms, cx, cz, sizes, step, colors){
  const T = THREE;
  sizes.forEach(function(sz, i){
    const top = step*(i+1);
    const m = new T.Mesh(new T.BoxGeometry(sz, top, sz), mat(colors[Math.min(i, colors.length-1)]));
    m.position.set(cx, top/2, cz); scene.add(m);
    platforms.push({ x:cx, z:cz, hw:sz/2, hd:sz/2, bottom:0, top:top });
  });
  const top = step*sizes.length;
  const pole = new T.Mesh(new T.CylinderGeometry(0.06,0.06,2.4,6), mat(0xeeeeee)); pole.position.set(cx, top+1.2, cz); scene.add(pole);
  const flag = new T.Mesh(new T.PlaneGeometry(1.2,0.8), new T.MeshBasicMaterial({ color:0xe0334c, side:T.DoubleSide })); flag.position.set(cx+0.6, top+2.0, cz); scene.add(flag);
  return { x:cx, z:cz, y:top };
}

/* ---------- Distribución de los mundos: caminos, zonas reservadas y casas ---------- */
const LAYOUT = {
  bosque:  { color:0xd9b77a, w:2.2, paths:[ [[0,-2],[0,-16]], [[2,-1],[6,-4],[9,-6]], [[-2,-1],[-6,-6],[-12,-12],[-15,-14]], [[-2,-0.5],[-6,-3]] ] },
  playa:   { color:0xb98a5a, w:2.2, paths:[ [[0,-2],[0,-16]], [[2,1],[8,6]], [[-2,-1],[-8,-8],[-12,-10]], [[-2,1],[-6,5]] ] },
  espacio: { color:0x6a6882, w:2.2, paths:[ [[0,-2],[0,-16]], [[-2,-1],[-10,-9]], [[2,-2],[12,-12]], [[2,1],[7,5]] ] },
  volcan:  { color:0x2d2323, w:2.4, paths:[ [[0,-2],[0,-16]], [[2,-2],[10,-11]], [[-2,-1],[-9,-6]] ] },
  arrecife:{ color:0xe6cf8a, w:2.4, paths:[ [[0,-2],[0,-16]], [[-2,-2],[-11,-11]], [[2,-2],[7,-7]] ] },
};
function addPath(scene, pts, w, color){
  const segs = [];
  for(let i=0;i<pts.length-1;i++){
    const a = pts[i], b = pts[i+1], dx = b[0]-a[0], dz = b[1]-a[1], len = Math.hypot(dx,dz);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, len + w*0.6), mat(color));
    m.position.set((a[0]+b[0])/2, 0.045, (a[1]+b[1])/2); m.rotation.y = Math.atan2(dx,dz); scene.add(m);
    segs.push([a[0],a[1],b[0],b[1],w]);
  }
  return segs;
}
function layoutPaths(scene, zid){
  const L = LAYOUT[zid], all = [];
  if(!L) return all;
  L.paths.forEach(function(pts){ addPath(scene, pts, L.w, L.color).forEach(function(sg){ all.push(sg); }); });
  return all;
}
function distToSeg(px, pz, sg){
  const dx = sg[2]-sg[0], dz = sg[3]-sg[1], l2 = dx*dx + dz*dz;
  const t = l2 ? Math.max(0, Math.min(1, ((px-sg[0])*dx + (pz-sg[1])*dz)/l2)) : 0;
  return Math.hypot(px-(sg[0]+t*dx), pz-(sg[1]+t*dz));
}
/* true si (x,z) cae sobre un camino o junto a un personaje de esa zona: ahí no se ponen árboles, rocas, etc. */
function blockedSpot(zid, segs, x, z, pad){
  pad = pad || 0;
  if(segs.some(function(sg){ return distToSeg(x,z,sg) < sg[4]/2 + pad; })) return true;
  return Object.keys(NPCS).some(function(id){ const n = NPCS[id]; return n.zone === zid && Math.hypot(x-n.x, z-n.z) < (n.big ? 5 : 2.6) + pad; });
}
function addHouse(scene, obstacles, x, z, roofColor, bodyColor){
  const T = THREE, h = new T.Group();
  const body = new T.Mesh(new T.BoxGeometry(5,3,5), mat(bodyColor || 0xf4e4c1)); body.position.y = 1.5; h.add(body);
  const roof = new T.Mesh(new T.ConeGeometry(4.3,2.4,4), mat(roofColor)); roof.position.y = 4.2; roof.rotation.y = Math.PI/4; h.add(roof);
  const door = new T.Mesh(new T.BoxGeometry(1,1.8,0.1), mat(0x7a4a22)); door.position.set(0,0.9,2.55); h.add(door);
  [-1.5,1.5].forEach(function(wx){ const wn = new T.Mesh(new T.BoxGeometry(0.9,0.9,0.1), mat(0xbfe6ff)); wn.position.set(wx,1.8,2.55); h.add(wn); });
  h.position.set(x,0,z); h.rotation.y = Math.atan2(-x,-z); scene.add(h);
  obstacles.push({ x:x, z:z, r:3.4 });
  return h;
}

/* ----- Pueblo central ----- */
function buildPueblo(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(7);
  discOnGround(scene, 46, 0x9be070);
  discOnGround(scene, 10, 0xcfc8bd, 0, 0, 0.02);
  // fuente
  const base = new T.Mesh(new T.CylinderGeometry(2.4,2.6,0.6,20), mat(0xaab3bd)); base.position.y = 0.3; scene.add(base);
  const water = new T.Mesh(new T.CylinderGeometry(2.1,2.1,0.1,20), mat(0x4fb4f2)); water.position.y = 0.62; scene.add(water);
  const jet = new T.Mesh(new T.CylinderGeometry(0.2,0.3,1.6,8), mat(0xaab3bd)); jet.position.y = 1.2; scene.add(jet);
  obstacles.push({ x:0, z:0, r:2.8 });

  // calles: de la plaza a cada portal (7 portales = 7 calles; el sur queda libre para llegar y para las casas)
  const portalSpots = [[0,-16],[16,0],[-16,0],[11,-11],[11,11],[-11,-11],[-11,11]];
  const segs = [];
  portalSpots.forEach(function(q){ addPath(scene, [[q[0]*0.4,q[1]*0.4],[q[0]*0.93,q[1]*0.93]], 2.8, 0xd9b77a).forEach(function(sg){ segs.push(sg); }); });
  // calle sur hacia las casas y los personajes
  addPath(scene, [[0,8],[0,18]], 2.8, 0xd9b77a).forEach(function(sg){ segs.push(sg); });
  addPath(scene, [[-9.9,17],[9.9,17]], 2.4, 0xd9b77a).forEach(function(sg){ segs.push(sg); });
  addPath(scene, [[5,8],[18,8]], 2.4, 0xd9b77a).forEach(function(sg){ segs.push(sg); });

  // casas con letrero: cada personaje vive junto a la suya
  const roofCols = [0xd94f4f,0x4f7bd9,0xe0a030,0x8a5ad9,0x3fae6b,0xd9548a];
  const houses = [[-22,-10,null],[22,-10,null],[-24,10,null],[24,10,'Cocina'],[-12,24,'Escuela'],[12,24,'Panadería']];
  houses.forEach(function(h,k){
    addHouse(scene, obstacles, h[0], h[1], roofCols[k]);
    if(h[2]){ const lab = makeLabel(h[2], 'rgba(120,60,20,.85)'); lab.position.set(h[0], 6.4, h[1]); scene.add(lab); }
  });

  // banquitas y canteros alrededor de la fuente (entre las calles, a 22.5° de cada una)
  for(let k=0;k<4;k++){
    const a = Math.PI/8 + k*Math.PI/2 + Math.PI/4*0, x = Math.cos(a)*5.8, z = Math.sin(a)*5.8;
    const g = new T.Group();
    const seat = new T.Mesh(new T.BoxGeometry(1.8,0.18,0.6), mat(0x9a6a3a)); seat.position.y = 0.5; g.add(seat);
    const back = new T.Mesh(new T.BoxGeometry(1.8,0.5,0.1), mat(0x9a6a3a)); back.position.set(0,0.85,-0.3); g.add(back);
    [-0.7,0.7].forEach(function(lx){ const lg = new T.Mesh(new T.BoxGeometry(0.1,0.5,0.5), mat(0x6b4423)); lg.position.set(lx,0.25,0); g.add(lg); });
    g.position.set(x,0,z); g.rotation.y = Math.atan2(-x,-z)+Math.PI; scene.add(g); obstacles.push({ x:x, z:z, r:0.9 });
  }
  const flowerCols = [0xff6b9d,0xffd43b,0xffffff,0xb18cff,0xff9f43];
  for(let k=0;k<8;k++){
    const a = Math.PI/8 + k*Math.PI/4;
    if(k % 2 === 0) continue;                                     // los lugares pares tienen banca
    for(let f=0;f<7;f++){
      const aa = a + (f-3)*0.07, rr = 8.2 + (f%2)*0.5;
      const fl = new T.Mesh(new T.SphereGeometry(0.16,6,6), mat(flowerCols[(k+f)%flowerCols.length])); fl.position.set(Math.cos(aa)*rr,0.2,Math.sin(aa)*rr); scene.add(fl);
    }
  }
  // faroles a los lados de cada calle
  portalSpots.forEach(function(q){
    [0.58,0.84].forEach(function(t, ti){
      const L = Math.hypot(q[0],q[1]), nx = -q[1]/L, nz = q[0]/L, side = ti ? -1 : 1;
      const x = q[0]*t + nx*2.1*side, z = q[1]*t + nz*2.1*side;
      const pole = new T.Mesh(new T.CylinderGeometry(0.07,0.09,2.6,6), mat(0x44464e)); pole.position.set(x,1.3,z); scene.add(pole);
      const bulb = new T.Mesh(new T.SphereGeometry(0.22,8,6), new T.MeshBasicMaterial({ color:0xffe27a })); bulb.position.set(x,2.7,z); scene.add(bulb);
    });
  });

  // árboles solo en el borde y lejos de casas y calles
  let n = 0, guard = 0;
  while(n < 18 && guard++ < 300){
    const a = rnd()*Math.PI*2, d = 29 + rnd()*8, x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(houses.some(function(h){ return Math.hypot(x-h[0],z-h[1]) < 7; }) || segs.some(function(sg){ return distToSeg(x,z,sg) < 3; })) continue;
    addTree(scene, obstacles, x, z, 0.9+rnd()*0.6, 0x2f9e44, 0x40c057); n++;
  }
  // portales
  const portals = [
    addPortal(scene, obstacles, 0, -16, 0x2fb344, ctx.portalLabel('bosque'), 'bosque'),
    addPortal(scene, obstacles, 16, 0, 0xf7c948, ctx.portalLabel('playa'), 'playa'),
    addPortal(scene, obstacles, -16, 0, 0x9b59d0, ctx.portalLabel('espacio'), 'espacio'),
    addPortal(scene, obstacles, 11, -11, 0xff9f43, '🏠 Mi Casa', 'casa'),
    addPortal(scene, obstacles, 11, 11, 0xff5a1f, ctx.portalLabel('obby'), 'obby'),
    addPortal(scene, obstacles, -11, -11, 0xff3b1f, ctx.portalLabel('volcan'), 'volcan'),
    addPortal(scene, obstacles, -11, 11, 0x1fb5ff, ctx.portalLabel('arrecife'), 'arrecife'),
  ];
  addSeasonDecor(scene, activeSeason(), segs);
  const chest = buildChest(scene, 3.5, 6.5);
  obstacles.push({ x:3.5, z:6.5, r:1.0 });
  const board = buildBoard(scene, -3.5, 6.5);
  obstacles.push({ x:-3.5, z:6.5, r:1.0 });
  addFence(scene, 38);
  addLights(scene, 0xffffff, 0x88aa66, 0.9);
  return { obstacles:obstacles, portals:portals, visits:{}, chest:chest, board:board };
}

/* ----- Bosque ----- */
function buildBosque(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(2026);
  discOnGround(scene, 44, 0x7ed957);
  const pond = discOnGround(scene, 5, 0x4fb4f2, 12, -9, 0.03);
  obstacles.push({ x:12, z:-9, r:5.3 });
  discOnGround(scene, 4, 0xd9b77a, 0, 0, 0.02);
  const segs = layoutPaths(scene, 'bosque');
  addHouse(scene, obstacles, -12.5, -6.5, 0x3fae6b, 0xe9d6a8);          // la cabaña de Mati el guardabosques
  let placed = 0, guard = 0;
  while(placed < 34 && guard++ < 500){
    const a = rnd()*Math.PI*2, d = 7 + rnd()*29;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x-12,z+9) < 8 || Math.hypot(x,z+18) < 6 || Math.hypot(x+18,z+16) < 9 || Math.hypot(x+12.5,z+6.5) < 5.5 || blockedSpot('bosque',segs,x,z,1.8)) continue;
    addTree(scene, obstacles, x, z, 0.8 + rnd()*0.8, rnd()<0.5?0x2f9e44:0x40c057, 0x40c057);
    placed++;
  }
  const flowerCols = [0xff6b6b,0xffd43b,0xf783ac,0xffffff];
  for(let i=0;i<60;i++){
    const a = rnd()*Math.PI*2, d = 3 + rnd()*34;
    const f = new T.Mesh(new T.SphereGeometry(0.13,6,6), mat(flowerCols[i%4]));
    f.position.set(Math.cos(a)*d,0.15,Math.sin(a)*d); scene.add(f);
  }
  const portals = [ addPortal(scene, obstacles, 0, -18, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  const platforms = [];
  const mir = addHill(scene, platforms, -18, -16, [11,8,5,2.4], 1, [0x6fc04a,0x8a8f55,0x9a8a6a,0xb5b0a5]);
  addFence(scene, 38);
  addLights(scene, 0xffffff, 0x88aa66, 0.85);
  return { obstacles:obstacles, portals:portals, platforms:platforms, visits:{ laguna:{ x:12, z:-9 }, mirador:mir } };
}

/* ----- Playa ----- */
function buildPlaya(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(55);
  discOnGround(scene, 120, 0x4fb4f2, 0, 0, -0.02);        // mar
  discOnGround(scene, 33, 0xf5deb3);                      // arena
  discOnGround(scene, 33, 0xf5deb3, 0, 0, 0.0);
  // agua poco profunda en el borde
  const ring = new T.Mesh(new T.RingGeometry(29,33,48), mat(0x8fd8f5)); ring.rotation.x = -Math.PI/2; ring.position.y = 0.03; scene.add(ring);
  const segs = layoutPaths(scene, 'playa');
  // palmeras
  let n = 0, guard = 0;
  while(n < 12 && guard++ < 200){
    const a = rnd()*Math.PI*2, d = 8 + rnd()*18;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x-10,z-8) < 7 || Math.hypot(x,z+18) < 5 || Math.hypot(x,z) < 6 || blockedSpot('playa',segs,x,z,1.6)) continue;
    const p = new T.Group();
    const trunk = new T.Mesh(new T.CylinderGeometry(0.22,0.32,4,8), mat(0x9a6a3a)); trunk.position.y = 2; p.add(trunk);
    for(let k=0;k<6;k++){
      const leaf = new T.Mesh(new T.BoxGeometry(2.4,0.08,0.6), mat(0x2fb344));
      leaf.position.set(Math.cos(k/6*Math.PI*2)*1.1,4.1,Math.sin(k/6*Math.PI*2)*1.1);
      leaf.rotation.y = -k/6*Math.PI*2; leaf.rotation.z = 0.35; p.add(leaf);
    }
    p.position.set(x,0,z); scene.add(p); obstacles.push({ x:x, z:z, r:0.5 }); n++;
  }
  // sombrillas (zona de la misión)
  [[10,8,0xe0334c],[13,5,0xf7c948]].forEach(function(u){
    const g = new T.Group();
    const pole = new T.Mesh(new T.CylinderGeometry(0.07,0.07,2.6,6), mat(0xeeeeee)); pole.position.y = 1.3; g.add(pole);
    const top = new T.Mesh(new T.ConeGeometry(1.6,0.8,10), mat(u[2])); top.position.y = 2.8; g.add(top);
    g.position.set(u[0],0,u[1]); scene.add(g); obstacles.push({ x:u[0], z:u[1], r:0.4 });
  });
  // rocas
  for(let i=0;i<6;i++){
    const a = rnd()*Math.PI*2, d = 10 + rnd()*16;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 5 || Math.hypot(x+15,z+12) < 8 || blockedSpot('playa',segs,x,z,1.6)) continue;
    const r = new T.Mesh(new T.DodecahedronGeometry(0.8+rnd()*0.4), mat(0x9aa0a6)); r.position.set(x,0.4,z); scene.add(r);
    obstacles.push({ x:x, z:z, r:0.9 });
  }
  const portals = [ addPortal(scene, obstacles, 0, -18, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  const platforms = [];
  const duna = addHill(scene, platforms, -15, -12, [9,6,3], 0.9, [0xe9cf98,0xdfc080,0xd2b06a]);
  addLights(scene, 0xffffff, 0xd9c28a, 0.95);
  return { obstacles:obstacles, portals:portals, platforms:platforms, visits:{ sombrilla:{ x:10, z:8 }, duna:duna } };
}

/* ----- Espacio ----- */
function buildEspacio(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(99);
  discOnGround(scene, 40, 0x8d8ba3);
  const segs = layoutPaths(scene, 'espacio');
  // cráteres decorativos
  for(let i=0;i<12;i++){
    const a = rnd()*Math.PI*2, d = 5 + rnd()*26;
    discOnGround(scene, 1.5 + rnd()*2, 0x6f6d85, Math.cos(a)*d, Math.sin(a)*d, 0.02);
  }
  // rocas lunares
  for(let i=0;i<14;i++){
    const a = rnd()*Math.PI*2, d = 8 + rnd()*22;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 5 || Math.hypot(x+12,z+10) < 6 || Math.hypot(x-15,z+15) < 9 || blockedSpot('espacio',segs,x,z,1.8)) continue;
    const r = new T.Mesh(new T.DodecahedronGeometry(0.9+rnd()*0.8), mat(0x77758c)); r.position.set(x,0.6,z); scene.add(r);
    obstacles.push({ x:x, z:z, r:1.2 });
  }
  // bandera (zona de la misión)
  const pole = new T.Mesh(new T.CylinderGeometry(0.06,0.06,3.2,6), mat(0xeeeeee)); pole.position.set(-12,1.6,-10); scene.add(pole);
  const flag = new T.Mesh(new T.PlaneGeometry(1.4,0.9), new T.MeshBasicMaterial({ color:0xe0334c, side:T.DoubleSide })); flag.position.set(-11.3,2.8,-10); scene.add(flag);
  obstacles.push({ x:-12, z:-10, r:0.4 });
  // la Tierra y estrellas de fondo
  const earth = new T.Mesh(new T.SphereGeometry(8,24,16), new T.MeshBasicMaterial({ color:0x3b82f6 })); earth.position.set(-35,28,-70); scene.add(earth);
  const land = new T.Mesh(new T.SphereGeometry(8.05,10,8), new T.MeshBasicMaterial({ color:0x2fb344, wireframe:true })); land.position.copy(earth.position); scene.add(land);
  const pts = []; for(let i=0;i<300;i++){ const a = rnd()*Math.PI*2, e = rnd()*1.2+0.1, r = 90; pts.push(Math.cos(a)*r*Math.cos(e), Math.sin(e)*r, Math.sin(a)*r*Math.cos(e)); }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pts,3));
  scene.add(new T.Points(geo, new T.PointsMaterial({ color:0xffffff, size:0.9, fog:false })));
  const portals = [ addPortal(scene, obstacles, 0, -18, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  const platforms = [];
  const monte = addHill(scene, platforms, 15, -15, [10,7,4,2], 1, [0x7d7b92,0x8d8ba3,0x9d9bb3,0xb0aec4]);
  addLights(scene, 0xc9c9ff, 0x333355, 0.8);
  return { obstacles:obstacles, portals:portals, platforms:platforms, visits:{ bandera:{ x:-12, z:-10 }, monte:monte } };
}

/* ----- Mi Casa ----- */
function buildCasa(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(31);
  discOnGround(scene, 40, 0x7ed957);
  const L = HOUSE_LIMIT;
  const floor = new T.Mesh(new T.PlaneGeometry(2*L+1,2*L+1), mat(0xe9d3a6));
  floor.rotation.x = -Math.PI/2; floor.position.y = 0.02; scene.add(floor);
  const grid = new T.GridHelper(2*L+1, 2*L+1, 0xb89a68, 0xcdb27f); grid.position.y = 0.04; scene.add(grid);
  for(let i=0;i<14;i++){
    const a = rnd()*Math.PI*2, d = 17 + rnd()*5;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 4) continue;
    addTree(scene, obstacles, x, z, 0.9+rnd()*0.5, 0x2f9e44, 0x40c057);
  }
  const portals = [ addPortal(scene, obstacles, 0, -17, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  addFence(scene, 24);
  addLights(scene, 0xffffff, 0x88aa66, 0.95);
  return { obstacles:obstacles, portals:portals, visits:{}, house:true };
}

function houseMesh(def){
  const T = THREE, g = new T.Group();
  function box(w,h,d,color,x,y,z,opts){
    const m = new T.Mesh(new T.BoxGeometry(w,h,d), mat(color, opts));
    m.position.set(x,y,z); g.add(m); return m;
  }
  if(def.kind === 'block'){
    box(0.98,0.98,0.98,def.color,0,0.5,0, def.opacity ? { transparent:true, opacity:def.opacity } : null);
    return g;
  }
  if(def.id==='f_mesa'){
    box(0.95,0.1,0.95,0xb07a3f,0,0.78,0);
    [[-0.38,-0.38],[0.38,-0.38],[-0.38,0.38],[0.38,0.38]].forEach(function(p){ box(0.1,0.74,0.1,0x8a5a2b,p[0],0.37,p[1]); });
  }else if(def.id==='f_silla'){
    box(0.6,0.08,0.6,0xb07a3f,0,0.45,0);
    box(0.6,0.55,0.08,0xb07a3f,0,0.78,-0.26);
    [[-0.24,-0.24],[0.24,-0.24],[-0.24,0.24],[0.24,0.24]].forEach(function(p){ box(0.07,0.42,0.07,0x8a5a2b,p[0],0.21,p[1]); });
  }else if(def.id==='f_cama'){
    box(0.95,0.3,0.98,0x8a5a2b,0,0.25,0);
    box(0.88,0.2,0.9,0xf5f5f5,0,0.5,0.02);
    box(0.7,0.12,0.25,0x93c5fd,0,0.66,-0.3);
    box(0.95,0.55,0.1,0x8a5a2b,0,0.5,-0.46);
  }else if(def.id==='f_sofa'){
    box(0.98,0.4,0.8,0xd94f4f,0,0.3,0.08);
    box(0.98,0.55,0.2,0xb83a3a,0,0.6,-0.38);
    [-1,1].forEach(function(s){ box(0.15,0.5,0.8,0xb83a3a,s*0.42,0.45,0.08); });
  }else if(def.id==='f_planta'){
    const pot = new T.Mesh(new T.CylinderGeometry(0.25,0.18,0.35,10), mat(0xc2693a)); pot.position.y = 0.18; g.add(pot);
    const leaf = new T.Mesh(new T.SphereGeometry(0.38,10,8), mat(0x2fb344)); leaf.position.y = 0.7; g.add(leaf);
  }else if(def.id==='f_lampara'){
    box(0.08,1.1,0.08,0x555555,0,0.55,0);
    box(0.3,0.05,0.3,0x555555,0,0.03,0);
    const sh = new T.Mesh(new T.ConeGeometry(0.32,0.4,10,1,true), new T.MeshBasicMaterial({ color:0xfff1a8, side:T.DoubleSide })); sh.position.y = 1.2; g.add(sh);
  }else if(def.id==='f_alfombra'){
    box(0.98,0.05,0.98,0xd94f4f,0,0.04,0);
    box(0.7,0.06,0.7,0xf7c948,0,0.05,0);
  }else if(def.id==='f_arbol'){
    const tr = new T.Mesh(new T.CylinderGeometry(0.1,0.14,0.6,8), mat(0x8a5a2b)); tr.position.y = 0.3; g.add(tr);
    const c = new T.Mesh(new T.ConeGeometry(0.45,0.9,8), mat(0x2f9e44)); c.position.y = 1.0; g.add(c);
    const c2 = new T.Mesh(new T.ConeGeometry(0.33,0.7,8), mat(0x40c057)); c2.position.y = 1.5; g.add(c2);
  }
  return g;
}

/* ----- Carrera de obstáculos (obby): plataformas sobre lava, 5 etapas con puntos de control ----- */
function buildObby(scene, ctx){
  const T = THREE, platforms = [], checkpoints = [], visits = {};
  const lava = new T.Mesh(new T.PlaneGeometry(900,900), new T.MeshBasicMaterial({ color:0xe8461a }));
  lava.rotation.x = -Math.PI/2; lava.position.y = -6; scene.add(lava);
  function plat(x,z,w,d,top,color){
    const m = new T.Mesh(new T.BoxGeometry(w,1,d), mat(color));
    m.position.set(x,top-0.5,z); scene.add(m);
    platforms.push({ x:x, z:z, hw:w/2, hd:d/2, bottom:top-1, top:top });
  }
  const GREEN = 0x2fb344;
  function checkpoint(n, x, z, top){
    plat(x,z,5,5,top,GREEN);
    checkpoints.push({ x:x, z:z, top:top });
    visits['e'+n] = { x:x, z:z, y:top };
    const pole = new T.Mesh(new T.CylinderGeometry(0.06,0.06,2.6,6), mat(0xeeeeee)); pole.position.set(x+1.8,top+1.3,z); scene.add(pole);
    const flag = new T.Mesh(new T.PlaneGeometry(1.2,0.8), new T.MeshBasicMaterial({ color:0xffd43b, side:T.DoubleSide })); flag.position.set(x+2.4,top+2.2,z); scene.add(flag);
  }
  plat(0,0,7,7,0,0x59c46b);               // inicio
  let z = -8, top = 0;
  checkpoint(1, 0, z, top);                // etapa 1: escalones
  for(let i=0;i<6;i++){ z -= 4.2; top += 0.4; plat(0,z,3.4,3.4,top,0x7ed957); }
  z -= 5.0; checkpoint(2, 0, z, top);      // etapa 2: zigzag
  for(let i=0;i<6;i++){ z -= 4.0; top += 0.2; plat(i%2 ? 2.6 : -2.6, z, 2.8, 2.8, top, 0xf7c948); }
  z -= 5.0; checkpoint(3, 0, z, top);      // etapa 3: escalera al cielo
  for(let i=0;i<5;i++){ z -= 3.7; top += 1.0; plat(0,z,2.8,2.8,top,0xf783ac); }
  z -= 4.9; checkpoint(4, 0, z, top);      // etapa 4: saltos largos
  for(let i=0;i<5;i++){ z -= 5.4; plat(0,z,2.6,2.6,top,0x4fb4f2); }
  z -= 5.7; checkpoint(5, 0, z, top);      // etapa 5: vigas angostas
  for(let i=0;i<6;i++){ z -= 4.2; top += 0.3; plat(i%2 ? 2.0 : -2.0, z, 1.7, 1.7, top, 0x9b59d0); }
  z -= 5.5; plat(0,z,8,8,top,0xe8b923);    // meta
  visits.meta = { x:0, z:z, y:top };
  const base = new T.Mesh(new T.CylinderGeometry(1,1.2,0.6,12), mat(0xcfcfcf)); base.position.set(0,top+0.3,z); scene.add(base);
  const cup = new T.Mesh(new T.CylinderGeometry(0.8,0.4,1.0,12), mat(0xf2c230)); cup.position.set(0,top+1.1,z); scene.add(cup);
  const ball = new T.Mesh(new T.SphereGeometry(0.35,10,8), mat(0xf2c230)); ball.position.set(0,top+1.9,z); scene.add(ball);
  const portals = [ addPortal(scene, [], -3.2, 0.8, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  addLights(scene, 0xffffff, 0xffc9a0, 0.95);
  return { obstacles:[], portals:portals, visits:visits, platforms:platforms, checkpoints:checkpoints, spawn:{ x:0, y:0, z:0 } };
}

/* ----- Volcán: roca oscura, pozas de lava y un volcán que se escala ----- */
function buildVolcan(scene, ctx){
  const T = THREE, obstacles = [], platforms = [], rnd = mulberry32(77);
  discOnGround(scene, 48, 0x4a3b3b);
  const segs = layoutPaths(scene, 'volcan');
  const pools = [[10,6,3.2],[-14,10,2.6],[-6,-16,3.0],[22,2,2.4]];
  pools.forEach(function(p){
    const m = new T.Mesh(new T.CircleGeometry(p[2],24), new T.MeshBasicMaterial({ color:0xff5a1f }));
    m.rotation.x = -Math.PI/2; m.position.set(p[0],0.03,p[1]); scene.add(m);
    obstacles.push({ x:p[0], z:p[1], r:p[2]+0.2 });
  });
  let n = 0, guard = 0;
  while(n < 18 && guard++ < 300){
    const a = rnd()*Math.PI*2, d = 7 + rnd()*26, x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 5 || Math.hypot(x-15,z+16) < 10 || Math.hypot(x+12,z+8) < 6 || Math.hypot(x,z) < 5 || blockedSpot('volcan',segs,x,z,1.8)) continue;
    if(pools.some(function(p){ return Math.hypot(x-p[0],z-p[1]) < p[2]+2; })) continue;
    const r = new T.Mesh(new T.DodecahedronGeometry(0.9+rnd()*0.9), mat(0x3a2e2e)); r.position.set(x,0.6,z); scene.add(r);
    obstacles.push({ x:x, z:z, r:1.3 }); n++;
  }
  const cima = addHill(scene, platforms, 15, -16, [13,10,7,4], 1.3, [0x4a3b3b,0x5a4040,0x6a4a44,0x7a5048]);
  const crater = new T.Mesh(new T.CircleGeometry(1.2,16), new T.MeshBasicMaterial({ color:0xff7a2f }));
  crater.rotation.x = -Math.PI/2; crater.position.set(15+1.4, 1.3*4+0.03, -16+1.4); scene.add(crater);
  const portals = [ addPortal(scene, obstacles, 0, -18, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  addLights(scene, 0xffc9a0, 0x552222, 0.85);
  return { obstacles:obstacles, portals:portals, platforms:platforms, visits:{ cima:cima } };
}

/* ----- Arrecife submarino: corales, algas que se mecen, peces y burbujas ----- */
function buildArrecife(scene, ctx){
  const T = THREE, obstacles = [], platforms = [], rnd = mulberry32(88);
  discOnGround(scene, 48, 0xf0dca0);
  const segs = layoutPaths(scene, 'arrecife');
  const coralCols = [0xff6b9d,0xff9f43,0xb18cff,0xffd43b];
  let n = 0, guard = 0;
  while(n < 22 && guard++ < 300){
    const a = rnd()*Math.PI*2, d = 6 + rnd()*28, x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 5 || Math.hypot(x+15,z+14) < 9 || Math.hypot(x-10,z+10) < 6 || Math.hypot(x,z) < 4 || blockedSpot('arrecife',segs,x,z,1.8)) continue;
    const g = new T.Group(), c = coralCols[n % coralCols.length];
    for(let k=0;k<4;k++){
      const h = 0.8 + rnd()*1.2, cone = new T.Mesh(new T.ConeGeometry(0.28+rnd()*0.15,h,6), mat(c));
      cone.position.set((rnd()-0.5)*0.9, h/2, (rnd()-0.5)*0.9); g.add(cone);
    }
    g.position.set(x,0,z); scene.add(g); obstacles.push({ x:x, z:z, r:0.95 }); n++;
  }
  const kelps = [];
  for(let i=0;i<22;i++){
    const a = rnd()*Math.PI*2, d = 5 + rnd()*30, h = 3 + rnd()*2.5;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 4 || blockedSpot('arrecife',segs,x,z,0.8)) continue;
    const k = new T.Group(); const b = new T.Mesh(new T.BoxGeometry(0.2,h,0.2), mat(0x2fa05a)); b.position.y = h/2; k.add(b);
    k.position.set(x,0,z); scene.add(k); kelps.push({ m:k, ph:rnd()*6 });
  }
  const fishes = [];
  for(let i=0;i<14;i++){
    const g = new T.Group(), col = coralCols[i % 4];
    g.add(new T.Mesh(new T.BoxGeometry(0.5,0.3,0.2), mat(col)));
    const tl = new T.Mesh(new T.ConeGeometry(0.2,0.3,4), mat(col)); tl.rotation.z = Math.PI/2; tl.position.x = -0.38; g.add(tl);
    scene.add(g); fishes.push({ m:g, cx:(rnd()-0.5)*50, cz:(rnd()-0.5)*50, r:3+rnd()*5, sp:0.4+rnd()*0.6, y:1.5+rnd()*4, ph:rnd()*6 });
  }
  const bubbles = [];
  for(let i=0;i<28;i++){
    const m = new T.Mesh(new T.SphereGeometry(0.12+rnd()*0.1,8,6), new T.MeshBasicMaterial({ color:0xdff6ff, transparent:true, opacity:0.55 }));
    m.position.set((rnd()-0.5)*50, rnd()*10, (rnd()-0.5)*50); scene.add(m); bubbles.push({ m:m, sp:0.6+rnd()*0.8 });
  }
  const coral = addHill(scene, platforms, -15, -14, [10,7,4], 1, [0xff9f9f,0xff7aa8,0xb18cff]);
  const portals = [ addPortal(scene, obstacles, 0, -18, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  addLights(scene, 0xbfeaff, 0x2a6a8a, 0.95);
  function tick(t){
    kelps.forEach(function(k){ k.m.rotation.z = Math.sin(t*1.2 + k.ph)*0.12; });
    fishes.forEach(function(f){
      const a = t*f.sp + f.ph;
      f.m.position.set(f.cx + Math.cos(a)*f.r, f.y + Math.sin(a*2)*0.3, f.cz + Math.sin(a)*f.r);
      f.m.rotation.y = -a;
    });
    bubbles.forEach(function(b){ b.m.position.y += 0.012*b.sp*60*0.016; if(b.m.position.y > 11) b.m.position.y = 0; });
  }
  return { obstacles:obstacles, portals:portals, platforms:platforms, visits:{ coral:coral }, tick:tick };
}

function buildOctopus(){
  const T = THREE, g = new T.Group();
  const mm = new T.MeshLambertMaterial({ color:0x9b59d0 });
  const head = new T.Mesh(new T.SphereGeometry(1.1,14,10), mm); head.position.y = 2.2; head.scale.set(1,1.1,1); g.add(head);
  [-1,1].forEach(function(sx){
    const e = new T.Mesh(new T.SphereGeometry(0.28,10,8), new T.MeshLambertMaterial({ color:0xffffff })); e.position.set(sx*0.45,2.35,0.85); g.add(e);
    const p = new T.Mesh(new T.SphereGeometry(0.14,8,6), new T.MeshLambertMaterial({ color:0x111111 })); p.position.set(sx*0.45,2.35,1.08); g.add(p);
  });
  for(let i=0;i<8;i++){
    const a = i/8*Math.PI*2, tl = new T.Mesh(new T.BoxGeometry(0.28,1.6,0.28), mm);
    tl.position.set(Math.cos(a)*0.8, 0.8, Math.sin(a)*0.8); tl.rotation.z = Math.cos(a)*0.35; tl.rotation.x = -Math.sin(a)*0.35; g.add(tl);
  }
  return g;
}
function makeGem(){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshLambertMaterial({ color:0xff4d4d, emissive:0x991111 })));
  return g;
}
function makePearl(){
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.34,12,10), new THREE.MeshLambertMaterial({ color:0xfdf6ff, emissive:0x8a7aa0 })));
  return g;
}

/* ---------- Coleccionables ---------- */
function makeBone(){
  const T = THREE;
  const g = new T.Group();
  const m = new T.MeshLambertMaterial({ color:0xfff7e0, emissive:0x554422 });
  const shaft = new T.Mesh(new T.CylinderGeometry(0.12,0.12,0.7,8), m);
  shaft.rotation.z = Math.PI/2; g.add(shaft);
  [[-0.35,0.1],[-0.35,-0.1],[0.35,0.1],[0.35,-0.1]].forEach(function(p){
    const b = new T.Mesh(new T.SphereGeometry(0.16,8,8), m);
    b.position.set(p[0],p[1],0); g.add(b);
  });
  g.scale.setScalar(1.4);
  return g;
}
function makeShell(){
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color:0xff9ec7, emissive:0x662244 });
  const s = new THREE.Mesh(new THREE.ConeGeometry(0.45,0.7,8), m); s.rotation.x = Math.PI/2; g.add(s);
  g.scale.setScalar(1.3);
  return g;
}
function makeStar(){
  const g = new THREE.Group();
  const m = new THREE.MeshLambertMaterial({ color:0xffe066, emissive:0xaa8800 });
  g.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.6), m));
  return g;
}

/* ---------- Zonas ---------- */
const ZONES = {
  pueblo:  { name:'Pueblo de Carboncito', radius:37, sky:0xbfe8ff, fogNear:50, fogFar:110, build:buildPueblo,
             hello:'Bienvenido al pueblo 🏘️ Habla con la gente del pueblo (Lucho 📚, Beto 🥖, Nati 🍳) para recibir encargos, o entra a un portal. Los que tienen candado 🔒 se abren con monedas.' },
  casa:    { name:'Mi Casa', radius:23, sky:0x9fdcff, fogNear:50, fogFar:110, build:buildCasa, home:true,
             hello:'¡Esta es tu casa! 🏠 Toca 🔨 Construir para poner bloques y muebles. Desbloquea más con tus monedas.' },
  volcan:  { name:'Volcán', radius:40, sky:0x3a1d1d, fogNear:40, fogFar:115, build:buildVolcan, price:100, stars:60,
             collect:{ emoji:'💎', make:makeGem, n:10 },
             missions:[
               { type:'collect', n:5, reward:20, text:'🌋 ¡Bienvenido al volcán! Recoge 5 gemas de fuego 💎 y no pises la lava.', done:'¡Qué brillantes!' },
               { type:'visit', at:'cima', r:2.4, reward:25, text:'Sube por el volcán saltando de escalón en escalón hasta la bandera de la cima 🔥', done:'¡En la cima del volcán!' },
               { type:'collect', n:8, reward:30, text:'¡Junta 8 gemas más! 💎 Cenizas el dragón vigila el tesoro...', done:'¡Tesoro de fuego!' },
             ] },
  arrecife:{ name:'Arrecife', radius:40, sky:0x2a8fbf, fogNear:25, fogFar:85, build:buildArrecife, price:90, stars:50,
             collect:{ emoji:'⚪', make:makePearl, n:10 },
             missions:[
               { type:'collect', n:5, reward:20, text:'🌊 ¡Estás en el fondo del mar! Recoge 5 perlas ⚪ entre los corales.', done:'¡Perlas preciosas!' },
               { type:'visit', at:'coral', r:2.4, reward:25, text:'Sube a la montaña de coral saltando de escalón en escalón 🪸', done:'¡Rey del arrecife!' },
               { type:'collect', n:8, reward:30, text:'¡Junta 8 perlas más! ⚪ El Pulpo Tinta guarda un tesoro...', done:'¡Qué collar tan lindo!' },
             ] },
  obby:    { name:'Carrera de Obstáculos', radius:260, floor:null, sky:0x87ceeb, fogNear:80, fogFar:230, build:buildObby, price:30, stars:25,
             missions:[
               { type:'visit', at:'e1', r:3, reward:5,  text:'🏁 ¡Carrera de obstáculos! Salta (barra espaciadora o botón Saltar) por las plataformas hasta la 1ª bandera.', done:'¡Etapa 1 lista!' },
               { type:'visit', at:'e2', r:3, reward:6,  text:'Etapa 2: ¡zigzag! Cuidado con la lava 🌋 Si te caes, vuelves a tu última bandera.', done:'¡Etapa 2 lista!' },
               { type:'visit', at:'e3', r:3, reward:8,  text:'Etapa 3: la escalera al cielo ⬆️ Sube de a una plataforma.', done:'¡Etapa 3 lista!' },
               { type:'visit', at:'e4', r:3, reward:10, text:'Etapa 4: ¡saltos largos! Corre y salta 🏃', done:'¡Etapa 4 lista!' },
               { type:'visit', at:'e5', r:3, reward:12, text:'Etapa 5: vigas angostas, ¡equilibrio! 🎯', done:'¡Etapa 5 lista!' },
               { type:'visit', at:'meta', r:4, reward:40, text:'¡Última subida! Llega a la meta 🏆', done:'¡Campeón de la carrera! 🏆' },
             ] },
  bosque:  { name:'Bosque', radius:37, sky:0x9fdcff, fogNear:35, fogFar:80, build:buildBosque, price:0,
             collect:{ emoji:'🦴', make:makeBone, n:10 },
             missions:[
               { type:'collect', n:5, reward:10, text:'¡Perdí mis huesitos! ¿Me ayudas a recoger 5? 🦴', done:'¡Gracias! Eres un gran amigo.' },
               { type:'visit', at:'laguna', r:8, reward:10, text:'Ahora vamos a la laguna 💧. Camina hasta el agua y yo te sigo.', done:'¡Qué bonita laguna!' },
               { type:'collect', n:10, reward:20, text:'¡Último reto! Recoge 10 huesitos 🦴 ¡tú puedes!', done:'¡Eres increíble!' },
               { type:'visit', at:'mirador', r:2.2, reward:15, text:'⛰️ ¡Sube al cerro del mirador! Salta de escalón en escalón hasta la bandera.', done:'¡Qué vista desde arriba!' },
             ] },
  playa:   { name:'Playa', radius:29, sky:0xaee4ff, fogNear:45, fogFar:100, build:buildPlaya, price:40, stars:15,
             collect:{ emoji:'🐚', make:makeShell, n:10 },
             missions:[
               { type:'collect', n:5, reward:15, text:'¡Qué lindo día de playa! Ayúdame a juntar 5 conchitas 🐚', done:'¡Qué bonitas conchitas!' },
               { type:'visit', at:'sombrilla', r:5, reward:15, text:'Vamos a descansar bajo las sombrillas ⛱️', done:'¡Qué rico el solcito!' },
               { type:'collect', n:8, reward:25, text:'¡Junta 8 conchitas más para mi colección! 🐚', done:'¡Tremenda colección!' },
               { type:'visit', at:'duna', r:2.2, reward:15, text:'🏜️ ¡Sube a la duna más alta! Salta por los escalones.', done:'¡Rey de la duna!' },
             ] },
  espacio: { name:'Luna', radius:34, sky:0x0b1030, fogNear:60, fogFar:140, build:buildEspacio, price:80, stars:40,
             collect:{ emoji:'⭐', make:makeStar, n:10 },
             missions:[
               { type:'collect', n:5, reward:20, text:'¡Estamos en la Luna! 🌙 Recoge 5 estrellitas ⭐', done:'¡Brillantes!' },
               { type:'visit', at:'bandera', r:5, reward:20, text:'Llega hasta la bandera 🚩 que está más allá.', done:'¡Plantaste tu bandera!' },
               { type:'collect', n:8, reward:30, text:'¡Junta 8 estrellitas más! ⭐', done:'¡Eres un astronauta!' },
               { type:'visit', at:'monte', r:2.2, reward:20, text:'🌙 ¡Escala el monte lunar! Con poca gravedad... bueno, igual hay que saltar.', done:'¡En la cima de la Luna!' },
             ] },
};

function pushOut(pos, obstacles, pr, R){
  obstacles.forEach(function(o){
    let dx = pos.x-o.x; const dz = pos.z-o.z;
    if(Math.abs(dx) < 0.03 && Math.abs(dz) < o.r+pr+0.5) dx = 0.03;   // choque de frente: desviar un poco para deslizar por el lado
    const d = Math.hypot(dx,dz), min = o.r+pr;
    if(d < min && d > 0.0001){ pos.x = o.x + dx/d*min; pos.z = o.z + dz/d*min; }
  });
  const d0 = Math.hypot(pos.x,pos.z), lim = R-0.5;
  if(d0 > lim){ pos.x *= lim/d0; pos.z *= lim/d0; }
}

function isUnlocked(id){
  if(id==='pueblo' || id==='casa' || state.world.unlocked.indexOf(id) !== -1) return true;
  const z = ZONES[id];
  return !!(z && z.stars && totalStars() >= z.stars);   // también se abre jugando y ganando estrellas de estudio
}

function travel(dest, visit){
  visiting = (dest === 'casa') ? (visit || null) : null;
  sfx('portal');
  arrivedFrom = currentZone;
  currentZone = dest;
  travelling = true;
  render();
}

export function mundoPortalUnlock(dest){
  const z = ZONES[dest];
  if(!z) return;
  if(!spendCoins(z.price)){
    showToast('Te faltan '+(z.price-state.coins)+' monedas. ¡Estudia para ganar más!');
    return;
  }
  state.world.unlocked.push(dest);
  saveProgress();
  showToast('¡Desbloqueaste: '+z.name+'!');
  travel(dest);
}
export function mundoPortalClose(){
  const el = document.getElementById('mundo-portal');
  if(el) el.classList.add('hidden');
}

export async function initMundo(){
  const myRun = ++runId;
  const wrap = document.getElementById('mundo-wrap');
  const loading = document.getElementById('mundo-loading');
  if(!wrap) return;
  labelList = [];
  const zoneId = currentZone, zone = ZONES[zoneId];
  const visit = (zoneId === 'casa') ? visiting : null;
  const from = arrivedFrom; travelling = false; arrivedFrom = null;
  bonesCollected = 0; missionBones = 0; avatarOpen = false; buildOpen = false; buildHooks = null; talkNpc = null; quiz = null; dialogActions = []; emoteReq = null; lastSpoken = ''; lastShown = '';

  try{
    if(!THREE) THREE = await import(THREE_URL);
  }catch(e){
    if(loading) loading.innerHTML = 'No pudimos cargar el mundo 3D. Revisa tu conexión a internet e inténtalo de nuevo. 🐾';
    return;
  }
  if(myRun !== runId || !document.body.contains(wrap)) return;

  const T = THREE;
  const lowEnd = !!((navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
  let renderer;
  try{
    renderer = new T.WebGLRenderer({ antialias: !lowEnd });
  }catch(e){
    if(loading) loading.textContent = 'Tu dispositivo no puede mostrar el mundo 3D. 🐾';
    return;
  }
  if(loading) loading.remove();
  let pr = Math.min(window.devicePixelRatio||1, lowEnd ? 1.25 : 2);   // celulares modestos: menos píxeles
  renderer.setPixelRatio(pr);
  const canvas = renderer.domElement;
  canvas.className = 'mundo-canvas';
  wrap.insertBefore(canvas, wrap.firstChild);

  let ctxLost = false, ctxTimer = null;
  canvas.addEventListener('webglcontextlost', function(e){
    e.preventDefault(); ctxLost = true;
    showToast('Reconectando el mundo… 🐾');
    clearTimeout(ctxTimer); ctxTimer = setTimeout(function(){ if(ctxLost && myRun === runId) render(); }, 2500);   // si el navegador no lo restaura solo, se reconstruye
  });
  canvas.addEventListener('webglcontextrestored', function(){ clearTimeout(ctxTimer); ctxLost = false; if(myRun === runId) render(); });
  canvas.addEventListener('contextmenu', function(e){ e.preventDefault(); });

  const scene = new T.Scene();
  scene.background = new T.Color(zone.sky);
  scene.fog = new T.Fog(zone.sky, zone.fogNear, zone.fogFar);
  const camera = new T.PerspectiveCamera(62, 1, 0.1, 400);
  const world = zone.build(scene, {
    portalLabel: function(id){
      const z = ZONES[id];
      return isUnlocked(id) ? z.name : ('🔒 '+z.name+' '+z.price);
    },
  });
  const obstacles = world.obstacles;
  const R = zone.radius;
  const platforms = world.platforms || [];
  const hasFloor = zone.floor !== null;
  const spawn = world.spawn || { x:0, y:0, z:0 };
  let vy = 0, grounded = true, jumpHeld = false, coyote = 0;
  function groundAt(x,z,y){
    let g = hasFloor ? 0 : -Infinity;
    for(let i=0;i<platforms.length;i++){
      const p = platforms[i];
      if(Math.abs(x-p.x) < p.hw+0.25 && Math.abs(z-p.z) < p.hd+0.25 && p.top <= y+0.35 && p.top > g) g = p.top;
    }
    return g;
  }
  function blockedAt(px,pz,py){
    for(let i=0;i<platforms.length;i++){
      const p = platforms[i];
      if(Math.abs(px-p.x) < p.hw+0.35 && Math.abs(pz-p.z) < p.hd+0.35 && py < p.top-0.3 && py+1.8 > p.bottom) return true;
    }
    return false;
  }

  // título de zona
  const zname = document.getElementById('mundo-zone');
  if(zname) zname.textContent = visit ? ('Casa de '+visit.name) : zone.name;
  if(visit){ const vl = makeLabel('Casa de '+visit.name, 'rgba(120,60,20,.85)'); vl.position.set(0,5.5,-12); scene.add(vl); }

  const me = buildPerson();
  scene.add(me.root);
  let petView = null, petId = null;
  function rebuildPet(){
    const id = state.world.equipped.pet || null;
    if(id === petId && petView) return;
    if(petView){ scene.remove(petView); petView = null; }
    petId = id;
    if(id){ petView = buildPetModel(id); petView.position.set(me.root.position.x-1.6, me.root.position.y, me.root.position.z+1.6); scene.add(petView); }
  }
  const myOutfitHook = function(){ me.applyOutfit(); rebuildPet(); };
  outfitHook = myOutfitHook;
  const pos = me.root.position;
  if(from && from !== 'pueblo' && zoneId === 'pueblo'){
    const pp = world.portals.filter(function(p){ return p.dest === from; })[0];
    pos.set(pp ? pp.x*0.7 : 0, 0, pp ? pp.z*0.7 : 6);
  }else pos.set(spawn.x, spawn.y, zoneId==='pueblo' ? 7 : spawn.z);
  let heading = 0;
  if(window.__LEO_DEBUG) window.__mundo = { pos:pos, camera:camera };   // gancho solo para pruebas manuales

  // Mi Casa: construcción con bloques y muebles sobre una grilla (cursor delante del personaje)
  const isHome = !!world.house;
  const buildBtn = document.getElementById('mundo-build-btn');
  if(buildBtn) buildBtn.style.display = (isHome && !visit) ? '' : 'none';
  let myBuildHooks = null;
  const placed = new Map();      // ítem guardado -> {mesh, obs}
  const targetCell = { x:0, z:0 };
  let cursor = null;
  function stackCount(x,z){
    return state.world.house.items.filter(function(i){ return i.x===x && i.z===z; }).length;
  }
  function addItemView(it){
    const def = houseItemById(it.t); if(!def) return;
    const m = houseMesh(def); m.position.set(it.x, it.y, it.z); scene.add(m);
    let obs = null;
    if(it.t !== 'f_alfombra'){
      obs = { x:it.x, z:it.z, hw:0.5, hd:0.5, bottom:it.y, top:it.y + (def.kind==='block' ? 1 : 0.85) };
      platforms.push(obs);
    }
    placed.set(it, { mesh:m, obs:obs });
  }
  if(isHome){
    (visit ? visit.items : state.world.house.items).forEach(addItemView);
    cursor = new T.Group();
    cursor.add(new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(1.04,1.04,1.04)), new T.LineBasicMaterial({ color:0xff9f43 })));
    cursor.add(new T.Mesh(new T.BoxGeometry(1.02,1.02,1.02), new T.MeshBasicMaterial({ color:0xffd43b, transparent:true, opacity:0.25 })));
    cursor.visible = false; scene.add(cursor);
    buildHooks = {
      place: function(){
        const h = state.world.house, x = targetCell.x, z = targetCell.z, n = stackCount(x,z);
        if(n >= 4){ showToast('¡Ya no caben más cosas ahí arriba!'); return; }
        if(h.items.length >= HOUSE_MAX_ITEMS){ showToast('Tu casa está llena.'); return; }
        const it = { t:buildType, x:x, y:n, z:z };
        h.items.push(it); addItemView(it); saveProgress(); sfx('place');
      },
      remove: function(){
        const h = state.world.house;
        let top = null;
        h.items.forEach(function(i){ if(i.x===targetCell.x && i.z===targetCell.z && (!top || i.y > top.y)) top = i; });
        if(!top){ showToast('Ahí no hay nada para quitar.'); return; }
        const v = placed.get(top);
        if(v){
          scene.remove(v.mesh);
          if(v.obs){ const k = platforms.indexOf(v.obs); if(k >= 0) platforms.splice(k,1); }
          placed.delete(top);
        }
        h.items.splice(h.items.indexOf(top),1);
        saveProgress(); sfx('remove');
      },
    };
    myBuildHooks = buildHooks;
  }

  // Carboncito, el guía: te sigue y te va dando misiones
  const guide = buildPug();
  guide.root.scale.setScalar(0.7);
  guide.root.position.set(pos.x-2,0,pos.z+2);
  scene.add(guide.root);
  let guideHeading = 0, guideWalk = 0;

  // personajes (NPC) de esta zona
  const npcViews = [];
  Object.keys(NPCS).forEach(function(id){
    const n = NPCS[id];
    if(n.zone !== zoneId) return;
    let v;
    if(n.model){
      const m = n.model === 'octopus' ? buildOctopus() : buildPetModel(n.model);
      m.scale.setScalar(n.model === 'octopus' ? 1 : 3);
      v = { root:m };
    }else v = buildPerson(n.look);
    v.root.position.set(n.x, 0, n.z); v.root.rotation.y = Math.atan2(-n.x, 8-n.z);
    scene.add(v.root);
    const lab = makeLabel(n.name, n.big ? 'rgba(160,40,40,.85)' : 'rgba(20,90,80,.8)'); lab.position.set(n.x, n.big ? 5.6 : 4.0, n.z); scene.add(lab);
    obstacles.push({ x:n.x, z:n.z, r:n.big ? 2.2 : 0.7 });
    npcViews.push({ id:id, x:n.x, z:n.z, v:v, big:!!n.big });
  });
  if(world.board) npcViews.push({ id:'board', x:world.board.x, z:world.board.z, v:{ root:world.board.group }, big:false, board:true });
  if(world.chest) npcViews.push({ id:'chest', x:world.chest.x, z:world.chest.z, v:{ root:world.chest.group }, big:false, chest:true });
  // contrarreloj de la Carrera de Obstáculos: cronómetro desde que sales del inicio, con medallas
  const isObby = zoneId === 'obby';
  const timerPill = document.getElementById('mundo-timer-pill'), timerEl = document.getElementById('mundo-timer');
  if(timerPill) timerPill.style.display = isObby ? '' : 'none';
  let runT0 = null, runDone = false;
  function fmtTime(sec){ const m = Math.floor(sec/60), r = Math.floor(sec%60); return m+':'+(r<10?'0':'')+r; }
  function finishRun(sec){
    runDone = true;
    const w = state.world, prev = w.best.obby;
    const tier = sec <= 70 ? 3 : sec <= 100 ? 2 : sec <= 150 ? 1 : 0;
    const prizes = [0,10,20,40], names = ['Sin medalla','🥉 Bronce','🥈 Plata','🥇 Oro'];
    let gain = 0;
    for(let k = w.medals.obby + 1; k <= tier; k++) gain += prizes[k];
    if(tier > w.medals.obby) w.medals.obby = tier;
    const record = (prev === null || sec < prev);
    if(record) w.best.obby = sec;
    if(gain){ awardCoins(gain); refreshShop(); }
    saveProgress(); sfx('done');
    showDialog('¡Llegaste a la meta! 🏁',
      '<p>Tu tiempo: <b>'+fmtTime(sec)+'</b> '+(record ? '— ¡nuevo récord! ⭐' : '(tu récord: '+fmtTime(w.best.obby)+')')+'</p>'+
      '<p>Medalla: <b>'+names[tier]+'</b>'+(gain ? ' · +'+gain+' monedas' : '')+'</p>'+
      '<p>Medallas: 🥉 150 s o menos · 🥈 100 s · 🥇 70 s. ¡Vuelve al inicio para intentarlo otra vez!</p>', []);
  }
  const talkBtn = document.getElementById('mundo-talk');
  applyPrefsToWrap();
  rebuildPet();
  let emote = null;

  // coleccionables de la zona
  const cz = zone.collect;
  const collectPill = document.getElementById('mundo-collect-pill');
  if(collectPill) collectPill.style.display = cz ? '' : 'none';
  const collectIcon = document.getElementById('mundo-collect-icon');
  if(collectIcon && cz) collectIcon.textContent = cz.emoji;
  const items = [];
  function spawnItem(){
    if(!cz) return;
    for(let tries=0; tries<40; tries++){
      const a = Math.random()*Math.PI*2, d = 5 + Math.random()*(R-9);
      const p = { x:Math.cos(a)*d, z:Math.sin(a)*d };
      if(obstacles.every(function(o){ return Math.hypot(p.x-o.x,p.z-o.z) > o.r+1.2; }) &&
         items.every(function(it){ return Math.hypot(p.x-it.position.x,p.z-it.position.z) > 4.5; }) &&
         Math.hypot(p.x-pos.x,p.z-pos.z) > 5){
        const b = cz.make(); b.position.set(p.x,1,p.z); scene.add(b); items.push(b); return;
      }
    }
  }
  if(cz) for(let i=0;i<cz.n;i++) spawnItem();

  // misiones
  const guideBox = document.getElementById('mundo-guide-text');
  let customText = null;
  const missions = zone.missions || [];
  function mIndex(){ return state.world.missions[zoneId] || 0; }
  function missionText(){
    const carry = carryText();
    const helloTxt = visit ? ('Estás de visita en la casa de '+visit.name+' 🏠 ¡Mira cómo la decoró! Aquí no se puede construir.') : zone.hello;
    if(helloTxt) return helloTxt + (zoneId === 'pueblo' ? seasonHello() : '') + (carry ? ' '+carry : '');
    const m = missions[mIndex()];
    if(!m) return 'Completaste las misiones de este lugar 🎉 ¡Habla con la gente o vuelve al pueblo! 🐾'+(carryText() ? ' '+carryText() : '');
    return m.text + (m.type==='collect' ? ' ('+Math.min(missionBones,m.n)+'/'+m.n+')' : '') + (carryText() ? ' '+carryText() : '');
  }
  function refreshGuide(){
    if(!guideBox) return;
    const txt = customText || missionText();
    guideBox.textContent = txt;
    maybeSpeakGuide(txt);
    const gEl = document.getElementById('mundo-guide'), shownKey = txt.replace(/\(\d+\/\d+\)/g,'').trim();
    if(gEl && shownKey !== lastShown){
      lastShown = shownKey; gEl.classList.remove('collapsed');
      clearTimeout(guideTimer); guideTimer = setTimeout(function(){ gEl.classList.add('collapsed'); }, 7000);
    }
  }
  const myGuideSay = function(txt){ customText = txt; refreshGuide(); };
  guideSay = myGuideSay;
  if(!state.world.avatar.created){
    customText = '¡Hola'+(state.userName?', '+state.userName:'')+'! Soy Carboncito 🐾 Primero crea tu personaje y toca ¡Listo!';
    setTimeout(function(){ if(myRun===runId) mundoToggleAvatar(); }, 400);
  }
  refreshGuide();

  function completeMission(){
    const m = missions[mIndex()];
    if(!m) return;
    awardCoins(m.reward); sfx('done');
    state.world.missions[zoneId] = mIndex() + 1;
    missionBones = 0;
    saveProgress();
    showToast(m.done+' +'+m.reward+' monedas');
    refreshShop();
    customText = null; refreshGuide();
  }

  // tamaño
  let vw = 1, vh = 1;
  function resize(){
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if(!w || !h) return;
    vw = w; vh = h;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize); ro.observe(wrap);

  // celular en horizontal: el mundo pasa solo a pantalla completa (la página no alcanza para nada más)
  const landscapeMQ = window.matchMedia('(max-height:520px) and (orientation:landscape)');
  function syncOrientation(){ setFull(wantFull || landscapeMQ.matches); }
  syncOrientation();
  if(landscapeMQ.addEventListener) landscapeMQ.addEventListener('change', syncOrientation);

  // entrada: teclado
  const keys = {};
  function onKey(e, down){
    const k = e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','q','e'].indexOf(k) !== -1){
      keys[k] = down;
      if(e.target===document.body || e.target===document.documentElement) e.preventDefault();
    }
  }
  const kd = function(e){
    if(e.key === ' '){ jumpHeld = true; if(e.target===document.body || e.target===document.documentElement) e.preventDefault(); }
    onKey(e,true);
    if(isHome && buildOpen && !e.repeat){
      const k = e.key.toLowerCase();
      if(k==='e') buildHooks.place(); else if(k==='q') buildHooks.remove();
    }
    if(e.key.toLowerCase() === 'f' && !e.repeat && talkNpc) mundoTalk();
  }, ku = function(e){ if(e.key === ' ') jumpHeld = false; onKey(e,false); };
  window.addEventListener('keydown',kd); window.addEventListener('keyup',ku);

  // cámara orbital en tercera persona (como Roblox): arrastrar gira, rueda / pellizco acerca
  let camYaw = 0, camPitch = 0.42, camDist = 12;
  let viewYaw = 0, viewPitch = 0.42, viewDist = 12, camF = 1;
  if(window.__LEO_DEBUG && window.__mundo) window.__mundo.view = function(d,pt){ camDist = d; camPitch = pt; viewDist = d; viewPitch = pt; };   // solo pruebas: vista aérea
  let pinchD = null;
  const camPtrs = new Map();
  function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }

  // entrada táctil/mouse sobre el mundo: izquierda = joystick flotante, derecha = cámara
  const joy = document.getElementById('mundo-joy'), knob = document.getElementById('mundo-knob');
  const joyVec = { x:0, y:0 };
  let joyId = null, joyCx = 0, joyCy = 0, joyT0 = 0, jumpT0 = 0;
  function joyUpdate(e){
    const max = 50;
    let dx = e.clientX-joyCx, dy = e.clientY-joyCy;
    const d = Math.hypot(dx,dy);
    if(d > max){ dx = dx/d*max; dy = dy/d*max; }
    knob.style.transform = 'translate('+dx+'px,'+dy+'px)';
    joyVec.x = dx/max; joyVec.y = dy/max;
  }
  function joyEnd(){
    joyId = null; joyVec.x = 0; joyVec.y = 0; knob.style.transform = 'translate(0,0)';
    joy.classList.remove('active'); joy.style.left = ''; joy.style.top = ''; joy.style.bottom = '';
  }
  canvas.addEventListener('pointerdown', function(e){
    closePopovers();
    try{ canvas.setPointerCapture(e.pointerId); }catch(err){}
    const r = wrap.getBoundingClientRect(), px = e.clientX-r.left, py = e.clientY-r.top;
    if(e.pointerType === 'touch' && joyId === null && px < r.width*0.5){
      joyId = e.pointerId; joyT0 = performance.now(); joyCx = e.clientX; joyCy = e.clientY;
      joy.style.left = (px-60)+'px'; joy.style.top = (py-60)+'px'; joy.style.bottom = 'auto';
      joy.classList.add('active'); joyUpdate(e);
    }else{
      camPtrs.set(e.pointerId, { x:e.clientX, y:e.clientY });
    }
  });
  canvas.addEventListener('pointermove', function(e){
    if(e.pointerId === joyId){ joyUpdate(e); return; }
    const c = camPtrs.get(e.pointerId); if(!c) return;
    if(camPtrs.size === 2){
      const pts = Array.from(camPtrs.values());
      const nx = e.clientX, ny = e.clientY;
      const other = pts[0] === c ? pts[1] : pts[0];
      const d = Math.hypot(nx-other.x, ny-other.y);
      if(pinchD) camDist = clamp(camDist * pinchD / d, 5, 24);
      pinchD = d;
    }else{
      camYaw -= (e.clientX-c.x)*0.008;
      camPitch = clamp(camPitch + (e.clientY-c.y)*0.006, 0.08, 1.25);
    }
    c.x = e.clientX; c.y = e.clientY;
  });
  function ptrEnd(e){
    if(e.pointerId === joyId) joyEnd();
    camPtrs.delete(e.pointerId);
    if(camPtrs.size < 2) pinchD = null;
  }
  canvas.addEventListener('pointerup', ptrEnd);
  canvas.addEventListener('pointercancel', ptrEnd);
  canvas.addEventListener('wheel', function(e){ e.preventDefault(); camDist = clamp(camDist + e.deltaY*0.012, 5, 24); }, { passive:false });

  let jumpPtr = null;
  const jumpBtn = document.getElementById('mundo-jump');
  if(jumpBtn){
    jumpBtn.addEventListener('pointerdown', function(e){ jumpHeld = true; jumpPtr = e.pointerId; jumpT0 = performance.now(); e.preventDefault(); });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){ jumpBtn.addEventListener(ev, function(){ jumpHeld = false; jumpPtr = null; }); });
  }

  /* Redes de seguridad contra el "personaje pegado que camina solo" en celular: si el navegador pierde un
     "levantar el dedo" (gesto del sistema, notificación, cambiar de app, dedo fuera de pantalla), el joystick
     o el salto quedaban activos para siempre. Ahora se sueltan todos los controles en cualquiera de estos casos. */
  let touchCount = 0, touchSeen = false;
  function releaseTouch(){ joyEnd(); camPtrs.clear(); pinchD = null; if(jumpPtr !== null){ jumpHeld = false; jumpPtr = null; } }
  function releaseAll(){ releaseTouch(); jumpHeld = false; Object.keys(keys).forEach(function(k){ keys[k] = false; }); }
  const onTouchStart = function(e){ touchSeen = true; touchCount = e.touches ? e.touches.length : 0; };
  const onTouchEnd = function(e){ touchCount = e.touches ? e.touches.length : 0; if(touchCount === 0) releaseTouch(); };
  const onWinPointerEnd = function(e){
    if(e.pointerId === joyId) joyEnd();
    if(e.pointerId === jumpPtr){ jumpHeld = false; jumpPtr = null; }
    camPtrs.delete(e.pointerId); if(camPtrs.size < 2) pinchD = null;
  };
  const onVisibility = function(){ if(document.hidden) releaseAll(); };
  window.addEventListener('touchstart', onTouchStart, { passive:true });
  window.addEventListener('touchend', onTouchEnd, { passive:true });
  window.addEventListener('touchcancel', onTouchEnd, { passive:true });
  window.addEventListener('pointerup', onWinPointerEnd);
  window.addEventListener('pointercancel', onWinPointerEnd);
  window.addEventListener('blur', releaseAll);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('lostpointercapture', onWinPointerEnd);

  // mantener la pantalla encendida mientras se juega (Android/iOS 16.4+)
  let wakeLock = null;
  async function takeWake(){
    try{ if(navigator.wakeLock && !document.hidden && !wakeLock){ wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', function(){ wakeLock = null; }); } }catch(e){}
  }
  const onWakeVis = function(){ if(!document.hidden) takeWake(); };
  takeWake(); document.addEventListener('visibilitychange', onWakeVis);
  // Safari ignora user-scalable=no: se bloquean los gestos de zoom de página mientras se juega
  const noGesture = function(e){ e.preventDefault(); };
  ['gesturestart','gesturechange','gestureend'].forEach(function(g){ document.addEventListener(g, noGesture); });
  // botón/gesto Atrás del dispositivo: primero cierra paneles y diálogos, recién después sale del mundo
  setBackHook(function(){
    let h = false;
    const d = dialogEl(); if(d && !d.classList.contains('hidden')){ mundoDialogClose(); h = true; }
    const pf = document.getElementById('pf-overlay'); if(pf){ pf.remove(); h = true; }
    ['mundo-emotes','mundo-settings','mundo-portal'].forEach(function(id){ const e = document.getElementById(id); if(e && !e.classList.contains('hidden')){ e.classList.add('hidden'); h = true; } });
    if(avatarOpen){ mundoAvatarDone(); h = true; }
    if(buildOpen){ closeBuild(); h = true; }
    if(!h && wantFull && wrap.classList.contains('mundo-full') && !landscapeMQ.matches){ wantFull = false; setFull(false); h = true; }
    return h;
  });

  function respawn(){
    pos.set(spawn.x, spawn.y, spawn.z); vy = 0; grounded = true;
    guide.root.position.set(spawn.x-1.5, spawn.y, spawn.z+1.5);
    showToast('¡Sigue intentando! 💪');
  }

  // música ambiente suave (escala pentatónica distinta por mundo); solo suena si el navegador ya permitió audio
  const scale = MUSIC_SCALES[zoneId] || MUSIC_SCALES.pueblo;
  let beat = 0;
  const musicTimer = setInterval(function(){
    if(myRun !== runId || !soundOn || document.hidden || !audioRunning()) return;
    const f = scale[Math.floor(Math.random()*scale.length)] * (Math.random() < 0.2 ? 0.5 : 1);
    playBeep(f, 0.9, 0, 0.035, 'triangle');
    if(beat % 4 === 0) playBeep(scale[0]/2, 1.7, 0, 0.045, 'sine');
    beat++;
  }, 650);

  function cleanup(){
    document.removeEventListener('visibilitychange', onWakeVis);
    ['gesturestart','gesturechange','gestureend'].forEach(function(g){ document.removeEventListener(g, noGesture); });
    if(wakeLock){ try{ wakeLock.release(); }catch(e){} wakeLock = null; }
    if(myRun === runId) setBackHook(null);
    window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('pointerup', onWinPointerEnd); window.removeEventListener('pointercancel', onWinPointerEnd);
    window.removeEventListener('blur', releaseAll); document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('keydown',kd); window.removeEventListener('keyup',ku);
    ro.disconnect(); renderer.dispose();
    if(landscapeMQ.removeEventListener) landscapeMQ.removeEventListener('change', syncOrientation);
    if(!travelling && myRun === runId){ visiting = null; wantFull = false; document.body.classList.remove('mundo-fs'); }
    if(outfitHook === myOutfitHook) outfitHook = null;
    clearInterval(musicTimer);
    if(guideSay === myGuideSay) guideSay = null;
    if(myBuildHooks && buildHooks === myBuildHooks) buildHooks = null;
    if(myRun === runId) talkNpc = null;
    if(!travelling && myRun === runId) currentZone = 'pueblo';  // al salir del juego, la próxima vez se empieza en el pueblo
  }

  const labelV = new T.Vector3();
  let slowFrames = 0;
  let portalBlocked = null;   // portal cuyo aviso ya se mostró (se rearma al alejarse)
  const clock = new T.Clock();
  let walk = 0;
  function frame(){
    if(myRun !== runId || !document.body.contains(wrap)){ cleanup(); return; }
    requestAnimationFrame(frame);
    const rawDt = clock.getDelta(), dt = Math.min(rawDt, 0.05), t = clock.elapsedTime;
    // resolución adaptable: si va lento sostenidamente (< ~22 fps), baja la resolución en vez de trabarse
    if(rawDt > 0.045 && rawDt < 0.5) slowFrames++; else if(slowFrames > 0) slowFrames--;
    if(slowFrames > 60 && pr > 0.8){ pr = Math.max(0.75, pr - 0.35); renderer.setPixelRatio(pr); resize(); slowFrames = 0; }

    if(touchSeen && touchCount === 0 && ((joyId !== null && performance.now()-joyT0 > 200) || (jumpPtr !== null && performance.now()-jumpT0 > 200))) releaseTouch();   // vigilante: no hay dedos, no debe haber controles activos

    // dirección deseada (arriba = hacia el norte, -z)
    let ix = (keys['arrowright']||keys['d']?1:0) - (keys['arrowleft']||keys['a']?1:0);
    let iz = (keys['arrowdown']||keys['s']?1:0) - (keys['arrowup']||keys['w']?1:0);
    ix += joyVec.x; iz += joyVec.y;
    if(!buildOpen){ if(keys['q']) camYaw += 1.9*dt; if(keys['e']) camYaw -= 1.9*dt; }
    const mag = Math.min(1, Math.hypot(ix,iz));
    const moving = mag > 0.12;
    if(moving){
      const speed = 7.5*mag;
      const hh = Math.hypot(ix,iz), sy = Math.sin(viewYaw), cyw = Math.cos(viewYaw);
      const nx = (cyw*ix + sy*iz)/hh, nz = (-sy*ix + cyw*iz)/hh;   // "adelante" = hacia donde mira la cámara
      const mx = pos.x + nx*speed*dt, mz = pos.z + nz*speed*dt;
      if(!blockedAt(mx,pos.z,pos.y)) pos.x = mx;
      if(!blockedAt(pos.x,mz,pos.y)) pos.z = mz;
      pushOut(pos, obstacles, 0.6, R);
      const target = Math.atan2(nx,nz);
      let diff = target-heading;
      while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
      heading += diff*Math.min(1, dt*12);
      me.root.rotation.y = heading;
      walk += dt*10*mag;
    }
    // física vertical: gravedad, salto y plataformas
    if(grounded) coyote = 0.12; else coyote -= dt;   // tiempo de gracia para saltar justo al salir del borde
    if(jumpHeld && coyote > 0){ vy = 11; grounded = false; coyote = 0; sfx('jump'); }
    const py0 = pos.y;
    vy -= 28*dt; pos.y += vy*dt;
    const gy = groundAt(pos.x,pos.z,py0);
    if(pos.y <= gy && vy <= 0){ pos.y = gy; vy = 0; grounded = true; } else grounded = false;
    if(pos.y < -12) respawn();

    // brazos y piernas
    const sw = (moving && grounded) ? Math.sin(walk)*0.8 : 0;
    me.legs[0].rotation.x = sw; me.legs[1].rotation.x = -sw;
    const idle = (!moving && grounded) ? Math.sin(t*1.6)*0.05 : 0;
    me.arms[0].rotation.x = grounded ? -sw+idle : -2.6; me.arms[1].rotation.x = grounded ? sw-idle : -2.6;
    me.body.position.y = moving ? Math.abs(Math.sin(walk))*0.06 : 0;

    // Carboncito sigue a la persona
    const gdx = pos.x-guide.root.position.x, gdz = pos.z-guide.root.position.z;
    const gd = Math.hypot(gdx,gdz);
    const gMoving = gd > 3.2;
    if(gMoving){
      const gs = Math.min(9, 3 + (gd-3.2)*2.5);
      guide.root.position.x += gdx/gd*gs*dt; guide.root.position.z += gdz/gd*gs*dt;
      pushOut(guide.root.position, obstacles, 0.5, R);
      guideWalk += dt*14;
    }
    if(gd > 0.5){
      const gt = Math.atan2(gdx,gdz);
      let gdiff = gt-guideHeading;
      while(gdiff>Math.PI) gdiff-=Math.PI*2; while(gdiff<-Math.PI) gdiff+=Math.PI*2;
      guideHeading += gdiff*Math.min(1, dt*8);
      guide.root.rotation.y = guideHeading;
    }
    const gsw = gMoving ? Math.sin(guideWalk)*0.7 : 0;
    guide.root.position.y += (pos.y - guide.root.position.y)*Math.min(1,dt*6);
    guide.legs[0].rotation.x = gsw; guide.legs[3].rotation.x = gsw;
    guide.legs[1].rotation.x = -gsw; guide.legs[2].rotation.x = -gsw;
    guide.body.position.y = gMoving ? Math.abs(Math.sin(guideWalk))*0.08 : 0;
    guide.tail.rotation.y = Math.sin(t*(gMoving?14:6))*0.6;

    // coleccionables: siempre hay cz.n en el mapa
    for(let i=items.length-1;i>=0;i--){
      const b = items[i];
      b.rotation.y = t*2; b.position.y = 1+Math.sin(t*3+i)*0.15;
      if(Math.hypot(b.position.x-pos.x, b.position.z-pos.z) < 1.3){
        scene.remove(b); items.splice(i,1); spawnItem(); sfx('coin');
        bonesCollected++; missionBones++;
        const el = document.getElementById('mundo-bones'); if(el) el.textContent = bonesCollected;
        const m = missions[mIndex()];
        if(m && m.type==='collect'){
          if(missionBones >= m.n) completeMission(); else refreshGuide();
        }
      }
    }

    // misión de visitar un lugar
    const vm = missions[mIndex()];
    if(vm && vm.type==='visit'){
      const at = world.visits[vm.at];
      if(at && Math.hypot(pos.x-at.x, pos.z-at.z) < vm.r && (at.y == null || Math.abs(pos.y-at.y) < 1.6)) completeMission();
    }

    // gestos
    if(emoteReq){ emote = { name:emoteReq, t0:t }; emoteReq = null; }
    me.arms[0].rotation.z = 0; me.arms[1].rotation.z = 0; me.body.rotation.z = 0;
    if(emote){
      const et = t - emote.t0;
      if(moving || !grounded || et > 3){ emote = null; me.root.rotation.y = heading; }
      else if(emote.name === 'wave'){
        me.arms[1].rotation.z = 2.7; me.arms[1].rotation.x = 0; me.arms[1].rotation.z += Math.sin(et*11)*0.35;
      }else if(emote.name === 'cheer'){
        me.arms[0].rotation.z = -2.8; me.arms[1].rotation.z = 2.8; me.arms[0].rotation.x = me.arms[1].rotation.x = 0;
        me.body.position.y = Math.abs(Math.sin(et*8))*0.35;
      }else if(emote.name === 'dance'){
        me.body.rotation.z = Math.sin(et*7)*0.14; me.body.position.y = Math.abs(Math.sin(et*7))*0.14;
        me.arms[0].rotation.z = -1.6 - Math.sin(et*7)*0.9; me.arms[1].rotation.z = 1.6 - Math.sin(et*7)*0.9;
        me.legs[0].rotation.x = Math.sin(et*7)*0.7; me.legs[1].rotation.x = -Math.sin(et*7)*0.7;
      }else if(emote.name === 'spin'){
        me.root.rotation.y = heading + et*9; me.arms[0].rotation.z = -1.5; me.arms[1].rotation.z = 1.5;
      }
    }

    // personajes: idle y cercanía para hablar
    let nearest = null, nd = 3.4;
    npcViews.forEach(function(n){
      if(n.v.arms){ n.v.arms[0].rotation.x = Math.sin(t*1.5 + n.x)*0.06; n.v.arms[1].rotation.x = -Math.sin(t*1.5 + n.x)*0.06; }
      else if(!n.chest && !n.board) n.v.root.position.y = Math.abs(Math.sin(t*2 + n.x))*0.25;
      else if(n.chest){ world.chest.star.rotation.y = t*2; world.chest.star.position.y = 2.0 + Math.sin(t*3)*0.12; world.chest.star.visible = canClaimChest(); }
      const d = Math.hypot(pos.x-n.x, pos.z-n.z) - (n.big ? 2.2 : 0);
      if(d < nd && Math.abs(pos.y) < 2){ nd = d; nearest = n.id; }
    });
    if(nearest !== talkNpc){
      talkNpc = nearest;
      if(talkBtn){ talkBtn.classList.toggle('hidden', !nearest); talkBtn.textContent = nearest === 'chest' ? '🎁 Abrir cofre' : nearest === 'board' ? '📋 Ver tablero' : '💬 Hablar'; }
      if(!nearest){ const dl = dialogEl(); if(dl && !quiz) { dl.classList.add('hidden'); dialogActions = []; const wr3 = document.getElementById('mundo-wrap'); if(wr3) wr3.classList.remove('dialog-open'); } }
    }

    // mascota: te sigue por detrás a la derecha y salta un poquito al caminar
    if(petView){
      const dx0 = Math.sin(heading), dz0 = Math.cos(heading);
      const tx = pos.x - dx0*1.9 + dz0*1.2, tz = pos.z - dz0*1.9 - dx0*1.2;
      const pdx = tx - petView.position.x, pdz = tz - petView.position.z, pd = Math.hypot(pdx,pdz);
      if(pd > 14){ petView.position.set(tx, pos.y, tz); }
      else if(pd > 0.25){
        const sp = Math.min(10, 3 + pd*3);
        petView.position.x += pdx/pd*sp*dt; petView.position.z += pdz/pd*sp*dt;
        petView.rotation.y += ((Math.atan2(pdx,pdz)) - petView.rotation.y) * Math.min(1, dt*8);
      }
      const hop = pd > 0.4 ? Math.abs(Math.sin(t*12))*0.18 : 0;
      petView.position.y += ((pos.y + hop) - petView.position.y) * Math.min(1, dt*10);
    }

    if(isObby){
      if(runT0 === null && !runDone && pos.z < -5) runT0 = t;
      if(pos.z > -2 && pos.y < 1 && (runT0 !== null || runDone)){ runT0 = null; runDone = false; if(timerEl) timerEl.textContent = '0:00'; }
      if(runT0 !== null && !runDone){
        if(timerEl) timerEl.textContent = fmtTime(t - runT0);
        const mt = world.visits.meta;
        if(mt && Math.hypot(pos.x-mt.x, pos.z-mt.z) < 4 && Math.abs(pos.y-mt.y) < 1.6) finishRun(t - runT0);
      }
    }

    // puntos de control del obby
    if(world.checkpoints){
      world.checkpoints.forEach(function(c){
        if((spawn.x !== c.x || spawn.z !== c.z) && Math.hypot(pos.x-c.x,pos.z-c.z) < 2.4 && Math.abs(pos.y-c.top) < 1){
          spawn.x = c.x; spawn.y = c.top; spawn.z = c.z;
          showToast('🚩 ¡Punto de control!');
        }
      });
    }

    if(world.tick) world.tick(t);

    // portales
    world.portals.forEach(function(p){
      p.disc.rotation.z = t*1.5;
      p.disc.material.opacity = 0.6 + Math.sin(t*3)*0.15;
      const d = Math.hypot(pos.x-p.x, pos.z-p.z);
      if(d > 4.5 && portalBlocked === p) portalBlocked = null;
      if(d < 3 && portalBlocked !== p && !travelling){
        if(isUnlocked(p.dest)){ travel(p.dest); }
        else{
          portalBlocked = p;
          const z = ZONES[p.dest], el = document.getElementById('mundo-portal');
          if(el){
            el.innerHTML = '<b>'+z.name+'</b><p>Este lugar está bloqueado 🔒</p>'+(z.stars ? '<p class="portal-or">Se abre solo con <b>'+z.stars+' ⭐</b> ganadas estudiando en LEO (llevas '+totalStars()+'), o con monedas:</p>' : '')+
              '<button class="av-done" onclick="mundoPortalUnlock(\''+p.dest+'\')">Desbloquear por <span class="coin-ic"></span> '+z.price+'</button>'+
              '<button class="av-chip" onclick="mundoPortalClose()">Ahora no</button>';
            el.classList.remove('hidden');
          }
        }
      }
    });

    // Mi Casa: cursor de construcción delante del personaje
    if(cursor){
      cursor.visible = buildOpen;
      if(buildOpen){
        const L = HOUSE_LIMIT;
        const tx = Math.max(-L, Math.min(L, Math.round(pos.x + Math.sin(heading)*1.7)));
        const tz = Math.max(-L, Math.min(L, Math.round(pos.z + Math.cos(heading)*1.7)));
        targetCell.x = tx; targetCell.z = tz;
        cursor.position.set(tx, stackCount(tx,tz)+0.5, tz);
      }
    }

    // cámara orbital: detrás del personaje; con el panel de avatar abierto pasa al frente y se acerca
    let wantYaw = camYaw, wantPitch = camPitch, wantDist = camDist * (camera.aspect < 0.8 ? 1.2 : 1), lookY = 1.6;
    if(avatarOpen){ wantYaw = heading; wantPitch = 0.12; wantDist = camera.aspect < 0.8 ? 10.5 : 8; lookY = -0.2; }
    else if(buildOpen){ lookY = -0.4; }
    let dyaw = wantYaw - viewYaw;
    while(dyaw > Math.PI) dyaw -= Math.PI*2; while(dyaw < -Math.PI) dyaw += Math.PI*2;
    const k = Math.min(1, dt*(avatarOpen ? 5 : 14));
    viewYaw += dyaw*k; viewPitch += (wantPitch-viewPitch)*k; viewDist += (wantDist-viewDist)*Math.min(1,dt*6);
    const cp = Math.cos(viewPitch);
    const tx0 = pos.x, ty0 = pos.y + 1.6, tz0 = pos.z;
    let rdx = Math.sin(viewYaw)*viewDist*cp, rdy = Math.sin(viewPitch)*viewDist, rdz = Math.cos(viewYaw)*viewDist*cp;
    // la cámara no atraviesa bloques: si uno se interpone, se acerca al personaje (y vuelve despacio)
    let tHit = 1;
    for(let i=0;i<platforms.length;i++){
      const p = platforms[i];
      const mins = [p.x-p.hw-0.35, p.bottom-0.35, p.z-p.hd-0.35], maxs = [p.x+p.hw+0.35, p.top+0.35, p.z+p.hd+0.35];
      const o = [tx0,ty0,tz0], dd = [rdx,rdy,rdz];
      let tmin = 0, tmax = 1, ok = true;
      for(let k2=0;k2<3;k2++){
        if(Math.abs(dd[k2]) < 1e-6){ if(o[k2] < mins[k2] || o[k2] > maxs[k2]){ ok = false; break; } }
        else{
          let t1 = (mins[k2]-o[k2])/dd[k2], t2 = (maxs[k2]-o[k2])/dd[k2];
          if(t1 > t2){ const tt = t1; t1 = t2; t2 = tt; }
          tmin = Math.max(tmin,t1); tmax = Math.min(tmax,t2);
          if(tmin > tmax){ ok = false; break; }
        }
      }
      if(ok && tmin > 0 && tmin < tHit) tHit = tmin;
    }
    const camLen = Math.max(0.01, Math.hypot(rdx,rdy,rdz));
    const wantF = tHit < 1 ? Math.max(1.3/camLen, tHit-0.04) : 1;   // distancia mínima absoluta: nunca queda detrás del bloque
    camF = wantF < camF ? wantF : camF + (wantF-camF)*Math.min(1, dt*3);
    let ccy = ty0 + rdy*camF;
    if(hasFloor && ccy < 0.4) ccy = 0.4;
    camera.position.set(tx0 + rdx*camF, ccy, tz0 + rdz*camF);
    camera.lookAt(pos.x, pos.y + lookY, pos.z);
    me.root.visible = (camLen*camF) > 2.2;   // cámara pegada al personaje (bloque detrás): se oculta, como en Roblox
    // carteles: tamaño casi constante en pantalla (ni gigantes de cerca ni invisibles de lejos)
    for(let li=0; li<labelList.length; li++){
      const lb = labelList[li]; lb.getWorldPosition(labelV);
      const ls = Math.max(1.5, Math.min(4.6, camera.position.distanceTo(labelV)*0.17));
      lb.scale.set(ls, ls*0.25, 1);
    }
    const panelOpen = avatarOpen || buildOpen;
    if(panelOpen && landscapeMQ.matches) camera.setViewOffset(vw, vh, vw*0.24, 0, vw, vh);              // panel lateral: el personaje queda a la izquierda
    else if(panelOpen && vh > vw) camera.setViewOffset(vw, vh, 0, vh*(avatarOpen ? 0.2 : 0.12), vw, vh);   // panel inferior: el personaje sube
    else if(camera.view && camera.view.enabled) camera.clearViewOffset();

    if(!ctxLost) renderer.render(scene,camera);
  }
  camera.position.set(pos.x, pos.y+6, pos.z+12);
  frame();
}

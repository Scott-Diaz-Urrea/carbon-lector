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
import { state, showToast, spendCoins, awardCoins } from '../state.js';
import { saveProgress } from '../persistence.js';
import { render } from '../render.js';
import { MUNDO_ITEMS, AVATAR_SLOTS, itemsBySlot, cssOf, itemById, AVATAR_TONES, AVATAR_HAIRS, AVATAR_HAIR_COLORS, hexCss, HOUSE_ITEMS, houseItemById, HOUSE_LIMIT, HOUSE_MAX_ITEMS } from '../content/mundoItems.js';

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

let currentZone = 'pueblo';  // zona actual (se reinicia al pueblo al salir del juego)
let arrivedFrom = null;      // de qué zona se viajó (para aparecer junto a su portal)
let travelling = false;      // true mientras se cambia de zona (evita reiniciar el pueblo)

export function renderMundoScreen(){
  return '<div class="screen mundo-screen">'+
    '<div class="mundo-wrap" id="mundo-wrap">'+
      '<div class="mundo-loading" id="mundo-loading">Cargando el mundo… 🐾</div>'+
      '<div class="mundo-hud">'+
        '<div class="pill coinpill"><span class="coin-ic"></span><span id="mundo-coins">'+state.coins+'</span></div>'+
        '<div class="pill" id="mundo-collect-pill"><span id="mundo-collect-icon">🦴</span> <span id="mundo-bones">0</span></div>'+
        '<button class="mundo-shop-btn" id="mundo-build-btn" style="display:none" onclick="mundoToggleBuild()">🔨 Construir</button>'+
        '<button class="mundo-shop-btn alone" onclick="mundoToggleAvatar()">👤 Avatar</button>'+
        '<button class="mundo-shop-btn alone mundo-fs-btn" onclick="mundoToggleFull()" aria-label="Pantalla completa">⛶</button>'+
      '</div>'+
      '<div class="mundo-guide" id="mundo-guide"><span class="guide-face">🐾</span><span><b id="mundo-zone"></b><br><span id="mundo-guide-text"></span></span></div>'+
      '<div class="mundo-joy" id="mundo-joy"><div class="mundo-knob" id="mundo-knob"></div></div>'+
      '<button class="mundo-jump" id="mundo-jump" aria-label="Saltar">⤒<small>Saltar</small></button>'+
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
  return '<button class="shop-card'+(equipped?' equipped':'')+'" onclick="mundoItemClick(\''+it.id+'\')">'+prev+'<b>'+it.label+'</b>'+status+'</button>';
}

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
    const list = itemsBySlot(avatarTab);
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
export function mundoToggleFull(){
  const wrap = document.getElementById('mundo-wrap');
  if(!wrap) return;
  const on = !wrap.classList.contains('mundo-full');
  wrap.classList.toggle('mundo-full', on);
  document.body.classList.toggle('mundo-fs', on);
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
      showToast('¡Compraste '+it.label+'!');
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
    showToast('¡Desbloqueaste: '+it.label+'!');
    refreshShop();
  }
  buildType = id;
  refreshBuild();
}
export function mundoBuildPlace(){ if(buildHooks) buildHooks.place(); }
export function mundoBuildRemove(){ if(buildHooks) buildHooks.remove(); }

/* ---------- Persona (avatar de bloques) ---------- */
function buildPerson(){
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
  };

  function applyOutfit(){
    const av = state.world.avatar, eq = state.world.equipped;
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
function makeLabel(text, bg){
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = bg || 'rgba(0,0,0,.65)';
  g.beginPath(); g.roundRect ? g.roundRect(4,4,248,56,18) : g.rect(4,4,248,56); g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 128, 34);
  const tex = new THREE.CanvasTexture(c);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map:tex, transparent:true }));
  sp.scale.set(4.4,1.1,1);
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
  // casas
  const roofCols = [0xd94f4f,0x4f7bd9,0xe0a030,0x8a5ad9,0x3fae6b,0xd9548a];
  [[-22,-10],[22,-10],[-24,10],[24,10],[-12,24],[12,24]].forEach(function(p,i){
    const h = new T.Group();
    const body = new T.Mesh(new T.BoxGeometry(5,3,5), mat(0xf4e4c1)); body.position.y = 1.5; h.add(body);
    const roof = new T.Mesh(new T.ConeGeometry(4.3,2.4,4), mat(roofCols[i])); roof.position.y = 4.2; roof.rotation.y = Math.PI/4; h.add(roof);
    const door = new T.Mesh(new T.BoxGeometry(1,1.8,0.1), mat(0x7a4a22)); door.position.set(0,0.9,2.55); h.add(door);
    h.position.set(p[0],0,p[1]); h.rotation.y = Math.atan2(-p[0],-p[1]); scene.add(h);
    obstacles.push({ x:p[0], z:p[1], r:3.4 });
  });
  // árboles del borde
  let n = 0, guard = 0;
  while(n < 16 && guard++ < 200){
    const a = rnd()*Math.PI*2, d = 30 + rnd()*7;
    addTree(scene, obstacles, Math.cos(a)*d, Math.sin(a)*d, 0.9+rnd()*0.6, 0x2f9e44, 0x40c057); n++;
  }
  // portales
  const portals = [
    addPortal(scene, obstacles, 0, -16, 0x2fb344, ctx.portalLabel('bosque'), 'bosque'),
    addPortal(scene, obstacles, 16, 0, 0xf7c948, ctx.portalLabel('playa'), 'playa'),
    addPortal(scene, obstacles, -16, 0, 0x9b59d0, ctx.portalLabel('espacio'), 'espacio'),
    addPortal(scene, obstacles, 11, -11, 0xff9f43, '🏠 Mi Casa', 'casa'),
    addPortal(scene, obstacles, 11, 11, 0xff5a1f, ctx.portalLabel('obby'), 'obby'),
  ];
  addFence(scene, 38);
  addLights(scene, 0xffffff, 0x88aa66, 0.9);
  return { obstacles:obstacles, portals:portals, visits:{} };
}

/* ----- Bosque ----- */
function buildBosque(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(2026);
  discOnGround(scene, 44, 0x7ed957);
  const pond = discOnGround(scene, 5, 0x4fb4f2, 12, -9, 0.03);
  obstacles.push({ x:12, z:-9, r:5.3 });
  discOnGround(scene, 4, 0xd9b77a, 0, 0, 0.02);
  let placed = 0, guard = 0;
  while(placed < 34 && guard++ < 500){
    const a = rnd()*Math.PI*2, d = 7 + rnd()*29;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x-12,z+9) < 8 || Math.hypot(x,z+18) < 6) continue;
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
  addFence(scene, 38);
  addLights(scene, 0xffffff, 0x88aa66, 0.85);
  return { obstacles:obstacles, portals:portals, visits:{ laguna:{ x:12, z:-9 } } };
}

/* ----- Playa ----- */
function buildPlaya(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(55);
  discOnGround(scene, 120, 0x4fb4f2, 0, 0, -0.02);        // mar
  discOnGround(scene, 33, 0xf5deb3);                      // arena
  discOnGround(scene, 33, 0xf5deb3, 0, 0, 0.0);
  // agua poco profunda en el borde
  const ring = new T.Mesh(new T.RingGeometry(29,33,48), mat(0x8fd8f5)); ring.rotation.x = -Math.PI/2; ring.position.y = 0.03; scene.add(ring);
  // palmeras
  let n = 0, guard = 0;
  while(n < 12 && guard++ < 200){
    const a = rnd()*Math.PI*2, d = 8 + rnd()*18;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x-10,z-8) < 7 || Math.hypot(x,z+18) < 5 || Math.hypot(x,z) < 6) continue;
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
    if(Math.hypot(x,z+18) < 5) continue;
    const r = new T.Mesh(new T.DodecahedronGeometry(0.8+rnd()*0.4), mat(0x9aa0a6)); r.position.set(x,0.4,z); scene.add(r);
    obstacles.push({ x:x, z:z, r:0.9 });
  }
  const portals = [ addPortal(scene, obstacles, 0, -18, 0xffd43b, 'Volver al pueblo', 'pueblo') ];
  addLights(scene, 0xffffff, 0xd9c28a, 0.95);
  return { obstacles:obstacles, portals:portals, visits:{ sombrilla:{ x:10, z:8 } } };
}

/* ----- Espacio ----- */
function buildEspacio(scene, ctx){
  const T = THREE, obstacles = [], rnd = mulberry32(99);
  discOnGround(scene, 40, 0x8d8ba3);
  // cráteres decorativos
  for(let i=0;i<12;i++){
    const a = rnd()*Math.PI*2, d = 5 + rnd()*26;
    discOnGround(scene, 1.5 + rnd()*2, 0x6f6d85, Math.cos(a)*d, Math.sin(a)*d, 0.02);
  }
  // rocas lunares
  for(let i=0;i<14;i++){
    const a = rnd()*Math.PI*2, d = 8 + rnd()*22;
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x,z+18) < 5 || Math.hypot(x+12,z+10) < 6) continue;
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
  addLights(scene, 0xc9c9ff, 0x333355, 0.8);
  return { obstacles:obstacles, portals:portals, visits:{ bandera:{ x:-12, z:-10 } } };
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
             hello:'Bienvenido al pueblo 🏘️ Entra a un portal para viajar. Los que tienen candado 🔒 se abren con monedas.' },
  casa:    { name:'Mi Casa', radius:23, sky:0x9fdcff, fogNear:50, fogFar:110, build:buildCasa, home:true,
             hello:'¡Esta es tu casa! 🏠 Toca 🔨 Construir para poner bloques y muebles. Desbloquea más con tus monedas.' },
  obby:    { name:'Carrera de Obstáculos', radius:260, floor:null, sky:0x87ceeb, fogNear:80, fogFar:230, build:buildObby, price:30,
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
             ] },
  playa:   { name:'Playa', radius:29, sky:0xaee4ff, fogNear:45, fogFar:100, build:buildPlaya, price:40,
             collect:{ emoji:'🐚', make:makeShell, n:10 },
             missions:[
               { type:'collect', n:5, reward:15, text:'¡Qué lindo día de playa! Ayúdame a juntar 5 conchitas 🐚', done:'¡Qué bonitas conchitas!' },
               { type:'visit', at:'sombrilla', r:5, reward:15, text:'Vamos a descansar bajo las sombrillas ⛱️', done:'¡Qué rico el solcito!' },
               { type:'collect', n:8, reward:25, text:'¡Junta 8 conchitas más para mi colección! 🐚', done:'¡Tremenda colección!' },
             ] },
  espacio: { name:'Luna', radius:34, sky:0x0b1030, fogNear:60, fogFar:140, build:buildEspacio, price:80,
             collect:{ emoji:'⭐', make:makeStar, n:10 },
             missions:[
               { type:'collect', n:5, reward:20, text:'¡Estamos en la Luna! 🌙 Recoge 5 estrellitas ⭐', done:'¡Brillantes!' },
               { type:'visit', at:'bandera', r:5, reward:20, text:'Llega hasta la bandera 🚩 que está más allá.', done:'¡Plantaste tu bandera!' },
               { type:'collect', n:8, reward:30, text:'¡Junta 8 estrellitas más! ⭐', done:'¡Eres un astronauta!' },
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

function isUnlocked(id){ return id==='pueblo' || id==='casa' || state.world.unlocked.indexOf(id) !== -1; }

function travel(dest){
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
  const zoneId = currentZone, zone = ZONES[zoneId];
  const from = arrivedFrom; travelling = false; arrivedFrom = null;
  bonesCollected = 0; missionBones = 0; avatarOpen = false; buildOpen = false; buildHooks = null;

  try{
    if(!THREE) THREE = await import(THREE_URL);
  }catch(e){
    if(loading) loading.innerHTML = 'No pudimos cargar el mundo 3D. Revisa tu conexión a internet e inténtalo de nuevo. 🐾';
    return;
  }
  if(myRun !== runId || !document.body.contains(wrap)) return;

  const T = THREE;
  let renderer;
  try{
    renderer = new T.WebGLRenderer({ antialias:true });
  }catch(e){
    if(loading) loading.textContent = 'Tu dispositivo no puede mostrar el mundo 3D. 🐾';
    return;
  }
  if(loading) loading.remove();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  const canvas = renderer.domElement;
  canvas.className = 'mundo-canvas';
  wrap.insertBefore(canvas, wrap.firstChild);

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
  if(zname) zname.textContent = zone.name;

  const me = buildPerson();
  scene.add(me.root);
  outfitHook = me.applyOutfit;
  const pos = me.root.position;
  if(from && from !== 'pueblo' && zoneId === 'pueblo'){
    const pp = world.portals.filter(function(p){ return p.dest === from; })[0];
    pos.set(pp ? pp.x*0.7 : 0, 0, pp ? pp.z*0.7 : 6);
  }else pos.set(spawn.x, spawn.y, zoneId==='pueblo' ? 7 : spawn.z);
  let heading = 0;
  if(window.__LEO_DEBUG) window.__mundo = { pos:pos };   // gancho solo para pruebas manuales

  // Mi Casa: construcción con bloques y muebles sobre una grilla (cursor delante del personaje)
  const isHome = !!world.house;
  const buildBtn = document.getElementById('mundo-build-btn');
  if(buildBtn) buildBtn.style.display = isHome ? '' : 'none';
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
    state.world.house.items.forEach(addItemView);
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
        h.items.push(it); addItemView(it); saveProgress();
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
        saveProgress();
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
      if(obstacles.every(function(o){ return Math.hypot(p.x-o.x,p.z-o.z) > o.r+1.2; })){
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
    if(zone.hello) return zone.hello;
    const m = missions[mIndex()];
    if(!m) return 'Completaste las misiones de este lugar 🎉 ¡Vuelve al pueblo y visita otro portal! 🐾';
    return m.text + (m.type==='collect' ? ' ('+Math.min(missionBones,m.n)+'/'+m.n+')' : '');
  }
  function refreshGuide(){
    if(!guideBox) return;
    guideBox.textContent = customText || missionText();
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
    awardCoins(m.reward);
    state.world.missions[zoneId] = mIndex() + 1;
    missionBones = 0;
    saveProgress();
    showToast(m.done+' +'+m.reward+' monedas');
    refreshShop();
    customText = null; refreshGuide();
  }

  // tamaño
  function resize(){
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if(!w || !h) return;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize); ro.observe(wrap);

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
  }, ku = function(e){ if(e.key === ' ') jumpHeld = false; onKey(e,false); };
  window.addEventListener('keydown',kd); window.addEventListener('keyup',ku);

  // cámara orbital en tercera persona (como Roblox): arrastrar gira, rueda / pellizco acerca
  let camYaw = 0, camPitch = 0.42, camDist = 12;
  let viewYaw = 0, viewPitch = 0.42, viewDist = 12;
  let pinchD = null;
  const camPtrs = new Map();
  function clamp(v,lo,hi){ return Math.max(lo, Math.min(hi, v)); }

  // entrada táctil/mouse sobre el mundo: izquierda = joystick flotante, derecha = cámara
  const joy = document.getElementById('mundo-joy'), knob = document.getElementById('mundo-knob');
  const joyVec = { x:0, y:0 };
  let joyId = null, joyCx = 0, joyCy = 0;
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
    try{ canvas.setPointerCapture(e.pointerId); }catch(err){}
    const r = wrap.getBoundingClientRect(), px = e.clientX-r.left, py = e.clientY-r.top;
    if(e.pointerType === 'touch' && joyId === null && px < r.width*0.5){
      joyId = e.pointerId; joyCx = e.clientX; joyCy = e.clientY;
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

  const jumpBtn = document.getElementById('mundo-jump');
  if(jumpBtn){
    jumpBtn.addEventListener('pointerdown', function(e){ jumpHeld = true; e.preventDefault(); });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){ jumpBtn.addEventListener(ev, function(){ jumpHeld = false; }); });
  }

  function respawn(){
    pos.set(spawn.x, spawn.y, spawn.z); vy = 0; grounded = true;
    guide.root.position.set(spawn.x-1.5, spawn.y, spawn.z+1.5);
    showToast('¡Sigue intentando! 💪');
  }

  function cleanup(){
    window.removeEventListener('keydown',kd); window.removeEventListener('keyup',ku);
    ro.disconnect(); renderer.dispose();
    if(outfitHook === me.applyOutfit) outfitHook = null;
    if(guideSay === myGuideSay) guideSay = null;
    if(myBuildHooks && buildHooks === myBuildHooks) buildHooks = null;
    if(!travelling && myRun === runId) currentZone = 'pueblo';  // al salir del juego, la próxima vez se empieza en el pueblo
  }

  let portalBlocked = null;   // portal cuyo aviso ya se mostró (se rearma al alejarse)
  const clock = new T.Clock();
  let walk = 0;
  function frame(){
    if(myRun !== runId || !document.body.contains(wrap)){ cleanup(); return; }
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;

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
    if(jumpHeld && coyote > 0){ vy = 11; grounded = false; coyote = 0; }
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
        scene.remove(b); items.splice(i,1); spawnItem();
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

    // puntos de control del obby
    if(world.checkpoints){
      world.checkpoints.forEach(function(c){
        if((spawn.x !== c.x || spawn.z !== c.z) && Math.hypot(pos.x-c.x,pos.z-c.z) < 2.4 && Math.abs(pos.y-c.top) < 1){
          spawn.x = c.x; spawn.y = c.top; spawn.z = c.z;
          showToast('🚩 ¡Punto de control!');
        }
      });
    }

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
            el.innerHTML = '<b>'+z.name+'</b><p>Este lugar está bloqueado 🔒</p>'+
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
    camera.position.set(pos.x + Math.sin(viewYaw)*viewDist*cp, pos.y + 1.6 + Math.sin(viewPitch)*viewDist, pos.z + Math.cos(viewYaw)*viewDist*cp);
    camera.lookAt(pos.x, pos.y + lookY, pos.z);

    renderer.render(scene,camera);
  }
  camera.position.set(pos.x, pos.y+6, pos.z+12);
  frame();
}

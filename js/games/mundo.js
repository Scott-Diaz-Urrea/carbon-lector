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
import { MUNDO_ITEMS, itemById, AVATAR_TONES, AVATAR_HAIRS, AVATAR_HAIR_COLORS, hexCss } from '../content/mundoItems.js';

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

let THREE = null;
let runId = 0;          // invalida bucles de animación de visitas anteriores
let outfitHook = null;  // función que reaplica el atuendo al pug vivo
let bonesCollected = 0;   // huesitos recogidos en esta visita
let missionBones = 0;     // huesitos de la misión de huesitos activa
let avatarOpen = false;
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
        '<button class="mundo-shop-btn" onclick="mundoToggleAvatar()">👤 Yo</button>'+
        '<button class="mundo-shop-btn alone" onclick="mundoToggleShop()">🛍️ Tienda</button>'+
      '</div>'+
      '<div class="mundo-guide" id="mundo-guide"><span class="guide-face">🐾</span><span><b id="mundo-zone"></b><br><span id="mundo-guide-text"></span></span></div>'+
      '<div class="mundo-joy" id="mundo-joy"><div class="mundo-knob" id="mundo-knob"></div></div>'+
      '<div class="mundo-shop hidden" id="mundo-shop"></div>'+
      '<div class="mundo-avatar hidden" id="mundo-avatar"></div>'+
      '<div class="mundo-portal hidden" id="mundo-portal"></div>'+
    '</div>'+
    '<p class="mundo-help">Muévete con las flechas o WASD (en celular, con el joystick). Sigue las misiones de Carboncito. ¡Estudia para ganar monedas y estrenar cosas nuevas!</p>'+
  '</div>';
}

/* ---------- Tienda ---------- */
function shopHTML(){
  function card(it){
    const owned = state.world.owned.indexOf(it.id) !== -1;
    const equipped = state.world.equipped.shirt===it.id || state.world.equipped.acc===it.id;
    const preview = it.kind==='shirt'
      ? '<span class="shop-swatch" style="background:'+it.css+'"></span>'
      : '<span class="shop-icon">'+it.icon+'</span>';
    const status = equipped ? '<small class="shop-on">Puesto ✔</small>'
      : owned ? '<small>Ponerme</small>'
      : '<small class="shop-price"><span class="coin-ic"></span> '+it.price+'</small>';
    return '<button class="shop-card'+(equipped?' equipped':'')+'" onclick="mundoItemClick(\''+it.id+'\')">'+
      preview+'<b>'+it.label+'</b>'+status+'</button>';
  }
  const skins = MUNDO_ITEMS.filter(function(i){ return i.kind==='shirt'; }).map(card).join('');
  const accs = MUNDO_ITEMS.filter(function(i){ return i.kind==='acc'; }).map(card).join('');
  return '<div class="shop-head"><b>Tienda de Carboncito</b>'+
      '<span class="pill coinpill"><span class="coin-ic"></span>'+state.coins+'</span>'+
      '<button class="shop-close" onclick="mundoToggleShop()" aria-label="Cerrar">✕</button></div>'+
    '<p class="shop-note">Ganas monedas al terminar juegos de estudio de LEO.</p>'+
    '<p class="shop-sec">Poleras</p><div class="shop-grid">'+skins+'</div>'+
    '<p class="shop-sec">Accesorios</p><div class="shop-grid">'+accs+'</div>';
}

function refreshShop(){
  const shop = document.getElementById('mundo-shop');
  if(shop && !shop.classList.contains('hidden')) shop.innerHTML = shopHTML();
  const c = document.getElementById('mundo-coins');
  if(c) c.textContent = state.coins;
  const top = document.querySelector('.topbar .coinpill');
  if(top) top.innerHTML = '<span class="coin-ic"></span>' + state.coins;
}

export function mundoToggleShop(){
  const shop = document.getElementById('mundo-shop');
  if(!shop) return;
  const open = shop.classList.contains('hidden');
  if(open) closeAvatar();
  shop.classList.toggle('hidden', !open);
  if(open) shop.innerHTML = shopHTML();
}

/* ---------- Creador de avatar ---------- */
function avatarHTML(){
  const av = state.world.avatar;
  function sw(field, i, hex){
    return '<button class="av-sw'+(av[field]===i?' on':'')+'" style="background:'+hexCss(hex)+'" onclick="mundoAvatarSet(\''+field+'\','+i+')" aria-label="Opción '+(i+1)+'"></button>';
  }
  return '<div class="shop-head"><b>Mi personaje</b><button class="shop-close" onclick="mundoAvatarDone()" aria-label="Cerrar">✕</button></div>'+
    '<p class="shop-sec">Piel</p><div class="av-row">'+AVATAR_TONES.map(function(h,i){ return sw('tone',i,h); }).join('')+'</div>'+
    '<p class="shop-sec">Peinado</p><div class="av-row">'+AVATAR_HAIRS.map(function(h){
      return '<button class="av-chip'+(av.hair===h.id?' on':'')+'" onclick="mundoAvatarSet(\'hair\',\''+h.id+'\')">'+h.label+'</button>'; }).join('')+'</div>'+
    '<p class="shop-sec">Color de pelo</p><div class="av-row">'+AVATAR_HAIR_COLORS.map(function(h,i){ return sw('hairColor',i,h); }).join('')+'</div>'+
    '<button class="av-done" onclick="mundoAvatarDone()">¡Listo!</button>';
}
function closeAvatar(){
  const el = document.getElementById('mundo-avatar');
  if(el) el.classList.add('hidden');
  avatarOpen = false;
}
export function mundoToggleAvatar(){
  const el = document.getElementById('mundo-avatar');
  if(!el) return;
  if(!avatarOpen){
    const shop = document.getElementById('mundo-shop'); if(shop) shop.classList.add('hidden');
    el.innerHTML = avatarHTML(); el.classList.remove('hidden'); avatarOpen = true;
  }else closeAvatar();
}
export function mundoAvatarSet(field, val){
  state.world.avatar[field] = val;
  saveProgress();
  if(outfitHook) outfitHook();
  const el = document.getElementById('mundo-avatar');
  if(el) el.innerHTML = avatarHTML();
}
export function mundoAvatarDone(){
  state.world.avatar.created = true;
  saveProgress();
  closeAvatar();
  if(guideSay) guideSay(null);
}

export function mundoItemClick(id){
  const it = itemById(id);
  if(!it) return;
  const w = state.world;
  if(w.owned.indexOf(id) === -1){
    if(!spendCoins(it.price)){
      showToast('Te faltan '+(it.price-state.coins)+' monedas. ¡Estudia para ganar más!');
      return;
    }
    w.owned.push(id);
    showToast('¡Compraste '+it.label+'!');
  }
  if(it.kind==='shirt') w.equipped.shirt = id;
  else w.equipped.acc = (w.equipped.acc===id) ? null : id;
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

/* ---------- Persona (avatar de bloques) ---------- */
function buildPerson(){
  const T = THREE;
  const root = new T.Group();
  const skinMat = new T.MeshLambertMaterial({ color:0xe8b98a });
  const hairMat = new T.MeshLambertMaterial({ color:0x6b4423 });
  const shirtMat = new T.MeshLambertMaterial({ color:0x3b82f6 });
  const pantsMat = new T.MeshLambertMaterial({ color:0x2c3e75 });
  const black = new T.MeshLambertMaterial({ color:0x111111 });

  function box(w,h,d,mat,x,y,z,parent){
    const m = new T.Mesh(new T.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z); (parent||root).add(m); return m;
  }
  function ball(r,mat,x,y,z,parent){
    const m = new T.Mesh(new T.SphereGeometry(r,10,8), mat);
    m.position.set(x,y,z); (parent||root).add(m); return m;
  }

  const body = new T.Group(); root.add(body);
  box(0.95,0.9,0.5,shirtMat,0,1.25,0,body);   // torso
  box(0.7,0.7,0.7,skinMat,0,2.1,0,body);       // cabeza
  [-1,1].forEach(function(s){ box(0.09,0.12,0.04,black,s*0.16,2.17,0.36,body); });
  box(0.22,0.05,0.04,black,0,1.97,0.36,body);  // sonrisa

  const legs = [], arms = [];
  [-1,1].forEach(function(s){
    const leg = new T.Group(); leg.position.set(s*0.22,0.8,0);
    box(0.4,0.8,0.4,pantsMat,0,-0.4,0,leg); body.add(leg); legs.push(leg);
    const arm = new T.Group(); arm.position.set(s*0.63,1.65,0);
    box(0.3,0.8,0.3,skinMat,0,-0.4,0,arm); body.add(arm); arms.push(arm);
  });

  const shadow = new T.Mesh(new T.CircleGeometry(0.8,20), new T.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:0.25 }));
  shadow.rotation.x = -Math.PI/2; shadow.position.y = 0.02; root.add(shadow);

  const hair = new T.Group(); body.add(hair);
  const acc = new T.Group(); body.add(acc);

  function applyOutfit(){
    const av = state.world.avatar;
    skinMat.color.setHex(AVATAR_TONES[av.tone] != null ? AVATAR_TONES[av.tone] : AVATAR_TONES[1]);
    hairMat.color.setHex(AVATAR_HAIR_COLORS[av.hairColor] != null ? AVATAR_HAIR_COLORS[av.hairColor] : AVATAR_HAIR_COLORS[1]);
    const shirt = itemById(state.world.equipped.shirt) || MUNDO_ITEMS[0];
    shirtMat.color.setHex(shirt.hex);

    while(hair.children.length) hair.remove(hair.children[0]);
    box(0.78,0.22,0.78,hairMat,0,2.5,0,hair);
    box(0.78,0.5,0.18,hairMat,0,2.28,-0.3,hair);
    if(av.hair==='largo'){
      box(0.78,0.95,0.18,hairMat,0,1.9,-0.32,hair);
      [-1,1].forEach(function(s){ box(0.1,0.55,0.5,hairMat,s*0.4,2.2,-0.05,hair); });
    }else if(av.hair==='coleta'){
      ball(0.2,hairMat,0,2.3,-0.48,hair);
      box(0.14,0.5,0.14,hairMat,0,2.0,-0.5,hair);
    }else if(av.hair==='rulos'){
      for(let i=0;i<7;i++){
        const a2 = i/7*Math.PI*2;
        ball(0.2,hairMat,Math.cos(a2)*0.38,2.55,Math.sin(a2)*0.38,hair);
      }
      ball(0.24,hairMat,0,2.68,0,hair);
    }

    while(acc.children.length) acc.remove(acc.children[0]);
    const a = state.world.equipped.acc;
    const red = new T.MeshLambertMaterial({ color:0xe0334c });
    const gold = new T.MeshLambertMaterial({ color:0xf2c230 });
    if(a==='acc_gorro'){
      const hatMat = new T.MeshLambertMaterial({ color:0x2b2b5a });
      const hat = new T.Mesh(new T.CylinderGeometry(0.3,0.36,0.65,12), hatMat);
      hat.position.set(0,3.0,0); acc.add(hat);
      const brim = new T.Mesh(new T.CylinderGeometry(0.55,0.55,0.07,16), hatMat);
      brim.position.set(0,2.68,0); acc.add(brim);
    }else if(a==='acc_corona'){
      const c = new T.Mesh(new T.CylinderGeometry(0.42,0.34,0.32,8), gold);
      c.position.set(0,2.8,0); acc.add(c);
      [-0.28,0,0.28].forEach(function(x){ ball(0.07,red,x,3.0,0,acc); });
    }else if(a==='acc_lentes'){
      const lens = new T.MeshLambertMaterial({ color:0x111122 });
      box(0.3,0.22,0.06,lens,-0.19,2.19,0.38,acc);
      box(0.3,0.22,0.06,lens,0.19,2.19,0.38,acc);
      box(0.1,0.05,0.06,lens,0,2.21,0.38,acc);
    }else if(a==='acc_capa'){
      const cape = box(0.95,1.2,0.06,red,0,1.2,-0.32,acc);
      cape.rotation.x = 0.18;
    }else if(a==='acc_corbata'){
      const l = box(0.28,0.2,0.1,red,-0.17,1.6,0.28,acc); l.rotation.z = 0.4;
      const r = box(0.28,0.2,0.1,red,0.17,1.6,0.28,acc); r.rotation.z = -0.4;
      box(0.13,0.13,0.12,red,0,1.6,0.3,acc);
    }
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

function isUnlocked(id){ return id==='pueblo' || state.world.unlocked.indexOf(id) !== -1; }

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
  bonesCollected = 0; missionBones = 0; avatarOpen = false;

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
  const camera = new T.PerspectiveCamera(55, 1, 0.1, 250);
  const world = zone.build(scene, {
    portalLabel: function(id){
      const z = ZONES[id];
      return isUnlocked(id) ? z.name : ('🔒 '+z.name+' '+z.price);
    },
  });
  const obstacles = world.obstacles;
  const R = zone.radius;

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
  }else pos.set(0,0, zoneId==='pueblo' ? 7 : 0);
  let heading = 0;
  if(window.__LEO_DEBUG) window.__mundo = { pos:pos };   // gancho solo para pruebas manuales

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
    if(zoneId === 'pueblo') return zone.hello;
    const m = missions[mIndex()];
    if(!m) return 'Completaste las misiones de este lugar 🎉 ¡Vuelve al pueblo y visita otro portal! 🐾';
    return m.text + (m.type==='collect' ? ' ('+Math.min(missionBones,m.n)+'/'+m.n+')' : '');
  }
  function refreshGuide(){
    if(!guideBox) return;
    guideBox.textContent = customText || missionText();
  }
  guideSay = function(txt){ customText = txt; refreshGuide(); };
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
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].indexOf(k) !== -1){
      keys[k] = down;
      if(e.target===document.body || e.target===document.documentElement) e.preventDefault();
    }
  }
  const kd = function(e){ onKey(e,true); }, ku = function(e){ onKey(e,false); };
  window.addEventListener('keydown',kd); window.addEventListener('keyup',ku);

  // entrada: joystick táctil
  const joy = document.getElementById('mundo-joy'), knob = document.getElementById('mundo-knob');
  const joyVec = { x:0, y:0 };
  let joyId = null;
  function joyMove(e){
    const r = joy.getBoundingClientRect();
    const cx = r.left+r.width/2, cy = r.top+r.height/2, max = r.width/2-8;
    let dx = e.clientX-cx, dy = e.clientY-cy;
    const d = Math.hypot(dx,dy);
    if(d > max){ dx = dx/d*max; dy = dy/d*max; }
    knob.style.transform = 'translate('+dx+'px,'+dy+'px)';
    joyVec.x = dx/max; joyVec.y = dy/max;
  }
  function joyEnd(){ joyId = null; joyVec.x = 0; joyVec.y = 0; knob.style.transform = 'translate(0,0)'; }
  joy.addEventListener('pointerdown', function(e){ joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyMove(e); });
  joy.addEventListener('pointermove', function(e){ if(e.pointerId===joyId) joyMove(e); });
  joy.addEventListener('pointerup', joyEnd);
  joy.addEventListener('pointercancel', joyEnd);

  function cleanup(){
    window.removeEventListener('keydown',kd); window.removeEventListener('keyup',ku);
    ro.disconnect(); renderer.dispose();
    if(outfitHook === me.applyOutfit) outfitHook = null;
    guideSay = null;
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
    const mag = Math.min(1, Math.hypot(ix,iz));
    const moving = mag > 0.12;
    if(moving){
      const speed = 7.5*mag;
      const nx = ix/Math.hypot(ix,iz), nz = iz/Math.hypot(ix,iz);
      pos.x += nx*speed*dt; pos.z += nz*speed*dt;
      pushOut(pos, obstacles, 0.6, R);
      const target = Math.atan2(nx,nz);
      let diff = target-heading;
      while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
      heading += diff*Math.min(1, dt*12);
      me.root.rotation.y = heading;
      walk += dt*10*mag;
    }
    // brazos y piernas
    const sw = moving ? Math.sin(walk)*0.8 : 0;
    me.legs[0].rotation.x = sw; me.legs[1].rotation.x = -sw;
    me.arms[0].rotation.x = -sw; me.arms[1].rotation.x = sw;
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
      if(at && Math.hypot(pos.x-at.x, pos.z-at.z) < vm.r) completeMission();
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

    // cámara que sigue (más arriba el punto de mira si hay un panel abierto, para ver al personaje)
    const cx = pos.x, cz2 = pos.z+11;
    camera.position.x += (cx-camera.position.x)*Math.min(1,dt*5);
    camera.position.y += (9-camera.position.y)*Math.min(1,dt*5);
    camera.position.z += (cz2-camera.position.z)*Math.min(1,dt*5);
    camera.lookAt(pos.x,1,pos.z + (avatarOpen ? 4 : 0));

    renderer.render(scene,camera);
  }
  camera.position.set(pos.x,9,pos.z+11);
  frame();
}

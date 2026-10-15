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
import { state, showToast, spendCoins } from '../state.js';
import { saveProgress } from '../persistence.js';
import { MUNDO_ITEMS, itemById } from '../content/mundoItems.js';

const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const WORLD_RADIUS = 38;
const TOTAL_BONES = 10;

let THREE = null;
let runId = 0;          // invalida bucles de animación de visitas anteriores
let outfitHook = null;  // función que reaplica el atuendo al pug vivo
let bonesCollected = 0;

export function renderMundoScreen(){
  return '<div class="screen mundo-screen">'+
    '<div class="mundo-wrap" id="mundo-wrap">'+
      '<div class="mundo-loading" id="mundo-loading">Cargando el mundo… 🐾</div>'+
      '<div class="mundo-hud">'+
        '<div class="pill coinpill"><span class="coin-ic"></span><span id="mundo-coins">'+state.coins+'</span></div>'+
        '<div class="pill">🦴 <span id="mundo-bones">0</span>/'+TOTAL_BONES+'</div>'+
        '<button class="mundo-shop-btn" onclick="mundoToggleShop()">🛍️ Tienda</button>'+
      '</div>'+
      '<div class="mundo-joy" id="mundo-joy"><div class="mundo-knob" id="mundo-knob"></div></div>'+
      '<div class="mundo-shop hidden" id="mundo-shop"></div>'+
    '</div>'+
    '<p class="mundo-help">Muévete con las flechas o WASD (en celular, con el joystick). Recoge los huesitos 🦴. ¡Estudia para ganar monedas y estrenar cosas nuevas!</p>'+
  '</div>';
}

/* ---------- Tienda ---------- */
function shopHTML(){
  function card(it){
    const owned = state.world.owned.indexOf(it.id) !== -1;
    const equipped = state.world.equipped.skin===it.id || state.world.equipped.acc===it.id;
    const preview = it.kind==='skin'
      ? '<span class="shop-swatch" style="background:'+it.css+'"></span>'
      : '<span class="shop-icon">'+it.icon+'</span>';
    const status = equipped ? '<small class="shop-on">Puesto ✔</small>'
      : owned ? '<small>Ponerme</small>'
      : '<small class="shop-price"><span class="coin-ic"></span> '+it.price+'</small>';
    return '<button class="shop-card'+(equipped?' equipped':'')+'" onclick="mundoItemClick(\''+it.id+'\')">'+
      preview+'<b>'+it.label+'</b>'+status+'</button>';
  }
  const skins = MUNDO_ITEMS.filter(function(i){ return i.kind==='skin'; }).map(card).join('');
  const accs = MUNDO_ITEMS.filter(function(i){ return i.kind==='acc'; }).map(card).join('');
  return '<div class="shop-head"><b>Tienda de Carboncito</b>'+
      '<span class="pill coinpill"><span class="coin-ic"></span>'+state.coins+'</span>'+
      '<button class="shop-close" onclick="mundoToggleShop()" aria-label="Cerrar">✕</button></div>'+
    '<p class="shop-note">Ganas monedas al terminar juegos de estudio de LEO.</p>'+
    '<p class="shop-sec">Colores</p><div class="shop-grid">'+skins+'</div>'+
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
  shop.classList.toggle('hidden', !open);
  if(open) shop.innerHTML = shopHTML();
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
  if(it.kind==='skin') w.equipped.skin = id;
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

  const acc = new T.Group(); body.add(acc);

  function applyOutfit(){
    const skin = itemById(state.world.equipped.skin) || MUNDO_ITEMS[0];
    bodyMat.color.setHex(skin.body); snoutMat.color.setHex(skin.snout); earMat.color.setHex(skin.ear);
    while(acc.children.length) acc.remove(acc.children[0]);
    const a = state.world.equipped.acc;
    const red = new T.MeshLambertMaterial({ color:0xe0334c });
    const gold = new T.MeshLambertMaterial({ color:0xf2c230 });
    if(a==='acc_gorro'){
      const hat = new T.Mesh(new T.CylinderGeometry(0.3,0.38,0.7,12), new T.MeshLambertMaterial({ color:0x2b2b5a }));
      hat.position.set(0,2.15,0.85); acc.add(hat);
      const brim = new T.Mesh(new T.CylinderGeometry(0.55,0.55,0.07,16), new T.MeshLambertMaterial({ color:0x2b2b5a }));
      brim.position.set(0,1.82,0.85); acc.add(brim);
    }else if(a==='acc_corona'){
      const c = new T.Mesh(new T.CylinderGeometry(0.42,0.34,0.32,8), gold);
      c.position.set(0,1.95,0.85); acc.add(c);
      [-0.28,0,0.28].forEach(function(x){ ball(0.07,red,x,2.16,0.85,acc); });
    }else if(a==='acc_lentes'){
      const lens = new T.MeshLambertMaterial({ color:0x111122 });
      box(0.34,0.24,0.06,lens,-0.25,1.5,1.34,acc);
      box(0.34,0.24,0.06,lens,0.25,1.5,1.34,acc);
      box(0.2,0.06,0.06,lens,0,1.52,1.34,acc);
    }else if(a==='acc_capa'){
      const cape = box(0.95,0.95,0.06,red,0,1.0,-0.8,acc);
      cape.rotation.x = 0.25;
    }else if(a==='acc_corbata'){
      const l = box(0.3,0.22,0.12,red,-0.2,1.0,1.28,acc); l.rotation.z = 0.4;
      const r = box(0.3,0.22,0.12,red,0.2,1.0,1.28,acc); r.rotation.z = -0.4;
      box(0.14,0.14,0.14,red,0,1.0,1.3,acc);
    }
  }
  applyOutfit();
  return { root:root, body:body, legs:legs, tail:tail, applyOutfit:applyOutfit };
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

function buildWorld(scene){
  const T = THREE;
  const obstacles = []; // {x,z,r}
  const rnd = mulberry32(2026);

  const ground = new T.Mesh(new T.CircleGeometry(WORLD_RADIUS+6,48), new T.MeshLambertMaterial({ color:0x7ed957 }));
  ground.rotation.x = -Math.PI/2; scene.add(ground);

  // laguna
  const pond = new T.Mesh(new T.CircleGeometry(5,32), new T.MeshLambertMaterial({ color:0x4fb4f2 }));
  pond.rotation.x = -Math.PI/2; pond.position.set(12,0.03,-9); scene.add(pond);
  obstacles.push({ x:12, z:-9, r:5.3 });

  // camino de tierra
  const path = new T.Mesh(new T.CircleGeometry(4,24), new T.MeshLambertMaterial({ color:0xd9b77a }));
  path.rotation.x = -Math.PI/2; path.position.set(0,0.02,0); scene.add(path);

  // árboles
  const trunkMat = new T.MeshLambertMaterial({ color:0x8a5a2b });
  const leafMat = new T.MeshLambertMaterial({ color:0x2f9e44 });
  const leafMat2 = new T.MeshLambertMaterial({ color:0x40c057 });
  let placed = 0, guard = 0;
  while(placed < 34 && guard++ < 500){
    const a = rnd()*Math.PI*2, d = 7 + rnd()*(WORLD_RADIUS-9);
    const x = Math.cos(a)*d, z = Math.sin(a)*d;
    if(Math.hypot(x-12,z+9) < 8) continue;
    const s = 0.8 + rnd()*0.8;
    const tree = new T.Group();
    const trunk = new T.Mesh(new T.CylinderGeometry(0.25*s,0.35*s,1.6*s,8), trunkMat);
    trunk.position.y = 0.8*s; tree.add(trunk);
    const c1 = new T.Mesh(new T.ConeGeometry(1.3*s,2.2*s,8), rnd()<0.5?leafMat:leafMat2);
    c1.position.y = 2.4*s; tree.add(c1);
    const c2 = new T.Mesh(new T.ConeGeometry(0.95*s,1.7*s,8), leafMat2);
    c2.position.y = 3.5*s; tree.add(c2);
    tree.position.set(x,0,z); scene.add(tree);
    obstacles.push({ x:x, z:z, r:0.7*s });
    placed++;
  }

  // flores decorativas
  const flowerCols = [0xff6b6b,0xffd43b,0xf783ac,0xffffff];
  for(let i=0;i<60;i++){
    const a = rnd()*Math.PI*2, d = 3 + rnd()*(WORLD_RADIUS-4);
    const f = new T.Mesh(new T.SphereGeometry(0.13,6,6), new T.MeshLambertMaterial({ color:flowerCols[i%4] }));
    f.position.set(Math.cos(a)*d,0.15,Math.sin(a)*d); scene.add(f);
  }

  // cerca en el borde
  const fenceMat = new T.MeshLambertMaterial({ color:0xc99a5b });
  for(let i=0;i<64;i++){
    const a = i/64*Math.PI*2;
    const post = new T.Mesh(new T.BoxGeometry(0.35,1.3,0.35), fenceMat);
    post.position.set(Math.cos(a)*(WORLD_RADIUS+1),0.65,Math.sin(a)*(WORLD_RADIUS+1));
    scene.add(post);
  }

  // luces
  scene.add(new T.HemisphereLight(0xffffff,0x88aa66,0.85));
  const sun = new T.DirectionalLight(0xffffff,0.6);
  sun.position.set(20,40,15); scene.add(sun);

  return obstacles;
}

function makeBone(){
  const T = THREE;
  const g = new T.Group();
  const mat = new T.MeshLambertMaterial({ color:0xfff7e0, emissive:0x554422 });
  const shaft = new T.Mesh(new T.CylinderGeometry(0.12,0.12,0.7,8), mat);
  shaft.rotation.z = Math.PI/2; g.add(shaft);
  [[-0.35,0.1],[-0.35,-0.1],[0.35,0.1],[0.35,-0.1]].forEach(function(p){
    const b = new T.Mesh(new T.SphereGeometry(0.16,8,8), mat);
    b.position.set(p[0],p[1],0); g.add(b);
  });
  g.scale.setScalar(1.4);
  return g;
}

function pushOut(pos, obstacles, pr){
  obstacles.forEach(function(o){
    const dx = pos.x-o.x, dz = pos.z-o.z, d = Math.hypot(dx,dz), min = o.r+pr;
    if(d < min && d > 0.0001){ pos.x = o.x + dx/d*min; pos.z = o.z + dz/d*min; }
  });
  const d0 = Math.hypot(pos.x,pos.z), lim = WORLD_RADIUS-0.5;
  if(d0 > lim){ pos.x *= lim/d0; pos.z *= lim/d0; }
}

export async function initMundo(){
  const myRun = ++runId;
  const wrap = document.getElementById('mundo-wrap');
  const loading = document.getElementById('mundo-loading');
  if(!wrap) return;
  bonesCollected = 0;

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
  scene.background = new T.Color(0x9fdcff);
  scene.fog = new T.Fog(0x9fdcff, 35, 80);
  const camera = new T.PerspectiveCamera(55, 1, 0.1, 200);
  const obstacles = buildWorld(scene);

  const pug = buildPug();
  scene.add(pug.root);
  outfitHook = pug.applyOutfit;
  const pos = pug.root.position; pos.set(0,0,0);
  let heading = 0;

  // huesitos
  const bones = [];
  function spawnBone(){
    for(let tries=0; tries<40; tries++){
      const a = Math.random()*Math.PI*2, d = 5 + Math.random()*(WORLD_RADIUS-8);
      const p = { x:Math.cos(a)*d, z:Math.sin(a)*d };
      if(obstacles.every(function(o){ return Math.hypot(p.x-o.x,p.z-o.z) > o.r+1.2; })){
        const b = makeBone(); b.position.set(p.x,1,p.z); scene.add(b); bones.push(b); return;
      }
    }
  }
  for(let i=0;i<TOTAL_BONES;i++) spawnBone();

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
    if(outfitHook === pug.applyOutfit) outfitHook = null;
  }

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
      pushOut(pos, obstacles, 0.6);
      const target = Math.atan2(nx,nz);
      let diff = target-heading;
      while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
      heading += diff*Math.min(1, dt*12);
      pug.root.rotation.y = heading;
      walk += dt*12*mag;
    }
    // patitas y colita
    const sw = moving ? Math.sin(walk)*0.7 : 0;
    pug.legs[0].rotation.x = sw; pug.legs[3].rotation.x = sw;
    pug.legs[1].rotation.x = -sw; pug.legs[2].rotation.x = -sw;
    pug.body.position.y = moving ? Math.abs(Math.sin(walk))*0.08 : 0;
    pug.tail.rotation.y = Math.sin(t*(moving?14:6))*0.6;

    // huesitos
    for(let i=bones.length-1;i>=0;i--){
      const b = bones[i];
      b.rotation.y = t*2; b.position.y = 1+Math.sin(t*3+i)*0.15;
      if(Math.hypot(b.position.x-pos.x, b.position.z-pos.z) < 1.3){
        scene.remove(b); bones.splice(i,1);
        bonesCollected++;
        const el = document.getElementById('mundo-bones'); if(el) el.textContent = bonesCollected;
        if(bonesCollected >= TOTAL_BONES){
          showToast('¡Juntaste todos los huesitos! 🎉 Aparecen nuevos.');
          bonesCollected = 0;
          for(let k=0;k<TOTAL_BONES;k++) spawnBone();
          if(el) el.textContent = 0;
        }
      }
    }

    // cámara que sigue
    const cx = pos.x, cz = pos.z+11;
    camera.position.x += (cx-camera.position.x)*Math.min(1,dt*5);
    camera.position.y += (9-camera.position.y)*Math.min(1,dt*5);
    camera.position.z += (cz-camera.position.z)*Math.min(1,dt*5);
    camera.lookAt(pos.x,1,pos.z);

    renderer.render(scene,camera);
  }
  camera.position.set(0,9,11);
  frame();
}

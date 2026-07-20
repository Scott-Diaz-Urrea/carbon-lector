import { mascotSVG, starSVG } from './svg.js';
import { state, awardXP, goBack } from './state.js';
import { MC_KEYS, initMCGame } from './mcEngine.js';
import { initSilabasGame } from './games/silabas.js';
import { initSecuenciaGame } from './games/secuencia.js';
import { mGame } from './games/memorama.js';
import { render } from './render.js';
import { saveProgress } from './persistence.js';

export const MODULE_TITLES = {
  vocales:'Explorador de Vocales',
  silabas:'Maestro de Sílabas',
  memorama:'Memoria de Acero',
  palabras:'Coleccionista de Palabras',
  comprension:'Detective de Historias',
  contar:'Contador Estrella',
  sumar:'As de las Sumas',
  comparar:'Ojo de Águila',
  formas:'Geómetra Junior',
  combinaciones:'Mago de las Combinaciones',
  secuencia:'Narrador Ordenado',
  salta:'Saltarín Numérico',
  multiplicar:'Multiplicador Veloz',
  seresvivos:'Guardián de la Naturaleza',
  plantas:'Botánico Curioso',
  micuerpo:'Explorador de mi Cuerpo',
  materiales:'Científico de Materiales',
  dianoche:'Astrónomo Junior',
  calendario:'Maestro del Calendario',
  miidentidad:'Historiador Familiar',
  simbolos:'Embajador Chileno',
  mapas:'Explorador Geográfico',
  comunidad:'Ciudadano Ejemplar',
  colores:'Mezclador de Colores',
  lineastexturas:'Artista de Texturas',
  materialesarte:'Maestro de Materiales',
  sonidos:'Oído de Oro',
  instrumentos:'Percusionista Junior',
  movimiento:'Atleta en Movimiento',
  vidaactiva:'Campeón Saludable',
  seguridad:'Capitán del Buen Juego',
  emociones:'Experto en Emociones',
  autocuidado:'Guardián de mi Cuerpo',
  convivencia:'Embajador de la Amistad',
  herramientastec:'Ingeniero Creativo',
  patrones:'Detective de Patrones',
  clasificar:'Clasificador Experto',
  posicion:'Explorador Espacial',
  cuantificadores:'Comparador Genial',
  secuenciatemporal:'Guardián del Tiempo',
  contarveinte:'Contador Veloz',
  sumarquitar:'Mago de los Números',
  formascuerpos:'Arquitecto Junior',
  medir:'Medidor Preciso',
};

export function spawnConfetti(container){
  const colors = ['#FF6B6B','#FFB627','#12A594','#7C6FF0','#FFD23F'];
  for(let i=0;i<26;i++){
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100 + '%';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDelay = (Math.random()*0.4) + 's';
    p.style.transform = 'rotate(' + Math.floor(Math.random()*360) + 'deg)';
    container.appendChild(p);
  }
}

export function replayGame(key){
  if(MC_KEYS.indexOf(key)!==-1) initMCGame(key);
  else if(key==='silabas') initSilabasGame();
  else if(key==='secuencia') initSecuenciaGame();
  else if(key==='memorama') render();
}

export function showExplain(text, onContinue){
  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay';
  const who = state.userName ? ', ' + state.userName : '';
  div.innerHTML =
    '<div class="explain-card">'+
      '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(80)+'</div>'+
      '<p class="explain-title">🐾 Carboncito te explica'+who+'</p>'+
      '<p class="explain-text">'+text+'</p>'+
      '<button class="cta-btn" id="explain-continue-btn">¡Entendido, sigamos! 👍</button>'+
    '</div>';
  app.appendChild(div);
  document.getElementById('explain-continue-btn').onclick = function(){
    div.remove();
    onContinue();
  };
}

export function showNameEntry(onDone){
  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay';
  div.innerHTML =
    '<div class="explain-card">'+
      '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(90)+'</div>'+
      '<p class="explain-title">🐾 ¡Hola! Soy Carboncito</p>'+
      '<p class="explain-text">¿Cómo te llamas?</p>'+
      '<input id="name-input" class="name-input" type="text" maxlength="20" autocomplete="off" placeholder="Escribe tu nombre" aria-label="Tu nombre">'+
      '<button class="cta-btn" id="name-continue-btn">¡Listo! 🐾</button>'+
    '</div>';
  app.appendChild(div);
  const input = document.getElementById('name-input');
  input.focus();
  function submit(){
    state.userName = input.value.trim();
    saveProgress();
    div.remove();
    onDone();
  }
  document.getElementById('name-continue-btn').onclick = submit;
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') submit(); });
}

export function showResult(moduleKey, correctOrStars, total, isStarsAlready){
  let stars;
  if(isStarsAlready){
    stars = correctOrStars;
    awardXP(stars*15);
  }else{
    const ratio = correctOrStars/total;
    stars = ratio>=0.85 ? 3 : ratio>=0.6 ? 2 : ratio>=0.35 ? 1 : 0;
  }
  state.stars[moduleKey] = Math.max(state.stars[moduleKey], stars);
  saveProgress();

  const isNewBadge = !state.badges.has(moduleKey) && stars>0;
  if(isNewBadge){
    state.badges.add(moduleKey);
    awardXP(15);
  }

  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay';
  const who = state.userName ? ', ' + state.userName : '';
  div.innerHTML =
    '<div class="result-card">'+
      '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(90)+'</div>'+
      '<p class="result-title">'+(stars>=2 ? '¡Excelente trabajo'+who+'!' : '¡Buen intento'+who+'!')+'</p>'+
      '<div class="result-stars">'+[0,1,2].map(function(i){ return starSVG(i<stars); }).join('')+'</div>'+
      '<p class="result-sub">'+(isStarsAlready ? ('Lo lograste en '+mGame.moves+' movimientos.') : ('Acertaste '+correctOrStars+' de '+total+'.'))+'</p>'+
      (isNewBadge ? '<div class="badge-unlock">🏅 ¡Insignia nueva: '+(MODULE_TITLES[moduleKey]||moduleKey)+'!</div>' : '')+
      '<div class="result-actions">'+
        '<button class="cta-btn secondary" onclick="this.closest(\'.overlay\').remove(); goBack();">Volver al mapa</button>'+
        '<button class="cta-btn" onclick="this.closest(\'.overlay\').remove(); replayGame(\''+moduleKey+'\');">Jugar de nuevo 🔁</button>'+
      '</div>'+
    '</div>';
  app.appendChild(div);
  if(stars===3){ spawnConfetti(div.querySelector('.result-card')); }
}

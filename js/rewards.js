import { mascotSVG, starSVG } from './svg.js';
import { state, awardXP, goBack } from './state.js';
import { MC_KEYS, initMCGame } from './mcEngine.js';
import { initSilabasGame } from './games/silabas.js';
import { initSecuenciaGame } from './games/secuencia.js';
import { mGame } from './games/memorama.js';
import { initEscribeNombreGame } from './games/escribenombre.js';
import { initCaligrafiaGame } from './games/caligrafia.js';
import { renderTraceCanvas, initTraceCanvas } from './games/traza.js';
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
  escribenombre:'Escritor Principiante',
  caligrafia:'Maestro de la Caligrafía',
  silabasnt:'Detective de Sonidos',
  escucharnt:'Oyente Atento',
  vocabnt:'Coleccionista de Palabras Junior',
  letrasnt:'Explorador de Letras',
  apreciarnt:'Crítico de Arte Junior',
  emocionesnt:'Experto en Emociones Junior',
  autocuidadont:'Guardián de mi Cuerpo Junior',
  alimentosnt:'Nutricionista Junior',
  resolucionnt:'Mediador de Paz',
  normasnt:'Ciudadano Ejemplar Junior',
  seguridadnt:'Guardián de la Seguridad',
  ubicacionnt:'Explorador Espacial Junior',
  movimientont:'Atleta en Movimiento Junior',
  aguasolnt:'Amigo del Agua y el Sol',
  materialesnaturalnt:'Científico de Materiales Junior',
  animalesplantasnt:'Guardián de la Naturaleza Junior',
  ciclosnt:'Observador de la Vida',
  ambientent:'Protector del Planeta',
  rolescomunidadnt:'Amigo de mi Comunidad',
  objetostecnt:'Ingeniero Creativo Junior',
  institucionesnt:'Explorador de mi Barrio',
  seguridadprevnt:'Capitán de la Prevención',
  gramatica2:'Gramático Junior',
  comprension2:'Lector Detective',
  geometria2:'Geómetra Avanzado',
  medicion2:'Maestro de la Medición',
  vertebrados2:'Zoólogo Junior',
  ciclosvida2:'Biólogo de la Vida',
  habitats2:'Guardián de Hábitats',
  cuerpodentro2:'Explorador del Cuerpo',
  agua2:'Científico del Agua',
  clima2:'Meteorólogo Junior',
  pueblos2:'Historiador de Chile',
  patrimonio2:'Guardián del Patrimonio',
  paisajes2:'Explorador de Chile',
  ciudadania2:'Ciudadano Modelo',
  lineascolores2:'Artista Avanzado',
  timbrepulso2:'Oído Musical',
  cuerporesponde2:'Atleta Consciente',
  vidaactiva2:'Campeón Saludable II',
  liderazgo2:'Líder de Equipo',
  emociones2:'Experto en Emociones II',
  autocuidado2:'Guardián de mi Cuerpo II',
  habitosescolares2:'Estudiante Ejemplar',
  convivencia2:'Embajador de la Amistad II',
  tecdigital2:'Explorador Digital',
  vocabdiccionario3:'Maestro del Diccionario',
  pronombres3:'Detective de Pronombres',
  comprension3:'Lector Avanzado',
  lenguajefigurado3:'Poeta Junior',
  division3:'Divisor Experto',
  fracciones3:'Maestro de Fracciones',
  geometria3:'Arquitecto Geométrico',
  medicion3:'Medidor Avanzado',
  datos3:'Analista de Datos Junior',
  plantas3:'Botánico Avanzado',
  alimentacion3:'Nutricionista Junior II',
  luzsonido3:'Científico de la Luz',
  sistemasolar3:'Astronauta Junior',
  lunaeclipses3:'Observador Lunar',
  greciaroma3:'Historiador de la Antigüedad',
  geografiamundial3:'Explorador del Mundo',
  ciudadania3:'Ciudadano Modelo III',
  colorexpresivo3:'Artista Expresivo',
  tempoforma3:'Director de Orquesta Junior',
  cuerpoaccion3:'Atleta Consciente III',
  vidaactiva3:'Campeón Saludable III',
  seguridad3:'Capitán del Buen Juego III',
  emociones3:'Experto en Emociones III',
  autocuidado3:'Guardián de mi Cuerpo III',
  convivencia3:'Embajador de la Amistad III',
  habitosescolares3:'Estudiante Ejemplar III',
  tecdigital3:'Explorador Digital III',
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
  else if(key==='escribenombre') initEscribeNombreGame();
  else if(key==='caligrafia') initCaligrafiaGame();
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
    const name = input.value.trim();
    state.userName = name;
    saveProgress();
    if(name) showTraceStep(name); else finish();
  }
  function showTraceStep(name){
    div.innerHTML =
      '<div class="explain-card">'+
        '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(70)+'</div>'+
        '<p class="explain-title">✏️ ¡Ahora dibújalo, '+name+'!</p>'+
        '<p class="explain-text">Repasa tu nombre con el dedo o el mouse, como si lo dibujaras.</p>'+
        renderTraceCanvas('name-trace-canvas', {height:170})+
        '<button class="cta-btn" id="trace-continue-btn">¡Listo! 👍</button>'+
        '<button class="cta-btn secondary" id="trace-skip-btn" style="margin-top:8px;">Saltar por ahora</button>'+
      '</div>';
    initTraceCanvas('name-trace-canvas', name);
    document.getElementById('trace-continue-btn').onclick = finish;
    document.getElementById('trace-skip-btn').onclick = finish;
  }
  function finish(){
    div.remove();
    onDone();
  }
  document.getElementById('name-continue-btn').onclick = submit;
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') submit(); });
}

export function showResult(moduleKey, correctOrStars, total, isStarsAlready, customSub){
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
      '<p class="result-sub">'+(customSub ? customSub : (isStarsAlready ? ('Lo lograste en '+mGame.moves+' movimientos.') : ('Acertaste '+correctOrStars+' de '+total+'.')))+'</p>'+
      (isNewBadge ? '<div class="badge-unlock">🏅 ¡Insignia nueva: '+(MODULE_TITLES[moduleKey]||moduleKey)+'!</div>' : '')+
      '<div class="result-actions">'+
        '<button class="cta-btn secondary" onclick="this.closest(\'.overlay\').remove(); goBack();">Volver al mapa</button>'+
        '<button class="cta-btn" onclick="this.closest(\'.overlay\').remove(); replayGame(\''+moduleKey+'\');">Jugar de nuevo 🔁</button>'+
      '</div>'+
    '</div>';
  app.appendChild(div);
  if(stars===3){ spawnConfetti(div.querySelector('.result-card')); }
}

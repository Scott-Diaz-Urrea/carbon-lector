import { currentScreen, screenStack, state, gradeLabel, nivelLabel, level, totalStars, maxStars } from './state.js';
import { backIconSVG, starSVG, lockIconSVG, starsRow, mascotSVG } from './svg.js';
import { pathD } from './utils.js';
import { GRADES, GRADE_POS, PARVULARIA_NIVELES, PARVULARIA_NIVELES_POS } from './content/grades.js';
import { MC_KEYS, renderMCScreen, initMCGame } from './mcEngine.js';
import { renderSilabasScreen, initSilabasGame } from './games/silabas.js';
import { renderSecuenciaScreen, initSecuenciaGame } from './games/secuencia.js';
import { renderMemoramaIntro } from './games/memorama.js';
import {
  LENGUAJE_BY_GRADE, MATE_BY_GRADE, CIENCIAS_BY_GRADE, HISTORIA_BY_GRADE,
  ARTES_BY_GRADE, MUSICA_BY_GRADE, EDFISICA_BY_GRADE, ORIENTACION_BY_GRADE,
  TECNOLOGIA_BY_GRADE, SUBJECT_DEFS, NUCLEO_DEFS,
} from './gradeContent.js';

export function render(){
  const app = document.getElementById('app');
  const scr = currentScreen();
  const showBack = screenStack.length > 1;

  let body = '';
  if(scr === 'home') body = renderHome();
  else if(scr === 'etapaMap') body = renderEtapaMap();
  else if(scr === 'gradeMap') body = renderGradeMap();
  else if(scr === 'parvulariaNivelMap') body = renderParvulariaNivelMap();
  else if(scr === 'nucleoMap') body = renderNucleoMap();
  else if(scr === 'pensamientoMatematicoMap') body = renderPensamientoMatematicoMap();
  else if(scr === 'subjectMap') body = renderSubjectMap();
  else if(scr === 'lenguajeMap') body = renderLenguajeMap();
  else if(scr === 'matematicasMap') body = renderMatematicasMap();
  else if(scr === 'cienciasMap') body = renderCienciasMap();
  else if(scr === 'historiaMap') body = renderHistoriaMap();
  else if(scr === 'artesMap') body = renderArtesMap();
  else if(scr === 'musicaMap') body = renderMusicaMap();
  else if(scr === 'edfisicaMap') body = renderEdFisicaMap();
  else if(scr === 'orientacionMap') body = renderOrientacionMap();
  else if(scr === 'tecnologiaMap') body = renderTecnologiaMap();
  else if(MC_KEYS.indexOf(scr) !== -1) body = renderMCScreen();
  else if(scr === 'silabas') body = renderSilabasScreen();
  else if(scr === 'secuencia') body = renderSecuenciaScreen();
  else if(scr === 'memorama') body = renderMemoramaIntro();

  app.innerHTML =
    '<div class="topbar">'+
      '<button class="backbtn ' + (showBack?'':'hidden') + '" onclick="goBack()" aria-label="Volver">'+backIconSVG()+'</button>'+
      '<div class="topbar-right">'+
        '<div class="pill xppill">⚡ Nv.' + level() + '</div>'+
        '<div class="pill starpill">' + starSVG(true) + totalStars() + '/' + maxStars() + '</div>'+
      '</div>'+
    '</div>'+
    body +
    '<div class="toast" id="toast"></div>';

  if(MC_KEYS.indexOf(scr) !== -1) initMCGame(scr);
  else if(scr === 'silabas') initSilabasGame();
  else if(scr === 'secuencia') initSecuenciaGame();
}

function renderHome(){
  const greeting = state.userName ? '¡Hola, '+state.userName+'! Con Carboncito, tu compañero de aventuras 🐾' : 'Con Carboncito, tu compañero de aventuras 🐾';
  return '<div class="screen home-hero">'+
    '<div class="mascot-wrap"><div class="float">'+mascotSVG(190)+'</div></div>'+
    '<p class="logo-word">LEO</p>'+
    '<p class="logo-tag">'+greeting+'</p>'+
    '<button class="cta-btn" onclick="goTo(\'etapaMap\')">Comenzar aventura</button>'+
    '<div class="home-footnote"><b>Prototipo educativo</b> — organizado igual que la trayectoria escolar real: por etapa, año y materia, para calzar con lo que el colegio ya enseña. Empieza gratis con <b>1° Básico</b>: Lenguaje y Matemáticas. Por cierto: así como el carboncillo fue de los primeros materiales con los que la humanidad dibujó letras y símbolos, <b>Carboncito</b> te acompaña a trazar las tuyas.</div>'+
  '</div>';
}

function renderEtapaMap(){
  return '<div class="screen">'+
    '<p class="section-title">Elige tu etapa</p>'+
    '<p class="section-sub">La misma trayectoria del sistema escolar chileno, paso a paso.</p>'+
    '<div class="subject-list">'+
      '<button class="subject-card" onclick="goTo(\'parvulariaNivelMap\')">'+
        '<span class="subject-icon">🧸</span>'+
        '<span class="subject-info"><b>Educación Parvularia</b><small>Sala cuna · medio · transición</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'gradeMap\')">'+
        '<span class="subject-icon">📘</span>'+
        '<span class="subject-info"><b>Educación Básica</b><small>1° a 8° año</small></span>'+
      '</button>'+
      '<button class="subject-card locked" onclick="showToast(\'🚧 Etapa en preparación\')">'+
        '<span class="subject-icon">🎓</span>'+
        '<span class="subject-info"><b>Educación Media</b><small>1° a 4° medio</small></span>'+
      '</button>'+
      '<button class="subject-card locked" onclick="showToast(\'🚧 Etapa en preparación\')">'+
        '<span class="subject-icon">🌙</span>'+
        '<span class="subject-info"><b>Educación para Adultos</b><small>EPJA · jornada diurna y vespertina</small></span>'+
      '</button>'+
    '</div>'+
  '</div>';
}

function renderGradeMap(){
  const nodes = GRADES.map(function(g,i){
    const pos = GRADE_POS[i];
    const cls = g.open ? 'open' : 'locked';
    const inner = g.open ? g.id : lockIconSVG(24);
    const clickAttr = g.open ? 'onclick="selectGrade('+g.id+')"' : 'onclick="showToast(\'🚧 Este nivel está en preparación\')"';
    return '<button class="node" style="left:'+pos.x+'%; top:'+(100-pos.y)+'%;" '+clickAttr+'>'+
      '<div class="node-circle '+cls+'">'+inner+'</div>'+
      '<div class="node-label '+(g.open?'':'locked')+'">'+g.label+'</div>'+
    '</button>';
  }).join('');
  const svgPts = GRADE_POS.map(function(p){ return {x:p.x, y:100-p.y}; });

  return '<div class="screen">'+
    '<p class="section-title">Educación Básica</p>'+
    '<p class="section-sub">Cada isla junta el contenido de un año escolar completo.</p>'+
    '<div class="map-wrap" style="height:640px;">'+
      '<svg class="path-line" viewBox="0 0 100 100" preserveAspectRatio="none">'+
        '<path d="'+pathD(svgPts)+'" fill="none" stroke="#CFE7E1" stroke-width="1.6" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>'+
      '</svg>'+
      nodes+
    '</div>'+
  '</div>';
}

function renderParvulariaNivelMap(){
  const nodes = PARVULARIA_NIVELES.map(function(n,i){
    const pos = PARVULARIA_NIVELES_POS[i];
    const cls = n.open ? 'open' : 'locked';
    const inner = n.open ? n.label.slice(0,2).toUpperCase() : lockIconSVG(24);
    const clickAttr = n.open ? 'onclick="selectNivel(\''+n.id+'\')"' : 'onclick="showToast(\'🚧 Este nivel está en preparación\')"';
    return '<button class="node" style="left:'+pos.x+'%; top:'+(100-pos.y)+'%;" '+clickAttr+'>'+
      '<div class="node-circle '+cls+'">'+inner+'</div>'+
      '<div class="node-label '+(n.open?'':'locked')+'">'+n.label+'</div>'+
    '</button>';
  }).join('');
  const svgPts = PARVULARIA_NIVELES_POS.map(function(p){ return {x:p.x, y:100-p.y}; });

  return '<div class="screen">'+
    '<p class="section-title">Educación Parvularia</p>'+
    '<p class="section-sub">Sala Cuna y Nivel Medio no tienen módulos jugables — son edades donde el juego en pantalla no es desarrollo-apropiado.</p>'+
    '<div class="map-wrap" style="height:420px;">'+
      '<svg class="path-line" viewBox="0 0 100 100" preserveAspectRatio="none">'+
        '<path d="'+pathD(svgPts)+'" fill="none" stroke="#CFE7E1" stroke-width="1.6" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>'+
      '</svg>'+
      nodes+
    '</div>'+
  '</div>';
}

function nucleoStars(keys){
  return keys.reduce(function(a,k){ return a + state.stars[k]; }, 0);
}
function renderNucleoMap(){
  const n = state.currentNivel;
  const cards = NUCLEO_DEFS.map(function(nd){
    const data = nd.byNivel ? nd.byNivel[n] : null;
    if(!data){
      return '<button class="subject-card locked" onclick="showToast(\'🚧 Núcleo en preparación\')">'+
        '<span class="subject-icon">'+nd.icon+'</span>'+
        '<span class="subject-info"><b>'+nd.label+'</b><small>Próximamente</small></span>'+
      '</button>';
    }
    const keys = data.modules.filter(function(m){ return m.key; }).map(function(m){ return m.key; });
    const stars = nucleoStars(keys);
    const sub = data.modules.map(function(m){ return m.label; }).join(' · ');
    return '<button class="subject-card" onclick="goTo(\''+nd.screen+'\')">'+
      '<span class="subject-icon">'+nd.icon+'</span>'+
      '<span class="subject-info"><b>'+nd.label+'</b><small>'+sub+'</small></span>'+
      '<span class="subject-stars">⭐ '+stars+'/'+(keys.length*3)+'</span>'+
    '</button>';
  }).join('');
  return '<div class="screen">'+
    '<p class="section-title">'+nivelLabel(n)+'</p>'+
    '<p class="section-sub">Elige un núcleo de aprendizaje para empezar a jugar.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}
function renderPensamientoMatematicoMap(){
  const data = NUCLEO_DEFS.filter(function(nd){ return nd.screen==='pensamientoMatematicoMap'; })[0].byNivel[state.currentNivel];
  if(!data) return renderComingSoonSubject('Pensamiento Matemático');
  return renderModuleMap('Pensamiento Matemático','🔢 Alineado a Pensamiento Matemático · '+nivelLabel(state.currentNivel), data.modules, data.pos, data.height);
}

function subjectStars(keys){
  return keys.reduce(function(a,k){ return a + state.stars[k]; }, 0);
}
function renderSubjectMap(){
  const g = state.currentGrade;
  const cards = SUBJECT_DEFS.map(function(sd){
    const data = sd.byGrade[g];
    if(!data){
      return '<button class="subject-card locked" onclick="showToast(\'🚧 Materia en preparación\')">'+
        '<span class="subject-icon">'+sd.icon+'</span>'+
        '<span class="subject-info"><b>'+sd.label+'</b><small>Próximamente</small></span>'+
      '</button>';
    }
    const keys = data.modules.filter(function(m){ return m.key; }).map(function(m){ return m.key; });
    const stars = subjectStars(keys);
    const sub = data.modules.map(function(m){ return m.label; }).join(' · ');
    return '<button class="subject-card" onclick="goTo(\''+sd.screen+'\')">'+
      '<span class="subject-icon">'+sd.icon+'</span>'+
      '<span class="subject-info"><b>'+sd.label+'</b><small>'+sub+'</small></span>'+
      '<span class="subject-stars">⭐ '+stars+'/'+(keys.length*3)+'</span>'+
    '</button>';
  }).join('');
  return '<div class="screen">'+
    '<p class="section-title">'+gradeLabel(g)+'</p>'+
    '<p class="section-sub">Elige una materia para empezar a jugar.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}

function renderModuleMap(title, badge, modules, positions, heightPx){
  const nodes = modules.map(function(m,i){
    const pos = positions[i];
    const st = m.key ? state.stars[m.key] : 0;
    const cls = m.open ? 'open' : 'locked';
    const inner = m.open ? (st>0 ? starSVG(true).replace('<svg','<svg width="26" height="26"') : '<span>'+(i+1)+'</span>') : lockIconSVG(22);
    const clickAttr = m.open ? 'onclick="goTo(\''+m.id+'\')"' : 'onclick="showToast(\'🚧 Módulo en preparación\')"';
    return '<button class="node" style="left:'+pos.x+'%; top:'+(100-pos.y)+'%;" '+clickAttr+'>'+
      '<div class="node-circle '+cls+'">'+inner+'</div>'+
      '<div class="node-label '+(m.open?'':'locked')+'">'+m.label+'</div>'+
      (m.open ? starsRow(st) : '')+
    '</button>';
  }).join('');
  const svgPts = positions.map(function(p){ return {x:p.x, y:100-p.y}; });

  return '<div class="screen">'+
    '<span class="curric-badge">'+badge+'</span>'+
    '<p class="section-title">'+title+'</p>'+
    '<div class="map-wrap" style="height:'+heightPx+'px;">'+
      '<svg class="path-line" viewBox="0 0 100 100" preserveAspectRatio="none">'+
        '<path d="'+pathD(svgPts)+'" fill="none" stroke="#CFE7E1" stroke-width="1.6" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>'+
      '</svg>'+
      nodes+
    '</div>'+
  '</div>';
}
function renderComingSoonSubject(name){
  return '<div class="screen"><p class="section-title">'+name+'</p>'+
    '<div class="locked-panel"><span class="lock-ic">🚧</span>Estamos preparando el contenido de esta materia para este año. ¡Vuelve pronto!</div>'+
  '</div>';
}

function renderLenguajeMap(){
  const data = LENGUAJE_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Lenguaje');
  return renderModuleMap('Lenguaje','📘 Alineado a Lenguaje · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderMatematicasMap(){
  const data = MATE_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Matemáticas');
  return renderModuleMap('Matemáticas','🔢 Alineado a Matemática · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderCienciasMap(){
  const data = CIENCIAS_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Ciencias');
  return renderModuleMap('Ciencias','🔬 Alineado a Ciencias Naturales · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderHistoriaMap(){
  const data = HISTORIA_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Historia');
  return renderModuleMap('Historia','🗺️ Alineado a Historia, Geografía y Cs. Sociales · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderArtesMap(){
  const data = ARTES_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Artes Visuales');
  return renderModuleMap('Artes Visuales','🎨 Alineado a Artes Visuales · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderMusicaMap(){
  const data = MUSICA_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Música');
  return renderModuleMap('Música','🎵 Alineado a Música · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderEdFisicaMap(){
  const data = EDFISICA_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Educación Física');
  return renderModuleMap('Educación Física','⚽ Alineado a Educación Física y Salud · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderOrientacionMap(){
  const data = ORIENTACION_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Orientación');
  return renderModuleMap('Orientación','🧭 Alineado a Orientación · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}
function renderTecnologiaMap(){
  const data = TECNOLOGIA_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Tecnología');
  return renderModuleMap('Tecnología','⚙️ Alineado a Tecnología · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}

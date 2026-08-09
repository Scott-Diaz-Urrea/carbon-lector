import { currentScreen, screenStack, state, gradeLabel, nivelLabel, epjaNivelLabel, medioGradeLabel, level, totalStars, maxStars } from './state.js';
import { backIconSVG, starSVG, lockIconSVG, starsRow, mascotSVG } from './svg.js';
import { pathD } from './utils.js';
import { GRADES, GRADE_POS, EPJA_NIVELES, MEDIO_GRADES, MEDIO_GRADE_POS } from './content/grades.js';
import { MC_KEYS, renderMCScreen, initMCGame } from './mcEngine.js';
import { renderSilabasScreen, initSilabasGame } from './games/silabas.js';
import { renderSecuenciaScreen, initSecuenciaGame } from './games/secuencia.js';
import { renderMemoramaIntro } from './games/memorama.js';
import { renderEscribeNombreScreen, initEscribeNombreGame } from './games/escribenombre.js';
import { renderCaligrafiaScreen, initCaligrafiaGame } from './games/caligrafia.js';
import { renderDiccionarioScreen, initDiccionario } from './games/diccionario.js';
import { renderColorearNumerosScreen, initColorearNumeros } from './games/colorearNumeros.js';
import { APRENDO_A_LEER_MODULES, APRENDO_A_LEER_POS } from './content/aprendoALeer.js';
import {
  LENGUAJE_BY_GRADE, MATE_BY_GRADE, CIENCIAS_BY_GRADE, HISTORIA_BY_GRADE,
  ARTES_BY_GRADE, MUSICA_BY_GRADE, EDFISICA_BY_GRADE, ORIENTACION_BY_GRADE,
  TECNOLOGIA_BY_GRADE, INGLES_BY_GRADE, SUBJECT_DEFS, NUCLEO_DEFS,
  ESTUDIO_PRUEBAS_SUBMODULOS, EPJA_SUBJECT_DEFS, MEDIO_SUBJECT_DEFS,
  PLAN_GENERAL_SUBJECT_DEFS, PLAN_DIFERENCIADO_SUBJECT_DEFS,
} from './gradeContent.js';

export function render(){
  const app = document.getElementById('app');
  const scr = currentScreen();
  const showBack = screenStack.length > 1;

  let body = '';
  if(scr === 'home') body = renderHome();
  else if(scr === 'etapaMap') body = renderEtapaMap();
  else if(scr === 'gradeMap') body = renderGradeMap();
  else if(scr === 'medioGradeMap') body = renderMedioGradeMap();
  else if(scr === 'medioSubjectMap') body = renderMedioSubjectMap();
  else if(scr === 'lenguajeMedioMap') body = renderLenguajeMedioMap();
  else if(scr === 'matematicasMedioMap') body = renderMatematicasMedioMap();
  else if(scr === 'cienciasMedioMap') body = renderCienciasMedioMap();
  else if(scr === 'historiaMedioMap') body = renderHistoriaMedioMap();
  else if(scr === 'artesMedioMap') body = renderArtesMedioMap();
  else if(scr === 'musicaMedioMap') body = renderMusicaMedioMap();
  else if(scr === 'edfisicaMedioMap') body = renderEdFisicaMedioMap();
  else if(scr === 'orientacionMedioMap') body = renderOrientacionMedioMap();
  else if(scr === 'tecnologiaMedioMap') body = renderTecnologiaMedioMap();
  else if(scr === 'inglesMedioMap') body = renderInglesMedioMap();
  else if(scr === 'planMedioMap') body = renderPlanMedioMap();
  else if(scr === 'planGeneralMap') body = renderPlanGeneralMap();
  else if(scr === 'lenguaLiteraturaPlanMap') body = renderLenguaLiteraturaPlanMap();
  else if(scr === 'matematicaPlanMap') body = renderMatematicaPlanMap();
  else if(scr === 'cienciasCiudadaniaPlanMap') body = renderCienciasCiudadaniaPlanMap();
  else if(scr === 'educacionCiudadanaPlanMap') body = renderEducacionCiudadanaPlanMap();
  else if(scr === 'filosofiaPlanMap') body = renderFilosofiaPlanMap();
  else if(scr === 'inglesPlanMap') body = renderInglesPlanMap();
  else if(scr === 'planDiferenciadoMap') body = renderPlanDiferenciadoMap();
  else if(scr === 'biologiaCelularMolecularPlanMap') body = renderBiologiaCelularMolecularPlanMap();
  else if(scr === 'biologiaEcosistemasPlanMap') body = renderBiologiaEcosistemasPlanMap();
  else if(scr === 'cienciasSaludPlanMap') body = renderCienciasSaludPlanMap();
  else if(scr === 'fisicaPlanMap') body = renderFisicaPlanMap();
  else if(scr === 'quimicaPlanMap') body = renderQuimicaPlanMap();
  else if(scr === 'nucleoMap') body = renderNucleoMap();
  else if(scr === 'epjaMap') body = renderEpjaMap();
  else if(scr === 'epjaSubjectMap') body = renderEpjaSubjectMap();
  else if(scr === 'lenguajeEpjaMap') body = renderLenguajeEpjaMap();
  else if(scr === 'matematicaEpjaMap') body = renderMatematicaEpjaMap();
  else if(scr === 'cienciasEpjaMap') body = renderCienciasEpjaMap();
  else if(scr === 'estudiosSocialesEpjaMap') body = renderEstudiosSocialesEpjaMap();
  else if(scr === 'inglesEpjaMap') body = renderInglesEpjaMap();
  else if(scr === 'estudioPruebasMap') body = renderEstudioPruebasMap();
  else if(scr === 'quimicaDiagnosticaMap') body = renderQuimicaDiagnosticaMap();
  else if(scr === 'microbiologiaClinicaMap') body = renderMicrobiologiaClinicaMap();
  else if(scr === 'pensamientoMatematicoMap') body = renderPensamientoMatematicoMap();
  else if(scr === 'lenguajeVerbalMap') body = renderLenguajeVerbalMap();
  else if(scr === 'lenguajesArtisticosMap') body = renderLenguajesArtisticosMap();
  else if(scr === 'identidadAutonomiaMap') body = renderIdentidadAutonomiaMap();
  else if(scr === 'convivenciaCiudadaniaMap') body = renderConvivenciaCiudadaniaMap();
  else if(scr === 'corporalidadMovimientoMap') body = renderCorporalidadMovimientoMap();
  else if(scr === 'exploracionEntornoNaturalMap') body = renderExploracionEntornoNaturalMap();
  else if(scr === 'comprensionEntornoSocioculturalMap') body = renderComprensionEntornoSocioculturalMap();
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
  else if(scr === 'inglesMap') body = renderInglesMap();
  else if(MC_KEYS.indexOf(scr) !== -1) body = renderMCScreen();
  else if(scr === 'silabas') body = renderSilabasScreen();
  else if(scr === 'secuencia') body = renderSecuenciaScreen();
  else if(scr === 'memorama') body = renderMemoramaIntro();
  else if(scr === 'escribenombre') body = renderEscribeNombreScreen();
  else if(scr === 'caligrafia') body = renderCaligrafiaScreen();
  else if(scr === 'diccionarioEs') body = renderDiccionarioScreen('es');
  else if(scr === 'diccionarioEn') body = renderDiccionarioScreen('en');
  else if(scr === 'colorearNumeros') body = renderColorearNumerosScreen();
  else if(scr === 'aprendoALeerMap') body = renderAprendoALeerMap();

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
  else if(scr === 'escribenombre') initEscribeNombreGame();
  else if(scr === 'caligrafia') initCaligrafiaGame();
  else if(scr === 'diccionarioEs' || scr === 'diccionarioEn') initDiccionario();
  else if(scr === 'colorearNumeros') initColorearNumeros();
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
      '<button class="subject-card" onclick="selectNivel(\'nt\')">'+
        '<span class="subject-icon">🧸</span>'+
        '<span class="subject-info"><b>Educación Parvularia</b><small>Nivel de Transición</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'gradeMap\')">'+
        '<span class="subject-icon">📘</span>'+
        '<span class="subject-info"><b>Educación Básica</b><small>1° a 8° año</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'medioGradeMap\')">'+
        '<span class="subject-icon">🎓</span>'+
        '<span class="subject-info"><b>Educación Media</b><small>1° a 4° Medio disponibles</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'epjaMap\')">'+
        '<span class="subject-icon">🌙</span>'+
        '<span class="subject-info"><b>Educación para Adultos</b><small>EPJA · Todos los niveles disponibles</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'estudioPruebasMap\')">'+
        '<span class="subject-icon">🎓</span>'+
        '<span class="subject-info"><b>Estudio para Pruebas</b><small>Preparación de exámenes universitarios</small></span>'+
      '</button>'+
    '</div>'+
    '<p class="section-title dicc-section-title">Herramientas de consulta</p>'+
    '<p class="section-sub">Para acompañarte en cualquier etapa.</p>'+
    '<div class="subject-list">'+
      '<button class="subject-card" onclick="goTo(\'colorearNumeros\')">'+
        '<span class="subject-icon">🎨</span>'+
        '<span class="subject-info"><b>Colorear por Números</b><small>Pinta un dibujo y descárgalo</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'aprendoALeerMap\')">'+
        '<span class="subject-icon">🔤</span>'+
        '<span class="subject-info"><b>Aprendo a Leer</b><small>Desde reconocer letras hasta armar palabras</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'diccionarioEs\')">'+
        '<span class="subject-icon">📖</span>'+
        '<span class="subject-info"><b>Diccionario Español</b><small>Definiciones simples con voz</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'diccionarioEn\')">'+
        '<span class="subject-icon">🔤</span>'+
        '<span class="subject-info"><b>English Dictionary</b><small>Palabra, traducción y pronunciación</small></span>'+
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

function renderMedioGradeMap(){
  const nodes = MEDIO_GRADES.map(function(g,i){
    const pos = MEDIO_GRADE_POS[i];
    const cls = g.open ? 'open' : 'locked';
    const inner = g.open ? g.id : lockIconSVG(24);
    const clickAttr = g.open ? 'onclick="selectMedioGrade('+g.id+')"' : 'onclick="showToast(\'🚧 Este nivel está en preparación\')"';
    return '<button class="node" style="left:'+pos.x+'%; top:'+(100-pos.y)+'%;" '+clickAttr+'>'+
      '<div class="node-circle '+cls+'">'+inner+'</div>'+
      '<div class="node-label '+(g.open?'':'locked')+'">'+g.label+'</div>'+
    '</button>';
  }).join('');
  const svgPts = MEDIO_GRADE_POS.map(function(p){ return {x:p.x, y:100-p.y}; });
  return '<div class="screen">'+
    '<p class="section-title">Educación Media</p>'+
    '<p class="section-sub">Cada isla junta el contenido de un año escolar completo.</p>'+
    '<div class="map-wrap" style="height:560px;">'+
      '<svg class="path-line" viewBox="0 0 100 100" preserveAspectRatio="none">'+
        '<path d="'+pathD(svgPts)+'" fill="none" stroke="#CFE7E1" stroke-width="1.6" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>'+
      '</svg>'+
      nodes+
    '</div>'+
  '</div>';
}
function renderPlanMedioMap(){
  return '<div class="screen">'+
    '<p class="section-title">'+medioGradeLabel(state.currentMedioGrade)+'</p>'+
    '<p class="section-sub">Elige un plan de estudios.</p>'+
    '<div class="subject-list">'+
      '<button class="subject-card" onclick="goTo(\'planGeneralMap\')">'+
        '<span class="subject-icon">📗</span>'+
        '<span class="subject-info"><b>Plan de Formación General</b><small>Lengua, Matemática, Ciencias para la Ciudadanía, Educación Ciudadana, Filosofía, Inglés</small></span>'+
      '</button>'+
      '<button class="subject-card" onclick="goTo(\'planDiferenciadoMap\')">'+
        '<span class="subject-icon">🧪</span>'+
        '<span class="subject-info"><b>Plan Diferenciado Científico</b><small>Biología Celular y Molecular, Biología de los Ecosistemas, Ciencias de la Salud, Física, Química</small></span>'+
      '</button>'+
    '</div>'+
  '</div>';
}
function renderPlanGeneralMap(){
  const g = state.currentMedioGrade;
  const cards = PLAN_GENERAL_SUBJECT_DEFS.map(function(sd){
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
    '<p class="section-title">Plan de Formación General</p>'+
    '<p class="section-sub">'+medioGradeLabel(g)+' · Elige una materia para empezar a jugar.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}
function renderPlanGeneralSubjectMapFor(screenName, title, badgeIcon){
  const data = PLAN_GENERAL_SUBJECT_DEFS.filter(function(sd){ return sd.screen===screenName; })[0].byGrade[state.currentMedioGrade];
  return renderModuleMap(title, badgeIcon+' Alineado a '+title+' · '+medioGradeLabel(state.currentMedioGrade), data.modules, data.pos, data.height);
}
function renderLenguaLiteraturaPlanMap(){
  return renderPlanGeneralSubjectMapFor('lenguaLiteraturaPlanMap','Lengua y Literatura','📖');
}
function renderMatematicaPlanMap(){
  return renderPlanGeneralSubjectMapFor('matematicaPlanMap','Matemática','🔢');
}
function renderCienciasCiudadaniaPlanMap(){
  return renderPlanGeneralSubjectMapFor('cienciasCiudadaniaPlanMap','Ciencias para la Ciudadanía','🔬');
}
function renderEducacionCiudadanaPlanMap(){
  return renderPlanGeneralSubjectMapFor('educacionCiudadanaPlanMap','Educación Ciudadana','🏛️');
}
function renderFilosofiaPlanMap(){
  return renderPlanGeneralSubjectMapFor('filosofiaPlanMap','Filosofía','🦉');
}
function renderInglesPlanMap(){
  return renderPlanGeneralSubjectMapFor('inglesPlanMap','Inglés','🔤');
}
function renderPlanDiferenciadoMap(){
  const g = state.currentMedioGrade;
  const cards = PLAN_DIFERENCIADO_SUBJECT_DEFS.map(function(sd){
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
    '<p class="section-title">Plan Diferenciado Científico</p>'+
    '<p class="section-sub">'+medioGradeLabel(g)+' · Elige una materia para empezar a jugar.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}
function renderPlanDiferenciadoSubjectMapFor(screenName, title, badgeIcon){
  const data = PLAN_DIFERENCIADO_SUBJECT_DEFS.filter(function(sd){ return sd.screen===screenName; })[0].byGrade[state.currentMedioGrade];
  return renderModuleMap(title, badgeIcon+' Alineado a '+title+' · '+medioGradeLabel(state.currentMedioGrade), data.modules, data.pos, data.height);
}
function renderBiologiaCelularMolecularPlanMap(){
  return renderPlanDiferenciadoSubjectMapFor('biologiaCelularMolecularPlanMap','Biología Celular y Molecular','🧬');
}
function renderBiologiaEcosistemasPlanMap(){
  return renderPlanDiferenciadoSubjectMapFor('biologiaEcosistemasPlanMap','Biología de los Ecosistemas','🌎');
}
function renderCienciasSaludPlanMap(){
  return renderPlanDiferenciadoSubjectMapFor('cienciasSaludPlanMap','Ciencias de la Salud','⚕️');
}
function renderFisicaPlanMap(){
  return renderPlanDiferenciadoSubjectMapFor('fisicaPlanMap','Física','⚛️');
}
function renderQuimicaPlanMap(){
  return renderPlanDiferenciadoSubjectMapFor('quimicaPlanMap','Química','🧪');
}
function renderMedioSubjectMap(){
  const g = state.currentMedioGrade;
  const cards = MEDIO_SUBJECT_DEFS.map(function(sd){
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
    '<p class="section-title">'+medioGradeLabel(g)+'</p>'+
    '<p class="section-sub">Elige una materia para empezar a jugar.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
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
function renderNucleoMapFor(screenName, title, badgeIcon){
  const data = NUCLEO_DEFS.filter(function(nd){ return nd.screen===screenName; })[0].byNivel[state.currentNivel];
  if(!data) return renderComingSoonSubject(title);
  return renderModuleMap(title, badgeIcon+' Alineado a '+title+' · '+nivelLabel(state.currentNivel), data.modules, data.pos, data.height);
}
function renderPensamientoMatematicoMap(){
  return renderNucleoMapFor('pensamientoMatematicoMap','Pensamiento Matemático','🔢');
}
function renderLenguajeVerbalMap(){
  return renderNucleoMapFor('lenguajeVerbalMap','Lenguaje Verbal','🗣️');
}
function renderLenguajesArtisticosMap(){
  return renderNucleoMapFor('lenguajesArtisticosMap','Lenguajes Artísticos','🎭');
}
function renderIdentidadAutonomiaMap(){
  return renderNucleoMapFor('identidadAutonomiaMap','Identidad y Autonomía','💛');
}
function renderConvivenciaCiudadaniaMap(){
  return renderNucleoMapFor('convivenciaCiudadaniaMap','Convivencia y Ciudadanía','🤝');
}
function renderCorporalidadMovimientoMap(){
  return renderNucleoMapFor('corporalidadMovimientoMap','Corporalidad y Movimiento','🤸');
}
function renderExploracionEntornoNaturalMap(){
  return renderNucleoMapFor('exploracionEntornoNaturalMap','Exploración del Entorno Natural','🌱');
}
function renderComprensionEntornoSocioculturalMap(){
  return renderNucleoMapFor('comprensionEntornoSocioculturalMap','Comprensión del Entorno Sociocultural','🏘️');
}

function renderEpjaMap(){
  const cards = EPJA_NIVELES.map(function(n){
    if(!n.open){
      return '<button class="subject-card locked" onclick="showToast(\'🚧 Este nivel está en preparación\')">'+
        '<span class="subject-icon">🌙</span>'+
        '<span class="subject-info"><b>'+n.label+'</b><small>'+n.sub+'</small></span>'+
      '</button>';
    }
    return '<button class="subject-card" onclick="selectEpjaNivel(\''+n.id+'\')">'+
      '<span class="subject-icon">🌙</span>'+
      '<span class="subject-info"><b>'+n.label+'</b><small>'+n.sub+'</small></span>'+
    '</button>';
  }).join('');
  return '<div class="screen">'+
    '<p class="section-title">Educación para Adultos (EPJA)</p>'+
    '<p class="section-sub">Cada nivel agrupa varios años en un solo examen de Validación de Estudios.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}
function renderEpjaSubjectMap(){
  const n = state.currentEpjaNivel;
  const cards = EPJA_SUBJECT_DEFS.map(function(sd){
    const data = sd.byNivel[n];
    if(!data){
      return '<button class="subject-card locked" onclick="showToast(\'🚧 Asignatura en preparación\')">'+
        '<span class="subject-icon">'+sd.icon+'</span>'+
        '<span class="subject-info"><b>'+sd.label+'</b><small>Próximamente</small></span>'+
      '</button>';
    }
    const keys = data.modules.filter(function(m){ return m.key; }).map(function(m){ return m.key; });
    const stars = keys.reduce(function(a,k){ return a + state.stars[k]; }, 0);
    const sub = data.modules.map(function(m){ return m.label; }).join(' · ');
    return '<button class="subject-card" onclick="goTo(\''+sd.screen+'\')">'+
      '<span class="subject-icon">'+sd.icon+'</span>'+
      '<span class="subject-info"><b>'+sd.label+'</b><small>'+sub+'</small></span>'+
      '<span class="subject-stars">⭐ '+stars+'/'+(keys.length*3)+'</span>'+
    '</button>';
  }).join('');
  return '<div class="screen">'+
    '<p class="section-title">'+epjaNivelLabel(n)+'</p>'+
    '<p class="section-sub">Elige una asignatura para empezar a jugar.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}
function renderEpjaSubjectMapFor(screenName, title, badgeIcon){
  const data = EPJA_SUBJECT_DEFS.filter(function(sd){ return sd.screen===screenName; })[0].byNivel[state.currentEpjaNivel];
  if(!data) return renderComingSoonSubject(title);
  return renderModuleMap(title, badgeIcon+' Alineado a '+title+' · '+epjaNivelLabel(state.currentEpjaNivel)+' (EPJA)', data.modules, data.pos, data.height);
}
function renderLenguajeEpjaMap(){
  return renderEpjaSubjectMapFor('lenguajeEpjaMap','Lenguaje y Comunicación','📖');
}
function renderMatematicaEpjaMap(){
  return renderEpjaSubjectMapFor('matematicaEpjaMap','Matemática','🔢');
}
function renderCienciasEpjaMap(){
  return renderEpjaSubjectMapFor('cienciasEpjaMap','Ciencias Naturales','🔬');
}
function renderEstudiosSocialesEpjaMap(){
  return renderEpjaSubjectMapFor('estudiosSocialesEpjaMap','Estudios Sociales','🌎');
}
function renderInglesEpjaMap(){
  return renderEpjaSubjectMapFor('inglesEpjaMap','Inglés','🔤');
}

function renderEstudioPruebasMap(){
  const cards = ESTUDIO_PRUEBAS_SUBMODULOS.map(function(sd){
    if(!sd.modules){
      return '<button class="subject-card locked" onclick="showToast(\'🚧 Contenido en preparación\')">'+
        '<span class="subject-icon">'+sd.icon+'</span>'+
        '<span class="subject-info"><b>'+sd.label+'</b><small>Próximamente</small></span>'+
      '</button>';
    }
    const keys = sd.modules.filter(function(m){ return m.key; }).map(function(m){ return m.key; });
    const stars = keys.reduce(function(a,k){ return a + state.stars[k]; }, 0);
    const sub = sd.modules.map(function(m){ return m.label; }).join(' · ');
    return '<button class="subject-card" onclick="goTo(\''+sd.screen+'\')">'+
      '<span class="subject-icon">'+sd.icon+'</span>'+
      '<span class="subject-info"><b>'+sd.label+'</b><small>'+sub+'</small></span>'+
      '<span class="subject-stars">⭐ '+stars+'/'+(keys.length*3)+'</span>'+
    '</button>';
  }).join('');
  return '<div class="screen">'+
    '<p class="section-title">Estudio para Pruebas</p>'+
    '<p class="section-sub">Preparación para exámenes universitarios reales — elige un ramo.</p>'+
    '<div class="subject-list">'+cards+'</div>'+
  '</div>';
}
function renderQuimicaDiagnosticaMap(){
  const sd = ESTUDIO_PRUEBAS_SUBMODULOS.filter(function(x){ return x.id==='quimicaDiagnostica'; })[0];
  return renderModuleMap('Química Diagnóstica','🧪 Preparación de examen · Tecnología Médica, Universidad Central', sd.modules, sd.pos, sd.height);
}
function renderMicrobiologiaClinicaMap(){
  const sd = ESTUDIO_PRUEBAS_SUBMODULOS.filter(function(x){ return x.id==='microbiologiaClinica'; })[0];
  return renderModuleMap('Microbiología Clínica','🦠 Preparación de examen · Tecnología Médica, Universidad Central', sd.modules, sd.pos, sd.height);
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
/* "Aprendo a Leer": herramienta transversal (no atada a año/núcleo, ver el
   comentario en content/aprendoALeer.js), por eso reutiliza renderModuleMap()
   directo con datos fijos en vez de pasar por byGrade/byNivel como las
   asignaturas curriculares. `height:500` para los 5 nodos (robustecida
   2026-08-09 dos veces el mismo día: primero un 4° nivel, height 480; luego
   un 5° nivel "Une las Sílabas" inspirado en el Silabario Hispanoamericano,
   height subido a 500) — mismo criterio de espaciado ya usado en el resto de
   mapas de la app (paso vertical de 18% × 500px = 90px entre nodos
   consecutivos alternados, 36% × 500px = 180px entre nodos del mismo lado
   del zigzag — bastante por sobre los ~150px de espacio real que necesitan
   2 nodos del mismo lado para no solaparse, verificado con
   getBoundingClientRect() tras el cambio). */
function renderAprendoALeerMap(){
  return renderModuleMap('Aprendo a Leer', '🔤 Herramienta de lectura inicial', APRENDO_A_LEER_MODULES, APRENDO_A_LEER_POS, 500);
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
function renderInglesMap(){
  const data = INGLES_BY_GRADE[state.currentGrade];
  if(!data) return renderComingSoonSubject('Inglés');
  return renderModuleMap('Inglés','🔤 Alineado a Inglés · '+gradeLabel(state.currentGrade), data.modules, data.pos, data.height);
}

function renderMedioSubjectMapFor(screenName, title, badgeIcon){
  const data = MEDIO_SUBJECT_DEFS.filter(function(sd){ return sd.screen===screenName; })[0].byGrade[state.currentMedioGrade];
  if(!data) return renderComingSoonSubject(title);
  return renderModuleMap(title, badgeIcon+' Alineado a '+title+' · '+medioGradeLabel(state.currentMedioGrade), data.modules, data.pos, data.height);
}
function renderLenguajeMedioMap(){
  return renderMedioSubjectMapFor('lenguajeMedioMap','Lenguaje','📖');
}
function renderMatematicasMedioMap(){
  return renderMedioSubjectMapFor('matematicasMedioMap','Matemáticas','🔢');
}
function renderCienciasMedioMap(){
  return renderMedioSubjectMapFor('cienciasMedioMap','Ciencias','🔬');
}
function renderHistoriaMedioMap(){
  return renderMedioSubjectMapFor('historiaMedioMap','Historia','🗺️');
}
function renderArtesMedioMap(){
  return renderMedioSubjectMapFor('artesMedioMap','Artes Visuales','🎨');
}
function renderMusicaMedioMap(){
  return renderMedioSubjectMapFor('musicaMedioMap','Música','🎵');
}
function renderEdFisicaMedioMap(){
  return renderMedioSubjectMapFor('edfisicaMedioMap','Educación Física','⚽');
}
function renderOrientacionMedioMap(){
  return renderMedioSubjectMapFor('orientacionMedioMap','Orientación','🧭');
}
function renderTecnologiaMedioMap(){
  return renderMedioSubjectMapFor('tecnologiaMedioMap','Tecnología','⚙️');
}
function renderInglesMedioMap(){
  return renderMedioSubjectMapFor('inglesMedioMap','Inglés','🔤');
}

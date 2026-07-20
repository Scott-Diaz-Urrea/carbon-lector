import {
  genVocalRound, genPalabraRound, genComprensionRound, genCombinacionRound,
  genGramatica2Round, genComprension2Round,
} from './content/lenguaje.js';
import {
  genCountRound, genAddRound, genCompareRound, genFormaRound, genSaltaRound, genMultiplicarRound,
  genGeometria2Round, genMedicion2Round,
} from './content/matematica.js';
import {
  genSeresVivosRound, genPlantasRound, genCuerpoRound, genMaterialesRound, genDiaNocheRound,
  genVertebrados2Round, genCiclosVida2Round, genHabitats2Round, genCuerpoDentro2Round, genAgua2Round, genClima2Round,
} from './content/ciencias.js';
import {
  genCalendarioRound, genMiIdentidadRound, genSimbolosRound, genMapasRound, genComunidadRound,
  genPueblos2Round, genPatrimonio2Round, genPaisajes2Round, genCiudadania2Round,
} from './content/historia.js';
import { genColoresRound, genLineasTexturasRound, genMaterialesArteRound, genLineasColores2Round } from './content/artes.js';
import { genSonidosRound, genInstrumentosRound, genTimbrePulso2Round } from './content/musica.js';
import {
  genMovimientoRound, genVidaActivaRound, genSeguridadRound,
  genCuerpoResponde2Round, genVidaActiva2Round, genLiderazgo2Round,
} from './content/edfisica.js';
import {
  genEmocionesRound, genAutocuidadoRound, genConvivenciaRound,
  genEmociones2Round, genAutocuidado2Round, genHabitosEscolares2Round, genConvivencia2Round,
} from './content/orientacion.js';
import { genHerramientasTecRound, genTecDigital2Round } from './content/tecnologia.js';
import {
  genPatronesRound, genClasificarRound, genPosicionRound, genCuantificadoresRound,
  genSecuenciaTemporalRound, genContarVeinteRound, genSumarQuitarRound,
  genFormasCuerposRound, genMedirRound,
} from './content/parvularia/pensamientoMatematico.js';
import {
  genSilabasNTRound, genEscucharNTRound, genVocabNTRound, genLetrasNTRound,
} from './content/parvularia/lenguajeVerbal.js';
import { genApreciarNTRound } from './content/parvularia/lenguajesArtisticos.js';
import {
  genEmocionesNTRound, genAutocuidadoNTRound, genAlimentosNTRound,
} from './content/parvularia/identidadAutonomia.js';
import {
  genResolucionNTRound, genNormasNTRound, genSeguridadNTRound,
} from './content/parvularia/convivenciaCiudadania.js';
import {
  genUbicacionNTRound, genMovimientoNTRound,
} from './content/parvularia/corporalidadMovimiento.js';
import {
  genAguaSolNTRound, genMaterialesNaturalNTRound, genAnimalesPlantasNTRound,
  genCiclosNTRound, genAmbienteNTRound,
} from './content/parvularia/exploracionEntornoNatural.js';
import {
  genRolesComunidadNTRound, genObjetosTecNTRound, genInstitucionesNTRound,
  genSeguridadPrevNTRound,
} from './content/parvularia/comprensionEntornoSociocultural.js';
import { sfxCorrect, sfxWrong, sfxStreak } from './audio.js';
import { awardXP } from './state.js';
import { showExplain, showResult } from './rewards.js';

export const MC_KEYS = ['vocales','palabras','comprension','contar','sumar','comparar','formas','combinaciones','salta','multiplicar',
  'seresvivos','plantas','micuerpo','materiales','dianoche',
  'calendario','miidentidad','simbolos','mapas','comunidad',
  'colores','lineastexturas','materialesarte',
  'sonidos','instrumentos',
  'movimiento','vidaactiva','seguridad',
  'emociones','autocuidado','convivencia',
  'herramientastec',
  'patrones','clasificar','posicion','cuantificadores','secuenciatemporal',
  'contarveinte','sumarquitar','formascuerpos','medir',
  'silabasnt','escucharnt','vocabnt','letrasnt',
  'apreciarnt',
  'emocionesnt','autocuidadont','alimentosnt',
  'resolucionnt','normasnt','seguridadnt',
  'ubicacionnt','movimientont',
  'aguasolnt','materialesnaturalnt','animalesplantasnt','ciclosnt','ambientent',
  'rolescomunidadnt','objetostecnt','institucionesnt','seguridadprevnt',
  'gramatica2','comprension2','geometria2','medicion2',
  'vertebrados2','ciclosvida2','habitats2','cuerpodentro2','agua2','clima2',
  'pueblos2','patrimonio2','paisajes2','ciudadania2',
  'lineascolores2',
  'timbrepulso2',
  'cuerporesponde2','vidaactiva2','liderazgo2',
  'emociones2','autocuidado2','habitosescolares2','convivencia2',
  'tecdigital2'];

export const MC_GAMES = {
  vocales:       { title:'Vocales',          gen: genVocalRound,        rounds:10 },
  palabras:      { title:'Palabras',         gen: genPalabraRound,      rounds:10 },
  comprension:   { title:'Comprensión',      gen: genComprensionRound,  rounds:8  },
  contar:        { title:'Contar',           gen: genCountRound,        rounds:10 },
  sumar:         { title:'Sumas fáciles',    gen: genAddRound,          rounds:10 },
  comparar:      { title:'¿Cuál es mayor?',  gen: genCompareRound,      rounds:10 },
  formas:        { title:'Formas',           gen: genFormaRound,        rounds:10 },
  combinaciones: { title:'Combinaciones',    gen: genCombinacionRound,  rounds:10 },
  salta:         { title:'Salta y Cuenta',   gen: genSaltaRound,        rounds:10 },
  multiplicar:   { title:'Multiplicar',      gen: genMultiplicarRound,  rounds:10 },
  seresvivos:    { title:'Seres Vivos',      gen: genSeresVivosRound,   rounds:10 },
  plantas:       { title:'Plantas',          gen: genPlantasRound,      rounds:10 },
  micuerpo:      { title:'Mi Cuerpo',        gen: genCuerpoRound,       rounds:10 },
  materiales:    { title:'Materiales',       gen: genMaterialesRound,   rounds:10 },
  dianoche:      { title:'Día y Noche',      gen: genDiaNocheRound,     rounds:10 },
  calendario:    { title:'Calendario',       gen: genCalendarioRound,   rounds:10 },
  miidentidad:   { title:'Mi Identidad',     gen: genMiIdentidadRound,  rounds:10 },
  simbolos:      { title:'Símbolos de Chile',gen: genSimbolosRound,     rounds:10 },
  mapas:         { title:'Mapas de Chile',   gen: genMapasRound,        rounds:10 },
  comunidad:     { title:'Convivencia y Comunidad', gen: genComunidadRound, rounds:10 },
  colores:       { title:'Colores',          gen: genColoresRound,      rounds:10 },
  lineastexturas:{ title:'Líneas y Texturas',gen: genLineasTexturasRound, rounds:10 },
  materialesarte:{ title:'Materiales de Arte',gen: genMaterialesArteRound, rounds:10 },
  sonidos:       { title:'Sonidos',          gen: genSonidosRound,      rounds:10 },
  instrumentos:  { title:'Instrumentos',     gen: genInstrumentosRound, rounds:10 },
  movimiento:    { title:'Cuerpo en Movimiento', gen: genMovimientoRound, rounds:10 },
  vidaactiva:    { title:'Vida Activa y Saludable', gen: genVidaActivaRound, rounds:10 },
  seguridad:     { title:'Juego Limpio y Seguridad', gen: genSeguridadRound, rounds:10 },
  emociones:     { title:'Mis Emociones',    gen: genEmocionesRound,    rounds:10 },
  autocuidado:   { title:'Autocuidado y Hábitos', gen: genAutocuidadoRound, rounds:10 },
  convivencia:   { title:'Buena Convivencia',gen: genConvivenciaRound,  rounds:10 },
  herramientastec:{ title:'Herramientas y Materiales', gen: genHerramientasTecRound, rounds:10 },
  patrones:      { title:'Patrones',         gen: genPatronesRound,     rounds:8 },
  clasificar:    { title:'Clasificar',       gen: genClasificarRound,   rounds:8 },
  posicion:      { title:'¿Dónde está?',     gen: genPosicionRound,     rounds:8 },
  cuantificadores:{ title:'Más, Menos o Igual', gen: genCuantificadoresRound, rounds:8 },
  secuenciatemporal:{ title:'Antes y Después', gen: genSecuenciaTemporalRound, rounds:8 },
  contarveinte:  { title:'Contar hasta 20',  gen: genContarVeinteRound, rounds:8 },
  sumarquitar:   { title:'Sumar y Quitar',   gen: genSumarQuitarRound,  rounds:8 },
  formascuerpos: { title:'Formas y Cuerpos', gen: genFormasCuerposRound, rounds:8 },
  medir:         { title:'Medir',            gen: genMedirRound,        rounds:8 },
  silabasnt:     { title:'Sílabas y Sonidos', gen: genSilabasNTRound,    rounds:8 },
  escucharnt:    { title:'Escuchar y Comprender', gen: genEscucharNTRound, rounds:8 },
  vocabnt:       { title:'Vocabulario en Contexto', gen: genVocabNTRound, rounds:8 },
  letrasnt:      { title:'Letras y Sonidos', gen: genLetrasNTRound,      rounds:8 },
  apreciarnt:    { title:'Aprecia y Compara', gen: genApreciarNTRound,   rounds:8 },
  emocionesnt:   { title:'Reconoce Emociones', gen: genEmocionesNTRound, rounds:8 },
  autocuidadont: { title:'Autocuidado y Hábitos', gen: genAutocuidadoNTRound, rounds:8 },
  alimentosnt:   { title:'Alimentos y Sellos', gen: genAlimentosNTRound, rounds:8 },
  resolucionnt:  { title:'Resolución Pacífica', gen: genResolucionNTRound, rounds:8 },
  normasnt:      { title:'Normas de Convivencia', gen: genNormasNTRound, rounds:8 },
  seguridadnt:   { title:'Seguridad y Cuidado', gen: genSeguridadNTRound, rounds:8 },
  ubicacionnt:   { title:'Ubicación y Tiempo', gen: genUbicacionNTRound, rounds:8 },
  movimientont:  { title:'Movimientos del Cuerpo', gen: genMovimientoNTRound, rounds:8 },
  aguasolnt:     { title:'Agua y Sol',        gen: genAguaSolNTRound,    rounds:8 },
  materialesnaturalnt: { title:'Materiales de la Naturaleza', gen: genMaterialesNaturalNTRound, rounds:8 },
  animalesplantasnt: { title:'Animales y Plantas', gen: genAnimalesPlantasNTRound, rounds:8 },
  ciclosnt:      { title:'Ciclos de Crecimiento', gen: genCiclosNTRound, rounds:8 },
  ambientent:    { title:'Cuidado del Ambiente', gen: genAmbienteNTRound, rounds:8 },
  rolescomunidadnt: { title:'Roles de mi Comunidad', gen: genRolesComunidadNTRound, rounds:8 },
  objetostecnt:  { title:'Objetos Tecnológicos', gen: genObjetosTecNTRound, rounds:8 },
  institucionesnt: { title:'Instituciones de mi Comunidad', gen: genInstitucionesNTRound, rounds:8 },
  seguridadprevnt: { title:'Seguridad y Prevención', gen: genSeguridadPrevNTRound, rounds:8 },
  gramatica2:    { title:'Gramática',         gen: genGramatica2Round,   rounds:10 },
  comprension2:  { title:'Comprensión II',    gen: genComprension2Round, rounds:8 },
  geometria2:    { title:'Geometría',         gen: genGeometria2Round,   rounds:10 },
  medicion2:     { title:'Medición',          gen: genMedicion2Round,    rounds:10 },
  vertebrados2:  { title:'Vertebrados e Invertebrados', gen: genVertebrados2Round, rounds:10 },
  ciclosvida2:   { title:'Ciclos de Vida',    gen: genCiclosVida2Round,  rounds:8 },
  habitats2:     { title:'Hábitats y Cuidado Animal', gen: genHabitats2Round, rounds:10 },
  cuerpodentro2: { title:'Mi Cuerpo por Dentro', gen: genCuerpoDentro2Round, rounds:10 },
  agua2:         { title:'El Agua',           gen: genAgua2Round,        rounds:10 },
  clima2:        { title:'Clima e Instrumentos', gen: genClima2Round,    rounds:10 },
  pueblos2:      { title:'Pueblos Originarios', gen: genPueblos2Round,   rounds:8 },
  patrimonio2:   { title:'Patrimonio de Chile', gen: genPatrimonio2Round, rounds:8 },
  paisajes2:     { title:'Paisajes de Chile', gen: genPaisajes2Round,    rounds:8 },
  ciudadania2:   { title:'Formación Ciudadana', gen: genCiudadania2Round, rounds:8 },
  lineascolores2:{ title:'Líneas y Colores',  gen: genLineasColores2Round, rounds:10 },
  timbrepulso2:  { title:'Timbre y Pulso',    gen: genTimbrePulso2Round, rounds:8 },
  cuerporesponde2:{ title:'Mi Cuerpo Responde', gen: genCuerpoResponde2Round, rounds:10 },
  vidaactiva2:   { title:'Vida Activa y Saludable II', gen: genVidaActiva2Round, rounds:10 },
  liderazgo2:    { title:'Juego en Equipo y Liderazgo', gen: genLiderazgo2Round, rounds:10 },
  emociones2:    { title:'Mis Emociones II',  gen: genEmociones2Round,   rounds:8 },
  autocuidado2:  { title:'Autocuidado y Hábitos II', gen: genAutocuidado2Round, rounds:10 },
  habitosescolares2:{ title:'Hábitos de Trabajo Escolar', gen: genHabitosEscolares2Round, rounds:10 },
  convivencia2:  { title:'Buena Convivencia II', gen: genConvivencia2Round, rounds:8 },
  tecdigital2:   { title:'Tecnología Digital', gen: genTecDigital2Round,  rounds:8 },
};

/* ---------------- Motor de juegos de opción múltiple ---------------- */
let mc = null;

export function renderMCScreen(){
  return '<div class="screen" id="mc-screen"></div>';
}

export function initMCGame(key){
  const cfg = MC_GAMES[key];
  mc = { key: key, cfg: cfg, round: 0, correct: 0, streak: 0, total: cfg.rounds, current: null, seenPrompts: new Set() };
  drawMCRound();
}

function roundSignature(r){
  return r.promptHTML + '|' + r.options.map(function(o){ return o.label; }).slice().sort().join(',');
}

function drawMCRound(){
  const el = document.getElementById('mc-screen');
  if(!el) return;
  if(mc.round >= mc.total){ finishMC(); return; }
  let r, sig, attempts = 0;
  do{
    r = mc.cfg.gen();
    sig = roundSignature(r);
    attempts++;
  }while(mc.seenPrompts.has(sig) && attempts < 60);
  mc.seenPrompts.add(sig);
  mc.current = r;
  const optClass = r.panel ? 'option-btn panel' : (r.kind==='word' ? 'option-btn wordopt' : 'option-btn');
  const gridClass = r.cols === 2 ? 'option-grid panels' : 'option-grid';

  el.innerHTML =
    '<p class="section-title">'+mc.cfg.title+'</p>'+
    '<div class="game-progress">'+
      '<div class="progress-track"><div class="progress-fill" style="width:'+((mc.round/mc.total)*100)+'%"></div></div>'+
      '<div class="progress-num">'+(mc.round+1)+'/'+mc.total+'</div>'+
      (mc.streak>=2 ? '<div class="streak-chip">🔥 '+mc.streak+'</div>' : '')+
    '</div>'+
    '<div class="prompt-card">'+
      r.promptHTML+
      (r.speakText ? '<button class="speak-btn" onclick="speak(\''+r.speakText+'\')">🔊 Escuchar</button>' : '')+
    '</div>'+
    '<div class="'+gridClass+'" id="mcoptions">'+
      r.options.map(function(o,i){ return '<button class="'+optClass+'" data-i="'+i+'" onclick="answerMC('+i+')">'+o.label+'</button>'; }).join('')+
    '</div>';
}

export function answerMC(i){
  const r = mc.current;
  const picked = r.options[i];
  const btns = document.querySelectorAll('#mcoptions button');
  btns.forEach(function(b){ b.onclick = null; });
  const correctIdx = r.options.findIndex(function(o){ return o.value === r.correctValue; });
  const correctBtn = btns[correctIdx];
  const pickedBtn = btns[i];

  if(picked.value === r.correctValue){
    pickedBtn.classList.add('correct');
    mc.correct++;
    mc.streak++;
    sfxCorrect();
    const bonus = mc.streak>=6 ? 8 : (mc.streak>=3 ? 4 : 0);
    awardXP(8+bonus);
    if(mc.streak>=3 && mc.streak%3===0) sfxStreak();
    mc.round++;
    setTimeout(drawMCRound, 950);
  }else{
    pickedBtn.classList.add('wrong');
    if(correctBtn) correctBtn.classList.add('correct');
    mc.streak = 0;
    sfxWrong();
    mc.round++;
    const explainText = r.explain || ('La respuesta correcta era <b>'+(correctBtn ? correctBtn.textContent : '')+'</b>.');
    setTimeout(function(){ showExplain(explainText, drawMCRound); }, 700);
  }
}

export function finishMC(){
  showResult(mc.key, mc.correct, mc.total, false);
}

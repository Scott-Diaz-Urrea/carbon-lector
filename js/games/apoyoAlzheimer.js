/* =========================================================
   Apoyo para Alzheimer — herramienta transversal (no es un
   juego: sin rondas puntuadas, sin estrellas ni XP), pedido
   explícito del usuario (2026-08-09): "puedes crear un modulo
   en las herramientas para una persona con alzaimer". Aclarado
   vía AskUserQuestion antes de construir: cubre 3 necesidades
   (estimulación cognitiva, orientación día/hora/lugar,
   recordatorios de rutina) y la usa DIRECTAMENTE la persona con
   Alzheimer, no un cuidador — así que el diseño prioriza texto
   muy grande, alto contraste, pocos botones por pantalla y CERO
   menús anidados (máximo 2 niveles: el hub → una de las 3
   herramientas, nunca una tercera pantalla intermedia).

   Mismo patrón que diccionario.js/colorearNumeros.js: módulo
   autocontenido con su propio render/init, fuera del motor MC
   genérico — no tiene sentido puntuar con estrellas/XP/rachas a
   alguien haciendo orientación temporal o revisando si tomó su
   medicamento, y el feedback de "incorrecto" en rojo con sonido
   (mcEngine.js) sería inapropiado/angustiante para este público.
   Por eso los ejercicios cognitivos de acá nunca marcan en rojo
   la opción tocada: si falla, solo se resalta en verde la
   respuesta correcta, con un mensaje neutro ("Buen intento").

   Los recordatorios SÍ necesitan persistir entre sesiones (a
   diferencia de Colorear/Aprendo a Leer, efímeros por diseño) —
   usan su propia clave de localStorage
   ('leo_alz_recordatorios_v1'), nunca la de persistence.js (que
   es solo progreso de juego: XP/estrellas/nombre), mismo
   criterio de "cada herramienta maneja su propio estado" ya
   usado en games/traza.js.
   ========================================================= */
import { speak } from '../audio.js';

/* Más lento que el 0.96 por defecto de toda la app (mismo criterio que
   Aprendo a Leer), pero no tan lento como el 0.65 de ese módulo — acá se lee
   texto/oraciones completas, no una sola letra suelta, así que 0.65 se
   sentiría antinaturalmente arrastrado. */
const ALZ_SPEAK_RATE = 0.82;

function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}

/* =================== Hub principal =================== */
export function renderApoyoAlzheimerScreen(){
  return '<div class="screen alz-screen">'+
    '<p class="section-title">🧡 Apoyo para el Día a Día</p>'+
    '<p class="section-sub">Herramientas simples y con letra grande, pensadas para acompañar a una persona con Alzheimer u otra pérdida de memoria.</p>'+
    '<div class="alz-hub">'+
      '<button class="alz-hub-btn" onclick="goTo(\'alzOrientacion\')">'+
        '<span class="alz-hub-icon">🗓️</span>'+
        '<span class="alz-hub-label">¿Qué día es hoy?</span>'+
      '</button>'+
      '<button class="alz-hub-btn" onclick="goTo(\'alzRecordatorios\')">'+
        '<span class="alz-hub-icon">📋</span>'+
        '<span class="alz-hub-label">Mis recordatorios</span>'+
      '</button>'+
      '<button class="alz-hub-btn" onclick="goTo(\'alzEjercicios\')">'+
        '<span class="alz-hub-icon">🧠</span>'+
        '<span class="alz-hub-label">Ejercicios para la mente</span>'+
      '</button>'+
    '</div>'+
  '</div>';
}

/* =================== Orientación (día/hora/estación) =================== */
const DIAS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

/* Hemisferio sur (Chile): dic-ene-feb verano, mar-abr-may otoño,
   jun-jul-ago invierno, sep-oct-nov primavera. */
function estacionDelMes(mes){
  if(mes===11 || mes===0 || mes===1) return { nombre:'verano', icono:'☀️' };
  if(mes>=2 && mes<=4) return { nombre:'otoño', icono:'🍂' };
  if(mes>=5 && mes<=7) return { nombre:'invierno', icono:'❄️' };
  return { nombre:'primavera', icono:'🌸' };
}
function saludoPorHora(h){
  if(h>=6 && h<12) return 'Buenos días';
  if(h>=12 && h<20) return 'Buenas tardes';
  return 'Buenas noches';
}
function pad2(n){ return n<10 ? '0'+n : ''+n; }
function orientacionAhora(){
  const now = new Date();
  const dia = DIAS[now.getDay()];
  const mes = MESES[now.getMonth()];
  const est = estacionDelMes(now.getMonth());
  return {
    dia: dia,
    fechaTxt: dia+' '+now.getDate()+' de '+mes+' de '+now.getFullYear(),
    hora: pad2(now.getHours())+':'+pad2(now.getMinutes()),
    est: est,
    saludo: saludoPorHora(now.getHours()),
  };
}

let alzClockTimer = null;

export function renderAlzOrientacionScreen(){
  const o = orientacionAhora();
  return '<div class="screen alz-screen">'+
    '<p class="section-title">🗓️ ¿Qué día es hoy?</p>'+
    '<div class="alz-card alz-card-center">'+
      '<p class="alz-greeting" id="alz-greeting">'+o.saludo+'</p>'+
      '<p class="alz-day">'+o.dia+'</p>'+
      '<p class="alz-date">'+o.fechaTxt+'</p>'+
      '<p class="alz-time" id="alz-time">🕒 '+o.hora+'</p>'+
      '<p class="alz-season">'+o.est.icono+' Estamos en '+o.est.nombre+'</p>'+
      '<button class="alz-listen-btn" onclick="alzSpeakOrientacion()">🔊 Escuchar</button>'+
    '</div>'+
  '</div>';
}

export function initAlzOrientacion(){
  if(alzClockTimer){ clearInterval(alzClockTimer); alzClockTimer = null; }
  alzClockTimer = setInterval(function(){
    const timeEl = document.getElementById('alz-time');
    if(!timeEl){ clearInterval(alzClockTimer); alzClockTimer = null; return; }
    const o = orientacionAhora();
    timeEl.textContent = '🕒 '+o.hora;
    const greetEl = document.getElementById('alz-greeting');
    if(greetEl) greetEl.textContent = o.saludo;
  }, 15000);
}

export function alzSpeakOrientacion(){
  const o = orientacionAhora();
  speak(o.saludo+'. Hoy es '+o.fechaTxt+'. Son las '+o.hora+'. Estamos en '+o.est.nombre+'.', null, ALZ_SPEAK_RATE);
}

/* =================== Recordatorios =================== */
const ALZ_REC_KEY = 'leo_alz_recordatorios_v1';
let alzRecordatorios = [];

function loadAlzRecordatorios(){
  try{
    const raw = localStorage.getItem(ALZ_REC_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    alzRecordatorios = Array.isArray(parsed) ? parsed : [];
  }catch(e){ alzRecordatorios = []; }
}
function saveAlzRecordatorios(){
  try{ localStorage.setItem(ALZ_REC_KEY, JSON.stringify(alzRecordatorios)); }catch(e){}
}
function recordatoriosHTML(){
  if(!alzRecordatorios.length){
    return '<p class="alz-empty">Aún no tienes recordatorios.<br>Toca "Agregar recordatorio" para crear el primero.</p>';
  }
  const ordenados = alzRecordatorios.slice().sort(function(a,b){ return (a.time||'').localeCompare(b.time||''); });
  return ordenados.map(function(r){
    return '<div class="alz-rem-card'+(r.done?' alz-rem-done':'')+'">'+
      '<div class="alz-rem-top">'+
        '<span class="alz-rem-time">'+escapeHtml(r.time||'--:--')+'</span>'+
        '<button class="alz-rem-listen" onclick="alzSpeakReminder(\''+r.id+'\')" aria-label="Escuchar">🔊</button>'+
      '</div>'+
      '<p class="alz-rem-text">'+escapeHtml(r.text)+'</p>'+
      '<div class="alz-rem-actions">'+
        '<button class="alz-rem-done-btn" onclick="alzToggleDone(\''+r.id+'\')">'+(r.done?'✅ Hecho':'⬜ Marcar como hecho')+'</button>'+
        '<button class="alz-rem-del-btn" onclick="alzDeleteReminder(\''+r.id+'\')" aria-label="Eliminar">🗑️</button>'+
      '</div>'+
    '</div>';
  }).join('');
}

export function renderAlzRecordatoriosScreen(){
  loadAlzRecordatorios();
  return '<div class="screen alz-screen">'+
    '<p class="section-title">📋 Mis Recordatorios</p>'+
    '<div id="alz-rem-list" class="alz-rem-list">'+recordatoriosHTML()+'</div>'+
    '<div id="alz-rem-form-wrap"></div>'+
    '<button class="alz-add-btn" onclick="alzShowAddForm()">➕ Agregar recordatorio</button>'+
  '</div>';
}

function refreshAlzRemList(){
  const el = document.getElementById('alz-rem-list');
  if(el) el.innerHTML = recordatoriosHTML();
}
export function alzShowAddForm(){
  const wrap = document.getElementById('alz-rem-form-wrap');
  if(!wrap) return;
  wrap.innerHTML =
    '<div class="alz-card alz-form">'+
      '<label class="alz-form-label">Hora</label>'+
      '<input type="time" id="alz-form-time" class="alz-form-input" value="09:00">'+
      '<label class="alz-form-label">¿Qué hay que recordar?</label>'+
      '<input type="text" id="alz-form-text" class="alz-form-input" placeholder="Ej: Tomar el remedio de la presión" maxlength="80">'+
      '<div class="alz-form-actions">'+
        '<button class="alz-form-save" onclick="alzSaveReminder()">Guardar</button>'+
        '<button class="alz-form-cancel" onclick="alzHideAddForm()">Cancelar</button>'+
      '</div>'+
    '</div>';
  const txt = document.getElementById('alz-form-text');
  if(txt) txt.focus();
}
export function alzHideAddForm(){
  const wrap = document.getElementById('alz-rem-form-wrap');
  if(wrap) wrap.innerHTML = '';
}
export function alzSaveReminder(){
  const timeEl = document.getElementById('alz-form-time');
  const textEl = document.getElementById('alz-form-text');
  const text = ((textEl && textEl.value) || '').trim();
  if(!text){ if(textEl) textEl.focus(); return; }
  alzRecordatorios.push({
    id: 'r'+Date.now()+Math.floor(Math.random()*1000),
    time: (timeEl && timeEl.value) || '09:00',
    text: text,
    done: false,
  });
  saveAlzRecordatorios();
  alzHideAddForm();
  refreshAlzRemList();
}
export function alzToggleDone(id){
  const r = alzRecordatorios.filter(function(x){ return x.id===id; })[0];
  if(!r) return;
  r.done = !r.done;
  saveAlzRecordatorios();
  refreshAlzRemList();
}
export function alzDeleteReminder(id){
  alzRecordatorios = alzRecordatorios.filter(function(x){ return x.id!==id; });
  saveAlzRecordatorios();
  refreshAlzRemList();
}
export function alzSpeakReminder(id){
  const r = alzRecordatorios.filter(function(x){ return x.id===id; })[0];
  if(!r) return;
  speak('A las '+r.time+': '+r.text, null, ALZ_SPEAK_RATE);
}

/* =================== Ejercicios para la mente =================== */
/* Refranes tradicionales de dominio público (folclore oral, sin autor
   identificable) — completar la frase es una técnica real de estimulación
   cognitiva/reminiscencia usada con personas mayores. Los distractores son
   siempre finales de OTRO refrán real del mismo banco (nunca una palabra
   inventada), para que la actividad siga siendo un ejercicio de lenguaje
   genuino en vez de una trivia con opciones absurdas. */
const REFRANES = [
  { inicio:'Más vale tarde que', fin:'nunca' },
  { inicio:'Al mal tiempo, buena', fin:'cara' },
  { inicio:'Perro que ladra no', fin:'muerde' },
  { inicio:'A quien madruga, Dios lo', fin:'ayuda' },
  { inicio:'En boca cerrada no entran', fin:'moscas' },
  { inicio:'Camarón que se duerme, se lo lleva la', fin:'corriente' },
  { inicio:'No hay mal que dure cien', fin:'años' },
  { inicio:'Más vale pájaro en mano que ciento', fin:'volando' },
  { inicio:'Dime con quién andas y te diré quién', fin:'eres' },
  { inicio:'El que mucho abarca, poco', fin:'aprieta' },
  { inicio:'No hay peor sordo que el que no quiere', fin:'oír' },
  { inicio:'A caballo regalado no se le mira el', fin:'diente' },
  { inicio:'Cada oveja con su', fin:'pareja' },
  { inicio:'Quien mal anda, mal', fin:'acaba' },
  { inicio:'Agua que no has de beber, déjala', fin:'correr' },
  { inicio:'No por mucho madrugar amanece más', fin:'temprano' },
  { inicio:'El que no arriesga, no', fin:'gana' },
  { inicio:'Zapatero, a tus', fin:'zapatos' },
];

/* Categorización simple ("¿cuál no pertenece?") — otra técnica real de
   estimulación cognitiva. Los emoji usados están todos verificados con
   grep contra el resto del código (ya se usan en otros bancos de la app),
   siguiendo el mismo criterio que content/aprendoALeer.js: solo reutilizar
   emoji ya confirmados en pantalla, nunca uno sin verificar su soporte. */
const CATEGORIAS = [
  { grupo:[{e:'🍎',l:'Manzana'},{e:'🍌',l:'Plátano'},{e:'🍇',l:'Uva'}], intruso:{e:'🚗',l:'Auto'} },
  { grupo:[{e:'🥕',l:'Zanahoria'},{e:'🥦',l:'Brócoli'},{e:'🍅',l:'Tomate'}], intruso:{e:'🐶',l:'Perro'} },
  { grupo:[{e:'🐮',l:'Vaca'},{e:'🐷',l:'Chancho'},{e:'🐴',l:'Caballo'}], intruso:{e:'🍽️',l:'Plato'} },
  { grupo:[{e:'🐶',l:'Perro'},{e:'🐱',l:'Gato'},{e:'🐦',l:'Pájaro'}], intruso:{e:'🧦',l:'Calcetín'} },
  { grupo:[{e:'🚗',l:'Auto'},{e:'🚌',l:'Bus'},{e:'✈️',l:'Avión'}], intruso:{e:'🍞',l:'Pan'} },
  { grupo:[{e:'👕',l:'Camisa'},{e:'🧦',l:'Calcetines'},{e:'🧣',l:'Bufanda'}], intruso:{e:'🐮',l:'Vaca'} },
  { grupo:[{e:'🍽️',l:'Plato'},{e:'🥄',l:'Cuchara'},{e:'🥛',l:'Vaso de leche'}], intruso:{e:'🚲',l:'Bicicleta'} },
  { grupo:[{e:'🍇',l:'Uva'},{e:'🍌',l:'Plátano'},{e:'🍎',l:'Manzana'}], intruso:{e:'🪑',l:'Silla'} },
  { grupo:[{e:'🚲',l:'Bicicleta'},{e:'🚌',l:'Bus'},{e:'🚗',l:'Auto'}], intruso:{e:'🐷',l:'Chancho'} },
  { grupo:[{e:'🐴',l:'Caballo'},{e:'🐮',l:'Vaca'},{e:'🐷',l:'Chancho'}], intruso:{e:'🧢',l:'Gorro'} },
  { grupo:[{e:'🧣',l:'Bufanda'},{e:'🧦',l:'Calcetines'},{e:'🧢',l:'Gorro'}], intruso:{e:'🍅',l:'Tomate'} },
  { grupo:[{e:'🍅',l:'Tomate'},{e:'🥦',l:'Brócoli'},{e:'🥕',l:'Zanahoria'}], intruso:{e:'🐴',l:'Caballo'} },
  { grupo:[{e:'🐶',l:'Perro'},{e:'🐱',l:'Gato'},{e:'🐦',l:'Pájaro'}], intruso:{e:'🥄',l:'Cuchara'} },
  { grupo:[{e:'🍞',l:'Pan'},{e:'🍽️',l:'Plato'},{e:'🥄',l:'Cuchara'}], intruso:{e:'🚗',l:'Auto'} },
  { grupo:[{e:'✈️',l:'Avión'},{e:'🚌',l:'Bus'},{e:'🚲',l:'Bicicleta'}], intruso:{e:'🧣',l:'Bufanda'} },
];

function genRefranRound(){
  const item = pick(REFRANES);
  const otros = shuffle(REFRANES.filter(function(r){ return r.fin!==item.fin; })).slice(0,3).map(function(r){ return r.fin; });
  return {
    promptHTML: '<p class="alz-ex-prompt">Completa el refrán:</p><p class="alz-ex-phrase">"'+item.inicio+' ____"</p>',
    speakText: item.inicio+' '+item.fin,
    options: shuffle([item.fin].concat(otros)),
    correctValue: item.fin,
  };
}
function genCategoriaRound(){
  const item = pick(CATEGORIAS);
  const opciones = shuffle(item.grupo.concat([item.intruso]));
  return {
    promptHTML: '<p class="alz-ex-prompt">¿Cuál de estas imágenes no pertenece al grupo?</p>',
    speakText: '¿Cuál no pertenece al grupo? '+opciones.map(function(o){ return o.l; }).join(', '),
    options: opciones.map(function(o){ return o.e+' '+o.l; }),
    correctValue: item.intruso.e+' '+item.intruso.l,
  };
}
function genAlzExercise(){
  return Math.random()<0.5 ? genRefranRound() : genCategoriaRound();
}

let alzCurrentExercise = null;
let alzAnswered = false;

function exerciseHTML(){
  const ex = alzCurrentExercise;
  const optsHTML = ex.options.map(function(opt, i){
    return '<button class="alz-ex-opt" id="alz-ex-opt-'+i+'" onclick="alzAnswerExercise('+i+')">'+escapeHtml(opt)+'</button>';
  }).join('');
  return ex.promptHTML+
    '<div class="alz-ex-options">'+optsHTML+'</div>'+
    '<div class="alz-ex-feedback" id="alz-ex-feedback"></div>'+
    '<button class="alz-listen-btn" onclick="alzSpeakExercise()">🔊 Escuchar</button>';
}

export function renderAlzEjerciciosScreen(){
  alzCurrentExercise = genAlzExercise();
  alzAnswered = false;
  return '<div class="screen alz-screen">'+
    '<p class="section-title">🧠 Ejercicios para la Mente</p>'+
    '<div id="alz-ex-wrap">'+exerciseHTML()+'</div>'+
  '</div>';
}

export function alzSpeakExercise(){
  if(alzCurrentExercise) speak(alzCurrentExercise.speakText, null, ALZ_SPEAK_RATE);
}
export function alzAnswerExercise(i){
  if(alzAnswered || !alzCurrentExercise) return;
  alzAnswered = true;
  const ex = alzCurrentExercise;
  const chosen = ex.options[i];
  const isRight = chosen === ex.correctValue;
  ex.options.forEach(function(opt, idx){
    const btn = document.getElementById('alz-ex-opt-'+idx);
    if(!btn) return;
    if(opt === ex.correctValue) btn.classList.add('alz-ex-correct');
    btn.disabled = true;
  });
  const fb = document.getElementById('alz-ex-feedback');
  if(fb){
    fb.innerHTML = (isRight ? '¡Muy bien! 🎉' : 'Buen intento. La respuesta es: <b>'+escapeHtml(ex.correctValue)+'</b>')+
      '<br><button class="alz-next-btn" onclick="alzNextExercise()">🔁 Otro ejercicio</button>';
  }
}
export function alzNextExercise(){
  const wrap = document.getElementById('alz-ex-wrap');
  alzCurrentExercise = genAlzExercise();
  alzAnswered = false;
  if(wrap) wrap.innerHTML = exerciseHTML();
}

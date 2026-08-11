import { pick, shuffle, randInt } from '../utils.js';
import { chileFlagSVG } from '../svg.js';

export const HISTORIA_MODULES = [
  {id:'calendario', label:'Calendario', open:true, key:'calendario'},
  {id:'miidentidad', label:'Mi Identidad', open:true, key:'miidentidad'},
  {id:'simbolos', label:'Símbolos de Chile', open:true, key:'simbolos'},
  {id:'mapas', label:'Mapas de Chile', open:true, key:'mapas'},
  {id:'comunidad', label:'Convivencia y Comunidad', open:true, key:'comunidad'},
  {id:'examenhistoria1', label:'Examen Final', open:true, key:'examenhistoria1'},
];
/* 6° nodo agregado (2026-08-09, "Examen Final") — mismo espaciado
   height:600 ya verificado sin solapamiento en Matemática/Lenguaje/
   Ciencias 1° básico. */
export const HISTORIA_POS = [{x:22,y:92},{x:68,y:76},{x:24,y:60},{x:70,y:44},{x:24,y:28},{x:70,y:12}];

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 1° Básico ----------------
   Basado en OA del Decreto 439/2012 (curriculumnacional.cl):
   HI01 OA01 -> Calendario · HI01 OA02-04 -> Mi Identidad ·
   HI01 OA05-06 -> Símbolos de Chile · HI01 OA08-10 -> Mapas de Chile ·
   HI01 OA11,13-15 -> Convivencia y Comunidad.
   OA07 (personajes históricos) y OA12 (niños del mundo) quedaron fuera para no
   arriesgar datos históricos inexactos o generalizaciones culturales sin fuente. */
const DIAS_SEMANA = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES_ANIO = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const RUTINA_DIARIA = [
  { emoji:'☀️', label:'Despertar', order:1 },
  { emoji:'🥣', label:'Desayunar', order:2 },
  { emoji:'🎒', label:'Ir al colegio', order:3 },
  { emoji:'🍽️', label:'Almorzar', order:4 },
  { emoji:'🤸', label:'Jugar en la tarde', order:5 },
  { emoji:'🍲', label:'Cenar', order:6 },
  { emoji:'🛌', label:'Dormir', order:7 },
];
const FAMILIA_BANK = [
  { emoji:'👵', q:'¿Cómo le dices a la mamá de tu mamá o de tu papá?', correct:'Abuela' },
  { emoji:'👴', q:'¿Cómo le dices al papá de tu mamá o de tu papá?', correct:'Abuelo' },
  { emoji:'👦', q:'¿Cómo le dices al hijo de tus papás, además de ti?', correct:'Hermano' },
  { emoji:'👨‍👩‍👧', q:'¿Cómo se llama el grupo de personas con las que vives y te quieren?', correct:'Familia' },
  { emoji:'🧑', q:'¿Cómo le dices al hermano de tu mamá o de tu papá?', correct:'Tío' },
];
const FAMILIA_OPTS_POOL = ['Abuela','Abuelo','Hermano','Familia','Tío','Tía','Primo','Mamá'];

const CHILE_TIPICO = [
  { svg:true, label:'La bandera de Chile', tipico:true },
  { emoji:'🦅', label:'El cóndor, ave representativa de Chile', tipico:true },
  { emoji:'🦌', label:'El huemul, animal representativo de Chile', tipico:true },
  { emoji:'🥟', label:'La empanada, comida típica chilena', tipico:true },
  { emoji:'💃', label:'La cueca, baile típico chileno', tipico:true },
  { emoji:'⛰️', label:'La cordillera de los Andes', tipico:true },
  { emoji:'🍕', label:'La pizza', tipico:false },
  { emoji:'🗼', label:'La Torre Eiffel', tipico:false },
  { emoji:'🐼', label:'El panda gigante', tipico:false },
  { emoji:'🍣', label:'El sushi', tipico:false },
];

const PAISAJES_CHILE = [
  { emoji:'🏖️', label:'Playa', desc:'Lugar con arena y mar donde vamos a nadar y tomar sol.' },
  { emoji:'⛰️', label:'Montaña', desc:'Lugar alto y rocoso, a veces con nieve en la punta.' },
  { emoji:'🌾', label:'Campo', desc:'Lugar con cultivos, animales y mucho espacio verde.' },
  { emoji:'🏙️', label:'Ciudad', desc:'Lugar con muchos edificios, autos y personas.' },
  { emoji:'🏜️', label:'Desierto', desc:'Lugar muy seco, con poca lluvia y mucha arena.' },
  { emoji:'🌲', label:'Bosque', desc:'Lugar con muchos árboles y animales silvestres.' },
];
const CHILE_GEO_FACTS = [
  { emoji:'🌊', q:'¿Cuál es el océano que está al lado de Chile?', correct:'Océano Pacífico', opts:['Océano Atlántico','Mar Mediterráneo','Océano Índico'] },
  { emoji:'⛰️', q:'¿Cuál es la cordillera (cadena de montañas) más importante de Chile?', correct:'Cordillera de los Andes', opts:['Himalaya','Montes Alpes','Montañas Rocosas'] },
];

const OFICIOS_BANK = [
  { emoji:'👨‍🍳', label:'Cocinero(a)', desc:'Prepara comida en restaurantes o en casa.' },
  { emoji:'👩‍⚕️', label:'Doctor(a)', desc:'Cuida la salud de las personas y las ayuda cuando están enfermas.' },
  { emoji:'👮', label:'Carabinero(a)', desc:'Cuida la seguridad de las personas en la calle.' },
  { emoji:'👨‍🌾', label:'Agricultor(a)', desc:'Cultiva la tierra para producir frutas y verduras.' },
  { emoji:'👩‍🏫', label:'Profesor(a)', desc:'Enseña a los niños y niñas en la escuela.' },
  { emoji:'🧑‍🚒', label:'Bombero(a)', desc:'Apaga incendios y ayuda en emergencias.' },
  { emoji:'👷', label:'Constructor(a)', desc:'Construye casas y edificios.' },
];
const INSTITUCIONES_BANK = [
  { emoji:'🏫', label:'La escuela', desc:'Lugar donde los niños y niñas aprenden.' },
  { emoji:'🏥', label:'El hospital', desc:'Lugar donde atienden a personas enfermas.' },
  { emoji:'🚓', label:'Carabineros', desc:'Institución que cuida la seguridad de todos.' },
  { emoji:'🏛️', label:'La municipalidad', desc:'Institución que organiza y cuida la comuna.' },
  { emoji:'🚒', label:'Los bomberos', desc:'Institución que apaga incendios y ayuda en emergencias.' },
];
/* "Botar la basura en el suelo" (bueno:false) usaba 🗑️ — un basurero, que
   en realidad representa la buena acción de botar la basura EN SU LUGAR,
   al revés de lo que describe el texto (botarla en el suelo). Se cambió a
   🚯 ("prohibido botar basura"), que sí ilustra que esa conducta está mal. */
const NORMAS_CONVIVENCIA = [
  { emoji:'🙋', label:'Levantar la mano antes de hablar en clases', bueno:true },
  { emoji:'🤝', label:'Compartir los juguetes con los demás', bueno:true },
  { emoji:'🚦', label:'Cruzar la calle por el paso peatonal', bueno:true },
  { emoji:'🚯', label:'Botar la basura en el suelo', bueno:false },
  { emoji:'😡', label:'Empujar a un compañero para pasar primero', bueno:false },
];

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/historia-geografia-ciencias-sociales/2-basico):
   HI02 OA10-11 -> Pueblos Originarios (zona geográfica) · HI02 OA09 ->
   Patrimonio de Chile (natural) · HI02 OA06-08 -> Paisajes de Chile (zonas) ·
   HI02 OA12-16 -> Formación Ciudadana.
   Quedan fuera: OA01-02 (modos de vida detallados de pueblos precolombinos) y
   OA03-04 (aportes culturales/lingüísticos específicos) — para no arriesgar
   datos históricos o etimológicos inexactos sin una fuente adicional más
   profunda que la lista de OA (mismo criterio que excluyó "personajes
   históricos" en 1° básico); OA05 (patrimonio cultural general) no se repite
   porque ya lo cubre "Símbolos de Chile" de 1° básico. */
export const HISTORIA_MODULES_G2 = [
  {id:'pueblos2', label:'Pueblos Originarios', open:true, key:'pueblos2'},
  {id:'patrimonio2', label:'Patrimonio de Chile', open:true, key:'patrimonio2'},
  {id:'paisajes2', label:'Paisajes de Chile', open:true, key:'paisajes2'},
  {id:'ciudadania2', label:'Formación Ciudadana', open:true, key:'ciudadania2'},
  {id:'examenhistoria2', label:'Examen Final', open:true, key:'examenhistoria2'},
];
export const HISTORIA_POS_G2 = [{x:22,y:90},{x:68,y:71},{x:24,y:53},{x:70,y:31},{x:24,y:10}];

/* Se agregaron Diaguita (Norte Chico) y Picunche (Zona Central, antes del
   ensanche mapuche hacia el norte) — antes solo había 3 pueblos y ninguno
   caía en la zona CENTRO, que igual aparecía como opción en ZONAS_POOL sin
   nunca ser la respuesta correcta. Con 5 pueblos × 2 modos de pregunta
   (zona↔pueblo) el banco pasa de 6 a 10 combinaciones únicas, por encima
   de rounds:8 (antes garantizaba una repetición en cada partida). */
const PUEBLOS_BANK = [
  { emoji:'🏔️', pueblo:'Aimara', zona:'Norte' },
  { emoji:'🌲', pueblo:'Mapuche', zona:'Sur' },
  { emoji:'🗿', pueblo:'Rapa Nui', zona:'Isla de Pascua' },
  { emoji:'🏺', pueblo:'Diaguita', zona:'Norte' },
  { emoji:'🌳', pueblo:'Picunche', zona:'Centro' },
];
const ZONAS_POOL = ['Norte','Sur','Centro','Isla de Pascua'];

/* "La Gran Muralla China" usaba 🕌 (una mezquita, sin relación alguna con
   una muralla) — se cambió a 🧱 (ladrillos), que evoca al menos la idea de
   un muro largo hecho de bloques, ya que no existe un emoji específico de
   "gran muralla". */
const PATRIMONIO_NATURAL_BANK = [
  { emoji:'⛰️', label:'El Parque Nacional Torres del Paine, en la Patagonia chilena', tipico:true },
  { emoji:'🏜️', label:'El Desierto de Atacama, en el norte de Chile', tipico:true },
  { emoji:'🌋', label:'El Parque Nacional Conguillío, con el volcán Llaima', tipico:true },
  { emoji:'🦌', label:'El huemul, animal chileno en peligro de extinción', tipico:true },
  { emoji:'🗼', label:'La Torre Eiffel', tipico:false },
  { emoji:'🐼', label:'El panda gigante, animal de China', tipico:false },
  { emoji:'🧱', label:'La Gran Muralla China', tipico:false },
  { emoji:'🗽', label:'La Estatua de la Libertad', tipico:false },
];

/* Ampliado de 6 a 10 ítems (antes garantizaba una repetición en cada
   partida de rounds:8) con paisajes igual de reales y reconocibles: los
   salares (Salar de Atacama) en el norte, los volcanes activos (Villarrica,
   Llaima) en el sur, los puertos (Valparaíso, San Antonio) en el centro, y
   los archipiélagos (Chiloé) en el sur. */
const PAISAJES_ZONA_BANK = [
  { emoji:'🏜️', label:'Desierto', zona:'Norte' },
  { emoji:'⛰️', label:'Altiplano', zona:'Norte' },
  { emoji:'🧂', label:'Salares', zona:'Norte' },
  { emoji:'🍇', label:'Valles y viñedos', zona:'Centro' },
  { emoji:'🏙️', label:'Grandes ciudades', zona:'Centro' },
  { emoji:'⚓', label:'Puertos', zona:'Centro' },
  { emoji:'🌲', label:'Bosques y lagos', zona:'Sur' },
  { emoji:'🧊', label:'Glaciares y fiordos', zona:'Sur' },
  { emoji:'🌋', label:'Volcanes', zona:'Sur' },
  { emoji:'🏝️', label:'Archipiélagos e islas', zona:'Sur' },
];

/* Ampliado de 5 a 8 ítems (antes garantizaba una repetición en cada
   partida de rounds:8). */
const CIUDADANIA_BANK = [
  { correcta:'Cuidar los espacios públicos como plazas y parques', incorrectas:['Rayar los muros de la plaza','Botar basura en el parque','Romper los juegos infantiles'] },
  { correcta:'Decir la verdad aunque hayas cometido un error', incorrectas:['Mentir para no tener problemas','Culpar a otro de tu error','Esconder lo que hiciste'] },
  { correcta:'Respetar las opiniones distintas a la tuya', incorrectas:['Burlarte de quien piensa diferente','Ignorar las ideas de los demás','Enojarte si no piensan como tú'] },
  { correcta:'Cumplir con tus deberes escolares', incorrectas:['Copiar las tareas de un compañero','Dejar todo para el final sin avisar','No traer los materiales pedidos'] },
  { correcta:'Integrar a otros en tus juegos, sin discriminar', incorrectas:['Dejar fuera a un compañero por cómo se ve','No dejar jugar a alguien por su nombre','Burlarte de las costumbres de otro niño'] },
  { correcta:'Votar o participar cuando el curso decide algo en conjunto', incorrectas:['Decidir todo sin preguntarle a nadie más','Ignorar lo que el curso decidió','Enojarte si la mayoría elige otra cosa'] },
  { correcta:'Seguir las normas del colegio aunque nadie te esté mirando', incorrectas:['Solo portarte bien cuando te ven','Romper las normas si crees que no importan','Culpar a otros de tu mal comportamiento'] },
  { correcta:'Ayudar a cuidar el medioambiente de tu barrio', incorrectas:['Contaminar porque no es tu casa','Cortar árboles del parque sin razón','Dejar la llave del agua abierta sin necesidad'] },
  { correcta:'Tratar con respeto a todas las personas de tu comunidad', incorrectas:['Burlarte de alguien por cómo habla o se viste','Tratar mal a alguien por ser distinto','Excluir a alguien de un grupo sin motivo'] },
];

/* Niveles (2026-08-11): en los 4 generadores de este módulo el nombre del
   pueblo/zona/práctica siempre va en texto dentro de la pregunta, así que
   nunca se necesita reemplazar el prompt entero (mismo criterio ya
   aplicado en Calendario/Mi Identidad de 1° básico) — solo se ajusta la
   cantidad de opciones (fácil) y se oculta el emoji decorativo (difícil). */
export function genPueblos2Round(nivel){
  const recurso = 'Antes de la llegada de los españoles, distintos <b>pueblos originarios</b> ya vivían en lo que hoy es Chile, cada uno adaptado a la zona geográfica donde habitaba: por ejemplo, pueblos del norte se adaptaron al desierto, y pueblos del sur a los bosques y el frío. La zona donde vivía cada pueblo influía directamente en cómo se alimentaban, qué materiales usaban para construir, y qué actividades realizaban — no es casualidad, sino una adaptación inteligente al entorno natural disponible. Conocer qué pueblo vivió en cada zona te ayuda a entender que Chile tiene una historia y una diversidad cultural mucho más larga que solo desde la llegada de los españoles.';
  const item = pick(PUEBLOS_BANK);
  const askZona = Math.random()<0.5;
  const showEmoji = nivel !== 'dificil';
  if(askZona){
    let opts = shuffle(ZONAS_POOL);
    if(nivel==='facil'){
      const wrong = opts.filter(function(z){ return z!==item.zona; });
      opts = shuffle([item.zona, pick(wrong)]);
    }
    opts = opts.map(function(z){ return {label:z, value:z}; });
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">¿En qué zona de Chile vivía tradicionalmente el pueblo '+item.pueblo+'?</p>',
      options: opts, correctValue: item.zona, speakText: '¿En qué zona vivía el pueblo '+item.pueblo+'?', cols:2, panel:true,
      explain: 'El pueblo <b>'+item.pueblo+'</b> vivía tradicionalmente en la zona <b>'+item.zona+'</b>.',
      recurso: recurso,
    };
  }
  let distract = PUEBLOS_BANK.filter(function(p){ return p.pueblo!==item.pueblo; }).map(function(p){ return p.pueblo; });
  distract = shuffle(distract).slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.pueblo].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Qué pueblo originario vivía tradicionalmente en la zona '+item.zona+'?</p>',
    options: opts, correctValue: item.pueblo, speakText: '¿Qué pueblo vivía en la zona '+item.zona+'?', cols:4, kind:'word',
    explain: 'El pueblo <b>'+item.pueblo+'</b> vivía tradicionalmente en la zona '+item.zona+'.',
    recurso: recurso,
  };
}

export function genPatrimonio2Round(nivel){
  const recurso = 'El <b>patrimonio natural</b> son los lugares, paisajes y elementos de la naturaleza que un país considera valiosos y dignos de proteger, porque representan algo único de su geografía o su historia — como un volcán, un desierto o un glaciar reconocible. A diferencia del patrimonio cultural (edificios, tradiciones, comidas creadas por personas), el patrimonio natural existe sin que el ser humano lo haya construido, pero igual necesita ser cuidado y protegido para que las próximas generaciones también puedan disfrutarlo. Reconocer qué lugares son patrimonio natural de Chile te ayuda a valorar y cuidar mejor el entorno natural de tu propio país.';
  const item = pick(PATRIMONIO_NATURAL_BANK);
  const opts = shuffle([{label:'Patrimonio natural de Chile', value:true},{label:'No es de Chile', value:false}]);
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.tipico, speakText: item.label, cols:2, panel:true,
    explain: item.tipico ? item.label+' <b>es patrimonio natural de Chile</b>.' : item.label+' <b>no es de Chile</b>.',
    recurso: recurso,
  };
}

export function genPaisajes2Round(nivel){
  const recurso = 'Chile es un país muy largo (más de 4.000 km de norte a sur), por eso tiene paisajes tan distintos según la zona: el desierto árido en el norte, valles y costas templadas en la zona central, bosques y lluvia abundante en el sur, y hielos y glaciares en el extremo sur. Esta variedad de paisajes se debe principalmente al clima de cada zona, que cambia según qué tan cerca o lejos está del ecuador y de la cordillera. Reconocer qué paisaje corresponde a cada zona te ayuda a entender por qué la vida, los animales y las actividades de la gente son tan distintas entre el norte y el sur de un mismo país.';
  const item = pick(PAISAJES_ZONA_BANK);
  let distract = PAISAJES_ZONA_BANK.filter(function(p){ return p.zona!==item.zona; }).map(function(p){ return p.zona; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  distract = shuffle(distract).slice(0, nivel==='facil' ? 1 : distract.length);
  const opts = shuffle([item.zona].concat(distract)).map(function(z){ return {label:z, value:z}; });
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">¿En qué zona de Chile encuentras principalmente '+item.label.toLowerCase()+'?</p>',
    options: opts, correctValue: item.zona, speakText: '¿En qué zona encuentras '+item.label+'?', cols:4, kind:'word',
    explain: item.label+' se encuentra principalmente en la zona <b>'+item.zona+'</b> de Chile.',
    recurso: recurso,
  };
}

export function genCiudadania2Round(nivel){
  const recurso = 'La <b>formación ciudadana</b> son las conductas y valores que necesitas para convivir bien dentro de una sociedad más grande que tu familia o tu curso: respetar las normas, ser honesto, cuidar los espacios públicos, y colaborar con los demás sin esperar algo a cambio. Estas prácticas parecen simples, pero son la base de cómo funciona una comunidad —desde tu barrio hasta el país completo—: si cada persona actúa con buena convivencia ciudadana, todos se benefician; si muchas personas no lo hacen, la convivencia se hace difícil para todos. Aprender a reconocer estas buenas prácticas desde pequeño te prepara para ser un ciudadano responsable de adulto.';
  const item = pick(CIUDADANIA_BANK);
  let opts2 = item.incorrectas;
  if(nivel==='facil'){ opts2 = shuffle(opts2).slice(0,1); }
  const opts = shuffle([item.correcta].concat(opts2)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de convivencia ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de convivencia ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es una buena práctica de convivencia ciudadana.',
    recurso: recurso,
  };
}

/* "Examen Final" 2° básico Historia: mezcla los 4 módulos del año + los 3
   niveles al azar, mismo patrón ya validado en el resto de 2° básico. */
export function genExamenHistoria2Round(){
  const gens = [genPueblos2Round, genPatrimonio2Round, genPaisajes2Round, genCiudadania2Round];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

function calStripHTML(list, todayIdx){
  const nextIdx = (todayIdx+1)%list.length;
  return '<div class="cal-strip">'+list.map(function(name,i){
    const cls = i===todayIdx ? 'cal-today' : (i===nextIdx ? 'cal-next' : '');
    const label = i===nextIdx ? '?' : name.slice(0,3);
    return '<span class="cal-chip '+cls+'">'+label+'</span>';
  }).join('')+'</div>';
}

/* Niveles de dificultad (2026-08-09, mismo motor que Matemática/Lenguaje/
   Ciencias 1° básico). `nivel` opcional; sin argumento, comportamiento
   original. En los 5 generadores de este archivo el texto de la pregunta
   (día/mes/item.q/item.desc/item.label) SIEMPRE queda visible sin
   importar el nivel — solo se alterna el apoyo visual (tira de
   calendario, emoji) y la cantidad de opciones — evitando a propósito el
   bug ya encontrado en Ciencias Naturales (un prompt que colapsa a texto
   fijo rompe la firma de ronda y garantiza repetición). */
export function genCalendarioRound(nivel){
  const recurso = 'El calendario organiza el tiempo en unidades que siempre se repiten en el mismo orden: la semana tiene 7 días (lunes a domingo) y el año tiene 12 meses (enero a diciembre), y ambos ciclos vuelven a empezar apenas terminan — después de domingo viene lunes otra vez, y después de diciembre viene enero otra vez. Saber qué día o mes viene después te ayuda a ubicarte en el tiempo: a planificar cuándo es tu cumpleaños, cuándo tienes una prueba, o cuánto falta para las vacaciones. Esta habilidad de "orientarse en el tiempo" es la base para entender cosas más complejas más adelante, como leer una fecha o entender cuánto tiempo pasó entre dos eventos.';
  /* La tira visual ya muestra la secuencia completa con un "?" en la
     posición de la respuesta — un apoyo fuerte que se saca en difícil,
     dejando solo la oración de texto (que igual nombra el día/mes de
     hoy, así que sigue siendo resoluble de memoria). */
  const showStrip = nivel !== 'dificil';
  if(Math.random()<0.5){
    const idx = randInt(0, DIAS_SEMANA.length-1);
    const dia = DIAS_SEMANA[idx];
    const next = DIAS_SEMANA[(idx+1)%DIAS_SEMANA.length];
    let distract = shuffle(DIAS_SEMANA.filter(function(d){ return d!==next && d!==dia; }));
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([next].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: (showStrip ? calStripHTML(DIAS_SEMANA, idx) : '')+'<p class="prompt-hint">Si hoy es <b>'+dia+'</b>, ¿qué día viene después?</p>',
      options: opts, correctValue: next, speakText: '¿Qué día viene después de '+dia+'?', cols:4, kind:'word',
      explain: 'Después de <b>'+dia+'</b> viene <b>'+next+'</b>.',
      recurso: recurso,
    };
  }
  const idx = randInt(0, MESES_ANIO.length-1);
  const mes = MESES_ANIO[idx];
  const next = MESES_ANIO[(idx+1)%MESES_ANIO.length];
  let distract = shuffle(MESES_ANIO.filter(function(m){ return m!==next && m!==mes; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([next].concat(distract)).map(function(m){ return {label:m, value:m}; });
  return {
    promptHTML: (showStrip ? calStripHTML(MESES_ANIO, idx) : '')+'<p class="prompt-hint">Si estamos en <b>'+mes+'</b>, ¿qué mes viene después?</p>',
    options: opts, correctValue: next, speakText: '¿Qué mes viene después de '+mes+'?', cols:4, kind:'word',
    explain: 'Después de <b>'+mes+'</b> viene <b>'+next+'</b>.',
    recurso: recurso,
  };
}

export function genMiIdentidadRound(nivel){
  const recurso = 'Tu identidad incluye la <b>rutina diaria</b> que sigues (despertar, ir al colegio, jugar, dormir) y la <b>familia</b> que te rodea, con sus distintos integrantes y roles. Reconocer el orden de tu rutina — qué pasa primero y qué pasa después — te ayuda a entender el paso del tiempo dentro de un mismo día, igual que aprender los días de la semana te ayuda a entender el tiempo en general. Y reconocer a los integrantes de una familia y cómo se llaman (mamá, papá, hermanos, abuelos) te ayuda a entender que cada persona en tu vida tiene un rol distinto, y que las familias pueden estar formadas de maneras distintas mientras se cuiden entre sí.';
  if(Math.random()<0.5){
    /* Acá el emoji va DENTRO de las opciones (no del prompt), así que no
       hay nada que ocultar en difícil — en su lugar, difícil elige un par
       de actividades consecutivas en la rutina (más difícil de ordenar) y
       fácil fuerza una diferencia grande y obvia, mismo criterio que la
       comparación de tamaños de fruta en Ciencias. */
    let a, b;
    if(nivel==='facil'){
      a = pick(RUTINA_DIARIA);
      const far = RUTINA_DIARIA.filter(function(r){ return r.label!==a.label && Math.abs(r.order-a.order)>=3; });
      b = far.length ? pick(far) : pick(RUTINA_DIARIA.filter(function(r){ return r.label!==a.label; }));
    }else if(nivel==='dificil'){
      a = pick(RUTINA_DIARIA);
      const close = RUTINA_DIARIA.filter(function(r){ return r.label!==a.label && Math.abs(r.order-a.order)===1; });
      b = close.length ? pick(close) : pick(RUTINA_DIARIA.filter(function(r){ return r.label!==a.label; }));
    }else{
      a = pick(RUTINA_DIARIA); b = pick(RUTINA_DIARIA);
      while(b.label === a.label) b = pick(RUTINA_DIARIA);
    }
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    return {
      promptHTML: '<p class="prompt-hint">¿Qué pasa primero en tu día?</p>',
      options: opts, correctValue: a.order<b.order ? a.label : b.label, speakText: '¿Qué pasa primero?', cols:2, panel:true,
      explain: (a.order<b.order ? a.label : b.label)+' pasa antes que '+(a.order<b.order ? b.label : a.label)+' en un día normal.',
      recurso: recurso,
    };
  }
  const showEmoji = nivel !== 'dificil';
  const item = pick(FAMILIA_BANK);
  let distract = shuffle(FAMILIA_OPTS_POOL.filter(function(w){ return w!==item.correct; }));
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.correct].concat(distract)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.q+'</p>',
    options: opts, correctValue: item.correct, speakText: item.q, cols:4, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correct+'</b>.',
    recurso: recurso,
  };
}

export function genSimbolosRound(nivel){
  const recurso = 'Los <b>símbolos patrios</b> (la bandera, el escudo, el himno) representan a todo un país y a la gente que vive en él — por eso se les trata con respeto especial, como cantarlo de pie o izarla en fechas importantes. Además de esos símbolos oficiales, cada país tiene elementos "típicos" que lo representan culturalmente: comidas, bailes, animales o paisajes que la gente reconoce como parte de su identidad, aunque no sean un símbolo oficial. Reconocer qué es realmente típico de Chile (y qué pertenece a otro país o cultura) te ayuda a entender mejor tu propia identidad como parte de una comunidad más grande, el país donde vives.';
  const item = pick(CHILE_TIPICO);
  const opts = shuffle([{label:'Típico de Chile', value:true},{label:'No es de Chile', value:false}]);
  const visual = item.svg ? '<div class="shape-display">'+chileFlagSVG(90)+'</div>' : '<span class="prompt-emoji">'+item.emoji+'</span>';
  /* Ya binario (2 opciones, no se puede reducir más en fácil) — item.label
     es una descripción completa ("El cóndor, ave representativa de
     Chile"), así que el visual es decorativo y se puede sacar en difícil
     sin perder información real. */
  const showVisual = nivel !== 'dificil';
  return {
    promptHTML: (showVisual ? visual : '')+'<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.tipico, speakText: item.label, cols:2, panel:true,
    explain: item.tipico ? item.label+' <b>es típico o representativo de Chile</b>.' : item.label+' <b>no es de Chile</b>, es de otro país o cultura.',
    recurso: recurso,
  };
}

export function genMapasRound(nivel){
  const recurso = 'Un <b>paisaje</b> es cómo se ve un lugar según su geografía: montañas, valles, playas, desiertos o bosques se distinguen por su forma, su clima y lo que crece o vive ahí. Chile tiene paisajes muy distintos de norte a sur (desde el desierto en el norte hasta glaciares en el sur) porque es un país muy largo y angosto. Un <b>mapa</b> es un dibujo que representa estos lugares desde arriba, y te ayuda a entender dónde está cada cosa y cómo se relacionan entre sí, aunque nunca hayas estado ahí en persona. Aprender a reconocer paisajes y datos básicos de la geografía de tu país es el primer paso para poder leer mapas más complejos en el futuro.';
  const showEmoji = nivel !== 'dificil';
  if(Math.random()<0.5){
    const item = pick(PAISAJES_CHILE);
    let distract = shuffle(PAISAJES_CHILE.filter(function(p){ return p.label!==item.label; })).map(function(p){ return p.label; });
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([item.label].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa descripción corresponde a una <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(CHILE_GEO_FACTS);
  let distract = item.opts;
  if(nivel==='facil') distract = shuffle(distract.slice()).slice(0,1);
  const opts = shuffle([item.correct].concat(distract)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.q+'</p>',
    options: opts, correctValue: item.correct, speakText: item.q, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correct+'</b>.',
    recurso: recurso,
  };
}

export function genComunidadRound(nivel){
  const recurso = 'Una <b>comunidad</b> funciona porque distintas personas cumplen distintos roles que se necesitan entre sí: los oficios (como bombero, doctor o profesor) son trabajos que ayudan a todos, y las instituciones (como la posta, la escuela o los bomberos) son lugares organizados donde esos oficios se ponen al servicio de la comunidad completa, no solo de una persona. Además de esos roles, una buena comunidad necesita <b>normas de convivencia</b> — reglas simples como saludar, compartir, esperar el turno o pedir las cosas por favor — que ayudan a que todos puedan vivir juntos sin problemas. Reconocer qué oficio hace cada trabajo, para qué sirve cada institución, y qué conducta ayuda a la buena convivencia te prepara para ser un buen integrante de tu comunidad.';
  const showEmoji = nivel !== 'dificil';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(OFICIOS_BANK);
    let distract = shuffle(OFICIOS_BANK.filter(function(o){ return o.label!==item.label; })).map(function(o){ return o.label; });
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([item.label].concat(distract)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es la labor de un(a) <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(INSTITUCIONES_BANK);
    let distract = shuffle(INSTITUCIONES_BANK.filter(function(i){ return i.label!==item.label; })).map(function(i){ return i.label; });
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([item.label].concat(distract)).map(function(i){ return {label:i, value:i}; });
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es la función de <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(NORMAS_CONVIVENCIA);
  const opts = shuffle([{label:'Buena convivencia', value:true},{label:'No está bien', value:false}]);
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.bueno, speakText: item.label, cols:2, panel:true,
    explain: item.bueno ? item.label+' <b>ayuda a la buena convivencia</b>.' : item.label+' <b>no ayuda a la buena convivencia</b>.',
    recurso: recurso,
  };
}

/* "Examen Final" (mismo patrón que Matemática/Lenguaje/Ciencias 1° básico):
   mezcla los 5 módulos de Historia 1° básico + los 3 niveles al azar. */
export function genExamenHistoria1Round(){
  const gens = [genCalendarioRound, genMiIdentidadRound, genSimbolosRound, genMapasRound, genComunidadRound];
  const gen = pick(gens);
  const nivel = pick(['facil','normal','dificil']);
  return gen(nivel);
}

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/historia-geografia-ciencias-sociales/3-basico):
   Civilizaciones Antiguas -> OA01-04,10 (vida cotidiana de Grecia y Roma,
   su legado, comparación con la actualidad, factores geográficos). Los
   hechos usados (polis, democracia ateniense, Juegos Olímpicos, Partenón,
   Coliseo, gladiadores, acueductos, latín, togas) son datos de historia
   universal ampliamente documentados, no específicos de una fuente única
   (distinto del caso de "personajes históricos" chilenos puntuales que se
   excluyó en 1° básico por riesgo de imprecisión sin una fuente adicional).
   Geografía -> OA06-09 (cuadrícula y puntos cardinales, hemisferios/
   continentes/océanos, zonas climáticas). Formación Ciudadana -> OA11-16
   (deberes, valores cívicos, honestidad, derechos del niño, instituciones,
   participación). Queda fuera OA05 (investigar sobre un tema de interés en
   diversas fuentes — un proceso de indagación propio, no una pregunta de
   opción múltiple). */
export const HISTORIA_MODULES_G3 = [
  {id:'civilizaciones3', label:'Grecia y Roma', open:true, key:'civilizaciones3'},
  {id:'geografia3', label:'Geografía del Mundo', open:true, key:'geografia3'},
  {id:'ciudadania3', label:'Formación Ciudadana III', open:true, key:'ciudadania3'},
];
export const HISTORIA_POS_G3 = [{x:24,y:82},{x:68,y:50},{x:24,y:18}];

const CIVILIZACIONES_BANK = [
  { pregunta:'¿Cómo se llamaban las ciudades-estado de la antigua Grecia?', correcta:'Polis', opts:['Imperios','Reinos','Tribus'] },
  { pregunta:'¿En qué ciudad griega nació la democracia?', correcta:'Atenas', opts:['Esparta','Roma','Troya'] },
  { pregunta:'¿Qué forma de gobierno inventaron los griegos, en la que el pueblo participa en las decisiones?', correcta:'La democracia', opts:['La monarquía absoluta','La dictadura','El feudalismo'] },
  { pregunta:'¿Qué competencia deportiva crearon los griegos, que todavía existe hoy?', correcta:'Los Juegos Olímpicos', opts:['El Tour de Francia','La Copa América','El Super Bowl'] },
  { pregunta:'¿Cómo se llama el templo griego dedicado a la diosa Atenea, en Atenas?', correcta:'El Partenón', opts:['El coliseo','La Gran Muralla','Las pirámides'] },
  { pregunta:'¿Dónde luchaban los gladiadores en la antigua Roma?', correcta:'En el coliseo', opts:['En el Partenón','En una pirámide','En un acueducto'] },
  { pregunta:'¿Qué construían los romanos para transportar agua desde lejos hasta las ciudades?', correcta:'Acueductos', opts:['Pirámides','Templos griegos','Murallas chinas'] },
  { pregunta:'¿Qué idioma hablaban los antiguos romanos, origen del español?', correcta:'Latín', opts:['Griego','Egipcio','Árabe'] },
  { pregunta:'¿Qué ropa típica usaban los antiguos romanos?', correcta:'La toga', opts:['El kilt escocés','El sari indio','El poncho chileno'] },
  { pregunta:'A diferencia de hoy, ¿cómo se alumbraban de noche en la antigua Grecia y Roma?', correcta:'Con velas y antorchas de fuego', opts:['Con ampolletas eléctricas','Con linternas a pilas','Con luces LED'] },
  { pregunta:'A diferencia de hoy, ¿cómo se transportaban las personas en la antigua Roma?', correcta:'A pie, a caballo o en carros tirados por caballos', opts:['En auto','En avión','En metro'] },
];

const CUADRANTES_BANK = [
  { pregunta:'En un mapa, ¿hacia dónde apunta generalmente el Norte?', correcta:'Hacia arriba', opts:['Hacia abajo','Hacia la izquierda','Hacia la derecha'] },
  { pregunta:'¿Cuáles son los 4 puntos cardinales?', correcta:'Norte, sur, este, oeste', opts:['Arriba, abajo, izquierda, derecha','Rojo, azul, verde, amarillo','Primero, segundo, tercero, cuarto'] },
];
const HEMISFERIOS_BANK = [
  { pregunta:'¿Cuántos hemisferios tiene la Tierra?', correcta:'Dos (norte y sur)', opts:['Uno','Tres','Cuatro'] },
  { pregunta:'¿Qué línea imaginaria divide la Tierra en hemisferio norte y sur?', correcta:'El ecuador', opts:['El Polo Norte','Un trópico','Un meridiano'] },
  { pregunta:'¿Cuántos continentes tiene el planeta Tierra?', correcta:'Seis', opts:['Cuatro','Ocho','Diez'] },
  { pregunta:'¿Cuál es el océano que baña las costas de Chile?', correcta:'El océano Pacífico', opts:['El océano Atlántico','El océano Índico','El mar Mediterráneo'] },
  { pregunta:'¿Dónde están ubicados los polos de la Tierra?', correcta:'En los extremos norte y sur del planeta', opts:['En el ecuador','En el centro del planeta','En el continente africano'] },
];
const ZONAS_CLIMATICAS_BANK = [
  { pregunta:'¿Cómo es el clima cerca del Ecuador?', correcta:'Cálido y húmedo (tropical)', opts:['Muy frío y helado','Siempre nevado','Seco y desértico todo el año'] },
  { pregunta:'¿Cómo es el clima cerca de los polos?', correcta:'Muy frío (polar)', opts:['Muy caluroso','Tropical','Templado'] },
  { pregunta:'¿Qué zona climática tiene las 4 estaciones marcadas (verano, otoño, invierno, primavera)?', correcta:'Zona templada', opts:['Zona polar','Zona tropical','Zona desértica'] },
];

const CIUDADANIA3_BANK = [
  { correcta:'Cumplir con las tareas y responsabilidades escolares a tiempo', incorrectas:['Dejar todo para el último momento','Copiar las tareas de un compañero','No traer los materiales pedidos'] },
  { correcta:'Decir la verdad aunque sea difícil o hayas cometido un error', incorrectas:['Mentir para no meterte en problemas','Culpar a otro de tu error','Esconder lo que hiciste'] },
  { correcta:'Jugar limpio y respetar las reglas, incluso cuando nadie mira', incorrectas:['Hacer trampa si nadie te ve','Cambiar las reglas a tu favor','Culpar a otros cuando pierdes'] },
  { correcta:'Todos los niños y niñas tienen derecho a recibir cuidado, educación y protección', incorrectas:['Solo algunos niños tienen derechos','Los niños deben trabajar todo el día','Los niños no necesitan ir a la escuela'] },
  { correcta:'Participar activamente proponiendo ideas para tu curso', incorrectas:['No opinar nunca en las actividades del curso','Imponer tu idea sin escuchar a otros','Negarte a colaborar con el grupo'] },
  { correcta:'Asumir tu responsabilidad cuando cometes un error', incorrectas:['Culpar siempre a los demás','Negar haber hecho algo que sí hiciste','Esconder tus errores para no asumirlos'] },
  { correcta:'Ayudar a organizar y participar en las actividades de tu hogar', incorrectas:['No colaborar nunca en la casa','Dejar que otros hagan todo el trabajo','Quejarte sin ofrecer ayudar'] },
];
const INSTITUCIONES3_BANK = [
  { pregunta:'¿A qué institución vas a pedir prestado un libro para leer en casa?', correcta:'La biblioteca pública', opts:['El hospital','La municipalidad','El cuartel de bomberos'] },
  { pregunta:'¿Qué institución se encarga de organizar y cuidar tu comuna?', correcta:'La municipalidad', opts:['La biblioteca','El hospital','Los bomberos'] },
  { pregunta:'¿A qué institución acudes si te enfermas gravemente?', correcta:'El hospital', opts:['La municipalidad','La biblioteca','El correo'] },
];

export function genCivilizaciones3Round(){
  const item = pick(CIVILIZACIONES_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: 'Grecia y Roma son dos de las civilizaciones más influyentes de la historia universal, y muchas cosas que usamos hoy vienen de ellas: la <b>democracia</b> (gobierno donde el pueblo elige a sus representantes) nació en la antigua Atenas griega; los <b>Juegos Olímpicos</b> también son de origen griego; y el imperio romano dejó el <b>latín</b> (idioma del que viene el español) y construcciones impresionantes como acueductos y el Coliseo. Conocer estos hechos te ayuda a entender que muchas ideas y costumbres actuales tienen raíces muy antiguas, de civilizaciones que existieron hace miles de años.',
  };
}

export function genGeografia3Round(){
  const recurso = 'La geografía del mundo se organiza con varios sistemas: los <b>puntos cardinales</b> (norte, sur, este, oeste) te ayudan a describir direcciones; los <b>hemisferios</b> dividen el planeta en mitades (norte/sur según el ecuador, este/oeste según otro círculo imaginario); y las <b>zonas climáticas</b> (tropical, templada, polar) varían según qué tan cerca o lejos está un lugar del ecuador, determinando si el clima es cálido, templado o muy frío. Estos conceptos te dan un "lenguaje común" para describir cualquier lugar del planeta con precisión, sin importar en qué país estés.';
  const roll = Math.random();
  const bank = roll<0.34 ? CUADRANTES_BANK : roll<0.67 ? HEMISFERIOS_BANK : ZONAS_CLIMATICAS_BANK;
  const item = pick(bank);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genCiudadania3Round(){
  const recurso = 'La formación ciudadana en 3° básico profundiza ideas como la honestidad (decir la verdad y asumir tus errores en vez de esconderlos), el respeto de las reglas incluso sin supervisión, y los derechos que todos los niños tienen (cuidado, educación, protección). Además, conocer las <b>instituciones</b> de tu comunidad —la biblioteca (libros), la municipalidad (organiza tu comuna), el hospital (salud)— te ayuda a saber a quién acudir según lo que necesites. Ser un buen ciudadano no es solo obedecer, es entender por qué existen estas normas e instituciones y cómo te benefician a ti y a toda tu comunidad.';
  if(Math.random()<0.6){
    const item = pick(CIUDADANIA3_BANK);
    const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
      options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
      explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
      recurso: recurso,
    };
  }
  const item = pick(INSTITUCIONES3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/historia-geografia-ciencias-sociales/4-basico):
   Civilizaciones Americanas -> OA01-04 (maya, azteca, inca — ubicación,
   organización, hitos culturales ampliamente documentados en historia
   universal: Tenochtitlán, Machu Picchu, el quipu, los chasquis — mismo
   criterio que Grecia y Roma en 3° básico: hechos de una civilización
   entera, no afirmaciones sobre personajes históricos puntuales de una
   sola fuente). Geografía de América -> OA06-10 (coordenadas geográficas,
   recursos renovables/no renovables, paisajes y climas de América).
   Formación Ciudadana IV -> OA11-16 (actores políticos, derechos,
   honestidad, no discriminación, participación democrática, resolución de
   conflictos). Quedan fuera: OA05 (investigar sobre el presente de los
   pueblos indígenas — proceso de indagación propio) y OA17-18 (diseñar un
   proyecto grupal, opinar y argumentar — producción propia o habilidad de
   argumentación, no un hecho con respuesta única). */
export const HISTORIA_MODULES_G4 = [
  {id:'civilizacionesamericanas4', label:'Civilizaciones Americanas', open:true, key:'civilizacionesamericanas4'},
  {id:'geografiaamerica4', label:'Geografía de América', open:true, key:'geografiaamerica4'},
  {id:'ciudadania4', label:'Formación Ciudadana IV', open:true, key:'ciudadania4'},
];
export const HISTORIA_POS_G4 = [{x:24,y:82},{x:68,y:50},{x:24,y:18}];

const CIVILIZACIONES_AMERICANAS_BANK = [
  { pregunta:'¿En qué región vivía la civilización Maya?', correcta:'América Central (península de Yucatán)', opts:['Los Andes de Sudamérica','El valle de México','La Patagonia'] },
  { pregunta:'¿Cuál era la capital del imperio Azteca?', correcta:'Tenochtitlán', opts:['Cusco','Machu Picchu','Chichén Itzá'] },
  { pregunta:'¿En qué región vivía la civilización Inca?', correcta:'La cordillera de los Andes', opts:['La península de Yucatán','El valle de México','El Caribe'] },
  { pregunta:'¿Cuál era la capital del imperio Inca?', correcta:'Cusco', opts:['Tenochtitlán','Chichén Itzá','Tikal'] },
  { pregunta:'¿Qué construyeron los aztecas para cultivar alimentos sobre el lago donde estaba su ciudad?', correcta:'Las chinampas (islas artificiales)', opts:['El Camino Inca','Las pirámides escalonadas','Los quipus'] },
  { pregunta:'¿Cómo se llamaban los mensajeros incas que corrían por el imperio llevando noticias?', correcta:'Los chasquis', opts:['Los aztecas','Los mayas','Los faraones'] },
  { pregunta:'¿Qué usaban los incas para registrar información, ya que no tenían un alfabeto escrito?', correcta:'El quipu (cuerdas con nudos)', opts:['Jeroglíficos','Un alfabeto','Tablillas de arcilla'] },
  { pregunta:'¿En qué destacaban los mayas, además de la arquitectura?', correcta:'La astronomía y un calendario muy preciso', opts:['No conocían los números','Nunca observaban el cielo','No sabían medir el tiempo'] },
  { pregunta:'¿Qué construcción famosa hicieron los incas en lo alto de la cordillera?', correcta:'Machu Picchu', opts:['Tenochtitlán','Chichén Itzá','Las chinampas'] },
  { pregunta:'¿Qué idioma hablaban los aztecas?', correcta:'Náhuatl', opts:['Quechua','Maya','Español'] },
  { pregunta:'¿Qué idioma hablaban los incas, que todavía se habla hoy en países como Perú y Bolivia?', correcta:'Quechua', opts:['Náhuatl','Maya','Latín'] },
];

const GEOGRAFIA_AMERICA_BANK = [
  { pregunta:'¿Qué son los paralelos en un mapa?', correcta:'Líneas imaginarias horizontales que rodean la Tierra', opts:['Líneas verticales que van de polo a polo','Los nombres de los países','Los colores de un mapa'] },
  { pregunta:'¿Qué son los meridianos en un mapa?', correcta:'Líneas imaginarias verticales que van de polo a polo', opts:['Líneas horizontales que rodean la Tierra','Los ríos más largos','Las montañas más altas'] },
  { pregunta:'¿Cuál de estos es un recurso natural renovable?', correcta:'La energía solar', opts:['El petróleo','El carbón','El gas natural'] },
  { pregunta:'¿Cuál de estos es un recurso natural NO renovable?', correcta:'El petróleo', opts:['El viento','La madera de un bosque manejado','El agua de lluvia'] },
  { pregunta:'¿Cuál es el río más largo de América del Sur?', correcta:'El río Amazonas', opts:['El río Mapocho','El río Biobío','El río Colorado'] },
  { pregunta:'¿Qué idioma se habla en la mayor parte de Brasil, a diferencia del resto de Sudamérica?', correcta:'Portugués', opts:['Español','Inglés','Francés'] },
  { pregunta:'¿Cómo es el clima de la selva amazónica?', correcta:'Cálido y muy lluvioso', opts:['Muy frío y seco','Desértico','Nevado todo el año'] },
  { pregunta:'¿Cómo es el clima de Alaska, en América del Norte?', correcta:'Muy frío', opts:['Muy caluroso','Tropical','Desértico'] },
  { pregunta:'¿Qué tienen en común Chile, Perú y Bolivia?', correcta:'Comparten la Cordillera de los Andes', opts:['Comparten el mismo idioma que Brasil','Están todos en América del Norte','No tienen montañas'] },
];

const CIUDADANIA4_ACTORES_BANK = [
  { pregunta:'¿Quién es la máxima autoridad de un país como Chile?', correcta:'El presidente o la presidenta', opts:['El alcalde','Un senador','Un diputado'] },
  { pregunta:'¿Quién es la autoridad máxima de una comuna?', correcta:'El alcalde o la alcaldesa', opts:['El presidente','Un ministro','Un senador'] },
  { pregunta:'¿Quiénes ayudan al Presidente a dirigir distintas áreas del país, como salud o educación?', correcta:'Los ministros', opts:['Los alcaldes','Los jueces','Los profesores'] },
  { pregunta:'¿Qué hacen los senadores y diputados en el Congreso?', correcta:'Crean, discuten y aprueban las leyes del país', opts:['Dirigen las escuelas','Manejan los hospitales','Organizan el tránsito'] },
];
const CIUDADANIA4_VALORES_BANK = [
  { correcta:'Todos los niños tienen derecho a la educación, alimentación y vivienda', incorrectas:['Solo algunos niños tienen esos derechos','Esos derechos no aplican a todos los niños','Los niños no tienen derechos'] },
  { correcta:'Decir siempre la verdad, incluso cuando cometes un error', incorrectas:['Mentir para evitar un castigo','Culpar a otros de tus errores','Esconder la verdad'] },
  { correcta:'Tratar con respeto a todas las personas, sin importar su condición física, social o económica', incorrectas:['Discriminar a alguien por su condición económica','Burlarte de alguien por su apariencia física','Tratar mal a alguien por su situación social'] },
  { correcta:'Votar y participar en la elección de la directiva de tu curso', incorrectas:['No participar nunca en las elecciones del curso','Imponer quién debe ser el representante sin votación','Ignorar el proceso de elección'] },
  { correcta:'Dialogar y buscar una solución cuando hay un conflicto con un compañero', incorrectas:['Pelear sin buscar solución','Ignorar el conflicto sin resolverlo','Buscar venganza en vez de dialogar'] },
  { correcta:'Identificar la causa de un problema antes de buscar una solución', incorrectas:['Buscar una solución sin entender el problema','Culpar a alguien sin analizar la situación','Ignorar por qué ocurrió el conflicto'] },
];

export function genCivilizacionesAmericanas4Round(){
  const item = pick(CIVILIZACIONES_AMERICANAS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: 'Antes de la llegada de los españoles, tres grandes civilizaciones habían desarrollado culturas muy avanzadas en América: los <b>mayas</b> (península de Yucatán, en América Central), destacados por su calendario preciso y sus conocimientos de astronomía; los <b>aztecas</b> (Valle de México), que construyeron su capital Tenochtitlán sobre un lago, cultivando alimentos en "chinampas" (islas artificiales); y los <b>incas</b> (a lo largo de la Cordillera de los Andes), con su capital en Cusco y la ciudadela de Machu Picchu en lo alto de la montaña, que usaban el quipu (cuerdas con nudos) para registrar información porque no tenían un alfabeto escrito. Cada una de estas civilizaciones desarrolló su propio idioma, arquitectura y forma de organización política sin haber tenido contacto entre sí ni con Europa o Asia.',
  };
}

export function genGeografiaAmerica4Round(){
  const item = pick(GEOGRAFIA_AMERICA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: 'Un mapa usa <b>coordenadas geográficas</b> para ubicar cualquier punto en la Tierra: los <b>paralelos</b> son líneas imaginarias horizontales que rodean el planeta (como el Ecuador), y los <b>meridianos</b> son líneas verticales que van de polo a polo. América tiene una enorme variedad de climas y paisajes, desde la selva amazónica (cálida y muy lluviosa) hasta Alaska (muy fría) y la Cordillera de los Andes (que Chile comparte con Perú y Bolivia). Los <b>recursos naturales</b> se clasifican en renovables (como la energía solar o el viento, que no se agotan) y no renovables (como el petróleo o el carbón, que tardan millones de años en formarse y sí se agotan con el uso).',
  };
}

export function genCiudadania4Round(){
  const recurso = 'En Chile, distintas <b>autoridades</b> cumplen roles específicos: el Presidente o la Presidenta dirige el país completo, el alcalde o la alcaldesa dirige una comuna, los ministros ayudan al Presidente en áreas como salud o educación, y los senadores y diputados en el Congreso crean, discuten y aprueban las leyes. Más allá de conocer estas autoridades, la <b>formación ciudadana</b> también se practica en el día a día: decir siempre la verdad, tratar con respeto a todas las personas sin importar su condición, votar y participar en las decisiones de tu curso, y dialogar para resolver conflictos en vez de pelear — todas estas son formas de ejercer una buena ciudadanía, incluso antes de tener edad para votar en una elección real.';
  if(Math.random()<0.4){
    const item = pick(CIUDADANIA4_ACTORES_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(CIUDADANIA4_VALORES_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/historia-geografia-ciencias-sociales/5-basico):
   Descubrimiento y Conquista de América -> OA01-04 (viajes de Colón y
   Magallanes, actores y proceso de la conquista de América y Chile, impacto
   en Europa y América, efectos sobre los pueblos indígenas). La Colonia en
   Chile -> OA05-08 (sociedad, oficios y costumbres coloniales, dependencia
   de España, la relación entre españoles y mapuches -presentada de forma
   neutral y factual: la Guerra de Arauco y los parlamentos de paz, sin
   tomar partido-, patrimonio colonial). Geografía de Chile -> OA09-12
   (zonas geográficas del país, recursos naturales, su valorización, riesgos
   naturales). Formación Ciudadana V -> OA13-19 (derechos y deberes, mérito y
   esfuerzo, actitudes cívicas, elecciones de curso, proyectos escolares,
   formas de organización comunitaria).
   Quedan fuera: OA20-22 (opinar y argumentar con fundamentos, evaluar
   soluciones y justificar la elección, informarse por diarios/TIC —
   habilidades de argumentación y proceso de indagación propio, no hechos
   con respuesta única). */
export const HISTORIA_MODULES_G5 = [
  {id:'conquista5', label:'Descubrimiento y Conquista de América', open:true, key:'conquista5'},
  {id:'colonia5', label:'La Colonia en Chile', open:true, key:'colonia5'},
  {id:'geografiachile5', label:'Geografía de Chile', open:true, key:'geografiachile5'},
  {id:'ciudadania5', label:'Formación Ciudadana V', open:true, key:'ciudadania5'},
];
export const HISTORIA_POS_G5 = [{x:24,y:88},{x:68,y:64},{x:24,y:38},{x:68,y:12}];

const CONQUISTA_AMERICA_BANK = [
  { pregunta:'¿Quién llegó a América en 1492, buscando una nueva ruta hacia Asia?', correcta:'Cristóbal Colón', opts:['Hernando de Magallanes','Pedro de Valdivia','Francisco Pizarro'] },
  { pregunta:'¿Quién descubrió el estrecho que lleva su nombre, en el extremo sur de Chile, en 1520?', correcta:'Hernando de Magallanes', opts:['Cristóbal Colón','Diego de Almagro','Pedro de Valdivia'] },
  { pregunta:'¿Quién fue el primer español en explorar el territorio de Chile, antes que Pedro de Valdivia?', correcta:'Diego de Almagro', opts:['Hernando de Magallanes','Francisco Pizarro','Cristóbal Colón'] },
  { pregunta:'¿Quién fundó la ciudad de Santiago en 1541?', correcta:'Pedro de Valdivia', opts:['Diego de Almagro','Francisco Pizarro','Hernando de Magallanes'] },
  { pregunta:'¿Qué imperio conquistó Francisco Pizarro en Sudamérica?', correcta:'El imperio inca', opts:['El imperio azteca','Los mayas','Los mapuches'] },
  { pregunta:'¿Qué buscaban principalmente los reinos europeos al financiar los viajes de descubrimiento?', correcta:'Nuevas rutas comerciales y riquezas', opts:['Conocer otras comidas solamente','Hacer turismo','Aprender idiomas nuevos'] },
  { pregunta:'¿Qué le ocurrió a muchos pueblos indígenas americanos como consecuencia de la conquista?', correcta:'Enfermaron con enfermedades nuevas y perdieron gran parte de sus tierras', opts:['Mejoraron su situación de inmediato','No tuvieron ningún cambio en su vida','Ganaron más territorio que antes'] },
  { pregunta:'¿Qué consecuencia tuvo la conquista de América para Europa?', correcta:'Europa recibió nuevos productos y riquezas de América', opts:['Europa perdió todo contacto con América','Europa dejó de existir como continente','Europa no se vio afectada en nada'] },
];
const COLONIA_CHILE_BANK = [
  { pregunta:'¿De qué país europeo dependía Chile durante el período colonial?', correcta:'España', opts:['Portugal','Francia','Inglaterra'] },
  { pregunta:'¿Cómo se llamó el extenso conflicto entre españoles y mapuches durante gran parte de la Colonia?', correcta:'La Guerra de Arauco', opts:['La Guerra del Pacífico','La Guerra Civil','La Guerra de los Cien Años'] },
  { pregunta:'¿Qué río marcó, durante gran parte de la Colonia, la frontera entre el territorio bajo control español y el territorio mapuche?', correcta:'El río Biobío', opts:['El río Mapocho','El río Loa','El río Maule'] },
  { pregunta:'¿Qué eran los "parlamentos" que se realizaban entre españoles y mapuches?', correcta:'Reuniones para negociar acuerdos de paz', opts:['Fiestas sin ningún propósito','Escuelas para niños','Mercados de animales'] },
  { pregunta:'¿Cuál de estos oficios era común en la vida colonial chilena?', correcta:'El herrero, que trabajaba el metal a mano', opts:['El programador de computadores','El piloto de avión','El ingeniero en telecomunicaciones'] },
  { pregunta:'¿Cuál de estas es un ejemplo de patrimonio colonial que todavía se puede ver en Chile hoy?', correcta:'Una iglesia o casa antigua de adobe de esa época', opts:['Un edificio de vidrio moderno','Un aeropuerto','Un centro comercial nuevo'] },
  { pregunta:'¿Quiénes solían ocupar los cargos más importantes de gobierno en la sociedad colonial chilena?', correcta:'Los españoles y sus descendientes directos', opts:['Se elegían por votación popular abierta a todos','Siempre eran elegidos al azar','No existían cargos de gobierno'] },
  { pregunta:'¿Qué actividad económica basada en la extracción de minerales fue importante durante la Colonia en Chile?', correcta:'La minería (sobre todo de oro y plata)', opts:['La fabricación de computadores','La industria aeroespacial','La producción de energía solar'] },
  { pregunta:'¿Cuál era una costumbre común en las celebraciones de la vida colonial chilena?', correcta:'Las fiestas religiosas y patronales con música y baile', opts:['Los conciertos de música electrónica','Los viajes en avión','Los videojuegos en línea'] },
  { pregunta:'¿Qué tipo de construcción se usaba comúnmente en la arquitectura colonial chilena?', correcta:'Casas y edificios de adobe, con techos de teja', opts:['Rascacielos de vidrio y acero','Casas hechas completamente de plástico','Edificios con paneles solares'] },
];
const GEOGRAFIA_CHILE5_BANK = [
  { pregunta:'¿Cómo es el clima y paisaje del Norte Grande de Chile?', correcta:'Desértico, muy seco y con pocas lluvias', opts:['Muy lluvioso y cubierto de bosques','Con glaciares y fiordos','Tropical y húmedo'] },
  { pregunta:'¿Cómo es el clima de la Zona Central de Chile?', correcta:'Templado, con un verano seco y un invierno lluvioso', opts:['Desértico todo el año','Cubierto de hielo todo el año','Tropical y muy caluroso todo el año'] },
  { pregunta:'¿Cómo es el paisaje de la Zona Sur de Chile?', correcta:'Lluvioso, con bosques, lagos y volcanes', opts:['Desértico y sin vegetación','Cubierto solo de arena','Sin ningún río ni lago'] },
  { pregunta:'¿Qué caracteriza a la Zona Austral de Chile?', correcta:'Clima frío, con glaciares y fiordos', opts:['Clima desértico y caluroso','Playas tropicales','Selva amazónica'] },
  { pregunta:'¿Cuál es un recurso natural importante que se extrae principalmente en el norte de Chile?', correcta:'El cobre', opts:['Los glaciares','La madera nativa','Los peces de agua dulce'] },
  { pregunta:'¿Cuál es un recurso natural importante en la Zona Sur de Chile, gracias a sus bosques?', correcta:'La madera', opts:['El cobre','El salitre','El litio'] },
  { pregunta:'¿Cuál de estos es un riesgo natural frecuente en Chile, por estar ubicado sobre el Cinturón de Fuego del Pacífico?', correcta:'Los terremotos y erupciones volcánicas', opts:['Los huracanes tropicales','Las tormentas de arena del desierto del Sahara','Los tornados frecuentes'] },
  { pregunta:'Después de un terremoto grande en la costa, ¿qué otro riesgo natural puede ocurrir?', correcta:'Un tsunami (maremoto)', opts:['Una sequía inmediata','Una nevada en el desierto','Ningún riesgo adicional'] },
];
const CIUDADANIA5_BANK = [
  { correcta:'Todas las personas son sujetos de derecho y merecen ser respetadas por igual', incorrectas:['Solo algunas personas merecen respeto','Los derechos dependen de cuánto dinero tengas','Algunas personas no tienen derechos'] },
  { correcta:'Reconocer que tener un derecho también implica cumplir con deberes y responsabilidades', incorrectas:['Los derechos no tienen ninguna relación con los deberes','Solo importan los derechos, nunca los deberes','Los deberes son solo para los adultos'] },
  { correcta:'Reconocer que el esfuerzo y el mérito propio ayudan a lograr metas', incorrectas:['Los logros no dependen nunca del esfuerzo propio','Es mejor no esforzarse en nada','El mérito no tiene ninguna importancia'] },
  { correcta:'Participar en la elección de la directiva de curso, entendiendo el rol de cada cargo', incorrectas:['No participar nunca en las elecciones del curso','Imponer un representante sin votación','Ignorar el proceso de elección del curso'] },
  { correcta:'Proponer y participar en un proyecto para mejorar la convivencia o el cuidado del colegio', incorrectas:['No proponer nunca ninguna idea para mejorar el colegio','Ignorar los problemas del colegio','Dejar que otros resuelvan todo sin participar'] },
  { correcta:'Organizarse en grupo, escuchando distintas opiniones, para resolver un problema de la comunidad', incorrectas:['Resolver los problemas de la comunidad sin escuchar a nadie más','Ignorar los problemas de la comunidad','Esperar que un problema se resuelva solo'] },
  { correcta:'Ser honesto y actuar con responsabilidad en las tareas de la vida diaria', incorrectas:['Mentir cuando conviene','Actuar sin responsabilidad por las propias acciones','Culpar siempre a otros de los propios errores'] },
  { correcta:'Cuidar los espacios comunes del colegio, como la biblioteca o el patio', incorrectas:['Dañar a propósito los espacios comunes','Ensuciar el patio sin preocuparse por los demás','Ignorar el estado de los espacios compartidos'] },
  { correcta:'Escuchar distintos puntos de vista antes de tomar una decisión en grupo', incorrectas:['Decidir solo sin escuchar a nadie más','Ignorar las opiniones distintas a la propia','Imponer una decisión sin dialogar'] },
];

export function genConquista5Round(){
  const recurso = 'La <b>llegada de los europeos a América</b> (1492, con el viaje de Cristóbal Colón, y más tarde la expedición de Hernando de Magallanes que encontró el paso hacia el océano Pacífico) cambió profundamente el continente y también Europa: se intercambiaron alimentos, animales y enfermedades entre ambos mundos, y muchos pueblos indígenas sufrieron graves consecuencias, incluida la pérdida de territorio, población y formas de vida propias. Este proceso se llama <b>conquista</b>, y en Chile comenzó con la fundación de Santiago por Pedro de Valdivia en 1541.';
  const item = pick(CONQUISTA_AMERICA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genColonia5Round(){
  const recurso = 'La <b>Colonia</b> fue el largo período (1541-1810) en que Chile dependió del reino de España, gobernado desde la lejana capital colonial en el Perú. En esta época se formó una sociedad con oficios y costumbres propias, se construyó patrimonio arquitectónico que aún existe, y hubo una relación de conflicto y también de acuerdos de paz (parlamentos) entre los españoles y el pueblo mapuche en la llamada "frontera" del sur del país — un tema histórico complejo que se presenta aquí de forma neutral y factual, sin tomar partido.';
  const item = pick(COLONIA_CHILE_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genGeografiaChile5Round(){
  const recurso = 'Chile se organiza en <b>zonas geográficas</b> con paisajes muy distintos de norte a sur (norte grande desértico, zona central de clima templado, zona sur lluviosa, y zonas australes frías) debido a su forma larga y angosta. Cada zona ofrece <b>recursos naturales</b> distintos (minerales en el norte, tierras fértiles en el centro, bosques y agua en el sur) que las personas han aprovechado de formas diferentes. Chile también está expuesto a <b>riesgos naturales</b> como terremotos, tsunamis, erupciones volcánicas e inundaciones, por lo que conocerlos ayuda a estar mejor preparados.';
  const item = pick(GEOGRAFIA_CHILE5_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genCiudadania5Round(){
  const recurso = 'La <b>formación ciudadana</b> trata sobre cómo vivir bien en comunidad: conocer los derechos y deberes que tenemos, valorar el esfuerzo y el mérito propio, actuar con honestidad, y participar activamente en decisiones que afectan al grupo, como elegir representantes de curso o proponer proyectos escolares. Estas prácticas preparan para participar más adelante en la vida democrática del país, donde las decisiones se toman escuchando a distintas personas y respetando reglas comunes.';
  const item = pick(CIUDADANIA5_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.', recurso: recurso,
  };
}

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/historia-geografia-ciencias-sociales/6-basico). Hechos históricos
   verificados con fuentes adicionales antes de escribir el contenido (Guerra del
   Pacífico, voto femenino, fechas del golpe de Estado/plebiscito/retorno a la
   democracia) dada la sensibilidad de acertar fechas y datos exactos.
   Independencia de Chile -> OA01-02 (Primera Junta de 1810, Reconquista española,
   cruce de los Andes, batalla de Maipú 1818 — hitos ampliamente documentados de
   historia nacional, no afirmaciones de una sola fuente). La República en el Siglo
   XIX -> OA03-04,09 (Constitución de 1833, ferrocarril, avances educativos, cambios
   y continuidades en el derecho a voto). Salitre y Expansión Territorial -> OA05-06
   (Guerra del Pacífico 1879-1883 presentada de forma neutral y factual -Chile
   incorpora territorios del actual norte del país-, período salitrero, la
   "cuestión social" descrita a nivel básico sin profundizar en episodios de
   violencia específicos). Chile en el Siglo XX -> OA07 (voto femenino: ley
   aprobada en 1949, verificado con fuentes) **y OA08** (revisado tras
   conversarlo explícitamente con el usuario: la primera versión de este PR
   excluía por completo OA08 porque el propio texto pide comparar "múltiples
   perspectivas" sobre el quiebre democrático y el régimen militar — eso sigue
   siendo cierto y la interpretación del período NO se incluye aquí. Pero hay
   hechos puntuales indiscutibles y verificables -fechas, quién asumió, cuánto
   duró- que sí tienen una única respuesta correcta y que un niño de 6° básico
   necesita conocer como línea de tiempo básica del país: el golpe de Estado del
   11 de septiembre de 1973, el plebiscito del 5 de octubre de 1988, y el
   retorno a un gobierno electo democráticamente el 11 de marzo de 1990 con
   Patricio Aylwin. Se agregaron esos 5 hechos cronológicos al banco de
   SIGLOXX_DEMOCRATIZACION_BANK, deliberadamente sin ningún juicio de valor
   sobre el período -ni "bueno/malo", ni causas, ni consecuencias, ni derechos
   humanos- para no forzar una sola interpretación de un tema que el propio
   currículum reconoce como multiperspectivo; esa conversación queda para la
   sala de clases con un profesor, tal como pide el OA). Geografía de Chile VI
   -> OA10-14 (territorio tricontinental -América, Oceanía con Isla de Pascua, y
   la Antártica-, ambientes naturales, desafíos/oportunidades, el terremoto de
   Valdivia de 1960 como el mayor registrado en la historia -hecho científico
   ampliamente documentado-). Formación Ciudadana VI -> OA15-23 (poderes del
   Estado, la Constitución, derechos y deberes, actitudes cívicas, trabajo en
   equipo, elecciones de curso, proyectos comunitarios).
   También quedan fuera OA21 (autoridades político-administrativas de una región,
   cuyo nombre/cargo cambió con la reforma de 2021 -de intendente a gobernador
   regional electo- y podría volver a cambiar, arriesgando desactualizarse) y
   OA24-26 (opinar y argumentar con fundamentos, evaluar y justificar soluciones,
   informarse por diarios/TICs — habilidades de argumentación o proceso de
   indagación propio, no hechos con respuesta única). */
export const HISTORIA_MODULES_G6 = [
  {id:'independencia6', label:'Independencia de Chile', open:true, key:'independencia6'},
  {id:'republica6', label:'La República en el Siglo XIX', open:true, key:'republica6'},
  {id:'salitre6', label:'Salitre y Expansión Territorial', open:true, key:'salitre6'},
  {id:'sigloxx6', label:'Chile en el Siglo XX', open:true, key:'sigloxx6'},
  {id:'geografiachile6', label:'Geografía de Chile VI', open:true, key:'geografiachile6'},
  {id:'ciudadania6', label:'Formación Ciudadana VI', open:true, key:'ciudadania6'},
];
export const HISTORIA_POS_G6 = [{x:22,y:92},{x:68,y:76},{x:22,y:58},{x:68,y:42},{x:22,y:24},{x:68,y:6}];

const INDEPENDENCIA_BANK = [
  { pregunta:'¿En qué fecha se formó la Primera Junta Nacional de Gobierno, dando inicio al proceso de independencia de Chile?', correcta:'El 18 de septiembre de 1810', opts:['El 12 de febrero de 1818','El 5 de abril de 1817','El 1 de enero de 1900'] },
  { pregunta:'¿Quién es considerado el principal líder militar de la independencia de Chile?', correcta:'Bernardo o\'higgins', opts:['Pedro de Valdivia','Diego de Almagro','Francisco Pizarro'] },
  { pregunta:'¿Qué hazaña militar realizó el Ejército Libertador de los Andes en 1817 para liberar a Chile?', correcta:'Cruzaron la cordillera de los Andes con un ejército', opts:['Navegaron alrededor del mundo','Construyeron un ferrocarril','Firmaron un tratado comercial'] },
  { pregunta:'¿Qué batalla de 1818 consolidó definitivamente la independencia de Chile?', correcta:'La batalla de Maipú', opts:['La batalla de Rancagua','La Guerra del Pacífico','La batalla de Chacabuco'] },
  { pregunta:'¿Cómo se llama el período (1814-1817) en que España recuperó el control de Chile, antes de la independencia definitiva?', correcta:'La reconquista', opts:['La colonia','La república','La confederación'] },
  { pregunta:'¿Qué buscaban lograr los criollos americanos con los procesos de independencia de inicios del siglo XIX?', correcta:'Gobernarse a sí mismos, sin depender de una potencia europea', opts:['Seguir dependiendo de España para siempre','Unirse a otro imperio europeo','Eliminar todas las ciudades existentes'] },
  { pregunta:'¿Qué batalla de 1817 marcó el triunfo del ejército libertador tras cruzar los Andes, abriendo camino a Santiago?', correcta:'La batalla de Chacabuco', opts:['La batalla de Rancagua','La Guerra del Pacífico','La batalla de Maipú'] },
  { pregunta:'¿Qué batalla de 1814 significó una derrota patriota que dio paso a la Reconquista española?', correcta:'La batalla de Rancagua', opts:['La batalla de Chacabuco','La batalla de Maipú','La Guerra del Pacífico'] },
  { pregunta:'¿Qué título ocupó Bernardo O’Higgins tras la independencia, como máxima autoridad de Chile entre 1817 y 1823?', correcta:'Director Supremo', opts:['Rey de Chile','Virrey','Emperador'] },
  { pregunta:'¿De qué país dejó de depender Chile como resultado del proceso de independencia?', correcta:'De España', opts:['De Francia','De portugal','De inglaterra'] },
];
const REPUBLICA_SIGLO19_BANK = [
  { pregunta:'¿Qué documento estableció las normas fundamentales para organizar el gobierno de Chile en 1833?', correcta:'La Constitución de 1833', opts:['El Tratado de Ancón','La Ley de Sufragio Femenino','La Primera Junta de Gobierno'] },
  { pregunta:'¿Qué avance tecnológico del siglo XIX transformó el transporte de personas y mercancías en Chile?', correcta:'El ferrocarril', opts:['El avión','Internet','El teléfono celular'] },
  { pregunta:'Durante el siglo XIX, ¿qué área tuvo avances importantes en Chile, con la fundación de escuelas y liceos?', correcta:'La educación', opts:['Los viajes espaciales','La televisión','La energía nuclear'] },
  { afirmacion:'En el siglo XIX, solo un pequeño grupo de hombres podía votar en Chile; hoy votar es un derecho de la gran mayoría de los ciudadanos adultos', v:true },
  { afirmacion:'Desde el siglo XIX hasta hoy, el derecho a votar en Chile nunca ha cambiado para nadie', v:false },
  { pregunta:'¿Qué tipo de gobierno estableció la Constitución de 1833, con un Presidente con amplias atribuciones?', correcta:'Un gobierno presidencialista', opts:['Una monarquía hereditaria','Un gobierno sin ningún presidente','Una república sin leyes'] },
  { pregunta:'¿Qué permitió el ferrocarril en Chile durante el siglo XIX?', correcta:'Transportar personas y productos de forma más rápida entre ciudades', opts:['Viajar al extranjero en avión','Enviar mensajes por internet','Ver televisión en casa'] },
  { afirmacion:'Durante el siglo XIX se fundaron nuevas escuelas y liceos, ampliando el acceso a la educación en Chile', v:true },
];
const SALITRE_EXPANSION_BANK = [
  { pregunta:'¿Qué conflicto bélico (1879-1883) enfrentó a Chile contra Perú y Bolivia?', correcta:'La Guerra del Pacífico', opts:['La Guerra de Arauco','La Guerra Civil de 1891','La revolución de 1810'] },
  { pregunta:'Como resultado de la Guerra del Pacífico, ¿qué ocurrió con el territorio de Chile?', correcta:'Chile incorporó territorios del actual norte del país, como Antofagasta y Tarapacá', opts:['Chile perdió todo su territorio norte','Chile no ganó ni perdió ningún territorio','Chile se dividió en dos países'] },
  { pregunta:'¿Qué mineral impulsó una gran expansión económica en el norte de Chile a fines del siglo XIX?', correcta:'El salitre', opts:['El oro','El carbón','El petróleo'] },
  { pregunta:'¿Para qué se usaba principalmente el salitre que Chile exportaba al mundo?', correcta:'Como fertilizante para la agricultura', opts:['Como combustible para autos','Como material de construcción','Como alimento'] },
  { pregunta:'¿Qué se conoce como la "cuestión social" de fines del siglo XIX y comienzos del XX en Chile?', correcta:'Las difíciles condiciones de vida y trabajo de los obreros de la época', opts:['Un nuevo sistema educativo gratuito para todos','Una época de mucho bienestar para todos los obreros','Una ley que mejoró inmediatamente todos los salarios'] },
  { pregunta:'¿En qué zona de Chile se concentró principalmente la explotación del salitre?', correcta:'En el norte del país', opts:['En la Zona Austral','En la isla de Pascua','En la cordillera de los Andes del sur'] },
  { pregunta:'¿Por qué llegaron muchos trabajadores desde otras zonas de Chile hacia las salitreras del norte?', correcta:'Buscando trabajo en la industria del salitre', opts:['Buscando un clima más lluvioso','Huyendo de una guerra con Argentina','Para estudiar en nuevas universidades'] },
  { pregunta:'¿Cómo se llamaban los campamentos de trabajadores donde se extraía y procesaba el salitre?', correcta:'Oficinas salitreras', opts:['Universidades','Fortalezas militares','Puertos pesqueros'] },
  { pregunta:'¿Qué ocurrió con la industria del salitre chileno después de que se inventó el salitre sintético a comienzos del siglo XX?', correcta:'Entró en declive, ya que el salitre sintético era más barato de producir', opts:['Creció aún más que antes','No tuvo ningún efecto','Se volvió el único producto de exportación de Chile para siempre'] },
  { pregunta:'¿Qué buscaban mejorar los primeros movimientos obreros durante la época de la "cuestión social"?', correcta:'Las condiciones laborales y de vida de los trabajadores', opts:['El precio de las joyas','Los impuestos a los turistas','El precio de los autos'] },
];
const SIGLOXX_DEMOCRATIZACION_BANK = [
  { pregunta:'¿En qué año se aprobó la ley que dio a las mujeres chilenas el derecho a votar en elecciones presidenciales y parlamentarias?', correcta:'1949', opts:['1810','1883','2000'] },
  { pregunta:'Antes de la ley de 1949, ¿quiénes principalmente tenían derecho a votar en las elecciones presidenciales de Chile?', correcta:'Solo los hombres', opts:['Solo las mujeres','Todos los niños mayores de 10 años','Nadie podía votar'] },
  { pregunta:'¿Qué cambio importante en la participación ciudadana ocurrió durante el siglo XX en Chile?', correcta:'El derecho a votar se fue extendiendo a más personas, incluyendo a las mujeres', opts:['Se eliminó por completo el derecho a votar','Solo se permitió votar a los extranjeros','El voto dejó de existir'] },
  { pregunta:'¿En qué año pudieron votar las mujeres chilenas por primera vez en elecciones municipales?', correcta:'1935', opts:['1810','1949','2000'] },
  { pregunta:'¿En qué elección presidencial votaron las mujeres chilenas por primera vez, tras la ley de 1949?', correcta:'La elección presidencial de 1952', opts:['La elección de 1810','La elección de 1883','Nunca han podido votar en una elección presidencial'] },
  { pregunta:'¿Qué significa que el derecho a voto se haya ido "democratizando" a lo largo del siglo XX en Chile?', correcta:'Que cada vez más personas pudieron participar en las elecciones', opts:['Que cada vez menos personas pudieron votar','Que solo los más ricos podían votar','Que el voto se volvió obligatorio solo para un grupo'] },
  { pregunta:'¿Bajo qué presidente se aprobó la ley que dio a las mujeres chilenas el voto en elecciones presidenciales?', correcta:'Gabriel González Videla', opts:['Bernardo O\'Higgins','Arturo Prat','Diego Portales'] },
  { pregunta:'¿Quién fue elegido Presidente de Chile en 1952, en la primera elección con voto femenino?', correcta:'Carlos Ibáñez del Campo', opts:['Bernardo O\'Higgins','José de San Martín','Pedro de Valdivia'] },
  { pregunta:'¿Qué institución del Estado se encarga de organizar y fiscalizar las elecciones en Chile?', correcta:'El Servicio Electoral', opts:['El ejército','Una empresa privada cualquiera','Un periódico'] },
  { pregunta:'¿En qué fecha ocurrió el golpe de Estado que terminó con el gobierno del presidente Salvador Allende?', correcta:'El 11 de septiembre de 1973', opts:['El 18 de septiembre de 1810','El 11 de marzo de 1990','El 5 de octubre de 1988'] },
  { pregunta:'¿En qué año se realizó el plebiscito en que la mayoría de los chilenos votó para no continuar bajo el mismo gobierno?', correcta:'1988', opts:['1973','1990','1810'] },
  { pregunta:'¿En qué fecha asumió Patricio Aylwin la presidencia, marcando el retorno a un gobierno elegido democráticamente?', correcta:'El 11 de marzo de 1990', opts:['El 11 de septiembre de 1973','El 5 de octubre de 1988','El 18 de septiembre de 1810'] },
  { pregunta:'¿Cuántos años duró el período de gobierno militar en Chile, entre 1973 y 1990?', correcta:'17 años', opts:['5 años','50 años','2 años'] },
  { pregunta:'¿Quién fue el primer Presidente elegido democráticamente después del período de gobierno militar?', correcta:'Patricio Aylwin', opts:['Salvador Allende','Gabriel González Videla','Carlos Ibáñez del Campo'] },
];
const GEOGRAFIA_CHILE6_BANK = [
  { pregunta:'Chile es un país tricontinental. ¿Qué significa esto?', correcta:'Tiene territorio en tres continentes: América, Oceanía y la Antártica', opts:['Tiene tres capitales diferentes','Está formado por tres países unidos','Tiene tres idiomas oficiales'] },
  { pregunta:'¿Qué isla chilena en el océano Pacífico forma parte de Oceanía?', correcta:'Isla de Pascua (Rapa Nui)', opts:['La isla grande de Chiloé','La isla Juan Fernández','Tierra del Fuego'] },
  { pregunta:'¿Qué tipo de ambiente natural predomina en el norte de Chile?', correcta:'Desértico', opts:['Selva tropical','Glaciares y hielo','Pantanos y manglares'] },
  { pregunta:'¿Qué desafío enfrentan las personas que viven en una zona desértica como el norte de Chile?', correcta:'La escasez de agua', opts:['El exceso de lluvia','El frío extremo todo el año','La falta de sol'] },
  { pregunta:'¿Cuál es el mayor terremoto registrado instrumentalmente en la historia, ocurrido en el sur de Chile en 1960?', correcta:'El terremoto de Valdivia', opts:['El terremoto de Haití','El terremoto de Japón de 2011','No se ha registrado nunca un terremoto en Chile'] },
  { pregunta:'¿Qué oportunidad ofrece el ambiente marítimo de gran parte de la costa chilena?', correcta:'La pesca y el turismo', opts:['La minería del carbón solamente','La agricultura de arroz solamente','Ninguna oportunidad económica'] },
  { pregunta:'¿Qué tipo de ambiente natural predomina en la Zona Central de Chile?', correcta:'Clima Mediterráneo, con verano seco e invierno lluvioso', opts:['Desierto absoluto todo el año','Selva tropical lluviosa','Hielo y nieve todo el año'] },
  { pregunta:'¿Qué desafío enfrentan las personas que viven en zonas con alto riesgo de terremotos, como gran parte de Chile?', correcta:'Construir edificios preparados para resistir movimientos sísmicos', opts:['No existe ningún desafío','Evitar construir cualquier tipo de edificio','Mudarse a otro continente'] },
  { pregunta:'¿Qué recurso natural importante se obtiene de los bosques templados del sur de Chile?', correcta:'La madera', opts:['El cobre','El salitre','El petróleo'] },
];
const PODERES_ESTADO_BANK = [
  { poder:'Poder Ejecutivo', funcion:'Gobernar y administrar el país (el presidente y sus ministros)' },
  { poder:'Poder Legislativo', funcion:'Crear, discutir y aprobar las leyes (el Congreso Nacional)' },
  { poder:'Poder Judicial', funcion:'Aplicar la ley y resolver conflictos legales (los tribunales)' },
];
const CIUDADANIA6_BANK = [
  { correcta:'La Constitución Política establece cómo se organiza el gobierno del país y protege los derechos de las personas', incorrectas:['La Constitución no tiene relación con los derechos de las personas','Cualquier persona puede cambiar la Constitución sola, sin ningún procedimiento','La Constitución solo aplica a algunas personas del país'] },
  { correcta:'Tener un derecho también genera deberes y responsabilidades hacia los demás', incorrectas:['Los derechos no generan ningún deber','Solo los adultos tienen deberes','Los deberes no tienen relación con los derechos'] },
  { correcta:'Trabajar en equipo, asumiendo un rol responsable, ayuda a lograr mejores resultados en un proyecto', incorrectas:['Trabajar en equipo nunca mejora un resultado','Es mejor no asumir ningún rol en un trabajo grupal','Ignorar el trabajo de los demás ayuda al equipo'] },
  { correcta:'Participar en la elección de la directiva de curso, evaluando las propuestas de cada candidato, es un ejemplo de buena ciudadanía', incorrectas:['Votar sin conocer ninguna propuesta es lo más responsable','No participar nunca en las elecciones del curso','Imponer un candidato sin votación'] },
  { correcta:'Proponer un proyecto comunitario, como una campaña de reciclaje, considerando un plan simple, es una forma de participación ciudadana', incorrectas:['Los proyectos comunitarios no tienen ningún valor','Es mejor no proponer nunca ninguna idea para la comunidad','Un proyecto comunitario no necesita ningún plan'] },
  { correcta:'Si los derechos de una persona no son respetados, existen formas de protegerla, como acudir a un adulto responsable o a una institución', incorrectas:['Si no se respetan tus derechos, no existe ninguna forma de protegerte','Es mejor no hacer nada si no se respetan tus derechos','Solo los adultos pueden tener sus derechos protegidos'] },
];

export function genIndependencia6Round(){
  const recurso = 'La <b>independencia de Chile</b> fue un proceso de varios años, no un solo hecho: comenzó el 18 de septiembre de 1810 con la Primera Junta Nacional de Gobierno, pasó por la Reconquista española (1814-1817) tras la derrota patriota en Rancagua, y se consolidó cuando el Ejército Libertador —liderado por Bernardo O\'Higgins— cruzó la cordillera de los Andes en 1817 y venció en Chacabuco y, definitivamente, en Maipú (1818). El objetivo de fondo de los criollos americanos era gobernarse a sí mismos, sin depender de una potencia europea.';
  const item = pick(INDEPENDENCIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genRepublica6Round(){
  const recurso = 'La <b>Constitución de 1833</b> organizó el nuevo Estado chileno con un gobierno presidencialista (un Presidente con amplias atribuciones), y ese marco institucional se mantuvo por décadas. Durante el siglo XIX, Chile vivió avances importantes: se fundaron escuelas y liceos que ampliaron el acceso a la educación, y el <b>ferrocarril</b> transformó el transporte de personas y mercancías entre ciudades. El derecho a votar, en cambio, era mucho más restringido que hoy: solo un pequeño grupo de hombres podía votar, algo que fue cambiando recién con el paso del tiempo.';
  const item = pick(REPUBLICA_SIGLO19_BANK);
  if(item.afirmacion){
    const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
    return {
      promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
      options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
      explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
    };
  }
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genSalitre6Round(){
  const recurso = 'La <b>Guerra del Pacífico</b> (1879-1883) enfrentó a Chile contra Perú y Bolivia, y como resultado Chile incorporó territorios del actual norte del país (como Antofagasta y Tarapacá), ricos en <b>salitre</b> — un mineral usado principalmente como fertilizante, que impulsó una gran expansión económica. Sin embargo, los trabajadores de las oficinas salitreras vivían condiciones laborales muy difíciles, lo que dio origen a la llamada "<b>cuestión social</b>": los primeros movimientos obreros que buscaban mejorar esas condiciones de vida y trabajo.';
  const item = pick(SALITRE_EXPANSION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genSigloxx6Round(){
  const recurso = 'Durante el siglo XX, el derecho a votar en Chile se fue extendiendo a más personas: en 1935 las mujeres pudieron votar por primera vez en elecciones municipales, y en 1949 una ley les dio también el derecho a votar en elecciones presidenciales y parlamentarias (ejercido por primera vez en la elección de 1952). Más adelante, el país vivió hitos que marcan su historia reciente como línea de tiempo: el 11 de septiembre de 1973, el 5 de octubre de 1988 (el plebiscito) y el 11 de marzo de 1990, cuando Patricio Aylwin asumió como el primer Presidente elegido democráticamente tras ese período.';
  const item = pick(SIGLOXX_DEMOCRATIZACION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genGeografiaChile6Round(){
  const recurso = 'Chile es un país <b>tricontinental</b>: tiene territorio en América, Oceanía (Isla de Pascua) y la Antártica. Su forma larga y angosta le da ambientes naturales muy distintos: desierto en el norte (con el desafío real de la escasez de agua), clima mediterráneo en la Zona Central, y bosques templados en el sur. Por estar sobre el borde de placas tectónicas, Chile también es un país sísmico —el terremoto de Valdivia de 1960 es el mayor registrado en la historia—, lo que obliga a construir edificios preparados para resistir movimientos telúricos.';
  const item = pick(GEOGRAFIA_CHILE6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
  };
}

export function genCiudadania6Round(){
  const recurso = 'El Estado de Chile se organiza en tres poderes: el <b>Poder Ejecutivo</b> (el Presidente y sus ministros, que gobiernan y administran el país), el <b>Poder Legislativo</b> (el Congreso Nacional, que crea y aprueba las leyes) y el <b>Poder Judicial</b> (los tribunales, que aplican la ley y resuelven conflictos). La <b>Constitución Política</b> establece cómo se organiza este gobierno y protege los derechos de las personas — y todo derecho también trae deberes: participar responsablemente en el curso, respetar las reglas y proponer proyectos que beneficien a la comunidad son formas concretas de buena ciudadanía.';
  if(Math.random()<0.4){
    const item = pick(PODERES_ESTADO_BANK);
    const distract = shuffle(PODERES_ESTADO_BANK.filter(function(p){ return p.poder!==item.poder; })).map(function(p){ return p.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.poder+'</p><p class="prompt-hint">¿Cuál es la función de este poder del Estado?</p>',
      options: opts, correctValue: item.funcion, speakText: item.poder, cols:2, panel:true,
      explain: item.poder+': '+item.funcion+'.', recurso: recurso,
    };
  }
  const item = pick(CIUDADANIA6_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.', recurso: recurso,
  };
}

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 7° Básico ----------------
   Basado en OA del Decreto 614/2013, "Bases Curriculares 7° básico a 2°
   medio" (curriculumnacional.cl/curriculum/7o-basico-2o-medio/historia-
   geografia-ciencias-sociales/7-basico). El currículum de 7° básico
   profundiza en Grecia/Roma y Maya/Azteca/Inca (ya tratados de forma más
   básica en 3° y 4° básico respectivamente) con procesos históricos
   concretos y específicos -instituciones, tecnologías, organización- en vez
   de solo hitos generales, así que el contenido es genuinamente nuevo y más
   avanzado, no una repetición.
   Prehistoria y Primeras Civilizaciones -> OA01-04 (hominización, agricultura
   y sedentarización, formación de estados, primeras civilizaciones como
   Sumeria y Egipto). Grecia y Roma: Sociedad y Política -> OA05-08,17-18
   (el Mediterráneo, democracia ateniense, la civilización romana y su
   legado, el canon cultural clásico, mecanismos de limitación del poder en
   Atenas/Roma, comparación de conceptos políticos clásicos con la
   actualidad). Edad Media -> OA09-12 (formación de la civilización europea,
   sociedad medieval, relaciones entre mundo europeo/bizantino/islámico,
   transformaciones del siglo XII). Civilizaciones Americanas II: Maya,
   Azteca e Inca -> OA13-16 (tecnologías de transformación del territorio,
   organización del Imperio Inca, características culturales, legado
   presente en Latinoamérica). Formación Ciudadana VII -> OA19-20
   (diversidad cultural como enriquecimiento, formas de convivencia y
   conflicto entre culturas). Geografía y Medioambiente -> OA21-23
   (adaptación ser humano-medio, impacto humano en el ambiente, problemas
   medioambientales como el calentamiento global).
   Quedan fuera: OA24-26 (opinar y argumentar con fundamentos, evaluar y
   justificar soluciones, informarse por diarios/TICs — no aplica a este
   currículum en el mismo número, revisar en años posteriores si el
   currículum de 8° básico repite esta numeración). */
export const HISTORIA_MODULES_G7 = [
  {id:'prehistoriacivilizaciones7', label:'Prehistoria y Primeras Civilizaciones', open:true, key:'prehistoriacivilizaciones7'},
  {id:'greciaroma7', label:'Grecia y Roma: Sociedad y Política', open:true, key:'greciaroma7'},
  {id:'edadmedia7', label:'Edad Media', open:true, key:'edadmedia7'},
  {id:'civilizacionesamericanas7', label:'Civilizaciones Americanas II', open:true, key:'civilizacionesamericanas7'},
  {id:'ciudadania7', label:'Formación Ciudadana VII', open:true, key:'ciudadania7'},
  {id:'geografiamedioambiente7', label:'Geografía y Medioambiente', open:true, key:'geografiamedioambiente7'},
];
export const HISTORIA_POS_G7 = [{x:22,y:92},{x:68,y:76},{x:22,y:58},{x:68,y:42},{x:22,y:24},{x:68,y:6}];

const PREHISTORIA_BANK = [
  { pregunta:'¿Cómo se llama el proceso evolutivo mediante el cual la especie humana desarrolló las características que la distinguen de otros primates?', correcta:'Hominización', opts:['Sedentarización','Domesticación','Colonización'] },
  { pregunta:'¿Qué avance permitió a los primeros seres humanos dejar de depender solo de la caza y la recolección para alimentarse?', correcta:'La agricultura y la domesticación de animales', opts:['La invención de la rueda solamente','El descubrimiento del fuego solamente','La invención de la escritura solamente'] },
  { pregunta:'¿Qué es la sedentarización?', correcta:'El proceso por el cual los grupos humanos dejaron de ser nómadas y se establecieron en un lugar fijo', opts:['El proceso de domesticar animales salvajes','La invención de nuevas herramientas de piedra','El desarrollo del lenguaje escrito'] },
  { pregunta:'¿Qué desarrollo permitió a las primeras civilizaciones llevar registros de sus bienes y transacciones comerciales?', correcta:'La escritura y los sistemas de contabilidad', opts:['La rueda','El fuego','La agricultura por sí sola'] },
  { pregunta:'¿Qué cambio en la forma de vida trajo consigo la sedentarización de los primeros grupos humanos?', correcta:'La posibilidad de formar aldeas y acumular recursos permanentes', opts:['El fin de cualquier tipo de organización social','La desaparición de la agricultura','Un aumento del nomadismo'] },
  { pregunta:'¿Por qué la domesticación de animales fue un avance importante para las primeras sociedades humanas?', correcta:'Porque aseguró una fuente más estable de alimento y trabajo', opts:['Porque eliminó por completo la necesidad de comer','Porque impidió el desarrollo de la agricultura','Porque hizo desaparecer a todos los animales salvajes'] },
];
const PRIMERAS_CIVILIZACIONES_BANK = [
  { pregunta:'¿Cuál de estas fue una de las primeras civilizaciones de la historia, ubicada en Mesopotamia?', correcta:'La civilización Sumeria', opts:['La civilización olmeca','La civilización inca','La civilización vikinga'] },
  { pregunta:'¿En qué río se desarrolló la civilización egipcia antigua?', correcta:'El río Nilo', opts:['El río ámazonas','El río Biobío','El río Tíber'] },
  { pregunta:'¿Qué caracterizaba a las primeras civilizaciones en cuanto a su organización social?', correcta:'Una estratificación social, con distintos grupos o clases', opts:['Una igualdad total entre todas las personas','La ausencia completa de gobierno','La ausencia completa de ciudades'] },
  { pregunta:'¿Qué región comprendía Mesopotamia, cuna de la civilización sumeria?', correcta:'La zona entre los ríos Tigris y Éufrates', opts:['La zona entre los Andes y el Pacífico','La península itálica','La isla de Gran Bretaña'] },
  { pregunta:'¿Por qué las crecidas periódicas del río Nilo fueron importantes para la civilización egipcia?', correcta:'Porque fertilizaban la tierra y permitían la agricultura en una zona desértica', opts:['Porque impedían por completo la agricultura','Porque obligaban a abandonar la región cada año','Porque no tenían ningún efecto en los cultivos'] },
];
const GRECIA_ROMA_7_BANK = [
  { pregunta:'¿Qué mar fue central para el desarrollo de la civilización griega y romana, permitiendo el comercio y el intercambio cultural?', correcta:'El mar Mediterráneo', opts:['El océano Pacífico','El mar Caribe','El océano Índico'] },
  { pregunta:'¿Cómo se llamaba la unidad política básica de la antigua Grecia, una ciudad independiente con su propio gobierno?', correcta:'La polis (ciudad-estado)', opts:['El imperio','La provincia','El virreinato'] },
  { pregunta:'¿En qué ciudad-estado griega se desarrolló la forma de democracia más conocida de la Antigüedad?', correcta:'Atenas', opts:['Esparta','Roma','Cartago'] },
  { pregunta:'¿Qué sistema legal desarrolló el Imperio Romano, que influye hasta hoy en muchos países?', correcta:'El derecho romano', opts:['La democracia ateniense','El sistema feudal','El Código de Hammurabi'] },
  { pregunta:'¿Qué mecanismo usaba la democracia ateniense para evitar que una sola persona acumulara demasiado poder por mucho tiempo?', correcta:'La temporalidad de los cargos (se rotaban periódicamente)', opts:['La herencia del cargo de padre a hijo para siempre','La elección de un gobernante único de por vida','La ausencia total de cualquier cargo público'] },
  { pregunta:'¿Qué rol cumplía el Senado en la República romana?', correcta:'Asesorar y ayudar a limitar el poder de los magistrados', opts:['No tenía ningún rol en el gobierno','Solo se encargaba de organizar fiestas','Su única función era cobrar impuestos'] },
  { pregunta:'¿Qué aspectos de las sociedades actuales reciben influencia del legado cultural de Grecia y Roma?', correcta:'La escritura alfabética, la filosofía, el derecho y las ciencias, entre otros', opts:['Ningún aspecto de hoy tiene relación con esa época','Solo la forma de vestir actual','Solo los nombres de los meses del año'] },
  { pregunta:'¿Quiénes podían participar directamente en las decisiones de la democracia ateniense?', correcta:'Los ciudadanos varones adultos, excluyendo a mujeres y esclavos', opts:['Todos los habitantes de la ciudad por igual, sin ninguna excepción','Solo un rey y su familia','Solo los extranjeros que visitaban la ciudad'] },
  { pregunta:'¿Qué evento deportivo de la Antigua Grecia sigue existiendo hoy, adaptado a los tiempos modernos?', correcta:'Los Juegos Olímpicos', opts:['El campeonato mundial de fútbol','Los juegos del coliseo','Las carreras de carros romanas'] },
];
const EDAD_MEDIA_BANK = [
  { pregunta:'¿Qué tradiciones confluyeron en la formación de la civilización europea medieval?', correcta:'La grecorromana, la judeocristiana y la germana', opts:['Solo la tradición egipcia','Solo la tradición china','Solo la tradición inca'] },
  { pregunta:'¿Qué institución fue clave en articular estas tradiciones y legitimar el poder político durante la Edad Media europea?', correcta:'La Iglesia Católica', opts:['El Senado romano','La Asamblea ateniense','El imperio inca'] },
  { pregunta:'¿Cómo se llama el sistema social medieval, dividido en grupos con derechos y deberes distintos (nobleza, clero, campesinado)?', correcta:'El orden estamental', opts:['La democracia directa','El sistema republicano','La meritocracia moderna'] },
  { pregunta:'¿Qué caracterizaba principalmente la vida económica y social durante gran parte de la Edad Media?', correcta:'La vida rural, con un declive de la vida urbana', opts:['Grandes ciudades industrializadas','El comercio electrónico','Los viajes espaciales'] },
  { pregunta:'¿Qué cambios importantes ocurrieron en Europa a partir del siglo XII?', correcta:'Renacimiento de la vida urbana, más comercio y el surgimiento de las universidades', opts:['La desaparición completa de las ciudades','El fin del comercio en toda Europa','La invención de internet'] },
  { pregunta:'¿A qué grupo social pertenecían quienes trabajaban la tierra dentro del sistema estamental medieval?', correcta:'Al campesinado', opts:['A la nobleza','Al clero','A la realeza'] },
  { pregunta:'¿Qué función cumplían los monasterios durante gran parte de la Edad Media europea?', correcta:'Conservar y copiar manuscritos, además de oficiar como centros religiosos y de estudio', opts:['Organizar competencias deportivas','Funcionar como centros de comercio marítimo únicamente','Servir solo como fortalezas militares'] },
  { pregunta:'¿Qué caracterizaba a las relaciones de vasallaje típicas del sistema feudal medieval?', correcta:'Un señor otorgaba tierras a un vasallo a cambio de fidelidad y servicios', opts:['Todos los habitantes tenían exactamente los mismos derechos y tierras','No existía ningún tipo de jerarquía social','Las tierras se repartían por sorteo cada año'] },
  { pregunta:'¿Qué institución fundada en el siglo XII marcó un cambio importante en la educación europea?', correcta:'Las primeras universidades', opts:['Los primeros colegios en línea','Las primeras escuelas de conducción','Los primeros hospitales públicos modernos'] },
];
const CIVILIZACIONES_AMERICANAS_2_BANK = [
  { pregunta:'¿Qué tecnologías usaron los mayas y aztecas para transformar el territorio que habitaban?', correcta:'Canales, acueductos y sistemas de cultivo', opts:['Satélites y computadores','Motores a vapor','Energía nuclear'] },
  { pregunta:'¿Qué sistema de caminos y comunicación ayudó a mantener unido al Imperio Inca?', correcta:'La red de caminos y el sistema de chasquis (mensajeros)', opts:['El teléfono','El ferrocarril','El correo postal moderno'] },
  { pregunta:'¿Cómo se llamaba el sistema de trabajo colectivo y rotativo en el Imperio Inca?', correcta:'La mita', opts:['La encomienda','La hacienda','El feudalismo'] },
  { pregunta:'¿Qué idioma se convirtió en la lengua oficial y de administración del Imperio Inca?', correcta:'El quechua', opts:['El náhuatl','El latín','El maya'] },
  { pregunta:'¿Cómo se llamaba la capital del Imperio Inca, centro político y religioso del Tahuantinsuyo?', correcta:'Cusco', opts:['Tenochtitlán','Machu Picchu','Tiahuanaco'] },
  { pregunta:'¿Qué construcción monumental inca, ubicada en lo alto de los Andes, es hoy uno de los sitios arqueológicos más visitados del mundo?', correcta:'Machu Picchu', opts:['La Gran Pirámide de Guiza','El Coliseo romano','La Muralla China'] },
  { pregunta:'¿Qué era Tenochtitlán, la capital del Imperio Azteca?', correcta:'Una ciudad construida sobre un lago, con canales y chinampas (islas artificiales de cultivo)', opts:['Una ciudad construida en lo alto de una montaña nevada','Un puerto en la costa del océano Pacífico','Una ciudad subterránea'] },
  { pregunta:'¿Qué sistema de escritura y registro numérico usaban los incas para llevar cuentas administrativas, sin tener escritura alfabética?', correcta:'El quipu (un sistema de cuerdas y nudos)', opts:['Tablillas de arcilla con escritura cuneiforme','Papiro con jeroglíficos','Pergaminos con alfabeto latino'] },
  { pregunta:'¿Qué característica compartían las civilizaciones maya, azteca e inca en cuanto a sus construcciones monumentales?', correcta:'Construyeron grandes pirámides o templos con un alto nivel de planificación urbana', opts:['Ninguna de las tres construyó edificaciones de piedra','Todas vivían únicamente en carpas nómadas','No tenían ningún tipo de ciudades'] },
];
const CIUDADANIA7_BANK = [
  { correcta:'Reconocer que distintas culturas del pasado (árabes, judeocristianas, germanas, entre otras) aportaron ciencia, religión y lenguaje a las sociedades europeas', incorrectas:['Ignorar por completo los aportes de culturas distintas a la propia','Creer que solo una cultura ha aportado algo valioso a la historia','Rechazar cualquier influencia cultural externa'] },
  { correcta:'Valorar la diversidad cultural como una forma de enriquecer a las sociedades', incorrectas:['Pensar que la diversidad cultural siempre debilita a una sociedad','Ignorar la existencia de otras culturas','Rechazar el respeto hacia culturas distintas a la propia'] },
  { correcta:'Reconocer que puede haber convivencia y también conflicto entre culturas distintas, y que el diálogo ayuda a resolverlo', incorrectas:['Creer que la convivencia entre culturas nunca ha existido en la historia','Pensar que el conflicto entre culturas nunca se puede resolver con diálogo','Ignorar los conflictos históricos entre culturas por completo'] },
  { correcta:'Comparar cómo conceptos como ciudadanía o democracia han cambiado desde el mundo clásico hasta hoy', incorrectas:['Pensar que estos conceptos nunca han cambiado desde la Antigüedad','Creer que la democracia actual es idéntica a la de Atenas en todo sentido','Ignorar la historia de estos conceptos por completo'] },
  { correcta:'Escuchar con respeto costumbres o creencias distintas a las propias antes de emitir un juicio sobre ellas', incorrectas:['Rechazar de inmediato cualquier costumbre distinta a la propia sin conocerla','Burlarse de las creencias de otras culturas','Exigir que todos adopten exactamente las mismas costumbres'] },
  { correcta:'Reconocer que el aporte de distintos pueblos y culturas a la historia ha sido variado y complementario', incorrectas:['Creer que solo un pueblo ha construido toda la historia de la humanidad','Ignorar el aporte de culturas no europeas a la historia mundial','Pensar que la historia comenzó con una sola civilización'] },
  { correcta:'Fundamentar una opinión sobre un tema histórico con hechos y evidencia, en vez de solo prejuicios', incorrectas:['Formar una opinión sin buscar ningún tipo de evidencia','Repetir una opinión ajena sin analizarla nunca','Ignorar por completo los hechos históricos al opinar'] },
  { correcta:'Reconocer que distintas civilizaciones antiguas, como Grecia, Roma o los incas, desarrollaron formas propias de organizar el poder', incorrectas:['Creer que solo una civilización antigua tuvo alguna forma de organización política','Pensar que ninguna civilización antigua tuvo gobierno alguno','Ignorar que existieron distintas formas de organización política en la historia'] },
  { correcta:'Participar activamente en discusiones grupales sobre temas históricos, respetando los turnos de habla', incorrectas:['Interrumpir constantemente a los demás sin dejarlos hablar','Negarse a participar en cualquier discusión grupal','Imponer tu opinión sin escuchar la de otros'] },
];
const GEOGRAFIA_MEDIOAMBIENTE_7_BANK = [
  { pregunta:'¿Qué factor puede influir en dónde decide asentarse un grupo humano?', correcta:'La disponibilidad de recursos y agua cerca del lugar', opts:['El color del cielo en esa zona','La cantidad de estrellas visibles de noche','El nombre que tenga el lugar'] },
  { pregunta:'¿Qué es el calentamiento global?', correcta:'El aumento progresivo de la temperatura promedio del planeta', opts:['La disminución constante de la temperatura del planeta','Un fenómeno que solo ocurre en el espacio','Un tipo de erupción volcánica'] },
  { pregunta:'¿Cuál es una medida para mitigar los efectos negativos de la acción humana sobre el medioambiente?', correcta:'Reducir el uso de combustibles contaminantes y cuidar los recursos naturales', opts:['Aumentar sin límite el uso de combustibles contaminantes','Ignorar por completo el cuidado de los recursos naturales','Talar todos los bosques sin ningún control'] },
  { pregunta:'¿Cómo puede la acción humana afectar negativamente el medio ambiente de una localidad?', correcta:'Contaminando el agua, el aire o el suelo con desechos', opts:['Plantando más árboles nativos','Reciclando los materiales de forma responsable','Protegiendo las áreas naturales'] },
  { pregunta:'¿Por qué muchos asentamientos humanos, antiguos y actuales, se ubican cerca de ríos o costas?', correcta:'Porque facilitan el acceso al agua, el transporte y el comercio', opts:['Porque es el lugar más frío del territorio','Porque así se evita por completo cualquier riesgo natural','Porque no hay ninguna razón práctica para ello'] },
  { pregunta:'¿Qué relación existe entre el relieve de un territorio y el tipo de actividades económicas que se desarrollan en él?', correcta:'El relieve influye en qué actividades son más fáciles de realizar, como la agricultura en valles o la minería en zonas montañosas', opts:['El relieve no tiene ninguna relación con la economía de un lugar','Todas las actividades económicas son igual de fáciles en cualquier relieve','Solo las zonas planas pueden tener algún tipo de actividad económica'] },
  { pregunta:'¿Qué acción concreta puede tomar una comunidad para reducir su impacto ambiental en el uso del agua?', correcta:'Reparar fugas y evitar el desperdicio innecesario de agua potable', opts:['Dejar todas las llaves de agua abiertas permanentemente','Aumentar el desperdicio de agua sin ningún control','Ignorar cualquier fuga de agua que se detecte'] },
  { pregunta:'¿Por qué la deforestación de un bosque puede afectar negativamente el clima de una zona?', correcta:'Porque los árboles ayudan a regular la temperatura y a retener agua en el suelo', opts:['Porque los árboles no tienen ningún efecto en el clima','Porque más árboles siempre aumentan la temperatura','Porque la deforestación siempre mejora el clima local'] },
  { pregunta:'¿Qué relación existe entre el aumento de gases de efecto invernadero y el calentamiento global?', correcta:'Esos gases atrapan más calor en la atmósfera, contribuyendo a que aumente la temperatura del planeta', opts:['Esos gases no tienen ninguna relación con la temperatura del planeta','Esos gases siempre enfrían la atmósfera','El calentamiento global no tiene ninguna causa conocida'] },
  { pregunta:'¿Qué medida de transporte ayuda a reducir el impacto ambiental de una comunidad?', correcta:'Usar más el transporte público, la bicicleta o caminar en vez del auto particular', opts:['Usar el auto particular para cualquier trayecto, por corto que sea','Aumentar sin límite la cantidad de autos en circulación','Evitar por completo cualquier forma de transporte'] },
];

export function genPrehistoriaCivilizaciones7Round(){
  const recurso = 'La <b>prehistoria</b> abarca el largo proceso de hominización (la evolución de los primeros homínidos) y la revolución agrícola, que permitió a los grupos humanos dejar de ser nómadas y asentarse en un lugar fijo. Las <b>primeras civilizaciones</b>, como Sumeria (Mesopotamia) y Egipto, surgieron junto a grandes ríos que permitían la agricultura y el desarrollo de ciudades, escritura y organización política — sentando las bases de la vida urbana tal como la conocemos hoy.';
  const item = pick(Math.random()<0.5 ? PREHISTORIA_BANK : PRIMERAS_CIVILIZACIONES_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genGreciaRoma7Round(){
  const recurso = 'La antigua <b>Grecia</b> desarrolló la democracia ateniense, un sistema donde los ciudadanos participaban directamente en las decisiones de la ciudad-estado (polis). El antiguo <b>Imperio Romano</b> creó un sistema de derecho (leyes escritas) que influye hasta hoy en muchos países. Ambas civilizaciones dejaron un legado cultural enorme en filosofía, arquitectura, literatura y política que las sociedades occidentales siguen usando como referencia.';
  const item = pick(GRECIA_ROMA_7_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genEdadMedia7Round(){
  const recurso = 'La <b>Edad Media</b> europea se formó a partir de la fusión de tres tradiciones: la grecorromana (derecho, filosofía), la judeocristiana (religión) y la germana (nuevos pueblos que se asentaron en el territorio del antiguo Imperio Romano). La sociedad medieval se organizaba en un <b>orden estamental</b> (nobleza, clero y campesinado), con roles y derechos distintos según el estamento al que se perteneciera. A partir del siglo XII surgieron cambios importantes, como el crecimiento de las ciudades y el comercio, que fueron preparando el camino hacia la Edad Moderna.';
  const item = pick(EDAD_MEDIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genCivilizacionesAmericanas7Round(){
  const recurso = 'Las civilizaciones precolombinas de América desarrollaron tecnologías y sistemas propios sin contacto con Europa: los mayas y aztecas construyeron grandes ciudades con pirámides y una notable organización urbana; los incas usaban el <b>quipu</b> (un sistema de cuerdas y nudos) para llevar registros administrativos sin escritura alfabética, y organizaban el trabajo colectivo mediante la <b>mita</b>. El <b>quechua</b> fue la lengua oficial del Imperio Inca, y varias de estas lenguas y tradiciones siguen vivas hoy en comunidades de toda América.';
  const item = pick(CIVILIZACIONES_AMERICANAS_2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
    recurso: recurso,
  };
}

export function genCiudadania7Round(){
  const recurso = 'La <b>formación ciudadana</b> incluye reconocer y valorar la diversidad cultural: distintas culturas (árabe, judeocristiana, germana, indígena, entre muchas otras) han aportado ciencia, lenguaje, tradiciones y formas de organización a lo largo de la historia. Una buena convivencia entre culturas distintas se construye escuchando con respeto, dialogando ante los desacuerdos y fundamentando las opiniones con hechos, en vez de prejuicios.';
  const item = pick(CIUDADANIA7_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
    recurso: recurso,
  };
}

export function genGeografiaMedioambiente7Round(){
  const recurso = 'Los grupos humanos, antiguos y actuales, suelen asentarse cerca de recursos como el agua y en terrenos que facilitan la agricultura, el transporte o el comercio — por eso muchas ciudades están junto a ríos o costas. El <b>calentamiento global</b> es el aumento progresivo de la temperatura promedio del planeta, causado en gran parte por el aumento de gases de efecto invernadero que atrapan más calor en la atmósfera. Para mitigar sus efectos, se puede reducir el uso de combustibles contaminantes, cuidar el agua y los bosques, y usar más transporte sustentable.';
  const item = pick(GEOGRAFIA_MEDIOAMBIENTE_7_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 8° Básico ----------------
   Basado en OA del Decreto 614/2013 (curriculumnacional.cl/curriculum/
   7o-basico-2o-medio/historia-geografia-ciencias-sociales/8-basico).
   Humanismo y Renacimiento -> HI08 OA01-02 (el ser humano como centro,
   contraste sociedad medieval/moderna, imprenta, revolución científica).
   Estado Moderno y Mercantilismo -> OA03-04 (concentración del poder en el
   rey, burocracia, economía mercantilista, rutas comerciales).
   Conquista de América II -> OA05-07 (choque cultural, factores de la
   rapidez de la conquista, impacto en Europa — profundiza lo ya visto en
   5° básico con procesos y causas, no solo hitos; tono neutral y factual,
   mismo criterio de siempre). La Colonia II -> OA08-13 (rol administrativo
   de las ciudades, el Barroco colonial, comercio atlántico y monopolio,
   sociedad colonial y mestizaje, la frontera con el pueblo mapuche, la
   hacienda y el inquilinaje — profundiza la Colonia de 5° básico).
   Ilustración y Revoluciones -> OA14-16,18-19 (la razón como base, separación
   de poderes, revoluciones de fines del s. XVIII, independencia americana
   como proceso continental, derechos del hombre y del ciudadano).
   Geografía Regional -> OA20-22 (criterios que definen una región, tipos
   de regiones en Chile y América, problemas regionales, índice de
   desarrollo humano). Quedan fuera: OA17 (contrastar posturas del debate
   de legitimidad de la conquista conectándolo con visiones actuales —
   interpretación multiperspectiva que el propio OA exige, mismo criterio
   que HI06 OA08 en 6° básico; el hecho histórico del debate sí se menciona
   factualmente en Conquista de América II). */
export const HISTORIA_MODULES_G8 = [
  {id:'humanismorenacimiento8', label:'Humanismo y Renacimiento', open:true, key:'humanismorenacimiento8'},
  {id:'estadomoderno8', label:'Estado Moderno y Mercantilismo', open:true, key:'estadomoderno8'},
  {id:'conquista8', label:'Conquista de América II', open:true, key:'conquista8'},
  {id:'colonia8', label:'La Colonia II', open:true, key:'colonia8'},
  {id:'ilustracionrevoluciones8', label:'Ilustración y Revoluciones', open:true, key:'ilustracionrevoluciones8'},
  {id:'geografiaregional8', label:'Geografía Regional', open:true, key:'geografiaregional8'},
];
export const HISTORIA_POS_G8 = [{x:22,y:92},{x:68,y:76},{x:22,y:58},{x:68,y:42},{x:22,y:24},{x:68,y:6}];

const HUMANISMO_8_BANK = [
  { pregunta:'¿Qué idea puso al centro el Humanismo, el movimiento cultural que floreció en Europa desde el siglo XIV?', correcta:'El ser humano y su capacidad de pensar, crear y transformar el mundo', opts:['Que nada podía cambiarse ni estudiarse','Que solo importaba acumular tierras','Que el arte debía prohibirse'] },
  { pregunta:'¿Qué invento del siglo XV permitió reproducir libros en grandes cantidades y difundir las ideas mucho más rápido?', correcta:'La imprenta de tipos móviles', opts:['El telégrafo','La máquina a vapor','El telescopio espacial'] },
  { pregunta:'¿Qué caracterizó a la revolución científica de los siglos XVI y XVII?', correcta:'Explicar la naturaleza mediante observación, experimentos y razonamiento', opts:['Rechazar cualquier tipo de observación','Prohibir el uso de instrumentos','Copiar sin cuestionar los textos antiguos'] },
  { pregunta:'¿Qué artista del Renacimiento pintó la Mona Lisa y además estudió anatomía, ingeniería y vuelo?', correcta:'Leonardo da Vinci', opts:['Cristóbal Colón','Johannes gutenberg','Hernán cortés'] },
  { pregunta:'¿Qué diferencia marcó a la época moderna respecto de la Edad Media en la vida cultural europea?', correcta:'Mayor confianza en la razón humana y en el estudio del mundo', opts:['El abandono total de las ciudades','La desaparición de las universidades','El fin de todo el comercio'] },
  { pregunta:'¿Dónde nació el Renacimiento, antes de extenderse por Europa?', correcta:'En las ciudades de la península itálica, como Florencia', opts:['En el desierto de Atacama','En las islas del Pacífico sur','En el Polo Norte'] },
  { pregunta:'¿Qué efecto tuvo la imprenta sobre el conocimiento en Europa?', correcta:'Los libros se volvieron más baratos y accesibles, y las ideas circularon más rápido', opts:['Los libros desaparecieron por completo','Solo los reyes pudieron leer desde entonces','El conocimiento dejó de difundirse'] },
  { pregunta:'¿Qué área del conocimiento avanzó con astrónomos como Copérnico y Galileo durante la revolución científica?', correcta:'La comprensión del sistema solar y el movimiento de los planetas', opts:['La fabricación de automóviles','La programación de computadores','La aviación comercial'] },
  { pregunta:'¿Cómo se relacionaba el arte renacentista con el conocimiento científico de su época?', correcta:'Los artistas estudiaban anatomía, proporción y perspectiva para representar mejor la realidad', opts:['El arte y la ciencia estaban completamente prohibidos de mezclarse','Los artistas nunca estudiaban nada','La perspectiva fue inventada en el siglo xx'] },
  { pregunta:'¿Qué rol cumplieron ciudades como Florencia y Venecia en el Renacimiento?', correcta:'Fueron centros de comercio y mecenazgo que financiaron arte y cultura', opts:['Fueron abandonadas durante todo el período','Prohibieron la entrada de artistas','No tuvieron ninguna relación con la cultura'] },
];
export function genHumanismoRenacimiento8Round(){
  const recurso = 'El <b>Renacimiento</b> fue un movimiento cultural que surgió en Europa a partir del siglo XV, marcando el fin de la Edad Media. Su idea central, el <b>Humanismo</b>, ponía al ser humano (y no solo a Dios) en el centro de la reflexión, valorando la razón, el arte y el conocimiento del mundo. La invención de la <b>imprenta</b> por Gutenberg permitió reproducir libros de forma masiva por primera vez, haciendo que las ideas se difundieran mucho más rápido que antes, cuando cada libro debía copiarse a mano. Este período también trajo avances en la <b>revolución científica</b>: observar y experimentar el mundo, en vez de solo aceptar lo que decían las autoridades antiguas, se volvió una forma válida de generar conocimiento.';
  const item = pick(HUMANISMO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ESTADO_MODERNO_8_BANK = [
  { pregunta:'¿Qué caracterizó al Estado moderno europeo, a diferencia del poder repartido de la época medieval?', correcta:'La concentración del poder en la figura del rey y una administración centralizada', opts:['La ausencia total de gobierno','El poder repartido entre miles de señores sin ningún orden','La elección del rey por votación popular universal'] },
  { pregunta:'¿Qué herramientas usó el Estado moderno para administrar su territorio?', correcta:'Funcionarios, impuestos regulares y ejércitos permanentes', opts:['Ninguna: no existía administración','Solo acuerdos verbales sin registro','El sorteo anual de todos los cargos'] },
  { pregunta:'¿Qué buscaba el mercantilismo, la política económica típica de los siglos XVI a XVIII?', correcta:'Acumular metales preciosos y exportar más de lo que se importaba', opts:['Eliminar todo el comercio exterior','Regalar los metales preciosos a otros reinos','Prohibir la fabricación de productos propios'] },
  { pregunta:'¿Qué efecto tuvo en Europa la llegada masiva de oro y plata desde América en el siglo XVI?', correcta:'Un alza generalizada de los precios, conocida como revolución de los precios', opts:['La desaparición del dinero','Que todo se volviera gratis','Ningún efecto en la economía'] },
  { pregunta:'¿Cómo cambiaron las rutas comerciales europeas tras los viajes de exploración de los siglos XV y XVI?', correcta:'Se expandieron del Mediterráneo hacia el Atlántico y otros océanos', opts:['Se redujeron solo al mar Mediterráneo','Desaparecieron por completo','Se limitaron a los ríos interiores'] },
  { pregunta:'¿Por qué los reyes de los Estados modernos financiaron viajes de exploración?', correcta:'Para encontrar nuevas rutas comerciales y aumentar sus riquezas', opts:['Para regalar sus barcos','Porque no tenían ningún interés económico','Para perder territorios a propósito'] },
  { pregunta:'¿Qué es la burocracia, que creció junto con el Estado moderno?', correcta:'El conjunto de funcionarios y oficinas que administran el estado', opts:['Un tipo de baile cortesano','Una moneda de la época','Un estilo de pintura'] },
  { pregunta:'¿Qué relación hubo entre el mercantilismo y las colonias americanas?', correcta:'Las colonias proveían materias primas y metales, y compraban productos de la metrópoli', opts:['Las colonias no tenían ninguna relación económica con Europa','Las colonias exportaban computadores','Europa regalaba todo a las colonias'] },
  { pregunta:'¿Qué significaba el "monopolio comercial" que España impuso a sus colonias americanas?', correcta:'Las colonias solo podían comerciar con España, no con otros reinos', opts:['Las colonias podían comerciar libremente con cualquier país','España prohibía todo tipo de comercio','El comercio era administrado por los pueblos originarios'] },
];
export function genEstadoModerno8Round(){
  const recurso = 'El <b>Estado moderno</b> surgió en Europa cuando el poder, que antes estaba repartido entre muchos señores feudales, se concentró en la figura del rey, apoyado por una <b>administración centralizada</b> (funcionarios, impuestos regulares y ejércitos permanentes). El <b>mercantilismo</b> fue la política económica dominante entre los siglos XVI y XVIII: los reinos buscaban acumular la mayor cantidad de oro y plata posible, exportando más de lo que importaban. Las colonias americanas jugaban un rol clave en este sistema: proveían materias primas y metales preciosos a la metrópoli, mientras se les imponía un <b>monopolio comercial</b> que las obligaba a comerciar solo con su propio reino, nunca con otros países.';
  const item = pick(ESTADO_MODERNO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const CONQUISTA_8_BANK = [
  { pregunta:'¿Por qué el encuentro entre europeos y pueblos americanos fue un choque entre dos mundos culturales?', correcta:'Porque tenían idiomas, creencias, tecnologías y formas de vida profundamente distintas', opts:['Porque ya se conocían desde siempre','Porque compartían el mismo idioma','Porque sus culturas eran idénticas'] },
  { pregunta:'¿Qué factor contribuyó a la rapidez de la conquista de los grandes imperios americanos?', correcta:'Las alianzas de los españoles con pueblos rivales de esos imperios', opts:['La ausencia total de resistencia indígena','Que los imperios no tuvieran ejércitos','Que los españoles fueran millones'] },
  { pregunta:'¿Qué causó la mayor pérdida de población indígena tras la llegada de los europeos a América?', correcta:'Las enfermedades traídas desde Europa, para las que no tenían defensas', opts:['Las erupciones volcánicas de la época','Las migraciones voluntarias a Europa','El clima del continente'] },
  { pregunta:'¿Qué diferencia tecnológica militar existía entre conquistadores y pueblos americanos?', correcta:'Los europeos contaban con armas de metal, caballos y pólvora, desconocidos en América', opts:['No existía ninguna diferencia tecnológica','Los pueblos americanos tenían tecnología militar europea','Los europeos no llevaban ningún tipo de armas'] },
  { pregunta:'¿Cómo impactó la conquista de América en la visión del mundo que tenían los europeos?', correcta:'Amplió el mundo conocido y los obligó a representar continentes, plantas y pueblos nuevos', opts:['No cambió nada en su visión del mundo','Redujo el tamaño del mundo conocido','Hizo que abandonaran la cartografía'] },
  { pregunta:'¿Qué debate surgió en España en el siglo XVI a raíz de la conquista, con Bartolomé de las Casas como una de sus voces?', correcta:'Un debate sobre la legitimidad de la conquista y el trato dado a los pueblos indígenas', opts:['Un debate sobre el color de las banderas','Una discusión sobre recetas de cocina','Ningún debate: nadie opinó sobre la conquista'] },
  { pregunta:'¿Qué intercambio se produjo entre América y Europa tras el contacto de 1492?', correcta:'Plantas, animales y alimentos viajaron en ambas direcciones, como la papa hacia Europa y el trigo hacia América', opts:['No se intercambió absolutamente nada','Solo viajaron piedras','Los alimentos fueron prohibidos en ambos continentes'] },
  { pregunta:'¿Qué interés movía principalmente a los conquistadores españoles en América?', correcta:'Obtener riquezas, tierras y títulos, además de expandir su religión', opts:['Estudiar la flora americana sin otro objetivo','Hacer turismo','Aprender los idiomas locales por curiosidad'] },
  { pregunta:'¿Cómo se vio afectada la organización política de los grandes imperios americanos con la conquista?', correcta:'Sus estructuras de gobierno fueron reemplazadas por instituciones coloniales españolas', opts:['Siguieron gobernando exactamente igual que antes','Se trasladaron a gobernar en Europa','No tenían ninguna organización política'] },
];
export function genConquista8Round(){
  const recurso = 'El encuentro entre europeos y pueblos americanos en 1492 fue un verdadero <b>choque cultural</b>, entre mundos con idiomas, creencias, tecnologías y formas de vida profundamente distintas. La rapidez de la conquista de los grandes imperios americanos se explica por varios factores combinados: las alianzas de los españoles con pueblos rivales de esos imperios, la diferencia tecnológica militar (armas de metal, caballos y pólvora, desconocidos en América), y sobre todo las <b>enfermedades</b> traídas desde Europa, para las que los pueblos americanos no tenían defensas — la causa principal de la enorme pérdida de población indígena. Este proceso también generó un <b>intercambio</b> de plantas, animales y alimentos entre ambos continentes (como la papa hacia Europa y el trigo hacia América), y un debate en España sobre la legitimidad de la conquista y el trato a los pueblos indígenas.';
  const item = pick(CONQUISTA_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const COLONIA_8_BANK = [
  { pregunta:'¿Qué rol cumplían las ciudades fundadas por los españoles en América?', correcta:'Concentraban la administración, las instituciones y el poder colonial', opts:['Eran solo lugares de descanso sin ninguna función','No existieron ciudades en la colonia','Funcionaban sin ninguna autoridad'] },
  { pregunta:'¿Qué estilo artístico y cultural marcó la vida colonial americana en los siglos XVII y XVIII, visible en iglesias, pinturas y música?', correcta:'El barroco', opts:['El cubismo','El arte digital','El impresionismo'] },
  { pregunta:'¿Cómo se formó la sociedad colonial americana?', correcta:'Del mestizaje entre españoles, pueblos indígenas y personas africanas traídas al continente', opts:['Solo de población europea sin ninguna mezcla','De un único grupo sin diversidad','De población llegada de Asia oriental únicamente'] },
  { pregunta:'¿Qué fue la hacienda en el Chile colonial?', correcta:'Una gran propiedad rural dedicada a la agricultura y ganadería, centro de la vida económica y social', opts:['Un tipo de embarcación','Una moneda colonial','Un instrumento musical'] },
  { pregunta:'¿Qué era el inquilinaje, característico del campo chileno colonial?', correcta:'Un sistema donde familias vivían y trabajaban en tierras de la hacienda a cambio de un lugar donde vivir y cultivar', opts:['Un juego tradicional de la época','Un tipo de comercio marítimo','Una ceremonia religiosa'] },
  { pregunta:'¿Qué caracterizó la relación entre españoles y mapuches durante gran parte de la Colonia en Chile?', correcta:'Períodos de guerra y también de intercambio y parlamentos de paz en torno a una frontera en el Biobío', opts:['Una paz total sin ningún conflicto en tres siglos','La ausencia completa de contacto entre ambos','Una alianza militar permanente contra otros reinos'] },
  { pregunta:'¿Por qué el comercio colonial americano era importante para España en los siglos XVII y XVIII?', correcta:'Porque los metales y productos americanos sostenían gran parte de su economía', opts:['Porque España no obtenía nada de América','Porque América solo exportaba hielo','Porque el comercio estaba prohibido'] },
  { pregunta:'¿Qué institución organizaba la vida religiosa, la educación y buena parte de la cultura en la América colonial?', correcta:'La Iglesia Católica', opts:['Los bancos comerciales','Las universidades tecnológicas','Los periódicos deportivos'] },
  { pregunta:'¿Cómo era la sociedad colonial en cuanto a derechos y jerarquías?', correcta:'Era una sociedad jerarquizada, donde el origen y el nacimiento determinaban el lugar de cada persona', opts:['Todos tenían exactamente los mismos derechos','No existían grupos sociales','Los cargos se sorteaban entre toda la población'] },
];
export function genColonia8Round(){
  const recurso = 'Durante la <b>Colonia</b>, las ciudades fundadas por los españoles concentraban la administración, las instituciones y el poder colonial. La sociedad se formó por <b>mestizaje</b> entre españoles, pueblos indígenas y personas africanas traídas al continente, organizada de forma jerárquica según el origen y nacimiento de cada persona. En el campo chileno, la <b>hacienda</b> era la gran propiedad rural que organizaba la economía, y el <b>inquilinaje</b> era el sistema donde familias trabajaban la tierra a cambio de un lugar donde vivir. La relación entre españoles y mapuches en torno a la frontera del Biobío combinó períodos de guerra con intercambio y parlamentos de paz. El <b>Barroco</b> fue el estilo artístico dominante de la época, visible en iglesias, pinturas y música.';
  const item = pick(COLONIA_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ILUSTRACION_8_BANK = [
  { pregunta:'¿Qué proponía la Ilustración, el movimiento intelectual del siglo XVIII?', correcta:'Usar la razón para comprender el mundo y organizar la sociedad', opts:['Prohibir la lectura y el estudio','Volver a las formas de vida medievales','Rechazar toda forma de conocimiento'] },
  { pregunta:'¿Qué principio político difundió la Ilustración para evitar la concentración del poder?', correcta:'La separación y equilibrio de los poderes del estado', opts:['Entregar todo el poder a una sola persona para siempre','Eliminar cualquier forma de gobierno','Sortear el poder cada semana'] },
  { pregunta:'¿Qué revolución de 1789 proclamó los derechos del hombre y del ciudadano?', correcta:'La Revolución Francesa', opts:['La Revolución Industrial británica','La Revolución Rusa','La Guerra del Pacífico'] },
  { pregunta:'¿Qué proceso norteamericano de 1776 inspiró a otros movimientos independentistas?', correcta:'La independencia de las Trece Colonias (Estados Unidos)', opts:['La construcción del canal de Panamá','La fundación de Nueva York','La llegada del ferrocarril'] },
  { pregunta:'¿Por qué la independencia hispanoamericana se considera un proceso continental?', correcta:'Porque ocurrió de forma casi simultánea y conectada en los distintos territorios americanos', opts:['Porque ocurrió solo en un país','Porque fue organizada desde Asia','Porque no tuvo ninguna causa común'] },
  { pregunta:'¿Qué ideas ilustradas influyeron en los líderes de las independencias americanas?', correcta:'La soberanía popular, los derechos del ciudadano y el gobierno republicano', opts:['La idea de que el poder debía ser hereditario para siempre','El rechazo a cualquier forma de gobierno','La prohibición de las constituciones'] },
  { pregunta:'¿Qué crisis facilitó el inicio de las independencias hispanoamericanas hacia 1808-1810?', correcta:'La crisis de la monarquía española tras la invasión napoleónica', opts:['Una sequía en el desierto de Atacama','El descubrimiento de América','La llegada del telégrafo'] },
  { pregunta:'¿Qué transformación política trajo la independencia a los nuevos países americanos, incluido Chile?', correcta:'El paso de ser colonias de un rey a repúblicas con constituciones y ciudadanos', opts:['Ningún cambio en su forma de gobierno','La unión de toda América en un solo imperio','El abandono de toda forma de ley'] },
  { pregunta:'¿Qué relación existe entre los "derechos del hombre y del ciudadano" de 1789 y los derechos humanos actuales?', correcta:'Son un antecedente histórico directo: la idea de derechos universales se fue ampliando hasta hoy', opts:['No tienen ninguna relación entre sí','Los derechos actuales son más antiguos','Ambos conceptos significan exactamente lo mismo sin ningún cambio'] },
];
export function genIlustracionRevoluciones8Round(){
  const recurso = 'La <b>Ilustración</b> fue un movimiento intelectual del siglo XVIII que proponía usar la razón para comprender el mundo y organizar la sociedad, difundiendo ideas como la separación de poderes del Estado para evitar que una sola persona concentrara todo el poder. Estas ideas influyeron directamente en las grandes <b>revoluciones</b> de la época: la independencia de las Trece Colonias (1776) y la Revolución Francesa (1789), que proclamó los derechos del hombre y del ciudadano — un antecedente directo de los derechos humanos actuales. La <b>independencia hispanoamericana</b> se considera un proceso continental porque ocurrió de forma casi simultánea y conectada en distintos territorios, impulsada por estas mismas ideas ilustradas y facilitada por la crisis de la monarquía española tras la invasión napoleónica de 1808.';
  const item = pick(ILUSTRACION_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const GEOGRAFIA_REGIONAL_8_BANK = [
  { pregunta:'¿Qué criterios se combinan para definir una región?', correcta:'Factores físicos y humanos, como clima, vegetación, idioma, historia o economía', opts:['Solo el color del mapa','El orden alfabético de sus ciudades','Ningún criterio: las regiones son aleatorias'] },
  { pregunta:'¿Qué tipo de región es "la zona vitivinícola del valle central de Chile"?', correcta:'Una región económica (definida por su actividad productiva)', opts:['Una región político-administrativa','Una región definida por su idioma','Un tipo de clima'] },
  { pregunta:'¿Qué tipo de región son las 16 regiones en que se divide administrativamente Chile?', correcta:'Regiones político-administrativas', opts:['Regiones climáticas','Regiones culturales indígenas','Cuencas hidrográficas'] },
  { pregunta:'¿Qué problema afecta a las zonas aisladas de Chile, como localidades cordilleranas o insulares?', correcta:'El acceso más difícil a servicios como salud, educación y conectividad', opts:['Un exceso de servicios públicos','La ausencia total de habitantes en todo Chile','Ningún problema: todo el territorio es igual'] },
  { pregunta:'¿Qué mide el Índice de Desarrollo Humano (IDH) que se usa para comparar regiones y países?', correcta:'Salud, educación e ingresos de la población', opts:['Solo la cantidad de autos','El tamaño del territorio','La cantidad de estadios deportivos'] },
  { pregunta:'¿Por qué muchas personas migran desde regiones hacia la capital u otras ciudades grandes?', correcta:'Buscando trabajo, estudios y servicios que se concentran en las grandes ciudades', opts:['Porque está prohibido vivir en regiones','Por sorteo nacional obligatorio','Sin ninguna razón'] },
  { pregunta:'¿Qué efecto puede tener la concentración de población y servicios en una sola gran ciudad?', correcta:'Desigualdades entre la capital y las demás regiones del país', opts:['La igualdad automática de todo el territorio','La desaparición de la ciudad grande','Ningún efecto en el resto del país'] },
  { pregunta:'¿Qué ejemplo corresponde a una región cultural en América?', correcta:'La zona andina, donde pueblos comparten tradiciones e historia ligadas a la cordillera', opts:['Una cancha de fútbol','El pasillo de un supermercado','Un edificio de oficinas'] },
  { pregunta:'¿Cómo se inserta una región en el mercado internacional?', correcta:'Exportando sus productos característicos, como minerales, fruta o productos del mar', opts:['Cerrando todo contacto con el exterior','Regalando su producción','Prohibiendo los puertos'] },
];
export function genGeografiaRegional8Round(){
  const recurso = 'Una <b>región</b> se define combinando factores físicos y humanos: clima, vegetación, idioma, historia o economía. Existen distintos tipos: las regiones político-administrativas (como las 16 regiones de Chile), las regiones económicas (definidas por su actividad productiva, como una zona vitivinícola) y las regiones culturales (definidas por tradiciones compartidas, como la zona andina). Las <b>zonas aisladas</b> de un país, como localidades cordilleranas o insulares, suelen tener un acceso más difícil a servicios como salud, educación y conectividad. El <b>Índice de Desarrollo Humano (IDH)</b> es una herramienta que permite comparar regiones y países según su salud, educación e ingresos, y sirve para identificar desigualdades entre distintas zonas de un mismo territorio.';
  const item = pick(GEOGRAFIA_REGIONAL_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/historia-geografia-ciencias-sociales/1-medio
   — OA01-25. Cubiertos: OA01-02 (ideas republicanas/liberales, cultura burguesa),
   OA03-05 (Estado-nación, progreso/positivismo, industrialización), OA06-07
   (imperialismo, Primera Guerra Mundial), OA08-09 (formación y consolidación
   de la República de Chile), OA10-11,16-17 (inserción industrial de Chile,
   prensa/nación, orden parlamentario, riqueza salitrera), OA12-15,24
   (geografía: exploración/ocupación territorial, Araucanía, Guerra del
   Pacífico, y convivencia/conflicto con pueblos indígenas — mismo criterio
   ya establecido en 6°/8° básico: solo hechos verificables, sin juicio de
   valor), OA19-23,25 (economía personal y formación ciudadana). Ningún OA
   queda fuera del motor de opción múltiple este año. */
export const HISTORIA_MODULES_M1 = [
  {id:'ideasrepublicanasm1', label:'Ideas Republicanas y Liberales', open:true, key:'ideasrepublicanasm1'},
  {id:'estadonacionm1', label:'Estado-Nación e Industrialización', open:true, key:'estadonacionm1'},
  {id:'imperialismoguerram1', label:'Imperialismo y Primera Guerra Mundial', open:true, key:'imperialismoguerram1'},
  {id:'republicachilem1', label:'Formación de la República de Chile', open:true, key:'republicachilem1'},
  {id:'salitreparlamentarismom1', label:'Chile: Salitre y Parlamentarismo', open:true, key:'salitreparlamentarismom1'},
  {id:'geografiapueblosm1', label:'Geografía y Pueblos Originarios', open:true, key:'geografiapueblosm1'},
  {id:'economiaciudadaniam1', label:'Economía Personal y Ciudadanía', open:true, key:'economiaciudadaniam1'},
];
export const HISTORIA_POS_M1 = [
  {x:24,y:92},{x:68,y:80},{x:24,y:68},{x:68,y:56},{x:24,y:44},{x:68,y:32},{x:24,y:20}
];
const IDEAS_REPUBLICANAS_M1_BANK = [
  { pregunta:'¿Qué proponían las ideas republicanas y liberales del siglo XIX?', correcta:'Gobiernos basados en constituciones, división de poderes y libertades individuales', opts:['El regreso a las monarquías absolutas','La eliminación de toda ley escrita','Un solo gobernante elegido por sorteo eterno'] },
  { pregunta:'¿Qué defendía el liberalismo económico del siglo XIX?', correcta:'El libre comercio, con menos intervención del Estado en la economía', opts:['Que el Estado controlara todo el comercio','La prohibición total del comercio internacional','El regreso al trueque sin dinero'] },
  { pregunta:'¿Qué buscaba el movimiento abolicionista del siglo XIX?', correcta:'Terminar con la esclavitud en distintos países', opts:['Ampliar la esclavitud a más territorios','Prohibir el trabajo asalariado','Eliminar los parlamentos'] },
  { pregunta:'¿Qué modelo familiar y de roles de género predominó en la cultura burguesa del siglo XIX?', correcta:'Un modelo con roles diferenciados: el hombre en el trabajo remunerado, la mujer a cargo del hogar', opts:['La igualdad total de roles entre hombres y mujeres','La ausencia total de familia','Roles idénticos para todas las edades'] },
  { pregunta:'¿Qué valoraba especialmente la ética laboral de la burguesía del siglo XIX?', correcta:'El esfuerzo personal, el ahorro y el éxito obtenido con trabajo propio', opts:['El ocio permanente sin trabajar','El azar como única fuente de riqueza','El rechazo a cualquier forma de comercio'] },
  { pregunta:'¿Qué significa el "parlamentarismo" como modelo de representatividad política?', correcta:'Un sistema donde el parlamento (Congreso) tiene un rol central en el gobierno', opts:['Un sistema sin ningún tipo de elecciones','El gobierno de un solo rey absoluto','La ausencia total de leyes'] },
  { pregunta:'¿Qué es el "constitucionalismo" que se difundió en el siglo XIX?', correcta:'La idea de que el poder del Estado debe estar limitado por una constitución escrita', opts:['La idea de que no debe existir ninguna ley','Un sistema sin ningún tipo de gobierno','El poder ilimitado de un solo gobernante'] },
  { pregunta:'¿Con qué transformaciones económicas se relacionó la difusión del libre comercio en el siglo XIX?', correcta:'El crecimiento del comercio internacional y la especialización productiva de los países', opts:['El fin total del comercio entre países','El regreso a economías completamente cerradas','La desaparición del dinero'] },
  { pregunta:'¿Qué buscaban las ideas republicanas en relación con la soberanía del poder?', correcta:'Que el poder resida en el pueblo o sus representantes, no en un monarca hereditario', opts:['Que el poder sea siempre hereditario','Que no exista ninguna forma de autoridad','Que el poder resida en un solo dios'] },
];
export function genIdeasRepublicanasM1Round(){
  const recurso = 'Durante el siglo XIX, las <b>ideas republicanas y liberales</b> se difundieron por América y Europa, transformando profundamente la política: se defendía que el poder debía residir en el pueblo o sus representantes (no en un monarca hereditario), organizado mediante constituciones escritas que limitaran el poder del Estado y garantizaran libertades individuales. El <b>parlamentarismo</b> le dio un rol central al Congreso en el gobierno, mientras el <b>liberalismo económico</b> promovía el libre comercio con menos intervención estatal. Estas ideas convivieron con el auge de una nueva <b>cultura burguesa</b>, con un modelo familiar de roles diferenciados (el hombre en el trabajo remunerado, la mujer a cargo del hogar) y una fuerte ética laboral que valoraba el esfuerzo y el ahorro personal. El movimiento <b>abolicionista</b>, por su parte, luchó durante este siglo para terminar con la esclavitud en distintos países.';
  const item = pick(IDEAS_REPUBLICANAS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ESTADO_NACION_M1_BANK = [
  { pregunta:'¿Qué es el "Estado-nación", concepto que reorganizó la geografía política del siglo XIX?', correcta:'Un territorio con fronteras definidas, gobierno propio y una población que comparte una identidad nacional', opts:['Un territorio sin ningún tipo de gobierno','Una alianza militar temporal entre países','Un imperio que gobierna sobre todo el continente'] },
  { pregunta:'¿Qué idea de "progreso indefinido" se difundió en el siglo XIX?', correcta:'La creencia de que la humanidad avanzaría sin límites gracias a la ciencia y la tecnología', opts:['La idea de que el ser humano ya no podía mejorar','El rechazo total a cualquier avance científico','La creencia de que el pasado siempre fue mejor'] },
  { pregunta:'¿Qué proponía el positivismo, corriente de pensamiento del siglo XIX?', correcta:'Que el conocimiento científico, basado en hechos observables, era la mejor guía para organizar la sociedad', opts:['Que la ciencia no servía para nada','Que solo la fe religiosa explicaba el mundo','Que el azar debía decidir todas las leyes'] },
  { pregunta:'¿Qué caracterizó a la industrialización del siglo XIX?', correcta:'El uso de máquinas y fábricas para producir bienes a gran escala', opts:['La desaparición total de la producción','El regreso exclusivo al trabajo artesanal manual','La prohibición de las ciudades'] },
  { pregunta:'¿Qué efecto tuvo la industrialización sobre la población y las ciudades?', correcta:'Un fuerte crecimiento urbano, con migración desde el campo hacia las ciudades industriales', opts:['El vaciamiento total de las ciudades','Ningún cambio en la distribución de la población','El regreso de la población a la vida nómada'] },
  { pregunta:'¿Qué transformación territorial trajo la formación de los Estados-nación en América Latina y Europa?', correcta:'La definición de fronteras y la consolidación de gobiernos nacionales propios', opts:['La desaparición de todas las fronteras','La formación de un solo imperio mundial','El regreso a territorios sin ningún límite'] },
  { pregunta:'¿En qué áreas se manifestó especialmente la fe en el "progreso indefinido"?', correcta:'En el desarrollo científico y tecnológico, visto como una mejora continua para la humanidad', opts:['Únicamente en el arte religioso','Solo en la agricultura tradicional','En ningún ámbito concreto'] },
  { pregunta:'¿Qué consecuencia social trajo la industrialización en las nuevas ciudades fabriles?', correcta:'El surgimiento de una clase obrera que trabajaba largas jornadas en las fábricas', opts:['La desaparición total del trabajo asalariado','Un descanso permanente para todos los trabajadores','La eliminación de las fábricas'] },
];
export function genEstadoNacionM1Round(){
  const recurso = 'El <b>Estado-nación</b> es un territorio con fronteras definidas, un gobierno propio y una población que comparte una identidad nacional; durante el siglo XIX, tanto América Latina como Europa reorganizaron su geografía política bajo este modelo. Al mismo tiempo, se difundió la idea del <b>progreso indefinido</b>: la creencia de que la humanidad avanzaría sin límites gracias a la ciencia y la tecnología, respaldada por el <b>positivismo</b>, una corriente que defendía el conocimiento científico basado en hechos observables como la mejor guía para organizar la sociedad. La <b>industrialización</b> transformó profundamente la economía, la población y el territorio: el uso de máquinas y fábricas para producir a gran escala provocó un fuerte crecimiento urbano, con migración masiva desde el campo hacia las nuevas ciudades industriales, y el surgimiento de una clase obrera.';
  const item = pick(ESTADO_NACION_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const IMPERIALISMO_GUERRA_M1_BANK = [
  { pregunta:'¿Qué fue el imperialismo europeo del siglo XIX?', correcta:'La expansión de potencias europeas para dominar territorios en África, Asia y otras regiones', opts:['El retiro total de Europa de otros continentes','Una alianza igualitaria entre todos los países del mundo','El fin del comercio internacional'] },
  { pregunta:'¿Qué buscaban las potencias europeas al expandirse imperialmente?', correcta:'Materias primas, nuevos mercados y prestigio internacional', opts:['Solamente intercambiar cultura sin ningún interés económico','Regalar sus territorios a las colonias','Eliminar el comercio con esos territorios'] },
  { pregunta:'¿Qué efecto tuvo el imperialismo en la reconfiguración del mundo?', correcta:'La expansión del capitalismo y nuevas relaciones de dependencia entre países dominantes y dominados', opts:['La igualdad económica automática entre todos los países','El fin de todo intercambio comercial mundial','El aislamiento total de todos los continentes'] },
  { pregunta:'¿En qué año comenzó la Primera Guerra Mundial?', correcta:'1914', opts:['1900','1929','1939'] },
  { pregunta:'¿Qué efecto tuvo la Primera Guerra Mundial sobre la sociedad civil?', correcta:'Millones de muertos y heridos, y una fuerte movilización de la población civil para sostener el esfuerzo bélico', opts:['Ningún efecto sobre la población civil','Una mejora inmediata en la calidad de vida','El fin de todas las fábricas de Europa'] },
  { pregunta:'¿Qué cambio en el orden geopolítico mundial provocó el fin de la Primera Guerra Mundial?', correcta:'La caída de varios imperios y el redibujo de fronteras en Europa', opts:['El regreso exacto al mapa de antes de la guerra','La unificación de todo el mundo en un solo país','La desaparición de Europa del mapa'] },
  { pregunta:'¿Qué rol cumplieron las colonias durante el imperialismo del siglo XIX?', correcta:'Proveer materias primas y ser mercados para los productos de las potencias europeas', opts:['Gobernar directamente sobre las potencias europeas','No tener ninguna relación económica con Europa','Producir exactamente los mismos bienes que Europa'] },
  { pregunta:'¿Qué zonas del mundo fueron especialmente disputadas por las potencias imperialistas europeas?', correcta:'África y Asia, repartidas entre distintas potencias coloniales', opts:['La Antártica exclusivamente','El propio territorio europeo','Ningún territorio fue disputado'] },
  { pregunta:'¿Qué alianzas militares contribuyeron a que un conflicto localizado escalara hasta convertirse en la Primera Guerra Mundial?', correcta:'Un sistema de alianzas entre potencias que arrastró a muchos países al conflicto', opts:['La ausencia total de alianzas entre países','Un acuerdo de paz que evitó cualquier conflicto','Ninguna alianza tuvo relación con el inicio de la guerra'] },
  { pregunta:'¿Qué nuevas tecnologías bélicas se usaron por primera vez a gran escala durante la Primera Guerra Mundial?', correcta:'Ametralladoras, gases tóxicos y trincheras, entre otras', opts:['Únicamente arcos y flechas','Ninguna tecnología nueva','Solamente barcos de vela'] },
];
export function genImperialismoGuerraM1Round(){
  const recurso = 'El <b>imperialismo</b> del siglo XIX fue la expansión de potencias europeas para dominar territorios en África, Asia y otras regiones, buscando materias primas, nuevos mercados y prestigio internacional — este proceso expandió el capitalismo a escala mundial y creó nuevas relaciones de dependencia entre países dominantes y dominados. Estas tensiones entre potencias, sumadas a rivalidades territoriales y militares, desembocaron en 1914 en la <b>Primera Guerra Mundial</b>, un conflicto que provocó millones de muertos y heridos, movilizó fuertemente a la sociedad civil para sostener el esfuerzo bélico, y terminó con la caída de varios imperios, redibujando por completo las fronteras y el orden geopolítico de Europa.';
  const item = pick(IMPERIALISMO_GUERRA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const REPUBLICA_CHILE_M1_BANK = [
  { pregunta:'¿Cómo se caracterizó el proceso de formación de la República de Chile tras la independencia?', correcta:'Un período de enfrentamiento ideológico entre distintos proyectos políticos, hasta lograr estabilidad constitucional', opts:['Un proceso sin ningún conflicto político','El regreso inmediato a la monarquía española','La ausencia total de constituciones'] },
  { pregunta:'¿Qué buscaban lograr las distintas facciones políticas chilenas de las primeras décadas republicanas?', correcta:'Definir qué forma de gobierno y qué constitución debía tener el nuevo país', opts:['Restaurar el dominio colonial español','Anexar Chile a otro imperio','Eliminar toda forma de gobierno'] },
  { pregunta:'¿Qué aspecto ayudó a consolidar la república chilena tras su período inicial de inestabilidad?', correcta:'La defensa y organización del territorio, junto con un sistema electoral y debate político más estable', opts:['El abandono total del territorio nacional','La eliminación de todas las elecciones','El regreso a un gobierno sin ninguna ley'] },
  { pregunta:'¿Qué elemento fue clave para la consolidación territorial de Chile durante el siglo XIX?', correcta:'La defensa y organización de las fronteras del país', opts:['El abandono de todo el territorio sur','La entrega del territorio a otro país','La eliminación de las fronteras nacionales'] },
  { pregunta:'¿Qué caracterizó al debate político chileno durante la consolidación republicana?', correcta:'La confrontación de ideas entre distintos sectores políticos dentro de un marco institucional', opts:['La ausencia total de debate político','Un solo partido político sin ninguna oposición','La prohibición de cualquier discusión pública'] },
  { pregunta:'¿Qué institución fue central en el sistema electoral chileno del siglo XIX?', correcta:'El Congreso, elegido mediante procesos electorales', opts:['Un consejo de ancianos sin elección','Un sorteo anual entre toda la población','La designación directa por otro país'] },
  { pregunta:'¿Qué significó, en términos generales, la "estabilidad constitucional" que Chile fue logrando en el siglo XIX?', correcta:'Que el país logró organizarse bajo una constitución que ordenaba el ejercicio del poder de forma más permanente', opts:['Que Chile dejó de tener cualquier ley','Que se eliminaron todas las instituciones públicas','Que un solo gobernante tomó el poder para siempre'] },
  { pregunta:'¿Qué tipo de conflictos enfrentaron los distintos proyectos políticos durante los primeros años de la República de Chile?', correcta:'Disputas sobre si el poder debía concentrarse en un gobierno central fuerte o repartirse entre las provincias', opts:['Ningún tipo de disputa política','Un acuerdo inmediato sobre todos los temas','Solo disputas sobre el nombre del país'] },
  { pregunta:'¿Qué función cumplían las constituciones que se fueron probando en las primeras décadas republicanas de Chile?', correcta:'Establecer las reglas sobre cómo debía organizarse y ejercerse el poder del Estado', opts:['No tenían ninguna función real','Servían únicamente como documentos históricos sin aplicación','Reemplazaban por completo al gobierno'] },
  { pregunta:'¿Qué mostró el hecho de que Chile probara distintas constituciones antes de lograr mayor estabilidad?', correcta:'Que organizar un nuevo país republicano fue un proceso gradual de prueba y ajuste institucional', opts:['Que Chile nunca tuvo ninguna constitución','Que el proceso fue instantáneo y sin ningún ajuste','Que las constituciones no tenían ninguna importancia'] },
];
export function genRepublicaChileM1Round(){
  const recurso = 'La <b>formación de la República de Chile</b>, tras la independencia, no fue un proceso sin conflictos: distintas facciones políticas se enfrentaron ideológicamente para definir qué forma de gobierno y qué constitución debía tener el nuevo país, en un período de ensayos y crisis institucionales. Con el tiempo, Chile fue logrando mayor <b>estabilidad constitucional</b>, consolidando su territorio mediante la defensa y organización de sus fronteras, y desarrollando un sistema electoral y un debate político dentro de un marco institucional más permanente, con el Congreso como una institución central del sistema de gobierno. Este proceso de consolidación republicana fue gradual, y marcó las bases del sistema político chileno que se desarrollaría durante el resto del siglo XIX.';
  const item = pick(REPUBLICA_CHILE_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const SALITRE_PARLAMENTARISMO_M1_BANK = [
  { pregunta:'¿Cómo se insertó Chile en los procesos industriales mundiales del siglo XIX?', correcta:'Exportando recursos naturales, especialmente el salitre, a los mercados industriales de Europa', opts:['Fabricando maquinaria industrial para venderla a Europa','Cerrando todo su comercio con el exterior','Prohibiendo la exportación de minerales'] },
  { pregunta:'¿Qué transformación generó la riqueza salitrera en las finanzas del Estado chileno?', correcta:'Un fuerte aumento de los ingresos fiscales, que permitieron mayor inversión pública', opts:['La quiebra total del Estado chileno','La eliminación de todo ingreso fiscal','Ningún cambio en las finanzas públicas'] },
  { pregunta:'¿En qué se invirtieron muchos de los ingresos fiscales generados por el salitre?', correcta:'En obras públicas, educación e infraestructura del Estado', opts:['Únicamente en gastos militares extranjeros','En ningún proyecto público','En pagar deudas de otros países'] },
  { pregunta:'¿Qué papel cumplieron la prensa, la historiografía y la educación en Chile durante este período?', correcta:'Expandieron y consolidaron la idea de una identidad nacional chilena compartida', opts:['No tuvieron ninguna influencia en la sociedad','Solo se dedicaron a temas extranjeros','Eliminaron cualquier idea de nación'] },
  { pregunta:'¿Qué caracterizó al orden político liberal-parlamentario chileno de fines del siglo XIX?', correcta:'Un rol fuerte del Congreso en el gobierno, con reformas constitucionales que limitaron el poder presidencial', opts:['Un poder absoluto del presidente sin ningún límite','La eliminación total del Congreso','El regreso a un gobierno colonial'] },
  { pregunta:'¿Qué proceso institucional acompañó al orden parlamentario chileno de este período?', correcta:'Un proceso de secularización, separando gradualmente al Estado de la Iglesia en ciertas materias', opts:['La unión total del Estado con una sola religión','La eliminación de todas las instituciones del Estado','El fin de cualquier reforma constitucional'] },
  { pregunta:'¿Qué es la "cuestión social" que emergió en Chile con el cambio de siglo?', correcta:'Las difíciles condiciones de vida y trabajo de los obreros urbanos y mineros, que generaron nuevas demandas', opts:['Un debate exclusivamente sobre moda','La abundancia total de recursos para todos','La ausencia de cualquier problema social'] },
  { pregunta:'¿Qué nuevas demandas surgieron de los trabajadores durante el período salitrero?', correcta:'Mejores condiciones laborales, salarios y derechos sociales', opts:['La eliminación total del trabajo asalariado','El regreso al trabajo esclavo','Ninguna demanda concreta'] },
];
export function genSalitreParlamentarismoM1Round(){
  const recurso = 'Durante la segunda mitad del siglo XIX, Chile se insertó en los procesos industriales mundiales exportando recursos naturales, especialmente el <b>salitre</b>, que generó un fuerte aumento de los ingresos fiscales del Estado, invertidos en obras públicas, educación e infraestructura. En este período, la prensa, la historiografía y la educación ayudaron a expandir y consolidar una <b>identidad nacional</b> chilena compartida. Políticamente, se desarrolló un <b>orden liberal-parlamentario</b>, con un Congreso que ganó un rol central en el gobierno mediante reformas constitucionales que limitaron el poder presidencial, junto con un proceso de secularización que fue separando gradualmente al Estado de la Iglesia en ciertas materias. Sin embargo, la riqueza salitrera convivió con la llamada <b>"cuestión social"</b>: las difíciles condiciones de vida y trabajo de obreros urbanos y mineros, que generaron nuevas demandas por mejores salarios y derechos laborales.';
  const item = pick(SALITRE_PARLAMENTARISMO_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const GEOGRAFIA_PUEBLOS_M1_BANK = [
  { pregunta:'¿Con qué propósito el Estado chileno impulsó exploraciones hacia el sur y otras zonas del territorio en el siglo XIX?', correcta:'Caracterizar la población, desarrollar recursos y delimitar las fronteras del país', opts:['Abandonar esos territorios definitivamente','Regalar el territorio a otro país','Eliminar cualquier forma de gobierno en esas zonas'] },
  { pregunta:'¿Qué caracterizó la ocupación de Valdivia, Llanquihue, Chiloé y Magallanes en el siglo XIX?', correcta:'Una fuerte inmigración europea (especialmente alemana) que se sumó a la población local', opts:['La expulsión total de toda la población','La prohibición de vivir en esas zonas','El abandono completo del sur de Chile'] },
  { pregunta:'¿Qué efecto tuvo la ocupación de la Araucanía en la sociedad mapuche del siglo XIX?', correcta:'Afectó profundamente su organización territorial y su forma de vida tradicional', opts:['Ningún efecto sobre la sociedad mapuche','Una expansión del territorio mapuche','El fortalecimiento total de su autonomía previa'] },
  { pregunta:'¿Qué conflicto internacional del siglo XIX se relacionó con la riqueza del salitre?', correcta:'La Guerra del Pacífico (1879-1883)', opts:['La Guerra de Arauco','La Primera Guerra Mundial','La Guerra Fría'] },
  { pregunta:'¿Qué territorios pasaron a formar parte de Chile como consecuencia de la Guerra del Pacífico?', correcta:'Territorios ricos en salitre en el norte, tras el conflicto con Perú y Bolivia', opts:['Territorios en el sur de Argentina','La isla de Pascua','Territorios en el extremo austral'] },
  { pregunta:'¿Qué pueblos indígenas han mantenido relaciones de conflicto y convivencia con el Estado chileno, tanto en el pasado como en el presente?', correcta:'Entre otros, aymara, colla, rapa nui, mapuche, quechua, atacameño, kawéskar, yagán y diaguita', opts:['Únicamente pueblos de otros continentes','Ningún pueblo indígena habita el territorio chileno','Solo pueblos que ya no existen en la actualidad'] },
  { pregunta:'¿Por qué es importante reflexionar sobre la diversidad cultural de los pueblos originarios de Chile?', correcta:'Porque forman parte activa de la identidad y la historia del país, en el pasado y en el presente', opts:['Porque no tienen ninguna relación con la historia de Chile','Porque su cultura desapareció por completo','Porque solo importan para el turismo'] },
  { pregunta:'¿Qué buscaba el Estado chileno al delimitar sus fronteras durante el siglo XIX?', correcta:'Asegurar el control efectivo de su territorio y sus recursos', opts:['Eliminar cualquier límite territorial','Ceder todo el territorio a los países vecinos','No tener ninguna frontera definida'] },
];
export function genGeografiaPueblosM1Round(){
  const recurso = 'Durante el siglo XIX, el Estado chileno impulsó <b>exploraciones territoriales</b> para caracterizar su población, desarrollar recursos y delimitar sus fronteras. La ocupación de zonas como Valdivia, Llanquihue, Chiloé y Magallanes trajo una fuerte <b>inmigración europea</b>, mientras la ocupación de la <b>Araucanía</b> afectó profundamente la organización territorial y la forma de vida tradicional de la sociedad mapuche. La <b>Guerra del Pacífico</b> (1879-1883), motivada en parte por la riqueza del salitre, incorporó al territorio nacional zonas del norte ricas en ese recurso. Chile es un país donde conviven distintos <b>pueblos originarios</b> —aymara, colla, rapa nui, mapuche, quechua, atacameño, kawéskar, yagán y diaguita, entre otros—, con quienes el Estado ha mantenido relaciones de conflicto y convivencia tanto en el pasado como en el presente; reflexionar sobre esta diversidad cultural es reconocer que estos pueblos forman parte activa de la identidad y la historia del país.';
  const item = pick(GEOGRAFIA_PUEBLOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ECONOMIA_CIUDADANIA_M1_BANK = [
  { pregunta:'¿Qué explica el problema económico básico de la "escasez"?', correcta:'Que los recursos son limitados, pero las necesidades y deseos de las personas son prácticamente ilimitados', opts:['Que siempre hay recursos infinitos para todos','Que las personas no necesitan nada','Que el dinero nunca se acaba'] },
  { pregunta:'¿Qué determina el precio de un producto en el mercado?', correcta:'La relación entre la oferta (cuánto se produce) y la demanda (cuánto se quiere comprar)', opts:['Únicamente el color del producto','Un sorteo aleatorio cada semana','El clima del país exclusivamente'] },
  { pregunta:'¿Qué es un "préstamo" como instrumento financiero?', correcta:'Dinero que una entidad presta y que debe devolverse, generalmente con intereses', opts:['Dinero regalado sin ninguna condición','Un impuesto que se paga una sola vez','Un tipo de acción bursátil'] },
  { pregunta:'¿Qué representa una "acción" en el mercado bursátil?', correcta:'Una parte de la propiedad de una empresa, que se puede comprar o vender', opts:['Un préstamo bancario sin intereses','Un tipo de moneda extranjera','Un impuesto municipal'] },
  { pregunta:'¿Qué es el "ahorro" en términos financieros personales?', correcta:'Guardar una parte del ingreso para usarla en el futuro, en vez de gastarla toda de inmediato', opts:['Gastar todo el dinero disponible de inmediato','Pedir siempre dinero prestado','Regalar el dinero a otras personas'] },
  { pregunta:'¿Qué debería considerar un consumidor informado antes de comprar un producto o servicio?', correcta:'Sus derechos como consumidor, la calidad, el precio y su propia capacidad de pago', opts:['Únicamente el color del envase','Nada: cualquier compra es igual de conveniente','Solo la opinión de un desconocido en la calle'] },
  { pregunta:'¿Por qué es importante la responsabilidad financiera al usar instrumentos como el crédito?', correcta:'Porque un mal uso del crédito puede generar deudas difíciles de pagar', opts:['Porque el crédito siempre es gratuito','Porque nunca hay que devolver lo prestado','Porque no tiene ninguna consecuencia'] },
  { pregunta:'¿Qué tipo de respuestas políticas han dado distintas posturas ideológicas frente a problemas sociales como la pobreza?', correcta:'Desde mayor intervención del Estado hasta mayor confianza en el libre mercado, entre otras posturas', opts:['Todas las posturas políticas proponen exactamente lo mismo','Ninguna postura política se ha ocupado nunca de este tema','Solo existe una única respuesta posible y correcta'] },
  { pregunta:'¿Qué relación existe entre la industrialización histórica y el desarrollo sostenible actual?', correcta:'La industrialización generó un fuerte impacto ambiental que hoy se busca equilibrar con el desarrollo sostenible', opts:['No existe ninguna relación entre ambos procesos','La industrialización eliminó por completo el medioambiente','El desarrollo sostenible es un proceso sin ninguna relación con la economía'] },
];
export function genEconomiaCiudadaniaM1Round(){
  const recurso = 'La <b>escasez</b> es el problema económico básico: los recursos son limitados, pero las necesidades y deseos de las personas son prácticamente ilimitados. El <b>mercado</b> resuelve en parte este problema mediante el precio, que surge de la relación entre oferta y demanda. Entre los <b>instrumentos financieros</b> más comunes están el préstamo (dinero prestado que debe devolverse con intereses), el ahorro (guardar parte del ingreso para el futuro) y las acciones (una parte de la propiedad de una empresa que se compra o vende en la bolsa) — usarlos con responsabilidad es clave para evitar deudas difíciles de pagar. Frente a problemas sociales como la pobreza, distintas <b>posturas políticas</b> han propuesto respuestas diferentes, desde mayor intervención del Estado hasta mayor confianza en el libre mercado. Además, el impacto ambiental generado por la industrialización histórica es hoy uno de los grandes desafíos que el <b>desarrollo sostenible</b> busca equilibrar.';
  const item = pick(ECONOMIA_CIUDADANIA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/historia-geografia-ciencias-sociales/2-medio
   — OA01-25 (Historia OA01-21, Formación Ciudadana OA22-25). Ningún OA queda
   fuera del motor de opción múltiple. OA15-16 (interpretaciones historiográficas
   del golpe de 1973 y violaciones a los DD.HH. durante la dictadura) se tratan
   con el MISMO criterio ya usado en 6° básico (SIGLOXX_DEMOCRATIZACION_BANK) y
   en EPJA Nivel 2 Básica/Nivel 1 Media: solo hechos cronológicos indiscutibles
   y documentados por fuentes oficiales (Informe Rettig), sin comparar posturas
   historiográficas ni narrar detalles de violaciones específicas — decisión
   confirmada explícitamente con el usuario vía AskUserQuestion antes de
   escribir este módulo, dado que el texto literal de estos OA pide un nivel
   más profundo (comparar interpretaciones, explicar el desarrollo de las
   violaciones) que el criterio ya aplicado en el resto de la app. */
export const HISTORIA_MODULES_M2 = [
  {id:'entreguerrasm2', label:'Entreguerras y Vanguardias', open:true, key:'entreguerrasm2'},
  {id:'crisisliberalismom2', label:'Crisis del Liberalismo', open:true, key:'crisisliberalismom2'},
  {id:'segundaguerram2', label:'Segunda Guerra Mundial', open:true, key:'segundaguerram2'},
  {id:'republicachilem2', label:'República de Chile: Crisis y Reconstrucción', open:true, key:'republicachilem2'},
  {id:'guerrafriam2', label:'Guerra Fría', open:true, key:'guerrafriam2'},
  {id:'movilizacionchilem2', label:'Chile: Movilización y Crisis', open:true, key:'movilizacionchilem2'},
  {id:'dictaduratransicionm2', label:'Dictadura, Modelo Económico y Transición', open:true, key:'dictaduratransicionm2'},
  {id:'formacionciudadanam2', label:'Formación Ciudadana', open:true, key:'formacionciudadanam2'},
];
export const HISTORIA_POS_M2 = [
  {x:24,y:94},{x:68,y:84},{x:24,y:74},{x:68,y:64},{x:24,y:54},{x:68,y:44},{x:24,y:34},{x:68,y:24}
];

const ENTREGUERRAS_M2_BANK = [
  { pregunta:'¿Qué caracterizó a las vanguardias artísticas del período de entreguerras (surrealismo, cubismo, entre otras)?', correcta:'La ruptura con las formas artísticas tradicionales y la experimentación con nuevas técnicas y perspectivas', opts:['El apego estricto a las reglas del arte clásico grecorromano','El rechazo total a cualquier forma de expresión artística','La prohibición de exponer obras en museos'] },
  { pregunta:'¿Qué es la "cultura de masas" que se desarrolló en este período?', correcta:'Formas de entretenimiento y consumo cultural (cine, radio, deportes) dirigidas y accesibles a una gran cantidad de personas', opts:['Un tipo de arte exclusivo para una minoría muy reducida','La desaparición completa de los medios de comunicación','Una forma de gobierno autoritario'] },
  { pregunta:'¿Qué nuevos medios de comunicación impulsaron el desarrollo de la cultura de masas en la primera mitad del siglo XX?', correcta:'La radio y el cine, entre otros', opts:['Internet y los teléfonos celulares','La imprenta, inventada en ese mismo período','Las redes sociales digitales'] },
  { pregunta:'¿Qué buscaba el surrealismo, una de las vanguardias artísticas del período de entreguerras?', correcta:'Explorar el mundo de los sueños, lo irracional y el subconsciente en el arte', opts:['Representar la realidad de forma exacta y fotográfica','Seguir estrictamente las reglas del arte renacentista','Prohibir cualquier forma de pintura abstracta'] },
  { pregunta:'¿Qué característica definía al cubismo como vanguardia artística?', correcta:'Representar objetos y figuras descomponiéndolos en formas geométricas desde múltiples perspectivas a la vez', opts:['Pintar siempre paisajes naturales de forma realista','Usar exclusivamente blanco y negro en todas las obras','Copiar fielmente obras de siglos anteriores'] },
  { pregunta:'¿Qué papel cumplió el cine como parte de la cultura de masas del período de entreguerras?', correcta:'Se convirtió en una forma de entretenimiento accesible para grandes audiencias, difundiendo modas e ideas', opts:['Fue un medio exclusivo, disponible solo para unas pocas personas','No tuvo ninguna influencia sobre la sociedad de la época','Desapareció por completo durante este período'] },
  { pregunta:'¿Por qué se dice que las vanguardias artísticas de entreguerras "rompieron" con la tradición?', correcta:'Porque experimentaron con nuevas formas, técnicas y temas, alejándose de las reglas del arte académico clásico', opts:['Porque dejaron de producir cualquier tipo de obra de arte','Porque solo repitieron exactamente el estilo del Renacimiento','Porque se prohibió la creación artística en esa época'] },
  { pregunta:'¿Qué tipo de deportes y espectáculos masivos ganaron enorme popularidad como parte de la cultura de masas de entreguerras?', correcta:'Eventos deportivos y espectáculos de entretenimiento seguidos por audiencias multitudinarias', opts:['Actividades reservadas exclusivamente a la nobleza','Prácticas que desaparecieron por completo en esa época','Torneos que nadie podía presenciar públicamente'] },
  { pregunta:'¿Qué efecto tuvo la radio en la vida cotidiana de las familias durante el período de entreguerras?', correcta:'Permitió llevar noticias, música y entretenimiento directamente a los hogares de forma masiva', opts:['No tuvo ningún efecto en la vida cotidiana de las personas','Solo estaba disponible en oficinas de gobierno','Reemplazó por completo la necesidad de periódicos y libros'] },
];
export function genEntreguerrasM2Round(){
  const recurso = 'El período de <b>entreguerras</b> (entre la Primera y la Segunda Guerra Mundial) trajo una intensa transformación cultural: las <b>vanguardias artísticas</b> (como el surrealismo o el cubismo) rompieron con las formas tradicionales del arte, experimentando con nuevas técnicas y perspectivas para representar la realidad de formas antes impensadas. Al mismo tiempo, se expandió la <b>cultura de masas</b>: gracias a nuevos medios como la radio y el cine, el entretenimiento y el consumo cultural llegaron a una cantidad de personas mucho mayor que antes, transformando la manera en que la sociedad compartía ideas, modas y formas de diversión.';
  const item = pick(ENTREGUERRAS_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const CRISIS_LIBERALISMO_M2_BANK = [
  { pregunta:'¿Qué fue la crisis de 1929 (la "Gran Depresión")?', correcta:'Una grave crisis económica mundial, originada en Estados Unidos, que provocó desempleo masivo y quiebra de empresas', opts:['Un período de crecimiento económico sostenido a nivel mundial','Un conflicto armado entre países europeos','Una epidemia sanitaria mundial'] },
  { pregunta:'¿Qué tipo de régimen político surgió en varios países europeos tras la crisis de los Estados liberales (como en Italia y Alemania)?', correcta:'Regímenes totalitarios, con un control absoluto del Estado sobre la sociedad', opts:['Monarquías parlamentarias más democráticas que antes','Repúblicas federales con mayor descentralización','Gobiernos exclusivamente religiosos'] },
  { pregunta:'¿Qué es el "Estado de bienestar" que surgió como respuesta a la crisis del liberalismo clásico en algunos países?', correcta:'Un modelo en que el Estado interviene activamente para garantizar servicios sociales (salud, educación, seguridad social)', opts:['Un modelo donde el Estado no interviene en absoluto en la economía','Un sistema sin ningún tipo de impuestos','Un régimen exclusivamente militar'] },
  { pregunta:'¿Qué efecto tuvo la crisis de 1929 sobre el desempleo a nivel mundial?', correcta:'Provocó un aumento masivo del desempleo en muchos países', opts:['Eliminó por completo el desempleo en todo el mundo','No tuvo ningún efecto sobre el empleo','Solo afectó a un país, sin ninguna repercusión internacional'] },
  { pregunta:'¿Qué caracteriza a un régimen totalitario, como los que surgieron en algunos países europeos tras la crisis del liberalismo?', correcta:'Un control absoluto del Estado sobre casi todos los aspectos de la vida social, sin libertades individuales reales', opts:['Un sistema con múltiples partidos políticos compitiendo libremente','Un gobierno que no interviene en absoluto en la sociedad','Una monarquía puramente simbólica sin poder real'] },
  { pregunta:'¿Qué buscaba principalmente el Estado de bienestar frente a los problemas sociales que dejó la crisis económica?', correcta:'Reducir la desigualdad y proteger a la población mediante políticas públicas de salud, educación y seguridad social', opts:['Eliminar por completo cualquier servicio público','Aumentar la desigualdad social de forma deliberada','Prohibir cualquier tipo de educación pública'] },
  { pregunta:'¿Por qué se dice que la crisis de 1929 tuvo un alcance mundial y no solo nacional?', correcta:'Porque las economías de distintos países estaban interconectadas por el comercio internacional, y la crisis se propagó entre ellas', opts:['Porque cada país vivió la crisis de forma completamente aislada','Porque solo afectó a un continente sin ninguna conexión con otros','Porque no existía ningún tipo de comercio internacional en esa época'] },
  { pregunta:'¿Qué llevó a muchas personas a apoyar regímenes totalitarios tras la crisis económica de 1929?', correcta:'La promesa de orden, estabilidad económica y empleo frente a la incertidumbre y el desempleo masivo', opts:['El deseo generalizado de eliminar cualquier forma de gobierno','La ausencia total de problemas económicos previos','Una decisión tomada sin ninguna relación con la crisis'] },
  { pregunta:'¿Qué diferencia principal existe entre un Estado liberal clásico y un Estado de bienestar?', correcta:'El Estado de bienestar interviene activamente para garantizar servicios sociales, mientras el liberal clásico deja esas funciones principalmente al mercado', opts:['No existe ninguna diferencia real entre ambos modelos','El Estado liberal clásico siempre garantiza más servicios sociales','El Estado de bienestar elimina por completo cualquier tipo de mercado'] },
];
export function genCrisisLiberalismoM2Round(){
  const recurso = 'A comienzos del siglo XX, los <b>Estados liberales</b> (basados en el libre mercado con poca intervención estatal) entraron en crisis, agravada por la <b>crisis de 1929</b> (la Gran Depresión): una crisis económica mundial que provocó desempleo masivo y la quiebra de numerosas empresas. Como respuesta, surgieron distintos modelos políticos: en algunos países aparecieron <b>regímenes totalitarios</b> (con un control absoluto del Estado sobre la sociedad, sin libertades individuales), mientras que en otros se desarrolló el <b>Estado de bienestar</b>, un modelo en que el Estado interviene activamente en la economía para garantizar servicios sociales como salud, educación y seguridad social a toda la población.';
  const item = pick(CRISIS_LIBERALISMO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const SEGUNDA_GUERRA_M2_BANK = [
  { pregunta:'¿Qué caracterizó a la Segunda Guerra Mundial en términos de confrontación ideológica?', correcta:'Un enfrentamiento entre potencias con proyectos políticos e ideológicos muy distintos, con enorme cantidad de víctimas civiles', opts:['Un conflicto exclusivamente entre ejércitos, sin ninguna víctima civil','Una guerra sin ninguna base ideológica de por medio','Un conflicto que no involucró a ningún país fuera de Europa'] },
  { pregunta:'¿Qué fue el Holocausto durante la Segunda Guerra Mundial?', correcta:'El genocidio sistemático de millones de personas, principalmente judíos, perpetrado por la Alemania nazi', opts:['Un tratado de paz firmado al final de la guerra','Una alianza militar entre países aliados','Un programa de ayuda humanitaria internacional'] },
  { pregunta:'¿Qué demostró el uso de armas atómicas al final de la Segunda Guerra Mundial (Hiroshima y Nagasaki)?', correcta:'La enorme capacidad destructiva de esta nueva tecnología militar', opts:['Que las armas atómicas no tenían ningún efecto real','Que la guerra había terminado varios años antes','Que ningún país había desarrollado tecnología nuclear'] },
  { pregunta:'¿Por qué se dice que la Segunda Guerra Mundial tuvo un componente ideológico muy marcado?', correcta:'Porque enfrentó proyectos políticos muy distintos, como el fascismo, el nazismo y las democracias aliadas', opts:['Porque fue un conflicto sin ninguna diferencia de ideas entre los bandos','Porque no participó ningún gobierno en el conflicto','Porque solo involucró disputas territoriales, sin ninguna ideología'] },
  { pregunta:'¿Qué distingue al Holocausto de otros hechos de la Segunda Guerra Mundial?', correcta:'Fue un genocidio sistemático y planificado, dirigido principalmente contra la población judía de Europa', opts:['Fue un acuerdo comercial entre países en guerra','Fue una campaña de ayuda humanitaria durante el conflicto','Fue un tratado de paz firmado antes de terminar la guerra'] },
];
const CONSECUENCIAS_GUERRA_M2_BANK = [
  { pregunta:'¿Qué nuevas potencias emergieron como las más influyentes tras la Segunda Guerra Mundial?', correcta:'Estados Unidos y la Unión Soviética', opts:['Alemania y Japón','Francia y España','Italia y Portugal'] },
  { pregunta:'¿Qué proceso, iniciado tras la Segunda Guerra Mundial, llevó a que muchas colonias en África y Asia se independizaran?', correcta:'La descolonización', opts:['La reconquista colonial','La unificación imperial','La expansión territorial europea'] },
  { pregunta:'¿Qué organización internacional se creó tras la Segunda Guerra Mundial para promover la paz y la cooperación entre países?', correcta:'La Organización de las Naciones Unidas (ONU)', opts:['La Unión Europea','La OTAN, creada en ese mismo momento','El Fondo Monetario Internacional únicamente'] },
  { pregunta:'¿Qué documento internacional, adoptado tras la Segunda Guerra Mundial, estableció derechos básicos que deben respetarse en todos los países?', correcta:'La Declaración Universal de los Derechos Humanos', opts:['El Tratado de Versalles','La Carta Magna inglesa','El Código de Napoleón'] },
  { pregunta:'¿Por qué la creación de la ONU tras la Segunda Guerra Mundial fue considerada un hito importante?', correcta:'Porque buscaba dar a los países un espacio de diálogo y cooperación para evitar nuevos conflictos globales', opts:['Porque eliminó por completo cualquier posibilidad de conflicto futuro','Porque reemplazó a todos los gobiernos nacionales del mundo','Porque solo tenía funciones deportivas internacionales'] },
];
export function genSegundaGuerraM2Round(){
  const recurso = 'La <b>Segunda Guerra Mundial</b> (1939-1945) fue un enfrentamiento entre potencias con proyectos ideológicos muy distintos, marcado por un altísimo número de víctimas civiles y por el <b>Holocausto</b>: el genocidio sistemático de millones de personas, principalmente judías, perpetrado por la Alemania nazi. El uso de <b>armas atómicas</b> sobre Hiroshima y Nagasaki demostró la enorme capacidad destructiva de esta nueva tecnología militar. Entre las <b>consecuencias</b> de la guerra están la emergencia de Estados Unidos y la Unión Soviética como las potencias más influyentes, el inicio de la <b>descolonización</b> de territorios en África y Asia, y la creación de instituciones internacionales como la <b>ONU</b> y la <b>Declaración Universal de los Derechos Humanos</b>, pensadas para promover la paz y evitar que atrocidades similares volvieran a ocurrir.';
  const item = pick(Math.random()<0.5 ? SEGUNDA_GUERRA_M2_BANK : CONSECUENCIAS_GUERRA_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const REPUBLICA_CHILE_M2_BANK = [
  { pregunta:'¿Qué solucionó la nueva Constitución de 1925 en Chile, tras la crisis del período parlamentario?', correcta:'Fortaleció al poder presidencial, terminando con el predominio absoluto del Congreso propio del parlamentarismo', opts:['Estableció una monarquía en Chile','Eliminó por completo la existencia del Congreso','Suspendió las elecciones de forma indefinida'] },
  { pregunta:'¿Qué transformaciones vivió Chile tras la crisis de 1929?', correcta:'Un proceso de industrialización impulsado por el Estado y la expansión de servicios sociales', opts:['El abandono total de cualquier actividad económica','La eliminación completa del comercio internacional','El regreso a una economía exclusivamente agrícola colonial'] },
  { pregunta:'¿Qué rol cumplió la CORFO (Corporación de Fomento de la Producción), creada en 1939 en Chile?', correcta:'Impulsar la industrialización del país mediante inversión y planificación estatal', opts:['Administrar exclusivamente el sistema educativo','Regular el tránsito vehicular en las ciudades','Organizar torneos deportivos nacionales'] },
  { pregunta:'¿Qué avances sociales se relacionan con la ampliación de la participación política a mediados del siglo XX en Chile?', correcta:'La incorporación del voto femenino y la mayor organización de sindicatos y partidos populares', opts:['La eliminación total del derecho a voto','El fin de cualquier forma de organización sindical','La prohibición de partidos políticos'] },
  { pregunta:'¿Qué papel cumplió la cultura de masas (radio, cine) en el proceso de democratización social de mediados del siglo XX en Chile?', correcta:'Ayudó a difundir información y a que más sectores sociales participaran de la vida pública y cultural', opts:['No tuvo ninguna relación con la vida pública del país','Solo estuvo disponible para una minoría muy reducida de la población','Prohibió la participación de nuevos sectores sociales'] },
  { pregunta:'¿Por qué la Constitución de 1925 marcó un cambio importante en el sistema político chileno?', correcta:'Porque reemplazó el sistema parlamentario por uno con un poder presidencial fortalecido', opts:['Porque estableció que Chile pasara a ser una monarquía','Porque eliminó por completo las elecciones presidenciales','Porque devolvió todo el poder al Congreso'] },
  { pregunta:'¿En qué año se otorgó el derecho a voto en elecciones presidenciales a las mujeres en Chile?', correcta:'En 1949', opts:['En 1810','En 1990','En 1925'] },
  { pregunta:'¿Qué buscaba la industrialización impulsada por el Estado chileno tras la crisis de 1929?', correcta:'Reducir la dependencia de las exportaciones de materias primas, desarrollando industria nacional', opts:['Aumentar exclusivamente las exportaciones agrícolas','Eliminar cualquier tipo de producción nacional','Depender aún más de un solo producto de exportación'] },
];
export function genRepublicaChileM2Round(){
  const recurso = 'Tras la crisis del período parlamentario, la <b>Constitución de 1925</b> fortaleció el poder presidencial en Chile, terminando con el predominio casi absoluto que tenía el Congreso durante el parlamentarismo. Después de la crisis de 1929, el país impulsó un proceso de <b>industrialización</b> liderado por el Estado, con instituciones como la <b>CORFO</b> (creada en 1939) planificando e invirtiendo en nuevas industrias, junto con la expansión de servicios sociales. A mediados del siglo XX, la participación política se amplió con avances como el <b>voto femenino</b> y una mayor organización de sindicatos y partidos populares, mientras la <b>cultura de masas</b> (radio, cine) ayudaba a que más sectores sociales tomaran parte de la vida pública y cultural del país.';
  const item = pick(REPUBLICA_CHILE_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const GUERRA_FRIA_M2_BANK = [
  { pregunta:'¿Qué fue la Guerra Fría?', correcta:'Un largo período de confrontación ideológica, política y militar entre Estados Unidos (capitalismo) y la Unión Soviética (comunismo), sin un enfrentamiento militar directo entre ambos', opts:['Una guerra formal declarada entre Estados Unidos y la Unión Soviética','Un período sin ningún tipo de tensión internacional','Un conflicto exclusivamente comercial sin componente político'] },
  { pregunta:'¿En qué ámbitos se manifestó principalmente la confrontación de la Guerra Fría, además del político?', correcta:'En la cultura, la ciencia y la tecnología (por ejemplo, la carrera espacial)', opts:['Únicamente en el deporte olímpico','Solo en la moda y la gastronomía','Exclusivamente en la arquitectura de edificios'] },
  { pregunta:'¿Qué transformación vivieron muchas sociedades occidentales durante la Guerra Fría, en términos económicos y de consumo?', correcta:'Un fuerte crecimiento económico y la expansión de una sociedad de consumo masivo', opts:['Un estancamiento económico total en todos los países occidentales','La desaparición completa del comercio internacional','El fin de cualquier tipo de desarrollo tecnológico'] },
  { pregunta:'¿Qué caracterizó a varios procesos de movilización social y política en América Latina durante la Guerra Fría?', correcta:'Tensiones entre proyectos revolucionarios, la influencia de Estados Unidos, y la llegada de golpes de Estado en distintos países', opts:['La ausencia total de conflictos políticos en la región','Una estabilidad política absoluta en todos los países','El fin completo de cualquier intervención extranjera en la región'] },
  { pregunta:'¿Qué llevó al fin de la Guerra Fría hacia comienzos de la década de 1990?', correcta:'El colapso de la Unión Soviética y el reordenamiento geopolítico mundial que le siguió', opts:['Una guerra directa entre Estados Unidos y la Unión Soviética','La disolución de las Naciones Unidas','La reunificación de todos los países bajo un solo gobierno'] },
  { pregunta:'¿Por qué se le llama "Guerra Fría" a este período, si no hubo un enfrentamiento militar directo entre las dos superpotencias?', correcta:'Porque la confrontación se dio mediante otros medios (ideológicos, tecnológicos, económicos) en vez de una guerra declarada entre ambas', opts:['Porque el conflicto ocurrió únicamente en zonas de clima muy frío','Porque no existió ninguna tensión real entre ambos países','Porque fue un conflicto exclusivamente deportivo'] },
  { pregunta:'¿Qué fue la "carrera espacial" durante la Guerra Fría?', correcta:'La competencia entre Estados Unidos y la Unión Soviética por lograr avances tecnológicos y científicos en la exploración espacial', opts:['Una competencia deportiva de atletismo entre ambos países','Un tratado de desarme nuclear firmado en los años 60','Una alianza militar conjunta entre ambas potencias'] },
  { pregunta:'¿Qué caracterizó a la "sociedad de consumo" que se expandió en Occidente durante la Guerra Fría?', correcta:'Un aumento del acceso a bienes y servicios de consumo masivo, impulsado por el crecimiento económico', opts:['Una escasez generalizada de productos de consumo','La prohibición de comprar bienes importados','El fin completo del comercio y la producción industrial'] },
];
export function genGuerraFriaM2Round(){
  const recurso = 'La <b>Guerra Fría</b> fue un largo período (desde fines de la Segunda Guerra Mundial hasta comienzos de los años 90) de confrontación ideológica, política y militar entre Estados Unidos (capitalismo) y la Unión Soviética (comunismo), sin que ambos países se enfrentaran directamente en una guerra formal — la tensión se manifestó en cambio en la cultura, la ciencia y la tecnología (como la carrera espacial). Muchas sociedades occidentales vivieron un fuerte crecimiento económico y la expansión de una <b>sociedad de consumo</b> masivo. En <b>América Latina</b>, este período trajo tensiones entre proyectos revolucionarios, la influencia de Estados Unidos, y la llegada de golpes de Estado en distintos países de la región. La Guerra Fría terminó con el <b>colapso de la Unión Soviética</b> hacia comienzos de la década de 1990, lo que reordenó por completo el mapa geopolítico mundial y dio paso al auge del neoliberalismo económico.';
  const item = pick(GUERRA_FRIA_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const MOVILIZACION_CHILE_M2_BANK = [
  { pregunta:'¿Qué proceso demográfico caracterizó a Chile a mediados del siglo XX, generando segregación en las nuevas ciudades?', correcta:'La migración masiva desde zonas rurales hacia las ciudades', opts:['La migración masiva desde las ciudades hacia el campo','La desaparición completa de las zonas urbanas','Un descenso general de la población total del país'] },
  { pregunta:'¿Qué caracterizó a Chile como escenario de movilización social y política durante la década de 1960?', correcta:'Una fuerte demanda de reformas sociales y distintos proyectos políticos que competían por implementarlas', opts:['Una calma política total, sin ningún tipo de demanda social','La ausencia completa de participación ciudadana','El fin de cualquier tipo de organización sindical'] },
  { pregunta:'¿Qué proyectos políticos protagonizaron la escena chilena de los años 60 y comienzos de los 70?', correcta:'La Democracia Cristiana (Reforma en Libertad) y la Unidad Popular (vía chilena al socialismo), entre otros', opts:['Solo un partido único sin ninguna competencia electoral','Ningún proyecto político relevante durante esos años','Un régimen monárquico restaurado'] },
  { pregunta:'¿Qué factores caracterizaron la crisis de comienzos de los años 70 en Chile, previa al quiebre institucional de 1973?', correcta:'Una fuerte polarización política, el debilitamiento de las instituciones y una creciente desestabilización económica', opts:['Una estabilidad política y económica total, sin ningún conflicto','El fin completo de cualquier participación política','Un acuerdo unánime entre todos los sectores políticos'] },
  { pregunta:'¿Qué problema urbano se generó en Chile a raíz de la migración masiva del campo a la ciudad?', correcta:'La formación de poblaciones periféricas con acceso limitado a servicios básicos y segregación social', opts:['Un aumento de la población rural, sin ningún efecto urbano','La desaparición completa de las ciudades chilenas','Ningún cambio relevante en la organización de las ciudades'] },
  { pregunta:'¿Qué buscaba la "Reforma en Libertad", el proyecto impulsado por la Democracia Cristiana en los años 60?', correcta:'Impulsar reformas sociales y económicas (como la reforma agraria) dentro del marco institucional existente', opts:['Eliminar por completo las elecciones democráticas','Mantener exactamente igual la estructura económica del país','Prohibir cualquier tipo de reforma social'] },
  { pregunta:'¿Qué buscaba el proyecto de la Unidad Popular, liderado por Salvador Allende, a comienzos de los años 70?', correcta:'Avanzar hacia el socialismo a través de una vía chilena, dentro del sistema democrático e institucional', opts:['Restaurar una monarquía en Chile','Eliminar por completo cualquier tipo de reforma económica','Anular las elecciones democráticas del país'] },
  { pregunta:'¿Qué papel cumplieron los sindicatos y organizaciones sociales en la movilización chilena de los años 60 y comienzos de los 70?', correcta:'Impulsaron demandas de mejores condiciones laborales y mayor participación política de sectores populares', opts:['No tuvieron ninguna participación en la vida política del país','Se dedicaron únicamente a actividades recreativas, sin ningún rol político','Fueron prohibidos por completo durante esa época'] },
];
export function genMovilizacionChileM2Round(){
  const recurso = 'A mediados del siglo XX, Chile vivió una intensa <b>migración desde el campo hacia las ciudades</b>, lo que generó un crecimiento urbano acelerado y problemas de segregación en las nuevas poblaciones. Durante la década de 1960, el país fue escenario de una fuerte <b>movilización social y política</b>, con distintos proyectos compitiendo por implementar reformas: la Democracia Cristiana impulsó la "Reforma en Libertad" y la Unidad Popular propuso la "vía chilena al socialismo", entre otros proyectos. Hacia comienzos de la década de 1970, el país entró en una etapa de <b>crisis</b> marcada por una fuerte polarización política, el debilitamiento de las instituciones democráticas y una creciente desestabilización económica, un contexto que antecedió al quiebre institucional de 1973.';
  const item = pick(MOVILIZACION_CHILE_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const QUIEBRE_1973_M2_BANK = [
  { pregunta:'¿En qué fecha ocurrió el golpe de Estado que derrocó al gobierno de Salvador Allende en Chile?', correcta:'El 11 de septiembre de 1973', opts:['El 11 de marzo de 1990','El 5 de octubre de 1988','El 11 de septiembre de 1990'] },
  { pregunta:'¿Cómo se organizó el nuevo gobierno tras el golpe de Estado de 1973?', correcta:'Una Junta Militar asumió el gobierno y el país quedó bajo un régimen militar', opts:['Se mantuvo exactamente el mismo gobierno anterior sin cambios','Se convocó de inmediato a nuevas elecciones libres','Se restauró la monarquía española en Chile'] },
  { pregunta:'¿Qué organismos oficiales chilenos han documentado, con posterioridad al régimen militar, violaciones a los derechos humanos ocurridas durante ese período?', correcta:'Comisiones oficiales como la Comisión Rettig y la Comisión Valech', opts:['Ningún organismo oficial ha investigado nunca este período','Solo organizaciones extranjeras sin ninguna comisión chilena','Un tribunal internacional creado exclusivamente para Chile en 1973'] },
  { pregunta:'¿En qué fecha se realizó el plebiscito que dio inicio al fin del régimen militar en Chile?', correcta:'El 5 de octubre de 1988', opts:['El 11 de septiembre de 1973','El 11 de marzo de 1990','El 11 de septiembre de 1990'] },
  { pregunta:'¿Qué ocurrió el 11 de marzo de 1990 en Chile?', correcta:'Asumió Patricio Aylwin como presidente, iniciando el retorno a un gobierno democráticamente electo', opts:['Ocurrió el golpe de Estado de 1973','Se realizó el plebiscito de 1988','Se promulgó la Constitución de 1925'] },
];
const MODELO_ECONOMICO_M2_BANK = [
  { pregunta:'¿Qué modelo económico se implementó en Chile durante el régimen militar (1973-1990)?', correcta:'Un modelo neoliberal, con privatizaciones y apertura al mercado internacional', opts:['Un modelo de economía completamente planificada por el Estado, sin mercado','El regreso a una economía exclusivamente agrícola de subsistencia','La eliminación total del comercio con otros países'] },
  { pregunta:'¿Qué estableció la Constitución de 1980 en Chile?', correcta:'Un nuevo marco institucional que organizó los poderes del Estado, vigente (con reformas posteriores) hasta la actualidad', opts:['La restauración de la Constitución de 1833','La eliminación completa de cualquier tipo de Constitución','Un sistema de gobierno monárquico'] },
  { pregunta:'¿Qué factores contribuyeron a que, hacia la década de 1980, se fortaleciera un proceso de recuperación democrática en Chile?', correcta:'Una crisis económica, la creciente movilización social, y la mediación de distintas instituciones', opts:['Ningún factor relevante, el proceso ocurrió sin ninguna causa','Una intervención militar extranjera directa','El fin espontáneo de cualquier tipo de organización social'] },
  { pregunta:'¿Qué caracterizó a la sociedad chilena en las décadas posteriores a la recuperación democrática, en términos de estructura social e infraestructura?', correcta:'Importantes cambios en la estructura social, la infraestructura del país, y el acceso a la educación, junto con demandas de sectores históricamente postergados', opts:['Ningún cambio social relevante desde 1990 hasta la actualidad','La desaparición completa de cualquier desigualdad social','El fin de cualquier tipo de demanda o reivindicación social'] },
];
export function genDictaduraTransicionM2Round(){
  const recurso = 'El <b>11 de septiembre de 1973</b> un golpe de Estado derrocó al gobierno de Salvador Allende, y una Junta Militar asumió el gobierno del país, dando inicio a un régimen militar. Con posterioridad, comisiones oficiales como la <b>Comisión Rettig</b> y la <b>Comisión Valech</b> documentaron violaciones a los derechos humanos ocurridas durante ese período. Durante el régimen militar (1973-1990) se implementó un <b>modelo económico neoliberal</b> (privatizaciones y apertura al mercado internacional) y se promulgó la <b>Constitución de 1980</b>, que organizó los poderes del Estado. Una crisis económica y una creciente movilización social contribuyeron al proceso de recuperación democrática: el <b>5 de octubre de 1988</b> se realizó un plebiscito, y el <b>11 de marzo de 1990</b> asumió Patricio Aylwin como presidente, retornando el país a un gobierno democráticamente electo. Las décadas posteriores trajeron importantes cambios en la estructura social, la infraestructura y el acceso a la educación del país.';
  const item = pick(Math.random()<0.6 ? QUIEBRE_1973_M2_BANK : MODELO_ECONOMICO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const FORMACION_CIUDADANA_M2_BANK = [
  { pregunta:'¿Qué característica clave tienen los derechos humanos, según los principios que los definen?', correcta:'Son universales: corresponden a todas las personas, sin ninguna excepción o distinción', opts:['Solo aplican a ciudadanos de un país específico','Pueden ser eliminados por una ley cualquiera sin ningún límite','Solo protegen a un grupo reducido de personas'] },
  { pregunta:'¿Qué mecanismos existen, a nivel nacional e internacional, para proteger los derechos humanos?', correcta:'Instituciones como tribunales, defensorías y organismos internacionales de derechos humanos', opts:['No existe ningún mecanismo de protección en ningún país','Solo mecanismos informales sin ningún respaldo legal','Únicamente acuerdos verbales sin ningún efecto real'] },
  { pregunta:'¿Qué elementos son parte fundamental del "Estado de derecho"?', correcta:'Un marco constitucional, la separación de poderes y la igualdad de todas las personas ante la ley', opts:['El poder absoluto de una sola persona sin ningún límite legal','La ausencia total de leyes escritas','Un sistema sin ningún tipo de tribunales'] },
  { pregunta:'¿Cuál es uno de los principales desafíos pendientes en Chile relacionados con el desarrollo sostenible y la equidad social?', correcta:'Reducir la pobreza y las desigualdades, avanzando hacia un desarrollo más sostenible', opts:['Chile ya no tiene ningún desafío pendiente en estas áreas','Aumentar deliberadamente la desigualdad social','Eliminar por completo cualquier política social'] },
  { pregunta:'¿Qué representa la creciente diversidad cultural en las sociedades actuales, en el contexto de la globalización?', correcta:'Una oportunidad para el intercambio cultural, que también exige prevenir la discriminación', opts:['Un problema que debe eliminarse por completo','Algo que no tiene ninguna relación con la globalización','Una amenaza que debe prohibirse por ley'] },
  { pregunta:'¿Por qué se dice que los derechos humanos son "inalienables"?', correcta:'Porque no se le pueden quitar a una persona, sin importar las circunstancias', opts:['Porque se pueden vender o transferir libremente','Porque dependen únicamente de la nacionalidad de la persona','Porque solo aplican durante un período limitado de tiempo'] },
  { pregunta:'¿Qué rol cumple la separación de poderes (ejecutivo, legislativo, judicial) dentro del Estado de derecho?', correcta:'Evitar que una sola persona o institución concentre todo el poder del Estado', opts:['Permitir que un solo poder controle completamente a los otros dos','Eliminar por completo la necesidad de un poder judicial','Concentrar todo el poder en el poder ejecutivo'] },
  { pregunta:'¿Por qué la reducción de la pobreza sigue siendo un desafío pendiente en muchos países, incluido Chile?', correcta:'Porque, a pesar de avances económicos, persisten desigualdades en el acceso a oportunidades y recursos', opts:['Porque la pobreza ya fue completamente erradicada en todo el mundo','Porque no existe ninguna forma de medir la pobreza','Porque no tiene ninguna relación con las políticas públicas'] },
];
export function genFormacionCiudadanaM2Round(){
  const recurso = 'Los <b>derechos humanos</b> son universales: corresponden a todas las personas, sin ninguna excepción, y existen instituciones nacionales e internacionales (tribunales, defensorías, organismos internacionales) para protegerlos. El <b>Estado de derecho</b> se basa en un marco constitucional, la separación de poderes y la igualdad de todas las personas ante la ley — principios que buscan evitar el abuso de poder. Entre los <b>desafíos pendientes</b> del país está reducir la pobreza y las desigualdades, avanzando hacia un desarrollo más sostenible. Además, la creciente <b>diversidad cultural</b> propia de la globalización representa una oportunidad de intercambio entre culturas, que a la vez exige trabajar activamente para prevenir la discriminación y promover el respeto entre todas las personas.';
  const item = pick(FORMACION_CIUDADANA_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}


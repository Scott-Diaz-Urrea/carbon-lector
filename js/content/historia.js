import { pick, shuffle, randInt } from '../utils.js';
import { chileFlagSVG } from '../svg.js';

export const HISTORIA_MODULES = [
  {id:'calendario', label:'Calendario', open:true, key:'calendario'},
  {id:'miidentidad', label:'Mi Identidad', open:true, key:'miidentidad'},
  {id:'simbolos', label:'Símbolos de Chile', open:true, key:'simbolos'},
  {id:'mapas', label:'Mapas de Chile', open:true, key:'mapas'},
  {id:'comunidad', label:'Convivencia y Comunidad', open:true, key:'comunidad'},
];
export const HISTORIA_POS = [{x:22,y:88},{x:68,y:70},{x:24,y:52},{x:70,y:34},{x:24,y:16}];

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 1° Básico ----------------
   Basado en OA del Decreto 439/2012 (curriculumnacional.cl):
   HI01 OA01 -> Calendario · HI01 OA02-04 -> Mi Identidad ·
   HI01 OA05-06 -> Símbolos de Chile · HI01 OA08-10 -> Mapas de Chile ·
   HI01 OA11,13-15 -> Convivencia y Comunidad.
   OA07 (personajes históricos) y OA12 (niños del mundo) quedaron fuera para no
   arriesgar datos históricos inexactos o generalizaciones culturales sin fuente. */
const DIAS_SEMANA = ['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO','DOMINGO'];
const MESES_ANIO = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

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
  { emoji:'👵', q:'¿Cómo le dices a la mamá de tu mamá o de tu papá?', correct:'ABUELA' },
  { emoji:'👴', q:'¿Cómo le dices al papá de tu mamá o de tu papá?', correct:'ABUELO' },
  { emoji:'👦', q:'¿Cómo le dices al hijo de tus papás, además de ti?', correct:'HERMANO' },
  { emoji:'👨‍👩‍👧', q:'¿Cómo se llama el grupo de personas con las que vives y te quieren?', correct:'FAMILIA' },
  { emoji:'🧑', q:'¿Cómo le dices al hermano de tu mamá o de tu papá?', correct:'TÍO' },
];
const FAMILIA_OPTS_POOL = ['ABUELA','ABUELO','HERMANO','FAMILIA','TÍO','TÍA','PRIMO','MAMÁ'];

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
  { emoji:'🏖️', label:'PLAYA', desc:'Lugar con arena y mar donde vamos a nadar y tomar sol.' },
  { emoji:'⛰️', label:'MONTAÑA', desc:'Lugar alto y rocoso, a veces con nieve en la punta.' },
  { emoji:'🌾', label:'CAMPO', desc:'Lugar con cultivos, animales y mucho espacio verde.' },
  { emoji:'🏙️', label:'CIUDAD', desc:'Lugar con muchos edificios, autos y personas.' },
  { emoji:'🏜️', label:'DESIERTO', desc:'Lugar muy seco, con poca lluvia y mucha arena.' },
  { emoji:'🌲', label:'BOSQUE', desc:'Lugar con muchos árboles y animales silvestres.' },
];
const CHILE_GEO_FACTS = [
  { emoji:'🌊', q:'¿Cuál es el océano que está al lado de Chile?', correct:'OCÉANO PACÍFICO', opts:['OCÉANO ATLÁNTICO','MAR MEDITERRÁNEO','OCÉANO ÍNDICO'] },
  { emoji:'⛰️', q:'¿Cuál es la cordillera (cadena de montañas) más importante de Chile?', correct:'CORDILLERA DE LOS ANDES', opts:['HIMALAYA','MONTES ALPES','MONTAÑAS ROCOSAS'] },
];

const OFICIOS_BANK = [
  { emoji:'👨‍🍳', label:'COCINERO(A)', desc:'Prepara comida en restaurantes o en casa.' },
  { emoji:'👩‍⚕️', label:'DOCTOR(A)', desc:'Cuida la salud de las personas y las ayuda cuando están enfermas.' },
  { emoji:'👮', label:'CARABINERO(A)', desc:'Cuida la seguridad de las personas en la calle.' },
  { emoji:'👨‍🌾', label:'AGRICULTOR(A)', desc:'Cultiva la tierra para producir frutas y verduras.' },
  { emoji:'👩‍🏫', label:'PROFESOR(A)', desc:'Enseña a los niños y niñas en la escuela.' },
  { emoji:'🧑‍🚒', label:'BOMBERO(A)', desc:'Apaga incendios y ayuda en emergencias.' },
  { emoji:'👷', label:'CONSTRUCTOR(A)', desc:'Construye casas y edificios.' },
];
const INSTITUCIONES_BANK = [
  { emoji:'🏫', label:'LA ESCUELA', desc:'Lugar donde los niños y niñas aprenden.' },
  { emoji:'🏥', label:'EL HOSPITAL', desc:'Lugar donde atienden a personas enfermas.' },
  { emoji:'🚓', label:'CARABINEROS', desc:'Institución que cuida la seguridad de todos.' },
  { emoji:'🏛️', label:'LA MUNICIPALIDAD', desc:'Institución que organiza y cuida la comuna.' },
  { emoji:'🚒', label:'LOS BOMBEROS', desc:'Institución que apaga incendios y ayuda en emergencias.' },
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
];
export const HISTORIA_POS_G2 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

/* Se agregaron Diaguita (Norte Chico) y Picunche (Zona Central, antes del
   ensanche mapuche hacia el norte) — antes solo había 3 pueblos y ninguno
   caía en la zona CENTRO, que igual aparecía como opción en ZONAS_POOL sin
   nunca ser la respuesta correcta. Con 5 pueblos × 2 modos de pregunta
   (zona↔pueblo) el banco pasa de 6 a 10 combinaciones únicas, por encima
   de rounds:8 (antes garantizaba una repetición en cada partida). */
const PUEBLOS_BANK = [
  { emoji:'🏔️', pueblo:'AIMARA', zona:'NORTE' },
  { emoji:'🌲', pueblo:'MAPUCHE', zona:'SUR' },
  { emoji:'🗿', pueblo:'RAPA NUI', zona:'ISLA DE PASCUA' },
  { emoji:'🏺', pueblo:'DIAGUITA', zona:'NORTE' },
  { emoji:'🌳', pueblo:'PICUNCHE', zona:'CENTRO' },
];
const ZONAS_POOL = ['NORTE','SUR','CENTRO','ISLA DE PASCUA'];

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
  { emoji:'🏜️', label:'DESIERTO', zona:'NORTE' },
  { emoji:'⛰️', label:'ALTIPLANO', zona:'NORTE' },
  { emoji:'🧂', label:'SALARES', zona:'NORTE' },
  { emoji:'🍇', label:'VALLES Y VIÑEDOS', zona:'CENTRO' },
  { emoji:'🏙️', label:'GRANDES CIUDADES', zona:'CENTRO' },
  { emoji:'⚓', label:'PUERTOS', zona:'CENTRO' },
  { emoji:'🌲', label:'BOSQUES Y LAGOS', zona:'SUR' },
  { emoji:'🧊', label:'GLACIARES Y FIORDOS', zona:'SUR' },
  { emoji:'🌋', label:'VOLCANES', zona:'SUR' },
  { emoji:'🏝️', label:'ARCHIPIÉLAGOS E ISLAS', zona:'SUR' },
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

export function genPueblos2Round(){
  const item = pick(PUEBLOS_BANK);
  const askZona = Math.random()<0.5;
  if(askZona){
    const opts = shuffle(ZONAS_POOL).map(function(z){ return {label:z, value:z}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿En qué zona de Chile vivía tradicionalmente el pueblo '+item.pueblo+'?</p>',
      options: opts, correctValue: item.zona, speakText: '¿En qué zona vivía el pueblo '+item.pueblo+'?', cols:2, kind:'word', panel:true,
      explain: 'El pueblo <b>'+item.pueblo+'</b> vivía tradicionalmente en la zona <b>'+item.zona.toLowerCase()+'</b>.',
    };
  }
  const distract = PUEBLOS_BANK.filter(function(p){ return p.pueblo!==item.pueblo; }).map(function(p){ return p.pueblo; });
  const opts = shuffle([item.pueblo].concat(distract)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Qué pueblo originario vivía tradicionalmente en la zona '+item.zona.toLowerCase()+'?</p>',
    options: opts, correctValue: item.pueblo, speakText: '¿Qué pueblo vivía en la zona '+item.zona+'?', cols:4, kind:'word',
    explain: 'El pueblo <b>'+item.pueblo+'</b> vivía tradicionalmente en la zona '+item.zona.toLowerCase()+'.',
  };
}

export function genPatrimonio2Round(){
  const item = pick(PATRIMONIO_NATURAL_BANK);
  const opts = shuffle([{label:'PATRIMONIO NATURAL DE CHILE', value:true},{label:'NO ES DE CHILE', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.tipico, speakText: item.label, cols:2, panel:true,
    explain: item.tipico ? item.label+' <b>es patrimonio natural de Chile</b>.' : item.label+' <b>no es de Chile</b>.',
  };
}

export function genPaisajes2Round(){
  const item = pick(PAISAJES_ZONA_BANK);
  const distract = PAISAJES_ZONA_BANK.filter(function(p){ return p.zona!==item.zona; }).map(function(p){ return p.zona; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  const opts = shuffle([item.zona].concat(distract)).map(function(z){ return {label:z, value:z}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿En qué zona de Chile encuentras principalmente '+item.label.toLowerCase()+'?</p>',
    options: opts, correctValue: item.zona, speakText: '¿En qué zona encuentras '+item.label+'?', cols:4, kind:'word',
    explain: item.label.charAt(0)+item.label.slice(1).toLowerCase()+' se encuentra principalmente en la zona <b>'+item.zona.toLowerCase()+'</b> de Chile.',
  };
}

export function genCiudadania2Round(){
  const item = pick(CIUDADANIA_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de convivencia ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de convivencia ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es una buena práctica de convivencia ciudadana.',
  };
}

function calStripHTML(list, todayIdx){
  const nextIdx = (todayIdx+1)%list.length;
  return '<div class="cal-strip">'+list.map(function(name,i){
    const cls = i===todayIdx ? 'cal-today' : (i===nextIdx ? 'cal-next' : '');
    const label = i===nextIdx ? '?' : name.slice(0,3);
    return '<span class="cal-chip '+cls+'">'+label+'</span>';
  }).join('')+'</div>';
}

export function genCalendarioRound(){
  if(Math.random()<0.5){
    const idx = randInt(0, DIAS_SEMANA.length-1);
    const dia = DIAS_SEMANA[idx];
    const next = DIAS_SEMANA[(idx+1)%DIAS_SEMANA.length];
    const distract = shuffle(DIAS_SEMANA.filter(function(d){ return d!==next && d!==dia; })).slice(0,3);
    const opts = shuffle([next].concat(distract)).map(function(d){ return {label:d, value:d}; });
    return {
      promptHTML: calStripHTML(DIAS_SEMANA, idx)+'<p class="prompt-hint">Si hoy es <b>'+dia+'</b>, ¿qué día viene después?</p>',
      options: opts, correctValue: next, speakText: '¿Qué día viene después de '+dia+'?', cols:4, kind:'word',
      explain: 'Después de <b>'+dia+'</b> viene <b>'+next+'</b>.',
    };
  }
  const idx = randInt(0, MESES_ANIO.length-1);
  const mes = MESES_ANIO[idx];
  const next = MESES_ANIO[(idx+1)%MESES_ANIO.length];
  const distract = shuffle(MESES_ANIO.filter(function(m){ return m!==next && m!==mes; })).slice(0,3);
  const opts = shuffle([next].concat(distract)).map(function(m){ return {label:m, value:m}; });
  return {
    promptHTML: calStripHTML(MESES_ANIO, idx)+'<p class="prompt-hint">Si estamos en <b>'+mes+'</b>, ¿qué mes viene después?</p>',
    options: opts, correctValue: next, speakText: '¿Qué mes viene después de '+mes+'?', cols:4, kind:'word',
    explain: 'Después de <b>'+mes+'</b> viene <b>'+next+'</b>.',
  };
}

export function genMiIdentidadRound(){
  if(Math.random()<0.5){
    let a = pick(RUTINA_DIARIA), b = pick(RUTINA_DIARIA);
    while(b.label === a.label) b = pick(RUTINA_DIARIA);
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    return {
      promptHTML: '<p class="prompt-hint">¿Qué pasa primero en tu día?</p>',
      options: opts, correctValue: a.order<b.order ? a.label : b.label, speakText: '¿Qué pasa primero?', cols:2, panel:true,
      explain: (a.order<b.order ? a.label : b.label)+' pasa antes que '+(a.order<b.order ? b.label : a.label)+' en un día normal.',
    };
  }
  const item = pick(FAMILIA_BANK);
  const distract = shuffle(FAMILIA_OPTS_POOL.filter(function(w){ return w!==item.correct; })).slice(0,3);
  const opts = shuffle([item.correct].concat(distract)).map(function(w){ return {label:w, value:w}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.q+'</p>',
    options: opts, correctValue: item.correct, speakText: item.q, cols:4, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correct+'</b>.',
  };
}

export function genSimbolosRound(){
  const item = pick(CHILE_TIPICO);
  const opts = shuffle([{label:'TÍPICO DE CHILE', value:true},{label:'NO ES DE CHILE', value:false}]);
  const visual = item.svg ? '<div class="shape-display">'+chileFlagSVG(90)+'</div>' : '<span class="prompt-emoji">'+item.emoji+'</span>';
  return {
    promptHTML: visual+'<p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.tipico, speakText: item.label, cols:2, panel:true,
    explain: item.tipico ? item.label+' <b>es típico o representativo de Chile</b>.' : item.label+' <b>no es de Chile</b>, es de otro país o cultura.',
  };
}

export function genMapasRound(){
  if(Math.random()<0.5){
    const item = pick(PAISAJES_CHILE);
    const distract = shuffle(PAISAJES_CHILE.filter(function(p){ return p.label!==item.label; })).slice(0,3).map(function(p){ return p.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa descripción corresponde a una <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const item = pick(CHILE_GEO_FACTS);
  const opts = shuffle([item.correct].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.q+'</p>',
    options: opts, correctValue: item.correct, speakText: item.q, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correct+'</b>.',
  };
}

export function genComunidadRound(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(OFICIOS_BANK);
    const distract = shuffle(OFICIOS_BANK.filter(function(o){ return o.label!==item.label; })).slice(0,3).map(function(o){ return o.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es la labor de un(a) <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.67){
    const item = pick(INSTITUCIONES_BANK);
    const distract = shuffle(INSTITUCIONES_BANK.filter(function(i){ return i.label!==item.label; })).slice(0,3).map(function(i){ return i.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(i){ return {label:i, value:i}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.label, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es la función de <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const item = pick(NORMAS_CONVIVENCIA);
  const opts = shuffle([{label:'BUENA CONVIVENCIA', value:true},{label:'NO ESTÁ BIEN', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.bueno, speakText: item.label, cols:2, panel:true,
    explain: item.bueno ? item.label+' <b>ayuda a la buena convivencia</b>.' : item.label+' <b>no ayuda a la buena convivencia</b>.',
  };
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
  { pregunta:'¿Cómo se llamaban las ciudades-estado de la antigua Grecia?', correcta:'POLIS', opts:['IMPERIOS','REINOS','TRIBUS'] },
  { pregunta:'¿En qué ciudad griega nació la democracia?', correcta:'ATENAS', opts:['ESPARTA','ROMA','TROYA'] },
  { pregunta:'¿Qué forma de gobierno inventaron los griegos, en la que el pueblo participa en las decisiones?', correcta:'LA DEMOCRACIA', opts:['LA MONARQUÍA ABSOLUTA','LA DICTADURA','EL FEUDALISMO'] },
  { pregunta:'¿Qué competencia deportiva crearon los griegos, que todavía existe hoy?', correcta:'LOS JUEGOS OLÍMPICOS', opts:['EL TOUR DE FRANCIA','LA COPA AMÉRICA','EL SUPER BOWL'] },
  { pregunta:'¿Cómo se llama el templo griego dedicado a la diosa Atenea, en Atenas?', correcta:'EL PARTENÓN', opts:['EL COLISEO','LA GRAN MURALLA','LAS PIRÁMIDES'] },
  { pregunta:'¿Dónde luchaban los gladiadores en la antigua Roma?', correcta:'EN EL COLISEO', opts:['EN EL PARTENÓN','EN UNA PIRÁMIDE','EN UN ACUEDUCTO'] },
  { pregunta:'¿Qué construían los romanos para transportar agua desde lejos hasta las ciudades?', correcta:'ACUEDUCTOS', opts:['PIRÁMIDES','TEMPLOS GRIEGOS','MURALLAS CHINAS'] },
  { pregunta:'¿Qué idioma hablaban los antiguos romanos, origen del español?', correcta:'LATÍN', opts:['GRIEGO','EGIPCIO','ÁRABE'] },
  { pregunta:'¿Qué ropa típica usaban los antiguos romanos?', correcta:'LA TOGA', opts:['EL KILT ESCOCÉS','EL SARI INDIO','EL PONCHO CHILENO'] },
  { pregunta:'A diferencia de hoy, ¿cómo se alumbraban de noche en la antigua Grecia y Roma?', correcta:'Con velas y antorchas de fuego', opts:['Con ampolletas eléctricas','Con linternas a pilas','Con luces LED'] },
  { pregunta:'A diferencia de hoy, ¿cómo se transportaban las personas en la antigua Roma?', correcta:'A pie, a caballo o en carros tirados por caballos', opts:['En auto','En avión','En metro'] },
];

const CUADRANTES_BANK = [
  { pregunta:'En un mapa, ¿hacia dónde apunta generalmente el Norte?', correcta:'HACIA ARRIBA', opts:['HACIA ABAJO','HACIA LA IZQUIERDA','HACIA LA DERECHA'] },
  { pregunta:'¿Cuáles son los 4 puntos cardinales?', correcta:'NORTE, SUR, ESTE, OESTE', opts:['ARRIBA, ABAJO, IZQUIERDA, DERECHA','ROJO, AZUL, VERDE, AMARILLO','PRIMERO, SEGUNDO, TERCERO, CUARTO'] },
];
const HEMISFERIOS_BANK = [
  { pregunta:'¿Cuántos hemisferios tiene la Tierra?', correcta:'DOS (NORTE Y SUR)', opts:['UNO','TRES','CUATRO'] },
  { pregunta:'¿Qué línea imaginaria divide la Tierra en hemisferio norte y sur?', correcta:'EL ECUADOR', opts:['EL POLO NORTE','UN TRÓPICO','UN MERIDIANO'] },
  { pregunta:'¿Cuántos continentes tiene el planeta Tierra?', correcta:'SEIS', opts:['CUATRO','OCHO','DIEZ'] },
  { pregunta:'¿Cuál es el océano que baña las costas de Chile?', correcta:'EL OCÉANO PACÍFICO', opts:['EL OCÉANO ATLÁNTICO','EL OCÉANO ÍNDICO','EL MAR MEDITERRÁNEO'] },
  { pregunta:'¿Dónde están ubicados los polos de la Tierra?', correcta:'EN LOS EXTREMOS NORTE Y SUR DEL PLANETA', opts:['EN EL ECUADOR','EN EL CENTRO DEL PLANETA','EN EL CONTINENTE AFRICANO'] },
];
const ZONAS_CLIMATICAS_BANK = [
  { pregunta:'¿Cómo es el clima cerca del Ecuador?', correcta:'CÁLIDO Y HÚMEDO (TROPICAL)', opts:['MUY FRÍO Y HELADO','SIEMPRE NEVADO','SECO Y DESÉRTICO TODO EL AÑO'] },
  { pregunta:'¿Cómo es el clima cerca de los polos?', correcta:'MUY FRÍO (POLAR)', opts:['MUY CALUROSO','TROPICAL','TEMPLADO'] },
  { pregunta:'¿Qué zona climática tiene las 4 estaciones marcadas (verano, otoño, invierno, primavera)?', correcta:'ZONA TEMPLADA', opts:['ZONA POLAR','ZONA TROPICAL','ZONA DESÉRTICA'] },
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
  { pregunta:'¿A qué institución vas a pedir prestado un libro para leer en casa?', correcta:'LA BIBLIOTECA PÚBLICA', opts:['EL HOSPITAL','LA MUNICIPALIDAD','EL CUARTEL DE BOMBEROS'] },
  { pregunta:'¿Qué institución se encarga de organizar y cuidar tu comuna?', correcta:'LA MUNICIPALIDAD', opts:['LA BIBLIOTECA','EL HOSPITAL','LOS BOMBEROS'] },
  { pregunta:'¿A qué institución acudes si te enfermas gravemente?', correcta:'EL HOSPITAL', opts:['LA MUNICIPALIDAD','LA BIBLIOTECA','EL CORREO'] },
];

export function genCivilizaciones3Round(){
  const item = pick(CIVILIZACIONES_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genGeografia3Round(){
  const roll = Math.random();
  const bank = roll<0.34 ? CUADRANTES_BANK : roll<0.67 ? HEMISFERIOS_BANK : ZONAS_CLIMATICAS_BANK;
  const item = pick(bank);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genCiudadania3Round(){
  if(Math.random()<0.6){
    const item = pick(CIUDADANIA3_BANK);
    const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
      options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
      explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
    };
  }
  const item = pick(INSTITUCIONES3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
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
  { pregunta:'¿En qué región vivía la civilización Maya?', correcta:'AMÉRICA CENTRAL (PENÍNSULA DE YUCATÁN)', opts:['LOS ANDES DE SUDAMÉRICA','EL VALLE DE MÉXICO','LA PATAGONIA'] },
  { pregunta:'¿Cuál era la capital del imperio Azteca?', correcta:'TENOCHTITLÁN', opts:['CUSCO','MACHU PICCHU','CHICHÉN ITZÁ'] },
  { pregunta:'¿En qué región vivía la civilización Inca?', correcta:'LA CORDILLERA DE LOS ANDES', opts:['LA PENÍNSULA DE YUCATÁN','EL VALLE DE MÉXICO','EL CARIBE'] },
  { pregunta:'¿Cuál era la capital del imperio Inca?', correcta:'CUSCO', opts:['TENOCHTITLÁN','CHICHÉN ITZÁ','TIKAL'] },
  { pregunta:'¿Qué construyeron los aztecas para cultivar alimentos sobre el lago donde estaba su ciudad?', correcta:'LAS CHINAMPAS (ISLAS ARTIFICIALES)', opts:['EL CAMINO INCA','LAS PIRÁMIDES ESCALONADAS','LOS QUIPUS'] },
  { pregunta:'¿Cómo se llamaban los mensajeros incas que corrían por el imperio llevando noticias?', correcta:'LOS CHASQUIS', opts:['LOS AZTECAS','LOS MAYAS','LOS FARAONES'] },
  { pregunta:'¿Qué usaban los incas para registrar información, ya que no tenían un alfabeto escrito?', correcta:'EL QUIPU (CUERDAS CON NUDOS)', opts:['JEROGLÍFICOS','UN ALFABETO','TABLILLAS DE ARCILLA'] },
  { pregunta:'¿En qué destacaban los mayas, además de la arquitectura?', correcta:'La astronomía y un calendario muy preciso', opts:['No conocían los números','Nunca observaban el cielo','No sabían medir el tiempo'] },
  { pregunta:'¿Qué construcción famosa hicieron los incas en lo alto de la cordillera?', correcta:'MACHU PICCHU', opts:['TENOCHTITLÁN','CHICHÉN ITZÁ','LAS CHINAMPAS'] },
  { pregunta:'¿Qué idioma hablaban los aztecas?', correcta:'NÁHUATL', opts:['QUECHUA','MAYA','ESPAÑOL'] },
  { pregunta:'¿Qué idioma hablaban los incas, que todavía se habla hoy en países como Perú y Bolivia?', correcta:'QUECHUA', opts:['NÁHUATL','MAYA','LATÍN'] },
];

const GEOGRAFIA_AMERICA_BANK = [
  { pregunta:'¿Qué son los paralelos en un mapa?', correcta:'Líneas imaginarias horizontales que rodean la Tierra', opts:['Líneas verticales que van de polo a polo','Los nombres de los países','Los colores de un mapa'] },
  { pregunta:'¿Qué son los meridianos en un mapa?', correcta:'Líneas imaginarias verticales que van de polo a polo', opts:['Líneas horizontales que rodean la Tierra','Los ríos más largos','Las montañas más altas'] },
  { pregunta:'¿Cuál de estos es un recurso natural renovable?', correcta:'LA ENERGÍA SOLAR', opts:['EL PETRÓLEO','EL CARBÓN','EL GAS NATURAL'] },
  { pregunta:'¿Cuál de estos es un recurso natural NO renovable?', correcta:'EL PETRÓLEO', opts:['EL VIENTO','LA MADERA DE UN BOSQUE MANEJADO','EL AGUA DE LLUVIA'] },
  { pregunta:'¿Cuál es el río más largo de América del Sur?', correcta:'EL RÍO AMAZONAS', opts:['EL RÍO MAPOCHO','EL RÍO BIOBÍO','EL RÍO COLORADO'] },
  { pregunta:'¿Qué idioma se habla en la mayor parte de Brasil, a diferencia del resto de Sudamérica?', correcta:'PORTUGUÉS', opts:['ESPAÑOL','INGLÉS','FRANCÉS'] },
  { pregunta:'¿Cómo es el clima de la selva amazónica?', correcta:'CÁLIDO Y MUY LLUVIOSO', opts:['MUY FRÍO Y SECO','DESÉRTICO','NEVADO TODO EL AÑO'] },
  { pregunta:'¿Cómo es el clima de Alaska, en América del Norte?', correcta:'MUY FRÍO', opts:['MUY CALUROSO','TROPICAL','DESÉRTICO'] },
  { pregunta:'¿Qué tienen en común Chile, Perú y Bolivia?', correcta:'Comparten la Cordillera de los Andes', opts:['Comparten el mismo idioma que Brasil','Están todos en América del Norte','No tienen montañas'] },
];

const CIUDADANIA4_ACTORES_BANK = [
  { pregunta:'¿Quién es la máxima autoridad de un país como Chile?', correcta:'EL PRESIDENTE O LA PRESIDENTA', opts:['EL ALCALDE','UN SENADOR','UN DIPUTADO'] },
  { pregunta:'¿Quién es la autoridad máxima de una comuna?', correcta:'EL ALCALDE O LA ALCALDESA', opts:['EL PRESIDENTE','UN MINISTRO','UN SENADOR'] },
  { pregunta:'¿Quiénes ayudan al Presidente a dirigir distintas áreas del país, como salud o educación?', correcta:'LOS MINISTROS', opts:['LOS ALCALDES','LOS JUECES','LOS PROFESORES'] },
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
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genGeografiaAmerica4Round(){
  const item = pick(GEOGRAFIA_AMERICA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genCiudadania4Round(){
  if(Math.random()<0.4){
    const item = pick(CIUDADANIA4_ACTORES_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  const item = pick(CIUDADANIA4_VALORES_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
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
  { pregunta:'¿Quién llegó a América en 1492, buscando una nueva ruta hacia Asia?', correcta:'CRISTÓBAL COLÓN', opts:['HERNANDO DE MAGALLANES','PEDRO DE VALDIVIA','FRANCISCO PIZARRO'] },
  { pregunta:'¿Quién descubrió el estrecho que lleva su nombre, en el extremo sur de Chile, en 1520?', correcta:'HERNANDO DE MAGALLANES', opts:['CRISTÓBAL COLÓN','DIEGO DE ALMAGRO','PEDRO DE VALDIVIA'] },
  { pregunta:'¿Quién fue el primer español en explorar el territorio de Chile, antes que Pedro de Valdivia?', correcta:'DIEGO DE ALMAGRO', opts:['HERNANDO DE MAGALLANES','FRANCISCO PIZARRO','CRISTÓBAL COLÓN'] },
  { pregunta:'¿Quién fundó la ciudad de Santiago en 1541?', correcta:'PEDRO DE VALDIVIA', opts:['DIEGO DE ALMAGRO','FRANCISCO PIZARRO','HERNANDO DE MAGALLANES'] },
  { pregunta:'¿Qué imperio conquistó Francisco Pizarro en Sudamérica?', correcta:'EL IMPERIO INCA', opts:['EL IMPERIO AZTECA','LOS MAYAS','LOS MAPUCHES'] },
  { pregunta:'¿Qué buscaban principalmente los reinos europeos al financiar los viajes de descubrimiento?', correcta:'NUEVAS RUTAS COMERCIALES Y RIQUEZAS', opts:['CONOCER OTRAS COMIDAS SOLAMENTE','HACER TURISMO','APRENDER IDIOMAS NUEVOS'] },
  { pregunta:'¿Qué le ocurrió a muchos pueblos indígenas americanos como consecuencia de la conquista?', correcta:'ENFERMARON CON ENFERMEDADES NUEVAS Y PERDIERON GRAN PARTE DE SUS TIERRAS', opts:['MEJORARON SU SITUACIÓN DE INMEDIATO','NO TUVIERON NINGÚN CAMBIO EN SU VIDA','GANARON MÁS TERRITORIO QUE ANTES'] },
  { pregunta:'¿Qué consecuencia tuvo la conquista de América para Europa?', correcta:'EUROPA RECIBIÓ NUEVOS PRODUCTOS Y RIQUEZAS DE AMÉRICA', opts:['EUROPA PERDIÓ TODO CONTACTO CON AMÉRICA','EUROPA DEJÓ DE EXISTIR COMO CONTINENTE','EUROPA NO SE VIO AFECTADA EN NADA'] },
];
const COLONIA_CHILE_BANK = [
  { pregunta:'¿De qué país europeo dependía Chile durante el período colonial?', correcta:'ESPAÑA', opts:['PORTUGAL','FRANCIA','INGLATERRA'] },
  { pregunta:'¿Cómo se llamó el extenso conflicto entre españoles y mapuches durante gran parte de la Colonia?', correcta:'LA GUERRA DE ARAUCO', opts:['LA GUERRA DEL PACÍFICO','LA GUERRA CIVIL','LA GUERRA DE LOS CIEN AÑOS'] },
  { pregunta:'¿Qué río marcó, durante gran parte de la Colonia, la frontera entre el territorio bajo control español y el territorio mapuche?', correcta:'EL RÍO BIOBÍO', opts:['EL RÍO MAPOCHO','EL RÍO LOA','EL RÍO MAULE'] },
  { pregunta:'¿Qué eran los "parlamentos" que se realizaban entre españoles y mapuches?', correcta:'REUNIONES PARA NEGOCIAR ACUERDOS DE PAZ', opts:['FIESTAS SIN NINGÚN PROPÓSITO','ESCUELAS PARA NIÑOS','MERCADOS DE ANIMALES'] },
  { pregunta:'¿Cuál de estos oficios era común en la vida colonial chilena?', correcta:'EL HERRERO, QUE TRABAJABA EL METAL A MANO', opts:['EL PROGRAMADOR DE COMPUTADORES','EL PILOTO DE AVIÓN','EL INGENIERO EN TELECOMUNICACIONES'] },
  { pregunta:'¿Cuál de estas es un ejemplo de patrimonio colonial que todavía se puede ver en Chile hoy?', correcta:'UNA IGLESIA O CASA ANTIGUA DE ADOBE DE ESA ÉPOCA', opts:['UN EDIFICIO DE VIDRIO MODERNO','UN AEROPUERTO','UN CENTRO COMERCIAL NUEVO'] },
  { pregunta:'¿Quiénes solían ocupar los cargos más importantes de gobierno en la sociedad colonial chilena?', correcta:'LOS ESPAÑOLES Y SUS DESCENDIENTES DIRECTOS', opts:['SE ELEGÍAN POR VOTACIÓN POPULAR ABIERTA A TODOS','SIEMPRE ERAN ELEGIDOS AL AZAR','NO EXISTÍAN CARGOS DE GOBIERNO'] },
  { pregunta:'¿Qué actividad económica basada en la extracción de minerales fue importante durante la Colonia en Chile?', correcta:'LA MINERÍA (SOBRE TODO DE ORO Y PLATA)', opts:['LA FABRICACIÓN DE COMPUTADORES','LA INDUSTRIA AEROESPACIAL','LA PRODUCCIÓN DE ENERGÍA SOLAR'] },
  { pregunta:'¿Cuál era una costumbre común en las celebraciones de la vida colonial chilena?', correcta:'LAS FIESTAS RELIGIOSAS Y PATRONALES CON MÚSICA Y BAILE', opts:['LOS CONCIERTOS DE MÚSICA ELECTRÓNICA','LOS VIAJES EN AVIÓN','LOS VIDEOJUEGOS EN LÍNEA'] },
  { pregunta:'¿Qué tipo de construcción se usaba comúnmente en la arquitectura colonial chilena?', correcta:'CASAS Y EDIFICIOS DE ADOBE, CON TECHOS DE TEJA', opts:['RASCACIELOS DE VIDRIO Y ACERO','CASAS HECHAS COMPLETAMENTE DE PLÁSTICO','EDIFICIOS CON PANELES SOLARES'] },
];
const GEOGRAFIA_CHILE5_BANK = [
  { pregunta:'¿Cómo es el clima y paisaje del Norte Grande de Chile?', correcta:'DESÉRTICO, MUY SECO Y CON POCAS LLUVIAS', opts:['MUY LLUVIOSO Y CUBIERTO DE BOSQUES','CON GLACIARES Y FIORDOS','TROPICAL Y HÚMEDO'] },
  { pregunta:'¿Cómo es el clima de la Zona Central de Chile?', correcta:'TEMPLADO, CON UN VERANO SECO Y UN INVIERNO LLUVIOSO', opts:['DESÉRTICO TODO EL AÑO','CUBIERTO DE HIELO TODO EL AÑO','TROPICAL Y MUY CALUROSO TODO EL AÑO'] },
  { pregunta:'¿Cómo es el paisaje de la Zona Sur de Chile?', correcta:'LLUVIOSO, CON BOSQUES, LAGOS Y VOLCANES', opts:['DESÉRTICO Y SIN VEGETACIÓN','CUBIERTO SOLO DE ARENA','SIN NINGÚN RÍO NI LAGO'] },
  { pregunta:'¿Qué caracteriza a la Zona Austral de Chile?', correcta:'CLIMA FRÍO, CON GLACIARES Y FIORDOS', opts:['CLIMA DESÉRTICO Y CALUROSO','PLAYAS TROPICALES','SELVA AMAZÓNICA'] },
  { pregunta:'¿Cuál es un recurso natural importante que se extrae principalmente en el norte de Chile?', correcta:'EL COBRE', opts:['LOS GLACIARES','LA MADERA NATIVA','LOS PECES DE AGUA DULCE'] },
  { pregunta:'¿Cuál es un recurso natural importante en la Zona Sur de Chile, gracias a sus bosques?', correcta:'LA MADERA', opts:['EL COBRE','EL SALITRE','EL LITIO'] },
  { pregunta:'¿Cuál de estos es un riesgo natural frecuente en Chile, por estar ubicado sobre el Cinturón de Fuego del Pacífico?', correcta:'LOS TERREMOTOS Y ERUPCIONES VOLCÁNICAS', opts:['LOS HURACANES TROPICALES','LAS TORMENTAS DE ARENA DEL DESIERTO DEL SAHARA','LOS TORNADOS FRECUENTES'] },
  { pregunta:'Después de un terremoto grande en la costa, ¿qué otro riesgo natural puede ocurrir?', correcta:'UN TSUNAMI (MAREMOTO)', opts:['UNA SEQUÍA INMEDIATA','UNA NEVADA EN EL DESIERTO','NINGÚN RIESGO ADICIONAL'] },
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
  const item = pick(CONQUISTA_AMERICA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genColonia5Round(){
  const item = pick(COLONIA_CHILE_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genGeografiaChile5Round(){
  const item = pick(GEOGRAFIA_CHILE5_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genCiudadania5Round(){
  const item = pick(CIUDADANIA5_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
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
  { pregunta:'¿En qué fecha se formó la Primera Junta Nacional de Gobierno, dando inicio al proceso de independencia de Chile?', correcta:'EL 18 DE SEPTIEMBRE DE 1810', opts:['EL 12 DE FEBRERO DE 1818','EL 5 DE ABRIL DE 1817','EL 1 DE ENERO DE 1900'] },
  { pregunta:'¿Quién es considerado el principal líder militar de la independencia de Chile?', correcta:'BERNARDO O\'HIGGINS', opts:['PEDRO DE VALDIVIA','DIEGO DE ALMAGRO','FRANCISCO PIZARRO'] },
  { pregunta:'¿Qué hazaña militar realizó el Ejército Libertador de los Andes en 1817 para liberar a Chile?', correcta:'CRUZARON LA CORDILLERA DE LOS ANDES CON UN EJÉRCITO', opts:['NAVEGARON ALREDEDOR DEL MUNDO','CONSTRUYERON UN FERROCARRIL','FIRMARON UN TRATADO COMERCIAL'] },
  { pregunta:'¿Qué batalla de 1818 consolidó definitivamente la independencia de Chile?', correcta:'LA BATALLA DE MAIPÚ', opts:['LA BATALLA DE RANCAGUA','LA GUERRA DEL PACÍFICO','LA BATALLA DE CHACABUCO'] },
  { pregunta:'¿Cómo se llama el período (1814-1817) en que España recuperó el control de Chile, antes de la independencia definitiva?', correcta:'LA RECONQUISTA', opts:['LA COLONIA','LA REPÚBLICA','LA CONFEDERACIÓN'] },
  { pregunta:'¿Qué buscaban lograr los criollos americanos con los procesos de independencia de inicios del siglo XIX?', correcta:'GOBERNARSE A SÍ MISMOS, SIN DEPENDER DE UNA POTENCIA EUROPEA', opts:['SEGUIR DEPENDIENDO DE ESPAÑA PARA SIEMPRE','UNIRSE A OTRO IMPERIO EUROPEO','ELIMINAR TODAS LAS CIUDADES EXISTENTES'] },
  { pregunta:'¿Qué batalla de 1817 marcó el triunfo del ejército libertador tras cruzar los Andes, abriendo camino a Santiago?', correcta:'LA BATALLA DE CHACABUCO', opts:['LA BATALLA DE RANCAGUA','LA GUERRA DEL PACÍFICO','LA BATALLA DE MAIPÚ'] },
  { pregunta:'¿Qué batalla de 1814 significó una derrota patriota que dio paso a la Reconquista española?', correcta:'LA BATALLA DE RANCAGUA', opts:['LA BATALLA DE CHACABUCO','LA BATALLA DE MAIPÚ','LA GUERRA DEL PACÍFICO'] },
  { pregunta:'¿Qué título ocupó Bernardo O’Higgins tras la independencia, como máxima autoridad de Chile entre 1817 y 1823?', correcta:'DIRECTOR SUPREMO', opts:['REY DE CHILE','VIRREY','EMPERADOR'] },
  { pregunta:'¿De qué país dejó de depender Chile como resultado del proceso de independencia?', correcta:'DE ESPAÑA', opts:['DE FRANCIA','DE PORTUGAL','DE INGLATERRA'] },
];
const REPUBLICA_SIGLO19_BANK = [
  { pregunta:'¿Qué documento estableció las normas fundamentales para organizar el gobierno de Chile en 1833?', correcta:'LA CONSTITUCIÓN DE 1833', opts:['EL TRATADO DE ANCÓN','LA LEY DE SUFRAGIO FEMENINO','LA PRIMERA JUNTA DE GOBIERNO'] },
  { pregunta:'¿Qué avance tecnológico del siglo XIX transformó el transporte de personas y mercancías en Chile?', correcta:'EL FERROCARRIL', opts:['EL AVIÓN','INTERNET','EL TELÉFONO CELULAR'] },
  { pregunta:'Durante el siglo XIX, ¿qué área tuvo avances importantes en Chile, con la fundación de escuelas y liceos?', correcta:'LA EDUCACIÓN', opts:['LOS VIAJES ESPACIALES','LA TELEVISIÓN','LA ENERGÍA NUCLEAR'] },
  { afirmacion:'En el siglo XIX, solo un pequeño grupo de hombres podía votar en Chile; hoy votar es un derecho de la gran mayoría de los ciudadanos adultos', v:true },
  { afirmacion:'Desde el siglo XIX hasta hoy, el derecho a votar en Chile nunca ha cambiado para nadie', v:false },
  { pregunta:'¿Qué tipo de gobierno estableció la Constitución de 1833, con un Presidente con amplias atribuciones?', correcta:'UN GOBIERNO PRESIDENCIALISTA', opts:['UNA MONARQUÍA HEREDITARIA','UN GOBIERNO SIN NINGÚN PRESIDENTE','UNA REPÚBLICA SIN LEYES'] },
  { pregunta:'¿Qué permitió el ferrocarril en Chile durante el siglo XIX?', correcta:'TRANSPORTAR PERSONAS Y PRODUCTOS DE FORMA MÁS RÁPIDA ENTRE CIUDADES', opts:['VIAJAR AL EXTRANJERO EN AVIÓN','ENVIAR MENSAJES POR INTERNET','VER TELEVISIÓN EN CASA'] },
  { afirmacion:'Durante el siglo XIX se fundaron nuevas escuelas y liceos, ampliando el acceso a la educación en Chile', v:true },
];
const SALITRE_EXPANSION_BANK = [
  { pregunta:'¿Qué conflicto bélico (1879-1883) enfrentó a Chile contra Perú y Bolivia?', correcta:'LA GUERRA DEL PACÍFICO', opts:['LA GUERRA DE ARAUCO','LA GUERRA CIVIL DE 1891','LA REVOLUCIÓN DE 1810'] },
  { pregunta:'Como resultado de la Guerra del Pacífico, ¿qué ocurrió con el territorio de Chile?', correcta:'CHILE INCORPORÓ TERRITORIOS DEL ACTUAL NORTE DEL PAÍS, COMO ANTOFAGASTA Y TARAPACÁ', opts:['CHILE PERDIÓ TODO SU TERRITORIO NORTE','CHILE NO GANÓ NI PERDIÓ NINGÚN TERRITORIO','CHILE SE DIVIDIÓ EN DOS PAÍSES'] },
  { pregunta:'¿Qué mineral impulsó una gran expansión económica en el norte de Chile a fines del siglo XIX?', correcta:'EL SALITRE', opts:['EL ORO','EL CARBÓN','EL PETRÓLEO'] },
  { pregunta:'¿Para qué se usaba principalmente el salitre que Chile exportaba al mundo?', correcta:'COMO FERTILIZANTE PARA LA AGRICULTURA', opts:['COMO COMBUSTIBLE PARA AUTOS','COMO MATERIAL DE CONSTRUCCIÓN','COMO ALIMENTO'] },
  { pregunta:'¿Qué se conoce como la "cuestión social" de fines del siglo XIX y comienzos del XX en Chile?', correcta:'LAS DIFÍCILES CONDICIONES DE VIDA Y TRABAJO DE LOS OBREROS DE LA ÉPOCA', opts:['UN NUEVO SISTEMA EDUCATIVO GRATUITO PARA TODOS','UNA ÉPOCA DE MUCHO BIENESTAR PARA TODOS LOS OBREROS','UNA LEY QUE MEJORÓ INMEDIATAMENTE TODOS LOS SALARIOS'] },
  { pregunta:'¿En qué zona de Chile se concentró principalmente la explotación del salitre?', correcta:'EN EL NORTE DEL PAÍS', opts:['EN LA ZONA AUSTRAL','EN LA ISLA DE PASCUA','EN LA CORDILLERA DE LOS ANDES DEL SUR'] },
  { pregunta:'¿Por qué llegaron muchos trabajadores desde otras zonas de Chile hacia las salitreras del norte?', correcta:'BUSCANDO TRABAJO EN LA INDUSTRIA DEL SALITRE', opts:['BUSCANDO UN CLIMA MÁS LLUVIOSO','HUYENDO DE UNA GUERRA CON ARGENTINA','PARA ESTUDIAR EN NUEVAS UNIVERSIDADES'] },
  { pregunta:'¿Cómo se llamaban los campamentos de trabajadores donde se extraía y procesaba el salitre?', correcta:'OFICINAS SALITRERAS', opts:['UNIVERSIDADES','FORTALEZAS MILITARES','PUERTOS PESQUEROS'] },
  { pregunta:'¿Qué ocurrió con la industria del salitre chileno después de que se inventó el salitre sintético a comienzos del siglo XX?', correcta:'ENTRÓ EN DECLIVE, YA QUE EL SALITRE SINTÉTICO ERA MÁS BARATO DE PRODUCIR', opts:['CRECIÓ AÚN MÁS QUE ANTES','NO TUVO NINGÚN EFECTO','SE VOLVIÓ EL ÚNICO PRODUCTO DE EXPORTACIÓN DE CHILE PARA SIEMPRE'] },
  { pregunta:'¿Qué buscaban mejorar los primeros movimientos obreros durante la época de la "cuestión social"?', correcta:'LAS CONDICIONES LABORALES Y DE VIDA DE LOS TRABAJADORES', opts:['EL PRECIO DE LAS JOYAS','LOS IMPUESTOS A LOS TURISTAS','EL PRECIO DE LOS AUTOS'] },
];
const SIGLOXX_DEMOCRATIZACION_BANK = [
  { pregunta:'¿En qué año se aprobó la ley que dio a las mujeres chilenas el derecho a votar en elecciones presidenciales y parlamentarias?', correcta:'1949', opts:['1810','1883','2000'] },
  { pregunta:'Antes de la ley de 1949, ¿quiénes principalmente tenían derecho a votar en las elecciones presidenciales de Chile?', correcta:'SOLO LOS HOMBRES', opts:['SOLO LAS MUJERES','TODOS LOS NIÑOS MAYORES DE 10 AÑOS','NADIE PODÍA VOTAR'] },
  { pregunta:'¿Qué cambio importante en la participación ciudadana ocurrió durante el siglo XX en Chile?', correcta:'EL DERECHO A VOTAR SE FUE EXTENDIENDO A MÁS PERSONAS, INCLUYENDO A LAS MUJERES', opts:['SE ELIMINÓ POR COMPLETO EL DERECHO A VOTAR','SOLO SE PERMITIÓ VOTAR A LOS EXTRANJEROS','EL VOTO DEJÓ DE EXISTIR'] },
  { pregunta:'¿En qué año pudieron votar las mujeres chilenas por primera vez en elecciones municipales?', correcta:'1934', opts:['1810','1949','2000'] },
  { pregunta:'¿En qué elección presidencial votaron las mujeres chilenas por primera vez, tras la ley de 1949?', correcta:'LA ELECCIÓN PRESIDENCIAL DE 1952', opts:['LA ELECCIÓN DE 1810','LA ELECCIÓN DE 1883','NUNCA HAN PODIDO VOTAR EN UNA ELECCIÓN PRESIDENCIAL'] },
  { pregunta:'¿Qué significa que el derecho a voto se haya ido "democratizando" a lo largo del siglo XX en Chile?', correcta:'QUE CADA VEZ MÁS PERSONAS PUDIERON PARTICIPAR EN LAS ELECCIONES', opts:['QUE CADA VEZ MENOS PERSONAS PUDIERON VOTAR','QUE SOLO LOS MÁS RICOS PODÍAN VOTAR','QUE EL VOTO SE VOLVIÓ OBLIGATORIO SOLO PARA UN GRUPO'] },
  { pregunta:'¿Bajo qué presidente se aprobó la ley que dio a las mujeres chilenas el voto en elecciones presidenciales?', correcta:'GABRIEL GONZÁLEZ VIDELA', opts:['BERNARDO O HIGGINS','ARTURO PRAT','DIEGO PORTALES'] },
  { pregunta:'¿Quién fue elegido Presidente de Chile en 1952, en la primera elección con voto femenino?', correcta:'CARLOS IBÁÑEZ DEL CAMPO', opts:['BERNARDO O HIGGINS','JOSÉ DE SAN MARTÍN','PEDRO DE VALDIVIA'] },
  { pregunta:'¿Qué institución del Estado se encarga de organizar y fiscalizar las elecciones en Chile?', correcta:'EL SERVICIO ELECTORAL', opts:['EL EJÉRCITO','UNA EMPRESA PRIVADA CUALQUIERA','UN PERIÓDICO'] },
  { pregunta:'¿En qué fecha ocurrió el golpe de Estado que terminó con el gobierno del presidente Salvador Allende?', correcta:'EL 11 DE SEPTIEMBRE DE 1973', opts:['EL 18 DE SEPTIEMBRE DE 1810','EL 11 DE MARZO DE 1990','EL 5 DE OCTUBRE DE 1988'] },
  { pregunta:'¿En qué año se realizó el plebiscito en que la mayoría de los chilenos votó para no continuar bajo el mismo gobierno?', correcta:'1988', opts:['1973','1990','1810'] },
  { pregunta:'¿En qué fecha asumió Patricio Aylwin la presidencia, marcando el retorno a un gobierno elegido democráticamente?', correcta:'EL 11 DE MARZO DE 1990', opts:['EL 11 DE SEPTIEMBRE DE 1973','EL 5 DE OCTUBRE DE 1988','EL 18 DE SEPTIEMBRE DE 1810'] },
  { pregunta:'¿Cuántos años duró el período de gobierno militar en Chile, entre 1973 y 1990?', correcta:'17 AÑOS', opts:['5 AÑOS','50 AÑOS','2 AÑOS'] },
  { pregunta:'¿Quién fue el primer Presidente elegido democráticamente después del período de gobierno militar?', correcta:'PATRICIO AYLWIN', opts:['SALVADOR ALLENDE','GABRIEL GONZÁLEZ VIDELA','CARLOS IBÁÑEZ DEL CAMPO'] },
];
const GEOGRAFIA_CHILE6_BANK = [
  { pregunta:'Chile es un país tricontinental. ¿Qué significa esto?', correcta:'TIENE TERRITORIO EN TRES CONTINENTES: AMÉRICA, OCEANÍA Y LA ANTÁRTICA', opts:['TIENE TRES CAPITALES DIFERENTES','ESTÁ FORMADO POR TRES PAÍSES UNIDOS','TIENE TRES IDIOMAS OFICIALES'] },
  { pregunta:'¿Qué isla chilena en el océano Pacífico forma parte de Oceanía?', correcta:'ISLA DE PASCUA (RAPA NUI)', opts:['LA ISLA GRANDE DE CHILOÉ','LA ISLA JUAN FERNÁNDEZ','TIERRA DEL FUEGO'] },
  { pregunta:'¿Qué tipo de ambiente natural predomina en el norte de Chile?', correcta:'DESÉRTICO', opts:['SELVA TROPICAL','GLACIARES Y HIELO','PANTANOS Y MANGLARES'] },
  { pregunta:'¿Qué desafío enfrentan las personas que viven en una zona desértica como el norte de Chile?', correcta:'LA ESCASEZ DE AGUA', opts:['EL EXCESO DE LLUVIA','EL FRÍO EXTREMO TODO EL AÑO','LA FALTA DE SOL'] },
  { pregunta:'¿Cuál es el mayor terremoto registrado instrumentalmente en la historia, ocurrido en el sur de Chile en 1960?', correcta:'EL TERREMOTO DE VALDIVIA', opts:['EL TERREMOTO DE HAITÍ','EL TERREMOTO DE JAPÓN DE 2011','NO SE HA REGISTRADO NUNCA UN TERREMOTO EN CHILE'] },
  { pregunta:'¿Qué oportunidad ofrece el ambiente marítimo de gran parte de la costa chilena?', correcta:'LA PESCA Y EL TURISMO', opts:['LA MINERÍA DEL CARBÓN SOLAMENTE','LA AGRICULTURA DE ARROZ SOLAMENTE','NINGUNA OPORTUNIDAD ECONÓMICA'] },
  { pregunta:'¿Qué tipo de ambiente natural predomina en la Zona Central de Chile?', correcta:'CLIMA MEDITERRÁNEO, CON VERANO SECO E INVIERNO LLUVIOSO', opts:['DESIERTO ABSOLUTO TODO EL AÑO','SELVA TROPICAL LLUVIOSA','HIELO Y NIEVE TODO EL AÑO'] },
  { pregunta:'¿Qué desafío enfrentan las personas que viven en zonas con alto riesgo de terremotos, como gran parte de Chile?', correcta:'CONSTRUIR EDIFICIOS PREPARADOS PARA RESISTIR MOVIMIENTOS SÍSMICOS', opts:['NO EXISTE NINGÚN DESAFÍO','EVITAR CONSTRUIR CUALQUIER TIPO DE EDIFICIO','MUDARSE A OTRO CONTINENTE'] },
  { pregunta:'¿Qué recurso natural importante se obtiene de los bosques templados del sur de Chile?', correcta:'LA MADERA', opts:['EL COBRE','EL SALITRE','EL PETRÓLEO'] },
];
const PODERES_ESTADO_BANK = [
  { poder:'PODER EJECUTIVO', funcion:'GOBERNAR Y ADMINISTRAR EL PAÍS (EL PRESIDENTE Y SUS MINISTROS)' },
  { poder:'PODER LEGISLATIVO', funcion:'CREAR, DISCUTIR Y APROBAR LAS LEYES (EL CONGRESO NACIONAL)' },
  { poder:'PODER JUDICIAL', funcion:'APLICAR LA LEY Y RESOLVER CONFLICTOS LEGALES (LOS TRIBUNALES)' },
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
  const item = pick(INDEPENDENCIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genRepublica6Round(){
  const item = pick(REPUBLICA_SIGLO19_BANK);
  if(item.afirmacion){
    const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
    return {
      promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
      options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
      explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    };
  }
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genSalitre6Round(){
  const item = pick(SALITRE_EXPANSION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genSigloxx6Round(){
  const item = pick(SIGLOXX_DEMOCRATIZACION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genGeografiaChile6Round(){
  const item = pick(GEOGRAFIA_CHILE6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
    explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
  };
}

export function genCiudadania6Round(){
  if(Math.random()<0.4){
    const item = pick(PODERES_ESTADO_BANK);
    const distract = shuffle(PODERES_ESTADO_BANK.filter(function(p){ return p.poder!==item.poder; })).map(function(p){ return p.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.poder+'</p><p class="prompt-hint">¿Cuál es la función de este poder del Estado?</p>',
      options: opts, correctValue: item.funcion, speakText: item.poder, cols:2, panel:true,
      explain: item.poder+': '+item.funcion.toLowerCase()+'.',
    };
  }
  const item = pick(CIUDADANIA6_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de formación ciudadana?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de formación ciudadana?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es un buen ejemplo de formación ciudadana.',
  };
}


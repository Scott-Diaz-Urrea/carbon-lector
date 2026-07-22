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


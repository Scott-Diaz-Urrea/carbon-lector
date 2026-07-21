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
const NORMAS_CONVIVENCIA = [
  { emoji:'🙋', label:'Levantar la mano antes de hablar en clases', bueno:true },
  { emoji:'🤝', label:'Compartir los juguetes con los demás', bueno:true },
  { emoji:'🚦', label:'Cruzar la calle por el paso peatonal', bueno:true },
  { emoji:'🗑️', label:'Botar la basura en el suelo', bueno:false },
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

/* ---------------- Contenido Historia, Geografía y Cs. Sociales 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/historia-geografia-ciencias-sociales/4-basico):
   HI04 OA01-04 -> Civilizaciones Americanas (maya, azteca, inca) — cubre
   SOLO logros culturales/tecnológicos bien documentados y no controvertidos
   (astronomía, escritura, arquitectura, caminos); deliberadamente se excluyen
   aspectos del OA01 oficial como "guerras y sacrificios humanos", que son
   históricamente reales pero no apropiados para un quiz de opción múltiple
   dirigido a niños — mismo criterio que ya excluyó contenido sensible en
   otras asignaturas. OA06,08 -> Geografía de América (coordenadas, paisajes).
   OA07,09 -> Recursos Naturales (renovables/no renovables). OA11-14 ->
   Formación Ciudadana IV (poderes del Estado, derechos del niño, honestidad,
   respeto sin discriminación).
   Quedan fuera OA05 (investigación propia), OA10 (comparación de paisajes
   propios con América, requiere contexto local específico del estudiante) y
   OA15-18 (participación en proyectos escolares, resolución de conflictos
   por votación, opinar con fundamentos — desempeño/actitudinal). */
export const HISTORIA_MODULES_G4 = [
  {id:'civilizaciones4', label:'Civilizaciones Americanas', open:true, key:'civilizaciones4'},
  {id:'geografiaamerica4', label:'Geografía de América', open:true, key:'geografiaamerica4'},
  {id:'recursosnaturales4', label:'Recursos Naturales', open:true, key:'recursosnaturales4'},
  {id:'ciudadania4', label:'Formación Ciudadana IV', open:true, key:'ciudadania4'},
];
export const HISTORIA_POS_G4 = [{x:22,y:88},{x:68,y:65},{x:24,y:42},{x:70,y:16}];

const CIVILIZACIONES_BANK = [
  { emoji:'🔭', label:'Desarrollaron avanzados conocimientos de astronomía y matemática', civ:'MAYA' },
  { emoji:'📜', label:'Crearon uno de los primeros sistemas de escritura de América', civ:'MAYA' },
  { emoji:'🏙️', label:'Construyeron la gran ciudad de Tenochtitlán sobre un lago', civ:'AZTECA' },
  { emoji:'🌽', label:'Cultivaban en chinampas, islas artificiales flotantes para sembrar', civ:'AZTECA' },
  { emoji:'🛤️', label:'Construyeron una extensa red de caminos por la cordillera de los Andes', civ:'INCA' },
  { emoji:'🏔️', label:'Construyeron la ciudadela de Machu Picchu en las montañas', civ:'INCA' },
];
const PAISAJES_AMERICA_BANK = [
  { emoji:'🏔️', label:'LA CORDILLERA DE LOS ANDES', tipo:'MONTAÑA' },
  { emoji:'🌳', label:'LA SELVA AMAZÓNICA', tipo:'SELVA' },
  { emoji:'🏜️', label:'EL DESIERTO DE ATACAMA', tipo:'DESIERTO' },
  { emoji:'🌊', label:'EL RÍO AMAZONAS', tipo:'RÍO' },
];
const COORDENADAS_BANK = [
  { pregunta:'¿Qué usamos para ubicar un lugar exacto en un mapa con líneas horizontales y verticales?', correcta:'Coordenadas geográficas', opts:['El nombre de la calle','El color del mapa','La cantidad de ciudades'] },
];
const RECURSOS_NATURALES_BANK = [
  { emoji:'☀️', label:'ENERGÍA SOLAR', tipo:'RENOVABLE' },
  { emoji:'💨', label:'ENERGÍA EÓLICA (DEL VIENTO)', tipo:'RENOVABLE' },
  { emoji:'🌊', label:'ENERGÍA DEL AGUA', tipo:'RENOVABLE' },
  { emoji:'🛢️', label:'PETRÓLEO', tipo:'NO RENOVABLE' },
  { emoji:'⛏️', label:'CARBÓN', tipo:'NO RENOVABLE' },
  { emoji:'💎', label:'MINERALES (COMO EL COBRE)', tipo:'NO RENOVABLE' },
];
const PODERES_ESTADO_BANK = [
  { cargo:'PRESIDENTE(A)', funcion:'Dirige el gobierno del país' },
  { cargo:'DIPUTADOS(AS) Y SENADORES(AS)', funcion:'Crean y aprueban las leyes del país' },
  { cargo:'ALCALDE O ALCALDESA', funcion:'Dirige el gobierno de una comuna' },
  { cargo:'MINISTROS(AS)', funcion:'Dirigen áreas específicas del gobierno, como salud o educación' },
];
const DERECHOS_NINO_BANK = [
  { correcta:'Todos los niños tienen derecho a la educación', incorrectas:['Solo algunos niños tienen derecho a estudiar','La educación es un privilegio, no un derecho','No es importante que todos los niños estudien'] },
  { correcta:'Todos los niños tienen derecho a alimentación y vivienda adecuada', incorrectas:['Solo los niños con dinero merecen buena alimentación','La vivienda no es un derecho de los niños','No importa si un niño tiene dónde vivir'] },
  { correcta:'Los niños tienen derecho a ser protegidos del abandono y el maltrato', incorrectas:['Es normal que un niño sea maltratado','El maltrato infantil no es un problema','Los niños no tienen derecho a protección'] },
];

export function genCivilizaciones4Round(){
  const item = pick(CIVILIZACIONES_BANK);
  const opts = shuffle(['MAYA','AZTECA','INCA']).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿A qué civilización americana pertenece esto?</p>',
    options: opts, correctValue: item.civ, speakText: item.label, cols:4, kind:'word',
    explain: 'Ese es un logro de la civilización <b>'+item.civ.toLowerCase()+'</b>.',
  };
}

export function genGeografiaAmerica4Round(){
  if(Math.random()<0.4){
    const item = pick(COORDENADAS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es "'+item.correcta+'".',
    };
  }
  const item = pick(PAISAJES_AMERICA_BANK);
  const distract = PAISAJES_AMERICA_BANK.filter(function(p){ return p.tipo!==item.tipo; }).map(function(p){ return p.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Qué tipo de paisaje es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:4, kind:'word',
    explain: item.label+' es un(a) <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genRecursosNaturales4Round(){
  const item = pick(RECURSOS_NATURALES_BANK);
  const opts = shuffle([{label:'RENOVABLE', value:'RENOVABLE'},{label:'NO RENOVABLE', value:'NO RENOVABLE'}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Es un recurso renovable o no renovable?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:2, panel:true,
    explain: item.label+' es un recurso <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genCiudadania4Round(){
  if(Math.random()<0.5){
    const item = pick(PODERES_ESTADO_BANK);
    const distract = PODERES_ESTADO_BANK.filter(function(p){ return p.cargo!==item.cargo; }).map(function(p){ return p.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Qué función cumple el/la '+item.cargo.toLowerCase()+'?</p>',
      options: opts, correctValue: item.funcion, speakText: '¿Qué función cumple el/la '+item.cargo+'?', cols:2, panel:true,
      explain: 'El/la '+item.cargo.toLowerCase()+' '+item.funcion.toLowerCase()+'.',
    };
  }
  const item = pick(DERECHOS_NINO_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas afirmaciones sobre los derechos de los niños es correcta?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas afirmaciones es correcta?', cols:2, panel:true,
    explain: '"'+item.correcta+'" es correcto: es un derecho de todos los niños.',
  };
}

const PUEBLOS_BANK = [
  { emoji:'🏔️', pueblo:'AIMARA', zona:'NORTE' },
  { emoji:'🌲', pueblo:'MAPUCHE', zona:'SUR' },
  { emoji:'🗿', pueblo:'RAPA NUI', zona:'ISLA DE PASCUA' },
];
const ZONAS_POOL = ['NORTE','SUR','CENTRO','ISLA DE PASCUA'];

const PATRIMONIO_NATURAL_BANK = [
  { emoji:'⛰️', label:'El Parque Nacional Torres del Paine, en la Patagonia chilena', tipico:true },
  { emoji:'🏜️', label:'El Desierto de Atacama, en el norte de Chile', tipico:true },
  { emoji:'🌋', label:'El Parque Nacional Conguillío, con el volcán Llaima', tipico:true },
  { emoji:'🦌', label:'El huemul, animal chileno en peligro de extinción', tipico:true },
  { emoji:'🗼', label:'La Torre Eiffel', tipico:false },
  { emoji:'🐼', label:'El panda gigante, animal de China', tipico:false },
  { emoji:'🕌', label:'La Gran Muralla China', tipico:false },
  { emoji:'🗽', label:'La Estatua de la Libertad', tipico:false },
];

const PAISAJES_ZONA_BANK = [
  { emoji:'🏜️', label:'DESIERTO', zona:'NORTE' },
  { emoji:'⛰️', label:'ALTIPLANO', zona:'NORTE' },
  { emoji:'🍇', label:'VALLES Y VIÑEDOS', zona:'CENTRO' },
  { emoji:'🏙️', label:'GRANDES CIUDADES', zona:'CENTRO' },
  { emoji:'🌲', label:'BOSQUES Y LAGOS', zona:'SUR' },
  { emoji:'🧊', label:'GLACIARES Y FIORDOS', zona:'SUR' },
];

const CIUDADANIA_BANK = [
  { correcta:'Cuidar los espacios públicos como plazas y parques', incorrectas:['Rayar los muros de la plaza','Botar basura en el parque','Romper los juegos infantiles'] },
  { correcta:'Decir la verdad aunque hayas cometido un error', incorrectas:['Mentir para no tener problemas','Culpar a otro de tu error','Esconder lo que hiciste'] },
  { correcta:'Respetar las opiniones distintas a la tuya', incorrectas:['Burlarte de quien piensa diferente','Ignorar las ideas de los demás','Enojarte si no piensan como tú'] },
  { correcta:'Cumplir con tus deberes escolares', incorrectas:['Copiar las tareas de un compañero','Dejar todo para el final sin avisar','No traer los materiales pedidos'] },
  { correcta:'Integrar a otros en tus juegos, sin discriminar', incorrectas:['Dejar fuera a un compañero por cómo se ve','No dejar jugar a alguien por su nombre','Burlarte de las costumbres de otro niño'] },
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


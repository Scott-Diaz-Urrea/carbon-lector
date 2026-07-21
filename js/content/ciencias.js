import { pick, shuffle } from '../utils.js';
import { toothbrushSVG, piedraSVG, semillaSVG, vasoVacioSVG, plasticinaSVG, estomagoSVG } from '../svg.js';

export const CIENCIAS_MODULES = [
  {id:'seresvivos', label:'Seres Vivos', open:true, key:'seresvivos'},
  {id:'plantas', label:'Plantas', open:true, key:'plantas'},
  {id:'micuerpo', label:'Mi Cuerpo', open:true, key:'micuerpo'},
  {id:'materiales', label:'Materiales', open:true, key:'materiales'},
  {id:'dianoche', label:'Día y Noche', open:true, key:'dianoche'},
];
export const CIENCIAS_POS = [{x:22,y:88},{x:68,y:70},{x:24,y:52},{x:70,y:34},{x:24,y:16}];

/* ---------------- Contenido Ciencias Naturales 1° Básico ----------------
   Basado en OA del Decreto 439/2012 (curriculumnacional.cl):
   CN01 OA01-02 -> Seres Vivos · CN01 OA03-04 -> Plantas ·
   CN01 OA06-07 -> Mi Cuerpo · CN01 OA08-09 -> Materiales ·
   CN01 OA11-12 -> Día y Noche / Estaciones */
const VIVOS_ITEMS = [
  { emoji:'🐶', label:'PERRO', vivo:true },
  { emoji:'🌳', label:'ÁRBOL', vivo:true },
  { emoji:'🦋', label:'MARIPOSA', vivo:true },
  { emoji:'🐟', label:'PEZ', vivo:true },
  { emoji:'🌻', label:'FLOR', vivo:true },
  { emoji:'🐦', label:'AVE', vivo:true },
  { emoji:'🐢', label:'TORTUGA', vivo:true },
  { emoji:'🌵', label:'CACTUS', vivo:true },
  { emoji:'🐛', label:'ORUGA', vivo:true },
  { emoji:'🍄', label:'HONGO', vivo:true },
  { emoji: piedraSVG(30), label:'PIEDRA', vivo:false },
  { emoji:'🚗', label:'AUTO', vivo:false },
  { emoji:'⚽', label:'PELOTA', vivo:false },
  { emoji:'🪑', label:'SILLA', vivo:false },
  { emoji:'💧', label:'GOTA DE AGUA', vivo:false },
  { emoji:'🧸', label:'PELUCHE', vivo:false },
  { emoji:'📱', label:'CELULAR', vivo:false },
  { emoji:'☁️', label:'NUBE', vivo:false },
];
const ANIMAL_COVER_ITEMS = [
  { emoji:'🐶', label:'PERRO', cubierta:'PELO' },
  { emoji:'🐱', label:'GATO', cubierta:'PELO' },
  { emoji:'🐰', label:'CONEJO', cubierta:'PELO' },
  { emoji:'🐑', label:'OVEJA', cubierta:'LANA' },
  { emoji:'🐦', label:'AVE', cubierta:'PLUMAS' },
  { emoji:'🦜', label:'LORO', cubierta:'PLUMAS' },
  { emoji:'🐧', label:'PINGÜINO', cubierta:'PLUMAS' },
  { emoji:'🐍', label:'SERPIENTE', cubierta:'ESCAMAS' },
  { emoji:'🐟', label:'PEZ', cubierta:'ESCAMAS' },
  { emoji:'🐊', label:'COCODRILO', cubierta:'ESCAMAS' },
  { emoji:'🐸', label:'RANA', cubierta:'PIEL' },
  { emoji:'🐘', label:'ELEFANTE', cubierta:'PIEL' },
];
const PLANT_PARTS = [
  { emoji:'🌿', part:'HOJA', desc:'Parte verde y plana que usa la luz del sol para fabricar el alimento de la planta.' },
  { emoji:'🌸', part:'FLOR', desc:'Parte colorida y perfumada que atrae a los insectos.' },
  { emoji:'🌱', part:'TALLO', desc:'Parte que sostiene a la planta y lleva el agua hacia arriba.' },
  { emoji:'🥕', part:'RAÍZ', desc:'Parte que está bajo la tierra y absorbe agua y nutrientes.' },
];
const FRUIT_SIZE = [
  { emoji:'🌰', label:'CASTAÑA', size:1 },
  { emoji:'🍇', label:'UVA', size:2 },
  { emoji:'🍓', label:'FRUTILLA', size:3 },
  { emoji:'🍒', label:'CEREZA', size:3 },
  { emoji:'🍎', label:'MANZANA', size:4 },
  { emoji:'🍐', label:'PERA', size:4 },
  { emoji:'🥭', label:'MANGO', size:5 },
  { emoji:'🍍', label:'PIÑA', size:6 },
  { emoji:'🍉', label:'SANDÍA', size:7 },
  { emoji:'🎃', label:'ZAPALLO', size:8 },
];
const SENTIDOS = [
  { emoji:'👁️', organ:'OJOS', sense:'VER' },
  { emoji:'👂', organ:'OÍDOS', sense:'OÍR' },
  { emoji:'👃', organ:'NARIZ', sense:'OLER' },
  { emoji:'👅', organ:'LENGUA', sense:'SABOREAR' },
  { emoji:'✋', organ:'PIEL', sense:'TOCAR' },
];
/* "No lavarse las manos" (bueno:false) usaba 🧴 (una botella de jabón/
   crema) — un ícono que en realidad sugiere buena higiene, al revés de lo
   que describe el texto (NO lavarse). Se cambió a 🦠 (gérmenes), que sí
   ilustra la consecuencia de no lavarse las manos. */
const HABITOS_SALUDABLES = [
  { emoji:'🪥', label:'Cepillarse los dientes', bueno:true },
  { emoji:'🥗', label:'Comer frutas y verduras', bueno:true },
  { emoji:'😴', label:'Dormir bien de noche', bueno:true },
  { emoji:'🧼', label:'Lavarse las manos antes de comer', bueno:true },
  { emoji:'💧', label:'Tomar agua durante el día', bueno:true },
  { emoji:'🧥', label:'Abrigarse cuando hace frío', bueno:true },
  { emoji:'🚿', label:'Bañarse todos los días', bueno:true },
  { emoji:'🏃', label:'Hacer actividad física seguido', bueno:true },
  { emoji:'🍬', label:'Comer solo dulces todo el día', bueno:false },
  { emoji:'📱', label:'Ver pantallas hasta muy tarde sin dormir', bueno:false },
  { emoji:'🦠', label:'No lavarse las manos antes de comer', bueno:false },
  { emoji:'🚫', label:'No cepillarse nunca los dientes', bueno:false },
];
/* "un vaso de vidrio" usaba 🍶 — que es literalmente una botella de sake,
   no un vaso para beber (mismo tipo de error que 🥛 para "vaso de agua",
   ver corporalidadMovimiento.js). vasoVacioSVG() dibuja el vaso real. */
const MATERIALES_ITEMS = [
  { emoji:'🪵', object:'una mesa de madera', material:'MADERA' },
  { emoji:'🥄', object:'una cuchara de metal', material:'METAL' },
  { emoji:'🧸', object:'un juguete de peluche', material:'TELA' },
  { emoji: vasoVacioSVG(30), object:'un vaso de vidrio', material:'VIDRIO' },
  { emoji:'🥤', object:'una botella de plástico', material:'PLÁSTICO' },
  { emoji:'🧱', object:'un muro de ladrillo', material:'LADRILLO' },
  { emoji:'📄', object:'una hoja de papel', material:'PAPEL' },
  { emoji:'🪢', object:'una cuerda de lana', material:'LANA' },
  { emoji:'🔑', object:'una llave de metal', material:'METAL' },
  { emoji:'👖', object:'unos pantalones de tela', material:'TELA' },
];
/* Tres correcciones de ícono-texto: "plastilina" usaba 🖌️ (un pincel, una
   herramienta, no una masa moldeable) → plasticinaSVG(). "Semilla" usaba
   🌱 (que en realidad ya es un brote/planta creciendo, no la semilla misma
   — mismo criterio que ya llevó a construir semillaSVG() en
   exploracionEntornoNatural.js) → se reusa ese helper aquí. "Un afiche"
   usaba 🌓 (una fase de la luna, sin relación con un afiche/póster) → 🖼️
   (un cuadro/lámina) se parece mucho más al objeto real. */
const CAMBIOS_MATERIALES = [
  { emoji:'🧊', text:'Un cubo de hielo se derrite', cause:'CALOR' },
  { emoji:'🍞', text:'El pan se tuesta en el fuego', cause:'CALOR' },
  { emoji:'👕', text:'La ropa mojada se seca al sol', cause:'CALOR' },
  { emoji:'🍫', text:'Una barra de chocolate se derrite en la mano', cause:'CALOR' },
  { emoji:'🎈', text:'Un globo se estira al inflarlo', cause:'FUERZA' },
  { emoji: plasticinaSVG(30), text:'La plastilina cambia de forma al apretarla', cause:'FUERZA' },
  { emoji:'📄', text:'Una hoja de papel se arruga al apretarla con la mano', cause:'FUERZA' },
  { emoji: semillaSVG(30), text:'Una semilla crece al regarla', cause:'AGUA' },
  { emoji:'👗', text:'La ropa se moja bajo la lluvia', cause:'AGUA' },
  { emoji:'🧽', text:'Una esponja seca se hincha al mojarla', cause:'AGUA' },
  { emoji:'🖼️', text:'Un afiche se decolora al dejarlo mucho tiempo al sol', cause:'LUZ' },
  { emoji:'🪴', text:'Una planta crece inclinada buscando la ventana', cause:'LUZ' },
];
const DIA_NOCHE_ITEMS = [
  { emoji:'☀️', label:'El Sol brilla fuerte en el cielo', momento:'DÍA' },
  { emoji:'🌕', label:'La Luna llena se ve en el cielo', momento:'NOCHE' },
  { emoji:'⭐', label:'Las estrellas brillan en el cielo oscuro', momento:'NOCHE' },
  { emoji:'🌤️', label:'El cielo está celeste y muy iluminado', momento:'DÍA' },
  { emoji:'🦉', label:'El búho sale a cazar', momento:'NOCHE' },
  { emoji:'🐓', label:'El gallo canta al amanecer', momento:'DÍA' },
  { emoji:'🦇', label:'Los murciélagos salen a volar', momento:'NOCHE' },
  { emoji:'🏫', label:'Los niños van a la escuela', momento:'DÍA' },
  { emoji:'🛌', label:'La familia se va a dormir', momento:'NOCHE' },
  { emoji:'🌻', label:'Los girasoles miran hacia el sol', momento:'DÍA' },
];
const ESTACIONES = [
  { emoji:'☀️', label:'Hace mucho calor y vamos a la playa', season:'VERANO' },
  { emoji:'🍉', label:'Comemos sandía porque hace mucho calor', season:'VERANO' },
  { emoji:'🍂', label:'Las hojas de los árboles caen y cambian de color', season:'OTOÑO' },
  { emoji:'🌰', label:'Se cosechan castañas y nueces', season:'OTOÑO' },
  { emoji:'❄️', label:'Hace mucho frío y en algunos lugares nieva', season:'INVIERNO' },
  { emoji:'☂️', label:'Llueve seguido y usamos paraguas y botas', season:'INVIERNO' },
  { emoji:'🌸', label:'Las flores empiezan a florecer y el clima se entibia', season:'PRIMAVERA' },
  { emoji:'🐝', label:'Las abejas despiertan y visitan las flores nuevas', season:'PRIMAVERA' },
];

/* ---------------- Contenido Ciencias Naturales 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/ciencias-naturales/2-basico):
   CN02 OA01-02 -> Vertebrados e Invertebrados · CN02 OA03 -> Ciclos de Vida ·
   CN02 OA04-06 -> Hábitats y Cuidado Animal · CN02 OA07-08 -> Mi Cuerpo por
   Dentro · CN02 OA09-11 -> El Agua · CN02 OA12-13 -> Clima e Instrumentos.
   OA14 (relación estaciones-tiempo atmosférico) no se repite aquí porque ya
   lo cubre "Día y Noche" de 1° básico (estaciones del año). */
export const CIENCIAS_MODULES_G2 = [
  {id:'vertebrados2', label:'Vertebrados e Invertebrados', open:true, key:'vertebrados2'},
  {id:'ciclosvida2', label:'Ciclos de Vida', open:true, key:'ciclosvida2'},
  {id:'habitats2', label:'Hábitats y Cuidado Animal', open:true, key:'habitats2'},
  {id:'cuerpodentro2', label:'Mi Cuerpo por Dentro', open:true, key:'cuerpodentro2'},
  {id:'agua2', label:'El Agua', open:true, key:'agua2'},
  {id:'clima2', label:'Clima e Instrumentos', open:true, key:'clima2'},
];
export const CIENCIAS_POS_G2 = [
  {x:22,y:92},{x:68,y:77},{x:24,y:61},{x:70,y:45},{x:24,y:26},{x:70,y:8}
];

const VERTEBRADOS_BANK = [
  { emoji:'🐶', label:'PERRO', tipo:'MAMÍFERO' },
  { emoji:'🐱', label:'GATO', tipo:'MAMÍFERO' },
  { emoji:'🐘', label:'ELEFANTE', tipo:'MAMÍFERO' },
  { emoji:'🦅', label:'ÁGUILA', tipo:'AVE' },
  { emoji:'🦜', label:'LORO', tipo:'AVE' },
  { emoji:'🦎', label:'LAGARTIJA', tipo:'REPTIL' },
  { emoji:'🐍', label:'SERPIENTE', tipo:'REPTIL' },
  { emoji:'🐸', label:'RANA', tipo:'ANFIBIO' },
  { emoji:'🐟', label:'PEZ', tipo:'PEZ' },
  { emoji:'🦈', label:'TIBURÓN', tipo:'PEZ' },
];
const INVERTEBRADOS_BANK = [
  { emoji:'🦋', label:'MARIPOSA' },
  { emoji:'🐝', label:'ABEJA' },
  { emoji:'🕷️', label:'ARAÑA' },
  { emoji:'🦂', label:'ESCORPIÓN' },
  { emoji:'🦀', label:'CANGREJO' },
  { emoji:'🐌', label:'CARACOL' },
];

const MARIPOSA_CICLO = [{ emoji:'🥚', label:'Huevo', orden:1 },{ emoji:'🐛', label:'Oruga', orden:2 },{ emoji:'🦋', label:'Mariposa adulta', orden:3 }];
const RANA_CICLO = [{ emoji:'🥚', label:'Huevos en el agua', orden:1 },{ emoji:'🐠', label:'Renacuajo', orden:2 },{ emoji:'🐸', label:'Rana adulta', orden:3 }];
const AVE_CICLO = [{ emoji:'🥚', label:'Huevo', orden:1 },{ emoji:'🐣', label:'Polluelo', orden:2 },{ emoji:'🐦', label:'Ave adulta', orden:3 }];
const MAMIFERO_CICLO = [{ emoji:'🍼', label:'Recién nacido', orden:1 },{ emoji:'🐕', label:'Cachorro', orden:2 },{ emoji:'🐕‍🦺', label:'Adulto', orden:3 }];
const CICLOS_G2 = [MARIPOSA_CICLO, RANA_CICLO, AVE_CICLO, MAMIFERO_CICLO];

const HABITAT_ANIMALES = [
  { emoji:'🐧', label:'PINGÜINO', habitat:'POLO' },
  { emoji:'🦭', label:'FOCA', habitat:'POLO' },
  { emoji:'🐫', label:'CAMELLO', habitat:'DESIERTO' },
  { emoji:'🦂', label:'ESCORPIÓN', habitat:'DESIERTO' },
  { emoji:'🐬', label:'DELFÍN', habitat:'OCÉANO' },
  { emoji:'🐙', label:'PULPO', habitat:'OCÉANO' },
  { emoji:'🐒', label:'MONO', habitat:'SELVA' },
  { emoji:'🦜', label:'TUCÁN', habitat:'SELVA' },
  { emoji:'🐻', label:'OSO', habitat:'BOSQUE' },
];
const CUIDADO_ANIMAL_BANK = [
  { correcta:'No botar basura en el bosque donde viven animales', incorrectas:['Cazar animales en peligro de extinción','Destruir su hábitat natural','Contaminar los ríos donde beben agua'] },
  { correcta:'Proteger los hábitats naturales de los animales', incorrectas:['Talar todos los árboles de un bosque','Botar basura en el mar','Sacar animales silvestres de su hogar'] },
  { correcta:'Informarse sobre animales en peligro de extinción para cuidarlos', incorrectas:['Ignorar a los animales en peligro','Comprar animales silvestres capturados','Quemar bosques donde viven animales'] },
];

const ORGANOS_BANK = [
  { emoji:'❤️', organo:'CORAZÓN', funcion:'Bombea la sangre por todo el cuerpo' },
  { emoji:'🫁', organo:'PULMONES', funcion:'Nos ayudan a respirar' },
  { emoji: estomagoSVG(30), organo:'ESTÓMAGO', funcion:'Digiere los alimentos que comemos' },
  { emoji:'🦴', organo:'ESQUELETO', funcion:'Sostiene y protege nuestro cuerpo' },
  { emoji:'💪', organo:'MÚSCULOS', funcion:'Nos permiten movernos' },
];
const EJERCICIO_BANK = [
  { pregunta:'¿Qué le pasa a tu corazón cuando haces ejercicio?', correcta:'Late más rápido y se fortalece', opts:['Deja de latir','Se hace más pequeño','No cambia nada'] },
  { pregunta:'¿Por qué es importante hacer actividad física?', correcta:'Fortalece los músculos y el corazón', opts:['Debilita el cuerpo','No sirve para nada','Hace que crezcas menos'] },
];

const AGUA_ESTADOS_BANK = [
  { emoji:'🧊', label:'HIELO', estado:'SÓLIDO' },
  { emoji:'💧', label:'AGUA LÍQUIDA', estado:'LÍQUIDO' },
  { emoji:'💨', label:'VAPOR DE AGUA', estado:'GASEOSO' },
];
const CICLO_AGUA = [
  { emoji:'☀️', label:'Evaporación: el sol calienta el agua', orden:1 },
  { emoji:'☁️', label:'Condensación: se forman las nubes', orden:2 },
  { emoji:'🌧️', label:'Precipitación: cae la lluvia', orden:3 },
];
const AGUA_PROPIEDADES_BANK = [
  { texto:'El agua toma la forma del recipiente donde la pones', valor:true },
  { texto:'El agua puede disolver el azúcar y la sal', valor:true },
  { texto:'El agua tiene un color fuerte siempre', valor:false },
  { texto:'El agua se evapora y se congela con los cambios de temperatura', valor:true },
  { texto:'El agua nunca cambia de forma', valor:false },
];

const INSTRUMENTOS_CLIMA_BANK = [
  { emoji:'🌡️', label:'TERMÓMETRO', mide:'LA TEMPERATURA' },
  { emoji:'☔', label:'PLUVIÓMETRO', mide:'LA LLUVIA' },
  { emoji:'🎏', label:'VELETA', mide:'EL VIENTO' },
];
const TIEMPO_ATMOSFERICO_BANK = [
  { emoji:'🌧️', texto:'Cae mucha agua del cielo', tipo:'LLUVIA' },
  { emoji:'💨', texto:'Las hojas de los árboles se mueven fuerte', tipo:'VIENTO' },
  { emoji:'☀️', texto:'Hace mucho calor y sudas', tipo:'CALOR' },
  { emoji:'❄️', texto:'Hace mucho frío y ves tu respiración', tipo:'FRÍO' },
];

export function genVertebrados2Round(){
  if(Math.random()<0.5){
    const isVert = Math.random()<0.5;
    const item = isVert ? pick(VERTEBRADOS_BANK) : pick(INVERTEBRADOS_BANK);
    const opts = shuffle([{label:'TIENE COLUMNA VERTEBRAL', value:true},{label:'NO TIENE COLUMNA VERTEBRAL', value:false}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿El/la '+item.label.toLowerCase()+' tiene columna vertebral?</p>',
      options: opts, correctValue: isVert, speakText: item.label, cols:2, panel:true,
      explain: isVert ? 'El/la '+item.label.toLowerCase()+' es un <b>vertebrado</b>, tiene columna vertebral.' : 'El/la '+item.label.toLowerCase()+' es un <b>invertebrado</b>, no tiene columna vertebral.',
    };
  }
  const item = pick(VERTEBRADOS_BANK);
  const distract = shuffle(['MAMÍFERO','AVE','REPTIL','ANFIBIO','PEZ'].filter(function(t){ return t!==item.tipo; })).slice(0,3);
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué tipo de vertebrado es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:4, kind:'word',
    explain: 'El/la '+item.label.toLowerCase()+' es un(a) <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genCiclosVida2Round(){
  const ciclo = pick(CICLOS_G2);
  let a = pick(ciclo), b = pick(ciclo);
  while(b.label === a.label) b = pick(ciclo);
  const askBefore = Math.random()<0.5;
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const earlier = a.orden<b.orden ? a : b, later = a.orden<b.orden ? b : a;
  const correct = askBefore ? earlier.label : later.label;
  const cicloDisplay = ciclo.map(function(c){ return c.emoji; }).join(' → ');
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+cicloDisplay+'</p><p class="prompt-hint">'+(askBefore ? '¿Qué viene ANTES en este ciclo de vida?' : '¿Qué viene DESPUÉS en este ciclo de vida?')+'</p>',
    options: opts, correctValue: correct, speakText: askBefore ? '¿Qué viene antes?' : '¿Qué viene después?', cols:2, panel:true,
    explain: earlier.label+' viene antes que '+later.label+' en este ciclo de vida.',
  };
}

export function genHabitats2Round(){
  if(Math.random()<0.5){
    const item = pick(HABITAT_ANIMALES);
    const habitatPool = HABITAT_ANIMALES.map(function(h){ return h.habitat; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
    const distract = shuffle(habitatPool.filter(function(h){ return h!==item.habitat; })).slice(0,3);
    const opts = shuffle([item.habitat].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Dónde vive el/la '+item.label.toLowerCase()+'?</p>',
      options: opts, correctValue: item.habitat, speakText: item.label, cols:4, kind:'word',
      explain: 'El/la '+item.label.toLowerCase()+' vive en el/la <b>'+item.habitat.toLowerCase()+'</b>.',
    };
  }
  const item = pick(CUIDADO_ANIMAL_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar a los animales?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar a los animales?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a proteger a los animales y su hábitat.',
  };
}

export function genCuerpoDentro2Round(){
  if(Math.random()<0.5){
    const item = pick(ORGANOS_BANK);
    const distract = shuffle(ORGANOS_BANK.filter(function(o){ return o.organo!==item.organo; })).slice(0,3).map(function(o){ return o.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué hace tu '+item.organo.toLowerCase()+'?</p>',
      options: opts, correctValue: item.funcion, speakText: '¿Qué hace tu '+item.organo+'?', cols:2, panel:true,
      explain: 'Tu '+item.organo.toLowerCase()+' '+item.funcion.toLowerCase().replace(/^./, function(c){ return c; })+'.',
    };
  }
  const item = pick(EJERCICIO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

export function genAgua2Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(AGUA_ESTADOS_BANK);
    const distract = AGUA_ESTADOS_BANK.filter(function(a){ return a.estado!==item.estado; }).map(function(a){ return a.estado; });
    const opts = shuffle([item.estado].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿En qué estado está el agua?</p>',
      options: opts, correctValue: item.estado, speakText: item.label, cols:2, kind:'word', panel:true,
      explain: item.label+' es agua en estado <b>'+item.estado.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.67){
    let a = pick(CICLO_AGUA), b = pick(CICLO_AGUA);
    while(b.label === a.label) b = pick(CICLO_AGUA);
    const askBefore = Math.random()<0.5;
    const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
    const earlier = a.orden<b.orden ? a : b, later = a.orden<b.orden ? b : a;
    return {
      promptHTML: '<p class="prompt-hint">'+(askBefore ? '¿Qué paso viene ANTES en el ciclo del agua?' : '¿Qué paso viene DESPUÉS en el ciclo del agua?')+'</p>',
      options: opts, correctValue: askBefore ? earlier.label : later.label, speakText: askBefore ? '¿Qué viene antes?' : '¿Qué viene después?', cols:2, panel:true,
      explain: earlier.label+' viene antes que '+later.label+' en el ciclo del agua.',
    };
  }
  const item = pick(AGUA_PROPIEDADES_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: en realidad, '+(item.texto.toLowerCase().indexOf('nunca')!==-1 ? 'el agua sí puede cambiar de forma según el recipiente' : 'el agua es transparente, no tiene color propio')+'.',
  };
}

export function genClima2Round(){
  if(Math.random()<0.5){
    const item = pick(INSTRUMENTOS_CLIMA_BANK);
    const distract = INSTRUMENTOS_CLIMA_BANK.filter(function(i){ return i.label!==item.label; }).map(function(i){ return i.mide; });
    const opts = shuffle([item.mide].concat(distract)).map(function(m){ return {label:m, value:m}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué mide un(a) '+item.label.toLowerCase()+'?</p>',
      options: opts, correctValue: item.mide, speakText: item.label, cols:2, kind:'word', panel:true,
      explain: 'El/la '+item.label.toLowerCase()+' mide <b>'+item.mide.toLowerCase()+'</b>.',
    };
  }
  const item = pick(TIEMPO_ATMOSFERICO_BANK);
  const distract = TIEMPO_ATMOSFERICO_BANK.filter(function(t){ return t.tipo!==item.tipo; }).map(function(t){ return t.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto+'. ¿Qué tiempo atmosférico es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.texto, cols:4, kind:'word',
    explain: item.texto+', eso es <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genSeresVivosRound(){
  if(Math.random()<0.5){
    const item = pick(VIVOS_ITEMS);
    const opts = shuffle([{label:'SER VIVO', value:true},{label:'NO ES SER VIVO', value:false}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Es un ser vivo o no?</p>',
      options: opts, correctValue: item.vivo, speakText: item.label, cols:2, panel:true,
      explain: item.vivo ? item.label+' crece, se alimenta y necesita aire y agua, por eso <b>es un ser vivo</b>.' : item.label+' no crece ni se alimenta por sí solo, por eso <b>no es un ser vivo</b>.',
    };
  }
  const item = pick(ANIMAL_COVER_ITEMS);
  const distract = shuffle(['PELO','PLUMAS','ESCAMAS','PIEL','LANA'].filter(function(c){ return c!==item.cubierta; })).slice(0,3);
  const opts = shuffle([item.cubierta].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué cubre el cuerpo de este animal?</p>',
    options: opts, correctValue: item.cubierta, speakText: item.label, cols:4,
    explain: 'El '+item.label.toLowerCase()+' tiene el cuerpo cubierto de <b>'+item.cubierta.toLowerCase()+'</b>.',
  };
}

export function genPlantasRound(){
  if(Math.random()<0.5){
    const item = pick(PLANT_PARTS);
    const distract = shuffle(PLANT_PARTS.filter(function(p){ return p.part!==item.part; })).map(function(p){ return p.part; });
    const opts = shuffle([item.part].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.part, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es la descripción de la <b>'+item.part.toLowerCase()+'</b> de la planta.',
    };
  }
  let a = pick(FRUIT_SIZE), b = pick(FRUIT_SIZE);
  while(b.label === a.label) b = pick(FRUIT_SIZE);
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const bigger = a.size>b.size ? a : b, smaller = a.size>b.size ? b : a;
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estos frutos es más grande?</p>',
    options: opts, correctValue: bigger.label, speakText: '¿Cuál es más grande?', cols:2, panel:true,
    explain: 'El '+bigger.label.toLowerCase()+' es más grande que el '+smaller.label.toLowerCase()+'.',
  };
}

export function genCuerpoRound(){
  if(Math.random()<0.5){
    const item = pick(SENTIDOS);
    const distract = shuffle(SENTIDOS.filter(function(s){ return s.sense!==item.sense; })).slice(0,3).map(function(s){ return s.sense; });
    const opts = shuffle([item.sense].concat(distract)).map(function(s){ return {label:s, value:s}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Para qué sirven tus '+item.organ.toLowerCase()+'?</p>',
      options: opts, correctValue: item.sense, speakText: '¿Para qué sirven tus '+item.organ+'?', cols:4, kind:'word',
      explain: 'Tus '+item.organ.toLowerCase()+' sirven para <b>'+item.sense.toLowerCase()+'</b>.',
    };
  }
  const item = pick(HABITOS_SALUDABLES);
  const opts = shuffle([{label:'HÁBITO SALUDABLE', value:true},{label:'NO ES SALUDABLE', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.bueno, speakText: item.label, cols:2, panel:true,
    explain: item.bueno ? item.label+' es un <b>hábito saludable</b> que cuida tu cuerpo.' : item.label+' <b>no es un hábito saludable</b>.',
  };
}

export function genMaterialesRound(){
  if(Math.random()<0.5){
    const item = pick(MATERIALES_ITEMS);
    const materialPool = MATERIALES_ITEMS.map(function(m){ return m.material; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
    const distract = shuffle(materialPool.filter(function(m){ return m!==item.material; })).slice(0,3);
    const opts = shuffle([item.material].concat(distract)).map(function(m){ return {label:m, value:m}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿De qué material es '+item.object+'?</p>',
      options: opts, correctValue: item.material, speakText: item.object, cols:4, kind:'word',
      explain: item.object.charAt(0).toUpperCase()+item.object.slice(1)+' está hecho de <b>'+item.material.toLowerCase()+'</b>.',
    };
  }
  const item = pick(CAMBIOS_MATERIALES);
  const distract = shuffle(['CALOR','FUERZA','AGUA','LUZ'].filter(function(c){ return c!==item.cause; })).slice(0,3);
  const opts = shuffle([item.cause].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.text+'. ¿Qué produjo este cambio?</p>',
    options: opts, correctValue: item.cause, speakText: item.text, cols:4,
    explain: item.text+' por el <b>'+item.cause.toLowerCase()+'</b>.',
  };
}

export function genDiaNocheRound(){
  if(Math.random()<0.5){
    const item = pick(DIA_NOCHE_ITEMS);
    const opts = shuffle([{label:'DÍA', value:'DÍA'},{label:'NOCHE', value:'NOCHE'}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Es de día o de noche?</p>',
      options: opts, correctValue: item.momento, speakText: item.label, cols:2, panel:true,
      explain: item.label+', eso pasa de <b>'+item.momento.toLowerCase()+'</b>.',
    };
  }
  const item = pick(ESTACIONES);
  const seasonPool = ESTACIONES.map(function(e){ return e.season; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
  const distract = shuffle(seasonPool.filter(function(s){ return s!==item.season; }));
  const opts = shuffle([item.season].concat(distract)).map(function(s){ return {label:s, value:s}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Qué estación del año es?</p>',
    options: opts, correctValue: item.season, speakText: item.label, cols:4, kind:'word',
    explain: item.label+', eso ocurre en <b>'+item.season.toLowerCase()+'</b>.',
  };
}

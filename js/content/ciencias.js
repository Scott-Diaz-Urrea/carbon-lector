import { pick, shuffle, randInt } from '../utils.js';
import { toothbrushSVG, piedraSVG, semillaSVG, vasoVacioSVG, plasticinaSVG, estomagoSVG, focaSVG } from '../svg.js';

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
  { emoji:'🍒', label:'CEREZA', size:3 },
  { emoji:'🍓', label:'FRUTILLA', size:4 },
  { emoji:'🍐', label:'PERA', size:5 },
  { emoji:'🍎', label:'MANZANA', size:6 },
  { emoji:'🥭', label:'MANGO', size:7 },
  { emoji:'🍍', label:'PIÑA', size:8 },
  { emoji:'🍉', label:'SANDÍA', size:9 },
  { emoji:'🎃', label:'ZAPALLO', size:10 },
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
  { emoji: toothbrushSVG(30), label:'Cepillarse los dientes', bueno:true },
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
  { emoji: focaSVG(30), label:'FOCA', habitat:'POLO' },
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

/* Bancos ampliados de 3→5 y 4→6 ítems (antes solo sumaban 7 combinaciones
   únicas para `rounds:10`, garantizando una pregunta repetida en cada
   partida — detectado simulando sesiones completas). ANEMÓMETRO e
   HIGRÓMETRO son instrumentos meteorológicos reales tan estándar como los
   3 ya incluidos (siguen siendo CN02 OA12-13). */
const INSTRUMENTOS_CLIMA_BANK = [
  { emoji:'🌡️', label:'TERMÓMETRO', mide:'LA TEMPERATURA' },
  { emoji:'☔', label:'PLUVIÓMETRO', mide:'LA LLUVIA' },
  { emoji:'🎏', label:'VELETA', mide:'LA DIRECCIÓN DEL VIENTO' },
  { emoji:'🌬️', label:'ANEMÓMETRO', mide:'LA VELOCIDAD DEL VIENTO' },
  { emoji:'💧', label:'HIGRÓMETRO', mide:'LA HUMEDAD DEL AIRE' },
];
const TIEMPO_ATMOSFERICO_BANK = [
  { emoji:'🌧️', texto:'Cae mucha agua del cielo', tipo:'LLUVIA' },
  { emoji:'💨', texto:'Las hojas de los árboles se mueven fuerte', tipo:'VIENTO' },
  { emoji:'☀️', texto:'Hace mucho calor y sudas', tipo:'CALOR' },
  { emoji:'❄️', texto:'Hace mucho frío y ves tu respiración', tipo:'FRÍO' },
  { emoji:'☁️', texto:'El cielo se cubre de nubes grises y no se ve el sol', tipo:'NUBLADO' },
  { emoji:'🌨️', texto:'Caen copitos blancos y fríos del cielo', tipo:'NEVADO' },
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
    options: opts, correctValue: item.cubierta, speakText: item.label, cols:4, kind:'word',
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
    options: opts, correctValue: item.cause, speakText: item.text, cols:4, kind:'word',
    explain: item.text+' por el <b>'+item.cause.toLowerCase()+'</b>.',
  };
}

/* ---------------- Contenido Ciencias Naturales 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/ciencias-naturales/3-basico):
   Partes de la Planta -> OA01. Plantas de Chile -> OA02. Ciclo de Vida de
   la Planta -> OA03. Cuidado de las Plantas y el Ambiente -> OA04-05.
   Alimentación e Higiene -> OA06-07. Luz -> OA08-09. Sonido -> OA10.
   Sistema Solar y Movimientos de la Tierra -> OA11-13.
   No quedan OA fuera en este nivel: los 13 OA de 3° básico son observables/
   descriptivos y se prestan bien al motor de opción múltiple. */
export const CIENCIAS_MODULES_G3 = [
  {id:'plantas3', label:'Plantas: Partes y Especies de Chile', open:true, key:'plantas3'},
  {id:'cicloplanta3', label:'Ciclo de Vida de la Planta', open:true, key:'cicloplanta3'},
  {id:'cuidadoambiente3', label:'Cuidado de Plantas y Ambiente', open:true, key:'cuidadoambiente3'},
  {id:'alimentacion3', label:'Alimentación e Higiene', open:true, key:'alimentacion3'},
  {id:'luz3', label:'La Luz', open:true, key:'luz3'},
  {id:'sonido3', label:'El Sonido', open:true, key:'sonido3'},
  {id:'sistemasolar3', label:'Sistema Solar', open:true, key:'sistemasolar3'},
];
export const CIENCIAS_POS_G3 = [
  {x:22,y:92},{x:68,y:77},{x:24,y:62},{x:70,y:47},{x:24,y:32},{x:70,y:17},{x:24,y:4}
];

/* Partes de la Planta (OA01) solo tiene 3 elementos reales (raíz/tallo/
   hojas) — muy pocos para un módulo de rounds:8 por sí solo. Se fusiona
   con Plantas de Chile (OA02) en un único módulo con dos ángulos (función
   de cada parte, y especie/cultivo chileno), en vez de dejar un módulo
   separado con muy poca variedad real. */
const PARTES_PLANTA_BANK = [
  { parte:'RAÍZ', funcion:'Absorbe agua y nutrientes de la tierra y sostiene la planta', emoji:'🥕' },
  { parte:'TALLO', funcion:'Sostiene la planta y transporta el agua desde la raíz hasta las hojas', emoji:'🌱' },
  { parte:'HOJAS', funcion:'Fabrican el alimento de la planta usando la luz del sol', emoji:'🌿' },
];
const PLANTAS_CHILE_BANK = [
  { emoji:'🌺', planta:'COPIHUE', tipo:'FLOR NACIONAL DE CHILE' },
  { emoji:'🌲', planta:'ARAUCARIA', tipo:'ÁRBOL NATIVO DE CHILE' },
  { emoji:'🌾', planta:'TRIGO', tipo:'CULTIVO PARA HACER PAN Y HARINA' },
  { emoji:'🌽', planta:'MAÍZ', tipo:'CULTIVO PARA HACER CHOCLO Y HARINA' },
  { emoji:'🥔', planta:'PAPA', tipo:'CULTIVO QUE CRECE BAJO LA TIERRA' },
  { emoji:'🍇', planta:'VID', tipo:'CULTIVO PARA HACER UVAS Y VINO' },
];
const CICLO_PLANTA_BANK = [
  { emoji:'🌰', label:'Semilla', desc:'Cae al suelo y espera las condiciones para crecer', orden:1 },
  { emoji:'🌱', label:'Germinación', desc:'La semilla absorbe agua y comienza a brotar', orden:2 },
  { emoji:'🌿', label:'Crecimiento', desc:'La planta crece y desarrolla más hojas y tallo', orden:3 },
  { emoji:'🌸', label:'Formación de la flor', desc:'La planta forma flores que atraen insectos polinizadores', orden:4 },
  { emoji:'🍎', label:'Formación del fruto', desc:'Después de la polinización, la flor se convierte en fruto con semillas', orden:5 },
];
const CUIDADO_AMBIENTE3_BANK = [
  { correcta:'Reutilizar frascos de vidrio para guardar cosas', incorrectas:['Botar los frascos después de un solo uso','Romper los frascos vacíos','Dejarlos tirados en la calle'] },
  { correcta:'Separar la basura para reciclar papel, vidrio y plástico', incorrectas:['Mezclar toda la basura junta','Quemar la basura de la casa','Botar el reciclaje al mismo tacho que lo demás'] },
  { correcta:'Regar las plantas solo cuando lo necesitan', incorrectas:['Dejar la manguera corriendo sin usarla','Regar en exceso todos los días','No regar nunca las plantas'] },
  { correcta:'Plantar árboles nativos para cuidar el ecosistema', incorrectas:['Talar árboles sin necesidad','Arrancar plantas silvestres del parque','Pisar los brotes nuevos'] },
  { correcta:'Usar papel reciclado o reutilizar hojas por ambos lados', incorrectas:['Desperdiciar papel nuevo sin necesidad','Botar papel usado una sola vez','Quemar el papel usado'] },
  { correcta:'Reducir el uso de bolsas plásticas llevando bolsas de tela', incorrectas:['Usar una bolsa plástica nueva cada vez','Botar las bolsas después de un solo uso','Acumular bolsas sin reutilizarlas'] },
  { correcta:'Compostar restos de fruta y verdura para abonar la tierra', incorrectas:['Botar los restos de comida junto con el reciclaje','Quemar los restos de comida','Dejar los restos de comida tirados en el patio'] },
  { correcta:'Apagar las luces y desenchufar aparatos que no se están usando', incorrectas:['Dejar todos los aparatos enchufados todo el día','Dejar las luces prendidas aunque no haya nadie','Usar más electricidad de la necesaria a propósito'] },
];
const ALIMENTOS3_BANK = [
  { emoji:'🥦', alimento:'el brócoli', categoria:'VERDURA' },
  { emoji:'🍎', alimento:'la manzana', categoria:'FRUTA' },
  { emoji:'🍗', alimento:'el pollo', categoria:'PROTEÍNA' },
  { emoji:'🥛', alimento:'la leche', categoria:'LÁCTEO' },
  { emoji:'🍞', alimento:'el pan', categoria:'CEREAL' },
  { emoji:'🍬', alimento:'el dulce', categoria:'AZÚCAR (CONSUMO MODERADO)' },
];
const HIGIENE_ALIMENTOS_BANK = [
  { correcta:'Lavarse las manos antes de preparar o comer alimentos', incorrectas:['Cocinar sin lavarse las manos','Tocar la comida con las manos sucias','Estornudar sobre los alimentos'] },
  { correcta:'Lavar las frutas y verduras antes de comerlas', incorrectas:['Comer la fruta sin lavarla','Guardar la fruta sucia en el refrigerador','Cortar la fruta con utensilios sucios'] },
  { correcta:'Guardar los alimentos en el refrigerador para que no se echen a perder', incorrectas:['Dejar la comida cocinada afuera todo el día','Guardar la comida ya vencida','Mezclar comida cruda con comida cocinada'] },
];
const LUZ_FUENTES_BANK = [
  { emoji:'☀️', fuente:'el Sol', tipo:'NATURAL' },
  { emoji:'💡', fuente:'una ampolleta', tipo:'ARTIFICIAL' },
  { emoji:'🔥', fuente:'el fuego', tipo:'NATURAL' },
  { emoji:'🔦', fuente:'una linterna', tipo:'ARTIFICIAL' },
  { emoji:'🌟', fuente:'una estrella', tipo:'NATURAL' },
  { emoji:'🕯️', fuente:'una vela', tipo:'ARTIFICIAL' },
];
const LUZ_PROPIEDADES_BANK = [
  { texto:'La luz viaja en línea recta', valor:true },
  { texto:'La luz puede reflejarse en un espejo', valor:true },
  { texto:'La luz blanca se puede separar en varios colores, como en un arcoíris', valor:true },
  { texto:'La luz nunca puede atravesar el vidrio', valor:false },
  { texto:'La luz siempre viaja en zigzag', valor:false },
];
const SONIDO_PROPIEDADES_BANK = [
  { texto:'El sonido viaja en todas las direcciones', valor:true },
  { texto:'El sonido puede reflejarse y producir un eco', valor:true },
  { texto:'El sonido se transmite mejor a través del agua y sólidos que del vacío', valor:true },
  { texto:'El sonido tiene tono (agudo o grave) e intensidad (fuerte o suave)', valor:true },
  { texto:'El sonido no puede viajar a través del agua', valor:false },
  { texto:'El sonido se escucha igual de fuerte sin importar la distancia', valor:false },
  { texto:'El sonido se produce por vibraciones', valor:true },
  { texto:'El sonido viaja más rápido en el aire que en un sólido', valor:false },
];
const SISTEMA_SOLAR_BANK = [
  { emoji:'☀️', nombre:'EL SOL', desc:'Es la estrella que está en el centro del Sistema Solar y nos da luz y calor' },
  { emoji:'🌍', nombre:'LA TIERRA', desc:'Es el planeta donde vivimos, el tercero más cercano al Sol' },
  { emoji:'🌙', nombre:'LA LUNA', desc:'Es el satélite natural que gira alrededor de la Tierra' },
  { emoji:'☄️', nombre:'UN COMETA', desc:'Es un cuerpo helado que forma una cola brillante al acercarse al Sol' },
  { emoji:'🪐', nombre:'UN PLANETA CON ANILLOS', desc:'Como Saturno, un planeta rodeado de anillos de hielo y roca' },
];
const MOVIMIENTOS_TIERRA_BANK = [
  { pregunta:'¿Cómo se llama el movimiento de la Tierra que produce el día y la noche?', correcta:'ROTACIÓN', opts:['TRASLACIÓN','ECLIPSE','GRAVEDAD'] },
  { pregunta:'¿Cómo se llama el movimiento de la Tierra alrededor del Sol que dura un año?', correcta:'TRASLACIÓN', opts:['ROTACIÓN','ECLIPSE','GRAVEDAD'] },
  { pregunta:'¿Cuánto tiempo demora la Tierra en dar una vuelta completa sobre su propio eje?', correcta:'UN DÍA (24 HORAS)', opts:['UN MES','UNA SEMANA','UN AÑO'] },
  { pregunta:'¿Cuánto tiempo demora la Tierra en dar una vuelta completa alrededor del Sol?', correcta:'UN AÑO', opts:['UN DÍA','UNA SEMANA','UN MES'] },
];
const FASES_LUNA_BANK = [
  { emoji:'🌑', fase:'LUNA NUEVA', desc:'No se ve la Luna iluminada desde la Tierra' },
  { emoji:'🌓', fase:'CUARTO CRECIENTE', desc:'Se ve la mitad de la Luna iluminada, creciendo' },
  { emoji:'🌕', fase:'LUNA LLENA', desc:'Se ve todo el disco de la Luna iluminado' },
  { emoji:'🌗', fase:'CUARTO MENGUANTE', desc:'Se ve la mitad de la Luna iluminada, disminuyendo' },
];

export function genPlantas3Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(PARTES_PLANTA_BANK);
    const distract = shuffle(PARTES_PLANTA_BANK.filter(function(p){ return p.parte!==item.parte; })).map(function(p){ return p.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Cuál es la función de '+(item.parte==='HOJAS'?'las':'la')+' '+item.parte.toLowerCase()+'?</p>',
      options: opts, correctValue: item.funcion, speakText: '¿Cuál es la función de la '+item.parte.toLowerCase()+'?', cols:2, panel:true,
      explain: (item.parte==='HOJAS'?'Las':'La')+' '+item.parte.toLowerCase()+': '+item.funcion.toLowerCase()+'.',
    };
  }
  if(roll<0.67){
    const item = pick(PARTES_PLANTA_BANK);
    const distract = shuffle(PARTES_PLANTA_BANK.filter(function(p){ return p.parte!==item.parte; })).map(function(p){ return p.parte; });
    const opts = shuffle([item.parte].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.funcion+'</p><p class="prompt-hint">¿De qué parte de la planta se trata?</p>',
      options: opts, correctValue: item.parte, speakText: item.funcion, cols:4, kind:'word',
      explain: 'Esa es la función de '+(item.parte==='HOJAS'?'las':'la')+' <b>'+item.parte.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PLANTAS_CHILE_BANK);
  const distract = shuffle(PLANTAS_CHILE_BANK.filter(function(p){ return p.tipo!==item.tipo; })).slice(0,3).map(function(p){ return p.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.planta+'. ¿Qué es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.planta, cols:2, kind:'word', panel:true,
    explain: 'El/la <b>'+item.planta.toLowerCase()+'</b> es '+item.tipo.toLowerCase()+'.',
  };
}

export function genCicloPlanta3Round(){
  let a = pick(CICLO_PLANTA_BANK), b = pick(CICLO_PLANTA_BANK);
  while(b.label === a.label) b = pick(CICLO_PLANTA_BANK);
  const askBefore = Math.random()<0.5;
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const earlier = a.orden<b.orden ? a : b, later = a.orden<b.orden ? b : a;
  const correct = askBefore ? earlier.label : later.label;
  return {
    promptHTML: '<p class="prompt-hint">'+(askBefore ? '¿Qué etapa viene ANTES en el ciclo de vida de la planta?' : '¿Qué etapa viene DESPUÉS en el ciclo de vida de la planta?')+'</p>',
    options: opts, correctValue: correct, speakText: askBefore ? '¿Qué etapa viene antes?' : '¿Qué etapa viene después?', cols:2, panel:true,
    explain: earlier.label+' ('+earlier.desc.toLowerCase()+') viene antes que '+later.label.toLowerCase()+' en el ciclo de vida de la planta.',
  };
}

export function genCuidadoAmbiente3Round(){
  const item = pick(CUIDADO_AMBIENTE3_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar las plantas y el ambiente?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar las plantas y el ambiente?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a cuidar nuestro planeta.',
  };
}

export function genAlimentacion3Round(){
  if(Math.random()<0.5){
    const item = pick(ALIMENTOS3_BANK);
    const distract = shuffle(ALIMENTOS3_BANK.filter(function(a){ return a.categoria!==item.categoria; })).slice(0,3).map(function(a){ return a.categoria; });
    const opts = shuffle([item.categoria].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿A qué categoría pertenece '+item.alimento+'?</p>',
      options: opts, correctValue: item.categoria, speakText: '¿A qué categoría pertenece '+item.alimento+'?', cols:2, kind:'word', panel:true,
      explain: (item.alimento.charAt(0).toUpperCase()+item.alimento.slice(1))+' es un(a) <b>'+item.categoria.toLowerCase()+'</b>.',
    };
  }
  const item = pick(HIGIENE_ALIMENTOS_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de higiene con los alimentos?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de higiene con los alimentos?', cols:2, panel:true,
    explain: '"'+item.correcta+'" previene enfermedades.',
  };
}

export function genLuz3Round(){
  if(Math.random()<0.5){
    const item = pick(LUZ_FUENTES_BANK);
    const opts = shuffle([{label:'FUENTE NATURAL', value:'NATURAL'},{label:'FUENTE ARTIFICIAL', value:'ARTIFICIAL'}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.fuente+'. ¿Es una fuente de luz natural o artificial?</p>',
      options: opts, correctValue: item.tipo, speakText: item.fuente, cols:2, panel:true,
      explain: item.fuente.charAt(0).toUpperCase()+item.fuente.slice(1)+' es una fuente de luz <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(LUZ_PROPIEDADES_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: la luz sí puede atravesar materiales transparentes como el vidrio, y viaja en línea recta, no en zigzag.',
  };
}

export function genSonido3Round(){
  const item = pick(SONIDO_PROPIEDADES_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: el sonido sí puede viajar por el agua, y se escucha más débil mientras más lejos está la fuente.',
  };
}

export function genSistemaSolar3Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(SISTEMA_SOLAR_BANK);
    const distract = shuffle(SISTEMA_SOLAR_BANK.filter(function(s){ return s.nombre!==item.nombre; })).slice(0,3).map(function(s){ return s.nombre; });
    const opts = shuffle([item.nombre].concat(distract)).map(function(n){ return {label:n, value:n}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.nombre, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa descripción corresponde a <b>'+item.nombre.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.67){
    const item = pick(MOVIMIENTOS_TIERRA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  const item = pick(FASES_LUNA_BANK);
  const distract = shuffle(FASES_LUNA_BANK.filter(function(f){ return f.fase!==item.fase; })).map(function(f){ return f.fase; });
  const opts = shuffle([item.fase].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'. ¿Qué fase de la Luna es?</p>',
    options: opts, correctValue: item.fase, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Esa es la fase de <b>'+item.fase.toLowerCase()+'</b>.',
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

/* ---------------- Contenido Ciencias Naturales 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/ciencias-naturales/4-basico):
   Ecosistemas -> OA01-04 (elementos vivos/no vivos, adaptaciones, cadenas
   alimentarias, cuidado de ecosistemas de Chile). Cuerpo Humano IV ->
   OA05-07 (sistema esquelético, movimiento, sistema nervioso). La Materia
   -> OA09-11 (masa y espacio, estados de la materia, instrumentos de
   medición). Fuerzas -> OA12-13 (efectos y tipos de fuerza). La Tierra ->
   OA15-17 (capas de la Tierra, placas tectónicas, prevención de riesgos).
   Queda fuera OA08 ("investigar en diversas fuentes y comunicar los
   efectos" del consumo de alcohol — un proceso de indagación y
   comunicación propio, no una pregunta de opción múltiple, mismo criterio
   que excluye otros OA de "investigar") y OA14 (diseñar y construir un
   objeto tecnológico — producción práctica). */
export const CIENCIAS_MODULES_G4 = [
  {id:'ecosistemas4', label:'Ecosistemas', open:true, key:'ecosistemas4'},
  {id:'cuerpohumano4', label:'Cuerpo Humano IV', open:true, key:'cuerpohumano4'},
  {id:'materia4', label:'La Materia', open:true, key:'materia4'},
  {id:'fuerzas4', label:'Las Fuerzas', open:true, key:'fuerzas4'},
  {id:'tierra4', label:'La Tierra', open:true, key:'tierra4'},
];
export const CIENCIAS_POS_G4 = [{x:22,y:90},{x:68,y:70},{x:24,y:50},{x:70,y:30},{x:24,y:10}];

const ECOSISTEMA_ELEMENTOS_BANK = [
  { emoji:'🐦', elemento:'un pájaro', tipo:'ELEMENTO VIVO' },
  { emoji:'🌳', elemento:'un árbol', tipo:'ELEMENTO VIVO' },
  { emoji:'🦋', elemento:'una mariposa', tipo:'ELEMENTO VIVO' },
  { emoji: piedraSVG(30), elemento:'una roca', tipo:'ELEMENTO NO VIVO' },
  { emoji:'💧', elemento:'el agua', tipo:'ELEMENTO NO VIVO' },
  { emoji:'☀️', elemento:'la luz del sol', tipo:'ELEMENTO NO VIVO' },
];
const ADAPTACIONES_BANK = [
  { emoji:'🦒', animal:'la jirafa', adaptacion:'Tiene el cuello largo para alcanzar hojas altas de los árboles' },
  { emoji:'🐫', animal:'el camello', adaptacion:'Almacena grasa en la joroba para sobrevivir sin agua por varios días' },
  { emoji:'🐧', animal:'el pingüino', adaptacion:'Tiene una capa de grasa gruesa que lo protege del frío extremo' },
  { emoji:'🦎', animal:'el camaleón', adaptacion:'Cambia de color para camuflarse y protegerse de depredadores' },
  { emoji:'🌵', animal:'el cactus', adaptacion:'Guarda agua en su tallo grueso para sobrevivir en el desierto' },
];
const CADENA_ALIMENTARIA_BANK = [
  { emoji:'🌱', rol:'PRODUCTOR', desc:'Fabrica su propio alimento usando la luz del sol (como una planta)' },
  { emoji:'🐇', rol:'CONSUMIDOR', desc:'Se alimenta de otros seres vivos (como un animal herbívoro o carnívoro)' },
  { emoji:'🍄', rol:'DESCOMPONEDOR', desc:'Descompone los restos de seres vivos muertos y devuelve nutrientes a la tierra' },
];
const CUIDADO_ECOSISTEMA_BANK = [
  { correcta:'Proteger los bosques nativos de Chile de la tala ilegal', incorrectas:['Talar árboles sin control','Quemar bosques para hacer espacio','Ignorar los incendios forestales'] },
  { correcta:'No contaminar los ríos y lagos con basura o químicos', incorrectas:['Botar basura a los ríos','Verter químicos en el agua','Ignorar la contaminación del agua'] },
  { correcta:'Proteger a los animales en peligro de extinción, como el huemul', incorrectas:['Cazar animales en peligro de extinción','Destruir su hábitat natural','Capturar animales silvestres como mascotas'] },
  { correcta:'Informarse y cuidar las especies nativas de tu región', incorrectas:['Introducir especies que no son de la zona sin cuidado','Ignorar el daño a especies nativas','Dañar el hábitat de especies locales'] },
];

const HUESOS_BANK = [
  { emoji:'💀', hueso:'EL CRÁNEO', funcion:'Protege el cerebro' },
  { emoji:'🦴', hueso:'LAS COSTILLAS', funcion:'Protegen el corazón y los pulmones' },
  { emoji:'🦵', hueso:'EL FÉMUR', funcion:'Es el hueso más largo, está en el muslo y sostiene el peso del cuerpo' },
  { emoji:'🖐️', hueso:'LOS HUESOS DE LA MANO', funcion:'Permiten sujetar objetos con precisión' },
  { emoji:'🦴', hueso:'LA COLUMNA VERTEBRAL', funcion:'Sostiene el cuerpo y protege la médula espinal' },
];
const MOVIMIENTO_CUERPO_BANK = [
  { pregunta:'¿Qué parte del cuerpo se contrae y se relaja para mover los huesos?', correcta:'LOS MÚSCULOS', opts:['LOS TENDONES','LA PIEL','LA SANGRE'] },
  { pregunta:'¿Qué conecta a los músculos con los huesos?', correcta:'LOS TENDONES', opts:['LOS MÚSCULOS','LOS NERVIOS','LA PIEL'] },
  { pregunta:'¿Cómo se llama el punto donde se unen dos huesos y permite el movimiento?', correcta:'LA ARTICULACIÓN', opts:['EL TENDÓN','EL MÚSCULO','EL NERVIO'] },
];
const SISTEMA_NERVIOSO_BANK = [
  { emoji:'🧠', estructura:'EL CEREBRO', funcion:'Controla el pensamiento, el movimiento y las emociones' },
  { emoji:'🦴', estructura:'LA MÉDULA ESPINAL', funcion:'Lleva las señales entre el cerebro y el resto del cuerpo' },
  { emoji:'⚡', estructura:'LOS NERVIOS', funcion:'Transmiten información entre el cerebro y todo el cuerpo' },
];

const ESTADOS_MATERIA4_BANK = [
  { emoji:'🧊', ejemplo:'un cubo de hielo', estado:'SÓLIDO' },
  { emoji:'💧', ejemplo:'el agua líquida', estado:'LÍQUIDO' },
  { emoji:'💨', ejemplo:'el vapor de agua', estado:'GASEOSO' },
  { emoji: piedraSVG(30), ejemplo:'una piedra', estado:'SÓLIDO' },
  { emoji:'🥛', ejemplo:'la leche', estado:'LÍQUIDO' },
  { emoji:'🎈', ejemplo:'el aire dentro de un globo', estado:'GASEOSO' },
];
const INSTRUMENTOS_MEDICION_BANK = [
  { emoji:'⚖️', instrumento:'LA BALANZA', mide:'LA MASA' },
  { emoji:'🌡️', instrumento:'EL TERMÓMETRO', mide:'LA TEMPERATURA' },
  { emoji:'🥤', instrumento:'LA PROBETA (VASO GRADUADO)', mide:'EL VOLUMEN' },
];
const MATERIA_PROPIEDADES_BANK = [
  { texto:'Toda la materia tiene masa y ocupa un espacio', valor:true },
  { texto:'El aire no ocupa ningún espacio porque no se puede ver', valor:false },
  { texto:'Un objeto muy pequeño puede tener masa aunque no lo notemos', valor:true },
  { texto:'La materia solo existe en estado sólido', valor:false },
];

const FUERZA_EFECTOS_BANK = [
  { emoji:'⚽', texto:'Patear una pelota la hace moverse', efecto:'CAMBIA SU MOVIMIENTO' },
  { emoji:'🧲', texto:'Un imán atrae un clip de metal', efecto:'CAMBIA SU MOVIMIENTO' },
  { emoji: plasticinaSVG(30), texto:'Apretar la plasticina cambia su forma', efecto:'CAMBIA SU FORMA' },
  { emoji:'🎈', texto:'Inflar un globo lo estira y cambia su forma', efecto:'CAMBIA SU FORMA' },
];
const TIPOS_FUERZA_BANK = [
  { emoji:'🧲', texto:'La fuerza que atrae objetos de metal sin tocarlos', tipo:'FUERZA MAGNÉTICA' },
  { emoji:'🍎', texto:'La fuerza que hace que las cosas caigan hacia el suelo', tipo:'FUERZA DE GRAVEDAD' },
  { emoji:'🤚', texto:'La fuerza que se hace al empujar o tirar de un objeto directamente', tipo:'FUERZA DE CONTACTO' },
  { emoji:'👟', texto:'La fuerza que frena un objeto al rozar con una superficie', tipo:'FUERZA DE ROCE' },
];

const CAPAS_TIERRA_BANK = [
  { capa:'LA CORTEZA', desc:'Es la capa más externa y delgada, donde vivimos' },
  { capa:'EL MANTO', desc:'Es la capa intermedia, muy caliente y en parte fundida' },
  { capa:'EL NÚCLEO', desc:'Es la capa más interna y caliente, en el centro de la Tierra' },
];
const PLACAS_TECTONICAS_BANK = [
  { pregunta:'¿Qué son las placas tectónicas?', correcta:'Grandes bloques de la corteza terrestre que se mueven muy lentamente', opts:['Las capas de la atmósfera','Los océanos del planeta','Las estrellas del sistema solar'] },
  { pregunta:'¿Qué puede pasar cuando dos placas tectónicas chocan o se rozan?', correcta:'Pueden producirse terremotos o formarse montañas', opts:['El clima cambia de inmediato','Aparece un arcoíris','El día se hace más largo'] },
];
const RIESGOS_NATURALES_BANK = [
  { correcta:'Saber dónde están las zonas seguras de tu casa o escuela en caso de terremoto', incorrectas:['No saber qué hacer en caso de emergencia','Correr sin rumbo durante un terremoto','Ignorar los simulacros de emergencia'] },
  { correcta:'Tener un kit de emergencia con agua y linterna en casa', incorrectas:['No prepararse nunca para una emergencia','Guardar solo cosas innecesarias','Ignorar las alertas de emergencia'] },
  { correcta:'Alejarte de la costa si sientes un terremoto fuerte cerca del mar', incorrectas:['Acercarte a la playa después de un terremoto','Ignorar las alertas de tsunami','Quedarte cerca del mar a mirar'] },
  { correcta:'Conocer las vías de evacuación de tu escuela', incorrectas:['No saber por dónde salir en una emergencia','Bloquear las salidas de emergencia','Ignorar los simulacros de evacuación'] },
];

export function genEcosistemas4Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(ECOSISTEMA_ELEMENTOS_BANK);
    const opts = shuffle([{label:'ELEMENTO VIVO', value:'ELEMENTO VIVO'},{label:'ELEMENTO NO VIVO', value:'ELEMENTO NO VIVO'}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.elemento.charAt(0).toUpperCase()+item.elemento.slice(1)+'. ¿Es un elemento vivo o no vivo de un ecosistema?</p>',
      options: opts, correctValue: item.tipo, speakText: item.elemento, cols:2, panel:true,
      explain: (item.elemento.charAt(0).toUpperCase()+item.elemento.slice(1))+' es un <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.6){
    const item = pick(ADAPTACIONES_BANK);
    const distract = shuffle(ADAPTACIONES_BANK.filter(function(a){ return a.animal!==item.animal; })).slice(0,3).map(function(a){ return a.animal; });
    const opts = shuffle([item.animal.toUpperCase()].concat(distract.map(function(a){ return a.toUpperCase(); }))).map(function(a){ return {label:a, value:a}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.adaptacion+'.</p><p class="prompt-hint">¿Qué animal o planta tiene esta adaptación?</p>',
      options: opts, correctValue: item.animal.toUpperCase(), speakText: item.adaptacion, cols:2, kind:'word', panel:true,
      explain: item.emoji+' '+(item.animal.charAt(0).toUpperCase()+item.animal.slice(1))+' se adaptó así: '+item.adaptacion.toLowerCase()+'.',
    };
  }
  if(roll<0.8){
    const item = pick(CADENA_ALIMENTARIA_BANK);
    const distract = shuffle(CADENA_ALIMENTARIA_BANK.filter(function(c){ return c.rol!==item.rol; })).map(function(c){ return c.rol; });
    const opts = shuffle([item.rol].concat(distract)).map(function(r){ return {label:r, value:r}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué función cumple en la cadena alimentaria?</p>',
      options: opts, correctValue: item.rol, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: 'Esa función corresponde a un <b>'+item.rol.toLowerCase()+'</b>.',
    };
  }
  const item = pick(CUIDADO_ECOSISTEMA_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar los ecosistemas de Chile?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar los ecosistemas de Chile?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a proteger el ecosistema.',
  };
}

export function genCuerpoHumano4Round(){
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(HUESOS_BANK);
    const distract = shuffle(HUESOS_BANK.filter(function(h){ return h.hueso!==item.hueso; })).slice(0,3).map(function(h){ return h.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.hueso+'. ¿Cuál es su función principal?</p>',
      options: opts, correctValue: item.funcion, speakText: item.hueso, cols:2, panel:true,
      explain: item.hueso+': '+item.funcion.toLowerCase()+'.',
    };
  }
  if(roll<0.7){
    const item = pick(MOVIMIENTO_CUERPO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  const item = pick(SISTEMA_NERVIOSO_BANK);
  const distract = shuffle(SISTEMA_NERVIOSO_BANK.filter(function(s){ return s.estructura!==item.estructura; })).map(function(s){ return s.funcion; });
  const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.estructura+'. ¿Cuál es su función?</p>',
    options: opts, correctValue: item.funcion, speakText: item.estructura, cols:2, panel:true,
    explain: item.estructura+': '+item.funcion.toLowerCase()+'.',
  };
}

export function genMateria4Round(){
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(ESTADOS_MATERIA4_BANK);
    const distract = shuffle(['SÓLIDO','LÍQUIDO','GASEOSO'].filter(function(e){ return e!==item.estado; }));
    const opts = shuffle([item.estado].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+(item.ejemplo.charAt(0).toUpperCase()+item.ejemplo.slice(1))+'. ¿En qué estado de la materia está?</p>',
      options: opts, correctValue: item.estado, speakText: item.ejemplo, cols:2, kind:'word', panel:true,
      explain: (item.ejemplo.charAt(0).toUpperCase()+item.ejemplo.slice(1))+' está en estado <b>'+item.estado.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.7){
    const item = pick(INSTRUMENTOS_MEDICION_BANK);
    const distract = shuffle(INSTRUMENTOS_MEDICION_BANK.filter(function(i){ return i.instrumento!==item.instrumento; })).map(function(i){ return i.mide; });
    const opts = shuffle([item.mide].concat(distract)).map(function(m){ return {label:m, value:m}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.instrumento+'. ¿Qué mide este instrumento?</p>',
      options: opts, correctValue: item.mide, speakText: item.instrumento, cols:2, kind:'word', panel:true,
      explain: item.instrumento+' mide <b>'+item.mide.toLowerCase()+'</b>.',
    };
  }
  const item = pick(MATERIA_PROPIEDADES_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: toda la materia (incluido el aire) ocupa espacio y tiene masa, y existe en más de un estado.',
  };
}

export function genFuerzas4Round(){
  if(Math.random()<0.5){
    /* Solo existen 2 categorías reales de efecto (cambia movimiento / cambia
       forma) — antes se armaban 4 opciones filtrando el banco, pero con
       solo 1 categoría "distinta" disponible eso dejaba 2 opciones
       idénticas repetidas. Al ser una clasificación binaria real, la
       pregunta usa 2 opciones, no 4. */
    const item = pick(FUERZA_EFECTOS_BANK);
    const otroEfecto = ['CAMBIA SU MOVIMIENTO','CAMBIA SU FORMA'].filter(function(e){ return e!==item.efecto; })[0];
    const opts = shuffle([{label:item.efecto, value:item.efecto},{label:otroEfecto, value:otroEfecto}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto+'. ¿Qué efecto de la fuerza es?</p>',
      options: opts, correctValue: item.efecto, speakText: item.texto, cols:2, kind:'word', panel:true,
      explain: item.texto+': la fuerza <b>'+item.efecto.toLowerCase()+'</b>.',
    };
  }
  const item = pick(TIPOS_FUERZA_BANK);
  const distract = shuffle(TIPOS_FUERZA_BANK.filter(function(t){ return t.tipo!==item.tipo; })).map(function(t){ return t.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'.</p><p class="prompt-hint">¿Qué tipo de fuerza es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.texto, cols:2, kind:'word', panel:true,
    explain: 'Esa es la <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

export function genTierra4Round(){
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(CAPAS_TIERRA_BANK);
    const distract = shuffle(CAPAS_TIERRA_BANK.filter(function(c){ return c.capa!==item.capa; })).map(function(c){ return c.capa; });
    const opts = shuffle([item.capa].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué capa de la Tierra es?</p>',
      options: opts, correctValue: item.capa, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: item.capa+': '+item.desc.toLowerCase()+'.',
    };
  }
  if(roll<0.7){
    const item = pick(PLACAS_TECTONICAS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es "'+item.correcta+'".',
    };
  }
  const item = pick(RIESGOS_NATURALES_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena medida de prevención ante riesgos naturales?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena medida de prevención ante riesgos naturales?', cols:2, panel:true,
    explain: '"'+item.correcta+'" te ayuda a estar más seguro ante un riesgo natural.',
  };
}

/* ---------------- Contenido Ciencias Naturales 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/ciencias-naturales/5-basico):
   Célula y Sistemas del Cuerpo -> OA01-04 (la célula como unidad básica de
   los seres vivos, sistema digestivo, respiratorio y circulatorio).
   Alimentación y Salud -> OA05-07 (función de los alimentos en el
   crecimiento, efectos nocivos del cigarrillo, microorganismos beneficiosos
   y dañinos). Electricidad -> OA08-11 (transformación de energía eléctrica,
   circuito eléctrico simple, materiales conductores/aisladores, ahorro de
   energía). Agua en la Tierra -> OA12-14 (distribución de agua dulce y
   salada, características de océanos y lagos, efectos de la actividad
   humana y su protección). Los 14 OA de 5° básico son todos observables o
   explicativos, así que ninguno queda fuera del motor de opción múltiple. */
export const CIENCIAS_MODULES_G5 = [
  {id:'celulasistemas5', label:'Célula y Sistemas del Cuerpo', open:true, key:'celulasistemas5'},
  {id:'alimentacionsalud5', label:'Alimentación y Salud', open:true, key:'alimentacionsalud5'},
  {id:'electricidad5', label:'Electricidad', open:true, key:'electricidad5'},
  {id:'aguatierra5', label:'Agua en la Tierra', open:true, key:'aguatierra5'},
];
export const CIENCIAS_POS_G5 = [{x:22,y:88},{x:68,y:64},{x:24,y:38},{x:70,y:12}];

const CELULA_BANK = [
  { pregunta:'¿Cuál es la unidad básica que forma a todos los seres vivos?', correcta:'LA CÉLULA', opts:['EL ÓRGANO','EL TEJIDO','EL HUESO'] },
  { pregunta:'Una bacteria está formada por una sola célula. ¿Cómo se llama este tipo de ser vivo?', correcta:'UNICELULAR', opts:['MULTICELULAR','PLURICELULAR','SIN CÉLULAS'] },
  { pregunta:'Un ser humano está formado por billones de células trabajando juntas. ¿Cómo se llama este tipo de ser vivo?', correcta:'MULTICELULAR', opts:['UNICELULAR','MONOCELULAR','ACELULAR'] },
  { pregunta:'Una planta también está formada por muchas células. ¿Cómo se llama este tipo de ser vivo?', correcta:'MULTICELULAR', opts:['UNICELULAR','SIN CÉLULAS','MONOCELULAR'] },
];
const DIGESTIVO_BANK = [
  { parte:'LA BOCA', funcion:'TRITURAR Y COMENZAR A DESCOMPONER EL ALIMENTO' },
  { parte:'EL ESÓFAGO', funcion:'TRANSPORTAR EL ALIMENTO HACIA EL ESTÓMAGO' },
  { parte:'EL ESTÓMAGO', funcion:'DESCOMPONER EL ALIMENTO CON JUGOS GÁSTRICOS' },
  { parte:'EL INTESTINO DELGADO', funcion:'ABSORBER LOS NUTRIENTES DEL ALIMENTO' },
];
const RESPIRATORIO_BANK = [
  { parte:'LA NARIZ', funcion:'FILTRAR Y CALENTAR EL AIRE QUE RESPIRAMOS' },
  { parte:'LA TRÁQUEA', funcion:'CONDUCIR EL AIRE HACIA LOS PULMONES' },
  { parte:'LOS PULMONES', funcion:'INTERCAMBIAR OXÍGENO Y DIÓXIDO DE CARBONO CON LA SANGRE' },
];
const CIRCULATORIO_BANK = [
  { parte:'EL CORAZÓN', funcion:'BOMBEAR LA SANGRE POR TODO EL CUERPO' },
  { parte:'LAS ARTERIAS', funcion:'LLEVAR SANGRE DESDE EL CORAZÓN HACIA EL RESTO DEL CUERPO' },
  { parte:'LAS VENAS', funcion:'LLEVAR SANGRE DE VUELTA HACIA EL CORAZÓN' },
];
function sistemaRound(bank, sistemaLabel){
  const item = pick(bank);
  const distract = shuffle(bank.filter(function(b){ return b.funcion!==item.funcion; })).map(function(b){ return b.funcion; });
  const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.parte+'</p><p class="prompt-hint">Esta parte pertenece al sistema '+sistemaLabel+'. ¿Cuál es su función principal?</p>',
    options: opts, correctValue: item.funcion, speakText: item.parte, cols:2, panel:true,
    explain: item.parte+': '+item.funcion.toLowerCase()+'.',
  };
}
export function genCelulaSistemas5Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(CELULA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
      explain: 'La respuesta correcta es <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.5) return sistemaRound(DIGESTIVO_BANK,'digestivo');
  if(roll<0.75) return sistemaRound(RESPIRATORIO_BANK,'respiratorio');
  return sistemaRound(CIRCULATORIO_BANK,'circulatorio');
}

const CONSUMO_ALIMENTOS_BANK = [
  { pregunta:'Los alimentos ricos en proteínas, como la carne, el huevo y las legumbres, ayudan principalmente a...', correcta:'CRECER Y REPARAR LOS TEJIDOS DEL CUERPO', opts:['DAR SOLO SABOR DULCE A LAS COMIDAS','ENFRIAR EL CUERPO','EVITAR QUE TE DÉ SUEÑO'] },
  { pregunta:'Los alimentos ricos en carbohidratos, como el pan, el arroz y la papa, entregan principalmente...', correcta:'ENERGÍA PARA LAS ACTIVIDADES DIARIAS', opts:['CALCIO PARA LOS HUESOS','PROTECCIÓN CONTRA EL FRÍO','COLOR A LA PIEL'] },
  { pregunta:'Comer frutas y verduras variadas todos los días ayuda principalmente a...', correcta:'ENTREGAR VITAMINAS Y MINERALES QUE EL CUERPO NECESITA', opts:['HACER QUE CREZCA EL CABELLO MÁS RÁPIDO','REEMPLAZAR LA NECESIDAD DE DORMIR','EVITAR TENER QUE HACER EJERCICIO'] },
  { pregunta:'¿Por qué es importante comer alimentos variados y no solo un tipo de comida?', correcta:'PORQUE CADA GRUPO DE ALIMENTOS APORTA NUTRIENTES DISTINTOS QUE EL CUERPO NECESITA', opts:['PORQUE ASÍ LA COMIDA ES MÁS BARATA','PORQUE ASÍ SE OCUPAN MENOS PLATOS','PORQUE EL CUERPO SOLO NECESITA UN NUTRIENTE'] },
];
const CIGARRILLO_BANK = [
  { pregunta:'¿Qué órgano resulta dañado principalmente por el humo del cigarrillo?', correcta:'LOS PULMONES', opts:['LOS HUESOS','LAS UÑAS','EL CABELLO'] },
  { pregunta:'El cigarrillo contiene una sustancia llamada nicotina, que puede generar en quien fuma...', correcta:'ADICCIÓN, ES DECIR, UNA NECESIDAD DIFÍCIL DE CONTROLAR DE SEGUIR FUMANDO', opts:['MÁS ENERGÍA PARA HACER DEPORTE','MEJOR VISIÓN NOCTURNA','MÁS APETITO POR VERDURAS'] },
  { pregunta:'¿Qué le puede pasar a una persona que fuma durante muchos años?', correcta:'PUEDE DESARROLLAR ENFERMEDADES RESPIRATORIAS GRAVES', opts:['MEJORA SU CAPACIDAD PULMONAR','NO LE AFECTA EN NADA A SU SALUD','CRECE MÁS RÁPIDO'] },
  { pregunta:'¿Por qué respirar el humo de alguien que fuma cerca (fumador pasivo) también es dañino?', correcta:'PORQUE ESE HUMO TAMBIÉN CONTIENE SUSTANCIAS DAÑINAS PARA QUIEN LO RESPIRA', opts:['PORQUE HUELE MAL, PERO NO HACE DAÑO','PORQUE SOLO AFECTA A QUIEN FUMA DIRECTAMENTE','PORQUE MEJORA LA CALIDAD DEL AIRE'] },
];
const MICROORGANISMOS_BANK = [
  { nombre:'LAS BACTERIAS QUE TRANSFORMAN LA LECHE EN YOGUR', tipo:'BENEFICIOSO' },
  { nombre:'LA LEVADURA QUE HACE CRECER EL PAN', tipo:'BENEFICIOSO' },
  { nombre:'EL MOHO QUE APARECE EN EL PAN VIEJO', tipo:'DAÑINO' },
  { nombre:'LAS BACTERIAS QUE CAUSAN UNA INFECCIÓN A LA GARGANTA', tipo:'DAÑINO' },
  { nombre:'LAS BACTERIAS QUE AYUDAN A LA DIGESTIÓN EN EL INTESTINO', tipo:'BENEFICIOSO' },
  { nombre:'EL VIRUS QUE CAUSA EL RESFRÍO COMÚN', tipo:'DAÑINO' },
];
export function genAlimentacionSalud5Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CONSUMO_ALIMENTOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  if(roll<0.67){
    const item = pick(CIGARRILLO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(MICROORGANISMOS_BANK);
  const opts = shuffle([{label:'BENEFICIOSO PARA LA SALUD', value:'BENEFICIOSO'},{label:'DAÑINO PARA LA SALUD', value:'DAÑINO'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.nombre+'</p><p class="prompt-hint">¿Este microorganismo es beneficioso o dañino para la salud?</p>',
    options: opts, correctValue: item.tipo, speakText: item.nombre, cols:2, panel:true,
    explain: 'Es <b>'+item.tipo.toLowerCase()+'</b> para la salud.',
  };
}

const TRANSFORMACION_ELECTRICA_BANK = [
  { objeto:'UNA AMPOLLETA ENCENDIDA', correcta:'LUZ Y CALOR', opts:['SONIDO','MOVIMIENTO','FRÍO'] },
  { objeto:'UN PARLANTE REPRODUCIENDO MÚSICA', correcta:'SONIDO', opts:['LUZ','FRÍO','OLOR'] },
  { objeto:'UN VENTILADOR ENCENDIDO', correcta:'MOVIMIENTO', opts:['SONIDO SOLAMENTE','LUZ SOLAMENTE','OLOR'] },
  { objeto:'UNA PLANCHA DE ROPA ENCENDIDA', correcta:'CALOR', opts:['SONIDO','FRÍO','LUZ DE COLORES'] },
];
const CIRCUITO_BANK = [
  { componente:'LA PILA', funcion:'ENTREGAR LA ENERGÍA ELÉCTRICA AL CIRCUITO' },
  { componente:'EL CABLE', funcion:'CONDUCIR LA CORRIENTE ELÉCTRICA ENTRE LOS COMPONENTES' },
  { componente:'EL INTERRUPTOR', funcion:'ABRIR O CERRAR EL PASO DE LA CORRIENTE' },
  { componente:'LA AMPOLLETA', funcion:'TRANSFORMAR LA ELECTRICIDAD EN LUZ' },
];
const CONDUCTORES_AISLANTES_BANK = [
  { material:'EL COBRE (UN METAL)', conductor:true }, { material:'EL ALUMINIO (UN METAL)', conductor:true },
  { material:'EL AGUA CON SAL', conductor:true }, { material:'LA MADERA SECA', conductor:false },
  { material:'EL PLÁSTICO', conductor:false }, { material:'EL VIDRIO', conductor:false },
  { material:'LA GOMA (CAUCHO)', conductor:false }, { material:'EL PAPEL', conductor:false },
];
const AHORRO_ENERGIA_BANK = [
  { accion:'APAGAR LAS LUCES AL SALIR DE UNA HABITACIÓN VACÍA', ahorra:true },
  { accion:'DESCONECTAR LOS APARATOS QUE NO SE ESTÁN USANDO', ahorra:true },
  { accion:'USAR AMPOLLETAS DE BAJO CONSUMO (LED)', ahorra:true },
  { accion:'DEJAR EL TELEVISOR ENCENDIDO TODA LA NOCHE SIN VERLO', ahorra:false },
  { accion:'DEJAR LA PUERTA DEL REFRIGERADOR ABIERTA POR MUCHO RATO', ahorra:false },
  { accion:'APROVECHAR LA LUZ NATURAL DURANTE EL DÍA EN VEZ DE ENCENDER LUCES', ahorra:true },
];
export function genElectricidad5Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(TRANSFORMACION_ELECTRICA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.objeto+'</p><p class="prompt-hint">¿En qué transforma principalmente la energía eléctrica?</p>',
      options: opts, correctValue: item.correcta, speakText: item.objeto, cols:2, kind:'word', panel:true,
      explain: 'Transforma la electricidad en <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.5){
    const item = pick(CIRCUITO_BANK);
    const distract = shuffle(CIRCUITO_BANK.filter(function(c){ return c.funcion!==item.funcion; })).map(function(c){ return c.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.componente+'</p><p class="prompt-hint">En un circuito eléctrico simple, ¿cuál es la función de esta parte?</p>',
      options: opts, correctValue: item.funcion, speakText: item.componente, cols:2, panel:true,
      explain: item.componente+': '+item.funcion.toLowerCase()+'.',
    };
  }
  if(roll<0.75){
    const item = pick(CONDUCTORES_AISLANTES_BANK);
    const opts = shuffle([{label:'ES CONDUCTOR (DEJA PASAR LA ELECTRICIDAD)', value:true},{label:'ES AISLANTE (NO DEJA PASAR LA ELECTRICIDAD)', value:false}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.material+'</p><p class="prompt-hint">¿Este material es conductor o aislante de la electricidad?</p>',
      options: opts, correctValue: item.conductor, speakText: item.material, cols:2, panel:true,
      explain: item.conductor ? item.material+' es <b>conductor</b>: deja pasar la corriente eléctrica.' : item.material+' es <b>aislante</b>: no deja pasar la corriente eléctrica.',
    };
  }
  const item = pick(AHORRO_ENERGIA_BANK);
  const opts = shuffle([{label:'SÍ AYUDA A AHORRAR ENERGÍA', value:true},{label:'NO AYUDA A AHORRAR ENERGÍA', value:false}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.accion+'</p><p class="prompt-hint">¿Esta acción ayuda a ahorrar energía eléctrica?</p>',
    options: opts, correctValue: item.ahorra, speakText: item.accion, cols:2, panel:true,
    explain: item.ahorra ? 'Sí: '+item.accion.toLowerCase()+' ayuda a ahorrar energía.' : 'No: '+item.accion.toLowerCase()+' desperdicia energía.',
  };
}

const DISTRIBUCION_AGUA_BANK = [
  { pregunta:'¿Dónde se encuentra la mayor parte del agua de nuestro planeta?', correcta:'EN LOS OCÉANOS (AGUA SALADA)', opts:['EN LOS RÍOS (AGUA DULCE)','EN LOS GLACIARES SOLAMENTE','EN LAS NUBES SOLAMENTE'] },
  { pregunta:'¿Qué tipo de agua es la que podemos beber directamente sin procesarla mucho?', correcta:'EL AGUA DULCE', opts:['EL AGUA SALADA DE MAR','EL AGUA DE MAR HIRVIENDO','NINGÚN TIPO DE AGUA ES POTABLE'] },
  { pregunta:'¿Por qué el agua dulce es un recurso que se debe cuidar, aunque parezca abundante?', correcta:'PORQUE SOLO ES UNA PEQUEÑA PARTE DE TODA EL AGUA DEL PLANETA', opts:['PORQUE NO EXISTE EN NINGÚN LUGAR','PORQUE ES MÁS ABUNDANTE QUE EL AGUA SALADA','PORQUE NUNCA SE PUEDE CONTAMINAR'] },
];
const OCEANOS_LAGOS_BANK = [
  { caracteristica:'TIENE AGUA SALADA Y MAREAS', tipo:'OCÉANO' },
  { caracteristica:'GENERALMENTE TIENE AGUA DULCE Y ESTÁ RODEADO DE TIERRA POR TODOS LADOS', tipo:'LAGO' },
  { caracteristica:'ES LA MASA DE AGUA MÁS GRANDE Y PROFUNDA DEL PLANETA', tipo:'OCÉANO' },
  { caracteristica:'SUELE SER MÁS PEQUEÑO Y NO ESTÁ CONECTADO DIRECTAMENTE CON EL MAR', tipo:'LAGO' },
];
const PROTECCION_AGUA_BANK = [
  { accion:'BOTAR BASURA O QUÍMICOS A UN RÍO', protege:false },
  { accion:'NO DESPERDICIAR AGUA POTABLE EN LA CASA', protege:true },
  { accion:'LIMPIAR LA ORILLA DE UN LAGO DE BASURA', protege:true },
  { accion:'VERTER ACEITE DE COCINA POR EL DESAGÜE HACIA LOS RÍOS', protege:false },
  { accion:'CUIDAR QUE LAS FÁBRICAS NO CONTAMINEN LOS CUERPOS DE AGUA', protege:true },
];
export function genAguaTierra5Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(DISTRIBUCION_AGUA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  if(roll<0.67){
    const item = pick(OCEANOS_LAGOS_BANK);
    const opts = shuffle([{label:'OCÉANO', value:'OCÉANO'},{label:'LAGO', value:'LAGO'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caracteristica+'</p><p class="prompt-hint">¿Es una característica de un océano o de un lago?</p>',
      options: opts, correctValue: item.tipo, speakText: item.caracteristica, cols:2, kind:'word',
      explain: 'Esta es una característica típica de un(a) <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PROTECCION_AGUA_BANK);
  const opts = shuffle([{label:'SÍ PROTEGE LOS CUERPOS DE AGUA', value:true},{label:'NO PROTEGE, LOS DAÑA', value:false}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.accion+'</p><p class="prompt-hint">¿Esta acción protege los cuerpos de agua o los daña?</p>',
    options: opts, correctValue: item.protege, speakText: item.accion, cols:2, panel:true,
    explain: item.protege ? 'Sí: esta acción ayuda a proteger los cuerpos de agua.' : 'No: esta acción daña o contamina los cuerpos de agua.',
  };
}

/* ---------------- Contenido Ciencias Naturales 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/ciencias-naturales/6-basico):
   Fotosíntesis y Cadenas Alimentarias -> OA01-03 (requerimientos y productos
   de la fotosíntesis, roles en una cadena alimentaria, impacto de acciones
   humanas sobre redes alimentarias). Sistema Reproductor y Pubertad ->
   OA04-05 (estructuras y función del sistema reproductor femenino y
   masculino, cambios físicos observables de la pubertad — ver el comentario
   junto a `SISTEMA_REPRODUCTOR_BANK` más abajo: se agregó tras conversarlo
   explícitamente con el usuario, manteniendo el contenido estrictamente
   anatómico/factual). Hábitos Saludables y Prevención ->
   OA06-07 (ventajas de la actividad física e higiene durante el crecimiento,
   efectos nocivos de las drogas y conductas de protección — en clave
   preventiva y factual, mismo criterio que Alimentación y Salud de 5°
   básico y Prevención y Vida Saludable de Orientación 5°). Energía y sus
   Transformaciones -> OA08-09,11 (transformaciones energéticas, recursos
   renovables/no renovables, uso responsable de la energía en general, no
   solo eléctrica como en 5° básico). Calor, Temperatura y Estados de la
   Materia -> OA10,12-15 (el calor fluye de lo caliente a lo frío, la
   materia como partículas en movimiento, cambios de estado, diferencia
   entre calor y temperatura). La Tierra: Capas, Suelo y Erosión -> OA16-18
   (atmósfera/litósfera/hidrósfera, formación y propiedades del suelo,
   agentes y consecuencias de la erosión). Los 18 OA de 6° básico quedan
   cubiertos. */
export const CIENCIAS_MODULES_G6 = [
  {id:'fotosintesiscadenas6', label:'Fotosíntesis y Cadenas Alimentarias', open:true, key:'fotosintesiscadenas6'},
  {id:'reproductorpubertad6', label:'Sistema Reproductor y Pubertad', open:true, key:'reproductorpubertad6'},
  {id:'habitossaludables6', label:'Hábitos Saludables y Prevención', open:true, key:'habitossaludables6'},
  {id:'energiatransformaciones6', label:'Energía y sus Transformaciones', open:true, key:'energiatransformaciones6'},
  {id:'calortemperatura6', label:'Calor, Temperatura y Estados de la Materia', open:true, key:'calortemperatura6'},
  {id:'tierrasueloerosion6', label:'La Tierra: Capas, Suelo y Erosión', open:true, key:'tierrasueloerosion6'},
];
export const CIENCIAS_POS_G6 = [{x:20,y:94},{x:64,y:80},{x:24,y:64},{x:66,y:48},{x:22,y:30},{x:66,y:10}];

const FOTOSINTESIS_BANK = [
  { pregunta:'¿Qué necesita una planta para realizar la fotosíntesis?', correcta:'AGUA, DIÓXIDO DE CARBONO Y LUZ SOLAR', opts:['SOLO AGUA Y OSCURIDAD','SOLO TIERRA Y AIRE FRÍO','SOLO SEMILLAS Y VIENTO'] },
  { pregunta:'¿Qué produce la fotosíntesis, además del azúcar que alimenta a la planta?', correcta:'OXÍGENO', opts:['DIÓXIDO DE CARBONO SOLAMENTE','AGUA SOLAMENTE','NITRÓGENO'] },
  { pregunta:'¿En qué parte de la planta ocurre principalmente la fotosíntesis?', correcta:'EN LAS HOJAS', opts:['EN LAS RAÍCES','EN LAS SEMILLAS','EN LA CORTEZA DEL TRONCO'] },
  { pregunta:'¿Qué le pasaría a una planta si nunca recibiera luz solar?', correcta:'NO PODRÍA REALIZAR LA FOTOSÍNTESIS Y MORIRÍA', opts:['CRECERÍA MÁS RÁPIDO QUE NUNCA','LE SALDRÍAN MÁS FLORES','NO LE AFECTARÍA EN NADA'] },
];
const CADENA_ALIMENTARIA6_BANK = [
  { cadena:['PASTO','CONEJO','ZORRO'] },
  { cadena:['ALGAS','PEZ PEQUEÑO','PEZ GRANDE'] },
  { cadena:['TRIGO','RATÓN','BÚHO'] },
  { cadena:['FITOPLANCTON','KRILL','BALLENA'] },
];
const ROLES_CADENA = ['PRODUCTOR (HACE SU PROPIO ALIMENTO)','CONSUMIDOR PRIMARIO (SE ALIMENTA DEL PRODUCTOR)','CONSUMIDOR SECUNDARIO (SE ALIMENTA DE OTRO CONSUMIDOR)'];
const IMPACTO_HUMANO_BANK = [
  { afirmacion:'Talar un bosque puede eliminar la fuente de alimento de muchos animales', v:true },
  { afirmacion:'Sobrepescar una especie puede afectar a los depredadores que se alimentan de ella', v:true },
  { afirmacion:'Introducir una especie que no es nativa de un lugar nunca afecta a las redes alimentarias locales', v:false },
  { afirmacion:'Contaminar un río puede afectar a toda la cadena alimentaria que depende de esa agua', v:true },
  { afirmacion:'Las acciones humanas nunca tienen ningún efecto sobre las redes alimentarias naturales', v:false },
];
export function genFotosintesisCadenas6Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(FOTOSINTESIS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  if(roll<0.67){
    const item = pick(CADENA_ALIMENTARIA6_BANK);
    const idx = randInt(0,2);
    const organismo = item.cadena[idx];
    const correct = ROLES_CADENA[idx];
    const distract = ROLES_CADENA.filter(function(r){ return r!==correct; });
    const opts = shuffle([correct].concat(distract)).map(function(r){ return {label:r, value:r}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:20px;">'+item.cadena.join(' → ')+'</p><p class="prompt-hint">En esta cadena alimentaria, ¿qué rol cumple "'+organismo+'"?</p>',
      options: opts, correctValue: correct, speakText: '¿Qué rol cumple '+organismo+' en esta cadena alimentaria?', cols:2, panel:true,
      explain: '"'+organismo+'" es el <b>'+correct.toLowerCase()+'</b> en esta cadena.',
    };
  }
  const item = pick(IMPACTO_HUMANO_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
    options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

/* Sistema Reproductor y Pubertad -> CN06 OA04-05. Agregado tras conversarlo
   explícitamente con el usuario: la primera versión de este PR excluía por
   completo estos OA por cautela, pero el currículum oficial chileno sí
   cubre la anatomía básica del sistema reproductor de forma clínica en 6°
   básico (con diagramas simples), igual que ya se hizo aquí con los
   sistemas digestivo/respiratorio/circulatorio en Ciencias de 5° básico.
   El contenido se mantiene estrictamente anatómico/funcional y factual
   (estructuras, función, cambios físicos observables de la pubertad) — lo
   afectivo, vincular y de intimidad sigue siendo terreno exclusivo de
   Orientación, donde permanece excluido desde 3° básico por requerir el
   acompañamiento real de un adulto en una instancia dedicada. */
const SISTEMA_REPRODUCTOR_BANK = [
  { pregunta:'¿Cuál es la función principal de los ovarios en el sistema reproductor femenino?', correcta:'PRODUCIR ÓVULOS', opts:['DIGERIR LOS ALIMENTOS','BOMBEAR LA SANGRE','FILTRAR EL AIRE'] },
  { pregunta:'¿Cuál es la función principal de los testículos en el sistema reproductor masculino?', correcta:'PRODUCIR ESPERMATOZOIDES', opts:['DIGERIR LOS ALIMENTOS','BOMBEAR LA SANGRE','FILTRAR EL AIRE'] },
  { pregunta:'¿En qué órgano del sistema reproductor femenino se desarrolla un bebé durante el embarazo?', correcta:'EN EL ÚTERO', opts:['EN EL ESTÓMAGO','EN LOS PULMONES','EN EL CORAZÓN'] },
  { pregunta:'¿Qué es la menstruación?', correcta:'LA ELIMINACIÓN MENSUAL DEL REVESTIMIENTO DEL ÚTERO CUANDO NO HAY EMBARAZO', opts:['UNA ENFERMEDAD QUE HAY QUE CURAR','UN PROBLEMA DIGESTIVO','UNA SEÑAL DE QUE ALGO ANDA MAL'] },
  { pregunta:'¿Cuál es la función general del sistema reproductor humano?', correcta:'PERMITIR LA REPRODUCCIÓN Y CONTINUIDAD DE LA ESPECIE HUMANA', opts:['AYUDAR A RESPIRAR','AYUDAR A DIGERIR LOS ALIMENTOS','BOMBEAR LA SANGRE POR EL CUERPO'] },
];
const PUBERTAD_CAMBIOS_BANK = [
  { afirmacion:'Durante la pubertad, es común que el cuerpo experimente un crecimiento acelerado (un "estirón")', v:true },
  { afirmacion:'En las niñas, uno de los cambios comunes de la pubertad es el inicio de la menstruación', v:true },
  { afirmacion:'En los niños, uno de los cambios comunes de la pubertad es el cambio de voz (se vuelve más grave)', v:true },
  { afirmacion:'La pubertad es una etapa normal del desarrollo humano por la que pasan todas las personas', v:true },
  { afirmacion:'Durante la pubertad es común que aparezca vello corporal y facial nuevo', v:true },
  { afirmacion:'Todos los cambios de la pubertad ocurren exactamente a la misma edad y de la misma forma en todas las personas', v:false },
  { afirmacion:'Sentir emociones más intensas o cambiantes durante la pubertad es algo anormal que nunca le pasa a nadie', v:false },
  { afirmacion:'La pubertad solo afecta el cuerpo, nunca tiene relación con cómo se sienten las emociones de una persona', v:false },
];
export function genReproductorPubertad6Round(){
  if(Math.random()<0.5){
    const item = pick(SISTEMA_REPRODUCTOR_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(PUBERTAD_CAMBIOS_BANK);
  const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
    options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
  };
}

const HABITOS_CRECIMIENTO_BANK = [
  { afirmacion:'Mantener una buena higiene personal, como ducharse regularmente, es importante durante el crecimiento', v:true },
  { afirmacion:'Practicar actividad física regular ayuda al desarrollo saludable del cuerpo', v:true },
  { afirmacion:'Dormir muy pocas horas cada noche no afecta en nada el desarrollo del cuerpo', v:false },
  { afirmacion:'Cambiar de ropa y lavarla regularmente es parte de una buena higiene', v:true },
  { afirmacion:'Da lo mismo lavarse las manos antes de comer o no', v:false },
  { afirmacion:'Una alimentación variada apoya el crecimiento saludable del cuerpo', v:true },
];
const DROGAS_EFECTOS_BANK = [
  { pregunta:'¿Cuál es un efecto nocivo del consumo de tabaco en el cuerpo?', correcta:'DAÑA LOS PULMONES Y EL CORAZÓN', opts:['MEJORA LA CAPACIDAD PULMONAR','FORTALECE EL SISTEMA INMUNE','AYUDA A DORMIR MEJOR'] },
  { pregunta:'¿Cuál es un efecto nocivo del consumo de alcohol en el cuerpo?', correcta:'AFECTA EL HÍGADO Y EL SISTEMA NERVIOSO', opts:['FORTALECE LOS HUESOS','MEJORA LA CONCENTRACIÓN','AYUDA A LA DIGESTIÓN'] },
  { pregunta:'¿Cuál de estas es una conducta de protección frente a las drogas?', correcta:'RODEARSE DE AMISTADES QUE RESPETEN TUS DECISIONES', opts:['PROBAR CUALQUIER COSA QUE OFREZCA UN AMIGO','IGNORAR LOS CONSEJOS DE LA FAMILIA','GUARDAR EL PROBLEMA EN SECRETO SIEMPRE'] },
  { pregunta:'¿Qué factor ayuda a prevenir el consumo de drogas en la adolescencia?', correcta:'TENER UNA BUENA COMUNICACIÓN CON LA FAMILIA', opts:['AISLARSE DE LA FAMILIA POR COMPLETO','EVITAR HABLAR DE CUALQUIER PROBLEMA','SEGUIR SIEMPRE LA PRESIÓN DE UN GRUPO'] },
];
export function genHabitosSaludables6Round(){
  if(Math.random()<0.5){
    const item = pick(HABITOS_CRECIMIENTO_BANK);
    const opts = shuffle([{label:'VERDADERO', value:true},{label:'FALSO', value:false}]);
    return {
      promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
      options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
      explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.',
    };
  }
  const item = pick(DROGAS_EFECTOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

const TRANSFORMACION_ENERGIA6_BANK = [
  { objeto:'UNA VELA ENCENDIDA', correcta:'LUZ Y CALOR', opts:['SONIDO','MOVIMIENTO','FRÍO'] },
  { objeto:'UN PANEL SOLAR', correcta:'ENERGÍA ELÉCTRICA', opts:['SONIDO','OLOR','FRÍO'] },
  { objeto:'UN MOLINO DE VIENTO (AEROGENERADOR)', correcta:'ENERGÍA ELÉCTRICA O MECÁNICA', opts:['LUZ SOLAMENTE','OLOR','FRÍO'] },
  { objeto:'UNA PILA QUE ENCIENDE UNA LINTERNA', correcta:'ENERGÍA QUÍMICA A ENERGÍA ELÉCTRICA Y LUZ', opts:['ENERGÍA SONORA A ENERGÍA SOLAR','FRÍO A CALOR','MOVIMIENTO A OLOR'] },
];
const RECURSOS_RENOVABLES6_BANK = [
  { recurso:'ENERGÍA SOLAR', tipo:'RENOVABLE' }, { recurso:'ENERGÍA EÓLICA (VIENTO)', tipo:'RENOVABLE' },
  { recurso:'ENERGÍA HIDRÁULICA (AGUA)', tipo:'RENOVABLE' }, { recurso:'EL PETRÓLEO', tipo:'NO RENOVABLE' },
  { recurso:'EL CARBÓN', tipo:'NO RENOVABLE' }, { recurso:'EL GAS NATURAL', tipo:'NO RENOVABLE' },
];
const USO_RESPONSABLE_ENERGIA_BANK = [
  { accion:'Usar la bicicleta o caminar para trayectos cortos en vez del auto', ayuda:true },
  { accion:'Usar electrodomésticos eficientes que consuman menos energía', ayuda:true },
  { accion:'Dejar todas las luces de la casa encendidas todo el día sin necesidad', ayuda:false },
  { accion:'Compartir el auto con otras personas que van al mismo lugar (carpool)', ayuda:true },
  { accion:'Usar el auto para recorrer distancias muy cortas que se podrían caminar', ayuda:false },
];
export function genEnergiaTransformaciones6Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(TRANSFORMACION_ENERGIA6_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.objeto+'</p><p class="prompt-hint">¿En qué transforma principalmente la energía?</p>',
      options: opts, correctValue: item.correcta, speakText: item.objeto, cols:2, kind:'word', panel:true,
      explain: 'Transforma la energía en <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.67){
    const item = pick(RECURSOS_RENOVABLES6_BANK);
    const opts = shuffle([{label:'RENOVABLE', value:'RENOVABLE'},{label:'NO RENOVABLE', value:'NO RENOVABLE'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.recurso+'</p><p class="prompt-hint">¿Es un recurso energético renovable o no renovable?</p>',
      options: opts, correctValue: item.tipo, speakText: item.recurso, cols:2, panel:true,
      explain: item.recurso+' es un recurso <b>'+item.tipo.toLowerCase()+'</b>.',
    };
  }
  const item = pick(USO_RESPONSABLE_ENERGIA_BANK);
  const opts = shuffle([{label:'SÍ AYUDA A USAR LA ENERGÍA DE FORMA RESPONSABLE', value:true},{label:'NO AYUDA, ES UN USO IRRESPONSABLE', value:false}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.accion+'</p><p class="prompt-hint">¿Esta acción ayuda a usar la energía de forma responsable?</p>',
    options: opts, correctValue: item.ayuda, speakText: item.accion, cols:2, panel:true,
    explain: item.ayuda ? 'Sí: esta acción ayuda a usar la energía de forma responsable.' : 'No: esta acción desperdicia energía.',
  };
}

const CALOR_FLUJO_BANK = [
  { escenario:'Pones un cubo de hielo en un vaso de agua tibia', correcta:'DEL AGUA TIBIA HACIA EL HIELO', opts:['DEL HIELO HACIA EL AGUA TIBIA','NO HAY NINGÚN FLUJO DE CALOR','EL CALOR DESAPARECE POR COMPLETO'] },
  { escenario:'Tocas una taza de té caliente con la mano fría', correcta:'DE LA TAZA CALIENTE HACIA TU MANO', opts:['DE TU MANO HACIA LA TAZA','NO HAY NINGÚN FLUJO DE CALOR','EL CALOR SE QUEDA SOLO EN LA TAZA'] },
  { escenario:'Dejas una bebida fría al sol en un día caluroso', correcta:'DEL AIRE CALIENTE HACIA LA BEBIDA FRÍA', opts:['DE LA BEBIDA FRÍA HACIA EL AIRE','NO HAY NINGÚN FLUJO DE CALOR','LA BEBIDA SE ENFRÍA AÚN MÁS'] },
];
const ESTADOS_PARTICULAS_BANK = [
  { desc:'Las partículas están muy juntas y apenas se mueven, manteniendo una forma fija', estado:'SÓLIDO' },
  { desc:'Las partículas están más separadas y se deslizan unas sobre otras, tomando la forma del recipiente', estado:'LÍQUIDO' },
  { desc:'Las partículas están muy separadas entre sí y se mueven rápidamente en todas direcciones', estado:'GASEOSO' },
];
const CAMBIOS_ESTADO_BANK = [
  { desc:'Un cubo de hielo se derrite y se convierte en agua líquida', proceso:'FUSIÓN' },
  { desc:'El agua de un charco desaparece poco a poco al sol, convirtiéndose en vapor', proceso:'EVAPORACIÓN' },
  { desc:'El agua hirviendo en una olla se convierte rápidamente en vapor', proceso:'EBULLICIÓN' },
  { desc:'El vapor de agua en el espejo del baño se convierte en gotitas de agua', proceso:'CONDENSACIÓN' },
  { desc:'El agua líquida se convierte en hielo al meterla al congelador', proceso:'SOLIDIFICACIÓN' },
  { desc:'El hielo seco (dióxido de carbono sólido) se convierte directamente en gas, sin pasar por líquido', proceso:'SUBLIMACIÓN' },
];
const CALOR_TEMPERATURA_BANK = [
  { pregunta:'¿Qué mide un termómetro: el calor o la temperatura?', correcta:'LA TEMPERATURA', opts:['EL CALOR','EL SONIDO','LA HUMEDAD'] },
  { pregunta:'¿Qué es el calor?', correcta:'LA ENERGÍA QUE SE TRANSFIERE DE UN OBJETO A OTRO', opts:['UNA UNIDAD PARA MEDIR EL PESO','UN INSTRUMENTO DE MEDICIÓN','UN TIPO DE SONIDO'] },
];
export function genCalorTemperatura6Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(CALOR_FLUJO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'.</p><p class="prompt-hint">¿Hacia dónde fluye el calor en esta situación?</p>',
      options: opts, correctValue: item.correcta, speakText: item.escenario, cols:2, panel:true,
      explain: 'El calor siempre fluye de lo más caliente a lo más frío: <b>'+item.correcta.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.5){
    const item = pick(ESTADOS_PARTICULAS_BANK);
    const todos = ['SÓLIDO','LÍQUIDO','GASEOSO'];
    const distract = todos.filter(function(e){ return e!==item.estado; });
    const opts = shuffle([item.estado].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿A qué estado de la materia corresponde esta descripción?</p>',
      options: opts, correctValue: item.estado, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: 'Esta descripción corresponde al estado <b>'+item.estado.toLowerCase()+'</b>.',
    };
  }
  if(roll<0.75){
    const item = pick(CAMBIOS_ESTADO_BANK);
    const distract = shuffle(CAMBIOS_ESTADO_BANK.filter(function(c){ return c.proceso!==item.proceso; })).slice(0,3).map(function(c){ return c.proceso; });
    const opts = shuffle([item.proceso].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué cambio de estado ocurre en esta situación?</p>',
      options: opts, correctValue: item.proceso, speakText: item.desc, cols:2, kind:'word',
      explain: 'Este cambio de estado se llama <b>'+item.proceso.toLowerCase()+'</b>.',
    };
  }
  const item = pick(CALOR_TEMPERATURA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

const CAPAS_TIERRA6_BANK = [
  { capa:'ATMÓSFERA', desc:'La capa de aire y gases que rodea la Tierra y nos permite respirar' },
  { capa:'LITÓSFERA', desc:'La capa sólida de rocas y suelo sobre la que caminamos y construimos' },
  { capa:'HIDRÓSFERA', desc:'Toda el agua del planeta: océanos, ríos, lagos y glaciares' },
];
const SUELO_BANK = [
  { pregunta:'¿De qué se forma principalmente el suelo?', correcta:'DE ROCAS DESCOMPUESTAS Y MATERIA ORGÁNICA (RESTOS DE PLANTAS Y ANIMALES)', opts:['SOLO DE AGUA DE LLUVIA','SOLO DE AIRE ATRAPADO','SOLO DE HIELO DERRETIDO'] },
  { pregunta:'¿Cuál de estas es una propiedad importante del suelo que se puede observar u medir?', correcta:'SU CAPACIDAD DE RETENER AGUA', opts:['SU VELOCIDAD DE VUELO','SU TEMPERATURA DE EBULLICIÓN','SU CONDUCTIVIDAD ELÉCTRICA'] },
  { pregunta:'¿Por qué es importante proteger el suelo de la contaminación?', correcta:'PORQUE LAS PLANTAS Y LOS CULTIVOS DEPENDEN DE UN SUELO SANO PARA CRECER', opts:['PORQUE EL SUELO SE USA PARA RESPIRAR','PORQUE EL SUELO NUNCA SE CONTAMINA','PORQUE NO TIENE NINGUNA FUNCIÓN IMPORTANTE'] },
];
const EROSION_BANK = [
  { agente:'EL VIENTO', desc:'Arrastra partículas de arena y tierra, desgastando rocas con el tiempo' },
  { agente:'EL AGUA', desc:'La lluvia y los ríos arrastran tierra y desgastan rocas al fluir sobre ellas' },
  { agente:'LAS ACTIVIDADES HUMANAS', desc:'Talar bosques o sobreexplotar terrenos deja el suelo más expuesto y vulnerable' },
];
export function genTierraSueloErosion6Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CAPAS_TIERRA6_BANK);
    const distract = shuffle(CAPAS_TIERRA6_BANK.filter(function(c){ return c.capa!==item.capa; })).map(function(c){ return c.capa; });
    const opts = shuffle([item.capa].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué capa de la Tierra es?</p>',
      options: opts, correctValue: item.capa, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: item.capa+': '+item.desc.toLowerCase()+'.',
    };
  }
  if(roll<0.67){
    const item = pick(SUELO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(EROSION_BANK);
  const distract = shuffle(EROSION_BANK.filter(function(e){ return e.agente!==item.agente; })).map(function(e){ return e.agente; });
  const opts = shuffle([item.agente].concat(distract)).map(function(a){ return {label:a, value:a}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué agente de erosión se describe aquí?</p>',
    options: opts, correctValue: item.agente, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: item.agente+': '+item.desc.toLowerCase()+'.',
  };
}

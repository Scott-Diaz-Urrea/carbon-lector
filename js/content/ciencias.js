import { pick, shuffle, randInt } from '../utils.js';
import { toothbrushSVG, piedraSVG, semillaSVG, vasoVacioSVG, plasticinaSVG, estomagoSVG, focaSVG, pluviometroSVG, veletaSVG } from '../svg.js';

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
  { emoji:'🐶', label:'Perro', vivo:true },
  { emoji:'🌳', label:'Árbol', vivo:true },
  { emoji:'🦋', label:'Mariposa', vivo:true },
  { emoji:'🐟', label:'Pez', vivo:true },
  { emoji:'🌻', label:'Flor', vivo:true },
  { emoji:'🐦', label:'Ave', vivo:true },
  { emoji:'🐢', label:'Tortuga', vivo:true },
  { emoji:'🌵', label:'Cactus', vivo:true },
  { emoji:'🐛', label:'Oruga', vivo:true },
  { emoji:'🍄', label:'Hongo', vivo:true },
  { emoji: piedraSVG(30), label:'Piedra', vivo:false },
  { emoji:'🚗', label:'Auto', vivo:false },
  { emoji:'⚽', label:'Pelota', vivo:false },
  { emoji:'🪑', label:'Silla', vivo:false },
  { emoji:'💧', label:'Gota de agua', vivo:false },
  { emoji:'🧸', label:'Peluche', vivo:false },
  { emoji:'📱', label:'Celular', vivo:false },
  { emoji:'☁️', label:'Nube', vivo:false },
];
const ANIMAL_COVER_ITEMS = [
  { emoji:'🐶', label:'Perro', cubierta:'Pelo' },
  { emoji:'🐱', label:'Gato', cubierta:'Pelo' },
  { emoji:'🐰', label:'Conejo', cubierta:'Pelo' },
  { emoji:'🐑', label:'Oveja', cubierta:'Lana' },
  { emoji:'🐦', label:'Ave', cubierta:'Plumas' },
  { emoji:'🦜', label:'Loro', cubierta:'Plumas' },
  { emoji:'🐧', label:'Pingüino', cubierta:'Plumas' },
  { emoji:'🐍', label:'Serpiente', cubierta:'Escamas' },
  { emoji:'🐟', label:'Pez', cubierta:'Escamas' },
  { emoji:'🐊', label:'Cocodrilo', cubierta:'Escamas' },
  { emoji:'🐸', label:'Rana', cubierta:'Piel' },
  { emoji:'🐘', label:'Elefante', cubierta:'Piel' },
];
const PLANT_PARTS = [
  { emoji:'🌿', part:'Hoja', desc:'Parte verde y plana que usa la luz del sol para fabricar el alimento de la planta.' },
  { emoji:'🌸', part:'Flor', desc:'Parte colorida y perfumada que atrae a los insectos.' },
  { emoji:'🌱', part:'Tallo', desc:'Parte que sostiene a la planta y lleva el agua hacia arriba.' },
  { emoji:'🥕', part:'Raíz', desc:'Parte que está bajo la tierra y absorbe agua y nutrientes.' },
];
const FRUIT_SIZE = [
  { emoji:'🌰', label:'Castaña', size:1 },
  { emoji:'🍇', label:'Uva', size:2 },
  { emoji:'🍒', label:'Cereza', size:3 },
  { emoji:'🍓', label:'Frutilla', size:4 },
  { emoji:'🍐', label:'Pera', size:5 },
  { emoji:'🍎', label:'Manzana', size:6 },
  { emoji:'🥭', label:'Mango', size:7 },
  { emoji:'🍍', label:'Piña', size:8 },
  { emoji:'🍉', label:'Sandía', size:9 },
  { emoji:'🎃', label:'Zapallo', size:10 },
];
const SENTIDOS = [
  { emoji:'👁️', organ:'Ojos', sense:'Ver' },
  { emoji:'👂', organ:'Oídos', sense:'Oír' },
  { emoji:'👃', organ:'Nariz', sense:'Oler' },
  { emoji:'👅', organ:'Lengua', sense:'Saborear' },
  { emoji:'✋', organ:'Piel', sense:'Tocar' },
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
  { emoji:'🪵', object:'una mesa de madera', material:'Madera' },
  { emoji:'🥄', object:'una cuchara de metal', material:'Metal' },
  { emoji:'🧸', object:'un juguete de peluche', material:'Tela' },
  { emoji: vasoVacioSVG(30), object:'un vaso de vidrio', material:'Vidrio' },
  { emoji:'🥤', object:'una botella de plástico', material:'Plástico' },
  { emoji:'🧱', object:'un muro de ladrillo', material:'Ladrillo' },
  { emoji:'📄', object:'una hoja de papel', material:'Papel' },
  { emoji:'🪢', object:'una cuerda de lana', material:'Lana' },
  { emoji:'🔑', object:'una llave de metal', material:'Metal' },
  { emoji:'👖', object:'unos pantalones de tela', material:'Tela' },
];
/* Tres correcciones de ícono-texto: "plastilina" usaba 🖌️ (un pincel, una
   herramienta, no una masa moldeable) → plasticinaSVG(). "Semilla" usaba
   🌱 (que en realidad ya es un brote/planta creciendo, no la semilla misma
   — mismo criterio que ya llevó a construir semillaSVG() en
   exploracionEntornoNatural.js) → se reusa ese helper aquí. "Un afiche"
   usaba 🌓 (una fase de la luna, sin relación con un afiche/póster) → 🖼️
   (un cuadro/lámina) se parece mucho más al objeto real. */
const CAMBIOS_MATERIALES = [
  { emoji:'🧊', text:'Un cubo de hielo se derrite', cause:'Calor' },
  { emoji:'🍞', text:'El pan se tuesta en el fuego', cause:'Calor' },
  { emoji:'👕', text:'La ropa mojada se seca al sol', cause:'Calor' },
  { emoji:'🍫', text:'Una barra de chocolate se derrite en la mano', cause:'Calor' },
  { emoji:'🎈', text:'Un globo se estira al inflarlo', cause:'Fuerza' },
  { emoji: plasticinaSVG(30), text:'La plastilina cambia de forma al apretarla', cause:'Fuerza' },
  { emoji:'📄', text:'Una hoja de papel se arruga al apretarla con la mano', cause:'Fuerza' },
  { emoji: semillaSVG(30), text:'Una semilla crece al regarla', cause:'Agua' },
  { emoji:'👗', text:'La ropa se moja bajo la lluvia', cause:'Agua' },
  { emoji:'🧽', text:'Una esponja seca se hincha al mojarla', cause:'Agua' },
  { emoji:'🖼️', text:'Un afiche se decolora al dejarlo mucho tiempo al sol', cause:'Luz' },
  { emoji:'🪴', text:'Una planta crece inclinada buscando la ventana', cause:'Luz' },
];
const DIA_NOCHE_ITEMS = [
  { emoji:'☀️', label:'El Sol brilla fuerte en el cielo', momento:'Día' },
  { emoji:'🌕', label:'La Luna llena se ve en el cielo', momento:'Noche' },
  { emoji:'⭐', label:'Las estrellas brillan en el cielo oscuro', momento:'Noche' },
  { emoji:'🌤️', label:'El cielo está celeste y muy iluminado', momento:'Día' },
  { emoji:'🦉', label:'El búho sale a cazar', momento:'Noche' },
  { emoji:'🐓', label:'El gallo canta al amanecer', momento:'Día' },
  { emoji:'🦇', label:'Los murciélagos salen a volar', momento:'Noche' },
  { emoji:'🏫', label:'Los niños van a la escuela', momento:'Día' },
  { emoji:'🛌', label:'La familia se va a dormir', momento:'Noche' },
  { emoji:'🌻', label:'Los girasoles miran hacia el sol', momento:'Día' },
];
const ESTACIONES = [
  { emoji:'☀️', label:'Hace mucho calor y vamos a la playa', season:'Verano' },
  { emoji:'🍉', label:'Comemos sandía porque hace mucho calor', season:'Verano' },
  { emoji:'🍂', label:'Las hojas de los árboles caen y cambian de color', season:'Otoño' },
  { emoji:'🌰', label:'Se cosechan castañas y nueces', season:'Otoño' },
  { emoji:'❄️', label:'Hace mucho frío y en algunos lugares nieva', season:'Invierno' },
  { emoji:'☂️', label:'Llueve seguido y usamos paraguas y botas', season:'Invierno' },
  { emoji:'🌸', label:'Las flores empiezan a florecer y el clima se entibia', season:'Primavera' },
  { emoji:'🐝', label:'Las abejas despiertan y visitan las flores nuevas', season:'Primavera' },
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
  { emoji:'🐶', label:'Perro', tipo:'Mamífero' },
  { emoji:'🐱', label:'Gato', tipo:'Mamífero' },
  { emoji:'🐘', label:'Elefante', tipo:'Mamífero' },
  { emoji:'🦅', label:'Águila', tipo:'Ave' },
  { emoji:'🦜', label:'Loro', tipo:'Ave' },
  { emoji:'🦎', label:'Lagartija', tipo:'Reptil' },
  { emoji:'🐍', label:'Serpiente', tipo:'Reptil' },
  { emoji:'🐸', label:'Rana', tipo:'Anfibio' },
  { emoji:'🐟', label:'Pez', tipo:'Pez' },
  { emoji:'🦈', label:'Tiburón', tipo:'Pez' },
];
const INVERTEBRADOS_BANK = [
  { emoji:'🦋', label:'Mariposa' },
  { emoji:'🐝', label:'Abeja' },
  { emoji:'🕷️', label:'Araña' },
  { emoji:'🦂', label:'Escorpión' },
  { emoji:'🦀', label:'Cangrejo' },
  { emoji:'🐌', label:'Caracol' },
];

const MARIPOSA_CICLO = [{ emoji:'🥚', label:'Huevo', orden:1 },{ emoji:'🐛', label:'Oruga', orden:2 },{ emoji:'🦋', label:'Mariposa adulta', orden:3 }];
const RANA_CICLO = [{ emoji:'🥚', label:'Huevos en el agua', orden:1 },{ emoji:'🐠', label:'Renacuajo', orden:2 },{ emoji:'🐸', label:'Rana adulta', orden:3 }];
const AVE_CICLO = [{ emoji:'🥚', label:'Huevo', orden:1 },{ emoji:'🐣', label:'Polluelo', orden:2 },{ emoji:'🐦', label:'Ave adulta', orden:3 }];
const MAMIFERO_CICLO = [{ emoji:'🍼', label:'Recién nacido', orden:1 },{ emoji:'🐕', label:'Cachorro', orden:2 },{ emoji:'🐕‍🦺', label:'Adulto', orden:3 }];
const CICLOS_G2 = [MARIPOSA_CICLO, RANA_CICLO, AVE_CICLO, MAMIFERO_CICLO];

const HABITAT_ANIMALES = [
  { emoji:'🐧', label:'Pingüino', habitat:'Polo' },
  { emoji: focaSVG(30), label:'Foca', habitat:'Polo' },
  { emoji:'🐫', label:'Camello', habitat:'Desierto' },
  { emoji:'🦂', label:'Escorpión', habitat:'Desierto' },
  { emoji:'🐬', label:'Delfín', habitat:'Océano' },
  { emoji:'🐙', label:'Pulpo', habitat:'Océano' },
  { emoji:'🐒', label:'Mono', habitat:'Selva' },
  { emoji:'🦜', label:'Tucán', habitat:'Selva' },
  { emoji:'🐻', label:'Oso', habitat:'Bosque' },
];
const CUIDADO_ANIMAL_BANK = [
  { correcta:'No botar basura en el bosque donde viven animales', incorrectas:['Cazar animales en peligro de extinción','Destruir su hábitat natural','Contaminar los ríos donde beben agua'] },
  { correcta:'Proteger los hábitats naturales de los animales', incorrectas:['Talar todos los árboles de un bosque','Botar basura en el mar','Sacar animales silvestres de su hogar'] },
  { correcta:'Informarse sobre animales en peligro de extinción para cuidarlos', incorrectas:['Ignorar a los animales en peligro','Comprar animales silvestres capturados','Quemar bosques donde viven animales'] },
];

const ORGANOS_BANK = [
  { emoji:'❤️', organo:'Corazón', funcion:'Bombea la sangre por todo el cuerpo' },
  { emoji:'🫁', organo:'Pulmones', funcion:'Nos ayudan a respirar' },
  { emoji: estomagoSVG(30), organo:'Estómago', funcion:'Digiere los alimentos que comemos' },
  { emoji:'🦴', organo:'Esqueleto', funcion:'Sostiene y protege nuestro cuerpo' },
  { emoji:'💪', organo:'Músculos', funcion:'Nos permiten movernos' },
];
const EJERCICIO_BANK = [
  { pregunta:'¿Qué le pasa a tu corazón cuando haces ejercicio?', correcta:'Late más rápido y se fortalece', opts:['Deja de latir','Se hace más pequeño','No cambia nada'] },
  { pregunta:'¿Por qué es importante hacer actividad física?', correcta:'Fortalece los músculos y el corazón', opts:['Debilita el cuerpo','No sirve para nada','Hace que crezcas menos'] },
];

const AGUA_ESTADOS_BANK = [
  { emoji:'🧊', label:'Hielo', estado:'Sólido' },
  { emoji:'💧', label:'Agua líquida', estado:'Líquido' },
  { emoji:'💨', label:'Vapor de agua', estado:'Gaseoso' },
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
  { emoji:'🌡️', label:'Termómetro', mide:'La temperatura' },
  { svg:'pluviometro', label:'Pluviómetro', mide:'La lluvia' },
  { svg:'veleta', label:'Veleta', mide:'La dirección del viento' },
  { emoji:'🌬️', label:'Anemómetro', mide:'La velocidad del viento' },
  { emoji:'💧', label:'Higrómetro', mide:'La humedad del aire' },
];
const TIEMPO_ATMOSFERICO_BANK = [
  { emoji:'🌧️', texto:'Cae mucha agua del cielo', tipo:'Lluvia' },
  { emoji:'💨', texto:'Las hojas de los árboles se mueven fuerte', tipo:'Viento' },
  { emoji:'☀️', texto:'Hace mucho calor y sudas', tipo:'Calor' },
  { emoji:'❄️', texto:'Hace mucho frío y ves tu respiración', tipo:'Frío' },
  { emoji:'☁️', texto:'El cielo se cubre de nubes grises y no se ve el sol', tipo:'Nublado' },
  { emoji:'🌨️', texto:'Caen copitos blancos y fríos del cielo', tipo:'Nevado' },
];

export function genVertebrados2Round(){
  const recurso = 'Los animales se dividen en dos grandes grupos según si tienen o no columna vertebral (una fila de huesitos que recorre la espalda y protege la médula espinal): los <b>vertebrados</b> sí la tienen, y se dividen en 5 tipos —mamíferos, aves, reptiles, anfibios y peces—, cada uno con características propias (los mamíferos tienen pelo y maman de su madre, las aves tienen plumas y ponen huevos, los peces respiran por branquias). Los <b>invertebrados</b> (como insectos, arañas o caracoles) no tienen columna vertebral, y son en realidad el grupo con más especies distintas en todo el planeta, aunque tienden a ser más pequeños. Reconocer esta clasificación te ayuda a organizar el enorme mundo animal en categorías más fáciles de entender.';
  if(Math.random()<0.5){
    const isVert = Math.random()<0.5;
    const item = isVert ? pick(VERTEBRADOS_BANK) : pick(INVERTEBRADOS_BANK);
    const opts = shuffle([{label:'Tiene columna vertebral', value:true},{label:'No tiene columna vertebral', value:false}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿El/la '+item.label.toLowerCase()+' tiene columna vertebral?</p>',
      options: opts, correctValue: isVert, speakText: item.label, cols:2, panel:true,
      explain: isVert ? 'El/la '+item.label.toLowerCase()+' es un <b>vertebrado</b>, tiene columna vertebral.' : 'El/la '+item.label.toLowerCase()+' es un <b>invertebrado</b>, no tiene columna vertebral.',
      recurso: recurso,
    };
  }
  const item = pick(VERTEBRADOS_BANK);
  const distract = shuffle(['Mamífero','Ave','Reptil','Anfibio','Pez'].filter(function(t){ return t!==item.tipo; })).slice(0,3);
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué tipo de vertebrado es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:4, kind:'word',
    explain: 'El/la '+item.label.toLowerCase()+' es un(a) <b>'+item.tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genCiclosVida2Round(){
  const recurso = 'Un <b>ciclo de vida</b> es la secuencia de etapas por las que pasa un ser vivo desde que nace hasta que puede tener sus propias crías, y luego el ciclo vuelve a empezar con la próxima generación. Cada especie tiene un ciclo distinto: algunos animales nacen ya pareciéndose a sus padres (como los perros), mientras que otros pasan por transformaciones enormes en su cuerpo (como la oruga que se convierte en mariposa, o el renacuajo que se convierte en rana). Entender el orden correcto de estas etapas —qué viene antes y qué viene después— te ayuda a comprender cómo crecen y cambian los seres vivos con el tiempo, no de forma instantánea.';
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
    recurso: recurso,
  };
}

export function genHabitats2Round(){
  const recurso = 'Un <b>hábitat</b> es el lugar donde un animal encuentra todo lo que necesita para vivir: alimento, agua, refugio y un clima adecuado para su cuerpo — por eso un pez vive en el agua y un oso polar vive en el hielo, y no al revés. Cuando un hábitat se daña (por contaminación, tala de árboles o caza excesiva), los animales que dependen de él pueden enfermarse, quedarse sin alimento o incluso desaparecer de esa zona. Por eso cuidar el hábitat de los animales —no ensuciarlo, no destruirlo, respetar a los animales silvestres— es una forma directa de cuidar a los animales mismos, aunque no los toques directamente.';
  if(Math.random()<0.5){
    const item = pick(HABITAT_ANIMALES);
    const habitatPool = HABITAT_ANIMALES.map(function(h){ return h.habitat; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
    const distract = shuffle(habitatPool.filter(function(h){ return h!==item.habitat; })).slice(0,3);
    const opts = shuffle([item.habitat].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Dónde vive el/la '+item.label.toLowerCase()+'?</p>',
      options: opts, correctValue: item.habitat, speakText: item.label, cols:4, kind:'word',
      explain: 'El/la '+item.label.toLowerCase()+' vive en el/la <b>'+item.habitat.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(CUIDADO_ANIMAL_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar a los animales?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar a los animales?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a proteger a los animales y su hábitat.',
    recurso: recurso,
  };
}

export function genCuerpoDentro2Round(){
  const recurso = 'Por fuera todos los cuerpos se ven distintos, pero por dentro todos tenemos los mismos órganos principales trabajando en equipo, cada uno con un trabajo específico: el corazón bombea la sangre por todo el cuerpo, los pulmones toman el aire que respiras, el estómago digiere la comida que comes, y el cerebro controla y coordina todo lo demás. Ninguno de estos órganos funciona solo — se necesitan entre sí para mantenerte vivo y con energía. Hacer ejercicio con regularidad ayuda a que estos órganos (especialmente el corazón y los pulmones) se mantengan fuertes y funcionen mejor, no solo a que tus músculos se vean más grandes.';
  if(Math.random()<0.5){
    const item = pick(ORGANOS_BANK);
    const distract = shuffle(ORGANOS_BANK.filter(function(o){ return o.organo!==item.organo; })).slice(0,3).map(function(o){ return o.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué hace tu '+item.organo.toLowerCase()+'?</p>',
      options: opts, correctValue: item.funcion, speakText: '¿Qué hace tu '+item.organo+'?', cols:2, panel:true,
      explain: 'Tu '+item.organo.toLowerCase()+' '+item.funcion.toLowerCase().replace(/^./, function(c){ return c; })+'.',
      recurso: recurso,
    };
  }
  const item = pick(EJERCICIO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
    recurso: recurso,
  };
}

export function genAgua2Round(){
  const recurso = 'El agua es la única sustancia común que puedes observar fácilmente en sus 3 estados: <b>sólido</b> (hielo, cuando hace mucho frío), <b>líquido</b> (la que bebes y usas todos los días) y <b>gaseoso</b> (vapor de agua, invisible en el aire). El agua cambia de un estado a otro según la temperatura: se congela con el frío y se evapora con el calor. Este cambio constante entre estados es lo que impulsa el <b>ciclo del agua</b>: el agua se evapora de mares y ríos, sube y forma nubes, cae como lluvia, y vuelve a juntarse en ríos y mares — un ciclo que se repite sin parar y que hace posible que siempre haya agua disponible en la Tierra.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(AGUA_ESTADOS_BANK);
    const distract = AGUA_ESTADOS_BANK.filter(function(a){ return a.estado!==item.estado; }).map(function(a){ return a.estado; });
    const opts = shuffle([item.estado].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿En qué estado está el agua?</p>',
      options: opts, correctValue: item.estado, speakText: item.label, cols:2, kind:'word', panel:true,
      explain: item.label+' es agua en estado <b>'+item.estado.toLowerCase()+'</b>.',
      recurso: recurso,
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
      recurso: recurso,
    };
  }
  const item = pick(AGUA_PROPIEDADES_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: en realidad, '+(item.texto.toLowerCase().indexOf('nunca')!==-1 ? 'el agua sí puede cambiar de forma según el recipiente' : 'el agua es transparente, no tiene color propio')+'.',
    recurso: recurso,
  };
}

export function genClima2Round(){
  const recurso = 'Para estudiar el clima de forma científica, no basta con "mirar hacia afuera" — se usan instrumentos especiales que miden datos exactos: el termómetro mide la temperatura, el pluviómetro mide cuánta lluvia cae, y la veleta mide la dirección del viento. Con estos datos, los meteorólogos pueden describir el <b>tiempo atmosférico</b> de un día (soleado, nublado, lluvioso, con viento) de forma precisa y comparable, no solo con una impresión personal. Aprender a usar instrumentos de medición, en vez de solo observar a simple vista, es una habilidad científica importante que se aplica en muchas áreas más allá del clima.';
  if(Math.random()<0.5){
    const item = pick(INSTRUMENTOS_CLIMA_BANK);
    const distract = INSTRUMENTOS_CLIMA_BANK.filter(function(i){ return i.label!==item.label; }).map(function(i){ return i.mide; });
    const opts = shuffle([item.mide].concat(distract)).map(function(m){ return {label:m, value:m}; });
    const visual = item.svg==='pluviometro' ? '<div class="shape-display">'+pluviometroSVG(90)+'</div>'
      : item.svg==='veleta' ? '<div class="shape-display">'+veletaSVG(90)+'</div>'
      : '<span class="prompt-emoji">'+item.emoji+'</span>';
    return {
      promptHTML: visual+'<p class="prompt-hint">¿Qué mide un(a) '+item.label.toLowerCase()+'?</p>',
      options: opts, correctValue: item.mide, speakText: item.label, cols:2, kind:'word', panel:true,
      explain: 'El/la '+item.label.toLowerCase()+' mide <b>'+item.mide.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(TIEMPO_ATMOSFERICO_BANK);
  const distract = TIEMPO_ATMOSFERICO_BANK.filter(function(t){ return t.tipo!==item.tipo; }).map(function(t){ return t.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto+'. ¿Qué tiempo atmosférico es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.texto, cols:4, kind:'word',
    explain: item.texto+', eso es <b>'+item.tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genSeresVivosRound(){
  const recurso = 'Un <b>ser vivo</b> es algo que nace, crece, se alimenta, respira y puede tener crías — como tú, un perro o una planta. Una piedra o un juguete no hacen nada de eso por sí solos: no necesitan comer ni respirar, por eso no están vivos. Los animales, además, tienen distintas cubiertas en su cuerpo que los ayudan a sobrevivir en su ambiente: el pelo y la lana los mantienen abrigados, las plumas les sirven para volar y aislarse del frío o la lluvia, y las escamas los protegen como una armadura. Fijarte en estas dos cosas — si algo cumple las funciones de un ser vivo, y cómo es su cuerpo por fuera — te ayuda a entender mejor a los animales y plantas que te rodean.';
  if(Math.random()<0.5){
    const item = pick(VIVOS_ITEMS);
    const opts = shuffle([{label:'Ser vivo', value:true},{label:'No es ser vivo', value:false}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Es un ser vivo o no?</p>',
      options: opts, correctValue: item.vivo, speakText: item.label, cols:2, panel:true,
      explain: item.vivo ? item.label+' crece, se alimenta y necesita aire y agua, por eso <b>es un ser vivo</b>.' : item.label+' no crece ni se alimenta por sí solo, por eso <b>no es un ser vivo</b>.',
      recurso: recurso,
    };
  }
  const item = pick(ANIMAL_COVER_ITEMS);
  const distract = shuffle(['Pelo','Plumas','Escamas','Piel','Lana'].filter(function(c){ return c!==item.cubierta; })).slice(0,3);
  const opts = shuffle([item.cubierta].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Qué cubre el cuerpo de este animal?</p>',
    options: opts, correctValue: item.cubierta, speakText: item.label, cols:4, kind:'word',
    explain: 'El '+item.label.toLowerCase()+' tiene el cuerpo cubierto de <b>'+item.cubierta.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genPlantasRound(){
  const recurso = 'Las plantas tienen partes que cumplen trabajos distintos, igual que tu cuerpo: la <b>raíz</b> la sostiene en la tierra y absorbe agua, el <b>tallo</b> lleva esa agua hacia arriba, las <b>hojas</b> fabrican el alimento de la planta usando la luz del sol, y muchas plantas además producen <b>flores</b> y <b>frutos</b> con semillas dentro, para poder crear nuevas plantitas. Comparar tamaños de frutos también te ayuda a observar la naturaleza con atención: fíjate no solo en cuál "parece" más grande a simple vista, sino en compararlos uno al lado del otro para estar seguro. Esta forma de observar con cuidado — mirar las partes de algo y comparar tamaños — es una habilidad científica que usarás una y otra vez en Ciencias Naturales.';
  if(Math.random()<0.5){
    const item = pick(PLANT_PARTS);
    const distract = shuffle(PLANT_PARTS.filter(function(p){ return p.part!==item.part; })).map(function(p){ return p.part; });
    const opts = shuffle([item.part].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.part, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa es la descripción de la <b>'+item.part.toLowerCase()+'</b> de la planta.',
      recurso: recurso,
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
    recurso: recurso,
  };
}

export function genCuerpoRound(){
  const recurso = 'Tus 5 sentidos (vista, oído, olfato, gusto y tacto) son la forma en que tu cuerpo recibe información del mundo: cada órgano está especializado en un solo trabajo — los ojos ven, los oídos escuchan, la nariz huele, la lengua saborea y la piel siente el tacto, el calor o el frío. Además de tener sentidos que funcionan bien, necesitas cuidar tu cuerpo con hábitos saludables: comer alimentos variados, dormir suficiente, lavarte las manos y hacer actividad física ayudan a que tu cuerpo (incluidos tus sentidos) funcione mejor cada día. Reconocer qué hábitos son buenos para ti es el primer paso para cuidarte solo, sin que un adulto tenga que recordártelo siempre.';
  if(Math.random()<0.5){
    const item = pick(SENTIDOS);
    const distract = shuffle(SENTIDOS.filter(function(s){ return s.sense!==item.sense; })).slice(0,3).map(function(s){ return s.sense; });
    const opts = shuffle([item.sense].concat(distract)).map(function(s){ return {label:s, value:s}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Para qué sirven tus '+item.organ.toLowerCase()+'?</p>',
      options: opts, correctValue: item.sense, speakText: '¿Para qué sirven tus '+item.organ+'?', cols:4, kind:'word',
      explain: 'Tus '+item.organ.toLowerCase()+' sirven para <b>'+item.sense.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(HABITOS_SALUDABLES);
  const opts = shuffle([{label:'Hábito saludable', value:true},{label:'No es saludable', value:false}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'</p>',
    options: opts, correctValue: item.bueno, speakText: item.label, cols:2, panel:true,
    explain: item.bueno ? item.label+' es un <b>hábito saludable</b> que cuida tu cuerpo.' : item.label+' <b>no es un hábito saludable</b>.',
    recurso: recurso,
  };
}

export function genMaterialesRound(){
  const recurso = 'Todos los objetos que usas están hechos de algún <b>material</b> (madera, metal, plástico, vidrio, tela), y cada material se elige según lo que necesita hacer el objeto: el vidrio es transparente para poder ver a través de una ventana, el metal es resistente para hacer ollas, la tela es suave y flexible para hacer ropa. Además, los materiales pueden <b>cambiar</b> cuando algo actúa sobre ellos: el calor puede derretir o cocinar algo, el agua puede mojar o disolver, y la fuerza puede romper o doblar un objeto. Reconocer de qué está hecho algo y qué causó un cambio en un material es una forma de entender mejor cómo funcionan las cosas que usas todos los días.';
  if(Math.random()<0.5){
    const item = pick(MATERIALES_ITEMS);
    const materialPool = MATERIALES_ITEMS.map(function(m){ return m.material; }).filter(function(v,i,arr){ return arr.indexOf(v)===i; });
    const distract = shuffle(materialPool.filter(function(m){ return m!==item.material; })).slice(0,3);
    const opts = shuffle([item.material].concat(distract)).map(function(m){ return {label:m, value:m}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿De qué material es '+item.object+'?</p>',
      options: opts, correctValue: item.material, speakText: item.object, cols:4, kind:'word',
      explain: item.object.charAt(0).toUpperCase()+item.object.slice(1)+' está hecho de <b>'+item.material.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(CAMBIOS_MATERIALES);
  const distract = shuffle(['Calor','Fuerza','Agua','Luz'].filter(function(c){ return c!==item.cause; })).slice(0,3);
  const opts = shuffle([item.cause].concat(distract)).map(function(c){ return {label:c, value:c}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.text+'. ¿Qué produjo este cambio?</p>',
    options: opts, correctValue: item.cause, speakText: item.text, cols:4, kind:'word',
    explain: item.text+' por el <b>'+item.cause.toLowerCase()+'</b>.',
    recurso: recurso,
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
  { parte:'Raíz', funcion:'Absorbe agua y nutrientes de la tierra y sostiene la planta', emoji:'🥕' },
  { parte:'Tallo', funcion:'Sostiene la planta y transporta el agua desde la raíz hasta las hojas', emoji:'🌱' },
  { parte:'Hojas', funcion:'Fabrican el alimento de la planta usando la luz del sol', emoji:'🌿' },
];
const PLANTAS_CHILE_BANK = [
  { emoji:'🌺', planta:'Copihue', tipo:'Flor nacional de chile' },
  { emoji:'🌲', planta:'Araucaria', tipo:'Árbol nativo de chile' },
  { emoji:'🌾', planta:'Trigo', tipo:'Cultivo para hacer pan y harina' },
  { emoji:'🌽', planta:'Maíz', tipo:'Cultivo para hacer choclo y harina' },
  { emoji:'🥔', planta:'Papa', tipo:'Cultivo que crece bajo la tierra' },
  { emoji:'🍇', planta:'Vid', tipo:'Cultivo para hacer uvas y vino' },
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
  { emoji:'🥦', alimento:'el brócoli', categoria:'Verdura' },
  { emoji:'🍎', alimento:'la manzana', categoria:'Fruta' },
  { emoji:'🍗', alimento:'el pollo', categoria:'Proteína' },
  { emoji:'🥛', alimento:'la leche', categoria:'Lácteo' },
  { emoji:'🍞', alimento:'el pan', categoria:'Cereal' },
  { emoji:'🍬', alimento:'el dulce', categoria:'Azúcar (consumo moderado)' },
];
const HIGIENE_ALIMENTOS_BANK = [
  { correcta:'Lavarse las manos antes de preparar o comer alimentos', incorrectas:['Cocinar sin lavarse las manos','Tocar la comida con las manos sucias','Estornudar sobre los alimentos'] },
  { correcta:'Lavar las frutas y verduras antes de comerlas', incorrectas:['Comer la fruta sin lavarla','Guardar la fruta sucia en el refrigerador','Cortar la fruta con utensilios sucios'] },
  { correcta:'Guardar los alimentos en el refrigerador para que no se echen a perder', incorrectas:['Dejar la comida cocinada afuera todo el día','Guardar la comida ya vencida','Mezclar comida cruda con comida cocinada'] },
];
const LUZ_FUENTES_BANK = [
  { emoji:'☀️', fuente:'el Sol', tipo:'Natural' },
  { emoji:'💡', fuente:'una ampolleta', tipo:'Artificial' },
  { emoji:'🔥', fuente:'el fuego', tipo:'Natural' },
  { emoji:'🔦', fuente:'una linterna', tipo:'Artificial' },
  { emoji:'🌟', fuente:'una estrella', tipo:'Natural' },
  { emoji:'🕯️', fuente:'una vela', tipo:'Artificial' },
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
  { emoji:'☀️', nombre:'El Sol', desc:'Es la estrella que está en el centro del Sistema Solar y nos da luz y calor' },
  { emoji:'🌍', nombre:'La Tierra', desc:'Es el planeta donde vivimos, el tercero más cercano al Sol' },
  { emoji:'🌙', nombre:'La Luna', desc:'Es el satélite natural que gira alrededor de la Tierra' },
  { emoji:'☄️', nombre:'Un cometa', desc:'Es un cuerpo helado que forma una cola brillante al acercarse al Sol' },
  { emoji:'🪐', nombre:'Un planeta con anillos', desc:'Como Saturno, un planeta rodeado de anillos de hielo y roca' },
];
const MOVIMIENTOS_TIERRA_BANK = [
  { pregunta:'¿Cómo se llama el movimiento de la Tierra que produce el día y la noche?', correcta:'Rotación', opts:['Traslación','Eclipse','Gravedad'] },
  { pregunta:'¿Cómo se llama el movimiento de la Tierra alrededor del Sol que dura un año?', correcta:'Traslación', opts:['Rotación','Eclipse','Gravedad'] },
  { pregunta:'¿Cuánto tiempo demora la Tierra en dar una vuelta completa sobre su propio eje?', correcta:'Un día (24 horas)', opts:['Un mes','Una semana','Un año'] },
  { pregunta:'¿Cuánto tiempo demora la Tierra en dar una vuelta completa alrededor del Sol?', correcta:'Un año', opts:['Un día','Una semana','Un mes'] },
];
const FASES_LUNA_BANK = [
  { emoji:'🌑', fase:'Luna nueva', desc:'No se ve la Luna iluminada desde la Tierra' },
  { emoji:'🌓', fase:'Cuarto creciente', desc:'Se ve la mitad de la Luna iluminada, creciendo' },
  { emoji:'🌕', fase:'Luna llena', desc:'Se ve todo el disco de la Luna iluminado' },
  { emoji:'🌗', fase:'Cuarto menguante', desc:'Se ve la mitad de la Luna iluminada, disminuyendo' },
];

export function genPlantas3Round(){
  const recurso = 'Cada parte de una planta cumple un trabajo específico para que la planta completa sobreviva: la <b>raíz</b> ancla la planta a la tierra y absorbe agua y nutrientes, el <b>tallo</b> transporta esa agua hacia arriba y sostiene a la planta, y las <b>hojas</b> usan la luz del sol para fabricar el alimento de la planta (un proceso llamado fotosíntesis). Además, Chile tiene especies de plantas propias y reconocibles, como el copihue (la flor nacional) o la araucaria, adaptadas a los distintos climas del país. Aprender las partes de una planta y reconocer especies chilenas te conecta con la naturaleza que te rodea, no solo con plantas genéricas de un libro.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(PARTES_PLANTA_BANK);
    const distract = shuffle(PARTES_PLANTA_BANK.filter(function(p){ return p.parte!==item.parte; })).map(function(p){ return p.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Cuál es la función de '+(item.parte==='Hojas'?'las':'la')+' '+item.parte.toLowerCase()+'?</p>',
      options: opts, correctValue: item.funcion, speakText: '¿Cuál es la función de la '+item.parte.toLowerCase()+'?', cols:2, panel:true,
      explain: (item.parte==='Hojas'?'Las':'La')+' '+item.parte.toLowerCase()+': '+item.funcion.toLowerCase()+'.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(PARTES_PLANTA_BANK);
    const distract = shuffle(PARTES_PLANTA_BANK.filter(function(p){ return p.parte!==item.parte; })).map(function(p){ return p.parte; });
    const opts = shuffle([item.parte].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.funcion+'</p><p class="prompt-hint">¿De qué parte de la planta se trata?</p>',
      options: opts, correctValue: item.parte, speakText: item.funcion, cols:4, kind:'word',
      explain: 'Esa es la función de '+(item.parte==='Hojas'?'las':'la')+' <b>'+item.parte.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(PLANTAS_CHILE_BANK);
  const distract = shuffle(PLANTAS_CHILE_BANK.filter(function(p){ return p.tipo!==item.tipo; })).slice(0,3).map(function(p){ return p.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.planta+'. ¿Qué es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.planta, cols:2, kind:'word', panel:true,
    explain: 'El/la <b>'+item.planta.toLowerCase()+'</b> es '+item.tipo.toLowerCase()+'.',
    recurso: recurso,
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
    recurso: 'El ciclo de vida de una planta comienza con una <b>semilla</b>, que germina cuando tiene suficiente agua, calor y tierra; luego crece como una planta joven (brote), después se convierte en una planta adulta que puede florecer, y finalmente produce nuevas semillas que reinician el ciclo. A diferencia de un objeto que no cambia con el tiempo, un ser vivo pasa por etapas ordenadas que no se pueden saltar ni invertir — una semilla no puede "volver atrás" a ser una flor. Entender este orden te ayuda a comprender cómo crecen las plantas que quizás cultivas en tu casa o en el colegio.',
  };
}

export function genCuidadoAmbiente3Round(){
  const item = pick(CUIDADO_AMBIENTE3_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar las plantas y el ambiente?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar las plantas y el ambiente?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a cuidar nuestro planeta.',
    recurso: 'Cuidar el ambiente significa tomar acciones concretas que protegen a las plantas, los animales y los recursos naturales de los que todos dependemos: regar con responsabilidad (sin desperdiciar agua), no cortar plantas innecesariamente, reciclar y no botar basura en espacios naturales, y respetar las áreas verdes. Estas acciones pueden parecer pequeñas hechas por una sola persona, pero cuando muchas personas las practican juntas, hacen una diferencia real para mantener un ambiente sano donde las plantas y los animales puedan seguir viviendo bien.',
  };
}

export function genAlimentacion3Round(){
  const recurso = 'Los alimentos se agrupan en categorías según los nutrientes que aportan a tu cuerpo (frutas y verduras, lácteos, proteínas, cereales), y comer variado —no siempre lo mismo— asegura que recibas todos los nutrientes que necesitas para crecer sano. Además de elegir bien qué comer, la <b>higiene con los alimentos</b> es igual de importante para prevenir enfermedades: lavar las frutas y verduras antes de comerlas, lavarte las manos antes de cocinar o comer, y mantener los alimentos bien guardados evita que bacterias dañinas lleguen a tu cuerpo. Una buena alimentación combina ambas cosas: elegir alimentos variados Y manipularlos con higiene.';
  if(Math.random()<0.5){
    const item = pick(ALIMENTOS3_BANK);
    const distract = shuffle(ALIMENTOS3_BANK.filter(function(a){ return a.categoria!==item.categoria; })).slice(0,3).map(function(a){ return a.categoria; });
    const opts = shuffle([item.categoria].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿A qué categoría pertenece '+item.alimento+'?</p>',
      options: opts, correctValue: item.categoria, speakText: '¿A qué categoría pertenece '+item.alimento+'?', cols:2, kind:'word', panel:true,
      explain: (item.alimento.charAt(0).toUpperCase()+item.alimento.slice(1))+' es un(a) <b>'+item.categoria.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(HIGIENE_ALIMENTOS_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena práctica de higiene con los alimentos?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena práctica de higiene con los alimentos?', cols:2, panel:true,
    explain: '"'+item.correcta+'" previene enfermedades.',
    recurso: recurso,
  };
}

export function genLuz3Round(){
  const recurso = 'La luz puede venir de <b>fuentes naturales</b> (el Sol, el fuego) o <b>fuentes artificiales</b> (una ampolleta, una linterna) creadas por el ser humano. La luz tiene propiedades que puedes comprobar tú mismo: viaja en línea recta (por eso una sombra tiene la misma forma que el objeto que la produce), y puede atravesar algunos materiales transparentes (como el vidrio) pero no otros opacos (como la madera), lo que forma sombras. Entender cómo se comporta la luz te ayuda a explicar fenómenos cotidianos, como por qué se forma una sombra o por qué no puedes ver a través de una pared.';
  if(Math.random()<0.5){
    const item = pick(LUZ_FUENTES_BANK);
    const opts = shuffle([{label:'Fuente natural', value:'Natural'},{label:'Fuente artificial', value:'Artificial'}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.fuente+'. ¿Es una fuente de luz natural o artificial?</p>',
      options: opts, correctValue: item.tipo, speakText: item.fuente, cols:2, panel:true,
      explain: item.fuente.charAt(0).toUpperCase()+item.fuente.slice(1)+' es una fuente de luz <b>'+item.tipo.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(LUZ_PROPIEDADES_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: la luz sí puede atravesar materiales transparentes como el vidrio, y viaja en línea recta, no en zigzag.',
    recurso: recurso,
  };
}

export function genSonido3Round(){
  const item = pick(SONIDO_PROPIEDADES_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: el sonido sí puede viajar por el agua, y se escucha más débil mientras más lejos está la fuente.',
    recurso: 'El sonido se produce por <b>vibraciones</b> que viajan a través de un medio (el aire, el agua, o incluso un objeto sólido) hasta llegar a tu oído. A diferencia de la luz, el sonido necesita un medio material para viajar —no puede viajar en el vacío del espacio, donde no hay aire—, pero sí puede viajar por el agua (por eso los sonidos se escuchan distinto bajo el agua). Mientras más lejos estés de donde se produjo el sonido, más débil lo escuchas, porque la vibración se va perdiendo energía a medida que se aleja de su origen.',
  };
}

export function genSistemaSolar3Round(){
  const recurso = 'El Sistema Solar está formado por el Sol (una estrella que da luz y calor propios) y todo lo que gira a su alrededor por su gravedad: planetas como la Tierra, satélites como la Luna, y otros cuerpos como cometas y asteroides. La Tierra tiene dos movimientos distintos y simultáneos: la <b>rotación</b> (gira sobre sí misma, produce el día y la noche, dura 24 horas) y la <b>traslación</b> (gira alrededor del Sol, dura un año). La Luna, por su parte, muestra distintas <b>fases</b> (luna nueva, creciente, llena, menguante) según cuánto de su superficie iluminada por el Sol podemos ver desde la Tierra, un ciclo que se repite aproximadamente cada mes.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(SISTEMA_SOLAR_BANK);
    const distract = shuffle(SISTEMA_SOLAR_BANK.filter(function(s){ return s.nombre!==item.nombre; })).slice(0,3).map(function(s){ return s.nombre; });
    const opts = shuffle([item.nombre].concat(distract)).map(function(n){ return {label:n, value:n}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'</p>',
      options: opts, correctValue: item.nombre, speakText: item.desc, cols:4, kind:'word',
      explain: 'Esa descripción corresponde a <b>'+item.nombre+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(MOVIMIENTOS_TIERRA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(FASES_LUNA_BANK);
  const distract = shuffle(FASES_LUNA_BANK.filter(function(f){ return f.fase!==item.fase; })).map(function(f){ return f.fase; });
  const opts = shuffle([item.fase].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+'. ¿Qué fase de la Luna es?</p>',
    options: opts, correctValue: item.fase, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Esa es la fase de <b>'+item.fase.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genDiaNocheRound(){
  const recurso = 'El día y la noche existen porque la Tierra gira sobre sí misma como un trompo (a esto se le llama <b>rotación</b>): cuando tu ciudad mira hacia el Sol, es de día; cuando la Tierra gira y tu ciudad queda mirando hacia el lado oscuro, es de noche. Una vuelta completa de este giro toma 24 horas, un día completo. Las <b>estaciones del año</b> (verano, otoño, invierno, primavera) cambian por un motivo distinto: la Tierra además viaja alrededor del Sol durante todo el año, y según en qué punto de ese recorrido esté, algunas zonas reciben más luz solar directa (más calor, verano) y otras reciben menos (más frío, invierno). Fijarte en pistas como la ropa que usa la gente o las actividades que hacen te ayuda a reconocer en qué momento del día o del año ocurre una escena.';
  if(Math.random()<0.5){
    const item = pick(DIA_NOCHE_ITEMS);
    const opts = shuffle([{label:'Día', value:'Día'},{label:'Noche', value:'Noche'}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Es de día o de noche?</p>',
      options: opts, correctValue: item.momento, speakText: item.label, cols:2, panel:true,
      explain: item.label+', eso pasa de <b>'+item.momento.toLowerCase()+'</b>.',
      recurso: recurso,
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
    recurso: recurso,
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
  { emoji:'🐦', elemento:'un pájaro', tipo:'Elemento vivo' },
  { emoji:'🌳', elemento:'un árbol', tipo:'Elemento vivo' },
  { emoji:'🦋', elemento:'una mariposa', tipo:'Elemento vivo' },
  { emoji: piedraSVG(30), elemento:'una roca', tipo:'Elemento no vivo' },
  { emoji:'💧', elemento:'el agua', tipo:'Elemento no vivo' },
  { emoji:'☀️', elemento:'la luz del sol', tipo:'Elemento no vivo' },
];
const ADAPTACIONES_BANK = [
  { emoji:'🦒', animal:'la jirafa', adaptacion:'Tiene el cuello largo para alcanzar hojas altas de los árboles' },
  { emoji:'🐫', animal:'el camello', adaptacion:'Almacena grasa en la joroba para sobrevivir sin agua por varios días' },
  { emoji:'🐧', animal:'el pingüino', adaptacion:'Tiene una capa de grasa gruesa que lo protege del frío extremo' },
  { emoji:'🦎', animal:'el camaleón', adaptacion:'Cambia de color para camuflarse y protegerse de depredadores' },
  { emoji:'🌵', animal:'el cactus', adaptacion:'Guarda agua en su tallo grueso para sobrevivir en el desierto' },
];
const CADENA_ALIMENTARIA_BANK = [
  { emoji:'🌱', rol:'Productor', desc:'Fabrica su propio alimento usando la luz del sol (como una planta)' },
  { emoji:'🐇', rol:'Consumidor', desc:'Se alimenta de otros seres vivos (como un animal herbívoro o carnívoro)' },
  { emoji:'🍄', rol:'Descomponedor', desc:'Descompone los restos de seres vivos muertos y devuelve nutrientes a la tierra' },
];
const CUIDADO_ECOSISTEMA_BANK = [
  { correcta:'Proteger los bosques nativos de Chile de la tala ilegal', incorrectas:['Talar árboles sin control','Quemar bosques para hacer espacio','Ignorar los incendios forestales'] },
  { correcta:'No contaminar los ríos y lagos con basura o químicos', incorrectas:['Botar basura a los ríos','Verter químicos en el agua','Ignorar la contaminación del agua'] },
  { correcta:'Proteger a los animales en peligro de extinción, como el huemul', incorrectas:['Cazar animales en peligro de extinción','Destruir su hábitat natural','Capturar animales silvestres como mascotas'] },
  { correcta:'Informarse y cuidar las especies nativas de tu región', incorrectas:['Introducir especies que no son de la zona sin cuidado','Ignorar el daño a especies nativas','Dañar el hábitat de especies locales'] },
];

const HUESOS_BANK = [
  { emoji:'💀', hueso:'El cráneo', funcion:'Protege el cerebro' },
  { emoji:'🦴', hueso:'Las costillas', funcion:'Protegen el corazón y los pulmones' },
  { emoji:'🦵', hueso:'El fémur', funcion:'Es el hueso más largo, está en el muslo y sostiene el peso del cuerpo' },
  { emoji:'🖐️', hueso:'Los huesos de la mano', funcion:'Permiten sujetar objetos con precisión' },
  { emoji:'🦴', hueso:'La columna vertebral', funcion:'Sostiene el cuerpo y protege la médula espinal' },
];
const MOVIMIENTO_CUERPO_BANK = [
  { pregunta:'¿Qué parte del cuerpo se contrae y se relaja para mover los huesos?', correcta:'Los músculos', opts:['Los tendones','La piel','La sangre'] },
  { pregunta:'¿Qué conecta a los músculos con los huesos?', correcta:'Los tendones', opts:['Los músculos','Los nervios','La piel'] },
  { pregunta:'¿Cómo se llama el punto donde se unen dos huesos y permite el movimiento?', correcta:'La articulación', opts:['El tendón','El músculo','El nervio'] },
];
const SISTEMA_NERVIOSO_BANK = [
  { emoji:'🧠', estructura:'El cerebro', funcion:'Controla el pensamiento, el movimiento y las emociones' },
  { emoji:'🦴', estructura:'La médula espinal', funcion:'Lleva las señales entre el cerebro y el resto del cuerpo' },
  { emoji:'⚡', estructura:'Los nervios', funcion:'Transmiten información entre el cerebro y todo el cuerpo' },
];

const ESTADOS_MATERIA4_BANK = [
  { emoji:'🧊', ejemplo:'un cubo de hielo', estado:'Sólido' },
  { emoji:'💧', ejemplo:'el agua líquida', estado:'Líquido' },
  { emoji:'💨', ejemplo:'el vapor de agua', estado:'Gaseoso' },
  { emoji: piedraSVG(30), ejemplo:'una piedra', estado:'Sólido' },
  { emoji:'🥛', ejemplo:'la leche', estado:'Líquido' },
  { emoji:'🎈', ejemplo:'el aire dentro de un globo', estado:'Gaseoso' },
];
const INSTRUMENTOS_MEDICION_BANK = [
  { emoji:'⚖️', instrumento:'La balanza', mide:'La masa' },
  { emoji:'🌡️', instrumento:'El termómetro', mide:'La temperatura' },
  { emoji:'🥤', instrumento:'La probeta (vaso graduado)', mide:'El volumen' },
];
const MATERIA_PROPIEDADES_BANK = [
  { texto:'Toda la materia tiene masa y ocupa un espacio', valor:true },
  { texto:'El aire no ocupa ningún espacio porque no se puede ver', valor:false },
  { texto:'Un objeto muy pequeño puede tener masa aunque no lo notemos', valor:true },
  { texto:'La materia solo existe en estado sólido', valor:false },
];

const FUERZA_EFECTOS_BANK = [
  { emoji:'⚽', texto:'Patear una pelota la hace moverse', efecto:'Cambia su movimiento' },
  { emoji:'🧲', texto:'Un imán atrae un clip de metal', efecto:'Cambia su movimiento' },
  { emoji: plasticinaSVG(30), texto:'Apretar la plasticina cambia su forma', efecto:'Cambia su forma' },
  { emoji:'🎈', texto:'Inflar un globo lo estira y cambia su forma', efecto:'Cambia su forma' },
];
const TIPOS_FUERZA_BANK = [
  { emoji:'🧲', texto:'La fuerza que atrae objetos de metal sin tocarlos', tipo:'Fuerza magnética' },
  { emoji:'🍎', texto:'La fuerza que hace que las cosas caigan hacia el suelo', tipo:'Fuerza de gravedad' },
  { emoji:'🤚', texto:'La fuerza que se hace al empujar o tirar de un objeto directamente', tipo:'Fuerza de contacto' },
  { emoji:'👟', texto:'La fuerza que frena un objeto al rozar con una superficie', tipo:'Fuerza de roce' },
];

const CAPAS_TIERRA_BANK = [
  { capa:'La corteza', desc:'Es la capa más externa y delgada, donde vivimos' },
  { capa:'El manto', desc:'Es la capa intermedia, muy caliente y en parte fundida' },
  { capa:'El núcleo', desc:'Es la capa más interna y caliente, en el centro de la Tierra' },
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
  const recurso = 'Un <b>ecosistema</b> es una comunidad de elementos vivos (plantas, animales, hongos) y no vivos (agua, luz solar, rocas) que interactúan entre sí en un mismo lugar. Los seres vivos que forman parte de él tienen <b>adaptaciones</b>: características especiales que les permiten sobrevivir en su ambiente (el cuello largo de la jirafa, la joroba del camello). Dentro de un ecosistema, la energía pasa de unos seres vivos a otros formando una <b>cadena alimentaria</b>: los productores (plantas) fabrican su propio alimento con luz solar, los consumidores (animales) se alimentan de otros seres vivos, y los descomponedores (hongos) devuelven los nutrientes a la tierra cuando algo muere. Cuidar los ecosistemas de Chile —bosques nativos, ríos, especies en peligro como el huemul— es esencial porque, si se rompe un eslabón de esta cadena, todo el ecosistema se ve afectado.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(ECOSISTEMA_ELEMENTOS_BANK);
    const opts = shuffle([{label:'Elemento vivo', value:'Elemento vivo'},{label:'Elemento no vivo', value:'Elemento no vivo'}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.elemento.charAt(0).toUpperCase()+item.elemento.slice(1)+'. ¿Es un elemento vivo o no vivo de un ecosistema?</p>',
      options: opts, correctValue: item.tipo, speakText: item.elemento, cols:2, panel:true,
      explain: (item.elemento.charAt(0).toUpperCase()+item.elemento.slice(1))+' es un <b>'+item.tipo.toLowerCase()+'</b>.',
      recurso: recurso,
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
      recurso: recurso,
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
      recurso: recurso,
    };
  }
  const item = pick(CUIDADO_ECOSISTEMA_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar los ecosistemas de Chile?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar los ecosistemas de Chile?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a proteger el ecosistema.',
    recurso: recurso,
  };
}

export function genCuerpoHumano4Round(){
  const recurso = 'El cuerpo humano se mueve gracias al trabajo conjunto de tres sistemas: el <b>esqueleto</b> (huesos que le dan forma y protegen órganos importantes, como el cráneo que protege el cerebro), los <b>músculos</b> (que se contraen y relajan para generar movimiento) y los <b>tendones</b> (que conectan los músculos a los huesos para que ese movimiento se transmita). El punto donde se unen dos huesos y permiten el movimiento se llama <b>articulación</b> (como la rodilla o el codo). Todo este movimiento, además, es controlado por el <b>sistema nervioso</b>: el cerebro decide qué hacer, la médula espinal transporta esa orden, y los nervios la llevan hasta el músculo exacto que debe moverse.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(HUESOS_BANK);
    const distract = shuffle(HUESOS_BANK.filter(function(h){ return h.hueso!==item.hueso; })).slice(0,3).map(function(h){ return h.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.hueso+'. ¿Cuál es su función principal?</p>',
      options: opts, correctValue: item.funcion, speakText: item.hueso, cols:2, panel:true,
      explain: item.hueso+': '+item.funcion.toLowerCase()+'.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const item = pick(MOVIMIENTO_CUERPO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word',
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(SISTEMA_NERVIOSO_BANK);
  const distract = shuffle(SISTEMA_NERVIOSO_BANK.filter(function(s){ return s.estructura!==item.estructura; })).map(function(s){ return s.funcion; });
  const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.estructura+'. ¿Cuál es su función?</p>',
    options: opts, correctValue: item.funcion, speakText: item.estructura, cols:2, panel:true,
    explain: item.estructura+': '+item.funcion.toLowerCase()+'.',
    recurso: recurso,
  };
}

export function genMateria4Round(){
  const recurso = 'Toda la <b>materia</b> (todo lo que existe a tu alrededor, incluido el aire que no puedes ver) tiene dos propiedades fundamentales: tiene <b>masa</b> (una cantidad de "materia" que se puede pesar) y <b>ocupa espacio</b> (un volumen). La materia existe en tres <b>estados</b>: sólido (forma fija, como el hielo), líquido (toma la forma de su recipiente, como el agua) y gaseoso (se expande y llena todo el espacio disponible, como el vapor o el aire). Para medir estas propiedades usamos <b>instrumentos</b> específicos: una balanza mide la masa, un termómetro mide la temperatura, y una probeta (vaso graduado) mide el volumen de un líquido.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(ESTADOS_MATERIA4_BANK);
    const distract = shuffle(['Sólido','Líquido','Gaseoso'].filter(function(e){ return e!==item.estado; }));
    const opts = shuffle([item.estado].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+(item.ejemplo.charAt(0).toUpperCase()+item.ejemplo.slice(1))+'. ¿En qué estado de la materia está?</p>',
      options: opts, correctValue: item.estado, speakText: item.ejemplo, cols:2, kind:'word', panel:true,
      explain: (item.ejemplo.charAt(0).toUpperCase()+item.ejemplo.slice(1))+' está en estado <b>'+item.estado.toLowerCase()+'</b>.',
      recurso: recurso,
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
      recurso: recurso,
    };
  }
  const item = pick(MATERIA_PROPIEDADES_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.texto+'</p>',
    options: opts, correctValue: item.valor, speakText: item.texto, cols:2, panel:true,
    explain: item.valor ? 'Es verdadero: '+item.texto.toLowerCase()+'.' : 'Es falso: toda la materia (incluido el aire) ocupa espacio y tiene masa, y existe en más de un estado.',
    recurso: recurso,
  };
}

export function genFuerzas4Round(){
  const recurso = 'Una <b>fuerza</b> es una acción capaz de producir dos efectos sobre un objeto: <b>cambiar su movimiento</b> (hacer que empiece a moverse, se detenga, o cambie de dirección — como patear una pelota) o <b>cambiar su forma</b> (deformarlo — como apretar la plasticina). Existen distintos tipos de fuerza según cómo actúan: la <b>fuerza de contacto</b> requiere tocar el objeto directamente (empujar, tirar), la <b>fuerza magnética</b> atrae objetos de metal sin tocarlos, la <b>fuerza de gravedad</b> atrae todo hacia el centro de la Tierra (por eso las cosas caen), y la <b>fuerza de roce</b> frena el movimiento cuando dos superficies se rozan entre sí.';
  if(Math.random()<0.5){
    /* Solo existen 2 categorías reales de efecto (cambia movimiento / cambia
       forma) — antes se armaban 4 opciones filtrando el banco, pero con
       solo 1 categoría "distinta" disponible eso dejaba 2 opciones
       idénticas repetidas. Al ser una clasificación binaria real, la
       pregunta usa 2 opciones, no 4. */
    const item = pick(FUERZA_EFECTOS_BANK);
    const otroEfecto = ['Cambia su movimiento','Cambia su forma'].filter(function(e){ return e!==item.efecto; })[0];
    const opts = shuffle([{label:item.efecto, value:item.efecto},{label:otroEfecto, value:otroEfecto}]);
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.texto+'. ¿Qué efecto de la fuerza es?</p>',
      options: opts, correctValue: item.efecto, speakText: item.texto, cols:2, kind:'word', panel:true,
      explain: item.texto+': la fuerza <b>'+item.efecto.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(TIPOS_FUERZA_BANK);
  const distract = shuffle(TIPOS_FUERZA_BANK.filter(function(t){ return t.tipo!==item.tipo; })).map(function(t){ return t.tipo; });
  const opts = shuffle([item.tipo].concat(distract)).map(function(t){ return {label:t, value:t}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'.</p><p class="prompt-hint">¿Qué tipo de fuerza es?</p>',
    options: opts, correctValue: item.tipo, speakText: item.texto, cols:2, kind:'word', panel:true,
    explain: 'Esa es la <b>'+item.tipo.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

export function genTierra4Round(){
  const recurso = 'La Tierra está formada por tres <b>capas</b> concéntricas: la <b>corteza</b> (la más externa y delgada, donde vivimos), el <b>manto</b> (una capa intermedia enorme, muy caliente y en parte fundida) y el <b>núcleo</b> (la capa más interna y caliente, en el centro del planeta). La corteza no es una sola pieza continua: está dividida en <b>placas tectónicas</b>, bloques enormes que se mueven muy lentamente — cuando dos placas chocan o se rozan, esa energía puede liberarse como un terremoto o, con el paso de millones de años, formar montañas. Por eso es importante saber cómo prevenir riesgos naturales: conocer las zonas seguras de tu casa o escuela, tener un kit de emergencia, y alejarte de la costa si sientes un temblor fuerte cerca del mar.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(CAPAS_TIERRA_BANK);
    const distract = shuffle(CAPAS_TIERRA_BANK.filter(function(c){ return c.capa!==item.capa; })).map(function(c){ return c.capa; });
    const opts = shuffle([item.capa].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué capa de la Tierra es?</p>',
      options: opts, correctValue: item.capa, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: item.capa+': '+item.desc.toLowerCase()+'.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const item = pick(PLACAS_TECTONICAS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es "'+item.correcta+'".',
      recurso: recurso,
    };
  }
  const item = pick(RIESGOS_NATURALES_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una buena medida de prevención ante riesgos naturales?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una buena medida de prevención ante riesgos naturales?', cols:2, panel:true,
    explain: '"'+item.correcta+'" te ayuda a estar más seguro ante un riesgo natural.',
    recurso: recurso,
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
  { pregunta:'¿Cuál es la unidad básica que forma a todos los seres vivos?', correcta:'La célula', opts:['El órgano','El tejido','El hueso'] },
  { pregunta:'Una bacteria está formada por una sola célula. ¿Cómo se llama este tipo de ser vivo?', correcta:'Unicelular', opts:['Multicelular','Pluricelular','Sin células'] },
  { pregunta:'Un ser humano está formado por billones de células trabajando juntas. ¿Cómo se llama este tipo de ser vivo?', correcta:'Multicelular', opts:['Unicelular','Monocelular','Acelular'] },
  { pregunta:'Una planta también está formada por muchas células. ¿Cómo se llama este tipo de ser vivo?', correcta:'Multicelular', opts:['Unicelular','Sin células','Monocelular'] },
];
const DIGESTIVO_BANK = [
  { parte:'La boca', funcion:'Triturar y comenzar a descomponer el alimento' },
  { parte:'El esófago', funcion:'Transportar el alimento hacia el estómago' },
  { parte:'El estómago', funcion:'Descomponer el alimento con jugos gástricos' },
  { parte:'El intestino delgado', funcion:'Absorber los nutrientes del alimento' },
];
const RESPIRATORIO_BANK = [
  { parte:'La nariz', funcion:'Filtrar y calentar el aire que respiramos' },
  { parte:'La tráquea', funcion:'Conducir el aire hacia los pulmones' },
  { parte:'Los pulmones', funcion:'Intercambiar oxígeno y dióxido de carbono con la sangre' },
];
const CIRCULATORIO_BANK = [
  { parte:'El corazón', funcion:'Bombear la sangre por todo el cuerpo' },
  { parte:'Las arterias', funcion:'Llevar sangre desde el corazón hacia el resto del cuerpo' },
  { parte:'Las venas', funcion:'Llevar sangre de vuelta hacia el corazón' },
];
function sistemaRound(bank, sistemaLabel, recurso){
  const item = pick(bank);
  const distract = shuffle(bank.filter(function(b){ return b.funcion!==item.funcion; })).map(function(b){ return b.funcion; });
  const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
  return {
    promptHTML: '<p class="prompt-word">'+item.parte+'</p><p class="prompt-hint">Esta parte pertenece al sistema '+sistemaLabel+'. ¿Cuál es su función principal?</p>',
    options: opts, correctValue: item.funcion, speakText: item.parte, cols:2, panel:true,
    explain: item.parte+': '+item.funcion.toLowerCase()+'.', recurso: recurso,
  };
}
export function genCelulaSistemas5Round(){
  const recurso = 'Todos los seres vivos están formados por <b>células</b>, la unidad básica de la vida — algunos organismos tienen una sola célula (unicelulares) y otros, como los humanos, tienen billones trabajando juntas (multicelulares). El cuerpo humano funciona gracias a sistemas que colaboran entre sí: el <b>sistema digestivo</b> transforma los alimentos en nutrientes que el cuerpo puede usar, el <b>sistema respiratorio</b> toma el oxígeno del aire y elimina el dióxido de carbono, y el <b>sistema circulatorio</b> transporta la sangre (con oxígeno y nutrientes) a todo el cuerpo a través del corazón y los vasos sanguíneos.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(CELULA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
      explain: 'La respuesta correcta es <b>'+item.correcta+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.5) return sistemaRound(DIGESTIVO_BANK,'digestivo',recurso);
  if(roll<0.75) return sistemaRound(RESPIRATORIO_BANK,'respiratorio',recurso);
  return sistemaRound(CIRCULATORIO_BANK,'circulatorio',recurso);
}

const CONSUMO_ALIMENTOS_BANK = [
  { pregunta:'Los alimentos ricos en proteínas, como la carne, el huevo y las legumbres, ayudan principalmente a...', correcta:'Crecer y reparar los tejidos del cuerpo', opts:['Dar solo sabor dulce a las comidas','Enfriar el cuerpo','Evitar que te dé sueño'] },
  { pregunta:'Los alimentos ricos en carbohidratos, como el pan, el arroz y la papa, entregan principalmente...', correcta:'Energía para las actividades diarias', opts:['Calcio para los huesos','Protección contra el frío','Color a la piel'] },
  { pregunta:'Comer frutas y verduras variadas todos los días ayuda principalmente a...', correcta:'Entregar vitaminas y minerales que el cuerpo necesita', opts:['Hacer que crezca el cabello más rápido','Reemplazar la necesidad de dormir','Evitar tener que hacer ejercicio'] },
  { pregunta:'¿Por qué es importante comer alimentos variados y no solo un tipo de comida?', correcta:'Porque cada grupo de alimentos aporta nutrientes distintos que el cuerpo necesita', opts:['Porque así la comida es más barata','Porque así se ocupan menos platos','Porque el cuerpo solo necesita un nutriente'] },
];
const CIGARRILLO_BANK = [
  { pregunta:'¿Qué órgano resulta dañado principalmente por el humo del cigarrillo?', correcta:'Los pulmones', opts:['Los huesos','Las uñas','El cabello'] },
  { pregunta:'El cigarrillo contiene una sustancia llamada nicotina, que puede generar en quien fuma...', correcta:'Adicción, es decir, una necesidad difícil de controlar de seguir fumando', opts:['Más energía para hacer deporte','Mejor visión nocturna','Más apetito por verduras'] },
  { pregunta:'¿Qué le puede pasar a una persona que fuma durante muchos años?', correcta:'Puede desarrollar enfermedades respiratorias graves', opts:['Mejora su capacidad pulmonar','No le afecta en nada a su salud','Crece más rápido'] },
  { pregunta:'¿Por qué respirar el humo de alguien que fuma cerca (fumador pasivo) también es dañino?', correcta:'Porque ese humo también contiene sustancias dañinas para quien lo respira', opts:['Porque huele mal, pero no hace daño','Porque solo afecta a quien fuma directamente','Porque mejora la calidad del aire'] },
];
const MICROORGANISMOS_BANK = [
  { nombre:'Las bacterias que transforman la leche en yogur', tipo:'Beneficioso' },
  { nombre:'La levadura que hace crecer el pan', tipo:'Beneficioso' },
  { nombre:'El moho que aparece en el pan viejo', tipo:'Dañino' },
  { nombre:'Las bacterias que causan una infección a la garganta', tipo:'Dañino' },
  { nombre:'Las bacterias que ayudan a la digestión en el intestino', tipo:'Beneficioso' },
  { nombre:'El virus que causa el resfrío común', tipo:'Dañino' },
];
export function genAlimentacionSalud5Round(){
  const recurso = 'Una alimentación saludable combina distintos grupos de alimentos porque cada uno aporta algo distinto: las <b>proteínas</b> (carne, huevo, legumbres) ayudan a crecer y reparar el cuerpo, los <b>carbohidratos</b> (pan, arroz, papa) entregan energía para el día a día, y las <b>frutas y verduras</b> aportan vitaminas y minerales. El cigarrillo daña principalmente los pulmones y contiene nicotina, una sustancia que genera adicción. No todos los microorganismos son dañinos: algunos, como las bacterias que transforman la leche en yogur, son beneficiosos y hasta se usan para preparar alimentos.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CONSUMO_ALIMENTOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(CIGARRILLO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
    };
  }
  const item = pick(MICROORGANISMOS_BANK);
  const opts = shuffle([{label:'Beneficioso para la salud', value:'Beneficioso'},{label:'Dañino para la salud', value:'Dañino'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.nombre+'</p><p class="prompt-hint">¿Este microorganismo es beneficioso o dañino para la salud?</p>',
    options: opts, correctValue: item.tipo, speakText: item.nombre, cols:2, panel:true,
    explain: 'Es <b>'+item.tipo.toLowerCase()+'</b> para la salud.', recurso: recurso,
  };
}

const TRANSFORMACION_ELECTRICA_BANK = [
  { objeto:'Una ampolleta encendida', correcta:'Luz y calor', opts:['Sonido','Movimiento','Frío'] },
  { objeto:'Un parlante reproduciendo música', correcta:'Sonido', opts:['Luz','Frío','Olor'] },
  { objeto:'Un ventilador encendido', correcta:'Movimiento', opts:['Sonido solamente','Luz solamente','Olor'] },
  { objeto:'Una plancha de ropa encendida', correcta:'Calor', opts:['Sonido','Frío','Luz de colores'] },
];
const CIRCUITO_BANK = [
  { componente:'La pila', funcion:'Entregar la energía eléctrica al circuito' },
  { componente:'El cable', funcion:'Conducir la corriente eléctrica entre los componentes' },
  { componente:'El interruptor', funcion:'Abrir o cerrar el paso de la corriente' },
  { componente:'La ampolleta', funcion:'Transformar la electricidad en luz' },
];
const CONDUCTORES_AISLANTES_BANK = [
  { material:'El cobre (un metal)', conductor:true }, { material:'El aluminio (un metal)', conductor:true },
  { material:'El agua con sal', conductor:true }, { material:'La madera seca', conductor:false },
  { material:'El plástico', conductor:false }, { material:'El vidrio', conductor:false },
  { material:'La goma (caucho)', conductor:false }, { material:'El papel', conductor:false },
];
const AHORRO_ENERGIA_BANK = [
  { accion:'Apagar las luces al salir de una habitación vacía', ahorra:true },
  { accion:'Desconectar los aparatos que no se están usando', ahorra:true },
  { accion:'Usar ampolletas de bajo consumo (LED)', ahorra:true },
  { accion:'Dejar el televisor encendido toda la noche sin verlo', ahorra:false },
  { accion:'Dejar la puerta del refrigerador abierta por mucho rato', ahorra:false },
  { accion:'Aprovechar la luz natural durante el día en vez de encender luces', ahorra:true },
];
export function genElectricidad5Round(){
  const recurso = 'La energía eléctrica se puede <b>transformar</b> en otros tipos de energía: luz y calor en una ampolleta, sonido en un parlante, movimiento en un ventilador. Un <b>circuito eléctrico simple</b> necesita una pila (entrega la energía), cables (conducen la corriente) y un interruptor (abre o cierra el paso de la corriente) para que la electricidad pueda circular. Los materiales <b>conductores</b> (como los metales o el agua con sal) dejan pasar la corriente eléctrica, mientras que los <b>aislantes</b> (como la madera, el plástico o el vidrio) no la dejan pasar — por eso los cables tienen un forro de plástico. Ahorrar energía (apagar luces, desconectar aparatos) cuida tanto el medioambiente como el gasto en la casa.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(TRANSFORMACION_ELECTRICA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.objeto+'</p><p class="prompt-hint">¿En qué transforma principalmente la energía eléctrica?</p>',
      options: opts, correctValue: item.correcta, speakText: item.objeto, cols:2, kind:'word', panel:true,
      explain: 'Transforma la electricidad en <b>'+item.correcta.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(CIRCUITO_BANK);
    const distract = shuffle(CIRCUITO_BANK.filter(function(c){ return c.funcion!==item.funcion; })).map(function(c){ return c.funcion; });
    const opts = shuffle([item.funcion].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-word">'+item.componente+'</p><p class="prompt-hint">En un circuito eléctrico simple, ¿cuál es la función de esta parte?</p>',
      options: opts, correctValue: item.funcion, speakText: item.componente, cols:2, panel:true,
      explain: item.componente+': '+item.funcion.toLowerCase()+'.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const item = pick(CONDUCTORES_AISLANTES_BANK);
    const opts = shuffle([{label:'Es conductor (deja pasar la electricidad)', value:true},{label:'Es aislante (no deja pasar la electricidad)', value:false}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.material+'</p><p class="prompt-hint">¿Este material es conductor o aislante de la electricidad?</p>',
      options: opts, correctValue: item.conductor, speakText: item.material, cols:2, panel:true,
      explain: item.conductor ? item.material+' es <b>conductor</b>: deja pasar la corriente eléctrica.' : item.material+' es <b>aislante</b>: no deja pasar la corriente eléctrica.', recurso: recurso,
    };
  }
  const item = pick(AHORRO_ENERGIA_BANK);
  const opts = shuffle([{label:'Sí ayuda a ahorrar energía', value:true},{label:'No ayuda a ahorrar energía', value:false}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.accion+'</p><p class="prompt-hint">¿Esta acción ayuda a ahorrar energía eléctrica?</p>',
    options: opts, correctValue: item.ahorra, speakText: item.accion, cols:2, panel:true,
    explain: item.ahorra ? 'Sí: '+item.accion.toLowerCase()+' ayuda a ahorrar energía.' : 'No: '+item.accion.toLowerCase()+' desperdicia energía.', recurso: recurso,
  };
}

const DISTRIBUCION_AGUA_BANK = [
  { pregunta:'¿Dónde se encuentra la mayor parte del agua de nuestro planeta?', correcta:'En los océanos (agua salada)', opts:['En los ríos (agua dulce)','En los glaciares solamente','En las nubes solamente'] },
  { pregunta:'¿Qué tipo de agua es la que podemos beber directamente sin procesarla mucho?', correcta:'El agua dulce', opts:['El agua salada de mar','El agua de mar hirviendo','Ningún tipo de agua es potable'] },
  { pregunta:'¿Por qué el agua dulce es un recurso que se debe cuidar, aunque parezca abundante?', correcta:'Porque solo es una pequeña parte de toda el agua del planeta', opts:['Porque no existe en ningún lugar','Porque es más abundante que el agua salada','Porque nunca se puede contaminar'] },
];
const OCEANOS_LAGOS_BANK = [
  { caracteristica:'Tiene agua salada y mareas', tipo:'Océano' },
  { caracteristica:'Generalmente tiene agua dulce y está rodeado de tierra por todos lados', tipo:'Lago' },
  { caracteristica:'Es la masa de agua más grande y profunda del planeta', tipo:'Océano' },
  { caracteristica:'Suele ser más pequeño y no está conectado directamente con el mar', tipo:'Lago' },
];
const PROTECCION_AGUA_BANK = [
  { accion:'Botar basura o químicos a un río', protege:false },
  { accion:'No desperdiciar agua potable en la casa', protege:true },
  { accion:'Limpiar la orilla de un lago de basura', protege:true },
  { accion:'Verter aceite de cocina por el desagüe hacia los ríos', protege:false },
  { accion:'Cuidar que las fábricas no contaminen los cuerpos de agua', protege:true },
];
export function genAguaTierra5Round(){
  const recurso = 'Casi toda el agua del planeta está en los océanos, en forma de <b>agua salada</b> — el agua dulce, la que podemos beber, es solo una pequeña parte del total, repartida en ríos, lagos, glaciares y aguas subterráneas. Un <b>océano</b> es una masa de agua salada enorme y profunda con mareas, mientras que un <b>lago</b> suele ser más pequeño, con agua dulce y rodeado de tierra. Como el agua dulce es escasa, cuidarla (no desperdiciarla, no contaminarla con basura o químicos) es fundamental para que siga estando disponible para todos los seres vivos.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(DISTRIBUCION_AGUA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(OCEANOS_LAGOS_BANK);
    const opts = shuffle([{label:'Océano', value:'Océano'},{label:'Lago', value:'Lago'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caracteristica+'</p><p class="prompt-hint">¿Es una característica de un océano o de un lago?</p>',
      options: opts, correctValue: item.tipo, speakText: item.caracteristica, cols:2, kind:'word',
      explain: 'Esta es una característica típica de un(a) <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(PROTECCION_AGUA_BANK);
  const opts = shuffle([{label:'Sí protege los cuerpos de agua', value:true},{label:'No protege, los daña', value:false}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.accion+'</p><p class="prompt-hint">¿Esta acción protege los cuerpos de agua o los daña?</p>',
    options: opts, correctValue: item.protege, speakText: item.accion, cols:2, panel:true,
    explain: item.protege ? 'Sí: esta acción ayuda a proteger los cuerpos de agua.' : 'No: esta acción daña o contamina los cuerpos de agua.', recurso: recurso,
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
  { pregunta:'¿Qué necesita una planta para realizar la fotosíntesis?', correcta:'Agua, dióxido de carbono y luz solar', opts:['Solo agua y oscuridad','Solo tierra y aire frío','Solo semillas y viento'] },
  { pregunta:'¿Qué produce la fotosíntesis, además del azúcar que alimenta a la planta?', correcta:'Oxígeno', opts:['Dióxido de carbono solamente','Agua solamente','Nitrógeno'] },
  { pregunta:'¿En qué parte de la planta ocurre principalmente la fotosíntesis?', correcta:'En las hojas', opts:['En las raíces','En las semillas','En la corteza del tronco'] },
  { pregunta:'¿Qué le pasaría a una planta si nunca recibiera luz solar?', correcta:'No podría realizar la fotosíntesis y moriría', opts:['Crecería más rápido que nunca','Le saldrían más flores','No le afectaría en nada'] },
];
const CADENA_ALIMENTARIA6_BANK = [
  { cadena:['Pasto','Conejo','Zorro'] },
  { cadena:['Algas','Pez pequeño','Pez grande'] },
  { cadena:['Trigo','Ratón','Búho'] },
  { cadena:['Fitoplancton','Krill','Ballena'] },
];
const ROLES_CADENA = ['Productor (hace su propio alimento)','Consumidor primario (se alimenta del productor)','Consumidor secundario (se alimenta de otro consumidor)'];
const IMPACTO_HUMANO_BANK = [
  { afirmacion:'Talar un bosque puede eliminar la fuente de alimento de muchos animales', v:true },
  { afirmacion:'Sobrepescar una especie puede afectar a los depredadores que se alimentan de ella', v:true },
  { afirmacion:'Introducir una especie que no es nativa de un lugar nunca afecta a las redes alimentarias locales', v:false },
  { afirmacion:'Contaminar un río puede afectar a toda la cadena alimentaria que depende de esa agua', v:true },
  { afirmacion:'Las acciones humanas nunca tienen ningún efecto sobre las redes alimentarias naturales', v:false },
];
export function genFotosintesisCadenas6Round(){
  const recurso = 'La <b>fotosíntesis</b> es el proceso mediante el cual las plantas usan la luz del sol, agua y dióxido de carbono para fabricar su propio alimento y liberar oxígeno — por eso son los <b>productores</b> de toda cadena alimentaria. Los <b>consumidores primarios</b> se alimentan de esos productores, y los <b>consumidores secundarios</b> se alimentan de otros consumidores. Como todos los organismos de un ecosistema están conectados en esta cadena, una acción humana (talar un bosque, contaminar un río, introducir una especie que no es nativa) puede alterar el equilibrio de toda la red, no solo del organismo directamente afectado.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(FOTOSINTESIS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
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
      explain: '"'+organismo+'" es el <b>'+correct.toLowerCase()+'</b> en esta cadena.', recurso: recurso,
    };
  }
  const item = pick(IMPACTO_HUMANO_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
    options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  { pregunta:'¿Cuál es la función principal de los ovarios en el sistema reproductor femenino?', correcta:'Producir óvulos', opts:['Digerir los alimentos','Bombear la sangre','Filtrar el aire'] },
  { pregunta:'¿Cuál es la función principal de los testículos en el sistema reproductor masculino?', correcta:'Producir espermatozoides', opts:['Digerir los alimentos','Bombear la sangre','Filtrar el aire'] },
  { pregunta:'¿En qué órgano del sistema reproductor femenino se desarrolla un bebé durante el embarazo?', correcta:'En el útero', opts:['En el estómago','En los pulmones','En el corazón'] },
  { pregunta:'¿Qué es la menstruación?', correcta:'La eliminación mensual del revestimiento del útero cuando no hay embarazo', opts:['Una enfermedad que hay que curar','Un problema digestivo','Una señal de que algo anda mal'] },
  { pregunta:'¿Cuál es la función general del sistema reproductor humano?', correcta:'Permitir la reproducción y continuidad de la especie humana', opts:['Ayudar a respirar','Ayudar a digerir los alimentos','Bombear la sangre por el cuerpo'] },
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
  const recurso = 'El sistema reproductor femenino y masculino cumplen una función biológica: producir óvulos y espermatozoides, y permitir la reproducción humana. La <b>pubertad</b> es la etapa del desarrollo en que el cuerpo empieza a madurar hacia la adultez, y trae cambios físicos observables (crecimiento acelerado, cambios de voz, aparición de vello corporal, inicio de la menstruación en las niñas) que son normales y esperables. Cada persona vive estos cambios a un ritmo distinto, y también es normal sentir emociones más intensas o cambiantes durante esta etapa.';
  if(Math.random()<0.5){
    const item = pick(SISTEMA_REPRODUCTOR_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
    };
  }
  const item = pick(PUBERTAD_CAMBIOS_BANK);
  const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
  return {
    promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
    options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
    explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
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
  { pregunta:'¿Cuál es un efecto nocivo del consumo de tabaco en el cuerpo?', correcta:'Daña los pulmones y el corazón', opts:['Mejora la capacidad pulmonar','Fortalece el sistema inmune','Ayuda a dormir mejor'] },
  { pregunta:'¿Cuál es un efecto nocivo del consumo de alcohol en el cuerpo?', correcta:'Afecta el hígado y el sistema nervioso', opts:['Fortalece los huesos','Mejora la concentración','Ayuda a la digestión'] },
  { pregunta:'¿Cuál de estas es una conducta de protección frente a las drogas?', correcta:'Rodearse de amistades que respeten tus decisiones', opts:['Probar cualquier cosa que ofrezca un amigo','Ignorar los consejos de la familia','Guardar el problema en secreto siempre'] },
  { pregunta:'¿Qué factor ayuda a prevenir el consumo de drogas en la adolescencia?', correcta:'Tener una buena comunicación con la familia', opts:['Aislarse de la familia por completo','Evitar hablar de cualquier problema','Seguir siempre la presión de un grupo'] },
];
export function genHabitosSaludables6Round(){
  const recurso = 'El cuerpo durante el crecimiento necesita cuidados constantes: higiene regular, alimentación variada, sueño suficiente y actividad física. El tabaco y el alcohol son sustancias que dañan órganos concretos del cuerpo (pulmones, corazón, hígado, sistema nervioso) — conocer sus efectos reales, y no solo que "hacen mal", ayuda a entender por qué evitarlas. Factores protectores como una buena comunicación familiar y rodearse de amistades que respeten las propias decisiones son herramientas reales de prevención, no solo consejos genéricos.';
  if(Math.random()<0.5){
    const item = pick(HABITOS_CRECIMIENTO_BANK);
    const opts = shuffle([{label:'Verdadero', value:true},{label:'Falso', value:false}]);
    return {
      promptHTML: '<p class="prompt-hint">'+item.afirmacion+'</p>',
      options: opts, correctValue: item.v, speakText: item.afirmacion, cols:2, panel:true,
      explain: item.v ? 'Esa afirmación es <b>verdadera</b>.' : 'Esa afirmación es <b>falsa</b>.', recurso: recurso,
    };
  }
  const item = pick(DROGAS_EFECTOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
  };
}

const TRANSFORMACION_ENERGIA6_BANK = [
  { objeto:'Una vela encendida', correcta:'Luz y calor', opts:['Sonido','Movimiento','Frío'] },
  { objeto:'Un panel solar', correcta:'Energía eléctrica', opts:['Sonido','Olor','Frío'] },
  { objeto:'Un molino de viento (aerogenerador)', correcta:'Energía eléctrica o mecánica', opts:['Luz solamente','Olor','Frío'] },
  { objeto:'Una pila que enciende una linterna', correcta:'Energía química a energía eléctrica y luz', opts:['Energía sonora a energía solar','Frío a calor','Movimiento a olor'] },
];
const RECURSOS_RENOVABLES6_BANK = [
  { recurso:'Energía solar', tipo:'Renovable' }, { recurso:'Energía eólica (viento)', tipo:'Renovable' },
  { recurso:'Energía hidráulica (agua)', tipo:'Renovable' }, { recurso:'El petróleo', tipo:'No renovable' },
  { recurso:'El carbón', tipo:'No renovable' }, { recurso:'El gas natural', tipo:'No renovable' },
];
const USO_RESPONSABLE_ENERGIA_BANK = [
  { accion:'Usar la bicicleta o caminar para trayectos cortos en vez del auto', ayuda:true },
  { accion:'Usar electrodomésticos eficientes que consuman menos energía', ayuda:true },
  { accion:'Dejar todas las luces de la casa encendidas todo el día sin necesidad', ayuda:false },
  { accion:'Compartir el auto con otras personas que van al mismo lugar (carpool)', ayuda:true },
  { accion:'Usar el auto para recorrer distancias muy cortas que se podrían caminar', ayuda:false },
];
export function genEnergiaTransformaciones6Round(){
  const recurso = 'La energía nunca desaparece: se <b>transforma</b> de un tipo a otro (una vela transforma energía química en luz y calor; un panel solar transforma luz en electricidad). Los recursos energéticos se dividen en <b>renovables</b> (sol, viento, agua — se regeneran naturalmente y no se agotan) y <b>no renovables</b> (petróleo, carbón, gas natural — tardan millones de años en formarse y se agotan con el uso). Usar la energía de forma responsable —apagar luces innecesarias, elegir electrodomésticos eficientes, compartir el auto— ayuda a que los recursos duren más y se dañe menos el ambiente.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(TRANSFORMACION_ENERGIA6_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.objeto+'</p><p class="prompt-hint">¿En qué transforma principalmente la energía?</p>',
      options: opts, correctValue: item.correcta, speakText: item.objeto, cols:2, kind:'word', panel:true,
      explain: 'Transforma la energía en <b>'+item.correcta.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(RECURSOS_RENOVABLES6_BANK);
    const opts = shuffle([{label:'Renovable', value:'Renovable'},{label:'No renovable', value:'No renovable'}]);
    return {
      promptHTML: '<p class="prompt-sentence">'+item.recurso+'</p><p class="prompt-hint">¿Es un recurso energético renovable o no renovable?</p>',
      options: opts, correctValue: item.tipo, speakText: item.recurso, cols:2, panel:true,
      explain: item.recurso+' es un recurso <b>'+item.tipo.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(USO_RESPONSABLE_ENERGIA_BANK);
  const opts = shuffle([{label:'Sí ayuda a usar la energía de forma responsable', value:true},{label:'No ayuda, es un uso irresponsable', value:false}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.accion+'</p><p class="prompt-hint">¿Esta acción ayuda a usar la energía de forma responsable?</p>',
    options: opts, correctValue: item.ayuda, speakText: item.accion, cols:2, panel:true,
    explain: item.ayuda ? 'Sí: esta acción ayuda a usar la energía de forma responsable.' : 'No: esta acción desperdicia energía.', recurso: recurso,
  };
}

const CALOR_FLUJO_BANK = [
  { escenario:'Pones un cubo de hielo en un vaso de agua tibia', correcta:'Del agua tibia hacia el hielo', opts:['Del hielo hacia el agua tibia','No hay ningún flujo de calor','El calor desaparece por completo'] },
  { escenario:'Tocas una taza de té caliente con la mano fría', correcta:'De la taza caliente hacia tu mano', opts:['De tu mano hacia la taza','No hay ningún flujo de calor','El calor se queda solo en la taza'] },
  { escenario:'Dejas una bebida fría al sol en un día caluroso', correcta:'Del aire caliente hacia la bebida fría', opts:['De la bebida fría hacia el aire','No hay ningún flujo de calor','La bebida se enfría aún más'] },
];
const ESTADOS_PARTICULAS_BANK = [
  { desc:'Las partículas están muy juntas y apenas se mueven, manteniendo una forma fija', estado:'Sólido' },
  { desc:'Las partículas están más separadas y se deslizan unas sobre otras, tomando la forma del recipiente', estado:'Líquido' },
  { desc:'Las partículas están muy separadas entre sí y se mueven rápidamente en todas direcciones', estado:'Gaseoso' },
];
const CAMBIOS_ESTADO_BANK = [
  { desc:'Un cubo de hielo se derrite y se convierte en agua líquida', proceso:'Fusión' },
  { desc:'El agua de un charco desaparece poco a poco al sol, convirtiéndose en vapor', proceso:'Evaporación' },
  { desc:'El agua hirviendo en una olla se convierte rápidamente en vapor', proceso:'Ebullición' },
  { desc:'El vapor de agua en el espejo del baño se convierte en gotitas de agua', proceso:'Condensación' },
  { desc:'El agua líquida se convierte en hielo al meterla al congelador', proceso:'Solidificación' },
  { desc:'El hielo seco (dióxido de carbono sólido) se convierte directamente en gas, sin pasar por líquido', proceso:'Sublimación' },
];
const CALOR_TEMPERATURA_BANK = [
  { pregunta:'¿Qué mide un termómetro: el calor o la temperatura?', correcta:'La temperatura', opts:['El calor','El sonido','La humedad'] },
  { pregunta:'¿Qué es el calor?', correcta:'La energía que se transfiere de un objeto a otro', opts:['Una unidad para medir el peso','Un instrumento de medición','Un tipo de sonido'] },
];
export function genCalorTemperatura6Round(){
  const recurso = 'El <b>calor</b> es la energía que se transfiere siempre desde el objeto más caliente hacia el más frío (nunca al revés), mientras que la <b>temperatura</b> es lo que mide un termómetro para indicar qué tan caliente o frío está algo. La materia existe en tres estados según cómo se comportan sus partículas: <b>sólido</b> (muy juntas, forma fija), <b>líquido</b> (más separadas, toman la forma del recipiente) y <b>gaseoso</b> (muy separadas, se mueven libremente). El calor es precisamente lo que provoca los cambios entre estos estados: fusión, evaporación, ebullición, condensación, solidificación y sublimación.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(CALOR_FLUJO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'.</p><p class="prompt-hint">¿Hacia dónde fluye el calor en esta situación?</p>',
      options: opts, correctValue: item.correcta, speakText: item.escenario, cols:2, panel:true,
      explain: 'El calor siempre fluye de lo más caliente a lo más frío: <b>'+item.correcta.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(ESTADOS_PARTICULAS_BANK);
    const todos = ['Sólido','Líquido','Gaseoso'];
    const distract = todos.filter(function(e){ return e!==item.estado; });
    const opts = shuffle([item.estado].concat(distract)).map(function(e){ return {label:e, value:e}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿A qué estado de la materia corresponde esta descripción?</p>',
      options: opts, correctValue: item.estado, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: 'Esta descripción corresponde al estado <b>'+item.estado.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  if(roll<0.75){
    const item = pick(CAMBIOS_ESTADO_BANK);
    const distract = shuffle(CAMBIOS_ESTADO_BANK.filter(function(c){ return c.proceso!==item.proceso; })).slice(0,3).map(function(c){ return c.proceso; });
    const opts = shuffle([item.proceso].concat(distract)).map(function(p){ return {label:p, value:p}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué cambio de estado ocurre en esta situación?</p>',
      options: opts, correctValue: item.proceso, speakText: item.desc, cols:2, kind:'word',
      explain: 'Este cambio de estado se llama <b>'+item.proceso.toLowerCase()+'</b>.', recurso: recurso,
    };
  }
  const item = pick(CALOR_TEMPERATURA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
  };
}

const CAPAS_TIERRA6_BANK = [
  { capa:'Atmósfera', desc:'La capa de aire y gases que rodea la Tierra y nos permite respirar' },
  { capa:'Litósfera', desc:'La capa sólida de rocas y suelo sobre la que caminamos y construimos' },
  { capa:'Hidrósfera', desc:'Toda el agua del planeta: océanos, ríos, lagos y glaciares' },
];
const SUELO_BANK = [
  { pregunta:'¿De qué se forma principalmente el suelo?', correcta:'De rocas descompuestas y materia orgánica (restos de plantas y animales)', opts:['Solo de agua de lluvia','Solo de aire atrapado','Solo de hielo derretido'] },
  { pregunta:'¿Cuál de estas es una propiedad importante del suelo que se puede observar u medir?', correcta:'Su capacidad de retener agua', opts:['Su velocidad de vuelo','Su temperatura de ebullición','Su conductividad eléctrica'] },
  { pregunta:'¿Por qué es importante proteger el suelo de la contaminación?', correcta:'Porque las plantas y los cultivos dependen de un suelo sano para crecer', opts:['Porque el suelo se usa para respirar','Porque el suelo nunca se contamina','Porque no tiene ninguna función importante'] },
];
const EROSION_BANK = [
  { agente:'El viento', desc:'Arrastra partículas de arena y tierra, desgastando rocas con el tiempo' },
  { agente:'El agua', desc:'La lluvia y los ríos arrastran tierra y desgastan rocas al fluir sobre ellas' },
  { agente:'Las actividades humanas', desc:'Talar bosques o sobreexplotar terrenos deja el suelo más expuesto y vulnerable' },
];
export function genTierraSueloErosion6Round(){
  const recurso = 'La Tierra tiene varias capas: la <b>atmósfera</b> (aire que rodea el planeta), la <b>litósfera</b> (la capa sólida de rocas y suelo) y la <b>hidrósfera</b> (toda el agua del planeta). El <b>suelo</b> se forma de rocas descompuestas junto con materia orgánica (restos de plantas y animales), y es esencial para que crezcan los cultivos. La <b>erosión</b> es el desgaste del suelo y las rocas por agentes naturales como el viento y el agua, pero también puede acelerarse por actividades humanas como talar bosques o sobreexplotar terrenos, dejando el suelo más expuesto y vulnerable.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CAPAS_TIERRA6_BANK);
    const distract = shuffle(CAPAS_TIERRA6_BANK.filter(function(c){ return c.capa!==item.capa; })).map(function(c){ return c.capa; });
    const opts = shuffle([item.capa].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué capa de la Tierra es?</p>',
      options: opts, correctValue: item.capa, speakText: item.desc, cols:2, kind:'word', panel:true,
      explain: item.capa+': '+item.desc.toLowerCase()+'.', recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(SUELO_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.', recurso: recurso,
    };
  }
  const item = pick(EROSION_BANK);
  const distract = shuffle(EROSION_BANK.filter(function(e){ return e.agente!==item.agente; })).map(function(e){ return e.agente; });
  const opts = shuffle([item.agente].concat(distract)).map(function(a){ return {label:a, value:a}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué agente de erosión se describe aquí?</p>',
    options: opts, correctValue: item.agente, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: item.agente+': '+item.desc.toLowerCase()+'.', recurso: recurso,
  };
}

/* ---------------- Contenido Ciencias Naturales 7° Básico ----------------
   Basado en OA del Decreto 614/2013, "Bases Curriculares 7° básico a 2°
   medio" (curriculumnacional.cl/curriculum/7o-basico-2o-medio/ciencias-
   naturales/7-basico) — currículum distinto al Decreto 439/2012 usado en
   1°-6° básico, organizado en 3 ejes: Biología, Física, Química.
   Sexualidad y Reproducción Humana -> OA01-03. **Decisión explícita
   conversada con el usuario (2026-07-22)**: incluir estos 3 OA completos,
   con tono clínico/factual (igual que el resto del contenido de anatomía ya
   construido), sin detalle gráfico ni juicio de valor — el ciclo menstrual
   y los gametos (OA02), qué son y para qué sirven los métodos
   anticonceptivos en términos generales sin instrucciones de uso (OA02), y
   las infecciones de transmisión sexual a nivel de contagio/prevención
   general sin detalle de síntomas gráficos (OA03). Esto es un salto real de
   madurez respecto a 6° básico (que solo llegó hasta anatomía reproductiva y
   cambios de la pubertad) — se le preguntó al usuario explícitamente antes
   de construir este módulo, dado el rol de la app como apoyo a familias con
   niños de edades muy distintas.
   Sistema Inmunológico y Microorganismos -> OA04-06 (barreras defensivas del
   cuerpo, comparar virus/bacterias/hongos, biotecnología con
   microorganismos). Fuerzas y Presión -> OA07-08. La Tierra: Geología y
   Clima -> OA09-12 (tectónica de placas, volcanes, ciclo de rocas, clima
   como sistema dinámico). Química: Materia y Gases -> OA13-15 (gases
   ideales, clasificación de la materia, cambios físicos vs. químicos).
   Ningún OA de 7° básico queda fuera del motor de opción múltiple. */
export const CIENCIAS_MODULES_G7 = [
  {id:'sexualidadreproduccion7', label:'Sexualidad y Reproducción Humana', open:true, key:'sexualidadreproduccion7'},
  {id:'inmunologicomicroorganismos7', label:'Sistema Inmunológico y Microorganismos', open:true, key:'inmunologicomicroorganismos7'},
  {id:'fuerzaspresion7', label:'Fuerzas y Presión', open:true, key:'fuerzaspresion7'},
  {id:'geologiaclima7', label:'La Tierra: Geología y Clima', open:true, key:'geologiaclima7'},
  {id:'materiagases7', label:'Química: Materia y Gases', open:true, key:'materiagases7'},
];
export const CIENCIAS_POS_G7 = [{x:20,y:92},{x:64,y:74},{x:24,y:54},{x:66,y:34},{x:22,y:12}];

const CICLO_MENSTRUAL_GAMETOS_BANK = [
  { pregunta:'¿Qué es el ciclo menstrual?', correcta:'Un proceso mensual en el cuerpo de la mujer que prepara al útero para un posible embarazo', opts:['Una enfermedad que hay que curar','Un problema digestivo','Una señal de que algo anda mal en el cuerpo'] },
  { pregunta:'¿Qué son los gametos?', correcta:'Las células reproductivas: el óvulo en la mujer y el espermatozoide en el hombre', opts:['Los glóbulos rojos de la sangre','Las células de la piel','Las células del sistema nervioso'] },
  { pregunta:'¿Cómo se llama la unión de un óvulo y un espermatozoide?', correcta:'Fecundación', opts:['Digestión','Respiración','Circulación'] },
  { pregunta:'¿Qué es la ovulación?', correcta:'La liberación de un óvulo maduro desde el ovario', opts:['La producción de glóbulos blancos','La digestión de los alimentos','La formación de huesos nuevos'] },
];
const METODOS_ANTICONCEPTIVOS_BANK = [
  { pregunta:'¿Para qué sirven principalmente los métodos anticonceptivos?', correcta:'Para prevenir un embarazo no planificado', opts:['Para curar resfriados','Para mejorar la visión','Para fortalecer los huesos'] },
  { pregunta:'¿Cuál de estos es un método anticonceptivo de barrera?', correcta:'El preservativo (condón)', opts:['Una vacuna','Un analgésico','Un antibiótico'] },
  { pregunta:'Además de prevenir el embarazo, ¿qué otra función importante cumple el uso del preservativo?', correcta:'Prevenir el contagio de infecciones de transmisión sexual', opts:['Mejorar el rendimiento escolar','Prevenir resfriados comunes','Fortalecer el sistema digestivo'] },
  { pregunta:'¿Por qué es importante consultar a un profesional de la salud antes de elegir un método anticonceptivo?', correcta:'Para recibir información correcta y elegir el más adecuado para la salud de cada persona', opts:['No es necesario consultar a nadie','Porque todos los métodos son exactamente iguales','Porque es obligatorio por ley sin ninguna razón de salud'] },
];
const ITS_BANK = [
  { pregunta:'¿Qué son las infecciones de transmisión sexual (ITS)?', correcta:'Infecciones que se pueden transmitir principalmente por contacto sexual', opts:['Infecciones que solo se transmiten por el aire','Enfermedades que solo afectan a los animales','Un tipo de alergia alimentaria'] },
  { pregunta:'¿Cuál es una forma efectiva de prevenir el contagio de una ITS?', correcta:'Usar preservativo y mantener controles de salud regulares', opts:['No existe ninguna forma de prevención','Solo lavarse las manos es suficiente','Ignorar el tema por completo'] },
  { pregunta:'¿Qué se debe hacer si una persona sospecha que podría tener una ITS?', correcta:'Consultar a un profesional de la salud lo antes posible', opts:['Esperar a que se cure sola sin consultar a nadie','Ocultarlo de todos para siempre','Automedicarse sin supervisión médica'] },
  { pregunta:'¿Por qué es importante hacerse exámenes médicos de manera regular?', correcta:'Porque algunas ITS pueden no presentar señales visibles al principio', opts:['Porque todas las ITS duelen mucho desde el primer día','Porque los exámenes médicos nunca sirven de nada','Porque es solo una formalidad sin ningún propósito'] },
];
export function genSexualidadReproduccion7Round(){
  const recurso = 'El sistema reproductor femenino y masculino producen los <b>gametos</b> (óvulos y espermatozoides) necesarios para la reproducción humana; el <b>ciclo menstrual</b> es el proceso mensual mediante el cual el cuerpo de la mujer prepara y libera un óvulo. Los <b>métodos anticonceptivos</b> son formas de prevenir un embarazo cuando se decide no tenerlo en ese momento, y varían en su forma de uso y efectividad. Las <b>infecciones de transmisión sexual (ITS)</b> se pueden prevenir con medidas de cuidado y se detectan y tratan con ayuda de un profesional de la salud — ante cualquier duda sobre estos temas, siempre es importante conversar con un adulto de confianza o consultar a un médico.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CICLO_MENSTRUAL_GAMETOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(METODOS_ANTICONCEPTIVOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(ITS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const BARRERAS_DEFENSIVAS_BANK = [
  { pregunta:'¿Cuál es la primera barrera de defensa del cuerpo contra los agentes patógenos?', correcta:'La piel', opts:['Los huesos','El cabello','Las uñas'] },
  { pregunta:'¿Qué función cumplen los glóbulos blancos en el cuerpo?', correcta:'Defender al cuerpo de agentes patógenos como virus y bacterias', opts:['Transportar oxígeno por la sangre','Digerir los alimentos','Formar los huesos'] },
  { pregunta:'¿Qué es una vacuna?', correcta:'Una sustancia que prepara al sistema inmunológico para defenderse de un agente específico, sin causar la enfermedad', opts:['Un tipo de alimento','Un analgésico para el dolor','Un tratamiento para huesos rotos'] },
  { pregunta:'¿Por qué a veces el cuerpo tiene fiebre cuando está combatiendo una infección?', correcta:'Porque es una respuesta de defensa que dificulta la reproducción de algunos agentes patógenos', opts:['Porque el cuerpo está fallando por completo','Porque es una señal sin ningún propósito','Porque el cuerpo deja de funcionar'] },
];
const VIRUS_BACTERIAS_HONGOS_BANK = [
  { pregunta:'¿Qué característica distingue a un virus de una bacteria?', correcta:'El virus necesita una célula huésped para reproducirse, la bacteria puede reproducirse por sí sola', opts:['El virus siempre es más grande que la bacteria','Las bacterias siempre son dañinas y los virus nunca','Los virus siempre viven en el agua'] },
  { pregunta:'¿Cuál de estos microorganismos puede ser beneficioso, como en la producción de pan o queso?', correcta:'Los hongos (como las levaduras)', opts:['Solo los virus','Ningún microorganismo puede ser beneficioso','Solo los parásitos'] },
  { pregunta:'¿Qué tienen en común las bacterias con otros seres vivos, a diferencia de los virus?', correcta:'Las bacterias están formadas por células, igual que otros seres vivos', opts:['Las bacterias nunca se reproducen','Las bacterias siempre son microscópicamente idénticas a los virus','Las bacterias nunca existen en la naturaleza'] },
];
const BIOTECNOLOGIA_BANK = [
  { pregunta:'¿Para qué se usan microorganismos en la producción de alimentos como el yogur?', correcta:'Para fermentar la leche y transformarla en yogur', opts:['Para colorear el envase','Para enfriar el producto','Para aumentar su peso'] },
  { pregunta:'¿Cómo se pueden usar microorganismos para ayudar al medioambiente?', correcta:'Algunos pueden descomponer sustancias contaminantes', opts:['Nunca se pueden usar para cuidar el medioambiente','Solo sirven para contaminar más','Solo existen para causar enfermedades'] },
  { pregunta:'¿Qué producen algunos microorganismos al descomponer materia orgánica, que se puede usar como fuente de energía?', correcta:'Metano (biogás)', opts:['Oxígeno puro solamente','Agua potable directamente','Sal de mesa'] },
];
export function genInmunologicoMicroorganismos7Round(){
  const recurso = 'El cuerpo se defiende de los agentes patógenos con <b>barreras defensivas</b> (la piel, los glóbulos blancos) y con la ayuda de <b>vacunas</b>, que preparan al sistema inmunológico sin causar la enfermedad. Los <b>virus</b> necesitan una célula huésped para reproducirse, mientras que las <b>bacterias</b> pueden reproducirse por sí solas; no todos los microorganismos son dañinos — muchos hongos y bacterias son beneficiosos, usados en la <b>biotecnología</b> para producir alimentos (pan, yogur, queso) o para ayudar al medioambiente descomponiendo sustancias contaminantes.';
  const roll = Math.random();
  if(roll<0.4){
    const item = pick(BARRERAS_DEFENSIVAS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  if(roll<0.7){
    const item = pick(VIRUS_BACTERIAS_HONGOS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(BIOTECNOLOGIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const FUERZAS7_BANK = [
  { escenario:'Una manzana cae del árbol hacia el suelo', fuerza:'Gravitacional' },
  { escenario:'Frotar las manos genera calor por el roce entre ellas', fuerza:'De fricción (roce)' },
  { escenario:'Un resorte vuelve a su forma original después de estirarlo y soltarlo', fuerza:'Elástica' },
  { escenario:'Una pelota rueda por el suelo y se detiene poco a poco por el roce con la superficie', fuerza:'De fricción (roce)' },
  { escenario:'Un satélite es atraído hacia la Tierra y orbita alrededor de ella', fuerza:'Gravitacional' },
  { escenario:'Una cama elástica (trampolín) impulsa hacia arriba a quien salta sobre ella', fuerza:'Elástica' },
];
const PRESION_BANK = [
  { pregunta:'¿Por qué un cuchillo afilado corta mejor que uno sin filo, aplicando la misma fuerza?', correcta:'Porque concentra la fuerza en una superficie más pequeña, aumentando la presión', opts:['Porque pesa menos','Porque es más largo','Porque es de otro color'] },
  { pregunta:'¿Qué le ocurre a la presión que siente un buzo a medida que se sumerge más profundo en el agua?', correcta:'Aumenta', opts:['Disminuye','Se mantiene igual siempre','Desaparece por completo'] },
  { pregunta:'¿Por qué usar raquetas de nieve o esquís ayuda a no hundirse tanto en la nieve?', correcta:'Porque reparten el peso en una superficie más grande, disminuyendo la presión', opts:['Porque son más pesados','Porque derriten la nieve','Porque son de color blanco'] },
];
export function genFuerzasPresion7Round(){
  const recurso = 'Existen distintos tipos de <b>fuerza</b>: la <b>gravitacional</b> atrae los objetos hacia la Tierra (o entre sí), la de <b>fricción (roce)</b> se opone al movimiento entre dos superficies en contacto, y la <b>elástica</b> aparece cuando un objeto se deforma y vuelve a su forma original (como un resorte). La <b>presión</b> es la fuerza aplicada sobre una superficie: a menor superficie, mayor presión (por eso un cuchillo afilado corta mejor), y a mayor superficie, menor presión (por eso las raquetas de nieve evitan hundirse).';
  if(Math.random()<0.6){
    const item = pick(FUERZAS7_BANK);
    const todos = ['Gravitacional','De fricción (roce)','Elástica'];
    const distract = todos.filter(function(f){ return f!==item.fuerza; });
    const opts = shuffle([item.fuerza].concat(distract)).map(function(f){ return {label:f, value:f}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'.</p><p class="prompt-hint">¿Qué tipo de fuerza actúa principalmente en esta situación?</p>',
      options: opts, correctValue: item.fuerza, speakText: item.escenario, cols:2, kind:'word', panel:true,
      explain: 'Aquí actúa principalmente la fuerza <b>'+item.fuerza.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(PRESION_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const TECTONICA_BANK = [
  { pregunta:'¿Qué ocurre cuando dos placas tectónicas se separan una de la otra?', correcta:'Es un límite divergente, donde puede surgir nuevo material desde el interior de la Tierra', opts:['Siempre se forma un océano nuevo de inmediato','Las placas dejan de existir','No ocurre ningún cambio geológico'] },
  { pregunta:'¿Qué ocurre cuando dos placas tectónicas chocan entre sí?', correcta:'Es un límite convergente, que puede formar cordilleras o zonas de alta actividad sísmica', opts:['Las placas se detienen para siempre sin consecuencias','Siempre se forma un volcán instantáneamente','No tiene ningún efecto geológico'] },
  { pregunta:'¿Qué propone la teoría de la deriva continental?', correcta:'Que los continentes se han movido a lo largo del tiempo geológico', opts:['Que los continentes siempre han estado exactamente en el mismo lugar','Que la Tierra no tiene continentes','Que los océanos nunca cambian de tamaño'] },
];
const VOLCANES_BANK = [
  { pregunta:'¿Qué relación existe entre los volcanes y los límites de placas tectónicas?', correcta:'Muchos volcanes se forman cerca de los límites entre placas tectónicas', opts:['Los volcanes nunca tienen relación con las placas tectónicas','Los volcanes solo existen en el océano','Los volcanes aparecen al azar sin ningún patrón'] },
  { pregunta:'¿Cuál es una consecuencia social de una erupción volcánica importante?', correcta:'Puede obligar a evacuar a la población cercana por seguridad', opts:['Siempre mejora inmediatamente la economía local','Nunca afecta a las personas que viven cerca','No tiene ningún efecto en la sociedad'] },
];
const CICLO_ROCAS_BANK = [
  { pregunta:'¿Cómo se forman las rocas ígneas?', correcta:'Por el enfriamiento y solidificación del magma o la lava', opts:['Por la acumulación de sedimentos solamente','Por el calor y la presión sobre otra roca solamente','Por la evaporación del agua de mar'] },
  { pregunta:'¿Cómo se forman las rocas sedimentarias?', correcta:'Por la acumulación y compactación de sedimentos a lo largo del tiempo', opts:['Por el enfriamiento directo de la lava','Por una explosión volcánica instantánea','Por la congelación del agua'] },
  { pregunta:'¿Cómo se forman las rocas metamórficas?', correcta:'Cuando una roca existente es transformada por calor y presión intensos, sin llegar a derretirse por completo', opts:['Solo por acumulación de arena en el desierto','Solo por la acción del viento','Solo por congelamiento rápido'] },
];
const CLIMA7_BANK = [
  { pregunta:'¿Por qué se dice que el clima de un lugar es "dinámico"?', correcta:'Porque resulta de la interacción de múltiples variables que cambian constantemente (temperatura, vientos, humedad)', opts:['Porque el clima nunca cambia en ningún lugar','Porque solo depende de un único factor fijo','Porque es idéntico en todos los lugares del planeta'] },
  { pregunta:'¿Qué factor geográfico puede influir en el clima de una zona costera en comparación con una zona de cordillera?', correcta:'La cercanía al mar y la altitud sobre el nivel del mar', opts:['El color de las casas de esa zona','El número de habitantes de la zona','El idioma que se habla en esa zona'] },
];
export function genGeologiaClima7Round(){
  const recurso = 'La <b>tectónica de placas</b> explica que la corteza terrestre está dividida en placas que se mueven lentamente: cuando se separan (límite divergente) puede surgir nuevo material, y cuando chocan (límite convergente) se forman cordilleras o zonas de alta actividad sísmica y volcánica. El <b>ciclo de las rocas</b> describe cómo las rocas ígneas (por enfriamiento de magma/lava), sedimentarias (por acumulación de sedimentos) y metamórficas (por calor y presión) se transforman unas en otras a lo largo del tiempo geológico. El <b>clima</b> de un lugar es dinámico porque depende de la interacción de varios factores que cambian constantemente, como la cercanía al mar y la altitud.';
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(TECTONICA_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  if(roll<0.5){
    const item = pick(VOLCANES_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  if(roll<0.75){
    const item = pick(CICLO_ROCAS_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(CLIMA7_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const GASES_BANK = [
  { pregunta:'Si comprimes un gas dentro de un recipiente cerrado (reduces su volumen) sin cambiar la temperatura, ¿qué le ocurre a su presión?', correcta:'Aumenta', opts:['Disminuye','Se mantiene exactamente igual','Desaparece por completo'] },
  { pregunta:'Si calientas un gas dentro de un recipiente cerrado de volumen fijo, ¿qué le ocurre generalmente a su presión?', correcta:'Aumenta', opts:['Disminuye','Se mantiene exactamente igual','Se convierte en líquido'] },
  { pregunta:'Según la teoría cinético-molecular, ¿cómo se comportan las partículas de un gas?', correcta:'Se mueven rápidamente y al azar, con mucho espacio entre ellas', opts:['Están completamente quietas y muy juntas','Se mueven en una sola dirección fija','No se mueven nunca'] },
];
const CLASIFICACION_MATERIA7_BANK = [
  { pregunta:'¿Qué es una sustancia pura?', correcta:'Una sustancia formada por un solo tipo de componente, con propiedades constantes', opts:['Una combinación de varios materiales distintos','Un líquido de cualquier tipo','Un objeto sólido de cualquier tipo'] },
  { pregunta:'¿Qué es una mezcla?', correcta:'La combinación de dos o más sustancias que mantienen sus propiedades', opts:['Un único elemento químico puro','Un gas sin ningún otro componente','Una sustancia que no se puede separar nunca'] },
  { pregunta:'¿Qué técnica de separación usarías para separar arena de agua?', correcta:'Filtración', opts:['Destilación','Imantación','Ninguna técnica puede separarlas'] },
  { pregunta:'¿Qué técnica de separación se usa para separar el agua de la sal disuelta en ella (obteniendo agua pura)?', correcta:'Destilación', opts:['Filtración','Imantación','Ninguna técnica puede separarlas'] },
];
const CAMBIOS_FISQUIM_BANK = [
  { desc:'El agua se congela y se convierte en hielo', tipo:'Cambio físico' },
  { desc:'Un papel se quema y se convierte en cenizas', tipo:'Cambio químico' },
  { desc:'Se corta una manzana en trozos más pequeños', tipo:'Cambio físico' },
  { desc:'Un clavo de hierro se oxida y forma óxido de hierro', tipo:'Cambio químico' },
  { desc:'La sal se disuelve en agua', tipo:'Cambio físico' },
  { desc:'La leche se corta y se transforma en yogur', tipo:'Cambio químico' },
];
export function genMateriaGases7Round(){
  const recurso = 'Según la <b>teoría cinético-molecular</b>, las partículas de un gas se mueven rápido y al azar con mucho espacio entre ellas; al comprimir o calentar un gas en un recipiente cerrado, su presión generalmente aumenta. La materia se puede clasificar en <b>sustancias puras</b> (un solo tipo de componente) o <b>mezclas</b> (combinación de varias sustancias que se pueden separar con técnicas como filtración o destilación). Un <b>cambio físico</b> no forma una sustancia nueva (como congelar agua), mientras que un <b>cambio químico</b> sí forma una sustancia distinta con propiedades nuevas (como quemar papel u oxidar un clavo).';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(GASES_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(CLASIFICACION_MATERIA7_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, kind:'word', panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: recurso,
    };
  }
  const item = pick(CAMBIOS_FISQUIM_BANK);
  const opts = shuffle([{label:'Cambio físico', value:'Cambio físico'},{label:'Cambio químico', value:'Cambio químico'}]);
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Es un cambio físico o un cambio químico?</p>',
    options: opts, correctValue: item.tipo, speakText: item.desc, cols:2, panel:true,
    explain: 'Esto es un <b>'+item.tipo.toLowerCase()+'</b>'+(item.tipo==='Cambio químico' ? ': se forma una sustancia nueva con propiedades distintas.' : ': la sustancia sigue siendo la misma, solo cambia su forma o estado.'),
    recurso: recurso,
  };
}

/* ---------------- Contenido Ciencias Naturales 8° Básico ----------------
   Basado en OA del Decreto 614/2013 (curriculumnacional.cl/curriculum/
   7o-basico-2o-medio/ciencias-naturales/8-basico).
   La Célula VIII -> CN08 OA01-03 (historia del modelo celular -Hooke,
   Leeuwenhoek-, célula procarionte/eucarionte y sus estructuras -núcleo,
   mitocondria, cloroplasto-, difusión y osmosis como intercambio de
   partículas con el ambiente). Nutrición y Sistemas del Cuerpo -> OA05-07
   (sistemas digestivo/circulatorio/respiratorio/excretor trabajando en
   conjunto, nutrientes -carbohidratos, proteínas, grasas, vitaminas,
   minerales, agua- y su función en la salud). Electricidad II -> OA08-10
   (cargas y electrización, tecnologías de generación eléctrica, circuitos
   en serie y en paralelo). Calor y Transferencia -> OA11 (conducción,
   convección y radiación — distinto de "Calor, Temperatura y Estados" de
   6° básico, que cubrió calor vs. temperatura y cambios de estado). El
   Átomo y la Tabla Periódica -> OA12-15 (modelos atómicos de Dalton a
   Bohr, partículas del átomo, tabla periódica, elementos esenciales para
   la vida C-H-O-N). Quedan fuera: OA04 (modelos de estructuras vegetales
   — construcción de modelos propios, producción práctica). */
export const CIENCIAS_MODULES_G8 = [
  {id:'celula8', label:'La Célula VIII', open:true, key:'celula8'},
  {id:'nutricionsistemas8', label:'Nutrición y Sistemas del Cuerpo', open:true, key:'nutricionsistemas8'},
  {id:'electricidad8', label:'Electricidad II', open:true, key:'electricidad8'},
  {id:'calor8', label:'Calor y Transferencia', open:true, key:'calor8'},
  {id:'atomotabla8', label:'El Átomo y la Tabla Periódica', open:true, key:'atomotabla8'},
];
export const CIENCIAS_POS_G8 = [{x:20,y:92},{x:64,y:74},{x:24,y:54},{x:66,y:34},{x:22,y:12}];

const CELULA_8_BANK = [
  { pregunta:'¿Quién observó por primera vez "celdas" en una lámina de corcho usando un microscopio, dando origen al nombre "célula"?', correcta:'Robert Hooke', opts:['Isaac Newton','Charles Darwin','Gregor Mendel'] },
  { pregunta:'¿Quién fue el primero en observar microorganismos vivos ("animálculos") usando microscopios que él mismo mejoró?', correcta:'Anton van Leeuwenhoek', opts:['Robert Hooke','Louis Pasteur','Alexander Fleming'] },
  { pregunta:'¿Qué diferencia principal hay entre una célula procarionte y una eucarionte?', correcta:'La eucarionte tiene un núcleo que encierra su material genético, la procarionte no', opts:['La procarionte es siempre más grande que la eucarionte','Solo la procarionte tiene membrana celular','No existe ninguna diferencia entre ambas'] },
  { pregunta:'¿Qué tipo de célula tienen las bacterias?', correcta:'Procarionte', opts:['Eucarionte','Ninguna: las bacterias no tienen células','Una célula con dos núcleos'] },
  { pregunta:'¿Qué estructura celular actúa como la "central energética" de la célula, produciendo la energía que esta necesita?', correcta:'La mitocondria', opts:['El núcleo','El cloroplasto','La membrana celular'] },
  { pregunta:'¿Qué estructura, presente en las células vegetales pero no en las animales, permite realizar la fotosíntesis?', correcta:'El cloroplasto', opts:['La mitocondria','El núcleo','El citoplasma'] },
  { pregunta:'¿Qué función cumple el núcleo en una célula eucarionte?', correcta:'Contiene y protege el material genético (ADN) de la célula', opts:['Produce toda la energía de la célula','Realiza la fotosíntesis','No cumple ninguna función'] },
  { pregunta:'¿Qué es la difusión, en el contexto del intercambio de partículas de una célula con su ambiente?', correcta:'El movimiento de partículas desde donde hay más concentración hacia donde hay menos, sin gastar energía', opts:['El movimiento de partículas siempre contra la concentración y gastando energía','La destrucción total de la célula','La división de una célula en dos'] },
  { pregunta:'¿Qué es la ósmosis?', correcta:'El paso de agua a través de la membrana celular, desde donde hay menos solutos hacia donde hay más', opts:['El paso de luz a través de la célula','La producción de energía en la mitocondria','La división del núcleo en dos partes'] },
  { pregunta:'¿Por qué una célula colocada en agua muy salada (con muchos solutos afuera) puede perder agua y encogerse?', correcta:'Porque por ósmosis el agua sale de la célula hacia el lugar con más concentración de sal', opts:['Porque la sal entra directamente y empuja el agua hacia fuera por la fuerza','Porque la célula siempre pierde agua sin ninguna razón','Porque la membrana celular se rompe inmediatamente'] },
];
export function genCelula8Round(){
  const recurso = 'La <b>célula</b> es la unidad básica de todo ser vivo — descubierta por Robert Hooke al observar corcho al microscopio, y descrita viva por primera vez por Anton van Leeuwenhoek. Existen dos tipos principales: las células <b>procariontes</b> (como las bacterias), que no tienen núcleo definido, y las <b>eucariontes</b> (como las de plantas, animales y hongos), que sí tienen un núcleo que guarda su material genético, además de otras estructuras internas como la mitocondria (que produce energía) o el cloroplasto (que realiza fotosíntesis, solo en células vegetales). La <b>difusión</b> y la <b>osmosis</b> son formas en que sustancias como el agua o los nutrientes entran y salen de la célula a través de su membrana, moviéndose siempre desde donde hay más concentración hacia donde hay menos.';
  const item = pick(CELULA_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const SISTEMAS_CUERPO_8_BANK = [
  { pregunta:'¿Qué sistema se encarga de transportar el oxígeno y los nutrientes a todas las células del cuerpo?', correcta:'El sistema circulatorio', opts:['El sistema digestivo','El sistema excretor','El sistema respiratorio'] },
  { pregunta:'¿Qué sistema se encarga de captar el oxígeno del aire y eliminar el dióxido de carbono del cuerpo?', correcta:'El sistema respiratorio', opts:['El sistema digestivo','El sistema circulatorio','El sistema excretor'] },
  { pregunta:'¿Qué sistema se encarga de descomponer los alimentos en nutrientes que el cuerpo puede usar?', correcta:'El sistema digestivo', opts:['El sistema excretor','El sistema respiratorio','El sistema circulatorio'] },
  { pregunta:'¿Qué sistema se encarga de filtrar la sangre y eliminar los desechos del cuerpo a través de la orina?', correcta:'El sistema excretor', opts:['El sistema digestivo','El sistema respiratorio','El sistema circulatorio'] },
  { pregunta:'Después de digerir un alimento, ¿qué sistema transporta los nutrientes obtenidos hacia el resto del cuerpo?', correcta:'El sistema circulatorio', opts:['El sistema excretor solamente','Ningún sistema: los nutrientes se quedan en el estómago','El sistema respiratorio solamente'] },
  { pregunta:'¿Qué grupo de nutrientes es la principal fuente de energía rápida para el cuerpo, presente en el pan, el arroz y las papas?', correcta:'Los carbohidratos', opts:['Las proteínas','Las vitaminas','Los minerales'] },
  { pregunta:'¿Qué nutrientes son fundamentales para la formación y reparación de los músculos y tejidos del cuerpo?', correcta:'Las proteínas', opts:['Los carbohidratos','Las grasas','El agua'] },
  { pregunta:'¿Qué función cumplen las grasas en una alimentación equilibrada, además de aportar energía?', correcta:'Ayudan a absorber ciertas vitaminas y protegen órganos del cuerpo', opts:['No cumplen ninguna función en el cuerpo','Solo sirven para dar sabor a la comida','Eliminan los nutrientes de otros alimentos'] },
  { pregunta:'¿Por qué el cuerpo necesita vitaminas y minerales en la dieta, aunque se necesiten en pequeñas cantidades?', correcta:'Porque regulan procesos importantes del cuerpo, como el sistema inmune y los huesos', opts:['Porque aportan la mayor parte de la energía diaria','Porque reemplazan completamente a las proteínas','No cumplen ninguna función real en el cuerpo'] },
  { pregunta:'¿Por qué el agua es considerada un nutriente esencial, aunque no aporte energía (calorías)?', correcta:'Porque es necesaria para casi todos los procesos del cuerpo, como la digestión y la circulación', opts:['Porque aporta más energía que los carbohidratos','Porque su única función es dar sabor a la comida','El agua no es realmente necesaria para el cuerpo'] },
  { pregunta:'¿Por qué se dice que los sistemas digestivo, circulatorio, respiratorio y excretor "trabajan en conjunto"?', correcta:'Porque el resultado de uno (como los nutrientes digeridos u oxígeno captado) es usado por los otros', opts:['Porque funcionan completamente por separado, sin ninguna relación','Porque solo uno de ellos es realmente necesario','Porque todos hacen exactamente la misma función'] },
];
export function genNutricionSistemas8Round(){
  const recurso = 'El cuerpo humano funciona como un equipo de sistemas que trabajan en conjunto: el <b>sistema digestivo</b> descompone los alimentos en nutrientes, el <b>sistema circulatorio</b> transporta esos nutrientes y el oxígeno a todas las células, el <b>sistema respiratorio</b> capta el oxígeno del aire, y el <b>sistema excretor</b> filtra la sangre y elimina los desechos. Los <b>nutrientes</b> cumplen funciones distintas: los carbohidratos dan energía rápida, las proteínas forman y reparan tejidos, las grasas aportan energía de reserva y ayudan a absorber ciertas vitaminas, y las vitaminas/minerales regulan procesos importantes aunque se necesiten en pequeñas cantidades. El agua, aunque no aporta energía, es esencial para casi todos los procesos del cuerpo.';
  const item = pick(SISTEMAS_CUERPO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ELECTRICIDAD8_BANK = [
  { pregunta:'¿Qué ocurre cuando dos objetos se frotan entre sí y quedan "electrizados"?', correcta:'Se transfieren cargas eléctricas entre los objetos', opts:['Se transfiere calor únicamente, sin ninguna carga','Los objetos pierden toda su masa','No ocurre ningún fenómeno físico real'] },
  { pregunta:'¿Qué tipos de carga eléctrica existen?', correcta:'Positiva y negativa', opts:['Solo positiva','Solo negativa','Caliente y fría'] },
  { pregunta:'¿Qué sucede entre dos objetos con carga eléctrica del mismo signo (por ejemplo, ambos negativos)?', correcta:'Se repelen (se alejan entre sí)', opts:['Se atraen fuertemente','No ocurre ningún efecto entre ellos','Se fusionan en un solo objeto'] },
  { pregunta:'¿Qué tecnología transforma la luz solar directamente en electricidad?', correcta:'Los paneles solares (fotovoltaicos)', opts:['Las turbinas eólicas','Las pilas comunes','Las centrales hidroeléctricas'] },
  { pregunta:'¿Qué tecnología aprovecha la fuerza del viento para generar electricidad?', correcta:'Los generadores eólicos (aerogeneradores)', opts:['Los paneles solares','Las pilas comunes','Las centrales geotérmicas'] },
  { pregunta:'¿Qué tecnología usa el movimiento del agua (por ejemplo, en una represa) para generar electricidad?', correcta:'Las centrales hidroeléctricas', opts:['Los paneles solares','Las pilas comunes','Los generadores eólicos'] },
  { pregunta:'¿Cómo se comporta la corriente en un circuito eléctrico en serie, donde los componentes están conectados uno tras otro?', correcta:'La misma corriente pasa por todos los componentes, en un solo camino', opts:['Cada componente tiene su propio camino independiente','La corriente no puede circular en absoluto','Los componentes nunca reciben corriente'] },
  { pregunta:'¿Qué ocurre con el resto del circuito en serie si uno de sus componentes (por ejemplo, una ampolleta) se quema?', correcta:'Todo el circuito deja de funcionar, porque solo hay un camino para la corriente', opts:['El resto del circuito sigue funcionando normalmente','Solo el componente quemado se apaga, el resto sigue igual','El circuito funciona mejor que antes'] },
  { pregunta:'¿Qué ventaja tiene un circuito en paralelo, donde cada componente tiene su propio camino, frente a uno en serie?', correcta:'Si un componente falla, los demás pueden seguir funcionando', opts:['Siempre consume menos energía que uno en serie, sin excepción','No permite conectar más de un componente','Es imposible de construir en la práctica'] },
  { pregunta:'¿Por qué las instalaciones eléctricas de una casa (enchufes, ampolletas) suelen conectarse en paralelo y no en serie?', correcta:'Para que cada aparato pueda encenderse o apagarse sin afectar a los demás', opts:['Para que todos los aparatos se enciendan y apaguen siempre juntos','Porque así se gasta más electricidad a propósito','Porque el paralelo es más barato de instalar en todos los casos'] },
];
export function genElectricidad8Round(){
  const recurso = 'La <b>electricidad</b> se produce por el movimiento de cargas eléctricas, que pueden ser positivas o negativas — cargas del mismo signo se repelen y de signo distinto se atraen. Existen distintas <b>tecnologías de generación eléctrica</b> que aprovechan fuentes renovables: los paneles solares (fotovoltaicos) transforman la luz del sol en electricidad, los aerogeneradores usan la fuerza del viento, y las centrales hidroeléctricas usan el movimiento del agua. Un <b>circuito eléctrico</b> puede conectarse en serie (un solo camino para la corriente: si un componente falla, todo el circuito se apaga) o en paralelo (cada componente tiene su propio camino: si uno falla, los demás siguen funcionando) — por eso las instalaciones de una casa se conectan en paralelo.';
  const item = pick(ELECTRICIDAD8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const TRANSFERENCIA_CALOR_8_BANK = [
  { desc:'El mango de una cuchara de metal se calienta poco a poco mientras revuelve una olla con sopa caliente', correcta:'Conducción', opts:['Convección','Radiación','Ninguna transferencia de calor'] },
  { desc:'El agua caliente en el fondo de una olla sube, y el agua más fría de arriba baja, formando una corriente circular', correcta:'Convección', opts:['Conducción','Radiación','Evaporación'] },
  { desc:'Sientes el calor del sol en tu piel un día despejado, aunque el sol está a millones de kilómetros de distancia', correcta:'Radiación', opts:['Conducción','Convección','Ninguna transferencia de calor'] },
  { desc:'Al tocar una baranda de metal en un día frío, sientes que te "roba" el calor de la mano casi de inmediato', correcta:'Conducción', opts:['Convección','Radiación','Ninguna transferencia de calor'] },
  { desc:'El aire caliente cerca de una estufa se eleva hacia el techo, mientras el aire frío del suelo se acerca a la estufa', correcta:'Convección', opts:['Conducción','Radiación','Ninguna transferencia de calor'] },
  { desc:'Una fogata calienta a las personas sentadas alrededor, incluso sin que el aire entre ellas y el fuego se mueva directamente', correcta:'Radiación', opts:['Conducción','Convección','Ninguna transferencia de calor'] },
  { desc:'Un sartén de metal transmite el calor de la cocina directamente hacia la comida que está sobre él', correcta:'Conducción', opts:['Convección','Radiación','Ninguna transferencia de calor'] },
  { desc:'El agua de una tetera se calienta de manera pareja porque las corrientes de agua caliente y fría se mezclan constantemente', correcta:'Convección', opts:['Conducción','Radiación','Ninguna transferencia de calor'] },
  { desc:'Un termómetro de infrarrojos mide la temperatura de un objeto a distancia, sin necesidad de tocarlo', correcta:'Radiación', opts:['Conducción','Convección','Ninguna transferencia de calor'] },
  { desc:'¿Por qué los mangos de las ollas suelen ser de plástico o madera, y no de metal?', correcta:'Porque esos materiales conducen muy poco el calor, a diferencia del metal', opts:['Porque el metal es demasiado caro para fabricar mangos','Porque el plástico y la madera conducen el calor mejor que el metal','Porque no hay ninguna razón particular'] },
];
export function genCalor8Round(){
  const recurso = 'El <b>calor</b> siempre se transfiere de un cuerpo más caliente a uno más frío, y hay tres formas principales de que esto ocurra. La <b>conducción</b> es la transferencia de calor a través de un material sólido, por contacto directo, como el mango de una cuchara de metal que se calienta poco a poco. La <b>convección</b> ocurre en líquidos o gases, cuando el material caliente (menos denso) sube y el frío (más denso) baja, formando corrientes — como el agua que hierve en una olla. La <b>radiación</b> es la transferencia de calor a través del espacio vacío, sin necesidad de un medio material, como el calor del sol que llega a la Tierra o el de una fogata. Por eso los mangos de las ollas se hacen de materiales que conducen poco el calor, como el plástico o la madera.';
  const item = pick(TRANSFERENCIA_CALOR_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.desc+'.</p><p class="prompt-hint">¿Qué tipo de transferencia de calor se describe aquí?</p>',
    options: opts, correctValue: item.correcta, speakText: item.desc, cols:2, kind:'word', panel:true,
    explain: 'Esto es un ejemplo de <b>'+item.correcta.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

const ATOMO_8_BANK = [
  { pregunta:'¿Qué propuso el modelo atómico de Dalton, a principios del siglo XIX?', correcta:'Que la materia está formada por partículas indivisibles llamadas átomos', opts:['Que el átomo tiene un núcleo con electrones orbitando a su alrededor','Que la materia no está formada por ninguna partícula','Que los átomos son infinitamente divisibles'] },
  { pregunta:'¿Qué aportó el modelo atómico de Thomson respecto al de Dalton?', correcta:'Propuso que el átomo contiene partículas con carga negativa (electrones) dentro de una esfera con carga positiva', opts:['Propuso que el átomo es completamente indivisible','Propuso que el átomo no tiene ninguna carga eléctrica','Propuso que los átomos son visibles a simple vista'] },
  { pregunta:'¿Qué descubrió Rutherford con su experimento de la lámina de oro, que cambió el modelo atómico?', correcta:'Que el átomo tiene un núcleo pequeño y denso, con carga positiva, rodeado de espacio vacío', opts:['Que el átomo es una esfera maciza sin ningún espacio vacío','Que los átomos no tienen núcleo','Que la materia no está formada por átomos'] },
  { pregunta:'¿Qué propuso el modelo atómico de Bohr sobre los electrones?', correcta:'Que los electrones giran alrededor del núcleo en órbitas o niveles de energía definidos', opts:['Que los electrones están fijos y no se mueven nunca','Que el átomo no tiene electrones','Que los electrones están dentro del núcleo'] },
  { pregunta:'¿Qué partícula del átomo tiene carga positiva y se ubica en el núcleo?', correcta:'El protón', opts:['El electrón','El neutrón','Ninguna: el núcleo no tiene carga'] },
  { pregunta:'¿Qué partícula del átomo no tiene carga eléctrica y también se ubica en el núcleo?', correcta:'El neutrón', opts:['El protón','El electrón','Ninguna partícula carece de carga'] },
  { pregunta:'¿Qué partícula del átomo tiene carga negativa y se ubica fuera del núcleo?', correcta:'El electrón', opts:['El protón','El neutrón','Ninguna: todas las partículas están en el núcleo'] },
  { pregunta:'¿Para qué sirve la tabla periódica de los elementos?', correcta:'Para organizar los elementos químicos y predecir sus propiedades según su posición', opts:['Para medir la temperatura del ambiente','Para calcular distancias astronómicas','Para registrar recetas de cocina'] },
  { pregunta:'¿Qué elementos químicos son considerados esenciales para la vida en la Tierra, presentes en moléculas como el agua y los seres vivos?', correcta:'Carbono, hidrógeno, oxígeno y nitrógeno', opts:['Oro, plata y cobre','Helio y neón','Solo el hierro'] },
  { pregunta:'¿Por qué el carbono es especialmente importante para formar las moléculas de los seres vivos?', correcta:'Porque puede formar muchos enlaces y combinarse de formas muy diversas con otros átomos', opts:['Porque es el elemento más pesado de la tabla periódica','Porque no puede formar ningún enlace químico','Porque solo existe en forma de gas'] },
  { pregunta:'¿Qué elemento, presente en el agua y esencial para respirar, es necesario para la mayoría de los seres vivos?', correcta:'El oxígeno', opts:['El carbono','El nitrógeno','El hidrógeno únicamente'] },
];
export function genAtomoTabla8Round(){
  const recurso = 'El modelo del <b>átomo</b> ha cambiado a lo largo de la historia, a medida que se hicieron nuevos descubrimientos: Dalton propuso que la materia está formada por partículas indivisibles; Thomson descubrió que el átomo contiene electrones (carga negativa) dentro de una esfera con carga positiva; Rutherford, con su experimento de la lámina de oro, descubrió que el átomo tiene un núcleo pequeño y denso rodeado de espacio vacío; y Bohr propuso que los electrones giran alrededor del núcleo en órbitas definidas. El átomo tiene tres partículas principales: el <b>protón</b> (carga positiva, en el núcleo), el <b>neutrón</b> (sin carga, en el núcleo) y el <b>electrón</b> (carga negativa, fuera del núcleo). La <b>tabla periódica</b> organiza todos los elementos químicos conocidos según sus propiedades, y elementos como el carbono, hidrógeno, oxígeno y nitrógeno son esenciales para formar las moléculas de los seres vivos.';
  const item = pick(ATOMO_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/ciencias-naturales/1-medio
   — OA01-20 (Biología OA01-08, Física OA09-16, Química OA17-20). Ningún OA
   queda fuera del motor de opción múltiple este año: los 20 son observables,
   explicativos o de evidencia científica, sin componente de producción
   práctica ni de vivencia personal. */
export const CIENCIAS_MODULES_M1 = [
  {id:'evolucionm1', label:'Evidencias de la Evolución', open:true, key:'evolucionm1'},
  {id:'ecosistemaspoblacionesm1', label:'Ecosistemas y Poblaciones', open:true, key:'ecosistemaspoblacionesm1'},
  {id:'ciclosimpactom1', label:'Ciclos de Materia e Impacto Humano', open:true, key:'ciclosimpactom1'},
  {id:'ondassonidom1', label:'Ondas: Sonido y Sismología', open:true, key:'ondassonidom1'},
  {id:'luzsentidosm1', label:'La Luz y los Sentidos', open:true, key:'luzsentidosm1'},
  {id:'sistemasolarm1', label:'Sistema Solar y Universo', open:true, key:'sistemasolarm1'},
  {id:'reaccionesquimicasm1', label:'Reacciones Químicas', open:true, key:'reaccionesquimicasm1'},
  {id:'compuestosestequiometriam1', label:'Compuestos y Estequiometría', open:true, key:'compuestosestequiometriam1'},
];
export const CIENCIAS_POS_M1 = [
  {x:24,y:94},{x:68,y:84},{x:24,y:74},{x:68,y:64},{x:24,y:54},{x:68,y:44},{x:24,y:34},{x:68,y:24}
];
const EVOLUCION_M1_BANK = [
  { pregunta:'¿Cómo se forman los fósiles?', correcta:'A partir de restos de animales o plantas que quedan atrapados y se conservan en rocas sedimentarias', opts:['A partir de rocas volcánicas recién formadas','Únicamente en el fondo de los volcanes activos','A partir de organismos vivos actuales'] },
  { pregunta:'¿Cómo se ordenan los fósiles según su antigüedad dentro de las rocas?', correcta:'Según su ubicación en los estratos: los más profundos suelen ser más antiguos', opts:['Según su color, sin relación con la profundidad','Al azar, sin ningún patrón','Siempre en el mismo estrato, sin importar la edad'] },
  { pregunta:'¿Qué evidencia aporta el registro fósil para entender la evolución de las especies?', correcta:'Muestra cambios graduales en los organismos a lo largo de largos períodos de tiempo', opts:['Demuestra que todas las especies aparecieron al mismo tiempo','No aporta ninguna evidencia útil','Solo muestra organismos que nunca cambiaron'] },
  { pregunta:'¿Qué son las "estructuras homólogas", evidencia de un antepasado común entre especies?', correcta:'Estructuras con un origen y diseño similar en distintas especies, aunque cumplan funciones distintas (como el brazo humano y el ala de un murciélago)', opts:['Estructuras que se ven idénticas pero no tienen ningún origen común','Órganos que solo existen en una especie','Estructuras que cambian de función cada generación'] },
  { pregunta:'¿Qué evidencia aportan las secuencias de ADN para estudiar la evolución?', correcta:'Mientras más parecidas son las secuencias de ADN entre dos especies, más cercano es su parentesco evolutivo', opts:['El ADN no aporta ninguna información sobre evolución','Todas las especies tienen exactamente el mismo ADN','El ADN solo sirve para identificar personas'] },
  { pregunta:'¿Qué propusieron Darwin y Wallace sobre cómo cambian las especies con el tiempo?', correcta:'La selección natural: los individuos mejor adaptados a su ambiente tienen más probabilidad de sobrevivir y reproducirse', opts:['Que todas las especies fueron creadas exactamente iguales para siempre','Que el ambiente nunca influye en la supervivencia','Que solo el azar determina qué especies existen'] },
  { pregunta:'¿En qué se basa la clasificación taxonómica de los seres vivos?', correcta:'En criterios que organizan a los organismos en grupos y subgrupos según su parentesco evolutivo', opts:['Únicamente en el tamaño de cada organismo','En el color de cada especie, sin ningún otro criterio','En el orden alfabético de sus nombres'] },
  { pregunta:'¿Qué información puede dar la embriología sobre el parentesco evolutivo entre especies?', correcta:'Especies emparentadas pueden mostrar etapas embrionarias muy similares entre sí', opts:['El desarrollo embrionario nunca se parece entre especies distintas','La embriología no tiene relación con la evolución','Todos los embriones son exactamente iguales entre todas las especies'] },
  { pregunta:'¿Qué relación de parentesco busca establecer la clasificación en grupos y subgrupos taxonómicos?', correcta:'Relaciones de parentesco ancestral entre los distintos organismos', opts:['Ninguna relación real entre los organismos','Solo relaciones basadas en el hábitat actual','Relaciones basadas exclusivamente en el tamaño'] },
];
export function genEvolucionM1Round(){
  const recurso = 'La evolución de las especies se sostiene en varias líneas de evidencia científica. Los <b>fósiles</b> se forman cuando restos de animales o plantas quedan atrapados y se conservan en rocas sedimentarias, ubicándose en distintos estratos según su antigüedad (los más profundos suelen ser más antiguos) — el registro fósil muestra cambios graduales en los organismos a través del tiempo. Otras evidencias incluyen las <b>estructuras homólogas</b> (un origen y diseño similar en distintas especies, aunque cumplan funciones distintas, como el brazo humano y el ala de un murciélago), la <b>embriología</b> (especies emparentadas pueden mostrar etapas embrionarias parecidas) y las <b>secuencias de ADN</b> (mientras más se parecen, más cercano es el parentesco evolutivo). <b>Darwin y Wallace</b> propusieron el mecanismo central de este proceso: la <b>selección natural</b>, donde los individuos mejor adaptados a su ambiente tienen más probabilidades de sobrevivir y reproducirse. Toda esta evidencia se organiza mediante la <b>clasificación taxonómica</b>, que agrupa a los organismos en grupos y subgrupos según su parentesco ancestral.';
  const item = pick(EVOLUCION_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ECOSISTEMAS_POBLACIONES_M1_BANK = [
  { pregunta:'¿Qué niveles de organización existen dentro de un ecosistema, de lo más simple a lo más complejo?', correcta:'Individuo, población, comunidad y ecosistema', opts:['Célula, órgano, sistema y organismo, únicamente','Átomo, molécula y célula, únicamente','País, continente y planeta'] },
  { pregunta:'¿Qué tipo de interacción biológica es la que existe entre un león y la gacela que caza?', correcta:'Depredación', opts:['Mutualismo','Comensalismo','Competencia'] },
  { pregunta:'¿Qué tipo de interacción biológica beneficia a ambas especies involucradas, como una abeja y una flor?', correcta:'Mutualismo', opts:['Depredación','Parasitismo','Competencia'] },
  { pregunta:'¿Qué ecosistema chileno se caracteriza por su extrema aridez y biodiversidad adaptada a la falta de agua?', correcta:'El desierto de Atacama', opts:['El bosque valdiviano','La estepa patagónica','El humedal del Yali'] },
  { pregunta:'¿Qué factor puede reducir drásticamente el tamaño de una población animal?', correcta:'Enfermedades, escasez de recursos alimentarios, o sequías prolongadas', opts:['Un exceso indefinido de recursos sin ningún límite','La ausencia total de depredadores para siempre','El clima perfecto sin ninguna variación'] },
  { pregunta:'¿Qué consecuencia ecosistémica puede tener la disminución brusca de una población clave, como un depredador tope?', correcta:'Puede alterar el equilibrio de todo el ecosistema, afectando a otras especies relacionadas', opts:['No genera ningún efecto en el resto del ecosistema','Siempre mejora automáticamente a todas las demás especies','Elimina por completo la necesidad de recursos alimentarios'] },
  { pregunta:'¿Qué tipo de interacción es la que existe entre dos especies que buscan el mismo recurso limitado, como el agua?', correcta:'Competencia', opts:['Mutualismo','Depredación','Comensalismo'] },
  { pregunta:'¿Qué ecosistema chileno se ubica en el extremo sur y se caracteriza por bosques siempreverdes y alta humedad?', correcta:'El bosque valdiviano', opts:['El desierto de Atacama','La estepa patagónica','El altiplano'] },
  { pregunta:'¿Qué factor puede predecirse al analizar cómo cambian los recursos alimentarios disponibles para una población?', correcta:'Cómo variará el tamaño de esa población en el futuro', opts:['El color de las nuevas crías de esa especie','El clima de otro continente','El nombre científico de la especie'] },
];
export function genEcosistemasPoblacionesM1Round(){
  const recurso = 'Un <b>ecosistema</b> se organiza en niveles: el individuo, la población (individuos de la misma especie en un lugar), la comunidad (distintas poblaciones que interactúan) y el ecosistema completo (comunidad más el ambiente físico). Dentro de un ecosistema existen distintos tipos de <b>interacciones biológicas</b>: la depredación (una especie caza a otra), el mutualismo (ambas especies se benefician, como una abeja y una flor), y la competencia (dos especies buscan el mismo recurso limitado). Chile tiene ecosistemas muy diversos, como el desierto de Atacama (extrema aridez) o el bosque valdiviano (siempreverde y húmedo). El <b>tamaño de una población</b> puede verse afectado por factores como enfermedades, escasez de recursos alimentarios o sequías prolongadas, y estos cambios pueden alterar el equilibrio de todo el ecosistema, afectando a otras especies relacionadas.';
  const item = pick(ECOSISTEMAS_POBLACIONES_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const CICLOS_IMPACTO_M1_BANK = [
  { pregunta:'¿Qué son los "ciclos biogeoquímicos", como el ciclo del agua, del carbono o del nitrógeno?', correcta:'Procesos por los cuales elementos y compuestos se reciclan continuamente entre los seres vivos y el ambiente', opts:['Procesos que ocurren solo una vez y luego desaparecen','Ciclos que afectan únicamente a las rocas, sin relación con los seres vivos','Un fenómeno exclusivo de los océanos'] },
  { pregunta:'¿Qué rol cumple la fotosíntesis en el flujo de energía del ecosistema?', correcta:'Captura la energía del sol y la transforma en energía química (alimento), la base de casi todas las cadenas alimentarias', opts:['Libera energía sin producir ningún alimento','No tiene relación con el flujo de energía del ecosistema','Consume energía sin generar ningún beneficio'] },
  { pregunta:'¿Qué rol cumple la respiración celular en el ciclo de la materia y la energía?', correcta:'Libera la energía almacenada en el alimento, y devuelve dióxido de carbono al ambiente', opts:['Solo ocurre en las plantas, nunca en los animales','No libera ningún tipo de energía','Elimina completamente el dióxido de carbono del planeta'] },
  { pregunta:'¿Qué es la "bioacumulación" de un contaminante a lo largo de una cadena alimentaria?', correcta:'El aumento de la concentración de un contaminante en los organismos a medida que se sube de nivel trófico', opts:['La eliminación total de contaminantes en los niveles altos','Un proceso que solo afecta a las plantas','La disminución constante del contaminante en cada nivel'] },
  { pregunta:'¿Qué acción humana puede alterar significativamente el equilibrio de un ecosistema?', correcta:'La contaminación, la deforestación o la sobreexplotación de recursos naturales', opts:['Plantar árboles nativos en una zona degradada','Reducir el consumo de agua en el hogar','Reciclar los residuos domésticos'] },
  { pregunta:'¿Qué busca lograr el "desarrollo sustentable" frente al impacto humano en los ecosistemas?', correcta:'Satisfacer las necesidades actuales sin comprometer los recursos de las futuras generaciones', opts:['Usar todos los recursos disponibles sin ninguna restricción','Detener por completo cualquier actividad humana','Ignorar el estado de los ecosistemas'] },
  { pregunta:'¿Qué fenómeno natural también puede afectar la disponibilidad de recursos en un ecosistema, sin intervención humana?', correcta:'Sequías, erupciones volcánicas u otros fenómenos naturales', opts:['Solamente la actividad humana afecta a los ecosistemas','Ningún fenómeno natural afecta jamás a un ecosistema','Solo el ser humano puede alterar los recursos disponibles'] },
  { pregunta:'¿Qué elemento circula entre la atmósfera, los seres vivos y el suelo en el ciclo del carbono?', correcta:'El dióxido de carbono y otros compuestos de carbono', opts:['Únicamente el oxígeno puro','El nitrógeno gaseoso exclusivamente','El vapor de agua únicamente'] },
];
export function genCiclosImpactoM1Round(){
  const recurso = 'Los <b>ciclos biogeoquímicos</b> (como el ciclo del agua, del carbono o del nitrógeno) son procesos por los cuales elementos y compuestos se reciclan continuamente entre los seres vivos y el ambiente. Dentro de este flujo, la <b>fotosíntesis</b> captura la energía del sol y la transforma en energía química (alimento), mientras la <b>respiración celular</b> libera esa energía y devuelve dióxido de carbono al ambiente — juntas, son la base del flujo de energía en casi todas las cadenas alimentarias. Cuando un contaminante entra a este flujo, puede sufrir <b>bioacumulación</b>: su concentración aumenta en los organismos a medida que se sube de nivel trófico. Acciones humanas como la contaminación, la deforestación o la sobreexplotación de recursos pueden alterar seriamente el equilibrio de un ecosistema, por eso el <b>desarrollo sustentable</b> busca satisfacer las necesidades actuales sin comprometer los recursos de las futuras generaciones.';
  const item = pick(CICLOS_IMPACTO_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const ONDAS_SONIDO_M1_BANK = [
  { pregunta:'¿Qué es la "reflexión" de una onda?', correcta:'Cuando la onda rebota al chocar con una superficie, cambiando de dirección', opts:['Cuando la onda desaparece por completo','Cuando la onda cambia de velocidad al pasar de un medio a otro','Cuando la onda pierde toda su energía de inmediato'] },
  { pregunta:'¿Qué es la "refracción" de una onda?', correcta:'Cuando la onda cambia de dirección y de velocidad al pasar de un medio a otro', opts:['Cuando la onda rebota sin cambiar de medio','Cuando la onda se detiene completamente','Cuando la onda se transforma en materia'] },
  { pregunta:'¿Qué es el "eco", un fenómeno del sonido explicado por el modelo ondulatorio?', correcta:'La reflexión del sonido en una superficie, que hace que se escuche repetido tras un retraso', opts:['Un sonido que nunca se puede escuchar','Un tipo de luz reflejada','La ausencia total de sonido en un lugar'] },
  { pregunta:'¿Qué es la "resonancia" del sonido?', correcta:'Cuando un objeto vibra con mayor intensidad al recibir ondas sonoras de una frecuencia igual a la suya', opts:['Cuando dos sonidos se cancelan por completo','Un sonido que solo ocurre bajo el agua','La ausencia de vibración en cualquier objeto'] },
  { pregunta:'¿Qué es el "efecto Doppler" aplicado al sonido, como el de una ambulancia que se acerca y se aleja?', correcta:'El cambio percibido en la frecuencia (el tono) de un sonido según si la fuente se acerca o se aleja', opts:['Un sonido que siempre suena igual sin importar el movimiento','La desaparición total del sonido al moverse','Un fenómeno que solo ocurre con la luz'] },
  { pregunta:'¿Qué es una onda sísmica, en términos del modelo ondulatorio?', correcta:'Energía que se propaga a través de la Tierra tras liberarse en un terremoto', opts:['Un tipo de onda que solo existe en el mar','Una onda que jamás se puede medir','Un fenómeno exclusivamente relacionado con el sonido de los animales'] },
  { pregunta:'¿Qué parámetro mide la magnitud de un terremoto, relacionado con la energía liberada?', correcta:'La escala de magnitud (como la escala de Richter o momento sísmico)', opts:['La temperatura del ambiente','El color del cielo en ese momento','La cantidad de lluvia caída ese día'] },
  { pregunta:'¿Qué consecuencias puede tener la propagación de la energía sísmica sobre el territorio y la sociedad?', correcta:'Daños en construcciones e infraestructura, y riesgos para la población si no existe prevención adecuada', opts:['Ningún efecto sobre el territorio ni la sociedad','Solo afecta a los océanos, nunca a las ciudades','Mejora automáticamente la infraestructura existente'] },
];
export function genOndasSonidoM1Round(){
  const recurso = 'Las <b>ondas</b> transmiten energía sin transportar materia, y pueden sufrir reflexión (rebotan al chocar con una superficie), refracción (cambian de dirección y velocidad al pasar de un medio a otro) o absorción (pierden energía en el medio). El <b>sonido</b>, que es una onda, explica fenómenos como el eco (reflexión del sonido que se escucha repetido), la resonancia (un objeto vibra con más fuerza al recibir ondas de su misma frecuencia) y el efecto Doppler (el cambio de tono percibido cuando la fuente de sonido se acerca o se aleja, como una ambulancia). Las <b>ondas sísmicas</b> son energía que se propaga a través de la Tierra tras liberarse en un terremoto; su magnitud se mide con escalas específicas, y su propagación puede causar daños importantes en construcciones e infraestructura, por lo que la prevención sísmica es clave en países como Chile.';
  const item = pick(ONDAS_SONIDO_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const LUZ_SENTIDOS_M1_BANK = [
  { pregunta:'¿Qué modelo explica mejor el comportamiento de la luz, combinando dos naturalezas?', correcta:'El modelo corpuscular-ondulatorio (la luz se comporta como partícula y como onda)', opts:['El modelo exclusivamente de partículas sólidas','Un modelo que niega cualquier propiedad de la luz','El modelo que dice que la luz no se propaga nunca'] },
  { pregunta:'¿Qué es la "interferencia" de la luz?', correcta:'Cuando dos o más ondas de luz se superponen, sumándose o cancelándose entre sí', opts:['Cuando la luz se detiene completamente','Cuando la luz cambia de color sin ninguna razón','Un fenómeno que solo ocurre con el sonido'] },
  { pregunta:'¿Cómo se forman las imágenes que vemos gracias a la luz reflejada?', correcta:'Los rayos de luz rebotan en los objetos y llegan a nuestros ojos, permitiendo formar una imagen', opts:['Los objetos emiten sonido en vez de luz','Las imágenes se forman sin ninguna luz involucrada','Solo se pueden ver objetos que producen su propia luz'] },
  { pregunta:'¿Qué estructura del ojo humano recibe la luz y la convierte en señales que el cerebro puede interpretar?', correcta:'La retina', opts:['El párpado','La ceja','El iris únicamente'] },
  { pregunta:'¿Qué estructura del oído humano recibe las ondas sonoras y las transforma en señales nerviosas?', correcta:'El oído interno (la cóclea)', opts:['El pabellón auricular únicamente','El lóbulo de la oreja','El cabello del oído'] },
  { pregunta:'¿Qué limita el "espectro" de sonidos que el oído humano puede percibir?', correcta:'El oído humano solo percibe un rango limitado de frecuencias, y hay sonidos (como los ultrasonidos) que no puede oír', opts:['El oído humano puede escuchar absolutamente todas las frecuencias existentes','El oído humano no tiene ningún límite de percepción','Solo los animales pueden escuchar sonidos'] },
  { pregunta:'¿Qué tecnología corrige limitaciones visuales, como la miopía o la hipermetropía?', correcta:'Lentes ópticos (anteojos o lentes de contacto)', opts:['Únicamente cirugías sin ningún otro método','Ninguna tecnología puede corregir la visión','Solo remedios naturales sin base científica'] },
  { pregunta:'¿Qué tecnología ayuda a personas con limitaciones auditivas a percibir mejor el sonido?', correcta:'Audífonos o implantes cocleares', opts:['Únicamente el uso de lentes ópticos','Ninguna tecnología existe para este propósito','Solo aparatos para medir la temperatura'] },
];
export function genLuzSentidosM1Round(){
  const recurso = 'La <b>luz</b> se explica mediante un modelo corpuscular-ondulatorio (se comporta como partícula y como onda a la vez), y presenta fenómenos como la reflexión, la refracción y la <b>interferencia</b> (cuando dos o más ondas de luz se superponen, sumándose o cancelándose). Vemos los objetos porque la luz rebota en ellos y llega a nuestros ojos, donde la <b>retina</b> recibe esa luz y la convierte en señales que el cerebro interpreta como imágenes. De forma similar, el <b>oído</b> recibe ondas sonoras a través del oído interno (la cóclea), que las transforma en señales nerviosas — aunque el oído humano solo percibe un rango limitado de frecuencias (por ejemplo, no puede oír ultrasonidos). Cuando estos sentidos tienen limitaciones, existen tecnologías correctivas: lentes ópticos para problemas de visión (como miopía o hipermetropía), y audífonos o implantes cocleares para problemas de audición.';
  const item = pick(LUZ_SENTIDOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const SISTEMA_SOLAR_M1_BANK = [
  { pregunta:'¿Qué provoca las fases de la Luna que vemos desde la Tierra?', correcta:'La posición relativa de la Luna, la Tierra y el Sol, que hace variar cuánta parte iluminada de la Luna vemos', opts:['Un cambio real en la forma física de la Luna','Que la Luna se apaga y se enciende cada noche','Nubes que tapan distintas partes de la Luna'] },
  { pregunta:'¿Qué causa un eclipse solar?', correcta:'La Luna se ubica entre el Sol y la Tierra, bloqueando parcial o totalmente la luz solar', opts:['La Tierra se ubica entre el Sol y la Luna','El Sol desaparece momentáneamente','Un cambio en la órbita de otro planeta'] },
  { pregunta:'¿Qué causa un eclipse lunar?', correcta:'La Tierra se ubica entre el Sol y la Luna, proyectando su sombra sobre la Luna', opts:['La Luna se ubica entre el Sol y la Tierra','El Sol se apaga temporalmente','Un cambio en la rotación de la Luna'] },
  { pregunta:'¿Qué provoca las estaciones del año en la Tierra?', correcta:'La inclinación del eje terrestre combinada con su traslación alrededor del Sol', opts:['La distancia entre la Tierra y la Luna','La rotación de otros planetas del sistema solar','Un cambio en el tamaño del Sol cada cierto tiempo'] },
  { pregunta:'¿Qué diferencia principal existe entre un asteroide y un cometa?', correcta:'El cometa está compuesto principalmente de hielo y polvo, y desarrolla una "cola" al acercarse al Sol; el asteroide es rocoso y no desarrolla cola', opts:['No existe ninguna diferencia entre ambos','El asteroide siempre es más grande que cualquier planeta','El cometa nunca se mueve, a diferencia del asteroide'] },
  { pregunta:'¿Qué es una "nebulosa" en el universo?', correcta:'Una nube de gas y polvo en el espacio, donde pueden formarse nuevas estrellas', opts:['Un tipo de planeta rocoso','Una estrella que ya se apagó por completo','Un satélite artificial'] },
  { pregunta:'¿Qué es una "galaxia"?', correcta:'Un enorme conjunto de estrellas, gas, polvo y sistemas planetarios unidos por la gravedad', opts:['Un solo planeta muy grande','Una nube pequeña de polvo espacial','Un tipo de cometa gigante'] },
  { pregunta:'¿Qué condiciones son importantes para que un lugar en la Tierra permita una buena investigación astronómica?', correcta:'Cielos despejados, baja contaminación lumínica y poca humedad', opts:['Mucha lluvia y nubosidad constante','Ciudades muy iluminadas cerca del observatorio','Cualquier condición climática es igual de útil'] },
  { pregunta:'¿Por qué el norte de Chile es reconocido mundialmente por sus observatorios astronómicos?', correcta:'Por sus cielos despejados casi todo el año, la altura y la baja contaminación lumínica del desierto de Atacama', opts:['Porque tiene el clima más lluvioso del planeta','Porque está cerca del océano únicamente','Por el tamaño de sus ciudades'] },
];
export function genSistemaSolarM1Round(){
  const recurso = 'Los movimientos de la Tierra y la Luna explican varios fenómenos astronómicos: las <b>fases de la Luna</b> dependen de la posición relativa entre Luna, Tierra y Sol (cuánta parte iluminada de la Luna alcanzamos a ver); un <b>eclipse solar</b> ocurre cuando la Luna se ubica entre el Sol y la Tierra, bloqueando su luz; un <b>eclipse lunar</b> ocurre cuando es la Tierra la que se ubica entre el Sol y la Luna; y las <b>estaciones del año</b> se deben a la inclinación del eje terrestre combinada con su traslación alrededor del Sol. Más allá del sistema solar, el universo contiene estructuras como cometas (hielo y polvo, con "cola" visible), asteroides (rocosos, sin cola), nebulosas (nubes de gas y polvo donde nacen estrellas) y galaxias (enormes conjuntos de estrellas unidos por gravedad). Chile es reconocido mundialmente por su <b>investigación astronómica</b>, gracias a los cielos despejados, la altura y la baja contaminación lumínica del desierto de Atacama, condiciones ideales para instalar observatorios.';
  const item = pick(SISTEMA_SOLAR_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const REACCIONES_QUIMICAS_M1_BANK = [
  { pregunta:'¿Qué tipo de proceso es la fermentación, como la que transforma el jugo de uva en vino?', correcta:'Una reacción química, donde microorganismos transforman sustancias en otras nuevas', opts:['Un simple cambio de temperatura sin ninguna reacción','Un cambio de estado físico, sin transformación química','Un proceso que no involucra ninguna sustancia nueva'] },
  { pregunta:'¿Qué tipo de proceso ocurre en la combustión provocada por un motor o un calefactor?', correcta:'Una reacción química donde un combustible reacciona con oxígeno, liberando energía', opts:['Un cambio de estado físico exclusivamente','Un proceso donde no se forma ninguna sustancia nueva','Un fenómeno puramente mecánico sin ninguna química involucrada'] },
  { pregunta:'¿Qué tipo de proceso es la oxidación de un metal, como el óxido que aparece en un clavo de fierro?', correcta:'Una reacción química entre el metal y el oxígeno del ambiente', opts:['Un simple cambio de color sin ninguna reacción química','Un proceso que ocurre solo en el espacio, nunca en la Tierra','Un cambio de estado físico del metal'] },
  { pregunta:'¿Qué tienen en común la fermentación, la combustión y la oxidación de metales?', correcta:'Las tres son reacciones químicas: forman sustancias nuevas distintas a las originales', opts:['Ninguna de las tres es una reacción química','Las tres ocurren únicamente a temperaturas muy bajas','Ninguna de las tres libera ni consume energía'] },
  { pregunta:'¿Qué establece la ley de conservación de la masa en una reacción química?', correcta:'La masa total de los reactantes es igual a la masa total de los productos formados', opts:['La masa siempre desaparece por completo en una reacción química','La masa de los productos siempre es mayor que la de los reactantes, sin excepción','La masa nunca se puede medir en una reacción química'] },
  { pregunta:'¿Qué ocurre con los átomos durante una reacción química, según el modelo de conservación atómica?', correcta:'Los átomos se reorganizan para formar nuevas sustancias, pero no desaparecen ni se crean nuevos átomos', opts:['Los átomos desaparecen por completo durante la reacción','Se crean átomos completamente nuevos de la nada','Los átomos dejan de existir físicamente'] },
  { pregunta:'¿Por qué la masa total se conserva aunque una reacción química libere gases que no vemos, como en la combustión?', correcta:'Porque esos gases también tienen masa, aunque sean invisibles a simple vista', opts:['Porque los gases no tienen ninguna masa','Porque la masa realmente desaparece en esos casos','Porque la ley de conservación de la masa no aplica a los gases'] },
  { pregunta:'¿Qué evidencia observable indica que ocurrió una reacción química, y no solo un cambio físico?', correcta:'La formación de una sustancia nueva, un cambio de color, liberación de gas, o desprendimiento de calor', opts:['Que el objeto simplemente cambió de forma','Que el objeto se movió de lugar','Ningún cambio observable indica una reacción química'] },
  { pregunta:'¿Por qué la fermentación se considera diferente de simplemente dejar reposar un líquido sin ningún cambio?', correcta:'Porque microorganismos transforman químicamente las sustancias originales en otras nuevas, como alcohol o ácido', opts:['Porque el líquido solo cambia de temperatura','Porque no ocurre ningún cambio real','Porque es exactamente lo mismo que dejarlo reposar'] },
];
export function genReaccionesQuimicasM1Round(){
  const recurso = 'La <b>fermentación</b> (como la que transforma el jugo de uva en vino), la <b>combustión</b> (provocada por un motor o un calefactor) y la <b>oxidación de metales</b> (como el óxido en un clavo de fierro) son ejemplos de <b>reacciones químicas</b>: procesos donde las sustancias originales se transforman en sustancias nuevas, distintas a las de partida. En toda reacción química se cumple la <b>ley de conservación de la masa</b>: la masa total de los reactantes (lo que había antes de la reacción) es igual a la masa total de los productos (lo que queda después) — esto ocurre porque los átomos involucrados se reorganizan para formar nuevas sustancias, pero no desaparecen ni se crean átomos nuevos de la nada. Incluso cuando una reacción libera gases invisibles (como en la combustión), esos gases también tienen masa, por lo que la masa total sigue conservándose.';
  const item = pick(REACCIONES_QUIMICAS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

const COMPUESTOS_ESTEQUIOMETRIA_M1_BANK = [
  { pregunta:'¿Qué fuerza mantiene unidas a las partículas para formar un compuesto binario, como la sal (cloruro de sodio)?', correcta:'Fuerzas eléctricas de atracción entre partículas con cargas opuestas', opts:['La gravedad exclusivamente','Ninguna fuerza: se unen al azar','Fuerzas magnéticas provenientes del núcleo terrestre'] },
  { pregunta:'¿Qué es un "compuesto binario", como el agua (H₂O)?', correcta:'Un compuesto formado por la combinación de solo dos elementos químicos distintos', opts:['Un compuesto formado por un solo elemento','Un compuesto formado por exactamente diez elementos','Cualquier sustancia que contenga carbono'] },
  { pregunta:'¿Qué es un "compuesto ternario", como el bicarbonato de sodio?', correcta:'Un compuesto formado por la combinación de tres elementos químicos distintos', opts:['Un compuesto formado por un solo elemento','Un compuesto formado por exactamente dos elementos','Cualquier sustancia líquida'] },
  { pregunta:'¿Para qué sirve la nomenclatura inorgánica al nombrar compuestos químicos?', correcta:'Para identificar de forma clara y estandarizada qué elementos forman un compuesto y en qué proporción', opts:['Únicamente para decorar los libros de química','No tiene ninguna utilidad práctica','Para calcular la temperatura de una sustancia'] },
  { pregunta:'¿Qué estudia la "estequiometría" en una reacción química?', correcta:'Las relaciones cuantitativas (cantidades) entre los reactantes y los productos de una reacción', opts:['Únicamente el color de las sustancias involucradas','El tiempo que tarda en enfriarse una sustancia','La forma física de los recipientes usados'] },
  { pregunta:'¿Para qué se usa la estequiometría en la industria química, por ejemplo al fabricar un medicamento?', correcta:'Para calcular exactamente cuánta cantidad de cada reactante se necesita para obtener la cantidad deseada de producto', opts:['Para elegir el color del envase del producto final','Para decidir el precio de venta del producto','Para calcular solamente el peso del envase'] },
  { pregunta:'¿Qué información entrega la fórmula química de un compuesto, como la del agua (H₂O)?', correcta:'Qué elementos lo componen y en qué proporción (2 átomos de hidrógeno por 1 de oxígeno)', opts:['Únicamente el color del compuesto','El precio de mercado del compuesto','La temperatura ambiente del lugar donde se formó'] },
  { pregunta:'¿Por qué se dice que la nomenclatura química es un "lenguaje universal" entre científicos de distintos países?', correcta:'Porque permite identificar el mismo compuesto sin importar el idioma que hable cada científico', opts:['Porque todos los científicos hablan el mismo idioma natural','Porque solo se usa en un país específico','Porque no tiene ninguna función real'] },
  { pregunta:'¿Qué error podría ocurrir en la fabricación de un medicamento si no se aplican correctamente los cálculos estequiométricos?', correcta:'Que la dosis del producto final resulte incorrecta, ya sea insuficiente o excesiva', opts:['Ningún error es posible una vez elegidos los reactantes','El medicamento cambiaría de color únicamente','El precio de venta subiría automáticamente'] },
];
export function genCompuestosEstequiometriaM1Round(){
  const recurso = 'Los <b>compuestos binarios</b> (formados por dos elementos, como el agua H₂O) y los <b>compuestos ternarios</b> (formados por tres elementos, como el bicarbonato de sodio) se forman gracias a fuerzas eléctricas de atracción entre partículas con cargas opuestas. La <b>nomenclatura inorgánica</b> es el sistema de reglas que permite nombrar estos compuestos de forma clara y estandarizada, identificando qué elementos los componen y en qué proporción. La <b>estequiometría</b> estudia las relaciones cuantitativas entre los reactantes y los productos de una reacción química: permite calcular exactamente cuánta cantidad de cada sustancia se necesita para obtener la cantidad deseada de producto final, algo esencial en la industria química, por ejemplo al fabricar un medicamento con dosis exactas.';
  const item = pick(COMPUESTOS_ESTEQUIOMETRIA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

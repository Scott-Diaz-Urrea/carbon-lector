import { pick, shuffle } from '../../utils.js';
import { vidrioSVG, espejoSVG, semillaSVG, crisalidaSVG, piedraSVG } from '../../svg.js';

/* Núcleo Exploración del Entorno Natural — Educación Parvularia, NT (Decreto
   481/2017, ámbito Interacción y Comprensión del Entorno,
   curriculumnacional.cl/portal/Educacion-Parvularia/Interaccion-y-comprension-del-entorno-/Exploracion-del-entorno-natural/):
   OA03 -> Agua y Sol · OA04 -> Materiales de la Naturaleza ·
   OA06 -> Animales y Plantas · OA07 -> Ciclos de Crecimiento ·
   OA11/OA12 -> Cuidado del Ambiente.
   Quedan fuera: OA01-02, OA05, OA08-10 — son de proceso de indagación propio
   (asombro, formular conjeturas, explorar cambios al aplicar fuerza/calor,
   comunicar hallazgos de una experiencia, formular conjeturas sobre mezclas):
   dependen de una experiencia de exploración vivida por el niño/a, no de un
   hecho con una única respuesta correcta evaluable con opción múltiple. */

export const EXPLORACION_ENTORNO_NATURAL_MODULES = [
  { id:'aguasolnt', label:'Agua y Sol', open:true, key:'aguasolnt' },
  { id:'materialesnaturalnt', label:'Materiales de la Naturaleza', open:true, key:'materialesnaturalnt' },
  { id:'animalesplantasnt', label:'Animales y Plantas', open:true, key:'animalesplantasnt' },
  { id:'ciclosnt', label:'Ciclos de Crecimiento', open:true, key:'ciclosnt' },
  { id:'ambientent', label:'Cuidado del Ambiente', open:true, key:'ambientent' },
];
export const EXPLORACION_ENTORNO_NATURAL_POS = [
  {x:22,y:90},{x:68,y:74},{x:24,y:56},{x:70,y:36},{x:24,y:16}
];

const AGUA_SOL_BANK = [
  { pregunta:'¿Qué necesita una planta para crecer sana?', correcta:'💧 Agua', opts:[piedraSVG(22)+' Piedras','🧂 Sal','🔧 Herramientas'] },
  { pregunta:'¿Qué nos da calor y luz durante el día?', correcta:'☀️ El sol', opts:['🌙 La luna','⭐ Las estrellas','☁️ Las nubes'] },
  { pregunta:'¿Qué necesitan las personas y animales para vivir?', correcta:'💧 Agua', opts:['🍬 Dulces','🎈 Globos','🧸 Juguetes'] },
  { pregunta:'¿De dónde viene la luz que ayuda a crecer a las plantas?', correcta:'☀️ El sol', opts:['💡 Una ampolleta','🕯️ Una vela','🔦 Una linterna'] },
  { pregunta:'¿Qué le pasa a la ropa mojada si la dejamos al sol?', correcta:'☀️ Se seca', opts:['🌙 Se moja más','❄️ Se congela','🎈 Vuela'] },
  { pregunta:'¿Qué le pasa a un helado si lo dejamos al sol?', correcta:'🍦 Se derrite', opts:[piedraSVG(22)+' Se pone duro','🥶 Se congela más','📚 No le pasa nada'] },
  { pregunta:'¿Dónde encontramos agua en la naturaleza?', correcta:'🌊 En el mar y los ríos', opts:['🌵 En el desierto seco','🔥 En el fuego',piedraSVG(22)+' En las piedras'] },
  { pregunta:'¿Qué debemos beber todos los días para estar sanos?', correcta:'💧 Agua', opts:['🥤 Solo bebidas','🍬 Solo dulces','☕ Solo café'] },
];

/* la piedra/RÍGIDA, la corteza/RUGOSA y la arena/ÁSPERA (antes RÍGIDO/
   RUGOSO/ÁSPERO): esos tres sustantivos son femeninos, así que el adjetivo
   masculino hacía que el explain generado ("La piedra es rígido.") saliera
   gramaticalmente incorrecto — nadie más usa esas 3 palabras como
   distractor propio, así que el cambio no afecta otras entradas. 🪨/🪟/🪞
   se reemplazaron por piedraSVG()/vidrioSVG()/espejoSVG() (dibujados a
   mano, conservando el concepto original) porque no se renderizan —
   recuadro vacío — en varios navegadores. */
/* Ampliado de 8 a 10 ítems (coincidía exactamente con rounds:8, sin
   margen — ver mcEngine.js). */
const MATERIALES_NT_BANK = [
  { objeto:'el vidrio', emoji: vidrioSVG(56), prop:'TRANSPARENTE', opts:['OPACO','RUGOSO','LÍQUIDO'] },
  { objeto:'la piedra', emoji: piedraSVG(56), prop:'RÍGIDA', opts:['FLEXIBLE','SUAVE','LÍQUIDO'] },
  { objeto:'el espejo', emoji: espejoSVG(56), prop:'LISO', opts:['RUGOSO','BLANDO','TRANSPARENTE'] },
  { objeto:'la corteza del árbol', emoji:'🌳', prop:'RUGOSA', opts:['LISO','TRANSPARENTE','LÍQUIDO'] },
  { objeto:'el agua', emoji:'💧', prop:'LÍQUIDO', opts:['RÍGIDO','RUGOSO','OPACO'] },
  { objeto:'el algodón', emoji:'🧶', prop:'SUAVE', opts:['RÍGIDO','TRANSPARENTE','RUGOSO'] },
  { objeto:'el hielo', emoji:'🧊', prop:'FRÍO', opts:['CALIENTE','BLANDO','RUGOSO'] },
  { objeto:'la arena', emoji:'🏖️', prop:'ÁSPERA', opts:['LISO','LÍQUIDO','TRANSPARENTE'] },
  { objeto:'el sol', emoji:'☀️', prop:'CALIENTE', opts:['FRÍO','LÍQUIDO','BLANDO'] },
  { objeto:'la nieve', emoji:'❄️', prop:'FRÍA', opts:['CALIENTE','ÁSPERA','TRANSPARENTE'] },
];

/* Los animales solo se comparan con animales y las plantas solo con plantas
   — antes un hongo (🍄, que no es una planta) aparecía como distractor en
   la pregunta de "plantas del desierto", una categorización incorrecta. */
const ANIMALES_PLANTAS_BANK = [
  { pregunta:'¿Cuál de estos animales vive en el agua?', correcto:'🐟', label:'el pez', opts:['🐘','🦁','🐕'] },
  { pregunta:'¿Cuál de estos animales come solo plantas?', correcto:'🐰', label:'el conejo', opts:['🦁','🐺','🦈'] },
  { pregunta:'¿Cuál de estos animales es el más grande?', correcto:'🐘', label:'el elefante', opts:['🐭','🐦','🐝'] },
  { pregunta:'¿Cuál de estos animales tiene plumas?', correcto:'🐦', label:'el pájaro', opts:['🐟','🐘','🐸'] },
  { pregunta:'¿Cuál de estas plantas vive en el desierto?', correcto:'🌵', label:'el cactus', opts:['🌷','🌳','🌲'] },
  { pregunta:'¿Cuál de estos animales tiene caparazón?', correcto:'🐢', label:'la tortuga', opts:['🐦','🐘','🦋'] },
  { pregunta:'¿Cuál de estos animales sale de un huevo?', correcto:'🐦', label:'el pájaro', opts:['🐘','🦁','🐕'] },
  { pregunta:'¿Cuál de estas plantas da flores de colores?', correcto:'🌷', label:'el tulipán', opts:['🌵','🌳','🌲'] },
];

/* Semilla usa semillaSVG() en vez de 🫘 (que no se renderiza en varios
   navegadores) — no se podía usar 🌱 ahí tampoco porque ese emoji ya
   representa "Brote" en el mismo ciclo, y repetirlo confundiría a un niño
   que necesita distinguir ambas etapas. */
const MARIPOSA_CICLO = [{ emoji:'🥚', label:'Huevo', orden:1 },{ emoji:'🐛', label:'Oruga', orden:2 },{ emoji: crisalidaSVG(36), label:'Crisálida', orden:3 },{ emoji:'🦋', label:'Mariposa', orden:4 }];
const PLANTA_CICLO = [{ emoji: semillaSVG(36), label:'Semilla', orden:1 },{ emoji:'🌱', label:'Brote', orden:2 },{ emoji:'🌳', label:'Árbol', orden:3 }];
const HUMANO_CICLO = [{ emoji:'👶', label:'Bebé', orden:1 },{ emoji:'🧒', label:'Niño', orden:2 },{ emoji:'🧑', label:'Adulto', orden:3 }];
const CICLOS = [MARIPOSA_CICLO, PLANTA_CICLO, HUMANO_CICLO];

const AMBIENTE_BANK = [
  { correcta:'Separar la basura para reciclar', incorrectas:['Botar la basura al suelo','Mezclar toda la basura junta','Quemar la basura'] },
  { correcta:'Cerrar la llave del agua mientras te enjabonas', incorrectas:['Dejar la llave abierta todo el tiempo','Llenar la tina hasta el tope siempre','Jugar con la manguera sin cuidado'] },
  { correcta:'Apagar la luz cuando sales de una sala', incorrectas:['Dejar todas las luces prendidas','Dejar la tele prendida sin verla','Dejar el aire encendido todo el día'] },
  { correcta:'Plantar un árbol o una flor', incorrectas:['Arrancar las plantas del parque','Pisar las flores del jardín','Cortar árboles sin necesidad'] },
  { correcta:'Reutilizar una bolsa o envase', incorrectas:['Botar todo después de usarlo una vez','Comprar más de lo necesario','Dejar envases tirados en la calle'] },
  { correcta:'Usar ambas caras de una hoja de papel', incorrectas:['Botar el papel después de una sola línea','Desperdiciar papel nuevo sin necesidad','Quemar el papel'] },
  { correcta:'Caminar o andar en bicicleta para distancias cortas', incorrectas:['Usar siempre el auto aunque sea muy cerca','Dejar el auto encendido sin necesidad','Ensuciar las calles'] },
  { correcta:'Cuidar el agua y no dejarla correr sin usarla', incorrectas:['Dejar la manguera corriendo sola','Llenar piscinas todos los días sin necesidad','Desperdiciar el agua jugando'] },
];

export function genAguaSolNTRound(){
  const item = pick(AGUA_SOL_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta es "'+item.correcta+'".',
  };
}

export function genMaterialesNaturalNTRound(){
  const item = pick(MATERIALES_NT_BANK);
  const opts = shuffle([item.prop].concat(item.opts)).map(function(p){ return {label:p, value:p}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Cómo es '+item.objeto+'?</p>',
    options: opts, correctValue: item.prop, speakText: '¿Cómo es '+item.objeto+'?', cols:4, kind:'word',
    explain: item.objeto.charAt(0).toUpperCase()+item.objeto.slice(1)+' es <b>'+item.prop.toLowerCase()+'</b>.',
  };
}

export function genAnimalesPlantasNTRound(){
  const item = pick(ANIMALES_PLANTAS_BANK);
  const opts = shuffle([item.correcto].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcto, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+item.label+'</b> '+item.correcto+'.',
  };
}

export function genCiclosNTRound(){
  const ciclo = pick(CICLOS);
  let a = pick(ciclo), b = pick(ciclo);
  while(b.label === a.label) b = pick(ciclo);
  const askBefore = Math.random() < 0.5;
  const opts = shuffle([{label:a.emoji+' '+a.label, value:a.label},{label:b.emoji+' '+b.label, value:b.label}]);
  const earlier = a.orden < b.orden ? a : b;
  const later = a.orden < b.orden ? b : a;
  const correct = askBefore ? earlier.label : later.label;
  const cicloDisplay = ciclo.map(function(c){ return c.emoji; }).join(' → ');
  return {
    promptHTML: '<p class="prompt-count" style="font-size:26px;">'+cicloDisplay+'</p><p class="prompt-hint">'+(askBefore ? '¿Qué viene ANTES en este ciclo de vida?' : '¿Qué viene DESPUÉS en este ciclo de vida?')+'</p>',
    options: opts, correctValue: correct, speakText: askBefore ? '¿Qué viene antes?' : '¿Qué viene después?', cols:2, panel:true,
    explain: earlier.label+' viene antes que '+later.label+' en este ciclo de vida.',
  };
}

export function genAmbienteNTRound(){
  const item = pick(AMBIENTE_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones ayuda a cuidar el ambiente?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones ayuda a cuidar el ambiente?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a cuidar nuestro planeta.',
  };
}

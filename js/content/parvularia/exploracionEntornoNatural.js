import { pick, shuffle } from '../../utils.js';

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
  { pregunta:'¿Qué necesita una planta para crecer sana?', correcta:'💧 Agua', opts:['🪨 Piedras','🧂 Sal','🔧 Herramientas'] },
  { pregunta:'¿Qué nos da calor y luz durante el día?', correcta:'☀️ El sol', opts:['🌙 La luna','⭐ Las estrellas','☁️ Las nubes'] },
  { pregunta:'¿Qué necesitan las personas y animales para vivir?', correcta:'💧 Agua', opts:['🍬 Dulces','🎈 Globos','🧸 Juguetes'] },
  { pregunta:'¿De dónde viene la luz que ayuda a crecer a las plantas?', correcta:'☀️ El sol', opts:['💡 Una ampolleta','🕯️ Una vela','🔦 Una linterna'] },
];

const MATERIALES_NT_BANK = [
  { objeto:'el vidrio', emoji:'🪟', prop:'TRANSPARENTE', opts:['OPACO','RUGOSO','LÍQUIDO'] },
  { objeto:'la piedra', emoji:'🪨', prop:'RÍGIDO', opts:['FLEXIBLE','SUAVE','LÍQUIDO'] },
  { objeto:'el espejo', emoji:'🪞', prop:'LISO', opts:['RUGOSO','BLANDO','TRANSPARENTE'] },
  { objeto:'la corteza del árbol', emoji:'🌳', prop:'RUGOSO', opts:['LISO','TRANSPARENTE','LÍQUIDO'] },
  { objeto:'el agua', emoji:'💧', prop:'LÍQUIDO', opts:['RÍGIDO','RUGOSO','OPACO'] },
  { objeto:'el algodón', emoji:'🧶', prop:'SUAVE', opts:['RÍGIDO','TRANSPARENTE','RUGOSO'] },
];

const ANIMALES_PLANTAS_BANK = [
  { pregunta:'¿Cuál de estos animales vive en el agua?', correcto:'🐟', opts:['🐘','🦁','🐕'] },
  { pregunta:'¿Cuál de estos animales come solo plantas?', correcto:'🐰', opts:['🦁','🐺','🦈'] },
  { pregunta:'¿Cuál de estos animales es el más grande?', correcto:'🐘', opts:['🐭','🐦','🐝'] },
  { pregunta:'¿Cuál de estos animales tiene plumas?', correcto:'🐦', opts:['🐟','🐘','🐸'] },
  { pregunta:'¿Cuál de estas plantas vive en el desierto?', correcto:'🌵', opts:['🌷','🌳','🍄'] },
];

const MARIPOSA_CICLO = [{ emoji:'🥚', label:'Huevo', orden:1 },{ emoji:'🐛', label:'Oruga', orden:2 },{ emoji:'🦋', label:'Mariposa', orden:3 }];
const PLANTA_CICLO = [{ emoji:'🫘', label:'Semilla', orden:1 },{ emoji:'🌱', label:'Brote', orden:2 },{ emoji:'🌳', label:'Árbol', orden:3 }];
const HUMANO_CICLO = [{ emoji:'👶', label:'Bebé', orden:1 },{ emoji:'🧒', label:'Niño', orden:2 },{ emoji:'🧑', label:'Adulto', orden:3 }];
const CICLOS = [MARIPOSA_CICLO, PLANTA_CICLO, HUMANO_CICLO];

const AMBIENTE_BANK = [
  { correcta:'Separar la basura para reciclar', incorrectas:['Botar la basura al suelo','Mezclar toda la basura junta','Quemar la basura'] },
  { correcta:'Cerrar la llave del agua mientras te enjabonas', incorrectas:['Dejar la llave abierta todo el tiempo','Llenar la tina hasta el tope siempre','Jugar con la manguera sin cuidado'] },
  { correcta:'Apagar la luz cuando sales de una sala', incorrectas:['Dejar todas las luces prendidas','Dejar la tele prendida sin verla','Dejar el aire encendido todo el día'] },
  { correcta:'Plantar un árbol o una flor', incorrectas:['Arrancar las plantas del parque','Pisar las flores del jardín','Cortar árboles sin necesidad'] },
  { correcta:'Reutilizar una bolsa o envase', incorrectas:['Botar todo después de usarlo una vez','Comprar más de lo necesario','Dejar envases tirados en la calle'] },
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
    explain: 'La respuesta correcta es '+item.correcto+'.',
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

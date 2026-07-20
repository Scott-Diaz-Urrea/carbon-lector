import { pick, shuffle } from '../utils.js';

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
  { emoji:'🪨', label:'PIEDRA', vivo:false },
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
  { emoji:'🧴', label:'No lavarse las manos antes de comer', bueno:false },
  { emoji:'🚫', label:'No cepillarse nunca los dientes', bueno:false },
];
const MATERIALES_ITEMS = [
  { emoji:'🪵', object:'una mesa de madera', material:'MADERA' },
  { emoji:'🥄', object:'una cuchara de metal', material:'METAL' },
  { emoji:'🧸', object:'un juguete de peluche', material:'TELA' },
  { emoji:'🍶', object:'un vaso de vidrio', material:'VIDRIO' },
  { emoji:'🥤', object:'una botella de plástico', material:'PLÁSTICO' },
  { emoji:'🧱', object:'un muro de ladrillo', material:'LADRILLO' },
  { emoji:'📄', object:'una hoja de papel', material:'PAPEL' },
  { emoji:'🪢', object:'una cuerda de lana', material:'LANA' },
  { emoji:'🔑', object:'una llave de metal', material:'METAL' },
  { emoji:'👖', object:'unos pantalones de tela', material:'TELA' },
];
const CAMBIOS_MATERIALES = [
  { emoji:'🧊', text:'Un cubo de hielo se derrite', cause:'CALOR' },
  { emoji:'🍞', text:'El pan se tuesta en el fuego', cause:'CALOR' },
  { emoji:'👕', text:'La ropa mojada se seca al sol', cause:'CALOR' },
  { emoji:'🍫', text:'Una barra de chocolate se derrite en la mano', cause:'CALOR' },
  { emoji:'🎈', text:'Un globo se estira al inflarlo', cause:'FUERZA' },
  { emoji:'🖌️', text:'La plastilina cambia de forma al apretarla', cause:'FUERZA' },
  { emoji:'📄', text:'Una hoja de papel se arruga al apretarla con la mano', cause:'FUERZA' },
  { emoji:'🌱', text:'Una semilla crece al regarla', cause:'AGUA' },
  { emoji:'👗', text:'La ropa se moja bajo la lluvia', cause:'AGUA' },
  { emoji:'🧽', text:'Una esponja seca se hincha al mojarla', cause:'AGUA' },
  { emoji:'🌓', text:'Un afiche se decolora al dejarlo mucho tiempo al sol', cause:'LUZ' },
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

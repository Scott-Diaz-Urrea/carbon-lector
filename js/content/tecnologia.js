import { pick, shuffle } from '../utils.js';

export const TECNOLOGIA_MODULES = [
  {id:'herramientastec', label:'Herramientas y Materiales', open:true, key:'herramientastec'},
];
export const TECNOLOGIA_POS = [{x:48,y:50}];

/* ---------------- Contenido Tecnología 1° Básico ----------------
   OA02-03 -> Herramientas y Materiales. OA01,04,05,06 (diseño propio, evaluación
   de resultados, uso de software real) quedaron fuera por ser procesos prácticos
   que no se resuelven con una pregunta de opción múltiple. */
const HERRAMIENTAS_TEC = [
  { emoji:'✂️', label:'TIJERA', uso:'Sirve para cortar papel, cartón o telas.' },
  { emoji:'📏', label:'REGLA', uso:'Sirve para medir y trazar líneas rectas.' },
  { emoji:'🧴', label:'PEGAMENTO', uso:'Sirve para unir y pegar materiales.' },
  { emoji:'🖊️', label:'LÁPIZ O PLUMÓN', uso:'Sirve para marcar o dibujar sobre el material.' },
  { emoji:'🧵', label:'HILO Y AGUJA', uso:'Sirve para coser o unir telas.' },
  { emoji:'🔨', label:'MARTILLO', uso:'Sirve para clavar o unir piezas de madera.' },
];
const MATERIALES_TEC = [
  { emoji:'📄', label:'PAPEL', uso:'Material liviano que se usa para dibujar, doblar o recortar.' },
  { emoji:'🧻', label:'CARTÓN', uso:'Material firme, útil para construir maquetas y cajas.' },
  { emoji:'🧶', label:'FIBRAS O LANA', uso:'Material que sirve para tejer o decorar.' },
  { emoji:'♻️', label:'MATERIAL DE RECICLAJE', uso:'Botellas, tapas o cajas que se reutilizan para crear objetos nuevos.' },
];

/* ---------------- Contenido Tecnología 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/2-basico): TE02 OA05-07 -> Tecnología Digital
   (software de dibujo, procesador de textos, uso seguro de internet).
   Quedan fuera OA01-04 (diseñar, elaborar y evaluar un objeto tecnológico
   propio) por ser procesos prácticos de producción, no aptos para opción
   múltiple. */
export const TECNOLOGIA_MODULES_G2 = [
  {id:'tecdigital2', label:'Tecnología Digital', open:true, key:'tecdigital2'},
];
export const TECNOLOGIA_POS_G2 = [{x:48,y:50}];

/* ---------------- Contenido Tecnología 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/3-basico): TE03 OA05-07 -> Tecnología Digital III
   (software de presentación, procesador de textos, uso seguro de internet
   y buscadores). Fuera OA01-04 (diseñar/planificar/elaborar/evaluar un
   objeto tecnológico propio — producción práctica). */
export const TECNOLOGIA_MODULES_G3 = [
  {id:'tecdigital3', label:'Tecnología Digital III', open:true, key:'tecdigital3'},
];
export const TECNOLOGIA_POS_G3 = [{x:48,y:50}];

const TEC_DIGITAL_3_BANK = [
  { emoji:'📊', pregunta:'¿Para qué usarías un software de presentación?', correcta:'Para organizar y comunicar ideas a otras personas', opts:['Para escuchar música','Para cortar papel','Para hacer ejercicio'] },
  { emoji:'⌨️', pregunta:'¿Qué puedes hacer con un procesador de textos?', correcta:'Crear, editar y dar formato a un documento', opts:['Tomar fotografías','Medir la temperatura','Escuchar canciones'] },
  { emoji:'🔍', pregunta:'Al buscar información con un buscador de internet, ¿qué debes revisar?', correcta:'Que la fuente sea segura y confiable', opts:['Solo el primer resultado sin revisar','Nada, cualquier resultado sirve','El color de la página web'] },
  { emoji:'🔐', pregunta:'¿Qué es importante hacer al extraer y guardar información de internet?', correcta:'Considerar la seguridad de la fuente', opts:['Compartir tu contraseña','Descargar cualquier archivo sin revisar','Ignorar las indicaciones del profesor'] },
];

export function genTecDigital3Round(){
  const item = pick(TEC_DIGITAL_3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

const TEC_DIGITAL_BANK = [
  { emoji:'🖌️', pregunta:'¿Para qué usarías un software de dibujo en el computador?', correcta:'Para crear y representar ideas con imágenes', opts:['Para escuchar música','Para cocinar una receta','Para hacer ejercicio'] },
  { emoji:'⌨️', pregunta:'¿Para qué sirve un procesador de textos?', correcta:'Para crear, editar y guardar información escrita', opts:['Para tomar fotografías','Para dibujar figuras 3D','Para escuchar canciones'] },
  { emoji:'🌐', pregunta:'Antes de usar información de internet, ¿qué debes hacer?', correcta:'Revisar que la fuente sea segura y confiable', opts:['Usar cualquier información sin revisar','Compartir tu contraseña con la página','Ignorar las indicaciones del profesor'] },
  { emoji:'🔒', pregunta:'¿Qué es importante hacer al usar internet de forma segura?', correcta:'Seguir las reglas que da el profesor', opts:['Dar tus datos personales a cualquiera','Descargar cualquier archivo sin revisar','Ignorar las advertencias de seguridad'] },
];

export function genTecDigital2Round(){
  const item = pick(TEC_DIGITAL_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

export function genHerramientasTecRound(){
  if(Math.random()<0.5){
    const item = pick(HERRAMIENTAS_TEC);
    const distract = shuffle(HERRAMIENTAS_TEC.filter(function(h){ return h.label!==item.label; })).slice(0,3).map(function(h){ return h.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
      options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
      explain: item.uso+' Esa herramienta es <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const item = pick(MATERIALES_TEC);
  const distract = shuffle(MATERIALES_TEC.filter(function(m){ return m.label!==item.label; })).map(function(m){ return m.label; });
  const opts = shuffle([item.label].concat(distract)).map(function(m){ return {label:m, value:m}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
    options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
    explain: item.uso+' Ese material es <b>'+item.label.toLowerCase()+'</b>.',
  };
}

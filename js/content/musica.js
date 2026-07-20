import { pick, shuffle } from '../utils.js';

export const MUSICA_MODULES = [
  {id:'sonidos', label:'Sonidos', open:true, key:'sonidos'},
  {id:'instrumentos', label:'Instrumentos', open:true, key:'instrumentos'},
];
export const MUSICA_POS = [{x:24,y:70},{x:70,y:25}];

/* ---------------- Contenido Música 1° Básico ----------------
   OA01 -> Sonidos (cualidades del sonido) · OA04 -> Instrumentos.
   OA02,03,05,06,07 (expresión personal, repertorio específico, improvisación,
   presentación en vivo) quedaron fuera por depender de audio real / desempeño,
   no de una pregunta de opción múltiple. */
const SONIDO_ITEMS = [
  { emoji:'🐭', label:'El sonido de un ratoncito chiquito', cualidad:'AGUDO', par:['AGUDO','GRAVE'] },
  { emoji:'🦁', label:'El rugido de un león', cualidad:'GRAVE', par:['AGUDO','GRAVE'] },
  { emoji:'🐘', label:'El sonido de un elefante', cualidad:'GRAVE', par:['AGUDO','GRAVE'] },
  { emoji:'🐦', label:'El canto de un pajarito', cualidad:'AGUDO', par:['AGUDO','GRAVE'] },
  { emoji:'📢', label:'Un grito bien fuerte', cualidad:'FUERTE', par:['FUERTE','SUAVE'] },
  { emoji:'🤫', label:'Un susurro suavecito', cualidad:'SUAVE', par:['FUERTE','SUAVE'] },
  { emoji:'🚂', label:'El pitido de un tren', cualidad:'FUERTE', par:['FUERTE','SUAVE'] },
  { emoji:'🍃', label:'El viento suave entre las hojas', cualidad:'SUAVE', par:['FUERTE','SUAVE'] },
  { emoji:'🎵', label:'Una nota musical que dura muchos segundos', cualidad:'LARGO', par:['LARGO','CORTO'] },
  { emoji:'👏', label:'Un aplauso rápido y breve', cualidad:'CORTO', par:['LARGO','CORTO'] },
];
const INSTRUMENTOS_ITEMS = [
  { emoji:'🥁', label:'TAMBOR', tipo:'CONVENCIONAL' },
  { emoji:'🪇', label:'MARACAS', tipo:'CONVENCIONAL' },
  { emoji:'🪘', label:'DJEMBÉ (TAMBOR AFRICANO)', tipo:'CONVENCIONAL' },
  { emoji:'🎻', label:'VIOLÍN', tipo:'CONVENCIONAL' },
  { emoji:'🎺', label:'TROMPETA', tipo:'CONVENCIONAL' },
  { emoji:'🎸', label:'GUITARRA', tipo:'CONVENCIONAL' },
  { emoji:'🥫', label:'UNA LATA VACÍA', tipo:'NO CONVENCIONAL' },
  { emoji:'🪣', label:'UN BALDE', tipo:'NO CONVENCIONAL' },
  { emoji:'🥄', label:'DOS CUCHARAS', tipo:'NO CONVENCIONAL' },
  { emoji:'📦', label:'UNA CAJA DE CARTÓN', tipo:'NO CONVENCIONAL' },
];

export function genSonidosRound(){
  const item = pick(SONIDO_ITEMS);
  const opts = shuffle(item.par.map(function(c){ return {label:c, value:c}; }));
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Cómo es este sonido?</p>',
    options: opts, correctValue: item.cualidad, speakText: item.label, cols:2, panel:true,
    explain: item.label+', por eso es un sonido <b>'+item.cualidad.toLowerCase()+'</b>.',
  };
}

export function genInstrumentosRound(){
  const item = pick(INSTRUMENTOS_ITEMS);
  const opts = shuffle([{label:'CONVENCIONAL', value:'CONVENCIONAL'},{label:'NO CONVENCIONAL', value:'NO CONVENCIONAL'}]);
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+'. ¿Es un instrumento musical convencional o no convencional?</p>',
    options: opts, correctValue: item.tipo, speakText: item.label, cols:2, panel:true,
    explain: item.label+' es un instrumento <b>'+item.tipo.toLowerCase()+'</b>.',
  };
}

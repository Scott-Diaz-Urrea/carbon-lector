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

/* ---------------- Contenido Música 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/musica/2-basico): MU02 OA01 -> Timbre y Pulso — cubre las
   cualidades del sonido que 1° básico no cubrió (timbre: qué fuente produce
   el sonido) y elementos del lenguaje musical (pulso, acento). Altura,
   intensidad y duración ya las cubre "Sonidos" de 1° básico, así que no se
   repiten aquí. Quedan fuera OA02-07 (expresar sensaciones, escuchar
   repertorio específico, cantar/tocar, improvisar, presentar, reflexionar
   sobre experiencias propias) por ser subjetivos o requerir desempeño/audio
   real, no aptos para el motor de opción múltiple. */
export const MUSICA_MODULES_G2 = [
  {id:'timbrepulso2', label:'Timbre y Pulso', open:true, key:'timbrepulso2'},
];
export const MUSICA_POS_G2 = [{x:50,y:50}];

const TIMBRE_BANK = [
  { emoji:'🥁', instrumento:'TAMBOR', desc:'Un sonido seco y golpeado, como un golpe fuerte.' },
  { emoji:'🎻', instrumento:'VIOLÍN', desc:'Un sonido que se desliza y vibra, como un canto largo.' },
  { emoji:'🔔', instrumento:'CAMPANA', desc:'Un sonido metálico que resuena y se queda vibrando.' },
  { emoji:'🎹', instrumento:'PIANO', desc:'Un sonido claro que se apaga rápido después de tocar la tecla.' },
  { emoji:'🎺', instrumento:'TROMPETA', desc:'Un sonido brillante y potente, como una fanfarria.' },
];
const PULSO_BANK = [
  { pregunta:'¿Qué es el "pulso" en la música?', correcta:'El latido constante, como el tic-tac de un reloj', opts:['Una nota muy aguda','El nombre de un instrumento','El final de una canción'] },
  { pregunta:'¿Qué es un "acento" en la música?', correcta:'Un golpe o nota que suena más fuerte que las demás', opts:['Una nota muy suave','El silencio entre notas','El nombre de una canción'] },
];

export function genTimbrePulso2Round(){
  if(Math.random()<0.5){
    const item = pick(TIMBRE_BANK);
    const distract = shuffle(TIMBRE_BANK.filter(function(t){ return t.instrumento!==item.instrumento; })).slice(0,3).map(function(t){ return t.instrumento; });
    const opts = shuffle([item.instrumento].concat(distract)).map(function(i){ return {label:i, value:i}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.desc+' ¿Qué instrumento tiene este timbre?</p>',
      options: opts, correctValue: item.instrumento, speakText: item.desc, cols:4, kind:'word',
      explain: 'Ese timbre corresponde al <b>'+item.instrumento.toLowerCase()+'</b>.',
    };
  }
  const item = pick(PULSO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

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

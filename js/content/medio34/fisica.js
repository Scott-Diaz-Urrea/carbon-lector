import { pick, shuffle, randInt } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan Diferenciado Científico: Física ----------------
   Fuente real: Decreto 614/2013, Plan de Formación Diferenciada Humanista-Científico,
   área Ciencias, asignatura Física (curriculumnacional.cl). Sus 6 OA son
   compartidos entre 3° y 4° medio (código "CN-FISI-3y4-OAC-01" a "06", verificado
   en ambas páginas) — un solo MODULES/POS sin sufijo de año.

   OAC06 (valorar la integración de la física con otras ciencias) es actitudinal,
   sin una única respuesta correcta — queda fuera. Los otros 5 sí tienen
   contenido conceptual o cuantitativo verificable: OAC01 (física del cambio
   climático: balance energético, efecto invernadero — un ángulo deliberadamente
   distinto al de "Ambiente y Sostenibilidad" del Plan General o "Cambio
   Climático: Ciclos y Equilibrios" de Química en este mismo Plan Diferenciado,
   que abordan el mismo fenómeno desde la sostenibilidad y la química
   respectivamente, no desde los mecanismos físicos), OAC02 (origen y evolución
   del universo), OAC03 (movimiento bajo fuerzas centrales — único módulo
   dinámico/cuantitativo de esta asignatura, ver más abajo), OAC04 (física
   moderna: relatividad y mecánica cuántica), OAC05 (fluidos, electromagnetismo y
   termodinámica). */

export const FISICA_MODULES = [
  {id:'fisicaclimapd', label:'Cambio Climático: Física del Fenómeno', open:true, key:'fisicaclimapd'},
  {id:'origenuniversopd', label:'Origen y Evolución del Universo', open:true, key:'origenuniversopd'},
  {id:'fuerzascentralespd', label:'Movimiento bajo Fuerzas Centrales', open:true, key:'fuerzascentralespd'},
  {id:'fisicamodernapd', label:'Física Moderna: Relatividad y Cuántica', open:true, key:'fisicamodernapd'},
  {id:'fluidoselectromagnetismopd', label:'Fluidos, Electromagnetismo y Termodinámica', open:true, key:'fluidoselectromagnetismopd'},
];
export const FISICA_POS = [ {x:26,y:90},{x:70,y:68},{x:26,y:46},{x:70,y:24},{x:30,y:4} ];

function genDefRound(bank, recurso){
  const item = pick(bank);
  const others = bank.filter(function(x){ return x!==item; });
  const distract = shuffle(others).slice(0,3).map(function(o){ return o.definicion; });
  const opts = shuffle([item.definicion].concat(distract)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">¿Qué significa el concepto "'+item.termino+'"?</p>',
    options:opts, correctValue:item.definicion, cols:2, panel:true,
    speakText:'¿Qué significa el concepto '+item.termino+'?',
    explain:item.termino+' significa: '+item.definicion,
    recurso:recurso,
  };
}

/* ---------------- Cambio Climático: Física del Fenómeno (OAC-01) ---------------- */
const RECURSO_FISICA_CLIMA_PD = 'Desde la física, el clima terrestre depende de un <b>balance energético</b>: la energía solar que la Tierra recibe debe equilibrarse con la <b>radiación infrarroja</b> que emite de vuelta al espacio. El <b>efecto invernadero</b> ocurre porque ciertos gases retienen parte de esa radiación infrarroja, calentando la superficie. El <b>albedo</b> —cuánta luz refleja una superficie— también influye: el hielo refleja mucho, el océano oscuro absorbe más. Un cambio en este balance se llama <b>forzamiento radiativo</b>, y puede desencadenar una <b>retroalimentación positiva</b>, donde un cambio inicial amplifica el calentamiento aún más.';
const FISICA_CLIMA_BANK_PD = [
  {termino:'Efecto invernadero', definicion:'El proceso físico por el cual ciertos gases de la atmósfera retienen parte de la radiación infrarroja emitida por la Tierra, manteniéndola más cálida.'},
  {termino:'Balance energético terrestre', definicion:'El equilibrio entre la energía solar que la Tierra recibe y la energía que la Tierra emite de vuelta al espacio.'},
  {termino:'Albedo', definicion:'La fracción de radiación solar que una superficie refleja en vez de absorber; el hielo tiene un albedo alto, el océano uno bajo.'},
  {termino:'Radiación infrarroja', definicion:'Un tipo de radiación electromagnética, no visible, que la Tierra emite como calor hacia el espacio.'},
  {termino:'Forzamiento radiativo', definicion:'El cambio en el balance de energía de la Tierra causado por un factor como el aumento de gases de efecto invernadero.'},
  {termino:'Retroalimentación climática positiva', definicion:'Un proceso en que un cambio inicial, como el derretimiento del hielo, amplifica aún más el calentamiento.'},
  {termino:'Capa de ozono', definicion:'Una región de la atmósfera que absorbe la mayor parte de la radiación ultravioleta del Sol, distinta del efecto invernadero.'},
  {termino:'Modelo climático', definicion:'Una representación matemática de los procesos físicos del clima, usada para proyectar cómo cambiará en el futuro.'},
];
export function genFisicaClimaPDRound(){ return genDefRound(FISICA_CLIMA_BANK_PD, RECURSO_FISICA_CLIMA_PD); }

/* ---------------- Origen y Evolución del Universo (OAC-02) ---------------- */
const RECURSO_ORIGEN_UNIVERSO_PD = 'La teoría del <b>Big Bang</b> explica el origen del universo a partir de una expansión extremadamente rápida desde un estado inicial muy denso y caliente. Dos evidencias clave la respaldan: la <b>radiación de fondo cósmico</b> (el remanente de ese estado inicial) y el <b>corrimiento al rojo</b> de las galaxias lejanas, que muestra que el universo sigue en <b>expansión</b> —descrita cuantitativamente por la <b>Ley de Hubble</b>. Dentro de las estrellas ocurre la <b>nucleosíntesis</b>, que produce elementos más pesados, y buena parte de la masa del universo corresponde a <b>materia oscura</b>, detectable solo por sus efectos gravitacionales.';
const ORIGEN_UNIVERSO_BANK_PD = [
  {termino:'Big Bang', definicion:'La teoría científica que explica el origen del universo a partir de una expansión extremadamente rápida desde un estado inicial muy denso y caliente.'},
  {termino:'Radiación de fondo cósmico', definicion:'La radiación remanente del universo temprano, considerada una de las principales evidencias del Big Bang.'},
  {termino:'Corrimiento al rojo', definicion:'El desplazamiento de la luz de una galaxia hacia longitudes de onda más largas, evidencia de que el universo se está expandiendo.'},
  {termino:'Nucleosíntesis estelar', definicion:'El proceso mediante el cual las estrellas producen elementos químicos más pesados a partir de elementos más livianos.'},
  {termino:'Materia oscura', definicion:'Un tipo de materia que no emite luz y que se detecta solo por sus efectos gravitacionales sobre la materia visible.'},
  {termino:'Expansión del universo', definicion:'El aumento continuo de la distancia entre las galaxias a medida que pasa el tiempo.'},
  {termino:'Ley de Hubble', definicion:'La relación que indica que las galaxias más lejanas se alejan de nosotros más rápido que las galaxias cercanas.'},
  {termino:'Formación estelar', definicion:'El proceso mediante el cual una nube de gas y polvo colapsa por gravedad hasta formar una nueva estrella.'},
];
export function genOrigenUniversoPDRound(){ return genDefRound(ORIGEN_UNIVERSO_BANK_PD, RECURSO_ORIGEN_UNIVERSO_PD); }

/* ---------------- Movimiento bajo Fuerzas Centrales (OAC-03) ---------------- */
const RECURSO_FUERZAS_CENTRALES_PD = 'La <b>Ley de Gravitación Universal</b> establece que la fuerza entre dos cuerpos es inversamente proporcional al CUADRADO de la distancia que los separa: F = G×m₁×m₂/r². Esto significa que si la distancia se duplica, la fuerza no se reduce a la mitad, sino a un cuarto (1/2² = 1/4); si se triplica, se reduce a un noveno (1/3² = 1/9). Este mismo principio —una fuerza central que depende del inverso del cuadrado de la distancia— explica por qué los planetas se mantienen en órbita alrededor del Sol, y es la base de la mecánica orbital usada para poner satélites en el espacio.';
export function genFuerzasCentralesPDRound(){
  const k = pick([2,3,4,5,6,7]);
  const aumenta = Math.random()<0.5;
  const correct = aumenta ? '1/'+(k*k) : String(k*k);
  const contexto = aumenta
    ? 'Según la Ley de Gravitación Universal, si la distancia entre dos cuerpos se multiplica por '+k+', ¿en qué factor cambia la fuerza gravitacional entre ellos?'
    : 'Según la Ley de Gravitación Universal, si la distancia entre dos cuerpos se divide por '+k+' (se acercan), ¿en qué factor cambia la fuerza gravitacional entre ellos?';
  const candidates = aumenta
    ? ['1/'+k, String(k), '1/'+(k*2), String(k*k)]
    : [String(k), '1/'+k, String(k*2), '1/'+(k*k)];
  const finals = [];
  for(const c of candidates){ if(c!==correct && finals.indexOf(c)===-1) finals.push(c); }
  let guard=0;
  while(finals.length<3 && guard<20){
    guard++;
    const cand = aumenta ? '1/'+(k*k+randInt(1,4)) : String(k*k+randInt(1,4));
    if(cand!==correct && finals.indexOf(cand)===-1) finals.push(cand);
  }
  const opts = shuffle([correct].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  const explicacion = aumenta
    ? 'La fuerza gravitacional es inversamente proporcional al cuadrado de la distancia: si la distancia se multiplica por '+k+', la fuerza queda multiplicada por '+correct+'.'
    : 'La fuerza gravitacional es inversamente proporcional al cuadrado de la distancia: si la distancia se divide por '+k+', la fuerza aumenta '+correct+' veces.';
  return {
    promptHTML:'<p class="prompt-sentence">'+contexto+'</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:contexto,
    explain:explicacion,
    recurso:RECURSO_FUERZAS_CENTRALES_PD,
  };
}

/* ---------------- Física Moderna: Relatividad y Cuántica (OAC-04) ---------------- */
const RECURSO_FISICA_MODERNA_PD = 'La <b>teoría de la relatividad especial</b> de Einstein muestra que el espacio y el tiempo no son absolutos —de ahí fenómenos como la <b>dilatación del tiempo</b>— y que masa y energía son equivalentes (E=mc²). La <b>mecánica cuántica</b>, en cambio, describe el mundo subatómico: el <b>efecto fotoeléctrico</b> ayudó a revelar la naturaleza cuántica de la luz, la <b>dualidad onda-partícula</b> muestra que una partícula puede comportarse como onda, el <b>principio de incertidumbre</b> limita cuánto podemos saber a la vez sobre su posición y velocidad, y la <b>superposición cuántica</b> permite que exista en varios estados a la vez hasta que se mide.';
const FISICA_MODERNA_BANK_PD = [
  {termino:'Teoría de la relatividad especial', definicion:'La teoría de Einstein que establece que el espacio y el tiempo no son absolutos, y que la velocidad de la luz es constante para todos los observadores.'},
  {termino:'Dilatación del tiempo', definicion:'El fenómeno relativista en que el tiempo transcurre más lento para un objeto que se mueve a velocidades cercanas a la de la luz.'},
  {termino:'Mecánica cuántica', definicion:'La rama de la física que describe el comportamiento de la materia y la energía a escala atómica y subatómica.'},
  {termino:'Dualidad onda-partícula', definicion:'El principio cuántico según el cual una partícula, como el electrón, puede comportarse tanto como onda como partícula.'},
  {termino:'Principio de incertidumbre', definicion:'El principio que establece que no se puede conocer con precisión absoluta, al mismo tiempo, la posición y la velocidad de una partícula.'},
  {termino:'Equivalencia masa-energía', definicion:'El principio de Einstein (E=mc²) que establece que la masa puede convertirse en energía y viceversa.'},
  {termino:'Superposición cuántica', definicion:'El principio por el cual una partícula cuántica puede existir en varios estados posibles a la vez, hasta que se mide.'},
  {termino:'Efecto fotoeléctrico', definicion:'La emisión de electrones desde un material cuando incide luz sobre él, un fenómeno que ayudó a establecer la naturaleza cuántica de la luz.'},
];
export function genFisicaModernaPDRound(){ return genDefRound(FISICA_MODERNA_BANK_PD, RECURSO_FISICA_MODERNA_PD); }

/* ---------------- Fluidos, Electromagnetismo y Termodinámica (OAC-05) ---------------- */
const RECURSO_FLUIDOS_ELECTROMAGNETISMO_PD = 'El <b>principio de Arquímedes</b> explica por qué flotan los objetos, y la <b>presión hidrostática</b> —que aumenta con la profundidad— junto con la <b>viscosidad</b> describen el comportamiento de los fluidos. En electromagnetismo, un <b>campo eléctrico</b> rodea a toda carga, la <b>inducción electromagnética</b> genera corriente a partir de un campo magnético variable, y la <b>Ley de Ohm</b> relaciona voltaje, corriente y resistencia. En termodinámica, la <b>segunda ley</b> establece que el desorden de un sistema aislado tiende a aumentar, y la <b>convección</b> transfiere calor mediante el movimiento de un fluido.';
const FLUIDOS_ELECTROMAGNETISMO_BANK_PD = [
  {termino:'Principio de Arquímedes', definicion:'El principio que establece que todo cuerpo sumergido en un fluido recibe un empuje hacia arriba igual al peso del fluido que desplaza.'},
  {termino:'Presión hidrostática', definicion:'La presión que ejerce un fluido en reposo sobre un objeto, que aumenta con la profundidad.'},
  {termino:'Campo eléctrico', definicion:'La región del espacio alrededor de una carga eléctrica donde se ejerce una fuerza sobre otras cargas.'},
  {termino:'Inducción electromagnética', definicion:'La generación de una corriente eléctrica en un conductor debido a un campo magnético variable.'},
  {termino:'Segunda ley de la termodinámica', definicion:'El principio que establece que la entropía, es decir el desorden, de un sistema aislado tiende a aumentar con el tiempo.'},
  {termino:'Transferencia de calor por convección', definicion:'La transferencia de calor mediante el movimiento de un fluido, como el aire o el agua, que se calienta y se desplaza.'},
  {termino:'Viscosidad', definicion:'La resistencia que opone un fluido a fluir o deformarse.'},
  {termino:'Ley de Ohm', definicion:'La relación que indica que la corriente eléctrica en un conductor es proporcional al voltaje aplicado e inversamente proporcional a su resistencia.'},
];
export function genFluidosElectromagnetismoPDRound(){ return genDefRound(FLUIDOS_ELECTROMAGNETISMO_BANK_PD, RECURSO_FLUIDOS_ELECTROMAGNETISMO_PD); }

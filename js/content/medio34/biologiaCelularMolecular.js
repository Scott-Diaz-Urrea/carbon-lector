import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan Diferenciado Científico: Biología Celular y Molecular ----------------
   Fuente real: Decreto 614/2013, Plan de Formación Diferenciada Humanista-Científico,
   área Ciencias, asignatura Biología Celular y Molecular (curriculumnacional.cl).
   Igual que "Ciencias para la Ciudadanía" (Plan General), los 7 OA de esta
   asignatura son literalmente compartidos entre 3° y 4° medio (código
   "CN-BCMO-3y4-OAC-01" a "07", verificado leyendo el contenido real de ambas
   páginas -3-medio-hc y 4-medio-hc- antes de asumirlo, no solo el código) — por
   eso este archivo exporta un solo MODULES/POS (sin sufijo de año), igual que
   `cienciasCiudadania.js`.

   OAC01 (investigar el desarrollo histórico de la disciplina) y OAC06 (analizar
   ese desarrollo en Chile) son OA de investigación/proceso propio, sin una
   única respuesta correcta — quedan fuera del motor de opción múltiple. Los
   otros 5 OA sí tienen un componente conceptual claro y verificable: OAC02
   (estructura y organización celular), OAC03 (dogma central de la biología
   molecular), OAC04 (regulación génica y su relación con cáncer/
   diferenciación/envejecimiento), OAC05 (estructura-función de proteínas),
   OAC07 (aplicaciones biotecnológicas). Mismo formato ya usado en Educación
   Ciudadana/Filosofía (Plan General): `genDefRound(banco, recurso)` pregunta
   "¿qué significa el concepto X?" contra una definición correcta y 3
   definiciones de otros conceptos del mismo banco como distractores. */

export const BIOLOGIA_CELULAR_MOLECULAR_MODULES = [
  {id:'estructuracelularpd', label:'Estructura y Organización Celular', open:true, key:'estructuracelularpd'},
  {id:'dogmacentralpd', label:'Dogma Central de la Biología Molecular', open:true, key:'dogmacentralpd'},
  {id:'regulaciongenicapd', label:'Regulación Génica y Cáncer', open:true, key:'regulaciongenicapd'},
  {id:'proteinaspd', label:'Estructura y Función de Proteínas', open:true, key:'proteinaspd'},
  {id:'biotecnologiapd', label:'Biotecnología y sus Aplicaciones', open:true, key:'biotecnologiapd'},
];
export const BIOLOGIA_CELULAR_MOLECULAR_POS = [ {x:26,y:90},{x:70,y:68},{x:26,y:46},{x:70,y:24},{x:30,y:4} ];

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

/* ---------------- Estructura y Organización Celular (OAC-02) ---------------- */
const RECURSO_ESTRUCTURA_CELULAR_PD = 'Toda célula está organizada a partir de biomoléculas, membranas y organelos que trabajan de forma coordinada. La <b>membrana plasmática</b> regula qué entra y qué sale; organelos como la <b>mitocondria</b> producen energía y el <b>retículo endoplasmático</b> fabrica proteínas y lípidos; el <b>citoesqueleto</b> le da forma a la célula y permite el transporte interno; y el <b>núcleo</b> guarda y protege el material genético. Todo este sistema le permite a la célula mantener su <b>homeostasis</b> —un ambiente interno estable— pese a los cambios constantes del entorno.';
const ESTRUCTURA_CELULAR_BANK_PD = [
  {termino:'Membrana plasmática', definicion:'Estructura formada por una doble capa de lípidos que rodea la célula y regula el paso de sustancias hacia adentro y hacia afuera.'},
  {termino:'Organelo', definicion:'Estructura especializada dentro de la célula que cumple una función específica, como la mitocondria o el aparato de Golgi.'},
  {termino:'Mitocondria', definicion:'Organelo encargado de producir la mayor parte de la energía (ATP) que la célula necesita para funcionar.'},
  {termino:'Retículo endoplasmático', definicion:'Organelo formado por membranas plegadas que participa en la síntesis de proteínas y lípidos dentro de la célula.'},
  {termino:'Citoesqueleto', definicion:'Red de filamentos y microtúbulos que da forma a la célula y permite su movimiento y el transporte interno.'},
  {termino:'División celular', definicion:'El proceso mediante el cual una célula se divide para dar origen a nuevas células, permitiendo el crecimiento y la reparación de tejidos.'},
  {termino:'Homeostasis celular', definicion:'La capacidad de la célula de mantener estable su ambiente interno pese a los cambios del entorno.'},
  {termino:'Núcleo celular', definicion:'Organelo que contiene el material genético (ADN) y controla las actividades de la célula.'},
];
export function genEstructuraCelularPDRound(){ return genDefRound(ESTRUCTURA_CELULAR_BANK_PD, RECURSO_ESTRUCTURA_CELULAR_PD); }

/* ---------------- Dogma Central de la Biología Molecular (OAC-03) ---------------- */
const RECURSO_DOGMA_CENTRAL_PD = 'El <b>dogma central de la biología molecular</b> describe cómo fluye la información genética dentro de una célula: del ADN se copia a ARN mensajero (<b>transcripción</b>), y del ARN mensajero se construye una proteína (<b>traducción</b>), siguiendo las reglas del <b>código genético</b>. Antes de dividirse, la célula copia completamente su ADN mediante la <b>replicación</b>, para que cada célula hija reciba la información completa. Una <b>mutación</b> es un cambio en esta secuencia que, en algunos casos, puede alterar el funcionamiento normal de una proteína.';
const DOGMA_CENTRAL_BANK_PD = [
  {termino:'Dogma central de la biología molecular', definicion:'El principio que describe el flujo de la información genética: del ADN se transcribe a ARN, y del ARN se traduce a proteínas.'},
  {termino:'Transcripción', definicion:'El proceso en el que la información del ADN se copia a una molécula de ARN mensajero.'},
  {termino:'Traducción', definicion:'El proceso en el que el ARN mensajero se utiliza para construir una proteína, uniendo aminoácidos en el orden indicado por el código genético.'},
  {termino:'Código genético', definicion:'El conjunto de reglas que indica qué aminoácido corresponde a cada secuencia de tres bases del ARN.'},
  {termino:'ARN mensajero', definicion:'Molécula que lleva la información copiada del ADN hacia los ribosomas, donde se sintetizan las proteínas.'},
  {termino:'Ribosoma', definicion:'Estructura celular donde ocurre la traducción, es decir, la síntesis de proteínas a partir del ARN mensajero.'},
  {termino:'Mutación genética', definicion:'Un cambio en la secuencia del ADN que puede alterar la información genética y, en algunos casos, la función de una proteína.'},
  {termino:'Replicación del ADN', definicion:'El proceso mediante el cual una célula copia su ADN antes de dividirse, para que cada célula hija reciba una copia completa.'},
];
export function genDogmaCentralPDRound(){ return genDefRound(DOGMA_CENTRAL_BANK_PD, RECURSO_DOGMA_CENTRAL_PD); }

/* ---------------- Regulación Génica y Cáncer (OAC-04) ---------------- */
const RECURSO_REGULACION_GENICA_PD = 'La <b>regulación génica</b> determina cuándo y en qué cantidad se activa cada gen, permitiendo que una célula se especialice mediante la <b>diferenciación celular</b> y controlando su <b>proliferación</b>. Genes como los <b>supresores de tumores</b> frenan la división descontrolada; cuando fallan, puede originarse una <b>célula cancerosa</b>. La <b>apoptosis</b> —muerte celular programada— elimina células dañadas antes de que se conviertan en un problema, y el <b>envejecimiento celular</b> es el deterioro natural de estas capacidades con el paso del tiempo.';
const REGULACION_GENICA_BANK_PD = [
  {termino:'Regulación génica', definicion:'El conjunto de mecanismos que determinan cuándo y en qué cantidad se expresa cada gen dentro de la célula.'},
  {termino:'Diferenciación celular', definicion:'El proceso mediante el cual una célula se especializa para cumplir una función específica, como célula muscular o neurona.'},
  {termino:'Proliferación celular', definicion:'El aumento en el número de células mediante divisiones celulares sucesivas.'},
  {termino:'Célula cancerosa', definicion:'Una célula que ha perdido el control normal sobre su proliferación y división, multiplicándose de forma descontrolada.'},
  {termino:'Gen supresor de tumores', definicion:'Un gen cuya función normal es frenar la proliferación celular descontrolada; su falla puede favorecer el cáncer.'},
  {termino:'Envejecimiento celular', definicion:'El proceso natural de deterioro progresivo de las funciones y capacidad de división de una célula con el paso del tiempo.'},
  {termino:'Apoptosis', definicion:'La muerte celular programada, un mecanismo natural que elimina células dañadas o innecesarias.'},
  {termino:'Factor de transcripción', definicion:'Una proteína que se une al ADN y ayuda a activar o desactivar la expresión de determinados genes.'},
];
export function genRegulacionGenicaPDRound(){ return genDefRound(REGULACION_GENICA_BANK_PD, RECURSO_REGULACION_GENICA_PD); }

/* ---------------- Estructura y Función de Proteínas (OAC-05) ---------------- */
const RECURSO_PROTEINAS_PD = 'La forma tridimensional de una proteína determina su función. Una <b>enzima</b> acelera una reacción química gracias a su <b>sitio activo</b>, que encaja de forma específica con su sustrato; un <b>canal iónico</b> permite el paso controlado de iones a través de la membrana; y las <b>proteínas motoras</b> generan movimiento, como en la contracción muscular. Un <b>cambio conformacional</b> —un cambio de forma— puede activar o desactivar la función de una proteína, mientras que la <b>desnaturalización</b> (por calor o pH extremo) le hace perder su forma y, con ella, su función por completo.';
const PROTEINAS_BANK_PD = [
  {termino:'Enzima', definicion:'Una proteína que acelera una reacción química específica dentro del organismo, sin consumirse en el proceso.'},
  {termino:'Sitio activo', definicion:'La región específica de una enzima donde se une el sustrato para que ocurra la reacción química.'},
  {termino:'Canal iónico', definicion:'Una proteína de membrana que permite el paso controlado de iones específicos hacia adentro o afuera de la célula.'},
  {termino:'Cambio conformacional', definicion:'Un cambio en la forma tridimensional de una proteína que puede activar o desactivar su función.'},
  {termino:'Proteína motora', definicion:'Una proteína capaz de generar movimiento dentro de la célula, como las responsables de la contracción muscular.'},
  {termino:'Desnaturalización proteica', definicion:'La pérdida de la forma tridimensional de una proteína, causada por calor, pH extremo u otros factores, que hace que pierda su función.'},
  {termino:'Estructura cuaternaria', definicion:'El nivel de organización de una proteína formada por la unión de varias cadenas de aminoácidos (subunidades).'},
  {termino:'Especificidad enzimática', definicion:'La propiedad de una enzima de actuar solo sobre un sustrato o un grupo muy reducido de sustratos similares.'},
];
export function genProteinasPDRound(){ return genDefRound(PROTEINAS_BANK_PD, RECURSO_PROTEINAS_PD); }

/* ---------------- Biotecnología y sus Aplicaciones (OAC-07) ---------------- */
const RECURSO_BIOTECNOLOGIA_PD = 'La <b>biotecnología</b> usa organismos vivos o sus componentes para desarrollar aplicaciones útiles: la <b>ingeniería genética</b> permite crear <b>organismos transgénicos</b>, la <b>terapia génica</b> busca corregir genes defectuosos para tratar enfermedades, y las <b>células madre</b> —guardadas a veces en <b>bancos</b> especializados— pueden transformarse en distintos tipos de tejido para uso médico. Estas aplicaciones, como el cáncer o la <b>clonación</b>, suelen venir acompañadas de <b>dilemas éticos</b> reales sobre hasta dónde es legítimo modificar la vida.';
const BIOTECNOLOGIA_BANK_PD = [
  {termino:'Célula madre', definicion:'Una célula con la capacidad de dividirse y transformarse en distintos tipos de células especializadas del cuerpo.'},
  {termino:'Organismo transgénico', definicion:'Un organismo al que se le ha insertado material genético de otra especie mediante ingeniería genética.'},
  {termino:'Terapia génica', definicion:'Un tratamiento que busca corregir o reemplazar un gen defectuoso para tratar o prevenir una enfermedad.'},
  {termino:'Biotecnología', definicion:'El uso de organismos vivos o sus componentes para desarrollar productos o tecnologías útiles para las personas.'},
  {termino:'Clonación', definicion:'El proceso de crear una copia genéticamente idéntica de una célula, tejido u organismo.'},
  {termino:'Ingeniería genética', definicion:'El conjunto de técnicas que permiten modificar directamente el material genético de un organismo.'},
  {termino:'Banco de células madre', definicion:'Una institución que almacena y preserva células madre para su uso futuro en tratamientos médicos.'},
  {termino:'Dilema ético en biotecnología', definicion:'Un conflicto de valores que surge al aplicar una tecnología genética, como los límites de modificar el genoma humano.'},
];
export function genBiotecnologiaPDRound(){ return genDefRound(BIOTECNOLOGIA_BANK_PD, RECURSO_BIOTECNOLOGIA_PD); }

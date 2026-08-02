import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan de Formación General: Ciencias para la Ciudadanía ----------------
   Fuente real: Decreto 614/2013, Plan de Formación General 3°-4° medio, asignatura
   "Ciencias para la Ciudadanía" (curriculumnacional.cl). A diferencia de las otras 5
   asignaturas del Plan General, esta NO se organiza en OA separados por año: los
   códigos oficiales de sus 4 módulos temáticos son literalmente "...-3y4-OAC-01/02/03"
   — un único conjunto de OA compartido entre 3° y 4° medio (verificado leyendo el
   contenido real de cada módulo antes de asumirlo). Por eso este archivo exporta un
   solo MODULES/POS (sin sufijo M3/M4): en gradeContent.js, tanto byGrade[3] como
   byGrade[4] apuntan al mismo objeto — el contenido es idéntico para ambos años,
   fiel a como Mineduc realmente organiza esta asignatura.

   Los 4 módulos (Ambiente y Sostenibilidad, Bienestar y Salud, Seguridad/Prevención/
   Autocuidado, Tecnología y Sociedad) cubren cada uno los 3 OA de su área temática.
   Ningún OA de esta asignatura queda fuera del motor de opción múltiple: los 12 OA
   (3 por área × 4 áreas) son de investigación/diseño/evaluación con un componente
   conceptual claro y verificable (definiciones, mecanismos, categorías), a diferencia
   de otras asignaturas del Plan General donde varios OA son de producción u opinión
   propia. */

export const CIENCIAS_CIUDADANIA_MODULES = [
  {id:'ambientesostenibilidadpg', label:'Ambiente y Sostenibilidad', open:true, key:'ambientesostenibilidadpg'},
  {id:'bienestarsaludpg', label:'Bienestar y Salud', open:true, key:'bienestarsaludpg'},
  {id:'seguridadautocuidadopg', label:'Seguridad, Prevención y Autocuidado', open:true, key:'seguridadautocuidadopg'},
  {id:'tecnologiasociedadpg', label:'Tecnología y Sociedad', open:true, key:'tecnologiasociedadpg'},
];
export const CIENCIAS_CIUDADANIA_POS = [ {x:26,y:88},{x:70,y:64},{x:26,y:38},{x:70,y:12} ];

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

/* ---------------- Ambiente y Sostenibilidad (OAC-01/02/03) ---------------- */
const RECURSO_AMBIENTE_PG = 'Entender el <b>ciclo de vida de un producto</b> —desde sus materias primas hasta su disposición final— permite tomar decisiones de <b>consumo sostenible</b> más informadas. Modelos como la <b>economía circular</b> buscan reducir, reutilizar y reciclar materiales en vez de simplemente desecharlos. A nivel global, el <b>cambio climático</b> es impulsado por los <b>gases de efecto invernadero</b> que retienen calor en la atmósfera, y frenarlo requiere medidas concretas como la <b>eficiencia energética</b> y la <b>conservación de ecosistemas</b>. Estas herramientas conceptuales permiten diseñar proyectos reales de protección de los recursos naturales de Chile.';
const AMBIENTE_SOSTENIBILIDAD_BANK_PG = [
  {termino:'Ciclo de vida de un producto', definicion:'El recorrido completo de un producto, desde la extracción de sus materias primas hasta su fabricación, uso y disposición final.'},
  {termino:'Huella hídrica', definicion:'La cantidad total de agua dulce usada, directa o indirectamente, para producir un bien o servicio.'},
  {termino:'Consumo sostenible', definicion:'Elegir y usar productos y servicios de manera que se reduzca el impacto ambiental, considerando todo su ciclo de vida.'},
  {termino:'Economía circular', definicion:'Un modelo que busca reducir, reutilizar y reciclar materiales para minimizar los residuos y prolongar la vida útil de los recursos.'},
  {termino:'Cambio climático', definicion:'La alteración a largo plazo de los patrones de temperatura y clima de la Tierra, acelerada por la actividad humana.'},
  {termino:'Gases de efecto invernadero', definicion:'Gases como el dióxido de carbono y el metano que retienen calor en la atmósfera, contribuyendo al calentamiento global.'},
  {termino:'Eficiencia energética', definicion:'Usar la menor cantidad de energía posible para lograr el mismo resultado o servicio.'},
  {termino:'Conservación de ecosistemas', definicion:'El conjunto de acciones destinadas a proteger y mantener el funcionamiento natural de un ecosistema.'},
];
export function genAmbienteSostenibilidadPGRound(){ return genDefRound(AMBIENTE_SOSTENIBILIDAD_BANK_PG, RECURSO_AMBIENTE_PG); }

/* ---------------- Bienestar y Salud (OAC-01/02/03) ---------------- */
const RECURSO_BIENESTAR_SALUD_PG = 'La salud de una persona depende de múltiples <b>determinantes sociales</b>: nutrición, ambiente, estrés y hábitos, entre otros. Frente a un problema de salud, existen distintos enfoques que se pueden comparar: la medicina convencional, la <b>medicina tradicional</b> de los pueblos originarios y la <b>medicina complementaria alternativa</b>. En el caso de las <b>enfermedades infecciosas</b>, herramientas como la <b>vacuna</b> generan defensas sin causar la enfermedad, y cuando una proporción suficiente de la población está protegida se logra <b>inmunidad de rebaño</b>, dificultando que el agente infeccioso siga propagándose.';
const BIENESTAR_SALUD_BANK_PG = [
  {termino:'Determinantes sociales de la salud', definicion:'Los factores biológicos, ambientales y sociales, como la nutrición o el estrés, que influyen en la salud de las personas.'},
  {termino:'Medicina tradicional', definicion:'Los conocimientos y prácticas de salud propios de un pueblo o cultura, transmitidos de generación en generación.'},
  {termino:'Medicina complementaria alternativa', definicion:'Prácticas de salud que se usan junto a la medicina convencional (o en su lugar), como la acupuntura o la fitoterapia.'},
  {termino:'Enfermedad infecciosa', definicion:'Una enfermedad causada por un agente patógeno, como un virus o una bacteria, que puede transmitirse de una persona a otra.'},
  {termino:'Vacuna', definicion:'Una preparación que estimula el sistema inmune para generar defensas contra un agente infeccioso específico, sin causar la enfermedad.'},
  {termino:'Inmunidad de rebaño', definicion:'La protección indirecta que se logra cuando una proporción suficiente de una población es inmune a una enfermedad, dificultando su propagación.'},
  {termino:'Alimento transgénico', definicion:'Un alimento cuyo material genético fue modificado en laboratorio para darle una característica específica.'},
  {termino:'Factor de riesgo para la salud', definicion:'Una condición o conducta que aumenta la probabilidad de desarrollar una enfermedad, como el sedentarismo o el consumo de alcohol.'},
];
export function genBienestarSaludPGRound(){ return genDefRound(BIENESTAR_SALUD_BANK_PG, RECURSO_BIENESTAR_SALUD_PG); }

/* ---------------- Seguridad, Prevención y Autocuidado (OAC-01/02/03) ---------------- */
const RECURSO_SEGURIDAD_AUTOCUIDADO_PG = 'Muchas sustancias de uso cotidiano en el hogar y el trabajo tienen <b>reactividad química</b> y riesgos que conviene conocer; por eso existen documentos como la <b>hoja de datos de seguridad</b> que informan cómo manejarlas y almacenarlas de forma segura. Otros peligros, como el <b>riesgo eléctrico</b>, se reducen con buen diseño y mantención. Frente a amenazas de <b>origen natural</b> (sismos, tsunamis, erupciones), la <b>gestión del riesgo de desastres</b> combina prevención, <b>mitigación</b> y herramientas como un buen <b>plan de evacuación</b> para proteger a las personas antes, durante y después de una emergencia.';
const SEGURIDAD_AUTOCUIDADO_BANK_PG = [
  {termino:'Reactividad química', definicion:'La tendencia de una sustancia a experimentar una reacción química, a veces liberando calor, gases o generando productos peligrosos.'},
  {termino:'Hoja de datos de seguridad', definicion:'Un documento que informa la composición, riesgos y medidas de manejo seguro de una sustancia química.'},
  {termino:'Riesgo eléctrico', definicion:'La posibilidad de sufrir un daño por contacto con corriente eléctrica, cortocircuitos o instalaciones en mal estado.'},
  {termino:'Gestión del riesgo de desastres', definicion:'El conjunto de acciones de prevención, mitigación y preparación frente a amenazas naturales o provocadas por el ser humano.'},
  {termino:'Plan de evacuación', definicion:'Un protocolo que define las rutas y acciones a seguir para poner a salvo a las personas ante una emergencia.'},
  {termino:'Amenaza de origen natural', definicion:'Un fenómeno como un sismo, un tsunami o una erupción volcánica que puede representar un peligro para las personas.'},
  {termino:'Mitigación de riesgos', definicion:'Las medidas que reducen el impacto de una amenaza antes de que ocurra, sin eliminarla por completo.'},
  {termino:'Almacenamiento seguro de sustancias', definicion:'Guardar productos químicos de forma que se eviten reacciones peligrosas, derrames o el acceso de personas no autorizadas.'},
];
export function genSeguridadAutocuidadoPGRound(){ return genDefRound(SEGURIDAD_AUTOCUIDADO_BANK_PG, RECURSO_SEGURIDAD_AUTOCUIDADO_PG); }

/* ---------------- Tecnología y Sociedad (OAC-01/02/03) ---------------- */
const RECURSO_TECNOLOGIA_SOCIEDAD_PG = 'Un buen <b>proyecto tecnológico</b> parte de un problema real de la vida cotidiana, como la vivienda o el transporte. Avances como la <b>robótica</b>, las <b>telecomunicaciones</b> y la <b>física cuántica aplicada</b> han ampliado enormemente las capacidades del ser humano para percibir y transformar su entorno. Pero toda tecnología tiene también límites y riesgos: la <b>brecha tecnológica</b> deja a algunos grupos fuera de sus beneficios, la <b>obsolescencia programada</b> genera más residuos de los necesarios, y evaluar el <b>impacto ambiental de la tecnología</b> es parte de una buena <b>evaluación de tecnología</b>, que sopesa beneficios y riesgos desde varias perspectivas a la vez.';
const TECNOLOGIA_SOCIEDAD_BANK_PG = [
  {termino:'Proyecto tecnológico', definicion:'Una solución diseñada para resolver un problema concreto de la vida cotidiana, como la vivienda o el transporte.'},
  {termino:'Robótica', definicion:'La rama de la tecnología que diseña y construye máquinas capaces de realizar tareas de forma automática o semiautomática.'},
  {termino:'Telecomunicaciones', definicion:'Las tecnologías que permiten transmitir información a distancia, como la telefonía, internet o los satélites.'},
  {termino:'Física cuántica aplicada', definicion:'El uso de principios de la física cuántica para desarrollar tecnologías como los láseres o los semiconductores.'},
  {termino:'Brecha tecnológica', definicion:'La diferencia en el acceso y uso de tecnología entre distintos grupos sociales, económicos o países.'},
  {termino:'Impacto ambiental de la tecnología', definicion:'Los efectos, positivos o negativos, que la fabricación y uso de tecnología tiene sobre el medioambiente.'},
  {termino:'Obsolescencia programada', definicion:'El diseño deliberado de un producto para que deje de funcionar o se vuelva anticuado después de un tiempo determinado.'},
  {termino:'Evaluación de tecnología', definicion:'El análisis de los riesgos y beneficios de una tecnología desde una perspectiva de salud, ética, social, económica y ambiental.'},
];
export function genTecnologiaSociedadPGRound(){ return genDefRound(TECNOLOGIA_SOCIEDAD_BANK_PG, RECURSO_TECNOLOGIA_SOCIEDAD_PG); }

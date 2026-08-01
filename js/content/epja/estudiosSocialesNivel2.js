import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Básica: Estudios Sociales ----------------
   Mismo marco que los demás archivos de Nivel 2: fuente real "Temario Segundo Nivel de
   Educación Básica", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026 1er
   semestre). El subsector "NB2 Estudios Sociales" combina historia de Chile y geografía:
   ubicar temporalmente períodos/hitos/personajes de la historia de Chile; pueblos
   originarios al momento de la conquista y su diversidad cultural actual; organización
   social/económica de la Colonia; etapas del proceso de independencia; diferencias entre
   organización republicana y colonial; ciclo del salitre y organizaciones obreras; crisis
   de 1929 y el nuevo rol del Estado; procesos de la segunda mitad del siglo XX (voto
   femenino, Reforma Agraria, Nacionalización del cobre, quiebre de la democracia, régimen
   militar, transición a la democracia); y geografía de Chile (posición relativa/absoluta,
   organización político-administrativa, espacios físico-naturales, actividades
   productivas, riesgos naturales, distribución de la población).
   Los 3 módulos de este archivo agrupan por período/tema: Chile Colonial e Independencia
   (pueblos originarios, Colonia, independencia), Chile en el Siglo XIX y XX (salitre,
   crisis de 1929, procesos de la segunda mitad del siglo XX), y Geografía de Chile.
   El contenido del quiebre democrático de 1973 y el retorno a la democracia en 1990 sigue,
   deliberadamente, el mismo criterio ya establecido para ese mismo período histórico en
   historia.js (SIGLOXX_DEMOCRATIZACION_BANK, 6° básico): se incluyen únicamente hechos
   cronológicos indiscutibles (fechas y sucesos verificables), sin ningún juicio de valor,
   causa, consecuencia o interpretación multiperspectiva del período — ese análisis se deja
   para la sala de clases con un profesor, tal como reconoce el propio currículum. Ningún
   objetivo de NB2 Estudios Sociales queda fuera del motor de opción múltiple. */

export const ESTUDIOS_SOCIALES_EPJA_N2_MODULES = [
  {id:'chileColoniaIndependenciaEpjaN2', label:'Colonia e Independencia', open:true, key:'chileColoniaIndependenciaEpjaN2'},
  {id:'chileSigloXIXXXEpjaN2', label:'Chile: Siglo XIX y XX', open:true, key:'chileSigloXIXXXEpjaN2'},
  {id:'geografiaChileEpjaN2', label:'Geografía de Chile', open:true, key:'geografiaChileEpjaN2'},
];
export const ESTUDIOS_SOCIALES_EPJA_N2_POS = [{x:24,y:80},{x:70,y:48},{x:24,y:16}];

const RECURSO_COLONIA_INDEPENDENCIA_N2 = 'Al momento del descubrimiento y la conquista de Chile, existían diversos <b>pueblos originarios</b> en el territorio (como los mapuche, diaguitas, aymara y rapanui, entre otros), cuya diversidad cultural sigue expresándose hoy en la lengua, las tradiciones y la organización de sus comunidades. Durante el <b>período colonial</b> (siglos XVI a XVIII), la sociedad se organizó de forma jerárquica (con españoles, criollos, mestizos e indígenas ocupando distintos lugares) y la economía dependió de la explotación de recursos y del trabajo indígena y mestizo, bajo la autoridad del Rey de España y sus representantes. El proceso de <b>independencia</b> (a partir de 1810) tuvo varias etapas —desde la Primera Junta de Gobierno hasta la consolidación definitiva tras la batalla de Maipú en 1818— y terminó reemplazando la organización colonial (poder concentrado en un Rey lejano) por una organización <b>republicana</b>, basada en instituciones propias y una Constitución.';
const COLONIA_INDEPENDENCIA_N2_BANK = [
  { pregunta:'¿Cuál de estos es un pueblo originario que habitaba el territorio de Chile al momento de la conquista?', correcta:'El pueblo mapuche', opts:['Los incas del Cusco','Los aztecas','Los mayas'] },
  { pregunta:'¿Qué grupo ocupaba la posición de mayor poder dentro de la organización social durante la Colonia?', correcta:'Los españoles peninsulares', opts:['Los pueblos indígenas','Los esclavos africanos','Los criollos'] },
  { pregunta:'¿De qué dependía principalmente la economía durante el período colonial en Chile?', correcta:'De la explotación de recursos y del trabajo indígena y mestizo', opts:['De la exportación de tecnología','Del comercio con Asia únicamente','De una industria manufacturera avanzada'] },
  { pregunta:'¿En qué año se formó la Primera Junta de Gobierno en Chile, marcando el inicio del proceso de independencia?', correcta:'1810', opts:['1818','1833','1879'] },
  { pregunta:'¿Qué batalla consolidó definitivamente la independencia de Chile?', correcta:'La batalla de Maipú (1818)', opts:['La Guerra del Pacífico','La batalla de Rancagua','La Guerra Civil de 1891'] },
  { pregunta:'¿Cuál es la principal diferencia entre la organización política de la Colonia y la de la República?', correcta:'La Colonia dependía de un Rey lejano; la República se organiza con instituciones y una Constitución propias', opts:['No existe ninguna diferencia real entre ambas','La Colonia tenía elecciones libres y la República no','La República eliminó por completo el uso de leyes'] },
  { pregunta:'¿Qué muestra hoy la diversidad cultural de los pueblos originarios de Chile?', correcta:'Se expresa en su lengua, tradiciones y organización comunitaria actuales', opts:['Desapareció por completo tras la conquista','Solo existe en libros de historia','Es exactamente igual en todos los pueblos originarios'] },
  { pregunta:'¿Qué herramienta se usa para ubicar en orden los hitos importantes de la historia de Chile?', correcta:'Una línea de tiempo', opts:['Un mapa de relieve','Un termómetro','Una balanza'] },
  { pregunta:'¿Qué grupo social surgió de la unión entre españoles e indígenas durante la Colonia?', correcta:'Los mestizos', opts:['Los criollos','Los peninsulares','Los virreyes'] },
  { pregunta:'¿Qué llamamos "criollos" durante el período colonial?', correcta:'A los hijos de españoles nacidos en América', opts:['A los indígenas que vivían en las ciudades','A los esclavos traídos desde África','A los funcionarios enviados directamente desde España'] },
];
export function genChileColoniaIndependenciaEpjaN2Round(){
  const item = pick(COLONIA_INDEPENDENCIA_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COLONIA_INDEPENDENCIA_N2,
  };
}

const RECURSO_SIGLO_XIX_XX_N2 = 'Durante el <b>ciclo del salitre</b> (fines del siglo XIX e inicios del XX), la explotación de este mineral en el norte de Chile generó una gran riqueza para el Estado, pero también condiciones laborales muy duras para sus trabajadores, lo que impulsó el surgimiento de las primeras <b>organizaciones obreras</b> del país. La <b>crisis de 1929</b> (originada en Estados Unidos y con fuerte impacto mundial) afectó gravemente las exportaciones chilenas y llevó a que el <b>Estado</b> asumiera un rol más activo en la economía y en lo social, impulsando el desarrollo de una <b>industria manufacturera</b> propia. En la segunda mitad del siglo XX, Chile vivió procesos importantes como la conquista del <b>voto femenino</b> (1949), reformas estructurales como la <b>Reforma Agraria</b> y la <b>Nacionalización del cobre</b>, y —como hecho histórico verificable— el quiebre de la democracia el 11 de septiembre de 1973, un período de gobierno militar de 17 años, y el retorno a un gobierno elegido democráticamente el 11 de marzo de 1990.';
const SIGLO_XIX_XX_N2_BANK = [
  { pregunta:'¿En qué zona de Chile se desarrolló principalmente el ciclo del salitre?', correcta:'En el norte del país', opts:['En la zona sur','En la Patagonia','En la Isla de Pascua'] },
  { pregunta:'¿Qué impulsó el surgimiento de las primeras organizaciones obreras en Chile?', correcta:'Las duras condiciones laborales de los trabajadores del salitre', opts:['La abundancia de trabajo bien pagado','La ausencia total de trabajadores extranjeros','El fin de la explotación minera'] },
  { pregunta:'¿Qué efecto tuvo la crisis de 1929 sobre la economía chilena?', correcta:'Afectó gravemente las exportaciones del país', opts:['No tuvo ningún efecto en Chile','Hizo crecer las exportaciones de inmediato','Solo afectó a otros países, nunca a Chile'] },
  { pregunta:'Tras la crisis de 1929, ¿qué nuevo rol asumió el Estado chileno?', correcta:'Un rol más activo en la economía y en lo social', opts:['Se retiró por completo de la economía','Eliminó todos los impuestos','Dejó de existir como institución'] },
  { pregunta:'¿En qué año se aprobó la ley que dio a las mujeres chilenas el derecho a votar en elecciones presidenciales?', correcta:'1949', opts:['1810','1929','1990'] },
  { pregunta:'¿Qué buscaba la Reforma Agraria realizada en Chile durante el siglo XX?', correcta:'Redistribuir la propiedad de la tierra agrícola', opts:['Eliminar por completo la agricultura','Privatizar todos los bosques del país','Aumentar el precio del salitre'] },
  { pregunta:'¿Qué proceso económico significó la Nacionalización del cobre?', correcta:'Que el Estado chileno pasó a controlar la explotación del cobre', opts:['Que el cobre dejó de explotarse en Chile','Que el cobre se vendió a empresas extranjeras','Que se prohibió exportar cobre'] },
  { pregunta:'¿En qué fecha ocurrió el golpe de Estado que terminó con el gobierno del presidente Salvador Allende?', correcta:'El 11 de septiembre de 1973', opts:['El 18 de septiembre de 1810','El 11 de marzo de 1990','El 5 de octubre de 1988'] },
  { pregunta:'¿Cuántos años duró el período de gobierno militar en Chile, entre 1973 y 1990?', correcta:'17 años', opts:['5 años','50 años','2 años'] },
  { pregunta:'¿En qué fecha asumió Patricio Aylwin la presidencia, marcando el retorno a un gobierno elegido democráticamente?', correcta:'El 11 de marzo de 1990', opts:['El 11 de septiembre de 1973','El 5 de octubre de 1988','El 18 de septiembre de 1810'] },
];
export function genChileSigloXIXXXEpjaN2Round(){
  const item = pick(SIGLO_XIX_XX_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SIGLO_XIX_XX_N2,
  };
}

const RECURSO_GEOGRAFIA_CHILE_N2 = 'La <b>posición relativa</b> de Chile describe su ubicación en comparación con otros lugares (por ejemplo, al suroeste de América del Sur, frente al océano Pacífico), mientras que su <b>posición absoluta</b> se expresa con coordenadas geográficas exactas (latitud y longitud). La <b>organización político-administrativa</b> divide el territorio en regiones, provincias y comunas, cada una con sus propias autoridades. Chile tiene una gran diversidad de <b>espacios físico-naturales</b> —relieve, vegetación y clima distintos entre el norte árido, la zona central y el sur lluvioso—, y sus <b>actividades productivas</b> (minería, agricultura, pesca, industria, servicios) varían según cada zona. El país también enfrenta <b>riesgos naturales</b> como terremotos, erupciones volcánicas e inundaciones, y su <b>población</b> se distribuye de forma desigual en el territorio, concentrándose principalmente en la zona central.';
const GEOGRAFIA_CHILE_N2_BANK = [
  { pregunta:'¿Cuál es la posición relativa de Chile respecto al continente americano?', correcta:'Se ubica al suroeste de América del Sur', opts:['Se ubica en América del Norte','Se ubica en el centro de África','Se ubica en Europa'] },
  { pregunta:'¿Qué océano baña las costas de Chile?', correcta:'El océano Pacífico', opts:['El océano Índico','El mar Mediterráneo','El océano Ártico'] },
  { pregunta:'¿Cómo se expresa la posición absoluta de un lugar en un mapa?', correcta:'Con coordenadas de latitud y longitud', opts:['Con el nombre de un país vecino','Con la temperatura promedio del lugar','Con la cantidad de habitantes'] },
  { pregunta:'¿En qué unidades político-administrativas se divide el territorio de Chile?', correcta:'Regiones, provincias y comunas', opts:['Solo en ciudades y pueblos','Únicamente en países vecinos','En continentes'] },
  { pregunta:'¿Qué caracteriza principalmente el clima del norte de Chile?', correcta:'Es árido, con muy poca lluvia', opts:['Es extremadamente lluvioso todo el año','Tiene nieve permanente en la costa','Es tropical y húmedo'] },
  { pregunta:'¿Qué caracteriza principalmente el clima del sur de Chile?', correcta:'Es lluvioso y templado', opts:['Es desértico y seco','Es tropical con selva densa','No tiene lluvias en ninguna época del año'] },
  { pregunta:'¿Cuál es una de las principales actividades productivas del norte de Chile?', correcta:'La minería', opts:['La pesca industrial en altura','El cultivo de arroz','La ganadería ovina extensiva'] },
  { pregunta:'¿Cuál de estos es un riesgo natural común en el territorio chileno?', correcta:'Los terremotos', opts:['Los huracanes tropicales','Las avalanchas de arena','Las tormentas de nieve en el desierto'] },
  { pregunta:'¿En qué zona de Chile se concentra la mayor parte de la población del país?', correcta:'En la zona central', opts:['En la Antártica chilena','En el extremo norte únicamente','De forma exactamente igual en todo el territorio'] },
  { pregunta:'¿Qué tipo de mapa se usa principalmente para representar el relieve, la vegetación y el clima de un territorio?', correcta:'Un mapa físico', opts:['Un mapa político','Un mapa de rutas de buses','Un plano de una casa'] },
];
export function genGeografiaChileEpjaN2Round(){
  const item = pick(GEOGRAFIA_CHILE_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_GEOGRAFIA_CHILE_N2,
  };
}

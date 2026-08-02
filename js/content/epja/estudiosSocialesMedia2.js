import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Media: Estudios Sociales ----------------
   Nivel 2 Media equivale a 3°-4° medio (ver content/grades.js). Fuente real: "Temario Segundo
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er y 2do semestre). A diferencia de Nivel 1 Media (historia de CHILE, que sí incluyó el
   período 1973-1990 bajo la política de contenido sensible ya establecida), el eje NM2
   Estudios Sociales es de HISTORIA UNIVERSAL Y ECONOMÍA GLOBAL del siglo XX y XXI: Segunda
   Guerra Mundial, sistema bipolar y Guerra Fría, descolonización, la ONU, caída de los
   socialismos reales y sistema unipolar, interconectividad global, internacionalización de
   las economías, tratados de libre comercio, conceptos básicos de economía (trabajo, empleo,
   mercado, regulación estatal, propiedad privada/pública, privatización), características del
   empleo global actual, comparación de sistemas económicos (esclavitud, economía feudal,
   socialismo, capitalismo de mercado), problemas globales contemporáneos (pobreza, deterioro
   ambiental, pandemias), y población/territorio (volumen y distribución poblacional,
   migraciones, envejecimiento, asentamientos urbanos/rurales en Chile, problemas de expansión
   de las ciudades latinoamericanas, relación entre medio natural y actividades productivas).
   No fue necesario aplicar la política de contenido sensible del período 1973-1990 en este
   módulo: el temario de NM2 no pide analizar ese período histórico de Chile específicamente,
   sino procesos y conceptos de historia mundial y economía global. 4 módulos cubren el eje
   completo: Siglo XX: Guerra y Bipolaridad, Globalización y Economía Mundial, Problemas
   Globales Contemporáneos, y Población y Territorio. Contextos de vida adulta. */

export const ESTUDIOS_SOCIALES_EPJA_M2_MODULES = [
  {id:'sigloXXBipolaridadEpjaM2', label:'Siglo XX: Guerra y Bipolaridad', open:true, key:'sigloXXBipolaridadEpjaM2'},
  {id:'globalizacionEconomiaEpjaM2', label:'Globalización y Economía Mundial', open:true, key:'globalizacionEconomiaEpjaM2'},
  {id:'problemasGlobalesEpjaM2', label:'Problemas Globales Contemporáneos', open:true, key:'problemasGlobalesEpjaM2'},
  {id:'poblacionTerritorioEpjaM2', label:'Población y Territorio', open:true, key:'poblacionTerritorioEpjaM2'},
];
export const ESTUDIOS_SOCIALES_EPJA_M2_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

/* ---------------- Siglo XX: Guerra y Bipolaridad ---------------- */
const RECURSO_SIGLO_XX_BIPOLARIDAD_M2 = 'La <b>Segunda Guerra Mundial</b> (1939-1945) fue el conflicto bélico más devastador de la historia, y tras su fin surgió un <b>sistema bipolar</b>: el mundo se dividió entre dos grandes potencias, Estados Unidos y la Unión Soviética, en un enfrentamiento indirecto conocido como <b>Guerra Fría</b>. En paralelo, muchas colonias de África y Asia lograron su independencia en el proceso de <b>descolonización</b>. La <b>ONU</b> (Organización de las Naciones Unidas) se creó para promover acuerdos políticos y económicos mundiales. A fines del siglo XX, la caída de los <b>socialismos reales</b> (como la Unión Soviética) dio paso a un <b>sistema unipolar</b>, con Estados Unidos como única superpotencia.';
const SIGLO_XX_BIPOLARIDAD_M2_BANK = [
  { pregunta:'¿Entre qué dos potencias se dio principalmente el enfrentamiento conocido como Guerra Fría?', correcta:'Estados Unidos y la Unión Soviética', opts:['Alemania y Francia','China y Japón','Inglaterra y España'] },
  { pregunta:'¿Cómo se llama el sistema mundial que surgió tras la Segunda Guerra Mundial, dividido entre dos grandes potencias?', correcta:'Sistema bipolar', opts:['Sistema unipolar','Sistema feudal','Sistema colonial'] },
  { pregunta:'¿Cómo se llama el proceso mediante el cual muchas colonias de África y Asia lograron su independencia durante el siglo XX?', correcta:'Descolonización', opts:['Globalización','Industrialización','Colonización'] },
  { pregunta:'¿Qué organización internacional se creó tras la Segunda Guerra Mundial para promover acuerdos políticos y económicos mundiales?', correcta:'La ONU (Organización de las Naciones Unidas)', opts:['La Unión Europea','La OTAN exclusivamente','Ninguna organización se creó'] },
  { pregunta:'¿Qué ocurrió con el sistema mundial tras la caída de los socialismos reales, como la Unión Soviética, a fines del siglo XX?', correcta:'Se pasó a un sistema unipolar, con Estados Unidos como única superpotencia', opts:['Se mantuvo exactamente el mismo sistema bipolar','Volvió un sistema de colonias europeas','Desapareció cualquier forma de organización mundial'] },
  { pregunta:'¿En qué década aproximadamente ocurrió la caída de los socialismos reales en Europa del Este?', correcta:'A fines de la década de 1980 e inicios de 1990', opts:['A inicios del siglo XX','Durante la Segunda Guerra Mundial','En la década de 1950'] },
  { pregunta:'¿Cuál de las siguientes fue una consecuencia directa de la Segunda Guerra Mundial?', correcta:'La creación de un nuevo orden mundial dividido en bloques', opts:['El fin inmediato de todo conflicto internacional futuro','La reunificación instantánea de todos los países del mundo','La desaparición completa de las fronteras nacionales'] },
  { pregunta:'¿Qué rol cumplió la ONU en el escenario internacional tras su creación?', correcta:'Mediar y generar acuerdos políticos y económicos entre países', opts:['Gobernar directamente a todos los países del mundo','No tener ninguna función real','Sustituir a los gobiernos nacionales'] },
  { pregunta:'Durante la Guerra Fría, ¿cómo se caracterizó principalmente el enfrentamiento entre las dos superpotencias?', correcta:'Fue principalmente indirecto, mediante conflictos regionales, competencia tecnológica y espionaje', opts:['Fue una guerra directa y declarada entre ambas potencias','No hubo ningún tipo de tensión entre ellas','Se resolvió con una fusión de ambos países'] },
  { pregunta:'¿Qué término describe el proceso en el que antiguas colonias de África y Asia se independizaron durante el siglo XX?', correcta:'Descolonización', opts:['Reconquista','Anexión territorial','Nacionalización'] },
];
export function genSigloXXBipolaridadEpjaM2Round(){
  const item = pick(SIGLO_XX_BIPOLARIDAD_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SIGLO_XX_BIPOLARIDAD_M2,
  };
}

/* ---------------- Globalización y Economía Mundial ---------------- */
const RECURSO_GLOBALIZACION_ECONOMIA_M2 = 'La <b>globalización</b> se refleja en el desarrollo tecnológico que aumenta la interconectividad mundial, y en cómo los medios de comunicación y el transporte difunden patrones culturales globalmente. La <b>internacionalización de las economías</b> ocurre a través de la inversión extranjera, las empresas transnacionales, y organismos económicos internacionales; los países se insertan en la economía global mediante <b>tratados de libre comercio</b> y bloques económicos. En el empleo actual predominan la <b>terciarización</b> (más empleos en servicios), la <b>flexibilización laboral</b> y la necesidad de capacitación constante. La <b>economía de mercado</b> (el capitalismo actual, con el Estado como regulador) puede compararse con otros sistemas económicos históricos, como la esclavitud, la economía feudal o el socialismo.';
const GLOBALIZACION_ECONOMIA_M2_BANK = [
  { pregunta:'¿Qué factor ha aumentado fuertemente la interconectividad global, tanto física como virtual, en las últimas décadas?', correcta:'El desarrollo tecnológico', opts:['La disminución del comercio internacional','El aislamiento voluntario de los países','La desaparición de internet'] },
  { pregunta:'¿Qué rol cumplen los medios de comunicación y el transporte en la globalización?', correcta:'Transmiten patrones culturales a escala mundial', opts:['Impiden cualquier intercambio cultural entre países','No tienen ninguna relación con la globalización','Solo afectan a un único país a la vez'] },
  { pregunta:'¿Qué se entiende por "internacionalización de las economías nacionales"?', correcta:'El aumento de la inversión extranjera y la presencia de empresas transnacionales en la economía de un país', opts:['El cierre total de fronteras comerciales','La eliminación de toda inversión extranjera','El fin del comercio entre países'] },
  { pregunta:'¿Cómo se llama un acuerdo entre países para reducir o eliminar barreras arancelarias entre ellos?', correcta:'Tratado de libre comercio', opts:['Bloqueo comercial','Aislamiento económico','Nacionalización total'] },
  { pregunta:'¿Qué término describe el aumento del empleo en el sector de servicios en la economía global actual?', correcta:'Terciarización', opts:['Industrialización pura','Ruralización','Colonización económica'] },
  { pregunta:'¿Qué término describe la tendencia actual del empleo a tener contratos más variables y menos estables que antes?', correcta:'Flexibilización laboral', opts:['Estabilidad laboral total','Empleo vitalicio garantizado','Desaparición del empleo formal'] },
  { pregunta:'¿Qué habilidad es cada vez más necesaria para los trabajadores frente a la obsolescencia veloz de las tecnologías?', correcta:'La capacitación permanente y la adaptación al cambio', opts:['Evitar cualquier tipo de estudio adicional','Rechazar el uso de nueva tecnología','Cambiar de país constantemente'] },
  { pregunta:'En la economía de mercado actual, ¿qué rol cumple el Estado según el temario?', correcta:'Actuar como regulador de la actividad económica', opts:['No tener ningún rol en la economía','Ser dueño de todas las empresas del país','Prohibir cualquier forma de comercio'] },
  { pregunta:'¿Cuál de los siguientes es un sistema económico histórico distinto al capitalismo de mercado actual, en el que las personas eran propiedad de otras?', correcta:'La esclavitud', opts:['El libre comercio moderno','La economía digital','El comercio electrónico'] },
  { pregunta:'¿Cuál de los siguientes sistemas económicos históricos se basaba en que los campesinos trabajaban la tierra de un señor a cambio de protección?', correcta:'La economía feudal', opts:['El capitalismo de mercado','El comercio electrónico','La economía digital'] },
  { pregunta:'¿Qué caracteriza al socialismo como sistema económico, en contraste con el capitalismo de mercado?', correcta:'La propiedad estatal o colectiva de los medios de producción', opts:['La propiedad privada absoluta sin ninguna regulación','La ausencia total de organización económica','La esclavitud como forma de trabajo'] },
];
export function genGlobalizacionEconomiaEpjaM2Round(){
  const item = pick(GLOBALIZACION_ECONOMIA_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_GLOBALIZACION_ECONOMIA_M2,
  };
}

/* ---------------- Problemas Globales Contemporáneos ---------------- */
const RECURSO_PROBLEMAS_GLOBALES_M2 = 'El mundo actual enfrenta varios problemas sociales que trascienden las fronteras nacionales: la <b>pobreza y el hambre</b> siguen afectando a millones de personas; el <b>deterioro medioambiental</b> (contaminación, pérdida de biodiversidad, cambio climático) amenaza los ecosistemas del planeta; y las <b>pandemias</b> (enfermedades que se propagan a nivel mundial) tienen implicancias sociales, culturales y económicas profundas, especialmente en países como Chile, donde afectan tanto la salud pública como la economía.';
const PROBLEMAS_GLOBALES_M2_BANK = [
  { pregunta:'¿Cuál de los siguientes es un problema social del mundo actual que afecta a millones de personas a nivel global?', correcta:'La pobreza y el hambre', opts:['El exceso de empleo formal en todo el mundo','La abundancia total de recursos naturales','La ausencia de cualquier tipo de desigualdad'] },
  { pregunta:'¿Qué término describe la contaminación, la pérdida de biodiversidad y el cambio climático como un problema global?', correcta:'Deterioro medioambiental', opts:['Desarrollo sostenible pleno','Reforestación total del planeta','Ausencia de problemas ambientales'] },
  { pregunta:'¿Qué término describe una enfermedad que se propaga y afecta a la población de muchos países al mismo tiempo?', correcta:'Pandemia', opts:['Endemia local sin propagación','Vacuna preventiva','Tratamiento médico individual'] },
  { pregunta:'¿Qué tipo de implicancias tiene una pandemia en un país como Chile, además de las sanitarias?', correcta:'Implicancias sociales, culturales y económicas', opts:['Ninguna implicancia fuera del ámbito médico','Solamente implicancias deportivas','Solo implicancias en el clima'] },
  { pregunta:'¿Cuál de las siguientes acciones contribuye a reducir el deterioro medioambiental a nivel global?', correcta:'Reducir la contaminación y proteger los ecosistemas naturales', opts:['Aumentar la contaminación industrial sin control','Eliminar todas las áreas protegidas','Talar todos los bosques del planeta'] },
  { pregunta:'¿Qué relación existe entre la pobreza y el hambre como problemas globales?', correcta:'La pobreza suele ser una de las causas principales del hambre en el mundo', opts:['No existe ninguna relación entre ambos problemas','El hambre siempre ocurre solo en países ricos','La pobreza únicamente afecta a un solo continente'] },
  { pregunta:'¿Por qué se considera que la pobreza, el deterioro ambiental y las pandemias son problemas "globales"?', correcta:'Porque afectan a distintos países del mundo y no se limitan a un solo territorio', opts:['Porque afectan solamente a un país a la vez','Porque no tienen relación con la economía mundial','Porque solo ocurren en zonas rurales'] },
  { pregunta:'¿Qué impacto puede tener una pandemia sobre la economía de un país?', correcta:'Puede generar desempleo y una fuerte desaceleración económica', opts:['Siempre genera un crecimiento económico inmediato','No tiene ningún impacto económico','Solo afecta a las empresas más pequeñas'] },
  { pregunta:'¿Cuál de los siguientes es un ejemplo de deterioro medioambiental a nivel mundial?', correcta:'La deforestación masiva de grandes bosques', opts:['La creación de nuevos parques nacionales','La reducción del uso de plásticos de un solo uso','La instalación de paneles solares'] },
];
export function genProblemasGlobalesEpjaM2Round(){
  const item = pick(PROBLEMAS_GLOBALES_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_PROBLEMAS_GLOBALES_M2,
  };
}

/* ---------------- Población y Territorio ---------------- */
const RECURSO_POBLACION_TERRITORIO_M2 = 'El <b>volumen y distribución de la población mundial</b> depende de la natalidad, la mortalidad y las <b>migraciones</b>, las cuales generan una <b>explosión demográfica</b> en algunos lugares y un <b>envejecimiento de la población</b> en otros. En Chile predomina la vida urbana: la mayoría de la población vive en ciudades, lo que se explica en parte por el <b>éxodo rural</b>. La expansión física de las ciudades latinoamericanas trae problemas como el aumento en los tiempos de desplazamiento, la generación de residuos, la contaminación y la <b>segregación socioespacial</b>. La explotación de los recursos naturales para las actividades productivas también genera un impacto ambiental importante a nivel local y global.';
const POBLACION_TERRITORIO_M2_BANK = [
  { pregunta:'¿Cuáles son los tres factores principales que explican el crecimiento y distribución de la población mundial?', correcta:'Natalidad, mortalidad y migraciones', opts:['Solo la natalidad, sin otros factores','Solo el clima de cada país','Solo las guerras entre países'] },
  { pregunta:'¿Qué término describe el aumento acelerado y sostenido de la población en algunas regiones del mundo?', correcta:'Explosión demográfica', opts:['Envejecimiento poblacional','Éxodo rural','Segregación socioespacial'] },
  { pregunta:'¿Qué término describe el aumento en la proporción de personas de edad avanzada dentro de una población?', correcta:'Envejecimiento de la población', opts:['Explosión demográfica','Migración masiva','Urbanización acelerada'] },
  { pregunta:'¿Qué tipo de vida predomina actualmente en Chile, según los datos de distribución poblacional?', correcta:'La vida urbana', opts:['La vida exclusivamente rural','No existe ninguna diferencia entre zonas','La vida nómada'] },
  { pregunta:'¿Qué término describe el desplazamiento de personas desde el campo hacia las ciudades?', correcta:'Éxodo rural', opts:['Explosión demográfica','Segregación socioespacial','Envejecimiento poblacional'] },
  { pregunta:'¿Cuál de los siguientes es un problema derivado de la expansión física de las grandes ciudades latinoamericanas?', correcta:'El aumento en los tiempos de desplazamiento de sus habitantes', opts:['La disminución total del tráfico vehicular','La desaparición completa de la contaminación','La reducción de la población urbana a cero'] },
  { pregunta:'¿Qué término describe la separación de distintos grupos sociales en zonas específicas de una ciudad, generando desigualdad en el acceso a servicios?', correcta:'Segregación socioespacial', opts:['Integración social plena','Explosión demográfica','Envejecimiento poblacional'] },
  { pregunta:'¿Qué relación existe entre las actividades productivas y el medio natural, según el temario?', correcta:'La explotación de recursos naturales para la producción genera un impacto ambiental importante', opts:['No existe ninguna relación entre ambos','Las actividades productivas nunca afectan el medioambiente','El medio natural no tiene relación con la economía'] },
  { pregunta:'¿Qué tipo de contaminación puede generarse por la expansión física descontrolada de una ciudad?', correcta:'Contaminación atmosférica, acústica e hídrica', opts:['Ningún tipo de contaminación adicional','Solo contaminación visual sin consecuencias','Contaminación exclusivamente del aire, nunca del agua'] },
  { pregunta:'¿Qué instrumentos suelen usarse para representar el volumen y distribución de la población mundial?', correcta:'Datos estadísticos y mapas temáticos', opts:['Solo relatos orales sin ningún dato','Únicamente fotografías sin información numérica','Recetas de cocina tradicionales'] },
];
export function genPoblacionTerritorioEpjaM2Round(){
  const item = pick(POBLACION_TERRITORIO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_POBLACION_TERRITORIO_M2,
  };
}

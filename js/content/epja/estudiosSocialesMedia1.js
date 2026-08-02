import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Media: Estudios Sociales ----------------
   Nivel 1 Media equivale a 1°-2° medio (ver content/grades.js). Fuente real: "Temario Primer
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er semestre). El eje de NM1 Estudios Sociales recorre la historia de Chile desde los
   pueblos indígenas al momento de la conquista hasta el régimen democrático actual, además
   de un bloque de ciudadanía/derechos. 4 módulos: Colonia e Independencia (pueblos indígenas,
   relaciones español-indígena en la Colonia, factores y efectos de la Independencia), Chile
   en el Siglo XIX: Consolidación Territorial (configuración del territorio -Guerra del
   Pacífico, Araucanía, Antártica-, transición económica del salitre a la crisis de 1929),
   Chile en el Siglo XX: De la Cuestión Social a la Democracia (cuestión social,
   industrialización sustitutiva/Estado Benefactor, ampliación del sufragio, reformas
   estructurales, quiebre y retorno de la democracia, régimen democrático actual), y
   Ciudadanía, Derechos y Participación (marco constitucional/tratados, instituciones,
   participación ciudadana).
   El módulo "Chile en el Siglo XX" incluye el objetivo del temario "Explica el proceso de
   quiebre de la democracia: el régimen militar y las transformaciones que impone... la
   transición a la democracia" — un texto más detallado que el de Nivel 2 Básica (que solo
   pedía "ubicar temporalmente" el período). Aun así, se aplica el MISMO criterio ya
   establecido en historia.js (SIGLOXX_DEMOCRATIZACION_BANK, 6° básico) y en
   estudiosSocialesNivel2.js: solo hechos cronológicos indiscutibles y transformaciones
   ampliamente documentadas de forma neutral (cambio del modelo económico hacia una economía
   de mercado, fecha del golpe de 1973, del plebiscito de 1988, del retorno a un gobierno
   electo en 1990), sin ningún juicio de valor, causa, consecuencia ni interpretación
   multiperspectiva — ese debate queda para la sala de clases con un profesor, tal como
   reconoce el propio temario al tratarse de un proceso complejo. No fue necesario replantear
   esta política al usuario: ya estaba resuelta y documentada para este mismo período
   histórico en sesiones anteriores. Contextos de vida adulta en el resto de los módulos. */

export const ESTUDIOS_SOCIALES_EPJA_M1_MODULES = [
  {id:'coloniaIndependenciaEpjaM1', label:'Colonia e Independencia', open:true, key:'coloniaIndependenciaEpjaM1'},
  {id:'sigloXIXTerritorioEpjaM1', label:'Chile en el Siglo XIX', open:true, key:'sigloXIXTerritorioEpjaM1'},
  {id:'sigloXXDemocraciaEpjaM1', label:'Chile en el Siglo XX: Hacia la Democracia', open:true, key:'sigloXXDemocraciaEpjaM1'},
  {id:'ciudadaniaDerechosEpjaM1', label:'Ciudadanía, Derechos y Participación', open:true, key:'ciudadaniaDerechosEpjaM1'},
];
export const ESTUDIOS_SOCIALES_EPJA_M1_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

/* ---------------- Colonia e Independencia ---------------- */
const RECURSO_COLONIA_INDEPENDENCIA_M1 = 'Al momento de la conquista, distintos <b>pueblos indígenas</b> habitaban el territorio de Chile, cada uno con su propia cultura y organización. Durante la <b>Colonia</b>, se establecieron relaciones desiguales entre españoles e indígenas: trabajo obligatorio, mestizaje (mezcla de ambos pueblos), evangelización, y también resistencia indígena frente a la dominación española. El proceso de <b>Independencia</b>, tanto en América como en Chile, fue impulsado por ideas de autogobierno y descontento con el dominio español, y trajo cambios profundos —y también continuidades— en lo político, social, económico y cultural.';
const COLONIA_INDEPENDENCIA_M1_BANK = [
  { pregunta:'¿Qué término describe la mezcla cultural y biológica entre españoles e indígenas durante la Colonia?', correcta:'Mestizaje', opts:['Evangelización','Encomienda','Cabildo abierto'] },
  { pregunta:'¿Cómo se llamaba el sistema colonial que obligaba a los indígenas a trabajar para un encomendero español?', correcta:'La encomienda', opts:['El cabildo','El mestizaje','La Real Audiencia'] },
  { pregunta:'¿Qué actitud mantuvieron algunos pueblos indígenas, como el mapuche, frente a la dominación española?', correcta:'Resistencia indígena', opts:['Aceptación inmediata sin conflicto','Migración total fuera del territorio','Ninguna reacción'] },
  { pregunta:'¿Cómo se llama el proceso mediante el cual la Iglesia católica difundió su religión entre los pueblos indígenas durante la Colonia?', correcta:'Evangelización', opts:['Mestizaje','Independencia','Industrialización'] },
  { pregunta:'¿Cuál de los siguientes fue un factor que impulsó los procesos de Independencia en América?', correcta:'El descontento con el dominio y las restricciones impuestas por España', opts:['El deseo de mantener el dominio español para siempre','La ausencia total de ideas políticas nuevas','La abundancia de oro enviado a España sin ningún conflicto'] },
  { pregunta:'Después de la Independencia de Chile, ¿qué elemento cambió respecto al período colonial?', correcta:'Chile pasó a gobernarse de forma autónoma, sin depender de la Corona española', opts:['Chile continuó gobernado directamente desde España','Desapareció por completo el idioma español','Se prohibió cualquier forma de gobierno'] },
  { pregunta:'¿Qué elemento se mantuvo con continuidad, sin grandes cambios, en los primeros años tras la Independencia de Chile?', correcta:'La estructura social heredada de la Colonia, con grandes diferencias entre clases', opts:['La forma de gobierno, que siguió siendo una monarquía española','El idioma oficial, que pasó a ser el francés','La religión oficial, que dejó de practicarse por completo'] },
  { pregunta:'¿Cómo se llamaba la institución colonial encargada del gobierno local de una ciudad, formada por vecinos destacados?', correcta:'El cabildo', opts:['La encomienda','El virreinato','La Real Audiencia'] },
  { pregunta:'¿Qué producto de intercambio comercial fue relevante entre España y sus colonias americanas durante el período colonial?', correcta:'Metales preciosos como el oro y la plata', opts:['Petróleo','Tecnología electrónica','Automóviles'] },
];
export function genColoniaIndependenciaEpjaM1Round(){
  const item = pick(COLONIA_INDEPENDENCIA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COLONIA_INDEPENDENCIA_M1,
  };
}

/* ---------------- Chile en el Siglo XIX: Consolidación Territorial ---------------- */
const RECURSO_SIGLO_XIX_M1 = 'Durante el siglo XIX, Chile consolidó su territorio a través de varios procesos: la <b>Guerra del Pacífico</b> (1879-1883) contra Perú y Bolivia, la incorporación de la <b>Araucanía</b> al territorio nacional, y la afirmación de la soberanía chilena en el extremo austral y en la <b>Antártica</b> ya en el siglo XX. Hacia fines del siglo XIX, la economía chilena dependió fuertemente de la explotación minera del <b>salitre</b>, con fuerte presencia de capitales ingleses, lo que financió obras públicas en comunicación, infraestructura y educación — hasta que la caída del salitre y la <b>crisis económica mundial de 1929</b> golpearon duramente al país.';
const SIGLO_XIX_M1_BANK = [
  { pregunta:'¿Qué conflicto bélico enfrentó a Chile contra Perú y Bolivia entre 1879 y 1883?', correcta:'La Guerra del Pacífico', opts:['La Guerra Civil de 1891','La Guerra de Arauco','La Segunda Guerra Mundial'] },
  { pregunta:'¿Qué territorio del sur de Chile fue incorporado al país durante el siglo XIX, en un proceso conocido como ocupación de la Araucanía?', correcta:'La Araucanía', opts:['La Patagonia argentina','La Isla de Pascua','El desierto de Atacama'] },
  { pregunta:'¿En qué continente afirmó Chile su soberanía ya durante el siglo XX, además del extremo austral?', correcta:'En la Antártica', opts:['En África','En Oceanía','En Asia'] },
  { pregunta:'¿Qué mineral fue la principal fuente de riqueza de la economía chilena a fines del siglo XIX?', correcta:'El salitre', opts:['El cobre','El carbón','El oro'] },
  { pregunta:'¿Qué país tenía fuerte presencia de capitales invertidos en la actividad del salitre en Chile a fines del siglo XIX?', correcta:'Inglaterra', opts:['Francia','Alemania','Estados Unidos'] },
  { pregunta:'¿En qué se invirtieron parte de las riquezas generadas por el salitre, según el temario histórico?', correcta:'En vías de comunicación, infraestructura y educación', opts:['Únicamente en gastos militares','No se invirtió en nada','Solo en construir palacios privados'] },
  { pregunta:'¿Qué evento económico mundial de 1929 afectó gravemente a Chile tras el fin de la riqueza del salitre?', correcta:'La crisis económica mundial de 1929', opts:['La Guerra del Pacífico','La Revolución Industrial','La independencia de Chile'] },
  { pregunta:'¿En qué región del país se concentró principalmente la explotación del salitre a fines del siglo XIX?', correcta:'En el norte del país (desierto de Atacama)', opts:['En la Patagonia austral','En la zona central agrícola','En la Isla de Pascua'] },
  { pregunta:'¿Qué consecuencia tuvo en Chile el fin de la demanda mundial de salitre, tras la aparición del salitre sintético?', correcta:'Una fuerte crisis económica y desempleo en la zona salitrera', opts:['Un aumento inmediato de la riqueza nacional','Ninguna consecuencia económica','La anexión de nuevos territorios'] },
];
export function genSigloXIXTerritorioEpjaM1Round(){
  const item = pick(SIGLO_XIX_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SIGLO_XIX_M1,
  };
}

/* ---------------- Chile en el Siglo XX: De la Cuestión Social a la Democracia ---------------- */
const RECURSO_SIGLO_XX_DEMOCRACIA_M1 = 'A comienzos del siglo XX surgió en Chile la llamada <b>"cuestión social"</b>: las malas condiciones de vida y trabajo de los obreros, que impulsaron nuevas organizaciones de trabajadores. Más adelante, el Estado adoptó un modelo de <b>industrialización sustitutiva de importaciones</b> y de <b>Estado Benefactor</b> (con mayor rol social del Estado), y se fue ampliando el derecho a voto (a las mujeres, a los analfabetos, a los no videntes) junto con reformas estructurales como la <b>Reforma Agraria</b> y la <b>Nacionalización del cobre</b>. En 1973 un golpe de Estado terminó con el gobierno elegido democráticamente, dando paso a un régimen militar que gobernó hasta que, tras el plebiscito de 1988, Chile retornó a un gobierno elegido democráticamente en 1990. El <b>régimen democrático</b> actual se caracteriza por elección periódica de autoridades, división de poderes del Estado, fiscalización de las autoridades y participación ciudadana.';
const SIGLO_XX_DEMOCRACIA_M1_BANK = [
  { pregunta:'¿Cómo se conoce al conjunto de problemas sociales generados por las malas condiciones de vida y trabajo de los obreros a comienzos del siglo XX en Chile?', correcta:'La cuestión social', opts:['La Reforma Agraria','La Guerra del Pacífico','El Estado Benefactor'] },
  { pregunta:'¿Qué modelo económico adoptó el Estado chileno durante buena parte del siglo XX, buscando producir internamente lo que antes se importaba?', correcta:'La industrialización sustitutiva de importaciones', opts:['El libre comercio total sin ningún arancel','La economía exclusivamente agrícola','El retorno al modelo colonial'] },
  { pregunta:'¿En qué año las mujeres chilenas obtuvieron el derecho a votar en elecciones presidenciales y parlamentarias?', correcta:'1949', opts:['1810','1883','1990'] },
  { pregunta:'¿Cuál de las siguientes fue una reforma estructural realizada en Chile durante el siglo XX, orientada a redistribuir la propiedad de la tierra?', correcta:'La Reforma Agraria', opts:['La Guerra del Pacífico','La evangelización colonial','El Cabildo Abierto'] },
  { pregunta:'¿Qué reforma estructural del siglo XX puso bajo control del Estado chileno la explotación del principal mineral del país?', correcta:'La Nacionalización del cobre', opts:['La Reforma Agraria','La Guerra del Pacífico','La independencia de Chile'] },
  { pregunta:'¿En qué fecha ocurrió el golpe de Estado que terminó con el gobierno elegido democráticamente en Chile?', correcta:'El 11 de septiembre de 1973', opts:['El 18 de septiembre de 1810','El 5 de octubre de 1988','El 11 de marzo de 1990'] },
  { pregunta:'¿En qué año se realizó el plebiscito en que la mayoría de los chilenos votó por no continuar bajo el mismo gobierno?', correcta:'1988', opts:['1973','1990','1949'] },
  { pregunta:'¿En qué fecha asumió un nuevo Presidente elegido democráticamente, marcando el retorno a la democracia en Chile?', correcta:'El 11 de marzo de 1990', opts:['El 11 de septiembre de 1973','El 5 de octubre de 1988','El 18 de septiembre de 1810'] },
  { pregunta:'¿Cuál de las siguientes es una característica del régimen democrático actual de Chile?', correcta:'La elección periódica de autoridades y la división de poderes del Estado', opts:['La concentración de todo el poder en una sola persona sin elecciones','La ausencia total de instituciones fiscalizadoras','La prohibición de la participación ciudadana'] },
];
export function genSigloXXDemocraciaEpjaM1Round(){
  const item = pick(SIGLO_XX_DEMOCRACIA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SIGLO_XX_DEMOCRACIA_M1,
  };
}

/* ---------------- Ciudadanía, Derechos y Participación ---------------- */
const RECURSO_CIUDADANIA_DERECHOS_M1 = 'La <b>Constitución</b> y diversos <b>tratados internacionales</b> firmados por Chile garantizan derechos políticos, civiles, económicos y sociales, y existen instituciones responsables de resguardar esos derechos frente a situaciones de violencia o atropello. El concepto de <b>ciudadanía</b> implica ejercer esos derechos y participar activamente en la vida democrática, a través de mecanismos como el <b>voto</b>, la afiliación a <b>partidos políticos</b>, y la participación en <b>organizaciones y movimientos sociales</b> — formas concretas de influir en las decisiones que afectan a la comunidad.';
const CIUDADANIA_DERECHOS_M1_BANK = [
  { pregunta:'¿Qué documento fundamental establece los derechos y deberes de las personas en Chile?', correcta:'La Constitución', opts:['Un contrato de arriendo cualquiera','Un diario local','Un manual de instrucciones'] },
  { pregunta:'Además de la Constitución, ¿qué otro tipo de documento internacional garantiza derechos políticos, civiles, económicos y sociales?', correcta:'Los tratados internacionales suscritos por Chile', opts:['Los avisos comerciales','Las recetas de cocina','Los horarios de buses'] },
  { pregunta:'Si una persona sufre un atropello a sus derechos, ¿a qué tipo de entidad puede recurrir para que la ayude a resguardarlos?', correcta:'A una institución responsable de proteger esos derechos', opts:['A un vecino cualquiera sin relación con el caso','A ninguna parte, ya que no existen instituciones para eso','Únicamente a un familiar'] },
  { pregunta:'¿Cuál de las siguientes es una forma de participación ciudadana en democracia?', correcta:'Votar en una elección', opts:['No informarse nunca sobre temas públicos','Evitar cualquier tipo de organización social','Ignorar las decisiones de la comunidad'] },
  { pregunta:'¿Qué son los partidos políticos, en el contexto de la participación ciudadana?', correcta:'Organizaciones a través de las cuales las personas participan en la vida política', opts:['Empresas privadas sin fines públicos','Instituciones religiosas','Clubes deportivos'] },
  { pregunta:'Un grupo de vecinos que se organiza para exigir mejoras en su barrio, ¿qué tipo de participación ciudadana está ejerciendo?', correcta:'Participación a través de una organización o movimiento social', opts:['Ninguna forma de participación reconocida','Un trámite exclusivamente privado','Una forma de evasión de impuestos'] },
  { pregunta:'¿Qué se entiende por "ciudadanía" en un régimen democrático?', correcta:'El ejercicio de derechos y la participación activa en la vida pública', opts:['La obligación de no opinar nunca sobre temas públicos','Un trámite que solo pueden hacer los extranjeros','La prohibición de votar en elecciones'] },
  { pregunta:'Una persona que se informa sobre los candidatos y luego vota en una elección municipal, ¿qué está ejerciendo?', correcta:'Su derecho a la participación ciudadana', opts:['Ninguna acción con efecto real','Un trámite bancario','Una obligación religiosa'] },
];
export function genCiudadaniaDerechosEpjaM1Round(){
  const item = pick(CIUDADANIA_DERECHOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_CIUDADANIA_DERECHOS_M1,
  };
}

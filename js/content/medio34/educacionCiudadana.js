import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan de Formación General: Educación Ciudadana ----------------
   Fuente real: Decreto 614/2013, Plan de Formación General 3°-4° medio, asignatura
   Educación Ciudadana (curriculumnacional.cl). Los 8 OA de cada año mezclan
   conceptos factuales (instituciones, derechos, mecanismos del Estado) con
   habilidades reflexivas/participativas propias (opinar, participar en instancias
   escolares, evaluar riesgos para la democracia) — se adaptaron al motor de opción
   múltiple los conceptos con una definición única y verificable, con formato de
   "¿qué significa este concepto?" (mismo patrón ya usado en los módulos de
   Formación Ciudadana de Básica).

   3° medio (OAC-01: fundamentos de la democracia y la ciudadanía; OAC-02/05: acceso
   a la justicia y derechos humanos; OAC-04/07: relación Estado-mercado y territorio)
   — 3 módulos. Fuera: OAC-03 (reflexionar sobre riesgos a la democracia, personal/
   grupal), OAC-06 (reflexionar sobre formas de participación, personal/grupal),
   OAC-08 (participar en instancias escolares, práctica real).

   4° medio (OAC-01: institucionalidad democrática; OAC-03/04: modelos de desarrollo
   y derechos laborales; OAC-05: libertad/igualdad/desafíos sociales; OAC-06: medios
   de comunicación y ciudadanía digital) — 4 módulos. Fuera: OAC-02 (participar en
   soluciones a conflictos, práctica real), OAC-07 (proponer formas de organización
   territorial, producción propia), OAC-08 (tomar decisiones éticas personales,
   subjetivo). */

export const EDUCACION_CIUDADANA_MODULES_M3 = [
  {id:'democraciaciudadaniapg3', label:'Democracia y Ciudadanía', open:true, key:'democraciaciudadaniapg3'},
  {id:'sistemajudicialddhhpg3', label:'Sistema Judicial y Derechos Humanos', open:true, key:'sistemajudicialddhhpg3'},
  {id:'estadomercadoterritoriopg3', label:'Estado, Mercado y Territorio', open:true, key:'estadomercadoterritoriopg3'},
];
export const EDUCACION_CIUDADANA_POS_M3 = [ {x:26,y:82},{x:70,y:50},{x:26,y:16} ];

export const EDUCACION_CIUDADANA_MODULES_M4 = [
  {id:'institucionalidaddemocraticapg4', label:'Institucionalidad Democrática', open:true, key:'institucionalidaddemocraticapg4'},
  {id:'modelosdesarrollopg4', label:'Modelos de Desarrollo y Derechos Laborales', open:true, key:'modelosdesarrollopg4'},
  {id:'libertadigualdadpg4', label:'Libertad, Igualdad y Desafíos Sociales', open:true, key:'libertadigualdadpg4'},
  {id:'mediosciudadaniadigitalpg4', label:'Medios de Comunicación y Ciudadanía Digital', open:true, key:'mediosciudadaniadigitalpg4'},
];
export const EDUCACION_CIUDADANA_POS_M4 = [ {x:26,y:88},{x:70,y:64},{x:26,y:38},{x:70,y:12} ];

function genDefRound(bank, promptPrefix, speak, recurso){
  const item = pick(bank);
  const others = bank.filter(function(x){ return x!==item; });
  const distract = shuffle(others).slice(0,3).map(function(o){ return o.definicion; });
  const opts = shuffle([item.definicion].concat(distract)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+promptPrefix+' "'+item.termino+'"?</p>',
    options:opts, correctValue:item.definicion, cols:2, panel:true,
    speakText:speak+' '+item.termino+'.',
    explain:item.termino+' significa: '+item.definicion,
    recurso:recurso,
  };
}

/* ---------------- Democracia y Ciudadanía (OAC-01) ---------------- */
const RECURSO_DEMOCRACIA_PG3 = 'La democracia moderna se sostiene sobre varios pilares que se complementan: la <b>separación de poderes</b> evita que una sola persona o grupo concentre demasiado poder; el <b>Estado de derecho</b> asegura que la ley se aplique por igual a todos, incluidas las autoridades; el <b>sufragio universal</b> garantiza que cada persona adulta pueda votar sin discriminación; y el <b>pluralismo político</b> permite que convivan distintas ideas y proyectos de sociedad. Entender estos fundamentos ayuda a reconocer cuándo una democracia funciona bien y cuándo alguno de estos pilares está debilitado.';
const DEMOCRACIA_CIUDADANIA_BANK_PG3 = [
  {termino:'Separación de poderes', definicion:'Dividir el poder del Estado en Ejecutivo, Legislativo y Judicial, para que ninguno concentre demasiado poder y se controlen entre sí.'},
  {termino:'Libertad de expresión', definicion:'El derecho de toda persona a manifestar sus opiniones e ideas, incluso las que son minoritarias o incómodas para el poder.'},
  {termino:'Sufragio universal', definicion:'El derecho de todas las personas mayores de edad a votar, sin distinción de género, origen, religión o nivel socioeconómico.'},
  {termino:'Estado de derecho', definicion:'El principio de que todas las personas e instituciones, incluidas las autoridades, están sometidas a la ley por igual.'},
  {termino:'Pluralismo político', definicion:'La coexistencia legítima de distintos partidos, ideologías y visiones de sociedad dentro de un mismo sistema democrático.'},
  {termino:'Soberanía popular', definicion:'El principio de que el poder político reside en el pueblo, que lo ejerce directamente o a través de representantes elegidos.'},
  {termino:'Libertad de asociación', definicion:'El derecho de las personas a formar y participar libremente en organizaciones, sindicatos, partidos o agrupaciones.'},
  {termino:'Alternancia en el poder', definicion:'La posibilidad real de que un gobierno sea reemplazado por otro distinto tras elecciones periódicas y libres.'},
];
export function genDemocraciaCiudadaniaPG3Round(){
  return genDefRound(DEMOCRACIA_CIUDADANIA_BANK_PG3, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_DEMOCRACIA_PG3);
}

/* ---------------- Sistema Judicial y Derechos Humanos (OAC-02/05) ---------------- */
const RECURSO_JUDICIAL_DDHH_PG3 = 'El acceso a la justicia no depende solo de que existan tribunales, sino de que las personas puedan usarlos realmente: por eso existen mecanismos como la <b>asistencia jurídica gratuita</b> para quienes no pueden pagar un abogado. Garantías como el <b>debido proceso</b> y la <b>presunción de inocencia</b> protegen a cualquier persona acusada de un delito. A nivel internacional, los <b>derechos humanos</b> —reconocidos en la Declaración Universal de 1948— establecen un piso mínimo de dignidad que ningún Estado debería vulnerar, y existen tribunales como la Corte Interamericana que pueden juzgar a los propios Estados cuando los violan.';
const SISTEMA_JUDICIAL_DDHH_BANK_PG3 = [
  {termino:'Poder Judicial', definicion:'El poder del Estado encargado de aplicar las leyes y resolver conflictos a través de tribunales independientes.'},
  {termino:'Presunción de inocencia', definicion:'El principio de que toda persona acusada de un delito se considera inocente hasta que se demuestre lo contrario en un juicio.'},
  {termino:'Asistencia jurídica gratuita', definicion:'El mecanismo que permite a las personas sin recursos acceder a defensa legal, para que la justicia no dependa de la capacidad de pago.'},
  {termino:'Derechos humanos', definicion:'Los derechos inherentes a toda persona por el solo hecho de serlo, universales, inalienables e independientes de cualquier condición.'},
  {termino:'Declaración Universal de los Derechos Humanos', definicion:'El documento adoptado por la ONU en 1948 que establece los derechos y libertades fundamentales de todo ser humano.'},
  {termino:'Debido proceso', definicion:'El conjunto de garantías que aseguran un juicio justo, como el derecho a defensa, a un juez imparcial y a conocer la acusación.'},
  {termino:'Corte Interamericana de Derechos Humanos', definicion:'Un tribunal internacional que puede juzgar a los Estados americanos cuando violan los derechos humanos de sus habitantes.'},
  {termino:'Independencia judicial', definicion:'El principio de que los jueces deben resolver los casos sin presiones políticas, económicas o de otro poder del Estado.'},
];
export function genSistemaJudicialDdhhPG3Round(){
  return genDefRound(SISTEMA_JUDICIAL_DDHH_BANK_PG3, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_JUDICIAL_DDHH_PG3);
}

/* ---------------- Estado, Mercado y Territorio (OAC-04/07) ---------------- */
const RECURSO_ESTADO_MERCADO_PG3 = 'La relación entre el Estado y el mercado se expresa en decisiones muy concretas: cuánto <b>sueldo mínimo</b> exigir, cuánta <b>carga tributaria</b> cobrar, o cuánta <b>regulación estatal</b> imponer a las empresas para proteger a consumidores y trabajadores. Estas decisiones también tienen una dimensión territorial: la <b>descentralización</b> traspasa poder de decisión desde el gobierno central hacia regiones y comunas, mientras que el <b>ordenamiento territorial</b> planifica cómo se usa el suelo. Comprender estas relaciones permite evaluar si el desarrollo económico de un país beneficia por igual a todos sus territorios y grupos sociales.';
const ESTADO_MERCADO_TERRITORIO_BANK_PG3 = [
  {termino:'Economía social de mercado', definicion:'Un modelo que combina la libre iniciativa privada con la regulación e intervención del Estado para corregir desigualdades.'},
  {termino:'Carga tributaria', definicion:'El conjunto de impuestos que las personas y empresas pagan al Estado, usado para financiar bienes y servicios públicos.'},
  {termino:'Sueldo mínimo', definicion:'El monto más bajo que un empleador puede pagar legalmente a un trabajador por su jornada laboral.'},
  {termino:'Productividad', definicion:'La relación entre lo que se produce y los recursos, como el tiempo, el trabajo o el capital, usados para producirlo.'},
  {termino:'Descentralización territorial', definicion:'El traspaso de atribuciones y recursos desde el gobierno central hacia gobiernos regionales o locales.'},
  {termino:'Ordenamiento territorial', definicion:'La planificación de cómo se usa el suelo y se distribuyen las actividades humanas dentro de un territorio.'},
  {termino:'Regulación estatal del mercado', definicion:'Las normas que el Estado impone a las empresas para proteger a consumidores, trabajadores y el medioambiente.'},
  {termino:'Brecha territorial', definicion:'Las diferencias en acceso a servicios, infraestructura u oportunidades entre distintas zonas de un mismo país.'},
];
export function genEstadoMercadoTerritorioPG3Round(){
  return genDefRound(ESTADO_MERCADO_TERRITORIO_BANK_PG3, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_ESTADO_MERCADO_PG3);
}

/* ================= 4° medio ================= */

/* ---------------- Institucionalidad Democrática (OAC-01) ---------------- */
const RECURSO_INSTITUCIONALIDAD_PG4 = 'La institucionalidad democrática está formada por organismos concretos que hacen posible el funcionamiento del sistema: el <b>Congreso Nacional</b> elabora las leyes, el <b>Tribunal Constitucional</b> revisa que se ajusten a la Constitución, y la <b>Contraloría</b> fiscaliza el uso de los fondos públicos. Mecanismos como el <b>plebiscito</b> permiten consultar directamente a la ciudadanía, y un <b>sistema electoral proporcional</b> busca que la composición del Congreso refleje de forma más fiel la diversidad de votos. La <b>rendición de cuentas</b> es el hilo conductor de todos estos organismos: ninguna autoridad debería ejercer poder sin tener que responder públicamente por sus decisiones.';
const INSTITUCIONALIDAD_DEMOCRATICA_BANK_PG4 = [
  {termino:'Congreso Nacional', definicion:'El órgano formado por la Cámara de Diputados y el Senado, encargado de elaborar y aprobar las leyes del país.'},
  {termino:'Plebiscito', definicion:'Una consulta directa a la ciudadanía para que decida sobre una materia específica, como una reforma constitucional.'},
  {termino:'Sistema electoral proporcional', definicion:'Un sistema donde los escaños se reparten según el porcentaje de votos obtenido por cada lista o partido.'},
  {termino:'Contraloría General de la República', definicion:'El organismo autónomo que fiscaliza la legalidad de los actos del Estado y el uso de los fondos públicos.'},
  {termino:'Tribunal Constitucional', definicion:'El órgano encargado de resolver si una ley o un acto del Estado se ajusta a lo que establece la Constitución.'},
  {termino:'Gobierno de coalición', definicion:'Un gobierno formado por la alianza de varios partidos políticos que acuerdan gobernar juntos.'},
  {termino:'Rendición de cuentas', definicion:'La obligación de las autoridades de informar y responder públicamente por sus decisiones y el uso del poder.'},
  {termino:'Representación proporcional de género', definicion:'Mecanismos que buscan asegurar una participación equilibrada de hombres y mujeres en cargos de elección popular.'},
];
export function genInstitucionalidadDemocraticaPG4Round(){
  return genDefRound(INSTITUCIONALIDAD_DEMOCRATICA_BANK_PG4, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_INSTITUCIONALIDAD_PG4);
}

/* ---------------- Modelos de Desarrollo y Derechos Laborales (OAC-03/04) ---------------- */
const RECURSO_MODELOS_DESARROLLO_PG4 = 'Los modelos de desarrollo tienen consecuencias muy concretas sobre las personas y el planeta: una <b>economía extractivista</b> basada solo en exportar recursos naturales sin procesarlos genera más <b>huella de carbono</b> que una economía diversificada, y por eso muchos países avanzan hacia una <b>transición energética</b> hacia fuentes renovables dentro de un modelo de <b>desarrollo sostenible</b>. En el ámbito laboral, herramientas como el <b>sindicato</b>, la <b>negociación colectiva</b> y el <b>fuero laboral</b> buscan equilibrar la relación entre trabajadores y empleadores, apuntando hacia lo que se conoce como <b>trabajo decente</b>: un empleo con condiciones justas y protección real.';
const MODELOS_DESARROLLO_BANK_PG4 = [
  {termino:'Desarrollo sostenible', definicion:'Un modelo de desarrollo que busca satisfacer las necesidades actuales sin comprometer los recursos de las generaciones futuras.'},
  {termino:'Huella de carbono', definicion:'La cantidad total de gases de efecto invernadero que genera una persona, empresa o país con sus actividades.'},
  {termino:'Negociación colectiva', definicion:'El proceso mediante el cual trabajadores organizados negocian condiciones laborales directamente con su empleador.'},
  {termino:'Sindicato', definicion:'Una organización de trabajadores que defiende sus derechos e intereses laborales frente al empleador.'},
  {termino:'Trabajo decente', definicion:'Un empleo con condiciones justas: salario adecuado, seguridad, protección social y respeto a los derechos laborales.'},
  {termino:'Economía extractivista', definicion:'Un modelo de desarrollo basado principalmente en la extracción y exportación de recursos naturales sin mayor procesamiento.'},
  {termino:'Transición energética', definicion:'El cambio progresivo desde fuentes de energía basadas en combustibles fósiles hacia fuentes renovables y menos contaminantes.'},
  {termino:'Fuero laboral', definicion:'Una protección legal que impide el despido de ciertos trabajadores en situaciones específicas, como el embarazo.'},
];
export function genModelosDesarrolloPG4Round(){
  return genDefRound(MODELOS_DESARROLLO_BANK_PG4, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_MODELOS_DESARROLLO_PG4);
}

/* ---------------- Libertad, Igualdad y Desafíos Sociales (OAC-05) ---------------- */
const RECURSO_LIBERTAD_IGUALDAD_PG4 = 'Los conceptos de libertad, igualdad y solidaridad se ponen a prueba frente a desafíos sociales reales. La <b>brecha salarial de género</b> muestra que la igualdad formal ante la ley no siempre se traduce en igualdad efectiva; la <b>discriminación estructural</b> describe cómo la desventaja de un grupo puede repetirse a través de instituciones y prácticas, no solo por actos individuales. Conceptos como la <b>interseccionalidad</b> ayudan a entender que distintas formas de desigualdad —de género, etnia o clase— pueden combinarse en una misma persona, y enfoques como la <b>pobreza multidimensional</b> muestran que superar la pobreza requiere mirar más allá del ingreso: también la salud, la educación y las redes sociales importan.';
const LIBERTAD_IGUALDAD_BANK_PG4 = [
  {termino:'Igualdad de género', definicion:'El principio de que hombres y mujeres deben tener los mismos derechos, oportunidades y trato ante la ley y la sociedad.'},
  {termino:'Inclusión social', definicion:'El proceso de asegurar que todas las personas, incluidas las que tienen discapacidad u otras condiciones, participen plenamente en la sociedad.'},
  {termino:'Brecha salarial de género', definicion:'La diferencia de remuneración que reciben hombres y mujeres por realizar un trabajo de igual valor.'},
  {termino:'Discriminación estructural', definicion:'Un patrón de desventaja sistemática que afecta a un grupo social a través de las instituciones y prácticas de una sociedad.'},
  {termino:'Diversidad cultural', definicion:'La coexistencia de distintas identidades, tradiciones y formas de vida dentro de un mismo territorio o sociedad.'},
  {termino:'Movilidad social', definicion:'La posibilidad de que una persona mejore, o empeore, su posición socioeconómica respecto a la de su familia de origen.'},
  {termino:'Interseccionalidad', definicion:'La idea de que distintas formas de desigualdad, como género, etnia o clase, pueden combinarse y afectar a una persona simultáneamente.'},
  {termino:'Pobreza multidimensional', definicion:'Un enfoque que mide la pobreza no solo por ingresos, sino también por el acceso a salud, educación, vivienda y redes sociales.'},
];
export function genLibertadIgualdadPG4Round(){
  return genDefRound(LIBERTAD_IGUALDAD_BANK_PG4, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_LIBERTAD_IGUALDAD_PG4);
}

/* ---------------- Medios de Comunicación y Ciudadanía Digital (OAC-06) ---------------- */
const RECURSO_MEDIOS_DIGITAL_PG4 = 'Las nuevas tecnologías de la información traen oportunidades y riesgos para la vida democrática. La <b>brecha digital</b> significa que no todas las personas tienen las mismas posibilidades de acceder a internet, mientras que las <b>cámaras de eco</b> pueden aislar a alguien dentro de un entorno donde solo recibe información que confirma lo que ya piensa. Fenómenos como las <b>fake news</b> y la <b>desinformación</b> buscan manipular a la opinión pública, por lo que la <b>alfabetización mediática</b> —la capacidad de analizar críticamente lo que se lee y comparte— se ha vuelto una habilidad ciudadana esencial. Al mismo tiempo, la <b>participación ciudadana digital</b> abre nuevas formas de informarse y opinar sobre decisiones públicas.';
const MEDIOS_DIGITAL_BANK_PG4 = [
  {termino:'Brecha digital', definicion:'La desigualdad de acceso a internet y tecnología entre distintos grupos sociales, económicos o territorios.'},
  {termino:'Cámara de eco', definicion:'Un entorno digital donde una persona solo recibe información que refuerza sus propias ideas, aislándola de otras posturas.'},
  {termino:'Fake news (noticias falsas)', definicion:'Información falsa o engañosa presentada como si fuera una noticia real, difundida para desinformar o manipular.'},
  {termino:'Alfabetización mediática', definicion:'La capacidad de analizar, evaluar y crear mensajes de medios de comunicación de forma crítica e informada.'},
  {termino:'Vigilancia digital', definicion:'El seguimiento y registro de la actividad de las personas en internet, a veces sin su conocimiento o consentimiento.'},
  {termino:'Participación ciudadana digital', definicion:'El uso de plataformas digitales para que la ciudadanía se informe, opine y participe en decisiones públicas.'},
  {termino:'Desinformación', definicion:'La difusión deliberada de información falsa con la intención de engañar a la opinión pública.'},
  {termino:'Neutralidad de la red', definicion:'El principio de que los proveedores de internet deben tratar todo el tráfico de datos por igual, sin privilegiar ciertos contenidos.'},
];
export function genMediosCiudadaniaDigitalPG4Round(){
  return genDefRound(MEDIOS_DIGITAL_BANK_PG4, '¿Qué significa el concepto', '¿Qué significa el concepto', RECURSO_MEDIOS_DIGITAL_PG4);
}

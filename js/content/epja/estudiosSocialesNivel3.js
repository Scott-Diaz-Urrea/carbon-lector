import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 3 de Educación Básica: Estudios Sociales ----------------
   Mismo marco que estudiosSocialesNivel2.js: fuente real "Temario Tercer Nivel de
   Educación Básica", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026 2do
   semestre). El subsector "NB3 Estudios Sociales" combina historia universal, economía y
   formación ciudadana, con 16 objetivos agrupables en 3 bloques: 1) Historia y economía
   mundial del siglo XX (ubicar temporalmente períodos/hitos de la historia universal;
   procesos centrales del siglo XX -guerras mundiales, EE.UU./URSS como superpotencias,
   Guerra Fría, hegemonía estadounidense-; interconectividad global -desarrollo
   tecnológico, transportes y comunicaciones-; intercambio comercial mundial, bloques
   comerciales e inserción de Chile en la economía global; problemas que afectan a la
   humanidad hoy -deterioro medioambiental, pobreza, hambre-; conceptos de producción,
   consumo, capital, trabajo, oferta y demanda, mercado; características de una economía
   de mercado en comparación a otros modelos económicos); 2) El trabajo en Chile
   (transformaciones del trabajo durante el siglo XX -industrialización, terciarización,
   inserción de las mujeres, impacto de la tecnología-; principales ocupaciones laborales y
   distribución de la población económicamente activa; empleo formal e informal, sus
   condiciones laborales y sistemas de previsión y salud); 3) Democracia, Derechos Humanos
   y Estado (derechos humanos en su dimensión civil/política/económica/social; la
   democracia como organización que promueve esos derechos y los estatutos que los
   garantizan en Chile -Constitución, tratados internacionales, leyes-; comparación entre
   sistemas democráticos y regímenes dictatoriales/totalitarios; mecanismos de elección y
   designación de autoridades; el concepto de soberanía; los poderes del Estado y sus
   funciones).
   A diferencia de Nivel 2 (cuyo eje de historia de Chile sí requería tratar el quiebre
   democrático de 1973 y el retorno a la democracia en 1990, ver estudiosSocialesNivel2.js),
   el objetivo de NB3 sobre sistemas democráticos vs. dictatoriales/totalitarios (OA13) es
   puramente conceptual y comparativo -definiciones y características generales de cada
   tipo de régimen-, sin pedir ubicar temporalmente ni analizar un período específico de la
   historia de Chile, así que no se activa la misma política de contenido sensible
   documentada en historia.js/estudiosSocialesNivel2.js: no hace falta, porque el propio
   temario no pide ese análisis histórico puntual en este nivel.
   Los 3 módulos de este archivo cubren los 3 bloques uno a uno. Ningún objetivo de NB3
   Estudios Sociales queda fuera del motor de opción múltiple. */

export const ESTUDIOS_SOCIALES_EPJA_N3_MODULES = [
  {id:'historiaEconomiaMundialEpjaN3', label:'Historia y Economía Mundial S.XX', open:true, key:'historiaEconomiaMundialEpjaN3'},
  {id:'trabajoChileEpjaN3', label:'El Trabajo en Chile', open:true, key:'trabajoChileEpjaN3'},
  {id:'democraciaDerechosEpjaN3', label:'Democracia, DD.HH. y Estado', open:true, key:'democraciaDerechosEpjaN3'},
];
export const ESTUDIOS_SOCIALES_EPJA_N3_POS = [{x:24,y:80},{x:70,y:48},{x:24,y:16}];

const RECURSO_HISTORIA_ECONOMIA_N3 = 'El siglo XX estuvo marcado por las dos <b>guerras mundiales</b> y, tras ellas, por la <b>Guerra Fría</b>: una rivalidad política, económica y militar entre Estados Unidos y la Unión Soviética, dos superpotencias con modelos opuestos. El <b>desarrollo tecnológico</b> de ese siglo (aviones, radio, televisión, luego internet) hizo al mundo cada vez más interconectado en transportes y comunicaciones. El <b>intercambio comercial mundial</b> creció con la formación de <b>bloques comerciales</b> entre países, y Chile fue insertándose progresivamente en esa economía global. Entre los <b>problemas que afectan a la humanidad</b> hoy están el deterioro medioambiental, la pobreza y el hambre, que requieren acciones tanto nacionales como internacionales. En economía, la <b>oferta y la demanda</b> regulan el mercado: cuánto se produce y consume, y a qué precio; una <b>economía de mercado</b> deja que esas fuerzas determinen la mayoría de las decisiones económicas, a diferencia de otros modelos donde el Estado planifica de forma centralizada la producción.';
const SIGLO_XX_MUNDIAL_N3_BANK = [
  { pregunta:'¿Qué herramienta se usa para ubicar en orden cronológico los hitos de la historia universal?', correcta:'Una línea de tiempo', opts:['Un mapa de relieve','Un termómetro','Una balanza comercial'] },
  { pregunta:'¿Qué dos países se consolidaron como superpotencias tras la Segunda Guerra Mundial?', correcta:'Estados Unidos y la Unión Soviética', opts:['Francia y Alemania','China y Japón','Chile y Argentina'] },
  { pregunta:'¿Cómo se llama el período de rivalidad política y militar entre Estados Unidos y la Unión Soviética, sin llegar a un enfrentamiento militar directo entre ambos?', correcta:'La Guerra Fría', opts:['La Primera Guerra Mundial','La Guerra del Pacífico','La Revolución Industrial'] },
  { pregunta:'¿Qué efecto tuvo el desarrollo tecnológico del siglo XX sobre los transportes y las comunicaciones?', correcta:'Aumentó la interconexión entre distintas partes del mundo', opts:['Redujo por completo el comercio internacional','No tuvo ningún efecto real','Aisló a los países entre sí'] },
  { pregunta:'¿Qué es un bloque comercial entre países?', correcta:'Una agrupación de países que facilita el comercio entre ellos', opts:['Un tipo de guerra comercial','Una prohibición total de exportar','Un impuesto único mundial'] },
  { pregunta:'¿Cuál de estos es un problema que afecta a la humanidad a nivel global hoy en día?', correcta:'El deterioro medioambiental', opts:['El exceso de árboles en el planeta','La falta de tecnología en general','La ausencia total de comercio internacional'] },
  { pregunta:'En economía, ¿qué describe el concepto de "oferta y demanda"?', correcta:'La relación entre cuánto se produce y cuánto se quiere comprar, que influye en el precio', opts:['La cantidad de dinero que imprime un banco','El número de empleados de una empresa','El tipo de moneda que usa un país'] },
  { pregunta:'¿Qué caracteriza principalmente a una economía de mercado, en comparación con una economía centralmente planificada?', correcta:'Las decisiones de producción y precios se determinan principalmente por la oferta y la demanda', opts:['El Estado decide y planifica toda la producción','No existe ningún tipo de comercio','Los precios siempre son fijados por ley'] },
  { pregunta:'¿Qué concepto describe el dinero, las máquinas y los recursos usados para producir bienes y servicios?', correcta:'Capital', opts:['Consumo','Demanda','Soberanía'] },
];
export function genHistoriaEconomiaMundialEpjaN3Round(){
  const item = pick(SIGLO_XX_MUNDIAL_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_HISTORIA_ECONOMIA_N3,
  };
}

const RECURSO_TRABAJO_CHILE_N3 = 'Durante el siglo XX, el trabajo en Chile pasó por grandes transformaciones: la <b>industrialización</b> (crecimiento de fábricas y producción manufacturera), la <b>terciarización</b> (aumento del trabajo en servicios por sobre la agricultura o la industria), la creciente <b>inserción de las mujeres</b> en el mercado laboral, y el impacto de las <b>tecnologías modernas</b> sobre el empleo (automatización de tareas, nuevos tipos de trabajo). Hoy, la población económicamente activa de Chile se distribuye en distintas ramas de la producción (servicios, comercio, industria, agricultura, minería, entre otras). El <b>empleo formal</b> cuenta con contrato de trabajo, previsión social y cobertura de salud garantizadas por ley, mientras que el <b>empleo informal</b> carece de esas protecciones, lo que deja a quienes lo ejercen en una situación de mayor desprotección ante enfermedades, accidentes o la vejez.';
const TRABAJO_CHILE_N3_BANK = [
  { pregunta:'¿Qué significa la "industrialización" del trabajo en Chile durante el siglo XX?', correcta:'El crecimiento de fábricas y de la producción manufacturera', opts:['El fin completo de toda actividad agrícola','La eliminación de las ciudades','El aumento exclusivo del trabajo doméstico'] },
  { pregunta:'¿Qué significa la "terciarización" del trabajo?', correcta:'El aumento del empleo en el sector de servicios', opts:['El aumento exclusivo del trabajo agrícola','La eliminación del comercio','El fin del sector industrial'] },
  { pregunta:'¿Qué cambio importante ocurrió en el mercado laboral chileno respecto a la participación de las mujeres durante el siglo XX?', correcta:'Aumentó progresivamente su inserción en el mercado del trabajo', opts:['Disminuyó por completo','Se mantuvo exactamente igual todo el siglo','Quedó prohibida por ley'] },
  { pregunta:'¿Qué impacto han tenido las tecnologías modernas sobre el empleo?', correcta:'Han automatizado tareas y generado nuevos tipos de trabajo', opts:['No han tenido ningún impacto','Han eliminado por completo la necesidad de trabajar','Han vuelto obligatorio un solo tipo de oficio'] },
  { pregunta:'¿Qué garantiza un empleo formal, a diferencia de uno informal?', correcta:'Contrato de trabajo, previsión social y cobertura de salud', opts:['Un sueldo siempre más alto que el informal','La imposibilidad de perder el trabajo','El derecho a no pagar impuestos'] },
  { pregunta:'¿A qué riesgo está más expuesta una persona que trabaja de forma informal?', correcta:'Quedar sin protección ante enfermedades, accidentes o la vejez', opts:['Ganar siempre más dinero que en un trabajo formal','Tener garantizada una pensión más alta','No tener ningún riesgo adicional'] },
  { pregunta:'¿Qué es la población económicamente activa de un país?', correcta:'Las personas en edad de trabajar que están empleadas o buscando empleo', opts:['Solo los jubilados del país','Únicamente los estudiantes','Los niños menores de edad'] },
  { pregunta:'¿Cuál de estas es una de las principales ramas de la producción donde se distribuye la población económicamente activa de Chile?', correcta:'El comercio', opts:['La realeza','La nobleza','El clero'] },
  { pregunta:'¿Qué sistema de previsión social recibe un trabajador con empleo formal en Chile?', correcta:'Cotizaciones para su futura pensión de vejez', opts:['Ningún tipo de previsión social','Solo un bono único al jubilarse','Un descuento en el transporte público'] },
  { pregunta:'¿Qué cobertura recibe un trabajador con empleo formal ante una enfermedad o accidente laboral?', correcta:'Cobertura de salud garantizada por ley', opts:['Ninguna cobertura de salud','Solo atención dental','Un seguro de vida obligatorio para el empleador'] },
];
export function genTrabajoChileEpjaN3Round(){
  const item = pick(TRABAJO_CHILE_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_TRABAJO_CHILE_N3,
  };
}

const RECURSO_DEMOCRACIA_N3 = 'Los <b>derechos humanos</b> tienen distintas dimensiones: civiles (como la libertad de expresión), políticas (como el derecho a votar), económicas (como el derecho al trabajo) y sociales (como el derecho a la salud o la educación). La <b>democracia</b> es una organización política que busca promover y garantizar esos derechos, y en Chile existen estatutos que los protegen: la <b>Constitución</b>, los tratados internacionales ratificados por el país, y las leyes. A diferencia de un sistema democrático (con elecciones libres, separación de poderes y participación ciudadana), un <b>régimen dictatorial o totalitario</b> concentra el poder sin someterse a elecciones libres ni a un control real de otros poderes. La <b>soberanía</b> es la facultad de un Estado para gobernarse a sí mismo sin intervención externa, y en Chile se organiza mediante tres <b>poderes del Estado</b>: el Ejecutivo (gobierna y administra), el Legislativo (elabora las leyes) y el Judicial (aplica la justicia).';
const DERECHOS_HUMANOS_N3_BANK = [
  { pregunta:'¿A qué dimensión de los derechos humanos pertenece el derecho a votar en una elección?', correcta:'Dimensión política', opts:['Dimensión económica','Dimensión civil','Dimensión social'] },
  { pregunta:'¿A qué dimensión de los derechos humanos pertenece el derecho a la salud y la educación?', correcta:'Dimensión social', opts:['Dimensión política','Dimensión civil','Dimensión económica'] },
  { pregunta:'¿A qué dimensión de los derechos humanos pertenece la libertad de expresión?', correcta:'Dimensión civil', opts:['Dimensión económica','Dimensión política','Dimensión social'] },
  { pregunta:'¿Qué documento fundamental garantiza derechos y organiza el Estado en Chile?', correcta:'La Constitución', opts:['Un decreto municipal cualquiera','Un reglamento escolar','Un contrato privado'] },
];
const SISTEMAS_POLITICOS_N3_BANK = [
  { pregunta:'¿Qué caracteriza principalmente a un sistema democrático, a diferencia de uno dictatorial?', correcta:'Elecciones libres y separación de poderes', opts:['El poder concentrado en una sola persona sin elecciones','La ausencia total de leyes','La eliminación de todos los derechos civiles'] },
  { pregunta:'¿Qué caracteriza principalmente a un régimen dictatorial o totalitario?', correcta:'Concentra el poder sin someterse a elecciones libres ni control real de otros poderes', opts:['Garantiza elecciones libres cada cierto tiempo','Divide el poder en tres poderes independientes','Permite la libre organización de partidos políticos opositores'] },
  { pregunta:'¿Cuál de estos es un mecanismo típico para elegir autoridades en un sistema democrático?', correcta:'Elecciones periódicas con voto ciudadano', opts:['La herencia del cargo entre familiares','La designación por sorteo entre todos los ciudadanos','La antigüedad laboral del candidato'] },
];
const SOBERANIA_PODERES_N3_BANK = [
  { pregunta:'¿Qué es la soberanía de un Estado?', correcta:'La facultad de un Estado para gobernarse a sí mismo sin intervención externa', opts:['La cantidad de territorio que posee un país','El número de habitantes de un país','El idioma oficial de un país'] },
  { pregunta:'¿Qué poder del Estado se encarga de elaborar las leyes en Chile?', correcta:'El poder Legislativo', opts:['El poder Ejecutivo','El poder Judicial','Ninguno, las leyes las crea directamente el pueblo'] },
  { pregunta:'¿Qué poder del Estado se encarga de aplicar la justicia en Chile?', correcta:'El poder Judicial', opts:['El poder Ejecutivo','El poder Legislativo','El poder Municipal'] },
  { pregunta:'¿Qué poder del Estado se encarga de gobernar y administrar el país en Chile?', correcta:'El poder Ejecutivo', opts:['El poder Legislativo','El poder Judicial','El poder Constituyente'] },
];
export function genDemocraciaDerechosEpjaN3Round(){
  const roll = Math.random();
  const item = roll<0.34 ? pick(DERECHOS_HUMANOS_N3_BANK) : (roll<0.67 ? pick(SISTEMAS_POLITICOS_N3_BANK) : pick(SOBERANIA_PODERES_N3_BANK));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_DEMOCRACIA_N3,
  };
}

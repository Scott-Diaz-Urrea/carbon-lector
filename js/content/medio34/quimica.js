import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan Diferenciado Científico: Química ----------------
   Fuente real: Decreto 614/2013, Plan de Formación Diferenciada Humanista-Científico,
   área Ciencias, asignatura Química (curriculumnacional.cl). Sus 7 OA son
   compartidos entre 3° y 4° medio (código "CN-QUIM-3y4-OAC-01" a "07", verificado
   en ambas páginas) — un solo MODULES/POS sin sufijo de año.

   OAC07 (valorar la integración de la química con otras ciencias) es
   actitudinal, sin una única respuesta correcta — queda fuera. Los otros 6 sí
   tienen contenido conceptual verificable: OAC01 (nanoquímica y polímeros),
   OAC02 (ácido-base, redox, polimerización), OAC03 (termodinámica y cinética),
   OAC04 (química del cambio climático: ciclos y equilibrios — ángulo distinto
   al de Física en este mismo Plan Diferenciado, que aborda el mismo fenómeno
   desde el balance energético/efecto invernadero, no desde los ciclos
   biogeoquímicos), OAC05 (contaminantes químicos), OAC06 (tecnologías químicas
   para mitigar el cambio climático). */

export const QUIMICA_MODULES = [
  {id:'nanoquimicapolimerospd', label:'Nanoquímica y Polímeros', open:true, key:'nanoquimicapolimerospd'},
  {id:'acidobaseredoxpd', label:'Ácido-Base, Redox y Polimerización', open:true, key:'acidobaseredoxpd'},
  {id:'termodinamicacineticapd', label:'Termodinámica y Cinética Química', open:true, key:'termodinamicacineticapd'},
  {id:'quimicaclimapd', label:'Química del Cambio Climático: Ciclos y Equilibrios', open:true, key:'quimicaclimapd'},
  {id:'contaminantesquimicospd', label:'Contaminantes Químicos y sus Efectos', open:true, key:'contaminantesquimicospd'},
  {id:'tecnologiasquimicasclimapd', label:'Tecnologías Químicas para el Clima', open:true, key:'tecnologiasquimicasclimapd'},
];
export const QUIMICA_POS = [ {x:26,y:92},{x:70,y:74},{x:26,y:56},{x:70,y:38},{x:26,y:20},{x:70,y:4} ];

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

/* ---------------- Nanoquímica y Polímeros (OAC-01) ---------------- */
const RECURSO_NANOQUIMICA_PD = 'La <b>nanotecnología</b> diseña y manipula materiales a escala nanométrica, dando origen a <b>nanopartículas</b> con propiedades distintas a las del mismo material a mayor escala — con aplicaciones que van desde la agricultura hasta la <b>nanomedicina</b>. En paralelo, los <b>polímeros</b> —moléculas grandes formadas por la repetición de monómeros mediante <b>polimerización</b>— están presentes en incontables productos cotidianos; los <b>polímeros biodegradables</b> buscan reducir el fuerte <b>impacto ambiental</b> que tienen los plásticos convencionales cuando se desechan.';
const NANOQUIMICA_BANK_PD = [
  {termino:'Nanotecnología', definicion:'El área que diseña y manipula materiales a escala nanométrica, mil millones de veces más pequeña que un metro.'},
  {termino:'Polímero', definicion:'Una molécula grande formada por la repetición de unidades más pequeñas llamadas monómeros.'},
  {termino:'Nanopartícula', definicion:'Una partícula de tamaño extremadamente pequeño, entre 1 y 100 nanómetros, con propiedades distintas a las del mismo material a mayor escala.'},
  {termino:'Polímero biodegradable', definicion:'Un polímero que puede ser descompuesto por microorganismos, reduciendo su impacto ambiental respecto a los plásticos convencionales.'},
  {termino:'Nanomaterial en medicina', definicion:'Un material a escala nanométrica diseñado para diagnosticar o tratar enfermedades de forma más precisa y dirigida.'},
  {termino:'Polimerización', definicion:'La reacción química mediante la cual los monómeros se unen para formar un polímero.'},
  {termino:'Aplicación agrícola de la nanotecnología', definicion:'El uso de nanomateriales para mejorar la eficiencia de fertilizantes, pesticidas o el monitoreo de cultivos.'},
  {termino:'Impacto ambiental de los polímeros', definicion:'Los efectos, generalmente negativos, que la producción y desecho de plásticos tienen sobre los ecosistemas.'},
];
export function genNanoquimicaPolimerosPDRound(){ return genDefRound(NANOQUIMICA_BANK_PD, RECURSO_NANOQUIMICA_PD); }

/* ---------------- Ácido-Base, Redox y Polimerización (OAC-02) ---------------- */
const RECURSO_ACIDOBASEREDOX_PD = 'La <b>escala de pH</b> mide qué tan ácida o básica es una solución. En una <b>reacción ácido-base</b>, un ácido y una base reaccionan; un <b>indicador de pH</b> permite estimar visualmente esa acidez. En las reacciones de óxido-reducción, una sustancia sufre <b>oxidación</b> (pierde electrones) mientras otra sufre <b>reducción</b> (gana electrones) — el <b>agente oxidante</b> es quien provoca esa oxidación. La <b>corrosión</b> de un metal es un ejemplo cotidiano de oxidación, y la <b>despolimerización</b> —el proceso inverso a formar un polímero— descompone un polímero de vuelta en sus monómeros.';
const ACIDOBASEREDOX_BANK_PD = [
  {termino:'Escala de pH', definicion:'Una escala que mide qué tan ácida o básica es una solución, entre 0 (muy ácido) y 14 (muy básico), siendo 7 neutro.'},
  {termino:'Reacción de oxidación', definicion:'Una reacción química en la que una sustancia pierde electrones.'},
  {termino:'Reacción de reducción', definicion:'Una reacción química en la que una sustancia gana electrones.'},
  {termino:'Reacción ácido-base', definicion:'Una reacción en la que un ácido y una base reaccionan, generalmente formando agua y una sal.'},
  {termino:'Agente oxidante', definicion:'Una sustancia que provoca la oxidación de otra sustancia, ganando electrones en el proceso.'},
  {termino:'Despolimerización', definicion:'El proceso mediante el cual un polímero se descompone en sus monómeros originales.'},
  {termino:'Indicador de pH', definicion:'Una sustancia que cambia de color según el pH del medio en que se encuentra, usada para estimar la acidez de una solución.'},
  {termino:'Corrosión', definicion:'Un proceso de oxidación que deteriora un material, generalmente un metal, al reaccionar con el ambiente.'},
];
export function genAcidoBaseRedoxPDRound(){ return genDefRound(ACIDOBASEREDOX_BANK_PD, RECURSO_ACIDOBASEREDOX_PD); }

/* ---------------- Termodinámica y Cinética Química (OAC-03) ---------------- */
const RECURSO_TERMODINAMICA_CINETICA_PD = 'Una reacción <b>exotérmica</b> libera calor al entorno, mientras que una <b>endotérmica</b> lo absorbe — ambas relacionadas con la <b>entalpía</b> del sistema. La <b>velocidad de reacción</b> depende de factores como la temperatura, la concentración y la superficie de contacto; un <b>catalizador</b> la acelera sin consumirse, reduciendo la <b>energía de activación</b> necesaria para que la reacción comience. Cuando la reacción directa y la inversa ocurren a la misma velocidad, el sistema alcanza un <b>equilibrio químico</b>, donde las concentraciones se mantienen estables.';
const TERMODINAMICA_CINETICA_BANK_PD = [
  {termino:'Reacción exotérmica', definicion:'Una reacción química que libera energía en forma de calor hacia el entorno.'},
  {termino:'Reacción endotérmica', definicion:'Una reacción química que absorbe energía en forma de calor desde el entorno.'},
  {termino:'Velocidad de reacción', definicion:'La rapidez con la que los reactivos se transforman en productos en una reacción química.'},
  {termino:'Catalizador', definicion:'Una sustancia que aumenta la velocidad de una reacción química sin consumirse en el proceso.'},
  {termino:'Energía de activación', definicion:'La energía mínima necesaria para que una reacción química pueda comenzar.'},
  {termino:'Equilibrio químico', definicion:'El estado en que la velocidad de la reacción directa y la reacción inversa son iguales, y las concentraciones se mantienen constantes.'},
  {termino:'Entalpía', definicion:'Una medida del contenido de energía calórica de un sistema a presión constante.'},
  {termino:'Factores que afectan la velocidad de reacción', definicion:'Condiciones como la temperatura, la concentración y la superficie de contacto, que pueden acelerar o frenar una reacción.'},
];
export function genTermodinamicaCineticaPDRound(){ return genDefRound(TERMODINAMICA_CINETICA_BANK_PD, RECURSO_TERMODINAMICA_CINETICA_PD); }

/* ---------------- Química del Cambio Climático: Ciclos y Equilibrios (OAC-04) ---------------- */
const RECURSO_QUIMICA_CLIMA_PD = 'El <b>ciclo del carbono</b> y el <b>ciclo del nitrógeno</b> describen cómo estos elementos circulan entre la atmósfera, los océanos y los seres vivos. El exceso de <b>gases de efecto invernadero</b> altera este equilibrio: buena parte del CO2 adicional termina disuelto en el mar —su <b>solubilidad</b> en agua aumenta con la presión y baja con la temperatura— desplazando el <b>equilibrio químico oceánico</b> entre sus distintas formas de carbono y provocando <b>acidificación oceánica</b>. Esa acidificación dificulta la <b>calcificación marina</b>, el proceso con que corales y moluscos construyen sus estructuras. Los <b>sumideros de carbono</b>, como los bosques y el océano, absorben parte de ese exceso.';
const QUIMICA_CLIMA_BANK_PD = [
  {termino:'Ciclo del carbono', definicion:'El proceso mediante el cual el carbono circula entre la atmósfera, los océanos, los seres vivos y las rocas.'},
  {termino:'Acidificación oceánica', definicion:'La disminución del pH del océano debido a la absorción de dióxido de carbono atmosférico, que reacciona con el agua formando ácido carbónico.'},
  {termino:'Ciclo del nitrógeno', definicion:'El proceso mediante el cual el nitrógeno circula entre la atmósfera, el suelo y los seres vivos, siendo esencial para la vida.'},
  {termino:'Equilibrio químico oceánico', definicion:'El balance entre las distintas formas químicas del carbono disuelto en el agua de mar: dióxido de carbono, bicarbonato y carbonato.'},
  {termino:'Gas de efecto invernadero', definicion:'Un gas atmosférico, como el dióxido de carbono o el metano, que retiene calor y contribuye al calentamiento global.'},
  {termino:'Sumidero de carbono', definicion:'Un sistema natural, como un bosque o un océano, que absorbe más carbono del que libera.'},
  {termino:'Solubilidad del CO2 en el agua', definicion:'La capacidad del dióxido de carbono de disolverse en el agua, un proceso que aumenta con la presión y disminuye con la temperatura.'},
  {termino:'Calcificación marina', definicion:'El proceso mediante el cual organismos marinos, como corales y moluscos, forman estructuras de carbonato de calcio, afectado por la acidificación del océano.'},
];
export function genQuimicaClimaPDRound(){ return genDefRound(QUIMICA_CLIMA_BANK_PD, RECURSO_QUIMICA_CLIMA_PD); }

/* ---------------- Contaminantes Químicos y sus Efectos (OAC-05) ---------------- */
const RECURSO_CONTAMINANTES_QUIMICOS_PD = 'Un <b>contaminante persistente</b> no se degrada fácilmente y puede acumularse en el ambiente por mucho tiempo. Cuando ingresa al organismo —por inhalación, ingestión o contacto, según su <b>vía de exposición</b>— puede sufrir <b>bioacumulación</b>, y al ascender por la cadena alimentaria, <b>biomagnificación</b>, aumentando su concentración en cada nivel. Ejemplos comunes incluyen <b>metales pesados</b> como el plomo o el mercurio, <b>plaguicidas</b> agrícolas, y sustancias liberadas por un <b>relave minero</b> u otro <b>contaminante de origen industrial</b>.';
const CONTAMINANTES_QUIMICOS_BANK_PD = [
  {termino:'Contaminante persistente', definicion:'Una sustancia química que no se degrada fácilmente en el ambiente y puede acumularse durante mucho tiempo.'},
  {termino:'Bioacumulación', definicion:'El proceso mediante el cual una sustancia tóxica se acumula progresivamente en el organismo de un ser vivo.'},
  {termino:'Metal pesado', definicion:'Un elemento metálico, como el plomo o el mercurio, que puede ser tóxico para los organismos incluso en bajas concentraciones.'},
  {termino:'Plaguicida', definicion:'Una sustancia química utilizada para eliminar plagas en la agricultura, que puede tener efectos no deseados sobre otros organismos.'},
  {termino:'Relave minero', definicion:'El material de desecho que queda después de extraer los minerales de valor de una roca, y que puede contener sustancias contaminantes.'},
  {termino:'Vía de exposición a un contaminante', definicion:'La forma en que una sustancia tóxica ingresa al cuerpo, como la inhalación, la ingestión o el contacto con la piel.'},
  {termino:'Biomagnificación', definicion:'El aumento en la concentración de una sustancia tóxica a medida que se asciende en la cadena alimentaria.'},
  {termino:'Contaminante de origen industrial', definicion:'Una sustancia química liberada al ambiente como resultado de procesos productivos, como la minería o la manufactura.'},
];
export function genContaminantesQuimicosPDRound(){ return genDefRound(CONTAMINANTES_QUIMICOS_BANK_PD, RECURSO_CONTAMINANTES_QUIMICOS_PD); }

/* ---------------- Tecnologías Químicas para el Clima (OAC-06) ---------------- */
const RECURSO_TECNOLOGIAS_QUIMICAS_CLIMA_PD = 'La química también ofrece soluciones tecnológicas frente al cambio climático. La <b>captura y almacenamiento de carbono</b> retiene el CO2 emitido por una industria antes de que llegue a la atmósfera; el <b>hidrógeno verde</b> y los <b>biocombustibles</b> ofrecen alternativas a los combustibles fósiles; y las <b>baterías de ion-litio</b> son clave para la electromovilidad. Principios de <b>química verde</b> buscan reducir sustancias peligrosas desde el diseño de un proceso, mientras que el <b>reciclaje químico</b> y la <b>fotocatálisis ambiental</b> ayudan a descomponer materiales de desecho y contaminantes ya existentes.';
const TECNOLOGIAS_QUIMICAS_CLIMA_BANK_PD = [
  {termino:'Captura y almacenamiento de carbono', definicion:'Un conjunto de tecnologías que capturan el dióxido de carbono emitido por una industria y lo almacenan para evitar que llegue a la atmósfera.'},
  {termino:'Hidrógeno verde', definicion:'Hidrógeno producido usando energía renovable, sin emitir gases de efecto invernadero en su fabricación.'},
  {termino:'Química verde', definicion:'Un enfoque de la química que busca diseñar procesos y productos que reduzcan o eliminen el uso y generación de sustancias peligrosas.'},
  {termino:'Batería de ion-litio', definicion:'Un tipo de batería recargable, clave para la electromovilidad, que almacena energía mediante el movimiento de iones de litio.'},
  {termino:'Biocombustible', definicion:'Un combustible producido a partir de materia orgánica, considerado una alternativa más sostenible a los combustibles fósiles.'},
  {termino:'Reciclaje químico', definicion:'Un proceso que descompone materiales de desecho, como plásticos, en sus componentes químicos básicos para producir nuevos materiales.'},
  {termino:'Fotocatálisis ambiental', definicion:'El uso de materiales que, activados por la luz, aceleran reacciones químicas que degradan contaminantes.'},
  {termino:'Restauración química de suelos', definicion:'El conjunto de técnicas químicas usadas para eliminar o neutralizar contaminantes presentes en un suelo degradado.'},
];
export function genTecnologiasQuimicasClimaPDRound(){ return genDefRound(TECNOLOGIAS_QUIMICAS_CLIMA_BANK_PD, RECURSO_TECNOLOGIAS_QUIMICAS_CLIMA_PD); }

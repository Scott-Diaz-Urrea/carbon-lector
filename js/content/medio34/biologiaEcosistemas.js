import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan Diferenciado Científico: Biología de los Ecosistemas ----------------
   Fuente real: Decreto 614/2013, Plan de Formación Diferenciada Humanista-Científico,
   área Ciencias, asignatura Biología de los Ecosistemas (curriculumnacional.cl).
   Igual que Biología Celular y Molecular, sus 5 OA son compartidos entre 3° y 4°
   medio (código "CN-BECO-3y4-OAC-01" a "05", verificado en ambas páginas) — un
   solo MODULES/POS sin sufijo de año.

   OAC05 (valorar la integración de conocimientos de la biología con otras
   ciencias) es actitudinal/de juicio de valor, sin una única respuesta correcta
   — queda fuera. Los otros 4 OA tienen contenido conceptual verificable: OAC01
   (biodiversidad, evolución, intervención humana), OAC02 (servicios
   ecosistémicos y dinámica de poblaciones), OAC03 (cambio climático y
   resiliencia de ecosistemas), OAC04 (ciencia y tecnología frente al cambio
   climático). Mismo formato `genDefRound()` ya usado en el resto del Plan
   Diferenciado. */

export const BIOLOGIA_ECOSISTEMAS_MODULES = [
  {id:'biodiversidadevolucionpd', label:'Biodiversidad, Evolución e Intervención Humana', open:true, key:'biodiversidadevolucionpd'},
  {id:'serviciosecosistemicospd', label:'Servicios Ecosistémicos y Dinámica de Poblaciones', open:true, key:'serviciosecosistemicospd'},
  {id:'resilienciaclimaticapd', label:'Cambio Climático y Resiliencia de Ecosistemas', open:true, key:'resilienciaclimaticapd'},
  {id:'tecnologiaclimapd', label:'Ciencia y Tecnología frente al Cambio Climático', open:true, key:'tecnologiaclimapd'},
];
export const BIOLOGIA_ECOSISTEMAS_POS = [ {x:26,y:88},{x:70,y:64},{x:26,y:38},{x:70,y:12} ];

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

/* ---------------- Biodiversidad, Evolución e Intervención Humana (OAC-01) ---------------- */
const RECURSO_BIODIVERSIDAD_PD = 'La <b>biodiversidad</b> actual es el resultado de millones de años de <b>selección natural</b>, evidenciada en el registro <b>fósil</b>, combinada con procesos como la <b>deriva genética</b> en poblaciones pequeñas. Hoy, la actividad humana también moldea la biodiversidad: la <b>fragmentación del hábitat</b> divide ecosistemas continuos en parches aislados, las <b>especies invasoras</b> desplazan a las especies nativas, y ambos procesos pueden acelerar la <b>extinción</b> de especies —incluidas las <b>endémicas</b>, que no existen en ningún otro lugar del planeta.';
const BIODIVERSIDAD_BANK_PD = [
  {termino:'Biodiversidad', definicion:'La variedad de formas de vida presentes en un ecosistema, una región o el planeta completo.'},
  {termino:'Selección natural', definicion:'El mecanismo evolutivo por el cual los individuos mejor adaptados a su ambiente tienen más probabilidad de sobrevivir y reproducirse.'},
  {termino:'Especie endémica', definicion:'Una especie que habita exclusivamente en una zona geográfica determinada y no se encuentra de forma natural en ningún otro lugar.'},
  {termino:'Extinción', definicion:'La desaparición completa de una especie, ya sea por causas naturales o por la intervención humana.'},
  {termino:'Especie invasora', definicion:'Una especie introducida en un ecosistema donde no es nativa, y que puede desplazar a las especies locales.'},
  {termino:'Fragmentación del hábitat', definicion:'La división de un hábitat natural continuo en parches aislados, generalmente por actividad humana.'},
  {termino:'Evidencia fósil', definicion:'Los restos o huellas de organismos del pasado que permiten reconstruir la historia evolutiva de la vida.'},
  {termino:'Deriva genética', definicion:'El cambio al azar en la frecuencia de los genes de una población, especialmente relevante en poblaciones pequeñas.'},
];
export function genBiodiversidadEvolucionPDRound(){ return genDefRound(BIODIVERSIDAD_BANK_PD, RECURSO_BIODIVERSIDAD_PD); }

/* ---------------- Servicios Ecosistémicos y Dinámica de Poblaciones (OAC-02) ---------------- */
const RECURSO_SERVICIOS_ECOSISTEMICOS_PD = 'Los ecosistemas entregan <b>servicios ecosistémicos</b> que sostienen el bienestar humano, como la <b>polinización</b> de cultivos o la regulación del clima. Detrás de estos servicios hay procesos biológicos medibles: el <b>flujo de energía</b> a través de la cadena alimentaria, el <b>ciclo de la materia</b> entre seres vivos y ambiente, y la <b>bioenergética</b> que explica cómo los organismos obtienen y usan esa energía. La <b>dinámica de poblaciones</b> —incluyendo su <b>capacidad de carga</b> y relaciones como la <b>depredación</b>— determina cuánta vida puede sostener un ecosistema de forma estable.';
const SERVICIOS_ECOSISTEMICOS_BANK_PD = [
  {termino:'Servicio ecosistémico', definicion:'Un beneficio que las personas obtienen de los ecosistemas, como el agua limpia, la polinización o la regulación del clima.'},
  {termino:'Capacidad de carga', definicion:'El número máximo de individuos de una población que un ecosistema puede sostener de forma sustentable.'},
  {termino:'Flujo de energía', definicion:'El paso de energía desde los productores hacia los consumidores a través de la cadena alimentaria, perdiéndose parte de ella en cada nivel.'},
  {termino:'Ciclo de la materia', definicion:'El proceso mediante el cual los elementos químicos, como el carbono o el nitrógeno, circulan entre los seres vivos y el ambiente.'},
  {termino:'Dinámica de poblaciones', definicion:'El estudio de cómo cambia en el tiempo el tamaño y la composición de una población.'},
  {termino:'Polinización', definicion:'El proceso mediante el cual el polen se transfiere entre flores, permitiendo la reproducción de muchas plantas.'},
  {termino:'Bioenergética', definicion:'El estudio de cómo los seres vivos obtienen, transforman y utilizan la energía.'},
  {termino:'Depredación', definicion:'La interacción en la que un organismo (depredador) captura y se alimenta de otro organismo (presa).'},
];
export function genServiciosEcosistemicosPDRound(){ return genDefRound(SERVICIOS_ECOSISTEMICOS_BANK_PD, RECURSO_SERVICIOS_ECOSISTEMICOS_PD); }

/* ---------------- Cambio Climático y Resiliencia de Ecosistemas (OAC-03) ---------------- */
const RECURSO_RESILIENCIA_CLIMATICA_PD = 'La <b>resiliencia</b> de un ecosistema es su capacidad de recuperarse tras una perturbación, pero el cambio climático está poniendo a prueba esa capacidad en todo el planeta: el aumento de temperatura provoca el <b>blanqueamiento de corales</b>, la <b>acidificación oceánica</b> altera la química del mar, y muchas especies enfrentan <b>migración</b> hacia zonas más favorables o, en climas ya frágiles, un avance de la <b>desertificación</b>. Cuando estos cambios superan un <b>punto de inflexión ecológico</b>, el ecosistema puede transformarse de forma abrupta y difícil de revertir — la <b>vulnerabilidad</b> de cada ecosistema depende de qué tan cerca esté de ese límite.';
const RESILIENCIA_CLIMATICA_BANK_PD = [
  {termino:'Resiliencia de un ecosistema', definicion:'La capacidad de un ecosistema de recuperarse después de sufrir una perturbación o un cambio.'},
  {termino:'Productividad biológica', definicion:'La cantidad de materia orgánica que un ecosistema produce en un período de tiempo determinado.'},
  {termino:'Blanqueamiento de corales', definicion:'La pérdida de las algas que dan color y nutrientes a los corales, generalmente causada por el aumento de la temperatura del agua.'},
  {termino:'Migración por cambio climático', definicion:'El desplazamiento de especies hacia zonas con condiciones climáticas más favorables para su supervivencia.'},
  {termino:'Punto de inflexión ecológico', definicion:'Un umbral a partir del cual un ecosistema cambia de forma abrupta y difícilmente reversible.'},
  {termino:'Desertificación', definicion:'El proceso mediante el cual un terreno fértil se convierte progresivamente en desierto, muchas veces por sequía o mal uso del suelo.'},
  {termino:'Acidificación oceánica', definicion:'La disminución del pH del océano, causada principalmente por la absorción de dióxido de carbono de la atmósfera.'},
  {termino:'Vulnerabilidad ecosistémica', definicion:'El grado en que un ecosistema puede verse afectado negativamente por una amenaza como el cambio climático.'},
];
export function genResilienciaClimaticaPDRound(){ return genDefRound(RESILIENCIA_CLIMATICA_BANK_PD, RECURSO_RESILIENCIA_CLIMATICA_PD); }

/* ---------------- Ciencia y Tecnología frente al Cambio Climático (OAC-04) ---------------- */
const RECURSO_TECNOLOGIA_CLIMA_PD = 'La sociedad responde al cambio climático de dos formas complementarias: la <b>mitigación</b> busca reducir las emisiones de gases de efecto invernadero (por ejemplo, mediante <b>energía renovable</b> o <b>captura de carbono</b>), mientras que la <b>adaptación</b> ajusta la forma de vivir a los efectos ya presentes. La <b>restauración ecológica</b> recupera ecosistemas degradados, las <b>áreas silvestres protegidas</b> conservan la biodiversidad, y el <b>monitoreo satelital</b> permite observar estos cambios a gran escala — todo dentro de una tendencia hacia una <b>economía baja en carbono</b>.';
const TECNOLOGIA_CLIMA_BANK_PD = [
  {termino:'Mitigación del cambio climático', definicion:'El conjunto de acciones destinadas a reducir o evitar las emisiones de gases de efecto invernadero.'},
  {termino:'Adaptación al cambio climático', definicion:'El conjunto de ajustes que permiten a las personas y los ecosistemas convivir con los efectos ya presentes del cambio climático.'},
  {termino:'Energía renovable', definicion:'Una fuente de energía que se obtiene de recursos naturales que se regeneran, como el sol, el viento o el agua.'},
  {termino:'Captura de carbono', definicion:'Una tecnología que permite retener el dióxido de carbono para evitar que se libere a la atmósfera.'},
  {termino:'Restauración ecológica', definicion:'El conjunto de acciones destinadas a recuperar un ecosistema que ha sido degradado o destruido.'},
  {termino:'Monitoreo satelital ambiental', definicion:'El uso de satélites para observar y medir cambios en los ecosistemas terrestres y marinos a gran escala.'},
  {termino:'Área silvestre protegida', definicion:'Un territorio delimitado legalmente para conservar su biodiversidad y sus procesos ecológicos.'},
  {termino:'Economía baja en carbono', definicion:'Un modelo económico que busca reducir al mínimo las emisiones de gases de efecto invernadero asociadas a la producción y el consumo.'},
];
export function genTecnologiaClimaPDRound(){ return genDefRound(TECNOLOGIA_CLIMA_BANK_PD, RECURSO_TECNOLOGIA_CLIMA_PD); }

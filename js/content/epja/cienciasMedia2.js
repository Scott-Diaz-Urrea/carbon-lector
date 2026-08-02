import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Media: Ciencias Naturales ----------------
   Nivel 2 Media equivale a 3°-4° medio (ver content/grades.js). Fuente real: "Temario Segundo
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er y 2do semestre). El temario NM2 se organiza en 3 áreas, más densas que NM1: Ciencias
   Biológicas (homeostasis vía los sistemas nervioso/endocrino/renal, sistema inmunológico,
   enfermedades que alteran la homeostasis, información genética y reproducción celular:
   cromosoma/gen/ADN/mitosis/meiosis), Ciencias Físicas (fluidos: presión/presión
   hidrostática/empuje/presión atmosférica; electricidad: carga/campo/corriente/potencial/
   resistencia/circuitos y componentes como conductores/aisladores/fusibles/interruptores;
   magnetismo: imanes/campo/inducción), y Ciencias Químicas (teorías de evolución de las
   especies, modelos atómicos y partículas subatómicas, tipos de enlaces químicos, fenómenos
   radiactivos, tabla periódica, moléculas orgánicas/grupos funcionales/polímeros). 7 módulos
   cubren las 3 áreas completas sin dejar ningún eje fuera: Homeostasis y Sistemas del Cuerpo,
   Sistema Inmune y Genética (Biológicas); Fluidos y Presión, Electricidad y Magnetismo
   (Físicas); Evolución y Modelos Atómicos, Enlaces Químicos y Radiactividad, Química Orgánica
   y Polímeros (Químicas — el temario oficial agrupa la evolución de las especies bajo el
   mismo encabezado "Ciencias Químicas" que los modelos atómicos, así que se preservó esa
   agrupación tal como aparece en el documento fuente). Contextos de vida adulta. */

export const CIENCIAS_EPJA_M2_MODULES = [
  {id:'homeostasisSistemasEpjaM2', label:'Homeostasis y Sistemas del Cuerpo', open:true, key:'homeostasisSistemasEpjaM2'},
  {id:'sistemaInmuneGeneticaEpjaM2', label:'Sistema Inmune y Genética', open:true, key:'sistemaInmuneGeneticaEpjaM2'},
  {id:'fluidosPresionEpjaM2', label:'Fluidos y Presión', open:true, key:'fluidosPresionEpjaM2'},
  {id:'electricidadMagnetismoEpjaM2', label:'Electricidad y Magnetismo', open:true, key:'electricidadMagnetismoEpjaM2'},
  {id:'evolucionAtomoEpjaM2', label:'Evolución y Modelos Atómicos', open:true, key:'evolucionAtomoEpjaM2'},
  {id:'enlacesRadiactividadEpjaM2', label:'Enlaces Químicos y Radiactividad', open:true, key:'enlacesRadiactividadEpjaM2'},
  {id:'organicaPolimerosEpjaM2', label:'Química Orgánica y Polímeros', open:true, key:'organicaPolimerosEpjaM2'},
];
export const CIENCIAS_EPJA_M2_POS = [{x:22,y:94},{x:68,y:81},{x:24,y:66},{x:70,y:52},{x:24,y:37},{x:70,y:22},{x:24,y:6}];

/* ---------------- Homeostasis y Sistemas del Cuerpo ---------------- */
const RECURSO_HOMEOSTASIS_M2 = 'La <b>homeostasis</b> es la capacidad del cuerpo de mantener un equilibrio interno estable (temperatura, niveles de glucosa, presión, etc.), y depende del trabajo coordinado de tres sistemas principales: el <b>sistema nervioso</b> (controla y coordina el cuerpo mediante señales eléctricas), el <b>sistema endocrino</b> (regula funciones mediante hormonas liberadas a la sangre), y el <b>sistema renal</b> (filtra la sangre y regula el agua y las sales del cuerpo). Cuando alguno de estos sistemas falla, se producen enfermedades que alteran ese equilibrio, como la diabetes (endocrino) o la insuficiencia renal (renal).';
const HOMEOSTASIS_M2_BANK = [
  { pregunta:'¿Qué sistema del cuerpo coordina las funciones mediante señales eléctricas transmitidas por neuronas?', correcta:'El sistema nervioso', opts:['El sistema endocrino','El sistema renal','El sistema inmunológico'] },
  { pregunta:'¿Qué sistema del cuerpo regula funciones mediante hormonas liberadas directamente a la sangre?', correcta:'El sistema endocrino', opts:['El sistema nervioso','El sistema renal','El sistema muscular'] },
  { pregunta:'¿Qué sistema del cuerpo filtra la sangre y regula el equilibrio de agua y sales?', correcta:'El sistema renal', opts:['El sistema nervioso','El sistema endocrino','El sistema digestivo'] },
  { pregunta:'¿Cómo se llama la capacidad del cuerpo de mantener un equilibrio interno estable?', correcta:'Homeostasis', opts:['Metabolismo','Fotosíntesis','Mitosis'] },
  { pregunta:'La diabetes es una enfermedad que altera la homeostasis relacionada principalmente con qué sistema?', correcta:'El sistema endocrino, por una alteración en la producción o uso de insulina', opts:['El sistema nervioso, por una alteración en las neuronas','El sistema renal, sin relación con las hormonas','Ninguno de los sistemas del cuerpo'] },
  { pregunta:'La insuficiencia renal es una enfermedad que afecta principalmente a qué sistema?', correcta:'El sistema renal', opts:['El sistema nervioso','El sistema endocrino','El sistema inmunológico'] },
  { pregunta:'¿Qué glándula del sistema endocrino regula gran parte de las demás glándulas hormonales del cuerpo?', correcta:'La hipófisis (glándula pituitaria)', opts:['El riñón','El hígado','El estómago'] },
  { pregunta:'Un trabajador que sufre un golpe fuerte en la cabeza y pierde la coordinación de sus movimientos, ¿qué sistema se vio afectado?', correcta:'El sistema nervioso', opts:['El sistema renal','El sistema endocrino','El sistema respiratorio'] },
  { pregunta:'¿Qué órgano del sistema renal es el encargado principal de filtrar la sangre?', correcta:'El riñón', opts:['El hígado','El páncreas','El pulmón'] },
  { pregunta:'Cuando el cuerpo mantiene una temperatura estable de 37°C a pesar del frío o el calor externo, ¿qué proceso se está manifestando?', correcta:'La homeostasis', opts:['La meiosis','La fotosíntesis','La evolución'] },
];
export function genHomeostasisSistemasEpjaM2Round(){
  const item = pick(HOMEOSTASIS_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_HOMEOSTASIS_M2,
  };
}

/* ---------------- Sistema Inmune y Genética ---------------- */
const RECURSO_SISTEMA_INMUNE_GENETICA_M2 = 'El <b>sistema inmunológico</b> defiende al cuerpo de agentes externos (virus, bacterias) mediante barreras y células especializadas; cuando falla, aparecen enfermedades infectocontagiosas o autoinmunes. La <b>información genética</b> se almacena en el <b>ADN</b>, organizado en estructuras llamadas <b>cromosomas</b>, y cada segmento de ADN que codifica una característica se llama <b>gen</b>. La <b>mitosis</b> es la división celular que produce dos células idénticas (crecimiento y reparación), mientras que la <b>meiosis</b> produce células reproductivas (óvulos y espermatozoides) con la mitad de la información genética.';
const SISTEMA_INMUNE_GENETICA_M2_BANK = [
  { pregunta:'¿Qué sistema del cuerpo defiende al organismo de virus y bacterias?', correcta:'El sistema inmunológico', opts:['El sistema renal','El sistema endocrino','El sistema digestivo'] },
  { pregunta:'¿Dónde se almacena la información genética de una célula?', correcta:'En el ADN', opts:['En el citoplasma únicamente','En la membrana celular','En las hormonas'] },
  { pregunta:'¿Cómo se llama la estructura que organiza el ADN dentro del núcleo celular?', correcta:'Cromosoma', opts:['Gen','Mitocondria','Ribosoma'] },
  { pregunta:'¿Cómo se llama el segmento de ADN que codifica una característica hereditaria específica?', correcta:'Gen', opts:['Cromosoma','Célula','Enzima'] },
  { pregunta:'¿Qué tipo de división celular produce dos células idénticas, usada para el crecimiento y la reparación de tejidos?', correcta:'Mitosis', opts:['Meiosis','Fotosíntesis','Homeostasis'] },
  { pregunta:'¿Qué tipo de división celular produce las células reproductivas (óvulos y espermatozoides) con la mitad de la información genética?', correcta:'Meiosis', opts:['Mitosis','Metabolismo','Homeostasis'] },
  { pregunta:'Una enfermedad en la que el sistema inmunológico ataca por error a las propias células del cuerpo se llama:', correcta:'Enfermedad autoinmune', opts:['Enfermedad infectocontagiosa','Enfermedad genética hereditaria','Enfermedad endocrina'] },
  { pregunta:'Un resfrío común, causado por un virus que se transmite de persona a persona, es un ejemplo de:', correcta:'Enfermedad infectocontagiosa', opts:['Enfermedad autoinmune','Enfermedad hereditaria pura','Enfermedad endocrina'] },
  { pregunta:'Si un padre transmite a su hijo un gen que causa una enfermedad, ¿qué tipo de enfermedad describe mejor esta situación?', correcta:'Enfermedad genética hereditaria', opts:['Enfermedad infectocontagiosa','Enfermedad autoinmune adquirida','Enfermedad endocrina adquirida'] },
  { pregunta:'¿Cuántas células resultan de un proceso de mitosis a partir de una célula original?', correcta:'Dos células idénticas', opts:['Cuatro células distintas','Una sola célula','Ocho células idénticas'] },
];
export function genSistemaInmuneGeneticaEpjaM2Round(){
  const item = pick(SISTEMA_INMUNE_GENETICA_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SISTEMA_INMUNE_GENETICA_M2,
  };
}

/* ---------------- Fluidos y Presión ---------------- */
const RECURSO_FLUIDOS_PRESION_M2 = 'La <b>presión</b> es la fuerza aplicada sobre una superficie, dividida por el área de esa superficie. La <b>presión hidrostática</b> es la presión que ejerce un líquido en reposo, y aumenta con la profundidad. El <b>empuje</b> (principio de Arquímedes) es la fuerza hacia arriba que un fluido ejerce sobre un objeto sumergido, y explica por qué algunos objetos flotan. La <b>presión atmosférica</b> es la presión que ejerce el aire de la atmósfera sobre todo lo que está en la superficie terrestre.';
const FLUIDOS_PRESION_M2_BANK = [
  { pregunta:'¿Cómo se define la presión, en términos físicos?', correcta:'La fuerza aplicada sobre una superficie, dividida por el área', opts:['Solo la fuerza aplicada, sin considerar el área','Solo el área de una superficie','La masa de un objeto dividida por su volumen'] },
  { pregunta:'¿Qué ocurre con la presión hidrostática a medida que aumenta la profundidad en un líquido?', correcta:'Aumenta', opts:['Disminuye','Se mantiene siempre igual','Desaparece por completo'] },
  { pregunta:'¿Qué principio físico explica por qué un barco de metal puede flotar en el agua?', correcta:'El principio de Arquímedes (empuje)', opts:['La ley de la gravedad únicamente','El magnetismo','La presión atmosférica únicamente'] },
  { pregunta:'¿Cómo se llama la fuerza hacia arriba que un fluido ejerce sobre un objeto sumergido en él?', correcta:'Empuje', opts:['Presión hidrostática','Presión atmosférica','Densidad'] },
  { pregunta:'¿Qué ejerce presión atmosférica sobre la superficie terrestre y todo lo que está en ella?', correcta:'El aire de la atmósfera', opts:['Solo el agua de los océanos','Solo los objetos metálicos','Ningún elemento ejerce esa presión'] },
  { pregunta:'Un buzo que desciende a mayor profundidad en el mar siente más presión sobre su cuerpo. ¿Qué tipo de presión es esta?', correcta:'Presión hidrostática', opts:['Presión atmosférica exclusivamente','Presión eléctrica','Presión magnética'] },
  { pregunta:'¿Por qué una persona siente que "le tapan los oídos" al subir rápidamente a una montaña alta?', correcta:'Porque la presión atmosférica disminuye con la altura', opts:['Porque la presión atmosférica aumenta con la altura','Porque el empuje del aire desaparece','Porque la gravedad deja de actuar'] },
  { pregunta:'Un objeto de metal muy denso se hunde en el agua a pesar del empuje que recibe. ¿Qué explica esto?', correcta:'Su peso es mayor que el empuje que el agua puede ejercer sobre él', opts:['El agua no ejerce ningún empuje sobre objetos de metal','La presión atmosférica lo hunde directamente','El magnetismo del metal lo hunde'] },
  { pregunta:'¿Qué instrumento se usa comúnmente para medir la presión atmosférica?', correcta:'El barómetro', opts:['El termómetro','La balanza','El amperímetro'] },
  { pregunta:'Al inflar un neumático de auto, ¿qué se está aumentando dentro de él?', correcta:'La presión del aire comprimido dentro del neumático', opts:['El empuje del neumático','La presión atmosférica externa','El magnetismo del neumático'] },
];
export function genFluidosPresionEpjaM2Round(){
  const item = pick(FLUIDOS_PRESION_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_FLUIDOS_PRESION_M2,
  };
}

/* ---------------- Electricidad y Magnetismo ---------------- */
const RECURSO_ELECTRICIDAD_MAGNETISMO_M2 = 'Un <b>circuito eléctrico</b> necesita una fuente de energía, conductores (materiales que permiten el paso de la corriente, como el cobre) y aisladores (materiales que la bloquean, como el plástico); los <b>fusibles</b> protegen el circuito cortando el paso de corriente si esta es excesiva, y la <b>conexión a tierra</b> desvía la corriente en caso de falla para evitar descargas peligrosas. El <b>magnetismo</b> (imanes, campo magnético) está estrechamente relacionado con la electricidad: una corriente eléctrica genera un campo magnético, y un campo magnético en movimiento puede generar corriente eléctrica (inducción) — el principio detrás de los generadores eléctricos.';
const ELECTRICIDAD_MAGNETISMO_M2_BANK = [
  { pregunta:'¿Qué tipo de material permite el paso de la corriente eléctrica, como el cobre?', correcta:'Conductor', opts:['Aislador','Fusible','Interruptor'] },
  { pregunta:'¿Qué tipo de material bloquea el paso de la corriente eléctrica, como el plástico o el caucho?', correcta:'Aislador', opts:['Conductor','Resistencia','Interruptor'] },
  { pregunta:'¿Qué componente de un circuito corta el paso de corriente cuando esta es excesiva, protegiendo la instalación?', correcta:'El fusible', opts:['El interruptor','El conductor','El aislador'] },
  { pregunta:'¿Qué componente de un circuito permite abrir o cerrar el paso de corriente manualmente, como el de una luz de una casa?', correcta:'El interruptor', opts:['El fusible','El aislador','La resistencia'] },
  { pregunta:'¿Qué función cumple la conexión a tierra en una instalación eléctrica?', correcta:'Desviar la corriente en caso de falla, evitando descargas peligrosas', opts:['Aumentar el voltaje de la instalación','Bloquear por completo el paso de corriente siempre','Disminuir el consumo eléctrico de un artefacto'] },
  { pregunta:'¿Qué genera una corriente eléctrica al circular por un conductor?', correcta:'Un campo magnético', opts:['Un aislante natural','Una presión hidrostática','Ninguna consecuencia magnética'] },
  { pregunta:'¿Cómo se llama el fenómeno en el que un campo magnético en movimiento genera una corriente eléctrica?', correcta:'Inducción electromagnética', opts:['Conducción térmica','Presión atmosférica','Fotosíntesis'] },
  { pregunta:'¿Qué principio físico es la base del funcionamiento de un generador eléctrico?', correcta:'La inducción electromagnética', opts:['El empuje de Arquímedes','La presión hidrostática','La homeostasis'] },
  { pregunta:'¿Qué mide la resistencia eléctrica de un circuito?', correcta:'La oposición al paso de la corriente eléctrica', opts:['La cantidad de imanes presentes','La temperatura ambiente','La presión atmosférica'] },
  { pregunta:'Un electricista instala un fusible en el tablero eléctrico de una casa. ¿Qué está previniendo con esto?', correcta:'Una sobrecarga eléctrica que pueda dañar la instalación o causar un incendio', opts:['Un aumento en la factura de electricidad','La entrada de agua a la instalación','El desgaste natural de los cables con el tiempo'] },
];
export function genElectricidadMagnetismoEpjaM2Round(){
  const item = pick(ELECTRICIDAD_MAGNETISMO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ELECTRICIDAD_MAGNETISMO_M2,
  };
}

/* ---------------- Evolución y Modelos Atómicos ---------------- */
const RECURSO_EVOLUCION_ATOMO_M2 = 'La <b>teoría de la evolución</b> explica cómo las especies cambian a lo largo del tiempo mediante la selección natural, apoyada en evidencias como el registro fósil y las semejanzas anatómicas entre especies. Los <b>modelos atómicos</b> han cambiado a lo largo de la historia de la ciencia para explicar mejor la estructura del átomo, que está formado por un <b>núcleo</b> (con protones y neutrones) rodeado de <b>electrones</b> en constante movimiento. Un <b>átomo</b> es la unidad más pequeña de un elemento; cuando varios átomos se unen forman <b>moléculas</b>, y un átomo o molécula con carga eléctrica se llama <b>ion</b>.';
const EVOLUCION_ATOMO_M2_BANK = [
  { pregunta:'¿Qué teoría científica explica cómo las especies cambian a través del tiempo mediante la selección natural?', correcta:'La teoría de la evolución', opts:['La teoría atómica','La teoría de la homeostasis','La teoría celular'] },
  { pregunta:'¿Cuál de las siguientes es una evidencia real que apoya la teoría de la evolución de las especies?', correcta:'El registro fósil de especies antiguas', opts:['La ausencia total de fósiles en el planeta','La igualdad genética absoluta entre todas las especies','La invención de la tabla periódica'] },
  { pregunta:'¿Qué parte del átomo contiene los protones y los neutrones?', correcta:'El núcleo', opts:['Los electrones','La molécula','El ion'] },
  { pregunta:'¿Qué partículas del átomo se mueven constantemente alrededor del núcleo?', correcta:'Los electrones', opts:['Los protones','Los neutrones','Los iones únicamente'] },
  { pregunta:'¿Cómo se llama la unidad más pequeña de un elemento químico?', correcta:'Átomo', opts:['Molécula','Ion','Célula'] },
  { pregunta:'¿Cómo se llama la unión de dos o más átomos?', correcta:'Molécula', opts:['Átomo aislado','Núcleo','Electrón libre'] },
  { pregunta:'¿Cómo se llama un átomo o una molécula que ha ganado o perdido electrones, adquiriendo carga eléctrica?', correcta:'Ion', opts:['Átomo neutro','Molécula orgánica','Isótopo sin carga'] },
  { pregunta:'A lo largo de la historia de la ciencia, ¿por qué han cambiado los distintos modelos atómicos propuestos?', correcta:'Porque nuevos experimentos permitieron explicar mejor la estructura real del átomo', opts:['Porque los átomos cambian de estructura con el tiempo','Porque no existe ningún modelo atómico válido','Porque la ciencia dejó de estudiar el átomo'] },
  { pregunta:'Las semejanzas anatómicas entre distintas especies de vertebrados son una evidencia usada para apoyar qué teoría?', correcta:'La teoría de la evolución', opts:['La teoría atómica','La ley de conservación de la energía','La teoría del magnetismo'] },
  { pregunta:'¿Qué carga eléctrica tiene un protón dentro del núcleo atómico?', correcta:'Positiva', opts:['Negativa','Neutra','Ninguna carga eléctrica'] },
];
export function genEvolucionAtomoEpjaM2Round(){
  const item = pick(EVOLUCION_ATOMO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_EVOLUCION_ATOMO_M2,
  };
}

/* ---------------- Enlaces Químicos y Radiactividad ---------------- */
const RECURSO_ENLACES_RADIACTIVIDAD_M2 = 'Los <b>enlaces químicos</b> son las fuerzas que mantienen unidos a los átomos dentro de una molécula, y dependen de cómo se organizan sus electrones (por ejemplo, el enlace iónico transfiere electrones, y el enlace covalente los comparte). Los <b>fenómenos radiactivos</b> ocurren cuando el núcleo de un átomo inestable emite partículas o energía para volverse más estable, lo que conlleva riesgos para la salud y el ambiente si no se maneja con cuidado. La <b>tabla periódica</b> organiza a los elementos químicos en filas (periodos) y columnas (grupos) según sus propiedades y la estructura de sus átomos.';
const ENLACES_RADIACTIVIDAD_M2_BANK = [
  { pregunta:'¿Qué tipo de enlace químico ocurre cuando un átomo transfiere electrones a otro, como en la sal común?', correcta:'Enlace iónico', opts:['Enlace covalente','Enlace metálico','Ningún enlace'] },
  { pregunta:'¿Qué tipo de enlace químico ocurre cuando dos átomos comparten electrones entre sí?', correcta:'Enlace covalente', opts:['Enlace iónico','Enlace metálico','Enlace nuclear'] },
  { pregunta:'¿Qué ocurre en el núcleo de un átomo radiactivo inestable?', correcta:'Emite partículas o energía para volverse más estable', opts:['Se vuelve permanentemente más inestable sin cambio','Deja de tener protones','Se transforma en una molécula orgánica'] },
  { pregunta:'¿Qué tipo de riesgo conlleva la exposición no controlada a fenómenos radiactivos?', correcta:'Riesgos para la salud humana y el medioambiente', opts:['Ningún riesgo si se usa cualquier cantidad','Solo riesgos económicos, nunca de salud','Riesgos únicamente para plantas, nunca para personas'] },
  { pregunta:'¿Cómo se organizan las filas de la tabla periódica de los elementos?', correcta:'En periodos', opts:['En grupos únicamente','En isótopos','En enlaces'] },
  { pregunta:'¿Cómo se organizan las columnas de la tabla periódica de los elementos?', correcta:'En grupos', opts:['En periodos únicamente','En moléculas','En iones'] },
  { pregunta:'Un trabajador de una planta de radioterapia debe usar equipos de protección especiales. ¿Por qué esto es necesario?', correcta:'Porque la exposición a la radiación conlleva riesgos para la salud', opts:['Porque hace mucho frío en esas instalaciones','Porque el equipo de protección no cumple ninguna función real','Porque se trata de un enlace covalente peligroso'] },
  { pregunta:'¿Qué determina en gran parte el tipo de enlace químico que forma un átomo con otro?', correcta:'La organización de sus electrones', opts:['El color del elemento','Su temperatura de fusión únicamente','Su posición geográfica'] },
  { pregunta:'Elementos ubicados en un mismo grupo de la tabla periódica suelen compartir:', correcta:'Propiedades químicas similares', opts:['Ningún parecido entre sí','Siempre el mismo color físico','El mismo número de neutrones exactamente'] },
  { pregunta:'¿Qué uso beneficioso, además de sus riesgos, tienen los fenómenos radiactivos en la sociedad actual?', correcta:'Aplicaciones médicas, como el diagnóstico y tratamiento de enfermedades', opts:['Ningún uso beneficioso existe','Solo se usan para fabricar imanes','Únicamente sirven para generar magnetismo'] },
];
export function genEnlacesRadiactividadEpjaM2Round(){
  const item = pick(ENLACES_RADIACTIVIDAD_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ENLACES_RADIACTIVIDAD_M2,
  };
}

/* ---------------- Química Orgánica y Polímeros ---------------- */
const RECURSO_ORGANICA_POLIMEROS_M2 = 'Las <b>moléculas orgánicas</b> están basadas principalmente en carbono, e incluyen sustancias tan comunes como los azúcares, las grasas o el alcohol. Los <b>grupos funcionales</b> son partes específicas de una molécula orgánica que le dan propiedades particulares (por ejemplo, el grupo que hace que el vinagre sea ácido). Un <b>polímero</b> es una molécula grande formada por la repetición de unidades más pequeñas; puede ser <b>sintético</b> (fabricado por el ser humano, como el plástico) o <b>natural</b> (producido por la naturaleza, como el caucho o el almidón).';
const ORGANICA_POLIMEROS_M2_BANK = [
  { pregunta:'¿Qué elemento químico forma la base de todas las moléculas orgánicas?', correcta:'El carbono', opts:['El hierro','El oxígeno únicamente','El sodio'] },
  { pregunta:'¿Cómo se llama la parte específica de una molécula orgánica que le da propiedades particulares, como la acidez?', correcta:'Grupo funcional', opts:['Núcleo atómico','Ion metálico','Cromosoma'] },
  { pregunta:'¿Cómo se llama una molécula grande formada por la repetición de muchas unidades más pequeñas?', correcta:'Polímero', opts:['Ion','Átomo','Elemento simple'] },
  { pregunta:'¿Cuál de los siguientes es un ejemplo de polímero sintético, fabricado por el ser humano?', correcta:'El plástico', opts:['El caucho natural','El almidón de la papa','La celulosa de la madera'] },
  { pregunta:'¿Cuál de los siguientes es un ejemplo de polímero natural, producido por la naturaleza?', correcta:'El caucho', opts:['El nailon','El poliéster','El PVC'] },
  { pregunta:'¿Cuál de las siguientes es una molécula orgánica común, presente en los alimentos?', correcta:'Los azúcares', opts:['La sal común (cloruro de sodio)','El agua pura','El hierro metálico'] },
  { pregunta:'El vinagre tiene un grupo funcional que le da su característica principal. ¿Qué propiedad le otorga ese grupo funcional?', correcta:'Su acidez', opts:['Su color amarillo','Su capacidad magnética','Su conductividad eléctrica'] },
  { pregunta:'¿Qué polímero natural forma parte importante de la estructura de las plantas?', correcta:'La celulosa', opts:['El nailon','El poliéster','El PVC'] },
  { pregunta:'Una botella de plástico desechada tarda muchos años en degradarse en el ambiente. ¿A qué se debe esto, en términos químicos?', correcta:'A que está hecha de un polímero sintético difícil de descomponer naturalmente', opts:['A que está hecha de un polímero natural fácil de degradar','A que no contiene ningún tipo de enlace químico','A que es un elemento puro sin moléculas'] },
  { pregunta:'¿Cuál de las siguientes sustancias es un ejemplo de molécula orgánica presente en las grasas?', correcta:'Los lípidos', opts:['El cloruro de sodio','El oxígeno gaseoso','El hierro'] },
];
export function genOrganicaPolimerosEpjaM2Round(){
  const item = pick(ORGANICA_POLIMEROS_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ORGANICA_POLIMEROS_M2,
  };
}

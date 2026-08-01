import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 3 de Educación Básica: Ciencias Naturales ----------------
   Mismo marco que cienciasNivel2.js: Nivel 3 Básica equivale a 7°-8° básico, fuente real
   "Temario Tercer Nivel de Educación Básica", Decreto Supremo N°257 de 2009 (epja.mineduc.cl,
   versión 2026 2do semestre). El subsector "NB3 Ciencias Naturales" es el más extenso del
   temario (24 objetivos), agrupables en 6 bloques temáticos: 1) Modelo cinético molecular y
   materia (comportamiento de la materia -forma/densidad/resistencia/fluidez/difusión-,
   presión/temperatura/transferencia de calor, relación masa-volumen y flotabilidad,
   estructura microscópica/propiedades macroscópicas en los distintos estados); 2) Átomos,
   moléculas y reacciones químicas (teoría atómica de Dalton -elemento/compuesto/átomo/
   molécula-, modelos moleculares de reacciones simples, aporte de Lavoisier a la
   conservación de la masa, factores que afectan la velocidad de reacción, reacciones
   exotérmicas/endotérmicas); 3) Energía (concepto/formas/fuentes/impacto ambiental,
   problemas de fuerza/trabajo/energía cinética-potencial, ley de conservación de la
   energía en transformaciones cotidianas, clasificación de dispositivos según su
   transformación de energía, problemas de sistemas mecánicos simples); 4) Origen de la
   vida y genética (teorías del origen de la vida, calendario geológico, evidencias de la
   evolución, fósiles, ADN y genoma, reproducción asexual/sexual, la célula como unidad
   estructural/funcional y los gametos como células especializadas); 5) Reproducción
   humana y sexualidad responsable (estructura/función de los sistemas reproductores,
   concepción, desarrollo embrionario, lactancia, métodos de control de la natalidad,
   paternidad/maternidad responsable, factores biológicos/psicológicos/sociales/valóricos
   de la sexualidad humana); 6) Sistema inmune, enfermedades y vida saludable (barreras del
   organismo frente a patógenos, clasificación del origen de enfermedades, interpretación de
   datos sobre estilo de vida saludable, distintos patógenos y sus medidas de prevención).
   El bloque 5 (Reproducción Humana y Sexualidad Responsable, OA18-20) se trata con el mismo
   tono clínico/factual ya establecido para este tipo de contenido en ciencias.js
   (genSexualidadReproduccion7Round, 7° básico) — sin detalle gráfico ni juicio de valor,
   siempre recomendando consultar a un profesional de la salud ante cualquier duda. Dado que
   EPJA es educación para personas MAYORES DE 18 AÑOS, este bloque cubre también los métodos
   de control de la natalidad con mayor detalle factual (qué son, para qué sirven, la
   importancia de la paternidad/maternidad responsable) que en 7° básico, ya que el propio
   temario oficial de Nivel 3 lo exige explícitamente para población adulta (OA19).
   Los 6 módulos de este archivo cubren los 6 bloques uno a uno. Ningún objetivo de NB3
   Ciencias Naturales queda fuera del motor de opción múltiple. */

export const CIENCIAS_EPJA_N3_MODULES = [
  {id:'modeloCineticoEpjaN3', label:'Modelo Cinético y Materia', open:true, key:'modeloCineticoEpjaN3'},
  {id:'atomosReaccionesEpjaN3', label:'Átomos y Reacciones Químicas', open:true, key:'atomosReaccionesEpjaN3'},
  {id:'energiaTransformacionesEpjaN3', label:'Energía y Transformaciones', open:true, key:'energiaTransformacionesEpjaN3'},
  {id:'origenVidaGeneticaEpjaN3', label:'Origen de la Vida y Genética', open:true, key:'origenVidaGeneticaEpjaN3'},
  {id:'reproduccionSexualidadEpjaN3', label:'Reproducción y Sexualidad Responsable', open:true, key:'reproduccionSexualidadEpjaN3'},
  {id:'sistemaInmuneEnfermedadesEpjaN3', label:'Sistema Inmune y Enfermedades', open:true, key:'sistemaInmuneEnfermedadesEpjaN3'},
];
export const CIENCIAS_EPJA_N3_POS = [
  {x:22,y:92},{x:68,y:78},{x:24,y:62},{x:68,y:46},{x:24,y:30},{x:68,y:12}
];

const RECURSO_CINETICO_N3 = 'El <b>modelo cinético molecular</b> explica el comportamiento de la materia asumiendo que está formada por partículas en constante movimiento: en un sólido, las partículas vibran muy juntas (por eso tiene forma y resistencia mecánica propias); en un líquido, se mueven con más libertad (por eso fluye y toma la forma de su recipiente); y en un gas, se mueven libremente y muy separadas (por eso se difunde y ocupa todo el espacio disponible). Este modelo también explica la <b>presión</b> (el choque constante de partículas contra las paredes de un recipiente) y la <b>transferencia de calor</b> (el paso de energía de las partículas más rápidas a las más lentas). La <b>flotabilidad</b> de un objeto depende de la relación entre su masa y su volumen (su densidad): si un material es menos denso que el agua, flota; si es más denso, se hunde.';
const ESTADOS_PROPIEDAD_N3_BANK = [
  { pregunta:'¿Por qué un sólido mantiene su forma propia, según el modelo cinético molecular?', correcta:'Porque sus partículas están muy juntas y solo vibran en su lugar', opts:['Porque sus partículas no se mueven en absoluto','Porque sus partículas están muy separadas','Porque no tiene ninguna partícula'] },
  { pregunta:'¿Por qué un gas se difunde y ocupa todo el espacio disponible?', correcta:'Porque sus partículas se mueven libremente y están muy separadas', opts:['Porque sus partículas están fijas en su lugar','Porque no tiene masa','Porque sus partículas se repelen entre sí'] },
  { pregunta:'Según el modelo cinético, ¿qué es la presión de un gas?', correcta:'El choque constante de sus partículas contra las paredes del recipiente', opts:['La cantidad de color que tiene el gas','El peso total del recipiente','La temperatura exacta del ambiente'] },
  { pregunta:'¿Qué ocurre con la transferencia de calor entre dos cuerpos a distinta temperatura?', correcta:'La energía pasa del cuerpo más caliente al más frío hasta igualar la temperatura', opts:['La energía siempre pasa del más frío al más caliente','No ocurre ninguna transferencia de energía','Ambos cuerpos pierden toda su energía'] },
];
const FLOTABILIDAD_N3_BANK = [
  { material:'El corcho', densidad:'menor', correcta:'Flota', opts:['Se hunde'] },
  { material:'El hierro macizo', densidad:'mayor', correcta:'Se hunde', opts:['Flota'] },
  { material:'La madera seca', densidad:'menor', correcta:'Flota', opts:['Se hunde'] },
  { material:'Una piedra', densidad:'mayor', correcta:'Se hunde', opts:['Flota'] },
  { material:'El aceite', densidad:'menor', correcta:'Flota', opts:['Se hunde'] },
];
export function genModeloCineticoEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.6){
    const item = pick(ESTADOS_PROPIEDAD_N3_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+'.',
      recurso: RECURSO_CINETICO_N3,
    };
  }
  const item = pick(FLOTABILIDAD_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.material+' tiene una densidad '+item.densidad+' que la del agua. ¿Qué ocurre al ponerlo en agua?</p>',
    options: opts, correctValue: item.correcta, speakText: item.material+', ¿flota o se hunde en agua?', cols:2, panel:true,
    explain: 'Como '+item.material.toLowerCase()+' tiene una densidad '+item.densidad+' que la del agua, el resultado es: <b>'+item.correcta+'</b>.',
    recurso: RECURSO_CINETICO_N3,
  };
}

const RECURSO_ATOMOS_N3 = 'Según la <b>teoría atómica de Dalton</b>, toda la materia está formada por <b>átomos</b> (las partículas más pequeñas de un elemento que conservan sus propiedades); un <b>elemento</b> es una sustancia formada por un solo tipo de átomo (como el oxígeno o el hierro); un <b>compuesto</b> se forma cuando átomos de distintos elementos se combinan en una proporción fija (como el agua, H₂O); y una <b>molécula</b> es la unión de dos o más átomos, iguales o distintos. <b>Lavoisier</b> estableció el principio de conservación de la masa: en una reacción química, la masa total de los reactantes es igual a la masa total de los productos, nada se crea ni se destruye, solo se transforma. La <b>velocidad de una reacción</b> depende de factores como la temperatura, la concentración de los reactantes, el estado de división (más superficie, más rápido) y el uso de catalizadores. Una reacción es <b>exotérmica</b> si libera calor (como la combustión) y <b>endotérmica</b> si absorbe calor (como la descomposición térmica).';
const DALTON_N3_BANK = [
  { pregunta:'Según la teoría atómica, ¿qué es un elemento?', correcta:'Una sustancia formada por un solo tipo de átomo', opts:['La unión de dos elementos distintos','Una mezcla de varias sustancias','Un tipo de energía'] },
  { pregunta:'¿Qué es un compuesto?', correcta:'La combinación de átomos de distintos elementos en una proporción fija', opts:['Un solo tipo de átomo aislado','Una mezcla sin proporción fija','Un tipo de energía calórica'] },
  { pregunta:'¿Qué es una molécula?', correcta:'La unión de dos o más átomos, iguales o distintos', opts:['Un átomo aislado sin unirse a nada','Un tipo de energía','Un instrumento de laboratorio'] },
  { pregunta:'¿Cuál es la partícula más pequeña de un elemento que conserva sus propiedades?', correcta:'El átomo', opts:['La molécula','El compuesto','La mezcla'] },
];
const LAVOISIER_VELOCIDAD_N3_BANK = [
  { pregunta:'¿Qué establece el principio de conservación de la masa de Lavoisier?', correcta:'La masa total de los reactantes es igual a la masa total de los productos', opts:['La masa siempre aumenta en una reacción','La masa siempre disminuye en una reacción','La masa no tiene relación con las reacciones químicas'] },
  { pregunta:'¿Qué efecto tiene aumentar la temperatura sobre la velocidad de una reacción química?', correcta:'Generalmente la aumenta', opts:['Generalmente la detiene por completo','No tiene ningún efecto','Siempre la vuelve más lenta'] },
  { pregunta:'¿Qué efecto tiene un catalizador sobre una reacción química?', correcta:'Aumenta la velocidad de la reacción sin consumirse', opts:['Detiene la reacción por completo','Cambia el resultado final de la reacción','No afecta la velocidad de reacción'] },
  { pregunta:'¿Por qué un trozo de madera picado en astillas se quema más rápido que un tronco entero?', correcta:'Porque al dividirlo tiene mayor superficie expuesta a la reacción', opts:['Porque el trozo picado pesa menos','Porque el tronco entero no puede quemarse nunca','Porque no existe ninguna diferencia real'] },
  { pregunta:'¿Qué tipo de reacción libera calor hacia el ambiente, como la combustión de un fósforo?', correcta:'Una reacción exotérmica', opts:['Una reacción endotérmica','Una reacción neutra','Una reacción sin energía'] },
  { pregunta:'¿Qué tipo de reacción absorbe calor del ambiente, como la descomposición térmica de ciertos compuestos?', correcta:'Una reacción endotérmica', opts:['Una reacción exotérmica','Una reacción neutra','Una reacción sin energía'] },
];
export function genAtomosReaccionesEpjaN3Round(){
  const roll = Math.random();
  const item = roll<0.4 ? pick(DALTON_N3_BANK) : pick(LAVOISIER_VELOCIDAD_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ATOMOS_N3,
  };
}

const RECURSO_ENERGIA_N3 = 'La <b>energía</b> es la capacidad de producir cambios o realizar trabajo, y se manifiesta en distintas formas: calórica, cinética (de movimiento), potencial (almacenada, según la posición), eléctrica, radiante (luz), entre otras. La <b>ley de conservación de la energía</b> establece que la energía no se crea ni se destruye, solo se transforma de una forma a otra (por ejemplo, la energía potencial de un objeto en altura se transforma en energía cinética al caer). Muchos dispositivos cotidianos se basan en transformar energía de una forma a otra: una <b>celda fotoeléctrica</b> transforma luz en electricidad, una <b>pila</b> transforma energía química en eléctrica, un <b>dínamo</b> transforma movimiento en electricidad, y una <b>planta hidroeléctrica</b> transforma la energía del agua en movimiento y luego en electricidad. El <b>trabajo</b> se realiza cuando una fuerza produce un desplazamiento.';
const TRANSFORMACION_ENERGIA_N3_BANK = [
  { dispositivo:'Una celda fotoeléctrica (panel solar)', correcta:'De luz (radiante) a eléctrica', opts:['De eléctrica a calórica','De cinética a potencial','De química a cinética'] },
  { dispositivo:'Una pila o batería', correcta:'De química a eléctrica', opts:['De eléctrica a química','De cinética a calórica','De potencial a radiante'] },
  { dispositivo:'Un dínamo de bicicleta', correcta:'De cinética (movimiento) a eléctrica', opts:['De eléctrica a cinética','De química a potencial','De calórica a radiante'] },
  { dispositivo:'Una planta hidroeléctrica', correcta:'De potencial y cinética del agua a eléctrica', opts:['De eléctrica a química','De radiante a calórica','De cinética a química'] },
  { dispositivo:'Una plancha para la ropa', correcta:'De eléctrica a calórica', opts:['De calórica a eléctrica','De cinética a potencial','De química a radiante'] },
  { dispositivo:'Un ventilador', correcta:'De eléctrica a cinética', opts:['De cinética a eléctrica','De química a potencial','De calórica a química'] },
];
const RECONOCE_ENERGIA_N3_BANK = [
  { pregunta:'Un objeto en lo alto de un cerro tiene energía almacenada por su posición. ¿Cómo se llama esa energía?', correcta:'Energía potencial', opts:['Energía cinética','Energía eléctrica','Energía radiante'] },
  { pregunta:'Un auto que se mueve por la carretera tiene energía asociada a su movimiento. ¿Cómo se llama esa energía?', correcta:'Energía cinética', opts:['Energía potencial','Energía eléctrica','Energía radiante'] },
  { pregunta:'Según la ley de conservación de la energía, cuando un objeto cae desde una altura, ¿qué ocurre con su energía potencial?', correcta:'Se transforma progresivamente en energía cinética', opts:['Desaparece por completo','Se multiplica sin límite','Se convierte en materia'] },
  { pregunta:'¿Cuándo se dice que una fuerza realiza trabajo sobre un objeto?', correcta:'Cuando produce un desplazamiento del objeto', opts:['Cuando el objeto se mantiene completamente inmóvil','Solo cuando el objeto es muy pesado','Nunca, el trabajo no depende de fuerzas'] },
];
export function genEnergiaTransformacionesEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.5){
    const item = pick(TRANSFORMACION_ENERGIA_N3_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.dispositivo+' transforma energía. ¿En qué sentido ocurre esa transformación?</p>',
      options: opts, correctValue: item.correcta, speakText: item.dispositivo+', ¿qué transformación de energía realiza?', cols:2, panel:true,
      explain: item.dispositivo+' transforma energía: '+item.correcta+'.',
      recurso: RECURSO_ENERGIA_N3,
    };
  }
  const item = pick(RECONOCE_ENERGIA_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ENERGIA_N3,
  };
}

const RECURSO_ORIGEN_VIDA_N3 = 'Existen distintas <b>teorías científicas sobre el origen de la vida</b>, y el <b>calendario geológico</b> organiza la historia de la Tierra en grandes períodos, apoyándose en evidencias como los <b>fósiles</b> (restos o huellas de seres vivos del pasado) para reconstruir la historia de la <b>evolución</b> de las especies. La información genética de todo ser vivo está contenida en el <b>ADN</b>, y el conjunto completo de esa información se llama <b>genoma</b>. La <b>reproducción asexual</b> genera descendencia genéticamente idéntica al progenitor (sin variación), mientras que la <b>reproducción sexual</b> combina información genética de dos progenitores, generando variación genética en la descendencia. La <b>célula</b> es la unidad estructural y funcional básica de todo ser vivo, y los <b>gametos</b> (óvulo y espermatozoide) son células especializadas en la transmisión de esa información genética a la siguiente generación.';
const ORIGEN_VIDA_N3_BANK = [
  { pregunta:'¿Qué son los fósiles y para qué sirven en el estudio de la evolución?', correcta:'Son restos o huellas de seres vivos del pasado que sirven como evidencia de la evolución', opts:['Son rocas sin ninguna relación con seres vivos','Son solo objetos fabricados por el ser humano','Son un tipo de mineral usado en joyería'] },
  { pregunta:'¿Qué organiza el calendario geológico?', correcta:'La historia de la Tierra en grandes períodos de tiempo', opts:['Solo los días festivos del año','El horario escolar','Los ciclos de la Luna'] },
  { pregunta:'¿Dónde se almacena la información genética de un ser vivo?', correcta:'En el ADN', opts:['En los glóbulos rojos únicamente','En el esqueleto','En el sistema digestivo'] },
  { pregunta:'¿Qué es el genoma de un ser vivo?', correcta:'El conjunto completo de su información genética', opts:['Un tipo de célula específica','Un órgano del cuerpo','Un tipo de proteína'] },
  { pregunta:'¿Qué característica tiene la descendencia producida por reproducción asexual?', correcta:'Es genéticamente idéntica al progenitor, sin variación', opts:['Combina información genética de dos progenitores','Siempre presenta mutaciones graves','No tiene ninguna información genética'] },
  { pregunta:'¿Qué característica tiene la descendencia producida por reproducción sexual?', correcta:'Combina información genética de dos progenitores, generando variación', opts:['Es siempre idéntica a uno solo de los progenitores','No hereda ninguna información genética','Ocurre sin ningún tipo de célula especializada'] },
  { pregunta:'¿Cuál es la unidad estructural y funcional básica de todo ser vivo?', correcta:'La célula', opts:['El átomo','El órgano','El tejido'] },
  { pregunta:'¿Qué son los gametos?', correcta:'Células especializadas en transmitir la información genética a la siguiente generación', opts:['Células que forman parte de los huesos','Células que solo existen en las plantas','Un tipo de proteína digestiva'] },
];
export function genOrigenVidaGeneticaEpjaN3Round(){
  const item = pick(ORIGEN_VIDA_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ORIGEN_VIDA_N3,
  };
}

const RECURSO_REPRODUCCION_N3 = 'Los <b>sistemas reproductores femenino y masculino</b> están formados por órganos especializados en producir gametos y hacer posible la reproducción; la <b>concepción</b> ocurre cuando un óvulo es fecundado por un espermatozoide, dando inicio al <b>desarrollo embrionario</b>, y tras el nacimiento, la <b>lactancia</b> aporta nutrientes y defensas importantes para el recién nacido. Los <b>métodos de control de la natalidad</b> (como el preservativo, los anticonceptivos hormonales o el dispositivo intrauterino, entre otros) permiten decidir si tener hijos y en qué momento, y su elección debe hacerse siempre con orientación de un profesional de la salud, según las necesidades y la salud de cada persona. La <b>paternidad y maternidad responsable</b> implica asumir de forma consciente y comprometida el cuidado, la crianza y el bienestar de un hijo o hija. La sexualidad humana no depende solo de lo biológico, sino también de factores <b>psicológicos, sociales y valóricos</b> que forman parte de cómo cada persona vive y expresa su sexualidad.';
const SISTEMA_REPRODUCTOR_N3_BANK = [
  { pregunta:'¿Cómo se llama el momento en que un óvulo es fecundado por un espermatozoide?', correcta:'Concepción', opts:['Ovulación','Lactancia','Menstruación'] },
  { pregunta:'¿Qué etapa comienza inmediatamente después de la concepción?', correcta:'El desarrollo embrionario', opts:['La pubertad','La menopausia','La adolescencia'] },
  { pregunta:'¿Qué aporta la lactancia al recién nacido, además de nutrientes?', correcta:'Defensas importantes para su sistema inmunológico', opts:['Ningún beneficio adicional','Solo un sabor agradable','Únicamente hidratación'] },
];
const METODOS_NATALIDAD_N3_BANK = [
  { pregunta:'¿Para qué sirven los métodos de control de la natalidad?', correcta:'Para decidir si tener hijos y en qué momento hacerlo', opts:['Para curar enfermedades respiratorias','Para mejorar el rendimiento físico','Para prevenir alergias alimentarias'] },
  { pregunta:'¿Cuál de estos es un método de control de la natalidad de barrera?', correcta:'El preservativo', opts:['Un antibiótico','Una vacuna contra la gripe','Un analgésico'] },
  { pregunta:'¿Por qué es importante consultar a un profesional de la salud antes de elegir un método de control de la natalidad?', correcta:'Para recibir orientación adecuada según la salud y necesidades de cada persona', opts:['No es necesario consultar a nadie','Porque todos los métodos son exactamente iguales para cualquier persona','Porque es solo un trámite sin ninguna relación con la salud'] },
  { pregunta:'¿Qué implica ejercer una paternidad o maternidad responsable?', correcta:'Asumir de forma consciente el cuidado, la crianza y el bienestar de un hijo o hija', opts:['No tiene relación con el cuidado de los hijos','Depende únicamente de factores económicos','Es una decisión que no requiere ninguna preparación'] },
];
const FACTORES_SEXUALIDAD_N3_BANK = [
  { pregunta:'Además de lo biológico, ¿qué otros factores influyen en la sexualidad humana?', correcta:'Factores psicológicos, sociales y valóricos', opts:['Solo factores climáticos','Únicamente factores económicos','Ningún otro factor influye'] },
  { pregunta:'¿Qué papel cumplen los valores personales en la forma en que alguien vive su sexualidad?', correcta:'Influyen en las decisiones y en cómo cada persona la expresa', opts:['No tienen ninguna influencia real','Solo importan en la vida escolar','Dependen únicamente del clima del lugar'] },
];
export function genReproduccionSexualidadEpjaN3Round(){
  const roll = Math.random();
  const item = roll<0.34 ? pick(SISTEMA_REPRODUCTOR_N3_BANK) : (roll<0.75 ? pick(METODOS_NATALIDAD_N3_BANK) : pick(FACTORES_SEXUALIDAD_N3_BANK));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'. Ante cualquier duda sobre estos temas, siempre es recomendable consultar a un profesional de la salud.',
    recurso: RECURSO_REPRODUCCION_N3,
  };
}

const RECURSO_INMUNE_N3 = 'El organismo humano tiene <b>barreras</b> que lo defienden de patógenos: barreras físicas (piel, mucosas), químicas (ácido estomacal) y celulares (glóbulos blancos). Las <b>enfermedades</b> pueden tener distintos orígenes: infeccioso (causadas por patógenos como virus, bacterias, hongos o parásitos), genético, o por factores del estilo de vida (mala alimentación, sedentarismo, consumo de tabaco o alcohol). Un <b>estilo de vida saludable</b> —alimentación equilibrada, actividad física regular, buen descanso, control médico periódico— reduce el riesgo de desarrollar muchas enfermedades, y es una responsabilidad tanto personal como social (por ejemplo, a través de políticas públicas de salud). Cada tipo de <b>patógeno</b> (virus, bacteria, hongo, parásito) tiene formas propias de prevención, como la vacunación, la higiene o el control de vectores.';
const BARRERAS_ORIGEN_N3_BANK = [
  { pregunta:'¿Cuál de estas es una barrera física del organismo contra los patógenos?', correcta:'La piel', opts:['Los glóbulos blancos','El ácido estomacal','Los anticuerpos'] },
  { pregunta:'¿Cuál de estas es una barrera química del organismo contra los patógenos?', correcta:'El ácido del estómago', opts:['La piel','Las mucosas','El cabello'] },
  { pregunta:'¿Qué tipo de células se encargan de combatir patógenos dentro del cuerpo?', correcta:'Los glóbulos blancos', opts:['Los glóbulos rojos','Las plaquetas','Las neuronas'] },
  { pregunta:'¿Cuál de estas enfermedades tiene un origen infeccioso?', correcta:'La influenza (causada por un virus)', opts:['La diabetes tipo 2 asociada a hábitos','Una fractura de hueso','Una alergia alimentaria'] },
  { pregunta:'¿Cuál de estos factores del estilo de vida aumenta el riesgo de desarrollar enfermedades cardiovasculares?', correcta:'El sedentarismo y una mala alimentación', opts:['Dormir la cantidad de horas recomendada','Realizar actividad física regular','Asistir a controles médicos periódicos'] },
];
const VIDA_SALUDABLE_N3_BANK = [
  { pregunta:'¿Qué información entrega un control médico periódico sobre el estado de salud de una persona?', correcta:'Permite detectar a tiempo posibles problemas de salud', opts:['No entrega ninguna información útil','Solo sirve para recibir recetas','Es un trámite sin relación con la salud'] },
  { pregunta:'¿Por qué se dice que la vida saludable es una responsabilidad tanto personal como social?', correcta:'Porque depende de decisiones individuales, pero también de políticas públicas de salud', opts:['Porque depende únicamente del clima','Porque no involucra a la sociedad en absoluto','Porque es responsabilidad exclusiva del Estado'] },
];
const PATOGENOS_N3_BANK = [
  { pregunta:'¿Cuál es una medida efectiva para prevenir enfermedades causadas por virus, como la influenza?', correcta:'La vacunación', opts:['Consumir más azúcar','Evitar el descanso','Reducir el consumo de agua'] },
  { pregunta:'¿Cuál es una medida efectiva para prevenir infecciones causadas por bacterias en los alimentos?', correcta:'Mantener una buena higiene al manipular y cocinar los alimentos', opts:['Guardar los alimentos sin refrigeración','Evitar lavarse las manos','No cocinar bien la carne'] },
  { pregunta:'¿Qué medida ayuda a prevenir enfermedades transmitidas por parásitos a través de vectores, como los mosquitos?', correcta:'El control de vectores (por ejemplo, eliminar aguas estancadas)', opts:['Aumentar las aguas estancadas cerca de la casa','Evitar cualquier tipo de prevención','Reducir el consumo de agua potable'] },
];
export function genSistemaInmuneEnfermedadesEpjaN3Round(){
  const roll = Math.random();
  const item = roll<0.5 ? pick(BARRERAS_ORIGEN_N3_BANK) : (roll<0.75 ? pick(VIDA_SALUDABLE_N3_BANK) : pick(PATOGENOS_N3_BANK));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_INMUNE_N3,
  };
}

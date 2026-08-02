import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Media: Ciencias Naturales ----------------
   Nivel 1 Media equivale a 1°-2° medio (ver content/grades.js). Fuente real: "Temario Primer
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er semestre). El temario de NM1 Ciencias Naturales se organiza en 3 grandes áreas:
   Ciencias Biológicas (célula y metabolismo, sistemas de nutrición del cuerpo humano,
   ecosistemas y biodiversidad), Ciencias Físicas (movimiento, ondas sonoras/luminosas y
   óptica, energía/trabajo/calor), y Ciencias Químicas (disoluciones y su concentración,
   ácido-base, óxido-reducción, velocidad de reacción, combustión). 6 módulos cubren las 3
   áreas completas: La Célula y su Metabolismo, Sistemas de Nutrición y Salud, Ecosistemas y
   Biodiversidad (Biológicas); Movimiento, Ondas y Óptica, Energía y Calor (Físicas); y
   Disoluciones y Reacciones Químicas (Químicas, agrupando concentración/ácido-base/redox/
   velocidad de reacción/combustión en un solo módulo dado que el temario los presenta como
   un bloque temático relacionado). Ningún eje del temario queda fuera. Contextos de vida
   adulta (situaciones cotidianas, laborales y de salud) en vez de escolares/infantiles. */

export const CIENCIAS_EPJA_M1_MODULES = [
  {id:'celulaMetabolismoEpjaM1', label:'La Célula y su Metabolismo', open:true, key:'celulaMetabolismoEpjaM1'},
  {id:'sistemasNutricionEpjaM1', label:'Sistemas de Nutrición y Salud', open:true, key:'sistemasNutricionEpjaM1'},
  {id:'ecosistemasBiodiversidadEpjaM1', label:'Ecosistemas y Biodiversidad', open:true, key:'ecosistemasBiodiversidadEpjaM1'},
  {id:'movimientoOndasOpticaEpjaM1', label:'Movimiento, Ondas y Óptica', open:true, key:'movimientoOndasOpticaEpjaM1'},
  {id:'energiaCalorEpjaM1', label:'Energía, Trabajo y Calor', open:true, key:'energiaCalorEpjaM1'},
  {id:'disolucionesReaccionesEpjaM1', label:'Disoluciones y Reacciones Químicas', open:true, key:'disolucionesReaccionesEpjaM1'},
];
export const CIENCIAS_EPJA_M1_POS = [{x:22,y:92},{x:68,y:76},{x:24,y:60},{x:70,y:44},{x:24,y:28},{x:70,y:10}];

/* ---------------- La Célula y su Metabolismo ---------------- */
const RECURSO_CELULA_METABOLISMO_M1 = 'La <b>célula</b> es la unidad básica de todo ser vivo, formada por componentes como el núcleo (controla la actividad celular), la membrana (regula qué entra y sale) y el citoplasma. El <b>intercambio entre la célula y su ambiente</b> (entrada de nutrientes, salida de desechos) es esencial para que la célula funcione. El <b>metabolismo</b> es el conjunto de reacciones químicas que ocurren dentro de la célula para obtener energía y construir sus propias estructuras, usando tanto moléculas orgánicas (como proteínas y carbohidratos) como inorgánicas (como el agua y las sales minerales).';
const CELULA_M1_BANK = [
  { pregunta:'¿Cuál es la estructura celular que controla y dirige la actividad de la célula?', correcta:'El núcleo', opts:['La membrana celular','El citoplasma','La pared celular'] },
  { pregunta:'¿Qué estructura regula qué sustancias entran y salen de la célula?', correcta:'La membrana celular', opts:['El núcleo','El citoplasma','Las mitocondrias'] },
  { pregunta:'¿Cómo se llama el proceso mediante el cual la célula intercambia sustancias con su ambiente?', correcta:'Intercambio celular', opts:['Fotosíntesis exclusiva','Reproducción celular','Mitosis'] },
  { pregunta:'¿Cuál de las siguientes es una molécula inorgánica presente en la célula?', correcta:'El agua', opts:['Las proteínas','Los carbohidratos','Los lípidos'] },
  { pregunta:'¿Cuál de las siguientes es una molécula orgánica presente en la célula?', correcta:'Las proteínas', opts:['El agua','Las sales minerales','El oxígeno'] },
  { pregunta:'¿Cómo se llama el conjunto de reacciones químicas que realiza la célula para obtener energía?', correcta:'Metabolismo', opts:['Fotosíntesis','Ósmosis exclusiva','Mitosis'] },
  { pregunta:'Un trabajador de una planta procesadora de alimentos necesita entender por qué las células de una fruta se deshidratan al ponerle sal. ¿Qué proceso celular explica esto?', correcta:'El intercambio de agua a través de la membrana celular', opts:['La división celular','La fotosíntesis','La respiración pulmonar'] },
  { pregunta:'¿Cuál de las siguientes es una sal mineral, una molécula inorgánica importante para el funcionamiento celular?', correcta:'El sodio', opts:['La glucosa','Las proteínas','Los lípidos'] },
  { pregunta:'¿Qué parte de la célula contiene el citoplasma y las demás estructuras internas?', correcta:'La membrana celular', opts:['El núcleo únicamente','Solo el ADN','Ninguna estructura las contiene'] },
];
export function genCelulaMetabolismoEpjaM1Round(){
  const item = pick(CELULA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_CELULA_METABOLISMO_M1,
  };
}

/* ---------------- Sistemas de Nutrición y Salud ---------------- */
const RECURSO_SISTEMAS_NUTRICION_M1 = 'Los sistemas <b>digestivo</b>, <b>respiratorio</b>, <b>circulatorio</b> y <b>excretor</b> trabajan de forma coordinada en el proceso de nutrición: el digestivo descompone los alimentos, el respiratorio capta oxígeno, el circulatorio distribuye nutrientes y oxígeno a todo el cuerpo mediante la sangre, y el excretor elimina los desechos. A nivel capilar ocurre el <b>intercambio gaseoso</b> (oxígeno y dióxido de carbono) y la distribución de nutrientes hacia los tejidos, lo que produce la energía que el cuerpo necesita. Una <b>dieta equilibrada</b>, que aporte las cantidades adecuadas de cada nutriente, es clave para mantener este proceso funcionando bien.';
const NUTRICION_M1_BANK = [
  { pregunta:'¿Qué sistema del cuerpo humano se encarga de descomponer los alimentos en nutrientes?', correcta:'El sistema digestivo', opts:['El sistema respiratorio','El sistema circulatorio','El sistema excretor'] },
  { pregunta:'¿Qué sistema se encarga de captar el oxígeno del aire?', correcta:'El sistema respiratorio', opts:['El sistema digestivo','El sistema excretor','El sistema nervioso'] },
  { pregunta:'¿Qué sistema distribuye los nutrientes y el oxígeno a todo el cuerpo a través de la sangre?', correcta:'El sistema circulatorio', opts:['El sistema digestivo','El sistema respiratorio','El sistema excretor'] },
  { pregunta:'¿Qué sistema se encarga de eliminar los desechos del organismo?', correcta:'El sistema excretor', opts:['El sistema digestivo','El sistema circulatorio','El sistema respiratorio'] },
  { pregunta:'¿Dónde ocurre el intercambio de oxígeno y dióxido de carbono entre la sangre y los tejidos?', correcta:'A nivel de los capilares sanguíneos', opts:['En el estómago','En los riñones','En el hígado'] },
  { pregunta:'Un adulto que trabaja jornadas largas de pie nota que su alimentación no le da energía suficiente durante el día. ¿Qué concepto explica mejor la solución a este problema?', correcta:'Llevar una dieta equilibrada que aporte los nutrientes necesarios', opts:['Dejar de comer durante el día','Comer solo un tipo de alimento','Aumentar solo el consumo de agua'] },
  { pregunta:'¿Qué producto final del metabolismo se elimina principalmente a través de la respiración?', correcta:'El dióxido de carbono', opts:['La urea','La bilis','La glucosa'] },
  { pregunta:'¿Qué órgano del sistema excretor filtra la sangre para producir la orina?', correcta:'El riñón', opts:['El hígado','El pulmón','El estómago'] },
  { pregunta:'Una persona que hace ejercicio intenso respira más rápido. ¿Qué sistema aumenta su actividad para responder a esa mayor demanda de oxígeno?', correcta:'El sistema circulatorio, distribuyendo más oxígeno a los músculos', opts:['El sistema excretor, eliminando más orina de inmediato','El sistema digestivo, procesando alimentos más rápido','Ningún sistema responde a esta demanda'] },
];
export function genSistemasNutricionEpjaM1Round(){
  const item = pick(NUTRICION_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SISTEMAS_NUTRICION_M1,
  };
}

/* ---------------- Ecosistemas y Biodiversidad ---------------- */
const RECURSO_ECOSISTEMAS_M1 = 'Una <b>población</b> es un grupo de individuos de la misma especie que viven en un lugar; una <b>comunidad</b> reúne varias poblaciones distintas que conviven en el mismo espacio; un <b>ecosistema</b> incluye a la comunidad junto con el ambiente físico que la rodea (agua, suelo, clima); y la <b>biodiversidad</b> es la variedad de especies presentes en un ecosistema. Todos los seres vivos son <b>interdependientes</b>: dependen unos de otros para alimentarse, reproducirse y sobrevivir, por lo que la acción humana (contaminación, deforestación, sobreexplotación) puede alterar gravemente este equilibrio, afectando la conservación del medioambiente.';
const ECOSISTEMAS_M1_BANK = [
  { pregunta:'¿Cómo se llama un grupo de individuos de la misma especie que viven en un mismo lugar?', correcta:'Población', opts:['Comunidad','Ecosistema','Biodiversidad'] },
  { pregunta:'¿Cómo se llama el conjunto de distintas poblaciones que conviven en un mismo espacio?', correcta:'Comunidad', opts:['Población','Ecosistema','Hábitat'] },
  { pregunta:'¿Qué término incluye a la comunidad de seres vivos junto con su ambiente físico (agua, suelo, clima)?', correcta:'Ecosistema', opts:['Población','Especie','Biodiversidad'] },
  { pregunta:'¿Cómo se llama la variedad de especies presentes en un ecosistema?', correcta:'Biodiversidad', opts:['Población','Comunidad','Metabolismo'] },
  { pregunta:'Un río que abastece de agua a un pueblo comienza a recibir desechos de una fábrica cercana, y los peces empiezan a desaparecer. ¿Qué concepto explica este efecto en cadena?', correcta:'La interdependencia de los seres vivos con su ambiente', opts:['La fotosíntesis de las plantas','El metabolismo celular','La reproducción asexual'] },
  { pregunta:'¿Cuál de las siguientes acciones humanas ayuda a la conservación de un ecosistema?', correcta:'Reforestar áreas degradadas y controlar la contaminación', opts:['Aumentar la tala sin control','Verter desechos industriales en los ríos','Sobreexplotar los recursos pesqueros'] },
  { pregunta:'Todas las truchas que viven en un mismo lago pertenecen a la misma especie. ¿Qué nombre recibe ese conjunto?', correcta:'Población', opts:['Ecosistema','Biodiversidad','Metabolismo'] },
  { pregunta:'Un área protegida que alberga cientos de especies distintas de plantas y animales se describe como un lugar con alta:', correcta:'Biodiversidad', opts:['Población única','Metabolismo acelerado','Reacción química'] },
];
export function genEcosistemasBiodiversidadEpjaM1Round(){
  const item = pick(ECOSISTEMAS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ECOSISTEMAS_M1,
  };
}

/* ---------------- Movimiento, Ondas y Óptica ---------------- */
const RECURSO_MOVIMIENTO_ONDAS_M1 = 'El <b>movimiento rectilíneo</b> ocurre en línea recta, y el <b>movimiento circular</b> ocurre en torno a un punto fijo. Las <b>ondas sonoras</b> se originan por la vibración de un objeto y necesitan un medio material para propagarse, mientras que las <b>ondas luminosas</b> pueden viajar incluso en el vacío. La <b>ley de reflexión de la luz</b> explica cómo esta rebota en una superficie, y el <b>ojo humano</b> funciona como un instrumento óptico: cuando falla su enfoque se producen defectos de visión como la miopía (dificultad para ver de lejos) o la hipermetropía (dificultad para ver de cerca).';
const MOVIMIENTO_ONDAS_M1_BANK = [
  { pregunta:'Un auto que avanza en línea recta por una carretera sin curvas, ¿qué tipo de movimiento describe?', correcta:'Movimiento rectilíneo', opts:['Movimiento circular','Movimiento de rotación planetaria','Ninguno de los anteriores'] },
  { pregunta:'Las aspas de un ventilador girando en torno a su eje, ¿qué tipo de movimiento describen?', correcta:'Movimiento circular', opts:['Movimiento rectilíneo','Movimiento de caída libre','Ninguno de los anteriores'] },
  { pregunta:'¿Qué necesita el sonido para poder propagarse de un lugar a otro?', correcta:'Un medio material (como el aire o el agua)', opts:['Solo el vacío','Solo la luz solar','No necesita ningún medio'] },
  { pregunta:'A diferencia del sonido, ¿en qué medio puede propagarse la luz además de en materiales como el aire o el agua?', correcta:'En el vacío', opts:['Solo en sólidos','Solo bajo el agua','No puede propagarse en ningún medio'] },
  { pregunta:'Un espejo refleja la imagen de quien se para frente a él siguiendo un principio físico. ¿Cómo se llama ese principio?', correcta:'La ley de reflexión de la luz', opts:['La ley de la gravedad','El principio de flotación','La conservación de la energía'] },
  { pregunta:'Una persona que no logra ver con claridad los objetos lejanos, pero sí los cercanos, presenta un defecto de visión llamado:', correcta:'Miopía', opts:['Hipermetropía','Sordera','Daltonismo'] },
  { pregunta:'Una persona que no logra ver con claridad los objetos cercanos, pero sí los lejanos, presenta un defecto de visión llamado:', correcta:'Hipermetropía', opts:['Miopía','Sordera','Astigmatismo no relacionado'] },
  { pregunta:'Una piedra que cae directamente al fondo de un pozo, ¿qué tipo de movimiento describe?', correcta:'Movimiento rectilíneo', opts:['Movimiento circular','Movimiento ondulatorio','Ninguno de los anteriores'] },
  { pregunta:'¿Qué instrumento óptico usan muchas personas para corregir defectos de visión como la miopía o la hipermetropía?', correcta:'Lentes o anteojos', opts:['Un termómetro','Un altavoz','Una balanza'] },
];
export function genMovimientoOndasOpticaEpjaM1Round(){
  const item = pick(MOVIMIENTO_ONDAS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_MOVIMIENTO_ONDAS_M1,
  };
}

/* ---------------- Energía, Trabajo y Calor ---------------- */
const RECURSO_ENERGIA_CALOR_M1 = 'El <b>trabajo</b> (en física) se realiza cuando una fuerza logra desplazar un objeto; el <b>roce</b> es una fuerza que se opone al movimiento y genera calor. El <b>calor</b> es energía que se transfiere de un cuerpo más caliente a uno más frío, mientras que la <b>temperatura</b> mide qué tan caliente o frío está un cuerpo. El <b>principio de conservación de la energía</b> establece que la energía no se crea ni se destruye, solo se transforma de una forma a otra (por ejemplo, de energía eléctrica a energía calórica en una estufa).';
const ENERGIA_CALOR_M1_BANK = [
  { pregunta:'¿Cuándo se realiza trabajo, en el sentido físico del término?', correcta:'Cuando una fuerza logra desplazar un objeto', opts:['Cuando un objeto permanece quieto','Solo cuando una persona se cansa','Nunca se puede medir'] },
  { pregunta:'¿Qué fuerza se opone al movimiento de un objeto y genera calor al frotarse dos superficies?', correcta:'El roce', opts:['La gravedad','El magnetismo','La electricidad estática'] },
  { pregunta:'¿Qué mide la temperatura de un cuerpo?', correcta:'Qué tan caliente o frío está el cuerpo', opts:['La cantidad de materia que tiene','Su peso exacto','Su velocidad de movimiento'] },
  { pregunta:'¿Cómo se llama la energía que se transfiere de un cuerpo más caliente a uno más frío?', correcta:'Calor', opts:['Temperatura','Masa','Volumen'] },
  { pregunta:'Una estufa eléctrica transforma la energía eléctrica en otro tipo de energía para calentar una habitación. ¿Qué principio físico describe esta transformación sin que la energía se pierda?', correcta:'El principio de conservación de la energía', opts:['La ley de la gravedad','El principio de Arquímedes','La ley de reflexión de la luz'] },
  { pregunta:'Al frotarse las manos rápidamente en un día de frío, ¿qué fenómeno explica que se sientan más calientes?', correcta:'El roce transforma energía de movimiento en calor', opts:['La luz del sol las calienta directamente','El sonido genera calor','La gravedad aumenta la temperatura'] },
  { pregunta:'Un carpintero empuja una caja pesada por el suelo hasta moverla un metro. ¿Qué se realizó sobre la caja, en términos físicos?', correcta:'Trabajo', opts:['Solo calor','Solo temperatura','Ninguna de las anteriores'] },
  { pregunta:'Dos tazas de agua a distinta temperatura se ponen en contacto. ¿Hacia dónde fluye el calor entre ellas?', correcta:'Desde la taza más caliente hacia la más fría', opts:['Desde la más fría hacia la más caliente','El calor no se transfiere entre líquidos','En ambas direcciones por igual'] },
];
export function genEnergiaCalorEpjaM1Round(){
  const item = pick(ENERGIA_CALOR_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ENERGIA_CALOR_M1,
  };
}

/* ---------------- Disoluciones y Reacciones Químicas ---------------- */
const RECURSO_DISOLUCIONES_M1 = 'Una <b>disolución</b> se forma al mezclar un <b>soluto</b> (lo que se disuelve, en menor cantidad) en un <b>solvente</b> (donde se disuelve, en mayor cantidad); su <b>concentración</b> se puede expresar en porcentaje, en volumen o en molaridad. Los <b>ácidos</b> y las <b>bases</b> tienen propiedades opuestas medidas por el <b>pH</b>, y al mezclarse ocurre una <b>reacción de neutralización</b>. Las reacciones de <b>óxido-reducción</b> ocurren cuando una sustancia gana electrones y otra los pierde (por ejemplo, en la oxidación de un metal). La <b>velocidad de una reacción química</b> depende de factores como la temperatura y la concentración, y la <b>combustión</b> es una reacción química común en la vida cotidiana, como al quemar gas o madera.';
const DISOLUCIONES_M1_BANK = [
  { pregunta:'En una disolución de azúcar en agua, ¿cómo se le llama al azúcar?', correcta:'Soluto', opts:['Solvente','Precipitado','Catalizador'] },
  { pregunta:'En una disolución de azúcar en agua, ¿cómo se le llama al agua?', correcta:'Solvente', opts:['Soluto','Precipitado','Catalizador'] },
  { pregunta:'¿Qué escala se usa para medir si una sustancia es ácida o básica?', correcta:'La escala de pH', opts:['La escala Richter','La escala Celsius','La escala de Mohs'] },
  { pregunta:'¿Cómo se llama la reacción que ocurre al mezclar un ácido con una base en las proporciones adecuadas?', correcta:'Reacción de neutralización', opts:['Reacción de combustión','Fotosíntesis','Destilación'] },
  { pregunta:'Cuando un clavo de fierro se oxida al estar expuesto al aire húmedo, ¿qué tipo de reacción ocurre?', correcta:'Una reacción de óxido-reducción', opts:['Una reacción de neutralización','Una reacción de fotosíntesis','Ninguna reacción química'] },
  { pregunta:'¿Qué factor puede aumentar la velocidad de una reacción química?', correcta:'Aumentar la temperatura', opts:['Disminuir la temperatura a cero','Retirar todos los reactivos','Aislar la reacción del aire'] },
  { pregunta:'Quemar gas en una cocina para cocinar los alimentos es un ejemplo de:', correcta:'Una reacción de combustión', opts:['Una reacción de neutralización','Una disolución simple','Un cambio de estado físico'] },
  { pregunta:'Al preparar un jugo en polvo, disolviéndolo en agua fría o en agua tibia, ¿en cuál se disuelve más rápido el polvo?', correcta:'En agua tibia, porque la mayor temperatura aumenta la solubilidad', opts:['En agua fría, porque el frío disuelve más rápido','Se disuelve igual de rápido en ambas','No se disuelve en ninguna de las dos'] },
];
export function genDisolucionesReaccionesEpjaM1Round(){
  const item = pick(DISOLUCIONES_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_DISOLUCIONES_M1,
  };
}

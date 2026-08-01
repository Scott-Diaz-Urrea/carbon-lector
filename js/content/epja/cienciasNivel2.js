import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Básica: Ciencias Naturales ----------------
   Mismo marco que lenguajeNivel2.js/matematicaNivel2.js: Nivel 2 Básica equivale a 5°-6°
   básico, fuente real "Temario Segundo Nivel de Educación Básica", Decreto Supremo N°257
   de 2009 (epja.mineduc.cl, versión 2026 1er semestre). El subsector "NB2 Ciencias
   Naturales" es el más extenso del temario combinado: agrupa biología (clasificación de
   seres vivos en unicelulares/pluricelulares y en los 5 reinos -animal, planta, fungi,
   protista, monera-, concepto de especie/ecosistema, cadenas alimenticias,
   interdependencia, factores bióticos/abióticos, intervención humana sobre el
   ecosistema), nutrición (sistema digestivo, hábitos alimenticios y necesidades
   nutricionales según edad, interpretación de tablas/gráficos de curvas nutricionales),
   astronomía (sol, planetas y sus movimientos -día/noche, estaciones-, estructura del
   universo -galaxias, Vía Láctea-, origen del universo -Big Bang-, tipos de estrellas), y
   química/física de materiales (propiedades de materiales comunes -flotabilidad,
   combustibilidad, conductividad térmica/eléctrica, resistencia-, estados de la materia y
   sus transformaciones -curvas de calentamiento/enfriamiento-, cambios de estado del
   agua, sustancias puras vs. mezclas homogéneas/heterogéneas y sus métodos de separación,
   aguas de diferente origen, dureza del agua, suelos y su dinámica geológica,
   contaminación del aire, solubilidad).
   Dada la densidad del temario, los 5 módulos de este archivo agrupan por área temática:
   Seres Vivos y Ecosistemas (biología), Nutrición y Sistema Digestivo, Sistema Solar y
   Universo (astronomía), Materiales y Estados de la Materia, y Mezclas, Agua y Suelo
   (química/física de materiales, en 2 módulos separados dada la cantidad de objetivos).
   Ningún objetivo de NB2 Ciencias Naturales queda fuera del motor de opción múltiple.
   Mismo criterio que el resto de EPJA: contextos de vida adulta cuando el objetivo lo
   permite (huertos, trabajo agrícola, salud), y contenido puramente factual/observable
   cuando el objetivo es científico general (astronomía, estados de la materia). */

export const CIENCIAS_EPJA_N2_MODULES = [
  {id:'seresVivosEcosistemasEpjaN2', label:'Seres Vivos y Ecosistemas', open:true, key:'seresVivosEcosistemasEpjaN2'},
  {id:'nutricionEpjaN2', label:'Nutrición y Sistema Digestivo', open:true, key:'nutricionEpjaN2'},
  {id:'sistemaSolarUniversoEpjaN2', label:'Sistema Solar y Universo', open:true, key:'sistemaSolarUniversoEpjaN2'},
  {id:'materiaEstadosEpjaN2', label:'Materiales y Estados de la Materia', open:true, key:'materiaEstadosEpjaN2'},
  {id:'mezclasAguaSueloEpjaN2', label:'Mezclas, Agua y Suelo', open:true, key:'mezclasAguaSueloEpjaN2'},
];
export const CIENCIAS_EPJA_N2_POS = [{x:24,y:88},{x:70,y:68},{x:24,y:48},{x:70,y:28},{x:24,y:8}];

const RECURSO_SERES_VIVOS_N2 = 'Los seres vivos se pueden clasificar de varias formas: según su número de células, en <b>unicelulares</b> (formados por una sola célula, como las bacterias) o <b>pluricelulares</b> (formados por muchas células especializadas, como los animales y las plantas); y según sus características generales, en 5 grandes <b>reinos</b>: Animal, Planta, Fungi (hongos), Protista (como las amebas y algas unicelulares) y Monera (bacterias). Dentro de un <b>ecosistema</b>, los seres vivos se relacionan entre sí formando <b>cadenas alimenticias</b> (el pasto es productor, el conejo que lo come es consumidor primario, y el zorro que come al conejo es consumidor secundario) y dependen tanto de <b>factores bióticos</b> (otros seres vivos) como de <b>factores abióticos</b> (el agua, la temperatura, la luz). La intervención humana —sobreexplotación, contaminación, o medidas de protección como las áreas protegidas— puede alterar ese equilibrio.';
const CELULAR_N2_BANK = [
  { nombre:'La bacteria', tipo:'Unicelular' }, { nombre:'La ameba', tipo:'Unicelular' },
  { nombre:'La levadura', tipo:'Unicelular' }, { nombre:'El perro', tipo:'Pluricelular' },
  { nombre:'El árbol', tipo:'Pluricelular' }, { nombre:'El ser humano', tipo:'Pluricelular' },
  { nombre:'El alga unicelular', tipo:'Unicelular' }, { nombre:'La gallina', tipo:'Pluricelular' },
];
const REINO_N2_BANK = [
  { nombre:'El perro', reino:'Animal' }, { nombre:'El pino', reino:'Planta' },
  { nombre:'El champiñón', reino:'Fungi (hongos)' }, { nombre:'La ameba', reino:'Protista' },
  { nombre:'La bacteria E. coli', reino:'Monera' }, { nombre:'El elefante', reino:'Animal' },
  { nombre:'El helecho', reino:'Planta' }, { nombre:'El moho del pan', reino:'Fungi (hongos)' },
];
const REINOS_TODOS = ['Animal','Planta','Fungi (hongos)','Protista','Monera'];
const ECOSISTEMA_N2_BANK = [
  { pregunta:'En una pradera, el pasto es comido por el conejo, y el conejo es comido por el zorro. ¿Qué rol cumple el pasto en esta cadena alimenticia?', correcta:'Productor: fabrica su propio alimento', opts:['Consumidor primario','Consumidor secundario','Descomponedor'] },
  { pregunta:'En esa misma cadena (pasto → conejo → zorro), ¿qué rol cumple el conejo?', correcta:'Consumidor primario: se alimenta de un productor', opts:['Productor','Consumidor secundario','Descomponedor'] },
  { pregunta:'En esa misma cadena (pasto → conejo → zorro), ¿qué rol cumple el zorro?', correcta:'Consumidor secundario: se alimenta de otro consumidor', opts:['Productor','Consumidor primario','Descomponedor'] },
  { pregunta:'¿Cuál de estos es un factor ABIÓTICO (sin vida) de un ecosistema?', correcta:'La temperatura del agua', opts:['Los peces del lago','Las algas del lago','Las aves que viven cerca'] },
  { pregunta:'¿Cuál de estos es un factor BIÓTICO (con vida) de un ecosistema?', correcta:'Las plantas del lugar', opts:['La luz solar','La temperatura del aire','Las rocas del terreno'] },
  { pregunta:'¿Qué medida ayuda a proteger un ecosistema de la sobreexplotación pesquera?', correcta:'Establecer vedas y cuotas de pesca', opts:['Pescar sin ningún límite','Eliminar las áreas protegidas','Ignorar las especies en riesgo'] },
  { pregunta:'¿Qué significa que dos especies sean "interdependientes" dentro de un ecosistema?', correcta:'Que una depende de la otra para sobrevivir, o ambas se necesitan mutuamente', opts:['Que compiten sin ninguna relación real','Que nunca se encuentran en el mismo lugar','Que una de las dos no necesita nada del entorno'] },
  { pregunta:'¿Qué le puede ocurrir a un ecosistema si desaparece uno de sus factores bióticos clave, como el depredador principal?', correcta:'Puede desequilibrarse, por ejemplo aumentando en exceso la población de sus presas', opts:['No pasa nada, el ecosistema no depende de eso','El ecosistema mejora automáticamente','Todos los demás seres vivos desaparecen también'] },
];
export function genSeresVivosEcosistemasEpjaN2Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(CELULAR_N2_BANK);
    const opts = shuffle(['Unicelular','Pluricelular']).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.nombre+' ¿es un organismo unicelular o pluricelular?</p>',
      options: opts, correctValue: item.tipo, speakText: item.nombre+', ¿es unicelular o pluricelular?', cols:2, panel:true,
      explain: item.nombre+' es un organismo <b>'+item.tipo.toLowerCase()+'</b>.',
      recurso: RECURSO_SERES_VIVOS_N2,
    };
  }
  if(roll<0.67){
    const item = pick(REINO_N2_BANK);
    const distract = shuffle(REINOS_TODOS.filter(function(r){ return r!==item.reino; })).slice(0,3);
    const opts = shuffle([item.reino].concat(distract)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">¿A qué reino pertenece '+item.nombre.toLowerCase()+'?</p>',
      options: opts, correctValue: item.reino, speakText: '¿A qué reino pertenece '+item.nombre.toLowerCase()+'?', cols:2, panel:true,
      explain: item.nombre+' pertenece al reino <b>'+item.reino+'</b>.',
      recurso: RECURSO_SERES_VIVOS_N2,
    };
  }
  const item = pick(ECOSISTEMA_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SERES_VIVOS_N2,
  };
}

const RECURSO_NUTRICION_N2 = 'El <b>sistema digestivo</b> transforma los alimentos en sustancias que el cuerpo puede aprovechar, a través de órganos como la boca, el esófago, el estómago, el intestino delgado y el intestino grueso, cada uno con una función específica en ese proceso. Las <b>necesidades nutricionales</b> varían según la edad, el nivel de actividad física y otros factores personales: un niño en crecimiento, un adulto que trabaja físicamente, y un adulto mayor tienen requerimientos distintos de energía y nutrientes. Una <b>dieta equilibrada</b> combina los distintos grupos de alimentos en las proporciones adecuadas para cubrir esas necesidades. Los profesionales de la salud usan <b>tablas y gráficos</b> (relacionando edad, peso, talla o actividad física con necesidades nutricionales) para evaluar si una persona está dentro de rangos saludables.';
const SISTEMA_DIGESTIVO_N2_BANK = [
  { pregunta:'¿En qué órgano comienza la digestión de los alimentos, gracias a la masticación y la saliva?', correcta:'La boca', opts:['El estómago','El intestino delgado','El esófago'] },
  { pregunta:'¿Qué órgano conecta la boca con el estómago, transportando el alimento?', correcta:'El esófago', opts:['El intestino grueso','El hígado','La tráquea'] },
  { pregunta:'¿En qué órgano los alimentos se mezclan con ácidos y jugos digestivos para descomponerse aún más?', correcta:'El estómago', opts:['La boca','El intestino grueso','El esófago'] },
  { pregunta:'¿En qué parte del sistema digestivo se absorbe la mayoría de los nutrientes hacia la sangre?', correcta:'El intestino delgado', opts:['La boca','El esófago','El intestino grueso'] },
  { pregunta:'¿Qué función cumple el intestino grueso en la digestión?', correcta:'Absorbe agua y forma los desechos sólidos', opts:['Inicia la digestión con la saliva','Descompone el alimento con ácido','Transporta el alimento hacia el estómago'] },
  { pregunta:'¿Por qué las necesidades nutricionales de un niño en crecimiento son distintas a las de un adulto mayor?', correcta:'Porque el cuerpo en crecimiento requiere más energía y nutrientes para desarrollarse', opts:['Porque los niños comen menos que los adultos mayores','Porque no hay ninguna diferencia real entre ambos','Porque los adultos mayores necesitan siempre más calorías'] },
  { pregunta:'¿Qué caracteriza a una dieta equilibrada?', correcta:'Combina distintos grupos de alimentos en las proporciones adecuadas', opts:['Se basa en un solo tipo de alimento','Elimina por completo las grasas y los carbohidratos','Depende únicamente de suplementos vitamínicos'] },
  { pregunta:'Si una persona aumenta su actividad física diaria, ¿qué suele ocurrir con sus necesidades energéticas?', correcta:'Aumentan, ya que el cuerpo gasta más energía', opts:['Disminuyen siempre','Se mantienen exactamente iguales','Desaparecen por completo'] },
  { pregunta:'¿Qué información entrega comparar el peso y la talla de una persona en una tabla o gráfico de crecimiento?', correcta:'Si su desarrollo está dentro de rangos considerados saludables para su edad', opts:['Su color de ojos','Su lugar de nacimiento','Su nivel de estudios'] },
  { pregunta:'¿Por qué es importante variar los tipos de alimentos en la dieta diaria en vez de repetir siempre los mismos?', correcta:'Porque distintos alimentos aportan distintos nutrientes que el cuerpo necesita', opts:['Porque así la comida siempre cuesta menos','Porque el cuerpo se aburre de comer lo mismo','Porque no tiene ninguna relación con la salud'] },
];
export function genNutricionEpjaN2Round(){
  const item = pick(SISTEMA_DIGESTIVO_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_NUTRICION_N2,
  };
}

const RECURSO_SISTEMA_SOLAR_N2 = 'El <b>Sol</b> es una estrella que aporta la luz y el calor que hacen posible la vida en la Tierra, y los <b>planetas</b> (incluida la Tierra) giran a su alrededor en un movimiento llamado <b>traslación</b>. La Tierra también gira sobre su propio eje, un movimiento llamado <b>rotación</b>, que produce el ciclo de día y noche; y su inclinación mientras se traslada alrededor del Sol produce las <b>estaciones del año</b>. El sistema solar, a su vez, forma parte de una <b>galaxia</b> llamada Vía Láctea, una entre miles de millones de galaxias que forman el <b>universo</b>. La teoría científica actual más aceptada sobre el origen del universo es la del <b>Big Bang</b>, que explica su expansión desde un estado inicial extremadamente denso y caliente. Las <b>estrellas</b> nacen, evolucionan y mueren de formas distintas según su tamaño, y en su interior se forman muchos de los elementos químicos del universo.';
const SISTEMA_SOLAR_N2_BANK = [
  { pregunta:'¿Qué astro se encuentra en el centro del sistema solar?', correcta:'El Sol', opts:['La Luna','La Tierra','Júpiter'] },
  { pregunta:'¿Cómo se llama el movimiento que hace la Tierra alrededor del Sol?', correcta:'Traslación', opts:['Rotación','Órbita lunar','Gravitación'] },
  { pregunta:'¿Cómo se llama el movimiento que hace la Tierra sobre su propio eje?', correcta:'Rotación', opts:['Traslación','Eclipse','Fase lunar'] },
  { pregunta:'¿Qué fenómeno se produce por la rotación de la Tierra sobre su propio eje?', correcta:'El ciclo de día y noche', opts:['Las estaciones del año','Las mareas del océano','Los eclipses de sol'] },
  { pregunta:'¿Qué produce principalmente las estaciones del año?', correcta:'La inclinación del eje de la Tierra mientras se traslada alrededor del Sol', opts:['La rotación diaria de la Tierra','La cercanía de la Luna','El color del cielo'] },
  { pregunta:'¿Cómo se llama la galaxia a la que pertenece nuestro sistema solar?', correcta:'Vía Láctea', opts:['Andrómeda','Osa Mayor','Cinturón de Kuiper'] },
  { pregunta:'¿Cuál es la teoría científica más aceptada sobre el origen del universo?', correcta:'La teoría del Big Bang', opts:['La teoría del universo estático','La teoría geocéntrica','La teoría de la Tierra plana'] },
  { pregunta:'Según la teoría del Big Bang, ¿qué ha ocurrido con el universo desde su origen?', correcta:'Se ha estado expandiendo', opts:['Se ha mantenido exactamente del mismo tamaño','Se ha ido reduciendo constantemente','Ha desaparecido y vuelto a aparecer'] },
  { pregunta:'¿Dónde se forman muchos de los elementos químicos del universo?', correcta:'En el interior de las estrellas', opts:['En el vacío del espacio','Solo en los planetas','Únicamente en la Tierra'] },
  { pregunta:'¿Qué característica distingue a las estrellas de mayor tamaño respecto a su evolución?', correcta:'Tienen una vida más corta y terminan de forma más violenta', opts:['Nunca cambian con el tiempo','Siempre son las más frías','Nunca producen elementos químicos'] },
  { pregunta:'¿Qué es una galaxia?', correcta:'Un enorme conjunto de estrellas, gas y polvo unidos por la gravedad', opts:['Un solo planeta muy grande','Una nube de lluvia','Un tipo de cometa'] },
];
export function genSistemaSolarUniversoEpjaN2Round(){
  const item = pick(SISTEMA_SOLAR_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_SISTEMA_SOLAR_N2,
  };
}

const RECURSO_MATERIA_N2 = 'Los materiales tienen propiedades que se pueden observar y comparar: la <b>flotabilidad</b> (si flotan o se hunden en el agua), la <b>combustibilidad</b> (si arden con facilidad), la <b>conductividad térmica y eléctrica</b> (si permiten el paso del calor o la electricidad), y la <b>resistencia</b> (si soportan fuerza sin romperse). Sustancias como los <b>hidratos de carbono</b>, las <b>grasas</b> y las <b>proteínas</b> también tienen propiedades distintas frente al agua y al aire. La materia existe en tres <b>estados</b> principales —sólido, líquido y gaseoso— y puede cambiar de un estado a otro al ganar o perder calor (fusión, evaporación, condensación, solidificación), lo que se puede representar en una <b>curva de calentamiento o enfriamiento</b> (temperatura versus tiempo). El agua, en particular, cambia de estado a temperaturas específicas (se congela a 0°C y hierve a 100°C al nivel del mar), y esos cambios ayudan a regular la temperatura del planeta.';
const PROPIEDAD_MATERIAL_N2_BANK = [
  { pregunta:'¿Cuál de estos materiales es un buen conductor eléctrico?', correcta:'El cobre', opts:['La madera seca','El plástico','El vidrio'] },
  { pregunta:'¿Cuál de estos materiales flota en el agua?', correcta:'El corcho', opts:['El hierro','La piedra','El vidrio macizo'] },
  { pregunta:'¿Cuál de estos materiales tiene alta combustibilidad (arde con facilidad)?', correcta:'El papel', opts:['El agua','La roca','El metal'] },
  { pregunta:'¿Cuál de estos materiales es mejor conductor del calor?', correcta:'El metal', opts:['La madera','La lana','El corcho'] },
  { pregunta:'¿Cuál de estos materiales ofrece mayor resistencia al romperse bajo fuerza?', correcta:'El acero', opts:['El papel','El vidrio delgado','La espuma'] },
];
const ESTADOS_MATERIA_N2_BANK = [
  { pregunta:'¿Cómo se llama el cambio de estado en que un sólido pasa a líquido al recibir calor?', correcta:'Fusión', opts:['Evaporación','Condensación','Solidificación'] },
  { pregunta:'¿Cómo se llama el cambio de estado en que un líquido pasa a gas al recibir calor?', correcta:'Evaporación', opts:['Fusión','Solidificación','Condensación'] },
  { pregunta:'¿Cómo se llama el cambio de estado en que un gas pasa a líquido al perder calor?', correcta:'Condensación', opts:['Fusión','Evaporación','Solidificación'] },
  { pregunta:'¿Cómo se llama el cambio de estado en que un líquido pasa a sólido al perder calor?', correcta:'Solidificación', opts:['Fusión','Evaporación','Condensación'] },
  { pregunta:'¿A qué temperatura aproximada se congela el agua al nivel del mar?', correcta:'0°C', opts:['100°C','50°C','-50°C'] },
  { pregunta:'¿A qué temperatura aproximada hierve el agua al nivel del mar?', correcta:'100°C', opts:['0°C','50°C','200°C'] },
  { pregunta:'En una curva de calentamiento (temperatura versus tiempo), ¿qué ocurre con la temperatura mientras el agua cambia de estado (por ejemplo, mientras hierve)?', correcta:'Se mantiene constante hasta que termina el cambio de estado', opts:['Sube sin ningún límite','Baja bruscamente','Cambia de forma aleatoria'] },
];
export function genMateriaEstadosEpjaN2Round(){
  const roll = Math.random();
  const item = roll<0.4 ? pick(PROPIEDAD_MATERIAL_N2_BANK) : pick(ESTADOS_MATERIA_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_MATERIA_N2,
  };
}

const RECURSO_MEZCLAS_N2 = 'Una <b>sustancia pura</b> está formada por un solo tipo de componente (como el agua destilada o el oxígeno), mientras que una <b>mezcla</b> combina dos o más sustancias distintas: puede ser <b>homogénea</b> (sus componentes no se distinguen a simple vista, como el agua con sal ya disuelta) o <b>heterogénea</b> (sus componentes sí se distinguen, como el agua con arena). Las mezclas heterogéneas se pueden separar con distintos métodos según sus propiedades: <b>tamizado</b> (para separar sólidos de distinto tamaño), <b>decantación</b> (para separar líquidos de distinta densidad, o un líquido de un sólido que se asienta), <b>filtrado</b> (para separar un sólido de un líquido usando un filtro), o el uso de <b>imanes</b> (para separar materiales magnéticos). El <b>agua</b> puede tener distinto origen (potable, de mar, de lluvia) y distinta <b>dureza</b> (según su contenido de minerales), lo que afecta cómo actúan los jabones y detergentes sobre ella. Los <b>suelos</b> se forman y transforman geológicamente con el tiempo, y la <b>contaminación del aire</b> en las ciudades afecta tanto al ambiente como a la salud de las personas.';
const MEZCLAS_N2_BANK = [
  { pregunta:'¿Cuál de estas es una mezcla HOMOGÉNEA (sus componentes no se distinguen a simple vista)?', correcta:'Agua con sal ya disuelta', opts:['Agua con arena','Ensalada de frutas','Agua con aceite'] },
  { pregunta:'¿Cuál de estas es una mezcla HETEROGÉNEA (sus componentes sí se distinguen a simple vista)?', correcta:'Agua con arena', opts:['Agua con sal disuelta','Aire limpio','Agua destilada'] },
  { pregunta:'¿Qué método de separación se usa para separar arena de piedras más grandes, según su tamaño?', correcta:'Tamizado', opts:['Decantación','Filtrado','Uso de imanes'] },
  { pregunta:'¿Qué método de separación se usa para separar limaduras de hierro de arena?', correcta:'Uso de imanes', opts:['Tamizado','Decantación','Evaporación'] },
  { pregunta:'¿Qué método de separación se usa para separar aceite y agua, aprovechando que no se mezclan y tienen distinta densidad?', correcta:'Decantación', opts:['Tamizado','Uso de imanes','Filtrado'] },
  { pregunta:'¿Qué método de separación se usa para separar café molido del agua, usando un filtro de papel?', correcta:'Filtrado', opts:['Tamizado','Uso de imanes','Decantación'] },
  { pregunta:'¿Qué característica define el "agua dura"?', correcta:'Tiene un alto contenido de minerales disueltos', opts:['Está congelada','Tiene un color oscuro','No contiene ningún mineral'] },
  { pregunta:'¿Por qué el jabón hace menos espuma en agua dura que en agua blanda?', correcta:'Porque los minerales del agua dura reaccionan con el jabón y reducen su efecto', opts:['Porque el agua dura está más fría','Porque el agua dura tiene menos cantidad de agua','Porque el jabón se evapora más rápido en agua dura'] },
  { pregunta:'¿Qué proceso describe mejor la formación de un suelo con el paso del tiempo?', correcta:'La roca se descompone gradualmente por el clima y otros factores', opts:['El suelo aparece de un día para otro','El suelo nunca cambia con el tiempo','El suelo se forma solo con agua de lluvia'] },
  { pregunta:'¿Cuál de estas es una fuente común de contaminación del aire en una gran ciudad?', correcta:'El humo de los vehículos y las industrias', opts:['El agua de los ríos','Las plantas de los parques','La luz del sol'] },
];
export function genMezclasAguaSueloEpjaN2Round(){
  const item = pick(MEZCLAS_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_MEZCLAS_N2,
  };
}

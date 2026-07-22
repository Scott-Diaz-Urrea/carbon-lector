import { pick, shuffle } from '../utils.js';

export const TECNOLOGIA_MODULES = [
  {id:'herramientastec', label:'Herramientas y Materiales', open:true, key:'herramientastec'},
];
export const TECNOLOGIA_POS = [{x:48,y:50}];

/* ---------------- Contenido Tecnología 1° Básico ----------------
   OA02-03 -> Herramientas y Materiales. OA01,04,05,06 (diseño propio, evaluación
   de resultados, uso de software real) quedaron fuera por ser procesos prácticos
   que no se resuelven con una pregunta de opción múltiple. */
const HERRAMIENTAS_TEC = [
  { emoji:'✂️', label:'TIJERA', uso:'Sirve para cortar papel, cartón o telas.' },
  { emoji:'📏', label:'REGLA', uso:'Sirve para medir y trazar líneas rectas.' },
  { emoji:'🧴', label:'PEGAMENTO', uso:'Sirve para unir y pegar materiales.' },
  { emoji:'🖊️', label:'LÁPIZ O PLUMÓN', uso:'Sirve para marcar o dibujar sobre el material.' },
  { emoji:'🧵', label:'HILO Y AGUJA', uso:'Sirve para coser o unir telas.' },
  { emoji:'🔨', label:'MARTILLO', uso:'Sirve para clavar o unir piezas de madera.' },
];
/* "CARTÓN" usaba 🧻 (un rollo de papel higiénico/toalla de papel, sin
   relación con el cartón) → 📦 (una caja), ya que las cajas de cartón son
   el ejemplo que el propio texto menciona. */
const MATERIALES_TEC = [
  { emoji:'📄', label:'PAPEL', uso:'Material liviano que se usa para dibujar, doblar o recortar.' },
  { emoji:'📦', label:'CARTÓN', uso:'Material firme, útil para construir maquetas y cajas.' },
  { emoji:'🧶', label:'FIBRAS O LANA', uso:'Material que sirve para tejer o decorar.' },
  { emoji:'♻️', label:'MATERIAL DE RECICLAJE', uso:'Botellas, tapas o cajas que se reutilizan para crear objetos nuevos.' },
];

/* ---------------- Contenido Tecnología 2° Básico ----------------
   Basado en OA del Decreto 439/2012, 2° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/2-basico): TE02 OA05-07 -> Tecnología Digital
   (software de dibujo, procesador de textos, uso seguro de internet).
   Quedan fuera OA01-04 (diseñar, elaborar y evaluar un objeto tecnológico
   propio) por ser procesos prácticos de producción, no aptos para opción
   múltiple. */
export const TECNOLOGIA_MODULES_G2 = [
  {id:'tecdigital2', label:'Tecnología Digital', open:true, key:'tecdigital2'},
];
export const TECNOLOGIA_POS_G2 = [{x:48,y:50}];

/* Ampliado de 4 a 10 ítems — antes garantizaba una repetición en cada
   partida de rounds:8. Todos siguen dentro de TE02 OA05-07 (software de
   dibujo/texto, uso seguro de internet). */
const TEC_DIGITAL_BANK = [
  { emoji:'🖌️', pregunta:'¿Para qué usarías un software de dibujo en el computador?', correcta:'Para crear y representar ideas con imágenes', opts:['Para escuchar música','Para cocinar una receta','Para hacer ejercicio'] },
  { emoji:'⌨️', pregunta:'¿Para qué sirve un procesador de textos?', correcta:'Para crear, editar y guardar información escrita', opts:['Para tomar fotografías','Para dibujar figuras 3D','Para escuchar canciones'] },
  { emoji:'🌐', pregunta:'Antes de usar información de internet, ¿qué debes hacer?', correcta:'Revisar que la fuente sea segura y confiable', opts:['Usar cualquier información sin revisar','Compartir tu contraseña con la página','Ignorar las indicaciones del profesor'] },
  { emoji:'🔒', pregunta:'¿Qué es importante hacer al usar internet de forma segura?', correcta:'Seguir las reglas que da el profesor', opts:['Dar tus datos personales a cualquiera','Descargar cualquier archivo sin revisar','Ignorar las advertencias de seguridad'] },
  { emoji:'📊', pregunta:'¿Para qué usarías un software de presentaciones?', correcta:'Para mostrar ideas en pantalla con imágenes y texto', opts:['Para escuchar música','Para tomar fotografías','Para hacer ejercicio'] },
  { emoji:'🔍', pregunta:'¿Para qué sirve un buscador de internet?', correcta:'Para encontrar información sobre un tema', opts:['Para dibujar figuras','Para escuchar canciones','Para hacer ejercicio'] },
  { emoji:'🔑', pregunta:'¿Qué debes hacer con tu contraseña?', correcta:'Mantenerla en secreto y no compartirla', opts:['Compartirla con cualquiera que la pida','Escribirla en un lugar público','Decírsela a un desconocido en internet'] },
  { emoji:'📧', pregunta:'Si recibes un mensaje de alguien desconocido en internet, ¿qué debes hacer?', correcta:'Contarle a un adulto y no responder', opts:['Responder con tus datos personales','Aceptar todo lo que te pida','Ignorarlo y seguir chateando con esa persona'] },
  { emoji:'🖱️', pregunta:'¿Para qué sirve el mouse (ratón) del computador?', correcta:'Para mover el puntero y seleccionar cosas en la pantalla', opts:['Para escuchar música','Para imprimir documentos','Para conectarse a internet'] },
  { emoji:'💾', pregunta:'¿Por qué es importante guardar tu trabajo en el computador?', correcta:'Para no perder lo que hiciste', opts:['Para que se borre solo','Para que nadie más lo use','Para que el computador se apague'] },
];

export function genTecDigital2Round(){
  const item = pick(TEC_DIGITAL_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

export function genHerramientasTecRound(){
  if(Math.random()<0.5){
    const item = pick(HERRAMIENTAS_TEC);
    const distract = shuffle(HERRAMIENTAS_TEC.filter(function(h){ return h.label!==item.label; })).slice(0,3).map(function(h){ return h.label; });
    const opts = shuffle([item.label].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
      options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
      explain: item.uso+' Esa herramienta es <b>'+item.label.toLowerCase()+'</b>.',
    };
  }
  const item = pick(MATERIALES_TEC);
  const distract = shuffle(MATERIALES_TEC.filter(function(m){ return m.label!==item.label; })).map(function(m){ return m.label; });
  const opts = shuffle([item.label].concat(distract)).map(function(m){ return {label:m, value:m}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.uso+'</p>',
    options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
    explain: item.uso+' Ese material es <b>'+item.label.toLowerCase()+'</b>.',
  };
}

/* ---------------- Contenido Tecnología 3° Básico ----------------
   Basado en OA del Decreto 439/2012, 3° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/3-basico): TE03 OA05-07 -> Tecnología Digital III
   (software de presentaciones, buscadores de internet, seguridad al usar
   internet — contenido nuevo, sin repetir lo ya cubierto por "Tecnología
   Digital" de 2° básico). Quedan fuera OA01-04 (diseñar, planificar,
   elaborar y evaluar un objeto tecnológico propio) por ser un proceso de
   producción práctica, no apto para opción múltiple. */
export const TECNOLOGIA_MODULES_G3 = [
  {id:'tecdigital3', label:'Tecnología Digital III', open:true, key:'tecdigital3'},
];
export const TECNOLOGIA_POS_G3 = [{x:48,y:50}];

const TEC_DIGITAL_3_BANK = [
  { emoji:'📊', pregunta:'¿Para qué usarías un software de presentaciones (diapositivas) en un trabajo escolar?', correcta:'Para organizar y mostrar tus ideas de forma clara con texto e imágenes', opts:['Para cocinar una receta','Para escuchar música','Para hacer ejercicio'] },
  { emoji:'🔍', pregunta:'¿Qué debes hacer antes de usar información que encontraste en un buscador de internet?', correcta:'Revisar que venga de una fuente confiable y segura', opts:['Usarla sin revisar de dónde viene','Copiarla sin leerla','Compartirla sin verificarla'] },
  { emoji:'🔑', pregunta:'¿Qué es lo más seguro hacer con tu contraseña de internet?', correcta:'Mantenerla en secreto y no compartirla con desconocidos', opts:['Compartirla con cualquiera','Escribirla en un lugar público','Usar la misma que otra persona'] },
  { emoji:'📧', pregunta:'Si alguien desconocido te escribe por internet pidiéndote datos personales, ¿qué debes hacer?', correcta:'No responder y contarle a un adulto de confianza', opts:['Darle tus datos si insiste','Responderle con tu dirección','Aceptar ser su amigo sin decirle a nadie'] },
  { emoji:'💻', pregunta:'¿Para qué sirve principalmente un buscador de internet?', correcta:'Para encontrar información sobre un tema específico', opts:['Para escuchar música sin internet','Para imprimir documentos','Para cargar la batería del computador'] },
  { emoji:'⏰', pregunta:'¿Por qué es importante limitar el tiempo frente a pantallas cada día?', correcta:'Para equilibrar el tiempo con otras actividades como jugar y descansar', opts:['Porque las pantallas se gastan si se usan mucho','No es importante, se puede usar sin límite','Porque las pantallas se calientan mucho'] },
  { emoji:'📄', pregunta:'¿Qué opción describe mejor un uso responsable de un procesador de textos para presentar un trabajo?', correcta:'Revisar la ortografía y organizar la información en párrafos claros', opts:['Copiar y pegar sin revisar nada','Escribir todo en una sola línea sin espacios','No revisar el trabajo antes de entregarlo'] },
  { emoji:'🔒', pregunta:'¿Qué debes hacer si una página de internet te pide datos que no te parecen necesarios?', correcta:'Consultar con un adulto antes de ingresar esos datos', opts:['Ingresarlos de inmediato','Ignorar la duda y seguir no más','Compartir la página con desconocidos'] },
];

export function genTecDigital3Round(){
  const item = pick(TEC_DIGITAL_3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

/* ---------------- Contenido Tecnología 4° Básico ----------------
   Basado en OA del Decreto 439/2012, 4° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/4-basico): TE04 OA05-07 -> Tecnología Digital IV.
   OA05 agrega explícitamente "hojas de cálculo" respecto al OA05 de 3°
   básico (que solo mencionaba presentaciones) — contenido nuevo, además de
   preguntas frescas de presentaciones/procesador de texto/seguridad en
   internet distintas de las de 3° básico. Quedan fuera OA01-04 (diseñar/
   planificar/elaborar/evaluar un objeto tecnológico propio — producción
   práctica). */
export const TECNOLOGIA_MODULES_G4 = [
  {id:'tecdigital4', label:'Tecnología Digital IV', open:true, key:'tecdigital4'},
];
export const TECNOLOGIA_POS_G4 = [{x:48,y:50}];

const TEC_DIGITAL_4_BANK = [
  { pregunta:'¿Para qué usarías una hoja de cálculo?', correcta:'Para organizar datos en filas y columnas, y hacer cálculos automáticos', opts:['Para escuchar música','Para tomar fotografías','Para hacer ejercicio'] },
  { pregunta:'¿Qué tipo de información se organiza mejor en una hoja de cálculo?', correcta:'Listas de números y datos, como resultados de una encuesta', opts:['Un dibujo artístico','Una canción','Un video'] },
  { pregunta:'¿Para qué usarías un software de presentaciones en un trabajo grupal?', correcta:'Para mostrar tus ideas en diapositivas con texto e imágenes', opts:['Para hacer cálculos matemáticos','Para escuchar música','Para hacer ejercicio'] },
  { pregunta:'Antes de usar información de un sitio web para una tarea, ¿qué debes evaluar?', correcta:'Si la fuente es confiable y segura', opts:['Solo el color de la página','Cuántos anuncios tiene','Nada, se puede usar cualquier información'] },
  { pregunta:'¿Qué debes hacer si una página web te pide muchos datos personales sin una razón clara?', correcta:'Ser precavido y consultar con un adulto antes de continuar', opts:['Ingresar todos los datos de inmediato','Compartir la página con desconocidos','Ignorar la duda'] },
  { pregunta:'¿Qué elemento de diseño puedes agregar en un procesador de textos para mejorar un documento?', correcta:'Títulos, negritas e imágenes', opts:['Solo texto sin ningún formato','Un video musical','Un juego interactivo'] },
  { pregunta:'¿Por qué es importante guardar tu trabajo con frecuencia mientras usas un computador?', correcta:'Para no perder tu progreso si el programa falla', opts:['Para que el computador se apague','Para que el archivo se borre','No es importante'] },
  { pregunta:'¿Qué debes revisar en un correo electrónico antes de hacer clic en un enlace?', correcta:'Que el remitente sea alguien conocido y confiable', opts:['Solo el color del correo','El día en que fue enviado','No es necesario revisar nada'] },
];

export function genTecDigital4Round(){
  const item = pick(TEC_DIGITAL_4_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

/* ---------------- Contenido Tecnología 5° Básico ----------------
   Basado en OA del Decreto 439/2012, 5° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/5-basico): TE05 OA05-07 -> Tecnología Digital V.
   El texto de estos OA repite casi lo mismo que años anteriores
   (presentaciones ya en 3°, hojas de cálculo ya en 4°, procesador de texto
   ya en 2°, seguridad en internet en 2°-4°), así que el módulo usa
   escenarios completamente nuevos en dos ángulos poco explorados: opciones
   específicas de formato en un procesador de textos (fuentes, alineación,
   inserción de imágenes) y comunicación en línea responsable (compartir
   información de forma respetuosa y cuidando la privacidad de otros), en vez
   de repetir literalmente las mismas preguntas de años anteriores. Quedan
   fuera OA01-04 (diseñar/planificar/elaborar/evaluar un objeto tecnológico
   propio) por ser un proceso de producción práctica. */
export const TECNOLOGIA_MODULES_G5 = [
  {id:'tecdigital5', label:'Tecnología Digital V', open:true, key:'tecdigital5'},
];
export const TECNOLOGIA_POS_G5 = [{x:48,y:50}];

const TEC_DIGITAL_5_BANK = [
  { pregunta:'¿Qué opción de formato usarías en un procesador de textos para destacar un título dentro de un documento?', correcta:'Aumentar el tamaño de la letra y ponerla en negrita', opts:['Escribirlo en el mismo tamaño que el resto del texto','Borrar el título','Escribirlo en un idioma distinto'] },
  { pregunta:'¿Para qué sirve la opción de "alinear texto" (izquierda, centro, derecha) en un procesador de textos?', correcta:'Para ordenar visualmente cómo se ve el texto en la página', opts:['Para cambiar el idioma del documento','Para revisar la ortografía automáticamente','Para enviar el documento por correo'] },
  { pregunta:'¿Qué debes hacer antes de insertar una imagen en un documento de un trabajo escolar?', correcta:'Verificar que la imagen sea adecuada y tenga relación con el contenido', opts:['Insertar cualquier imagen sin revisarla','Poner la imagen más grande posible sin importar el contenido','No es necesario revisar nada'] },
  { pregunta:'¿Qué opción de un procesador de textos ayuda a organizar información en una lista?', correcta:'Usar viñetas o numeración', opts:['Cambiar el color de fondo de toda la página','Insertar un video','Borrar todo el texto'] },
  { pregunta:'Al comunicarte por internet con compañeros de un trabajo grupal, ¿qué es lo más responsable?', correcta:'Compartir solo información relacionada con el trabajo y tratar a todos con respeto', opts:['Compartir información personal de otros sin permiso','Escribir mensajes groseros si alguien no está de acuerdo','Ignorar los mensajes del grupo sin avisar'] },
  { pregunta:'¿Qué debes revisar antes de compartir un documento o presentación en un grupo en línea?', correcta:'Que no incluya datos personales innecesarios, como direcciones o teléfonos', opts:['Que tenga la mayor cantidad de colores posible','Que sea lo más largo posible','No es necesario revisar nada'] },
  { pregunta:'Si un compañero de un grupo en línea comparte información falsa por error, ¿qué es lo más responsable?', correcta:'Avisarle con respeto y ayudar a corregir la información', opts:['Compartir la información falsa a más personas','Burlarte del error frente al grupo','Ignorarlo, no es tu problema'] },
  { pregunta:'¿Qué opción de un procesador de textos ayuda a mostrar información en columnas ordenadas, como nombres y notas?', correcta:'Insertar una tabla', opts:['Cambiar el fondo de toda la página a un color oscuro','Insertar un video musical','Borrar el documento completo'] },
  { pregunta:'¿Para qué sirve revisar la ortografía automática antes de entregar un documento?', correcta:'Para detectar y corregir errores de escritura antes de compartirlo', opts:['Para que el documento se vea con más colores','Para hacerlo más largo','No sirve para nada'] },
];
export function genTecDigital5Round(){
  const item = pick(TEC_DIGITAL_5_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

/* ---------------- Contenido Tecnología 6° Básico ----------------
   Basado en OA del Decreto 439/2012, 6° básico (curriculumnacional.cl/curriculum/
   1o-6o-basico/tecnologia/6-basico): TE06 OA05-07 vuelven a repetir casi el
   mismo texto de años anteriores (software para organizar/comunicar,
   procesador de textos, internet), agregando "revisar" un documento (OA06) y
   "publicar" información (OA07) como matices nuevos. Tecnología Digital VI
   usa escenarios completamente nuevos centrados en esos dos matices: revisar
   y mejorar un documento antes de compartirlo, y publicar información de
   forma responsable en línea. Quedan fuera OA01-04 (diseñar/planificar/
   elaborar/evaluar un objeto o servicio tecnológico propio). */
export const TECNOLOGIA_MODULES_G6 = [
  {id:'tecdigital6', label:'Tecnología Digital VI', open:true, key:'tecdigital6'},
];
export const TECNOLOGIA_POS_G6 = [{x:48,y:50}];

const TEC_DIGITAL_6_BANK = [
  { pregunta:'Antes de entregar un trabajo escrito, ¿qué es importante revisar además de la ortografía?', correcta:'Que las ideas estén ordenadas y sean fáciles de entender', opts:['Que tenga la mayor cantidad de colores posible','Que sea lo más largo posible sin importar el contenido','No es necesario revisar nada más'] },
  { pregunta:'¿Qué significa "publicar" información en internet de forma responsable?', correcta:'Compartir contenido verificado y respetuoso, considerando quién lo va a ver', opts:['Compartir cualquier cosa sin revisarla','Publicar información privada de otras personas sin permiso','Publicar todo lo posible sin pensar en las consecuencias'] },
  { pregunta:'¿Qué deberías hacer antes de publicar una investigación grupal en un blog o sitio del colegio?', correcta:'Revisar que la información sea correcta y que todos los integrantes estén de acuerdo', opts:['Publicarla de inmediato sin que nadie más la revise','Copiar información de internet sin citar la fuente','Publicar solo tu parte, ignorando al resto del grupo'] },
  { pregunta:'¿Para qué sirve la función de "control de cambios" o "comentarios" en un procesador de textos colaborativo?', correcta:'Para que varias personas puedan revisar y sugerir mejoras a un mismo documento', opts:['Para borrar el documento automáticamente','Para cambiar el idioma del documento','Para imprimir el documento más rápido'] },
  { pregunta:'¿Qué deberías revisar antes de compartir un enlace o un archivo con toda tu clase en línea?', correcta:'Que el contenido sea apropiado y venga de una fuente confiable', opts:['Que el archivo tenga un nombre llamativo','Que el archivo sea lo más pesado posible','No es necesario revisar nada'] },
  { pregunta:'¿Qué deberías hacer si notas un error en un documento que ya publicaste en línea?', correcta:'Corregirlo y avisar a quienes ya lo vieron si el error era importante', opts:['Dejarlo como está para no llamar la atención','Borrar el documento sin avisarle a nadie','Publicar el error en otro sitio también'] },
  { pregunta:'¿Qué es recomendable hacer antes de reutilizar una imagen de internet en un trabajo que vas a publicar?', correcta:'Verificar que se pueda usar libremente o dar el crédito correspondiente', opts:['Usarla sin revisar nada','Cambiarle el nombre al archivo solamente','Publicarla como si fuera propia sin ningún crédito'] },
  { pregunta:'¿Qué opción de un software de organización de ideas ayuda a comunicar los resultados de una investigación con claridad?', correcta:'Ordenar la información con títulos, gráficos e imágenes relevantes', opts:['Escribir todo en un solo párrafo sin ningún orden','Usar solo texto sin ningún elemento visual','Copiar la información sin organizarla'] },
  { pregunta:'¿Qué deberías hacer si vas a publicar los resultados de una encuesta que hiciste con tus compañeros?', correcta:'Mostrar los datos de forma clara y honesta, sin inventar resultados', opts:['Inventar resultados para que se vean mejor','Publicar solo los resultados que te convienen','No es necesario mostrar los datos reales'] },
];
export function genTecDigital6Round(){
  const item = pick(TEC_DIGITAL_6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
  };
}

/* ---------------- Contenido Tecnología 7° Básico ----------------
   Basado en Decreto 614/2013. OA05-06 -> Soluciones Tecnológicas y su
   Impacto (reconocer que las soluciones tecnológicas tienen efectos
   positivos y negativos en las personas y el medioambiente, y evaluar
   ese impacto). Quedan fuera OA01-04 (diseñar/planificar/elaborar/evaluar
   una solución tecnológica propia — producción práctica) y OA07-08
   (habilidades TIC de manejo de software específico y comunicación en
   línea — ya cubiertas por Tecnología Digital en años anteriores). */
export const TECNOLOGIA_MODULES_G7 = [
  {id:'solucionestecnologicas7', label:'Soluciones Tecnológicas y su Impacto', open:true, key:'solucionestecnologicas7'},
];
export const TECNOLOGIA_POS_G7 = [{x:48,y:50}];

const IMPACTO_TECNOLOGICO_7_BANK = [
  { pregunta:'El auto permitió a las personas trasladarse más rápido, pero también genera contaminación del aire. ¿Qué muestra este ejemplo?', correcta:'Que una solución tecnológica puede tener efectos positivos y negativos al mismo tiempo', opts:['Que toda tecnología es completamente positiva','Que toda tecnología es completamente negativa','Que el auto no tiene ningún efecto en el medioambiente'] },
  { pregunta:'El teléfono celular facilita la comunicación a distancia, pero su uso excesivo puede afectar el descanso y la concentración. ¿Qué muestra esto?', correcta:'Que evaluar una tecnología significa considerar tanto sus beneficios como sus riesgos', opts:['Que el celular no tiene ningún beneficio real','Que usar el celular nunca trae ningún problema','Que la tecnología no afecta la vida de las personas'] },
  { pregunta:'Una fábrica que usa maquinaria automatizada produce más rápido, pero genera desechos que pueden contaminar un río cercano. ¿Qué debería considerar esa fábrica?', correcta:'Buscar formas de reducir el impacto negativo en el medioambiente, como tratar los desechos', opts:['Ignorar por completo el impacto en el río','Producir aún más rápido sin cambiar nada','Dejar de usar cualquier tipo de maquinaria'] },
  { pregunta:'Las bolsas plásticas facilitaron el transporte de productos, pero tardan mucho tiempo en descomponerse y contaminan el ambiente. ¿Qué alternativa refleja una solución con menor impacto negativo?', correcta:'Usar bolsas reutilizables hechas de materiales que se degradan más rápido', opts:['Usar todavía más bolsas plásticas desechables','Ignorar el problema porque las bolsas son útiles','Dejar de transportar cualquier producto'] },
  { pregunta:'Los paneles solares generan electricidad limpia, pero fabricarlos requiere materiales y energía. ¿Qué muestra este caso?', correcta:'Que incluso las soluciones tecnológicas más limpias tienen algún tipo de impacto que vale la pena evaluar', opts:['Que los paneles solares no tienen ningún impacto en absoluto','Que los paneles solares son completamente inútiles','Que toda la energía limpia es igual de contaminante que la no renovable'] },
  { pregunta:'El uso de plaguicidas ayuda a proteger los cultivos de plagas, pero puede afectar la salud de las personas y de otros seres vivos si se usa en exceso.  ¿Qué debería hacer un agricultor responsable?', correcta:'Usar la cantidad adecuada y buscar alternativas menos dañinas cuando sea posible', opts:['Usar la mayor cantidad posible sin ningún límite','Dejar de proteger los cultivos por completo','Ignorar cualquier efecto en la salud de las personas'] },
  { pregunta:'Las redes sociales permiten mantenerse conectado con personas lejanas, pero también pueden exponer a los usuarios a información falsa. ¿Qué refleja mejor una evaluación equilibrada de esta tecnología?', correcta:'Reconocer que trae beneficios de conexión, pero requiere pensamiento crítico frente a la información que circula', opts:['Que las redes sociales solo traen beneficios','Que las redes sociales solo traen problemas','Que no vale la pena pensar en sus efectos'] },
  { pregunta:'Los electrodomésticos como la lavadora ahorran mucho tiempo de trabajo doméstico, pero consumen agua y electricidad. ¿Qué muestra este ejemplo sobre evaluar una tecnología?', correcta:'Que conviene usarla de forma eficiente para aprovechar el beneficio reduciendo el gasto de recursos', opts:['Que no vale la pena usar ningún electrodoméstico','Que el consumo de agua y electricidad no importa en absoluto','Que ahorrar tiempo es lo único que se debe considerar'] },
  { pregunta:'Los envases desechables de comida rápida son muy prácticos para el consumidor, pero generan mucha basura difícil de reciclar. ¿Qué alternativa reduciría mejor el impacto negativo?', correcta:'Preferir envases reutilizables o de materiales más fáciles de reciclar', opts:['Usar aún más envases desechables cada día','Ignorar el problema de la basura generada','Dejar de comer cualquier tipo de comida'] },
  { pregunta:'La inteligencia artificial puede ayudar a resolver problemas complejos rápidamente, pero también puede cometer errores o ser usada de forma poco ética. ¿Qué actitud refleja mejor evaluar su impacto?', correcta:'Aprovechar sus beneficios mientras se revisan sus resultados con sentido crítico', opts:['Confiar en ella sin revisar nunca ningún resultado','Rechazarla por completo sin considerar sus beneficios','Usarla sin pensar en ninguna consecuencia'] },
];
export function genSolucionesTecnologicas7Round(){
  const item = pick(IMPACTO_TECNOLOGICO_7_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

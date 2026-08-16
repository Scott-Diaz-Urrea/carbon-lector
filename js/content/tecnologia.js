import { pick, shuffle } from '../utils.js';

export const TECNOLOGIA_MODULES = [
  {id:'herramientastec', label:'Herramientas y Materiales', open:true, key:'herramientastec'},
  {id:'examentecnologia1', label:'Examen Final', open:true, key:'examentecnologia1'},
];
/* 2° nodo agregado (2026-08-09, "Examen Final") — mismo layout de 2 nodos
   ya usado en otras asignaturas de años posteriores (ARTES_POS_G3/
   MUSICA_POS_G3), height:260 en vez del 200 original de 1 solo nodo. */
export const TECNOLOGIA_POS = [{x:30,y:70},{x:70,y:30}];

/* ---------------- Contenido Tecnología 1° Básico ----------------
   OA02-03 -> Herramientas y Materiales. OA01,04,05,06 (diseño propio, evaluación
   de resultados, uso de software real) quedaron fuera por ser procesos prácticos
   que no se resuelven con una pregunta de opción múltiple. */
const HERRAMIENTAS_TEC = [
  { emoji:'✂️', label:'Tijera', uso:'Sirve para cortar papel, cartón o telas.' },
  { emoji:'📏', label:'Regla', uso:'Sirve para medir y trazar líneas rectas.' },
  { emoji:'🧴', label:'Pegamento', uso:'Sirve para unir y pegar materiales.' },
  { emoji:'🖊️', label:'Lápiz o plumón', uso:'Sirve para marcar o dibujar sobre el material.' },
  { emoji:'🧵', label:'Hilo y aguja', uso:'Sirve para coser o unir telas.' },
  { emoji:'🔨', label:'Martillo', uso:'Sirve para clavar o unir piezas de madera.' },
];
/* "CARTÓN" usaba 🧻 (un rollo de papel higiénico/toalla de papel, sin
   relación con el cartón) → 📦 (una caja), ya que las cajas de cartón son
   el ejemplo que el propio texto menciona. */
const MATERIALES_TEC = [
  { emoji:'📄', label:'Papel', uso:'Material liviano que se usa para dibujar, doblar o recortar.' },
  { emoji:'📦', label:'Cartón', uso:'Material firme, útil para construir maquetas y cajas.' },
  { emoji:'🧶', label:'Fibras o lana', uso:'Material que sirve para tejer o decorar.' },
  { emoji:'♻️', label:'Material de reciclaje', uso:'Botellas, tapas o cajas que se reutilizan para crear objetos nuevos.' },
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
  {id:'examentecnologia2', label:'Examen Final', open:true, key:'examentecnologia2'},
];
export const TECNOLOGIA_POS_G2 = [{x:30,y:70},{x:70,y:30}];

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

/* Niveles (2026-08-11): fácil reduce a 2 opciones; difícil oculta el
   emoji (item.pregunta ya es la pregunta completa en texto). */
export function genTecDigital2Round(nivel){
  const recurso = 'La <b>tecnología digital</b> incluye herramientas como programas de dibujo, procesadores de texto, y el uso de internet — y usarla bien requiere aprender no solo a manejarla, sino a hacerlo de forma segura. Por ejemplo, un programa de dibujo digital te permite crear y corregir sin gastar papel, un procesador de texto te ayuda a escribir y editar más fácil que a mano, e internet te conecta con información e imágenes de todo el mundo. Pero junto con estas herramientas, aprender uso seguro de internet desde pequeño —no dar datos personales, avisar a un adulto si ves algo raro— es tan importante como aprender a usar el programa mismo.';
  const item = pick(TEC_DIGITAL_BANK);
  let opts2 = item.opts;
  if(nivel==='facil'){ opts2 = shuffle(opts2).slice(0,1); }
  const opts = shuffle([item.correcta].concat(opts2)).map(function(o){ return {label:o, value:o}; });
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
    recurso: recurso,
  };
}

/* "Examen Final" 2° básico Tecnología: solo hay 1 módulo compatible, así
   que el examen re-randomiza el nivel sobre el mismo generador. */
export function genExamenTecnologia2Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genTecDigital2Round(nivel);
}

/* Niveles de dificultad (2026-08-09, mismo motor que el resto de 1°
   básico). `nivel` opcional; sin argumento, comportamiento original.
   `item.uso` ya es la pregunta completa en texto — el emoji es
   decorativo, se saca en difícil sin dejar la pregunta sin sujeto. */
export function genHerramientasTecRound(nivel){
  const recurso = 'La <b>tecnología</b> es cualquier herramienta o material que las personas crean para resolver un problema o hacer una tarea más fácil — no es solo "cosas con pantalla", también son tecnología unas tijeras, un martillo o una regla. Cada <b>herramienta</b> está diseñada para un trabajo específico (cortar, medir, pegar), y cada <b>material</b> se elige según lo que necesitas construir (fuerte, flexible, liviano). Reconocer qué herramienta o material corresponde a cada uso es el primer paso para poder crear tus propios objetos tecnológicos más adelante, eligiendo lo correcto para cada tarea en vez de usar cualquier cosa al azar.';
  const showEmoji = nivel !== 'dificil';
  if(Math.random()<0.5){
    const item = pick(HERRAMIENTAS_TEC);
    let distract = shuffle(HERRAMIENTAS_TEC.filter(function(h){ return h.label!==item.label; })).map(function(h){ return h.label; });
    distract = distract.slice(0, nivel==='facil' ? 1 : 3);
    const opts = shuffle([item.label].concat(distract)).map(function(h){ return {label:h, value:h}; });
    return {
      promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.uso+'</p>',
      options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
      explain: item.uso+' Esa herramienta es <b>'+item.label.toLowerCase()+'</b>.',
      recurso: recurso,
    };
  }
  const item = pick(MATERIALES_TEC);
  let distract = shuffle(MATERIALES_TEC.filter(function(m){ return m.label!==item.label; })).map(function(m){ return m.label; });
  distract = distract.slice(0, nivel==='facil' ? 1 : 3);
  const opts = shuffle([item.label].concat(distract)).map(function(m){ return {label:m, value:m}; });
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.uso+'</p>',
    options: opts, correctValue: item.label, speakText: item.uso, cols:4, kind:'word',
    explain: item.uso+' Ese material es <b>'+item.label.toLowerCase()+'</b>.',
    recurso: recurso,
  };
}

/* "Examen Final" (mismo patrón que el resto de 1° básico): Tecnología solo
   tiene 1 módulo compatible con el motor de opción múltiple, así que el
   examen mezcla sus 2 ramas + los 3 niveles al azar (en vez de mezclar
   varios generadores, como en el resto de asignaturas). */
export function genExamenTecnologia1Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genHerramientasTecRound(nivel);
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
  {id:'examentecnologia3', label:'Examen Final', open:true, key:'examentecnologia3'},
];
export const TECNOLOGIA_POS_G3 = [{x:30,y:70},{x:70,y:30}];

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

/* Niveles (2026-08-11): fácil reduce a 2 opciones; difícil oculta el
   emoji (item.pregunta ya es la pregunta completa en texto). */
export function genTecDigital3Round(nivel){
  const item = pick(TEC_DIGITAL_3_BANK);
  let opts2 = item.opts;
  if(nivel==='facil'){ opts2 = shuffle(opts2).slice(0,1); }
  const opts = shuffle([item.correcta].concat(opts2)).map(function(o){ return {label:o, value:o}; });
  const showEmoji = nivel !== 'dificil';
  return {
    promptHTML: (showEmoji ? '<span class="prompt-emoji">'+item.emoji+'</span>' : '')+'<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
    recurso: 'Usar tecnología digital de forma responsable significa más que solo saber apretar botones: incluye organizar bien tu tiempo frente a pantallas (combinarlo con otras actividades como jugar afuera y descansar), presentar tus trabajos con cuidado (ortografía revisada, información bien organizada), y cuidar tu seguridad en internet (nunca dar datos personales sin consultar primero con un adulto). Estas habilidades digitales son cada vez más importantes porque usarás computadores e internet en casi todo lo que hagas de aquí en adelante, en el colegio y en la vida diaria.',
  };
}

/* "Examen Final" 3° básico Tecnología: solo hay 1 módulo compatible, así
   que el examen re-randomiza el nivel sobre el mismo generador. */
export function genExamenTecnologia3Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genTecDigital3Round(nivel);
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
  {id:'examentecnologia4', label:'Examen Final', open:true, key:'examentecnologia4'},
];
export const TECNOLOGIA_POS_G4 = [{x:30,y:70},{x:70,y:30}];

const TEC_DIGITAL_4_BANK = [
  { pregunta:'¿Para qué usarías una hoja de cálculo?', correcta:'Para organizar datos en filas y columnas, y hacer cálculos automáticos', opts:['Para escuchar música','Para tomar fotografías','Para hacer ejercicio'] },
  { pregunta:'¿Qué tipo de información se organiza mejor en una hoja de cálculo?', correcta:'Listas de números y datos, como resultados de una encuesta', opts:['Un dibujo artístico','Una canción','Un video'] },
  { pregunta:'¿Para qué usarías un software de presentaciones en un trabajo grupal?', correcta:'Para mostrar tus ideas en diapositivas con texto e imágenes', opts:['Para hacer cálculos matemáticos','Para escuchar música','Para hacer ejercicio'] },
  { pregunta:'Antes de usar información de un sitio web para una tarea, ¿qué debes evaluar?', correcta:'Si la fuente es confiable y segura', opts:['Solo el color de la página','Cuántos anuncios tiene','Nada, se puede usar cualquier información'] },
  { pregunta:'¿Qué debes hacer si una página web te pide muchos datos personales sin una razón clara?', correcta:'Ser precavido y consultar con un adulto antes de continuar', opts:['Ingresar todos los datos de inmediato','Compartir la página con desconocidos','Ignorar la duda'] },
  { pregunta:'¿Qué elemento de diseño puedes agregar en un procesador de textos para mejorar un documento?', correcta:'Títulos, negritas e imágenes', opts:['Solo texto sin ningún formato','Un video musical','Un juego interactivo'] },
  { pregunta:'¿Por qué es importante guardar tu trabajo con frecuencia mientras usas un computador?', correcta:'Para no perder tu progreso si el programa falla', opts:['Para que el computador se apague','Para que el archivo se borre','No es importante'] },
  { pregunta:'¿Qué debes revisar en un correo electrónico antes de hacer clic en un enlace?', correcta:'Que el remitente sea alguien conocido y confiable', opts:['Solo el color del correo','El día en que fue enviado','No es necesario revisar nada'] },
  { pregunta:'¿Qué función usarías en una hoja de cálculo para sumar automáticamente una columna de números?', correcta:'Una fórmula de suma', opts:['Un dibujo a mano','Una foto pegada','Un color de fondo'] },
  { pregunta:'¿Qué es una contraseña segura?', correcta:'Una combinación de letras, números y símbolos difícil de adivinar', opts:['Tu propio nombre','El número 1234','La misma para todas tus cuentas'] },
  { pregunta:'¿Por qué es importante organizar tus archivos en carpetas con nombres claros?', correcta:'Para encontrarlos fácilmente más adelante', opts:['Para que ocupen más espacio','Para que se vean más bonitos','No tiene ninguna utilidad'] },
  { pregunta:'¿Qué deberías hacer si recibes un mensaje de alguien desconocido pidiéndote tu contraseña?', correcta:'No responder y contárselo a un adulto de confianza', opts:['Enviar la contraseña de inmediato','Responder con otra contraseña','Ignorarlo sin decirle a nadie'] },
];

export function genTecDigital4Round(nivel){
  const item = pick(TEC_DIGITAL_4_BANK);
  const opts = shuffle([item.correcta].concat(nivel==='facil' ? item.opts.slice(0,1) : item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".',
    recurso: 'Una <b>hoja de cálculo</b> organiza información en filas y columnas, y es especialmente útil para números y datos (como los resultados de una encuesta) porque puede hacer cálculos automáticos, a diferencia de un simple documento de texto. Un <b>software de presentaciones</b> sirve para mostrar ideas en diapositivas con texto e imágenes, ideal para exponer un trabajo frente a otros. Al usar internet, la <b>seguridad digital</b> es clave: antes de usar información de un sitio web hay que evaluar si la fuente es confiable, nunca entregar datos personales sin motivo claro, y revisar que el remitente de un correo sea alguien conocido antes de hacer clic en cualquier enlace.',
  };
}

export function genExamenTecnologia4Round(){
  const nivel = pick(['facil','normal','dificil']);
  return genTecDigital4Round(nivel);
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
  const recurso = 'Un <b>procesador de textos</b> tiene opciones de formato para que un documento se lea con claridad: negrita y tamaño de letra para destacar títulos, alineación para ordenar el texto en la página, viñetas o numeración para organizar listas, y tablas para mostrar información en columnas ordenadas. Al comunicarse en internet con compañeros de un trabajo grupal, lo responsable es compartir solo información relacionada con el trabajo, tratar a todos con respeto, y evitar compartir datos personales innecesarios (como direcciones o teléfonos) en un grupo en línea.';
  const item = pick(TEC_DIGITAL_5_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".', recurso: recurso,
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
  const recurso = 'Antes de compartir un documento o publicar información en línea, hay dos pasos clave: <b>revisar</b> (que las ideas estén ordenadas, que la información sea correcta, que todos los integrantes de un trabajo grupal estén de acuerdo) y <b>publicar de forma responsable</b> (compartir contenido verificado y respetuoso, pensando en quién lo va a ver, y dando crédito si se reutiliza el trabajo de otra persona). Herramientas como el control de cambios o los comentarios en un documento colaborativo existen justamente para que varias personas puedan revisar y mejorar un mismo trabajo antes de compartirlo.';
  const item = pick(TEC_DIGITAL_6_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es "'+item.correcta+'".', recurso: recurso,
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
  const recurso = 'Casi toda <b>solución tecnológica</b> trae beneficios y también algún tipo de impacto negativo al mismo tiempo (el auto facilita el traslado pero contamina; el celular conecta pero puede afectar el descanso). Evaluar una tecnología significa considerar ambos lados, no solo sus ventajas, y buscar formas de reducir su impacto negativo (usar materiales reutilizables, tratar los desechos, usar los recursos de forma eficiente) sin dejar de aprovechar sus beneficios.';
  const item = pick(IMPACTO_TECNOLOGICO_7_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- Contenido Tecnología 8° Básico ----------------
   Basado en Decreto 614/2013. TE08 OA05-06 -> Análisis de Soluciones
   Tecnológicas: examinar soluciones existentes considerando usuarios,
   aspectos técnicos y funcionales (OA05), y evaluar sus consecuencias
   desde perspectivas éticas, ambientales y sociales (OA06) — profundiza
   el módulo de 7° (que cubrió el impacto positivo/negativo general) con
   los ángulos nuevos del OA de 8°: el USUARIO como centro del análisis y
   la dimensión ÉTICA. Quedan fuera OA01-04 (identificar necesidades y
   diseñar/elaborar/evaluar/comunicar un producto tecnológico propio —
   producción práctica). */
export const TECNOLOGIA_MODULES_G8 = [
  {id:'analisissoluciones8', label:'Análisis de Soluciones Tecnológicas', open:true, key:'analisissoluciones8'},
];
export const TECNOLOGIA_POS_G8 = [{x:48,y:50}];

const ANALISIS_SOLUCIONES_8_BANK = [
  { pregunta:'Al analizar una aplicación de transporte, ¿qué significa considerar a sus "usuarios"?', correcta:'Estudiar quiénes la usan, qué necesitan y si la solución responde bien a esas necesidades', opts:['Contar solo cuánto dinero genera','Mirar únicamente su logotipo','Ignorar a las personas que la usan'] },
  { pregunta:'Una silla de ruedas motorizada resuelve una necesidad de movilidad. ¿Qué aspecto TÉCNICO conviene analizar?', correcta:'Su autonomía de batería, peso, materiales y facilidad de mantención', opts:['El color favorito del vendedor','La música que suena en la tienda','Ningún aspecto técnico'] },
  { pregunta:'Una aplicación gratuita muestra publicidad usando los datos personales de sus usuarios. ¿Qué perspectiva de análisis levanta preguntas aquí?', correcta:'La perspectiva ética: si los usuarios saben y aceptan cómo se usan sus datos', opts:['Solo la perspectiva del diseño gráfico','Ninguna: los datos personales no importan','La perspectiva del clima'] },
  { pregunta:'Un envase biodegradable cuesta un poco más que uno plástico tradicional. ¿Qué implica evaluarlo desde la perspectiva ambiental?', correcta:'Considerar su impacto completo: materiales, degradación y residuos que genera', opts:['Mirar solo el precio de venta','Elegir siempre el más barato sin análisis','Ignorar qué pasa con el envase después de usarlo'] },
  { pregunta:'Un municipio evalúa instalar bicicletas públicas compartidas. ¿Qué aspecto FUNCIONAL debería analizar?', correcta:'Si el sistema realmente funciona para trasladarse: estaciones, disponibilidad y estado de las bicicletas', opts:['El nombre del alcalde','La marca de los candados únicamente','Si las bicicletas son bonitas en fotos'] },
  { pregunta:'Al comparar dos soluciones para potabilizar agua en zonas rurales, ¿qué análisis es más completo?', correcta:'Comparar costo, mantención, facilidad de uso para la comunidad y efecto ambiental de cada una', opts:['Elegir la que tenga el nombre más moderno','Mirar solo cuál se ve más tecnológica','Descartar ambas sin analizarlas'] },
  { pregunta:'Una red social lanza una función que fomenta pasar más horas conectado. ¿Qué pregunta ética cabe hacerse?', correcta:'Si la función respeta el bienestar de los usuarios o solo busca retenerlos más tiempo', opts:['Si los íconos son redondos o cuadrados','Ninguna: las funciones nuevas siempre son buenas','Si el nombre de la función es pegajoso'] },
  { pregunta:'Los audífonos con reducción de ruido ayudan a concentrarse, pero usarlos al cruzar la calle reduce la percepción del entorno. ¿Qué muestra este análisis?', correcta:'Que una misma solución puede ser positiva o riesgosa según el contexto de uso', opts:['Que los audífonos son siempre peligrosos','Que los audífonos no tienen ningún riesgo','Que el contexto de uso no importa'] },
  { pregunta:'Una empresa presenta su nueva máquina como "totalmente ecológica" sin entregar ningún dato. ¿Qué corresponde hacer al analizarla?', correcta:'Pedir evidencia verificable antes de aceptar la afirmación', opts:['Creer la afirmación porque suena bien','Descartar toda la tecnología de la empresa','Comprarla de inmediato'] },
  { pregunta:'¿Por qué conviene incluir a los propios usuarios al evaluar una solución tecnológica ya implementada?', correcta:'Porque su experiencia real revela problemas y mejoras que el diseño original no previó', opts:['Porque así se evita tener que mejorar nada','No conviene: los usuarios nunca aportan','Porque los usuarios deben pagar más'] },
];
export function genAnalisisSoluciones8Round(){
  const recurso = 'Analizar una <b>solución tecnológica</b> —una aplicación, un dispositivo, un sistema— implica mirarla desde varias perspectivas a la vez. La perspectiva del <b>usuario</b> pregunta quién la usa y si realmente responde a sus necesidades; la perspectiva <b>funcional/técnica</b> evalúa si funciona bien en la práctica (autonomía, materiales, mantención); la perspectiva <b>ambiental</b> considera su impacto completo, desde los materiales hasta los residuos que genera; y la perspectiva <b>ética</b> se pregunta si la solución respeta el bienestar de las personas —por ejemplo, si usa sus datos personales con su conocimiento y consentimiento, o si busca retenerlas más tiempo del que les conviene—. Un buen análisis nunca acepta afirmaciones sin evidencia ("totalmente ecológica" sin datos) y siempre considera que una misma tecnología puede ser positiva o riesgosa según el contexto en que se use.';
  const item = pick(ANALISIS_SOLUCIONES_8_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 1° Medio (Decreto 614/2013, mismo decreto que 7°-8° básico) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/tecnologia/1-medio —
   OA01-06. Cubiertos: OA05-06 (cómo evolucionan los productos tecnológicos y
   sus entornos, y los efectos positivos/negativos de esa evolución en la
   sociedad). Fuera: OA01-04 (identificar oportunidades, desarrollar,
   evaluar y comunicar un servicio propio — producción práctica). */
export const TECNOLOGIA_MODULES_M1 = [
  {id:'evoluciontecnologicam1', label:'Evolución Tecnológica y Sociedad', open:true, key:'evoluciontecnologicam1'},
];
export const TECNOLOGIA_POS_M1 = [{x:48,y:50}];
const EVOLUCION_TECNOLOGICA_M1_BANK = [
  { pregunta:'¿Qué factor explica que los teléfonos hayan evolucionado de solo hacer llamadas a ser computadores portátiles?', correcta:'El avance de otras tecnologías (como internet, cámaras y baterías) que se fueron integrando al mismo dispositivo', opts:['El azar, sin ninguna razón particular','La prohibición de fabricar teléfonos simples','Que las personas dejaron de necesitar comunicarse'] },
  { pregunta:'¿Qué efecto positivo trajo la evolución de las plataformas de videollamada para la sociedad?', correcta:'Permitir comunicación y trabajo a distancia entre personas separadas geográficamente', opts:['Eliminar por completo la necesidad de comunicarse','Hacer imposible el contacto entre personas distintas','No generar ningún cambio en la forma de trabajar'] },
  { pregunta:'¿Qué efecto negativo puede tener la evolución de las redes sociales sobre las personas, según muchos estudios?', correcta:'Un uso excesivo puede afectar el bienestar emocional y el descanso', opts:['No genera ningún efecto sobre el bienestar de las personas','Mejora automáticamente la salud mental de todos','Elimina por completo el estrés de todas las personas'] },
  { pregunta:'¿Qué factor social influyó en que los autos eléctricos evolucionaran y se volvieran más comunes?', correcta:'La preocupación por el impacto ambiental de los combustibles fósiles', opts:['La prohibición total de fabricar autos','Que a nadie le interesa cuidar el medioambiente','Que los autos a bencina ya no existen'] },
  { pregunta:'¿Qué evolución han tenido los medios de pago en los últimos años?', correcta:'Del dinero en efectivo a tarjetas y pagos digitales desde el teléfono', opts:['Ningún cambio: siempre se ha pagado igual','La desaparición completa del comercio','El regreso exclusivo al trueque'] },
  { pregunta:'¿Qué efecto positivo trae la evolución de la tecnología médica, como los escáneres portátiles?', correcta:'Permitir diagnósticos más rápidos, incluso en zonas alejadas de un hospital', opts:['Hacer innecesarios a los médicos','Empeorar la calidad de los diagnósticos','No generar ningún cambio en la salud'] },
  { pregunta:'¿Qué efecto negativo puede generar la rápida evolución y renovación de los productos tecnológicos?', correcta:'Un aumento de la basura electrónica, si los aparatos antiguos no se reciclan bien', opts:['Ningún residuo, porque los aparatos desaparecen solos','Una disminución automática de la contaminación','Que ya no se fabriquen aparatos nuevos'] },
  { pregunta:'¿Qué factor de mercado influye en que las empresas sigan mejorando sus productos tecnológicos constantemente?', correcta:'La competencia por ofrecer mejores soluciones que las de otras empresas', opts:['La prohibición de vender productos nuevos','El desinterés total de las personas por la tecnología','Que ya no existan más empresas tecnológicas'] },
];
export function genEvolucionTecnologicaM1Round(){
  const recurso = 'Los <b>productos y entornos tecnológicos evolucionan</b> constantemente, influidos por distintos factores: avances en otras tecnologías que se integran a un mismo producto (como internet y cámaras sumándose al teléfono), la competencia entre empresas por ofrecer mejores soluciones, y preocupaciones sociales o ambientales (como el impacto de los combustibles fósiles impulsando la evolución de los autos eléctricos). Esta evolución trae <b>efectos positivos</b>, como comunicarse a distancia o hacer diagnósticos médicos más rápidos, pero también <b>efectos negativos</b>, como el aumento de la basura electrónica cuando los aparatos antiguos no se reciclan, o el impacto en el bienestar emocional que puede generar el uso excesivo de ciertas tecnologías. Analizar ambos lados de la evolución tecnológica —no solo sus beneficios— permite tomar decisiones más informadas como usuario.';
  const item = pick(EVOLUCION_TECNOLOGICA_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

/* ---------------- 2° Medio (Decreto 614/2013, mismo decreto que 1° medio) ----------------
   curriculumnacional.cl/curriculum/7o-basico-2o-medio/tecnologia/2-medio —
   TE2M OA05-06 (texto muy similar al de 1° medio; este módulo se enfoca en el
   ángulo de PROYECTAR escenarios futuros de impacto, en vez de evaluar
   innovaciones ya existentes como en 1° medio). Fuera: OA01-04 (identificar
   necesidades y proponer/comunicar una solución tecnológica propia). */
export const TECNOLOGIA_MODULES_M2 = [
  {id:'escenariostecnologicosm2', label:'Proyectar Escenarios Tecnológicos', open:true, key:'escenariostecnologicosm2'},
];
export const TECNOLOGIA_POS_M2 = [{x:48,y:50}];
const ESCENARIOS_TECNOLOGICOS_M2_BANK = [
  { pregunta:'Si en el futuro más autos fueran completamente autónomos (sin conductor), ¿qué escenario POSITIVO podría proyectarse para la sociedad?', correcta:'Una posible reducción de accidentes causados por errores humanos al conducir', opts:['La desaparición inmediata y total de todos los caminos','Que nadie podrá trasladarse nunca más','Un aumento garantizado de accidentes en todos los casos'] },
  { pregunta:'Si la automatización de tareas en fábricas sigue aumentando, ¿qué escenario NEGATIVO es importante proyectar y anticipar?', correcta:'La posible pérdida de empleos en tareas que hoy realizan personas', opts:['Que las fábricas dejarán de funcionar por completo','Que la automatización no afecta a ningún trabajador','Un aumento garantizado e ilimitado de empleos para todos'] },
  { pregunta:'Al proyectar el impacto ambiental futuro de una tecnología nueva (como una fuente de energía), ¿qué es importante considerar?', correcta:'Tanto sus beneficios ambientales como sus posibles efectos secundarios no deseados', opts:['Solo sus beneficios, ignorando cualquier efecto secundario','Que ninguna tecnología nueva tiene ningún impacto ambiental','Que el impacto ambiental no se puede proyectar nunca'] },
  { pregunta:'¿Por qué es útil, antes de que una tecnología se masifique, proyectar distintos escenarios de su posible impacto futuro?', correcta:'Para anticipar problemas y tomar decisiones o regulaciones a tiempo, en vez de reaccionar después', opts:['Porque proyectar escenarios futuros no tiene ninguna utilidad','Porque el futuro de la tecnología no se puede analizar de ninguna forma','Porque solo importa lo que ya ocurrió en el pasado'] },
  { pregunta:'Si en el futuro se usara más inteligencia artificial para tomar decisiones médicas, ¿qué escenario debería proyectarse con cuidado?', correcta:'Que el sistema mantenga supervisión humana y no cometa errores sin que nadie los revise', opts:['Que la inteligencia artificial nunca podrá cometer un error','Que ya no hará falta ningún médico en el futuro, sin ninguna excepción','Que este escenario no requiere ningún análisis previo'] },
  { pregunta:'Si en el futuro la mayoría de los pagos se hicieran solo con el teléfono o el reconocimiento facial, ¿qué escenario debería proyectarse con cuidado?', correcta:'Que las personas sin acceso a esa tecnología no queden excluidas del sistema de pagos', opts:['Que absolutamente todas las personas tendrán acceso garantizado sin ninguna excepción','Que el dinero en efectivo dejará de existir de un día para otro sin ningún problema','Que este escenario no necesita ningún tipo de análisis'] },
  { pregunta:'Al proyectar el uso futuro de drones para entregas a domicilio, ¿qué escenario de seguridad es importante anticipar?', correcta:'Posibles accidentes o mal uso del espacio aéreo si no existe una regulación adecuada', opts:['Que los drones nunca podrán tener ningún problema técnico','Que no hace falta ninguna regulación para su uso','Que las entregas por drones no afectan en nada al espacio aéreo'] },
  { pregunta:'Si el uso de realidad virtual en la educación se masificara en el futuro, ¿qué escenario POSITIVO podría proyectarse?', correcta:'Que los estudiantes puedan vivir experiencias de aprendizaje más inmersivas e interactivas', opts:['Que los colegios físicos desaparecerán de inmediato en todo el mundo','Que ningún estudiante podrá aprender nunca más sin esta tecnología','Que el aprendizaje empeorará siempre, sin ninguna excepción'] },
];
export function genEscenariosTecnologicosM2Round(){
  const recurso = '<b>Proyectar escenarios</b> de impacto tecnológico significa imaginar, de forma fundamentada, qué podría ocurrir en el futuro si una tecnología actual se masifica o sigue evolucionando — considerando tanto posibles <b>impactos positivos</b> (por ejemplo, menos accidentes con autos autónomos) como posibles <b>impactos negativos</b> (como la pérdida de empleos por mayor automatización). Este ejercicio no busca predecir el futuro con certeza, sino <b>anticipar problemas</b> a tiempo —como la necesidad de supervisión humana sobre decisiones tomadas por inteligencia artificial— para poder tomar decisiones, regulaciones o precauciones antes de que la tecnología ya esté masificada y sea más difícil de corregir.';
  const item = pick(ESCENARIOS_TECNOLOGICOS_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

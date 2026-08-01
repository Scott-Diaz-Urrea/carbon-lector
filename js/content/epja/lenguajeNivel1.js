import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Básica: Lenguaje y Comunicación ----------------
   EPJA (Educación de Personas Jóvenes y Adultas) no se organiza por año escolar como
   Educación Básica regular, sino por NIVELES que agrupan varios años en un solo examen
   de Validación de Estudios: Nivel 1 Básica equivale a 1°-4° básico, Nivel 2 a 5°-6°,
   Nivel 3 a 7°-8°. Fuente: "Temario Nivel 1 de Educación Básica — Proceso de exámenes de
   Validación de Estudios Adultos (mayores de 18 años)", Decreto Supremo N°10 de 2022,
   Ministerio de Educación (epja.mineduc.cl, versión 2026, la vigente al momento de
   construir este módulo). El temario lista dos ejes evaluados en Lenguaje y Comunicación:
   1) Comprender lecturas (textos literarios de género narrativo y no literarios: cartas,
   afiches/avisos, noticias, recetas, instrucciones, textos informativos) — información
   explícita, inferencias (ideas centrales/secundarias, hechos relevantes, detalles
   significativos, conceptos abstractos como emociones), sinónimos/antónimos y familias de
   palabras, y fundamentar una opinión simple; 2) Escribir un texto breve — letra legible,
   correspondencia letra-sonido, concordancia de género/número, ortografía (acentual,
   puntual, literal), vocabulario variado, destinatario/propósito/estructura textual, y
   coherencia/cohesión.
   Los 4 módulos de este archivo cubren ambos ejes con el motor de opción múltiple:
   Comprensión de Lectura y Sinónimos y Antónimos cubren el eje 1 directamente; Tipos de
   Textos y Gramática y Ortografía cubren, de forma reconocible en opción múltiple, los
   aspectos del eje 2 que no requieren producción escrita real (destinatario/propósito/
   estructura de un tipo de texto dado, y las reglas de concordancia/ortografía que el
   estudiante debe aplicar al escribir). La producción escrita en sí (redactar un texto
   propio) queda fuera del motor de opción múltiple, mismo criterio que excluye OA de
   producción escrita en el resto de la app.
   Los ejemplos y contextos de este módulo son deliberadamente de la vida adulta
   (trabajo, familia, comunidad, trámites) en vez de escolares/infantiles, siguiendo el
   enfoque explícito del programa EPJA de vincular el aprendizaje con la experiencia vital
   de personas jóvenes y adultas. */

export const LENGUAJE_EPJA_N1_MODULES = [
  {id:'comprensionEpjaN1', label:'Comprensión de Lectura', open:true, key:'comprensionEpjaN1'},
  {id:'sinonimosAntonimosEpjaN1', label:'Sinónimos y Antónimos', open:true, key:'sinonimosAntonimosEpjaN1'},
  {id:'tiposTextoEpjaN1', label:'Tipos de Textos', open:true, key:'tiposTextoEpjaN1'},
  {id:'gramaticaOrtografiaEpjaN1', label:'Gramática y Ortografía', open:true, key:'gramaticaOrtografiaEpjaN1'},
];
export const LENGUAJE_EPJA_N1_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

const COMPRENSION_EPJA_N1_BANK = [
  { texto:'Ayer llegué tarde al trabajo porque el bus que tomo todos los días no pasó a la hora de siempre. Tuve que caminar veinte minutos hasta la siguiente parada para tomar otro. Cuando por fin llegué, mi jefe ya había empezado la reunión, así que me senté en silencio al final de la sala.', pregunta:'¿Por qué la persona llegó tarde al trabajo?', correcta:'Porque el bus habitual no pasó a la hora de siempre', opts:['Porque se quedó dormida','Porque la reunión se adelantó','Porque decidió caminar por gusto'] },
  { texto:'Estimado señor Rojas: Junto con saludar, le escribo para informarle que el pago del arriendo de este mes se realizará con tres días de atraso, ya que mi sueldo se depositará el viernes 5 en vez del día 1 como es habitual. Le agradezco su comprensión. Atentamente, Marta Soto.', pregunta:'¿Cuál es el propósito principal de esta carta?', correcta:'Avisar con anticipación que el pago del arriendo llegará atrasado', opts:['Pedir que se rebaje el precio del arriendo','Reclamar por un cobro incorrecto','Anunciar que dejará de arrendar el lugar'] },
  { texto:'AVISO COMUNITARIO: El próximo sábado 14 se realizará una jornada de vacunación gratuita en la sede social, desde las 9:00 hasta las 13:00 horas. Se solicita traer el carné de identidad y el carné de vacunas si lo tiene. Actividad organizada por la junta de vecinos.', pregunta:'¿Qué debe llevar una persona que asista a esta actividad?', correcta:'Su carné de identidad, y el de vacunas si lo tiene', opts:['Solo dinero en efectivo','Una receta médica','Un formulario ya completado en su casa'] },
  { texto:'Un incendio afectó anoche a un local comercial en el centro de la ciudad. Bomberos controló las llamas cerca de la medianoche, sin que se registraran personas heridas. Se investigan las causas del siniestro.', pregunta:'Según la noticia, ¿cuál fue el resultado del incendio?', correcta:'Bomberos controló las llamas y no hubo heridos', opts:['El local quedó completamente reconstruido esa misma noche','Varias personas resultaron heridas de gravedad','El incendio sigue activo hasta el día de hoy'] },
  { texto:'RECETA — Sopaipillas caseras: 1) Mezclar la harina con la zapallo cocido y machacado. 2) Agregar sal y un poco de manteca. 3) Amasar hasta lograr una masa firme. 4) Estirar y cortar en discos. 5) Freír en aceite bien caliente hasta dorar por ambos lados.', pregunta:'Según la receta, ¿qué se debe hacer justo después de amasar?', correcta:'Estirar la masa y cortarla en discos', opts:['Freír inmediatamente sin estirar','Agregar más harina y volver a amasar','Dejar reposar la masa por un día completo'] },
  { texto:'Para armar el mueble: primero atornille las dos patas laterales a la base. Luego, fije el respaldo usando los tornillos más cortos. Por último, ajuste todos los tornillos con la llave incluida antes de apoyar peso sobre el mueble.', pregunta:'¿Qué instrucción se debe seguir antes de apoyar peso sobre el mueble?', correcta:'Ajustar todos los tornillos con la llave incluida', opts:['Pintar el mueble completo','Retirar las patas laterales','Guardar la llave en otro lugar'] },
  { texto:'El reciclaje de papel y cartón permite reutilizar este material para fabricar nuevos productos, en vez de que termine en un vertedero. Reciclar una tonelada de papel puede evitar la tala de varios árboles y reduce el uso de agua y energía en comparación con fabricar papel nuevo.', pregunta:'Según el texto, ¿qué evita reciclar una tonelada de papel?', correcta:'La tala de varios árboles y un mayor uso de agua y energía', opts:['El uso de tinta en las impresoras','El aumento del precio del papel','La contaminación del aire únicamente'] },
  { texto:'Después de meses buscando trabajo sin resultados, por fin me llamaron de la empresa donde había postulado. Colgué el teléfono y me quedé un momento en silencio, sintiendo que por fin todo ese esfuerzo había valido la pena.', pregunta:'¿Qué siente la persona al final del relato?', correcta:'Alivio y satisfacción por el esfuerzo recompensado', opts:['Rabia por la demora en llamarla','Indiferencia ante la noticia','Miedo a que el trabajo sea muy exigente'] },
  { texto:'Hija querida: espero que estés bien junto a los niños. Aquí en el campo todo sigue igual, aunque extraño mucho las visitas de los domingos. Cuéntame cómo va la escuela de los pequeños y si necesitas algo, aquí estoy para lo que sea.', pregunta:'¿Qué extraña la persona que escribe la carta?', correcta:'Las visitas de los domingos de su hija y sus nietos', opts:['La vida en la ciudad','El trabajo que tenía antes','Los inviernos fríos del campo'] },
  { texto:'SE BUSCA: Ayudante de bodega, media jornada, turno tarde. Se requiere experiencia mínima de 6 meses y disponibilidad inmediata. Interesados presentarse con currículum en Av. Los Aromos 450, de lunes a viernes.', pregunta:'Según el aviso, ¿qué se les pide a los interesados en el puesto?', correcta:'Presentarse con currículum en la dirección indicada', opts:['Enviar un correo electrónico con sus datos','Llamar por teléfono antes de las 9:00','Inscribirse solo los fines de semana'] },
];

export function genComprensionEpjaN1Round(){
  const item = pick(COMPRENSION_EPJA_N1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: 'Comprender un texto significa mucho más que reconocer las palabras que lo forman: implica captar información explícita (lo que el texto dice literalmente) e inferir información implícita (lo que se deduce, aunque no esté escrito directamente) — como la idea central de un párrafo, un hecho relevante, un detalle significativo, o incluso una emoción que un personaje siente sin que el texto lo diga con esas palabras exactas. Los textos no literarios (cartas, avisos, noticias, recetas, instrucciones) suelen tener una estructura predecible que ayuda a ubicar la información rápido: una carta parte con un saludo y termina con una despedida, una receta ordena los pasos en secuencia, un aviso destaca lo más urgente al principio. Reconocer esa estructura, y distinguir entre lo que el texto afirma directamente y lo que se puede deducir, es una habilidad que se usa constantemente en la vida diaria: leer un contrato, entender una noticia, o seguir instrucciones de un trámite.',
  };
}

const SIGNIFICADO_BANK = [
  { palabra:'Contento', tipo:'sinonimo', correcta:'Alegre', opts:['Triste','Enojado','Cansado'] },
  { palabra:'Veloz', tipo:'sinonimo', correcta:'Rápido', opts:['Lento','Pesado','Silencioso'] },
  { palabra:'Amplio', tipo:'sinonimo', correcta:'Espacioso', opts:['Estrecho','Oscuro','Frágil'] },
  { palabra:'Escaso', tipo:'sinonimo', correcta:'Poco', opts:['Abundante','Nuevo','Caro'] },
  { palabra:'Robusto', tipo:'sinonimo', correcta:'Fuerte', opts:['Débil','Delgado','Tímido'] },
  { palabra:'Sencillo', tipo:'sinonimo', correcta:'Simple', opts:['Complicado','Costoso','Antiguo'] },
  { palabra:'Alegre', tipo:'antonimo', correcta:'Triste', opts:['Feliz','Contento','Animado'] },
  { palabra:'Enorme', tipo:'antonimo', correcta:'Diminuto', opts:['Gigante','Grande','Amplio'] },
  { palabra:'Rápido', tipo:'antonimo', correcta:'Lento', opts:['Veloz','Ágil','Ligero'] },
  { palabra:'Ordenado', tipo:'antonimo', correcta:'Desordenado', opts:['Prolijo','Cuidadoso','Organizado'] },
  { palabra:'Valiente', tipo:'antonimo', correcta:'Cobarde', opts:['Audaz','Arriesgado','Decidido'] },
  { palabra:'Húmedo', tipo:'antonimo', correcta:'Seco', opts:['Mojado','Empapado','Chorreando'] },
];
export function genSinonimosAntonimosEpjaN1Round(){
  const recurso = 'Un <b>sinónimo</b> es una palabra que significa casi lo mismo que otra ("contento" y "alegre"), y un <b>antónimo</b> es una palabra de significado opuesto ("alegre" y "triste"). Conocer sinónimos y antónimos sirve para dos cosas muy prácticas: expresarse con más variedad (para no repetir siempre la misma palabra) y entender palabras nuevas a partir del contexto en que aparecen — si en una frase todo indica que algo salió mal, una palabra desconocida junto a esa idea probablemente tenga un significado negativo, aunque nunca antes la hayas visto. Esta habilidad de "adivinar" el significado por el contexto es tan útil como memorizar definiciones, porque funciona incluso con palabras que aparecen por primera vez.';
  const item = pick(SIGNIFICADO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  const pregunta = item.tipo==='sinonimo' ? '¿Cuál palabra significa casi lo mismo que "'+item.palabra+'"?' : '¿Cuál palabra significa lo opuesto a "'+item.palabra+'"?';
  return {
    promptHTML: '<p class="prompt-hint">'+pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: pregunta, cols:2, panel:true,
    explain: item.tipo==='sinonimo' ? '"'+item.correcta+'" significa casi lo mismo que "'+item.palabra+'".' : '"'+item.correcta+'" significa lo opuesto a "'+item.palabra+'".',
    recurso: recurso,
  };
}

const TIPOS_TEXTO_BANK = [
  { ejemplo:'"Estimados vecinos: los invitamos a la reunión de la junta de vecinos este jueves a las 19:00 en la sede social."', correcta:'Carta o comunicado formal', opts:['Receta de cocina','Noticia de un diario','Instrucciones de armado'] },
  { ejemplo:'"1. Retire la tapa. 2. Vierta el contenido en un vaso con agua. 3. Revuelva por 10 segundos. 4. Deje reposar 2 minutos antes de beber."', correcta:'Instrucciones o receta', opts:['Carta personal','Aviso de arriendo','Noticia deportiva'] },
  { ejemplo:'"SE ARRIENDA pieza amoblada, sector centro, incluye baño privado. Consultar por WhatsApp al número indicado."', correcta:'Aviso clasificado', opts:['Cuento breve','Receta de cocina','Carta de despedida'] },
  { ejemplo:'"El Banco Central informó ayer que la inflación de este mes se mantuvo estable en comparación con el mes anterior."', correcta:'Noticia', opts:['Instrucción de uso','Carta personal','Aviso de evento'] },
  { ejemplo:'"Querido hermano: hace tiempo que no sé de ti. Espero que estés bien junto a tu familia. Escríbeme pronto contándome cómo va todo."', correcta:'Carta personal', opts:['Aviso clasificado','Noticia','Instrucciones de armado'] },
  { ejemplo:'"El agua es un recurso esencial para la vida: se usa para beber, para cultivar alimentos y para generar energía en muchas centrales eléctricas."', correcta:'Texto informativo', opts:['Receta de cocina','Carta formal','Aviso clasificado'] },
  { ejemplo:'"Ingredientes: 2 tazas de harina, 1 huevo, una pizca de sal. Mezcle todo hasta formar una masa homogénea."', correcta:'Receta de cocina', opts:['Noticia','Carta personal','Aviso de trabajo'] },
  { ejemplo:'"SE BUSCA personal de aseo, turno mañana, experiencia no excluyente. Presentarse con currículum en la dirección indicada."', correcta:'Aviso de trabajo', opts:['Cuento','Instrucciones de uso','Noticia internacional'] },
];
export function genTiposTextoEpjaN1Round(){
  const recurso = 'Cada <b>tipo de texto</b> tiene un propósito distinto y por eso se organiza de forma distinta: una <b>carta</b> tiene saludo, cuerpo y despedida, y busca comunicarse con alguien específico; un <b>aviso</b> destaca la información más importante de forma breve y directa, para captar la atención rápido; una <b>noticia</b> informa sobre un hecho reciente, generalmente respondiendo qué pasó, cuándo y dónde; una <b>receta</b> o <b>instrucción</b> ordena pasos en una secuencia clara, porque el orden importa para lograr el resultado esperado; y un <b>texto informativo</b> explica un tema con datos, sin buscar contar una historia ni convencer de algo. Reconocer el tipo de texto por su estructura (antes de leerlo completo) ayuda a saber qué esperar de él y a leerlo de la forma más eficiente para el propósito que tiene.';
  const item = pick(TIPOS_TEXTO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.ejemplo+'</p><p class="prompt-hint">¿Qué tipo de texto es este?</p>',
    options: opts, correctValue: item.correcta, speakText: item.ejemplo, cols:2, panel:true,
    explain: 'Este es un ejemplo de: '+item.correcta.toLowerCase()+'.',
    recurso: recurso,
  };
}

const GRAMATICA_ORTOGRAFIA_EPJA_N1_BANK = [
  { pregunta:'"Los trabajador___ llegaron temprano." ¿Qué palabra completa correctamente la oración?', correcta:'Trabajadores', opts:['Trabajador','Trabajadoras','Trabajadore'] },
  { pregunta:'"La niña compró dos manzana___ en el mercado." ¿Qué palabra completa correctamente la oración?', correcta:'Manzanas', opts:['Manzana','Manzanos','Manzanitas'] },
  { pregunta:'¿Cuál de estas palabras está escrita con la tilde correcta?', correcta:'Camión', opts:['Camion','Cámion','Camióm'] },
  { pregunta:'¿Cuál de estas palabras está escrita con la tilde correcta?', correcta:'Médico', opts:['Medico','Médicó','Medíco'] },
  { pregunta:'¿Cuál de estas oraciones usa la mayúscula correctamente?', correcta:'María vive en Santiago.', opts:['maría vive en Santiago.','María vive en santiago.','María Vive En Santiago.'] },
  { pregunta:'¿Dónde debería ir el punto final en esta oración: "Llegué temprano al trabajo hoy"?', correcta:'Al final de la oración: "Llegué temprano al trabajo hoy."', opts:['Después de "temprano"','Después de "trabajo"','No necesita punto final'] },
  { pregunta:'"Compré pan, leche___ y huevos en el almacén." ¿Qué signo de puntuación falta?', correcta:'Una coma después de "leche"', opts:['Un punto después de "leche"','Dos puntos después de "leche"','No falta ningún signo'] },
  { pregunta:'¿Cuál de estas oraciones tiene concordancia correcta entre sujeto y verbo?', correcta:'Los estudiantes llegaron a tiempo.', opts:['Los estudiantes llegó a tiempo.','El estudiante llegaron a tiempo.','Los estudiante llegaron a tiempo.'] },
  { pregunta:'¿Cuál de estas palabras necesita tilde?', correcta:'Difícil', opts:['Dificil','Dificíl','Dificill'] },
];
export function genGramaticaOrtografiaEpjaN1Round(){
  const recurso = 'Escribir con corrección ayuda a que un texto se entienda sin esfuerzo y transmita una buena impresión. La <b>concordancia de género y número</b> exige que el sustantivo, el artículo y el adjetivo coincidan entre sí (no se dice "la niño bonito", sino "el niño bonito"). Las <b>tildes</b> siguen reglas según dónde cae la fuerza de la voz al pronunciar la palabra: muchas palabras que terminan en vocal, n o s llevan tilde cuando la fuerza cae en la última sílaba (como "camión") o en la antepenúltima (como "médico"). Las <b>mayúsculas</b> se usan al empezar una oración y en nombres propios de personas y lugares. Y los <b>signos de puntuación</b> (coma, punto, dos puntos) ordenan las ideas dentro de una oración para que se lean con la pausa correcta, evitando confusiones sobre qué palabra va con cuál.';
  const item = pick(GRAMATICA_ORTOGRAFIA_EPJA_N1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: recurso,
  };
}

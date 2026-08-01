import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 3 de Educación Básica: Lengua Castellana y Comunicación ----------------
   Nivel 3 Básica equivale a 7°-8° básico (ver content/grades.js). Igual que Nivel 2 (a
   diferencia de Nivel 1, ya migrado a las nuevas Bases EPJA 2024), Nivel 3 Básica TODAVÍA
   se rige por el decreto anterior: fuente real es el "Temario Tercer Nivel de Educación
   Básica — Proceso de exámenes de Validación de Estudios Adultos (mayores de 18 años)",
   Decreto Supremo N°257 de 2009, Ministerio de Educación (epja.mineduc.cl, versión 2026
   2do semestre — documento combinado con los 4 subsectores de Nivel 3 en un solo PDF,
   mismo patrón que el usado para Nivel 2). El temario de "NB3 Lengua Castellana y
   Comunicación" lista un solo eje ("Comprender lecturas de textos literarios -narrativos,
   líricos y dramáticos- y no literarios -cartas, afiches/avisos, noticias, recetas,
   instrucciones, textos informativos-") con 11 objetivos puntuales: información explícita;
   inferir el sentido global (temas/propósitos); identificar el tipo de texto según su
   estructura y contenido; inferir información del texto; identificar aspectos físicos y
   psicológicos de personajes; identificar sentimientos presentes en un poema; inferir el
   sentido de una palabra/expresión por claves contextuales; reemplazar una palabra por su
   sinónimo; identificar emisor y receptor de un texto; distinguir hechos de opiniones; y
   fundamentar una opinión ejemplificando con información del texto.
   A diferencia de NB2 (que sí pedía identificar elementos estructurales de una noticia:
   epígrafe/título/bajada/cuerpo), el temario de NB3 no menciona ese detalle — su eje de
   "tipo de texto" queda en un nivel más general (reconocer el tipo por su estructura y
   contenido), así que el módulo correspondiente aquí es más simple que su equivalente en
   Nivel 2, sin inventar un sub-eje que el temario no pide.
   Los 4 módulos de este archivo cubren el eje completo: Comprensión de Lectura (info
   explícita, inferencia de sentido global, personajes, sentimientos del poema),
   Vocabulario en Contexto (sentido de palabra/expresión por contexto, sinónimos),
   Tipos de Texto y Emisor-Receptor, y Hechos y Opiniones (distinguir y fundamentar).
   Ningún OA de NB3 Lenguaje queda fuera del motor de opción múltiple, ya que este eje no
   incluye producción escrita. Mismo criterio que Nivel 1/2: ejemplos y contextos de vida
   adulta (trabajo, familia, comunidad, trámites), nunca escolares/infantiles. */

export const LENGUAJE_EPJA_N3_MODULES = [
  {id:'comprensionEpjaN3', label:'Comprensión de Lectura', open:true, key:'comprensionEpjaN3'},
  {id:'vocabularioContextoEpjaN3', label:'Vocabulario en Contexto', open:true, key:'vocabularioContextoEpjaN3'},
  {id:'tiposTextoEpjaN3', label:'Tipos de Texto y Comunicación', open:true, key:'tiposTextoEpjaN3'},
  {id:'hechosOpinionesEpjaN3', label:'Hechos y Opiniones', open:true, key:'hechosOpinionesEpjaN3'},
];
export const LENGUAJE_EPJA_N3_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

const RECURSO_COMPRENSION_N3 = 'Comprender un texto implica reconocer la <b>información explícita</b> (lo que dice literalmente) e <b>inferir</b> lo que no está escrito de forma directa, apoyándose en pistas del propio texto: el sentido global de lo que se lee (de qué trata, con qué propósito se escribió), los rasgos físicos y psicológicos de un personaje (aunque el texto no los nombre con esas palabras exactas), o el sentimiento que transmite un poema a través de sus imágenes. Esta habilidad de leer "entre líneas" es la misma que se usa constantemente en la vida adulta: entender el verdadero propósito de una carta formal, seguir el argumento completo de una noticia, o captar la emoción detrás de un poema o una canción.';
const COMPRENSION_EPJA_N3_BANK = [
  { texto:'Doña Elena crió sola a sus cuatro hijos trabajando de lavandera. Nunca se quejó del cansancio frente a ellos, y cada noche, por agotada que estuviera, se sentaba a revisar sus tareas escolares.', pregunta:'Según el relato, ¿qué rasgo de personalidad tiene Doña Elena?', correcta:'Es una persona perseverante y dedicada a sus hijos', opts:['Es una persona indiferente ante sus hijos','Es una persona que evita el esfuerzo','Es una persona que se queja constantemente'] },
  { texto:'Vuelvo a caminar por la misma vereda,\ndonde el tiempo dejó sus huellas de piedra.\nAunque el cuerpo se cansa con los años,\nel corazón guarda intacta la esperanza.', pregunta:'¿Qué sentimiento predomina en este poema?', correcta:'Esperanza a pesar del paso del tiempo', opts:['Rabia por haber envejecido','Total desesperanza','Indiferencia ante el futuro'] },
  { texto:'Estimado Director: Por medio de la presente, solicito una entrevista para exponer mi situación laboral, ya que considero que mi caso amerita una revisión de las condiciones actuales de mi contrato.', pregunta:'¿Cuál es el propósito principal de esta carta?', correcta:'Solicitar una entrevista para revisar sus condiciones laborales', opts:['Renunciar de inmediato a su trabajo','Reclamar por el sueldo de otro trabajador','Informar sobre un cambio de domicilio'] },
  { texto:'El municipio anunció que el programa de capacitación laboral para adultos se extenderá por seis meses más, tras registrarse una alta demanda de inscripciones durante el primer semestre.', pregunta:'Según la noticia, ¿por qué se extendió el programa de capacitación?', correcta:'Por la alta demanda de inscripciones registrada', opts:['Porque nadie se había inscrito','Porque se acabó el presupuesto','Porque el programa fracasó'] },
  { texto:'Primero, Rodrigo terminó su turno en la fábrica a las seis de la tarde. Luego, tomó el bus hacia la escuela nocturna. Finalmente, después de tres horas de clases, llegó a su casa pasada la medianoche.', pregunta:'Según el relato, ¿qué hizo Rodrigo justo antes de llegar a su casa?', correcta:'Asistió a tres horas de clases en la escuela nocturna', opts:['Terminó su turno en la fábrica','Tomó el bus hacia el trabajo','Descansó toda la tarde'] },
  { texto:'AVISO: Se busca compañero de estudio para preparar juntos el examen de Matemática de Nivel 3. Interesado, contactar a Francisco al finalizar la clase del jueves.', pregunta:'¿Qué se le pide exactamente a quien esté interesado en este aviso?', correcta:'Contactar a Francisco al finalizar la clase del jueves', opts:['Inscribirse en la oficina de la escuela','Enviar un correo electrónico ahora mismo','Comprar un libro de matemática'] },
  { texto:'Ahorrar en el consumo de agua no solo reduce la boleta mensual: también alivia la presión sobre los embalses en épocas de sequía, un beneficio que va más allá del bolsillo de cada familia.', pregunta:'¿Cuál es la idea principal de este texto?', correcta:'Ahorrar agua trae beneficios más allá del ahorro económico personal', opts:['Los embalses ya no son necesarios','El agua nunca escasea en ningún lugar','Ahorrar agua es imposible de lograr'] },
  { texto:'Marcela entró a la sala de reuniones con la espalda erguida, la mirada firme y una carpeta bajo el brazo, lista para presentar su propuesta.', pregunta:'Según la descripción, ¿qué actitud transmite Marcela?', correcta:'Confianza y preparación', opts:['Nerviosismo evidente','Desinterés total','Cansancio extremo'] },
  { texto:'Manos curtidas por años de trabajo en la obra,\nque hoy levantan la casa que serán su descanso.\nEl esfuerzo de tantas madrugadas\nse transforma, por fin, en un techo propio.', pregunta:'¿Qué sentimiento predomina en este poema?', correcta:'Satisfacción por el fruto del esfuerzo propio', opts:['Envidia hacia otras personas','Miedo al futuro','Vergüenza por el trabajo realizado'] },
  { texto:'Para solicitar el certificado de estudios: 1) Complete el formulario disponible en la secretaría. 2) Adjunte una fotocopia de su cédula de identidad. 3) Pague el arancel correspondiente. 4) Retire el documento en un plazo de cinco días hábiles.', pregunta:'Según las instrucciones, ¿qué se debe hacer justo después de completar el formulario?', correcta:'Adjuntar una fotocopia de la cédula de identidad', opts:['Retirar el documento de inmediato','Pagar el arancel primero','Esperar sin hacer nada más'] },
];
export function genComprensionEpjaN3Round(){
  const item = pick(COMPRENSION_EPJA_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COMPRENSION_N3,
  };
}

const RECURSO_VOCABULARIO_N3 = 'El significado exacto de una palabra muchas veces depende del <b>contexto</b> en que aparece: las palabras y la situación que la rodean dan pistas claras sobre su sentido, incluso cuando la palabra es poco conocida o tiene varios significados posibles. Reemplazar una palabra por su <b>sinónimo</b> dentro de una oración (sin que la oración pierda su sentido original) permite comprobar si realmente se entendió su significado, y también enriquece la forma de expresarse al hablar o escribir, evitando repetir siempre la misma palabra — una habilidad útil tanto para leer un documento formal como para redactar una carta o un currículum.';
const VOCABULARIO_CONTEXTO_N3_BANK = [
  { oracion:'La empresa decidió postergar la contratación hasta el próximo trimestre.', palabra:'postergar', correcta:'Aplazar', opts:['Cancelar para siempre','Adelantar','Anunciar públicamente'] },
  { oracion:'El testigo declaró con mucha coherencia, sin contradecirse en ningún momento.', palabra:'coherencia', correcta:'Lógica y consistencia', opts:['Confusión','Rapidez','Silencio'] },
  { oracion:'El nuevo reglamento busca fomentar la puntualidad y el compromiso entre los trabajadores.', palabra:'fomentar', correcta:'Impulsar', opts:['Prohibir','Ignorar','Castigar'] },
  { oracion:'La reunión sindical se realizó en un ambiente cordial, sin ningún conflicto.', palabra:'cordial', correcta:'Amable', opts:['Hostil','Tenso','Indiferente'] },
  { oracion:'El documento contenía cláusulas ambiguas que generaron dudas entre los firmantes.', palabra:'ambiguas', correcta:'Con doble sentido o poco claras', opts:['Muy precisas','Escritas en otro idioma','Ilegales'] },
  { oracion:'Su actitud perseverante durante el curso sorprendió a sus propios compañeros.', palabra:'perseverante', correcta:'Constante y tenaz', opts:['Distraída','Indiferente','Impaciente'] },
  { oracion:'El accidente dejó el tránsito obstruido durante varias horas de la mañana.', palabra:'obstruido', correcta:'Bloqueado', opts:['Despejado','Ampliado','Iluminado'] },
  { oracion:'La entrevista laboral fue breve, pero suficiente para dejar una buena impresión.', palabra:'breve', correcta:'Corta', opts:['Larga','Aburrida','Repetida'] },
  { oracion:'La noticia generó gran incertidumbre entre los vecinos del sector afectado.', palabra:'incertidumbre', correcta:'Duda o inseguridad', opts:['Alegría total','Certeza absoluta','Indiferencia'] },
  { oracion:'El supervisor fue muy meticuloso al revisar cada detalle del informe.', palabra:'meticuloso', correcta:'Cuidadoso y detallista', opts:['Descuidado','Apresurado','Distraído'] },
];
export function genVocabularioContextoEpjaN3Round(){
  const item = pick(VOCABULARIO_CONTEXTO_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">En esta oración, ¿qué significa la palabra "'+item.palabra+'"?</p>',
    options: opts, correctValue: item.correcta, speakText: item.oracion+' ¿Qué significa la palabra '+item.palabra+' en esta oración?', cols:2, panel:true,
    explain: 'En esta oración, "'+item.palabra+'" significa: '+item.correcta+'.',
    recurso: RECURSO_VOCABULARIO_N3,
  };
}

const RECURSO_TIPOS_TEXTO_N3 = 'Cada <b>tipo de texto</b> se reconoce por su estructura y su contenido característico: una <b>carta formal</b> tiene saludo, cuerpo y despedida con un lenguaje respetuoso; un <b>aviso</b> destaca información breve y directa; una <b>instrucción</b> o <b>receta</b> ordena pasos en secuencia numerada; una <b>noticia</b> informa sobre un hecho reciente de interés público. En todo texto también existe un <b>emisor</b> (quien escribe o comunica el mensaje) y un <b>receptor</b> (a quien está dirigido) — identificarlos ayuda a entender el propósito real de lo que se está leyendo, algo especialmente útil al enfrentar trámites, cartas laborales o comunicados oficiales.';
const TIPOS_TEXTO_N3_BANK = [
  { modo:'tipo', ejemplo:'"Estimado señor Director: Junto con saludarlo, quedo atento a su respuesta. Se despide atentamente, Juan Pérez."', correcta:'Carta formal', opts:['Receta de cocina','Noticia policial','Aviso clasificado'] },
  { modo:'tipo', ejemplo:'"1) Retire el molde del horno. 2) Deje enfriar por 10 minutos. 3) Desmolde con cuidado. 4) Sirva con la salsa preparada."', correcta:'Receta de cocina', opts:['Carta personal','Aviso de arriendo','Noticia internacional'] },
  { modo:'tipo', ejemplo:'"SE ARRIENDA: pieza amoblada, cerca de la locomoción. Interesados llamar al número indicado después de las 19:00."', correcta:'Aviso clasificado', opts:['Cuento breve','Receta de cocina','Carta de agradecimiento'] },
  { modo:'tipo', ejemplo:'"Ayer se registró un aumento en la demanda de horas en los consultorios de la comuna, según informó la autoridad sanitaria local."', correcta:'Noticia', opts:['Receta de cocina','Carta personal','Instrucciones de uso'] },
  { modo:'emisorreceptor', escenario:'Un trabajador redacta una carta dirigida al jefe de recursos humanos de su empresa.', pregunta:'¿Quién es el receptor de este texto?', correcta:'El jefe de recursos humanos', opts:['El trabajador','Un compañero cualquiera','El texto no tiene receptor'] },
  { modo:'emisorreceptor', escenario:'Una madre le escribe una carta a su hijo que está cumpliendo el servicio militar en otra ciudad.', pregunta:'¿Quién es el emisor de este texto?', correcta:'La madre', opts:['El hijo','El cartero','Un vecino'] },
  { modo:'emisorreceptor', escenario:'Un dirigente vecinal envía una circular informativa a todos los vecinos de la junta de vecinos.', pregunta:'¿Quién es el receptor de este texto?', correcta:'Todos los vecinos de la junta de vecinos', opts:['Solo el dirigente vecinal','La municipalidad únicamente','Nadie en particular'] },
  { modo:'emisorreceptor', escenario:'Una profesora de la escuela nocturna envía un comunicado a sus estudiantes sobre la fecha del examen.', pregunta:'¿Quién es el emisor de este texto?', correcta:'La profesora', opts:['Los estudiantes','El director de la escuela','Un apoderado'] },
];
export function genTiposTextoEpjaN3Round(){
  const item = pick(TIPOS_TEXTO_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  if(item.modo==='tipo'){
    return {
      promptHTML: '<p class="prompt-sentence">'+item.ejemplo+'</p><p class="prompt-hint">¿Qué tipo de texto es este?</p>',
      options: opts, correctValue: item.correcta, speakText: item.ejemplo, cols:2, panel:true,
      explain: 'Este es un ejemplo de: '+item.correcta+'.',
      recurso: RECURSO_TIPOS_TEXTO_N3,
    };
  }
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_TIPOS_TEXTO_N3,
  };
}

const RECURSO_HECHOS_OPINIONES_N3 = 'Un <b>hecho</b> es algo que ocurrió y se puede comprobar (una fecha, un dato, un suceso real), mientras que una <b>opinión</b> es un juicio o valoración personal que puede variar de una persona a otra. Distinguirlos es clave para leer con sentido crítico, ya que una noticia o un comentario puede mezclar hechos comprobables con opiniones de quien lo escribe. Además, una buena opinión se <b>fundamenta</b> con una razón concreta que la respalde — no basta con decir que algo "es bueno" o "es malo", sino explicar por qué, apoyándose en algún aspecto real de la situación o del texto.';
const HECHOS_OPINIONES_N3_BANK = [
  { modo:'clasificar', enunciado:'"El curso de electricidad dura seis meses y se dicta los martes y jueves."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Ese es el mejor curso de electricidad que se ha dictado en esta escuela."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"El sueldo mínimo aumentó este año según lo anunciado por el Gobierno."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Cualquier aumento de sueldo siempre resulta insuficiente."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"El consultorio atendió a 60 personas durante la jornada de la mañana."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Ese consultorio es el que atiende peor de toda la región."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"La reunión de apoderados comenzó a las 19:00 horas."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Fue la reunión de apoderados más aburrida de todo el año."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'fundamentar', escenario:'Un estudiante adulto opina: "Retomar mis estudios fue la mejor decisión que he tomado."', pregunta:'¿Cuál de estas razones fundamenta mejor esa opinión?', correcta:'Porque le permitió acceder a un mejor puesto de trabajo', opts:['Porque las clases son cerca de su casa','Porque el profesor tiene el mismo apellido que él','Porque el curso dura poco tiempo'] },
  { modo:'fundamentar', escenario:'Una vecina opina: "El taller de manualidades de la junta de vecinos ha sido muy útil."', pregunta:'¿Cuál de estas razones fundamenta mejor esa opinión?', correcta:'Porque aprendió una nueva forma de generar ingresos extra', opts:['Porque el taller queda cerca de su casa','Porque la sala tiene buena iluminación','Porque el taller dura poco tiempo'] },
];
export function genHechosOpinionesEpjaN3Round(){
  const item = pick(HECHOS_OPINIONES_N3_BANK);
  if(item.modo==='clasificar'){
    const opts = shuffle(['Hecho','Opinión']).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.enunciado+'</p><p class="prompt-hint">¿Esta afirmación es un hecho o una opinión?</p>',
      options: opts, correctValue: item.correcta, speakText: item.enunciado+' ¿Es un hecho o una opinión?', cols:2, panel:true,
      explain: 'Esta afirmación es un <b>'+item.correcta+'</b>.',
      recurso: RECURSO_HECHOS_OPINIONES_N3,
    };
  }
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' '+item.pregunta, cols:2, panel:true,
    explain: 'La razón que mejor fundamenta esa opinión es: '+item.correcta+'.',
    recurso: RECURSO_HECHOS_OPINIONES_N3,
  };
}

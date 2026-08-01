import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Básica: Lengua Castellana y Comunicación ----------------
   Nivel 2 Básica equivale a 5°-6° básico (ver content/grades.js). A diferencia de Nivel 1
   (Lenguaje/Matemática ya migrados a las nuevas Bases Curriculares EPJA 2024, Decreto
   Supremo N°10/2022), Nivel 2 Básica TODAVÍA se rige por el decreto anterior: fuente real
   es el "Temario Segundo Nivel de Educación Básica — Proceso de exámenes de Validación de
   Estudios Adultos (mayores de 18 años)", Decreto Supremo N°257 de 2009, Ministerio de
   Educación (epja.mineduc.cl, versión 2026 1er semestre — el documento combinado más
   reciente al momento de construir este módulo, con los 4 subsectores de Nivel 2 en un
   solo PDF). El temario de "NB2 Lengua Castellana y Comunicación" lista un solo eje
   ("Comprender lecturas de textos literarios -narrativos, líricos y dramáticos- y no
   literarios -cartas, afiches/avisos, noticias, recetas, instrucciones, textos
   informativos-") con 13 objetivos puntuales: identificar información explícita; inferir
   el sentido global (temas/propósitos); identificar el tipo de texto según su estructura;
   inferir a partir de pistas textuales; identificar aspectos físicos y psicológicos de
   personajes; ordenar secuencias de un relato; identificar sentimientos en un poema;
   inferir el sentido de una palabra por contexto; reemplazar una palabra por su sinónimo;
   identificar emisor/receptor; identificar elementos de una noticia (epígrafe, título,
   bajada, cuerpo); distinguir hechos de opiniones; y fundamentar una opinión simple.
   Los 4 módulos de este archivo cubren ese eje completo: Comprensión de Lectura (info
   explícita, inferencia, personajes, secuencia, sentimientos del poema), Vocabulario en
   Contexto (sentido de palabra/expresión por contexto, sinónimos en oración), Tipos de
   Texto y Estructura de la Noticia (tipo de texto por estructura, elementos de una
   noticia, emisor/receptor), y Hechos y Opiniones (distinguir y fundamentar). Ningún OA
   de NB2 Lenguaje queda fuera del motor de opción múltiple, ya que a diferencia de Nivel
   1 este eje no incluye un componente de producción escrita.
   Mismo criterio que lenguajeNivel1.js: ejemplos y contextos de vida adulta (trabajo,
   familia, comunidad, trámites), nunca escolares/infantiles. */

export const LENGUAJE_EPJA_N2_MODULES = [
  {id:'comprensionEpjaN2', label:'Comprensión de Lectura', open:true, key:'comprensionEpjaN2'},
  {id:'vocabularioContextoEpjaN2', label:'Vocabulario en Contexto', open:true, key:'vocabularioContextoEpjaN2'},
  {id:'tiposTextoEpjaN2', label:'Tipos de Texto y Noticia', open:true, key:'tiposTextoEpjaN2'},
  {id:'hechosOpinionesEpjaN2', label:'Hechos y Opiniones', open:true, key:'hechosOpinionesEpjaN2'},
];
export const LENGUAJE_EPJA_N2_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

const RECURSO_COMPRENSION_N2 = 'Comprender un texto va más allá de reconocer sus palabras: incluye identificar información <b>explícita</b> (lo que el texto dice literalmente) e <b>inferir</b> lo que no está escrito directamente, apoyándose en pistas del propio texto — el sentido global (de qué trata, para qué se escribió), los rasgos físicos y psicológicos de un personaje (aunque el texto no los describa con esas palabras exactas), el orden en que ocurrieron los hechos de un relato, o el sentimiento que transmite un poema a través de sus imágenes y palabras. Esta habilidad de leer "entre líneas" se aplica constantemente en la vida diaria: entender el tono de una carta, seguir el hilo de una noticia, o captar la emoción detrás de un poema o una canción.';

const COMPRENSION_EPJA_N2_BANK = [
  { texto:'Don Manuel llevaba treinta años arreglando bicicletas en el mismo local del barrio. Nunca cobraba de más a los niños, y si alguien no tenía cómo pagar, igual les dejaba la bicicleta lista "para la otra semana". Todos en el barrio sabían que podían confiar en él.', pregunta:'Según el relato, ¿qué rasgo de personalidad tiene Don Manuel?', correcta:'Es una persona generosa y confiable', opts:['Es una persona desconfiada y avara','Es una persona indiferente ante los demás','Es una persona impaciente y exigente'] },
  { texto:'Camino sin rumbo por la calle vacía,\ny pienso en los años que ya se fueron.\nAunque el frío de la noche me acompaña,\nguardo la esperanza de un nuevo día.', pregunta:'¿Qué sentimiento predomina en este poema?', correcta:'Esperanza a pesar de la nostalgia', opts:['Alegría desbordante y sin motivo','Furia contra el paso del tiempo','Total indiferencia ante el futuro'] },
  { texto:'Primero, Rosa dejó su trabajo en la fábrica. Luego, decidió inscribirse en un curso de costura por las tardes. Finalmente, después de seis meses de práctica, abrió su propio taller de confección en la casa de su madre.', pregunta:'Según el relato, ¿qué ocurrió justo antes de que Rosa abriera su taller?', correcta:'Practicó costura durante seis meses', opts:['Dejó su trabajo en la fábrica','Se cambió de casa','Contrató a una ayudante'] },
  { texto:'Estimada administración: Le escribo para solicitar un plazo adicional de una semana para el pago de mi cuota, debido a que mi empleador atrasó el depósito de mi sueldo este mes. Agradezco de antemano su comprensión.', pregunta:'¿Cuál es el propósito principal de esta carta?', correcta:'Solicitar más plazo para pagar una cuota atrasada', opts:['Reclamar por un cobro injusto','Anunciar que dejará de pagar la cuota','Pedir información sobre otro trámite'] },
  { texto:'La Municipalidad informó ayer que la vacunación contra la influenza se extenderá hasta fin de mes en todos los consultorios de la comuna, debido a la alta demanda registrada durante las primeras semanas.', pregunta:'Según la noticia, ¿por qué se extendió el plazo de vacunación?', correcta:'Por la alta demanda registrada', opts:['Porque llegaron pocas vacunas','Porque se cambió de comuna','Porque terminó antes de lo previsto'] },
  { texto:'AVISO: Se solicita compañera de curso para compartir gastos de fotocopias y materiales del taller de electricidad. Interesada, hablar con Marisol después de la clase del martes.', pregunta:'¿Qué se le pide exactamente a quien esté interesada en este aviso?', correcta:'Hablar con Marisol después de la clase del martes', opts:['Enviar un mensaje de texto ahora mismo','Inscribirse en la oficina de la escuela','Comprar los materiales por su cuenta'] },
  { texto:'El ahorro de energía en el hogar no solo reduce la cuenta de luz: también disminuye la demanda sobre las centrales eléctricas y, con ello, la cantidad de combustible que se quema para generar esa energía.', pregunta:'¿Cuál es la idea principal de este texto?', correcta:'Ahorrar energía en la casa trae beneficios más allá de la cuenta de luz', opts:['Las centrales eléctricas deben cerrar pronto','El combustible es más barato que la electricidad','Ahorrar energía es imposible en la práctica'] },
  { texto:'Pedro entró a la sala con los hombros caídos y la mirada fija en el suelo, arrastrando los pies como si cada paso le costara un esfuerzo enorme.', pregunta:'Según la descripción, ¿qué estado de ánimo transmite Pedro con su forma de caminar?', correcta:'Cansancio o desánimo', opts:['Entusiasmo y energía','Alegría desbordante','Curiosidad por lo que vendrá'] },
  { texto:'Manos gastadas por el trabajo del campo,\nque un día sembraron y hoy cosechan calma.\nEl sol ya no quema como en la juventud,\npero la tierra sigue dando su recompensa.', pregunta:'¿Qué sentimiento predomina en este poema?', correcta:'Satisfacción tranquila por una vida de esfuerzo', opts:['Rabia por el trabajo duro','Miedo al futuro incierto','Vergüenza por los años vividos'] },
  { texto:'Para tramitar el certificado: 1) Complete el formulario en línea. 2) Adjunte una fotocopia de su cédula de identidad. 3) Espere la confirmación por correo electrónico. 4) Retire el documento en la oficina indicada.', pregunta:'Según las instrucciones, ¿qué se debe hacer justo después de completar el formulario?', correcta:'Adjuntar una fotocopia de la cédula de identidad', opts:['Retirar el documento de inmediato','Esperar sin hacer nada más','Pagar una multa por atraso'] },
];
export function genComprensionEpjaN2Round(){
  const item = pick(COMPRENSION_EPJA_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COMPRENSION_N2,
  };
}

const RECURSO_VOCABULARIO_N2 = 'El significado exacto de una palabra muchas veces depende del <b>contexto</b> en que aparece, es decir, de las palabras y la situación que la rodean. Cuando una palabra es desconocida o tiene varios significados posibles, fijarse en el resto de la oración da pistas claras: si la oración habla de algo positivo, la palabra probablemente tenga un sentido positivo, y viceversa. Reemplazar una palabra por su <b>sinónimo</b> dentro de una oración (sin que la oración pierda su sentido original) es una forma útil de comprobar si realmente se entendió su significado — y también permite expresarse con más variedad al hablar o escribir, evitando repetir siempre la misma palabra.';
const VOCABULARIO_CONTEXTO_N2_BANK = [
  { oracion:'Después de meses de esfuerzo, por fin logró estabilizar su situación económica.', palabra:'estabilizar', correcta:'Ordenar y afirmar', opts:['Empeorar y desordenar','Ocultar por completo','Aumentar sin control'] },
  { oracion:'El testigo relató los hechos con mucha precisión, sin omitir ningún detalle importante.', palabra:'precisión', correcta:'Exactitud', opts:['Confusión','Rapidez extrema','Desinterés'] },
  { oracion:'La reunión se postergó porque el encargado tuvo un imprevisto de último minuto.', palabra:'postergó', correcta:'Se aplazó', opts:['Se canceló para siempre','Se adelantó','Se realizó igual'] },
  { oracion:'El médico le recomendó una dieta equilibrada para mejorar su salud.', palabra:'equilibrada', correcta:'Balanceada', opts:['Escasa','Excesiva','Desordenada'] },
  { oracion:'Su actitud generosa sorprendió a todos los vecinos del edificio.', palabra:'generosa', correcta:'Desprendida', opts:['Egoísta','Indiferente','Temerosa'] },
  { oracion:'El documento contenía información confidencial que no debía divulgarse.', palabra:'confidencial', correcta:'Reservada', opts:['Pública','Falsa','Antigua'] },
  { oracion:'Tras el accidente, el tránsito quedó completamente obstruido por varias horas.', palabra:'obstruido', correcta:'Bloqueado', opts:['Despejado','Ampliado','Iluminado'] },
  { oracion:'La entrevista de trabajo fue breve, pero suficiente para dejar una buena impresión.', palabra:'breve', correcta:'Corta', opts:['Larga','Aburrida','Repetida'] },
  { oracion:'El nuevo reglamento busca fomentar la puntualidad entre los trabajadores.', palabra:'fomentar', correcta:'Impulsar', opts:['Prohibir','Ignorar','Castigar'] },
  { oracion:'La noticia causó gran incertidumbre entre los habitantes del sector.', palabra:'incertidumbre', correcta:'Duda o inseguridad', opts:['Alegría total','Certeza absoluta','Indiferencia'] },
];
export function genVocabularioContextoEpjaN2Round(){
  const item = pick(VOCABULARIO_CONTEXTO_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">En esta oración, ¿qué significa la palabra "'+item.palabra+'"?</p>',
    options: opts, correctValue: item.correcta, speakText: item.oracion+' ¿Qué significa la palabra '+item.palabra+' en esta oración?', cols:2, panel:true,
    explain: 'En esta oración, "'+item.palabra+'" significa: '+item.correcta.toLowerCase()+'.',
    recurso: RECURSO_VOCABULARIO_N2,
  };
}

const RECURSO_TIPOS_TEXTO_N2 = 'Cada <b>tipo de texto</b> se reconoce por su estructura característica: una <b>carta</b> tiene saludo, cuerpo y despedida; un <b>aviso</b> destaca información breve y directa; una <b>receta</b> o <b>instrucción</b> ordena pasos en secuencia. Una <b>noticia</b> tiene partes propias: el <b>epígrafe</b> (una frase corta sobre el tema general, encima del título), el <b>título</b> (resume la noticia en pocas palabras), la <b>bajada de título</b> (una o dos oraciones que amplían el título), y el <b>cuerpo</b> de la noticia (el texto completo con los detalles). En todo texto también existe un <b>emisor</b> (quien escribe o comunica el mensaje) y un <b>receptor</b> (a quien está dirigido) — identificarlos ayuda a entender el propósito real de lo que se está leyendo.';
const TIPOS_TEXTO_N2_BANK = [
  { modo:'tipo', ejemplo:'"Junto con saludar, quedo atenta a su respuesta a la brevedad posible. Se despide, Ana Muñoz."', correcta:'Carta formal', opts:['Receta de cocina','Noticia policial','Aviso clasificado'] },
  { modo:'tipo', ejemplo:'"1) Desconecte el aparato. 2) Retire la tapa trasera. 3) Cambie las pilas. 4) Vuelva a conectar el aparato."', correcta:'Instrucciones de uso', opts:['Carta personal','Aviso de arriendo','Noticia internacional'] },
  { modo:'tipo', ejemplo:'"SE VENDE: refrigerador en buen estado, poco uso. Interesados llamar al número indicado después de las 18:00."', correcta:'Aviso clasificado', opts:['Cuento breve','Receta de cocina','Carta de agradecimiento'] },
  { modo:'elemento', descripcion:'la frase corta que aparece encima del título de una noticia, indicando el tema general', correcta:'Epígrafe', opts:['Bajada de título','Cuerpo de la noticia','Firma del autor'] },
  { modo:'elemento', descripcion:'la parte de la noticia que resume el hecho principal en pocas palabras', correcta:'Título', opts:['Epígrafe','Bajada de título','Cuerpo de la noticia'] },
  { modo:'elemento', descripcion:'una o dos oraciones que amplían el título, ubicadas justo debajo de él', correcta:'Bajada de título', opts:['Epígrafe','Título','Cuerpo de la noticia'] },
  { modo:'elemento', descripcion:'el texto completo de la noticia, con todos los detalles del hecho', correcta:'Cuerpo de la noticia', opts:['Epígrafe','Título','Bajada de título'] },
  { modo:'emisorreceptor', escenario:'Una trabajadora social redacta un informe dirigido a la directora del centro comunitario.', pregunta:'¿Quién es el receptor de este texto?', correcta:'La directora del centro comunitario', opts:['La trabajadora social','Un vecino cualquiera','El texto no tiene receptor'] },
  { modo:'emisorreceptor', escenario:'Un padre le escribe una carta a su hija que vive en otra ciudad.', pregunta:'¿Quién es el emisor de este texto?', correcta:'El padre', opts:['La hija','El cartero','Un vecino'] },
  { modo:'emisorreceptor', escenario:'Un dirigente sindical envía una circular a todos los trabajadores de la empresa.', pregunta:'¿Quién es el receptor de este texto?', correcta:'Todos los trabajadores de la empresa', opts:['Solo el dirigente sindical','El dueño de la empresa únicamente','Nadie en particular'] },
];
export function genTiposTextoEpjaN2Round(){
  const item = pick(TIPOS_TEXTO_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  if(item.modo==='tipo'){
    return {
      promptHTML: '<p class="prompt-sentence">'+item.ejemplo+'</p><p class="prompt-hint">¿Qué tipo de texto es este?</p>',
      options: opts, correctValue: item.correcta, speakText: item.ejemplo, cols:2, panel:true,
      explain: 'Este es un ejemplo de: '+item.correcta.toLowerCase()+'.',
      recurso: RECURSO_TIPOS_TEXTO_N2,
    };
  }
  if(item.modo==='elemento'){
    return {
      promptHTML: '<p class="prompt-hint">¿Cómo se llama '+item.descripcion+'?</p>',
      options: opts, correctValue: item.correcta, speakText: '¿Cómo se llama '+item.descripcion+'?', cols:2, panel:true,
      explain: 'Esa parte de la noticia se llama: '+item.correcta.toLowerCase()+'.',
      recurso: RECURSO_TIPOS_TEXTO_N2,
    };
  }
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_TIPOS_TEXTO_N2,
  };
}

const RECURSO_HECHOS_OPINIONES_N2 = 'Un <b>hecho</b> es algo que ocurrió y se puede comprobar (por ejemplo, una fecha, un dato o un suceso real), mientras que una <b>opinión</b> es un juicio o valoración personal sobre algo, que puede variar de una persona a otra. Reconocer la diferencia es clave para leer con sentido crítico: una noticia puede mezclar hechos comprobables con opiniones de quien la escribe o de quien es entrevistado. Además, una buena opinión se <b>fundamenta</b> con una razón concreta que la respalde — no basta con decir que algo "gusta" o "no gusta", sino explicar por qué, apoyándose en algún aspecto real del texto o la situación.';
const HECHOS_OPINIONES_N2_BANK = [
  { modo:'clasificar', enunciado:'"La reunión de la junta de vecinos comenzó a las 19:00 horas."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Esa fue la mejor reunión de vecinos que se ha hecho en años."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"El consultorio atendió a 45 personas durante la mañana."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Ese consultorio es el que atiende peor de toda la comuna."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"El curso de electricidad dura seis meses y se dicta los martes."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Aprender electricidad es más útil que aprender cualquier otro oficio."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"El sueldo mínimo aumentó este año según lo anunciado por el Gobierno."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Cualquier aumento de sueldo siempre es insuficiente."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'fundamentar', escenario:'Un vecino opina: "Este taller de costura ha sido muy útil para mí."', pregunta:'¿Cuál de estas razones fundamenta mejor esa opinión?', correcta:'Porque aprendió a confeccionar ropa que antes debía comprar', opts:['Porque el taller queda cerca de su casa','Porque el instructor tiene el mismo apellido que él','Porque el taller dura poco tiempo'] },
  { modo:'fundamentar', escenario:'Una estudiante adulta opina: "Retomar mis estudios fue una buena decisión."', pregunta:'¿Cuál de estas razones fundamenta mejor esa opinión?', correcta:'Porque le permitió postular a un mejor trabajo', opts:['Porque las clases son los martes','Porque la escuela queda en el centro','Porque sus compañeros son simpáticos'] },
];
export function genHechosOpinionesEpjaN2Round(){
  const item = pick(HECHOS_OPINIONES_N2_BANK);
  if(item.modo==='clasificar'){
    const opts = shuffle(['Hecho','Opinión']).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.enunciado+'</p><p class="prompt-hint">¿Esta afirmación es un hecho o una opinión?</p>',
      options: opts, correctValue: item.correcta, speakText: item.enunciado+' ¿Es un hecho o una opinión?', cols:2, panel:true,
      explain: 'Esta afirmación es un <b>'+item.correcta.toLowerCase()+'</b>.',
      recurso: RECURSO_HECHOS_OPINIONES_N2,
    };
  }
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' '+item.pregunta, cols:2, panel:true,
    explain: 'La razón que mejor fundamenta esa opinión es: '+item.correcta.toLowerCase()+'.',
    recurso: RECURSO_HECHOS_OPINIONES_N2,
  };
}

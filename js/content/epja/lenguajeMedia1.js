import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Media: Lengua Castellana y Comunicación ----------------
   Nivel 1 Media equivale a 1°-2° medio (ver content/grades.js). Fuente real: "Temario Primer
   Nivel de Educación Media — Proceso de exámenes de Validación de Estudios Adultos (mayores
   de 18 años)", Decreto Supremo N°257 de 2009, Ministerio de Educación
   (epja.mineduc.cl/wp-content/uploads/sites/43/2026/02/Temario-nivel-1-de-media-2026_1er-semestre-vf.pdf).
   Este es el primer nivel de EPJA construido con 5 subsectores (agrega Idioma Extranjero
   Inglés, ver inglesMedia1.js) — mismo Decreto 257/2009 que Nivel 2/3 Básica, confirmando que
   la transición al nuevo currículum EPJA 2024 sigue sin alcanzar Educación Media.
   El temario de NM1 Lengua Castellana amplía el eje de comprensión respecto a Básica: agrega
   géneros dramáticos y cómic a los tipos de texto literario, pide identificar aspectos físicos
   Y psicológicos de personajes, reconocer la estructura del texto expositivo (introducción/
   desarrollo/conclusión) y sus formas básicas de discurso (descripción/definición/
   caracterización), analizar la función de recursos verbales y no verbales, fundamentar el
   tipo de mundo literario presente en un texto, y fundamentar opiniones propias argumentando
   y ejemplificando con información del texto — un nivel de exigencia mayor que Básica, que
   solo pedía distinguir/fundamentar de forma más simple.
   4 módulos: Comprensión de Lectura (info explícita, inferencia global, personajes físicos/
   psicológicos), Vocabulario en Contexto (sentido de palabra/expresión, sinónimos),
   Textos Expositivos y Discurso (estructura, formas del discurso, recursos verbales/no
   verbales), y Hechos, Opiniones y Argumentación (distinguir, fundamentar con información del
   texto, tipo de mundo literario). Ningún eje del temario queda fuera del motor de opción
   múltiple, ya que este subsector no exige producción escrita. Mismo criterio que niveles
   anteriores: ejemplos y contextos de vida adulta (trabajo, familia, comunidad, trámites). */

export const LENGUAJE_EPJA_M1_MODULES = [
  {id:'comprensionEpjaM1', label:'Comprensión de Lectura', open:true, key:'comprensionEpjaM1'},
  {id:'vocabularioContextoEpjaM1', label:'Vocabulario en Contexto', open:true, key:'vocabularioContextoEpjaM1'},
  {id:'textosExpositivosEpjaM1', label:'Textos Expositivos y Discurso', open:true, key:'textosExpositivosEpjaM1'},
  {id:'hechosOpinionesEpjaM1', label:'Hechos, Opiniones y Argumentación', open:true, key:'hechosOpinionesEpjaM1'},
];
export const LENGUAJE_EPJA_M1_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

const RECURSO_COMPRENSION_M1 = 'Comprender un texto en profundidad implica reconocer la <b>información explícita</b> (lo que dice literalmente) e <b>inferir</b> lo que no está escrito de forma directa: el sentido global del texto (su idea principal, tema o propósito), y los rasgos <b>físicos</b> (cómo es su apariencia) y <b>psicológicos</b> (cómo es su forma de ser) de un personaje, aunque el texto no los describa con esas palabras exactas. También es clave identificar el <b>tipo de texto</b> según su estructura y contenido (una carta no se lee ni se organiza igual que una noticia o un cómic) — esta misma habilidad se aplica constantemente en la vida adulta al leer un contrato, un correo laboral o las instrucciones de un trámite.';
const COMPRENSION_M1_BANK = [
  { texto:'Don Ricardo llegaba siempre primero al taller, con el overol impecable y una sonrisa serena, aunque llevara media noche sin dormir por cuidar a su nieto enfermo.', pregunta:'¿Qué rasgo psicológico se puede inferir de Don Ricardo?', correcta:'Es una persona responsable y de buen ánimo pese a las dificultades', opts:['Es una persona negligente con su trabajo','Es una persona que se queja constantemente','Es una persona indiferente ante su familia'] },
  { texto:'Alta, de manos ásperas por años de trabajo en el campo, y con una mirada firme que no se dejaba intimidar por nadie, así describían a Rosa quienes la conocían.', pregunta:'¿Qué rasgo físico se menciona explícitamente sobre Rosa?', correcta:'Sus manos ásperas por el trabajo en el campo', opts:['Su estatura baja','El color de su cabello','Su forma de vestir'] },
  { texto:'Estimados vecinos: Se informa que la junta de vecinos realizará una asamblea extraordinaria el próximo sábado, con el fin de votar el proyecto de mejoramiento de la sede social.', pregunta:'¿Cuál es el propósito principal de este texto?', correcta:'Informar sobre una asamblea para votar un proyecto', opts:['Invitar a una fiesta vecinal','Anunciar el cierre de la sede social','Solicitar dinero para un evento'] },
  { texto:'VIÑETA 1: Un hombre corre bajo la lluvia con un paraguas roto. VIÑETA 2: Resbala y cae en un charco. VIÑETA 3: Se levanta furioso mirando el cielo.', pregunta:'¿Qué tipo de texto es este, según su estructura?', correcta:'Un cómic o historieta', opts:['Una receta de cocina','Una carta formal','Un informe técnico'] },
  { texto:'El municipio informó que la matrícula en los cursos de nivelación de estudios para adultos aumentó un 40% este año, tras una campaña de difusión en juntas de vecinos.', pregunta:'¿Cuál es la idea principal de esta noticia?', correcta:'La matrícula en cursos de nivelación para adultos aumentó tras una campaña de difusión', opts:['El municipio cerrará los cursos de nivelación','Nadie se interesó en los cursos este año','La campaña de difusión fue un fracaso'] },
  { texto:'Aunque el capataz lo presionaba a diario, Manuel jamás alzaba la voz; prefería resolver los conflictos con calma, explicando con paciencia cada instrucción a los nuevos trabajadores.', pregunta:'¿Qué rasgo psicológico define mejor a Manuel?', correcta:'Es paciente y prefiere resolver los conflictos con calma', opts:['Es una persona impulsiva y agresiva','Es una persona indiferente con los demás','Es una persona insegura de sí misma'] },
  { texto:'Reglamento interno del taller: Artículo 1. Todo trabajador debe usar el equipo de protección personal. Artículo 2. Está prohibido operar maquinaria sin autorización previa.', pregunta:'¿Qué tipo de texto es este?', correcta:'Un reglamento o texto normativo', opts:['Un poema','Una anécdota personal','Un cómic'] },
  { texto:'De contextura delgada y baja estatura, el pequeño Andrés se abría paso entre los adultos con una energía que sorprendía a todos en la fiesta del barrio.', pregunta:'¿Qué rasgo físico se menciona explícitamente sobre Andrés?', correcta:'Su contextura delgada y baja estatura', opts:['El color de sus ojos','Su forma de hablar','Su edad exacta'] },
  { texto:'La feria libre del sector se traslada temporalmente a la calle paralela mientras duran los trabajos de pavimentación de la calle principal, según informó la municipalidad.', pregunta:'Según el texto, ¿por qué se traslada la feria libre?', correcta:'Por los trabajos de pavimentación de la calle principal', opts:['Porque la feria fue clausurada','Porque cambió de dueño','Porque ya no hay clientes'] },
  { texto:'Con voz entrecortada pero decidida, Marta explicó ante el jurado por qué merecía la beca: había criado a sus hijos sola mientras terminaba sus estudios de noche.', pregunta:'¿Qué rasgo psicológico transmite la actitud de Marta?', correcta:'Determinación a pesar de las dificultades', opts:['Total indiferencia por la beca','Falta de interés en sus estudios','Desconfianza hacia el jurado'] },
];
export function genComprensionEpjaM1Round(){
  const item = pick(COMPRENSION_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COMPRENSION_M1,
  };
}

const RECURSO_VOCABULARIO_M1 = 'El significado exacto de una palabra o expresión muchas veces depende del <b>contexto</b> en que aparece: las palabras y la situación que la rodean dan pistas claras sobre su sentido, incluso cuando la palabra es poco común o tiene varios significados posibles. Reemplazar una palabra por su <b>sinónimo</b> dentro de una oración, sin que esta pierda su sentido original, permite comprobar si realmente se entendió su significado — una habilidad útil tanto para leer un contrato o un aviso legal como para expresarse con más precisión al hablar o escribir.';
const VOCABULARIO_M1_BANK = [
  { oracion:'El contrato estipula que el pago se realizará de forma quincenal.', palabra:'estipula', correcta:'Establece o especifica', opts:['Prohíbe','Sugiere sin obligar','Anula'] },
  { oracion:'La directiva del sindicato manifestó su descontento con la nueva medida.', palabra:'descontento', correcta:'Disconformidad o disgusto', opts:['Alegría','Indiferencia total','Sorpresa agradable'] },
  { oracion:'El nuevo procedimiento busca agilizar la entrega de los certificados.', palabra:'agilizar', correcta:'Hacer más rápido', opts:['Hacer más lento','Complicar','Encarecer'] },
  { oracion:'Su testimonio fue clave para esclarecer lo ocurrido durante el incidente.', palabra:'esclarecer', correcta:'Aclarar o dejar en claro', opts:['Ocultar','Confundir','Ignorar'] },
  { oracion:'El informe médico detalla de manera exhaustiva cada uno de los exámenes realizados.', palabra:'exhaustiva', correcta:'Muy completa y detallada', opts:['Muy breve','Poco clara','Desordenada'] },
  { oracion:'La empresa decidió prescindir de algunos beneficios adicionales este año.', palabra:'prescindir', correcta:'Renunciar o dejar de usar', opts:['Aumentar','Duplicar','Promocionar'] },
  { oracion:'El profesor fue muy riguroso al calificar los trabajos finales del curso.', palabra:'riguroso', correcta:'Estricto y exigente', opts:['Descuidado','Indiferente','Generoso en exceso'] },
  { oracion:'La escasez de insumos generó un alza considerable en los precios.', palabra:'escasez', correcta:'Falta o insuficiencia', opts:['Abundancia','Estabilidad','Rebaja'] },
  { oracion:'El discurso del dirigente fue breve pero contundente ante los trabajadores.', palabra:'contundente', correcta:'Convincente y firme', opts:['Confuso','Aburrido','Silencioso'] },
  { oracion:'La junta de vecinos gestionó con éxito la reparación del alumbrado público.', palabra:'gestionó', correcta:'Realizó los trámites necesarios', opts:['Ignoró por completo','Prohibió','Retrasó a propósito'] },
];
export function genVocabularioContextoEpjaM1Round(){
  const item = pick(VOCABULARIO_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">En esta oración, ¿qué significa la palabra "'+item.palabra+'"?</p>',
    options: opts, correctValue: item.correcta, speakText: item.oracion+' ¿Qué significa la palabra '+item.palabra+' en esta oración?', cols:2, panel:true,
    explain: 'En esta oración, "'+item.palabra+'" significa: '+item.correcta+'.',
    recurso: RECURSO_VOCABULARIO_M1,
  };
}

const RECURSO_TEXTOS_EXPOSITIVOS_M1 = 'Un <b>texto expositivo</b> explica un tema de forma clara y ordenada, típicamente en tres partes: la <b>introducción</b> (presenta el tema), el <b>desarrollo</b> (explica sus aspectos principales) y la <b>conclusión</b> (cierra la idea). Para explicar, este tipo de texto usa distintas <b>formas de discurso</b>: la <b>descripción</b> (cómo es algo), la <b>definición</b> (qué es algo) y la <b>caracterización</b> (qué rasgos distintivos tiene). Además, un texto puede apoyarse en <b>recursos no verbales</b> (una imagen, un gráfico, una tabla) junto al texto escrito para comunicar información de forma más completa — reconocer esta estructura ayuda a estudiar un manual, un instructivo laboral o cualquier documento informativo con más eficiencia.';
const TEXTOS_EXPOSITIVOS_M1_BANK = [
  { modo:'estructura', fragmento:'"La diabetes tipo 2 es una enfermedad crónica que afecta la forma en que el cuerpo procesa el azúcar en la sangre."', pregunta:'Dentro de un texto expositivo sobre la diabetes, ¿a qué parte de la estructura corresponde este fragmento?', correcta:'Introducción', opts:['Desarrollo','Conclusión','Ninguna de las anteriores'] },
  { modo:'estructura', fragmento:'"En resumen, adoptar hábitos de alimentación saludable y actividad física regular es clave para prevenir esta enfermedad."', pregunta:'Dentro de un texto expositivo sobre la diabetes, ¿a qué parte de la estructura corresponde este fragmento?', correcta:'Conclusión', opts:['Introducción','Desarrollo','Ninguna de las anteriores'] },
  { modo:'discurso', fragmento:'"El taller de soldadura mide 40 metros cuadrados, tiene paredes de ladrillo reforzado y dos ventanas altas que dejan entrar luz natural."', pregunta:'¿Qué forma de discurso expositivo predomina en este fragmento?', correcta:'Descripción', opts:['Definición','Caracterización','Ninguna de las anteriores'] },
  { modo:'discurso', fragmento:'"Se entiende por inflación el aumento sostenido y generalizado de los precios de bienes y servicios en una economía."', pregunta:'¿Qué forma de discurso expositivo predomina en este fragmento?', correcta:'Definición', opts:['Descripción','Caracterización','Ninguna de las anteriores'] },
  { modo:'discurso', fragmento:'"Un buen líder comunitario se distingue por escuchar a los vecinos, cumplir sus compromisos y actuar con transparencia frente a los recursos que administra."', pregunta:'¿Qué forma de discurso expositivo predomina en este fragmento?', correcta:'Caracterización', opts:['Descripción','Definición','Ninguna de las anteriores'] },
  { modo:'recurso', escenario:'Un manual de instrucciones incluye, junto al texto, un dibujo con flechas numeradas que muestran el orden en que se deben conectar los cables de un electrodoméstico.', pregunta:'¿Qué función cumple ese dibujo con flechas dentro del manual?', correcta:'Es un recurso no verbal que complementa la información escrita', opts:['Reemplaza por completo la necesidad de leer el texto','No cumple ninguna función real','Sirve solo como decoración'] },
  { modo:'recurso', escenario:'Un informe sobre el ausentismo laboral incluye un gráfico de barras que muestra la cantidad de licencias médicas por mes.', pregunta:'¿Qué función cumple ese gráfico dentro del informe?', correcta:'Es un recurso no verbal que ayuda a comunicar los datos de forma visual', opts:['Contradice la información del texto','No aporta ninguna información nueva','Sirve solo para rellenar espacio'] },
  { modo:'estructura', fragmento:'"Existen distintos tipos de contratos de trabajo: a plazo fijo, indefinido y por obra o faena, cada uno con sus propias condiciones."', pregunta:'Dentro de un texto expositivo sobre contratos de trabajo, ¿a qué parte de la estructura corresponde este fragmento?', correcta:'Desarrollo', opts:['Introducción','Conclusión','Ninguna de las anteriores'] },
  { modo:'discurso', fragmento:'"Un buen trabajador en equipo se distingue por comunicarse con claridad, cumplir los plazos acordados y apoyar a sus compañeros cuando lo necesitan."', pregunta:'¿Qué forma de discurso expositivo predomina en este fragmento?', correcta:'Caracterización', opts:['Descripción','Definición','Ninguna de las anteriores'] },
];
export function genTextosExpositivosEpjaM1Round(){
  const item = pick(TEXTOS_EXPOSITIVOS_M1_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+(item.fragmento||item.escenario)+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: (item.fragmento||item.escenario)+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_TEXTOS_EXPOSITIVOS_M1,
  };
}

const RECURSO_HECHOS_OPINIONES_M1 = 'Un <b>hecho</b> es algo que ocurrió y se puede comprobar (una fecha, un dato, un suceso real), mientras que una <b>opinión</b> es un juicio personal que puede variar de una persona a otra. Una buena opinión se <b>fundamenta</b> con una razón concreta apoyada en información real, no solo en una impresión subjetiva. Cuando se lee un relato o una novela, también es posible <b>fundamentar el tipo de mundo</b> que presenta: un <b>mundo realista</b> (los hechos podrían ocurrir en la vida real, sin elementos sobrenaturales) o un <b>mundo fantástico</b> (incluye elementos imposibles en la realidad, como magia o seres sobrenaturales) — reconocer estas diferencias agudiza la lectura crítica de cualquier texto, sea una noticia, un comentario o una obra literaria.';
const HECHOS_OPINIONES_M1_BANK = [
  { modo:'clasificar', enunciado:'"El curso de nivelación de estudios comenzó este lunes con 30 inscritos."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Ese es, sin duda, el mejor curso de nivelación que se ha dictado jamás."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'clasificar', enunciado:'"El proyecto de ley fue aprobado por el Congreso la semana pasada."', correcta:'Hecho', opts:['Opinión'] },
  { modo:'clasificar', enunciado:'"Esa ley solo va a perjudicar a los trabajadores, como todas las anteriores."', correcta:'Opinión', opts:['Hecho'] },
  { modo:'fundamentar', escenario:'Un vecino opina: "Retomar mis estudios de adulto fue lo mejor que hice en años."', pregunta:'¿Cuál de estas razones fundamenta mejor esa opinión con un hecho concreto?', correcta:'Porque le permitió postular a un cargo mejor remunerado', opts:['Porque la sala de clases tiene buena vista','Porque el profesor se llama igual que su hermano','Porque el curso dura pocas semanas'] },
  { modo:'fundamentar', escenario:'Una vecina opina: "El nuevo centro de salud del barrio ha mejorado mucho la atención."', pregunta:'¿Cuál de estas razones fundamenta mejor esa opinión con un hecho concreto?', correcta:'Porque redujo el tiempo de espera para conseguir una hora médica', opts:['Porque el edificio es de color azul','Porque queda cerca de la plaza','Porque tiene un letrero nuevo'] },
  { modo:'mundo', fragmento:'Rodrigo tomó el metro hacia el centro, revisó su currículum una vez más y entró a la entrevista de trabajo puntual, como siempre.', pregunta:'¿Qué tipo de mundo literario presenta este relato?', correcta:'Mundo realista', opts:['Mundo fantástico','Mundo de ciencia ficción con naves espaciales','Ninguno de los anteriores'] },
  { modo:'mundo', fragmento:'El anciano del pueblo susurró un conjuro y, de inmediato, el río comenzó a fluir hacia arriba, desafiando toda ley conocida.', pregunta:'¿Qué tipo de mundo literario presenta este relato?', correcta:'Mundo fantástico', opts:['Mundo realista','Un texto expositivo','Ninguno de los anteriores'] },
];
export function genHechosOpinionesEpjaM1Round(){
  const item = pick(HECHOS_OPINIONES_M1_BANK);
  if(item.modo==='clasificar'){
    const opts = shuffle(['Hecho','Opinión']).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.enunciado+'</p><p class="prompt-hint">¿Esta afirmación es un hecho o una opinión?</p>',
      options: opts, correctValue: item.correcta, speakText: item.enunciado+' ¿Es un hecho o una opinión?', cols:2, panel:true,
      explain: 'Esta afirmación es un <b>'+item.correcta+'</b>.',
      recurso: RECURSO_HECHOS_OPINIONES_M1,
    };
  }
  if(item.modo==='mundo'){
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.fragmento+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.fragmento+' '+item.pregunta, cols:2, panel:true,
      explain: 'Este relato presenta un: '+item.correcta+'.',
      recurso: RECURSO_HECHOS_OPINIONES_M1,
    };
  }
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' '+item.pregunta, cols:2, panel:true,
    explain: 'La razón que mejor fundamenta esa opinión es: '+item.correcta+'.',
    recurso: RECURSO_HECHOS_OPINIONES_M1,
  };
}

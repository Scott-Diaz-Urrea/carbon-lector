import { pick, shuffle } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Media: Lengua Castellana y Comunicación ----------------
   Nivel 2 Media equivale a 3°-4° medio (ver content/grades.js). Fuente real: "Temario Segundo
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er y 2do semestre) — mismo decreto que Nivel 1 Media, confirmando que Educación Media EPJA
   completa sigue sin migrar a las nuevas Bases EPJA 2024. El eje NM2 Lengua Castellana agrega,
   respecto a NM1, dos ángulos nuevos: el TEXTO ARGUMENTATIVO (estructura tesis/argumentos/
   contraargumentos/conclusión, función de cada componente) y la posibilidad de fundamentar
   una opinión propia con información del texto. 4 módulos: Comprensión de Lectura (información
   explícita, inferencia de sentido global e información, tipo de texto, aspectos físicos y
   psicológicos de personajes), Vocabulario en Contexto (sentido/significado de palabra o
   expresión según contexto, reemplazo por sinónimo), Texto Argumentativo (estructura, tesis,
   argumentos, contraargumentos, conclusión, función de cada componente — ángulo enteramente
   nuevo que ningún nivel EPJA anterior había cubierto), y Hechos, Opiniones y Recursos
   Comunicativos (distinguir hechos de opiniones, función de recursos verbales/no verbales,
   relacionar el tema con la realidad contemporánea). Ningún objetivo del eje queda fuera del
   motor de opción múltiple (no incluye producción escrita). Contextos de vida adulta. */

export const LENGUAJE_EPJA_M2_MODULES = [
  {id:'comprensionEpjaM2', label:'Comprensión de Lectura', open:true, key:'comprensionEpjaM2'},
  {id:'vocabularioContextoEpjaM2', label:'Vocabulario en Contexto', open:true, key:'vocabularioContextoEpjaM2'},
  {id:'textoArgumentativoEpjaM2', label:'Texto Argumentativo', open:true, key:'textoArgumentativoEpjaM2'},
  {id:'hechosOpinionesEpjaM2', label:'Hechos, Opiniones y Comunicación', open:true, key:'hechosOpinionesEpjaM2'},
];
export const LENGUAJE_EPJA_M2_POS = [{x:24,y:84},{x:70,y:60},{x:24,y:36},{x:70,y:12}];

/* ---------------- Comprensión de Lectura ---------------- */
const RECURSO_COMPRENSION_M2 = 'Comprender un texto implica varias habilidades: identificar <b>información explícita</b> (lo que el texto dice literalmente), inferir el <b>sentido global</b> (la idea central o el propósito del texto completo), inferir <b>información</b> puntual que no está dicha directamente, reconocer el <b>tipo de texto</b> según su estructura y contenido, e identificar los aspectos <b>físicos y psicológicos</b> de un personaje (cómo es por fuera y cómo es su forma de ser). Estas habilidades se aplican tanto a textos literarios (cuentos, poemas, obras de teatro) como no literarios (noticias, cartas, ensayos, columnas de opinión).';
const COMPRENSION_M2_BANK = [
  { texto:'Después de veinte años trabajando como soldador, Ramón decidió estudiar de noche para terminar su enseñanza media. Todas las mañanas llegaba primero al taller, con el mismo overol azul desgastado y una sonrisa cansada pero firme.', pregunta:'¿Qué rasgo psicológico se puede inferir de Ramón a partir de este texto?', correcta:'Perseverancia y disciplina', opts:['Flojera y desidia','Indiferencia total hacia su trabajo','Falta de compromiso con sus metas'] },
  { texto:'Después de veinte años trabajando como soldador, Ramón decidió estudiar de noche para terminar su enseñanza media. Todas las mañanas llegaba primero al taller, con el mismo overol azul desgastado y una sonrisa cansada pero firme.', pregunta:'¿Qué aspecto físico de Ramón se menciona explícitamente en el texto?', correcta:'Su overol azul desgastado', opts:['Su estatura','El color de su cabello','Su edad exacta'], },
  { texto:'Estimado vecino: le escribo para informarle que la próxima reunión de la junta vecinal se realizará el jueves a las 19:00 horas en la sede social, con el fin de discutir el proyecto de mejoramiento de las calles del sector.', pregunta:'¿Qué tipo de texto es este, según su estructura y propósito?', correcta:'Una carta informativa', opts:['Un poema','Una receta de cocina','Un cuento de ficción'] },
  { texto:'Estimado vecino: le escribo para informarle que la próxima reunión de la junta vecinal se realizará el jueves a las 19:00 horas en la sede social, con el fin de discutir el proyecto de mejoramiento de las calles del sector.', pregunta:'¿Cuál es la información explícita central de este texto?', correcta:'La fecha, hora y lugar de la reunión vecinal', opts:['El nombre del alcalde de la comuna','El costo del proyecto de mejoramiento','La historia de la junta vecinal'] },
  { texto:'El desempleo ha aumentado en la región durante los últimos meses. Muchas familias han debido reducir sus gastos y buscar nuevas fuentes de ingreso, mientras las autoridades locales analizan medidas de apoyo.', pregunta:'¿Cuál es el sentido global de este texto?', correcta:'Las consecuencias del aumento del desempleo en una región', opts:['Una receta para cocinar en tiempos de crisis','Un poema sobre el paso del tiempo','Una biografía de un empresario exitoso'] },
  { texto:'Marta llevaba tres generaciones de su familia haciendo pan en el mismo horno de barro. Aunque el negocio ya no era tan rentable como antes, ella se negaba a cerrar: sentía que cada hogaza llevaba la historia de su abuela.', pregunta:'¿Qué se puede inferir sobre los valores de Marta?', correcta:'Valora la tradición familiar por sobre la conveniencia económica', opts:['Solo le interesa ganar dinero','No le importa la historia de su familia','Quiere cerrar el negocio lo antes posible'] },
  { texto:'Instrucciones: retire el filtro usado, enjuáguelo con agua tibia, y colóquelo nuevamente en su lugar antes de encender la máquina.', pregunta:'¿Qué tipo de texto es este?', correcta:'Un texto instructivo', opts:['Un poema lírico','Una noticia','Una carta personal'] },
  { texto:'El aumento en el precio de los combustibles impactó directamente el costo del transporte público en varias ciudades del país durante este trimestre.', pregunta:'¿Qué información explícita entrega este texto?', correcta:'El aumento del combustible afectó el costo del transporte público', opts:['El nombre del ministro de transporte','La fecha exacta de una ley aprobada','El precio del pan en el mismo período'] },
  { texto:'Doña Elena, la vecina del segundo piso, siempre saludaba con una sonrisa amplia, aunque sus manos artríticas y su espalda encorvada delataban los años de trabajo duro en el campo.', pregunta:'¿Qué aspecto físico de Doña Elena se describe en el texto?', correcta:'Sus manos artríticas y su espalda encorvada', opts:['El color de sus ojos','Su estatura exacta','El tipo de zapatos que usaba'] },
  { texto:'Doña Elena, la vecina del segundo piso, siempre saludaba con una sonrisa amplia, aunque sus manos artríticas y su espalda encorvada delataban los años de trabajo duro en el campo.', pregunta:'¿Qué rasgo psicológico se puede inferir de Doña Elena?', correcta:'Amabilidad y buen ánimo pese a las dificultades físicas', opts:['Amargura y resentimiento','Indiferencia hacia los demás','Desconfianza hacia sus vecinos'] },
];
export function genComprensionEpjaM2Round(){
  const item = pick(COMPRENSION_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_COMPRENSION_M2,
  };
}

/* ---------------- Vocabulario en Contexto ---------------- */
const RECURSO_VOCABULARIO_M2 = 'El significado de una palabra puede cambiar según el <b>contexto</b> en que se usa dentro de una oración o un texto. Para inferir el sentido de una palabra desconocida, conviene fijarse en las palabras que la rodean (antes y después), y buscar un <b>sinónimo</b> (una palabra de significado similar) que mantenga el sentido de la oración completa — una habilidad clave para entender textos con vocabulario poco frecuente sin necesitar un diccionario.';
const VOCABULARIO_M2_BANK = [
  { oracion:'El obrero realizó su labor con gran destreza, sin cometer ningún error.', pregunta:'¿Qué significa "destreza" en esta oración?', correcta:'Habilidad', opts:['Torpeza','Lentitud','Descuido'] },
  { oracion:'La escasez de agua en la región obligó a racionar su uso durante el verano.', pregunta:'¿Qué significa "escasez" en esta oración?', correcta:'Falta o poca cantidad', opts:['Abundancia','Calidad','Contaminación'] },
  { oracion:'El gerente fue tajante al rechazar la propuesta, sin dejar espacio para negociar.', pregunta:'¿Qué significa "tajante" en esta oración?', correcta:'Categórico y firme', opts:['Dudoso e inseguro','Amable y flexible','Distraído'] },
  { oracion:'Después de la reunión, los trabajadores quedaron con un ánimo sombrío ante las malas noticias.', pregunta:'¿Qué significa "sombrío" en esta oración?', correcta:'Triste o pesimista', opts:['Alegre y optimista','Indiferente','Sorprendido'] },
  { oracion:'La empresa buscó soluciones viables para reducir costos sin despedir personal.', pregunta:'¿Qué significa "viables" en esta oración?', correcta:'Posibles de realizar', opts:['Imposibles','Costosas sin límite','Ilegales'] },
  { oracion:'El discurso del dirigente sindical fue elocuente y logró convencer a la mayoría.', pregunta:'¿Qué significa "elocuente" en esta oración?', correcta:'Expresivo y persuasivo', opts:['Confuso y desordenado','Breve y cortante','Aburrido'] },
  { oracion:'La crisis económica generó un ambiente de incertidumbre entre los pequeños comerciantes.', pregunta:'¿Qué significa "incertidumbre" en esta oración?', correcta:'Falta de certeza o duda', opts:['Seguridad total','Alegría','Calma absoluta'] },
  { oracion:'El nuevo reglamento de la fábrica es riguroso respecto a las normas de seguridad.', pregunta:'¿Qué significa "riguroso" en esta oración?', correcta:'Estricto y exigente', opts:['Flexible y relajado','Ambiguo','Opcional'] },
  { oracion:'A pesar de las dificultades, el equipo mantuvo una actitud resiliente frente a los problemas.', pregunta:'¿Qué significa "resiliente" en esta oración?', correcta:'Capaz de superar adversidades', opts:['Frágil y quebradiza','Indiferente','Perezosa'] },
  { oracion:'El informe fue exhaustivo, cubriendo todos los aspectos del proyecto sin dejar nada fuera.', pregunta:'¿Qué significa "exhaustivo" en esta oración?', correcta:'Completo y detallado', opts:['Incompleto y breve','Confuso','Desactualizado'] },
];
export function genVocabularioContextoEpjaM2Round(){
  const item = pick(VOCABULARIO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.oracion+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.oracion+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_VOCABULARIO_M2,
  };
}

/* ---------------- Texto Argumentativo ---------------- */
const RECURSO_TEXTO_ARGUMENTATIVO_M2 = 'Un <b>texto argumentativo</b> busca convencer al lector de un punto de vista. Su estructura tiene 4 componentes: la <b>tesis</b> (la idea u opinión principal que se defiende), los <b>argumentos</b> (razones que apoyan la tesis), los <b>contraargumentos</b> (posturas contrarias que el autor reconoce y responde), y la <b>conclusión</b> (el cierre que refuerza la tesis). Reconocer cada componente ayuda a entender no solo QUÉ opina el autor, sino CÓMO construye su argumentación.';
const TEXTO_ARGUMENTATIVO_M2_BANK = [
  { fragmento:'"Es necesario invertir más en educación de adultos, ya que esto mejora las oportunidades laborales de miles de personas."', pregunta:'¿Qué componente del texto argumentativo es esta frase?', correcta:'La tesis', opts:['Un contraargumento','La conclusión','Un dato irrelevante'] },
  { fragmento:'"Algunos podrían decir que el gasto en educación de adultos es muy alto para el Estado; sin embargo, el retorno en empleo formal compensa esa inversión."', pregunta:'¿Qué componentes identifica principalmente esta frase?', correcta:'Un contraargumento seguido de la respuesta del autor', opts:['Solo la tesis inicial','Únicamente la conclusión','Un ejemplo sin relación con el tema'] },
  { fragmento:'"Por lo tanto, ampliar el acceso a la educación de adultos debe ser una prioridad de política pública."', pregunta:'¿Qué componente del texto argumentativo es esta frase?', correcta:'La conclusión', opts:['La tesis inicial','Un contraargumento','Una descripción de personajes'] },
  { fragmento:'"Los estudios muestran que las personas con educación media completa tienen mayores probabilidades de conseguir trabajo estable."', pregunta:'¿Qué función cumple esta frase dentro de un texto argumentativo?', correcta:'Es un argumento que apoya la tesis con evidencia', opts:['Es la tesis principal','Es un contraargumento','Es la conclusión final'] },
  { fragmento:'"Se debe fomentar el uso de energías renovables en las viviendas, porque reduce el gasto familiar en electricidad a largo plazo."', pregunta:'¿Qué componente es "porque reduce el gasto familiar en electricidad a largo plazo"?', correcta:'Un argumento que justifica la tesis', opts:['La tesis misma','Un contraargumento','Una anécdota personal'] },
  { fragmento:'"Aunque instalar paneles solares tiene un costo inicial alto, ese gasto se recupera en pocos años gracias al ahorro en la cuenta de luz."', pregunta:'¿Qué estructura argumentativa se reconoce en esta frase?', correcta:'Un contraargumento (el costo inicial) respondido con un argumento (el ahorro futuro)', opts:['Solo una tesis sin argumentos','Únicamente una conclusión','Una descripción sin argumentación'] },
  { fragmento:'"El transporte público debería ser gratuito para adultos mayores, ya que muchos dependen de una pensión muy baja para vivir."', pregunta:'¿Qué es "El transporte público debería ser gratuito para adultos mayores" en este texto?', correcta:'La tesis', opts:['Un contraargumento','La conclusión','Un dato estadístico'] },
  { fragmento:'"En conclusión, garantizar el transporte gratuito para adultos mayores es una medida de justicia social necesaria."', pregunta:'¿Qué componente del texto argumentativo es esta frase?', correcta:'La conclusión', opts:['La tesis inicial','Un contraargumento','Un ejemplo aislado'] },
  { fragmento:'"Cierto es que el Estado tiene un presupuesto limitado; no obstante, priorizar a los adultos mayores en el transporte es una inversión social justificada."', pregunta:'¿Qué función cumple la primera parte de esta frase ("Cierto es que el Estado tiene un presupuesto limitado")?', correcta:'Es un contraargumento que el autor reconoce antes de responder', opts:['Es la tesis principal del texto','Es la conclusión final','Es un dato irrelevante sin función'] },
];
export function genTextoArgumentativoEpjaM2Round(){
  const item = pick(TEXTO_ARGUMENTATIVO_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.fragmento+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.fragmento+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_TEXTO_ARGUMENTATIVO_M2,
  };
}

/* ---------------- Hechos, Opiniones y Comunicación ---------------- */
const RECURSO_HECHOS_OPINIONES_M2 = 'Un <b>hecho</b> es algo que se puede comprobar y verificar (por ejemplo, una fecha o una cifra), mientras que una <b>opinión</b> expresa un punto de vista personal que puede o no compartirse. Al comunicar información también se usan <b>recursos verbales</b> (las palabras mismas) y <b>recursos no verbales</b> (imágenes, gráficos, tono de voz, gestos), cada uno con una función distinta. Relacionar el tema de un texto con la <b>realidad contemporánea</b> permite entender por qué ese contenido sigue siendo relevante hoy.';
const HECHOS_OPINIONES_M2_BANK = [
  { afirmacion:'"El desempleo en la región aumentó un 3% durante el último trimestre, según cifras oficiales."', pregunta:'¿Esta afirmación es un hecho o una opinión?', correcta:'Un hecho', opts:['Una opinión','Ninguna de las dos','Una pregunta retórica'] },
  { afirmacion:'"Creo que el gobierno debería hacer mucho más para solucionar el desempleo."', pregunta:'¿Esta afirmación es un hecho o una opinión?', correcta:'Una opinión', opts:['Un hecho comprobable','Una cifra oficial','Un dato estadístico'] },
  { afirmacion:'"La reunión comenzó a las 10:00 horas y finalizó a las 12:30 horas."', pregunta:'¿Esta afirmación es un hecho o una opinión?', correcta:'Un hecho', opts:['Una opinión','Un juicio de valor','Una predicción'] },
  { afirmacion:'"Me parece que esa fue la mejor reunión de la junta vecinal en años."', pregunta:'¿Esta afirmación es un hecho o una opinión?', correcta:'Una opinión', opts:['Un hecho verificable','Una cifra oficial','Un dato histórico'] },
  { afirmacion:'Un afiche publicitario usa una fotografía grande y colores llamativos para promocionar un producto.', pregunta:'¿Qué tipo de recurso comunicativo son la fotografía y los colores en este afiche?', correcta:'Recursos no verbales', opts:['Recursos verbales','Argumentos escritos','Hechos comprobables'] },
  { afirmacion:'Un discurso político incluye frases cuidadosamente elegidas para convencer a la audiencia.', pregunta:'¿Qué tipo de recurso comunicativo son esas frases elegidas?', correcta:'Recursos verbales', opts:['Recursos no verbales','Imágenes','Gráficos'] },
  { afirmacion:'Un texto sobre la crisis del agua en el norte de Chile menciona que este problema también afecta a otras regiones del mundo hoy en día.', pregunta:'¿Qué habilidad se ejercita al relacionar este tema con otras regiones del mundo actual?', correcta:'Relacionar el tema del texto con la realidad contemporánea', opts:['Distinguir hechos de opiniones únicamente','Identificar solo información explícita','Reconocer la estructura del texto'] },
  { afirmacion:'"La votación finalizó con 120 votos a favor y 45 en contra, según el acta oficial."', pregunta:'¿Esta afirmación es un hecho o una opinión?', correcta:'Un hecho', opts:['Una opinión','Un juicio personal','Una suposición'] },
  { afirmacion:'"En mi opinión, esa decisión fue injusta para los trabajadores más antiguos."', pregunta:'¿Esta afirmación es un hecho o una opinión?', correcta:'Una opinión', opts:['Un hecho verificable con datos','Una cifra exacta','Una fecha comprobable'] },
];
export function genHechosOpinionesEpjaM2Round(){
  const item = pick(HECHOS_OPINIONES_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.afirmacion+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.afirmacion+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_HECHOS_OPINIONES_M2,
  };
}

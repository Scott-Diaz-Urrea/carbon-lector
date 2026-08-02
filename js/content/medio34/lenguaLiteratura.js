import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan de Formación General: Lengua y Literatura ----------------
   Fuente real: Decreto 614/2013, Plan de Formación General 3°-4° medio, asignatura
   Lengua y Literatura (curriculumnacional.cl). A diferencia de 1°-2° medio, los OA de
   3°-4° medio son mayormente de análisis/producción de textos propios y diálogo
   argumentativo oral — habilidades de desempeño, no de reconocimiento de un solo
   hecho correcto. Se adaptaron al motor de opción múltiple los aspectos SÍ evaluables
   con una única respuesta correcta:

   3° medio (OAC-01/02: interpretar/evaluar el efecto estético de obras leídas;
   OAC-03/04/05: analizar críticamente textos no literarios y géneros discursivos
   digitales) — 2 módulos: Interpretación Literaria (reconocer recursos literarios en
   fragmentos ilustrativos originales, ya que reproducir poemas reales con derechos de
   autor está fuera de alcance) y Análisis Crítico de Textos y Medios Digitales
   (identificar intención persuasiva, sesgo o género discursivo en escenarios de medios
   digitales). Fuera: OAC-06/07 (producción de textos propios), OAC-08 (diálogo
   argumentativo oral), OAC-09 (investigación, proceso propio).

   4° medio (OAC-01/02: comparar interpretaciones entre obras que abordan un mismo
   tema; OAC-03/04: evaluar críticamente textos no literarios, intenciones explícitas
   e implícitas) — 2 módulos: Comparación de Obras Literarias (dos fragmentos
   ilustrativos originales sobre un mismo tema, con miradas contrastantes) y
   Evaluación Crítica de Textos (detectar sesgo, conflicto de interés, descontextualización
   y otras fallas de un texto/medio). Fuera: OAC-05/06 (producción propia), OAC-07
   (diálogo argumentativo oral), OAC-08 (investigación, proceso propio). */

export const LENGUA_LIT_MODULES_M3 = [
  {id:'interpretacionliterariapg3', label:'Interpretación Literaria', open:true, key:'interpretacionliterariapg3'},
  {id:'analisiscriticopg3', label:'Análisis Crítico de Textos y Medios Digitales', open:true, key:'analisiscriticopg3'},
];
export const LENGUA_LIT_POS_M3 = [ {x:30,y:75},{x:70,y:30} ];

export const LENGUA_LIT_MODULES_M4 = [
  {id:'comparacionobraspg4', label:'Comparación de Obras Literarias', open:true, key:'comparacionobraspg4'},
  {id:'evaluacioncriticapg4', label:'Evaluación Crítica de Textos', open:true, key:'evaluacioncriticapg4'},
];
export const LENGUA_LIT_POS_M4 = [ {x:30,y:75},{x:70,y:30} ];

/* ---------------- Interpretación Literaria (OAC-01/02) ---------------- */
const RECURSO_INTERPRETACION_PG3 = 'Los <b>recursos literarios</b> son herramientas del lenguaje que un autor usa a propósito para producir un efecto estético o emocional. La <b>metáfora</b> compara dos cosas sin usar "como" (sus ojos eran dos luceros); la <b>personificación</b> da cualidades humanas a algo que no lo es (el viento lloraba); la <b>hipérbole</b> exagera deliberadamente (te lo dije un millón de veces); el <b>símbolo</b> usa un objeto concreto para representar una idea abstracta (una paloma blanca para representar la paz); y la <b>ironía</b> dice algo distinto —a veces opuesto— de lo que realmente se quiere comunicar. Reconocer estos recursos permite interpretar por qué una obra produce el efecto que produce en quien la lee.';
const DEVICE_LABELS_PG3 = ['Personificación','Metáfora','Hipérbole','Símbolo','Ironía'];
const RECURSOS_LITERARIOS_BANK_PG3 = [
  {texto:'"El viento lloraba entre las ramas del sauce."', label:'Personificación'},
  {texto:'"Sus ojos eran dos luceros en la noche."', label:'Metáfora'},
  {texto:'"Lloré un mar de lágrimas por su partida."', label:'Hipérbole'},
  {texto:'"La rosa marchita representaba el fin de aquel amor."', label:'Símbolo'},
  {texto:'"¡Qué buen amigo! Me abandonó justo cuando más lo necesitaba." (dicho con amargura)', label:'Ironía'},
  {texto:'"El río corría veloz, ansioso por llegar al mar."', label:'Personificación'},
  {texto:'"Su sonrisa era un rayo de sol en un día gris."', label:'Metáfora'},
  {texto:'"Te lo repetí un millón de veces y no escuchaste."', label:'Hipérbole'},
  {texto:'"La paloma blanca cruzó el cielo el día que se firmó el tratado."', label:'Símbolo'},
  {texto:'"Justo el día de mi examen se cortó la luz de todo el barrio. Qué suerte la mía."', label:'Ironía'},
  {texto:'"Las estrellas guardaban silencio, esperando el amanecer."', label:'Personificación'},
  {texto:'"Sus palabras eran espinas que herían sin tocar la piel."', label:'Metáfora'},
];
export function genInterpretacionLiterariaPG3Round(){
  const item = pick(RECURSOS_LITERARIOS_BANK_PG3);
  const wrongPool = DEVICE_LABELS_PG3.filter(function(l){ return l!==item.label; });
  const opts = shuffle([item.label].concat(shuffle(wrongPool).slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué recurso literario predomina en este fragmento?</p>',
    options:opts, correctValue:item.label, cols:2, panel:true,
    speakText:'¿Qué recurso literario predomina en este fragmento?',
    explain:'Este fragmento usa principalmente '+item.label.toLowerCase()+'.',
    recurso:RECURSO_INTERPRETACION_PG3,
  };
}

/* ---------------- Análisis Crítico de Textos y Medios Digitales (OAC-03/04/05) ---------------- */
const RECURSO_ANALISIS_CRITICO_PG3 = 'Los textos y publicaciones digitales rara vez son neutrales: cada uno tiene una intención (informar, persuadir, vender, entretener) que conviene reconocer antes de aceptar su contenido. Señales útiles para detectarla incluyen: ¿la publicación oculta quién la financia?, ¿el titular exagera para generar clics?, ¿se citan fuentes verificables o solo se apela a la emoción?, ¿se presenta una sola cara de la historia? Analizar críticamente estos géneros discursivos —posts, memes, avisos, titulares— es una habilidad ciudadana clave para no dejarse manipular por la enorme cantidad de información que circula en redes sociales.';
const DIGITAL_MEDIA_BANK_PG3 = [
  {contexto:'Un influencer publica una foto usando cierta marca de zapatillas con el texto "Así me siento imparable 💪", sin mencionar que la marca le pagó por publicarlo.', correcta:'Publicidad encubierta', distractores:['Una opinión personal espontánea','Una reseña técnica objetiva del producto','Una noticia informativa']},
  {contexto:'Un titular dice "Científicos DESCUBREN algo que cambiará TU VIDA para siempre", pero el artículo solo describe un estudio menor y preliminar.', correcta:'Titular sensacionalista (clickbait)', distractores:['Un resumen científico preciso','Un comunicado oficial de prensa','Una entrevista en profundidad']},
  {contexto:'Un medio publica una columna firmada por un economista, donde defiende su postura personal sobre una reforma tributaria.', correcta:'Texto argumentativo con una postura declarada', distractores:['Una noticia neutral sin ninguna postura','Un decreto oficial del gobierno','Un estudio estadístico sin interpretación']},
  {contexto:'Una publicación viral compara a dos candidatos políticos usando memes que exageran defectos físicos de uno de ellos, sin mencionar sus propuestas.', correcta:'Descalificación que evade el debate de ideas', distractores:['Un análisis serio de propuestas políticas','Una entrevista imparcial','Un debate televisado formal']},
  {contexto:'Un aviso de un producto "milagroso" para bajar de peso muestra fotos de antes/después, pero en letra chica dice "resultados no representativos, ejercicio y dieta necesarios".', correcta:'Publicidad engañosa disfrazada de testimonio', distractores:['Un estudio clínico confiable','Una recomendación médica personalizada','Una noticia de salud pública']},
  {contexto:'Un post en redes sociales afirma un dato médico grave sin citar ninguna fuente, y se comparte miles de veces antes de ser desmentido por expertos.', correcta:'Desinformación viral sin verificar', distractores:['Un artículo científico revisado por pares','Un comunicado del Ministerio de Salud','Una cifra oficial de estadísticas']},
  {contexto:'Una marca de bebidas usa una canción pegajosa y actores felices en la playa para vender su producto, sin dar ningún dato real sobre sus ingredientes.', correcta:'Apelación emocional para vender, sin información objetiva', distractores:['Una ficha técnica del producto','Un estudio nutricional independiente','Una comparación de precios']},
  {contexto:'Un medio digital publica dos titulares distintos para la misma noticia según el público al que apunta el aviso, cambiando el tono de "crisis" a "ajuste normal".', correcta:'Enmarque (framing) distinto según la audiencia', distractores:['El mismo hecho contado siempre igual','Una corrección de un error de imprenta','Una traducción literal sin cambios']},
];
export function genAnalisisCriticoPG3Round(){
  const item = pick(DIGITAL_MEDIA_BANK_PG3);
  const opts = shuffle([item.correcta].concat(item.distractores)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+item.contexto+'</p><p class="prompt-hint">¿Cómo se describe mejor este contenido?</p>',
    options:opts, correctValue:item.correcta, cols:2, panel:true,
    speakText:'¿Cómo se describe mejor este contenido?',
    explain:'Este contenido corresponde a: '+item.correcta+'.',
    recurso:RECURSO_ANALISIS_CRITICO_PG3,
  };
}

/* ================= 4° medio ================= */

/* ---------------- Comparación de Obras Literarias (OAC-01/02) ---------------- */
const RECURSO_COMPARACION_PG4 = 'Dos obras (o dos fragmentos) que abordan un mismo tema pueden presentar miradas completamente distintas, según el contexto de producción, la experiencia del autor o la actitud enunciativa que adopte. Comparar interpretaciones exige identificar en qué se parecen y en qué se diferencian esas miradas: ¿una celebra el tema mientras la otra lo cuestiona?, ¿una es nostálgica mientras la otra es esperanzadora? Esta habilidad permite entender que no existe una sola forma "correcta" de abordar un tema en literatura, sino múltiples perspectivas legítimas que dialogan entre sí.';
const COMPARACION_OBRAS_BANK_PG4 = [
  {tema:'la tecnología', eje:'crítica', fragA:'"Las máquinas nos liberarán de todo trabajo pesado, y por fin tendremos tiempo para crear y soñar."', fragB:'"Cada pantalla que se enciende apaga un poco más nuestra capacidad de mirarnos a los ojos."', correctaEs:'B'},
  {tema:'la migración', eje:'esperanzadora', fragA:'"Cruzamos el mar cargando solo un sueño, y aquí, poco a poco, lo vemos florecer."', fragB:'"Nadie pregunta cuánto cuesta dejarlo todo atrás."', correctaEs:'A'},
  {tema:'la naturaleza', eje:'crítica', fragA:'"El bosque sigue ahí, verde y silencioso, como siempre."', fragB:'"Donde antes hubo un río, hoy solo queda un cauce seco y una fábrica nueva."', correctaEs:'B'},
  {tema:'el trabajo', eje:'esperanzadora', fragA:'"Cada turno agotador me acerca un paso más a la vida que quiero construir."', fragB:'"El reloj marca la salida, pero el cansancio se queda con nosotros hasta el día siguiente."', correctaEs:'A'},
  {tema:'la memoria', eje:'nostálgica', fragA:'"En esta casa vacía todavía escucho las risas de las tardes de domingo."', fragB:'"Los recuerdos, dicen los científicos, se reescriben cada vez que los evocamos."', correctaEs:'A'},
  {tema:'las redes sociales', eje:'crítica', fragA:'"Gracias a una pantalla, hoy converso con quien está a miles de kilómetros como si estuviera aquí."', fragB:'"Coleccionamos amigos como fotografías, y olvidamos cómo se siente una conversación sin apuro."', correctaEs:'B'},
  {tema:'el trabajo remoto', eje:'esperanzadora', fragA:'"Desde mi living puedo trabajar y ver crecer a mis hijos al mismo tiempo."', fragB:'"Sin la oficina, también desapareció la frontera entre el trabajo y el descanso."', correctaEs:'A'},
  {tema:'la inteligencia artificial', eje:'crítica', fragA:'"Una máquina que aprende de nosotros: qué maravilla poder delegarle lo tedioso."', fragB:'"Le enseñamos a pensar como nosotros, y ahora tememos que piense mejor que nosotros."', correctaEs:'B'},
  {tema:'la vida en el campo', eje:'nostálgica', fragA:'"Todavía siento el olor a tierra mojada de las mañanas de mi infancia."', fragB:'"Las ciudades ofrecen oportunidades que el campo simplemente no tiene."', correctaEs:'A'},
  {tema:'la globalización', eje:'crítica', fragA:'"El mundo entero cabe hoy en la pantalla de un teléfono."', fragB:'"Mientras todo se parece más, algo de lo propio se va perdiendo en el camino."', correctaEs:'B'},
];
export function genComparacionObrasPG4Round(){
  const item = pick(COMPARACION_OBRAS_BANK_PG4);
  const correct = 'Fragmento '+item.correctaEs;
  const opts = shuffle(['Fragmento A','Fragmento B','Ambos por igual','Ninguno de los dos']).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">Sobre '+item.tema+':</p><p class="prompt-hint"><b>Fragmento A:</b> '+item.fragA+'</p><p class="prompt-hint"><b>Fragmento B:</b> '+item.fragB+'</p><p class="prompt-hint">¿Cuál de los dos fragmentos presenta una mirada más '+item.eje+' sobre el tema?</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:'¿Cuál de los dos fragmentos presenta una mirada más '+item.eje+' sobre el tema?',
    explain:'El '+correct.toLowerCase()+' es el que presenta la mirada más '+item.eje+' sobre '+item.tema+'.',
    recurso:RECURSO_COMPARACION_PG4,
  };
}

/* ---------------- Evaluación Crítica de Textos (OAC-03/04) ---------------- */
const RECURSO_EVALUACION_CRITICA_PG4 = 'Evaluar críticamente un texto no literario significa ir más allá de lo que dice explícitamente, para identificar sus intenciones implícitas: ¿qué información se omite?, ¿quién se beneficia de que el lector crea esto?, ¿el lenguaje usado carga la información de una connotación particular? Señales típicas de un texto poco confiable incluyen la falta de pluralidad de fuentes, los conflictos de interés no declarados, la descontextualización de hechos, y las muestras no representativas presentadas como si fueran generalizables. Desarrollar esta mirada crítica es esencial para participar informadamente en una sociedad saturada de información.';
const EVALUACION_CRITICA_BANK_PG4 = [
  {contexto:'Una noticia sobre un alza de precios cita solo la opinión de la empresa afectada, sin consultar a consumidores ni expertos independientes.', correcta:'Falta de pluralidad de fuentes (sesgo por omisión)', distractores:['Una cobertura equilibrada y completa','Un reportaje de investigación profundo','Una crónica puramente descriptiva']},
  {contexto:'Un aviso político dice "Vota por el cambio" sin explicar ninguna propuesta concreta, apelando solo a la emoción de un futuro mejor.', correcta:'Mensaje emotivo sin contenido programático', distractores:['Una propuesta de gobierno detallada','Un debate de ideas fundamentado','Un análisis técnico de políticas públicas']},
  {contexto:'Un artículo usa la palabra "invasión" para describir la llegada de un grupo de migrantes a una ciudad.', correcta:'Elección de lenguaje que carga la noticia de connotación negativa', distractores:['Una descripción neutral de un hecho migratorio','Un dato estadístico sin interpretación','Un testimonio directo de los migrantes']},
  {contexto:'Una marca de alimentos financia un estudio que concluye que su propio producto es "saludable", y lo publica sin mencionar quién pagó la investigación.', correcta:'Conflicto de interés no declarado', distractores:['Un estudio independiente y transparente','Una revisión académica externa','Un informe del Ministerio de Salud']},
  {contexto:'Un video viral muestra solo 10 segundos de una discusión de 20 minutos, dando la impresión de que una persona reaccionó sin ningún motivo.', correcta:'Descontextualización que distorsiona el hecho real', distractores:['Un registro completo y fiel del hecho','Una transcripción textual del audio','Una entrevista posterior aclaratoria']},
  {contexto:'Un sitio web presenta una encuesta "informal" hecha solo entre sus propios seguidores, como si representara la opinión de todo el país.', correcta:'Muestra no representativa presentada como generalizable', distractores:['Una encuesta con muestra aleatoria representativa','Un censo oficial','Un estudio longitudinal validado']},
  {contexto:'Una columna de opinión afirma una cifra económica sin citar ninguna fuente ni año de referencia.', correcta:'Dato sin respaldo verificable', distractores:['Una cifra oficial con fuente citada','Un gráfico con su metodología explicada','Un informe con su fecha de publicación']},
  {contexto:'Un aviso de una universidad muestra solo testimonios de sus egresados más exitosos, sin mencionar las tasas reales de empleabilidad.', correcta:'Selección sesgada de casos (sesgo de supervivencia)', distractores:['Un informe con estadísticas completas de empleabilidad','Una auditoría externa de resultados','Un ranking académico independiente']},
];
export function genEvaluacionCriticaPG4Round(){
  const item = pick(EVALUACION_CRITICA_BANK_PG4);
  const opts = shuffle([item.correcta].concat(item.distractores)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+item.contexto+'</p><p class="prompt-hint">¿Qué problema tiene este texto o publicación, más allá de lo que dice explícitamente?</p>',
    options:opts, correctValue:item.correcta, cols:2, panel:true,
    speakText:'¿Qué problema tiene este texto o publicación, más allá de lo que dice explícitamente?',
    explain:'El problema de fondo es: '+item.correcta+'.',
    recurso:RECURSO_EVALUACION_CRITICA_PG4,
  };
}

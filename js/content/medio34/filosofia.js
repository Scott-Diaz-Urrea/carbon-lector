import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan de Formación General: Filosofía ----------------
   Fuente real: Decreto 614/2013, Plan de Formación General 3°-4° medio, asignatura
   Filosofía (curriculumnacional.cl). Primera vez que la app incluye esta asignatura
   (no existe en Básica ni en 1°-2° medio, donde no forma parte del Plan General).
   Los OA mezclan definición de conceptos filosóficos (con una única respuesta
   correcta y verificable) con diálogo/reflexión personal sobre problemas abiertos
   — se adaptó al motor de opción múltiple el aspecto conceptual (mismo patrón de
   "¿qué significa este concepto?" ya usado en Educación Ciudadana de este mismo
   plan). Presentar corrientes filosóficas como posturas históricas con nombre propio
   (idealismo, empirismo, utilitarismo...) evita el problema de convertir preguntas
   filosóficas abiertas en preguntas con una sola "respuesta correcta" ilegítima:
   se pregunta qué dice una corriente, no cuál corriente "tiene la razón".

   3° medio (OAC-01: qué es la filosofía; OAC-03: preguntas ontológicas; OAC-04:
   preguntas epistemológicas; OAC-06: principios de argumentación y lógica) — 4
   módulos. Fuera: OAC-02 (analizar/fundamentar posturas propias), OAC-05 (diálogo
   personal sobre desafíos ontológicos/epistemológicos).

   4° medio (OAC-02: preguntas éticas -teorías éticas fundamentales-; OAC-04:
   evaluar validez de argumentos y falacias; OAC-01/05: alcances de la filosofía e
   impacto de ideas filosóficas en problemas contemporáneos) — 3 módulos. Fuera:
   OAC-03 (diálogo personal sobre ética/política contemporánea). */

export const FILOSOFIA_MODULES_M3 = [
  {id:'quefilosofiapg3', label:'¿Qué es la Filosofía?', open:true, key:'quefilosofiapg3'},
  {id:'ontologiapg3', label:'Ontología: El Ser y la Realidad', open:true, key:'ontologiapg3'},
  {id:'epistemologiapg3', label:'Epistemología: Conocimiento y Verdad', open:true, key:'epistemologiapg3'},
  {id:'logicaargumentacionpg3', label:'Lógica y Argumentación', open:true, key:'logicaargumentacionpg3'},
];
export const FILOSOFIA_POS_M3 = [ {x:26,y:88},{x:70,y:64},{x:26,y:38},{x:70,y:12} ];

export const FILOSOFIA_MODULES_M4 = [
  {id:'eticateoriaspg4', label:'Ética: Teorías y Conceptos', open:true, key:'eticateoriaspg4'},
  {id:'argumentosfalaciaspg4', label:'Argumentos y Falacias', open:true, key:'argumentosfalaciaspg4'},
  {id:'filosofiacontemporaneapg4', label:'Filosofía y Problemas Contemporáneos', open:true, key:'filosofiacontemporaneapg4'},
];
export const FILOSOFIA_POS_M4 = [ {x:30,y:82},{x:70,y:50},{x:30,y:18} ];

function genDefRound(bank, recurso){
  const item = pick(bank);
  const others = bank.filter(function(x){ return x!==item; });
  const distract = shuffle(others).slice(0,3).map(function(o){ return o.definicion; });
  const opts = shuffle([item.definicion].concat(distract)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">¿Qué significa el concepto "'+item.termino+'"?</p>',
    options:opts, correctValue:item.definicion, cols:2, panel:true,
    speakText:'¿Qué significa el concepto '+item.termino+'?',
    explain:item.termino+' significa: '+item.definicion,
    recurso:recurso,
  };
}

/* ---------------- ¿Qué es la Filosofía? (OAC-01) ---------------- */
const RECURSO_QUE_FILOSOFIA_PG3 = 'La <b>filosofía</b> nació en la Grecia antigua como el intento de responder, con la razón y el argumento, preguntas que antes solo respondían los mitos. Con el tiempo se organizó en ramas: la <b>metafísica</b> pregunta qué es la realidad; la <b>epistemología</b>, qué es el conocimiento; la <b>ética</b>, qué está bien y mal; la <b>lógica</b>, qué hace válido a un razonamiento; y la <b>estética</b>, qué es la belleza. El método de Sócrates, la <b>mayéutica</b>, consistía en hacer preguntas sucesivas para que la otra persona "diera a luz" su propio conocimiento, en vez de simplemente entregárselo.';
const QUE_FILOSOFIA_BANK_PG3 = [
  {termino:'Filosofía', definicion:'La disciplina que reflexiona críticamente sobre las preguntas más fundamentales del ser humano, como la realidad, el conocimiento, la moral y la existencia.'},
  {termino:'Metafísica', definicion:'La rama de la filosofía que estudia la naturaleza última de la realidad, el ser y la existencia.'},
  {termino:'Epistemología', definicion:'La rama de la filosofía que estudia el conocimiento: su origen, sus límites y cómo se justifica que algo sea verdadero.'},
  {termino:'Ética (como rama)', definicion:'La rama de la filosofía que reflexiona sobre lo que está bien y mal, y sobre cómo deberíamos actuar.'},
  {termino:'Lógica (como rama)', definicion:'La rama de la filosofía que estudia los principios de la argumentación válida y correcta.'},
  {termino:'Estética', definicion:'La rama de la filosofía que estudia la belleza, el arte y la experiencia sensible.'},
  {termino:'Mayéutica', definicion:'El método socrático de hacer preguntas sucesivas para ayudar a otra persona a descubrir el conocimiento por sí misma.'},
  {termino:'Filosofía política', definicion:'La rama de la filosofía que reflexiona sobre el poder, la justicia, el Estado y la organización de la sociedad.'},
];
export function genQueFilosofiaPG3Round(){ return genDefRound(QUE_FILOSOFIA_BANK_PG3, RECURSO_QUE_FILOSOFIA_PG3); }

/* ---------------- Ontología: El Ser y la Realidad (OAC-03) ---------------- */
const RECURSO_ONTOLOGIA_PG3 = 'La <b>ontología</b> es la parte de la filosofía que pregunta qué es realmente lo que existe. Algunas posturas clásicas responden de forma opuesta: el <b>idealismo</b> sostiene que la realidad depende de la mente o las ideas, mientras el <b>materialismo</b> sostiene que solo existe la materia; el <b>dualismo</b> propone que mente y cuerpo son sustancias distintas, mientras el <b>monismo</b> sostiene que todo se reduce a un único tipo de sustancia. El <b>existencialismo</b>, en cambio, se pregunta por el ser humano en particular: sostiene que no tenemos una esencia fija de antemano, sino que nos construimos a través de nuestras decisiones.';
const ONTOLOGIA_BANK_PG3 = [
  {termino:'Idealismo', definicion:'La postura que sostiene que la realidad depende fundamentalmente de la mente o las ideas, no de la materia.'},
  {termino:'Materialismo', definicion:'La postura que sostiene que solo la materia existe realmente, y que la mente puede explicarse a partir de procesos físicos.'},
  {termino:'Dualismo', definicion:'La postura que sostiene que la mente y el cuerpo son dos sustancias distintas e independientes entre sí.'},
  {termino:'Realismo (ontológico)', definicion:'La postura que sostiene que la realidad existe de forma independiente a que alguien la perciba o piense sobre ella.'},
  {termino:'Monismo', definicion:'La postura que sostiene que toda la realidad está compuesta, en el fondo, por un único tipo de sustancia.'},
  {termino:'Determinismo', definicion:'La postura que sostiene que todo evento, incluidas las decisiones humanas, está determinado por causas anteriores.'},
  {termino:'Existencialismo', definicion:'La corriente que sostiene que el ser humano no tiene una esencia fija y que se construye a sí mismo a través de sus decisiones.'},
  {termino:'Esencialismo', definicion:'La postura que sostiene que las cosas tienen una naturaleza fija e inmutable que las define esencialmente.'},
];
export function genOntologiaPG3Round(){ return genDefRound(ONTOLOGIA_BANK_PG3, RECURSO_ONTOLOGIA_PG3); }

/* ---------------- Epistemología: Conocimiento y Verdad (OAC-04) ---------------- */
const RECURSO_EPISTEMOLOGIA_PG3 = 'La <b>epistemología</b> pregunta cómo sabemos lo que sabemos. El <b>racionalismo</b> confía principalmente en la razón como fuente de conocimiento, mientras el <b>empirismo</b> confía en la experiencia sensorial; el <b>escepticismo</b> duda de que sea posible un conocimiento cierto y definitivo. La <b>verdad como correspondencia</b> es la idea de que un enunciado es verdadero si coincide con los hechos reales. También se distingue el <b>conocimiento a priori</b> (justificado solo con la razón, como en matemáticas) del <b>conocimiento a posteriori</b> (justificado con la experiencia), y el <b>método científico</b> combina ambos: observación, hipótesis y experimentación.';
const EPISTEMOLOGIA_BANK_PG3 = [
  {termino:'Racionalismo', definicion:'La postura que sostiene que la razón, más que la experiencia sensorial, es la principal fuente de conocimiento verdadero.'},
  {termino:'Empirismo', definicion:'La postura que sostiene que todo conocimiento proviene, en última instancia, de la experiencia sensorial.'},
  {termino:'Escepticismo', definicion:'La postura que duda de la posibilidad de alcanzar un conocimiento cierto y definitivo sobre la realidad.'},
  {termino:'Verdad como correspondencia', definicion:'La idea de que un enunciado es verdadero si corresponde efectivamente con los hechos de la realidad.'},
  {termino:'Conocimiento a priori', definicion:'El conocimiento que se puede justificar sin recurrir a la experiencia, solo mediante la razón, como en las matemáticas.'},
  {termino:'Conocimiento a posteriori', definicion:'El conocimiento que se justifica a partir de la experiencia y la observación del mundo.'},
  {termino:'Relativismo del conocimiento', definicion:'La postura que sostiene que la verdad depende del contexto, la cultura o la perspectiva de quien conoce.'},
  {termino:'Método científico', definicion:'Un procedimiento sistemático de observación, hipótesis y experimentación para producir conocimiento verificable.'},
];
export function genEpistemologiaPG3Round(){ return genDefRound(EPISTEMOLOGIA_BANK_PG3, RECURSO_EPISTEMOLOGIA_PG3); }

/* ---------------- Lógica y Argumentación (OAC-06) ---------------- */
const RECURSO_LOGICA_PG3 = 'Un argumento está formado por <b>premisas</b> (las afirmaciones de partida) y una conclusión que se supone se sigue de ellas. Es <b>válido</b> cuando, si las premisas son verdaderas, la conclusión se sigue necesariamente — como en un <b>silogismo</b> clásico. La <b>deducción</b> parte de lo general para llegar a una conclusión particular necesaria; la <b>inducción</b> parte de casos particulares para llegar a una conclusión general solo probable. Una <b>falacia</b> es un error de razonamiento que hace parecer válido un argumento que no lo es — por ejemplo, la falacia <b>ad hominem</b> ataca a la persona en vez de refutar su argumento.';
const LOGICA_ARGUMENTACION_BANK_PG3 = [
  {termino:'Premisa', definicion:'Cada una de las afirmaciones que sirven de base o punto de partida para llegar a una conclusión en un argumento.'},
  {termino:'Argumento válido', definicion:'Un argumento en el que, si las premisas son verdaderas, la conclusión se sigue necesariamente de ellas.'},
  {termino:'Silogismo', definicion:'Un tipo de argumento deductivo formado por dos premisas y una conclusión, como en "todo A es B, C es A, luego C es B".'},
  {termino:'Deducción', definicion:'Un razonamiento que parte de premisas generales para llegar a una conclusión particular necesariamente verdadera.'},
  {termino:'Inducción', definicion:'Un razonamiento que parte de casos particulares para llegar a una conclusión general probable, no necesariamente cierta.'},
  {termino:'Falacia (concepto general)', definicion:'Un error en el razonamiento que hace parecer válido un argumento que en realidad no lo es.'},
  {termino:'Falacia ad hominem', definicion:'Un error de razonamiento que consiste en atacar a la persona que argumenta en vez de refutar su argumento.'},
  {termino:'Contradicción lógica', definicion:'La afirmación simultánea de dos proposiciones que no pueden ser verdaderas al mismo tiempo.'},
];
export function genLogicaArgumentacionPG3Round(){ return genDefRound(LOGICA_ARGUMENTACION_BANK_PG3, RECURSO_LOGICA_PG3); }

/* ================= 4° medio ================= */

/* ---------------- Ética: Teorías y Conceptos (OAC-02) ---------------- */
const RECURSO_ETICA_PG4 = 'Existen distintas teorías éticas que responden de forma diferente a "qué hace que una acción sea correcta". El <b>utilitarismo</b> mira las consecuencias: es correcto lo que maximiza el bienestar del mayor número de personas. La <b>deontología</b> mira el deber: es correcto lo que cumple una norma moral, sin importar el resultado. La <b>ética de la virtud</b> mira el carácter: importa más ser una persona virtuosa que seguir reglas o calcular consecuencias. El <b>contractualismo</b> imagina que las normas morales surgen de un acuerdo hipotético entre personas racionales. Conocer estas teorías ayuda a analizar con más herramientas los <b>dilemas éticos</b> reales, donde cualquier decisión entra en conflicto con algún principio válido.';
const ETICA_TEORIAS_BANK_PG4 = [
  {termino:'Utilitarismo', definicion:'La teoría ética que sostiene que una acción es correcta si maximiza el bienestar o la felicidad del mayor número de personas.'},
  {termino:'Deontología', definicion:'La teoría ética que sostiene que una acción es correcta si cumple con un deber o una norma moral, sin importar sus consecuencias.'},
  {termino:'Ética de la virtud', definicion:'La teoría ética que pone el foco en desarrollar un carácter virtuoso, más que en reglas o consecuencias.'},
  {termino:'Contractualismo', definicion:'La teoría que sostiene que los principios morales y políticos derivan de un acuerdo hipotético entre personas racionales.'},
  {termino:'Relativismo moral', definicion:'La postura que sostiene que lo correcto o incorrecto depende de la cultura o el contexto de cada sociedad.'},
  {termino:'Dilema ético', definicion:'Una situación en la que cualquier decisión posible entra en conflicto con al menos un principio moral válido.'},
  {termino:'Justicia distributiva', definicion:'El principio que evalúa cómo se reparten los recursos, beneficios y cargas dentro de una sociedad.'},
  {termino:'Autonomía moral', definicion:'La capacidad de una persona de darse a sí misma sus propias normas morales, en vez de recibirlas impuestas.'},
];
export function genEticaTeoriasPG4Round(){ return genDefRound(ETICA_TEORIAS_BANK_PG4, RECURSO_ETICA_PG4); }

/* ---------------- Argumentos y Falacias (OAC-04) ---------------- */
const RECURSO_FALACIAS_PG4 = 'Reconocer falacias permite evaluar si un argumento es realmente válido o solo parece serlo. La <b>falacia del hombre de paja</b> distorsiona el argumento del otro para refutarlo más fácil; la <b>falacia de autoridad</b> acepta algo como cierto solo porque lo dice alguien prestigioso; el <b>falso dilema</b> presenta solo dos opciones cuando existen más; la <b>generalización apresurada</b> saca una conclusión general de muy pocos casos; el <b>argumento circular</b> esconde la conclusión dentro de sus propias premisas; y la <b>pendiente resbaladiza</b> afirma, sin justificarlo, que un primer paso llevará inevitablemente a consecuencias extremas. Detectar estos errores es clave para debatir con rigor.';
const ARGUMENTOS_FALACIAS_BANK_PG4 = [
  {termino:'Falacia del hombre de paja', definicion:'Un error de razonamiento que consiste en distorsionar el argumento de otra persona para que sea más fácil de refutar.'},
  {termino:'Falacia de autoridad', definicion:'Un error de razonamiento que consiste en aceptar algo como verdadero solo porque lo dice alguien con prestigio, sin evaluar la evidencia.'},
  {termino:'Falso dilema', definicion:'Un error de razonamiento que presenta solo dos opciones posibles, cuando en realidad existen más alternativas.'},
  {termino:'Generalización apresurada', definicion:'Un error de razonamiento que extrae una conclusión general a partir de muy pocos casos o ejemplos.'},
  {termino:'Argumento circular', definicion:'Un error de razonamiento en el que la conclusión ya está incluida, disfrazada, dentro de las premisas.'},
  {termino:'Pendiente resbaladiza', definicion:'Un error de razonamiento que afirma que un primer paso llevará inevitablemente a una cadena de consecuencias extremas, sin justificarlo.'},
  {termino:'Ad populum', definicion:'Un error de razonamiento que sostiene que algo es verdadero o correcto solo porque mucha gente lo cree o lo hace.'},
  {termino:'Non sequitur', definicion:'Un error de razonamiento en el que la conclusión no se sigue lógicamente de las premisas presentadas.'},
];
export function genArgumentosFalaciasPG4Round(){ return genDefRound(ARGUMENTOS_FALACIAS_BANK_PG4, RECURSO_FALACIAS_PG4); }

/* ---------------- Filosofía y Problemas Contemporáneos (OAC-01/05) ---------------- */
const RECURSO_FILOSOFIA_CONTEMPORANEA_PG4 = 'La filosofía no se quedó en la Antigüedad: sigue aportando herramientas para pensar problemas actuales. La <b>bioética</b> reflexiona sobre los dilemas morales de la medicina y las tecnologías de la vida; la <b>ética de la inteligencia artificial</b> analiza los sesgos y el impacto social de los sistemas automatizados; el <b>transhumanismo</b> discute si deberíamos usar la tecnología para superar nuestras limitaciones biológicas; y la <b>ética ambiental</b> pregunta qué obligaciones tenemos hacia la naturaleza y las generaciones futuras, una idea relacionada con la <b>justicia intergeneracional</b>. Estos campos muestran que la filosofía sigue teniendo alcances prácticos en la tecnología, la política y el cuidado del planeta.';
const FILOSOFIA_CONTEMPORANEA_BANK_PG4 = [
  {termino:'Bioética', definicion:'La rama de la ética aplicada que reflexiona sobre los dilemas morales de la medicina, la biología y las nuevas tecnologías de la vida.'},
  {termino:'Ética de la inteligencia artificial', definicion:'El campo que reflexiona sobre los dilemas morales del desarrollo y uso de sistemas de inteligencia artificial, como sus sesgos o su impacto en el empleo.'},
  {termino:'Transhumanismo', definicion:'La corriente que propone usar la tecnología para superar las limitaciones biológicas actuales del ser humano.'},
  {termino:'Ética ambiental', definicion:'La rama de la ética que reflexiona sobre las obligaciones morales del ser humano hacia la naturaleza y las generaciones futuras.'},
  {termino:'Filosofía de la tecnología', definicion:'La reflexión filosófica sobre cómo la tecnología transforma la manera en que las personas piensan, se relacionan y viven.'},
  {termino:'Justicia intergeneracional', definicion:'El principio ético que considera las obligaciones morales que tenemos hacia las personas que todavía no han nacido.'},
  {termino:'Filosofía política contemporánea', definicion:'La reflexión actual sobre temas como la democracia, los derechos humanos y la justicia social en el mundo de hoy.'},
  {termino:'Privacidad digital', definicion:'El derecho de una persona a controlar qué información personal se comparte y cómo se usa en entornos digitales.'},
];
export function genFilosofiaContemporaneaPG4Round(){ return genDefRound(FILOSOFIA_CONTEMPORANEA_BANK_PG4, RECURSO_FILOSOFIA_CONTEMPORANEA_PG4); }

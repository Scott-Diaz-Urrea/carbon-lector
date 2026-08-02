import { pick, shuffle } from '../../utils.js';

/* ---------------- Microbiología Clínica — Estudio para Pruebas ----------------
   Segundo submódulo de "Estudio para Pruebas" (ver excepción a la regla de oro
   documentada en quimicaDiagnostica.js): preparación para el examen universitario
   real de "Microbiología Clínica" (código 53427, V semestre, Tecnología Médica,
   Universidad Central de Chile). Contenido extraído literalmente (nunca
   inventado) de los apuntes/clases reales del curso (Temas 1-20 del programa),
   por 8 agentes de investigación en paralelo que leyeron cada PDF completo y
   citaron la fuente exacta de cada hecho — ese proceso quedó documentado en la
   conversación, no en este archivo.
   Cobertura: el programa real tiene 28 Temas: Temas 1-20 (fundamentos,
   antimicrobianos, susceptibilidad, genética, mecanismos de resistencia,
   taxonomía/medios de cultivo, Staphylococcaceae, bacilos Gram+, Streptococcaceae/
   Enterococcaceae, Enterobacterales, bacilos Gram- no fermentadores, Vibrionaceae/
   Campylobacter/Helicobacter) SÍ tienen PDF fuente y están cubiertos aquí.
   Temas 21-28 (Pasteurellaceae/Brucellaceae, Mycobacterium, Neisseriaceae,
   Spirochetales/Mycoplasma/Chlamydia/Rickettsia, Micología, Virología I-III) NO
   tienen PDF fuente disponible — quedan fuera hasta que se consiga ese material,
   mismo criterio que usa Química Diagnóstica para documentar sus propias
   exclusiones. A diferencia de Química Diagnóstica, casi ningún documento fuente
   de este curso tenía casos clínicos narrativos de paciente — el contenido
   "caso" más rico son los 2 casos de Pseudomonas (Tema 18) y los 3 ejemplos de
   antibiograma interpretado de Carbapenemasas (Tema 17); el resto es contenido
   factual bien fundamentado (taxonomía, mecanismos, diagnóstico diferencial),
   fiel a como está realmente el material del curso. */

export const MICROBIOLOGIA_CLINICA_MODULES = [
  { id:'microfundamentos', label:'Fundamentos Bacterianos', open:true, key:'microfundamentos' },
  { id:'microantimicrobianos', label:'Antimicrobianos: Mecanismo y Clasificación', open:true, key:'microantimicrobianos' },
  { id:'microsusceptibilidad', label:'Estudios de Susceptibilidad', open:true, key:'microsusceptibilidad' },
  { id:'microresistencia', label:'Mecanismos de Resistencia', open:true, key:'microresistencia' },
  { id:'microcarbapenemasas', label:'Carbapenemasas y Detección', open:true, key:'microcarbapenemasas' },
  { id:'microtaxonomia', label:'Taxonomía y Medios de Cultivo', open:true, key:'microtaxonomia' },
  { id:'microstaphylo', label:'Staphylococcus', open:true, key:'microstaphylo' },
  { id:'microstrepto', label:'Streptococcus y Enterococcus', open:true, key:'microstrepto' },
  { id:'microbacilos', label:'Bacilos Gram Positivos', open:true, key:'microbacilos' },
  { id:'microentero', label:'Enterobacterales', open:true, key:'microentero' },
  { id:'microbgnnf', label:'Bacilos Gram Negativos No Fermentadores', open:true, key:'microbgnnf' },
  { id:'microvibrio', label:'Vibrio, Campylobacter y Helicobacter', open:true, key:'microvibrio' },
];
export const MICROBIOLOGIA_CLINICA_POS = [
  {x:20,y:92},{x:64,y:84},{x:22,y:76},{x:66,y:68},
  {x:20,y:60},{x:64,y:52},{x:22,y:44},{x:66,y:36},
  {x:20,y:28},{x:64,y:20},{x:22,y:12},{x:66,y:4},
];

/* ---------------- Fundamentos Bacterianos ----------------
   Basado en Tema 1 (Morfología y Citología), Tema 2 (Fisiología) y Tema 6
   (Genética Bacteriana). */
const FUNDAMENTOS_BANK = [
  {
    pregunta:'¿Qué componente de la pared celular ocupa hasta el 90% de su estructura en las bacterias Gram positivas?',
    correcta:'El peptidoglicano',
    opts:['El lipopolisacárido (LPS)','La membrana externa','Los ácidos nucleicos'],
    recurso:'El peptidoglicano es una malla formada por cadenas de azúcares (N-acetilglucosamina y ácido N-acetilmurámico) entrecruzadas por péptidos cortos, y es el componente que le da rigidez y forma a la bacteria. En las Gram positivas forma capas gruesas y múltiples que llegan a ocupar hasta el 90% de la pared, con ácidos teicoicos y lipoteicoicos incrustados en ella. En las Gram negativas, en cambio, el peptidoglicano es una capa mucho más delgada (apenas 10%) escondida bajo una membrana externa con lipopolisacárido — esta diferencia estructural es justamente la base de la tinción de Gram: el cristal violeta queda atrapado en la gruesa malla de peptidoglicano de las Gram positivas, pero se escurre fácilmente en las Gram negativas.',
  },
  {
    pregunta:'En bacterias Gram negativas, ¿qué molécula de la membrana externa actúa como endotoxina y puede causar fiebre y shock al liberarse?',
    correcta:'El lipopolisacárido (LPS)',
    opts:['El peptidoglicano','La cápsula','Los pili'],
    recurso:'El LPS forma la cara externa de la membrana externa de las bacterias Gram negativas y tiene tres partes: el Lípido A (la porción tóxica, anclada a la membrana), una región central de azúcares, y el antígeno O (cadenas de azúcares variables que permiten serotipificar a la bacteria). Cuando la bacteria muere o se multiplica, libera fragmentos de LPS al entorno; el sistema inmune del hospedero reconoce el Lípido A como una señal de peligro y desencadena una respuesta inflamatoria masiva, que en exceso causa fiebre alta, caída de la presión arterial y, en los casos más graves, shock séptico. Por eso al LPS se le llama "endotoxina": es tóxico por ser parte de la estructura bacteriana, no por ser secretado activamente como una exotoxina.',
  },
  {
    pregunta:'¿Qué estructura bacteriana es responsable de la conjugación, es decir, de transferir material genético de una bacteria a otra mediante contacto directo?',
    correcta:'El pili sexual (pili F)',
    opts:['El flagelo','La cápsula','El ribosoma'],
    recurso:'El pili sexual (o pili F) es un tubo proteico fino que una bacteria "donadora" (que posee un plásmido con el Factor de Fertilidad, F+) extiende hacia una bacteria "receptora" para unirse a ella. Una vez formado el contacto, el ADN —generalmente en forma de plásmido— pasa de una célula a la otra a través de ese tubo; a este proceso completo se le llama conjugación. Es distinto del flagelo (que sirve para el movimiento, no para transferir ADN) y de la cápsula (que protege de la fagocitosis). La conjugación es el mecanismo más importante para diseminar rápidamente genes de resistencia a antibióticos entre bacterias, incluso entre especies distintas, porque el plásmido transferido puede llevar esos genes "de regalo".',
  },
  {
    pregunta:'¿Qué dos géneros de bacilos Gram positivos son capaces de formar endosporas, estructuras extremadamente resistentes al calor y la desecación?',
    correcta:'Bacillus y Clostridium',
    opts:['Escherichia y Salmonella','Staphylococcus y Streptococcus','Pseudomonas y Neisseria'],
    recurso:'Una endospora no es una forma de reproducción, sino una forma de "supervivencia extrema": cuando las condiciones del ambiente se vuelven desfavorables (falta de nutrientes, calor, desecación), algunas bacterias empaquetan su material genético dentro de una cubierta muy resistente y entran en un estado latente que puede durar cientos de años. Solo dos géneros de bacilos Gram positivos de importancia clínica hacen esto: Bacillus (agente del ántrax y de intoxicaciones alimentarias) y Clostridium (agente del tétanos y la gangrena gaseosa, entre otros). El dipicolinato de calcio, que llega a ser el 10% del peso seco de la espora, es clave para esa resistencia. Por esto mismo, el material médico-quirúrgico requiere esterilización rigurosa en autoclave (no basta con hervir agua) para destruir estas formas.',
  },
  {
    pregunta:'Un microorganismo que necesita concentraciones elevadas de CO2 (5-10%) para crecer bien, como Haemophilus spp. o Neisseria spp., se clasifica como:',
    correcta:'Capnófilo',
    opts:['Aerobio estricto','Anaerobio estricto','Halófilo'],
    recurso:'La clasificación de bacterias según su necesidad de oxígeno va más allá de "con o sin oxígeno": un aerobio estricto necesita oxígeno como aceptor final de electrones (ej. Mycobacterium tuberculosis) y un anaerobio estricto lo evita porque le resulta tóxico (ej. Clostridium perfringens), mientras que un microaerófilo necesita muy poco oxígeno (menos de 12%, ej. Campylobacter). Los capnófilos son un caso especial: no se trata de cuánto oxígeno necesitan, sino de que requieren una concentración elevada de dióxido de carbono (5-10%) para crecer adecuadamente, algo que en el laboratorio se logra incubando las placas en una atmósfera enriquecida con CO2 o en jarras especiales. Reconocer esta necesidad es clave para no descartar erróneamente un cultivo negativo si se incubó en condiciones atmosféricas normales.',
  },
  {
    pregunta:'¿En qué fase del crecimiento poblacional bacteriano son las células metabólicamente más activas, y por lo tanto más sensibles a los antibióticos y a la radiación?',
    correcta:'Fase exponencial',
    opts:['Fase de adaptación (lag)','Fase estacionaria','Fase de muerte'],
    recurso:'El crecimiento de una población bacteriana en un cultivo pasa por cuatro fases: la fase de adaptación (lag), donde casi no aumenta el número de células pero cada una se prepara metabólicamente; la fase exponencial, donde la población se duplica de forma constante y las células están en su punto más activo de síntesis de proteínas, pared celular y ADN; la fase estacionaria, donde el número de células que mueren iguala al de las que nacen (por agotamiento de nutrientes); y la fase de muerte, donde predominan las células muertas. La mayoría de los antibióticos actúan bloqueando procesos activos (como la síntesis de pared celular o de proteínas), así que una bacteria en fase exponencial —que está sintetizando activamente todos sus componentes— es mucho más vulnerable a ellos que una bacteria "dormida" en fase estacionaria.',
  },
  {
    pregunta:'¿Qué mecanismo de transferencia genética consiste en que una bacteria capta ADN libre que flota en su entorno, descubierto por Griffith en 1928 estudiando Streptococcus pneumoniae?',
    correcta:'Transformación',
    opts:['Conjugación','Transducción','Mutación espontánea'],
    recurso:'En 1928, Frederick Griffith hizo un experimento clásico con dos cepas de Streptococcus pneumoniae: una virulenta (con cápsula) y una inofensiva (sin cápsula). Al inyectar en ratones la cepa inofensiva mezclada con restos muertos de la cepa virulenta, los ratones morían igual — es decir, la cepa inofensiva había "aprendido" a ser virulenta captando algo del ADN suelto de las bacterias muertas. A ese proceso se le llamó transformación: una bacteria capta directamente fragmentos de ADN libre presentes en su entorno (liberados, por ejemplo, al morir y lisarse otras bacterias) y los incorpora a su propio genoma. Es distinto de la conjugación (que requiere contacto físico vía pili) y de la transducción (que requiere un virus bacteriófago como intermediario).',
  },
  {
    pregunta:'Un plásmido de resistencia (como el plásmido R100, que porta genes contra mercurio, sulfonamidas, estreptomicina, cloranfenicol y tetraciclina) le confiere a la bacteria que lo porta:',
    correcta:'Genes de resistencia a antibióticos y otras ventajas, sin ser esencial para la vida básica de la bacteria',
    opts:['Únicamente la capacidad de moverse (flagelos)','Únicamente la forma de la célula','Ninguna ventaja: son ADN "basura" sin ninguna función'],
    recurso:'Un plásmido es una pieza de ADN circular, separada del cromosoma principal, que se replica de forma independiente y que la bacteria puede transmitir a sus descendientes o incluso a otras bacterias por conjugación. A diferencia del cromosoma, no contiene información esencial para la vida básica de la célula, pero sí puede llevar "ventajas extra": genes de resistencia a uno o varios antibióticos, factores de virulencia, o resistencia a metales pesados. El plásmido R100 es un ejemplo real bien documentado que porta simultáneamente resistencia a mercurio, sulfonamidas, estreptomicina, cloranfenicol y tetraciclina — mostrando cómo un solo evento de transferencia de plásmido puede volver a una bacteria resistente a varias familias de antibióticos a la vez, no solo a una.',
  },
  {
    pregunta:'¿Qué mecanismo de transferencia genética usa un virus bacteriófago para introducir ADN de una bacteria a otra, como ocurre con el fago T12 que le da a Streptococcus pyogenes la capacidad de producir la toxina de la escarlatina?',
    correcta:'Transducción',
    opts:['Transformación','Conjugación','Esporulación'],
    recurso:'La transducción ocurre cuando un bacteriófago (un virus que infecta bacterias) empaqueta por error un fragmento de ADN de su bacteria huésped anterior dentro de su cubierta viral, y luego infecta a una nueva bacteria inyectando ese ADN "prestado" en vez de (o junto con) el suyo propio. Un ejemplo real y muy citado es el del fago T12: cuando este bacteriófago se inserta en el genoma de Streptococcus pyogenes, le transfiere el gen que codifica una de las toxinas pirogénicas (Spe) responsables de la escarlatina — es decir, la propia capacidad de esta bacteria de causar ese cuadro depende de haber sido infectada por un virus específico. Este mecanismo demuestra que los virus no solo transmiten enfermedad viral, también pueden ser vehículos de genes bacterianos de virulencia o de resistencia.',
  },
  {
    pregunta:'Los integrones son elementos genéticos que transportan "casetes genéticos"; su Clase 1 es la más frecuente en cepas clínicas de bacterias Gram negativas como Enterobacteriaceae. ¿Para qué sirven principalmente estos casetes?',
    correcta:'Para portar genes de resistencia a antibióticos',
    opts:['Para producir esporas','Para formar la cápsula bacteriana','Para sintetizar flagelos'],
    recurso:'Un integrón es una plataforma genética que no se mueve por sí sola con facilidad, pero que casi siempre se encuentra montada dentro de un transposón (que sí puede saltar de un lugar del genoma a otro, o de un plásmido a un cromosoma). Su función es capturar e integrar pequeños fragmentos de ADN llamados "casetes genéticos" en un sitio específico (la secuencia attI), gracias a una enzima propia llamada integrasa. La inmensa mayoría de los casetes que capturan los integrones de Clase 1 —los más comunes en bacterias clínicamente relevantes como Escherichia coli, Klebsiella o Pseudomonas aeruginosa— codifican resistencia a antibióticos específicos (por ejemplo, a compuestos de amonio cuaternario y sulfamidas). Por eso los integrones son considerados una pieza clave en la diseminación rápida de la multirresistencia bacteriana.',
  },
];
export function genFundamentos7Round(){
  const item = pick(FUNDAMENTOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Antimicrobianos: Mecanismo y Clasificación ----------------
   Basado en Tema 3 y Tema 4 (Drogas Antimicrobianas I y II). */
const ANTIMICROBIANOS_BANK = [
  {
    pregunta:'Los antibióticos betalactámicos (penicilinas, cefalosporinas, carbapenémicos) son bactericidas porque actúan inhibiendo:',
    correcta:'La síntesis de la pared celular, uniéndose a las PBP',
    opts:['La síntesis de proteínas en el ribosoma','La síntesis de ADN','La membrana citoplasmática'],
    recurso:'Las PBP (Penicillin Binding Proteins, o proteínas fijadoras de penicilina) son las enzimas que la bacteria usa normalmente para ensamblar el peptidoglicano de su pared celular, entrecruzando las cadenas de azúcares con puentes de péptidos. Los antibióticos betalactámicos tienen una estructura tan parecida a la del sustrato natural de estas enzimas que se unen a ellas de forma irreversible, bloqueándolas por completo. Sin PBP funcionales, la bacteria no puede seguir construyendo ni reparando su pared celular mientras crece y se divide, y termina estallando por la presión osmótica interna (lisis). Por eso son bactericidas (matan a la bacteria) y no solo bacteriostáticos (que solo detienen su crecimiento): el daño a la pared es irreversible una vez ocurrido.',
  },
  {
    pregunta:'¿Qué familia de antibióticos actúa uniéndose a la subunidad ribosomal 30S, causando errores de lectura del ARN mensajero, y es conocida por su riesgo de nefrotoxicidad y ototoxicidad?',
    correcta:'Los aminoglucósidos',
    opts:['Los glucopéptidos','Los macrólidos','Las sulfonamidas'],
    recurso:'Los aminoglucósidos (como gentamicina y amikacina) entran a la bacteria y se unen a la subunidad 30S del ribosoma, el sitio donde se lee el ARN mensajero para fabricar proteínas. Esta unión no solo bloquea la síntesis proteica, sino que provoca que el ribosoma "lea mal" el código genético, incorporando aminoácidos incorrectos en las proteínas nuevas — proteínas defectuosas que terminan dañando aún más a la bacteria, por eso son bactericidas. En el ser humano, estos fármacos se eliminan por vía renal y tienden a acumularse en el oído interno y en las células del túbulo renal, lo que explica su toxicidad característica sobre el riñón (nefrotoxicidad) y el oído (ototoxicidad, con riesgo de sordera irreversible) — por eso su uso requiere monitorear niveles en sangre.',
  },
  {
    pregunta:'Las quinolonas (como el ciprofloxacino) son bactericidas y actúan inhibiendo:',
    correcta:'La ADN girasa (Topoisomerasa II) y la Topoisomerasa IV',
    opts:['La síntesis de la pared celular','La subunidad ribosomal 50S','La síntesis del ácido fólico'],
    recurso:'Para que el ADN bacteriano (una molécula circular muy larga) quepa dentro de la célula y pueda replicarse sin enredarse, la bacteria necesita enzimas que corten, desenrollen y vuelvan a unir la doble hebra en el momento justo. La ADN girasa (Topoisomerasa II, el blanco principal en bacterias Gram negativas) y la Topoisomerasa IV (el blanco principal en Gram positivas) cumplen exactamente esa función. Las quinolonas se unen a estas enzimas y bloquean su acción, dejando al ADN bacteriano enredado y con cortes que no pueden repararse — un daño letal para la célula. Este mecanismo es completamente distinto al de los betalactámicos (pared celular) o los aminoglucósidos (ribosoma), por lo que las quinolonas siguen siendo útiles incluso contra bacterias resistentes a esas otras familias.',
  },
  {
    pregunta:'¿Qué antibiótico glucopéptido se une al extremo D-Ala-D-Ala del peptidoglicano y es de elección frente a Staphylococcus aureus resistente a meticilina (SAMR)?',
    correcta:'Vancomicina',
    opts:['Gentamicina','Eritromicina','Ciprofloxacino'],
    recurso:'La vancomicina es una molécula grande e hidrofílica que, a diferencia de los betalactámicos (que bloquean la enzima que construye la pared), actúa "tapando" físicamente el ladrillo de construcción mismo: se une con gran afinidad al extremo terminal D-Ala-D-Ala de los precursores del peptidoglicano, impidiendo que las enzimas de la bacteria puedan usarlos para ensamblar la pared celular. Como su mecanismo no depende de las PBP, sigue funcionando incluso cuando estas están alteradas —como en Staphylococcus aureus resistente a meticilina (SAMR), cuyo gen mecA produce una PBP2a de baja afinidad por los betalactámicos pero que no afecta en nada la unión de la vancomicina. Por esta razón la vancomicina es históricamente el tratamiento de elección para infecciones graves por SAMR.',
  },
  {
    pregunta:'El cotrimoxazol combina sulfametoxazol y trimetoprim para bloquear de forma secuencial (en dos pasos distintos) la vía de síntesis de:',
    correcta:'El ácido fólico',
    opts:['El peptidoglicano','El ADN directamente','Los fosfolípidos de membrana'],
    recurso:'El ácido fólico es esencial para que la bacteria pueda fabricar las bases nitrogenadas del ADN, pero a diferencia de las células humanas (que obtienen el folato de la dieta), la bacteria debe sintetizarlo ella misma paso a paso. El sulfametoxazol bloquea el primer paso de esa vía (la enzima dihidropteroato sintetasa, imitando a su sustrato natural PABA), mientras que el trimetoprim bloquea un paso posterior de la misma vía (la dihidrofolato reductasa). Al combinar ambos fármacos, se bloquea la ruta en dos puntos distintos y consecutivos —una estrategia llamada "bloqueo secuencial"— que resulta en un efecto bactericida mucho más potente que el de cualquiera de los dos fármacos por separado, que solos son solo bacteriostáticos.',
  },
  {
    pregunta:'¿Qué generación de cefalosporinas se caracteriza por tener actividad adicional contra Staphylococcus aureus resistente a meticilina (SAMR), como la ceftarolina?',
    correcta:'Quinta generación',
    opts:['Primera generación','Segunda generación','Tercera generación'],
    recurso:'Las cefalosporinas se agrupan en generaciones según cómo fue cambiando su espectro de actividad con el tiempo: la 1ª generación cubre bien Gram positivos comunes; la 2ª mejora algo la cobertura de Gram negativos; la 3ª gana mucha más potencia contra Gram negativos y penetra al sistema nervioso central (útil en meningitis); y la 4ª suma cobertura contra Pseudomonas y es más estable frente a la betalactamasa AmpC. La 5ª generación es la más reciente y su rasgo distintivo es haber recuperado actividad contra Staphylococcus aureus resistente a meticilina (SAMR) —algo que ninguna generación anterior lograba— gracias a que se unen también a la PBP2a alterada que produce el gen mecA, un logro farmacológico importante porque el SAMR es una de las causas más difíciles de tratar de infecciones hospitalarias.',
  },
  {
    pregunta:'Los macrólidos (como la azitromicina) son especialmente útiles frente a bacterias "atípicas" como Mycoplasma pneumoniae, Chlamydia y Legionella porque:',
    correcta:'Alcanzan altas concentraciones intracelulares y dentro de los macrófagos',
    opts:['Solo actúan en la orina','Solo actúan sobre bacterias formadoras de esporas','No penetran ningún tejido del cuerpo'],
    recurso:'Las bacterias "atípicas" como Mycoplasma, Chlamydia y Legionella comparten una característica clínica importante: viven y se replican dentro de las células del hospedero (son intracelulares), a diferencia de la mayoría de las bacterias que causan infección desde fuera de las células. Un antibiótico que solo se distribuye bien en el plasma sanguíneo, sin entrar realmente a las células, sería casi inútil contra ellas. Los macrólidos, por su estructura lipofílica (con anillo lactónico), tienen la capacidad de acumularse en concentraciones muy altas dentro de las células del propio organismo, incluidos los macrófagos —las células inmunes que patrullan buscando invasores— que además "transportan" el antibiótico hasta el sitio de la infección. Esta propiedad hace que los macrólidos sean el tratamiento de elección frente a neumonías atípicas.',
  },
  {
    pregunta:'La nitrofurantoína se usa casi exclusivamente para infecciones urinarias no complicadas porque:',
    correcta:'Alcanza altas concentraciones en la orina pero una concentración plasmática muy baja',
    opts:['Es el único antibiótico bactericida que existe','Solo funciona en el sistema nervioso central','No tiene ningún mecanismo de acción conocido'],
    recurso:'La nitrofurantoína tiene una particularidad farmacológica poco común: se absorbe bien por vía oral, pero se elimina y se concentra casi exclusivamente en la orina, alcanzando ahí niveles muy superiores a los que logra en la sangre o en otros tejidos. Esto la hace muy eficaz para tratar cistitis (infección limitada a la vejiga), donde el antibiótico "baña" directamente al microorganismo en la orina, pero prácticamente inútil para infecciones que ya escaparon del tracto urinario, como una pielonefritis (infección del riñón) o una bacteriemia, porque nunca alcanza concentraciones suficientes fuera de la orina. Por este motivo el antibiograma solo reporta nitrofurantoína cuando la muestra proviene de orina, nunca para aislados de sangre u otros sitios profundos.',
  },
  {
    pregunta:'¿Qué antibiótico monobactámico tiene actividad exclusivamente contra bacterias Gram negativas y ninguna actividad frente a Gram positivas o anaerobios?',
    correcta:'Aztreonam',
    opts:['Vancomicina','Clindamicina','Penicilina G'],
    recurso:'Aztreonam es el único monobactámico de uso clínico habitual, y su estructura de anillo betalactámico simple (sin el segundo anillo que sí tienen penicilinas y cefalosporinas) hace que solo pueda unirse eficazmente a las PBP de bacterias Gram negativas, dejándolo sin ninguna actividad frente a Gram positivas o anaerobios. Esta especificidad tan estrecha resulta útil en un caso particular: pacientes alérgicos a la penicilina que necesitan cobertura contra Gram negativos, ya que el aztreonam tiene muy baja reactividad cruzada con esa alergia (a diferencia de otros betalactámicos). Además, al ser una molécula distinta de las metalo-betalactamasas (un tipo de carbapenemasa), suele mantenerse activo frente a algunas bacterias productoras de estas enzimas, aunque se recomienda siempre confirmar con el antibiograma real.',
  },
  {
    pregunta:'La rifampicina inhibe la ARN polimerasa bacteriana y nunca debe usarse en monoterapia (sola) principalmente porque:',
    correcta:'La bacteria desarrolla resistencia a ella muy rápidamente si se usa sola',
    opts:['Es tóxica solo si se combina con otros fármacos','No tiene ningún mecanismo de acción conocido','Solo funciona en combinación con antifúngicos'],
    recurso:'La rifampicina bloquea la ARN polimerasa bacteriana (la enzima que transcribe el ADN a ARN, el primer paso para fabricar cualquier proteína), uniéndose a la subunidad codificada por el gen rpoB. El problema es que basta una única mutación puntual en ese gen para que la rifampicina ya no pueda unirse bien a la enzima, y esa mutación aparece con relativa frecuencia de forma espontánea en poblaciones bacterianas grandes. Si se usa rifampicina sola, las pocas bacterias que ya tenían esa mutación al azar sobreviven al tratamiento y se multiplican sin competencia, haciendo que la resistencia aparezca en cuestión de días. Por eso siempre se combina con otro antibiótico de mecanismo distinto (como en el tratamiento de la tuberculosis): mientras el segundo fármaco elimina a las bacterias resistentes a rifampicina, la rifampicina elimina a las que serían resistentes al otro.',
  },
];
export function genAntimicrobianos7Round(){
  const item = pick(ANTIMICROBIANOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Estudios de Susceptibilidad e Interpretación ----------------
   Basado en Tema 5 (CLSI, antibiograma, CIM, cepas ATCC de control de calidad). */
const SUSCEPTIBILIDAD_BANK = [
  {
    pregunta:'Al preparar un inóculo bacteriano para un antibiograma, ¿a qué estándar de turbidez se ajusta la suspensión?',
    correcta:'0,5 de McFarland',
    opts:['2,0 de McFarland','1 de pH','100% de transmitancia'],
    recurso:'El estándar de McFarland es una escala de turbidez que permite estimar cuántas bacterias hay por mililitro en una suspensión, comparando visualmente (o con un fotómetro) su opacidad contra tubos de referencia con concentraciones conocidas de un compuesto que dispersa la luz igual que las bacterias. Un ajuste a 0,5 de McFarland equivale aproximadamente a 1,5×10⁸ unidades formadoras de colonias por mililitro (UFC/mL), la concentración estandarizada que exigen los protocolos CLSI para que un antibiograma sea reproducible entre distintos laboratorios. Si el inóculo queda demasiado diluido, el antibiótico parecerá más eficaz de lo que realmente es (halos artificialmente grandes); si queda demasiado concentrado, ocurre lo contrario. Por eso ajustar bien este primer paso es la base de toda la prueba.',
  },
  {
    pregunta:'¿Qué método de antibiograma mide un halo de inhibición en milímetros pero NO entrega directamente la Concentración Inhibitoria Mínima (CIM)?',
    correcta:'La difusión en disco (Kirby-Bauer)',
    opts:['La dilución en caldo','La epsilometría (E-test)','La dilución en agar'],
    recurso:'En la difusión en disco (Kirby-Bauer), discos de papel impregnados con una cantidad fija de antibiótico se colocan sobre una placa de agar ya sembrada con la bacteria; el antibiótico se difunde radialmente desde el disco, formando un halo donde la bacteria no puede crecer. Ese halo se mide en milímetros y se compara contra tablas de la CLSI para clasificar el resultado en Sensible, Intermedio o Resistente —pero el tamaño del halo por sí solo no dice cuál es la concentración exacta de antibiótico (en µg/mL) necesaria para inhibir a esa bacteria. Para obtener ese dato numérico (la CIM) hace falta un método cuantitativo, como la dilución en caldo/agar o la epsilometría, que sí prueban distintas concentraciones directamente.',
  },
  {
    pregunta:'¿Qué cepa de referencia ATCC se usa como control de calidad estándar para la mayoría de los antibiogramas de bacterias Gram negativas?',
    correcta:'Escherichia coli ATCC 25922',
    opts:['Staphylococcus aureus ATCC 25923','Enterococcus faecalis ATCC 29212','Pseudomonas aeruginosa ATCC 27853'],
    recurso:'Las cepas ATCC (American Type Culture Collection) son cepas bacterianas de referencia, con un comportamiento perfectamente caracterizado y estable, que todo laboratorio de microbiología usa como "control" en paralelo a cada tanda de antibiogramas: si la cepa control da el resultado esperado (dentro de un rango de halos ya validado), se puede confiar en que el resto de la placa también es válido. Escherichia coli ATCC 25922 es la cepa control más usada para verificar antibiogramas de bacilos Gram negativos en general. Otras cepas cumplen roles de control más específicos: Staphylococcus aureus ATCC 25923 para Gram positivos (y para el agar sal manitol), Enterococcus faecalis ATCC 29212 específicamente para vancomicina, y Pseudomonas aeruginosa ATCC 27853 para antibióticos antipseudomónicos.',
  },
  {
    pregunta:'En un antibiograma, a mayor Concentración Inhibitoria Mínima (CIM) de un antibiótico frente a una bacteria (es decir, más resistente), ¿qué se espera que ocurra con el halo de inhibición en el método de difusión en disco?',
    correcta:'El halo será más pequeño',
    opts:['El halo será más grande','El halo no cambia nunca, sin importar la resistencia','La bacteria dejará de crecer por completo'],
    recurso:'La CIM (Concentración Inhibitoria Mínima) es la cantidad más baja de antibiótico necesaria para detener el crecimiento visible de una bacteria: cuanto más resistente es la bacteria, más alta es su CIM (necesita mucho más antibiótico para ser controlada). En el método de difusión en disco, el antibiótico sale del disco y se va diluyendo a medida que se aleja hacia el agar — así que solo alcanza a inhibir el crecimiento hasta el punto donde su concentración local todavía supera la CIM de esa bacteria en particular. Si la bacteria es muy resistente (CIM alta), el antibiótico deja de ser efectivo muy cerca del disco, dando un halo pequeño; si es muy sensible (CIM baja), el halo será grande porque el antibiótico sigue siendo eficaz incluso muy diluido, lejos del disco.',
  },
  {
    pregunta:'¿Cuál de estas guías del CLSI se usa específicamente para establecer los puntos de corte de interpretación (Sensible/Intermedio/Resistente) de los antibiogramas, actualizándose cada año?',
    correcta:'CLSI M100',
    opts:['CLSI M27','CLSI M24','CLSI M45'],
    recurso:'El CLSI (Clinical and Laboratory Standards Institute) publica distintas guías especializadas según el tipo de microorganismo o de prueba: la M02 y la M07 explican cómo realizar la difusión en disco y la dilución en caldo respectivamente para bacterias comunes de crecimiento rápido, mientras que M24 se enfoca en micobacterias y microorganismos de crecimiento lento, y M27/M38 en hongos. La guía M100, en cambio, es la que reúne y actualiza anualmente las tablas concretas de puntos de corte —es decir, qué halo en milímetros o qué valor de CIM en µg/mL corresponde a "Sensible", "Intermedio" o "Resistente" para cada combinación de bacteria y antibiótico. Por eso M100 es la guía de referencia diaria más consultada en cualquier laboratorio clínico al momento de interpretar un resultado.',
  },
  {
    pregunta:'El medio Agar Müeller Hinton se usa como estándar para antibiogramas porque:',
    correcta:'Es un medio no selectivo que permite un crecimiento reproducible de la mayoría de las bacterias de rápido crecimiento',
    opts:['Solo permite crecer hongos y levaduras','Inhibe por completo a todas las bacterias Gram negativas','Solo sirve para cultivar anaerobios estrictos'],
    recurso:'Un antibiograma necesita un medio de cultivo que no favorezca ni perjudique artificialmente a ningún antibiótico, para que el resultado refleje de verdad la susceptibilidad de la bacteria y no una interacción rara con el medio. El Agar Müeller Hinton se eligió como estándar mundial precisamente por eso: es un medio general (no selectivo, deja crecer a la mayoría de bacterias aerobias de rápido crecimiento), con niveles bajos y controlados de timina/timidina (para no interferir con sulfonamidas ni trimetoprim) y niveles definidos de calcio y magnesio (para no alterar la actividad de aminoglucósidos frente a Pseudomonas). Esta estandarización estricta es la que permite comparar resultados de antibiogramas hechos en laboratorios distintos, en países distintos, con confianza de que significan lo mismo.',
  },
  {
    pregunta:'La epsilometría (E-test) combina ventajas de dos métodos de antibiograma porque:',
    correcta:'Usa una tira con un gradiente continuo de antibiótico y entrega directamente la CIM',
    opts:['Solo mide el color de la colonia bacteriana','No requiere ningún medio de cultivo','Solo sirve para identificar hongos, nunca bacterias'],
    recurso:'La epsilometría usa una tira plástica delgada impregnada con un gradiente continuo de concentración de antibiótico (mucha concentración en un extremo, muy poca en el otro), que se coloca sobre el agar ya sembrado, igual que un disco de difusión. El antibiótico se difunde formando una zona de inhibición con forma de elipse (no un círculo perfecto, porque la concentración no es uniforme a lo largo de la tira). Donde el borde de esa elipse cruza la escala numérica impresa en la propia tira, se puede leer directamente la CIM en µg/mL —combinando así la simplicidad práctica de la difusión en disco (una sola placa, fácil de montar) con la información cuantitativa de un método de dilución (un número exacto, no solo S/I/R).',
  },
  {
    pregunta:'Para que un antibiograma sea válido, la bacteria del inóculo debe estar en qué fase de crecimiento poblacional al momento de sembrarla?',
    correcta:'Fase exponencial (logarítmica)',
    opts:['Fase de muerte','Fase estacionaria únicamente','Fase de esporulación'],
    recurso:'El protocolo estándar para preparar el inóculo de un antibiograma parte de un cultivo joven, tomado mientras la bacteria todavía está multiplicándose activamente (fase exponencial), y no de un cultivo viejo donde ya predominan células en fase estacionaria o de muerte. Esto es importante porque, como se explicó en otra pregunta de este módulo, la mayoría de los antibióticos actúan bloqueando procesos activos de síntesis (pared celular, proteínas, ADN) — una bacteria en fase exponencial expresa esos procesos con normalidad, dando un resultado representativo de su verdadera susceptibilidad. Si por error se usara un inóculo de bacterias ya en fase estacionaria (menos activas metabólicamente), el antibiótico podría parecer menos eficaz de lo que realmente es frente a una infección activa real.',
  },
  {
    pregunta:'¿Qué cepa de referencia ATCC de Klebsiella pneumoniae se usa como control positivo del Test de Hodge Modificado para carbapenemasas?',
    correcta:'ATCC BAA-1705',
    opts:['ATCC 25922','ATCC 25923','ATCC 27853'],
    recurso:'Al igual que hay cepas de referencia "generales" (como E. coli ATCC 25922), existen cepas de control muy específicas para pruebas especializadas de detección de mecanismos de resistencia. Para el Test de Hodge Modificado —una prueba fenotípica que detecta si una bacteria produce carbapenemasas, observando una distorsión característica ("trébol") en el crecimiento de una cepa indicadora sensible— se usan dos cepas control de Klebsiella pneumoniae con comportamiento opuesto y ya bien documentado: ATCC BAA-1705, que da resultado positivo (sí produce carbapenemasa), y ATCC BAA-1706, que da resultado negativo. Tener ambos controles en cada tanda permite confirmar que la prueba funcionó correctamente en ambas direcciones, antes de confiar en el resultado de la muestra del paciente.',
  },
];
export function genSusceptibilidad7Round(){
  const item = pick(SUSCEPTIBILIDAD_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Mecanismos de Resistencia ----------------
   Basado en Tema 7 (generalidades), Tema 8 (Gram negativos), Tema 9
   (cocáceas Gram positivos). */
const RESISTENCIA_BANK = [
  {
    pregunta:'¿Cuál de las siguientes NO es uno de los 4 mecanismos principales de resistencia bacteriana adquirida?',
    correcta:'La esporulación',
    opts:['La inactivación enzimática','Las bombas de eflujo','La modificación del sitio blanco'],
    recurso:'Toda resistencia adquirida a antibióticos, sin importar la bacteria ni el fármaco, termina cayendo en alguno de estos 4 mecanismos generales: la inactivación enzimática (una enzima destruye o modifica al antibiótico antes de que actúe, como las betalactamasas), la impermeabilidad (la bacteria impide que el antibiótico entre, por ejemplo perdiendo porinas), las bombas de eflujo (la bacteria expulsa activamente el antibiótico que sí logró entrar) y la modificación del sitio blanco (la bacteria altera la molécula donde el antibiótico debía actuar, como una PBP o un ribosoma modificados). La esporulación, en cambio, es un mecanismo de supervivencia frente a condiciones ambientales adversas en general (falta de nutrientes, calor, desecación) propio de géneros como Bacillus y Clostridium, no un mecanismo de resistencia a antibióticos específicamente.',
  },
  {
    pregunta:'Las betalactamasas de tipo BLEE (de espectro extendido) hidrolizan penicilinas, cefalosporinas de 3ª/4ª generación y monobactámicos, pero NO hidrolizan:',
    correcta:'Los carbapenémicos',
    opts:['Las penicilinas','Las cefalosporinas de 1ª generación','El aztreonam'],
    recurso:'Las BLEE (Betalactamasas de Espectro Extendido) son enzimas producidas por bacterias como E. coli o Klebsiella pneumoniae que rompen el anillo betalactámico de un amplio abanico de antibióticos —penicilinas, todas las generaciones de cefalosporinas incluida la 3ª y 4ª, y el monobactámico aztreonam— dejándolos inactivos. Sin embargo, su nombre "de espectro extendido" no significa "espectro total": los carbapenémicos (imipenem, meropenem, ertapenem) tienen una estructura química con un anillo distinto, más resistente a la hidrólisis por estas enzimas específicas, por lo que suelen seguir siendo eficaces frente a bacterias productoras de BLEE. Por eso los carbapenémicos son frecuentemente la opción de tratamiento de elección cuando se confirma una BLEE, aunque su uso extendido ha llevado a la aparición de un problema aún mayor: las carbapenemasas.',
  },
  {
    pregunta:'¿Qué gen le confiere a Staphylococcus aureus resistencia a meticilina, produciendo una proteína llamada PBP2a con baja afinidad por los antibióticos betalactámicos?',
    correcta:'mecA',
    opts:['vanA','ampC','blaKPC'],
    recurso:'El gen mecA codifica una versión alternativa de proteína fijadora de penicilina, llamada PBP2a, que sigue cumpliendo la función normal de construir la pared celular pero que casi no se une a los antibióticos betalactámicos (penicilinas, oxacilina, meticilina y también las cefalosporinas, con la excepción de las de 5ª generación). Cuando una cepa de Staphylococcus aureus porta este gen, puede seguir fabricando su pared celular con total normalidad aunque esté rodeada de betalactámicos, porque simplemente usa la PBP2a en vez de las PBP normales que sí serían bloqueadas — a esto se le llama Staphylococcus aureus resistente a meticilina (SAMR). Es un mecanismo completamente distinto al de una betalactamasa (que destruye al antibiótico): aquí el antibiótico llega intacto, pero ya no tiene dónde unirse eficazmente.',
  },
  {
    pregunta:'El fenotipo VanA de resistencia a glicopéptidos en Enterococcus se caracteriza por:',
    correcta:'Resistencia de alto nivel tanto a vancomicina como a teicoplanina, transferible por plásmidos',
    opts:['Resistencia solo a teicoplanina, nunca a vancomicina','Resistencia intrínseca de bajo nivel, no transferible','Sensibilidad total y permanente a ambos glicopéptidos'],
    recurso:'Existen varios fenotipos "Van" de resistencia a glicopéptidos en Enterococcus, y no todos son igual de preocupantes. El fenotipo VanA —presente en Enterococcus faecium y Enterococcus faecalis— es el más grave clínicamente: produce resistencia de alto nivel simultáneamente a vancomicina Y a teicoplanina (los dos glicopéptidos disponibles), y está codificado en un transposón (Tn1546) que puede transferirse por plásmidos entre bacterias, incluso hacia otras especies. Esto contrasta, por ejemplo, con el fenotipo VanC (de Enterococcus casseliflavus y E. gallinarum), que es una resistencia intrínseca de bajo nivel, no transferible, y que sí conserva sensibilidad a la teicoplanina. Distinguir estos fenotipos importa porque cambia completamente el pronóstico y las opciones terapéuticas disponibles.',
  },
  {
    pregunta:'¿Qué mecanismo de resistencia usan las bacterias Gram negativas al alterar sus porinas de membrana externa, como la porina OprD en Pseudomonas aeruginosa?',
    correcta:'Impermeabilidad (impide la entrada del antibiótico a la célula)',
    opts:['Inactivación enzimática','Modificación del sitio blanco','Bomba de eflujo'],
    recurso:'Las porinas son canales proteicos en la membrana externa de las bacterias Gram negativas que permiten el paso de moléculas pequeñas hidrofílicas hacia el interior de la célula, incluyendo a varios antibióticos que dependen de esa vía para entrar. Si la bacteria muta o deja de expresar una porina específica —como ocurre con la porina OprD en Pseudomonas aeruginosa, que es la puerta de entrada principal para el imipenem—, el antibiótico simplemente no logra entrar en cantidad suficiente para actuar sobre su blanco intracelular, sin importar cuánto se le exponga desde afuera. A esto se le llama resistencia por impermeabilidad, y es un mecanismo distinto de destruir al antibiótico (inactivación enzimática) o de expulsarlo activamente ya adentro (bomba de eflujo): aquí simplemente nunca llega a entrar.',
  },
  {
    pregunta:'Las betalactamasas tipo AmpC, a diferencia de las BLEE, tienen la particularidad de:',
    correcta:'Hidrolizar también las cefamicinas (como la cefoxitina) y no ser inhibidas por el ácido clavulánico',
    opts:['Ser siempre plasmídicas y nunca cromosómicas','No hidrolizar ningún antibiótico betalactámico','Ser inhibidas por completo por el ácido clavulánico'],
    recurso:'Tanto las BLEE como las AmpC son betalactamasas que hidrolizan un amplio rango de antibióticos, pero se diferencian en dos puntos clave que son importantes para el laboratorio clínico. Primero, las AmpC sí son capaces de destruir a las cefamicinas (como la cefoxitina), un grupo de cefalosporinas que las BLEE no logran hidrolizar bien —por eso la sensibilidad a cefoxitina se usa clínicamente como pista de que una betalactamasa probablemente NO es una BLEE. Segundo, mientras que las BLEE sí se inhiben notablemente al agregar ácido clavulánico (la base del test confirmatorio de BLEE), las AmpC son mucho más resistentes a esa inhibición, y en cambio sí se inhiben por ácido borónico. Estas diferencias de "huella digital" permiten a los microbiólogos distinguir entre ambos mecanismos aunque el antibiograma inicial se vea parecido.',
  },
  {
    pregunta:'El "D-test" se utiliza para detectar qué tipo de resistencia en Staphylococcus y Streptococcus resistentes a la eritromicina pero aparentemente sensibles a la clindamicina?',
    correcta:'Resistencia inducible a clindamicina (fenotipo MLSb)',
    opts:['Resistencia a la vancomicina','Producción de penicilinasa','Resistencia a la rifampicina'],
    recurso:'Algunas cepas de Staphylococcus o Streptococcus poseen un gen (como ermA o ermC) que las hace resistentes a macrólidos, lincosamidas y estreptograminas B a la vez (fenotipo MLSb), pero ese gen puede estar "apagado" y solo activarse (inducirse) si la bacteria detecta la presencia de un macrólido como la eritromicina. Esto genera una trampa clínica real: en el antibiograma inicial, la cepa puede aparecer sensible a clindamicina porque el gen todavía no se activó, pero si se trata al paciente con clindamicina, el contacto con el fármaco puede terminar induciendo la resistencia durante el tratamiento, llevando a un fracaso terapéutico. El D-test detecta justamente esa resistencia "escondida", colocando los discos de eritromicina y clindamicina cerca uno del otro: si aparece un aplanamiento del halo en forma de "D" hacia el disco de eritromicina, se confirma la resistencia inducible y debe informarse la cepa como resistente a clindamicina, aunque el halo aislado pareciera sensible.',
  },
  {
    pregunta:'Un aumento de solo 3 a 5 veces en la Concentración Inhibitoria Mínima (CIM) de un antibiótico frente a una bacteria generalmente se asocia a resistencia adquirida por:',
    correcta:'Mutación cromosómica puntual',
    opts:['Transferencia horizontal de genes (que suele dar aumentos de 50-100 veces)','Esporulación bacteriana','Fagocitosis por macrófagos'],
    recurso:'No todos los mecanismos de resistencia elevan la CIM en la misma magnitud, y esa magnitud da una pista sobre el mecanismo probable detrás. Una mutación cromosómica puntual (un solo cambio en una base del ADN, por ejemplo alterando levemente una PBP o una porina) suele producir un aumento modesto de la CIM, del orden de 3 a 5 veces respecto al valor basal sensible. En cambio, cuando la resistencia llega mediante transferencia horizontal de genes (por ejemplo, adquiriendo un plásmido completo con un gen de betalactamasa ya "listo para usar", en vez de tener que desarrollar la resistencia paso a paso por mutación), el salto en la CIM suele ser mucho más dramático, de 50 a 100 veces o más — reflejando que la bacteria adquirió de golpe una maquinaria de resistencia entera y ya optimizada, en vez de una modificación parcial de sus propias proteínas.',
  },
  {
    pregunta:'¿Qué mecanismo de resistencia a quinolonas es transferible por plásmidos entre bacterias, a diferencia de la clásica mutación cromosómica en la ADN girasa?',
    correcta:'El gen Qnr',
    opts:['El gen mecA','El gen vanA','El gen ampC'],
    recurso:'La forma "clásica" de resistencia a quinolonas ocurre por mutaciones puntuales en los genes cromosómicos que codifican la ADN girasa o la Topoisomerasa IV, lo que reduce la afinidad del antibiótico por su blanco — este mecanismo, al ser cromosómico, se transmite solo verticalmente (de una bacteria a sus descendientes directos), no horizontalmente entre bacterias distintas. El gen Qnr representa un mecanismo alternativo y más reciente, distinto en su ubicación y en su forma de propagarse: está codificado en plásmidos, y la proteína Qnr que produce se une directamente a las topoisomerasas, protegiéndolas físicamente de la acción del antibiótico sin necesidad de mutarlas. Al estar en un plásmido, este mecanismo sí puede transferirse horizontalmente entre bacterias de la misma especie e incluso de especies distintas, facilitando su diseminación mucho más rápido que una mutación cromosómica aislada.',
  },
  {
    pregunta:'Una bacteria "multirresistente" (MDR, por sus siglas en inglés) se define como aquella resistente a:',
    correcta:'Tres o más familias de antibióticos de elección para ese microorganismo',
    opts:['Solo un antibiótico específico','Todos los antibióticos sin excepción (esa definición corresponde a PDR)','Solo a antibióticos de uso tópico'],
    recurso:'Existe una escalera de términos que describen distintos grados de multirresistencia bacteriana, y es importante no confundirlos. Una bacteria MDR (multidrug-resistant, o multirresistente) es aquella que se volvió resistente a tres o más familias distintas de los antibióticos que normalmente se consideran de elección para tratarla —no basta con ser resistente a un solo fármaco, tiene que perder eficacia frente a varias categorías completas a la vez. Un escalón más grave es XDR (extensively drug-resistant), donde la bacteria queda sensible solo a una o dos categorías de antibióticos. El escalón más extremo es PDR (pandrug-resistant o panresistente), donde la bacteria es resistente absolutamente a todos los antibióticos disponibles habitualmente usados para tratarla, sin ninguna opción terapéutica estándar restante.',
  },
];
export function genResistencia7Round(){
  const item = pick(RESISTENCIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Carbapenemasas y Detección ----------------
   Basado en Tema 17 (KPC/NDM/OXA-48-like, mCIM/eCIM, y los 3 ejemplos de
   antibiograma interpretado que trae el propio material del curso). */
const CARBAPENEMASAS_BANK = [
  {
    caso:'Antibiograma de Klebsiella pneumoniae: resistente a ampicilina, amoxicilina-ácido clavulánico, piperacilina-tazobactam, cefotaxima, ceftazidima, cefepima, aztreonam, ertapenem y meropenem; imipenem resistente/intermedio; amikacina y colistina sensibles; y sensible a ceftazidima-avibactam.',
    pregunta:'¿Qué mecanismo de resistencia sugiere este perfil de multirresistencia amplia con sensibilidad conservada a ceftazidima-avibactam?',
    correcta:'Carbapenemasa tipo KPC (Clase A, inhibible por avibactam)',
    opts:['Una metalo-betalactamasa (MBL)','Impermeabilidad simple por pérdida de porinas','Una bomba de eflujo generalizada'],
    recurso:'El avibactam es un inhibidor de betalactamasas que funciona muy bien contra enzimas de Clase A de Ambler (con un aminoácido serina en su sitio activo), como la carbapenemasa KPC, pero que no tiene ningún efecto sobre las metalo-betalactamasas (que dependen de zinc, no de serina, en su mecanismo de hidrólisis). Por eso, cuando un antibiograma muestra resistencia amplia a casi todos los betalactámicos —incluidos los carbapenémicos— pero recupera sensibilidad al combinar ceftazidima con avibactam, esa recuperación específica es una pista fuerte de que el mecanismo responsable es una carbapenemasa de Clase A como KPC, y no una metalo-betalactamasa (que seguiría siendo resistente incluso con avibactam presente). Esta lógica de "qué combinación con inhibidor recupera la sensibilidad" es una de las formas más prácticas de inferir el tipo de carbapenemasa antes de una confirmación molecular.',
  },
  {
    caso:'Antibiograma de Escherichia coli con el mismo patrón amplio de resistencia a cefalosporinas y carbapenémicos que el caso anterior, pero con una diferencia notable: el aztreonam sale sensible.',
    pregunta:'¿Qué dato de este antibiograma sugiere específicamente una metalo-betalactamasa (MBL) como NDM, en vez de una serín-carbapenemasa como KPC?',
    correcta:'La susceptibilidad conservada al aztreonam',
    opts:['La resistencia a meropenem','La resistencia a ceftazidima','La resistencia a piperacilina-tazobactam'],
    recurso:'Las metalo-betalactamasas (MBL, como NDM, VIM e IMP) dependen de un ion de zinc en su sitio activo para hidrolizar el anillo betalactámico, y por una particularidad de su estructura química, este tipo de enzima es incapaz de hidrolizar al aztreonam (el único monobactámico de uso clínico) — a diferencia de las serín-carbapenemasas como KPC, que sí lo destruyen. Por eso, frente a un perfil de resistencia amplísima a cefalosporinas y carbapenémicos, encontrar que el aztreonam sigue siendo sensible es una pista bioquímica bastante específica de que el mecanismo detrás es una MBL, no una KPC. En la práctica, esta particularidad a veces incluso permite usar aztreonam en combinación con un inhibidor de betalactamasas (como avibactam) para tratar infecciones por bacterias productoras de MBL, ya que ningún inhibidor actual neutraliza directamente a las metalo-betalactamasas.',
  },
  {
    caso:'Antibiograma de Klebsiella pneumoniae: ertapenem resistente/intermedio, meropenem e imipenem con zonas de inhibición disminuidas pero a veces todavía dentro de rango sensible, y las cefalosporinas de amplio espectro con resultados "aparentemente susceptibles" o con resistencia solo moderada.',
    pregunta:'¿Por qué las carbapenemasas tipo OXA-48-like son consideradas especialmente peligrosas de detectar en el laboratorio?',
    correcta:'Porque hidrolizan débilmente a los carbapenémicos, dando un perfil engañoso donde las cefalosporinas de amplio espectro parecen "aparentemente susceptibles"',
    opts:['Porque son completamente inmunes a cualquier método de detección conocido','Porque solo afectan a hongos, nunca a bacterias','Porque nunca producen resistencia real, solo en el laboratorio'],
    recurso:'A diferencia de KPC o de las metalo-betalactamasas, que suelen producir un fenotipo de resistencia amplio y evidente, las carbapenemasas tipo OXA-48-like (de Clase D de Ambler) hidrolizan a los carbapenémicos de forma relativamente débil, lo que puede dejar las Concentraciones Inhibitorias Mínimas (CIM) de meropenem o imipenem apenas por encima del punto de corte sensible, o incluso todavía dentro de rango sensible en algunos casos. Peor aún: estas enzimas casi no afectan a las cefalosporinas de amplio espectro, así que un antibiograma superficial podría mostrar a la bacteria como "sensible" a cefalosporinas y solo levemente resistente a carbapenémicos, llevando a un tratamiento inadecuado con cefalosporinas que en realidad fallará. Por esta razón el ertapenem —más sensible que meropenem o imipenem para detectar este mecanismo débil— se usa como el mejor marcador de sospecha, y ante cualquier duda se recomienda siempre confirmar con pruebas fenotípicas dedicadas.',
  },
  {
    pregunta:'¿Qué método de detección de carbapenemasas usa EDTA (un quelante de zinc) para diferenciar una metalo-betalactamasa (MBL) de una serín-carbapenemasa?',
    correcta:'El eCIM (Método de Inactivación de Carbapenem con EDTA)',
    opts:['El test de la coagulasa','El test de la catalasa','El test de la oxidasa'],
    recurso:'El mCIM (Método de Inactivación de Carbapenem Modificado) confirma en general si una bacteria produce cualquier tipo de carbapenemasa, incubando un disco de meropenem junto con la bacteria sospechosa y luego usando ese disco "ya usado" sobre una cepa indicadora de E. coli sensible: si la bacteria sospechosa tenía carbapenemasa, habrá inactivado el meropenem del disco y la E. coli indicadora crecerá cerca de él. El eCIM agrega un paso extra: como las metalo-betalactamasas (MBL) necesitan zinc para funcionar, se agrega EDTA (un compuesto que "secuestra" el zinc del ambiente) al mismo ensayo. Si la bacteria SÍ tenía una MBL, el EDTA bloquea su actividad y el resultado cambia respecto al mCIM solo; si tenía una serín-carbapenemasa (que no depende de zinc), el EDTA no cambia nada. Comparando ambos resultados (mCIM vs. eCIM) se puede inferir la familia de carbapenemasa sin necesitar pruebas moleculares.',
  },
  {
    pregunta:'Un resultado de mCIM positivo junto con un eCIM negativo sugiere qué tipo de carbapenemasa?',
    correcta:'Una serín-carbapenemasa (como KPC u OXA-48-like)',
    opts:['Una metalo-betalactamasa (MBL)','Ausencia total de cualquier carbapenemasa','Resistencia únicamente por impermeabilidad de porinas'],
    recurso:'Interpretar la combinación mCIM/eCIM es una lógica de descarte: el mCIM positivo confirma que SÍ hay una carbapenemasa de algún tipo (la bacteria logró inactivar el meropenem del disco). La pregunta siguiente es cuál tipo, y ahí entra el eCIM: si al agregar EDTA (que bloquea específicamente a las enzimas dependientes de zinc) el resultado sigue siendo básicamente igual —es decir, "negativo" para el efecto adicional del EDTA—, eso indica que la enzima responsable NO depende de zinc para funcionar, y por lo tanto no es una metalo-betalactamasa. Las carbapenemasas que no dependen de zinc son las de Clase A (como KPC) y Clase D (como OXA-48-like), ambas con un mecanismo basado en un aminoácido serina en su sitio activo. Por eso, mCIM positivo + eCIM negativo apunta hacia una serín-carbapenemasa, mientras que mCIM positivo + eCIM positivo apuntaría hacia una MBL.',
  },
  {
    pregunta:'¿En qué región del mundo se originó y se ha diseminado principalmente la carbapenemasa NDM?',
    correcta:'El subcontinente indio',
    opts:['América del Norte','Europa mediterránea','Australia y Oceanía'],
    recurso:'Aunque hoy en día las carbapenemasas se encuentran distribuidas en todo el mundo debido a los viajes internacionales y al turismo médico, cada familia principal tiene un origen geográfico donde se describió por primera vez y donde sigue siendo más prevalente: KPC se asocia principalmente a América del Norte y Latinoamérica (con Klebsiella pneumoniae como especie principal), NDM se originó y se diseminó desde el subcontinente indio (con E. coli como especie principal), VIM predomina en la cuenca del Mediterráneo y Europa, IMP en la región Asia-Pacífico, y OXA-48-like en la cuenca mediterránea, Medio Oriente y el norte de África. Conocer esta distribución ayuda a orientar la sospecha clínica inicial, por ejemplo frente a un paciente con antecedente de viaje o de hospitalización reciente en alguna de estas regiones.',
  },
  {
    pregunta:'La carbapenemasa KPC pertenece a la Clase A de Ambler y se inhibe eficazmente por:',
    correcta:'Avibactam, vaborbactam y relebactam',
    opts:['EDTA (un quelante de zinc)','Ácido clavulánico únicamente, sin ninguna otra alternativa','Ninguna combinación de fármacos conocida'],
    recurso:'KPC (Klebsiella pneumoniae carbapenemasa) es, con diferencia, la carbapenemasa de Clase A más extendida en Enterobacterales a nivel mundial, y su mecanismo depende —como todas las enzimas de esta clase— de un aminoácido serina en su sitio activo, no de zinc. Esto la hace vulnerable a un grupo de inhibidores modernos diseñados específicamente para bloquear ese tipo de mecanismo: avibactam (combinado con ceftazidima), vaborbactam (combinado con meropenem) y relebactam (combinado con imipenem-cilastatina). Estas combinaciones han abierto opciones de tratamiento reales para infecciones antes casi intratables por KPC, siempre que se confirme que efectivamente es ese mecanismo (y no una metalo-betalactamasa, que ninguno de estos tres inhibidores logra bloquear).',
  },
  {
    pregunta:'¿Qué especie bacteriana es la más frecuentemente asociada a la carbapenemasa KPC en Chile, según la vigilancia de laboratorio del país?',
    correcta:'Klebsiella pneumoniae',
    opts:['Pseudomonas aeruginosa','Acinetobacter baumannii','Salmonella Typhi'],
    recurso:'Aunque las carbapenemasas pueden aparecer en distintos géneros de bacilos Gram negativos, cada tipo tiene una especie "predilecta" donde se detecta con mayor frecuencia, y esto coincide con lo reportado en la vigilancia de laboratorio de Chile: la línea de tiempo del país muestra que la primera carbapenemasa detectada en Enterobacterales, en 2012, fue precisamente KPC en cepas de Klebsiella pneumoniae, seguida en 2014 por la primera NDM confirmada. Con el tiempo se sumaron otras especies a la vigilancia (como Pseudomonas aeruginosa desde 2018) y en años más recientes ambos mecanismos (KPC y NDM) han alcanzado frecuencias similares en el país, además de la aparición más reciente de OXA-48-like. Conocer qué especie predomina para cada mecanismo ayuda a priorizar la sospecha clínica según el microorganismo aislado.',
  },
  {
    pregunta:'El test rápido "Carba NP" detecta la presencia de carbapenemasas mediante:',
    correcta:'Un cambio de color de un indicador de pH al hidrolizarse el carbapenem del reactivo',
    opts:['La medición de un halo de inhibición en milímetros','Un cultivo prolongado de 7 días de incubación','La secuenciación genética completa del microorganismo'],
    recurso:'El Carba NP es una prueba bioquímica rápida (entrega resultado en menos de 2 horas) que no necesita cultivar nada nuevo ni esperar el crecimiento de una colonia: simplemente se pone en contacto una suspensión concentrada de la bacteria sospechosa con una solución que contiene imipenem y un indicador de pH (rojo de fenol). Si la bacteria produce una carbapenemasa, hidroliza el imipenem del reactivo, y ese proceso libera protones que acidifican la solución, cambiando el color del indicador de rojo a amarillo/naranja —una reacción visible a simple vista. Es una prueba con muy buena sensibilidad y especificidad (cercana al 98%) para detectar carbapenemasas de Clase A, B y D, y su gran ventaja frente a métodos como el mCIM es la rapidez, aunque no distingue por sí sola cuál es el tipo exacto de carbapenemasa.',
  },
];
export function genCarbapenemasas7Round(){
  const item = pick(CARBAPENEMASAS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: (item.caso ? '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>' : '<p class="prompt-sentence">'+item.pregunta+'</p>'),
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Taxonomía y Medios de Cultivo ----------------
   Basado en Tema 10, Tema 11 y el Manual de Medios de Cultivo y
   Procedimientos (fundamento, interpretación y controles de calidad). */
const TAXONOMIA_BANK = [
  {
    pregunta:'En el Agar MacConkey, ¿qué componentes inhiben selectivamente el crecimiento de las bacterias Gram positivas?',
    correcta:'Las sales biliares y el cristal violeta',
    opts:['El indicador rojo de fenol','El agar mismo (el agente gelificante)','La lactosa presente en el medio'],
    recurso:'El Agar MacConkey es a la vez selectivo y diferencial, y logra ambas cosas con ingredientes distintos. La selectividad —dejar crecer solo a las bacterias Gram negativas e inhibir a las Gram positivas— se debe a las sales biliares y al cristal violeta incorporados en el medio, que dañan la membrana y la pared celular de las bacterias Gram positivas (mucho más vulnerables a estos compuestos que las Gram negativas, que tienen una membrana externa protectora). La parte diferencial, en cambio, depende de la lactosa y de un indicador de pH (rojo neutro): las bacterias que fermentan lactosa acidifican el medio a su alrededor, virando el indicador y dando colonias rosadas o fucsia, mientras que las que no la fermentan quedan incoloras.',
  },
  {
    pregunta:'En el Agar XLD, ¿qué indica que una colonia bacteriana desarrolle un centro de color negro?',
    correcta:'Producción de ácido sulfhídrico (H2S)',
    opts:['Fermentación de la lactosa','Producción de la enzima ureasa','Motilidad bacteriana activa'],
    recurso:'El Agar XLD contiene tiosulfato de sodio y citrato férrico específicamente para poder detectar la producción de ácido sulfhídrico (H2S) por parte de ciertas bacterias entéricas, como muchas especies de Salmonella. Cuando una bacteria produce H2S durante su metabolismo, este gas reacciona con el citrato férrico del medio formando sulfuro de hierro, un compuesto de color negro que se deposita visiblemente en el centro de la colonia. Esta reacción es independiente de la fermentación de azúcares (que se detecta por separado, con un indicador de pH que vira de rojo a amarillo si hay fermentación) — de hecho, una misma colonia puede fermentar azúcares Y producir H2S a la vez, dando una combinación de colores que ayuda a distinguir géneros entéricos entre sí.',
  },
  {
    pregunta:'¿Qué tipo de hemólisis en Agar Sangre produce un halo verdoso, por conversión de hemoglobina a metahemoglobina, sin lisis completa de los glóbulos rojos?',
    correcta:'Hemólisis alfa',
    opts:['Hemólisis beta','Hemólisis gamma','Hemólisis total inmediata'],
    recurso:'La hemólisis es la capacidad de una bacteria de destruir los glóbulos rojos presentes en el Agar Sangre, y se clasifica en tres tipos según su apariencia visual, un dato clave para identificar cocáceas Gram positivas. La hemólisis alfa es una lisis solo parcial: la bacteria daña los glóbulos rojos lo suficiente como para convertir la hemoglobina en metahemoglobina (un pigmento verdoso), pero sin destruir completamente la estructura celular, dando ese característico halo verde alrededor de la colonia (típico de Streptococcus pneumoniae y del grupo viridans). La hemólisis beta, en cambio, es una lisis total y completa, dejando un halo claro y transparente (típico de Streptococcus pyogenes). La hemólisis gamma simplemente significa ausencia de cualquier cambio visible, sin lisis de ningún tipo.',
  },
  {
    pregunta:'El Agar TCBS es selectivo y diferencial específicamente para el aislamiento de:',
    correcta:'Vibrio spp. (como Vibrio cholerae)',
    opts:['Salmonella y Shigella','Staphylococcus aureus','Mycobacterium tuberculosis'],
    recurso:'El nombre TCBS resume sus ingredientes clave: Tiosulfato, Citrato, sales Biliares y Sacarosa. Una concentración muy alta de tiosulfato y citrato, junto con sales biliares y un pH fuertemente alcalino, crea un ambiente tan hostil que inhibe casi por completo el crecimiento de las enterobacterias comunes, dejando espacio casi exclusivo para que crezcan las especies del género Vibrio, que toleran bien ese pH alcalino. La parte diferencial depende de la sacarosa: las especies que la fermentan (como Vibrio cholerae) acidifican el medio y dan colonias amarillas, mientras que las que no la fermentan (como Vibrio parahaemolyticus) dan colonias verdes. Este medio tan especializado es clave para el diagnóstico rápido de sospecha de cólera u otras infecciones por Vibrio a partir de una muestra de deposiciones.',
  },
  {
    pregunta:'En la prueba de la catalasa, se debe tener especial cuidado de no arrastrar agar sangre junto con la colonia porque:',
    correcta:'Los propios glóbulos rojos contienen catalasa y pueden dar un resultado falso positivo',
    opts:['El agar sangre siempre produce un falso negativo total','La sangre destruye por completo el reactivo usado','No existe ningún riesgo real al hacer esta prueba'],
    recurso:'La prueba de la catalasa detecta si una bacteria posee esta enzima, que descompone el peróxido de hidrógeno (agua oxigenada) en agua y oxígeno, generando burbujas visibles cuando se le agrega el reactivo a la colonia. Esta prueba es clave, por ejemplo, para diferenciar Staphylococcus (catalasa positivo) de Streptococcus (catalasa negativo). El problema es que los glóbulos rojos de la sangre humana (y del agar sangre usado para cultivar) también contienen abundante catalasa propia. Si al tomar la colonia con el asa se arrastra sin querer algo de agar sangre junto con ella, esa catalasa "extra" de origen sanguíneo puede producir burbujas y dar un resultado falso positivo, haciendo parecer catalasa-positiva a una bacteria que en realidad no lo es. Por eso se recomienda tomar la colonia con extremo cuidado, evitando tocar el agar debajo de ella.',
  },
  {
    pregunta:'¿Qué enzima se detecta en la prueba de la oxidasa mediante el reactivo tetrametil-p-fenilendiamina, que se oxida y produce un color púrpura?',
    correcta:'La citocromo c oxidasa',
    opts:['La catalasa','La coagulasa','La ureasa'],
    recurso:'La citocromo c oxidasa es una proteína clave en la cadena transportadora de electrones del metabolismo respirador de muchas bacterias aerobias, y su presencia o ausencia es un dato bioquímico muy usado para clasificar géneros (por ejemplo, para diferenciar Pseudomonas, oxidasa positiva, de la familia Enterobacteriaceae, oxidasa negativa en general). La prueba se realiza empapando un papel o disco con el reactivo tetrametil-p-fenilendiamina y frotando la colonia sobre él: si la bacteria posee citocromo c oxidasa, esta enzima le cede electrones al reactivo, oxidándolo y produciendo un cambio de color a púrpura intenso en pocos segundos. Un detalle técnico importante de esta prueba es que debe realizarse con un asa de plástico, vidrio o madera —nunca de metal—, porque el metal puede oxidar el reactivo por sí solo y dar un falso positivo.',
  },
  {
    pregunta:'El Agar TSI (hierro y triple azúcar) permite evidenciar simultáneamente varias reacciones bioquímicas. ¿Cuáles?',
    correcta:'Fermentación de glucosa, lactosa y sacarosa, producción de H2S y producción de gas',
    opts:['Únicamente la motilidad de la bacteria','Únicamente la producción de indol','Únicamente la resistencia a antibióticos'],
    recurso:'El Agar TSI (Triple Sugar Iron, o Triple Azúcar Hierro) es uno de los medios de identificación bioquímica más usados en enterobacterias precisamente porque combina varias pistas en un solo tubo. Contiene tres azúcares en distinta concentración (glucosa en baja cantidad, lactosa y sacarosa en cantidad mayor), un indicador de pH (rojo de fenol) que revela la fermentación de esos azúcares por un cambio de color, y tiosulfato de sodio junto con una sal de hierro que revela la producción de ácido sulfhídrico (H2S) con un ennegrecimiento del medio. Además, si se forman burbujas o grietas en el agar, eso indica producción de gas durante la fermentación. Al leer el tubo completo (superficie inclinada vs. fondo profundo, presencia o no de negro, presencia o no de burbujas) se obtiene un patrón característico que ayuda mucho a orientar la identificación de género o especie.',
  },
  {
    pregunta:'¿Qué prueba bioquímica en Agar LIA diferencia a Proteus, Providencia y Morganella (que deaminan la lisina) de otras enterobacterias que la descarboxilan?',
    correcta:'La lisina deaminasa',
    opts:['La ureasa','El citrato de Simmons','La oxidasa'],
    recurso:'El Agar LIA (Lysine Iron Agar) contiene lisina como sustrato principal, y distintos grupos de bacterias la procesan de forma opuesta: la mayoría de las enterobacterias (como E. coli o Klebsiella) poseen la enzima lisina descarboxilasa, que eleva el pH del medio (dando un color púrpura en toda la superficie del tubo). En cambio, el grupo formado por Proteus, Providencia y Morganella posee en su lugar la enzima lisina deaminasa, que produce un compuesto distinto que vira la superficie inclinada del tubo a un color rojizo característico, muy fácil de distinguir del resultado descarboxilasa. Esta diferencia bioquímica tan marcada es una de las formas más rápidas y económicas de sospechar que una enterobacteria pertenece al grupo Proteus-Providencia-Morganella, incluso antes de completar toda la batería de identificación.',
  },
  {
    pregunta:'El Agar Salino Manitol es selectivo para el género Staphylococcus por su alta concentración de:',
    correcta:'Cloruro de sodio (NaCl)',
    opts:['Ácido clorhídrico','Sales biliares','Ureasa'],
    recurso:'El Agar Salino Manitol contiene una concentración de cloruro de sodio mucho más alta (alrededor de 7,5%) que la mayoría de los medios de cultivo habituales, un nivel de salinidad que resulta tóxico para la mayoría de las bacterias, pero que el género Staphylococcus tolera perfectamente bien gracias a su naturaleza halotolerante. Esto convierte al medio en selectivo para Staphylococcus, dejando fuera a casi cualquier otra bacteria contaminante. Además, el medio también es diferencial gracias al manitol y a un indicador de pH (rojo de fenol): las especies que fermentan el manitol —como Staphylococcus aureus— acidifican el medio a su alrededor y producen colonias amarillas, mientras que las que no lo fermentan —como la mayoría de los estafilococos coagulasa-negativos— mantienen el medio de color rosado/rojo sin cambio.',
  },
  {
    pregunta:'¿Qué reactivos se usan en la prueba de Voges-Proskauer para detectar la producción de acetoína a partir de la fermentación de glucosa?',
    correcta:'Alfa-naftol y KOH (hidróxido de potasio)',
    opts:['El reactivo de Kovacs','Tetrametil-p-fenilendiamina','Cloruro mercúrico ácido'],
    recurso:'La prueba de Voges-Proskauer detecta si una bacteria, al fermentar glucosa, produce como subproducto un compuesto intermedio llamado acetoína (en vez de producir directamente ácidos mixtos, que sería un metabolismo distinto detectado por la prueba de rojo de metilo). Para revelar la presencia de acetoína se agregan dos reactivos en secuencia al mismo caldo de cultivo: primero alfa-naftol, y luego hidróxido de potasio (KOH); si la acetoína está presente, ambos reactivos catalizan una reacción química que produce un color rojo-cobrizo visible, típicamente entre los 15 minutos y la hora después de agregarlos (esperar más tiempo puede dar un falso positivo por oxidación espontánea del medio). Esta prueba, junto con la de rojo de metilo, ayuda a diferenciar por ejemplo Klebsiella pneumoniae (Voges-Proskauer positivo) de Escherichia coli (Voges-Proskauer negativo, rojo de metilo positivo).',
  },
];
export function genTaxonomia7Round(){
  const item = pick(TAXONOMIA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Staphylococcus ----------------
   Basado en Tema 12 (Familia Staphylococcaceae) y su documento de apoyo. */
const STAPHYLO_BANK = [
  {
    pregunta:'¿Qué prueba bioquímica diferencia principalmente al género Staphylococcus (positivo) del género Streptococcus (negativo)?',
    correcta:'La catalasa',
    opts:['La coagulasa','La oxidasa','La ureasa'],
    recurso:'La catalasa es la primera prueba bioquímica que se realiza frente a una cocácea Gram positiva agrupada en racimos o en cadenas, porque separa de inmediato dos grandes familias con historias clínicas muy distintas: Staphylococcus, que sí posee esta enzima (y por lo tanto descompone el peróxido de hidrógeno con formación de burbujas visibles), y Streptococcus/Enterococcus, que no la poseen. Recién después de confirmar catalasa positiva tiene sentido seguir avanzando en el algoritmo de identificación dentro del género Staphylococcus —por ejemplo, con la prueba de la coagulasa para distinguir Staphylococcus aureus de los estafilococos coagulasa-negativos—, ya que la coagulasa no tendría ningún sentido diagnóstico si primero no se confirmó que se trata de un Staphylococcus y no de un Streptococcus.',
  },
  {
    pregunta:'¿Qué especie de Staphylococcus se identifica clásicamente por ser coagulasa positiva y fermentar el manitol en el Agar Salino Manitol?',
    correcta:'Staphylococcus aureus',
    opts:['Staphylococcus epidermidis','Staphylococcus saprophyticus','Staphylococcus lugdunensis'],
    recurso:'Staphylococcus aureus es la única especie del género que combina de forma característica dos rasgos clave en el laboratorio: es coagulasa positiva (posee la enzima que convierte el fibrinógeno en fibrina, formando un coágulo visible alrededor de la bacteria) y fermenta el manitol (virando a amarillo el Agar Salino Manitol). El resto de las especies del género —agrupadas colectivamente como "estafilococos coagulasa-negativos" (SCN), como S. epidermidis o S. saprophyticus— no poseen coagulasa, y la mayoría tampoco fermenta el manitol. Esta combinación de pruebas simples permite, en la práctica diaria de un laboratorio, separar rápidamente a S. aureus (un patógeno mucho más virulento y agresivo) del resto de estafilococos, que suelen ser oportunistas de menor virulencia salvo excepciones como S. lugdunensis.',
  },
  {
    pregunta:'Staphylococcus saprophyticus, causa frecuente de infecciones urinarias en mujeres jóvenes, se diferencia de otros estafilococos coagulasa-negativos por ser:',
    correcta:'Resistente a la novobiocina',
    opts:['Sensible a la novobiocina','Coagulasa positivo','Oxidasa positivo'],
    recurso:'Dentro del grupo de los estafilococos coagulasa-negativos (SCN), la mayoría de las especies son sensibles a un antibiótico llamado novobiocina, dando un halo de inhibición amplio alrededor de un disco cargado con este fármaco. Staphylococcus saprophyticus es la excepción clínicamente relevante: es resistente a la novobiocina, dando un halo pequeño (6-12 mm) o nulo. Esta sola prueba —sencilla, rápida y barata de realizar— permite diferenciarlo del resto de los SCN sin necesidad de pruebas más complejas, algo muy útil en la práctica porque S. saprophyticus tiene una relevancia clínica particular: es una de las causas más frecuentes de cistitis (infección urinaria baja) en mujeres jóvenes sexualmente activas, a diferencia de otros SCN que rara vez causan enfermedad real fuera de contextos hospitalarios con dispositivos invasivos.',
  },
  {
    pregunta:'El gen mecA en Staphylococcus aureus resistente a meticilina (SAMR) produce una proteína de baja afinidad por los betalactámicos llamada:',
    correcta:'PBP2a',
    opts:['Penicilinasa','Coagulasa','Hemolisina alfa'],
    recurso:'A diferencia de la resistencia a penicilina "clásica" de Staphylococcus aureus (que ocurre por producción de una enzima penicilinasa que destruye al antibiótico, presente en más del 90% de las cepas), la resistencia a meticilina funciona por un mecanismo completamente distinto: el gen mecA codifica una proteína fijadora de penicilina alternativa, llamada PBP2a, que sigue construyendo la pared celular con normalidad pero que apenas se une a los antibióticos betalactámicos. Con esta PBP "de repuesto" disponible, la bacteria puede seguir fabricando su pared celular aunque el resto de sus PBP normales estén bloqueadas por el antibiótico, volviéndola resistente no solo a meticilina/oxacilina, sino a prácticamente todos los betalactámicos disponibles (con la excepción de las cefalosporinas de 5ª generación, diseñadas específicamente para unirse también a la PBP2a).',
  },
  {
    pregunta:'¿Qué diferencia al fenotipo MRSA con gen mecC del fenotipo MRSA con el gen mecA clásico, en el resultado del antibiograma?',
    correcta:'mecC es resistente a cefoxitina pero susceptible a oxacilina, mientras que mecA es resistente a ambas',
    opts:['mecC nunca es resistente a ningún antibiótico','mecA solo se encuentra en el género Streptococcus','No existe ninguna diferencia real entre ambos genes'],
    recurso:'El gen mecC es una variante menos común de mecA, descubierta más recientemente, que también produce una PBP2a de baja afinidad, pero con una particularidad importante para el laboratorio: las cepas mecC suelen dar resultado resistente frente al disco de cefoxitina (el método de detección de rutina para MRSA), pero pueden aparecer erróneamente susceptibles si se prueba oxacilina directamente. Las cepas con el gen mecA clásico, en cambio, son resistentes a ambos antibióticos de forma consistente. Esta diferencia es clínicamente relevante porque un laboratorio que solo probara oxacilina (sin usar cefoxitina como método de tamizaje) podría pasar por alto una cepa mecC verdaderamente resistente a meticilina, subestimando el problema real de resistencia del paciente.',
  },
  {
    pregunta:'La toxina estafilocócica Leucocidina de Panton-Valentine (PVL) se asocia principalmente a:',
    correcta:'Cepas de SAMR comunitario, causando infecciones cutáneas graves',
    opts:['Cepas siempre sensibles a la penicilina, sin ninguna relación con resistencia','Ninguna relevancia clínica conocida hasta la fecha','Solamente a estafilococos coagulasa-negativos'],
    recurso:'La Leucocidina de Panton-Valentine (PVL) es una toxina que forma poros en la membrana de los glóbulos blancos (leucocitos), destruyéndolos y liberando su contenido, lo que desencadena una respuesta inflamatoria intensa en el tejido afectado. Esta toxina se encuentra con mucha más frecuencia en cepas de Staphylococcus aureus resistente a meticilina de origen comunitario (SAMR-AC) que en las cepas hospitalarias clásicas, y se asocia clínicamente a infecciones cutáneas y de tejidos blandos particularmente agresivas y necrosantes (como abscesos grandes o fascitis necrosante), más que a bacteriemia. Reconocer esta asociación ayuda a anticipar un curso clínico potencialmente más grave cuando se identifica una cepa comunitaria de SAMR productora de PVL.',
  },
  {
    pregunta:'¿Qué toxina de Staphylococcus aureus actúa como superantígeno y es la responsable del síndrome de shock tóxico?',
    correcta:'TSST-1',
    opts:['Coagulasa','Catalasa','Proteína A'],
    recurso:'Un superantígeno es una toxina capaz de activar de forma masiva y no específica a los linfocitos T del sistema inmune (hasta un 20% de ellos a la vez, en vez del 0,001% habitual de una respuesta inmune normal), desencadenando una liberación explosiva de citoquinas inflamatorias. La toxina TSST-1 (Toxic Shock Syndrome Toxin 1) de Staphylococcus aureus funciona exactamente así, y es la responsable del síndrome de shock tóxico: un cuadro grave con fiebre alta súbita, hipotensión y fallo multiorgánico, históricamente asociado al uso prolongado de tampones vaginales (aunque también puede originarse en heridas quirúrgicas u otras infecciones localizadas). A diferencia de la coagulasa o la catalasa (enzimas con funciones estructurales/metabólicas), TSST-1 actúa directamente sobre el sistema inmune del hospedero, siendo la causa de la gravedad sistémica de este síndrome.',
  },
  {
    pregunta:'La Proteína A de Staphylococcus aureus ayuda a la bacteria a evadir el sistema inmune del hospedero porque:',
    correcta:'Se une a la fracción Fc de los anticuerpos IgG, enmascarando a la bacteria',
    opts:['Destruye directamente a los anticuerpos del hospedero','Produce esporas de defensa contra el sistema inmune','Bloquea por completo la activación del complemento'],
    recurso:'Los anticuerpos (como la IgG) tienen dos extremos con funciones distintas: la fracción Fab, que reconoce y se une específicamente al antígeno (por ejemplo, a la superficie de la bacteria), y la fracción Fc, que una vez unido el anticuerpo, es reconocida por los receptores de los fagocitos (macrófagos y neutrófilos) para "marcar" a la bacteria y facilitar que sea destruida (opsonización). La Proteína A de Staphylococcus aureus se ancla en la superficie de la bacteria y se une precisamente a esa fracción Fc de los anticuerpos, pero al revés de como debería funcionar: los anticuerpos quedan "pegados" con su fracción Fc secuestrada por la bacteria y su fracción Fab apuntando hacia afuera, sin que los fagocitos puedan reconocer la señal de opsonización, dificultando así que el sistema inmune elimine a la bacteria de forma eficaz.',
  },
  {
    pregunta:'En el "D-test" para Staphylococcus, una zona de aplanamiento con forma de "D" entre los discos de eritromicina y clindamicina indica:',
    correcta:'Resistencia inducible a clindamicina, que debe informarse como resistente aunque el halo aislado parezca sensible',
    opts:['Sensibilidad total y garantizada a ambos antibióticos','Resistencia a la vancomicina','Ausencia completa de cualquier mecanismo de resistencia'],
    recurso:'Algunas cepas de Staphylococcus poseen un gen (como ermA o ermC) que, al activarse, produce resistencia simultánea a macrólidos (como eritromicina), lincosamidas (como clindamicina) y estreptograminas B —pero ese gen puede estar inactivo por defecto y solo "encenderse" (inducirse) en presencia de un macrólido. El D-test detecta justamente esta resistencia oculta: se colocan los discos de eritromicina y clindamicina a una distancia estandarizada, y si la eritromicina "induce" la resistencia en la zona cercana a ambos discos, se ve un achatamiento del halo de clindamicina con forma de "D" (en vez de un círculo perfecto). Un D-test positivo obliga a informar la cepa como resistente a clindamicina, incluso si el halo de clindamicina aislado parecía sensible, porque tratar con clindamicina en ese caso probablemente fallaría durante el tratamiento.',
  },
];
export function genStaphylo7Round(){
  const item = pick(STAPHYLO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Streptococcus y Enterococcus ----------------
   Basado en Tema 14 (Familia Streptococcaceae y Enterococcaceae) y su
   documento de apoyo. */
const STREPTO_BANK = [
  {
    pregunta:'¿Qué tipo de hemólisis presenta Streptococcus pyogenes (grupo A de Lancefield) en Agar Sangre?',
    correcta:'Hemólisis beta (total)',
    opts:['Hemólisis alfa (parcial)','Hemólisis gamma (ausente)','No crece en absoluto en agar sangre'],
    recurso:'Streptococcus pyogenes es el prototipo clásico de bacteria beta-hemolítica: produce hemolisinas (Estreptolisina O y S) tan potentes que destruyen por completo los glóbulos rojos a su alrededor en el Agar Sangre, dejando un halo claro y transparente, sin ningún resto de color. Esto lo distingue claramente de Streptococcus pneumoniae y del grupo viridans (ambos alfa-hemolíticos, con un halo verdoso por lisis solo parcial) y de Enterococcus (generalmente gamma-hemolítico, sin ningún cambio visible). El patrón de hemólisis es, junto con el sistema de Lancefield (basado en antígenos de superficie), uno de los primeros datos que un microbiólogo usa para orientar la identificación de una cocácea Gram positiva en cadenas, antes incluso de hacer pruebas bioquímicas más específicas.',
  },
  {
    pregunta:'La prueba de CAMP positiva, usada para identificar Streptococcus agalactiae (grupo B), se basa en:',
    correcta:'La sinergia de su hemolisina con la beta-lisina de Staphylococcus aureus',
    opts:['La producción de la enzima catalasa','La fermentación de la lactosa','La resistencia al disco de bacitracina'],
    recurso:'La prueba de CAMP (nombrada por sus descubridores Christie, Atkins y Munch-Petersen) aprovecha una interacción curiosa entre dos especies distintas: se siembra una estría de Streptococcus agalactiae perpendicular a una estría de Staphylococcus aureus (que produce naturalmente una sustancia llamada beta-lisina) en la misma placa de agar sangre, sin que las estrías se toquen. Si la muestra realmente es S. agalactiae, su propia hemolisina actúa en sinergia con la beta-lisina del S. aureus, potenciando la lisis de los glóbulos rojos justo en la zona donde ambas sustancias se encuentran, formando una figura característica en forma de "punta de flecha". Esta prueba, sencilla y barata, es clave para confirmar la identificación de S. agalactiae, especialmente relevante en el tamizaje de embarazadas para prevenir la transmisión al recién nacido.',
  },
  {
    pregunta:'¿Qué proteína de Streptococcus pyogenes, de clase I, se asocia al desarrollo de fiebre reumática tras una faringitis mal tratada o no tratada?',
    correcta:'La proteína M',
    opts:['La proteína A','La coagulasa','La listeriolisina'],
    recurso:'La proteína M es el principal factor de virulencia de superficie de Streptococcus pyogenes: le da capacidad antifagocítica (protegiéndolo de ser destruido por el sistema inmune) y determina en gran parte la patogenicidad de cada cepa específica. Existen distintas variantes o "tipos" de proteína M, agrupadas en dos grandes clases estructurales; solo las cepas que portan proteínas M de clase I están asociadas al desarrollo posterior de fiebre reumática, una complicación no supurativa (es decir, no causada por invasión bacteriana directa, sino por una reacción inmune cruzada) que aparece semanas después de una faringitis estreptocócica mal tratada, afectando articulaciones, corazón, piel y en ocasiones el sistema nervioso. Debido a la enorme variación antigénica de esta proteína entre cepas, no ha sido posible desarrollar una vacuna efectiva contra S. pyogenes basada en ella.',
  },
  {
    pregunta:'Streptococcus pneumoniae se diferencia del grupo viridans (ambos alfa-hemolíticos) principalmente por ser:',
    correcta:'Sensible a la optoquina',
    opts:['Resistente a la optoquina','Catalasa positivo','Gram negativo'],
    recurso:'Tanto Streptococcus pneumoniae como el grupo viridans (un conjunto numeroso de especies de baja virulencia que forman parte de la microbiota oral normal) producen hemólisis alfa en Agar Sangre, lo que a simple vista los hace parecer iguales. La prueba que los separa de forma confiable es la sensibilidad a la optoquina: al colocar un disco cargado con este compuesto sobre el cultivo, Streptococcus pneumoniae muestra un halo de inhibición amplio (sensible), mientras que las especies del grupo viridans son resistentes a la optoquina y siguen creciendo normalmente cerca del disco. Esta distinción es clínicamente crucial porque S. pneumoniae es un patógeno mucho más agresivo (causa frecuente de neumonía, otitis, sinusitis y meningitis), mientras que el grupo viridans rara vez causa enfermedad grave fuera de casos particulares como la endocarditis bacteriana.',
  },
  {
    pregunta:'¿Cuántos serotipos capsulares cubre la vacuna neumocócica conjugada usada habitualmente en niños menores de 2 años?',
    correcta:'13 serotipos',
    opts:['23 serotipos','90 serotipos','Solo 1 serotipo'],
    recurso:'Streptococcus pneumoniae tiene alrededor de 90 serotipos capsulares distintos conocidos, pero no todos tienen la misma importancia clínica ni circulan con la misma frecuencia. Existen dos tipos de vacuna: la polisacárida (PPV23), que cubre 23 serotipos pero no genera buena respuesta inmune en menores de 2 años (su sistema inmune todavía no responde bien a antígenos puramente polisacáridos), y la conjugada (que une el polisacárido a una proteína transportadora inmunogénica), que en su versión más usada cubre 13 serotipos seleccionados específicamente por representar la mayoría de las infecciones invasivas graves. Esta vacuna conjugada sí genera una respuesta inmune eficaz incluso en lactantes, alcanzando una protección estimada de alrededor del 90% en menores de 2 años, razón por la cual es la que se usa en el calendario de vacunación infantil.',
  },
  {
    pregunta:'Enterococcus se diferencia de Streptococcus del grupo D principalmente porque Enterococcus SÍ es capaz de crecer en:',
    correcta:'Agar con 6,5% de cloruro de sodio (NaCl)',
    opts:['Agar sangre únicamente, sin ninguna otra condición especial','Cualquier medio, sin ninguna diferencia real entre ambos géneros','Solamente a temperaturas de 4°C'],
    recurso:'Tanto Enterococcus como Streptococcus del grupo D de Lancefield (como Streptococcus bovis/gallolyticus) comparten la capacidad de crecer en presencia de bilis e hidrolizar la esculina (prueba de bilis-esculina positiva para ambos), lo que puede generar confusión inicial en el laboratorio. La prueba que finalmente los separa es la tolerancia a una alta concentración de sal: Enterococcus tolera y crece con normalidad en un medio con 6,5% de cloruro de sodio, una concentración que resulta inhibitoria para Streptococcus del grupo D. Esta diferencia bioquímica, combinada con la prueba de PYR (positiva en Enterococcus, negativa en el grupo bovis), permite distinguir con confianza a estos dos géneros, cuya importancia clínica y perfil de resistencia a antibióticos son bastante distintos.',
  },
  {
    pregunta:'El fenotipo de resistencia a glicopéptidos VanC en Enterococcus (presente en E. casseliflavus y E. gallinarum) se caracteriza por ser:',
    correcta:'Resistencia intrínseca de bajo nivel, no transferible a otras bacterias',
    opts:['Resistencia adquirida de alto nivel, transferible por plásmidos','Sensibilidad total y permanente a vancomicina y teicoplanina','Resistencia exclusivamente a antibióticos betalactámicos'],
    recurso:'A diferencia del fenotipo VanA (el más grave, de alto nivel y transferible por plásmidos entre distintas especies de Enterococcus, ver el módulo de Mecanismos de Resistencia), el fenotipo VanC es una característica intrínseca propia de dos especies concretas y poco frecuentes en la clínica: Enterococcus casseliflavus y Enterococcus gallinarum. En estas especies, la resistencia a vancomicina es de bajo nivel, está codificada en el cromosoma (no en un plásmido móvil) y por lo tanto no puede transferirse a otras bacterias, además de que mantienen sensibilidad conservada a la teicoplanina (el otro glicopéptido disponible). Esta distinción es clínicamente importante porque un VanC no representa el mismo riesgo epidemiológico de diseminación descontrolada que sí representa un VanA verdadero.',
  },
  {
    pregunta:'¿Qué prueba se usa para diferenciar Streptococcus pyogenes (grupo A, sensible) de otros estreptococos beta-hemolíticos, usando un disco de baja concentración de antibiótico?',
    correcta:'La bacitracina',
    opts:['La optoquina','La novobiocina','La ureasa'],
    recurso:'La prueba de sensibilidad a la bacitracina usa un disco con una concentración muy baja del antibiótico (0,04 unidades), justo la dosis suficiente para que Streptococcus pyogenes (grupo A) —que es característicamente sensible a esta baja concentración— muestre un halo de inhibición, mientras que la mayoría de los demás estreptococos beta-hemolíticos (incluido el grupo B, Streptococcus agalactiae) son resistentes y siguen creciendo normalmente cerca del disco. Aunque esta prueba tiene un margen conocido de error (hasta un 5% de falsos negativos y un 10-20% de falsos positivos, especialmente con los grupos C y G, que a veces también son sensibles), sigue siendo una herramienta rápida y económica de tamizaje inicial, generalmente complementada con la prueba de CAMP para confirmar específicamente al grupo B.',
  },
  {
    pregunta:'Streptococcus agalactiae es especialmente relevante durante el embarazo porque puede transmitirse al recién nacido durante el parto, causando principalmente:',
    correcta:'Sepsis, neumonía o meningitis neonatal',
    opts:['Ninguna enfermedad conocida en el recién nacido','Solo alergias cutáneas leves en el bebé','Únicamente caries dental en la madre'],
    recurso:'Streptococcus agalactiae (grupo B de Lancefield) coloniza de forma asintomática el tracto gastrointestinal y, en muchas mujeres, también la región vaginal, sin causar ningún síntoma en la persona adulta portadora. El riesgo real aparece durante el parto: si la bacteria está presente en el canal vaginal, el recién nacido puede entrar en contacto con ella al nacer y desarrollar una infección grave —sepsis neonatal, neumonía o meningitis— precisamente porque su sistema inmune es todavía inmaduro para controlarla. Por este motivo, los protocolos obstétricos recomiendan realizar un tamizaje de S. agalactiae (mediante un hisopado vaginal/rectal) alrededor de la semana 36 de embarazo en todas las gestantes, para administrar profilaxis antibiótica durante el trabajo de parto si el resultado es positivo y así reducir drásticamente el riesgo de infección neonatal.',
  },
  {
    pregunta:'La bacteriemia grave por Enterococcus (como en una endocarditis) se trata frecuentemente combinando ampicilina o vancomicina con un aminoglucósido porque:',
    correcta:'Juntos producen un efecto sinérgico bactericida frente a Enterococcus',
    opts:['Los aminoglucósidos solos ya son suficientes para tratar a Enterococcus','La combinación de ambos siempre resulta antagónica entre sí','Enterococcus es intrínsecamente sensible a cualquier antibiótico usado solo'],
    recurso:'Enterococcus es naturalmente poco sensible a los aminoglucósidos usados solos, porque su pared celular gruesa dificulta que estos antibióticos penetren en cantidad suficiente hasta el ribosoma (su verdadero sitio de acción). Sin embargo, cuando se combina un aminoglucósido con un antibiótico que actúa sobre la pared celular —como ampicilina o vancomicina—, ese segundo fármaco daña la pared lo suficiente como para que el aminoglucósido pueda entrar mucho más fácilmente, alcanzando concentraciones intracelulares que sí resultan letales. A este fenómeno se le llama sinergia bactericida, y es la base del tratamiento estándar de infecciones enterocócicas graves como la endocarditis, donde ninguno de los dos fármacos por separado sería suficiente, pero juntos logran erradicar a la bacteria de forma mucho más eficaz —siempre que se confirme primero que la cepa no tiene resistencia de alto nivel a ese aminoglucósido en particular, lo que anularía la sinergia.',
  },
];
export function genStrepto7Round(){
  const item = pick(STREPTO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Bacilos Gram Positivos ----------------
   Basado en Tema 13 (Listeria, Corynebacterium, Erysipelothrix, Bacillus,
   Nocardia). */
const BACILOS_BANK = [
  {
    pregunta:'Listeria monocytogenes es especialmente peligrosa para embarazadas, neonatos, adultos mayores e inmunodeprimidos porque puede causar:',
    correcta:'Sepsis, meningoencefalitis y aborto o sepsis perinatal',
    opts:['Únicamente un resfrío común y leve','Únicamente caries dental','Ninguna enfermedad grave documentada'],
    recurso:'Listeria monocytogenes es una bacteria intracelular facultativa capaz de atravesar tres barreras fisiológicas del cuerpo humano que la mayoría de las bacterias no logran cruzar: la barrera intestinal, la barrera hematoencefálica y la barrera placentaria. Justamente por esta capacidad, sus grupos de mayor riesgo son personas cuyas defensas frente a esas barreras están comprometidas: neonatos (sistema inmune inmaduro, riesgo de sepsis neonatal), embarazadas (la bacteria puede cruzar la placenta y afectar al feto, causando aborto o sepsis perinatal), adultos mayores e inmunodeprimidos (barrera hematoencefálica más vulnerable, riesgo de meningoencefalitis). En personas sanas sin ninguno de estos factores de riesgo, la infección suele limitarse a una gastroenteritis febril leve y autolimitada.',
  },
  {
    pregunta:'Listeria monocytogenes se transmite al ser humano principalmente a través de:',
    correcta:'Alimentos refrigerados y lácteos no pasteurizados (es una zoonosis)',
    opts:['Únicamente por vía respiratoria de persona a persona','Únicamente por la picadura de un mosquito','Nunca se transmite por alimentos'],
    recurso:'Listeria monocytogenes tiene una característica poco común entre las bacterias patógenas: puede crecer y multiplicarse incluso a temperaturas de refrigerador (entre 4°C y 50°C), lo que la vuelve especialmente peligrosa en alimentos que se guardan fríos pensando que eso los protege de contaminación bacteriana. Es una zoonosis (afecta también al ganado, causando mastitis en vacas y contaminando su leche), y las principales fuentes de contagio humano son productos lácteos no pasteurizados, quesos blandos, carnes frías listas para consumir, embutidos crudos y verduras mal lavadas. Por eso los grupos de riesgo (embarazadas, adultos mayores, inmunodeprimidos) reciben recomendaciones específicas de evitar estos alimentos, incluso si están correctamente refrigerados, ya que la refrigeración no es garantía de que Listeria no esté presente o creciendo.',
  },
  {
    pregunta:'¿Qué toxina de Listeria monocytogenes le permite escapar del fagosoma dentro de la célula que invade, para poder multiplicarse libremente en el citoplasma?',
    correcta:'La listeriolisina O (LLO)',
    opts:['La toxina diftérica','La coagulasa','La leucocidina de Panton-Valentine'],
    recurso:'Cuando una célula del hospedero (como un macrófago) fagocita a Listeria monocytogenes, normalmente la encierra en una vacuola llamada fagosoma con la intención de destruirla ahí dentro. La listeriolisina O es una toxina formadora de poros, similar en su función a la Estreptolisina O de Streptococcus pyogenes, que Listeria libera dentro de esa vacuola para romper su membrana y escapar hacia el citoplasma de la célula, un ambiente mucho más seguro para la bacteria. Una vez libre en el citoplasma, Listeria usa otra proteína propia (ActA) para impulsarse mediante polimerización de actina y moverse hacia células vecinas, propagándose de célula a célula sin necesidad de salir jamás al espacio extracelular, donde estaría expuesta a anticuerpos y al complemento del sistema inmune.',
  },
  {
    pregunta:'Corynebacterium diphtheriae causa la difteria mediante una exotoxina A-B que inhibe la síntesis de proteínas al inactivar:',
    correcta:'El factor de elongación 2 (EF-2) del ribosoma',
    opts:['La ADN polimerasa bacteriana','La pared celular de la célula infectada','El complemento sérico del hospedero'],
    recurso:'La toxina diftérica está codificada por un gen (tox) que en realidad proviene de un bacteriófago que infectó a la bacteria —es decir, Corynebacterium diphtheriae solo produce esta toxina si está infectada por ese virus específico (las cepas no toxigénicas, sin el fago, no la producen). La toxina tiene una estructura A-B: la subunidad B se une a la membrana de la célula humana y facilita que la toxina entre por endocitosis; una vez dentro, la subunidad A cataliza una reacción química (ribosilación de ADP) que inactiva permanentemente al factor de elongación 2 (EF-2), una proteína esencial para que el ribosoma pueda seguir fabricando proteínas nuevas. Sin EF-2 funcional, la célula deja de producir proteínas y muere, lo que explica el daño extenso a nivel de garganta, corazón, nervios y riñones en la difteria.',
  },
  {
    pregunta:'La formación de una pseudomembrana en la garganta, que puede dificultar seriamente la respiración y la deglución, es característica de:',
    correcta:'La difteria respiratoria (causada por Corynebacterium diphtheriae)',
    opts:['La listeriosis','El ántrax cutáneo','La erisipela por Streptococcus pyogenes'],
    recurso:'La pseudomembrana característica de la difteria respiratoria se forma como consecuencia directa del daño tisular masivo causado por la toxina diftérica sobre las células de la mucosa faríngea: la inflamación local, junto con la fibrina y las células inmunes (polimorfonucleares) que se acumulan intentando responder al daño, forman una capa de tejido muerto firmemente adherida sobre la garganta y las amígdalas. Esta pseudomembrana no es un simple recubrimiento superficial: puede extenderse y obstruir físicamente las vías respiratorias, dificultando tanto la respiración como la deglución, siendo una de las complicaciones más temidas de la enfermedad, junto con el daño sistémico de la toxina sobre el corazón (miocarditis) y los nervios (desmielinización). Por esta gravedad, la difteria requiere notificación obligatoria e inmediata a la autoridad sanitaria.',
  },
  {
    pregunta:'Bacillus anthracis, el agente causal del ántrax, produce una toxina tripartita compuesta por tres componentes. ¿Cuáles?',
    correcta:'Antígeno protector (PA), factor edematizante (EF) y factor letal (LF)',
    opts:['Únicamente listeriolisina','Únicamente coagulasa y catalasa','Únicamente penicilinasa'],
    recurso:'La toxina de Bacillus anthracis funciona de forma modular, con tres proteínas que se combinan de distintas maneras para producir sus efectos: el Antígeno Protector (PA) es el componente que se une a la célula del hospedero y actúa como "puerta de entrada" para los otros dos factores; el Factor Edematizante (EF) es una enzima que, una vez dentro de la célula, aumenta el AMP cíclico de forma descontrolada, causando edema (acumulación de líquido) en el tejido; y el Factor Letal (LF) destruye proteínas clave de señalización celular, contribuyendo a la necrosis tisular y al shock sistémico en los casos graves. Combinados (PA+EF y PA+LF), estos tres componentes explican las tres formas clínicas del ántrax: cutánea, inhalatoria y gastrointestinal, cada una con un mecanismo de entrada distinto pero la misma maquinaria tóxica de fondo.',
  },
  {
    pregunta:'Bacillus cereus causa dos síndromes gastrointestinales distintos: uno emético (por una toxina termoestable) y otro:',
    correcta:'Diarreico (por enterotoxinas producidas dentro del intestino)',
    opts:['Respiratorio exclusivamente','Neurológico exclusivamente, sin síntomas digestivos','Renal exclusivamente, sin ningún síntoma digestivo'],
    recurso:'Bacillus cereus produce dos tipos de intoxicación alimentaria con mecanismos y presentación clínica bien diferenciados. El síndrome emético está causado por la cereulida, una toxina ya formada en el alimento antes de ser consumido y que es termoestable (no se destruye al cocinar), provocando vómitos de inicio muy rápido (en pocas horas) al ingerirla, sin necesidad de que la bacteria siga multiplicándose en el cuerpo. El síndrome diarreico, en cambio, ocurre porque las esporas ingeridas germinan dentro del intestino y ahí la bacteria produce enterotoxinas directamente en el tubo digestivo, con un inicio de síntomas más lento que el cuadro emético. Además de estos dos cuadros alimentarios, Bacillus cereus también puede causar infecciones oportunistas graves (endocarditis, meningitis, infecciones oculares) en pacientes hospitalizados o usuarios de drogas inyectables.',
  },
  {
    pregunta:'Erysipelothrix rhusiopathiae causa en el ser humano una enfermedad ocupacional llamada:',
    correcta:'Erisipeloide',
    opts:['Erisipela (esa enfermedad es causada por Streptococcus pyogenes)','Difteria','Listeriosis'],
    recurso:'Erysipelothrix rhusiopathiae es una bacteria zoonótica que afecta principalmente a cerdos y pavos (causando en ellos un cuadro llamado erisipela porcina, con lesiones inflamatorias de la piel), y se transmite al ser humano por contacto directo con animales infectados o con productos de origen animal contaminados —por eso se considera una enfermedad ocupacional, típica de personas que trabajan en mataderos, en la industria pesquera o en la manipulación de carne cruda. En el ser humano, la infección produce un cuadro llamado erisipeloide, con lesiones inflamatorias localizadas en la piel (típicamente en manos, por el contacto laboral), muy distinto de la erisipela verdadera (una infección de la cara producida por Streptococcus pyogenes, un microorganismo completamente diferente) — el documento fuente incluso aclara explícitamente que ambos cuadros no deben confundirse pese a compartir un nombre parecido.',
  },
  {
    pregunta:'Nocardia spp. se caracteriza en el laboratorio de microbiología por ser:',
    correcta:'Levemente ácido-alcohol resistente, requiriendo la tinción de Kinyoun para observarla',
    opts:['Completamente Gram negativa, sin ninguna particularidad de tinción','Anaerobia estricta, incapaz de crecer con oxígeno','Formadora de esporas, igual que Bacillus'],
    recurso:'Nocardia comparte con Mycobacterium y Corynebacterium (juntos forman el llamado "grupo CMN") una pared celular rica en ácidos micólicos, lo que le da una propiedad de tinción particular: no se tiñe bien con la técnica de Gram tradicional (aparece como Gram positiva irregular o débil), y es levemente ácido-alcohol resistente —una versión más suave de la resistencia ácido-alcohol clásica de Mycobacterium tuberculosis—, por lo que requiere una tinción especial llamada Kinyoun para visualizarla correctamente al microscopio. Es un microorganismo aerobio estricto, no esporulado, de crecimiento lento (puede tardar de 2 días a varias semanas) y de hábitat ambiental (descomposición de materia vegetal, nunca parte de la microbiota humana normal), causando típicamente nocardiosis pulmonar (por inhalación) o cutánea, frecuentemente en pacientes inmunocomprometidos.',
  },
];
export function genBacilos7Round(){
  const item = pick(BACILOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Enterobacterales ----------------
   Basado en Tema 15 (Escherichia, Shigella, Salmonella, Yersinia) y Tema 16
   (generalidades, KES, PPM, Citrobacter). */
const ENTERO_BANK = [
  {
    pregunta:'En Agar MacConkey, las bacterias que fermentan lactosa (como Escherichia coli) producen colonias de color:',
    correcta:'Rosado o fucsia',
    opts:['Verde','Negro','Completamente transparente'],
    recurso:'El Agar MacConkey contiene lactosa como el único hidrato de carbono fermentable y un indicador de pH (rojo neutro). Cuando una bacteria como Escherichia coli fermenta esa lactosa, produce ácidos como subproducto, lo que baja el pH del medio a su alrededor; ese cambio de pH hace que el indicador rojo neutro vire de su color original a un tono rosado o fucsia intenso, dando colonias de ese color característico. Las bacterias que no fermentan lactosa (como Salmonella o Shigella) no producen ese cambio de pH local, así que sus colonias quedan incoloras o de un tono beige translúcido. Esta simple diferencia de color, visible a simple vista sin necesidad de ninguna prueba adicional, es de las primeras pistas que orienta la identificación presuntiva de una enterobacteria a partir de un cultivo de deposiciones o de orina.',
  },
  {
    pregunta:'¿Qué categoría de Escherichia coli diarreogénica es conocida como "la diarrea del viajero" por producir toxinas termolábil y termoestable?',
    correcta:'ECET (enterotoxigénica, ETEC)',
    opts:['ECEH (enterohemorrágica, EHEC)','ECEI (enteroinvasiva, EIEC)','ECEA (enteroagregativa, EAEC)'],
    recurso:'Existen seis categorías distintas de E. coli capaces de causar diarrea, diferenciadas por sus mecanismos de virulencia específicos, no solo por su serotipo. La categoría ECET (E. coli enterotoxigénica) produce dos toxinas propias —una termolábil (que se destruye con el calor) y otra termoestable (que resiste el calor)— que actúan sobre las células intestinales aumentando la secreción de agua y electrolitos, provocando una diarrea acuosa sin sangre. Es la causa bacteriana más frecuente de la llamada "diarrea del viajero", un cuadro típico en personas que visitan países con menor saneamiento del agua y los alimentos, adquirido por consumo de agua o comida contaminada. Se distingue clínicamente de la ECEH (que sí puede causar diarrea con sangre y Síndrome Hemolítico Urémico) por no producir toxina Shiga.',
  },
  {
    pregunta:'¿Qué categoría de Escherichia coli diarreogénica (con el serogrupo O157:H7 como el más conocido) puede causar el Síndrome Hemolítico Urémico (SHU)?',
    correcta:'ECEH (enterohemorrágica, EHEC), por sus toxinas Shiga',
    opts:['ECET (enterotoxigénica, ETEC)','ECAD (difusamente adherente, DAEC)','Ninguna categoría de E. coli causa SHU'],
    recurso:'La E. coli enterohemorrágica (ECEH o EHEC) se distingue del resto de las categorías diarreogénicas por producir las llamadas toxinas Shiga (Stx1 y Stx2, codificadas en el cromosoma bacteriano), capaces de causar tanto diarrea con sangre (colitis hemorrágica) como una complicación sistémica grave: el Síndrome Hemolítico Urémico (SHU), caracterizado por anemia hemolítica, trombocitopenia y falla renal aguda, especialmente en niños pequeños. Es una zoonosis, transmitida principalmente por consumo de carne de vacuno o porcino mal cocida, siendo el serogrupo O157:H7 el prototipo más estudiado (aunque en Latinoamérica predominan serogrupos "no-O157" con igual capacidad de causar SHU). Una pista bioquímica útil: la mayoría de las cepas O157 no fermentan sorbitol, a diferencia de la mayoría de las demás E. coli, lo que se usa como criterio de tamizaje inicial en medios de cultivo especiales.',
  },
  {
    pregunta:'Salmonella Typhi, a diferencia de las especies de Salmonella no-tifoideas, tiene como reservorio natural exclusivo:',
    correcta:'Al ser humano',
    opts:['A las aves de corral','A los reptiles domésticos','A los roedores'],
    recurso:'Una de las diferencias epidemiológicas más importantes dentro del género Salmonella es que la mayoría de los serotipos no-tifoideos (como Salmonella Enteritidis o Typhimurium) tienen un amplio rango de hospederos —mamíferos, aves, reptiles— y llegan al ser humano principalmente a través de la cadena alimentaria (huevos, carne de ave, lácteos), causando típicamente una gastroenteritis autolimitada. Salmonella Typhi, en cambio, es altamente específica de especie: su único reservorio natural conocido es el ser humano, sin ningún reservorio animal significativo. Esto significa que su transmisión depende enteramente de la contaminación fecal-oral entre personas (agua o alimentos contaminados por un enfermo o portador crónico humano), y explica por qué el saneamiento ambiental y el acceso a agua potable son las medidas de control más efectivas contra la fiebre tifoidea, a diferencia de las salmonelosis no-tifoideas, donde el control de alimentos de origen animal es la estrategia clave.',
  },
  {
    pregunta:'¿Cuál es el examen de laboratorio de elección para diagnosticar la fiebre tifoidea causada por Salmonella Typhi?',
    correcta:'El hemocultivo',
    opts:['El coprocultivo, únicamente','La biopsia hepática, de rutina','El urocultivo, únicamente'],
    recurso:'A diferencia de una salmonelosis no-tifoidea común (donde la bacteria se queda limitada principalmente al intestino y el coprocultivo es el examen más útil), Salmonella Typhi tiene la capacidad de atravesar el epitelio intestinal y diseminarse por el torrente sanguíneo hacia órganos como el hígado, el bazo y la médula ósea, generando bacteriemias sostenidas o intermitentes durante todo el curso de la enfermedad. Por esta razón, el hemocultivo —que detecta directamente la presencia de la bacteria circulando en la sangre— es el examen de elección para confirmar el diagnóstico de fiebre tifoidea, con mejor rendimiento diagnóstico que el coprocultivo, especialmente durante la primera semana de síntomas. El coprocultivo puede seguir siendo útil más adelante en la enfermedad o para detectar portadores crónicos que eliminan la bacteria en las heces sin tener síntomas activos.',
  },
  {
    pregunta:'Shigella dysenteriae tipo 1, la especie más virulenta del género, produce una citotoxina conocida como:',
    correcta:'Toxina Shiga',
    opts:['Toxina diftérica','Toxina colérica','Toxina tetánica'],
    recurso:'Shigella dysenteriae tipo 1 es, dentro del género Shigella, la especie asociada a los cuadros clínicos más graves de disentería bacilar (diarrea con sangre y moco, acompañada de fiebre y dolor abdominal intenso, con tenesmo). Su principal factor de virulencia distintivo es la producción de la toxina Shiga, una citotoxina potente que daña directamente el epitelio intestinal, contribuyendo a la severidad del cuadro disentérico. Curiosamente, esta misma toxina —o una muy similar codificada en un mecanismo genético distinto— es también la responsable del Síndrome Hemolítico Urémico en la E. coli enterohemorrágica (ECEH), mostrando cómo un mismo factor de virulencia puede aparecer en géneros bacterianos diferentes. Shigella tiene además una dosis infectante extremadamente baja (apenas 10 a 100 microorganismos bastan para causar enfermedad), lo que facilita mucho su transmisión de persona a persona.',
  },
  {
    pregunta:'Yersinia pestis, agente de la peste bubónica, se transmite al ser humano principalmente a través de:',
    correcta:'La picadura de pulgas de roedores infectados',
    opts:['El agua contaminada, únicamente','El aire acondicionado','El consumo de mariscos crudos'],
    recurso:'Yersinia pestis circula naturalmente entre poblaciones de roedores, y su vía de transmisión clásica al ser humano es indirecta: una pulga pica a un roedor infectado, adquiere la bacteria, y posteriormente pica a una persona, transmitiéndole la infección en ese momento. Según la vía de diseminación dentro del cuerpo humano, la enfermedad puede presentarse en tres formas de gravedad creciente: la peste bubónica (la más común, con inflamación dolorosa de ganglios linfáticos o "bubones"), la peste neumónica (cuando la bacteria alcanza los pulmones, transmisible entonces de persona a persona por gotitas respiratorias) y la peste septicémica (diseminación por todo el organismo a través de la sangre, con la mayor tasa de mortalidad de las tres formas). El control de roedores y de sus pulgas sigue siendo la medida de prevención más eficaz contra esta zoonosis.',
  },
  {
    pregunta:'¿Qué enzima producen Proteus, Providencia y Morganella que alcaliniza la orina y favorece la formación de cálculos de estruvita?',
    correcta:'La ureasa',
    opts:['La coagulasa','La catalasa','La hemolisina'],
    recurso:'La ureasa es una enzima que degrada la urea (un compuesto abundante en la orina) liberando amoníaco como subproducto, lo que eleva significativamente el pH de la orina, volviéndola alcalina en vez de su acidez habitual. Este cambio de pH favorece la precipitación de ciertas sales minerales (fosfato de magnesio y amonio), formando cálculos renales conocidos como cálculos de estruvita, particularmente asociados a infecciones urinarias crónicas o recurrentes por Proteus, Providencia o Morganella —los tres géneros del grupo llamado "PPM", todos productores importantes de ureasa. Este mismo cambio de pH alcalino en la orina tiene además una consecuencia terapéutica práctica: inactiva parcialmente a la nitrofurantoína, un antibiótico que depende de un ambiente ácido para funcionar bien, por lo que suele evitarse en infecciones urinarias causadas por estos tres géneros.',
  },
  {
    pregunta:'Klebsiella pneumoniae se caracteriza por poseer una cápsula de polisacáridos que le da un aspecto de colonia:',
    correcta:'Mucoide, lo que aumenta su virulencia',
    opts:['Completamente seco y quebradizo','Transparente y de aspecto líquido','Idéntico en todo al de Escherichia coli'],
    recurso:'Klebsiella pneumoniae posee una cápsula de polisacáridos particularmente gruesa y abundante (con 77 antígenos capsulares K distintos descritos), lo que le da a sus colonias un aspecto viscoso y mucoide característico al crecer en cultivo. Esta cápsula no es solo un rasgo estético: cumple un papel protector fundamental frente al sistema inmune del hospedero, dificultando la fagocitosis y la acción del complemento, lo que aumenta significativamente la virulencia de la bacteria. Junto con la producción de sideróforos (moléculas que capturan hierro del ambiente, esencial para su supervivencia) y su reconocida capacidad de adquirir betalactamasas de espectro extendido (BLEE) y carbapenemasas, Klebsiella pneumoniae es uno de los bacilos Gram negativos más importantes en infecciones asociadas a la atención de salud, junto con Pseudomonas aeruginosa.',
  },
  {
    pregunta:'Serratia marcescens produce un pigmento rojo llamado prodigiosina, que en Agar MacConkey NO debe confundirse con:',
    correcta:'Fermentación de lactosa (Serratia marcescens es lactosa-negativa)',
    opts:['Producción de ácido sulfhídrico (H2S)','Producción de la enzima ureasa','Motilidad bacteriana activa'],
    recurso:'Serratia marcescens puede producir un pigmento rojo intenso llamado prodigiosina en algunas condiciones de cultivo, y este color visualmente llamativo puede llevar a un error de interpretación si no se conoce bien la bioquímica de la bacteria: en el Agar MacConkey, el color rosado/fucsia normalmente indica fermentación de lactosa (como se explicó en otra pregunta de este módulo), pero Serratia marcescens es en realidad lactosa-negativa —su color rojo se debe únicamente al pigmento propio de la bacteria, no a un cambio de pH del indicador por fermentación de azúcar. Reconocer esta distinción evita clasificar erróneamente a Serratia como fermentadora de lactosa solo por el parecido visual del color, un error que llevaría a una identificación bioquímica incorrecta en los pasos siguientes del algoritmo diagnóstico.',
  },
];
export function genEntero7Round(){
  const item = pick(ENTERO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Bacilos Gram Negativos No Fermentadores ----------------
   Basado en Tema 18 (Pseudomonas, Stenotrophomonas, incluye el caso clínico 1
   del propio material) y Tema 19 (Acinetobacter, Burkholderia, Legionella). */
const BGNNF_BANK = [
  {
    pregunta:'Pseudomonas aeruginosa produce un pigmento azul-verdoso característico llamado:',
    correcta:'Piocianina',
    opts:['Prodigiosina (ese es el pigmento rojo de Serratia)','Melanina','Pioverdina (esa es amarillo-verdosa fluorescente)'],
    recurso:'Pseudomonas aeruginosa es capaz de producir varios pigmentos distintos, pero el más característico y reconocible es la piocianina, de color azul-verdoso, que junto con el olor particular de sus cultivos (descrito frecuentemente como similar al de las uvas) permite muchas veces sospechar esta bacteria a simple vista y por el olfato, incluso antes de completar la identificación bioquímica formal. No debe confundirse con la pioverdina (otro pigmento que produce la misma bacteria, pero de color amarillo-verdoso y fluorescente bajo luz ultravioleta) ni con la prodigiosina (el pigmento rojo típico de Serratia marcescens, una bacteria completamente distinta). Un dato bioquímico complementario: dentro del género Pseudomonas, algunas especies como P. stutzeri no producen pioverdina, a diferencia de P. aeruginosa, P. fluorescens y P. putida, que sí la producen.',
  },
  {
    pregunta:'¿Qué mecanismo es el principal responsable de la resistencia de Pseudomonas aeruginosa a los antibióticos carbapenémicos, especialmente al imipenem?',
    correcta:'La pérdida de la porina OprD',
    opts:['La producción de la enzima coagulasa','La formación de esporas','La pérdida completa del flagelo'],
    recurso:'El imipenem necesita entrar a través de una porina específica de la membrana externa de Pseudomonas aeruginosa, llamada OprD, para poder alcanzar su sitio de acción dentro de la bacteria. Cuando la bacteria muta o deja de expresar esta porina —algo que puede ocurrir incluso durante el propio tratamiento antibiótico, como un mecanismo de resistencia adaptativa—, el imipenem pierde su principal vía de entrada, mientras que otros carbapenémicos como el meropenem (que no dependen tanto de esta porina específica) pueden seguir siendo efectivos. Este mecanismo de impermeabilidad selectiva explica por qué un antibiograma de Pseudomonas aeruginosa puede mostrar resistencia aislada a imipenem con sensibilidad conservada al resto de los antibióticos, un patrón muy distinto del que produciría una carbapenemasa (que afectaría a todos los carbapenémicos por igual).',
  },
  {
    caso:'Un hemocultivo de Pseudomonas aeruginosa muestra el siguiente antibiograma: amikacina sensible, cefepime sensible, ceftazidima sensible, ciprofloxacina sensible, meropenem sensible, piperacilina-tazobactam sensible, pero imipenem resistente (CIM ≥16 µg/mL).',
    pregunta:'¿Qué mecanismo de resistencia explica mejor este patrón tan específico, con resistencia aislada solo a imipenem?',
    correcta:'Pérdida de la porina OprD (afecta selectivamente a imipenem)',
    opts:['Una carbapenemasa (que afectaría por igual a todos los carbapenémicos)','Una betalactamasa de espectro extendido (BLEE)','Resistencia generalizada por bombas de eflujo'],
    recurso:'Este es un caso real de antibiograma del material del curso, y su patrón es justamente el "sello distintivo" de la pérdida de la porina OprD: resistencia limitada exclusivamente a imipenem, con sensibilidad plenamente conservada al resto de betalactámicos —incluyendo meropenem, otro carbapenémico— y a otras familias de antibióticos. Si el mecanismo hubiera sido una carbapenemasa verdadera, se esperaría ver resistencia también a meropenem (y probablemente a otros betalactámicos también), ya que las carbapenemasas hidrolizan de forma más amplia. La pérdida de OprD, en cambio, es un mecanismo de impermeabilidad muy selectivo: solo bloquea la entrada del antibiótico que depende específicamente de esa porina para entrar, dejando intactas las demás vías de acción de los otros fármacos.',
  },
  {
    pregunta:'Stenotrophomonas maltophilia se diferencia de Pseudomonas aeruginosa en la prueba de la oxidasa por ser:',
    correcta:'Oxidasa negativa (Pseudomonas aeruginosa es oxidasa positiva)',
    opts:['Oxidasa positiva, igual que Pseudomonas aeruginosa','Catalasa negativa','Una bacteria Gram positiva'],
    recurso:'Aunque tanto Stenotrophomonas maltophilia como Pseudomonas aeruginosa son bacilos Gram negativos no fermentadores, con hábitats y comportamiento clínico similares (ambos oportunistas hospitalarios asociados a ventiladores mecánicos y catéteres), una prueba bioquímica simple y rápida las diferencia con claridad: la oxidasa. Pseudomonas aeruginosa es oxidasa positiva, mientras que Stenotrophomonas maltophilia es oxidasa negativa. Esta diferencia bioquímica es clínicamente relevante porque el perfil de resistencia intrínseca de ambas bacterias es muy distinto: Stenotrophomonas es intrínsecamente resistente a casi todos los betalactámicos, incluidos los carbapenémicos (por sus propias betalactamasas L1 y L2), mientras que Pseudomonas suele conservar sensibilidad a varios carbapenémicos y otros antibióticos antipseudomónicos específicos.',
  },
  {
    pregunta:'El tratamiento de primera línea para Stenotrophomonas maltophilia, intrínsecamente resistente a la mayoría de los betalactámicos incluidos los carbapenémicos, es:',
    correcta:'Cotrimoxazol (trimetoprim-sulfametoxazol)',
    opts:['Penicilina G','Vancomicina','Cefazolina'],
    recurso:'Stenotrophomonas maltophilia posee dos betalactamasas propias codificadas en su cromosoma (L1, una metalo-betalactamasa, y L2, una cefalosporinasa) que la vuelven intrínsecamente resistente a prácticamente todos los antibióticos betalactámicos disponibles, incluidos los carbapenémicos —un rasgo poco común entre los bacilos Gram negativos, que suelen ser al menos parcialmente sensibles a algún carbapenémico. Por esta resistencia intrínseca tan amplia, el tratamiento de elección para esta bacteria no puede ser un betalactámico de ningún tipo: el cotrimoxazol (trimetoprim-sulfametoxazol) es el antibiótico de primera línea recomendado, con minociclina, levofloxacino o cefiderocol como alternativas en caso de resistencia o alergia al cotrimoxazol.',
  },
  {
    pregunta:'Acinetobacter baumannii representa aproximadamente qué porcentaje de todas las infecciones causadas por el género Acinetobacter?',
    correcta:'El 80%',
    opts:['El 10%','El 50%','El 100%, es la única especie del género'],
    recurso:'El género Acinetobacter incluye numerosas especies distintas, muchas de ellas ambientales y de escasa relevancia clínica, pero una sola especie concentra la gran mayoría de las infecciones humanas: Acinetobacter baumannii, responsable de alrededor del 80% de todas las infecciones documentadas por este género. Es un patógeno nosocomial oportunista clásico, que tiende a producirse en pacientes críticos hospitalizados (frecuentemente en unidades de cuidados intensivos) y que adquiere con facilidad múltiples mecanismos de resistencia a antibióticos —incluyendo betalactamasas de varias clases de Ambler y carbapenemasas de tipo OXA—, convirtiéndolo en uno de los patógenos multirresistentes de mayor preocupación en el ámbito hospitalario a nivel mundial.',
  },
  {
    pregunta:'Legionella pneumophila, agente de la enfermedad del legionario, requiere para su cultivo un medio especial suplementado con:',
    correcta:'Hierro y cisteína (medio BCYE)',
    opts:['Solo agua peptonada simple','Solo sangre de cordero al 5%','Ninguna suplementación especial, crece en cualquier medio'],
    recurso:'Legionella pneumophila es un microorganismo especialmente exigente (fastidioso) desde el punto de vista nutricional: no crece en los medios de cultivo habituales usados para la mayoría de las bacterias, sino que requiere un medio específico llamado BCYE (agar de extracto de levadura tamponado con carbón), suplementado obligatoriamente con hierro y con el aminoácido cisteína, dos nutrientes que la bacteria necesita en cantidad para poder multiplicarse en el laboratorio. Además, suele agregarse polimixina B, anisomicina y cefamandol al medio para inhibir a otras bacterias y hongos contaminantes que crecerían más rápido y dificultarían el aislamiento de Legionella. Su cultivo es lento (desde 48 horas, con resultado negativo definitivo recién tras 10 días de incubación), por lo que en la práctica clínica se complementa frecuentemente con la detección de antígeno en orina, un método mucho más rápido.',
  },
  {
    pregunta:'Burkholderia pseudomallei, agente de la melioidosis, es apodada "la gran simuladora" porque:',
    correcta:'Puede presentarse con manifestaciones clínicas muy variadas, dificultando el diagnóstico',
    opts:['Nunca produce ningún síntoma en el ser humano','Solo afecta a la piel, sin ningún otro órgano','Es genéticamente idéntica a otra bacteria distinta'],
    recurso:'La melioidosis, causada por Burkholderia pseudomallei, tiene fama entre los microbiólogos y clínicos de ser "la gran simuladora" porque puede imitar prácticamente cualquier otra enfermedad infecciosa, presentándose de formas extremadamente variadas: desde una neumonía (la presentación más frecuente, en poco más de la mitad de los casos) hasta infecciones urinarias, cutáneas, articulares, óseas o incluso del sistema nervioso central, con un período de incubación que puede ir de 1 a 21 días. Esta enorme variabilidad clínica dificulta mucho sospechar el diagnóstico correcto sin un alto índice de sospecha (por ejemplo, en pacientes con antecedente de viaje o residencia en zonas endémicas del sudeste asiático o norte de Australia). Es además una infección grave: más de la mitad de los pacientes desarrollan bacteriemia, con una mortalidad reportada de hasta un 50% en los casos con shock séptico.',
  },
  {
    pregunta:'¿Qué mecanismo de resistencia a las fluoroquinolonas comparten muchos bacilos Gram negativos no fermentadores, incluyendo Pseudomonas aeruginosa?',
    correcta:'Mutaciones en los genes gyrA y parC',
    opts:['Producción de la enzima penicilinasa','Formación de esporas resistentes','Pérdida completa de la cápsula bacteriana'],
    recurso:'Las fluoroquinolonas actúan bloqueando dos enzimas esenciales para el manejo del ADN bacteriano: la ADN girasa (codificada por los genes gyrA y gyrB) y la Topoisomerasa IV (codificada por parC y parE). Cuando ocurren mutaciones puntuales específicas en estos genes —particularmente en gyrA y parC—, la estructura de estas enzimas cambia lo suficiente como para que las fluoroquinolonas ya no puedan unirse bien a ellas, mientras que las enzimas siguen cumpliendo su función normal para la bacteria. Este mecanismo de resistencia por modificación del sitio blanco es compartido ampliamente entre distintos bacilos Gram negativos no fermentadores (como Pseudomonas aeruginosa y Acinetobacter baumannii), y suele acumularse de forma progresiva: mientras más mutaciones se acumulan en estos genes, más alto es el nivel de resistencia que alcanza la bacteria frente a esta familia de antibióticos.',
  },
];
export function genBgnnf7Round(){
  const item = pick(BGNNF_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: (item.caso ? '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>' : '<p class="prompt-sentence">'+item.pregunta+'</p>'),
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

/* ---------------- Vibrionaceae, Campylobacter y Helicobacter ----------------
   Basado en Tema 20 (Vibrionaceae, Aeromonadaceae, Campylobacteraceae y
   Helicobacteraceae). */
const VIBRIO_BANK = [
  {
    pregunta:'Vibrio cholerae produce una diarrea masiva, descrita como "agua de arroz", mediante una toxina (colerágeno) que aumenta:',
    correcta:'El AMP cíclico intracelular, causando hipersecreción de agua y electrolitos',
    opts:['La producción de esporas resistentes','La temperatura corporal directamente','La coagulación de la sangre'],
    recurso:'La toxina del cólera (colerágeno) actúa sobre las células del intestino delgado estimulando de forma descontrolada la enzima adenilciclasa, lo que eleva enormemente los niveles de AMP cíclico dentro de esas células. Este mensajero intracelular, en exceso, provoca una hipersecreción masiva de cloro y agua hacia la luz intestinal, junto con una disminución de la reabsorción de sodio, sin que exista destrucción física del epitelio intestinal (el borde en cepillo de las células permanece intacto). El resultado es una diarrea acuosa extrema —hasta un litro de líquido por hora en los casos graves—, con un aspecto característico descrito como "agua de arroz" (incolora e inodora), que puede llevar a deshidratación severa, shock y muerte si no se repone rápidamente el líquido y los electrolitos perdidos.',
  },
  {
    pregunta:'En el Agar TCBS, Vibrio cholerae (que fermenta la sacarosa) produce colonias de color:',
    correcta:'Amarillo',
    opts:['Verde','Negro','Rosado'],
    recurso:'El Agar TCBS diferencia a las especies de Vibrio según su capacidad de fermentar la sacarosa, usando un indicador de pH (una combinación de azul de timol y azul de bromotimol). Vibrio cholerae fermenta la sacarosa presente en el medio, acidificando el entorno inmediato de la colonia, lo que hace virar el indicador hacia un color amarillo bien visible. En cambio, especies como Vibrio parahaemolyticus no fermentan la sacarosa, por lo que su colonia mantiene el medio en su estado alcalino original, dando colonias de color verde. Esta diferencia de color permite, en el mismo cultivo, orientar rápidamente hacia una sospecha de cólera (colonias amarillas) frente a otra especie de Vibrio no colérica (colonias verdes), sin necesidad de esperar pruebas bioquímicas más lentas.',
  },
  {
    pregunta:'Vibrio parahaemolyticus, causante frecuente de gastroenteritis, está siempre asociado al consumo de:',
    correcta:'Mariscos crudos',
    opts:['Agua potable clorada','Leche pasteurizada','Pan recién horneado'],
    recurso:'Vibrio parahaemolyticus es una bacteria halófila (necesita sal para crecer bien, tolerando concentraciones de 1% a 8% de NaCl), propia de aguas marinas costeras y estuarios, cuya presencia aumenta especialmente en las estaciones más cálidas del año. A diferencia de Vibrio cholerae (que se transmite principalmente por agua o alimentos contaminados con heces humanas), la gastroenteritis por V. parahaemolyticus está asociada de forma prácticamente constante al consumo de mariscos crudos o mal cocidos —moluscos, crustáceos, pescado crudo—, que son su reservorio natural. Su principal factor de virulencia es una hemolisina termoestable directa (TDH), presente en la gran mayoría de las cepas que causan enfermedad clínica, aunque una proporción mucho menor de cepas ambientales (sin esta toxina) no suele causar enfermedad.',
  },
  {
    pregunta:'Campylobacter jejuni, principal causa de campylobacteriosis, es una bacteria termotolerante que crece particularmente bien a:',
    correcta:'42°C, pero no a 35°C',
    opts:['4°C únicamente','100°C','A cualquier temperatura, sin ninguna preferencia'],
    recurso:'Una característica distintiva de las especies termotolerantes del género Campylobacter (entre ellas C. jejuni, responsable de aproximadamente el 99% de la incidencia clínica del género) es que crecen bien a 42°C —una temperatura más alta que la habitual de 35-37°C usada para cultivar la mayoría de las demás bacterias clínicas— pero no logran crecer bien a 35°C. Esta particularidad se aprovecha directamente en el laboratorio: incubar las placas de cultivo específicamente a 42°C (en vez de la temperatura estándar) ayuda a favorecer selectivamente el crecimiento de Campylobacter frente a otras bacterias entéricas que sí prefieren temperaturas más bajas, facilitando su aislamiento a partir de una muestra de deposiciones que contiene una mezcla compleja de microorganismos.',
  },
  {
    pregunta:'¿Qué complicación neurológica poco frecuente pero grave se asocia a una infección previa por Campylobacter jejuni?',
    correcta:'El Síndrome de Guillain-Barré',
    opts:['La enfermedad de Parkinson','La esclerosis múltiple','La migraña crónica'],
    recurso:'Entre los factores de virulencia de Campylobacter jejuni se encuentran los lipooligosacáridos (LOS) de su membrana externa, cuya estructura molecular puede parecerse mucho, por pura coincidencia estructural, a la de ciertos gangliósidos presentes en los nervios periféricos humanos. En algunas personas, después de una infección intestinal por C. jejuni, el sistema inmune que generó anticuerpos contra esos lipooligosacáridos termina atacando por error a los propios nervios del paciente, por ese parecido molecular —un fenómeno llamado mimetismo molecular—, desencadenando el Síndrome de Guillain-Barré: una enfermedad autoinmune que causa debilidad muscular progresiva y puede llegar a comprometer los músculos respiratorios. Aunque esta complicación es poco frecuente en el total de infecciones por Campylobacter, es una de las causas infecciosas más reconocidas y estudiadas de este síndrome neurológico.',
  },
  {
    pregunta:'Helicobacter pylori sobrevive en el ambiente ácido del estómago principalmente gracias a la enzima:',
    correcta:'Ureasa, que neutraliza el ácido produciendo amoníaco',
    opts:['Catalasa','Coagulasa','Penicilinasa'],
    recurso:'El estómago humano es un ambiente extremadamente ácido, hostil para la inmensa mayoría de las bacterias, pero Helicobacter pylori logra colonizarlo de forma crónica gracias a una estrategia bioquímica muy eficaz: produce grandes cantidades de la enzima ureasa, que descompone la urea (presente naturalmente en el jugo gástrico) en amoníaco y dióxido de carbono. El amoníaco liberado neutraliza localmente el ácido a su alrededor, creando una especie de "burbuja" de pH más neutro justo en el entorno inmediato de la bacteria, que le permite sobrevivir y multiplicarse pese a la acidez extrema del resto del estómago. Esta misma actividad de ureasa es, además, la base del test rápido de ureasa usado en el diagnóstico clínico: si una biopsia gástrica contiene H. pylori, el indicador de pH del test cambia de color al detectar el amoníaco producido.',
  },
  {
    pregunta:'¿Qué proporción aproximada de las úlceras duodenales están asociadas a la presencia de Helicobacter pylori?',
    correcta:'Más del 90%',
    opts:['Menos del 10%','Ninguna relación conocida entre ambos','Exactamente el 50%, sin excepción'],
    recurso:'La asociación entre Helicobacter pylori y la enfermedad ulcerosa péptica es una de las relaciones causa-efecto mejor establecidas en gastroenterología moderna: más del 90% de las personas con úlcera duodenal son portadoras de esta bacteria, un porcentaje tan alto que revolucionó por completo el tratamiento de esta enfermedad —antes se pensaba que las úlceras eran causadas principalmente por estrés o alimentación, y hoy se sabe que erradicar la bacteria con antibióticos es clave para la curación definitiva y para evitar recaídas. La bacteria contribuye al daño de la mucosa gástrica y duodenal mediante varios factores de virulencia simultáneos: la citotoxina VacA (que forma poros y causa apoptosis celular), enzimas que degradan la mucosa protectora, y una respuesta inflamatoria crónica que mantenida en el tiempo también aumenta el riesgo de cáncer gástrico.',
  },
  {
    pregunta:'El tratamiento de erradicación de Helicobacter pylori combina antibióticos con:',
    correcta:'Inhibidores de la bomba de protones (para reducir la acidez gástrica)',
    opts:['Solo analgésicos comunes, sin ningún otro fármaco','Solo antihistamínicos','Ningún otro fármaco es necesario junto a los antibióticos'],
    recurso:'Tratar una infección por Helicobacter pylori solo con antibióticos suele ser insuficiente, porque el ambiente ácido del estómago puede reducir la eficacia de varios antibióticos y dificultar que alcancen concentraciones adecuadas en la mucosa gástrica donde vive la bacteria. Por eso el esquema estándar de erradicación combina dos o más antibióticos (típicamente amoxicilina, claritromicina o metronidazol) junto con un inhibidor de la bomba de protones, un fármaco que reduce drásticamente la producción de ácido en el estómago. Esta reducción de la acidez no solo alivia directamente el dolor del paciente, sino que además mejora la estabilidad y la actividad de los antibióticos en ese ambiente, aumentando la probabilidad de erradicar completamente la bacteria y no solo de suprimirla temporalmente.',
  },
  {
    pregunta:'Aeromonas hydrophila puede causar un cuadro de gastroenteritis que se parece clínicamente al causado por:',
    correcta:'Shigella (diarrea disentérica, con moco y sangre)',
    opts:['Únicamente un resfrío común, sin relación digestiva','Únicamente dermatitis, sin ningún síntoma digestivo','Únicamente caries dental'],
    recurso:'Aeromonas hydrophila, junto con otras especies del género como A. caviae y A. veronii, puede producir distintos patrones de gastroenteritis en el ser humano, y uno de ellos —la diarrea disentérica, con moco y sangre visible en las deposiciones— es clínicamente muy parecido al cuadro clásico causado por Shigella, dificultando distinguir a simple vista cuál de los dos microorganismos está detrás sin hacer un cultivo específico. Aeromonas también puede producir otros patrones distintos de diarrea (acuosa, crónica, o incluso tipo colérica con aspecto de "agua de arroz"), además de infecciones de heridas por contacto con agua contaminada y cuadros de sepsis en pacientes con enfermedades hepáticas o hematológicas de base. Esta variedad de presentaciones clínicas refuerza la importancia del cultivo microbiológico para no asumir automáticamente que toda diarrea con sangre es causada por Shigella.',
  },
];
export function genVibrio7Round(){
  const item = pick(VIBRIO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: item.recurso,
  };
}

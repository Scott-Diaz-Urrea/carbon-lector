import { mascotSVG, starSVG } from './svg.js';
import { state, awardXP, goBack } from './state.js';
import { MC_KEYS, initMCGame } from './mcEngine.js';
import { initSilabasGame } from './games/silabas.js';
import { initSecuenciaGame } from './games/secuencia.js';
import { mGame } from './games/memorama.js';
import { initEscribeNombreGame } from './games/escribenombre.js';
import { initCaligrafiaGame } from './games/caligrafia.js';
import { renderTraceCanvas, initTraceCanvas } from './games/traza.js';
import { render } from './render.js';
import { saveProgress } from './persistence.js';

export const MODULE_TITLES = {
  vocales:'Explorador de Vocales',
  silabas:'Maestro de Sílabas',
  memorama:'Memoria de Acero',
  palabras:'Coleccionista de Palabras',
  comprension:'Detective de Historias',
  contar:'Contador Estrella',
  sumar:'As de las Sumas',
  comparar:'Ojo de Águila',
  formas:'Geómetra Junior',
  combinaciones:'Mago de las Combinaciones',
  secuencia:'Narrador Ordenado',
  salta:'Saltarín Numérico',
  multiplicar:'Multiplicador Veloz',
  seresvivos:'Guardián de la Naturaleza',
  plantas:'Botánico Curioso',
  micuerpo:'Explorador de mi Cuerpo',
  materiales:'Científico de Materiales',
  dianoche:'Astrónomo Junior',
  calendario:'Maestro del Calendario',
  miidentidad:'Historiador Familiar',
  simbolos:'Embajador Chileno',
  mapas:'Explorador Geográfico',
  comunidad:'Ciudadano Ejemplar',
  colores:'Mezclador de Colores',
  lineastexturas:'Artista de Texturas',
  materialesarte:'Maestro de Materiales',
  sonidos:'Oído de Oro',
  instrumentos:'Percusionista Junior',
  movimiento:'Atleta en Movimiento',
  vidaactiva:'Campeón Saludable',
  seguridad:'Capitán del Buen Juego',
  emociones:'Experto en Emociones',
  autocuidado:'Guardián de mi Cuerpo',
  convivencia:'Embajador de la Amistad',
  herramientastec:'Ingeniero Creativo',
  patrones:'Detective de Patrones',
  clasificar:'Clasificador Experto',
  posicion:'Explorador Espacial',
  cuantificadores:'Comparador Genial',
  secuenciatemporal:'Guardián del Tiempo',
  contarveinte:'Contador Veloz',
  sumarquitar:'Mago de los Números',
  formascuerpos:'Arquitecto Junior',
  medir:'Medidor Preciso',
  escribenombre:'Escritor Principiante',
  caligrafia:'Maestro de la Caligrafía',
  silabasnt:'Detective de Sonidos',
  escucharnt:'Oyente Atento',
  vocabnt:'Coleccionista de Palabras Junior',
  letrasnt:'Explorador de Letras',
  apreciarnt:'Crítico de Arte Junior',
  comparaformasnt:'Detective de Formas Junior',
  lineasdisenont:'Diseñador Junior',
  emocionesnt:'Experto en Emociones Junior',
  autocuidadont:'Guardián de mi Cuerpo Junior',
  alimentosnt:'Nutricionista Junior',
  resolucionnt:'Mediador de Paz',
  normasnt:'Ciudadano Ejemplar Junior',
  seguridadnt:'Guardián de la Seguridad',
  ubicacionespacialnt:'Explorador Espacial Junior',
  cuandoocurrent:'Guardián del Tiempo Junior',
  movimientont:'Atleta en Movimiento Junior',
  aguasolnt:'Amigo del Agua y el Sol',
  materialesnaturalnt:'Científico de Materiales Junior',
  animalesplantasnt:'Guardián de la Naturaleza Junior',
  ciclosnt:'Observador de la Vida',
  ambientent:'Protector del Planeta',
  rolescomunidadnt:'Amigo de mi Comunidad',
  objetostecnt:'Ingeniero Creativo Junior',
  institucionesnt:'Explorador de mi Barrio',
  seguridadprevnt:'Capitán de la Prevención',
  gramatica2:'Gramático Junior',
  comprension2:'Lector Detective',
  geometria2:'Geómetra Avanzado',
  medicion2:'Maestro de la Medición',
  vertebrados2:'Zoólogo Junior',
  ciclosvida2:'Biólogo de la Vida',
  habitats2:'Guardián de Hábitats',
  cuerpodentro2:'Explorador del Cuerpo',
  agua2:'Científico del Agua',
  clima2:'Meteorólogo Junior',
  pueblos2:'Historiador de Chile',
  patrimonio2:'Guardián del Patrimonio',
  paisajes2:'Explorador de Chile',
  ciudadania2:'Ciudadano Modelo',
  lineascolores2:'Artista Avanzado',
  timbrepulso2:'Oído Musical',
  cuerporesponde2:'Atleta Consciente',
  vidaactiva2:'Campeón Saludable II',
  liderazgo2:'Líder de Equipo',
  emociones2:'Experto en Emociones II',
  autocuidado2:'Guardián de mi Cuerpo II',
  habitosescolares2:'Estudiante Ejemplar',
  convivencia2:'Embajador de la Amistad II',
  tecdigital2:'Explorador Digital',
  generosliterarios3:'Crítico Literario Junior',
  comprension3:'Detective de Textos',
  vocabulario3:'Coleccionista de Palabras III',
  alfabetico3:'Maestro del Abecedario',
  gramatica3:'Gramático III',
  ortografia3:'Guardián de la Ortografía',
  numeros3:'Numerólogo Junior',
  operaciones3:'Calculista de Bolsillo',
  multiplicar3:'Campeón de las Tablas',
  dividir3:'Repartidor Justo',
  fracciones3:'Maestro de las Fracciones',
  patrones3:'Detective de Patrones',
  geometria3:'Geómetra III',
  medicion3:'Medidor Preciso III',
  datos3:'Analista de Datos Junior',
  plantas3:'Botánico de Chile',
  cicloplanta3:'Observador de la Vida Vegetal',
  cuidadoambiente3:'Guardián del Planeta III',
  alimentacion3:'Nutricionista III',
  luz3:'Científico de la Luz',
  sonido3:'Científico del Sonido',
  sistemasolar3:'Explorador Espacial',
  civilizaciones3:'Historiador de la Antigüedad',
  geografia3:'Geógrafo del Mundo',
  ciudadania3:'Ciudadano Ejemplar III',
  colorexpresivo3:'Artista Expresivo',
  materialesarte3:'Escultor Sustentable',
  lenguajemusical3:'Compositor Junior',
  musicasociedad3:'Melómano Cultural',
  vidaactiva3:'Campeón Saludable III',
  seguridad3:'Deportista Ejemplar III',
  manejoemocional3:'Experto en Emociones III',
  autocuidado3:'Guardián de mi Cuerpo III',
  buentrato3:'Embajador de la Amistad III',
  habitosestudio3:'Estudiante Ejemplar III',
  tecdigital3:'Explorador Digital III',
  comprension4:'Detective de Textos II',
  vocabulario4:'Coleccionista de Palabras IV',
  gramatica4:'Gramático IV',
  ortografia4:'Guardián de la Ortografía II',
  numeros4:'Numerólogo IV',
  operaciones4:'Calculista de Bolsillo II',
  multiplicardividir4:'Campeón del Cálculo',
  fracciones4:'Maestro de las Fracciones II',
  decimales4:'Experto en Decimales',
  patrones4:'Detective de Patrones II',
  geometria4:'Geómetra IV',
  medicion4:'Medidor Preciso IV',
  datos4:'Analista de Datos II',
  ecosistemas4:'Guardián de los Ecosistemas',
  cuerpohumano4:'Anatomista Junior',
  materia4:'Científico de la Materia',
  fuerzas4:'Físico Junior',
  tierra4:'Geólogo Junior',
  civilizacionesamericanas4:'Historiador de América',
  geografiaamerica4:'Geógrafo de América',
  ciudadania4:'Ciudadano Ejemplar IV',
  lenguajevisual4:'Artista Visual II',
  dinamicatempo4:'Director de Orquesta Junior',
  condicionfisica4:'Atleta Consciente II',
  seguridad4:'Deportista Ejemplar IV',
  manejoemocional4:'Experto en Emociones IV',
  autocuidado4:'Guardián de mi Cuerpo IV',
  buentrato4:'Embajador de la Amistad IV',
  habitosestudio4:'Estudiante Ejemplar IV',
  tecdigital4:'Explorador Digital IV',
  comprension5:'Lector Experto V',
  recursospoeticos5:'Poeta Junior',
  vocabulario5:'Maestro de Palabras V',
  gramatica5:'Gramático V',
  ortografia5:'Ortógrafo V',
  numeros5:'Matemático de Números Grandes',
  multiplicar5:'Multiplicador Experto',
  dividir5:'Divisor Experto',
  operaciones5:'Financista Junior',
  fracciones5:'Maestro de Fracciones III',
  decimales5:'Maestro de Decimales II',
  patrones5:'Detective de Patrones III',
  geometria5:'Geómetra V',
  medicion5:'Medidor Experto',
  datos5:'Estadístico Junior III',
  celulasistemas5:'Biólogo del Cuerpo Humano',
  alimentacionsalud5:'Guardián de la Salud V',
  electricidad5:'Electricista Junior',
  aguatierra5:'Guardián del Agua',
  conquista5:'Historiador de la Conquista',
  colonia5:'Historiador de la Colonia',
  geografiachile5:'Geógrafo de Chile V',
  ciudadania5:'Ciudadano Ejemplar V',
  lenguajevisual5:'Artista Visual III',
  texturamusical5:'Compositor Junior',
  vidapostura5:'Atleta Consciente III',
  liderazgo5:'Líder Deportivo V',
  manejoemocional5:'Experto en Emociones V',
  autocuidadodigital5:'Guardián Digital V',
  prevencionsaludable5:'Guardián de la Prevención',
  buentrato5:'Embajador de la Amistad V',
  habitosestudio5:'Estudiante Ejemplar V',
  tecdigital5:'Explorador Digital V',
  vocabularioingles5:'English Explorer',
  lecturasimple5:'English Reader',
  comprension6:'Lector Experto VI',
  recursospoeticos6:'Poeta Junior II',
  vocabulario6:'Maestro de Palabras VI',
  gramatica6:'Gramático VI',
  ortografia6:'Ortógrafo VI',
  multiplosfactores6:'Matemático de Múltiplos y Factores',
  operatoria6:'Calculista Experto',
  razonesporcentajes6:'Maestro de Razones y Porcentajes',
  fraccionesmixtas6:'Maestro de Fracciones IV',
  decimales6:'Maestro de Decimales III',
  patronesecuaciones6:'Detective de Patrones IV',
  triangulosteselados6:'Geómetra de Triángulos',
  angulos6:'Geómetra de Ángulos',
  areavolumen6:'Ingeniero de Área y Volumen',
  datos6:'Estadístico Junior IV',
  fotosintesiscadenas6:'Biólogo de Ecosistemas',
  reproductorpubertad6:'Biólogo del Cuerpo Humano II',
  habitossaludables6:'Guardián de la Salud VI',
  energiatransformaciones6:'Físico de la Energía',
  calortemperatura6:'Físico del Calor',
  tierrasueloerosion6:'Geólogo de la Tierra',
  independencia6:'Historiador de la Independencia',
  republica6:'Historiador de la República',
  salitre6:'Historiador del Salitre',
  sigloxx6:'Historiador del Siglo XX',
  geografiachile6:'Geógrafo de Chile VI',
  ciudadania6:'Ciudadano Ejemplar VI',
  lenguajevisual6:'Artista Visual IV',
  melodiavariaciones6:'Compositor Junior II',
  vidapostura6:'Atleta Consciente IV',
  liderazgo6:'Líder Deportivo VI',
  manejoemocional6:'Experto en Emociones VI',
  autocuidadodigital6:'Guardián Digital VI',
  prevencion6:'Guardián de la Prevención II',
  buentrato6:'Embajador de la Amistad VI',
  habitosestudio6:'Estudiante Ejemplar VI',
  tecdigital6:'Explorador Digital VI',
  vocabularioingles6:'English Explorer II',
  lecturasimple6:'English Reader II',
  comprension7:'Lector Crítico VII',
  rimametrica7:'Poeta en Formación',
  pensamientocritico7:'Detective de Hechos y Opiniones',
  vocabulariogramatica7:'Maestro de la Gramática VII',
  ortografia7:'Ortógrafo Experto V',
  enteros7:'Explorador de Enteros',
  fraccionesdecimales7:'Maestro de Fracciones II',
  porcentajepotencias7:'Experto en Porcentajes',
  algebra7:'Aprendiz de Álgebra',
  proporcionesecuaciones7:'Resolutor de Ecuaciones II',
  geometria7:'Geómetra VII',
  estadisticamuestreo7:'Estadístico en Formación',
  probabilidades7:'Experto en Probabilidades II',
  sexualidadreproduccion7:'Explorador del Cuerpo Humano VII',
  inmunologicomicroorganismos7:'Defensor del Sistema Inmune',
  fuerzaspresion7:'Físico en Formación',
  geologiaclima7:'Geólogo Explorador',
  materiagases7:'Científico de la Materia',
  prehistoriacivilizaciones7:'Explorador de la Prehistoria',
  greciaroma7:'Ciudadano de Grecia y Roma',
  edadmedia7:'Caballero Medieval',
  civilizacionesamericanas7:'Explorador de América II',
  ciudadania7:'Ciudadano Ejemplar VII',
  geografiamedioambiente7:'Guardián del Medioambiente',
  espaciosdifusion7:'Curador de Arte',
  procedimientoscompositivos7:'Compositor en Formación',
  estrategiastacticas7:'Estratega Deportivo',
  prevencionriesgo7:'Guardián de la Prevención VII',
  bienestarvida7:'Embajador del Bienestar',
  redessociales7:'Ciudadano Digital Responsable',
  resolucionconflictos7:'Mediador de Conflictos VII',
  autonomiaaprendizaje7:'Estudiante Autónomo',
  solucionestecnologicas7:'Evaluador Tecnológico',
  vocabularioavanzado7:'English Explorer III',
  lecturaintermedia7:'English Reader III',
  comprension8:'Lector Crítico VIII',
  generosdramaticos8:'Dramaturgo en Formación',
  argumentacionmedios8:'Analista de Medios',
  gramatica8:'Maestro de los Modos Verbales',
  ortografia8:'Experto en Puntuación',
  enterosracionales8:'Dominador de los Enteros',
  potenciasraices8:'Explorador de Potencias',
  variacionesporcentuales8:'Calculista de Porcentajes',
  algebra8:'Algebrista VIII',
  funciones8:'Descubridor de Funciones',
  geometria8:'Discípulo de Pitágoras',
  transformaciones8:'Maestro de las Transformaciones',
  estadisticacombinatoria8:'Estadístico VIII',
  celula8:'Biólogo Celular',
  nutricionsistemas8:'Nutricionista en Formación',
  electricidad8:'Electricista Escolar II',
  calor8:'Experto en Transferencia de Calor',
  atomotabla8:'Físico Atómico en Formación',
  humanismorenacimiento8:'Humanista del Renacimiento',
  estadomoderno8:'Cronista del Estado Moderno',
  conquista8:'Historiador de Dos Mundos',
  colonia8:'Cronista Colonial',
  ilustracionrevoluciones8:'Pensador Ilustrado',
  geografiaregional8:'Geógrafo Regional',
  montajedifusion8:'Curador de Exposiciones',
  armonia8:'Explorador de la Armonía',
  sistemasjuego8:'Estratega Táctico VIII',
  entrenamiento8:'Planificador del Entrenamiento',
  prevencionriesgo8:'Guardián de la Prevención VIII',
  bienestar8:'Embajador del Bienestar VIII',
  relacionesinclusion8:'Defensor de la Inclusión',
  participaciondemocratica8:'Ciudadano Democrático',
  gestionaprendizaje8:'Gestor de su Aprendizaje',
  analisissoluciones8:'Analista Tecnológico',
  funcionesidioma8:'English Explorer IV',
  lecturaavanzada8:'English Reader IV',
  qdcasosrenal:'Nefrólogo en Formación',
  qdcasoshepatico:'Hepatólogo en Formación',
  qdorina:'Maestro del Sedimento',
  qdliquidos:'Experto en Derrames',
  qdlcr:'Detective del LCR',
  qdvalorescriticos:'Guardián de Valores Críticos',
  qdcontrolcalidad:'Auditor de Calidad',
  qdendocrinotumoral:'Endocrinólogo en Formación',
  qdgasesarteriales:'Maestro Ácido-Base',
  qdpancreas:'Experto en Páncreas',
  qdreactivos:'Bioquímico de Reactivos',
  microfundamentos:'Explorador Celular',
  microantimicrobianos:'Farmacólogo Antimicrobiano',
  microsusceptibilidad:'Maestro del Antibiograma',
  microresistencia:'Detective de la Resistencia',
  microcarbapenemasas:'Experto en Carbapenemasas',
  microtaxonomia:'Curador de Medios de Cultivo',
  microstaphylo:'Cazador de Estafilococos',
  microstrepto:'Cazador de Estreptococos',
  microbacilos:'Bacteriólogo de Bacilos Gram+',
  microentero:'Experto en Enterobacterales',
  microbgnnf:'Especialista en No Fermentadores',
  microvibrio:'Explorador de Vibrionaceae',
  comprensionEpjaN1:'Lector Constante',
  sinonimosAntonimosEpjaN1:'Amplio de Vocabulario',
  tiposTextoEpjaN1:'Conocedor de Textos',
  gramaticaOrtografiaEpjaN1:'Guardián de la Ortografía',
  numerosEpjaN1:'Maestro de los Números',
  unidadesMedidaEpjaN1:'Experto en Medidas',
  operacionesEpjaN1:'Resuelve Problemas',
  patronesEpjaN1:'Detector de Patrones',
  perimetroAreaEpjaN1:'Geómetra Práctico',
  datosEpjaN1:'Lector de Gráficos',
  comprensionEpjaN2:'Lector Avanzado',
  vocabularioContextoEpjaN2:'Detective de Palabras',
  tiposTextoEpjaN2:'Conocedor de la Noticia',
  hechosOpinionesEpjaN2:'Pensador Crítico',
  multiplosFactoresEpjaN2:'Maestro de los Múltiplos',
  fraccionesDecimalesEpjaN2:'Experto en Fracciones',
  operatoriaEpjaN2:'Calculista Certero',
  perimetroAreaEpjaN2:'Geómetra Avanzado',
  volumenEpjaN2:'Maestro del Volumen',
  datosPromedioEpjaN2:'Analista de Datos',
  seresVivosEcosistemasEpjaN2:'Guardián del Ecosistema',
  nutricionEpjaN2:'Experto en Nutrición',
  sistemaSolarUniversoEpjaN2:'Explorador del Universo',
  materiaEstadosEpjaN2:'Científico de Materiales',
  mezclasAguaSueloEpjaN2:'Experto en Mezclas',
  chileColoniaIndependenciaEpjaN2:'Historiador de la Independencia',
  chileSigloXIXXXEpjaN2:'Historiador del Siglo XX',
  geografiaChileEpjaN2:'Geógrafo de Chile',
  comprensionEpjaN3:'Lector Experto',
  vocabularioContextoEpjaN3:'Maestro del Vocabulario',
  tiposTextoEpjaN3:'Comunicador Certero',
  hechosOpinionesEpjaN3:'Pensador Crítico Avanzado',
  numerosEnterosEpjaN3:'Maestro de los Enteros',
  potenciasNotacionEpjaN3:'Experto en Potencias',
  razonesProporcionesEpjaN3:'Calculista de Proporciones',
  pitagorasCircunferenciaEpjaN3:'Geómetra de Pitágoras',
  angulosTriangulosEpjaN3:'Maestro de los Ángulos',
  estadisticaEpjaN3:'Analista de Estadística',
  modeloCineticoEpjaN3:'Científico de la Materia',
  atomosReaccionesEpjaN3:'Químico en Formación',
  energiaTransformacionesEpjaN3:'Experto en Energía',
  origenVidaGeneticaEpjaN3:'Explorador de la Genética',
  reproduccionSexualidadEpjaN3:'Informado en Salud Reproductiva',
  sistemaInmuneEnfermedadesEpjaN3:'Guardián de la Salud',
  historiaEconomiaMundialEpjaN3:'Historiador del Mundo',
  trabajoChileEpjaN3:'Experto en el Trabajo Chileno',
  democraciaDerechosEpjaN3:'Defensor de la Democracia',
  comprensionEpjaM1:'Lector de Nivel Medio', vocabularioContextoEpjaM1:'Maestro del Vocabulario',
  textosExpositivosEpjaM1:'Experto en Textos Expositivos', hechosOpinionesEpjaM1:'Pensador Crítico',
  numerosRacionalesEpjaM1:'As de los Números', potenciasIrracionalesEpjaM1:'Maestro de Potencias',
  proporcionalidadEpjaM1:'Experto en Proporciones', algebraEpjaM1:'Algebrista',
  funcionesEcuacionesEpjaM1:'Resuelve Ecuaciones', geometriaSemejanzaEpjaM1:'Geómetra',
  transformacionesMedicionEpjaM1:'Maestro de Medidas', estadisticaProbabilidadEpjaM1:'Estadístico',
  celulaMetabolismoEpjaM1:'Biólogo Celular', sistemasNutricionEpjaM1:'Experto en Nutrición',
  ecosistemasBiodiversidadEpjaM1:'Guardián del Ecosistema', movimientoOndasOpticaEpjaM1:'Físico del Movimiento',
  energiaCalorEpjaM1:'Maestro de la Energía', disolucionesReaccionesEpjaM1:'Químico Experto',
  coloniaIndependenciaEpjaM1:'Historiador de la Independencia', sigloXIXTerritorioEpjaM1:'Historiador del Siglo XIX',
  sigloXXDemocraciaEpjaM1:'Defensor de la Democracia', ciudadaniaDerechosEpjaM1:'Ciudadano Informado',
  gramaticaContextoEpjaM1:'Gramático del Inglés', vocabularioFuncionalEpjaM1:'Vocabulario Funcional',
  comprensionInglesEpjaM1:'Lector en Inglés',
  comprensionEpjaM2:'Lector Experto', vocabularioContextoEpjaM2:'Maestro del Vocabulario',
  textoArgumentativoEpjaM2:'Argumentador', hechosOpinionesEpjaM2:'Pensador Crítico',
  raicesCuadradasEpjaM2:'Maestro de las Raíces', funcionesExpLogEpjaM2:'Explorador Exponencial',
  funcionCuadraticaEpjaM2:'Resolutor Cuadrático', trigonometriaEpjaM2:'Maestro de la Trigonometría',
  estadisticaMuestrasEpjaM2:'Analista de Datos', probabilidadEpjaM2:'Calculador de Probabilidades',
  homeostasisSistemasEpjaM2:'Guardián del Equilibrio', sistemaInmuneGeneticaEpjaM2:'Genetista',
  fluidosPresionEpjaM2:'Maestro de los Fluidos', electricidadMagnetismoEpjaM2:'Electricista Experto',
  evolucionAtomoEpjaM2:'Explorador Atómico', enlacesRadiactividadEpjaM2:'Químico Nuclear',
  organicaPolimerosEpjaM2:'Químico Orgánico',
  sigloXXBipolaridadEpjaM2:'Historiador Mundial', globalizacionEconomiaEpjaM2:'Economista Global',
  problemasGlobalesEpjaM2:'Ciudadano del Mundo', poblacionTerritorioEpjaM2:'Geógrafo Poblacional',
  gramaticaContextoEpjaM2:'Gramático Avanzado', vocabularioTecnicoEpjaM2:'Vocabulario Técnico',
  comprensionInglesEpjaM2:'Lector Avanzado en Inglés',
  numerospotenciasm1:'Maestro de Racionales', productosnotablesm1:'Algebrista Notable', sistemasecuacionesm1:'Resolutor de Sistemas',
  funcioneslinealesm1:'Trazador de Rectas', geometriam1:'Geómetra del Cono', homoteciatalesm1:'Discípulo de Tales', estadisticaprobabilidadm1:'Estadístico Junior',
  narrativam1:'Analista Narrativo', poesiam1:'Poeta Simbólico', dramaromanticismom1:'Crítico Dramático', argumentativomediosm1:'Pensador Crítico de Medios', ortografiam1:'Ortógrafo de Primero Medio',
  ideasrepublicanasm1:'Republicano Ilustrado', estadonacionm1:'Historiador Industrial', imperialismoguerram1:'Analista Mundial', republicachilem1:'Fundador de la República',
  salitreparlamentarismom1:'Cronista del Salitre', geografiapueblosm1:'Guardián Territorial', economiaciudadaniam1:'Ciudadano Financiero',
  evolucionm1:'Biólogo Evolutivo', ecosistemaspoblacionesm1:'Ecólogo de Poblaciones', ciclosimpactom1:'Guardián del Ecosistema', ondassonidom1:'Físico de Ondas',
  luzsentidosm1:'Explorador de la Luz', sistemasolarm1:'Astrónomo de Primero Medio', reaccionesquimicasm1:'Químico de Reacciones', compuestosestequiometriam1:'Estequiómetra',
  gramaticacontextom1:'Gramático en Inglés', vocabulariocontextom1:'Políglota en Formación', comprensionlecturam1:'Lector de Primero Medio',
  estrategiastacticasm1:'Estratega Deportivo', entrenamientom1:'Entrenador Personal', vidaactivaseguridadm1:'Guardián de la Seguridad',
  evoluciontecnologicam1:'Analista Tecnológico',
  difusionm1:'Curador de Arte',
  musicaidentidadm1:'Guardián de la Identidad Musical',
  prevencionriesgosm1:'Protector Preventivo', bienestarvidam1:'Embajador del Bienestar', relacionesredesm1:'Ciudadano Digital', resolucionconflictosm1:'Mediador de Primero Medio',
  numerosrealesm2:'Maestro de los Reales', potenciaslogaritmosm2:'Logarítmico', funcioncuadraticam2:'Resolutor Cuadrático II', funcioninversam2:'Invertidor de Funciones',
  interescompuestom2:'Inversionista Compuesto', esferam2:'Geómetra de la Esfera', trigonometriam2:'Trigonómetra', estadisticaprobabilidadm2:'Estadístico de Segundo Medio',
  narrativam2:'Analista de Personajes', poesiam2:'Poeta del Soneto', teatrosigloorom2:'Cervantino', cuentolatinoamericanom2:'Cronista Latinoamericano',
  argumentativomediosm2:'Detective de Falacias', ortografiam2:'Ortógrafo de Segundo Medio',
  nerviosohormonalm2:'Fisiólogo Hormonal', sexualidadreproducccionm2:'Educador en Salud II', geneticaherenciam2:'Genetista Junior', manipulaciongeneticam2:'Bioingeniero',
  movimientofuerzasm2:'Físico del Movimiento', energiachoquesm2:'Físico de Colisiones', universogravitacionm2:'Astrónomo de Segundo Medio', disolucionesorganicam2:'Químico de Disoluciones',
  entreguerrasm2:'Cronista de Entreguerras', crisisliberalismom2:'Analista del Liberalismo', segundaguerram2:'Historiador Mundial II', republicachilem2:'Reconstructor de la República',
  guerrafriam2:'Analista de la Guerra Fría', movilizacionchilem2:'Cronista de la Movilización', dictaduratransicionm2:'Historiador de la Transición', formacionciudadanam2:'Ciudadano Informado II',
  gramaticacontextom2:'Gramático Avanzado en Inglés', vocabulariocontextom2:'Maestro de Derivadas', comprensionlecturam2:'Lector de Segundo Medio',
  tacticasdisenom2:'Diseñador Táctico', entrenamientocaloricom2:'Entrenador Calórico',
  implementaciondifusionm2:'Gestor Cultural',
  contrastemediosm2:'Musicólogo Comparativo',
  escenariostecnologicosm2:'Futurólogo Tecnológico',
  riesgosredesapoyom2:'Guardián de Redes de Apoyo', bienestarrelacionesm2:'Embajador de Bienestar II', proyeccionacademicam2:'Proyector de Futuro',
  numeroscomplejospg3:'Maestro de lo Imaginario', estadisticadispersionpg3:'Analista de Dispersión', funcionesexplogpg3:'Domador de Exponentes', geometriacircunferenciapg3:'Geómetra del Círculo',
  matfinancierapg4:'Estratega Financiero', binomialnormalpg4:'Modelador de Probabilidades', funcionespotenciatrigpg4:'Trigonómetra', rectascircunferenciaspg4:'Cartógrafo del Plano',
  interpretacionliterariapg3:'Intérprete Literario', analisiscriticopg3:'Detective de Medios',
  comparacionobraspg4:'Comparatista Literario', evaluacioncriticapg4:'Auditor de Textos',
  democraciaciudadaniapg3:'Guardián de la Democracia', sistemajudicialddhhpg3:'Defensor de Derechos', estadomercadoterritoriopg3:'Analista de Territorio',
  institucionalidaddemocraticapg4:'Arquitecto Institucional', modelosdesarrollopg4:'Estratega del Desarrollo', libertadigualdadpg4:'Voz de la Igualdad', mediosciudadaniadigitalpg4:'Ciudadano Digital',
  quefilosofiapg3:'Aprendiz de Filósofo', ontologiapg3:'Explorador del Ser', epistemologiapg3:'Buscador de la Verdad', logicaargumentacionpg3:'Maestro de la Lógica',
  eticateoriaspg4:'Ético en Formación', argumentosfalaciaspg4:'Cazador de Falacias', filosofiacontemporaneapg4:'Filósofo Contemporáneo',
  ambientesostenibilidadpg:'Guardián Sostenible', bienestarsaludpg:'Promotor del Bienestar', seguridadautocuidadopg:'Experto en Prevención', tecnologiasociedadpg:'Analista Tecnológico',
  vocabgramaticapg3:'Gramático en Inglés', comprensionlecturapg3:'Lector Crítico en Inglés',
  vocabavanzadopg4:'Gramático Avanzado', comprensionlecturaavanzadapg4:'Lector Avanzado en Inglés',
  estructuracelularpd:'Explorador Celular', dogmacentralpd:'Guardián del Dogma Central', regulaciongenicapd:'Regulador Génico', proteinaspd:'Arquitecto de Proteínas', biotecnologiapd:'Biotecnólogo',
  biodiversidadevolucionpd:'Guardián de la Biodiversidad', serviciosecosistemicospd:'Analista de Ecosistemas', resilienciaclimaticapd:'Centinela Climático', tecnologiaclimapd:'Innovador Ambiental',
  saludpublicapd:'Analista de Salud Pública', genomaambientepd:'Genetista Ambiental', estilosvidasaludpd:'Promotor de Vida Saludable', calidadambientalsaludpd:'Guardián Ambiental', tecnologiamedicapd:'Innovador Médico',
  fisicaclimapd:'Físico del Clima', origenuniversopd:'Explorador Cósmico', fuerzascentralespd:'Maestro de la Gravedad', fisicamodernapd:'Físico Cuántico', fluidoselectromagnetismopd:'Ingeniero de Fluidos y Circuitos',
  nanoquimicapolimerospd:'Nanoquímico', acidobaseredoxpd:'Maestro del Redox', termodinamicacineticapd:'Cinético Térmico', quimicaclimapd:'Químico del Clima', contaminantesquimicospd:'Detective de Contaminantes', tecnologiasquimicasclimapd:'Tecnólogo Químico Verde',
  alconoceletras:'Explorador del Abecedario', alletrainicial:'Cazador de Sonidos', alprimerasilabas:'Constructor de Sílabas',
};

export function spawnConfetti(container){
  const colors = ['#FF6B6B','#FFB627','#12A594','#7C6FF0','#FFD23F'];
  for(let i=0;i<26;i++){
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.style.left = Math.random()*100 + '%';
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDelay = (Math.random()*0.4) + 's';
    p.style.transform = 'rotate(' + Math.floor(Math.random()*360) + 'deg)';
    container.appendChild(p);
  }
}

export function replayGame(key){
  if(MC_KEYS.indexOf(key)!==-1) initMCGame(key);
  else if(key==='silabas') initSilabasGame();
  else if(key==='secuencia') initSecuenciaGame();
  else if(key==='memorama') render();
  else if(key==='escribenombre') initEscribeNombreGame();
  else if(key==='caligrafia') initCaligrafiaGame();
}

export function showExplain(text, onContinue){
  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay';
  const who = state.userName ? ', ' + state.userName : '';
  div.innerHTML =
    '<div class="explain-card">'+
      '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(80)+'</div>'+
      '<p class="explain-title">🐾 Carboncito te explica'+who+'</p>'+
      '<p class="explain-text">'+text+'</p>'+
      '<button class="cta-btn" id="explain-continue-btn">¡Entendido, sigamos! 👍</button>'+
    '</div>';
  app.appendChild(div);
  document.getElementById('explain-continue-btn').onclick = function(){
    div.remove();
    onContinue();
  };
}

/* Botón "Recurso" (micro-lección conceptual contextual a la pregunta actual,
   ver mcEngine.js showMCRecurso). A diferencia de showExplain(), esto NO
   bloquea el avance de la ronda: se puede abrir y cerrar libremente en
   cualquier momento tocando la X o el fondo oscuro, sin perder el progreso. */
export function showRecurso(text, title){
  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay recurso-overlay';
  div.onclick = function(e){ if(e.target === div) closeRecurso(); };
  div.innerHTML =
    '<div class="recurso-card" role="dialog" aria-label="Recurso educativo">'+
      '<div class="recurso-header">'+
        '<span class="recurso-icon">📚</span>'+
        '<p class="recurso-title">'+(title||'Recurso')+'</p>'+
        '<button class="recurso-close" aria-label="Cerrar recurso" onclick="closeRecurso()">✕</button>'+
      '</div>'+
      '<div class="recurso-body">'+text+'</div>'+
    '</div>';
  app.appendChild(div);
}
export function closeRecurso(){
  const el = document.querySelector('.recurso-overlay');
  if(!el) return;
  el.classList.add('closing');
  setTimeout(function(){ el.remove(); }, 180);
}

export function showNameEntry(onDone){
  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay';
  /* id/name aleatorios en cada aparición: Chrome recuerda valores anteriores
     escritos en un campo por su id/name (su función de "sugerencias de
     formulario", distinta del autocompletado de perfil) e ignora
     autocomplete="off" para esa función en varias versiones — así que un
     nombre viejo puede reaparecer y pisar lo que el niño escribió recién.
     Un id/name que nunca se repite dos veces evita que Chrome tenga algo
     que sugerir. */
  const inputId = 'name-input-' + Math.random().toString(36).slice(2, 8);
  div.innerHTML =
    '<div class="explain-card">'+
      '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(90)+'</div>'+
      '<p class="explain-title">🐾 ¡Hola! Soy Carboncito</p>'+
      '<p class="explain-text">¿Cómo te llamas?</p>'+
      '<input id="'+inputId+'" name="'+inputId+'" class="name-input" type="text" maxlength="20" '+
        'autocomplete="off" autocorrect="off" autocapitalize="words" spellcheck="false" '+
        'placeholder="Escribe tu nombre" aria-label="Tu nombre">'+
      '<button class="cta-btn" id="name-continue-btn">¡Listo! 🐾</button>'+
    '</div>';
  app.appendChild(div);
  const input = document.getElementById(inputId);
  input.focus();
  function submit(){
    const name = input.value.trim();
    state.userName = name;
    saveProgress();
    if(name) showTraceStep(name); else finish();
  }
  function showTraceStep(name){
    div.innerHTML =
      '<div class="explain-card">'+
        '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(70)+'</div>'+
        '<p class="explain-title">✏️ ¡Ahora dibújalo, '+name+'!</p>'+
        '<p class="explain-text">Repasa tu nombre con el dedo o el mouse, como si lo dibujaras.</p>'+
        renderTraceCanvas('name-trace-canvas', {height:170})+
        '<button class="cta-btn" id="trace-continue-btn">¡Listo! 👍</button>'+
        '<button class="cta-btn secondary" id="trace-skip-btn" style="margin-top:8px;">Saltar por ahora</button>'+
      '</div>';
    initTraceCanvas('name-trace-canvas', name);
    document.getElementById('trace-continue-btn').onclick = finish;
    document.getElementById('trace-skip-btn').onclick = finish;
  }
  function finish(){
    div.remove();
    onDone();
  }
  document.getElementById('name-continue-btn').onclick = submit;
  input.addEventListener('keydown', function(e){ if(e.key === 'Enter') submit(); });
}

export function showResult(moduleKey, correctOrStars, total, isStarsAlready, customSub){
  let stars;
  if(isStarsAlready){
    stars = correctOrStars;
    awardXP(stars*15);
  }else{
    const ratio = correctOrStars/total;
    stars = ratio>=0.85 ? 3 : ratio>=0.6 ? 2 : ratio>=0.35 ? 1 : 0;
  }
  state.stars[moduleKey] = Math.max(state.stars[moduleKey], stars);
  saveProgress();

  const isNewBadge = !state.badges.has(moduleKey) && stars>0;
  if(isNewBadge){
    state.badges.add(moduleKey);
    awardXP(15);
  }

  const app = document.getElementById('app');
  const div = document.createElement('div');
  div.className = 'overlay';
  const who = state.userName ? ', ' + state.userName : '';
  div.innerHTML =
    '<div class="result-card">'+
      '<div class="float" style="display:flex;justify-content:center;">'+mascotSVG(90)+'</div>'+
      '<p class="result-title">'+(stars>=2 ? '¡Excelente trabajo'+who+'!' : '¡Buen intento'+who+'!')+'</p>'+
      '<div class="result-stars">'+[0,1,2].map(function(i){ return starSVG(i<stars); }).join('')+'</div>'+
      '<p class="result-sub">'+(customSub ? customSub : (isStarsAlready ? ('Lo lograste en '+mGame.moves+' movimientos.') : ('Acertaste '+correctOrStars+' de '+total+'.')))+'</p>'+
      (isNewBadge ? '<div class="badge-unlock">🏅 ¡Insignia nueva: '+(MODULE_TITLES[moduleKey]||moduleKey)+'!</div>' : '')+
      '<div class="result-actions">'+
        '<button class="cta-btn secondary" onclick="this.closest(\'.overlay\').remove(); goBack();">Volver al mapa</button>'+
        '<button class="cta-btn" onclick="this.closest(\'.overlay\').remove(); replayGame(\''+moduleKey+'\');">Jugar de nuevo 🔁</button>'+
      '</div>'+
    '</div>';
  app.appendChild(div);
  if(stars===3){ spawnConfetti(div.querySelector('.result-card')); }
}

import {
  genVocalRound, genPalabraRound, genComprensionRound, genCombinacionRound,
  genGramatica2Round, genComprension2Round,
  genGenerosLiterarios3Round, genComprension3Round, genVocabulario3Round, genAlfabetico3Round,
  genGramatica3Round, genOrtografia3Round,
  genComprension4Round, genVocabulario4Round, genGramatica4Round, genOrtografia4Round,
  genComprension5Round, genRecursosPoeticos5Round, genVocabulario5Round, genGramatica5Round, genOrtografia5Round,
  genComprension6Round, genRecursosPoeticos6Round, genVocabulario6Round, genGramatica6Round, genOrtografia6Round,
  genComprension7Round, genRimaMetrica7Round, genPensamientoCritico7Round, genVocabularioGramatica7Round, genOrtografia7Round,
  genComprension8Round, genGenerosDramaticos8Round, genArgumentacionMedios8Round, genGramatica8Round, genOrtografia8Round,
} from './content/lenguaje.js';
import {
  genCountRound, genAddRound, genCompareRound, genFormaRound, genSaltaRound, genMultiplicarRound,
  genGeometria2Round, genMedicion2Round,
  genNumeros3Round, genOperaciones3Round, genMultiplicar3Round, genDividir3Round, genFracciones3Round,
  genPatrones3Round, genGeometria3Round, genMedicion3Round, genDatos3Round,
  genNumeros4Round, genOperaciones4Round, genMultiplicarDividir4Round, genFracciones4Round,
  genDecimales4Round, genPatrones4Round, genGeometria4Round, genMedicion4Round, genDatos4Round,
  genNumeros5Round, genMultiplicar5Round, genDividir5Round, genOperaciones5Round, genFracciones5Round,
  genDecimales5Round, genPatrones5Round, genGeometria5Round, genMedicion5Round, genDatos5Round,
  genMultiplosFactores6Round, genOperatoria6Round, genRazonesPorcentajes6Round, genFraccionesMixtas6Round,
  genDecimales6Round, genPatronesEcuaciones6Round, genTriangulosTeselados6Round, genAngulos6Round,
  genAreaVolumen6Round, genDatos6Round,
  genEnteros7Round, genFraccionesDecimales7Round, genPorcentajePotencias7Round, genAlgebra7Round,
  genProporcionesEcuaciones7Round, genGeometria7Round, genEstadisticaMuestreo7Round, genProbabilidades7Round,
  genEnterosRacionales8Round, genPotenciasRaices8Round, genVariacionesPorcentuales8Round, genAlgebra8Round,
  genFunciones8Round, genGeometria8Round, genTransformaciones8Round, genEstadisticaCombinatoria8Round,
} from './content/matematica.js';
import {
  genSeresVivosRound, genPlantasRound, genCuerpoRound, genMaterialesRound, genDiaNocheRound,
  genVertebrados2Round, genCiclosVida2Round, genHabitats2Round, genCuerpoDentro2Round, genAgua2Round, genClima2Round,
  genPlantas3Round, genCicloPlanta3Round, genCuidadoAmbiente3Round, genAlimentacion3Round,
  genLuz3Round, genSonido3Round, genSistemaSolar3Round,
  genEcosistemas4Round, genCuerpoHumano4Round, genMateria4Round, genFuerzas4Round, genTierra4Round,
  genCelulaSistemas5Round, genAlimentacionSalud5Round, genElectricidad5Round, genAguaTierra5Round,
  genFotosintesisCadenas6Round, genReproductorPubertad6Round, genHabitosSaludables6Round, genEnergiaTransformaciones6Round,
  genCalorTemperatura6Round, genTierraSueloErosion6Round,
  genSexualidadReproduccion7Round, genInmunologicoMicroorganismos7Round, genFuerzasPresion7Round,
  genGeologiaClima7Round, genMateriaGases7Round,
  genCelula8Round, genNutricionSistemas8Round, genElectricidad8Round, genCalor8Round, genAtomoTabla8Round,
} from './content/ciencias.js';
import {
  genCalendarioRound, genMiIdentidadRound, genSimbolosRound, genMapasRound, genComunidadRound,
  genPueblos2Round, genPatrimonio2Round, genPaisajes2Round, genCiudadania2Round,
  genCivilizaciones3Round, genGeografia3Round, genCiudadania3Round,
  genCivilizacionesAmericanas4Round, genGeografiaAmerica4Round, genCiudadania4Round,
  genConquista5Round, genColonia5Round, genGeografiaChile5Round, genCiudadania5Round,
  genIndependencia6Round, genRepublica6Round, genSalitre6Round, genSigloxx6Round, genGeografiaChile6Round, genCiudadania6Round,
  genPrehistoriaCivilizaciones7Round, genGreciaRoma7Round, genEdadMedia7Round, genCivilizacionesAmericanas7Round,
  genCiudadania7Round, genGeografiaMedioambiente7Round,
  genHumanismoRenacimiento8Round, genEstadoModerno8Round, genConquista8Round, genColonia8Round,
  genIlustracionRevoluciones8Round, genGeografiaRegional8Round,
} from './content/historia.js';
import {
  genColoresRound, genLineasTexturasRound, genMaterialesArteRound, genLineasColores2Round,
  genColorExpresivo3Round, genMaterialesArte3Round,
  genLenguajeVisual4Round,
  genLenguajeVisual5Round,
  genLenguajeVisual6Round,
  genEspaciosDifusion7Round,
  genMontajeDifusion8Round,
} from './content/artes.js';
import {
  genSonidosRound, genInstrumentosRound, genTimbrePulso2Round,
  genLenguajeMusical3Round, genMusicaSociedad3Round,
  genDinamicaTempo4Round,
  genTexturaMusical5Round,
  genMelodiaVariaciones6Round,
  genProcedimientosCompositivos7Round,
  genArmonia8Round,
} from './content/musica.js';
import {
  genMovimientoRound, genVidaActivaRound, genSeguridadRound,
  genCuerpoResponde2Round, genVidaActiva2Round, genLiderazgo2Round,
  genVidaActiva3Round, genSeguridad3Round,
  genCondicionFisica4Round, genSeguridad4Round,
  genVidaPostura5Round, genLiderazgo5Round,
  genVidaPostura6Round, genLiderazgo6Round,
  genEstrategiasTacticas7Round,
  genSistemasJuego8Round, genEntrenamiento8Round,
} from './content/edfisica.js';
import {
  genEmocionesRound, genAutocuidadoRound, genConvivenciaRound,
  genEmociones2Round, genAutocuidado2Round, genHabitosEscolares2Round, genConvivencia2Round,
  genManejoEmocional3Round, genAutocuidado3Round, genBuenTrato3Round, genHabitosEstudio3Round,
  genManejoEmocional4Round, genAutocuidado4Round, genBuenTrato4Round, genHabitosEstudio4Round,
  genManejoEmocional5Round, genAutocuidadoDigital5Round, genPrevencionSaludable5Round, genBuenTrato5Round, genHabitosEstudio5Round,
  genManejoEmocional6Round, genAutocuidadoDigital6Round, genPrevencion6Round, genBuenTrato6Round, genHabitosEstudio6Round,
  genPrevencionRiesgo7Round, genBienestarVida7Round, genRedesSociales7Round, genResolucionConflictos7Round, genAutonomiaAprendizaje7Round,
  genPrevencionRiesgo8Round, genBienestar8Round, genRelacionesInclusion8Round, genParticipacionDemocratica8Round, genGestionAprendizaje8Round,
} from './content/orientacion.js';
import { genHerramientasTecRound, genTecDigital2Round, genTecDigital3Round, genTecDigital4Round, genTecDigital5Round, genTecDigital6Round, genSolucionesTecnologicas7Round, genAnalisisSoluciones8Round } from './content/tecnologia.js';
import { genVocabularioIngles5Round, genLecturaSimple5Round, genVocabularioIngles6Round, genLecturaSimple6Round, genVocabularioAvanzado7Round, genLecturaIntermedia7Round, genFuncionesIdioma8Round, genLecturaAvanzada8Round } from './content/ingles.js';
import {
  genPatronesRound, genClasificarRound, genPosicionRound, genCuantificadoresRound,
  genSecuenciaTemporalRound, genContarVeinteRound, genSumarQuitarRound,
  genFormasCuerposRound, genMedirRound,
} from './content/parvularia/pensamientoMatematico.js';
import {
  genSilabasNTRound, genEscucharNTRound, genVocabNTRound, genLetrasNTRound,
} from './content/parvularia/lenguajeVerbal.js';
import {
  genApreciarNTRound, genCompararFormasNTRound, genLineasDisenoNTRound,
} from './content/parvularia/lenguajesArtisticos.js';
import {
  genEmocionesNTRound, genAutocuidadoNTRound, genAlimentosNTRound,
} from './content/parvularia/identidadAutonomia.js';
import {
  genResolucionNTRound, genNormasNTRound, genSeguridadNTRound,
} from './content/parvularia/convivenciaCiudadania.js';
import {
  genUbicacionEspacialNTRound, genAntesDespuesNTRound, genMovimientoNTRound,
} from './content/parvularia/corporalidadMovimiento.js';
import {
  genAguaSolNTRound, genMaterialesNaturalNTRound, genAnimalesPlantasNTRound,
  genCiclosNTRound, genAmbienteNTRound,
} from './content/parvularia/exploracionEntornoNatural.js';
import {
  genRolesComunidadNTRound, genObjetosTecNTRound, genInstitucionesNTRound,
  genSeguridadPrevNTRound,
} from './content/parvularia/comprensionEntornoSociocultural.js';
import {
  genCasosRenal7Round, genCasosHepatico7Round, genOrina7Round, genLiquidos7Round, genLcr7Round,
  genValoresCriticos7Round, genControlCalidad7Round, genEndocrinoTumoral7Round,
  genGasesArteriales7Round, genPancreas7Round, genReactivos7Round,
} from './content/estudioPruebas/quimicaDiagnostica.js';
import {
  genFundamentos7Round, genAntimicrobianos7Round, genSusceptibilidad7Round, genResistencia7Round,
  genCarbapenemasas7Round, genTaxonomia7Round, genStaphylo7Round, genStrepto7Round,
  genBacilos7Round, genEntero7Round, genBgnnf7Round, genVibrio7Round,
} from './content/estudioPruebas/microbiologiaClinica.js';
import {
  genComprensionEpjaN1Round, genSinonimosAntonimosEpjaN1Round, genTiposTextoEpjaN1Round, genGramaticaOrtografiaEpjaN1Round,
} from './content/epja/lenguajeNivel1.js';
import {
  genNumerosEpjaN1Round, genUnidadesMedidaEpjaN1Round, genOperacionesEpjaN1Round,
  genPatronesEpjaN1Round, genPerimetroAreaEpjaN1Round, genDatosEpjaN1Round,
} from './content/epja/matematicaNivel1.js';
import {
  genComprensionEpjaN2Round, genVocabularioContextoEpjaN2Round, genTiposTextoEpjaN2Round, genHechosOpinionesEpjaN2Round,
} from './content/epja/lenguajeNivel2.js';
import {
  genMultiplosFactoresEpjaN2Round, genFraccionesDecimalesEpjaN2Round, genOperatoriaEpjaN2Round,
  genPerimetroAreaEpjaN2Round, genVolumenEpjaN2Round, genDatosPromedioEpjaN2Round,
} from './content/epja/matematicaNivel2.js';
import {
  genSeresVivosEcosistemasEpjaN2Round, genNutricionEpjaN2Round, genSistemaSolarUniversoEpjaN2Round,
  genMateriaEstadosEpjaN2Round, genMezclasAguaSueloEpjaN2Round,
} from './content/epja/cienciasNivel2.js';
import {
  genChileColoniaIndependenciaEpjaN2Round, genChileSigloXIXXXEpjaN2Round, genGeografiaChileEpjaN2Round,
} from './content/epja/estudiosSocialesNivel2.js';
import { sfxCorrect, sfxWrong, sfxStreak } from './audio.js';
import { awardXP } from './state.js';
import { showExplain, showResult, showRecurso } from './rewards.js';

export const MC_KEYS = ['vocales','palabras','comprension','contar','sumar','comparar','formas','combinaciones','salta','multiplicar',
  'seresvivos','plantas','micuerpo','materiales','dianoche',
  'calendario','miidentidad','simbolos','mapas','comunidad',
  'colores','lineastexturas','materialesarte',
  'sonidos','instrumentos',
  'movimiento','vidaactiva','seguridad',
  'emociones','autocuidado','convivencia',
  'herramientastec',
  'patrones','clasificar','posicion','cuantificadores','secuenciatemporal',
  'contarveinte','sumarquitar','formascuerpos','medir',
  'silabasnt','escucharnt','vocabnt','letrasnt',
  'apreciarnt','comparaformasnt','lineasdisenont',
  'emocionesnt','autocuidadont','alimentosnt',
  'resolucionnt','normasnt','seguridadnt',
  'ubicacionespacialnt','cuandoocurrent','movimientont',
  'aguasolnt','materialesnaturalnt','animalesplantasnt','ciclosnt','ambientent',
  'rolescomunidadnt','objetostecnt','institucionesnt','seguridadprevnt',
  'gramatica2','comprension2','geometria2','medicion2',
  'vertebrados2','ciclosvida2','habitats2','cuerpodentro2','agua2','clima2',
  'pueblos2','patrimonio2','paisajes2','ciudadania2',
  'lineascolores2',
  'timbrepulso2',
  'cuerporesponde2','vidaactiva2','liderazgo2',
  'emociones2','autocuidado2','habitosescolares2','convivencia2',
  'tecdigital2',
  'generosliterarios3','comprension3','vocabulario3','alfabetico3','gramatica3','ortografia3',
  'numeros3','operaciones3','multiplicar3','dividir3','fracciones3','patrones3','geometria3','medicion3','datos3',
  'plantas3','cicloplanta3','cuidadoambiente3','alimentacion3','luz3','sonido3','sistemasolar3',
  'civilizaciones3','geografia3','ciudadania3',
  'colorexpresivo3','materialesarte3',
  'lenguajemusical3','musicasociedad3',
  'vidaactiva3','seguridad3',
  'manejoemocional3','autocuidado3','buentrato3','habitosestudio3',
  'tecdigital3',
  'comprension4','vocabulario4','gramatica4','ortografia4',
  'numeros4','operaciones4','multiplicardividir4','fracciones4','decimales4','patrones4','geometria4','medicion4','datos4',
  'ecosistemas4','cuerpohumano4','materia4','fuerzas4','tierra4',
  'civilizacionesamericanas4','geografiaamerica4','ciudadania4',
  'lenguajevisual4',
  'dinamicatempo4',
  'condicionfisica4','seguridad4',
  'manejoemocional4','autocuidado4','buentrato4','habitosestudio4',
  'tecdigital4',
  'comprension5','recursospoeticos5','vocabulario5','gramatica5','ortografia5',
  'numeros5','multiplicar5','dividir5','operaciones5','fracciones5','decimales5','patrones5','geometria5','medicion5','datos5',
  'celulasistemas5','alimentacionsalud5','electricidad5','aguatierra5',
  'conquista5','colonia5','geografiachile5','ciudadania5',
  'lenguajevisual5',
  'texturamusical5',
  'vidapostura5','liderazgo5',
  'manejoemocional5','autocuidadodigital5','prevencionsaludable5','buentrato5','habitosestudio5',
  'tecdigital5',
  'vocabularioingles5','lecturasimple5',
  'comprension6','recursospoeticos6','vocabulario6','gramatica6','ortografia6',
  'multiplosfactores6','operatoria6','razonesporcentajes6','fraccionesmixtas6','decimales6','patronesecuaciones6','triangulosteselados6','angulos6','areavolumen6','datos6',
  'fotosintesiscadenas6','reproductorpubertad6','habitossaludables6','energiatransformaciones6','calortemperatura6','tierrasueloerosion6',
  'independencia6','republica6','salitre6','sigloxx6','geografiachile6','ciudadania6',
  'lenguajevisual6',
  'melodiavariaciones6',
  'vidapostura6','liderazgo6',
  'manejoemocional6','autocuidadodigital6','prevencion6','buentrato6','habitosestudio6',
  'tecdigital6',
  'vocabularioingles6','lecturasimple6',
  'comprension7','rimametrica7','pensamientocritico7','vocabulariogramatica7','ortografia7',
  'enteros7','fraccionesdecimales7','porcentajepotencias7','algebra7','proporcionesecuaciones7','geometria7','estadisticamuestreo7','probabilidades7',
  'sexualidadreproduccion7','inmunologicomicroorganismos7','fuerzaspresion7','geologiaclima7','materiagases7',
  'prehistoriacivilizaciones7','greciaroma7','edadmedia7','civilizacionesamericanas7','ciudadania7','geografiamedioambiente7',
  'espaciosdifusion7',
  'procedimientoscompositivos7',
  'estrategiastacticas7',
  'prevencionriesgo7','bienestarvida7','redessociales7','resolucionconflictos7','autonomiaaprendizaje7',
  'solucionestecnologicas7',
  'vocabularioavanzado7','lecturaintermedia7',
  'comprension8','generosdramaticos8','argumentacionmedios8','gramatica8','ortografia8',
  'enterosracionales8','potenciasraices8','variacionesporcentuales8','algebra8','funciones8','geometria8','transformaciones8','estadisticacombinatoria8',
  'celula8','nutricionsistemas8','electricidad8','calor8','atomotabla8',
  'humanismorenacimiento8','estadomoderno8','conquista8','colonia8','ilustracionrevoluciones8','geografiaregional8',
  'montajedifusion8',
  'armonia8',
  'sistemasjuego8','entrenamiento8',
  'prevencionriesgo8','bienestar8','relacionesinclusion8','participaciondemocratica8','gestionaprendizaje8',
  'analisissoluciones8',
  'funcionesidioma8','lecturaavanzada8',
  'qdcasosrenal','qdcasoshepatico','qdorina','qdliquidos','qdlcr',
  'qdvalorescriticos','qdcontrolcalidad','qdendocrinotumoral','qdgasesarteriales','qdpancreas','qdreactivos',
  'microfundamentos','microantimicrobianos','microsusceptibilidad','microresistencia','microcarbapenemasas','microtaxonomia',
  'microstaphylo','microstrepto','microbacilos','microentero','microbgnnf','microvibrio',
  'comprensionEpjaN1','sinonimosAntonimosEpjaN1','tiposTextoEpjaN1','gramaticaOrtografiaEpjaN1',
  'numerosEpjaN1','unidadesMedidaEpjaN1','operacionesEpjaN1','patronesEpjaN1','perimetroAreaEpjaN1','datosEpjaN1',
  'comprensionEpjaN2','vocabularioContextoEpjaN2','tiposTextoEpjaN2','hechosOpinionesEpjaN2',
  'multiplosFactoresEpjaN2','fraccionesDecimalesEpjaN2','operatoriaEpjaN2','perimetroAreaEpjaN2','volumenEpjaN2','datosPromedioEpjaN2',
  'seresVivosEcosistemasEpjaN2','nutricionEpjaN2','sistemaSolarUniversoEpjaN2','materiaEstadosEpjaN2','mezclasAguaSueloEpjaN2',
  'chileColoniaIndependenciaEpjaN2','chileSigloXIXXXEpjaN2','geografiaChileEpjaN2'];

export const MC_GAMES = {
  vocales:       { title:'Vocales',          gen: genVocalRound,        rounds:10 },
  palabras:      { title:'Palabras',         gen: genPalabraRound,      rounds:10 },
  comprension:   { title:'Comprensión',      gen: genComprensionRound,  rounds:8  },
  contar:        { title:'Contar',           gen: genCountRound,        rounds:10 },
  sumar:         { title:'Sumas fáciles',    gen: genAddRound,          rounds:10 },
  comparar:      { title:'¿Cuál es mayor?',  gen: genCompareRound,      rounds:10 },
  formas:        { title:'Formas',           gen: genFormaRound,        rounds:10 },
  combinaciones: { title:'Combinaciones',    gen: genCombinacionRound,  rounds:10 },
  salta:         { title:'Salta y Cuenta',   gen: genSaltaRound,        rounds:10 },
  multiplicar:   { title:'Multiplicar',      gen: genMultiplicarRound,  rounds:10 },
  seresvivos:    { title:'Seres Vivos',      gen: genSeresVivosRound,   rounds:10 },
  plantas:       { title:'Plantas',          gen: genPlantasRound,      rounds:10 },
  micuerpo:      { title:'Mi Cuerpo',        gen: genCuerpoRound,       rounds:10 },
  materiales:    { title:'Materiales',       gen: genMaterialesRound,   rounds:10 },
  dianoche:      { title:'Día y Noche',      gen: genDiaNocheRound,     rounds:10 },
  calendario:    { title:'Calendario',       gen: genCalendarioRound,   rounds:10 },
  miidentidad:   { title:'Mi Identidad',     gen: genMiIdentidadRound,  rounds:10 },
  simbolos:      { title:'Símbolos de Chile',gen: genSimbolosRound,     rounds:10 },
  mapas:         { title:'Mapas de Chile',   gen: genMapasRound,        rounds:10 },
  comunidad:     { title:'Convivencia y Comunidad', gen: genComunidadRound, rounds:10 },
  colores:       { title:'Colores',          gen: genColoresRound,      rounds:10 },
  lineastexturas:{ title:'Líneas y Texturas',gen: genLineasTexturasRound, rounds:10 },
  materialesarte:{ title:'Materiales de Arte',gen: genMaterialesArteRound, rounds:10 },
  sonidos:       { title:'Sonidos',          gen: genSonidosRound,      rounds:10 },
  instrumentos:  { title:'Instrumentos',     gen: genInstrumentosRound, rounds:10 },
  movimiento:    { title:'Cuerpo en Movimiento', gen: genMovimientoRound, rounds:10 },
  vidaactiva:    { title:'Vida Activa y Saludable', gen: genVidaActivaRound, rounds:10 },
  seguridad:     { title:'Juego Limpio y Seguridad', gen: genSeguridadRound, rounds:10 },
  emociones:     { title:'Mis Emociones',    gen: genEmocionesRound,    rounds:10 },
  autocuidado:   { title:'Autocuidado y Hábitos', gen: genAutocuidadoRound, rounds:10 },
  convivencia:   { title:'Buena Convivencia',gen: genConvivenciaRound,  rounds:10 },
  herramientastec:{ title:'Herramientas y Materiales', gen: genHerramientasTecRound, rounds:10 },
  patrones:      { title:'Patrones',         gen: genPatronesRound,     rounds:8 },
  clasificar:    { title:'Clasificar',       gen: genClasificarRound,   rounds:8 },
  posicion:      { title:'¿Dónde está?',     gen: genPosicionRound,     rounds:8 },
  cuantificadores:{ title:'Más, Menos o Igual', gen: genCuantificadoresRound, rounds:8 },
  secuenciatemporal:{ title:'Antes y Después', gen: genSecuenciaTemporalRound, rounds:8 },
  contarveinte:  { title:'Contar hasta 20',  gen: genContarVeinteRound, rounds:8 },
  sumarquitar:   { title:'Sumar y Quitar',   gen: genSumarQuitarRound,  rounds:8 },
  formascuerpos: { title:'Formas y Cuerpos', gen: genFormasCuerposRound, rounds:8 },
  medir:         { title:'Medir',            gen: genMedirRound,        rounds:8 },
  silabasnt:     { title:'Sílabas y Sonidos', gen: genSilabasNTRound,    rounds:8 },
  escucharnt:    { title:'Escuchar y Comprender', gen: genEscucharNTRound, rounds:8 },
  vocabnt:       { title:'Vocabulario en Contexto', gen: genVocabNTRound, rounds:8 },
  letrasnt:      { title:'Letras y Sonidos', gen: genLetrasNTRound,      rounds:8 },
  apreciarnt:    { title:'Aprecia y Compara', gen: genApreciarNTRound,   rounds:8 },
  comparaformasnt:{ title:'Compara Formas',  gen: genCompararFormasNTRound, rounds:8 },
  lineasdisenont: { title:'Líneas y Diseño', gen: genLineasDisenoNTRound, rounds:8 },
  emocionesnt:   { title:'Reconoce Emociones', gen: genEmocionesNTRound, rounds:8 },
  autocuidadont: { title:'Autocuidado y Hábitos', gen: genAutocuidadoNTRound, rounds:8 },
  alimentosnt:   { title:'Alimentos y Sellos', gen: genAlimentosNTRound, rounds:8 },
  resolucionnt:  { title:'Resolución Pacífica', gen: genResolucionNTRound, rounds:8 },
  normasnt:      { title:'Normas de Convivencia', gen: genNormasNTRound, rounds:8 },
  seguridadnt:   { title:'Seguridad y Cuidado', gen: genSeguridadNTRound, rounds:8 },
  ubicacionespacialnt: { title:'Ubicación Espacial', gen: genUbicacionEspacialNTRound, rounds:8 },
  cuandoocurrent: { title:'¿Cuándo Ocurre?', gen: genAntesDespuesNTRound, rounds:8 },
  movimientont:  { title:'Movimientos del Cuerpo', gen: genMovimientoNTRound, rounds:8 },
  aguasolnt:     { title:'Agua y Sol',        gen: genAguaSolNTRound,    rounds:8 },
  materialesnaturalnt: { title:'Materiales de la Naturaleza', gen: genMaterialesNaturalNTRound, rounds:8 },
  animalesplantasnt: { title:'Animales y Plantas', gen: genAnimalesPlantasNTRound, rounds:8 },
  ciclosnt:      { title:'Ciclos de Crecimiento', gen: genCiclosNTRound, rounds:8 },
  ambientent:    { title:'Cuidado del Ambiente', gen: genAmbienteNTRound, rounds:8 },
  rolescomunidadnt: { title:'Roles de mi Comunidad', gen: genRolesComunidadNTRound, rounds:8 },
  objetostecnt:  { title:'Objetos Tecnológicos', gen: genObjetosTecNTRound, rounds:8 },
  institucionesnt: { title:'Instituciones de mi Comunidad', gen: genInstitucionesNTRound, rounds:8 },
  seguridadprevnt: { title:'Seguridad y Prevención', gen: genSeguridadPrevNTRound, rounds:8 },
  gramatica2:    { title:'Gramática',         gen: genGramatica2Round,   rounds:10 },
  comprension2:  { title:'Comprensión II',    gen: genComprension2Round, rounds:8 },
  geometria2:    { title:'Geometría',         gen: genGeometria2Round,   rounds:10 },
  medicion2:     { title:'Medición',          gen: genMedicion2Round,    rounds:10 },
  vertebrados2:  { title:'Vertebrados e Invertebrados', gen: genVertebrados2Round, rounds:10 },
  ciclosvida2:   { title:'Ciclos de Vida',    gen: genCiclosVida2Round,  rounds:8 },
  habitats2:     { title:'Hábitats y Cuidado Animal', gen: genHabitats2Round, rounds:10 },
  cuerpodentro2: { title:'Mi Cuerpo por Dentro', gen: genCuerpoDentro2Round, rounds:10 },
  agua2:         { title:'El Agua',           gen: genAgua2Round,        rounds:10 },
  clima2:        { title:'Clima e Instrumentos', gen: genClima2Round,    rounds:10 },
  pueblos2:      { title:'Pueblos Originarios', gen: genPueblos2Round,   rounds:8 },
  patrimonio2:   { title:'Patrimonio de Chile', gen: genPatrimonio2Round, rounds:8 },
  paisajes2:     { title:'Paisajes de Chile', gen: genPaisajes2Round,    rounds:8 },
  ciudadania2:   { title:'Formación Ciudadana', gen: genCiudadania2Round, rounds:8 },
  lineascolores2:{ title:'Líneas y Colores',  gen: genLineasColores2Round, rounds:10 },
  timbrepulso2:  { title:'Timbre y Pulso',    gen: genTimbrePulso2Round, rounds:8 },
  cuerporesponde2:{ title:'Mi Cuerpo Responde', gen: genCuerpoResponde2Round, rounds:10 },
  vidaactiva2:   { title:'Vida Activa y Saludable II', gen: genVidaActiva2Round, rounds:10 },
  liderazgo2:    { title:'Juego en Equipo y Liderazgo', gen: genLiderazgo2Round, rounds:10 },
  emociones2:    { title:'Mis Emociones II',  gen: genEmociones2Round,   rounds:8 },
  autocuidado2:  { title:'Autocuidado y Hábitos II', gen: genAutocuidado2Round, rounds:10 },
  habitosescolares2:{ title:'Hábitos de Trabajo Escolar', gen: genHabitosEscolares2Round, rounds:10 },
  convivencia2:  { title:'Buena Convivencia II', gen: genConvivencia2Round, rounds:8 },
  tecdigital2:   { title:'Tecnología Digital', gen: genTecDigital2Round,  rounds:8 },
  generosliterarios3: { title:'Géneros Literarios', gen: genGenerosLiterarios3Round, rounds:8 },
  comprension3:  { title:'Comprensión III',   gen: genComprension3Round, rounds:8 },
  vocabulario3:  { title:'Vocabulario en Contexto', gen: genVocabulario3Round, rounds:8 },
  alfabetico3:   { title:'Orden Alfabético',  gen: genAlfabetico3Round,  rounds:8 },
  gramatica3:    { title:'Gramática III',     gen: genGramatica3Round,   rounds:8 },
  ortografia3:   { title:'Ortografía',        gen: genOrtografia3Round,  rounds:8 },
  numeros3:      { title:'Números hasta 1000', gen: genNumeros3Round,    rounds:8 },
  operaciones3:  { title:'Sumar, Restar y Dinero', gen: genOperaciones3Round, rounds:8 },
  multiplicar3:  { title:'Tablas de Multiplicar', gen: genMultiplicar3Round, rounds:8 },
  dividir3:      { title:'Dividir',           gen: genDividir3Round,     rounds:8 },
  fracciones3:   { title:'Fracciones',        gen: genFracciones3Round,  rounds:8 },
  patrones3:     { title:'Patrones y Ecuaciones', gen: genPatrones3Round, rounds:8 },
  geometria3:    { title:'Geometría III',     gen: genGeometria3Round,   rounds:8 },
  medicion3:     { title:'Medición III',      gen: genMedicion3Round,    rounds:8 },
  datos3:        { title:'Datos y Gráficos',  gen: genDatos3Round,       rounds:8 },
  plantas3:      { title:'Plantas: Partes y Especies de Chile', gen: genPlantas3Round, rounds:8 },
  cicloplanta3:  { title:'Ciclo de Vida de la Planta', gen: genCicloPlanta3Round, rounds:8 },
  cuidadoambiente3: { title:'Cuidado de Plantas y Ambiente', gen: genCuidadoAmbiente3Round, rounds:8 },
  alimentacion3: { title:'Alimentación e Higiene', gen: genAlimentacion3Round, rounds:8 },
  luz3:          { title:'La Luz',            gen: genLuz3Round,         rounds:8 },
  sonido3:       { title:'El Sonido',         gen: genSonido3Round,      rounds:8 },
  sistemasolar3: { title:'Sistema Solar',     gen: genSistemaSolar3Round, rounds:8 },
  civilizaciones3: { title:'Grecia y Roma',   gen: genCivilizaciones3Round, rounds:8 },
  geografia3:    { title:'Geografía del Mundo', gen: genGeografia3Round, rounds:8 },
  ciudadania3:   { title:'Formación Ciudadana III', gen: genCiudadania3Round, rounds:8 },
  colorexpresivo3: { title:'Color Expresivo', gen: genColorExpresivo3Round, rounds:8 },
  materialesarte3: { title:'Materiales de Modelado y Reciclaje', gen: genMaterialesArte3Round, rounds:8 },
  lenguajemusical3: { title:'Lenguaje Musical', gen: genLenguajeMusical3Round, rounds:8 },
  musicasociedad3: { title:'Música en la Sociedad', gen: genMusicaSociedad3Round, rounds:8 },
  vidaactiva3:   { title:'Vida Activa y Saludable III', gen: genVidaActiva3Round, rounds:8 },
  seguridad3:    { title:'Juego Limpio y Seguridad III', gen: genSeguridad3Round, rounds:8 },
  manejoemocional3: { title:'Manejo Emocional', gen: genManejoEmocional3Round, rounds:8 },
  autocuidado3:  { title:'Autocuidado III',   gen: genAutocuidado3Round, rounds:8 },
  buentrato3:    { title:'Buen Trato y Resolución de Conflictos', gen: genBuenTrato3Round, rounds:8 },
  habitosestudio3: { title:'Hábitos de Trabajo Escolar', gen: genHabitosEstudio3Round, rounds:8 },
  tecdigital3:   { title:'Tecnología Digital III', gen: genTecDigital3Round, rounds:8 },
  comprension4:  { title:'Comprensión IV',    gen: genComprension4Round, rounds:8 },
  vocabulario4:  { title:'Vocabulario en Contexto II', gen: genVocabulario4Round, rounds:8 },
  gramatica4:    { title:'Gramática IV',      gen: genGramatica4Round,   rounds:8 },
  ortografia4:   { title:'Ortografía II',     gen: genOrtografia4Round,  rounds:8 },
  numeros4:      { title:'Números hasta 10 000', gen: genNumeros4Round, rounds:8 },
  operaciones4:  { title:'Sumar, Restar y Dinero II', gen: genOperaciones4Round, rounds:8 },
  multiplicardividir4: { title:'Multiplicar y Dividir', gen: genMultiplicarDividir4Round, rounds:8 },
  fracciones4:   { title:'Fracciones II',     gen: genFracciones4Round,  rounds:8 },
  decimales4:    { title:'Decimales',         gen: genDecimales4Round,   rounds:8 },
  patrones4:     { title:'Patrones y Ecuaciones II', gen: genPatrones4Round, rounds:8 },
  geometria4:    { title:'Geometría IV',      gen: genGeometria4Round,   rounds:8 },
  medicion4:     { title:'Medición IV',       gen: genMedicion4Round,    rounds:8 },
  datos4:        { title:'Datos y Probabilidades', gen: genDatos4Round,  rounds:8 },
  ecosistemas4:  { title:'Ecosistemas',       gen: genEcosistemas4Round, rounds:8 },
  cuerpohumano4: { title:'Cuerpo Humano IV',  gen: genCuerpoHumano4Round, rounds:8 },
  materia4:      { title:'La Materia',        gen: genMateria4Round,     rounds:8 },
  fuerzas4:      { title:'Las Fuerzas',       gen: genFuerzas4Round,     rounds:8 },
  tierra4:       { title:'La Tierra',         gen: genTierra4Round,      rounds:8 },
  civilizacionesamericanas4: { title:'Civilizaciones Americanas', gen: genCivilizacionesAmericanas4Round, rounds:8 },
  geografiaamerica4: { title:'Geografía de América', gen: genGeografiaAmerica4Round, rounds:8 },
  ciudadania4:   { title:'Formación Ciudadana IV', gen: genCiudadania4Round, rounds:8 },
  lenguajevisual4: { title:'Lenguaje Visual II', gen: genLenguajeVisual4Round, rounds:8 },
  dinamicatempo4: { title:'Dinámica y Tempo', gen: genDinamicaTempo4Round, rounds:8 },
  condicionfisica4: { title:'Condición Física y Pulso', gen: genCondicionFisica4Round, rounds:8 },
  seguridad4:    { title:'Seguridad y Juego Limpio IV', gen: genSeguridad4Round, rounds:8 },
  manejoemocional4: { title:'Manejo Emocional II', gen: genManejoEmocional4Round, rounds:8 },
  autocuidado4:  { title:'Autocuidado IV',    gen: genAutocuidado4Round, rounds:8 },
  buentrato4:    { title:'Buen Trato y Resolución de Conflictos II', gen: genBuenTrato4Round, rounds:8 },
  habitosestudio4: { title:'Hábitos de Trabajo Escolar II', gen: genHabitosEstudio4Round, rounds:8 },
  tecdigital4:   { title:'Tecnología Digital IV', gen: genTecDigital4Round, rounds:8 },
  comprension5:  { title:'Comprensión V',     gen: genComprension5Round, rounds:8 },
  recursospoeticos5: { title:'Recursos Poéticos', gen: genRecursosPoeticos5Round, rounds:8 },
  vocabulario5:  { title:'Vocabulario y Sinónimos V', gen: genVocabulario5Round, rounds:8 },
  gramatica5:    { title:'Gramática V',       gen: genGramatica5Round, rounds:8 },
  ortografia5:   { title:'Ortografía III',    gen: genOrtografia5Round, rounds:8 },
  numeros5:      { title:'Números Grandes',   gen: genNumeros5Round,   rounds:8 },
  multiplicar5:  { title:'Multiplicar',       gen: genMultiplicar5Round, rounds:8 },
  dividir5:      { title:'Dividir',           gen: genDividir5Round,   rounds:8 },
  operaciones5:  { title:'Operaciones y Dinero', gen: genOperaciones5Round, rounds:8 },
  fracciones5:   { title:'Fracciones III',    gen: genFracciones5Round, rounds:8 },
  decimales5:    { title:'Decimales II',      gen: genDecimales5Round, rounds:8 },
  patrones5:     { title:'Patrones y Ecuaciones III', gen: genPatrones5Round, rounds:8 },
  geometria5:    { title:'Geometría V',       gen: genGeometria5Round, rounds:8 },
  medicion5:     { title:'Medición y Área',   gen: genMedicion5Round,  rounds:8 },
  datos5:        { title:'Datos y Probabilidades III', gen: genDatos5Round, rounds:8 },
  celulasistemas5: { title:'Célula y Sistemas del Cuerpo', gen: genCelulaSistemas5Round, rounds:8 },
  alimentacionsalud5: { title:'Alimentación y Salud', gen: genAlimentacionSalud5Round, rounds:8 },
  electricidad5: { title:'Electricidad',      gen: genElectricidad5Round, rounds:8 },
  aguatierra5:   { title:'Agua en la Tierra', gen: genAguaTierra5Round, rounds:8 },
  conquista5:    { title:'Descubrimiento y Conquista de América', gen: genConquista5Round, rounds:8 },
  colonia5:      { title:'La Colonia en Chile', gen: genColonia5Round, rounds:8 },
  geografiachile5: { title:'Geografía de Chile', gen: genGeografiaChile5Round, rounds:8 },
  ciudadania5:   { title:'Formación Ciudadana V', gen: genCiudadania5Round, rounds:8 },
  lenguajevisual5: { title:'Lenguaje Visual III', gen: genLenguajeVisual5Round, rounds:8 },
  texturamusical5: { title:'Texturas y Estructura Musical', gen: genTexturaMusical5Round, rounds:8 },
  vidapostura5:  { title:'Vida Activa y Postura V', gen: genVidaPostura5Round, rounds:8 },
  liderazgo5:    { title:'Liderazgo y Seguridad V', gen: genLiderazgo5Round, rounds:8 },
  manejoemocional5: { title:'Manejo Emocional V', gen: genManejoEmocional5Round, rounds:8 },
  autocuidadodigital5: { title:'Autocuidado Digital V', gen: genAutocuidadoDigital5Round, rounds:8 },
  prevencionsaludable5: { title:'Prevención y Vida Saludable', gen: genPrevencionSaludable5Round, rounds:8 },
  buentrato5:    { title:'Buen Trato y Resolución de Conflictos V', gen: genBuenTrato5Round, rounds:8 },
  habitosestudio5: { title:'Hábitos de Trabajo Escolar V', gen: genHabitosEstudio5Round, rounds:8 },
  tecdigital5:   { title:'Tecnología Digital V', gen: genTecDigital5Round, rounds:8 },
  vocabularioingles5: { title:'Vocabulario Básico', gen: genVocabularioIngles5Round, rounds:8 },
  lecturasimple5: { title:'Lectura Simple',   gen: genLecturaSimple5Round, rounds:8 },
  comprension6:  { title:'Comprensión VI',    gen: genComprension6Round, rounds:8 },
  recursospoeticos6: { title:'Recursos Poéticos II', gen: genRecursosPoeticos6Round, rounds:8 },
  vocabulario6:  { title:'Vocabulario VI',    gen: genVocabulario6Round, rounds:8 },
  gramatica6:    { title:'Gramática VI',      gen: genGramatica6Round, rounds:8 },
  ortografia6:   { title:'Ortografía IV',     gen: genOrtografia6Round, rounds:8 },
  multiplosfactores6: { title:'Múltiplos y Factores', gen: genMultiplosFactores6Round, rounds:8 },
  operatoria6:   { title:'Operatoria Combinada', gen: genOperatoria6Round, rounds:8 },
  razonesporcentajes6: { title:'Razones y Porcentajes', gen: genRazonesPorcentajes6Round, rounds:8 },
  fraccionesmixtas6: { title:'Fracciones y Números Mixtos', gen: genFraccionesMixtas6Round, rounds:8 },
  decimales6:    { title:'Decimales III',     gen: genDecimales6Round, rounds:8 },
  patronesecuaciones6: { title:'Patrones, Tablas y Ecuaciones', gen: genPatronesEcuaciones6Round, rounds:8 },
  triangulosteselados6: { title:'Triángulos y Teselados', gen: genTriangulosTeselados6Round, rounds:8 },
  angulos6:      { title:'Ángulos VI',        gen: genAngulos6Round, rounds:8 },
  areavolumen6:  { title:'Área y Volumen',    gen: genAreaVolumen6Round, rounds:8 },
  datos6:        { title:'Datos y Probabilidades IV', gen: genDatos6Round, rounds:8 },
  fotosintesiscadenas6: { title:'Fotosíntesis y Cadenas Alimentarias', gen: genFotosintesisCadenas6Round, rounds:8 },
  reproductorpubertad6: { title:'Sistema Reproductor y Pubertad', gen: genReproductorPubertad6Round, rounds:8 },
  habitossaludables6: { title:'Hábitos Saludables y Prevención', gen: genHabitosSaludables6Round, rounds:8 },
  energiatransformaciones6: { title:'Energía y sus Transformaciones', gen: genEnergiaTransformaciones6Round, rounds:8 },
  calortemperatura6: { title:'Calor, Temperatura y Estados de la Materia', gen: genCalorTemperatura6Round, rounds:8 },
  tierrasueloerosion6: { title:'La Tierra: Capas, Suelo y Erosión', gen: genTierraSueloErosion6Round, rounds:8 },
  independencia6: { title:'Independencia de Chile', gen: genIndependencia6Round, rounds:8 },
  republica6:    { title:'La República en el Siglo XIX', gen: genRepublica6Round, rounds:8 },
  salitre6:      { title:'Salitre y Expansión Territorial', gen: genSalitre6Round, rounds:8 },
  sigloxx6:      { title:'Chile en el Siglo XX', gen: genSigloxx6Round, rounds:8 },
  geografiachile6: { title:'Geografía de Chile VI', gen: genGeografiaChile6Round, rounds:8 },
  ciudadania6:   { title:'Formación Ciudadana VI', gen: genCiudadania6Round, rounds:8 },
  lenguajevisual6: { title:'Lenguaje Visual IV', gen: genLenguajeVisual6Round, rounds:8 },
  melodiavariaciones6: { title:'Melodía: Diseños y Variaciones', gen: genMelodiaVariaciones6Round, rounds:8 },
  vidapostura6:  { title:'Vida Activa y Postura VI', gen: genVidaPostura6Round, rounds:8 },
  liderazgo6:    { title:'Liderazgo y Seguridad VI', gen: genLiderazgo6Round, rounds:8 },
  manejoemocional6: { title:'Manejo Emocional VI', gen: genManejoEmocional6Round, rounds:8 },
  autocuidadodigital6: { title:'Autocuidado Digital VI', gen: genAutocuidadoDigital6Round, rounds:8 },
  prevencion6:   { title:'Prevención VI',      gen: genPrevencion6Round, rounds:8 },
  buentrato6:    { title:'Buen Trato y Resolución de Conflictos VI', gen: genBuenTrato6Round, rounds:8 },
  habitosestudio6: { title:'Hábitos de Trabajo Escolar VI', gen: genHabitosEstudio6Round, rounds:8 },
  tecdigital6:   { title:'Tecnología Digital VI', gen: genTecDigital6Round, rounds:8 },
  vocabularioingles6: { title:'Vocabulario Intermedio', gen: genVocabularioIngles6Round, rounds:8 },
  lecturasimple6: { title:'Lectura Simple II', gen: genLecturaSimple6Round, rounds:8 },
  comprension7: { title:'Comprensión VII', gen: genComprension7Round, rounds:8 },
  rimametrica7: { title:'Rima y Métrica', gen: genRimaMetrica7Round, rounds:8 },
  pensamientocritico7: { title:'Pensamiento Crítico: Hechos y Opiniones', gen: genPensamientoCritico7Round, rounds:8 },
  vocabulariogramatica7: { title:'Vocabulario y Gramática VII', gen: genVocabularioGramatica7Round, rounds:8 },
  ortografia7: { title:'Ortografía V', gen: genOrtografia7Round, rounds:8 },
  enteros7: { title:'Números Enteros', gen: genEnteros7Round, rounds:8 },
  fraccionesdecimales7: { title:'Fracciones y Decimales II', gen: genFraccionesDecimales7Round, rounds:8 },
  porcentajepotencias7: { title:'Porcentaje y Potencias', gen: genPorcentajePotencias7Round, rounds:8 },
  algebra7: { title:'Álgebra I', gen: genAlgebra7Round, rounds:8 },
  proporcionesecuaciones7: { title:'Proporciones y Ecuaciones II', gen: genProporcionesEcuaciones7Round, rounds:8 },
  geometria7: { title:'Geometría VII', gen: genGeometria7Round, rounds:8 },
  estadisticamuestreo7: { title:'Estadística y Muestreo', gen: genEstadisticaMuestreo7Round, rounds:8 },
  probabilidades7: { title:'Probabilidades II', gen: genProbabilidades7Round, rounds:8 },
  sexualidadreproduccion7: { title:'Sexualidad y Reproducción', gen: genSexualidadReproduccion7Round, rounds:8 },
  inmunologicomicroorganismos7: { title:'Sistema Inmunológico y Microorganismos', gen: genInmunologicoMicroorganismos7Round, rounds:8 },
  fuerzaspresion7: { title:'Fuerzas y Presión', gen: genFuerzasPresion7Round, rounds:8 },
  geologiaclima7: { title:'Geología y Clima', gen: genGeologiaClima7Round, rounds:8 },
  materiagases7: { title:'La Materia y los Gases', gen: genMateriaGases7Round, rounds:8 },
  prehistoriacivilizaciones7: { title:'Prehistoria y Primeras Civilizaciones', gen: genPrehistoriaCivilizaciones7Round, rounds:8 },
  greciaroma7: { title:'Grecia y Roma: Sociedad y Política', gen: genGreciaRoma7Round, rounds:8 },
  edadmedia7: { title:'Edad Media', gen: genEdadMedia7Round, rounds:8 },
  civilizacionesamericanas7: { title:'Civilizaciones Americanas II', gen: genCivilizacionesAmericanas7Round, rounds:8 },
  ciudadania7: { title:'Formación Ciudadana VII', gen: genCiudadania7Round, rounds:8 },
  geografiamedioambiente7: { title:'Geografía y Medioambiente', gen: genGeografiaMedioambiente7Round, rounds:8 },
  espaciosdifusion7: { title:'Espacios de Difusión del Arte', gen: genEspaciosDifusion7Round, rounds:8 },
  procedimientoscompositivos7: { title:'Procedimientos Compositivos', gen: genProcedimientosCompositivos7Round, rounds:8 },
  estrategiastacticas7: { title:'Estrategias y Tácticas Deportivas', gen: genEstrategiasTacticas7Round, rounds:8 },
  prevencionriesgo7: { title:'Prevención de Conductas de Riesgo', gen: genPrevencionRiesgo7Round, rounds:8 },
  bienestarvida7: { title:'Bienestar y Vida Saludable', gen: genBienestarVida7Round, rounds:8 },
  redessociales7: { title:'Relaciones Saludables en Redes Sociales', gen: genRedesSociales7Round, rounds:8 },
  resolucionconflictos7: { title:'Resolución de Conflictos VII', gen: genResolucionConflictos7Round, rounds:8 },
  autonomiaaprendizaje7: { title:'Autonomía en el Aprendizaje', gen: genAutonomiaAprendizaje7Round, rounds:8 },
  solucionestecnologicas7: { title:'Soluciones Tecnológicas y su Impacto', gen: genSolucionesTecnologicas7Round, rounds:8 },
  vocabularioavanzado7: { title:'Vocabulario Avanzado', gen: genVocabularioAvanzado7Round, rounds:8 },
  lecturaintermedia7: { title:'Lectura Intermedia', gen: genLecturaIntermedia7Round, rounds:8 },
  comprension8: { title:'Comprensión VIII', gen: genComprension8Round, rounds:8 },
  generosdramaticos8: { title:'Géneros Dramáticos y Épicos', gen: genGenerosDramaticos8Round, rounds:8 },
  argumentacionmedios8: { title:'Textos Argumentativos y Medios', gen: genArgumentacionMedios8Round, rounds:8 },
  gramatica8: { title:'Gramática VIII', gen: genGramatica8Round, rounds:8 },
  ortografia8: { title:'Ortografía VI', gen: genOrtografia8Round, rounds:8 },
  enterosracionales8: { title:'Enteros y Racionales', gen: genEnterosRacionales8Round, rounds:8 },
  potenciasraices8: { title:'Potencias y Raíces', gen: genPotenciasRaices8Round, rounds:8 },
  variacionesporcentuales8: { title:'Variaciones Porcentuales', gen: genVariacionesPorcentuales8Round, rounds:8 },
  algebra8: { title:'Álgebra y Ecuaciones VIII', gen: genAlgebra8Round, rounds:8 },
  funciones8: { title:'Funciones', gen: genFunciones8Round, rounds:8 },
  geometria8: { title:'Geometría VIII: Pitágoras y Volumen', gen: genGeometria8Round, rounds:8 },
  transformaciones8: { title:'Transformaciones Geométricas', gen: genTransformaciones8Round, rounds:8 },
  estadisticacombinatoria8: { title:'Estadística y Combinatoria', gen: genEstadisticaCombinatoria8Round, rounds:8 },
  celula8: { title:'La Célula VIII', gen: genCelula8Round, rounds:8 },
  nutricionsistemas8: { title:'Nutrición y Sistemas del Cuerpo', gen: genNutricionSistemas8Round, rounds:8 },
  electricidad8: { title:'Electricidad II', gen: genElectricidad8Round, rounds:8 },
  calor8: { title:'Calor y Transferencia', gen: genCalor8Round, rounds:8 },
  atomotabla8: { title:'El Átomo y la Tabla Periódica', gen: genAtomoTabla8Round, rounds:8 },
  humanismorenacimiento8: { title:'Humanismo y Renacimiento', gen: genHumanismoRenacimiento8Round, rounds:8 },
  estadomoderno8: { title:'Estado Moderno y Mercantilismo', gen: genEstadoModerno8Round, rounds:8 },
  conquista8: { title:'Conquista de América II', gen: genConquista8Round, rounds:8 },
  colonia8: { title:'La Colonia II', gen: genColonia8Round, rounds:8 },
  ilustracionrevoluciones8: { title:'Ilustración y Revoluciones', gen: genIlustracionRevoluciones8Round, rounds:8 },
  geografiaregional8: { title:'Geografía Regional', gen: genGeografiaRegional8Round, rounds:8 },
  montajedifusion8: { title:'Montaje y Difusión del Arte', gen: genMontajeDifusion8Round, rounds:8 },
  armonia8: { title:'Armonía y Acompañamiento', gen: genArmonia8Round, rounds:8 },
  sistemasjuego8: { title:'Sistemas de Juego y Táctica', gen: genSistemasJuego8Round, rounds:8 },
  entrenamiento8: { title:'Principios de Entrenamiento', gen: genEntrenamiento8Round, rounds:8 },
  prevencionriesgo8: { title:'Prevención VIII', gen: genPrevencionRiesgo8Round, rounds:8 },
  bienestar8: { title:'Bienestar y Autocuidado VIII', gen: genBienestar8Round, rounds:8 },
  relacionesinclusion8: { title:'Relaciones e Inclusión', gen: genRelacionesInclusion8Round, rounds:8 },
  participaciondemocratica8: { title:'Participación Democrática', gen: genParticipacionDemocratica8Round, rounds:8 },
  gestionaprendizaje8: { title:'Gestión del Aprendizaje VIII', gen: genGestionAprendizaje8Round, rounds:8 },
  analisissoluciones8: { title:'Análisis de Soluciones Tecnológicas', gen: genAnalisisSoluciones8Round, rounds:8 },
  funcionesidioma8: { title:'Funciones del Idioma VIII', gen: genFuncionesIdioma8Round, rounds:8 },
  lecturaavanzada8: { title:'Lectura Avanzada', gen: genLecturaAvanzada8Round, rounds:8 },
  qdcasosrenal: { title:'Casos Clínicos: Función Renal', gen: genCasosRenal7Round, rounds:8 },
  qdcasoshepatico: { title:'Casos Clínicos: Función Hepática', gen: genCasosHepatico7Round, rounds:6 },
  qdorina: { title:'Análisis de Orina y Sedimento', gen: genOrina7Round, rounds:8 },
  qdliquidos: { title:'Líquidos Biológicos: Transudado vs Exudado', gen: genLiquidos7Round, rounds:8 },
  qdlcr: { title:'LCR y Diagnóstico de Meningitis', gen: genLcr7Round, rounds:8 },
  qdvalorescriticos: { title:'Valores Críticos y de Alerta', gen: genValoresCriticos7Round, rounds:8 },
  qdcontrolcalidad: { title:'Control de Calidad y Estadística Dx', gen: genControlCalidad7Round, rounds:8 },
  qdendocrinotumoral: { title:'Endocrinología y Marcadores Tumorales', gen: genEndocrinoTumoral7Round, rounds:8 },
  qdgasesarteriales: { title:'Gases Arteriales y Equilibrio Ácido-Base', gen: genGasesArteriales7Round, rounds:8 },
  qdpancreas: { title:'Páncreas: Enzimas y Pancreatitis', gen: genPancreas7Round, rounds:8 },
  qdreactivos: { title:'Bioquímica de Reactivos e Insertos', gen: genReactivos7Round, rounds:8 },
  microfundamentos: { title:'Fundamentos Bacterianos', gen: genFundamentos7Round, rounds:8 },
  microantimicrobianos: { title:'Antimicrobianos: Mecanismo y Clasificación', gen: genAntimicrobianos7Round, rounds:8 },
  microsusceptibilidad: { title:'Estudios de Susceptibilidad', gen: genSusceptibilidad7Round, rounds:7 },
  microresistencia: { title:'Mecanismos de Resistencia', gen: genResistencia7Round, rounds:8 },
  microcarbapenemasas: { title:'Carbapenemasas y Detección', gen: genCarbapenemasas7Round, rounds:7 },
  microtaxonomia: { title:'Taxonomía y Medios de Cultivo', gen: genTaxonomia7Round, rounds:8 },
  microstaphylo: { title:'Staphylococcus', gen: genStaphylo7Round, rounds:7 },
  microstrepto: { title:'Streptococcus y Enterococcus', gen: genStrepto7Round, rounds:8 },
  microbacilos: { title:'Bacilos Gram Positivos', gen: genBacilos7Round, rounds:7 },
  microentero: { title:'Enterobacterales', gen: genEntero7Round, rounds:8 },
  microbgnnf: { title:'Bacilos Gram Negativos No Fermentadores', gen: genBgnnf7Round, rounds:7 },
  microvibrio: { title:'Vibrionaceae, Campylobacter y Helicobacter', gen: genVibrio7Round, rounds:7 },
  comprensionEpjaN1:          { title:'Comprensión de Lectura',      gen: genComprensionEpjaN1Round,          rounds:8  },
  sinonimosAntonimosEpjaN1:   { title:'Sinónimos y Antónimos',       gen: genSinonimosAntonimosEpjaN1Round,   rounds:10 },
  tiposTextoEpjaN1:           { title:'Tipos de Textos',             gen: genTiposTextoEpjaN1Round,           rounds:8  },
  gramaticaOrtografiaEpjaN1:  { title:'Gramática y Ortografía',      gen: genGramaticaOrtografiaEpjaN1Round,  rounds:8  },
  numerosEpjaN1:              { title:'Números Naturales',          gen: genNumerosEpjaN1Round,              rounds:10 },
  unidadesMedidaEpjaN1:       { title:'Unidades de Medida',         gen: genUnidadesMedidaEpjaN1Round,        rounds:8  },
  operacionesEpjaN1:          { title:'Operaciones y Problemas',    gen: genOperacionesEpjaN1Round,           rounds:10 },
  patronesEpjaN1:             { title:'Patrones y Secuencias',      gen: genPatronesEpjaN1Round,              rounds:10 },
  perimetroAreaEpjaN1:        { title:'Perímetro y Área',           gen: genPerimetroAreaEpjaN1Round,         rounds:8  },
  datosEpjaN1:                { title:'Datos y Gráficos',           gen: genDatosEpjaN1Round,                 rounds:8  },
  comprensionEpjaN2:          { title:'Comprensión de Lectura',      gen: genComprensionEpjaN2Round,          rounds:8  },
  vocabularioContextoEpjaN2:  { title:'Vocabulario en Contexto',     gen: genVocabularioContextoEpjaN2Round,  rounds:8  },
  tiposTextoEpjaN2:           { title:'Tipos de Texto y Noticia',    gen: genTiposTextoEpjaN2Round,           rounds:8  },
  hechosOpinionesEpjaN2:      { title:'Hechos y Opiniones',          gen: genHechosOpinionesEpjaN2Round,      rounds:8  },
  multiplosFactoresEpjaN2:    { title:'Múltiplos y Factores',        gen: genMultiplosFactoresEpjaN2Round,    rounds:10 },
  fraccionesDecimalesEpjaN2:  { title:'Fracciones y Decimales',      gen: genFraccionesDecimalesEpjaN2Round,  rounds:10 },
  operatoriaEpjaN2:           { title:'Operatoria y Problemas',      gen: genOperatoriaEpjaN2Round,           rounds:10 },
  perimetroAreaEpjaN2:        { title:'Perímetro y Área',            gen: genPerimetroAreaEpjaN2Round,        rounds:8  },
  volumenEpjaN2:              { title:'Volumen de Prismas',          gen: genVolumenEpjaN2Round,              rounds:8  },
  datosPromedioEpjaN2:        { title:'Datos y Promedio',            gen: genDatosPromedioEpjaN2Round,        rounds:8  },
  seresVivosEcosistemasEpjaN2:{ title:'Seres Vivos y Ecosistemas',   gen: genSeresVivosEcosistemasEpjaN2Round,rounds:8  },
  nutricionEpjaN2:            { title:'Nutrición y Sistema Digestivo',gen: genNutricionEpjaN2Round,           rounds:8  },
  sistemaSolarUniversoEpjaN2: { title:'Sistema Solar y Universo',    gen: genSistemaSolarUniversoEpjaN2Round, rounds:8  },
  materiaEstadosEpjaN2:       { title:'Materiales y Estados de la Materia', gen: genMateriaEstadosEpjaN2Round, rounds:8  },
  mezclasAguaSueloEpjaN2:     { title:'Mezclas, Agua y Suelo',       gen: genMezclasAguaSueloEpjaN2Round,     rounds:8  },
  chileColoniaIndependenciaEpjaN2: { title:'Colonia e Independencia', gen: genChileColoniaIndependenciaEpjaN2Round, rounds:8 },
  chileSigloXIXXXEpjaN2:      { title:'Chile: Siglo XIX y XX',       gen: genChileSigloXIXXXEpjaN2Round,      rounds:8  },
  geografiaChileEpjaN2:       { title:'Geografía de Chile',          gen: genGeografiaChileEpjaN2Round,       rounds:8  },
};

/* ---------------- Motor de juegos de opción múltiple ---------------- */
let mc = null;

export function renderMCScreen(){
  return '<div class="screen" id="mc-screen"></div>';
}

export function initMCGame(key){
  const cfg = MC_GAMES[key];
  mc = { key: key, cfg: cfg, round: 0, correct: 0, streak: 0, total: cfg.rounds, current: null, seenPrompts: new Set() };
  drawMCRound();
}

function roundSignature(r){
  return r.promptHTML + '|' + r.options.map(function(o){ return o.label; }).slice().sort().join(',');
}

function drawMCRound(){
  const el = document.getElementById('mc-screen');
  if(!el) return;
  if(mc.round >= mc.total){ finishMC(); return; }
  /* 300 intentos (antes 60): con bancos cuyo tamaño coincide exactamente
     con `rounds` (sin margen — el patrón más común en la app), 60 intentos
     dejaba una probabilidad residual pequeña pero real (hasta ~0.2% por
     partida, confirmado simulando miles de sesiones) de que la última
     ronda repitiera una pregunta ya vista. Con 300 intentos esa
     probabilidad es estadísticamente nula, sin tener que agrandar cada
     banco de contenido para ganar margen. */
  let r, sig, attempts = 0;
  do{
    r = mc.cfg.gen();
    sig = roundSignature(r);
    attempts++;
  }while(mc.seenPrompts.has(sig) && attempts < 300);
  mc.seenPrompts.add(sig);
  mc.current = r;
  /* Pedido explícito del usuario (2026-07-31): unificar el formato de TODAS
     las alternativas de la app a una sola columna apilada hacia abajo (el
     estilo `panel`), eliminando la grilla de varias columnas (`wordopt`)
     que antes se usaba para respuestas cortas (días, vocales, colores). El
     usuario detectó que la app se sentía "no uniforme" al mezclar ambos
     estilos incluso dentro del mismo curso (ver capturas de "Calendario"
     vs "Símbolos de Chile", 1° básico) — ahora `cols`/`kind`/`panel` en el
     objeto que retorna cada `genXxxRound()` ya no afectan el layout (se
     dejan en el contenido por compatibilidad histórica, pero el motor los
     ignora a propósito). */
  const optClass = 'option-btn panel';
  const gridClass = 'option-grid panels';

  const hasActions = r.speakText || r.recurso;
  el.innerHTML =
    '<p class="section-title">'+mc.cfg.title+'</p>'+
    '<div class="game-progress">'+
      '<div class="progress-track"><div class="progress-fill" style="width:'+((mc.round/mc.total)*100)+'%"></div></div>'+
      '<div class="progress-num">'+(mc.round+1)+'/'+mc.total+'</div>'+
      (mc.streak>=2 ? '<div class="streak-chip">🔥 '+mc.streak+'</div>' : '')+
    '</div>'+
    '<div class="prompt-card">'+
      r.promptHTML+
      (hasActions ? '<div class="prompt-actions">'+
        (r.speakText ? '<button class="speak-btn" onclick="speak(\''+r.speakText+'\''+(r.speakLang?',\''+r.speakLang+'\'':'')+')">🔊 Escuchar</button>' : '')+
        (r.recurso ? '<button class="recurso-btn" onclick="showMCRecurso()">📚 Recurso</button>' : '')+
      '</div>' : '')+
    '</div>'+
    '<div class="'+gridClass+'" id="mcoptions">'+
      r.options.map(function(o,i){ return '<button class="'+optClass+'" data-i="'+i+'" onclick="answerMC('+i+')">'+o.label+'</button>'; }).join('')+
    '</div>';
}

/* Botón "Recurso": micro-lección conceptual del tema evaluado en la ronda
   actual (no una pista de la respuesta). No pausa ni afecta el juego — el
   niño puede abrirlo y cerrarlo libremente en cualquier momento de la ronda. */
export function showMCRecurso(){
  if(!mc || !mc.current || !mc.current.recurso) return;
  showRecurso(mc.current.recurso, mc.cfg.title);
}

export function answerMC(i){
  const r = mc.current;
  const picked = r.options[i];
  const btns = document.querySelectorAll('#mcoptions button');
  btns.forEach(function(b){ b.onclick = null; });
  const correctIdx = r.options.findIndex(function(o){ return o.value === r.correctValue; });
  const correctBtn = btns[correctIdx];
  const pickedBtn = btns[i];

  if(picked.value === r.correctValue){
    pickedBtn.classList.add('correct');
    mc.correct++;
    mc.streak++;
    sfxCorrect();
    const bonus = mc.streak>=6 ? 8 : (mc.streak>=3 ? 4 : 0);
    awardXP(8+bonus);
    if(mc.streak>=3 && mc.streak%3===0) sfxStreak();
    mc.round++;
    setTimeout(drawMCRound, 950);
  }else{
    pickedBtn.classList.add('wrong');
    if(correctBtn) correctBtn.classList.add('correct');
    mc.streak = 0;
    sfxWrong();
    mc.round++;
    const explainText = r.explain || ('La respuesta correcta era <b>'+(correctBtn ? correctBtn.textContent : '')+'</b>.');
    setTimeout(function(){ showExplain(explainText, drawMCRound); }, 700);
  }
}

export function finishMC(){
  showResult(mc.key, mc.correct, mc.total, false);
}

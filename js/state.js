import { GRADES, PARVULARIA_NIVELES, EPJA_NIVELES, MEDIO_GRADES } from './content/grades.js';
import { render } from './render.js';
import { sfxLevelup } from './audio.js';
import { saveProgress } from './persistence.js';

export const state = {
  xp: 0,
  currentGrade: 1,
  currentNivel: 'nt',
  currentEpjaNivel: 'n1basica',
  currentMedioGrade: 1,
  userName: '',
  stars: { vocales:0, silabas:0, memorama:0, palabras:0, comprension:0, contar:0, sumar:0, comparar:0, formas:0, examenmate1:0, examenlengua1:0, examenciencias1:0, examenhistoria1:0, examenartes1:0, examenmusica1:0, examenedfisica1:0,
           combinaciones:0, secuencia:0, salta:0, multiplicar:0,
           seresvivos:0, plantas:0, micuerpo:0, materiales:0, dianoche:0,
           calendario:0, miidentidad:0, simbolos:0, mapas:0, comunidad:0,
           colores:0, lineastexturas:0, materialesarte:0,
           sonidos:0, instrumentos:0,
           movimiento:0, vidaactiva:0, seguridad:0,
           emociones:0, autocuidado:0, convivencia:0,
           herramientastec:0,
           patrones:0, clasificar:0, posicion:0, cuantificadores:0, secuenciatemporal:0,
           contarveinte:0, sumarquitar:0, formascuerpos:0, medir:0,
           escribenombre:0, caligrafia:0, silabasnt:0, escucharnt:0, vocabnt:0, letrasnt:0,
           apreciarnt:0, comparaformasnt:0, lineasdisenont:0,
           emocionesnt:0, autocuidadont:0, alimentosnt:0,
           resolucionnt:0, normasnt:0, seguridadnt:0,
           ubicacionespacialnt:0, cuandoocurrent:0, movimientont:0,
           aguasolnt:0, materialesnaturalnt:0, animalesplantasnt:0, ciclosnt:0, ambientent:0,
           rolescomunidadnt:0, objetostecnt:0, institucionesnt:0, seguridadprevnt:0,
           gramatica2:0, comprension2:0, geometria2:0, medicion2:0,
           vertebrados2:0, ciclosvida2:0, habitats2:0, cuerpodentro2:0, agua2:0, clima2:0,
           pueblos2:0, patrimonio2:0, paisajes2:0, ciudadania2:0,
           lineascolores2:0, timbrepulso2:0,
           cuerporesponde2:0, vidaactiva2:0, liderazgo2:0,
           emociones2:0, autocuidado2:0, habitosescolares2:0, convivencia2:0,
           tecdigital2:0,
           generosliterarios3:0, comprension3:0, vocabulario3:0, alfabetico3:0, gramatica3:0, ortografia3:0,
           numeros3:0, operaciones3:0, multiplicar3:0, dividir3:0, fracciones3:0, patrones3:0, geometria3:0, medicion3:0, datos3:0,
           plantas3:0, cicloplanta3:0, cuidadoambiente3:0, alimentacion3:0, luz3:0, sonido3:0, sistemasolar3:0,
           civilizaciones3:0, geografia3:0, ciudadania3:0,
           colorexpresivo3:0, materialesarte3:0,
           lenguajemusical3:0, musicasociedad3:0,
           vidaactiva3:0, seguridad3:0,
           manejoemocional3:0, autocuidado3:0, buentrato3:0, habitosestudio3:0,
           tecdigital3:0,
           comprension4:0, vocabulario4:0, gramatica4:0, ortografia4:0,
           numeros4:0, operaciones4:0, multiplicardividir4:0, fracciones4:0, decimales4:0, patrones4:0, geometria4:0, medicion4:0, datos4:0,
           ecosistemas4:0, cuerpohumano4:0, materia4:0, fuerzas4:0, tierra4:0,
           civilizacionesamericanas4:0, geografiaamerica4:0, ciudadania4:0,
           lenguajevisual4:0,
           dinamicatempo4:0,
           condicionfisica4:0, seguridad4:0,
           manejoemocional4:0, autocuidado4:0, buentrato4:0, habitosestudio4:0,
           tecdigital4:0,
           comprension5:0, recursospoeticos5:0, vocabulario5:0, gramatica5:0, ortografia5:0,
           numeros5:0, multiplicar5:0, dividir5:0, operaciones5:0, fracciones5:0, decimales5:0, patrones5:0, geometria5:0, medicion5:0, datos5:0,
           celulasistemas5:0, alimentacionsalud5:0, electricidad5:0, aguatierra5:0,
           conquista5:0, colonia5:0, geografiachile5:0, ciudadania5:0,
           lenguajevisual5:0,
           texturamusical5:0,
           vidapostura5:0, liderazgo5:0,
           manejoemocional5:0, autocuidadodigital5:0, prevencionsaludable5:0, buentrato5:0, habitosestudio5:0,
           tecdigital5:0,
           vocabularioingles5:0, lecturasimple5:0,
           comprension6:0, recursospoeticos6:0, vocabulario6:0, gramatica6:0, ortografia6:0,
           multiplosfactores6:0, operatoria6:0, razonesporcentajes6:0, fraccionesmixtas6:0, decimales6:0, patronesecuaciones6:0, triangulosteselados6:0, angulos6:0, areavolumen6:0, datos6:0,
           fotosintesiscadenas6:0, reproductorpubertad6:0, habitossaludables6:0, energiatransformaciones6:0, calortemperatura6:0, tierrasueloerosion6:0,
           independencia6:0, republica6:0, salitre6:0, sigloxx6:0, geografiachile6:0, ciudadania6:0,
           lenguajevisual6:0,
           melodiavariaciones6:0,
           vidapostura6:0, liderazgo6:0,
           manejoemocional6:0, autocuidadodigital6:0, prevencion6:0, buentrato6:0, habitosestudio6:0,
           tecdigital6:0,
           vocabularioingles6:0, lecturasimple6:0,
           comprension7:0, rimametrica7:0, pensamientocritico7:0, vocabulariogramatica7:0, ortografia7:0,
           enteros7:0, fraccionesdecimales7:0, porcentajepotencias7:0, algebra7:0, proporcionesecuaciones7:0, geometria7:0, estadisticamuestreo7:0, probabilidades7:0,
           sexualidadreproduccion7:0, inmunologicomicroorganismos7:0, fuerzaspresion7:0, geologiaclima7:0, materiagases7:0,
           prehistoriacivilizaciones7:0, greciaroma7:0, edadmedia7:0, civilizacionesamericanas7:0, ciudadania7:0, geografiamedioambiente7:0,
           espaciosdifusion7:0,
           procedimientoscompositivos7:0,
           estrategiastacticas7:0,
           prevencionriesgo7:0, bienestarvida7:0, redessociales7:0, resolucionconflictos7:0, autonomiaaprendizaje7:0,
           solucionestecnologicas7:0,
           vocabularioavanzado7:0, lecturaintermedia7:0,
           comprension8:0, generosdramaticos8:0, argumentacionmedios8:0, gramatica8:0, ortografia8:0,
           enterosracionales8:0, potenciasraices8:0, variacionesporcentuales8:0, algebra8:0, funciones8:0, geometria8:0, transformaciones8:0, estadisticacombinatoria8:0,
           celula8:0, nutricionsistemas8:0, electricidad8:0, calor8:0, atomotabla8:0,
           humanismorenacimiento8:0, estadomoderno8:0, conquista8:0, colonia8:0, ilustracionrevoluciones8:0, geografiaregional8:0,
           montajedifusion8:0,
           armonia8:0,
           sistemasjuego8:0, entrenamiento8:0,
           prevencionriesgo8:0, bienestar8:0, relacionesinclusion8:0, participaciondemocratica8:0, gestionaprendizaje8:0,
           analisissoluciones8:0,
           funcionesidioma8:0, lecturaavanzada8:0,
           qdcasosrenal:0, qdcasoshepatico:0, qdorina:0, qdliquidos:0, qdlcr:0,
           qdvalorescriticos:0, qdcontrolcalidad:0, qdendocrinotumoral:0, qdgasesarteriales:0, qdpancreas:0, qdreactivos:0,
           microfundamentos:0, microantimicrobianos:0, microsusceptibilidad:0, microresistencia:0, microcarbapenemasas:0,
           microtaxonomia:0, microstaphylo:0, microstrepto:0, microbacilos:0, microentero:0, microbgnnf:0, microvibrio:0,
           comprensionEpjaN1:0, sinonimosAntonimosEpjaN1:0, tiposTextoEpjaN1:0, gramaticaOrtografiaEpjaN1:0,
           numerosEpjaN1:0, unidadesMedidaEpjaN1:0, operacionesEpjaN1:0, patronesEpjaN1:0, perimetroAreaEpjaN1:0, datosEpjaN1:0,
           comprensionEpjaN2:0, vocabularioContextoEpjaN2:0, tiposTextoEpjaN2:0, hechosOpinionesEpjaN2:0,
           multiplosFactoresEpjaN2:0, fraccionesDecimalesEpjaN2:0, operatoriaEpjaN2:0, perimetroAreaEpjaN2:0, volumenEpjaN2:0, datosPromedioEpjaN2:0,
           seresVivosEcosistemasEpjaN2:0, nutricionEpjaN2:0, sistemaSolarUniversoEpjaN2:0, materiaEstadosEpjaN2:0, mezclasAguaSueloEpjaN2:0,
           chileColoniaIndependenciaEpjaN2:0, chileSigloXIXXXEpjaN2:0, geografiaChileEpjaN2:0,
           comprensionEpjaN3:0, vocabularioContextoEpjaN3:0, tiposTextoEpjaN3:0, hechosOpinionesEpjaN3:0,
           numerosEnterosEpjaN3:0, potenciasNotacionEpjaN3:0, razonesProporcionesEpjaN3:0, pitagorasCircunferenciaEpjaN3:0, angulosTriangulosEpjaN3:0, estadisticaEpjaN3:0,
           modeloCineticoEpjaN3:0, atomosReaccionesEpjaN3:0, energiaTransformacionesEpjaN3:0, origenVidaGeneticaEpjaN3:0, reproduccionSexualidadEpjaN3:0, sistemaInmuneEnfermedadesEpjaN3:0,
           historiaEconomiaMundialEpjaN3:0, trabajoChileEpjaN3:0, democraciaDerechosEpjaN3:0,
           comprensionEpjaM1:0, vocabularioContextoEpjaM1:0, textosExpositivosEpjaM1:0, hechosOpinionesEpjaM1:0,
           numerosRacionalesEpjaM1:0, potenciasIrracionalesEpjaM1:0, proporcionalidadEpjaM1:0, algebraEpjaM1:0, funcionesEcuacionesEpjaM1:0, geometriaSemejanzaEpjaM1:0, transformacionesMedicionEpjaM1:0, estadisticaProbabilidadEpjaM1:0,
           celulaMetabolismoEpjaM1:0, sistemasNutricionEpjaM1:0, ecosistemasBiodiversidadEpjaM1:0, movimientoOndasOpticaEpjaM1:0, energiaCalorEpjaM1:0, disolucionesReaccionesEpjaM1:0,
           coloniaIndependenciaEpjaM1:0, sigloXIXTerritorioEpjaM1:0, sigloXXDemocraciaEpjaM1:0, ciudadaniaDerechosEpjaM1:0,
           gramaticaContextoEpjaM1:0, vocabularioFuncionalEpjaM1:0, comprensionInglesEpjaM1:0,
           comprensionEpjaM2:0, vocabularioContextoEpjaM2:0, textoArgumentativoEpjaM2:0, hechosOpinionesEpjaM2:0,
           raicesCuadradasEpjaM2:0, funcionesExpLogEpjaM2:0, funcionCuadraticaEpjaM2:0, trigonometriaEpjaM2:0, estadisticaMuestrasEpjaM2:0, probabilidadEpjaM2:0,
           homeostasisSistemasEpjaM2:0, sistemaInmuneGeneticaEpjaM2:0, fluidosPresionEpjaM2:0, electricidadMagnetismoEpjaM2:0, evolucionAtomoEpjaM2:0, enlacesRadiactividadEpjaM2:0, organicaPolimerosEpjaM2:0,
           sigloXXBipolaridadEpjaM2:0, globalizacionEconomiaEpjaM2:0, problemasGlobalesEpjaM2:0, poblacionTerritorioEpjaM2:0,
           gramaticaContextoEpjaM2:0, vocabularioTecnicoEpjaM2:0, comprensionInglesEpjaM2:0,
           numerospotenciasm1:0, productosnotablesm1:0, sistemasecuacionesm1:0, funcioneslinealesm1:0, geometriam1:0, homoteciatalesm1:0, estadisticaprobabilidadm1:0,
           narrativam1:0, poesiam1:0, dramaromanticismom1:0, argumentativomediosm1:0, ortografiam1:0,
           ideasrepublicanasm1:0, estadonacionm1:0, imperialismoguerram1:0, republicachilem1:0, salitreparlamentarismom1:0, geografiapueblosm1:0, economiaciudadaniam1:0,
           evolucionm1:0, ecosistemaspoblacionesm1:0, ciclosimpactom1:0, ondassonidom1:0, luzsentidosm1:0, sistemasolarm1:0, reaccionesquimicasm1:0, compuestosestequiometriam1:0,
           gramaticacontextom1:0, vocabulariocontextom1:0, comprensionlecturam1:0,
           estrategiastacticasm1:0, entrenamientom1:0, vidaactivaseguridadm1:0,
           evoluciontecnologicam1:0,
           difusionm1:0,
           musicaidentidadm1:0,
           prevencionriesgosm1:0, bienestarvidam1:0, relacionesredesm1:0, resolucionconflictosm1:0,
           numerosrealesm2:0, potenciaslogaritmosm2:0, funcioncuadraticam2:0, funcioninversam2:0, interescompuestom2:0, esferam2:0, trigonometriam2:0, estadisticaprobabilidadm2:0,
           narrativam2:0, poesiam2:0, teatrosigloorom2:0, cuentolatinoamericanom2:0, argumentativomediosm2:0, ortografiam2:0,
           nerviosohormonalm2:0, sexualidadreproducccionm2:0, geneticaherenciam2:0, manipulaciongeneticam2:0, movimientofuerzasm2:0, energiachoquesm2:0, universogravitacionm2:0, disolucionesorganicam2:0,
           entreguerrasm2:0, crisisliberalismom2:0, segundaguerram2:0, republicachilem2:0, guerrafriam2:0, movilizacionchilem2:0, dictaduratransicionm2:0, formacionciudadanam2:0,
           gramaticacontextom2:0, vocabulariocontextom2:0, comprensionlecturam2:0,
           tacticasdisenom2:0, entrenamientocaloricom2:0,
           implementaciondifusionm2:0,
           contrastemediosm2:0,
           escenariostecnologicosm2:0,
           riesgosredesapoyom2:0, bienestarrelacionesm2:0, proyeccionacademicam2:0,
           numeroscomplejospg3:0, estadisticadispersionpg3:0, funcionesexplogpg3:0, geometriacircunferenciapg3:0,
           matfinancierapg4:0, binomialnormalpg4:0, funcionespotenciatrigpg4:0, rectascircunferenciaspg4:0,
           interpretacionliterariapg3:0, analisiscriticopg3:0,
           comparacionobraspg4:0, evaluacioncriticapg4:0,
           democraciaciudadaniapg3:0, sistemajudicialddhhpg3:0, estadomercadoterritoriopg3:0,
           institucionalidaddemocraticapg4:0, modelosdesarrollopg4:0, libertadigualdadpg4:0, mediosciudadaniadigitalpg4:0,
           quefilosofiapg3:0, ontologiapg3:0, epistemologiapg3:0, logicaargumentacionpg3:0,
           eticateoriaspg4:0, argumentosfalaciaspg4:0, filosofiacontemporaneapg4:0,
           ambientesostenibilidadpg:0, bienestarsaludpg:0, seguridadautocuidadopg:0, tecnologiasociedadpg:0,
           vocabgramaticapg3:0, comprensionlecturapg3:0,
           vocabavanzadopg4:0, comprensionlecturaavanzadapg4:0,
           estructuracelularpd:0, dogmacentralpd:0, regulaciongenicapd:0, proteinaspd:0, biotecnologiapd:0,
           biodiversidadevolucionpd:0, serviciosecosistemicospd:0, resilienciaclimaticapd:0, tecnologiaclimapd:0,
           saludpublicapd:0, genomaambientepd:0, estilosvidasaludpd:0, calidadambientalsaludpd:0, tecnologiamedicapd:0,
           fisicaclimapd:0, origenuniversopd:0, fuerzascentralespd:0, fisicamodernapd:0, fluidoselectromagnetismopd:0,
           nanoquimicapolimerospd:0, acidobaseredoxpd:0, termodinamicacineticapd:0, quimicaclimapd:0, contaminantesquimicospd:0, tecnologiasquimicasclimapd:0,
           alconoceletras:0, alletrainicial:0, alprimerasilabas:0, alunesilabas:0, alleepalabra:0 },
  badges: new Set(),
};
export const screenStack = ['home'];

export function currentScreen(){ return screenStack[screenStack.length-1]; }
export function goTo(screen){ screenStack.push(screen); render(); }
export function goBack(){ if(screenStack.length>1){ screenStack.pop(); render(); } }
export function selectGrade(id){ state.currentGrade = id; saveProgress(); goTo('subjectMap'); }
export function gradeLabel(id){
  const g = GRADES.filter(function(x){ return x.id===id; })[0];
  return g ? g.label : '';
}
export function selectNivel(id){ state.currentNivel = id; saveProgress(); goTo('nucleoMap'); }
export function nivelLabel(id){
  const n = PARVULARIA_NIVELES.filter(function(x){ return x.id===id; })[0];
  return n ? n.label : '';
}
export function selectEpjaNivel(id){ state.currentEpjaNivel = id; saveProgress(); goTo('epjaSubjectMap'); }
export function epjaNivelLabel(id){
  const n = EPJA_NIVELES.filter(function(x){ return x.id===id; })[0];
  return n ? n.label : '';
}
export function selectMedioGrade(id){ state.currentMedioGrade = id; saveProgress(); goTo(id<=2 ? 'medioSubjectMap' : 'planMedioMap'); }
export function medioGradeLabel(id){
  const g = MEDIO_GRADES.filter(function(x){ return x.id===id; })[0];
  return g ? g.label : '';
}

export function level(){ return Math.floor(state.xp/100)+1; }
export function totalStars(){ return Object.values(state.stars).reduce((a,b)=>a+b,0); }
export function maxStars(){ return Object.keys(state.stars).length*3; }

export function awardXP(n){
  const oldLevel = level();
  state.xp += n;
  const newLevel = level();
  if(newLevel>oldLevel){
    sfxLevelup();
    const who = state.userName ? ', ' + state.userName : '';
    showToast('⚡ ¡Subiste a Nivel ' + newLevel + who + '!');
  }
  saveProgress();
}

export function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> t.classList.remove('show'), 2200);
}

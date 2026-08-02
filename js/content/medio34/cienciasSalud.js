import { pick, shuffle } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan Diferenciado Científico: Ciencias de la Salud ----------------
   Fuente real: Decreto 614/2013, Plan de Formación Diferenciada Humanista-Científico,
   área Ciencias, asignatura Ciencias de la Salud (curriculumnacional.cl). Sus 5 OA
   son compartidos entre 3° y 4° medio (código "CN-CSAL-3y4-OAC-01" a "05",
   verificado en ambas páginas) — un solo MODULES/POS sin sufijo de año. Los 5 OA
   tienen contenido conceptual verificable, ninguno queda fuera del motor de
   opción múltiple.

   OAC01 menciona explícitamente "infecciones de transmisión sexual" como una de
   varias categorías de problemas de salud pública (junto con consumo de drogas,
   desequilibrios alimentarios, enfermedades laborales) — se trata con el mismo
   criterio clínico/factual/preventivo ya establecido en el resto de la app para
   este tipo de contenido (ver `genSexualidadReproduccion7Round` en
   content/ciencias.js), sin detalle gráfico y en un marco de epidemiología
   poblacional (no de educación sexual individual), por lo que no fue necesario
   replantear la política al usuario. Mismo formato `genDefRound()` del resto
   del Plan Diferenciado. */

export const CIENCIAS_SALUD_MODULES = [
  {id:'saludpublicapd', label:'Salud Pública: Problemas Complejos', open:true, key:'saludpublicapd'},
  {id:'genomaambientepd', label:'Genoma y Ambiente en la Salud', open:true, key:'genomaambientepd'},
  {id:'estilosvidasaludpd', label:'Estilos de Vida y Salud Integral', open:true, key:'estilosvidasaludpd'},
  {id:'calidadambientalsaludpd', label:'Calidad Ambiental y Salud Humana', open:true, key:'calidadambientalsaludpd'},
  {id:'tecnologiamedicapd', label:'Tecnología Médica y Calidad de Vida', open:true, key:'tecnologiamedicapd'},
];
export const CIENCIAS_SALUD_POS = [ {x:26,y:90},{x:70,y:68},{x:26,y:46},{x:70,y:24},{x:30,y:4} ];

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

/* ---------------- Salud Pública: Problemas Complejos (OAC-01) ---------------- */
const RECURSO_SALUD_PUBLICA_PD = 'La <b>salud pública</b> estudia y protege la salud de poblaciones completas, no solo de personas individuales. Herramientas como la <b>epidemiología</b> permiten entender cómo se distribuyen problemas complejos: la <b>cadena de transmisión</b> de una infección, los efectos de un <b>desequilibrio alimentario</b>, el riesgo de una <b>enfermedad profesional</b>, o la propagación de una <b>enfermedad de transmisión sexual</b> —todas abordables con <b>prevención</b> efectiva. Detrás de cada uno de estos problemas también actúan los <b>determinantes sociales de la salud</b>: factores como la vivienda, la educación o el ingreso económico que influyen en qué tan sana puede ser la vida de una persona.';
const SALUD_PUBLICA_BANK_PD = [
  {termino:'Salud pública', definicion:'El campo que estudia y busca proteger la salud de una población completa, más allá de la salud individual.'},
  {termino:'Enfermedad profesional', definicion:'Una enfermedad causada directamente por las condiciones del trabajo que realiza una persona.'},
  {termino:'Desequilibrio alimentario', definicion:'Una alimentación que no cubre de forma adecuada las necesidades nutricionales del cuerpo, ya sea por exceso o por déficit.'},
  {termino:'Cadena de transmisión de una infección', definicion:'El conjunto de elementos (agente, huésped, vía de contagio) necesarios para que una infección se propague de una persona a otra.'},
  {termino:'Prevención en salud', definicion:'El conjunto de medidas destinadas a evitar la aparición de una enfermedad antes de que ocurra.'},
  {termino:'Enfermedad de transmisión sexual', definicion:'Una infección que se transmite principalmente a través del contacto sexual, y que se previene con información y medidas de autocuidado.'},
  {termino:'Epidemiología', definicion:'La disciplina que estudia cómo se distribuyen y qué factores determinan las enfermedades dentro de una población.'},
  {termino:'Determinante social de la salud', definicion:'Un factor social, económico o ambiental, como la vivienda o la educación, que influye en la salud de las personas.'},
];
export function genSaludPublicaPDRound(){ return genDefRound(SALUD_PUBLICA_BANK_PD, RECURSO_SALUD_PUBLICA_PD); }

/* ---------------- Genoma y Ambiente en la Salud (OAC-02) ---------------- */
const RECURSO_GENOMA_AMBIENTE_PD = 'La mayoría de las condiciones de salud no dependen solo de los genes ni solo del ambiente, sino de su interacción: una <b>enfermedad multifactorial</b> combina ambos, y la <b>epigenética</b> estudia cómo el ambiente puede activar o desactivar genes sin cambiar el ADN mismo. Una <b>predisposición genética</b> no es una certeza, sino una mayor probabilidad; herramientas como el <b>test genético predictivo</b> y la <b>consejería genética</b> ayudan a las personas a entender ese riesgo. El <b>exposoma</b> —todo lo que una persona respira, come y toca a lo largo de su vida— también deja una huella medible en su salud.';
const GENOMA_AMBIENTE_BANK_PD = [
  {termino:'Enfermedad genética', definicion:'Una condición de salud causada, total o parcialmente, por una alteración en el material genético de una persona.'},
  {termino:'Predisposición genética', definicion:'Una mayor probabilidad de desarrollar una enfermedad debido a la información genética heredada, sin que sea una certeza.'},
  {termino:'Epigenética', definicion:'El estudio de cómo el ambiente puede activar o desactivar genes sin cambiar la secuencia del ADN.'},
  {termino:'Enfermedad multifactorial', definicion:'Una enfermedad que resulta de la combinación de factores genéticos y ambientales, no de una sola causa.'},
  {termino:'Consejería genética', definicion:'Un proceso de orientación profesional para personas con riesgo de enfermedades hereditarias en su familia.'},
  {termino:'Exposoma', definicion:'El conjunto de exposiciones ambientales que una persona experimenta a lo largo de su vida y que pueden afectar su salud.'},
  {termino:'Herencia poligénica', definicion:'Un rasgo o enfermedad influenciada por la combinación de muchos genes distintos, no por uno solo.'},
  {termino:'Test genético predictivo', definicion:'Un examen que analiza el ADN de una persona para estimar su riesgo futuro de desarrollar ciertas enfermedades.'},
];
export function genGenomaAmbientePDRound(){ return genDefRound(GENOMA_AMBIENTE_BANK_PD, RECURSO_GENOMA_AMBIENTE_PD); }

/* ---------------- Estilos de Vida y Salud Integral (OAC-03) ---------------- */
const RECURSO_ESTILOS_VIDA_PD = 'Los estilos de vida afectan directamente procesos biológicos medibles. El <b>metabolismo basal</b> y la <b>energética celular</b> se ven afectados por el <b>sedentarismo</b>, mientras que el <b>estrés crónico</b> puede alterar el sistema inmune, cardiovascular y mental. El <b>ritmo circadiano</b> regula el sueño y otras funciones del cuerpo, y verse alterado repetidamente tiene consecuencias reales. Un <b>hábito saludable</b> sostenido en el tiempo protege tanto la <b>salud mental</b> como la física, mientras que una <b>conducta de riesgo</b> —como fumar o el consumo excesivo de alcohol— aumenta la probabilidad de sufrir un daño evitable.';
const ESTILOS_VIDA_BANK_PD = [
  {termino:'Metabolismo basal', definicion:'La cantidad mínima de energía que el cuerpo necesita para mantener sus funciones vitales en reposo.'},
  {termino:'Sedentarismo', definicion:'Un estilo de vida con poca o ninguna actividad física regular, asociado a mayor riesgo de enfermedades crónicas.'},
  {termino:'Estrés crónico', definicion:'Un estado de tensión sostenida en el tiempo que puede afectar negativamente al sistema inmune, cardiovascular y mental.'},
  {termino:'Ritmo circadiano', definicion:'El ciclo biológico de aproximadamente 24 horas que regula funciones como el sueño, la vigilia y la temperatura corporal.'},
  {termino:'Salud mental', definicion:'El estado de bienestar emocional y psicológico que permite a una persona afrontar el estrés cotidiano y relacionarse con los demás.'},
  {termino:'Energética celular', definicion:'El conjunto de procesos mediante los cuales las células obtienen y utilizan energía para sus funciones.'},
  {termino:'Conducta de riesgo para la salud', definicion:'Una acción o hábito que aumenta la probabilidad de sufrir un daño a la salud, como fumar o el consumo excesivo de alcohol.'},
  {termino:'Hábito saludable', definicion:'Una conducta sostenida en el tiempo que favorece el bienestar físico y mental de una persona.'},
];
export function genEstilosVidaSaludPDRound(){ return genDefRound(ESTILOS_VIDA_BANK_PD, RECURSO_ESTILOS_VIDA_PD); }

/* ---------------- Calidad Ambiental y Salud Humana (OAC-04) ---------------- */
const RECURSO_CALIDAD_AMBIENTAL_PD = 'La calidad del aire, el agua y el suelo tiene un efecto directo y medible sobre la salud. El <b>material particulado</b> en el aire puede causar <b>enfermedades respiratorias</b>, y un <b>índice de calidad del aire</b> permite anticipar ese riesgo día a día. El acceso a <b>agua potable</b> y a un buen <b>saneamiento básico</b> previene enfermedades relacionadas con la falta de higiene ambiental, mientras que la <b>contaminación del suelo</b> puede afectar tanto los cultivos como el agua subterránea. En los casos más graves, se habla de una <b>zona de sacrificio ambiental</b>: un territorio donde la concentración de industrias contaminantes ha dañado gravemente la salud de la población local.';
const CALIDAD_AMBIENTAL_BANK_PD = [
  {termino:'Contaminación del aire', definicion:'La presencia en el aire de sustancias que pueden dañar la salud de las personas y el ambiente.'},
  {termino:'Material particulado', definicion:'Partículas muy pequeñas suspendidas en el aire que pueden ser inhaladas y causar problemas respiratorios.'},
  {termino:'Agua potable', definicion:'Agua que cumple los estándares de calidad necesarios para ser consumida por las personas sin riesgo para la salud.'},
  {termino:'Contaminación del suelo', definicion:'La presencia de sustancias dañinas en el suelo que pueden afectar los cultivos, el agua subterránea y la salud humana.'},
  {termino:'Enfermedad respiratoria por contaminación', definicion:'Una enfermedad de las vías respiratorias causada o agravada por la exposición a contaminantes ambientales.'},
  {termino:'Índice de calidad del aire', definicion:'Una medida que indica qué tan contaminado está el aire en un lugar y momento determinado, y el riesgo asociado para la salud.'},
  {termino:'Saneamiento básico', definicion:'El conjunto de servicios (agua potable, alcantarillado, manejo de residuos) que previenen enfermedades relacionadas con la falta de higiene ambiental.'},
  {termino:'Zona de sacrificio ambiental', definicion:'Un territorio donde la concentración de industrias contaminantes ha afectado gravemente la salud de la población local.'},
];
export function genCalidadAmbientalSaludPDRound(){ return genDefRound(CALIDAD_AMBIENTAL_BANK_PD, RECURSO_CALIDAD_AMBIENTAL_PD); }

/* ---------------- Tecnología Médica y Calidad de Vida (OAC-05) ---------------- */
const RECURSO_TECNOLOGIA_MEDICA_PD = 'Los avances tecnológicos han transformado la medicina moderna: la <b>nanomedicina</b> diagnostica y trata enfermedades a escala nanométrica, la <b>medicina nuclear</b> usa sustancias radiactivas controladas, y técnicas de <b>imagenología</b> como la <b>resonancia magnética</b> permiten observar el interior del cuerpo sin cirugía. La <b>farmacología</b> optimiza cómo actúan los medicamentos, mientras que la <b>medicina personalizada</b> ajusta el tratamiento según las características genéticas de cada paciente. La <b>telemedicina</b> acerca la atención médica a distancia, y una <b>prótesis biónica</b> puede integrarse con el sistema nervioso o muscular de quien la usa.';
const TECNOLOGIA_MEDICA_BANK_PD = [
  {termino:'Nanomedicina', definicion:'El uso de tecnología a escala nanométrica para diagnosticar, tratar o prevenir enfermedades.'},
  {termino:'Medicina nuclear', definicion:'Una especialidad médica que usa sustancias radiactivas en dosis controladas para diagnosticar o tratar enfermedades.'},
  {termino:'Imagenología médica', definicion:'El conjunto de técnicas, como la radiografía, la ecografía o la resonancia magnética, que permiten obtener imágenes del interior del cuerpo.'},
  {termino:'Farmacología', definicion:'La ciencia que estudia cómo los medicamentos actúan en el organismo y cómo se puede optimizar su uso.'},
  {termino:'Telemedicina', definicion:'La atención médica a distancia mediante tecnologías de comunicación, sin que el paciente y el profesional estén en el mismo lugar.'},
  {termino:'Prótesis biónica', definicion:'Un dispositivo tecnológico que reemplaza una parte del cuerpo y puede integrarse con el sistema nervioso o muscular del paciente.'},
  {termino:'Medicina personalizada', definicion:'Un enfoque médico que ajusta el tratamiento según las características genéticas y particulares de cada paciente.'},
  {termino:'Resonancia magnética', definicion:'Una técnica de imagenología que utiliza campos magnéticos para observar estructuras internas del cuerpo sin usar radiación.'},
];
export function genTecnologiaMedicaPDRound(){ return genDefRound(TECNOLOGIA_MEDICA_BANK_PD, RECURSO_TECNOLOGIA_MEDICA_PD); }

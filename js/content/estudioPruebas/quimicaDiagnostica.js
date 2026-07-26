import { pick, shuffle } from '../../utils.js';

/* ---------------- Química Diagnóstica — Estudio para Pruebas ----------------
   Módulo de preparación para el examen universitario real de "Química
   Diagnóstica" (carrera de Tecnología Médica, Universidad Central de Chile,
   asignatura 53426, año académico 2026-01). A diferencia del resto de la
   app (que sigue el currículum escolar chileno de Mineduc), este módulo es
   una EXCEPCIÓN explícita pedida por el usuario para preparar un examen
   universitario real de un familiar — el contenido no viene de un OA de
   Mineduc, sino de los apuntes, clases, guías de laboratorio, insertos de
   reactivos y material de estudio real del curso (syllabus 2026-01,
   clases de sensibilidad/especificidad, control de calidad, valores
   críticos, función renal, líquidos biológicos, hormonas, marcadores
   tumorales, gases arteriales, páncreas, y casos clínicos/preguntas ya
   resueltas del propio curso).
   Todo el contenido fue extraído literalmente de esos documentos (nunca
   inventado) por agentes de investigación que leyeron cada PDF completo y
   citaron la fuente exacta de cada hecho; ese proceso de extracción quedó
   documentado en la conversación, no en este archivo. Aquí solo se
   transforma esa extracción en preguntas de opción múltiple, priorizando
   el formato de caso clínico (paciente + datos de laboratorio + pregunta)
   que es el mismo formato de evaluación real del curso (el syllabus
   declara evaluación por "análisis de casos" y "pruebas de selección
   múltiple con contexto", y el examen final es una evaluación oral de
   casos clínicos). */

export const QUIMICA_DIAGNOSTICA_MODULES = [
  { id:'qdcasosrenal', label:'Casos Clínicos: Función Renal', open:true, key:'qdcasosrenal' },
  { id:'qdcasoshepatico', label:'Casos Clínicos: Función Hepática', open:true, key:'qdcasoshepatico' },
  { id:'qdorina', label:'Análisis de Orina y Sedimento', open:true, key:'qdorina' },
  { id:'qdliquidos', label:'Líquidos Biológicos: Transudado vs Exudado', open:true, key:'qdliquidos' },
  { id:'qdlcr', label:'LCR y Diagnóstico de Meningitis', open:true, key:'qdlcr' },
  { id:'qdvalorescriticos', label:'Valores Críticos y de Alerta', open:true, key:'qdvalorescriticos' },
  { id:'qdcontrolcalidad', label:'Control de Calidad y Estadística Dx', open:true, key:'qdcontrolcalidad' },
  { id:'qdendocrinotumoral', label:'Endocrinología y Marcadores Tumorales', open:true, key:'qdendocrinotumoral' },
  { id:'qdgasesarteriales', label:'Gases Arteriales y Equilibrio Ácido-Base', open:true, key:'qdgasesarteriales' },
  { id:'qdpancreas', label:'Páncreas: Enzimas y Pancreatitis', open:true, key:'qdpancreas' },
  { id:'qdreactivos', label:'Bioquímica de Reactivos e Insertos', open:true, key:'qdreactivos' },
];
export const QUIMICA_DIAGNOSTICA_POS = [
  {x:20,y:98},{x:64,y:90},{x:22,y:82},{x:66,y:74},
  {x:20,y:64},{x:64,y:54},{x:22,y:44},{x:66,y:34},
  {x:20,y:22},{x:64,y:12},{x:22,y:2},
];

/* ---------------- Casos Clínicos: Función Renal y ERC ----------------
   Basado en los 3 casos clínicos resueltos del curso (glomerulonefritis
   aguda post-estreptocócica, ERC secundaria a DM2 con hiperparatiroidismo
   secundario) y en la clase/guía de función renal. */
const CASOS_RENAL_BANK = [
  {
    caso:'Paciente masculino de 52 años, constructor, con HTA hace 5 años, consulta por astenia, cefalea, edema en miembros inferiores y orina oscura de 3 días de evolución, tras una faringoamigdalitis no tratada hace 2 semanas. Orina completa: sangre +++, proteínas ++. Sedimento: hematíes 50-100 x campo (6% dismórficos), cilindros hemáticos 1-2 x campo. Creatinina 1.8 mg/dL (VN 0.7-1.2), proteínas totales 7.0 g/dL, albúmina 3.2 g/dL.',
    pregunta:'¿Qué hallazgo del sedimento urinario demuestra de forma inequívoca que el sangrado es de origen glomerular?',
    correcta:'LOS CILINDROS HEMÁTICOS',
    opts:['LOS CRISTALES DE OXALATO DE CALCIO','LOS NITRITOS NEGATIVOS','LA DENSIDAD URINARIA'],
  },
  {
    caso:'Mismo paciente del caso anterior (sospecha de glomerulonefritis aguda post-estreptocócica, tras faringoamigdalitis no tratada).',
    pregunta:'¿Qué examen confirmatorio se debe solicitar para apoyar el diagnóstico de glomerulonefritis aguda post-estreptocócica?',
    correcta:'ANTICUERPOS ANTIESTREPTOLISINA O (ASO) Y COMPLEMENTO SÉRICO (C3)',
    opts:['SOLO UN HEMOGRAMA COMPLETO','SOLO UNA ECOGRAFÍA RENAL','SOLO UN PERFIL HEPÁTICO'],
  },
  {
    caso:'El mismo paciente tiene proteinuria moderada (++) y proteínas totales conservadas (7.0 g/dL, albúmina 3.2 g/dL), a diferencia de un Síndrome Nefrótico típico.',
    pregunta:'¿Qué distingue a este cuadro (Síndrome Nefrítico) de un Síndrome Nefrótico?',
    correcta:'EL SÍNDROME NEFRÓTICO PRODUCE PROTEINURIA MASIVA (&gt;3.5 g/24h) E HIPOALBUMINEMIA MARCADA, A DIFERENCIA DE LA PROTEINURIA MODERADA DE ESTE CASO',
    opts:['EL SÍNDROME NEFRÓTICO SIEMPRE CURSA SIN NINGÚN CAMBIO EN LA ORINA','EL SÍNDROME NEFRÓTICO NUNCA AFECTA LA ALBÚMINA SÉRICA','NO EXISTE NINGUNA DIFERENCIA ENTRE AMBOS SÍNDROMES'],
  },
  {
    caso:'Mecanismo fisiopatológico: en la glomerulonefritis aguda, el depósito de inmunocomplejos ocluye capilares glomerulares, cae la velocidad de filtración glomerular (VFG) y se retiene sodio y agua.',
    pregunta:'¿Qué consecuencia clínica produce directamente esta retención de sodio y agua?',
    correcta:'HIPERVOLEMIA, QUE SE MANIFIESTA COMO EDEMA E HIPERTENSIÓN ARTERIAL',
    opts:['DESHIDRATACIÓN SEVERA E HIPOTENSIÓN','HIPOGLICEMIA AGUDA','ANEMIA HEMOLÍTICA INMEDIATA'],
  },
  {
    caso:'Mujer de 58 años, DM tipo 2 de 15 años de evolución, ERC estadio 5 en diálisis hace 5 años. Consulta por dolor óseo generalizado y debilidad muscular proximal de 8 meses. Laboratorio: calcio sérico 8.0 mg/dL (bajo), fósforo sérico 5.8 mg/dL (elevado), PTH 850 pg/mL (muy elevada), 25-hidroxivitamina D 12 ng/mL (baja).',
    pregunta:'¿Cuál es el diagnóstico que mejor explica este perfil de laboratorio?',
    correcta:'HIPERPARATIROIDISMO SECUNDARIO A ERC (TRASTORNO ÓSEO MINERAL ASOCIADO A LA ERC)',
    opts:['HIPERPARATIROIDISMO PRIMARIO','HIPERTIROIDISMO NO TRATADO','INTOXICACIÓN POR VITAMINA D'],
  },
  {
    caso:'En la misma paciente, la pérdida de función renal disminuye la excreción de fósforo (hiperfosfemia) y reduce la producción de vitamina D activa.',
    pregunta:'¿Qué efecto tiene la combinación de hiperfosfemia y déficit de vitamina D activa sobre el calcio y la PTH?',
    correcta:'GENERA HIPOCALCEMIA, LO QUE ESTIMULA MASIVAMENTE LA SECRECIÓN DE PTH',
    opts:['GENERA HIPERCALCEMIA, LO QUE INHIBE LA PTH POR COMPLETO','NO TIENE NINGÚN EFECTO SOBRE EL CALCIO NI LA PTH','REDUCE LA PTH A NIVELES INDETECTABLES'],
  },
  {
    caso:'La misma paciente toma carbonato de calcio como parte de su tratamiento para la ERC.',
    pregunta:'¿Qué doble propósito cumple el carbonato de calcio en este contexto?',
    correcta:'ACTÚA COMO QUELANTE DE FÓSFORO EN EL INTESTINO Y COMO SUPLEMENTO DE CALCIO',
    opts:['SOLO BAJA LA GLICEMIA','SOLO REDUCE LA PRESIÓN ARTERIAL','SOLO MEJORA LA FUNCIÓN HEPÁTICA'],
  },
  {
    caso:'La paciente tiene una TFG de 19 mL/min/1.73m² pero está en diálisis crónica (Estadio 5D), no solo Estadio 4 como sugeriría ese número aislado.',
    pregunta:'¿Por qué la TFG calculada por fórmulas basadas en creatinina puede perder exactitud diagnóstica en pacientes en diálisis crónica?',
    correcta:'PORQUE LA DIÁLISIS, LA FUNCIÓN RENAL RESIDUAL Y LA SARCOPENIA ALTERAN LA RELACIÓN NORMAL ENTRE CREATININA Y FUNCIÓN RENAL',
    opts:['PORQUE LA CREATININA DEJA DE PRODUCIRSE POR COMPLETO EN DIÁLISIS','PORQUE LA FÓRMULA SOLO SIRVE PARA NIÑOS','PORQUE LA DIÁLISIS AUMENTA ARTIFICIALMENTE LA MASA MUSCULAR'],
  },
  {
    caso:'La albúmina sérica de la paciente es 3.2 g/dL (baja), en el contexto de diálisis crónica.',
    pregunta:'¿Qué indica clínicamente esta hipoalbuminemia en un paciente en diálisis?',
    correcta:'DESNUTRICIÓN CALÓRICO-PROTEICA Y ESTADO INFLAMATORIO CRÓNICO, ASOCIADOS A PEOR PRONÓSTICO',
    opts:['UN ESTADO NUTRICIONAL EXCELENTE','NINGÚN SIGNIFICADO CLÍNICO RELEVANTE','QUE LA DIÁLISIS ESTÁ FUNCIONANDO DE FORMA ÓPTIMA'],
  },
  {
    caso:'Fórmula de clearance de creatinina usada en el curso: Clearance = [Creatinina en orina (mg/dL) × Volumen de orina 24h (mL)] / [Creatinina en suero (mg/dL) × 1440].',
    pregunta:'¿Qué representa el número 1440 en esta fórmula?',
    correcta:'LOS MINUTOS QUE TIENEN 24 HORAS (24 × 60)',
    opts:['LOS MILILITROS PROMEDIO DE ORINA EN 24 HORAS','UN FACTOR DE CONVERSIÓN DE UNIDADES DE CREATININA','LA SUPERFICIE CORPORAL PROMEDIO EN cm²'],
  },
  {
    caso:'Regla clínica del curso: "corregir el calcio medido siempre que la albúmina sea menor a 4,0 g/dL", usando: Calcio corregido = Calcio medido + 0,8 × (4 − albúmina).',
    pregunta:'Un paciente tiene calcio medido 7.6 mg/dL y albúmina 2.8 g/dL. ¿Cuál es su calcio corregido?',
    correcta:'8.6 mg/dL',
    opts:['7.6 mg/dL','9.6 mg/dL','6.6 mg/dL'],
  },
];
export function genCasosRenal7Round(){
  const item = pick(CASOS_RENAL_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Casos Clínicos: Función Hepática y Vías Biliares ----------------
   Basado en el caso clínico de colestasis obstructiva (cristales de
   bilirrubina) resuelto en el material del curso. */
const CASOS_HEPATICO_BANK = [
  {
    caso:'Mujer de 52 años, profesora, con ictericia progresiva, orina oscura y heces hipocólicas hace 4 días, dolor en hipocondrio derecho y prurito. Antecedente de colelitiasis conocida hace 2 años, no intervenida. Orina completa: bilirrubina +++, urobilinógeno disminuido. Sedimento: cristales de bilirrubina abundantes (agujas amarillentas). Bilirrubina total 6.8 mg/dL (VN 0.3-1.2), bilirrubina directa 5.6 mg/dL; fosfatasa alcalina 520 U/L (VN 44-147); GGT 480 U/L (VN &lt;60).',
    pregunta:'¿Por qué la bilirrubina puede aparecer en la orina en este caso?',
    correcta:'PORQUE SOLO LA BILIRRUBINA CONJUGADA (DIRECTA) ES HIDROSOLUBLE Y PUEDE EXCRETARSE POR ORINA',
    opts:['PORQUE TODA LA BILIRRUBINA, CONJUGADA O NO, PASA LIBREMENTE A LA ORINA','PORQUE LA BILIRRUBINA INDIRECTA ES LA ÚNICA QUE SE EXCRETA POR ORINA','LA BILIRRUBINA NUNCA APARECE EN LA ORINA EN NINGÚN CASO'],
  },
  {
    caso:'Misma paciente: bilirrubina total 6.8 mg/dL con bilirrubina directa 5.6 mg/dL predominante, fosfatasa alcalina y GGT muy elevadas.',
    pregunta:'¿Qué patrón bioquímico sugiere este perfil de laboratorio?',
    correcta:'COLESTASIS U OBSTRUCCIÓN BILIAR, CON ELEVACIÓN DE BILIRRUBINA DIRECTA Y DE LAS ENZIMAS CANALICULARES (FA Y GGT)',
    opts:['UN PATRÓN DE DAÑO HEPATOCELULAR PURO SIN COLESTASIS','UNA FUNCIÓN HEPATOBILIAR COMPLETAMENTE NORMAL','ANEMIA HEMOLÍTICA AGUDA SIN COMPROMISO HEPÁTICO'],
  },
  {
    caso:'Misma paciente: el urobilinógeno urinario está disminuido.',
    pregunta:'¿Por qué el urobilinógeno está disminuido en esta obstrucción biliar?',
    correcta:'PORQUE LA BILIRRUBINA NO LLEGA AL INTESTINO PARA TRANSFORMARSE EN UROBILINÓGENO, AL ESTAR OBSTRUIDA LA VÍA BILIAR',
    opts:['PORQUE EL RIÑÓN DESTRUYE TODO EL UROBILINÓGENO ANTES DE FILTRARLO','PORQUE LA PACIENTE NO CONSUME SUFICIENTE AGUA','EL UROBILINÓGENO SIEMPRE ESTÁ DISMINUIDO EN CUALQUIER PATOLOGÍA HEPÁTICA'],
  },
  {
    caso:'La paciente tiene colelitiasis conocida hace 2 años sin intervenir, y ahora presenta el cuadro colestásico descrito.',
    pregunta:'¿Cuál es la causa más probable de la obstrucción biliar en este contexto clínico?',
    correcta:'COLEDOCOLITIASIS SECUNDARIA A LA COLELITIASIS PREVIA',
    opts:['UNA INFECCIÓN VIRAL AGUDA SIN RELACIÓN CON LA VESÍCULA','UNA REACCIÓN ALÉRGICA A LA ATORVASTATINA','UN CUADRO EXCLUSIVAMENTE RENAL SIN COMPROMISO HEPATOBILIAR'],
  },
  {
    caso:'Hallazgo del sedimento urinario en esta paciente: cristales de bilirrubina (agujas amarillentas) y cilindros granulosos pigmentados.',
    pregunta:'¿Qué acción corresponde tomar frente a este hallazgo en el sedimento urinario?',
    correcta:'NOTIFICARLO DE INMEDIATO, YA QUE ES COMPATIBLE CON COLESTASIS OBSTRUCTIVA',
    opts:['IGNORARLO POR SER UN HALLAZGO IRRELEVANTE','ESPERAR AL SIGUIENTE CONTROL DE RUTINA SIN AVISAR A NADIE','REPETIR EL EXAMEN EN UN MES SIN NOTIFICAR NADA POR AHORA'],
  },
  {
    caso:'Regla general de interpretación bioquímica hepática: un aumento aislado y marcado de fosfatasa alcalina (FA) y GGT, con bilirrubina directa predominante.',
    pregunta:'¿Qué tipo de patrón de daño hepático refleja esta combinación?',
    correcta:'UN PATRÓN COLESTÁSICO (OBSTRUCTIVO), NO UN PATRÓN HEPATOCELULAR',
    opts:['UN PATRÓN HEPATOCELULAR PURO (COMO EN UNA HEPATITIS VIRAL AGUDA TÍPICA)','UN PATRÓN EXCLUSIVAMENTE RENAL','UN PATRÓN DE HEMÓLISIS PURA SIN COMPROMISO HEPÁTICO'],
  },
];
export function genCasosHepatico7Round(){
  const item = pick(CASOS_HEPATICO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Análisis de Orina y Sedimento ----------------
   Basado en la clase de Análisis de Orina 2026 y la guía oficial ISP
   "Recomendaciones para el análisis de orina y del sedimento urinario". */
const ORINA_BANK = [
  {
    caso:'Paciente masculino de 37 años, HTA controlada y DM2, consulta por edema generalizado progresivo en piernas y cara, orina espumosa y aumento del volumen urinario en las últimas 2 semanas. Presión arterial 160/95 mmHg. Orina completa: proteínas con color verde-azulado en la tira (compatible con positivo).',
    pregunta:'¿Qué signo clínico del relato ("orina espumosa") se correlaciona directamente con el hallazgo de proteínas positivas en la tira reactiva?',
    correcta:'LA ESPUMA EN LA ORINA ES UN SIGNO CLÁSICO DE PROTEINURIA SIGNIFICATIVA',
    opts:['LA ESPUMA INDICA SIEMPRE UNA INFECCIÓN URINARIA POR BACTERIAS PRODUCTORAS DE GAS','LA ESPUMA SOLO SE RELACIONA CON LA DENSIDAD URINARIA, NUNCA CON PROTEÍNAS','LA ESPUMA ES UN HALLAZGO SIN NINGÚN VALOR CLÍNICO'],
  },
  { pregunta:'¿Qué muestra de orina es el estándar de oro para urocultivo y uroanálisis de rutina?', correcta:'ORINA DE SEGUNDO CHORRO (CHORRO MEDIO)', opts:['ORINA DE PRIMER CHORRO','ORINA POR ASPIRACIÓN SUPRAPÚBICA ÚNICAMENTE','ORINA DE BOLSA RECOLECTORA EN ADULTOS'] },
  { pregunta:'¿Qué muestra de orina es de elección para detectar patógenos uretrales como Chlamydia o Neisseria gonorrhoeae?', correcta:'ORINA DE PRIMER CHORRO', opts:['ORINA DE SEGUNDO CHORRO','ORINA DE 24 HORAS','ORINA POR CATETERISMO'] },
  { pregunta:'Según la guía ISP, ¿en cuánto tiempo debe analizarse la orina si no se puede procesar de inmediato, y bajo qué condición?', correcta:'ANTES DE 24 HORAS PARA EL SEDIMENTO, REFRIGERADA ENTRE 2 Y 8°C', opts:['NUNCA DEBE REFRIGERARSE BAJO NINGUNA CIRCUNSTANCIA','PUEDE ESPERAR HASTA 7 DÍAS SIN REFRIGERAR','DEBE CONGELARSE SIEMPRE A -20°C'] },
  { pregunta:'¿Qué mecanismo químico detecta la tira reactiva de glucosa (método GOD/POD)?', correcta:'GLUCOSA OXIDASA OXIDA LA GLUCOSA GENERANDO PERÓXIDO DE HIDRÓGENO, QUE UN INDICADOR VIRA DE COLOR EN PRESENCIA DE PEROXIDASA', opts:['LA GLUCOSA REACCIONA DIRECTAMENTE CON UNA SAL DE DIAZONIO','LA GLUCOSA PRECIPITA COMO CRISTAL VISIBLE AL MICROSCOPIO','LA GLUCOSA REDUCE EL pH DE LA MUESTRA DE FORMA DIRECTA'] },
  { pregunta:'¿Qué detecta la almohadilla de "esterasa leucocitaria" en la tira reactiva?', correcta:'UNA ENZIMA LIBERADA POR LOS LEUCOCITOS, QUE ACTÚA SOBRE UN ÉSTER DE INDOXILO PRODUCIENDO COLOR VIOLETA', opts:['LA PRESENCIA DIRECTA DE BACTERIAS EN LA MUESTRA','LA HEMOGLOBINA LIBRE DE ERITROCITOS LISADOS','LA CONCENTRACIÓN DE PROTEÍNAS TOTALES'] },
  { pregunta:'¿Qué reacción detecta la prueba de nitritos en la tira reactiva, y qué implica un resultado positivo?', correcta:'DETECTA LA REDUCCIÓN DE NITRATO A NITRITO POR ACCIÓN BACTERIANA (NITRATO REDUCTASA), SUGIRIENDO INFECCIÓN URINARIA', opts:['DETECTA DIRECTAMENTE LA PRESENCIA DE GLÓBULOS BLANCOS','DETECTA EL pH DE LA ORINA','DETECTA LA CONCENTRACIÓN DE UREA EN LA MUESTRA'] },
  { pregunta:'¿Qué distingue a los eritrocitos DISMÓRFICOS de los MONOMÓRFICOS en el sedimento urinario?', correcta:'LOS DISMÓRFICOS (FORMA ANULAR CON PROTRUSIONES) INDICAN HEMATURIA DE ORIGEN GLOMERULAR; LOS MONOMÓRFICOS INDICAN HEMATURIA NO GLOMERULAR', opts:['LOS MONOMÓRFICOS SIEMPRE INDICAN CÁNCER DE VEJIGA','NO EXISTE NINGUNA DIFERENCIA CLÍNICA ENTRE AMBOS TIPOS','LOS DISMÓRFICOS SOLO APARECEN EN INFECCIONES URINARIAS BAJAS'] },
  { pregunta:'¿Cuál es la matriz proteica principal que forma los cilindros urinarios en el túbulo distal y colector?', correcta:'LA GLICOPROTEÍNA DE TAMM-HORSFALL', opts:['LA ALBÚMINA SÉRICA','LA HEMOGLOBINA LIBRE','LA FIBRINA'] },
  { pregunta:'¿Cuál es el valor de referencia (ISP) para leucocitos en el sedimento urinario?', correcta:'MENOS DE 10 CÉLULAS/µL, O 0-5 POR CAMPO (40x)', opts:['MENOS DE 100 CÉLULAS/µL','0 CÉLULAS EN CUALQUIER CIRCUNSTANCIA, SIN NINGÚN MARGEN','MÁS DE 50 POR CAMPO (40x)'] },
  { pregunta:'¿Cuál es la causa más frecuente de litiasis renal según su composición cristalina, citada en el curso?', correcta:'EL OXALATO DE CALCIO (75% DE LAS LITIASIS)', opts:['EL ÁCIDO ÚRICO (75% DE LAS LITIASIS)','LA CISTINA (75% DE LAS LITIASIS)','EL CARBONATO DE CALCIO (75% DE LAS LITIASIS)'] },
  { pregunta:'En un paciente con ictericia POSTHEPÁTICA (obstructiva), ¿qué patrón de orina se espera?', correcta:'BILIRRUBINA POSITIVA Y UROBILINÓGENO DISMINUIDO A AUSENTE, CON HECES PÁLIDAS (ACÓLICAS)', opts:['BILIRRUBINA NEGATIVA Y UROBILINÓGENO AUMENTADO','BILIRRUBINA POSITIVA Y UROBILINÓGENO AUMENTADO, CON HECES DE COLOR NORMAL','AMBOS PARÁMETROS NEGATIVOS, SIN CAMBIO EN LAS HECES'] },
  { pregunta:'En un paciente con ictericia PREHEPÁTICA (hemolítica), ¿qué patrón de orina se espera?', correcta:'BILIRRUBINA NEGATIVA Y UROBILINÓGENO AUMENTADO, CON COLOR FECAL NORMAL', opts:['BILIRRUBINA POSITIVA Y UROBILINÓGENO AUSENTE','BILIRRUBINA POSITIVA Y HECES ACÓLICAS','AMBOS PARÁMETROS NEGATIVOS'] },
  { pregunta:'¿Qué preservante se usa para orina de 24 horas cuando se mide GLUCOSA, y por qué mecanismo actúa?', correcta:'FLUORURO DE SODIO, QUE PREVIENE LA GLICÓLISIS BACTERIANA/CELULAR', opts:['ÁCIDO CLORHÍDRICO, QUE DESTRUYE LOS ELEMENTOS FORMES','FORMALINA, QUE PRESERVA SOLO EL SEDIMENTO','CONGELAMIENTO DIRECTO SIN NINGÚN ADITIVO'] },
];
export function genOrina7Round(){
  const roll = Math.random();
  if(roll<0.15){
    const item = ORINA_BANK[0];
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(ORINA_BANK.slice(1));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Líquidos Biológicos: Transudado vs Exudado ----------------
   Basado en las clases de Líquidos Biológicos y Generalidades de Líquidos
   Biológicos, y en 2 casos prácticos resueltos (líquido pleural con
   derrame maligno, líquido sinovial con pseudogota). */
const LIQUIDOS_BANK = [
  {
    caso:'Paciente con derrame pleural. Líquido: Proteínas Totales 3,3 g/dL, LDH 679 U/L, Colesterol 98 mg/dL, Glucosa 50 mg/dL. Suero (mismo día): Proteínas Totales 5,6 g/dL, LDH 966 U/L, Colesterol 180 mg/dL, Glucosa 83 mg/dL.',
    pregunta:'Aplicando los Criterios de Light (cociente proteínas líquido/suero ≥0,5 = exudado), ¿qué tipo de derrame corresponde?',
    correcta:'EXUDADO (COCIENTE DE PROTEÍNAS ≈0,6, SOBRE EL LÍMITE DE 0,5)',
    opts:['TRASUDADO (COCIENTE DE PROTEÍNAS BAJO 0,5)','NO SE PUEDE CLASIFICAR SIN UNA BIOPSIA','DERRAME QUILOSO PURO, SIN APLICAR CRITERIOS DE LIGHT'],
  },
  {
    caso:'Mismo paciente: cociente LDH líquido/suero ≈0,7 y colesterol líquido/suero ≈0,54.',
    pregunta:'Según los Criterios de Light, ¿qué corte de LDH y de colesterol (razón líquido/suero) confirman un exudado?',
    correcta:'LDH ≥0,6 Y COLESTEROL &gt;0,3 (AMBOS CRITERIOS SE CUMPLEN EN ESTE CASO, CONFIRMANDO EXUDADO)',
    opts:['LDH ≥0,6 Y COLESTEROL &lt;0,1, NINGUNO DE LOS DOS SE CUMPLE AQUÍ','SOLO EL COLESTEROL IMPORTA, LA LDH NO FORMA PARTE DE LOS CRITERIOS DE LIGHT','LOS CRITERIOS DE LIGHT NO INCLUYEN NINGUNA RAZÓN DE COLESTEROL'],
  },
  {
    caso:'Mismo paciente con derrame pleural: triglicéridos del líquido = 391 mg/dL.',
    pregunta:'¿Qué tipo de derrame sugiere este nivel de triglicéridos?',
    correcta:'DERRAME QUILOSO (TRIGLICÉRIDOS &gt;110 mg/dL)',
    opts:['DERRAME PSEUDOQUILOSO (TRIGLICÉRIDOS &lt;50 mg/dL)','UN DERRAME SIN NINGUNA RELACIÓN CON LÍPIDOS','ESTE VALOR NO TIENE NINGÚN SIGNIFICADO DIAGNÓSTICO'],
  },
  {
    caso:'Citología del líquido pleural del mismo caso: células de gran tamaño, relación núcleo/citoplasma aumentada, citoplasma hiperbasófilo, núcleos de borde irregular, nidos celulares y células "en anillo de sello".',
    pregunta:'¿Qué sugiere este hallazgo citológico?',
    correcta:'UN DERRAME MALIGNO, COMPATIBLE CON ADENOCARCINOMA',
    opts:['UN DERRAME TRASUDATIVO SIMPLE POR INSUFICIENCIA CARDÍACA','UNA INFECCIÓN BACTERIANA AGUDA SIN COMPROMISO NEOPLÁSICO','UN HALLAZGO NORMAL SIN NINGÚN SIGNIFICADO PATOLÓGICO'],
  },
  { pregunta:'¿Cuál es el gradiente de albúmina (GASA) que sugiere hipertensión portal como causa de la ascitis?', correcta:'≥1,1 g/dL (ALBÚMINA SÉRICA MENOS ALBÚMINA DEL LÍQUIDO ASCÍTICO)', opts:['≤0,5 g/dL','EXACTAMENTE 0 g/dL, SIN NINGÚN MARGEN','≥5,0 g/dL'] },
  { pregunta:'¿Cuáles son las 3 causas típicas de TRASUDADO citadas en la tabla CLSI C49-A del curso?', correcta:'INSUFICIENCIA CARDÍACA CONGESTIVA, CIRROSIS HEPÁTICA Y SÍNDROME NEFRÓTICO', opts:['PANCREATITIS, LUPUS E INFECCIONES BACTERIANAS','TUBERCULOSIS, NEOPLASIAS Y ARTRITIS REUMATOIDE','TRAUMA, NEOPLASIAS Y OBSTRUCCIÓN LINFÁTICA'] },
  { pregunta:'¿Cuáles son causas típicas de EXUDADO citadas en el curso?', correcta:'PANCREATITIS, PERITONITIS BILIAR, ENFERMEDAD REUMATOIDE, LUPUS, INFECCIONES Y NEOPLASIAS', opts:['SOLO LA INSUFICIENCIA CARDÍACA CONGESTIVA','SOLO LA HIPOALBUMINEMIA AISLADA','SOLO EL SÍNDROME NEFRÓTICO'] },
  { pregunta:'¿Qué mecanismo fisiopatológico explica un TRASUDADO por hipoalbuminemia?', correcta:'DESCENSO DE LA PRESIÓN ONCÓTICA, SIN DAÑO DIRECTO DE LA MEMBRANA SEROSA', opts:['AUMENTO DE LA PERMEABILIDAD VASCULAR POR INFLAMACIÓN','OBSTRUCCIÓN DIRECTA DEL CONDUCTO TORÁCICO','INFECCIÓN BACTERIANA DE LA CAVIDAD SEROSA'] },
  { pregunta:'¿Qué distingue un derrame QUILOSO de uno PSEUDOQUILOSO en su origen?', correcta:'EL QUILOSO SE DEBE A OBSTRUCCIÓN O DAÑO DEL SISTEMA LINFÁTICO (CON QUILOMICRONES PRESENTES); EL PSEUDOQUILOSO SE ASOCIA A INFLAMACIÓN CRÓNICA, SIN QUILOMICRONES', opts:['AMBOS TIENEN EXACTAMENTE EL MISMO ORIGEN Y SIGNIFICADO CLÍNICO','EL PSEUDOQUILOSO SIEMPRE SE DEBE A UN TRAUMA DEL CONDUCTO TORÁCICO','EL QUILOSO NUNCA SE ASOCIA A NEOPLASIAS'] },
  {
    caso:'Hombre de 70 años, urgencia por dolor intenso en rodilla derecha. Artrocentesis: 20 mL de líquido sinovial, color amarillo, aspecto turbio, viscosidad menor a 3 cm. Recuento 14.800 células/µL, neutrófilos 85%. Cristales: forma rectangular, paralelo azul y perpendicular amarillo bajo luz polarizada compensada.',
    pregunta:'¿Qué tipo de cristal corresponde a esta descripción óptica, y qué diagnóstico sugiere?',
    correcta:'PIROFOSFATO DE CALCIO, COMPATIBLE CON PSEUDOGOTA (CONDROCALCINOSIS)',
    opts:['URATO MONOSÓDICO, COMPATIBLE CON GOTA','COLESTEROL, COMPATIBLE CON ARTRITIS REUMATOIDE CRÓNICA','OXALATO DE CALCIO, COMPATIBLE CON DAÑO RENAL'],
  },
  {
    caso:'Mismo paciente (rodilla, pirofosfato de calcio): si en cambio los cristales se vieran en forma de aguja/bastón, con elongación negativa (paralelo amarillo, perpendicular azul).',
    pregunta:'¿A qué cristal y diagnóstico correspondería ESTA descripción alternativa?',
    correcta:'URATO MONOSÓDICO, COMPATIBLE CON GOTA',
    opts:['PIROFOSFATO DE CALCIO, COMPATIBLE CON PSEUDOGOTA','HIDROXIAPATITA, SIN NINGÚN SIGNIFICADO CLÍNICO','COLESTEROL, COMPATIBLE CON BURSITIS CRÓNICA'],
  },
  { pregunta:'Según la tabla de trastornos articulares del curso, ¿qué grupo tiene leucocitos &gt;75.000/µL, neutrófilos &gt;75% y Gram/cultivo positivos?', correcta:'GRUPO 3: LÍQUIDO SINOVIAL SÉPTICO', opts:['GRUPO 1: NO INFLAMATORIO (ARTROSIS)','GRUPO 2: INFLAMATORIO POR CRISTALES (GOTA/SEUDOGOTA)','GRUPO 4: HEMORRÁGICO'] },
];
export function genLiquidos7Round(){
  const roll = Math.random();
  if(roll<0.45){
    const item = pick(LIQUIDOS_BANK.filter(function(x){ return x.caso; }));
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(LIQUIDOS_BANK.filter(function(x){ return !x.caso; }));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- LCR y Diagnóstico de Meningitis ----------------
   Basado en la clase de Líquido Cefalorraquídeo y en el caso clínico
   real de LCR (niña de 5 años, fiebre y rigidez de nuca) del curso. */
const LCR_BANK = [
  {
    caso:'Niña de 5 años, internada en pediatría con 40°C de temperatura, somnolencia y rigidez de nuca. Punción lumbar: color incoloro, aspecto turbio. Recuento de células nucleadas 800/µL. Fórmula diferencial: linfocitos 80%, monocitos 15%, neutrófilos 5%. Proteínas 65 mg/dL. Glucosa 70 mg/dL. Tinción de Gram: no se observan bacterias.',
    pregunta:'Según el patrón de este LCR (predominio linfocitario, glucosa normal, Gram negativo), ¿qué diagnóstico preliminar es el más probable?',
    correcta:'MENINGITIS VIRAL',
    opts:['MENINGITIS BACTERIANA AGUDA','MENINGITIS TUBERCULOSA','HEMORRAGIA SUBARACNOIDEA'],
  },
  {
    caso:'Misma paciente: si en cambio el Gram hubiera mostrado bacterias, con neutrófilos 90% y glucosa muy disminuida.',
    pregunta:'¿Qué diagnóstico correspondería a ESE patrón alternativo?',
    correcta:'MENINGITIS BACTERIANA',
    opts:['MENINGITIS VIRAL','UNA PUNCIÓN LUMBAR TRAUMÁTICA SIN INFECCIÓN','UN LCR COMPLETAMENTE NORMAL'],
  },
  { pregunta:'¿Qué patrón de LCR es característico de la meningitis BACTERIANA?', correcta:'GLUCOSA MUY DISMINUIDA, NEUTRÓFILOS PREDOMINANTES Y PROTEÍNAS MUY AUMENTADAS', opts:['GLUCOSA NORMAL Y PREDOMINIO DE LINFOCITOS','GLUCOSA MUY AUMENTADA Y AUSENCIA DE CÉLULAS','PROTEÍNAS SIEMPRE NORMALES, SIN CAMBIOS CELULARES'] },
  { pregunta:'¿Qué patrón de LCR es característico de la meningitis VIRAL?', correcta:'GLUCOSA NORMAL, CON PREDOMINIO DE LINFOCITOS', opts:['GLUCOSA MUY DISMINUIDA Y NEUTRÓFILOS PREDOMINANTES','PROTEÍNAS SIEMPRE AUSENTES','AUSENCIA TOTAL DE CÉLULAS EN EL RECUENTO'] },
  { pregunta:'¿Qué nivel de lactato en LCR es más compatible con meningitis BACTERIANA que con meningitis viral?', correcta:'MAYOR A 35 mg/dL (EN MENINGITIS VIRAL RARAMENTE SUPERA 25-30 mg/dL)', opts:['MENOR A 5 mg/dL EN AMBOS CASOS, SIN DIFERENCIA','EL LACTATO NO APORTA NINGUNA INFORMACIÓN ÚTIL EN MENINGITIS','SIEMPRE IGUAL AL LACTATO PLASMÁTICO, SIN VARIACIÓN PROPIA'] },
  { pregunta:'¿Cómo se ve normalmente el LCR sano, y con qué expresión se describe clásicamente?', correcta:'TRANSPARENTE E INCOLORO, DESCRITO COMO "AGUA DE ROCA"', opts:['AMARILLO INTENSO, DESCRITO COMO "COLOR MIEL"','SIEMPRE LIGERAMENTE TURBIO, AUNQUE SEA NORMAL','ROJO PÁLIDO, DESCRITO COMO "AGUA CON SANGRE"'] },
  { pregunta:'¿Qué es la "xantocromía" del LCR?', correcta:'UNA COLORACIÓN ROSADA, ANARANJADA O AMARILLENTA DEL SOBRENADANTE, ASOCIADA A HEMORRAGIA PREVIA O BILIRRUBINA ELEVADA', opts:['UN LCR COMPLETAMENTE TRANSPARENTE Y NORMAL','UNA INFECCIÓN BACTERIANA AGUDA SIN RELACIÓN CON EL COLOR','UN ARTEFACTO DE LA TÉCNICA DE PUNCIÓN SIN NINGÚN SIGNIFICADO'] },
  { pregunta:'¿Cómo se diferencia una hemorragia subaracnoidea de una punción lumbar traumática mediante los 3 tubos de LCR recolectados?', correcta:'EN LA PUNCIÓN TRAUMÁTICA, EL NÚMERO DE ERITROCITOS DISMINUYE DEL PRIMER AL TERCER TUBO; EN LA HEMORRAGIA SUBARACNOIDEA SE MANTIENE SIMILAR ENTRE TUBOS', opts:['NO EXISTE NINGUNA FORMA DE DIFERENCIARLAS CON LOS 3 TUBOS','EN AMBOS CASOS LOS ERITROCITOS SIEMPRE AUMENTAN DEL PRIMER AL TERCER TUBO','LA XANTOCROMÍA SOLO APARECE EN LA PUNCIÓN TRAUMÁTICA, NUNCA EN LA HEMORRAGIA'] },
  { pregunta:'¿Cuál es la vía habitual de obtención del LCR, y entre qué vértebras se realiza?', correcta:'PUNCIÓN LUMBAR, ENTRE LA 3ª Y 4ª (O 4ª Y 5ª) VÉRTEBRA LUMBAR', opts:['PUNCIÓN CERVICAL ALTA, ENTRE LAS VÉRTEBRAS C1-C2','PUNCIÓN TORÁCICA MEDIA','SIEMPRE POR VÍA VENOSA PERIFÉRICA, SIN PUNCIÓN ESPINAL'] },
  { pregunta:'¿Qué célula predominante en LCR, en el contexto de meningitis, indica bacterias fagocitadas y orienta a meningitis?', correcta:'EL MACRÓFAGO (SIDERÓFAGO EN CASOS DE SANGRADO PREVIO)', opts:['EL EOSINÓFILO, SIEMPRE ASOCIADO A INFECCIÓN VIRAL','LA CÉLULA PLASMÁTICA, EXCLUSIVA DE MENINGITIS BACTERIANA','EL BASÓFILO, SIN NINGÚN SIGNIFICADO EN LCR'] },
];
export function genLcr7Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(LCR_BANK.slice(0,2));
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(LCR_BANK.slice(2));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Valores Críticos y de Alerta ----------------
   Basado en la clase de Valores Críticos en Química Clínica y las 10
   preguntas de selección múltiple ya resueltas del curso (Solemne 1,
   26 de abril 2026). */
const VALORES_CRITICOS_BANK = [
  { pregunta:'¿Cómo se define formalmente un "valor de alerta" o valor crítico en el laboratorio clínico?', correcta:'UN RESULTADO TAN ALEJADO DE LO NORMAL QUE CONSTITUYE UNA AMENAZA PARA LA VIDA SI NO SE ACTÚA DE INMEDIATO', opts:['UN RESULTADO LEVEMENTE FUERA DEL RANGO DE REFERENCIA','UN RESULTADO QUE INDICA PATOLOGÍA CRÓNICA DE MANEJO AMBULATORIO','UN RESULTADO QUE SOLO REQUIERE REPETIRSE POR SOSPECHA DE FALLA DEL EQUIPO'] },
  { pregunta:'En un paciente adulto, ¿cuál es el riesgo fisiopatológico inminente de un potasio &gt;7.2 mEq/L?', correcta:'RIESGO INMINENTE DE PARO CARDÍACO POR ALTERACIÓN DE LA CONDUCCIÓN MIOCÁRDICA', opts:['CRISIS CONVULSIVA','TETANIA NEUROMUSCULAR','COMA DIABÉTICO HIPEROSMOLAR'] },
  { pregunta:'En adultos, ¿qué niveles de glucosa en suero se consideran críticos?', correcta:'MENOS DE 40 mg/dL Y MÁS DE 500 mg/dL, ASOCIADOS A COMA O CETOACIDOSIS', opts:['MENOS DE 70 Y MÁS DE 140 mg/dL','MENOS DE 60 Y MÁS DE 250 mg/dL','MENOS DE 30 Y MÁS DE 300 mg/dL, EXCLUSIVO DE NEONATOLOGÍA'] },
  { pregunta:'¿Qué manifestación clínica se asocia a un calcio iónico crítico menor a 3.1 mg/dL?', correcta:'TETANIA Y ESPASMOS POR AUMENTO DE LA EXCITABILIDAD NEUROMUSCULAR', opts:['COMA PROFUNDO','FALLA RENAL CRÓNICA TERMINAL','TIROTOXICOSIS AGUDA'] },
  { pregunta:'¿Cuáles son los niveles de sodio en adultos que representan peligro de muerte inminente?', correcta:'MENOS DE 120 Y MÁS DE 159 mEq/L', opts:['MENOS DE 135 Y MÁS DE 145 mEq/L','MENOS DE 130 Y MÁS DE 150 mEq/L','MENOS DE 110 Y MÁS DE 170 mEq/L'] },
  { pregunta:'¿Qué significado clínico tiene un lactato sérico &gt;40 mg/dL?', correcta:'ES UN MARCADOR CRÍTICO DE HIPOXIA TISULAR Y METABOLISMO ANAERÓBICO', opts:['FALLA RENAL CON INDICACIÓN DE DIÁLISIS','SOSPECHA DE PANCREATITIS AGUDA','INTOXICACIÓN POR LITIO'] },
  { pregunta:'¿Cuál es el rango de hemoglobina considerado crítico en un adulto?', correcta:'MENOS DE 7.0 g/dL Y MÁS DE 20.0 g/dL', opts:['MENOS DE 10 Y MÁS DE 16 g/dL','MENOS DE 9.0 Y MÁS DE 18 g/dL','MENOS DE 5.0 Y MÁS DE 25.0 g/dL'] },
  { pregunta:'¿Qué efecto se espera con un magnesio sérico &gt;5 mg/dL?', correcta:'PARÁLISIS Y DISMINUCIÓN DE LOS REFLEJOS OSTEOTENDINOSOS', opts:['CONFUSIÓN Y FALLA RENAL CRÓNICA','TETANIA SEVERA POR COMPETENCIA CON EL CALCIO IÓNICO','ACIDOSIS METABÓLICA GRAVE (HCO3 &lt;10)'] },
  { pregunta:'¿Cuál es el paso técnico que debe hacer el Tecnólogo Médico ANTES de validar o notificar un valor crítico?', correcta:'DESCARTAR ERRORES PRE-ANALÍTICOS, COMO LA HEMÓLISIS DE LA MUESTRA', opts:['INFORMAR DIRECTAMENTE AL PACIENTE','ELIMINAR LA MUESTRA Y SOLICITAR UNA NUEVA TOMA','CAMBIAR LOS CALIBRADORES DEL EQUIPO'] },
  { pregunta:'¿Cuál es la principal responsabilidad del Tecnólogo Médico al confirmar un valor crítico ya validado?', correcta:'NOTIFICAR TELEFÓNICAMENTE AL MÉDICO TRATANTE O AL PROFESIONAL A CARGO', opts:['DIAGNOSTICAR Y SUGERIR UN TRATAMIENTO','DECIDIR EL INGRESO DEL PACIENTE A UCI','AJUSTAR LOS LÍMITES DE ALARMA DEL SISTEMA LIS'] },
  { pregunta:'¿Qué valor de creatinina se considera crítico, asociado a falla renal crónica?', correcta:'MAYOR A 7.5 mg/dL', opts:['MAYOR A 1.2 mg/dL','MAYOR A 3.0 mg/dL solamente en niños','MENOR A 0.5 mg/dL'] },
  { pregunta:'¿Qué valor de amilasa se considera crítico, asociado a pancreatitis aguda?', correcta:'MAYOR A 2.000 U/L', opts:['MAYOR A 100 U/L','MAYOR A 160 U/L','MENOR A 28 U/L'] },
];
export function genValoresCriticos7Round(){
  const item = pick(VALORES_CRITICOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Control de Calidad y Estadística Diagnóstica ----------------
   Basado en las clases de Sensibilidad/Especificidad y Gestión y Control
   de Calidad del curso (reglas de Westgard, gráfica de Levey-Jennings,
   calibrador vs. control). */
const CONTROL_CALIDAD_BANK = [
  { pregunta:'¿Cómo se define la sensibilidad de una prueba diagnóstica?', correcta:'LA PROPORCIÓN DE INDIVIDUOS ENFERMOS QUE TIENEN UNA PRUEBA POSITIVA (VERDADEROS POSITIVOS)', opts:['LA PROPORCIÓN DE INDIVIDUOS SANOS CON PRUEBA NEGATIVA','LA PROBABILIDAD DE ESTAR ENFERMO SI LA PRUEBA DIO POSITIVO','UN VALOR QUE DEPENDE DE LA PREVALENCIA DE LA ENFERMEDAD'] },
  { pregunta:'¿Cómo se define la especificidad de una prueba diagnóstica?', correcta:'LA PROPORCIÓN DE INDIVIDUOS SIN LA ENFERMEDAD QUE TIENEN UNA PRUEBA NORMAL O NEGATIVA (VERDADEROS NEGATIVOS)', opts:['LA PROPORCIÓN DE ENFERMOS CON PRUEBA POSITIVA','LA PROBABILIDAD DE ESTAR SANO SI LA PRUEBA DIO NEGATIVO','UN VALOR QUE CAMBIA SEGÚN LA POBLACIÓN ESTUDIADA'] },
  { pregunta:'A diferencia de la sensibilidad y especificidad (valores intrínsecos del test), ¿de qué dependen el Valor Predictivo Positivo (VPP) y el Valor Predictivo Negativo (VPN)?', correcta:'DE LA PREVALENCIA DE LA ENFERMEDAD EN LA POBLACIÓN ESTUDIADA', opts:['NO DEPENDEN DE NINGÚN FACTOR EXTERNO, SON SIEMPRE FIJOS','SOLO DEL FABRICANTE DEL REACTIVO USADO','DEL COLOR DEL TUBO DE RECOLECCIÓN DE LA MUESTRA'] },
  { pregunta:'Regla mnemotécnica "SENDES": si una prueba tiene alta Sensibilidad, ¿qué significa un resultado Negativo?', correcta:'DESCARTA LA ENFERMEDAD (ES IDEAL PARA PRUEBAS DE TAMIZAJE O SCREENING)', opts:['CONFIRMA LA ENFERMEDAD CON CERTEZA ABSOLUTA','NO APORTA NINGUNA INFORMACIÓN ÚTIL','SIGNIFICA QUE LA PRUEBA DEBE REPETIRSE SIEMPRE'] },
  { pregunta:'Regla mnemotécnica "ESPIN": si una prueba tiene alta Especificidad, ¿qué significa un resultado Positivo?', correcta:'INDICA O CONFIRMA LA ENFERMEDAD (IDEAL PARA PRUEBAS CONFIRMATORIAS)', opts:['DESCARTA POR COMPLETO LA ENFERMEDAD','NO TIENE NINGÚN VALOR DIAGNÓSTICO','SOLO SIRVE PARA PRUEBAS DE TAMIZAJE MASIVO'] },
  { pregunta:'Test rápido de una enfermedad en 623 personas: VP=328, FP=24, FN=90, VN=181. ¿Cuál es la sensibilidad aproximada?', correcta:'78%', opts:['88%','93%','66%'] },
  { pregunta:'¿Qué diferencia principal hay entre un calibrador y un control en el laboratorio clínico?', correcta:'EL CALIBRADOR TIENE UN VALOR EXACTO Y CONOCIDO Y SE USA PARA AJUSTAR EL EQUIPO; EL CONTROL SIMULA UNA MUESTRA DE PACIENTE Y SE USA PARA MONITOREAR EL DESEMPEÑO DEL EQUIPO EN EL TIEMPO', opts:['AMBOS CUMPLEN EXACTAMENTE LA MISMA FUNCIÓN Y SON INTERCAMBIABLES','EL CONTROL SIEMPRE TIENE VALOR EXACTO CONOCIDO Y EL CALIBRADOR NO','EL CALIBRADOR SE USA SOLO PARA SIMULAR MUESTRAS DE PACIENTES'] },
  { pregunta:'¿Qué caracteriza al Control de Calidad Interno frente al Externo?', correcta:'EL INTERNO USA MATERIAL DE CONCENTRACIÓN CONOCIDA Y SE EVALÚA AL MENOS DIARIAMENTE, CON DECISIONES INMEDIATAS', opts:['EL INTERNO SE EVALÚA SOLO 2 A 4 VECES AL AÑO','EL INTERNO USA MATERIAL DE CONCENTRACIÓN DESCONOCIDA COMPRADO A ORGANIZACIONES INTERNACIONALES','EL INTERNO NUNCA PERMITE TOMAR DECISIONES INMEDIATAS'] },
  { pregunta:'En la gráfica de Levey-Jennings, ¿dónde deberían estar la mayoría de los valores de control (95,44% de los datos) en condiciones óptimas?', correcta:'DENTRO DE ±2 DESVIACIONES ESTÁNDAR (2DS) DE LA MEDIA', opts:['DENTRO DE ±1 DESVIACIÓN ESTÁNDAR SOLAMENTE','FUERA DE ±3 DESVIACIONES ESTÁNDAR','EXACTAMENTE SOBRE LA MEDIA, SIN NINGUNA DISPERSIÓN'] },
  { pregunta:'Regla de Westgard "1-3s": ¿qué significa que se viole esta regla?', correcta:'UNA SOLA MEDICIÓN DE CONTROL SUPERA EL LÍMITE DE ±3 DESVIACIONES ESTÁNDAR (ERROR ALEATORIO)', opts:['DOS MEDICIONES CONSECUTIVAS SUPERAN ±2 DESVIACIONES ESTÁNDAR','DIEZ MEDICIONES CONSECUTIVAS CAEN AL MISMO LADO DE LA MEDIA','LA DIFERENCIA ENTRE DOS CONTROLES SUPERA 4 DESVIACIONES ESTÁNDAR'] },
  { pregunta:'Regla de Westgard "2-2s": ¿qué tipo de error indica cuando se viola?', correcta:'ERROR SISTEMÁTICO (DOS MEDICIONES CONSECUTIVAS SUPERAN EL MISMO LÍMITE DE ±2 DESVIACIONES ESTÁNDAR)', opts:['ERROR ALEATORIO ÚNICAMENTE','NINGÚN TIPO DE ERROR, ES UNA REGLA DE ACEPTACIÓN','UN ERROR DE CALIBRACIÓN QUE SIEMPRE SE IGNORA'] },
  { pregunta:'Según el flujo de decisión de las reglas de Westgard, si se cumple CUALQUIERA de las reglas de rechazo, ¿qué corresponde hacer con la corrida analítica?', correcta:'RECHAZARLA (SE CONSIDERA "FUERA DE CONTROL")', opts:['ACEPTARLA E INFORMAR LOS RESULTADOS IGUAL','REPETIRLA EXACTAMENTE IGUAL SIN CAMBIOS','IGNORAR LA REGLA VIOLADA Y CONTINUAR'] },
  { pregunta:'¿Qué establece la ecuación de calidad citada en el curso: "Precisión + Veracidad = ?"', correcta:'EXACTITUD', opts:['SENSIBILIDAD','ESPECIFICIDAD','PREVALENCIA'] },
];
export function genControlCalidad7Round(){
  const item = pick(CONTROL_CALIDAD_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Endocrinología y Marcadores Tumorales ----------------
   Basado en la clase de Hormonas y Sistema Neuroendocrino y la clase de
   Biomarcadores Tumorales del curso. */
const ENDOCRINO_TUMORAL_BANK = [
  { pregunta:'¿Qué eje hormonal corresponde a: Hipotálamo (TRH) → Hipófisis (TSH) → Tiroides (T3/T4)?', correcta:'EJE HHT (TIROTRÓPICO), REGULA EL METABOLISMO', opts:['EJE HPA (CORTICOTRÓPICO)','EJE HPG (GONADOTRÓPICO)','NINGÚN EJE HORMONAL CONOCIDO'] },
  { pregunta:'¿Qué eje hormonal corresponde a: Hipotálamo (CRF) → Hipófisis (ACTH) → Glándula suprarrenal (Cortisol)?', correcta:'EJE HPA (CORTICOTRÓPICO), REGULA LA RESPUESTA AL ESTRÉS', opts:['EJE HHT (TIROTRÓPICO)','EJE HPG (GONADOTRÓPICO)','EL EJE RENINA-ANGIOTENSINA'] },
  { pregunta:'¿Qué hormona produce la célula beta de los islotes de Langerhans del páncreas?', correcta:'INSULINA', opts:['GLUCAGÓN','CORTISOL','CALCITONINA'] },
  { pregunta:'¿Qué hormona produce la célula alfa de los islotes de Langerhans del páncreas?', correcta:'GLUCAGÓN', opts:['INSULINA','TSH','ALDOSTERONA'] },
  { pregunta:'¿Qué porcentaje aproximado de T4 circula unida a proteínas transportadoras (TBG, prealbúmina), dejando solo una pequeña fracción libre activa?', correcta:'MÁS DEL 99,97%', opts:['SOLO EL 50%','MENOS DEL 10%','APROXIMADAMENTE EL 70%'] },
  { pregunta:'¿Qué causa el 80% de la T3 circulante en el organismo?', correcta:'LA CONVERSIÓN PERIFÉRICA (DESYODACIÓN) DE T4 A T3, NO LA PRODUCCIÓN DIRECTA DE LA TIROIDES', opts:['LA PRODUCCIÓN DIRECTA EXCLUSIVA DE LA GLÁNDULA TIROIDES','LA CONVERSIÓN DE CORTISOL EN T3','LA PRODUCCIÓN HEPÁTICA DIRECTA DE T3'] },
  { pregunta:'¿Qué marcador tumoral se usa principalmente para el seguimiento del cáncer de próstata?', correcta:'PSA (ANTÍGENO PROSTÁTICO ESPECÍFICO)', opts:['CA 125','AFP','CALCITONINA'] },
  { pregunta:'¿Qué marcador tumoral se asocia principalmente al carcinoma ovárico?', correcta:'CA 125', opts:['PSA','CEA','NSE'] },
  { pregunta:'¿Qué marcador tumoral se asocia principalmente al cáncer de páncreas?', correcta:'CA 19.9', opts:['CA 15.3','PSA','Calcitonina'] },
  { pregunta:'¿Qué marcador tumoral se asocia al carcinoma medular de tiroides?', correcta:'CALCITONINA', opts:['PSA','CA 125','AFP'] },
  { pregunta:'¿Qué marcador tumoral, elevado en tumores de células germinales y hepatocarcinoma, tiene una composición proteica similar a la albúmina?', correcta:'AFP (ALFAFETOPROTEÍNA)', opts:['CEA','CA 27.29','PSA'] },
  { pregunta:'¿Por qué el PSA por sí solo no distingue bien entre cáncer de próstata y enfermedades benignas de la próstata?', correcta:'PORQUE TAMBIÉN SE ELEVA EN PROSTATITIS Y EN HIPERPLASIA PROSTÁTICA BENIGNA (HPB)', opts:['PORQUE EL PSA NUNCA SE ELEVA EN CÁNCER DE PRÓSTATA','PORQUE EL PSA SOLO SE MIDE EN MUJERES','PORQUE EL PSA ES EXCLUSIVO DE ENFERMEDADES RENALES'] },
  { pregunta:'¿Qué característica debería tener idealmente un biomarcador tumoral, según los criterios del curso?', correcta:'SER ESPECÍFICO PARA UN TUMOR Y CAMBIAR EN RELACIÓN AL TAMAÑO TUMORAL', opts:['ELEVARSE POR IGUAL EN CUALQUIER TIPO DE CÁNCER SIN DISTINCIÓN','NO TENER NINGUNA RELACIÓN CON EL TAMAÑO DEL TUMOR','SER IGUAL DE ÚTIL EN CUALQUIER ETAPA DE LA ENFERMEDAD'] },
];
export function genEndocrinoTumoral7Round(){
  const item = pick(ENDOCRINO_TUMORAL_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Gases Arteriales y Equilibrio Ácido-Base ----------------
   Basado en la clase de Gases Arteriales y Equilibrio Ácido-Base, incluido
   el caso clínico de EPOC resuelto en el curso. */
const GASES_ARTERIALES_BANK = [
  {
    caso:'Varón de 70 años, fumador de 20-25 cigarrillos/día por más de 20 años (EPOC), con dificultad respiratoria y tos persistente de 5 días. Gases arteriales: pH 7.32 (VN 7.35-7.45); pCO2 63 mmHg (VN 35-45); HCO3 31 mmol/L (VN 21-28); pO2 57 mmHg (VN 80-100).',
    pregunta:'¿Cuál es la interpretación correcta de este perfil de gases arteriales?',
    correcta:'ACIDOSIS RESPIRATORIA COMPENSADA, CON RETENCIÓN RENAL DE BICARBONATO E HIPOXEMIA ASOCIADA',
    opts:['ALCALOSIS METABÓLICA DESCOMPENSADA','ACIDOSIS METABÓLICA PURA SIN COMPENSACIÓN','ALCALOSIS RESPIRATORIA AGUDA'],
  },
  {
    caso:'Mismo paciente EPOC: pCO2 elevado (63 mmHg) y HCO3 elevado (31 mmol/L) de forma simultánea.',
    pregunta:'¿Qué mecanismo explica el HCO3 elevado en este paciente con retención crónica de CO2?',
    correcta:'COMPENSACIÓN METABÓLICA (RENAL), QUE ES DE ACCIÓN LENTA, RETENIENDO BICARBONATO PARA CONTRARRESTAR EL EXCESO DE CO2',
    opts:['UNA ALCALOSIS METABÓLICA PRIMARIA SIN NINGUNA RELACIÓN CON EL PULMÓN','UN ERROR DE LABORATORIO SIN SIGNIFICADO CLÍNICO','LA COMPENSACIÓN RESPIRATORIA, QUE SIEMPRE ES DE ACCIÓN RÁPIDA'],
  },
  { pregunta:'¿Cuál es el rango normal de pH arterial?', correcta:'7.35 – 7.45', opts:['7.00 – 7.20','7.45 – 7.60','6.80 – 7.00'] },
  { pregunta:'¿Cuál es el rango normal de PaCO2?', correcta:'35 – 45 mmHg', opts:['80 – 100 mmHg','10 – 20 mmHg','60 – 80 mmHg'] },
  { pregunta:'¿Cuál es el rango normal de HCO3⁻?', correcta:'22 – 26 mEq/L', opts:['5 – 10 mEq/L','40 – 50 mEq/L','60 – 70 mEq/L'] },
  { pregunta:'¿Qué tipo de trastorno ácido-base produce una disminución primaria del HCO3⁻ (con pCO2 sin cambio primario)?', correcta:'ACIDOSIS METABÓLICA', opts:['ALCALOSIS METABÓLICA','ACIDOSIS RESPIRATORIA','ALCALOSIS RESPIRATORIA'] },
  { pregunta:'¿Qué tipo de trastorno ácido-base produce un aumento primario del pCO2 (con HCO3 sin cambio primario)?', correcta:'ACIDOSIS RESPIRATORIA', opts:['ALCALOSIS RESPIRATORIA','ACIDOSIS METABÓLICA','ALCALOSIS METABÓLICA'] },
  { pregunta:'¿Qué mecanismo de compensación es de acción RÁPIDA frente a un trastorno metabólico primario?', correcta:'LA COMPENSACIÓN RESPIRATORIA (HIPERVENTILACIÓN O HIPOVENTILACIÓN)', opts:['LA COMPENSACIÓN RENAL, QUE TAMBIÉN ES RÁPIDA','NINGÚN MECANISMO DE COMPENSACIÓN ES RÁPIDO','LA COMPENSACIÓN HEPÁTICA'] },
  { pregunta:'¿Cómo se calcula el anión gap (brecha aniónica)?', correcta:'AG = Na⁺ − (Cl⁻ + HCO3⁻)', opts:['AG = Na⁺ + Cl⁻ + HCO3⁻','AG = Cl⁻ − Na⁺','AG = HCO3⁻ / pCO2'] },
  { pregunta:'¿Cuál es el rango normal de lactato sérico?', correcta:'0.5 – 2.2 mmol/L', opts:['5 – 10 mmol/L','10 – 20 mmol/L','0.01 – 0.05 mmol/L'] },
  { pregunta:'¿Por qué el lactato es un buen indicador de hipoxia tisular?', correcta:'PORQUE EN HIPOXIA EL METABOLISMO CELULAR ANAERÓBICO GENERA MÁS LACTATO', opts:['PORQUE EL LACTATO SOLO SE PRODUCE EN EL HÍGADO SANO','PORQUE EL LACTATO DISMINUYE SIEMPRE QUE HAY FALTA DE OXÍGENO','PORQUE EL LACTATO NO TIENE NINGUNA RELACIÓN CON EL METABOLISMO CELULAR'] },
  { pregunta:'Para el análisis de gases arteriales, ¿qué anticoagulante es el de elección para la jeringa de recolección?', correcta:'HEPARINA LIOFILIZADA EQUILIBRADA CON CALCIO-ZINC-LITIO', opts:['EDTA','CITRATO','OXALATO'] },
];
export function genGasesArteriales7Round(){
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(GASES_ARTERIALES_BANK.slice(0,2));
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(GASES_ARTERIALES_BANK.slice(2));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Páncreas: Enzimas y Pancreatitis ----------------
   Basado en la clase de Páncreas del curso, incluido el caso clínico de
   pancreatitis aguda por alcohol resuelto en el material. */
const PANCREAS_BANK = [
  {
    caso:'Paciente masculino de 38 años, abuso crónico de alcohol, dolor abdominal superior irradiado a la espalda tras un episodio de consumo excesivo, náuseas y vómitos repetidos. Amilasa 1240 U/L (VN 80-160); Lipasa 1550 U/L (VN 10-140); GGT 250 U/L (VN &lt;61).',
    pregunta:'¿Cuál es el diagnóstico más probable?',
    correcta:'PANCREATITIS AGUDA, PROBABLEMENTE DE ORIGEN ALCOHÓLICO',
    opts:['GASTRITIS AGUDA SIN COMPROMISO PANCREÁTICO','HEPATITIS VIRAL AGUDA AISLADA','APENDICITIS AGUDA'],
  },
  {
    caso:'En el mismo paciente, la lipasa (1550 U/L) permanece elevada por más tiempo que la amilasa tras el episodio agudo.',
    pregunta:'¿Por qué la lipasa tiene una vida media más larga que la amilasa en sangre durante la pancreatitis aguda?',
    correcta:'PORQUE LA LIPASA NO TIENE EXCRECIÓN RENAL Y SE REABSORBE EN GRAN MEDIDA A NIVEL RENAL, A DIFERENCIA DE LA AMILASA',
    opts:['PORQUE LA LIPASA SE PRODUCE EN MAYOR CANTIDAD QUE LA AMILASA','PORQUE LA AMILASA NUNCA SE ELEVA EN LA PANCREATITIS AGUDA','PORQUE LA LIPASA SE DESTRUYE MÁS LENTO EN EL HÍGADO'],
  },
  { pregunta:'¿Qué enzima pancreática descompone los carbohidratos en azúcares simples?', correcta:'LA AMILASA', opts:['LA LIPASA','LA TRIPSINA','LA ELASTASA'] },
  { pregunta:'¿Qué enzima pancreática descompone las grasas (triglicéridos) en ácidos grasos y mono/diacilglicéridos?', correcta:'LA LIPASA', opts:['LA AMILASA','LA QUIMOTRIPSINA','LA CARBOXIPEPTIDASA'] },
  { pregunta:'¿Cuál es el rango de referencia de amilasa en sangre citado en el curso?', correcta:'28 – 100 U/L', opts:['300 – 500 U/L','1 – 5 U/L','1000 – 2000 U/L'] },
  { pregunta:'¿Cuál es el rango de referencia de lipasa en sangre citado en el curso?', correcta:'13 – 60 U/L', opts:['500 – 800 U/L','1 – 5 U/L','2000 – 3000 U/L'] },
  { pregunta:'¿Qué célula del islote de Langerhans secreta insulina?', correcta:'LA CÉLULA BETA', opts:['LA CÉLULA ALFA','LA CÉLULA ACINAR','LA CÉLULA DELTA'] },
  { pregunta:'¿Qué causa puede producir hiperamilasemia SIN que exista patología pancreática real?', correcta:'LA INSUFICIENCIA RENAL (AL DISMINUIR LA DEPURACIÓN DE AMILASA) O LA MACROAMILASEMIA', opts:['SOLO LA PANCREATITIS AGUDA PUEDE ELEVAR LA AMILASA','LA AMILASA NUNCA SE ELEVA POR CAUSAS NO PANCREÁTICAS','SOLO EL CONSUMO DE ALCOHOL PUEDE ELEVAR LA AMILASA'] },
  { pregunta:'¿Qué unidad funcional corresponde a la función EXOCRINA del páncreas (secreción de enzimas digestivas)?', correcta:'EL ACINO PANCREÁTICO', opts:['EL ISLOTE DE LANGERHANS','LA CÉLULA BETA','LA CÉLULA ALFA'] },
  { pregunta:'¿Qué unidad funcional corresponde a la función ENDOCRINA del páncreas (secreción de insulina y glucagón)?', correcta:'EL ISLOTE DE LANGERHANS', opts:['EL ACINO PANCREÁTICO','EL CONDUCTO PANCREÁTICO','LA CÁPSULA PANCREÁTICA'] },
  { pregunta:'En la pancreatitis aguda, ¿por qué puede presentarse hipocalcemia?', correcta:'POR SAPONIFICACIÓN DE ÁCIDOS GRASOS (POR AUMENTO DE LA ACTIVIDAD DE LA LIPASA), QUE SE ACUMULAN EN EL TEJIDO ADIPOSO PERIPANCREÁTICO', opts:['PORQUE EL PÁNCREAS PRODUCE CALCITONINA EN EXCESO','PORQUE LA AMILASA DESTRUYE DIRECTAMENTE EL CALCIO SÉRICO','LA HIPOCALCEMIA NO TIENE RELACIÓN CON LA PANCREATITIS AGUDA'] },
];
export function genPancreas7Round(){
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(PANCREAS_BANK.slice(0,2));
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.caso+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
    };
  }
  const item = pick(PANCREAS_BANK.slice(2));
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

/* ---------------- Bioquímica de Reactivos e Insertos ----------------
   Basado en los insertos técnicos de reactivos (Albúmina, Glucosa,
   Proteínas Totales, Calibrador BioSystems) del curso. */
const REACTIVOS_BANK = [
  { pregunta:'¿Qué método usa el reactivo de Albúmina (BioSystems) para su determinación?', correcta:'VERDE DE BROMOCRESOL (BCG)', opts:['BIURET','ARSENAZO III','GLUCOSA OXIDASA'] },
  { pregunta:'¿Cuál es el valor de referencia de albúmina en adultos según el inserto BioSystems?', correcta:'35 – 52 g/L', opts:['1 – 5 g/L','100 – 150 g/L','500 – 600 g/L'] },
  { pregunta:'¿Cuál de estas es una causa listada de hipoalbuminemia en el inserto de albúmina?', correcta:'ENFERMEDAD HEPÁTICA CRÓNICA (SÍNTESIS REDUCIDA)', opts:['DESHIDRATACIÓN SEVERA','EJERCICIO FÍSICO INTENSO Y PUNTUAL','EXCESO DE VITAMINA C EN LA DIETA'] },
  { pregunta:'¿Qué método usa el reactivo "Glucose liquicolor" (Human) para determinar glucosa?', correcta:'GLUCOSA OXIDASA (GOD) CON PEROXIDASA (POD)', opts:['BIURET','VERDE DE BROMOCRESOL','ARSENAZO III'] },
  { pregunta:'¿Cuál es el valor de referencia de glucosa en ayunas (suero/plasma) según el inserto Human?', correcta:'75 – 115 mg/dL', opts:['200 – 300 mg/dL','10 – 20 mg/dL','500 – 600 mg/dL'] },
  { pregunta:'¿Qué fármaco puede causar resultados FALSAMENTE BAJOS de glucosa, según el inserto del reactivo?', correcta:'N-ACETILCISTEÍNA (NAC), USADA EN TRATAMIENTO DE SOBREDOSIS DE PARACETAMOL', opts:['PARACETAMOL EN DOSIS TERAPÉUTICAS NORMALES','VITAMINA C EN DOSIS BAJAS','AGUA POTABLE'] },
  { pregunta:'¿Qué método usa el reactivo de Proteínas Totales para su determinación?', correcta:'MÉTODO DE BIURET', opts:['GLUCOSA OXIDASA','VERDE DE BROMOCRESOL','ARSENAZO III'] },
  { pregunta:'¿Qué compuesto forman las proteínas de la muestra al reaccionar con iones cobre (II) en medio alcalino (método de Biuret)?', correcta:'UN COMPLEJO COLOREADO PÚRPURA, CUANTIFICADO POR ESPECTROFOTOMETRÍA', opts:['UN PRECIPITADO BLANCO SIN COLOR','UN GAS QUE SE MIDE POR VOLUMEN','UN CRISTAL SÓLIDO INSOLUBLE EN AGUA'] },
  { pregunta:'En un calibrador de bioquímica humano liofilizado, ¿qué representa el "valor asignado" de cada componente (ej. glucosa, albúmina)?', correcta:'UN VALOR EXACTO Y CONOCIDO, DETERMINADO POR UN MÉTODO DE REFERENCIA, PARA CALIBRAR EL EQUIPO', opts:['UN VALOR APROXIMADO SIN NINGÚN RESPALDO METODOLÓGICO','UN VALOR QUE SIMULA UNA MUESTRA DE PACIENTE ENFERMO','UN VALOR QUE CAMBIA CADA VEZ QUE SE ABRE EL FRASCO'] },
  { pregunta:'¿Qué elementos NO deben interferir significativamente en la determinación de albúmina, según el inserto (dentro de los límites indicados)?', correcta:'BILIRRUBINA, HEMÓLISIS Y LIPEMIA, DENTRO DE LOS LÍMITES ESPECIFICADOS POR EL FABRICANTE', opts:['CUALQUIER GRADO DE HEMÓLISIS, SIN NINGÚN LÍMITE','SOLO EL AGUA DESTILADA UTILIZADA EN LA DILUCIÓN','LA TEMPERATURA AMBIENTE DEL LABORATORIO'] },
  { pregunta:'¿Por qué los sueros ictéricos NO deben usarse como muestra en la prueba de glucosa (método GOD-POD), según el inserto Human?', correcta:'PORQUE INTERFIEREN CON LA REACCIÓN Y ALTERAN EL RESULTADO', opts:['PORQUE LOS SUEROS ICTÉRICOS SIEMPRE DAN GLUCOSA MÁS ALTA DE LO REAL, SIN AFECTAR LA TÉCNICA','PORQUE EL COLOR AMARILLO MEJORA LA LECTURA ESPECTROFOTOMÉTRICA','NO HAY NINGUNA RESTRICCIÓN PARA USAR SUEROS ICTÉRICOS EN ESTA PRUEBA'] },
];
export function genReactivos7Round(){
  const item = pick(REACTIVOS_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:1, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta.toLowerCase()+'.',
  };
}

import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Media: Educación Matemática ----------------
   Nivel 2 Media equivale a 3°-4° medio (ver content/grades.js). Fuente real: "Temario Segundo
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er y 2do semestre). El eje NM2 Matemática es el más avanzado de todo EPJA: raíz cuadrada
   como proceso inverso de la potencia de exponente 2 (y como potencia de exponente
   fraccionario) con sus propiedades, funciones exponencial y logarítmica, función cuadrática
   y ecuaciones de segundo grado, razones trigonométricas en el triángulo rectángulo,
   estadística (tablas de frecuencia/histogramas con datos agrupados, caracterización de una
   población a partir de una muestra), y probabilidad condicional/suma/producto. 6 módulos
   cubren el eje completo sin dejar ningún objetivo fuera. Mismo criterio que Nivel 1 Media:
   generadores mayormente dinámicos, usando valores que producen resultados exactos y limpios
   (cuadrados perfectos para raíces, ternas pitagóricas para razones trigonométricas, raíces
   enteras construidas a propósito para ecuaciones de segundo grado) para evitar ambigüedad
   por redondeo. Contextos de vida adulta. */

export const MATEMATICA_EPJA_M2_MODULES = [
  {id:'raicesCuadradasEpjaM2', label:'Raíces Cuadradas', open:true, key:'raicesCuadradasEpjaM2'},
  {id:'funcionesExpLogEpjaM2', label:'Funciones Exponencial y Logarítmica', open:true, key:'funcionesExpLogEpjaM2'},
  {id:'funcionCuadraticaEpjaM2', label:'Función Cuadrática y Ecuaciones', open:true, key:'funcionCuadraticaEpjaM2'},
  {id:'trigonometriaEpjaM2', label:'Trigonometría', open:true, key:'trigonometriaEpjaM2'},
  {id:'estadisticaMuestrasEpjaM2', label:'Estadística: Tablas y Muestras', open:true, key:'estadisticaMuestrasEpjaM2'},
  {id:'probabilidadEpjaM2', label:'Probabilidad', open:true, key:'probabilidadEpjaM2'},
];
export const MATEMATICA_EPJA_M2_POS = [
  {x:22,y:92},{x:68,y:76},{x:24,y:60},{x:70,y:44},{x:24,y:28},{x:70,y:10}
];

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }

/* ---------------- Raíces Cuadradas ---------------- */
const RECURSO_RAICES_M2 = 'La <b>raíz cuadrada</b> es el proceso inverso de elevar un número al cuadrado: si a² = N, entonces la raíz cuadrada de N es a. También se puede escribir como una <b>potencia de exponente fraccionario</b>: la raíz cuadrada de N es lo mismo que N elevado a 1/2. Una propiedad útil es que la raíz de un producto es igual al producto de las raíces (raíz de a×b = raíz de a × raíz de b), lo que permite resolver expresiones numéricas con raíces de forma más simple, por ejemplo al calcular la longitud del lado de un terreno cuadrado a partir de su superficie.';
function generaRaizInversa(){
  const a = randInt(4,20);
  const n = a*a;
  const enunciado = 'Si '+a+'² = '+n+', ¿cuál es la raíz cuadrada de '+n+'?';
  const opts = uniqueDistractors(a, 2, 25, 4, 4).map(function(x){ return {label:String(x), value:x}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: a, speakText: enunciado, cols:2, panel:true,
    explain: 'Como '+a+'² = '+n+', la raíz cuadrada de '+n+' es '+a+' — la raíz cuadrada es el proceso inverso de elevar al cuadrado.',
    recurso: RECURSO_RAICES_M2,
  };
}
function generaPropiedadRaices(){
  const a = pick([4,9,16,25]);
  const b = pick([4,9,16,25]);
  const raizA = Math.sqrt(a);
  const raizB = Math.sqrt(b);
  const producto = a*b;
  const resultado = raizA*raizB;
  const enunciado = 'Calcula: la raíz cuadrada de '+a+' multiplicada por la raíz cuadrada de '+b;
  const opts = uniqueDistractors(resultado, 1, resultado*3, 6, 4).map(function(x){ return {label:String(x), value:x}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p><p class="prompt-hint">Pista: raíz de '+a+' × raíz de '+b+' = raíz de ('+a+' × '+b+').</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: 'Raíz de '+a+' × raíz de '+b+' = raíz de '+producto+' = '+resultado+'.',
    recurso: RECURSO_RAICES_M2,
  };
}
function generaProblemaRaiz(){
  const lado = randInt(4,20);
  const area = lado*lado;
  const enunciado = 'Un terreno cuadrado tiene una superficie de '+area+' m². ¿Cuánto mide cada lado del terreno?';
  const opts = uniqueDistractors(lado, 2, 25, 4, 4).map(function(x){ return {label:x+' m', value:x}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: lado, speakText: enunciado, cols:2, panel:true,
    explain: 'El lado de un cuadrado es la raíz cuadrada de su superficie: la raíz de '+area+' es '+lado+' m.',
    recurso: RECURSO_RAICES_M2,
  };
}
export function genRaicesCuadradasEpjaM2Round(){
  const roll = Math.random();
  if(roll<0.34) return generaRaizInversa();
  if(roll<0.67) return generaPropiedadRaices();
  return generaProblemaRaiz();
}

/* ---------------- Funciones Exponencial y Logarítmica ---------------- */
const RECURSO_FUNCIONES_EXP_LOG_M2 = 'Una <b>función exponencial</b> tiene la forma y = bˣ (la incógnita está en el exponente), y modela fenómenos de crecimiento rápido, como el interés compuesto o el crecimiento de una población de bacterias. Su función inversa es la <b>función logarítmica</b>: el logaritmo en base b de un número N responde a la pregunta "¿a qué exponente hay que elevar b para obtener N?" — por ejemplo, el logaritmo en base 2 de 8 es 3, porque 2³ = 8.';
function generaEvaluarExponencial(){
  const base = pick([2,3,5]);
  const exp = randInt(2,4);
  const resultado = Math.pow(base, exp);
  const enunciado = 'Si y = '+base+'ˣ, ¿cuál es el valor de y cuando x = '+exp+'?';
  const opts = uniqueDistractors(resultado, 1, resultado*3, Math.max(6,Math.round(resultado*0.4)), 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: base+' elevado a '+exp+' es '+resultado+'.',
    recurso: RECURSO_FUNCIONES_EXP_LOG_M2,
  };
}
function generaEvaluarLogaritmo(){
  const base = pick([2,3,5,10]);
  const exp = randInt(2,4);
  const n = Math.pow(base, exp);
  const enunciado = '¿Cuál es el logaritmo en base '+base+' de '+n+'?';
  const opts = uniqueDistractors(exp, 1, 8, 2, 4).map(function(x){ return {label:String(x), value:x}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p><p class="prompt-hint">Pregunta equivalente: ¿a qué exponente hay que elevar '+base+' para obtener '+n+'?</p>',
    options: opts, correctValue: exp, speakText: enunciado, cols:2, panel:true,
    explain: 'El logaritmo en base '+base+' de '+n+' es '+exp+', porque '+base+'^'+exp+' = '+n+'.',
    recurso: RECURSO_FUNCIONES_EXP_LOG_M2,
  };
}
function generaClasificarFuncionExpLog(){
  const esExponencial = Math.random()<0.5;
  const base = pick([2,3,5]);
  const formula = esExponencial ? 'y = '+base+'ˣ' : 'y = log'+base+'(x)';
  const correcta = esExponencial ? 'Función exponencial' : 'Función logarítmica';
  const opts = shuffle(['Función exponencial','Función logarítmica']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+formula+'</p><p class="prompt-hint">¿Esta fórmula corresponde a una función exponencial o a una función logarítmica?</p>',
    options: opts, correctValue: correcta, speakText: formula+' ¿Es una función exponencial o logarítmica?', cols:2, panel:true,
    explain: formula+' es una <b>'+correcta+'</b>'+(esExponencial?', porque la incógnita está en el exponente.':', porque es la función inversa de la exponencial.'),
    recurso: RECURSO_FUNCIONES_EXP_LOG_M2,
  };
}
export function genFuncionesExpLogEpjaM2Round(){
  const roll = Math.random();
  if(roll<0.34) return generaEvaluarExponencial();
  if(roll<0.67) return generaEvaluarLogaritmo();
  return generaClasificarFuncionExpLog();
}

/* ---------------- Función Cuadrática y Ecuaciones ---------------- */
const RECURSO_FUNCION_CUADRATICA_M2 = 'Una <b>función cuadrática</b> tiene la forma y = ax² + bx + c, y su gráfico es una parábola. Una <b>ecuación de segundo grado</b> (ax² + bx + c = 0) puede tener una o dos soluciones (llamadas raíces), que son los valores de x donde la parábola cruza el eje horizontal. Cuando la ecuación se puede factorizar como (x − r₁)(x − r₂) = 0, sus soluciones son exactamente r₁ y r₂ — una forma directa de resolverla sin necesitar la fórmula general.';
function generaResolverEcuacionCuadratica(){
  const r1 = randInt(-9,9);
  let r2 = randInt(-9,9);
  if(r2===r1) r2 = r1+1;
  const b = -(r1+r2);
  const c = r1*r2;
  const bStr = b>=0 ? ' + '+b+'x' : ' − '+Math.abs(b)+'x';
  const cStr = c>=0 ? ' + '+c : ' − '+Math.abs(c);
  const enunciado = 'Resuelve: x²'+bStr+cStr+' = 0. ¿Cuáles son sus dos soluciones?';
  const correcta = [r1,r2].sort(function(a,b2){ return a-b2; }).join(' y ');
  const opciones = [correcta];
  while(opciones.length<4){
    const s1 = randInt(-9,9); let s2 = randInt(-9,9);
    if(s2===s1) s2 = s1+1;
    const cand = [s1,s2].sort(function(a,b2){ return a-b2; }).join(' y ');
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: 'La ecuación se puede factorizar como (x − ('+r1+'))(x − ('+r2+')) = 0, así que sus soluciones son '+correcta+'.',
    recurso: RECURSO_FUNCION_CUADRATICA_M2,
  };
}
function generaEvaluarCuadratica(){
  const a = randInt(1,4);
  const b = randInt(-6,6);
  const c = randInt(-10,10);
  const x = randInt(1,6);
  const y = a*x*x + b*x + c;
  const bStr = b>=0 ? ' + '+b+'x' : ' − '+Math.abs(b)+'x';
  const cStr = c>=0 ? ' + '+c : ' − '+Math.abs(c);
  const enunciado = 'Si y = '+a+'x²'+bStr+cStr+', ¿cuál es el valor de y cuando x = '+x+'?';
  const opts = uniqueDistractors(y, y-20, y+20, 6, 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: y, speakText: enunciado, cols:2, panel:true,
    explain: 'Al reemplazar x = '+x+', y = '+a+'×'+x+'² '+bStr+' '+cStr+' = '+y+'.',
    recurso: RECURSO_FUNCION_CUADRATICA_M2,
  };
}
export function genFuncionCuadraticaEpjaM2Round(){
  return Math.random()<0.5 ? generaResolverEcuacionCuadratica() : generaEvaluarCuadratica();
}

/* ---------------- Trigonometría ---------------- */
const RECURSO_TRIGONOMETRIA_M2 = 'En un <b>triángulo rectángulo</b>, las razones trigonométricas relacionan un ángulo agudo con los lados del triángulo: el <b>seno</b> es el cateto opuesto dividido por la hipotenusa, el <b>coseno</b> es el cateto adyacente dividido por la hipotenusa, y la <b>tangente</b> es el cateto opuesto dividido por el cateto adyacente. Estas razones permiten calcular alturas o distancias que serían difíciles de medir directamente, como la altura de un poste o de un cerro, conociendo un ángulo y una distancia accesible.';
const TERNAS_PITAGORICAS = [[3,4,5],[6,8,10],[5,12,13],[8,15,17],[7,24,25],[9,12,15],[12,16,20]];
function generaRazonTrigonometrica(){
  const terna = pick(TERNAS_PITAGORICAS);
  const opuesto = terna[0], adyacente = terna[1], hipotenusa = terna[2];
  const razon = pick(['seno','coseno','tangente']);
  let correctaNum, correctaDen;
  if(razon==='seno'){ correctaNum=opuesto; correctaDen=hipotenusa; }
  else if(razon==='coseno'){ correctaNum=adyacente; correctaDen=hipotenusa; }
  else { correctaNum=opuesto; correctaDen=adyacente; }
  const d = gcd(correctaNum, correctaDen);
  const correcta = (correctaNum/d)+'/'+(correctaDen/d);
  const opciones = [correcta];
  const candidatos = [
    (adyacente/gcd(adyacente,hipotenusa))+'/'+(hipotenusa/gcd(adyacente,hipotenusa)),
    (opuesto/gcd(opuesto,hipotenusa))+'/'+(hipotenusa/gcd(opuesto,hipotenusa)),
    (opuesto/gcd(opuesto,adyacente))+'/'+(adyacente/gcd(opuesto,adyacente)),
    (adyacente/gcd(adyacente,opuesto))+'/'+(opuesto/gcd(adyacente,opuesto)),
    (hipotenusa/gcd(hipotenusa,opuesto))+'/'+(opuesto/gcd(hipotenusa,opuesto)),
  ];
  candidatos.forEach(function(c){ if(opciones.length<4 && opciones.indexOf(c)===-1) opciones.push(c); });
  const opts = shuffle(opciones.slice(0,4)).map(function(o){ return {label:o, value:o}; });
  const enunciado = 'Un triángulo rectángulo tiene catetos de '+opuesto+' y '+adyacente+' unidades, e hipotenusa de '+hipotenusa+' unidades. Para el ángulo cuyo cateto opuesto mide '+opuesto+', ¿cuál es su '+razon+'?';
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: razon.charAt(0).toUpperCase()+razon.slice(1)+' = '+(razon==='tangente'?'cateto opuesto / cateto adyacente':'cateto correspondiente / hipotenusa')+' = '+correcta+'.',
    recurso: RECURSO_TRIGONOMETRIA_M2,
  };
}
function generaProblemaAltura(){
  const terna = pick(TERNAS_PITAGORICAS);
  const distancia = terna[1];
  const altura = terna[0];
  const hipotenusa = terna[2];
  const enunciado = 'Para calcular la altura de un poste, un trabajador se ubica a '+distancia+' m de su base y forma con la cuerda que llega a la punta del poste una hipotenusa de '+hipotenusa+' m. ¿Cuál es la altura del poste?';
  const opts = uniqueDistractors(altura, 2, 30, 5, 4).map(function(n){ return {label:n+' m', value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: altura, speakText: enunciado, cols:2, panel:true,
    explain: 'Con catetos '+distancia+' e hipotenusa '+hipotenusa+', el otro cateto (la altura) mide '+altura+' m, ya que '+distancia+'² + '+altura+'² = '+hipotenusa+'².',
    recurso: RECURSO_TRIGONOMETRIA_M2,
  };
}
export function genTrigonometriaEpjaM2Round(){
  return Math.random()<0.6 ? generaRazonTrigonometrica() : generaProblemaAltura();
}

/* ---------------- Estadística: Tablas y Muestras ---------------- */
const RECURSO_ESTADISTICA_MUESTRAS_M2 = 'Una <b>tabla de frecuencia</b> con datos agrupados en intervalos muestra cuántos datos caen dentro de cada rango — un <b>histograma</b> es su representación gráfica con barras. Una <b>muestra</b> es un subconjunto representativo de una población más grande; si la muestra está bien elegida, sus resultados permiten <b>caracterizar</b> (describir con confianza) a toda la población, sin necesidad de encuestar a cada persona — un método clave en estudios de mercado, encuestas de opinión o estudios de salud pública.';
function generaFrecuenciaHistograma(){
  const intervalos = ['0 a 20 años','21 a 40 años','41 a 60 años','61 a 80 años'];
  const frecuencias = [randInt(5,15), randInt(20,40), randInt(15,35), randInt(3,12)];
  const total = frecuencias.reduce(function(a,b){ return a+b; },0);
  const preguntaTotal = Math.random()<0.5;
  let correcta, enunciado, explain;
  const tabla = intervalos.map(function(iv,i){ return iv+': '+frecuencias[i]+' personas'; }).join('. ');
  if(preguntaTotal){
    correcta = total;
    enunciado = 'Una encuesta de salud agrupó a sus encuestados por edad: '+tabla+'. ¿Cuántas personas fueron encuestadas en total?';
    explain = 'El total es la suma de todas las frecuencias: '+frecuencias.join(' + ')+' = '+total+'.';
  } else {
    const maxIdx = frecuencias.indexOf(Math.max.apply(null,frecuencias));
    correcta = intervalos[maxIdx];
    enunciado = 'Una encuesta de salud agrupó a sus encuestados por edad: '+tabla+'. ¿Qué intervalo de edad tiene la mayor frecuencia?';
    explain = 'El intervalo con mayor frecuencia es '+intervalos[maxIdx]+', con '+frecuencias[maxIdx]+' personas.';
  }
  const opts = preguntaTotal
    ? uniqueDistractors(correcta, total-15, total+15, 4, 4).map(function(n){ return {label:String(n), value:n}; })
    : shuffle(intervalos).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: explain,
    recurso: RECURSO_ESTADISTICA_MUESTRAS_M2,
  };
}
const CARACTERIZAR_POBLACION_M2_BANK = [
  { escenario:'Una encuesta representativa a 500 trabajadores de una fábrica mostró que el 70% prefiere turnos flexibles.', pregunta:'¿Qué se puede inferir razonablemente sobre el total de trabajadores de esa fábrica?', correcta:'Es probable que una mayoría similar de todos los trabajadores prefiera turnos flexibles', opts:['No se puede saber nada sobre el resto de los trabajadores','Todos los trabajadores sin excepción prefieren turnos flexibles','La muestra no tiene ninguna relación con la población total'] },
  { escenario:'Un estudio de mercado representativo con 1000 consumidores mostró que el 40% prefiere comprar productos locales.', pregunta:'¿Qué conclusión es razonable a partir de esta muestra representativa?', correcta:'Aproximadamente un 40% de la población de consumidores podría preferir productos locales', opts:['El 100% de los consumidores prefiere productos locales','La muestra no permite ninguna conclusión sobre la población','Solo esas 1000 personas tienen esa preferencia, nadie más'] },
  { escenario:'Para que una muestra permita caracterizar bien a una población, ¿qué característica debe tener?', pregunta:'¿Qué característica debe tener una muestra para representar bien a una población?', correcta:'Debe ser representativa, reflejando la diversidad de la población', opts:['Debe incluir solo a personas de un mismo grupo específico','Debe ser lo más pequeña posible sin importar su composición','No importa cómo se seleccione, cualquier grupo sirve igual'] },
  { escenario:'Una encuesta de salud pública a una muestra representativa de 2000 personas de una comuna mostró que el 15% fuma regularmente.', pregunta:'¿Qué se puede inferir sobre la comuna completa a partir de esta muestra?', correcta:'Es razonable estimar que cerca del 15% de la población de la comuna fuma regularmente', opts:['El 100% de la comuna fuma','No se puede estimar nada sobre la comuna a partir de la muestra','Solo esas 2000 personas fuman, el resto no'] },
  { escenario:'Un sondeo representativo a 800 votantes mostró que el 55% apoya una propuesta municipal.', pregunta:'¿Qué se puede inferir razonablemente sobre el resultado en toda la comuna?', correcta:'Es probable que la propuesta tenga un apoyo similar en el conjunto de la comuna', opts:['El resultado no tiene relación alguna con el resto de la comuna','Todos los votantes de la comuna apoyan la propuesta','Solo esas 800 personas tienen una opinión al respecto'] },
];
function generaCaracterizarPoblacion(){
  const item = pick(CARACTERIZAR_POBLACION_M2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' '+item.pregunta, cols:2, panel:true,
    explain: 'La respuesta correcta es: '+item.correcta+'.',
    recurso: RECURSO_ESTADISTICA_MUESTRAS_M2,
  };
}
export function genEstadisticaMuestrasEpjaM2Round(){
  return Math.random()<0.5 ? generaFrecuenciaHistograma() : generaCaracterizarPoblacion();
}

/* ---------------- Probabilidad ---------------- */
const RECURSO_PROBABILIDAD_M2 = 'La <b>probabilidad condicional</b> calcula la probabilidad de un evento sabiendo que otro evento ya ocurrió (por ejemplo, la probabilidad de sacar una carta roja sabiendo que ya se sacó una figura). La <b>probabilidad de una suma</b> (P(A o B)) se usa cuando los eventos son mutuamente excluyentes: se suman sus probabilidades individuales. La <b>probabilidad de un producto</b> (P(A y B)) se usa cuando los eventos son independientes: se multiplican sus probabilidades individuales — útil, por ejemplo, para calcular la probabilidad de dos eventos sucesivos, como sacar dos productos defectuosos seguidos en un control de calidad.';
function generaProbabilidadCondicional(){
  const total = pick([20,24,30]);
  const subgrupo = randInt(Math.floor(total/2), total-2);
  const favorables = randInt(1, subgrupo-1);
  const d = gcd(favorables, subgrupo);
  const correcta = (favorables/d)+'/'+(subgrupo/d);
  const enunciado = 'En un taller hay '+total+' trabajadores, de los cuales '+subgrupo+' tienen más de 5 años de experiencia. De esos con más experiencia, '+favorables+' saben soldadura especializada. Si se elige al azar a un trabajador con más de 5 años de experiencia, ¿cuál es la probabilidad de que sepa soldadura especializada?';
  const opciones = [correcta];
  while(opciones.length<4){
    const f2 = randInt(1, subgrupo-1);
    const d2 = gcd(f2, subgrupo);
    const cand = (f2/d2)+'/'+(subgrupo/d2);
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: 'La probabilidad condicional es '+favorables+'/'+subgrupo+' = '+correcta+', considerando solo a los trabajadores con más experiencia.',
    recurso: RECURSO_PROBABILIDAD_M2,
  };
}
function generaProbabilidadSuma(){
  const total = pick([10,20,30,40]);
  const a = randInt(1, Math.floor(total/3));
  const b = randInt(1, Math.floor(total/3));
  const favorables = a+b;
  const d = gcd(favorables, total);
  const correcta = (favorables/d)+'/'+(total/d);
  const enunciado = 'En una caja de '+total+' piezas hay '+a+' piezas rojas y '+b+' piezas azules (el resto son de otros colores). Si se saca una pieza al azar, ¿cuál es la probabilidad de que sea roja o azul?';
  const opciones = [correcta];
  while(opciones.length<4){
    const f2 = randInt(1, total-1);
    const d2 = gcd(f2, total);
    const cand = (f2/d2)+'/'+(total/d2);
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: 'Como son mutuamente excluyentes, se suman: '+a+'/'+total+' + '+b+'/'+total+' = '+favorables+'/'+total+' = '+correcta+'.',
    recurso: RECURSO_PROBABILIDAD_M2,
  };
}
function generaProbabilidadProducto(){
  const total = pick([10,20]);
  const defectuosos = randInt(1, Math.floor(total/4));
  const dUno = gcd(defectuosos, total);
  const pUno = (defectuosos/dUno)+'/'+(total/dUno);
  const numFrac = defectuosos*defectuosos;
  const denFrac = total*total;
  const dDos = gcd(numFrac, denFrac);
  const correcta = (numFrac/dDos)+'/'+(denFrac/dDos);
  const enunciado = 'En un control de calidad, la probabilidad de que un producto salga defectuoso es '+pUno+'. Si se revisan dos productos de forma independiente, ¿cuál es la probabilidad de que ambos salgan defectuosos?';
  const opciones = [correcta];
  while(opciones.length<4){
    const f2 = randInt(1, denFrac-1);
    const d2 = gcd(f2, denFrac);
    const cand = (f2/d2)+'/'+(denFrac/d2);
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: 'Como son independientes, se multiplican: '+pUno+' × '+pUno+' = '+correcta+'.',
    recurso: RECURSO_PROBABILIDAD_M2,
  };
}
export function genProbabilidadEpjaM2Round(){
  const roll = Math.random();
  if(roll<0.34) return generaProbabilidadCondicional();
  if(roll<0.67) return generaProbabilidadSuma();
  return generaProbabilidadProducto();
}

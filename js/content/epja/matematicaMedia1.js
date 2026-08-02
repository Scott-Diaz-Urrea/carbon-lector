import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Media: Educación Matemática ----------------
   Nivel 1 Media equivale a 1°-2° medio (ver content/grades.js). Fuente real: "Temario Primer
   Nivel de Educación Media", Decreto Supremo N°257 de 2009 (epja.mineduc.cl, versión 2026
   1er semestre). El eje NM1 Matemática es mucho más denso que Básica: números enteros y
   racionales en contexto, potencias de base racional y exponente entero, aproximación de
   irracionales, proporcionalidad directa/inversa/porcentual, lenguaje algebraico y
   operatoria con expresiones (productos notables), funciones lineal vs. afín, ecuaciones de
   primer grado con una incógnita, sistemas de ecuaciones de primer grado con dos incógnitas,
   geometría (ángulos, polígonos, posición de rectas), semejanza/escala/Teorema de Thales,
   transformaciones isométricas, perímetro/área/volumen, medidas de tendencia central,
   probabilidad de Laplace, y tablas de frecuencia/gráficos — 8 módulos para cubrir el eje
   completo sin dejar ningún objetivo fuera. Siguiendo la convención del proyecto de preferir
   contenido dinámico/aleatorio sobre bancos estáticos, la mayoría de los generadores calculan
   valores al azar en cada ronda; solo los conceptos puramente clasificatorios (proporción
   directa/inversa, transformaciones isométricas, Teorema de Thales) usan un banco curado de
   escenarios. Contextos de vida adulta (dinero en pesos chilenos, trabajo, mediciones reales)
   en vez de escolares/infantiles, mismo criterio que el resto de EPJA. */

export const MATEMATICA_EPJA_M1_MODULES = [
  {id:'numerosRacionalesEpjaM1', label:'Números Enteros y Racionales', open:true, key:'numerosRacionalesEpjaM1'},
  {id:'potenciasIrracionalesEpjaM1', label:'Potencias e Irracionales', open:true, key:'potenciasIrracionalesEpjaM1'},
  {id:'proporcionalidadEpjaM1', label:'Proporcionalidad y Porcentajes', open:true, key:'proporcionalidadEpjaM1'},
  {id:'algebraEpjaM1', label:'Álgebra', open:true, key:'algebraEpjaM1'},
  {id:'funcionesEcuacionesEpjaM1', label:'Funciones y Ecuaciones', open:true, key:'funcionesEcuacionesEpjaM1'},
  {id:'geometriaSemejanzaEpjaM1', label:'Geometría: Ángulos y Semejanza', open:true, key:'geometriaSemejanzaEpjaM1'},
  {id:'transformacionesMedicionEpjaM1', label:'Transformaciones y Medición', open:true, key:'transformacionesMedicionEpjaM1'},
  {id:'estadisticaProbabilidadEpjaM1', label:'Estadística y Probabilidad', open:true, key:'estadisticaProbabilidadEpjaM1'},
];
export const MATEMATICA_EPJA_M1_POS = [
  {x:22,y:94},{x:68,y:82},{x:24,y:68},{x:70,y:54},{x:24,y:40},{x:70,y:26},{x:24,y:12},{x:70,y:2}
];

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }

/* ---------------- Números Enteros y Racionales ---------------- */
const RECURSO_NUMEROS_RACIONALES_M1 = 'Los <b>números enteros</b> (positivos, negativos y el cero) permiten comparar y operar en contextos cotidianos como la temperatura, una deuda o una altitud. Los <b>números racionales</b> se pueden escribir tanto en forma <b>decimal</b> como <b>fraccionaria</b>, y ambas formas representan la misma cantidad — por eso es útil saber convertir entre una y otra para comparar dos cantidades, por ejemplo al calcular un pago parcial o repartir un gasto entre varias personas.';
function generaOperatoriaEnteros(){
  const a = randInt(-15,15);
  const b = randInt(-15,15);
  const c = randInt(1,15);
  const useMinus = Math.random()<0.5;
  const resultado = useMinus ? a - b + c : a + b - c;
  const enunciado = useMinus
    ? 'Resuelve: '+a+' − ('+b+') + '+c
    : 'Resuelve: '+a+' + ('+b+') − '+c;
  const opts = uniqueDistractors(resultado, resultado-20, resultado+20, 6, 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: 'El resultado correcto es '+resultado+'.',
    recurso: RECURSO_NUMEROS_RACIONALES_M1,
  };
}
function generaComparacionRacionales(){
  const den = pick([2,4,5,8,10]);
  const num = randInt(1, den*3);
  const fraccionDecimal = num/den;
  const fraccionRedondeada = Math.round(fraccionDecimal*100)/100;
  let delta = randInt(-30,30);
  if(delta===0) delta = 15;
  let otroDecimal = Math.round((fraccionDecimal + delta/100)*100)/100;
  if(otroDecimal === fraccionRedondeada) otroDecimal = Math.round((otroDecimal+0.2)*100)/100;
  const fraccionLabel = num+'/'+den;
  const otroLabel = otroDecimal.toString().replace('.',',');
  const mayor = fraccionDecimal > otroDecimal ? fraccionLabel : otroLabel;
  const opts = shuffle([fraccionLabel, otroLabel]).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">Compara: '+fraccionLabel+' y '+otroLabel+'</p><p class="prompt-hint">¿Cuál de estos dos números es mayor?</p>',
    options: opts, correctValue: mayor, speakText: '¿Cuál es mayor, '+fraccionLabel+' o '+otroLabel+'?', cols:2, panel:true,
    explain: fraccionLabel+' equivale a '+fraccionDecimal.toString().replace('.',',')+', así que el mayor es '+mayor+'.',
    recurso: RECURSO_NUMEROS_RACIONALES_M1,
  };
}
export function genNumerosRacionalesEpjaM1Round(){
  return Math.random()<0.5 ? generaOperatoriaEnteros() : generaComparacionRacionales();
}

/* ---------------- Potencias e Irracionales ---------------- */
const RECURSO_POTENCIAS_IRRACIONALES_M1 = 'Una <b>potencia</b> de base racional y exponente entero es una forma abreviada de escribir una multiplicación repetida (por ejemplo, 2³ = 2×2×2 = 8), útil para expresar números muy grandes o muy pequeños. Al multiplicar o dividir potencias de <b>igual base</b>, los exponentes se suman o restan respectivamente. Un <b>número irracional</b> (como √2 o √5) no se puede escribir como una fracción exacta, pero sí se puede <b>aproximar</b> ubicándolo entre dos números enteros consecutivos — una habilidad útil para estimar medidas o cantidades sin necesitar una calculadora.';
function generaPotencia(){
  const base = randInt(2,6);
  const exp = randInt(2,4);
  const resultado = Math.pow(base, exp);
  const enunciado = 'Calcula: '+base+'^'+exp;
  const opts = uniqueDistractors(resultado, 1, resultado*3, Math.max(6,Math.floor(resultado*0.4)), 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p><p class="prompt-hint">'+base+' elevado a '+exp+' significa multiplicar '+base+' por sí mismo '+exp+' veces.</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: base+' elevado a '+exp+' es '+resultado+'.',
    recurso: RECURSO_POTENCIAS_IRRACIONALES_M1,
  };
}
function generaPropiedadPotencias(){
  const base = randInt(2,5);
  const e1 = randInt(2,4);
  const e2 = randInt(2,4);
  const esMultiplicacion = Math.random()<0.5;
  const expResultado = esMultiplicacion ? e1+e2 : Math.abs(e1-e2);
  const enunciado = esMultiplicacion
    ? base+'^'+e1+' multiplicado por '+base+'^'+e2
    : base+'^'+(e1+e2)+' dividido por '+base+'^'+e2;
  const correcta = base+'^'+expResultado;
  const distractoresExp = uniqueDistractors(expResultado, 1, 12, 3, 4).filter(function(n){ return n!==expResultado; });
  const opciones = [correcta].concat(distractoresExp.slice(0,3).map(function(n){ return base+'^'+n; }));
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">Expresa como una sola potencia: '+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: 'Expresa como una sola potencia: '+enunciado, cols:2, panel:true,
    explain: 'La respuesta correcta es '+correcta+', porque al '+(esMultiplicacion?'multiplicar':'dividir')+' potencias de igual base se '+(esMultiplicacion?'suman':'restan')+' los exponentes.',
    recurso: RECURSO_POTENCIAS_IRRACIONALES_M1,
  };
}
function generaIrracional(){
  const noCuadrados = [2,3,5,6,7,8,10,11,12,13,14,15,17,18,20];
  const n = pick(noCuadrados);
  const raiz = Math.sqrt(n);
  const piso = Math.floor(raiz);
  const techo = piso+1;
  const correcta = piso+' y '+techo;
  const opciones = [correcta];
  while(opciones.length<4){
    const p2 = randInt(Math.max(0,piso-3), piso+3);
    const cand = p2+' y '+(p2+1);
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">¿Entre qué dos números enteros consecutivos se encuentra la raíz cuadrada de '+n+'?</p>',
    options: opts, correctValue: correcta, speakText: '¿Entre qué dos números enteros consecutivos se encuentra la raíz cuadrada de '+n+'?', cols:2, panel:true,
    explain: 'La raíz cuadrada de '+n+' está entre '+piso+' y '+techo+', porque '+piso+'² = '+(piso*piso)+' y '+techo+'² = '+(techo*techo)+'.',
    recurso: RECURSO_POTENCIAS_IRRACIONALES_M1,
  };
}
export function genPotenciasIrracionalesEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.34) return generaPotencia();
  if(roll<0.67) return generaPropiedadPotencias();
  return generaIrracional();
}

/* ---------------- Proporcionalidad y Porcentajes ---------------- */
const RECURSO_PROPORCIONALIDAD_M1 = 'En una <b>proporcionalidad directa</b>, cuando una cantidad aumenta, la otra también aumenta en la misma proporción (por ejemplo, más horas trabajadas, más pago). En una <b>proporcionalidad inversa</b>, cuando una cantidad aumenta, la otra disminuye (por ejemplo, más personas repartiendo una tarea, menos tiempo toma cada una). El <b>porcentaje</b> es una forma de expresar una razón sobre 100, muy usada para calcular descuentos, aumentos o intereses en situaciones de la vida diaria, como una boleta de compra o un contrato de trabajo.';
const PROPORCION_TIPO_M1_BANK = [
  { escenario:'Mientras más horas trabaje un obrero a destajo, más dinero recibirá al final del día.', correcta:'Proporcionalidad directa' },
  { escenario:'Mientras más obreros se sumen a pintar una casa, menos tiempo tomará terminar el trabajo.', correcta:'Proporcionalidad inversa' },
  { escenario:'Mientras más kilos de fruta se compren, más se pagará en total.', correcta:'Proporcionalidad directa' },
  { escenario:'Mientras más rápido viaje un vehículo, menos tiempo tomará recorrer la misma distancia.', correcta:'Proporcionalidad inversa' },
  { escenario:'Mientras más litros de bencina se echen al auto, más dinero se pagará.', correcta:'Proporcionalidad directa' },
  { escenario:'Mientras más grifos se abran para llenar una piscina, menos tiempo tomará llenarla.', correcta:'Proporcionalidad inversa' },
];
function generaProporcionTipo(){
  const item = pick(PROPORCION_TIPO_M1_BANK);
  const opts = shuffle(['Proporcionalidad directa','Proporcionalidad inversa']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Qué tipo de proporcionalidad describe esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' ¿Qué tipo de proporcionalidad es esta?', cols:2, panel:true,
    explain: 'Esta situación es un ejemplo de <b>'+item.correcta+'</b>.',
    recurso: RECURSO_PROPORCIONALIDAD_M1,
  };
}
function generaPorcentaje(){
  const precio = randInt(4,60)*1000;
  const pct = pick([10,15,20,25,30,50]);
  const descuento = Math.round(precio*pct/100);
  const esDescuento = Math.random()<0.6;
  const resultado = esDescuento ? precio-descuento : precio+descuento;
  const enunciado = 'Un producto cuesta $'+precio.toLocaleString('es-CL')+' y tiene un '+(esDescuento?'descuento':'recargo')+' del '+pct+'%. ¿Cuál es el precio final?';
  const opts = uniqueDistractors(resultado, 1000, precio*2, Math.max(1000,Math.round(precio*0.1)), 4).map(function(n){ return {label:'$'+n.toLocaleString('es-CL'), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: 'El '+pct+'% de $'+precio.toLocaleString('es-CL')+' es $'+descuento.toLocaleString('es-CL')+', así que el precio final es $'+resultado.toLocaleString('es-CL')+'.',
    recurso: RECURSO_PROPORCIONALIDAD_M1,
  };
}
function generaRazon(){
  const a = randInt(2,20);
  const b = randInt(2,20);
  const d = gcd(a,b);
  const correcta = (a/d)+':'+(b/d);
  const opciones = [correcta];
  while(opciones.length<4){
    const a2 = randInt(2,20), b2 = randInt(2,20);
    const d2 = gcd(a2,b2);
    const cand = (a2/d2)+':'+(b2/d2);
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">En un grupo de trabajo hay '+a+' hombres y '+b+' mujeres.</p><p class="prompt-hint">¿Cuál es la razón simplificada entre hombres y mujeres?</p>',
    options: opts, correctValue: correcta, speakText: 'Hay '+a+' hombres y '+b+' mujeres. ¿Cuál es la razón simplificada entre hombres y mujeres?', cols:2, panel:true,
    explain: 'La razón '+a+':'+b+' simplificada es '+correcta+'.',
    recurso: RECURSO_PROPORCIONALIDAD_M1,
  };
}
export function genProporcionalidadEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.34) return generaProporcionTipo();
  if(roll<0.67) return generaPorcentaje();
  return generaRazon();
}

/* ---------------- Álgebra ---------------- */
const RECURSO_ALGEBRA_M1 = 'El <b>lenguaje algebraico</b> permite traducir una frase cotidiana a una expresión con letras y números (por ejemplo, "el doble de un número más cinco" se escribe 2x + 5). Al <b>reducir términos semejantes</b> se simplifica una expresión sumando o restando los términos que tienen la misma parte literal. Los <b>productos notables</b> son multiplicaciones de expresiones algebraicas que siguen un patrón fijo, como el cuadrado de un binomio o la suma por su diferencia — reconocerlos ahorra tiempo al operar con expresiones algebraicas.';
function generaTraducirFrase(){
  const frases = [
    { texto:'El doble de un número más cinco', correcta:'2x + 5' },
    { texto:'El triple de un número menos siete', correcta:'3x − 7' },
    { texto:'La mitad de un número más tres', correcta:'x/2 + 3' },
    { texto:'Un número aumentado en diez', correcta:'x + 10' },
    { texto:'Un número disminuido en cuatro', correcta:'x − 4' },
    { texto:'El cuádruple de un número', correcta:'4x' },
  ];
  const item = pick(frases);
  const otras = frases.filter(function(f){ return f.correcta!==item.correcta; });
  const distractores = shuffle(otras).slice(0,3).map(function(f){ return f.correcta; });
  const opts = shuffle([item.correcta].concat(distractores)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">Traduce a lenguaje algebraico: "'+item.texto+'"</p>',
    options: opts, correctValue: item.correcta, speakText: 'Traduce a lenguaje algebraico: '+item.texto, cols:2, panel:true,
    explain: '"'+item.texto+'" se traduce como: '+item.correcta+'.',
    recurso: RECURSO_ALGEBRA_M1,
  };
}
function generaReducirTerminos(){
  const c1 = randInt(2,9);
  const c2 = randInt(1,8);
  const c3 = randInt(1,6);
  const suma = Math.random()<0.5;
  const resultado = suma ? c1+c2-c3 : c1-c2+c3;
  const enunciado = suma
    ? c1+'x + '+c2+'x − '+c3+'x'
    : c1+'x − '+c2+'x + '+c3+'x';
  const correcta = resultado+'x';
  const distractores = uniqueDistractors(resultado, resultado-8, resultado+8, 4, 4).filter(function(n){ return n!==resultado; }).slice(0,3).map(function(n){ return n+'x'; });
  const opts = shuffle([correcta].concat(distractores)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">Reduce los términos semejantes: '+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: 'Reduce los términos semejantes: '+enunciado, cols:2, panel:true,
    explain: 'Al reducir los términos semejantes, el resultado es '+correcta+'.',
    recurso: RECURSO_ALGEBRA_M1,
  };
}
function generaProductoNotable(){
  const productos = [
    { expresion:'(a + b)²', correcta:'a² + 2ab + b²' },
    { expresion:'(a − b)²', correcta:'a² − 2ab + b²' },
    { expresion:'(a + b)(a − b)', correcta:'a² − b²' },
  ];
  const item = pick(productos);
  const otras = productos.filter(function(p){ return p.correcta!==item.correcta; }).map(function(p){ return p.correcta; });
  const opts = shuffle([item.correcta].concat(otras)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">¿Cuál es el desarrollo del producto notable '+item.expresion+'?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál es el desarrollo del producto notable '+item.expresion+'?', cols:2, panel:true,
    explain: 'El desarrollo de '+item.expresion+' es: '+item.correcta+'.',
    recurso: RECURSO_ALGEBRA_M1,
  };
}
export function genAlgebraEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.34) return generaTraducirFrase();
  if(roll<0.67) return generaReducirTerminos();
  return generaProductoNotable();
}

/* ---------------- Funciones y Ecuaciones ---------------- */
const RECURSO_FUNCIONES_ECUACIONES_M1 = 'Una <b>función lineal</b> tiene la forma y = mx (pasa siempre por el origen), mientras que una <b>función afín</b> tiene la forma y = mx + n, con n distinto de cero (parte de un valor inicial antes de crecer). Resolver una <b>ecuación de primer grado</b> significa encontrar el valor de la incógnita que hace verdadera la igualdad, despejando paso a paso. Un <b>sistema de ecuaciones</b> con dos incógnitas busca un par de valores que satisfaga ambas ecuaciones al mismo tiempo — útil, por ejemplo, para repartir un monto de dinero entre dos personas cumpliendo dos condiciones a la vez.';
function generaClasificarFuncion(){
  const m = randInt(2,9);
  const n = randInt(0,10);
  const esAfin = n!==0;
  const formula = esAfin ? 'y = '+m+'x + '+n : 'y = '+m+'x';
  const correcta = esAfin ? 'Función afín' : 'Función lineal';
  const opts = shuffle(['Función lineal','Función afín']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+formula+'</p><p class="prompt-hint">¿Esta fórmula corresponde a una función lineal o a una función afín?</p>',
    options: opts, correctValue: correcta, speakText: formula+' ¿Es una función lineal o afín?', cols:2, panel:true,
    explain: formula+' es una <b>'+correcta+'</b>'+(esAfin?', porque tiene un término independiente distinto de cero.':', porque pasa por el origen.'),
    recurso: RECURSO_FUNCIONES_ECUACIONES_M1,
  };
}
function generaResolverEcuacion(){
  const x = randInt(-12,12);
  const m = randInt(2,8);
  const n = randInt(-15,15);
  const c = m*x+n;
  const nStr = n>=0 ? ' + '+n : ' − '+Math.abs(n);
  const enunciado = 'Resuelve para x: '+m+'x'+nStr+' = '+c;
  const opts = uniqueDistractors(x, x-10, x+10, 5, 4).map(function(n2){ return {label:String(n2), value:n2}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: x, speakText: enunciado, cols:2, panel:true,
    explain: 'El valor de x que cumple la ecuación es '+x+'.',
    recurso: RECURSO_FUNCIONES_ECUACIONES_M1,
  };
}
function generaEvaluarFuncion(){
  const m = randInt(2,7);
  const n = randInt(1,10);
  const x = randInt(1,10);
  const y = m*x+n;
  const enunciado = 'Si y = '+m+'x + '+n+', ¿cuál es el valor de y cuando x = '+x+'?';
  const opts = uniqueDistractors(y, y-15, y+15, 6, 4).map(function(n2){ return {label:String(n2), value:n2}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: y, speakText: enunciado, cols:2, panel:true,
    explain: 'Al reemplazar x = '+x+', y = '+m+'×'+x+' + '+n+' = '+y+'.',
    recurso: RECURSO_FUNCIONES_ECUACIONES_M1,
  };
}
export function genFuncionesEcuacionesEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.34) return generaClasificarFuncion();
  if(roll<0.67) return generaResolverEcuacion();
  return generaEvaluarFuncion();
}

/* ---------------- Geometría: Ángulos y Semejanza ---------------- */
const RECURSO_GEOMETRIA_SEMEJANZA_M1 = 'Los <b>ángulos</b> se clasifican según su medida (agudo, recto, obtuso, extendido), y las <b>rectas</b> en un plano pueden ser paralelas (nunca se cruzan), perpendiculares (se cruzan formando un ángulo recto) o secantes (se cruzan en cualquier otro ángulo). Dos figuras son <b>semejantes</b> cuando tienen la misma forma pero distinto tamaño, manteniendo sus lados en la misma proporción — el fundamento de los planos a escala. El <b>Teorema de Thales</b> permite calcular una medida desconocida a partir de una proporción entre segmentos, muy usado en la construcción y en la lectura de mapas.';
function generaClasificarAngulo(){
  const grados = randInt(1,359);
  let correcta;
  if(grados===90) correcta = 'Recto';
  else if(grados===180) correcta = 'Extendido';
  else if(grados<90) correcta = 'Agudo';
  else correcta = 'Obtuso';
  const opts = shuffle(['Agudo','Recto','Obtuso','Extendido']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">Un ángulo mide '+grados+'°.</p><p class="prompt-hint">¿Cómo se clasifica este ángulo?</p>',
    options: opts, correctValue: correcta, speakText: 'Un ángulo mide '+grados+' grados. ¿Cómo se clasifica?', cols:2, panel:true,
    explain: 'Un ángulo de '+grados+'° se clasifica como <b>'+correcta+'</b>.',
    recurso: RECURSO_GEOMETRIA_SEMEJANZA_M1,
  };
}
const RECTAS_M1_BANK = [
  { escenario:'Los dos rieles de una línea de tren, que nunca se juntan por más que se extiendan.', correcta:'Paralelas' },
  { escenario:'Las líneas de una cancha de fútbol que forman las esquinas del área grande.', correcta:'Perpendiculares' },
  { escenario:'Dos calles de una ciudad que se cruzan formando una esquina en ángulo agudo.', correcta:'Secantes' },
  { escenario:'Los bordes superior e inferior de una puerta, que jamás se tocan.', correcta:'Paralelas' },
  { escenario:'El palo vertical y el travesaño horizontal de un arco de fútbol.', correcta:'Perpendiculares' },
];
function generaPosicionRectas(){
  const item = pick(RECTAS_M1_BANK);
  const opts = shuffle(['Paralelas','Perpendiculares','Secantes']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Qué posición relativa describen estas rectas?</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' ¿Qué posición relativa tienen?', cols:2, panel:true,
    explain: 'Estas rectas son <b>'+item.correcta+'</b>.',
    recurso: RECURSO_GEOMETRIA_SEMEJANZA_M1,
  };
}
function generaEscala(){
  const escala = pick([50,100,200]);
  const enunciado = 'Un plano usa la escala 1:'+escala+'. Si en el plano un muro mide 10 cm, ¿cuántos centímetros mide el muro real?';
  const opts = uniqueDistractors(10*escala, 100, 10*escala*3, 300, 4).map(function(n){ return {label:n+' cm', value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: 10*escala, speakText: enunciado, cols:2, panel:true,
    explain: 'Con escala 1:'+escala+', 10 cm en el plano equivalen a '+(10*escala)+' cm reales.',
    recurso: RECURSO_GEOMETRIA_SEMEJANZA_M1,
  };
}
export function genGeometriaSemejanzaEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.34) return generaClasificarAngulo();
  if(roll<0.67) return generaPosicionRectas();
  return generaEscala();
}

/* ---------------- Transformaciones y Medición ---------------- */
const RECURSO_TRANSFORMACIONES_MEDICION_M1 = 'Las <b>transformaciones isométricas</b> cambian la posición de una figura sin cambiar su forma ni su tamaño: la <b>traslación</b> la desplaza en línea recta, la <b>reflexión</b> la refleja como en un espejo, y la <b>rotación</b> la gira en torno a un punto. Calcular el <b>perímetro</b> (contorno), el <b>área</b> (superficie) o el <b>volumen</b> (espacio que ocupa un cuerpo) de una figura o cuerpo geométrico es una habilidad práctica constante, por ejemplo al calcular cuánto material se necesita para cercar un terreno o pintar una pared.';
const TRANSFORMACIONES_M1_BANK = [
  { escenario:'Una pieza de un mosaico se desliza 5 cm hacia la derecha sin girar ni cambiar de forma.', correcta:'Traslación' },
  { escenario:'La imagen de un edificio se refleja en la superficie de un lago, como un espejo.', correcta:'Reflexión' },
  { escenario:'Las aspas de un ventilador giran en torno a su eje central.', correcta:'Rotación' },
  { escenario:'Una fila de sillas se corre completa 2 metros hacia el fondo de la sala.', correcta:'Traslación' },
  { escenario:'Las manecillas de un reloj giran en torno al centro de la esfera.', correcta:'Rotación' },
];
function generaTransformacion(){
  const item = pick(TRANSFORMACIONES_M1_BANK);
  const opts = shuffle(['Traslación','Reflexión','Rotación']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Qué transformación isométrica describe esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' ¿Qué transformación es esta?', cols:2, panel:true,
    explain: 'Esta situación es una <b>'+item.correcta+'</b>.',
    recurso: RECURSO_TRANSFORMACIONES_MEDICION_M1,
  };
}
function generaAreaPerimetro(){
  const base = randInt(3,15);
  const altura = randInt(3,15);
  const esArea = Math.random()<0.5;
  const resultado = esArea ? base*altura : (base+altura)*2;
  const enunciado = 'Un terreno rectangular mide '+base+' m de largo por '+altura+' m de ancho. ¿Cuál es su '+(esArea?'área':'perímetro')+'?';
  const unidad = esArea ? ' m²' : ' m';
  const opts = uniqueDistractors(resultado, 1, resultado*3, Math.max(5,Math.round(resultado*0.3)), 4).map(function(n){ return {label:n+unidad, value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: esArea
      ? 'El área es largo por ancho: '+base+' × '+altura+' = '+resultado+' m².'
      : 'El perímetro es la suma de los 4 lados: 2×('+base+' + '+altura+') = '+resultado+' m.',
    recurso: RECURSO_TRANSFORMACIONES_MEDICION_M1,
  };
}
function generaVolumenPrisma(){
  const largo = randInt(2,10);
  const ancho = randInt(2,10);
  const alto = randInt(2,10);
  const resultado = largo*ancho*alto;
  const enunciado = 'Una bodega tiene forma de prisma rectangular: '+largo+' m de largo, '+ancho+' m de ancho y '+alto+' m de alto. ¿Cuál es su volumen?';
  const opts = uniqueDistractors(resultado, 1, resultado*3, Math.max(10,Math.round(resultado*0.3)), 4).map(function(n){ return {label:n+' m³', value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: 'El volumen es largo × ancho × alto: '+largo+' × '+ancho+' × '+alto+' = '+resultado+' m³.',
    recurso: RECURSO_TRANSFORMACIONES_MEDICION_M1,
  };
}
export function genTransformacionesMedicionEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.34) return generaTransformacion();
  if(roll<0.67) return generaAreaPerimetro();
  return generaVolumenPrisma();
}

/* ---------------- Estadística y Probabilidad ---------------- */
const RECURSO_ESTADISTICA_PROBABILIDAD_M1 = 'Las <b>medidas de tendencia central</b> (media, mediana y moda) resumen un conjunto de datos en un solo valor representativo. La <b>probabilidad de Laplace</b> se calcula dividiendo el número de casos favorables por el número total de casos posibles, siempre que todos los resultados sean igualmente probables — por ejemplo, al calcular la probabilidad de que un producto defectuoso salga en un control de calidad. Interpretar <b>tablas de frecuencia</b> o <b>gráficos</b> permite entender rápidamente cómo se distribuyen datos reales, como las ventas de un negocio o los resultados de una encuesta.';
function generaMedia(){
  const datos = [randInt(2,10), randInt(2,10), randInt(2,10), randInt(2,10)];
  const suma = datos.reduce(function(a,b){ return a+b; },0);
  const media = Math.round((suma/datos.length)*10)/10;
  const enunciado = 'Un trabajador registró estas horas extra en 4 semanas: '+datos.join(', ')+'. ¿Cuál es el promedio (media)?';
  const opts = uniqueDistractors(Math.round(media), Math.max(1,media-6), media+6, 3, 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: Math.round(media), speakText: enunciado, cols:2, panel:true,
    explain: 'La media es la suma de los datos dividida por la cantidad de datos: '+suma+' ÷ 4 = '+media+'.',
    recurso: RECURSO_ESTADISTICA_PROBABILIDAD_M1,
  };
}
function generaModaMediana(){
  const esModa = Math.random()<0.5;
  const modaValor = randInt(1,10);
  const otros = [];
  while(otros.length<3){
    const cand = randInt(1,10);
    if(cand!==modaValor && otros.indexOf(cand)===-1) otros.push(cand);
  }
  const datos = shuffle([modaValor, modaValor].concat(otros));
  const moda = modaValor;
  const ordenados = datos.slice().sort(function(a,b){ return a-b; });
  const mediana = ordenados[Math.floor(ordenados.length/2)];
  const resultado = esModa ? moda : mediana;
  const enunciado = 'Los montos de propina (en miles de pesos) que recibió un repartidor en 5 días fueron: '+datos.join(', ')+'. ¿Cuál es la '+(esModa?'moda':'mediana')+' de estos datos?';
  const opts = uniqueDistractors(resultado, 1, 12, 3, 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: resultado, speakText: enunciado, cols:2, panel:true,
    explain: esModa
      ? 'La moda es el valor que más se repite: '+moda+'.'
      : 'Al ordenar los datos ('+ordenados.join(', ')+'), la mediana (el valor central) es '+mediana+'.',
    recurso: RECURSO_ESTADISTICA_PROBABILIDAD_M1,
  };
}
function generaProbabilidad(){
  const total = pick([5,8,10,12,20]);
  const favorables = randInt(1, total-1);
  const d = gcd(favorables, total);
  const correcta = (favorables/d)+'/'+(total/d);
  const opciones = [correcta];
  while(opciones.length<4){
    const f2 = randInt(1, total-1);
    const d2 = gcd(f2,total);
    const cand = (f2/d2)+'/'+(total/d2);
    if(opciones.indexOf(cand)===-1) opciones.push(cand);
  }
  const enunciado = 'En una caja hay '+total+' piezas, de las cuales '+favorables+' están defectuosas. Si se saca una pieza al azar, ¿cuál es la probabilidad de que esté defectuosa?';
  const opts = shuffle(opciones).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+enunciado+'</p>',
    options: opts, correctValue: correcta, speakText: enunciado, cols:2, panel:true,
    explain: 'La probabilidad es casos favorables sobre casos totales: '+favorables+'/'+total+' = '+correcta+'.',
    recurso: RECURSO_ESTADISTICA_PROBABILIDAD_M1,
  };
}
export function genEstadisticaProbabilidadEpjaM1Round(){
  const roll = Math.random();
  if(roll<0.25) return generaMedia();
  if(roll<0.5) return generaModaMediana();
  return generaProbabilidad();
}

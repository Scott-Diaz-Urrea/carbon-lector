import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 2 de Educación Básica: Educación Matemática ----------------
   Mismo marco que matematicaNivel1.js: Nivel 2 Básica equivale a 5°-6° básico. Fuente real:
   "Temario Segundo Nivel de Educación Básica", Decreto Supremo N°257 de 2009
   (epja.mineduc.cl, versión 2026 1er semestre). A diferencia de Lenguaje/Matemática de
   Nivel 1 (ya migrados a las nuevas Bases EPJA 2024, Decreto N°10/2022), el subsector
   "NB2 Educación Matemática" todavía se rige por el decreto anterior. El temario lista 17
   objetivos de evaluación sin ejes formalmente separados, pero agrupables en 4 bloques:
   1) Números (factores/múltiplos/divisores; relaciones de orden y equivalencia entre
   fracciones/decimales/naturales; operatoria escrita de suma/resta/multiplicación/división
   con fracciones y decimales); 2) Cálculo y problemas (prioridad de operaciones,
   redondeo/estimación, resolución de problemas con las 4 operaciones); 3) Geometría
   (perímetro de polígonos, área de cuadrados/rectángulos/triángulos, volumen de prismas
   rectos, y problemas asociados); 4) Datos (tablas y gráficos de barra, promedio
   aritmético, y problemas que los involucran).
   Los 6 módulos de este archivo cubren los 4 bloques: Múltiplos, Factores y Divisores
   (bloque 1), Fracciones y Decimales (bloque 1), Operatoria Combinada y Problemas (bloque
   2), Perímetro y Área + Volumen de Prismas (bloque 3, en 2 módulos separados dada la
   densidad del temario), y Datos, Gráficos y Promedio (bloque 4). Ningún objetivo de NB2
   Matemática queda fuera del motor de opción múltiple. Mismo criterio que matematicaNivel1.js:
   contextos de vida adulta (compras, trabajo, terrenos, trámites) en vez de escolares. */

export const MATEMATICA_EPJA_N2_MODULES = [
  {id:'multiplosFactoresEpjaN2', label:'Múltiplos y Factores', open:true, key:'multiplosFactoresEpjaN2'},
  {id:'fraccionesDecimalesEpjaN2', label:'Fracciones y Decimales', open:true, key:'fraccionesDecimalesEpjaN2'},
  {id:'operatoriaEpjaN2', label:'Operatoria y Problemas', open:true, key:'operatoriaEpjaN2'},
  {id:'perimetroAreaEpjaN2', label:'Perímetro y Área', open:true, key:'perimetroAreaEpjaN2'},
  {id:'volumenEpjaN2', label:'Volumen de Prismas', open:true, key:'volumenEpjaN2'},
  {id:'datosPromedioEpjaN2', label:'Datos y Promedio', open:true, key:'datosPromedioEpjaN2'},
];
export const MATEMATICA_EPJA_N2_POS = [
  {x:22,y:92},{x:68,y:78},{x:24,y:62},{x:68,y:46},{x:24,y:30},{x:68,y:12}
];

const RECURSO_MULTIPLOS_FACTORES_N2 = 'Un <b>múltiplo</b> de un número se obtiene multiplicándolo por otro número natural (12, 18 y 24 son múltiplos de 6, porque 6×2=12, 6×3=18, 6×4=24). Un <b>factor</b> o <b>divisor</b> de un número es aquel que lo divide de forma exacta, sin dejar resto (6 es divisor de 24 porque 24÷6=4 exacto). Todo número tiene al menos dos divisores: el 1 y sí mismo. Encontrar los divisores de un número sirve, por ejemplo, para repartir una cantidad en partes iguales sin que sobre nada, y reconocer múltiplos ayuda a identificar patrones de repetición, como turnos o ciclos que se repiten cada cierta cantidad de días.';
const DIVISOR_N2_BANK = [
  { n:24, correcta:8, opts:[5,7,9] },
  { n:18, correcta:9, opts:[4,5,8] },
  { n:20, correcta:5, opts:[3,6,7] },
  { n:30, correcta:6, opts:[4,7,8] },
  { n:36, correcta:9, opts:[5,7,8] },
  { n:42, correcta:7, opts:[4,5,8] },
  { n:15, correcta:5, opts:[2,4,6] },
  { n:28, correcta:4, opts:[3,5,6] },
];
const MULTIPLO_N2_BANK = [
  { n:4, correcta:16, opts:[14,15,18] },
  { n:6, correcta:18, opts:[15,16,20] },
  { n:7, correcta:21, opts:[20,22,24] },
  { n:9, correcta:27, opts:[24,25,28] },
  { n:5, correcta:35, opts:[32,33,34] },
  { n:8, correcta:32, opts:[30,31,33] },
  { n:3, correcta:12, opts:[10,11,13] },
  { n:10, correcta:50, opts:[45,48,52] },
];
const TODOS_FACTORES_N2_BANK = [
  { n:6, correcta:'1, 2, 3, 6', opts:['1, 2, 6, 12','1, 3, 6, 9','2, 3, 4, 6'] },
  { n:8, correcta:'1, 2, 4, 8', opts:['1, 2, 3, 8','1, 4, 6, 8','2, 4, 6, 8'] },
  { n:9, correcta:'1, 3, 9', opts:['1, 3, 6, 9','1, 2, 3, 9','3, 6, 9'] },
  { n:10, correcta:'1, 2, 5, 10', opts:['1, 2, 4, 10','1, 5, 10, 15','2, 4, 5, 10'] },
  { n:12, correcta:'1, 2, 3, 4, 6, 12', opts:['1, 2, 3, 6, 12','1, 2, 4, 6, 8, 12','2, 3, 4, 6, 12'] },
  { n:15, correcta:'1, 3, 5, 15', opts:['1, 3, 5, 9, 15','1, 5, 10, 15','3, 5, 10, 15'] },
];
export function genMultiplosFactoresEpjaN2Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(DIVISOR_N2_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es un divisor de '+item.n+'?</p>',
      options: opts, correctValue: item.correcta, speakText: '¿Cuál de estos números es un divisor de '+item.n+'?', cols:2, panel:true,
      explain: item.n+' ÷ '+item.correcta+' = '+(item.n/item.correcta)+', un resultado exacto, así que <b>'+item.correcta+'</b> es divisor de '+item.n+'.',
      recurso: RECURSO_MULTIPLOS_FACTORES_N2,
    };
  }
  if(roll<0.67){
    const item = pick(MULTIPLO_N2_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">¿Cuál de estos números es un múltiplo de '+item.n+'?</p>',
      options: opts, correctValue: item.correcta, speakText: '¿Cuál de estos números es un múltiplo de '+item.n+'?', cols:2, panel:true,
      explain: item.correcta+' ÷ '+item.n+' = '+(item.correcta/item.n)+', un resultado exacto, así que <b>'+item.correcta+'</b> es múltiplo de '+item.n+'.',
      recurso: RECURSO_MULTIPLOS_FACTORES_N2,
    };
  }
  const item = pick(TODOS_FACTORES_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuáles son todos los factores (divisores) del número '+item.n+'?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuáles son todos los factores del número '+item.n+'?', cols:2, panel:true,
    explain: 'Los factores de '+item.n+' son: <b>'+item.correcta+'</b>.',
    recurso: RECURSO_MULTIPLOS_FACTORES_N2,
  };
}

const RECURSO_FRACCIONES_DECIMALES_N2 = 'Las <b>fracciones</b>, los <b>números decimales</b> y los <b>números naturales</b> son tres formas distintas de representar cantidades, y se pueden comparar y ordenar entre sí (1/2 es igual a 0,5; 3/4 es mayor que 1/2). Para <b>sumar o restar fracciones</b> con el mismo denominador, se suman o restan solo los numeradores y el denominador se mantiene igual (1/4 + 2/4 = 3/4). Para <b>multiplicar fracciones</b>, se multiplican los numeradores entre sí y los denominadores entre sí (1/2 × 1/3 = 1/6). Convertir entre fracción y decimal (por ejemplo, 0,5 = 1/2) es útil porque muchas situaciones cotidianas —precios, medidas, porcentajes— usan una u otra forma según el contexto.';
const COMPARAR_DECIMAL_N2_BANK = [
  { a:0.75, b:0.7 }, { a:0.4, b:0.45 }, { a:0.9, b:0.85 }, { a:0.25, b:0.3 },
  { a:0.6, b:0.55 }, { a:0.15, b:0.2 }, { a:0.8, b:0.78 }, { a:0.35, b:0.3 },
];
const SUMA_FRACCION_N2_BANK = [
  { a:'1/4', b:'2/4', correcta:'3/4', opts:['1/4','4/4','2/8'] },
  { a:'2/5', b:'1/5', correcta:'3/5', opts:['1/5','3/10','5/5'] },
  { a:'1/6', b:'3/6', correcta:'4/6', opts:['2/6','4/12','1/6'] },
  { a:'3/8', b:'2/8', correcta:'5/8', opts:['1/8','5/16','6/8'] },
  { a:'2/7', b:'3/7', correcta:'5/7', opts:['1/7','5/14','6/7'] },
  { a:'4/9', b:'2/9', correcta:'6/9', opts:['2/9','6/18','8/9'] },
];
const MULT_FRACCION_N2_BANK = [
  { a:'1/2', b:'1/3', correcta:'1/6', opts:['1/5','2/5','1/3'] },
  { a:'1/4', b:'1/2', correcta:'1/8', opts:['1/6','2/6','1/2'] },
  { a:'2/3', b:'1/2', correcta:'2/6', opts:['3/5','2/5','1/6'] },
  { a:'1/3', b:'1/3', correcta:'1/9', opts:['2/6','1/6','2/9'] },
  { a:'1/4', b:'1/3', correcta:'1/12', opts:['2/7','1/7','2/12'] },
  { a:'2/3', b:'1/3', correcta:'2/9', opts:['3/6','2/6','3/9'] },
];
const DECIMAL_FRACCION_N2_BANK = [
  { decimal:0.5, correcta:'1/2', opts:['1/4','1/5','2/3'] },
  { decimal:0.25, correcta:'1/4', opts:['1/2','1/5','3/4'] },
  { decimal:0.75, correcta:'3/4', opts:['1/2','1/4','2/3'] },
  { decimal:0.1, correcta:'1/10', opts:['1/5','1/2','1/100'] },
  { decimal:0.2, correcta:'1/5', opts:['1/2','1/10','2/10'] },
  { decimal:0.4, correcta:'2/5', opts:['4/5','1/4','2/10'] },
];
export function genFraccionesDecimalesEpjaN2Round(){
  const roll = Math.random();
  if(roll<0.25){
    const item = pick(COMPARAR_DECIMAL_N2_BANK);
    const opts = shuffle([{label:String(item.a), value:'A'},{label:String(item.b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número decimal <b>mayor</b></p>',
      options: opts, correctValue: item.a>item.b ? 'A' : 'B', speakText: '¿Cuál número decimal es mayor, '+item.a+' o '+item.b+'?', cols:2, panel:true,
      explain: 'El '+Math.max(item.a,item.b)+' es mayor que el '+Math.min(item.a,item.b)+'.',
      recurso: RECURSO_FRACCIONES_DECIMALES_N2,
    };
  }
  if(roll<0.5){
    const item = pick(SUMA_FRACCION_N2_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+item.a+' + '+item.b+' = ?</p>',
      options: opts, correctValue: item.correcta, speakText: item.a+' más '+item.b+', ¿cuánto es?', cols:2, panel:true,
      explain: 'Con el mismo denominador, se suman los numeradores: '+item.a+' + '+item.b+' = <b>'+item.correcta+'</b>.',
      recurso: RECURSO_FRACCIONES_DECIMALES_N2,
    };
  }
  if(roll<0.75){
    const item = pick(MULT_FRACCION_N2_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+item.a+' × '+item.b+' = ?</p>',
      options: opts, correctValue: item.correcta, speakText: item.a+' multiplicado por '+item.b+', ¿cuánto es?', cols:2, panel:true,
      explain: 'Se multiplican los numeradores y los denominadores por separado: '+item.a+' × '+item.b+' = <b>'+item.correcta+'</b>.',
      recurso: RECURSO_FRACCIONES_DECIMALES_N2,
    };
  }
  const item = pick(DECIMAL_FRACCION_N2_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿A qué fracción equivale el número decimal '+item.decimal+'?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿A qué fracción equivale el número '+item.decimal+'?', cols:2, panel:true,
    explain: 'El decimal '+item.decimal+' equivale a la fracción <b>'+item.correcta+'</b>.',
    recurso: RECURSO_FRACCIONES_DECIMALES_N2,
  };
}

const RECURSO_OPERATORIA_N2 = 'Cuando una expresión combina varias operaciones, existe un orden que se debe respetar: primero se resuelven las <b>multiplicaciones y divisiones</b>, y recién después las <b>sumas y restas</b> (2 + 3 × 4 no es 20, sino 14, porque primero se calcula 3 × 4 = 12 y luego se suma 2). El <b>redondeo</b> y la <b>estimación</b> permiten aproximar una cantidad para calcular más rápido o para comprobar si un resultado exacto tiene sentido (por ejemplo, redondear $2.980 a $3.000 para calcular un gasto aproximado). Resolver <b>problemas</b> con estas herramientas —identificando primero qué operación corresponde y en qué orden— es una habilidad que se usa constantemente al organizar un presupuesto o calcular un gasto.';
export function genOperatoriaEpjaN2Round(){
  const roll = Math.random();
  if(roll<0.34){
    const a = randInt(2,9), b = randInt(2,9), c = randInt(2,9);
    const correcta = a + b*c;
    const opts = uniqueDistractors(correcta, 5, 100, 6, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+a+' + '+b+' × '+c+' = ?</p>',
      options: opts, correctValue: correcta, speakText: a+' más '+b+' por '+c+', ¿cuánto es?', cols:2, panel:true,
      explain: 'Primero se multiplica: '+b+' × '+c+' = '+(b*c)+'. Luego se suma: '+a+' + '+(b*c)+' = <b>'+correcta+'</b>.',
      recurso: RECURSO_OPERATORIA_N2,
    };
  }
  if(roll<0.67){
    const precio = pick([1980,2950,4890,3450,5980,7450,2480,6950]);
    const redondeado = Math.round(precio/1000)*1000;
    const opts = uniqueDistractors(redondeado, 1000, 10000, 1000, 4).map(function(v){ return {label:'$'+v.toLocaleString('es-CL'), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un producto cuesta $'+precio.toLocaleString('es-CL')+'. Redondeado a los mil pesos más cercanos, ¿cuánto es?</p>',
      options: opts, correctValue: redondeado, speakText: '¿Cuánto es $'+precio+' redondeado a los mil pesos más cercanos?', cols:2, panel:true,
      explain: 'Redondeado a los mil pesos más cercanos, $'+precio.toLocaleString('es-CL')+' se aproxima a <b>$'+redondeado.toLocaleString('es-CL')+'</b>.',
      recurso: RECURSO_OPERATORIA_N2,
    };
  }
  const precioUnidad = pick([650,890,1200,750,980,1450]);
  const cantidad = randInt(3,8);
  const pagaCon = precioUnidad*cantidad + pick([500,1000,2000]);
  const vuelto = pagaCon - precioUnidad*cantidad;
  const opts = uniqueDistractors(vuelto, 100, 5000, 200, 4).map(function(v){ return {label:'$'+v.toLocaleString('es-CL'), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Compró '+cantidad+' unidades de un producto a $'+precioUnidad.toLocaleString('es-CL')+' cada una, y pagó con $'+pagaCon.toLocaleString('es-CL')+'. ¿Cuánto vuelto recibió?</p>',
    options: opts, correctValue: vuelto, speakText: '¿Cuánto vuelto recibió?', cols:2, panel:true,
    explain: 'Primero: '+precioUnidad+' × '+cantidad+' = '+(precioUnidad*cantidad)+'. Luego: $'+pagaCon.toLocaleString('es-CL')+' - $'+(precioUnidad*cantidad).toLocaleString('es-CL')+' = <b>$'+vuelto.toLocaleString('es-CL')+'</b> de vuelto.',
    recurso: RECURSO_OPERATORIA_N2,
  };
}

const RECURSO_PERIMETRO_AREA_N2 = 'El <b>perímetro</b> de un polígono es la suma de la medida de todos sus lados. El <b>área</b> mide cuánta superficie cubre una figura: en un cuadrado o rectángulo se calcula multiplicando largo por ancho, y en un <b>triángulo</b> se calcula multiplicando base por altura y dividiendo el resultado por 2. Las unidades de área más comunes son el centímetro cuadrado (cm²), el metro cuadrado (m²), el kilómetro cuadrado (km²) y la hectárea (usada para medir terrenos grandes, como campos o parcelas). Calcular perímetro y área sirve para resolver problemas reales, como saber cuánto cerco se necesita para un terreno o cuánta superficie tiene un sitio que se quiere vender o cultivar.';
export function genPerimetroAreaEpjaN2Round(){
  const roll = Math.random();
  if(roll<0.34){
    const lados = [randInt(3,15), randInt(3,15), randInt(3,15), randInt(3,15)];
    const perimetro = lados.reduce(function(a,b){ return a+b; }, 0);
    const opts = uniqueDistractors(perimetro, 10, 200, 8, 4).map(function(v){ return {label:v+' metros', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un terreno tiene forma de cuadrilátero con lados de '+lados.join(', ')+' metros. ¿Cuál es su perímetro?</p>',
      options: opts, correctValue: perimetro, speakText: '¿Cuál es el perímetro del terreno?', cols:2, panel:true,
      explain: 'Sumando todos los lados: '+lados.join(' + ')+' = <b>'+perimetro+' metros</b> de perímetro.',
      recurso: RECURSO_PERIMETRO_AREA_N2,
    };
  }
  if(roll<0.67){
    const largo = randInt(4,20), ancho = randInt(3,12);
    const area = largo*ancho;
    const opts = uniqueDistractors(area, 10, 300, 10, 4).map(function(v){ return {label:v+' metros cuadrados', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un terreno rectangular mide '+largo+' metros de largo y '+ancho+' metros de ancho. ¿Cuál es su área?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área del terreno?', cols:2, panel:true,
      explain: 'El área de un rectángulo es largo × ancho: '+largo+' × '+ancho+' = <b>'+area+' metros cuadrados</b>.',
      recurso: RECURSO_PERIMETRO_AREA_N2,
    };
  }
  const base = randInt(4,16)*2, altura = randInt(3,10);
  const area = (base*altura)/2;
  const opts = uniqueDistractors(area, 6, 150, 6, 4).map(function(v){ return {label:v+' metros cuadrados', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un sitio con forma de triángulo tiene '+base+' metros de base y '+altura+' metros de altura. ¿Cuál es su área?</p>',
    options: opts, correctValue: area, speakText: '¿Cuál es el área del sitio triangular?', cols:2, panel:true,
    explain: 'El área de un triángulo es (base × altura) ÷ 2: ('+base+' × '+altura+') ÷ 2 = <b>'+area+' metros cuadrados</b>.',
    recurso: RECURSO_PERIMETRO_AREA_N2,
  };
}

const RECURSO_VOLUMEN_N2 = 'El <b>volumen</b> de un prisma recto (como una caja, un contenedor o una pieza rectangular) mide cuánto espacio ocupa en tres dimensiones, y se calcula multiplicando su largo, su ancho y su alto. La unidad más común para expresar volumen es el <b>metro cúbico (m³)</b>, aunque también se usa el centímetro cúbico (cm³) para objetos pequeños. Calcular el volumen es útil en situaciones muy concretas de la vida diaria, como saber cuánta agua cabe en un estanque, cuánto material se necesita para llenar una excavación, o cuánta capacidad tiene una bodega o contenedor de carga.';
export function genVolumenEpjaN2Round(){
  const largo = randInt(2,10), ancho = randInt(2,8), alto = randInt(2,6);
  const volumen = largo*ancho*alto;
  const opts = uniqueDistractors(volumen, 8, 500, 15, 4).map(function(v){ return {label:v+' metros cúbicos', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un contenedor tiene forma de prisma recto: '+largo+' metros de largo, '+ancho+' metros de ancho y '+alto+' metros de alto. ¿Cuál es su volumen?</p>',
    options: opts, correctValue: volumen, speakText: '¿Cuál es el volumen del contenedor?', cols:2, panel:true,
    explain: 'El volumen de un prisma recto es largo × ancho × alto: '+largo+' × '+ancho+' × '+alto+' = <b>'+volumen+' metros cúbicos</b>.',
    recurso: RECURSO_VOLUMEN_N2,
  };
}

function barChartEpjaN2HTML(categorias){
  const max = Math.max.apply(null, categorias.map(function(c){ return c.valor; }));
  return '<div class="bar-chart">'+categorias.map(function(c){
    const h = Math.round((c.valor/max)*80)+20;
    return '<div class="bar-col"><div class="bar-value">'+c.valor+'</div><div class="bar-fill" style="height:'+h+'px;"></div><div class="bar-label">'+c.label+'</div></div>';
  }).join('')+'</div>';
}
const DATOS_EPJA_N2 = [
  { pregunta:'Se registraron los kilos de pan vendidos cada día en una panadería de barrio.', categorias:[{label:'Lunes',valor:18},{label:'Miércoles',valor:24},{label:'Viernes',valor:30}] },
  { pregunta:'Se registró la cantidad de pacientes atendidos por turno en una posta rural.', categorias:[{label:'Mañana',valor:16},{label:'Tarde',valor:22},{label:'Noche',valor:9}] },
  { pregunta:'Se encuestó a un grupo de vecinos sobre cuántas horas duermen en promedio cada noche.', categorias:[{label:'6 horas',valor:7},{label:'7 horas',valor:12},{label:'8 horas',valor:5}] },
  { pregunta:'Se registraron las ventas semanales de una ferretería, por tipo de producto.', categorias:[{label:'Herramientas',valor:14},{label:'Pintura',valor:9},{label:'Materiales',valor:21}] },
  { pregunta:'Se encuestó a un grupo de estudiantes adultos sobre cuántas horas dedican al estudio cada semana.', categorias:[{label:'Menos de 5',valor:6},{label:'5 a 10',valor:13},{label:'Más de 10',valor:8}] },
  { pregunta:'Se registró el número de llamadas recibidas en una oficina de atención ciudadana durante tres días.', categorias:[{label:'Martes',valor:28},{label:'Jueves',valor:19},{label:'Sábado',valor:11}] },
];
const PROMEDIO_EPJA_N2_BANK = [
  { valores:[12,18,15,19,16], contexto:'los kilómetros que recorrió un repartidor en 5 días distintos' },
  { valores:[8,10,9,7,11,9], contexto:'las horas trabajadas por un obrero durante 6 turnos' },
  { valores:[20,25,15,18,22], contexto:'los clientes atendidos en un almacén durante 5 días' },
  { valores:[6,9,7,8], contexto:'las horas de sueño de una persona durante 4 noches' },
  { valores:[14,20,18,16,12], contexto:'los pedidos entregados por un repartidor en 5 turnos distintos' },
  { valores:[5,8,6,9,7,7], contexto:'las visitas diarias recibidas por un puesto de feria durante 6 días' },
];
export function genDatosPromedioEpjaN2Round(){
  const roll = Math.random();
  if(roll<0.5){
    const item = pick(DATOS_EPJA_N2);
    const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
    const distract = item.categorias.filter(function(c){ return c.label!==maxCat.label; }).map(function(c){ return c.label; });
    const opts = shuffle([maxCat.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: barChartEpjaN2HTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál categoría tiene el valor más alto?</p>',
      options: opts, correctValue: maxCat.label, speakText: '¿Cuál categoría tiene el valor más alto?', cols:2, panel:true,
      explain: '<b>'+maxCat.label+'</b> tiene el valor más alto en este gráfico.',
      recurso: 'Un <b>gráfico de barras</b> muestra cada categoría como una barra, donde la altura representa su valor — mientras más alta la barra, mayor la cantidad. Esto permite comparar de un vistazo cuál categoría tiene más o menos, sin necesidad de leer cada número por separado. Interpretar correctamente un gráfico (identificar el valor más alto, el más bajo, o comparar dos categorías entre sí) es una habilidad que se usa constantemente al leer boletas, noticias y reportes de todo tipo.',
    };
  }
  const item = pick(PROMEDIO_EPJA_N2_BANK);
  const suma = item.valores.reduce(function(a,b){ return a+b; }, 0);
  const promedio = Math.round((suma/item.valores.length)*10)/10;
  const opts = uniqueDistractors(promedio, 1, 40, 2, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Estos son '+item.contexto+': '+item.valores.join(', ')+'. ¿Cuál es el promedio?</p>',
    options: opts, correctValue: promedio, speakText: '¿Cuál es el promedio de estos valores?', cols:2, panel:true,
    explain: 'Sumando todos los valores y dividiendo por la cantidad de datos: ('+item.valores.join(' + ')+') ÷ '+item.valores.length+' = <b>'+promedio+'</b> de promedio.',
    recurso: 'El <b>promedio aritmético</b> (o media) resume un conjunto de datos en un solo número representativo: se calcula sumando todos los valores y dividiendo el resultado por la cantidad de datos que se sumaron. Por ejemplo, el promedio de horas trabajadas en una semana ayuda a entender el ritmo general de trabajo, más allá de lo que pasó en un solo día. El promedio es una herramienta muy usada para resumir e interpretar información en la vida diaria: notas escolares, gastos mensuales, o rendimiento en el trabajo.',
  };
}

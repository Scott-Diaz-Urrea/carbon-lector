import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 1 de Educación Básica: Matemática ----------------
   Mismo marco que content/epja/lenguajeNivel1.js: fuente real es el "Temario Nivel 1
   de Educación Básica — Proceso de exámenes de Validación de Estudios Adultos (mayores
   de 18 años)", Decreto Supremo N°10 de 2022, Ministerio de Educación (epja.mineduc.cl,
   versión 2026). El temario de Matemática lista 11 objetivos de evaluación agrupados en
   3 ejes de contenido (Números y Operaciones aritméticas, Geometría, Estadística y
   Probabilidad): representar números naturales en palabras/símbolos y reconocer sus usos
   (conteo, medida, ordinal, código); comparar números y contar por agrupaciones;
   representar cantidades en distintas unidades de medida (tiempo, masa, longitud,
   monetarias) y resolver equivalencias entre ellas; resolver problemas con las 4
   operaciones básicas; explicar la regularidad de una secuencia numérica con patrón;
   describir características de triángulos y cuadriláteros (lados, ángulos, vértices,
   diagonales) y calcular su perímetro o área; y organizar/interpretar información en
   tablas de frecuencia, pictogramas, gráficos de barra y gráficos de líneas.
   Los 6 módulos de este archivo cubren los 3 ejes: Números Naturales y Unidades de
   Medida cubren "Números y Operaciones aritméticas" (junto con Operaciones y Problemas
   y Patrones y Secuencias), Perímetro y Área cubre "Geometría", y Datos y Gráficos cubre
   "Estadística y Probabilidad". Los contextos son deliberadamente de la vida adulta
   (compras, trabajo, trámites, comunidad) en vez de escolares/infantiles, igual que en
   lenguajeNivel1.js. */

export const MATEMATICA_EPJA_N1_MODULES = [
  {id:'numerosEpjaN1', label:'Números Naturales', open:true, key:'numerosEpjaN1'},
  {id:'unidadesMedidaEpjaN1', label:'Unidades de Medida', open:true, key:'unidadesMedidaEpjaN1'},
  {id:'operacionesEpjaN1', label:'Operaciones y Problemas', open:true, key:'operacionesEpjaN1'},
  {id:'patronesEpjaN1', label:'Patrones y Secuencias', open:true, key:'patronesEpjaN1'},
  {id:'perimetroAreaEpjaN1', label:'Perímetro y Área', open:true, key:'perimetroAreaEpjaN1'},
  {id:'datosEpjaN1', label:'Datos y Gráficos', open:true, key:'datosEpjaN1'},
];
export const MATEMATICA_EPJA_N1_POS = [
  {x:22,y:92},{x:68,y:78},{x:24,y:62},{x:68,y:46},{x:24,y:30},{x:68,y:12}
];

function numeroALetras(n){
  const UNIDADES = ['cero','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve'];
  const ESPECIALES = {10:'diez',11:'once',12:'doce',13:'trece',14:'catorce',15:'quince',16:'dieciséis',17:'diecisiete',18:'dieciocho',19:'diecinueve'};
  const DECENAS = {2:'veinte',3:'treinta',4:'cuarenta',5:'cincuenta',6:'sesenta',7:'setenta',8:'ochenta',9:'noventa'};
  const CENTENAS = {1:'ciento',2:'doscientos',3:'trescientos',4:'cuatrocientos',5:'quinientos',6:'seiscientos',7:'setecientos',8:'ochocientos',9:'novecientos'};
  function dosDigitos(n){
    if(n===0) return '';
    if(n<10) return UNIDADES[n];
    if(n<20) return ESPECIALES[n];
    const d = Math.floor(n/10), u = n%10;
    if(u===0) return DECENAS[d];
    if(d===2) return 'veinti'+UNIDADES[u];
    return DECENAS[d]+' y '+UNIDADES[u];
  }
  if(n<100) return dosDigitos(n) || 'cero';
  const c = Math.floor(n/100), resto = n%100;
  if(resto===0) return c===1 ? 'cien' : CENTENAS[c];
  return CENTENAS[c]+' '+dosDigitos(resto);
}

const USO_NUMERO_BANK = [
  { escenario:'En la sala de espera del consultorio, a cada persona le entregan un papel con un número para saber a quién le toca atenderse.', correcta:'Como código o turno', opts:['Como medida de longitud','Como medida de masa','Como medida de tiempo'] },
  { escenario:'Juan llegó en el tercer lugar de la carrera de su barrio.', correcta:'Como número ordinal (indica una posición)', opts:['Como código de identificación','Como unidad de medida','Como cantidad para contar objetos'] },
  { escenario:'En la feria hay 24 cajas de tomates apiladas junto al puesto.', correcta:'Como cantidad, para contar objetos', opts:['Como número ordinal','Como código de identificación','Como unidad de medida de tiempo'] },
  { escenario:'El paquete de arroz indica en su envase que pesa 1 kilogramo.', correcta:'Como unidad de medida (masa)', opts:['Como número ordinal','Como código de identificación','Como cantidad para contar personas'] },
  { escenario:'El número de la patente de un auto sirve para identificarlo entre todos los demás vehículos.', correcta:'Como código de identificación', opts:['Como número ordinal','Como unidad de medida','Como cantidad para contar'] },
  { escenario:'La reunión de la junta de vecinos comenzó a las 19 horas y terminó a las 21 horas.', correcta:'Como unidad de medida (tiempo)', opts:['Como código de identificación','Como número ordinal','Como cantidad para contar objetos'] },
];

export function genNumerosEpjaN1Round(){
  const recurso = 'Los números naturales se usan de formas muy distintas en la vida diaria, y reconocer cuál uso corresponde en cada situación ayuda a entender mejor la información: se usan para <b>contar</b> cantidades de objetos o personas (12 sillas, 24 cajas), como <b>unidad de medida</b> (1 kilogramo, 2 horas), como <b>ordinal</b> para indicar una posición en una secuencia (el tercer lugar, el segundo piso), y como <b>código</b> para identificar algo sin que el valor numérico en sí importe (el número de una patente, un número de turno). También es clave saber comparar números (cuál es mayor o menor) y representarlos tanto en cifras como en palabras, ya que ambas formas se usan constantemente en documentos, boletas y trámites de la vida cotidiana.';
  const roll = Math.random();
  if(roll<0.34){
    const n = randInt(11,999);
    const values = uniqueDistractors(n, 11, 999, 40, 4);
    const opts = values.map(function(v){ return {label:numeroALetras(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count" style="font-size:32px;">'+n+'</p><p class="prompt-hint">¿Cómo se lee este número en palabras?</p>',
      options: opts, correctValue: n, speakText: '¿Cómo se lee el número '+n+' en palabras?', cols:2, panel:true,
      explain: 'El número '+n+' se lee: <b>'+numeroALetras(n)+'</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    let a = randInt(10,999), b = randInt(10,999);
    while(a===b) b = randInt(10,999);
    const opts = shuffle([{label:String(a), value:'A'},{label:String(b), value:'B'}]);
    return {
      promptHTML: '<p class="prompt-hint">Toca el número <b>mayor</b></p>',
      options: opts, correctValue: a>b ? 'A' : 'B', speakText: '¿Cuál número es mayor, '+a+' o '+b+'?', cols:2, panel:true,
      explain: 'El '+Math.max(a,b)+' es mayor que el '+Math.min(a,b)+'.',
      recurso: recurso,
    };
  }
  const item = pick(USO_NUMERO_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Cómo se está usando el número en esta situación?</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario, cols:2, panel:true,
    explain: 'En esta situación, el número se usa: '+item.correcta.toLowerCase()+'.',
    recurso: recurso,
  };
}

const EQUIVALENCIA_BANK = [
  { pregunta:'¿Cuántos minutos son 2 horas?', correcta:120, min:10, max:300, spread:20, unidad:'minutos' },
  { pregunta:'¿Cuántos segundos son 3 minutos?', correcta:180, min:10, max:400, spread:30, unidad:'segundos' },
  { pregunta:'¿Cuántos gramos son 2 kilogramos?', correcta:2000, min:100, max:5000, spread:300, unidad:'gramos' },
  { pregunta:'¿Cuántos kilogramos son 3000 gramos?', correcta:3, min:1, max:20, spread:2, unidad:'kilogramos' },
  { pregunta:'¿Cuántos centímetros son 2 metros?', correcta:200, min:10, max:500, spread:30, unidad:'centímetros' },
  { pregunta:'¿Cuántos metros son 3 kilómetros?', correcta:3000, min:100, max:6000, spread:300, unidad:'metros' },
  { pregunta:'¿Cuántos minutos son media hora?', correcta:30, min:5, max:100, spread:10, unidad:'minutos' },
];
const UNIDAD_APROPIADA_BANK = [
  { escenario:'Medir la distancia entre Santiago y Valparaíso', correcta:'Kilómetros', opts:['Centímetros','Gramos','Segundos'] },
  { escenario:'Medir cuánto pesa una bolsa de papas en el mercado', correcta:'Kilogramos', opts:['Kilómetros','Minutos','Metros'] },
  { escenario:'Medir cuánto dura una reunión de trabajo', correcta:'Minutos u horas', opts:['Kilogramos','Metros','Toneladas'] },
  { escenario:'Medir el largo de una mesa de comedor', correcta:'Metros o centímetros', opts:['Toneladas','Horas','Kilómetros'] },
  { escenario:'Medir cuánto pesa un camión cargado de arena', correcta:'Toneladas', opts:['Centímetros','Segundos','Gramos'] },
  { escenario:'Medir el precio de un producto en el supermercado', correcta:'Pesos chilenos (u otra moneda)', opts:['Kilogramos','Metros','Minutos'] },
];
export function genUnidadesMedidaEpjaN1Round(){
  const recurso = 'Las unidades de medida permiten expresar cantidades de forma precisa: el <b>tiempo</b> se mide en segundos, minutos y horas (60 segundos = 1 minuto, 60 minutos = 1 hora); la <b>masa</b> en gramos, kilogramos y toneladas (1000 gramos = 1 kilogramo); la <b>longitud</b> en centímetros, metros y kilómetros (100 centímetros = 1 metro, 1000 metros = 1 kilómetro); y el dinero en unidades <b>monetarias</b> como el peso chileno, el euro o el dólar. Elegir la unidad correcta según lo que se está midiendo (kilómetros para una distancia entre ciudades, gramos para un ingrediente de cocina) evita errores grandes de cálculo, y saber convertir entre unidades de una misma magnitud es una habilidad que se usa en trámites, compras y en el trabajo.';
  const roll = Math.random();
  if(roll<0.6){
    const item = pick(EQUIVALENCIA_BANK);
    const opts = uniqueDistractors(item.correcta, item.min, item.max, item.spread, 4).map(function(v){ return {label:String(v)+' '+item.unidad, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La respuesta correcta es: '+item.correcta+' '+item.unidad+'.',
      recurso: recurso,
    };
  }
  const item = pick(UNIDAD_APROPIADA_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.escenario+'. ¿Qué unidad de medida es la más apropiada para esto?</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+'. ¿Qué unidad de medida es la más apropiada?', cols:2, panel:true,
    explain: 'La unidad más apropiada para esto es: '+item.correcta.toLowerCase()+'.',
    recurso: recurso,
  };
}

const OBJETOS_PRECIO_EPJA = [
  { emoji:'🍞', label:'un kilo de pan', precio:1800 },
  { emoji:'🥛', label:'un litro de leche', precio:1200 },
  { emoji:'🚌', label:'un pasaje de bus', precio:800 },
  { emoji:'💊', label:'una caja de medicamentos', precio:3500 },
  { emoji:'📓', label:'un cuaderno', precio:1500 },
  { emoji:'🧴', label:'un jabón de manos', precio:900 },
];
export function genOperacionesEpjaN1Round(){
  const recurso = 'Resolver un problema con números naturales significa identificar primero qué operación corresponde según lo que pide la situación: <b>sumar</b> cuando se juntan cantidades, <b>restar</b> cuando se calcula una diferencia o un vuelto, <b>multiplicar</b> cuando se repite una misma cantidad varias veces (por ejemplo, el costo total de comprar varias unidades de un mismo producto), y <b>dividir</b> cuando se reparte un total en partes iguales. Estas cuatro operaciones aparecen constantemente en situaciones cotidianas: calcular el vuelto de una compra, sumar los gastos del mes, o dividir una cuenta entre varias personas. Identificar qué operación resuelve el problema, antes de calcular, es tan importante como saber calcular bien.';
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(OBJETOS_PRECIO_EPJA);
    const cantidad = randInt(2,5);
    const total = item.precio*cantidad;
    const opts = uniqueDistractors(total, 500, 30000, 500, 4).map(function(v){ return {label:'$'+v.toLocaleString('es-CL'), value:v}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio.toLocaleString('es-CL')+'. Si compras '+cantidad+', ¿cuánto pagas en total?</p>',
      options: opts, correctValue: total, speakText: '¿Cuánto pagas por '+cantidad+' de '+item.label+'?', cols:2, panel:true,
      explain: '$'+item.precio.toLocaleString('es-CL')+' × '+cantidad+' = <b>$'+total.toLocaleString('es-CL')+'</b> en total.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const item = pick(OBJETOS_PRECIO_EPJA);
    const tienes = item.precio + pick([200,500,1000,2000]);
    const vuelto = tienes - item.precio;
    const opts = uniqueDistractors(vuelto, 100, 5000, 200, 4).map(function(v){ return {label:'$'+v.toLocaleString('es-CL'), value:v}; });
    return {
      promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">'+item.label+' cuesta $'+item.precio.toLocaleString('es-CL')+'. Si pagas con $'+tienes.toLocaleString('es-CL')+', ¿cuánto vuelto recibes?</p>',
      options: opts, correctValue: vuelto, speakText: '¿Cuánto vuelto recibes?', cols:2, panel:true,
      explain: '$'+tienes.toLocaleString('es-CL')+' - $'+item.precio.toLocaleString('es-CL')+' = <b>$'+vuelto.toLocaleString('es-CL')+'</b> de vuelto.',
      recurso: recurso,
    };
  }
  const total = randInt(4,10)*randInt(2,6);
  const grupos = pick([2,3,4,5].filter(function(g){ return total%g===0; }).concat([2]));
  const porGrupo = total/grupos;
  const opts = uniqueDistractors(porGrupo, 1, 30, 2, 4).map(function(v){ return {label:String(v)+' personas', value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Un grupo de '+total+' personas se reparte en partes iguales para formar '+grupos+' equipos de trabajo. ¿Cuántas personas quedan en cada equipo?</p>',
    options: opts, correctValue: porGrupo, speakText: '¿Cuántas personas quedan en cada equipo?', cols:2, panel:true,
    explain: total+' ÷ '+grupos+' = <b>'+porGrupo+' personas</b> por equipo.',
    recurso: recurso,
  };
}

export function genPatronesEpjaN1Round(){
  const recurso = 'Un <b>patrón numérico</b> es una secuencia de números que cambia siempre siguiendo la misma regla, por ejemplo sumar la misma cantidad en cada paso. Para descubrir la regla, se compara la diferencia entre dos números seguidos de la secuencia; una vez identificada esa diferencia, se puede predecir cualquier número siguiente sin necesidad de que alguien lo diga. Reconocer patrones numéricos es útil para organizar información que se repite de forma regular, como ahorros que crecen en la misma cantidad cada mes, o turnos que se reparten siguiendo un orden fijo.';
  const step = pick([2,3,5,10,50,100]);
  const start = randInt(1, 200);
  const seq = [start, start+step, start+2*step, start+3*step];
  const correct = start+4*step;
  const opts = uniqueDistractors(correct, 1, 2000, step, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">'+seq.join(', ')+', <span class="blank">?</span></p><p class="prompt-hint">¿Qué número sigue en esta secuencia?</p>',
    options: opts, correctValue: correct, speakText: '¿Qué número sigue en la secuencia?', cols:2, panel:true,
    explain: 'La secuencia avanza de <b>'+step+'</b> en <b>'+step+'</b>, así que después de '+seq[3]+' sigue <b>'+correct+'</b>.',
    recurso: recurso,
  };
}

const POLIGONO_EPJA_BANK = [
  { nombre:'Triángulo', lados:3, vertices:3 },
  { nombre:'Cuadrado', lados:4, vertices:4 },
  { nombre:'Rectángulo', lados:4, vertices:4 },
];
export function genPerimetroAreaEpjaN1Round(){
  const recurso = 'El <b>perímetro</b> de una figura es la suma de la medida de todos sus lados — útil, por ejemplo, para saber cuánta reja se necesita para cercar un patio. El <b>área</b> mide cuánta superficie cubre una figura: en un cuadrado o rectángulo se calcula multiplicando largo por ancho, y en un triángulo se calcula multiplicando base por altura y dividiendo el resultado por 2. Los <b>polígonos</b> como el triángulo (3 lados, 3 vértices) y el cuadrilátero (4 lados, 4 vértices, como el cuadrado o el rectángulo) se distinguen por su número de lados y vértices, y calcular su perímetro o área sirve para resolver problemas reales, como calcular cuánto material se necesita para cubrir un piso o cercar un terreno.';
  const roll = Math.random();
  if(roll<0.34){
    const lado = randInt(2,20);
    const perimetro = lado*4;
    const opts = uniqueDistractors(perimetro, 4, 100, 6, 4).map(function(v){ return {label:v+' metros', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un terreno cuadrado mide '+lado+' metros de lado. ¿Cuál es su perímetro?</p>',
      options: opts, correctValue: perimetro, speakText: '¿Cuál es el perímetro del terreno?', cols:2, panel:true,
      explain: 'El perímetro de un cuadrado es lado × 4: '+lado+' × 4 = <b>'+perimetro+' metros</b>.',
      recurso: recurso,
    };
  }
  if(roll<0.67){
    const largo = randInt(3,15), ancho = randInt(2,10);
    const area = largo*ancho;
    const opts = uniqueDistractors(area, 4, 200, 8, 4).map(function(v){ return {label:v+' metros cuadrados', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un terreno rectangular mide '+largo+' metros de largo y '+ancho+' metros de ancho. ¿Cuál es su área?</p>',
      options: opts, correctValue: area, speakText: '¿Cuál es el área del terreno?', cols:2, panel:true,
      explain: 'El área de un rectángulo es largo × ancho: '+largo+' × '+ancho+' = <b>'+area+' metros cuadrados</b>.',
      recurso: recurso,
    };
  }
  const item = pick(POLIGONO_EPJA_BANK);
  const preguntaLados = Math.random()<0.5;
  const correcta = preguntaLados ? item.lados : item.vertices;
  const opts = uniqueDistractors(correcta, 2, 8, 1, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuántos '+(preguntaLados?'lados':'vértices')+' tiene un '+item.nombre.toLowerCase()+'?</p>',
    options: opts, correctValue: correcta, speakText: '¿Cuántos '+(preguntaLados?'lados':'vértices')+' tiene un '+item.nombre.toLowerCase()+'?', cols:2, panel:true,
    explain: 'Un '+item.nombre.toLowerCase()+' tiene <b>'+correcta+' '+(preguntaLados?'lados':'vértices')+'</b>.',
    recurso: recurso,
  };
}

function barChartEpjaHTML(categorias){
  const max = Math.max.apply(null, categorias.map(function(c){ return c.valor; }));
  return '<div class="bar-chart">'+categorias.map(function(c){
    const h = Math.round((c.valor/max)*80)+20;
    return '<div class="bar-col"><div class="bar-value">'+c.valor+'</div><div class="bar-fill" style="height:'+h+'px;"></div><div class="bar-label">'+c.label+'</div></div>';
  }).join('')+'</div>';
}
const DATOS_EPJA_ENCUESTA = [
  { pregunta:'Se encuestó a los vecinos sobre el medio de transporte que más usan.', categorias:[{label:'Bus',valor:14},{label:'Auto',valor:8},{label:'A pie',valor:5}] },
  { pregunta:'Se registró la cantidad de atenciones diarias en un consultorio durante una semana.', categorias:[{label:'Lunes',valor:22},{label:'Miércoles',valor:18},{label:'Viernes',valor:25}] },
  { pregunta:'Se encuestó a un grupo de trabajadores sobre su turno preferido.', categorias:[{label:'Mañana',valor:12},{label:'Tarde',valor:9},{label:'Noche',valor:4}] },
  { pregunta:'Se registraron las ventas semanales de un almacén de barrio, por tipo de producto.', categorias:[{label:'Abarrotes',valor:30},{label:'Bebidas',valor:20},{label:'Aseo',valor:10}] },
  { pregunta:'Se encuestó a un grupo de estudiantes adultos sobre el motivo principal por el que retomaron sus estudios.', categorias:[{label:'Trabajo',valor:16},{label:'Familia',valor:11},{label:'Interés personal',valor:7}] },
];
export function genDatosEpjaN1Round(){
  const recurso = 'Organizar información en <b>tablas</b> y <b>gráficos</b> permite entenderla rápidamente sin tener que leer cada dato por separado. Un <b>gráfico de barras</b> muestra cada categoría como una barra: mientras más alta la barra, mayor es el valor que representa — así se puede comparar de un vistazo cuál categoría tiene más o menos. Una <b>tabla de frecuencia</b> muestra cuántas veces se repite cada dato, y un <b>pictograma</b> usa dibujos o íconos en vez de barras para representar cantidades. Leer estos gráficos correctamente —identificando el valor más alto, el más bajo, o el total sumando todas las categorías— es una habilidad útil para entender información que aparece constantemente en noticias, boletas y trámites.';
  const item = pick(DATOS_EPJA_ENCUESTA);
  const roll = Math.random();
  if(roll<0.5){
    const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
    const distract = item.categorias.filter(function(c){ return c.label!==maxCat.label; }).map(function(c){ return c.label; });
    const opts = shuffle([maxCat.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: barChartEpjaHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál categoría tiene el valor más alto?</p>',
      options: opts, correctValue: maxCat.label, speakText: '¿Cuál categoría tiene el valor más alto?', cols:2, panel:true,
      explain: '<b>'+maxCat.label+'</b> tiene el valor más alto en este gráfico.',
      recurso: recurso,
    };
  }
  const total = item.categorias.reduce(function(a,c){ return a+c.valor; }, 0);
  const opts = uniqueDistractors(total, 5, 100, 5, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: barChartEpjaHTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál es el total sumando todas las categorías?</p>',
    options: opts, correctValue: total, speakText: '¿Cuál es el total sumando todas las categorías?', cols:2, panel:true,
    explain: 'Sumando todas las categorías: '+item.categorias.map(function(c){ return c.valor; }).join(' + ')+' = <b>'+total+'</b> en total.',
    recurso: recurso,
  };
}

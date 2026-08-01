import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- EPJA — Nivel 3 de Educación Básica: Educación Matemática ----------------
   Mismo marco que matematicaNivel2.js: Nivel 3 Básica equivale a 7°-8° básico. Fuente real:
   "Temario Tercer Nivel de Educación Básica", Decreto Supremo N°257 de 2009 (epja.mineduc.cl,
   versión 2026 2do semestre). El subsector "NB3 Educación Matemática" lista 18 objetivos de
   evaluación sin ejes formalmente separados, agrupables en 6 bloques: 1) Números enteros
   (interpretación en contexto -temperatura, profundidad, haber/deber-, orden en la recta
   numérica, operatoria escrita de las 4 operaciones, propiedades con decimales/enteros);
   2) Potencias y notación científica (potencia de base racional positiva y exponente
   natural, notación científica con potencias de base 10); 3) Razones, proporciones,
   porcentajes y escala (razón, proporcionalidad directa/inversa, porcentaje como
   proporción/comparación por cociente, escala para calcular distancias reales, y los
   problemas de decimales/proporcionalidad/porcentaje de los OA11-12); 4) Geometría:
   Pitágoras y circunferencia (teorema de Pitágoras y su recíproco, elementos de la
   circunferencia -radio/diámetro/cuerda/tangente-, perímetro/área del círculo, volumen de
   cilindros); 5) Ángulos entre paralelas y triángulos (ángulos formados por dos paralelas
   cortadas por una transversal, suma de ángulos interiores/exteriores de un triángulo);
   6) Estadística (tablas, gráficos de barra y circulares, medidas de tendencia central
   -media/moda/mediana-, y problemas de análisis de datos).
   Los 6 módulos de este archivo cubren esos 6 bloques uno a uno. Ningún objetivo de NB3
   Matemática queda fuera del motor de opción múltiple. Mismo criterio que Nivel 1/2:
   contextos de vida adulta (trabajo, dinero, terrenos, trámites) en vez de escolares. */

export const MATEMATICA_EPJA_N3_MODULES = [
  {id:'numerosEnterosEpjaN3', label:'Números Enteros', open:true, key:'numerosEnterosEpjaN3'},
  {id:'potenciasNotacionEpjaN3', label:'Potencias y Notación Científica', open:true, key:'potenciasNotacionEpjaN3'},
  {id:'razonesProporcionesEpjaN3', label:'Razones, Porcentajes y Escala', open:true, key:'razonesProporcionesEpjaN3'},
  {id:'pitagorasCircunferenciaEpjaN3', label:'Pitágoras y Circunferencia', open:true, key:'pitagorasCircunferenciaEpjaN3'},
  {id:'angulosTriangulosEpjaN3', label:'Ángulos y Triángulos', open:true, key:'angulosTriangulosEpjaN3'},
  {id:'estadisticaEpjaN3', label:'Estadística y Tendencia Central', open:true, key:'estadisticaEpjaN3'},
];
export const MATEMATICA_EPJA_N3_POS = [
  {x:22,y:92},{x:68,y:78},{x:24,y:62},{x:68,y:46},{x:24,y:30},{x:68,y:12}
];

const RECURSO_ENTEROS_N3 = 'Los <b>números enteros</b> incluyen los positivos, los negativos y el cero, y sirven para representar situaciones donde existe una referencia de "cero" con valores por encima y por debajo: una temperatura bajo cero (-5°C), una profundidad bajo el nivel del mar (-200 metros), una deuda (haber y deber en una cuenta), o un desplazamiento en sentido contrario (retroceder 3 casilleros es -3). En la <b>recta numérica</b>, mientras más a la derecha está un número, mayor es: -2 es mayor que -8, aunque 8 sea mayor que 2 en valor absoluto. Para sumar o restar enteros con distinto signo, se resta el menor del mayor (en valor absoluto) y se conserva el signo del mayor; con el mismo signo, se suman los valores y se conserva ese signo.';
const ENTEROS_CONTEXTO_N3_BANK = [
  { escenario:'Una ciudad registró una temperatura de 5 grados bajo cero durante la madrugada.', correcta:-5, opts:[5,-50,50] },
  { escenario:'Un buzo se encuentra a 12 metros de profundidad bajo el nivel del mar.', correcta:-12, opts:[12,-120,120] },
  { escenario:'Una persona tiene una deuda de 8.000 pesos en su cuenta corriente.', correcta:-8000, opts:[8000,-800,800] },
  { escenario:'Un excursionista se encuentra a 350 metros de altura sobre el nivel del mar.', correcta:350, opts:[-350,35,-35] },
  { escenario:'Un jugador retrocedió 4 casilleros en un juego de mesa.', correcta:-4, opts:[4,-40,40] },
  { escenario:'Un ahorrista depositó 15.000 pesos adicionales en su cuenta.', correcta:15000, opts:[-15000,1500,-1500] },
];
export function genNumerosEnterosEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(ENTEROS_CONTEXTO_N3_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.escenario+' ¿Qué número entero representa esta situación?</p>',
      options: opts, correctValue: item.correcta, speakText: item.escenario+' ¿Qué número entero representa esta situación?', cols:2, panel:true,
      explain: 'Esta situación se representa con el número entero <b>'+item.correcta+'</b>.',
      recurso: RECURSO_ENTEROS_N3,
    };
  }
  if(roll<0.67){
    let a = randInt(-50,50), b = randInt(-50,50);
    while(b===a){ b = randInt(-50,50); }
    const nums = shuffle([a,b]);
    const mayor = Math.max(a,b);
    const opts = nums.map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Entre '+a+' y '+b+', ¿cuál número es mayor?</p>',
      options: opts, correctValue: mayor, speakText: '¿Cuál número es mayor, '+a+' o '+b+'?', cols:2, panel:true,
      explain: 'En la recta numérica, '+mayor+' está más a la derecha, así que <b>'+mayor+'</b> es el mayor.',
      recurso: RECURSO_ENTEROS_N3,
    };
  }
  const a = randInt(-30,30), b = randInt(-30,30);
  const suma = a+b;
  const opts = uniqueDistractors(suma, -100, 100, 8, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-count">('+a+') + ('+b+') = ?</p>',
    options: opts, correctValue: suma, speakText: a+' más '+b+', ¿cuánto es?', cols:2, panel:true,
    explain: '('+a+') + ('+b+') = <b>'+suma+'</b>.',
    recurso: RECURSO_ENTEROS_N3,
  };
}

const RECURSO_POTENCIAS_N3 = 'Una <b>potencia</b> se compone de una base y un exponente: la base se multiplica por sí misma tantas veces como indique el exponente (2³ = 2×2×2 = 8). Cuando la base es un número racional positivo (como una fracción o un decimal), el mismo principio aplica: (1/2)² = 1/2 × 1/2 = 1/4. La <b>notación científica</b> usa potencias de base 10 para expresar números muy grandes o muy pequeños de forma compacta: 3.000.000 se escribe como 3 × 10⁶, ya que multiplicar por 10⁶ equivale a agregar 6 ceros. Esta notación es muy usada en ciencias y en contextos donde se manejan cantidades grandes, como poblaciones, distancias o presupuestos nacionales.';
const POTENCIA_N3_BANK = [
  { base:2, exp:3, correcta:8 }, { base:3, exp:2, correcta:9 }, { base:4, exp:2, correcta:16 },
  { base:5, exp:2, correcta:25 }, { base:2, exp:4, correcta:16 }, { base:10, exp:2, correcta:100 },
  { base:2, exp:5, correcta:32 }, { base:6, exp:2, correcta:36 },
];
const NOTACION_CIENTIFICA_N3_BANK = [
  { numero:3000000, correcta:'3 × 10⁶', opts:['3 × 10⁵','3 × 10⁷','30 × 10⁵'] },
  { numero:45000, correcta:'4,5 × 10⁴', opts:['4,5 × 10³','4,5 × 10⁵','45 × 10³'] },
  { numero:200000, correcta:'2 × 10⁵', opts:['2 × 10⁴','2 × 10⁶','20 × 10⁴'] },
  { numero:7500000, correcta:'7,5 × 10⁶', opts:['7,5 × 10⁵','7,5 × 10⁷','75 × 10⁵'] },
  { numero:600, correcta:'6 × 10²', opts:['6 × 10¹','6 × 10³','60 × 10¹'] },
  { numero:9000000000, correcta:'9 × 10⁹', opts:['9 × 10⁸','9 × 10¹⁰','90 × 10⁸'] },
];
export function genPotenciasNotacionEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.5){
    const item = pick(POTENCIA_N3_BANK);
    const opts = uniqueDistractors(item.correcta, 1, 200, 10, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-count">'+item.base+'<sup>'+item.exp+'</sup> = ?</p>',
      options: opts, correctValue: item.correcta, speakText: item.base+' elevado a '+item.exp+', ¿cuánto es?', cols:2, panel:true,
      explain: item.base+'<sup>'+item.exp+'</sup> significa multiplicar '+item.base+' por sí mismo '+item.exp+' veces, lo que da <b>'+item.correcta+'</b>.',
      recurso: RECURSO_POTENCIAS_N3,
    };
  }
  const item = pick(NOTACION_CIENTIFICA_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cómo se escribe el número '+item.numero.toLocaleString('es-CL')+' en notación científica?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cómo se escribe '+item.numero+' en notación científica?', cols:2, panel:true,
    explain: 'El número '+item.numero.toLocaleString('es-CL')+' se escribe en notación científica como <b>'+item.correcta+'</b>.',
    recurso: RECURSO_POTENCIAS_N3,
  };
}

const RECURSO_RAZONES_N3 = 'Una <b>razón</b> compara dos cantidades (por cada 3 hombres hay 5 mujeres, razón 3:5). En una <b>proporcionalidad directa</b>, cuando una cantidad aumenta, la otra aumenta en la misma proporción (más horas trabajadas, más pago); en una <b>proporcionalidad inversa</b>, cuando una aumenta, la otra disminuye (más trabajadores en una tarea, menos tiempo para terminarla). Un <b>porcentaje</b> es una forma de expresar una proporción sobre 100 (25% es lo mismo que 25/100 o 0,25). La <b>escala</b> de un mapa o plano indica cuántas veces más grande es la realidad respecto al dibujo (una escala 1:1.000 significa que 1 cm en el plano equivale a 1.000 cm reales, o 10 metros).';
const RAZON_N3_BANK = [
  { pregunta:'En un curso hay 12 hombres y 20 mujeres. ¿Cuál es la razón entre hombres y mujeres, simplificada?', correcta:'3 : 5', opts:['5 : 3','12 : 20','2 : 3'] },
  { pregunta:'En una fábrica, por cada 4 productos revisados se encuentra 1 defectuoso. ¿Cuál es la razón entre productos defectuosos y productos revisados?', correcta:'1 : 4', opts:['4 : 1','1 : 3','2 : 4'] },
  { pregunta:'Una receta para 6 personas usa 2 tazas de arroz. ¿Cuál es la razón entre tazas de arroz y personas?', correcta:'1 : 3', opts:['3 : 1','2 : 6','6 : 2'] },
];
const PROPORCION_TIPO_N3_BANK = [
  { escenario:'Un obrero gana $3.000 por hora trabajada: a más horas, más pago total.', correcta:'Proporcionalidad directa', opts:['Proporcionalidad inversa'] },
  { escenario:'Si más trabajadores se suman a pintar una casa, el tiempo necesario para terminar disminuye.', correcta:'Proporcionalidad inversa', opts:['Proporcionalidad directa'] },
  { escenario:'El costo total de una compra aumenta según la cantidad de productos comprados al mismo precio unitario.', correcta:'Proporcionalidad directa', opts:['Proporcionalidad inversa'] },
  { escenario:'Repartir un mismo terreno entre más personas hace que a cada una le toque una porción más pequeña.', correcta:'Proporcionalidad inversa', opts:['Proporcionalidad directa'] },
];
const PORCENTAJE_N3_BANK = [
  { pregunta:'Un producto de $8.000 tiene un descuento del 25%. ¿Cuánto dinero se descuenta?', correcta:2000, opts:[4000,1000,3000], sufijo:'pesos' },
  { pregunta:'De 40 trabajadores de una empresa, el 30% pertenece al área de ventas. ¿Cuántos trabajadores hay en ventas?', correcta:12, opts:[10,15,8], sufijo:'trabajadores' },
  { pregunta:'Un sueldo de $500.000 tiene un aumento del 10%. ¿Cuánto aumenta el sueldo?', correcta:50000, opts:[100000,25000,5000], sufijo:'pesos' },
];
const ESCALA_N3_BANK = [
  { escenario:'Un plano usa la escala 1:1.000. Una distancia en el plano mide 4 cm.', correcta:40, opts:[4,400,4000], unidad:'metros' },
  { escenario:'Un mapa usa la escala 1:100.000. Una distancia en el mapa mide 3 cm.', correcta:3, opts:[30,0.3,300], unidad:'kilómetros' },
  { escenario:'Un plano de una casa usa la escala 1:50. Un muro mide 6 cm en el plano.', correcta:3, opts:[6,30,0.6], unidad:'metros' },
];
export function genRazonesProporcionesEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.2){
    const item = pick(RAZON_N3_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'La razón correcta, simplificada, es <b>'+item.correcta+'</b>.',
      recurso: RECURSO_RAZONES_N3,
    };
  }
  if(roll<0.4){
    const item = pick(PROPORCION_TIPO_N3_BANK);
    const opts = shuffle([item.correcta].concat(item.opts)).map(function(v){ return {label:v, value:v}; });
    return {
      promptHTML: '<p class="prompt-sentence">'+item.escenario+'</p><p class="prompt-hint">¿Qué tipo de proporcionalidad describe esta situación?</p>',
      options: opts, correctValue: item.correcta, speakText: item.escenario+' ¿Qué tipo de proporcionalidad es?', cols:2, panel:true,
      explain: 'Esta situación es un ejemplo de: '+item.correcta+'.',
      recurso: RECURSO_RAZONES_N3,
    };
  }
  if(roll<0.7){
    const item = pick(PORCENTAJE_N3_BANK);
    const opts = uniqueDistractors(item.correcta, 1, item.correcta*5, Math.max(2,Math.round(item.correcta*0.3)), 4).map(function(v){ return {label:String(v)+' '+item.sufijo, value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
      options: opts, correctValue: item.correcta, speakText: item.pregunta, cols:2, panel:true,
      explain: 'El resultado correcto es <b>'+item.correcta+' '+item.sufijo+'</b>.',
      recurso: RECURSO_RAZONES_N3,
    };
  }
  const item = pick(ESCALA_N3_BANK);
  const opts = uniqueDistractors(item.correcta, 0, item.correcta*100+10, Math.max(2,item.correcta), 4).map(function(v){ return {label:String(v)+' '+item.unidad, value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.escenario+' ¿A cuántos '+item.unidad+' reales equivale?</p>',
    options: opts, correctValue: item.correcta, speakText: item.escenario+' ¿A cuánto equivale en la realidad?', cols:2, panel:true,
    explain: 'Aplicando la escala, la distancia real es de <b>'+item.correcta+' '+item.unidad+'</b>.',
    recurso: RECURSO_RAZONES_N3,
  };
}

const RECURSO_PITAGORAS_N3 = 'El <b>teorema de Pitágoras</b> establece que, en un triángulo rectángulo, el cuadrado de la hipotenusa (el lado más largo, opuesto al ángulo recto) es igual a la suma de los cuadrados de los catetos: a² + b² = c². Su <b>recíproco</b> permite comprobar si un triángulo es rectángulo a partir de sus tres lados: si a² + b² = c² se cumple, el triángulo es rectángulo. En una <b>circunferencia</b>, el <b>radio</b> une el centro con cualquier punto de la circunferencia, el <b>diámetro</b> es el doble del radio y pasa por el centro, una <b>cuerda</b> une dos puntos cualquiera de la circunferencia, y una <b>tangente</b> es una recta que toca la circunferencia en un solo punto. El <b>perímetro</b> de una circunferencia es 2×π×radio, y el <b>área</b> del círculo es π×radio².';
const PITAGORAS_N3_BANK = [
  { a:3, b:4, c:5 }, { a:6, b:8, c:10 }, { a:5, b:12, c:13 }, { a:9, b:12, c:15 }, { a:8, b:15, c:17 },
];
const CIRCUNFERENCIA_ELEMENTO_N3_BANK = [
  { descripcion:'el segmento que une el centro de la circunferencia con cualquier punto de ella', correcta:'Radio', opts:['Diámetro','Cuerda','Tangente'] },
  { descripcion:'el segmento que pasa por el centro y une dos puntos opuestos de la circunferencia', correcta:'Diámetro', opts:['Radio','Cuerda','Tangente'] },
  { descripcion:'el segmento que une dos puntos cualquiera de la circunferencia, sin pasar necesariamente por el centro', correcta:'Cuerda', opts:['Radio','Diámetro','Tangente'] },
  { descripcion:'la recta que toca la circunferencia en un único punto, sin cruzarla', correcta:'Tangente', opts:['Radio','Diámetro','Cuerda'] },
];
export function genPitagorasCircunferenciaEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.35){
    const item = pick(PITAGORAS_N3_BANK);
    const askHip = Math.random()<0.5;
    if(askHip){
      const opts = uniqueDistractors(item.c, 1, 30, 3, 4).map(function(v){ return {label:v+' metros', value:v}; });
      return {
        promptHTML: '<p class="prompt-hint">Un triángulo rectángulo tiene catetos de '+item.a+' y '+item.b+' metros. ¿Cuánto mide la hipotenusa?</p>',
        options: opts, correctValue: item.c, speakText: '¿Cuánto mide la hipotenusa?', cols:2, panel:true,
        explain: 'Por Pitágoras: '+item.a+'² + '+item.b+'² = '+(item.a*item.a)+' + '+(item.b*item.b)+' = '+(item.a*item.a+item.b*item.b)+', y la raíz cuadrada de eso es <b>'+item.c+' metros</b>.',
        recurso: RECURSO_PITAGORAS_N3,
      };
    }
    const opts = uniqueDistractors(item.a, 1, 30, 3, 4).map(function(v){ return {label:v+' metros', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo rectángulo tiene hipotenusa de '+item.c+' metros y un cateto de '+item.b+' metros. ¿Cuánto mide el otro cateto?</p>',
      options: opts, correctValue: item.a, speakText: '¿Cuánto mide el otro cateto?', cols:2, panel:true,
      explain: 'Por Pitágoras: '+item.c+'² - '+item.b+'² = '+(item.c*item.c)+' - '+(item.b*item.b)+' = '+(item.c*item.c-item.b*item.b)+', y la raíz cuadrada de eso es <b>'+item.a+' metros</b>.',
      recurso: RECURSO_PITAGORAS_N3,
    };
  }
  if(roll<0.65){
    const esRecto = Math.random()<0.5;
    const item = esRecto ? pick(PITAGORAS_N3_BANK) : {a:pick([4,5,6,7]), b:pick([6,7,8,9]), c:pick([15,16,17,18])};
    const cumple = (item.a*item.a + item.b*item.b) === (item.c*item.c);
    const opts = shuffle(['Sí, es un triángulo rectángulo','No, no es un triángulo rectángulo']).map(function(o){ return {label:o, value:o}; });
    const correcta = cumple ? 'Sí, es un triángulo rectángulo' : 'No, no es un triángulo rectángulo';
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo tiene lados de '+item.a+', '+item.b+' y '+item.c+' metros. ¿Es un triángulo rectángulo?</p>',
      options: opts, correctValue: correcta, speakText: '¿Es un triángulo rectángulo?', cols:2, panel:true,
      explain: item.a+'² + '+item.b+'² = '+(item.a*item.a+item.b*item.b)+', y '+item.c+'² = '+(item.c*item.c)+'. '+(cumple ? 'Como son iguales, sí es rectángulo.' : 'Como no son iguales, no es rectángulo.'),
      recurso: RECURSO_PITAGORAS_N3,
    };
  }
  const item = pick(CIRCUNFERENCIA_ELEMENTO_N3_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cómo se llama '+item.descripcion+'?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cómo se llama '+item.descripcion+'?', cols:2, panel:true,
    explain: 'Ese elemento de la circunferencia se llama: '+item.correcta+'.',
    recurso: RECURSO_PITAGORAS_N3,
  };
}

const RECURSO_ANGULOS_N3 = 'Cuando dos rectas paralelas son cortadas por una recta <b>transversal</b>, se forman pares de ángulos con relaciones fijas: los <b>ángulos correspondientes</b> (misma posición relativa en cada intersección) son iguales entre sí, y los <b>ángulos alternos internos</b> (a lados opuestos de la transversal, entre las paralelas) también son iguales entre sí. En cualquier <b>triángulo</b>, la suma de sus tres <b>ángulos interiores</b> siempre es 180°, y la suma de sus <b>ángulos exteriores</b> siempre es 360°, sin importar la forma o el tamaño del triángulo. Estas relaciones permiten calcular un ángulo desconocido cuando se conocen los demás.';
const ANGULO_TRANSVERSAL_N3_BANK = [
  { tipo:'Ángulos correspondientes', descripcion:'ocupan la misma posición relativa en cada una de las dos intersecciones' },
  { tipo:'Ángulos alternos internos', descripcion:'están a lados opuestos de la transversal, entre las dos rectas paralelas' },
];
export function genAngulosTriangulosEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.34){
    const item = pick(ANGULO_TRANSVERSAL_N3_BANK);
    const otro = ANGULO_TRANSVERSAL_N3_BANK.filter(function(x){ return x.tipo!==item.tipo; })[0];
    const opts = shuffle([item.tipo, otro.tipo, 'Ángulos suplementarios', 'Ángulos rectos']).map(function(o){ return {label:o, value:o}; });
    return {
      promptHTML: '<p class="prompt-hint">Dos rectas paralelas son cortadas por una transversal. ¿Cómo se llaman los ángulos que '+item.descripcion+'?</p>',
      options: opts, correctValue: item.tipo, speakText: '¿Cómo se llaman esos ángulos?', cols:2, panel:true,
      explain: 'Esos ángulos se llaman: '+item.tipo+', y son iguales entre sí.',
      recurso: RECURSO_ANGULOS_N3,
    };
  }
  if(roll<0.67){
    const a = randInt(30,90), b = randInt(30,90);
    const c = 180 - a - b;
    const opts = uniqueDistractors(c, 1, 179, 8, 4).map(function(v){ return {label:v+'°', value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Un triángulo tiene dos ángulos interiores de '+a+'° y '+b+'°. ¿Cuánto mide el tercer ángulo?</p>',
      options: opts, correctValue: c, speakText: '¿Cuánto mide el tercer ángulo del triángulo?', cols:2, panel:true,
      explain: 'La suma de los ángulos interiores de un triángulo siempre es 180°: 180° - '+a+'° - '+b+'° = <b>'+c+'°</b>.',
      recurso: RECURSO_ANGULOS_N3,
    };
  }
  const opts = shuffle(['360°','180°','90°','270°']).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuánto suman siempre los ángulos exteriores de cualquier triángulo?</p>',
    options: opts, correctValue: '360°', speakText: '¿Cuánto suman los ángulos exteriores de un triángulo?', cols:2, panel:true,
    explain: 'La suma de los ángulos exteriores de cualquier triángulo siempre es <b>360°</b>, sin importar su forma o tamaño.',
    recurso: RECURSO_ANGULOS_N3,
  };
}

function barChartEpjaN3HTML(categorias){
  const max = Math.max.apply(null, categorias.map(function(c){ return c.valor; }));
  return '<div class="bar-chart">'+categorias.map(function(c){
    const h = Math.round((c.valor/max)*80)+20;
    return '<div class="bar-col"><div class="bar-value">'+c.valor+'</div><div class="bar-fill" style="height:'+h+'px;"></div><div class="bar-label">'+c.label+'</div></div>';
  }).join('')+'</div>';
}
const RECURSO_ESTADISTICA_N3 = 'Un <b>gráfico de barras</b> permite comparar categorías de un vistazo (la altura de cada barra representa su valor), y un <b>gráfico circular</b> muestra cómo un total se reparte en porcentajes entre varias categorías. Las <b>medidas de tendencia central</b> resumen un conjunto de datos en un solo número representativo: la <b>media</b> (o promedio) se calcula sumando todos los valores y dividiendo por la cantidad de datos; la <b>moda</b> es el valor que se repite con más frecuencia; y la <b>mediana</b> es el valor que queda justo al centro cuando los datos se ordenan de menor a mayor. Analizar tablas y gráficos —sacando conclusiones, comparando grupos o haciendo predicciones— es una habilidad clave para interpretar boletas, encuestas y reportes de todo tipo.';
const DATOS_BARRA_N3_BANK = [
  { pregunta:'Se registraron las toneladas de fruta exportadas por una cooperativa agrícola, según el tipo de fruta.', categorias:[{label:'Manzana',valor:32},{label:'Uva',valor:24},{label:'Ciruela',valor:15}] },
  { pregunta:'Se registró la cantidad de postulantes a un curso de capacitación laboral, según el área de interés.', categorias:[{label:'Electricidad',valor:28},{label:'Gasfitería',valor:19},{label:'Soldadura',valor:22}] },
  { pregunta:'Se encuestó a un grupo de trabajadores sobre el medio de transporte que usan para llegar al trabajo.', categorias:[{label:'Bus',valor:34},{label:'Auto',valor:12},{label:'A pie',valor:9}] },
];
const MODA_MEDIANA_N3_BANK = [
  { valores:[8,10,10,12,15], contexto:'los años de antigüedad laboral de un grupo de trabajadores' },
  { valores:[20,22,20,25,20,30], contexto:'la cantidad de clientes atendidos por día en un almacén' },
  { valores:[5,7,9,9,9,12], contexto:'las horas de capacitación completadas por un grupo de postulantes' },
];
const MEDIA_N3_BANK = [
  { valores:[18,22,20,24,16], contexto:'los kilómetros recorridos por un repartidor en 5 días distintos' },
  { valores:[7,9,8,10,6,8], contexto:'las horas de trabajo diarias de un obrero durante 6 días' },
  { valores:[30,35,25,40], contexto:'los pedidos entregados por un repartidor en 4 turnos distintos' },
];
export function genEstadisticaEpjaN3Round(){
  const roll = Math.random();
  if(roll<0.3){
    const item = pick(DATOS_BARRA_N3_BANK);
    const maxCat = item.categorias.reduce(function(a,b){ return b.valor>a.valor ? b : a; });
    const distract = item.categorias.filter(function(c){ return c.label!==maxCat.label; }).map(function(c){ return c.label; });
    const opts = shuffle([maxCat.label].concat(distract)).map(function(c){ return {label:c, value:c}; });
    return {
      promptHTML: barChartEpjaN3HTML(item.categorias)+'<p class="prompt-hint">'+item.pregunta+' ¿Cuál categoría tiene el valor más alto?</p>',
      options: opts, correctValue: maxCat.label, speakText: '¿Cuál categoría tiene el valor más alto?', cols:2, panel:true,
      explain: '<b>'+maxCat.label+'</b> tiene el valor más alto en este gráfico.',
      recurso: RECURSO_ESTADISTICA_N3,
    };
  }
  if(roll<0.5){
    const item = pick(MEDIA_N3_BANK);
    const suma = item.valores.reduce(function(a,b){ return a+b; }, 0);
    const media = Math.round((suma/item.valores.length)*10)/10;
    const opts = uniqueDistractors(media, 1, 60, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Estos son '+item.contexto+': '+item.valores.join(', ')+'. ¿Cuál es la media (promedio)?</p>',
      options: opts, correctValue: media, speakText: '¿Cuál es la media de estos valores?', cols:2, panel:true,
      explain: 'Sumando todos los valores y dividiendo por la cantidad de datos: ('+item.valores.join(' + ')+') ÷ '+item.valores.length+' = <b>'+media+'</b> de media.',
      recurso: RECURSO_ESTADISTICA_N3,
    };
  }
  if(roll<0.75){
    const item = pick(MODA_MEDIANA_N3_BANK);
    const counts = {};
    item.valores.forEach(function(v){ counts[v] = (counts[v]||0)+1; });
    const moda = Number(Object.keys(counts).reduce(function(a,b){ return counts[a]>=counts[b] ? a : b; }));
    const opts = uniqueDistractors(moda, 1, 60, 4, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML: '<p class="prompt-hint">Estos son '+item.contexto+': '+item.valores.join(', ')+'. ¿Cuál es la moda (el valor que más se repite)?</p>',
      options: opts, correctValue: moda, speakText: '¿Cuál es la moda de estos valores?', cols:2, panel:true,
      explain: 'El valor que más se repite en este conjunto de datos es <b>'+moda+'</b>, así que esa es la moda.',
      recurso: RECURSO_ESTADISTICA_N3,
    };
  }
  const item = pick(MODA_MEDIANA_N3_BANK);
  const ordenado = item.valores.slice().sort(function(a,b){ return a-b; });
  const mediana = ordenado.length%2===1 ? ordenado[(ordenado.length-1)/2] : (ordenado[ordenado.length/2-1]+ordenado[ordenado.length/2])/2;
  const opts = uniqueDistractors(mediana, 1, 60, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML: '<p class="prompt-hint">Estos son '+item.contexto+': '+item.valores.join(', ')+'. ¿Cuál es la mediana (el valor central al ordenarlos)?</p>',
    options: opts, correctValue: mediana, speakText: '¿Cuál es la mediana de estos valores?', cols:2, panel:true,
    explain: 'Ordenando los valores de menor a mayor ('+ordenado.join(', ')+'), el valor central es <b>'+mediana+'</b>, así que esa es la mediana.',
    recurso: RECURSO_ESTADISTICA_N3,
  };
}

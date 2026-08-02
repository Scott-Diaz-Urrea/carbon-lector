import { pick, shuffle, randInt, uniqueDistractors } from '../../utils.js';

/* ---------------- 3°-4° medio, Plan de Formación General: Matemática ----------------
   Fuente real: Decreto 614/2013 (Bases Curriculares 3° y 4° medio), Plan de Formación
   General, asignatura Matemática — verificado en curriculumnacional.cl antes de
   escribir contenido. A diferencia de 1°-2° medio (mismo decreto, pero organizado
   año→10 asignaturas idénticas), el Plan General de 3°-4° medio tiene solo 4 OA por
   año (mucho más denso cada uno) y convive con un Plan Diferenciado electivo aparte
   (ver "Educación Media" en CLAUDE.md para el detalle de la arquitectura nueva:
   PLAN_GENERAL_SUBJECT_DEFS/byGrade en gradeContent.js, con su propia pantalla
   planMedioMap para elegir entre Plan General y Plan Diferenciado).

   3° medio (FG-MATE-3M-OAC-01 a 04): números complejos; estadística con dispersión
   y probabilidad condicional; funciones exponencial y logarítmica; geometría de la
   circunferencia (ángulos, arcos, cuerdas, secantes). Los 4 OA quedan cubiertos.
   4° medio (FG-MATE-4M-OAC-01 a 04): matemática financiera (porcentajes, interés,
   índices económicos); modelos binomial y normal; funciones potencia y
   trigonométricas (sen, cos); rectas y circunferencias en el plano cartesiano. Los
   4 OA quedan cubiertos. Mismo criterio que el resto de la app: generadores
   dinámicos con valores elegidos a propósito (cuadrados/cubos perfectos, ángulos
   múltiplos de 20°, combos de interés compuesto precomputados) para que el
   resultado sea siempre exacto, sin ambigüedad por redondeo. */

export const MATE_PG_MODULES_M3 = [
  {id:'numeroscomplejospg3', label:'Números Complejos', open:true, key:'numeroscomplejospg3'},
  {id:'estadisticadispersionpg3', label:'Estadística: Dispersión y Prob. Condicional', open:true, key:'estadisticadispersionpg3'},
  {id:'funcionesexplogpg3', label:'Funciones Exponencial y Logarítmica', open:true, key:'funcionesexplogpg3'},
  {id:'geometriacircunferenciapg3', label:'Geometría de la Circunferencia', open:true, key:'geometriacircunferenciapg3'},
];
export const MATE_PG_POS_M3 = [ {x:26,y:88},{x:70,y:64},{x:26,y:38},{x:70,y:12} ];

export const MATE_PG_MODULES_M4 = [
  {id:'matfinancierapg4', label:'Matemática Financiera', open:true, key:'matfinancierapg4'},
  {id:'binomialnormalpg4', label:'Modelos Binomial y Normal', open:true, key:'binomialnormalpg4'},
  {id:'funcionespotenciatrigpg4', label:'Funciones Potencia y Trigonométricas', open:true, key:'funcionespotenciatrigpg4'},
  {id:'rectascircunferenciaspg4', label:'Rectas y Circunferencias en el Plano', open:true, key:'rectascircunferenciaspg4'},
];
export const MATE_PG_POS_M4 = [ {x:26,y:88},{x:70,y:64},{x:26,y:38},{x:70,y:12} ];

function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }
function fmtComplex(re, im){
  let s = String(re);
  if(im !== 0) s += (im >= 0 ? ' + ' : ' - ') + Math.abs(im) + 'i';
  return s;
}

/* ---------------- Números Complejos (OAC-01) ---------------- */
const RECURSO_COMPLEJOS_PG3 = 'Un <b>número complejo</b> se escribe como a + bi, donde a es la parte real y b es la parte imaginaria, acompañada de la unidad imaginaria i, que cumple i² = -1. Para sumar o restar dos números complejos se operan por separado las partes reales entre sí y las partes imaginarias entre sí, igual que sumar vectores por componentes. Para multiplicarlos se aplica la propiedad distributiva término a término, reemplazando siempre i² por -1 al final. Los números complejos permiten resolver ecuaciones que no tienen solución dentro de los números reales (como x² = -1), y son la base matemática detrás de la electricidad alterna, el procesamiento de señales y la mecánica cuántica.';
export function genNumerosComplejosPG3Round(){
  const a=randInt(-6,6), b=randInt(-5,5)||2, c=randInt(-6,6), d=randInt(-5,5)||3;
  const op = pick(['+','-','×']);
  let re,im,wrongRe,wrongIm;
  if(op==='+'){ re=a+c; im=b+d; wrongRe=a-c; wrongIm=b-d; }
  else if(op==='-'){ re=a-c; im=b-d; wrongRe=a+c; wrongIm=b+d; }
  else { re=a*c-b*d; im=a*d+b*c; wrongRe=a*c+b*d; wrongIm=a*d+b*c; }
  const z1 = fmtComplex(a,b), z2 = fmtComplex(c,d), correct = fmtComplex(re,im);
  const opName = op==='+'?'suma':op==='-'?'resta':'multiplicación';
  const candidates = [fmtComplex(wrongRe,wrongIm), fmtComplex(re,-im), fmtComplex(-re,im), fmtComplex(im,re)];
  const finals = [];
  for(const cand of candidates){ if(cand!==correct && finals.indexOf(cand)===-1) finals.push(cand); }
  let guard=0;
  while(finals.length<3 && guard<50){
    guard++;
    const cand = fmtComplex(re+randInt(-4,4), im+randInt(-4,4));
    if(cand!==correct && finals.indexOf(cand)===-1) finals.push(cand);
  }
  const opts = shuffle([correct].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">('+z1+') '+op+' ('+z2+') = ?</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:'Calcula la '+opName+' de estos dos números complejos.',
    explain:'En los números complejos, la suma y la resta se hacen por separado entre las partes reales y las partes imaginarias; en la multiplicación, i al cuadrado se reemplaza por -1.',
    recurso:RECURSO_COMPLEJOS_PG3,
  };
}

/* ---------------- Estadística: Dispersión y Probabilidad Condicional (OAC-02) ---------------- */
const RECURSO_DISPERSION_PG3 = 'La <b>varianza</b> mide qué tan dispersos están los datos respecto al promedio: se calcula sacando el promedio de los cuadrados de las diferencias entre cada dato y la media. Una varianza baja indica que los datos están agrupados cerca del promedio; una varianza alta indica que están más dispersos. No hay que confundirla con el <b>rango</b> (la diferencia entre el mayor y el menor valor), que es una medida de dispersión mucho más simple pero menos informativa, porque solo usa dos datos del conjunto.';
const DEV_SETS_PG3 = [
  {devs:[-1,-1,1,1], varr:1}, {devs:[-2,-2,2,2], varr:4}, {devs:[-2,-1,1,2], varr:2.5},
  {devs:[-3,-1,1,3], varr:5}, {devs:[-4,-2,2,4], varr:10}, {devs:[-3,-3,3,3], varr:9},
];
function generaVarianza(){
  const set = pick(DEV_SETS_PG3);
  const m = randInt(15,60);
  const datos = shuffle(set.devs.map(function(d){ return m+d; }));
  const correct = set.varr;
  const rango = Math.max.apply(null,datos)-Math.min.apply(null,datos);
  const finals = [];
  if(rango!==correct) finals.push(String(rango));
  const candidatePool = uniqueDistractors(correct, 0, 20, 4, 4).map(function(x){ return String(x); });
  for(const c of candidatePool){ if(c!==String(correct) && finals.indexOf(c)===-1) finals.push(c); }
  let guard=0;
  while(finals.length<3 && guard<30){
    guard++;
    const cand = String(Math.max(0, correct + randInt(-6,6)));
    if(cand!==String(correct) && finals.indexOf(cand)===-1) finals.push(cand);
  }
  const opts = shuffle([String(correct)].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">Un conjunto de datos es: '+datos.join(', ')+' (con promedio '+m+').</p><p class="prompt-hint">¿Cuál es la varianza de este conjunto de datos?</p>',
    options:opts, correctValue:String(correct), cols:2, panel:true,
    speakText:'Calcula la varianza de este conjunto de datos.',
    explain:'La varianza es el promedio de las diferencias al cuadrado entre cada dato y la media: en este caso, '+correct+'.',
    recurso:RECURSO_DISPERSION_PG3,
  };
}
const RECURSO_COND_PG3 = 'La <b>probabilidad condicional</b> mide qué tan probable es que ocurra un evento A, sabiendo que ya ocurrió otro evento B. Se calcula como P(A dado B) = (casos donde ocurren A y B a la vez) / (casos donde ocurre B) — el universo de referencia se reduce solo a los casos donde B ya es verdadero, no al total de la población. Este razonamiento es clave en medicina (probabilidad de tener una enfermedad dado un síntoma), en seguros (probabilidad de un accidente dado un perfil de conductor) y en los clasificadores de correo no deseado.';
const COND_PROB_SCENARIOS_PG3 = [
  {contexto:'De 30 estudiantes de un curso, 18 practican algún deporte. De esos 18, 12 también tocan un instrumento musical.', evento:'que toque un instrumento musical, dado que practica un deporte', num:12, den:18, total:30},
  {contexto:'En una encuesta a 40 personas, 25 usan transporte público. De esas 25, 15 además usan bicicleta.', evento:'que use bicicleta, dado que usa transporte público', num:15, den:25, total:40},
  {contexto:'De 50 pacientes que llegaron a control, 20 tenían presión alta. De esos 20, 8 también tenían colesterol alto.', evento:'que tenga colesterol alto, dado que tiene presión alta', num:8, den:20, total:50},
  {contexto:'En un curso de 24 estudiantes, 16 rindieron la prueba de matemática. De esos 16, 10 obtuvieron nota sobre 5,5.', evento:'que haya obtenido nota sobre 5,5, dado que rindió la prueba', num:10, den:16, total:24},
  {contexto:'De 45 personas en un centro de vacunación, 30 se pusieron la vacuna contra la influenza. De esas 30, 18 también se pusieron la del covid.', evento:'que se haya puesto la vacuna contra el covid, dado que se puso la de influenza', num:18, den:30, total:45},
];
function generaProbCondicional(){
  const s = pick(COND_PROB_SCENARIOS_PG3);
  const g = gcd(s.num,s.den);
  const correct = (s.num/g)+'/'+(s.den/g);
  const g2 = gcd(s.num,s.total);
  const candidates = [s.den+'/'+s.num, (s.num/g2)+'/'+(s.total/g2), s.num+'/'+s.den];
  const finals = [];
  for(const c of candidates){ if(c!==correct && finals.indexOf(c)===-1) finals.push(c); }
  let guard=0;
  while(finals.length<3 && guard<30){ guard++; const cand=(s.num+randInt(1,6))+'/'+s.den; if(cand!==correct && finals.indexOf(cand)===-1) finals.push(cand); }
  const opts = shuffle([correct].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+s.contexto+'</p><p class="prompt-hint">¿Cuál es la probabilidad '+s.evento+'?</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:'Calcula la probabilidad condicional descrita.',
    explain:'La probabilidad condicional se calcula dividiendo los casos favorables por el total de casos donde ya ocurrió la condición dada, no por el total general: '+correct+'.',
    recurso:RECURSO_COND_PG3,
  };
}
export function genEstadisticaDispersionPG3Round(){
  return Math.random()<0.5 ? generaVarianza() : generaProbCondicional();
}

/* ---------------- Funciones Exponencial y Logarítmica (OAC-03) ---------------- */
const RECURSO_EXPLOG_PG3 = 'Una <b>función exponencial</b> tiene la forma N(x) = a × bˣ, y modela fenómenos que crecen o decrecen a un ritmo proporcional a su tamaño actual, como poblaciones de bacterias, inversiones o la desintegración radiactiva. Su función inversa es la <b>función logarítmica</b>: el logaritmo en base b de un número N responde a la pregunta "¿a qué exponente hay que elevar b para obtener N?" — por ejemplo, el logaritmo en base 2 de 8 es 3, porque 2³ = 8. Ambas funciones son la base matemática de la escala de pH, la escala de Richter y el interés compuesto.';
function generaExponencial(){
  const a = pick([1,2,5,10]);
  const crece = Math.random()<0.5;
  const b = crece ? pick([2,3]) : 0.5;
  const x = randInt(1,4);
  const valor = a*Math.pow(b,x);
  const contexto = crece
    ? 'Una población de bacterias comienza con '+a+' individuos y se '+(b===2?'duplica':'triplica')+' cada hora. Usando N(x) = '+a+' × '+b+'ˣ, ¿cuántas bacterias hay después de '+x+' horas?'
    : 'Una dosis de '+a+' mg de un medicamento se reduce a la mitad cada hora en el cuerpo. Usando N(x) = '+a+' × 0,5ˣ, ¿cuántos mg quedan después de '+x+' horas?';
  const opts = uniqueDistractors(valor, 0, Math.max(valor*3,20), Math.max(4,Math.round(valor*0.5)), 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+contexto+'</p>',
    options:opts, correctValue:valor, cols:2, panel:true,
    speakText:'Calcula el valor de la función exponencial descrita.',
    explain:'Reemplazando x = '+x+' en la fórmula, el resultado es '+valor+'.',
    recurso:RECURSO_EXPLOG_PG3,
  };
}
function generaLogaritmo(){
  const b = pick([2,3,5,10]);
  const k = randInt(1,4);
  const a = Math.pow(b,k);
  const opts = uniqueDistractors(k, 0, 6, 2, 4).map(function(n){ return {label:String(n), value:n}; });
  return {
    promptHTML:'<p class="prompt-sentence">¿Cuál es el valor de log base '+b+' de '+a+'? Es decir, log'+b+'('+a+') = ?</p>',
    options:opts, correctValue:k, cols:2, panel:true,
    speakText:'Calcula el logaritmo en base '+b+' de '+a+'.',
    explain:'log'+b+'('+a+') = '+k+', porque '+b+' elevado a '+k+' es igual a '+a+'.',
    recurso:RECURSO_EXPLOG_PG3,
  };
}
export function genFuncionesExpLogPG3Round(){
  return Math.random()<0.5 ? generaExponencial() : generaLogaritmo();
}

/* ---------------- Geometría de la Circunferencia (OAC-04) ---------------- */
const RECURSO_CIRCUNFERENCIA_PG3 = 'En una circunferencia, un <b>ángulo del centro</b> (con vértice en el centro) que subtiende un arco mide exactamente el doble que cualquier <b>ángulo inscrito</b> (con vértice en la circunferencia) que subtienda el mismo arco. Esta relación se conoce como el teorema del ángulo inscrito, y tiene un caso especial importante: todo ángulo inscrito que subtiende un diámetro mide siempre 90°. Estas relaciones se usan en arquitectura, diseño de engranajes y en sistemas de posicionamiento como el GPS, que triangula posiciones usando ángulos y arcos.';
export function genGeometriaCircunferenciaPG3Round(){
  const central = pick([40,60,80,100,120,140,160]);
  const inscrito = central/2;
  const askCentral = Math.random()<0.5;
  const correct = askCentral ? central : inscrito;
  const contexto = askCentral
    ? 'Un ángulo inscrito en una circunferencia mide '+inscrito+'°. ¿Cuánto mide el ángulo del centro que subtiende el mismo arco?'
    : 'Un ángulo del centro de una circunferencia mide '+central+'°. ¿Cuánto mide un ángulo inscrito que subtiende el mismo arco?';
  const opts = uniqueDistractors(correct, 5, 180, 30, 4).map(function(n){ return {label:n+'°', value:n}; });
  return {
    promptHTML:'<p class="prompt-sentence">'+contexto+'</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:contexto,
    explain:'El ángulo del centro siempre mide el doble que un ángulo inscrito que subtiende el mismo arco: '+central+'° y '+inscrito+'°.',
    recurso:RECURSO_CIRCUNFERENCIA_PG3,
  };
}

/* ================= 4° medio ================= */

/* ---------------- Matemática Financiera (OAC-01) ---------------- */
const RECURSO_FINANCIERA_PG4 = 'El <b>interés simple</b> se calcula siempre sobre el capital inicial: el monto final es A = C + C×r×t/100, donde C es el capital, r la tasa anual en porcentaje y t el tiempo en años. El <b>interés compuesto</b>, en cambio, calcula los intereses sobre el capital MÁS los intereses ya ganados en periodos anteriores: A = C×(1+r/100)^t — por eso crece más rápido mientras más tiempo pasa. Entender esta diferencia es clave para comparar créditos, ahorros e inversiones reales, donde casi siempre se usa interés compuesto.';
const COMPOUND_POOL_PG4 = [
  {C:1000,r:10,t:2,total:1210},{C:1000,r:20,t:2,total:1440},{C:2000,r:10,t:2,total:2420},
  {C:1000,r:10,t:3,total:1331},{C:1000,r:50,t:2,total:2250},{C:2000,r:20,t:2,total:2880},
];
function generaCompuesto(){
  const s = pick(COMPOUND_POOL_PG4);
  const opts = uniqueDistractors(s.total, s.C, s.total*2, Math.round(s.C*0.3), 4).map(function(n){ return {label:'$'+n, value:n}; });
  return {
    promptHTML:'<p class="prompt-sentence">Un capital de $'+s.C+' se invierte a interés compuesto del '+s.r+'% anual durante '+s.t+' años. Usa A = C×(1+r/100)ᵗ. ¿Cuál es el monto final?</p>',
    options:opts, correctValue:s.total, cols:2, panel:true,
    speakText:'Calcula el monto final con interés compuesto.',
    explain:'Con interés compuesto, cada periodo gana interés sobre el capital y los intereses anteriores: el monto final es $'+s.total+'.',
    recurso:RECURSO_FINANCIERA_PG4,
  };
}
function generaSimple(){
  const C = pick([500,1000,1500,2000]);
  const r = pick([5,10,15,20]);
  const t = randInt(1,4);
  const total = C + C*r*t/100;
  const opts = uniqueDistractors(total, C, total*2, Math.round(C*0.25), 4).map(function(n){ return {label:'$'+n, value:n}; });
  return {
    promptHTML:'<p class="prompt-sentence">Un capital de $'+C+' se invierte a interés simple del '+r+'% anual durante '+t+' años. Usa A = C + C×r×t/100. ¿Cuál es el monto final?</p>',
    options:opts, correctValue:total, cols:2, panel:true,
    speakText:'Calcula el monto final con interés simple.',
    explain:'Con interés simple, el interés se calcula siempre sobre el capital inicial: el monto final es $'+total+'.',
    recurso:RECURSO_FINANCIERA_PG4,
  };
}
export function genMatematicaFinancieraPG4Round(){
  return Math.random()<0.5 ? generaCompuesto() : generaSimple();
}

/* ---------------- Modelos Binomial y Normal (OAC-02) ---------------- */
const RECURSO_BINOMIALNORMAL_PG4 = 'El <b>modelo binomial</b> calcula la probabilidad de obtener exactamente k éxitos en n intentos independientes con la misma probabilidad de éxito (como lanzar una moneda varias veces). El <b>modelo normal</b> describe datos que se distribuyen simétricamente alrededor de un promedio (como estaturas o resultados de pruebas), y sigue la llamada regla empírica: aproximadamente el 68% de los datos está dentro de 1 desviación estándar de la media, el 95% dentro de 2, y el 99,7% dentro de 3. Ambos modelos se usan constantemente en control de calidad, encuestas y estudios médicos.';
const BINOMIAL_POOL_PG4 = [
  {n:3,k:1,num:3,den:8},{n:3,k:2,num:3,den:8},{n:4,k:1,num:1,den:4},{n:4,k:2,num:3,den:8},
  {n:4,k:3,num:1,den:4},{n:5,k:2,num:5,den:16},{n:5,k:3,num:5,den:16},
];
function generaBinomial(){
  const s = pick(BINOMIAL_POOL_PG4);
  const correct = s.num+'/'+s.den;
  const candidates = [(s.den-s.num)+'/'+s.den, '1/2', s.num+'/'+(s.den*2), (s.num+1)+'/'+s.den];
  const finals = [];
  for(const c of candidates){ if(c!==correct && finals.indexOf(c)===-1) finals.push(c); }
  const opts = shuffle([correct].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">Se lanza una moneda equilibrada '+s.n+' veces. Según el modelo binomial (p = 1/2), ¿cuál es la probabilidad de obtener exactamente '+s.k+' '+(s.k===1?'cara':'caras')+'?</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:'Calcula la probabilidad binomial descrita.',
    explain:'Usando el modelo binomial con n = '+s.n+' y p = 1/2, la probabilidad de exactamente '+s.k+' éxitos es '+correct+'.',
    recurso:RECURSO_BINOMIALNORMAL_PG4,
  };
}
const REGLA_EMPIRICA_PG4 = [ {desv:'1', pct:'68%'}, {desv:'2', pct:'95%'}, {desv:'3', pct:'99,7%'} ];
function generaNormal(){
  const s = pick(REGLA_EMPIRICA_PG4);
  const finals = REGLA_EMPIRICA_PG4.filter(function(x){ return x.pct!==s.pct; }).map(function(x){ return x.pct; });
  finals.push('50%');
  const opts = shuffle([s.pct].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">Según la regla empírica de la distribución normal, ¿qué porcentaje aproximado de los datos se encuentra dentro de '+s.desv+' desviación'+(s.desv==='1'?'':'es')+' estándar de la media?</p>',
    options:opts, correctValue:s.pct, cols:2, panel:true,
    speakText:'¿Qué porcentaje de los datos cae dentro de esa cantidad de desviaciones estándar?',
    explain:'La regla empírica indica que dentro de '+s.desv+' desviación'+(s.desv==='1'?'':'es')+' estándar de la media cae aproximadamente el '+s.pct+' de los datos.',
    recurso:RECURSO_BINOMIALNORMAL_PG4,
  };
}
export function genBinomialNormalPG4Round(){
  return Math.random()<0.5 ? generaBinomial() : generaNormal();
}

/* ---------------- Funciones Potencia y Trigonométricas (OAC-03) ---------------- */
const RECURSO_POTENCIATRIG_PG4 = 'Una <b>función potencia</b> tiene la forma f(x) = xⁿ; cuando n es par, la función siempre da resultados positivos o cero (como x²), y cuando n es impar conserva el signo de x (como x³). Las <b>funciones trigonométricas</b> seno y coseno modelan fenómenos periódicos, como las olas del mar, las mareas o el sonido: sus valores en los ángulos más comunes (0°, 30°, 45°, 60° y 90°) son exactos y se usan como referencia constante en física e ingeniería.';
function generaPotencia(){
  const n = pick([2,3]);
  const x = pick([-4,-3,-2,-1,1,2,3,4]);
  const valor = Math.pow(x,n);
  const opts = uniqueDistractors(valor, -80, 80, Math.max(6,Math.round(Math.abs(valor)*0.5)), 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">Si f(x) = x'+(n===2?'²':'³')+', ¿cuál es el valor de f('+x+')?</p>',
    options:opts, correctValue:valor, cols:2, panel:true,
    speakText:'Calcula el valor de la función potencia.',
    explain:(''+x)+' elevado a '+n+' es igual a '+valor+'.',
    recurso:RECURSO_POTENCIATRIG_PG4,
  };
}
const TRIG_TABLE_PG4 = {
  sin: {0:'0',30:'1/2',45:'√2/2',60:'√3/2',90:'1'},
  cos: {0:'1',30:'√3/2',45:'√2/2',60:'1/2',90:'0'},
};
function generaTrig(){
  const fn = pick(['sin','cos']);
  const angle = pick([0,30,45,60,90]);
  const tabla = TRIG_TABLE_PG4[fn];
  const correct = tabla[angle];
  const finals = [];
  for(const ang of [0,30,45,60,90]){ const v = tabla[ang]; if(v!==correct && finals.indexOf(v)===-1) finals.push(v); }
  const opts = shuffle([correct].concat(shuffle(finals).slice(0,3))).map(function(v){ return {label:v, value:v}; });
  const fnLabel = fn==='sin'?'seno':'coseno';
  return {
    promptHTML:'<p class="prompt-sentence">¿Cuál es el valor exacto del '+fnLabel+' de '+angle+'°?</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:'¿Cuál es el valor exacto de esa razón trigonométrica?',
    explain:'El '+fnLabel+' de '+angle+'° es exactamente '+correct+'.',
    recurso:RECURSO_POTENCIATRIG_PG4,
  };
}
export function genFuncionesPotenciaTrigPG4Round(){
  return Math.random()<0.5 ? generaPotencia() : generaTrig();
}

/* ---------------- Rectas y Circunferencias en el Plano (OAC-04) ---------------- */
const RECURSO_RECTASCIRC_PG4 = 'La <b>pendiente</b> de una recta que pasa por dos puntos (x₁,y₁) y (x₂,y₂) se calcula como m = (y₂-y₁)/(x₂-x₁), y mide qué tan inclinada está la recta. La ecuación de una <b>circunferencia</b> con centro (h,k) y radio r es (x-h)² + (y-k)² = r² — el centro se lee directamente de los valores que se restan a x e y, y el radio es la raíz cuadrada del número del lado derecho. Estas herramientas de geometría analítica permiten describir figuras geométricas con ecuaciones, y son la base del diseño asistido por computador y de los sistemas de navegación GPS.';
function generaPendiente(){
  const x1 = randInt(-6,3), x2 = x1 + randInt(1,5);
  const m = randInt(-5,5)||2;
  const y1 = randInt(-6,6);
  const y2 = y1 + m*(x2-x1);
  const opts = uniqueDistractors(m, -12, 12, 3, 4).map(function(v){ return {label:String(v), value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">Una recta pasa por los puntos ('+x1+', '+y1+') y ('+x2+', '+y2+'). ¿Cuál es su pendiente?</p>',
    options:opts, correctValue:m, cols:2, panel:true,
    speakText:'Calcula la pendiente de la recta que pasa por esos dos puntos.',
    explain:'La pendiente es (y2-y1)/(x2-x1) = '+m+'.',
    recurso:RECURSO_RECTASCIRC_PG4,
  };
}
function generaCircunferencia(){
  const h = randInt(-8,8), k = randInt(-8,8);
  const r = pick([2,3,4,5,6]);
  const r2 = r*r;
  const askRadio = Math.random()<0.5;
  const ecuacion = '(x'+(h>=0?'-'+h:'+'+Math.abs(h))+')² + (y'+(k>=0?'-'+k:'+'+Math.abs(k))+')² = '+r2;
  if(askRadio){
    const opts = uniqueDistractors(r, 1, 15, 3, 4).map(function(v){ return {label:String(v), value:v}; });
    return {
      promptHTML:'<p class="prompt-sentence">La ecuación de una circunferencia es: '+ecuacion+'</p><p class="prompt-hint">¿Cuál es el radio de esta circunferencia?</p>',
      options:opts, correctValue:r, cols:2, panel:true,
      speakText:'¿Cuál es el radio de esta circunferencia?',
      explain:'El radio es la raíz cuadrada del número del lado derecho: la raíz de '+r2+' es '+r+'.',
      recurso:RECURSO_RECTASCIRC_PG4,
    };
  }
  const correct = '('+h+', '+k+')';
  const candidates = ['('+(-h)+', '+k+')', '('+h+', '+(-k)+')', '('+k+', '+h+')'];
  const finals = [];
  for(const c of candidates){ if(c!==correct && finals.indexOf(c)===-1) finals.push(c); }
  let guard=0;
  while(finals.length<3 && guard<30){ guard++; const cand='('+(h+randInt(-3,3))+', '+(k+randInt(-3,3))+')'; if(cand!==correct && finals.indexOf(cand)===-1) finals.push(cand); }
  const opts = shuffle([correct].concat(finals.slice(0,3))).map(function(v){ return {label:v, value:v}; });
  return {
    promptHTML:'<p class="prompt-sentence">La ecuación de una circunferencia es: '+ecuacion+'</p><p class="prompt-hint">¿Cuál es el centro de esta circunferencia?</p>',
    options:opts, correctValue:correct, cols:2, panel:true,
    speakText:'¿Cuál es el centro de esta circunferencia?',
    explain:'El centro se lee directamente de la ecuación: '+correct+'.',
    recurso:RECURSO_RECTASCIRC_PG4,
  };
}
export function genRectasCircunferenciasPG4Round(){
  return Math.random()<0.5 ? generaPendiente() : generaCircunferencia();
}

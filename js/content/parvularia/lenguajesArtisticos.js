import { randInt, shuffle } from '../../utils.js';
import { colorSwatchSVG, shapeSVG, lineTypeSVG } from '../../svg.js';

/* Núcleo Lenguajes Artísticos — Educación Parvularia, NT (Decreto 481/2017,
   ámbito Comunicación Integral, curriculumnacional.cl/curriculum/
   educacion-parvularia/comunicacion-integral/nt-nivel-transicion):
   OA01 -> Aprecia y Compara, Compara Formas, Líneas y Diseño. Texto literal
   de OA01: "Apreciar producciones artísticas de diversos contextos (en forma
   directa o a través de medios tecnológicos), describiendo y comparando
   algunas características visuales, musicales o escénicas (desplazamiento,
   ritmo, carácter expresivo, colorido, formas, diseño, entre otros)." Los
   tres módulos de este núcleo cubren, cada uno, un atributo visual distinto
   de esa misma lista (colorido / formas / diseño), con el mismo mecanismo de
   comparar dos "obras" — no son 3 OA distintos, son 3 ángulos de OA01.
   Quedan fuera: OA02 (comunicar impresiones/emociones propias sobre una
   obra — subjetivo, no tiene una respuesta correcta objetiva), OA03-04
   (interpretar canciones/juegos musicales y expresión corporal/dramática —
   performativo, requiere producción de voz/cuerpo real, no apto para opción
   múltiple), OA05-06 (representar plásticamente o experimentar combinaciones
   de expresión — son tareas de producción propia, no de reconocimiento) y
   OA07 (representar a través del dibujo propio — ídem, producción gráfica).
   Los atributos "desplazamiento/ritmo/carácter expresivo" de OA01 tampoco se
   cubren: son de manifestaciones musicales/escénicas, que requieren audio o
   movimiento real para apreciarse, igual criterio que excluye OA03-04. */

export const LENGUAJES_ARTISTICOS_MODULES = [
  { id:'apreciarnt', label:'Aprecia y Compara', open:true, key:'apreciarnt' },
  { id:'comparaformasnt', label:'Compara Formas', open:true, key:'comparaformasnt' },
  { id:'lineasdisenont', label:'Líneas y Diseño', open:true, key:'lineasdisenont' },
];
export const LENGUAJES_ARTISTICOS_POS = [
  {x:24,y:78},{x:68,y:50},{x:24,y:22},
];

const COLORES_POOL = ['ROJO','AZUL','VERDE','AMARILLO','MORADO','NARANJO','ROSADO'];
const FORMAS_POOL = ['circulo','cuadrado','triangulo','rectangulo','rombo','ovalo','pentagono','hexagono'];
const LINEAS_POOL = ['VERTICAL','HORIZONTAL','DIAGONAL','ESPIRAL','QUEBRADA'];

/* `adjetivo` existe porque "distintos" no concuerda en género con los tres
   atributos por igual (auditoría 2026-07-22): "colores distintos" es
   correcto, pero "formas distintos" y "tipos de líneas distintos" quedaban
   con concordancia de género rota (debía ser "formas distintas", y
   "tipos de líneas distintas" para concordar con "líneas", el sustantivo
   más cercano — mismo criterio que ya usa la pregunta de cada módulo). */
function genCompareRound(pool, renderItem, pregunta, atributo, adjetivo, recurso){
  adjetivo = adjetivo || 'distintos';
  let nA = randInt(2, Math.min(5, pool.length)), nB = randInt(2, Math.min(5, pool.length));
  while(nB === nA) nB = randInt(2, Math.min(5, pool.length));
  const obraA = shuffle(pool).slice(0, nA);
  const obraB = shuffle(pool).slice(0, nB);
  const correct = nA > nB ? 'A' : 'B';
  const opts = shuffle([{label:'Obra A', value:'A'}, {label:'Obra B', value:'B'}]);
  const panel = function(list, letter){
    return '<div class="compare-col"><span>Obra '+letter+'</span><div class="compare-swatches">'+
      list.map(renderItem).join('')+
    '</div></div>';
  };
  return {
    promptHTML: '<div class="compare-row">'+panel(obraA,'A')+panel(obraB,'B')+'</div><p class="prompt-hint">'+pregunta+'</p>',
    options: opts, correctValue: correct, speakText: pregunta, cols:2, panel:true,
    explain: 'La Obra '+correct+' usa '+(correct==='A'?nA:nB)+' '+atributo+' '+adjetivo+', más que la otra.',
    recurso: recurso,
  };
}

export function genApreciarNTRound(){
  const recurso = 'El <b>colorido</b> es una de las características que se pueden observar y comparar en una obra de arte: cuántos colores distintos usa, y si son colores parecidos entre sí o muy diferentes. Apreciar una obra significa mirarla con atención y describir lo que se ve, en vez de solo decir si "gusta" o "no gusta" — por ejemplo, contar cuántos colores distintos aparecen es una forma objetiva de comparar dos obras. Esta habilidad de observación es el primer paso para desarrollar el gusto artístico: antes de opinar sobre una obra, hay que aprender a mirarla con detalle y notar sus características visuales, como el colorido, las formas y el diseño.';
  return genCompareRound(COLORES_POOL, function(c){ return colorSwatchSVG(c, 30); }, '¿Cuál obra usa más colores?', 'colores', undefined, recurso);
}

export function genCompararFormasNTRound(){
  const recurso = 'Las <b>formas</b> son otra característica visual que se puede observar en una obra de arte: círculos, cuadrados, triángulos, y muchas otras. Comparar cuántas formas distintas usa una obra ayuda a describirla con más detalle, fijándose no solo en los colores sino también en los contornos y siluetas que la componen. Reconocer y contar formas distintas dentro de una imagen entrena la observación visual — una habilidad que sirve tanto para apreciar arte como para las matemáticas (geometría) y la lectura (reconocer letras por su forma). Cuantas más formas distintas tiene una obra, más variada se ve visualmente.';
  return genCompareRound(FORMAS_POOL, function(f){ return shapeSVG(f, 34); }, '¿Cuál obra usa más formas distintas?', 'formas', 'distintas', recurso);
}

export function genLineasDisenoNTRound(){
  const recurso = 'El <b>diseño</b> de una obra también se puede describir por el tipo de líneas que usa: líneas rectas (vertical, horizontal, diagonal) o líneas curvas (espiral, quebrada, ondulada). Cada tipo de línea le da una sensación distinta a una obra — las líneas rectas suelen transmitir orden y firmeza, mientras que las líneas curvas transmiten movimiento y suavidad. Aprender a distinguir tipos de líneas ayuda a describir el diseño de una obra con vocabulario más preciso, en vez de decir solo que "se ve bonita" o "se ve rara". Esta observación del diseño es la base para, más adelante, aprender a dibujar y crear composiciones propias usando distintos tipos de línea a propósito.';
  return genCompareRound(LINEAS_POOL, function(l){ return lineTypeSVG(l, 34); }, '¿Cuál obra usa más tipos de líneas distintas?', 'tipos de líneas', 'distintas', recurso);
}

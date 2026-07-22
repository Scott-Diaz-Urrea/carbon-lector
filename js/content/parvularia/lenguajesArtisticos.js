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
function genCompareRound(pool, renderItem, pregunta, atributo, adjetivo){
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
  };
}

export function genApreciarNTRound(){
  return genCompareRound(COLORES_POOL, function(c){ return colorSwatchSVG(c, 30); }, '¿Cuál obra usa más colores?', 'colores');
}

export function genCompararFormasNTRound(){
  return genCompareRound(FORMAS_POOL, function(f){ return shapeSVG(f, 34); }, '¿Cuál obra usa más formas distintas?', 'formas', 'distintas');
}

export function genLineasDisenoNTRound(){
  return genCompareRound(LINEAS_POOL, function(l){ return lineTypeSVG(l, 34); }, '¿Cuál obra usa más tipos de líneas distintas?', 'tipos de líneas', 'distintas');
}

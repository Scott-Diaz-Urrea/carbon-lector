import { randInt, shuffle } from '../../utils.js';
import { colorSwatchSVG } from '../../svg.js';

/* Núcleo Lenguajes Artísticos — Educación Parvularia, NT (Decreto 481/2017,
   ámbito Comunicación Integral, curriculumnacional.cl/curriculum/
   educacion-parvularia/comunicacion-integral/nt-nivel-transicion):
   OA01 -> Aprecia y Compara (describir y comparar características visuales
   como el colorido de dos producciones).
   Quedan fuera: OA02 (comunicar impresiones/emociones propias sobre una
   obra — subjetivo, no tiene una respuesta correcta objetiva), OA03-04
   (interpretar canciones/juegos musicales y expresión corporal/dramática —
   performativo, requiere producción de voz/cuerpo real, no apto para opción
   múltiple), OA05-06 (representar plásticamente o experimentar combinaciones
   de expresión — son tareas de producción propia, no de reconocimiento) y
   OA07 (representar a través del dibujo propio — ídem, producción gráfica). */

export const LENGUAJES_ARTISTICOS_MODULES = [
  { id:'apreciarnt', label:'Aprecia y Compara', open:true, key:'apreciarnt' },
];
export const LENGUAJES_ARTISTICOS_POS = [
  {x:50,y:50},
];

const COLORES_POOL = ['ROJO','AZUL','VERDE','AMARILLO','MORADO','NARANJO','ROSADO'];

export function genApreciarNTRound(){
  let nA = randInt(2,5), nB = randInt(2,5);
  while(nB === nA) nB = randInt(2,5);
  const obraA = shuffle(COLORES_POOL).slice(0, nA);
  const obraB = shuffle(COLORES_POOL).slice(0, nB);
  const correct = nA > nB ? 'A' : 'B';
  const opts = shuffle([{label:'Obra A', value:'A'}, {label:'Obra B', value:'B'}]);
  const panel = function(list, letter){
    return '<div class="compare-col"><span>Obra '+letter+'</span><div class="compare-swatches">'+
      list.map(function(c){ return colorSwatchSVG(c, 30); }).join('')+
    '</div></div>';
  };
  return {
    promptHTML: '<div class="compare-row">'+panel(obraA,'A')+panel(obraB,'B')+'</div><p class="prompt-hint">¿Cuál obra usa más colores?</p>',
    options: opts, correctValue: correct, speakText: '¿Cuál obra usa más colores, la Obra A o la Obra B?', cols:2, panel:true,
    explain: 'La Obra '+correct+' usa '+(correct==='A'?nA:nB)+' colores distintos, más que la otra.',
  };
}

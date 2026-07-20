/* Trazado a mano — Educación Parvularia, núcleo Lenguaje Verbal (Decreto
   481/2017, NT: OA08 "representar gráficamente algunos trazos, letras,
   signos, palabras significativas... utilizando diferentes recursos y
   soportes"). Canvas libre (sin motor de opción múltiple): se dibuja una
   guía tenue (texto o una forma) y el niño la repasa con el dedo, mouse o
   lápiz óptico (Pointer Events unifica los tres). No hay puntaje — es un
   ejercicio motor de pre-escritura, no una evaluación.

   `guide` acepta dos formas:
   - un string ('MAYA', 'A', '3') -> se dibuja como texto grande, letra por
     letra o número, para trazar nombres, vocales o números.
   - un objeto {shape:'horizontal'|'vertical'|'diagonal'|'curva'|'zigzag'|
     'ondas'|'circulo'|'espiral'} -> se dibuja un trazo básico de
     grafomotricidad (líneas y formas previas a la escritura de letras). */

export function renderTraceCanvas(canvasId, opts){
  opts = opts || {};
  const h = opts.height || 200;
  return '<div class="trace-wrap">'+
    '<canvas id="'+canvasId+'" class="trace-canvas" style="height:'+h+'px;"></canvas>'+
    '<div class="trace-actions">'+
      '<button type="button" class="cta-btn secondary" id="'+canvasId+'-clear">Borrar y repetir 🧽</button>'+
    '</div>'+
  '</div>';
}

function drawGuideText(ctx, rect, text){
  const label = (text || '').toUpperCase();
  const fontSize = Math.max(28, Math.min(72, Math.round(rect.width / Math.max(3, label.length) * 1.15)));
  ctx.font = '700 ' + fontSize + 'px "Baloo 2", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(29,53,87,0.18)';
  ctx.fillText(label, rect.width / 2, rect.height / 2);
}

function drawGuideShape(ctx, rect, shapeId){
  const w = rect.width, h = rect.height;
  ctx.strokeStyle = 'rgba(29,53,87,0.22)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([14,10]);
  ctx.beginPath();
  if(shapeId === 'horizontal'){
    ctx.moveTo(w*0.1, h*0.5); ctx.lineTo(w*0.9, h*0.5);
  }else if(shapeId === 'vertical'){
    ctx.moveTo(w*0.5, h*0.12); ctx.lineTo(w*0.5, h*0.88);
  }else if(shapeId === 'diagonal'){
    ctx.moveTo(w*0.15, h*0.85); ctx.lineTo(w*0.85, h*0.15);
  }else if(shapeId === 'curva'){
    ctx.moveTo(w*0.75, h*0.18);
    ctx.quadraticCurveTo(w*0.15, h*0.5, w*0.75, h*0.82);
  }else if(shapeId === 'zigzag'){
    ctx.moveTo(w*0.08, h*0.25);
    ctx.lineTo(w*0.3, h*0.75);
    ctx.lineTo(w*0.5, h*0.25);
    ctx.lineTo(w*0.7, h*0.75);
    ctx.lineTo(w*0.92, h*0.25);
  }else if(shapeId === 'ondas'){
    ctx.moveTo(w*0.05, h*0.5);
    ctx.quadraticCurveTo(w*0.1875, h*0.15, w*0.325, h*0.5);
    ctx.quadraticCurveTo(w*0.4625, h*0.85, w*0.6, h*0.5);
    ctx.quadraticCurveTo(w*0.7375, h*0.15, w*0.875, h*0.5);
    ctx.quadraticCurveTo(w*0.9, h*0.62, w*0.95, h*0.5);
  }else if(shapeId === 'circulo'){
    ctx.arc(w*0.5, h*0.5, Math.min(w,h)*0.32, 0, Math.PI*2);
  }else if(shapeId === 'espiral'){
    const cx = w*0.5, cy = h*0.5;
    ctx.moveTo(cx, cy);
    for(let a = 0.3; a <= Math.PI*5.5; a += 0.2){
      const r = a * (Math.min(w,h)*0.052);
      ctx.lineTo(cx + r*Math.cos(a), cy + r*Math.sin(a));
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

let cleanupPrevious = null;

export function initTraceCanvas(canvasId, guide){
  if(cleanupPrevious){ cleanupPrevious(); cleanupPrevious = null; }
  const canvas = document.getElementById(canvasId);
  if(!canvas) return null;
  const ctx = canvas.getContext('2d');

  function drawGuide(){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    if(guide && typeof guide === 'object' && guide.shape){
      drawGuideShape(ctx, rect, guide.shape);
    }else{
      drawGuideText(ctx, rect, String(guide || ''));
    }
  }

  let drawing = false, lastX = 0, lastY = 0;
  function pos(e){
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function start(e){
    drawing = true;
    const p = pos(e);
    lastX = p.x; lastY = p.y;
    canvas.setPointerCapture(e.pointerId);
  }
  function move(e){
    if(!drawing) return;
    const p = pos(e);
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x; lastY = p.y;
  }
  function end(){ drawing = false; }

  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', end);

  function onResize(){ drawGuide(); }
  window.addEventListener('resize', onResize);
  cleanupPrevious = function(){ window.removeEventListener('resize', onResize); };
  drawGuide();

  const clearBtn = document.getElementById(canvasId + '-clear');
  if(clearBtn) clearBtn.onclick = drawGuide;

  return { clear: drawGuide };
}

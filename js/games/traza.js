/* Trazado de nombre — Educación Parvularia, núcleo Lenguaje Verbal (Decreto
   481/2017, NT: "iniciarse en la escritura mediante el trazado de líneas,
   letras y su propio nombre"). Canvas libre (sin motor de opción múltiple):
   se dibuja el nombre como guía tenue y el niño lo repasa con el dedo, mouse
   o lápiz óptico (Pointer Events unifica los tres). No hay puntaje — es un
   ejercicio motor de pre-escritura, no una evaluación. */

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

export function initTraceCanvas(canvasId, text){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return null;
  const ctx = canvas.getContext('2d');
  const label = (text || '').toUpperCase();

  function drawGuide(){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    const fontSize = Math.max(28, Math.min(72, Math.round(rect.width / Math.max(3, label.length) * 1.15)));
    ctx.font = '700 ' + fontSize + 'px "Baloo 2", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(29,53,87,0.18)';
    ctx.fillText(label, rect.width / 2, rect.height / 2);
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
  drawGuide();

  const clearBtn = document.getElementById(canvasId + '-clear');
  if(clearBtn) clearBtn.onclick = drawGuide;

  return { clear: drawGuide, destroy: function(){ window.removeEventListener('resize', onResize); } };
}

/* Trazado a mano — Educación Parvularia, núcleo Lenguaje Verbal (Decreto
   481/2017, NT: OA08 "representar gráficamente algunos trazos, letras,
   signos, palabras significativas... utilizando diferentes recursos y
   soportes"). Canvas libre (sin motor de opción múltiple): se dibuja una
   guía tenue (texto o una forma) y el niño la repasa con el dedo, mouse o
   lápiz óptico (Pointer Events unifica los tres). No hay puntaje — es un
   ejercicio motor de pre-escritura, no una evaluación.

   `guide` acepta tres formas:
   - un string ('MAYA', 'A', '3') -> texto grande en el estilo por defecto
     ('imprenta-mayus', el mismo look de siempre) — mantiene compatibilidad
     con el código anterior a la introducción de TYPO_STYLES.
   - un objeto {text:'MAYA', styleId:'imprenta-mayus'} -> texto grande en
     una tipografía específica (ver TYPO_STYLES abajo).
   - un objeto {shape:'horizontal'|'vertical'|'diagonal'|'curva'|'zigzag'|
     'ondas'|'circulo'|'espiral'} -> se dibuja un trazo básico de
     grafomotricidad (líneas y formas previas a la escritura de letras). */

/* Cuatro tipografías de práctica: imprenta (letra de imprenta/molde, la que
   se enseña primero en NT) y manuscrita (letra ligada/cursiva) en
   mayúscula/minúscula. La minúscula manuscrita usa la fuente Google
   "Playwrite CL" — no es una cursiva genérica: es la fuente que Google/
   TypeTogether diseñaron específicamente para modelar la "letra ligada"
   que se enseña en las escuelas chilenas (parte de la familia Playwrite,
   con una variante por país), y su minúscula es fiel a ese modelo. Solo
   viene en un peso (400, el más oscuro disponible en esta familia).

   La MAYÚSCULA manuscrita, en cambio, usa Baloo 2 (la misma forma que
   imprenta-mayus), NO Playwrite CL. Esto no es un descuido: el diseño por
   defecto de Playwrite CL mezcla mayúsculas "simples" (A, N — se ven casi
   como una minúscula agrandada) con mayúsculas "decorativas" muy
   ornamentadas (Q, T, Z — trazos poco reconocibles para un niño de 5-6
   años, confirmado revisando la ficha oficial del tipo en Google Fonts:
   TypeTogether documenta esa mezcla como una característica intencional
   del diseño, no un bug). No existe una forma vía CSS de pedir la
   variante de mayúscula simplificada del mismo tipo (se probaron los
   OpenType stylistic sets ss01-09 y character variants cv01-10 sin efecto
   — la versión que sirve Google Fonts vía CDN no expone esos alternates).
   Además, el modelo real que usan los cuadernos de caligrafía chilenos más
   comunes (Cuadernos Rubio, Santillana) es híbrido: minúscula ligada +
   MAYÚSCULA de imprenta sin unir, no la mayúscula cursiva ornamentada — así
   que usar Baloo 2 para la mayúscula manuscrita es a la vez más legible
   para un niño y más fiel a lo que de verdad se enseña en la sala. */
export const TYPO_STYLES = [
  { id:'imprenta-mayus', label:'Imprenta MAYÚSCULA', case:'upper', family:'"Baloo 2", system-ui, sans-serif', weight:700, sizeMult:1.15 },
  { id:'imprenta-minus', label:'imprenta minúscula', case:'lower', family:'"Baloo 2", system-ui, sans-serif', weight:700, sizeMult:1.15 },
  { id:'manuscrita-mayus', label:'Manuscrita MAYÚSCULA', case:'upper', family:'"Baloo 2", system-ui, sans-serif', weight:700, sizeMult:1.15 },
  { id:'manuscrita-minus', label:'manuscrita minúscula', case:'lower', family:'"Playwrite CL", cursive', weight:400, sizeMult:1.5 },
];
const DEFAULT_STYLE_ID = 'imprenta-mayus';
export function typoStyle(id){
  return TYPO_STYLES.filter(function(s){ return s.id===id; })[0] || TYPO_STYLES[0];
}

/* La guía de "Manuscrita MAYÚSCULA" se ve idéntica a "Imprenta MAYÚSCULA"
   (ambas usan Baloo 2, ver comentario junto a TYPO_STYLES) — sin esta nota
   se vería como un error de la app en vez de una decisión pedagógica. */
export function styleNote(styleId){
  return styleId === 'manuscrita-mayus'
    ? 'En letra ligada las mayúsculas se escriben igual que en imprenta — por eso se ven iguales.'
    : '';
}

/* document.fonts.ready no es confiable para saber cuándo una fuente
   específica terminó de cargar: es una foto de "¿hay descargas en curso
   ahora mismo?", y un <canvas> con fillText() no siempre cuenta como
   "necesito esta fuente" a tiempo para que ese promise la espere. La forma
   robusta es pedir la carga explícita de cada estilo con
   document.fonts.load() y solo dibujar una vez resuelta esa promesa
   puntual — por eso se dispara aquí, apenas se importa este módulo, para
   que la descarga ya esté en curso (o lista) antes de que se abra la
   primera hoja de Caligrafía o "Escribe tu Nombre". */
if(typeof document !== 'undefined' && document.fonts){
  TYPO_STYLES.forEach(function(s){
    document.fonts.load(s.weight+' 48px '+s.family).catch(function(){});
  });
}

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

function drawGuideText(ctx, rect, text, styleId){
  const style = typoStyle(styleId || DEFAULT_STYLE_ID);
  const raw = String(text || '');
  const label = style.case === 'lower' ? raw.toLowerCase() : raw.toUpperCase();
  const maxSize = style.family.indexOf('Playwrite') !== -1 ? 108 : 72;
  const fontSize = Math.max(28, Math.min(maxSize, Math.round(rect.width / Math.max(3, label.length) * style.sizeMult)));
  ctx.font = style.weight + ' ' + fontSize + 'px ' + style.family;
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
  const existing = document.getElementById(canvasId);
  if(!existing) return null;
  // Clona y reemplaza el <canvas> para descartar cualquier listener de
  // pointerdown/move/up de una llamada anterior (p.ej. al cambiar de
  // tipografía sin re-renderizar toda la pantalla) — evita que se acumulen
  // listeners duplicados sobre el mismo elemento.
  const canvas = existing.cloneNode(true);
  existing.replaceWith(canvas);
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
    }else if(guide && typeof guide === 'object' && 'text' in guide){
      drawGuideText(ctx, rect, guide.text, guide.styleId);
    }else{
      drawGuideText(ctx, rect, String(guide || ''), DEFAULT_STYLE_ID);
    }
  }

  // Si la guía es texto y su fuente aún no está lista, la primera llamada a
  // fillText() se dibuja con la fuente de respaldo del navegador — hay que
  // pedir la carga explícita de esa fuente puntual y recién ahí volver a
  // dibujar, o el trazo de la primera hoja de cada estilo se ve con la
  // tipografía equivocada (ver comentario junto a TYPO_STYLES).
  const textGuide = guide && typeof guide === 'object' && 'text' in guide;
  if(document.fonts && textGuide){
    const style = typoStyle(guide.styleId || DEFAULT_STYLE_ID);
    const spec = style.weight+' 48px '+style.family;
    if(!document.fonts.check(spec)){
      document.fonts.load(spec).then(function(){
        if(document.body.contains(canvas)) drawGuide();
      }).catch(function(){});
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

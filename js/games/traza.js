/* Trazado a mano — Educación Parvularia, núcleo Lenguaje Verbal (Decreto
   481/2017, NT: OA08 "representar gráficamente algunos trazos, letras,
   signos, palabras significativas... utilizando diferentes recursos y
   soportes"). Canvas libre (sin motor de opción múltiple): se dibuja una
   guía tenue (texto o una forma) y el niño la repasa con el dedo, mouse o
   lápiz óptico (Pointer Events unifica los tres).

   `guide` acepta tres formas:
   - un string ('MAYA', 'A', '3') -> texto grande en el estilo por defecto
     ('imprenta-mayus', el mismo look de siempre) — mantiene compatibilidad
     con el código anterior a la introducción de TYPO_STYLES.
   - un objeto {text:'MAYA', styleId:'imprenta-mayus'} -> texto grande en
     una tipografía específica (ver TYPO_STYLES abajo).
   - un objeto {shape:'horizontal'|'vertical'|'diagonal'|'curva'|'zigzag'|
     'ondas'|'circulo'|'espiral'} -> se dibuja un trazo básico de
     grafomotricidad (líneas y formas previas a la escritura de letras).

   `initTraceCanvas()` devuelve `{ clear, getStars }` — `getStars()` compara
   (por celdas, ver gridScore()) la tinta real del niño contra una máscara
   sólida de la misma guía para estimar qué tan bien se repasó, y devuelve
   1 a 3 estrellas (0 si no se dibujó nada). Pedido explícito del usuario:
   antes todos los módulos de trazado (Escribe tu Nombre, Caligrafía)
   otorgaban siempre 3 estrellas sin mirar el resultado — ahora el puntaje
   refleja qué tan bien se dibujó, sin dejar de ser generoso con la
   tolerancia (una celda cuenta si hay tinta cerca, no exactamente encima),
   porque el trazo de un niño de 5-6 años nunca va a calcar el modelo a la
   perfección. */

/* Cuatro tipografías de práctica: imprenta (letra de imprenta/molde, la que
   se enseña primero en NT) y manuscrita (letra ligada/cursiva) en
   mayúscula/minúscula. Manuscrita usa la fuente Google "Playwrite ES" para
   AMBOS casos (mayúscula y minúscula) — no es una cursiva genérica: es la
   fuente que Google/TypeTogether diseñaron para modelar la "letra ligada"
   que se enseña en las escuelas (familia Playwrite, con una variante por
   país/modelo pedagógico).

   Se usa el modelo "ES" (España) y no "CL" (Chile) a propósito, tras pedirle
   el usuario una mayúscula manuscrita "real" (no una sustituta): el diseño
   por defecto de Playwrite CL mezcla mayúsculas "simples" (A, N) con
   mayúsculas "decorativas" muy ornamentadas (Q, T, Z — trazos poco
   reconocibles para un niño de 5-6 años); no hay forma vía CSS de pedir una
   variante más simple del mismo tipo (se probaron los OpenType stylistic
   sets ss01-09 y character variants cv01-10 sin efecto — la versión que
   sirve Google Fonts vía CDN no expone esos alternates). Playwrite ES, en
   cambio, modela el estilo "híbrido" (minúscula ligada + MAYÚSCULA de
   imprenta simple, sin ornamentar) que en la práctica es el que enseñan los
   cuadernos de caligrafía más comunes en Chile (Cuadernos Rubio, Santillana)
   — así que además de ser más legible, es más fiel a lo que de verdad se
   enseña en la sala, y da una mayúscula manuscrita genuina en vez de una
   sustituta con Baloo 2. Solo viene en un peso (400). */
export const TYPO_STYLES = [
  { id:'imprenta-mayus', label:'Imprenta MAYÚSCULA', case:'upper', family:'"Baloo 2", system-ui, sans-serif', weight:700 },
  { id:'imprenta-minus', label:'imprenta minúscula', case:'lower', family:'"Baloo 2", system-ui, sans-serif', weight:700 },
  { id:'manuscrita-mayus', label:'Manuscrita MAYÚSCULA', case:'upper', family:'"Playwrite ES", cursive', weight:400 },
  { id:'manuscrita-minus', label:'manuscrita minúscula', case:'lower', family:'"Playwrite ES", cursive', weight:400 },
];
const DEFAULT_STYLE_ID = 'imprenta-mayus';
export function typoStyle(id){
  return TYPO_STYLES.filter(function(s){ return s.id===id; })[0] || TYPO_STYLES[0];
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

/* Encuentra el font-size más grande que quepa en `maxWidth` para esta
   fuente/palabra específica, midiendo el ancho real con measureText() en
   vez de estimarlo con una fórmula fija — así imprenta y manuscrita quedan
   del mismo tamaño para el mismo nombre (antes cada tipografía tenía su
   propio multiplicador/tope, y una se veía notoriamente más chica que la
   otra para el mismo texto), y cualquier nombre, largo o corto, queda
   garantizado dentro del rectángulo en vez de solo aproximado. */
function fitFontSize(ctx, label, style, maxWidth, maxSize, minSize){
  let size = maxSize;
  while(size > minSize){
    ctx.font = style.weight + ' ' + size + 'px ' + style.family;
    if(ctx.measureText(label).width <= maxWidth) break;
    size -= 2;
  }
  return size;
}

/* `forMask` dibuja la misma guía pero sólida/opaca (sin el gris tenue ni el
   trazo punteado) — la usa getStars() para generar una máscara de
   comparación por píxeles, no para mostrarle nada al niño. */
function drawGuideText(ctx, rect, text, styleId, forMask){
  const style = typoStyle(styleId || DEFAULT_STYLE_ID);
  const raw = String(text || '');
  const label = style.case === 'lower' ? raw.toLowerCase() : raw.toUpperCase();
  const padding = Math.max(12, rect.width * 0.06);
  const maxWidth = rect.width - padding * 2;
  const maxSize = Math.min(120, Math.round(rect.height * 0.78));
  const fontSize = fitFontSize(ctx, label, style, maxWidth, maxSize, 24);
  ctx.font = style.weight + ' ' + fontSize + 'px ' + style.family;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if(forMask){
    // Sin engrosar el glyph: gridScore() ya da tolerancia dilatando por
    // celda (~1 celda en cada dirección) tanto la guía como la tinta, así
    // que engrosar la máscara del glyph aquí solo hacía que un trazo bien
    // centrado (más angosto que el glyph inflado) nunca llegara a cubrirla
    // por completo, aunque el niño repasara la letra a la perfección.
    ctx.fillStyle = '#000000';
    ctx.fillText(label, rect.width / 2, rect.height / 2);
    return;
  }
  ctx.fillStyle = 'rgba(29,53,87,0.18)';
  ctx.fillText(label, rect.width / 2, rect.height / 2);
}

function drawGuideShape(ctx, rect, shapeId, forMask){
  const w = rect.width, h = rect.height;
  ctx.strokeStyle = forMask ? '#000000' : 'rgba(29,53,87,0.22)';
  ctx.lineWidth = forMask ? 12 : 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if(!forMask) ctx.setLineDash([14,10]);
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

/* Compara la máscara de la guía (dibujada sólida por drawGuideText/Shape con
   forMask=true) contra la tinta real del niño, en una grilla de celdas en
   vez de píxel a píxel — así el trazo tiene tolerancia natural (una celda
   "cuenta" si hay algo de tinta cerca, no exactamente encima) sin tener que
   difuminar imágenes completas, que sería mucho más lento.
   - cobertura: qué fracción de la guía quedó repasada (¿pasó por todas las
     partes de la letra, o se saltó pedazos?).
   - precisión: qué fracción de la tinta cayó cerca de la guía (¿se quedó
     dentro del trazo, o garabateó fuera de la letra?).
   El puntaje final es el MÍNIMO de las dos, no el promedio — promediarlas
   dejaba puntaje alto a una sola rayita perezosa que pasara justo por el
   medio de la palabra (100% precisión, pero cubriendo solo ~25% de la
   guía, promediaba "excelente"); con el mínimo, hace falta cubrir la
   mayor parte de la guía Y mantenerse cerca de ella para sacar buen
   puntaje. 0 si no se dibujó nada. */
function gridScore(guideData, inkData, width, height){
  const cols = 28, rows = 28;
  const cellW = width / cols, cellH = height / rows;
  const guideGrid = new Uint8Array(cols * rows);
  const inkGrid = new Uint8Array(cols * rows);
  const step = 2;
  for(let y = 0; y < height; y += step){
    const cy = Math.min(rows - 1, Math.floor(y / cellH));
    for(let x = 0; x < width; x += step){
      const idx = (y * width + x) * 4;
      const cx = Math.min(cols - 1, Math.floor(x / cellW));
      const cellIdx = cy * cols + cx;
      if(guideData[idx + 3] > 40) guideGrid[cellIdx] = 1;
      if(inkData[idx + 3] > 40) inkGrid[cellIdx] = 1;
    }
  }
  /* Dilata una grilla ±1 celda en cada dirección — es la tolerancia real
     (la máscara de la guía ya no se infla artificialmente, ver forMask en
     drawGuideText/Shape, porque eso hacía que un trazo bien centrado pero
     más angosto que la máscara inflada nunca llegara a cubrirla del todo).
     Se dilata la guía para chequear precisión (¿la tinta quedó cerca de la
     guía?) y la tinta para chequear cobertura (¿la guía quedó cerca de
     tinta?), así ambos chequeos tienen la misma tolerancia simétrica. */
  function dilate(grid){
    const out = new Uint8Array(grid);
    for(let y = 0; y < rows; y++){
      for(let x = 0; x < cols; x++){
        if(!grid[y * cols + x]) continue;
        for(let dy = -1; dy <= 1; dy++){
          for(let dx = -1; dx <= 1; dx++){
            const nx = x + dx, ny = y + dy;
            if(nx >= 0 && nx < cols && ny >= 0 && ny < rows) out[ny * cols + nx] = 1;
          }
        }
      }
    }
    return out;
  }
  const guideDilated = dilate(guideGrid);
  const inkDilated = dilate(inkGrid);
  let guideCount = 0, coveredCount = 0, inkCount = 0, inkNear = 0;
  for(let i = 0; i < cols * rows; i++){
    if(guideGrid[i]){ guideCount++; if(inkDilated[i]) coveredCount++; }
    if(inkGrid[i]){ inkCount++; if(guideDilated[i]) inkNear++; }
  }
  if(inkCount === 0) return 0;
  const coverage = guideCount ? coveredCount / guideCount : 0;
  const accuracy = inkNear / inkCount;
  return Math.min(coverage, accuracy);
}

function starsFromScore(score){
  if(score <= 0) return 0;
  if(score >= 0.55) return 3;
  if(score >= 0.3) return 2;
  return 1;
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

  /* Canvas invisible en paralelo: acumula SOLO la tinta real del niño (sin
     la guía tenue de fondo), en las mismas coordenadas/transform que el
     canvas visible, para poder comparar contra la máscara de la guía al
     terminar y calcular cuántas estrellas otorgar (ver getStars() más
     abajo). Se reinicia cada vez que se redibuja la guía (drawGuide), lo
     que también cubre "Borrar y repetir" (llama a drawGuide) y el resize. */
  const inkCanvas = document.createElement('canvas');
  const inkCtx = inkCanvas.getContext('2d');

  function drawGuide(){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    inkCanvas.width = canvas.width;
    inkCanvas.height = canvas.height;
    inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if(guide && typeof guide === 'object' && guide.shape){
      drawGuideShape(ctx, rect, guide.shape);
    }else if(guide && typeof guide === 'object' && 'text' in guide){
      drawGuideText(ctx, rect, guide.text, guide.styleId);
    }else{
      drawGuideText(ctx, rect, String(guide || ''), DEFAULT_STYLE_ID);
    }
  }

  /* Rasteriza la misma guía a full opacidad en un canvas aparte (nunca se
     muestra) para comparar contra la tinta acumulada — ver gridScore(). */
  function getStars(){
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const mctx = maskCanvas.getContext('2d');
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if(guide && typeof guide === 'object' && guide.shape){
      drawGuideShape(mctx, rect, guide.shape, true);
    }else if(guide && typeof guide === 'object' && 'text' in guide){
      drawGuideText(mctx, rect, guide.text, guide.styleId, true);
    }else{
      drawGuideText(mctx, rect, String(guide || ''), DEFAULT_STYLE_ID, true);
    }
    const guideData = mctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
    const inkData = inkCtx.getImageData(0, 0, inkCanvas.width, inkCanvas.height).data;
    const score = gridScore(guideData, inkData, maskCanvas.width, maskCanvas.height);
    return starsFromScore(score);
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
    [ctx, inkCtx].forEach(function(c){
      c.strokeStyle = '#FF6B6B';
      c.lineWidth = 9;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.beginPath();
      c.moveTo(lastX, lastY);
      c.lineTo(p.x, p.y);
      c.stroke();
    });
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

  return { clear: drawGuide, getStars: getStars };
}

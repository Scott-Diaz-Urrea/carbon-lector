export function starSVG(filled){
  return '<svg viewBox="0 0 24 24" fill="' + (filled ? 'var(--star)' : '#E3E8F0') + '">'+
    '<path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-4-6.3 4 1.7-7L2 9.7l7.1-.6z"/></svg>';
}
export function starsRow(n){
  let s='';
  for(let i=0;i<3;i++) s += starSVG(i<n);
  return '<div class="node-stars">'+s+'</div>';
}
export function lockIconSVG(size){
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="#8E9BB3" stroke-width="2.4">'+
    '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
}
export function backIconSVG(){
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D3557" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
}
export function mascotSVG(size){
  size = size || 200;
  const h = Math.round(size * 190/200);
  return '<svg width="'+size+'" height="'+h+'" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">'+
    '<ellipse cx="100" cy="178" rx="38" ry="8" fill="#1D3557" opacity="0.13"/>'+
    '<path d="M146 116 q24 -8 22 14 q-2 16 -20 11 q-9 -2 -7 -13 q2 -8 5 -12 Z" fill="#2E2A28"/>'+
    '<ellipse cx="100" cy="138" rx="50" ry="40" fill="#2E2A28"/>'+
    '<ellipse cx="78" cy="172" rx="12" ry="10" fill="#4A443F"/>'+
    '<ellipse cx="122" cy="172" rx="12" ry="10" fill="#4A443F"/>'+
    '<path d="M64 118 q36 20 72 0" stroke="#FF6B6B" stroke-width="8" fill="none" stroke-linecap="round"/>'+
    '<circle cx="100" cy="130" r="6.5" fill="#FFD23F" stroke="#F0932B" stroke-width="1.5"/>'+
    '<path d="M58 70 q-24 6 -15 36 q7 19 25 10 Z" fill="#221F1D"/>'+
    '<path d="M142 70 q24 6 15 36 q-7 19 -25 10 Z" fill="#221F1D"/>'+
    '<circle cx="100" cy="88" r="46" fill="#2E2A28"/>'+
    '<path d="M72 59 q28 -14 56 0" stroke="#5C5450" stroke-width="3" fill="none" stroke-linecap="round"/>'+
    '<path d="M76 69 q24 -10 48 0" stroke="#5C5450" stroke-width="2.6" fill="none" stroke-linecap="round"/>'+
    '<path d="M80 78 q20 -6 40 0" stroke="#5C5450" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<ellipse cx="100" cy="107" rx="28" ry="20" fill="#524B45"/>'+
    '<path d="M77 100 q-5 8 2 15" stroke="#3A3532" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>'+
    '<path d="M123 100 q5 8 -2 15" stroke="#3A3532" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.55"/>'+
    '<ellipse cx="100" cy="101" rx="9.5" ry="7.5" fill="#131110"/>'+
    '<path d="M91 115 q9 9 18 0" stroke="#131110" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
    '<path d="M104 115 q11 6 8 17 q-2 8 -11 6 q-6 -2 -5 -11 q1 -8 8 -12 Z" fill="#FF9EB0"/>'+
    '<path d="M106 121 q3 4 2 8" stroke="#E8788F" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.55"/>'+
    '<circle cx="79" cy="83" r="12" fill="#6B4226"/>'+
    '<circle cx="121" cy="83" r="12" fill="#6B4226"/>'+
    '<circle cx="79" cy="84" r="6.5" fill="#2B1810"/>'+
    '<circle cx="121" cy="84" r="6.5" fill="#2B1810"/>'+
    '<circle cx="82.5" cy="78.5" r="3.8" fill="#fff"/>'+
    '<circle cx="124.5" cy="78.5" r="3.8" fill="#fff"/>'+
    '<circle cx="124.5" cy="78" r="3.6" fill="#fff"/>'+
    '</svg>';
}

export function shapeSVG(id, size){
  size = size || 100;
  const colors = { circulo:'#FF6B6B', cuadrado:'#12A594', triangulo:'#FFB627', rectangulo:'#7C6FF0', rombo:'#FF9EB0', ovalo:'#0EA5A0', pentagono:'#F0932B', hexagono:'#5A4CD6' };
  const fill = colors[id] || '#12A594';
  let shape = '';
  if(id==='circulo') shape = '<circle cx="50" cy="50" r="42" fill="'+fill+'"/>';
  else if(id==='cuadrado') shape = '<rect x="10" y="10" width="80" height="80" rx="8" fill="'+fill+'"/>';
  else if(id==='triangulo') shape = '<polygon points="50,8 92,88 8,88" fill="'+fill+'"/>';
  else if(id==='rectangulo') shape = '<rect x="4" y="24" width="92" height="52" rx="8" fill="'+fill+'"/>';
  else if(id==='rombo') shape = '<polygon points="50,6 94,50 50,94 6,50" fill="'+fill+'"/>';
  else if(id==='ovalo') shape = '<ellipse cx="50" cy="50" rx="46" ry="30" fill="'+fill+'"/>';
  else if(id==='pentagono') shape = '<polygon points="50,6 92,38 76,90 24,90 8,38" fill="'+fill+'"/>';
  else if(id==='hexagono') shape = '<polygon points="27,10 73,10 96,50 73,90 27,90 4,50" fill="'+fill+'"/>';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+shape+'</svg>';
}

/* Bandera de Chile dibujada en SVG propio: los emoji de bandera (🇨🇱) no se
   renderizan como bandera en muchas configuraciones de Windows (se ven como
   las letras "CL"), así que se dibuja a mano para que se vea igual en todos
   lados, igual que shapeSVG()/mascotSVG(). */
export function chileFlagSVG(size){
  size = size || 90;
  const h = Math.round(size * 2/3);
  return '<svg width="'+size+'" height="'+h+'" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="0" y="0" width="150" height="100" fill="#FFFFFF"/>'+
    '<rect x="0" y="50" width="150" height="50" fill="#D52B1E"/>'+
    '<rect x="0" y="0" width="50" height="50" fill="#0039A6"/>'+
    '<path d="M25 9 L29.5 22.5 L43.5 22.5 L32 30.5 L36.5 44 L25 36 L13.5 44 L18 30.5 L6.5 22.5 L20.5 22.5 Z" fill="#FFFFFF"/>'+
  '</svg>';
}

/* Swatches de color propios (en vez de depender de emoji de círculo de color)
   para que los tonos coincidan siempre con la paleta real y se vean igual en
   cualquier fuente/sistema operativo. */
const COLOR_HEX = { ROJO:'#E63946', NARANJO:'#FFB627', AMARILLO:'#FFD23F', AZUL:'#1D4ED8', VERDE:'#12A594', MORADO:'#7C6FF0', ROSADO:'#FF9EB0', BLANCO:'#FFFFFF' };
export function colorSwatchSVG(name, size){
  size = size || 60;
  const hex = COLOR_HEX[name] || '#12A594';
  const stroke = name==='BLANCO' ? '#CBD9D4' : 'rgba(0,0,0,0.08)';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<circle cx="50" cy="50" r="42" fill="'+hex+'" stroke="'+stroke+'" stroke-width="4"/>'+
  '</svg>';
}

/* Tipos de línea dibujados a mano (Artes Visuales 2° básico, OA02: vertical,
   horizontal, diagonal, espiral y quebrada) — más precisos que un emoji para
   un concepto central al módulo. */
export function lineTypeSVG(tipo, size){
  size = size || 90;
  let inner = '';
  if(tipo === 'VERTICAL'){
    inner = '<line x1="50" y1="10" x2="50" y2="90" stroke="#7C6FF0" stroke-width="7" stroke-linecap="round"/>';
  }else if(tipo === 'HORIZONTAL'){
    inner = '<line x1="10" y1="50" x2="90" y2="50" stroke="#12A594" stroke-width="7" stroke-linecap="round"/>';
  }else if(tipo === 'DIAGONAL'){
    inner = '<line x1="15" y1="85" x2="85" y2="15" stroke="#FF6B6B" stroke-width="7" stroke-linecap="round"/>';
  }else if(tipo === 'ESPIRAL'){
    let d = 'M 50 50';
    for(let a = 0.3; a <= Math.PI*4.5; a += 0.2){
      const r = a * 4.6;
      d += ' L ' + (50 + r*Math.cos(a)) + ' ' + (50 + r*Math.sin(a));
    }
    inner = '<path d="'+d+'" fill="none" stroke="#FFB627" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
  }else if(tipo === 'QUEBRADA'){
    inner = '<polyline points="10,25 30,75 50,25 70,75 90,25" fill="none" stroke="#0EA5A0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';
}

/* Cuerpos geométricos 3D dibujados a mano (Educación Parvularia, Pensamiento
   Matemático) — mismo enfoque que shapeSVG() para las figuras 2D. */
export function solid3DSVG(id, size){
  size = size || 100;
  const colors = { cubo:'#7C6FF0', esfera:'#FF6B6B', cono:'#FFB627', cilindro:'#12A594', paralelepipedo:'#0EA5A0', piramide:'#E63946' };
  const fill = colors[id] || '#12A594';
  let shape = '';
  if(id==='paralelepipedo'){
    shape = '<polygon points="14,45 50,32 92,42 92,72 50,85 14,75" fill="'+fill+'"/>'+
      '<polygon points="14,45 50,58 50,85 14,75" fill="rgba(0,0,0,0.18)"/>'+
      '<polygon points="50,58 92,42 92,72 50,85" fill="rgba(255,255,255,0.18)"/>';
  }else if(id==='piramide'){
    shape = '<polygon points="50,8 88,78 12,78" fill="'+fill+'"/>'+
      '<polygon points="50,8 50,78 12,78" fill="rgba(0,0,0,0.18)"/>'+
      '<polygon points="50,8 88,78 50,78" fill="rgba(255,255,255,0.15)"/>';
  }else if(id==='esfera'){
    shape = '<circle cx="50" cy="50" r="40" fill="'+fill+'"/>'+
      '<ellipse cx="50" cy="58" rx="28" ry="10" fill="rgba(0,0,0,0.12)"/>'+
      '<ellipse cx="38" cy="36" rx="10" ry="6" fill="rgba(255,255,255,0.45)"/>';
  }else if(id==='cubo'){
    shape = '<polygon points="20,35 55,20 88,33 88,70 55,88 20,72" fill="'+fill+'"/>'+
      '<polygon points="20,35 55,50 55,88 20,72" fill="rgba(0,0,0,0.18)"/>'+
      '<polygon points="55,50 88,33 88,70 55,88" fill="rgba(255,255,255,0.18)"/>';
  }else if(id==='cono'){
    shape = '<polygon points="50,10 78,80 22,80" fill="'+fill+'"/>'+
      '<ellipse cx="50" cy="80" rx="28" ry="9" fill="rgba(0,0,0,0.12)"/>';
  }else if(id==='cilindro'){
    shape = '<rect x="22" y="25" width="56" height="55" fill="'+fill+'"/>'+
      '<ellipse cx="50" cy="80" rx="28" ry="9" fill="rgba(0,0,0,0.15)"/>'+
      '<ellipse cx="50" cy="25" rx="28" ry="9" fill="'+fill+'"/>'+
      '<ellipse cx="50" cy="25" rx="28" ry="9" fill="rgba(255,255,255,0.2)"/>';
  }
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+shape+'</svg>';
}


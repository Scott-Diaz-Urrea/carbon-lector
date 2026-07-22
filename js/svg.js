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
  else if(id==='rombo') shape = '<polygon points="50,20 92,50 50,80 8,50" fill="'+fill+'"/>';
  else if(id==='ovalo') shape = '<ellipse cx="50" cy="50" rx="46" ry="30" fill="'+fill+'"/>';
  else if(id==='pentagono') shape = '<polygon points="50,6 92,38 76,90 24,90 8,38" fill="'+fill+'"/>';
  else if(id==='hexagono') shape = '<polygon points="27,10 73,10 96,50 73,90 27,90 4,50" fill="'+fill+'"/>';
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+shape+'</svg>';
}

/* Íconos propios para conceptos donde el emoji correspondiente no se
   renderiza en muchos sistemas (probado: 🪥🪮🪟🪞🫘🪖 se ven como un
   recuadro vacío/"tofu" en varios navegadores — todos son adiciones
   Unicode 2019-2022, con soporte de fuente todavía incompleto en varios
   sistemas operativos, el mismo tipo de problema que ya motivó
   chileFlagSVG()). cascoSVG() además corrige un problema aparte: el emoji
   🪖 es literalmente un casco militar, no un casco de bicicleta/patines —
   dibujarlo a mano soluciona ambos problemas a la vez. */
export function toothbrushSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="8" y="46" width="52" height="13" rx="6.5" fill="#12A594"/>'+
    '<rect x="55" y="36" width="34" height="24" rx="7" fill="#FFFFFF" stroke="#0C7C70" stroke-width="3"/>'+
    '<line x1="60" y1="36" x2="60" y2="24" stroke="#7C6FF0" stroke-width="4" stroke-linecap="round"/>'+
    '<line x1="68" y1="36" x2="68" y2="22" stroke="#FF6B6B" stroke-width="4" stroke-linecap="round"/>'+
    '<line x1="76" y1="36" x2="76" y2="24" stroke="#FFB627" stroke-width="4" stroke-linecap="round"/>'+
    '<line x1="84" y1="36" x2="84" y2="26" stroke="#7C6FF0" stroke-width="4" stroke-linecap="round"/>'+
  '</svg>';
}
export function peinetaSVG(size){
  size = size || 90;
  let teeth = '';
  for(let i=0;i<9;i++){
    const x = 14 + i*8.5;
    teeth += '<line x1="'+x+'" y1="38" x2="'+x+'" y2="80" stroke="#F0932B" stroke-width="4" stroke-linecap="round"/>';
  }
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="10" y="20" width="80" height="20" rx="8" fill="#FFB627"/>'+
    teeth+
  '</svg>';
}
export function vidrioSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="14" y="14" width="72" height="72" rx="6" fill="#BFE9E3" fill-opacity="0.35" stroke="#12A594" stroke-width="4"/>'+
    '<line x1="50" y1="14" x2="50" y2="86" stroke="#12A594" stroke-width="3"/>'+
    '<line x1="14" y1="50" x2="86" y2="50" stroke="#12A594" stroke-width="3"/>'+
    '<path d="M22 30 L38 14" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.85"/>'+
  '</svg>';
}
/* Vaso de agua dibujado a mano: 🥛 es literalmente "vaso de LECHE" (líquido
   blanco opaco), no de agua — usarlo para "el vaso de agua está al lado del
   plato" (Corporalidad y Movimiento, Ubicación Espacial) mostraba el
   concepto equivocado. El vidrio es transparente y el líquido celeste
   translúcido, para que se lea claramente como agua y no como leche. */
export function vasoAguaSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M30 20 L70 20 L64 88 L36 88 Z" fill="#DDEFFB" fill-opacity="0.35" stroke="#0C7C70" stroke-width="4"/>'+
    '<path d="M33 42 L67 42 L64 88 L36 88 Z" fill="#7EC8E3" fill-opacity="0.55"/>'+
    '<path d="M36 26 L40 26" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.85"/>'+
  '</svg>';
}
/* Vaso de vidrio vacío (Ciencias Naturales 1° básico, "un vaso de vidrio" —
   ejemplo de objeto hecho de vidrio): 🍶 es literalmente una botella de sake,
   no un vaso para beber — mismo tipo de error que 🥛 para "vaso de agua"
   (ver vasoAguaSVG arriba), así que se dibuja el vaso real, esta vez vacío
   y con un brillo que deje claro que es transparente/vidrio. */
export function vasoVacioSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M30 20 L70 20 L64 88 L36 88 Z" fill="#DDEFFB" fill-opacity="0.25" stroke="#727C87" stroke-width="4"/>'+
    '<path d="M36 26 L40 26" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.85"/>'+
    '<path d="M60 30 L64 30" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>'+
  '</svg>';
}
/* Iglú (Lenguaje, vocal I): no existe un emoji de iglú — 🧊 (cubo de hielo)
   se usaba antes, pero un cubo no se parece en nada a la cúpula de un iglú.
   Se dibuja la cúpula de bloques de hielo con su entrada característica. */
export function igluSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M8 78 Q8 34 50 30 Q92 34 92 78 Z" fill="#DDEFFB" stroke="#8FB8D6" stroke-width="3"/>'+
    '<path d="M32 78 L32 58 Q40 50 48 58 L48 78 Z" fill="#2B3A55"/>'+
    '<path d="M8 78 L92 78" stroke="#8FB8D6" stroke-width="3"/>'+
    '<path d="M20 60 Q30 55 40 60" stroke="#8FB8D6" stroke-width="2" fill="none" opacity="0.7"/>'+
    '<path d="M55 48 Q65 44 76 48" stroke="#8FB8D6" stroke-width="2" fill="none" opacity="0.7"/>'+
  '</svg>';
}
/* Estómago (Ciencias Naturales 2° básico, "¿Qué hace tu estómago?"): no
   existe un emoji de estómago — 🍽️ (plato con cubiertos) se usaba antes,
   pero muestra "comida/comer", no el órgano en sí, a diferencia de ❤️/🫁/🦴
   que sí son el órgano real. Se dibuja la forma característica en J del
   estómago para que sea consistente con el resto del banco (órgano real,
   no una metáfora de su función). */
export function estomagoSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M40 12 Q34 12 34 22 Q34 34 28 42 Q16 56 22 72 Q28 88 50 88 Q76 88 78 64 Q80 44 64 34 Q56 29 56 20 Q56 12 48 12 Z" fill="#E8829A" stroke="#C25B76" stroke-width="4"/>'+
    '<path d="M34 50 Q46 46 58 54" stroke="#C25B76" stroke-width="2.5" fill="none" opacity="0.6"/>'+
  '</svg>';
}
/* Plasticina/masa moldeable (Ciencias Naturales "la plastilina cambia de
   forma al apretarla", Artes Visuales "PLASTICINA"): 🖌️ (pincel) y 🖍️
   (crayón) se usaban en cada archivo respectivamente — ninguno de los dos
   es plasticina, son herramientas de dibujo, no una masa moldeable. Se
   dibuja un bloque de plasticina con la marca de un pulgar hundido, para
   que se lea como "algo que se puede apretar y moldear" y no como un
   lápiz/pincel más. */
export function plasticinaSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M20 55 Q14 30 42 26 Q70 20 82 42 Q92 60 74 74 Q54 90 30 78 Q14 70 20 55 Z" fill="#FF6B6B" stroke="#D6495A" stroke-width="4"/>'+
    '<ellipse cx="52" cy="50" rx="12" ry="9" fill="#D6495A" opacity="0.35"/>'+
  '</svg>';
}
export function espejoSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="42" y="70" width="16" height="24" rx="6" fill="#F0932B"/>'+
    '<ellipse cx="50" cy="42" rx="34" ry="38" fill="#DDEFFB" stroke="#7C6FF0" stroke-width="5"/>'+
    '<path d="M34 28 Q42 20 54 24" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.85"/>'+
  '</svg>';
}
export function semillaSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<ellipse cx="50" cy="52" rx="22" ry="32" fill="#B08968" stroke="#7A5B44" stroke-width="3"/>'+
    '<path d="M50 24 Q56 30 50 38 Q44 30 50 24 Z" fill="#7A5B44"/>'+
  '</svg>';
}
/* Crisálida (etapa del ciclo de vida de la mariposa entre oruga y mariposa
   adulta): no existe un emoji Unicode para esto, así que se dibuja a mano
   — un capullo colgante con nervaduras suaves. */
export function crisalidaSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="50" y1="6" x2="50" y2="18" stroke="#7A5B44" stroke-width="3"/>'+
    '<path d="M50 18 Q72 26 68 52 Q65 82 50 92 Q35 82 32 52 Q28 26 50 18 Z" fill="#8FAE6B" stroke="#5E7A45" stroke-width="3"/>'+
    '<line x1="38" y1="40" x2="62" y2="40" stroke="#5E7A45" stroke-width="2" opacity="0.6"/>'+
    '<line x1="36" y1="55" x2="64" y2="55" stroke="#5E7A45" stroke-width="2" opacity="0.6"/>'+
  '</svg>';
}
/* nidoSVG/groundSVG/cojinSVG: objetos de REFERENCIA para preguntas de
   ubicación relativa (p.ej. "el pajarito está ___ de su nido", "el gato
   duerme ___ los dos cojines") — antes esas escenas solo mostraban al
   sujeto (el pajarito, el gato) sin mostrar el nido/cojín contra el que se
   compara, dejando la mitad de la oración sin respaldo visual. No existe un
   emoji confiable de nido/tierra/cojín (🪺/🪹 son adiciones 2021 con el
   mismo riesgo de no renderizarse que 🪥/🪮/etc.), así que se dibujan a
   mano, del mismo tamaño que el sujeto, para armar una escena de 2-3
   íconos en vez de uno solo. */
export function nidoSVG(size){
  size = size || 60;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<ellipse cx="50" cy="66" rx="40" ry="18" fill="#B08968" stroke="#7A5B44" stroke-width="4"/>'+
    '<path d="M14 62 Q50 74 86 62" fill="none" stroke="#7A5B44" stroke-width="3" opacity="0.7"/>'+
    '<path d="M20 54 Q50 66 80 54" fill="none" stroke="#7A5B44" stroke-width="3" opacity="0.7"/>'+
    '<ellipse cx="40" cy="52" rx="7" ry="9" fill="#EBD9B4"/>'+
    '<ellipse cx="58" cy="50" rx="7" ry="9" fill="#EBD9B4"/>'+
  '</svg>';
}
export function groundSVG(size){
  size = size || 60;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="4" y="52" width="92" height="40" fill="#B08968"/>'+
    '<path d="M4 52 L96 52" stroke="#5E7A45" stroke-width="6"/>'+
    '<path d="M18 52 L14 40 M38 52 L34 38 M58 52 L62 40 M78 52 L82 38" stroke="#5E7A45" stroke-width="3" stroke-linecap="round"/>'+
  '</svg>';
}
export function cojinSVG(size){
  size = size || 60;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<rect x="14" y="14" width="72" height="72" rx="18" fill="#7C6FF0" stroke="#5C4FC0" stroke-width="4"/>'+
    '<path d="M32 32 Q50 44 68 32" fill="none" stroke="#5C4FC0" stroke-width="3" opacity="0.6"/>'+
    '<path d="M32 68 Q50 56 68 68" fill="none" stroke="#5C4FC0" stroke-width="3" opacity="0.6"/>'+
  '</svg>';
}
/* gusanoSVG/focaSVG/piedraSVG/bebidaDulceSVG: dibujados a mano por el mismo
   motivo que el resto de este bloque (el emoji correspondiente no se
   renderiza en varios navegadores), pero además — a pedido explícito del
   usuario — en vez de cambiar la palabra/concepto por otro que sí tuviera
   un emoji bien soportado (como se hizo en una primera pasada: gusano→
   hormiga, foca→foto, piedra→ladrillo), se conserva el concepto original y
   se dibuja directamente. */
export function gusanoSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M20 70 Q20 50 35 50 Q50 50 50 65 Q50 80 65 80 Q80 80 80 60" fill="none" stroke="#E8829A" stroke-width="14" stroke-linecap="round"/>'+
    '<circle cx="20" cy="70" r="9" fill="#E8829A"/>'+
    '<circle cx="17" cy="67" r="1.6" fill="#1D3557"/>'+
    '<line x1="35" y1="43" x2="35" y2="57" stroke="#C25B76" stroke-width="3" stroke-linecap="round"/>'+
    '<line x1="65" y1="73" x2="65" y2="87" stroke="#C25B76" stroke-width="3" stroke-linecap="round"/>'+
  '</svg>';
}
export function focaSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<ellipse cx="52" cy="60" rx="34" ry="22" fill="#8FA6B8"/>'+
    '<circle cx="24" cy="46" r="16" fill="#8FA6B8"/>'+
    '<ellipse cx="72" cy="76" rx="14" ry="7" fill="#7691A6" transform="rotate(20 72 76)"/>'+
    '<circle cx="19" cy="42" r="2.2" fill="#1D3557"/>'+
    '<circle cx="30" cy="42" r="2.2" fill="#1D3557"/>'+
    '<ellipse cx="24" cy="50" rx="3" ry="2" fill="#5C7185"/>'+
    '<line x1="14" y1="50" x2="4" y2="48" stroke="#5C7185" stroke-width="1.5"/>'+
    '<line x1="14" y1="53" x2="4" y2="54" stroke="#5C7185" stroke-width="1.5"/>'+
    '<line x1="34" y1="50" x2="44" y2="48" stroke="#5C7185" stroke-width="1.5"/>'+
    '<line x1="34" y1="53" x2="44" y2="54" stroke="#5C7185" stroke-width="1.5"/>'+
  '</svg>';
}
export function piedraSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M18 70 Q10 50 28 38 Q40 24 60 30 Q82 34 84 56 Q86 76 66 80 Q40 86 18 70 Z" fill="#9AA5B1" stroke="#727C87" stroke-width="3"/>'+
    '<path d="M32 42 Q42 38 50 44" stroke="#727C87" stroke-width="2.5" fill="none" opacity="0.6"/>'+
    '<path d="M55 55 Q65 52 72 58" stroke="#727C87" stroke-width="2.5" fill="none" opacity="0.6"/>'+
  '</svg>';
}
export function bebidaDulceSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M28 34 L34 86 Q35 92 42 92 L58 92 Q65 92 66 86 L72 34 Z" fill="#FF9EB0" stroke="#E8788F" stroke-width="3"/>'+
    '<ellipse cx="50" cy="34" rx="22" ry="7" fill="#FFFFFF" stroke="#E8788F" stroke-width="3"/>'+
    '<path d="M38 28 Q50 12 62 28" fill="#FFFFFF" stroke="#E1EEEA" stroke-width="2"/>'+
    '<circle cx="50" cy="16" r="5" fill="#E63946"/>'+
    '<line x1="54" y1="12" x2="66" y2="4" stroke="#12A594" stroke-width="5" stroke-linecap="round"/>'+
  '</svg>';
}
export function cascoSVG(size){
  size = size || 90;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M12 62 Q12 18 50 18 Q88 18 88 62 Z" fill="#FF6B6B"/>'+
    '<path d="M12 62 Q50 74 88 62" fill="none" stroke="#E85555" stroke-width="4"/>'+
    '<ellipse cx="30" cy="50" rx="7" ry="14" fill="#E85555" opacity="0.6"/>'+
    '<ellipse cx="50" cy="46" rx="7" ry="16" fill="#E85555" opacity="0.6"/>'+
    '<ellipse cx="70" cy="50" rx="7" ry="14" fill="#E85555" opacity="0.6"/>'+
    '<path d="M22 62 Q22 82 30 90" stroke="#1D3557" stroke-width="4" fill="none" stroke-linecap="round"/>'+
    '<path d="M78 62 Q78 82 70 90" stroke="#1D3557" stroke-width="4" fill="none" stroke-linecap="round"/>'+
  '</svg>';
}

/* Figura humana simple animada para representar acciones/movimientos
   (núcleo Corporalidad y Movimiento, módulo "Movimientos del Cuerpo") — a
   pedido explícito del usuario, en vez de un emoji-metáfora fija (p.ej. un
   canguro 🦘 para "saltar", que no es una persona haciendo la acción), se
   dibuja una figura de palitos y se anima cada extremidad por separado con
   CSS (@keyframes en styles.css, un set por acción — mismo mecanismo que
   ya usa `.float` para Carboncito en la Home). Cabeza/torso/brazos/piernas
   son elementos SVG independientes con una clase por parte (pf-head,
   pf-torso, pf-armL/R, pf-legL/R) para que cada selector `.act-<accion>`
   en CSS pueda animar solo las partes que necesita; el contenedor <svg>
   lleva la clase `act-<accion>` que dispara la animación correspondiente. */
export function personActionSVG(action, size){
  size = size || 90;
  return '<svg class="action-figure act-'+action+'" width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<circle class="pf-head" cx="50" cy="16" r="9" fill="#1D3557"/>'+
    '<line class="pf-torso" x1="50" y1="25" x2="50" y2="58" stroke="#1D3557" stroke-width="7" stroke-linecap="round"/>'+
    '<line class="pf-armL" x1="50" y1="30" x2="32" y2="46" stroke="#FF6B6B" stroke-width="6" stroke-linecap="round"/>'+
    '<line class="pf-armR" x1="50" y1="30" x2="68" y2="46" stroke="#FF6B6B" stroke-width="6" stroke-linecap="round"/>'+
    '<line class="pf-legL" x1="50" y1="58" x2="36" y2="88" stroke="#12A594" stroke-width="7" stroke-linecap="round"/>'+
    '<line class="pf-legR" x1="50" y1="58" x2="64" y2="88" stroke="#12A594" stroke-width="7" stroke-linecap="round"/>'+
  '</svg>';
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
const COLOR_HEX = { ROJO:'#E63946', NARANJO:'#FFB627', AMARILLO:'#FFD23F', AZUL:'#1D4ED8', VERDE:'#12A594', MORADO:'#7C6FF0', ROSADO:'#FF9EB0', CELESTE:'#7EC8E3', BLANCO:'#FFFFFF' };
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
  const colors = { cubo:'#7C6FF0', esfera:'#FF6B6B', cono:'#FFB627', cilindro:'#12A594', paralelepipedo:'#0EA5A0', piramide:'#E8829A' };
  const fill = colors[id] || '#12A594';
  let shape = '';
  if(id==='paralelepipedo'){
    shape = '<polygon points="14,45 50,32 92,42 92,72 50,85 14,75" fill="'+fill+'"/>'+
      '<polygon points="14,45 50,58 50,85 14,75" fill="rgba(0,0,0,0.18)"/>'+
      '<polygon points="50,58 92,42 92,72 50,85" fill="rgba(255,255,255,0.18)"/>';
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
  }else if(id==='piramide'){
    shape = '<polygon points="50,10 88,78 12,78" fill="'+fill+'"/>'+
      '<polygon points="50,10 50,78 12,78" fill="rgba(0,0,0,0.18)"/>'+
      '<polygon points="50,10 50,78 88,78" fill="rgba(255,255,255,0.18)"/>';
  }
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+shape+'</svg>';
}

/* Círculo dividido en `den` sectores iguales, con `num` de ellos coloreados
   (Matemática 3° básico, OA11: fracciones de uso común). Dibujado a mano en
   vez de buscar un emoji de "fracción" (no existe uno preciso). */
export function fraccionSVG(num, den, size){
  size = size || 100;
  const cx = 50, cy = 50, r = 44;
  let paths = '';
  for(let i=0; i<den; i++){
    const a0 = (i/den)*2*Math.PI - Math.PI/2;
    const a1 = ((i+1)/den)*2*Math.PI - Math.PI/2;
    const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0);
    const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
    const largeArc = (a1-a0) > Math.PI ? 1 : 0;
    const fill = i < num ? '#FF6B6B' : '#F1F3F6';
    paths += '<path d="M '+cx+' '+cy+' L '+x0+' '+y0+' A '+r+' '+r+' 0 '+largeArc+' 1 '+x1+' '+y1+' Z" fill="'+fill+'" stroke="#FFFFFF" stroke-width="2"/>';
  }
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+paths+'</svg>';
}

/* Barra dividida en `den` partes iguales, con `num` coloreadas — una
   segunda representación visual de la misma fracción (además del círculo
   de fraccionSVG()), para que el juego de Fracciones no repita siempre la
   misma imagen para cada fracción de uso común (1/2, 1/3, 2/3, 1/4, 2/4,
   3/4 son solo 6 valores posibles; con dos estilos de dibujo por valor se
   duplica la variedad real sin inventar fracciones fuera del currículum). */
export function fraccionBarraSVG(num, den, size){
  size = size || 100;
  const w = 90, h = 40, x0 = 5, y0 = 30;
  const partW = w/den;
  let rects = '';
  for(let i=0; i<den; i++){
    const fill = i < num ? '#FF6B6B' : '#F1F3F6';
    rects += '<rect x="'+(x0+i*partW)+'" y="'+y0+'" width="'+partW+'" height="'+h+'" fill="'+fill+'" stroke="#FFFFFF" stroke-width="2"/>';
  }
  return '<svg width="'+size+'" height="'+(size*0.6)+'" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">'+rects+'</svg>';
}

/* Ángulo formado por dos rayos (Matemática 3° básico, OA18): recto (90°),
   agudo (menor a 90°) u obtuso (mayor a 90°). */
export function anguloSVG(tipo, size){
  size = size || 100;
  const deg = tipo==='RECTO' ? 90 : tipo==='AGUDO' ? 45 : 130;
  const rad = deg * Math.PI/180;
  const cx = 15, cy = 85, r = 70;
  const x1 = cx + r, y1 = cy;
  const x2 = cx + r*Math.cos(rad), y2 = cy - r*Math.sin(rad);
  const arcR = 22;
  const ax = cx + arcR, ay = cy;
  const bx = cx + arcR*Math.cos(rad), by = cy - arcR*Math.sin(rad);
  const largeArc = deg > 180 ? 1 : 0;
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
    '<line x1="'+cx+'" y1="'+cy+'" x2="'+x1+'" y2="'+y1+'" stroke="#1D3557" stroke-width="5" stroke-linecap="round"/>'+
    '<line x1="'+cx+'" y1="'+cy+'" x2="'+x2+'" y2="'+y2+'" stroke="#1D3557" stroke-width="5" stroke-linecap="round"/>'+
    '<path d="M '+ax+' '+ay+' A '+arcR+' '+arcR+' 0 '+largeArc+' 0 '+bx+' '+by+'" fill="none" stroke="#FF6B6B" stroke-width="3"/>'+
  '</svg>';
}

/* Gráfico circular (Matemática 6° básico, OA24: leer e interpretar gráficos
   circulares). `categorias` es [{label, valor, color}]; los sectores se
   dibujan proporcionales a valor/total, en el mismo estilo de arco a mano
   que ya usa fraccionSVG(). */
export function pieChartSVG(categorias, size){
  size = size || 140;
  const total = categorias.reduce(function(a,c){ return a+c.valor; }, 0);
  const cx = 50, cy = 50, r = 46;
  let paths = '';
  let acc = 0;
  categorias.forEach(function(c){
    const a0 = (acc/total)*2*Math.PI - Math.PI/2;
    acc += c.valor;
    const a1 = (acc/total)*2*Math.PI - Math.PI/2;
    const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0);
    const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
    const largeArc = (a1-a0) > Math.PI ? 1 : 0;
    paths += '<path d="M '+cx+' '+cy+' L '+x0+' '+y0+' A '+r+' '+r+' 0 '+largeArc+' 1 '+x1+' '+y1+' Z" fill="'+c.color+'" stroke="#FFFFFF" stroke-width="2"/>';
  });
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+paths+'</svg>';
}


export function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
export function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
export function randInt(min,max){ return min + Math.floor(Math.random()*(max-min+1)); }
export function uniqueDistractors(correct, min, max, spread, count){
  const set = new Set([correct]);
  let guard = 0;
  while(set.size<count && guard<200){
    guard++;
    const d = correct + randInt(-spread, spread);
    if(d>=min && d<=max) set.add(d);
  }
  let filler = min;
  while(set.size<count && filler<=max){ set.add(filler); filler++; }
  return shuffle([...set]);
}

/* Arma una escena de 2-3 íconos (referencia-sujeto-referencia si hay 2
   referencias, o sujeto-referencia si hay 1) para preguntas de ubicación
   relativa ("el vaso está ___ del plato", "el gato duerme ___ los dos
   cojines"): antes esas escenas solo mostraban al sujeto sin la
   referencia contra la que se ubica, dejando la mitad de la oración sin
   respaldo visual (detectado por el usuario en la escena del vaso de
   agua). Compartido entre corporalidadMovimiento.js y
   pensamientoMatematico.js, que tienen el mismo tipo de pregunta. */
export function sceneRefsHTML(subject, refs){
  const parts = refs.length >= 2
    ? [refs[0], subject, refs[1]]
    : [subject, refs[0]];
  return '<div class="scene-refs">'+parts.map(function(p){ return '<span class="scene-icon">'+p+'</span>'; }).join('')+'</div>';
}

export function pathD(points){
  let d = 'M ' + points[0].x + ' ' + points[0].y;
  for(let i=1;i<points.length;i++){
    const p0 = points[i-1], p1 = points[i];
    const mx = (p0.x+p1.x)/2;
    d += ' Q ' + mx + ' ' + p0.y + ', ' + mx + ' ' + ((p0.y+p1.y)/2) + ' T ' + p1.x + ' ' + p1.y;
  }
  return d;
}

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

export function pathD(points){
  let d = 'M ' + points[0].x + ' ' + points[0].y;
  for(let i=1;i<points.length;i++){
    const p0 = points[i-1], p1 = points[i];
    const mx = (p0.x+p1.x)/2;
    d += ' Q ' + mx + ' ' + p0.y + ', ' + mx + ' ' + ((p0.y+p1.y)/2) + ' T ' + p1.x + ' ' + p1.y;
  }
  return d;
}

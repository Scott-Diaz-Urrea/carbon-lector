let cachedVoices = [];
function loadVoices(){
  if('speechSynthesis' in window){
    cachedVoices = window.speechSynthesis.getVoices();
  }
}
if('speechSynthesis' in window){
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
function pickBestVoice(lang){
  const prefix = lang || 'es';
  const matches = cachedVoices.filter(v=>v.lang && v.lang.toLowerCase().indexOf(prefix)===0);
  if(!matches.length) return null;
  function score(v){
    let s=0;
    if(/google/i.test(v.name)) s+=5;
    if(/natural|neural|online|premium/i.test(v.name)) s+=4;
    if(prefix==='es' && /paulina|mónica|monica|helena|sabina|elvira|lucia|lupe|laura/i.test(v.name)) s+=3;
    if(v.localService===false) s+=1;
    return s;
  }
  return matches.slice().sort((a,b)=>score(b)-score(a))[0];
}
/* `lang` es opcional ('es' por defecto): Inglés de 5° básico es la primera
   asignatura con contenido en otro idioma, y leerlo con una voz en español
   sonaría con acento/pronunciación incorrecta — un problema real para un
   módulo que enseña pronunciación. Se pasa 'en' explícitamente desde esos
   generadores (ver content/ingles.js) para que busque una voz en inglés. */
export function speak(text, lang){
  try{
    if(!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const v = pickBestVoice(lang);
    if(v) utter.voice = v;
    utter.lang = (v && v.lang) || (lang==='en' ? 'en-US' : 'es-ES');
    utter.rate = 0.96;
    utter.pitch = 1.08;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }catch(e){ /* la app funciona igual sin voz */ }
}

/* ---------------- Sonidos (Web Audio, sin archivos externos) ---------------- */
let actx = null;
function getActx(){
  if(!actx){
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(Ctx) actx = new Ctx();
  }
  return actx;
}
function beep(freq, dur, delay, vol){
  try{
    const ctx = getActx();
    if(!ctx) return;
    const t0 = ctx.currentTime + (delay||0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol||0.15, t0+0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t0+dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0+dur+0.03);
  }catch(e){}
}
export function sfxCorrect(){ beep(523.25,0.12,0,0.14); beep(783.99,0.18,0.09,0.14); }
export function sfxWrong(){ beep(196,0.22,0,0.10); }
export function sfxStreak(){ beep(659.25,0.09,0,0.13); beep(783.99,0.09,0.08,0.13); beep(1046.5,0.16,0.16,0.13); }
export function sfxLevelup(){ beep(523.25,0.1,0,0.14); beep(659.25,0.1,0.09,0.14); beep(783.99,0.1,0.18,0.14); beep(1046.5,0.24,0.27,0.16); }

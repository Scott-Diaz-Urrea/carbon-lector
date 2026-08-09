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
   generadores (ver content/ingles.js) para que busque una voz en inglés.
   `rate` es opcional (0.96 por defecto, el mismo de siempre para toda la
   app): pedido explícito del usuario (2026-08-09) tras probar "Aprendo a
   Leer" — el audio de una sola letra o una sola sílaba ("eme", "ma") a
   0.96 (casi velocidad normal) pasa demasiado rápido para un niño que
   "no conoce las letras" todavía, sin ninguna otra palabra alrededor que
   dé contexto para recuperarse si no alcanzó a escucharlo bien. Los
   generadores de `content/aprendoALeer.js` pasan un `rate` más lento
   (0.65) vía `speakRate` en su ronda, reenviado por `mcEngine.js` al botón
   "Escuchar" — el resto de la app (~560 módulos) sigue en 0.96 sin ningún
   cambio de comportamiento. */
export function speak(text, lang, rate){
  try{
    if(!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const v = pickBestVoice(lang);
    if(v) utter.voice = v;
    utter.lang = (v && v.lang) || (lang==='en' ? 'en-US' : 'es-ES');
    utter.rate = rate || 0.96;
    utter.pitch = 1.08;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }catch(e){ /* la app funciona igual sin voz */ }
}

/* ---------------- Sonidos (Web Audio, sin archivos externos) ---------------- */
let actx = null;
function getActx(){
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return null;
  /* Bug real reportado por el usuario (2026-08-09), reaparecido incluso
     después del fix de resume() de más abajo: "sigue sin escuchar al
     perder o ganar, en todos lados". Causa raíz nueva: `actx` es un
     singleton de módulo que se crea UNA vez y se reutiliza para siempre —
     pero algunos navegadores (sobre todo Safari/iOS) cierran el
     AudioContext por su cuenta cuando la pestaña pasa mucho rato en
     segundo plano o inactiva, dejándolo en estado "closed". Un contexto
     "closed" no se puede resumir (resume() rechaza la promesa) y
     `createOscillator()` sobre él lanza una excepción síncrona — que el
     try/catch de beep() atrapaba en silencio, así que después de ese
     cierre NINGÚN sonido volvía a sonar en NINGÚN juego de la app hasta
     recargar la página. Ahora, si el contexto cacheado quedó "closed", se
     descarta y se crea uno nuevo en su lugar. */
  if(actx && actx.state === 'closed') actx = null;
  if(!actx) actx = new Ctx();
  return actx;
}
function beep(freq, dur, delay, vol){
  try{
    const ctx = getActx();
    if(!ctx) return;
    /* El AudioContext puede crearse en estado "suspended" en vez de
       "running" incluso al crearlo dentro de un gesto del usuario —
       Chrome/Safari mobile son más estrictos que desktop con esto, y sin un
       resume() explícito el navegador nunca emite audio real (sin ningún
       error, `createOscillator`/`start` funcionan igual, solo que en
       silencio). `resume()` es seguro de llamar siempre: si el contexto ya
       está "running" no hace nada. */
    if(ctx.state === 'suspended'){ ctx.resume(); }
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

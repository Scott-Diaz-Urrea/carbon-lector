/* Plataforma: instalación como app (Android/Chrome e iOS), almacenamiento persistente y recordatorio de respaldo. */
let deferred = null;
export function isIOS(){
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
export function isStandalone(){
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
}
export function initPlatform(onChange){
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred = e; if(onChange) onChange(); });
  window.addEventListener('appinstalled', function(){ deferred = null; if(onChange) onChange(); });
  if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
    window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
  }
}
export async function leoInstall(){
  if(!deferred) return;
  try{ deferred.prompt(); await deferred.userChoice; }catch(e){}
  deferred = null;
}
export function leoDismissTip(){ try{ localStorage.setItem('leo_ios_tip_off', '1'); }catch(e){} const t = document.getElementById('ios-tip'); if(t) t.remove(); }
/* Pide al navegador que NO borre los datos de LEO por falta de espacio o de uso (ayuda sobre todo en Android). */
export async function requestPersistence(){
  try{ if(navigator.storage && navigator.storage.persist) return await navigator.storage.persist(); }catch(e){}
  return false;
}
export function installHTML(){
  if(isStandalone()) return '';
  if(deferred) return '<button class="cta-btn secondary home-install" onclick="leoInstall()">📲 Instalar LEO como app</button>';
  let off = false; try{ off = localStorage.getItem('leo_ios_tip_off') === '1'; }catch(e){}
  if(isIOS() && !off){
    return '<div class="ios-tip" id="ios-tip">📲 <b>Instálala como app:</b> toca <b>Compartir</b> (el cuadrito con la flecha ⬆️) y luego <b>«Añadir a pantalla de inicio»</b>. Así abre sin internet y tu avance queda más seguro en iPhone y iPad.'+
      '<button class="ios-tip-ok" onclick="leoDismissTip()">Entendido</button></div>';
  }
  return '';
}

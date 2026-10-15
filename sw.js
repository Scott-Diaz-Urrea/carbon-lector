/* Service worker de LEO: permite instalarla como app y usarla sin internet.
   - Archivos propios: red primero (así las actualizaciones llegan solas) y, si no hay red, lo último guardado.
   - Three.js y tipografías (CDN): primero lo guardado (son versiones fijas), se guardan la primera vez.
   Para forzar que todos descarguen de nuevo, subir VERSION. */
const VERSION = 'leo-v1';
const CORE = ['./', 'index.html', 'styles.css', 'manifest.webmanifest', 'img/icons/icon-192.png', 'img/icons/icon-512.png'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){ return c.addAll(CORE); }).catch(function(){}).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const cdn = url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if(!same && !cdn) return;
  if(cdn){
    e.respondWith(caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        if(res && (res.ok || res.type === 'opaque')){ const cp = res.clone(); caches.open(VERSION).then(function(c){ c.put(req, cp); }); }
        return res;
      });
    }));
    return;
  }
  e.respondWith(fetch(req).then(function(res){
    if(res && res.ok){ const cp = res.clone(); caches.open(VERSION).then(function(c){ c.put(req, cp); }); }
    return res;
  }).catch(function(){
    return caches.match(req).then(function(hit){ return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});

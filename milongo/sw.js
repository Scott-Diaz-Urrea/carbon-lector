/* Service worker de Milongo: permite instalarla como app y usarla sin internet.
   Archivos propios: red primero (las actualizaciones llegan solas) y, sin red, lo último guardado.
   Para forzar una descarga nueva en todos los dispositivos, subir VERSION. */
const VERSION = 'milongo-v2';
const CORE = ['./', 'index.html', 'styles.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/main.js', 'js/util.js', 'js/data.js', 'js/store.js', 'js/ui.js', 'js/events.js', 'js/alerts.js',
  'js/hoy.js', 'js/salud.js', 'js/entrenar.js', 'js/historial.js', 'js/perfil.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).catch(function () {}).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { const cp = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});

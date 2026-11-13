/* Service worker: guarda o app para funcionar sem internet.
   Ao publicar uma nova versão, mude o número em VERSAO. */
var VERSAO='mapa-v1.0.0';
var ARQUIVOS=[
  './','./index.html','./app.css','./app.js','./manifest.webmanifest',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png','./icons/maskable-512.png',
  './icons/apple-touch-icon.png','./icons/favicon.svg','./icons/favicon-32.png',
  './fonts/fredoka-latin-500-normal.woff2','./fonts/fredoka-latin-600-normal.woff2','./fonts/fredoka-latin-700-normal.woff2',
  './fonts/nunito-latin-600-normal.woff2','./fonts/nunito-latin-700-normal.woff2','./fonts/nunito-latin-800-normal.woff2'
];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSAO).then(function(c){return c.addAll(ARQUIVOS)}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSAO}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('message',function(e){if(e.data==='skipWaiting')self.skipWaiting()});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url=new URL(req.url);
  if(url.origin!==self.location.origin)return; /* links externos (Bíblia) passam direto */
  if(req.mode==='navigate'){
    /* páginas: tenta a rede e cai no cache sem internet */
    e.respondWith(fetch(req).then(function(r){var cp=r.clone();caches.open(VERSAO).then(function(c){c.put('./index.html',cp)});return r}).catch(function(){return caches.match('./index.html')}));
    return;
  }
  /* arquivos: cache primeiro; atualiza o cache em segundo plano */
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(function(hit){
    var net=fetch(req).then(function(r){if(r&&r.ok){var cp=r.clone();caches.open(VERSAO).then(function(c){c.put(req,cp)})}return r}).catch(function(){return hit});
    return hit||net;
  }));
});

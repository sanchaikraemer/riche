/* Service worker — Richélen Flach: Orçamento & Agenda
   Estratégia:
   - documento (HTML): rede primeiro, cache como reserva. Assim a versão nova
     chega assim que ela abre o app com internet, e o app continua abrindo sem sinal.
   - demais arquivos do próprio site: cache primeiro, atualizando em segundo plano. */

var VERSAO = "riche-v35";
var ESSENCIAIS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icone-192.png",
  "./icons/icone-512.png",
  "./icons/icone-192-mascara.png",
  "./icons/icone-512-mascara.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function(evento){
  evento.waitUntil(
    caches.open(VERSAO).then(function(cache){
      return Promise.all(ESSENCIAIS.map(function(url){
        return cache.add(new Request(url, {cache:"reload"}))["catch"](function(){});
      }));
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(evento){
  evento.waitUntil(
    caches.keys().then(function(chaves){
      return Promise.all(chaves.map(function(chave){
        return chave === VERSAO ? null : caches["delete"](chave);
      }));
    }).then(function(){
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(evento){
  var req = evento.request;

  if(req.method !== "GET"){ return; }

  var url;
  try{
    url = new URL(req.url);
  }catch(e){
    return;
  }
  if(url.origin !== self.location.origin){ return; }

  var ehDocumento = req.mode === "navigate" ||
    (req.headers.get("accept") || "").indexOf("text/html") !== -1;

  if(ehDocumento){
    evento.respondWith(
      fetch(req).then(function(resposta){
        var copia = resposta.clone();
        caches.open(VERSAO).then(function(cache){ cache.put(req, copia); });
        return resposta;
      })["catch"](function(){
        return caches.match(req).then(function(guardado){
          return guardado || caches.match("./index.html");
        });
      })
    );
    return;
  }

  evento.respondWith(
    caches.match(req).then(function(guardado){
      var rede = fetch(req).then(function(resposta){
        if(resposta && resposta.status === 200 && resposta.type === "basic"){
          var copia = resposta.clone();
          caches.open(VERSAO).then(function(cache){ cache.put(req, copia); });
        }
        return resposta;
      })["catch"](function(){
        return guardado;
      });
      return guardado || rede;
    })
  );
});

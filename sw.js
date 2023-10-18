console.log("SERVICE WORKER");
const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;
//Todos aquellos recursos propios de la aplicacion
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/img/OIP.jpg',
  '/js/app.js',
  '/pages/offline.html'
];
// todos aqullos recursos que nunca cambian 
const APP_SHELL_INMUTABLE = [
  'https://cdn.tailwindcss.com'
];
self.addEventListener("install", function (event) {
  //event.skipwaiting();
  const staticcache = caches.open(STATIC).then(cache => {
    cache.addAll(APP_SHELL);
  });
  const inmutablecache = caches.open(INMUTABLE).then((cache) => {
    cache.addAll(APP_SHELL_INMUTABLE);
  });
  event.waitUntil(Promise.all([staticcache, inmutablecache]));
  console.log('Instalando');
});

self.addEventListener("activate", function (event) {
  console.log("Activate event");
});

// self.addEventListener("fetch", function (event) {
//   //cache and network race, se mandan las dos y la primera que se conteste va
//   // const src = new Promise((resolve, reject => {
//   //   let rejected = false;
//   //   const fallsOnce = () => {
//   //     if (rejected) {
//   //       if (/\.(png|jpg)/i.test(event.request.url)) {
//   //         resolve(caches.match('/img/R.jpg'))
//   //       } else {
//   //         throw Error("SourceNotFound")
//   //       }
//   //       if (e.request.url.includes('page2.html')){
//   //         resolve(caches.match('/pages/offline.html'))
//   //       }
//   //     } else {
//   //       rejected = true;
//   //     }
//   //   };
//   //   fetch(event.request)
//   //   .then(res => {
//   //     res.ok ? resolve(res) : fallsOnce();
//   //   })
//   //   .catch(fallsOnce);
//   //   caches.match(event.request)
//   //   .then(cachesRes => {
//   //     cachesRes.ok ? resolve(cachesRes) : fallsOnce();
//   //   })
//   //     .catch(fallsOnce);
//   // }));
//   // event.respondWith(src);
//   // //4 cache with network update
//   // //redimiento critico, se el rendimiento es bajo utilizar esta estrategia 
//   // //Toda nuestra aplicacion esta un paso atras
//   // if (event.request.url.includes('tailwind'))
//   //     return event.respondWith(caches.match(event.request)); 
//   // const src = caches.open(STATIC).then(cache =>{
//   //     fetch(event.request).then((res) =>{
//   //         cache.put(event.request,res);
//   //     });
//   //     return cache.match(event.request);
//   // });
//   // event.respondWith(src);
//   //3 network with cache fallback, siempre esta actualizada, unico problema si no hay internet, ahi usa el cache
//   // const src = fetch(event.request).then(res =>{
//   //     if(!res) throw Error('NotFound');
//   //     //checar si el recurso ya existe en algun cache
//   //     caches.open(DYNAMIC).then(cache=>{
//   //         cache.put(event.request, res);
//   //     });
//   //     return res.clone();
//   //     }).catch(()=> caches.match(/\.(html)/i.test(event.request.url) ? '/pages/offline.html' : event.request))

//   //      event.respondWith(src);
//   //2 cache with network fallback, si el recurso no es encontrado en el cache va a internet
//     // const src = caches.match(event.request).then((res)=>{
//     //   if(res) return res;
//     //   return fetch(event.request).then(resfetch =>{
//     //       caches.open(DYNAMIC).then(cache =>{
//     //           cache.put(event.request,resfetch);
//     //       });
//     //       return resfetch.clone();
//     //   });
//     // }); 
//     // event.respondWith(src);
//   //1 cache only
//  //event.responseWith(caches.match(event.request));    
// });

/* self.addEventListener("push", function (event) {
  console.log("Push event");
});

self.addEventListener("sync", function (event) {
  console.log("Sync event");
});
 */

self.addEventListener('fetch', (e) => {
  e.respondWith(
      fetch(e.request).catch(() => {
          return caches.match('/pages/offline.html');
      })
  );
});
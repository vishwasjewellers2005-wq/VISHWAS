const CACHE='vishwas-gold-v1'
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png']
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))
})
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))
})
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url)
  // only our own files — gold price / cloud-sync API calls go straight to the network
  if(e.request.method!=='GET' || u.origin!==location.origin) return
  e.respondWith(
    fetch(e.request).then(r=>{
      const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return r
    }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html')))
  )
})

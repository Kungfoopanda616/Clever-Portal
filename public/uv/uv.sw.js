if(!self.Ultraviolet)importScripts('uv.bundle.js','uv.config.js','uv.handler.js');
const sw=new Ultraviolet.ServiceWorker();
self.addEventListener('fetch',event=>{event.respondWith(sw.fetch(event));});

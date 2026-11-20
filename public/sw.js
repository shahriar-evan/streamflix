// Kill switch for an old service worker left on this localhost port by another project.
// The old worker checks /sw.js for updates; this one replaces it, clears its caches,
// unregisters itself and reloads open tabs so they get fresh files.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
      await self.registration.unregister()
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((c) => c.navigate(c.url))
    })(),
  )
})

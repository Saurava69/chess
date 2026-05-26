// This service worker unregisters itself.
// The previous version used cache-first and caused stale content bugs.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
    self.registration.unregister();
    self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => client.navigate(client.url));
    });
});

// Gran Bwa — service worker. Caches the shell so the app opens fast and
// can show a gentle offline message. Chat + plant images always go to network.
const CACHE = 'granbwa-v3';
const SHELL = ['/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // never cache the app page, AI calls, or live plant images — always fresh from network
  if (url.pathname === '/' || url.pathname.startsWith('/chat') || url.pathname.startsWith('/plant-image') || url.pathname.startsWith('/img') || url.pathname.startsWith('/greeting')) {
    return; // let it hit the network normally
  }
  // shell: cache-first, fall back to network
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).catch(() =>
      new Response('The forest sleeps offline. Reconnect to speak with Gran Bwa.', { headers: { 'Content-Type': 'text/plain' } })
    ))
  );
});

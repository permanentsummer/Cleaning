// SummerFlow Service Worker — Push Notifications
// Version: 1.0 — deploy this file as /sw.js at the ROOT of your GitHub repo

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// ── Receive push message from server ──────────────────────────────────────
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}

  var title = data.title || 'SummerFlow';
  var options = {
    body: data.body || '',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'summerflow-notif',
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || '/' }
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// ── Tap notification → open/focus app ─────────────────────────────────────
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var targetUrl = (e.notification.data && e.notification.data.url) || '/';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clients) {
        // If app is already open, focus it
        for (var i = 0; i < clients.length; i++) {
          if (clients[i].url.includes('summerflow') && 'focus' in clients[i]) {
            return clients[i].focus();
          }
        }
        // Otherwise open it
        if (self.clients.openWindow) {
          return self.clients.openWindow('https://summerflow.permanentsummer.co');
        }
      })
  );
});

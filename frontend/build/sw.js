const CACHE_NAME = 'poko-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: 실패 시 캐시, 캐시도 없으면 그대로 실패 전파
self.addEventListener('fetch', (event) => {
  // 브라우저 확장 / non-http 요청 무시
  if (!event.request.url.startsWith('http')) return;

  // API 요청은 캐시하지 않고 네트워크 직행
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // GET 응답만 캐시
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Web Push — B-3에서 구현 예정
self.addEventListener('push', (event) => {});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});

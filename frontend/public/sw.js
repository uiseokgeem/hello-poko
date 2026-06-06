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

// Network-first: 실패 시 캐시, 캐시도 없으면 네트워크 재시도
self.addEventListener('fetch', (event) => {
  // 브라우저 확장 / non-http 요청 무시
  if (!event.request.url.startsWith('http')) return;

  // 페이지 네비게이션은 브라우저에 위임 (iOS WebKit standalone 호환)
  if (event.request.mode === 'navigate') return;

  // API 요청은 캐시하지 않고 네트워크 직행
  if (event.request.url.includes('/api/')) return;

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
      .catch(() =>
        caches.match(event.request).then((cached) => cached || fetch(event.request))
      )
  );
});

// Web Push — B-3에서 구현 예정
self.addEventListener('push', (event) => {});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
});

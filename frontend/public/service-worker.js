const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/Team',
  '/MPR',
  '/AutoHelp',
  '/AllianceSelection',
  '/upload',
  // Add other assets you want to cache
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install Event');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache');
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(new Request(url, { cache: 'reload' }))
              .then(response => {
                if (response.status === 200) {
                  return cache.put(url, response);
                } else {
                  console.error(`[Service Worker] Failed to cache ${url}: ${response.statusText}`);
                }
              })
              .catch(error => {
                console.error(`[Service Worker] Failed to fetch ${url}:`, error);
              });
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetch Event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Cache hit for ', event.request.url);
          return response;
        }

        console.log('[Service Worker] Cache miss for ', event.request.url);
        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (fetchResponse) => {
            // Check if we received a valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              console.log('[Service Worker] Fetch response invalid for ', event.request.url);
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[Service Worker] Caching new data for ', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          }
        );
      })
  );
});
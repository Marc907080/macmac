// VICE CITY: STREET LIFE - Service Worker
// Enables offline play and PWA functionality

const CACHE_NAME = 'vice-city-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index-mobile.html',
  '/main.js',
  '/game/Game.js',
  '/game/Renderer.js',
  '/game/InputManager.js',
  '/game/World.js',
  '/game/Vehicle.js',
  '/game/CameraManager.js',
  '/game/UIManager.js',
  '/game/Settings.js',
  '/game/SaveSystem.js',
  '/manifest.json',
  '/launch.bat',
  '/package.json',
  '/README.md',
  '/styles.css',
  '/js/three.min.js'
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache assets:', error);
      })
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise, fetch from network
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('Service Worker: Fetch failed:', error);
        // Return a fallback response for failed requests
        return new Response('Network error - please check your connection', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Cache API responses
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
  }
});

console.log('Service Worker: Loaded');

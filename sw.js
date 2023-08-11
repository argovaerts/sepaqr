self.addEventListener('install', e => {
    e.waitUntil(
      // after the service worker is installed,
      // open a new cache
      caches.open('sepaqr-pwa-cache')
      .then(cache => {
        // add all URLs of resources we want to cache
        return cache.addAll([
          '/',
          '/index.html',
          '/instellen.html',
          '/index.js',
          '/instellen.js',
          '/grid.css',
          '/classes/IBAN.js',
          '/classes/SEPAQR.js',
          '/node_modules/davidshimjs-qrcodejs/qrcode.min.js',
          '/node_modules/mvp.css/mvp.css'
        ]);
      })
    );
   });
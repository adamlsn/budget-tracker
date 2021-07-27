const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "./icons/icon-72x72.png", 
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-192x192.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png"    
];

const APP_PREFIX = "Budget-";
const VERSION = "version_1";
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("Installing Chache: " + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", function(event){
    event.waitUntil(
        caches.keys().then(function(keys){
            let cacheKeepList = keys.filter(function(key){
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(
                keys.map(function(key, i){
                    if(cacheKeepList.indexOf(key) === -1){
                        console.log("Deleting Cache: " + keys[i]);
                        return caches.delete(keys[i]);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", function(event){
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match("./index.html");
            })
    )
});
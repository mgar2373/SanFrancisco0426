// Service Worker — Mobilitat SF 25-26
const CACHE_NAME = "sf-mobility-v1";

// Recursos que es guardaran offline (la shell de l'app)
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Instal·lació: guarda els recursos estàtics a la caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activació: elimina caches anteriors
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network First per a peticions de dades, Cache First per a estàtics
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora peticions a Supabase (sempre han d'anar a la xarxa)
  if (url.hostname.includes("supabase.co")) return;

  // Per a navegació (pàgines HTML): Network First amb fallback a caché
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match("/"))
    );
    return;
  }

  // Per a recursos estàtics: Cache First
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Notificació push (preparada per a futures funcionalitats)
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || "Mobilitat SF", {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
  });
});

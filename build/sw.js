// Service Worker for Push Notifications
self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || data.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: data.tag || 'ev-co-ownership',
            requireInteraction: data.requireInteraction || false,
            actions: data.actions || []
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'EV Co-ownership', options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action) {
        // Handle action button clicks
        console.log('Action clicked:', event.action);
    } else {
        // Handle notification click
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed:', event.notification.tag);
});
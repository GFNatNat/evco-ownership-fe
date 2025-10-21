import notificationApi from '../api/notificationApi';

class PushNotificationService {
    constructor() {
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
        this.registration = null;
        this.subscription = null;
    }

    async init() {
        if (!this.isSupported) {
            console.warn('Push notifications are not supported');
            return false;
        }

        try {
            // Register service worker
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully');
            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    }

    async requestPermission() {
        if (!this.isSupported) return false;

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    async subscribe() {
        if (!this.registration) {
            await this.init();
        }

        if (!this.registration) return false;

        try {
            // For demo purposes, using a dummy VAPID key
            // In production, you should get this from your backend
            const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';

            this.subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
            });

            // Send subscription to backend
            await notificationApi.subscribePush({
                endpoint: this.subscription.endpoint,
                keys: {
                    p256dh: this.arrayBufferToBase64(this.subscription.getKey('p256dh')),
                    auth: this.arrayBufferToBase64(this.subscription.getKey('auth'))
                }
            });

            return true;
        } catch (error) {
            console.error('Push subscription failed:', error);
            return false;
        }
    }

    async unsubscribe() {
        if (!this.subscription) return true;

        try {
            await this.subscription.unsubscribe();
            await notificationApi.unsubscribePush();
            this.subscription = null;
            return true;
        } catch (error) {
            console.error('Push unsubscription failed:', error);
            return false;
        }
    }

    async getSubscriptionStatus() {
        if (!this.registration) return false;

        try {
            this.subscription = await this.registration.pushManager.getSubscription();
            return !!this.subscription;
        } catch (error) {
            console.error('Failed to get subscription status:', error);
            return false;
        }
    }

    // Show local notification (fallback)
    showLocalNotification(title, options = {}) {
        if (!this.isSupported) return;

        if (Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    }

    // Utility functions
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}

export default new PushNotificationService();
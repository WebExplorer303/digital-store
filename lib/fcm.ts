// lib/fcm.ts
import { getMessaging, getToken } from 'firebase/messaging'; 
import { app } from './firebase'; 

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied.');
      return null;
    }

    const messaging = getMessaging(app);

    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY_HERE',
    });

    return fcmToken;
  } catch (error) {
    console.error('❌ Error getting FCM Device Token:', error);
    return null;
  }
}
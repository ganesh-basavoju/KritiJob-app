// ============================================
// FCM SERVICE
// ============================================

import messaging from '@react-native-firebase/messaging';
import {storageService} from './storage.service';
import {permissionsService} from './permissions.service';

export const fcmService = {
  async requestPermission(): Promise<boolean> {
    const permissionGranted = await permissionsService.requestNotificationPermission();
    if (!permissionGranted) {
      return false;
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  },

  async getToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        return null;
      }

      const token = await messaging().getToken();
      if (token) {
        await storageService.saveFCMToken(token);
      }
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  async deleteToken(): Promise<void> {
    try {
      await messaging().deleteToken();
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  },

  onTokenRefresh(callback: (token: string) => void) {
    return messaging().onTokenRefresh(callback);
  },

  onMessage(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  },

  onNotificationOpenedApp(callback: (message: any) => void) {
    return messaging().onNotificationOpenedApp(callback);
  },

  async getInitialNotification(): Promise<any | null> {
    return await messaging().getInitialNotification();
  },

  setBackgroundMessageHandler(handler: (message: any) => Promise<void>) {
    messaging().setBackgroundMessageHandler(handler);
  },
};

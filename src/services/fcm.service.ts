// ============================================
// FCM SERVICE (Modular API)
// ============================================

import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {storageService} from './storage.service';
import {permissionsService} from './permissions.service';
import {notificationsApi} from '../api/notifications.api';

export const fcmService = {
  async requestPermission(): Promise<boolean> {
    const permissionGranted =
      await permissionsService.requestNotificationPermission();
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

  async registerTokenWithBackend(): Promise<void> {
    try {
      const token = await this.getToken();
      if (!token) {
        console.warn('No FCM token available to register');
        return;
      }

      const platform = Platform.OS as 'android' | 'ios';
      await notificationsApi.registerToken(token, platform);
      console.log('FCM token registered with backend successfully');
    } catch (error) {
      console.error('Error registering FCM token with backend:', error);
    }
  },

  async deleteToken(): Promise<void> {
    try {
      const token = await storageService.getFCMToken();
      if (token) {
        // Unregister from backend first
        await notificationsApi.unregisterToken(token).catch(err => {
          console.error('Error unregistering token from backend:', err);
        });
      }
      
      // Delete from Firebase
      await messaging().deleteToken();
      await storageService.removeFCMToken();
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  },

  onTokenRefresh(callback: (token: string) => void) {
    return messaging().onTokenRefresh(async token => {
      console.log('FCM token refreshed:', token);
      await storageService.saveFCMToken(token);
      
      // Register new token with backend
      try {
        const platform = Platform.OS as 'android' | 'ios';
        await notificationsApi.registerToken(token, platform);
        console.log('Refreshed FCM token registered with backend');
      } catch (error) {
        console.error('Error registering refreshed token:', error);
      }
      
      callback(token);
    });
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
};

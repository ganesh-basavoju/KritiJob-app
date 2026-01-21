// ============================================
// PERMISSIONS SERVICE
// ============================================

import {PermissionsAndroid, Platform} from 'react-native';

export const permissionsService = {
  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }
    return true;
  },

  async checkNotificationPermission(): Promise<boolean> {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result;
    }
    return true;
  },
};

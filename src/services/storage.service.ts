// ============================================
// STORAGE SERVICE
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: '@kritijob_access_token',
  REFRESH_TOKEN: '@kritijob_refresh_token',
  USER: '@kritijob_user',
  FCM_TOKEN: '@kritijob_fcm_token',
  ONBOARDING_COMPLETE: '@kritijob_onboarding_complete',
};

export const storageService = {
  // Tokens
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN, accessToken],
      [KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  async removeTokens(): Promise<void> {
    await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN]);
  },

  // User
  async saveUser(user: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  // FCM Token
  async saveFCMToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.FCM_TOKEN, token);
  },

  async getFCMToken(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.FCM_TOKEN);
  },

  // Onboarding
  async setOnboardingComplete(): Promise<void> {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
  },

  async isOnboardingComplete(): Promise<boolean> {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  },

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};

// ============================================
// APP NAVIGATOR
// ============================================

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {loadUser, updateFCMToken} from '../redux/slices/authSlice';
import {addNotification} from '../redux/slices/notificationsSlice';
import {AppDispatch, RootState} from '../redux/store';
import {AuthNavigator} from './AuthNavigator';
import {UserNavigator} from './UserNavigator';
import {EmployerNavigator} from './EmployerNavigator';
import {Loader} from '../components/common/Loader';
import {fcmService} from '../services/fcm.service';

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated, user, loading} = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setupFCM();
      setupNotificationListeners();
    }
  }, [isAuthenticated]);

  const initializeApp = async () => {
    await dispatch(loadUser());
  };

  const setupFCM = async () => {
    try {
      const token = await fcmService.getToken();
      if (token) {
        await dispatch(updateFCMToken(token));
      }

      fcmService.onTokenRefresh(async newToken => {
        await dispatch(updateFCMToken(newToken));
      });
    } catch (error) {
      console.error('FCM Setup Error:', error);
    }
  };

  const setupNotificationListeners = () => {
    fcmService.onMessage(remoteMessage => {
      if (remoteMessage.notification) {
        dispatch(
          addNotification({
            id: Date.now().toString(),
            userId: user?.id || '',
            title: remoteMessage.notification.title || '',
            body: remoteMessage.notification.body || '',
            type: remoteMessage.data?.type || 'general',
            data: remoteMessage.data,
            read: false,
            createdAt: new Date().toISOString(),
          }),
        );
      }
    });

    fcmService.onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
    });

    fcmService.getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App opened from notification:', remoteMessage);
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'employer' ? (
        <EmployerNavigator />
      ) : (
        <UserNavigator />
      )}
    </NavigationContainer>
  );
};

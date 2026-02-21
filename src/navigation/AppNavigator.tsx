// ============================================
// APP NAVIGATOR
// ============================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { loadUser } from '../redux/slices/authSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { AppDispatch, RootState } from '../redux/store';
import { AuthNavigator } from './AuthNavigator';
import { UserNavigator } from './UserNavigator';
import { EmployerNavigator } from './EmployerNavigator';
import { Loader } from '../components/common/Loader';
import { fcmService } from '../services/fcm.service';

const RootStack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigationRef = React.useRef<any>(null);
  const { isAuthenticated, user, loading } = useSelector(
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
      await fcmService.registerTokenWithBackend();
      fcmService.onTokenRefresh(async () => {
        await fcmService.registerTokenWithBackend();
      });
    } catch (error) {
      console.error('FCM Setup Error:', error);
    }
  };

  const handleNotificationNavigation = (screen: string, data: any) => {
    if (!navigationRef.current) return;
    try {
      switch (screen) {
        case 'JobDetails':
          navigationRef.current.navigate('JobDetails', { jobId: data.jobId });
          break;
        case 'ApplicationDetails':
          navigationRef.current.navigate('ApplicationDetails', { applicationId: data.applicationId });
          break;
        case 'ApplicantDetails':
          navigationRef.current.navigate('ApplicantDetails', { applicationId: data.applicationId, jobId: data.jobId });
          break;
        case 'MyApplications':
          navigationRef.current.navigate('MyApplications');
          break;
        case 'JobFeed':
          navigationRef.current.navigate('JobFeed');
          break;
        case 'EmployerApplications':
          navigationRef.current.navigate('EmployerApplications', { jobId: data.jobId });
          break;
        default:
          console.log('Unknown notification screen:', screen);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const setupNotificationListeners = () => {
    fcmService.onMessage(remoteMessage => {
      if (remoteMessage.notification) {
        dispatch(
          addNotification({
            id: remoteMessage.data?.notificationId || Date.now().toString(),
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
      if (remoteMessage.data?.screen) {
        handleNotificationNavigation(remoteMessage.data.screen, remoteMessage.data);
      }
    });

    fcmService.getInitialNotification().then(remoteMessage => {
      if (remoteMessage && remoteMessage.data?.screen) {
        setTimeout(() => {
          handleNotificationNavigation(remoteMessage.data.screen, remoteMessage.data);
        }, 1000);
      }
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated && user?.role === 'employer' ? (
          <RootStack.Screen name="EmployerMain" component={EmployerNavigator} />
        ) : (
          <RootStack.Screen name="UserMain" component={UserNavigator} />
        )}

        {/* Auth Screens accessible from anywhere */}
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};


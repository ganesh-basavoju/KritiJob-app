/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

// Background message handler for FCM (must use default export)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  // Notification is automatically displayed by Firebase
  // This handler is for additional processing if needed
});

AppRegistry.registerComponent(appName, () => App);
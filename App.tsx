/**
 * KritiJob - Job Portal Mobile Application
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {AppNavigator} from './src/navigation/AppNavigator';
import {colors} from './src/theme/colors';

function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </Provider>
  );
}

export default App;

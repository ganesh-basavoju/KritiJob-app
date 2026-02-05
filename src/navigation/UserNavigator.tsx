// ============================================
// USER NAVIGATOR
// ============================================

import React, {useEffect} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootState, AppDispatch} from '../redux/store';
import {fetchUnreadCount} from '../redux/slices/notificationsSlice';
import {JobFeedScreen} from '../screens/user/JobFeedScreen';
import {JobDetailsScreen} from '../screens/user/JobDetailsScreen';
import {SavedJobsScreen} from '../screens/user/SavedJobsScreen';
import {ApplicationsScreen} from '../screens/user/ApplicationsScreen';
import {ApplicationDetailsScreen} from '../screens/user/ApplicationDetailsScreen';
import {UserProfileScreen} from '../screens/user/UserProfileScreen';
import {CompaniesListScreen} from '../screens/companies/CompaniesListScreen';
import {CompanyDetailsScreen} from '../screens/companies/CompanyDetailsScreen';
import {NotificationsScreen} from '../screens/notifications/NotificationsScreen';
// import {SettingsScreen} from '../screens/settings/SettingsScreen';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const JobsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="JobFeed"
      component={JobFeedScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="JobDetails"
      component={JobDetailsScreen}
      options={{title: 'Job Details'}}
    />
  </Stack.Navigator>
);

const SavedStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="SavedJobsList"
      component={SavedJobsScreen}
      options={{title: 'Saved Jobs'}}
    />
    <Stack.Screen
      name="JobDetails"
      component={JobDetailsScreen}
      options={{title: 'Job Details'}}
    />
  </Stack.Navigator>
);

const ApplicationsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="ApplicationsList"
      component={ApplicationsScreen}
      options={{title: 'My Applications'}}
    />
    <Stack.Screen
      name="ApplicationDetails"
      component={ApplicationDetailsScreen}
      options={{title: 'Application Details'}}
    />
    <Stack.Screen
      name="JobDetails"
      component={JobDetailsScreen}
      options={{title: 'Job Details'}}
    />
    <Stack.Screen
      name="CompanyDetails"
      component={CompanyDetailsScreen}
      options={{title: 'Company Details'}}
    />
  </Stack.Navigator>
);

const CompaniesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="CompaniesList"
      component={CompaniesListScreen}
      options={{title: 'Companies'}}
    />
    <Stack.Screen
      name="CompanyDetails"
      component={CompanyDetailsScreen}
      options={{title: 'Company Details'}}
    />
  </Stack.Navigator>
);

const NotificationsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="NotificationsList"
      component={NotificationsScreen}
      options={{title: 'Notifications'}}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{title: 'Profile'}}
    />
  </Stack.Navigator>
);

export const UserNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {unreadCount} = useSelector((state: RootState) => state.notifications);

  console.log('🔴 UserNavigator unreadCount:', unreadCount);

  useEffect(() => {
    // Fetch unread count when navigator mounts
    console.log('🔴 UserNavigator mounting, fetching unread count');
    dispatch(fetchUnreadCount());

    // Also fetch when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('🔴 App came to foreground, fetching unread count');
        dispatch(fetchUnreadCount());
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.yellow,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Jobs"
        component={JobsStack}
        options={{
          tabBarLabel: 'Jobs',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsStack}
        options={{
          tabBarLabel: 'Applications',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'document-text' : 'document-text-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({color, focused}) => (
            <View style={styles.iconContainer}>
              <Icon
                name={focused ? 'notifications' : 'notifications-outline'}
                size={24}
                color={color}
              />
              {unreadCount > 0 && <View style={styles.badge} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Companies"
        component={CompaniesStack}
        options={{
          tabBarLabel: 'Companies',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'business' : 'business-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
});

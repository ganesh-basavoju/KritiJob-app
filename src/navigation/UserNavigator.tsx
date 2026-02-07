 

import React, {useEffect} from 'react';
import {StyleSheet, AppState} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootState, AppDispatch} from '../redux/store';
import {fetchUnreadCount} from '../redux/slices/notificationsSlice';
import {View, TouchableOpacity} from 'react-native';


// Screens
import {HomeScreen} from '../screens/home/HomeScreen';
import {JobFeedScreen} from '../screens/user/JobFeedScreen';
import {JobDetailsScreen} from '../screens/user/JobDetailsScreen';
import {SavedJobsScreen} from '../screens/user/SavedJobsScreen';
import {ApplicationsScreen} from '../screens/user/ApplicationsScreen';
import {ApplicationDetailsScreen} from '../screens/user/ApplicationDetailsScreen';
import {UserProfileScreen} from '../screens/user/UserProfileScreen';
import {CompaniesListScreen} from '../screens/companies/CompaniesListScreen';
import {CompanyDetailsScreen} from '../screens/companies/CompanyDetailsScreen';

import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* =========================
   HOME STACK
========================= */
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        title: 'Home',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon
              name="notifications-outline"
              size={22}
              color={colors.yellow}
            />
          </TouchableOpacity>
        ),
      })}
    />

    {/* ✅ ADD THIS */}
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{ title: 'Notifications' }}
    />
  </Stack.Navigator>
);



/* =========================
   JOBS STACK
========================= */
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

/* =========================
   SAVED STACK
========================= */
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

/* =========================
   APPLICATIONS STACK
========================= */
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

/* =========================
   COMPANIES STACK
========================= */
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

/* =========================
   PROFILE STACK
========================= */
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}
  >
    <Stack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{ title: 'Profile' }}
    />

    {/* ✅ Saved Jobs */}
    <Stack.Screen
      name="SavedJobsList"
      component={SavedJobsScreen}
      options={{ title: 'Saved Jobs' }}
    />

    {/* ✅ Applications */}
    <Stack.Screen
      name="ApplicationsList"
      component={ApplicationsScreen}
      options={{ title: 'My Applications' }}
    />

    <Stack.Screen
      name="ApplicationDetails"
      component={ApplicationDetailsScreen}
      options={{ title: 'Application Details' }}
    />

    <Stack.Screen
      name="JobDetails"
      component={JobDetailsScreen}
      options={{ title: 'Job Details' }}
    />
  </Stack.Navigator>
);


/* =========================
   USER NAVIGATOR
========================= */
export const UserNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {unreadCount} = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchUnreadCount());

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        dispatch(fetchUnreadCount());
      }
    });

    return () => subscription.remove();
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

      {/* 🏠 HOME TAB */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* 💼 JOBS TAB */}
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

      {/* 🔖 SAVED TAB */}
      {/* <Tab.Screen
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
      /> */}

      {/* 📄 APPLICATIONS TAB */}
      {/* <Tab.Screen
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
      /> */}

      {/* 🏢 COMPANIES TAB */}
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

      {/* 👤 PROFILE TAB */}
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
  notificationWrapper: {
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.yellow,
  },
});

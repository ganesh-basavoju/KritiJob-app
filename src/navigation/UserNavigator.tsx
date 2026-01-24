// ============================================
// USER NAVIGATOR
// ============================================

import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {JobFeedScreen} from '../screens/user/JobFeedScreen';
import {JobDetailsScreen} from '../screens/user/JobDetailsScreen';
import {SavedJobsScreen} from '../screens/user/SavedJobsScreen';
import {ApplicationsScreen} from '../screens/user/ApplicationsScreen';
import {UserProfileScreen} from '../screens/user/UserProfileScreen';
import {CompaniesListScreen} from '../screens/companies/CompaniesListScreen';
import {CompanyDetailsScreen} from '../screens/companies/CompanyDetailsScreen';
import {NotificationsScreen} from '../screens/notifications/NotificationsScreen';
// import {SettingsScreen} from '../screens/settings/SettingsScreen';
import {colors} from '../theme/colors';
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
      name="JobDetails"
      component={JobDetailsScreen}
      options={{title: 'Job Details'}}
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
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{title: 'Notifications'}}
    />
  </Stack.Navigator>
);

export const UserNavigator: React.FC = () => {
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
              name={focused ? 'heart' : 'heart-outline'}
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

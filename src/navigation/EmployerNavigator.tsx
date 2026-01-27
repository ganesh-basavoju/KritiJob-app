// ============================================
// EMPLOYER NAVIGATOR
// ============================================

import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import {EmployerDashboardScreen} from '../screens/employer/EmployerDashboardScreen';
import {PostJobScreen} from '../screens/employer/PostJobScreen';
import {ManageJobsScreen} from '../screens/employer/ManageJobsScreen';
import {ApplicantsScreen} from '../screens/employer/ApplicantsScreen';
import {ApplicantDetailsScreen} from '../screens/employer/ApplicantDetailsScreen';
import {NotificationsScreen} from '../screens/notifications/NotificationsScreen';
import {MoreScreen} from '../screens/employer/MoreScreen';
import {EmployerProfileScreen} from '../screens/employer/EmployerProfileScreen';

// NEW IMPORTS
import {ViewApplicantsScreen} from '../screens/employer/ViewApplicantsScreen';
import {JobApplicantsListScreen} from '../screens/employer/JobApplicantsListScreen';

import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Dashboard Stack
const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="EmployerDashboard"
      component={EmployerDashboardScreen}
      options={{headerShown: false}}
    />
    
    {/* NEW SCREENS ADDED HERE */}
    <Stack.Screen
      name="ViewApplicants"
      component={ViewApplicantsScreen}
      options={{title: 'Select a Job'}}
    />
    <Stack.Screen
      name="JobApplicantsList"
      component={JobApplicantsListScreen}
      options={{title: 'Applicants'}}
    />
    {/* END NEW SCREENS */}

    <Stack.Screen
      name="PostJob"
      component={PostJobScreen}
      options={{title: 'Post New Job'}}
    />
    <Stack.Screen
      name="Applicants"
      component={ApplicantsScreen}
      options={{title: 'Applicants'}}
    />
    <Stack.Screen
      name="ApplicantDetails"
      component={ApplicantDetailsScreen}
      options={{title: 'Applicant Details'}}
    />
  </Stack.Navigator>
);

// 2. Jobs Stack
const JobsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="ManageJobsList"
      component={ManageJobsScreen}
      options={{title: 'My Jobs', headerShown: true}}
    />
    <Stack.Screen
      name="PostJob"
      component={PostJobScreen}
      options={({route}) => ({ 
        title: route.params?.jobId ? 'Edit Job' : 'Post New Job' 
      })}
    />
    <Stack.Screen
      name="Applicants"
      component={ApplicantsScreen}
      options={{title: 'Applicants'}}
    />
    <Stack.Screen
      name="ApplicantDetails"
      component={ApplicantDetailsScreen}
      options={{title: 'Applicant Details'}}
    />
  </Stack.Navigator>
);

// 3. Profile Stack (NEW - dedicated for Profile)
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="EmployerProfileMain"
      component={EmployerProfileScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

// 4. More Stack (Renamed from ProfileStack - handles Notifications, Help, etc.)
const MoreStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: colors.background},
      headerTintColor: colors.textPrimary,
      headerTitleStyle: typography.h5,
    }}>
    <Stack.Screen
      name="MoreScreen"
      component={MoreScreen}
      options={{title: 'More'}}
    />
    <Stack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{title: 'Notifications'}}
    />
    {/* Kept EmployerProfile here just in case deep links navigate from More, 
        but usually accessed via the Profile Tab now */}
    <Stack.Screen
      name="EmployerProfile"
      component={EmployerProfileScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export const EmployerNavigator: React.FC = () => {
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
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ManageJobs"
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
      {/* NEW TAB FOR PROFILE */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
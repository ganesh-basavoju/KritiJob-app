// // ============================================
// // EMPLOYER NAVIGATOR
// // ============================================

// import React from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {EmployerDashboardScreen} from '../screens/employer/EmployerDashboardScreen';
// import {PostJobScreen} from '../screens/employer/PostJobScreen';
// import {ManageJobsScreen} from '../screens/employer/ManageJobsScreen';
// import {ApplicantsScreen} from '../screens/employer/ApplicantsScreen';
// import {ApplicantDetailsScreen} from '../screens/employer/ApplicantDetailsScreen';
// import {NotificationsScreen} from '../screens/notifications/NotificationsScreen';
// import {MoreScreen} from '../screens/employer/MoreScreen';
// import {colors} from '../theme/colors';
// import {typography} from '../theme/typography';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// const DashboardStack = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerStyle: {backgroundColor: colors.background},
//       headerTintColor: colors.textPrimary,
//       headerTitleStyle: typography.h5,
//     }}>
//     <Stack.Screen
//       name="EmployerDashboard"
//       component={EmployerDashboardScreen}
//       options={{headerShown: false}}
//     />
//     <Stack.Screen
//       name="PostJob"
//       component={PostJobScreen}
//       options={{title: 'Post New Job'}}
//     />
//     <Stack.Screen
//       name="Applicants"
//       component={ApplicantsScreen}
//       options={{title: 'Applicants'}}
//     />
//     <Stack.Screen
//       name="ApplicantDetails"
//       component={ApplicantDetailsScreen}
//       options={{title: 'Applicant Details'}}
//     />
//   </Stack.Navigator>
// );

// const JobsStack = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerStyle: {backgroundColor: colors.background},
//       headerTintColor: colors.textPrimary,
//       headerTitleStyle: typography.h5,
//     }}>
//     <Stack.Screen
//       name="ManageJobsList"
//       component={ManageJobsScreen}
//       options={{title: 'My Jobs'}}
//     />
//     <Stack.Screen
//       name="Applicants"
//       component={ApplicantsScreen}
//       options={{title: 'Applicants'}}
//     />
//     <Stack.Screen
//       name="ApplicantDetails"
//       component={ApplicantDetailsScreen}
//       options={{title: 'Applicant Details'}}
//     />
//   </Stack.Navigator>
// );

// const ProfileStack = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerStyle: {backgroundColor: colors.background},
//       headerTintColor: colors.textPrimary,
//       headerTitleStyle: typography.h5,
//     }}>
//     <Stack.Screen
//       name="MoreScreen"
//       component={MoreScreen}
//       options={{title: 'More'}}
//     />
//     <Stack.Screen
//       name="Notifications"
//       component={NotificationsScreen}
//       options={{title: 'Notifications'}}
//     />
//   </Stack.Navigator>
// );

// export const EmployerNavigator: React.FC = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: colors.backgroundSecondary,
//           borderTopColor: colors.border,
//         },
//         tabBarActiveTintColor: colors.yellow,
//         tabBarInactiveTintColor: colors.textSecondary,
//         headerShown: false,
//       }}>
//       <Tab.Screen
//         name="Dashboard"
//         component={DashboardStack}
//         options={{
//           tabBarLabel: 'Dashboard',
//           tabBarIcon: ({color, focused}) => (
//             <Icon
//               name={focused ? 'stats-chart' : 'stats-chart-outline'}
//               size={24}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="ManageJobs"
//         component={JobsStack}
//         options={{
//           tabBarLabel: 'Jobs',
//           tabBarIcon: ({color, focused}) => (
//             <Icon
//               name={focused ? 'briefcase' : 'briefcase-outline'}
//               size={24}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="More"
//         component={ProfileStack}
//         options={{
//           tabBarLabel: 'More',
//           tabBarIcon: ({color, focused}) => (
//             <Icon
//               name={focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline'}
//               size={24}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };


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

// ADDED IMPORT
import {EmployerProfileScreen} from '../screens/employer/EmployerProfileScreen';

import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
      options={{title: 'My Jobs'}}
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

const ProfileStack = () => (
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
    {/* ADDED SCREEN */}
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
      <Tab.Screen
        name="More"
        component={ProfileStack}
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
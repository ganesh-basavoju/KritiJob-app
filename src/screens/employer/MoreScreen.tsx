// // ============================================
// // MORE SCREEN (EMPLOYER)
// // ============================================

// import React, {useState, useEffect} from 'react';
// import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {useDispatch, useSelector} from 'react-redux';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {logout} from '../../redux/slices/authSlice';
// import {AppDispatch, RootState} from '../../redux/store';
// import {colors} from '../../theme/colors';
// import {spacing, borderRadius} from '../../theme/spacing';
// import {typography} from '../../theme/typography';
// import {API_BASE_URL} from '../../utils/constants';
// import {storageService} from '../../services/storage.service';

// export const MoreScreen: React.FC<any> = ({navigation}) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {user} = useSelector((state: RootState) => state.auth);
  
//   // State to store company data
//   const [company, setCompany] = useState<any>(null);

//   useEffect(() => {
//     const fetchCompanyData = async () => {
//       try {
//         const token = await storageService.getAccessToken();
//         if (!token) return;

//         const response = await fetch(`${API_BASE_URL}/company/me`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const json = await response.json();
//           if (json.success && json.data) {
//             setCompany(json.data);
//           }
//         }
//       } catch (error) {
//         console.log('Error fetching company:', error);
//       }
//     };

//     fetchCompanyData();
//   }, []);

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             await dispatch(logout());
//           },
//         },
//       ],
//       {cancelable: true},
//     );
//   };

//   const menuItems = [
//     {
//       id: 'notifications',
//       title: 'Notifications',
//       icon: 'notifications-outline',
//       onPress: () => navigation.navigate('Notifications'),
//     },
//     {
//       id: 'help',
//       title: 'Help & Support',
//       icon: 'help-circle-outline',
//       onPress: () => {
//         Alert.alert('Coming Soon', 'Help & support will be available soon');
//       },
//     },
//     {
//       id: 'about',
//       title: 'About',
//       icon: 'information-circle-outline',
//       onPress: () => {
//         Alert.alert('About', 'Kriti Job App v1.0.0');
//       },
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* User Info Section */}
//         <View style={styles.userSection}>
//           <View style={styles.avatarContainer}>
//             <Icon name="person-circle" size={60} color={colors.yellow} />
//           </View>
//           <Text style={styles.userName}>{user?.name || 'Employer'}</Text>
//           <Text style={styles.userEmail}>{user?.email}</Text>
          
//           {/* Logic: Display Name if exists, else show Warning Message */}
//           {company && company.name ? (
//             <Text style={styles.companyName}>{company.name}</Text>
//           ) : (
//             <TouchableOpacity
//               onPress={() => navigation.navigate('ProfileTab', { screen: 'EmployerProfileMain' })}
//               activeOpacity={0.7}
//               style={styles.warningContainer}>
//               <Icon name="warning" size={16} color={colors.warning} style={{marginRight: 4}} />
//               <Text style={styles.warningText}>Create your company profile first</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuSection}>
//           {menuItems.map(item => (
//             <TouchableOpacity
//               key={item.id}
//               style={styles.menuItem}
//               onPress={item.onPress}>
//               <View style={styles.menuItemLeft}>
//                 <Icon name={item.icon} size={24} color={colors.textPrimary} />
//                 <Text style={styles.menuItemText}>{item.title}</Text>
//               </View>
//               <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Icon name="log-out-outline" size={24} color={colors.error} />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   content: {
//     flexGrow: 1,
//     padding: spacing.md,
//   },
//   userSection: {
//     alignItems: 'center',
//     padding: spacing.lg,
//     backgroundColor: colors.card,
//     borderRadius: borderRadius.md,
//     marginBottom: spacing.lg,
//   },
//   avatarContainer: {
//     marginBottom: spacing.sm,
//   },
//   userName: {
//     ...typography.h4,
//     color: colors.textPrimary,
//     marginBottom: spacing.xs,
//   },
//   userEmail: {
//     ...typography.body2,
//     color: colors.textSecondary,
//   },
//   companyName: {
//     ...typography.body2,
//     color: colors.textPrimary,
//     marginTop: spacing.xs,
//     fontWeight: '600',
//   },
//   warningContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: spacing.sm,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },
//   warningText: {
//     ...typography.body2,
//     color: colors.warning,
//     fontWeight: '600',
//   },
//   menuSection: {
//     backgroundColor: colors.card,
//     borderRadius: borderRadius.md,
//     marginBottom: spacing.lg,
//     overflow: 'hidden',
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.md,
//   },
//   menuItemText: {
//     ...typography.body1,
//     color: colors.textPrimary,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: spacing.md,
//     backgroundColor: colors.card,
//     borderRadius: borderRadius.md,
//     borderWidth: 1,
//     borderColor: colors.error,
//     gap: spacing.sm,
//   },
//   logoutText: {
//     ...typography.button,
//     color: colors.error,
//   },
// });
// ============================================
// MORE SCREEN (EMPLOYER) - UPDATED
// ============================================

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {logout} from '../../redux/slices/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';

export const MoreScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.auth);
  const {unreadCount} = useSelector((state: RootState) => state.notifications);
  
  // State to store company data
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = await storageService.getAccessToken();
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/company/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            setCompany(json.data);
          }
        }
      } catch (error) {
        console.log('Error fetching company:', error);
      }
    };

    fetchCompanyData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
          },
        },
      ],
      {cancelable: true},
    );
  };

  const menuItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => navigation.navigate('Notifications'),
    },
    
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: () => {
        Alert.alert('About', 'Kriti Job App v1.0.0');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Icon name="person-circle" size={60} color={colors.yellow} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Employer'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          {/* Logic: Display Name if exists, else show Warning Message */}
          {company && company.name ? (
            <Text style={styles.companyName}>{company.name}</Text>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileTab', { screen: 'EmployerProfileMain' })}
              activeOpacity={0.7}
              style={styles.warningContainer}>
              <Icon name="warning" size={16} color={colors.warning} style={{marginRight: 4}} />
              <Text style={styles.warningText}>Create your company profile first</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={24} color={colors.textPrimary} />
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <View style={styles.badge} />
                  )}
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: spacing.md,
  },
  userSection: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  userName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  companyName: {
    ...typography.body2,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  warningText: {
    ...typography.body2,
    color: colors.warning,
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  menuItemText: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.sm,
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
  },
});
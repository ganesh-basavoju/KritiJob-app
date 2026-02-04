// // ============================================
// // EMPLOYER DASHBOARD SCREEN
// // ============================================

// import React, {useEffect} from 'react';
// import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {useDispatch, useSelector} from 'react-redux';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {useFocusEffect} from '@react-navigation/native';
// import {fetchEmployerStats} from '../../redux/slices/employerSlice';
// import {AppDispatch, RootState} from '../../redux/store';
// import {companiesApi} from '../../api/companies.api';
// import {Company} from '../../types';
// import {Loader} from '../../components/common/Loader';
// import {colors} from '../../theme/colors';
// import {spacing, borderRadius, shadows} from '../../theme/spacing';
// import {typography} from '../../theme/typography';

// export const EmployerDashboardScreen: React.FC<any> = ({navigation}) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {stats, loading} = useSelector((state: RootState) => state.employer);
//   const [company, setCompany] = React.useState<Company | null>(null);

//   const loadData = React.useCallback(async () => {
//     await dispatch(fetchEmployerStats());
//     try {
//       const companyData = await companiesApi.getMyCompany();
//       setCompany(companyData);
//     } catch (error) {
//       console.log('Error fetching company:', error);
//     }
//   }, [dispatch]);

//   useFocusEffect(
//     React.useCallback(() => {
//       loadData();
//     }, [loadData])
//   );

//   if (loading && !stats) {
//     return <Loader />;
//   }

//   const statCards = [
//     {
//       title: 'Active Jobs',
//       value: stats?.activeJobs || 0,
//       icon: 'briefcase',
//       color: colors.info,
//     },
//     {
//       title: 'Total Applicants',
//       value: stats?.totalApplications || 0,
//       icon: 'people',
//       color: colors.success,
//     },
//     {
//       title: 'New Applicants',
//       value: stats?.newApplications || 0,
//       icon: 'person-add',
//       color: colors.warning,
//     },
//     {
//       title: 'Jobs Expiring Soon',
//       value: stats?.jobsExpiringSoon || 0,
//       icon: 'time',
//       color: colors.error,
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.header}>
//           {company && (
//             <Text style={styles.welcomeText}>Welcome, {company.name}</Text>
//           )}
//         </View>

//         <View style={styles.statsGrid}>
//           {statCards.map((stat, index) => (
//             <View key={index} style={[styles.statCard, {borderLeftColor: stat.color}]}>
//               <View style={[styles.statIconContainer, {backgroundColor: stat.color + '15'}]}>
//                 <Icon name={stat.icon} size={24} color={stat.color} />
//               </View>
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={styles.statTitle}>{stat.title}</Text>
//             </View>
//           ))}
//         </View>

//         <View style={styles.actionsSection}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
          
//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => navigation.navigate('PostJob')}>
//             <View style={styles.actionContent}>
//               <View style={[styles.actionIconContainer, {backgroundColor: colors.success + '15'}]}>
//                 <Icon name="add-circle" size={24} color={colors.success} />
//               </View>
//               <View style={styles.actionText}>
//                 <Text style={styles.actionTitle}>Post a New Job</Text>
//                 <Text style={styles.actionSubtitle}>Create a new job posting</Text>
//               </View>
//             </View>
//             <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => navigation.navigate('ViewApplicants')}>
//             <View style={styles.actionContent}>
//               <View style={[styles.actionIconContainer, {backgroundColor: colors.info + '15'}]}>
//                 <Icon name="people" size={24} color={colors.info} />
//               </View>
//               <View style={styles.actionText}>
//                 <Text style={styles.actionTitle}>View Applicants</Text>
//                 <Text style={styles.actionSubtitle}>All applicants of active jobs</Text>
//               </View>
//             </View>
//             <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => navigation.navigate('ManageJobs')}>
//             <View style={styles.actionContent}>
//               <View style={[styles.actionIconContainer, {backgroundColor: colors.warning + '15'}]}>
//                 <Icon name="clipboard" size={24} color={colors.warning} />
//               </View>
//               <View style={styles.actionText}>
//                 <Text style={styles.actionTitle}>Manage Jobs</Text>
//                 <Text style={styles.actionSubtitle}>View & edit job details</Text>
//               </View>
//             </View>
//             <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
//           </TouchableOpacity>
//         </View>
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
//     padding: spacing.md,
//   },
//   header: {
//     marginBottom: spacing.lg,
//   },
//   title: {
//     ...typography.h2,
//     color: colors.textPrimary,
//   },
//   welcomeText: {
//     ...typography.h2,
//     color: colors.textPrimary,
//     marginTop: spacing.xs,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: spacing.xl,
//   },
//   statCard: {
//     width: '48%',
//     backgroundColor: colors.card,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     marginBottom: spacing.md,
//     borderLeftWidth: 4,
//     ...shadows.md,
//     alignItems: 'flex-start',
//   },
//   statIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacing.sm,
//   },
//   statValue: {
//     ...typography.h2,
//     color: colors.textPrimary,
//     marginTop: spacing.xs,
//     marginBottom: spacing.xs,
//   },
//   statTitle: {
//     ...typography.body2,
//     color: colors.textSecondary,
//   },
//   actionsSection: {
//     marginTop: spacing.md,
//   },
//   sectionTitle: {
//     ...typography.h4,
//     color: colors.textPrimary,
//     marginBottom: spacing.md,
//   },
//   actionCard: {
//     backgroundColor: colors.card,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//     marginBottom: spacing.md,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     ...shadows.md,
//   },
//   actionContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   actionIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.md,
//   },
//   actionText: {
//     flex: 1,
//   },
//   actionTitle: {
//     ...typography.h6,
//     color: colors.textPrimary,
//     marginBottom: spacing.xs,
//   },
//   actionSubtitle: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   actionArrow: {
//     ...typography.h3,
//     color: colors.textSecondary,
//   },
// });

// ============================================
// EMPLOYER DASHBOARD SCREEN (with notifications)
// ============================================

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {fetchEmployerStats} from '../../redux/slices/employerSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {companiesApi} from '../../api/companies.api';
import {Company} from '../../types';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';

export const EmployerDashboardScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {stats, loading} = useSelector((state: RootState) => state.employer);
  const [company, setCompany] = useState<Company | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const loadData = React.useCallback(async () => {
    await dispatch(fetchEmployerStats());
    try {
      const companyData = await companiesApi.getMyCompany();
      setCompany(companyData);
    } catch (error) {
      console.log('Error fetching company:', error);
    }
    
    // Load notification count
    await fetchNotificationCount();
  }, [dispatch]);

  const fetchNotificationCount = async () => {
    try {
      const token = await storageService.getAccessToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setNotificationCount(json.count || 0);
        }
      }
    } catch (error) {
      console.log('Error fetching notification count:', error);
    }
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      
      // Refresh notification count when screen comes into focus
      const interval = setInterval(() => {
        fetchNotificationCount();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }, [loadData])
  );

  if (loading && !stats) {
    return <Loader />;
  }

  const statCards = [
    {
      title: 'Active Jobs',
      value: stats?.activeJobs || 0,
      icon: 'briefcase',
      color: colors.info,
    },
    {
      title: 'Total Applicants',
      value: stats?.totalApplications || 0,
      icon: 'people',
      color: colors.success,
    },
    {
      title: 'New Applicants',
      value: stats?.newApplications || 0,
      icon: 'person-add',
      color: colors.warning,
    },
    {
      title: 'Jobs Expiring Soon',
      value: stats?.jobsExpiringSoon || 0,
      icon: 'time',
      color: colors.error,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Company Name and Notification Icon */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {company && (
              <Text style={styles.welcomeText}>Welcome, {company.name}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={handleNotificationPress}>
            <Icon name="notifications-outline" size={24} color={colors.textPrimary} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <View key={index} style={[styles.statCard, {borderLeftColor: stat.color}]}>
              <View style={[styles.statIconContainer, {backgroundColor: stat.color + '15'}]}>
                <Icon name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PostJob')}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIconContainer, {backgroundColor: colors.success + '15'}]}>
                <Icon name="add-circle" size={24} color={colors.success} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Post a New Job</Text>
                <Text style={styles.actionSubtitle}>Create a new job posting</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ViewApplicants')}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIconContainer, {backgroundColor: colors.info + '15'}]}>
                <Icon name="people" size={24} color={colors.info} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>View Applicants</Text>
                <Text style={styles.actionSubtitle}>All applicants of active jobs</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ManageJobs')}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIconContainer, {backgroundColor: colors.warning + '15'}]}>
                <Icon name="clipboard" size={24} color={colors.warning} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Manage Jobs</Text>
                <Text style={styles.actionSubtitle}>View & edit job details</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
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
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  notificationIcon: {
    padding: spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.md,
    alignItems: 'flex-start',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  statTitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  actionsSection: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.md,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
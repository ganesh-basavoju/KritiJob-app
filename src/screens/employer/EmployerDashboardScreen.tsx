// ============================================
// EMPLOYER DASHBOARD SCREEN
// ============================================

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchEmployerStats} from '../../redux/slices/employerSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const EmployerDashboardScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {stats, loading} = useSelector((state: RootState) => state.employer);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    await dispatch(fetchEmployerStats());
  };

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
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: 'document-text',
      color: colors.success,
    },
    {
      title: 'Pending Review',
      value: stats?.pendingApplications || 0,
      icon: 'time',
      color: colors.warning,
    },
    {
      title: 'Shortlisted',
      value: stats?.shortlistedCandidates || 0,
      icon: 'star',
      color: colors.yellow,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

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
                <Text style={styles.actionTitle}>Post New Job</Text>
                <Text style={styles.actionSubtitle}>Create a new job posting</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ManageJobs')}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIconContainer, {backgroundColor: colors.info + '15'}]}>
                <Icon name="clipboard" size={24} color={colors.info} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Manage Jobs</Text>
                <Text style={styles.actionSubtitle}>View and edit your job postings</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CompanyProfile')}>
            <View style={styles.actionContent}>
              <View style={[styles.actionIconContainer, {backgroundColor: colors.warning + '15'}]}>
                <Icon name="business" size={24} color={colors.warning} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Company Profile</Text>
                <Text style={styles.actionSubtitle}>Update company information</Text>
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
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
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
  actionArrow: {
    ...typography.h3,
    color: colors.textSecondary,
  },
});

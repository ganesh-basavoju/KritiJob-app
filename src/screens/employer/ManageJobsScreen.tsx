// ============================================
// MANAGE JOBS SCREEN (Updated for API Alignment)
// ============================================

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchMyJobs} from '../../redux/slices/employerSlice'; // Ensure this hits /api/jobs/my-jobs
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';

// Interface based on API Data Model
interface Job {
  _id: string;
  title: string;
  location: string;
  type: string; // Full-Time, Part-Time, etc.
  salaryRange: string; // API uses salaryRange, code used salary
  status: 'Open' | 'Closed' | 'Draft' | 'Archived'; // Matches API Docs exactly
  // Applications count might need to be calculated from a separate endpoint 
  // or if the my-jobs endpoint populates applications.
  applicantsCount?: number; 
  createdAt: string;
}

export const ManageJobsScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  // Assuming your Redux state 'jobs' holds the array from /api/jobs/my-jobs
  const {jobs, loading} = useSelector((state: RootState) => state.employer);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    // Maps to: GET /api/jobs/my-jobs
    await dispatch(fetchMyJobs(1));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    // Maps to: GET /api/applications/job/:jobId (if passing jobId)
    // Or: GET /api/applications/employer/all (if filtering in screen)
    navigation.navigate('Applicants', {jobId});
  };

  const handleEditPress = (job: Job, event: any) => {
    event.stopPropagation();
    // Maps to: PUT /api/jobs/:id
    // PostJob screen should check for route.params.jobId to decide POST vs PUT
    navigation.navigate('PostJob', {jobId: job._id});
  };

  // UPDATED: Logic to match API status strings ('Open', 'Closed', etc.)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': // Changed from 'active'
        return colors.success;
      case 'Closed': // Matches API
        return colors.textSecondary;
      case 'Draft': // Matches API
        return colors.warning;
      case 'Archived': // Matches API
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderJobItem = ({item}: {item: Job}) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => handleJobPress(item._id)}
      activeOpacity={0.9}>
      <View style={styles.cardHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(item.status) + '20'},
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(item.status)},
              ]}>
              {item.status} 
            </Text>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={(e) => handleEditPress(item, e)}>
          <Icon name="pencil-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="cash-outline" size={16} color={colors.textSecondary} />
          {/* Using salaryRange based on API Model */}
          <Text style={styles.detailText}>{item.salaryRange}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="people-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {item.applicantsCount || 0} Applicants
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && jobs.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="No jobs posted"
            message="Post your first job to start hiring"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  jobCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  jobTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  editButton: {
    padding: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
  },
  cardBody: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
});
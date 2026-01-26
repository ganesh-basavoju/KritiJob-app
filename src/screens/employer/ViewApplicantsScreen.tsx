// ============================================
// VIEW APPLICANTS SCREEN (With Application Count Fix)
// ============================================

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchMyJobs} from '../../redux/slices/employerSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
// Import the API to fetch applications
import {applicationsApi} from '../../api/applications.api'; 

// Interface matching the reference file
interface Job {
  _id: string;
  title: string;
  location: string;
  type: string; 
  salaryRange: string; 
  status: 'Open' | 'Closed' | 'Draft' | 'Archived'; 
  // applicantsCount is handled via a separate state map now
  createdAt: string;
}

interface Props {
  navigation: any;
}

export const ViewApplicantsScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {jobs, loading} = useSelector((state: RootState) => state.employer);
  const [refreshing, setRefreshing] = useState(false);
  
  // NEW: State to hold the calculated counts { jobId: count }
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadJobs();
    loadApplicationCounts();
  }, []);

  const loadJobs = async () => {
    await dispatch(fetchMyJobs(1));
  };

  // NEW: Fetch all employer applications and count them per job
  const loadApplicationCounts = async () => {
    try {
      // Fetch all applications for this employer
      const response = await applicationsApi.getEmployerApplications(1, 100); // Fetch a high limit or implement pagination
      const apps = response.data || [];

      // Calculate counts
      const counts: Record<string, number> = {};
      apps.forEach((app: any) => {
        // Handle cases where jobId might be a string ID or a populated object
        const jId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId;
        if (jId) {
          counts[jId] = (counts[jId] || 0) + 1;
        }
      });

      setApplicationCounts(counts);
    } catch (error) {
      console.log('Failed to load application counts:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadJobs(), loadApplicationCounts()]);
    setRefreshing(false);
  };

  const handleJobPress = (job: Job) => {
    navigation.navigate('JobApplicantsList', {
      jobId: job._id,
      jobTitle: job.title,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return colors.success;
      case 'Closed':
        return colors.textSecondary;
      case 'Draft':
        return colors.warning;
      case 'Archived':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderJobItem = ({item}: {item: Job}) => {
    // Get count from our calculated map
    const count = applicationCounts[item._id] || 0;

    return (
      <TouchableOpacity
        style={styles.jobCard}
        onPress={() => handleJobPress(item)}
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

          {/* Navigation Indicator */}
          <View style={styles.chevronContainer}>
              <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <Icon name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="briefcase-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="people-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {/* UPDATED: Use calculated count */}
              {count} Applicant{count !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
            title="No jobs found"
            message="Post a job to start viewing applicants"
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
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.sm,
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
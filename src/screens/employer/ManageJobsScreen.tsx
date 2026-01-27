// ============================================
// MANAGE JOBS SCREEN hdvxvdhvhdxhdxcdchdc vdgvc gv  gvc cv gdvc gdgvdxgdxc vbxdvcdvchvdnhxxhvhxn
// ============================================

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
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
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string; 
  salaryRange: string; 
  status: 'Open' | 'Closed' | 'Draft' | 'Archived'; 
  applicantsCount?: number; 
  createdAt: string;
}

export const ManageJobsScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {jobs, loading} = useSelector((state: RootState) => state.employer);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    await dispatch(fetchMyJobs(1));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    navigation.navigate('Applicants', {jobId});
  };

  const handleEditPress = (job: Job, event: any) => {
    event.stopPropagation();
    navigation.navigate('PostJob', {jobId: job._id});
  };

  // --- DELETE FUNCTIONALITY ---
  const handleDelete = (jobId: string, title: string) => {
    Alert.alert(
      'Delete Job',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(jobId),
        },
      ]
    );
  };

  const confirmDelete = async (jobId: string) => {
    try {
      setDeletingId(jobId);
      const token = await storageService.getAccessToken();
      if (!token) throw new Error('Unauthorized');

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Job deleted successfully.');
        // Refresh list
        await loadJobs();
      } else {
        Alert.alert('Error', 'Failed to delete job.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      Alert.alert('Error', 'Network error occurred.');
    } finally {
      setDeletingId(null);
    }
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

        {/* Action Buttons Container */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, {backgroundColor: colors.backgroundSecondary}]}
            onPress={(e) => handleEditPress(item, e)}
            disabled={deletingId === item._id}>
            <Icon name="pencil-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.iconButton, {backgroundColor: colors.error + '20'}]}
            onPress={() => handleDelete(item._id, item.title)}
            disabled={deletingId === item._id}>
            {deletingId === item._id ? (
              <ActivityIndicator size="small" color={colors.error} />
            ) : (
              <Icon name="trash-outline" size={18} color={colors.error} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="cash-outline" size={16} color={colors.textSecondary} />
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs,
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
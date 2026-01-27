// ============================================
// SAVED JOBS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getSavedJobs} from '../../redux/slices/candidateSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {JobCard} from '../../components/jobs/JobCard';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export const SavedJobsScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {profile, loading} = useSelector((state: RootState) => state.candidate);
  const [refreshing, setRefreshing] = useState(false);
  const savedJobs = profile?.savedJobs || [];

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    await dispatch(getSavedJobs());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSavedJobs();
    setRefreshing(false);
  };

  if (loading && savedJobs.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={savedJobs}
        renderItem={({item}) => (
          <JobCard
            job={item}
            onPress={() =>
              navigation.navigate('JobDetails', {jobId: (item as any)._id || item.id})
            }
          />
        )}
        keyExtractor={(item, index) => {
          const id = (item as any)._id || item.id;
          return id ? `saved-job-${String(id)}-${index}` : `saved-fallback-${index}`;
        }}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="No saved jobs"
            message="Save jobs to view them here"
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
  },
});

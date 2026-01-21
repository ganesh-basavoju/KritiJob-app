// ============================================
// MANAGE JOBS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchMyJobs, closeJob, reopenJob} from '../../redux/slices/employerSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {JobCard} from '../../components/jobs/JobCard';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const ManageJobsScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {jobs, loading} = useSelector((state: RootState) => state.employer);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading && jobs.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={jobs}
        renderItem={({item}) => (
          <JobCard job={item} onPress={() => handleJobPress(item.id)} />
        )}
        keyExtractor={item => item.id}
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
  },
});

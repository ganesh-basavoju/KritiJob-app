// ============================================
// APPLICATIONS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchMyApplications} from '../../redux/slices/applicationsSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {ApplicationCard} from '../../components/jobs/ApplicationCard';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export const ApplicationsScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {applications, loading} = useSelector(
    (state: RootState) => state.applications,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    await dispatch(fetchMyApplications(1));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  if (loading && applications.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={applications}
        renderItem={({item}) => {
          const job = (item as any).jobId || item.job;
          const jobId = (job as any)?._id || job?.id;
          return (
            <ApplicationCard
              application={item}
              onPress={() => jobId && navigation.navigate('JobDetails', {jobId})}
            />
          );
        }}
        keyExtractor={(item, index) => {
          const appId = (item as any)._id || item.id;
          return appId ? `application-${String(appId)}-${index}` : `application-fallback-${index}`;
        }}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="No applications yet"
            message="Start applying to jobs to see them here"
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

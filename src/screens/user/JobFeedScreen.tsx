// ============================================
// JOB FEED SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchJobs, setFilters, clearFilters} from '../../redux/slices/jobsSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {JobCard} from '../../components/jobs/JobCard';
import {JobFiltersComponent} from '../../components/jobs/JobFilters';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {ErrorText} from '../../components/common/ErrorText';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const JobFeedScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {jobs, loading, error, pagination, filters} = useSelector(
    (state: RootState) => state.jobs,
  );
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJobs(1);
  }, [filters]);

  const loadJobs = async (page: number) => {
    await dispatch(fetchJobs({page, filters}));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJobs(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages && !loading) {
      loadJobs(pagination.page + 1);
    }
  };

  const handleFilterApply = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Find Jobs</Text>
      <View style={styles.headerActions}>
        {Object.keys(filters).length > 0 && (
          <TouchableOpacity onPress={handleClearFilters} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setFiltersVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterText}>🔍 Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && jobs.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {error && <ErrorText message={error} />}
      <FlatList
        data={jobs}
        renderItem={({item}) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetails', {jobId: item.id})}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            title="No jobs found"
            message="Try adjusting your filters or check back later"
          />
        }
      />
      <JobFiltersComponent
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: spacing.sm,
  },
  clearText: {
    ...typography.body2,
    color: colors.error,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterText: {
    ...typography.body2,
    color: colors.yellow,
  },
  list: {
    padding: spacing.md,
  },
});

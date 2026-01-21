// ============================================
// APPLICANTS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchApplicants} from '../../redux/slices/employerSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {ApplicantCard} from '../../components/employer/ApplicantCard';
import {Loader} from '../../components/common/Loader';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

export const ApplicantsScreen: React.FC<any> = ({navigation, route}) => {
  const {jobId} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {applicants, loading} = useSelector((state: RootState) => state.employer);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const loadApplicants = async () => {
    await dispatch(fetchApplicants({jobId, page: 1}));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplicants();
    setRefreshing(false);
  };

  if (loading && applicants.length === 0) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={applicants}
        renderItem={({item}) => (
          <ApplicantCard
            application={item}
            onPress={() =>
              navigation.navigate('ApplicantDetails', {applicationId: item.id})
            }
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <EmptyState
            title="No applicants yet"
            message="Applications will appear here once received"
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

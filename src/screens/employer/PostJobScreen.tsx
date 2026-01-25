// ============================================
// POST JOB SCREEN
// ============================================

import React, {useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createJob} from '../../redux/slices/employerSlice';
import {fetchMyCompany} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {JobPostForm} from '../../components/employer/JobPostForm';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';

export const PostJobScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading} = useSelector((state: RootState) => state.employer);
  const {loading: companyLoading} = useSelector(
    (state: RootState) => state.companies,
  );

  useEffect(() => {
    dispatch(fetchMyCompany());
  }, [dispatch]);

  const handleSubmit = async (data: any) => {
    const result = await dispatch(createJob(data));
    if (createJob.fulfilled.match(result)) {
      Alert.alert('Success', 'Job posted successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to post job');
    }
  };

  if (companyLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <JobPostForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});


// ============================================
// POST JOB SCREEN (Updated for Edit Mode)
// ============================================

import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios'; // Add axios import
import {createJob, updateJob} from '../../redux/slices/employerSlice';
import {fetchMyCompany} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {JobPostForm} from '../../components/employer/JobPostForm';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {API_BASE_URL} from '../../utils/constants'; // This is just a string

export const PostJobScreen: React.FC<any> = ({navigation, route}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading} = useSelector((state: RootState) => state.employer);
  const {loading: companyLoading} = useSelector(
    (state: RootState) => state.companies,
  );

  // Check if we are in Edit Mode
  const isEditing = !!route.params?.jobId;
  const jobId = route.params?.jobId;

  // State to hold job details for editing
  const [initialValues, setInitialValues] = useState<any>(null);
  const [fetchingJob, setFetchingJob] = useState(isEditing);

  useEffect(() => {
    dispatch(fetchMyCompany());

    // If we have a jobId, fetch the details to populate the form
    if (isEditing && jobId) {
      fetchJobDetails(jobId);
    }
  }, [dispatch, isEditing, jobId]);

  const fetchJobDetails = async (id: string) => {
    try {
      // FIXED: Use axios.get with template literal
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      const jobData = response.data.data;

      // Format skills array to comma-separated string for the input
      const formattedData = {
        ...jobData,
        skills: jobData.skillsRequired ? jobData.skillsRequired.join(', ') : '',
      };
      
      setInitialValues(formattedData);
    } catch (error) {
      console.error('Error fetching job:', error);
      Alert.alert('Error', 'Failed to load job details.');
      navigation.goBack();
    } finally {
      setFetchingJob(false);
    }
  };

  const handleSubmit = async (data: any) => {
    // Prepare payload: Convert skills string back to array
    const payload = {
      ...data,
      skillsRequired: data.skills
        ? data.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : [],
    };

    let result;
    
    if (isEditing) {
      result = await dispatch(updateJob({id: jobId, ...payload} as any));
    } else {
      result = await dispatch(createJob(payload));
    }

    if (
      (isEditing && updateJob.fulfilled.match(result)) ||
      (!isEditing && createJob.fulfilled.match(result))
    ) {
      Alert.alert(
        'Success',
        isEditing ? 'Job updated successfully!' : 'Job posted successfully!',
      );
      navigation.goBack();
    } else {
      Alert.alert('Error', isEditing ? 'Failed to update job' : 'Failed to post job');
    }
  };

  if (companyLoading || fetchingJob) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <JobPostForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={loading}
        isEditing={isEditing}
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
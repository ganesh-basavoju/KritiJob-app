
// ============================================
// POST JOB SCREEN (Fixed to match Slice Signature)
// ============================================

import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {createJob, updateJob, fetchMyJobs} from '../../redux/slices/employerSlice';
import {fetchMyCompany} from '../../redux/slices/companiesSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {JobPostForm} from '../../components/employer/JobPostForm';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {API_BASE_URL} from '../../utils/constants';

export const PostJobScreen: React.FC<any> = ({navigation, route}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {loading: jobLoading} = useSelector((state: RootState) => state.employer);
  const {myCompany, loading: companyLoading} = useSelector(
    (state: RootState) => state.companies,
  );

  const isEditing = !!route.params?.jobId;
  const jobId = route.params?.jobId;

  const [initialValues, setInitialValues] = useState<any>(null);
  const [fetchingJob, setFetchingJob] = useState(isEditing);
  const [companyCheckDone, setCompanyCheckDone] = useState(false);

  useEffect(() => {
    const checkCompany = async () => {
      await dispatch(fetchMyCompany());
      setCompanyCheckDone(true);
    };
    checkCompany();

    if (isEditing && jobId) {
      fetchJobDetails(jobId);
    }
  }, [dispatch, isEditing, jobId]);

  // Prevent posting job if company profile doesn't exist
  useEffect(() => {
    if (companyCheckDone && !companyLoading && !isEditing && !myCompany) {
      Alert.alert(
        'Company Profile Required',
        'You need to create your company profile before posting a job.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Create Profile',
            onPress: () => {
              navigation.goBack();
              // Navigate to company profile screen after a slight delay
              setTimeout(() => {
                navigation.navigate('ProfileTab');
              }, 100);
            },
          },
        ],
        {cancelable: false}
      );
    }
  }, [companyCheckDone, companyLoading, isEditing, myCompany, navigation]);

  const fetchJobDetails = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
      const jobData = response.data.data;

      if (jobData) {
        // Map API data to form (Array -> String)
        const formattedData = {
          ...jobData,
          skillsRequired: jobData.skillsRequired ? jobData.skillsRequired.join(', ') : '',
        };
        setInitialValues(formattedData);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      Alert.alert('Error', 'Failed to load job details.');
      navigation.goBack();
    } finally {
      setFetchingJob(false);
    }
  };

  const handleSubmit = async (data: any) => {
    // 1. Get Company ID
    const companyId = myCompany?.id || myCompany?._id;
    
    if (!isEditing && !companyId) {
      Alert.alert('Missing Info', 'Company profile not found. Please complete your profile first.');
      return;
    }

    // 2. Prepare Payload matching API spec
    // Set default deadline of 30 days from now if not provided
    const deadline = data.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      experienceLevel: data.experienceLevel,
      salaryRange: data.salaryRange,
      skillsRequired: data.skillsRequired
        ? String(data.skillsRequired).split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : [],
      applicationDeadline: deadline instanceof Date ? deadline.toISOString() : deadline,
    };

    // Attach companyId ONLY for Create (POST)
    if (!isEditing) {
      payload.companyId = companyId;
    }

    let result;

    if (isEditing) {
      // -------------------------------------------------------------
      // FIX: MATCH SLICE SIGNATURE: { id: string, jobData: any }
      // -------------------------------------------------------------
      result = await dispatch(updateJob({
        id: jobId,
        jobData: payload
      }));
    } else {
      // Create expects (jobData: any) directly
      result = await dispatch(createJob(payload));
    }

    if (
      (isEditing && updateJob.fulfilled.match(result)) ||
      (!isEditing && createJob.fulfilled.match(result))
    ) {
      // Refresh list
      await dispatch(fetchMyJobs(1)); 

      Alert.alert(
        'Success',
        isEditing ? 'Job updated successfully!' : 'Job posted successfully!',
      );
      navigation.goBack();
    } else {
      // Handle Error
      const errorMessage = result?.error?.message || 
                         (isEditing ? 'Failed to update job' : 'Failed to post job');
      Alert.alert('Error', errorMessage);
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
        loading={jobLoading}
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
// // ============================================
// // POST JOB SCREEN
// // ============================================

// import React, {useEffect} from 'react';
// import {View, StyleSheet, Alert} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {createJob} from '../../redux/slices/employerSlice';
// import {fetchMyCompany} from '../../redux/slices/companiesSlice';
// import {AppDispatch, RootState} from '../../redux/store';
// import {JobPostForm} from '../../components/employer/JobPostForm';
// import {Loader} from '../../components/common/Loader';
// import {colors} from '../../theme/colors';

// export const PostJobScreen: React.FC<any> = ({navigation}) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {loading} = useSelector((state: RootState) => state.employer);
//   const {myCompany, loading: companyLoading} = useSelector(
//     (state: RootState) => state.companies,
//   );

//   useEffect(() => {
//     dispatch(fetchMyCompany());
//   }, []);

//   const handleSubmit = async (data: any) => {
//     const result = await dispatch(createJob(data));
//     if (!result.error) {
//       Alert.alert('Success', 'Job posted successfully!');
//       navigation.goBack();
//     } else {
//       Alert.alert('Error', 'Failed to post job');
//     }
//   };

//   if (companyLoading) {
//     return <Loader />;
//   }

//   const companies = myCompany ? [myCompany] : [];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <JobPostForm
//         onSubmit={handleSubmit}
//         loading={loading}
//         companies={companies}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
// });


import React, {useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
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
  const {myCompany, loading: companyLoading} = useSelector(
    (state: RootState) => state.companies,
  );

  useEffect(() => {
    dispatch(fetchMyCompany());
  }, []);

  const handleSubmit = async (data: any) => {
    // Map form data to backend API requirements
    const apiPayload = {
      companyId: data.companyId,
      title: data.title,
      description: data.description,
      location: data.location,
      type: data.type,
      experienceLevel: data.experience, // UI 'experience' -> Backend 'experienceLevel'
      salaryRange: data.salary,           // UI 'salary' -> Backend 'salaryRange'
      skillsRequired: data.skills,        // UI 'skills' -> Backend 'skillsRequired'
    };

    const result = await dispatch(createJob(apiPayload));
    
    if (createJob.fulfilled.match(result)) {
      Alert.alert('Success', 'Job posted successfully!');
      navigation.goBack();
    } else {
      const errorMessage = result.payload as string;
      Alert.alert('Error', errorMessage || 'Failed to post job');
    }
  };

  if (companyLoading) {
    return <Loader />;
  }

  const companies = myCompany ? [myCompany] : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <JobPostForm
        onSubmit={handleSubmit}
        loading={loading}
        companies={companies}
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
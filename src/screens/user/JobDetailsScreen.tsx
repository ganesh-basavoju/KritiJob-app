// ============================================
// JOB DETAILS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchJobById, saveJob, unsaveJob, addAppliedJobId} from '../../redux/slices/jobsSlice';
import {applyForJob} from '../../redux/slices/applicationsSlice';
import {fetchUserProfile} from '../../redux/slices/userSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {Loader} from '../../components/common/Loader';
import {ErrorText} from '../../components/common/ErrorText';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatDate} from '../../utils/dateFormatter';
import {jobsApi} from '../../api/jobs.api';
import {applicationsApi} from '../../api/applications.api';

// Helper function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .trim();
};

export const JobDetailsScreen: React.FC<any> = ({navigation, route}) => {
  const {jobId} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {currentJob, currentJobLoading} = useSelector((state: RootState) => state.jobs);
  const {loading: applyLoading} = useSelector((state: RootState) => state.applications);
  const {profile} = useSelector((state: RootState) => state.user);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await loadJobDetails();
      await checkSavedStatus();
      await checkApplicationStatus();
      await dispatch(fetchUserProfile());
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const loadJobDetails = async () => {
    await dispatch(fetchJobById(jobId));
  };

  const checkSavedStatus = async () => {
    try {
      const saved = await jobsApi.isJobSaved(jobId);
      setIsSaved(saved);
    } catch {
      // Ignore error
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const status = await applicationsApi.checkApplicationStatus(jobId);
      setHasApplied(status.applied);
    } catch {
      // Ignore error
    }
  };

  const handleSaveToggle = async () => {
    if (isSaved) {
      await dispatch(unsaveJob(jobId));
      setIsSaved(false);
    } else {
      await dispatch(saveJob(jobId));
      setIsSaved(true);
    }
  };

  const handleApply = () => {
    // Check if user has uploaded a resume
    let resumeUrl = null;
    if (profile) {
      // Check defaultResumeUrl first
      if (profile.defaultResumeUrl) {
        resumeUrl = profile.defaultResumeUrl;
      }
      // Check resumes array
      else if (profile.resumes && Array.isArray(profile.resumes) && profile.resumes.length > 0) {
        resumeUrl = profile.resumes[0].url;
      }
      // Check legacy resume field
      else if (profile.resume) {
        resumeUrl = profile.resume;
      }
    }
    
    if (!resumeUrl) {
      Alert.alert(
        'Resume Required',
        'Please upload a resume to your profile before applying for jobs.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Go to Profile', onPress: () => navigation.navigate('Profile')},
        ]
      );
      return;
    }

    Alert.alert('Apply for Job', 'Do you want to apply for this position?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Apply', onPress: () => submitApplication(resumeUrl)},
    ]);
  };

  const submitApplication = async (resumeUrl: string) => {
    const result: any = await dispatch(applyForJob({jobId, coverLetter: '', resumeUrl}));
    if (result.meta && result.meta.requestStatus === 'fulfilled') {
      setHasApplied(true);
      dispatch(addAppliedJobId(jobId)); // Update Redux state to remove from feed/saved
      Alert.alert('Success', 'Application submitted successfully!');
    } else {
      const errorMessage = (result.payload as string) || 'Failed to submit application. Please try again.';
      Alert.alert('Application Failed', errorMessage);
    }
  };

  if (currentJobLoading && !currentJob) {
    return <Loader />;
  }

  if (!currentJob) {
    return (
      <View style={styles.container}>
        <ErrorText message="Job not found" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{currentJob.title}</Text>
            <Text style={styles.company}>{(currentJob as any).companyId?.name || currentJob.company?.name}</Text>
          </View>
          <TouchableOpacity onPress={handleSaveToggle}>
            <Icon
              name={isSaved ? 'heart' : 'heart-outline'}
              size={28}
              color={isSaved ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{currentJob.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{currentJob.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Experience</Text>
            <Text style={styles.detailValue}>{(currentJob as any).experienceLevel || currentJob.experience}</Text>
          </View>
        </View>

        {(currentJob as any).deadline && (
          <View style={styles.deadlineContainer}>
            <Icon name="time-outline" size={20} color={colors.warning} />
            <View style={styles.deadlineTextContainer}>
              <Text style={styles.deadlineLabel}>Application Deadline</Text>
              <Text style={styles.deadlineValue}>{formatDate((currentJob as any).deadline)}</Text>
            </View>
          </View>
        )}

        {((currentJob as any).salaryRange || currentJob.salary) && (
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryLabel}>Salary Range</Text>
            <Text style={styles.salaryValue}>{(currentJob as any).salaryRange || currentJob.salary}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skills}>
            {((currentJob as any).skillsRequired || currentJob.skills || []).map((skill: string, index: number) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{stripHtmlTags(currentJob.description)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Company</Text>
          <Text style={styles.companyName}>{(currentJob as any).companyId?.name || currentJob.company?.name}</Text>
          <Text style={styles.companyDescription}>{stripHtmlTags((currentJob as any).companyId?.description || currentJob.company?.description || '')}</Text>
          <View style={styles.companyDetailRow}>
            <Icon name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.companyDetail}>{(currentJob as any).companyId?.location || currentJob.company?.location}</Text>
          </View>
          {((currentJob as any).companyId?.size || currentJob.company?.size) && (
            <View style={styles.companyDetailRow}>
              <Icon name="people-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.companyDetail}>{(currentJob as any).companyId?.size || currentJob.company?.size}</Text>
            </View>
          )}
          {((currentJob as any).companyId?.industry || currentJob.company?.industry) && (
            <View style={styles.companyDetailRow}>
              <Icon name="business-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.companyDetail}>{(currentJob as any).companyId?.industry || currentJob.company?.industry}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.postedText}>Posted on {formatDate(currentJob.createdAt)}</Text>
          <Text style={styles.applicantsText}>{currentJob.applicationsCount} applicants</Text>
        </View>
      </ScrollView>

      <View style={styles.applyContainer}>
        {hasApplied ? (
          <Button title="Applied" disabled onPress={() => {}} style={styles.applyButton} />
        ) : (
          <Button
            title="Apply Now"
            onPress={handleApply}
            loading={applyLoading}
            style={styles.applyButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  company: {
    ...typography.h6,
    color: colors.textSecondary,
  },
  saveIcon: {
    fontSize: 32,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  deadlineTextContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  deadlineLabel: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  deadlineValue: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  salaryContainer: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  salaryLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  salaryValue: {
    ...typography.h4,
    color: colors.yellow,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  skillText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  companyName: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  companyDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  companyDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  companyDetail: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  postedText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  applicantsText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  applyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyButton: {
    width: '100%',
  },
});

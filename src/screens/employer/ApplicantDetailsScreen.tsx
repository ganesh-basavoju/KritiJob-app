// ============================================
// APPLICANT DETAILS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchApplicantById, updateApplicationStatus} from '../../redux/slices/employerSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatDate} from '../../utils/dateFormatter';
import {APPLICATION_STATUS} from '../../utils/constants';

export const ApplicantDetailsScreen: React.FC<any> = ({route}) => {
  const {applicationId} = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const {currentApplicant, loading} = useSelector((state: RootState) => state.employer);

  useEffect(() => {
    loadApplicant();
  }, [applicationId]);

  const loadApplicant = async () => {
    await dispatch(fetchApplicantById(applicationId));
  };

  const handleStatusChange = async (status: string) => {
    Alert.alert(
      'Confirm',
      `Change status to ${APPLICATION_STATUS[status as keyof typeof APPLICATION_STATUS]}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: () => updateStatus(status)},
      ],
    );
  };

  const updateStatus = async (status: string) => {
    await dispatch(updateApplicationStatus({applicationId, status}));
  };

  if (loading && !currentApplicant) {
    return <Loader />;
  }

  if (!currentApplicant) {
    return null;
  }

  const {user, job, status, coverLetter, appliedAt} = currentApplicant;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone && <Text style={styles.phone}>📞 {user.phone}</Text>}
          {user.location && <Text style={styles.location}>📍 {user.location}</Text>}
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {APPLICATION_STATUS[status as keyof typeof APPLICATION_STATUS]}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applied For</Text>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCompany}>{job.company.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.text}>{user.experience || 'Not specified'}</Text>
        </View>

        {user.skills && user.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {user.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.text}>{user.bio}</Text>
          </View>
        )}

        {coverLetter && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cover Letter</Text>
            <Text style={styles.text}>{coverLetter}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.appliedText}>Applied on {formatDate(appliedAt)}</Text>
        </View>

        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Update Status</Text>
          <Button
            title="Shortlist"
            onPress={() => handleStatusChange('shortlisted')}
            variant="primary"
            style={styles.actionButton}
            disabled={status === 'shortlisted'}
          />
          <Button
            title="Accept"
            onPress={() => handleStatusChange('accepted')}
            variant="primary"
            style={styles.actionButton}
            disabled={status === 'accepted'}
          />
          <Button
            title="Reject"
            onPress={() => handleStatusChange('rejected')}
            variant="outline"
            style={styles.actionButton}
            disabled={status === 'rejected'}
          />
        </View>
      </ScrollView>
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
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  phone: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  location: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statusSection: {
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...typography.body2,
    color: colors.yellow,
    fontWeight: '600',
  },
  jobTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  jobCompany: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  text: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
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
  appliedText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  actions: {
    marginTop: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});

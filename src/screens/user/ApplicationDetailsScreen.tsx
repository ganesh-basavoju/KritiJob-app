// ============================================
// APPLICATION DETAILS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Loader} from '../../components/common/Loader';
import {Button} from '../../components/common/Button';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {formatRelativeTime} from '../../utils/dateFormatter';

export const ApplicationDetailsScreen: React.FC<any> = ({route, navigation}) => {
  const {application} = route.params;
  const [loading, setLoading] = useState(false);

  const job = (application as any).jobId || application.job;
  const company = job?.companyId || job?.company;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return colors.warning;
      case 'Reviewing':
        return colors.info;
      case 'Shortlisted':
        return colors.success;
      case 'Rejected':
        return colors.error;
      case 'Accepted':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'time-outline';
      case 'Reviewing':
        return 'eye-outline';
      case 'Shortlisted':
        return 'checkmark-circle-outline';
      case 'Rejected':
        return 'close-circle-outline';
      case 'Accepted':
        return 'checkmark-circle';
      default:
        return 'help-circle-outline';
    }
  };

  const handleViewJob = () => {
    const jobId = (job as any)?._id || job?.id;
    if (jobId) {
      navigation.navigate('JobDetails', {jobId});
    }
  };

  const handleViewCompany = () => {
    const companyId = (company as any)?._id || company?.id;
    if (companyId) {
      navigation.navigate('CompanyDetails', {companyId});
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon
              name={getStatusIcon(application.status)}
              size={40}
              color={getStatusColor(application.status)}
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Application Status</Text>
              <Text
                style={[
                  styles.statusText,
                  {color: getStatusColor(application.status)},
                ]}>
                {application.status}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.dateRow}>
            <Icon name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.dateText}>
              Applied {formatRelativeTime(application.createdAt)}
            </Text>
          </View>
        </View>

        {/* Job Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <TouchableOpacity style={styles.infoCard} onPress={handleViewJob}>
            <View style={styles.infoRow}>
              <Icon name="briefcase-outline" size={20} color={colors.yellow} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Position</Text>
                <Text style={styles.infoValue}>{job?.title || 'N/A'}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {job?.type && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="time-outline" size={20} color={colors.yellow} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Job Type</Text>
                  <Text style={styles.infoValue}>{job.type}</Text>
                </View>
              </View>
            </View>
          )}

          {job?.location && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="location-outline" size={20} color={colors.yellow} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{job.location}</Text>
                </View>
              </View>
            </View>
          )}

          {job?.salaryRange && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="cash-outline" size={20} color={colors.yellow} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Salary Range</Text>
                  <Text style={styles.infoValue}>{job.salaryRange}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Company Information */}
        {company && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company</Text>
            <TouchableOpacity style={styles.infoCard} onPress={handleViewCompany}>
              <View style={styles.infoRow}>
                <Icon name="business-outline" size={20} color={colors.yellow} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Company Name</Text>
                  <Text style={styles.infoValue}>{company.name || 'N/A'}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            {company.location && (
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Icon name="location-outline" size={20} color={colors.yellow} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{company.location}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Application Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Information</Text>
          
          {application.resumeUrl && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="document-text-outline" size={20} color={colors.yellow} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Resume</Text>
                  <Text style={styles.infoValue}>Submitted</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={20} color={colors.yellow} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Application Date</Text>
                <Text style={styles.infoValue}>
                  {new Date(application.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>

          {application.updatedAt && application.updatedAt !== application.createdAt && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="sync-outline" size={20} color={colors.yellow} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Last Updated</Text>
                  <Text style={styles.infoValue}>
                    {formatRelativeTime(application.updatedAt)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        <Button
          title="View Full Job Details"
          onPress={handleViewJob}
          variant="primary"
          style={styles.actionButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statusText: {
    ...typography.h4,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

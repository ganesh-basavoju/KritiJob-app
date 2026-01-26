// src/screens/employer/JobApplicantsListScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking, // 1. Import Linking
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {applicationsApi, Application} from '../../api/applications.api';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';

interface Props {
  route: any;
  navigation: any;
}

export const JobApplicantsListScreen: React.FC<Props> = ({route, navigation}) => {
  const {jobId, jobTitle} = route.params;
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: jobTitle || 'Applicants',
    });
    loadApplicants();
  }, [jobId, jobTitle]);

  const loadApplicants = async () => {
    try {
      const response = await applicationsApi.getJobApplications(jobId);
      setApplicants(response.data || []);
    } catch (error) {
      console.log('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected': return colors.success;
      case 'Rejected': return colors.error;
      case 'Interviewing': return colors.info;
      case 'Reviewing': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const renderApplicantCard = ({item}: {item: Application}) => {
    const candidateName = typeof item.candidateId === 'object' 
      ? item.candidateId.name 
      : 'Unknown Candidate';
    
    const candidateEmail = typeof item.candidateId === 'object' 
      ? item.candidateId.email 
      : 'No email';
      
    const appliedDate = new Date(item.createdAt).toLocaleDateString();

    // 2. Define the handler
    const handleViewDetails = () => {
      // OPTION A: Navigate to the Details Screen (Recommended)
      // Ensure 'ApplicantDetails' matches the name in your EmployerNavigator stack
      navigation.navigate('ApplicantDetails', {
        applicationId: item._id,
        // Pass the whole application object if the screen needs data immediately
        application: item,
      });

      // OPTION B: Open Resume URL directly (Uncomment below to use this instead)
      /*
      if (item.resumeUrl) {
        Linking.openURL(item.resumeUrl).catch(err => {
          Alert.alert('Error', 'Could not open the resume URL');
        });
      } else {
        Alert.alert('No Resume', 'This applicant has not uploaded a resume yet.');
      }
      */
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.candidateInfo}>
             <View style={styles.avatarPlaceholder}>
               <Text style={styles.avatarText}>
                 {candidateName.charAt(0).toUpperCase()}
               </Text>
             </View>
             <View style={styles.nameContainer}>
               <Text style={styles.candidateName}>{candidateName}</Text>
               <Text style={styles.candidateEmail}>{candidateEmail}</Text>
             </View>
          </View>
          
          <View style={[styles.statusBadge, {backgroundColor: getStatusColor(item.status) + '20'}]}>
            <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.metaItem}>
            <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Applied on {appliedDate}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleViewDetails} // 3. Attach the handler
          activeOpacity={0.7}>
          <Text style={styles.actionButtonText}>View Resume / Details</Text>
          <Icon name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={applicants}
        keyExtractor={(item) => item._id}
        renderItem={renderApplicantCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="person-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No applicants yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ... styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  candidateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.h6,
    color: colors.primary,
  },
  nameContainer: {
    flex: 1,
  },
  candidateName: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  candidateEmail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
  },
  cardBody: {
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
  actionButtonText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    ...typography.body1,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
});
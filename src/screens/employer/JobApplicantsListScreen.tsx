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
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {applicationsApi, Application} from '../../api/applications.api';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';

const APPLICATION_STATUSES = [
  'Applied',
  'Reviewing',
  'Interviewing',
  'Selected',
  'Rejected',
];

interface Props {
  route: any;
  navigation: any;
}

export const JobApplicantsListScreen: React.FC<Props> = ({route, navigation}) => {
  const {jobId, jobTitle} = route.params;
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
      case 'Selected': return '#10B981';
      case 'Rejected': return '#EF4444';
      case 'Interviewing': return '#3B82F6';
      case 'Reviewing': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const handleStatusChange = (applicant: Application) => {
    setSelectedApplicant(applicant);
    setStatusModalVisible(true);
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedApplicant) return;
    
    setUpdatingStatus(true);
    try {
      await applicationsApi.updateApplicationStatus(selectedApplicant._id, newStatus);
      
      // Update local state
      setApplicants(prev =>
        prev.map(app =>
          app._id === selectedApplicant._id ? {...app, status: newStatus} : app
        )
      );
      
      Alert.alert('Success', `Status updated to ${newStatus}`);
      setStatusModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const viewCandidateProfile = (candidateId: any) => {
    let id;
    if (typeof candidateId === 'object') {
      // Try both _id and id fields
      id = candidateId._id || candidateId.id;
    } else {
      id = candidateId;
    }
    
    console.log('Navigating to candidate profile with ID:', id, 'Original candidateId:', candidateId);
    
    if (!id) {
      Alert.alert('Error', 'Unable to view candidate profile - ID not found');
      return;
    }
    
    navigation.navigate('CandidateProfile', {candidateId: id});
  };

  const renderApplicantCard = ({item}: {item: Application}) => {
    const candidateName = typeof item.candidateId === 'object' 
      ? item.candidateId.name 
      : 'Unknown Candidate';
    
    const candidateEmail = typeof item.candidateId === 'object' 
      ? item.candidateId.email 
      : 'No email';
      
    const appliedDate = new Date(item.createdAt).toLocaleDateString();

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
          
          <TouchableOpacity
            style={[
              styles.statusBadge, 
              {
                backgroundColor: getStatusColor(item.status) + '15',
                borderColor: getStatusColor(item.status) + '50'
              }
            ]}
            onPress={() => handleStatusChange(item)}>
            <Text style={[styles.statusText, {color: getStatusColor(item.status)}]}>
              {item.status}
            </Text>
            <Icon name="chevron-down" size={10} color={getStatusColor(item.status)} style={{marginLeft: 4}} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.metaItem}>
            <Icon name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Applied on {appliedDate}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => viewCandidateProfile(item.candidateId)}
            activeOpacity={0.8}>
            <Icon name="person-outline" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>View Profile</Text>
          </TouchableOpacity>

          
        </View>
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

      {/* Status Change Modal */}
      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Application Status</Text>
              <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {APPLICATION_STATUSES.map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  selectedApplicant?.status === status && styles.statusOptionActive,
                ]}
                onPress={() => updateStatus(status)}
                disabled={updatingStatus}>
                <View style={[styles.statusDot, {backgroundColor: getStatusColor(status)}]} />
                <Text style={[
                  styles.statusOptionText,
                  selectedApplicant?.status === status && styles.statusOptionTextActive,
                ]}>
                  {status}
                </Text>
                {selectedApplicant?.status === status && (
                  <Icon name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            
            {updatingStatus && (
              <ActivityIndicator size="small" color={colors.primary} style={{marginTop: spacing.md}} />
            )}
          </View>
        </View>
      </Modal>
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
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border + '40',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  candidateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h5,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  candidateName: {
    ...typography.h6,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  candidateEmail: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  metaText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.buttonSecondary,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  
  actionButtonText: {
    ...typography.button,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: spacing.sm,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  statusOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  statusOptionText: {
    ...typography.body1,
    color: colors.textPrimary,
    flex: 1,
  },
  statusOptionTextActive: {
    fontWeight: '600',
    color: colors.primary,
  },
});
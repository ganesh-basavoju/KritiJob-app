import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {API_BASE_URL} from '../../utils/constants';
import {storageService} from '../../services/storage.service';

interface CandidateProfile {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  title?: string;
  location?: string;
  about?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  resumes?: Array<{
    _id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }>;
  defaultResumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

interface Props {
  route: any;
  navigation: any;
}

export const CandidateProfileScreen: React.FC<Props> = ({route, navigation}) => {
  const {candidateId} = route.params;
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [candidateId]);

  const fetchProfile = async () => {
    try {
      const token = await storageService.getAccessToken();
      console.log('Fetching candidate profile for ID:', candidateId);
      console.log('API URL:', `${API_BASE_URL}/employer/candidates/${candidateId}`);
      
      const response = await fetch(`${API_BASE_URL}/employer/candidates/${candidateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      console.log('Profile fetch response:', data);
      
      if (data.success) {
        setProfile(data.data);
      } else {
        console.error('Profile fetch failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLink = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
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

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Icon name="person-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>Profile not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {profile.user?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{profile.user?.name || 'Unknown'}</Text>
          {profile.title && <Text style={styles.title}>{profile.title}</Text>}
          <Text style={styles.email}>{profile.user?.email || 'No email'}</Text>
          
          {profile.location && (
            <View style={styles.locationRow}>
              <Icon name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{profile.user?.email || 'No email'}</Text>
            </View>
            {profile.user?.phone && (
              <View style={styles.infoRow}>
                <Icon name="call-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>{profile.user.phone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bio */}
        {profile.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.bioText}>{profile.about}</Text>
            </View>
          </View>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.card}>
              <View style={styles.skillsContainer}>
                {profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Experience */}
        {profile.experience && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.card}>
              <Text style={styles.contentText}>{profile.experience}</Text>
            </View>
          </View>
        )}

        {/* Education */}
        {profile.education && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.card}>
              <Text style={styles.contentText}>{profile.education}</Text>
            </View>
          </View>
        )}

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          <View style={styles.card}>
            {profile.defaultResumeUrl && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink(profile.defaultResumeUrl)}>
                <Icon name="document-text-outline" size={20} color={colors.info} />
                <Text style={[styles.linkText, {color: colors.info}]}>View Resume</Text>
                <Icon name="open-outline" size={16} color={colors.info} />
              </TouchableOpacity>
            )}
            {profile.linkedinUrl && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink(profile.linkedinUrl)}>
                <Icon name="logo-linkedin" size={20} color={colors.info} />
                <Text style={[styles.linkText, {color: colors.info}]}>LinkedIn Profile</Text>
                <Icon name="open-outline" size={16} color={colors.info} />
              </TouchableOpacity>
            )}
            {profile.githubUrl && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => openLink(profile.githubUrl)}>
                <Icon name="logo-github" size={20} color={colors.textPrimary} />
                <Text style={styles.linkText}>GitHub Profile</Text>
                <Icon name="open-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body1,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarLargeText: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  name: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  locationText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h6,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body1,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bioText: {
    ...typography.body1,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    backgroundColor: colors.navyDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  skillText: {
    ...typography.body2,
    color: colors.white,
    fontWeight: '600',
  },
  contentText: {
    ...typography.body1,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkText: {
    ...typography.body1,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});

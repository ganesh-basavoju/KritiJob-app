// ============================================
// USER PROFILE SCREEN - ENHANCED UI
// ============================================
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import * as DocumentPicker from '@react-native-documents/picker';
import {
  fetchCandidateProfile,
  updateCandidateProfile,
  uploadAvatar,
  uploadResume,
  deleteResume,
} from '../../redux/slices/candidateSlice';
import {logout} from '../../redux/slices/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const UserProfileScreen: React.FC = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {profile, loading} = useSelector((state: RootState) => state.candidate);
  const {user} = useSelector((state: RootState) => state.auth);

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [editedAbout, setEditedAbout] = useState('');
  const [editedSkills, setEditedSkills] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedLocation, setEditedLocation] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setEditedAbout(profile.about || '');
      setEditedSkills(profile.skills?.join(', ') || '');
      setEditedPhone(profile.phone || '');
      setEditedTitle(profile.title || '');
      setEditedLocation(profile.location || '');
    }
  }, [profile]);

  const loadProfile = async () => {
    await dispatch(fetchCandidateProfile());
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const handleUploadAvatar = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      if (!asset.uri) {
        Alert.alert('Error', 'Invalid image selected');
        return;
      }

      console.log('Selected image:', asset);

      const formData = new FormData();
      formData.append('avatar', {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
      } as any);

      console.log('Uploading avatar...');
      const response = await dispatch(uploadAvatar(formData)).unwrap();
      console.log('Avatar uploaded:', response);

      await loadProfile();
      Alert.alert('Success', 'Avatar uploaded successfully');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      Alert.alert('Error', error?.message || error || 'Failed to upload avatar');
    }
  };

  const handleSaveAbout = async () => {
    try {
      await dispatch(updateCandidateProfile({about: editedAbout})).unwrap();
      setIsEditingAbout(false);
      Alert.alert('Success', 'About section updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update profile');
    }
  };

  const handleSaveSkills = async () => {
    try {
      const skillsArray = editedSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      await dispatch(updateCandidateProfile({skills: skillsArray})).unwrap();
      setIsEditingSkills(false);
      Alert.alert('Success', 'Skills updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update skills');
    }
  };

  const handleSaveContact = async () => {
    try {
      await dispatch(updateCandidateProfile({phone: editedPhone})).unwrap();
      setIsEditingContact(false);
      Alert.alert('Success', 'Contact information updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update contact information');
    }
  };

  const handleSaveTitle = async () => {
    try {
      await dispatch(updateCandidateProfile({title: editedTitle})).unwrap();
      setIsEditingTitle(false);
      Alert.alert('Success', 'Title updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update title');
    }
  };

  const handleSaveLocation = async () => {
    try {
      await dispatch(updateCandidateProfile({location: editedLocation})).unwrap();
      setIsEditingLocation(false);
      Alert.alert('Success', 'Location updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update location');
    }
  };

  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyTo: 'cachesDirectory',
      });

      if (!result || result.length === 0) {
        return;
      }

      const file = result[0];
      console.log('Selected file:', file);

      const formData = new FormData();
      formData.append('resume', {
        uri: file.fileCopyUri || file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'resume.pdf',
      } as any);

      console.log('Uploading resume...');
      const response = await dispatch(uploadResume(formData)).unwrap();
      console.log('Upload response:', response);

      await loadProfile();
      Alert.alert('Success', 'Resume uploaded successfully');
    } catch (error: any) {
      if (error?.message?.includes('cancel')) {
        return;
      }
      console.error('Resume upload error:', error);
      Alert.alert('Error', error?.message || error || 'Failed to upload resume');
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete this resume?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteResume(resumeId)).unwrap();
              await loadProfile();
              Alert.alert('Success', 'Resume deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to delete resume');
            }
          },
        },
      ],
    );
  };

  const handleOpenResume = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open resume');
    });
  };

  if (loading && !profile) {
    return <Loader />;
  }

  const profileData = profile || user;

  console.log('Profile data:', {
    profileAvatarUrl: profile?.avatarUrl,
    profileAvatar: profile?.avatar,
    userAvatar: user?.avatar,
    userAvatarUrl: user?.avatarUrl,
  });

  const getInitials = (name?: string) => {
    if (!name) return '';
    const nameParts = name.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return '';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {profile?.avatarUrl ? (
                <Image source={{uri: profile.avatarUrl}} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton} onPress={handleUploadAvatar}>
                <Icon name="camera" size={16} color={colors.navyDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{user?.name}</Text>

            {/* Title/Experience */}
            {isEditingTitle ? (
              <View style={styles.inlineEditContainer}>
                <Icon name="briefcase-outline" size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inlineInput}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="Add your title"
                  placeholderTextColor={colors.textTertiary}
                />
                <View style={styles.inlineActions}>
                  <TouchableOpacity onPress={() => setIsEditingTitle(false)}>
                    <Icon name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveTitle}>
                    <Icon name="checkmark-circle" size={20} color={colors.yellow} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : profile?.title ? (
              <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingTitle(true)}>
                <Icon name="briefcase-outline" size={16} color={colors.textSecondary} style={styles.infoIcon} />
                <Text style={styles.infoText}>{profile.title}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingTitle(true)}>
                <Icon name="briefcase-outline" size={16} color={colors.textTertiary} style={styles.infoIcon} />
                <Text style={styles.addText}>Add Title</Text>
              </TouchableOpacity>
            )}

            {/* Location */}
            {isEditingLocation ? (
              <View style={styles.inlineEditContainer}>
                <Icon name="location-outline" size={16} color={colors.textSecondary} />
                <TextInput
                  style={styles.inlineInput}
                  value={editedLocation}
                  onChangeText={setEditedLocation}
                  placeholder="Add your location"
                  placeholderTextColor={colors.textTertiary}
                />
                <View style={styles.inlineActions}>
                  <TouchableOpacity onPress={() => setIsEditingLocation(false)}>
                    <Icon name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSaveLocation}>
                    <Icon name="checkmark-circle" size={20} color={colors.yellow} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : profile?.location ? (
              <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingLocation(true)}>
                <Icon name="location-outline" size={16} color={colors.textSecondary} style={styles.infoIcon} />
                <Text style={styles.infoText}>{profile.location}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingLocation(true)}>
                <Icon name="location-outline" size={16} color={colors.textTertiary} style={styles.infoIcon} />
                <Text style={styles.addText}>Add Location</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.iconBadge}>
                <Icon name="person-outline" size={18} color={colors.yellow} />
              </View>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <TouchableOpacity onPress={() => setIsEditingAbout(!isEditingAbout)}>
              <Icon name={isEditingAbout ? "close" : "create-outline"} size={20} color={colors.yellow} />
            </TouchableOpacity>
          </View>

          {isEditingAbout ? (
            <>
              <TextInput
                style={styles.textInput}
                value={editedAbout}
                onChangeText={setEditedAbout}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
              />
              <View style={styles.editActions}>
                <TouchableOpacity onPress={() => setIsEditingAbout(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveAbout}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.sectionContent}>
              {profile?.about || 'No description added yet.'}
            </Text>
          )}
        </View>

        {/* Skills Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.iconBadge}>
                <Icon name="bulb-outline" size={18} color={colors.yellow} />
              </View>
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>
            <TouchableOpacity onPress={() => setIsEditingSkills(!isEditingSkills)}>
              <Icon name={isEditingSkills ? "close" : "create-outline"} size={20} color={colors.yellow} />
            </TouchableOpacity>
          </View>

          {isEditingSkills ? (
            <>
              <TextInput
                style={[styles.textInput, styles.phoneInput]}
                value={editedSkills}
                onChangeText={setEditedSkills}
                placeholder="Enter skills separated by commas"
                placeholderTextColor={colors.textTertiary}
              />
              <View style={styles.editActions}>
                <TouchableOpacity onPress={() => setIsEditingSkills(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveSkills}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.skillsContainer}>
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.sectionContent}>No skills added yet.</Text>
              )}
            </View>
          )}
        </View>

        {/* Resume Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.iconBadge}>
                <Icon name="document-text-outline" size={18} color={colors.yellow} />
              </View>
              <Text style={styles.sectionTitle}>Resume</Text>
            </View>
            <TouchableOpacity onPress={handleUploadResume}>
              <Icon name="add-circle" size={24} color={colors.yellow} />
            </TouchableOpacity>
          </View>

          {profile?.resumes && profile.resumes.length > 0 ? (
            <View style={styles.resumeList}>
              {profile.resumes.map((resume, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.resumeItem}
                  onPress={() => handleOpenResume(resume.url)}>
                  <View style={styles.resumeInfo}>
                    <View style={styles.resumeIconWrapper}>
                      <Icon name="document" size={24} color={colors.yellow} />
                    </View>
                    <View style={styles.resumeDetails}>
                      <Text style={styles.resumeName}>{resume.name || 'Resume.pdf'}</Text>
                      <Text style={styles.resumeDate}>
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => resume._id && handleDeleteResume(resume._id)}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Icon name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <Icon name="document-outline" size={48} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyStateText}>No resumes uploaded yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the + icon to upload your resume
              </Text>
            </View>
          )}
        </View>

        {/* Contact Information Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.iconBadge}>
                <Icon name="call-outline" size={18} color={colors.yellow} />
              </View>
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <TouchableOpacity onPress={() => setIsEditingContact(!isEditingContact)}>
              <Icon name={isEditingContact ? "close" : "create-outline"} size={20} color={colors.yellow} />
            </TouchableOpacity>
          </View>

          {isEditingContact ? (
            <>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>EMAIL</Text>
                <Text style={styles.contactValue}>{user?.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>PHONE</Text>
                <TextInput
                  style={[styles.textInput, styles.phoneInput]}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.editActions}>
                <TouchableOpacity onPress={() => setIsEditingContact(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveContact}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>EMAIL</Text>
                <View style={styles.contactValueRow}>
                  <Icon name="mail-outline" size={16} color={colors.textSecondary} style={styles.contactIcon} />
                  <Text style={styles.contactValue}>{user?.email}</Text>
                </View>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>PHONE</Text>
                <View style={styles.contactValueRow}>
                  <Icon name="call-outline" size={16} color={colors.textSecondary} style={styles.contactIcon} />
                  <Text style={styles.contactValue}>
                    {profile?.phone || 'Add Phone Number'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Activity Section */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>Activity</Text>
          
          <TouchableOpacity
            style={styles.activityCard}
            onPress={() => navigation.navigate('SavedJobsList')}>
            <View style={styles.activityIconWrapper}>
              <Icon name="bookmark" size={24} color={colors.yellow} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityCardTitle}>Saved Jobs</Text>
              <Text style={styles.activityCardSubtitle}>View your bookmarked opportunities</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.activityCard}
            onPress={() => navigation.navigate('ApplicationsList')}>
            <View style={styles.activityIconWrapper}>
              <Icon name="briefcase" size={24} color={colors.yellow} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityCardTitle}>My Applications</Text>
              <Text style={styles.activityCardSubtitle}>Track your application status</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    flex: 1,
    paddingBottom: spacing.xl * 4,
  },
  header: {
    backgroundColor: colors.backgroundSecondary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 1.5,
    marginBottom: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.navyDark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    ...typography.h1,
    fontSize: 44,
    color: colors.navyDark,
    fontWeight: '700',
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.navyDark,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.yellow,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.navyDark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    ...typography.h3,
    fontSize: 26,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingVertical: spacing.xs,
  },
  infoIcon: {
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.body1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  addText: {
    ...typography.body1,
    color: colors.textTertiary,
    fontSize: 15,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.navyDark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h5,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sectionContent: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 24,
    fontSize: 15,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillTag: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.yellow + '20',
  },
  skillText: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  contactRow: {
    marginBottom: spacing.md,
  },
  contactLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  contactValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    marginRight: spacing.sm,
  },
  contactValue: {
    ...typography.body1,
    color: colors.textPrimary,
    fontSize: 15,
  },
  textInput: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.yellow + '30',
    fontSize: 15,
  },
  phoneInput: {
    minHeight: 50,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  cancelButton: {
    ...typography.body1,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    ...typography.body1,
    color: colors.yellow,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  inlineEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.yellow + '30',
  },
  inlineInput: {
    flex: 1,
    ...typography.body1,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    fontSize: 15,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  resumeList: {
    gap: spacing.sm,
  },
  resumeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.yellow + '15',
  },
  resumeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  resumeIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.yellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeDetails: {
    flex: 1,
  },
  resumeName: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
    fontSize: 15,
  },
  resumeDate: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyStateText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontSize: 13,
  },
  activitySection: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  activityTitle: {
    ...typography.h5,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    shadowColor: colors.navyDark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activityIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.yellow + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityCardTitle: {
    ...typography.body1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs / 2,
  },
  activityCardSubtitle: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.error + '30',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl * 2,
    shadowColor: colors.error,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
    fontWeight: '700',
    fontSize: 16,
  },
});
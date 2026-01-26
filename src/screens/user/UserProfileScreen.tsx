// ============================================
// USER PROFILE SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Image, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import * as DocumentPicker from '@react-native-documents/picker';
import {fetchUserProfile, updateUserProfile, uploadAvatar, uploadResume, deleteResume} from '../../redux/slices/userSlice';
import {logout} from '../../redux/slices/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {Loader} from '../../components/common/Loader';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const UserProfileScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {profile, loading} = useSelector((state: RootState) => state.user);
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
    await dispatch(fetchUserProfile());
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
      await dispatch(updateUserProfile({ about: editedAbout })).unwrap();
      setIsEditingAbout(false);
      Alert.alert('Success', 'About section updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update profile');
    }
  };

  const handleSaveSkills = async () => {
    try {
      const skillsArray = editedSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      await dispatch(updateUserProfile({ skills: skillsArray })).unwrap();
      setIsEditingSkills(false);
      Alert.alert('Success', 'Skills updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update skills');
    }
  };

  const handleSaveContact = async () => {
    try {
      await dispatch(updateUserProfile({ phone: editedPhone })).unwrap();
      setIsEditingContact(false);
      Alert.alert('Success', 'Contact information updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update contact information');
    }
  };

  const handleSaveTitle = async () => {
    try {
      await dispatch(updateUserProfile({ title: editedTitle })).unwrap();
      setIsEditingTitle(false);
      Alert.alert('Success', 'Title updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update title');
    }
  };

  const handleSaveLocation = async () => {
    try {
      await dispatch(updateUserProfile({ location: editedLocation })).unwrap();
      setIsEditingLocation(false);
      Alert.alert('Success', 'Location updated');
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update location');
    }
  };

  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
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
      // User cancelled or error occurred
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
  
  // Debug avatar URL
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
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            {profile?.avatarUrl ? (
              <Image 
                source={{ uri: `${profile.avatarUrl}?t=${Date.now()}` }} 
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(user?.name)}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={handleUploadAvatar}
            >
              <Icon name="pencil" size={16} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user?.name}</Text>
          
          {/* Title/Experience */}
          {isEditingTitle ? (
            <View style={styles.inlineEditContainer}>
              <TextInput
                style={styles.inlineInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Add your title/experience"
                placeholderTextColor={colors.textTertiary}
              />
              <View style={styles.inlineActions}>
                <TouchableOpacity onPress={() => setIsEditingTitle(false)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveTitle}>
                  <Icon name="checkmark" size={20} color={colors.success} />
                </TouchableOpacity>
              </View>
            </View>
          ) : profile?.title ? (
            <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingTitle(true)}>
              <Icon name="briefcase-outline" size={20} color={colors.textPrimary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{profile.title}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingTitle(true)}>
              <Icon name="briefcase-outline" size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={styles.addText}>Add Title</Text>
            </TouchableOpacity>
          )}
          
          {/* Location */}
          {isEditingLocation ? (
            <View style={styles.inlineEditContainer}>
              <TextInput
                style={styles.inlineInput}
                value={editedLocation}
                onChangeText={setEditedLocation}
                placeholder="Add your location"
                placeholderTextColor={colors.textTertiary}
              />
              <View style={styles.inlineActions}>
                <TouchableOpacity onPress={() => setIsEditingLocation(false)}>
                  <Icon name="close" size={20} color={colors.error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveLocation}>
                  <Icon name="checkmark" size={20} color={colors.success} />
                </TouchableOpacity>
              </View>
            </View>
          ) : profile?.location ? (
            <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingLocation(true)}>
              <Icon name="location-outline" size={20} color={colors.textPrimary} style={styles.infoIcon} />
              <Text style={styles.infoText}>{profile.location}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.infoItem} onPress={() => setIsEditingLocation(true)}>
              <Icon name="location-outline" size={20} color={colors.textSecondary} style={styles.infoIcon} />
              <Text style={styles.addText}>Add Location</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* About Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={() => setIsEditingAbout(!isEditingAbout)}>
              <Icon name="pencil" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {isEditingAbout ? (
            <View>
              <TextInput
                style={styles.textInput}
                value={editedAbout}
                onChangeText={setEditedAbout}
                placeholder="Add a description about yourself"
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
            </View>
          ) : (
            <Text style={styles.sectionContent}>
              {profile?.about || 'No description added yet.'}
            </Text>
          )}
        </View>

        {/* Skills Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity onPress={() => setIsEditingSkills(!isEditingSkills)}>
              <Icon name="pencil" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {isEditingSkills ? (
            <View>
              <TextInput
                style={styles.textInput}
                value={editedSkills}
                onChangeText={setEditedSkills}
                placeholder="Enter skills separated by commas"
                placeholderTextColor={colors.textTertiary}
                multiline
              />
              <View style={styles.editActions}>
                <TouchableOpacity onPress={() => setIsEditingSkills(false)}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveSkills}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
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
            <Text style={styles.sectionTitle}>Resume</Text>
            <TouchableOpacity onPress={handleUploadResume}>
              <Icon name="add-circle" size={24} color={colors.yellow} />
            </TouchableOpacity>
          </View>
          
          {profile?.resumes && profile.resumes.length > 0 ? (
            <View style={styles.resumeList}>
              {profile.resumes.map((resume, index) => (
                <View key={resume._id || index} style={styles.resumeItem}>
                  <TouchableOpacity 
                    style={styles.resumeInfo}
                    onPress={() => handleOpenResume(resume.url)}
                  >
                    <Icon name="document-text" size={24} color={colors.yellow} />
                    <View style={styles.resumeDetails}>
                      <Text style={styles.resumeName} numberOfLines={1}>
                        {resume.name || 'Resume.pdf'}
                      </Text>
                      <Text style={styles.resumeDate}>
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteResume(resume._id)}>
                    <Icon name="trash-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="document-outline" size={48} color={colors.textTertiary} />
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
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TouchableOpacity onPress={() => setIsEditingContact(!isEditingContact)}>
              <Icon name="pencil" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {isEditingContact ? (
            <View>
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
                  placeholder="Add Phone Number"
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
            </View>
          ) : (
            <View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>EMAIL</Text>
                <Text style={styles.contactValue}>{user?.email}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>PHONE</Text>
                <Text style={styles.contactValue}>
                  {profile?.phone || 'Add Phone Number'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color={colors.error} />
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
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarText: {
    ...typography.h1,
    fontSize: 40,
    color: colors.navyDark,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.yellow,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoIcon: {
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  addText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
  },
  sectionContent: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 22,
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
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  skillText: {
    ...typography.body2,
    color: colors.textPrimary,
  },
  contactRow: {
    marginBottom: spacing.md,
  },
  contactLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  contactValue: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  textInput: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  phoneInput: {
    minHeight: 44,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    ...typography.body1,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveButton: {
    ...typography.body1,
    color: colors.yellow,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
  },
  inlineEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  inlineInput: {
    flex: 1,
    ...typography.body1,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  resumeList: {
    gap: spacing.md,
  },
  resumeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  resumeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  resumeDetails: {
    flex: 1,
  },
  resumeName: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  resumeDate: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyStateSubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

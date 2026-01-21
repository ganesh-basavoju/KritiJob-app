// ============================================
// USER PROFILE SCREEN
// ============================================

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fetchUserProfile} from '../../redux/slices/userSlice';
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    await dispatch(fetchUserProfile());
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  if (loading && !profile) {
    return <Loader />;
  }

  const profileData = profile || user;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{profileData?.name}</Text>
          <Text style={styles.email}>{profileData?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          {profile?.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{profile.location}</Text>
            </View>
          )}

          {profile?.experience && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{profile.experience}</Text>
            </View>
          )}

          {profile?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
          )}

          {profile?.bio && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bio</Text>
              <Text style={styles.infoValue}>{profile.bio}</Text>
            </View>
          )}
        </View>

        {profile?.skills && profile.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {profile.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
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
  content: {
    padding: spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: colors.navyDark,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.body2,
    color: colors.textPrimary,
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
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  menuArrow: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
});

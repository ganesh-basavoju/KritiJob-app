// ============================================
// SETTINGS SCREEN
// ============================================

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from '../../redux/slices/notificationsSlice';
import {logout} from '../../redux/slices/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const SettingsScreen: React.FC<any> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {settings} = useSelector((state: RootState) => state.notifications);
  const {user} = useSelector((state: RootState) => state.auth);

  const [jobAlerts, setJobAlerts] = useState(settings.jobAlerts);
  const [applicationUpdates, setApplicationUpdates] = useState(
    settings.applicationUpdates,
  );
  const [newApplicants, setNewApplicants] = useState(settings.newApplicants);

  useEffect(() => {
    dispatch(fetchNotificationSettings());
  }, []);

  useEffect(() => {
    setJobAlerts(settings.jobAlerts);
    setApplicationUpdates(settings.applicationUpdates);
    setNewApplicants(settings.newApplicants);
  }, [settings]);

  const handleSaveSettings = async () => {
    await dispatch(
      updateNotificationSettings({
        jobAlerts,
        applicationUpdates,
        newApplicants,
      }),
    );
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          {user?.role === 'user' && (
            <>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Job Alerts</Text>
                <Switch
                  value={jobAlerts}
                  onValueChange={setJobAlerts}
                  trackColor={{false: colors.border, true: colors.yellow}}
                  thumbColor={colors.white}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Application Updates</Text>
                <Switch
                  value={applicationUpdates}
                  onValueChange={setApplicationUpdates}
                  trackColor={{false: colors.border, true: colors.yellow}}
                  thumbColor={colors.white}
                />
              </View>
            </>
          )}

          {user?.role === 'employer' && (
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>New Applicants</Text>
              <Switch
                value={newApplicants}
                onValueChange={setNewApplicants}
                trackColor={{false: colors.border, true: colors.yellow}}
                thumbColor={colors.white}
              />
            </View>
          )}

          <Button
            title="Save Preferences"
            onPress={handleSaveSettings}
            style={styles.saveButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Change Password</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Terms of Service</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={[styles.menuText, styles.dangerText]}>Delete Account</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.version}>Version 1.0.0</Text>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    ...typography.body1,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.md,
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
  dangerText: {
    color: colors.error,
  },
  menuArrow: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: spacing.lg,
  },
});

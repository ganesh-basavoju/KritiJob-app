// ============================================
// ROLE SELECTION SCREEN
// ============================================

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import {spacing, borderRadius, shadows} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {Button} from '../../components/common/Button';
import {UserRole} from '../../types';

export const RoleSelectionScreen: React.FC<any> = ({navigation}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Register', {role: selectedRole});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join KritiJob</Text>
        <Text style={styles.subtitle}>Choose how you want to continue</Text>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'user' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('user')}
          activeOpacity={0.7}>
          <Icon name="person" size={48} color={colors.yellow} />
          <Text style={styles.roleTitle}>I'm looking for a job</Text>
          <Text style={styles.roleDescription}>
            Browse jobs, apply, and track your applications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'employer' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('employer')}
          activeOpacity={0.7}>
          <Icon name="briefcase" size={48} color={colors.yellow} />
          <Text style={styles.roleTitle}>I'm hiring</Text>
          <Text style={styles.roleDescription}>
            Post jobs and find the best candidates
          </Text>
        </TouchableOpacity>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          style={styles.continueButton}
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.md,
  },
  roleCardSelected: {
    borderColor: colors.yellow,
    backgroundColor: colors.backgroundTertiary,
  },
  roleIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  roleTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  roleDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: spacing.lg,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  loginTextBold: {
    color: colors.yellow,
    fontWeight: '600',
  },
});

// ============================================
// LOGIN SCREEN
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { LoginForm } from '../../components/auth/LoginForm';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const LoginScreen: React.FC<any> = ({
  navigation,
  visible = true,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.logo}>KritiJob</Text>
              <Text style={styles.subtitle}>Find your dream job</Text>
            </View>

            <LoginForm
              onSuccess={() => {
                // Success logic if any, though login slice handles navigation via AppNavigator usually
                // but in this app it seems we just want to close the modal if it's a modal
                onClose?.();
              }}
              onRegisterPress={() => {
                onClose?.();
                navigation.navigate('Auth', { screen: 'RoleSelection' });
              }}
              onForgotPasswordPress={() => {
                onClose?.();
                navigation.navigate('Auth', { screen: 'ForgotPassword' });
              }}

            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: colors.background,
    borderRadius: 32,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 1,
    backgroundColor: colors.backgroundSecondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '300',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});




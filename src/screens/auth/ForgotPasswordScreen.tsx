// ============================================
// FORGOT PASSWORD SCREEN
// ============================================

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {authApi} from '../../api/auth.api';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {ErrorText} from '../../components/common/ErrorText';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {validateEmail} from '../../utils/validation';

export const ForgotPasswordScreen: React.FC<any> = ({navigation}) => {
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.forgotPassword(data.email);
      setSuccess(true);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to send reset email. Please try again later.';
      setError(errorMessage);
      Alert.alert(
        'Error',
        errorMessage,
        [{text: 'OK'}],
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Icon name="lock-closed-outline" size={64} color={colors.yellow} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset
            your password.
          </Text>
        </View>

        {!success && (
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                validate: value =>
                  validateEmail(value) || 'Invalid email address',
              }}
              render={({field: {onChange, value}, fieldState: {error}}) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={error?.message}
                />
              )}
            />

            {error && <ErrorText message={error} />}

            <Button
              title="Send Reset Link"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Remember your password?{' '}
            <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  backButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  form: {
    marginTop: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.xl,
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

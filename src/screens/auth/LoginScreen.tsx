// ============================================
// LOGIN SCREEN
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
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import {login} from '../../redux/slices/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {ErrorText} from '../../components/common/ErrorText';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {validateEmail, validatePassword} from '../../utils/validation';

export const LoginScreen: React.FC<any> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error} = useSelector((state: RootState) => state.auth);
  const {control, handleSubmit} = useForm();

  const onSubmit = async (data: any) => {
    await dispatch(login({email: data.email, password: data.password}));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>KritiJob</Text>
          <Text style={styles.subtitle}>Find your dream job</Text>
        </View>

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

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              validate: value =>
                validatePassword(value) ||
                'Password must be at least 6 characters',
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={error?.message}
              />
            )}
          />

          {error && <ErrorText message={error} />}

          <TouchableOpacity
            style={styles.forgotPasswordLink}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.loginButton}
          />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('RoleSelection')}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    ...typography.h1,
    color: colors.yellow,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  form: {
    marginTop: spacing.lg,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },
  forgotPasswordText: {
    ...typography.body2,
    color: colors.yellow,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  registerTextBold: {
    color: colors.yellow,
    fontWeight: '600',
  },
});

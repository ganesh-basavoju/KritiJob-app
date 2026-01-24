// ============================================
// REGISTER SCREEN
// ============================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import {register} from '../../redux/slices/authSlice';
import {AppDispatch, RootState} from '../../redux/store';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {ErrorText} from '../../components/common/ErrorText';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {validateEmail, validatePassword} from '../../utils/validation';
import {UserRole} from '../../types';

export const RegisterScreen: React.FC<any> = ({navigation, route}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading, error} = useSelector((state: RootState) => state.auth);
  const {control, handleSubmit, watch} = useForm();
  const role: UserRole = route.params?.role || 'candidate';

  const password = watch('password');

  const onSubmit = async (data: any) => {
    await dispatch(
      register({
        email: data.email,
        password: data.password,
        name: data.name,
        role,
        phone: data.phone,
      }),
    );
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            {role === 'candidate'
              ? 'Start your job search journey'
              : 'Find the perfect candidates'}
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            rules={{required: 'Name is required'}}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={value}
                onChangeText={onChange}
                error={error?.message}
              />
            )}
          />

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
            name="phone"
            render={({field: {onChange, value}}) => (
              <Input
                label="Phone (Optional)"
                placeholder="Enter your phone number"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
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

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'Passwords do not match',
            }}
            render={({field: {onChange, value}, fieldState: {error}}) => (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={error?.message}
              />
            )}
          />

          {error && <ErrorText message={error} />}

          <Button
            title="Sign Up"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.signupButton}
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
    marginBottom: spacing.sm,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  form: {
    marginTop: spacing.md,
  },
  signupButton: {
    marginTop: spacing.md,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
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

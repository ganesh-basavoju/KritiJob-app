import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { login } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorText } from '../common/ErrorText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { validateEmail, validatePassword } from '../../utils/validation';

interface LoginFormProps {
    onSuccess?: () => void;
    onRegisterPress?: () => void;
    onForgotPasswordPress?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    onRegisterPress,
    onForgotPasswordPress,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const { control, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        const result = await dispatch(login({ email: data.email, password: data.password }));
        if (login.fulfilled.match(result)) {
            onSuccess?.();
        }
    };

    return (
        <View style={styles.form}>
            <Controller
                control={control}
                name="email"
                rules={{
                    required: 'Email is required',
                    validate: value => validateEmail(value) || 'Invalid email address',
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                        validatePassword(value) || 'Password must be at least 6 characters',
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
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

            {onForgotPasswordPress && (
                <TouchableOpacity
                    style={styles.forgotPasswordLink}
                    onPress={onForgotPasswordPress}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            )}

            {error && <ErrorText message={error} />}

            <Button
                title="Login"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={styles.loginButton}
            />

            {onRegisterPress && (
                <TouchableOpacity style={styles.registerLink} onPress={onRegisterPress}>
                    <Text style={styles.registerText}>
                        Don't have an account?{' '}
                        <Text style={styles.registerTextBold}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        width: '100%',
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginBottom: spacing.md,
    },
    forgotPasswordText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
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
        color: colors.primary,
        fontWeight: '700',
    },
});


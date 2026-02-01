import React, { useState } from 'react';
import { View, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../api/authSlice';
import { useRegisterUserMutation } from '../api/authApi';
import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';
import { Typography } from '../components/ui/Typography';
import { GradientButton } from '../components/ui/GradientButton';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();

  const isDesktop = width >= 768;
  const formWidth = isDesktop ? 450 : '100%';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const [register, { isLoading }] = useRegisterUserMutation();

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials({ user: result.user, token: result.token }));
      router.replace('/smartpark');
    } catch (err) {
      setError(err.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemeToggle />
        </View>

        <View style={[styles.formWrapper, { width: formWidth, alignSelf: 'center' }]}>
          <View style={styles.titleSection}>
            <Typography variant="h1" style={{ color: colors.text }}>Create Account</Typography>
            <Typography variant="body" style={{ color: colors.textSecondary }}>Join Parkivo today</Typography>
          </View>

          <View style={styles.inputSection}>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              icon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
            />
          </View>

          {error ? <Typography variant="caption" style={[styles.errorText, { color: colors.error }]}>{error}</Typography> : null}

          <GradientButton
            title={isLoading ? "Creating Account..." : "Sign Up"}
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Typography variant="body" style={{ color: colors.textSecondary }}>Already have an account? </Typography>
            <Pressable onPress={() => router.push('/login')}>
              <Typography variant="body" style={[styles.loginLink, { color: colors.primary }]}>Login</Typography>
            </Pressable>
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.xl,
  },
  formWrapper: {
    gap: SPACING.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  inputSection: {
    gap: SPACING.m,
  },
  errorText: {
    textAlign: 'center',
  },
  button: {
    marginTop: SPACING.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.l,
  },
  loginLink: {
    fontWeight: '600',
  },
  bottomSpacer: {
    height: SPACING.xxxl,
  },
});

export default Register;
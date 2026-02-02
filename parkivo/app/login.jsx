import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLoginUserMutation } from '../api/authApi.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../api/authSlice';
import { SPACING, RADIUS, ELEVATION } from '../constants/AppTheme';
import { Typography } from '../components/ui/Typography';
import { GradientButton } from '../components/ui/GradientButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Input } from '../components/ui/Input';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
  const dispatch = useDispatch();

  const isDesktop = width >= 768;
  const formWidth = isDesktop ? 450 : '100%';

  const handleLogin = async () => {
    try {
      const result = await loginUser({
        username: username.trim(),
        password: password,
      }).unwrap();

      dispatch(setCredentials(result));
      router.replace('/smartpark');
    } catch (err) {
      console.error('Login failed:', err);
      const errorMsg = err?.data?.message || err?.data?.error || "Invalid username or password";
      alert(errorMsg);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={theme === 'dark' ? ['#000000', '#0A0A0A', '#1A1A1A'] : ['#FFFFFF', '#F9FAFB', '#F3F4F6']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.centerWrapper, { maxWidth: 1200, alignSelf: 'center', width: '100%' }]}>
              {/* Back Button & Theme Toggle */}
              <View style={styles.header}>
                <View style={styles.headerRow}>
                  <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                    <Typography variant="body" style={[styles.backText, { color: colors.textSecondary }]}>Back</Typography>
                  </Pressable>
                  <ThemeToggle />
                </View>
              </View>

              <View style={[styles.formWrapper, { width: formWidth, alignSelf: 'center' }]}>
                {/* Logo/Brand */}
                <View style={styles.logoContainer}>
                  <View style={[styles.logoBadge, { backgroundColor: colors.glass, borderColor: colors.border }]}>
                    <Ionicons name="car-sport" size={32} color={colors.primary} />
                  </View>
                  <Typography variant="h1" style={[styles.title, { color: colors.text }]}>Welcome Back</Typography>
                  <Typography variant="body" style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Sign in to continue to Parkivo
                  </Typography>
                </View>

                {/* Login Form */}
                <GlassCard style={styles.formCard}>
                  <View style={styles.formContent}>
                    <Input
                      placeholder="Username"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      icon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
                      style={styles.input}
                    />

                    <Input
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
                      style={styles.input}
                    />

                    {isError && (
                      <View style={[styles.errorContainer, { borderColor: colors.error }]}>
                        <Ionicons name="alert-circle" size={16} color={colors.error} />
                        <Typography variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
                          {error?.data?.message || 'Login failed. Please try again.'}
                        </Typography>
                      </View>
                    )}

                    <GradientButton
                      title={isLoading ? 'Signing in...' : 'Sign In'}
                      onPress={handleLogin}
                      disabled={isLoading}
                      style={styles.loginButton}
                      icon={<Ionicons name="log-in" size={20} color="#FFFFFF" />}
                    />

                    {/* Divider */}
                    <View style={styles.divider}>
                      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                      <Typography variant="caption" style={[styles.dividerText, { color: colors.textTertiary }]}>OR</Typography>
                      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    </View>

                    {/* Register Link */}
                    <Pressable style={styles.registerRow} onPress={() => router.push('/register')}>
                      <Typography variant="body" style={[styles.registerText, { color: colors.textSecondary }]}>
                        Don't have an account?{' '}
                      </Typography>
                      <Typography variant="body" style={[styles.registerLink, { color: colors.primary }]}>
                        Create Account
                      </Typography>
                    </Pressable>
                  </View>
                </GlassCard>
              </View>
            </View>

            {/* Bottom Spacer */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
    ...ELEVATION.glow,
  },
  title: {
    marginBottom: SPACING.s,
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    padding: SPACING.xl,
  },
  formContent: {
    gap: SPACING.l,
  },
  input: {
    marginBottom: SPACING.s,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
  },
  loginButton: {
    marginTop: SPACING.m,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.m,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.m,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerLink: {
    fontWeight: '600',
  },
  bottomSpacer: {
    height: SPACING.xxxl,
  },
});

export default Login;

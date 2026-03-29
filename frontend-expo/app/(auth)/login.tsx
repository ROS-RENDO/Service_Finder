import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(email.trim(), password);
      const { token, user } = res.data;
      await login(token, user);
      // Navigation handled by AuthGate in _layout.tsx
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>✦</Text>
            </View>
            <Text style={styles.appName}>Service Finder</Text>
            <Text style={styles.tagline}>Find & book trusted professionals</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.registerBtnText}>
                Don't have an account?{' '}
                <Text style={styles.registerBtnHighlight}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.lg },

  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoContainer: {
    width: 72, height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoIcon: { fontSize: 32, color: '#fff' },
  appName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.dark.text, marginBottom: 4 },
  tagline: { fontSize: FontSize.sm, color: Colors.dark.textSub },

  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.dark.text, marginBottom: 4 },
  subtitle: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: Spacing.lg },

  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.dark.border,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: {
    flex: 1, paddingVertical: 14,
    fontSize: FontSize.md, color: Colors.dark.text,
  },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: Spacing.lg },
  forgotText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.dark.border },
  dividerText: { color: Colors.dark.textMuted, paddingHorizontal: Spacing.sm, fontSize: FontSize.sm },

  registerBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  registerBtnText: { fontSize: FontSize.sm, color: Colors.dark.textSub },
  registerBtnHighlight: { color: Colors.primary, fontWeight: '700' },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { authApi } from '@/lib/api/auth';

type Step = 'email' | 'verify' | 'reset';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email.trim()) { Alert.alert('Error', 'Please enter your email'); return; }
    setLoading(true);
    try {
      await authApi.requestReset(email.trim());
      Alert.alert('Email Sent', 'Check your inbox for a verification code');
      setStep('verify');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) { Alert.alert('Error', 'Please enter the code'); return; }
    setLoading(true);
    try {
      const res = await authApi.verifyCode(email.trim(), code.trim());
      if (res.data.valid) setStep('reset');
      else Alert.alert('Error', 'Invalid or expired code');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Invalid code');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) { Alert.alert('Error', 'Please fill all fields'); return; }
    if (newPassword !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (newPassword.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(email.trim(), code.trim(), newPassword);
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'Sign In', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Reset failed');
    } finally { setLoading(false); }
  };

  const stepTitles = { email: 'Forgot Password', verify: 'Enter Code', reset: 'New Password' };
  const stepSubtitles = {
    email: "Enter your email and we'll send you a reset code",
    verify: `Enter the 6-digit code sent to ${email}`,
    reset: 'Create your new secure password',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => step === 'email' ? router.back() : setStep(step === 'verify' ? 'email' : 'verify')} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Progress Steps */}
          <View style={styles.progress}>
            {['email', 'verify', 'reset'].map((s, i) => (
              <React.Fragment key={s}>
                <View style={[styles.progressDot, (step === s || (i < ['email','verify','reset'].indexOf(step))) && styles.progressDotActive]} />
                {i < 2 && <View style={[styles.progressLine, i < ['email','verify','reset'].indexOf(step) && styles.progressLineActive]} />}
              </React.Fragment>
            ))}
          </View>

          <Text style={styles.title}>{stepTitles[step]}</Text>
          <Text style={styles.subtitle}>{stepSubtitles[step]}</Text>

          <View style={styles.card}>
            {step === 'email' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>✉</Text>
                  <TextInput
                    style={styles.input} placeholder="you@example.com"
                    placeholderTextColor={Colors.dark.textMuted} value={email}
                    onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            {step === 'verify' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Verification Code</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔢</Text>
                  <TextInput
                    style={styles.input} placeholder="123456"
                    placeholderTextColor={Colors.dark.textMuted} value={code}
                    onChangeText={setCode} keyboardType="number-pad" maxLength={6}
                  />
                </View>
              </View>
            )}

            {step === 'reset' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input} placeholder="Min 8 characters"
                      placeholderTextColor={Colors.dark.textMuted} value={newPassword}
                      onChangeText={setNewPassword} secureTextEntry
                    />
                  </View>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input} placeholder="Repeat password"
                      placeholderTextColor={Colors.dark.textMuted} value={confirmPassword}
                      onChangeText={setConfirmPassword} secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={step === 'email' ? handleRequestReset : step === 'verify' ? handleVerifyCode : handleResetPassword}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={styles.btnText}>
                  {step === 'email' ? 'Send Code' : step === 'verify' ? 'Verify Code' : 'Reset Password'}
                </Text>
              )}
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
  scroll: { flexGrow: 1, padding: Spacing.lg },
  backBtn: { marginBottom: Spacing.xl },
  backText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },

  progress: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.dark.border },
  progressDotActive: { backgroundColor: Colors.primary },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.dark.border },
  progressLineActive: { backgroundColor: Colors.primary },

  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.dark.text, marginBottom: 4 },
  subtitle: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: Spacing.xl },

  card: {
    backgroundColor: Colors.dark.card, borderRadius: Radius.xl, padding: Spacing.xl,
    borderWidth: 1, borderColor: Colors.dark.border,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.surface,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.dark.border, paddingHorizontal: Spacing.md,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, fontSize: FontSize.md, color: Colors.dark.text },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 15,
    alignItems: 'center', marginTop: Spacing.sm,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

const ROLES = [
  { value: 'customer', label: '🏠 Customer', desc: 'Book professional services' },
  { value: 'company_admin', label: '🏢 Company', desc: 'Manage your service business' },
  { value: 'staff', label: '👷 Staff', desc: 'Work as a service professional' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.register({ fullName: fullName.trim(), email: email.trim(), password, phone: phone.trim() || undefined, role });
      const { token, user } = res.data;
      await login(token, user);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join thousands of happy customers</Text>
          </View>

          <View style={styles.card}>
            {/* Role Selector */}
            <Text style={styles.sectionLabel}>I am a...</Text>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.roleCard, role === r.value && styles.roleCardActive]}
                  onPress={() => setRole(r.value)}
                >
                  <Text style={styles.roleEmoji}>{r.label.split(' ')[0]}</Text>
                  <Text style={[styles.roleLabel, role === r.value && styles.roleLabelActive]}>
                    {r.label.split(' ')[1]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Fields */}
            {[
              { label: 'Full Name *', icon: '👤', value: fullName, set: setFullName, placeholder: 'John Doe', type: 'default' },
              { label: 'Email Address *', icon: '✉', value: email, set: setEmail, placeholder: 'you@example.com', type: 'email-address' },
              { label: 'Phone (optional)', icon: '📱', value: phone, set: setPhone, placeholder: '+1 234 567 8900', type: 'phone-pad' },
            ].map((field) => (
              <View style={styles.inputGroup} key={field.label}>
                <Text style={styles.label}>{field.label}</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>{field.icon}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.dark.textMuted}
                    value={field.value}
                    onChangeText={field.set}
                    keyboardType={field.type as any}
                    autoCapitalize={field.type === 'default' ? 'words' : 'none'}
                  />
                </View>
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Min 8 characters"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkHighlight}>Sign In</Text>
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
  scroll: { flexGrow: 1, padding: Spacing.lg },

  header: { marginBottom: Spacing.xl },
  backBtn: { marginBottom: Spacing.md },
  backText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '600' },
  title: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.dark.text, marginBottom: 4 },
  subtitle: { fontSize: FontSize.sm, color: Colors.dark.textSub },

  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  sectionLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginBottom: Spacing.sm },
  roleRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  roleCard: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}22` },
  roleEmoji: { fontSize: 22, marginBottom: 4 },
  roleLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.dark.textSub },
  roleLabelActive: { color: Colors.primary },

  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dark.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.dark.border, paddingHorizontal: Spacing.md,
  },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, fontSize: FontSize.md, color: Colors.dark.text },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 18 },

  btn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 15,
    alignItems: 'center', marginTop: Spacing.sm,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },

  loginLink: { alignItems: 'center', marginTop: Spacing.lg },
  loginLinkText: { fontSize: FontSize.sm, color: Colors.dark.textSub },
  loginLinkHighlight: { color: Colors.primary, fontWeight: '700' },
});

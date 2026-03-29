import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

export default function CustomerProfile() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/api/users/me', { fullName, phone });
      Alert.alert('Success', 'Profile updated!');
      setEditing(false);
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const menuItems = [
    { icon: '📅', label: 'My Bookings', onPress: () => router.push('/(customer)/booking/list') },
    { icon: '💬', label: 'Messages', onPress: () => router.push('/(customer)/chat') },
    { icon: '🔔', label: 'Notifications', onPress: () => router.push('/(customer)/notifications') },
    { icon: '💳', label: 'Payments', onPress: () => router.push('/(customer)/payment') },
    { icon: '⭐', label: 'My Reviews', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editText}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{(user?.fullName || 'U')[0].toUpperCase()}</Text>
          </View>
          {editing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.editInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor={Colors.dark.textMuted}
              />
              <TextInput
                style={styles.editInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                placeholderTextColor={Colors.dark.textMuted}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role || 'customer'}</Text>
              </View>
            </>
          )}
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.menuSection, { marginTop: 0 }]}>
          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.logoutLabel}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  backText: { fontSize: 24, color: Colors.dark.text },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text },
  editText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '600' },
  avatarSection: { alignItems: 'center', padding: Spacing.xl },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md, shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  avatarText: { fontSize: FontSize.xxxl, fontWeight: '800', color: '#fff' },
  userName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.dark.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 4 },
  roleBadge: {
    backgroundColor: `${Colors.primary}22`, paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: Radius.full, marginTop: Spacing.sm,
  },
  roleText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700', textTransform: 'capitalize' },
  editForm: { width: '100%', gap: Spacing.sm, marginTop: Spacing.md },
  editInput: {
    backgroundColor: Colors.dark.card, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.dark.border, padding: Spacing.md, color: Colors.dark.text, fontSize: FontSize.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  menuSection: { margin: Spacing.lg, backgroundColor: Colors.dark.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.dark.border, overflow: 'hidden' },
  menuTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.textMuted, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.border },
  menuIcon: { fontSize: 20, marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.dark.text, fontWeight: '500' },
  menuChevron: { fontSize: 20, color: Colors.dark.textMuted },
  logoutItem: { borderTopWidth: 0 },
  logoutLabel: { flex: 1, fontSize: FontSize.md, color: Colors.danger, fontWeight: '600' },
});

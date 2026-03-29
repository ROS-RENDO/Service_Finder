import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

export default function StaffProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const menuItems = [
    { icon: '📅', label: 'My Schedule', onPress: () => router.push('/(staff)/schedule') },
    { icon: '🏖', label: 'Time Off', onPress: () => router.push('/(staff)/time-off') },
    { icon: '💰', label: 'Earnings', onPress: () => router.push('/(staff)/earnings') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{(user?.fullName || 'S')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'Staff Member'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || 'staff'}</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Staff Controls</Text>
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
  avatarSection: { alignItems: 'center', padding: Spacing.xl },
  avatarCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: FontSize.xxxl, fontWeight: '800', color: '#fff' },
  userName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.dark.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 4 },
  roleBadge: {
    backgroundColor: `${Colors.accent}22`, paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: Radius.full, marginTop: Spacing.sm,
  },
  roleText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '700', textTransform: 'capitalize' },
  menuSection: { margin: Spacing.lg, backgroundColor: Colors.dark.card, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.dark.border, overflow: 'hidden' },
  menuTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.textMuted, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.border },
  menuIcon: { fontSize: 20, marginRight: Spacing.md },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.dark.text, fontWeight: '500' },
  menuChevron: { fontSize: 20, color: Colors.dark.textMuted },
  logoutItem: { borderTopWidth: 0 },
  logoutLabel: { flex: 1, fontSize: FontSize.md, color: Colors.danger, fontWeight: '600' },
});

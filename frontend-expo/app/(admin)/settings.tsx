import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, TextInput, Alert, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { useSidebar } from './_layout';

const theme = {
  surface: '#f7f9fb',
  onSurface: '#191c1e',
  onSurfaceVariant: '#43474e',
  primary: '#002045',
  onPrimary: '#ffffff',
  primaryContainer: '#1a365d',
  onPrimaryContainer: '#86a0cd',
  secondaryContainer: '#d5e3fc',
  onSecondaryContainer: '#57657a',
  onSecondaryFixedVariant: '#3a485b',
  tertiaryContainer: '#003a55',
  outline: '#74777f',
  outlineVariant: '#c4c6cf',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

const TABS = ['Financials', 'Integrations', 'Feature Flags'];

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState('Financials');
  const [commission, setCommission] = useState('15');
  const [taxRate, setTaxRate] = useState('8');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => { await logout(); router.replace('/(auth)/login'); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3FMMzjCOh8P29mhpUjcaTy4rin0NQBOIM6o_Dgn4VaIZTCipc1I5fBLkTjvh7KSgAOvtcKCOYjuxTZUJW_2T9TJZM8iqderVDdqzULD5txgsnlUUg0d024oNovPD3uOhgnvq9g478x3PX1Bu-6lzw2InTLXCnbqeavgOz_IOImys-ikcKc2oDhZ4fZuMSKNmQb1yAyD8pal2hEunqfHQjlmO0UC4HktD7y2NkjRL5D5OZIPjKjHH8HOLIuuJviYsk0VyLHxVYb8c' }}
              style={styles.avatarImg}
            />
          </View>
          <Text style={styles.headerTitle}>Platform Settings</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, activeTab === tab ? styles.tabPillActive : styles.tabPillInactive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabPillTxt, activeTab === tab ? { color: theme.onPrimary } : { color: theme.onSurfaceVariant }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Financials Tab */}
        {activeTab === 'Financials' && (
          <>
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardIconBox}>
                  <MaterialIcons name="payments" size={22} color={theme.onSecondaryContainer} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Global Financials</Text>
                  <Text style={styles.cardSub}>Manage platform-wide commission and tax structures.</Text>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Global Commission %</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={commission}
                    onChangeText={setCommission}
                    keyboardType="numeric"
                    placeholder="15"
                    placeholderTextColor={theme.outline}
                  />
                  <Text style={styles.inputSuffix}>%</Text>
                </View>
                <Text style={styles.fieldHint}>Applied to all service transactions across the platform.</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Global Tax Rate %</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={taxRate}
                    onChangeText={setTaxRate}
                    keyboardType="numeric"
                    placeholder="8"
                    placeholderTextColor={theme.outline}
                  />
                  <Text style={styles.inputSuffix}>%</Text>
                </View>
                <Text style={styles.fieldHint}>Standard VAT or Sales Tax rate applied during checkout.</Text>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert('Saved', 'Financial settings saved.')}>
                <Text style={styles.saveBtnTxt}>Save Changes</Text>
              </TouchableOpacity>
            </View>

            {/* Bento Stats */}
            <View style={styles.bentoRow}>
              <View style={styles.bentoCardLight}>
                <MaterialIcons name="trending-up" size={24} color={theme.tertiaryContainer} />
                <View>
                  <Text style={styles.bentoStatLabel}>TOTAL REV. SHARE</Text>
                  <Text style={styles.bentoStatValue}>$12.4k</Text>
                </View>
              </View>
              <View style={styles.bentoCardDark}>
                <MaterialIcons name="account-balance" size={24} color={theme.onPrimaryContainer} />
                <View>
                  <Text style={[styles.bentoStatLabel, { color: 'rgba(255,255,255,0.6)' }]}>TAX COLLECTED</Text>
                  <Text style={[styles.bentoStatValue, { color: theme.onPrimary }]}>$2.8k</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Integrations Tab */}
        {activeTab === 'Integrations' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>API Integrations</Text>
            <View style={styles.integrationRow}>
              <View style={styles.integrationIconBox}>
                <Text style={styles.integrationLogo}>STRIPE</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.integrationTitle}>Stripe Secret Key</Text>
                <TextInput
                  style={styles.integrationInput}
                  value="sk_test_••••••••••••"
                  secureTextEntry
                  placeholderTextColor={theme.outline}
                />
                <Text style={styles.fieldHint}>Handles global payment processing and payouts.</Text>
              </View>
            </View>
          </View>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'Feature Flags' && (
          <View style={styles.featureFlagCard}>
            <Text style={styles.flagSectionTitle}>PLATFORM STATUS</Text>
            <View style={styles.flagRow}>
              <View style={styles.flagLeft}>
                <MaterialIcons name="bolt" size={22} color={theme.primary} />
                <Text style={styles.flagName}>Maintenance Mode</Text>
              </View>
              <Switch
                value={maintenanceMode}
                onValueChange={setMaintenanceMode}
                trackColor={{ false: theme.outlineVariant, true: theme.primary }}
                thumbColor={theme.onPrimary}
              />
            </View>
          </View>
        )}

        {/* Logout always visible */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={18} color={theme.error} />
          <Text style={styles.logoutTxt}>Sign Out of Admin Console</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard' as any)}>
          <MaterialIcons name="dashboard" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/users' as any)}>
          <MaterialIcons name="group" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/companies' as any)}>
          <MaterialIcons name="business" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/content' as any)}>
          <MaterialIcons name="article" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Content</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
            <MaterialIcons name="settings" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14, backgroundColor: theme.surface,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.primary, letterSpacing: -0.5 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: theme.secondaryContainer },
  avatarImg: { width: '100%', height: '100%' },

  tabRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.2)' },
  tabScroll: { paddingHorizontal: 20, gap: 8 },
  tabPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  tabPillActive: { backgroundColor: theme.primary },
  tabPillInactive: { backgroundColor: theme.surfaceContainerHigh },
  tabPillTxt: { fontSize: 13, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },

  card: { backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 24 },
  cardIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.primary, marginBottom: 2 },
  cardSub: { fontSize: 12, color: theme.onSurfaceVariant, lineHeight: 18 },

  fieldGroup: { marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: theme.primary, marginBottom: 8, paddingHorizontal: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceContainerLow, borderRadius: 12, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 14 : 10 },
  input: { flex: 1, fontSize: 15, fontWeight: '500', color: theme.primary },
  inputSuffix: { fontSize: 15, fontWeight: '700', color: theme.onSurfaceVariant },
  fieldHint: { fontSize: 10, color: theme.onSecondaryContainer, paddingHorizontal: 4, marginTop: 6 },

  saveBtn: { marginTop: 12, backgroundColor: theme.primary, borderRadius: 24, paddingVertical: 16, alignItems: 'center' },
  saveBtnTxt: { fontSize: 14, fontWeight: '700', color: theme.onPrimary },

  bentoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  bentoCardLight: { flex: 1, backgroundColor: theme.surfaceContainerLow, borderRadius: 16, padding: 16, justifyContent: 'space-between', aspectRatio: 1 },
  bentoCardDark: { flex: 1, backgroundColor: theme.primaryContainer, borderRadius: 16, padding: 16, justifyContent: 'space-between', aspectRatio: 1 },
  bentoStatLabel: { fontSize: 9, fontWeight: '700', color: theme.onSurfaceVariant, letterSpacing: 1, marginBottom: 4 },
  bentoStatValue: { fontSize: 18, fontWeight: '800', color: theme.primary },

  integrationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  integrationIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: theme.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  integrationLogo: { fontSize: 9, fontWeight: '900', color: theme.primary, letterSpacing: 1 },
  integrationTitle: { fontSize: 14, fontWeight: '700', color: theme.primary, marginBottom: 8 },
  integrationInput: { backgroundColor: theme.surfaceContainerLow, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: theme.onSurfaceVariant, marginBottom: 6 },

  featureFlagCard: { backgroundColor: 'rgba(230,232,234,0.4)', borderRadius: 20, padding: 24, marginBottom: 16 },
  flagSectionTitle: { fontSize: 11, fontWeight: '700', color: theme.primary, letterSpacing: 2, marginBottom: 16 },
  flagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  flagLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flagName: { fontSize: 14, fontWeight: '600', color: theme.onSurface },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: theme.errorContainer, borderRadius: 16, paddingVertical: 16, marginTop: 8 },
  logoutTxt: { fontSize: 14, fontWeight: '700', color: theme.error },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.1)',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#191c1e', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.08, shadowRadius: 32, elevation: 16,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconActive: { backgroundColor: theme.secondaryContainer, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20 },
  navLabel: { fontSize: 10, fontWeight: '600', color: theme.onSecondaryContainer, letterSpacing: 0.5, marginTop: 2 },
});

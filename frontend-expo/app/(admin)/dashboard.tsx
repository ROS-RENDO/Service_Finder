import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '@/lib/api/client';
import { useSidebar } from './_layout';

const theme = {
  surface: Colors.dark.bg,
  onSurface: Colors.dark.text,
  onSurfaceVariant: Colors.dark.textSub,
  primary: Colors.primary,
  primaryContainer: Colors.primary,
  onPrimary: '#ffffff',
  onPrimaryContainer: Colors.primaryLight,
  secondaryContainer: Colors.dark.surface,
  onSecondaryContainer: Colors.primaryLight,
  onSecondaryFixedVariant: Colors.dark.textMuted,
  tertiaryContainer: 'rgba(108, 99, 255, 0.15)',
  onTertiaryContainer: Colors.primaryLight,
  errorContainer: 'rgba(239, 68, 68, 0.1)',
  onErrorContainer: Colors.danger,
  error: Colors.danger,
  surfaceContainerLowest: Colors.dark.cardAlt,
  surfaceContainerLow: Colors.dark.surface,
  surfaceContainerHigh: Colors.dark.cardAlt,
  surfaceContainerHighest: Colors.dark.border,
  outlineVariant: Colors.dark.border,
};

interface AdminStats {
  totalUsers?: number;
  totalCompanies?: number;
  pendingVerifications?: number;
  totalBookings?: number;
  totalRevenue?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStats>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await apiClient.get('/api/admin/analytics');
      setStats(res.data?.data || res.data || {});
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}><ActivityIndicator size="large" color={theme.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <BlurView intensity={70} tint="dark" style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard Overview</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="search" size={24} color={theme.onSurfaceVariant} />
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSuBxNg8h175atW7K3HDDWw5BybWbwbWhAJZ0rPsxnsh5xK9VdXWu4WNE9YbzxpsXF2JVnIe_7y_jvvndCodC7QUr079cHjhcBOTmZYYylzm6PB_m_fDeK4tmYw0ofBItrAojOHhsvNTexzF7upuGD_eso6ABTlAHBoOWI7dSQdYNpNJ5tFrstxibSr6NkW84DDrjDGCneCvsAVhmvunuKHPfSDTFpXcgy8RQpEs15QlVQGEmfKY9nWaKtt8kC_9fipPbeag7oVWU' }}
              style={styles.avatarImg}
            />
          </View>
        </View>
      </BlurView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {/* Verification Queue */}
        <View style={styles.queueCard}>
          <View style={styles.queueLeft}>
            <View style={styles.queueIconWrap}>
              <MaterialIcons name="verified-user" size={24} color={theme.onTertiaryContainer} />
            </View>
            <View>
              <Text style={styles.queueTitle}>Verification Queue</Text>
              <Text style={styles.queueSub}>{stats.pendingVerifications || 12} Pending applications</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.queueBtn} onPress={() => router.push('/(admin)/verification' as any)}>
            <Text style={styles.queueBtnTxt}>Review</Text>
          </TouchableOpacity>
        </View>

        {/* Platform Health */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Platform Health</Text>
            <Text style={styles.sectionSub}>Real-time ecosystem performance</Text>
          </View>
          
          <View style={styles.grid}>
            {/* Users */}
            <View style={styles.gridCard}>
              <View style={styles.gridIconWrap}>
                <MaterialIcons name="group" size={20} color={theme.onSecondaryContainer} />
              </View>
              <Text style={styles.gridLabel}>Total Users</Text>
              <Text style={styles.gridValue}>{stats.totalUsers ? (stats.totalUsers/1000).toFixed(1)+'k' : '42.8k'}</Text>
              <View style={styles.trendWrap}>
                <MaterialIcons name="trending-up" size={12} color="#16a34a" />
                <Text style={styles.trendTxt}>12%</Text>
              </View>
            </View>
            {/* Companies */}
            <View style={styles.gridCard}>
              <View style={styles.gridIconWrap}>
                <MaterialIcons name="business" size={20} color={theme.onSecondaryContainer} />
              </View>
              <Text style={styles.gridLabel}>Active Co.</Text>
              <Text style={styles.gridValue}>{stats.totalCompanies?.toLocaleString() || '1,204'}</Text>
              <View style={styles.trendWrap}>
                <MaterialIcons name="trending-up" size={12} color="#16a34a" />
                <Text style={styles.trendTxt}>5%</Text>
              </View>
            </View>
            {/* Bookings */}
            <View style={styles.gridCard}>
              <View style={styles.gridIconWrap}>
                <MaterialIcons name="event-available" size={20} color={theme.onSecondaryContainer} />
              </View>
              <Text style={styles.gridLabel}>Daily Bookings</Text>
              <Text style={styles.gridValue}>{stats.totalBookings?.toLocaleString() || '892'}</Text>
            </View>
            {/* Uptime */}
            <View style={styles.gridCard}>
              <View style={styles.gridIconWrap}>
                <MaterialIcons name="speed" size={20} color={theme.onSecondaryContainer} />
              </View>
              <Text style={styles.gridLabel}>Uptime</Text>
              <Text style={styles.gridValue}>99.9%</Text>
            </View>
          </View>
        </View>

        {/* Revenue Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenue Insights</Text>
            <Text style={styles.sectionSub}>Financial growth trajectories</Text>
          </View>
          
          <View style={styles.revCommCard}>
             <View style={styles.revCommHeader}>
               <Text style={styles.revCommTitle}>Platform Commission</Text>
               <MaterialIcons name="trending-up" size={20} color={theme.onPrimaryContainer} />
             </View>
             <View style={styles.revCommMain}>
               <Text style={styles.revCommValue}>${stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '142,500'}</Text>
               <View style={styles.revCommBadge}><Text style={styles.revCommBadgeTxt}>+12%</Text></View>
             </View>
          </View>

          <View style={styles.revProgCard}>
            <View style={styles.revProgHeader}>
              <Text style={styles.revProgTitle}>Monthly Revenue Performance</Text>
              <Text style={styles.revProgValue}>75% of target</Text>
            </View>
            <View style={styles.progBarBg}>
              <View style={[styles.progBarFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progGoal}>GOAL: $200K / MONTH</Text>
          </View>
        </View>

        {/* Growth Trends */}
        <View style={styles.section}>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Growth Trends</Text>
                <Text style={styles.chartSub}>User acquisition last 7 days</Text>
              </View>
              <Text style={styles.chartValue}>+2.4k</Text>
            </View>
            
            <View style={styles.chartBarsWrap}>
              {[40, 65, 50, 85, 60, 95, 75].map((h, i) => (
                <View key={i} style={[
                  styles.chartBar, 
                  { height: `${h}%`, backgroundColor: h === 95 ? theme.primary : theme.secondaryContainer }
                ]} />
              ))}
            </View>
            <View style={styles.chartLabelsWrap}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                 <Text key={day} style={styles.chartDay}>{day}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: 120 }]}>
          <View style={styles.feedHeaderRow}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Text style={styles.sectionSub}>Latest system events</Text>
            </View>
            <TouchableOpacity><Text style={styles.viewAllTxt}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.feedList}>
            <TouchableOpacity style={styles.feedItem} activeOpacity={0.7} onPress={() => router.push('/(admin)/users' as any)}>
              <View style={[styles.feedIconWrap, { backgroundColor: theme.secondaryContainer }]}>
                <MaterialIcons name="report-problem" size={20} color={theme.onSecondaryContainer} />
              </View>
              <View style={styles.feedInfo}>
                <Text style={styles.feedTitle}>User Issue</Text>
                <Text style={styles.feedSub}>Account lockout reported</Text>
              </View>
              <Text style={styles.feedTime}>2m ago</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.feedItem} activeOpacity={0.7} onPress={() => router.push('/(admin)/companies' as any)}>
              <View style={[styles.feedIconWrap, { backgroundColor: theme.errorContainer }]}>
                <MaterialIcons name="gavel" size={20} color={theme.onErrorContainer} />
              </View>
              <View style={styles.feedInfo}>
                <Text style={styles.feedTitle}>Company Dispute</Text>
                <Text style={styles.feedSub}>14 cases require mediation</Text>
              </View>
              <Text style={styles.feedTime}>15m ago</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.feedItem} activeOpacity={0.7} onPress={() => router.push('/(admin)/verification' as any)}>
              <View style={[styles.feedIconWrap, { backgroundColor: theme.tertiaryContainer }]}>
                 <MaterialIcons name="check-circle" size={20} color={theme.onTertiaryContainer} />
              </View>
              <View style={styles.feedInfo}>
                <Text style={styles.feedTitle}>Verification Approved</Text>
                <Text style={styles.feedSub}>Elite Plumbing credentials verified</Text>
              </View>
              <Text style={styles.feedTime}>1h ago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="dashboard" size={24} color={theme.primary} />
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/users' as any)}>
          <MaterialIcons name="group" size={24} color={theme.onSurfaceVariant} />
          <Text style={styles.navLabel}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/companies' as any)}>
          <MaterialIcons name="business" size={24} color={theme.onSurfaceVariant} />
          <Text style={styles.navLabel}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/verification' as any)}>
          <View style={{position: 'relative'}}>
            <MaterialIcons name="verified-user" size={24} color={theme.onSurfaceVariant} />
             {stats.pendingVerifications ? <View style={styles.navBadge} /> : null}
          </View>
          <Text style={styles.navLabel}>Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/settings' as any)}>
           <MaterialIcons name="settings" size={24} color={theme.onSurfaceVariant} />
           <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(15, 15, 27, 0.7)',
    borderBottomWidth: 1, borderBottomColor: theme.outlineVariant, zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 8, borderRadius: 24, backgroundColor: 'transparent' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: theme.primaryContainer, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },

  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },

  queueCard: { 
    backgroundColor: theme.primaryContainer, borderRadius: 12, padding: 20, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: 32, shadowColor: '#000', shadowOffset: { width:0, height:4 }, 
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 
  },
  queueLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  queueIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(27,169,237,0.2)', alignItems: 'center', justifyContent: 'center' },
  queueTitle: { fontSize: 14, fontWeight: '700', color: theme.onPrimary },
  queueSub: { fontSize: 12, color: theme.onPrimaryContainer, marginTop: 2 },
  queueBtn: { backgroundColor: theme.onTertiaryContainer, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  queueBtnTxt: { color: theme.primary, fontSize: 12, fontWeight: '700' },

  section: { marginBottom: 32 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.primary, letterSpacing: -0.5 },
  sectionSub: { fontSize: 12, fontWeight: '500', color: theme.onSurfaceVariant, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridCard: { 
    width: '47%', backgroundColor: theme.surfaceContainerLowest, 
    padding: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(196,198,207,0.1)',
  },
  gridIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  gridLabel: { fontSize: 12, fontWeight: '600', color: theme.onSecondaryFixedVariant, marginBottom: 4 },
  gridValue: { fontSize: 24, fontWeight: '800', color: theme.primary },
  trendWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  trendTxt: { fontSize: 10, fontWeight: '700', color: '#16a34a' },

  revCommCard: { backgroundColor: theme.primaryContainer, borderRadius: 12, padding: 24, marginBottom: 16, overflow: 'hidden' },
  revCommHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  revCommTitle: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  revCommMain: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  revCommValue: { fontSize: 30, fontWeight: '900', color: theme.onPrimary, letterSpacing: -1 },
  revCommBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  revCommBadgeTxt: { fontSize: 12, fontWeight: '700', color: theme.onPrimary },

  revProgCard: { backgroundColor: theme.surfaceContainerLow, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: 'rgba(196,198,207,0.1)' },
  revProgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  revProgTitle: { fontSize: 14, fontWeight: '600', color: theme.onSurfaceVariant },
  revProgValue: { fontSize: 12, fontWeight: '700', color: theme.primary },
  progBarBg: { height: 8, backgroundColor: theme.surfaceContainerHighest, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progBarFill: { height: '100%', backgroundColor: theme.primary, borderRadius: 4 },
  progGoal: { fontSize: 10, fontWeight: '700', color: theme.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 },

  chartCard: { backgroundColor: theme.surfaceContainerLow, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: 'rgba(196,198,207,0.1)' },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  chartTitle: { fontSize: 18, fontWeight: '700', color: theme.primary },
  chartSub: { fontSize: 12, color: theme.onSurfaceVariant, marginTop: 2 },
  chartValue: { fontSize: 20, fontWeight: '700', color: theme.primary },
  chartBarsWrap: { height: 96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  chartBar: { flex: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  chartLabelsWrap: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  chartDay: { fontSize: 10, fontWeight: '700', color: theme.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1 },

  feedHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllTxt: { fontSize: 12, fontWeight: '700', color: theme.primary },
  feedList: { gap: 12 },
  feedItem: { backgroundColor: theme.surfaceContainerLowest, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: 'rgba(196,198,207,0.1)' },
  feedIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  feedInfo: { flex: 1 },
  feedTitle: { fontSize: 14, fontWeight: '700', color: theme.onSurface, marginBottom: 2 },
  feedSub: { fontSize: 12, color: theme.onSurfaceVariant },
  feedTime: { fontSize: 10, fontWeight: '500', color: theme.onSurfaceVariant },

  bottomNav: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(15, 15, 27, 0.85)', borderTopWidth: 1, borderTopColor: theme.outlineVariant,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, fontWeight: '500', color: theme.onSurfaceVariant, marginTop: 2 },
  navBadge: { position: 'absolute', top: -4, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.error, borderWidth: 1, borderColor: theme.surface },
});

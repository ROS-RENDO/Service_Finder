import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { companiesApi } from '@/lib/api/companies';
import { useSidebar } from './_layout';

// ── Shared Types & Formatting ──────────────────────────────────────────────
interface DashboardData {
  totalRevenue?: number;
  activeBookings?: number;
  completionRate?: number;
  averageRating?: number;
}

const TIMEFRAMES = ['Today', 'Week', 'Month'];

const WEEKLY_DATA = [
  { day: 'M', height: 0.60, active: false },
  { day: 'T', height: 0.45, active: false },
  { day: 'W', height: 0.75, active: false },
  { day: 'T', height: 0.55, active: false },
  { day: 'F', height: 0.85, active: true },
  { day: 'S', height: 0.30, active: false },
  { day: 'S', height: 0.95, active: false, highlight: true },
];

const RECENT_ACTIVITY = [
  {
    id: 1, type: 'booking',
    icon: 'checkmark-done-circle', iconColor: '#3a485b', iconBg: '#d5e3fc',
    title: 'New booking for', highlight: 'Sarah Chen',
    sub: 'Deep Kitchen Cleaning • 2 mins ago',
  },
  {
    id: 2, type: 'completed',
    icon: 'checkmark-circle', iconColor: '#15803d', iconBg: '#dcfce7',
    title: 'Job completed by', highlight: 'Alex Rivera',
    sub: 'Standard Apartment • 15 mins ago',
  },
  {
    id: 3, type: 'staff',
    icon: 'person-add', iconColor: '#1a365d', iconBg: 'rgba(26,54,93,0.1)',
    title: 'Staff Assigned:', highlight: 'Marcus J.',
    sub: 'Office Sanitization • 45 mins ago',
  },
];

export default function CompanyDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleSidebar } = useSidebar();
  const [company, setCompany] = useState<any>(null);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [timeframe, setTimeframe] = useState('Week');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [compRes, dashRes] = await Promise.allSettled([
        companiesApi.getMe(),
        companiesApi.getDashboard(),
      ]);
      if (compRes.status === 'fulfilled') setCompany(compRes.value.data?.company || null);
      if (dashRes.status === 'fulfilled') {
        const d = dashRes.value.data;
        setDashboard(d?.data || d || {});
      }
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
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  const companyName = company?.name || 'Sparkle Pro Cleaning';
  const revenueStr = dashboard?.totalRevenue ? `$${dashboard.totalRevenue.toLocaleString()}` : '$0';
  const activeBookings = dashboard?.activeBookings || 0;
  const completion = dashboard?.completionRate ? `${dashboard.completionRate}%` : '0%';
  const rating = dashboard?.averageRating?.toFixed(1) || '0.0';

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
          <Ionicons name="menu" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{companyName}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="document-text" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ── Pending Bookings Banner ────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.alertBanner}
          activeOpacity={0.8}
          onPress={() => router.push('/(company)/bookings')}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.alertLeftBorder} />
          <Ionicons name="alert-circle" size={24} color="#FFF" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.alertTitle}>Pending Booking</Text>
            <Text style={styles.alertSub}>You have new requests awaiting assignment.</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#FFF" />
        </TouchableOpacity>

        {/* ── Timeframe Selector ─────────────────────────────────────────────── */}
        <View style={styles.timeframeContainer}>
          <View style={styles.timeframeBg}>
            {TIMEFRAMES.map((tf) => {
              const isActive = timeframe === tf;
              return (
                <TouchableOpacity
                  key={tf}
                  style={[styles.timeframeBtn, isActive && styles.timeframeBtnActive]}
                  onPress={() => setTimeframe(tf)}
                >
                  <Text style={[styles.timeframeTxt, isActive && styles.timeframeTxtActive]}>{tf}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── KPI Grid ───────────────────────────────────────────────────────── */}
        <View style={styles.kpiGrid}>
          {/* Revenue */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>TOTAL REVENUE</Text>
            <Text style={styles.kpiValue}>{revenueStr}</Text>
            <View style={styles.kpiTrend}>
              <Ionicons name="trending-up" size={12} color="#16a34a" />
              <Text style={styles.kpiTrendTxt}>All Time</Text>
            </View>
          </View>
          {/* Bookings */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>ACTIVE BOOKINGS</Text>
            <Text style={styles.kpiValue}>{activeBookings}</Text>
            <View style={styles.kpiTrend}>
              <Ionicons name="star" size={12} color="#1ba9ed" />
              <Text style={[styles.kpiTrendTxt, { color: '#1ba9ed' }]}>In Progress</Text>
            </View>
          </View>
          {/* Completion */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>COMPLETION</Text>
            <Text style={styles.kpiValue}>{completion}</Text>
            <Text style={styles.kpiSubTxt}>Historical Rate</Text>
          </View>
          {/* Rating */}
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>AVG RATING</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.kpiValue}>{rating}</Text>
              <Ionicons name="star" size={16} color={Colors.accent} />
            </View>
            <Text style={styles.kpiSubTxt}>Company Score</Text>
          </View>
        </View>

        {/* ── Weekly Revenue Chart ───────────────────────────────────────────── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Weekly Revenue Trend</Text>
              <Text style={styles.chartValue}>$12,500</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.chartTrendPill}>
                <Text style={styles.chartTrendTxt}>+12.4%</Text>
              </View>
              <Text style={styles.chartTrendSub}>vs last week</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {WEEKLY_DATA.map((col, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.chartBarBg, { height: `${col.height * 100}%` }]}>
                  <View style={[
                    styles.chartBarFill,
                    col.highlight ? styles.chartBarHighlight : (col.active ? styles.chartBarActive : null)
                  ]} />
                </View>
                <Text style={[styles.chartLabel, col.active && { color: Colors.primary, fontWeight: '900' }]}>
                  {col.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Recent Activity ────────────────────────────────────────────────── */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            <TouchableOpacity><Text style={styles.viewAllBtn}>VIEW ALL</Text></TouchableOpacity>
          </View>

          {RECENT_ACTIVITY.map(act => (
            <View key={act.id} style={styles.activityItem}>
              <View style={[styles.activityIconWrap, { backgroundColor: act.iconBg }]}>
                <Ionicons name={act.icon as any} size={20} color={act.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityItemTitle}>
                  {act.title} <Text style={styles.activityItemHighlight}>{act.highlight}</Text>
                </Text>
                <Text style={styles.activityItemSub}>{act.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* ── Quick Actions Floating Layer ─────────────────────────────────────── */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity style={styles.primaryActionBtn} activeOpacity={0.8}>
          <Ionicons name="people" size={20} color="#FFF" />
          <Text style={styles.primaryActionTxt}>Assign Staff</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryActionBtn} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={20} color="#3a485b" />
          <Text style={styles.secondaryActionTxt}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom Navigation Bar ────────────────────────────────────────────── */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        {[
          { icon: 'grid', label: 'Home', active: true },
          { icon: 'people', label: 'Staff', active: false },
          { icon: 'calendar', label: 'Jobs', active: false },
          { icon: 'bar-chart', label: 'Reports', active: false },
        ].map((tab, i) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <Ionicons name={tab.icon as any} size={24} color={tab.active ? Colors.primary : Colors.dark.textMuted} />
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  loader: { flex: 1 },

  // ── Header ─────────────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingBottom: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: 'rgba(15, 15, 27, 0.7)',
    zIndex: 10,
  },
  iconBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, flex: 1, textAlign: 'center', letterSpacing: -0.5 },

  scrollContent: { paddingBottom: Spacing.xxl },

  // ── Notice Banner ──────────────────────────────────────────────────────────
  alertBanner: { marginHorizontal: Spacing.md, marginTop: Spacing.md, flexDirection: 'row', alignItems: 'center', paddingRight: Spacing.lg, paddingVertical: Spacing.md, borderRadius: Radius.xl, position: 'relative', overflow: 'hidden' },
  alertLeftBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: Colors.accent },
  alertTitle: { fontSize: FontSize.sm, fontWeight: '800', color: '#FFF', letterSpacing: -0.3, zIndex: 1 },
  alertSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: '600', zIndex: 1 },

  // ── Timeframe ──────────────────────────────────────────────────────────────
  timeframeContainer: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  timeframeBg: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: 6, flexDirection: 'row', height: 48 },
  timeframeBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.lg },
  timeframeBtnActive: { backgroundColor: Colors.dark.surface },
  timeframeTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  timeframeTxtActive: { color: Colors.primary, fontWeight: '700' },

  // ── KPI Grid ───────────────────────────────────────────────────────────────
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Spacing.md, gap: Spacing.md },
  kpiCard: { width: '47.5%', backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  kpiLabel: { fontSize: 10, fontWeight: '700', color: Colors.dark.textMuted, letterSpacing: 1, marginBottom: 4 },
  kpiValue: { fontSize: 28, fontWeight: '800', color: Colors.primary, letterSpacing: -1 },
  kpiTrend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  kpiTrendTxt: { fontSize: 10, fontWeight: '700', color: '#16a34a' },
  kpiSubTxt: { fontSize: 10, fontWeight: '600', color: Colors.dark.textMuted, marginTop: 4 },

  // ── Chart ──────────────────────────────────────────────────────────────────
  chartCard: { backgroundColor: Colors.dark.cardAlt, marginHorizontal: Spacing.md, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.xl },
  chartTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.textSub, marginBottom: 2 },
  chartValue: { fontSize: 32, fontWeight: '800', color: Colors.primary, letterSpacing: -1 },
  chartTrendPill: { backgroundColor: 'rgba(21, 128, 61, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.md },
  chartTrendTxt: { fontSize: 11, fontWeight: '800', color: '#4CAF82' },
  chartTrendSub: { fontSize: 10, fontWeight: '600', color: Colors.dark.textMuted, marginTop: 4 },
  
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, gap: 8 },
  chartCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  chartBarBg: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderTopLeftRadius: 8, borderTopRightRadius: 8, overflow: 'hidden' },
  chartBarFill: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', backgroundColor: 'rgba(108, 99, 255, 0.3)' },
  chartBarActive: { backgroundColor: Colors.primary },
  chartBarHighlight: { backgroundColor: Colors.primaryDark },
  chartLabel: { marginTop: 8, fontSize: 10, fontWeight: '700', color: Colors.dark.textSub },

  // ── Activity ───────────────────────────────────────────────────────────────
  activitySection: { padding: Spacing.md, marginTop: Spacing.md },
  activityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  activityTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  viewAllBtn: { fontSize: 11, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 1 },
  
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, padding: Spacing.md, backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.dark.border },
  activityIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  activityItemTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.text },
  activityItemHighlight: { color: Colors.primary, fontWeight: '800' },
  activityItemSub: { fontSize: 11, color: Colors.dark.textSub, marginTop: 4 },

  // ── Quick Actions ──────────────────────────────────────────────────────────
  quickActionsRow: { position: 'absolute', bottom: 84, left: 0, right: 0, flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.md, zIndex: 10 },
  primaryActionBtn: { flex: 1, height: 56, backgroundColor: Colors.primary, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  primaryActionTxt: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },
  secondaryActionBtn: { flex: 1, height: 56, backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: Colors.dark.border },
  secondaryActionTxt: { color: Colors.dark.text, fontSize: FontSize.md, fontWeight: '800' },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: Platform.OS === 'ios' ? 84 : 64, backgroundColor: 'rgba(15,15,27,0.85)', flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 6 },
  navLabel: { fontSize: 11, fontWeight: '600', color: Colors.dark.textSub },
  navLabelActive: { color: Colors.primary, fontWeight: '800' },
});

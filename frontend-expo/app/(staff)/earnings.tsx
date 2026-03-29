import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, Image,
  TouchableOpacity, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/lib/api/client';

// ── Demo data perfectly matching the HTML mockup ──────────────────────────────
const DEMO_EARNINGS = {
  total: 1240.50,
  jobsCompleted: 128,
  rating: 4.92,
};

const DEMO_BARS = [
  { day: 'MON', heightPct: 0.60, active: false },
  { day: 'TUE', heightPct: 1.00, active: true  },
  { day: 'WED', heightPct: 0.40, active: false },
  { day: 'THU', heightPct: 0.70, active: false },
  { day: 'FRI', heightPct: 0.90, active: true  },
  { day: 'SAT', heightPct: 0.50, active: false },
  { day: 'SUN', heightPct: 0.30, active: false },
];

const DEMO_BREAKDOWN = [
  {
    id: 'b1', icon: 'sparkles' as const, label: 'Deep Clean',
    revenue: '$840.00', bookings: '42 bookings',
  },
  {
    id: 'b2', icon: 'refresh' as const, label: 'Standard Refresh',
    revenue: '$400.50', bookings: '86 bookings',
  },
];

const DEMO_REVIEWS = [
  {
    id: 'r1',
    stars: 5,
    timeAgo: '2 days ago',
    quote: '"Absolutely impeccable attention to detail on the deep clean. The team was professional and left everything spotless."',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80',
    highlighted: true,
  },
  {
    id: 'r2',
    stars: 5,
    timeAgo: 'Yesterday',
    quote: '"Quick, efficient, and very respectful of my home office space. Highly recommended for busy professionals."',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80',
    highlighted: false,
  },
];

const BAR_MAX_HEIGHT = 128;

export default function StaffEarningsScreen() {
  const router = useRouter();
  const [earnings, setEarnings] = useState<any>(DEMO_EARNINGS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEarnings = async () => {
    try {
      const res = await apiClient.get('/api/staff/earnings');
      if (res.data?.total != null) setEarnings(res.data);
    } catch {
      // Keep demo data on failure
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchEarnings(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchEarnings(); };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  const totalFormatted = `$${(earnings?.total ?? 0).toFixed(2)}`;
  const jobs = earnings?.jobsCompleted ?? DEMO_EARNINGS.jobsCompleted;
  const rating = earnings?.rating ?? DEMO_EARNINGS.rating;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ───────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerMenuBtn} onPress={() => router.back()}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Staff Portal</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' }}
          style={styles.headerAvatar}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ── Hero — Total Earnings ─────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Decorative blob */}
          <View style={styles.heroBlob} />

          <Text style={styles.heroLabel}>TOTAL REVENUE</Text>
          <Text style={styles.heroAmount}>{totalFormatted}</Text>

          <View style={styles.heroStatRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>JOBS COMPLETED</Text>
              <Text style={styles.heroStatValue}>{jobs}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatLabel}>STAFF RATING</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.heroStatValue}>{rating.toFixed(2)}</Text>
                <Ionicons name="star" size={14} color="#89ceff" />
              </View>
            </View>
          </View>
        </View>

        {/* ── Weekly Earnings Bar Chart ─────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Weekly Earnings</Text>
              <Text style={styles.sectionSub}>Performance over last 7 days</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewHistoryTxt}>View History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.barChartCard}>
            <View style={styles.barChartInner}>
              {DEMO_BARS.map((bar) => (
                <View key={bar.day} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: BAR_MAX_HEIGHT * bar.heightPct,
                          backgroundColor: bar.active ? Colors.primary : '#e6e8ea',
                          opacity: bar.active ? 1 : 0.85,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barLabel, bar.active && styles.barLabelActive]}>
                    {bar.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Service Breakdown Bento Grid ─────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Breakdown</Text>
          <View style={styles.bentoGrid}>
            {DEMO_BREAKDOWN.map((item) => (
              <View key={item.id} style={styles.bentoCard}>
                <View style={styles.bentoIconWrap}>
                  <Ionicons name={item.icon} size={22} color="#57657a" />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Text style={styles.bentoLabel}>{item.label.toUpperCase()}</Text>
                  <Text style={styles.bentoRevenue}>{item.revenue}</Text>
                  <Text style={styles.bentoBookings}>{item.bookings}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Client Highlights / Reviews ───────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Highlights</Text>
          {DEMO_REVIEWS.map((review) => (
            <View
              key={review.id}
              style={[styles.reviewCard, review.highlighted && styles.reviewCardHighlighted]}
            >
              {/* Stars + date */}
              <View style={styles.reviewTopRow}>
                <View style={styles.starsRow}>
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color="#003a55" />
                  ))}
                </View>
                <Text style={styles.reviewTimeAgo}>{review.timeAgo.toUpperCase()}</Text>
              </View>

              {/* Quote */}
              <Text style={styles.reviewQuote}>{review.quote}</Text>

              {/* Author */}
              <View style={styles.reviewAuthorRow}>
                <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                <Text style={styles.reviewName}>{review.name}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },

  // ── Header ───────────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: '#f1f3f5',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerMenuBtn: { padding: 6, borderRadius: 20 },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#1a365d' },

  scrollContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },

  // ── Hero ──────────────────────────────────────────────────────────────────
  heroCard: {
    borderRadius: 28, padding: Spacing.xl, marginBottom: Spacing.xl,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 12,
    overflow: 'hidden', position: 'relative',
  },
  heroBlob: {
    position: 'absolute', right: -48, top: -48, width: 192, height: 192,
    borderRadius: 96, backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.75)', letterSpacing: 1.5, marginBottom: 4 },
  heroAmount: { fontSize: 52, fontWeight: '900', color: '#FFF', letterSpacing: -2, marginBottom: Spacing.lg },
  heroStatRow: { flexDirection: 'row', gap: Spacing.md },
  heroStat: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 20,
    padding: Spacing.md,
  },
  heroStatLabel: { fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.65)', letterSpacing: 1.5, marginBottom: 4 },
  heroStatValue: { fontSize: 22, fontWeight: '800', color: '#FFF' },

  // ── Sections ──────────────────────────────────────────────────────────────
  section: { marginBottom: Spacing.xl },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5, marginBottom: 4 },
  sectionSub: { fontSize: FontSize.sm, color: '#43474e' },
  viewHistoryTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  // ── Bar Chart ─────────────────────────────────────────────────────────────
  barChartCard: {
    backgroundColor: '#FFF', borderRadius: 28, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  barChartInner: { flexDirection: 'row', alignItems: 'flex-end', height: BAR_MAX_HEIGHT + 28, gap: 6 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: BAR_MAX_HEIGHT + 28 },
  barTrack: { width: '100%', height: BAR_MAX_HEIGHT, justifyContent: 'flex-end' },
  barFill: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barLabel: { marginTop: 8, fontSize: 9, fontWeight: '800', color: '#74777f', letterSpacing: 0.8 },
  barLabelActive: { color: Colors.primary },

  // ── Bento Grid ────────────────────────────────────────────────────────────
  bentoGrid: { flexDirection: 'row', gap: Spacing.md },
  bentoCard: {
    flex: 1, height: 176, backgroundColor: '#f2f4f6', borderRadius: 28,
    padding: Spacing.lg, flexDirection: 'column', justifyContent: 'space-between',
  },
  bentoIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#d5e3fc',
    alignItems: 'center', justifyContent: 'center',
  },
  bentoLabel: { fontSize: 9, fontWeight: '800', color: '#3a485b', letterSpacing: 1.5, marginBottom: 2 },
  bentoRevenue: { fontSize: 24, fontWeight: '900', color: Colors.primary, letterSpacing: -0.5 },
  bentoBookings: { fontSize: 10, color: '#43474e', marginTop: 2 },

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviewCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: Spacing.lg,
    marginBottom: Spacing.md, borderLeftWidth: 4, borderLeftColor: 'rgba(26,54,93,0.15)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  reviewCardHighlighted: { borderLeftColor: '#003a55' },
  reviewTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewTimeAgo: { fontSize: 9, fontWeight: '700', color: '#74777f', letterSpacing: 1.2 },
  reviewQuote: { fontSize: FontSize.sm, color: '#43474e', lineHeight: 22, fontStyle: 'italic', marginBottom: Spacing.md },
  reviewAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e3e5' },
  reviewName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
});

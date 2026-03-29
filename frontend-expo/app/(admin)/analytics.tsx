import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
};

const KPI_CARDS = [
  { label: 'Total Revenue', value: '$142.5k', trend: '+12.4% vs LY', up: true },
  { label: 'User Growth', value: '1,842', trend: '+8.2% vs LW', up: true },
  { label: 'Avg. Rating', value: '4.85 ★', trend: 'Based on 12k reviews', up: null },
  { label: 'Completion Rate', value: '94.2%', trend: '+2.1% spike', up: true },
];

const FUNNEL_STEPS = [
  { label: 'Awareness', value: '45.2k', unit: 'Views', pct: 1.0 },
  { label: 'Interest', value: '12.8k', unit: 'Clicks', pct: 0.65 },
  { label: 'Booking', value: '3,120', unit: 'Orders', pct: 0.35 },
  { label: 'Repeat', value: '842', unit: 'Loyal', pct: 0.15 },
];

const BAR_HEIGHTS = [96, 128, 64, 144, 112, 80, 96, 72, 128, 56];

const TOP_CATEGORIES = [
  { icon: 'cleaning-services', name: 'Floor Cleaning', demand: 'HIGH DEMAND', pct: '88%' },
  { icon: 'hvac', name: 'HVAC', demand: 'MODERATE DEMAND', pct: '64%' },
  { icon: 'plumbing', name: 'Plumbing', demand: 'INCREASING', pct: '42%' },
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Platform Analytics</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.exportBtn}>
            <MaterialIcons name="ios-share" size={14} color={theme.onSecondaryFixedVariant} />
            <Text style={styles.exportTxt}>Export</Text>
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgGWUax9FwXUKPDtZcFBGtl3AWhVtY-bQT7jf9Ykb_4hfFzDoLA4I88BtxShaR5N_Jd33h73oHKGosO6lCjk--ywc7QgZQXoT7ewlQsq8Hz2b4yokjgkH3kkHAgeUHCrqVNbHq6BYLfSPjSH5Ho4CH5lXbbWTwIIkEevsnGV_oAxteA_A4zKQQ8ABKFM9WUJKGf-9GQb0ieh12KuFKNO9JQUOyEj61FWZ2oL5QuqzZh0mYdYQyUic6mALBjnE08DfS1fhoFq_kTs8' }}
              style={styles.avatarImg}
            />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Date Filter */}
        <View style={styles.dateFilter}>
          <View style={styles.dateLeft}>
            <MaterialIcons name="calendar-today" size={18} color={theme.onSecondaryContainer} />
            <Text style={styles.dateTxt}>Oct 1 – Oct 31, 2023</Text>
          </View>
          <MaterialIcons name="expand-more" size={20} color={theme.onSecondaryContainer} />
        </View>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          {KPI_CARDS.map(card => (
            <View key={card.label} style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>{card.label.toUpperCase()}</Text>
              <Text style={styles.kpiValue}>{card.value}</Text>
              <View style={styles.kpiTrendRow}>
                {card.up !== null && (
                  <MaterialIcons
                    name={card.up ? 'trending-up' : 'trending-down'}
                    size={12}
                    color={card.up ? '#16a34a' : theme.tertiaryContainer}
                  />
                )}
                <Text style={[styles.kpiTrend, card.up ? { color: '#16a34a' } : { color: theme.onSecondaryContainer }]}>
                  {card.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Acquisition Funnel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acquisition Funnel</Text>
          <View style={styles.funnelWrap}>
            {FUNNEL_STEPS.map(step => (
              <View key={step.label} style={styles.funnelRow}>
                <View style={styles.funnelMeta}>
                  <Text style={styles.funnelLabel}>{step.label}</Text>
                  <Text style={styles.funnelValue}>
                    {step.value} <Text style={styles.funnelUnit}>{step.unit}</Text>
                  </Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, {
                    width: `${step.pct * 100}%` as any,
                    opacity: 0.4 + step.pct * 0.6,
                  }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Revenue Bar Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Revenue Trend</Text>
            <Text style={styles.cardSubLabel}>LAST 30 DAYS</Text>
          </View>
          <View style={styles.barChart}>
            {BAR_HEIGHTS.map((h, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  { height: h },
                  i === 3 ? styles.barActive : styles.barInactive,
                ]}
              />
            ))}
          </View>
          <View style={styles.barLabels}>
            <Text style={styles.barLabel}>OCT 01</Text>
            <Text style={styles.barLabel}>OCT 15</Text>
            <Text style={styles.barLabel}>OCT 31</Text>
          </View>
        </View>

        {/* Market Density */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Market Density</Text>
          <View style={styles.mapWrap}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRvJVrgtimK9qYFmR07mHESlCoQCc9Pti4sCTXU2N5yAobT-mys2rQjD93845kD4UOKNBoqieseCYde58po-5R5KUZvGMAaTH7Aty8LtX-1lDz9STS6dfrVFwSvkPbVbuKJaZAmscZQlDdxF6ukl2xcp4L4gLkUtqWtCszk2wyNktoSmdVkAmgTUylzrfc2lcLABj5XgFHlqBjfcO-48JmMCpYPiybuRPyI9BsAipju3zLit7YsoLNjHIp8ZZn6iyYAXeLjbymCfk' }}
              style={styles.mapImg}
            />
            <View style={styles.mapBadge}>
              <View style={styles.mapPulse} />
              <Text style={styles.mapBadgeTxt}>34 Active Hubs</Text>
            </View>
          </View>

          <Text style={styles.catSectionTitle}>TOP SERVICE CATEGORIES</Text>
          <View style={styles.catItems}>
            {TOP_CATEGORIES.map(cat => (
              <View key={cat.name} style={styles.catItem}>
                <View style={styles.catLeft}>
                  <View style={styles.catIconBox}>
                    <MaterialIcons name={cat.icon as any} size={20} color={theme.onSecondaryContainer} />
                  </View>
                  <View>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catDemand}>{cat.demand}</Text>
                  </View>
                </View>
                <Text style={styles.catPct}>{cat.pct}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard' as any)}>
          <MaterialIcons name="dashboard" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
            <MaterialIcons name="query-stats" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Growth</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/companies' as any)}>
          <MaterialIcons name="public" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Regions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/settings' as any)}>
          <MaterialIcons name="description" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Reports</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14, backgroundColor: theme.surface, zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.secondaryContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  exportTxt: { fontSize: 12, fontWeight: '600', color: theme.onSecondaryFixedVariant },
  avatarWrap: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', backgroundColor: theme.surfaceContainerHigh },
  avatarImg: { width: '100%', height: '100%' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },

  dateFilter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.surfaceContainerLow, borderRadius: 12, padding: 14, marginBottom: 20,
  },
  dateLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateTxt: { fontSize: 13, fontWeight: '500', color: theme.onSurfaceVariant },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  kpiCard: { width: '47%', backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, padding: 16 },
  kpiLabel: { fontSize: 9, fontWeight: '700', color: theme.onSecondaryContainer, letterSpacing: 1, marginBottom: 4 },
  kpiValue: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5, marginBottom: 8 },
  kpiTrendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  kpiTrend: { fontSize: 10, fontWeight: '700' },

  card: { backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, padding: 20, marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: theme.primary, marginBottom: 20 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardSubLabel: { fontSize: 9, fontWeight: '700', color: theme.onSecondaryContainer, letterSpacing: 1 },

  funnelWrap: { gap: 20 },
  funnelRow: { gap: 8 },
  funnelMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  funnelLabel: { fontSize: 13, fontWeight: '600', color: theme.onSurface },
  funnelValue: { fontSize: 12, fontWeight: '700', color: theme.primary },
  funnelUnit: { fontSize: 11, fontWeight: '400', color: theme.onSecondaryContainer },
  progressBg: { height: 8, backgroundColor: theme.surfaceContainerLow, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: theme.primary, borderRadius: 4 },

  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, gap: 4 },
  bar: { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barActive: { backgroundColor: theme.primary },
  barInactive: { backgroundColor: 'rgba(26,54,93,0.15)' },
  barLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  barLabel: { fontSize: 9, fontWeight: '700', color: theme.onSecondaryContainer },

  mapWrap: { borderRadius: 12, overflow: 'hidden', height: 180, marginBottom: 20, position: 'relative' },
  mapImg: { width: '100%', height: '100%' },
  mapBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary },
  mapBadgeTxt: { fontSize: 10, fontWeight: '700', color: theme.primary },

  catSectionTitle: { fontSize: 10, fontWeight: '700', color: theme.primary, letterSpacing: 2, marginBottom: 16 },
  catItems: { gap: 16 },
  catItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center' },
  catName: { fontSize: 13, fontWeight: '700', color: theme.onSurface },
  catDemand: { fontSize: 9, fontWeight: '700', color: theme.onSecondaryContainer, letterSpacing: 0.5 },
  catPct: { fontSize: 14, fontWeight: '900', color: theme.primary },

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

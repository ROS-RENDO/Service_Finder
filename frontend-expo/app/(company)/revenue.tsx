import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Image, Platform, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { useSidebar } from './_layout';

export default function CompanyRevenueScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [refreshing, setRefreshing] = useState(false);

  // Example fetch stub
  const fetchRevenueData = async () => {
    try {
      // await apiClient.get('/api/company/revenue');
    } catch (e) { } 
    finally { setRefreshing(false); }
  };

  useEffect(() => { fetchRevenueData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchRevenueData(); };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80' }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ServiceAdmin</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
        
        {/* ── Revenue Overview ───────────────────────────────────────────────── */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewTop}>
            <View>
              <Text style={styles.overviewLabel}>Total Revenue</Text>
              <Text style={styles.overviewVal}>$42,850.00</Text>
            </View>
            <View style={styles.trendBadge}>
              <Ionicons name="trending-up" size={14} color="#003a55" />
              <Text style={styles.trendBadgeTxt}>+12.5%</Text>
            </View>
          </View>
          <Text style={styles.overviewContext}>Compared to $38,088.00 last month</Text>
        </View>

        {/* ── Service Breakdown (Bento Grid) ─────────────────────────────────── */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Service Breakdown</Text>
          
          <View style={styles.bentoGrid}>
            {/* Wide Top Card - Maintenance */}
            <View style={[styles.bentoCard]}>
              <View style={styles.bentoCardTop}>
                
                <View style={styles.bentoInfoLeft}>
                  <View style={styles.bentoIconWrap}>
                    <Ionicons name="construct" size={20} color="#57657a" />
                  </View>
                  <View>
                    <Text style={styles.bentoLabel}>Maintenance</Text>
                    <Text style={styles.bentoVal}>$18,400</Text>
                  </View>
                </View>

                {/* Mini Graph Bars */}
                <View style={styles.miniGraph}>
                  <View style={[styles.graphBar, { height: '30%', backgroundColor: 'rgba(26,54,93,0.2)' }]} />
                  <View style={[styles.graphBar, { height: '50%', backgroundColor: 'rgba(26,54,93,0.2)' }]} />
                  <View style={[styles.graphBar, { height: '70%', backgroundColor: 'rgba(26,54,93,0.2)' }]} />
                  <View style={[styles.graphBar, { height: '100%', backgroundColor: '#d5e3fc' }]} />
                </View>

              </View>

              <View style={styles.bentoProgressTrack}>
                <View style={[styles.bentoProgressFill, { width: '43%' }]} />
              </View>
            </View>

            {/* Bottom Row - Split Cards */}
            <View style={styles.bentoSplitRow}>
              
              <View style={styles.bentoMiniCard}>
                <View style={styles.bentoIconWrapMini}>
                  <Ionicons name="color-wand" size={18} color="#57657a" />
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.bentoLabelMini}>CLEANING</Text>
                  <Text style={styles.bentoValMini}>$12,250</Text>
                </View>
              </View>

              <View style={styles.bentoMiniCard}>
                <View style={styles.bentoIconWrapMini}>
                  <Ionicons name="shield-checkmark" size={18} color="#57657a" />
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.bentoLabelMini}>SECURITY</Text>
                  <Text style={styles.bentoValMini}>$9,200</Text>
                </View>
              </View>

            </View>
          </View>
        </View>

        {/* ── Actions ────────────────────────────────────────────────────────── */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.exportBtn} onPress={() => router.push('/(company)/invoices')}>
            <Ionicons name="document-text-outline" size={20} color="#FFF" />
            <Text style={styles.exportBtnTxt}>Generate Invoice</Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Transactions ────────────────────────────────────────────── */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity><Text style={styles.viewAllTxt}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {/* Item 1 */}
            <View style={styles.txCard}>
              <View style={styles.txLeft}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=150' }} style={styles.txAvatar} />
                <View>
                  <Text style={styles.txName}>Johnathan Miller</Text>
                  <Text style={styles.txSub}>HVAC Repair • Oct 24</Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmt}>+$450.00</Text>
                <View style={styles.stateBadgePaid}>
                  <Text style={styles.stateBadgePaidTxt}>PAID</Text>
                </View>
              </View>
            </View>

            {/* Item 2 */}
            <View style={styles.txCard}>
              <View style={styles.txLeft}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' }} style={styles.txAvatar} />
                <View>
                  <Text style={styles.txName}>Sarah Jenkins</Text>
                  <Text style={styles.txSub}>Deep Cleaning • Oct 23</Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmt}>+$1,200.00</Text>
                <View style={styles.stateBadgePending}>
                  <Text style={styles.stateBadgePendingTxt}>PENDING</Text>
                </View>
              </View>
            </View>

            {/* Item 3 */}
            <View style={[styles.txCard, { borderBottomWidth: 0 }]}>
              <View style={styles.txLeft}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' }} style={styles.txAvatar} />
                <View>
                  <Text style={styles.txName}>Robert Chen</Text>
                  <Text style={styles.txSub}>Security Audit • Oct 22</Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmt}>+$3,500.00</Text>
                <View style={styles.stateBadgePaid}>
                  <Text style={styles.stateBadgePaidTxt}>PAID</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'map', label: 'Areas', active: false },
          { icon: 'people', label: 'Staff', active: false },
          { icon: 'bar-chart', label: 'Metrics', active: false },
          { icon: 'wallet', label: 'Finance', active: true },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? '#FFF' : '#43474e'} />
            </View>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: '#f7f9fb',
    borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.3)', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { padding: 4 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d5e3fc', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  settingsBtn: { padding: 8, borderRadius: 20 },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 110, paddingTop: Spacing.xl },

  // ── Overview ───────────────────────────────────────────────────────────────
  overviewSection: { marginBottom: Spacing.xl },
  overviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  overviewLabel: { fontSize: FontSize.sm, fontWeight: '600', color: '#3a485b' },
  overviewVal: { fontSize: 36, fontWeight: '800', color: Colors.primary, letterSpacing: -1, marginTop: 2 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#d5e3fc', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, marginBottom: 4 },
  trendBadgeTxt: { fontSize: 11, fontWeight: '800', color: '#003a55' },
  overviewContext: { fontSize: FontSize.sm, color: '#43474e' },

  // ── Bento Grid ─────────────────────────────────────────────────────────────
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.md },
  breakdownSection: { marginBottom: Spacing.xl },
  bentoGrid: { gap: Spacing.md },
  
  bentoCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  bentoCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  bentoInfoLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  bentoIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d5e3fc', alignItems: 'center', justifyContent: 'center' },
  bentoLabel: { fontSize: 11, fontWeight: '600', color: '#43474e', marginBottom: 2 },
  bentoVal: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  
  miniGraph: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 40, width: 60 },
  graphBar: { width: 12, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
  
  bentoProgressTrack: { width: '100%', height: 6, borderRadius: 3, backgroundColor: '#f2f4f6' },
  bentoProgressFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.primary },

  bentoSplitRow: { flexDirection: 'row', gap: Spacing.md },
  bentoMiniCard: { flex: 1, backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  bentoIconWrapMini: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#d5e3fc', alignItems: 'center', justifyContent: 'center' },
  bentoLabelMini: { fontSize: 10, fontWeight: '800', color: '#43474e', letterSpacing: 1, marginBottom: 4 },
  bentoValMini: { fontSize: 18, fontWeight: '800', color: Colors.primary },

  // ── Actions ────────────────────────────────────────────────────────────────
  actionsSection: { marginBottom: Spacing.xl },
  exportBtn: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: Radius.full, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  exportBtnTxt: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },

  // ── Transactions ───────────────────────────────────────────────────────────
  transactionsSection: { marginBottom: Spacing.xxl },
  sectionHeaderWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  viewAllTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  
  transactionList: { backgroundColor: '#f2f4f6', borderRadius: Radius.xl, overflow: 'hidden' },
  txCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.3)' },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  txAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eceef0' },
  txName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, marginBottom: 2 },
  txSub: { fontSize: 11, color: '#43474e' },
  
  txRight: { alignItems: 'flex-end' },
  txAmt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  stateBadgePaid: { backgroundColor: 'rgba(27,169,237,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  stateBadgePaidTxt: { color: '#1ba9ed', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  stateBadgePending: { backgroundColor: 'rgba(185,199,223,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  stateBadgePendingTxt: { color: '#57657a', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(247,249,251,0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: Colors.primary },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#43474e', letterSpacing: 0.5 },
  navLabelActive: { color: Colors.primary },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';

export default function StaffPerformanceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Hero Profile ───────────────────────────────────────────────────── */}
        <View style={styles.heroWrap}>
          <TouchableOpacity style={styles.backWrap} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={16} color={Colors.primary} />
            <Text style={styles.backTxt}>Back to Staff</Text>
          </TouchableOpacity>
          
          <View style={styles.profileRow}>
            <View style={styles.heroAvatarWrap}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' }} style={styles.heroAvatarImg} />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#FFF" />
              </View>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroName}>Elena Rodriguez</Text>
              <Text style={styles.heroRole}>Lead Field Specialist</Text>
            </View>
          </View>
        </View>

        {/* ── Summary Grid ───────────────────────────────────────────────────── */}
        <View style={styles.summaryGrid}>
          {/* Main Rating Card */}
          <View style={[styles.gridCard, { gridColumn: 'span 2' as any }]}>
            <View style={styles.ratingTop}>
              <Text style={styles.ratingLabel}>OVERALL RATING</Text>
              <View style={styles.ratingIconWrap}>
                <Ionicons name="star" size={20} color="#003a55" />
              </View>
            </View>
            <View style={styles.ratingBot}>
              <View style={styles.scoreWrap}>
                <Text style={styles.scoreVal}>4.8</Text>
                <Text style={styles.scoreMax}>/ 5.0</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>
          </View>

          {/* Mini Cards */}
          <View style={styles.miniCardsRow}>
            <View style={styles.miniCard}>
              <View style={styles.miniIconWrap}>
                <Ionicons name="checkmark-done" size={20} color="#57657a" />
              </View>
              <View>
                <Text style={styles.miniVal}>98.4%</Text>
                <Text style={styles.miniLabel}>Completion Rate</Text>
              </View>
            </View>
            <View style={styles.miniCard}>
              <View style={styles.miniIconWrap}>
                <Ionicons name="time" size={20} color="#57657a" />
              </View>
              <View>
                <Text style={styles.miniVal}>4m Early</Text>
                <Text style={styles.miniLabel}>Avg. Punctuality</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Performance Trends ─────────────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Trends</Text>
            <View style={styles.timePill}>
              <Text style={styles.timePillTxt}>Last 30 Days</Text>
            </View>
          </View>
          
          <View style={styles.graphCard}>
            {/* SVG placeholder simulation using Views */}
            <View style={styles.graphContainer}>
              <View style={styles.graphLineMock} />
              <View style={styles.graphPoint1} />
              <View style={styles.graphPoint2} />
              <View style={styles.graphFill} />
            </View>
            
            <View style={styles.graphLabels}>
              <Text style={styles.gLabel}>Week 1</Text>
              <Text style={styles.gLabel}>Week 2</Text>
              <Text style={styles.gLabel}>Week 3</Text>
              <Text style={styles.gLabel}>Week 4</Text>
            </View>
          </View>
        </View>

        {/* ── Recent Feedback ────────────────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Feedback</Text>
            <TouchableOpacity><Text style={styles.viewAllBtn}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.feedbackList}>
            {/* Feedback 1 */}
            <View style={styles.feedbackCard}>
              <View style={styles.fbHeader}>
                <View style={styles.fbUserBox}>
                  <View style={styles.fbInitials}><Text style={styles.fbInitialsTxt}>MB</Text></View>
                  <View>
                    <Text style={styles.fbName}>Marcus Bennett</Text>
                    <Text style={styles.fbTime}>2 hours ago</Text>
                  </View>
                </View>
                <View style={styles.fbStars}>
                  {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color="#003a55" />)}
                </View>
              </View>
              <Text style={styles.fbText}>"Elena was incredibly professional and arrived 10 minutes early. Her attention to detail is unmatched. Truly an asset to the team."</Text>
            </View>

            {/* Feedback 2 */}
            <View style={styles.feedbackCard}>
              <View style={styles.fbHeader}>
                <View style={styles.fbUserBox}>
                  <View style={styles.fbInitials}><Text style={styles.fbInitialsTxt}>SC</Text></View>
                  <View>
                    <Text style={styles.fbName}>Sarah Chen</Text>
                    <Text style={styles.fbTime}>Yesterday</Text>
                  </View>
                </View>
                <View style={styles.fbStars}>
                  {[1,2,3,4].map(i => <Ionicons key={i} name="star" size={14} color="#003a55" />)}
                  <Ionicons name="star-outline" size={14} color="#003a55" />
                </View>
              </View>
              <Text style={styles.fbText}>"Great work as always. Very efficient and communicative throughout the process."</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'map', label: 'Areas', active: false },
          { icon: 'people', label: 'Staff', active: true },
          { icon: 'bar-chart', label: 'Metrics', active: false },
          { icon: 'wallet', label: 'Finance', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? '#FFF' : '#57657a'} />
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
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d5e3fc', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  settingsBtn: { padding: 8, borderRadius: 20, backgroundColor: '#f2f4f6' },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 110, paddingTop: Spacing.xl },

  // ── Hero Profile ───────────────────────────────────────────────────────────
  heroWrap: { marginBottom: Spacing.xl },
  backWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.lg },
  backTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  profileRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.lg },
  heroAvatarWrap: { position: 'relative', width: 96, height: 96 },
  heroAvatarImg: { width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#eceef0' },
  verifiedBadge: { position: 'absolute', bottom: -8, right: -8, backgroundColor: Colors.primary, padding: 4, borderRadius: 12 },
  heroInfo: { flex: 1, paddingBottom: 4 },
  heroName: { fontSize: 28, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5, marginBottom: 4 },
  heroRole: { fontSize: FontSize.sm, fontWeight: '500', color: '#43474e' },

  // ── Summary Grid ───────────────────────────────────────────────────────────
  summaryGrid: { marginBottom: Spacing.xl, gap: Spacing.md },
  gridCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, minHeight: 140, justifyContent: 'space-between' },
  ratingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ratingLabel: { fontSize: 10, fontWeight: '800', color: '#57657a', letterSpacing: 1 },
  ratingIconWrap: { backgroundColor: '#d5e3fc', padding: 8, borderRadius: 20 },
  ratingBot: { marginTop: Spacing.md },
  scoreWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  scoreVal: { fontSize: 36, fontWeight: '800', color: Colors.primary },
  scoreMax: { fontSize: FontSize.sm, fontWeight: '600', color: '#57657a' },
  progressBar: { width: '100%', height: 6, backgroundColor: '#f2f4f6', borderRadius: 3, marginTop: 12 },
  progressFill: { width: '96%', height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },

  miniCardsRow: { flexDirection: 'row', gap: Spacing.md },
  miniCard: { flex: 1, backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, gap: 12 },
  miniIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d5e3fc', alignItems: 'center', justifyContent: 'center' },
  miniVal: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 2 },
  miniLabel: { fontSize: 11, fontWeight: '600', color: '#57657a' },

  // ── Section Generics ───────────────────────────────────────────────────────
  sectionWrap: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  timePill: { backgroundColor: '#d6e3ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  timePillTxt: { fontSize: 10, fontWeight: '700', color: Colors.primary },
  viewAllBtn: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  // ── Performance Graph Mock ─────────────────────────────────────────────────
  graphCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.xl, height: 220, position: 'relative', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  graphContainer: { flex: 1, position: 'relative', borderBottomWidth: 1, borderBottomColor: '#eceef0', marginBottom: 20 },
  graphLineMock: { position: 'absolute', top: 30, left: 0, right: 0, height: 2, backgroundColor: Colors.primary, transform: [{ rotate: '-8deg' }] },
  graphPoint1: { position: 'absolute', top: 40, left: '25%', width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  graphPoint2: { position: 'absolute', top: 20, left: '75%', width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  graphFill: { position: 'absolute', bottom: 0, left: 0, right: 0, top: 40, backgroundColor: 'rgba(0,32,69, 0.05)' },
  graphLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, position: 'absolute', bottom: 16, left: 20, right: 20 },
  gLabel: { fontSize: 10, fontWeight: '600', color: '#57657a' },

  // ── Feedback List ──────────────────────────────────────────────────────────
  feedbackList: { gap: Spacing.md },
  feedbackCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  fbHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  fbUserBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  fbInitials: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#d5e3fc', alignItems: 'center', justifyContent: 'center' },
  fbInitialsTxt: { fontSize: 11, fontWeight: '800', color: '#002045' },
  fbName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  fbTime: { fontSize: 10, color: '#57657a' },
  fbStars: { flexDirection: 'row', gap: 2 },
  fbText: { fontSize: FontSize.sm, color: '#43474e', fontStyle: 'italic', lineHeight: 22 },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(247,249,251,0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: Colors.primary },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#57657a', letterSpacing: 0.5 },
  navLabelActive: { color: Colors.primary },
});

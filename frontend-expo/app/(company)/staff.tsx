import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, RefreshControl, ActivityIndicator, Platform,
  Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { companiesApi } from '@/lib/api/companies';
import { useSidebar } from './_layout';

const DEMO_STAFF = [
  {
    id: 's1',
    name: 'Marcus Chen',
    role: 'Lead Supervisor',
    rating: '4.9',
    status: 'Active',
    subStatus: 'Active / On Duty',
    statusColor: '#10b981', // emerald-500
    avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 's2',
    name: 'Alex Rivera',
    role: 'Professional Cleaner',
    rating: '4.8',
    status: 'Active',
    subStatus: 'Off Duty',
    statusColor: '#74777f',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 's3',
    name: 'Sarah Jenkins',
    role: 'Senior Specialist',
    rating: '5.0',
    status: 'On Leave',
    subStatus: '',
    statusColor: '#e0e3e5',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 's4',
    name: 'David Kim',
    role: 'Floor Technician',
    rating: '4.7',
    status: 'Active',
    subStatus: 'Active / On Duty',
    statusColor: '#10b981',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
  },
];

export default function CompanyStaffScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [staff, setStaff] = useState<any[]>(DEMO_STAFF);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  const fetchStaff = async () => {
    try {
      const res = await companiesApi.getStaff();
      if (res.data?.data?.length > 0) setStaff(res.data.data);
      else if (res.data?.staff?.length > 0) setStaff(res.data.staff);
      else setStaff(DEMO_STAFF);
    } catch {
      setStaff(DEMO_STAFF);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchStaff(); };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Staff Management</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
        
        {/* ── Hero Actions ───────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View>
            <Text style={styles.heroSub}>Active Team</Text>
            <Text style={styles.heroTitle}>24 Members</Text>
          </View>
          <TouchableOpacity style={styles.inviteBtn}>
            <Ionicons name="person-add" size={18} color="#FFF" />
            <Text style={styles.inviteBtnTxt}>Invite Staff</Text>
          </TouchableOpacity>
        </View>

        {/* ── Chips Row ──────────────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsWrap}>
          <TouchableOpacity style={styles.chipActive}><Text style={styles.chipTxtActive}>All Staff</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipTxt}>Supervisors</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipTxt}>Cleaners</Text></TouchableOpacity>
          <TouchableOpacity style={styles.chip}><Text style={styles.chipTxt}>On Duty</Text></TouchableOpacity>
        </ScrollView>

        {/* ── Staff List ─────────────────────────────────────────────────────── */}
        <View style={styles.listWrap}>
          {staff.map((member, index) => (
            <TouchableOpacity 
              key={member.id || index} 
              style={styles.staffCard} 
              activeOpacity={0.9}
              onPress={() => setSelectedStaff(member)}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardUser}>
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: member.avatar }} style={styles.avatarImg} />
                    <View style={[styles.statusIndicator, { backgroundColor: member.statusColor }]} />
                  </View>
                  <View>
                    <Text style={styles.staffName}>{member.name}</Text>
                    <Text style={styles.staffRole}>{member.role}</Text>
                  </View>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#003a55" />
                  <Text style={styles.ratingTxt}>{member.rating}</Text>
                </View>
              </View>

              <View style={styles.cardBot}>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionCircleBtn}>
                    <Ionicons name="call" size={18} color="#57657a" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionCircleBtn}>
                    <Ionicons name="mail" size={18} color="#57657a" />
                  </TouchableOpacity>
                </View>
                {member.subStatus ? (
                  <View style={[styles.subStatusBadge, { backgroundColor: member.status === 'Active' ? '#d1fae5' : '#f2f4f6' }]}>
                    <Text style={[styles.subStatusTxt, { color: member.status === 'Active' ? '#047857' : '#43474e' }]}>{member.subStatus}</Text>
                  </View>
                ) : (
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillTxt}>{member.status}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Floating Action Button ─────────────────────────────────────────── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => router.push('/(company)/performance')}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* ── Profile Modal Overlay ──────────────────────────────────────────── */}
      <Modal visible={!!selectedStaff} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalDragHandle} />
            
            <View style={styles.modalHeader}>
              <View style={styles.modalUserRow}>
                <Image source={{ uri: selectedStaff?.avatar }} style={styles.modalAvatar} />
                <View>
                  <Text style={styles.modalName}>{selectedStaff?.name}</Text>
                  <Text style={styles.modalRole}>{selectedStaff?.role}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedStaff(null)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              
              {/* Performance Mini-Chart Component */}
              <View style={styles.perfBox}>
                <View style={styles.perfHeader}>
                  <View>
                    <Text style={styles.perfLabel}>Completion Rate</Text>
                    <Text style={styles.perfValue}>98.2%</Text>
                  </View>
                  <View style={styles.trendWrap}>
                    <Ionicons name="trending-up" size={16} color="#059669" />
                    <Text style={styles.trendTxt}>+2.4%</Text>
                  </View>
                </View>
                
                {/* Mock Chart Visualization directly matching HTML */}
                <View style={styles.chartBarsWrap}>
                  {[40, 60, 55, 75, 90, 98, 85, 92].map((h, i) => (
                    <View key={i} style={[styles.chartBar, { height: `${h}%`, backgroundColor: h === 98 ? Colors.primary : '#d5e3fc' }]} />
                  ))}
                </View>
              </View>

              {/* Recent Jobs */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Recent Assigned Jobs</Text>
                <View style={styles.jobCards}>
                  <View style={styles.jobCard}>
                    <View style={styles.jobLeft}>
                      <View style={styles.jobIconWrap}><Ionicons name="business" size={20} color={Colors.primary} /></View>
                      <View>
                        <Text style={styles.jobTitle}>Tech Hub HQ</Text>
                        <Text style={styles.jobSub}>Standard Floor Care</Text>
                      </View>
                    </View>
                    <Text style={styles.jobDate}>Oct 24</Text>
                  </View>
                  <View style={styles.jobCard}>
                    <View style={styles.jobLeft}>
                      <View style={styles.jobIconWrap}><Ionicons name="business-outline" size={20} color={Colors.primary} /></View>
                      <View>
                        <Text style={styles.jobTitle}>Harbor Plaza</Text>
                        <Text style={styles.jobSub}>Safety Inspection</Text>
                      </View>
                    </View>
                    <Text style={styles.jobDate}>Oct 22</Text>
                  </View>
                </View>
              </View>

              {/* Document Links */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Document Links</Text>
                <View style={styles.docGrid}>
                  <TouchableOpacity style={styles.docBtn}>
                    <Ionicons name="finger-print" size={20} color="#57657a" />
                    <Text style={styles.docTxt}>ID_Verification.pdf</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.docBtn}>
                    <Ionicons name="document-text" size={20} color="#57657a" />
                    <Text style={styles.docTxt}>Cert_SOP.docx</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        {[
          { icon: 'grid-outline', label: 'Dashboard', active: false },
          { icon: 'people', label: 'Staff', active: true },
          { icon: 'calendar-outline', label: 'Schedule', active: false },
          { icon: 'settings-outline', label: 'Settings', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? Colors.primary : Colors.dark.textMuted} />
            </View>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(15, 15, 27, 0.7)', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { paddingRight: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: 100, paddingTop: Spacing.md },

  // ── Hero ───────────────────────────────────────────────────────────────────
  heroSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, marginBottom: Spacing.lg },
  heroSub: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginBottom: 2 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  inviteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.full, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  inviteBtnTxt: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '700' },

  // ── Chips ──────────────────────────────────────────────────────────────────
  chipsWrap: { gap: Spacing.sm, marginBottom: Spacing.lg, maxHeight: 40 },
  chipActive: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, alignSelf: 'flex-start' },
  chipTxtActive: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '600' },
  chip: { backgroundColor: Colors.dark.cardAlt, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.dark.border },
  chipTxt: { color: Colors.dark.textSub, fontSize: FontSize.sm, fontWeight: '600' },

  // ── Staff List ─────────────────────────────────────────────────────────────
  listWrap: { gap: Spacing.md },
  staffCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardUser: { flexDirection: 'row', gap: Spacing.md },
  avatarWrap: { position: 'relative', width: 56, height: 56 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 28, backgroundColor: Colors.dark.surface },
  statusIndicator: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: Colors.dark.cardAlt },
  staffName: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 2 },
  staffRole: { fontSize: 11, fontWeight: '600', color: Colors.dark.textSub, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(213,227,252,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.md },
  ratingTxt: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  cardBot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  actionCircleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  
  subStatusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  subStatusTxt: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusPill: { backgroundColor: Colors.dark.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusPillTxt: { fontSize: 10, fontWeight: '800', color: Colors.dark.textSub, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── FAB ────────────────────────────────────────────────────────────────────
  fab: { position: 'absolute', bottom: 100, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8, zIndex: 40 },

  // ── Profile Modal ──────────────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.dark.cardAlt, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalDragHandle: { width: 48, height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, alignSelf: 'center', marginTop: 16, marginBottom: 16 },
  
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl },
  modalUserRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  modalAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.dark.surface },
  modalName: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  modalRole: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },

  modalScroll: { paddingHorizontal: Spacing.xl },
  
  perfBox: { backgroundColor: Colors.dark.card, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.dark.border },
  perfHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.md },
  perfLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginBottom: 2 },
  perfValue: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  trendWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trendTxt: { fontSize: FontSize.sm, fontWeight: '700', color: '#10b981' },
  
  chartBarsWrap: { height: 64, flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingHorizontal: 4 },
  chartBar: { flex: 1, borderTopLeftRadius: 2, borderTopRightRadius: 2 },

  sectionBlock: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginBottom: 12, paddingHorizontal: 4 },
  jobCards: { gap: Spacing.sm },
  jobCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.dark.card, borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.md, borderRadius: Radius.lg },
  jobLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  jobIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(108, 99, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
  jobTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text, marginBottom: 2 },
  jobSub: { fontSize: 11, color: Colors.dark.textSub },
  jobDate: { fontSize: 11, fontWeight: '800', color: Colors.dark.textMuted },

  docGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  docBtn: { flex: 1, minWidth: '45%', flexDirection: 'row', alignItems: 'center', gap: 8, padding: Spacing.md, backgroundColor: Colors.dark.card, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border },
  docTxt: { fontSize: 11, fontWeight: '800', color: Colors.primary },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(15, 15, 27, 0.9)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: 'rgba(108, 99, 255, 0.15)' },
  navLabel: { fontSize: 10, fontWeight: '700', color: Colors.dark.textSub, letterSpacing: 0.5, textTransform: 'uppercase' },
  navLabelActive: { color: Colors.primary },
});

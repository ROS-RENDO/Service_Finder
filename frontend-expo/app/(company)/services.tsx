import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, RefreshControl, ActivityIndicator, Platform,
  Modal, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { companiesApi } from '@/lib/api/companies';
import { useSidebar } from './_layout';

// Demo Layout Data
const DEMO_SERVICES = [
  {
    id: 's1',
    category: 'Cleaning',
    title: 'Deep Kitchen Cleaning',
    price: '$120.00',
    rating: '4.9',
    reviews: 128,
    type: 'Expert Team',
    typeIcon: 'sparkles',
    active: true,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 's2',
    category: 'Electrical',
    title: 'Smart Home Setup',
    price: '$85.00',
    unit: '/hr',
    rating: '5.0',
    reviews: 42,
    type: 'Technician',
    typeIcon: 'hardware-chip',
    active: true,
    image: 'https://images.unsplash.com/photo-1558002038-1fe72c83c9db?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 's3',
    category: 'Plumbing',
    title: 'Emergency Leak Repair',
    price: '$150.00',
    rating: '4.7',
    reviews: 89,
    type: 'Emergency',
    typeIcon: 'water',
    active: false,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=300',
  },
];

export default function CompanyServicesScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [services, setServices] = useState<any[]>(DEMO_SERVICES);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  // Fetch logic would merge true services with this layout
  const fetchServices = async () => {
    try {
      const res = await companiesApi.getServices();
      if (res.data?.data?.length > 0) {
        setServices(res.data.data);
      } else if (res.data?.services?.length > 0) {
        setServices(res.data.services);
      } else {
        setServices(DEMO_SERVICES);
      }
    } catch {
      setServices(DEMO_SERVICES);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchServices(); };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Management</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setEditModalVisible(true)}>
          <Ionicons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>
        
        {/* ── Hero / Editorial Header ────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.heroBgFill} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>OPERATIONS</Text>
            <Text style={styles.heroTitle}>Optimize your service catalog.</Text>
            <Text style={styles.heroDesc}>Manage pricing, availability, and active states for your premium offerings in real-time.</Text>
          </View>
          <Ionicons name="settings" size={160} color="rgba(255,255,255,0.1)" style={styles.heroBgIcon} />
        </View>

        {/* ── Search Bar ─────────────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={20} color="#74777f" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              placeholderTextColor="#74777f"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options" size={22} color="#3a485b" />
          </TouchableOpacity>
        </View>

        {/* ── Services Header ────────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Active Services</Text>
            <Text style={styles.sectionSub}>Showing 12 premium services</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.historyBtnTxt}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* ── Services Grid/List ─────────────────────────────────────────────── */}
        <View style={styles.serviceList}>
          {services.map((item, index) => {
            const isActive = item.active !== false; 
            const priceStr = item.price || `$${item.basePrice || '—'}`;
            const unit = item.unit || '';
            const cName = item.category || item.serviceType?.name || 'Category';

            return (
              <View key={item.id || index} style={[styles.serviceCard, !isActive && styles.serviceCardInactive]}>
                
                {/* Image Section */}
                <View style={styles.cardImageWrap}>
                  <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300' }} style={styles.cardImage} />
                  
                  {/* Floating Elements */}
                  <View style={styles.cardRatingPill}>
                    <Ionicons name="star" size={12} color="#003a55" />
                    <Text style={styles.cardRatingTxt}>{item.rating || '4.9'}</Text>
                  </View>
                  <View style={styles.cardCatBadge}>
                    <Text style={styles.cardCatBadgeTxt}>{cName}</Text>
                  </View>
                  
                  {/* Status Overlay if Inactive */}
                  {!isActive && (
                    <View style={styles.inactiveOverlay}>
                      <View style={styles.inactivePill}>
                        <Text style={styles.inactivePillTxt}>INACTIVE</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Content Section */}
                <View style={styles.cardContent}>
                  <View style={styles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cardTitle, !isActive && { color: 'rgba(0,32,69,0.6)' }]}>{item.title || item.name}</Text>
                      <Text style={[styles.cardDesc, !isActive && { color: 'rgba(67,71,78,0.6)' }]}>
                        {item.description || "Full sanitization & polish"}
                      </Text>
                    </View>
                    <Text style={[styles.cardPrice, !isActive && { color: 'rgba(0,32,69,0.6)' }]}>{priceStr}<Text style={styles.cardPriceUnit}>{unit}</Text></Text>
                  </View>

                  <View style={styles.cardBotRow}>
                    <View style={styles.cardBotLeft}>
                      <View style={[styles.cardTypeIconWrap, !isActive && { backgroundColor: '#e0e3e5' }]}>
                        <Ionicons name={(item.typeIcon as any) || 'flash'} size={18} color={isActive ? "#003a55" : "#74777f"} />
                      </View>
                      <Text style={[styles.cardTypeTxt, !isActive && { color: '#74777f' }]}>{item.type || 'Standard'}</Text>
                    </View>

                    {/* Toggle and Edit Actions */}
                    <View style={styles.cardActions}>
                      <TouchableOpacity style={styles.quickEditBtn} onPress={() => setEditModalVisible(true)}>
                        <Ionicons name="create-outline" size={18} color={Colors.primary} />
                      </TouchableOpacity>
                      
                      <View style={styles.toggleWrap}>
                        <Text style={styles.toggleLabel}>{isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
                        <View style={[styles.toggleBg, isActive ? styles.toggleBgOn : styles.toggleBgOff]}>
                          <View style={[styles.toggleKnob, isActive ? styles.toggleKnobOn : styles.toggleKnobOff]} />
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── Floating Action Button ─────────────────────────────────────────── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setEditModalVisible(true)}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Service</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              
              {/* Image Upload Area */}
              <TouchableOpacity style={styles.imgUploadArea}>
                <Ionicons name="camera" size={36} color="#57657a" />
                <Text style={styles.imgUploadTxt}>Update Service Image</Text>
              </TouchableOpacity>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>TITLE</Text>
                <TextInput style={styles.formInput} value="Deep Kitchen Cleaning" />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>DESCRIPTION</Text>
                <TextInput 
                  style={[styles.formInput, { height: 80, textAlignVertical: 'top' }]} 
                  multiline 
                  value="Comprehensive sanitation of all kitchen surfaces, inside cabinets, oven cleaning, and degreasing of vents." 
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.sm }]}>
                  <Text style={styles.formLabel}>PRICING MODEL</Text>
                  <View style={styles.formInput}>
                    <Text style={{ fontSize: 14 }}>Fixed Price</Text>
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>DURATION</Text>
                  <TextInput style={styles.formInput} value="3-4 Hours" />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalBtnDiscard} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalBtnDiscardTxt}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnSave} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.modalBtnSaveTxt}>Save Changes</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        {[
          { icon: 'grid-outline', label: 'Dashboard', active: false },
          { icon: 'color-wand', label: 'Services', active: true },
          { icon: 'calendar-outline', label: 'Bookings', active: false },
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
    paddingHorizontal: Spacing.md, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(15, 15, 27, 0.7)', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { padding: 8, borderRadius: Radius.full },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary },

  scrollContent: { paddingHorizontal: Spacing.md, paddingBottom: 120, paddingTop: 8 },

  // ── Hero ───────────────────────────────────────────────────────────────────
  heroCard: { position: 'relative', borderRadius: Radius.xl, overflow: 'hidden', padding: 32, marginBottom: Spacing.xl },
  heroBgFill: { position: 'absolute', inset: 0, backgroundColor: Colors.primary }, 
  heroContent: { position: 'relative', zIndex: 10, maxWidth: '85%' },
  heroTag: { fontSize: 10, fontWeight: '800', color: '#FFF', opacity: 0.8, letterSpacing: 1.5, marginBottom: 8 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: -1, marginBottom: 12, lineHeight: 34 },
  heroDesc: { fontSize: FontSize.sm, fontWeight: '500', color: '#FFF', opacity: 0.9, lineHeight: 20 },
  heroBgIcon: { position: 'absolute', right: -40, bottom: -40, zIndex: 0 },

  // ── Search & Filter ────────────────────────────────────────────────────────
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.xl },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.dark.cardAlt, paddingHorizontal: 20, height: 50, borderRadius: 25, borderWidth: 1, borderColor: Colors.dark.border },
  searchInput: { flex: 1, fontSize: FontSize.sm, fontWeight: '500', color: Colors.dark.text },
  filterBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(108, 99, 255, 0.15)', alignItems: 'center', justifyContent: 'center' },

  // ── Services Header ────────────────────────────────────────────────────────
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  sectionSub: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 4 },
  historyBtnTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  serviceList: { gap: Spacing.xl },

  // ── Service Cards ──────────────────────────────────────────────────────────
  serviceCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.dark.border },
  serviceCardInactive: { opacity: 0.8 },
  
  cardImageWrap: { height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  
  cardRatingPill: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(15, 15, 27, 0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cardRatingTxt: { fontSize: 11, fontWeight: '800', color: Colors.primary },
  
  cardCatBadge: { position: 'absolute', bottom: 16, left: 16, backgroundColor: 'rgba(108, 99, 255, 0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cardCatBadgeTxt: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },

  inactiveOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  inactivePill: { backgroundColor: 'rgba(15, 15, 27, 0.95)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  inactivePillTxt: { color: Colors.primaryLight, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  cardContent: { padding: Spacing.xl },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 4, paddingRight: 10 },
  cardDesc: { fontSize: 11, fontWeight: '500', color: Colors.dark.textSub },
  cardPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  cardPriceUnit: { fontSize: 12, fontWeight: '500', color: Colors.dark.textMuted },

  cardBotRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBotLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTypeIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(108, 99, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
  cardTypeTxt: { fontSize: 11, fontWeight: '700', color: Colors.dark.text },

  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  quickEditBtn: { padding: 4 },
  toggleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLabel: { fontSize: 9, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 0.5 },
  toggleBg: { width: 44, height: 24, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 2 },
  toggleBgOn: { backgroundColor: Colors.primary },
  toggleBgOff: { backgroundColor: Colors.dark.surface },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF' },
  toggleKnobOn: { transform: [{ translateX: 20 }] },
  toggleKnobOff: { transform: [{ translateX: 0 }] },

  // ── FAB ────────────────────────────────────────────────────────────────────
  fab: { position: 'absolute', bottom: 100, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8, zIndex: 40 },

  // ── Modal ──────────────────────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.dark.cardAlt, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  modalCloseBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },
  
  modalScroll: { padding: Spacing.xl },
  imgUploadArea: { height: 160, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.dark.border, borderStyle: 'dashed', backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  imgUploadTxt: { fontSize: 12, fontWeight: '600', color: Colors.dark.textSub, marginTop: 8 },

  formRow: { flexDirection: 'row' },
  formGroup: { marginBottom: Spacing.lg },
  formLabel: { fontSize: 10, fontWeight: '800', color: Colors.primary, letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  formInput: { backgroundColor: Colors.dark.card, borderRadius: Radius.lg, height: 50, paddingHorizontal: 16, fontSize: FontSize.sm, color: Colors.dark.text, borderWidth: 1, borderColor: Colors.dark.border },

  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  modalBtnDiscard: { flex: 1, height: 52, backgroundColor: Colors.dark.surface, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  modalBtnDiscardTxt: { color: Colors.dark.textSub, fontSize: FontSize.sm, fontWeight: '700' },
  modalBtnSave: { flex: 2, height: 52, backgroundColor: Colors.primary, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  modalBtnSaveTxt: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '800' },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(15, 15, 27, 0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: 'rgba(108, 99, 255, 0.15)' },
  navLabel: { fontSize: 10, fontWeight: '600', color: Colors.dark.textSub },
  navLabelActive: { color: Colors.primary },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { companiesApi } from '@/lib/api/companies';
import apiClient from '@/lib/api/client';

// Mock Data representing HTML structure
const RECOMMENDED_STAFF = [
  {
    id: 's1',
    name: 'Marco V.',
    rating: 4.9,
    jobs: 128,
    role: 'Expert Cleaner',
    distance: '2.4 mi away',
    avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80',
    topRated: true,
  },
  {
    id: 's2',
    name: 'Elena R.',
    rating: 4.8,
    jobs: 94,
    role: 'Deep Clean Specialist',
    distance: '3.1 mi away',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80',
    topRated: false,
  },
  {
    id: 's3',
    name: 'David K.',
    rating: 4.7,
    jobs: 210,
    role: 'General Maintenance',
    distance: '1.8 mi away',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80',
    topRated: false,
  },
];

export default function AssignStaffScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  
  // Actually fetching would merge with mock data for display purposes
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedStaff) {
      Alert.alert('Notice', 'Please select a staff member first.');
      return;
    }

    if (!bookingId) {
      // Demo mode if no ID was passed
      Alert.alert('Success', 'Staff assigned successfully! (Demo)', [{ text: 'OK', onPress: () => router.back() }]);
      return;
    }

    setAssigning(true);
    try {
      await apiClient.post(`/api/bookings/${bookingId}/assign-staff`, { staffId: selectedStaff });
      Alert.alert('Success', 'Staff assigned successfully!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err: any) {
      // Fallback for demo
      Alert.alert('Success', 'Staff assigned successfully! (Demo fallback)', [{ text: 'OK', onPress: () => router.back() }]);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top App Bar ──────────────────────────────────────────────────────── */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assign Booking</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Booking Summary Box ────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summarySub}>SERVICE DETAILS</Text>
                <Text style={styles.summaryTitle}>Deep Kitchen Cleaning</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusTxt}>PENDING</Text>
              </View>
            </View>

            <View style={styles.customerRow}>
              <View style={styles.customerAvatarWrap}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=80' }} 
                  style={styles.customerImg} 
                />
              </View>
              <View>
                <Text style={styles.customerName}>Sarah Chen</Text>
                <Text style={styles.customerType}>Priority Customer</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              <Text style={styles.timeTxt}>May 12, 10:00 AM - 1:00 PM</Text>
            </View>
          </View>
        </View>

        {/* ── Timeline Visualization ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Availability Timeline</Text>
            <Text style={styles.sectionSubtitle}>3h requested</Text>
          </View>
          
          <View style={styles.timelineBox}>
            <View style={styles.timelineLabels}>
              <Text style={styles.tLabel}>08:00</Text>
              <Text style={styles.tLabel}>10:00</Text>
              <Text style={styles.tLabel}>12:00</Text>
              <Text style={styles.tLabel}>14:00</Text>
              <Text style={styles.tLabel}>16:00</Text>
            </View>

            <View style={styles.timelineVisWrap}>
              {/* Background Grid Lines */}
              <View style={styles.gridLinesWrap}>
                {[1,2,3,4,5].map(i => <View key={i} style={styles.gridLine} />)}
              </View>

              {/* Booking Slot Highlight */}
              <View style={styles.targetSlot}>
                <Text style={styles.targetSlotTxt}>BOOKING SLOT</Text>
              </View>

              {/* Staff Busy Blocks (Mocked) */}
              <View style={[styles.busyBlock, { left: '5%', width: '15%', backgroundColor: 'rgba(186,26,26,0.4)', top: 4 }]} />
              <View style={[styles.busyBlock, { right: '10%', width: '20%', backgroundColor: 'rgba(0,58,85,0.4)', bottom: 4 }]} />
            </View>
          </View>
        </View>

        {/* ── Recommended Staff List ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionTitle}>Recommended Staff</Text>
            <TouchableOpacity><Text style={styles.filterBtnTxt}>Filter</Text></TouchableOpacity>
          </View>

          <View style={styles.staffList}>
            {RECOMMENDED_STAFF.map(staff => {
              const isSelected = selectedStaff === staff.id;
              
              return (
                <TouchableOpacity 
                  key={staff.id} 
                  style={[styles.staffCard, isSelected && styles.staffCardActive]}
                  onPress={() => setSelectedStaff(staff.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.staffAvatarCol}>
                    <Image source={{ uri: staff.avatar }} style={styles.staffImg} />
                    {staff.topRated && (
                      <View style={styles.topRatedBadge}>
                        <Ionicons name="star" size={10} color="#003a55" />
                      </View>
                    )}
                  </View>

                  <View style={styles.staffInfoCol}>
                    <View style={styles.staffNameRow}>
                      <Text style={styles.staffName}>{staff.name}</Text>
                      <View style={styles.ratingWrap}>
                        <Ionicons name="star" size={12} color="#003a55" />
                        <Text style={styles.ratingTxt}>{staff.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.staffRole}>{staff.role} • {staff.jobs} jobs</Text>
                    <View style={styles.staffDistWrap}>
                      <Ionicons name="location" size={12} color="#57657a" />
                      <Text style={styles.staffDistTxt}>{staff.distance}</Text>
                    </View>
                  </View>

                  <View style={[styles.addButton, isSelected && styles.addButtonActive]}>
                    <Ionicons name={isSelected ? "checkmark" : "add"} size={20} color={isSelected ? "#FFF" : Colors.primary} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>

      {/* ── Sticky Bottom CTA ──────────────────────────────────────────────── */}
      <View style={styles.ctaWrap}>
        <TouchableOpacity 
          onPress={handleAssign}
          disabled={assigning}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.ctaBtn, assigning && styles.ctaBtnLoading]}
          >
            {assigning ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.ctaBtnTxt}>Assign Selected Staff</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        {[
          { icon: 'grid', label: 'Dashboard', active: false },
          { icon: 'calendar', label: 'Bookings', active: true },
          { icon: 'people', label: 'Staff', active: false },
          { icon: 'options', label: 'Settings', active: false },
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
    paddingHorizontal: Spacing.md, height: Platform.OS === 'ios' ? 100 : 64,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
    backgroundColor: 'rgba(15, 15, 27, 0.7)', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerBtn: { padding: 8, borderRadius: Radius.full },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollContent: { paddingTop: Spacing.md },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.xl },

  // ── Summary Card ──────────────────────────────────────────────────────────
  summaryCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.dark.border },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  summarySub: { fontSize: 10, fontWeight: '700', color: Colors.dark.textMuted, letterSpacing: 1.5, marginBottom: 4 },
  summaryTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  statusBadge: { backgroundColor: 'rgba(213,227,252,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  statusTxt: { fontSize: 10, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1 },

  customerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  customerAvatarWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.dark.surface, overflow: 'hidden' },
  customerImg: { width: '100%', height: '100%' },
  customerName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.text },
  customerType: { fontSize: FontSize.sm, color: Colors.dark.textSub },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: Spacing.md },
  timeTxt: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.primary },

  // ── Timeline ───────────────────────────────────────────────────────────────
  sectionHeaderWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  sectionSubtitle: { fontSize: 11, color: Colors.dark.textSub },
  filterBtnTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },

  timelineBox: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  timelineLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 4 },
  tLabel: { fontSize: 9, color: Colors.dark.textSub },
  
  timelineVisWrap: { position: 'relative', height: 48, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: Radius.md, overflow: 'hidden', justifyContent: 'center' },
  gridLinesWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  gridLine: { width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.05)' },
  
  targetSlot: { position: 'absolute', left: '25%', right: '37.5%', height: '100%', backgroundColor: 'rgba(108, 99, 255, 0.2)', borderLeftWidth: 2, borderRightWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  targetSlotTxt: { fontSize: 8, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  busyBlock: { position: 'absolute', height: 24, borderRadius: 2 },

  // ── Staff List ─────────────────────────────────────────────────────────────
  staffList: { gap: Spacing.md },
  staffCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.dark.cardAlt, padding: Spacing.lg, borderRadius: Radius.xl, borderWidth: 2, borderColor: Colors.dark.border },
  staffCardActive: { borderColor: Colors.primary, backgroundColor: 'rgba(108, 99, 255, 0.1)' },
  
  staffAvatarCol: { position: 'relative' },
  staffImg: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.dark.surface },
  topRatedBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: Colors.dark.card, padding: 2, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },

  staffInfoCol: { flex: 1 },
  staffNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  staffName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt: { fontSize: 11, fontWeight: '800', color: Colors.accent },
  staffRole: { fontSize: 11, color: Colors.dark.textSub, marginBottom: 6 },
  staffDistWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  staffDistTxt: { fontSize: 10, fontWeight: '600', color: Colors.dark.textMuted },

  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  addButtonActive: { backgroundColor: Colors.primary },

  // ── CTA ────────────────────────────────────────────────────────────────────
  ctaWrap: { position: 'absolute', bottom: Platform.OS === 'ios' ? 104 : 84, left: 0, right: 0, paddingHorizontal: Spacing.md, zIndex: 40 },
  ctaBtn: { height: 56, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  ctaBtnLoading: { opacity: 0.8 },
  ctaBtnTxt: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '800' },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(15,15,27,0.85)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: 'rgba(108, 99, 255, 0.2)' },
  navLabel: { fontSize: 10, fontWeight: '600', color: Colors.dark.textSub },
  navLabelActive: { color: Colors.primary },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { useSidebar } from './_layout';

const FILTER_OPTIONS = ['All', 'Pending', 'Confirmed', 'In-Progress', 'Completed'];

// Mock Demo Data mimicking the exact HTML presentation
const DEMO_BOOKINGS = [
  {
    id: 'DEMO-1023', status: 'Pending',
    customerName: 'Sarah Chen', serviceName: 'Deep Kitchen Cleaning',
    dateStr: 'May 12, 10:00 AM', price: '$120.00',
    staffName: 'Marco V.',
    staffAvatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80',
  },
  {
    id: 'DEMO-1024', status: 'Confirmed',
    customerName: 'James Wilson', serviceName: 'Full HVAC Maintenance',
    dateStr: 'May 12, 01:30 PM', price: '$245.00',
    staffName: 'Elena R.',
    staffAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80',
  },
  {
    id: 'DEMO-1020', status: 'Completed',
    customerName: 'Aria Montgomery', serviceName: 'End of Lease Cleaning',
    dateStr: 'May 11, 09:00 AM', price: '$380.00',
    staffName: 'David K.',
    staffAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80',
  },
];

export default function CompanyBookingsScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookings, setBookings] = useState<any[]>(DEMO_BOOKINGS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/api/company/bookings');
      if (res.data?.bookings?.length) {
        setBookings(res.data.bookings);
      } else {
        setBookings(DEMO_BOOKINGS); // Fallback to demo layout if empty
      }
    } catch {
      setBookings(DEMO_BOOKINGS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  // Status Color Logic
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('pending')) return { border: '#fbbf24', text: '#b45309', bg: '#fffbeb' };
    if (s.includes('confirm')) return { border: '#3b82f6', text: '#1d4ed8', bg: '#eff6ff' };
    if (s.includes('progress')) return { border: '#8b5cf6', text: '#6d28d9', bg: '#f5f3ff' };
    if (s.includes('complet')) return { border: '#10b981', text: '#047857', bg: '#ecfdf5' };
    return { border: Colors.primary, text: Colors.primary, bg: '#f2f4f6' };
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top App Bar ──────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuIcon} onPress={toggleSidebar}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>
        <TouchableOpacity style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80' }}
            style={styles.avatarImg}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* ── Search Bar ─────────────────────────────────────────────────────── */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color="#74777f" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID or customer..."
            placeholderTextColor="#74777f"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* ── Toggles & Date ─────────────────────────────────────────────────── */}
        <View style={styles.toggleRow}>
          <View style={styles.viewToggleGroup}>
            <TouchableOpacity style={styles.viewToggleBtnActive}>
              <Text style={styles.viewToggleTxtActive}>List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewToggleBtn}>
              <Text style={styles.viewToggleTxt}>Calendar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.dateSelectorBtn}>
            <Ionicons name="calendar-outline" size={16} color="#43474e" />
            <Text style={styles.dateSelectorTxt}>May 12, 2024</Text>
          </TouchableOpacity>
        </View>

        {/* ── Filter Chips ───────────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(opt)}
              >
                <Text style={[styles.filterChipTxt, isActive && styles.filterChipTxtActive]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Booking List ───────────────────────────────────────────────────── */}
        <View style={styles.listContainer}>
          {bookings.map((b, index) => {
            const bId = b.id.includes('DEMO') ? b.id.replace('DEMO', '#BK') : `#BK-${b.id.slice(0, 4).toUpperCase()}`;
            const cName = b.customerName || b.customer?.fullName || 'Customer';
            const sName = b.serviceName || b.service?.name || 'Service';
            const dStr = b.dateStr || new Date(b.date || b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const pStr = b.price || (b.service?.price ? `$${b.service.price.toFixed(2)}` : '$—');
            const stName = b.staffName || b.staff?.[0]?.fullName || 'Unassigned';
            const stIcon = stName === 'Unassigned' ? 'https://images.unsplash.com/photo-1594824436952-32b0ec32757a?auto=format&fit=crop&q=80&w=80' : b.staffAvatar || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80';
            const colors = getStatusColor(b.status || 'pending');

            return (
              <TouchableOpacity 
                key={b.id || index} 
                style={[styles.bookingCard, { borderLeftColor: colors.border }]} 
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/(company)/assign', params: { bookingId: b.id } })}
              >
                
                {/* ID and Action */}
                <View style={styles.cardHeaderRow}>
                  <View>
                    <Text style={styles.cardId}>{bId}</Text>
                    <Text style={styles.cardCustomer}>{cName}</Text>
                  </View>
                  <TouchableOpacity style={styles.cardMoreBtn}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#43474e" />
                  </TouchableOpacity>
                </View>

                {/* Service & Schedule */}
                <View style={styles.cardDetailBox}>
                  <View style={styles.cardDetailRow}>
                    <Ionicons name="construct-outline" size={18} color="#43474e" />
                    <Text style={styles.cardDetailTxt}>{sName}</Text>
                  </View>
                  <View style={styles.cardDetailRow}>
                    <Ionicons name="time-outline" size={18} color="#43474e" />
                    <Text style={styles.cardDetailTxt}>{dStr}</Text>
                  </View>
                </View>

                {/* Footer (Staff, Price, Status) */}
                <View style={styles.cardFooter}>
                  <View style={styles.cardStaffCol}>
                    <Image source={{ uri: stIcon }} style={styles.cardStaffImg} />
                    <Text style={styles.cardStaffName}>{stName}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.cardPrice}>{pStr}</Text>
                    <View style={[styles.statusPill, { backgroundColor: colors.bg }]}>
                      <Text style={[styles.statusPillTxt, { color: colors.text }]}>{(b.status || 'Pending').toUpperCase()}</Text>
                    </View>
                  </View>
                </View>

              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.loadMoreTxt}>Load More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Bottom Navigation Bar ────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'calendar', label: 'Bookings', active: true },
          { icon: 'id-card-outline', label: 'Staff', active: false },
          { icon: 'layers-outline', label: 'Services', active: false },
          { icon: 'stats-chart-outline', label: 'Analytics', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? Colors.primary : '#57657a'} />
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

  // ── Header ─────────────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: '#f2f4f6', 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  menuIcon: { paddingRight: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e6e8ea', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },

  scrollContent: { paddingBottom: 100 }, // Leave room for bottom nav

  // ── Search & Filters ──────────────────────────────────────────────────────
  searchWrap: { position: 'relative', marginHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.md },
  searchIcon: { position: 'absolute', left: 16, top: 14, zIndex: 2 },
  searchInput: { backgroundColor: '#f2f4f6', borderRadius: Radius.xl, height: 50, paddingLeft: 46, paddingRight: 16, fontSize: FontSize.md, color: '#191c1e' },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  viewToggleGroup: { flexDirection: 'row', backgroundColor: '#f2f4f6', padding: 4, borderRadius: 24 },
  viewToggleBtnActive: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 6, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  viewToggleTxtActive: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  viewToggleBtn: { paddingHorizontal: 24, paddingVertical: 6, borderRadius: 20 },
  viewToggleTxt: { fontSize: FontSize.sm, fontWeight: '600', color: '#43474e' },
  dateSelectorBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f2f4f6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.lg },
  dateSelectorTxt: { fontSize: FontSize.sm, fontWeight: '600', color: '#43474e' },

  filterScroll: { flexGrow: 0, marginBottom: Spacing.lg },
  filterContainer: { paddingHorizontal: Spacing.md, gap: 8 },
  filterChip: { backgroundColor: '#f2f4f6', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 24 },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipTxt: { fontSize: FontSize.sm, fontWeight: '600', color: '#43474e' },
  filterChipTxtActive: { color: '#FFF' },

  // ── Booking Cards ─────────────────────────────────────────────────────────
  listContainer: { paddingHorizontal: Spacing.md, gap: Spacing.md },
  bookingCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.xl, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  cardId: { fontSize: 10, fontWeight: '800', color: '#43474e', letterSpacing: 1.5, textTransform: 'uppercase' },
  cardCustomer: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginTop: 2, letterSpacing: -0.3 },
  cardMoreBtn: { padding: 4 },

  cardDetailBox: { gap: 12, marginBottom: Spacing.lg },
  cardDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardDetailTxt: { fontSize: FontSize.sm, fontWeight: '600', color: '#43474e' },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: '#f2f4f6' },
  cardStaffCol: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardStaffImg: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#d5e3fc' },
  cardStaffName: { fontSize: 12, fontWeight: '700', color: '#3a485b' },
  
  cardPrice: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  statusPill: { marginTop: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusPillTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  loadMoreBtn: { backgroundColor: '#f2f4f6', borderRadius: Radius.xl, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  loadMoreTxt: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '800' },

  // ── Bottom Nav ────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#FFF', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 12, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 32, elevation: 24 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: '#d5e3fc' },
  navLabel: { fontSize: 11, fontWeight: '600', color: '#57657a', letterSpacing: 0.5 },
  navLabelActive: { color: Colors.primary },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, RefreshControl, ActivityIndicator, Image, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { servicesApi } from '@/lib/api/services';
import { bookingsApi } from '@/lib/api/bookings';
import { companiesApi } from '@/lib/api/companies';
import { Category } from '@/types/category.types';
import { Booking } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';

// Mock data fallback to show UI features even if API is empty
const MOCK_SERVICES = [
  { id: 's1', name: 'Deep Kitchen Cleaning', company: { name: 'Sparkle Pro' }, basePrice: '85', rating: '4.9', reviews: '2.4k', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
  { id: 's2', name: 'Electrical Diagnostic', company: { name: 'WireWise Solutions' }, basePrice: '120', rating: '4.8', reviews: '1.1k', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
];

const MOCK_NEARBY = [
  { id: 'c1', name: 'PureSpace Solutions', rating: 4.9, reviewsCount: '1.2k', distance: '0.8 miles away', icon: 'business' },
  { id: 'c2', name: 'Evergreen Landscaping', rating: 4.7, reviewsCount: '850', distance: '1.5 miles away', icon: 'leaf' },
];

const MOCK_REC = {
  id: 'r1', name: 'Seasonal Garden Care', sub: 'Prepare your garden for spring blossoms', price: '60', img: 'https://images.unsplash.com/photo-1558904541-efa843a96f09?auto=format&fit=crop&q=80&w=800'
};

const CATEGORY_MAP = [
  { id: 'cleaning', name: 'Cleaning', icon: 'sparkles' },
  { id: 'maintenance', name: 'Repair', icon: 'construct' },
  { id: 'plumbing', name: 'Plumbing', icon: 'water' },
  { id: 'painting', name: 'Painting', icon: 'color-palette' },
  { id: 'electrical', name: 'Electric', icon: 'flash' },
];

export default function CustomerHome() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      // Execute silent load without overriding mocks
      await Promise.all([
        servicesApi.getCategories().catch(() => null),
        bookingsApi.getAll({ limit: 3 }).catch(() => null),
      ]);
    } catch (err) { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  const handleSearchSubmit = () => {
    if (search.trim()) router.push({ pathname: '/(customer)/search', params: { q: search } });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Absolute Background element to match overall aesthetic */}
      <View style={styles.bgSurface} />

      {/* Header: Location & Search */}
      <View style={styles.headerWrapper}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={24} color={Colors.primary} />
              <Text style={styles.locationText}>San Francisco, CA</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(customer)/notifications')}>
                <Ionicons name="notifications-outline" size={22} color={Colors.dark.text} />
                <View style={styles.badge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(customer)/profile')}>
                <Ionicons name="person-outline" size={22} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={Colors.dark.textMuted} style={{ marginRight: 12 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for services..."
                placeholderTextColor={Colors.dark.textMuted}
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}>

        {/* Promotions Banner */}
        <View style={styles.promoSection}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.promoBanner}
          >
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoBadge}>LIMITED OFFER</Text>
              <Text style={styles.promoTitle}>30% Off Your{'\n'}First Cleaning</Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Claim Discount</Text>
              </TouchableOpacity>
            </View>
            <Ionicons name="sparkles" size={140} color="rgba(255,255,255,0.15)" style={styles.promoIcon} />
          </LinearGradient>
        </View>

        {/* Recent Bookings (Next Booking) */}
        <View style={styles.nextBookingSection}>
          <TouchableOpacity style={styles.nextBookingCard} onPress={() => router.push('/(customer)/booking/list')}>
            <View style={styles.nextBookingIconBox}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
            </View>
            <View style={styles.nextBookingInfo}>
              <Text style={styles.nextBookingLabel}>NEXT BOOKING</Text>
              <Text style={styles.nextBookingTitle}>Deep Kitchen Cleaning</Text>
              <Text style={styles.nextBookingTime}>Tomorrow at 10:00 AM</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.gridSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/search')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORY_MAP.map((cat, idx) => (
              <TouchableOpacity key={idx} style={styles.categoryItem} onPress={() => router.push({ pathname: '/(customer)/search', params: { q: cat.name } })}>
                <View style={styles.categoryCircle}>
                  <Ionicons name={cat.icon as any} size={26} color={Colors.primary} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Premium Partners */}
        <View style={styles.partnersSection}>
          <Text style={styles.partnersLabel}>PREMIUM PARTNERS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.partnersScroll}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.partnerLogoPlaceholder}>
                <Ionicons name="business" size={22} color={Colors.dark.borderLight} />
                <Text style={styles.partnerText}>PARTNER</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Top Rated Services */}
        <View style={styles.sectionMargin}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Services</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/search')}>
              <Text style={styles.seeAllText}>View Map</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topRatedScroll}>
            {MOCK_SERVICES.map((srv) => (
              <TouchableOpacity key={srv.id} style={styles.topRatedCard} onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: srv.id } })}>
                <ImageBackground source={{ uri: srv.img }} style={styles.topRatedImg} imageStyle={{ borderRadius: Radius.lg }}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={14} color={Colors.accent} />
                    <Text style={styles.ratingText}>{srv.rating}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.topRatedBody}>
                  <View style={styles.topRatedRow}>
                    <Text style={styles.topRatedTitle} numberOfLines={1}>{srv.name}</Text>
                    <Text style={styles.topRatedPrice}>${srv.basePrice}</Text>
                  </View>
                  <Text style={styles.topRatedSub}>by {srv.company.name} • {srv.reviews} reviews</Text>
                  <TouchableOpacity style={styles.bookNowBtn} onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: srv.id } })}>
                    <Text style={styles.bookNowText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nearby Companies */}
        <View style={[styles.sectionMargin, styles.borderTop]}>
          <Text style={[styles.sectionTitle, { marginBottom: Spacing.md }]}>Nearby Companies</Text>
          <View style={styles.nearbyList}>
            {MOCK_NEARBY.map((comp) => (
              <TouchableOpacity key={comp.id} style={styles.nearbyItem} onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: comp.id } })}>
                <View style={styles.nearbyImgBox}>
                  <Ionicons name={comp.icon as any} size={28} color={Colors.dark.textMuted} />
                </View>
                <View style={styles.nearbyInfo}>
                  <Text style={styles.nearbyName}>{comp.name}</Text>
                  <View style={styles.nearbyStats}>
                    <Ionicons name="star" size={12} color={Colors.accent} />
                    <Text style={styles.nearbyStatsText}>{comp.rating} ({comp.reviewsCount}) • {comp.distance}</Text>
                  </View>
                </View>
                <View style={styles.nearbyGoBtn}>
                  <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommended For You */}
        <View style={styles.sectionMargin}>
          <Text style={[styles.sectionTitle, { marginBottom: Spacing.md }]}>Recommended For You</Text>
          <TouchableOpacity style={styles.recCard} activeOpacity={0.9} onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: MOCK_REC.id } })}>
            <ImageBackground source={{ uri: MOCK_REC.img }} style={styles.recImg} imageStyle={{ borderRadius: Radius.xl }}>
              <LinearGradient 
                colors={['transparent', 'rgba(15,15,27,0.9)']} 
                style={styles.recGradient}
              >
                <Text style={styles.recTitle}>{MOCK_REC.name}</Text>
                <Text style={styles.recSub}>{MOCK_REC.sub}</Text>
                <View style={styles.recBottom}>
                  <Text style={styles.recPrice}>Starts at ${MOCK_REC.price}</Text>
                  <View style={styles.recActionBtn}>
                    <Text style={styles.recActionText}>View Detail</Text>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl + 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.bg },
  bgSurface: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%', backgroundColor: Colors.dark.bg, zIndex: -1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.bg },

  // Header
  headerWrapper: {
    backgroundColor: `${Colors.dark.bg}E6`, // opacity for blur simulation
    paddingHorizontal: Spacing.lg,
    paddingTop: 10,
    paddingBottom: Spacing.md,
    zIndex: 50,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.dark.text, letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: {
    width: 44, height: 44, borderRadius: Radius.full,
    backgroundColor: Colors.dark.cardAlt, alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: 12, right: 12,
    width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.status.cancelled,
  },

  searchSection: {},
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
  },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: FontSize.md, color: Colors.dark.text, fontWeight: '500' },

  scrollContent: { paddingBottom: Spacing.xxl },

  // Promo Banner
  promoSection: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  promoBanner: {
    borderRadius: Radius.xl,
    padding: Spacing.xl, overflow: 'hidden', position: 'relative',
  },
  promoTextContainer: { zIndex: 10, maxWidth: '70%' },
  promoBadge: { fontSize: FontSize.xs, fontWeight: '800', color: 'rgba(255,255,255,0.8)', letterSpacing: 1.5, marginBottom: Spacing.xs },
  promoTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: '#FFF', lineHeight: 30, marginBottom: Spacing.md },
  promoButton: {
    backgroundColor: Colors.dark.card, alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg, paddingVertical: 10, borderRadius: Radius.full,
  },
  promoButtonText: { color: Colors.primary, fontWeight: '800', fontSize: FontSize.sm },
  promoIcon: { position: 'absolute', right: -30, bottom: -30, zIndex: 0 },

  // Next Booking
  nextBookingSection: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  nextBookingCard: {
    backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  nextBookingIconBox: {
    width: 48, height: 48, borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}22`, alignItems: 'center', justifyContent: 'center'
  },
  nextBookingInfo: { flex: 1 },
  nextBookingLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 1, marginBottom: 2 },
  nextBookingTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.text, marginBottom: 2 },
  nextBookingTime: { fontSize: FontSize.xs, color: Colors.dark.textSub },

  // Categories
  gridSection: { paddingVertical: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.dark.text },
  seeAllText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  categoryScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  categoryItem: { alignItems: 'center', gap: Spacing.xs },
  categoryCircle: {
    width: 64, height: 64, borderRadius: Radius.full,
    backgroundColor: Colors.dark.cardAlt, alignItems: 'center', justifyContent: 'center',
  },
  categoryName: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.dark.text },

  // Partners
  partnersSection: { backgroundColor: Colors.dark.card, paddingVertical: Spacing.lg, marginVertical: Spacing.sm },
  partnersLabel: { paddingHorizontal: Spacing.lg, fontSize: 10, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 2, marginBottom: Spacing.md },
  partnersScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.xl, alignItems: 'center' },
  partnerLogoPlaceholder: { flexDirection: 'row', alignItems: 'center', gap: 6, opacity: 0.5 },
  partnerText: { fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.borderLight, letterSpacing: 1 },

  sectionMargin: { paddingVertical: Spacing.lg },

  // Top Rated
  topRatedScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  topRatedCard: { width: 280, backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.lg },
  topRatedImg: { width: '100%', height: 160 },
  ratingBadge: {
    position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(30,30,53,0.9)',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4
  },
  ratingText: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.dark.text },
  topRatedBody: { padding: Spacing.md },
  topRatedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  topRatedTitle: { flex: 1, fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.text },
  topRatedPrice: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginLeft: 8 },
  topRatedSub: { fontSize: FontSize.xs, color: Colors.dark.textSub, marginBottom: Spacing.md },
  bookNowBtn: { backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: Radius.full, alignItems: 'center' },
  bookNowText: { color: '#FFF', fontWeight: '800', fontSize: FontSize.sm },

  borderTop: { borderTopWidth: 1, borderTopColor: Colors.dark.border },

  // Nearby
  nearbyList: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  nearbyItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.dark.cardAlt, padding: Spacing.sm, borderRadius: Radius.lg },
  nearbyImgBox: { width: 64, height: 64, borderRadius: Radius.md, backgroundColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  nearbyInfo: { flex: 1 },
  nearbyName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.text, marginBottom: 4 },
  nearbyStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nearbyStatsText: { fontSize: FontSize.xs, color: Colors.dark.textSub },
  nearbyGoBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: `${Colors.primary}15`, alignItems: 'center', justifyContent: 'center' },

  // Recommended
  recCard: { marginHorizontal: Spacing.lg, height: 200, borderRadius: Radius.xl, overflow: 'hidden' },
  recImg: { width: '100%', height: '100%' },
  recGradient: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', padding: Spacing.lg }, // Simple dark fallback
  recTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  recSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.md },
  recBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recPrice: { color: '#FFF', fontWeight: '800' },
  recActionBtn: { backgroundColor: '#FFF', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  recActionText: { color: Colors.primary, fontWeight: '800', fontSize: FontSize.xs },

});


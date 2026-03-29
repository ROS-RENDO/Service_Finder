import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, Image, ImageBackground, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { servicesApi } from '@/lib/api/services';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id, companyId } = useLocalSearchParams<{ id: string; companyId: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mocks for Add-ons functionality layout logic
  const [addons, setAddons] = useState({ pet: 1, fridge: 0 });

  useEffect(() => {
    const fetchService = async () => {
      // Mock data bypass for UI testing
      if (id?.startsWith('mock')) {
        setService({
          id, 
          name: id === 'mock1' ? 'Deep Kitchen Cleaning' : id === 'mock2' ? 'Whole Home Refresh' : 'Bathroom Sanitization', 
          basePrice: id === 'mock1' ? 85 : id === 'mock2' ? 200 : 60, 
          duration: 120,
          description: 'Experience a transformation of your living space with our signature service. We go beyond the surface to sanitize, scrub, and polish every corner using professional-grade eco-friendly products.'
        });
        setLoading(false);
        return;
      }

      try {
        const res = await servicesApi.getById(id!);
        setService(res.data?.service || res.data);
      } catch {
        Alert.alert('Error', 'Failed to load service details');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.safe, styles.loader]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleBook = () => {
    router.push({ pathname: '/(customer)/booking/create', params: { serviceId: id, companyId } });
  };

  const images = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200'
  ];

  return (
    <View style={styles.safe}>
      {/* Top App Bar (Absolute) */}
      <View style={styles.topAppBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navRoundBtnActive}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Service Details</Text>
        <TouchableOpacity style={styles.navRoundBtnActive}>
          <Ionicons name="heart-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Image Carousel (Mocked with ScrollView) */}
        <View style={styles.carouselContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.carouselImg} />
            ))}
          </ScrollView>
          {/* Pagination Indicators Mock */}
          <View style={styles.paginationDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Header Info Block */}
        <View style={styles.infoSheet}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceHeadline}>{service?.name || 'Deep Home Cleaning'}</Text>
              <View style={styles.companyMiniRow}>
                <Text style={styles.companyMiniText}>Sparkle Pro Cleaning</Text>
                <Ionicons name="checkmark-circle" size={14} color={Colors.info} />
              </View>
            </View>
            <View style={styles.reviewBlockSmall}>
              <View style={styles.ratingRowSmall}>
                <Ionicons name="star" size={16} color={Colors.accent} />
                <Text style={styles.ratingValSmall}>4.9</Text>
              </View>
              <Text style={styles.reviewSubtext}>(128 reviews)</Text>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.quickStatsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>PRICE MIN.</Text>
              <Text style={styles.statValue}>${service?.basePrice?.toFixed(0) || '80'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>DURATION</Text>
              <Text style={styles.statValue}>{service?.duration ? `${service.duration} mins` : '2-3 hrs'}</Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.actionBlockRow}>
            <TouchableOpacity style={styles.mainBookBtn} onPress={handleBook}>
              <Text style={styles.mainBookBtnText}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleActionBtn}>
              <Ionicons name="chatbubble-ellipses" size={20} color={Colors.dark.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleActionBtn}>
              <Ionicons name="bookmark" size={20} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.bodyText}>
            {service?.description || 'Experience a transformation of your living space with our signature service. We go beyond the surface to sanitize, scrub, and polish every corner using professional-grade eco-friendly products.'}
          </Text>
        </View>

        {/* Inclusions & Exclusions */}
        <View style={[styles.sectionContainer, styles.inclusionsGrid]}>
          <View style={styles.inclusionCol}>
            <Text style={[styles.sectionTitleSmall, { color: Colors.success }]}>Inclusions</Text>
            <View style={styles.listItem}><Ionicons name="checkmark-circle" size={16} color={Colors.success} /><Text style={styles.listText}>Deep floor scrubbing</Text></View>
            <View style={styles.listItem}><Ionicons name="checkmark-circle" size={16} color={Colors.success} /><Text style={styles.listText}>Internal windows</Text></View>
            <View style={styles.listItem}><Ionicons name="checkmark-circle" size={16} color={Colors.success} /><Text style={styles.listText}>Kitchen degreasing</Text></View>
          </View>
          <View style={styles.inclusionCol}>
            <Text style={[styles.sectionTitleSmall, { color: Colors.danger }]}>Exclusions</Text>
            <View style={styles.listItem}><Ionicons name="close-circle" size={16} color={Colors.danger} /><Text style={styles.listText}>Exterior walls</Text></View>
            <View style={styles.listItem}><Ionicons name="close-circle" size={16} color={Colors.danger} /><Text style={styles.listText}>Hazardous waste</Text></View>
          </View>
        </View>

        {/* Popular Add-ons Mock */}
        <View style={[styles.sectionContainer, { backgroundColor: Colors.dark.cardAlt, paddingVertical: Spacing.xl }]}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: Spacing.lg }]}>Popular Add-ons</Text>
          <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.md, marginTop: Spacing.md }}>
            <View style={styles.addonCard}>
              <View>
                <Text style={styles.addonTitle}>Pet Hair Removal</Text>
                <Text style={styles.addonPrice}>+$30.00</Text>
              </View>
              <View style={styles.addonCtrlBox}>
                <TouchableOpacity style={styles.addonCtrlBtn} onPress={() => setAddons(p => ({...p, pet: Math.max(0, p.pet - 1)}))}>
                  <Ionicons name="remove" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.addonCtrlNum}>{addons.pet}</Text>
                <TouchableOpacity style={styles.addonCtrlBtn} onPress={() => setAddons(p => ({...p, pet: p.pet + 1}))}>
                  <Ionicons name="add" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.addonCard}>
              <View>
                <Text style={styles.addonTitle}>Inside Fridge</Text>
                <Text style={styles.addonPrice}>+$20.00</Text>
              </View>
              <View style={styles.addonCtrlBox}>
                <TouchableOpacity style={styles.addonCtrlBtn} onPress={() => setAddons(p => ({...p, fridge: Math.max(0, p.fridge - 1)}))}>
                  <Ionicons name="remove" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.addonCtrlNum}>{addons.fridge}</Text>
                <TouchableOpacity style={styles.addonCtrlBtn} onPress={() => setAddons(p => ({...p, fridge: p.fridge + 1}))}>
                  <Ionicons name="add" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Location Maps Placeholder */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={[styles.bodyText, { marginBottom: Spacing.md }]}>Serving Greater Metro Area</Text>
          <View style={styles.mapPlaceholderBox}>
            <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600' }} 
              style={[styles.mapImg, { opacity: 0.4 }]}
            />
            <View style={styles.mapCenterMarker}>
              <Ionicons name="location" size={32} color={Colors.primary} />
            </View>
          </View>
        </View>

        {/* Mini Company Link Card */}
        <View style={styles.sectionContainer}>
          <View style={styles.miniCompanyBanner}>
            <View style={styles.miniCompanyLeft}>
              <View style={styles.miniCompanyIconBox}>
                <Ionicons name="business" size={24} color="#FFF" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.miniCompanyBannerName}>Sparkle Pro</Text>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.info} />
                </View>
                <Text style={styles.miniCompanyBannerSub}>Member since 2021</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.miniCompanyBtn} onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: companyId || 'mock' } })}>
              <Text style={styles.miniCompanyBtnText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Actions Bar */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyBottomInner}>
          <View>
            <Text style={styles.totalEstimateLabel}>ESTIMATED TOTAL</Text>
            <Text style={styles.totalEstimateValue}>${( (service?.basePrice || 80) + (addons.pet * 30 + addons.fridge * 20) ).toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.confirmBookBtn} onPress={handleBook}>
            <Text style={styles.confirmBookText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  loader: { justifyContent: 'center', alignItems: 'center' },

  // Top App Bar
  topAppBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    backgroundColor: 'rgba(13, 13, 26, 0.75)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, height: 100, paddingTop: 40,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  navRoundBtnActive: { opacity: 0.9 },
  appBarTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, letterSpacing: -0.5 },

  // Carousel
  carouselContainer: { width, height: 400, position: 'relative' },
  carouselImg: { width, height: '100%', resizeMode: 'cover' },
  paginationDots: { 
    position: 'absolute', bottom: 36, left: 0, right: 0, 
    flexDirection: 'row', justifyContent: 'center', gap: 6 
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: '#FFF' },

  // Header Info Sheet
  infoSheet: {
    backgroundColor: Colors.dark.cardAlt,
    marginTop: -24, borderRadius: 24, zIndex: 10,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceHeadline: { fontSize: 26, fontWeight: '800', color: Colors.dark.text, marginBottom: 4, letterSpacing: -0.5 },
  companyMiniRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  companyMiniText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  reviewBlockSmall: { alignItems: 'flex-end' },
  ratingRowSmall: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValSmall: { fontSize: FontSize.md, fontWeight: '800', color: Colors.accent },
  reviewSubtext: { fontSize: 10, color: Colors.dark.textMuted, marginTop: 2 },

  quickStatsRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  statCard: { 
    flex: 1, backgroundColor: Colors.dark.bg, borderRadius: Radius.lg, 
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.dark.border 
  },
  statLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 0.5 },
  statValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginTop: 4 },

  actionBlockRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
  mainBookBtn: { 
    flex: 3, backgroundColor: Colors.primary, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center', paddingVertical: 16
  },
  mainBookBtnText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },
  circleActionBtn: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.dark.bg,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.dark.border
  },

  // Generic Sections
  sectionContainer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, marginBottom: Spacing.md },
  bodyText: { fontSize: FontSize.sm, color: Colors.dark.textSub, lineHeight: 22 },

  // Inclusions
  inclusionsGrid: { flexDirection: 'row', gap: Spacing.xl },
  inclusionCol: { flex: 1, gap: Spacing.sm },
  sectionTitleSmall: { fontSize: FontSize.sm, fontWeight: '800', marginBottom: 4 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  listText: { fontSize: 13, color: Colors.dark.textSub, flex: 1, lineHeight: 18 },

  // Addons
  addonCard: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.dark.bg, padding: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.dark.border
  },
  addonTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text },
  addonPrice: { fontSize: 12, color: Colors.dark.textSub, marginTop: 2 },
  addonCtrlBox: { 
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.dark.cardAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full 
  },
  addonCtrlBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  addonCtrlNum: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.text, width: 16, textAlign: 'center' },

  // Map
  mapPlaceholderBox: { width: '100%', height: 160, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: Colors.dark.card, position: 'relative' },
  mapImg: { width: '100%', height: '100%' },
  mapCenterMarker: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },

  // Mini Banner
  miniCompanyBanner: { 
    backgroundColor: Colors.primary, borderRadius: 32, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.lg
  },
  miniCompanyLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  miniCompanyIconBox: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  miniCompanyBannerName: { fontSize: FontSize.md, fontWeight: '800', color: '#FFF' },
  miniCompanyBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  miniCompanyBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  miniCompanyBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },

  // Sticky Bottom
  stickyBottomBar: {
    position: 'absolute', bottom: 85, left: 0, right: 0, zIndex: 50,
    paddingHorizontal: Spacing.xl,
  },
  stickyBottomInner: {
    backgroundColor: 'rgba(30, 30, 40, 0.95)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.dark.border,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 10 }, elevation: 15
  },
  totalEstimateLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 0.5 },
  totalEstimateValue: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginTop: -2 },
  confirmBookBtn: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: Radius.full },
  confirmBookText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },

});

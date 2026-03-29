import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Image, ActivityIndicator, Alert, Linking, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { companiesApi } from '@/lib/api/companies';
import { Ionicons } from '@expo/vector-icons';

interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  duration?: number;
  imageUrl?: string;
}

interface Company {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  verificationStatus?: string;
  services?: Service[];
}

export default function CompanyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about' | 'gallery'>('services');

  useEffect(() => {
    if (!id) return;
    companiesApi.getById(id).then(res => {
      setCompany(res.data?.data || res.data?.company || res.data);
    }).catch(() => {
      Alert.alert('Error', 'Could not load company details');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.safe, styles.loader]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!company) {
    return (
      <View style={[styles.safe, styles.loader]}>
        <Text style={{ color: Colors.dark.text }}>Company not found</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.back()}>
          <Text style={styles.btnPrimaryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderStars = (rating: number, size: number = 14) => {
    return (
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <Ionicons key={i} name={i <= Math.round(rating) ? "star" : "star-outline"} size={size} color={Colors.accent} />
        ))}
      </View>
    );
  };

  const renderServiceCard = (svc: Service, index: number) => {
    // Fake images for the mock layout feel if none exists
    const mockImage = `https://images.unsplash.com/photo-${index % 2 === 0 ? '1584622650111-993a426fbf0a' : '1621905251189-08b45d6a269e'}?auto=format&fit=crop&q=80&w=400`;
    
    return (
      <TouchableOpacity 
        key={svc.id || index} 
        style={styles.serviceItemCard}
        onPress={() => router.push({ pathname: '/(customer)/company/service', params: { id: svc.id, companyId: company.id } })}
      >
        <Image source={{ uri: svc.imageUrl || mockImage }} style={styles.serviceImage} />
        <View style={styles.serviceInfo}>
          <View>
            <Text style={styles.serviceTitle} numberOfLines={2}>{svc.name}</Text>
            <Text style={styles.serviceMetaText}>{svc.duration ? `${svc.duration} mins` : '2 - 3 hrs'} • Professional</Text>
          </View>
          <View style={styles.serviceBottom}>
            <Text style={styles.servicePriceText}>${parseFloat(String(svc.price || 80)).toFixed(0)}</Text>
            <TouchableOpacity 
              style={styles.bookSmallBtn}
              onPress={() => router.push({ pathname: '/(customer)/booking/create', params: { companyId: company.id, serviceId: svc.id } })}
            >
              <Text style={styles.bookSmallBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header Section (Hero Image) */}
        <View style={styles.heroContainer}>
          <ImageBackground 
            source={{ uri: company.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200' }} 
            style={styles.heroImg}
          >
            <View style={styles.heroNav}>
              <TouchableOpacity style={styles.navRoundBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.navRight}>
                <TouchableOpacity style={styles.navRoundBtn}>
                  <Ionicons name="share-social" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navRoundBtn}>
                  <Ionicons name="heart-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Profile Info Card (Overlapping Hero) */}
        <View style={styles.profileCardWrapper}>
          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={styles.logoBox}>
                {company.logoUrl ? (
                  <Image source={{ uri: company.logoUrl }} style={styles.logoImg} />
                ) : (
                  <Text style={styles.logoText}>{company.name[0]}</Text>
                )}
              </View>
              <View style={styles.profileInfoText}>
                <View style={styles.titleRow}>
                  <Text style={styles.profileTitle} numberOfLines={1}>{company.name}</Text>
                  {company.verificationStatus === 'verified' && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.info} style={{ marginLeft: 4 }} />
                  )}
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={14} color={Colors.accent} />
                    <Text style={styles.ratingNumber}>{company.averageRating?.toFixed(1) || '4.9'}</Text>
                  </View>
                  <Text style={styles.statsDot}>•</Text>
                  <Text style={styles.statsText}>{company.reviewCount || '128'} reviews</Text>
                  <Text style={styles.statsDot}>•</Text>
                  <Text style={styles.statsText}>{company.city || '1.2 miles away'}</Text>
                </View>
              </View>
            </View>

            {/* Main Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.btnPrimary, { flex: 1.5 }]}
                onPress={() => router.push({ pathname: '/(customer)/booking/create', params: { companyId: company.id } })}
              >
                <Text style={styles.btnPrimaryText}>Book Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.btnSecondary}
                onPress={() => router.push({ pathname: '/(customer)/chat', params: { companyId: company.id, companyName: company.name } })}
              >
                <Ionicons name="chatbubble-ellipses" size={18} color={Colors.dark.text} />
                <Text style={styles.btnSecondaryText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {(['services', 'reviews', 'about', 'gallery'] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabBtn}>
                <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentArea}>
          {activeTab === 'services' && (
            <View>
              <Text style={styles.sectionHeader}>Popular Services</Text>
              <View style={styles.servicesList}>
                {company.services && company.services.length > 0 ? (
                  company.services.map((svc, i) => renderServiceCard(svc, i))
                ) : (
                  <>
                    {/* Fallback mocks if company has no services yet so UI is visible */}
                    {renderServiceCard({ id: 'mock1', name: 'Deep Kitchen Cleaning', price: 85 }, 1)}
                    {renderServiceCard({ id: 'mock2', name: 'Whole Home Refresh', price: 200 }, 2)}
                    {renderServiceCard({ id: 'mock3', name: 'Bathroom Sanitization', price: 60 }, 3)}
                  </>
                )}
              </View>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View>
              {/* Reviews Summary Block */}
              <View style={styles.reviewSummaryCard}>
                <View style={styles.reviewSummaryHeader}>
                  <Text style={styles.sectionHeader}>Reviews</Text>
                  <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
                </View>
                <View style={styles.reviewStatsRow}>
                  <View style={styles.totalScoreBox}>
                    <Text style={styles.totalScoreText}>{company.averageRating?.toFixed(1) || '4.9'}</Text>
                    {renderStars(company.averageRating || 4.9, 12)}
                    <Text style={styles.totalReviewsText}>{company.reviewCount || 128} Total Reviews</Text>
                  </View>
                  <View style={styles.barsContainer}>
                    {[5, 4, 3, 2, 1].map(num => (
                      <View key={num} style={styles.barItem}>
                        <Text style={styles.barNum}>{num}</Text>
                        <View style={styles.barTrack}>
                          <View style={[styles.barFill, { width: num === 5 ? '92%' : num === 4 ? '6%' : '2%' }]} />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Review List Item Mock */}
              <View style={styles.reviewListItem}>
                <View style={styles.reviewListHeader}>
                  <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerAvatar}><Text style={styles.reviewerInitials}>SC</Text></View>
                    <View>
                      <Text style={styles.reviewerName}>Sarah Chen</Text>
                      <Text style={styles.reviewDate}>2 days ago</Text>
                    </View>
                  </View>
                  {renderStars(5, 12)}
                </View>
                <Text style={styles.reviewBody}>Absolutely phenomenal service! The kitchen looks better than when I first moved in. They were professional, punctual, and very thorough.</Text>
                <View style={styles.reviewImages}>
                  <Image style={styles.reviewImgMini} source={{ uri: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200' }} />
                  <Image style={styles.reviewImgMini} source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200' }} />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'about' && (
            <View>
              <Text style={styles.sectionHeader}>About Us</Text>
              <Text style={styles.aboutText}>{company.description || 'No detailed description provided by the company.'}</Text>
              
              <Text style={[styles.sectionHeader, { marginTop: Spacing.xl }]}>Contact & Location</Text>
              <View style={styles.contactInfoBox}>
                <View style={styles.contactRowItem}>
                  <Ionicons name="location" size={20} color={Colors.primary} />
                  <Text style={styles.contactText}>{company.address || 'Address not provided'}{company.city ? `, ${company.city}` : ''}</Text>
                </View>
                {company.phone && (
                  <View style={styles.contactRowItem}>
                    <Ionicons name="call" size={20} color={Colors.primary} />
                    <Text style={styles.contactText}>{company.phone}</Text>
                  </View>
                )}
                {company.email && (
                  <View style={styles.contactRowItem}>
                    <Ionicons name="mail" size={20} color={Colors.primary} />
                    <Text style={styles.contactText}>{company.email}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {activeTab === 'gallery' && (
            <View>
              <Text style={styles.sectionHeader}>Gallery</Text>
              <Text style={styles.emptyMockText}>No gallery images uploaded yet.</Text>
            </View>
          )}

        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomStickyBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.startingAtText}>STARTING AT</Text>
          <Text style={styles.bottomPriceHero}>$60.00</Text>
        </View>
        <TouchableOpacity 
          style={styles.bottomBookBtn}
          onPress={() => router.push({ pathname: '/(customer)/booking/create', params: { companyId: company.id } })}
        >
          <Text style={styles.bottomBookBtnText}>Book Service</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  loader: { justifyContent: 'center', alignItems: 'center', gap: Spacing.md },

  // Hero
  heroContainer: { height: 260, width: '100%', position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroNav: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingTop: 50, paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  navRoundBtn: { 
    width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center'
  },
  navRight: { flexDirection: 'row', gap: Spacing.sm },

  // Profile Card
  profileCardWrapper: { marginTop: -40, zIndex: 10, paddingHorizontal: Spacing.lg },

  profileCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg },
  profileTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  logoBox: { 
    width: 76, height: 76, borderRadius: Radius.lg, backgroundColor: Colors.dark.bg,
    borderWidth: 2, borderColor: Colors.dark.cardAlt, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  logoImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  logoText: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.primary },
  profileInfoText: { flex: 1, paddingTop: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  profileTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, flexShrink: 1 },
  statsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingNumber: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.accent },
  statsDot: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
  statsText: { fontSize: FontSize.xs, color: Colors.dark.textSub, fontWeight: '500' },
  
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  btnPrimary: { 
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center'
  },
  btnPrimaryText: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '800' },
  btnSecondary: { 
    flex: 1, flexDirection: 'row', backgroundColor: Colors.dark.card, 
    paddingVertical: 14, borderRadius: Radius.full, gap: 6,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.dark.border
  },
  btnSecondaryText: { color: Colors.dark.text, fontSize: FontSize.sm, fontWeight: '800' },

  // Tabs
  tabsContainer: { marginTop: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.border, backgroundColor: Colors.dark.bg, zIndex: 5 },
  tabsScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.xl },
  tabBtn: { paddingBottom: Spacing.sm, position: 'relative' },
  tabLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  tabLabelActive: { color: Colors.primary, fontWeight: '800' },
  tabIndicator: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, backgroundColor: Colors.primary, borderRadius: 2 },

  // Tab Content Area
  tabContentArea: { padding: Spacing.lg, paddingTop: Spacing.xl },
  sectionHeader: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, marginBottom: Spacing.md },

  // Services Tab
  servicesList: { gap: Spacing.md },
  serviceItemCard: { 
    flexDirection: 'row', backgroundColor: Colors.dark.cardAlt, 
    padding: Spacing.sm, borderRadius: Radius.lg, gap: Spacing.md 
  },
  serviceImage: { width: 96, height: 96, borderRadius: Radius.md, backgroundColor: Colors.dark.border },
  serviceInfo: { flex: 1, justifyContent: 'space-between', paddingVertical: 4 },
  serviceTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.text, lineHeight: 20 },
  serviceMetaText: { fontSize: FontSize.xs, color: Colors.dark.textSub, marginTop: 4 },
  serviceBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  servicePriceText: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  bookSmallBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full },
  bookSmallBtnText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '800' },

  // Reviews Tab
  reviewSummaryCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  reviewSummaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  viewAllText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  reviewStatsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xl },
  totalScoreBox: { alignItems: 'center' },
  totalScoreText: { fontSize: 36, fontWeight: '800', color: Colors.dark.text },
  totalReviewsText: { fontSize: 10, color: Colors.dark.textSub, fontWeight: '600', marginTop: 4 },
  barsContainer: { flex: 1, gap: 6 },
  barItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barNum: { fontSize: 10, fontWeight: '800', color: Colors.dark.text, width: 8 },
  barTrack: { flex: 1, height: 6, backgroundColor: Colors.dark.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: Colors.accent },

  reviewListItem: { borderBottomWidth: 1, borderBottomColor: Colors.dark.border, paddingBottom: Spacing.lg },
  reviewListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  reviewerInfo: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.card, alignItems: 'center', justifyContent: 'center' },
  reviewerInitials: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  reviewerName: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.text },
  reviewDate: { fontSize: 10, color: Colors.dark.textSub },
  reviewBody: { fontSize: FontSize.sm, color: Colors.dark.textSub, lineHeight: 20 },
  reviewImages: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  reviewImgMini: { width: 80, height: 64, borderRadius: Radius.sm, backgroundColor: Colors.dark.border },

  // About Tab
  aboutText: { fontSize: FontSize.sm, color: Colors.dark.textSub, lineHeight: 22 },
  contactInfoBox: { gap: Spacing.md },
  contactRowItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  contactText: { fontSize: FontSize.sm, color: Colors.dark.text },
  emptyMockText: { fontSize: FontSize.sm, color: Colors.dark.textMuted },

  // Bottom Sticky
  bottomStickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: `${Colors.dark.bg}E6`, borderTopWidth: 1, borderTopColor: Colors.dark.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    zIndex: 50,
  },
  bottomPriceCol: { flex: 1, flexDirection: 'column' },
  startingAtText: { fontSize: 10, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1 },
  bottomPriceHero: { fontSize: 24, fontWeight: '800', color: Colors.primary },
  bottomBookBtn: { 
    flex: 1, maxWidth: 200, backgroundColor: Colors.primary, 
    paddingVertical: 14, borderRadius: Radius.full, alignItems: 'center' 
  },
  bottomBookBtnText: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '800' },
});

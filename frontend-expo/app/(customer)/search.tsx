import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet,  FlatList,
  TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, ImageBackground, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { companiesApi } from '@/lib/api/companies';
import { servicesApi } from '@/lib/api/services';
import { Category } from '@/types/category.types';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

interface Company {
  id: string;
  name: string;
  description?: string;
  city?: string;
  logoUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  verificationStatus?: string;
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating 4+' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'distance', label: 'Distance' },
];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState((params.q as string) || '');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState((params.categorySlug as string) || '');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'price_low' | 'price_high' | 'distance'>('rating');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    servicesApi.getCategories().then(r => setCategories(r.data?.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
    fetchCompanies(1, true);
  }, [search, selectedCategory, sortBy]);

  const fetchCompanies = useCallback(async (p = 1, reset = false) => {
    if (loading && !reset) return;
    setLoading(true);
    try {
      let res;
      if (selectedCategory) {
        res = await companiesApi.getByCategory(selectedCategory, { search, sortBy, page: p, limit: 15 });
      } else {
        res = await companiesApi.getAll({ search, sortBy, page: p, limit: 15 });
      }
      
      const d = res?.data?.data || res?.data;
      const list = d?.companies || [];
      const total = d?.pagination?.total || list.length || 0;
      
      setTotalCount(total);
      setCompanies(reset ? list : prev => [...prev, ...list]);
      setHasMore(d?.pagination?.pages > p || false);
    } catch {
      setCompanies(reset ? [] : companies);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedCategory, sortBy]);

  const onRefresh = () => { setRefreshing(true); setPage(1); fetchCompanies(1, true); };
  const onEndReached = () => {
    if (!loading && hasMore) { const next = page + 1; setPage(next); fetchCompanies(next); }
  };

  const renderCompany = ({ item }: { item: Company }) => (
    <View style={styles.resultCard}>
      {/* Top Section: Info */}
      <View style={styles.cardInfoRow}>
        <View style={styles.cardImageContainer}>
          {item.logoUrl ? (
            <Image source={{ uri: item.logoUrl }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImageFallback}>
              <Ionicons name="business" size={32} color={Colors.dark.textMuted} />
            </View>
          )}
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            {item.verificationStatus === 'verified' && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.info} />
            )}
          </View>
          
          <View style={styles.cardMetaRow}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.cardRating}>{item.averageRating?.toFixed(1) || '4.8'}</Text>
            <Text style={styles.cardReviews}>({item.reviewCount || Math.floor(Math.random() * 200)} reviews)</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.cardDistance}>{item.city || '2.4 miles away'}</Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{selectedCategory || 'Cleaning'}</Text>
            </View>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>Pro Service</Text>
            </View>
          </View>

          <Text style={styles.cardPrice}>From ${Math.floor(Math.random() * 50) + 40}</Text>
        </View>
      </View>

      {/* Bottom Section: Actions */}
      <View style={styles.cardActionsRow}>
        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: item.id } })}
        >
          <Text style={styles.btnSecondaryText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btnPrimary}
          onPress={() => router.push({ pathname: '/(customer)/company/[id]', params: { id: item.id } })}
        >
          <Text style={styles.btnPrimaryText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBarWrapper}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
            <Ionicons name="arrow-back" size={24} color={Colors.dark.textMuted} />
          </TouchableOpacity>
          <Ionicons name="search" size={20} color={Colors.dark.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find Services"
            placeholderTextColor={Colors.dark.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoFocus={!params.categorySlug}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={Colors.dark.textMuted} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterIconBtn}>
            <Ionicons name="options" size={20} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter/Sort Bar */}
      <View style={styles.filtersSection}>
        <FlatList
          horizontal
          data={SORT_OPTIONS}
          keyExtractor={s => s.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, sortBy === item.value && styles.filterChipActive]}
              onPress={() => setSortBy(item.value as any)}
            >
              <Text style={[styles.filterChipText, sortBy === item.value && styles.filterChipTextActive]}>
                {item.label}
              </Text>
              {sortBy === item.value && (
                <Ionicons name="close" size={14} color="#FFF" style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>
          )}
        />
        {categories.length > 0 && (
          <FlatList
            horizontal
            data={[{ id: '', name: 'All Categories', slug: '' }, ...categories]}
            keyExtractor={c => c.id || 'all'}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterChip, selectedCategory === item.slug && styles.filterChipActive]}
                onPress={() => setSelectedCategory(item.slug || '')}
              >
                <Text style={[styles.filterChipText, selectedCategory === item.slug && styles.filterChipTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultCountText}>
          {totalCount > 0 ? `${totalCount} services found nearby` : (loading ? 'Searching...' : 'Search results')}
        </Text>
        <TouchableOpacity 
           style={styles.viewToggleBtn}
           onPress={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
        >
          <Ionicons name={viewMode === 'list' ? 'map' : 'list'} size={18} color={Colors.primary} />
          <Text style={styles.viewToggleTxt}>{viewMode === 'list' ? 'Map View' : 'List View'}</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'map' ? (
        <View style={{ flex: 1, margin: Spacing.lg, borderRadius: Radius.xl, overflow: 'hidden' }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: companies[0]?.averageRating ? 51.5074 : 51.5237,
              longitude: companies[0]?.reviewCount ? -0.1278 : -0.1586,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {companies.map((c, i) => (
              <Marker
                key={c.id}
                coordinate={{
                  latitude: 51.5074 + (Math.random() * 0.05 - 0.025), // Mock coords since MVP might lack them
                  longitude: -0.1278 + (Math.random() * 0.05 - 0.025),
                }}
                title={c.name}
                description={`From $${Math.floor(Math.random() * 50) + 40}`}
              />
            ))}
          </MapView>
        </View>
      ) : (
        /* Main List */
        <FlatList
          data={companies.length > 0 ? companies : []}
          keyExtractor={c => c.id}
          renderItem={renderCompany}
          contentContainerStyle={styles.listContainer}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator style={styles.centerLoader} size="large" color={Colors.primary} />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color={Colors.dark.borderLight} />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
              </View>
            )
          }
          ListFooterComponent={
            loading && companies.length > 0 ? (
              <ActivityIndicator color={Colors.primary} style={{ paddingVertical: Spacing.xl }} />
            ) : (
              hasMore === false && companies.length > 0 ? (
                <View style={styles.loadMoreWrapper}>
                  <TouchableOpacity style={styles.loadMoreBtn}>
                    <Text style={styles.loadMoreText}>End of Results</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },

  // Header
  headerContainer: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.sm,
    backgroundColor: `${Colors.dark.bg}E6`, zIndex: 10,
  },
  searchBarWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.dark.border, paddingHorizontal: Spacing.md,
    height: 50,
  },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.dark.text, marginLeft: 8 },
  clearIcon: { marginLeft: 8, marginRight: 8 },
  filterIconBtn: { padding: 6, backgroundColor: `${Colors.dark.textMuted}33`, borderRadius: Radius.full },

  // Filters
  filtersSection: { paddingVertical: Spacing.xs, gap: Spacing.xs },
  filterScroll: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.card,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: FontSize.xs, color: Colors.dark.textSub, fontWeight: '600' },
  filterChipTextActive: { color: '#FFF' },

  // Results Meta
  resultsHeader: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultCountText: { fontSize: FontSize.sm, color: Colors.dark.textSub, fontWeight: '500' },
  viewToggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(108, 99, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  viewToggleTxt: { fontSize: 11, fontWeight: '800', color: Colors.primary },

  // List
  listContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl + 40, gap: Spacing.md },
  
  // Cards
  resultCard: {
    backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl,
    padding: Spacing.md, gap: Spacing.md,
  },
  cardInfoRow: { flexDirection: 'row', gap: Spacing.md },
  cardImageContainer: { width: 96, height: 96, borderRadius: Radius.lg, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardImageFallback: { flex: 1, backgroundColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  cardDetails: { flex: 1, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardTitle: { flex: 1, fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.text, letterSpacing: -0.5 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  cardRating: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.dark.text },
  cardReviews: { fontSize: 10, color: Colors.dark.textSub },
  metaDot: { fontSize: 8, color: Colors.dark.textMuted, marginHorizontal: 2 },
  cardDistance: { fontSize: 10, color: Colors.dark.textSub, fontWeight: '600' },
  
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tagBadge: { backgroundColor: `${Colors.primary}22`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 9, fontWeight: '800', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  cardPrice: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary, marginTop: 4 },

  cardActionsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: -4 },
  btnSecondary: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.full,
    backgroundColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center'
  },
  btnSecondaryText: { color: Colors.dark.textSub, fontSize: FontSize.xs, fontWeight: '800' },
  btnPrimary: {
    flex: 1.5, paddingVertical: 10, borderRadius: Radius.full,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center'
  },
  btnPrimaryText: { color: '#FFF', fontSize: FontSize.xs, fontWeight: '800' },

  // States
  centerLoader: { marginTop: 60 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, marginBottom: 6, marginTop: Spacing.md },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.dark.textSub },
  
  loadMoreWrapper: { paddingVertical: Spacing.xl, alignItems: 'center' },
  loadMoreBtn: { paddingHorizontal: Spacing.xl, paddingVertical: 12, borderRadius: Radius.full, borderWidth: 2, borderColor: Colors.dark.border },
  loadMoreText: { color: Colors.dark.textMuted, fontWeight: '800', fontSize: FontSize.sm },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';

const ZONES = [
  {
    id: 'z1',
    name: 'Downtown',
    desc: 'Core Business District',
    icon: 'business',
    radius: '5.0 km',
    providers: 24,
    status: 'Active',
    active: true,
  },
  {
    id: 'z2',
    name: 'Suburbs',
    desc: 'Residential Northern Sector',
    icon: 'home',
    radius: '12.5 km',
    providers: 12,
    status: 'Active',
    active: true,
  },
  {
    id: 'z3',
    name: 'North District',
    desc: 'Expansion Zone A',
    icon: 'compass',
    radius: 'Pending',
    providers: 0,
    status: 'Inactive',
    active: false,
  },
];

export default function CompanyServiceAreasScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top App Bar ──────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Areas</Text>
        </View>
        <TouchableOpacity style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80' }}
            style={styles.avatarImg}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Map Preview ────────────────────────────────────────────────────── */}
        <View style={styles.mapCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} 
            style={styles.mapImg} 
          />
          <View style={styles.mapGradient} />
          
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeTxt}>LIVE COVERAGE</Text>
          </View>
          
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlBtn}>
              <Ionicons name="add" size={20} color="#43474e" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlBtn}>
              <Ionicons name="remove" size={20} color="#43474e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search & Actions ───────────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={20} color="#74777f" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search zones..."
              placeholderTextColor="#74777f"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addZoneBtn}>
            <Ionicons name="location" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* ── Zones List ─────────────────────────────────────────────────────── */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Defined Zones</Text>
            <TouchableOpacity><Text style={styles.viewAllTxt}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.cardsWrap}>
            {ZONES.map(zone => (
              <View key={zone.id} style={[styles.zoneCard, !zone.active && styles.zoneCardInactive]}>
                
                <View style={styles.zoneCardTop}>
                  <View style={styles.zoneLeft}>
                    <View style={[styles.zoneIconWrap, !zone.active && { backgroundColor: '#eceef0' }]}>
                      <Ionicons name={zone.icon as any} size={20} color={zone.active ? "#003a55" : "#74777f"} />
                    </View>
                    <View>
                      <Text style={styles.zoneName}>{zone.name}</Text>
                      <Text style={styles.zoneDesc}>{zone.desc}</Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, !zone.active && { backgroundColor: '#e0e3e5' }]}>
                    <View style={[styles.statusDot, !zone.active && { backgroundColor: '#74777f' }]} />
                    <Text style={[styles.statusTxt, !zone.active && { color: '#43474e' }]}>{zone.status.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.zoneCardBot}>
                  <View style={styles.zoneStatsLeft}>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>RADIUS</Text>
                      <Text style={[styles.statVal, !zone.active && { color: '#43474e', fontStyle: 'italic' }]}>{zone.radius}</Text>
                    </View>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>PROVIDERS</Text>
                      <Text style={styles.statVal}>{zone.providers}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.zoneActionsRight}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name={zone.active ? "create-outline" : "settings-outline"} size={20} color="#43474e" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { paddingRight: 0 }]}>
                      <Ionicons name="trash-outline" size={20} color="#ba1a1a" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'compass', label: 'Map', active: false },
          { icon: 'list', label: 'List', active: true },
          { icon: 'notifications', label: 'Alerts', active: false },
          { icon: 'options', label: 'Settings', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? Colors.primary : '#43474e'} />
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
    paddingHorizontal: Spacing.lg, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: '#f7f9fb', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { paddingRight: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e6e8ea', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },

  scrollContent: { paddingHorizontal: Spacing.md, paddingBottom: 100, paddingTop: 8 },

  // ── Map ────────────────────────────────────────────────────────────────────
  mapCard: { height: 260, borderRadius: Radius.xl, overflow: 'hidden', position: 'relative', backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, marginBottom: Spacing.lg },
  mapImg: { width: '100%', height: '100%', opacity: 0.8 },
  mapGradient: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)' },
  liveBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveBadgeTxt: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  
  mapControls: { position: 'absolute', bottom: 16, right: 16, gap: 8 },
  mapControlBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },

  // ── Search & Actions ───────────────────────────────────────────────────────
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: Spacing.xl },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f2f4f6', paddingHorizontal: 20, height: 50, borderRadius: 25 },
  searchInput: { flex: 1, fontSize: FontSize.sm, fontWeight: '500', color: '#191c1e' },
  addZoneBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 6 },

  // ── Zones List ─────────────────────────────────────────────────────────────
  listSection: { gap: Spacing.md },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 4 },
  listTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  viewAllTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  cardsWrap: { gap: Spacing.md },
  zoneCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  zoneCardInactive: { opacity: 0.75 },
  
  zoneCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  zoneLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  zoneIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d5e3fc', alignItems: 'center', justifyContent: 'center' },
  zoneName: { fontSize: FontSize.md, fontWeight: '800', color: '#191c1e' },
  zoneDesc: { fontSize: 11, fontWeight: '500', color: '#43474e', marginTop: 2 },

  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,58,85,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#003a55' },
  statusTxt: { fontSize: 9, fontWeight: '800', color: '#003a55', letterSpacing: 0.5 },

  zoneCardBot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)' },
  zoneStatsLeft: { flexDirection: 'row', gap: Spacing.xl },
  statCol: { gap: 2 },
  statLabel: { fontSize: 9, fontWeight: '800', color: '#57657a', letterSpacing: 1 },
  statVal: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },

  zoneActionsRight: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 8 },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 24, paddingVertical: 6, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: '#d5e3fc' },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#43474e', letterSpacing: 0.5, textTransform: 'uppercase' },
  navLabelActive: { color: Colors.primary },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, TextInput, Image, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useSidebar } from './_layout';

const theme = {
  surface: Colors.dark.bg,
  onSurface: Colors.dark.text,
  onSurfaceVariant: Colors.dark.textSub,
  primary: Colors.primary,
  onPrimary: '#ffffff',
  primaryContainer: Colors.primary,
  secondaryContainer: Colors.dark.surface,
  onSecondaryContainer: Colors.primaryLight,
  onSecondaryFixedVariant: Colors.primaryLight,
  tertiaryContainer: 'rgba(108, 99, 255, 0.15)',
  onTertiaryContainer: Colors.primaryLight,
  tertiaryFixed: 'rgba(108, 99, 255, 0.3)',
  onTertiaryFixedVariant: Colors.primaryLight,
  errorContainer: 'rgba(239, 68, 68, 0.1)',
  onErrorContainer: Colors.danger,
  outline: Colors.dark.textMuted,
  surfaceContainerLowest: Colors.dark.cardAlt,
  surfaceContainerLow: Colors.dark.surface,
  surfaceContainer: Colors.dark.surface,
  surfaceContainerHigh: Colors.dark.cardAlt,
  outlineVariant: Colors.dark.border,
};

const MOCK_COMPANIES = [
  {
    id: '1',
    name: 'Elevate Architects',
    owner: 'Marcus Vane',
    bookings: '1,284',
    rating: '4.9',
    status: 'Verified',
    statusColor: theme.secondaryContainer,
    statusText: theme.onSecondaryFixedVariant,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPvJ4K-d2g7xKuDrniyTIWUTwFP85U0Ybs86Y8F10xvMFIrojqlAkd6xgoFpEIMToBc8UHnJYhcNiZXkqKM-0zz2772HnHGDle-K0zkkMV7j_b_CZcVzDvxC-Gf7RsroQBJxFEcr8bAXRbHcTtyc_22Tsr7GWi1fSai97Thv3WmDBNFYLihmD1A1Sb20rrcLrpbhVO34ozMaWLf-ihuaI7m5FbkSGN4FhZNc2q0RQSX5-R9nvO3eKJ5hlJKQ4M0YooufRF9Xnjpjo'
  },
  {
    id: '2',
    name: 'Urban Blueprint Co',
    owner: 'Sarah Jenkins',
    bookings: '856',
    rating: '4.7',
    status: 'Pending',
    statusColor: theme.tertiaryFixed,
    statusText: theme.onTertiaryFixedVariant,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvEt5cZ8O04gfjFsMP9f-fDgUfyMwyVx_XPB8vu_04BgReG9FAsAHlMdY_PqMrV3QeY7INe9qPSGrjiWMfkD7D6iXFD6-yp-7Y3KaeUP2dzFUs_miCqSPhs7yEzjFhU-v-KXRfdjkRcc_rUocS2yDg8SkyqxRYWDTHcy6m0y4jmQkoAgmkVf-w_oAJ1ejL7RYmaS5u2tvv3Vm_9jBfYsTYynue23HAkq8teZjM7KCARprOJLQk_DxxXpSiIkuNzjXO2oLZ2hSIZdE'
  },
  {
    id: '3',
    name: 'North Star Design',
    owner: 'Julian Thorne',
    bookings: '42',
    rating: '3.2',
    status: 'Suspended',
    statusColor: theme.errorContainer,
    statusText: theme.onErrorContainer,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6QjiQikrsHgrOhN7uUz8tanAj2lkfDZE4Ac2idy55w5Q1YNbLQiQTZ4wJMWzZF-I92Srf0y3TwUQO7y6KykUAr9BKf6_2tLg886RljhTTFq6pudVRwv27xwhUPUphqdRdMg74dGDl5JOZBm6gHKHXOo8YU2kbbWjeFDPfPYQYSOZbSIUppPryZuyH5EBgi9D52OnMhrhtibRidT3zPILCbBL3ZQx2FqgactWvvULw7KRK4-4Pb84oq51-xRJlcAYVKakOkOb6YBU'
  }
];

export default function AdminCompaniesScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [filter, setFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const filteredCompanies = MOCK_COMPANIES.filter(c => filter === 'All' || c.status === filter);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <BlurView intensity={70} tint="dark" style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Management</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="account-circle" size={24} color={theme.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={theme.outline} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search companies, owners..." 
            placeholderTextColor={theme.outline} 
          />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chipsWrap}
        >
          {['All', 'Verified', 'Pending', 'Suspended'].map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.chip, filter === f ? styles.chipActive : styles.chipInactive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipTxt, filter === f ? styles.chipTxtActive : styles.chipTxtInactive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Company List */}
        <View style={styles.listWrap}>
          {filteredCompanies.map((comp) => (
            <TouchableOpacity key={comp.id} style={styles.card} activeOpacity={0.8} onPress={() => setSelectedCompany(comp)}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfoLeft}>
                  <View style={styles.imageWrap}>
                    <Image source={{ uri: comp.image }} style={styles.image} />
                  </View>
                  <View>
                    <Text style={styles.compName}>{comp.name}</Text>
                    <Text style={styles.compOwner}>Owner: {comp.owner}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                  <MaterialIcons name="more-vert" size={20} color={theme.outline} />
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>TOTAL BOOKINGS</Text>
                  <Text style={styles.statValue}>{comp.bookings}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>AVG RATING</Text>
                  <View style={styles.ratingWrap}>
                    <Text style={styles.statValue}>{comp.rating}</Text>
                    <MaterialIcons name="star" size={14} color={theme.tertiaryContainer} />
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.statusBadge, { backgroundColor: comp.statusColor }]}>
                  <Text style={[styles.statusBadgeTxt, { color: comp.statusText }]}>{comp.status}</Text>
                </View>
                <View style={styles.detailsBtn}>
                  <Text style={styles.detailsBtnTxt}>Details</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={theme.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard' as any)}>
          <MaterialIcons name="dashboard" size={24} color={theme.onSurfaceVariant} />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/users' as any)}>
          <MaterialIcons name="group" size={24} color={theme.onSurfaceVariant} />
          <Text style={styles.navLabel}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
             <MaterialIcons name="business-center" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/verification' as any)}>
           <MaterialIcons name="verified-user" size={24} color={theme.onSurfaceVariant} />
           <Text style={styles.navLabel}>Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/settings' as any)}>
           <MaterialIcons name="settings" size={24} color={theme.onSurfaceVariant} />
           <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </BlurView>
      
      {/* ── Company Detail Modal ─────────────────────────────────────────── */}
      <Modal visible={!!selectedCompany} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalContent}>
            
            <View style={styles.modalDragHandle} />
            
            <View style={styles.modalHeader}>
              <View style={styles.modalCompRow}>
                <Image source={{ uri: selectedCompany?.image }} style={styles.modalImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalName}>{selectedCompany?.name}</Text>
                  <Text style={styles.modalOwner}>Owner: {selectedCompany?.owner}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedCompany(null)}>
                <MaterialIcons name="close" size={24} color={theme.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Performance Metrics</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Total Bookings</Text>
                    <Text style={styles.metricValue}>{selectedCompany?.bookings}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Rating</Text>
                    <Text style={styles.metricValue}>{selectedCompany?.rating}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Dispute Status</Text>
                {selectedCompany?.status === 'Suspended' ? (
                  <Text style={{ color: '#ef4444' }}>Currently handling multiple customer disputes. Account suspended pending review.</Text>
                ) : (
                  <Text style={{ color: theme.onSurfaceVariant }}>No open disputes at this time.</Text>
                )}
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Actionable Controls</Text>
                <TouchableOpacity 
                   style={[styles.statusToggleBtn, selectedCompany?.status === 'Verified' ? styles.statusToggleBtnActive : styles.statusToggleBtnSuspended]}
                   onPress={() => setSelectedCompany((prev: any) => ({ ...prev, status: prev.status === 'Verified' ? 'Suspended' : 'Verified'}))}
                >
                   <MaterialIcons name={selectedCompany?.status === 'Verified' ? 'block' : 'check-circle'} size={20} color="#FFF" />
                   <Text style={styles.statusToggleTxt}>
                     {selectedCompany?.status === 'Verified' ? 'Deactivate Company' : 'Reactivate Company'}
                   </Text>
                </TouchableOpacity>
              </View>
              
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(15, 15, 27, 0.7)', zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: theme.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },

  searchBox: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: theme.surfaceContainerLow, 
    borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 16 
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 14, color: theme.onSurface },

  chipsWrap: { gap: 8, marginBottom: 24, paddingBottom: 8 },
  chip: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 24, alignSelf: 'flex-start' },
  chipActive: { backgroundColor: theme.primary },
  chipInactive: { backgroundColor: theme.surfaceContainerHigh },
  chipTxt: { fontSize: 14, fontWeight: '600' },
  chipTxtActive: { color: theme.onPrimary },
  chipTxtInactive: { color: theme.onSurfaceVariant },

  listWrap: { gap: 16 },
  card: { 
    backgroundColor: theme.surfaceContainerLowest, 
    borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.outlineVariant,
    shadowColor: '#000', shadowOffset: { width:0, height:2 }, 
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 
  },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardInfoLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  imageWrap: { width: 56, height: 56, borderRadius: 8, backgroundColor: theme.surfaceContainer, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  compName: { fontSize: 18, fontWeight: '700', color: theme.primary, marginBottom: 2 },
  compOwner: { fontSize: 12, fontWeight: '500', color: theme.onSurfaceVariant },
  moreBtn: { padding: 8, backgroundColor: 'transparent', borderRadius: 20 },

  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: theme.surfaceContainerLow, borderRadius: 8, padding: 12 },
  statLabel: { fontSize: 10, fontWeight: '700', color: theme.outline, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: theme.primary },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  statusBadgeTxt: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: -0.5 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailsBtnTxt: { fontSize: 14, fontWeight: '700', color: theme.primary },

  bottomNav: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(15, 15, 27, 0.85)', borderTopWidth: 1, borderTopColor: theme.outlineVariant,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopLeftRadius: 12, borderTopRightRadius: 12,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconActive: { backgroundColor: theme.secondaryContainer, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: theme.outlineVariant },
  navLabel: { fontSize: 10, fontWeight: '500', color: theme.onSurfaceVariant, marginTop: 2 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 15, 27, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.surfaceContainerLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, minHeight: '65%', paddingHorizontal: 20, borderWidth: 1, borderColor: theme.outlineVariant },
  modalDragHandle: { width: 40, height: 5, backgroundColor: theme.outlineVariant, borderRadius: 3, alignSelf: 'center', marginVertical: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalCompRow: { flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 },
  modalImage: { width: 56, height: 56, borderRadius: 12, backgroundColor: theme.surfaceContainer },
  modalName: { fontSize: 20, fontWeight: '800', color: theme.primary },
  modalOwner: { fontSize: 13, color: theme.onSurfaceVariant, marginTop: 2 },
  closeBtn: { padding: 4, backgroundColor: theme.surface, borderRadius: 20 },
  modalScroll: { paddingBottom: 40 },
  sectionBlock: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.primary, marginBottom: 12 },
  metricsGrid: { flexDirection: 'row', gap: 16 },
  metricItem: { flex: 1, backgroundColor: theme.surfaceContainerLow, padding: 12, borderRadius: 8 },
  metricLabel: { fontSize: 11, color: theme.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: '800', color: theme.primary },
  statusToggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 12 },
  statusToggleBtnActive: { backgroundColor: '#b91c1c' },
  statusToggleBtnSuspended: { backgroundColor: '#059669' },
  statusToggleTxt: { color: '#FFF', fontWeight: '800', fontSize: 14 }
});

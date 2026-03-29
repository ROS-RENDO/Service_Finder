import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, RefreshControl, Image, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { useSidebar } from './_layout';
import apiClient from '@/lib/api/client';

const theme = {
  surface: Colors.dark.bg,
  onSurface: Colors.dark.text,
  onSurfaceVariant: Colors.dark.textSub,
  primary: Colors.primary,
  onPrimary: '#ffffff',
  primaryContainer: Colors.primary,
  onPrimaryContainer: Colors.primaryLight,
  secondaryContainer: Colors.dark.surface,
  onSecondaryContainer: Colors.primaryLight,
  onSecondaryFixedVariant: Colors.primaryLight,
  tertiaryContainer: 'rgba(108, 99, 255, 0.15)',
  onTertiaryContainer: Colors.primaryLight,
  tertiaryFixed: 'rgba(108, 99, 255, 0.3)',
  tertiaryFixedDim: Colors.primary,
  onTertiaryFixedVariant: Colors.primaryLight,
  errorContainer: 'rgba(239, 68, 68, 0.1)',
  onErrorContainer: Colors.danger,
  error: Colors.danger,
  onError: '#ffffff',
  outline: Colors.dark.textMuted,
  outlineVariant: Colors.dark.border,
  surfaceVariant: Colors.dark.border,
  surfaceContainerLowest: Colors.dark.cardAlt,
  surfaceContainerLow: Colors.dark.surface,
  surfaceContainer: Colors.dark.surface,
  surfaceContainerHigh: Colors.dark.cardAlt,
  surfaceContainerHighest: Colors.dark.border,
};

const MOCK_COMPANIES = [
  {
    id: '8829-RR',
    name: 'Rapid Repairs LLC',
    email: 'm.thorne@elitearch.com',
    owner: { fullName: 'Marcus J. Thorne' },
    address: '412 Industry Blvd, Suite 201, Austin, TX 78701',
    status: 'URGENT',
    submittedAt: 'Oct 24, 2023',
    pendingTime: 'Pending since 2 hours',
  },
  {
    id: '102-CM',
    name: 'CleanMaster Co.',
    email: 'contact@cleanmaster.com',
    owner: { fullName: 'Sarah Jenkins' },
    address: '123 Cleaning Ave, Seattle, WA',
    status: 'URGENT',
    submittedAt: 'Oct 23, 2023',
    pendingTime: 'Pending since 1 day',
  },
  {
    id: '103-UG',
    name: 'Urban Greenscape',
    email: 'hello@urbangreens.com',
    owner: { fullName: 'David Lee' },
    address: '45 Green St, Portland, OR',
    status: 'STANDARD',
    submittedAt: 'Oct 23, 2023',
    pendingTime: 'Pending since 2 days',
  },
  {
    id: '104-SH',
    name: 'Skyline HVAC',
    email: 'support@skylinehvac.com',
    owner: { fullName: 'James Smith' },
    address: '90 Cool Rd, Denver, CO',
    status: 'STANDARD',
    submittedAt: 'Oct 22, 2023',
    pendingTime: 'Pending since 3 days',
  }
];

export default function AdminVerificationScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [companies, setCompanies] = useState<any[]>(MOCK_COMPANIES);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_COMPANIES[0].id);

  const fetchPending = async () => {
    // using mock data to visualize layout directly
    setRefreshing(false);
  };

  useEffect(() => { fetchPending(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchPending(); };

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    const nextList = companies.filter(c => c.id !== id);
    setCompanies(nextList);
    if (selectedId === id) {
      setSelectedId(nextList.length > 0 ? nextList[0].id : null);
    }
  };

  const selectedCompany = companies.find(c => c.id === selectedId) || null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <BlurView intensity={70} tint="dark" style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.headerTitle}>Verification Queue</Text>
            {companies.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeTxt}>{companies.length}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.avatarWrap}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0elZBC6JyBvOIUgL_mQN2Suv79As7yb1vIhlYyatwM6PT_dXled9x0MsH4urlr8yk9FQRlPOxkUn7unXnAOMN3MmPtQXwRz4n6Q506bL9UAQLUZgAutQKYEUUWzXa4cpam79oO5pjNjn7juRzAvNMiN7u0LiY2U1CixNO8zbb3FyjPphCiJSUzC1DKKFLfr4oKsLr2zpRZA1Ojn6sYNHdz0o9mdN8WFPhSjjUsLUNMqiIaX6spJLPXRZ4kn3rpNfT2Lg9mifj6I' }} 
            style={styles.avatarImg} 
          />
        </View>
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color={theme.primary} />
        ) : companies.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No companies pending verification</Text>
          </View>
        ) : (
          <>
            {/* Queue Sidebar Horizontal Map */}
            <View style={styles.queueHeader}>
              <Text style={styles.queueTitle}>Awaiting Review</Text>
              <Text style={styles.queueSub}>NEWEST FIRST</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.queueList}>
              {companies.map(comp => {
                const isSelected = comp.id === selectedId;
                return (
                  <TouchableOpacity 
                    key={comp.id} 
                    style={[styles.queueCard, isSelected && styles.queueCardActive]} 
                    onPress={() => setSelectedId(comp.id)}
                  >
                    <View style={styles.queueCardHeader}>
                      <Text style={[styles.queueCardTitle, isSelected && { color: theme.primary }]} numberOfLines={1}>{comp.name}</Text>
                      {isSelected 
                        ? <View style={styles.selectedBadge}><Text style={styles.selectedBadgeTxt}>SELECTED</Text></View>
                        : <Text style={styles.queueCardStatus}>{comp.status}</Text>}
                    </View>
                    <Text style={[styles.queueCardDate, isSelected && { color: theme.onPrimaryContainer }]}>
                      Submitted: {comp.submittedAt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Main Review Interface */}
            {selectedCompany && (
              <View style={styles.reviewInterface}>
                
                {/* Structural Detail */}
                <View style={styles.reviewTop}>
                  <View style={styles.logoCircle}>
                    <MaterialIcons name="business" size={32} color={theme.primaryContainer} />
                  </View>
                  <View style={styles.compHeadTextWrap}>
                    <Text style={styles.caseId}>CASE #{selectedCompany.id.substring(0,8).toUpperCase()}</Text>
                    <Text style={styles.revCompTitle}>{selectedCompany.name}</Text>
                  </View>
                </View>

                {/* Sub details */}
                <View style={styles.gridInfo}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>OWNERSHIP INFO</Text>
                    <Text style={styles.infoSubLabel}>Principal Owner</Text>
                    <Text style={styles.infoValue}>{selectedCompany.owner?.fullName || 'Not specificed'}</Text>
                    
                    <Text style={[styles.infoSubLabel, { marginTop: 12 }]}>Contact</Text>
                    <Text style={styles.infoValue}>{selectedCompany.email}</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>OPERATIONAL BASE</Text>
                    <Text style={styles.infoSubLabel}>Registered Address</Text>
                    <Text style={[styles.infoValue, { fontSize: 14 }]}>
                      {selectedCompany.address || selectedCompany.city || 'Address missing'}
                    </Text>
                    <View style={styles.locWrap}>
                      <MaterialIcons name="location-on" size={16} color={theme.primaryContainer} />
                      <Text style={styles.locTxt}>Map Data Available</Text>
                    </View>
                  </View>
                </View>

                {/* Documents */}
                <View style={styles.docSection}>
                  <View style={styles.docHead}>
                    <Text style={styles.docTitle}>Compliance Documents</Text>
                    <Text style={styles.docCount}>3 Files Provided</Text>
                  </View>

                  <View style={styles.docList}>
                    <TouchableOpacity style={styles.docItem}>
                      <View style={styles.docIconBox}><MaterialIcons name="description" size={20} color={theme.tertiaryFixed} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.docItemTitle}>State_Business_License.pdf</Text>
                        <Text style={styles.docItemSub}>PDF • 2.4 MB • Uploaded 2 days ago</Text>
                      </View>
                      <View style={styles.docViewBtn}><MaterialIcons name="visibility" size={16} color={theme.onSecondaryFixedVariant} /></View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.docItem}>
                      <View style={styles.docIconBox}><MaterialIcons name="description" size={20} color={theme.tertiaryFixed} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.docItemTitle}>Insurance_Cert_2024.jpg</Text>
                        <Text style={styles.docItemSub}>IMAGE • 1.1 MB • Uploaded 2 days ago</Text>
                      </View>
                      <View style={styles.docViewBtn}><MaterialIcons name="visibility" size={16} color={theme.onSecondaryFixedVariant} /></View>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.internalFlag}>
                  <Text style={styles.flagTitle}>Internal Flags</Text>
                  <Text style={styles.flagDesc}>"Review carefully checking provided address against registered business base." — System Auto-flag.</Text>
                </View>
                
                {/* Actions */}
                <View style={styles.actionBlock}>
                  <TouchableOpacity style={styles.actBtnRequest} onPress={() => Alert.alert('Request sent')}>
                    <Text style={styles.actTxtRequest}>Request Info</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actBtnReject} onPress={() => handleVerify(selectedCompany.id, 'rejected')}>
                    <Text style={styles.actTxtReject}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actBtnApprove} onPress={() => handleVerify(selectedCompany.id, 'verified')}>
                    <Text style={styles.actTxtApprove}>Approve</Text>
                  </TouchableOpacity>
                </View>

              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Bottom Nav Mobile Context */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard' as any)}>
          <MaterialIcons name="dashboard" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
             <MaterialIcons name="fact-check" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Queue</Text>
        </TouchableOpacity>
      </BlurView>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },
  badge: { backgroundColor: theme.error, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeTxt: { fontSize: 10, fontWeight: '700', color: theme.onError },

  avatarWrap: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.outlineVariant },
  avatarImg: { width: '100%', height: '100%' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: theme.primary, marginBottom: 8 },
  emptySub: { fontSize: 14, color: theme.onSurfaceVariant },

  queueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  queueTitle: { fontSize: 16, fontWeight: '700', color: theme.primary },
  queueSub: { fontSize: 10, fontWeight: '600', color: theme.onSurfaceVariant, letterSpacing: 1 },
  
  queueList: { gap: 12, paddingBottom: 16 },
  queueCard: { width: 200, backgroundColor: theme.surfaceContainerLowest, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.surfaceVariant },
  queueCardActive: { backgroundColor: theme.secondaryContainer, borderColor: theme.primary, borderLeftWidth: 4 },
  queueCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  queueCardTitle: { fontSize: 14, fontWeight: '700', color: theme.primary, flex: 1, paddingRight: 8 },
  selectedBadge: { backgroundColor: theme.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  selectedBadgeTxt: { fontSize: 8, fontWeight: '700', color: theme.onPrimary, letterSpacing: 0.5 },
  queueCardStatus: { fontSize: 8, fontWeight: '700', color: theme.onSurfaceVariant, letterSpacing: 0.5, paddingTop: 2 },
  queueCardDate: { fontSize: 11, fontStyle: 'italic', color: theme.onSurfaceVariant },

  reviewInterface: { backgroundColor: theme.surfaceContainerLowest, borderRadius: 24, padding: 20, marginTop: 8, shadowColor: '#000', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 },
  
  reviewTop: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.3)', paddingBottom: 20, marginBottom: 20 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center' },
  compHeadTextWrap: { flex: 1 },
  caseId: { fontSize: 10, fontWeight: '700', color: theme.onTertiaryFixedVariant, letterSpacing: 2, marginBottom: 2 },
  revCompTitle: { fontSize: 24, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },

  gridInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  infoBox: { flex: 1, minWidth: 140, backgroundColor: theme.surfaceContainerLow, borderRadius: 16, padding: 16 },
  infoLabel: { fontSize: 10, fontWeight: '700', color: theme.onSurfaceVariant, letterSpacing: 1, marginBottom: 12 },
  infoSubLabel: { fontSize: 10, fontWeight: '600', color: theme.onSecondaryContainer, marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '700', color: theme.primary },
  locWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  locTxt: { fontSize: 12, fontWeight: '600', color: theme.primaryContainer },

  docSection: { marginBottom: 24 },
  docHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  docTitle: { fontSize: 18, fontWeight: '700', color: theme.primary },
  docCount: { fontSize: 12, fontWeight: '500', color: theme.onSurfaceVariant },
  docList: { gap: 8 },
  docItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surface, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: theme.surfaceVariant },
  docIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: theme.tertiaryContainer, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  docItemTitle: { fontSize: 14, fontWeight: '700', color: theme.primary, marginBottom: 2 },
  docItemSub: { fontSize: 10, color: theme.onSurfaceVariant },
  docViewBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center' },

  internalFlag: { backgroundColor: theme.surfaceContainerLow, borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: theme.outlineVariant, marginBottom: 24 },
  flagTitle: { fontSize: 14, fontWeight: '700', color: theme.primary, marginBottom: 4 },
  flagDesc: { fontSize: 12, fontStyle: 'italic', color: theme.onSurfaceVariant, lineHeight: 18 },

  actionBlock: { flexDirection: 'row', gap: 12, marginTop: 8 },
  actBtnRequest: { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(0,32,69,0.2)', paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  actTxtRequest: { fontSize: 13, fontWeight: '700', color: theme.primary },
  actBtnReject: { flex: 1, backgroundColor: theme.surfaceContainerHighest, paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  actTxtReject: { fontSize: 13, fontWeight: '700', color: theme.onSecondaryFixedVariant },
  actBtnApprove: { flex: 1.5, backgroundColor: theme.primary, paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  actTxtApprove: { fontSize: 13, fontWeight: '700', color: theme.onPrimary },

  bottomNav: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(15, 15, 27, 0.85)', borderTopWidth: 1, borderTopColor: theme.outlineVariant,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconActive: { backgroundColor: theme.secondaryContainer, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: theme.outlineVariant },
  navLabel: { fontSize: 10, fontWeight: '600', color: theme.onSecondaryContainer, letterSpacing: 0.5, marginTop: 2 },
});

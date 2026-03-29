import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const theme = {
  surface: '#f7f9fb',
  onSurface: '#191c1e',
  onSurfaceVariant: '#43474e',
  primary: '#002045',
  onPrimary: '#ffffff',
  primaryContainer: '#1a365d',
  onPrimaryContainer: '#86a0cd',
  secondaryContainer: '#d5e3fc',
  onSecondaryContainer: '#57657a',
  onSecondaryFixedVariant: '#3a485b',
  tertiaryContainer: '#003a55',
  onTertiaryContainer: '#1ba9ed',
  tertiaryFixed: '#c9e6ff',
  onTertiaryFixedVariant: '#004c6e',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  error: '#ba1a1a',
  outline: '#74777f',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
};

export default function AdminCompanyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Management</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Company Identity */}
        <View style={styles.identityCard}>
          <View style={styles.logoWrap}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6mI68oOwcwDl6hYPLnzTjI1w-g3rovmnAVKGpCXTpQUrjZb_IeLdzJFCTZNS56md1wxiC1keDFrkWEXVW7OKEXnZ46hyJVo0KjA4YmDJYfnfmu5pCBndvNniWmsDaRsgeHtVDQG9w4fTzNlDNmK9TUVu6HToNJxvVq3TXiWA-vdi5qw5YBee3vSgYsx6FtbOWIm-Xx4Qkp51Pu6WE1o16GTgduGicX8ztJPzrnZH935d7MVNcjTy3Lw6M1qjaXonLhwQCeEJ51RY' }}
              style={styles.logoImg}
            />
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={14} color={theme.onPrimary} />
            </View>
          </View>
          <Text style={styles.companyName}>Elite Urban Architects</Text>
          <Text style={styles.companySub}>Commercial Design & Planning</Text>
          <View style={styles.activePill}>
            <Text style={styles.activePillTxt}>ACTIVE PROVIDER</Text>
          </View>
        </View>

        {/* Ownership Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ownership Details</Text>
          <View style={styles.ownerCard}>
            <View style={styles.ownerImgBox}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl9-cDYUEYPqHHJH0mPH2BZBXqSZWoNvsyPpuVcfvvhLIolFonY9VM4LcsItfQTbDc49p59awm6KiLprpMHkB5c2RGfMydcyCZ_5XmfHnpwKEg_tbyR5XW6gX_jy8PDqD3QSYRd-kCsGMYGYcAar5JWaAGwMtk7HkK3haTaeP1H7ezXF5aMfAqSwo8s99npPhV4U9GQoTq0WGF_DKycFywE_tVItwYeWvYUMXZr4oN0Guu_vZBNPp3k9yE2T7Yuw4PY39ZG_n7F1E' }}
                style={styles.ownerImg}
              />
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>Marcus Thorne</Text>
              <Text style={styles.ownerRole}>Principal Architect</Text>
              <View style={styles.contactRow}>
                <MaterialIcons name="mail" size={14} color={theme.primary} />
                <Text style={styles.contactTxt}>m.thorne@elitearch.com</Text>
              </View>
              <View style={styles.contactRow}>
                <MaterialIcons name="phone-iphone" size={14} color={theme.primary} />
                <Text style={styles.contactTxt}>+1 (555) 902-4431</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Analytics</Text>
          <View style={styles.bentoGrid}>
            
            {/* Revenue */}
            <View style={[styles.bentoFull, styles.revenueCard]}>
              <View style={styles.revHeader}>
                <View style={styles.revIconBox}>
                  <MaterialIcons name="payments" size={20} color={theme.onPrimary} />
                </View>
                <View style={styles.revBadge}><Text style={styles.revBadgeTxt}>+12.5%</Text></View>
              </View>
              <Text style={styles.revLabel}>Total Lifetime Revenue</Text>
              <Text style={styles.revValue}>$1.24M</Text>
            </View>

            {/* Bookings */}
            <View style={styles.bentoHalf}>
              <View style={styles.bentoHalfHeader}>
                <MaterialIcons name="calendar-month" size={20} color={theme.tertiaryContainer} />
                <Text style={styles.bentoHalfValue}>482</Text>
              </View>
              <View>
                <Text style={styles.bentoHalfLabel}>Total Bookings</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '85%' }]} />
                </View>
              </View>
            </View>

            {/* Success */}
            <View style={styles.bentoHalf}>
              <View style={styles.bentoHalfHeader}>
                <MaterialIcons name="verified-user" size={20} color={theme.tertiaryContainer} />
                <Text style={styles.bentoHalfValue}>98.2%</Text>
              </View>
              <View>
                <Text style={styles.bentoHalfLabel}>Success Rate</Text>
                <View style={styles.barsWrap}>
                  <View style={[styles.barItem, { height: 8, opacity: 0.3 }]} />
                  <View style={[styles.barItem, { height: 16, opacity: 0.3 }]} />
                  <View style={[styles.barItem, { height: 24, opacity: 1 }]} />
                </View>
              </View>
            </View>

            {/* Rating */}
            <View style={[styles.bentoFull, styles.ratingCard]}>
              <View>
                <Text style={styles.ratingTitle}>RATING SUMMARY</Text>
                <View style={styles.ratingStarsWrap}>
                  <Text style={styles.ratingScore}>4.9</Text>
                  <View style={styles.starsBox}>
                    <MaterialIcons name="star" size={20} color={theme.tertiaryContainer} />
                    <MaterialIcons name="star" size={20} color={theme.tertiaryContainer} />
                    <MaterialIcons name="star" size={20} color={theme.tertiaryContainer} />
                    <MaterialIcons name="star" size={20} color={theme.tertiaryContainer} />
                    <MaterialIcons name="star-half" size={20} color={theme.tertiaryContainer} />
                  </View>
                </View>
                <Text style={styles.ratingSub}>Based on 328 verified reviews</Text>
              </View>
              <TouchableOpacity style={styles.trendBtn}>
                <MaterialIcons name="trending-up" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Administrative Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Administrative Actions</Text>
          <View style={styles.actionListWrap}>
            
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconBox}>
                  <MaterialIcons name="visibility" size={20} color={theme.onSecondaryContainer} />
                </View>
                <View>
                  <Text style={styles.actionTitle}>View as Company</Text>
                  <Text style={styles.actionSub}>Open provider-facing portal</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={styles.actionDiv} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconBox}>
                  <MaterialIcons name="group" size={20} color={theme.onSecondaryContainer} />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Manage Staff</Text>
                  <Text style={styles.actionSub}>8 active registered employees</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={styles.actionDiv} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconBox}>
                  <MaterialIcons name="account-balance-wallet" size={20} color={theme.onSecondaryContainer} />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Financial Logs</Text>
                  <Text style={styles.actionSub}>Audit trails and payout history</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={styles.actionDiv} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconBox}>
                  <MaterialIcons name="gavel" size={20} color={theme.onSecondaryContainer} />
                </View>
                <View>
                  <Text style={styles.actionTitle}>Dispute History</Text>
                  <Text style={styles.actionSub}>2 closed cases, 0 pending</Text>
                </View>
              </View>
              <View style={styles.actionRight}>
                <View style={styles.clearBadge}><Text style={styles.clearBadgeTxt}>Clear</Text></View>
                <MaterialIcons name="chevron-right" size={24} color={theme.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
            <View style={styles.actionDiv} />

            <TouchableOpacity style={[styles.actionRow, { backgroundColor: 'rgba(255,218,214,0.1)' }]}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconBoxErr}>
                  <MaterialIcons name="block" size={20} color={theme.error} />
                </View>
                <View>
                  <Text style={styles.actionTitleErr}>Deactivate Account</Text>
                  <Text style={styles.actionSubErr}>Restrict all platform access</Text>
                </View>
              </View>
              <MaterialIcons name="warning" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Floating Bottom Action */}
      <View style={styles.floatingAction}>
        <View style={styles.reviewAvatarPile}>
           <Image style={styles.revAvatar} source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTTPIpEzEWY2eA4bjRGSHv-zEPv5L9f318q7ROyXsimzK5HxRIiEGQsoZcAlX-QlCWaYtUDXJupmHWRoU7kmFNgeSnddyIty0wlqAY35agOrUGd2WQ3GnHDmj-bVNNhawODERduyntExNDd7Asv4tD0f7wkMzdItfMAlzw9X7aS-Urr--r3pvn54n4YlRGSqm2Jehrgx2fpc0lmfcxhlyb0ps2eLpgYc7-n0glgTDrh_Mv-d3GXtawspyrW4zxY7MlO2sLUoa1LEo' }} />
           <Image style={[styles.revAvatar, { marginLeft: -12 }]} source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVWJksb1FItjocwarT_9OZ_ErQ1fHrSBSNdTMP04NLc65rKcBBoCy2WVsm3mlAtpnBLbkv8kQYtCY3uXDtMooqdam4CUNRsqlpxgiFwXwIEPD521OtZHYLnBhCf3zo1bE5-0TbuSUFCMggL_gqObNjZWLdTsa4Fyy854uKYvVu3zKkUitfRgj95Kb2CwF_tz39grvU-Hhey6eW-ID7itMp3ep0LYPZHoQDlxeMRoET1vCFerMbiz2rLN3lYvMc6w_5I_WjcoX-Yds' }} />
           <View style={[styles.revAvatar, styles.revAvatarOverflow, { marginLeft: -12 }]}>
             <Text style={styles.revAvatarOverflowTxt}>+2</Text>
           </View>
        </View>
        
        <TouchableOpacity style={styles.submitRevBtn}>
           <MaterialIcons name="edit-note" size={20} color={theme.primary} />
           <Text style={styles.submitRevTxt}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16, backgroundColor: 'rgba(247,249,251,0.8)', zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.1)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 8, borderRadius: 24, backgroundColor: 'transparent' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },

  identityCard: { backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  logoWrap: { width: 96, height: 96, marginBottom: 16, position: 'relative' },
  logoImg: { width: '100%', height: '100%', borderRadius: 16 },
  verifiedBadge: { position: 'absolute', bottom: -8, right: -8, backgroundColor: theme.primary, padding: 4, borderRadius: 16, borderWidth: 4, borderColor: theme.surfaceContainerLowest },
  companyName: { fontSize: 24, fontWeight: '800', color: theme.primary, marginBottom: 4 },
  companySub: { fontSize: 14, fontWeight: '500', color: theme.onSurfaceVariant, marginBottom: 16 },
  activePill: { backgroundColor: theme.secondaryContainer, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  activePillTxt: { fontSize: 10, fontWeight: '700', color: theme.onSecondaryFixedVariant, letterSpacing: 1 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.primary, paddingHorizontal: 4, marginBottom: 12 },

  ownerCard: { backgroundColor: theme.surfaceContainerLow, borderRadius: 12, padding: 20, flexDirection: 'row', gap: 16 },
  ownerImgBox: { width: 100, height: 100, borderRadius: 8, overflow: 'hidden' },
  ownerImg: { width: '100%', height: '100%' },
  ownerInfo: { flex: 1, justifyContent: 'center' },
  ownerName: { fontSize: 16, fontWeight: '700', color: theme.primary },
  ownerRole: { fontSize: 14, color: theme.onSurfaceVariant, marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  contactTxt: { fontSize: 13, color: theme.primary },

  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  bentoFull: { width: '100%', borderRadius: 16, padding: 20 },
  bentoHalf: { width: '47%', backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, padding: 16, flex: 1, justifyContent: 'space-between', height: 128 },
  
  revenueCard: { backgroundColor: theme.primaryContainer },
  revHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  revIconBox: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 8 },
  revBadge: { backgroundColor: theme.onTertiaryContainer, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  revBadgeTxt: { fontSize: 12, fontWeight: '700', color: theme.primary },
  revLabel: { fontSize: 14, fontWeight: '500', color: theme.onPrimaryContainer },
  revValue: { fontSize: 30, fontWeight: '800', color: theme.onPrimary, marginTop: 4 },

  bentoHalfHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  bentoHalfValue: { fontSize: 12, fontWeight: '700', color: theme.onSurfaceVariant },
  bentoHalfLabel: { fontSize: 12, fontWeight: '500', color: theme.onSurfaceVariant, marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: theme.surfaceContainer, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: theme.tertiaryContainer, borderRadius: 4 },
  
  barsWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  barItem: { width: 8, backgroundColor: theme.tertiaryContainer, borderTopLeftRadius: 2, borderTopRightRadius: 2 },

  ratingCard: { backgroundColor: theme.surfaceContainerLowest, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingTitle: { fontSize: 10, fontWeight: '700', color: theme.onSurfaceVariant, letterSpacing: 1, marginBottom: 4 },
  ratingStarsWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingScore: { fontSize: 30, fontWeight: '800', color: theme.primary },
  starsBox: { flexDirection: 'row' },
  ratingSub: { fontSize: 12, color: theme.onSurfaceVariant, marginTop: 4 },
  trendBtn: { width: 48, height: 48, backgroundColor: theme.surfaceContainerLow, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },

  actionListWrap: { backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, overflow: 'hidden', paddingVertical: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center' },
  actionIconBoxErr: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.errorContainer, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 15, fontWeight: '600', color: theme.primary },
  actionSub: { fontSize: 12, color: theme.onSurfaceVariant },
  actionTitleErr: { fontSize: 15, fontWeight: '600', color: theme.error },
  actionSubErr: { fontSize: 12, color: 'rgba(186,26,26,0.7)' },
  actionRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  clearBadge: { backgroundColor: theme.tertiaryFixed, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  clearBadgeTxt: { fontSize: 10, fontWeight: '700', color: theme.onTertiaryFixedVariant },
  actionDiv: { height: 1, backgroundColor: theme.surfaceContainerLow, marginHorizontal: 20 },

  floatingAction: { 
    position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 24, alignSelf: 'center', 
    backgroundColor: theme.primary, borderRadius: 32, padding: 8, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    width: '90%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 12 
  },
  reviewAvatarPile: { flexDirection: 'row', paddingLeft: 8 },
  revAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: theme.primary },
  revAvatarOverflow: { backgroundColor: theme.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  revAvatarOverflowTxt: { fontSize: 10, fontWeight: '700', color: theme.onPrimary },
  submitRevBtn: { backgroundColor: theme.surfaceContainerLowest, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitRevTxt: { fontSize: 14, fontWeight: '700', color: theme.primary }
});

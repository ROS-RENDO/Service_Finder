import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet,  TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function BookingSuccessScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.navRoundBtn} onPress={() => router.replace('/(customer)/home')}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>BOOKING STATUS</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Success Visual Section */}
        <View style={styles.successVisualBox}>
          <View style={styles.glowContainer}>
            <View style={styles.glowBlue} />
            <View style={styles.glowAccent} />
            <View style={styles.checkInnerBox}>
              <Ionicons name="checkmark-circle" size={80} color="#FFF" />
            </View>
          </View>

          <Text style={styles.mainTitle}>Booking Confirmed!</Text>
          <View style={styles.refPill}>
            <Text style={styles.refLabel}>Reference ID:</Text>
            <Text style={styles.refValue}>#{bookingId ? bookingId.slice(-8).toUpperCase() : 'SF-82910'}</Text>
          </View>
        </View>

        {/* Service Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryBgDeco} />
          
          <View style={styles.sumTopRow}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=150' }} 
              style={styles.sumImg} 
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.sumTitle}>Premium Interior Consultation</Text>
              <Text style={styles.sumSub}>Thursday, Oct 24 • 10:00 AM</Text>
            </View>
          </View>

          <View style={styles.sumDivider} />
          
          <View style={styles.sumDetailsBox}>
            <View style={styles.sumDetailItem}>
              <View style={styles.sumIconWrap}><Ionicons name="location" size={16} color={Colors.primary} /></View>
              <View>
                <Text style={styles.sumParamLabel}>Location</Text>
                <Text style={styles.sumParamText}>482 architecture Way, Design District</Text>
              </View>
            </View>
            <View style={styles.sumDetailItem}>
              <View style={styles.sumIconWrap}><Ionicons name="person" size={16} color={Colors.primary} /></View>
              <View>
                <Text style={styles.sumParamLabel}>Architect</Text>
                <Text style={styles.sumParamText}>Julian Vance</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          <Text style={styles.nextStepsBody}>
            The professional will arrive at the scheduled time. You can track their progress, message your specialist, or modify your appointment in the 
            <Text style={{ fontWeight: '800', color: Colors.primary }}> My Bookings </Text> 
            section of your dashboard.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBlock}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.replace({ pathname: '/(customer)/booking/detail', params: { id: bookingId || 'mock' } })}
          >
            <Text style={styles.btnPrimaryText}>View Booking Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.replace('/(customer)/home')}
          >
            <Text style={styles.btnSecondaryText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.supportBtn}>
          <Text style={styles.supportText}>
            Need help with your booking? <Text style={styles.supportLink}>Contact Support</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // Header
  headerRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.cardAlt,
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: Spacing.lg, zIndex: 10
  },
  navRoundBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitleBox: { flex: 1, alignItems: 'center', marginRight: 10 },
  headerTitle: { fontSize: 12, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1.5 },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xxl, paddingBottom: 60 },

  // Success Graphics
  successVisualBox: { alignItems: 'center', marginBottom: Spacing.xxl },
  glowContainer: { position: 'relative', width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  glowBlue: { position: 'absolute', top: 0, left: 10, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(27, 169, 237, 0.4)' },
  glowAccent: { position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0, 58, 85, 0.4)' },
  checkInnerBox: { width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.3, shadowRadius: 32, elevation: 15 },
  
  mainTitle: { fontSize: 28, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5, marginBottom: Spacing.sm },
  refPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.cardAlt, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  refLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub, marginRight: 8 },
  refValue: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, letterSpacing: 0.5 },

  // Service Summary Card
  summaryCard: {
    backgroundColor: Colors.dark.card, borderRadius: Radius.xl, padding: Spacing.lg,
    overflow: 'hidden', position: 'relative', marginBottom: Spacing.xl,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 10
  },
  summaryBgDeco: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.dark.cardAlt, transform: [{ scale: 1.5 }] },
  sumTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.lg, position: 'relative', zIndex: 1 },
  sumImg: { width: 64, height: 64, borderRadius: Radius.md, backgroundColor: Colors.dark.surface },
  sumTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  sumSub: { fontSize: FontSize.sm, color: Colors.dark.textSub },
  sumDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: Spacing.lg },
  sumDetailsBox: { gap: Spacing.md },
  sumDetailItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  sumIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(27, 169, 237, 0.1)', alignItems: 'center', justifyContent: 'center' },
  sumParamLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text, marginBottom: 2 },
  sumParamText: { fontSize: FontSize.sm, color: Colors.dark.textSub },

  // Next Steps
  nextStepsCard: { backgroundColor: Colors.dark.surface, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.xxl },
  nextStepsTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.sm },
  nextStepsBody: { fontSize: FontSize.sm, color: Colors.dark.textSub, textAlign: 'center', lineHeight: 22 },

  // Actions
  actionsBlock: { gap: Spacing.sm, marginBottom: Spacing.xxl },
  btnPrimary: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 18, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  btnPrimaryText: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },
  btnSecondary: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.dark.border, borderRadius: Radius.full, paddingVertical: 18, alignItems: 'center' },
  btnSecondaryText: { color: Colors.dark.textSub, fontSize: FontSize.md, fontWeight: '800' },

  supportBtn: { alignItems: 'center' },
  supportText: { fontSize: FontSize.sm, color: Colors.dark.textSub },
  supportLink: { color: Colors.primary, fontWeight: '800', textDecorationLine: 'underline' }

});

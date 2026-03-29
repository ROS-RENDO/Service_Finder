import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const { bookingId, amount, method } = useLocalSearchParams<{ bookingId: string; amount: string; method: string }>();
  
  const [processing, setProcessing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(method || 'card');
  const [promo, setPromo] = useState('');

  const basePrice = 180.00;
  const serviceFee = 12.50;
  const estimatedTax = 15.40;
  // Use passed amount if available, otherwise static sum for demo
  const totalDue = parseFloat(amount || (basePrice + serviceFee + estimatedTax).toString()).toFixed(2);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      if (!bookingId || bookingId?.startsWith('mock')) {
        setTimeout(() => {
          router.replace({ pathname: '/(customer)/booking/success', params: { bookingId: bookingId || 'mock-1234' } });
        }, 1500);
        return;
      }
      
      await apiClient.post('/api/payments/mock', { bookingId, amount: totalDue, paymentMethod });
      router.replace({ pathname: '/(customer)/booking/success', params: { bookingId } });
    } catch {
      Alert.alert('Payment Failed', 'Could not process payment at this time.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.safe}>
      {/* App Bar Top */}
      <BlurView intensity={60} tint="dark" style={styles.appBar}>
        <View style={styles.appBarInner}>
          <TouchableOpacity style={styles.navRoundBtn} onPress={() => router.back()} disabled={processing}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Checkout</Text>
        </View>
        <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
          <Text style={styles.stepText}>STEP 3 OF 3</Text>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 220, paddingTop: 100 }}>
        
        {/* Collapsible Order Summary */}
        <View style={styles.summaryBox}>
          <TouchableOpacity 
            style={styles.summaryTopInner} 
            onPress={() => setSummaryOpen(!summaryOpen)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=150' }} style={styles.summaryImg} />
              <View>
                <Text style={styles.summaryTitle}>Deep Home Cleaning</Text>
                <Text style={styles.summarySub}>Oct 24 • 09:00 AM</Text>
              </View>
            </View>
            <Ionicons name={summaryOpen ? 'chevron-up' : 'chevron-down'} size={24} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>

          {summaryOpen && (
            <View style={styles.summaryExpanded}>
              <View style={styles.sumRow}><Text style={styles.sumL}>Base Service Rate</Text><Text style={styles.sumR}>${basePrice.toFixed(2)}</Text></View>
              <View style={styles.sumRow}><Text style={styles.sumL}>Service Fee</Text><Text style={styles.sumR}>${serviceFee.toFixed(2)}</Text></View>
              <View style={[styles.sumRow, { paddingBottom: 8 }]}><Text style={styles.sumL}>Estimated Tax</Text><Text style={styles.sumR}>${estimatedTax.toFixed(2)}</Text></View>
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.sectionMargin}>
          <Text style={styles.sectionHeadingTitle}>Payment Method</Text>

          {/* Card Option */}
          <TouchableOpacity style={[styles.payCard, paymentMethod === 'card' && styles.payCardActive]} onPress={() => setPaymentMethod('card')}>
            <View style={styles.payCardInner}>
              <Ionicons name="card" size={28} color={Colors.primary} />
              <View style={styles.payInfoBox}>
                <Text style={styles.payMainTxt}>Credit / Debit Card</Text>
                <Text style={styles.paySubTxt}>•••• 4242</Text>
              </View>
              <View style={styles.changeBadge}><Text style={styles.changeBadgeTxt}>CHANGE</Text></View>
            </View>
          </TouchableOpacity>

          {/* Add New Card Btn */}
          <TouchableOpacity style={styles.addCardBtn}>
            <Ionicons name="add-circle" size={24} color={Colors.dark.textSub} />
            <Text style={styles.addCardTxt}>Add New Card</Text>
          </TouchableOpacity>

          {/* Digital Wallet Option */}
          <TouchableOpacity style={[styles.payCard, paymentMethod === 'wallet' && styles.payCardActive]} onPress={() => setPaymentMethod('wallet')}>
            <View style={styles.payCardInner}>
              <Ionicons name="wallet" size={28} color={Colors.primary} />
              <View style={styles.payInfoBox}>
                <Text style={styles.payMainTxt}>Digital Wallet Balance</Text>
                <Text style={styles.paySubTxtMock}>Balance: $450.00</Text>
              </View>
              <View style={[styles.radioOutline, paymentMethod === 'wallet' && styles.radioOutlineActive]}>
                {paymentMethod === 'wallet' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>

          {/* PayPal Option */}
          <TouchableOpacity style={[styles.payCard, paymentMethod === 'paypal' && styles.payCardActive]} onPress={() => setPaymentMethod('paypal')}>
            <View style={styles.payCardInner}>
              <Ionicons name="logo-paypal" size={28} color={Colors.primary} />
              <View style={styles.payInfoBox}>
                <Text style={styles.payMainTxt}>PayPal Integration</Text>
                <Text style={styles.paySubTxtMock}>Secure express checkout</Text>
              </View>
              <View style={[styles.radioOutline, paymentMethod === 'paypal' && styles.radioOutlineActive]}>
                {paymentMethod === 'paypal' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>

          {/* Bank Option */}
          <TouchableOpacity style={[styles.payCard, paymentMethod === 'bank' && styles.payCardActive]} onPress={() => setPaymentMethod('bank')}>
            <View style={styles.payCardInner}>
              <Ionicons name="business" size={28} color={Colors.primary} />
              <View style={styles.payInfoBox}>
                <Text style={styles.payMainTxt}>Bank Transfer Details</Text>
                <Text style={styles.paySubTxtMock}>Processing: 1-2 business days</Text>
              </View>
              <View style={[styles.radioOutline, paymentMethod === 'bank' && styles.radioOutlineActive]}>
                {paymentMethod === 'bank' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>

          {/* Cash Option */}
          <TouchableOpacity style={[styles.payCard, paymentMethod === 'cash' && styles.payCardActive]} onPress={() => setPaymentMethod('cash')}>
            <View style={styles.payCardInner}>
              <Ionicons name="cash" size={28} color={Colors.primary} />
              <View style={styles.payInfoBox}>
                <Text style={styles.payMainTxt}>Cash on Delivery</Text>
                <Text style={styles.paySubTxtMock}>Pay when service is complete</Text>
              </View>
              <View style={[styles.radioOutline, paymentMethod === 'cash' && styles.radioOutlineActive]}>
                {paymentMethod === 'cash' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Promo */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitleText}>PROMO CODE</Text>
          <View style={styles.promoRow}>
            <TextInput 
              style={styles.promoInput} 
              placeholder="ENTER CODE" 
              placeholderTextColor={Colors.dark.textMuted}
              value={promo}
              onChangeText={setPromo}
            />
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnTxt}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadgesBox}>
          <View style={styles.trustItem}><Ionicons name="shield-checkmark" size={14} color={Colors.dark.textMuted} /><Text style={styles.trustTxt}>SSL Secure</Text></View>
          <View style={styles.trustItem}><Ionicons name="checkmark-circle" size={14} color={Colors.dark.textMuted} /><Text style={styles.trustTxt}>Verified Pro</Text></View>
          <View style={styles.trustItem}><Ionicons name="lock-closed" size={14} color={Colors.dark.textMuted} /><Text style={styles.trustTxt}>PCI Compliant</Text></View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <BlurView intensity={80} tint="dark" style={styles.fixedBottomNav}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, paddingHorizontal: 4 }}>
          <Text style={styles.botLabelText}>Total Payable</Text>
          <Text style={styles.botTotalVal}>${totalDue}</Text>
        </View>
        <TouchableOpacity onPress={handlePayment} disabled={processing}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.finalPayBtn}
          >
            {processing ? <ActivityIndicator color="#FFF" /> : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <Text style={styles.finalPayBtnTxt}>Pay ${totalDue}</Text>
                <Ionicons name="lock-closed" size={20} color="#FFF" />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.termsDisclaimer}>By confirming, you agree to our <Text style={{ color: Colors.primary, fontWeight: '800' }}>Terms</Text> & <Text style={{ color: Colors.primary, fontWeight: '800' }}>SLA</Text>.</Text>
      </BlurView>

    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // App Bar Top (Absolute)
  appBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    backgroundColor: 'rgba(15, 15, 27, 0.7)', paddingHorizontal: Spacing.xl, height: 95,
    paddingTop: 55, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  appBarInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  navRoundBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  appBarTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.dark.text, letterSpacing: -0.5 },
  stepText: { fontSize: 9, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1, textTransform: 'uppercase', marginTop: 10 },

  // Summary Accordion
  summaryBox: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border, overflow: 'hidden' },
  summaryTopInner: { padding: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryImg: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: Colors.dark.surface },
  summaryTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.text },
  summarySub: { fontSize: 10, color: Colors.dark.textSub, marginTop: 4 },
  summaryExpanded: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.border, borderStyle: 'dashed', gap: 12 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumL: { color: Colors.dark.textSub, fontSize: FontSize.sm },
  sumR: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '800' },

  sectionMargin: { marginTop: Spacing.xxl, gap: Spacing.md },
  sectionHeadingTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, marginBottom: 4 },

  // Cards
  payCard: { padding: Spacing.lg, backgroundColor: Colors.dark.card, borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.dark.card },
  payCardActive: { borderColor: Colors.primary, backgroundColor: 'rgba(27, 169, 237, 0.05)' },
  payCardInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  payInfoBox: { flex: 1 },
  payMainTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.text },
  paySubTxt: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: Colors.dark.textSub, marginTop: 4, letterSpacing: 1 },
  paySubTxtMock: { fontSize: 10, color: Colors.dark.textSub, marginTop: 4 },
  changeBadge: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  changeBadgeTxt: { fontSize: 8, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  radioOutline: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  radioOutlineActive: { borderColor: Colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },

  addCardBtn: { height: 60, borderRadius: Radius.lg, borderWidth: 2, borderColor: Colors.dark.border, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  addCardTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.dark.textSub },

  // Promo
  promoSection: { marginTop: Spacing.xxl, gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.dark.border, paddingTop: Spacing.lg },
  promoTitleText: { fontSize: 12, fontWeight: '800', color: Colors.dark.text, letterSpacing: 0.5 },
  promoRow: { flexDirection: 'row', gap: Spacing.sm },
  promoInput: { flex: 1, backgroundColor: Colors.dark.card, borderWidth: 1, borderColor: Colors.dark.border, borderRadius: Radius.md, paddingHorizontal: Spacing.lg, height: 50, color: Colors.dark.text, fontSize: FontSize.sm, fontWeight: '600' },
  promoBtn: { backgroundColor: Colors.dark.cardAlt, paddingHorizontal: Spacing.xl, height: 50, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  promoBtnTxt: { color: Colors.primary, fontWeight: '800', fontSize: FontSize.sm },

  // Badges
  trustBadgesBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.xl, marginTop: Spacing.xxl, marginBottom: Spacing.md, opacity: 0.6 },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trustTxt: { fontSize: 8, fontWeight: '800', textTransform: 'uppercase', color: Colors.dark.textMuted, letterSpacing: 0.5 },

  // Fixed Bottom Nav
  fixedBottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
    backgroundColor: 'rgba(15, 15, 27, 0.8)', borderTopWidth: 1, borderTopColor: Colors.dark.border,
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 40
  },
  botLabelText: { color: Colors.dark.textSub, fontSize: FontSize.sm, fontWeight: '600' },
  botTotalVal: { color: Colors.primary, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  finalPayBtn: { height: 60, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 12 },
  finalPayBtnTxt: { color: '#FFF', fontSize: FontSize.lg, fontWeight: '800' },
  termsDisclaimer: { textAlign: 'center', fontSize: 10, color: Colors.dark.textSub, marginTop: 16 }
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';

export default function CompanyInvoiceGenScreen() {
  const router = useRouter();
  const [discount, setDiscount] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="menu" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Finder</Text>
        </View>
        <TouchableOpacity style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80' }}
            style={styles.avatarImg}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Editorial Header ───────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={styles.heroSub}>FINANCIAL TOOLS</Text>
          <Text style={styles.heroTitle}>Generate Invoice</Text>
          <Text style={styles.heroDesc}>Create and review itemized billing for completed service bookings.</Text>
        </View>

        {/* ── Booking Selection Canvas ───────────────────────────────────────── */}
        <View style={styles.bookingCard}>
          <View style={styles.bkCardHeader}>
            <View>
              <Text style={styles.bkCardTitle}>HVAC Maintenance</Text>
              <Text style={styles.bkCardSub}>Booking ID: #BK-8821</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#003a55" />
          </View>
          
          <View style={styles.bkItemsList}>
            <View style={styles.bkItemRow}>
              <Text style={styles.bkItemLbl}>System Diagnosis</Text>
              <Text style={styles.bkItemVal}>$85.00</Text>
            </View>
            <View style={styles.bkItemRow}>
              <Text style={styles.bkItemLbl}>Filter Replacement (x2)</Text>
              <Text style={styles.bkItemVal}>$44.00</Text>
            </View>
            <View style={styles.bkItemRow}>
              <Text style={styles.bkItemLbl}>Labor (2 Hours)</Text>
              <Text style={styles.bkItemVal}>$120.00</Text>
            </View>
          </View>
        </View>

        {/* ── Client Info Card ───────────────────────────────────────────────── */}
        <View style={styles.clientCard}>
          <View style={styles.clientIconWrap}>
            <Ionicons name="person" size={20} color="#57657a" />
          </View>
          <View>
            <Text style={styles.clientLabel}>CLIENT</Text>
            <Text style={styles.clientName}>Jonathan Sterling</Text>
          </View>
        </View>

        {/* ── Adjustment Bento Grid ──────────────────────────────────────────── */}
        <View style={styles.adjGrid}>
          <View style={styles.adjCard}>
            <Text style={styles.adjLabel}>DISCOUNT %</Text>
            <TextInput 
              style={styles.adjInputActive}
              placeholder="0"
              placeholderTextColor="#74777f"
              keyboardType="number-pad"
              value={discount}
              onChangeText={setDiscount}
            />
          </View>
          <View style={styles.adjCard}>
            <Text style={styles.adjLabel}>TAX RATE</Text>
            <View style={styles.adjInputDisabled}>
              <Text style={styles.adjInputDisabledTxt}>8.5%</Text>
            </View>
          </View>
        </View>

        {/* ── Calculation Summary ────────────────────────────────────────────── */}
        <View style={styles.calcSection}>
          <View style={styles.calcRow}>
            <Text style={styles.calcRowLbl}>Subtotal</Text>
            <Text style={styles.calcRowVal}>$249.00</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcRowLbl}>Tax (8.5%)</Text>
            <Text style={styles.calcRowVal}>$21.17</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={[styles.calcRowLbl, { color: Colors.danger }]}>Discount</Text>
            <Text style={[styles.calcRowVal, { color: Colors.danger }]}>-$0.00</Text>
          </View>

          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLbl}>TOTAL AMOUNT DUE</Text>
              <Text style={styles.totalVal}>$270.17</Text>
            </View>
            <View style={styles.totalIconWrap}>
              <Ionicons name="receipt-outline" size={24} color="#FFF" />
            </View>
          </View>
        </View>

        {/* ── Actions ────────────────────────────────────────────────────────── */}
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendBtnTxt}>Generate & Send</Text>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewBtn}>
            <Ionicons name="eye" size={20} color={Colors.primary} />
            <Text style={styles.previewBtnTxt}>Preview PDF</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'receipt', label: 'Invoices', active: true },
          { icon: 'chatbubble', label: 'Messages', active: false },
          { icon: 'compass', label: 'Maps', active: false },
          { icon: 'settings', label: 'Settings', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
             <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? '#FFF' : '#57657a'} />
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
    paddingHorizontal: Spacing.xl, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(247,249,251,0.9)', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { paddingRight: 8 },
  avatarWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#d5e3fc', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 110 },

  // ── Hero ───────────────────────────────────────────────────────────────────
  heroSection: { marginTop: Spacing.xl, marginBottom: 40 },
  heroSub: { fontSize: 10, fontWeight: '700', color: '#57657a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  heroTitle: { fontSize: 36, fontWeight: '800', color: Colors.primary, letterSpacing: -1, lineHeight: 42 },
  heroDesc: { fontSize: FontSize.sm, color: '#43474e', marginTop: 8, lineHeight: 22 },

  // ── Booking Canvas ─────────────────────────────────────────────────────────
  bookingCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.xl, borderLeftWidth: 4, borderLeftColor: Colors.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, marginBottom: Spacing.lg },
  bkCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  bkCardTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  bkCardSub: { fontSize: 12, color: '#43474e', marginTop: 2 },
  
  bkItemsList: { gap: 12, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)' },
  bkItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bkItemLbl: { fontSize: FontSize.sm, color: '#43474e' },
  bkItemVal: { fontSize: FontSize.sm, fontWeight: '600', color: '#191c1e' },

  // ── Client Card ────────────────────────────────────────────────────────────
  clientCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: '#f2f4f6', borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.lg },
  clientIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#d5e3fc', alignItems: 'center', justifyContent: 'center' },
  clientLabel: { fontSize: 10, fontWeight: '800', color: '#43474e', letterSpacing: 1, marginBottom: 2 },
  clientName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },

  // ── Adjustment Grid ────────────────────────────────────────────────────────
  adjGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  adjCard: { flex: 1, backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  adjLabel: { fontSize: 10, fontWeight: '800', color: '#43474e', letterSpacing: 1, marginBottom: 8 },
  adjInputActive: { backgroundColor: '#f2f4f6', borderRadius: Radius.lg, height: 44, paddingHorizontal: 12, fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  adjInputDisabled: { backgroundColor: '#f2f4f6', borderRadius: Radius.lg, height: 44, paddingHorizontal: 12, justifyContent: 'center' },
  adjInputDisabledTxt: { fontSize: FontSize.md, fontWeight: '600', color: '#43474e' },

  // ── Calc Summary ───────────────────────────────────────────────────────────
  calcSection: { marginTop: Spacing.md, gap: Spacing.md },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  calcRowLbl: { fontSize: FontSize.sm, color: '#43474e' },
  calcRowVal: { fontSize: FontSize.md, fontWeight: '600', color: '#191c1e' },

  totalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: 24, marginTop: Spacing.sm },
  totalLbl: { fontSize: 10, fontWeight: '800', color: '#86a0cd', letterSpacing: 1, marginBottom: 4 },
  totalVal: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: -1 },
  totalIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  // ── Actions ────────────────────────────────────────────────────────────────
  actionsBox: { marginTop: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.primary, paddingVertical: 20, borderRadius: Radius.full, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  sendBtnTxt: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  previewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, marginTop: Spacing.md, borderRadius: Radius.full },
  previewBtnTxt: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '800' },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(247,249,251,0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: Colors.primary },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#57657a', letterSpacing: 0.5, display: 'none' }, // Using hidden labels slightly mimicking HTML nav if you want just icons+colors
  navLabelActive: { color: '#FFF', display: 'flex' },
});

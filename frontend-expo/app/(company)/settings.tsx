import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { useSidebar } from './_layout';

export default function CompanySettingsScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState('General Info');

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Company Settings</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Tab Navigation ─────────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsWrap}>
          {['General Info', 'Verification', 'Service Areas', 'Business Hours'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab ? styles.tabBtnActive : styles.tabBtnInactive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnTxt, activeTab === tab ? styles.tabBtnTxtActive : styles.tabBtnTxtInactive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.mainContent}>
          {/* ── Media Upload Bento ───────────────────────────────────────────── */}
          <View style={styles.mediaGrid}>
            <View style={styles.coverBox}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' }} style={styles.mediaImg} />
              <View style={styles.mediaOverlay}>
                <TouchableOpacity style={styles.cameraBtn}>
                  <Ionicons name="camera" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.logoBox}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=300' }} style={styles.mediaImg} />
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="pencil" size={12} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Form Fields ──────────────────────────────────────────────────── */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COMPANY NAME</Text>
              <TextInput style={styles.inputField} value="Architectural Solutions Ltd." />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput 
                style={styles.textArea} 
                multiline 
                value="Premium commercial design services focusing on sustainable urban development and biophilic architectural patterns in metropolitan areas." 
              />
            </View>
          </View>

          {/* ── Verification Documents ───────────────────────────────────────── */}
          <View style={styles.verifyCard}>
            <View style={styles.verifyHeader}>
              <Text style={styles.verifyTitle}>Verification Documents</Text>
              <TouchableOpacity><Text style={styles.detailsBtn}>Details</Text></TouchableOpacity>
            </View>

            <View style={styles.docList}>
              <View style={styles.docItem}>
                <View style={styles.docLeft}>
                  <Ionicons name="shield-checkmark" size={20} color="#003a55" />
                  <Text style={styles.docText}>Business License</Text>
                </View>
                <View style={styles.docBadgeAppr}>
                  <Text style={styles.docBadgeApprTxt}>APPROVED</Text>
                </View>
              </View>

              <View style={styles.docItem}>
                <View style={styles.docLeft}>
                  <Ionicons name="document-text" size={20} color="#57657a" />
                  <Text style={styles.docText}>Liability Insurance</Text>
                </View>
                <View style={styles.docBadgePend}>
                  <Text style={styles.docBadgePendTxt}>PENDING</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Service Areas ────────────────────────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Service Areas</Text>
            <View style={styles.mapCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800' }} style={styles.mapImg} />
              <View style={styles.mapOverlay} />
              
              <View style={styles.mapFloatBar}>
                <View style={styles.mapFloatLeft}>
                  <Ionicons name="location" size={16} color={Colors.primary} />
                  <Text style={styles.mapFloatTxt}>12 Zip Codes Covered</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/(company)/areas')}>
                  <Text style={styles.manageBtn}>Manage</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Business Hours ───────────────────────────────────────────────── */}
          <View style={[styles.sectionBlock, { paddingBottom: 40 }]}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.hoursCard}>
              
              <View style={styles.hourRow}>
                <Text style={styles.hourDay}>Mon-Fri</Text>
                <View style={styles.timeWrap}>
                  <View style={styles.timePill}><Text style={styles.timePillTxt}>09:00 AM</Text></View>
                  <Text style={styles.timeDash}>—</Text>
                  <View style={styles.timePill}><Text style={styles.timePillTxt}>06:00 PM</Text></View>
                </View>
                <View style={styles.toggleActive}>
                  <View style={styles.toggleKnobActive} />
                </View>
              </View>

              <View style={[styles.hourRow, { opacity: 0.5 }]}>
                <Text style={styles.hourDay}>Sat-Sun</Text>
                <View style={styles.timeWrap}>
                  <View style={styles.timePill}><Text style={styles.timePillTxt}>Closed</Text></View>
                </View>
                <View style={styles.toggleInactive}>
                  <View style={styles.toggleKnobInactive} />
                </View>
              </View>

            </View>
          </View>

        </View>
      </ScrollView>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'home', label: 'Home', active: false },
          { icon: 'business', label: 'Business', active: false },
          { icon: 'folder-open', label: 'Files', active: false },
          { icon: 'person', label: 'Profile', active: true },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? Colors.primary : '#57657a'} />
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
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: '#f7f9fb', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollContent: { paddingBottom: 110, paddingTop: Spacing.sm },

  // ── Tabs ───────────────────────────────────────────────────────────────────
  tabsWrap: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, marginBottom: Spacing.lg, maxHeight: 40 },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: Radius.full, alignSelf: 'flex-start' },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabBtnInactive: { backgroundColor: '#f2f4f6' },
  tabBtnTxt: { fontSize: FontSize.sm, fontWeight: '600' },
  tabBtnTxtActive: { color: '#FFF' },
  tabBtnTxtInactive: { color: '#43474e' },

  mainContent: { paddingHorizontal: Spacing.xl },

  // ── Media Bento ────────────────────────────────────────────────────────────
  mediaGrid: { flexDirection: 'row', height: 200, gap: Spacing.md, marginBottom: Spacing.xl },
  coverBox: { flex: 2, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: '#f2f4f6', position: 'relative' },
  logoBox: { flex: 1, borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: '#1a365d', borderWidth: 4, borderColor: '#f7f9fb', position: 'relative' },
  mediaImg: { width: '100%', height: '100%', opacity: 0.9 },
  mediaOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' },
  cameraBtn: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 12, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  editBtn: { position: 'absolute', bottom: 8, right: 8, backgroundColor: Colors.primary, padding: 6, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },

  // ── Form Fields ────────────────────────────────────────────────────────────
  formSection: { gap: Spacing.lg, marginBottom: Spacing.xxl },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#43474e', letterSpacing: 1, textTransform: 'uppercase', paddingLeft: 4 },
  inputField: { backgroundColor: '#f2f4f6', borderRadius: Radius.lg, paddingHorizontal: 16, height: 50, color: '#191c1e', fontSize: FontSize.md },
  textArea: { backgroundColor: '#f2f4f6', borderRadius: Radius.lg, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, color: '#191c1e', fontSize: FontSize.md, minHeight: 120, textAlignVertical: 'top' },

  // ── Verification Docs ──────────────────────────────────────────────────────
  verifyCard: { backgroundColor: '#f2f4f6', borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.xxl },
  verifyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  verifyTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  detailsBtn: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  
  docList: { gap: Spacing.sm },
  docItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: Spacing.md, borderRadius: Radius.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4 },
  docLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  docText: { fontSize: FontSize.sm, fontWeight: '600', color: '#191c1e' },
  
  docBadgeAppr: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  docBadgeApprTxt: { color: '#15803d', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  docBadgePend: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  docBadgePendTxt: { color: '#b45309', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  // ── Generic Section ────────────────────────────────────────────────────────
  sectionBlock: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, marginBottom: 12, paddingLeft: 4 },

  // ── Map ────────────────────────────────────────────────────────────────────
  mapCard: { height: 160, borderRadius: Radius.xl, overflow: 'hidden', position: 'relative', backgroundColor: '#f2f4f6' },
  mapImg: { width: '100%', height: '100%' },
  mapOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,32,69,0.05)' },
  mapFloatBar: { position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.95)', padding: Spacing.md, borderRadius: Radius.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  mapFloatLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mapFloatTxt: { fontSize: 12, fontWeight: '700', color: '#191c1e' },
  manageBtn: { fontSize: 12, fontWeight: '800', color: Colors.primary },

  // ── Business Hours ─────────────────────────────────────────────────────────
  hoursCard: { backgroundColor: '#FFF', borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hourDay: { width: 64, fontSize: FontSize.sm, fontWeight: '600', color: '#191c1e' },
  timeWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  timePill: { backgroundColor: '#f2f4f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.lg },
  timePillTxt: { fontSize: 12, color: '#43474e', fontWeight: '500' },
  timeDash: { fontSize: 12, color: '#74777f' },
  
  toggleActive: { width: 32, height: 16, backgroundColor: Colors.primary, borderRadius: 8, position: 'relative' },
  toggleKnobActive: { position: 'absolute', right: 2, top: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFF' },
  toggleInactive: { width: 32, height: 16, backgroundColor: '#c4c6cf', borderRadius: 8, position: 'relative' },
  toggleKnobInactive: { position: 'absolute', left: 2, top: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFF' },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(247,249,251,0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20 },
  navIconWrapActive: { backgroundColor: '#d5e3fc' },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#57657a', letterSpacing: 0.5 },
  navLabelActive: { color: Colors.primary },
});

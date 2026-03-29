import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { bookingsApi } from '@/lib/api/bookings';
import { companiesApi } from '@/lib/api/companies';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TIME_SLOTS = ['09:00 AM', '11:30 AM', '02:00 PM'];
const MOCK_DATES = [
  { day: 'S', date: '29', disabled: true },
  { day: 'M', date: '30', disabled: true },
  { day: 'T', date: '1' },
  { day: 'W', date: '2' },
  { day: 'T', date: '3' },
  { day: 'F', date: '4' },
  { day: 'S', date: '5' },
];

export default function CreateBookingScreen() {
  const router = useRouter();
  const { companyId, serviceId } = useLocalSearchParams<{ companyId: string; serviceId: string }>();

  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState(serviceId || '');
  const [bookingDate, setBookingDate] = useState('3'); // mock selected date '3'
  const [startTime, setStartTime] = useState('09:00 AM');
  const [addressType, setAddressType] = useState('home');
  const [address, setAddress] = useState('4521 Oakwood Avenue, Suite 102, Los Angeles, CA');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    companiesApi.getServices().then(res => {
      const all = res.data?.services || [];
      setServices(all.filter((s: any) => s.companyId === companyId || !s.companyId));
    }).catch(() => {
      companiesApi.getById(companyId).then(r => {
        setServices(r.data?.data?.services || r.data?.company?.services || []);
      }).catch(() => {});
    }).finally(() => setFetchingServices(false));
  }, [companyId]);

  const selectedServiceData = services.find(s => s.id === selectedService) || { name: 'Deep Home Cleaning', price: 110 };
  const basePrice = selectedServiceData?.price ? parseFloat(selectedServiceData.price) : 80;
  const addonsPrice = 20;
  const tax = 10;
  const totalPrice = basePrice + addonsPrice + tax;

  const handleCreate = async () => {
    // Format mock date to actual ISO for backend (dummy format since UI is mocked)
    const formattedDate = `2024-10-${bookingDate.padStart(2, '0')}`;
    const timeTo24h = startTime === '09:00 AM' ? '09:00' : startTime === '11:30 AM' ? '11:30' : '14:00';
    
    setLoading(true);
    try {
      // Allow bypass if service is mocked, logic simulates backend response
      if (!selectedService || selectedService.startsWith('mock') || !companyId || companyId.startsWith('mock')) {
        setTimeout(() => {
          router.push({ 
            pathname: '/(customer)/booking/checkout', 
            params: { bookingId: 'mock-1234', amount: totalPrice, method: 'card' } 
          });
        }, 800);
        return;
      }

      const res = await bookingsApi.create({
        companyId,
        serviceId: selectedService,
        bookingDate: formattedDate,
        startTime: `${formattedDate}T${timeTo24h}:00.000Z`,
        endTime: `${formattedDate}T${timeTo24h}:00.000Z`,
        serviceAddress: address,
        customerNotes: notes,
        paymentMethod: 'cash',
        totalPrice: totalPrice,
      });
      const bookingId = res.data?.booking?.id || res.data?.data?.id;
      if (bookingId) {
        router.push({ 
          pathname: '/(customer)/booking/checkout', 
          params: { bookingId, amount: totalPrice, method: 'card' } 
        });
      } else {
        router.push('/(customer)/booking/list');
      }
    } catch (err: any) {
      // Fallback for demo purposes if backend fails
      setTimeout(() => {
        router.push({ 
          pathname: '/(customer)/booking/checkout', 
          params: { bookingId: 'mock-fallback', amount: totalPrice, method: 'card' } 
        });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const renderSteps = () => (
    <View style={styles.stepsInnerContainer}>
      <View style={styles.stepItem}><View style={styles.stepCircActive}><Text style={styles.stepNumActive}>1</Text></View><Text style={styles.stepTxtActive}>Date & Time</Text></View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}><View style={styles.stepCircInac}><Text style={styles.stepNumInac}>2</Text></View><Text style={styles.stepTxtInac}>Location</Text></View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}><View style={styles.stepCircInac}><Text style={styles.stepNumInac}>3</Text></View><Text style={styles.stepTxtInac}>Details</Text></View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}><View style={styles.stepCircInac}><Text style={styles.stepNumInac}>4</Text></View><Text style={styles.stepTxtInac}>Summary</Text></View>
    </View>
  );

  return (
    <View style={styles.safe}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navCircBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Book Service</Text>
        </View>
        <TouchableOpacity style={styles.navCircBtn}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 140 }}>
        
        {/* Step Indicator */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.xxl }}>
          {renderSteps()}
        </ScrollView>

        {/* Form Body */}
        <View style={styles.formSection}>
          
          {/* Schedule */}
          <View style={styles.inputGroupBlock}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
              <Text style={styles.sectionHeadingTitle}>Select Schedule</Text>
            </View>
            <View style={styles.calCard}>
              <View style={styles.calTop}>
                <Text style={styles.calMonthText}>October 2024</Text>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Ionicons name="chevron-back" size={20} color={Colors.dark.textSub} />
                  <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSub} />
                </View>
              </View>
              <View style={styles.calGrid}>
                {MOCK_DATES.map((md, i) => <Text key={i} style={styles.calDayHead}>{md.day}</Text>)}
              </View>
              <View style={styles.calGrid}>
                {MOCK_DATES.map((md, i) => (
                  <TouchableOpacity 
                    key={i} 
                    disabled={md.disabled}
                    style={[styles.calDayBtn, bookingDate === md.date && styles.calDayBtnActive]}
                    onPress={() => setBookingDate(md.date)}
                  >
                    <Text style={[
                      styles.calDayTxt, 
                      md.disabled && styles.calDayTxtDis,
                      bookingDate === md.date && styles.calDayTxtActive
                    ]}>{md.date}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Time Slots */}
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map(ts => (
                <TouchableOpacity 
                  key={ts} 
                  style={[styles.timeBtn, startTime === ts && styles.timeBtnActive]}
                  onPress={() => setStartTime(ts)}
                >
                  <Text style={[styles.timeBtnTxt, startTime === ts && styles.timeBtnTxtActive]}>{ts}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroupBlock}>
            <View style={styles.sectionHeaderRowFlex}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="location-outline" size={24} color={Colors.primary} />
                <Text style={styles.sectionHeadingTitle}>Location</Text>
              </View>
              <Text style={styles.addNewTxt}>Add New</Text>
            </View>

            <TouchableOpacity 
              style={[styles.locCard, addressType === 'home' && styles.locCardActive]}
              onPress={() => { setAddressType('home'); setAddress('4521 Oakwood Avenue, Suite 102, Los Angeles, CA'); }}
            >
              <Ionicons name="home" size={20} color={addressType === 'home' ? Colors.primary : Colors.dark.textMuted} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.locTitle}>Home</Text>
                <Text style={styles.locDesc}>4521 Oakwood Avenue, Suite 102, Los Angeles, CA</Text>
              </View>
              <View style={[styles.radioOutline, addressType === 'home' && styles.radioOutlineActive]}>
                {addressType === 'home' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.locCard, addressType === 'office' && styles.locCardActive]}
              onPress={() => { setAddressType('office'); setAddress('Tech Plaza, 8th Floor, Wilshire Blvd, LA'); }}
            >
              <Ionicons name="briefcase" size={20} color={addressType === 'office' ? Colors.primary : Colors.dark.textMuted} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.locTitle}>Office</Text>
                <Text style={styles.locDesc}>Tech Plaza, 8th Floor, Wilshire Blvd, LA</Text>
              </View>
              <View style={[styles.radioOutline, addressType === 'office' && styles.radioOutlineActive]}>
                {addressType === 'office' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Specifics */}
          <View style={styles.inputGroupBlock}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="list-outline" size={24} color={Colors.primary} />
              <Text style={styles.sectionHeadingTitle}>Specifics</Text>
            </View>
            <View style={styles.specificsBox}>
              <View style={{ marginBottom: Spacing.md }}>
                <Text style={styles.specLabel}>PREFERRED STAFF</Text>
                <View style={styles.specDrop}>
                  <Text style={styles.specDropTxt}>No preference (Auto-match)</Text>
                  <Ionicons name="chevron-down" size={20} color={Colors.dark.textSub} />
                </View>
              </View>
              <View style={{ marginBottom: Spacing.md }}>
                <Text style={styles.specLabel}>SPECIAL INSTRUCTIONS</Text>
                <TextInput 
                  style={styles.specArea}
                  placeholder="e.g. Please use eco-friendly products for the master bedroom..."
                  placeholderTextColor={Colors.dark.textMuted}
                  multiline
                  numberOfLines={3}
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
              <TouchableOpacity style={styles.uploadBtn}>
                <Ionicons name="camera-outline" size={20} color={Colors.dark.textSub} />
                <Text style={styles.uploadBtnTxt}>Upload Photos</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Details */}
          <View style={styles.inputGroupBlock}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="receipt-outline" size={24} color={Colors.primary} />
              <Text style={styles.sectionHeadingTitle}>Summary</Text>
            </View>
            
            <LinearGradient
              colors={['#002045', Colors.dark.cardAlt]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.sumCard}
            >
              <Ionicons name="sparkles-outline" size={120} color="rgba(255,255,255,0.05)" style={styles.sumBgDeco} />
              <View style={styles.sumCardInner}>
                <View style={styles.sumTopSplit}>
                  <View>
                    <Text style={styles.sumMainTitle}>{selectedServiceData.name}</Text>
                    <Text style={styles.sumMainSub}>3-4 Hours Professional Service</Text>
                  </View>
                  <Text style={styles.sumTotalVal}>${totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.sumLinesBox}>
                  <View style={styles.sumLineRow}><Text style={styles.sumLineL}>Service Base</Text><Text style={styles.sumLineR}>${basePrice.toFixed(2)}</Text></View>
                  <View style={styles.sumLineRow}><Text style={styles.sumLineL}>Add-ons (Window Deep Clean)</Text><Text style={styles.sumLineR}>${addonsPrice.toFixed(2)}</Text></View>
                  <View style={styles.sumLineRowBold}><Text style={styles.sumLineLBold}>Service Tax</Text><Text style={styles.sumLineRBold}>${tax.toFixed(2)}</Text></View>
                </View>
              </View>
            </LinearGradient>
          </View>

        </View>

      </ScrollView>

      {/* Floating Bottom Navigator */}
      <View style={styles.footerNav}>
        <TouchableOpacity style={styles.footerBack} onPress={() => router.back()}>
          <Text style={styles.footerBackTxt}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerNext} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.footerNextTxt}>Proceed to Checkout</Text>}
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // App Bar
  appBar: {
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(13, 13, 26, 0.85)',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.dark.border, zIndex: 10
  },
  navCircBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.dark.cardAlt, alignItems: 'center', justifyContent: 'center' },
  appBarTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.dark.text, letterSpacing: -0.5 },

  // Steps
  stepsInnerContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepItem: { alignItems: 'center', minWidth: 60 },
  stepLine: { width: 20, height: 2, backgroundColor: Colors.dark.border, opacity: 0.5, marginBottom: 16 },
  stepCircActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  stepNumActive: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  stepTxtActive: { fontSize: 10, fontWeight: '800', color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  stepCircInac: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.dark.cardAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  stepNumInac: { color: Colors.dark.textSub, fontSize: 12, fontWeight: '800' },
  stepTxtInac: { fontSize: 10, fontWeight: '800', color: Colors.dark.textSub, textTransform: 'uppercase', letterSpacing: 0.5 },

  formSection: { gap: 32 },
  inputGroupBlock: { gap: Spacing.md },
  sectionHeaderRowFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionHeadingTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  addNewTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },

  // Calendar Make
  calCard: { backgroundColor: Colors.dark.card, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border },
  calTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  calMonthText: { fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.text },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: Spacing.sm },
  calDayHead: { width: `${100/7}%`, textAlign: 'center', fontSize: 10, fontWeight: '800', color: Colors.dark.textSub },
  calDayBtn: { width: `${100/7}%`, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  calDayBtnActive: { backgroundColor: Colors.primary },
  calDayTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text },
  calDayTxtDis: { color: Colors.dark.border },
  calDayTxtActive: { color: '#FFF' },

  // Time Grids
  timeGrid: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  timeBtn: { 
    flex: 1, minWidth: '30%', height: 44, borderRadius: Radius.md, 
    justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.card,
    borderWidth: 2, borderColor: Colors.dark.card
  },
  timeBtnActive: { borderColor: Colors.primary, backgroundColor: `rgba(27, 169, 237, 0.1)` },
  timeBtnTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  timeBtnTxtActive: { color: Colors.primary, fontWeight: '800' },

  // Locations
  locCard: {
    padding: Spacing.lg, backgroundColor: Colors.dark.card, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.dark.card, flexDirection: 'row', alignItems: 'flex-start',
  },
  locCardActive: { borderColor: Colors.primary },
  locTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.dark.text },
  locDesc: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 4, lineHeight: 20 },
  radioOutline: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  radioOutlineActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  // Specifics
  specificsBox: { backgroundColor: Colors.dark.surface, padding: Spacing.lg, borderRadius: Radius.lg },
  specLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 0.5, marginBottom: 8 },
  specDrop: { height: 48, backgroundColor: Colors.dark.card, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  specDropTxt: { color: Colors.dark.text, fontSize: FontSize.sm },
  specArea: { backgroundColor: Colors.dark.card, borderRadius: Radius.md, padding: Spacing.md, color: Colors.dark.text, fontSize: FontSize.sm, textAlignVertical: 'top' },
  uploadBtn: { height: 48, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.dark.border, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  uploadBtnTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },

  // Summary Card
  sumCard: { borderRadius: Radius.xl, overflow: 'hidden', padding: 24, position: 'relative' },
  sumBgDeco: { position: 'absolute', right: -20, top: -20, zIndex: 0 },
  sumCardInner: { position: 'relative', zIndex: 1 },
  sumTopSplit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  sumMainTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFF' },
  sumMainSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  sumTotalVal: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  sumLinesBox: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 16, gap: 8 },
  sumLineRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLineL: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)' },
  sumLineR: { fontSize: FontSize.sm, color: '#FFF' },
  sumLineRowBold: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sumLineLBold: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', fontWeight: '800' },
  sumLineRBold: { fontSize: FontSize.sm, color: '#FFF', fontWeight: '800' },

  // Footer Button Setup
  footerNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(13, 13, 26, 0.9)', borderTopWidth: 1, borderTopColor: Colors.dark.border,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl, paddingBottom: 32,
    flexDirection: 'row', gap: Spacing.md, zIndex: 100
  },
  footerBack: { flex: 1, height: 56, borderRadius: Radius.full, borderWidth: 2, borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  footerBackTxt: { color: Colors.dark.text, fontSize: FontSize.md, fontWeight: '800' },
  footerNext: { flex: 2, height: 56, borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  footerNextTxt: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },

});

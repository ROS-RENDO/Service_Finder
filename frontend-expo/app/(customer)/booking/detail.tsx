import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, Alert, ActivityIndicator, TextInput, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { bookingsApi } from '@/lib/api/bookings';
import { Booking } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!id || id.startsWith('mock')) {
      // Mock data bypass for seamless UI testing if backend 404s
      setTimeout(() => {
        setBooking({
          id: id || 'mock-id-12345',
          status: 'confirmed',
          totalPrice: '180.00',
          bookingDate: '2024-10-24T00:00:00.000Z',
          startTime: '2024-10-24T09:00:00.000Z',
          endTime: '2024-10-24T12:00:00.000Z',
          serviceAddress: '221B Baker St, London',
          service: { name: 'Deep Home Cleaning' } as any,
          company: { name: 'Sparkle Pro Cleaning' } as any,
          payment: { status: 'paid', method: 'card' } as any,
          assignedStaff: { user: { fullName: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' } } as any,
        } as Booking);
        setLoading(false);
      }, 500);
      return;
    }

    bookingsApi.getById(id).then(res => {
      setBooking(res.data?.booking || res.data);
    }).catch(err => {
      Alert.alert('Error', 'Failed to fetch details');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) { Alert.alert('Error', 'Please provide a cancellation reason'); return; }
    setCancelLoading(true);
    try {
      if (id?.startsWith('mock')) {
        Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
        router.back();
        return;
      }
      const res = await bookingsApi.cancel(id, cancelReason);
      if (res.data) {
        Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
        router.back();
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
      setShowCancelSheet(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.safe}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: Colors.dark.text }}>Booking not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: Colors.primary }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const STATUS_STEPS = ['confirmed', 'in_progress', 'completed'];
  const normalizedStatus = ['pending', 'confirmed'].includes(booking.status) ? 'confirmed' : booking.status;
  const currentStepIndex = STATUS_STEPS.indexOf(normalizedStatus);
  const progressBarWidth = currentStepIndex === 0 ? '15%' : currentStepIndex === 1 ? '50%' : '100%';

  const isCompleted = booking.status === 'completed';

  return (
    <View style={styles.safe}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <View style={styles.appBarInner}>
          <TouchableOpacity style={styles.appBarBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Booking Details</Text>
        </View>
        <TouchableOpacity style={styles.appBarBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBlock} showsVerticalScrollIndicator={false}>
        
        {/* Timeline Tracking Section */}
        {booking.status !== 'cancelled' && (
          <View style={styles.timelineBox}>
            <View style={styles.timelineGuideParent}>
              <View style={styles.timelineLineDefault} />
              <View style={[styles.timelineLineActive, { width: progressBarWidth as any }]} />
              
              <View style={styles.timelinePoint}>
                {currentStepIndex >= 0 ? (
                  <View style={styles.tlCircleActive}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
                ) : <View style={styles.tlCircleInactive}><View style={styles.tlDot} /></View>}
                <Text style={[styles.tlLabel, currentStepIndex >= 0 ? styles.tlLabelActive : null]}>Confirmed</Text>
              </View>

              <View style={styles.timelinePoint}>
                {currentStepIndex >= 1 ? (
                  <View style={styles.tlCircleActive}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
                ) : <View style={styles.tlCircleInactive}><View style={styles.tlDot} /></View>}
                <Text style={[styles.tlLabel, currentStepIndex >= 1 ? styles.tlLabelActive : null]}>In-Progress</Text>
              </View>

              <View style={styles.timelinePoint}>
                {currentStepIndex >= 2 ? (
                  <View style={styles.tlCircleActive}><Ionicons name="checkmark" size={16} color="#FFF" /></View>
                ) : <View style={styles.tlCircleInactive}><View style={styles.tlDotEmpty} /></View>}
                <Text style={[styles.tlLabel, currentStepIndex >= 2 ? styles.tlLabelActive : null]}>Completed</Text>
              </View>
            </View>
          </View>
        )}

        {/* Hero Service Block */}
        <View style={styles.heroCard}>
          <View style={styles.heroImgBox}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80' }} 
              style={styles.heroImg} 
            />
            <View style={styles.heroStatusPill}>
              <View style={[styles.heroStatusDot, { backgroundColor: booking.status === 'cancelled' ? Colors.danger : Colors.success }]} />
              <Text style={styles.heroStatusTxt}>{booking.status.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.heroDetails}>
            <View style={styles.heroLeftWrap}>
              <Text style={styles.heroTitle} numberOfLines={2}>{booking.service?.name}</Text>
              <Text style={styles.heroProvider}>by {booking.company?.name}</Text>
            </View>
            <View style={styles.heroRightWrap}>
              <Text style={styles.heroPrice}>${parseFloat(booking.totalPrice).toFixed(2)}</Text>
              <Text style={styles.heroPriceLable}>TOTAL PAID</Text>
            </View>
          </View>
        </View>

        {/* Schedule & Location */}
        <View style={styles.sectionGrid}>
          {/* Schedule */}
          <View style={styles.dualCardBox}>
            <View style={styles.iconDecoBox}><Ionicons name="calendar" size={20} color={Colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardMiniLabel}>SCHEDULE</Text>
              <Text style={styles.cardMainBold}>{new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
              <Text style={styles.cardSubText}>{new Date(booking.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.mapCardWrap}>
            <View style={styles.dualCardBox}>
              <View style={styles.iconDecoBox}><Ionicons name="location" size={20} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardMiniLabel}>LOCATION</Text>
                <Text style={styles.cardMainBold} numberOfLines={2}>{booking.serviceAddress}</Text>
              </View>
            </View>
            <View style={styles.mapImgWrap}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80' }} style={styles.mapImg} />
              <View style={styles.mapOverlay}>
                <View style={styles.mapPin}>
                  <Ionicons name="home" size={16} color="#FFF" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Staff assigned */}
        {booking.assignedStaff && (
          <View style={styles.staffBlock}>
            <Text style={styles.blockSecLabel}>ASSIGNED PROFESSIONAL</Text>
            <View style={styles.staffCard}>
              <View style={styles.staffInfoSide}>
                <View style={styles.staffAvatarWrap}>
                  <Image source={{ uri: booking.assignedStaff?.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }} style={styles.staffImg} />
                  <View style={styles.staffStarBadge}><Ionicons name="star" size={10} color="#FFF" /></View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.staffName}>{booking.assignedStaff?.user?.fullName || 'Staff Member'}</Text>
                  <View style={styles.staffMetaRow}>
                    <Text style={styles.staffMetaTxt}>Professional</Text>
                    <View style={styles.staffDot} />
                    <Text style={styles.staffMetaVal}>4.9</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.staffActionBtn} onPress={() => router.push({ pathname: '/(customer)/chat', params: { companyId: booking.company?.id } })}>
                <Ionicons name="chatbubble" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment confirmation block */}
        <View style={styles.paymentStatusCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View style={styles.payIconBox}><Ionicons name="card" size={20} color={Colors.primary} /></View>
            <View>
              <Text style={styles.payLabel}>PAYMENT STATUS</Text>
              <Text style={styles.payVal}>
                {booking.payment?.status === 'paid' ? `Paid via ${booking.payment?.method?.toUpperCase() || 'Card'}` : 'Pending Payment'}
              </Text>
            </View>
          </View>
          {booking.payment?.status === 'paid' && (
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          )}
        </View>

        {/* Cancel Secondary Link */}
        {!isCompleted && booking.status !== 'cancelled' && (
          <View style={styles.cancelLinkWrap}>
            <TouchableOpacity onPress={() => setShowCancelSheet(true)}>
              <Text style={styles.cancelLinkTxt}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Floating Bottom Navigator Actions */}
      <View style={styles.fixedBottomDock}>
        <View style={styles.btnDockGrid}>
          {isCompleted ? (
            <TouchableOpacity 
              style={[styles.dockBtnSec, { flex: 1 }]} 
              onPress={() => router.push({ pathname: '/(customer)/review', params: { bookingId: booking.id } })}
            >
              <Ionicons name="star" size={18} color={Colors.dark.textSub} />
              <Text style={styles.dockBtnSecTxt}>Leave Review</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.dockBtnSec}>
                <Ionicons name="create" size={18} color={Colors.dark.textSub} />
                <Text style={styles.dockBtnSecTxt}>Modify</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dockBtnPri} onPress={() => router.push({ pathname: '/(customer)/chat', params: { companyId: booking.company?.id, bookingId: booking.id } })}>
                <Ionicons name="paper-plane" size={18} color="#FFF" />
                <Text style={styles.dockBtnPriTxt}>Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Modal Actions */}
      {showCancelSheet && (
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetBox}>
            <View style={styles.sheetDragLine} />
            <Text style={styles.sheetMainTitle}>Cancel Booking</Text>
            <Text style={styles.sheetSubText}>Please tell us why you're cancelling</Text>
            
            <TextInput 
              style={styles.sheetInput} 
              placeholder="Reason for cancellation..."
              placeholderTextColor={Colors.dark.textMuted}
              multiline
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            
            <View style={styles.sheetRowBtns}>
              <TouchableOpacity style={styles.sheetGhostBtn} onPress={() => setShowCancelSheet(false)}>
                <Text style={styles.sheetGhostTxt}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetDangerBtn} onPress={handleCancel} disabled={cancelLoading}>
                {cancelLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.sheetDangerTxt}>Confirm Cancel</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // AppBar Structure
  topAppBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 16, paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.dark.bg, zIndex: 100
  },
  appBarInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  appBarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  appBarTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollBlock: { paddingHorizontal: Spacing.lg, paddingBottom: 150, paddingTop: 6 },

  // Timeline
  timelineBox: { backgroundColor: Colors.dark.card, borderRadius: Radius.xl, padding: Spacing.xl, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  timelineGuideParent: { flexDirection: 'row', justifyContent: 'space-between', position: 'relative' },
  timelineLineDefault: { position: 'absolute', top: 14, left: 16, right: 16, height: 2, backgroundColor: Colors.dark.border },
  timelineLineActive: { position: 'absolute', top: 14, left: 16, height: 2, backgroundColor: Colors.primary },
  timelinePoint: { alignItems: 'center', gap: 8, zIndex: 5, width: 80 },
  tlCircleActive: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  tlCircleInactive: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.dark.surface, borderWidth: 4, borderColor: Colors.dark.card, alignItems: 'center', justifyContent: 'center' },
  tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.dark.textMuted },
  tlDotEmpty: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.dark.border },
  tlLabel: { fontSize: 9, fontWeight: '800', color: Colors.dark.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  tlLabelActive: { color: Colors.primary },

  // Hero Card
  heroCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  heroImgBox: { height: 160, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroStatusPill: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(13, 13, 26, 0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroStatusDot: { width: 8, height: 8, borderRadius: 4 },
  heroStatusTxt: { fontSize: 10, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  heroDetails: { padding: Spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLeftWrap: { flex: 1, paddingRight: Spacing.md },
  heroTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  heroProvider: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  heroRightWrap: { alignItems: 'flex-end', borderLeftWidth: 1, borderLeftColor: Colors.dark.border, paddingLeft: Spacing.md },
  heroPrice: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  heroPriceLable: { fontSize: 9, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 1 },

  // Double Grid
  sectionGrid: { gap: Spacing.md, marginBottom: Spacing.md },
  dualCardBox: { backgroundColor: Colors.dark.card, padding: Spacing.lg, borderRadius: Radius.xl, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderWidth: 1, borderColor: Colors.dark.border },
  iconDecoBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(27, 169, 237, 0.1)', alignItems: 'center', justifyContent: 'center' },
  cardMiniLabel: { fontSize: 9, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1, marginBottom: 2 },
  cardMainBold: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary },
  cardSubText: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 2 },

  mapCardWrap: { backgroundColor: Colors.dark.card, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.dark.border },
  mapImgWrap: { height: 120, position: 'relative' },
  mapImg: { width: '100%', height: '100%', opacity: 0.5 },
  mapOverlay: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  mapPin: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, borderWidth: 4, borderColor: Colors.dark.cardAlt, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },

  // Staff
  staffBlock: { marginTop: Spacing.lg, gap: Spacing.sm },
  blockSecLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 1, paddingHorizontal: 4 },
  staffCard: { backgroundColor: Colors.dark.cardAlt, padding: Spacing.md, borderRadius: Radius.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: Colors.dark.border },
  staffInfoSide: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  staffAvatarWrap: { position: 'relative' },
  staffImg: { width: 56, height: 56, borderRadius: 28 },
  staffStarBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#003a55', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.dark.cardAlt },
  staffName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, marginBottom: 2 },
  staffMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  staffMetaTxt: { fontSize: 12, color: Colors.dark.textSub },
  staffDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.dark.border },
  staffMetaVal: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  staffActionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(27, 169, 237, 0.1)', alignItems: 'center', justifyContent: 'center' },

  // Payment
  paymentStatusCard: { backgroundColor: Colors.dark.card, padding: Spacing.lg, borderRadius: Radius.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  payIconBox: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: 'rgba(27, 169, 237, 0.1)', alignItems: 'center', justifyContent: 'center' },
  payLabel: { fontSize: 9, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1, marginBottom: 2 },
  payVal: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },

  cancelLinkWrap: { alignItems: 'center', paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  cancelLinkTxt: { color: Colors.danger, fontSize: FontSize.sm, fontWeight: '800', textDecorationLine: 'underline' },

  // Bottom Nav Float
  fixedBottomDock: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(13, 13, 26, 0.95)', borderTopWidth: 1, borderTopColor: Colors.dark.border, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: 40, zIndex: 100 },
  btnDockGrid: { flexDirection: 'row', gap: Spacing.md },
  dockBtnSec: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.dark.cardAlt, paddingVertical: 18, borderRadius: Radius.full },
  dockBtnSecTxt: { color: Colors.dark.textSub, fontSize: FontSize.md, fontWeight: '800' },
  dockBtnPri: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 18, borderRadius: Radius.full },
  dockBtnPriTxt: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },

  // Sheets
  sheetOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200, justifyContent: 'flex-end' },
  sheetBox: { backgroundColor: Colors.dark.card, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl, paddingBottom: 60, borderWidth: 1, borderColor: Colors.dark.border },
  sheetDragLine: { width: 40, height: 4, backgroundColor: Colors.dark.border, alignSelf: 'center', borderRadius: 2, marginBottom: Spacing.xl },
  sheetMainTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginBottom: 6 },
  sheetSubText: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: Spacing.lg },
  sheetInput: { height: 100, backgroundColor: Colors.dark.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.dark.border, color: Colors.dark.text, padding: Spacing.md, textAlignVertical: 'top', fontSize: FontSize.sm },
  sheetRowBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  sheetGhostBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: Colors.dark.surface, borderRadius: Radius.full },
  sheetGhostTxt: { color: Colors.dark.textSub, fontWeight: '800' },
  sheetDangerBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: Colors.danger, borderRadius: Radius.full },
  sheetDangerTxt: { color: '#FFF', fontWeight: '800' }
});

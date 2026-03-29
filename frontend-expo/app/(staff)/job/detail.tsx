import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, Image,
  TouchableOpacity, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { bookingsApi } from '@/lib/api/bookings';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '@/lib/api/client';
import MapView, { Marker } from 'react-native-maps';

const MOCK_JOB = {
  id: 'mock-8829',
  status: 'confirmed',
  serviceAddress: '221B Baker St, London',
  addressDetail: 'Apartment 4C, Buzzer 1202',
  customerNotes: "Customer has a cat. Focus on the range hood and under the sink. Ensure all stainless steel surfaces are polished.",
  service: { name: 'Deep Kitchen Cleaning' },
  customer: {
    fullName: 'Sarah Chen',
    subtitle: 'Premium Client • 12 Bookings',
    phone: '+44 7700 900123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
  },
  bookingDate: new Date().toISOString(),
  startTime: '09:00 AM',
  endTime: '12:00 PM',
};

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id || id.startsWith('mock')) {
        setBooking(MOCK_JOB);
        setLoading(false);
        return;
      }
      try {
        const res = await bookingsApi.getById(id!);
        setBooking(res.data?.booking);
      } catch {
        Alert.alert('Error', 'Failed to load job details');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleStartJob = async () => {
    if (booking?.id?.startsWith('mock')) {
      setBooking((b: any) => ({ ...b, status: 'in_progress' }));
      router.push({ pathname: '/(staff)/job/execute', params: { id: booking.id } });
      return;
    }
    setUpdating(true);
    try {
      await apiClient.patch(`/api/staff/bookings/${booking.id}/status`, { status: 'in_progress' });
      setBooking((b: any) => ({ ...b, status: 'in_progress' }));
      router.push({ pathname: '/(staff)/job/execute', params: { id: booking.id } });
    } catch {
      Alert.alert('Error', 'Could not start job');
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteJob = async () => {
    if (booking?.id?.startsWith('mock')) {
      setBooking((b: any) => ({ ...b, status: 'completed' }));
      router.replace('/(staff)/dashboard');
      return;
    }
    setUpdating(true);
    try {
      await apiClient.patch(`/api/staff/bookings/${booking.id}/status`, { status: 'completed' });
      router.replace('/(staff)/dashboard');
    } catch {
      Alert.alert('Error', 'Could not complete job');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  const isConfirmed = booking?.status === 'confirmed';
  const isInProgress = booking?.status === 'in_progress';
  const isCompleted = booking?.status === 'completed';
  const bookingRef = booking?.id?.startsWith('mock') ? '#BK-8829' : `#BK-${booking?.id?.slice(-4).toUpperCase()}`;

  return (
    <SafeAreaView style={styles.safe}>
      {/* TopAppBar */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Job ID + Status */}
        <View style={styles.refCard}>
          <View>
            <Text style={styles.refLabel}>SERVICE REFERENCE</Text>
            <Text style={styles.refId}>{bookingRef}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillTxt}>{(booking?.status || 'confirmed').toUpperCase().replace('_', ' ')}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.card}>
          <View style={styles.customerRow}>
            <Image
              source={{ uri: booking?.customer?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' }}
              style={styles.customerAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{booking?.customer?.fullName || 'Customer'}</Text>
              <Text style={styles.customerSubtitle}>{booking?.customer?.subtitle || 'Client'}</Text>
            </View>
          </View>
          <View style={styles.contactBtnRow}>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => booking?.customer?.phone && Linking.openURL(`tel:${booking.customer.phone}`)}
            >
              <Ionicons name="call" size={18} color="#3a485b" />
              <Text style={styles.contactBtnTxt}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => router.push({ pathname: '/(staff)/chat', params: { customerId: booking?.customer?.id, customerName: booking?.customer?.fullName } })}
            >
              <Ionicons name="chatbubble" size={18} color="#3a485b" />
              <Text style={styles.contactBtnTxt}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Card with Map */}
        <View style={styles.card}>
          <View style={styles.locationHeader}>
            <Ionicons name="location-sharp" size={22} color={Colors.primary} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.locationAddr}>{booking?.serviceAddress || '—'}</Text>
              {booking?.addressDetail && (
                <Text style={styles.locationDetail}>{booking.addressDetail}</Text>
              )}
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapImage}
              initialRegion={{
                latitude: booking?.latitude || 51.5237,
                longitude: booking?.longitude || -0.1586,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: booking?.latitude || 51.5237,
                  longitude: booking?.longitude || -0.1586,
                }}
                title={booking?.serviceAddress || 'Job Location'}
              />
            </MapView>
            <TouchableOpacity
              style={styles.directionsBtn}
              onPress={() => {
                const addr = encodeURIComponent(booking?.serviceAddress || '');
                Linking.openURL(`https://maps.google.com/?q=${addr}`);
              }}
            >
              <Ionicons name="navigate" size={14} color="#FFF" />
              <Text style={styles.directionsBtnTxt}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Task + Notes */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>SERVICE TASK</Text>
          <View style={styles.serviceTaskRow}>
            <View style={styles.serviceTaskIconWrap}>
              <Ionicons name="construct" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.serviceTaskName}>{booking?.service?.name || 'Service'}</Text>
          </View>

          {booking?.customerNotes && (
            <View style={{ marginTop: Spacing.lg }}>
              <Text style={styles.cardSectionLabel}>SPECIAL NOTES</Text>
              <View style={styles.notesBox}>
                <Text style={styles.notesText}>
                  <Text style={styles.notesHighlight}>Note: </Text>
                  {booking.customerNotes}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Sticky Bottom Action Dock */}
      <BlurView intensity={80} tint="dark" style={styles.actionDock}>
        {(isConfirmed || isInProgress) && (
          <TouchableOpacity
            onPress={isConfirmed ? handleStartJob : handleCompleteJob}
            disabled={updating}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={[styles.primaryActionBtn, updating && { opacity: 0.7 }]}
            >
              {updating ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name={isConfirmed ? 'play' : 'checkmark-circle'} size={20} color="#FFF" />
                  <Text style={styles.primaryActionTxt}>{isConfirmed ? 'Start Job' : 'Complete Job'}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={styles.completedBadgeTxt}>Job Completed</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.secondaryActionBtn}
          onPress={() => router.push({ pathname: '/(staff)/chat', params: { customerId: booking?.customer?.id } })}
        >
          <Ionicons name="chatbubble-outline" size={16} color={Colors.dark.text} />
          <Text style={styles.secondaryActionTxt}>Message Customer</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: 'rgba(15, 15, 27, 0.7)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },

  scrollContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, flexGrow: 1 },

  refCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.dark.cardAlt, padding: Spacing.lg, borderRadius: Radius.xl, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.dark.border,
  },
  refLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textSub, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  refId: { fontSize: 24, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  statusPill: { backgroundColor: 'rgba(213,227,252,0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  statusPillTxt: { fontSize: 11, fontWeight: '800', color: Colors.primary, letterSpacing: 0.8 },

  card: {
    backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.dark.border,
  },

  customerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  customerAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.dark.surface },
  customerName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },
  customerSubtitle: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 2 },
  contactBtnRow: { flexDirection: 'row', gap: Spacing.md },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 12, borderRadius: Radius.full,
  },
  contactBtnTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text },

  locationHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: Spacing.md },
  locationAddr: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },
  locationDetail: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 2 },
  mapContainer: { borderRadius: Radius.lg, overflow: 'hidden', position: 'relative', height: 180 },
  mapImage: { width: '100%', height: '100%' },
  directionsBtn: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.full,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  directionsBtnTxt: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '700' },

  cardSectionLabel: { fontSize: 10, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.md },
  serviceTaskRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.dark.surface, padding: Spacing.md, borderRadius: Radius.lg },
  serviceTaskIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(108, 99, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
  serviceTaskName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, flex: 1 },
  notesBox: { backgroundColor: Colors.dark.surface, padding: Spacing.md, borderRadius: Radius.lg, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  notesHighlight: { fontWeight: '800', color: Colors.primary, fontStyle: 'italic' },
  notesText: { fontSize: FontSize.sm, color: Colors.dark.textSub, lineHeight: 22 },

  actionDock: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.lg, paddingBottom: Platform.OS === 'ios' ? 36 : Spacing.lg,
    backgroundColor: 'rgba(15, 15, 27, 0.85)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)',
    gap: Spacing.sm,
  },
  primaryActionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: Radius.full,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  primaryActionTxt: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },
  secondaryActionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 16, borderRadius: Radius.full,
  },
  secondaryActionTxt: { color: Colors.dark.text, fontSize: FontSize.md, fontWeight: '700' },
  completedBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: `${Colors.success}15`, paddingVertical: 14, borderRadius: Radius.full,
    borderWidth: 1, borderColor: `${Colors.success}44`,
  },
  completedBadgeTxt: { color: Colors.success, fontSize: FontSize.md, fontWeight: '800' },
});

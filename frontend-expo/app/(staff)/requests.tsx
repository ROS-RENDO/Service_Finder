import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, Image,
  TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { Ionicons } from '@expo/vector-icons';

interface ServiceRequest {
  id: string;
  name?: string;
  service?: { name: string; thumbnail?: string };
  company?: { name: string };
  description?: string;
  proposedRate?: string;
  requirements?: string;
  thumbnail?: string;
}

// Demo data matching the HTML mockup exactly
const DEMO_REQUESTS: ServiceRequest[] = [
  {
    id: 'demo-1',
    name: 'Industrial Floor Cleaning',
    description: 'Must have own equipment, Available weekends',
    proposedRate: '$25/hr',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'demo-2',
    name: 'HVAC Maintenance',
    description: 'Certification required, Emergency calls only',
    proposedRate: '$45/hr',
    thumbnail: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'demo-3',
    name: 'High-Rise Window Wash',
    description: 'Safety rig certified, Insurance verified',
    proposedRate: '$65/hr',
    thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=300',
  },
];

export default function StaffRequestsScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actioning, setActioning] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/api/staff/services/pending');
      const data = res.data?.pendingBookings || [];
      setRequests(data.length ? data : DEMO_REQUESTS);
    } catch {
      setRequests(DEMO_REQUESTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchRequests(); };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (id.startsWith('demo')) {
      // Optimistically remove demo item
      setRequests((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    setActioning(`${id}-${action}`);
    try {
      if (action === 'approve') {
        await apiClient.patch(`/api/staff/services/${id}/approve`);
      } else {
        await apiClient.patch(`/api/staff/services/${id}/reject`);
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      Alert.alert('Error', `Failed to ${action} request`);
    } finally {
      setActioning(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <BlurView intensity={70} tint="dark" style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Service Offerings</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Subtitle */}
        <Text style={styles.pendingLabel}>
          Pending Approval ({requests.length})
        </Text>

        {requests.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No pending service requests at the moment.</Text>
          </View>
        ) : (
          requests.map((item) => {
            const name = item.name || item.service?.name || 'New Service Request';
            const description = item.description || item.requirements || '';
            const rate = item.proposedRate || '—';
            const thumbUri = item.thumbnail || item.service?.thumbnail || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300';
            const isApprovingThis = actioning === `${item.id}-approve`;
            const isRejectingThis = actioning === `${item.id}-reject`;

            return (
              <View key={item.id} style={styles.requestCard}>
                {/* Card Top Row: image + info */}
                <View style={styles.cardTopRow}>
                  <Image source={{ uri: thumbUri }} style={styles.cardThumb} resizeMode="cover" />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardServiceName}>{name}</Text>
                    {description ? (
                      <Text style={styles.cardDescription} numberOfLines={2}>{description}</Text>
                    ) : null}
                    <View style={styles.cardRateRow}>
                      <Ionicons name="cash" size={18} color="#003a55" />
                      <Text style={styles.cardRateTxt}>Proposed Rate: {rate}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActionRow}>
                  <TouchableOpacity
                    style={[styles.approveBtn, isApprovingThis && { opacity: 0.7 }]}
                    onPress={() => handleAction(item.id, 'approve')}
                    disabled={isApprovingThis || isRejectingThis}
                    activeOpacity={0.8}
                  >
                    {isApprovingThis
                      ? <ActivityIndicator color="#FFF" size="small" />
                      : <Text style={styles.approveBtnTxt}>Approve</Text>
                    }
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.rejectBtn, isRejectingThis && { opacity: 0.7 }]}
                    onPress={() => handleAction(item.id, 'reject')}
                    disabled={isApprovingThis || isRejectingThis}
                    activeOpacity={0.8}
                  >
                    {isRejectingThis
                      ? <ActivityIndicator color={Colors.primary} size="small" />
                      : <Text style={styles.rejectBtnTxt}>Reject</Text>
                    }
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },

  // Header
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: 'rgba(15, 15, 27, 0.7)',
    position: 'relative', zIndex: 10,
  },
  headerBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary, flex: 1, letterSpacing: -0.4 },

  scrollContent: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, flexGrow: 1 },

  pendingLabel: {
    fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub,
    marginBottom: Spacing.md, paddingHorizontal: 4,
  },

  // Request Cards
  requestCard: {
    backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, padding: Spacing.md,
    marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  cardThumb: { width: 80, height: 80, borderRadius: Radius.lg, backgroundColor: Colors.dark.surface },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardServiceName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },
  cardDescription: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 4, lineHeight: 20 },
  cardRateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  cardRateTxt: { fontSize: FontSize.md, fontWeight: '700', color: Colors.dark.text },

  // Action Buttons
  cardActionRow: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.sm },
  approveBtn: {
    flex: 1, height: 44, backgroundColor: Colors.primary,
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
  },
  approveBtnTxt: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '800', letterSpacing: 0.5 },
  rejectBtn: {
    flex: 1, height: 44, backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.dark.border,
  },
  rejectBtnTxt: { color: Colors.dark.textSub, fontSize: FontSize.sm, fontWeight: '800', letterSpacing: 0.5 },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyIconWrap: { marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  emptySub: { fontSize: FontSize.sm, color: Colors.dark.textSub, textAlign: 'center', lineHeight: 22 },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, RefreshControl, ActivityIndicator, Image, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { Ionicons } from '@expo/vector-icons';

interface StaffStats {
  completedBookingsCount: number;
  totalEarnings: number;
  rating?: number;
}

interface StaffInfo {
  id: string;
  userId: string;
  role: string;
  user: { fullName: string; avatar?: string };
  company: { name: string };
  isOnline?: boolean;
}

interface Booking {
  id: string;
  status: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  serviceAddress: string;
  service?: { name: string; thumbnail?: string };
  customer?: { fullName: string };
}

export default function StaffDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<StaffInfo | null>(null);
  const [stats, setStats] = useState<StaffStats>({ completedBookingsCount: 0, totalEarnings: 0, rating: 4.9 });
  const [todayJobs, setTodayJobs] = useState<Booking[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const load = async () => {
    try {
      const [meRes, bookRes, reqRes] = await Promise.allSettled([
        apiClient.get('/api/staff/me'),
        apiClient.get('/api/staff/bookings?status=confirmed&limit=5'),
        apiClient.get('/api/staff/services/pending'),
      ]);
      if (meRes.status === 'fulfilled') {
        setStaff(meRes.value.data?.staff ?? null);
        setStats({
          completedBookingsCount: meRes.value.data?.stats?.completedBookingsCount || 0,
          totalEarnings: meRes.value.data?.stats?.totalEarnings || 0,
          rating: 4.9 // default visual demo until hooked up to reviews aggregation
        });
      }
      if (bookRes.status === 'fulfilled') {
        const bookings = bookRes.value.data?.bookings || [];
        setTodayJobs(bookings.length ? bookings : [getMockJob()]); // Demo mock insertion if empty just so layout is visible
      }
      if (reqRes.status === 'fulfilled') {
        setPendingRequests(reqRes.value.data?.pendingBookings || []);
      }
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getMockJob = (): Booking => ({
    id: 'mock-100',
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 10800000).toISOString(),
    serviceAddress: '221B Baker St, London',
    service: { name: 'Deep Kitchen Cleaning', thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600' },
    customer: { fullName: 'Sherlock Holmes' },
  });

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  const name = user?.fullName || staff?.user?.fullName || 'Staff';
  const avatarUrl = staff?.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Header */}
      <BlurView intensity={70} tint="dark" style={styles.headerRow}>
        <Image source={{ uri: avatarUrl }} style={styles.headerAvatar} />
        <Text style={styles.headerGreeting}>Hello, {name.split(' ')[0]}!</Text>
        <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/(staff)/requests')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.dark.text} />
          {pendingRequests.length > 0 && <View style={styles.bellDot} />}
        </TouchableOpacity>
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.scrollBlock} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        
        {/* Animated Alert Banner */}
        {pendingRequests.length > 0 && (
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/(staff)/requests')}
          >
            <LinearGradient
              colors={['rgba(213,227,252,0.1)', 'rgba(213,227,252,0.2)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.alertBanner}
            >
              <View style={styles.alertLeftBorder} />
              <Ionicons name="alert-circle" size={24} color={Colors.primaryLight} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.alertTitle}>New Job Request</Text>
                <Text style={styles.alertSub}>{pendingRequests.length} pending service request(s) await review</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.primaryLight} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Status Toggle Card */}
        <View style={styles.statusToggleCard}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.statusCardTitle}>Availability Status</Text>
            <Text style={styles.statusCardSub}>
              {isOnline ? 'You are currently online and visible to new jobs' : 'You are currently offline and not receiving requests'}
            </Text>
          </View>
          <Switch 
            value={isOnline} 
            onValueChange={setIsOnline} 
            trackColor={{ false: Colors.dark.surface, true: Colors.primary }}
            thumbColor={'#FFF'}
            ios_backgroundColor={Colors.dark.surface}
          />
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGridRow}>
          <View style={styles.statBoxCard}>
            <Text style={styles.statMiniLabel}>TODAY'S EARNINGS</Text>
            <Text style={styles.statBigValue}>${(stats.totalEarnings || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.statBoxCard}>
            <Text style={styles.statMiniLabel}>JOBS DONE</Text>
            <Text style={styles.statBigValue}>{stats.completedBookingsCount}</Text>
          </View>
          <View style={styles.statBoxCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.statMiniLabel}>AVG RATING</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.statBigValue}>{stats.rating}</Text>
              <Ionicons name="star" size={14} color="#003a55" style={{ paddingBottom: 2 }} />
            </View>
          </View>
        </View>

        {/* Next Job Cards Loop */}
        <View style={styles.assignmentBlockWrap}>
          <Text style={styles.upcomingTitle}>Upcoming Assignment</Text>
          
          {todayJobs.length === 0 ? (
            <View style={styles.emptyAssignWrap}>
              <Text style={styles.emptyTitle}>You're all clear!</Text>
              <Text style={styles.emptySub}>No remaining jobs for today.</Text>
            </View>
          ) : (
            todayJobs.map(job => {
              const bImg = job.service?.thumbnail || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600';
              const timeRange = `${new Date(job.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${new Date(job.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
              return (
                <View key={job.id} style={styles.assignmentCard}>
                  <View style={styles.assignHeroImgWrap}>
                    <Image source={{ uri: bImg }} style={styles.assignHeroImg} />
                    <View style={styles.assignHeroPill}>
                      <Text style={styles.assignHeroPillTxt}>CONFIRMED</Text>
                    </View>
                  </View>
                  
                  <View style={styles.assignDetailsWrap}>
                    <Text style={styles.jobName}>{job.service?.name}</Text>
                    <View style={styles.jobTimingRow}>
                      <Ionicons name="time-outline" size={14} color={Colors.dark.textSub} />
                      <Text style={styles.jobTimingTxt}>{timeRange}</Text>
                    </View>
                    
                    <View style={styles.jobLocatorWrap}>
                      <Ionicons name="location-sharp" size={16} color={Colors.primary} style={{ marginTop: 2 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.jobLocationAddr}>{job.serviceAddress}</Text>
                        <Text style={styles.jobLocationCust}>Customer: {job.customer?.fullName}</Text>
                      </View>
                    </View>

                    <View style={styles.jobBtnColWrap}>
                      <TouchableOpacity
                        style={styles.primaryActionBtn}
                        onPress={() => router.push({ pathname: '/(staff)/job/detail', params: { id: job.id } })}
                      >
                        <Ionicons name="navigate-circle" size={18} color="#FFF" />
                        <Text style={styles.primaryActionTxt}>View Job Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.secondaryActionBtn}
                        onPress={() => router.push({ pathname: '/(staff)/job/detail', params: { id: job.id } })}
                      >
                        <Ionicons name="information-circle-outline" size={16} color="#3a485b" />
                        <Text style={styles.secondaryActionTxt}>Job Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: Spacing.xxl + 40 }} />
      </ScrollView>

      {/* Floating Action Button — AI Tools */}
      <TouchableOpacity
        onPress={() => router.push('/(staff)/ai-measure')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <Ionicons name="hardware-chip" size={22} color="#FFF" />
          <Text style={styles.fabTxt}>AI Measure</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, paddingTop: Platform.OS === 'ios' ? 50 : 20, zIndex: 10, backgroundColor: 'rgba(15, 15, 27, 0.7)' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surface },
  headerGreeting: { flex: 1, fontSize: FontSize.xl, fontWeight: '800', color: Colors.dark.text, paddingHorizontal: 12, letterSpacing: -0.5 },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 10, right: 12, width: 9, height: 9, borderRadius: 4.5, backgroundColor: Colors.danger, borderWidth: 2, borderColor: Colors.dark.bg },
  
  scrollBlock: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },

  // Notice Banner
  alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.cardAlt, paddingRight: Spacing.lg, paddingVertical: Spacing.md, borderRadius: Radius.xl, marginBottom: Spacing.lg, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(108, 99, 255, 0.2)' },
  alertLeftBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: Colors.primaryLight },
  alertTitle: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primaryLight, letterSpacing: -0.3 },
  alertSub: { fontSize: 11, color: Colors.dark.textSub, marginTop: 2, fontWeight: '600' },

  // Status Toggle
  statusToggleCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.dark.cardAlt, padding: Spacing.lg, borderRadius: Radius.xl, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  statusCardTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  statusCardSub: { fontSize: FontSize.sm, color: Colors.dark.textSub, lineHeight: 20 },

  // Quick Stats Grid
  statsGridRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
  statBoxCard: { flex: 1, backgroundColor: Colors.dark.cardAlt, padding: Spacing.md, borderRadius: Radius.xl, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: Colors.dark.border },
  statMiniLabel: { fontSize: 9, fontWeight: '800', color: Colors.dark.textMuted, letterSpacing: 1, marginBottom: 8 },
  statBigValue: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  fab: {
    position: 'absolute', bottom: 100, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingLeft: 16, paddingRight: 20,
    borderRadius: Radius.full,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10, zIndex: 100,
  },
  fabTxt: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '800' },

  // Upcoming Cards Block
  assignmentBlockWrap: { paddingHorizontal: 4 },
  upcomingTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, paddingHorizontal: 4, marginBottom: Spacing.md },
  
  assignmentCard: { backgroundColor: Colors.dark.cardAlt, borderRadius: Radius.xl, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 4, marginBottom: Spacing.xl, borderWidth: 1, borderColor: Colors.dark.border },
  assignHeroImgWrap: { width: '100%', height: 130, position: 'relative', backgroundColor: Colors.dark.surface },
  assignHeroImg: { width: '100%', height: '100%' },
  assignHeroPill: { position: 'absolute', top: 12, left: 12, backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  assignHeroPillTxt: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },

  assignDetailsWrap: { padding: Spacing.lg },
  jobName: { fontSize: 20, fontWeight: '800', color: Colors.dark.text, letterSpacing: -0.4 },
  jobTimingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  jobTimingTxt: { fontSize: FontSize.sm, color: Colors.dark.textSub, fontWeight: '500' },

  jobLocatorWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.dark.surface, padding: Spacing.md, borderRadius: Radius.lg, marginVertical: Spacing.md },
  jobLocationAddr: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.text },
  jobLocationCust: { fontSize: 11, color: Colors.dark.textSub, marginTop: 2, fontWeight: '500' },

  jobBtnColWrap: { gap: 8, marginTop: Spacing.sm },
  primaryActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: Radius.full, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  primaryActionTxt: { color: '#FFF', fontSize: FontSize.md, fontWeight: '800' },

  secondaryActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center', backgroundColor: 'rgba(108, 99, 255, 0.15)', paddingVertical: 14, borderRadius: Radius.full },
  secondaryActionTxt: { color: Colors.primaryLight, fontSize: FontSize.md, fontWeight: '800' },

  emptyAssignWrap: { paddingVertical: Spacing.xl, alignItems: 'center', justifyContent: 'center', opacity: 0.8 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text },
  emptySub: { fontSize: FontSize.sm, color: Colors.dark.textSub },
});

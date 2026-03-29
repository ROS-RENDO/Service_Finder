import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, Image,
  TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { Ionicons } from '@expo/vector-icons';

export default function StaffScheduleScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'Month'|'Week'>('Month');
  const [selectedDay, setSelectedDay] = useState<number>(24); // Matching mockup default

  // Generated Calendar Grid mapping HTML perfectly
  const calendarDays = [
    { day: 28, isMuted: true }, { day: 29, isMuted: true }, { day: 30, isMuted: true },
    { day: 1, hasJob: false }, { day: 2, hasJob: true }, { day: 3, hasJob: false }, { day: 4, hasJob: false },
    { day: 5, hasJob: false }, { day: 6, hasJob: true }, { day: 7, hasJob: false }, { day: 8, hasJob: false },
    { day: 9, hasJob: true }, { day: 10, hasJob: false }, { day: 11, hasJob: false },
    { day: 12, hasJob: true }, { day: 13, hasJob: false }, { day: 14, hasJob: false }, { day: 15, hasJob: false },
    { day: 16, hasJob: false }, { day: 17, hasJob: false }, { day: 18, hasJob: true },
    { day: 19, hasJob: false }, { day: 20, hasJob: true }, { day: 21, hasJob: false }, { day: 22, hasJob: true },
    { day: 23, hasJob: false }, { day: 24, hasJob: true }, { day: 25, hasJob: false }
  ];

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get('/api/staff/bookings');
      setBookings(res.data?.bookings || []);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  // Merging Mock Data with real data to illustrate the exact design accurately
  const demoJobs = [
    {
      id: 'mock-100',
      status: 'confirmed',
      startTime: '2026-10-24T09:00:00.000Z',
      endTime: '2026-10-24T12:00:00.000Z',
      serviceAddress: '221B Baker St, London',
      service: { name: 'Deep Kitchen Cleaning' },
      isMock: true,
      avatars: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150']
    },
    {
      id: 'mock-101',
      status: 'confirmed',
      startTime: '2026-10-24T13:30:00.000Z',
      endTime: '2026-10-24T15:00:00.000Z',
      serviceAddress: '45 Regency Square, Brighton',
      service: { name: 'Window Treatment' },
      isMock: true,
      avatars: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150']
    },
  ];

  const renderAgendaJobs = () => {
    // Usually we would map `bookings` conditionally filtering by `selectedDay`
    const mappedJobs = bookings.length ? bookings : demoJobs;

    return (
      <View>
        {mappedJobs.map((item, idx) => {
          const startTimeStr = new Date(item.startTime || new Date()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const endTimeStr = new Date(item.endTime || new Date(Date.now() + 7200000)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          
          return (
            <TouchableOpacity 
              key={item.id} 
              style={styles.agendaCard}
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/(staff)/job/detail', params: { id: item.id } })}
            >
              <View style={styles.agendaTopRow}>
                <View style={styles.agendaTimingWrap}>
                  <View style={styles.agendaTimingInner}>
                    <Ionicons name="time-outline" size={12} color="#1a365d" />
                    <Text style={styles.agendaTimingTxt}>{startTimeStr} - {endTimeStr}</Text>
                  </View>
                  <Text style={styles.agendaJobName}>{item.service?.name || 'Service Appointment'}</Text>
                </View>
                <View style={styles.agendaConfirmedPill}>
                  <Text style={styles.agendaConfirmedTxt}>{(item.status || 'Confirmed').toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.agendaLocationRow}>
                <Ionicons name="location-sharp" size={16} color={Colors.dark.textSub} />
                <Text style={styles.agendaLocationTxt}>{item.serviceAddress || 'Client Location'}</Text>
              </View>

              <View style={styles.agendaFooterRow}>
                <View style={styles.avatarOverlapContainer}>
                  {item.avatars?.map((img: string, index: number) => (
                    <Image key={index} source={{ uri: img }} style={styles.overlapAvatar} />
                  ))}
                  {idx === 0 && (
                    <View style={styles.overlapInitialBox}>
                      <Text style={styles.overlapInitialTxt}>+1</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailsBtn}>
                  <Text style={styles.detailsBtnTxt}>Details</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Example Blocked Time */}
        {selectedDay === 24 && (
          <View style={styles.blockedCard}>
            <View style={styles.agendaTimingInner}>
              <Ionicons name="ban" size={12} color={Colors.dark.textSub} />
              <Text style={[styles.agendaTimingTxt, { color: Colors.dark.textSub }]}>04:00 PM - 05:30 PM</Text>
            </View>
            <Text style={styles.blockedTitleTxt}>Blocked: Personal Appointment</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Absolute Floating App Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerTitleWrap}>
          <TouchableOpacity style={styles.headerMenuBtn} onPress={() => router.back()}>
            <Ionicons name="menu" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule</Text>
        </View>

        <View style={styles.togglePillContainer}>
          <TouchableOpacity 
            style={[styles.togglePillInner, activeTab === 'Month' ? styles.togglePillActive : null]}
            onPress={() => setActiveTab('Month')}
          >
            <Text style={[styles.togglePillTxt, activeTab === 'Month' ? styles.togglePillTxtActive : null]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.togglePillInner, activeTab === 'Week' ? styles.togglePillActive : null]}
            onPress={() => setActiveTab('Week')}
          >
            <Text style={[styles.togglePillTxt, activeTab === 'Week' ? styles.togglePillTxtActive : null]}>Week</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollBlock}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        
        {/* Calendar Card Block */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarControlRow}>
            <Text style={styles.calendarMonthTxt}>October 2026</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity style={styles.calChevronBtn}>
                <Ionicons name="chevron-back" size={20} color={Colors.dark.textSub} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.calChevronBtn}>
                <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSub} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Weekday Row */}
          <View style={styles.calWeekRow}>
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(w => (
              <Text key={w} style={styles.calWeekDayTxt}>{w}</Text>
            ))}
          </View>

          {/* Days Grid Rendering */}
          <View style={styles.calGridWrapper}>
            {calendarDays.map((dObj, i) => {
              const active = dObj.day === selectedDay && !dObj.isMuted;
              return (
                <TouchableOpacity 
                  key={i} 
                  style={[styles.calDayWrap, active ? styles.calDayActive : null]}
                  onPress={() => !dObj.isMuted && setSelectedDay(dObj.day)}
                  activeOpacity={dObj.isMuted ? 1 : 0.7}
                >
                  <Text style={[styles.calDayTxt, dObj.isMuted ? styles.calDayMuted : null, active ? styles.calDayTxtActive : null]}>
                    {dObj.day}
                  </Text>
                  {/* Job Dot Marker */}
                  {dObj.hasJob && !active && <View style={styles.calJobMuteDot} />}
                  {dObj.hasJob && active && <View style={styles.calJobActiveDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Agenda Title Block */}
        <View style={styles.agendaTitleRow}>
          <Text style={styles.agendaTitleTxt}>Agenda: Oct {selectedDay}</Text>
          <Text style={styles.agendaSubTxt}>3 Jobs Scheduled</Text>
        </View>

        {/* Dynamic List Execution */}
        {renderAgendaJobs()}

        <View style={{ height: Spacing.xxl * 3 }} />
      </ScrollView>

      {/* Floating Availability Setup */}
      <TouchableOpacity style={styles.floatingActionBtn} onPress={() => router.push('/(staff)/time-off')}>
        <Ionicons name="calendar-outline" size={20} color="#FFF" />
        <Text style={styles.floatingActionTxt}>Request Time Off</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // Header
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, paddingTop: Platform.OS === 'ios' ? 50 : 20, zIndex: 40, backgroundColor: 'rgba(247, 249, 251, 0.9)', borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
  headerTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerMenuBtn: { padding: 4, borderRadius: 20, backgroundColor: 'rgba(27, 169, 237, 0.05)' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  togglePillContainer: { flexDirection: 'row', backgroundColor: Colors.dark.surface, padding: 4, borderRadius: Radius.full },
  togglePillInner: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full },
  togglePillActive: { backgroundColor: Colors.dark.bg, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  togglePillTxt: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.dark.textSub },
  togglePillTxtActive: { color: Colors.primary },

  scrollBlock: { paddingBottom: Spacing.xxl },

  // Calendar
  calendarCard: { margin: Spacing.lg, backgroundColor: Colors.dark.cardAlt, padding: Spacing.lg, borderRadius: Radius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: Colors.dark.border },
  calendarControlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  calendarMonthTxt: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  calChevronBtn: { padding: 6, borderRadius: 20 },
  
  calWeekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  calWeekDayTxt: { width: `${100/7}%`, textAlign: 'center', fontSize: 11, fontWeight: '800', color: Colors.dark.border, textTransform: 'uppercase', letterSpacing: 1 },
  
  calGridWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  calDayWrap: { width: `${100/7}%`, height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative', marginVertical: 4 },
  calDayActive: { backgroundColor: Colors.primary, borderRadius: Radius.full, transform: [{ scale: 1.1 }], zIndex: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  calDayTxt: { fontSize: FontSize.md, fontWeight: '600', color: Colors.dark.text },
  calDayMuted: { color: Colors.dark.textMuted },
  calDayTxtActive: { color: '#FFF', fontWeight: '800' },
  
  calJobMuteDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: '#1a365d' },
  calJobActiveDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF' },

  // Agenda Blocks
  agendaTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  agendaTitleTxt: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  agendaSubTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },

  agendaCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, backgroundColor: Colors.dark.cardAlt, padding: Spacing.lg, borderRadius: Radius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: Colors.dark.border },
  agendaTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  agendaTimingWrap: { flex: 1 },
  agendaTimingInner: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  agendaTimingTxt: { fontSize: FontSize.sm, fontWeight: '600', color: '#1a365d' },
  agendaJobName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.4 },
  agendaConfirmedPill: { backgroundColor: '#d5e3fc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  agendaConfirmedTxt: { fontSize: 9, fontWeight: '800', color: '#004c6e', letterSpacing: 1 },

  agendaLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  agendaLocationTxt: { fontSize: FontSize.sm, color: Colors.dark.textSub },

  agendaFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.dark.surface },
  avatarOverlapContainer: { flexDirection: 'row', paddingLeft: 8 },
  overlapAvatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: Colors.dark.cardAlt, marginLeft: -8, backgroundColor: Colors.dark.surface },
  overlapInitialBox: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: Colors.dark.cardAlt, marginLeft: -8, backgroundColor: '#1a365d', alignItems: 'center', justifyContent: 'center' },
  overlapInitialTxt: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailsBtnTxt: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },

  blockedCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, backgroundColor: Colors.dark.surface, padding: Spacing.lg, borderRadius: Radius.xl, borderLeftWidth: 4, borderLeftColor: Colors.dark.border },
  blockedTitleTxt: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.textSub, fontStyle: 'italic', letterSpacing: -0.4 },

  // Floating Action
  floatingActionBtn: { position: 'absolute', bottom: 100, right: 24, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 14, paddingLeft: 16, paddingRight: 20, borderRadius: Radius.full, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6, zIndex: 50 },
  floatingActionTxt: { color: '#FFF', fontSize: FontSize.sm, fontWeight: '800' },
});

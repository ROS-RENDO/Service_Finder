import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { bookingsApi } from '@/lib/api/bookings';
import { Booking } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'upcoming' | 'past' | 'cancelled';

export default function BookingListScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const fetchBookings = async () => {
    try {
      // Fetch all for local filtering
      const res = await bookingsApi.getAll({});
      setBookings(res.data?.bookings || []);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { setLoading(true); fetchBookings(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  // Filter logic based on tab
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') return ['pending', 'confirmed', 'in_progress', 'enroute'].includes(b.status);
    if (activeTab === 'past') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  const getStatusPillInfo = (status: string) => {
    switch(status) {
      case 'confirmed': return { text: 'Confirmed', bg: 'rgba(27, 169, 237, 0.15)', col: Colors.primary };
      case 'in_progress':
      case 'enroute': return { text: 'In-Progress', bg: 'rgba(0, 58, 85, 0.15)', col: 'rgba(0, 160, 255, 1)' };
      case 'pending': return { text: 'Pending', bg: 'rgba(234, 179, 8, 0.15)', col: 'rgba(202, 138, 4, 1)' };
      case 'cancelled': return { text: 'Cancelled', bg: 'rgba(239, 68, 68, 0.15)', col: 'rgba(239, 68, 68, 1)' };
      case 'completed': return { text: 'Completed', bg: 'rgba(34, 197, 94, 0.15)', col: 'rgba(34, 197, 94, 1)' };
      default: return { text: status, bg: Colors.dark.surface, col: Colors.dark.textSub };
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const defaultImg = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200";
    const statusInfo = getStatusPillInfo(item.status);

    return (
      <View style={styles.cardBlock}>
        <View style={styles.cardInnerTop}>
          <View style={styles.imgClip}>
            {/* Using mock fallback since we dont have explicit service imgs linked locally */}
            <Image source={{ uri: defaultImg }} style={styles.cardImg} />
          </View>
          <View style={styles.cardRightInfo}>
            <View>
              <View style={styles.titleRowHead}>
                <Text style={styles.serviceName} numberOfLines={1}>{item.service?.name || 'Service'}</Text>
                <View style={[styles.statusPill, { backgroundColor: statusInfo.bg }]}>
                  <Text style={[styles.statusPillTxt, { color: statusInfo.col }]}>{statusInfo.text}</Text>
                </View>
              </View>
              <Text style={styles.companyName} numberOfLines={1}>{item.company?.name || 'Service Provider'}</Text>
            </View>
            <View style={styles.dateRowWrap}>
              <Ionicons name={item.status === 'in_progress' ? 'time' : 'calendar'} size={14} color={Colors.dark.textSub} />
              <Text style={styles.dateTxt}>
                {item.status === 'in_progress' ? 'Started at 10:15 AM' :
                  `${new Date(item.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${new Date(item.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })}`
                }
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardDividerLine} />
        
        <View style={styles.cardActionsRow}>
          <Text style={styles.cardPrice}>${parseFloat(item.totalPrice || '0').toFixed(2)}</Text>
          <View style={styles.actionBtnsWrap}>
            {item.status === 'confirmed' && (
              <>
                <TouchableOpacity style={styles.actionBtnSec} onPress={() => router.push({ pathname: '/(customer)/booking/detail', params: { id: item.id } })}>
                  <Text style={styles.actionBtnSecTxt}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnPri} onPress={() => router.push({ pathname: '/(customer)/booking/detail', params: { id: item.id } })}>
                  <Text style={styles.actionBtnPriTxt}>Manage</Text>
                </TouchableOpacity>
              </>
            )}
            {(item.status === 'in_progress' || item.status === 'enroute') && (
              <TouchableOpacity style={styles.actionBtnPriFull} onPress={() => router.push({ pathname: '/(customer)/booking/detail', params: { id: item.id } })}>
                <Text style={styles.actionBtnPriTxt}>Track Arrival</Text>
              </TouchableOpacity>
            )}
            {item.status === 'pending' && (
              <>
                <TouchableOpacity style={styles.actionBtnGhost}>
                  <Text style={styles.actionBtnGhostTxt}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnSec} onPress={() => router.push({ pathname: '/(customer)/booking/detail', params: { id: item.id } })}>
                  <Text style={styles.actionBtnSecTxt}>View Info</Text>
                </TouchableOpacity>
              </>
            )}
            {(item.status === 'completed' || item.status === 'cancelled') && (
              <TouchableOpacity style={styles.actionBtnSec} onPress={() => router.push({ pathname: '/(customer)/booking/detail', params: { id: item.id } })}>
                <Text style={styles.actionBtnSecTxt}>View Details</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.safebg}>
      
      {/* AppBar */}
      <BlurView intensity={70} tint="dark" style={styles.appBar}>
        <View style={styles.appBarInner}>
          <TouchableOpacity style={styles.navRoundBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>My Bookings</Text>
        </View>
        <TouchableOpacity style={styles.navRoundBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </BlurView>

      {/* Sticky Tabs */}
      <View style={styles.tabsWrap}>
        <View style={styles.tabsBg}>
          {(['upcoming', 'past', 'cancelled'] as TabType[]).map(tab => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabBtnTxt, activeTab === tab && styles.tabBtnTxtActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main List Area */}
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={filteredBookings}
          keyExtractor={b => b.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContentPad}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyWrapBox}>
              <Ionicons name="calendar-clear-outline" size={64} color={Colors.dark.border} />
              <Text style={styles.emptyTitleTxt}>No {activeTab} bookings</Text>
              <Text style={styles.emptySubTxt}>When you book a service, it will appear here.</Text>
            </View>
          }
          ListFooterComponent={
            <LinearGradient
              colors={['rgba(26, 54, 93, 1)', Colors.primaryDark]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.infoBannerBox}
            >
              <View style={styles.infoBannerContent}>
                <Text style={styles.infoTitle}>Need help with a booking?</Text>
                <Text style={styles.infoDesc}>Our concierge team is available 24/7 to resolve any scheduling issues.</Text>
                <TouchableOpacity style={styles.infoBtn}>
                  <Text style={styles.infoBtnTxt}>Contact Support</Text>
                </TouchableOpacity>
              </View>
              <Ionicons name="headset" size={140} color="#FFF" style={styles.infoBannerIconDeco} />
            </LinearGradient>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safebg: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // AppBar
  appBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 12, paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(15, 15, 27, 0.7)', zIndex: 50
  },
  appBarInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  navRoundBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  appBarTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  // Tabs
  tabsWrap: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.dark.bg, zIndex: 40 },
  tabsBg: { flexDirection: 'row', backgroundColor: Colors.dark.surface, padding: 4, borderRadius: Radius.full },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.full },
  tabBtnActive: { backgroundColor: Colors.dark.cardAlt, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabBtnTxt: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.dark.textSub },
  tabBtnTxtActive: { color: Colors.primary, fontWeight: '800' },

  loader: { flex: 1, marginTop: 60 },
  listContentPad: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 100 },

  // Booking Card
  cardBlock: { backgroundColor: Colors.dark.card, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.dark.border },
  cardInnerTop: { flexDirection: 'row', padding: Spacing.lg, gap: Spacing.md },
  imgClip: { width: 80, height: 80, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: Colors.dark.surface },
  cardImg: { width: '100%', height: '100%' },
  cardRightInfo: { flex: 1, justifyContent: 'space-between' },
  titleRowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  serviceName: { flex: 1, fontSize: FontSize.md, fontWeight: '800', color: Colors.primary, lineHeight: 20 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  statusPillTxt: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  companyName: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 2 },
  dateRowWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  dateTxt: { fontSize: 12, fontWeight: '600', color: Colors.dark.textSub, letterSpacing: -0.2 },

  cardDividerLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  
  cardActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: 12, backgroundColor: Colors.dark.cardAlt },
  cardPrice: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  actionBtnsWrap: { flexDirection: 'row', gap: Spacing.sm },
  
  actionBtnGhost: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, justifyContent: 'center' },
  actionBtnGhostTxt: { fontSize: 12, fontWeight: '800', color: Colors.dark.textSub },
  
  actionBtnSec: { backgroundColor: 'rgba(27, 169, 237, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, justifyContent: 'center' },
  actionBtnSecTxt: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  
  actionBtnPri: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, justifyContent: 'center' },
  actionBtnPriFull: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 8, borderRadius: Radius.full, justifyContent: 'center' },
  actionBtnPriTxt: { fontSize: 12, fontWeight: '800', color: '#FFF' },

  // Empty State
  emptyWrapBox: { alignItems: 'center', paddingVertical: 80 },
  emptyTitleTxt: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, marginTop: Spacing.lg, marginBottom: 4 },
  emptySubTxt: { fontSize: FontSize.sm, color: Colors.dark.textSub },

  // Info Banner
  infoBannerBox: { borderRadius: Radius.xl, padding: Spacing.xl, overflow: 'hidden', position: 'relative', marginTop: Spacing.lg, marginBottom: Spacing.xl },
  infoBannerContent: { position: 'relative', zIndex: 5, paddingRight: 40 },
  infoTitle: { fontSize: FontSize.lg, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  infoDesc: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', lineHeight: 22, marginBottom: Spacing.lg },
  infoBtn: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: Spacing.xl, paddingVertical: 10, borderRadius: Radius.full },
  infoBtnTxt: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  infoBannerIconDeco: { position: 'absolute', bottom: -40, right: -30, opacity: 0.05, transform: [{ rotate: '15deg' }] }

});

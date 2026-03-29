import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

export default function CustomerNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/api/users/notifications');
      setNotifications(res.data?.notifications || []);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchNotifications(); };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'booking': return '📅';
      case 'payment': return '💳';
      case 'review': return '⭐';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const renderNotif = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.card, !item.isRead && styles.unread]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getNotifIcon(item.type)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.notifTitle}>{item.title || 'Notification'}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{item.message || item.body || ''}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 30 }} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n, i) => n.id || String(i)}
          renderItem={renderNotif}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySub}>You'll be notified about booking updates here</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  backText: { fontSize: 24, color: Colors.dark.text },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text },
  loader: { marginTop: 60 },
  list: { paddingBottom: Spacing.xxl },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  unread: { backgroundColor: `${Colors.primary}08` },
  iconContainer: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.dark.card,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.dark.border,
  },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  notifTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.dark.text, marginBottom: 2 },
  notifBody: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: 4 },
  time: { fontSize: FontSize.xs, color: Colors.dark.textMuted },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 80, padding: Spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.dark.text, marginBottom: 6 },
  emptySub: { fontSize: FontSize.sm, color: Colors.dark.textSub, textAlign: 'center' },
});

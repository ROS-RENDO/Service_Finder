import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,  FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

export default function CustomerPaymentScreen() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await apiClient.get('/api/users/payments');
      setPayments(res.data?.payments || []);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchPayments(); };

  const getPaymentIcon = (method: string) => {
    if (method.includes('card')) return '💳';
    if (method.includes('paypal')) return '🅿️';
    if (method.includes('apple') || method.includes('google')) return '📱';
    if (method.includes('crypto')) return '₿';
    return '💵';
  };

  const renderPayment = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{getPaymentIcon(item.paymentMethod)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.serviceName}>{item.booking?.service?.name || 'Service Booking'}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <View style={styles.methodBadge}>
            <Text style={styles.methodText}>{item.paymentMethod.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.amount}>${parseFloat(item.amount || '0').toFixed(2)}</Text>
        <View style={[styles.statusBadge, {
          backgroundColor: item.status === 'completed' ? `${Colors.success}22` : `${Colors.warning}22`
        }]}>
          <Text style={[styles.statusText, {
            color: item.status === 'completed' ? Colors.success : Colors.warning
          }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Payment History</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Total Spent</Text>
        <Text style={styles.summaryTotal}>
          ${payments.reduce((acc, curr) => acc + parseFloat(curr.amount || '0'), 0).toFixed(2)}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item, index) => item.id || String(index)}
          renderItem={renderPayment}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🧾</Text>
              <Text style={styles.emptyTitle}>No payment history</Text>
              <Text style={styles.emptySub}>Your completed transactions will appear here</Text>
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

  summaryBox: {
    backgroundColor: `${Colors.primary}15`, borderBottomWidth: 1, borderBottomColor: `${Colors.primary}33`,
    padding: Spacing.lg, alignItems: 'center',
  },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginBottom: 4 },
  summaryTotal: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.primary },

  list: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.dark.card,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardLeft: { flexDirection: 'row', flex: 1 },
  iconBox: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.dark.surface,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  icon: { fontSize: 24 },
  info: { flex: 1, justifyContent: 'center' },
  serviceName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.dark.text, marginBottom: 2 },
  date: { fontSize: FontSize.xs, color: Colors.dark.textSub, marginBottom: 4 },
  methodBadge: { alignSelf: 'flex-start', backgroundColor: Colors.dark.surface, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm },
  methodText: { fontSize: 10, color: Colors.dark.textMuted, textTransform: 'capitalize', fontWeight: '600' },

  cardRight: { alignItems: 'flex-end', justifyContent: 'center' },
  amount: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.dark.text, marginBottom: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },

  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text, marginBottom: 6 },
  emptySub: { fontSize: FontSize.sm, color: Colors.dark.textSub },
});

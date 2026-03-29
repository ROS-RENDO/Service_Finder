import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet,  FlatList,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';

export default function StaffChat() {
  const router = useRouter();
  const { conversationId, customerName, customerId } = useLocalSearchParams<{ conversationId?: string; customerName?: string; customerId?: string }>();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState(conversationId || '');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { if (activeConvId) loadMessages(activeConvId); }, [activeConvId]);

  const loadConversations = async () => {
    try {
      const res = await apiClient.get('/api/conversations');
      const convs = res.data?.conversations || [];
      setConversations(convs);
      if (convs.length > 0 && !activeConvId && !customerId) setActiveConvId(convs[0].id);
    } catch { } finally { setLoading(false); }
  };

  const loadMessages = async (id: string) => {
    try {
      const res = await apiClient.get(`/api/conversations/${id}/messages`);
      setMessages(res.data?.messages || []);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    } catch { }
  };

  const startConversation = async () => {
    if (!customerId) return;
    try {
      const res = await apiClient.post('/api/conversations', { customerId });
      const id = res.data?.conversation?.id;
      if (id) { setActiveConvId(id); loadConversations(); }
    } catch { }
  };

  useEffect(() => {
    if (customerId && conversations.length === 0 && !loading) startConversation();
  }, [loading, customerId, conversations]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvId) return;
    setSending(true);
    const text = newMessage.trim();
    setNewMessage('');
    try {
      await apiClient.post(`/api/conversations/${activeConvId}/messages`, { content: text });
      await loadMessages(activeConvId);
    } catch { } finally { setSending(false); }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === user?.id;
    return (
      <View style={[msgStyles.container, isMe ? msgStyles.containerMe : msgStyles.containerOther]}>
        {!isMe && (
          <View style={msgStyles.avatar}>
            <Text style={msgStyles.avatarText}>{(item.sender?.fullName || '?')[0]}</Text>
          </View>
        )}
        <View style={[msgStyles.bubble, isMe ? msgStyles.bubbleMe : msgStyles.bubbleOther]}>
          <Text style={[msgStyles.text, isMe ? msgStyles.textMe : msgStyles.textOther]}>{item.content}</Text>
          <Text style={[msgStyles.time, !isMe && { color: Colors.dark.textMuted }]}>
            {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}><ActivityIndicator size="large" color={Colors.primary} /></View>
      </SafeAreaView>
    );
  }

  if (conversations.length === 0 && !customerId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
          <Text style={styles.title}>Messages</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySub}>Customers will message you regarding their bookings</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <Text style={styles.title}>{customerName || 'Messages'}</Text>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex} keyboardVerticalOffset={90}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.messageInput}
            placeholder="Write a message..."
            placeholderTextColor={Colors.dark.textMuted}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!newMessage.trim() || sending) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const msgStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  containerMe: { justifyContent: 'flex-end' },
  containerOther: { justifyContent: 'flex-start' },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: `${Colors.primary}33`, alignItems: 'center', justifyContent: 'center', marginRight: 6,
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  bubble: { maxWidth: '75%', borderRadius: Radius.lg, padding: 12, paddingBottom: 6 },
  bubbleMe: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: Colors.dark.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.dark.border },
  text: { fontSize: FontSize.md, lineHeight: 20 },
  textMe: { color: '#fff' },
  textOther: { color: Colors.dark.text },
  time: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4, alignSelf: 'flex-end' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  flex: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.border,
  },
  backText: { fontSize: 24, color: Colors.dark.text },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.dark.text, marginBottom: 6 },
  emptySub: { fontSize: FontSize.sm, color: Colors.dark.textSub, textAlign: 'center', paddingHorizontal: 40 },

  messageList: { padding: Spacing.lg, flexGrow: 1 },

  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.dark.border,
    backgroundColor: Colors.dark.card,
  },
  messageInput: {
    flex: 1, backgroundColor: Colors.dark.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.dark.border, paddingHorizontal: Spacing.md,
    paddingVertical: 10, fontSize: FontSize.md, color: Colors.dark.text, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendIcon: { color: '#fff', fontSize: 18 },
});

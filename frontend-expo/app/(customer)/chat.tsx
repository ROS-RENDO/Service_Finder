import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet,  FlatList, Image,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import apiClient from '@/lib/api/client';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender?: { fullName: string };
  isImage?: boolean;
}

interface Conversation {
  id: string;
  participants?: any[];
}

export default function CustomerChat() {
  const router = useRouter();
  const { companyId, companyName, conversationId, bookingId } = useLocalSearchParams<{ companyId?: string; companyName?: string; conversationId?: string; bookingId?: string }>();
  const { user } = useAuthStore();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState(conversationId || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // If we're coming from a mocked layout where APIs don't exist yet, seed demo data immediately.
    if (bookingId?.startsWith('mock')) {
      seedMockChat();
      return;
    }
    loadConversations();
  }, [bookingId]);

  useEffect(() => {
    if (activeConvId && !bookingId?.startsWith('mock')) loadMessages(activeConvId);
  }, [activeConvId]);

  const seedMockChat = () => {
    setMessages([
      { id: '1', content: 'Customer', senderId: 'sys-date', createdAt: new Date().toISOString() } as any,
      { id: '2', content: "Hello! I'm Sarah from Sparkle Pro. I've confirmed your booking for tomorrow morning. Do you have any specific areas you'd like us to focus on?", senderId: 'provider_123', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', content: "Hi Sarah! Yes, please focus on the kitchen tiles and the guest bathroom. We also have a small dog, just so you're aware.", senderId: user?.id || 'me', createdAt: new Date(Date.now() - 3400000).toISOString() },
      { id: '4', content: "Noted! We love pets, so that's no problem at all. We'll bring our eco-friendly supplies for the tiles. See you tomorrow at 9:00 AM!", senderId: 'provider_123', createdAt: new Date(Date.now() - 3300000).toISOString() },
      { id: '5', content: "System", senderId: 'sys-img-notice', createdAt: new Date(Date.now() - 3200000).toISOString() } as any,
      { id: '6', content: "These are the supplies we'll be using.", senderId: 'provider_123', createdAt: new Date(Date.now() - 3100000).toISOString(), isImage: true },
    ]);
    setActiveConvId('mock-conv');
    setLoading(false);
  };

  const loadConversations = async () => {
    try {
      const res = await apiClient.get('/api/conversations');
      const convs = res.data?.conversations || [];
      setConversations(convs);
      if (convs.length > 0 && !activeConvId) setActiveConvId(convs[0].id);
    } catch { } finally { setLoading(false); }
  };

  const loadMessages = async (id: string) => {
    try {
      const res = await apiClient.get(`/api/conversations/${id}/messages`);
      setMessages(res.data?.messages || []);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch { }
  };

  const startConversationWithCompany = async () => {
    if (!companyId) return;
    try {
      const res = await apiClient.post('/api/conversations', { companyId });
      const id = res.data?.conversation?.id;
      if (id) { setActiveConvId(id); loadConversations(); }
    } catch { }
  };

  useEffect(() => {
    if (companyId && conversations.length === 0 && !loading && !bookingId?.startsWith('mock')) {
      startConversationWithCompany();
    }
  }, [loading, companyId, conversations]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvId) return;
    const text = newMessage.trim();
    
    // Optimistic UI update or Fake sending for Demo
    if (bookingId?.startsWith('mock')) {
      const newMsg = { id: Date.now().toString(), content: text, senderId: user?.id || 'me', createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      return;
    }

    setSending(true);
    setNewMessage('');
    try {
      await apiClient.post(`/api/conversations/${activeConvId}/messages`, { content: text });
      await loadMessages(activeConvId);
    } catch { } finally { setSending(false); }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    // Handling UI mock system message overrides
    if (item.senderId === 'sys-date') {
      return (
        <View style={styles.sysMsgWrap}>
          <View style={styles.sysMsgPill}>
            <Text style={styles.sysMsgTxt}>Booking Confirmed - Oct 24, 09:00 AM</Text>
          </View>
        </View>
      );
    }
    if (item.senderId === 'sys-img-notice') {
      return (
        <View style={styles.sysMsgWrap}>
          <View style={styles.sysMsgPill}>
            <Text style={styles.sysMsgTxt}>Sarah added a photo to the job file</Text>
          </View>
        </View>
      );
    }

    const isMe = item.senderId === user?.id || item.senderId === 'me';

    if (item.isImage) {
      return (
         <View style={[styles.msgBlockWrap, isMe ? styles.msgBlockMe : styles.msgBlockOther]}>
           <View style={[styles.msgBubbleWrap, isMe ? styles.msgBubbleMe : styles.msgBubbleOther]}>
             <Image source={{ uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' }} style={styles.msgAttachedImg} />
             <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther, { paddingHorizontal: 4, paddingBottom: 4 }]}>{item.content}</Text>
           </View>
           <Text style={[styles.msgTimestamp, isMe ? styles.msgTimeMe : styles.msgTimeOther]}>
             {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
           </Text>
         </View>
      );
    }

    return (
      <View style={[styles.msgBlockWrap, isMe ? styles.msgBlockMe : styles.msgBlockOther]}>
        <View style={[styles.msgBubbleWrap, isMe ? styles.msgBubbleMe : styles.msgBubbleOther]}>
          <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{item.content}</Text>
        </View>
        <Text style={[styles.msgTimestamp, isMe ? styles.msgTimeMe : styles.msgTimeOther]}>
          {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.safe}>
      
      {/* Top App Bar Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtnWrapper} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerProfileRow}>
          <View style={styles.headerImgWrap}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=150' }} style={styles.headerAvatarImg} />
            <View style={styles.headerOnlineDot}></View>
          </View>
          <View style={styles.headerTitles}>
            <Text style={styles.headerMainTitle} numberOfLines={1}>{companyName || 'Sparkle Pro Cleaning'}</Text>
            <Text style={styles.headerOnlineTxt}>ONLINE</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerMoreBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Chat Canvas */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.canvasBlock}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.dark.border} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySub}>Send a message to start chatting</Text>
          </View>
        }
      />

      {/* Sticky Input Footer */}
      <View style={styles.inputFooterPanel}>
        <TouchableOpacity style={styles.attachCircleBtn}>
          <Ionicons name="add" size={26} color={Colors.dark.textSub} />
        </TouchableOpacity>
        
        <View style={styles.txtInputWrap}>
          <TextInput 
            style={styles.chatInputNode}
            placeholder="Type a message..."
            placeholderTextColor={Colors.dark.textMuted}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity style={styles.innerAttachIcon}>
            <Ionicons name="attach" size={20} color={Colors.dark.textSub} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sendCirclePrimary, (!newMessage.trim() || sending) && { opacity: 0.5 }]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          <Ionicons name="send" size={18} color="#FFF" style={{ marginLeft: 3 }} />
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark.bg },
  
  // Header Blocks
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, backgroundColor: Colors.dark.bg, zIndex: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
  backBtnWrapper: { padding: 4 },
  headerProfileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingHorizontal: 12 },
  headerImgWrap: { position: 'relative' },
  headerAvatarImg: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.surface },
  headerOnlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, backgroundColor: '#10b981', borderRadius: 6, borderWidth: 2, borderColor: Colors.dark.bg },
  headerTitles: { flex: 1 },
  headerMainTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, letterSpacing: -0.3 },
  headerOnlineTxt: { fontSize: 10, fontWeight: '800', color: '#10b981', letterSpacing: 1.5, marginTop: 2 },
  headerMoreBtn: { padding: 4 },

  // Canvas
  canvasBlock: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl, paddingBottom: 40, flexGrow: 1 },
  
  // Empty State
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.6 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.dark.text },
  emptySub: { fontSize: FontSize.sm, color: Colors.dark.textSub, marginTop: 4 },

  // Messages Styling
  sysMsgWrap: { alignItems: 'center', marginVertical: Spacing.md },
  sysMsgPill: { backgroundColor: Colors.dark.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.dark.border },
  sysMsgTxt: { fontSize: 11, fontWeight: '600', color: Colors.dark.textSub, letterSpacing: 0.5 },

  msgBlockWrap: { maxWidth: '85%', marginBottom: Spacing.md },
  msgBlockMe: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgBlockOther: { alignSelf: 'flex-start', alignItems: 'flex-start' },

  msgBubbleWrap: { padding: 16, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  msgBubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  msgBubbleOther: { backgroundColor: Colors.dark.cardAlt, borderBottomLeftRadius: 4 },

  msgText: { fontSize: 15, lineHeight: 22 },
  msgTextMe: { color: '#FFF' },
  msgTextOther: { color: Colors.dark.text },

  msgAttachedImg: { width: 220, height: 160, borderRadius: 12, marginBottom: 8, backgroundColor: Colors.dark.surface },

  msgTimestamp: { fontSize: 10, fontWeight: '600', color: Colors.dark.textMuted, marginTop: 6, letterSpacing: 0.5 },
  msgTimeMe: { marginRight: 4 },
  msgTimeOther: { marginLeft: 4 },

  // Footer Input Array
  inputFooterPanel: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.md, backgroundColor: 'rgba(255,255,255,0.05)', borderTopWidth: 1, borderTopColor: Colors.dark.border },
  
  attachCircleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center' },
  
  txtInputWrap: { flex: 1, position: 'relative' },
  chatInputNode: { backgroundColor: Colors.dark.surface, borderRadius: 20, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 40, color: Colors.dark.text, fontSize: FontSize.md, maxHeight: 120 },
  innerAttachIcon: { position: 'absolute', right: 12, bottom: 10 },
  
  sendCirclePrimary: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
});

import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';

export default function CompanyActiveChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [msgInput, setMsgInput] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── Top Header ───────────────────────────────────────────────────────── */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
            
            <View style={styles.headerUser}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300' }}
                  style={styles.avatarImg}
                />
                <View style={styles.onlineBadge} />
              </View>
              <View>
                <Text style={styles.headerName}>Marcus Thompson</Text>
                <Text style={styles.headerStatus}>ONLINE</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Main Chat Canvas ───────────────────────────────────────────────── */}
        <ScrollView contentContainerStyle={styles.chatCanvas} showsVerticalScrollIndicator={false}>
          
          {/* Date Divider */}
          <View style={styles.dateDivWrap}>
            <View style={styles.dateDivPill}>
              <Text style={styles.dateDivTxt}>Today, Oct 24</Text>
            </View>
          </View>

          {/* Incoming Msg */}
          <View style={styles.msgInWrap}>
            <View style={styles.msgInBubble}>
              <Text style={styles.msgInTxt}>Hi there! I was wondering if we could confirm the window cleaning for tomorrow morning? I have a meeting at 11 AM.</Text>
            </View>
            <Text style={styles.msgTimeIn}>09:12 AM</Text>
          </View>

          {/* Outgoing Msg */}
          <View style={styles.msgOutWrap}>
            <View style={styles.msgOutBubble}>
              <Text style={styles.msgOutTxt}>Good morning Marcus! Absolutely. I've just updated the schedule. Our team will be there at 8:30 AM sharp to ensure we're finished well before your meeting.</Text>
            </View>
            <View style={styles.msgTimeOutWrap}>
              <Text style={styles.msgTimeOut}>09:15 AM</Text>
              <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
            </View>
          </View>

          {/* System Msg */}
          <View style={styles.sysMsgWrap}>
            <View style={styles.sysMsgPill}>
              <Ionicons name="calendar" size={16} color="#3a485b" />
              <Text style={styles.sysMsgTxt}>Booking #BK-8829 confirmed</Text>
            </View>
          </View>

          {/* Incoming Msg with Image */}
          <View style={styles.msgInWrap}>
            <View style={[styles.msgInBubble, { padding: 8 }]}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' }} style={styles.msgImg} />
              <Text style={[styles.msgInTxt, { paddingHorizontal: 4, paddingBottom: 4 }]}>Perfect, thank you! Here's a photo of the side entrance where the team can park.</Text>
            </View>
            <Text style={styles.msgTimeIn}>09:22 AM</Text>
          </View>

          {/* Outgoing Msg */}
          <View style={styles.msgOutWrap}>
            <View style={styles.msgOutBubble}>
              <Text style={styles.msgOutTxt}>Received! I'll pass this photo along to the crew. Is there anything else you need help with today?</Text>
            </View>
            <View style={styles.msgTimeOutWrap}>
              <Text style={styles.msgTimeOut}>09:25 AM</Text>
              <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
            </View>
          </View>

        </ScrollView>

        {/* ── Input Section ──────────────────────────────────────────────────── */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={24} color="#57657a" />
          </TouchableOpacity>
          <TextInput 
            style={styles.textInput} 
            placeholder="Type your message..." 
            placeholderTextColor="#74777f"
            value={msgInput}
            onChangeText={setMsgInput}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Background Decorative Blur overlay using standard CSS shadows/colors for React Native lacking complex blur. */}
        <View style={styles.bgDeco1} pointerEvents="none" />
        <View style={styles.bgDeco2} pointerEvents="none" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(247,249,251,0.9)', zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.3)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { padding: 4 },
  
  headerUser: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatarWrap: { position: 'relative', width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(0,32,69,0.1)' },
  avatarImg: { width: '100%', height: '100%', backgroundColor: '#d5e3fc' },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981', borderWidth: 2, borderColor: '#FFF' },
  headerName: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  headerStatus: { fontSize: 10, fontWeight: '700', color: '#57657a', letterSpacing: 1 },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },

  chatCanvas: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xl, gap: Spacing.lg },

  // ── Date Divider ───────────────────────────────────────────────────────────
  dateDivWrap: { alignItems: 'center', marginVertical: Spacing.sm },
  dateDivPill: { backgroundColor: '#f2f4f6', paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.full },
  dateDivTxt: { fontSize: 10, fontWeight: '800', color: '#74777f', letterSpacing: 2, textTransform: 'uppercase' },

  // ── Incoming Msg ───────────────────────────────────────────────────────────
  msgInWrap: { alignItems: 'flex-start', maxWidth: '85%' },
  msgInBubble: { backgroundColor: '#FFF', padding: Spacing.md, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderBottomRightRadius: Radius.xl, borderBottomWidth: 1, borderBottomColor: '#f2f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  msgInTxt: { fontSize: FontSize.sm, color: '#191c1e', lineHeight: 22 },
  msgTimeIn: { fontSize: 10, fontWeight: '600', color: '#74777f', marginTop: 4, marginLeft: 4 },
  msgImg: { width: '100%', height: 180, borderRadius: Radius.md, marginBottom: 8, backgroundColor: '#f2f4f6' },

  // ── Outgoing Msg ───────────────────────────────────────────────────────────
  msgOutWrap: { alignItems: 'flex-end', maxWidth: '85%', alignSelf: 'flex-end' },
  msgOutBubble: { backgroundColor: '#1a365d', padding: Spacing.md, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderBottomLeftRadius: Radius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  msgOutTxt: { fontSize: FontSize.sm, color: '#FFF', lineHeight: 22 },
  msgTimeOutWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginRight: 4 },
  msgTimeOut: { fontSize: 10, fontWeight: '600', color: '#74777f' },

  // ── System Msg ─────────────────────────────────────────────────────────────
  sysMsgWrap: { alignItems: 'center', marginVertical: Spacing.sm },
  sysMsgPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(213,227,252,0.3)', borderWidth: 1, borderColor: '#d5e3fc', paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.full },
  sysMsgTxt: { fontSize: 12, fontWeight: '700', color: '#3a485b', fontStyle: 'italic', letterSpacing: -0.2 },

  // ── Input Section ──────────────────────────────────────────────────────────
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, backgroundColor: 'rgba(247,249,251,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)' },
  addBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f2f4f6', alignItems: 'center', justifyContent: 'center' },
  textInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, fontSize: FontSize.sm, color: '#191c1e', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, maxHeight: 120 },
  sendBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingLeft: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },

  // ── Decorative ─────────────────────────────────────────────────────────────
  bgDeco1: { position: 'absolute', top: -50, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(0,32,69,0.03)', zIndex: -1 },
  bgDeco2: { position: 'absolute', bottom: -50, left: -100, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(213,227,252,0.1)', zIndex: -1 },
});

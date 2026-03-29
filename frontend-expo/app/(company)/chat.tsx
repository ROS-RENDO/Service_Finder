import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView,
  TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { useSidebar } from './_layout';

const MOCK_CHATS = [
  {
    id: 'c1',
    name: 'Sarah Chen',
    time: '10:42 AM',
    msg: 'The quarterly reports are ready for your final review...',
    unread: 2,
    roleTitle: 'Staff',
    roleColor: '#d5e3fc',
    roleTextColor: '#57657a',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    online: true,
  },
  {
    id: 'c2',
    name: 'Marcus Wright',
    time: '09:15 AM',
    msg: "I'm having some trouble with the API integration.",
    unread: 0,
    roleTitle: 'Customer',
    roleColor: '#e0f2fe',
    roleTextColor: '#0284c7',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    online: false,
  },
  {
    id: 'c3',
    name: 'David Park',
    time: 'Yesterday',
    msg: 'Meeting rescheduled to Friday at 2 PM.',
    unread: 0,
    roleTitle: 'Staff',
    roleColor: '#d5e3fc',
    roleTextColor: '#57657a',
    avatar: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&q=80&w=300',
    online: false,
  },
  {
    id: 'c4',
    name: 'Elena Rodriguez',
    time: 'Yesterday',
    msg: 'Could we upgrade our plan to the enterprise tier?',
    unread: 1,
    roleTitle: 'Customer',
    roleColor: '#e0f2fe',
    roleTextColor: '#0284c7',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    online: false,
  },
];

export default function CompanyChatListScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [filter, setFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Top Header ───────────────────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <Ionicons name="menu" size={26} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarWrap}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&q=80&w=80' }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Chat</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── Search & Filters ───────────────────────────────────────────────── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#74777f" style={styles.searchIcon} />
            <TextInput style={styles.searchInput} placeholder="Search conversations..." placeholderTextColor="#74777f" />
          </View>
          
          <View style={styles.filtersBox}>
            {['All', 'Customers', 'Staff'].map(f => (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterBtnTxt, filter === f && styles.filterBtnTxtActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Chat List ──────────────────────────────────────────────────────── */}
        <View style={styles.chatListWrap}>
          {MOCK_CHATS.filter(c => filter === 'All' || c.roleTitle === filter.slice(0, -1) || c.roleTitle === filter).map(chat => (
            <TouchableOpacity 
              key={chat.id} 
              style={styles.chatItem}
              activeOpacity={0.7}
              onPress={() => router.push(`/(company)/chat/${chat.id}`)}
            >
              <View style={styles.chatAvatarWrap}>
                <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                {chat.online && <View style={styles.onlineBadge} />}
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatInfoTop}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={[styles.chatTime, chat.unread > 0 && { color: Colors.primary, fontWeight: '700' }]}>{chat.time}</Text>
                </View>
                
                <View style={styles.chatInfoMid}>
                  <Text style={[styles.chatMsg, chat.unread > 0 && { fontWeight: '700', color: '#191c1e' }]} numberOfLines={1}>
                    {chat.msg}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeTxt}>{chat.unread}</Text>
                    </View>
                  )}
                </View>

                <View style={[styles.rolePill, { backgroundColor: chat.roleColor }]}>
                  <Text style={[styles.rolePillTxt, { color: chat.roleTextColor }]}>{chat.roleTitle}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ── Bottom Navigation Bar ──────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {[
          { icon: 'chatbubbles', label: 'Chats', active: true },
          { icon: 'people', label: 'Staff', active: false },
          { icon: 'search', label: 'Customers', active: false },
          { icon: 'settings', label: 'Settings', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navItem}>
             <View style={[styles.navIconWrap, tab.active && styles.navIconWrapActive]}>
              <Ionicons name={tab.icon as any} size={22} color={tab.active ? '#FFF' : '#57657a'} />
            </View>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },

  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(247,249,251,0.9)', zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconBtn: { padding: 4 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a365d', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  scrollContent: { paddingBottom: 110, paddingTop: Spacing.lg },

  // ── Search & Filter ────────────────────────────────────────────────────────
  searchWrap: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg, gap: Spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f4f6', borderRadius: Radius.full, paddingHorizontal: 16, height: 48 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: FontSize.md, color: '#191c1e' },
  
  filtersBox: { flexDirection: 'row', backgroundColor: '#f2f4f6', borderRadius: Radius.full, padding: 4 },
  filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.full },
  filterBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  filterBtnTxt: { fontSize: FontSize.sm, fontWeight: '600', color: '#57657a' },
  filterBtnTxtActive: { color: Colors.primary },

  // ── Chat List ──────────────────────────────────────────────────────────────
  chatListWrap: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  chatItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, padding: Spacing.md, backgroundColor: '#FFF', borderRadius: Radius.xl, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  chatAvatarWrap: { position: 'relative', width: 56, height: 56 },
  chatAvatar: { width: '100%', height: '100%', borderRadius: 28, backgroundColor: '#eceef0', borderWidth: 2, borderColor: 'rgba(0,32,69,0.05)' },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10b981', borderWidth: 2, borderColor: '#FFF' },

  chatInfo: { flex: 1 },
  chatInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  chatName: { fontSize: FontSize.md, fontWeight: '800', color: '#191c1e' },
  chatTime: { fontSize: 11, fontWeight: '600', color: '#74777f' },
  
  chatInfoMid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 },
  chatMsg: { flex: 1, fontSize: FontSize.sm, color: '#43474e', lineHeight: 20 },
  unreadBadge: { backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  unreadBadgeTxt: { fontSize: 10, fontWeight: '800', color: '#FFF' },

  rolePill: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  rolePillTxt: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Bottom Nav ─────────────────────────────────────────────────────────────
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.95)', paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.3)', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 50, shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.04, shadowRadius: 16 },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconWrap: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 24 },
  navIconWrapActive: { backgroundColor: Colors.primary },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#57657a', letterSpacing: 0.5, textTransform: 'uppercase' },
  navLabelActive: { color: Colors.primary, display: 'none' }, // Similar to snippet logic
});

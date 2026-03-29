import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, TextInput, Image, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Colors, Spacing, Radius, FontSize } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useSidebar } from './_layout';

const theme = {
  surface: Colors.dark.bg,
  onSurface: Colors.dark.text,
  onSurfaceVariant: Colors.dark.textSub,
  primary: Colors.primary,
  primaryFixedDim: Colors.primaryLight,
  onPrimary: '#ffffff',
  secondary: Colors.dark.textMuted,
  secondaryContainer: Colors.dark.surface,
  onSecondaryContainer: Colors.primaryLight,
  onSecondaryFixedVariant: Colors.dark.textMuted,
  tertiaryContainer: 'rgba(108, 99, 255, 0.15)',
  onTertiaryContainer: Colors.primaryLight,
  surfaceContainerLowest: Colors.dark.cardAlt,
  surfaceContainerLow: Colors.dark.surface,
  surfaceContainerHigh: Colors.dark.border,
  surfaceContainerHighest: Colors.dark.border,
  outlineVariant: Colors.dark.border,
};

const MOCK_USERS = [
  {
    id: '#USR-88219',
    name: 'Marcus Thompson',
    email: 'm.thompson@corporate.com',
    role: 'Company Admin',
    roleColor: theme.onTertiaryContainer,
    status: 'ACTIVE',
    date: 'Oct 12, 2023',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwJ6if2NB2FmHyxlYctEUxX6TK6-CkpfMbYuShqZDjTps277LGCpPR4A0Z6N8bxl4zVkUK2Dz0WfE_jv1KxXbPYb6WjrI2RuDl3G6UIxVb7H8OK1UtUXTADkALfoJ5AwrcbEffPynIuXXO50yHmPLTcDzzQC0jrx9aE0KE6s-eIB8o4Lf4e8ZbW9NxHArRW8lJ5KtrUD3j3zAkNMBFblouGCYFwOyM6IhIiPxBERjkIeeJP6931dpv2MWxvtBIzXuJiVGoIh2DozE'
  },
  {
    id: '#USR-99012',
    name: 'Sarah Jenkins',
    email: 'sarah.j@servicefinder.io',
    role: 'Staff',
    roleColor: theme.secondary,
    status: 'SUSPENDED',
    date: 'Jan 05, 2024',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2P1Dkc69rOeLeR-Ydc9q2dlf10ncdFwqszE1t6KYnLIHoUSsum62o6PeXKDErsd1Qhzi8OvrNyUuB2VgRh7H0G21AFqkp49dt3-EN0nXM7NKXZCLhXN28YVnjwoz50U5415sNOpbY1ZnSEwvlQ5EY8XPXC5nnfuzxR15Q-OGGc3jAzXRAb-baOv3ximsT7aXwQhmi5KSiz61Tcsqt-3D-VHqZe43Mw9ox-Uw_SZojnot-cd1i0nzHtBSCoarC3P8l8rkzlDL-wAg'
  },
  {
    id: '#USR-77241',
    name: "Liam O'Connell",
    email: 'liam.oconnell@gmail.com',
    role: 'Customer',
    roleColor: theme.primaryFixedDim,
    status: 'ACTIVE',
    date: 'Mar 21, 2024',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf31-XgLZCOOOZ9O-zTKrM-5jYcoUamAaEQgovk3VjfcqvlmSIHZvlcbG_SjwG3sBgMZPPHYgmUpBgfIpoSCyg0989DEqmMHkzzS4Js0VOwyc7F48QGzlwY27ZdZXZ2WcB2OCyBNXpmysXCZwEDnLQdrYWgaWeygWaqxuUJqykZH1Y8TrZz4rojoa-VbSJuaHxjqNsZdaghIi1Wvx43swTHPiVWIydSR3IvO29GiE8Ay0HmSa_vdjWsoTX-bWU3t3JaLp8dig5Q5s'
  },
  {
    id: '#USR-88104',
    name: 'Amara Vance',
    email: 'amara.v@primeconnect.net',
    role: 'Company Admin',
    roleColor: theme.onTertiaryContainer,
    status: 'ACTIVE',
    date: 'Feb 18, 2024',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf4Aczlju_ng5W3CHlgjsPkOblsWX8dO-XgrAtQkQIeH86jWpQbe3bzKMHil6Uqi503B72SkHHaf2BlDTTxVEsV96v6YbDfIFCnYEWXBgJAHJoexBIVlzL-sk1U1T72_mLVx9_GC85gbDpBTiy2ac0KGghFjRpLLLVp-x9razL5db3dReZ-jjAnKMpvGDjMtewVFjxGVmNreb4Km5t4eFLz74FkNvQ5sjNPhEIwmHjNvZ4wBZE8TDNjCjuCh_RqadQaxf8urF_BF0'
  }
];

export default function AdminUsersScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [filter, setFilter] = useState('All Users');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = MOCK_USERS.filter(u => filter === 'All Users' || u.role === filter);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <BlurView intensity={70} tint="dark" style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Management</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="search" size={24} color={theme.primary} />
        </TouchableOpacity>
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={20} color={theme.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search users by name or ID..." 
            placeholderTextColor={theme.onSurfaceVariant} 
          />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.chipsWrap}
        >
          {['All Users', 'Customer', 'Staff', 'Company Admin'].map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.chip, filter === f ? styles.chipActive : styles.chipInactive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipTxt, filter === f ? styles.chipTxtActive : styles.chipTxtInactive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* User List */}
        <View style={styles.listWrap}>
          {filteredUsers.map((user, i) => (
            <TouchableOpacity key={i} style={styles.userCard} activeOpacity={0.8} onPress={() => setSelectedUser(user)}>
              <View style={styles.cardHeader}>
                <View style={styles.cardUser}>
                  <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userId}>ID: {user.id}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreBtn}>
                  <MaterialIcons name="more-vert" size={20} color={theme.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              <View style={styles.cardGrid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>ROLE</Text>
                  <View style={styles.roleWrap}>
                    <View style={[styles.roleDot, { backgroundColor: user.roleColor }]} />
                    <Text style={styles.roleTxt}>{user.role}</Text>
                  </View>
                </View>

                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>STATUS</Text>
                  <View style={[styles.statusBadge, { backgroundColor: user.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7' }]}>
                    <Text style={[styles.statusBadgeTxt, { color: user.status === 'ACTIVE' ? '#065f46' : '#92400e' }]}>{user.status}</Text>
                  </View>
                </View>

                <View style={[styles.gridItem, { width: '100%' }]}>
                  <Text style={styles.gridLabel}>EMAIL</Text>
                  <Text style={styles.emailTxt}>{user.email}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.dateTxt}>Joined: {user.date}</Text>
                <View style={styles.viewBtn}>
                  <Text style={styles.viewBtnTxt}>View Details</Text>
                  <MaterialIcons name="arrow-forward" size={14} color={theme.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BlurView intensity={80} tint="dark" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard' as any)}>
          <MaterialIcons name="dashboard" size={24} color={theme.onSurfaceVariant} />
          <Text style={[styles.navLabel]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
             <MaterialIcons name="group" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/companies' as any)}>
          <MaterialIcons name="business" size={24} color={theme.onSurfaceVariant} />
          <Text style={styles.navLabel}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/verification' as any)}>
           <MaterialIcons name="verified-user" size={24} color={theme.onSurfaceVariant} />
           <Text style={styles.navLabel}>Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/settings' as any)}>
           <MaterialIcons name="settings" size={24} color={theme.onSurfaceVariant} />
           <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </BlurView>

      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="person-add" size={24} color={theme.onPrimary} />
      </TouchableOpacity>

      {/* ── User Detail Modal ────────────────────────────────────────────── */}
      <Modal visible={!!selectedUser} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalContent}>
            
            <View style={styles.modalDragHandle} />
            
            <View style={styles.modalHeader}>
              <View style={styles.modalUserRow}>
                <Image source={{ uri: selectedUser?.avatar }} style={styles.modalAvatar} />
                <View>
                  <Text style={styles.modalName}>{selectedUser?.name}</Text>
                  <Text style={styles.modalRole}>{selectedUser?.role}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedUser(null)}>
                <MaterialIcons name="close" size={24} color={theme.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>User Activity</Text>
                <View style={{ gap: 12 }}>
                  <Text style={{ color: theme.onSurface }}>Last login: Today, 10:43 AM</Text>
                  <Text style={{ color: theme.onSurface }}>Total Bookings: 14</Text>
                  <Text style={{ color: theme.onSurface }}>Reviews Left: 3</Text>
                </View>
              </View>

              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Status Management</Text>
                <TouchableOpacity 
                   style={[styles.statusToggleBtn, selectedUser?.status === 'ACTIVE' ? styles.statusToggleBtnActive : styles.statusToggleBtnSuspended]}
                   onPress={() => setSelectedUser((prev: any) => ({ ...prev, status: prev.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'}))}
                >
                   <MaterialIcons name={selectedUser?.status === 'ACTIVE' ? 'block' : 'check-circle'} size={20} color="#FFF" />
                   <Text style={styles.statusToggleTxt}>
                     {selectedUser?.status === 'ACTIVE' ? 'Suspend User Account' : 'Reactivate User Account'}
                   </Text>
                </TouchableOpacity>
              </View>
              
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, height: Platform.OS === 'ios' ? 100 : 70,
    paddingTop: Platform.OS === 'ios' ? 40 : 16, backgroundColor: 'rgba(15, 15, 27, 0.7)', zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: theme.outlineVariant,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 8, borderRadius: 24, backgroundColor: 'transparent' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },

  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 },

  searchBox: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: theme.surfaceContainerLow, 
    borderRadius: 12, paddingHorizontal: 16, height: 48, marginBottom: 16 
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 14, color: theme.onSurface, fontWeight: '500' },

  chipsWrap: { gap: 8, marginBottom: 24 },
  chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 24, alignSelf: 'flex-start' },
  chipActive: { backgroundColor: theme.primary },
  chipInactive: { backgroundColor: theme.secondaryContainer },
  chipTxt: { fontSize: 12, fontWeight: '600' },
  chipTxtActive: { color: theme.onPrimary },
  chipTxtInactive: { color: theme.onSecondaryFixedVariant },

  listWrap: { gap: 16 },
  userCard: { 
    backgroundColor: theme.surfaceContainerLowest, 
    borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.outlineVariant,
    shadowColor: '#000', shadowOffset: { width:0, height:2 }, 
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 
  },
  
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardUser: { flexDirection: 'row', gap: 12 },
  avatarImg: { width: 48, height: 48, borderRadius: 8, backgroundColor: theme.surfaceContainerHighest },
  userName: { fontSize: 16, fontWeight: '700', color: theme.onSurface, marginBottom: 2 },
  userId: { fontSize: 12, fontWeight: '500', color: theme.onSurfaceVariant },
  moreBtn: { padding: 6, backgroundColor: 'transparent' },

  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  gridItem: { width: '47%', marginBottom: 4 },
  gridLabel: { fontSize: 10, fontWeight: '700', color: theme.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  roleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  roleDot: { width: 8, height: 8, borderRadius: 4 },
  roleTxt: { fontSize: 14, fontWeight: '600', color: theme.primary },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusBadgeTxt: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  emailTxt: { fontSize: 14, color: theme.onSurface },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.2)' },
  dateTxt: { fontSize: 11, fontWeight: '500', color: theme.onSurfaceVariant },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewBtnTxt: { fontSize: 12, fontWeight: '700', color: theme.primary },

  bottomNav: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(15, 15, 27, 0.85)', borderTopWidth: 1, borderTopColor: theme.outlineVariant,
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopLeftRadius: 12, borderTopRightRadius: 12,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconActive: { backgroundColor: theme.secondaryContainer, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: theme.outlineVariant },
  navLabel: { fontSize: 10, fontWeight: '500', color: theme.onSurfaceVariant, marginTop: 2 },

  fab: { 
    position: 'absolute', right: 24, bottom: 100, 
    width: 56, height: 56, borderRadius: 28, 
    backgroundColor: theme.primary, 
    alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.primary, shadowOffset: { width:0, height:4 }, 
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6, zIndex: 40 
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 15, 27, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.surfaceContainerLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, minHeight: '65%', paddingHorizontal: 20, borderWidth: 1, borderColor: theme.outlineVariant },
  modalDragHandle: { width: 40, height: 5, backgroundColor: theme.outlineVariant, borderRadius: 3, alignSelf: 'center', marginVertical: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalUserRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  modalAvatar: { width: 56, height: 56, borderRadius: 12, backgroundColor: theme.surfaceContainerHighest },
  modalName: { fontSize: 20, fontWeight: '800', color: theme.primary },
  modalRole: { fontSize: 13, color: theme.onSurfaceVariant, marginTop: 2 },
  closeBtn: { padding: 4, backgroundColor: theme.surface, borderRadius: 20 },
  modalScroll: { paddingBottom: 40 },
  sectionBlock: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.primary, marginBottom: 12 },
  statusToggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 12 },
  statusToggleBtnActive: { backgroundColor: '#b91c1c' },
  statusToggleBtnSuspended: { backgroundColor: '#059669' },
  statusToggleTxt: { color: '#FFF', fontWeight: '800', fontSize: 14 }
});

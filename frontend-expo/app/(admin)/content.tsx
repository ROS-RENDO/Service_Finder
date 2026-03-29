import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet,  ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSidebar } from './_layout';

const theme = {
  surface: '#f7f9fb',
  onSurface: '#191c1e',
  onSurfaceVariant: '#43474e',
  primary: '#002045',
  onPrimary: '#ffffff',
  primaryContainer: '#1a365d',
  onPrimaryContainer: '#86a0cd',
  secondaryContainer: '#d5e3fc',
  onSecondaryContainer: '#57657a',
  onSecondaryFixedVariant: '#3a485b',
  tertiaryContainer: '#003a55',
  onTertiaryContainer: '#1ba9ed',
  tertiaryFixed: '#c9e6ff',
  tertiaryFixedDim: '#89ceff',
  onTertiaryFixedVariant: '#004c6e',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  error: '#ba1a1a',
  onError: '#ffffff',
  outline: '#74777f',
  outlineVariant: '#c4c6cf',
  surfaceVariant: '#e0e3e5',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  surfaceContainerHighest: '#e0e3e5',
};

const CATEGORIES = [
  { id: '1', title: 'Cleaning', subs: 12, provs: 45, icon: 'cleaning-services' },
  { id: '2', title: 'Maintenance', subs: 8, provs: 32, icon: 'handyman' },
  { id: '3', title: 'Beauty', subs: 15, provs: 68, icon: 'face' },
  { id: '4', title: 'Pet Services', subs: 5, provs: 19, icon: 'pets' },
];

export default function AdminContentScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState('Categories');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconBtn} onPress={toggleSidebar}>
            <MaterialIcons name="menu" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Content Management</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="search" size={24} color={theme.outline} />
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzvYcVVPnVqyCh1orUqLlT5UgsqmRVJxFgMHB3nG9oZIXpak1829nrQePC4UNmnv8W2HKPi4AJv3EQPlbbp2QcXT-pzyhk7dOIS6GZpOlgCo6nSqTe8-eig2oL4F14tNnJvvSqpFlvM70r9ahaUj7H0nIaSl4JMRQ1GBtHNKfbUw10gaij_MIPBpvxbdIdGL-QRFuNXuyRa-4iIYtk3N02wiOX220VEtt4DbeMKukVZPUM36nwrdTuUw0zKqHXANsyn1KYidgIO8s' }} 
              style={styles.avatarImg} 
            />
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {['Categories', 'Service Types', 'FAQs'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
                <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : styles.tabLabelInactive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Category Builder */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category Builder</Text>
          <Text style={styles.sectionSub}>SORTABLE LIST</Text>
        </View>

        <View style={styles.catList}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catCard} activeOpacity={0.8}>
              <MaterialIcons name="drag-indicator" size={24} color={'rgba(67, 71, 78, 0.3)'} />
              <View style={styles.catIconBox}>
                <MaterialIcons name={cat.icon as any} size={24} color={theme.onSecondaryContainer} />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catTitle}>{cat.title}</Text>
                <Text style={styles.catDesc}>{cat.subs} Subcategories • {cat.provs} Providers</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={'rgba(67, 71, 78, 0.4)'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Article Editor Placeholder */}
        <View style={styles.editorWrap}>
          <Text style={styles.editorTitle}>Article Editor</Text>
          <View style={styles.editorBox}>
            <View style={styles.editorToolbar}>
              <MaterialIcons name="format-bold" size={20} color={theme.onSurfaceVariant} style={styles.toolIcon} />
              <MaterialIcons name="format-italic" size={20} color={theme.onSurfaceVariant} style={styles.toolIcon} />
              <MaterialIcons name="format-list-bulleted" size={20} color={theme.onSurfaceVariant} style={styles.toolIcon} />
              <View style={styles.toolDiv} />
              <MaterialIcons name="link" size={20} color={theme.onSurfaceVariant} style={styles.toolIcon} />
              <MaterialIcons name="image" size={20} color={theme.onSurfaceVariant} style={styles.toolIcon} />
            </View>
            <View style={styles.editorContent}>
              <Text style={styles.editorText}>How to set up your service profile...</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={28} color={theme.onPrimary} />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/dashboard' as any)}>
          <MaterialIcons name="dashboard" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/companies' as any)}>
          <MaterialIcons name="business" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Companies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
             <MaterialIcons name="article" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.navLabel, { color: theme.primary, fontWeight: '700' }]}>Content</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/verification' as any)}>
          <MaterialIcons name="fact-check" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(admin)/settings' as any)}>
          <MaterialIcons name="settings" size={24} color={theme.onSecondaryContainer} />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.surface },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16, backgroundColor: 'rgba(247,249,251,0.9)', zIndex: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.1)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: theme.primary, letterSpacing: -0.5 },
  
  avatarWrap: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: theme.outlineVariant },
  avatarImg: { width: '100%', height: '100%' },

  tabContainer: { backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: theme.surfaceContainerHigh },
  tabScroll: { paddingHorizontal: 24, gap: 24, paddingTop: 16 },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 13, fontWeight: '600', paddingBottom: 12, letterSpacing: 0.5 },
  tabLabelActive: { color: theme.primary, fontWeight: '700' },
  tabLabelInactive: { color: 'rgba(67, 71, 78, 0.6)' },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: theme.primary, borderTopLeftRadius: 3, borderTopRightRadius: 3 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5 },
  sectionSub: { fontSize: 10, fontWeight: '700', color: theme.outline, letterSpacing: 1 },

  catList: { gap: 12 },
  catCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceContainerLowest, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2 },
  catIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.secondaryContainer, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginRight: 16 },
  catInfo: { flex: 1 },
  catTitle: { fontSize: 15, fontWeight: '700', color: theme.primary, marginBottom: 2 },
  catDesc: { fontSize: 12, color: theme.onSurfaceVariant },

  editorWrap: { marginTop: 40, opacity: 0.4 },
  editorTitle: { fontSize: 20, fontWeight: '800', color: theme.primary, letterSpacing: -0.5, marginBottom: 16 },
  editorBox: { backgroundColor: theme.surfaceContainerLowest, borderRadius: 16, overflow: 'hidden' },
  editorToolbar: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.surfaceContainerLow, padding: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,207,0.2)', gap: 8 },
  toolIcon: { padding: 4 },
  toolDiv: { width: 1, height: 20, backgroundColor: theme.outlineVariant, marginHorizontal: 4 },
  editorContent: { padding: 16, minHeight: 120 },
  editorText: { fontSize: 14, color: theme.onSurfaceVariant, lineHeight: 22 },

  fab: { position: 'absolute', bottom: Platform.OS === 'ios' ? 100 : 90, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, zIndex: 40 },

  bottomNav: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(196,198,207,0.1)',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#191c1e', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.08, shadowRadius: 32, elevation: 16
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navIconActive: { backgroundColor: theme.secondaryContainer, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 20 },
  navLabel: { fontSize: 10, fontWeight: '600', color: theme.onSecondaryContainer, letterSpacing: 0.5, marginTop: 2 },
});

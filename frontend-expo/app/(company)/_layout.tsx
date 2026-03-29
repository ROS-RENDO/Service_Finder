import { SafeAreaView } from 'react-native-safe-area-context';
import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Platform,  TouchableWithoutFeedback, Modal } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth';

const NAV_ITEMS = [
  { icon: 'grid', label: 'Dashboard', route: '/(company)/dashboard' },
  { icon: 'calendar', label: 'Bookings', route: '/(company)/bookings' },
  { icon: 'construct', label: 'Services', route: '/(company)/services' },
  { icon: 'people', label: 'Staff', route: '/(company)/staff' },
  { icon: 'wallet', label: 'Finance', route: '/(company)/revenue' },
  { icon: 'chatbubbles', label: 'Messages', route: '/(company)/chat' },
  { icon: 'settings', label: 'Settings', route: '/(company)/settings' },
];

export const SidebarContext = createContext({ toggleSidebar: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function CompanyLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isLargeScreen = width >= 768 || Platform.OS === 'web';
  
  const renderSidebarContent = () => (
    <SafeAreaView style={styles.sidebarSafe}>
      <View style={styles.brandBox}>
        <View style={styles.logoWrap}>
          <Ionicons name="business" size={24} color={Colors.primary} />
        </View>
        <Text style={styles.brandTxt}>Service Finder</Text>
      </View>

      <View style={styles.navBlock}>
        {NAV_ITEMS.map((item) => {
          // Basic active route detection
          const isActive = pathname.startsWith(item.route) || (item.route === '/(company)/dashboard' && pathname === '/(company)');

          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => {
                router.push(item.route as any);
                if (!isLargeScreen) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={isActive ? Colors.primary : Colors.dark.textSub}
                style={styles.navIcon}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Optional Footer/Logout section */}
      <View style={styles.sidebarFooter}>
        <TouchableOpacity style={styles.logoutBtn} onPress={async () => {
          await logout();
          router.replace('/(auth)/login');
        }}>
          <Ionicons name="log-out-outline" size={20} color={Colors.dark.textSub} />
          <Text style={styles.logoutTxt}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (!isLargeScreen) {
    return (
      <SidebarContext.Provider value={{ toggleSidebar }}>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            <Slot />
          </View>
          
          <Modal transparent visible={isSidebarOpen} animationType="fade" onRequestClose={toggleSidebar}>
            <View style={styles.overlayBg}>
              <TouchableWithoutFeedback onPress={toggleSidebar}>
                <View style={StyleSheet.absoluteFill} />
              </TouchableWithoutFeedback>
              <View style={[styles.sidebar, styles.sidebarMobile]}>
                {renderSidebarContent()}
              </View>
            </View>
          </Modal>
        </View>
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider value={{ toggleSidebar }}>
      <View style={styles.container}>
        <View style={styles.sidebar}>
          {renderSidebarContent()}
        </View>
        <View style={styles.mainContent}>
          <Slot />
        </View>
      </View>
    </SidebarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.dark.bg,
  },
  sidebar: {
    width: 280,
    backgroundColor: Colors.dark.cardAlt,
    borderRightWidth: 1,
    borderRightColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 100,
  },
  sidebarMobile: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  overlayBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarSafe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginBottom: 16,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTxt: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  navBlock: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
  },
  navIcon: {
    marginRight: 16,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.textSub,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.primary,
  },
  sidebarFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutTxt: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark.textSub,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
    position: 'relative',
    overflow: 'hidden',
  },
});

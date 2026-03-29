import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Radius } from '@/constants/Colors';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface TabItem {
  name: string;
  label: string;
  icon: IoniconName;
  iconFocused: IoniconName;
}

const VISIBLE_TABS: TabItem[] = [
  { name: 'dashboard',  label: 'Dashboard', icon: 'speedometer-outline',  iconFocused: 'speedometer' },
  { name: 'schedule',   label: 'Schedule',  icon: 'calendar-outline',      iconFocused: 'calendar' },
  { name: 'requests',   label: 'Requests',  icon: 'list-outline',          iconFocused: 'list' },
  { name: 'chat',       label: 'Messages',  icon: 'chatbubble-outline',    iconFocused: 'chatbubble' },
  { name: 'profile',    label: 'Profile',   icon: 'person-outline',        iconFocused: 'person' },
];

// All screens that should NOT appear in the tab bar
const HIDDEN_SCREENS = ['earnings', 'time-off', 'ai-measure', 'job/detail', 'job/execute'];

export default function StaffLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: Platform.OS === 'ios' ? 88 : 68,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView 
            intensity={40} 
            tint="dark" 
            style={{ 
              flex: 1, 
              borderTopLeftRadius: 20, 
              borderTopRightRadius: 20,
              backgroundColor: 'rgba(15,15,27,0.7)',
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.05)'
            }} 
          />
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.dark.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginTop: 2,
        },
        tabBarItemStyle: { paddingTop: 4 },
      }}
    >
      {/* Visible Tab Screens */}
      {VISIBLE_TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Ionicons
                  name={focused ? tab.iconFocused : tab.icon}
                  size={22}
                  color={focused ? Colors.primary : Colors.dark.textMuted}
                />
              </View>
            ),
          }}
        />
      ))}

      {/* Hidden screens — removed from tab bar but still routable */}
      {HIDDEN_SCREENS.map((name) => (
        <Tabs.Screen key={name} name={name} options={{ href: null }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
  },
});

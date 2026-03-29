import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';

export default function CustomerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: Platform.OS === 'ios' ? 90 : 68,
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
          letterSpacing: 0.3,
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Bookings',
          href: '/(customer)/booking/list',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="calendar-today" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="chat-bubble-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person-outline" size={size} color={color} />,
        }}
      />

      {/* Hidden from tabs — navigated to programmatically */}
      <Tabs.Screen name="company" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="payment" options={{ href: null }} />
      <Tabs.Screen name="review" options={{ href: null }} />
    </Tabs>
  );
}

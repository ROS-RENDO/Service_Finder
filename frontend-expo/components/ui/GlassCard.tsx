import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius, Spacing } from '../../constants/Colors';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20, ...props }) => {
  return (
    <View style={[styles.container, style]} {...props}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: 'rgba(31, 31, 53, 0.4)',
  },
  blur: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
});

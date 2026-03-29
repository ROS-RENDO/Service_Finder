import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, FontSize } from '../../constants/Colors';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, loading, style, disabled, ...props }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[styles.buttonContainer, style, disabled && styles.disabled]}
      {...props}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.md,
  },
});

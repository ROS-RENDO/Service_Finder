import React from 'react';
import { StyleSheet, ViewProps, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, ...props }) => {
  return (
    <SafeAreaView style={[styles.container, style]} {...props}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
  },
});

// 🧩 src/components/common/Card.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSettingsStore } from '../../store/useSettingsStore';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
  elevation?: number;
}

export default function Card({ 
  children, 
  style, 
  padding = 16,
  elevation = 2 
}: CardProps) {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const cardStyle: ViewStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: 12,
    padding,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: isDarkMode ? 0.3 : 0.1,
    shadowRadius: elevation * 2,
    elevation: elevation * 2, // Android shadow
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: isDarkMode ? '#374151' : 'transparent',
  };

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}

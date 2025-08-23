// 🧩 src/components/common/Header.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSettingsStore } from '../../store/useSettingsStore';

interface HeaderProps {
  title?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
  showBorder?: boolean;
}

export default function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  showBorder = true,
}: HeaderProps) {
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    borderBottomWidth: showBorder ? 1 : 0,
    borderBottomColor: isDarkMode ? '#374151' : '#e5e7eb',
  };

  const titleStyle: TextStyle = {
    fontSize: 20,
    fontWeight: '600',
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    flex: 1,
    textAlign: 'center',
  };

  const iconColor = isDarkMode ? '#f8fafc' : '#374151';

  return (
    <View style={[headerStyle, style]}>
      <View style={{ width: 40, alignItems: 'flex-start' }}>
        {leftIcon && onLeftPress && (
          <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
            <Feather name={leftIcon} size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      
      {title && <Text style={titleStyle}>{title}</Text>}
      
      <View style={{ width: 40, alignItems: 'flex-end' }}>
        {rightIcon && onRightPress && (
          <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
            <Feather name={rightIcon} size={24} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
});

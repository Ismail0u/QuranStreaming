// 🧩 src/components/common/SearchBar.tsx
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ViewStyle 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSettingsStore } from '../../store/useSettingsStore';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  onClear,
  style,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const isDarkMode = useSettingsStore((state) => state.isDarkMode);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
  };

  const inputStyle = {
    flex: 1,
    fontSize: 16,
    color: isDarkMode ? '#f8fafc' : '#374151',
    paddingVertical: 4,
  };

  const iconColor = isDarkMode ? '#9ca3af' : '#6b7280';

  return (
    <View style={[containerStyle, style]}>
      <Feather name="search" size={20} color={iconColor} />
      <TextInput
        style={inputStyle}
        placeholder={placeholder}
        placeholderTextColor={iconColor}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoFocus={autoFocus}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Feather name="x" size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    padding: 4,
  },
});
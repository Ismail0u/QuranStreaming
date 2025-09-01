// 🎨 src/styles/colors.ts - Professional Color System
export const Colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Success Colors (for Quran/Islamic theme)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Purple Colors (for premium features)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Islamic Green
  islamic: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },

  // Dark Mode Specific
  dark: {
    bg: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    border: '#374151',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textDisabled: '#64748b',
  },

  // Light Mode Specific
  light: {
    bg: '#ffffff',
    surface: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textDisabled: '#94a3b8',
  },

  // Gradients
  gradients: {
    primary: ['#0ea5e9', '#3b82f6'],
    secondary: ['#8b5cf6', '#7c3aed'],
    success: ['#10b981', '#059669'],
    warning: ['#f59e0b', '#d97706'],
    error: ['#ef4444', '#dc2626'],
    islamic: ['#10b981', '#047857'],
    sunset: ['#f59e0b', '#ef4444'],
    ocean: ['#0ea5e9', '#10b981'],
    night: ['#1e293b', '#0f172a'],
    dawn: ['#fbbf24', '#f59e0b'],
  },

  // Semantic Colors
  semantic: {
    background: '#f8fafc',
    backgroundDark: '#0f172a',
    surface: '#ffffff',
    surfaceDark: '#1e293b',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayDark: 'rgba(15, 23, 42, 0.8)',
    divider: '#e2e8f0',
    dividerDark: '#374151',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.3)',
  },

  // Audio Player Specific
  audio: {
    waveform: '#0ea5e9',
    progress: '#10b981',
    volume: '#f59e0b',
    playing: '#10b981',
    paused: '#64748b',
    buffering: '#8b5cf6',
    error: '#ef4444',
  },

  // Quran Specific
  quran: {
    arabic: '#2d3748',
    arabicDark: '#e2e8f0',
    translation: '#4a5568',
    translationDark: '#a0aec0',
    verse: '#0ea5e9',
    surah: '#10b981',
    juz: '#8b5cf6',
    page: '#f59e0b',
    bookmark: '#ef4444',
  },
};

// Theme Configuration
export const createTheme = (isDark: boolean) => ({
  colors: {
    background: isDark ? Colors.dark.bg : Colors.light.bg,
    surface: isDark ? Colors.dark.surface : Colors.light.surface,
    surfaceHover: isDark ? Colors.dark.surfaceHover : Colors.light.surfaceHover,
    border: isDark ? Colors.dark.border : Colors.light.border,
    
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
    textMuted: isDark ? Colors.dark.textMuted : Colors.light.textMuted,
    textDisabled: isDark ? Colors.dark.textDisabled : Colors.light.textDisabled,
    
    primary: Colors.primary[500],
    primaryHover: Colors.primary[600],
    primaryLight: Colors.primary[100],
    
    success: Colors.success[500],
    warning: Colors.warning[500],
    error: Colors.error[500],
    
    islamic: Colors.islamic[500],
    
    overlay: isDark ? Colors.semantic.overlayDark : Colors.semantic.overlay,
    shadow: isDark ? Colors.semantic.shadowDark : Colors.semantic.shadow,
  },
  
  gradients: Colors.gradients,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 32,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  elevation: {
    sm: {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lg: {
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    xl: {
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
});

// Typography System
export const Typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  
  // Arabic Text
  arabic: {
    large: {
      fontSize: 22,
      fontWeight: '400' as const,
      lineHeight: 40,
      textAlign: 'right' as const,
    },
    medium: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 32,
      textAlign: 'right' as const,
    },
    small: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 28,
      textAlign: 'right' as const,
    },
  },
  
  // Labels and Captions
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};

// Animation Presets
export const Animations = {
  // Timing
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Easing
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
  
  // Common animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { transform: [{ translateY: 20 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
  },
  scaleIn: {
    from: { transform: [{ scale: 0.95 }], opacity: 0 },
    to: { transform: [{ scale: 1 }], opacity: 1 },
  },
  bounce: {
    from: { transform: [{ scale: 1 }] },
    to: { transform: [{ scale: 0.95 }] },
  },
};

// Component Styles Presets
export const ComponentStyles = {
  // Card styles
  card: {
    default: {
      backgroundColor: Colors.light.surface,
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    elevated: {
      backgroundColor: Colors.light.surface,
      borderRadius: 16,
      padding: 20,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: Colors.primary[500],
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      elevation: 3,
      shadowColor: Colors.primary[500],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: Colors.primary[500],
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  },
  
  // Input styles
  input: {
    default: {
      backgroundColor: Colors.light.surface,
      borderWidth: 1,
      borderColor: Colors.secondary[200],
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
    },
    focused: {
      borderColor: Colors.primary[500],
      borderWidth: 2,
    },
  },
};

// Dark mode overrides
export const DarkModeOverrides = {
  card: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.border,
    color: Colors.dark.text,
  },
};

// Audio Player Specific Colors
export const AudioColors = {
  playing: {
    primary: Colors.success[500],
    secondary: Colors.success[400],
    background: Colors.success[50],
    gradient: ['#10b981', '#059669'],
  },
  paused: {
    primary: Colors.secondary[500],
    secondary: Colors.secondary[400],
    background: Colors.secondary[50],
    gradient: ['#64748b', '#475569'],
  },
  loading: {
    primary: Colors.warning[500],
    secondary: Colors.warning[400],
    background: Colors.warning[50],
    gradient: ['#f59e0b', '#d97706'],
  },
  error: {
    primary: Colors.error[500],
    secondary: Colors.error[400],
    background: Colors.error[50],
    gradient: ['#ef4444', '#dc2626'],
  },
};

// Quran Reading Colors
export const QuranColors = {
  arabicText: {
    light: Colors.secondary[900],
    dark: Colors.secondary[100],
  },
  translation: {
    light: Colors.secondary[700],
    dark: Colors.secondary[300],
  },
  verseNumber: {
    background: Colors.primary[500],
    text: '#ffffff',
  },
  highlight: {
    background: Colors.warning[100],
    backgroundDark: Colors.warning[900],
    border: Colors.warning[300],
    borderDark: Colors.warning[700],
  },
  bookmark: {
    active: Colors.error[500],
    inactive: Colors.secondary[400],
  },
};

// Utility Functions
export const colorUtils = {
  // Add opacity to color
  withOpacity: (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // Get contrast color (black or white)
  getContrastColor: (backgroundColor: string): string => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  },

  // Lighten color
  lighten: (color: string, amount: number): string => {
    // Simple implementation - in production use a proper color manipulation library
    return color; // Placeholder
  },

  // Darken color
  darken: (color: string, amount: number): string => {
    // Simple implementation - in production use a proper color manipulation library
    return color; // Placeholder
  },
};

// Export default theme creator
export const createAppTheme = (isDark: boolean) => ({
  colors: isDark ? {
    ...Colors,
    background: Colors.dark.bg,
    surface: Colors.dark.surface,
    text: Colors.dark.text,
    textSecondary: Colors.dark.textSecondary,
    textMuted: Colors.dark.textMuted,
    border: Colors.dark.border,
  } : {
    ...Colors,
    background: Colors.light.bg,
    surface: Colors.light.surface,
    text: Colors.light.text,
    textSecondary: Colors.light.textSecondary,
    textMuted: Colors.light.textMuted,
    border: Colors.light.border,
  },
  typography: Typography,
  animations: Animations,
  components: isDark ? {
    ...ComponentStyles,
    card: { ...ComponentStyles.card.default, ...DarkModeOverrides.card },
    input: { ...ComponentStyles.input.default, ...DarkModeOverrides.input },
  } : ComponentStyles,
});

export default Colors;
    
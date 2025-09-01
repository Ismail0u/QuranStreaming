import { Colors } from "./colors";
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
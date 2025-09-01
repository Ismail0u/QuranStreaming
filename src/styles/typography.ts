
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
import { darkTheme, type Theme } from '@rainbow-me/rainbowkit';

/**
 * Custom RainbowKit Theme Configuration
 * 
 * Dark theme design based on project primary color green-500 (oklch(0.90 0.25 130) #7cff4a)
 * 
 * Design Philosophy:
 * - Primary Color: Use green-500 (#7cff4a) as main accent color, expressing vitality and tech feel
 * - Visual Style: Adopt glass morphism effect and large border radius for modern, elegant visual experience
 * - Contrast: Ensure all text and interactive elements meet WCAG accessibility standards
 * - Consistency: Maintain consistency with project's overall dark theme and design language
 * 
 * Color System:
 * - Primary: green-500 (#7cff4a) - Main action buttons, selected states
 * - Secondary: green-400 (#7cff4a) - Gradient effects, activity indicators (using same theme color)
 * - Background: rgba(10, 10, 10, 0.95) - Dark semi-transparent background
 * - Border: rgba(255, 255, 255, 0.08) - Low contrast borders
 * 
 * @see https://www.rainbowkit.com/docs/theming
 */
export const customTheme: Theme = {
  ...darkTheme({
    accentColor: '#7cff4a', // green-500: primary accent color
    accentColorForeground: '#000000', // Black text for 9:1 contrast ratio on #7cff4a
    borderRadius: 'large', // Use 12px border radius, consistent with project radius-12
    fontStack: 'system', // Use Inter system font
    overlayBlur: 'large', // Strong glass effect to enhance visual hierarchy
  }),
  colors: {
    // Inherit darkTheme's default colors
    ...darkTheme({
      accentColor: '#7cff4a',
      accentColorForeground: '#000000',
    }).colors,
    
    // Custom color overrides
    // Action buttons
    actionButtonBorder: 'rgba(255, 255, 255, 0.08)',
    actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
    actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.03)',
    
    // Close button
    closeButton: 'rgba(255, 255, 255, 0.6)',
    closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
    
    // Connect button
    connectButtonBackground: '#7cff4a',
    connectButtonBackgroundError: '#ef4444',
    connectButtonInnerBackground: 'linear-gradient(90deg, #7cff4a 0%, #7cff4a 50%, #7cff4a 100%)',
    connectButtonText: '#000000',
    connectButtonTextError: '#ffffff',
    
    // Connection indicator
    connectionIndicator: '#7cff4a',
    
    // General borders
    generalBorder: 'rgba(255, 255, 255, 0.08)',
    generalBorderDim: 'rgba(255, 255, 255, 0.04)',
    
    // Menu items
    menuItemBackground: 'rgba(255, 255, 255, 0.03)',
    
    // Modal
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: 'rgba(10, 10, 10, 0.95)',
    modalBorder: 'rgba(255, 255, 255, 0.08)',
    modalText: '#ffffff',
    modalTextDim: 'rgba(255, 255, 255, 0.4)',
    modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
    
    // Profile
    profileAction: 'rgba(255, 255, 255, 0.03)',
    profileActionHover: 'rgba(255, 255, 255, 0.06)',
    profileForeground: 'rgba(10, 10, 10, 0.95)',
    
    // Selected state
    selectedOptionBorder: '#7cff4a',
    
    // Standby state
    standby: 'rgba(255, 255, 255, 0.3)',
  },
};

/**
 * Theme presets: Use different theme variants based on different scenarios
 */
export const themePresets = {
  /**
   * Standard theme: Default dark theme
   */
  default: customTheme,

  /**
   * Compact theme: Suitable for mobile devices or space-constrained scenarios
   */
  compact: {
    ...darkTheme({
      accentColor: '#7cff4a',
      accentColorForeground: '#000000',
      borderRadius: 'medium',
      fontStack: 'system',
      overlayBlur: 'small',
    }),
    colors: {
      ...darkTheme({
        accentColor: '#7cff4a',
        accentColorForeground: '#000000',
      }).colors,
      // Use same color overrides as customTheme
      connectButtonBackground: '#7cff4a',
      connectButtonInnerBackground: 'linear-gradient(90deg, #7cff4a 0%, #7cff4a 50%, #7cff4a 100%)',
      connectionIndicator: '#7cff4a',
      modalBackground: 'rgba(10, 10, 10, 0.95)',
      selectedOptionBorder: '#7cff4a',
    },
  } as Theme,

  /**
   * High contrast theme: Enhanced accessibility
   */
  highContrast: {
    ...darkTheme({
      accentColor: '#7cff4a',
      accentColorForeground: '#000000',
      borderRadius: 'large',
      fontStack: 'system',
      overlayBlur: 'large',
    }),
    colors: {
      ...darkTheme({
        accentColor: '#7cff4a',
        accentColorForeground: '#000000',
      }).colors,
      // Enhanced contrast
      modalText: '#ffffff',
      modalTextSecondary: 'rgba(255, 255, 255, 0.8)',
      generalBorder: 'rgba(255, 255, 255, 0.16)',
      connectButtonBackground: '#7cff4a',
      connectButtonInnerBackground: 'linear-gradient(90deg, #7cff4a 0%, #7cff4a 50%, #7cff4a 100%)',
      connectionIndicator: '#7cff4a',
      selectedOptionBorder: '#7cff4a',
    },
  } as Theme,
} as const;

/**
 * Export types for TypeScript usage
 */
export type ThemePreset = keyof typeof themePresets;

/**
 * Get theme configuration for specified preset
 * @param preset - Theme preset name ('default' | 'compact' | 'highContrast')
 * @returns RainbowKit theme configuration
 * 
 * @example
 * ```typescript
 * import { getTheme } from '@/config/rainbowkit-theme';
 *
 * // Use default theme
 * const theme = getTheme('default');
 *
 * // Use compact theme
 * const compactTheme = getTheme('compact');
 * ```
 */
export function getTheme(preset: ThemePreset = 'default'): Theme {
  return themePresets[preset];
}

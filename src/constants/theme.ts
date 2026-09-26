/**
 * Below are the colors and styles that are used across the app.
 * Theme tokens and reusable main styles are defined here for consistency.
 */

import '@/global.css';

import { Platform, StyleSheet } from 'react-native';

export const Palette = {
  primary: '#E76006',
  primaryDisabled: '#F88911',
  primaryLight: '#FFF7F2',
  secondary: '#575757',
  dark: '#242424',
  white: '#ffffff',
  background: '#F8F9FA',
  card: '#FFFFFF',
  border: '#ECEEF2',
  borderDark: '#E2E8F0',
  muted: '#F0F1F5',
  textSecondary: '#575757',
  textMuted: '#9AA0A6',
  iconMuted: '#8C93A0',
  success: '#22C55E',
  successDark: '#10B981',
  successBg: '#D1FAE5',
  successBorder: '#6EE7B7',
  successText: '#065F46',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  dangerBg: '#FEE2E2',
  dangerBorder: '#FCA5A5',
  dangerText: '#DC2626',
  warning: '#F59E0B',
} as const;

export const Colors = {
  light: {
    text: Palette.dark,
    textSecondary: Palette.secondary,
    textMuted: Palette.textMuted,
    background: Palette.background,
    backgroundElement: Palette.card,
    backgroundSelected: Palette.muted,
    primary: Palette.primary,
    primaryDisabled: Palette.primaryDisabled,
    primaryLight: Palette.primaryLight,
    secondary: Palette.secondary,
    border: Palette.border,
    borderDark: Palette.borderDark,
    white: Palette.white,
    success: Palette.success,
    successBg: Palette.successBg,
    danger: Palette.danger,
    dangerBg: Palette.dangerBg,
    warning: Palette.warning,
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    textMuted: '#8C93A0',
    background: '#242424',
    backgroundElement: '#2E3135',
    backgroundSelected: '#3D4147',
    primary: Palette.primary,
    primaryDisabled: Palette.primaryDisabled,
    primaryLight: 'rgba(231, 96, 6, 0.15)',
    secondary: Palette.secondary,
    border: '#3D4147',
    borderDark: '#4B5563',
    white: Palette.white,
    success: Palette.success,
    successBg: '#064E3B',
    danger: '#FF6467',
    dangerBg: '#7F1D1D',
    warning: Palette.warning,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Courier New',
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
    rounded: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 26,
  '4xl': 30,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 18,
  full: 9999,
} as const;

export const Shadows = {
  none: Platform.select({
    ios: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0 },
    android: { elevation: 0 },
    web: { boxShadow: 'none' },
  }),
  sm: Platform.select({
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    android: { elevation: 1 },
    web: { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' },
  }),
  md: Platform.select({
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
    android: { elevation: 2 },
    web: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' },
  }),
  lg: Platform.select({
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 },
    android: { elevation: 4 },
    web: { boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)' },
  }),
  primary: Platform.select({
    ios: { shadowColor: Palette.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8 },
    android: { elevation: 2 },
    web: { boxShadow: '0 2px 10px rgba(231, 96, 6, 0.12)' },
  }),
} as const;

export const BottomTabInset = Platform.select({ ios: 100, android: 112, default: 100 }) ?? 100;
export const MaxContentWidth = 800;

/**
 * Common reusable styles across screens and components
 */
export const CommonStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: Palette.background,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },

  // Cards
  card: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.three + 2,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cardLarge: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  // Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.background,
    borderWidth: 1.2,
    borderColor: Palette.borderDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: Palette.primary,
    backgroundColor: Palette.card,
  },
  inputContainerError: {
    borderColor: Palette.danger,
    backgroundColor: '#FFF8F8',
  },
  inputLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: Palette.dark,
    marginBottom: 6,
  },
  fieldErrorText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    color: Palette.danger,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: FontWeight.medium,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: Palette.primary,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonPrimaryPressed: {
    opacity: 0.88,
  },
  buttonPrimaryDisabled: {
    backgroundColor: Palette.primaryDisabled,
  },
  buttonPrimaryText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Palette.white,
  },

  buttonSecondary: {
    backgroundColor: Palette.card,
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonSecondaryPressed: {
    backgroundColor: Palette.muted,
  },
  buttonSecondaryText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Palette.dark,
  },

  buttonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.dangerBg,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
  },
  buttonDangerPressed: {
    backgroundColor: '#FEF2F2',
  },
  buttonDangerText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Palette.danger,
  },

  // Dividers & Layout helpers
  divider: {
    height: 1,
    backgroundColor: Palette.muted,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});


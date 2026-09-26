import { Platform } from 'react-native';
import { Palette } from './colors';

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

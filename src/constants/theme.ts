/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#242424',
    textSecondary: '#575757',
    background: '#F8F9FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F0F1F5',
    primary: '#E76006',
    primaryDisabled: '#F88911',
    secondary: '#575757',
    white: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    textSecondary: '#B0B4BA',
    background: '#242424',
    backgroundElement: '#2E3135',
    backgroundSelected: '#3D4147',
    primary: '#E76006',
    primaryDisabled: '#F88911',
    secondary: '#575757',
    white: '#ffffff',
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

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 100, android: 112, default: 100 }) ?? 100;
export const MaxContentWidth = 800;

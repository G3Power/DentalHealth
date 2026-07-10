/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F7F9F9',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6EEEE',
    textSecondary: '#5A6B6B',
    border: '#E1E6E6',
    primary: '#0E7C7B',
    onPrimary: '#FFFFFF',
    primaryMuted: '#E1F0EF',
    // Observation levels — intentionally calm, not alarming.
    info: '#2E6BE6',
    infoBg: '#EAF1FE',
    monitor: '#B4690E',
    monitorBg: '#F9EED8',
    seekCare: '#B23A48',
    seekCareBg: '#FBE9EC',
    positive: '#1E7D54',
    positiveBg: '#E4F4EC',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0B0F0F',
    backgroundElement: '#161B1B',
    backgroundSelected: '#212828',
    textSecondary: '#9BA7A7',
    border: '#2A3131',
    primary: '#4FD1C5',
    onPrimary: '#04211F',
    primaryMuted: '#123634',
    info: '#7FA9F5',
    infoBg: '#16233B',
    monitor: '#E3B266',
    monitorBg: '#332810',
    seekCare: '#E88E9A',
    seekCareBg: '#351A20',
    positive: '#6BD3A0',
    positiveBg: '#123227',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
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

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

function resolveColors(variant: ButtonVariant): {
  background: ThemeColor | 'transparent';
  foreground: ThemeColor;
  border: ThemeColor | 'transparent';
} {
  switch (variant) {
    case 'primary':
      return { background: 'primary', foreground: 'onPrimary', border: 'primary' };
    case 'secondary':
      return { background: 'backgroundElement', foreground: 'text', border: 'border' };
    case 'ghost':
      return { background: 'transparent', foreground: 'primary', border: 'transparent' };
  }
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  accessibilityHint,
}: ButtonProps) {
  const theme = useTheme();
  const colors = resolveColors(variant);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.background === 'transparent' ? 'transparent' : theme[colors.background],
          borderColor: colors.border === 'transparent' ? 'transparent' : theme[colors.border],
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <ThemedText style={[styles.label, { color: theme[colors.foreground] }]}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

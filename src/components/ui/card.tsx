import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radii, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: ThemeColor;
  borderColor?: ThemeColor;
  /** Remove the border (e.g. for tinted cards that use background only). */
  borderless?: boolean;
}

export function Card({
  children,
  style,
  backgroundColor = 'backgroundElement',
  borderColor = 'border',
  borderless = false,
}: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme[backgroundColor],
          borderColor: borderless ? 'transparent' : theme[borderColor],
          borderWidth: borderless ? 0 : 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    padding: Spacing.three,
    gap: Spacing.two,
  },
});

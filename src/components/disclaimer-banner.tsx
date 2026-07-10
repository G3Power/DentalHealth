import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { SHORT_BANNER } from '@/content/disclaimers';
import { useTheme } from '@/hooks/use-theme';

interface DisclaimerBannerProps {
  text?: string;
  onPress?: () => void;
}

export function DisclaimerBanner({ text = SHORT_BANNER, onPress }: DisclaimerBannerProps) {
  const theme = useTheme();

  const content = (
    <View style={[styles.banner, { backgroundColor: theme.primaryMuted }]}>
      <ThemedText type="smallBold" style={{ color: theme.primary }}>
        {text}
      </ThemedText>
      {onPress ? (
        <ThemedText type="small" style={{ color: theme.primary }}>
          Learn more ›
        </ThemedText>
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Open disclaimer and privacy details">
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radii.md,
  },
});

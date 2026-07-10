import { StyleSheet, View } from 'react-native';

import type { LevelPresentation } from '@/analysis/present';
import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function LevelBadge({ presentation }: { presentation: LevelPresentation }) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: theme[presentation.background] }]}>
      <ThemedText type="smallBold" style={{ color: theme[presentation.color] }}>
        {presentation.label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radii.pill,
  },
});

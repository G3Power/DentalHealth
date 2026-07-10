import { StyleSheet, View } from 'react-native';

import { presentWellnessStatus } from '@/analysis/present';
import type { WellnessSignal } from '@/analysis/types';
import { LevelBadge } from '@/components/level-badge';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function WellnessCard({ signal }: { signal: WellnessSignal }) {
  const theme = useTheme();
  const presentation = presentWellnessStatus(signal.status);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.label}>
          {signal.label}
        </ThemedText>
        <LevelBadge presentation={presentation} />
      </View>
      <ThemedText>{signal.explanation}</ThemedText>
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {signal.evidenceNote}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  header: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
  },
});

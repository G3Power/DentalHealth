import { Pressable, StyleSheet, View } from 'react-native';

import { formatConfidence, presentLevel } from '@/analysis/present';
import type { Observation } from '@/analysis/types';
import { LevelBadge } from '@/components/level-badge';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ObservationCardProps {
  observation: Observation;
  onLearnMore?: (slug: string) => void;
}

export function ObservationCard({ observation, onLearnMore }: ObservationCardProps) {
  const theme = useTheme();
  const presentation = presentLevel(observation.level);
  const canLearnMore = observation.learnMoreSlug != null && onLearnMore != null;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          {observation.title}
        </ThemedText>
        <LevelBadge presentation={presentation} />
      </View>

      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {formatConfidence(observation.confidence)}
      </ThemedText>

      <ThemedText>{observation.summary}</ThemedText>

      <View style={styles.block}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          WHAT THIS COULD RELATE TO
        </ThemedText>
        <ThemedText>{observation.whatItMeans}</ThemedText>
      </View>

      <View style={styles.block}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          WHAT YOU CAN DO
        </ThemedText>
        <ThemedText>{observation.whatToDo}</ThemedText>
      </View>

      {canLearnMore ? (
        <Pressable
          onPress={() => onLearnMore?.(observation.learnMoreSlug as string)}
          accessibilityRole="button"
        >
          <ThemedText type="smallBold" style={{ color: theme.primary }}>
            Learn more ›
          </ThemedText>
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  block: {
    gap: Spacing.half,
  },
});

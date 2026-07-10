import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ObservationCard } from '@/components/observation-card';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { WellnessCard } from '@/components/wellness-card';
import { Radii, Spacing } from '@/constants/theme';
import { NOT_A_DIAGNOSIS, PRIVACY_SUMMARY, SEEK_CARE_PROMPT } from '@/content/disclaimers';
import { useTheme } from '@/hooks/use-theme';
import { useScan } from '@/state/scan-store';

export default function ResultsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { result, input, reset } = useScan();

  if (!result) {
    return (
      <Screen>
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          No results to show
        </ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          Take a photo to see an illustrative self-check.
        </ThemedText>
        <Button title="Start a scan" onPress={() => router.replace('/capture')} />
        <Button title="Go home" variant="secondary" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  function scanAgain() {
    reset();
    router.replace('/capture');
  }

  function done() {
    reset();
    router.replace('/');
  }

  return (
    <Screen>
      {result.isDemo ? (
        <Card backgroundColor="monitorBg" borderless>
          <ThemedText type="smallBold" style={{ color: theme.monitor }}>
            DEMO RESULTS
          </ThemedText>
          <ThemedText>
            These observations are illustrative examples to show how results will look. They are not
            based on your actual photo.
          </ThemedText>
        </Card>
      ) : null}

      {input ? (
        <View style={styles.photoRow}>
          <Image
            source={{ uri: input.imageUri }}
            style={[styles.thumb, { backgroundColor: theme.backgroundElement }]}
            contentFit="cover"
            accessibilityLabel="The photo you captured"
          />
          <ThemedText type="small" style={[styles.photoNote, { color: theme.textSecondary }]}>
            This is the photo you captured. It stays on your device.
          </ThemedText>
        </View>
      ) : null}

      <ThemedText style={{ color: theme.textSecondary }}>{result.summary}</ThemedText>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          OBSERVATIONS
        </ThemedText>
        {result.observations.map((observation) => (
          <ObservationCard
            key={observation.id}
            observation={observation}
            onLearnMore={(slug) => router.push({ pathname: '/learn/[slug]', params: { slug } })}
          />
        ))}
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          MOUTH–BODY WELLNESS
        </ThemedText>
        {result.wellness.map((signal) => (
          <WellnessCard key={signal.id} signal={signal} />
        ))}
      </View>

      <Card backgroundColor="seekCareBg" borderless>
        <ThemedText type="smallBold" style={{ color: theme.seekCare }}>
          WHEN TO SEE A PROFESSIONAL
        </ThemedText>
        <ThemedText>{SEEK_CARE_PROMPT}</ThemedText>
      </Card>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          NEXT STEPS
        </ThemedText>
        {result.nextSteps.map((step) => (
          <View key={step} style={styles.bulletRow}>
            <ThemedText style={{ color: theme.primary }}>•</ThemedText>
            <ThemedText style={styles.bulletText}>{step}</ThemedText>
          </View>
        ))}
      </View>

      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {NOT_A_DIAGNOSIS}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {PRIVACY_SUMMARY}
      </ThemedText>

      <View style={styles.actions}>
        <Button title="Scan again" onPress={scanAgain} style={styles.actionButton} />
        <Button title="Done" variant="secondary" onPress={done} style={styles.actionButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyTitle: {
    fontSize: 24,
    lineHeight: 30,
    marginTop: Spacing.two,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  thumb: {
    width: 72,
    aspectRatio: 3 / 4,
    borderRadius: Radii.md,
  },
  photoNote: {
    flex: 1,
  },
  section: {
    gap: Spacing.three,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  bulletText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  actionButton: {
    flex: 1,
  },
});

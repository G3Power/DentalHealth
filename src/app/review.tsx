import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { MIN_BRIGHTNESS, MIN_SHARPNESS } from '@/capture/quality';
import { Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useScan } from '@/state/scan-store';

export default function ReviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { input, quality } = useScan();
  const advisories = quality && !quality.ok ? quality.issues : [];
  // Dev-only readout so the brightness/sharpness thresholds can be tuned against
  // real captures during manual testing. Never rendered in production builds.
  const metrics = quality?.metrics;

  if (!input) {
    return (
      <Screen>
        <ThemedText type="subtitle" style={styles.emptyTitle}>
          No photo yet
        </ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          Take a photo of your mouth to review it here.
        </ThemedText>
        <Button title="Take a photo" onPress={() => router.replace('/capture')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText style={{ color: theme.textSecondary }}>
        Check that your open mouth is clearly visible and evenly lit. Retake if anything is dark,
        blurry, or out of frame.
      </ThemedText>

      <View style={[styles.imageWrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Image
          source={{ uri: input.imageUri }}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel="The photo you just captured"
        />
      </View>

      {advisories.length > 0 ? (
        <Card backgroundColor="monitorBg" borderless>
          <ThemedText type="smallBold" themeColor="monitor">
            A clearer photo may help
          </ThemedText>
          {advisories.map((issue) => (
            <ThemedText key={issue.code} type="small" themeColor="monitor">
              {issue.message}
            </ThemedText>
          ))}
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            You can still continue — this is only a suggestion.
          </ThemedText>
        </Card>
      ) : null}

      {__DEV__ && metrics ? (
        <View style={[styles.devReadout, { borderColor: theme.border }]}>
          <ThemedText type="code" style={{ color: theme.textSecondary }}>
            {`DEV · brightness ${metrics.brightness.toFixed(2)} (min ${MIN_BRIGHTNESS.toFixed(2)}) ${metrics.brightness >= MIN_BRIGHTNESS ? 'ok' : 'low'}\nDEV · sharpness  ${metrics.sharpness.toFixed(3)} (min ${MIN_SHARPNESS.toFixed(3)}) ${metrics.sharpness >= MIN_SHARPNESS ? 'ok' : 'low'}`}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Retake"
          variant="secondary"
          onPress={() => router.replace('/capture')}
          style={styles.actionButton}
        />
        <Button
          title="Use this photo"
          onPress={() => router.replace('/analyzing')}
          style={styles.actionButton}
          accessibilityHint="Continues to the illustrative analysis"
        />
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
  imageWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  devReadout: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
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

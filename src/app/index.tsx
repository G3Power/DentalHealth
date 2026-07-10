import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Radii, Spacing } from '@/constants/theme';
import { APP_NAME } from '@/content/disclaimers';
import { useTheme } from '@/hooks/use-theme';

const STEPS: { title: string; text: string }[] = [
  { title: 'Take a photo', text: 'Frame your open mouth using the on-screen guide.' },
  { title: 'Review observations', text: 'See general, non-diagnostic things worth noticing.' },
  { title: 'Learn & follow up', text: 'Understand the mouth–body link and when to see a pro.' },
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.appName}>
          {APP_NAME}
        </ThemedText>
        <ThemedText type="default" style={{ color: theme.textSecondary }}>
          An educational look at what your mouth may reveal about your health.
        </ThemedText>
      </View>

      <DisclaimerBanner onPress={() => router.push('/about')} />

      <Card backgroundColor="primaryMuted" borderless style={styles.hero}>
        <ThemedText type="subtitle" style={styles.heroTitle}>
          Take a quick oral self-check
        </ThemedText>
        <ThemedText style={{ color: theme.text }}>
          It takes about a minute. Your photo stays on your device.
        </ThemedText>
        <Button
          title="Scan my mouth"
          onPress={() => router.push('/capture')}
          accessibilityHint="Opens the camera to take a guided photo"
        />
      </Card>

      <View style={styles.section}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          HOW IT WORKS
        </ThemedText>
        {STEPS.map((step, index) => (
          <View key={step.title} style={styles.step}>
            <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                {index + 1}
              </ThemedText>
            </View>
            <View style={styles.stepText}>
              <ThemedText type="smallBold">{step.title}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {step.text}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.links}>
        <Button title="Learn" variant="secondary" onPress={() => router.push('/learn')} style={styles.linkButton} />
        <Button
          title="About & safety"
          variant="secondary"
          onPress={() => router.push('/about')}
          style={styles.linkButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  appName: {
    fontSize: 34,
    lineHeight: 40,
  },
  hero: {
    gap: Spacing.three,
    padding: Spacing.four,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  section: {
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  links: {
    flexDirection: 'row',
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  linkButton: {
    flex: 1,
  },
});

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import {
  APP_NAME,
  CONSENT_POINTS,
  EMERGENCY_NOTE,
  NOT_A_DIAGNOSIS,
  PRIVACY_SUMMARY,
} from '@/content/disclaimers';
import { useTheme } from '@/hooks/use-theme';
import { useConsent } from '@/state/consent';

export default function ConsentScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { grant } = useConsent();
  const [checked, setChecked] = useState<boolean[]>(() => CONSENT_POINTS.map(() => false));

  const allChecked = checked.every(Boolean);

  function toggle(index: number) {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  async function handleContinue() {
    await grant();
    router.replace('/');
  }

  return (
    <Screen>
      <View style={styles.intro}>
        <ThemedText type="title" style={styles.title}>
          Before you start
        </ThemedText>
        <ThemedText type="default" style={{ color: theme.textSecondary }}>
          {APP_NAME} helps you look at your own mouth and learn how oral health connects to your
          overall wellbeing.
        </ThemedText>
      </View>

      <Card backgroundColor="primaryMuted" borderless>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          THIS IS NOT A DIAGNOSIS
        </ThemedText>
        <ThemedText>{NOT_A_DIAGNOSIS}</ThemedText>
      </Card>

      <Card>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          YOUR PRIVACY
        </ThemedText>
        <ThemedText>{PRIVACY_SUMMARY}</ThemedText>
      </Card>

      <Card backgroundColor="monitorBg" borderless>
        <ThemedText type="smallBold" style={{ color: theme.monitor }}>
          NOT FOR EMERGENCIES
        </ThemedText>
        <ThemedText>{EMERGENCY_NOTE}</ThemedText>
      </Card>

      <View style={styles.acks}>
        {CONSENT_POINTS.map((point, index) => (
          <Checkbox
            key={point}
            checked={checked[index]}
            onToggle={() => toggle(index)}
            label={point}
          />
        ))}
      </View>

      <Button
        title="I understand — continue"
        onPress={handleContinue}
        disabled={!allChecked}
        accessibilityHint="Records your acknowledgement and opens the home screen"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  acks: {
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
});

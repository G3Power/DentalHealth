import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import {
  APP_NAME,
  EMERGENCY_NOTE,
  NOT_A_DIAGNOSIS,
  PRIVACY_SUMMARY,
  SEEK_CARE_PROMPT,
} from '@/content/disclaimers';
import { useTheme } from '@/hooks/use-theme';
import { useConsent } from '@/state/consent';

export default function AboutScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { revoke } = useConsent();

  return (
    <Screen>
      <ThemedText type="default" style={{ color: theme.textSecondary }}>
        {APP_NAME} is an educational, Phase 0 prototype. It focuses on getting the experience,
        safety, and privacy right before any real medical analysis is added.
      </ThemedText>

      <Card backgroundColor="primaryMuted" borderless>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          NOT A MEDICAL DIAGNOSIS
        </ThemedText>
        <ThemedText>{NOT_A_DIAGNOSIS}</ThemedText>
      </Card>

      <Card>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          PRIVACY
        </ThemedText>
        <ThemedText>{PRIVACY_SUMMARY}</ThemedText>
      </Card>

      <Card backgroundColor="seekCareBg" borderless>
        <ThemedText type="smallBold" style={{ color: theme.seekCare }}>
          WHEN TO SEE A PROFESSIONAL
        </ThemedText>
        <ThemedText>{SEEK_CARE_PROMPT}</ThemedText>
      </Card>

      <Card backgroundColor="monitorBg" borderless>
        <ThemedText type="smallBold" style={{ color: theme.monitor }}>
          NOT FOR EMERGENCIES
        </ThemedText>
        <ThemedText>{EMERGENCY_NOTE}</ThemedText>
      </Card>

      <View style={styles.links}>
        <Button
          title="Read: what this app can & cannot do"
          variant="secondary"
          onPress={() => router.push({ pathname: '/learn/[slug]', params: { slug: 'how-it-works' } })}
        />
      </View>

      <View style={styles.footer}>
        <ThemedText type="smallBold" style={{ color: theme.textSecondary }}>
          MANAGE
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Reset your acknowledgement to review the intro terms again.
        </ThemedText>
        <Button title="Reset acknowledgement" variant="ghost" onPress={() => revoke()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  links: {
    gap: Spacing.three,
  },
  footer: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});

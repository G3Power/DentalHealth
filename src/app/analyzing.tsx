import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { getAnalyzer } from '@/analysis/analyzer';
import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useScan } from '@/state/scan-store';

export default function AnalyzingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { input, setResult } = useScan();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (!input) {
      router.replace('/');
      return;
    }
    startedRef.current = true;
    let active = true;
    getAnalyzer()
      .analyze(input)
      .then((result) => {
        if (!active) return;
        setResult(result);
        router.replace('/results');
      })
      .catch(() => {
        if (active) router.replace('/');
      });
    return () => {
      active = false;
    };
  }, [input, router, setResult]);

  return (
    <Screen scroll={false} contentStyle={styles.center}>
      <ActivityIndicator size="large" color={theme.primary} />
      <ThemedText type="subtitle" style={styles.title}>
        Looking things over…
      </ThemedText>
      <ThemedText style={[styles.body, { color: theme.textSecondary }]}>
        This is a demo. We’re preparing illustrative observations — not a real analysis of your
        photo.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
});

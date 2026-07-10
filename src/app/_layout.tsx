import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConsentProvider, useConsent } from '@/state/consent';
import { ScanProvider } from '@/state/scan-store';

SplashScreen.preventAutoHideAsync();

/**
 * Redirects first-time users to the consent screen, and keeps them out of it
 * once they have accepted. Runs inside the ConsentProvider + router context.
 */
function useConsentGate() {
  const { status } = useConsent();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    const onConsentScreen = segments[0] === 'consent';
    if (status === 'not-granted' && !onConsentScreen) {
      router.replace('/consent');
    } else if (status === 'granted' && onConsentScreen) {
      router.replace('/');
    }
  }, [status, segments, router]);
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { status } = useConsent();
  useConsentGate();

  useEffect(() => {
    if (status !== 'loading') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [status]);

  if (status === 'loading') {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="consent"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="capture"
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="review" options={{ title: 'Review photo' }} />
        <Stack.Screen
          name="analyzing"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="results" options={{ title: 'Your results' }} />
        <Stack.Screen name="about" options={{ title: 'About & safety' }} />
        <Stack.Screen name="learn/index" options={{ title: 'Learn' }} />
        <Stack.Screen name="learn/[slug]" options={{ title: 'Learn' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ConsentProvider>
        <ScanProvider>
          <RootNavigator />
        </ScanProvider>
      </ConsentProvider>
    </SafeAreaProvider>
  );
}

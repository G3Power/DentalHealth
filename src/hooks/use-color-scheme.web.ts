import { useColorScheme as useRNColorScheme } from 'react-native';

import { useIsClient } from '@/hooks/use-is-client';

/**
 * To support static rendering, this value needs to be re-calculated on the
 * client side for web. `useIsClient` is hydration-safe and avoids calling
 * setState inside an effect.
 */
export function useColorScheme() {
  const hasHydrated = useIsClient();
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}

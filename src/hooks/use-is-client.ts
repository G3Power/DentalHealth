import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns false during server/static render and true once running on the
 * client. Uses `useSyncExternalStore` (rather than a setState-in-effect) so it
 * is hydration-safe and does not trigger cascading renders.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

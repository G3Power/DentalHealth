import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

/**
 * Persisted acknowledgement that the user has seen and accepted the
 * educational-use / not-a-diagnosis terms. Versioned so we can re-prompt if the
 * terms materially change.
 */
const STORAGE_KEY = 'ohc.consent.v1';

export type ConsentStatus = 'loading' | 'granted' | 'not-granted';

interface ConsentContextValue {
  status: ConsentStatus;
  grant: () => Promise<void>;
  revoke: () => Promise<void>;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<ConsentStatus>('loading');

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (active) setStatus(value === 'true' ? 'granted' : 'not-granted');
      })
      .catch(() => {
        if (active) setStatus('not-granted');
      });
    return () => {
      active = false;
    };
  }, []);

  async function grant() {
    setStatus('granted');
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  }

  async function revoke() {
    setStatus('not-granted');
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  return (
    <ConsentContext.Provider value={{ status, grant, revoke }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}

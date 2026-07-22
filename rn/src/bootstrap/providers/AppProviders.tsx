import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/bootstrap/query/query-client';
import { i18n } from '@/core/i18n';

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected))),
);

function handleAppStateChange(status: AppStateStatus): void {
  focusManager.setFocused(status === 'active');
}

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

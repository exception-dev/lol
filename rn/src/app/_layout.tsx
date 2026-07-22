import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/bootstrap/providers/AppProviders';
import { colors } from '@/core/theme/theme';

ExpoSplashScreen.setOptions({
  duration: 300,
  fade: true,
});

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      />
    </AppProviders>
  );
}

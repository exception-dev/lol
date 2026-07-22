import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/core/config/app-config';
import { colors } from '@/core/theme/theme';
import { usePatchVersionQuery } from '@/features/champion/presentation/queries/patch-version.query';

export function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const title = t('app.splashTitle');
  const [visibleLength, setVisibleLength] = useState(0);
  const patchQuery = usePatchVersionQuery();

  useEffect(() => {
    if (visibleLength >= title.length) return;
    const timer = setTimeout(
      () => setVisibleLength((length) => length + 1),
      appConfig.splashCharacterDelayMs,
    );
    return () => clearTimeout(timer);
  }, [title.length, visibleLength]);

  useEffect(() => {
    if (visibleLength < title.length || patchQuery.isPending) return;
    const timer = setTimeout(() => router.replace('/champions'), 180);
    return () => clearTimeout(timer);
  }, [patchQuery.isPending, router, title.length, visibleLength]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityLabel={title}>
        {title.slice(0, visibleLength)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    minHeight: 36,
    paddingHorizontal: 24,
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

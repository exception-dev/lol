import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChampionNotFoundError, DataError, NetworkError } from '@/core/errors/app-error';
import { colors } from '@/core/theme/theme';

interface ErrorStateProps {
  error: unknown;
  onRetry(): void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  const message =
    error instanceof NetworkError
      ? t('error.network')
      : error instanceof DataError
        ? t('error.data')
        : error instanceof ChampionNotFoundError
          ? t('error.notFound', { championId: error.championId })
          : t('error.unknown');

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>{t('common.retry')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    padding: 28,
  },
  message: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/core/theme/theme';

export function LoadingState() {
  const { t } = useTranslation();
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={styles.label}>{t('common.loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

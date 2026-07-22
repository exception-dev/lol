import { Image } from 'expo-image';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/core/theme/theme';

interface ChampionImageProps {
  source: string;
  accessibilityLabel: string;
  style?: StyleProp<ImageStyle | ViewStyle>;
  contentFit?: 'cover' | 'contain';
  contentPosition?: 'center' | 'top';
  priority?: 'low' | 'normal' | 'high';
}

export function ChampionImage({
  source,
  accessibilityLabel,
  style,
  contentFit = 'cover',
  contentPosition = 'center',
  priority = 'normal',
}: ChampionImageProps) {
  const { t } = useTranslation();
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const hasError = failedSource === source;

  return (
    <View style={[styles.container, style]}>
      {!hasError && (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          contentPosition={contentPosition}
          cachePolicy="memory-disk"
          transition={180}
          priority={priority}
          accessibilityLabel={accessibilityLabel}
          onError={() => setFailedSource(source)}
        />
      )}
      {hasError && <Text style={styles.errorText}>{t('error.image')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.imagePlaceholder,
  },
  errorText: {
    paddingHorizontal: 8,
    color: colors.textSubtle,
    fontSize: 11,
    textAlign: 'center',
  },
});

import { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

import { championSkinUrl } from '@/core/config/app-config';
import { colors } from '@/core/theme/theme';
import type { Skin } from '@/features/champion/domain/entities/champion';
import { ChampionImage } from '@/features/champion/presentation/components/ChampionImage';

const cardGap = 12;

interface AnimatedSkinCardProps {
  championId: string;
  skin: Skin;
  index: number;
  itemWidth: number;
  itemHeight: number;
  itemInterval: number;
  scrollX: SharedValue<number>;
}

function AnimatedSkinCard({
  championId,
  skin,
  index,
  itemWidth,
  itemHeight,
  itemInterval,
  scrollX,
}: AnimatedSkinCardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const centerOffset = index * itemInterval;
    return {
      opacity: interpolate(
        scrollX.value,
        [centerOffset - itemInterval, centerOffset, centerOffset + itemInterval],
        [0.55, 1, 0.55],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [centerOffset - itemInterval, centerOffset, centerOffset + itemInterval],
            [0.86, 1, 0.86],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.skinCard,
        { width: itemWidth, height: itemHeight, marginRight: cardGap },
        animatedStyle,
      ]}
    >
      <ChampionImage
        source={championSkinUrl(championId, skin.number)}
        accessibilityLabel={skin.name}
        style={StyleSheet.absoluteFill}
        contentPosition="top"
      />
      <View style={styles.skinCaption}>
        <Text style={styles.skinName} numberOfLines={2}>
          {skin.name}
        </Text>
      </View>
    </Animated.View>
  );
}

interface SkinCarouselProps {
  championId: string;
  skins: readonly Skin[];
}

export function SkinCarousel({ championId, skins }: SkinCarouselProps) {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const viewportWidth = Math.min(screenWidth, 600);
  const itemWidth = viewportWidth * 0.72;
  const itemHeight = Math.min(500, viewportWidth * 1.18);
  const itemInterval = itemWidth + cardGap;
  const sidePadding = (screenWidth - itemWidth) / 2;
  const scrollX = useSharedValue(0);
  const data = useMemo(() => [...skins], [skins]);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (data.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{t('champion.skins')}</Text>
      <Animated.FlatList
        horizontal
        data={data}
        keyExtractor={(skin) => skin.id}
        renderItem={({ item, index }) => (
          <AnimatedSkinCard
            championId={championId}
            skin={item}
            index={index}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            itemInterval={itemInterval}
            scrollX={scrollX}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: itemInterval,
          offset: itemInterval * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 18,
    paddingBottom: 28,
  },
  title: {
    marginBottom: 14,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  skinCard: {
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOpacity: 0.38,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  skinCaption: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
  },
  skinName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { appConfig, championSplashUrl } from '@/core/config/app-config';
import { colors } from '@/core/theme/theme';
import type { Champion } from '@/features/champion/domain/entities/champion';
import { ChampionImage } from '@/features/champion/presentation/components/ChampionImage';
import { ErrorState } from '@/features/champion/presentation/components/ErrorState';
import { LoadingState } from '@/features/champion/presentation/components/LoadingState';
import { SearchBar } from '@/features/champion/presentation/components/SearchBar';
import { useDebouncedValue } from '@/features/champion/presentation/hooks/use-debounced-value';
import { useChampionListQuery } from '@/features/champion/presentation/queries/champion.query';
import { useChampionSearchStore } from '@/features/champion/presentation/stores/champion-search.store';

interface ChampionCardProps {
  champion: Champion;
  width: number;
  searching: boolean;
  onPress(): void;
}

function ChampionCard({ champion, width, searching, onPress }: ChampionCardProps) {
  if (searching) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={champion.name}
        onPress={onPress}
        style={({ pressed }) => [styles.searchRow, pressed && styles.pressed]}
      >
        <ChampionImage
          source={championSplashUrl(champion.id)}
          accessibilityLabel={champion.name}
          style={styles.searchImage}
          contentFit="contain"
        />
        <View style={styles.searchCopy}>
          <Text style={styles.searchName}>{champion.name}</Text>
          <Text style={styles.searchTitle} numberOfLines={1}>
            {champion.title}
          </Text>
        </View>
        <Text style={styles.chevron} accessibilityElementsHidden>
          ›
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={champion.name}
      onPress={onPress}
      style={({ pressed }) => [styles.gridCard, { width }, pressed && styles.pressed]}
    >
      <ChampionImage
        source={championSplashUrl(champion.id)}
        accessibilityLabel={champion.name}
        style={styles.gridImage}
        contentFit="contain"
      />
      <View style={styles.gridCaption}>
        <Text style={styles.gridName} numberOfLines={1}>
          {champion.name}
        </Text>
      </View>
    </Pressable>
  );
}

export function ChampionListScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const query = useChampionSearchStore((state) => state.query);
  const setQuery = useChampionSearchStore((state) => state.setQuery);
  const clearQuery = useChampionSearchStore((state) => state.clear);
  const debouncedQuery = useDebouncedValue(query, appConfig.searchDebounceMs);
  const championQuery = useChampionListQuery();
  const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase('ko');
  const searching = normalizedQuery.length > 0;
  const cardWidth = (width - 32 - 10) / 2;

  const champions = useMemo(() => {
    const allChampions = championQuery.data?.champions ?? [];
    if (!searching) return allChampions;
    return allChampions.filter((champion) =>
      champion.name.toLocaleLowerCase('ko').includes(normalizedQuery),
    );
  }, [championQuery.data?.champions, normalizedQuery, searching]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.searchHeader}>
        <SearchBar value={query} onChangeText={setQuery} onClear={clearQuery} />
      </View>

      {championQuery.isPending ? (
        <LoadingState />
      ) : championQuery.isError ? (
        <ErrorState error={championQuery.error} onRetry={() => void championQuery.refetch()} />
      ) : (
        <FlatList
          key={searching ? 'search-list' : 'champion-grid'}
          data={champions}
          keyExtractor={(champion) => champion.id}
          numColumns={searching ? 1 : 2}
          columnWrapperStyle={searching ? undefined : styles.gridRow}
          contentContainerStyle={[
            styles.listContent,
            champions.length === 0 && styles.emptyContent,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ChampionCard
              champion={item}
              width={cardWidth}
              searching={searching}
              onPress={() => {
                if (searching) {
                  clearQuery();
                }
                router.push({
                  pathname: '/champions/[championId]',
                  params: { championId: item.id },
                });
              }}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {t(searching ? 'champion.emptySearch' : 'champion.emptyList')}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  gridRow: {
    gap: 10,
    marginBottom: 10,
  },
  gridCard: {
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 885 / 522,
  },
  gridCaption: {
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  gridName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchRow: {
    minHeight: 76,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchImage: {
    width: 58 * (885 / 522),
    height: 58,
    borderRadius: 8,
  },
  searchCopy: {
    flex: 1,
    gap: 4,
  },
  searchName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  searchTitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  chevron: {
    color: colors.textSubtle,
    fontSize: 28,
  },
  pressed: {
    opacity: 0.65,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
});

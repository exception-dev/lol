import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { championSplashUrl, passiveImageUrl, spellImageUrl } from '@/core/config/app-config';
import { normalizeDataDragonText } from '@/core/text/data-dragon-text';
import { colors } from '@/core/theme/theme';
import type { Spell } from '@/features/champion/domain/entities/champion';
import { ChampionImage } from '@/features/champion/presentation/components/ChampionImage';
import { ErrorState } from '@/features/champion/presentation/components/ErrorState';
import { LoadingState } from '@/features/champion/presentation/components/LoadingState';
import { SkinCarousel } from '@/features/champion/presentation/components/SkinCarousel';
import { useChampionDetailQuery } from '@/features/champion/presentation/queries/champion.query';

const spellLabels = ['Q', 'W', 'E', 'R'] as const;

function readableSpellDescription(spell: Spell): string {
  const description = normalizeDataDragonText(spell.description);
  if (/{{[^}]+}}/.test(spell.tooltip)) return description;
  const tooltip = normalizeDataDragonText(spell.tooltip);
  return tooltip ? `${description}\n\n${tooltip}` : description;
}

interface ChampionDetailScreenProps {
  championId: string;
}

export function ChampionDetailScreen({ championId }: ChampionDetailScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const championQuery = useChampionDetailQuery(championId);
  const champion = championQuery.data?.champion;
  const visibleSkins = useMemo(
    () => champion?.skins.filter((skin) => skin.parentSkin === null) ?? [],
    [champion?.skins],
  );

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/champions');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('champion.back')}
          hitSlop={8}
          onPress={goBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('champion.detailTitle')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {championQuery.isPending ? (
        <LoadingState />
      ) : championQuery.isError ? (
        <ErrorState error={championQuery.error} onRetry={() => void championQuery.refetch()} />
      ) : champion ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <ChampionImage
            source={championSplashUrl(champion.id)}
            accessibilityLabel={champion.name}
            style={styles.heroImage}
            priority="high"
          />

          <View style={styles.championCopy}>
            <Text style={styles.championName}>{champion.name}</Text>
            {champion.tags.length > 0 && (
              <View style={styles.roleTags}>
                {champion.tags.map((tag) => (
                  <Text key={tag} style={styles.roleTag}>
                    {tag}
                  </Text>
                ))}
              </View>
            )}
            {champion.title.length > 0 && (
              <Text style={styles.championTitle}>{champion.title}</Text>
            )}
            {champion.lore.length > 0 && (
              <Text style={styles.lore}>{normalizeDataDragonText(champion.lore)}</Text>
            )}
          </View>

          <View style={styles.skillList}>
            {champion.passive && (
              <View style={styles.skillRow}>
                <View style={styles.skillIconColumn}>
                  <ChampionImage
                    source={passiveImageUrl(
                      champion.passive.image.full,
                      championQuery.data.patchVersion,
                    )}
                    accessibilityLabel={champion.passive.name}
                    style={styles.skillImage}
                  />
                  <Text style={[styles.skillLabel, styles.passiveLabel]}>
                    {t('champion.passive')}
                  </Text>
                </View>
                <View style={styles.skillCopy}>
                  <Text style={styles.skillName}>{champion.passive.name}</Text>
                  <Text style={styles.skillDescription}>
                    {normalizeDataDragonText(champion.passive.description)}
                  </Text>
                </View>
              </View>
            )}

            {champion.spells.map((spell, index) => (
              <View key={`${spell.name}-${index}`} style={styles.skillRow}>
                <View style={styles.skillIconColumn}>
                  <ChampionImage
                    source={spellImageUrl(spell.image.full, championQuery.data.patchVersion)}
                    accessibilityLabel={spell.name}
                    style={styles.skillImage}
                  />
                  <Text style={styles.skillLabel}>{spellLabels[index] ?? ''}</Text>
                </View>
                <View style={styles.skillCopy}>
                  <Text style={styles.skillName}>{spell.name}</Text>
                  <Text style={styles.skillDescription}>{readableSpellDescription(spell)}</Text>
                </View>
              </View>
            ))}
          </View>

          <SkinCarousel championId={champion.id} skins={visibleSkins} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  backButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    marginTop: -4,
    color: colors.text,
    fontSize: 42,
    fontWeight: '200',
    lineHeight: 46,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 56,
  },
  pressed: {
    opacity: 0.55,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 885 / 522,
  },
  championCopy: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  championName: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
  },
  roleTags: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleTag: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 16,
    overflow: 'hidden',
    color: colors.text,
    backgroundColor: colors.role,
    fontSize: 12,
    fontWeight: '700',
  },
  championTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  lore: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 23,
  },
  skillList: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  skillRow: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    gap: 12,
  },
  skillIconColumn: {
    width: 58,
    alignItems: 'center',
  },
  skillImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  skillLabel: {
    minWidth: 24,
    minHeight: 22,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    color: colors.text,
    backgroundColor: colors.skill,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  passiveLabel: {
    minWidth: 50,
  },
  skillCopy: {
    flex: 1,
    paddingTop: 1,
  },
  skillName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  skillDescription: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 19,
  },
});

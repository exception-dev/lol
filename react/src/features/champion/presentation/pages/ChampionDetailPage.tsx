'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { championSplashUrl, passiveImageUrl, spellImageUrl } from '@/core/config/app-config';
import { normalizeDataDragonText } from '@/core/text/data-dragon-text';
import { ChampionImage } from '@/features/champion/presentation/components/ChampionImage';
import { ErrorState } from '@/features/champion/presentation/components/ErrorState';
import { LoadingState } from '@/features/champion/presentation/components/LoadingState';
import { SkinCarousel } from '@/features/champion/presentation/components/SkinCarousel';
import { championDetailQueryOptions } from '@/features/champion/presentation/queries/champion.queries';
import { useChampionSearchStore } from '@/features/champion/presentation/stores/champion-search.store';

import styles from './ChampionDetailPage.module.css';

const spellLabels = ['Q', 'W', 'E', 'R'] as const;

export function ChampionDetailPage({ championId }: { championId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const clearSearch = useChampionSearchStore((state) => state.clear);
  const championQuery = useQuery(championDetailQueryOptions(championId));
  const champion = championQuery.data?.champion;
  const patchVersion = championQuery.data?.patchVersion ?? '';
  const visibleSkins = useMemo(
    () => champion?.skins.filter((skin) => skin.parentSkin === null) ?? [],
    [champion?.skins],
  );

  useEffect(() => {
    clearSearch();
  }, [clearSearch]);

  function goBack() {
    const referrerIsThisSite =
      document.referrer.length > 0 && new URL(document.referrer).origin === window.location.origin;
    if (window.history.length > 1 && referrerIsThisSite) {
      router.back();
    } else {
      router.replace('/champions');
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <button type="button" aria-label={t('champion.back')} onClick={goBack}>
          <span aria-hidden="true" />
        </button>
        <h1>{t('champion.detailTitle')}</h1>
        <span aria-hidden="true" />
      </header>

      {championQuery.isPending ? (
        <LoadingState />
      ) : championQuery.isError ? (
        <ErrorState error={championQuery.error} onRetry={() => void championQuery.refetch()} />
      ) : champion ? (
        <article className={styles.content}>
          <div className={styles.hero}>
            <ChampionImage
              src={championSplashUrl(champion.id)}
              alt={champion.name}
              sizes="(max-width: 600px) 100vw, 600px"
              eager
            />
          </div>

          <div className={styles.copy}>
            <h2>{champion.name}</h2>
            {champion.tags.length > 0 && (
              <div className={styles.tags}>
                {champion.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
            {champion.title && <h3>{champion.title}</h3>}
            {champion.lore && (
              <p className={styles.lore}>{normalizeDataDragonText(champion.lore)}</p>
            )}
          </div>

          {(champion.passive || champion.spells.length > 0) && (
            <section className={styles.skills}>
              {champion.passive && (
                <article className={styles.skill}>
                  <div className={styles.iconColumn}>
                    <div className={styles.skillImage}>
                      <ChampionImage
                        src={passiveImageUrl(champion.passive.image.full, patchVersion)}
                        alt={champion.passive.name}
                        sizes="50px"
                      />
                    </div>
                    <span className={`${styles.skillLabel} ${styles.passiveLabel}`}>
                      {t('champion.passive')}
                    </span>
                  </div>
                  <div className={styles.skillCopy}>
                    <h3>{champion.passive.name}</h3>
                    <p>{normalizeDataDragonText(champion.passive.description)}</p>
                  </div>
                </article>
              )}

              {champion.spells.map((spell, index) => (
                <article key={`${spell.name}-${index}`} className={styles.skill}>
                  <div className={styles.iconColumn}>
                    <div className={styles.skillImage}>
                      <ChampionImage
                        src={spellImageUrl(spell.image.full, patchVersion)}
                        alt={spell.name}
                        sizes="50px"
                      />
                    </div>
                    <span className={styles.skillLabel}>{spellLabels[index] ?? ''}</span>
                  </div>
                  <div className={styles.skillCopy}>
                    <h3>{spell.name}</h3>
                    <p>{spellDescription(spell.description, spell.tooltip)}</p>
                  </div>
                </article>
              ))}
            </section>
          )}

          <SkinCarousel championId={champion.id} skins={visibleSkins} />
        </article>
      ) : null}
    </section>
  );
}

function spellDescription(description: string, tooltip: string): string {
  const normalizedDescription = normalizeDataDragonText(description);
  if (/{{[^}]+}}/.test(tooltip)) return normalizedDescription;

  const normalizedTooltip = normalizeDataDragonText(tooltip);
  return normalizedTooltip
    ? `${normalizedDescription}\n\n${normalizedTooltip}`
    : normalizedDescription;
}

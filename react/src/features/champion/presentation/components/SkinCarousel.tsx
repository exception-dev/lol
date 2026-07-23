'use client';

import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { championSkinUrl } from '@/core/config/app-config';
import type { Skin } from '@/features/champion/domain/entities/champion';
import { ChampionImage } from '@/features/champion/presentation/components/ChampionImage';

import styles from './SkinCarousel.module.css';

interface SkinCarouselProps {
  championId: string;
  skins: readonly Skin[];
}

export function SkinCarousel({ championId, skins }: SkinCarouselProps) {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll<HTMLElement>('[data-skin-card]'));
    const scrollerRect = scroller.getBoundingClientRect();
    const viewportCenter = scrollerRect.left + scrollerRect.width / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      const distanceRatio = Math.min(distance / (scroller.clientWidth * 0.72), 1);
      const scale = 1 - distanceRatio * 0.14;
      const opacity = 1 - distanceRatio * 0.45;

      card.style.setProperty('--skin-scale', scale.toFixed(3));
      card.style.setProperty('--skin-opacity', opacity.toFixed(3));

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      updateTransforms();
      animationFrameRef.current = null;
    });
  }, [updateTransforms]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>('[data-skin-card]');
    if (!scroller || !card) return;

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const gap = Number.parseFloat(window.getComputedStyle(scroller).columnGap) || 0;

    scroller.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(scroller);
    updateTransforms();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [scheduleUpdate, skins.length, updateTransforms]);

  if (skins.length === 0) return null;

  return (
    <section className={styles.section} aria-label={t('champion.skins')}>
      <h2 className="sr-only">{t('champion.skins')}</h2>
      <div
        ref={scrollerRef}
        className={styles.scroller}
        data-skin-scroller
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={scheduleUpdate}
      >
        {skins.map((skin, index) => (
          <article
            key={skin.id}
            data-skin-card
            className={`${styles.card} ${index === activeIndex ? styles.active : ''}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <ChampionImage
              src={championSkinUrl(championId, skin.number)}
              alt={skin.name}
              sizes="(max-width: 600px) 72vw, 432px"
            />
            <span>{skin.name}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { appConfig } from '@/core/config/app-config';
import { patchVersionQueryOptions } from '@/features/champion/presentation/queries/champion.queries';

import styles from './SplashPage.module.css';

export function SplashPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const title = t('app.splashTitle');
  const [visibleLength, setVisibleLength] = useState(0);
  const patchQuery = useQuery(patchVersionQueryOptions);

  useEffect(() => {
    if (visibleLength >= title.length) return;
    const timer = window.setTimeout(
      () => setVisibleLength((length) => length + 1),
      appConfig.splashCharacterDelayMs,
    );
    return () => window.clearTimeout(timer);
  }, [title.length, visibleLength]);

  useEffect(() => {
    if (visibleLength < title.length || patchQuery.isPending) return;
    const timer = window.setTimeout(() => router.replace('/champions'), 180);
    return () => window.clearTimeout(timer);
  }, [patchQuery.isPending, router, title.length, visibleLength]);

  return (
    <section className={styles.page} aria-label={title}>
      <h1>{title.slice(0, visibleLength)}</h1>
    </section>
  );
}

'use client';

import { useTranslation } from 'react-i18next';

import { ChampionNotFoundError, DataError, NetworkError } from '@/core/errors/app-error';

import styles from './StateView.module.css';

interface ErrorStateProps {
  error: unknown;
  onRetry(): void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  const message =
    error instanceof ChampionNotFoundError
      ? t('error.notFound', { championId: error.championId })
      : error instanceof NetworkError
        ? t('error.network')
        : error instanceof DataError
          ? t('error.data')
          : t('error.unknown');

  return (
    <div className={styles.state} role="alert">
      <p>{message}</p>
      <button type="button" className="primary-button" onClick={onRetry}>
        {t('common.retry')}
      </button>
    </div>
  );
}

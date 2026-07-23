'use client';

import { useTranslation } from 'react-i18next';

import styles from './StateView.module.css';

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className={styles.state} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}

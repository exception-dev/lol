'use client';

import { useTranslation } from 'react-i18next';

import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange(value: string): void;
  onClear(): void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <label className={styles.field}>
      <span className={styles.icon} aria-hidden="true" />
      <span className="sr-only">{t('champion.searchHint')}</span>
      <input
        value={value}
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder={t('champion.searchHint')}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" aria-label={t('champion.clearSearch')} onClick={onClear}>
          ×
        </button>
      )}
    </label>
  );
}

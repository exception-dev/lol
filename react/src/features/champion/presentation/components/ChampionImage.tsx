'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './ChampionImage.module.css';

interface ChampionImageProps {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  fit?: 'cover' | 'contain';
}

export function ChampionImage({
  src,
  alt,
  sizes,
  eager = false,
  fit = 'cover',
}: ChampionImageProps) {
  const { t } = useTranslation();
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const isLoaded = loadedSource === src;
  const hasError = failedSource === src;

  return (
    <div className={`${styles.root} ${isLoaded ? styles.loaded : ''}`}>
      {!isLoaded && !hasError && <span className={styles.placeholder} aria-hidden="true" />}
      {hasError ? (
        <span className={styles.error} role="img" aria-label={t('error.image')}>
          !
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={eager}
          className={styles.image}
          style={{ objectFit: fit }}
          onLoad={() => setLoadedSource(src)}
          onError={() => setFailedSource(src)}
        />
      )}
    </div>
  );
}

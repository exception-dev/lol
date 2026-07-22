import { create } from 'axios';

import { appConfig } from '@/core/config/app-config';

export const httpClient = create({
  baseURL: appConfig.dataDragonBaseUrl,
  timeout: appConfig.requestTimeoutMs,
  headers: {
    Accept: 'application/json',
  },
});

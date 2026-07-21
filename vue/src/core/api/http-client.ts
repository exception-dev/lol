import axios from 'axios'

import { appConfig } from '@/core/config/app-config'

export const httpClient = axios.create({
  baseURL: appConfig.dataDragonBaseUrl,
  timeout: appConfig.requestTimeoutMs,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
})

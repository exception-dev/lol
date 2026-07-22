import type { AxiosInstance } from 'axios';

import { appConfig } from '@/core/config/app-config';

export class DataDragonPatchVersionRemoteDataSource {
  constructor(private readonly client: AxiosInstance) {}

  async getVersions(): Promise<unknown> {
    const response = await this.client.get('/api/versions.json', {
      timeout: appConfig.startupTimeoutMs,
    });
    return response.data;
  }
}

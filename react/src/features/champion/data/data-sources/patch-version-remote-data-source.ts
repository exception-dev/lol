import type { AxiosInstance } from 'axios';
import { z } from 'zod';

const patchVersionsSchema = z.array(z.string()).min(1);

export interface PatchVersionRemoteDataSource {
  fetchLatestVersion(): Promise<string>;
}

export class DataDragonPatchVersionRemoteDataSource implements PatchVersionRemoteDataSource {
  constructor(private readonly client: AxiosInstance) {}

  async fetchLatestVersion(): Promise<string> {
    const response = await this.client.get<unknown>('/api/versions.json');
    const latestVersion = patchVersionsSchema.parse(response.data)[0];
    if (!latestVersion) {
      throw new Error('Data Dragon returned an empty patch version list');
    }
    return latestVersion;
  }
}

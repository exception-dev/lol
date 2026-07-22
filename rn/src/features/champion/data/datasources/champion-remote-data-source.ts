import type { AxiosInstance } from 'axios';

export class DataDragonChampionRemoteDataSource {
  constructor(private readonly client: AxiosInstance) {}

  async getList(patchVersion: string, locale: string): Promise<unknown> {
    const response = await this.client.get(`/cdn/${patchVersion}/data/${locale}/champion.json`);
    return response.data;
  }

  async getById(championId: string, patchVersion: string, locale: string): Promise<unknown> {
    const response = await this.client.get(
      `/cdn/${patchVersion}/data/${locale}/champion/${encodeURIComponent(championId)}.json`,
    );
    return response.data;
  }
}

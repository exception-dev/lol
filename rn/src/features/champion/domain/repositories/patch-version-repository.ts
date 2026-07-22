export interface PatchVersionRepository {
  getLatest(): Promise<string>;
}

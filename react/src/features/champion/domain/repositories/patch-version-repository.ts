export interface PatchVersionRepository {
  resolveLatestVersion(): Promise<string>;
}

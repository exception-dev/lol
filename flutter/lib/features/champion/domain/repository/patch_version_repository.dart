abstract interface class PatchVersionRepository {
  Future<String> getPatchVersion();

  Future<String> refreshLatestPatchVersion();
}

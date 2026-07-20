import 'package:lol_champion/features/champion/domain/repository/patch_version_repository.dart';

class RefreshLatestPatchVersion {
  const RefreshLatestPatchVersion(this._repository);

  final PatchVersionRepository _repository;

  Future<String> call() => _repository.refreshLatestPatchVersion();
}

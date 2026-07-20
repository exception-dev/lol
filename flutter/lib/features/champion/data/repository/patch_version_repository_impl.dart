import 'package:dio/dio.dart';
import 'package:lol_champion/core/error/app_exception.dart';
import 'package:lol_champion/features/champion/data/datasource/patch_version_local_data_source.dart';
import 'package:lol_champion/features/champion/data/datasource/patch_version_remote_data_source.dart';
import 'package:lol_champion/features/champion/domain/repository/patch_version_repository.dart';

class PatchVersionRepositoryImpl implements PatchVersionRepository {
  const PatchVersionRepositoryImpl(this._remote, this._local);

  final PatchVersionRemoteDataSource _remote;
  final PatchVersionLocalDataSource _local;

  @override
  Future<String> getPatchVersion() => _local.read();

  @override
  Future<String> refreshLatestPatchVersion() async {
    try {
      final latestVersion = await _remote.getLatestPatchVersion();
      if (latestVersion == null) {
        return _local.read();
      }
      await _local.write(latestVersion);
      return latestVersion;
    } on DioException catch (error) {
      throw NetworkException(error);
    } on Object catch (error) {
      throw DataException(error);
    }
  }
}

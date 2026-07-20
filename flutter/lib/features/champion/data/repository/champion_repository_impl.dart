import 'package:dio/dio.dart';
import 'package:lol_champion/core/error/app_exception.dart';
import 'package:lol_champion/features/champion/data/datasource/champion_remote_data_source.dart';
import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:lol_champion/features/champion/domain/repository/champion_repository.dart';
import 'package:lol_champion/features/champion/domain/repository/patch_version_repository.dart';

class ChampionRepositoryImpl implements ChampionRepository {
  const ChampionRepositoryImpl(this._remote, this._patchVersionRepository);

  final ChampionRemoteDataSource _remote;
  final PatchVersionRepository _patchVersionRepository;

  @override
  Future<List<Champion>> getChampionList() async {
    try {
      final version = await _patchVersionRepository.getPatchVersion();
      final response = await _remote.getChampionList(version);
      final champions =
          response.data.values.map((champion) => champion.toEntity()).toList()
            ..sort((a, b) => a.name.compareTo(b.name));
      return List.unmodifiable(champions);
    } on DioException catch (error) {
      throw NetworkException(error);
    } on AppException {
      rethrow;
    } on Object catch (error) {
      throw DataException(error);
    }
  }

  @override
  Future<Champion> getChampion(String championId) async {
    try {
      final version = await _patchVersionRepository.getPatchVersion();
      final response = await _remote.getChampion(version, championId);
      final champion = response.data[championId];
      if (champion == null) {
        throw ChampionNotFoundException(championId);
      }
      return champion.toEntity();
    } on DioException catch (error) {
      throw NetworkException(error);
    } on AppException {
      rethrow;
    } on Object catch (error) {
      throw DataException(error);
    }
  }
}

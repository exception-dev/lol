import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:lol_champion/features/champion/domain/repository/champion_repository.dart';

class GetChampion {
  const GetChampion(this._repository);

  final ChampionRepository _repository;

  Future<Champion> call(String championId) =>
      _repository.getChampion(championId);
}

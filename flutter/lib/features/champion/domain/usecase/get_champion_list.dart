import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:lol_champion/features/champion/domain/repository/champion_repository.dart';

class GetChampionList {
  const GetChampionList(this._repository);

  final ChampionRepository _repository;

  Future<List<Champion>> call() => _repository.getChampionList();
}

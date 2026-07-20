import 'package:lol_champion/features/champion/domain/entity/champion.dart';

abstract interface class ChampionRepository {
  Future<List<Champion>> getChampionList();

  Future<Champion> getChampion(String championId);
}

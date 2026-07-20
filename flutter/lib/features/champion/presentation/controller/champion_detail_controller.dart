import 'package:lol_champion/features/champion/data/provider/champion_data_providers.dart';
import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'champion_detail_controller.g.dart';

class ChampionDetailState {
  const ChampionDetailState({
    required this.champion,
    required this.patchVersion,
  });

  final Champion champion;
  final String patchVersion;
}

@riverpod
class ChampionDetailController extends _$ChampionDetailController {
  @override
  Future<ChampionDetailState> build(String championId) async {
    final getChampion = ref.watch(getChampionProvider);
    final getPatchVersion = ref.watch(getPatchVersionProvider);
    final values = await Future.wait<Object>([
      getChampion(championId),
      getPatchVersion(),
    ]);

    return ChampionDetailState(
      champion: values[0] as Champion,
      patchVersion: values[1] as String,
    );
  }

  Future<void> retry() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => build(championId));
  }
}

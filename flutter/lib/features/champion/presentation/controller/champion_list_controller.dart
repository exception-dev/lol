import 'dart:async';

import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/features/champion/data/provider/champion_data_providers.dart';
import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'champion_list_controller.g.dart';

@riverpod
class ChampionListController extends _$ChampionListController {
  @override
  Future<List<Champion>> build() => ref.watch(getChampionListProvider)();

  Future<void> retry() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(getChampionListProvider)());
  }
}

class ChampionSearchState {
  const ChampionSearchState({this.query = '', this.appliedQuery = ''});

  final String query;
  final String appliedQuery;

  ChampionSearchState copyWith({String? query, String? appliedQuery}) =>
      ChampionSearchState(
        query: query ?? this.query,
        appliedQuery: appliedQuery ?? this.appliedQuery,
      );
}

@riverpod
class ChampionSearchController extends _$ChampionSearchController {
  Timer? _debounce;

  @override
  ChampionSearchState build() {
    ref.onDispose(() => _debounce?.cancel());
    return const ChampionSearchState();
  }

  void updateQuery(String query) {
    _debounce?.cancel();
    state = state.copyWith(query: query);

    if (query.trim().isEmpty) {
      state = state.copyWith(appliedQuery: '');
      return;
    }

    _debounce = Timer(AppConstants.searchDebounce, () {
      state = state.copyWith(appliedQuery: query.trim());
    });
  }

  void clear() {
    _debounce?.cancel();
    state = const ChampionSearchState();
  }
}

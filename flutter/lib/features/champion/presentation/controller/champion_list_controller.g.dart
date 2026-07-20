// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'champion_list_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ChampionListController)
final championListControllerProvider = ChampionListControllerProvider._();

final class ChampionListControllerProvider
    extends $AsyncNotifierProvider<ChampionListController, List<Champion>> {
  ChampionListControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'championListControllerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$championListControllerHash();

  @$internal
  @override
  ChampionListController create() => ChampionListController();
}

String _$championListControllerHash() =>
    r'bc952857240c738324db30315d31c6867a9108e2';

abstract class _$ChampionListController extends $AsyncNotifier<List<Champion>> {
  FutureOr<List<Champion>> build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<AsyncValue<List<Champion>>, List<Champion>>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<List<Champion>>, List<Champion>>,
              AsyncValue<List<Champion>>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}

@ProviderFor(ChampionSearchController)
final championSearchControllerProvider = ChampionSearchControllerProvider._();

final class ChampionSearchControllerProvider
    extends $NotifierProvider<ChampionSearchController, ChampionSearchState> {
  ChampionSearchControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'championSearchControllerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$championSearchControllerHash();

  @$internal
  @override
  ChampionSearchController create() => ChampionSearchController();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ChampionSearchState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ChampionSearchState>(value),
    );
  }
}

String _$championSearchControllerHash() =>
    r'e17ae0235597d492a5c1ce2d66b26e201f549e10';

abstract class _$ChampionSearchController
    extends $Notifier<ChampionSearchState> {
  ChampionSearchState build();
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref = this.ref as $Ref<ChampionSearchState, ChampionSearchState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ChampionSearchState, ChampionSearchState>,
              ChampionSearchState,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, build);
  }
}

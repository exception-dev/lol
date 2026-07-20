// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'champion_detail_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(ChampionDetailController)
final championDetailControllerProvider = ChampionDetailControllerFamily._();

final class ChampionDetailControllerProvider
    extends
        $AsyncNotifierProvider<ChampionDetailController, ChampionDetailState> {
  ChampionDetailControllerProvider._({
    required ChampionDetailControllerFamily super.from,
    required String super.argument,
  }) : super(
         retry: null,
         name: r'championDetailControllerProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$championDetailControllerHash();

  @override
  String toString() {
    return r'championDetailControllerProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  ChampionDetailController create() => ChampionDetailController();

  @override
  bool operator ==(Object other) {
    return other is ChampionDetailControllerProvider &&
        other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$championDetailControllerHash() =>
    r'de9c0db9068a5ef3b83df190d4f20b5aa35527c4';

final class ChampionDetailControllerFamily extends $Family
    with
        $ClassFamilyOverride<
          ChampionDetailController,
          AsyncValue<ChampionDetailState>,
          ChampionDetailState,
          FutureOr<ChampionDetailState>,
          String
        > {
  ChampionDetailControllerFamily._()
    : super(
        retry: null,
        name: r'championDetailControllerProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  ChampionDetailControllerProvider call(String championId) =>
      ChampionDetailControllerProvider._(argument: championId, from: this);

  @override
  String toString() => r'championDetailControllerProvider';
}

abstract class _$ChampionDetailController
    extends $AsyncNotifier<ChampionDetailState> {
  late final _$args = ref.$arg as String;
  String get championId => _$args;

  FutureOr<ChampionDetailState> build(String championId);
  @$mustCallSuper
  @override
  WhenComplete runBuild() {
    final ref =
        this.ref as $Ref<AsyncValue<ChampionDetailState>, ChampionDetailState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<ChampionDetailState>, ChampionDetailState>,
              AsyncValue<ChampionDetailState>,
              Object?,
              Object?
            >;
    return element.handleCreate(ref, () => build(_$args));
  }
}

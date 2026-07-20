import 'package:flutter_test/flutter_test.dart';
import 'package:lol_champion/core/error/app_exception.dart';
import 'package:lol_champion/features/champion/data/datasource/champion_remote_data_source.dart';
import 'package:lol_champion/features/champion/data/dto/champion_dto.dart';
import 'package:lol_champion/features/champion/data/repository/champion_repository_impl.dart';
import 'package:lol_champion/features/champion/domain/repository/patch_version_repository.dart';

void main() {
  group('ChampionRepositoryImpl', () {
    test('sorts the champion list by name', () async {
      final repository = ChampionRepositoryImpl(
        _FakeChampionRemoteDataSource(
          listResponse: ChampionResponseDto(
            version: 'test',
            data: {
              'Zed': _champion('Zed', '제드'),
              'Ahri': _champion('Ahri', '아리'),
            },
          ),
        ),
        _FakePatchVersionRepository(),
      );

      final champions = await repository.getChampionList();

      expect(champions.map((champion) => champion.name), ['아리', '제드']);
    });

    test('throws a domain error when a champion is missing', () async {
      final repository = ChampionRepositoryImpl(
        _FakeChampionRemoteDataSource(),
        _FakePatchVersionRepository(),
      );

      expect(
        () => repository.getChampion('Unknown'),
        throwsA(isA<ChampionNotFoundException>()),
      );
    });

    test('returns champion detail by id', () async {
      final repository = ChampionRepositoryImpl(
        _FakeChampionRemoteDataSource(
          detailResponse: ChampionResponseDto(
            version: 'test',
            data: {'Ahri': _champion('Ahri', '아리')},
          ),
        ),
        _FakePatchVersionRepository(),
      );

      final champion = await repository.getChampion('Ahri');

      expect(champion.id, 'Ahri');
      expect(champion.name, '아리');
    });
  });
}

ChampionDto _champion(String id, String name) => ChampionDto(
  id: id,
  name: name,
  title: '',
  lore: '',
  tags: const [],
  skins: const [],
  spells: const [],
);

class _FakeChampionRemoteDataSource implements ChampionRemoteDataSource {
  _FakeChampionRemoteDataSource({
    this.listResponse = const ChampionResponseDto(version: 'test', data: {}),
    this.detailResponse = const ChampionResponseDto(version: 'test', data: {}),
  });

  final ChampionResponseDto listResponse;
  final ChampionResponseDto detailResponse;

  @override
  Future<ChampionResponseDto> getChampionList(String patchVersion) async =>
      listResponse;

  @override
  Future<ChampionResponseDto> getChampion(
    String patchVersion,
    String championId,
  ) async => detailResponse;
}

class _FakePatchVersionRepository implements PatchVersionRepository {
  @override
  Future<String> getPatchVersion() async => 'test';

  @override
  Future<String> refreshLatestPatchVersion() async => 'test';
}

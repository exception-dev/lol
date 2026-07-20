import 'package:lol_champion/core/network/dio_provider.dart';
import 'package:lol_champion/core/storage/secure_storage_provider.dart';
import 'package:lol_champion/features/champion/data/datasource/champion_remote_data_source.dart';
import 'package:lol_champion/features/champion/data/datasource/patch_version_local_data_source.dart';
import 'package:lol_champion/features/champion/data/datasource/patch_version_remote_data_source.dart';
import 'package:lol_champion/features/champion/data/repository/champion_repository_impl.dart';
import 'package:lol_champion/features/champion/data/repository/patch_version_repository_impl.dart';
import 'package:lol_champion/features/champion/domain/repository/champion_repository.dart';
import 'package:lol_champion/features/champion/domain/repository/patch_version_repository.dart';
import 'package:lol_champion/features/champion/domain/usecase/get_champion.dart';
import 'package:lol_champion/features/champion/domain/usecase/get_champion_list.dart';
import 'package:lol_champion/features/champion/domain/usecase/get_patch_version.dart';
import 'package:lol_champion/features/champion/domain/usecase/refresh_latest_patch_version.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'champion_data_providers.g.dart';

@Riverpod(keepAlive: true)
ChampionRemoteDataSource championRemoteDataSource(Ref ref) =>
    ChampionRemoteDataSource(ref.watch(dioProvider));

@Riverpod(keepAlive: true)
PatchVersionRemoteDataSource patchVersionRemoteDataSource(Ref ref) =>
    PatchVersionRemoteDataSource(ref.watch(dioProvider));

@Riverpod(keepAlive: true)
PatchVersionLocalDataSource patchVersionLocalDataSource(Ref ref) =>
    PatchVersionLocalDataSource(ref.watch(secureStorageProvider));

@Riverpod(keepAlive: true)
PatchVersionRepository patchVersionRepository(Ref ref) =>
    PatchVersionRepositoryImpl(
      ref.watch(patchVersionRemoteDataSourceProvider),
      ref.watch(patchVersionLocalDataSourceProvider),
    );

@Riverpod(keepAlive: true)
ChampionRepository championRepository(Ref ref) => ChampionRepositoryImpl(
  ref.watch(championRemoteDataSourceProvider),
  ref.watch(patchVersionRepositoryProvider),
);

@Riverpod(keepAlive: true)
GetChampionList getChampionList(Ref ref) =>
    GetChampionList(ref.watch(championRepositoryProvider));

@Riverpod(keepAlive: true)
GetChampion getChampion(Ref ref) =>
    GetChampion(ref.watch(championRepositoryProvider));

@Riverpod(keepAlive: true)
GetPatchVersion getPatchVersion(Ref ref) =>
    GetPatchVersion(ref.watch(patchVersionRepositoryProvider));

@Riverpod(keepAlive: true)
RefreshLatestPatchVersion refreshLatestPatchVersion(Ref ref) =>
    RefreshLatestPatchVersion(ref.watch(patchVersionRepositoryProvider));

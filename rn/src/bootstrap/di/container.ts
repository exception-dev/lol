import { httpClient } from '@/core/api/http-client';
import { ExpoSecureKeyValueStorage } from '@/core/storage/key-value-storage';
import { DataDragonChampionRemoteDataSource } from '@/features/champion/data/datasources/champion-remote-data-source';
import { SecurePatchVersionLocalDataSource } from '@/features/champion/data/datasources/patch-version-local-data-source';
import { DataDragonPatchVersionRemoteDataSource } from '@/features/champion/data/datasources/patch-version-remote-data-source';
import { DataDragonChampionRepository } from '@/features/champion/data/repositories/champion-repository.impl';
import { ResilientPatchVersionRepository } from '@/features/champion/data/repositories/patch-version-repository.impl';
import { GetChampion } from '@/features/champion/domain/usecases/get-champion';
import { GetChampionList } from '@/features/champion/domain/usecases/get-champion-list';
import { InitializePatchVersion } from '@/features/champion/domain/usecases/initialize-patch-version';

const secureStorage = new ExpoSecureKeyValueStorage();
const championRemoteDataSource = new DataDragonChampionRemoteDataSource(httpClient);
const patchVersionRemoteDataSource = new DataDragonPatchVersionRemoteDataSource(httpClient);
const patchVersionLocalDataSource = new SecurePatchVersionLocalDataSource(secureStorage);

const championRepository = new DataDragonChampionRepository(championRemoteDataSource);
const patchVersionRepository = new ResilientPatchVersionRepository(
  patchVersionRemoteDataSource,
  patchVersionLocalDataSource,
);

export const championDependencies = {
  getChampionList: new GetChampionList(championRepository),
  getChampion: new GetChampion(championRepository),
  initializePatchVersion: new InitializePatchVersion(patchVersionRepository),
} as const;

import { httpClient } from '@/core/api/http-client';
import { BrowserKeyValueStorage } from '@/core/storage/key-value-storage';
import { DataDragonChampionRemoteDataSource } from '@/features/champion/data/data-sources/champion-remote-data-source';
import { BrowserPatchVersionLocalDataSource } from '@/features/champion/data/data-sources/patch-version-local-data-source';
import { DataDragonPatchVersionRemoteDataSource } from '@/features/champion/data/data-sources/patch-version-remote-data-source';
import { DataDragonChampionRepository } from '@/features/champion/data/repositories/champion-repository.impl';
import { ResilientPatchVersionRepository } from '@/features/champion/data/repositories/patch-version-repository.impl';
import { GetChampionList } from '@/features/champion/domain/use-cases/get-champion-list';
import { GetChampion } from '@/features/champion/domain/use-cases/get-champion';
import { InitializePatchVersion } from '@/features/champion/domain/use-cases/initialize-patch-version';

const browserStorage = new BrowserKeyValueStorage();
const championRemoteDataSource = new DataDragonChampionRemoteDataSource(httpClient);
const patchVersionRemoteDataSource = new DataDragonPatchVersionRemoteDataSource(httpClient);
const patchVersionLocalDataSource = new BrowserPatchVersionLocalDataSource(browserStorage);

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

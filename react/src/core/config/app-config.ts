export const appConfig = {
  dataDragonBaseUrl: 'https://ddragon.leagueoflegends.com',
  fallbackPatchVersion: '16.14.1',
  requestTimeoutMs: 20_000,
  searchDebounceMs: 200,
  splashCharacterDelayMs: 140,
  startupTimeoutMs: 8_000,
} as const;

export function championSplashUrl(championId: string): string {
  return `${appConfig.dataDragonBaseUrl}/cdn/img/champion/splash/${championId}_0.jpg`;
}

export function championSkinUrl(championId: string, skinNumber: number): string {
  return `${appConfig.dataDragonBaseUrl}/cdn/img/champion/loading/${championId}_${skinNumber}.jpg`;
}

export function spellImageUrl(fileName: string, patchVersion: string): string {
  return `${appConfig.dataDragonBaseUrl}/cdn/${patchVersion}/img/spell/${fileName}`;
}

export function passiveImageUrl(fileName: string, patchVersion: string): string {
  return `${appConfig.dataDragonBaseUrl}/cdn/${patchVersion}/img/passive/${fileName}`;
}

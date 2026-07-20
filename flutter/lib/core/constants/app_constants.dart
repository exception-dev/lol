abstract final class AppConstants {
  static const fallbackPatchVersion = '16.14.1';
  static const dataDragonBaseUrl = 'https://ddragon.leagueoflegends.com';
  static const locale = 'ko_KR';
  static const searchDebounce = Duration(milliseconds: 200);
  static const splashCharacterDelay = Duration(milliseconds: 300);
  static const startupNetworkLimit = Duration(seconds: 8);

  static String championSplashUrl(String championId) =>
      '$dataDragonBaseUrl/cdn/img/champion/splash/${championId}_0.jpg';

  static String championSkinUrl(String championId, int skinNumber) =>
      '$dataDragonBaseUrl/cdn/img/champion/loading/'
      '${championId}_$skinNumber.jpg';

  static String spellImageUrl(String fileName, String patchVersion) =>
      '$dataDragonBaseUrl/cdn/$patchVersion/img/spell/$fileName';

  static String passiveImageUrl(String fileName, String patchVersion) =>
      '$dataDragonBaseUrl/cdn/$patchVersion/img/passive/$fileName';
}

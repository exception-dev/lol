// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Korean (`ko`).
class AppLocalizationsKo extends AppLocalizations {
  AppLocalizationsKo([String locale = 'ko']) : super(locale);

  @override
  String get appName => 'LOL Champion';

  @override
  String get splashTitle => 'League of Legends';

  @override
  String get championSearchHint => '챔피언 이름을 검색하세요.';

  @override
  String get clearSearchTooltip => '검색어 지우기';

  @override
  String get emptyChampionList => '챔피언 정보가 없습니다.';

  @override
  String get emptySearchResults => '검색 결과가 없습니다.';

  @override
  String get championDetailTitle => '챔피언 상세';

  @override
  String get passiveSkillLabel => 'Passive';

  @override
  String get retry => '다시 시도';

  @override
  String get networkError => '네트워크 연결을 확인한 후 다시 시도해 주세요.';

  @override
  String get dataError => '챔피언 정보를 처리하지 못했습니다.';

  @override
  String championNotFoundError(String championId) {
    return '챔피언 정보를 찾을 수 없습니다: $championId';
  }

  @override
  String get unknownError => '알 수 없는 오류가 발생했습니다.';
}

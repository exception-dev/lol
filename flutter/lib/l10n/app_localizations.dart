import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ko.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[Locale('ko')];

  /// 애플리케이션 이름
  ///
  /// In ko, this message translates to:
  /// **'LOL Champion'**
  String get appName;

  /// 스플래시 화면 브랜드 제목
  ///
  /// In ko, this message translates to:
  /// **'League of Legends'**
  String get splashTitle;

  /// 챔피언 검색 입력란 안내 문구
  ///
  /// In ko, this message translates to:
  /// **'챔피언 이름을 검색하세요.'**
  String get championSearchHint;

  /// 검색어 초기화 버튼 설명
  ///
  /// In ko, this message translates to:
  /// **'검색어 지우기'**
  String get clearSearchTooltip;

  /// 챔피언 목록이 비어 있을 때 표시하는 문구
  ///
  /// In ko, this message translates to:
  /// **'챔피언 정보가 없습니다.'**
  String get emptyChampionList;

  /// 검색 결과가 없을 때 표시하는 문구
  ///
  /// In ko, this message translates to:
  /// **'검색 결과가 없습니다.'**
  String get emptySearchResults;

  /// 챔피언 상세 화면 제목
  ///
  /// In ko, this message translates to:
  /// **'챔피언 상세'**
  String get championDetailTitle;

  /// 챔피언 패시브 스킬 구분 표시
  ///
  /// In ko, this message translates to:
  /// **'Passive'**
  String get passiveSkillLabel;

  /// 실패한 작업을 다시 실행하는 버튼 문구
  ///
  /// In ko, this message translates to:
  /// **'다시 시도'**
  String get retry;

  /// 네트워크 통신 실패 문구
  ///
  /// In ko, this message translates to:
  /// **'네트워크 연결을 확인한 후 다시 시도해 주세요.'**
  String get networkError;

  /// 응답 데이터 처리 실패 문구
  ///
  /// In ko, this message translates to:
  /// **'챔피언 정보를 처리하지 못했습니다.'**
  String get dataError;

  /// 챔피언 상세 데이터를 찾지 못했을 때 표시하는 문구
  ///
  /// In ko, this message translates to:
  /// **'챔피언 정보를 찾을 수 없습니다: {championId}'**
  String championNotFoundError(String championId);

  /// 분류하지 못한 오류에 대한 기본 문구
  ///
  /// In ko, this message translates to:
  /// **'알 수 없는 오류가 발생했습니다.'**
  String get unknownError;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ko'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ko':
      return AppLocalizationsKo();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}

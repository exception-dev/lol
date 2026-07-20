import 'package:flutter_test/flutter_test.dart';
import 'package:lol_champion/l10n/app_localizations_ko.dart';

void main() {
  test('Korean localization exposes messages and placeholders', () {
    final localizations = AppLocalizationsKo();

    expect(localizations.retry, '다시 시도');
    expect(
      localizations.championNotFoundError('Ahri'),
      '챔피언 정보를 찾을 수 없습니다: Ahri',
    );
  });
}

import 'package:flutter_test/flutter_test.dart';
import 'package:lol_champion/core/constants/app_constants.dart';

void main() {
  test('Data Dragon image URLs match the expected paths', () {
    expect(
      AppConstants.championSplashUrl('Ahri'),
      'https://ddragon.leagueoflegends.com/cdn/img/champion/'
      'splash/Ahri_0.jpg',
    );
    expect(
      AppConstants.spellImageUrl('AhriQ.png', '16.14.1'),
      'https://ddragon.leagueoflegends.com/cdn/16.14.1/'
      'img/spell/AhriQ.png',
    );
  });
}

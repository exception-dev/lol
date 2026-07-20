import 'package:flutter_test/flutter_test.dart';
import 'package:lol_champion/features/champion/data/dto/champion_dto.dart';

void main() {
  test('parses champion detail JSON into a domain entity', () {
    final response = ChampionResponseDto.fromJson({
      'version': '16.14.1',
      'data': {
        'Ahri': {
          'id': 'Ahri',
          'name': '아리',
          'title': '구미호',
          'lore': '룬테라의 마법과 선천적으로 연결된 아리는...',
          'tags': ['Mage', 'Assassin'],
          'skins': [
            {'id': '103000', 'num': 0, 'name': 'default', 'chromas': false},
          ],
          'passive': {
            'name': '정기 흡수',
            'description': '스킬 적중 시 체력을 회복합니다.',
            'image': {'full': 'Ahri_Passive.png'},
          },
          'spells': [
            {
              'id': 'AhriQ',
              'name': '현혹의 구슬',
              'description': '구슬을 던집니다.',
              'tooltip': '마법 피해를 입힙니다.',
              'image': {'full': 'AhriQ.png'},
            },
          ],
        },
      },
    });

    final champion = response.data['Ahri']!.toEntity();

    expect(champion.id, 'Ahri');
    expect(champion.name, '아리');
    expect(champion.tags, ['Mage', 'Assassin']);
    expect(champion.passive?.image.full, 'Ahri_Passive.png');
    expect(champion.spells.single.id, 'AhriQ');
    expect(champion.skins.single.number, 0);
  });
}

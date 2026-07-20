import 'package:lol_champion/features/champion/domain/entity/passive.dart';
import 'package:lol_champion/features/champion/domain/entity/skin.dart';
import 'package:lol_champion/features/champion/domain/entity/spell.dart';

class Champion {
  const Champion({
    required this.id,
    required this.name,
    required this.title,
    required this.lore,
    required this.tags,
    required this.skins,
    required this.spells,
    required this.passive,
  });

  final String id;
  final String name;
  final String title;
  final String lore;
  final List<String> tags;
  final List<Skin> skins;
  final List<Spell> spells;
  final Passive? passive;
}

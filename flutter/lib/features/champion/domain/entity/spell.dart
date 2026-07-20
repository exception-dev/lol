import 'package:lol_champion/features/champion/domain/entity/champion_image.dart';

class Spell {
  const Spell({
    required this.id,
    required this.name,
    required this.description,
    required this.tooltip,
    required this.image,
  });

  final String id;
  final String name;
  final String description;
  final String tooltip;
  final ChampionImage image;
}

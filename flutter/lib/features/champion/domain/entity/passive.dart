import 'package:lol_champion/features/champion/domain/entity/champion_image.dart';

class Passive {
  const Passive({
    required this.name,
    required this.description,
    required this.image,
  });

  final String name;
  final String description;
  final ChampionImage image;
}

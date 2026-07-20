import 'package:json_annotation/json_annotation.dart';
import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:lol_champion/features/champion/domain/entity/champion_image.dart';
import 'package:lol_champion/features/champion/domain/entity/passive.dart';
import 'package:lol_champion/features/champion/domain/entity/skin.dart';
import 'package:lol_champion/features/champion/domain/entity/spell.dart';

part 'champion_dto.g.dart';

@JsonSerializable(createToJson: false)
class ChampionResponseDto {
  const ChampionResponseDto({required this.version, required this.data});

  @JsonKey(defaultValue: '')
  final String version;

  @JsonKey(defaultValue: <String, ChampionDto>{})
  final Map<String, ChampionDto> data;

  factory ChampionResponseDto.fromJson(Map<String, dynamic> json) =>
      _$ChampionResponseDtoFromJson(json);
}

@JsonSerializable(createToJson: false)
class ChampionDto {
  const ChampionDto({
    required this.id,
    required this.name,
    required this.title,
    required this.lore,
    required this.tags,
    required this.skins,
    required this.spells,
    this.passive,
  });

  @JsonKey(defaultValue: '')
  final String id;

  @JsonKey(defaultValue: '')
  final String name;

  @JsonKey(defaultValue: '')
  final String title;

  @JsonKey(defaultValue: '')
  final String lore;

  @JsonKey(defaultValue: <String>[])
  final List<String> tags;

  @JsonKey(defaultValue: <SkinDto>[])
  final List<SkinDto> skins;

  @JsonKey(defaultValue: <SpellDto>[])
  final List<SpellDto> spells;

  final PassiveDto? passive;

  factory ChampionDto.fromJson(Map<String, dynamic> json) =>
      _$ChampionDtoFromJson(json);

  Champion toEntity() => Champion(
    id: id,
    name: name,
    title: title,
    lore: lore,
    tags: List.unmodifiable(tags),
    skins: List.unmodifiable(skins.map((skin) => skin.toEntity())),
    spells: List.unmodifiable(spells.map((spell) => spell.toEntity())),
    passive: passive?.toEntity(),
  );
}

@JsonSerializable(createToJson: false)
class ChampionImageDto {
  const ChampionImageDto({required this.full});

  @JsonKey(defaultValue: '')
  final String full;

  factory ChampionImageDto.fromJson(Map<String, dynamic> json) =>
      _$ChampionImageDtoFromJson(json);

  ChampionImage toEntity() => ChampionImage(full: full);
}

@JsonSerializable(createToJson: false)
class PassiveDto {
  const PassiveDto({
    required this.name,
    required this.description,
    required this.image,
  });

  @JsonKey(defaultValue: '')
  final String name;

  @JsonKey(defaultValue: '')
  final String description;

  final ChampionImageDto image;

  factory PassiveDto.fromJson(Map<String, dynamic> json) =>
      _$PassiveDtoFromJson(json);

  Passive toEntity() =>
      Passive(name: name, description: description, image: image.toEntity());
}

@JsonSerializable(createToJson: false)
class SkinDto {
  const SkinDto({
    required this.id,
    required this.number,
    required this.name,
    required this.hasChromas,
    this.parentSkin,
  });

  @JsonKey(defaultValue: '')
  final String id;

  @JsonKey(name: 'num', defaultValue: 0)
  final int number;

  @JsonKey(defaultValue: '')
  final String name;

  @JsonKey(name: 'chromas', defaultValue: false)
  final bool hasChromas;

  final int? parentSkin;

  factory SkinDto.fromJson(Map<String, dynamic> json) =>
      _$SkinDtoFromJson(json);

  Skin toEntity() => Skin(
    id: id,
    number: number,
    name: name,
    hasChromas: hasChromas,
    parentSkin: parentSkin,
  );
}

@JsonSerializable(createToJson: false)
class SpellDto {
  const SpellDto({
    required this.id,
    required this.name,
    required this.description,
    required this.tooltip,
    required this.image,
  });

  @JsonKey(defaultValue: '')
  final String id;

  @JsonKey(defaultValue: '')
  final String name;

  @JsonKey(defaultValue: '')
  final String description;

  @JsonKey(defaultValue: '')
  final String tooltip;

  final ChampionImageDto image;

  factory SpellDto.fromJson(Map<String, dynamic> json) =>
      _$SpellDtoFromJson(json);

  Spell toEntity() => Spell(
    id: id,
    name: name,
    description: description,
    tooltip: tooltip,
    image: image.toEntity(),
  );
}

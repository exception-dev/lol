// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'champion_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChampionResponseDto _$ChampionResponseDtoFromJson(Map<String, dynamic> json) =>
    ChampionResponseDto(
      version: json['version'] as String? ?? '',
      data:
          (json['data'] as Map<String, dynamic>?)?.map(
            (k, e) =>
                MapEntry(k, ChampionDto.fromJson(e as Map<String, dynamic>)),
          ) ??
          {},
    );

ChampionDto _$ChampionDtoFromJson(Map<String, dynamic> json) => ChampionDto(
  id: json['id'] as String? ?? '',
  name: json['name'] as String? ?? '',
  title: json['title'] as String? ?? '',
  lore: json['lore'] as String? ?? '',
  tags:
      (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
  skins:
      (json['skins'] as List<dynamic>?)
          ?.map((e) => SkinDto.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
  spells:
      (json['spells'] as List<dynamic>?)
          ?.map((e) => SpellDto.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
  passive: json['passive'] == null
      ? null
      : PassiveDto.fromJson(json['passive'] as Map<String, dynamic>),
);

ChampionImageDto _$ChampionImageDtoFromJson(Map<String, dynamic> json) =>
    ChampionImageDto(full: json['full'] as String? ?? '');

PassiveDto _$PassiveDtoFromJson(Map<String, dynamic> json) => PassiveDto(
  name: json['name'] as String? ?? '',
  description: json['description'] as String? ?? '',
  image: ChampionImageDto.fromJson(json['image'] as Map<String, dynamic>),
);

SkinDto _$SkinDtoFromJson(Map<String, dynamic> json) => SkinDto(
  id: json['id'] as String? ?? '',
  number: (json['num'] as num?)?.toInt() ?? 0,
  name: json['name'] as String? ?? '',
  hasChromas: json['chromas'] as bool? ?? false,
  parentSkin: (json['parentSkin'] as num?)?.toInt(),
);

SpellDto _$SpellDtoFromJson(Map<String, dynamic> json) => SpellDto(
  id: json['id'] as String? ?? '',
  name: json['name'] as String? ?? '',
  description: json['description'] as String? ?? '',
  tooltip: json['tooltip'] as String? ?? '',
  image: ChampionImageDto.fromJson(json['image'] as Map<String, dynamic>),
);

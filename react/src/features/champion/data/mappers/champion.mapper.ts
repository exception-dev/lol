import type { Champion } from '@/features/champion/domain/entities/champion';

import type { ChampionDto } from '../schemas/champion-dto.schema';

export function toChampion(dto: ChampionDto): Champion {
  return {
    id: dto.id,
    key: dto.key,
    name: dto.name,
    title: dto.title,
    lore: dto.lore || dto.blurb,
    tags: dto.tags,
    image: { full: dto.image.full },
    passive: dto.passive
      ? {
          name: dto.passive.name,
          description: dto.passive.description,
          image: { full: dto.passive.image.full },
        }
      : null,
    spells: dto.spells.map((spell) => ({
      name: spell.name,
      description: spell.description,
      tooltip: spell.tooltip,
      image: { full: spell.image.full },
    })),
    skins: dto.skins.map((skin) => ({
      id: skin.id,
      number: skin.num,
      name: skin.name,
      hasChromas: skin.chromas,
      parentSkin: skin.parentSkin === null ? null : String(skin.parentSkin),
    })),
  };
}

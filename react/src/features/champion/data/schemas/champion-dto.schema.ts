import { z } from 'zod';

export const championImageDtoSchema = z.looseObject({
  full: z.string(),
});

export const passiveDtoSchema = z.looseObject({
  name: z.string(),
  description: z.string(),
  image: championImageDtoSchema,
});

export const spellDtoSchema = z.looseObject({
  name: z.string(),
  description: z.string(),
  tooltip: z.string().optional().default(''),
  image: championImageDtoSchema,
});

export const skinDtoSchema = z.looseObject({
  id: z.string(),
  num: z.number().int(),
  name: z.string(),
  chromas: z.boolean().optional().default(false),
  parentSkin: z.union([z.string(), z.number()]).nullable().optional().default(null),
});

export const championDtoSchema = z.looseObject({
  id: z.string(),
  key: z.string().optional().default(''),
  name: z.string(),
  title: z.string().optional().default(''),
  lore: z.string().optional().default(''),
  blurb: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  image: championImageDtoSchema,
  passive: passiveDtoSchema.nullable().optional().default(null),
  spells: z.array(spellDtoSchema).optional().default([]),
  skins: z.array(skinDtoSchema).optional().default([]),
});

export const championEnvelopeDtoSchema = z.object({
  data: z.record(z.string(), championDtoSchema),
});

export type ChampionDto = z.infer<typeof championDtoSchema>;
export type ChampionEnvelopeDto = z.infer<typeof championEnvelopeDtoSchema>;

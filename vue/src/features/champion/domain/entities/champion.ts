export interface ChampionImage {
  readonly full: string
}

export interface Passive {
  readonly name: string
  readonly description: string
  readonly image: ChampionImage
}

export interface Spell {
  readonly name: string
  readonly description: string
  readonly tooltip: string
  readonly image: ChampionImage
}

export interface Skin {
  readonly id: string
  readonly number: number
  readonly name: string
  readonly hasChromas: boolean
  readonly parentSkin: string | null
}

export interface Champion {
  readonly id: string
  readonly key: string
  readonly name: string
  readonly title: string
  readonly lore: string
  readonly tags: readonly string[]
  readonly image: ChampionImage
  readonly passive: Passive | null
  readonly spells: readonly Spell[]
  readonly skins: readonly Skin[]
}

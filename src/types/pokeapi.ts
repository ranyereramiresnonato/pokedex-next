export type NamedAPIResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type SpriteVariant = {
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
};

export type SpriteGroup = {
  "official-artwork"?: {
    front_default: string | null;
    front_shiny: string | null;
  };
  home?: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
  dream_world?: {
    front_default: string | null;
    front_female: string | null;
  };
  showdown?: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
  };
};

export type PokemonSprites = SpriteVariant & {
  other?: SpriteGroup;
  versions?: Record<string, Record<string, SpriteVariant>>;
};

export type PokemonType = {
  slot: number;
  type: NamedAPIResource;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
};

export type PokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
};

export type PokemonMoveVersionGroup = {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
  order: number | null;
};

export type PokemonMove = {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersionGroup[];
};

export type PokemonGameIndex = {
  game_index: number;
  version: NamedAPIResource;
};

export type PokemonHeldItem = {
  item: NamedAPIResource;
  version_details: {
    rarity: number;
    version: NamedAPIResource;
  }[];
};

export type PokemonCries = {
  latest: string | null;
  legacy: string | null;
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  is_default: boolean;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  cries?: PokemonCries;
  game_indices: PokemonGameIndex[];
  held_items: PokemonHeldItem[];
  species: NamedAPIResource;
  forms: NamedAPIResource[];
};

export type LocalizedName = {
  name: string;
  language: NamedAPIResource;
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
};

export type Genus = {
  genus: string;
  language: NamedAPIResource;
};

export type PokemonSpecies = {
  id: number;
  name: string;
  names: LocalizedName[];
  genera: Genus[];
  flavor_text_entries: FlavorTextEntry[];
  gender_rate: number;
  capture_rate: number;
  base_happiness: number | null;
  egg_groups: NamedAPIResource[];
  hatch_counter: number | null;
  color: NamedAPIResource | null;
  shape: NamedAPIResource | null;
  habitat: NamedAPIResource | null;
  generation: NamedAPIResource | null;
  growth_rate: NamedAPIResource | null;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  evolution_chain: { url: string } | null;
  varieties: {
    is_default: boolean;
    pokemon: NamedAPIResource;
  }[];
};

export type EvolutionDetail = {
  min_level: number | null;
  trigger: NamedAPIResource | null;
  item: NamedAPIResource | null;
  held_item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  time_of_day: string;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  turn_upside_down: boolean;
  trade_species: NamedAPIResource | null;
  gender: number | null;
  relative_physical_stats: number | null;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
};

export type EvolutionChainLink = {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
};

export type EvolutionChain = {
  id: number;
  baby_trigger_item: NamedAPIResource | null;
  chain: EvolutionChainLink;
};

export type Ability = {
  id: number;
  name: string;
  names: LocalizedName[];
  effect_entries: {
    effect: string;
    short_effect: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
  generation: NamedAPIResource | null;
};

export type PokemonSummary = {
  id: number;
  name: string;
  sprite: string | null;
  shinySprite: string | null;
  types: string[];
};

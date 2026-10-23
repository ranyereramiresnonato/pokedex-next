import type {
  EvolutionDetail,
  FlavorTextEntry,
  LocalizedName,
  PokemonSpecies,
  PokemonSprites,
  PokemonStat,
} from "@/types/pokeapi";

export const TYPE_LABELS: Record<string, string> = {
  normal: "Normal",
  fire: "Fogo",
  water: "Água",
  electric: "Elétrico",
  grass: "Planta",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Veneno",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psíquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragão",
  dark: "Sombrio",
  steel: "Aço",
  fairy: "Fada",
  stellar: "Estelar",
  unknown: "Desconhecido",
};

export const TYPE_COLORS: Record<string, string> = {
  normal: "#9fa39a",
  fire: "#ee8130",
  water: "#6390f0",
  electric: "#e8c616",
  grass: "#63b64a",
  ice: "#74c7c8",
  fighting: "#c22e28",
  poison: "#a33ea1",
  ground: "#c9a84c",
  flying: "#8f78d8",
  psychic: "#f95587",
  bug: "#93a516",
  rock: "#b6a136",
  ghost: "#735797",
  dragon: "#6f35fc",
  dark: "#705746",
  steel: "#8f8fa8",
  fairy: "#d685ad",
  stellar: "#40b5a5",
  unknown: "#68a090",
};

const LIGHT_TYPES = new Set([
  "electric",
  "ice",
  "ground",
  "steel",
  "normal",
  "grass",
  "fairy",
]);

export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? TYPE_COLORS.unknown;
}

export function typeTextColor(type: string): string {
  return LIGHT_TYPES.has(type) ? "#3b2f00" : "#ffffff";
}

export const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  "special-attack": "Ataque Especial",
  "special-defense": "Defesa Especial",
  speed: "Velocidade",
};

export const STAT_ORDER = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

export const MOVE_METHOD_LABELS: Record<string, string> = {
  "level-up": "Por nível",
  machine: "Máquinas (TM/HM)",
  egg: "Ovos",
  tutor: "Tutores",
  "form-change": "Mudança de forma",
  "light-ball-egg": "Ovo especial (Light Ball)",
  "colosseum-purification": "Purificação (Colosseum)",
  "xd-shadow": "Shadow (XD)",
  "xd-purification": "Purificação (XD)",
};

const ITEM_LABELS: Record<string, string> = {
  "fire-stone": "Pedra de Fogo",
  "water-stone": "Pedra de Água",
  "thunder-stone": "Pedra de Trovão",
  "leaf-stone": "Pedra de Folha",
  "moon-stone": "Pedra da Lua",
  "sun-stone": "Pedra do Sol",
  "shiny-stone": "Pedra Brilhante",
  "dusk-stone": "Pedra do Crepúsculo",
  "dawn-stone": "Pedra da Aurora",
  "ice-stone": "Pedra de Gelo",
  "dragon-scale": "Escama de Dragão",
  "metal-coat": "Revestimento Metálico",
  "kings-rock": "Rocha do Rei",
  "up-grade": "Up-Grade",
  "dubious-disc": "Disco Duvidoso",
  "protector": "Protetor",
  "electirizer": "Eletrizador",
  "magmarizer": "Magmatizador",
  "razor-claw": "Garra Afiada",
  "razor-fang": "Presa Afiada",
  "reaper-cloth": "Tecido Sombrio",
  "deep-sea-tooth": "Dente do Mar",
  "deep-sea-scale": "Escama do Mar",
  "prism-scale": "Escama Prisma",
  "whipped-dream": "Doce Sonho",
  "sachet": "Sachê",
  "oval-stone": "Pedra Oval",
  "linking-cord": "Cabo de Conexão",
  "black-augurite": "Augurita Negra",
  "peat-block": "Bloco de Turfa",
  "auspicious-armor": "Armadura Auspiciosa",
  "malicious-armor": "Armadura Maliciosa",
  "scroll-of-darkness": "Pergaminho da Escuridão",
  "scroll-of-waters": "Pergaminho das Águas",
  "sweet-apple": "Maçã Doce",
  "tart-apple": "Maçã Ácida",
  "cracked-pot": "Pote Rachado",
  "chipped-pot": "Pote Lascado",
  "strawberry-sweet": "Doce de Morango",
  "syrupy-apple": "Maçã Xaroposa",
  "unremarkable-teacup": "Xícara Comum",
  "masterpiece-teacup": "Xícara de Obra-prima",
};

const TRIGGER_LABELS: Record<string, string> = {
  "level-up": "Subir de nível",
  "use-item": "Usar item",
  trade: "Troca",
  shed: "Evolução especial",
  spin: "Girar",
  "tower-of-darkness": "Torre da Escuridão",
  "tower-of-waters": "Torre das Águas",
  "three-critical-hits": "Três acertos críticos",
  "take-damage": "Receber dano",
  "agile-style-move": "Movimento estilo ágil",
  "strong-style-move": "Movimento estilo forte",
  "recoil-damage": "Dano de recuo",
  other: "Outro método",
};

const VERSION_GROUP_LABELS: Record<string, string> = {
  "red-blue": "Red/Blue",
  yellow: "Yellow",
  "gold-silver": "Gold/Silver",
  crystal: "Crystal",
  "ruby-sapphire": "Ruby/Sapphire",
  emerald: "Emerald",
  "firered-leafgreen": "FireRed/LeafGreen",
  "diamond-pearl": "Diamond/Pearl",
  platinum: "Platinum",
  "heartgold-soulsilver": "HeartGold/SoulSilver",
  "black-white": "Black/White",
  "black-2-white-2": "Black 2/White 2",
  "x-y": "X/Y",
  "omega-ruby-alpha-sapphire": "Omega Ruby/Alpha Sapphire",
  "sun-moon": "Sun/Moon",
  "ultra-sun-ultra-moon": "Ultra Sun/Ultra Moon",
  "lets-go-pikachu-lets-go-eevee": "Let's Go Pikachu/Eevee",
  "sword-shield": "Sword/Shield",
  "brilliant-diamond-shining-pearl": "Brilliant Diamond/Shining Pearl",
  "legends-arceus": "Legends: Arceus",
  "scarlet-violet": "Scarlet/Violet",
};

const GENERATION_LABELS: Record<string, string> = {
  "generation-i": "Geração I",
  "generation-ii": "Geração II",
  "generation-iii": "Geração III",
  "generation-iv": "Geração IV",
  "generation-v": "Geração V",
  "generation-vi": "Geração VI",
  "generation-vii": "Geração VII",
  "generation-viii": "Geração VIII",
  "generation-ix": "Geração IX",
};

const NAME_OVERRIDES: Record<string, string> = {
  "nidoran-f": "Nidoran ♀",
  "nidoran-m": "Nidoran ♂",
  "mr-mime": "Mr. Mime",
  "mime-jr": "Mime Jr.",
  "mr-rime": "Mr. Rime",
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  flabebe: "Flabébé",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
};

export function formatName(value: string): string {
  if (!value) {
    return "";
  }
  const override = NAME_OVERRIDES[value.toLowerCase()];
  if (override) {
    return override;
  }
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function filterPokemonNames<T extends { name: string }>(
  entries: readonly T[],
  query: string,
): T[] {
  const normalized = normalizeSearch(query);
  if (!normalized) {
    return [...entries];
  }
  return entries.filter((entry) =>
    normalizeSearch(entry.name).includes(normalized),
  );
}

export function paginate<T>(
  items: readonly T[],
  requestedPage: number,
  pageSize: number,
): {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    totalPages,
    total,
  };
}

export function buildPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "start-ellipsis" | "end-ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  for (let offset = 1; offset <= 1; offset += 1) {
    if (currentPage - offset > 1) {
      pages.add(currentPage - offset);
    }
    if (currentPage + offset < totalPages) {
      pages.add(currentPage + offset);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "start-ellipsis" | "end-ellipsis")[] = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) {
      result.push(previous === 1 ? "start-ellipsis" : "end-ellipsis");
    }
    result.push(page);
  });
  return result;
}

export function totalStats(stats: readonly PokemonStat[]): number {
  return stats.reduce((total, stat) => total + stat.base_stat, 0);
}

export function formatHeight(heightInDecimeters: number): string {
  return `${(heightInDecimeters / 10).toFixed(1).replace(".", ",")} m`;
}

export function formatWeight(weightInHectograms: number): string {
  return `${(weightInHectograms / 10).toFixed(1).replace(".", ",")} kg`;
}

export function cleanFlavorText(text: string): string {
  return text.replace(/[\n\f\r\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function getLocalizedEntry<T extends { language: { name: string } }>(
  entries: readonly T[],
  preferredLanguages: readonly string[] = ["pt-BR", "pt-br", "pt", "en"],
): T | null {
  for (const language of preferredLanguages) {
    const found = entries.find(
      (entry) => entry.language.name.toLowerCase() === language.toLowerCase(),
    );
    if (found) {
      return found;
    }
  }
  return null;
}

export function getLocalizedName(
  names: readonly LocalizedName[] | undefined,
  fallback: string,
): string {
  if (!names) {
    return formatName(fallback);
  }
  return (
    getLocalizedEntry(names)?.name ?? formatName(fallback)
  );
}

export function getGenus(species: PokemonSpecies): string | null {
  return getLocalizedEntry(species.genera)?.genus ?? null;
}

export function dedupeFlavorTexts(
  entries: readonly FlavorTextEntry[],
): { text: string; versions: string[] }[] {
  const preferred = entries.filter((entry) =>
    ["pt-br", "pt", "en"].includes(entry.language.name.toLowerCase()),
  );
  const usePortuguese = preferred.some((entry) =>
    ["pt-br", "pt"].includes(entry.language.name.toLowerCase()),
  );
  const pool = usePortuguese
    ? preferred.filter((entry) =>
        ["pt-br", "pt"].includes(entry.language.name.toLowerCase()),
      )
    : preferred.filter((entry) => entry.language.name.toLowerCase() === "en");

  const byText = new Map<string, { text: string; versions: string[] }>();
  for (const entry of pool) {
    const text = cleanFlavorText(entry.flavor_text);
    if (!text) {
      continue;
    }
    const version = formatVersionName(entry.version.name);
    const existing = byText.get(text);
    if (existing) {
      if (!existing.versions.includes(version)) {
        existing.versions.push(version);
      }
    } else {
      byText.set(text, { text, versions: [version] });
    }
  }
  return [...byText.values()];
}

export function getFlavorText(species: PokemonSpecies): string | null {
  const deduped = dedupeFlavorTexts(species.flavor_text_entries);
  return deduped[0]?.text ?? null;
}

export function genderInfo(genderRate: number): {
  genderless: boolean;
  female: number;
  male: number;
} {
  if (genderRate < 0) {
    return { genderless: true, female: 0, male: 0 };
  }
  const female = (genderRate / 8) * 100;
  return {
    genderless: false,
    female,
    male: 100 - female,
  };
}

export function formatPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1).replace(".", ",")}%`;
}

export function formatVersionName(value: string): string {
  return VERSION_LABELS[value] ?? VERSION_GROUP_LABELS[value] ?? formatName(value);
}

export function formatVersionGroup(value: string): string {
  return VERSION_GROUP_LABELS[value] ?? formatName(value);
}

export function formatGeneration(value: string): string {
  return GENERATION_LABELS[value] ?? formatName(value);
}

export function formatMoveMethod(value: string): string {
  return MOVE_METHOD_LABELS[value] ?? formatName(value);
}

export function formatItem(value: string): string {
  return ITEM_LABELS[value] ?? formatName(value);
}

export function formatTrigger(value: string): string {
  return TRIGGER_LABELS[value] ?? formatName(value);
}

type DescribeEvolutionOptions = {
  includeLevel?: boolean;
  fallback?: string;
};

export function describeEvolution(
  detail: EvolutionDetail,
  { includeLevel = true, fallback = "Condição especial" }: DescribeEvolutionOptions = {},
): string {
  const parts: string[] = [];
  const trigger = detail.trigger?.name;

  if (includeLevel && detail.min_level !== null) {
    parts.push(`Nível ${detail.min_level}`);
  }
  if (trigger === "use-item" && detail.item) {
    parts.push(`Usar ${formatItem(detail.item.name)}`);
  }
  if (trigger === "trade") {
    parts.push("Troca");
    if (detail.held_item) {
      parts.push(`segurando ${formatItem(detail.held_item.name)}`);
    }
    if (detail.trade_species) {
      parts.push(`por ${formatName(detail.trade_species.name)}`);
    }
  }
  if (trigger && trigger !== "use-item" && trigger !== "trade" && trigger !== "level-up") {
    parts.push(formatTrigger(trigger));
  }
  if (detail.min_happiness !== null) {
    parts.push(`Felicidade ≥ ${detail.min_happiness}`);
  }
  if (detail.min_affection !== null) {
    parts.push(`Afeição ≥ ${detail.min_affection}`);
  }
  if (detail.min_beauty !== null) {
    parts.push(`Beleza ≥ ${detail.min_beauty}`);
  }
  if (detail.time_of_day) {
    parts.push(
      detail.time_of_day === "day"
        ? "Durante o dia"
        : detail.time_of_day === "night"
          ? "À noite"
          : detail.time_of_day,
    );
  }
  if (detail.known_move) {
    parts.push(`Conhecendo ${formatName(detail.known_move.name)}`);
  }
  if (detail.known_move_type) {
    parts.push(`Movimento do tipo ${TYPE_LABELS[detail.known_move_type.name] ?? formatName(detail.known_move_type.name)}`);
  }
  if (detail.location) {
    parts.push(`Em ${formatName(detail.location.name)}`);
  }
  if (detail.held_item && trigger !== "trade") {
    parts.push(`Segurando ${formatItem(detail.held_item.name)}`);
  }
  if (detail.gender === 1) {
    parts.push("Somente fêmea");
  } else if (detail.gender === 2) {
    parts.push("Somente macho");
  }
  if (detail.needs_overworld_rain) {
    parts.push("Chovendo no mundo aberto");
  }
  if (detail.turn_upside_down) {
    parts.push("Console virado de cabeça para baixo");
  }
  if (detail.relative_physical_stats === 1) {
    parts.push("Ataque > Defesa");
  } else if (detail.relative_physical_stats === -1) {
    parts.push("Ataque < Defesa");
  } else if (detail.relative_physical_stats === 0) {
    parts.push("Ataque = Defesa");
  }
  if (detail.party_species) {
    parts.push(`Com ${formatName(detail.party_species.name)} na equipe`);
  }
  if (detail.party_type) {
    parts.push(`Com Pokémon do tipo ${TYPE_LABELS[detail.party_type.name] ?? detail.party_type.name} na equipe`);
  }

  return parts.length > 0 ? parts.join(" · ") : fallback;
}

export type CollectedSprite = {
  label: string;
  url: string;
};

export function collectSprites(sprites: PokemonSprites): CollectedSprite[] {
  const collected: CollectedSprite[] = [];
  const seen = new Set<string>();

  function push(label: string, url: string | null | undefined): void {
    if (!url || seen.has(url)) {
      return;
    }
    seen.add(url);
    collected.push({ label, url });
  }

  const official = sprites.other?.["official-artwork"];
  push("Arte oficial", official?.front_default);
  push("Arte oficial brilhante", official?.front_shiny);
  push("Frontal", sprites.front_default);
  push("Frontal brilhante", sprites.front_shiny);
  push("Costas", sprites.back_default);
  push("Costas brilhante", sprites.back_shiny);

  return collected;
}

export function formatMoveName(name: string): string {
  return formatName(name);
}

const HABITAT_LABELS: Record<string, string> = {
  cave: "Caverna",
  forest: "Floresta",
  grassland: "Campo",
  mountain: "Montanha",
  rare: "Raro",
  "rough-terrain": "Terreno acidentado",
  sea: "Mar",
  urban: "Urbano",
  "waters-edge": "Beira d'água",
};

const COLOR_LABELS: Record<string, string> = {
  black: "Preto",
  blue: "Azul",
  brown: "Marrom",
  gray: "Cinza",
  green: "Verde",
  pink: "Rosa",
  purple: "Roxo",
  red: "Vermelho",
  white: "Branco",
  yellow: "Amarelo",
};

const SHAPE_LABELS: Record<string, string> = {
  ball: "Esfera",
  squiggle: "Ondulado",
  fish: "Peixe",
  arms: "Braços",
  blob: "Gota",
  upright: "Erguido",
  legs: "Pernas",
  quadruped: "Quadrúpede",
  wings: "Asas",
  tentacles: "Tentáculos",
  heads: "Cabeças",
  humanoid: "Humanoide",
  "bug-wings": "Asas de inseto",
  armor: "Armadura",
};

const GROWTH_RATE_LABELS: Record<string, string> = {
  slow: "Lenta",
  medium: "Média",
  fast: "Rápida",
  "medium-slow": "Média-lenta",
  "slow-then-very-fast": "Lenta e depois muito rápida",
  "fast-then-very-slow": "Rápida e depois muito lenta",
};

const EGG_GROUP_LABELS: Record<string, string> = {
  monster: "Monstro",
  water1: "Água 1",
  bug: "Inseto",
  flying: "Voador",
  field: "Campo",
  fairy: "Fada",
  grass: "Planta",
  "human-like": "Humanoide",
  water3: "Água 3",
  mineral: "Mineral",
  amorphous: "Amorfo",
  water2: "Água 2",
  ditto: "Ditto",
  dragon: "Dragão",
  undiscovered: "Desconhecido",
};

const ENCOUNTER_METHOD_LABELS: Record<string, string> = {
  "walk": "Andando",
  "surf": "Surfando",
  "fishing": "Pescando",
  "old-rod": "Vara antiga",
  "good-rod": "Vara boa",
  "super-rod": "Super vara",
  "rock-smash": "Rock Smash",
  "headbutt": "Headbutt",
  "dark-grass": "Grama escura",
  "grass": "Grama",
  "cave": "Caverna",
  "gift": "Presente",
  "gift-egg": "Ovo de presente",
  "only-one": "Único",
  "pokeflute": "Poké Flauta",
  "squirt-bottle": "Squirt Bottle",
  "wailmer-pail": "Balde Wailmer",
  "devon-scope": "Devon Scope",
  "feebas-tile-fishing": "Pesca no tile de Feebas",
  "island-scan": "Island Scan",
  "let's-go": "Let's Go",
  "interact": "Interação",
  "overworld": "Mundo aberto",
};

const VERSION_LABELS: Record<string, string> = {
  red: "Red",
  blue: "Blue",
  yellow: "Yellow",
  gold: "Gold",
  silver: "Silver",
  crystal: "Crystal",
  ruby: "Ruby",
  sapphire: "Sapphire",
  emerald: "Emerald",
  firered: "FireRed",
  leafgreen: "LeafGreen",
  diamond: "Diamond",
  pearl: "Pearl",
  platinum: "Platinum",
  heartgold: "HeartGold",
  soulsilver: "SoulSilver",
  black: "Black",
  white: "White",
  "black-2": "Black 2",
  "white-2": "White 2",
  x: "X",
  y: "Y",
  "omega-ruby": "Omega Ruby",
  "alpha-sapphire": "Alpha Sapphire",
  sun: "Sun",
  moon: "Moon",
  "ultra-sun": "Ultra Sun",
  "ultra-moon": "Ultra Moon",
  "lets-go-pikachu": "Let's Go Pikachu",
  "lets-go-eevee": "Let's Go Eevee",
  sword: "Sword",
  shield: "Shield",
  "brilliant-diamond": "Brilliant Diamond",
  "shining-pearl": "Shining Pearl",
  "legends-arceus": "Legends: Arceus",
  scarlet: "Scarlet",
  violet: "Violet",
};

export function formatHabitat(value: string): string {
  return HABITAT_LABELS[value] ?? formatName(value);
}

export function formatColor(value: string): string {
  return COLOR_LABELS[value] ?? formatName(value);
}

export function formatShape(value: string): string {
  return SHAPE_LABELS[value] ?? formatName(value);
}

export function formatGrowthRate(value: string): string {
  return GROWTH_RATE_LABELS[value] ?? formatName(value);
}

export function formatEggGroup(value: string): string {
  return EGG_GROUP_LABELS[value] ?? formatName(value);
}

export function formatEncounterMethod(value: string): string {
  return ENCOUNTER_METHOD_LABELS[value] ?? formatName(value);
}

export function formatLocationArea(value: string): string {
  return formatName(value.replace(/-area$/, ""))
    .replace(/\bRoute\b/g, "Rota")
    .replace(/\bCave\b/g, "Caverna")
    .replace(/\bForest\b/g, "Floresta")
    .replace(/\bMountain\b/g, "Montanha")
    .replace(/\bLake\b/g, "Lago")
    .replace(/\bIsland\b/g, "Ilha")
    .replace(/\bCity\b/g, "Cidade")
    .replace(/\bTown\b/g, "Vila")
    .replace(/\bPath\b/g, "Caminho")
    .replace(/\bSea\b/g, "Mar")
    .replace(/\bDesert\b/g, "Deserto")
    .replace(/\bPark\b/g, "Parque")
    .replace(/\bTower\b/g, "Torre")
    .replace(/\bBridge\b/g, "Ponte");
}

import type {
  Ability,
  EvolutionChain,
  NamedAPIResource,
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  PokemonSummary,
} from "@/types/pokeapi";

const API_BASE = "https://pokeapi.co/api/v2";
const REQUEST_TIMEOUT_MS = 12_000;
const LIST_REVALIDATE_SECONDS = 60 * 60 * 24;
const DETAIL_REVALIDATE_SECONDS = 60 * 60;
const CATALOG_PAGE_SIZE = 24;

export class PokeApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "PokeApiError";
    this.status = status;
  }
}

export function isPokeApiNotFound(error: unknown): boolean {
  return error instanceof PokeApiError && error.status === 404;
}

async function fetchPokeApi<T>(
  path: string,
  revalidateSeconds: number,
  tags: string[],
): Promise<T> {
  const url = `${API_BASE}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: revalidateSeconds, tags },
    });
  } catch {
    throw new PokeApiError(
      "Não foi possível conectar à PokéAPI. Verifique sua conexão e tente novamente.",
    );
  }

  if (response.status === 404) {
    throw new PokeApiError("Pokémon não encontrado na PokéAPI.", 404);
  }

  if (!response.ok) {
    throw new PokeApiError(
      "A PokéAPI está instável no momento. Tente novamente em instantes.",
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new PokeApiError("Resposta inválida recebida da PokéAPI.");
  }
}

export function extractIdFromUrl(url: string): number | null {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) {
    return null;
  }
  const id = Number.parseInt(match[1], 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function officialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getPokemonList(
  limit = CATALOG_PAGE_SIZE,
  offset = 0,
): Promise<PokemonListResponse> {
  return fetchPokeApi<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
    DETAIL_REVALIDATE_SECONDS,
    ["pokemon-list"],
  );
}

export async function getAllPokemonNames(): Promise<
  { id: number; name: string }[]
> {
  const data = await fetchPokeApi<PokemonListResponse>(
    "/pokemon?limit=20000&offset=0",
    LIST_REVALIDATE_SECONDS,
    ["pokemon-catalog"],
  );

  return data.results
    .map((resource) => ({
      id: extractIdFromUrl(resource.url),
      name: resource.name,
    }))
    .filter((entry): entry is { id: number; name: string } => entry.id !== null);
}

export function getPokemon(idOrName: string | number): Promise<Pokemon> {
  const key = encodeURIComponent(String(idOrName).trim().toLowerCase());
  return fetchPokeApi<Pokemon>(
    `/pokemon/${key}`,
    DETAIL_REVALIDATE_SECONDS,
    ["pokemon-detail", `pokemon-${key}`],
  );
}

export function getPokemonSpecies(
  idOrName: string | number,
): Promise<PokemonSpecies> {
  const key = encodeURIComponent(String(idOrName).trim().toLowerCase());
  return fetchPokeApi<PokemonSpecies>(
    `/pokemon-species/${key}`,
    DETAIL_REVALIDATE_SECONDS,
    ["pokemon-species", `pokemon-species-${key}`],
  );
}

export function getEvolutionChainByUrl(url: string): Promise<EvolutionChain> {
  const path = url.startsWith(API_BASE) ? url.slice(API_BASE.length) : url;
  return fetchPokeApi<EvolutionChain>(
    path,
    LIST_REVALIDATE_SECONDS,
    ["evolution-chain"],
  );
}

export async function getAbility(idOrName: string): Promise<Ability> {
  const key = encodeURIComponent(idOrName.trim().toLowerCase());
  return fetchPokeApi<Ability>(
    `/ability/${key}`,
    LIST_REVALIDATE_SECONDS,
    ["ability", `ability-${key}`],
  );
}

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

export async function getPokemonSummary(
  resourceOrId: NamedAPIResource | { id: number; name: string },
): Promise<PokemonSummary> {
  const fallbackId =
    "id" in resourceOrId ? resourceOrId.id : extractIdFromUrl(resourceOrId.url);
  const fallbackName = resourceOrId.name;

  try {
    const pokemon = await getPokemon(fallbackId ?? fallbackName);
    return {
      id: pokemon.id,
      name: pokemon.name,
      sprite:
        pokemon.sprites.other?.["official-artwork"]?.front_default ??
        pokemon.sprites.front_default ??
        officialArtworkUrl(pokemon.id),
      shinySprite:
        pokemon.sprites.other?.["official-artwork"]?.front_shiny ??
        pokemon.sprites.front_shiny,
      types: [...pokemon.types]
        .sort((a, b) => a.slot - b.slot)
        .map((entry) => entry.type.name),
    };
  } catch (error) {
    if (fallbackId === null) {
      throw error;
    }
    return {
      id: fallbackId,
      name: fallbackName,
      sprite: officialArtworkUrl(fallbackId),
      shinySprite: null,
      types: [],
    };
  }
}

export async function getPokemonSummaries(
  resources: readonly (NamedAPIResource | { id: number; name: string })[],
): Promise<PokemonSummary[]> {
  return mapWithConcurrency(resources, 6, (resource) =>
    getPokemonSummary(resource),
  );
}

export { CATALOG_PAGE_SIZE };

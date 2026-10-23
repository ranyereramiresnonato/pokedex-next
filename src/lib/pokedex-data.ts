import {
  CATALOG_PAGE_SIZE,
  getAllPokemonNames,
  getAbility,
  getEvolutionChainByUrl,
  getPokemon,
  getPokemonList,
  getPokemonSummaries,
  getPokemonSummary,
  getPokemonSpecies,
  mapWithConcurrency,
} from "@/lib/pokemon-api";
import { filterPokemonNames, paginate } from "@/lib/pokemon";
import type {
  Ability,
  EvolutionChain,
  Pokemon,
  PokemonSpecies,
  PokemonSummary,
} from "@/types/pokeapi";

export type CatalogPage = {
  items: PokemonSummary[];
  page: number;
  totalPages: number;
  total: number;
  query: string;
  pageSize: number;
};

export async function getCatalogPage(
  requestedPage: number,
  query: string,
): Promise<CatalogPage> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    const tentativePage = Math.max(1, requestedPage);
    let list = await getPokemonList(
      CATALOG_PAGE_SIZE,
      (tentativePage - 1) * CATALOG_PAGE_SIZE,
    );
    const total = list.count;
    const totalPages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
    const page = Math.min(tentativePage, totalPages);

    if (page !== tentativePage) {
      list = await getPokemonList(
        CATALOG_PAGE_SIZE,
        (page - 1) * CATALOG_PAGE_SIZE,
      );
    }

    const items = await getPokemonSummaries(list.results);
    return {
      items,
      page,
      totalPages,
      total,
      query: "",
      pageSize: CATALOG_PAGE_SIZE,
    };
  }

  const allNames = await getAllPokemonNames();
  const filtered = filterPokemonNames(allNames, trimmedQuery);
  const paginated = paginate(filtered, requestedPage, CATALOG_PAGE_SIZE);
  const items = await getPokemonSummaries(paginated.items);

  return {
    items,
    page: paginated.page,
    totalPages: paginated.totalPages,
    total: paginated.total,
    query: trimmedQuery,
    pageSize: CATALOG_PAGE_SIZE,
  };
}

export async function getFavoriteSummaries(
  favoriteIds: readonly number[],
): Promise<PokemonSummary[]> {
  if (favoriteIds.length === 0) {
    return [];
  }
  const summaries = await mapWithConcurrency(favoriteIds, 6, (id) =>
    getPokemonSummary({ id, name: String(id) }),
  );
  return summaries;
}

export type PokemonDetailData = {
  pokemon: Pokemon;
  species: PokemonSpecies;
  evolutionChain: EvolutionChain | null;
  abilities: Ability[];
};

export async function getPokemonDetailData(
  idOrName: string,
): Promise<PokemonDetailData> {
  const pokemon = await getPokemon(idOrName);
  const species = await getPokemonSpecies(pokemon.species.name);

  const [evolutionChain, abilities] = await Promise.all([
    species.evolution_chain
      ? getEvolutionChainByUrl(species.evolution_chain.url).catch(() => null)
      : Promise.resolve(null),
    mapWithConcurrency(pokemon.abilities, 3, async (entry) => {
      try {
        return await getAbility(entry.ability.name);
      } catch {
        return null;
      }
    }),
  ]);

  return {
    pokemon,
    species,
    evolutionChain,
    abilities: abilities.filter((ability): ability is Ability => ability !== null),
  };
}

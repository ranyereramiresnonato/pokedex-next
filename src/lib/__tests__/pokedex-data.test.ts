import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PokemonListResponse, PokemonSummary } from "@/types/pokeapi";

vi.mock("@/lib/pokemon-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/pokemon-api")>();
  return {
    ...actual,
    getPokemonList: vi.fn(),
    getPokemonSummaries: vi.fn(),
  };
});

import { getCatalogPage } from "@/lib/pokedex-data";
import { getPokemonList, getPokemonSummaries } from "@/lib/pokemon-api";

function resources(startId: number, amount: number) {
  return Array.from({ length: amount }, (_, index) => ({
    name: `pokemon-${startId + index}`,
    url: `https://pokeapi.co/api/v2/pokemon/${startId + index}/`,
  }));
}

function listResponse(
  count: number,
  startId: number,
  amount: number,
): PokemonListResponse {
  return {
    count,
    next: null,
    previous: null,
    results: resources(startId, amount),
  };
}

beforeEach(() => {
  vi.mocked(getPokemonSummaries).mockImplementation(async (entries) =>
    entries.map(
      (entry, index): PokemonSummary => ({
        id: index + 1,
        name: entry.name,
        sprite: "sprite.png",
        shinySprite: null,
        types: [],
      }),
    ),
  );
});

describe("getCatalogPage", () => {
  it("carrega 24 Pokémon na primeira página sem busca", async () => {
    vi.mocked(getPokemonList).mockResolvedValue(listResponse(1302, 1, 24));

    const catalog = await getCatalogPage(1, "");

    expect(getPokemonList).toHaveBeenCalledWith(24, 0);
    expect(catalog.items).toHaveLength(24);
    expect(catalog.page).toBe(1);
    expect(catalog.totalPages).toBe(55);
  });

  it("usa limit e offset corretos nas páginas seguintes", async () => {
    vi.mocked(getPokemonList).mockResolvedValue(listResponse(1302, 25, 24));

    const catalog = await getCatalogPage(2, "");

    expect(getPokemonList).toHaveBeenCalledWith(24, 24);
    expect(catalog.items).toHaveLength(24);
    expect(catalog.page).toBe(2);
  });

  it("limita uma página além do fim para a última página real", async () => {
    vi.mocked(getPokemonList)
      .mockResolvedValueOnce(listResponse(1302, 1, 0))
      .mockResolvedValueOnce(listResponse(1302, 1297, 6));

    const catalog = await getCatalogPage(999, "");

    expect(getPokemonList).toHaveBeenNthCalledWith(1, 24, 23952);
    expect(getPokemonList).toHaveBeenNthCalledWith(2, 24, 1296);
    expect(catalog.page).toBe(55);
    expect(catalog.items).toHaveLength(6);
  });
});

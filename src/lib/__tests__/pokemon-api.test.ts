import { afterEach, describe, expect, it, vi } from "vitest";
import {
  extractIdFromUrl,
  getPokemonList,
  getPokemonSummary,
  isPokeApiNotFound,
  mapWithConcurrency,
  officialArtworkUrl,
  PokeApiError,
} from "@/lib/pokemon-api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("pokemon-api", () => {
  it("extrai IDs de URLs da PokéAPI", () => {
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/1")).toBe(1);
    expect(extractIdFromUrl("https://pokeapi.co/api/v2/pokemon/pikachu")).toBeNull();
    expect(officialArtworkUrl(25)).toContain("/official-artwork/25.png");
  });

  it("usa limit e offset na paginação nativa", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        count: 1302,
        next: null,
        previous: null,
        results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const data = await getPokemonList(24, 48);

    expect(data.count).toBe(1302);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon?limit=24&offset=48",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        next: expect.objectContaining({ revalidate: 3600 }),
      }),
    );
  });

  it("trata 404 como não encontrado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    await expect(getPokemonList()).rejects.toMatchObject({
      name: "PokeApiError",
      status: 404,
    });

    try {
      await getPokemonList();
    } catch (error) {
      expect(error).toBeInstanceOf(PokeApiError);
      expect(isPokeApiNotFound(error)).toBe(true);
    }
  });

  it("trata falha de rede com mensagem amigável", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));

    await expect(getPokemonList()).rejects.toThrow(
      "Não foi possível conectar à PokéAPI",
    );
  });

  it("usa fallback de sprite quando o detalhe falha", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));

    const summary = await getPokemonSummary({ id: 25, name: "pikachu" });

    expect(summary).toEqual({
      id: 25,
      name: "pikachu",
      sprite: officialArtworkUrl(25),
      shinySprite: null,
      types: [],
    });
  });

  it("carrega detalhes resumidos com tipos ordenados", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          id: 6,
          name: "charizard",
          sprites: {
            front_default: "front.png",
            front_shiny: "shiny.png",
            other: {
              "official-artwork": {
                front_default: "official.png",
                front_shiny: "official-shiny.png",
              },
            },
          },
          types: [
            { slot: 2, type: { name: "flying", url: "" } },
            { slot: 1, type: { name: "fire", url: "" } },
          ],
        }),
      ),
    );

    const summary = await getPokemonSummary({
      name: "charizard",
      url: "https://pokeapi.co/api/v2/pokemon/6/",
    });

    expect(summary).toEqual({
      id: 6,
      name: "charizard",
      sprite: "official.png",
      shinySprite: "official-shiny.png",
      types: ["fire", "flying"],
    });
  });

  it("respeita o limite de concorrência e mantém a ordem", async () => {
    let active = 0;
    let maxActive = 0;

    const results = await mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async (value) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return value * 2;
    });

    expect(results).toEqual([2, 4, 6, 8, 10, 12]);
    expect(maxActive).toBeLessThanOrEqual(2);
  });
});

import { describe, expect, it } from "vitest";
import {
  buildPageNumbers,
  collectSprites,
  dedupeFlavorTexts,
  describeEvolution,
  filterPokemonNames,
  formatHeight,
  formatName,
  formatWeight,
  genderInfo,
  paginate,
  totalStats,
} from "@/lib/pokemon";
import type {
  EvolutionDetail,
  FlavorTextEntry,
  PokemonSprites,
  PokemonStat,
} from "@/types/pokeapi";

const spriteVariant = {
  front_default: null,
  front_female: null,
  front_shiny: null,
  front_shiny_female: null,
  back_default: null,
  back_female: null,
  back_shiny: null,
  back_shiny_female: null,
};

describe("pokemon helpers", () => {
  it("formata nomes técnicos e apelidos especiais", () => {
    expect(formatName("pikachu")).toBe("Pikachu");
    expect(formatName("mr-mime")).toBe("Mr. Mime");
    expect(formatName("nidoran-f")).toBe("Nidoran ♀");
    expect(formatName("ho-oh")).toBe("Ho-Oh");
    expect(formatName("charizard-mega-x")).toBe("Charizard Mega X");
  });

  it("filtra busca parcial sem diferenciar caixa, hífen ou acento", () => {
    const entries = [
      { name: "pikachu" },
      { name: "mr-mime" },
      { name: "eevee" },
      { name: "flabebe" },
    ];

    expect(filterPokemonNames(entries, "PIKA").map((item) => item.name)).toEqual([
      "pikachu",
    ]);
    expect(filterPokemonNames(entries, "mr mime").map((item) => item.name)).toEqual([
      "mr-mime",
    ]);
    expect(filterPokemonNames(entries, "mime").map((item) => item.name)).toEqual([
      "mr-mime",
    ]);
    expect(filterPokemonNames(entries, "flabébé").map((item) => item.name)).toEqual([
      "flabebe",
    ]);
    expect(filterPokemonNames(entries, "")).toHaveLength(4);
  });

  it("pagina o conjunto filtrado e limita páginas inválidas", () => {
    const items = Array.from({ length: 50 }, (_, index) => index + 1);

    const first = paginate(items, 1, 24);
    expect(first.items).toHaveLength(24);
    expect(first.totalPages).toBe(3);
    expect(first.total).toBe(50);

    const last = paginate(items, 3, 24);
    expect(last.items).toEqual([49, 50]);

    expect(paginate(items, 99, 24).page).toBe(3);
    expect(paginate(items, -1, 24).page).toBe(1);
    expect(paginate([], 5, 24)).toMatchObject({
      items: [],
      page: 1,
      totalPages: 1,
      total: 0,
    });
  });

  it("monta números de página com elipses", () => {
    expect(buildPageNumbers(5, 10)).toEqual([
      1,
      "start-ellipsis",
      4,
      5,
      6,
      "end-ellipsis",
      10,
    ]);
    expect(buildPageNumbers(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("calcula gênero, medidas e total de estatísticas", () => {
    expect(genderInfo(-1)).toEqual({ genderless: true, female: 0, male: 0 });
    expect(genderInfo(1)).toEqual({ genderless: false, female: 12.5, male: 87.5 });
    expect(genderInfo(4)).toEqual({ genderless: false, female: 50, male: 50 });
    expect(formatHeight(7)).toBe("0,7 m");
    expect(formatWeight(69)).toBe("6,9 kg");

    const stats: PokemonStat[] = [
      { base_stat: 45, effort: 0, stat: { name: "hp", url: "" } },
      { base_stat: 49, effort: 0, stat: { name: "attack", url: "" } },
      { base_stat: 65, effort: 2, stat: { name: "speed", url: "" } },
    ];
    expect(totalStats(stats)).toBe(159);
  });

  it("coleta apenas os sprites principais, sem duplicar URLs", () => {
    const sprites = {
      ...spriteVariant,
      front_default: "https://example.com/front.png",
      front_shiny: "https://example.com/front-shiny.png",
      back_default: "https://example.com/front.png",
      back_shiny: "https://example.com/back-shiny.png",
      other: {
        "official-artwork": {
          front_default: "https://example.com/official.png",
          front_shiny: "https://example.com/official-shiny.png",
        },
      },
      versions: {
        "generation-i": {
          "red-blue": {
            ...spriteVariant,
            front_default: "https://example.com/gen1.png",
          },
        },
      },
    } as unknown as PokemonSprites;

    const collected = collectSprites(sprites);

    expect(collected.map((sprite) => sprite.label)).toEqual([
      "Arte oficial",
      "Arte oficial brilhante",
      "Frontal",
      "Frontal brilhante",
      "Costas brilhante",
    ]);
    expect(
      collected.filter((sprite) => sprite.url === "https://example.com/front.png"),
    ).toHaveLength(1);
    expect(collected.some((sprite) => sprite.url.includes("gen1"))).toBe(false);
  });

  it("descreve condições de evolução", () => {
    const base: EvolutionDetail = {
      min_level: null,
      trigger: null,
      item: null,
      held_item: null,
      known_move: null,
      known_move_type: null,
      location: null,
      time_of_day: "",
      min_happiness: null,
      min_beauty: null,
      min_affection: null,
      needs_overworld_rain: false,
      turn_upside_down: false,
      trade_species: null,
      gender: null,
      relative_physical_stats: null,
      party_species: null,
      party_type: null,
    };

    expect(
      describeEvolution({
        ...base,
        min_level: 16,
        trigger: { name: "level-up", url: "" },
      }),
    ).toBe("Nível 16");

    expect(
      describeEvolution({
        ...base,
        trigger: { name: "use-item", url: "" },
        item: { name: "fire-stone", url: "" },
      }),
    ).toBe("Usar Pedra de Fogo");

    expect(
      describeEvolution({
        ...base,
        trigger: { name: "trade", url: "" },
        held_item: { name: "metal-coat", url: "" },
      }),
    ).toBe("Troca · segurando Revestimento Metálico");

    expect(
      describeEvolution(
        {
          ...base,
          min_level: 16,
          trigger: { name: "level-up", url: "" },
          time_of_day: "day",
        },
        { includeLevel: false },
      ),
    ).toBe("Durante o dia");

    expect(
      describeEvolution(
        {
          ...base,
          min_level: 16,
          trigger: { name: "level-up", url: "" },
        },
        { includeLevel: false, fallback: "" },
      ),
    ).toBe("");
  });

  it("deduplica textos da Pokédex agrupando versões", () => {
    const entries: FlavorTextEntry[] = [
      {
        flavor_text: "Texto em português.\n",
        language: { name: "pt", url: "" },
        version: { name: "red", url: "" },
      },
      {
        flavor_text: "Texto em português.\f",
        language: { name: "pt-br", url: "" },
        version: { name: "blue", url: "" },
      },
      {
        flavor_text: "English text.",
        language: { name: "en", url: "" },
        version: { name: "yellow", url: "" },
      },
    ];

    const result = dedupeFlavorTexts(entries);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Texto em português.");
    expect(result[0].versions).toEqual(["Red", "Blue"]);
  });

  it("usa inglês como fallback quando não há português", () => {
    const entries: FlavorTextEntry[] = [
      {
        flavor_text: "English text.",
        language: { name: "en", url: "" },
        version: { name: "yellow", url: "" },
      },
      {
        flavor_text: "Texte français.",
        language: { name: "fr", url: "" },
        version: { name: "red", url: "" },
      },
    ];

    expect(dedupeFlavorTexts(entries)).toEqual([
      { text: "English text.", versions: ["Yellow"] },
    ]);
  });
});

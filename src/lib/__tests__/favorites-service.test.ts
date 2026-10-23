import { describe, expect, it } from "vitest";
import {
  createFavoritesService,
  InvalidPokemonIdError,
  type FavoriteRecord,
  type FavoritesRepository,
} from "@/lib/favorites-service";

function createMemoryRepository(): FavoritesRepository & {
  store: Map<string, Map<number, Date>>;
} {
  const store = new Map<string, Map<number, Date>>();

  function bucket(userId: string) {
    let value = store.get(userId);
    if (!value) {
      value = new Map();
      store.set(userId, value);
    }
    return value;
  }

  return {
    store,
    async listIds(userId) {
      return [...bucket(userId).keys()].sort((a, b) => b - a);
    },
    async list(userId) {
      return [...bucket(userId).entries()]
        .map(([pokemonId, createdAt]): FavoriteRecord => ({ pokemonId, createdAt }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async add(userId, pokemonId) {
      const items = bucket(userId);
      if (!items.has(pokemonId)) {
        items.set(pokemonId, new Date(Date.now() + items.size));
      }
    },
    async remove(userId, pokemonId) {
      bucket(userId).delete(pokemonId);
    },
    async isFavorite(userId, pokemonId) {
      return bucket(userId).has(pokemonId);
    },
  };
}

describe("favoritesService", () => {
  it("adiciona e remove favoritos de forma idempotente", async () => {
    const service = createFavoritesService(createMemoryRepository());

    await service.add("user-a", 25);
    await service.add("user-a", 25);
    expect(await service.listIds("user-a")).toEqual([25]);

    await service.remove("user-a", 25);
    await service.remove("user-a", 25);
    expect(await service.listIds("user-a")).toEqual([]);
  });

  it("isola favoritos entre usuários", async () => {
    const service = createFavoritesService(createMemoryRepository());

    await service.add("user-a", 25);
    await service.add("user-b", 6);

    expect(await service.listIds("user-a")).toEqual([25]);
    expect(await service.listIds("user-b")).toEqual([6]);
    expect(await service.isFavorite("user-b", 25)).toBe(false);

    await service.remove("user-b", 25);
    expect(await service.isFavorite("user-a", 25)).toBe(true);
  });

  it("rejeita IDs inválidos antes de acessar o repositório", async () => {
    const repository = createMemoryRepository();
    const service = createFavoritesService(repository);

    await expect(service.add("user-a", 0)).rejects.toBeInstanceOf(
      InvalidPokemonIdError,
    );
    await expect(service.add("user-a", -5)).rejects.toBeInstanceOf(
      InvalidPokemonIdError,
    );
    await expect(service.add("user-a", 1.5)).rejects.toBeInstanceOf(
      InvalidPokemonIdError,
    );
    expect(repository.store.size).toBe(0);
  });

  it("mantém favoritos persistidos por usuário", async () => {
    const repository = createMemoryRepository();
    const service = createFavoritesService(repository);

    await service.add("user-a", 1);
    await service.add("user-a", 4);
    await service.add("user-a", 7);

    const persisted = createFavoritesService(repository);
    expect((await persisted.listIds("user-a")).sort((a, b) => a - b)).toEqual([
      1, 4, 7,
    ]);
  });
});

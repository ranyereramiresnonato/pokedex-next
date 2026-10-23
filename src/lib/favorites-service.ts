import { pokemonIdSchema } from "@/lib/validations";

export type FavoriteRecord = {
  pokemonId: number;
  createdAt: Date;
};

export interface FavoritesRepository {
  listIds(userId: string): Promise<number[]>;
  list(userId: string): Promise<FavoriteRecord[]>;
  add(userId: string, pokemonId: number): Promise<void>;
  remove(userId: string, pokemonId: number): Promise<void>;
  isFavorite(userId: string, pokemonId: number): Promise<boolean>;
}

export class InvalidPokemonIdError extends Error {
  constructor() {
    super("ID de Pokémon inválido.");
    this.name = "InvalidPokemonIdError";
  }
}

function assertPokemonId(pokemonId: number): number {
  const result = pokemonIdSchema.safeParse(pokemonId);
  if (!result.success) {
    throw new InvalidPokemonIdError();
  }
  return result.data;
}

export function createFavoritesService(repository: FavoritesRepository) {
  return {
    async listIds(userId: string): Promise<number[]> {
      return repository.listIds(userId);
    },

    async list(userId: string): Promise<FavoriteRecord[]> {
      return repository.list(userId);
    },

    async add(userId: string, pokemonId: number): Promise<void> {
      await repository.add(userId, assertPokemonId(pokemonId));
    },

    async remove(userId: string, pokemonId: number): Promise<void> {
      await repository.remove(userId, assertPokemonId(pokemonId));
    },

    async isFavorite(userId: string, pokemonId: number): Promise<boolean> {
      return repository.isFavorite(userId, assertPokemonId(pokemonId));
    },
  };
}

export type FavoritesService = ReturnType<typeof createFavoritesService>;

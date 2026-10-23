import { db } from "@/lib/db";
import {
  createFavoritesService,
  type FavoritesRepository,
} from "@/lib/favorites-service";
import { createUserService, type UserRepository } from "@/lib/user-service";

const userRepository: UserRepository = {
  findByNicknameNormalized(nicknameNormalized) {
    return db.user.findUnique({ where: { nicknameNormalized } });
  },
  create(input) {
    return db.user.create({ data: input });
  },
};

const favoritesRepository: FavoritesRepository = {
  async listIds(userId) {
    const rows = await db.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { pokemonId: true },
    });
    return rows.map((row) => row.pokemonId);
  },
  async list(userId) {
    return db.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { pokemonId: true, createdAt: true },
    });
  },
  async add(userId, pokemonId) {
    await db.favorite.upsert({
      where: { userId_pokemonId: { userId, pokemonId } },
      update: {},
      create: { userId, pokemonId },
    });
  },
  async remove(userId, pokemonId) {
    await db.favorite.deleteMany({ where: { userId, pokemonId } });
  },
  async isFavorite(userId, pokemonId) {
    const found = await db.favorite.findUnique({
      where: { userId_pokemonId: { userId, pokemonId } },
      select: { id: true },
    });
    return found !== null;
  },
};

export const userService = createUserService(userRepository);
export const favoritesService = createFavoritesService(favoritesRepository);

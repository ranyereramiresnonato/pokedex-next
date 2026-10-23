"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { favoritesService } from "@/lib/db-services";
import { InvalidPokemonIdError } from "@/lib/favorites-service";
import { pokemonIdSchema } from "@/lib/validations";

export type FavoriteActionResult =
  | { ok: true; favorited: boolean }
  | { ok: false; error: string; requiresAuth?: boolean };

export async function setFavoriteAction(
  pokemonId: number,
  favorite: boolean,
): Promise<FavoriteActionResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      error: "Entre na sua conta para favoritar Pokémon.",
      requiresAuth: true,
    };
  }

  const parsedId = pokemonIdSchema.safeParse(pokemonId);
  if (!parsedId.success) {
    return { ok: false, error: "ID de Pokémon inválido." };
  }

  try {
    if (favorite) {
      await favoritesService.add(userId, parsedId.data);
    } else {
      await favoritesService.remove(userId, parsedId.data);
    }
  } catch (error) {
    if (error instanceof InvalidPokemonIdError) {
      return { ok: false, error: "ID de Pokémon inválido." };
    }
    console.error("Falha ao atualizar favorito");
    return { ok: false, error: "Não foi possível atualizar o favorito." };
  }

  revalidatePath("/pokemon");
  revalidatePath("/favorites");
  revalidatePath(`/pokemon/${parsedId.data}`);

  return { ok: true, favorited: favorite };
}

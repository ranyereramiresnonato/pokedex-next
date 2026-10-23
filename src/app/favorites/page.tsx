import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { PokemonGrid } from "@/components/pokemon-grid";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { favoritesService } from "@/lib/db-services";
import { getFavoriteSummaries } from "@/lib/pokedex-data";
import type { PokemonSummary } from "@/types/pokeapi";

export const metadata: Metadata = {
  title: "Meus favoritos",
  description: "Sua coleção privada de Pokémon favoritos.",
};

export default async function FavoritesPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login?callbackUrl=%2Ffavorites");
  }

  let favorites;
  try {
    favorites = await favoritesService.list(userId);
  } catch (error) {
    console.error("Falha ao carregar favoritos", error);
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Não foi possível carregar seus favoritos"
          message="Não foi possível abrir sua coleção agora. Tente novamente em instantes."
        />
      </div>
    );
  }

  const favoriteIds = favorites.map((favorite) => favorite.pokemonId);

  let pokemons: PokemonSummary[];
  if (favoriteIds.length > 0) {
    try {
      pokemons = await getFavoriteSummaries(favoriteIds);
    } catch (error) {
      console.error("Falha ao carregar detalhes dos favoritos", error);
      return (
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ErrorState
            title="Não foi possível carregar os Pokémon favoritos"
            message="Sua coleção está salva, mas não conseguimos buscar as imagens agora. Tente novamente."
          />
        </div>
      );
    }
  } else {
    pokemons = [];
  }

  const favoriteIdSet = new Set(favoriteIds);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-900/[0.06] bg-white/75 px-5 py-8 shadow-[0_1px_2px_rgba(29,35,51,0.04),0_24px_50px_-34px_rgba(29,35,51,0.5)] backdrop-blur sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-2xl"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200/70 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            Coleção privada
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Meus <span className="text-red-600">favoritos</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {pokemons.length > 0
              ? `${pokemons.length} Pokémon salvo${pokemons.length === 1 ? "" : "s"} na sua coleção. Os mais recentes aparecem primeiro.`
              : "Salve Pokémon usando o coração nos cards e nos detalhes. Sua lista fica vinculada apenas à sua conta."}
          </p>
        </div>
      </section>

      <div className="mt-8">
        {pokemons.length > 0 ? (
          <PokemonGrid
            pokemons={pokemons}
            favoriteIds={favoriteIdSet}
            isAuthenticated
          />
        ) : (
          <EmptyState
            title="Sua coleção está vazia"
            description="Explore a Pokédex e toque no coração para guardar seus Pokémon favoritos. Eles ficarão aqui esperando por você."
            actionHref="/pokemon"
            actionLabel="Explorar a Pokédex"
          />
        )}
      </div>
    </div>
  );
}

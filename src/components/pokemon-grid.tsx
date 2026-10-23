import { PokemonCard } from "@/components/pokemon-card";
import type { PokemonSummary } from "@/types/pokeapi";

type PokemonGridProps = {
  pokemons: PokemonSummary[];
  favoriteIds: ReadonlySet<number>;
  isAuthenticated: boolean;
};

export function PokemonGrid({
  pokemons,
  favoriteIds,
  isAuthenticated,
}: PokemonGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {pokemons.map((pokemon) => (
        <li key={pokemon.id} className="h-full">
          <PokemonCard
            pokemon={pokemon}
            isFavorite={favoriteIds.has(pokemon.id)}
            isAuthenticated={isAuthenticated}
          />
        </li>
      ))}
    </ul>
  );
}

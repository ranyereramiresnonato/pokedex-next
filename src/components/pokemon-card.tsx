import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { SafeImage } from "@/components/safe-image";
import { TypeBadge } from "@/components/type-badge";
import { formatName } from "@/lib/pokemon";
import type { PokemonSummary } from "@/types/pokeapi";

type PokemonCardProps = {
  pokemon: PokemonSummary;
  isFavorite: boolean;
  isAuthenticated: boolean;
};

export function PokemonCard({
  pokemon,
  isFavorite,
  isAuthenticated,
}: PokemonCardProps) {
  const number = `#${String(pokemon.id).padStart(4, "0")}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-900/[0.07] bg-white/85 shadow-[0_1px_2px_rgba(29,35,51,0.04),0_18px_36px_-24px_rgba(29,35,51,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-red-200/80 hover:shadow-[0_1px_2px_rgba(29,35,51,0.04),0_24px_44px_-20px_rgba(214,40,40,0.28)]">
      <div className="relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 pt-5">
        <span className="absolute left-4 top-4 font-mono text-[11px] font-semibold tracking-wider text-slate-400">
          {number}
        </span>
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton
            pokemonId={pokemon.id}
            initialFavorite={isFavorite}
            isAuthenticated={isAuthenticated}
            callbackUrl="/pokemon"
          />
        </div>
        <Link
          href={`/pokemon/${pokemon.id}`}
          className="flex h-40 w-full items-center justify-center rounded-2xl p-2 sm:h-44"
          aria-label={`Ver detalhes de ${formatName(pokemon.name)}`}
        >
          <SafeImage
            src={pokemon.sprite}
            alt={formatName(pokemon.name)}
            className="h-36 w-36 object-contain drop-shadow-[0_14px_14px_rgba(29,35,51,0.15)] transition-transform duration-300 group-hover:scale-105 sm:h-40 sm:w-40"
            wrapperClassName="h-full w-full items-center justify-center bg-transparent"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 pt-3">
        <Link
          href={`/pokemon/${pokemon.id}`}
          className="text-base font-bold text-slate-900 transition-colors hover:text-red-700"
        >
          {formatName(pokemon.name)}
        </Link>
        <div className="flex min-h-6 flex-wrap content-start gap-1.5">
          {pokemon.types.length > 0 ? (
            pokemon.types.map((type) => <TypeBadge key={type} type={type} compact />)
          ) : (
            <span className="text-xs text-slate-400">Tipos indisponíveis</span>
          )}
        </div>
      </div>
    </article>
  );
}

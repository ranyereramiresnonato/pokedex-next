import { SafeImage } from "@/components/safe-image";
import { collectSprites } from "@/lib/pokemon";
import type { PokemonSprites } from "@/types/pokeapi";

type SpriteGalleryProps = {
  sprites: PokemonSprites;
  name: string;
};

export function SpriteGallery({ sprites, name }: SpriteGalleryProps) {
  const main = collectSprites(sprites);

  if (main.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Nenhum sprite disponível para este Pokémon.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {main.map((sprite) => (
        <li
          key={sprite.url}
          className="group rounded-2xl border border-slate-900/[0.07] bg-white/70 p-3"
        >
          <div className="flex h-32 items-center justify-center rounded-xl bg-slate-50/80">
            <SafeImage
              src={sprite.url}
              alt={`${name} — ${sprite.label}`}
              className="h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105"
              wrapperClassName="h-28 w-28 items-center justify-center bg-transparent"
            />
          </div>
          <p className="mt-2 truncate text-center text-[11px] font-medium text-slate-500">
            {sprite.label}
          </p>
        </li>
      ))}
    </ul>
  );
}

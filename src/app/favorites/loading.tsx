import { PokemonGridSkeleton } from "@/components/skeletons";

export default function LoadingFavoritesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="h-48 animate-pulse rounded-[2rem] border border-slate-900/[0.06] bg-white/70" />
      <div className="mt-8">
        <PokemonGridSkeleton count={8} />
      </div>
    </div>
  );
}

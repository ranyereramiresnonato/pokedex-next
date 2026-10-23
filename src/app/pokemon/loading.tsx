import { PokemonGridSkeleton } from "@/components/skeletons";

export default function LoadingPokemonPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="h-56 animate-pulse rounded-[2rem] border border-slate-900/[0.06] bg-white/70" />
      <div className="mt-8 space-y-3">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-slate-200/80" />
      </div>
      <div className="mt-5">
        <PokemonGridSkeleton count={12} />
      </div>
    </div>
  );
}

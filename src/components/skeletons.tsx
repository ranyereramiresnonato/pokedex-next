export function PokemonCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-900/[0.06] bg-white/80">
      <div className="flex h-48 items-center justify-center bg-slate-100/70">
        <div className="h-28 w-28 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function PokemonGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {Array.from({ length: count }, (_, index) => (
        <PokemonCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="h-[26rem] animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-200/70" />
        </div>
      </div>
      <div className="mt-6 h-64 animate-pulse rounded-3xl bg-slate-200/60" />
    </div>
  );
}

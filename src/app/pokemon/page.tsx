import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Pagination } from "@/components/pagination";
import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchForm } from "@/components/search-form";
import { getSessionContext } from "@/lib/auth-helpers";
import { getCatalogPage } from "@/lib/pokedex-data";

export const metadata: Metadata = {
  title: "Explorar Pokémon",
  description:
    "Conheça todos os Pokémon, suas histórias, tipos e evoluções.",
};

type PokemonPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function PokemonPage({
  searchParams,
}: PokemonPageProps) {
  const params = await searchParams;
  const query = firstValue(params.q).slice(0, 60);
  const rawPage = Number.parseInt(firstValue(params.page), 10);
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  let catalog;
  let session;
  try {
    [catalog, session] = await Promise.all([
      getCatalogPage(requestedPage, query),
      getSessionContext(),
    ]);
  } catch (error) {
    console.error("Falha ao carregar o catálogo", error);
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Não foi possível abrir a Pokédex"
          message="Não foi possível sintonizar a Pokédex. Verifique sua conexão e tente novamente."
        />
      </div>
    );
  }

  const start = (catalog.page - 1) * catalog.pageSize + 1;
  const end = Math.min(catalog.page * catalog.pageSize, catalog.total);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-900/[0.06] bg-white/75 px-5 py-8 shadow-[0_1px_2px_rgba(29,35,51,0.04),0_24px_50px_-34px_rgba(29,35,51,0.5)] backdrop-blur sm:px-8 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-amber-300/15 blur-2xl"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200/70 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            Pokédex Nacional · todos os Pokémon
          </span>
          <h1 className="mt-4 max-w-2xl text-balance text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Explore a <span className="text-red-600">Pokédex</span>
          </h1>
          <p className="mt-3 max-w-2xl text-balance text-sm leading-relaxed text-slate-600 sm:text-base">
            Conheça cada Pokémon, sua história, tipo, habitat e evolução —
            e guarde seus favoritos na sua coleção de treinador.
          </p>
          <div className="mt-6 max-w-3xl">
            <SearchForm key={query} initialQuery={query} />
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {catalog.query ? "Resultados da busca" : "Pokémon registrados"}
          </h2>
          <p className="mt-1 text-sm text-slate-500" aria-live="polite">
            {catalog.query ? (
              <>
                {catalog.total} resultado{catalog.total === 1 ? "" : "s"} para{" "}
                <span className="font-semibold text-slate-700">
                  “{catalog.query}”
                </span>
              </>
            ) : (
              <>
                {catalog.total} Pokémon na Pokédex · exibindo {start}–{end}
              </>
            )}
          </p>
        </div>
        {catalog.query ? (
          <Link
            href="/pokemon"
            className="rounded-full border border-slate-900/10 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-red-200 hover:text-red-700"
          >
            Limpar busca
          </Link>
        ) : null}
      </div>

      <div className="mt-5">
        {catalog.items.length > 0 ? (
          <PokemonGrid
            pokemons={catalog.items}
            favoriteIds={session.favoriteIds}
            isAuthenticated={session.isAuthenticated}
          />
        ) : (
          <EmptyState
            title="Nenhum Pokémon encontrado"
            description={`Não encontramos resultados para “${catalog.query}”. Tente outro nome ou limpe a busca para voltar à Pokédex completa.`}
            actionHref="/pokemon"
            actionLabel="Limpar busca"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          page={catalog.page}
          totalPages={catalog.totalPages}
          query={catalog.query}
        />
      </div>
    </div>
  );
}

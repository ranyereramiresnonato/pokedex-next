import Link from "next/link";
import { buildPageNumbers } from "@/lib/pokemon";

type PaginationProps = {
  page: number;
  totalPages: number;
  query: string;
};

function hrefFor(page: number, query: string): string {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const queryString = params.toString();
  return `/pokemon${queryString ? `?${queryString}` : ""}`;
}

export function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageNumbers(page, totalPages);
  const baseClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors";

  return (
    <nav
      aria-label="Paginação da Pokédex"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1, query)}
          className={`${baseClass} border-slate-900/10 bg-white text-slate-600 hover:border-red-200 hover:text-red-700`}
          rel="prev"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="ml-1 hidden sm:inline">Anterior</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={`${baseClass} cursor-not-allowed border-slate-900/5 bg-slate-100 text-slate-400`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="ml-1 hidden sm:inline">Anterior</span>
        </span>
      )}

      <div className="flex items-center gap-1">
        {pages.map((item) => {
          if (typeof item !== "number") {
            return (
              <span
                key={item}
                aria-hidden="true"
                className="px-1 text-sm text-slate-400"
              >
                …
              </span>
            );
          }
          const isCurrent = item === page;
          return (
            <Link
              key={item}
              href={hrefFor(item, query)}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Página ${item}`}
              className={`${baseClass} ${
                isCurrent
                  ? "border-red-600 bg-red-600 text-white shadow-sm shadow-red-600/25"
                  : "border-slate-900/10 bg-white text-slate-600 hover:border-red-200 hover:text-red-700"
              }`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1, query)}
          className={`${baseClass} border-slate-900/10 bg-white text-slate-600 hover:border-red-200 hover:text-red-700`}
          rel="next"
        >
          <span className="mr-1 hidden sm:inline">Próxima</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={`${baseClass} cursor-not-allowed border-slate-900/5 bg-slate-100 text-slate-400`}
        >
          <span className="mr-1 hidden sm:inline">Próxima</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      )}

      <span className="ml-1 hidden text-xs text-slate-500 md:inline">
        Página {page} de {totalPages}
      </span>
    </nav>
  );
}

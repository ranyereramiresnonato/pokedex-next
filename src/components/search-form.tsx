"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

type SearchFormProps = {
  initialQuery: string;
};

export function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const lastPushed = useRef(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === lastPushed.current.trim()) {
      return;
    }

    const timer = window.setTimeout(() => {
      lastPushed.current = trimmed;
      const params = new URLSearchParams();
      if (trimmed) {
        params.set("q", trimmed);
      }
      const queryString = params.toString();
      startTransition(() => {
        router.replace(`/pokemon${queryString ? `?${queryString}` : ""}`, {
          scroll: false,
        });
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [value, router]);

  function navigate(nextValue: string) {
    const trimmed = nextValue.trim();
    lastPushed.current = trimmed;
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    const queryString = params.toString();
    startTransition(() => {
      router.replace(`/pokemon${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(value);
  }

  function handleClear() {
    setValue("");
    navigate("");
    inputRef.current?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <label htmlFor="pokemon-search" className="sr-only">
          Buscar Pokémon por nome
        </label>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          id="pokemon-search"
          name="q"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Busque por nome: pika, char, eevee…"
          autoComplete="off"
          maxLength={60}
          aria-describedby="search-help"
          className="h-12 w-full rounded-2xl border border-slate-900/10 bg-white/90 pl-11 pr-24 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100 [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              Limpar
            </button>
          ) : null}
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-600"
          >
            Buscar
          </button>
        </div>
      </div>
      <p id="search-help" className="text-xs text-slate-500 sm:w-52 sm:text-right">
        Digite parte do nome. A Pokédex encontra o resto.
      </p>
      <span aria-live="polite" className="sr-only">
        {isPending ? "Atualizando resultados…" : ""}
      </span>
    </form>
  );
}

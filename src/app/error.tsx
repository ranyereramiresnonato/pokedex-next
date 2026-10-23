"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span
        aria-hidden="true"
        className="grid h-16 w-16 place-items-center rounded-full bg-red-50 text-2xl font-bold text-red-600"
      >
        !
      </span>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
        Algo deu errado
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        Ocorreu um erro inesperado ao renderizar esta página. Você pode tentar
        novamente ou voltar para a Pokédex.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Tentar novamente
        </button>
        <Link
          href="/pokemon"
          className="rounded-full border border-slate-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-red-200 hover:text-red-700"
        >
          Voltar para a Pokédex
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  compact?: boolean;
};

export function ErrorState({
  title = "Algo deu errado",
  message = "A Pokédex não conseguiu responder. Verifique sua conexão e tente novamente.",
  compact = false,
}: ErrorStateProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-white/80 text-center ${
        compact ? "px-6 py-10" : "px-6 py-16"
      }`}
    >
      <span
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-2xl text-red-600"
      >
        !
      </span>
      <h2 className="mt-4 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
        {message}
      </p>
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        disabled={isPending}
        className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        {isPending ? "Tentando…" : "Tentar novamente"}
      </button>
    </div>
  );
}

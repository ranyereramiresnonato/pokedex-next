"use client";

import { useRouter } from "next/navigation";
import { useState, useOptimistic, useTransition } from "react";
import { setFavoriteAction } from "@/app/favorites/actions";

type FavoriteButtonProps = {
  pokemonId: number;
  initialFavorite: boolean;
  isAuthenticated: boolean;
  callbackUrl?: string;
  withLabel?: boolean;
  size?: "sm" | "lg";
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

export function FavoriteButton({
  pokemonId,
  initialFavorite,
  isAuthenticated,
  callbackUrl = `/pokemon/${pokemonId}`,
  withLabel = false,
  size = "sm",
}: FavoriteButtonProps) {
  const router = useRouter();
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(initialFavorite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function goToLogin() {
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  function handleClick() {
    if (!isAuthenticated) {
      goToLogin();
      return;
    }

    setError(null);
    startTransition(async () => {
      setOptimisticFavorite(!optimisticFavorite);
      const result = await setFavoriteAction(pokemonId, !optimisticFavorite);
      if (!result.ok) {
        setError(result.error);
        if (result.requiresAuth) {
          goToLogin();
        }
      }
    });
  }

  const baseSize =
    size === "lg" ? "h-12 min-w-12 px-4 gap-2 text-sm" : "h-10 w-10";

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={optimisticFavorite}
        aria-label={
          optimisticFavorite
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
        }
        title={optimisticFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className={`inline-flex items-center justify-center rounded-full border font-semibold shadow-sm transition-all disabled:cursor-wait disabled:opacity-70 ${baseSize} ${
          optimisticFavorite
            ? "border-red-200 bg-red-600 text-white hover:bg-red-700"
            : "border-slate-900/10 bg-white/90 text-slate-500 hover:border-red-200 hover:text-red-600"
        }`}
      >
        <HeartIcon filled={optimisticFavorite} />
        {withLabel ? (
          <span>{optimisticFavorite ? "Favorito" : "Favoritar"}</span>
        ) : null}
      </button>
      <span aria-live="polite" className="sr-only">
        {error ?? (optimisticFavorite ? "Nos favoritos" : "Fora dos favoritos")}
      </span>
      {error ? (
        <span className="mt-1 max-w-44 text-right text-[11px] text-red-700">
          {error}
        </span>
      ) : null}
    </span>
  );
}

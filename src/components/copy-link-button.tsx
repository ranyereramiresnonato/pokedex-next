"use client";

import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "error";

function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  return copied;
}

export function CopyLinkButton() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      const url = window.location.href;
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (!legacyCopy(url)) {
        throw new Error("clipboard unavailable");
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar link deste Pokémon"
        title="Copiar link deste Pokémon"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-white/90 px-4 text-sm font-semibold text-slate-500 shadow-sm transition-all hover:border-red-200 hover:text-red-600"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {status === "copied" ? (
            <path d="m5 12 4 4L19 6" />
          ) : (
            <>
              <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
            </>
          )}
        </svg>
        <span>
          {status === "copied"
            ? "Link copiado"
            : status === "error"
              ? "Tente de novo"
              : "Copiar link"}
        </span>
      </button>
      <span aria-live="polite" className="sr-only">
        {status === "copied"
          ? "Link copiado para a área de transferência."
          : status === "error"
            ? "Não foi possível copiar o link."
            : ""}
      </span>
    </span>
  );
}

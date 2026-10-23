/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { PokeballIcon } from "@/components/pokeball-icon";

type SafeImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "eager" | "lazy";
};

export function SafeImage({
  src,
  alt,
  className,
  wrapperClassName,
  loading = "lazy",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={`grid place-items-center bg-slate-100/80 ${wrapperClassName ?? ""}`}
        role="img"
        aria-label={`${alt} (imagem indisponível)`}
      >
        <PokeballIcon className="h-1/2 w-1/2 max-h-16 max-w-16 opacity-25" />
      </span>
    );
  }

  return (
    <span className={`inline-flex ${wrapperClassName ?? ""}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onError={() => setFailed(true)}
        className={className}
      />
    </span>
  );
}

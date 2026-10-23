import Link from "next/link";
import { PokeballIcon } from "@/components/pokeball-icon";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-900/15 bg-white/60 px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-100">
        <PokeballIcon className="h-9 w-9 opacity-40" />
      </span>
      <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

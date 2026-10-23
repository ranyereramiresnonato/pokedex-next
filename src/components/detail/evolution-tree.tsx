import { Fragment } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { extractIdFromUrl, officialArtworkUrl } from "@/lib/pokemon-api";
import { describeEvolution, formatName } from "@/lib/pokemon";
import type { EvolutionChainLink, EvolutionDetail } from "@/types/pokeapi";

type EvolutionTreeProps = {
  chain: EvolutionChainLink;
  currentId: number;
};

function collectPaths(link: EvolutionChainLink): EvolutionChainLink[][] {
  if (link.evolves_to.length === 0) {
    return [[link]];
  }

  return link.evolves_to.flatMap((child) =>
    collectPaths(child).map((path) => [link, ...path]),
  );
}

function EvolutionCard({
  link,
  currentId,
}: {
  link: EvolutionChainLink;
  currentId: number;
}) {
  const id = extractIdFromUrl(link.species.url);
  const isCurrent = id === currentId;

  return (
    <Link
      href={id ? `/pokemon/${id}` : "#"}
      aria-current={isCurrent ? "page" : undefined}
      className={`flex w-36 shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-colors lg:w-40 ${
        isCurrent
          ? "border-red-300 bg-red-50/80"
          : "border-slate-900/[0.07] bg-white/70 hover:border-red-200 hover:bg-white"
      }`}
    >
      <span className="grid h-24 w-24 place-items-center rounded-xl bg-slate-50/80 sm:h-28 sm:w-28">
        <SafeImage
          src={id ? officialArtworkUrl(id) : null}
          alt={formatName(link.species.name)}
          className="h-20 w-20 object-contain sm:h-28 sm:w-28"
          wrapperClassName="h-20 w-20 items-center justify-center bg-transparent sm:h-28 sm:w-28"
        />
      </span>
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {id ? `#${String(id).padStart(4, "0")}` : "—"}
          {link.is_baby ? " · Bebê" : ""}
        </span>
        <span className="mt-0.5 block text-sm font-bold leading-tight text-slate-900">
          {formatName(link.species.name)}
        </span>
        {isCurrent ? (
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-red-600">
            Este Pokémon
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function EvolutionConditions({
  details,
}: {
  details: readonly EvolutionDetail[];
}) {
  const conditions = [
    ...new Set(
      details
        .map((detail) =>
          describeEvolution(detail, { includeLevel: false, fallback: "" }),
        )
        .filter(Boolean),
    ),
  ];

  if (conditions.length === 0) {
    return null;
  }

  return (
    <span className="flex w-24 flex-col items-center gap-1 lg:w-28">
      {conditions.map((condition) => (
        <span
          key={condition}
          className="rounded-lg border border-amber-200/80 bg-amber-50 px-2 py-1 text-center text-[10px] font-medium leading-tight text-amber-900"
        >
          {condition}
        </span>
      ))}
    </span>
  );
}

function EvolutionConnector({
  details,
}: {
  details: readonly EvolutionDetail[];
}) {
  return (
    <div className="flex w-24 shrink-0 flex-col items-center gap-1.5 lg:w-28">
      <span aria-hidden="true" className="text-xl leading-none text-slate-300">
        →
      </span>
      <EvolutionConditions details={details} />
    </div>
  );
}

export function EvolutionTree({ chain, currentId }: EvolutionTreeProps) {
  const paths = collectPaths(chain);

  return (
    <div className="space-y-4">
      {paths.map((path) => (
        <div
          key={path.map((link) => link.species.name).join(">")}
          className="overflow-x-auto pb-2"
        >
          <ol className="flex w-max flex-col items-center gap-2 sm:flex-row sm:gap-2.5 lg:gap-3">
            {path.map((link, index) => (
              <Fragment key={`${link.species.name}-${index}`}>
                {index > 0 ? (
                  <li aria-hidden="true">
                    <EvolutionConnector details={link.evolution_details} />
                  </li>
                ) : null}
                <li>
                  <EvolutionCard link={link} currentId={currentId} />
                </li>
              </Fragment>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

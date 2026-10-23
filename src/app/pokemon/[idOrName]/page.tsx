import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/copy-link-button";
import { ErrorState } from "@/components/error-state";
import { FavoriteButton } from "@/components/favorite-button";
import { SafeImage } from "@/components/safe-image";
import { SectionCard, InfoItem } from "@/components/section-card";
import { StatBar } from "@/components/stat-bar";
import { TypeBadge } from "@/components/type-badge";
import { EvolutionTree } from "@/components/detail/evolution-tree";
import { SpriteGallery } from "@/components/detail/sprite-gallery";
import { getSessionContext } from "@/lib/auth-helpers";
import { getPokemonDetailData } from "@/lib/pokedex-data";
import {
  cleanFlavorText,
  dedupeFlavorTexts,
  formatColor,
  formatGeneration,
  formatHabitat,
  formatHeight,
  formatName,
  formatPercent,
  formatShape,
  formatWeight,
  genderInfo,
  getGenus,
  getLocalizedEntry,
  getLocalizedName,
  totalStats,
} from "@/lib/pokemon";
import {
  extractIdFromUrl,
  getPokemon,
  getPokemonSpecies,
  isPokeApiNotFound,
  officialArtworkUrl,
} from "@/lib/pokemon-api";

type DetailPageProps = {
  params: Promise<{ idOrName: string }>;
};

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { idOrName } = await params;
  try {
    const id = safeDecode(idOrName);
    const pokemon = await getPokemon(id);
    const species = await getPokemonSpecies(pokemon.species.name);
    const name = formatName(pokemon.name);
    const genus = getGenus(species);
    return {
      title: `${name} · #${String(pokemon.id).padStart(4, "0")}`,
      description:
        genus ??
        `Informações, evolução e sprites de ${name} na Pokédex.`,
    };
  } catch (error) {
    if (isPokeApiNotFound(error)) {
      notFound();
    }
    return { title: "Detalhes do Pokémon" };
  }
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { idOrName } = await params;

  let data;
  try {
    data = await getPokemonDetailData(safeDecode(idOrName));
  } catch (error) {
    if (isPokeApiNotFound(error)) {
      notFound();
    }
    console.error("Falha ao carregar detalhes do Pokémon", error);
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Não foi possível carregar este Pokémon"
          message="Não foi possível sintonizar a Pokédex. Verifique sua conexão e tente novamente."
        />
        <div className="mt-6 text-center">
          <Link
            href="/pokemon"
            className="text-sm font-semibold text-red-700 underline decoration-red-300 underline-offset-4"
          >
            Voltar para a Pokédex
          </Link>
        </div>
      </div>
    );
  }

  const { pokemon, species, evolutionChain, abilities } = data;
  const session = await getSessionContext();
  const isFavorite = session.favoriteIds.has(pokemon.id);
  const primaryType = pokemon.types[0]?.type.name ?? "normal";
  const heroColor =
    primaryType === "fire"
      ? "#ee8130"
      : primaryType === "water"
        ? "#6390f0"
        : primaryType === "grass"
          ? "#63b64a"
          : primaryType === "electric"
            ? "#e8c616"
            : primaryType === "psychic"
              ? "#f95587"
              : "#d62828";

  const localizedName = getLocalizedName(species.names, pokemon.name);
  const genus = getGenus(species);
  const description = dedupeFlavorTexts(species.flavor_text_entries);
  const gender = genderInfo(species.gender_rate);
  const statsTotal = totalStats(pokemon.stats);

  const abilityMap = new Map(abilities.map((ability) => [ability.name, ability]));
  const artwork =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default ??
    officialArtworkUrl(pokemon.id);
  const varieties = species.varieties.map((variety) => {
    const id = extractIdFromUrl(variety.pokemon.url);
    return {
      name: variety.pokemon.name,
      id,
      isDefault: variety.is_default,
    };
  });

  const sections = [
    { id: "sobre", label: "Ficha" },
    { id: "estatisticas", label: "Estatísticas" },
    { id: "habilidades", label: "Habilidades" },
    { id: "evolucao", label: "Evolução" },
    { id: "sprites", label: "Sprites" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href="/pokemon"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-red-700"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Voltar para a Pokédex
      </Link>

      <section className="relative mt-4 overflow-hidden rounded-[2rem] border border-slate-900/[0.07] bg-white/80 shadow-[0_1px_2px_rgba(29,35,51,0.04),0_28px_60px_-38px_rgba(29,35,51,0.55)] backdrop-blur">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-400"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(circle at 82% 12%, ${heroColor}30, transparent 26rem), radial-gradient(circle at 6% 92%, ${heroColor}18, transparent 24rem)`,
          }}
        />
        <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.08fr] lg:items-center">
          <div>
            <div className="flex items-center justify-center rounded-3xl border border-white/70 bg-white/55 p-4 backdrop-blur">
              <SafeImage
                src={artwork}
                alt={`Arte oficial de ${localizedName}`}
                className="h-64 w-64 object-contain drop-shadow-[0_24px_28px_rgba(29,35,51,0.22)] sm:h-80 sm:w-80 lg:h-96 lg:w-96"
                wrapperClassName="h-full w-full items-center justify-center bg-transparent"
                loading="eager"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-wider text-slate-400">
                #{String(pokemon.id).padStart(4, "0")}
              </span>
              {species.is_baby ? (
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  Bebê
                </span>
              ) : null}
              {species.is_legendary ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Lendário
                </span>
              ) : null}
              {species.is_mythical ? (
                <span className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-fuchsia-700">
                  Mítico
                </span>
              ) : null}
              {!pokemon.is_default ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Forma alternativa
                </span>
              ) : null}
            </div>

            <h1 className="mt-2 text-balance text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {localizedName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {genus ?? "Pokémon"}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {pokemon.types.map((entry) => (
                <TypeBadge key={entry.type.name} type={entry.type.name} size="md" />
              ))}
              <FavoriteButton
                pokemonId={pokemon.id}
                initialFavorite={isFavorite}
                isAuthenticated={session.isAuthenticated}
                callbackUrl={`/pokemon/${pokemon.id}`}
                withLabel
                size="lg"
              />
              <CopyLinkButton />
            </div>

            {description[0] ? (
              <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-slate-600">
                {description[0].text}
              </p>
            ) : null}

            <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <InfoItem label="Altura" value={formatHeight(pokemon.height)} />
              <InfoItem label="Peso" value={formatWeight(pokemon.weight)} />
              <InfoItem label="Categoria" value={genus ?? "Não disponível"} />
              <InfoItem
                label="Gênero ao nascer"
                value={
                  gender.genderless ? (
                    "Sem gênero"
                  ) : (
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sky-600">
                        ♂ {formatPercent(gender.male)} macho
                      </span>
                      <span className="text-pink-600">
                        ♀ {formatPercent(gender.female)} fêmea
                      </span>
                    </span>
                  )
                }
              />
            </dl>

            {pokemon.cries?.latest || pokemon.cries?.legacy ? (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ouça este Pokémon
                </p>
                <div className="flex flex-wrap gap-3">
                  {pokemon.cries?.latest ? (
                    <label className="flex flex-col gap-1 text-[11px] text-slate-500">
                      Grito atual
                      <audio
                        controls
                        preload="none"
                        src={pokemon.cries.latest}
                        className="h-9 w-56"
                      >
                        Seu navegador não suporta áudio.
                      </audio>
                    </label>
                  ) : null}
                  {pokemon.cries?.legacy ? (
                    <label className="flex flex-col gap-1 text-[11px] text-slate-500">
                      Grito clássico
                      <audio
                        controls
                        preload="none"
                        src={pokemon.cries.legacy}
                        className="h-9 w-56"
                      >
                        Seu navegador não suporta áudio.
                      </audio>
                    </label>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <nav
        aria-label="Seções do Pokémon"
        className="no-scrollbar sticky top-[4.6rem] z-20 mt-5 flex gap-1.5 overflow-x-auto rounded-2xl border border-slate-900/[0.06] bg-white/85 p-1.5 shadow-sm backdrop-blur"
      >
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="mt-5 grid gap-5">
        <SectionCard
          id="sobre"
          title="Ficha da Pokédex"
          description="Tudo o que um treinador precisa saber sobre este Pokémon."
        >
          <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <InfoItem
              label="Número da Pokédex"
              value={`#${String(pokemon.id).padStart(4, "0")}`}
            />
            <InfoItem label="Categoria" value={genus ?? "Não disponível"} />
            <InfoItem
              label="Cor"
              value={
                species.color ? formatColor(species.color.name) : "Não disponível"
              }
            />
            <InfoItem
              label="Forma"
              value={
                species.shape ? formatShape(species.shape.name) : "Não disponível"
              }
            />
            <InfoItem
              label="Habitat"
              value={
                species.habitat
                  ? formatHabitat(species.habitat.name)
                  : "Não disponível"
              }
            />
            <InfoItem
              label="Geração"
              value={
                species.generation
                  ? formatGeneration(species.generation.name)
                  : "Não disponível"
              }
            />
          </dl>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Entradas da Pokédex
              </h3>
              {description.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {description.map((entry) => (
                    <li
                      key={entry.text}
                      className="rounded-2xl border border-slate-900/[0.06] bg-white/70 px-4 py-3"
                    >
                      <p className="text-sm leading-relaxed text-slate-600">
                        {entry.text}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Descrição não disponível.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">Variedades</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {varieties.map((variety) => (
                  <li key={variety.name}>
                    <Link
                      href={variety.id ? `/pokemon/${variety.id}` : "#"}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition-colors ${
                        variety.id === pokemon.id
                          ? "border-red-200 bg-red-50/70"
                          : "border-slate-900/[0.07] bg-white/70 hover:border-red-200"
                      }`}
                    >
                      <SafeImage
                        src={variety.id ? officialArtworkUrl(variety.id) : null}
                        alt={formatName(variety.name)}
                        className="h-10 w-10 object-contain"
                        wrapperClassName="h-10 w-10 items-center justify-center bg-transparent"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-slate-800">
                          {variety.id === pokemon.id
                            ? localizedName
                            : formatName(variety.name)}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {variety.isDefault ? "Forma padrão" : "Forma alternativa"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="mt-5 text-sm font-bold text-slate-800">Formas</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {pokemon.forms.map((form) => (
                  <li key={form.name}>
                    <span className="inline-block rounded-full border border-slate-900/[0.07] bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-600">
                      {formatName(form.name)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="estatisticas"
          title="Estatísticas"
          description="Os atributos naturais deste Pokémon."
          action={
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
              Total {statsTotal}
            </span>
          }
        >
          <div className="space-y-3">
            {pokemon.stats.map((stat) => (
              <StatBar
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="habilidades"
          title="Habilidades"
          description="Talentos naturais deste Pokémon, incluindo a habilidade oculta."
        >
          {pokemon.abilities.length > 0 ? (
            <ul className="space-y-3">
              {pokemon.abilities.map((entry) => {
                const ability = abilityMap.get(entry.ability.name);
                const localized = ability
                  ? getLocalizedName(ability.names, entry.ability.name)
                  : formatName(entry.ability.name);
                const flavor = ability
                  ? getLocalizedEntry(ability.flavor_text_entries)
                  : null;
                const effect = ability?.effect_entries.find(
                  (item) => item.language.name === "en",
                );
                const descriptionText = flavor
                  ? cleanFlavorText(flavor.flavor_text)
                  : effect?.short_effect;

                return (
                  <li
                    key={entry.ability.name}
                    className="rounded-2xl border border-slate-900/[0.07] bg-white/70 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {localized}
                      </span>
                      {entry.is_hidden ? (
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                          Oculta
                        </span>
                      ) : null}
                    </div>
                    {descriptionText ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        {descriptionText}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              Nenhuma habilidade conhecida para este Pokémon.
            </p>
          )}
        </SectionCard>

        <SectionCard
          id="evolucao"
          title="Linha evolutiva"
          description="A jornada evolutiva deste Pokémon, com as condições especiais de cada transformação."
        >
          {evolutionChain ? (
            <EvolutionTree chain={evolutionChain.chain} currentId={pokemon.id} />
          ) : (
            <p className="text-sm text-slate-500">
              Este Pokémon não possui cadeia evolutiva disponível.
            </p>
          )}
          {evolutionChain?.chain.evolves_to.length === 0 &&
          evolutionChain.chain.evolution_details.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Este Pokémon não evolui.
            </p>
          ) : null}
        </SectionCard>

        <SectionCard
          id="sprites"
          title="Sprites principais"
          description="As imagens clássicas deste Pokémon na Pokédex."
        >
          <SpriteGallery sprites={pokemon.sprites} name={localizedName} />
        </SectionCard>
      </div>
    </div>
  );
}

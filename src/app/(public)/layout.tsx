import type { ReactNode } from "react";
import { PokeballIcon } from "@/components/pokeball-icon";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-stretch lg:py-16">
      <aside className="relative hidden overflow-hidden rounded-[2rem] bg-slate-900 p-10 text-white shadow-2xl shadow-slate-900/20 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-500/30 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-amber-400/15 blur-2xl"
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <PokeballIcon className="h-11 w-11" />
            <span className="text-xl font-black tracking-tight">
              Poké<span className="text-red-400">dex</span>
            </span>
          </div>
          <h2 className="mt-10 max-w-sm text-balance text-4xl font-black leading-tight tracking-tight">
            Sua coleção de Pokémon começa aqui.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
            Conheça cada Pokémon, sua história, evolução e formas. Crie sua
            conta com apenas um nick e uma senha.
          </p>
        </div>

        <ul className="relative mt-10 space-y-4 text-sm">
          {[
            "Pokédex completa com busca e paginação",
            "Fichas, imagens e linha evolutiva",
            "Favoritos privados para cada treinador",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-slate-200">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-500/20 text-[11px] font-bold text-red-300">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className="relative mt-10 text-xs text-slate-500">
          Uma Pokédex feita para treinadores · sem e-mail, sem complicação.
        </p>
      </aside>

      <div className="card-surface flex items-center rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

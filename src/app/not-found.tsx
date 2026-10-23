import Link from "next/link";
import { PokeballIcon } from "@/components/pokeball-icon";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center">
      <PokeballIcon className="h-20 w-20 opacity-80" />
      <p className="mt-6 font-mono text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
        404
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
        Pokémon não encontrado
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        A página que você procurou não existe ou o Pokémon saiu da Pokédex.
        Volte e continue explorando.
      </p>
      <Link
        href="/pokemon"
        className="mt-8 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        Voltar para a Pokédex
      </Link>
    </div>
  );
}

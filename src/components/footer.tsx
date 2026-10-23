import Link from "next/link";
import { PokeballIcon } from "@/components/pokeball-icon";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-900/5 bg-white/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <PokeballIcon className="h-6 w-6 opacity-80" />
          <span>Uma Pokédex de bolso feita para treinadores.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pokemon" className="hover:text-red-700">
            Explorar
          </Link>
          <Link href="/favorites" className="hover:text-red-700">
            Favoritos
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/app/(public)/actions";
import { NavLinks } from "@/components/nav-links";
import { PokeballIcon } from "@/components/pokeball-icon";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/5 bg-[#f4f5f9]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/pokemon"
          className="group flex items-center gap-2.5 rounded-full py-1 pr-2"
          aria-label="Pokédex — ir para a página inicial"
        >
          <PokeballIcon className="h-9 w-9 transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-lg font-black tracking-tight text-slate-900">
            Poké<span className="text-red-600">dex</span>
          </span>
        </Link>

        <div className="order-3 w-full sm:order-none sm:w-auto">
          <NavLinks />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-sm text-slate-700 sm:flex">
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 place-items-center rounded-full bg-red-600/10 text-xs font-bold text-red-700"
                >
                  {user.name?.slice(0, 1).toUpperCase() ?? "?"}
                </span>
                <span className="max-w-36 truncate font-medium">{user.name}</span>
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-slate-900/10 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:text-red-700"
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

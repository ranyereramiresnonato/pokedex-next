"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/pokemon", label: "Explorar" },
  { href: "/favorites", label: "Favoritos" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="flex items-center gap-1">
      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors sm:px-4 ${
              active
                ? "bg-red-600 text-white shadow-sm shadow-red-600/25"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

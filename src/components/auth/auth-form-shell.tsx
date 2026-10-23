import type { ReactNode } from "react";

type AuthFormShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  notice?: string;
};

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
  notice,
}: AuthFormShellProps) {
  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>

      {notice ? (
        <p
          role="status"
          className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </p>
      ) : null}

      <div className="mt-6">{children}</div>

      <div className="mt-6 border-t border-slate-900/5 pt-5 text-sm text-slate-500">
        {footer}
      </div>
    </div>
  );
}

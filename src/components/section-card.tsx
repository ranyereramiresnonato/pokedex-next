import type { ReactNode } from "react";

type SectionCardProps = {
  id?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  id,
  title,
  description,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-3xl border border-slate-900/[0.07] bg-white/85 p-5 shadow-[0_1px_2px_rgba(29,35,51,0.04),0_18px_36px_-28px_rgba(29,35,51,0.35)] backdrop-blur sm:p-6 ${className ?? ""}`}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function InfoItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

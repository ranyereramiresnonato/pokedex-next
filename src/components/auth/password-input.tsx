"use client";

import { useId, useState } from "react";

type PasswordInputProps = {
  name: string;
  label: string;
  autoComplete: string;
  placeholder?: string;
  errors?: string[];
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
  autoFocus?: boolean;
  hint?: string;
};

export function PasswordInput({
  name,
  label,
  autoComplete,
  placeholder,
  errors,
  defaultValue,
  minLength,
  maxLength = 128,
  autoFocus,
  hint,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(errors && errors.length > 0);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          autoFocus={autoFocus}
          aria-invalid={hasError || undefined}
          aria-describedby={
            [hasError ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`h-12 w-full rounded-2xl border bg-white pl-4 pr-24 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-900/10 focus:border-red-300 focus:ring-red-100"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {hasError ? (
        <p id={errorId} className="text-xs font-medium text-red-700">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}

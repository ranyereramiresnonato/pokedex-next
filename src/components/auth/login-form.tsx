"use client";

import { useActionState } from "react";
import { loginAction, type AuthFormState } from "@/app/(public)/actions";
import { PasswordInput } from "@/components/auth/password-input";

const initialState: AuthFormState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-1.5">
        <label
          htmlFor="login-nickname"
          className="block text-sm font-semibold text-slate-800"
        >
          Nick
        </label>
        <input
          id="login-nickname"
          name="nickname"
          type="text"
          required
          maxLength={20}
          autoComplete="username"
          autoFocus
          placeholder="seu_nick"
          className="h-12 w-full rounded-2xl border border-slate-900/10 bg-white px-4 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100"
        />
      </div>

      <PasswordInput
        name="password"
        label="Senha"
        autoComplete="current-password"
        placeholder="Sua senha"
        maxLength={128}
      />

      {state.error ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-colors hover:bg-red-700 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

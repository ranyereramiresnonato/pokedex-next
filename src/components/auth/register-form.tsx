"use client";

import { useActionState } from "react";
import { registerAction, type AuthFormState } from "@/app/(public)/actions";
import { PasswordInput } from "@/components/auth/password-input";

const initialState: AuthFormState = {};

export function RegisterForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );
  const nicknameErrors = state.fieldErrors?.nickname;
  const passwordErrors = state.fieldErrors?.password;
  const confirmErrors = state.fieldErrors?.confirmPassword;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="space-y-1.5">
        <label
          htmlFor="register-nickname"
          className="block text-sm font-semibold text-slate-800"
        >
          Nick
        </label>
        <input
          id="register-nickname"
          name="nickname"
          type="text"
          required
          minLength={3}
          maxLength={20}
          autoComplete="username"
          autoFocus
          placeholder="treinador_azul"
          aria-invalid={Boolean(nicknameErrors) || undefined}
          aria-describedby={
            [nicknameErrors ? "register-nickname-error" : null, "register-nickname-hint"]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`h-12 w-full rounded-2xl border bg-white px-4 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
            nicknameErrors
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-900/10 focus:border-red-300 focus:ring-red-100"
          }`}
        />
        <p id="register-nickname-hint" className="text-xs text-slate-500">
          3 a 20 caracteres: letras, números e sublinhado (_).
        </p>
        {nicknameErrors ? (
          <p
            id="register-nickname-error"
            className="text-xs font-medium text-red-700"
          >
            {nicknameErrors[0]}
          </p>
        ) : null}
      </div>

      <PasswordInput
        name="password"
        label="Senha"
        autoComplete="new-password"
        placeholder="Mínimo de 8 caracteres"
        errors={passwordErrors}
        minLength={8}
        maxLength={128}
        hint="Use pelo menos 8 caracteres. A senha é armazenada apenas como hash seguro."
      />

      <PasswordInput
        name="confirmPassword"
        label="Confirmar senha"
        autoComplete="new-password"
        placeholder="Repita a senha"
        errors={confirmErrors}
        minLength={8}
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
        {isPending ? "Criando conta…" : "Criar conta"}
      </button>
    </form>
  );
}

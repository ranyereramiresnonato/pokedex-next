"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { userService } from "@/lib/db-services";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { NicknameTakenError } from "@/lib/user-service";
import {
  callbackUrlSchema,
  loginSchema,
  registerSchema,
  type LoginInput,
} from "@/lib/validations";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;
const REGISTER_RATE_LIMIT = 10;
const REGISTER_RATE_WINDOW_MS = 60 * 60 * 1000;

function readCallbackUrl(formData: FormData): string {
  const raw = formData.get("callbackUrl");
  const parsed = callbackUrlSchema.safeParse(raw);
  return parsed.success ? parsed.data : "/pokemon";
}

function formatFieldErrors(
  issues: { path: (string | number)[]; message: string }[],
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= [];
    errors[key].push(issue.message);
  }
  return errors;
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const nickname = String(formData.get("nickname") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = readCallbackUrl(formData);

  const input: LoginInput = { nickname, password };
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Nick ou senha inválidos." };
  }

  const ip = await getClientIp();
  const limited = checkRateLimit(
    `login-action:${ip}`,
    LOGIN_RATE_LIMIT,
    LOGIN_RATE_WINDOW_MS,
  );
  if (!limited.success) {
    return {
      error: `Muitas tentativas. Tente novamente em ${limited.retryAfterSeconds}s.`,
    };
  }

  try {
    await signIn("credentials", {
      nickname: parsed.data.nickname,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Nick ou senha inválidos." };
    }
    throw error;
  }

  return { error: "Nick ou senha inválidos." };
}

export async function registerAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const callbackUrl = readCallbackUrl(formData);
  const parsed = registerSchema.safeParse({
    nickname: String(formData.get("nickname") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsed.success) {
    return {
      error: "Revise os campos destacados.",
      fieldErrors: formatFieldErrors(parsed.error.issues),
    };
  }

  const ip = await getClientIp();
  const limited = checkRateLimit(
    `register:${ip}`,
    REGISTER_RATE_LIMIT,
    REGISTER_RATE_WINDOW_MS,
  );
  if (!limited.success) {
    return {
      error: `Muitas tentativas. Tente novamente em ${limited.retryAfterSeconds}s.`,
    };
  }

  try {
    await userService.register({
      nickname: parsed.data.nickname,
      password: parsed.data.password,
    });
  } catch (error) {
    if (error instanceof NicknameTakenError) {
      return {
        error: "Este nick já está em uso.",
        fieldErrors: { nickname: ["Este nick já está em uso."] },
      };
    }
    console.error("Falha ao cadastrar usuário");
    return { error: "Não foi possível criar sua conta. Tente novamente." };
  }

  try {
    await signIn("credentials", {
      nickname: parsed.data.nickname,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?registered=1");
    }
    throw error;
  }

  redirect(callbackUrl);
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/pokemon" });
}

import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/password";

export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 20;

export const nicknameSchema = z
  .string({ required_error: "Informe um nick." })
  .trim()
  .min(NICKNAME_MIN_LENGTH, `Use pelo menos ${NICKNAME_MIN_LENGTH} caracteres.`)
  .max(NICKNAME_MAX_LENGTH, `Use no máximo ${NICKNAME_MAX_LENGTH} caracteres.`)
  .regex(
    /^[A-Za-z0-9_]+$/,
    "Use apenas letras, números e sublinhado (_).",
  );

export const passwordSchema = z
  .string({ required_error: "Informe uma senha." })
  .min(
    PASSWORD_MIN_LENGTH,
    `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
  );

export const registerSchema = z
  .object({
    nickname: nicknameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  nickname: z.string().trim().min(1).max(NICKNAME_MAX_LENGTH),
  password: z.string().min(1).max(PASSWORD_MAX_LENGTH),
});

export const pokemonIdSchema = z
  .number()
  .int("O ID do Pokémon deve ser um número inteiro.")
  .positive("O ID do Pokémon deve ser positivo.")
  .max(100_000, "ID de Pokémon fora do intervalo esperado.");

export const callbackUrlSchema = z
  .string()
  .startsWith("/", "URL de retorno inválida.")
  .refine((value) => !value.startsWith("//"), "URL de retorno inválida.");

export function normalizeNickname(nickname: string): string {
  return nickname.trim().toLowerCase();
}

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

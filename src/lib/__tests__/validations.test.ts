import { describe, expect, it } from "vitest";
import {
  loginSchema,
  nicknameSchema,
  normalizeNickname,
  passwordSchema,
  pokemonIdSchema,
  registerSchema,
} from "@/lib/validations";

describe("validations", () => {
  it("normaliza o nick removendo espaços e maiúsculas", () => {
    expect(normalizeNickname("  Ash_Ketchum ")).toBe("ash_ketchum");
  });

  it("aceita nick válido", () => {
    expect(nicknameSchema.parse("ash_123")).toBe("ash_123");
  });

  it("rejeita nick curto, longo ou com caracteres inválidos", () => {
    expect(nicknameSchema.safeParse("ab").success).toBe(false);
    expect(nicknameSchema.safeParse("a".repeat(21)).success).toBe(false);
    expect(nicknameSchema.safeParse("ash ketchum").success).toBe(false);
    expect(nicknameSchema.safeParse("ash-ketchum").success).toBe(false);
  });

  it("exige senha entre 8 e 128 caracteres", () => {
    expect(passwordSchema.safeParse("1234567").success).toBe(false);
    expect(passwordSchema.safeParse("12345678").success).toBe(true);
    expect(passwordSchema.safeParse("a".repeat(129)).success).toBe(false);
  });

  it("valida confirmação de senha no cadastro", () => {
    const valid = registerSchema.safeParse({
      nickname: "ash",
      password: "pikachu123",
      confirmPassword: "pikachu123",
    });
    expect(valid.success).toBe(true);

    const invalid = registerSchema.safeParse({
      nickname: "ash",
      password: "pikachu123",
      confirmPassword: "pikachu124",
    });
    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      expect(invalid.error.issues[0]?.message).toBe("As senhas não conferem.");
    }
  });

  it("exige nick e senha no login", () => {
    expect(loginSchema.safeParse({ nickname: "", password: "12345678" }).success).toBe(false);
    expect(loginSchema.safeParse({ nickname: "ash", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ nickname: "ash", password: "12345678" }).success).toBe(true);
  });

  it("valida IDs de Pokémon positivos e inteiros", () => {
    expect(pokemonIdSchema.safeParse(25).success).toBe(true);
    expect(pokemonIdSchema.safeParse(0).success).toBe(false);
    expect(pokemonIdSchema.safeParse(-1).success).toBe(false);
    expect(pokemonIdSchema.safeParse(1.5).success).toBe(false);
    expect(pokemonIdSchema.safeParse(100_001).success).toBe(false);
  });
});

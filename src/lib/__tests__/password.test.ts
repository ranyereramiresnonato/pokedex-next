import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password", () => {
  it("gera hash Argon2id, nunca a senha em texto puro", async () => {
    const password = "pikachu123";
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(hashed.startsWith("$argon2id$")).toBe(true);
    expect(hashed).toContain("m=19456,t=2,p=1");
  });

  it("verifica a senha correta e rejeita a incorreta", async () => {
    const hashed = await hashPassword("pikachu123");

    await expect(verifyPassword(hashed, "pikachu123")).resolves.toBe(true);
    await expect(verifyPassword(hashed, "pikachu124")).resolves.toBe(false);
  });

  it("rejeita hash malformado sem lançar exceção", async () => {
    await expect(verifyPassword("não-é-um-hash", "pikachu123")).resolves.toBe(false);
  });

  it("gera hashes diferentes para a mesma senha (salt aleatório)", async () => {
    const first = await hashPassword("pikachu123");
    const second = await hashPassword("pikachu123");
    expect(first).not.toBe(second);
  });
});

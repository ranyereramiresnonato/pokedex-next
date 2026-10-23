import { describe, expect, it } from "vitest";
import {
  createUserService,
  NicknameTakenError,
  type CreateUserInput,
  type StoredUser,
  type UserRepository,
} from "@/lib/user-service";

function createMemoryRepository(): UserRepository & {
  users: Map<string, StoredUser>;
  lastCreated: CreateUserInput | null;
} {
  const users = new Map<string, StoredUser>();
  const repository = {
    users,
    lastCreated: null as CreateUserInput | null,
    async findByNicknameNormalized(nicknameNormalized: string) {
      return users.get(nicknameNormalized) ?? null;
    },
    async create(input: CreateUserInput) {
      if (users.has(input.nicknameNormalized)) {
        const error = new Error("Unique constraint") as Error & { code: string };
        error.code = "P2002";
        throw error;
      }
      repository.lastCreated = input;
      const user: StoredUser = {
        id: `user-${users.size + 1}`,
        createdAt: new Date("2026-01-01T00:00:00Z"),
        ...input,
      };
      users.set(input.nicknameNormalized, user);
      return user;
    },
  };
  return repository;
}

describe("userService", () => {
  it("cadastra usuário com hash e nunca retorna passwordHash", async () => {
    const repository = createMemoryRepository();
    const service = createUserService(repository);

    const user = await service.register({
      nickname: "Ash",
      password: "pikachu123",
    });

    expect(user).toEqual({
      id: "user-1",
      nickname: "Ash",
      createdAt: new Date("2026-01-01T00:00:00Z"),
    });
    expect("passwordHash" in user).toBe(false);
    expect(repository.lastCreated?.passwordHash).not.toBe("pikachu123");
    expect(repository.lastCreated?.passwordHash.startsWith("$argon2id$")).toBe(true);
    expect(repository.lastCreated?.nicknameNormalized).toBe("ash");
  });

  it("rejeita nick duplicado sem diferenciar maiúsculas/minúsculas", async () => {
    const service = createUserService(createMemoryRepository());
    await service.register({ nickname: "Ash", password: "pikachu123" });

    await expect(
      service.register({ nickname: "ash", password: "outrasenha123" }),
    ).rejects.toBeInstanceOf(NicknameTakenError);

    await expect(
      service.register({ nickname: "ASH", password: "outrasenha123" }),
    ).rejects.toBeInstanceOf(NicknameTakenError);
  });

  it("autentica com a senha correta, ignorando caixa no nick", async () => {
    const service = createUserService(createMemoryRepository());
    await service.register({ nickname: "Ash", password: "pikachu123" });

    const user = await service.authenticate({
      nickname: "aSh",
      password: "pikachu123",
    });

    expect(user?.nickname).toBe("Ash");
    expect(user && "passwordHash" in user).toBe(false);
  });

  it("falha com senha incorreta e com nick inexistente", async () => {
    const service = createUserService(createMemoryRepository());
    await service.register({ nickname: "Ash", password: "pikachu123" });

    await expect(
      service.authenticate({ nickname: "Ash", password: "errada123" }),
    ).resolves.toBeNull();
    await expect(
      service.authenticate({ nickname: "Misty", password: "pikachu123" }),
    ).resolves.toBeNull();
  });
});

import { hashPassword, verifyPassword } from "@/lib/password";
import { normalizeNickname } from "@/lib/validations";

export type StoredUser = {
  id: string;
  nickname: string;
  nicknameNormalized: string;
  passwordHash: string;
  createdAt: Date;
};

export type PublicUser = {
  id: string;
  nickname: string;
  createdAt: Date;
};

export type CreateUserInput = {
  nickname: string;
  nicknameNormalized: string;
  passwordHash: string;
};

export interface UserRepository {
  findByNicknameNormalized(nicknameNormalized: string): Promise<StoredUser | null>;
  create(input: CreateUserInput): Promise<StoredUser>;
}

export class NicknameTakenError extends Error {
  constructor() {
    super("Este nick já está em uso.");
    this.name = "NicknameTakenError";
  }
}

const DUMMY_ARGON2_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$/IOLuEBG8ewBrWDFyNl7Ow$q57Y7OOlEfxuX7FMhVccxgcm0ZwjeCFoAE6Cqfk5ZcE";

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    nickname: user.nickname,
    createdAt: user.createdAt,
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export function createUserService(repository: UserRepository) {
  return {
    async register(input: { nickname: string; password: string }): Promise<PublicUser> {
      const nickname = input.nickname.trim();
      const nicknameNormalized = normalizeNickname(nickname);
      const passwordHash = await hashPassword(input.password);

      try {
        const user = await repository.create({
          nickname,
          nicknameNormalized,
          passwordHash,
        });
        return toPublicUser(user);
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          throw new NicknameTakenError();
        }
        throw error;
      }
    },

    async authenticate(input: {
      nickname: string;
      password: string;
    }): Promise<PublicUser | null> {
      const normalized = normalizeNickname(input.nickname);
      const user = await repository.findByNicknameNormalized(normalized);

      if (!user) {
        await verifyPassword(DUMMY_ARGON2_HASH, input.password);
        return null;
      }

      const valid = await verifyPassword(user.passwordHash, input.password);
      return valid ? toPublicUser(user) : null;
    },
  };
}

export type UserService = ReturnType<typeof createUserService>;

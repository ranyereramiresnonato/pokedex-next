import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  add: vi.fn(),
  remove: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/db-services", () => ({
  favoritesService: {
    add: mocks.add,
    remove: mocks.remove,
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { setFavoriteAction } from "@/app/favorites/actions";

beforeEach(() => {
  mocks.auth.mockReset();
  mocks.add.mockReset();
  mocks.remove.mockReset();
  mocks.revalidatePath.mockReset();
});

describe("setFavoriteAction", () => {
  it("bloqueia usuário não autenticado", async () => {
    mocks.auth.mockResolvedValue(null);

    const result = await setFavoriteAction(25, true);

    expect(result).toMatchObject({ ok: false, requiresAuth: true });
    expect(mocks.add).not.toHaveBeenCalled();
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it("usa o userId da sessão, nunca um id do cliente", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-a" } });

    const result = await setFavoriteAction(25, true);

    expect(result).toEqual({ ok: true, favorited: true });
    expect(mocks.add).toHaveBeenCalledWith("user-a", 25);
    expect(mocks.remove).not.toHaveBeenCalled();
  });

  it("remove favoritos do usuário autenticado", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-b" } });

    const result = await setFavoriteAction(6, false);

    expect(result).toEqual({ ok: true, favorited: false });
    expect(mocks.remove).toHaveBeenCalledWith("user-b", 6);
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it("rejeita ID inválido sem chamar o repositório", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-a" } });

    const result = await setFavoriteAction(0, true);

    expect(result).toEqual({ ok: false, error: "ID de Pokémon inválido." });
    expect(mocks.add).not.toHaveBeenCalled();
  });

  it("revalida as rotas afetadas após mutação", async () => {
    mocks.auth.mockResolvedValue({ user: { id: "user-a" } });

    await setFavoriteAction(25, true);

    expect(mocks.revalidatePath).toHaveBeenCalledWith("/pokemon");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/favorites");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/pokemon/25");
  });
});

import { auth } from "@/auth";
import { favoritesService } from "@/lib/db-services";

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getSessionContext(): Promise<{
  userId: string | null;
  isAuthenticated: boolean;
  favoriteIds: Set<number>;
}> {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (!userId) {
    return { userId: null, isAuthenticated: false, favoriteIds: new Set() };
  }

  const ids = await favoritesService.listIds(userId);
  return {
    userId,
    isAuthenticated: true,
    favoriteIds: new Set(ids),
  };
}

export async function getFavoriteIdsForCurrentUser(): Promise<Set<number>> {
  const context = await getSessionContext();
  return context.favoriteIds;
}

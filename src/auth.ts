import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { userService } from "@/lib/db-services";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { loginSchema, normalizeNickname } from "@/lib/validations";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Nick e senha",
      credentials: {
        nickname: { label: "Nick", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const ip = await getClientIp();
        const key = `login:${ip}:${normalizeNickname(parsed.data.nickname)}`;
        const limited = checkRateLimit(
          key,
          LOGIN_RATE_LIMIT,
          LOGIN_RATE_WINDOW_MS,
        );
        if (!limited.success) {
          return null;
        }

        const user = await userService.authenticate(parsed.data);
        return user ? { id: user.id, name: user.nickname } : null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

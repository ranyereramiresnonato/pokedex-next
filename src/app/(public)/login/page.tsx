import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { LoginForm } from "@/components/auth/login-form";
import { callbackUrlSchema } from "@/lib/validations";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua Pokédex para acessar seus favoritos.",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    registered?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/pokemon");
  }

  const params = await searchParams;
  const parsedCallback = callbackUrlSchema.safeParse(firstValue(params.callbackUrl));
  const callbackUrl = parsedCallback.success ? parsedCallback.data : "/pokemon";
  const registered = firstValue(params.registered) === "1";

  return (
    <AuthFormShell
      title="Bem-vindo de volta"
      subtitle="Entre com seu nick e senha para continuar sua coleção."
      notice={registered ? "Conta criada com sucesso! Entre para começar." : undefined}
      footer={
        <p>
          Ainda não tem conta?{" "}
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800"
          >
            Criar conta
          </Link>
        </p>
      }
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthFormShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { callbackUrlSchema } from "@/lib/validations";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta na Pokédex usando apenas nick e senha.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

function firstCallback(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  const parsed = callbackUrlSchema.safeParse(raw);
  return parsed.success ? parsed.data : "/pokemon";
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/pokemon");
  }

  const params = await searchParams;
  const callbackUrl = firstCallback(params.callbackUrl);

  return (
    <AuthFormShell
      title="Crie seu nick"
      subtitle="Sem e-mail, sem burocracia. Só um nick e uma senha segura para guardar seus favoritos."
      footer={
        <p>
          Já tem conta?{" "}
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800"
          >
            Entrar
          </Link>
        </p>
      }
    >
      <RegisterForm callbackUrl={callbackUrl} />
    </AuthFormShell>
  );
}

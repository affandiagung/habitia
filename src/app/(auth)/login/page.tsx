import { LoginForm } from "@/features/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Habitia</p>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Continue tracking your family progress.
        </p>
      </div>
      <LoginForm next={next} />
    </div>
  );
}

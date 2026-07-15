import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Habitia</p>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          One login for your whole family workspace.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}

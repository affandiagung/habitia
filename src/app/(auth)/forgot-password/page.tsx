import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Habitia</p>
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          We will send a secure reset link to your email.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

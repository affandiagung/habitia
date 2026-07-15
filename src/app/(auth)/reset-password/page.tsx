import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">Habitia</p>
        <h1 className="text-2xl font-semibold">Choose new password</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Use at least 8 characters for your new password.
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}

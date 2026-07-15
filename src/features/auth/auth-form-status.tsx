type AuthFormStatusProps = {
  error?: string;
  message?: string;
};

export function AuthFormStatus({ error, message }: AuthFormStatusProps) {
  if (!error && !message) {
    return null;
  }

  return (
    <p
      className={
        error
          ? "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          : "rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
      }
    >
      {error ?? message}
    </p>
  );
}

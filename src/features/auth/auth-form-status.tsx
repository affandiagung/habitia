import { Alert } from "@/components/ui";

type AuthFormStatusProps = {
  error?: string;
  message?: string;
};

export function AuthFormStatus({ error, message }: AuthFormStatusProps) {
  if (!error && !message) {
    return null;
  }

  return <Alert variant={error ? "danger" : "success"}>{error ?? message}</Alert>;
}

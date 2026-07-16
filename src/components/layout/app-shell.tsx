import { AppSidebar, MobileBottomNav, MobileTopBar } from "./app-navigation";

type AppShellProps = {
  children: React.ReactNode;
  email?: string;
};

export function AppShell({ children, email }: AppShellProps) {
  return (
    <div className="min-h-screen bg-sky-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="lg:flex">
        <AppSidebar email={email} />
        <div className="min-w-0 flex-1">
          <MobileTopBar email={email} />
          <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

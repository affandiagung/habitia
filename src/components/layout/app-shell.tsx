"use client";

import { AppSidebar, MobileBottomNav, MobileTopBar, type WorkspaceView } from "./app-navigation";

type AppShellProps = {
  activeView?: WorkspaceView;
  children: React.ReactNode;
  email?: string;
  onViewChange?: (view: WorkspaceView) => void;
};

export function AppShell({ activeView, children, email, onViewChange }: AppShellProps) {
  return (
    <div className="min-h-screen bg-sky-50 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="lg:flex">
        <AppSidebar activeView={activeView} email={email} onViewChange={onViewChange} />
        <div className="min-w-0 flex-1">
          <MobileTopBar email={email} />
          <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav activeView={activeView} onViewChange={onViewChange} />
    </div>
  );
}

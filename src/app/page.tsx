export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          Habitia
        </p>
        <h1 className="text-4xl font-semibold text-neutral-950 dark:text-neutral-50 sm:text-5xl">
          Family goals, habits, and daily progress in one calm workspace.
        </h1>
        <p className="mt-5 text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg">
          Project setup is ready. The product will be built incrementally with
          approval before each feature.
        </p>
      </section>
    </main>
  );
}

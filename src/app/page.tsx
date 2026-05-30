export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase text-zinc-500">
          codespace-ctrl
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">
          Codespace control backend is ready.
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          The API routes for searching and starting GitHub Codespaces are in
          place. The interactive control panel is the next implementation step.
        </p>
      </section>
    </main>
  );
}

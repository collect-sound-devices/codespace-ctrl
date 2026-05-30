type HeaderProps = {
  version: string;
};

export function Header({ version }: HeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-stone-500">
            GitHub Codespaces
          </p>
          <h1 className="text-2xl font-semibold tracking-normal text-stone-950">
            Codespace Ctrl
          </h1>
        </div>
        <span className="border border-stone-300 px-2.5 py-1 text-sm font-medium text-stone-600">
          v{version}
        </span>
      </div>
    </header>
  );
}


type HeaderProps = {
  version: string;
  releaseDate: string;
};

export function Header({ version, releaseDate }: HeaderProps) {
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
        <div className="flex flex-col items-end gap-1">
          <span className="border border-stone-300 px-2.5 py-1 text-sm font-medium text-stone-600">
            {version}
          </span>
          <span className="text-xs text-stone-500">
            {releaseDate}
          </span>
        </div>
      </div>
    </header>
  );
}


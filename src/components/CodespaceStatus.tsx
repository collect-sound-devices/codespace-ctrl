import type { CodespaceSummary } from "@/types/Codespace";

type CodespaceStatusProps = {
  codespace: CodespaceSummary | null;
  found: boolean | null;
  message: string;
  isBusy: boolean;
  canRefresh: boolean;
  onRefresh: () => void;
};

const RUNNING_STATES = new Set(["Available", "Starting"]);

export function CodespaceStatus({
  codespace,
  found,
  message,
  isBusy,
  canRefresh,
  onRefresh,
}: CodespaceStatusProps) {
  const stateLabel = codespace?.state ?? (found === false ? "Not found" : "Idle");
  const isRunning = codespace ? RUNNING_STATES.has(codespace.state) : false;

  return (
    <section className="border border-stone-300 bg-white">
      <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <StatusIcon found={found} isRunning={isRunning} />
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-stone-950">
              Status
            </h2>
            <p className="text-sm text-stone-600">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={!canRefresh || isBusy}
          className="inline-flex size-10 items-center justify-center border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-45"
          aria-label="Refresh codespace status"
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      <dl className="grid gap-px bg-stone-200 text-sm sm:grid-cols-3">
        <StatusField label="State" value={stateLabel} />
        <StatusField label="Name" value={codespace?.name ?? "-"} />
        <StatusField label="Display name" value={codespace?.displayName ?? "-"} />
      </dl>
    </section>
  );
}

function StatusField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-normal text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-stone-950">
        {value}
      </dd>
    </div>
  );
}

function StatusIcon({
  found,
  isRunning,
}: {
  found: boolean | null;
  isRunning: boolean;
}) {
  const color = found === false ? "bg-red-500" : isRunning ? "bg-emerald-500" : "bg-amber-500";

  return (
    <span
      className={`inline-flex size-3 shrink-0 ${color}`}
      aria-hidden="true"
    />
  );
}

function RefreshIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5"
      />
    </svg>
  );
}


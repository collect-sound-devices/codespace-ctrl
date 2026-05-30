import type { CodespaceSummary } from "@/types/Codespace";

type CodespaceStatusProps = {
  codespace: CodespaceSummary | null;
  found: boolean | null;
  message: string;
};

const RUNNING_STATES = new Set(["Available", "Starting"]);

export function CodespaceStatus({
  codespace,
  found,
  message,
}: CodespaceStatusProps) {
  const stateLabel = codespace?.state ?? (found === false ? "Not found" : "Idle");
  const isRunning = codespace ? RUNNING_STATES.has(codespace.state) : false;

  return (
    <section className="border border-stone-300 bg-white">
      <dl className="grid gap-px bg-stone-200 text-sm sm:grid-cols-3">
        <StatusField label="State" value={stateLabel} />
        <StatusField label="Name" value={codespace?.name ?? "-"} />
        <StatusField label="Display name" value={codespace?.displayName ?? "-"} />
      </dl>
      <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
        <StatusIcon found={found} isRunning={isRunning} />
        <p className="text-sm font-medium text-stone-700">{message}</p>
      </div>
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

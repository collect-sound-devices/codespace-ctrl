import { CodespaceControlPanel } from "@/components/CodespaceControlPanel";
import { Header } from "@/components/Header";

const VERSION = process.env.NEXT_PUBLIC_CLIENT_VERSION || "0.0.0";
const RELEASE_DATE = process.env.NEXT_PUBLIC_CLIENT_LATEST_COMMIT_DATE || "unknown";

export default function Home() {
  return (
    <>
      <Header version={VERSION} releaseDate={RELEASE_DATE} />
      <main className="flex flex-1 bg-stone-100 text-stone-950">
        <CodespaceControlPanel />
      </main>
    </>
  );
}

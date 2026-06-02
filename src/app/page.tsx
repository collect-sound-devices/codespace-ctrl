import { CodespaceControlPanel } from "@/components/CodespaceControlPanel";
import { Header } from "@/components/Header";

const VERSION = "0.0.0";

export default function Home() {
  return (
    <>
      <Header version={VERSION} />
      <main className="flex flex-1 bg-stone-100 text-stone-950">
        <CodespaceControlPanel />
      </main>
    </>
  );
}

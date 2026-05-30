import { CodespaceControlPanel } from "@/components/CodespaceControlPanel";
import { Header } from "@/components/Header";
import packageJson from "../../package.json";

export default function Home() {
  return (
    <>
      <Header version={packageJson.version} />
      <main className="flex flex-1 bg-stone-100 text-stone-950">
        <CodespaceControlPanel />
      </main>
    </>
  );
}

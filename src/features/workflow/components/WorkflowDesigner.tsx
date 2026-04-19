/**
 * Top-level shell composing the 3-column layout + bottom sandbox drawer.
 * Wraps everything in ReactFlowProvider so hooks like useReactFlow work.
 */
import { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { NodeGallery } from "./NodeGallery";
import { Canvas } from "./Canvas";
import { PropertyPanel } from "./PropertyPanel";
import { SandboxPanel } from "./SandboxPanel";

export function WorkflowDesigner() {
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<"validation" | "simulation">("validation");

  const openSandbox = (tab: "validation" | "simulation") => {
    setSandboxTab(tab);
    setSandboxOpen(true);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">T</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Tredence Studio</h1>
            <p className="text-[11px] text-muted-foreground">HR Workflow Designer</p>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <NodeGallery />
          <div className="flex flex-1 flex-col overflow-hidden">
            <Canvas onOpenSandbox={openSandbox} />
            <SandboxPanel
              open={sandboxOpen}
              tab={sandboxTab}
              onTabChange={setSandboxTab}
              onToggle={() => setSandboxOpen((v) => !v)}
            />
          </div>
          <PropertyPanel />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

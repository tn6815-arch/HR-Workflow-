/**
 * Bottom drawer with two tabs: Validation results & Simulation timeline.
 */
import { AlertTriangle, ChevronDown, ChevronUp, CircleCheck, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { useWorkflowValidation } from "../hooks/useWorkflowValidation";
import { useSimulation } from "../hooks/useSimulation";
import { cn } from "@/lib/utils";

interface SandboxPanelProps {
  open: boolean;
  tab: "validation" | "simulation";
  onTabChange: (t: "validation" | "simulation") => void;
  onToggle: () => void;
}

export function SandboxPanel({ open, tab, onTabChange, onToggle }: SandboxPanelProps) {
  const validation = useWorkflowValidation();
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);
  const simulationResult = useWorkflowStore((s) => s.simulationResult);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const runSimulation = useSimulation();

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col border-t border-border bg-card transition-all duration-300",
        open ? "h-[280px]" : "h-10",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex h-10 items-center justify-between border-b border-border px-4 text-sm hover:bg-muted/40"
      >
        <span className="font-semibold text-foreground">Sandbox & Validation</span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {validation.errors.length > 0 && (
            <span className="flex items-center gap-1 text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              {validation.errors.length} issue(s)
            </span>
          )}
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <Tabs
          value={tab}
          onValueChange={(v) => onTabChange(v as "validation" | "simulation")}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-3 w-fit">
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
          </TabsList>

          <TabsContent value="validation" className="mt-0 flex-1 overflow-y-auto p-4">
            {validation.errors.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-foreground">
                <CircleCheck className="h-5 w-5 text-success" />
                Workflow is valid — no issues detected.
              </div>
            ) : (
              <ul className="space-y-2">
                {validation.errors.map((err, idx) => (
                  <li
                    key={idx}
                    onClick={() => err.nodeId && setSelectedNode(err.nodeId)}
                    className={cn(
                      "flex items-start gap-2 rounded-lg border p-2.5 text-sm",
                      err.severity === "error"
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-warning/30 bg-warning/5",
                      err.nodeId && "cursor-pointer hover:bg-muted/40",
                    )}
                  >
                    {err.severity === "error" ? (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    )}
                    <span className="text-foreground">{err.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="simulation" className="mt-0 flex-1 overflow-y-auto p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Serializes the workflow and posts to <code className="rounded bg-muted px-1">/simulate</code>.
              </p>
              <Button size="sm" onClick={() => runSimulation()} disabled={isSimulating}>
                {isSimulating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Running…
                  </>
                ) : (
                  "Run Simulation"
                )}
              </Button>
            </div>

            {!simulationResult && !isSimulating && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No simulation run yet.
              </div>
            )}

            {simulationResult && (
              <>
                {simulationResult.errors.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {simulationResult.errors.map((err, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-sm text-foreground"
                      >
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        {err}
                      </div>
                    ))}
                  </div>
                )}
                <ol className="relative space-y-2 border-l-2 border-border pl-5">
                  {simulationResult.steps.map((step) => (
                    <li key={step.stepNumber} className="relative">
                      <span className="absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {step.stepNumber}
                      </span>
                      <div className="rounded-lg border border-border bg-background p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium text-foreground">{step.title}</div>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                            {step.nodeType}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{step.message}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          {new Date(step.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

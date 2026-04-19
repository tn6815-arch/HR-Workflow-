/**
 * Top toolbar: workflow name + actions (Validate, Simulate, Export, Import, Clear).
 */
import { useRef } from "react";
import {
  CheckCircle2,
  Download,
  PlayCircle,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { useWorkflowValidation } from "../hooks/useWorkflowValidation";
import { useSimulation } from "../hooks/useSimulation";
import { toast } from "@/hooks/use-toast";
import type { WorkflowExport } from "../types/workflow";

interface ToolbarProps {
  onOpenSandbox: (tab: "validation" | "simulation") => void;
}

function ToolButton({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "outline" | "default" | "destructive";
}) {
  return (
    <Button variant={variant} size="sm" onClick={onClick} className="gap-1.5">
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

export function Toolbar({ onOpenSandbox }: ToolbarProps) {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const exportWorkflow = useWorkflowStore((s) => s.exportWorkflow);
  const importWorkflow = useWorkflowStore((s) => s.importWorkflow);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);

  const validation = useWorkflowValidation();
  const runSimulation = useSimulation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidate = () => {
    onOpenSandbox("validation");
    if (validation.isValid && validation.errors.length === 0) {
      toast({ title: "Workflow is valid", description: "No issues detected." });
    } else {
      toast({
        title: validation.isValid ? "Validation warnings" : "Validation errors",
        description: `${validation.errors.length} issue(s) found. See sandbox panel.`,
        variant: validation.isValid ? "default" : "destructive",
      });
    }
  };

  const handleSimulate = async () => {
    onOpenSandbox("simulation");
    if (!validation.isValid) {
      toast({
        title: "Cannot simulate",
        description: "Fix validation errors first.",
        variant: "destructive",
      });
      return;
    }
    const result = await runSimulation();
    toast({
      title: result.status === "success" ? "Simulation complete" : "Simulation failed",
      description:
        result.status === "success"
          ? `${result.steps.length} step(s) executed.`
          : result.errors[0] ?? "Unknown error.",
      variant: result.status === "success" ? "default" : "destructive",
    });
  };

  const handleExport = () => {
    const data = exportWorkflow();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as WorkflowExport;
      importWorkflow(parsed);
      toast({ title: "Workflow imported", description: parsed.workflowName });
    } catch {
      toast({ title: "Import failed", description: "Invalid JSON.", variant: "destructive" });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
      <Input
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="h-9 max-w-xs border-transparent bg-transparent text-sm font-semibold focus-visible:border-input focus-visible:bg-background"
      />
      <div className="ml-auto flex items-center gap-2">
        <ToolButton icon={CheckCircle2} label="Validate" onClick={handleValidate} />
        <ToolButton
          icon={PlayCircle}
          label={isSimulating ? "Running…" : "Simulate"}
          onClick={handleSimulate}
          variant="default"
        />
        <ToolButton icon={Download} label="Export" onClick={handleExport} />
        <ToolButton icon={Upload} label="Import" onClick={handleImportClick} />
        <ToolButton icon={Trash2} label="Clear" onClick={clearWorkflow} />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import { useAutomations } from "../../hooks/useAutomations";
import type { AutomatedNodeData } from "../../types/workflow";

export function AutomatedForm({ nodeId, data }: { nodeId: string; data: AutomatedNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  const { data: automations, isLoading } = useAutomations();
  const selectedAction = automations?.find((a) => a.id === data.actionId);

  const handleParamChange = (key: string, value: string) => {
    update<AutomatedNodeData>(nodeId, { params: { ...data.params, [key]: value } });
  };

  const handleActionChange = (id: string) => {
    // Reset params when switching action
    update<AutomatedNodeData>(nodeId, { actionId: id, params: {} });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="auto-title">Title</Label>
        <Input
          id="auto-title"
          value={data.title}
          onChange={(e) => update<AutomatedNodeData>(nodeId, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Action</Label>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading actions…
          </div>
        ) : (
          <Select value={data.actionId ?? ""} onValueChange={handleActionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an action" />
            </SelectTrigger>
            <SelectContent>
              {automations?.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-3">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Action Parameters
          </div>
          {selectedAction.params.map((p) => (
            <div key={p} className="space-y-1.5">
              <Label htmlFor={`param-${p}`} className="text-xs">
                {p}
              </Label>
              <Input
                id={`param-${p}`}
                value={data.params[p] ?? ""}
                onChange={(e) => handleParamChange(p, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

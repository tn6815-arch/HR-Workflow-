import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import type { StartNodeData } from "../../types/workflow";
import { KeyValueEditor } from "./KeyValueEditor";

export function StartForm({ nodeId, data }: { nodeId: string; data: StartNodeData }) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="start-title">Start Title</Label>
        <Input
          id="start-title"
          value={data.title}
          onChange={(e) => updateNodeData<StartNodeData>(nodeId, { title: e.target.value })}
        />
      </div>
      <KeyValueEditor
        label="Metadata"
        value={data.metadata}
        onChange={(metadata) => updateNodeData<StartNodeData>(nodeId, { metadata })}
      />
    </div>
  );
}

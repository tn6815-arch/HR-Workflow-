import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import type { EndNodeData } from "../../types/workflow";

export function EndForm({ nodeId, data }: { nodeId: string; data: EndNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="end-title">Title</Label>
        <Input
          id="end-title"
          value={data.title}
          onChange={(e) => update<EndNodeData>(nodeId, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-message">End Message</Label>
        <Textarea
          id="end-message"
          rows={3}
          value={data.endMessage}
          onChange={(e) => update<EndNodeData>(nodeId, { endMessage: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
        <div className="space-y-0.5">
          <Label htmlFor="end-summary" className="cursor-pointer">
            Summary flag
          </Label>
          <p className="text-xs text-muted-foreground">
            Marks this end as a summary terminator.
          </p>
        </div>
        <Switch
          id="end-summary"
          checked={data.isSummary}
          onCheckedChange={(v) => update<EndNodeData>(nodeId, { isSummary: v })}
        />
      </div>
    </div>
  );
}

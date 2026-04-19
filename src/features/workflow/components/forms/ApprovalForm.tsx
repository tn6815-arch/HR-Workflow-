import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import type { ApprovalNodeData, ApproverRole } from "../../types/workflow";

const ROLES: ApproverRole[] = ["Manager", "HRBP", "Director"];

export function ApprovalForm({ nodeId, data }: { nodeId: string; data: ApprovalNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="approval-title">Title</Label>
        <Input
          id="approval-title"
          value={data.title}
          onChange={(e) => update<ApprovalNodeData>(nodeId, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Approver Role</Label>
        <Select
          value={data.approverRole}
          onValueChange={(v) => update<ApprovalNodeData>(nodeId, { approverRole: v as ApproverRole })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="approval-threshold">Auto-approve Threshold</Label>
        <Input
          id="approval-threshold"
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(e) =>
            update<ApprovalNodeData>(nodeId, { autoApproveThreshold: Number(e.target.value) || 0 })
          }
        />
      </div>
    </div>
  );
}

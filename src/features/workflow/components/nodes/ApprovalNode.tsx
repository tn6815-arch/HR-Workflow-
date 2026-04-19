import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { ShieldCheck } from "lucide-react";
import { NodeShell } from "./NodeShell";
import { useWorkflowValidation } from "../../hooks/useWorkflowValidation";
import type { HRNode } from "../../types/workflow";

const ApprovalNodeInner = ({ id, data, selected }: NodeProps<HRNode>) => {
  const { invalidNodeIds } = useWorkflowValidation();
  if (data.type !== "approval") return null;
  return (
    <NodeShell
      icon={ShieldCheck}
      title={data.title}
      subtitle="Approval"
      accentClass="text-node-approval border-node-approval/40"
      accentSoftClass="bg-node-approval-soft"
      selected={selected}
      invalid={invalidNodeIds.has(id)}
      summary={
        <div className="space-y-0.5">
          <div>Approver: {data.approverRole}</div>
          <div>Auto-approve ≥ {data.autoApproveThreshold}</div>
        </div>
      }
    />
  );
};
export const ApprovalNode = memo(ApprovalNodeInner);

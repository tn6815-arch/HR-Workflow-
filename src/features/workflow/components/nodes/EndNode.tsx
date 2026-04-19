import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { CircleStop } from "lucide-react";
import { NodeShell } from "./NodeShell";
import { useWorkflowValidation } from "../../hooks/useWorkflowValidation";
import type { HRNode } from "../../types/workflow";

const EndNodeInner = ({ id, data, selected }: NodeProps<HRNode>) => {
  const { invalidNodeIds } = useWorkflowValidation();
  if (data.type !== "end") return null;
  return (
    <NodeShell
      icon={CircleStop}
      title={data.title}
      subtitle={data.isSummary ? "End • Summary" : "End"}
      accentClass="text-node-end border-node-end/40"
      accentSoftClass="bg-node-end-soft"
      selected={selected}
      invalid={invalidNodeIds.has(id)}
      hasSource={false}
      summary={data.endMessage || "Workflow complete"}
    />
  );
};
export const EndNode = memo(EndNodeInner);

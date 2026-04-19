import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Play } from "lucide-react";
import { NodeShell } from "./NodeShell";
import { useWorkflowValidation } from "../../hooks/useWorkflowValidation";
import type { HRNode } from "../../types/workflow";

const StartNodeInner = ({ id, data, selected }: NodeProps<HRNode>) => {
  const { invalidNodeIds } = useWorkflowValidation();
  if (data.type !== "start") return null;
  return (
    <NodeShell
      icon={Play}
      title={data.title}
      subtitle="Start"
      accentClass="text-node-start border-node-start/40"
      accentSoftClass="bg-node-start-soft"
      selected={selected}
      invalid={invalidNodeIds.has(id)}
      hasTarget={false}
      summary={
        data.metadata.length > 0 ? `${data.metadata.length} metadata field(s)` : "Workflow entry point"
      }
    />
  );
};
export const StartNode = memo(StartNodeInner);

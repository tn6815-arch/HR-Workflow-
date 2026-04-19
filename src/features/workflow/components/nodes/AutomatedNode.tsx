import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";
import { NodeShell } from "./NodeShell";
import { useWorkflowValidation } from "../../hooks/useWorkflowValidation";
import { getAutomationById } from "../../api/automations";
import type { HRNode } from "../../types/workflow";

const AutomatedNodeInner = ({ id, data, selected }: NodeProps<HRNode>) => {
  const { invalidNodeIds } = useWorkflowValidation();
  if (data.type !== "automated") return null;
  const action = getAutomationById(data.actionId);
  return (
    <NodeShell
      icon={Bot}
      title={data.title}
      subtitle="Automated Step"
      accentClass="text-node-automated border-node-automated/40"
      accentSoftClass="bg-node-automated-soft"
      selected={selected}
      invalid={invalidNodeIds.has(id)}
      summary={action ? `Action: ${action.label}` : "No action selected"}
    />
  );
};
export const AutomatedNode = memo(AutomatedNodeInner);

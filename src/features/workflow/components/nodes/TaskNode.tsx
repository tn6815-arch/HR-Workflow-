import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { ClipboardList } from "lucide-react";
import { NodeShell } from "./NodeShell";
import { useWorkflowValidation } from "../../hooks/useWorkflowValidation";
import type { HRNode } from "../../types/workflow";

const TaskNodeInner = ({ id, data, selected }: NodeProps<HRNode>) => {
  const { invalidNodeIds } = useWorkflowValidation();
  if (data.type !== "task") return null;
  return (
    <NodeShell
      icon={ClipboardList}
      title={data.title}
      subtitle="Task"
      accentClass="text-node-task border-node-task/40"
      accentSoftClass="bg-node-task-soft"
      selected={selected}
      invalid={invalidNodeIds.has(id)}
      summary={
        <div className="space-y-0.5">
          <div>👤 {data.assignee || "Unassigned"}</div>
          {data.dueDate && <div>📅 Due {data.dueDate}</div>}
        </div>
      }
    />
  );
};
export const TaskNode = memo(TaskNodeInner);

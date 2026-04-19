/**
 * Right panel: routes to the correct property form based on selected node type.
 */
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { StartForm } from "./forms/StartForm";
import { TaskForm } from "./forms/TaskForm";
import { ApprovalForm } from "./forms/ApprovalForm";
import { AutomatedForm } from "./forms/AutomatedForm";
import { EndForm } from "./forms/EndForm";

const TYPE_LABELS: Record<string, string> = {
  start: "Start Node",
  task: "Task Node",
  approval: "Approval Node",
  automated: "Automated Step",
  end: "End Node",
};

export function PropertyPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const node = useWorkflowStore((s) =>
    selectedNodeId ? s.nodes.find((n) => n.id === selectedNodeId) ?? null : null,
  );
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {node ? TYPE_LABELS[node.data.type] : "Select a node to edit"}
          </p>
        </div>
        {node && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => deleteNode(node.id)}
            title="Delete node"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!node && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Nothing selected</p>
            <p className="mt-1 text-xs">
              Drag a node from the left, then click it to configure its properties.
            </p>
          </div>
        )}
        {node?.data.type === "start" && <StartForm nodeId={node.id} data={node.data} />}
        {node?.data.type === "task" && <TaskForm nodeId={node.id} data={node.data} />}
        {node?.data.type === "approval" && <ApprovalForm nodeId={node.id} data={node.data} />}
        {node?.data.type === "automated" && <AutomatedForm nodeId={node.id} data={node.data} />}
        {node?.data.type === "end" && <EndForm nodeId={node.id} data={node.data} />}
      </div>
    </aside>
  );
}

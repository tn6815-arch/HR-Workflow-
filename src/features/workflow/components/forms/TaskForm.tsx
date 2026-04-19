import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflowStore } from "../../store/useWorkflowStore";
import type { TaskNodeData } from "../../types/workflow";
import { KeyValueEditor } from "./KeyValueEditor";

export function TaskForm({ nodeId, data }: { nodeId: string; data: TaskNodeData }) {
  const update = useWorkflowStore((s) => s.updateNodeData);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="task-title"
          value={data.title}
          onChange={(e) => update<TaskNodeData>(nodeId, { title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-desc">Description</Label>
        <Textarea
          id="task-desc"
          rows={3}
          value={data.description}
          onChange={(e) => update<TaskNodeData>(nodeId, { description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-assignee">Assignee</Label>
        <Input
          id="task-assignee"
          placeholder="e.g. Jane Doe"
          value={data.assignee}
          onChange={(e) => update<TaskNodeData>(nodeId, { assignee: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-due">Due Date</Label>
        <Input
          id="task-due"
          type="date"
          value={data.dueDate}
          onChange={(e) => update<TaskNodeData>(nodeId, { dueDate: e.target.value })}
        />
      </div>
      <KeyValueEditor
        label="Custom Fields"
        value={data.customFields}
        onChange={(customFields) => update<TaskNodeData>(nodeId, { customFields })}
      />
    </div>
  );
}

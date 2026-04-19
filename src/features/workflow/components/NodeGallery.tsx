/**
 * Left sidebar: draggable cards for each node type.
 */
import { Bot, CircleStop, ClipboardList, GripVertical, Play, ShieldCheck } from "lucide-react";
import { useDnD } from "../hooks/useDnD";
import { useWorkflowStore } from "../store/useWorkflowStore";
import type { NodeType } from "../types/workflow";
import { cn } from "@/lib/utils";

interface GalleryItem {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  soft: string;
}

const ITEMS: GalleryItem[] = [
  {
    type: "start",
    label: "Start",
    description: "Workflow entry point",
    icon: Play,
    accent: "text-node-start",
    soft: "bg-node-start-soft",
  },
  {
    type: "task",
    label: "Task",
    description: "Human task / step",
    icon: ClipboardList,
    accent: "text-node-task",
    soft: "bg-node-task-soft",
  },
  {
    type: "approval",
    label: "Approval",
    description: "Manager / HR approval",
    icon: ShieldCheck,
    accent: "text-node-approval",
    soft: "bg-node-approval-soft",
  },
  {
    type: "automated",
    label: "Automated Step",
    description: "System-triggered action",
    icon: Bot,
    accent: "text-node-automated",
    soft: "bg-node-automated-soft",
  },
  {
    type: "end",
    label: "End",
    description: "Workflow completion",
    icon: CircleStop,
    accent: "text-node-end",
    soft: "bg-node-end-soft",
  },
];

export function NodeGallery() {
  const { onDragStart } = useDnD();
  const hasStart = useWorkflowStore((s) => s.nodes.some((n) => n.data.type === "start"));

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-sm font-semibold text-foreground">Node Gallery</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Drag nodes onto the canvas</p>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {ITEMS.map((item) => {
          const disabled = item.type === "start" && hasStart;
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable={!disabled}
              onDragStart={(e) => !disabled && onDragStart(e, item.type)}
              className={cn(
                "group flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all",
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-grab hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md active:cursor-grabbing",
              )}
              title={disabled ? "Only one Start node allowed" : `Drag to add ${item.label}`}
            >
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", item.soft)}>
                <Icon className={cn("h-5 w-5", item.accent)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="truncate text-xs text-muted-foreground">{item.description}</div>
              </div>
              <GripVertical className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
            </div>
          );
        })}
      </div>
      <div className="border-t border-border p-3 text-[11px] leading-relaxed text-muted-foreground">
        <strong></strong> Click a node to edit its properties on the
        right. Press <kbd className="rounded border bg-background px-1">Del</kbd> to remove.
      </div>
    </aside>
  );
}

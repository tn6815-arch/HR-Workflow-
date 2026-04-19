/**
 * Shared visual shell for every custom HR node.
 * Renders the icon header, title, summary lines, validation ring, and handles.
 */
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NodeShellProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  summary?: React.ReactNode;
  /** tailwind text/border accent class, e.g. "text-node-task border-node-task" */
  accentClass: string;
  /** tailwind soft-bg class for the icon chip, e.g. "bg-node-task-soft" */
  accentSoftClass: string;
  selected?: boolean;
  invalid?: boolean;
  hasSource?: boolean;
  hasTarget?: boolean;
}

const NodeShellInner = ({
  icon: Icon,
  title,
  subtitle,
  summary,
  accentClass,
  accentSoftClass,
  selected,
  invalid,
  hasSource = true,
  hasTarget = true,
}: NodeShellProps) => {
  return (
    <div
      className={cn(
        "relative w-[220px] rounded-xl border bg-card shadow-sm transition-all",
        accentClass.split(" ").find((c) => c.startsWith("border-")) ?? "border-border",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-canvas",
        invalid && "border-destructive border-dashed",
      )}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="!h-2.5 !w-2.5 !border-2 !border-background !bg-foreground/60"
        />
      )}
      <div className="flex items-start gap-2.5 p-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            accentSoftClass,
          )}
        >
          <Icon className={cn("h-5 w-5", accentClass.split(" ").find((c) => c.startsWith("text-")))} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-foreground">{title || "Untitled"}</div>
          {subtitle && (
            <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
        {invalid && (
          <AlertTriangle
            className="h-4 w-4 shrink-0 text-destructive"
            aria-label="Validation issue"
          />
        )}
      </div>
      {summary && (
        <div className="border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">
          {summary}
        </div>
      )}
      {hasSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2.5 !w-2.5 !border-2 !border-background !bg-foreground/60"
        />
      )}
    </div>
  );
};

export const NodeShell = memo(NodeShellInner);

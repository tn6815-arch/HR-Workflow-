/**
 * Static validation of the workflow graph.
 * Returns errors keyed by node where applicable so the canvas can highlight them.
 */
import { useMemo } from "react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import type { HREdge, HRNode, ValidationError } from "../types/workflow";

function detectCycle(nodes: HRNode[], edges: HREdge[]): boolean {
  const adj = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  });
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map<string, number>(nodes.map((n) => [n.id, WHITE]));
  const dfs = (id: string): boolean => {
    color.set(id, GRAY);
    for (const next of adj.get(id) ?? []) {
      const c = color.get(next) ?? WHITE;
      if (c === GRAY) return true;
      if (c === WHITE && dfs(next)) return true;
    }
    color.set(id, BLACK);
    return false;
  };
  for (const n of nodes) if ((color.get(n.id) ?? WHITE) === WHITE && dfs(n.id)) return true;
  return false;
}

export function useWorkflowValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  return useMemo(() => {
    const errors: ValidationError[] = [];
    const invalidNodeIds = new Set<string>();

    const startNodes = nodes.filter((n) => n.data.type === "start");
    const endNodes = nodes.filter((n) => n.data.type === "end");

    if (nodes.length === 0) {
      return { errors, invalidNodeIds, isValid: true };
    }

    if (startNodes.length === 0) {
      errors.push({ message: "Workflow is missing a Start node.", severity: "error" });
    }
    if (startNodes.length > 1) {
      errors.push({
        message: `Only one Start node is allowed (found ${startNodes.length}).`,
        severity: "error",
      });
      startNodes.forEach((n) => invalidNodeIds.add(n.id));
    }
    if (endNodes.length === 0) {
      errors.push({ message: "Workflow needs at least one End node.", severity: "error" });
    }

    const incoming = new Map<string, number>();
    const outgoing = new Map<string, number>();
    edges.forEach((e) => {
      incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1);
      outgoing.set(e.source, (outgoing.get(e.source) ?? 0) + 1);
    });

    nodes.forEach((n) => {
      const inC = incoming.get(n.id) ?? 0;
      const outC = outgoing.get(n.id) ?? 0;

      if (n.data.type === "start") {
        if (inC > 0) {
          errors.push({
            nodeId: n.id,
            message: `Start node "${n.data.title}" cannot have incoming connections.`,
            severity: "error",
          });
          invalidNodeIds.add(n.id);
        }
        if (outC === 0 && nodes.length > 1) {
          errors.push({
            nodeId: n.id,
            message: `Start node "${n.data.title}" has no outgoing connection.`,
            severity: "warning",
          });
          invalidNodeIds.add(n.id);
        }
      } else if (n.data.type === "end") {
        if (outC > 0) {
          errors.push({
            nodeId: n.id,
            message: `End node "${n.data.title}" cannot have outgoing connections.`,
            severity: "error",
          });
          invalidNodeIds.add(n.id);
        }
        if (inC === 0) {
          errors.push({
            nodeId: n.id,
            message: `End node "${n.data.title}" has no incoming connection.`,
            severity: "warning",
          });
          invalidNodeIds.add(n.id);
        }
      } else {
        if (inC === 0 && outC === 0) {
          errors.push({
            nodeId: n.id,
            message: `"${n.data.title}" is disconnected from the workflow.`,
            severity: "warning",
          });
          invalidNodeIds.add(n.id);
        }
      }

      if (n.data.type === "task" && !n.data.title.trim()) {
        errors.push({ nodeId: n.id, message: "Task node is missing a title.", severity: "error" });
        invalidNodeIds.add(n.id);
      }
      if (n.data.type === "automated" && !n.data.actionId) {
        errors.push({
          nodeId: n.id,
          message: `Automated node "${n.data.title}" has no action selected.`,
          severity: "error",
        });
        invalidNodeIds.add(n.id);
      }
    });

    if (detectCycle(nodes, edges)) {
      errors.push({ message: "Workflow contains a cycle.", severity: "error" });
    }

    const isValid = errors.every((e) => e.severity !== "error");
    return { errors, invalidNodeIds, isValid };
  }, [nodes, edges]);
}

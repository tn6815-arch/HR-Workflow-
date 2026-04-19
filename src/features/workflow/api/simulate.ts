/**
 * Mock POST /simulate endpoint.
 * Accepts a workflow graph (nodes + edges) and walks it from the Start node,
 * producing a step-by-step execution log. Detects cycles and dead-ends.
 */
import type {
  HREdge,
  HRNode,
  SimulationResult,
  SimulationStep,
  WorkflowNodeData,
} from "../types/workflow";
import { getAutomationById } from "./automations";

const STEP_DELAY_MS = 80;

function describeStep(data: WorkflowNodeData): string {
  switch (data.type) {
    case "start":
      return `Workflow started: "${data.title}".`;
    case "task": {
      const who = data.assignee || "unassigned";
      const due = data.dueDate ? ` (due ${data.dueDate})` : "";
      return `Task "${data.title}" assigned to ${who}${due}.`;
    }
    case "approval":
      return `Awaiting approval from ${data.approverRole} (auto-approve threshold: ${data.autoApproveThreshold}).`;
    case "automated": {
      const action = getAutomationById(data.actionId);
      const label = action?.label ?? "no action selected";
      return `Executing automated action: ${label}.`;
    }
    case "end":
      return data.endMessage || `Workflow completed: "${data.title}".`;
  }
}

export async function simulateWorkflow(
  nodes: HRNode[],
  edges: HREdge[],
): Promise<SimulationResult> {
  const errors: string[] = [];
  const steps: SimulationStep[] = [];

  const startNodes = nodes.filter((n) => n.data.type === "start");
  const endNodes = nodes.filter((n) => n.data.type === "end");

  if (startNodes.length === 0) errors.push("Workflow must contain a Start node.");
  if (startNodes.length > 1) errors.push("Workflow must contain exactly one Start node.");
  if (endNodes.length === 0) errors.push("Workflow must contain at least one End node.");

  if (errors.length > 0) return { status: "failed", steps, errors };

  // Adjacency map
  const outgoing = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!outgoing.has(e.source)) outgoing.set(e.source, []);
    outgoing.get(e.source)!.push(e.target);
  });

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();
  const queue: string[] = [startNodes[0].id];
  let stepNumber = 1;
  let reachedEnd = false;

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) {
      errors.push(`Cycle detected at node "${nodeMap.get(id)?.data.title ?? id}".`);
      return { status: "failed", steps, errors };
    }
    visited.add(id);
    const node = nodeMap.get(id);
    if (!node) continue;

    await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));

    steps.push({
      stepNumber: stepNumber++,
      nodeId: node.id,
      nodeType: node.data.type,
      title: node.data.title,
      message: describeStep(node.data),
      status: "success",
      timestamp: new Date().toISOString(),
    });

    if (node.data.type === "end") {
      reachedEnd = true;
      continue;
    }

    const next = outgoing.get(id) ?? [];
    if (next.length === 0) {
      errors.push(`Dead-end at node "${node.data.title}" (no outgoing connection).`);
      return { status: "failed", steps, errors };
    }
    next.forEach((n) => queue.push(n));
  }

  if (!reachedEnd) errors.push("Workflow never reached an End node.");

  return {
    status: errors.length === 0 ? "success" : "failed",
    steps,
    errors,
  };
}

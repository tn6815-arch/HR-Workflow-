/**
 * Strict type definitions for the HR Workflow Designer.
 * Uses a discriminated union (`type` field) so each node's `data` is exhaustively type-checked.
 */
import type { Node, Edge } from "@xyflow/react";

export type NodeType = "start" | "task" | "approval" | "automated" | "end";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

interface BaseNodeData extends Record<string, unknown> {
  title: string;
}

export interface StartNodeData extends BaseNodeData {
  type: "start";
  metadata: KeyValuePair[];
}

export interface TaskNodeData extends BaseNodeData {
  type: "task";
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
}

export type ApproverRole = "Manager" | "HRBP" | "Director";

export interface ApprovalNodeData extends BaseNodeData {
  type: "approval";
  approverRole: ApproverRole;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: "automated";
  actionId: string | null;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: "end";
  endMessage: string;
  isSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type HRNode = Node<WorkflowNodeData>;
export type HREdge = Edge;

export interface Automation {
  id: string;
  label: string;
  params: string[];
}

export type SimulationStatus = "success" | "skipped" | "failed";

export interface SimulationStep {
  stepNumber: number;
  nodeId: string;
  nodeType: NodeType;
  title: string;
  message: string;
  status: SimulationStatus;
  timestamp: string;
}

export interface SimulationResult {
  status: "success" | "failed";
  steps: SimulationStep[];
  errors: string[];
}

export type ValidationSeverity = "error" | "warning";

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: ValidationSeverity;
}

export interface WorkflowExport {
  workflowName: string;
  nodes: HRNode[];
  edges: HREdge[];
  exportedAt: string;
}

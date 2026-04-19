/**
 * Zustand store for the HR Workflow Designer.
 *
 * Design notes:
 * - `updateNodeData` shallow-merges into the target node's `data` only, so
 *   editing one node does NOT cause sibling nodes (memoized) to re-render.
 * - All React Flow types are imported as `type` to avoid Vite bundling issues.
 */
import { create } from "zustand";
import type {
  Connection,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
  HREdge,
  HRNode,
  NodeType,
  SimulationResult,
  ValidationError,
  WorkflowExport,
  WorkflowNodeData,
} from "../types/workflow";

const uid = () => Math.random().toString(36).slice(2, 10);

function makeDefaultData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case "start":
      return { type: "start", title: "Start", metadata: [] };
    case "task":
      return {
        type: "task",
        title: "New Task",
        description: "",
        assignee: "",
        dueDate: "",
        customFields: [],
      };
    case "approval":
      return {
        type: "approval",
        title: "Approval",
        approverRole: "Manager",
        autoApproveThreshold: 0,
      };
    case "automated":
      return { type: "automated", title: "Automated Step", actionId: null, params: {} };
    case "end":
      return { type: "end", title: "End", endMessage: "Workflow complete.", isSummary: false };
  }
}

interface WorkflowState {
  workflowName: string;
  nodes: HRNode[];
  edges: HREdge[];
  selectedNodeId: string | null;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;

  setWorkflowName: (name: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: <T extends WorkflowNodeData>(nodeId: string, partial: Partial<T>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (id: string | null) => void;
  clearWorkflow: () => void;
  exportWorkflow: () => WorkflowExport;
  importWorkflow: (data: WorkflowExport) => void;
  setSimulationResult: (r: SimulationResult | null) => void;
  setIsSimulating: (v: boolean) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowName: "Untitled Workflow",
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationResult: null,
  isSimulating: false,

  setWorkflowName: (name) => set({ workflowName: name }),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) as HRNode[] }),

  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) => {
    const { nodes, edges } = get();
    const target = nodes.find((n) => n.id === connection.target);
    const source = nodes.find((n) => n.id === connection.source);
    // Constraint: Start node cannot have incoming edges; End node cannot have outgoing edges.
    if (target?.data.type === "start") return;
    if (source?.data.type === "end") return;
    set({ edges: addEdge({ ...connection, animated: true }, edges) });
  },

  addNode: (type, position) => {
    const { nodes } = get();
    // Constraint: only one Start node allowed.
    if (type === "start" && nodes.some((n) => n.data.type === "start")) return;
    const id = `${type}_${uid()}`;
    const newNode: HRNode = {
      id,
      type,
      position,
      data: makeDefaultData(type),
    };
    set({ nodes: [...nodes, newNode], selectedNodeId: id });
  },

  updateNodeData: (nodeId, partial) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...partial } as WorkflowNodeData } : n,
      ),
    }),

  deleteNode: (nodeId) =>
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    }),

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  clearWorkflow: () =>
    set({ nodes: [], edges: [], selectedNodeId: null, simulationResult: null }),

  exportWorkflow: () => ({
    workflowName: get().workflowName,
    nodes: get().nodes,
    edges: get().edges,
    exportedAt: new Date().toISOString(),
  }),

  importWorkflow: (data) =>
    set({
      workflowName: data.workflowName ?? "Imported Workflow",
      nodes: data.nodes ?? [],
      edges: data.edges ?? [],
      selectedNodeId: null,
      simulationResult: null,
    }),

  setSimulationResult: (r) => set({ simulationResult: r }),
  setIsSimulating: (v) => set({ isSimulating: v }),
}));

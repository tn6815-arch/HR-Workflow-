import { describe, it, expect } from "vitest";
import { useWorkflowStore } from "@/features/workflow/store/useWorkflowStore";

describe("Workflow Store", () => {
  it("should initialize with empty nodes and edges", () => {
    const store = useWorkflowStore.getState();
    store.clearWorkflow();
    
    const { nodes, edges } = useWorkflowStore.getState();
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  it("should add a node to the workflow", () => {
    const store = useWorkflowStore.getState();
    store.clearWorkflow();
    
    store.addNode("start", { type: "start", title: "Begin" }, { x: 100, y: 100 });
    const { nodes } = useWorkflowStore.getState();
    
    expect(nodes.length).toBe(1);
    expect(nodes[0].data.type).toBe("start");
  });
});

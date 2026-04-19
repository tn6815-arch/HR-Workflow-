import { useCallback } from "react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { simulateWorkflow } from "../api/simulate";

export function useSimulation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setSimulationResult = useWorkflowStore((s) => s.setSimulationResult);
  const setIsSimulating = useWorkflowStore((s) => s.setIsSimulating);

  return useCallback(async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const result = await simulateWorkflow(nodes, edges);
      setSimulationResult(result);
      return result;
    } finally {
      setIsSimulating(false);
    }
  }, [nodes, edges, setSimulationResult, setIsSimulating]);
}

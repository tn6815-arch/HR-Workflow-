/**
 * Drag-and-drop wiring between the Node Gallery and the React Flow canvas.
 * Uses HTML5 dataTransfer; canvas converts screen coords to flow coords.
 */
import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { useWorkflowStore } from "../store/useWorkflowStore";
import type { NodeType } from "../types/workflow";

const MIME = "application/x-hr-node-type";

export function useDnD() {
  const { screenToFlowPosition } = useReactFlow();
  const addNode = useWorkflowStore((s) => s.addNode);

  const onDragStart = useCallback((e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData(MIME, type);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData(MIME) as NodeType;
      if (!type) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(type, position);
    },
    [screenToFlowPosition, addNode],
  );

  return { onDragStart, onDragOver, onDrop };
}

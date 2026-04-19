/**
 * The React Flow canvas + toolbar.
 */
import { useCallback } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { useDnD } from "../hooks/useDnD";
import { nodeTypes } from "./nodes/nodeTypes";
import { Toolbar } from "./Toolbar";

interface CanvasProps {
  onOpenSandbox: (tab: "validation" | "simulation") => void;
}

export function Canvas({ onOpenSandbox }: CanvasProps) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);
  const { onDragOver, onDrop } = useDnD();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => setSelectedNode(node.id),
    [setSelectedNode],
  );
  const handlePaneClick = useCallback(() => setSelectedNode(null), [setSelectedNode]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <Toolbar onOpenSandbox={onOpenSandbox} />
      <div className="relative flex-1 bg-canvas" onDragOver={onDragOver} onDrop={onDrop}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} />
          <Controls className="!rounded-lg !border !border-border !bg-card !shadow-sm" />
          <MiniMap
            pannable
            zoomable
            className="!rounded-lg !border !border-border !bg-card"
            nodeColor={(n) => {
              switch (n.type) {
                case "start":
                  return "hsl(var(--node-start))";
                case "task":
                  return "hsl(var(--node-task))";
                case "approval":
                  return "hsl(var(--node-approval))";
                case "automated":
                  return "hsl(var(--node-automated))";
                case "end":
                  return "hsl(var(--node-end))";
                default:
                  return "hsl(var(--muted-foreground))";
              }
            }}
          />
        </ReactFlow>
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl border-2 border-dashed border-border bg-card/70 px-8 py-6 text-center backdrop-blur-sm">
              <p className="text-sm font-medium text-foreground">Empty canvas</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drag a node from the left to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

# HR Workflow Designer — Tredence Studio

A drag-and-drop visual workflow designer for HR processes (onboarding, leave approval, document verification), built with **React + Vite + TypeScript**, **@xyflow/react** (React Flow), **Zustand**, **Tailwind**, and **shadcn/ui**.

## ✨ Features

- **5 custom node types** — Start, Task, Approval, Automated Step, End — each with distinct colors, icons, and dynamic property forms.
- **Drag-and-drop canvas** with connections, selection, deletion (Backspace/Delete), MiniMap, Controls.
- **Contextual property panel** that swaps the right form based on the selected node.
- **Mock API layer** — `getAutomations()` (drives the Automated Step's action picker) and `simulateWorkflow()` (returns a step-by-step execution log).
- **Sandbox / Test panel** (bottom drawer) with two tabs: structural **Validation** + **Simulation timeline**.
- **Auto-validation** — exactly one Start node, no incoming edges to Start, no outgoing edges from End, disconnected nodes flagged, cycle detection, required-field checks. Invalid nodes show a red dashed border + warning icon.
- **JSON Export / Import** of the full workflow graph.

## 🏗️ Architecture

```
src/
  pages/Index.tsx                      → renders <WorkflowDesigner/>
  features/workflow/
    types/workflow.ts                  → Discriminated union for node data, Automation, SimulationStep, ValidationError
    store/useWorkflowStore.ts          → Zustand store (single source of truth)
    api/
      automations.ts                   → mock GET /automations
      simulate.ts                      → mock POST /simulate (BFS traversal)
    hooks/
      useDnD.ts                        → drag from gallery → drop on canvas
      useAutomations.ts                → React Query wrapper over mock API
      useWorkflowValidation.ts         → memoized graph validation
      useSimulation.ts                 → triggers mock simulate + stores result
    components/
      WorkflowDesigner.tsx             → 3-column shell + bottom drawer (ReactFlowProvider)
      NodeGallery.tsx                  → left sidebar (draggable cards)
      Canvas.tsx                       → React Flow + grid + MiniMap
      Toolbar.tsx                      → Validate / Simulate / Export / Import / Clear
      PropertyPanel.tsx                → right sidebar — routes to form by node type
      SandboxPanel.tsx                 → bottom drawer (Validation + Simulation tabs)
      forms/                           → one form per node type + reusable KeyValueEditor
      nodes/                           → 5 custom nodes + shared NodeShell + nodeTypes registry
```

### Data flow

```
NodeGallery ──drag──▶ Canvas (onDrop)
                           │
                           ▼
                   useWorkflowStore (Zustand)
                    ▲       ▲       ▲
                    │       │       │
            PropertyPanel  Toolbar  SandboxPanel
                    │       │       │
                    └──── api/* ────┘  (mock automations + simulate)
```

## 🎯 Design choices

- **Zustand over Context** — selector subscriptions + `updateNodeData` shallow-merges only the target node's `data`, so editing one node does not re-render siblings (custom nodes are wrapped in `memo`).
- **Discriminated union for `WorkflowNodeData`** — keyed on `type`. Forms and the simulation engine get exhaustive type checking; adding a new node type produces compiler errors at every site that needs updating.
- **Local mock API as async functions** — keeps the bundle lean (no MSW/json-server dependency) and is trivially swappable for real REST: replace the function bodies with `fetch(...)`.
- **`import type` for all React Flow types** — `Connection`, `Node`, `Edge`, `NodeChange`, `EdgeChange`, `NodeProps` — avoids Vite bundling/circular-import issues.
- **Bottom drawer for the sandbox** — keeps the canvas at full width while testing; the toolbar's Validate/Simulate buttons auto-open the relevant tab.
- **Design-token-driven styling** — node accent colors live in `index.css` as HSL CSS variables (`--node-start`, `--node-task`, …) and are exposed through `tailwind.config.ts`. No hard-coded colors in components.

## ⚙️ Validation rules

| Rule | Severity |
|---|---|
| Exactly one Start node | error |
| Start has no incoming edges | error |
| At least one End node | error |
| End has no outgoing edges | error |
| Start has at least one outgoing edge (when graph has >1 node) | warning |
| End has at least one incoming edge | warning |
| No fully-disconnected non-Start/End nodes | warning |
| Task has a non-empty title | error |
| Automated Step has an action selected | error |
| Graph contains no cycles | error |

## 🧪 Simulation

`POST /simulate` (mocked) walks the graph BFS from Start, emits one `SimulationStep` per visited node with a human-readable message (e.g. *"Task 'Collect docs' assigned to Jane (due 2025-05-01)"*), and stops on cycles, dead-ends, or when an End node is reached. The Sandbox panel renders the result as a numbered timeline.

## 🧩 Extending: adding a new node type

1. Add the type variant in `types/workflow.ts` (extend `NodeType` and the `WorkflowNodeData` union).
2. Add a default factory case in `useWorkflowStore.makeDefaultData`.
3. Create `nodes/MyNode.tsx` (using `NodeShell`) and register it in `nodes/nodeTypes.ts`.
4. Create `forms/MyForm.tsx` and route to it inside `PropertyPanel.tsx`. Add an entry in `NodeGallery` `ITEMS`.

TypeScript will surface every site that still needs updating thanks to the discriminated union.

## 📋 Assumptions

- No persistence or authentication (per case study spec). Workflow lives in memory; use Export to keep a copy.
- A single workflow at a time.
- Simulation is sequential BFS from the (single) Start node — branches are visited but not executed in parallel.
- The mock `/automations` catalogue is a static array; in production this would be a paginated REST endpoint.

## 🚀 Running

```bash
npm install
npm run dev
```

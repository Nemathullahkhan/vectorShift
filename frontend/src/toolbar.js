import { DraggableNode } from "./draggableNode";

const NODES = [
  // Original 4
  { type: "customInput", label: "Input" },
  { type: "llm", label: "LLM" },
  { type: "customOutput", label: "Output" },
  { type: "text", label: "Text" },
  // New 5
  { type: "manualTrigger", label: "Manual Trigger" },
  { type: "httpRequest", label: "HTTP Request" },
  { type: "math", label: "Math" },
  { type: "filter", label: "Filter" },
  { type: "delay", label: "Delay" },
];

export const PipelineToolbar = () => (
  <div
    style={{
      padding: "12px 16px",
      background: "#1e293b",
      borderBottom: "1px solid #334155",
    }}
  >
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {NODES.map((node) => (
        <DraggableNode key={node.type} type={node.type} label={node.label} />
      ))}
    </div>
  </div>
);

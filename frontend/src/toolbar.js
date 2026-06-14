import {
  Cpu,
  Keyboard,
  ArrowRightCircle,
  Type,
  Cloud,
  Filter,
  Image,
  Search,
  Mail,
  GitBranch,
  Sigma,
} from "lucide-react";
import { DraggableNode } from "./draggableNode";

const NODES = [
  { type: "customInput", label: "Input", icon: Keyboard },
  { type: "llm", label: "LLM", icon: Cpu },
  { type: "customOutput", label: "Output", icon: ArrowRightCircle },
  { type: "text", label: "Text", icon: Type },

  // New nodes
  { type: "httpRequest", label: "HTTP Request", icon: Cloud },
  { type: "filter", label: "Filter", icon: Filter },
  { type: "imageGenerator", label: "Image Generator", icon: Image },
  { type: "webSearch", label: "Web Search", icon: Search },
  { type: "emailSender", label: "Email Sender", icon: Mail },
  { type: "dataTransformer", label: "Data Transformer", icon: Sigma },
  { type: "condition", label: "Condition", icon: GitBranch },
];

export const PipelineToolbar = () => (
  <div className="rounded-xl border border-border bg-card p-4 shadow-card">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted">
          Node palette
        </p>
        <p className="text-sm text-foreground">
          Drag any node into the canvas.
        </p>
      </div>
    </div>
    <div className="flex flex-wrap gap-3">
      {NODES.map((node) => (
        <DraggableNode
          key={node.type}
          type={node.type}
          label={node.label}
          Icon={node.icon}
        />
      ))}
    </div>
  </div>
);

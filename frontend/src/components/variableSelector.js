import { useState, useEffect, useRef } from "react";

export const VariableSelector = ({
  isOpen,
  position,
  onSelect,
  onClose,
  availableNodes,
  getNodeFields,
}) => {
  const [step, setStep] = useState("node");
  const [selectedNode, setSelectedNode] = useState(null);
  const [fields, setFields] = useState([]);
  const selectorRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStep("node");
      setSelectedNode(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedNode && step === "field") {
      const nodeFields = getNodeFields(selectedNode.id);
      setFields(nodeFields);
    }
  }, [selectedNode, step, getNodeFields]);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setStep("field");
  };

  const handleFieldSelect = (field) => {
    if (selectedNode) {
      onSelect(`{{${selectedNode.name}.${field.id}}}`);
    }
  };

  const handleBack = () => {
    setStep("node");
    setSelectedNode(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        if (
          selectorRef.current &&
          document.body.contains(event.target) &&
          !selectorRef.current.contains(event.target)
        ) {
          onClose();
        }
      }, 10);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={selectorRef}
      className="absolute z-50 overflow-hidden rounded-3xl border border-border bg-card shadow-card"
      style={{
        left: position.left,
        top: position.top,
        width: position.width || 280,
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-surface">
        <span className="text-xs font-semibold text-foreground">
          {step === "node"
            ? "Select a node"
            : `Select output from ${selectedNode?.name}`}
        </span>
        {step === "field" && (
          <button
            onClick={handleBack}
            className="rounded-md px-2 py-1 text-xs font-semibold text-accent transition hover:bg-accent/10"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="max-h-[260px] overflow-y-auto">
        {step === "node" && (
          <>
            {availableNodes.length === 0 ? (
              <div className="p-5 text-center text-sm text-muted">
                No nodes with outputs available
              </div>
            ) : (
              availableNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => handleNodeSelect(node)}
                  className="flex cursor-pointer items-center gap-2 border-b border-border/50 px-4 py-3 text-sm text-foreground transition hover:bg-surface"
                >
                  <span>📦</span>
                  <span>{node.name}</span>
                  <span className="text-[11px] text-muted">({node.type})</span>
                </div>
              ))
            )}
          </>
        )}

        {step === "field" && (
          <>
            {fields.length === 0 ? (
              <div className="p-5 text-center text-sm text-muted">
                No output fields available
              </div>
            ) : (
              fields.map((field) => (
                <div
                  key={field.id}
                  onClick={() => handleFieldSelect(field)}
                  className="flex cursor-pointer items-center gap-2 border-b border-border/50 px-4 py-3 text-sm text-foreground transition hover:bg-surface"
                >
                  <span>🔌</span>
                  <span>{field.label || field.id}</span>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

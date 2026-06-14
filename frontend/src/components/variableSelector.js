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

  // Click outside handler – using `click` event with a small delay
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Clear any existing timeout
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // Use a small delay to avoid interfering with ReactFlow's own drag/click
      clickTimeoutRef.current = setTimeout(() => {
        if (
          selectorRef.current &&
          !selectorRef.current.contains(event.target)
        ) {
          onClose();
        }
      }, 10);
    };

    // Use `click` event – more reliable than `mousedown`
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
      style={{
        position: "absolute",
        left: position.left,
        top: position.top,
        width: position.width || 280,
        backgroundColor: "white",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>
          {step === "node"
            ? "Select a node"
            : `Select output from ${selectedNode?.name}`}
        </span>
        {step === "field" && (
          <button
            onClick={handleBack}
            style={{
              fontSize: "11px",
              color: "#6366f1",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ← Back
          </button>
        )}
      </div>

      <div style={{ maxHeight: "260px", overflowY: "auto" }}>
        {step === "node" && (
          <>
            {availableNodes.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                No nodes with outputs available
              </div>
            ) : (
              availableNodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => handleNodeSelect(node)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "13px",
                    transition: "background-color 0.1s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f5f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span style={{ marginRight: "8px" }}>📦</span>
                  {node.name}
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      marginLeft: "8px",
                    }}
                  >
                    ({node.type})
                  </span>
                </div>
              ))
            )}
          </>
        )}

        {step === "field" && (
          <>
            {fields.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                No output fields available
              </div>
            ) : (
              fields.map((field) => (
                <div
                  key={field.id}
                  onClick={() => handleFieldSelect(field)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f1f5f9",
                    fontSize: "13px",
                    transition: "background-color 0.1s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f5f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span style={{ marginRight: "8px" }}>🔌</span>
                  {field.label || field.id}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
